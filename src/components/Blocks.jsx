import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { DecoWrap } from './Deco.jsx';
import { Fade } from './Fade.jsx';
export { Fade };
import { Ph } from './Img.jsx';
import { BAND_DECO } from '../data/content.js';
import { wa } from '../lib/site.js';
import { useContent } from '../content/ContentContext.jsx';

/** A page section. kind: '' | 'tint' | 'dark' | 'aqua'. decos: background drawings. */
export function Sec({ kind = '', id, decos, children }) {
  return (
    <section className={`sec${kind ? ' ' + kind : ''}`} id={id}>
      {decos && <DecoWrap items={decos} />}
      <div className="wrap">{children}</div>
    </section>
  );
}

export function Sh({ eyebrow, title, sub }) {
  return (
    <header className="sh">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {sub && <p className="sub">{sub}</p>}
    </header>
  );
}

export function Split({ left, right, rev = false }) {
  return (
    <div className={`split${rev ? ' rev' : ''}`}>
      <div className="sp-l">{left}</div>
      <div className="sp-r">{right}</div>
    </div>
  );
}

export function Steps({ items }) {
  return (
    <ol className="steps">
      {items.map(([t, d], i) => (
        <Fade as="li" key={t}><b>{i + 1}</b><div><h3>{t}</h3><p>{d}</p></div></Fade>
      ))}
    </ol>
  );
}

export function Ticks({ items }) {
  return <ul className="ticks">{items.map((t) => <li key={t}>{t}</li>)}</ul>;
}

/** Green call-to-action band. `action` is a ready-made button element. */
export function Band({ title, text, action }) {
  return (
    <section className="sec">
      <div className="wrap">
        <Fade className="band">
          <DecoWrap.Inline items={BAND_DECO} />
          <div><h2>{title}</h2><p>{text}</p></div>
          {action}
        </Fade>
      </div>
    </section>
  );
}

/** Button that opens WhatsApp with a message. */
export function WaButton({ msg, children, cls = 'btn btn-green' }) {
  return <a className={cls} href={wa(msg)} target="_blank" rel="noopener">{children}</a>;
}

export function EnqBand() {
  const { enq } = useContent();
  return (
    <Band
      title={enq.title}
      text={enq.text}
      action={<WaButton cls="btn btn-light" msg={enq.msg}>{enq.button}</WaButton>}
    />
  );
}

export function Crumbs({ trail }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {trail.map(([label, to], i) => (
        <Fragment key={label}>
          {i > 0 && ' '}
          {i > 0 && <span>/</span>}
          {i > 0 && ' '}
          {to ? <Link to={to}>{label}</Link> : <b>{label}</b>}
        </Fragment>
      ))}
    </nav>
  );
}

/** Page header with title, intro, buttons and a wide banner photo. */
export function PageHead({ trail, title, lead, banner, bannerAlt, ctas }) {
  return (
    <section className="phead">
      <div className="wrap">
        <Crumbs trail={trail} />
        <div className="ph-top">
          <h1>{title}</h1>
          <div><p className="lead">{lead}</p>{ctas && <div className="actions">{ctas}</div>}</div>
        </div>
        <Ph file={banner} cls="banner" alt={bannerAlt} sizes="(min-width:1140px) 1140px, 100vw" eager />
      </div>
    </section>
  );
}
