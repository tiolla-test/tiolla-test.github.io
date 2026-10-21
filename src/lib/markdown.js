import { esc } from './schemas.js';

const escText = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);

export const BRIEF = new Set(['Коротко', 'In brief']);
export const LESSONS = new Set(['Выводы', 'Takeaways']);
const FORK_NO = new Set(['Отказалась', 'Отказались', 'Rejected']);
const FORK_YES = new Set(['Выбрала', 'Выбрали', 'Chosen', 'Chose']);
const LIST_MARK = /^(- |\d+\. )/;
const IMG_LINE = /^!\[(.*?)\]\((\S+?) "(.*)"\)$/;

export function inline(t, ctx) {
  t = escText(t);
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, url) => {
    if (url.startsWith('case:')) return `<a href="${ctx.caseHref(url.slice(5))}">${text}</a>`;
    return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
  });
  t = t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  t = t.replace(/(?<![\p{L}\p{N}_*])\*(?!\s)(.+?)(?<!\s)\*(?![\p{L}\p{N}_*])/gu, '<i>$1</i>');
  return t;
}

export function blocks(text) {
  const out = [];
  let buf = [], fence = null;
  for (const line of text.split('\n')) {
    if (line.startsWith('```')) {
      if (fence === null) {
        if (buf.length) { out.push(buf.join('\n')); buf = []; }
        fence = [line];
      } else {
        fence.push(line);
        out.push(fence.join('\n'));
        fence = null;
      }
      continue;
    }
    if (fence !== null) fence.push(line);
    else if (!line.trim()) { if (buf.length) { out.push(buf.join('\n')); buf = []; } }
    else buf.push(line.trimEnd());
  }
  if (buf.length) out.push(buf.join('\n'));
  return out.filter((b) => b.trim() !== '---');
}

function table(lines, ctx) {
  const rows = lines.filter((l) => !/^\|?[\s:|-]+\|?$/.test(l.trim()))
    .map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
  const [head, ...body] = rows;
  const num = body.length > 0 && body.every((r) => /^[\d\s.,%–-]+$/.test(r[r.length - 1] || 'x'));
  const cell = (tag, i, n, c) => `<${tag}${num && i === n - 1 ? ' class=num' : ''}>${inline(c, ctx)}</${tag}>`;
  const th = head.map((c, i) => cell('th', i, head.length, c)).join('');
  const tb = body.map((r) => '<tr>' + r.map((c, i) => cell('td', i, r.length, c)).join('') + '</tr>').join('');
  return `<div class="tbl rv"><table><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table></div>`;
}

function figures(b, ctx) {
  const figs = b.split('\n').map((l) => {
    const [, alt, src, cap] = l.match(IMG_LINE);
    return `<figure>${ctx.img(src, alt)}<figcaption>${inline(cap, ctx)}</figcaption></figure>`;
  });
  return figs.length === 1 ? `<div class="shot rv">${figs[0]}</div>` : `<div class="pair rv">${figs.join('')}</div>`;
}

const leadLabel = (b) => { const m = b.match(/^\*\*([^*]+?)\.\*\*\s*/); return m ? m[1] : null; };

