import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(new URL(import.meta.url).pathname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', 
    port: 5173,      
    proxy: {
      '/api': {
        target: 'http://kanban_api:3000', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
