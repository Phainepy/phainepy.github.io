# Lil Traumatized — Photography Portfolio

A static photography portfolio hosted on GitHub Pages. Uses GSAP for animations, plain HTML/CSS/JS with no build step.

---

## File Structure

```
/
├── index.html              Landing page (sky gradient, hero, 3 categories)
├── film.html               Film strip subpage (Category 1 photos)
├── styles.css              All styles (landing + film page)
├── script.js               Landing page GSAP animations
├── film.js                 Film page animations (scroll, lightbox)
├── CNAME                   Custom domain config
├── Category 1 - Examples/  Photos for "Photos I want to shoot more of"
│   ├── AIV00797.avif
│   ├── AIV00930.avif
│   └── ... (12 photos)
└── Category 2 - General photos/  Photos for "My other work"
    ├── AIV05934.avif
    └── ... (6+ photos)
```

---

## How to Add New Photos

### To the film strip page (Category 1):

1. **Add the image file** to the `Category 1 - Examples/` folder. Use `.avif` format for best compression (`.jpg` also works).

2. **Add a frame in `film.html`** inside the `<div class="film-strip-full">` element. Copy an existing frame block and update it:

```html
<div class="film-frame" data-frame="18" data-caption="Your caption here">
  <img src="Category%201%20-%20Examples/YOUR_FILENAME.avif" alt="Your caption here" loading="lazy" />
</div>
```

- `data-frame` — the frame number shown below the photo (increment from the last one)
- `data-caption` — the text shown in the caption bar at the bottom when scrolling
- `alt` — accessibility text (use the same as caption)
- Note: spaces in folder names use `%20` in the `src` path

3. **Optionally update the landing page preview** in `index.html`. The film packet on the landing page shows 6 preview photos (3 per strip row). Replace any `<img>` src inside `#bucket-portraits` to swap which photos appear in the preview.

### To Category 2 (Polaroid stack on landing page):

Photos for the "My other work" polaroid stack are referenced in `index.html` inside `#bucket-work`. Each polaroid is:

```html
<div class="polaroid polaroid--1">
  <div class="polaroid-photo"><img src="Category%202%20-%20General%20photos/YOUR_FILENAME.avif" alt="" loading="lazy" /></div>
</div>
```

Change the numbered class (`polaroid--1` through `polaroid--6`) to control stacking order. Up to 6 polaroids are supported.

---

## How to Update Text

| What to change | File | Where to find it |
|---|---|---|
| Hero text ("Hello") | `index.html` | `<h1 class="hero-hello">` |
| Hero subtitle ("I'm Lil Traumatized") | `index.html` | `<p class="hero-sub">` |
| Site title ("Lil Traumatized") | `index.html` | `<h2 class="site-title">` |
| Tagline ("Photography Portfolio") | `index.html` | `<p class="site-tagline">` |
| Category titles | `index.html` | `<h2 class="bucket-title">` (one per category) |
| "Thank you for visiting" | `index.html` | `<p class="thank-you-text">` |
| "Goodbye" | `index.html` | `<h2 class="goodbye-text">` |
| Film page heading ("Dirty Rat Boi") | `film.html` | `<h1 class="film-heading">` |
| Film page description | `film.html` | `<p class="film-description">` |
| Photo captions | `film.html` | `data-caption="..."` on each `.film-frame` |
| Copyright year | `index.html` | `<p class="copyright">` |

---

## How to Update Social Links

In `index.html`, find the `<div class="social-links">` section in the footer. Each link is an `<a>` tag with an `href`:

```html
<a href="https://www.instagram.com/lil_traumatized/" ...>
<a href="https://www.youtube.com/@liltraumatized" ...>
<a href="https://soundcloud.com/liltraumatized" ...>
```

Change the `href` to update the URL. To add a new social icon, copy one of the existing `<a class="social-link">` blocks and swap the SVG icon and href.

---

## How the Animations Work

### Landing page (`script.js`)
- **Hero:** "Hello" and subtitle fade in, clouds parallax on scroll and drift apart
- **Entrance:** Title, tagline, category cards, and footer fade in with staggered timing as you scroll down
- **Film packet hover (desktop):** Scales up smoothly on hover. After 2 seconds, the specific photo under your cursor transitions from film negative to full color
- **Click transition:** Clicking the film packet zooms it in, fades everything else out, then navigates to `film.html`
- **Polaroid stack (desktop):** Scales up on hover. After 1.5 seconds, top polaroid slides left, tucks behind the stack, and the next photo is revealed. Repeats every 3 seconds
- **CRT monitor (desktop):** Screen turns on with a blue glow, scanlines, and green power light on hover
- **Goodbye:** "Thank you for visiting" and "Goodbye" fade in with staggered timing

### Film page (`film.js`)
- **Horizontal scroll:** GSAP ScrollTrigger converts vertical scrolling into horizontal movement of the film strip
- **Negative-to-color:** Each photo transitions from amber/sepia (film negative look) to full color as it scrolls into the center, and back to negative as it exits left
- **FV-2010 viewer:** A soft white backlight glow appears behind the film strip when scrolling begins, simulating a backlit film viewing surface
- **Film grain:** SVG noise overlay gives the page a subtle grainy film texture
- **First-frame burn:** The first photo has a warm orange overlay simulating light exposure at the start of a film roll
- **Lightbox:** Clicking any photo opens it full-size with arrow navigation and keyboard support (Escape to close, arrows to navigate)

### Animation library
All animations use [GSAP](https://gsap.com/) loaded from CDN. No npm or build step required. The two plugins used are:
- `gsap.min.js` — core animation engine
- `ScrollTrigger.min.js` — scroll-driven animations

---

## Landing Page Categories

1. **Photos I want to shoot more of** — Film strip packet linking to `film.html`
2. **My other work** — Polaroid stack (Coming soon)
3. **My Video Projects** — CRT monitor icon (Coming soon)

---

## How to Deploy

This site auto-deploys via GitHub Pages. Just push to the branch configured in your repo's Pages settings:

```bash
git add .
git commit -m "your message"
git push
```

Changes go live within 1-2 minutes. No build step needed — GitHub serves the files directly.

---

## Colors & Theming

The site uses CSS custom properties defined at the top of `styles.css`:

- **Landing page:** Pink-to-blue sky gradient (`--sky-top`, `--sky-pink`, `--sky-blue`, `--sky-bottom`)
- **Film page:** Dark gray-black background (`#161614`)
- **Film strip:** Dark brown (`--film-base: #1e0e06`)
- **Film negative filter:** `sepia(1) saturate(2.5) brightness(0.38) contrast(1.4) hue-rotate(-15deg)`

To change colors, edit the `:root` variables in `styles.css`.
