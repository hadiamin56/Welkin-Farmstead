import { VB_A } from '../art/generated.js';
import { parseStyle } from '../lib/site.js';

/** Faint line-art drawing positioned absolutely inside a .deco-wrap. */
export function Deco({ n, pos = 'tr', w = 300, rot = 0, flip = false, cls = '', op, at = '' }) {
  const transform = [rot ? `rotate(${rot}deg)` : '', flip ? 'scaleX(-1)' : ''].filter(Boolean).join(' ');
  const style = { '--w': `${w}px`, ...parseStyle(at) };
  if (transform) style.transform = transform;
  if (op !== undefined) style.opacity = op;
  return (
    <svg className={`deco ${pos} ${cls}`} viewBox={VB_A[n]} style={style} aria-hidden="true" focusable="false">
      <use href={`#a-${n}`} />
    </svg>
  );
}

export function Decos({ items }) {
  return items.map((d, i) => <Deco key={i} {...d} />);
}

/** Wrapper that clips the drawings to their section. */
export function DecoWrap({ items, className = '', children }) {
  return (
    <div className={`${className ? className + ' ' : ''}deco-wrap`.trim()} aria-hidden="true">
      {items && <Decos items={items} />}
      {children}
    </div>
  );
}

/** Drawings rendered directly inside their parent (no wrapper element). */
DecoWrap.Inline = function Inline({ items }) {
  return <Decos items={items} />;
};
