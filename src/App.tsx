import React, { useState, useCallback } from 'react'
import axios from 'axios'
import { useBodyScrollLock } from './hooks/useBodyScrollLock'
import { timezoneToCountry } from './utils/timezoneToCountry'
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

type ViewMode = 'home' | 'results'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('home')
  const [activeTab, setActiveTab] = useState<SearchTab>('all')
  const [showProofModal, setShowProofModal] = useState(false)
  const [showLogsModal, setShowLogsModal] = useState(false)
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [userCountry, setUserCountry] = useState<string | null>(null)
  const [userCity, setUserCity] = useState<string | null>(null)
  const [locationError, setLocationError] = useState('')

  useBodyScrollLock(showProofModal || showLogsModal)

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return

    setLoading(true)
    setResults([])
    setError('')

    const newLogs: LogEntry[] = [
      { timestamp: new Date(), message: `Query received: "${query.trim()}"` },
      { timestamp: new Date(), message: 'Sending query to search API...' },
    ]
    setLogs(prev => [...prev, ...newLogs])

    try {
      const params: Record<string, string | number> = { q: query.trim(), count: 10 }
      if (locationEnabled && userCountry) params.country = userCountry
      if (locationEnabled && userCity) params.city = userCity
      const res = await axios.get('/api/brave', { params })

      if (res.data?.web?.results?.length > 0) {
        const mapped: SearchResult[] = res.data.web.results.map((r: any) => ({
          title: r.title || 'No title',
          description: r.description || 'No description',
          url: r.url || '#',
          hash: '',
          domain: r.url ? new URL(r.url).hostname.replace(/^www\./, '') : '',
          isLocal: false,
        }))
        setResults(mapped)
        setLogs(prev => [...prev, { timestamp: new Date(), message: `Search results received — ${mapped.length} result(s)` }])
      } else {
        setResults([])
        setError('No results returned')
        setLogs(prev => [...prev, { timestamp: new Date(), message: 'No results returned' }])
      }
    } catch (err: any) {
      setResults([])
      setError(`Search error: ${err.message}`)
      setLogs(prev => [...prev, { timestamp: new Date(), message: `Error: ${err?.message || 'Network error'}` }])
    } finally {
      setLoading(false)
      setViewMode('results')
    }
  }, [query, locationEnabled, userCountry, userCity])

  const resetSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setError('')
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

  const handleToggleLocation = useCallback(() => {
    if (locationEnabled) {
      setLocationEnabled(false)
      setUserCountry(null)
      setUserCity(null)
      setLocationError('')
      return
    }
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported by this browser')
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        const country = timezoneToCountry(tz)
        setUserCountry(country)
        try {
          const geocodeRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`,
            { headers: { 'Accept-Language': 'en' } }
          )
          const data = await geocodeRes.json()
          const city = data.address?.city || data.address?.town || data.address?.county || null
          const state = data.address?.state_code || data.address?.state || null
          const cityLabel = [city, state].filter(Boolean).join(', ')
          setUserCity(cityLabel || null)
        } catch {
          setUserCity(null)
        }
        setLocationEnabled(true)
        setLocationError('')
      },
      () => {
        setLocationError('Location permission denied')
      }
    )
  }, [locationEnabled])

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
            onShowProof={handleShowProof}
            locationEnabled={locationEnabled}
            locationLabel={userCity ?? userCountry}
            locationError={locationError}
            onToggleLocation={handleToggleLocation}
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
            onShowProof={handleShowProof}
            locationEnabled={locationEnabled}
            locationLabel={userCity ?? userCountry}
            onToggleLocation={handleToggleLocation}
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
                {!loading && !error && results.length === 0 && (
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
        <PrivacyProofModalContent firstResult={results[0]} />
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
