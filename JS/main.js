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

  // =========================
  // OPTISCHE UPGRADES
  // =========================

  // Scroll Progress Bar
  const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  };

  // Scroll Animations (Fade In)
  const initScrollAnimations = () => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    // Elements to animate
    const selectors = [
      '.product-box',
      '.menu-card',
      '.social-card',
      '.review-card',
      '.duo-card',
      '.mission-text',
      '.image-column img',
      '.location-content-full',
      '.careers-card',
      '.feedback-container'
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
      });
    });
  };

  // Back to Top Button
  const createBackToTop = () => {
    let backToTop = document.querySelector('.back-to-top');

    // Create if doesn't exist
    if (!backToTop) {
      backToTop = document.createElement('button');
      backToTop.className = 'back-to-top';
      backToTop.setAttribute('aria-label', 'Zurück nach oben');
      backToTop.innerHTML = '↑';
      document.body.appendChild(backToTop);
    }

    // Show/Hide on scroll
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };

    // Scroll to top on click
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
  };

  // Scroll Indicator (Hero)
  const createScrollIndicator = () => {
    const hero = document.querySelector('.hero-video');
    if (!hero) return;

    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    hero.appendChild(indicator);

    // Hide after scroll
    const hideIndicator = () => {
      if (window.scrollY > 100) {
        indicator.style.opacity = '0';
      } else {
        indicator.style.opacity = '1';
      }
    };

    window.addEventListener('scroll', hideIndicator, { passive: true });
  };

  // Parallax Effect for Catering Section
  const initParallax = () => {
    const cateringSection = document.querySelector('.catering-section');
    if (!cateringSection) return;

    const parallaxScroll = () => {
      const scrolled = window.scrollY;
      const rect = cateringSection.getBoundingClientRect();
      const offset = rect.top + scrolled;
      const diff = scrolled - offset + window.innerHeight;

      if (diff > 0 && rect.top < window.innerHeight) {
        const yPos = -(diff * 0.3);
        cateringSection.style.backgroundPosition = `center ${yPos}px`;
      }
    };

    window.addEventListener('scroll', parallaxScroll, { passive: true });
  };

  // Enhanced Button Ripple Effect
  const initButtonRipple = () => {
    const buttons = document.querySelectorAll('.btn-primary, .order-btn, .contact-btn');

    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          transform: translate(-50%, -50%);
          pointer-events: none;
        `;

        this.appendChild(ripple);

        // Animate
        ripple.animate([
          { width: '0px', height: '0px', opacity: 1 },
          { width: '300px', height: '300px', opacity: 0 }
        ], {
          duration: 600,
          easing: 'ease-out'
        }).onfinish = () => ripple.remove();
      });
    });
  };

  // Active Nav Link on Scroll (for index.html)
  const initActiveNav = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    const updateActiveLink = () => {
      const scrollY = window.scrollY + 200;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
  };

  // Web3Forms Feedback Submission
  const initFeedbackForm = () => {
    const form = document.getElementById('feedbackForm');
    if (!form) return;

    const statusEl = document.getElementById('feedbackStatus');
    const submitBtn = document.getElementById('feedbackSubmit');

    const setStatus = (message, isError = false) => {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.classList.toggle('is-error', isError);
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      setStatus('');

      const feedbackText = form.querySelector('[name="Feedback"]');
      if (!feedbackText || !feedbackText.value.trim()) {
        setStatus('Bitte schreib dein Feedback ins Textfeld.', true);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Wird gesendet...';

      try {
        const formData = new FormData(form);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          form.reset();
          setStatus('Danke! Dein Feedback wurde anonym gesendet.');
        } else {
          setStatus('Senden fehlgeschlagen. Bitte versuche es erneut.', true);
        }
      } catch (_error) {
        setStatus('Verbindungsfehler. Bitte pruefe deine Internetverbindung.', true);
      }

      submitBtn.disabled = false;
      submitBtn.textContent = 'Anonym absenden';
    });
  };

  // Performance: Use RequestAnimationFrame for smooth animations
  let ticking = false;
  const rafCallbacks = [];

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        rafCallbacks.forEach(cb => cb());
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // Highlight Product Popup
  const initHighlightPopup = () => {
    const popup = document.getElementById('highlightPopup');
    if (!popup) return;

    const POPUP_KEY = 'jab_highlight_popup_seen';
    if (sessionStorage.getItem(POPUP_KEY) === '1') return;

    const closeBtn = popup.querySelector('.highlight-popup-close');
    const backdrop = popup.querySelector('.highlight-popup-backdrop');
    const ctaBtn = document.getElementById('popupNewsletterBtn');

    const closePopup = () => {
      popup.classList.remove('is-active');
      sessionStorage.setItem(POPUP_KEY, '1');
    };

    closeBtn?.addEventListener('click', closePopup);
    backdrop?.addEventListener('click', closePopup);

    ctaBtn?.addEventListener('click', () => {
      closePopup();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('is-active')) {
        closePopup();
      }
    });

    setTimeout(() => {
      popup.classList.add('is-active');
    }, 1500);
  };

  // Initialize all enhancements
  const init = () => {
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isRefinedHome = document.body.classList.contains('home-refined');

    if (!isRefinedHome) {
      createScrollProgress();
      createScrollIndicator();
      initButtonRipple();
    }
    createBackToTop();
    initActiveNav();
    initFeedbackForm();
    initHighlightPopup();

    if (!prefersReducedMotion) {
      initScrollAnimations();
      if (!isRefinedHome) {
        initParallax();
      }
    }

    // Add loaded class for fade-in effect
    document.documentElement.classList.add('loaded');
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
