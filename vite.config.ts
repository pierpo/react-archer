import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// Library build configuration. See vite.example.config.ts for the demo app.
export default defineConfig({
  plugins: [
    react({
      // React Compiler. target '18' is the library's minimum supported React,
      // so the compiled output imports the cache from react-compiler-runtime.
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '18' }]],
      },
    }),
    dts({
      tsconfigPath: './tsconfig.build.json',
      include: ['src'],
      exclude: ['src/**/*.test.*', 'src/**/__tests__/**'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/react-archer.ts'),
      name: 'ReactArcher',
      fileName: (format) => (format === 'es' ? 'react-archer.js' : 'react-archer.cjs'),
      formats: ['es', 'cjs'],
    },
    outDir: 'lib',
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
