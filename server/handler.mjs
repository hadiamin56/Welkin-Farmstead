// The whole backend: public content + enquiry endpoints, media serving, and the authenticated admin API.
// Runs unchanged as a Netlify Function (netlify/functions/api.mjs) and as the local dev server (scripts/dev-server.mjs).
import crypto from 'node:crypto';
import { getStore } from './store.mjs';
import { hashPassword, verifyPassword, safeEqual, sign, verify, readCookie, sessionCookie, clearCookie, COOKIE, secret } from './auth.mjs';
import { sanitize, withDefaults, diffPaths } from '../src/content/sanitize.js';
import { DEFAULTS } from '../src/content/defaults.js';

const J = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { ...J, ...headers } });
const err = (status, error, extra = {}) => json({ error, ...extra }, status);

const now = () => new Date().toISOString();
const rid = () => crypto.randomBytes(5).toString('hex');
const normEmail = (e) => String(e || '').trim().toLowerCase();
const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/;
const ROLES = ['owner', 'editor'];
const clientIp = (req) => (req.headers.get('x-nf-client-connection-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'local').slice(0, 64);
const hashKey = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);

/* ---------- small helpers ---------- */
// Serialises operations that read-modify-write shared records (publish, uploads…) so two quick clicks can't interleave.
const chains = new Map();
async function withLock(key, fn) {
  const prev = chains.get(key) || Promise.resolve();
  let release;
  const gate = new Promise((r) => { release = r; });
  chains.set(key, prev.then(() => gate));
  await prev;
  try { return await fn(); } finally { release(); if (chains.get(key) === gate) chains.delete(key); }
}
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
// A save must carry a real content document; an empty or malformed request must never reset the draft.
const hasContent = (c) => isObj(c) && isObj(c.site) && isObj(c.home);
async function readJson(req, limit = 1_500_000) {
  const text = await req.text();
  if (text.length > limit) throw Object.assign(new Error('Request too large'), { status: 413 });
  try { return text ? JSON.parse(text) : {}; } catch { throw Object.assign(new Error('Invalid JSON'), { status: 400 }); }
}

async function rateLimit(store, key, max, windowMs) {
  const k = `rl/${key}`;
  const rec = (await store.getJSON(k)) || { count: 0, resetAt: 0 };
  const t = Date.now();
  if (rec.resetAt < t) { rec.count = 0; rec.resetAt = t + windowMs; }
  return { rec, k, blocked: rec.count >= max, retry: Math.ceil((rec.resetAt - t) / 1000) };
}
const bump = (store, rl) => { rl.rec.count += 1; return store.setJSON(rl.k, rl.rec); };

async function logActivity(store, user, action, detail = '') {
  const list = (await store.getJSON('activity')) || [];
  list.unshift({ at: now(), by: user ? user.email : 'system', action, detail: String(detail).slice(0, 200) });
  await store.setJSON('activity', list.slice(0, 300));
}

async function getPublished(store) {
  const rec = await store.getJSON('published');
  if (!rec) return { version: 0, publishedAt: null, publishedBy: null, content: DEFAULTS };
  return { ...rec, content: withDefaults(rec.content) };
}

/* ---------- public ---------- */
async function publicContent(store, req) {
  const pub = await getPublished(store);
  const etag = `"v${pub.version}-${pub.publishedAt || 0}"`;
  if (req.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers: { etag, 'cache-control': 'public, max-age=0, must-revalidate' } });
  return json({ version: pub.version, publishedAt: pub.publishedAt, content: pub.content }, 200, {
    etag,
    'cache-control': 'public, max-age=0, must-revalidate',
    'netlify-cdn-cache-control': 'public, s-maxage=20, stale-while-revalidate=120',
  });
}

