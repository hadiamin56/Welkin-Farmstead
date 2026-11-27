// Thin wrapper around the admin API. Every request carries the custom header the server requires (CSRF protection).
export class ApiError extends Error {
  constructor(status, message, data) { super(message); this.status = status; this.data = data; }
}

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

export async function api(method, path, body) {
  const opts = { method, credentials: 'same-origin', headers: { 'x-admin': '1' } };
  if (body instanceof FormData) opts.body = body;
  else if (body !== undefined) { opts.body = JSON.stringify(body); opts.headers['content-type'] = 'application/json'; }
  let res;
  try { res = await fetch(`/api/admin/${path}`, opts); } catch { throw new ApiError(0, 'Could not reach the server. Check your connection.'); }
  const ct = res.headers.get('content-type') || '';
  const data = ct.includes('json') ? await res.json().catch(() => ({})) : await res.text();
  if (!res.ok) {
    if (res.status === 401 && path !== 'login' && path !== 'me') onUnauthorized();
    throw new ApiError(res.status, (data && data.error) || `Request failed (${res.status})`, data);
  }
  return data;
}

/** Resize an image in the browser so uploads stay small: 1600px (display) + 800px (phones) JPEGs. */
export async function prepareImage(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error('Choose a JPG, PNG or WebP image.');
  const bmp = await createImageBitmap(file);
  const draw = (maxW, quality) => {
    const scale = Math.min(1, maxW / bmp.width);
    const w = Math.max(1, Math.round(bmp.width * scale)); const h = Math.max(1, Math.round(bmp.height * scale));
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.drawImage(bmp, 0, 0, w, h);
    return new Promise((res) => c.toBlob((b) => res({ blob: b, w, h }), 'image/jpeg', quality));
  };
  let large = await draw(1600, 0.82);
  for (let q = 0.74; large.blob.size > 2 * 1024 * 1024 && q > 0.4; q -= 0.1) large = await draw(1600, q);
  const small = bmp.width > 800 ? await draw(800, 0.8) : large;
  bmp.close && bmp.close();
  return { large, small };
}

export async function uploadImage(file) {
  const { large, small } = await prepareImage(file);
  const fd = new FormData();
  fd.set('large', large.blob, 'large.jpg'); fd.set('small', small.blob, 'small.jpg');
  fd.set('w', String(large.w)); fd.set('h', String(large.h)); fd.set('name', file.name.replace(/\.[^.]+$/, ''));
  return api('POST', 'media', fd);
}
