import { useState, useCallback } from 'react'
import axios from 'axios'
import { API } from '../config'
import type { SearchResult, BraveWebResult, LogEntry } from '../types'

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
  search: () => Promise<void>
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

  const search = useCallback(async () => {
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
      const response = await axios.get(API.BRAVE_SEARCH, {
        params: { q: query.trim(), count: API.RESULTS_PER_PAGE },
      })
      const webResults: BraveWebResult[] = response.data?.web?.results ?? []
      setResults(
        webResults.map((r, i) => ({
          title: r.title,
          description: r.description ?? '',
          url: r.url,
          hash: i === 0 ? hash : '',
        }))
      )
      setLogs(prev => [...prev, { timestamp: new Date(), message: 'Search results received and displayed' }])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'search failed'
      setError(msg)
      setLogs(prev => [...prev, { timestamp: new Date(), message: `Error: ${msg}` }])
    } finally {
      setLoading(false)
    }
  }, [query])

  return { query, setQuery, results, loading, error, hashed, hashValue, apiKeyError, logs, search }
}
