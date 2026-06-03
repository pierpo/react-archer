import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Demo app served at `yarn start` and built for GitHub Pages via `yarn deploy:example`.
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project at https://pierpo.github.io/react-archer/,
  // so the production build must reference assets under that sub-path. Dev
  // (and Cypress against localhost:8080/) stays at the root.
  base: command === 'build' ? '/react-archer/' : '/',
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
}));
