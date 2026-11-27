import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './admin.css';
import { Toasts, Modal, Btn, Badge, useToast, ago } from './ui.jsx';
import { Ico } from './icons.jsx';
import { AdminProvider, useAdmin, sectionOf } from './state.jsx';
import { api } from './api.js';
import { SECTIONS } from '../content/schema.js';
import { Dashboard, Editor, Products, Media, Enquiries, History, Users, Account } from './pages.jsx';
import VisualEditor from './VisualEditor.jsx';

function Login() {
  const { setUser } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('');
    try { const d = await api('POST', 'login', { email, password }); setUser(d.user); } catch (err) { setError(err.message); }
    setBusy(false);
  };
  useEffect(() => { document.title = 'Sign in · Welkin admin'; }, []);
  return (
    <div className="a-login">
      <form onSubmit={submit} className="a-login-card">
        <img src="/assets/logo.png" alt="" width="64" height="64" />
        <h1>Welkin admin</h1>
        <p className="a-muted">Sign in to manage the website.</p>
        {error && <div className="a-alert err" role="alert"><Ico n="alert" size={18} />{error}</div>}
        <label className="a-field"><span className="a-label">Email</span><input className="a-input" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} autoFocus /></label>
        <label className="a-field"><span className="a-label">Password</span><input className="a-input" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button className="a-btn primary wide" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <a className="a-muted a-back" href="/">← Back to the website</a>
      </form>
    </div>
  );
}

function PublishModal({ onClose }) {
  const toast = useToast();
  const { doc, changedPaths, publish, discard, saveErrors } = useAdmin();
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const groups = {};
  changedPaths.forEach((p) => { const k = sectionOf(p); groups[k] = (groups[k] || 0) + 1; });
  const go = async () => {
    setBusy(true);
    try {
      const r = await publish(note);
      toast(`Published version ${r.version}. Visitors see it within about 30 seconds.`);
      onClose();
    } catch (e) { toast(e.message, 'err'); }
    setBusy(false);
  };
  const drop = async () => {
    if (!window.confirm('Throw away all unpublished changes? This cannot be undone.')) return;
    setBusy(true);
    try { await discard(); toast('Changes discarded'); onClose(); } catch (e) { toast(e.message, 'err'); }
    setBusy(false);
  };
  return (
    <Modal title="Publish changes" onClose={onClose} footer={<>
      <Btn kind="danger-ghost" icon="trash" onClick={drop} disabled={busy || !changedPaths.length}>Discard changes</Btn>
      <span className="a-spacer" />
      <Btn onClick={onClose}>Cancel</Btn>
      <Btn kind="primary" icon="check" onClick={go} disabled={busy || !changedPaths.length || saveErrors.length > 0}>{busy ? 'Publishing…' : 'Publish now'}</Btn>
    </>}>
      {!changedPaths.length ? <p>Nothing to publish — the live website already matches your draft.</p> : (
        <>
          <p>You are about to make <b>{changedPaths.length}</b> change{changedPaths.length === 1 ? '' : 's'} live:</p>
          <ul className="a-changes">{Object.entries(groups).map(([k, n]) => <li key={k}><Ico n="check" size={16} /> {k} <Badge>{n}</Badge></li>)}</ul>
          <label className="a-field"><span className="a-label">Note (optional — shown in history)</span><input className="a-input" value={note} maxLength={120} onChange={(e) => setNote(e.target.value)} placeholder="e.g. New Qurbani prices" /></label>
          <p className="a-muted">Tip: use “Preview” first to see exactly how it will look.</p>
        </>
      )}
      {saveErrors.length > 0 && <div className="a-alert err"><Ico n="alert" size={18} /><div>Fix these first:<ul>{saveErrors.map((e) => <li key={e}>{e}</li>)}</ul></div></div>}
    </Modal>
  );
}

function SaveStatus() {
  const { saveState, changes, doc } = useAdmin();
  const map = { idle: ['grey', 'Up to date'], pending: ['amber', 'Unsaved…'], saving: ['amber', 'Saving…'], saved: ['green', 'Draft saved'], error: ['red', 'Not saved'] };
  const [kind, text] = map[saveState] || map.idle;
  return (
    <span className="a-status" title={doc && doc.updatedAt ? `Last saved ${ago(doc.updatedAt)}` : ''}>
      <Badge kind={kind}>{text}</Badge>
      {changes > 0 && <Badge kind="blue">{changes} unpublished</Badge>}
    </span>
  );
}

