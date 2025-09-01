import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  base: '/fake-cloudflare-zaraz-consent/',
  plugins: [tailwindcss()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  },
  css: {
    devSourcemap: true
  }
})
