import { D, R, G, full, lenis, store, split } from './env.js';

export function heroIntro() {
  if (!full) { R.classList.add('hero-ready'); return; }
  const chars = [];
  D.querySelectorAll('.hero-title .ht-line > span').forEach((sp) => { chars.push(...split(sp, 'chars')); });
  G.set(chars, { yPercent: 118 });
  const rest = D.querySelectorAll('.hero-kick, .hero-sub, .hero-facts, .hero-act, .hero-vis');
  G.set(rest, { opacity: 0, y: 24 });
  R.classList.add('hero-ready');
  G.timeline({ defaults: { ease: 'power4.out' } })
    .to(chars, { yPercent: 0, duration: 1, stagger: 0.022 })
    .to(rest, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform' }, '-=0.8');
}

export function preloader(done) {
  const pre = D.querySelector('.pre');
  if (!R.classList.contains('show-pre') || !pre) { if (pre) pre.remove(); done(); return; }
  store.set('pf-seen', '1', true);
  const num = pre.querySelector('.pre-num'), bar = pre.querySelector('.pre-bar i'), o = { v: 0 };
  if (lenis) lenis.stop();
  const paint = () => { num.textContent = String(Math.round(o.v)).padStart(3, '0'); bar.style.transform = `scaleX(${o.v / 100})`; };
  const fonts = D.fonts && D.fonts.ready ? D.fonts.ready : Promise.resolve();
  const cap = new Promise((r) => setTimeout(r, 2200));
  G.to(o, {
    v: 82, duration: 0.75, ease: 'power2.inOut', onUpdate: paint,
    onComplete: () => {
      Promise.race([fonts, cap]).then(() => {
        G.timeline()
          .to(o, { v: 100, duration: 0.3, ease: 'power2.out', onUpdate: paint })
          .to(pre, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '+=0.08')
          .add(done, '-=0.6')
          .add(() => { R.classList.remove('show-pre'); pre.remove(); if (lenis) lenis.start(); });
      });
    },
  });
}

export function mangoLink() {
  const rows = D.querySelectorAll('.row[data-marks]'), maps = D.querySelectorAll('.mango-map');
  const hl = (marks) => maps.forEach((m) => {
    m.querySelectorAll('.mn').forEach((n) => { n.classList.toggle('on', marks.includes(n.getAttribute('data-k'))); });
    m.classList.toggle('active', marks.length > 0);
  });
  rows.forEach((r) => {
    const mk = r.getAttribute('data-marks').split(' ');
    ['mouseenter', 'focus'].forEach((ev) => r.addEventListener(ev, () => hl(mk)));
    ['mouseleave', 'blur'].forEach((ev) => r.addEventListener(ev, () => hl([])));
  });
  maps.forEach((m) => m.querySelectorAll('.mn').forEach((n) => {
    const k = n.getAttribute('data-k');
    n.addEventListener('mouseenter', () => {
      hl([k]);
      rows.forEach((r) => r.classList.toggle('lit', r.getAttribute('data-marks').split(' ').includes(k)));
    });
    n.addEventListener('mouseleave', () => { hl([]); rows.forEach((r) => r.classList.remove('lit')); });
  }));
}

export function initFicMap(navigate) {
  const box = D.querySelector('.fmap');
  if (!box) return;
  const svg = box.querySelector('.p-route'), base = svg.querySelector('.p-base'), done = svg.querySelector('.p-done'), tube = svg.querySelector('.p-tube');
  const L = base.getTotalLength(), N = 600, S = [];
  for (let i = 0; i <= N; i++) { const q = base.getPointAtLength(L * i / N); S.push([q.x, q.y]); }
  done.style.strokeDasharray = L;
  const sts = Array.from(svg.querySelectorAll('.p-st'));
  const near = (x, y) => {
    let bi = 0, bd = 1e12;
    for (let k = 0; k <= N; k++) { const d = (S[k][0] - x) ** 2 + (S[k][1] - y) ** 2; if (d < bd) { bd = d; bi = k; } }
    return bi / N;
  };
  const fr = sts.map((g) => { const c = g.querySelector('circle'); return near(+c.getAttribute('cx'), +c.getAttribute('cy')); });
  const rows = Array.from(D.querySelectorAll('.fmg .row[data-st]')), prev = box.querySelectorAll('.fprev figure');
  let cur = 0, target = 0, raf = 0, drag = null;
  function draw() {
    const k = Math.round(cur * N), p = S[k], a = S[Math.min(N, k + 3)], b = S[Math.max(0, k - 3)];
    tube.setAttribute('transform', `translate(${p[0].toFixed(1)},${p[1].toFixed(1)}) rotate(${(Math.atan2(a[1] - b[1], a[0] - b[0]) * 180 / Math.PI * 0.18).toFixed(1)})`);
    done.style.strokeDashoffset = (L * (1 - cur)).toFixed(1);
  }
  function anim() { raf = 0; cur += (target - cur) * 0.1; if (Math.abs(target - cur) < 0.0006) cur = target; draw(); if (cur !== target) raf = requestAnimationFrame(anim); }
  function moveTo(f, now) { target = f; if (now || !full) { cur = f; draw(); } else if (!raf) raf = requestAnimationFrame(anim); }
  function light(list, slug) {
    sts.forEach((g, j) => g.classList.toggle('on', list.includes(j)));
    box.classList.toggle('active', list.length > 0);
    if (slug) prev.forEach((f) => f.classList.toggle('on', f.getAttribute('data-slug') === slug));
  }
  const forRow = (r) => r.getAttribute('data-st').split(',').map(Number);
  rows.forEach((r) => {
    const list = forRow(r), slug = r.getAttribute('data-slug');
    const on = () => { light(list, slug); rows.forEach((x) => x.classList.remove('lit')); moveTo(fr[list[list.length - 1]]); };
    r.addEventListener('mouseenter', on);
    r.addEventListener('focus', on);
    r.addEventListener('mouseleave', () => light([], null));
    r.addEventListener('blur', () => light([], null));
  });
  function pick(j) {
    light([j], sts[j].getAttribute('data-slug'));
    rows.forEach((r) => r.classList.toggle('lit', forRow(r).includes(j)));
  }
  const closest = () => { let best = 0, bd = 9; fr.forEach((f, j) => { const d = Math.abs(f - cur); if (d < bd) { bd = d; best = j; } }); return best; };
  sts.forEach((g, j) => {
    g.addEventListener('mouseenter', () => { pick(j); moveTo(fr[j]); });
    g.addEventListener('click', () => navigate(g.getAttribute('data-href')));
  });
  svg.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.p-tube, .p-hit') || e.button > 0) return;
    e.preventDefault();
    drag = { id: e.pointerId };
    try { svg.setPointerCapture(e.pointerId); } catch (x) { /* capture unsupported */ }
    box.classList.add('dragging');
  });
  svg.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const m = svg.getScreenCTM();
    if (!m) return;
    let pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; pt = pt.matrixTransform(m.inverse());
    moveTo(near(pt.x, pt.y), true);
    pick(closest());
  });
  function end() {
    if (!drag) return;
    drag = null;
    box.classList.remove('dragging');
    moveTo(fr[closest()]);
  }
  svg.addEventListener('pointerup', end);
  svg.addEventListener('pointercancel', end);
  draw();
}
