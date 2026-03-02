/* Film page — horizontal scroll, light table, lightbox */
(function () {
  gsap.registerPlugin(ScrollTrigger);

  var NEGATIVE = 'sepia(1) saturate(2.5) brightness(0.38) contrast(1.4) hue-rotate(-15deg)';
  var CLEAR    = 'sepia(0) saturate(1) brightness(1) contrast(1) hue-rotate(0deg)';

  var track      = document.querySelector('.film-track');
  var strip      = document.querySelector('.film-strip-full');
  var frames     = gsap.utils.toArray('.film-strip-full .film-frame');
  var captionBar = document.querySelector('.film-caption-bar');
  var counterEl  = document.querySelector('.frame-counter');
  var captionEl  = document.querySelector('.frame-caption');
  var total      = frames.length;

  /* --- Intro entrance --- */
  var intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .to('.film-heading', { opacity: 1, y: 0, duration: 1 })
    .to('.film-description', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
    .to('.scroll-hint', { opacity: 1, duration: 0.6 }, '-=0.3');


  /* --- Horizontal scroll --- */
  function getScrollDistance() {
    return track.scrollWidth - window.innerWidth;
  }

  var scrollTween = gsap.to(track, {
    x: function () { return -getScrollDistance(); },
    ease: 'none',
    scrollTrigger: {
      trigger: '.film-container',
      pin: true,
      scrub: 0.3,
      end: function () { return '+=' + getScrollDistance(); },
      invalidateOnRefresh: true,
      onEnter: function () {
        gsap.to(captionBar, { opacity: 1, duration: 0.4 });
      },
      onLeaveBack: function () {
        gsap.to(captionBar, { opacity: 0, duration: 0.3 });
      },
    },
  });


  /* --- Film viewer / FV-2010 backlight effect --- */
  var viewerPanel = document.querySelector('.viewer-panel');

  if (viewerPanel) {
    /* Viewer backlight turns on as horizontal scroll begins */
    ScrollTrigger.create({
      trigger: '.film-container',
      start: 'top top',
      end: 'top -6%',
      scrub: true,
      onUpdate: function (self) {
        var p = self.progress;
        /* Panel glows from dark → bright white */
        var bgAlpha = (p * 0.18).toFixed(4);
        var shadowAlpha1 = (p * 0.25).toFixed(4);
        var shadowAlpha2 = (p * 0.1).toFixed(4);
        viewerPanel.style.background = 'rgba(255, 255, 255, ' + bgAlpha + ')';
        viewerPanel.style.boxShadow =
          '0 0 80px rgba(255, 255, 255, ' + shadowAlpha1 + '), ' +
          '0 0 200px rgba(255, 255, 255, ' + shadowAlpha2 + ')';
      },
    });

    /* Slight zoom on the film strip */
    gsap.to(strip, {
      scale: 1.04,
      scrollTrigger: {
        trigger: '.film-container',
        start: 'top top',
        end: 'top -8%',
        scrub: true,
      },
    });

    /* Film strip edges react to backlight — warm amber glow */
    ScrollTrigger.create({
      trigger: '.film-container',
      start: 'top top',
      end: 'top -10%',
      onEnter: function () {
        strip.classList.add('is-backlit');
      },
      onLeaveBack: function () {
        strip.classList.remove('is-backlit');
      },
    });
  }


  /* --- Per-frame: negative ↔ color (bidirectional) + update caption --- */
  frames.forEach(function (frame, i) {
    var img = frame.querySelector('img');
    var caption = frame.getAttribute('data-caption') || '';

    /* Color transition: negative → clear when entering bright zone,
       clear → negative when leaving left side.
       toggleActions: onEnter onLeave onEnterBack onLeaveBack
       "play reverse play reverse" makes it fully bidirectional */
    gsap.fromTo(img,
      { filter: NEGATIVE },
      {
        filter: CLEAR,
        scrollTrigger: {
          trigger: frame,
          containerAnimation: scrollTween,
          start: 'left 80%',
          end: 'left 45%',
          scrub: 0.3,
          toggleActions: 'play reverse play reverse',
        },
      }
    );

    /* Darken again when frame passes center and exits left */
    gsap.fromTo(img,
      { filter: CLEAR },
      {
        filter: NEGATIVE,
        scrollTrigger: {
          trigger: frame,
          containerAnimation: scrollTween,
          start: 'right 30%',
          end: 'right 5%',
          scrub: 0.3,
        },
      }
    );

    /* Caption update when frame reaches center */
    ScrollTrigger.create({
      trigger: frame,
      containerAnimation: scrollTween,
      start: 'left 55%',
      end: 'right 45%',
      onEnter: function () { updateCaption(i, caption); },
      onEnterBack: function () { updateCaption(i, caption); },
    });
  });

  function updateCaption(index, text) {
    counterEl.textContent = (index + 1) + ' / ' + total;
    captionEl.textContent = text;
  }


  /* --- Scroll hint fades out as you start scrolling --- */
  ScrollTrigger.create({
    trigger: '.film-container',
    start: 'top 90%',
    onEnter: function () {
      gsap.to('.scroll-hint', { opacity: 0, duration: 0.4 });
    },
  });


  /* --- Lightbox --- */
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  var lightboxImg = lightbox.querySelector('.lightbox-img');
  var lightboxCaption = lightbox.querySelector('.lightbox-caption');
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    var frame = frames[index];
    var img = frame.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = frame.getAttribute('data-caption') || '';
    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    currentIndex = (currentIndex + direction + total) % total;
    var frame = frames[currentIndex];
    var img = frame.querySelector('img');

    /* Brief fade for smooth image swap */
    gsap.to(lightboxImg, {
      opacity: 0,
      duration: 0.15,
      onComplete: function () {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = frame.getAttribute('data-caption') || '';
        gsap.to(lightboxImg, { opacity: 1, duration: 0.25 });
      },
    });
  }

  /* Click handlers on film frames */
  frames.forEach(function (frame, i) {
    frame.addEventListener('click', function () {
      openLightbox(i);
    });
  });

  /* Close handlers */
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* Navigation */
  lightbox.querySelector('.lightbox-prev').addEventListener('click', function (e) {
    e.stopPropagation();
    navigateLightbox(-1);
  });
  lightbox.querySelector('.lightbox-next').addEventListener('click', function (e) {
    e.stopPropagation();
    navigateLightbox(1);
  });

  /* Keyboard support */
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
})();
