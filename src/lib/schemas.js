import DATA from '../data/schemas.json';

export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

let svgN = 0;

export function ficDiagram(lang, here = [], home = false, hrefFor = null) {
  const T = DATA.fic[lang];
  const uid = `d${++svgN}`;
  const xs = [20, 260, 500, 740];
  const parts = [];
  T.nodes.forEach(([title, m1, m2], i) => {
    const x = xs[i];
    let cls, tag;
    if (here.includes(i)) { cls = 'dn dn-in'; tag = T.this; }
    else if (i === 2) { cls = 'dn dn-plain'; tag = ''; }
    else { cls = 'dn dn-other'; tag = home ? T.open : T.other; }
    const g = [`<rect x="${x}" y="110" width="190" height="94" rx="4"/>`, `<text x="${x + 16}" y="134" class="d-num">0${i + 1}</text>`];
    if (tag) g.push(`<text x="${x + 174}" y="134" text-anchor="end" class="d-tag">${tag}</text>`);
    g.push(`<text x="${x + 16}" y="160" class="d-label">${title}</text>`,
      `<text x="${x + 16}" y="180" class="d-meta">${m1}</text>`,
      `<text x="${x + 16}" y="196" class="d-meta">${m2}</text>`);
    let node = `<g class="${cls}">${g.join('')}</g>`;
    const slug = DATA.fic.nodeSlugs[i];
    if (home && slug && hrefFor) node = `<a href="${hrefFor(slug)}" data-cursor="open">${node}</a>`;
    parts.push(node);
    if (i < 3) parts.push(`<line x1="${x + 192}" y1="157" x2="${x + 234}" y2="157" class="d-line" marker-end="url(#${uid}a)"/>`);
  });
  return `<svg viewBox="0 0 950 318" role="img" aria-labelledby="${uid}t ${uid}d" class="draw">
<title id="${uid}t">${T.title}</title><desc id="${uid}d">${T.desc}</desc>
<defs><marker id="${uid}a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="d-head"/></marker>
<marker id="${uid}b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="d-head-acc"/></marker></defs>
<path d="M355 108 C355 50, 115 50, 115 104" class="d-line" marker-end="url(#${uid}a)"/>
<text x="235" y="50" text-anchor="middle" class="d-meta">${T.arc}</text>
${parts.join('')}
<path d="M835 206 C835 290, 115 290, 115 210" class="d-line d-acc-line" marker-end="url(#${uid}b)"/>
<text x="475" y="244" text-anchor="middle" class="d-acc">${T.stages}</text>
<text x="475" y="306" text-anchor="middle" class="d-meta">${T.noint}</text>
</svg>`;
}

export function mangoMap(lang, marks = [], tag = null, home = false) {
  const T = DATA.mango[lang];
  const parts = Object.entries(DATA.mango.nodes).map(([key, n]) => {
    const { x, y, w, h } = n;
    const [title, sub] = n[lang];
    const on = marks.includes(key) ? ' on' : '';
    const g = [`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>`];
    const tagHere = on && tag && key === marks[0];
    if (h === 50) {
      g.push(`<text x="${x + 16}" y="${y + 31}" class="d-label">${title}<tspan class="d-meta" dx="14">${sub}</tspan></text>`);
      if (tagHere) g.push(`<text x="${x + w - 14}" y="${y + 31}" text-anchor="end" class="d-tag">${T.this}: ${tag}</text>`);
    } else {
      if (tagHere) g.push(`<text x="${x + 16}" y="${y + 18}" class="d-tag">${T.this}: ${tag}</text>`);
      g.push(`<text x="${x + 16}" y="${y + 39}" class="d-label">${title}</text>`, `<text x="${x + 16}" y="${y + 58}" class="d-meta">${sub}</text>`);
    }
    return `<g class="dn mn${on}" data-k="${key}">${g.join('')}</g>`;
  });
  const lines = [[165, 70, 165, 104], [475, 70, 475, 104], [785, 70, 785, 104], [165, 214, 165, 178], [260, 214, 420, 178], [475, 214, 475, 178]]
    .map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" class="d-line"/>`).join('');
  const pon = marks.includes('platform') ? ' on' : '';
  const svg = `<svg viewBox="0 0 950 350" role="img" aria-label="${esc(T.label)}" class="draw">
${lines}${parts.join('')}
<g class="dn mn dn-base${pon}" data-k="platform"><rect x="20" y="306" width="910" height="34" rx="4"/>
<text x="36" y="328" class="d-meta">${T.platform}</text></g></svg>`;
  if (home) return svg;
  return `<figure class="schema rv"><div class="schema-in">${svg}</div>${mangoList(lang, marks, tag)}<figcaption>${T.cap}</figcaption></figure>`;
}

