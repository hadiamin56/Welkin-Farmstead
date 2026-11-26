import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Fade } from './Fade.jsx';
import { Ph, Img } from './Img.jsx';
import { Icon } from './Svg.jsx';
import { Social } from './Shell.jsx';
import { VB_D } from '../art/generated.js';
import { CROPS, MONTHS, MONTHS_FULL, FEATURES, TILES, STRIP, FAQ, GALLERY, ROLES, ORDER_ITEMS, SHOP_FILTERS } from '../data/content.js';
import { wa } from '../lib/site.js';

/* ---------- products ---------- */
export function ProductCard({ p }) {
  return (
    <Fade as="article" className="card" data-cat={p.cat} hidden={p.hidden || undefined}>
      <Ph file={p.file} cap={p.name} sizes="(min-width:980px) 270px, 50vw" />
      <div className="cb">
        <h3>{p.name}</h3>
        <p>{p.text}</p>
        <a className="link" href={wa(p.msg)} target="_blank" rel="noopener">Enquire on WhatsApp →</a>
      </div>
    </Fade>
  );
}

/** Info-only card (no enquiry link). */
export function InfoCard({ file, title, text, sizes = '(min-width:980px) 270px, 50vw' }) {
  return (
    <Fade as="article" className="card">
      <Ph file={file} cap={title} sizes={sizes} />
      <div className="cb"><h3>{title}</h3><p>{text}</p></div>
    </Fade>
  );
}

export function ShopFilters({ value, onChange }) {
  return (
    <div className="chips" role="group" aria-label="Filter products">
      {SHOP_FILTERS.map((f) => (
        <button key={f.f} className={value === f.f ? 'on' : undefined} data-f={f.f} onClick={() => onChange(f.f)}>{f.label}</button>
      ))}
    </div>
  );
}

export function Tiles() {
  return (
    <div className="tiles">
      {TILES.map((t) => (
        <Fade as={Link} className="tile" to={t.to} key={t.to}>
          <Img file={t.file} alt={t.title} sizes="(min-width:980px) 270px, 50vw" />
          <div className="tt"><h3>{t.title}</h3><p>{t.text}</p><span>Explore →</span></div>
        </Fade>
      ))}
    </div>
  );
}

export function Features() {
  return (
    <div className="feats">
      {FEATURES.map((f, i) => (
        <div className="feat" key={f.title}>
          <span className="num">{`0${i + 1}`}</span>
          <span className="ic"><Icon name={f.icon} /></span>
          <h3>{f.title}</h3>
          <p>{f.text}</p>
        </div>
      ))}
    </div>
  );
}

/** Scrolling ticker of what we grow. Decorative, so hidden from screen readers. */
export function Strip() {
  const one = (k) => STRIP.words.map((w, i) => {
    const ic = STRIP.icons[i];
    const [vw, vh] = VB_D[ic];
    return <span key={`${k}${w}`}><svg viewBox={`0 0 ${vw} ${vh}`} aria-hidden="true"><use href={`#d-${ic}`} /></svg>{w}</span>;
  });
  return <div className="strip" aria-hidden="true"><div className="stk">{one('a')}{one('b')}</div></div>;
}

export function Faq() {
  return (
    <div className="faq">
      {FAQ.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
    </div>
  );
}

export function FollowBand() {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="follow">
          <div><h2>Follow the farm</h2><p>Daily updates, harvests and new arrivals on Instagram and Facebook.</p></div>
          <Social big />
        </div>
      </div>
    </section>
  );
}

export function Roles() {
  return (
    <div className="roles">
      {ROLES.map((r) => (
        <Fade className="role" key={r.t}>
          <div><h3>{r.t}</h3><p>{r.d}</p></div>
          <a className="btn btn-ghost btn-sm" href={wa(`Salaam Welkin Farmstead! I am interested in the ${r.t} role. My name is ___ and I have ___ experience.`)} target="_blank" rel="noopener">Apply</a>
        </Fade>
      ))}
    </div>
  );
}

/* ---------- seasons ---------- */
export function SeasonItems({ month }) {
  if (month === null) return null;
  const items = CROPS.filter((c) => month >= c[2] && month <= c[3]);
  if (!items.length) return <li className="empty">Nothing listed for {MONTHS_FULL[month]}.</li>;
  return items.map(([name, note, from, to]) => {
    const all = from === 0 && to === 11;
    const tag = all ? <span className="tag all">All year</span>
      : month === from ? <span className="tag">Just in</span>
        : month === to ? <span className="tag last">Last call</span>
          : <span className="tag">In season</span>;
    return <li key={name}><div><b>{name}</b>{note && <small>{note}</small>}</div>{tag}</li>;
  });
}

/** Current calendar month, known only on the client (so server HTML never goes stale). */
export function useThisMonth() {
  const [m, setM] = useState(null);
  useEffect(() => { setM(new Date().getMonth()); }, []);
  return m;
}

export function SeasonList() {
  const now = useThisMonth();
  return <ul className="slist" id="slist" aria-live="polite"><SeasonItems month={now} /></ul>;
}

