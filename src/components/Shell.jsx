import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { Icon, AIcon, Skyline } from './Svg.jsx';
import { NAV, FARM } from '../data/content.js';
import { wa } from '../lib/site.js';
import { useSite } from '../content/ContentContext.jsx';

export function Social({ big = false }) {
  const site = useSite();
  return (
    <div className={`social${big ? ' big' : ''}`}>
      <a href={site.instagram} target="_blank" rel="noopener" aria-label="Instagram"><Icon name="ig" /></a>
      <a href={site.facebook} target="_blank" rel="noopener" aria-label="Facebook"><Icon name="fb" /></a>
      <a href={wa(site.helloMsg)} target="_blank" rel="noopener" aria-label="WhatsApp"><Icon name="wa" /></a>
    </div>
  );
}

/** Announcement bar, top bar (desktop nav / mobile app bar) and its dropdown. */
export function Header({ route }) {
  const site = useSite();
  const ann = site.announcement;
  const [menu, setMenu] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const navigate = useNavigate();
  const navType = useNavigationType();
  const { pathname } = useLocation();

  // Close menus after navigating; keep the body flag the old drawer used.
  useEffect(() => { setMenu(false); setDdOpen(false); }, [pathname]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setMenu(false); setDdOpen(false); } };
    const onDoc = (e) => { if (!e.target.closest('.dd')) setDdOpen(false); };
    const mq = window.matchMedia('(min-width:861px)');
    const onMq = () => setMenu(false);
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onDoc);
    mq.addEventListener('change', onMq);
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('click', onDoc); mq.removeEventListener('change', onMq); };
  }, []);

  const onBack = (e) => {
    // Behave like the system back button when the visitor came from inside the site.
    if (navType !== 'POP' || window.history.length > 1) {
      if (window.history.state && window.history.state.idx > 0) { e.preventDefault(); navigate(-1); }
    }
  };
  const onDd = () => {
    if (window.matchMedia('(max-width:860px)').matches) return;
    setDdOpen((o) => !o);
  };

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      {ann.enabled && (
        <div className="annc" id="annc" role="region" aria-label="Announcement">
          <div className="wrap">
            <span>{ann.text}</span>
            <a href={wa(ann.msg)} target="_blank" rel="noopener">{ann.cta}</a>
          </div>
        </div>
      )}
      <header className="nav" id="nav">
        <div className="wrap nav-in">
          <Link to="/" className="brand"><img src="/assets/logo.png" alt="" width="40" height="40" /><span>{site.name}</span></Link>
          <Link className="ab-back" to="/" aria-label="Back" onClick={onBack}><Icon name="back" /></Link>
          <span className="ab-title">{route.navTitle}</span>
          <nav className={`links${menu ? ' open' : ''}`} id="links" aria-label="Main">
            {NAV.map((n) => {
              if (n.key === 'farm') {
                return (
                  <div key="farm" className={`dd${route.active === 'farm' ? ' cur' : ''}${ddOpen ? ' open' : ''}`}>
                    <button type="button" aria-expanded={ddOpen} aria-haspopup="true" onClick={onDd}>
                      {n.label}
                      <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                    </button>
                    <div className="dd-menu">
                      {FARM.map((f) => (
                        <Link key={f.sub} to={f.to} className={f.sub === route.sub ? 'on' : undefined} aria-current={f.sub === route.sub ? 'page' : undefined}>{f.label}</Link>
                      ))}
                    </div>
                  </div>
                );
              }
              const cur = n.key === route.active;
              return <Link key={n.key} to={n.to} className={cur ? 'cur' : undefined} aria-current={cur ? 'page' : undefined} onClick={() => setMenu(false)}>{n.label}</Link>;
            })}
          </nav>
          <Link className="btn btn-sm btn-green nav-cta" to="/contact">Order</Link>
          <button className="burger" id="burger" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="links" onClick={() => setMenu((m) => !m)}><i /><i /></button>
          <a className="ab-act" href={site.phoneTel} aria-label={`Call ${site.name}`}><Icon name="call" /></a>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  const site = useSite();
  return (
    <>
      <Skyline />
      <footer className="footer">
        <div className="wrap fgrid">
          <div className="fb">
            <img src="/assets/logo.png" alt={`${site.name} logo`} width="56" height="56" loading="lazy" />
            <div><b>{site.name}</b><span>{site.tagline}</span></div>
          </div>
          <div>
            <h3>Explore</h3>
            <Link to="/">Home</Link><Link to="/shop">Farm shop</Link><Link to="/seasons">Seasons</Link><Link to="/gallery">Gallery</Link><Link to="/careers">Careers</Link><Link to="/contact">Contact</Link>
          </div>
          <div><h3>Our farm</h3>{FARM.map((f) => <Link key={f.sub} to={f.to}>{f.label}</Link>)}</div>
          <div>
            <h3>Reach us</h3>
            <a href={site.phoneTel}>{site.phoneDisplay}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span>{site.addressLine}</span>
            <Social />
          </div>
        </div>
        <div className="wrap fcopy">© <span id="yr" suppressHydrationWarning>{new Date().getFullYear()}</span>{` ${site.name} · Managed by ${site.managedBy}`}</div>
      </footer>
    </>
  );
}

