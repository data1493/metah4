import React, { useState, useCallback } from 'react'
import { useSearch } from './hooks/useSearch'
import { useBodyScrollLock } from './hooks/useBodyScrollLock'
import { useGeolocation } from './hooks/useGeolocation'
import type { SearchTab } from './types'
import HomePage from './components/HomePage'
import Header from './components/Header'
import SearchTabs from './components/SearchTabs'
import ResultsList from './components/ResultsList'
import Modal from './components/Modal'
import ActivityLogsModalContent from './components/ActivityLogsModalContent'
import BackgroundEffects from './components/BackgroundEffects'

const DevColorPicker = React.lazy(() => import('./components/DevTools').then(m => ({ default: m.DevColorPicker })))
const DevFontWorkshop = React.lazy(() => import('./components/DevTools').then(m => ({ default: m.DevFontWorkshop })))

type ViewMode = 'home' | 'results'

function App() {
  const { query, setQuery, results, loading, error, logs, search, resetSearch } = useSearch()
  const { lat, lng } = useGeolocation()
  const [viewMode, setViewMode] = useState<ViewMode>('home')
  const [activeTab, setActiveTab] = useState<SearchTab>('all')
  const [showLogsModal, setShowLogsModal] = useState(false)

  useBodyScrollLock(showLogsModal)

  const handleSearch = useCallback(async () => {
    await search(lat, lng)
    setViewMode('results')
  }, [search, lat, lng])

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
              <ResultsList results={results} loading={loading} error={error} />
            ) : (
              <div className="text-center py-16 text-zinc-500 text-sm">
                <p className="text-lg mb-2">Coming soon</p>
                <p>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} search is under development</p>
              </div>
            )}
          </main>
        </>
      )}

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
