// Before each production build: pull the latest published content from the live site's API so the freshly built,
// prerendered pages already contain it. Safe to fail — the build then uses the built-in defaults / last snapshot.
import fs from 'node:fs';
import path from 'node:path';
import { sanitize } from '../src/content/sanitize.js';

const out = path.resolve('src/content/live.json');
const base = process.env.WELKIN_CONTENT_URL || process.env.URL;
if (process.env.SKIP_CONTENT_FETCH || !base) {
  console.log('content: using built-in defaults (no site URL to fetch from)');
  process.exit(0);
}
try {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 10000);
  const r = await fetch(new URL('/api/content', base), { signal: ctl.signal, headers: { accept: 'application/json' } });
  clearTimeout(t);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const d = await r.json();
  if (!d || !d.content || !(d.version > 0)) throw new Error('no published content yet');
  const { content, errors } = sanitize(d.content);
  if (errors.length) throw new Error(`invalid content: ${errors[0]}`);
  fs.writeFileSync(out, JSON.stringify({ version: d.version, content }));
  console.log(`content: fetched published version ${d.version}`);
} catch (e) {
  console.log(`content: could not fetch live content (${e.message}); using ${fs.existsSync(out) ? 'last snapshot' : 'built-in defaults'}`);
}
