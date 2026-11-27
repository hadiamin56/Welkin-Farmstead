// Renders every page to static HTML (so search engines and slow phones get real content),
// then the browser hydrates it into the live React app. Also writes the (empty, noindex) admin shell.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const { render, routeList } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function head(html, r) {
  return html
    .replace(/<title>.*?<\/title>/s, `<title>${esc(r.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(r.desc)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(r.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(r.desc)}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${esc(r.og)}$2`)
    .replace(/<body data-page="[^"]*">/, `<body data-page="${r.active}">`);
}

let count = 0;
for (const r of routeList()) {
  const { html } = render(r.url);
  const out = path.join(dist, r.file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, head(template.replace('<!--app-html-->', html), r));
  count += 1;
}

// Admin: no server-rendered content, never indexed.
const adminShell = template
  .replace(/<title>.*?<\/title>/s, '<title>Admin · Welkin Farmstead</title>')
  .replace(/<meta name="description"[^>]*>\n?/, '')
  .replace(/<meta property="og:[^>]*>\n?/g, '')
  .replace(/<script type="application\/ld\+json">.*?<\/script>\n?/s, '')
  .replace('<head>', '<head>\n<meta name="robots" content="noindex,nofollow">')
  .replace('<!--app-html-->', '')
  .replace(/<body data-page="[^"]*">/, '<body data-page="admin">');
fs.mkdirSync(path.join(dist, 'admin'), { recursive: true });
fs.writeFileSync(path.join(dist, 'admin/index.html'), adminShell);

fs.rmSync(path.resolve('dist-ssr'), { recursive: true, force: true });
console.log(`prerendered ${count} pages + admin shell`);
