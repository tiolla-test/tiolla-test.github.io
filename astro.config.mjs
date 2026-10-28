import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
  /* the next page is fetched on hover, and on any click while the wipe plays */
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
