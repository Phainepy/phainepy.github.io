# Lil Traumatized — Photography Portfolio

A static photography portfolio hosted on GitHub Pages. Uses GSAP for animations, plain HTML/CSS/JS with no build step.

---

## File Structure

```
/
├── index.html              Landing page (sky gradient, 3 bucket cards)
├── film.html               Film strip subpage (Category 1 photos)
├── styles.css              All styles (landing + film page)
├── script.js               Landing page GSAP animations
├── film.js                 Film page animations (scroll, lightbox, burns)
├── CNAME                   Custom domain config
├── Category 1 - Examples/  Photos for "work I want to shoot more of"
│   ├── AIV00797.avif
│   ├── AIV00930.avif
│   └── ... (12 photos)
└── Category 2 - General photos/  Photos for "my other work"
    ├── AIV00654.avif
    └── ... (13+ photos)
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

3. **Optionally update the landing page preview** in `index.html`. The film packets on the landing page show 6 preview photos (3 per strip row). Replace any `<img>` src inside `#bucket-portraits` to swap which photos appear in the preview.

### To Category 2 (when that page is built):

Same pattern — add the file to `Category 2 - General photos/` and add a frame element.

---

## How to Update Text

| What to change | File | Where to find it |
|---|---|---|
| Site title ("Lil Traumatized") | `index.html` | `<h1 class="site-title">` |
| Tagline ("Photography Portfolio") | `index.html` | `<p class="site-tagline">` |
| Bucket card titles | `index.html` | `<h2 class="bucket-title">` (one per bucket) |
| Film page heading ("Dirty Rat Boi") | `film.html` | `<h1 class="film-heading">` |
| Film page description | `film.html` | `<p class="film-description">` |
| Photo captions | `film.html` | `data-caption="..."` on each `.film-frame` |
| Email address | `index.html` | `<a class="contact-link">` in the footer |
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
- **Entrance:** Title, tagline, bucket cards, and footer fade in with staggered timing
- **Hover wiggle:** When you hover over the first bucket, the film packet gently sways using `sine.inOut` easing (water-like motion)
- **Peek reveal:** After hovering for 2 seconds, the packet scales up and the specific photo under your cursor transitions from negative to full color
- **Click transition:** Clicking the bucket zooms the packet in, fades everything else out, then navigates to `film.html`

### Film page (`film.js`)
- **Horizontal scroll:** GSAP ScrollTrigger converts vertical scrolling into horizontal movement of the film strip
- **Negative-to-color:** Each photo transitions from amber/sepia (film negative look) to full color as it scrolls into the center of the viewport
- **Light table:** A soft white glow appears behind the film strip when scrolling begins, simulating a backlit film viewing surface
- **Film grain:** An SVG noise overlay gives the page a subtle grainy film texture
- **Film burns:** Random warm light leaks fade in and out every 6-15 seconds
- **First-frame burns:** The first 3 photos have permanent warm orange overlays simulating light exposure at the start of a film roll
- **Lightbox:** Clicking any photo opens it full-size with arrow navigation and keyboard support (Escape to close, arrows to navigate)

### Animation library
All animations use [GSAP](https://gsap.com/) loaded from CDN. No npm or build step required. The two plugins used are:
- `gsap.min.js` — core animation engine
- `ScrollTrigger.min.js` — scroll-driven animations

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
- **Film page:** Dark gray-black background (`#141412`)
- **Film strip:** Dark brown (`--film-base: #1e0e06`)
- **Film negative filter:** `sepia(1) saturate(2.5) brightness(0.38) contrast(1.4) hue-rotate(-15deg)`

To change colors, edit the `:root` variables in `styles.css`.
