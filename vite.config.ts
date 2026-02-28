import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/search': {
        target: 'https://lite.duckduckgo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/search/, '/lite/'),
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0',
        },
      },
    },
  },
})
