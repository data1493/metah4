import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/brave': {
          target: 'https://api.search.brave.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/brave/, '/res/v1/web/search'),
          headers: {
            'X-Subscription-Token': env.VITE_BRAVE_SEARCH_API_KEY ?? '',
            'Accept': 'application/json',
          },
        },
      },
    },
  }
})
