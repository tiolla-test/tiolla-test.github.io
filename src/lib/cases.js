import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import { parseCase, renderBlocks, briefHtml, inline, BRIEF, LESSONS, esc } from './markdown.js';
import { ficDiagram, ficList, mangoMap, qmSchema } from './schemas.js';
import { caseUrl } from './i18n.js';
import groups from '../data/groups.json';

const IMAGES = import.meta.glob('/src/content/cases/*/img/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });

const imgCache = new Map();
export async function picture(meta) {
  if (!imgCache.has(meta.src)) {
    const img = await getImage({ src: meta, format: 'webp', quality: 84, width: Math.min(1800, meta.width) });
    imgCache.set(meta.src, { src: img.src, width: img.attributes.width ?? img.options.width, height: img.attributes.height ?? Math.round(meta.height * (img.options.width / meta.width)) });
  }
  return imgCache.get(meta.src);
}

/* link previews: JPEG, since not every messenger shows WebP */
export async function ogImage(meta) {
  const img = await getImage({ src: meta, format: 'jpg', quality: 82, width: Math.min(1200, meta.width) });
  const width = img.attributes.width ?? img.options.width;
  return { src: img.src, width, height: img.attributes.height ?? Math.round(meta.height * (width / meta.width)) };
}

export function imgTag(p, alt, { cls = '', zoom = true, eager = false } = {}) {
  return `<img src="${p.src}" width="${p.width}" height="${p.height}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''}${zoom ? ' data-zoom tabindex="0" role="button" aria-haspopup="dialog"' : ''} loading="${eager ? 'eager' : 'lazy'}" decoding="async">`;
}

async function caseImages(slug) {
  const prefix = `/src/content/cases/${slug}/`;
  const out = {};
  for (const [path, meta] of Object.entries(IMAGES)) {
    if (path.startsWith(prefix)) out[path.slice(prefix.length)] = await picture(meta);
  }
  return out;
}

function labelTables(html) {
  return html.replace(/<table>([\s\S]*?)<\/table>/g, (m, inner) => {
    const head = inner.match(/<thead>([\s\S]*?)<\/thead>/);
    if (!head) return m;
    const labels = [...head[1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((x) => x[1].replace(/<[^>]+>/g, '').trim());
    const rows = inner.replace(/<tr>([\s\S]*?)<\/tr>/g, (tr, cells) => {
      let i = 0;
      return '<tr>' + cells.replace(/<td(\s[^>]*)?>/g, (td, attrs = '') => `<td${attrs} data-label="${esc(labels[i++] || '')}">`) + '</tr>';
    });
    return `<table>${rows}</table>`;
  });
}

let cache = null;

export async function getCases() {
  if (cache) return cache;
  const entries = await getCollection('cases');
  const bySlug = {};
  for (const e of entries) {
    const [slug, lang] = e.id.split('/');
    (bySlug[slug] ??= { slug })[lang] = e;
  }
  const list = Object.values(bySlug).filter((c) => c.ru)
    .map((c) => ({ ...c.ru.data, slug: c.slug, entries: { ru: c.ru, en: c.en?.body?.trim() ? c.en : null }, labels: { ru: c.ru.data, en: c.en?.data || {} } }))
    .filter((c) => groups.some((g) => g.id === c.group));
  const groupIndex = (c) => groups.findIndex((g) => g.id === c.group);
  list.sort((a, b) => groupIndex(a) - groupIndex(b) || (a.order ?? 999) - (b.order ?? 999));
  for (const [i, c] of list.entries()) {
    c.n = i + 1;
    c.images = await caseImages(c.slug);
    c.coverMeta = c.cover ? IMAGES[`/src/content/cases/${c.slug}/${c.cover}`] : null;
    c.titles = {};
    for (const lang of ['ru', 'en']) {
      const e = c.entries[lang] || c.entries.ru;
      c.titles[lang] = parseCase(e.body).title;
    }
    c.local = (lang) => ({ ...c.labels.ru, ...(c.labels[lang] || {}) });
  }
  cache = list;
  return list;
}

export async function renderCase(c, lang) {
  const entry = c.entries[lang] || c.entries.ru;
  const contentLang = c.entries[lang] ? lang : 'ru';
  const data = c.local(contentLang);
  const d = parseCase(entry.body);
  const ctx = {
    caseHref: (slug) => caseUrl(lang, slug),
    img: (src, alt) => {
      const p = c.images[src];
      if (!p) throw new Error(`${c.slug}: no image ${src}`);
      return imgTag(p, alt);
    },
    schema: () => {
      if (data.schema === 'fic') {
        return `<figure class="schema rv"><div class="schema-in">${ficDiagram(contentLang, data.here || [])}</div>${ficList(contentLang, data.here || [])}<figcaption>${data.schemaCaption}</figcaption></figure>`;
      }
      if (data.schema === 'qm') return qmSchema(contentLang, data.tag);
      if (data.schema === 'mango') return mangoMap(contentLang, data.marks || [], data.tag);
      return '';
    },
  };
  const isHtml = data.format === 'html';
  const htmlImg = (body) => body.replace(/<img([^>]*?)src="([^"]+)"([^>]*)>/g, (m, a, src, b) => {
    const alt = (a + b).match(/alt="([^"]*)"/);
    return ctx.img(src, alt ? alt[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&') : '');
  });
  const sections = d.sections.map((s) => {
    let body;
    if (isHtml) body = htmlImg(s.raw);
    else if (BRIEF.has(s.title)) body = briefHtml(s.blocks, data.figures, ctx);
    else body = renderBlocks(s.blocks, s.title, ctx);
    return { title: s.title.includes('<') ? s.title : inline(s.title, ctx), brief: BRIEF.has(s.title), lessons: LESSONS.has(s.title), body: labelTables(body) };
  });
  return {
    lang: contentLang,
    title: d.title,
    lede: isHtml ? d.lede : inline(d.lede, ctx),
    byline: isHtml ? d.byline : inline(d.byline, ctx),
    dossier: d.dossier.map(([a, b]) => ({
      label: esc(a),
      value: isHtml ? b : inline(b, ctx),
      wide: ['Материалы', 'Источники', 'Materials', 'Sources'].includes(a),
    })),
    sections,
    colophon: d.colophon ? inline(d.colophon, ctx) : '',
    note: data.note || '',
    data,
  };
}