export function renderBlocks(bs, title, ctx) {
  const out = [], lessons = [];
  const flush = () => { if (lessons.length) { out.push('<div class="lessons">' + lessons.join('') + '</div>'); lessons.length = 0; } };
  for (let i = 0; i < bs.length; i++) {
    const b = bs[i];
    if (LESSONS.has(title) && b.startsWith('**')) {
      const m = b.match(/^\*\*(.+?)\*\*\s*([\s\S]*)$/);
      lessons.push(`<div class="lesson rv"><h4>${inline(m[1].replace(/\.+$/, ''), ctx)}</h4><p>${inline(m[2], ctx)}</p></div>`);
      continue;
    }
    flush();
    if (b.startsWith('```')) {
      out.push(`<pre><code>${escText(b.split('\n').slice(1, -1).join('\n'))}</code></pre>`);
    } else if (b.startsWith('### ')) {
      out.push(`<h3>${inline(b.slice(4), ctx)}</h3>`);
    } else if (b.startsWith('*Схема')) {
      out.push(ctx.schema());
    } else if (b.split('\n').every((l) => IMG_LINE.test(l))) {
      out.push(figures(b, ctx));
    } else if (b.startsWith('|')) {
      out.push(table(b.split('\n'), ctx));
    } else if (b.startsWith('> ')) {
      const q = b.split('\n').map((l) => (l.startsWith('> ') ? l.slice(2) : l)).join(' ');
      out.push(`<blockquote class="rv"><p>${inline(q, ctx)}</p></blockquote>`);
    } else if (LIST_MARK.test(b) || /^[^\n]+\n(- |\d+\. )/.test(b)) {
      const lines = b.split('\n');
      const lead = LIST_MARK.test(lines[0]) ? '' : `<p>${inline(lines.shift(), ctx)}</p>`;
      const tag = /^\d+\. /.test(lines[0]) ? 'ol' : 'ul';
      out.push(`${lead}<${tag}>${lines.map((l) => '<li>' + inline(l.replace(LIST_MARK, ''), ctx) + '</li>').join('')}</${tag}>`);
    } else if (FORK_NO.has(leadLabel(b)) && i + 1 < bs.length && FORK_YES.has(leadLabel(bs[i + 1]))) {
      const strip = (x) => inline(x.replace(/^\*\*[^*]+\*\*\s*/, ''), ctx);
      out.push(`<div class="fork rv"><div class="opt no"><span class="tag">${leadLabel(b)}</span>${strip(b)}</div>`
        + `<div class="opt yes"><span class="tag">${leadLabel(bs[i + 1])}</span>${strip(bs[i + 1])}</div></div>`);
      i++;
    } else {
      out.push(`<p>${inline(b.split('\n').join(' '), ctx)}</p>`);
    }
  }
  flush();
  return out.join('\n');
}

export function briefHtml(bs, figs, ctx) {
  const cells = bs.map((b) => b.match(/^\*\*(.+?)\.\*\*\s*([\s\S]*)$/)).filter(Boolean)
    .map((m) => `<div><p class="lbl">${inline(m[1], ctx)}</p><p>${inline(m[2], ctx)}</p></div>`);
  let out = `<div class="brief rv">${cells.join('')}</div>`;
  if (figs && figs.length) out += '<div class="figs rv">' + figs.map(([n, c]) => `<div><p class="big">${n}</p><p class="cap">${c}</p></div>`).join('') + '</div>';
  return out;
}

export function parseCase(text) {
  const cut = text.indexOf('\n## ');
  const head = text.slice(0, cut), body = text.slice(cut + 1);
  const parts = head.split(/\n---\n/).map((p) => p.trim()).filter(Boolean);
  const top = blocks(parts[0]);
  const dossier = [];
  for (const b of parts.length > 1 ? blocks(parts[1]) : []) {
    const m = b.match(/^\*\*(.+?)\.\*\*\s*([\s\S]*)$/);
    if (m) dossier.push([m[1], m[2]]);
  }
  const sections = [];
  let colophon = '';
  for (let p of body.split(/\n(?=## )/)) {
    p = p.replace(/^## /, '');
    const nl = p.indexOf('\n');
    const title = (nl < 0 ? p : p.slice(0, nl)).trim();
    const raw = nl < 0 ? '' : p.slice(nl + 1);
    const bs = blocks(raw);
    const last = bs.length ? bs[bs.length - 1].replace(/\n/g, ' ') : '';
    if (/^\*[^*].{118,}[^*]\*$/.test(last)) colophon = bs.pop().slice(1, -1);
    sections.push({ title, raw: raw.trim(), blocks: bs });
  }
  return { title: top[0].slice(2).trim(), lede: top[1], byline: top[2], dossier, sections, colophon };
}

export { esc };
