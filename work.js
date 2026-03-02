/* Work page — string lights, polaroid hover, lightbox, dark room lighting */
(function () {
  gsap.registerPlugin(ScrollTrigger);

  var isMobile = !window.matchMedia('(hover: hover)').matches;


  /* ===========================================
     1. INTRO ENTRANCE
     =========================================== */

  var introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  introTl
    .to('.work-heading', { opacity: 1, y: 0, duration: 1 })
    .to('.work-description', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
    .to('.scroll-hint', { opacity: 1, duration: 0.6 }, '-=0.3');


  /* ===========================================
     2. SCROLL LIGHTING  (dark room → lights turn on)
     =========================================== */

  var overlay = document.querySelector('.darkroom-overlay');
  var allBulbs = gsap.utils.toArray('.string-bulb');
  var lightsHaveTurnedOn = false;

  ScrollTrigger.create({
    trigger: '.string-lights-section',
    start: 'top 80%',
    end: 'top 30%',
    scrub: true,
    onUpdate: function (self) {
      var p = self.progress;
      if (overlay) overlay.style.opacity = 0.7 * (1 - p);
    },
    onEnter: function () {
      document.body.classList.add('lights-on');

      /* Staggered bulb turn-on animation — each bulb "pops" on */
      if (!lightsHaveTurnedOn) {
        lightsHaveTurnedOn = true;
        allBulbs.forEach(function (bulb, i) {
          /* Random delay for organic feel */
          var delay = 0.3 + Math.random() * 1.2;
          gsap.fromTo(bulb, {
            scale: 1,
          }, {
            scale: 1.4,
            duration: 0.2,
            delay: delay,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1,
          });
        });
      }
    },
    onLeaveBack: function () {
      document.body.classList.remove('lights-on');
      lightsHaveTurnedOn = false;
    },
  });

  /* Scroll hint fades out as string section enters */
  ScrollTrigger.create({
    trigger: '.string-lights-section',
    start: 'top 90%',
    once: true,
    onEnter: function () {
      gsap.to('.scroll-hint', { opacity: 0, duration: 0.4 });
    },
  });


  /* ===========================================
     2b. ROW FOCUS  (dim non-viewed rows)
     =========================================== */

  var allRows = gsap.utils.toArray('.string-row');
  var activeRow = -1;

  /* Start all rows dimmed */
  allRows.forEach(function (row) { row.classList.add('row-dimmed'); });

  /* Continuously track which row is closest to viewport center */
  ScrollTrigger.create({
    trigger: '.string-lights-section',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: function () {
      var vpCenter = window.scrollY + window.innerHeight * 0.5;
      var closest = -1;
      var closestDist = Infinity;

      allRows.forEach(function (row, i) {
        var rect = row.getBoundingClientRect();
        var rowCenter = window.scrollY + rect.top + rect.height * 0.5;
        var dist = Math.abs(vpCenter - rowCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });

      if (closest !== activeRow) {
        allRows.forEach(function (row, i) {
          if (i === closest) {
            row.classList.remove('row-dimmed');
          } else {
            row.classList.add('row-dimmed');
          }
        });
        activeRow = closest;
      }
    },
  });


  /* ===========================================
     3. LIGHTBOX / CAROUSEL
     =========================================== */

  var lightbox = document.getElementById('lightbox');
  var polaroids = gsap.utils.toArray('.work-polaroid');
  var total = polaroids.length;
  var currentIndex = 0;

  if (lightbox) {
    var lightboxImg = lightbox.querySelector('.lightbox-img');
    var lightboxCaption = lightbox.querySelector('.lightbox-caption');

    function getImgSrc(index) {
      var img = polaroids[index].querySelector('img');
      return img ? img.src : '';
    }

    function openLightbox(index) {
      currentIndex = index;
      lightboxImg.src = getImgSrc(index);
      lightboxImg.alt = '';
      lightboxCaption.textContent = '';
      lightbox.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
      currentIndex = (currentIndex + direction + total) % total;

      gsap.to(lightboxImg, {
        opacity: 0,
        duration: 0.15,
        onComplete: function () {
          lightboxImg.src = getImgSrc(currentIndex);
          lightboxImg.alt = '';
          lightboxCaption.textContent = '';
          gsap.to(lightboxImg, { opacity: 1, duration: 0.25 });
        },
      });
    }

    /* Click handlers on polaroids */
    polaroids.forEach(function (polaroid, i) {
      polaroid.addEventListener('click', function () {
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
  }


  /* ===========================================
     4. POLAROID HOVER (desktop only)
     =========================================== */

  if (!isMobile) {
    polaroids.forEach(function (polaroid) {
      var frame = polaroid.querySelector('.work-polaroid-frame');
      var pin = polaroid.querySelector('.clothespin');
      var isHovered = false;

      polaroid.addEventListener('mouseenter', function () {
        if (isHovered) return;
        isHovered = true;

        /* Kill any running tweens on this polaroid to prevent drift */
        gsap.killTweensOf(polaroid);

        gsap.to(polaroid, {
          scale: 1.2,
          y: -25,  /* absolute value — always -25 from base */
          duration: 0.4,
          ease: 'power2.out',
          zIndex: 20,
        });
        if (frame) {
          gsap.to(frame, {
            boxShadow: '0 16px 50px rgba(0,0,0,0.55), 0 6px 16px rgba(0,0,0,0.3)',
            duration: 0.4,
            ease: 'power2.out',
          });
        }
        if (pin) {
          gsap.to(pin, {
            scaleY: 1.3,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      });

      polaroid.addEventListener('mouseleave', function () {
        isHovered = false;

        /* Kill any running tweens to prevent conflicts */
        gsap.killTweensOf(polaroid);

        gsap.to(polaroid, {
          scale: 1,
          y: 0,  /* absolute value — back to base position */
          duration: 0.4,
          ease: 'power2.out',
          zIndex: 3,
        });
        if (frame) {
          gsap.to(frame, {
            boxShadow: '0 4px 16px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.15)',
            duration: 0.4,
            ease: 'power2.out',
          });
        }
        if (pin) {
          gsap.to(pin, {
            scaleY: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      });
    });
  }


  /* ===========================================
     5. STRING PHYSICS  (Verlet Integration)
     =========================================== */

  var rows = gsap.utils.toArray('.string-row');
  var POINTS_PER_STRING = 20;
  var GRAVITY = 0.12;
  var CONSTRAINT_ITERATIONS = 5;
  var MOUSE_RADIUS = 80;
  var MOUSE_FORCE = 0.8;
  var DAMPING = 0.95;
  var SPRING_BACK = 0.03;

  /* Mouse tracking */
  var mouseX = -9999;
  var mouseY = -9999;
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  /* Create physics data for each row */
  var stringData = [];

  rows.forEach(function (row, rowIndex) {
    var svg = row.querySelector('.string-svg');
    var bulbsContainer = row.querySelector('.string-bulbs');
    var rowPolaroids = gsap.utils.toArray(row.querySelectorAll('.work-polaroid'));

    /* Get row dimensions */
    var rect = row.getBoundingClientRect();
    var w = rect.width;
    var stringY = 30; /* vertical position within the row for string */

    /* Sag amount — makes it look like a natural catenary */
    var sag = 40 + rowIndex * 5;

    /* Create points along the string */
    var points = [];
    for (var i = 0; i < POINTS_PER_STRING; i++) {
      var t = i / (POINTS_PER_STRING - 1);
      var px = t * w;
      /* Parabolic sag: deeper in middle, zero at ends */
      var py = stringY + sag * 4 * t * (1 - t);
      points.push({
        x: px,
        y: py,
        prevX: px,
        prevY: py,
        restX: px,
        restY: py,
        pinned: i === 0 || i === POINTS_PER_STRING - 1,
      });
    }

    /* Create SVG path element */
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.appendChild(path);

    /* Create bulb elements at even intervals */
    var bulbs = [];
    var bulbIndices = [];
    var bulbCount = Math.max(3, rowPolaroids.length + 2);
    for (var b = 0; b < bulbCount; b++) {
      var bt = (b + 1) / (bulbCount + 1);
      var pointIdx = Math.round(bt * (POINTS_PER_STRING - 1));
      bulbIndices.push(pointIdx);

      var bulb = document.createElement('div');
      bulb.className = 'string-bulb';
      bulbsContainer.appendChild(bulb);
      bulbs.push(bulb);
    }

    /* Map polaroids to exact fractional positions on the string */
    var polaroidTs = [];
    var count = rowPolaroids.length;
    for (var p = 0; p < count; p++) {
      polaroidTs.push((p + 1) / (count + 1));
    }

    stringData.push({
      row: row,
      svg: svg,
      path: path,
      points: points,
      bulbs: bulbs,
      bulbIndices: bulbIndices,
      rowPolaroids: rowPolaroids,
      polaroidTs: polaroidTs,
      segmentLength: w / (POINTS_PER_STRING - 1),
    });
  });


  /* --- Get polaroid frame width (reads CSS) --- */
  function getPolaroidWidth() {
    var testEl = document.querySelector('.work-polaroid-frame');
    return testEl ? testEl.offsetWidth : 200;
  }


  /* --- Interpolate Y position on string at fractional t --- */
  function getStringY(pts, t) {
    var floatIdx = t * (pts.length - 1);
    var lo = Math.floor(floatIdx);
    var hi = Math.min(lo + 1, pts.length - 1);
    var frac = floatIdx - lo;
    return pts[lo].y * (1 - frac) + pts[hi].y * frac;
  }

  function getStringX(pts, t) {
    var floatIdx = t * (pts.length - 1);
    var lo = Math.floor(floatIdx);
    var hi = Math.min(lo + 1, pts.length - 1);
    var frac = floatIdx - lo;
    return pts[lo].x * (1 - frac) + pts[hi].x * frac;
  }


  /* --- Position each polaroid so its clothespin sits on the string --- */
  function positionPolaroids(data) {
    var pts = data.points;
    var frameW = getPolaroidWidth();

    for (var p = 0; p < data.rowPolaroids.length; p++) {
      var t = data.polaroidTs[p];
      var sx = getStringX(pts, t);
      var sy = getStringY(pts, t);
      var polaroid = data.rowPolaroids[p];

      /* Center polaroid on string position, offset so clothespin sits on line */
      var left = sx - frameW / 2;
      var top = sy + 10;

      polaroid.style.left = left + 'px';
      polaroid.style.top = top + 'px';
    }
  }


  /* --- Render a smooth curve through points --- */
  function renderString(data) {
    var pts = data.points;
    if (pts.length < 2) return;

    var d = 'M ' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);

    /* Use quadratic bezier through midpoints for smooth curve */
    for (var i = 1; i < pts.length - 1; i++) {
      var midX = (pts[i].x + pts[i + 1].x) / 2;
      var midY = (pts[i].y + pts[i + 1].y) / 2;
      d += ' Q ' + pts[i].x.toFixed(1) + ' ' + pts[i].y.toFixed(1) +
           ' ' + midX.toFixed(1) + ' ' + midY.toFixed(1);
    }

    /* Final segment */
    var last = pts[pts.length - 1];
    d += ' L ' + last.x.toFixed(1) + ' ' + last.y.toFixed(1);

    data.path.setAttribute('d', d);
  }


  /* --- Update bulb and polaroid positions from string --- */
  function updateAttachments(data) {
    var pts = data.points;
    var frameW = getPolaroidWidth();

    /* Position bulbs */
    for (var b = 0; b < data.bulbs.length; b++) {
      var idx = data.bulbIndices[b];
      data.bulbs[b].style.left = pts[idx].x + 'px';
      data.bulbs[b].style.top = pts[idx].y + 'px';
    }

    /* Position polaroids — interpolated from string */
    for (var p = 0; p < data.rowPolaroids.length; p++) {
      var t = data.polaroidTs[p];
      var sx = getStringX(pts, t);
      var sy = getStringY(pts, t);
      var polaroid = data.rowPolaroids[p];

      var left = sx - frameW / 2;
      var top = sy + 10;

      polaroid.style.left = left + 'px';
      polaroid.style.top = top + 'px';
    }
  }


  /* --- Physics step (Verlet Integration) --- */
  function physicsStep(data) {
    var pts = data.points;

    for (var i = 0; i < pts.length; i++) {
      if (pts[i].pinned) continue;

      /* Velocity from Verlet: current - previous */
      var vx = (pts[i].x - pts[i].prevX) * DAMPING;
      var vy = (pts[i].y - pts[i].prevY) * DAMPING;

      /* Store previous position */
      pts[i].prevX = pts[i].x;
      pts[i].prevY = pts[i].y;

      /* Apply gravity */
      vy += GRAVITY;

      /* Mouse interaction */
      var rowRect = data.row.getBoundingClientRect();
      var worldX = pts[i].x + rowRect.left;
      var worldY = pts[i].y + rowRect.top;

      var dmx = worldX - mouseX;
      var dmy = worldY - mouseY;
      var dist = Math.sqrt(dmx * dmx + dmy * dmy);

      if (dist < MOUSE_RADIUS && dist > 0) {
        var force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
        vx += (dmx / dist) * force;
        vy += (dmy / dist) * force;
      }

      /* Spring back to rest position */
      vx += (pts[i].restX - pts[i].x) * SPRING_BACK;
      vy += (pts[i].restY - pts[i].y) * SPRING_BACK;

      /* Update position */
      pts[i].x += vx;
      pts[i].y += vy;
    }

    /* Distance constraints — keep points connected */
    for (var iter = 0; iter < CONSTRAINT_ITERATIONS; iter++) {
      for (var j = 0; j < pts.length - 1; j++) {
        var a = pts[j];
        var b = pts[j + 1];
        var ddx = b.x - a.x;
        var ddy = b.y - a.y;
        var d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d === 0) continue;

        var diff = (d - data.segmentLength) / d;
        var halfDiff = diff * 0.5;

        if (!a.pinned) {
          a.x += ddx * halfDiff;
          a.y += ddy * halfDiff;
        }
        if (!b.pinned) {
          b.x -= ddx * halfDiff;
          b.y -= ddy * halfDiff;
        }
      }
    }
  }


  /* --- Calculate row height based on string sag + polaroid size --- */
  function calcRowHeight() {
    var frameEl = document.querySelector('.work-polaroid-frame');
    var frameH = frameEl ? frameEl.offsetHeight : 240;
    /* string top (30) + max sag (~60) + clothespin offset (10) + frame height + padding */
    return 30 + 70 + 10 + frameH + 30;
  }

  function setRowHeights() {
    var h = calcRowHeight();
    rows.forEach(function (row) {
      row.style.minHeight = h + 'px';
    });
  }


  /* --- Recalculate string rest positions from current row width --- */
  function recalcStringPoints(data, idx) {
    var rect = data.row.getBoundingClientRect();
    var w = rect.width;
    var sag = 40 + idx * 5;

    for (var i = 0; i < data.points.length; i++) {
      var t = i / (POINTS_PER_STRING - 1);
      var px = t * w;
      var py = 30 + sag * 4 * t * (1 - t);
      data.points[i].x = px;
      data.points[i].y = py;
      data.points[i].prevX = px;
      data.points[i].prevY = py;
      data.points[i].restX = px;
      data.points[i].restY = py;
    }

    data.segmentLength = w / (POINTS_PER_STRING - 1);
  }


  /* --- Desktop init: absolute positioning from string anchors --- */
  function initDesktop() {
    setRowHeights();

    stringData.forEach(function (data, idx) {
      recalcStringPoints(data, idx);
      renderString(data);
      positionPolaroids(data);

      /* Position bulbs */
      for (var b = 0; b < data.bulbs.length; b++) {
        var bIdx = data.bulbIndices[b];
        data.bulbs[b].style.left = data.points[bIdx].x + 'px';
        data.bulbs[b].style.top = data.points[bIdx].y + 'px';
      }
    });
  }


  /* --- Mobile init: serpentine string weaving left → right → left --- */

  var serpentineContainer = null;
  var originalParents = [];  /* remember where each polaroid came from */

  function initMobile() {
    /* If already built, just show it */
    if (serpentineContainer) {
      serpentineContainer.style.display = 'block';
      return;
    }

    /* Collect ALL polaroids in order across all rows */
    var allPolaroids = [];
    stringData.forEach(function (data) {
      data.rowPolaroids.forEach(function (p) {
        originalParents.push({ el: p, parent: p.parentNode, next: p.nextSibling });
        allPolaroids.push(p);
      });
    });

    /* Build the serpentine container */
    serpentineContainer = document.createElement('div');
    serpentineContainer.className = 'serpentine-mobile';

    /* The continuous SVG for the string */
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'serpentine-svg');
    svg.setAttribute('preserveAspectRatio', 'none');
    serpentineContainer.appendChild(svg);

    var svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.appendChild(svgPath);

    /* Group polaroids into pairs of 2 */
    var segments = [];
    for (var i = 0; i < allPolaroids.length; i += 2) {
      var pair = [allPolaroids[i]];
      if (allPolaroids[i + 1]) pair.push(allPolaroids[i + 1]);
      segments.push(pair);
    }

    /* Create a segment div for each pair */
    segments.forEach(function (pair, idx) {
      var seg = document.createElement('div');
      seg.className = 'serpentine-segment';
      if (idx % 2 === 1) seg.style.flexDirection = 'row-reverse';
      pair.forEach(function (p) {
        p.style.position = 'relative';
        p.style.left = 'auto';
        p.style.top = 'auto';
        seg.appendChild(p);
      });
      serpentineContainer.appendChild(seg);
    });

    /* Insert into string-lights-section */
    var section = document.querySelector('.string-lights-section');
    section.appendChild(serpentineContainer);

    /* --- Draw the serpentine string path + place bulbs --- */
    drawSerpentine(svg, svgPath, serpentineContainer, segments);
  }

  /* --- Serpentine geometry data (shared between draw + wiggle) --- */
  var serpGeo = { segments: [], W: 0, H: 0, sag: 25, pad: 10 };
  var serpSvg = null;
  var serpPath = null;

  function drawSerpentine(svg, svgPath, container, segments) {
    serpSvg = svg;
    serpPath = svgPath;

    /* Wait a frame for layout to settle */
    requestAnimationFrame(function () {
      var containerRect = container.getBoundingClientRect();
      var cTop = containerRect.top + window.scrollY;
      var W = containerRect.width;
      var H = containerRect.height;

      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      svg.style.width = W + 'px';
      svg.style.height = H + 'px';

      /* Remove any old bulbs */
      container.querySelectorAll('.serpentine-bulb').forEach(function (b) { b.remove(); });

      serpGeo.W = W;
      serpGeo.H = H;
      serpGeo.segments = [];

      var pad = serpGeo.pad;
      var sag = serpGeo.sag;
      var bulbPositions = [];
      var loopBulge = 18; /* how far the U-turn curves beyond the edge */

      segments.forEach(function (pair, idx) {
        var seg = container.querySelectorAll('.serpentine-segment')[idx];
        var segRect = seg.getBoundingClientRect();
        var segTop = segRect.top + window.scrollY - cTop;
        var stringY = segTop + 30;

        var startX, endX;
        if (idx % 2 === 0) {
          startX = pad;
          endX = W - pad;
        } else {
          startX = W - pad;
          endX = pad;
        }

        serpGeo.segments.push({
          startX: startX, endX: endX,
          stringY: stringY, sagOffset: 0,
        });

        /* Bulb positions along the catenary */
        var midX = (startX + endX) / 2;
        var sagY = stringY + sag;
        [0.25, 0.5, 0.75].forEach(function (t) {
          var bx = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * sagY;
          bx = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
          var by = (1 - t) * (1 - t) * stringY + 2 * (1 - t) * t * sagY + t * t * stringY;
          bulbPositions.push({ x: bx, y: by });
        });
      });

      /* Build and set the path */
      rebuildSerpentinePath();

      /* Place bulbs */
      bulbPositions.forEach(function (pos) {
        var bulb = document.createElement('div');
        bulb.className = 'serpentine-bulb';
        bulb.style.left = pos.x + 'px';
        bulb.style.top = pos.y + 'px';
        container.appendChild(bulb);
      });

      /* --- Touch-based wiggle --- */
      initSerpentineWiggle(container);
    });
  }

  /* Build the SVG path from geometry (called on draw + during wiggle)
     Uses tangent-continuous cubic beziers so the string flows smoothly
     through every U-turn without visible kinks. */
  function rebuildSerpentinePath() {
    if (!serpPath || serpGeo.segments.length === 0) return;

    var segs = serpGeo.segments;
    var baseSag = serpGeo.sag;
    var d = '';

    for (var i = 0; i < segs.length; i++) {
      var s = segs[i];
      var sag = baseSag + (s.sagOffset || 0);
      var midX = (s.startX + s.endX) / 2;
      var sagY = s.stringY + sag;

      /* Catenary as cubic bezier (Q→C equivalent) for tangent control */
      var cat1x = s.startX + 2 / 3 * (midX - s.startX);
      var cat1y = s.stringY + 2 / 3 * (sagY - s.stringY);
      var cat2x = s.endX + 2 / 3 * (midX - s.endX);
      var cat2y = s.stringY + 2 / 3 * (sagY - s.stringY);

      if (i === 0) {
        d += 'M ' + s.startX + ' ' + s.stringY + ' ';
        d += 'C ' + cat1x + ' ' + cat1y + ' ' + cat2x + ' ' + cat2y + ' ' + s.endX + ' ' + s.stringY + ' ';
      } else {
        var prev = segs[i - 1];
        var prevSag = baseSag + (prev.sagOffset || 0);
        var prevMidX = (prev.startX + prev.endX) / 2;
        var prevSagY = prev.stringY + prevSag;

        /* Exit tangent of previous catenary: (prevMid,prevSag) → (prev.end,prev.stringY) */
        var exitDx = prev.endX - prevMidX;
        var exitDy = prev.stringY - prevSagY;
        var exitLen = Math.sqrt(exitDx * exitDx + exitDy * exitDy) || 1;

        /* Entry tangent of current catenary: (s.start,s.stringY) → (mid,sagY) */
        var entryDx = midX - s.startX;
        var entryDy = sagY - s.stringY;
        var entryLen = Math.sqrt(entryDx * entryDx + entryDy * entryDy) || 1;

        /* Handle length — controls how wide/gradual the U-turn loop is */
        var gap = s.stringY - prev.stringY;
        var handleLen = gap * 0.55;

        /* cp1: continue exit tangent of previous catenary */
        var cp1x = prev.endX + (exitDx / exitLen) * handleLen;
        var cp1y = prev.stringY + (exitDy / exitLen) * handleLen;

        /* cp2: approach from reverse of entry tangent of current catenary */
        var cp2x = s.startX - (entryDx / entryLen) * handleLen;
        var cp2y = s.stringY - (entryDy / entryLen) * handleLen;

        /* Tangent-continuous U-turn */
        d += 'C ' + cp1x + ' ' + cp1y + ' ' + cp2x + ' ' + cp2y + ' ' + s.startX + ' ' + s.stringY + ' ';

        /* Current catenary */
        d += 'C ' + cat1x + ' ' + cat1y + ' ' + cat2x + ' ' + cat2y + ' ' + s.endX + ' ' + s.stringY + ' ';
      }
    }

    serpPath.setAttribute('d', d);
  }

  /* --- Touch wiggle system --- */
  function initSerpentineWiggle(container) {
    var segEls = container.querySelectorAll('.serpentine-segment');
    var isWiggling = false;
    var lastTouchY = 0;
    var wiggleDecay = null;

    function applyWiggle(touchClientY, delta) {
      var containerRect = container.getBoundingClientRect();
      var touchY = touchClientY - containerRect.top; /* Y within the container */
      var radius = 300;  /* how far the wiggle reaches */
      var maxShift = 4;  /* max horizontal px shift for segments */
      var maxSag = 8;    /* max extra sag for the string */
      var dir = delta > 0 ? 1 : -1;
      var strength = Math.min(Math.abs(delta) / 12, 1);

      serpGeo.segments.forEach(function (seg, i) {
        /* Distance from touch to this segment's string Y (in container coords) */
        var segY = seg.stringY;
        var dist = Math.abs(touchY - segY);
        var falloff = Math.max(0, 1 - dist / radius);
        falloff = falloff * falloff; /* quadratic falloff for smoother blend */

        /* Sag displacement on the string path */
        seg.sagOffset = maxSag * falloff * strength * dir;

        /* Subtle transform on the segment div (shifts polaroids) */
        var shiftX = maxShift * falloff * strength * dir;
        var shiftY = maxSag * 0.3 * falloff * strength;
        var rotate = 0.4 * falloff * strength * dir;
        if (segEls[i]) {
          segEls[i].style.transform = 'translate(' + shiftX.toFixed(2) + 'px, ' + shiftY.toFixed(2) + 'px) rotate(' + rotate.toFixed(3) + 'deg)';
        }
      });

      rebuildSerpentinePath();
    }

    function resetWiggle() {
      /* Spring back to rest */
      var frames = 0;
      var maxFrames = 20;

      function decay() {
        frames++;
        var t = frames / maxFrames;
        var ease = 1 - Math.pow(1 - t, 3); /* ease-out cubic */

        serpGeo.segments.forEach(function (seg, i) {
          seg.sagOffset *= (1 - ease * 0.15);
          if (segEls[i]) {
            var curr = seg.sagOffset;
            var s = Math.abs(curr) < 0.1 ? 0 : curr;
            segEls[i].style.transform = s === 0 ? '' : 'translateY(' + (s * 0.3).toFixed(2) + 'px)';
          }
        });

        rebuildSerpentinePath();

        if (frames < maxFrames) {
          wiggleDecay = requestAnimationFrame(decay);
        } else {
          /* Fully reset */
          serpGeo.segments.forEach(function (seg, i) {
            seg.sagOffset = 0;
            if (segEls[i]) segEls[i].style.transform = '';
          });
          rebuildSerpentinePath();
          isWiggling = false;
        }
      }

      wiggleDecay = requestAnimationFrame(decay);
    }

    container.addEventListener('touchstart', function (e) {
      if (wiggleDecay) cancelAnimationFrame(wiggleDecay);
      lastTouchY = e.touches[0].clientY;
      isWiggling = true;
    }, { passive: true });

    container.addEventListener('touchmove', function (e) {
      var y = e.touches[0].clientY;
      var delta = y - lastTouchY;
      lastTouchY = y;
      applyWiggle(y, delta);
    }, { passive: true });

    container.addEventListener('touchend', function () {
      resetWiggle();
    }, { passive: true });
  }

  function destroyMobile() {
    if (!serpentineContainer) return;
    /* Move polaroids back to their original parents */
    originalParents.forEach(function (info) {
      if (info.next && info.next.parentNode === info.parent) {
        info.parent.insertBefore(info.el, info.next);
      } else {
        info.parent.appendChild(info.el);
      }
    });
    serpentineContainer.style.display = 'none';
  }


  /* --- Choose layout based on viewport width --- */
  var NARROW_BREAKPOINT = 768;

  function isNarrow() {
    return window.innerWidth < NARROW_BREAKPOINT;
  }

  /* --- Animation loop (desktop + wide viewport only) --- */
  if (!isMobile) {
    function animate() {
      if (isNarrow()) return; /* Pause physics on narrow windows */
      for (var s = 0; s < stringData.length; s++) {
        physicsStep(stringData[s]);
        renderString(stringData[s]);
        updateAttachments(stringData[s]);
      }
      requestAnimationFrame(animate);
    }

    /* Wait for layout, then init */
    requestAnimationFrame(function () {
      if (isNarrow()) {
        initMobile();
      } else {
        initDesktop();
        animate();
      }
    });

    /* Handle window resize — switch layout mode */
    var resizeTimeout;
    var wasNarrow = isNarrow();
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        var nowNarrow = isNarrow();
        if (nowNarrow) {
          destroyMobile(); /* return polaroids first if coming from desktop */
          initMobile();
        } else {
          destroyMobile();
          initDesktop();
          if (wasNarrow) animate(); /* Restart physics if switching to wide */
        }
        wasNarrow = nowNarrow;
      }, 200);
    });

  } else {
    /* True mobile device: flex grid, static decorative strings, no physics */
    requestAnimationFrame(function () {
      initMobile();
    });
  }

})();
