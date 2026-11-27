import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';
import { ROUTES, NOT_FOUND, findRoute } from './data/routes.js';
import { SNAPSHOT } from './content/snapshot.js';
import { themeCss } from './content/theme.js';

const FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };

export function render(url) {
  const html = renderToString(
    <StaticRouter location={url} future={FUTURE}>
      <App />
    </StaticRouter>,
  );
  return { html, route: findRoute(url, SNAPSHOT) };
}

/** Every page to prerender, with its title/description resolved from the current content. */
export function routeList() {
  return [...ROUTES, NOT_FOUND].map((r) => ({ ...findRoute(r.path === '*' ? '/page-not-found' : r.path, SNAPSHOT), url: r.path === '*' ? '/page-not-found' : r.path }));
}

/** CSS for the brand colours, when they were changed in the admin. */
export const themeStyle = () => themeCss(SNAPSHOT.theme);
