/* Film page — horizontal scroll + negative-to-color transitions */
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
      scrub: 1,
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


  /* --- Per-frame: negative → color + update caption --- */
  frames.forEach(function (frame, i) {
    var img = frame.querySelector('img');
    var caption = frame.getAttribute('data-caption') || '';

    /* Color transition tied to scroll position */
    gsap.fromTo(img,
      { filter: NEGATIVE },
      {
        filter: CLEAR,
        scrollTrigger: {
          trigger: frame,
          containerAnimation: scrollTween,
          start: 'left 75%',
          end: 'left 35%',
          scrub: true,
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
})();
