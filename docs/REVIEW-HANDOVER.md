# LAOYUTALKS 3D Review — Handover Report (22 Nov 2026)

Review repo: `laoyutalks-max/3D` · Branch: `feature/review-3d` · Source of truth: `laoyutalks-content-brain@daffbb3` (production `main`, untouched)

## 1. Source-code completeness

| | Production | Review before | Review after |
|---|---|---|---|
| Tracked files | 178 | 57 | 184 (all 178 + deploy workflow + 2 earlier 3.1 CSS layers + `review3d.css/js` + this report) |
| HTML pages | 40 | 11 | 40 |
| Files identical to production | — | 52 | 175 |

After the sync, the only files that differ from production are deliberate review changes:
- `index.html`, `resources.html`: load the earlier 3.1 review stylesheets (`laoyu-home-31.css`, `laoyu-31.css`)
- `404.html`: `<base href>` changed from `/laoyutalks-content-brain/` to `/3D/` so the 404 page stays on the review site
- All 40 pages: one `<link>` to `review3d.css` and one `<script>` to `review3d.js` were added

## 2. Missing files and dependencies (found, now fixed)

121 production files were missing from the Review repo:
- **29 HTML pages**: all resource/tool pages (8D, OEE, KPI dashboard, shift handover, skills matrix, fishbone, decision matrix, 3 dashboards, 3 demos, 5 AI tools, training matrix, 404 …)
- **13 JS**: `dash.js`, `factory3d.js` (3D twin), `res.js`, `resource-kit.js`, `tools.js`, `tools-ai.js`, `tools-mgmt.js`, `tools-prod.js`, `training-matrix.js` …
- **3 CSS**: `story.css`, `training-matrix.css` (+ `dash.css` already present)
- **59 assets**: `laoyu-logo.png`, `laoyu-logo-hud.png`, `laoyu-share.png`, KPI previews, all 46 resource preview images
- **Downloads**: `files/*.xlsx`, `files/sample-production-data.csv`
- **Data/config**: `sitemap.xml`, `tm-approved.json`, TikTok verification file, `src/*` generators and `catalog.json`, `server/ai-lab-worker`, `docs/`, `.claude/` safety tooling, `CLAUDE.md`, `README.md`, `.gitignore`

Before the sync, 36 links from live pages/scripts (sidebar, chatbot, resources data, about, automation) pointed at files that did not exist in the Review repo. After it: **0 real broken references**. The scanner still lists 10 names, but these are file names that scripts generate for browser downloads (e.g. `starter-daily-production.csv`), the same as in production.

**Deployment dependency:** GitHub Pages had never been enabled, so all 3 earlier deploy runs failed at "Configure Pages". It is now enabled (source: GitHub Actions).

## 3. Preserved features
Cinematic 3D homepage (Three.js story, chapter pins), factory 3D twin, header/nav/footer, sidebar tool drawer, site search, EN / 中文 / EN+中 switching, light/dark theme, resources library (search, category goals, filters, cards, previews, detail pages), sign-up gate, chatbot "Help", OEE "Try it" calculator, Automation Lab (advisor, builder, ROI, cases), AI Lab, AI tools, dashboards with CSV import/template download, training matrix, legal pages, sitemap. Logo, brand colours and all copy unchanged.

## 4. Visual enhancements (`review3d.css` + `review3d.js`, additive)
- Smooth cross-page transitions (View Transitions API, 0.26 s; ignored by browsers without support)
- Thin scroll-progress bar; header gains depth shadow on scroll
- Typography: balanced headline wrapping, tighter tracking, larger section headings with an accent rule
- Depth: soft colour glows on alternate sections; faint perspective grid on light page heroes; layered shadows
- Hero entrance: staggered fade-up of eyebrow, headline, lede, buttons
- Cards: elevation plus a gentle 3D tilt (max ~3.5°) and light glare following the pointer. Mouse/trackpad only; skipped on touch and on cards that contain form fields
- Scroll reveal: sections and cards below the fold fade up with a short stagger
- Buttons: small lift on hover, press feedback
- **Fix**: Resources headline was invisible in light theme (dark text on the dark 3.1 hero). Now readable
- `prefers-reduced-motion` turns all motion off; if the layer fails to load, every page still works

