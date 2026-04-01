// ─── Theme Toggle ─────────────────────────────────────────────────────────────
const THEME_KEY = 'pl-theme';

function applyTheme(mode) {
  document.body.classList.toggle('light-mode', mode === 'light');
  localStorage.setItem(THEME_KEY, mode);
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
});

document.querySelectorAll('.theme-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    applyTheme(isLight ? 'dark' : 'light');
  });
});

// ─── Reading Progress Bar ─────────────────────────────────────────────────────
const progressBar = document.createElement('div');
progressBar.id = 'progress-bar';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ─── Back to Top ─────────────────────────────────────────────────────────────
const backToTop = document.createElement('button');
backToTop.id = 'back-to-top';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
document.body.append(backToTop);

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Reveal on Scroll ─────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── Stat Counters ────────────────────────────────────────────────────────────
function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(ease * target);
    el.textContent = value >= 1000 ? value.toLocaleString() : value;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEl = entry.target.querySelector('.stat-num');
      if (numEl) animateCounter(numEl, parseInt(numEl.dataset.target, 10));
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stat').forEach(el => statObserver.observe(el));

// ─── Hero Canvas ─────────────────────────────────────────────────────────────
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  // Warm amber/neutral particles — no mouse tracking, just ambient drift
  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.2 + 0.2;
      this.vx = (Math.random() - 0.5) * 0.15;
      this.vy = -(Math.random() * 0.25 + 0.05);
      this.alpha = Math.random() * 0.3 + 0.05;
      // warm tone: amber or neutral
      this.warm = Math.random() > 0.4;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.warm
        ? `rgba(200,169,110,${this.alpha})`
        : `rgba(220,210,195,${this.alpha * 0.5})`;
      ctx.fill();
    }
  }

  function drawBackground() {
    ctx.clearRect(0, 0, W, H);
    // Subtle warm gradient in top-left
    const g = ctx.createRadialGradient(W * 0.1, H * 0.15, 0, W * 0.1, H * 0.15, W * 0.55);
    g.addColorStop(0, 'rgba(200,169,110,0.04)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function init() {
    resize();
    particles = Array.from({ length: 35 }, () => new Particle());
  }

  function loop() {
    drawBackground();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  init();
  loop();
  window.addEventListener('resize', resize);
}

// ─── Mobile Nav ───────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-menu-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const links = btn.closest('.nav').querySelector('.nav-links');
    if (links) links.classList.toggle('open');
  });
});

// ─── Nav scroll opacity ───────────────────────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    const isLight = document.body.classList.contains('light-mode');
    const scrolled = window.scrollY > 40;
    nav.style.background = scrolled
      ? (isLight ? 'rgba(250,248,244,0.95)' : 'rgba(16,15,13,0.92)')
      : (isLight ? 'rgba(250,248,244,0.82)' : 'rgba(16,15,13,0.75)');
  }, { passive: true });
}

// ─── Page Transitions ─────────────────────────────────────────────────────────
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (href && !href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('tel') && !href.startsWith('http')) {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.2s ease';
      setTimeout(() => { window.location.href = href; }, 220);
    });
  }
});

// Fade in
window.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.35s ease';
    document.body.style.opacity = '1';
  });
});
