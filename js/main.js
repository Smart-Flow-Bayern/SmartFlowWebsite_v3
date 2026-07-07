/* SmartFlow v3 — Main JavaScript */

/* Theme: apply saved preference before paint to avoid flash */
(function() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initSmoothScroll();
  initActiveNavHighlight();
  initHeaderHideShow();
  initScrollAnimations();
  initStickyCta();
  initFlowLine();
  initCountUp();
});

/* =====================================================
   Mobile Menu
   ===================================================== */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (!hamburger || !mobileMenu) return;

  const mobileLinks = mobileMenu.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

/* =====================================================
   Smooth Scroll
   ===================================================== */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const header = document.querySelector('.header');
      const headerHeight = header ? header.offsetHeight : 0;

      window.scrollTo({
        top: target.offsetTop - headerHeight,
        behavior: 'smooth'
      });
    });
  });
}

/* =====================================================
   Active Navigation Highlight
   ===================================================== */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -80% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}

/* =====================================================
   Header Hide / Show on Scroll
   ===================================================== */
function initHeaderHideShow() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100 && currentScrollY > lastScrollY) {
          header.classList.add('header--hidden');
        } else {
          header.classList.remove('header--hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* =====================================================
   Scroll Animations
   ===================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* =====================================================
   Theme Toggle
   ===================================================== */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    if (next === 'light') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    } else {
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    }
  });
}

/* =====================================================
   Sticky CTA Visibility
   ===================================================== */
function initStickyCta() {
  const cta = document.getElementById('sticky-cta');
  const hero = document.getElementById('hero');
  const contact = document.getElementById('contact');
  if (!cta || !hero || !contact) return;

  let pastHero = false;
  let inContact = false;

  const update = () => {
    const shouldShow = pastHero && !inContact;
    cta.classList.toggle('visible', shouldShow);
  };

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { pastHero = !entry.isIntersecting; });
    update();
  }, { threshold: 0 });

  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { inContact = entry.isIntersecting; });
    update();
  }, { threshold: 0.1 });

  heroObserver.observe(hero);
  contactObserver.observe(contact);
}

/* =====================================================
   Flow-Line Signature Animation
   ===================================================== */
function initFlowLine() {
  const svg = document.querySelector('.flow-svg');
  if (!svg) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    svg.classList.add('flow-static');
    return;
  }
  requestAnimationFrame(() => svg.classList.add('flow-animate'));
}

/* =====================================================
   Count-up for Result Metrics
   ===================================================== */
function initCountUp() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      obs.unobserve(el);
      if (reduce) { el.textContent = String(target); return; }
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  nums.forEach((n) => obs.observe(n));
}