async function enquiry(req, store) {
  const ip = clientIp(req);
  const rl = await rateLimit(store, `enq/${hashKey(ip)}`, 8, 10 * 60 * 1000);
  if (rl.blocked) return err(429, 'Too many requests');
  const b = await readJson(req, 20_000);
  if (b.hp) return json({ ok: true }); // honeypot
  const s = (v, n) => String(v ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, n);
  const type = ['order', 'visit', 'qurbani', 'other'].includes(b.type) ? b.type : 'other';
  const rec = {
    id: `${Date.now().toString(36)}${rid()}`, at: now(), status: 'new', type,
    name: s(b.name, 80), items: Array.isArray(b.items) ? b.items.slice(0, 30).map((x) => s(x, 60)) : [], note: s(b.note, 600),
    org: s(b.org, 120), students: s(b.n, 20), date: s(b.d, 60), page: s(b.page, 80),
  };
  if (type === 'qurbani') {
    const q = b.q && typeof b.q === 'object' ? b.q : {};
    const qty = Math.min(20, Math.max(1, parseInt(q.qty, 10) || 1));
    rec.q = { animal: s(q.animal, 60), weight: s(q.weight, 40), qty, phone: s(q.phone, 20), city: s(q.city, 80), delivery: s(q.delivery, 80), date: s(q.date, 60) };
    if (!rec.q.animal || !rec.q.phone) return err(400, 'Please choose an animal and enter your phone number.');
  }
  if (!rec.name && !rec.items.length && !rec.note && !rec.org) return json({ ok: true });
  await store.setJSON(`enq/${rec.id}`, rec);
  await bump(store, rl);
  return json({ ok: true });
}

async function serveMedia(name, store) {
  if (!/^[A-Za-z0-9._-]{1,120}\.(?:jpe?g|png|webp)$/.test(name)) return err(404, 'Not found');
  const f = await store.getBin(`media/${name}`);
  if (!f) return err(404, 'Not found');
  return new Response(f.data, {
    status: 200,
    headers: { 'content-type': f.meta.type || 'image/jpeg', 'cache-control': 'public, max-age=31536000, immutable', 'x-content-type-options': 'nosniff' },
  });
}

/* ---------- auth ---------- */
async function loadUser(store, email) { return store.getJSON(`user/${normEmail(email)}`); }
const publicUser = (u) => ({ email: u.email, name: u.name, role: u.role, createdAt: u.createdAt });
const DUMMY = hashPassword('dummy-password-for-timing');

async function login(req, store) {
  if (!secret()) return err(500, 'Admin is not configured: set the JWT_SECRET environment variable (16+ characters).');
  const b = await readJson(req, 4000);
  const email = normEmail(b.email); const password = String(b.password || '');
  if (!email || !password) return err(400, 'Enter your email and password.');
  const rl = await rateLimit(store, `login/${hashKey(clientIp(req) + email)}`, 5, 15 * 60 * 1000);
  const rlIp = await rateLimit(store, `login-ip/${hashKey(clientIp(req))}`, 25, 15 * 60 * 1000);
  if (rl.blocked || rlIp.blocked) return err(429, `Too many attempts. Try again in ${Math.ceil(Math.max(rl.retry, rlIp.retry) / 60)} minute(s).`);

  const existing = await store.list('user/');
  let user = await loadUser(store, email);
  let okPw = false;
  if (!existing.length) {
    const E = normEmail(process.env.ADMIN_EMAIL); const P = process.env.ADMIN_PASSWORD || '';
    if (!E || !P) return err(503, 'Admin is not set up yet. Set ADMIN_EMAIL and ADMIN_PASSWORD in the site environment variables, then sign in.');
    okPw = safeEqual(email, E) && safeEqual(password, P);
    if (okPw) {
      user = { email: E, name: 'Owner', role: 'owner', hash: hashPassword(P), pv: 1, createdAt: now() };
      await store.setJSON(`user/${E}`, user);
      await logActivity(store, user, 'setup', 'First owner account created');
    }
  } else {
    okPw = verifyPassword(password, user ? user.hash : DUMMY) && !!user;
  }
  if (!okPw) { await bump(store, rl); await bump(store, rlIp); return err(401, 'Incorrect email or password.'); }
  await store.del(rl.k);
  const token = sign({ sub: user.email, pv: user.pv });
  await logActivity(store, user, 'login');
  return json({ user: publicUser(user) }, 200, { 'set-cookie': sessionCookie(token, req) });
}