/** Phone-only navigation: bottom bar, bottom sheets and the WhatsApp button. */
export function AppNav({ route }) {
  const site = useSite();
  const [sheet, setSheet] = useState(null);
  const { pathname } = useLocation();
  const cur = { home: 'home', shop: 'shop', farm: 'farm', seasons: 'seasons' }[route.active] || 'more';

  useEffect(() => { setSheet(null); }, [pathname]);
  useEffect(() => {
    // Lock the page behind an open sheet on <html> (locking <body> would make the sticky top bar scroll away).
    document.documentElement.classList.toggle('lock', !!sheet);
    const onKey = (e) => { if (e.key === 'Escape') setSheet(null); };
    const mq = window.matchMedia('(min-width:861px)');
    const onMq = () => setSheet(null);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => { window.removeEventListener('keydown', onKey); mq.removeEventListener('change', onMq); document.documentElement.classList.remove('lock'); };
  }, [sheet]);

  const Item = ({ k, label, to, sheetKey }) => {
    const on = k === cur;
    const body = <><span className="bpill"><Icon name={`m-${k}`} /></span><span className="lbl">{label}</span></>;
    return to
      ? <Link className={`bn${on ? ' on' : ''}`} to={to} aria-current={on ? 'page' : undefined}>{body}</Link>
      : <button type="button" className={`bn${on ? ' on' : ''}`} data-sheet={sheetKey} onClick={() => setSheet((s) => (s === sheetKey ? null : sheetKey))}>{body}</button>;
  };
  const Row = ({ to, href, icon, label, sub, ext }) => {
    const inner = <><span className="sic">{icon}</span><span><b>{label}</b><small>{sub}</small></span></>;
    return to
      ? <Link className="srow" to={to}>{inner}</Link>
      : <a className="srow" href={href} {...(ext ? { target: '_blank', rel: 'noopener' } : {})}>{inner}</a>;
  };
  const Sheet = ({ id, title, children }) => (
    <div className="sheet" id={`sheet-${id}`} role="dialog" aria-modal="true" aria-label={title} hidden={sheet !== id}>
      <div className="sheet-bd" data-close onClick={() => setSheet(null)} />
      <div className="sheet-p"><span className="grab" aria-hidden="true" /><h2>{title}</h2><div className="srows">{children}</div></div>
    </div>
  );

  return (
    <>
      <nav className="bnav" aria-label="Primary">
        <Item k="home" label="Home" to="/" />
        <Item k="shop" label="Shop" to="/shop" />
        <Item k="farm" label="Farm" sheetKey="farm" />
        <Item k="seasons" label="Seasons" to="/seasons" />
        <Item k="more" label="More" sheetKey="more" />
      </nav>
      <Sheet id="farm" title="Our farm">
        {FARM.map((f) => <Row key={f.sub} to={f.to} icon={<AIcon name={f.icon} />} label={f.label} sub={f.desc} />)}
      </Sheet>
      <Sheet id="more" title="More">
        <Row to="/gallery" icon={<Icon name="m-gallery" />} label="Gallery" sub="Photos from the farm" />
        <Row to="/careers" icon={<Icon name="m-jobs" />} label="Careers" sub="Join the Welkin team" />
        <Row to="/contact" icon={<Icon name="m-mail" />} label="Contact & map" sub="Order, enquire, find us" />
        <Row href={site.phoneTel} icon={<Icon name="m-phone" />} label="Call us" sub={site.phoneDisplay} />
        <Row href={site.instagram} icon={<Icon name="ig" />} label="Instagram" sub={`@${(site.instagram.split("/").filter(Boolean).pop() || "").replace(/^@/, "")}`} ext />
        <Row href={site.facebook} icon={<Icon name="fb" />} label="Facebook" sub={site.name} ext />
      </Sheet>
      <div role="complementary" aria-label="Chat on WhatsApp">
        <a className="fab" href={wa(site.helloMsg)} target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><Icon name="wa" /></a>
      </div>
    </>
  );
}