export function qmSchema(lang, tag) {
  const T = DATA.qm[lang];
  const parts = [];
  DATA.qm.steps[lang].forEach(([title, m1, m2], i) => {
    const x = 20 + i * 186;
    parts.push(`<g class="${i === 0 ? 'dn dn-in' : 'dn dn-other'}"><rect x="${x}" y="44" width="166" height="92" rx="4"/>`
      + `<text x="${x + 14}" y="72" class="d-label">${title}</text>`
      + `<text x="${x + 14}" y="96" class="d-meta">${m1}</text>`
      + `<text x="${x + 14}" y="114" class="d-meta">${m2}</text></g>`);
    parts.push(`<text x="${x + 14}" y="160" class="${i === 0 ? 'd-bad' : 'd-ok'}">${i === 0 ? T.bad : T.ok}</text>`);
    if (i < 4) parts.push(`<line x1="${x + 168}" y1="90" x2="${x + 184}" y2="90" class="d-line"/>`);
  });
  parts.push(`<text x="20" y="32" class="d-tag">${T.this}: ${tag}</text>`);
  return `<figure class="schema rv"><div class="schema-in"><svg viewBox="0 0 950 176" role="img" aria-label="${esc(T.label)}" class="draw">`
    + `${parts.join('')}</svg></div>${qmList(lang, tag)}<figcaption>${T.cap}</figcaption></figure>`;
}

export function ficList(lang, here = []) {
  const T = DATA.fic[lang];
  const items = T.nodes.map(([title, m1, m2], i) => {
    const cls = here.includes(i) ? 'sm-in' : i === 2 ? 'sm-plain' : '';
    const tag = here.includes(i) ? T.this : i === 2 ? '' : T.other;
    return `<li class="${cls}"><span class="sm-k">0${i + 1}${tag ? ` · ${tag}` : ''}</span><b>${title}</b><span>${m1} ${m2}</span></li>`;
  });
  return `<div class="sm"><ol class="sm-list sm-flow">${items.join('')}</ol>`
    + `<ul class="sm-back"><li>02 → 01: ${T.arc}</li><li class="sm-acc">04 → 01: ${T.stages}</li></ul><p class="sm-note">${T.noint}</p></div>`;
}

export function mangoList(lang, marks = [], tag = null) {
  const T = DATA.mango[lang];
  const items = Object.entries(DATA.mango.nodes).map(([key, n]) => {
    const [title, sub] = n[lang];
    const on = marks.includes(key);
    const k = on && tag && key === marks[0] ? `<span class="sm-k">${T.this}: ${tag}</span>` : '';
    return `<li class="${on ? 'sm-on' : ''}">${k}<b>${title}</b><span>${sub}</span></li>`;
  });
  items.push(`<li class="sm-base${marks.includes('platform') ? ' sm-on' : ''}"><span>${T.platform}</span></li>`);
  return `<div class="sm"><ul class="sm-list">${items.join('')}</ul></div>`;
}

export function qmList(lang, tag) {
  const T = DATA.qm[lang];
  const items = DATA.qm.steps[lang].map(([title, m1, m2], i) => (
    `<li class="${i === 0 ? 'sm-in' : ''}"><span class="sm-k">${i === 0 ? `${T.this}: ${tag} · ${T.bad}` : T.ok}</span><b>${title}</b><span>${m1} ${m2}</span></li>`
  ));
  return `<div class="sm"><ol class="sm-list sm-flow">${items.join('')}</ol></div>`;
}

export function mangoMini(lang) {
  const N = DATA.mango.nodes, T = DATA.mango[lang];
  const chip = (k) => `<span class="mm-n mn" data-k="${k}">${N[k][lang][0]}</span>`;
  return `<div class="mm" aria-hidden="true"><div class="mm-r">${chip('constructor')}</div>`
    + `<div class="mm-r mm-3">${['voice', 'chat', 'admin'].map(chip).join('')}</div>`
    + `<div class="mm-r mm-2">${['airobot', 'assistant'].map(chip).join('')}</div>`
    + `<div class="mm-r"><span class="mm-n mm-base mn" data-k="platform">${T.platform.split(':')[0]}</span></div>`
    + '<p class="mm-cap"></p></div>';
}

export const PATH = DATA.path;
