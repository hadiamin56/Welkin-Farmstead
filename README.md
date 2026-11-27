# Welkin Farmstead — website + admin panel

**React 18 + Vite + React Router**, prerendered to static HTML, with a built-in **admin panel** at `/admin`
(Netlify Function + Netlify Blobs — no external database or account needed). Maps use Leaflet + OpenStreetMap.

## What the admin panel controls
Everything on the public site: all text on every page, products (add / hide / reorder / feature), photos
(upload once, reuse anywhere), the season calendar, FAQ, jobs, gallery, journey stages, map pins, contact details,
announcement bar, WhatsApp number, and the title/description Google shows for each page.

- **Draft → Preview → Publish.** Edits autosave as a draft; *Preview* shows the real site with your changes; *Publish* makes them live.
- **History:** every publish is saved; restore any older version into the draft.
- **Enquiries inbox:** orders and visit requests sent from the website forms (visitors are still sent to WhatsApp).
- **Users:** owner and editor roles. **Backup:** download / load all content as one file.

## First-time setup on Netlify (about 5 minutes)
1. Connect the repo to Netlify (settings come from `netlify.toml`).
2. In **Site settings → Environment variables** add:

| Variable | Required | What it is |
|---|---|---|
| `JWT_SECRET` | yes | A long random string (32+ characters) used to sign admin sessions |
| `ADMIN_EMAIL` | first sign-in | Email of the first owner account |
| `ADMIN_PASSWORD` | first sign-in | Password for the first owner (10+ characters) |
| `BUILD_HOOK_URL` | optional | A Netlify *build hook* URL; if set, the prerendered pages rebuild after each publish |

3. Deploy, open `https://your-site/admin`, sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. The owner account is
   created on first sign-in; after that you can remove `ADMIN_PASSWORD` from the environment and add users in the panel.

**How updates reach visitors:** published content is served by the API (cached ~20 s), so changes appear within seconds.
If `BUILD_HOOK_URL` is set, a rebuild also bakes the latest content into the prerendered HTML (best for search engines);
every build pulls the live content automatically.

## Run it locally
```bash
npm install
npm run dev                    # public site only (admin needs the API, see below)
npm run build && npm start     # production build + local server with the API on http://localhost:8888
```
`npm start` stores data in `./.data` and signs sessions with a development secret. To try the admin locally:
```bash
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-long-password' npm start
```

## Where things live
| What | Where |
|---|---|
| Default text for every page (what the admin edits) | `src/content/defaults.js` |
| Which fields exist + validation rules | `src/content/schema.js` |
| Public pages / components | `src/pages/`, `src/components/` |
| Admin panel | `src/admin/` |
| API (auth, content, uploads, enquiries) | `server/handler.mjs` → `netlify/functions/api.mjs` |
| Styles | `src/styles.css` (site), `src/admin/admin.css` (admin, scoped) |
| Static photos | `public/assets/photos/` |

## Security notes
Passwords are hashed with scrypt; sessions are signed HttpOnly SameSite=Strict cookies; every admin write needs a
custom header (CSRF); sign-in is rate-limited; saved content is validated against the schema (links, images, numbers);
uploads are checked by file signature and resized in the browser. `/admin` and `/api` are excluded from search engines.


## WhatsApp alerts for bookings (optional)

Every Qurbani booking, order and farm-visit request is **saved to the site database** (Netlify Blobs) and listed under *Admin > Enquiries*. To also get a WhatsApp message on the owner's phone the moment one arrives, set **one** of these in Netlify (Site configuration > Environment variables):

- **CallMeBot (free, simplest):** `CALLMEBOT_PHONE` (e.g. `917006901374`) and `CALLMEBOT_APIKEY`. Get the key by sending "I allow callmebot to send me messages" to the CallMeBot WhatsApp number (see callmebot.com).
- **WhatsApp Cloud API (Meta, business-grade):** `WA_CLOUD_TOKEN`, `WA_PHONE_NUMBER_ID`, `WA_NOTIFY_TO`. For alerts outside WhatsApp's 24-hour window, create an approved message template with one body variable and set `WA_TEMPLATE` (and `WA_TEMPLATE_LANG`).

If neither is set, bookings are still saved and the admin shows a notice that alerts are off. A failed alert never loses a booking.
