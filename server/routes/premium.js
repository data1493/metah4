/**
 * Premium encrypted search endpoint.
 *
 * Client sends: POST /api/chimp/search
 * Body: { nonce: "<hex>", ciphertext: "<hex>", tab: "all"|"images"|"videos"|"news", country?: string, count?: number, offset?: number }
 *
 * Server decrypts the query with SHARED_SECRET, then forwards to the appropriate
 * Brave/Pexels endpoint and returns the results.
 *
 * SHARED_SECRET must be a 64-char hex string (32 bytes) matching VITE_SHARED_SECRET on the client.
 */

import express from 'express'
import nacl from 'tweetnacl'
import axios from 'axios'

const router = express.Router()

function getSharedKey() {
  const hex = process.env.SHARED_SECRET
  if (!hex || hex.length !== 64) throw new Error('SHARED_SECRET not configured or invalid')
  const bytes = new Uint8Array(32)
  for (let i = 0; i < 32; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return bytes
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return bytes
}

router.post('/search', express.json(), async (req, res) => {
  try {
    const { nonce, ciphertext, tab = 'all', country, count = 20, offset = 0 } = req.body
    if (!nonce || !ciphertext) return res.status(400).json({ error: 'nonce and ciphertext required' })

    const key = getSharedKey()
    const decrypted = nacl.secretbox.open(hexToBytes(ciphertext), hexToBytes(nonce), key)
    if (!decrypted) return res.status(400).json({ error: 'Decryption failed — invalid payload or key mismatch' })

    const query = new TextDecoder().decode(decrypted)
    const BRAVE_KEY = process.env.BRAVE_SEARCH_API_KEY
    const PEXELS_KEY = process.env.PEXELS_API_KEY

    const braveHeaders = { 'X-Subscription-Token': BRAVE_KEY, 'Accept': 'application/json' }
    const params = { q: query, count, offset, ...(country ? { country } : {}) }

    let data
    if (tab === 'all') {
      const r = await axios.get('https://api.search.brave.com/res/v1/web/search', { params, headers: braveHeaders })
      data = r.data
    } else if (tab === 'images') {
      const r = await axios.get('https://api.search.brave.com/res/v1/images/search', { params, headers: braveHeaders })
      data = r.data
    } else if (tab === 'videos') {
      const r = await axios.get('https://api.search.brave.com/res/v1/videos/search', { params, headers: braveHeaders })
      data = r.data
    } else if (tab === 'news') {
      const r = await axios.get('https://api.search.brave.com/res/v1/news/search', { params, headers: braveHeaders })
      data = r.data
    } else if (tab === 'pexels') {
      const r = await axios.get('https://api.pexels.com/v1/search', {
        params: { query, per_page: count, page: offset },
        headers: { Authorization: PEXELS_KEY },
      })
      data = r.data
    } else {
      return res.status(400).json({ error: `Unknown tab: ${tab}` })
    }

    res.json(data)
  } catch (err) {
    console.error('[premium]', err.message)
    res.status(502).json({ error: 'Search failed' })
  }
})

export default router
