// Brand colours editable in the admin. Only values that differ from the defaults are applied, so the
// untouched site is byte-for-byte what it always was.
export const THEME_DEFAULTS = { green: '#1f5a3a', accent: '#c4382c', dark: '#123d27', lime: '#8dc63f' };

const hex = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
const toHex = (a) => `#${a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;
const mix = (a, b, t) => toHex(hex(a).map((v, i) => v * (1 - t) + hex(b)[i] * t));

/** CSS custom properties for the current theme (empty object when nothing was changed). */
export function themeVars(theme) {
  const t = { ...THEME_DEFAULTS, ...(theme || {}) };
  const out = {};
  if (t.green !== THEME_DEFAULTS.green) {
    out['--green'] = t.green;
    out['--green2'] = mix(t.green, '#000000', 0.22);
    out['--soft'] = mix(t.green, '#ffffff', 0.89);
  }
  if (t.accent !== THEME_DEFAULTS.accent) out['--apple'] = t.accent;
  if (t.dark !== THEME_DEFAULTS.dark) out['--dark'] = t.dark;
  if (t.lime !== THEME_DEFAULTS.lime) out['--lime'] = t.lime;
  return out;
}

export function themeCss(theme) {
  const v = themeVars(theme);
  const keys = Object.keys(v);
  return keys.length ? `:root{${keys.map((k) => `${k}:${v[k]}`).join(';')}}` : '';
}
