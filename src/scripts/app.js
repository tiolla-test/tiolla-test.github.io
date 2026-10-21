import { D, R, W, G, ST, full, page, lenis, store, scrollToY, scrollToEl } from './env.js';
import { reveals, drawSvgs, counters, magnetic, cursor } from './effects.js';
import { initDemos, initReel } from './demos.js';
import { heroIntro, preloader, mangoLink, initFicMap } from './home.js';
import { caseAnims, setupToc, currentSec, readingProgress } from './case.js';

/* page transitions: the accent wipe covers the screen, the next page opens it again */
const wipeEl = D.querySelector('.wipe');

function navigate(href) {
  if (!full) { location.href = href; return; }
  if (page === 'home') store.set('pf-home-y', String(W.pageYOffset), true);
  G.timeline()
    .set(wipeEl, { transformOrigin: '50% 100%' })
    .to(wipeEl, { scaleY: 1, duration: 0.55, ease: 'power4.in' })
    .add(() => { store.set('pf-wipe', '1', true); location.href = href; });
}

function uncover() {
  if (!R.classList.contains('wipe-in')) return;
  G.set(wipeEl, { scaleY: 1, transformOrigin: '50% 0%' });
  R.classList.remove('wipe-in');
  G.to(wipeEl, { scaleY: 0, duration: 0.75, ease: 'power4.out', delay: 0.05 });
}

W.addEventListener('pageshow', (e) => { if (e.persisted) G.set(wipeEl, { scaleY: 0 }); });

const samePage = (url) => url.origin === location.origin && url.pathname === location.pathname;

D.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest('a[href]');
  if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
  const href = a.getAttribute('href');
  if (href === '#') { e.preventDefault(); scrollToY(0); return; }
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || /\.(pdf|jpe?g|png|webp)$/i.test(url.pathname)) return;
  e.preventDefault();
  if (samePage(url)) {
    if (url.hash) { scrollToEl(D.getElementById(decodeURIComponent(url.hash.slice(1)))); history.replaceState(null, '', url.hash); }
    else scrollToY(0);
    return;
  }
  if (a.hasAttribute('data-back') && store.get('pf-from-home', true) === url.pathname) {
    store.set('pf-back', '1', true);
    navigate(url.pathname);
    return;
  }
  navigate(url.href);
});

/* language: each language has its own address, the current section is kept */
D.querySelectorAll('[data-lang-set]').forEach((b) => {
  b.addEventListener('click', () => {
    if (b.getAttribute('aria-pressed') === 'true') return;
    let href = b.getAttribute('data-href');
    const sec = page === 'case' ? currentSec() : null;
    if (sec) href += '#' + sec;
    if (page === 'home') store.set('pf-back', '1', true);
    navigate(href);
  });
});

D.querySelectorAll('.mtg').forEach((mt) => {
  mt.setAttribute('aria-pressed', full ? 'true' : 'false');
  mt.setAttribute('aria-label', R.lang === 'ru' ? (full ? 'Анимация включена. Выключить' : 'Анимация выключена. Включить') : (full ? 'Motion is on. Turn off' : 'Motion is off. Turn on'));
  mt.addEventListener('click', () => {
    store.set('pf-motion', R.classList.contains('m-full') ? 'calm' : 'full');
    store.set('pf-seen', '1', true);
    store.set('pf-y', String(W.pageYOffset), true);
    location.reload();
  });
});

/* palette */
const pal = D.getElementById('pal'), pb = D.querySelector('.pal-btn');
function syncPalette() {
  const t = R.getAttribute('data-theme');
  D.querySelectorAll('[data-theme-set]').forEach((b) => b.setAttribute('aria-pressed', b.getAttribute('data-theme-set') === t ? 'true' : 'false'));
}
D.querySelectorAll('[data-theme-set]').forEach((b) => b.addEventListener('click', () => {
  R.setAttribute('data-theme', b.getAttribute('data-theme-set'));
  store.set('pf-theme', b.getAttribute('data-theme-set'));
  syncPalette();
}));
const palOpen = (o) => { pal.hidden = !o; pb.setAttribute('aria-expanded', o ? 'true' : 'false'); };
pb.addEventListener('click', (e) => { e.stopPropagation(); palOpen(pal.hidden); });
D.addEventListener('click', (e) => { if (!pal.hidden && !e.target.closest('#pal')) palOpen(false); });
syncPalette();

/* menu, image viewer, header on scroll */
const menu = D.querySelector('.menu'), mb = D.querySelector('.menu-btn');
function menuOpen(o) {
  menu.classList.toggle('open', o);
  mb.setAttribute('aria-expanded', o ? 'true' : 'false');
  if (lenis) { if (o) lenis.stop(); else lenis.start(); }
}
mb.addEventListener('click', () => menuOpen(!menu.classList.contains('open')));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) menuOpen(false); });

const lb = D.querySelector('.lb'), lbImg = lb.querySelector('img');
D.addEventListener('click', (e) => {
  const im = e.target.closest('img[data-zoom]');
  if (!im) return;
  lbImg.src = im.currentSrc || im.src; lbImg.alt = im.alt;
  lb.hidden = false;
  const widen = () => {
    const w = Math.min(lbImg.naturalWidth, 1200);
    if (W.innerWidth >= 760 || w <= lb.clientWidth - 32) return;
    lb.classList.add('lb-wide');
    lbImg.style.width = `${w}px`;
    lb.scrollTo(0, 0);
  };
  if (lbImg.complete) widen(); else lbImg.addEventListener('load', widen, { once: true });
  if (lenis) lenis.stop();
  lb.querySelector('button').focus();
});
function closeLb() { lb.hidden = true; lb.classList.remove('lb-wide'); lbImg.removeAttribute('style'); lbImg.removeAttribute('src'); if (lenis) lenis.start(); }
lb.addEventListener('click', closeLb);
D.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!lb.hidden) closeLb();
  if (menu.classList.contains('open')) menuOpen(false);
  if (!pal.hidden) palOpen(false);
});

const nav = D.querySelector('.nav');
let lastY = 0;
W.addEventListener('scroll', () => {
  const y = W.pageYOffset;
  if (Math.abs(y - lastY) > 6) {
    nav.classList.toggle('nav-up', y > lastY && y > 360 && !menu.classList.contains('open'));
    lastY = y;
  }
}, { passive: true });

/* start */
magnetic(D);
cursor();
let restoreY = store.get('pf-y', true);
store.del('pf-y', true);

if (page === 'home') {
  if (store.get('pf-back', true) && restoreY === null) restoreY = store.get('pf-home-y', true);
  store.del('pf-back', true);
  store.set('pf-from-home', location.pathname, true);
  mangoLink();
  initFicMap(navigate);
  initReel();
  reveals(D);
  drawSvgs(D);
  counters(D);
  const intro = () => {
    heroIntro();
    if (location.hash) scrollToEl(D.getElementById(decodeURIComponent(location.hash.slice(1))), true);
  };
  if (restoreY !== null || location.hash) { R.classList.remove('show-pre'); D.querySelector('.pre')?.remove(); R.classList.add('hero-ready'); intro(); }
  else preloader(intro);
} else {
  const art = D.querySelector('.case');
  initDemos(art);
  caseAnims(art);
  setupToc(art);
  readingProgress();
  if (location.hash) requestAnimationFrame(() => scrollToEl(D.getElementById(decodeURIComponent(location.hash.slice(1))), true));
}
if (restoreY !== null) requestAnimationFrame(() => scrollToY(+restoreY, true));
uncover();
R.classList.add('ready');
if (D.fonts && D.fonts.ready) D.fonts.ready.then(() => ST.refresh());
