import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Use absolute paths instead of relative
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
