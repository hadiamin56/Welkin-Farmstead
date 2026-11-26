export const SITE = 'Welkin Farmstead';
export const WA_NUM = '917006901374';
export const PHONE_TEL = 'tel:+917006901374';
export const EMAIL = 'waseemhajini86@gmail.com';
export const INSTAGRAM = 'https://www.instagram.com/welkinfarmstead/';
export const FACEBOOK = 'https://www.facebook.com/welkinfarmstead/';
export const MAPQ = 'Welkin+Farmstead,+Sopore,+Kashmir+193201';

/** WhatsApp deep link with a pre-filled message. */
export const wa = (msg) => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;

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
