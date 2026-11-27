import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api, setUnauthorizedHandler, ApiError } from './api.js';
import { useToast } from './ui.jsx';
import { SECTIONS } from '../content/schema.js';
import { diffPaths } from '../content/merge.js';

const Ctx = createContext(null);
export const useAdmin = () => useContext(Ctx);

/* ----- immutable path helpers ----- */
export const getAt = (o, path) => path.reduce((a, k) => (a == null ? a : a[k]), o);
export function setAt(o, path, value) {
  if (!path.length) return value;
  const [k, ...rest] = path;
  const copy = Array.isArray(o) ? o.slice() : { ...o };
  copy[k] = setAt(o ? o[k] : undefined, rest, value);
  return copy;
}

/** "home.hero.title" -> the sidebar section it belongs to (for the publish summary). */
export function sectionOf(dotPath) {
  const root = dotPath.split(/[.[]/)[0];
  const s = SECTIONS.find((x) => x.keys.includes(root));
  return s ? s.title : root;
}

export function AdminProvider({ children }) {
  const toast = useToast();
  const [user, setUser] = useState(undefined); // undefined = checking, null = signed out
  const [doc, setDoc] = useState(null); // { draft, published, defaults, hasDraft, changes, updatedAt }
  const [saveState, setSaveState] = useState('idle'); // idle | pending | saving | saved | error
  const [saveErrors, setSaveErrors] = useState([]);
  const draftRef = useRef(null);
  const timer = useRef(null);
  const dirty = useRef(false);

  const signOut = useCallback(() => { setUser(null); setDoc(null); draftRef.current = null; }, []);
  useEffect(() => { setUnauthorizedHandler(signOut); }, [signOut]);

  // who am I?
  useEffect(() => {
    api('GET', 'me').then((d) => setUser(d.user)).catch(() => setUser(null));
  }, []);

  const load = useCallback(async () => {
    const d = await api('GET', 'content');
    draftRef.current = d.draft;
    dirty.current = false;
    setDoc(d);
    setSaveState(d.hasDraft ? 'saved' : 'idle');
    setSaveErrors([]);
    return d;
  }, []);
  useEffect(() => { if (user) load().catch((e) => toast(e.message, 'err')); }, [user, load, toast]);

  /* ----- saving ----- */
  const saveNow = useCallback(async () => {
    clearTimeout(timer.current);
    if (!dirty.current || !draftRef.current) return true;
    setSaveState('saving');
    try {
      const r = await api('PUT', 'draft', { content: draftRef.current });
      dirty.current = false;
      setSaveErrors([]);
      setSaveState('saved');
      setDoc((d) => d && ({ ...d, hasDraft: true, changes: r.changes, updatedAt: r.updatedAt }));
      return true;
    } catch (e) {
      setSaveState('error');
      setSaveErrors(e instanceof ApiError && e.data && e.data.errors ? e.data.errors : [e.message]);
      return false;
    }
  }, []);

  const schedule = useCallback(() => {
    dirty.current = true;
    setSaveState('pending');
    clearTimeout(timer.current);
    timer.current = setTimeout(saveNow, 1200);
  }, [saveNow]);

  const change = useCallback((fn) => {
    const next = fn(draftRef.current);
    draftRef.current = next;
    setDoc((d) => d && ({ ...d, draft: next }));
    schedule();
  }, [schedule]);

  const setValue = useCallback((path, value) => change((d) => setAt(d, path, value)), [change]);

  const resetSection = useCallback((keys) => change((d) => keys.reduce((acc, k) => setAt(acc, [k], JSON.parse(JSON.stringify(doc.defaults[k]))), d)), [change, doc]);

  // warn before leaving with unsaved text, and Ctrl/Cmd+S saves immediately
  useEffect(() => {
    const onUnload = (e) => { if (dirty.current) { e.preventDefault(); e.returnValue = ''; } };
    const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); saveNow().then((ok) => ok && toast('Draft saved')); } };
    window.addEventListener('beforeunload', onUnload);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('beforeunload', onUnload); window.removeEventListener('keydown', onKey); };
  }, [saveNow, toast]);

  const publish = useCallback(async (note) => {
    if (!(await saveNow())) throw new Error('Fix the highlighted problems before publishing.');
    const r = await api('POST', 'publish', { note });
    await load();
    return r;
  }, [saveNow, load]);

  const discard = useCallback(async () => { await api('POST', 'discard'); await load(); }, [load]);

  const logout = useCallback(async () => { try { await api('POST', 'logout'); } catch { /* ignore */ } signOut(); }, [signOut]);

  const changedPaths = useMemo(() => (doc ? diffPaths(doc.publishedContent || {}, doc.draft) : []), [doc]);

  const value = {
    user, setUser, doc, saveState, saveErrors, load, saveNow, setValue, change, resetSection, publish, discard, logout,
    changes: doc ? doc.changes : 0, changedPaths,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
