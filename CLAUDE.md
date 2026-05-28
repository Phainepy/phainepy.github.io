# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static photography portfolio for artist "Lil Traumatized" at **www.liltraumatized.com**, hosted on GitHub Pages. No build step, no bundler, no npm — plain HTML/CSS/JS served directly.

## Development

```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

The preview server is also configured in `.claude/launch.json`. There is no linter, test suite, or build process. Deploy by pushing to main — GitHub Pages auto-deploys within 1-2 minutes.

**Cache busting:** The Python http.server caches aggressively. CSS and JS files use query string versioning (`styles.css?v=16`). Increment the `?v=` number in the HTML file(s) whenever you modify styles or scripts, or changes won't appear on reload.

## Architecture

### Single shared stylesheet, per-page JS

All pages share one `styles.css` (~2300 lines), organized into clearly labeled sections:
- **Landing page** (line ~56) — `.landing-page` body class
- **Film page** (line ~866) — `.film-page` body class
- **Work page** (line ~1369) — `.work-page` body class
- **Video page** (line ~1775) — `.video-page` body class

Each page has its own JS file: `script.js` (landing), `film.js`, `work.js`, `video.js`. All use GSAP + ScrollTrigger loaded from CDN — no local copies.

### Pages and their concepts

| Page | File | Body class | Visual concept |
|------|------|------------|----------------|
| Landing | `index.html` | `.landing-page` | Pink-blue sky gradient, clouds parallax, hero "Hello", about section, 3 category buckets |
| Film | `film.html` | `.film-page` | Horizontal-scrolling film strip, negative-to-color transition, lightbox viewer |
| Work | `work.html` | `.work-page` | Darkroom with string lights, polaroids on clothesline, serpentine mobile layout |
| Video | `video.html` | `.video-page` | CRT monitor boot sequence, YouTube-styled video browser |

### Landing page structure

The landing page has three interactive category buckets that link to subpages:
1. **Film packet** (`#bucket-portraits`) → `film.html` — hover reveals color from film negative
2. **Polaroid stack** (`#bucket-work`) → `work.html` — hover flips through stacked polaroids
3. **CRT monitor** (`#bucket-video`) → `video.html` — hover powers on the screen with thumbnails

Each bucket has a click transition animation before navigating.

### Key CSS patterns

- **CSS custom properties** in `:root` control all theming (sky gradient, film colors, text, darkroom)
- **Two fonts only:** Cormorant Garamond (`--font-display`, used for "Hello" and "Goodbye") and Inter (`--font-body`, used everywhere else)
- **`color-scheme: light`** is set on both the meta tag and `:root` to prevent dark mode browsers from inverting colors
- **`clamp()`** used throughout for responsive sizing (e.g., `clamp(6rem, 18vw, 14rem)` for Hello)
- **Mobile breakpoints:** `768px` (general mobile), `560px` (small mobile with cloud scaling and layout changes), `900px` (tablet)
- **`mix-blend-mode: multiply`** on the floating signature PNG to remove its white background

### GSAP animation patterns

All animations follow the same pattern:
- `ScrollTrigger.create()` with `once: true` for entrance animations (fade in on first scroll)
- `ScrollTrigger` with `scrub` for scroll-tied animations (about section opacity, film color transitions)
- Hover animations use `mouseenter`/`mouseleave` with `gsap.to()` — no CSS transitions for interactive elements
- Desktop-only hover effects gated behind `window.matchMedia('(hover: hover)').matches`

### Image assets

Photos are in folders with spaces in names — HTML references use `%20` encoding:
- `Category 1 - Examples/` — Film strip photos (.avif)
- `Category 2 - General photos/` — Polaroid photos (.avif)
- `Category 3 - Youtube Video Projects/` — Video thumbnails (.avif)
- `Other Art Resources/` — Signature PNG and other assets

Use `.avif` format for all new photos.

## Common gotchas

- **Worktree limitation:** If `main` is checked out in the main repo, you can't check it out in a worktree. Use `git checkout -b branch-name origin/main` instead.
- **Python server caching:** Always bump the `?v=` cache buster when editing CSS/JS.
- **`position: fixed` + z-index:** The floating signature uses `position: fixed; z-index: 1` while `.landing-main` uses `position: relative; z-index: 2`. Content sections have transparent backgrounds so the signature shows through — this is intentional.
- **Mobile goodbye section:** The goodbye section padding must stay small on mobile (`40px 24px 24px` at ≤560px) or the footer gets pushed off-screen since real mobile browsers have URL bars that reduce viewport height.
