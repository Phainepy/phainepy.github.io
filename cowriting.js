(function () {
  var wisps = document.querySelectorAll('.wisp');
  if (!wisps.length) return;

  var hasHover = window.matchMedia('(hover: hover)').matches;
  var FLEE_RADIUS = 130;
  var FLEE_STRENGTH = 70;
  var mouseX = -9999;
  var mouseY = -9999;
  var scrollY = window.scrollY;
  var startTime = performance.now();

  var state = [];
  for (var i = 0; i < wisps.length; i++) {
    state.push({ fleeX: 0, fleeY: 0, phase: i * 1.3 });
  }

  if (hasHover) {
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
  }

  window.addEventListener('scroll', function () {
    scrollY = window.scrollY;
  }, { passive: true });

  function tick() {
    var t = (performance.now() - startTime) / 1000;

    for (var i = 0; i < wisps.length; i++) {
      var w = wisps[i];
      var s = state[i];

      var bobX = Math.sin(t * 0.5 + s.phase) * 6;
      var bobY = Math.cos(t * 0.7 + s.phase * 0.6) * 4;

      if (hasHover) {
        var rect = w.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = cx - mouseX;
        var dy = cy - mouseY;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < FLEE_RADIUS && dist > 0) {
          var force = (1 - dist / FLEE_RADIUS) * FLEE_STRENGTH;
          s.fleeX += ((dx / dist) * force - s.fleeX) * 0.08;
          s.fleeY += ((dy / dist) * force - s.fleeY) * 0.08;
        } else {
          s.fleeX *= 0.96;
          s.fleeY *= 0.96;
        }

        w.style.transform = 'translate(' + (bobX + s.fleeX) + 'px, ' + (bobY + s.fleeY) + 'px)';
      } else {
        var sway = Math.sin(scrollY * 0.008 + s.phase) * 12;
        w.style.transform = 'translate(' + (bobX + sway) + 'px, ' + bobY + 'px)';
      }
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
