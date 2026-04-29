/* ===========================
   main.js — Enhanced Edition
   Inovasi Energi Terbarukan
   =========================== */

// ─── PARTICLES (Hero) ───────────────────────────────────────────────────────
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const COUNT = 70;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 0.8;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = Math.random() * 14 + 8;
    const delay = Math.random() * 10;
    const type = Math.random();
    const isGreen = type > 0.6;
    const isGold = type < 0.15;

    const color = isGold ? 'rgba(245,196,0,0.8)' : isGreen ? 'rgba(57,255,20,0.7)' : 'rgba(0,229,255,0.7)';
    const glow  = isGold ? '0 0 8px rgba(245,196,0,0.9)' : isGreen ? '0 0 8px rgba(57,255,20,0.8)' : '0 0 8px rgba(0,229,255,0.8)';

    Object.assign(p.style, {
      position: 'absolute', width: size + 'px', height: size + 'px',
      borderRadius: size > 2.5 ? '2px' : '50%',
      left: x + '%', top: y + '%',
      background: color, boxShadow: glow,
      animation: `particleFloat ${dur}s ${delay}s ease-in-out infinite`,
      opacity: 0,
    });
    container.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0%   { opacity:0; transform: translateY(0) scale(1) rotate(0deg); }
      20%  { opacity:1; }
      80%  { opacity:0.5; }
      100% { opacity:0; transform: translateY(-140px) scale(0.4) rotate(180deg); }
    }
  `;
  document.head.appendChild(style);
})();


// ─── READ PROGRESS BAR ──────────────────────────────────────────────────────
(function initReadProgress() {
  const bar = document.getElementById('readProgress');
  if (!bar) return;
  function update() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = Math.min((window.scrollY / docH) * 100, 100) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();


// ─── CUSTOM CURSOR GLOW ─────────────────────────────────────────────────────
(function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.getElementById('cursorGlow');
  const dot  = document.getElementById('cursorDot');
  if (!glow || !dot) return;

  let mx = 0, my = 0, gx = 0, gy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function smoothGlow() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(smoothGlow);
  })();

  document.querySelectorAll('a, button, .etab-btn, .crisis-card, .tech-card, .fact-card, .impact-item, .cta-action').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
  });
})();


// ─── AMBIENT SOUND TOGGLE ───────────────────────────────────────────────────
(function initSound() {
  const btn = document.getElementById('soundToggle');
  if (!btn) return;

  let ctx = null, sources = null, gainNode = null, isPlaying = false;

  function buildAudio(audioCtx) {
    const sr = audioCtx.sampleRate;
    const now = audioCtx.currentTime;
    const allNodes = [];

    // ── Master gain (fade in) ──────────────────────────────
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.72, now + 3.5);
    gainNode.connect(audioCtx.destination);

    // ── Helper: connect chain ──────────────────────────────
    function chain(src, ...nodes) {
      let cur = src;
      nodes.forEach(n => { cur.connect(n); cur = n; });
      cur.connect(gainNode);
      return src;
    }

    // ── Helper: make buffer source ─────────────────────────
    function makeBuf(seconds, fill) {
      const buf = audioCtx.createBuffer(2, sr * seconds, sr);
      for (let ch = 0; ch < 2; ch++) fill(buf.getChannelData(ch), ch);
      const src = audioCtx.createBufferSource();
      src.buffer = buf; src.loop = true;
      allNodes.push(src);
      return src;
    }

    // ── 1. DEEP SUB-BASS DRONE (40Hz) ─────────────────────
    // Warm, felt-not-heard foundation like a power plant
    const sub = audioCtx.createOscillator();
    sub.type = 'sine'; sub.frequency.value = 40;
    const subG = audioCtx.createGain(); subG.gain.value = 0.18;
    const subFilter = audioCtx.createBiquadFilter();
    subFilter.type = 'lowpass'; subFilter.frequency.value = 80;
    chain(sub, subG, subFilter);
    sub.start(); allNodes.push(sub);

    // ── 2. ELECTRIC HUM 60Hz + harmonics ──────────────────
    // Classic power grid hum
    [60, 120, 180, 300].forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      const g = audioCtx.createGain();
      g.gain.value = [0.06, 0.025, 0.010, 0.004][i];
      chain(osc, g);
      osc.start(); allNodes.push(osc);
    });

    // ── 3. BROWN NOISE (rumble + texture) ─────────────────
    const brownSrc = makeBuf(8, (data) => {
      let last = 0;
      for (let i = 0; i < data.length; i++) {
        const w = Math.random() * 2 - 1;
        data[i] = last = Math.max(-1, Math.min(1, (last + 0.02 * w) / 1.02));
      }
    });
    const brownLpf = audioCtx.createBiquadFilter();
    brownLpf.type = 'lowpass'; brownLpf.frequency.value = 200; brownLpf.Q.value = 0.5;
    const brownG = audioCtx.createGain(); brownG.gain.value = 0.09;
    chain(brownSrc, brownLpf, brownG);
    brownSrc.start();

    // ── 4. WIND TEXTURE (filtered white noise, slow LFO) ──
    const windSrc = makeBuf(12, (data) => {
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    });
    const windBpf = audioCtx.createBiquadFilter();
    windBpf.type = 'bandpass'; windBpf.frequency.value = 600; windBpf.Q.value = 0.3;
    const windG = audioCtx.createGain(); windG.gain.value = 0;
    // LFO to slowly swell wind in & out
    const windLfo = audioCtx.createOscillator();
    windLfo.type = 'sine'; windLfo.frequency.value = 0.07; // ~14s cycle
    const windLfoG = audioCtx.createGain(); windLfoG.gain.value = 0.028;
    windLfo.connect(windLfoG); windLfoG.connect(windG.gain);
    windG.gain.setValueAtTime(0.03, now);
    chain(windSrc, windBpf, windG);
    windSrc.start(); windLfo.start(); allNodes.push(windLfo);

    // ── 5. HIGH-FREQ SHIMMER (solar panel hiss) ───────────
    const shimmerSrc = makeBuf(6, (data) => {
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    });
    const shimmerHpf = audioCtx.createBiquadFilter();
    shimmerHpf.type = 'highpass'; shimmerHpf.frequency.value = 4000; shimmerHpf.Q.value = 1.2;
    const shimmerG = audioCtx.createGain(); shimmerG.gain.value = 0.022;
    chain(shimmerSrc, shimmerHpf, shimmerG);
    shimmerSrc.start();

    // ── 6. PULSING TONE (smart grid ping, 528Hz) ──────────
    // Occasional soft "digital heartbeat" feel
    const ping = audioCtx.createOscillator();
    ping.type = 'sine'; ping.frequency.value = 528;
    const pingEnv = audioCtx.createGain(); pingEnv.gain.value = 0;
    // LFO that creates slow rhythmic swell every ~8s
    const pingLfo = audioCtx.createOscillator();
    pingLfo.type = 'sine'; pingLfo.frequency.value = 0.125;
    const pingLfoG = audioCtx.createGain(); pingLfoG.gain.value = 0.018;
    pingLfo.connect(pingLfoG); pingLfoG.connect(pingEnv.gain);
    chain(ping, pingEnv);
    ping.start(); pingLfo.start(); allNodes.push(ping, pingLfo);

    // ── 7. REVERB (convolution via feedback delay) ─────────
    // Simple feedback delay for spaciousness
    const delay = audioCtx.createDelay(2.0);
    delay.delayTime.value = 0.45;
    const feedback = audioCtx.createGain(); feedback.gain.value = 0.38;
    const delayFilter = audioCtx.createBiquadFilter();
    delayFilter.type = 'lowpass'; delayFilter.frequency.value = 1200;
    const wetG = audioCtx.createGain(); wetG.gain.value = 0.22;
    // Tap sub & ping into delay for spacious echo
    subG.connect(delay);
    pingEnv.connect(delay);
    delay.connect(delayFilter);
    delayFilter.connect(feedback);
    feedback.connect(delay);
    delayFilter.connect(wetG);
    wetG.connect(gainNode);

    // ── 8. STEREO WIDTH via small L/R offset ──────────────
    const merger = audioCtx.createChannelMerger(2);
    const splitter = audioCtx.createChannelSplitter(2);
    // Note: main mix stays mono-ish for simplicity; width comes from the
    // slight timing difference baked into the stereo brown noise buffer.

    return { stop: () => allNodes.forEach(n => { try { n.stop(); } catch(e) {} }) };
  }

  btn.addEventListener('click', () => {
    if (!isPlaying) {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      sources = buildAudio(ctx);
      isPlaying = true;
      btn.classList.add('active');
      btn.querySelector('.sound-off').style.display = 'none';
      btn.querySelector('.sound-on').style.display  = 'inline';
    } else {
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      setTimeout(() => {
        try { sources.stop(); } catch(e) {}
      }, 1600);
      isPlaying = false;
      btn.classList.remove('active');
      btn.querySelector('.sound-off').style.display = 'inline';
      btn.querySelector('.sound-on').style.display  = 'none';
    }
  });
})();


// ─── MOBILE NAV ─────────────────────────────────────────────────────────────
(function initMobileNav() {
  const btn     = document.getElementById('mobileNavBtn');
  const nav     = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileNavOverlay');
  if (!btn || !nav || !overlay) return;

  const open  = () => { btn.classList.add('open'); nav.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { btn.classList.remove('open'); nav.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; };

  btn.addEventListener('click', () => nav.classList.contains('open') ? close() : open());
  overlay.addEventListener('click', close);
  nav.querySelectorAll('.mobile-nav__item').forEach(link => {
    link.addEventListener('click', () => {
      close();
      nav.querySelectorAll('.mobile-nav__item').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Keep mobile nav active dot in sync with sidenav scroll tracking
  const sections = [];
  nav.querySelectorAll('.mobile-nav__item').forEach(link => {
    const href = link.getAttribute('href');
    const el = document.querySelector(href);
    if (el) sections.push({ link, el });
  });
  const mio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const match = sections.find(s => s.el === e.target);
      if (match && e.isIntersecting) {
        nav.querySelectorAll('.mobile-nav__item').forEach(l => l.classList.remove('active'));
        match.link.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => mio.observe(s.el));
})();


// ─── TYPING EFFECT — Hero Title ─────────────────────────────────────────────
(function initTyping() {
  const target = document.querySelector('.typing-target');
  const cursor = document.querySelector('.typing-cursor');
  if (!target || !cursor) return;

  const text = target.dataset.text || 'ENERGI TERBARUKAN';
  let i = 0;

  setTimeout(() => {
    function type() {
      if (i <= text.length) {
        target.textContent = text.slice(0, i++);
        setTimeout(type, 75 + Math.random() * 50);
      } else {
        setTimeout(() => cursor.classList.add('done'), 2200);
      }
    }
    type();
  }, 900);
})();


// ─── SMOOTH SCROLL REVEAL (Enhanced AOS-like) ────────────────────────────────
(function initReveal() {
  const revealMap = [
    ['.section__header', 'reveal-up',    0  ],
    ['.crisis-card',     'reveal-up',    true],
    ['.tech-card',       'reveal-up',    true],
    ['.impact-item',     'reveal-left',  true],
    ['.fact-card',       'reveal-scale', true],
    ['.fe-item',         'reveal-up',    true],
    ['.cta-action',      'reveal-up',    true],
    ['.energy-tab-btns', 'reveal-up',    0   ],
    ['.crisis-visual',   'reveal-up',    0   ],
    ['.tech-diagram',    'reveal-scale', 0   ],
  ];

  revealMap.forEach(([sel, cls, stagger]) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add(cls);
      const base = parseInt(el.dataset.delay || 0);
      const delay = stagger === true ? base || i * 90 : 0;
      el.style.transitionDelay = delay + 'ms';
    });
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
      el.querySelectorAll('.bar-fill').forEach(b => b.classList.add('animated'));
      io.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => io.observe(el));

  // Bar fills
  const barIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.bar-fill').forEach(b => b.classList.add('animated'));
        barIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.crisis-visual').forEach(el => barIO.observe(el));

  // Fact counters
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      animateCounter(e.target, parseInt(e.target.dataset.target, 10));
      counterIO.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.fact-card__number').forEach(el => counterIO.observe(el));
})();


// ─── COUNTER ANIMATION ───────────────────────────────────────────────────────
function animateCounter(el, target) {
  const duration = 2200, start = performance.now();
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOutQuart(p) * target).toLocaleString('id-ID');
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}


// ─── ENERGY TABS ─────────────────────────────────────────────────────────────
(function initTabs() {
  const s = document.createElement('style');
  s.textContent = `@keyframes tabFadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`;
  document.head.appendChild(s);

  document.querySelectorAll('.etab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.etab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.energy-tab-content').forEach(c => c.classList.add('hidden'));
      const t = document.getElementById('tab-' + btn.dataset.tab);
      if (t) { t.classList.remove('hidden'); t.style.animation = 'none'; requestAnimationFrame(() => { t.style.animation = 'tabFadeIn 0.45s ease forwards'; }); }
    });
  });
})();


// ─── PARALLAX BACKGROUNDS ────────────────────────────────────────────────────
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sections = document.querySelectorAll('.parallax-section');
  if (!sections.length) return;

  function tick() {
    const sy = window.scrollY;
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.bottom < -300 || rect.top > window.innerHeight + 300) return;
      const speed = parseFloat(sec.dataset.parallaxSpeed || 0.2);
      const offset = (sy - (sec.offsetTop - window.innerHeight * 0.5)) * speed;
      sec.style.backgroundPositionY = `calc(50% + ${offset.toFixed(1)}px)`;
    });
  }
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();


// ─── SIDENAV — Active Section Tracking ───────────────────────────────────────
(function initSidenav() {
  const dots = document.querySelectorAll('.sidenav__dot');
  const sections = [];
  dots.forEach(dot => {
    const el = document.querySelector(dot.getAttribute('href'));
    if (el) sections.push({ dot, el });
  });

  new IntersectionObserver(entries => {
    entries.forEach(e => {
      const match = sections.find(s => s.el === e.target);
      if (match && e.isIntersecting) {
        dots.forEach(d => d.classList.remove('active'));
        match.dot.classList.add('active');
      }
    });
  }, { threshold: 0.4 }).observe ? sections.forEach(s => {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { dots.forEach(d => d.classList.remove('active')); sections.find(x => x.el === e.target)?.dot.classList.add('active'); }
      });
    }, { threshold: 0.4 }).observe(s.el);
  }) : null;
})();


// ─── SCROLL TO TOP ───────────────────────────────────────────────────────────
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


// ─── CTA STARS ───────────────────────────────────────────────────────────────
(function initCtaBg() {
  const container = document.getElementById('cta-bg');
  if (!container) return;
  const s = document.createElement('style');
  s.textContent = `@keyframes starTwinkle{0%,100%{opacity:0.05;transform:scale(1)}50%{opacity:0.85;transform:scale(1.6)}}`;
  document.head.appendChild(s);
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 2.5 + 0.5;
    const neon = Math.random() > 0.85;
    Object.assign(star.style, {
      position:'absolute', width:size+'px', height:size+'px', borderRadius:'50%',
      left:Math.random()*100+'%', top:Math.random()*100+'%',
      background: neon ? '#00e5ff' : '#fff',
      opacity: Math.random() * 0.4 + 0.05,
      boxShadow: neon ? '0 0 4px #00e5ff' : 'none',
      animation:`starTwinkle ${Math.random()*5+2}s ${Math.random()*5}s ease-in-out infinite`,
    });
    container.appendChild(star);
  }
})();


// ─── HERO FADE ON SCROLL ─────────────────────────────────────────────────────
(function initHeroFade() {
  const hero = document.querySelector('.hero__content');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const p = Math.min(window.scrollY / (window.innerHeight * 0.6), 1);
    hero.style.opacity = 1 - p * 0.85;
    hero.style.transform = `translateY(${window.scrollY * 0.28}px)`;
  }, { passive: true });
})();


// ─── 3D CARD TILT ────────────────────────────────────────────────────────────
(function initTilt() {
  document.querySelectorAll('.tech-card, .fact-card, .crisis-card').forEach(card => {
    let raf;
    card.addEventListener('mousemove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
        const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
        card.style.transform = `perspective(700px) rotateY(${dx*7}deg) rotateX(${-dy*7}deg) translateY(-6px) scale(1.01)`;
      });
    });
    card.addEventListener('mouseleave', () => { cancelAnimationFrame(raf); card.style.transform = ''; });
  });
})();

// ─── SIDENAV FIX (replaces above) ────────────────────────────────────────────
// Re-initialize sidenav cleanly (overrides previous)
(function() {
  const dots = document.querySelectorAll('.sidenav__dot');
  if (!dots.length) return;
  const pairs = [];
  dots.forEach(dot => {
    const el = document.querySelector(dot.getAttribute('href'));
    if (el) pairs.push({ dot, el });
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      dots.forEach(d => d.classList.remove('active'));
      const p = pairs.find(x => x.el === entry.target);
      if (p) p.dot.classList.add('active');
    });
  }, { threshold: 0.4 });
  pairs.forEach(p => io.observe(p.el));
})();