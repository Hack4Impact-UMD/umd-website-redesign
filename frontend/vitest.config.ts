import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

// Deliberately standalone rather than astro/config's getViteConfig: that helper
// installs Astro's vite-plugin-head, which crashes when Vitest creates its
// server. Nothing here needs to resolve .astro files, so the alias is enough.
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**', '.astro/**'],
  },
});
