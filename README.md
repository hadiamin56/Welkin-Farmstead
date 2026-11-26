# Welkin Farmstead — Where Goodness Grows

Website for Welkin Farmstead, Sopore, Kashmir. Built with **React 18 + Vite + React Router**, prerendered to
static HTML at build time (fast first paint, crawlable pages, then hydrated into a smooth single-page app).
Maps use **Leaflet + OpenStreetMap**.

## Run it

```bash
npm install
npm run dev        # local dev server with hot reload
npm run build      # production build -> dist/ (11 prerendered pages)
npm run preview    # serve the production build locally
```

## Deploy (Netlify)

`netlify.toml` already sets everything: build command `npm ci && npm run build`, publish directory `dist`,
Node 20 and cache headers. Connect the repo and deploy — no extra settings needed.
Unknown URLs get the styled 404 page.

## Where things live

| What | Where |
|---|---|
| Page text, products, FAQ, seasons, journey stages, map pins | `src/data/content.js` |
| Page titles, descriptions, URLs | `src/data/routes.js` |
| Pages | `src/pages/` |
| Reusable pieces (header, footer, journey, map, forms…) | `src/components/` |
| Styles (one stylesheet) | `src/styles.css` |
| Line-art drawings and icons (generated SVG data) | `src/art/generated.js` |
| Photos | `public/assets/photos/` (a `-800` copy is used on phones) |
| WhatsApp number | `WA_NUM` in `src/lib/site.js` |

### Map pins
Both pins currently sit at the centre of Sopore. Put the exact coordinates in `LOCS` in `src/data/content.js`.

### Adding a photo
Drop `name.jpg` (≥1600px wide) in `public/assets/photos/`, plus an 800px-wide `name-800.jpg` for phones, and add
its width/height to `PHOTOS` in `src/art/generated.js`.

## Pages

`/` · `/shop` · `/orchard` · `/aquaculture` · `/livestock` · `/visits` · `/seasons` · `/gallery` · `/careers` · `/contact`
