import 'dotenv/config'
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

const BRAVE_KEY = process.env.BRAVE_SEARCH_API_KEY
const PEXELS_KEY = process.env.PEXELS_API_KEY

if (!BRAVE_KEY) console.warn('[server] WARNING: BRAVE_SEARCH_API_KEY not set — Brave searches will fail')
if (!PEXELS_KEY) console.warn('[server] WARNING: PEXELS_API_KEY not set — Pexels image searches will fail')

// ── API proxies ──────────────────────────────────────────────────────────────

// Brave web search
app.use('/api/brave', createProxyMiddleware({
  target: 'https://api.search.brave.com',
  changeOrigin: true,
  pathRewrite: { '^/api/brave': '/res/v1/web/search' },
  headers: {
    'X-Subscription-Token': BRAVE_KEY ?? '',
    'Accept': 'application/json',
  },
  on: { error: (err, _req, res) => { res.status(502).json({ error: 'Brave Search unavailable' }) } },
}))

// Brave image search
app.use('/api/brave-images', createProxyMiddleware({
  target: 'https://api.search.brave.com',
  changeOrigin: true,
  pathRewrite: { '^/api/brave-images': '/res/v1/images/search' },
  headers: {
    'X-Subscription-Token': BRAVE_KEY ?? '',
    'Accept': 'application/json',
  },
  on: { error: (err, _req, res) => { res.status(502).json({ error: 'Brave Image Search unavailable' }) } },
}))

// Brave video search
app.use('/api/brave-videos', createProxyMiddleware({
  target: 'https://api.search.brave.com',
  changeOrigin: true,
  pathRewrite: { '^/api/brave-videos': '/res/v1/videos/search' },
  headers: {
    'X-Subscription-Token': BRAVE_KEY ?? '',
    'Accept': 'application/json',
  },
  on: { error: (err, _req, res) => { res.status(502).json({ error: 'Brave Video Search unavailable' }) } },
}))

// Brave news search
app.use('/api/brave-news', createProxyMiddleware({
  target: 'https://api.search.brave.com',
  changeOrigin: true,
  pathRewrite: { '^/api/brave-news': '/res/v1/news/search' },
  headers: {
    'X-Subscription-Token': BRAVE_KEY ?? '',
    'Accept': 'application/json',
  },
  on: { error: (err, _req, res) => { res.status(502).json({ error: 'Brave News Search unavailable' }) } },
}))

// Pexels image search
app.use('/api/pexels', createProxyMiddleware({
  target: 'https://api.pexels.com',
  changeOrigin: true,
  pathRewrite: { '^/api/pexels': '/v1/search' },
  headers: {
    'Authorization': PEXELS_KEY ?? '',
  },
  on: { error: (err, _req, res) => { res.status(502).json({ error: 'Pexels unavailable' }) } },
}))

// ── Static frontend ──────────────────────────────────────────────────────────

const distPath = path.resolve(__dirname, '../dist')
app.use(express.static(distPath))

// SPA fallback — all non-API routes serve index.html
app.get(/^(?!\/api\/).*/, (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`[server] Metah4 running on http://localhost:${PORT}`)
})
