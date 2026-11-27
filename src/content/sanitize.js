// Validates and cleans a content document against the schema. Used by the server on every save (so nothing
// malformed or unsafe can reach the public site) and by the admin to normalise imports.
import { ROOT } from './schema.js';
import { DEFAULTS } from './defaults.js';
export { withDefaults, diffPaths } from './merge.js';

const CTRL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const IMG = /^\/(?:assets\/photos|media)\/[A-Za-z0-9._-]{1,120}\.(?:jpe?g|png|webp)$/;
const URLOK = /^(?:https?:\/\/[^\s<>"']+|tel:\+?[\d\s-]{3,20}|mailto:[^\s<>"']+|\/[^\s<>"']*)?$/;
const PATTERNS = {
  digits: (s) => /^\d{8,15}$/.test(s),
  phone: (s) => /^\+?\d[\d\s-]{6,18}$/.test(s),
  email: (s) => s === '' || /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(s),
  slug: (s) => /^[a-z0-9][a-z0-9-]{0,39}$/.test(s),
};

const clone = (v) => JSON.parse(JSON.stringify(v));
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

function str(v, max) {
  if (typeof v === 'number') v = String(v);
  if (typeof v !== 'string') return null;
  return v.replace(CTRL, '').slice(0, max);
}

function clean(f, v, d, errors, path) {
  const fail = (msg) => { errors.push(`${path}: ${msg}`); return clone(d); };
  switch (f.t) {
    case 'text':
    case 'area': {
      const s = str(v, f.max || 200);
      if (s === null) return clone(d);
      if (f.pattern && s !== '' && !PATTERNS[f.pattern](s.trim())) return fail(`invalid ${f.pattern}`);
      return f.pattern ? s.trim() : s;
    }
    case 'url': {
      const s = str(v, f.max || 300);
      if (s === null) return clone(d);
      return URLOK.test(s.trim()) ? s.trim() : fail('invalid link');
    }
    case 'image': {
      const s = str(v, 200);
      if (s === null) return clone(d);
      return s === '' || IMG.test(s) ? s : fail('invalid image path');
    }
    case 'select': {
      const ok = f.options.includes(f.numeric ? Number(v) : v);
      return ok ? (f.numeric ? Number(v) : v) : clone(d);
    }
    case 'color': {
      const s = typeof v === 'string' ? v.trim().toLowerCase() : '';
      return /^#[0-9a-f]{6}$/.test(s) ? s : clone(d);
    }
    case 'toggle': return typeof v === 'boolean' ? v : clone(d);
    case 'number': {
      const n = Number(v);
      if (!Number.isFinite(n)) return clone(d);
      const x = f.float ? n : Math.round(n);
      return Math.min(f.max, Math.max(f.min, x));
    }
    case 'productPicks': return Array.isArray(v) ? v.filter((x) => typeof x === 'string' && PATTERNS.slug(x)).slice(0, f.max || 4) : clone(d);
    case 'group': {
      if (!isObj(v)) return clone(d);
      const out = {};
      for (const sub of f.fields) out[sub.k] = clean(sub, v[sub.k], d && d[sub.k], errors, `${path}.${sub.k}`);
      return out;
    }
    case 'list': {
      if (!Array.isArray(v)) return clone(d);
      const max = f.max || 40;
      const items = v.slice(0, max);
      if (f.scalar) return items.map((x) => str(x, f.itemMax || 160)).filter((x) => x !== null && x.trim() !== '');
      const out = [];
      items.forEach((it, i) => {
        if (!isObj(it)) return;
        const one = {};
        for (const sub of f.item) one[sub.k] = clean(sub, it[sub.k], sub.t === 'toggle' ? true : undefined, errors, `${path}[${i}].${sub.k}`);
        out.push(one);
      });
      if (f.min && out.length < f.min) { errors.push(`${path}: needs at least ${f.min}`); return clone(d); }
      return out;
    }
    default: return clone(d);
  }
}

/** Returns { content, errors }. Missing sections fall back to the built-in defaults. */
export function sanitize(input, base = DEFAULTS) {
  const errors = [];
  const src = isObj(input) ? input : {};
  const content = {};
  for (const f of ROOT) content[f.k] = clean(f, src[f.k] !== undefined ? src[f.k] : base[f.k], base[f.k], errors, f.k);

  // product ids must be unique
  const seen = new Set();
  content.products = content.products.map((p, i) => {
    let id = p.id || `product-${i + 1}`;
    while (seen.has(id)) id = `${id}-${i + 1}`.slice(0, 40);
    seen.add(id);
    return { ...p, id };
  });
  content.home.shop.featured = content.home.shop.featured.filter((id) => seen.has(id));

  // every home block must appear exactly once (new blocks are appended, duplicates dropped)
  const have = new Set();
  const layout = content.home.layout.filter((b) => (have.has(b.id) ? false : have.add(b.id)));
  for (const b of base.home.layout) if (!have.has(b.id)) layout.push({ ...b });
  content.home.layout = layout;
  return { content, errors };
}

