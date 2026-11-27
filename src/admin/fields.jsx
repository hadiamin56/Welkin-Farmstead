import { useEffect, useState } from 'react';
import { Ico } from './icons.jsx';
import { Btn, Modal, useToast, bytes } from './ui.jsx';
import { api, uploadImage } from './api.js';
import { useAdmin, getAt } from './state.jsx';
import { PHOTOS } from '../art/generated.js';

/* ================= image picker ================= */
const BUILT_IN = Object.keys(PHOTOS).map((f) => ({ file: `/assets/photos/${f}`, name: f.replace('.jpg', '').replace(/-/g, ' '), builtin: true }));

export function thumbOf(src) {
  if (!src) return '';
  const m = /^\/media\/([\w]+-\d+x\d+)\.(jpg|jpeg|png|webp)$/.exec(src);
  if (m) return `/media/${m[1]}-800.${m[2]}`;
  const b = /^\/assets\/photos\/([\w-]+)\.jpg$/.exec(src);
  if (b && PHOTOS[`${b[1]}.jpg`] && PHOTOS[`${b[1]}.jpg`][2]) return `/assets/photos/${b[1]}-800.jpg`;
  return src;
}

export function MediaPicker({ onPick, onClose }) {
  const toast = useToast();
  const [tab, setTab] = useState('uploaded');
  const [media, setMedia] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = () => api('GET', 'media').then((d) => setMedia(d.media)).catch((e) => toast(e.message, 'err'));
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onFiles = async (files) => {
    setBusy(true);
    try {
      let last = null;
      for (const f of files) { last = await uploadImage(f); }
      await load();
      if (last && files.length === 1) onPick(last.url);
      else toast('Uploaded');
    } catch (e) { toast(e.message, 'err'); }
    setBusy(false);
  };

  return (
    <Modal title="Choose a photo" onClose={onClose} wide footer={
      <label className="a-btn primary">
        <Ico n="upload" size={17} /> {busy ? 'Uploading…' : 'Upload a new photo'}
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden disabled={busy} onChange={(e) => { onFiles([...e.target.files]); e.target.value = ''; }} />
      </label>
    }>
      <div className="a-tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'uploaded'} className={tab === 'uploaded' ? 'on' : ''} onClick={() => setTab('uploaded')}>Your uploads</button>
        <button role="tab" aria-selected={tab === 'site'} className={tab === 'site' ? 'on' : ''} onClick={() => setTab('site')}>Site photos</button>
      </div>
      <div className="a-grid-pick">
        {tab === 'site' && BUILT_IN.map((m) => (
          <button type="button" key={m.file} className="a-pick" onClick={() => onPick(m.file)}><img src={thumbOf(m.file)} alt="" loading="lazy" /><span>{m.name}</span></button>
        ))}
        {tab === 'uploaded' && (media || []).map((m) => (
          <button type="button" key={m.id} className="a-pick" onClick={() => onPick(`/media/${m.file}`)}><img src={`/media/${m.small || m.file}`} alt="" loading="lazy" /><span>{m.name}</span></button>
        ))}
      </div>
      {tab === 'uploaded' && media && !media.length && <p className="a-muted">No uploads yet. Use “Upload a new photo” below — it is resized automatically.</p>}
    </Modal>
  );
}

function ImageField({ f, path, value }) {
  const { setValue } = useAdmin();
  const [open, setOpen] = useState(false);
  return (
    <div className="a-field">
      <span className="a-label">{f.label}</span>
      <div className="a-image">
        <div className="a-thumb">{value ? <img src={thumbOf(value)} alt="" /> : <Ico n="image" size={26} />}</div>
        <div className="a-image-side">
          <code title={value}>{value ? value.replace('/assets/photos/', '').replace('/media/', 'upload · ') : 'No photo'}</code>
          <div className="a-row">
            <Btn icon="image" onClick={() => setOpen(true)}>{value ? 'Change' : 'Choose'}</Btn>
            {value && <Btn kind="ghost" icon="x" onClick={() => setValue(path, '')}>Remove</Btn>}
          </div>
        </div>
      </div>
      {open && <MediaPicker onClose={() => setOpen(false)} onPick={(u) => { setValue(path, u); setOpen(false); }} />}
    </div>
  );
}

/* ================= basic inputs ================= */
function TextField({ f, path, value }) {
  const { setValue } = useAdmin();
  const v = value ?? '';
  const Tag = f.t === 'area' ? 'textarea' : 'input';
  return (
    <label className="a-field">
      <span className="a-label">{f.label}{f.max && v.length > f.max * 0.85 ? <em className={v.length >= f.max ? 'over' : ''}>{v.length}/{f.max}</em> : null}</span>
      <Tag className="a-input" value={v} maxLength={f.max} rows={f.t === 'area' ? f.rows || 3 : undefined} type={f.t === 'text' ? 'text' : undefined}
        inputMode={f.pattern === 'digits' ? 'numeric' : undefined} onChange={(e) => setValue(path, e.target.value)} />
      {f.hint && <small className="a-hint">{f.hint}</small>}
    </label>
  );
}

