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
  const img = <img src={file} srcSet={srcSet} sizes={srcSet ? sizes : undefined} alt={alt} width={w} height={h} {...load} />;
  if (!/^\/assets\/photos\/.+\.jpg$/.test(file)) return img;
  const wp = (x) => x.replace(/\.jpg$/, '.webp');
  const ws = small && w ? `${wp(small)} 800w, ${wp(file)} ${w}w` : wp(file);
  return <picture><source type="image/webp" srcSet={ws} sizes={srcSet ? sizes : undefined} />{img}</picture>;
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
