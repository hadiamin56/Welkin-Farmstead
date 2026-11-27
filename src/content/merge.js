// Small pure helpers shared by the public site, the admin and the server.
import { DEFAULTS } from './defaults.js';

const clone = (v) => JSON.parse(JSON.stringify(v));
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

/** Fill any gaps in a (possibly older) document with defaults, without validating. */
export function withDefaults(doc) {
  const merge = (def, val) => {
    if (Array.isArray(def)) return Array.isArray(val) ? val : clone(def);
    if (isObj(def)) {
      const out = {};
      for (const k of Object.keys(def)) out[k] = merge(def[k], isObj(val) ? val[k] : undefined);
      return out;
    }
    return val === undefined || val === null ? def : val;
  };
  return merge(DEFAULTS, doc || {});
}

/** Which dot-paths differ between two documents (for the "N changes" summary). */
export function diffPaths(a, b, base = '', out = []) {
  if (Array.isArray(a) || Array.isArray(b) || !isObj(a) || !isObj(b)) {
    if (JSON.stringify(a) !== JSON.stringify(b)) out.push(base);
    return out;
  }
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diffPaths(a[k], b[k], base ? `${base}.${k}` : k, out);
  return out;
}
