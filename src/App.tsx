import { useState, useRef } from 'react'
import axios from 'axios'
import ResultCard from './components/ResultCard'
import Logo from './components/Logo'

interface SearchResult {
  title: string
  description: string
  url: string
  hash: string
}

interface BraveWebResult {
  title: string
  description?: string
  url: string
}

const logoList = [
  '/images/logo1.png',
  '/images/logo2.png',
  // Add more logos here as you add them, e.g., '/images/lakerslogo.png', '/images/camoflaugelogo.png'
]

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hashed, setHashed] = useState(false)
  const [hashValue, setHashValue] = useState('')
  const [apiKeyError, setApiKeyError] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const hashQuery = async (q: string): Promise<string> => {
    const data = new TextEncoder().encode(q)
    const buffer = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const handleSearch = async () => {
    if (!query.trim()) return

    const apiKey = import.meta.env.VITE_BRAVE_SEARCH_API_KEY
    if (!apiKey || apiKey === 'your_brave_api_key_here') {
      setApiKeyError(true)
      return
    }

    const hash = await hashQuery(query.trim())
    setHashValue(hash)
    setHashed(true)
    setLoading(true)
    setResults([])
    setError('')
    setApiKeyError(false)

    try {
      const response = await axios.get('/api/brave', {
        params: { q: query.trim(), count: 10 },
      })
      const webResults: BraveWebResult[] = response.data?.web?.results ?? []
      setResults(
        webResults.map((r) => ({
          title: r.title,
          description: r.description ?? '',
          url: r.url,
          hash,
        }))
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="min-h-screen bg-deep-black flex flex-col font-mono pb-16">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <Logo logos={logoList} />
        <h1 className="text-7xl md:text-9xl font-black text-center text-neon-green glitch-text font-display mb-2 tracking-tight select-none">
          METAH4
        </h1>
        <p className="text-center text-neon-purple text-sm mb-10 tracking-widest uppercase">
          privacy-first search engine
        </p>

        {apiKeyError && (
          <div className="mb-6 px-4 py-3 rounded border border-red-500 bg-red-500/10 text-red-400 text-xs text-center tracking-wide">
            no api key — add VITE_BRAVE_SEARCH_API_KEY to .env and restart the dev server
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="search the underground..."
            className="flex-1 bg-card-bg border border-neon-green text-neon-green px-4 py-3 rounded focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple font-mono text-sm"
          />
          <button
            onClick={handleSearch}
            disabled={!query.trim()}
            className="px-6 py-3 bg-neon-green text-deep-black font-black text-sm rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neon-purple hover:text-white transition-colors duration-200"
          >
            GO
          </button>
        </div>

        {hashed && (
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green text-neon-green text-xs animate-pulse">
              <span className="w-2 h-2 rounded-full bg-neon-green inline-block" />
              hashed on device
            </span>
            <span className="text-neon-gold/60 text-xs font-mono">
              {hashValue.slice(0, 16)}…
            </span>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <span className="text-neon-green text-3xl glitch-text tracking-widest">
              SEARCHING...
            </span>
          </div>
        )}

        {error && (
          <div className="text-center py-6 text-red-400 text-sm border border-red-400/30 rounded p-4">
            error: {error}
          </div>
        )}

        {!loading && !error && !apiKeyError && hashed && results.length === 0 && (
          <div className="text-center py-10 text-neon-purple/60 text-sm tracking-wide">
            no results found
          </div>
        )}

        <div className="space-y-4">
          {results.map((r, i) => (
            <ResultCard key={i} result={r} index={i} />
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-neon-purple/40 py-2 text-center text-neon-purple/70 text-xs tracking-wider">
        Protected by NordVPN — affiliate link coming
      </div>
    </div>
  )
}

export default App
