// Used by the visual editor: given text or an image that was clicked on the live page, find which content
// field(s) it came from. Works on the content document itself, so no page markup needs annotating.
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const IMG = /^\/(?:assets\/photos|media)\//;

/** Flat list of every editable string/image in the document, with its path. */
export function leaves(content) {
  const out = [];
  const walk = (v, path) => {
    if (typeof v === 'string') { if (v.trim()) out.push({ path, value: v, image: IMG.test(v) }); return; }
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, [...path, i])); return; }
    if (v && typeof v === 'object') Object.keys(v).forEach((k) => walk(v[k], [...path, k]));
  };
  walk(content, []);
  return out;
}

// Which top-level content areas belong to which page (used to rank ambiguous matches).
const PAGE_KEYS = {
  '/': ['home', 'products', 'locations', 'findUs', 'site'], '/shop': ['shop', 'products', 'enq'], '/orchard': ['orchard', 'enq'],
  '/aquaculture': ['aquaculture', 'enq'], '/livestock': ['livestock', 'enq'], '/visits': ['visits'], '/seasons': ['seasonsPage', 'crops', 'enq'],
  '/careers': ['careersPage', 'roles'], '/gallery': ['galleryPage', 'gallery', 'home'], '/contact': ['contactPage', 'faq', 'orderItems', 'locations', 'findUs', 'site'],
};

// Sections of the page and the content they show — lets a click be matched by *where* it happened.
export const CONTEXTS = [
  ['.strip', ['home', 'strip']], ['#journey', ['home', 'journey']], ['.feats', ['home', 'why']], ['.tiles', ['home', 'farm']],
  ['.facts', ['home', 'facts']], ['.slist', ['crops']], ['.faq', ['faq']], ['.roles', ['roles']], ['.gal', ['gallery']], ['.footer', ['site']],
  ['.annc', ['site', 'announcement']], ['.qb', ['site', 'qurbaniCard']],
];

const startsWith = (path, prefix) => prefix.every((k, i) => path[i] === k);

const rank = (path, route, prefix) => {
  if (prefix && startsWith(path, prefix)) return -1;
  const keys = PAGE_KEYS[route] || [];
  const i = keys.indexOf(path[0]);
  let r = i < 0 ? 99 : i;
  // the ticker repeats product names, so only prefer it when the click was in the ticker
  if (path[0] === 'home' && path[1] === 'strip') r += 40;
  return r;
};

/** Paths whose text matches what was clicked, best match first. */
export function locateText(index, text, route, prefix) {
  const t = norm(text);
  if (!t) return [];
  const exact = index.filter((l) => !l.image && norm(l.value) === t);
  let hits = exact;
  if (!hits.length && t.length >= 4) {
    // headings built from two fields ("Goodness you can" + "trace.") or text with a line break
    hits = index.filter((l) => !l.image && l.value.trim().length >= 4 && (t.includes(norm(l.value)) || norm(l.value).includes(t)));
  }
  return hits.map((l) => l.path).sort((a, b) => rank(a, route, prefix) - rank(b, route, prefix));
}

/** Paths whose image matches the <img> that was clicked (phone-sized copies map back to the original). */
export function locateImage(index, src, route, prefix) {
  const u = src.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
  const base = u.replace(/-800(\.[a-z]+)$/i, '$1');
  const hits = index.filter((l) => l.image && (l.value === u || l.value === base));
  return hits.map((l) => l.path).sort((a, b) => rank(a, route, prefix) - rank(b, route, prefix));
}
