// Password hashing (scrypt), signed session tokens (HS256) and cookie helpers. Built-in crypto only.
import crypto from 'node:crypto';

export const COOKIE = 'welkin_admin';
export const SESSION_SECONDS = 12 * 60 * 60;

export function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(pw, salt, 64);
  return `s1:${salt.toString('hex')}:${key.toString('hex')}`;
}
export function verifyPassword(pw, stored) {
  try {
    const [v, saltHex, keyHex] = String(stored).split(':');
    if (v !== 's1') return false;
    const key = crypto.scryptSync(pw, Buffer.from(saltHex, 'hex'), 64);
    const want = Buffer.from(keyHex, 'hex');
    return key.length === want.length && crypto.timingSafeEqual(key, want);
  } catch { return false; }
}
export const safeEqual = (a, b) => {
  const x = Buffer.from(String(a)); const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

const b64u = (b) => Buffer.from(b).toString('base64url');
export function secret() {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 16) return process.env.JWT_SECRET;
  const prod = process.env.NETLIFY === 'true' || process.env.NODE_ENV === 'production';
  return prod ? null : 'dev-only-secret-not-for-production';
}
export function sign(payload) {
  const s = secret();
  if (!s) throw new Error('JWT_SECRET is not set');
  const head = b64u(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64u(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS }));
  const sig = crypto.createHmac('sha256', s).update(`${head}.${body}`).digest('base64url');
  return `${head}.${body}.${sig}`;
}
export function verify(token) {
  const s = secret();
  if (!s || typeof token !== 'string') return null;
  const [h, b, sig] = token.split('.');
  if (!h || !b || !sig) return null;
  const want = crypto.createHmac('sha256', s).update(`${h}.${b}`).digest('base64url');
  if (!safeEqual(sig, want)) return null;
  try {
    const p = JSON.parse(Buffer.from(b, 'base64url').toString());
    return p.exp && p.exp > Math.floor(Date.now() / 1000) ? p : null;
  } catch { return null; }
}

export function readCookie(req, name) {
  const raw = req.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}
export function sessionCookie(token, req) {
  const secure = new URL(req.url).protocol === 'https:' || req.headers.get('x-forwarded-proto') === 'https';
  return `${COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}${secure ? '; Secure' : ''}`;
}
export const clearCookie = () => `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
