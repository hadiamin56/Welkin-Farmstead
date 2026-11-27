// WhatsApp number comes from the editable content; the provider calls setWhatsApp() with the current value.
let NUM = '917006901374';
export const setWhatsApp = (n) => { if (n) NUM = n; };

/** WhatsApp deep link with a pre-filled message. */
export const wa = (msg) => `https://wa.me/${NUM}?text=${encodeURIComponent(msg)}`;

/** "top:20px;left:-30px" -> { top: '20px', left: '-30px' } (custom properties kept as-is). */
export function parseStyle(str) {
  const out = {};
  if (!str) return out;
  str.split(';').forEach((decl) => {
    const i = decl.indexOf(':');
    if (i < 0) return;
    const k = decl.slice(0, i).trim();
    const v = decl.slice(i + 1).trim();
    if (!k) return;
    out[k.startsWith('--') ? k : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
  });
  return out;
}
