/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // O destino do seu backend
        changeOrigin: true,
        // A LINHA DO REWRITE FOI APAGADA AQUI! Agora o Vite é um espelho.
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(new URL(import.meta.url).pathname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})