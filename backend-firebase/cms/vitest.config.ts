import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    server: {
      deps: {
        inline: [/@firecms\//, /@material-design-icons\//],
      },
    },
  },
});
