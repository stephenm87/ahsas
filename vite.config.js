import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        seminar: resolve(__dirname, 'seminar.html'),
        pieces: resolve(__dirname, 'pieces.html'),
        cer: resolve(__dirname, 'cer.html'),
        cerBuilder: resolve(__dirname, 'cer-builder.html'),
        sourceAnalyzer: resolve(__dirname, 'source-analyzer.html'),
        sources: resolve(__dirname, 'sources.html'),
        timeline: resolve(__dirname, 'timeline.html'),
        compare: resolve(__dirname, 'compare.html'),
        research: resolve(__dirname, 'research.html'),
        about: resolve(__dirname, 'about.html')
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});
