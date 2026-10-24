import { D, R, W, G, ST, full, page, lenis, store, scrollToY, scrollToEl, whenVisible } from './env.js';
import { reveals, drawSvgs, counters, magnetic, cursor } from './effects.js';
import { initDemos, initReel } from './demos.js';
import { heroIntro, preloader, mangoLink, initFicMap } from './home.js';
import { caseAnims, setupToc, setupFolds, currentSec, readingProgress } from './case.js';

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

/* an anchor link only scrolls, so keyboard focus is moved to the target as well */
function focusEl(el) {
  if (!el) return;
  if (!el.matches('a[href], button, input, [tabindex]')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

D.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest('a[href]');
  if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
  const href = a.getAttribute('href');
  if (href === '#') { e.preventDefault(); scrollToY(0); return; }
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || /\.(pdf|jpe?g|png|webp)$/i.test(url.pathname)) return;
  e.preventDefault();
  /* language: each language has its own address, the current section is kept */
  if (a.hasAttribute('data-lang-set')) {
    if (a.hasAttribute('aria-current')) return;
    const sec = page === 'case' ? currentSec() : null;
    if (page === 'home') store.set('pf-back', '1', true);
    navigate(url.pathname + (sec ? '#' + sec : ''));
    return;
  }
  if (samePage(url)) {
    if (url.hash) {
      const el = D.getElementById(decodeURIComponent(url.hash.slice(1)));
      scrollToEl(el);
      focusEl(el);
      history.replaceState(null, '', url.hash);
    }
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
/* while the menu or the image viewer is open, the rest of the page is out of reach for Tab and screen readers;
   without smooth scroll (touch screens) the page under it is also kept from scrolling */
function isolate(keep) {
  for (const el of D.body.children) if (el.tagName !== 'SCRIPT') el.inert = keep ? !keep.includes(el) : false;
  R.classList.toggle('locked', !!keep && !lenis);
}

const menu = D.querySelector('.menu'), mb = D.querySelector('.menu-btn'), nav = D.querySelector('.nav');
function menuOpen(o) {
  if (menu.classList.contains('open') === o) return;
  menu.classList.toggle('open', o);
  mb.setAttribute('aria-expanded', o ? 'true' : 'false');
  if (lenis) { if (o) lenis.stop(); else lenis.start(); }
  isolate(o ? [nav, menu] : null);
  if (o) menu.querySelector('a').focus();
  else mb.focus();
}
mb.addEventListener('click', () => menuOpen(!menu.classList.contains('open')));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) menuOpen(false); });

const lb = D.querySelector('.lb'), lbImg = lb.querySelector('img');
let lbFrom = null;
function openLb(im) {
  lbFrom = im;
  lbImg.src = im.currentSrc || im.src; lbImg.alt = im.alt;
  lb.hidden = false;
  lb.scrollTo(0, 0);
  const widen = () => {
    const w = Math.min(lbImg.naturalWidth, 1200);
    if (W.innerWidth >= 760 || w <= lb.clientWidth - 32) return;
    lb.classList.add('lb-wide');
    lbImg.style.width = `${w}px`;
    lb.scrollTo(0, 0);
  };
  if (lbImg.complete) widen(); else lbImg.addEventListener('load', widen, { once: true });
  if (lenis) lenis.stop();
  isolate([lb]);
  lb.querySelector('button').focus();
}
D.addEventListener('click', (e) => {
  const im = e.target.closest('img[data-zoom]');
  if (im) openLb(im);
});
/* like a button: Enter opens on press, Space on release (a release over the Close button would close it again) */
D.addEventListener('keydown', (e) => {
  const im = e.target.closest && e.target.closest('img[data-zoom]');
  if (!im || (e.key !== 'Enter' && e.key !== ' ')) return;
  e.preventDefault();
  if (e.key === 'Enter') openLb(im);
});
D.addEventListener('keyup', (e) => {
  const im = e.target.closest && e.target.closest('img[data-zoom]');
  if (im && e.key === ' ') openLb(im);
});
function closeLb() {
  lb.hidden = true; lb.classList.remove('lb-wide'); lbImg.removeAttribute('style'); lbImg.removeAttribute('src');
  if (lenis) lenis.start();
  isolate(null);
  if (lbFrom) { lbFrom.focus({ preventScroll: true }); lbFrom = null; }
}
lb.addEventListener('click', closeLb);
D.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!lb.hidden) closeLb();
  if (menu.classList.contains('open')) menuOpen(false);
  if (!pal.hidden) palOpen(false);
});

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
R.classList.add('ready');
whenVisible(start);

function start() {
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
  } else if (page === 'case') {
    const art = D.querySelector('.case');
    initDemos(art);
    setupFolds(art);
    caseAnims(art);
    setupToc(art);
    readingProgress();
    if (location.hash) requestAnimationFrame(() => scrollToEl(D.getElementById(decodeURIComponent(location.hash.slice(1))), true));
  }
  if (restoreY !== null) requestAnimationFrame(() => scrollToY(+restoreY, true));
  uncover();
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(() => ST.refresh());
}
