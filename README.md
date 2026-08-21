# Komal Rajput — Portfolio

An editorial, interactive portfolio for a business-analytics / commercial-strategy / AI-and-automation practitioner. Static site, no build step, ready for GitHub Pages.

**Positioning:** *I take messy business problems and turn them into useful things.*

---

## Run / deploy

It's a plain static site — no build, no backend, no database.

- **Locally:** open `index.html` in a browser (or run any static server, e.g. `python3 -m http.server`).
- **GitHub Pages:** put every file in this folder at the repo root (or in `/docs`), then enable Pages on that branch/folder. All paths are relative, so it works from a project subpath (`username.github.io/repo/`) without changes.

### Files
```
index.html                       markup + content
styles.css                       design system + all styles
script.js                        all interactions & animations
Komal_Rajput_Resume_Public.pdf   linked from hero, contact, nav
NovaMart_Dashboard.png           project 01
Automated_Sales_Reporting.png    project 02
Pricing_Profitability_Scenario_Model.png   project 03
README.md
```

Fonts (Fraunces, Instrument Sans, JetBrains Mono) and GSAP load from CDN at runtime. If they're ever unavailable, the site degrades gracefully to system fonts and no-animation — content stays fully readable.

---

## Design system

- **Palette:** ivory `#F4F0E6`, deep ink-navy `#1B2A3A`, muted botanical green `#3B5A44`, deep botanical panel `#14231B`, lime `#C6E36A`; peach and lavender as sparing accents.
- **Type:** Fraunces (display serif), Instrument Sans (body/UI), JetBrains Mono (labels, numbers, SQL).
- **Feel:** editorial publication, generous whitespace, hairline rules, subtle grain — not a SaaS dashboard.

---

## What's interactive

- **Hero analytics workspace** — a working mini "workspace" with three modes (**Analyze / Automate / Build**). Each tab re-runs its own animation: messy data resolves into a sorted chart, six manual steps collapse into one refresh, a question assembles into a small tool. Built from synthetic portfolio figures.
- **Project gallery** — hover zoom, a light scan sweep, the project number shifts colour, and a cursor label appears. Click any card (or Enter/Space when focused) to open a case study.
- **Case study modal** — a click-through of **Problem → Approach → Output → Impact** with Back/Next, not a wall of text.
- **SQL terminal** — type a query and *Run* it for an animated "running…" bar and synthetic output. Easter egg: `SELECT * FROM komal;`.
- **Pricing scenario explorer** — pick a scenario and watch revenue, gross profit, the margin ring and "profit vs base" animate. Numbers are the *exact* synthetic figures from the Pricing project (e.g. Price +8% → 39.9% margin, +$831,770).
- **"What do you need help with?"** — pick a need (messy spreadsheet, dashboard, report, commercial question, automation, AI prototype) and the recommendation card swaps, linking to the relevant case.
- **Skills, beliefs, timeline** — quiet reveal-on-scroll and hover detail.
- **Komal mode** (`K/`, bottom-right) — a small status panel. Also opens if you type `komal` anywhere.

## Motion

Page-load timeline (staggered), scroll-triggered reveals, a little scroll-linked drift on project numbers and the hero panel, magnetic buttons, a marquee, and a custom desktop cursor that expands to **Explore** over projects. GSAP powers the sequencing/scroll work; everything else is vanilla JS.

## Accessibility & robustness

- Respects `prefers-reduced-motion` (animations off, cursor off, content static).
- Keyboard accessible: real buttons, visible focus, Escape closes the modal/egg, modal traps focus, projects open on Enter/Space.
- No hover-only content; custom cursor is desktop-only.
- No horizontal overflow (checked at 390 / 768 / 1440).
- Works with no JS/GSAP (content and layout remain intact).

---

## Content note

Every project uses **synthetic / public portfolio data** — no real clients, metrics, or engagements are implied. Experience, roles and dates reflect Komal's actual résumé. Full working files can be shared privately for genuine project conversations.
