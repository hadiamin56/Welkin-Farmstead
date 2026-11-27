// Storage: Netlify Blobs on Netlify, plain files for local development and tests.
import fs from 'node:fs/promises';
import path from 'node:path';

const enc = (k) => encodeURIComponent(k).replace(/%/g, '~');

function fsStore(root) {
  const file = (k) => path.join(root, enc(k));
  return {
    kind: 'files',
    async getJSON(k) { try { return JSON.parse(await fs.readFile(file(k), 'utf8')); } catch { return null; } },
    async setJSON(k, v) { await fs.mkdir(root, { recursive: true }); await fs.writeFile(file(k), JSON.stringify(v)); },
    async del(k) { await fs.rm(file(k), { force: true }); await fs.rm(file(k) + '.meta', { force: true }); },
    async list(prefix) {
      try {
        const names = await fs.readdir(root);
        return names.filter((n) => !n.endsWith('.meta')).map((n) => decodeURIComponent(n.replace(/~/g, '%'))).filter((k) => k.startsWith(prefix));
      } catch { return []; }
    },
    async getBin(k) {
      try {
        const data = await fs.readFile(file(k));
        let meta = {};
        try { meta = JSON.parse(await fs.readFile(file(k) + '.meta', 'utf8')); } catch { /* none */ }
        return { data, meta };
      } catch { return null; }
    },
    async setBin(k, data, meta) { await fs.mkdir(root, { recursive: true }); await fs.writeFile(file(k), data); await fs.writeFile(file(k) + '.meta', JSON.stringify(meta || {})); },
  };
}

async function blobStore() {
  const { getStore } = await import('@netlify/blobs');
  const s = getStore({ name: 'welkin', consistency: 'strong' });
  return {
    kind: 'netlify-blobs',
    async getJSON(k) { return s.get(k, { type: 'json' }); },
    async setJSON(k, v) { await s.setJSON(k, v); },
    async del(k) { await s.delete(k); },
    async list(prefix) {
      const out = [];
      let cursor;
      do {
        const r = await s.list({ prefix, ...(cursor ? { cursor } : {}) });
        (r.blobs || []).forEach((b) => out.push(b.key));
        cursor = r.cursor;
      } while (cursor);
      return out;
    },
    async getBin(k) {
      const r = await s.getWithMetadata(k, { type: 'arrayBuffer' });
      return r ? { data: Buffer.from(r.data), meta: r.metadata || {} } : null;
    },
    async setBin(k, data, meta) { await s.set(k, data, { metadata: meta || {} }); },
  };
}

let cached;
export async function getStore() {
  if (cached) return cached;
  const onNetlify = process.env.NETLIFY === 'true' || !!process.env.NETLIFY_BLOBS_CONTEXT;
  cached = process.env.WELKIN_STORE === 'files' || !onNetlify ? fsStore(process.env.WELKIN_DATA_DIR || path.resolve('.data')) : await blobStore();
  return cached;
}
export function resetStoreCache() { cached = undefined; }
