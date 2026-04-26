/* ===========================
   main.js — Inovasi Energi Terbarukan
   =========================== */

// ─── PARTICLES (Hero) ───────────────────────────────────────────────────────
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const COUNT = 60;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = Math.random() * 12 + 8;
    const delay = Math.random() * 8;
    const isGreen = Math.random() > 0.6;

    Object.assign(p.style, {
      position: 'absolute',
      width: size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      left: x + '%',
      top: y + '%',
      background: isGreen ? 'rgba(57,255,20,0.7)' : 'rgba(0,229,255,0.7)',
      boxShadow: isGreen
        ? '0 0 8px rgba(57,255,20,0.8)'
        : '0 0 8px rgba(0,229,255,0.8)',
      animation: `particleFloat ${dur}s ${delay}s ease-in-out infinite`,
      opacity: 0,
    });
    container.appendChild(p);
  }

  // inject keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0%   { opacity:0; transform: translateY(0) scale(1); }
      20%  { opacity:1; }
      80%  { opacity:0.6; }
      100% { opacity:0; transform: translateY(-120px) scale(0.5); }
    }
  `;
  document.head.appendChild(style);
})();


// ─── INTERSECTION OBSERVER — Reveal animations ───────────────────────────────
(function initReveal() {
  const options = { threshold: 0.12 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.dataset.delay || 0;
      el.style.transitionDelay = delay + 'ms';
      el.classList.add('visible');

      // Trigger bar fills
      el.querySelectorAll('.bar-fill').forEach(bar => bar.classList.add('animated'));

      observer.unobserve(el);
    });
  }, options);

  // Cards & items
  document.querySelectorAll(
    '.crisis-card, .tech-card, .impact-item'
  ).forEach(el => {
    el.style.setProperty('--delay', el.dataset.delay || 0);
    observer.observe(el);
  });

  // Bars (standalone)
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach(b => b.classList.add('animated'));
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.crisis-visual').forEach(el => barObserver.observe(el));

  // Fact counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.fact-card__number').forEach(el => counterObserver.observe(el));
})();


// ─── COUNTER ANIMATION ───────────────────────────────────────────────────────
function animateCounter(el, target) {
  const duration = 2000;
  const start = performance.now();
  const startVal = 0;

  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutQuart(progress) * target);
    el.textContent = value.toLocaleString('id-ID');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}


// ─── ENERGY TABS ─────────────────────────────────────────────────────────────
(function initTabs() {
  const btns = document.querySelectorAll('.etab-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.energy-tab-content').forEach(c => {
        c.classList.add('hidden');
      });
      const target = document.getElementById('tab-' + tab);
      if (target) target.classList.remove('hidden');
    });
  });
})();


// ─── SIDENAV — Active Section Tracking ───────────────────────────────────────
(function initSidenav() {
  const dots = document.querySelectorAll('.sidenav__dot');
  const sections = [];
  dots.forEach(dot => {
    const href = dot.getAttribute('href');
    const el = document.querySelector(href);
    if (el) sections.push({ dot, el });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const match = sections.find(s => s.el === entry.target);
      if (match) {
        if (entry.isIntersecting) {
          dots.forEach(d => d.classList.remove('active'));
          match.dot.classList.add('active');
        }
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s.el));
})();


// ─── SCROLL TO TOP BUTTON ────────────────────────────────────────────────────
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


// ─── CTA BACKGROUND ANIMATED STARS ──────────────────────────────────────────
(function initCtaBg() {
  const container = document.getElementById('cta-bg');
  if (!container) return;
  const COUNT = 80;
  for (let i = 0; i < COUNT; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 2 + 0.5;
    Object.assign(star.style, {
      position: 'absolute',
      width: size + 'px', height: size + 'px',
      borderRadius: '50%',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      background: '#fff',
      opacity: Math.random() * 0.5 + 0.1,
      animation: `starTwinkle ${Math.random() * 4 + 2}s ${Math.random() * 4}s ease-in-out infinite`,
    });
    container.appendChild(star);
  }
  const s = document.createElement('style');
  s.textContent = `
    @keyframes starTwinkle {
      0%,100%{opacity:0.1;transform:scale(1)}
      50%{opacity:0.8;transform:scale(1.5)}
    }
  `;
  document.head.appendChild(s);
})();


// ─── SMOOTH HEADER HIDE ON SCROLL ────────────────────────────────────────────
(function initHeroFade() {
  const hero = document.querySelector('.hero__content');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const vh = window.innerHeight;
    const progress = Math.min(scrolled / (vh * 0.6), 1);
    hero.style.opacity = 1 - progress * 0.8;
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
  }, { passive: true });
})();


// ─── TILT EFFECT on tech cards ───────────────────────────────────────────────
(function initTilt() {
  document.querySelectorAll('.tech-card, .fact-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(600px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();