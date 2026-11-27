// Local stand-in for Netlify: serves the built site from ./dist plus the same API the Netlify Function runs.
//   node scripts/dev-server.mjs [port]      (data is kept in ./.data, or WELKIN_DATA_DIR)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { handle } from '../server/handler.mjs';

const port = Number(process.argv[2] || process.env.PORT || 8888);
const root = path.resolve(process.env.WELKIN_DIST || 'dist');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };

function resolveStatic(urlPath) {
  const p = decodeURIComponent(urlPath.split('?')[0]);
  const safe = path.normalize(p).replace(/^(\.\.[/\\])+/, '');
  const cands = [safe, path.join(safe, 'index.html')];
  if (safe === '/admin' || safe.startsWith('/admin/')) cands.unshift('/admin/index.html');
  for (const c of cands) {
    const f = path.join(root, c);
    if (f.startsWith(root) && fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  }
  return null;
}

http.createServer(async (nreq, nres) => {
  try {
    const url = `http://${nreq.headers.host}${nreq.url}`;
    const p = new URL(url).pathname;
    if (p.startsWith('/api/') || p.startsWith('/media/')) {
      const chunks = [];
      for await (const c of nreq) chunks.push(c);
      const body = chunks.length ? Buffer.concat(chunks) : undefined;
      const req = new Request(url, { method: nreq.method, headers: nreq.headers, body: ['GET', 'HEAD'].includes(nreq.method) ? undefined : body, duplex: 'half' });
      const res = await handle(req);
      const headers = {};
      res.headers.forEach((v, k) => { if (k !== 'set-cookie') headers[k] = v; });
      const cookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
      if (cookies.length) headers['set-cookie'] = cookies;
      nres.writeHead(res.status, headers);
      nres.end(Buffer.from(await res.arrayBuffer()));
      return;
    }
    let f = resolveStatic(p);
    let status = 200;
    if (!f) { f = path.join(root, '404.html'); status = 404; }
    nres.writeHead(status, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(nres);
  } catch (e) {
    console.error(e);
    nres.writeHead(500); nres.end('error');
  }
}).listen(port, () => console.log(`dev server on http://localhost:${port}  (static: ${root})`));
