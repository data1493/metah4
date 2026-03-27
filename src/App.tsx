import React, { useState, useCallback, useRef } from 'react'
import axios from 'axios'
import { useBodyScrollLock } from './hooks/useBodyScrollLock'
import { timezoneToCountry } from './utils/timezoneToCountry'
import { encryptQuery } from './utils/crypto'
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
import PremiumBadge from './components/PremiumBadge'

const DevColorPicker = import.meta.env.DEV
  ? React.lazy(() => import('./components/DevTools').then(m => ({ default: m.DevColorPicker })))
  : null
const DevFontWorkshop = import.meta.env.DEV
  ? React.lazy(() => import('./components/DevTools').then(m => ({ default: m.DevFontWorkshop })))
  : null

type ViewMode = 'home' | 'results'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [imageResults, setImageResults] = useState<BraveImageResult[]>([])
  const imageLoadingRef = useRef(false)
  const imageSeenUrlsRef = useRef<Set<string>>(new Set())
  const pexelsPageRef = useRef(1)
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
  const [hasSearched, setHasSearched] = useState(false)
  const [isPremium, setIsPremium] = useState(import.meta.env.VITE_PREMIUM_ENABLED === 'true')
  const lastSearchTimeRef = useRef<number>(0)

  // Restore state from URL on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    const tab = params.get('tab') as SearchTab | null
    const page = parseInt(params.get('page') ?? '1', 10)
    if (q) {
      setQuery(q)
      if (tab && ['all', 'images', 'videos', 'news'].includes(tab)) setActiveTab(tab)
      if (!isNaN(page) && page >= 1) setCurrentPage(page)
    }
  }, [])

  useBodyScrollLock(showProofModal || showLogsModal)

  const handleSearch = useCallback(async (tab: SearchTab = activeTab, page: number = currentPage) => {
    if (!query.trim()) return

    // 800ms debounce to prevent API spam
    const now = Date.now()
    if (now - lastSearchTimeRef.current < 800) return
    lastSearchTimeRef.current = now

    setLoading(true)
    setError('')

    const effectiveQuery = locationEnabled && userCity
      ? `${query.trim()} near ${userCity}`
      : query.trim()

    // Brave web search offset is page-based (skip N pages), max 9
    const offset = page - 1
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
      // Premium path: encrypt query and POST to server-side decryption endpoint
      if (isPremium) {
        const encrypted = await encryptQuery(effectiveQuery)
        const body = {
          ...encrypted,
          tab,
          count: API.RESULTS_PER_PAGE,
          offset,
          ...(locationEnabled && userCountry ? { country: userCountry } : {}),
        }
        const res = await axios.post('/api/chimp/search', body)
        if (tab === 'all') {
          const mapped: SearchResult[] = (res.data?.web?.results ?? []).map((r: any) => ({
            title: r.title || 'No title',
            description: r.description || 'No description',
            url: r.url || '#',
            hash: '',
            domain: r.url ? new URL(r.url).hostname.replace(/^www\./, '') : '',
            isLocal: false,
          }))
          setResults(mapped)
          setLogs(prev => [...prev, { timestamp: new Date(), message: `[encrypted] ${mapped.length} web result(s) received` }])
        } else if (tab === 'images') {
          setImageResults(res.data?.results ?? [])
        } else if (tab === 'videos') {
          setVideoResults(res.data?.results ?? [])
        } else if (tab === 'news') {
          setNewsResults(res.data?.results ?? [])
        }
        return
      }

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
        imageLoadingRef.current = false
        imageSeenUrlsRef.current = new Set()
        pexelsPageRef.current = 1
        setImageHasMore(true)
        setImageLoadingMore(false)
        const [braveRes, pexelsRes] = await Promise.allSettled([
          axios.get(API.BRAVE_IMAGES, { params: { ...baseParams, count: API.IMAGES_COUNT, offset: 0 } }),
          axios.get(API.PEXELS, { params: { query: effectiveQuery, per_page: API.PEXELS_PER_PAGE, page: 1 } }),
        ])
        const braveImgs: BraveImageResult[] = braveRes.status === 'fulfilled' ? (braveRes.value.data?.results ?? []) : []
        const pexelsPhotos: any[] = pexelsRes.status === 'fulfilled' ? (pexelsRes.value.data?.photos ?? []) : []
        const pexelsImgs: BraveImageResult[] = pexelsPhotos.map((p: any) => ({
          title: p.alt || p.photographer || 'Photo',
          url: p.url,
          source: 'pexels.com',
          thumbnail: { src: p.src.medium, width: p.width, height: p.height },
          properties: { url: p.src.large2x, width: p.width, height: p.height },
        }))
        const merged = [...braveImgs, ...pexelsImgs]
        merged.forEach(r => imageSeenUrlsRef.current.add(r.url))
        setImageResults(merged)
        pexelsPageRef.current = 2
        const pexelsTotalPages = pexelsRes.status === 'fulfilled'
          ? Math.ceil((pexelsRes.value.data?.total_results ?? 0) / API.PEXELS_PER_PAGE)
          : 0
        setImageHasMore(pexelsTotalPages > 1)
        setLogs(prev => [...prev, { timestamp: new Date(), message: `${merged.length} image result(s) received` }])
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
      setHasSearched(true)
      setViewMode('results')
      window.history.pushState(
        {},
        '',
        `?q=${encodeURIComponent(query.trim())}&tab=${tab}&page=${page}`
      )
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
    try {
      const res = await axios.get(API.PEXELS, {
        params: { query: effectiveQuery, per_page: API.PEXELS_PER_PAGE, page: pexelsPageRef.current },
      })
      const photos: any[] = res.data?.photos ?? []
      const imgs: BraveImageResult[] = photos.map((p: any) => ({
        title: p.alt || p.photographer || 'Photo',
        url: p.url,
        source: 'pexels.com',
        thumbnail: { src: p.src.medium, width: p.width, height: p.height },
        properties: { url: p.src.large2x, width: p.width, height: p.height },
      }))
      const fresh = imgs.filter(r => !imageSeenUrlsRef.current.has(r.url))
      fresh.forEach(r => imageSeenUrlsRef.current.add(r.url))
      if (fresh.length > 0) setImageResults(prev => [...prev, ...fresh])
      pexelsPageRef.current += 1
      const totalPages = Math.ceil((res.data?.total_results ?? 0) / API.PEXELS_PER_PAGE)
      if (pexelsPageRef.current > totalPages || fresh.length === 0) setImageHasMore(false)
      setLogs(prev => [...prev, { timestamp: new Date(), message: `+${fresh.length} more image(s) loaded` }])
    } catch {
      // silent
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
    imageLoadingRef.current = false
    imageSeenUrlsRef.current = new Set()
    pexelsPageRef.current = 1
    setImageHasMore(true)
    setImageLoadingMore(false)
    setHasSearched(false)
  }, [])

  const handleGoHome = useCallback(() => {
    resetSearch()
    setViewMode('home')
    setActiveTab('all')
    window.history.pushState({}, '', '/')
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
      (err) => {
        if (err.code === err.PERMISSION_DENIED || err.code === 1) {
          // Geolocation blocked (HTTP or user denied) — fall back to timezone
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
          const country = timezoneToCountry(tz)
          if (country) {
            setUserCountry(country)
            setUserCity(null)
            setLocationEnabled(true)
            setLocationError('')
          } else {
            setLocationError('Location unavailable — enable HTTPS or grant permission')
          }
        } else {
          setLocationError('Location unavailable')
        }
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
            {/* Activity logs + premium toggle */}
            <div className="flex items-center justify-between mb-3">
              <PremiumBadge enabled={isPremium} onToggle={() => setIsPremium(p => !p)} />
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
              hasSearched={hasSearched}
            />
          </main>
        </>
      )}

      <Modal open={showProofModal} onClose={handleCloseProof} ariaLabel="Privacy Proof">
        <PrivacyProofModalContent />
      </Modal>

      <Modal open={showLogsModal} onClose={handleCloseLogs} ariaLabel="Activity Logs">
        <ActivityLogsModalContent logs={logs} onNukeLogs={handleNukeLogs} />
      </Modal>

      {import.meta.env.DEV && DevColorPicker && DevFontWorkshop && (
        <React.Suspense fallback={null}>
          <DevColorPicker />
          <DevFontWorkshop />
        </React.Suspense>
      )}

      <footer className="fixed bottom-0 left-0 right-0 bg-deep-black/95 backdrop-blur-sm border-t border-zinc-800 py-2 z-20">
        <div className="flex items-center justify-center gap-3 text-xs">
          <span className="text-zinc-500">Powered by Brave Search</span>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-500">Protected by NordVPN</span>
          <span className="text-zinc-700">·</span>
          <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  )
}

export default App
