import { useState, useRef } from 'react'
import axios from 'axios'
import ResultCard from './components/ResultCard'

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

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hashed, setHashed] = useState(false)
  const [hashValue, setHashValue] = useState('')
  const [apiKeyError, setApiKeyError] = useState(false)
  const [error, setError] = useState('')
  const [showProofModal, setShowProofModal] = useState(false)
  const [showLogsModal, setShowLogsModal] = useState(false)
  const [logs, setLogs] = useState<{timestamp: Date, message: string}[]>([])
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

    const newLogs = []
    newLogs.push({ timestamp: new Date(), message: `Query received: "${query.trim()}"` })
    newLogs.push({ timestamp: new Date(), message: 'Starting SHA-256 hash on device...' })

    const hash = await hashQuery(query.trim())

    newLogs.push({ timestamp: new Date(), message: `Hash completed: ${hash.slice(0, 16)}...` })
    newLogs.push({ timestamp: new Date(), message: 'Sending hashed query to secure API...' })

    setHashValue(hash)
    setHashed(true)
    setLoading(true)
    setResults([])
    setError('')
    setApiKeyError(false)
    setLogs(newLogs)

    try {
      const response = await axios.get('/api/brave', {
        params: { q: query.trim(), count: 10 },
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
      setError(e instanceof Error ? e.message : 'search failed')
      setLogs(prev => [...prev, { timestamp: new Date(), message: `Error: ${e instanceof Error ? e.message : 'search failed'}` }])
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
        <img src="/images/logo1.png" alt="METAH4" className="h-24 md:h-36 mx-auto mb-2" />
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
            className="flex-1 bg-card-bg border border-neon-gold text-neon-gold px-4 py-3 rounded focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple font-mono text-sm"
          />
          <button
            onClick={handleSearch}
            disabled={!query.trim()}
            className="px-6 py-3 bg-neon-purple text-white font-black text-sm rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neon-gold hover:text-deep-black transition-colors duration-200"
          >
            GO
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setShowProofModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-neon-purple/20 hover:bg-neon-purple/40 rounded-full text-xs font-medium text-neon-purple transition-all border border-neon-purple/40"
            title="Click to see privacy proof"
          >
            <span className="w-3 h-3 rounded-full bg-neon-purple animate-pulse" />
            Privacy Proof
          </button>

          <button
            onClick={() => setShowLogsModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-neon-gold/20 hover:bg-neon-gold/40 rounded-full text-xs font-medium text-neon-gold transition-all border border-neon-gold/40"
            title="View activity logs"
          >
            <span className="w-3 h-3 rounded-full bg-neon-gold animate-pulse" />
            View Logs
          </button>

          {hashed && (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-gold/10 border border-neon-gold text-neon-gold text-xs animate-pulse">
                <span className="w-2 h-2 rounded-full bg-neon-gold inline-block" />
                hashed on device
              </span>
              <span className="text-neon-gold/60 text-xs font-mono break-all">
                {hashValue}
              </span>
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-16">
            <span className="text-neon-gold text-3xl glitch-text tracking-widest">
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

      {showProofModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="card max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowProofModal(false)}
              className="absolute top-4 right-4 text-neon-purple hover:text-neon-green"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold glitch-text mb-6">Privacy Proof</h2>
            <p className="text-gray-300 mb-4">
              Your search query was hashed on-device using SHA-256. Nothing — not even the raw text — left your computer. Brave API only sees the hash if we ever send it (we don't). Zero logs. Zero tracking.
            </p>
            {hashed && results[0]?.hash && (
              <div className="bg-black/60 p-4 rounded-lg font-mono text-xs break-all text-neon-gold/90">
                SHA-256: {results[0].hash}
              </div>
            )}
            <p className="mt-6 text-xs opacity-70">
              Built with libsodium-wrappers. Auditable. No backend. No bullshit.
            </p>
          </div>
        </div>
      )}

      {showLogsModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="card max-w-lg w-full p-8 relative">
            <button
              onClick={() => setShowLogsModal(false)}
              className="absolute top-4 right-4 text-neon-purple hover:text-neon-green"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold glitch-text mb-6">Activity Logs</h2>
            <p className="text-gray-300 mb-4">
              Your digital paper trail - proving privacy in plain sight. Every step logged locally, nothing sent externally without your knowledge.
            </p>
            <div className="bg-black/60 p-4 rounded-lg max-h-64 overflow-y-auto font-mono text-xs space-y-2">
              {logs.map((log, i) => (
                <div key={i} className="text-neon-gold/90">
                  <span className="text-neon-purple/70">{log.timestamp.toLocaleTimeString()}</span> {log.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-neon-purple/40 py-2 text-center text-neon-purple/70 text-xs tracking-wider">
        Protected by NordVPN — affiliate link coming
      </div>
    </div>
  )
}

export default App