export function SeasonPicker() {
  const now = useThisMonth();
  const [picked, setPicked] = useState(null);
  const month = picked ?? now;
  const listRef = useRef(null);

  useEffect(() => {
    if (now === null) return;
    const sel = listRef.current && listRef.current.querySelector('.sel');
    if (sel) sel.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [now]);

  return (
    <Fade className="season-box">
      <div className="months" id="months" role="tablist" aria-label="Month" ref={listRef}>
        {MONTHS.map((m, i) => (
          <button key={m} type="button" role="tab" aria-selected={month === i} className={[i === now ? 'now' : '', i === month ? 'sel' : ''].filter(Boolean).join(' ') || undefined} onClick={() => setPicked(i)}>{m}</button>
        ))}
      </div>
      <ul className="slist" id="slist" aria-live="polite"><SeasonItems month={month} /></ul>
    </Fade>
  );
}

/* ---------- forms (hand off to WhatsApp) ---------- */
const openWa = (text) => window.open(wa(text), '_blank', 'noopener');

export function OrderForm() {
  const [picked, setPicked] = useState([]);
  const toggle = (v) => setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  const submit = (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const name = f.elements.name.value.trim();
    const note = f.elements.note.value.trim();
    let msg = `Salaam Welkin Farmstead! ${name ? `I'm ${name}. ` : ''}`;
    msg += picked.length ? `I'd like to enquire about: ${picked.join(', ')}.` : "I'd like to know more about your farm.";
    if (note) msg += ` ${note}`;
    openWa(msg);
  };
  return (
    <Fade as="form" className="form" id="order" autoComplete="on" onSubmit={submit}>
      <label className="fld"><span>Your name</span><input name="name" type="text" autoComplete="name" placeholder="Your name" /></label>
      <fieldset>
        <legend>I'm interested in</legend>
        <div className="opts" id="opts">
          {ORDER_ITEMS.map((i) => (
            <label className="opt" key={i}><input type="checkbox" value={i} checked={picked.includes(i)} onChange={() => toggle(i)} /><span>{i}</span></label>
          ))}
        </div>
      </fieldset>
      <label className="fld"><span>Notes (quantity, date, city)</span><textarea name="note" rows={3} placeholder="e.g. 2 boxes of apples, deliver to Srinagar" /></label>
      <button className="btn btn-green wide" type="submit">Send on WhatsApp</button>
    </Fade>
  );
}

export function VisitForm() {
  const submit = (e) => {
    e.preventDefault();
    const f = e.currentTarget.elements;
    const o = f.org.value.trim(); const n = f.n.value.trim(); const d = f.d.value.trim();
    openWa(`Salaam Welkin Farmstead! We'd like to arrange a farm visit${o ? ` for ${o}` : ''}${n ? ` — about ${n} students` : ''}${d ? `, around ${d}` : ''}. Please share availability and details.`);
  };
  return (
    <Fade as="form" className="form" id="visitForm" onSubmit={submit}>
      <label className="fld"><span>School / college</span><input name="org" type="text" autoComplete="organization" placeholder="Name of your institution" /></label>
      <label className="fld"><span>Number of students</span><input name="n" type="text" inputMode="numeric" placeholder="e.g. 40" /></label>
      <label className="fld"><span>Preferred date</span><input name="d" type="text" placeholder="e.g. mid-October" /></label>
      <button className="btn btn-green wide" type="submit">Send on WhatsApp</button>
    </Fade>
  );
}

/* ---------- gallery with lightbox ---------- */
export function GalleryGrid() {
  const [open, setOpen] = useState(null); // index or null
  const closeRef = useRef(null);
  const n = GALLERY.length;
  const move = (d) => setOpen((i) => (i === null ? i : (i + d + n) % n));

  useEffect(() => {
    document.documentElement.classList.toggle('lock', open !== null);
    if (open !== null && closeRef.current) closeRef.current.focus();
    return () => document.documentElement.classList.remove('lock');
  }, [open !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (open === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const sx = useRef(0);
  const cur = open === null ? null : GALLERY[open];
  return (
    <>
      <div className="gal">
        {GALLERY.map((g, i) => (
          <a key={g.file} href={`/assets/photos/${g.file}`} data-cap={g.cap} onClick={(e) => { e.preventDefault(); setOpen(i); }}>
            <span className="gimg"><Img file={g.file} alt={g.cap} sizes="(min-width:980px) 360px, 50vw" /></span>
            <span className="gcap">{g.cap}</span>
          </a>
        ))}
      </div>
      <div
        className={`lb${open !== null ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Photo viewer"
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}
        onTouchStart={(e) => { sx.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - sx.current; if (Math.abs(d) > 50) move(d < 0 ? 1 : -1); }}
      >
        <button className="x" aria-label="Close" ref={closeRef} onClick={() => setOpen(null)}>✕</button>
        <button className="pv" aria-label="Previous" onClick={() => move(-1)}>‹</button>
        <figure><img alt={cur ? cur.cap : ''} src={cur ? `/assets/photos/${cur.file}` : undefined} /><figcaption>{cur ? cur.cap : ''}</figcaption></figure>
        <button className="nx" aria-label="Next" onClick={() => move(1)}>›</button>
      </div>
    </>
  );
}

/* ---------- scroll helpers ---------- */
export function ScrollTools() {
  const bar = useRef(null);
  const top = useRef(null);
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? Math.min(1, window.scrollY / h) : 0})`;
      if (top.current) top.current.classList.toggle('show', window.scrollY > 700);
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <>
      <div className="progress" aria-hidden="true" ref={bar} />
      <button className="totop" type="button" aria-label="Back to top" ref={top} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
    </>
  );
}
