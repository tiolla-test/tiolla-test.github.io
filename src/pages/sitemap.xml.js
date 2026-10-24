import { getCases } from '../lib/cases.js';
import { LANGS, homeUrl, caseUrl } from '../lib/i18n.js';

/* every page in both languages, with the other language as an alternate */
export async function GET({ site }) {
  const abs = (p) => (site ? new URL(p, site).href : p);
  const pages = [(l) => homeUrl(l), ...(await getCases()).map((c) => (l) => caseUrl(l, c.slug))];
  const urls = pages.flatMap((href) => LANGS.map((l) => `<url><loc>${abs(href(l))}</loc>`
    + LANGS.map((x) => `<xhtml:link rel="alternate" hreflang="${x}" href="${abs(href(x))}"/>`).join('') + '</url>'));
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
    + urls.join('\n') + '\n</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
