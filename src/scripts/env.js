import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export const D = document, R = D.documentElement, W = window;
export const G = gsap, ST = ScrollTrigger;
G.registerPlugin(ST);

export const store = {
  get(k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
  set(k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) { /* storage blocked */ } },
  del(k, s) { try { (s ? sessionStorage : localStorage).removeItem(k); } catch (e) { /* storage blocked */ } },
};

export const fine = W.matchMedia('(hover: hover) and (pointer: fine)').matches;
export const lang = R.getAttribute('data-lang') === 'en' ? 'en' : 'ru';
export const page = R.getAttribute('data-page');

const motion = R.classList.contains('m-full');
if (!motion) { R.classList.remove('m-full', 'show-pre', 'wipe-in'); R.classList.add('m-calm'); }
if (fine) R.classList.add('fine');
export const full = motion;

/* animations started in a background tab would play unseen, so the start waits until the tab is shown */
export function whenVisible(fn) {
  if (D.visibilityState !== 'hidden') { fn(); return; }
  const on = () => { if (D.visibilityState === 'hidden') return; D.removeEventListener('visibilitychange', on); fn(); };
  D.addEventListener('visibilitychange', on);
}

export let lenis = null;
if (full && fine) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ST.update);
  G.ticker.add((t) => { lenis.raf(t * 1000); });
  G.ticker.lagSmoothing(0);
}

export function scrollToY(y, now) {
  if (lenis) lenis.scrollTo(y, { immediate: !!now, force: true, duration: 1.2 });
  else W.scrollTo({ top: y, behavior: now || !full ? 'auto' : 'smooth' });
}

export function scrollToEl(el, now) {
  if (!el) return;
  scrollToY(Math.max(0, el.getBoundingClientRect().top + W.pageYOffset - 84), now);
}

export function split(el, mode, label = true) {
  if (el.__parts) return el.__parts;
  const text = el.textContent.replace(/\s+/g, ' ').trim(), parts = [];
  if (label) el.setAttribute('aria-label', text);
  el.textContent = '';
  text.split(' ').forEach((w, i, a) => {
    const ws = D.createElement('span');
    ws.className = 'w';
    ws.setAttribute('aria-hidden', 'true');
    if (mode === 'chars') {
      Array.from(w).forEach((ch) => { const s = D.createElement('span'); s.className = 'ch'; s.textContent = ch; ws.appendChild(s); parts.push(s); });
    } else {
      const s = D.createElement('span'); s.className = 'wi'; s.textContent = w; ws.appendChild(s); parts.push(s);
    }
    el.appendChild(ws);
    if (i < a.length - 1) el.appendChild(D.createTextNode(' '));
  });
  el.__parts = parts;
  return parts;
}

export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
