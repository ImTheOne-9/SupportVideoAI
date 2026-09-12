import { defineConfig } from 'vite';
import { htmlPartials } from './build/vite_html_partials.js';

export default defineConfig({
  plugins: [htmlPartials()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8765',
        changeOrigin: true
      }
    }
  },
  preview: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8765',
        changeOrigin: true
      }
    }
  }
});
