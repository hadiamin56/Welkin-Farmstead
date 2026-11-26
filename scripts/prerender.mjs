// Renders every page to static HTML (so search engines and slow phones get real content),
// then the browser hydrates it into the live React app.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROUTES, NOT_FOUND, OG_IMAGE } from '../src/data/routes.js';

const dist = path.resolve('dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const { render } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function head(html, r) {
  return html
    .replace(/<title>.*?<\/title>/s, `<title>${esc(r.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(r.desc)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(r.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(r.desc)}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${OG_IMAGE}$2`)
    .replace(/<body data-page="[^"]*">/, `<body data-page="${r.active}">`);
}

let count = 0;
for (const r of [...ROUTES, NOT_FOUND]) {
  const url = r.path === '*' ? '/page-not-found' : r.path;
  const { html } = render(url);
  const page = head(template.replace('<!--app-html-->', html), r);
  const out = path.join(dist, r.file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page);
  count += 1;
}
fs.rmSync(path.resolve('dist-ssr'), { recursive: true, force: true });
console.log(`prerendered ${count} pages`);
