import { useEffect } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import { Sprites } from './Svg.jsx';
import { Decos } from './Deco.jsx';
import { Header, Footer, AppNav } from './Shell.jsx';
import { ScrollTools } from './Parts.jsx';
import { findRoute, OG_IMAGE } from '../data/routes.js';
import { PAGE_DECOS } from '../data/content.js';

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/** Keeps title, description and the active nav state in sync with the current page. */
function useRouteEffects(route) {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    document.title = route.title;
    setMeta('meta[name="description"]', 'content', route.desc);
    setMeta('meta[property="og:title"]', 'content', route.title);
    setMeta('meta[property="og:description"]', 'content', route.desc);
    setMeta('meta[property="og:image"]', 'content', OG_IMAGE);
    document.body.setAttribute('data-page', route.active);
  }, [route]);

  // New pages open at the top; back/forward keep the browser's own scroll position.
  useEffect(() => {
    if (navType !== 'POP') window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, navType]);
}

export default function Layout() {
  const { pathname } = useLocation();
  const route = findRoute(pathname);
  useRouteEffects(route);
  const pdeco = PAGE_DECOS[route.path];
  return (
    <>
      <Sprites />
      <Header route={route} />
      <main id="main">
        {pdeco && <div className="pdeco deco-wrap" aria-hidden="true"><Decos items={pdeco} /></div>}
        <Outlet />
      </main>
      <Footer />
      <AppNav route={route} />
      <ScrollTools />
    </>
  );
}
