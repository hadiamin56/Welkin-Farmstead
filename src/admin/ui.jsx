import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Ico } from './icons.jsx';

/* ---------- toasts ---------- */
const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function Toasts({ children }) {
  const [list, setList] = useState([]);
  const push = useCallback((text, kind = 'ok') => {
    const id = Math.random().toString(36).slice(2);
    setList((l) => [...l, { id, text, kind }]);
    setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), kind === 'err' ? 6500 : 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="a-toasts" role="status" aria-live="polite">
        {list.map((t) => <div key={t.id} className={`a-toast ${t.kind}`}><Ico n={t.kind === 'err' ? 'alert' : 'check'} size={18} />{t.text}</div>)}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------- modal ---------- */
export function Modal({ title, onClose, children, wide, footer }) {
  const ref = useRef(null);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.activeElement;
    ref.current && ref.current.focus();
    return () => { window.removeEventListener('keydown', onKey); prev && prev.focus && prev.focus(); };
  }, [onClose]);
  return (
    <div className="a-modal-bd" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`a-modal${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <header><h2>{title}</h2><button type="button" className="a-icon-btn" onClick={onClose} aria-label="Close"><Ico n="x" /></button></header>
        <div className="a-modal-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  );
}

/* ---------- small pieces ---------- */
export function Btn({ kind = 'default', icon, children, ...rest }) {
  return <button type="button" className={`a-btn ${kind}`} {...rest}>{icon && <Ico n={icon} size={17} />}{children}</button>;
}
export function Badge({ kind = 'grey', children }) { return <span className={`a-badge ${kind}`}>{children}</span>; }
export function Card({ title, actions, children, pad = true }) {
  return (
    <section className="a-card">
      {(title || actions) && <header className="a-card-h"><h2>{title}</h2><div>{actions}</div></header>}
      <div className={pad ? 'a-card-b' : ''}>{children}</div>
    </section>
  );
}
export function Empty({ icon = 'info', title, children }) {
  return <div className="a-empty"><Ico n={icon} size={30} /><b>{title}</b><p>{children}</p></div>;
}
export const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');
export const ago = (iso) => {
  if (!iso) return 'never';
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} d ago`;
};
export const bytes = (n) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
