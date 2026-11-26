import { useEffect, useRef, useState } from 'react';
import { Icon } from './Svg.jsx';
import { LOCS } from '../data/content.js';
import { MAPQ, PHONE_TEL, EMAIL } from '../lib/site.js';

const OSM_SEARCH = 'https://www.openstreetmap.org/search?query=Sopore%2C%20Kashmir';

/** Address details plus an interactive OpenStreetMap (Leaflet loads on demand when the map nears the screen). */
export function FindUs() {
  const [sel, setSel] = useState(0);
  const elRef = useRef(null);
  const apiRef = useRef(null);
  const selRef = useRef(0);
  selRef.current = sel;

  useEffect(() => {
    const el = elRef.current;
    let io; let dead = false;
    const start = async () => {
      const mod = await import('leaflet');
      const L = mod.default || mod;
      if (dead || apiRef.current) return;
      const l0 = LOCS[selRef.current];
      const map = L.map(el, { zoomControl: false, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, attributionControl: true }).setView([l0.lat, l0.lng], 13);
      map.attributionControl.setPrefix(false);
      L.control.zoom({ position: 'topright' }).addTo(map);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      }).addTo(map);
      const area = L.circle([l0.lat, l0.lng], { radius: 650, color: '#f26a21', weight: 1.5, fillColor: '#f26a21', fillOpacity: 0.12 }).addTo(map);
      const pin = (n) => L.divIcon({ className: 'lm-pin', html: `<span><b>${n}</b></span>`, iconSize: [34, 34], iconAnchor: [17, 40] });
      const marker = L.marker([l0.lat, l0.lng], { icon: pin(selRef.current + 1), keyboard: false, title: l0.name }).addTo(map);
      map.on('click', () => map.scrollWheelZoom.enable());
      map.on('mouseout', () => map.scrollWheelZoom.disable());
      apiRef.current = { map, marker, area, pin };
      window.setTimeout(() => map.invalidateSize(), 300);
    };
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); start(); } }, { rootMargin: '300px' });
      io.observe(el);
    } else start();
    return () => {
      dead = true;
      if (io) io.disconnect();
      if (apiRef.current) { apiRef.current.map.remove(); apiRef.current = null; }
    };
  }, []);

  useEffect(() => {
    const a = apiRef.current;
    if (!a) return;
    const l = LOCS[sel];
    a.marker.setIcon(a.pin(sel + 1));
    a.marker.setLatLng([l.lat, l.lng]);
    a.area.setLatLng([l.lat, l.lng]);
    a.map.flyTo([l.lat, l.lng], a.map.getZoom(), { duration: 0.6 });
  }, [sel]);

  return (
    <div className="map-grid">
      <div className="map-info">
        <p className="eyebrow">Find us</p>
        <h2>Visit Welkin Farmstead</h2>
        <p className="sub">We're in Sopore, Kashmir — the apple town of the valley. Welkin Aquaculture is expanding in Model Town, Sopore. Message us before you come so we can guide you in.</p>
        <ul className="info">
          <li><Icon name="pin" /><div><b>Address</b><span>Sopore, Jammu &amp; Kashmir 193201</span></div></li>
          <li><Icon name="phone" /><div><b>Call / WhatsApp</b><a href={PHONE_TEL}>70069 01374</a></div></li>
          <li><Icon name="mail" /><div><b>Email</b><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div></li>
        </ul>
        <div className="actions">
          <a className="btn btn-green" href={`https://www.google.com/maps/dir/?api=1&destination=${MAPQ}`} target="_blank" rel="noopener">Get directions</a>
          <a className="btn btn-ghost" href={OSM_SEARCH} target="_blank" rel="noopener">Open full map</a>
        </div>
      </div>
      <div className="locmap" data-locmap>
        <div className="lm-head"><span>Find us · Geographic map</span><span className="osm"><i />OpenStreetMap</span></div>
        <div className="lm-wrap">
          <div className="lm-map" id="locmap" role="region" aria-label="Map showing Welkin Farmstead in Sopore, Kashmir" ref={elRef} />
          <div className="lm-chip"><span>Kashmir</span><span>2 sites</span></div>
        </div>
        <noscript><p className="lm-ns">Enable JavaScript to see the interactive map, or <a href={OSM_SEARCH} target="_blank" rel="noopener">open it on OpenStreetMap</a>.</p></noscript>
        <div className="lm-tabs" role="tablist" aria-label="Locations">
          {LOCS.map((l, i) => (
            <button key={l.name} role="tab" className={i === sel ? 'on' : undefined} aria-selected={i === sel} data-i={i} onClick={() => setSel(i)}><b>{i + 1}</b>{l.name}</button>
          ))}
        </div>
        <div className="lm-detail" aria-live="polite"><h3 id="lmName">{LOCS[sel].name}</h3><p id="lmText">{LOCS[sel].text}</p></div>
      </div>
    </div>
  );
}
