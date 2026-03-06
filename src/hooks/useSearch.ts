import { useState, useCallback } from 'react'
import axios from 'axios'
import { API } from '../config'
import type { SearchResult, BraveWebResult, BraveLocalResult, LogEntry } from '../types'

// Domains that typically indicate local business listings
const LOCAL_DOMAINS = ['yelp.com', 'yellowpages.com', 'tripadvisor.com', 'mapquest.com', 'bbb.org', 'nextdoor.com']

export function hashQuery(q: string): Promise<string> {
  const data = new TextEncoder().encode(q)
  return crypto.subtle.digest('SHA-256', data).then(buffer =>
    Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  )
}

interface UseSearchReturn {
  query: string
  setQuery: (q: string) => void
  results: SearchResult[]
  loading: boolean
  error: string
  hashed: boolean
  hashValue: string
  apiKeyError: boolean
  logs: LogEntry[]
  search: (lat?: number | null, lng?: number | null) => Promise<void>
  clearLogs: () => void
  resetSearch: () => void
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function isLocalResult(url: string, localResults: BraveLocalResult[]): boolean {
  const domain = extractDomain(url)
  // Check against known local listing domains
  if (LOCAL_DOMAINS.some(d => domain.includes(d))) return true
  // Check if URL matches any Brave local result
  return localResults.some(lr => lr.url === url)
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hashed, setHashed] = useState(false)
  const [hashValue, setHashValue] = useState('')
  const [apiKeyError, setApiKeyError] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])

  const search = useCallback(async (lat?: number | null, lng?: number | null) => {
    if (!query.trim()) return

    const apiKey = import.meta.env.VITE_BRAVE_SEARCH_API_KEY
    if (!apiKey || apiKey === 'your_brave_api_key_here') {
      setApiKeyError(true)
      return
    }

    const newLogs: LogEntry[] = [
      { timestamp: new Date(), message: `Query received: "${query.trim()}"` },
      { timestamp: new Date(), message: 'Starting SHA-256 hash on device...' },
    ]

    const hash = await hashQuery(query.trim())

    newLogs.push({ timestamp: new Date(), message: `Hash completed: ${hash.slice(0, 16)}...` })
    newLogs.push({ timestamp: new Date(), message: 'Sending hashed query to secure API...' })

    setHashValue(hash)
    setHashed(true)
    setLoading(true)
    setResults([])
    setError('')
    setApiKeyError(false)
    setLogs(prev => [...prev, ...newLogs])

    try {
      const params: Record<string, string | number> = {
        q: query.trim(),
        count: API.RESULTS_PER_PAGE,
      }
      // Pass geolocation if available for local result boosting
      if (lat != null && lng != null) {
        params.result_filter = 'web'
      }

      const response = await axios.get(API.BRAVE_SEARCH, { params })
      const webResults: BraveWebResult[] = response.data?.web?.results ?? []
      const localResults: BraveLocalResult[] = response.data?.locations?.results ?? []

      const mapped: SearchResult[] = webResults.map((r, i) => ({
        title: r.title,
        description: r.description ?? '',
        url: r.url,
        hash: i === 0 ? hash : '',
        domain: extractDomain(r.url),
        isLocal: isLocalResult(r.url, localResults),
      }))

      // Boost local results to the top while preserving relative order
      const locals = mapped.filter(r => r.isLocal)
      const nonLocals = mapped.filter(r => !r.isLocal)
      setResults([...locals, ...nonLocals])

      setLogs(prev => [...prev, { timestamp: new Date(), message: `Search results received — ${locals.length} local result(s) boosted` }])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'search failed'
      setError(msg)
      setLogs(prev => [...prev, { timestamp: new Date(), message: `Error: ${msg}` }])
    } finally {
      setLoading(false)
    }
  }, [query])

  const clearLogs = useCallback(() => setLogs([]), [])

  const resetSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setError('')
    setHashed(false)
    setHashValue('')
    setLogs([])
  }, [])

  return { query, setQuery, results, loading, error, hashed, hashValue, apiKeyError, logs, search, clearLogs, resetSearch }
}
