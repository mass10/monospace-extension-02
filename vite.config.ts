import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { join, resolve } from 'path';
import { defineConfig } from 'vite';
import manifest from './src/manifest';

console.debug(`### vite.config.js ###`);
console.debug(`dist: [${resolve(__dirname, 'dist')}]`);

export default defineConfig({
  // @see https://github.com/crxjs/chrome-extension-tools/issues/696
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },

  // prevent src/ prefix on extension urls
  // root: resolve(__dirname, 'src'),
  // root: 'src',

  // publicDir: resolve(__dirname, 'public'),
  publicDir: 'public',

  build: {
    // outDir: resolve(__dirname, 'dist'),
    outDir: 'dist',

    rollupOptions: {
      input: {
        // see web_accessible_resources in the manifest config
        // welcome: join(__dirname, 'src/welcome/welcome.html'),
        welcome: 'src/welcome/welcome.html',
      },
      output: {
        chunkFileNames: 'assets/chunk-[hash].js',
      },
    },
  },
  plugins: [react(), crx({ manifest })],
});
