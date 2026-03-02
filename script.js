/* Landing page — GSAP animations */
(function () {
  gsap.registerPlugin(ScrollTrigger);

  var NEGATIVE_FILTER = 'sepia(1) saturate(2.5) brightness(0.38) contrast(1.4) hue-rotate(-15deg)';
  var CLEAR_FILTER = 'sepia(0) saturate(1) brightness(1) contrast(1) hue-rotate(0deg)';


  /* ===========================================
     HERO: entrance + cloud scroll
     =========================================== */

  /* Entrance: Hello + subtitle fade in */
  var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .to('.hero-hello', { opacity: 1, y: 0, duration: 1.2 })
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
    .to('.scroll-cue', { opacity: 1, duration: 0.6 }, '-=0.2');

  /* Cloud parallax + hero fade — single ScrollTrigger for performance */
  var clouds = gsap.utils.toArray('.cloud');
  var heroContent = document.querySelector('.hero-content');
  var scrollCue = document.querySelector('.scroll-cue');

  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: function (self) {
      var p = self.progress;

      /* Move clouds apart */
      clouds.forEach(function (cloud, i) {
        var direction = i % 2 === 0 ? -1 : 1;
        var speed = 60 + i * 30;
        var moveY = -(80 + i * 25) * p;
        var moveX = direction * speed * p;
        var fade = 1 - p;
        cloud.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px) scale(' + (1 + p * 0.2) + ')';
        cloud.style.opacity = fade;
      });

      /* Fade hero text */
      var textP = Math.min(p / 0.4, 1);
      if (heroContent) {
        heroContent.style.transform = 'translateY(' + (-60 * textP) + 'px)';
        heroContent.style.opacity = 1 - textP;
      }

      /* Fade scroll cue early */
      var cueP = Math.min(Math.max((p - 0.05) / 0.1, 0), 1);
      if (scrollCue) {
        scrollCue.style.opacity = 1 - cueP;
      }
    },
  });


  /* ===========================================
     MAIN CONTENT: entrance animations
     =========================================== */

  /* Title + tagline + buckets + footer entrance */
  ScrollTrigger.create({
    trigger: '.landing-main',
    start: 'top 80%',
    once: true,
    onEnter: function () {
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
    },
  });

  /* Video section entrance */
  ScrollTrigger.create({
    trigger: '.video-section',
    start: 'top 80%',
    once: true,
    onEnter: function () {
      gsap.to('.bucket-video', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    },
  });

  /* Goodbye entrance — "Thank you" fades in first, then "Goodbye" */
  ScrollTrigger.create({
    trigger: '.goodbye-section',
    start: 'top 80%',
    once: true,
    onEnter: function () {
      var tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.to('.thank-you-text', {
        opacity: 1,
        y: 0,
        duration: 1,
      })
      .to('.goodbye-text', {
        opacity: 1,
        y: 0,
        duration: 1.2,
      }, '-=0.5');
    },
  });


  /* ===========================================
     BUCKET 1: Film packet hover (desktop only)
     =========================================== */

  var hasHover = window.matchMedia('(hover: hover)').matches;

  var activeBucket = document.getElementById('bucket-portraits');
  if (activeBucket && hasHover) {
    var packet = activeBucket.querySelector('.film-packet');
    var images = packet.querySelectorAll('.film-frame img');
    var allFrames = packet.querySelectorAll('.film-frame');
    var peekTimer = null;
    var isPeeking = false;
    var hoveredFrame = null;

    /* Smooth scale-up on hover */
    activeBucket.addEventListener('mouseenter', function () {
      gsap.to(packet, { scale: 1.05, duration: 0.4, ease: 'power2.out' });

      /* Start 2-second peek timer (localized color reveal) */
      peekTimer = setTimeout(function () {
        isPeeking = true;
        gsap.to(packet, { scale: 1.12, duration: 0.6, ease: 'power2.out' });
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

    /* Per-frame color tracking */
    allFrames.forEach(function (frame) {
      var img = frame.querySelector('img');

      frame.addEventListener('mouseenter', function () {
        hoveredFrame = frame;
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
        gsap.to(img, {
          filter: NEGATIVE_FILTER,
          duration: 0.5,
          ease: 'power2.in',
        });
      });
    });

    /* Click transition to film page */
    activeBucket.addEventListener('click', function (e) {
      e.preventDefault();
      var href = activeBucket.getAttribute('href');

      gsap.to(images, {
        filter: CLEAR_FILTER,
        duration: 0.4,
        stagger: 0.03,
        ease: 'power2.out',
      });
      gsap.to(packet, {
        scale: 2.5,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.in',
      });
      gsap.to('.landing-header, .bucket:not(#bucket-portraits), .landing-footer, .goodbye-section, .video-section', {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      });

      setTimeout(function () {
        window.location.href = href;
      }, 550);
    });
  }


  /* ===========================================
     BUCKET 2: Polaroid stack flip-through
     =========================================== */

  var workBucket = document.getElementById('bucket-work');
  if (workBucket && hasHover) {
    var stack = workBucket.querySelector('.polaroid-stack');
    var polaroids = gsap.utils.toArray(stack.querySelectorAll('.polaroid'));
    var flipTimer = null;
    var flipTimeout = null;
    var isFlipping = false;
    var currentTop = 0;

    /* Track the visual order — index 0 = topmost card */
    var order = [];
    for (var k = 0; k < polaroids.length; k++) { order.push(k); }

    /* Base rotations for natural scattered look */
    var baseRotations = [-2, 1.5, -3.5, 2.8, -1, 3];
    var baseOffsetX = [0, 3, -4, 5, -2, 2];
    var baseOffsetY = [0, 2, 3, -1, 4, 1];

    function updateZIndices() {
      for (var j = 0; j < order.length; j++) {
        polaroids[order[j]].style.zIndex = polaroids.length - j;
      }
    }

    /* Scale up on hover, start flip after 2s */
    workBucket.addEventListener('mouseenter', function () {
      gsap.to(stack, { scale: 1.05, duration: 0.3, ease: 'power2.out' });

      /* After 1.5 seconds, start flip-through */
      flipTimer = setTimeout(function () {
        isFlipping = true;
        doFlip();
      }, 1500);
    });

    workBucket.addEventListener('mouseleave', function () {
      clearTimeout(flipTimer);
      clearTimeout(flipTimeout);
      isFlipping = false;
      gsap.to(stack, { scale: 1, duration: 0.4, ease: 'power2.out' });

      /* Reset all polaroids to base positions */
      polaroids.forEach(function (p, i) {
        gsap.to(p, {
          x: baseOffsetX[i] || 0,
          y: baseOffsetY[i] || 0,
          rotation: baseRotations[i] || 0,
          duration: 0.5,
          ease: 'power2.out',
        });
      });

      /* Reset order and z-indices */
      order = [];
      for (var j = 0; j < polaroids.length; j++) { order.push(j); }
      updateZIndices();
    });

    function doFlip() {
      if (!isFlipping) return;

      /* The card at order[0] is the current top card */
      var topIdx = order[0];
      var topCard = polaroids[topIdx];
      var baseRot = baseRotations[topIdx] || 0;
      var baseX = baseOffsetX[topIdx] || 0;
      var baseY = baseOffsetY[topIdx] || 0;

      /* Slide left, THEN update z-order so it visually goes behind, THEN slide back */
      var tl = gsap.timeline();
      tl.to(topCard, {
        x: -120,
        rotation: -15,
        duration: 0.4,
        ease: 'power2.inOut',
      })
      .call(function () {
        /* Move this card to the back of the order BEFORE it returns */
        order.push(order.shift());
        updateZIndices();
      })
      .to(topCard, {
        x: baseX,
        y: baseY,
        rotation: baseRot,
        duration: 0.35,
        ease: 'power2.out',
        onComplete: function () {
          /* Schedule next flip */
          if (isFlipping) {
            flipTimeout = setTimeout(doFlip, 3000);
          }
        },
      });
    }
  }
})();
