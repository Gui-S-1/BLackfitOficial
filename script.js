/* ============================================================
   BLACKFIT — Comportamentos globais
   - Loop reverse infinito dos vídeos (mobile + desktop)
   - Reveal animations (IntersectionObserver)
   - Parallax suave on-scroll
   - Text Morph (troca de palavras animada)
   - Navbar shrink + Drawer mobile
   ============================================================ */

(() => {
  /* =================== SVG Sprite ===================
     Injeta um sprite invisível com todos os ícones usados
     no site. Uso: <svg class="ic"><use href="#i-NOME"/></svg>
  */
  const SPRITE = `
<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">
  <defs>
    <symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12a11.9 11.9 0 0 0 1.64 6.06L0 24l6.13-1.6A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52ZM12 22a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.64.95.97-3.55-.23-.37A9.9 9.9 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10Zm5.45-7.46c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.18-.24-.58-.49-.5-.66-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.11 3.22 5.12 4.52.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.18-1.42-.07-.13-.27-.2-.57-.35Z"/></symbol>
    <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.5-9.5-9C1.2 9.4 2.7 6 6 6c2 0 3.4 1 4 2.5C10.6 7 12 6 14 6c3.3 0 4.8 3.4 3.5 6-2 4.5-9.5 9-9.5 9Z" fill="currentColor" stroke="none"/></symbol>
    <symbol id="i-map-pin" viewBox="0 0 24 24"><path d="M12 22s7-7.4 7-13a7 7 0 0 0-14 0c0 5.6 7 13 7 13Z"/><circle cx="12" cy="9" r="2.5"/></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
    <symbol id="i-instagram" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></symbol>
    <symbol id="i-map" viewBox="0 0 24 24"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></symbol>
    <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
    <symbol id="i-dumbbell" viewBox="0 0 24 24"><path d="M2 12h2m16 0h2M4 8v8m4-10v12m8-12v12m4-10v8M8 12h8"/></symbol>
    <symbol id="i-bolt" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill="currentColor" stroke="none"/></symbol>
    <symbol id="i-dna" viewBox="0 0 24 24"><path d="M4 3c0 6 16 12 16 18M20 3c0 6-16 12-16 18M6 7h12M6 17h12M9 5h6M9 19h6"/></symbol>
    <symbol id="i-flame" viewBox="0 0 24 24"><path d="M12 2s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4-2 5 3 6 3 6s-3-2 0-6c1 1 3 2 3 4 0 0 2-2-3-9Z" fill="currentColor" stroke="none"/></symbol>
    <symbol id="i-cup" viewBox="0 0 24 24"><path d="M6 4h12l-1 16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 4Z"/><path d="M7 9h10"/></symbol>
    <symbol id="i-pill" viewBox="0 0 24 24"><rect x="2" y="9" width="20" height="6" rx="3" transform="rotate(-45 12 12)"/><path d="m8.5 8.5 7 7"/></symbol>
    <symbol id="i-cookie" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10 6 6 0 0 1-6-6 4 4 0 0 1-4-4Z"/><circle cx="9" cy="13" r="1" fill="currentColor"/><circle cx="14" cy="16" r="1" fill="currentColor"/><circle cx="15" cy="11" r="1" fill="currentColor"/></symbol>
    <symbol id="i-tool" viewBox="0 0 24 24"><path d="M14 7a4 4 0 0 1 5.5 5L21 14l-2 2-2-1.5A4 4 0 0 1 12 9l-7 7 3 3 7-7"/></symbol>
    <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 2 4 5v7c0 5 3.5 9 8 10 4.5-1 8-5 8-10V5l-8-3Z"/></symbol>
    <symbol id="i-handshake" viewBox="0 0 24 24"><path d="M2 13l4-4 4 2 2-2 4 2 6 2-2 4-3-1-2 2-3-1-2 2-4-2-4-4Z"/></symbol>
    <symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 3v6m0 6v6m9-9h-6m-6 0H3m13.5-6.5-4 4m-3 3-4 4m11 0-4-4m-3-3-4-4"/></symbol>
    <symbol id="i-flower" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4Zm0 12a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4ZM2 12a4 4 0 0 1 4-4 4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4Zm12 0a4 4 0 0 1 4-4 4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4Z"/></symbol>
    <symbol id="i-ribbon" viewBox="0 0 24 24"><path d="M12 2c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5Zm-3 9-4 11 4-2 3 2 3-2 4 2-4-11"/></symbol>
    <symbol id="i-leaf" viewBox="0 0 24 24"><path d="M5 21c8 0 14-6 14-14V3h-4C7 3 1 9 1 17v4h4Z"/></symbol>
    <symbol id="i-scale" viewBox="0 0 24 24"><path d="M12 3v18M5 7h14M5 7l-3 7a4 4 0 0 0 8 0L7 7m12 0-3 7a4 4 0 0 0 8 0l-3-7"/></symbol>
    <symbol id="i-star" viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4.5L18 22l-6-4-6 4 1.5-8.5L2 9h7l3-7Z" fill="currentColor" stroke="none"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 5 5L20 7"/></symbol>
    <symbol id="i-crown" viewBox="0 0 24 24"><path d="M3 7l4 4 5-7 5 7 4-4-2 12H5L3 7Z"/></symbol>
  </defs>
</svg>`;
  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('afterbegin', SPRITE);
  });

  /* =================== Mobile Drawer =================== */
  window.toggleMenu = () => {
    document.getElementById('drawer')?.classList.toggle('open');
  };

  /* =================== Navbar shrink =================== */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('shrink', window.scrollY > 60);
    parallaxUpdate();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* =================== Reveal on scroll =================== */
  const ioReveal = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        ioReveal.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => ioReveal.observe(el));

  /* =================== Parallax =================== */
  const pxItems = [...document.querySelectorAll('[data-parallax]')];
  function parallaxUpdate() {
    const vh = window.innerHeight;
    pxItems.forEach(el => {
      const r = el.getBoundingClientRect();
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const offset = (r.top + r.height / 2 - vh / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  }
  parallaxUpdate();

  /* =================== Text Morph =================== */
  document.querySelectorAll('[data-morph]').forEach(el => {
    const words = (el.dataset.morph || '').split('|').map(s => s.trim()).filter(Boolean);
    if (!words.length) return;
    let i = 0;
    el.textContent = words[0];
    el.style.transition = 'opacity .45s ease, transform .45s ease';
    setInterval(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 450);
    }, 2600);
  });

  /* =================== Vídeo loop simples (mobile-friendly) =================== */
  function setupVideo(video) {
    if (!video) return;
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('loop', '');
    video.loop = true;

    const tryPlay = () => video.play().catch(() => {});
    tryPlay();

    const userPlay = () => { tryPlay(); document.removeEventListener('touchstart', userPlay); };
    document.addEventListener('touchstart', userPlay, { passive: true });

    const ioVid = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) tryPlay();
        else video.pause();
      });
    }, { threshold: 0.15 });
    ioVid.observe(video);
  }

  document.querySelectorAll('video.bg-loop, video.reverse-loop').forEach(setupVideo);

  /* =================== Counters (data-count) =================== */
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const animateCount = el => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseFloat(el.dataset.count) || 0;
    const dur = parseInt(el.dataset.dur || '2200', 10);
    const start = performance.now();
    const fmt = n => Math.floor(n).toLocaleString('pt-BR');
    const tick = now => {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = fmt(target * easeOut(p));
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target);
    };
    requestAnimationFrame(tick);
  };
  const ioCount = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) animateCount(e.target); });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(el => ioCount.observe(el));

  // Re-anima contadores se o supabase atualizar o data-count depois
  window.addEventListener('bfBlocksApplied', () => {
    document.querySelectorAll('[data-count]').forEach(el => {
      el.dataset.done = '';
      el.textContent = '0';
      ioCount.observe(el);
    });
  });

  /* =================== Navbar active link =================== */
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav .links a, .drawer a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === here) a.classList.add('active');
  });
})();
