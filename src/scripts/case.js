import { D, W, G, full, split } from './env.js';
import { reveals, drawSvgs } from './effects.js';

export function caseAnims(art) {
  if (!full) return;
  const title = art.querySelector('.c-title');
  if (title && W.innerWidth >= 760) {
    G.from(split(title, 'words'), { yPercent: 110, duration: 1.1, stagger: 0.05, ease: 'power4.out', delay: 0.15 });
  }
  G.from(art.querySelectorAll('.c-kicker, .c-sub, .back'), { opacity: 0, y: 26, duration: 0.9, stagger: 0.08, ease: 'power3.out', delay: 0.25 });
  const cover = art.querySelector('.c-cover');
  if (cover) {
    G.fromTo(cover, { clipPath: 'inset(12% 6% 12% 6% round 6px)' }, { clipPath: 'inset(0% 0% 0% 0% round 6px)', duration: 1.4, ease: 'power4.inOut', delay: 0.3 });
    G.fromTo(cover.querySelector('img'), { yPercent: 0 }, { yPercent: -14, ease: 'none', scrollTrigger: { trigger: cover, start: 'top bottom', end: 'bottom top', scrub: true } });
  }
  reveals(art);
  drawSvgs(art);
}

export function setupToc(art) {
  const links = {};
  art.querySelectorAll('.toc a').forEach((a) => { links[a.getAttribute('data-sec')] = a; });
  if (!('IntersectionObserver' in W)) return;
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      for (const k in links) links[k].classList.toggle('on', k === e.target.id);
    });
  }, { rootMargin: '-30% 0px -65% 0px' });
  art.querySelectorAll('.sec').forEach((s) => io.observe(s));
}

export function currentSec() {
  let id = null;
  D.querySelectorAll('.case .sec').forEach((s) => { if (s.getBoundingClientRect().top < 160) id = s.id; });
  return id;
}

export function readingProgress() {
  const bar = D.querySelector('.prog i');
  if (!bar) return;
  const update = () => {
    const h = D.documentElement.scrollHeight - W.innerHeight;
    bar.style.transform = `scaleX(${(h > 0 ? Math.min(1, W.pageYOffset / h) : 0).toFixed(4)})`;
  };
  W.addEventListener('scroll', update, { passive: true });
  update();
}
