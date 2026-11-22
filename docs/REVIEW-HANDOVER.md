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

## 6. Deployment status
- Pages enabled: https://laoyutalks-max.github.io/3D/
- The site goes live when this PR is merged into `main` of the 3D repo (the workflow deploys on push to `main`). Production repo and site are untouched.

## 7. Remaining issues
- Review and production share the origin `laoyutalks-max.github.io`, so they share `localStorage` (theme, language, training-matrix demo data, sign-up flag). Changes made on one appear on the other.
- Canonical / Open Graph URLs still point to production (intended: it avoids duplicate indexing of the review copy).
- `run_checks.py` cannot be adjusted for `/3D/` without editing `.claude/` (owner-only).
- Local working copy of production (`site\`, branch `feature/v3-cinematic-library`) has uncommitted 3.1 work that recolours the brand green → cyan and makes dark the default theme. It was **not** used here, because it changes brand colours. The owner should decide whether it belongs in the review.
