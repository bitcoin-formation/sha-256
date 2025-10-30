import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // GitHub Pages gère déjà le /sha-256/ dans l'URL
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

