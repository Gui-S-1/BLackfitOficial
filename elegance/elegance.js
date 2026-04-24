/* Elegance — interações leves */
(function () {
  // Drawer mobile
  const drawer = document.getElementById('drawer');
  const ham = document.getElementById('ham');
  const closeBtn = document.getElementById('close-drawer');
  if (ham) ham.addEventListener('click', () => drawer?.classList.add('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => drawer?.classList.remove('open'));
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Smooth-scroll para âncoras
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const t = document.querySelector(id);
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }
    });
  });
})();
