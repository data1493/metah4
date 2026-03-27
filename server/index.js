import 'dotenv/config'
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import premiumRouter from './routes/premium.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

const BRAVE_KEY = process.env.BRAVE_SEARCH_API_KEY
const PEXELS_KEY = process.env.PEXELS_API_KEY

if (!BRAVE_KEY) console.warn('[server] WARNING: BRAVE_SEARCH_API_KEY not set — Brave searches will fail')
if (!PEXELS_KEY) console.warn('[server] WARNING: PEXELS_API_KEY not set — Pexels image searches will fail')

// ── Premium encrypted search endpoint ───────────────────────────────────────
app.use('/api/chimp', premiumRouter)

// ── Standard API proxies ─────────────────────────────────────────────────────

// Forward the real client IP to Brave so it geolocates the user, not the server
const forwardClientIp = (proxyReq, req) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress
  if (ip) proxyReq.setHeader('X-Forwarded-For', ip)
}

// Brave web search
app.use(createProxyMiddleware({
  pathFilter: (path) => path.startsWith('/api/brave') && !path.startsWith('/api/brave-'),
  target: 'https://api.search.brave.com',
  changeOrigin: true,
  pathRewrite: { '^/api/brave': '/res/v1/web/search' },
  headers: {
    'X-Subscription-Token': BRAVE_KEY ?? '',
    'Accept': 'application/json',
  },
  on: {
    proxyReq: forwardClientIp,
    error: (err, _req, res) => { res.status(502).json({ error: 'Brave Search unavailable' }) },
  },
}))

// Brave image search
app.use(createProxyMiddleware({
  pathFilter: '/api/brave-images',
  target: 'https://api.search.brave.com',
  changeOrigin: true,
  pathRewrite: { '^/api/brave-images': '/res/v1/images/search' },
  headers: {
    'X-Subscription-Token': BRAVE_KEY ?? '',
    'Accept': 'application/json',
  },
  on: {
    proxyReq: forwardClientIp,
    error: (err, _req, res) => { res.status(502).json({ error: 'Brave Image Search unavailable' }) },
  },
}))

// Brave video search
app.use(createProxyMiddleware({
  pathFilter: '/api/brave-videos',
  target: 'https://api.search.brave.com',
  changeOrigin: true,
  pathRewrite: { '^/api/brave-videos': '/res/v1/videos/search' },
  headers: {
    'X-Subscription-Token': BRAVE_KEY ?? '',
    'Accept': 'application/json',
  },
  on: {
    proxyReq: forwardClientIp,
    error: (err, _req, res) => { res.status(502).json({ error: 'Brave Video Search unavailable' }) },
  },
}))

// Brave news search
app.use(createProxyMiddleware({
  pathFilter: '/api/brave-news',
  target: 'https://api.search.brave.com',
  changeOrigin: true,
  pathRewrite: { '^/api/brave-news': '/res/v1/news/search' },
  headers: {
    'X-Subscription-Token': BRAVE_KEY ?? '',
    'Accept': 'application/json',
  },
  on: {
    proxyReq: forwardClientIp,
    error: (err, _req, res) => { res.status(502).json({ error: 'Brave News Search unavailable' }) },
  },
}))

// Pexels image search
app.use(createProxyMiddleware({
  pathFilter: '/api/pexels',
  target: 'https://api.pexels.com',
  changeOrigin: true,
  pathRewrite: { '^/api/pexels': '/v1/search' },
  headers: {
    'Authorization': PEXELS_KEY ?? '',
  },
  on: { error: (err, _req, res) => { res.status(502).json({ error: 'Pexels unavailable' }) } },
}))

// ── IP geolocation (city from user's real IP) ────────────────────────────────
app.get('/api/geoip', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress
  try {
    const r = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city,regionName`)
    const data = await r.json()
    if (data.status === 'success') {
      res.json({ city: data.city, region: data.regionName, country: data.countryCode })
    } else {
      res.json({ city: null, region: null, country: null })
    }
  } catch {
    res.json({ city: null, region: null, country: null })
  }
})

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
