import { PHOTOS } from '../art/generated.js';

const base = (f) => f.replace(/\.jpg$/, '');

/** Responsive photo: 800px copy for phones, full size above, explicit dimensions to avoid layout shift. */
export function Img({ file, alt, sizes = '100vw', eager = false }) {
  const [w, h, small] = PHOTOS[file];
  const srcSet = small ? `/assets/photos/${base(file)}-800.jpg 800w, /assets/photos/${file} ${w}w` : undefined;
  const load = eager ? { fetchpriority: 'high' } : { loading: 'lazy', decoding: 'async' };
  return <img src={`/assets/photos/${file}`} srcSet={srcSet} sizes={srcSet ? sizes : undefined} alt={alt} width={w} height={h} {...load} />;
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
