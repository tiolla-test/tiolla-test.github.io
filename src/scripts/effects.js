import { D, W, G, ST, full, fine, lang } from './env.js';

const LABEL = { open: { ru: 'Открыть', en: 'Open' }, drag: { ru: 'Двигать', en: 'Drag' } };

export function reveals(scope) {
  if (!full) return;
  const els = Array.from(scope.querySelectorAll('.rv'));
  if (!els.length) return;
  ST.batch(els, {
    start: 'top 90%', once: true,
    onEnter: (b) => { G.to(b, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out', overwrite: true }); },
  });
}

export function drawSvgs(scope) {
  if (!full) return;
  scope.querySelectorAll('svg.draw').forEach((svg) => {
    const strokes = Array.from(svg.querySelectorAll('rect, line, path')).filter((el) => !el.closest('marker'));
    const rects = svg.querySelectorAll('rect'), texts = svg.querySelectorAll('text');
    strokes.forEach((el) => {
      let L = 0;
      try { L = el.getTotalLength(); } catch (e) { L = 0; }
      if (!L) return;
      el.__len = L;
      G.set(el, { strokeDasharray: L, strokeDashoffset: L });
    });
    G.set(rects, { fillOpacity: 0 });
    G.set(texts, { opacity: 0 });
    G.timeline({ scrollTrigger: { trigger: svg, start: 'top 85%', once: true } })
      .to(strokes.filter((el) => el.__len), { strokeDashoffset: 0, duration: 1.3, stagger: 0.04, ease: 'power2.inOut' })
      .to(rects, { fillOpacity: 1, duration: 0.6, stagger: 0.03 }, '-=0.8')
      .to(texts, { opacity: 1, duration: 0.5, stagger: 0.01 }, '-=0.7')
      .add(() => { G.set(strokes, { clearProps: 'strokeDasharray,strokeDashoffset' }); G.set(rects, { clearProps: 'fillOpacity' }); });
  });
}

const fmt = (v) => Math.round(v).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US');

export function counters(scope) {
  scope.querySelectorAll('[data-count]').forEach((el) => {
    const to = +el.getAttribute('data-count');
    el.textContent = fmt(to);
    if (!full || to < 10) return;
    const o = { v: 0 };
    el.textContent = fmt(0);
    ST.create({
      trigger: el, start: 'top 92%', once: true,
      onEnter: () => { G.to(o, { v: to, duration: 2, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(o.v); }, onComplete: () => { el.textContent = fmt(to); } }); },
    });
  });
}

export function magnetic(scope) {
  if (!(full && fine)) return;
  scope.querySelectorAll('[data-magnetic]').forEach((el) => {
    const xTo = G.quickTo(el, 'x', { duration: 0.6, ease: 'power3' }), yTo = G.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    el.addEventListener('mousemove', (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.3); yTo((e.clientY - r.top - r.height / 2) * 0.35); });
    el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
  });
}

export function cursor() {
  if (!(full && fine)) return;
  const c = D.querySelector('.cur'), dot = c.querySelector('.cur-dot'), ring = c.querySelector('.cur-ring'), lab = ring.querySelector('span');
  let mx = -100, my = -100, rx = -100, ry = -100;
  W.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate3d(${mx}px,${my}px,0)`; }, { passive: true });
  (function loop() {
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    ring.style.transform = `translate3d(${rx.toFixed(1)}px,${ry.toFixed(1)}px,0)`;
    requestAnimationFrame(loop);
  })();
  D.addEventListener('mouseover', (e) => {
    const t = e.target.closest ? e.target.closest('[data-cursor], a, button') : null;
    c.classList.remove('big', 'hov', 'drag');
    if (!t) return;
    const k = t.getAttribute('data-cursor');
    if (k === 'open') { c.classList.add('big'); lab.textContent = LABEL.open[lang]; }
    else if (k === 'drag') { c.classList.add('big', 'drag'); lab.textContent = LABEL.drag[lang]; }
    else c.classList.add('hov');
  });
  D.addEventListener('mouseleave', () => { mx = my = -100; });
}
