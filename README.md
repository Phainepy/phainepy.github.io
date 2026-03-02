# Lil Traumatized — Photography Portfolio

A static photography portfolio hosted on GitHub Pages. Uses GSAP for animations, plain HTML/CSS/JS with no build step.

---

## File Structure

```
/
├── index.html              Landing page (sky gradient, hero, 3 categories)
├── film.html               Film strip subpage (Category 1 photos)
├── work.html               Work subpage (Category 2 — polaroids on string lights)
├── video.html              Video projects subpage (Category 3 — CRT intro + VidEeoh page)
├── styles.css              All styles (landing + film + work + video pages)
├── script.js               Landing page GSAP animations
├── film.js                 Film page animations (scroll, lightbox)
├── work.js                 Work page animations (string physics, lighting, lightbox)
├── video.js                Video page animations (CRT zoom-out, page reveal)
├── CNAME                   Custom domain config
├── Category 1 - Examples/  Photos for "Photos I want to shoot more of"
│   ├── AIV00797.avif
│   ├── AIV00930.avif
│   └── ... (12 photos)
├── Category 2 - General photos/  Photos for "My other work"
│   ├── AIV00654.avif
│   ├── AIV05837.avif
│   └── ... (14 photos)
└── Category 3 - Youtube Video Projects/  Thumbnails for "My Video Projects"
    ├── EDEN Thumbnail 3.avif
    ├── Call Your Mom Thumbnail.avif
    └── Sisters Thumnail.avif
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

### To the work page (Category 2):

1. **Add the image file** to the `Category 2 - General photos/` folder in `.avif` format.

2. **Add a polaroid in `work.html`** inside one of the `<div class="polaroid-row">` containers. Copy an existing polaroid block and update the image:

```html
<div class="work-polaroid" data-index="14">
  <div class="clothespin"></div>
  <div class="work-polaroid-frame">
    <div class="work-polaroid-photo">
      <img src="Category%202%20-%20General%20photos/YOUR_FILENAME.avif" alt="" loading="lazy" />
    </div>
  </div>
</div>
```

- `data-index` — sequential number used for lightbox ordering
- Photos display in their original colors (no filters applied)
- Each row holds 3–4 polaroids. Add a new `<div class="string-row">` if you need another row.

3. **Optionally update the landing page preview** in `index.html`. The polaroid stack in `#bucket-work` shows 6 preview photos. Replace any `<img>` src to swap which photos appear in the stack.

### To the video page (Category 3):

1. **Add the thumbnail** to the `Category 3 - Youtube Video Projects/` folder in `.avif` format (~400×225px recommended).

2. **Add a video card in `video.html`** inside the `<div class="yt-video-grid">`. Copy an existing card block and update it:

```html
<a href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID" target="_blank" rel="noopener noreferrer" class="yt-video-card">
  <div class="yt-thumb-wrap">
    <img src="Category%203%20-%20Youtube%20Video%20Projects/YOUR_THUMBNAIL.avif" alt="Video Title" loading="lazy" />
    <span class="yt-duration">3:42</span>
  </div>
  <div class="yt-video-info">
    <h3 class="yt-video-title">Video Title</h3>
    <p class="yt-video-meta">LilTraumatized</p>
    <p class="yt-video-views">0 views</p>
  </div>
</a>
```

- Update the `href` with your YouTube video URL
- Update the duration, title, and view count
- Note: spaces in folder names use `%20` in the `src` path

3. **Optionally update the CRT hover thumbnails** on the landing page in `index.html`. The CRT screen cycles through thumbnail images inside `.crt-thumbnails`. Add or replace `<img class="crt-thumb">` elements to change which thumbnails appear on hover.

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
- **Polaroid click transition:** Clicking the polaroid stack scatters polaroids outward with random rotation, fades other elements, then navigates to `work.html`
- **CRT monitor (desktop):** On hover, screen powers on with a beat, then flashes static and cycles through video thumbnails. Clicking triggers a zoom-in transition to `video.html`
- **Goodbye:** "Thank you for visiting" and "Goodbye" fade in with staggered timing

### Work page (`work.js`)
- **Dark room entrance:** Page starts dark with an overlay. As you scroll into the string lights section, the overlay fades out and string light bulbs glow from dim to bright warm light
- **String physics (desktop):** Each string row has a verlet integration physics simulation with 20 points. Moving the mouse near a string pushes the points away, creating a natural wobble effect. Points spring back to rest positions
- **Polaroid hover (desktop):** Polaroids scale up (1.08×) and lift 15px off the string toward the viewer. The clothespin stretches and the shadow deepens for a 3D "picking up" feel
- **Lightbox:** Click any polaroid to view full-size. Navigate with arrow keys/buttons. Escape or backdrop click to close. Smooth fade transitions between photos
- **Mobile:** Physics disabled, static catenary strings rendered once. Polaroid rows wrap to 2 per row. Tap to open lightbox

### Film page (`film.js`)
- **Horizontal scroll:** GSAP ScrollTrigger converts vertical scrolling into horizontal movement of the film strip
- **Negative-to-color:** Each photo transitions from amber/sepia (film negative look) to full color as it scrolls into the center, and back to negative as it exits left
- **FV-2010 viewer:** A soft white backlight glow appears behind the film strip when scrolling begins, simulating a backlit film viewing surface
- **Film grain:** SVG noise overlay gives the page a subtle grainy film texture
- **First-frame burn:** The first photo has a warm orange overlay simulating light exposure at the start of a film roll
- **Lightbox:** Clicking any photo opens it full-size with arrow navigation and keyboard support (Escape to close, arrows to navigate)

### Video page (`video.js`)
- **CRT zoom-out intro:** Page opens on a fullscreen black screen with green "scroll down" hacker text and blinking cursor. As you scroll, the screen zooms out via GSAP ScrollTrigger to reveal it's inside a CRT monitor — bezel, base, and power light fade in, screen gets barrel distortion border-radius
- **VidEeoh reveal:** Once the zoom-out completes, a retro old-school YouTube-style page ("VidEeoh") fades in below with a search bar, Browse/Upload tabs, sidebar with Sign In and Categories, and 3 video thumbnail cards linking to YouTube

### Animation library
All animations use [GSAP](https://gsap.com/) loaded from CDN. No npm or build step required. The two plugins used are:
- `gsap.min.js` — core animation engine
- `ScrollTrigger.min.js` — scroll-driven animations

---

## Landing Page Categories

1. **Photos I want to shoot more of** — Film strip packet linking to `film.html`
2. **My other work** — Polaroid stack linking to `work.html`
3. **My Video Projects** — CRT monitor linking to `video.html` (retro "VidEeoh" page)

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
- **Film strip:** Translucent dark brown (`--film-base: rgba(30, 14, 6, 0.82)`)
- **Film negative filter:** `sepia(1) saturate(2.5) brightness(0.38) contrast(1.4) hue-rotate(-15deg)`
- **Work page:** Dark room black (`--darkroom-bg: #0d0d0f`) → warm dark brown (`--darkroom-warm: #1a1612`) on scroll
- **String lights:** Dim amber (`--string-light-dim`) → bright warm glow (`--string-light-glow`) when lights turn on
- **Video page intro:** Black (`#000`) with green hacker text (`#00ff41`)
- **VidEeoh page:** White background with gray header gradient, red accent (`#c4302b`) on logo and tab bar, blue links (`#336699`)

To change colors, edit the `:root` variables in `styles.css`.
