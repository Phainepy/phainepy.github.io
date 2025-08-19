// Simple lightbox with keyboard + click nav
(function () {
  const lightbox = document.getElementById('lightbox');
  const imgEl = document.getElementById('lightbox-image');
  const captionEl = document.getElementById('lightbox-caption');
  const btnClose = lightbox.querySelector('.lb-close');
  const btnPrev = lightbox.querySelector('.lb-prev');
  const btnNext = lightbox.querySelector('.lb-next');

  // Collect all images (across categories) in DOM order
  const images = Array.from(document.querySelectorAll('.gallery img'));
  let currentIndex = -1;

  function openAt(index) {
    if (index < 0 || index >= images.length) return;
    currentIndex = index;

    const clicked = images[index];
    const src = clicked.getAttribute('data-full') || clicked.src;
    const alt = clicked.getAttribute('alt') || '';

    imgEl.src = src;
    imgEl.alt = alt;
    captionEl.textContent = alt;

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    imgEl.src = '';
    imgEl.alt = '';
    captionEl.textContent = '';
    document.body.style.overflow = '';
  }

  function next() { openAt((currentIndex + 1) % images.length); }
  function prev() { openAt((currentIndex - 1 + images.length) % images.length); }

  // Click to open
  images.forEach((img, idx) => {
    img.addEventListener('click', () => openAt(idx));
  });

  // Controls
  btnClose.addEventListener('click', close);
  btnNext.addEventListener('click', (e) => { e.stopPropagation(); next(); });
  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); });

  // Close when clicking backdrop (but not the image or buttons)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Keyboard accessibility
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    switch (e.key) {
      case 'Escape': close(); break;
      case 'ArrowRight': next(); break;
      case 'ArrowLeft': prev(); break;
    }
  });
})();
