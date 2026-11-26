# Welkin Farmstead — Where Goodness Grows

Multi-page static website (no framework). Publish directory = repo root, no build command needed on Netlify.

Pages: `index` · `shop` · `orchard` · `aquaculture` · `livestock` · `visits` · `seasons` · `careers` · `contact` · `404`

## Editing
The `.html` pages are generated from `build.py` so the header/footer stay identical everywhere.
To change text, products or links: edit `build.py`, then run

    python3 build.py

(needs Pillow: `pip install pillow`). Commit the regenerated pages.

- WhatsApp number: `WA_NUM` in `build.py` and `WA` in `script.js`
- Season calendar: `CROPS` in `script.js`
- Photos: `assets/photos/` (800px mobile versions are generated automatically by the build)
