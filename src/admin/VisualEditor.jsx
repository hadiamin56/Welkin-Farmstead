import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Btn, Badge, useToast } from './ui.jsx';
import { Ico } from './icons.jsx';
import { useAdmin, getAt } from './state.jsx';
import { Field, RootField, MediaPicker, thumbOf } from './fields.jsx';
import { SECTIONS, HOME_BLOCKS, resolveField, rootField } from '../content/schema.js';

const DEVICES = {
  desktop: { label: 'Desktop', icon: 'dashboard', w: 1280, h: 0 },
  tablet: { label: 'Tablet', icon: 'store', w: 820, h: 1100 },
  phone: { label: 'Phone', icon: 'paw', w: 390, h: 844 },
};
const PAGES = [['/', 'Home'], ['/shop', 'Farm shop'], ['/orchard', 'Orchard'], ['/aquaculture', 'Aquaculture'], ['/livestock', 'Livestock'], ['/qurbani', 'Qurbani booking'], ['/visits', 'Farm visits'], ['/seasons', 'Seasons'], ['/gallery', 'Gallery'], ['/careers', 'Careers'], ['/contact', 'Contact']];
const SECTION_OF_PAGE = { '/': 'home', '/shop': 'shop', '/orchard': 'orchard', '/aquaculture': 'aquaculture', '/livestock': 'livestock', '/qurbani': 'qurbani', '/visits': 'visits', '/seasons': 'seasons', '/gallery': 'gallery', '/careers': 'careers', '/contact': 'contact' };
const blockName = (id) => (HOME_BLOCKS.find((b) => b[0] === id) || [id, id])[1];