## 5. Testing results (local server at `/3D/`, Chromium)
- All 40 pages load; layer present on 40/40; logo and nav on 40/40; **0 broken images**; **0 console errors** on the pages checked
- Resources: search "downtime" 41 → 5 cards; category "Quality Management" 41 → 2; card links resolve (e.g. `8d-report.html`)
- Language: 中文 switches headline and cards (`lang="zh-Hans"`), EN restores
- Theme toggle light ↔ dark works
- Mobile 375 px: resources, home, automation have no horizontal overflow; tilt disabled on touch
- Project checks (`.claude/tests/run_checks.py`): secrets, forbidden files, catalog, sidebar sync, sitemap, syntax, i18n **PASS**. `links` FAIL only because the checker hard-codes the production path and rejects the review `/3D/` base in `404.html`. `cache-bust` WARN only because the newly added production files are new to this repo

### 5b. Happy and unhappy path tests (EN and 中文)
Run through a local test server that replaces all outside network calls with a stub before any page script runs, so no test sign-up, chat or contact data reached the live Apps Script.

| Area | Happy path | Unhappy paths | Result |
|---|---|---|---|
| Resources search | "oee", "8D", "停机" match | empty → all 41; nonsense → "No resource matches that yet"; 300-char input; `<img onerror>` / `"; alert(1)` shown as text | Pass, no XSS |
| Category / type filters | all 8 counts match their labels | Quality + Calculator → empty message; Clear → 41; bogus `#c-…` hash → shows all | Pass |
| Header search | matches | nonsense → "0 found · No match" | Pass |
| Homepage OEE check | 78.3 %, perfect run 100 % | empty, zero, negative, text, downtime > planned, good > total → clear message, no NaN | Pass |
| Full OEE Loss Calculator | 83.9 % | empty / zero cycle → blank; **break > shift, downtime > run, bad > total → shows 0 % and a wrong loss report** | **Issue (same in production)** |
| Sign-up gate | unlocks, lead posted once | empty name, spaces-only name, empty/invalid email, `a..b@`, typo `gmial.com` (offers fix), disposable, test domain, domain without mail → right message, nothing sent | Pass |
| Gate offline | — | network down → still unlocks, lead queued; next visit online → sent once, queue cleared | Pass |
| Spreadsheet injection | — | name `=HYPERLINK(…)` stored as `'=HYPERLINK(…)` | Pass |
| Contact form | "✓ Message sent" | empty, bad email, disposable, no message; offline → error, text kept; request hangs → error after ~12 s, button re-enabled | Pass |
| Chatbot | guided answers EN/中文 | empty not sent; gibberish → fallback; `<img onerror>` shown as text; offline → still answers | Pass |
| 404 | — | missing page and nested missing path → branded 404, links stay in `/3D/` | Pass |
| Layer failure | — | `review3d.css/js` removed → all pages still work, nothing hidden | Pass |
| Print | — | cards not yet revealed by scrolling | Fixed (now always printed) |
| 中文 mode | — | all of the above messages appear in Chinese only | Pass |

Found and fixed during these tests:
- Printing could leave cards blank if they had not scrolled into view yet (fixed in `review3d.css`).
- The Resources headline fix depended on the new layer; it now lives in `laoyu-31.css`, next to the dark hero it fixes.

Not fixed (also in production; owner decision):
- Full OEE Loss Calculator (`tools-prod.js`) accepts impossible input and reports 0 % OEE with invented losses (e.g. 900 bad parts of 780 → "1,020 units lost"). The homepage mini-calculator already blocks this with messages in both languages.
- Contact form requires 5+ characters, which rejects real short Chinese messages such as "请联系我", and the error ("please write a message") is confusing.
- The three dashboards (`dash-*.html`) are "Coming soon", so their CSV import cannot be reached or tested by visitors.

## 6. Deployment status
- Pages enabled: https://laoyutalks-max.github.io/3D/
- The site goes live when this PR is merged into `main` of the 3D repo (the workflow deploys on push to `main`). Production repo and site are untouched.

## 7. Remaining issues
- Review and production share the origin `laoyutalks-max.github.io`, so they share `localStorage` (theme, language, training-matrix demo data, sign-up flag). Changes made on one appear on the other.
- Canonical / Open Graph URLs still point to production (intended: it avoids duplicate indexing of the review copy).
- `run_checks.py` cannot be adjusted for `/3D/` without editing `.claude/` (owner-only).
- Local working copy of production (`site\`, branch `feature/v3-cinematic-library`) has uncommitted 3.1 work that recolours the brand green → cyan and makes dark the default theme. It was **not** used here, because it changes brand colours. The owner should decide whether it belongs in the review.
