/* Landing page — GSAP animations */
(function () {
  gsap.registerPlugin();

  const NEGATIVE_FILTER = 'sepia(1) saturate(2.5) brightness(0.38) contrast(1.4) hue-rotate(-15deg)';
  const CLEAR_FILTER = 'sepia(0) saturate(1) brightness(1) contrast(1) hue-rotate(0deg)';

  /* --- Entrance animations --- */
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

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
  const hasHover = window.matchMedia('(hover: hover)').matches;
  if (!hasHover) return;

  const activeBucket = document.getElementById('bucket-portraits');
  if (!activeBucket) return;

  const packet = activeBucket.querySelector('.film-packet');
  const images = packet.querySelectorAll('.film-frame img');
  let peekTimer = null;
  let isPeeking = false;

  /* Wiggle on hover */
  activeBucket.addEventListener('mouseenter', function () {
    gsap.timeline()
      .to(packet, { rotation: -1.5, duration: 0.08, ease: 'power1.inOut' })
      .to(packet, { rotation: 1.5, duration: 0.12, ease: 'power1.inOut' })
      .to(packet, { rotation: -0.8, duration: 0.1, ease: 'power1.inOut' })
      .to(packet, { rotation: 0, duration: 0.1, ease: 'power1.out' });

    /* Start 2-second peek timer */
    peekTimer = setTimeout(function () {
      isPeeking = true;
      gsap.to(packet, { scale: 1.08, duration: 0.6, ease: 'power2.out' });
      gsap.to(images, {
        filter: CLEAR_FILTER,
        duration: 1.2,
        stagger: 0.08,
        ease: 'power2.out',
      });
    }, 2000);
  });

  activeBucket.addEventListener('mouseleave', function () {
    clearTimeout(peekTimer);
    isPeeking = false;
    gsap.to(packet, { scale: 1, rotation: 0, duration: 0.4, ease: 'power2.out' });
    gsap.to(images, {
      filter: NEGATIVE_FILTER,
      duration: 0.5,
      stagger: 0.04,
      ease: 'power2.in',
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
