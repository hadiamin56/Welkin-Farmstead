import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';
import { findRoute } from './data/routes.js';

export function render(url) {
  const html = renderToString(
    <StaticRouter location={url} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </StaticRouter>,
  );
  return { html, route: findRoute(url) };
}
