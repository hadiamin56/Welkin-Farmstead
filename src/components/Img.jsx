import { PHOTOS } from '../art/generated.js';

/** Works out the size and phone-sized copy of a photo from its path (built-in photos or admin uploads). */
function describe(src) {
  const b = /^\/assets\/photos\/([\w-]+)\.jpg$/.exec(src);
  if (b) {
    const e = PHOTOS[`${b[1]}.jpg`];
    if (e) return { w: e[0], h: e[1], small: e[2] ? `/assets/photos/${b[1]}-800.jpg` : null };
  }
  const u = /^\/media\/([\w]+-(\d+)x(\d+))\.(jpg|jpeg|png|webp)$/.exec(src);
  if (u) return { w: Number(u[2]), h: Number(u[3]), small: `/media/${u[1]}-800.${u[4]}` };
  return { w: undefined, h: undefined, small: null };
}

/** Responsive photo: 800px copy for phones, full size above, explicit dimensions to avoid layout shift. */
export function Img({ file, alt, sizes = '100vw', eager = false }) {
  if (!file) return null;
  const { w, h, small } = describe(file);
  const srcSet = small && w ? `${small} 800w, ${file} ${w}w` : undefined;
  const load = eager ? { fetchpriority: 'high' } : { loading: 'lazy', decoding: 'async' };
  return <img src={file} srcSet={srcSet} sizes={srcSet ? sizes : undefined} alt={alt} width={w} height={h} {...load} />;
}

/** Photo in the rounded frame, with an optional caption chip. */
export function Ph({ file, cap = '', cls = '', alt, sizes, eager }) {
  return (
    <figure className={`ph ${cls}`.trimEnd()}>
      <Img file={file} alt={alt || cap || 'Welkin Farmstead'} sizes={sizes} eager={eager} />
      {cap && <span className="cap">{cap}</span>}
    </figure>
  );
}
