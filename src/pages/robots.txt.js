import { assetUrl } from '../lib/i18n.js';

export function GET({ site }) {
  const map = site ? new URL(assetUrl('sitemap.xml'), site).href : assetUrl('sitemap.xml');
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${map}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
