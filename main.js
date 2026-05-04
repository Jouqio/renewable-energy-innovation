/* ========================================
   main.js – Inovasi Energi Terbarukan
   STITEK Bontang · Clean · Lightweight
   ======================================== */

(function () {
  'use strict';

  /* ---- NAVBAR ---- */
  const navbar   = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu  = document.getElementById('navMenu');

  // Scroll shadow
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- SMOOTH SCROLL (for older browsers) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- INTERSECTION OBSERVER — Fade-in cards ---- */
  const fadeEls = document.querySelectorAll(
    '.challenge-card, .solusi-card, .dampak-item'
  );

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(function (el) { fadeObserver.observe(el); });
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---- PROGRESS BARS + COUNTER ANIMATION ---- */
  const progressSection = document.getElementById('progress');
  let progressAnimated = false;

  function animateValue(el, start, end, duration) {
    const range  = end - start;
    const step   = Math.max(10, Math.floor(duration / range));
    let current  = start;
    const timer  = setInterval(function () {
      current += Math.ceil(range / (duration / step));
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      el.textContent = current.toLocaleString('id-ID');
    }, step);
  }

  function runProgressAnimations() {
    if (progressAnimated) return;
    progressAnimated = true;

    // Animate progress bars
    document.querySelectorAll('.progress-bar').forEach(function (bar) {
      const w = bar.dataset.width || 0;
      setTimeout(function () { bar.style.width = w + '%'; }, 200);
    });

    // Animate counters
    document.querySelectorAll('.stat-value').forEach(function (el) {
      const target = parseInt(el.dataset.target) || 0;
      animateValue(el, 0, target, 1800);
    });
  }

  if ('IntersectionObserver' in window && progressSection) {
    const progObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        runProgressAnimations();
        progObserver.disconnect();
      }
    }, { threshold: 0.2 });
    progObserver.observe(progressSection);
  } else {
    // Fallback on scroll
    window.addEventListener('scroll', function handler() {
      if (progressSection) {
        const rect = progressSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          runProgressAnimations();
          window.removeEventListener('scroll', handler);
        }
      }
    }, { passive: true });
  }

  /* ---- ACTIVE NAV LINK HIGHLIGHT on scroll ---- */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-menu a[href^="#"]');

  function setActiveLink() {
    const scrollY = window.scrollY;
    const navH = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 72;

    let currentId = '';
    sections.forEach(function (section) {
      const top = section.offsetTop - navH - 20;
      if (scrollY >= top) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.style.fontWeight = link.getAttribute('href') === '#' + currentId ? '900' : '';
      link.style.color = link.getAttribute('href') === '#' + currentId
        ? 'var(--green-dark)' : '';
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ---- EARTH EMOJI: pause rotation on hover ---- */
  const earthEmoji = document.querySelector('.earth-emoji');
  if (earthEmoji) {
    earthEmoji.addEventListener('mouseenter', function () {
      earthEmoji.style.animationPlayState = 'paused';
    });
    earthEmoji.addEventListener('mouseleave', function () {
      earthEmoji.style.animationPlayState = 'running';
    });
  }

  /* ---- INIT ---- */
  setActiveLink();

})();