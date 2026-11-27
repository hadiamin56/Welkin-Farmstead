import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Btn, Badge, Card, Empty, Modal, useToast, fmtDate, ago, bytes } from './ui.jsx';
import { Ico } from './icons.jsx';
import { api, uploadImage } from './api.js';
import { useAdmin, sectionOf } from './state.jsx';
import { Field, RootField, blank, thumbOf, MediaPicker } from './fields.jsx';
import { ROOT, SECTIONS, rootField, CATEGORIES } from '../content/schema.js';

const useLoad = (path, deps = []) => {
  const toast = useToast();
  const [data, setData] = useState(null);
  const reload = useCallback(() => api('GET', path).then(setData).catch((e) => toast(e.message, 'err')), [path, toast]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { reload(); }, [reload, ...deps]);
  return [data, reload];
};

const Head = ({ title, sub, children }) => (
  <div className="a-page-h"><div><h1>{title}</h1>{sub && <p className="a-muted">{sub}</p>}</div><div className="a-row">{children}</div></div>
);

/* ================= dashboard ================= */
export function Dashboard() {
  const { doc, user, changes } = useAdmin();
  const [health] = useLoad('health');
  const [enq] = useLoad('enquiries');
  const [media] = useLoad('media');
  const [act] = useLoad('activity');
  const warnings = [];
  if (health) {
    if (!health.jwtSecret) warnings.push('JWT_SECRET is missing — set it in the site environment variables so sign-in is secure.');
    if (!health.buildHook) warnings.push('No rebuild hook is set (optional). Without it, pages refresh from the API within seconds but the prerendered HTML only updates on the next deploy. Add BUILD_HOOK_URL to rebuild automatically on publish.');
  }
  return (
    <>
      <Head title={`Welcome back, ${user.name}`} sub="Everything on the Welkin website is managed from here."><Link className="a-btn primary" to="/admin/visual"><Ico n="eye" size={17} /> Open the visual editor</Link></Head>
      {warnings.length > 0 && <div className="a-alert warn"><Ico n="alert" size={18} /><div>{warnings.map((w) => <p key={w}>{w}</p>)}</div></div>}
      <div className="a-stats">
        <div className="a-stat"><span>Live version</span><b>{doc.published.version ? `v${doc.published.version}` : 'Built-in'}</b><small>{doc.published.publishedAt ? `Published ${ago(doc.published.publishedAt)}` : 'Nothing published from admin yet'}</small></div>
        <div className="a-stat"><span>Unpublished changes</span><b>{changes}</b><small>{changes ? 'Review and publish when ready' : 'Website is up to date'}</small></div>
        <Link className="a-stat link" to="/admin/enquiries"><span>New enquiries</span><b>{enq ? enq.counts.new : '…'}</b><small>{enq ? `${enq.counts.total} in total` : ''}</small></Link>
        <Link className="a-stat link" to="/admin/media"><span>Photos uploaded</span><b>{media ? media.media.length : '…'}</b><small>Resized automatically</small></Link>
      </div>
      <div className="a-two">
        <Card title="Edit your website">
          <div className="a-quick">
            {SECTIONS.map((s) => (
              <Link key={s.id} to={s.custom === 'products' ? '/admin/products' : `/admin/content/${s.id}`} className="a-quick-i">
                <Ico n={s.icon} size={20} /><div><b>{s.title}</b><small>{s.desc}</small></div>
              </Link>
            ))}
          </div>
        </Card>
        <Card title="Recent activity">
          {!act ? <p className="a-muted">Loading…</p> : act.activity.length === 0 ? <Empty icon="history" title="Nothing yet">Actions you take will be listed here.</Empty> : (
            <ul className="a-activity">{act.activity.slice(0, 10).map((a, i) => <li key={i}><b>{a.action}</b><span>{a.detail || ''}</span><small>{a.by} · {ago(a.at)}</small></li>)}</ul>
          )}
        </Card>
      </div>
    </>
  );
}

