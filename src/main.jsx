import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles.css';
import 'leaflet/dist/leaflet.css'; // after our stylesheet: keeps the original cascade (map skin overrides Leaflet defaults)
import App from './App.jsx';

// Opt in to React Router v7 behaviour now (silences upgrade notices).
const ROUTER_FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter future={ROUTER_FUTURE}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered pages are hydrated; the dev server starts from an empty shell.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
