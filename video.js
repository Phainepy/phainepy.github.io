/* Video page — GSAP scroll-driven zoom-out from fullscreen to CRT monitor */
(function () {
  gsap.registerPlugin(ScrollTrigger);

  var wrapper = document.querySelector('.video-zoom-wrapper');
  var crtFrame = document.querySelector('.video-crt-frame');
  var bezel = document.querySelector('.video-crt-bezel');
  var base = document.querySelector('.video-crt-base');
  var screen = document.querySelector('.video-screen');
  var scrollCue = document.querySelector('.hacker-scroll-cue');
  var cursor = document.querySelector('.hacker-cursor');

  if (!wrapper || !crtFrame) return;

  /* Calculate the scale needed so the screen fills the viewport at start.
     The "natural" CRT screen size will be about 500×375 (4:3 aspect).
     We need to scale up so it covers 100vw × 100vh. */
  var TARGET_SCREEN_W = 500;
  var TARGET_SCREEN_H = 375;

  function getInitialScale() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    /* Scale to cover viewport fully (use max of w/h ratios + slight overflow) */
    return Math.max(vw / TARGET_SCREEN_W, vh / TARGET_SCREEN_H) * 1.08;
  }

  /* Set initial state: screen fills viewport, bezel hidden */
  var startScale = getInitialScale();
  gsap.set(crtFrame, { scale: startScale });
  gsap.set(screen, { width: TARGET_SCREEN_W + 'px', height: TARGET_SCREEN_H + 'px' });

  /* Scroll-driven zoom out */
  ScrollTrigger.create({
    trigger: wrapper,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.8,
    onUpdate: function (self) {
      var p = self.progress; /* 0 → 1 as user scrolls through the 300vh section */

      /* Zoom out: startScale → 1 */
      var currentScale = startScale + (1 - startScale) * p;
      crtFrame.style.transform = 'scale(' + currentScale + ')';

      /* At ~30% scroll, start showing bezel and framing the screen */
      var bezelP = Math.max(0, Math.min((p - 0.2) / 0.2, 1));
      if (bezelP > 0) {
        bezel.classList.add('bezel-visible');
        base.classList.add('bezel-visible');
        screen.classList.add('screen-framed');
      } else {
        bezel.classList.remove('bezel-visible');
        base.classList.remove('bezel-visible');
        screen.classList.remove('screen-framed');
      }

      /* Fade out scroll cue text as user starts scrolling */
      var cueFade = 1 - Math.min(p / 0.15, 1);
      if (scrollCue) scrollCue.style.opacity = cueFade;
      if (cursor) cursor.style.opacity = cueFade;

      /* Barrel distortion: subtle border-radius warp as it zooms out */
      var warpAmount = bezelP * 6; /* max 6px of extra curve on sides */
      screen.style.borderRadius = bezelP > 0
        ? (10 + warpAmount) + 'px / ' + (10 + warpAmount * 1.5) + 'px'
        : '0';
    },
  });

  /* Reveal VidEeoh page after scrolling past the zoom section */
  ScrollTrigger.create({
    trigger: '.video-content',
    start: 'top 80%',
    once: true,
    onEnter: function () {
      gsap.to('.yt-page', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
      });
    },
  });

  /* Handle resize */
  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      startScale = getInitialScale();
      ScrollTrigger.refresh();
    }, 200);
  });
})();