async function authenticate(req, store) {
  const tok = readCookie(req, COOKIE);
  const p = tok && verify(tok);
  if (!p) return null;
  const u = await loadUser(store, p.sub);
  return u && u.pv === p.pv ? u : null;
}

function csrfOk(req) {
  if (req.headers.get('x-admin') !== '1') return false;
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).host === new URL(req.url).host || origin.includes(req.headers.get('host') || '~'); } catch { return false; }
}

/* ---------- admin ---------- */
const MAGIC = (b) => {
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return ['image/jpeg', 'jpg'];
  if (b.length > 12 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return ['image/png', 'png'];
  if (b.length > 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') return ['image/webp', 'webp'];
  return null;
};
const MAX_IMG = 2.2 * 1024 * 1024;

async function admin(req, url, store) {
  const sub = url.pathname.replace(/^\/api\/admin\/?/, '').split('/').filter(Boolean);
  const method = req.method;
  if (sub[0] === 'login' && method === 'POST') return login(req, store);
  if (!['GET', 'HEAD'].includes(method) && !csrfOk(req)) return err(403, 'Blocked (cross-site request).');
  if (sub[0] === 'logout' && method === 'POST') return json({ ok: true }, 200, { 'set-cookie': clearCookie() });

  const me = await authenticate(req, store);
  if (!me) return err(401, 'Please sign in.');
  const owner = me.role === 'owner';

  switch (sub[0]) {
    case 'me': return json({ user: publicUser(me) });

    case 'password': {
      if (method !== 'POST') break;
      const b = await readJson(req, 2000);
      if (!verifyPassword(String(b.current || ''), me.hash)) return err(400, 'Current password is incorrect.');
      if (String(b.next || '').length < 10) return err(400, 'New password must be at least 10 characters.');
      me.hash = hashPassword(String(b.next)); me.pv = (me.pv || 1) + 1;
      await store.setJSON(`user/${me.email}`, me);
      await logActivity(store, me, 'password', 'Changed own password');
      return json({ ok: true }, 200, { 'set-cookie': sessionCookie(sign({ sub: me.email, pv: me.pv }), req) });
    }

    case 'content': {
      const pub = await getPublished(store);
      const rec = await store.getJSON('draft');
      const draft = rec ? withDefaults(rec.content) : pub.content;
      return json({
        published: { version: pub.version, publishedAt: pub.publishedAt, publishedBy: pub.publishedBy },
        publishedContent: pub.content,
        draft, hasDraft: !!rec, updatedAt: rec ? rec.updatedAt : null, updatedBy: rec ? rec.updatedBy : null,
        changes: diffPaths(pub.content, draft).length,
        defaults: DEFAULTS,
      });
    }

    case 'draft': {
      if (method !== 'PUT') break;
      const b = await readJson(req);
      if (!hasContent(b.content)) return err(400, 'The save did not contain any content, so nothing was changed.');
      const { content, errors } = sanitize(b.content);
      if (errors.length) return err(422, 'Some fields are not valid.', { errors: errors.slice(0, 20) });
      const rec = { content, updatedAt: now(), updatedBy: me.email };
      await store.setJSON('draft', rec);
      const pub = await getPublished(store);
      return json({ ok: true, content, updatedAt: rec.updatedAt, changes: diffPaths(pub.content, content).length });
    }

    case 'discard': {
      if (method !== 'POST') break;
      await store.del('draft');
      await logActivity(store, me, 'discard', 'Discarded draft changes');
      return json({ ok: true });
    }

    case 'publish': {
      if (method !== 'POST') break;
      const b = await readJson(req, 4000);
      return withLock('publish', async () => {
      const pub = await getPublished(store);
      const rec = await store.getJSON('draft');
      if (!rec) return err(400, 'There are no unpublished changes.');
      const { content, errors } = sanitize(rec.content);
      if (errors.length) return err(422, 'Some fields are not valid.', { errors: errors.slice(0, 20) });
      const changed = diffPaths(pub.content, content);
      if (!changed.length) { await store.del('draft'); return err(400, 'Nothing has changed since the last publish.'); }
      const version = (pub.version || 0) + 1;
      const next = { version, publishedAt: now(), publishedBy: me.email, content };
      const revId = `${Date.now().toString(36)}${rid()}`;
      const note = String(b.note || '').slice(0, 120);
      await store.setJSON(`rev/${revId}`, { id: revId, ...next, note });
      const index = (await store.getJSON('rev-index')) || [];
      index.unshift({ id: revId, version, at: next.publishedAt, by: me.email, note, changes: changed.length });
      for (const old of index.splice(40)) await store.del(`rev/${old.id}`);
      await store.setJSON('rev-index', index);
      await store.setJSON('published', next);
      await store.del('draft');
      await logActivity(store, me, 'publish', `v${version}: ${changed.length} change(s)${note ? ` — ${note}` : ''}`);
      let rebuild = 'not-configured';
      if (process.env.BUILD_HOOK_URL) {
        try { const r = await fetch(process.env.BUILD_HOOK_URL, { method: 'POST' }); rebuild = r.ok ? 'triggered' : `failed (${r.status})`; } catch { rebuild = 'failed'; }
      }
      return json({ ok: true, version, publishedAt: next.publishedAt, changes: changed.length, rebuild });
      });
    }

    case 'revisions': {
      if (sub[1] && sub[2] === 'restore' && method === 'POST') {
        if (!/^[a-z0-9]{6,24}$/.test(sub[1])) return err(400, 'Bad id');
        const r = await store.getJSON(`rev/${sub[1]}`);
        if (!r) return err(404, 'Version not found');
        await store.setJSON('draft', { content: sanitize(r.content).content, updatedAt: now(), updatedBy: me.email });
        await logActivity(store, me, 'restore', `Loaded v${r.version} into the draft`);
        return json({ ok: true });
      }
      return json({ revisions: (await store.getJSON('rev-index')) || [] });
    }

    case 'media': return adminMedia(req, sub, store, me);
    case 'enquiries': return adminEnquiries(req, sub, url, store, me);
    case 'users': return owner ? adminUsers(req, sub, store, me) : err(403, 'Only the owner can manage users.');
    case 'activity': return json({ activity: (await store.getJSON('activity')) || [] });

    case 'health': {
      const users = await store.list('user/');
      return json({ store: store.kind, jwtSecret: !!secret(), adminEnv: !!(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD), buildHook: !!process.env.BUILD_HOOK_URL, users: users.length, time: now() });
    }

    case 'export': {
      const pub = await getPublished(store);
      const rec = await store.getJSON('draft');
      return new Response(JSON.stringify({ exportedAt: now(), version: pub.version, published: pub.content, draft: rec ? rec.content : null }, null, 2), {
        headers: { ...J, 'content-disposition': `attachment; filename="welkin-content-${new Date().toISOString().slice(0, 10)}.json"` },
      });
    }
    case 'import': {
      if (!owner) return err(403, 'Only the owner can import.');
      if (method !== 'POST') break;
      const b = await readJson(req);
      const incoming = b.content || b.published || b.draft;
      if (!hasContent(incoming)) return err(400, 'That file does not look like a Welkin content backup.');
      const { content, errors } = sanitize(incoming);
      if (errors.length) return err(422, 'Some fields are not valid.', { errors: errors.slice(0, 20) });
      await store.setJSON('draft', { content, updatedAt: now(), updatedBy: me.email });
      await logActivity(store, me, 'import', 'Imported a content backup into the draft');
      return json({ ok: true });
    }
    default:
  }
  return err(404, 'Not found');
}

async function adminMedia(req, sub, store, me) {
  return withLock('media', () => adminMediaLocked(req, sub, store, me));
}

async function adminMediaLocked(req, sub, store, me) {
  const method = req.method;
  const idx = (await store.getJSON('media-index')) || [];
  if (method === 'GET') {
    const pub = JSON.stringify((await getPublished(store)).content);
    const draftRec = await store.getJSON('draft');
    const draft = draftRec ? JSON.stringify(draftRec.content) : pub;
    return json({ media: idx.map((m) => ({ ...m, usedPublished: pub.includes(`/media/${m.file}`), usedDraft: draft.includes(`/media/${m.file}`) })) });
  }
  if (method === 'POST' && !sub[1]) {
    let fd;
    try { fd = await req.formData(); } catch { return err(400, 'Upload could not be read.'); }
    const large = fd.get('large'); const small = fd.get('small');
    if (!large || typeof large === 'string') return err(400, 'No image received.');
    const bufL = Buffer.from(await large.arrayBuffer());
    const typeL = MAGIC(bufL);
    if (!typeL) return err(400, 'Only JPG, PNG or WebP images are allowed.');
    if (bufL.length > MAX_IMG) return err(413, 'That image is too large after resizing (max about 2 MB).');
    const w = Math.max(1, Math.min(6000, parseInt(fd.get('w'), 10) || 0)); const h = Math.max(1, Math.min(6000, parseInt(fd.get('h'), 10) || 0));
    if (!w || !h) return err(400, 'Missing image size.');
    const id = `u${Date.now().toString(36)}${rid().slice(0, 4)}`;
    const base = `${id}-${w}x${h}`;
    const file = `${base}.${typeL[1]}`;
    const name = String(fd.get('name') || 'photo').replace(/[\u0000-\u001F<>]/g, '').slice(0, 80);
    await store.setBin(`media/${file}`, bufL, { type: typeL[0] });
    let smallFile = null;
    if (small && typeof small !== 'string') {
      const bufS = Buffer.from(await small.arrayBuffer()); const typeS = MAGIC(bufS);
      if (typeS && bufS.length <= MAX_IMG) { smallFile = `${base}-800.${typeS[1]}`; await store.setBin(`media/${smallFile}`, bufS, { type: typeS[0] }); }
    }
    const rec = { id, file, small: smallFile, name, alt: '', w, h, size: bufL.length, at: now(), by: me.email };
    idx.unshift(rec);
    await store.setJSON('media-index', idx.slice(0, 600));
    await logActivity(store, me, 'upload', name);
    return json({ ok: true, media: rec, url: `/media/${file}` });
  }
  const id = sub[1];
  const i = idx.findIndex((m) => m.id === id);
  if (i < 0) return err(404, 'Image not found');
  if (method === 'PATCH') {
    const b = await readJson(req, 2000);
    if (typeof b.name === 'string') idx[i].name = b.name.replace(/[\u0000-\u001F<>]/g, '').slice(0, 80);
    if (typeof b.alt === 'string') idx[i].alt = b.alt.replace(/[\u0000-\u001F<>]/g, '').slice(0, 160);
    await store.setJSON('media-index', idx);
    return json({ ok: true, media: idx[i] });
  }
  if (method === 'DELETE') {
    const m = idx[i];
    const pub = JSON.stringify((await getPublished(store)).content);
    const draftRec = await store.getJSON('draft');
    const used = pub.includes(`/media/${m.file}`) || (draftRec && JSON.stringify(draftRec.content).includes(`/media/${m.file}`));
    if (used) return err(409, 'This image is used on the website. Replace it everywhere first.');
    await store.del(`media/${m.file}`); if (m.small) await store.del(`media/${m.small}`);
    idx.splice(i, 1); await store.setJSON('media-index', idx);
    await logActivity(store, me, 'delete-image', m.name);
    return json({ ok: true });
  }
  return err(405, 'Method not allowed');
}

async function adminEnquiries(req, sub, url, store, me) {
  const method = req.method;
  if (method === 'GET') {
    const keys = await store.list('enq/');
    const rows = (await Promise.all(keys.map((k) => store.getJSON(k)))).filter(Boolean).sort((a, b) => (a.at < b.at ? 1 : -1));
    if (sub[1] === 'export.csv') {
      const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const head = ['received', 'type', 'status', 'name', 'items', 'note', 'organisation', 'students', 'date', 'page', 'animal', 'weight', 'quantity', 'phone', 'city', 'delivery', 'preferred date'];
      const csv = [head.join(','), ...rows.map((r) => [r.at, r.type, r.status, r.name, (r.items || []).join('; '), r.note, r.org, r.students, r.date, r.page, r.q?.animal, r.q?.weight, r.q?.qty, r.q?.phone, r.q?.city, r.q?.delivery, r.q?.date].map(esc).join(','))].join('\n');
      return new Response(csv, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="welkin-enquiries.csv"', 'cache-control': 'no-store' } });
    }
    return json({ enquiries: rows.slice(0, 500), counts: { new: rows.filter((r) => r.status === 'new').length, total: rows.length } });
  }
  const id = sub[1];
  if (!id || !/^[a-z0-9]{6,24}$/.test(id)) return err(400, 'Bad id');
  const rec = await store.getJSON(`enq/${id}`);
  if (!rec) return err(404, 'Not found');
  if (method === 'PATCH') {
    const b = await readJson(req, 1000);
    if (['new', 'handled'].includes(b.status)) rec.status = b.status;
    await store.setJSON(`enq/${id}`, rec);
    return json({ ok: true, enquiry: rec });
  }
  if (method === 'DELETE') { await store.del(`enq/${id}`); await logActivity(store, me, 'delete-enquiry', rec.name); return json({ ok: true }); }
  return err(405, 'Method not allowed');
}

async function adminUsers(req, sub, store, me) {
  const method = req.method;
  const all = async () => (await Promise.all((await store.list('user/')).map((k) => store.getJSON(k)))).filter(Boolean);
  if (method === 'GET') return json({ users: (await all()).map(publicUser) });
  if (method === 'POST' && !sub[1]) {
    const b = await readJson(req, 2000);
    const email = normEmail(b.email);
    if (!EMAIL_RE.test(email)) return err(400, 'Enter a valid email address.');
    if (String(b.password || '').length < 10) return err(400, 'Password must be at least 10 characters.');
    if (await loadUser(store, email)) return err(409, 'A user with that email already exists.');
    const u = { email, name: String(b.name || email.split('@')[0]).slice(0, 60), role: ROLES.includes(b.role) ? b.role : 'editor', hash: hashPassword(String(b.password)), pv: 1, createdAt: now() };
    await store.setJSON(`user/${email}`, u);
    await logActivity(store, me, 'user-add', `${email} (${u.role})`);
    return json({ ok: true, user: publicUser(u) });
  }
  const email = normEmail(decodeURIComponent(sub[1] || ''));
  const u = await loadUser(store, email);
  if (!u) return err(404, 'User not found');
  const owners = (await all()).filter((x) => x.role === 'owner');
  if (method === 'PATCH') {
    const b = await readJson(req, 2000);
    if (typeof b.name === 'string') u.name = b.name.slice(0, 60);
    if (ROLES.includes(b.role) && b.role !== u.role) {
      if (u.role === 'owner' && owners.length <= 1) return err(400, 'There must be at least one owner.');
      u.role = b.role;
    }
    if (b.password) {
      if (String(b.password).length < 10) return err(400, 'Password must be at least 10 characters.');
      u.hash = hashPassword(String(b.password)); u.pv = (u.pv || 1) + 1;
    }
    await store.setJSON(`user/${email}`, u);
    await logActivity(store, me, 'user-edit', email);
    return json({ ok: true, user: publicUser(u) });
  }
  if (method === 'DELETE') {
    if (email === me.email) return err(400, 'You cannot delete your own account.');
    if (u.role === 'owner' && owners.length <= 1) return err(400, 'There must be at least one owner.');
    await store.del(`user/${email}`);
    await logActivity(store, me, 'user-delete', email);
    return json({ ok: true });
  }
  return err(405, 'Method not allowed');
}

/* ---------- entry point ---------- */
export async function handle(req) {
  const url = new URL(req.url);
  const p = url.pathname;
  try {
    const store = await getStore();
    if (p.startsWith('/media/') && req.method === 'GET') return await serveMedia(decodeURIComponent(p.slice(7)), store);
    if (p === '/api/content' && req.method === 'GET') return await publicContent(store, req);
    if (p === '/api/enquiry' && req.method === 'POST') return await enquiry(req, store);
    if (p === '/api/health') return json({ ok: true });
    if (p.startsWith('/api/admin')) return await admin(req, url, store);
    return err(404, 'Not found');
  } catch (e) {
    if (e && e.status) return err(e.status, e.message);
    console.error('[api]', e);
    return err(500, 'Something went wrong on the server.');
  }
}
