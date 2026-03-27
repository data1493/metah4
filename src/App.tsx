import React, { useState, useCallback, useRef } from 'react'
import axios from 'axios'
import { useBodyScrollLock } from './hooks/useBodyScrollLock'
import { timezoneToCountry } from './utils/timezoneToCountry'
import { API } from './config'
import type { SearchTab, SearchResult, BraveImageResult, BraveVideoResult, BraveNewsResult, LogEntry } from './types'
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
  const [imageResults, setImageResults] = useState<BraveImageResult[]>([])
  const imageOffsetRef = useRef(0)
  const imageLoadingRef = useRef(false)
  const imageSeenUrlsRef = useRef<Set<string>>(new Set())
  const [imageHasMore, setImageHasMore] = useState(true)
  const [imageLoadingMore, setImageLoadingMore] = useState(false)
  const [videoResults, setVideoResults] = useState<BraveVideoResult[]>([])
  const [newsResults, setNewsResults] = useState<BraveNewsResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('home')
  const [activeTab, setActiveTab] = useState<SearchTab>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showProofModal, setShowProofModal] = useState(false)
  const [showLogsModal, setShowLogsModal] = useState(false)
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [userCountry, setUserCountry] = useState<string | null>(null)
  const [userCity, setUserCity] = useState<string | null>(null)
  const [locationError, setLocationError] = useState('')

  useBodyScrollLock(showProofModal || showLogsModal)

  const handleSearch = useCallback(async (tab: SearchTab = activeTab, page: number = currentPage) => {
    if (!query.trim()) return

    setLoading(true)
    setError('')

    const effectiveQuery = locationEnabled && userCity
      ? `${query.trim()} near ${userCity}`
      : query.trim()

    const offset = (page - 1) * API.RESULTS_PER_PAGE
    const baseParams: Record<string, string | number> = {
      q: effectiveQuery,
      count: API.RESULTS_PER_PAGE,
      offset,
    }
    if (locationEnabled && userCountry) baseParams.country = userCountry

    const newLogs: LogEntry[] = [
      { timestamp: new Date(), message: `Query received: "${query.trim()}"` },
      { timestamp: new Date(), message: `Searching ${tab} tab...` },
    ]
    setLogs(prev => [...prev, ...newLogs])

    try {
      if (tab === 'all') {
        setResults([])
        const res = await axios.get(API.BRAVE_SEARCH, { params: baseParams })
        const mapped: SearchResult[] = (res.data?.web?.results ?? []).map((r: any) => ({
          title: r.title || 'No title',
          description: r.description || 'No description',
          url: r.url || '#',
          hash: '',
          domain: r.url ? new URL(r.url).hostname.replace(/^www\./, '') : '',
          isLocal: false,
        }))
        setResults(mapped)
        setLogs(prev => [...prev, { timestamp: new Date(), message: `${mapped.length} web result(s) received` }])
        if (mapped.length === 0) setError('No results returned')
      } else if (tab === 'images') {
        setImageResults([])
        imageOffsetRef.current = 0
        imageLoadingRef.current = false
        imageSeenUrlsRef.current = new Set()
        setImageHasMore(true)
        setImageLoadingMore(false)
        const res = await axios.get(API.BRAVE_IMAGES, { params: { ...baseParams, offset: 0 } })
        const imgs: BraveImageResult[] = res.data?.results ?? []
        imgs.forEach(r => imageSeenUrlsRef.current.add(r.url))
        setImageResults(imgs)
        imageOffsetRef.current = imgs.length
        if (imgs.length < API.RESULTS_PER_PAGE) setImageHasMore(false)
        setLogs(prev => [...prev, { timestamp: new Date(), message: `${imgs.length} image result(s) received` }])
      } else if (tab === 'videos') {
        setVideoResults([])
        const res = await axios.get(API.BRAVE_VIDEOS, { params: baseParams })
        const vids: BraveVideoResult[] = res.data?.results ?? []
        setVideoResults(vids)
        setLogs(prev => [...prev, { timestamp: new Date(), message: `${vids.length} video result(s) received` }])
      } else if (tab === 'news') {
        setNewsResults([])
        const res = await axios.get(API.BRAVE_NEWS, { params: baseParams })
        const news: BraveNewsResult[] = res.data?.results ?? []
        setNewsResults(news)
        setLogs(prev => [...prev, { timestamp: new Date(), message: `${news.length} news result(s) received` }])
      }
    } catch (err: any) {
      setError(`Search error: ${err.message}`)
      setLogs(prev => [...prev, { timestamp: new Date(), message: `Error: ${err?.message || 'Network error'}` }])
    } finally {
      setLoading(false)
      setViewMode('results')
    }
  }, [query, activeTab, currentPage, locationEnabled, userCountry, userCity, results.length])

  const handleTabChange = useCallback((tab: SearchTab) => {
    setActiveTab(tab)
    setCurrentPage(1)
    setError('')
    if (viewMode === 'results' && query.trim()) {
      handleSearch(tab, 1)
    }
  }, [viewMode, query, handleSearch])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    handleSearch(activeTab, page)
  }, [activeTab, handleSearch])

  const handleLoadMoreImages = useCallback(async () => {
    if (imageLoadingRef.current || !imageHasMore || !query.trim()) return
    imageLoadingRef.current = true
    setImageLoadingMore(true)
    const effectiveQuery = locationEnabled && userCity
      ? `${query.trim()} near ${userCity}`
      : query.trim()
    const params: Record<string, string | number> = {
      q: effectiveQuery,
      count: API.RESULTS_PER_PAGE,
      offset: imageOffsetRef.current,
    }
    if (locationEnabled && userCountry) params.country = userCountry
    try {
      const res = await axios.get(API.BRAVE_IMAGES, { params })
      const imgs: BraveImageResult[] = res.data?.results ?? []
      const fresh = imgs.filter(r => !imageSeenUrlsRef.current.has(r.url))
      fresh.forEach(r => imageSeenUrlsRef.current.add(r.url))
      if (fresh.length > 0) setImageResults(prev => [...prev, ...fresh])
      imageOffsetRef.current += imgs.length
      if (imgs.length < API.RESULTS_PER_PAGE || fresh.length === 0) setImageHasMore(false)
      setLogs(prev => [...prev, { timestamp: new Date(), message: `+${fresh.length} more image(s) loaded` }])
    } catch {
      // silent — don't overwrite main error state
    } finally {
      imageLoadingRef.current = false
      setImageLoadingMore(false)
    }
  }, [imageHasMore, query, locationEnabled, userCountry, userCity])

  const resetSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setImageResults([])
    setVideoResults([])
    setNewsResults([])
    setError('')
    setLogs([])
    setCurrentPage(1)
    imageOffsetRef.current = 0
    imageLoadingRef.current = false
    imageSeenUrlsRef.current = new Set()
    setImageHasMore(true)
    setImageLoadingMore(false)
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
            onSearch={() => handleSearch()}
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
            onSearch={() => handleSearch()}
            disabled={!query.trim()}
            onLogoClick={handleGoHome}
            onShowProof={handleShowProof}
            locationEnabled={locationEnabled}
            locationLabel={userCity ?? userCountry}
            onToggleLocation={handleToggleLocation}
          />
          <SearchTabs activeTab={activeTab} onTabChange={handleTabChange} />
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
            <ResultsList
              activeTab={activeTab}
              results={results}
              imageResults={imageResults}
              videoResults={videoResults}
              newsResults={newsResults}
              loading={loading}
              error={error}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              imageLoadingMore={imageLoadingMore}
              imageHasMore={imageHasMore}
              onLoadMoreImages={handleLoadMoreImages}
            />
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