function Shell() {
  const { user, logout, doc, saveNow, changes } = useAdmin();
  const toast = useToast();
  const loc = useLocation();
  const [nav, setNav] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [newCount, setNewCount] = useState(0);

  useEffect(() => { setNav(false); window.scrollTo({ top: 0 }); }, [loc.pathname]);
  useEffect(() => {
    let dead = false;
    const poll = () => api('GET', 'enquiries').then((d) => { if (!dead) setNewCount(d.counts.new); }).catch(() => {});
    poll();
    const t = setInterval(poll, 60000);
    return () => { dead = true; clearInterval(t); };
  }, []);
  useEffect(() => { document.title = 'Admin · Welkin Farmstead'; }, []);

  const preview = async () => {
    if (!(await saveNow())) { toast('Fix the problems first, then preview.', 'err'); return; }
    window.open('/?preview=1', '_blank', 'noopener');
  };

  const item = (to, icon, label, badge) => (
    <NavLink to={to} end={to === '/admin'} className={({ isActive }) => `a-nav-i${isActive ? ' on' : ''}`}>
      <Ico n={icon} size={19} /><span>{label}</span>{badge ? <Badge kind="red">{badge}</Badge> : null}
    </NavLink>
  );

  return (
    <div className="a-shell">
      <aside className={`a-side${nav ? ' open' : ''}`}>
        <div className="a-brand"><img src="/assets/logo.png" alt="" width="36" height="36" /><div><b>Welkin</b><small>Admin panel</small></div></div>
        <nav aria-label="Admin">
          <p className="a-nav-h">Overview</p>
          {item('/admin', 'dashboard', 'Dashboard')}
          {item('/admin/visual', 'eye', 'Visual editor')}
          <p className="a-nav-h">Website content</p>
          {SECTIONS.map((s) => item(s.custom === 'products' ? '/admin/products' : `/admin/content/${s.id}`, s.icon, s.title))}
          <p className="a-nav-h">Library & inbox</p>
          {item('/admin/media', 'image', 'Photos')}
          {item('/admin/enquiries', 'inbox', 'Enquiries', newCount)}
          <p className="a-nav-h">System</p>
          {item('/admin/history', 'history', 'History')}
          {user.role === 'owner' && item('/admin/users', 'users', 'Users')}
          {item('/admin/account', 'key', 'Account & backup')}
        </nav>
        <div className="a-side-f">
          <div className="a-who"><b>{user.name}</b><small>{user.email} · {user.role}</small></div>
          <button type="button" className="a-btn ghost wide" onClick={logout}><Ico n="logout" size={17} /> Sign out</button>
        </div>
      </aside>
      {nav && <div className="a-scrim" onClick={() => setNav(false)} />}

      <div className="a-main">
        <header className="a-top">
          <button type="button" className="a-icon-btn a-burger" onClick={() => setNav(true)} aria-label="Open menu"><Ico n="menu" /></button>
          <SaveStatus />
          <span className="a-spacer" />
          <a className="a-btn ghost hide-s" href="/" target="_blank" rel="noopener"><Ico n="external" size={17} /> View site</a>
          <Btn icon="eye" onClick={preview} disabled={!doc}>Preview</Btn>
          <Btn kind="primary" icon="upload" onClick={() => setPublishing(true)} disabled={!doc}>Publish{changes ? ` (${changes})` : ''}</Btn>
        </header>
        <main className={`a-content${loc.pathname.startsWith('/admin/visual') ? ' wide' : ''}`}>
          {!doc ? <div className="a-loading"><span className="a-spin" /> Loading…</div> : (
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="visual" element={<VisualEditor />} />
              <Route path="content/:id" element={<Editor />} />
              <Route path="products" element={<Products />} />
              <Route path="media" element={<Media />} />
              <Route path="enquiries" element={<Enquiries />} />
              <Route path="history" element={<History />} />
              <Route path="users" element={user.role === 'owner' ? <Users /> : <Navigate to="/admin" replace />} />
              <Route path="account" element={<Account />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          )}
        </main>
      </div>
      {publishing && <PublishModal onClose={() => setPublishing(false)} />}
    </div>
  );
}

function Gate() {
  const { user } = useAdmin();
  if (user === undefined) return <div className="a-loading full"><span className="a-spin" /></div>;
  return user ? <Shell /> : <Login />;
}

export default function AdminApp() {
  return (
    <div className="adm">
      <Toasts><AdminProvider><Gate /></AdminProvider></Toasts>
    </div>
  );
}
