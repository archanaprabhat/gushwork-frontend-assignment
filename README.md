# Gushwork frontend assignment

A responsive product page built with **vanilla HTML, CSS, and JavaScript** (no frameworks). It follows the Gushwork take-home briefs.

## Walkthrough

[Loom — project walkthrough](https://www.loom.com/share/5f7731666da446f6a751772554d334bc)

## Features

- **Sticky quote bar** — Appears above the nav after you scroll past the hero; hides when scrolling up or when the hero is back in view (`IntersectionObserver` + scroll direction, CSS transitions).
- **Product gallery** — Thumbnails, prev/next controls, and smooth image changes with optional zoom preview on desktop hover.
- **Marquee carousels** — Auto-scrolling tracks (e.g. applications, testimonials) with arrow / touch control where implemented; respects reduced motion when supported.
- **Design tokens** — Shared colors, type, radii, and container insets via CSS custom properties for consistent spacing across breakpoints.
- **Accessible touches** — Semantic landmarks, keyboard-friendly modals (Escape), and ARIA on key interactive controls.

## Tech stack

- HTML5  
- CSS3 (Flexbox, Grid, custom properties, media queries)  
- JavaScript (DOM APIs, IIFEs)

## Project layout

| Path | Purpose |
|------|---------|
| `index.html` | Markup and content |
| `styles.css` | Styles and responsive rules |
| `script.js` | Sticky bar, galleries, zoom, nav, modals, FAQ |
| `assets/` | Images and icons |
| `favicon.png` | Favicon |

## Getting started

### Clone

```bash
git clone https://github.com/archanaprabhat/gushwork-frontend-assignment.git
cd gushwork-frontend-assignment
```

### Run

Open `index.html` in a browser, or use a static server (e.g. `npx --yes serve .`) if you prefer `http://localhost` over `file://`.


## Note

Submission for the Gushwork hiring process.
