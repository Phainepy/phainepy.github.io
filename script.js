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

document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.querySelector(".contact-trigger");
  const form = document.querySelector(".contact-form");
  let expanded = false;

  // Expand on hover
  trigger.addEventListener("mouseenter", () => {
    if (!expanded) {
      form.style.display = "flex";
      expanded = true;
    }
  });

  const textarea = document.getElementById("body");

// auto-resize textarea on input
  textarea.addEventListener("input", () => {
  textarea.style.height = "auto";  // reset
  textarea.style.height = textarea.scrollHeight + "px"; // grow to fit
  });

  // Handle form submit
  document.getElementById("contact-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const subject = document.getElementById("subject").value.trim();
    const body = document.getElementById("body").value.trim();

    if (subject && body) {
      window.location.href =
        `mailto:photoshoot@liltraumatized.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      alert("Please fill out both fields before sending.");
    }
  });
});


