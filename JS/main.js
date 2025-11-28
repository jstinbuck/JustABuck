// Small site interactions moved from inline script in `index.html`
(function () {
  // Jahr automatisch
  const yEl = document.getElementById('y');
  if (yEl) yEl.textContent = new Date().getFullYear();

  // Announcement-Bar schließen + merken
  const KEY = 'jab_banner_dismissed_v1';
  const bar = document.querySelector('.announce');
  const btn = document.querySelector('.announce-close');
  const setOffset = () => {
    const h = (bar && bar.style.display !== 'none') ? bar.offsetHeight : 0;
    document.documentElement.style.setProperty('--announce-offset', `${h}px`);
  };
  if (bar) {
    if (localStorage.getItem(KEY) === '1') {
      bar.style.display = 'none';
      setOffset();
    } else {
      btn?.addEventListener('click', () => {
        bar.classList.add('is-hiding');
        setTimeout(() => { bar.style.display = 'none'; }, 260);
        localStorage.setItem(KEY, '1');
        setTimeout(setOffset, 280);
      });
    }
  }
  setOffset();

  // Mobile-Menü (Burger)
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('is-open');
    document.body.classList.toggle('nav-open', !open);
  });

  // Menü schließen nach Klick
  nav?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    });
  });

  // Slider mit Pfeilen (Startseite)
  document.querySelectorAll('.product-slider').forEach(slider => {
    const row = slider.querySelector('.product-row');
    const prev = slider.querySelector('.product-arrow.prev');
    const next = slider.querySelector('.product-arrow.next');
    if (!row) return;
    const cards = Array.from(row.querySelectorAll('.product-box'));
    if (!cards.length) return;
    let current = Math.floor(cards.length / 2);
    const specialIdx = cards.findIndex(card => card.classList.contains('special'));
    const favIdx = cards.findIndex(card => card.querySelector('.pill-veg'));
    if (specialIdx >= 0) current = specialIdx;
    else if (favIdx >= 0) current = favIdx;

    const goTo = (idx, behavior = 'smooth') => {
      const clamped = Math.max(0, Math.min(cards.length - 1, idx));
      const card = cards[clamped];
      const left = card.offsetLeft - (row.clientWidth - card.offsetWidth) / 2;
      row.scrollTo({ left: Math.max(left, 0), behavior });
      current = clamped;
    };

    prev?.addEventListener('click', () => goTo(current - 1));
    next?.addEventListener('click', () => goTo(current + 1));

    goTo(current, 'auto');

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => goTo(current, 'auto'), 80);
    });
  });
})();