function Toggle({ f, path, value }) {
  const { setValue } = useAdmin();
  return (
    <label className="a-toggle">
      <input type="checkbox" checked={!!value} onChange={(e) => setValue(path, e.target.checked)} />
      <i aria-hidden="true" /> <span>{f.label}</span>
    </label>
  );
}

function SelectField({ f, path, value }) {
  const { setValue } = useAdmin();
  return (
    <label className="a-field">
      <span className="a-label">{f.label}</span>
      <select className="a-input" value={value} onChange={(e) => setValue(path, f.numeric ? Number(e.target.value) : e.target.value)}>
        {f.options.map((o, i) => <option key={o} value={o}>{f.labels ? f.labels[i] : o}</option>)}
      </select>
    </label>
  );
}

function NumberField({ f, path, value }) {
  const { setValue } = useAdmin();
  return (
    <label className="a-field">
      <span className="a-label">{f.label}</span>
      <input className="a-input" type="number" step={f.float ? 'any' : 1} min={f.min} max={f.max} value={value ?? ''} onChange={(e) => setValue(path, e.target.value === '' ? f.min : Number(e.target.value))} />
    </label>
  );
}

function ColorField({ f, path, value }) {
  const { setValue } = useAdmin();
  const [text, setText] = useState(value || '');
  useEffect(() => { setText(value || ''); }, [value]);
  const commit = (v) => { setText(v); if (/^#[0-9a-fA-F]{6}$/.test(v)) setValue(path, v.toLowerCase()); };
  return (
    <div className="a-field">
      <span className="a-label">{f.label}</span>
      <div className="a-color">
        <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(text) ? text : '#000000'} onChange={(e) => commit(e.target.value)} aria-label={f.label} />
        <input className="a-input sm" value={text} maxLength={7} onChange={(e) => commit(e.target.value)} spellCheck={false} />
      </div>
    </div>
  );
}

function ProductPicks({ f, path, value }) {
  const { setValue, doc } = useAdmin();
  const list = doc.draft.products.filter((p) => p.visible);
  const picked = value || [];
  const toggle = (id) => {
    if (picked.includes(id)) setValue(path, picked.filter((x) => x !== id));
    else if (picked.length < (f.max || 4)) setValue(path, [...picked, id]);
  };
  return (
    <div className="a-field">
      <span className="a-label">{f.label}<em>{picked.length}/{f.max || 4}</em></span>
      <div className="a-chips">
        {list.map((p) => (
          <button type="button" key={p.id} className={picked.includes(p.id) ? 'on' : ''} onClick={() => toggle(p.id)} aria-pressed={picked.includes(p.id)}>
            {picked.includes(p.id) && <Ico n="check" size={14} />}{p.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================= lists ================= */
export function blank(f) {
  switch (f.t) {
    case 'color': return '#1f5a3a';
    case 'toggle': return true;
    case 'select': return f.options[0];
    case 'number': return f.min;
    case 'group': return Object.fromEntries(f.fields.map((s) => [s.k, blank(s)]));
    case 'list': return [];
    case 'productPicks': return [];
    default: return '';
  }
}

function ListField({ f, path, value }) {
  const { change } = useAdmin();
  const items = value || [];
  const [openIdx, setOpenIdx] = useState(-1);
  const edit = (fn) => change((d) => { const copy = JSON.parse(JSON.stringify(d)); const arr = path.reduce((a, k) => a[k], copy); fn(arr); return copy; });
  const full = items.length >= (f.max || 40);

  const move = (i, d) => edit((arr) => { const j = i + d; if (j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]]; setOpenIdx(j); });
  const del = (i) => { if (f.min && items.length <= f.min) return; edit((arr) => arr.splice(i, 1)); setOpenIdx(-1); };
  const dup = (i) => edit((arr) => { if (arr.length >= (f.max || 40)) return; const c = JSON.parse(JSON.stringify(arr[i])); if (c.id) c.id = ''; arr.splice(i + 1, 0, c); });
  const add = () => { edit((arr) => arr.push(f.scalar ? '' : Object.fromEntries(f.item.map((s) => [s.k, blank(s)])))); setOpenIdx(items.length); };

  if (f.scalar) {
    return (
      <div className="a-field">
        <span className="a-label">{f.label}<em>{items.length}/{f.max}</em></span>
        <div className="a-slist">
          {items.map((it, i) => (
            <div className="a-srow" key={i}>
              <input className="a-input" value={it} maxLength={f.itemMax} onChange={(e) => change((d) => { const c = JSON.parse(JSON.stringify(d)); path.reduce((a, k) => a[k], c)[i] = e.target.value; return c; })} />
              <button type="button" className="a-icon-btn" onClick={() => move(i, -1)} aria-label="Move up" disabled={i === 0}><Ico n="up" size={16} /></button>
              <button type="button" className="a-icon-btn" onClick={() => move(i, 1)} aria-label="Move down" disabled={i === items.length - 1}><Ico n="down" size={16} /></button>
              <button type="button" className="a-icon-btn danger" onClick={() => del(i)} aria-label="Remove"><Ico n="trash" size={16} /></button>
            </div>
          ))}
        </div>
        <Btn icon="plus" onClick={add} disabled={full}>Add</Btn>
      </div>
    );
  }

  return (
    <div className="a-field">
      <span className="a-label">{f.label}<em>{items.length}/{f.max}</em></span>
      <div className="a-list">
        {items.map((it, i) => {
          const open = openIdx === i;
          const title = (f.itemLabel && it[f.itemLabel]) || `Item ${i + 1}`;
          const thumb = f.item.find((s) => s.t === 'image');
          return (
            <div className={`a-item${open ? ' open' : ''}`} key={i}>
              <div className="a-item-h">
                <button type="button" className="a-item-title" onClick={() => setOpenIdx(open ? -1 : i)} aria-expanded={open}>
                  <span className="a-num">{i + 1}</span>
                  {thumb && it[thumb.k] ? <img src={thumbOf(it[thumb.k])} alt="" /> : null}
                  <span>{String(title).slice(0, 60)}</span>
                  {it.visible === false || it.open === false ? <small className="a-off">hidden</small> : null}
                </button>
                <div className="a-item-actions">
                  <button type="button" className="a-icon-btn" onClick={() => move(i, -1)} aria-label="Move up" disabled={i === 0}><Ico n="up" size={16} /></button>
                  <button type="button" className="a-icon-btn" onClick={() => move(i, 1)} aria-label="Move down" disabled={i === items.length - 1}><Ico n="down" size={16} /></button>
                  <button type="button" className="a-icon-btn" onClick={() => dup(i)} aria-label="Duplicate" disabled={full}><Ico n="copy" size={16} /></button>
                  <button type="button" className="a-icon-btn danger" onClick={() => del(i)} aria-label="Delete" disabled={!!f.min && items.length <= f.min}><Ico n="trash" size={16} /></button>
                </div>
              </div>
              {open && <div className="a-item-b">{f.item.map((s) => <Field key={s.k} f={s} path={[...path, i, s.k]} />)}</div>}
            </div>
          );
        })}
      </div>
      <Btn icon="plus" onClick={add} disabled={full}>Add {f.label.toLowerCase().replace(/ \(.*$/, '').replace(/s$/, '')}</Btn>
    </div>
  );
}

/* ================= router for a field ================= */
export function Field({ f, path, depth = 0 }) {
  const { doc } = useAdmin();
  const value = getAt(doc.draft, path);
  switch (f.t) {
    case 'text': case 'area': case 'url': return <TextField f={f} path={path} value={value} />;
    case 'image': return <ImageField f={f} path={path} value={value} />;
    case 'select': return <SelectField f={f} path={path} value={value} />;
    case 'toggle': return <Toggle f={f} path={path} value={value} />;
    case 'number': return <NumberField f={f} path={path} value={value} />;
    case 'color': return <ColorField f={f} path={path} value={value} />;
    case 'productPicks': return <ProductPicks f={f} path={path} value={value} />;
    case 'list': return <ListField f={f} path={path} value={value} />;
    case 'group':
      return (
        <fieldset className={`a-group d${Math.min(depth, 2)}`}>
          <legend>{f.label}</legend>
          {f.fields.map((s) => <Field key={s.k} f={s} path={[...path, s.k]} depth={depth + 1} />)}
        </fieldset>
      );
    default: return null;
  }
}

/** A top-level group shown as a collapsible panel; lists and singles render plainly. */
export function RootField({ f }) {
  if (f.t === 'group') {
    return (
      <details className="a-panel" open>
        <summary><Ico n="down" size={16} /> {f.label}</summary>
        <div className="a-panel-b">{f.fields.map((s) => <Field key={s.k} f={s} path={[f.k, s.k]} depth={1} />)}</div>
      </details>
    );
  }
  return (
    <details className="a-panel" open>
      <summary><Ico n="down" size={16} /> {f.label}</summary>
      <div className="a-panel-b"><Field f={{ ...f, label: f.label }} path={[f.k]} /></div>
    </details>
  );
}

export { bytes };
