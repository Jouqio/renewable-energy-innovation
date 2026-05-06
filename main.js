/* ================================
   MAIN.JS — Renewable Energy Website
   Syauqi Nuzul Abdi · STITEK Bontang
================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Read Progress Bar ───
  const readProgress = document.getElementById('readProgress');
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (readProgress) readProgress.style.width = pct + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });

  // ─── Navbar scroll behavior ───
  const navbar = document.getElementById('navbar');
  const handleNavbar = () => {
    if (navbar) {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  };
  window.addEventListener('scroll', handleNavbar, { passive: true });
  handleNavbar();

  // ─── Hamburger / Mobile Menu ───
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  const openMenu = () => {
    hamburger?.classList.add('active');
    mobileMenu?.classList.add('active');
    mobileOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    hamburger?.classList.remove('active');
    mobileMenu?.classList.remove('active');
    mobileOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', () => {
    if (mobileMenu?.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileOverlay?.addEventListener('click', closeMenu);

  // Close menu on mobile link click
  document.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ─── Scroll To Top ───
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    if (scrollTopBtn) {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── AOS Scroll Animations ───
  const aosElements = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.closest('.cards-grid, .dampak-grid, .progress-grid')
          ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100
          : 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        aosObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
  });

  aosElements.forEach(el => aosObserver.observe(el));

  // Fallback: paksa tampilkan semua elemen AOS yang belum muncul setelah 2.5 detik
  // (untuk browser HP yang IntersectionObserver-nya bermasalah)
  setTimeout(() => {
    document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(el => {
      el.classList.add('aos-animate');
    });
  }, 2500);

  // ─── Progress Bar Animations (count up) ───
  const progressCards = document.querySelectorAll('.progress-card');

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.progress-card__fill');
        const valueEl = entry.target.querySelector('.progress-card__value');

        if (fill) {
          const target = parseInt(fill.dataset.target) || 70;
          fill.style.width = target + '%';
        }

        if (valueEl) {
          const countTarget = parseInt(valueEl.dataset.count) || 0;
          const suffix = valueEl.dataset.suffix || '%';
          animateCount(valueEl, 0, countTarget, 1600, suffix);
        }

        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  progressCards.forEach(card => progressObserver.observe(card));

  function animateCount(el, from, to, duration, suffix) {
    const start = performance.now();
    const isLargeNum = to > 1000;

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      const current = Math.round(from + (to - from) * eased);

      if (suffix === '%') {
        el.textContent = current + '%';
      } else {
        el.textContent = current.toLocaleString('id-ID') + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  // ─── Split Earth Hover Interactivity ───
  const globe = document.querySelector('.split-earth__globe');
  if (globe) {
    globe.addEventListener('mousemove', (e) => {
      const rect = globe.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      globe.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
    });

    globe.addEventListener('mouseleave', () => {
      globe.style.transform = 'perspective(600px) rotateY(0) rotateX(0)';
      globe.style.transition = 'transform 0.5s ease';
    });

    globe.addEventListener('mouseenter', () => {
      globe.style.transition = 'transform 0.1s ease';
    });
  }

  // ─── Smooth scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 72; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── Active navbar link highlight ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.fontWeight = link.getAttribute('href') === '#' + entry.target.id ? '700' : '500';
          link.style.color = link.getAttribute('href') === '#' + entry.target.id ? 'var(--green-dark)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // ─── Card hover: subtle tilt ───
  document.querySelectorAll('.card, .dampak-item, .tech-node').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ─── Lightbox Poster ───
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const posterZoomBtn = document.getElementById('posterZoomBtn');
  const posterImg = document.getElementById('posterImg');

  const openLightbox = () => {
    lightbox?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  };

  posterZoomBtn?.addEventListener('click', openLightbox);
  posterImg?.addEventListener('click', openLightbox);
  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  console.log('🌿 Renewable Energy Website — Loaded. Syauqi Nuzul Abdi · STITEK Bontang');
});