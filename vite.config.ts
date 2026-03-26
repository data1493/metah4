import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

/// <reference types="vitest/config" />

// Vite plugin: exposes POST /api/save-colors in dev mode only
function saveColorsPlugin() {
  return {
    name: 'save-colors',
    configureServer(server: import('vite').ViteDevServer) {
      server.middlewares.use('/api/save-colors', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const colors: Record<string, string> = JSON.parse(body)
            const root = process.cwd()

            // Update src/index.css — :root block AND @theme block
            const cssPath = path.join(root, 'src', 'index.css')
            let css = fs.readFileSync(cssPath, 'utf-8')
            for (const [k, v] of Object.entries(colors)) {
              // :root vars e.g.  --neon-gold: #FDB927;
              css = css.replace(new RegExp(`(--${k}:\\s*)([^;]+)(;)`, 'g'), `$1${v}$3`)
              // @theme vars e.g.  --color-neon-gold: #ffd700;
              css = css.replace(new RegExp(`(--color-${k}:\\s*)([^;]+)(;)`, 'g'), `$1${v}$3`)
            }
            fs.writeFileSync(cssPath, css, 'utf-8')

            // Update tailwind.config.js — color values
            const twPath = path.join(root, 'tailwind.config.js')
            let tw = fs.readFileSync(twPath, 'utf-8')
            for (const [k, v] of Object.entries(colors)) {
              // replace e.g.  'neon-gold': '#FDB927',
              tw = tw.replace(new RegExp(`('[${k}]+':\\s*')[^']+(')`), `$1${v}$2`)
              // also plain: #hex values on same key line
              tw = tw.replace(
                new RegExp(`((?:'${k}'|"${k}"):\\s*(?:'|"))[^'"]+(?:'|")`),
                `$1${v}'`
              )
            }
            fs.writeFileSync(twPath, tw, 'utf-8')

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: String(e) }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), saveColorsPlugin()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: false,
    },
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 5173,
      },
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
        '/api/brave-images': {
          target: 'https://api.search.brave.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/brave-images/, '/res/v1/images/search'),
          headers: {
            'X-Subscription-Token': env.VITE_BRAVE_SEARCH_API_KEY ?? '',
            'Accept': 'application/json',
          },
        },
        '/api/brave-videos': {
          target: 'https://api.search.brave.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/brave-videos/, '/res/v1/videos/search'),
          headers: {
            'X-Subscription-Token': env.VITE_BRAVE_SEARCH_API_KEY ?? '',
            'Accept': 'application/json',
          },
        },
        '/api/brave-news': {
          target: 'https://api.search.brave.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/brave-news/, '/res/v1/news/search'),
          headers: {
            'X-Subscription-Token': env.VITE_BRAVE_SEARCH_API_KEY ?? '',
            'Accept': 'application/json',
          },
        },
        '/api/chimp': {
          target: 'https://api.chimpsheet.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/chimp/, ''),
        },
      },
    },
  }
})
