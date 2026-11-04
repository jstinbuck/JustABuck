// Hauptnavigation aller Seiten: Mobilmenü und Catering-Untermenü
(function () {
  const nav = document.getElementById('primary-nav');
  if (!nav) return;

  const toggle = document.querySelector('.nav-toggle');
  const groups = nav.querySelectorAll('.nav-group');

  const setMenu = (open) => {
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    const icon = toggle?.querySelector('span');
    if (icon) icon.textContent = open ? '✕' : '☰';
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
  };

  const setGroup = (group, open) => {
    group.classList.toggle('is-open', open);
    group.querySelector('.nav-group-toggle')?.setAttribute('aria-expanded', String(open));
  };
  const closeGroups = (except) => groups.forEach(g => { if (g !== except) setGroup(g, false); });

  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));

  // Auch der mobile Anfragebutton außerhalb des Menüs löst die Scrollsperre.
  document.querySelectorAll('#primary-nav a, .navbar--mobile-inquiry .contact-btn').forEach(a => {
    a.addEventListener('click', () => {
      setMenu(false);
      closeGroups();
    });
  });

  // Untermenü: Klick und Tastatur; am Desktop öffnet es zusätzlich per CSS beim Überfahren.
  groups.forEach(group => {
    const button = group.querySelector('.nav-group-toggle');
    button?.addEventListener('click', () => {
      closeGroups(group);
      setGroup(group, !group.classList.contains('is-open'));
    });
    group.addEventListener('focusout', (e) => {
      if (!group.contains(e.relatedTarget)) setGroup(group, false);
    });
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeGroups();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const openGroup = nav.querySelector('.nav-group.is-open');
    if (openGroup) {
      setGroup(openGroup, false);
      openGroup.querySelector('.nav-group-toggle')?.focus();
    } else if (nav.classList.contains('is-open')) {
      setMenu(false);
      toggle?.focus();
    }
  });
})();
