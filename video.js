/* Video page — GSAP scroll-driven zoom-in: CRT monitor → fullscreen VidEeoh
   The VidEeoh page is scaled to fit inside the CRT screen and clipped to its shape.
   As the CRT zooms in, the VidEeoh grows with it until it fills the viewport. */
(function () {
  gsap.registerPlugin(ScrollTrigger);

  var wrapper = document.querySelector('.video-zoom-wrapper');
  var crtFrame = document.querySelector('.video-crt-frame');
  var bezel = document.querySelector('.video-crt-bezel');
  var base = document.querySelector('.video-crt-base');
  var screen = document.querySelector('.video-screen');
  var scanlines = document.querySelector('.video-scanlines');
  var scrollCue = document.querySelector('.hacker-scroll-cue');
  var cursor = document.querySelector('.hacker-cursor');
  var screenContent = document.querySelector('.video-screen-content');
  var videoContent = document.querySelector('.video-content');
  var ytPage = document.querySelector('.yt-page');

  if (!wrapper || !crtFrame) return;

  function getZoomInScale() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var sw = screen.offsetWidth;
    var sh = screen.offsetHeight;
    return Math.max(vw / sw, vh / sh) * 1.3;
  }

  gsap.set(crtFrame, { scale: 1 });

  ScrollTrigger.create({
    trigger: wrapper,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: function (self) {
      var p = self.progress;
      var vw = window.innerWidth;
      var vh = window.innerHeight;

      /* --- Phase 1 (0–15%): Fade "scroll down" --- */
      var cueFade = 1 - Math.min(p / 0.15, 1);
      if (scrollCue) scrollCue.style.opacity = cueFade;
      if (cursor) cursor.style.opacity = cueFade;

      /* --- Phase 2 (15–85%): CRT zooms in --- */
      var zoomP = Math.max(0, Math.min((p - 0.15) / 0.7, 1));
      var easedZoom = zoomP * zoomP * (3 - 2 * zoomP);
      var endScale = getZoomInScale();
      var currentScale = 1 + (endScale - 1) * easedZoom;
      crtFrame.style.transform = 'scale(' + currentScale + ')';

      /* --- Phase 3 (20–45%): VidEeoh appears inside CRT screen --- */
      var contentFade = Math.max(0, Math.min((p - 0.2) / 0.25, 1));

      if (screenContent) screenContent.style.opacity = 1 - contentFade;
      if (ytPage) ytPage.style.opacity = contentFade;

      /* Make CRT screen semi-transparent so VidEeoh shows through */
      if (screen) {
        screen.style.background = 'rgba(10, 10, 10, ' + (1 - contentFade) + ')';
      }
      if (scanlines) scanlines.style.opacity = 1 - contentFade;

      /* --- Scale + clip VidEeoh to fit inside CRT screen --- */
      if (videoContent && ytPage && contentFade > 0) {
        var screenRect = screen.getBoundingClientRect();

        if (p < 0.88) {
          /* Scale yt-page to fit inside the CRT screen */
          var scaleX = screenRect.width / vw;
          var scaleY = screenRect.height / vh;
          var scale = Math.min(Math.max(scaleX, scaleY), 1);

          /* Center the scaled content within the screen area */
          var contentW = vw * scale;
          var contentH = vh * scale;
          var offsetX = screenRect.left + (screenRect.width - contentW) / 2;
          var offsetY = screenRect.top + (screenRect.height - contentH) / 2;

          ytPage.style.transformOrigin = 'top left';
          ytPage.style.transform = 'translate(' + offsetX + 'px,' + offsetY + 'px) scale(' + scale + ')';

          /* Clip to CRT screen shape */
          var insetTop = Math.max(0, screenRect.top);
          var insetRight = Math.max(0, vw - screenRect.right);
          var insetBottom = Math.max(0, vh - screenRect.bottom);
          var insetLeft = Math.max(0, screenRect.left);
          var radiusP = 1 - Math.max(0, Math.min((p - 0.4) / 0.4, 1));
          var radius = 10 * radiusP * currentScale;

          videoContent.style.clipPath = 'inset(' +
            insetTop + 'px ' + insetRight + 'px ' +
            insetBottom + 'px ' + insetLeft + 'px round ' + radius + 'px)';

          videoContent.style.overflowY = 'hidden';
          videoContent.style.pointerEvents = 'none';
        } else {
          /* Smooth transition to full viewport (88–100%) */
          var transP = Math.max(0, Math.min((p - 0.88) / 0.12, 1));
          var easeT = transP * transP * (3 - 2 * transP);

          var scaleNow = Math.min(Math.max(screenRect.width / vw, screenRect.height / vh), 1);
          var finalScale = scaleNow + (1 - scaleNow) * easeT;

          var contentW = vw * scaleNow;
          var contentH = vh * scaleNow;
          var rawX = screenRect.left + (screenRect.width - contentW) / 2;
          var rawY = screenRect.top + (screenRect.height - contentH) / 2;
          var finalX = rawX * (1 - easeT);
          var finalY = rawY * (1 - easeT);

          ytPage.style.transformOrigin = 'top left';
          ytPage.style.transform = 'translate(' + finalX + 'px,' + finalY + 'px) scale(' + finalScale + ')';
          videoContent.style.clipPath = 'inset(0)';
          videoContent.style.overflowY = 'auto';
          videoContent.style.pointerEvents = 'auto';
        }
      }

      /* --- Phase 4 (40–70%): Bezel + base fade --- */
      var bezelFade = 1 - Math.max(0, Math.min((p - 0.4) / 0.3, 1));
      if (bezel) bezel.style.opacity = bezelFade;
      if (base) base.style.opacity = bezelFade;
    },
  });

  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      ScrollTrigger.refresh();
    }, 200);
  });
})();
