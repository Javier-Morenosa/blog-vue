import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// When deploying to GitHub Pages without a custom domain, set base to '/repo-name/'
// With a custom domain, base should be '/'
export default defineConfig({
  plugins: [vue()],
  base: '/',
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist'
  }
})