// Optional enhancements. Products, category links and disclosures work without JS.
(() => {
  const year = document.getElementById('y');
  if (year) year.textContent = new Date().getFullYear();

  const disclosures = Array.from(document.querySelectorAll('.catalog-allergens'));
  const allergenToggle = document.querySelector('.catalog-allergen-toggle');
  if (allergenToggle && disclosures.length) {
    allergenToggle.hidden = false;
    const updateAllergenToggle = () => {
      const allOpen = disclosures.every(disclosure => disclosure.open);
      allergenToggle.setAttribute('aria-pressed', String(allOpen));
      allergenToggle.textContent = allOpen ? 'Alle Allergene ausblenden' : 'Alle Allergene anzeigen';
    };
    allergenToggle.addEventListener('click', () => {
      const open = !disclosures.every(disclosure => disclosure.open);
      disclosures.forEach(disclosure => { disclosure.open = open; });
      updateAllergenToggle();
    });
    disclosures.forEach(disclosure => disclosure.addEventListener('toggle', updateAllergenToggle));
  }

  const nav = document.querySelector('.catalog-categories');
  const header = document.querySelector('.catalog-header');
  const links = Array.from(nav?.querySelectorAll('a[href^="#"]') || []);
  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  if (!links.length || sections.some(section => !section)) return;

  let scheduled = false;
  const updateCategory = () => {
    scheduled = false;
    const navIsHorizontal = window.getComputedStyle(nav).display === 'grid';
    const readingLine = (header?.getBoundingClientRect().bottom || 0) + (navIsHorizontal ? nav.offsetHeight : 0) + 32;
    let active = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= readingLine) active = index;
    });
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const scheduleUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateCategory);
  };
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('hashchange', scheduleUpdate);
  window.addEventListener('pageshow', scheduleUpdate);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(scheduleUpdate);
    sections.forEach(section => observer.observe(section));
  }
  document.fonts?.ready.then(scheduleUpdate);
  updateCategory();
})();
