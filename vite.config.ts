import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sha-256/',  // Pour GitHub Pages: https://bitcoin-formation.github.io/sha-256/
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

