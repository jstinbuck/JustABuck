<!-- Copilot instructions for the JustABuck static site -->

# Quick Orientation

- **Project type:** Small, static marketing website (single-page `index.html` + a few legal pages).
- **Key files:** `index.html` (main content + small inline script), `style.css` (single stylesheet), `JS/main.js` (present but empty), `img/` and `Video/` (assets), `impressum.html`, `datenschutz.html`, `allergen.html` (legal pages).

# Big picture

- The site is a plain HTML/CSS static site with no build tooling. Content and behavior live in `index.html`; styles live in `style.css`.
- The page is oriented toward accessibility and SEO: many `aria-` attributes, `loading="lazy"` on images, and a JSON-LD block for `FoodEstablishment`.
- Small interactive behaviors are implemented inline in `index.html` (announcement banner close, mobile nav toggle, year injection). For larger scripts, add code to `JS/main.js` and include it via a script tag near the end of the body.

# Project-specific patterns & conventions (do not change lightly)

- Accessibility-first: elements use explicit `aria-label`, `role`, and `aria-expanded` attributes (example: mobile menu button toggles `aria-expanded` and `.nav-links.is-open`). Keep these attributes in sync with DOM changes.
- Announcement dismissal uses a persistent localStorage key: `jab_banner_dismissed_v1`. Respect and reuse this key when altering banner logic.
- CSS is organized as a single scoped stylesheet. Comments mark sections and scope rules to specific containers (e.g. `.navbar .logo` vs global `img`). Follow the existing scoping approach when adding styles to avoid unintended global overrides.
- Images use `loading="lazy"` and fixed width/height where included; maintain these attributes for layout stability and CLS reduction.

# Known gotchas

- Filesystem case sensitivity: the repo root contains `Video/` (capital V) but `index.html` references `video/`. Development on Windows will work but Linux-based hosts (CI / GitHub Pages when served by a case-sensitive runner) may break. Prefer using lowercase folder names or update `index.html` references to match actual casing.
- `JS/main.js` exists but is empty. Inline script in `index.html` handles banner, year, and menu today — if you move behavior to `JS/main.js`, keep that logic intact and ensure it runs after DOM is ready.

# Development workflows

- Quick local preview (PowerShell):
```powershell
# from repo root
python -m http.server 8000; Start-Process "http://localhost:8000"
```
- Alternative (if Node available):
```powershell
npx serve -s . -l 8000
```
- Debugging: use browser DevTools. Inspect `localStorage` for the key `jab_banner_dismissed_v1` when testing the announcement bar. Check `aria-expanded` on `.nav-toggle` when testing responsive menu.

# Where to change common pieces

- Update copyright year: small inline script sets `#y` in `index.html`.
- Add new interactive behavior: put code in `JS/main.js` and include with `<script src="JS/main.js"></script>` before `</body>`.
- Add images/videos: place them in `img/` and `Video/` respectively and update `index.html` references.

# Integration & external links

- The site links out to WhatsApp, Instagram, Google Maps and external ordering URL (`/order`). These are simple anchors (no server callbacks). When changing contact links, update the hrefs in `index.html`.
- Structured data is embedded in `index.html` (`application/ld+json`) and should be kept accurate for SEO.

# Testing & deployment notes

- There are no automated tests. Validate changes manually by running the local server and checking accessibility (tab order, skip link), responsive menu, and the announcement dismissal flow.
- For deployment to case-sensitive hosts, ensure file/folder casing matches references in HTML.

# Example snippets (preserve the intent)

- Announcement close logic uses `localStorage.setItem('jab_banner_dismissed_v1','1')` and animation class `is-hiding` — keep this same key if you extend the behavior.
- Mobile menu toggles `aria-expanded` and `.nav-links.is-open`. Example: `toggle.setAttribute('aria-expanded', String(!open)); nav?.classList.toggle('is-open');` — keep both DOM state and attributes in sync.

# If you need more
- Ask what workflows you'd like added (formatting, linting, deploy scripts). I can add a small `package.json` and local dev scripts if you want a Node-based workflow.

-- End of guidance. Reply with any missing details you want included.
