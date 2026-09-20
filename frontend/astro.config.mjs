import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('./src', import.meta.url));

// Browser-side /api/media/* still needs a dev proxy. Server-side fetches during
// the build use API_BASE_URL directly and never pass through this.
const devApiProxyTarget =
  process.env.DEV_API_PROXY_URL || 'http://127.0.0.1:5001/demo-umd-website/us-central1/api';

export default defineConfig({
  site: 'https://umd.hack4impact.org',
  output: 'static',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        // /apply renders the same page as /apply/student and canonicalises to
        // it, so listing both would advertise a duplicate. The /og/*.png cards
        // are social-preview assets, not pages.
        return !/\/apply\/?$/.test(pathname) && !pathname.startsWith('/og/');
      },
    }),
  ],
  vite: {
    resolve: { alias: { '@': src } },
    server: {
      proxy: {
        '/api': {
          target: devApiProxyTarget,
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api/, ''),
        },
      },
    },
  },
});
