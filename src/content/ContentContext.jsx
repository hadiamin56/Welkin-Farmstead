import { Fragment, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SNAPSHOT, SNAPSHOT_VERSION } from './snapshot.js';
import { withDefaults } from './merge.js';
import { setWhatsApp } from '../lib/site.js';
import { themeCss } from './theme.js';

const Ctx = createContext({ content: SNAPSHOT, preview: false, exitPreview: () => {} });

const PREVIEW_KEY = 'welkin-preview';

/**
 * Serves the site content. Starts from the copy built into the page (so first paint is instant and matches the
 * prerendered HTML), then quietly swaps in the latest published content from the API. Admins previewing a draft
 * (?preview=1) get their unpublished changes instead.
 */
export function ContentProvider({ children }) {
  const [state, setState] = useState({ content: SNAPSHOT, version: SNAPSHOT_VERSION, preview: false });
  const [Bridge, setBridge] = useState(null);
  const [epoch, setEpoch] = useState(0);
  setWhatsApp(state.content.site.whatsapp);

  // Brand colours: a tiny <style> that only exists when the colours were changed in the admin.
  const css = themeCss(state.content.theme);
  useEffect(() => {
    let el = document.getElementById('welkin-theme');
    if (!css) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement('style'); el.id = 'welkin-theme'; document.head.appendChild(el); }
    el.textContent = css;
  }, [css]);

  useEffect(() => {
    let dead = false;
    // Inside the admin's preview frame: the admin pushes the draft in live, so skip the API and load the editor bridge.
    if (new URLSearchParams(window.location.search).has('embed') && window.parent !== window) {
      import('./EditBridge.jsx').then((m) => { if (!dead) setBridge(() => m.default); });
      return () => { dead = true; };
    }
    const wantPreview = new URLSearchParams(window.location.search).has('preview') || sessionStorage.getItem(PREVIEW_KEY) === '1';
    const load = async () => {
      if (wantPreview) {
        try {
          const r = await fetch('/api/admin/content', { credentials: 'same-origin', cache: 'no-store' });
          if (r.ok) {
            const d = await r.json();
            sessionStorage.setItem(PREVIEW_KEY, '1');
            if (!dead) setState({ content: withDefaults(d.draft), version: -1, preview: true });
            return;
          }
        } catch { /* fall through to the public content */ }
        sessionStorage.removeItem(PREVIEW_KEY);
      }
      try {
        const r = await fetch('/api/content', { cache: 'no-cache' });
        if (!r.ok) return;
        const d = await r.json();
        if (!dead && d && d.content && d.version !== state.version) setState({ content: withDefaults(d.content), version: d.version, preview: false });
      } catch { /* offline or no API (static preview): keep the built-in content */ }
    };
    load();
    return () => { dead = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({
    content: state.content,
    preview: state.preview,
    exitPreview: () => { sessionStorage.removeItem(PREVIEW_KEY); window.location.href = window.location.pathname; },
  }), [state]);
  return (
    <Ctx.Provider value={value}>
      <Fragment key={epoch}>{children}</Fragment>
      {Bridge && <Bridge content={state.content} onContent={(c) => setState({ content: withDefaults(c), version: -2, preview: false })} onRemount={() => setEpoch((e) => e + 1)} />}
    </Ctx.Provider>
  );
}

export const useContent = () => useContext(Ctx).content;
export const usePreview = () => useContext(Ctx);

/** Contact details and other site-wide values, ready to use. */
export function useSite() {
  const { site, locations } = useContent();
  return {
    ...site,
    phoneTel: `tel:${site.phone}`,
    locations,
  };
}
