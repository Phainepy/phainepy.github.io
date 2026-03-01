/* Landing page — GSAP animations */
(function () {
  gsap.registerPlugin();

  var NEGATIVE_FILTER = 'sepia(1) saturate(2.5) brightness(0.38) contrast(1.4) hue-rotate(-15deg)';
  var CLEAR_FILTER = 'sepia(0) saturate(1) brightness(1) contrast(1) hue-rotate(0deg)';

  /* --- Entrance animations --- */
  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.site-title', { opacity: 1, y: 0, duration: 1 })
    .to('.site-tagline', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('.bucket', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
    }, '-=0.3')
    .to('.landing-footer', { opacity: 1, duration: 0.6 }, '-=0.3');

  /* Placeholder buckets stay dimmed */
  gsap.set('.bucket--placeholder', { opacity: 0.45 });


  /* --- Film packet hover interactions (desktop only) --- */
  var hasHover = window.matchMedia('(hover: hover)').matches;
  if (!hasHover) return;

  var activeBucket = document.getElementById('bucket-portraits');
  if (!activeBucket) return;

  var packet = activeBucket.querySelector('.film-packet');
  var images = packet.querySelectorAll('.film-frame img');
  var allFrames = packet.querySelectorAll('.film-frame');
  var peekTimer = null;
  var isPeeking = false;
  var hoveredFrame = null;

  /* --- Change 1: Fluid water-like wiggle on hover --- */
  activeBucket.addEventListener('mouseenter', function () {
    gsap.timeline()
      .to(packet, { rotation: -1.2, y: -2, duration: 0.25, ease: 'sine.inOut' })
      .to(packet, { rotation: 1.4, y: 1, duration: 0.35, ease: 'sine.inOut' })
      .to(packet, { rotation: -0.6, y: -1, duration: 0.3, ease: 'sine.inOut' })
      .to(packet, { rotation: 0.3, y: 0.5, duration: 0.25, ease: 'sine.inOut' })
      .to(packet, { rotation: 0, y: 0, duration: 0.35, ease: 'elastic.out(0.4, 0.3)' });

    /* Change 2a: Immediate inviting scale-up */
    gsap.to(packet, { scale: 1.05, duration: 0.3, ease: 'power2.out' });

    /* Start 2-second peek timer (localized color reveal) */
    peekTimer = setTimeout(function () {
      isPeeking = true;
      gsap.to(packet, { scale: 1.12, duration: 0.6, ease: 'power2.out' });
      /* Only reveal the currently hovered frame */
      if (hoveredFrame) {
        var hoveredImg = hoveredFrame.querySelector('img');
        gsap.to(hoveredImg, {
          filter: CLEAR_FILTER,
          duration: 1.2,
          ease: 'power2.out',
        });
      }
    }, 2000);
  });

  activeBucket.addEventListener('mouseleave', function () {
    clearTimeout(peekTimer);
    isPeeking = false;
    hoveredFrame = null;
    gsap.to(packet, { scale: 1, rotation: 0, y: 0, duration: 0.4, ease: 'power2.out' });
    gsap.to(images, {
      filter: NEGATIVE_FILTER,
      duration: 0.5,
      stagger: 0.04,
      ease: 'power2.in',
    });
  });

  /* --- Change 2b: Per-frame color tracking --- */
  allFrames.forEach(function (frame) {
    var img = frame.querySelector('img');

    frame.addEventListener('mouseenter', function () {
      hoveredFrame = frame;
      /* If already peeking (2s passed), reveal this frame immediately */
      if (isPeeking) {
        gsap.to(img, {
          filter: CLEAR_FILTER,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    });

    frame.addEventListener('mouseleave', function () {
      if (hoveredFrame === frame) hoveredFrame = null;
      /* Revert this frame to negative */
      gsap.to(img, {
        filter: NEGATIVE_FILTER,
        duration: 0.5,
        ease: 'power2.in',
      });
    });
  });


  /* --- Click transition to film page --- */
  activeBucket.addEventListener('click', function (e) {
    e.preventDefault();
    var href = activeBucket.getAttribute('href');

    /* Expand + color flash then navigate */
    gsap.to(images, {
      filter: CLEAR_FILTER,
      duration: 0.4,
      stagger: 0.03,
    });
    gsap.to(packet, {
      scale: 2.5,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.in',
    });
    gsap.to('.landing-header, .bucket:not(#bucket-portraits), .landing-footer', {
      opacity: 0,
      duration: 0.3,
    });

    setTimeout(function () {
      window.location.href = href;
    }, 550);
  });
})();