/* ---------- the field editor for whatever was clicked on the page ---------- */
function Selected({ picked, onReplaceImage }) {
  const { doc } = useAdmin();
  const [alt, setAlt] = useState(0);
  useEffect(() => { setAlt(0); }, [picked]);
  if (!picked) {
    return (
      <div className="v-hint">
        <Ico n="eye" size={26} />
        <b>Click anything on the page</b>
        <p>Text, photos, buttons and cards are all editable. Hover to see what you can change, click to edit it here, or <b>double-click text</b> to type directly on the page.</p>
      </div>
    );
  }
  const options = picked.paths.map((p) => ({ path: p, r: resolveField(p) })).filter((o) => o.r);
  if (!options.length) {
    return <div className="v-hint"><Ico n="info" size={24} /><b>This part isn’t directly editable</b><p>It is generated from several settings. Use the <b>Sections</b> tab to find it.</p></div>;
  }
  const cur = options[Math.min(alt, options.length - 1)];
  const { field, trail, item } = cur.r;
  const sameCard = item ? item.fields.filter((f) => f.k !== cur.path[cur.path.length - 1]) : [];
  return (
    <div className="v-sel">
      <p className="v-trail">{trail.join(' › ')}</p>
      {picked.note === 'complex' && <div className="a-alert warn"><Ico n="info" size={16} />This text has a highlighted word, so it is edited here rather than on the page.</div>}
      {picked.kind === 'image' && <Btn kind="primary" icon="image" onClick={() => onReplaceImage(cur.path)}>Replace this photo</Btn>}
      <Field f={field} path={cur.path} />
      {options.length > 1 && (
        <div className="v-alts">
          <small>{picked.kind === 'image' ? 'This photo is also used in:' : 'This text also appears in:'}</small>
          <div className="a-chips">{options.map((o, i) => <button type="button" key={o.path.join('.')} className={i === alt ? 'on' : ''} onClick={() => setAlt(i)}>{o.r.trail.slice(0, 2).join(' › ')}</button>)}</div>
        </div>
      )}
      {sameCard.length > 0 && (
        <details className="a-panel v-more" open>
          <summary><Ico n="down" size={15} /> Everything on this {item.label.toLowerCase().replace(/ \(.*$/, '').replace(/s$/, '')}</summary>
          <div className="a-panel-b">{sameCard.map((f) => <Field key={f.k} f={f} path={[...item.path, f.k]} depth={1} />)}</div>
        </details>
      )}
      {doc && null}
    </div>
  );
}

/* ---------- reorder / hide the home page blocks ---------- */
function LayoutTab({ route }) {
  const { doc, setValue } = useAdmin();
  const layout = doc.draft.home.layout;
  const [drag, setDrag] = useState(-1);
  const set = (next) => setValue(['home', 'layout'], next);
  const move = (i, d) => { const j = i + d; if (j < 0 || j >= layout.length) return; const n = layout.slice(); [n[i], n[j]] = [n[j], n[i]]; set(n); };
  const drop = (to) => { if (drag < 0 || drag === to) return; const n = layout.slice(); const [m] = n.splice(drag, 1); n.splice(to, 0, m); set(n); setDrag(-1); };
  return (
    <div>
      <p className="a-muted">Drag blocks (or use the arrows) to change the order of the home page. Switch a block off to hide it.</p>
      {route !== '/' && <div className="a-alert warn"><Ico n="info" size={16} />You’re looking at another page. Open <b>Home</b> in the preview to see this change.</div>}
      <ul className="v-layout">
        <li className="fixed"><Ico n="home" size={16} /> Top section & Qurbani card <small>always first</small></li>
        {layout.map((b, i) => (
          <li key={b.id} draggable onDragStart={() => setDrag(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => drop(i)} onDragEnd={() => setDrag(-1)} className={`${b.visible ? '' : 'off'}${drag === i ? ' dragging' : ''}`}>
            <span className="v-grip" aria-hidden="true">⋮⋮</span>
            <b>{blockName(b.id)}</b>
            <span className="a-spacer" />
            <button type="button" className="a-icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><Ico n="up" size={16} /></button>
            <button type="button" className="a-icon-btn" onClick={() => move(i, 1)} disabled={i === layout.length - 1} aria-label="Move down"><Ico n="down" size={16} /></button>
            <label className="a-toggle sm" title={b.visible ? 'Visible' : 'Hidden'}><input type="checkbox" checked={b.visible} onChange={(e) => set(layout.map((x, j) => (j === i ? { ...x, visible: e.target.checked } : x)))} /><i /></label>
          </li>
        ))}
      </ul>
      <Btn kind="ghost" icon="refresh" onClick={() => set(doc.defaults.home.layout)}>Reset order</Btn>
    </div>
  );
}

/* ---------- main component ---------- */
export default function VisualEditor() {
  const { doc, setValue, undo, redo, hist, saveState } = useAdmin();
  const toast = useToast();
  const frame = useRef(null);
  const stage = useRef(null);
  const [device, setDevice] = useState('desktop');
  const [route, setRoute] = useState('/');
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState('edit');
  const [picked, setPicked] = useState(null);
  const [pickerPath, setPickerPath] = useState(null);
  const [section, setSection] = useState(null);
  const [size, setSize] = useState({ w: 900, h: 600 });
  const [mobileView, setMobileView] = useState('preview');
  const draftRef = useRef(doc.draft);
  draftRef.current = doc.draft;

  const post = useCallback((msg) => {
    const w = frame.current && frame.current.contentWindow;
    if (w) w.postMessage({ source: 'welkin-admin', ...msg }, window.location.origin);
  }, []);

  // push every draft change into the live page
  useEffect(() => {
    if (!ready) return undefined;
    const t = setTimeout(() => post({ type: 'content', content: doc.draft }), 60);
    return () => clearTimeout(t);
  }, [doc.draft, ready, post]);

  // messages from the page
  useEffect(() => {
    const onMsg = (e) => {
      if (e.origin !== window.location.origin || !frame.current || e.source !== frame.current.contentWindow) return;
      const d = e.data;
      if (!d || d.source !== 'welkin-site') return;
      if (d.type === 'ready') { setReady(true); post({ type: 'content', content: draftRef.current }); }
      if (d.type === 'route') setRoute(d.path === '/' ? '/' : d.path.replace(/\/+$/, ''));
      if (d.type === 'pick') {
        setPicked(d); setTab('edit'); setMobileView('panel');
        if (d.kind === 'image' && d.paths.length) setPickerPath(d.paths[0]);
      }
      if (d.type === 'edit' && d.paths.length) {
        setValue(d.paths[0], d.text);
        toast(d.paths.length > 1 ? `Updated. The same text is also used in ${d.paths.length - 1} other place(s).` : 'Text updated');
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [post, setValue, toast]);

  // undo / redo shortcuts (not while typing in a field)
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); (e.shiftKey ? redo : undo)(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  // fit the page into the available space
  useEffect(() => {
    const el = stage.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, [mobileView]);

  const dev = DEVICES[device];
  const pad = 24;
  const availW = Math.max(200, size.w - pad * 2);
  const availH = Math.max(200, size.h - pad * 2);
  const scale = device === 'desktop' ? Math.min(1, availW / dev.w) : Math.min(1, availW / dev.w, availH / dev.h);
  const frameH = device === 'desktop' ? Math.round(availH / scale) : dev.h;

  const go = (p) => { setRoute(p); post({ type: 'go', path: p }); setPicked(null); };
  const pageSection = SECTION_OF_PAGE[route];

  const tabs = [['edit', 'Edit', 'settings'], ['sections', 'Sections', 'layers'], ['layout', 'Layout', 'home'], ['design', 'Design', 'star']];
  const gridClass = `v-grid ${mobileView}`;

  return (
    <div className={gridClass}>
      <aside className="v-panel">
        <div className="v-tabs" role="tablist">
          {tabs.map(([k, l, ic]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => { setTab(k); setSection(null); }}><Ico n={ic} size={16} />{l}</button>)}
        </div>
        <div className="v-panel-b">
          {tab === 'edit' && <Selected picked={picked} onReplaceImage={setPickerPath} />}
          {tab === 'edit' && pageSection && (
            <div className="v-shortcut"><Btn icon="layers" onClick={() => { setTab('sections'); setSection(pageSection); }}>All settings for this page</Btn></div>
          )}
          {tab === 'sections' && !section && (
            <ul className="v-sections">
              {SECTIONS.filter((s) => !s.custom).map((s) => <li key={s.id}><button type="button" onClick={() => setSection(s.id)}><Ico n={s.icon} size={18} /><span><b>{s.title}</b><small>{s.desc}</small></span></button></li>)}
              <li><Link to="/admin/products"><Ico n="bag" size={18} /><span><b>Products</b><small>Add, hide, reorder and feature products.</small></span></Link></li>
            </ul>
          )}
          {tab === 'sections' && section && (
            <>
              <button type="button" className="v-back" onClick={() => setSection(null)}><Ico n="up" size={14} style={{ transform: 'rotate(-90deg)' }} /> All sections</button>
              <h2 className="v-h">{SECTIONS.find((s) => s.id === section).title}</h2>
              {SECTIONS.find((s) => s.id === section).keys.map((k) => <RootField key={k} f={rootField(k)} />)}
            </>
          )}
          {tab === 'layout' && <LayoutTab route={route} />}
          {tab === 'design' && (
            <>
              <p className="a-muted">Change the colours used across the whole website. Changes show instantly on the right.</p>
              <RootField f={rootField('theme')} />
              <Btn kind="ghost" icon="refresh" onClick={() => setValue(['theme'], doc.defaults.theme)}>Reset to original colours</Btn>
            </>
          )}
        </div>
      </aside>

      <section className="v-stage-wrap">
        <div className="v-bar">
          <div className="v-seg mobile-only" role="tablist">
            <button className={mobileView === 'panel' ? 'on' : ''} onClick={() => setMobileView('panel')}>Edit</button>
            <button className={mobileView === 'preview' ? 'on' : ''} onClick={() => setMobileView('preview')}>Preview</button>
          </div>
          <select className="a-input sm" value={route} onChange={(e) => go(e.target.value)} aria-label="Page to preview">
            {PAGES.map(([p, l]) => <option key={p} value={p}>{l}</option>)}
            {!PAGES.some(([p]) => p === route) && <option value={route}>{route}</option>}
          </select>
          <div className="v-seg" role="group" aria-label="Device size">
            {Object.entries(DEVICES).map(([k, d]) => <button key={k} className={device === k ? 'on' : ''} onClick={() => setDevice(k)} title={`${d.label} (${d.w}px)`}>{d.label}</button>)}
          </div>
          <span className="a-spacer" />
          <button type="button" className="a-icon-btn" onClick={undo} disabled={!hist.u} aria-label="Undo" title="Undo (Ctrl+Z)"><Ico n="refresh" size={17} style={{ transform: 'scaleX(-1)' }} /></button>
          <button type="button" className="a-icon-btn" onClick={redo} disabled={!hist.r} aria-label="Redo" title="Redo (Ctrl+Shift+Z)"><Ico n="refresh" size={17} /></button>
          <Badge kind={saveState === 'error' ? 'red' : saveState === 'saved' ? 'green' : 'amber'}>{saveState === 'saved' || saveState === 'idle' ? 'Saved' : saveState === 'error' ? 'Not saved' : 'Saving…'}</Badge>
        </div>
        <div className="v-stage" ref={stage}>
          {!ready && <div className="v-loading"><span className="a-spin" /> Loading preview…</div>}
          <div className={`v-device ${device}`} style={{ width: dev.w * scale, height: frameH * scale }}>
            <iframe ref={frame} title="Live preview of the website" src="/?embed=1" style={{ width: dev.w, height: frameH, transform: `scale(${scale})` }} />
          </div>
        </div>
        <p className="v-tip">Hover to highlight · click to edit · double-click text to type on the page · changes appear instantly but go live only when you press <b>Publish</b>.</p>
      </section>

      {pickerPath && (
        <MediaPicker onClose={() => setPickerPath(null)} onPick={(u) => { setValue(pickerPath, u); setPickerPath(null); toast('Photo replaced'); }} />
      )}
    </div>
  );
}

export { getAt, thumbOf };
