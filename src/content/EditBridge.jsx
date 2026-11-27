// Loaded only when the site runs inside the admin's preview frame (?embed=1). Lets the admin push draft content
// into the page live, and turns the page into a click-to-edit surface: hover to see what is editable, click to
// edit it in the admin panel, double-click text to type directly on the page.
import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { leaves, locateText, locateImage, CONTEXTS } from './locate.js';

const contextOf = (el) => { for (const [sel, prefix] of CONTEXTS) if (el.closest(sel)) return prefix; return null; };

const CSS = `
body.wk-edit [data-wk-hover]{outline:2px solid #8dc63f !important;outline-offset:3px;cursor:pointer;border-radius:4px}
body.wk-edit [data-wk-sel]{outline:2px solid #f26a21 !important;outline-offset:3px;border-radius:4px}
body.wk-edit [contenteditable="true"]{outline:2px dashed #f26a21 !important;outline-offset:3px;cursor:text;background:rgba(242,106,33,.06)}
body.wk-edit .annc a, body.wk-edit .jplay{pointer-events:auto}
`;

export default function EditBridge({ content, onContent, onRemount }) {
  const loc = useLocation();
  const navigate = useNavigate();
  const index = useMemo(() => leaves(content), [content]);
  const ref = useRef({ index, route: loc.pathname });
  ref.current.index = index;
  ref.current.route = loc.pathname;
  const send = (m) => window.parent.postMessage({ source: 'welkin-site', ...m }, window.location.origin);

  useEffect(() => {
    const st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    document.body.classList.add('wk-edit');
    return () => { st.remove(); document.body.classList.remove('wk-edit'); };
  }, []);

  useEffect(() => { send({ type: 'route', path: loc.pathname }); }, [loc.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let hover = null; let selected = null; let editing = null;
    const clear = (a) => { if (a) a.removeAttribute(a === hover ? 'data-wk-hover' : 'data-wk-sel'); };

    /** What would be edited if the visitor clicked here? */
    const candidate = (target) => {
      if (!target || !target.closest) return null;
      if (target.closest('.preview-ribbon')) return null;
      const { index: idx, route } = ref.current;
      const img = target.closest('img');
      if (img) {
        const paths = locateImage(idx, img.getAttribute('src') || img.src, route, contextOf(img));
        return paths.length ? { el: img, kind: 'image', paths, src: img.getAttribute('src') } : null;
      }
      let n = target;
      for (let i = 0; i < 5 && n && n !== document.body; i += 1, n = n.parentElement) {
        const t = (n.textContent || '').trim();
        if (t && t.length < 500) {
          const paths = locateText(idx, t, route, contextOf(n));
          if (paths.length) return { el: n, kind: 'text', paths, text: t };
        }
      }
      return null;
    };

    const onOver = (e) => {
      if (editing) return;
      const c = candidate(e.target);
      const el = c ? c.el : null;
      if (el === hover) return;
      if (hover) hover.removeAttribute('data-wk-hover');
      hover = el;
      if (hover && hover !== selected) hover.setAttribute('data-wk-hover', '');
    };
    const onOut = (e) => { if (!e.relatedTarget && hover) { hover.removeAttribute('data-wk-hover'); hover = null; } };

    const onClick = (e) => {
      if (editing && editing.el.contains(e.target)) return;
      const c = candidate(e.target);
      if (!c) return;
      e.preventDefault(); e.stopPropagation();
      if (selected) selected.removeAttribute('data-wk-sel');
      selected = c.el; selected.setAttribute('data-wk-sel', '');
      if (hover) { hover.removeAttribute('data-wk-hover'); hover = null; }
      send({ type: 'pick', kind: c.kind, paths: c.paths, text: c.text || '', src: c.src || '', route: ref.current.route });
    };

    const finish = (commit) => {
      if (!editing) return;
      const { el, original, paths, onKey, onBlur, onPaste } = editing;
      el.removeEventListener('keydown', onKey); el.removeEventListener('blur', onBlur); el.removeEventListener('paste', onPaste);
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      el.removeAttribute('contenteditable');
      editing = null;
      if (commit && text && text !== original) send({ type: 'edit', paths, from: original, text, route: ref.current.route });
      // Typing straight into a React-rendered element can leave React's view of it stale, so rebuild the page DOM.
      onRemount();
    };

    const onDbl = (e) => {
      const c = candidate(e.target);
      if (!c || c.kind !== 'text') return;
      e.preventDefault(); e.stopPropagation();
      const decorative = [...c.el.children].every((k) => !(k.textContent || '').trim());
      if (!decorative) { send({ type: 'pick', kind: 'text', paths: c.paths, text: c.text, src: '', route: ref.current.route, note: 'complex' }); return; }
      if (editing) finish(true);
      const el = c.el;
      const original = (el.textContent || '').replace(/\s+/g, ' ').trim();
      const onKey = (k) => { if (k.key === 'Enter' && !k.shiftKey) { k.preventDefault(); finish(true); } if (k.key === 'Escape') { k.preventDefault(); finish(false); } };
      const onBlur = () => finish(true);
      const onPaste = (p) => { p.preventDefault(); document.execCommand('insertText', false, (p.clipboardData || window.clipboardData).getData('text/plain')); };
      editing = { el, original, paths: c.paths, onKey, onBlur, onPaste };
      if (hover) { hover.removeAttribute('data-wk-hover'); hover = null; }
      el.setAttribute('contenteditable', 'true');
      el.addEventListener('keydown', onKey); el.addEventListener('blur', onBlur); el.addEventListener('paste', onPaste);
      el.focus();
      const r = document.createRange(); r.selectNodeContents(el);
      const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    };

    const onMsg = (e) => {
      if (e.origin !== window.location.origin || e.source !== window.parent) return;
      const d = e.data;
      if (!d || d.source !== 'welkin-admin') return;
      if (d.type === 'content') onContent(d.content);
      if (d.type === 'go') navigate(d.path);
      if (d.type === 'deselect' && selected) { selected.removeAttribute('data-wk-sel'); selected = null; }
    };

    document.addEventListener('mouseover', onOver, true);
    document.addEventListener('mouseout', onOut, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('dblclick', onDbl, true);
    window.addEventListener('message', onMsg);
    send({ type: 'ready' });
    return () => {
      document.removeEventListener('mouseover', onOver, true); document.removeEventListener('mouseout', onOut, true);
      document.removeEventListener('click', onClick, true); document.removeEventListener('dblclick', onDbl, true);
      window.removeEventListener('message', onMsg);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
