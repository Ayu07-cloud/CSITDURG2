 /* ================================================================
   CSIT DURG — script.js  v2.0
   Features: image injection, loader, cursor, particles, nav,
   scroll reveal, counters, lightbox, tilt, typing, form
   ================================================================ */

/* ── IMAGE INJECTION ──
   IMG object comes from images_data.js loaded before this script  */
function injectImages() {
  const map = {
    navCsitLogo:     IMG.csitLogo,
    loaderLogo:      IMG.csitLogo,
    heroCsvtuLogo:   IMG.csvtuLogo,
    heroImg:         IMG.campus1,
    aboutImg1:       IMG.campus2,
    aboutImg2:       IMG.campus4,
    aboutCsvtuLogo:  IMG.csvtuLogo,
    aboutCsitLogo:   IMG.csitLogo,
    gImg1:           IMG.campus1,
    gImg2:           IMG.campus2,
    gImg3:           IMG.campus3,
    gImg4:           IMG.campus4,
    footerCsitLogo:  IMG.csitLogo,
    footerCsvtuLogo: IMG.csvtuLogo,
  };
  for (const [id, src] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) el.src = src;
  }
}
injectImages();

/* ── PAGE LOADER ── */
const pageLoader  = document.getElementById('pageLoader');
const loaderBar   = document.getElementById('loaderBar');
const loaderTxt   = document.getElementById('loaderTxt');
const loadMsgs    = [
  'LOADING ASSETS...',
  'INITIALIZING UI...',
  'BUILDING CAMPUS...',
  'ALMOST READY...',
  'WELCOME TO CSIT!'
];
let loadPct = 0;

function advanceLoader() {
  loadPct += Math.random() * 18 + 6;
  if (loadPct > 100) loadPct = 100;
  loaderBar.style.width = loadPct + '%';
  loaderTxt.textContent = loadMsgs[Math.min(Math.floor(loadPct / 25), 4)];
  if (loadPct < 100) {
    setTimeout(advanceLoader, 160 + Math.random() * 120);
  } else {
    setTimeout(() => {
      pageLoader.classList.add('hidden');
    }, 400);
  }
}

window.addEventListener('load', () => {
  setTimeout(advanceLoader, 200);
});

/* ── CUSTOM CURSOR ── */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
});

(function followRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(followRing);
})();

document.querySelectorAll('a, button, .gi, .dc, .sc, .pgc, .af, .cii, .sr-btn, .rec, input, select, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width        = '48px';
    cursorRing.style.height       = '48px';
    cursorRing.style.borderColor  = 'var(--red)';
    cursorDot.style.opacity       = '0';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width        = '32px';
    cursorRing.style.height       = '32px';
    cursorRing.style.borderColor  = 'var(--cyan)';
    cursorDot.style.opacity       = '1';
  });
});

/* ── PARTICLE CANVAS ── */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Dot {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - .5) * .38;
    this.vy = (Math.random() - .5) * .38;
    this.r  = Math.random() * 1.4 + .4;
    this.op = Math.random() * .45 + .08;
    this.c  = Math.random() > .55
      ? `rgba(230,57,70,${this.op})`
      : `rgba(0,240,255,${this.op * .55})`;
  }
  step() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.c;
    ctx.fill();
  }
}

for (let i = 0; i < 65; i++) particles.push(new Dot());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 115) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(230,57,70,${(1 - d / 115) * .18})`;
        ctx.lineWidth = .5;
        ctx.stroke();
      }
    }
  }
}

(function animPart() {
  ctx.clearRect(0, 0, W, H);
  drawLines();
  particles.forEach(p => { p.step(); p.draw(); });
  requestAnimationFrame(animPart);
})();

/* ── NAVBAR ── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  // Active link highlight
  let curr = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) curr = s.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + curr);
  });
}, { passive: true });

/* ── MOBILE MENU ── */
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});
navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const sibs = [...entry.target.parentElement.querySelectorAll(
      '.reveal-up, .reveal-left, .reveal-right'
    )];
    const idx = sibs.indexOf(entry.target);
    entry.target.style.transitionDelay = `${idx * 0.07}s`;
    entry.target.classList.add('revealed');
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }).observe
  ? (() => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const sibs = [...entry.target.parentElement.querySelectorAll(
            '.reveal-up, .reveal-left, .reveal-right'
          )];
          const idx = sibs.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 0.07}s`;
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
      revealEls.forEach(el => obs.observe(el));
    })()
  : revealEls.forEach(el => el.classList.add('revealed'));

/* ── COUNTERS ── */
const counters = document.querySelectorAll('.counter');
new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el  = entry.target;
    const end = parseInt(el.dataset.target, 10);
    const dur = 1800;
    const t0  = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * end).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = end.toLocaleString();
    };
    requestAnimationFrame(tick);
    counters_obs.unobserve(el);
  });
}, { threshold: 0.5 }).observe
  ? (() => {})() // no-op fallback branch
  : null;

// Use a named observer so we can unobserve
const counters_obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el  = entry.target;
    const end = parseInt(el.dataset.target, 10);
    const t0  = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / 1800, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * end).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = end.toLocaleString();
    };
    requestAnimationFrame(tick);
    counters_obs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counters_obs.observe(c));

/* ── GALLERY LIGHTBOX ── */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbCap    = document.getElementById('lbCaption');
const lbClose  = document.getElementById('lbClose');
const lbOverlay= document.getElementById('lbOverlay');

document.querySelectorAll('.gi').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const cap = item.querySelector('.gi-ov span');
    lbImg.src = img.src;
    lbCap.textContent = cap ? cap.textContent.replace(/\s+/g, ' ').trim() : '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLB() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}
lbClose.addEventListener('click', closeLB);
lbOverlay.addEventListener('click', closeLB);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

/* ── CARD TILT ── */
document.querySelectorAll('.dc, .sc, .pgc, .plc, .rec').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - .5;
    const y = (e.clientY - r.top)  / r.height - .5;
    card.style.transition = 'border-color .3s, box-shadow .3s';
    card.style.transform  = `translateY(-4px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'all .45s var(--ease)';
    card.style.transform  = '';
  });
});

/* ── TYPING EFFECT ── */
const typingEl = document.getElementById('typingText');
const phrases  = [
  'Engineering Excellence · B.E. / M.Tech',
  'Pharmaceutical Sciences · B.Pharma / D.Pharma',
  'Affiliated to CSVTU, Bhilai',
  'AICTE Approved · PCI Accredited',
  'Shaping Leaders Since 1999'
];
let pIdx = 0, cIdx = 0, deleting = false;

function typeLoop() {
  const phrase = '> ' + phrases[pIdx];
  if (!deleting) {
    cIdx++;
    typingEl.textContent = phrase.substring(0, cIdx);
    if (cIdx >= phrase.length) {
      deleting = true;
      setTimeout(typeLoop, 2200);
      return;
    }
    setTimeout(typeLoop, 55);
  } else {
    cIdx--;
    typingEl.textContent = phrase.substring(0, cIdx);
    if (cIdx <= 2) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 28);
  }
}
setTimeout(typeLoop, 1800);

/* ── FORM ── */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('.cf-submit');
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled  = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg,#00b894,#00a381)';
    btn.style.boxShadow  = '0 0 20px rgba(0,184,148,.4)';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled  = false;
      btn.style.background = '';
      btn.style.boxShadow  = '';
      e.target.reset();
    }, 3500);
  }, 1600);
});

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
