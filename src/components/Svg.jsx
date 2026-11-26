import { ICONS, SPRITE_D, SPRITE_A, SKYLINE_INNER, SKYLINE_VIEWBOX, VB_A } from '../art/generated.js';

/** Inline UI icon (24px line icons). Markup is static, trusted art from art/generated.js. */
export function Icon({ name, ...rest }) {
  const { attrs, inner } = ICONS[name];
  return <svg {...attrs} {...rest} dangerouslySetInnerHTML={{ __html: inner }} />;
}

/** Hidden SVG sprites referenced by <use href="#d-…"> and <use href="#a-…">. */
export function Sprites() {
  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: `<defs>${SPRITE_D}</defs>` }} />
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: `<defs>${SPRITE_A}</defs>` }} />
    </>
  );
}

/** Line-art botanical used inline (journey stops, sheet rows). */
export function AIcon({ name, className = '' }) {
  return (
    <svg className={`ai${className ? ' ' + className : ''}`} viewBox={VB_A[name]} aria-hidden="true" focusable="false">
      <use href={`#a-${name}`} />
    </svg>
  );
}

export function Skyline() {
  return (
    <div className="skyline" aria-hidden="true">
      <svg viewBox={SKYLINE_VIEWBOX} preserveAspectRatio="xMidYMax slice" dangerouslySetInnerHTML={{ __html: SKYLINE_INNER }} />
    </div>
  );
}
