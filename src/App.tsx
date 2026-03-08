import React, { useState, useCallback } from 'react'
import axios from 'axios'
import { hashQuery } from './hooks/useSearch'
import { useBodyScrollLock } from './hooks/useBodyScrollLock'
import type { SearchTab, SearchResult, LogEntry } from './types'
import HomePage from './components/HomePage'
import Header from './components/Header'
import SearchTabs from './components/SearchTabs'
import ResultsList from './components/ResultsList'
import Modal from './components/Modal'
import PrivacyProofModalContent from './components/PrivacyProofModalContent'
import ActivityLogsModalContent from './components/ActivityLogsModalContent'
import BackgroundEffects from './components/BackgroundEffects'

const DevColorPicker = React.lazy(() => import('./components/DevTools').then(m => ({ default: m.DevColorPicker })))
const DevFontWorkshop = React.lazy(() => import('./components/DevTools').then(m => ({ default: m.DevFontWorkshop })))

const PROXY_URL = 'https://metah4-backend.metah4-backend.workers.dev/search'

type ViewMode = 'home' | 'results'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hashed, setHashed] = useState(false)
  const [hashValue, setHashValue] = useState('')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('home')
  const [activeTab, setActiveTab] = useState<SearchTab>('all')
  const [showProofModal, setShowProofModal] = useState(false)
  const [showLogsModal, setShowLogsModal] = useState(false)

  useBodyScrollLock(showProofModal || showLogsModal)

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return

    const newLogs: LogEntry[] = [
      { timestamp: new Date(), message: `Query received: "${query.trim()}"` },
      { timestamp: new Date(), message: 'Starting SHA-256 hash on device...' },
    ]

    const queryHash = await hashQuery(query.trim())

    newLogs.push({ timestamp: new Date(), message: `Hash completed: ${queryHash.slice(0, 16)}...` })
    newLogs.push({ timestamp: new Date(), message: 'Sending hashed query to proxy...' })

    setHashValue(queryHash)
    setHashed(true)
    setLoading(true)
    setResults([])
    setError('')
    setLogs(prev => [...prev, ...newLogs])

    try {
      const res = await axios.get(`${PROXY_URL}?q=${encodeURIComponent(queryHash)}`)
      console.log('Proxy response status:', res.status)
      console.log('Proxy response data:', res.data)

      if (res.data?.web?.results?.length > 0) {
        const mapped: SearchResult[] = res.data.web.results.map((r: any) => ({
          title: r.title || 'No title',
          description: r.description || 'No description',
          url: r.url || '#',
          hash: queryHash,
          domain: r.url ? new URL(r.url).hostname.replace(/^www\./, '') : '',
          isLocal: false,
        }))
        setResults(mapped)
        setLogs(prev => [...prev, { timestamp: new Date(), message: `Search results received — ${mapped.length} result(s)` }])
      } else {
        setResults([])
        setError('No results returned from proxy')
        setLogs(prev => [...prev, { timestamp: new Date(), message: 'No results returned from proxy' }])
      }
    } catch (err: any) {
      console.error('Search error:', err)
      setResults([])
      setError('Proxy / network error – check console')
      setLogs(prev => [...prev, { timestamp: new Date(), message: `Error: ${err?.message || 'Proxy / network error'}` }])
    } finally {
      setLoading(false)
      setViewMode('results')
    }
  }, [query])

  const resetSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setError('')
    setHashed(false)
    setHashValue('')
    setLogs([])
  }, [])

  const handleGoHome = useCallback(() => {
    resetSearch()
    setViewMode('home')
    setActiveTab('all')
  }, [resetSearch])

  const handleShowLogs = useCallback(() => setShowLogsModal(true), [])
  const handleCloseLogs = useCallback(() => setShowLogsModal(false), [])
  const handleNukeLogs = useCallback(() => {
    resetSearch()
    setShowLogsModal(false)
    setViewMode('home')
  }, [resetSearch])

  const handleShowProof = useCallback(() => setShowProofModal(true), [])
  const handleCloseProof = useCallback(() => setShowProofModal(false), [])

  return (
    <div className="min-h-screen bg-deep-black flex flex-col relative" style={{ overflowX: 'clip' }}>
      <BackgroundEffects variant={viewMode} />

      {viewMode === 'home' ? (
        <main className="flex-1 relative z-10">
          <HomePage
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            disabled={!query.trim()}
            hashed={hashed}
            hashValue={hashValue}
            onShowProof={handleShowProof}
          />
        </main>
      ) : (
        <>
          <Header
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            disabled={!query.trim()}
            onLogoClick={handleGoHome}
            hashed={hashed}
            hashValue={hashValue}
            onShowProof={handleShowProof}
          />
          <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 max-w-3xl mx-auto w-full px-4 pt-4 relative z-10 pb-16">
            {/* Activity logs button */}
            <div className="flex justify-end mb-3">
              <button
                onClick={handleShowLogs}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-full text-xs font-medium text-zinc-400 transition-all border border-zinc-700"
                title="View activity logs"
              >
                <span className="w-2 h-2 rounded-full bg-zinc-500" aria-hidden="true" />
                Logs
              </button>
            </div>
            {activeTab === 'all' ? (
              <>
                <ResultsList results={results} loading={loading} error={error} />
                {hashed && !loading && !error && results.length === 0 && (
                  <div className="text-center py-8 text-zinc-500 text-sm" role="status">
                    No results found. Try another search.
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 text-zinc-500 text-sm">
                <p className="text-lg mb-2">Coming soon</p>
                <p>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} search is under development</p>
              </div>
            )}
          </main>
        </>
      )}

      <Modal open={showProofModal} onClose={handleCloseProof} ariaLabel="Privacy Proof">
        <PrivacyProofModalContent hashed={hashed} firstResult={results[0]} />
      </Modal>

      <Modal open={showLogsModal} onClose={handleCloseLogs} ariaLabel="Activity Logs">
        <ActivityLogsModalContent logs={logs} onNukeLogs={handleNukeLogs} />
      </Modal>

      <React.Suspense fallback={null}>
        <DevColorPicker />
        <DevFontWorkshop />
      </React.Suspense>

      <footer className="fixed bottom-0 left-0 right-0 bg-deep-black/95 backdrop-blur-sm border-t border-zinc-800 py-2 z-20">
        <div className="flex items-center justify-center gap-3 text-xs">
          <span className="text-zinc-500">Powered by Brave Search</span>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-500">Protected by NordVPN</span>
        </div>
      </footer>
    </div>
  )
}

export default App
