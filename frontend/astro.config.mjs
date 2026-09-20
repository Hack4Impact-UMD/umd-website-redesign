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
  integrations: [
    react(),
    // /apply renders the same page as /apply/student and canonicalises to it,
    // so listing both would advertise a duplicate.
    sitemap({ filter: (page) => !/\/apply\/?$/.test(new URL(page).pathname) }),
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