/* ================= content editor ================= */
export function Editor() {
  const { id } = useParams();
  const { doc, resetSection, saveErrors } = useAdmin();
  const section = SECTIONS.find((s) => s.id === id);
  if (!section) return <Navigate to="/admin" replace />;
  if (section.custom === 'products') return <Navigate to="/admin/products" replace />;
  const reset = () => { if (window.confirm(`Reset “${section.title}” to the original text? Your edits in this section will be replaced (until you publish you can still discard).`)) resetSection(section.keys); };
  return (
    <>
      <Head title={section.title} sub={section.desc}><Btn kind="ghost" icon="refresh" onClick={reset}>Reset section</Btn></Head>
      {saveErrors.length > 0 && <div className="a-alert err"><Ico n="alert" size={18} /><div><b>This can’t be saved yet:</b><ul>{saveErrors.map((e) => <li key={e}>{e}</li>)}</ul></div></div>}
      {section.keys.map((k) => <RootField key={k} f={rootField(k)} />)}
      <p className="a-muted a-foot">Changes save automatically as a draft. Nothing goes live until you press <b>Publish</b>.</p>
    </>
  );
}

/* ================= products ================= */
export function Products() {
  const { doc, change, setValue } = useAdmin();
  const toast = useToast();
  const products = doc.draft.products;
  const featured = doc.draft.home.shop.featured;
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [editing, setEditing] = useState(-1);
  const field = rootField('products');

  const rows = products.map((p, i) => ({ p, i })).filter(({ p }) => (cat === 'all' || p.cat === cat) && p.name.toLowerCase().includes(q.toLowerCase()));
  const edit = (fn) => change((d) => { const c = JSON.parse(JSON.stringify(d)); fn(c.products, c); return c; });
  const move = (i, d) => edit((a) => { const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; });
  const add = () => { edit((a) => a.push({ ...Object.fromEntries(field.item.map((s) => [s.k, blank(s)])), id: `product-${Date.now().toString(36)}`, name: 'New product', cat: 'fruit', visible: true })); setEditing(products.length); };
  const del = (i) => {
    if (!window.confirm(`Delete “${products[i].name}”?`)) return;
    edit((a, c) => { const id = a[i].id; a.splice(i, 1); c.home.shop.featured = c.home.shop.featured.filter((x) => x !== id); });
  };
  const star = (p) => {
    if (featured.includes(p.id)) setValue(['home', 'shop', 'featured'], featured.filter((x) => x !== p.id));
    else if (featured.length >= 4) toast('You can feature up to 4 products on the home page. Un-star one first.', 'err');
    else setValue(['home', 'shop', 'featured'], [...featured, p.id]);
  };
  const catName = (c) => (CATEGORIES.find((x) => x[0] === c) || [c, c])[1];

  return (
    <>
      <Head title="Products" sub="Everything shown in the farm shop. Tap the star to feature it on the home page."><Btn kind="primary" icon="plus" onClick={add} disabled={products.length >= field.max}>Add product</Btn></Head>
      <Card pad={false}>
        <div className="a-toolbar">
          <label className="a-search"><Ico n="search" size={17} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" aria-label="Search products" /></label>
          <div className="a-chips">
            {[['all', 'All'], ...CATEGORIES].map(([k, l]) => <button type="button" key={k} className={cat === k ? 'on' : ''} onClick={() => setCat(k)}>{l}</button>)}
          </div>
        </div>
        {rows.length === 0 ? <Empty icon="bag" title="No products found">Try a different search, or add a new product.</Empty> : (
          <ul className="a-prows">
            {rows.map(({ p, i }) => (
              <li key={p.id} className={p.visible ? '' : 'off'}>
                <img src={thumbOf(p.image)} alt="" />
                <div className="a-pname"><b>{p.name || 'Untitled'}</b><small>{catName(p.cat)} · {p.text}</small></div>
                <div className="a-pactions">
                  <button type="button" className={`a-icon-btn star${featured.includes(p.id) ? ' on' : ''}`} onClick={() => star(p)} aria-label={featured.includes(p.id) ? 'Remove from home page' : 'Feature on home page'} title="Feature on home page"><Ico n="star" size={17} /></button>
                  <label className="a-toggle sm" title="Show on the website"><input type="checkbox" checked={p.visible} onChange={(e) => edit((a) => { a[i].visible = e.target.checked; })} /><i /></label>
                  <button type="button" className="a-icon-btn" onClick={() => move(i, -1)} aria-label="Move up" disabled={i === 0}><Ico n="up" size={16} /></button>
                  <button type="button" className="a-icon-btn" onClick={() => move(i, 1)} aria-label="Move down" disabled={i === products.length - 1}><Ico n="down" size={16} /></button>
                  <Btn icon="settings" onClick={() => setEditing(i)}>Edit</Btn>
                  <button type="button" className="a-icon-btn danger" onClick={() => del(i)} aria-label="Delete"><Ico n="trash" size={16} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
      {editing >= 0 && products[editing] && (
        <Modal title={products[editing].name || 'Product'} onClose={() => setEditing(-1)} wide footer={<Btn kind="primary" icon="check" onClick={() => setEditing(-1)}>Done</Btn>}>
          {field.item.filter((s) => s.k !== 'id').map((s) => <Field key={s.k} f={s} path={['products', editing, s.k]} />)}
        </Modal>
      )}
    </>
  );
}

/* ================= media library ================= */
export function Media() {
  const toast = useToast();
  const [data, reload] = useLoad('media');
  const [busy, setBusy] = useState(false);
  const [edit, setEdit] = useState(null);
  const [drag, setDrag] = useState(false);

  const upload = async (files) => {
    setBusy(true);
    let n = 0;
    for (const f of files) {
      try { await uploadImage(f); n += 1; } catch (e) { toast(`${f.name}: ${e.message}`, 'err'); }
    }
    if (n) toast(`${n} photo${n === 1 ? '' : 's'} uploaded`);
    await reload(); setBusy(false);
  };
  const del = async (m) => {
    if (!window.confirm(`Delete “${m.name}” permanently?`)) return;
    try { await api('DELETE', `media/${m.id}`); toast('Deleted'); reload(); } catch (e) { toast(e.message, 'err'); }
  };
  const save = async () => {
    try { await api('PATCH', `media/${edit.id}`, { name: edit.name, alt: edit.alt }); toast('Saved'); setEdit(null); reload(); } catch (e) { toast(e.message, 'err'); }
  };
  const copy = (m) => navigator.clipboard.writeText(`/media/${m.file}`).then(() => toast('Link copied'));

  return (
    <>
      <Head title="Photos" sub="Upload photos once, then pick them anywhere on the site. They are resized for you.">
        <label className="a-btn primary"><Ico n="upload" size={17} /> {busy ? 'Uploading…' : 'Upload photos'}
          <input type="file" hidden multiple accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(e) => { upload([...e.target.files]); e.target.value = ''; }} /></label>
      </Head>
      <div className={`a-drop${drag ? ' on' : ''}`} onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); upload([...e.dataTransfer.files].filter((f) => f.type.startsWith('image/'))); }}>
        <Ico n="upload" size={26} /> Drag photos here to upload
      </div>
      {!data ? <p className="a-muted">Loading…</p> : data.media.length === 0 ? <Empty icon="image" title="No uploads yet">Photos you upload appear here. The original site photos are always available in the picker.</Empty> : (
        <div className="a-media">
          {data.media.map((m) => (
            <figure key={m.id} className="a-mcard">
              <img src={`/media/${m.small || m.file}`} alt={m.alt || ''} loading="lazy" />
              <figcaption>
                <b title={m.name}>{m.name}</b>
                <small>{m.w}×{m.h} · {bytes(m.size)}</small>
                {(m.usedPublished || m.usedDraft) ? <Badge kind="green">In use</Badge> : <Badge>Unused</Badge>}
                <div className="a-row">
                  <button type="button" className="a-icon-btn" onClick={() => copy(m)} aria-label="Copy link"><Ico n="copy" size={16} /></button>
                  <button type="button" className="a-icon-btn" onClick={() => setEdit({ ...m })} aria-label="Rename"><Ico n="settings" size={16} /></button>
                  <button type="button" className="a-icon-btn danger" onClick={() => del(m)} aria-label="Delete"><Ico n="trash" size={16} /></button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      {edit && (
        <Modal title="Photo details" onClose={() => setEdit(null)} footer={<><Btn onClick={() => setEdit(null)}>Cancel</Btn><Btn kind="primary" onClick={save}>Save</Btn></>}>
          <label className="a-field"><span className="a-label">Name</span><input className="a-input" value={edit.name} maxLength={80} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
          <label className="a-field"><span className="a-label">Description (for screen readers)</span><input className="a-input" value={edit.alt || ''} maxLength={160} onChange={(e) => setEdit({ ...edit, alt: e.target.value })} /></label>
        </Modal>
      )}
    </>
  );
}

/* ================= enquiries ================= */
export function Enquiries() {
  const toast = useToast();
  const [data, reload] = useLoad('enquiries');
  const [filter, setFilter] = useState('new');
  const list = useMemo(() => (data ? data.enquiries.filter((e) => filter === 'all' || e.status === filter) : []), [data, filter]);
  const setStatus = async (e, status) => { try { await api('PATCH', `enquiries/${e.id}`, { status }); reload(); } catch (x) { toast(x.message, 'err'); } };
  const del = async (e) => { if (!window.confirm('Delete this enquiry?')) return; try { await api('DELETE', `enquiries/${e.id}`); reload(); } catch (x) { toast(x.message, 'err'); } };
  return (
    <>
      <Head title="Enquiries" sub="Orders and visit requests sent from the website forms (visitors are then taken to WhatsApp to complete them).">
        <a className="a-btn" href="/api/admin/enquiries/export.csv"><Ico n="download" size={17} /> Export CSV</a>
        <Btn icon="refresh" onClick={reload}>Refresh</Btn>
      </Head>
      <div className="a-chips mb">
        {[['new', `New${data ? ` (${data.counts.new})` : ''}`], ['handled', 'Handled'], ['all', 'All']].map(([k, l]) => <button type="button" key={k} className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>{l}</button>)}
      </div>
      {!data ? <p className="a-muted">Loading…</p> : list.length === 0 ? <Empty icon="inbox" title="No enquiries here">When someone submits the order or farm-visit form, it appears here.</Empty> : (
        <div className="a-enqs">
          {list.map((e) => (
            <article key={e.id} className={`a-enq ${e.status}`}>
              <header>
                <Badge kind={e.type === 'visit' ? 'blue' : e.type === 'qurbani' ? 'amber' : 'green'}>{e.type === 'visit' ? 'Farm visit' : e.type === 'qurbani' ? 'Qurbani' : 'Order'}</Badge>
                <b>{e.name || e.org || 'Anonymous'}</b>
                <small title={fmtDate(e.at)}>{ago(e.at)} · {e.page || ''}</small>
              </header>
              {e.q && (
                <div className="a-qbook">
                  <p><b>{e.q.qty} × {e.q.animal}</b>{e.q.weight ? ` · ${e.q.weight}` : ''}</p>
                  <p><b>Phone:</b> <a href={`tel:${e.q.phone}`}>{e.q.phone}</a>{e.q.city ? ` · ${e.q.city}` : ''}</p>
                  {(e.q.delivery || e.q.date) && <p><b>Delivery:</b> {[e.q.delivery, e.q.date].filter(Boolean).join(' · ')}</p>}
                </div>
              )}
              {e.items.length > 0 && <p><b>Wants:</b> {e.items.join(', ')}</p>}
              {e.type === 'visit' && <p><b>Group:</b> {[e.org, e.students && `${e.students} students`, e.date].filter(Boolean).join(' · ')}</p>}
              {e.note && <p className="a-quote">{e.note}</p>}
              <footer>
                {e.status === 'new' ? <Btn icon="check" onClick={() => setStatus(e, 'handled')}>Mark handled</Btn> : <Btn kind="ghost" onClick={() => setStatus(e, 'new')}>Mark as new</Btn>}
                <button type="button" className="a-icon-btn danger" onClick={() => del(e)} aria-label="Delete"><Ico n="trash" size={16} /></button>
              </footer>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

/* ================= history ================= */
export function History() {
  const toast = useToast();
  const { load } = useAdmin();
  const [tab, setTab] = useState('versions');
  const [revs] = useLoad('revisions');
  const [act] = useLoad('activity');
  const restore = async (r) => {
    if (!window.confirm(`Load version ${r.version} into your draft? You can review it and publish, or discard.`)) return;
    try { await api('POST', `revisions/${r.id}/restore`); await load(); toast(`Version ${r.version} loaded into the draft. Review it, then Publish.`); } catch (e) { toast(e.message, 'err'); }
  };
  return (
    <>
      <Head title="History" sub="Every publish is saved so you can go back to an earlier version." />
      <div className="a-tabs"><button className={tab === 'versions' ? 'on' : ''} onClick={() => setTab('versions')}>Versions</button><button className={tab === 'activity' ? 'on' : ''} onClick={() => setTab('activity')}>Activity log</button></div>
      {tab === 'versions' && (!revs ? <p className="a-muted">Loading…</p> : revs.revisions.length === 0 ? <Empty icon="history" title="No versions yet">Each time you publish, a version is saved here.</Empty> : (
        <Card pad={false}><ul className="a-rows">{revs.revisions.map((r, i) => (
          <li key={r.id}><div><b>Version {r.version}</b> {i === 0 && <Badge kind="green">Live</Badge>}<small>{fmtDate(r.at)} · {r.by} · {r.changes} change{r.changes === 1 ? '' : 's'}{r.note ? ` — ${r.note}` : ''}</small></div>
            {i > 0 && <Btn icon="refresh" onClick={() => restore(r)}>Restore</Btn>}</li>
        ))}</ul></Card>
      ))}
      {tab === 'activity' && (!act ? <p className="a-muted">Loading…</p> : <Card pad={false}><ul className="a-rows">{act.activity.map((a, i) => <li key={i}><div><b>{a.action}</b> <span className="a-muted">{a.detail}</span><small>{a.by} · {fmtDate(a.at)}</small></div></li>)}</ul></Card>)}
    </>
  );
}

/* ================= users ================= */
export function Users() {
  const toast = useToast();
  const { user } = useAdmin();
  const [data, reload] = useLoad('users');
  const [form, setForm] = useState(null);
  const create = async () => {
    try { await api('POST', 'users', form); toast('User added'); setForm(null); reload(); } catch (e) { toast(e.message, 'err'); }
  };
  const patch = async (u, body, msg) => { try { await api('PATCH', `users/${encodeURIComponent(u.email)}`, body); toast(msg); reload(); } catch (e) { toast(e.message, 'err'); } };
  const del = async (u) => { if (!window.confirm(`Remove ${u.email}?`)) return; try { await api('DELETE', `users/${encodeURIComponent(u.email)}`); toast('User removed'); reload(); } catch (e) { toast(e.message, 'err'); } };
  const reset = (u) => { const p = window.prompt(`New password for ${u.email} (at least 10 characters):`); if (p) patch(u, { password: p }, 'Password changed'); };
  return (
    <>
      <Head title="Users" sub="People who can sign in. Editors manage content; owners can also manage users."><Btn kind="primary" icon="plus" onClick={() => setForm({ email: '', name: '', role: 'editor', password: '' })}>Add user</Btn></Head>
      <Card pad={false}>
        {!data ? <p className="a-muted pad">Loading…</p> : (
          <ul className="a-rows">{data.users.map((u) => (
            <li key={u.email}>
              <div><b>{u.name}</b> {u.email === user.email && <Badge kind="blue">You</Badge>}<small>{u.email} · added {ago(u.createdAt)}</small></div>
              <div className="a-row">
                <select className="a-input sm" value={u.role} onChange={(e) => patch(u, { role: e.target.value }, 'Role updated')} aria-label={`Role for ${u.email}`}><option value="owner">Owner</option><option value="editor">Editor</option></select>
                <Btn icon="key" onClick={() => reset(u)}>Password</Btn>
                {u.email !== user.email && <button type="button" className="a-icon-btn danger" onClick={() => del(u)} aria-label="Remove user"><Ico n="trash" size={16} /></button>}
              </div>
            </li>
          ))}</ul>
        )}
      </Card>
      {form && (
        <Modal title="Add a user" onClose={() => setForm(null)} footer={<><Btn onClick={() => setForm(null)}>Cancel</Btn><Btn kind="primary" onClick={create}>Add user</Btn></>}>
          <label className="a-field"><span className="a-label">Name</span><input className="a-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="a-field"><span className="a-label">Email</span><input className="a-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label className="a-field"><span className="a-label">Role</span><select className="a-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="editor">Editor — can edit and publish content</option><option value="owner">Owner — also manages users</option></select></label>
          <label className="a-field"><span className="a-label">Temporary password (10+ characters)</span><input className="a-input" type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        </Modal>
      )}
    </>
  );
}

/* ================= account & backup ================= */
export function Account() {
  const toast = useToast();
  const { user, load } = useAdmin();
  const [pw, setPw] = useState({ current: '', next: '' });
  const [health] = useLoad('health');
  const change = async (e) => {
    e.preventDefault();
    try { await api('POST', 'password', pw); toast('Password changed'); setPw({ current: '', next: '' }); } catch (x) { toast(x.message, 'err'); }
  };
  const importFile = async (file) => {
    try {
      const j = JSON.parse(await file.text());
      if (!window.confirm('Load this backup into your draft? Your current draft will be replaced (the live site is not touched until you publish).')) return;
      await api('POST', 'import', { content: j.draft || j.published || j.content || j });
      await load(); toast('Backup loaded into the draft. Review it, then Publish.');
    } catch (x) { toast(x.message || 'That file could not be read.', 'err'); }
  };
  const row = (ok, label, hint) => <li className={ok ? 'ok' : 'bad'}><Ico n={ok ? 'check' : 'alert'} size={17} /><div><b>{label}</b>{hint && <small>{hint}</small>}</div></li>;
  return (
    <>
      <Head title="Account & backup" sub={`Signed in as ${user.email} (${user.role}).`} />
      <div className="a-two">
        <Card title="Change your password">
          <form onSubmit={change}>
            <label className="a-field"><span className="a-label">Current password</span><input className="a-input" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} required /></label>
            <label className="a-field"><span className="a-label">New password (10+ characters)</span><input className="a-input" type="password" autoComplete="new-password" minLength={10} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} required /></label>
            <button className="a-btn primary">Change password</button>
          </form>
        </Card>
        <Card title="Backup & restore">
          <p className="a-muted">Download everything on the site (all text, products, settings) as one file. You can load it back later.</p>
          <div className="a-row">
            <a className="a-btn" href="/api/admin/export"><Ico n="download" size={17} /> Download backup</a>
            {user.role === 'owner' && <label className="a-btn"><Ico n="upload" size={17} /> Load a backup<input type="file" hidden accept="application/json,.json" onChange={(e) => { if (e.target.files[0]) importFile(e.target.files[0]); e.target.value = ''; }} /></label>}
          </div>
          <p className="a-muted a-foot">Uploaded photos are stored separately and are not part of this file.</p>
        </Card>
      </div>
      <Card title="System check">
        {!health ? <p className="a-muted">Checking…</p> : (
          <ul className="a-health">
            {row(true, `Storage: ${health.store}`, health.store === 'files' ? 'Local files (development). On Netlify this switches to Netlify Blobs automatically.' : '')}
            {row(health.jwtSecret, 'JWT_SECRET is set', health.jwtSecret ? '' : 'Required for secure sign-in. Add it in Netlify → Site settings → Environment variables.')}
            {row(health.users > 0, `${health.users} admin account${health.users === 1 ? '' : 's'}`, health.users ? '' : 'Set ADMIN_EMAIL and ADMIN_PASSWORD, then sign in once to create the owner.')}
            {row(health.buildHook, 'Automatic rebuild on publish', health.buildHook ? '' : 'Optional: set BUILD_HOOK_URL (a Netlify build hook) so the prerendered pages refresh after each publish.')}
          </ul>
        )}
      </Card>
    </>
  );
}

export { MediaPicker, sectionOf, ROOT };
