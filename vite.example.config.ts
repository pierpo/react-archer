import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Demo app served at `yarn start` and built for GitHub Pages via `yarn deploy:example`.
export default defineConfig({
  root: resolve(__dirname, 'example'),
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '18' }]],
      },
    }),
  ],
  server: {
    port: 8080,
  },
  build: {
    outDir: resolve(__dirname, 'example-dist'),
    emptyOutDir: true,
  },
});
