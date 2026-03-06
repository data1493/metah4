import React, { useState, useCallback } from 'react'
import { useSearch } from './hooks/useSearch'
import { useBodyScrollLock } from './hooks/useBodyScrollLock'
import HomePage from './components/HomePage'
import Header from './components/Header'
import StatusBar from './components/StatusBar'
import ResultsList from './components/ResultsList'
import Modal from './components/Modal'
import PrivacyProofModalContent from './components/PrivacyProofModalContent'
import ActivityLogsModalContent from './components/ActivityLogsModalContent'
import BackgroundEffects from './components/BackgroundEffects'

const DevColorPicker = React.lazy(() => import('./components/DevTools').then(m => ({ default: m.DevColorPicker })))
const DevFontWorkshop = React.lazy(() => import('./components/DevTools').then(m => ({ default: m.DevFontWorkshop })))

type ViewMode = 'home' | 'results'

function App() {
  const { query, setQuery, results, loading, error, hashed, hashValue, apiKeyError, logs, search, resetSearch } = useSearch()
  const [viewMode, setViewMode] = useState<ViewMode>('home')
  const [showProofModal, setShowProofModal] = useState(false)
  const [showLogsModal, setShowLogsModal] = useState(false)

  useBodyScrollLock(showProofModal || showLogsModal)

  const handleSearch = useCallback(async () => {
    await search()
    setViewMode('results')
  }, [search])

  const handleGoHome = useCallback(() => {
    resetSearch()
    setViewMode('home')
  }, [resetSearch])

  const handleShowProof = useCallback(() => setShowProofModal(true), [])
  const handleShowLogs = useCallback(() => setShowLogsModal(true), [])
  const handleCloseProof = useCallback(() => setShowProofModal(false), [])
  const handleCloseLogs = useCallback(() => setShowLogsModal(false), [])
  const handleNukeLogs = useCallback(() => {
    resetSearch()
    setShowLogsModal(false)
    setViewMode('home')
  }, [resetSearch])

  return (
    <div className="min-h-screen bg-deep-black flex flex-col relative" style={{ overflowX: 'clip' }}>
      <BackgroundEffects />

      {viewMode === 'home' ? (
        <main className="flex-1 relative z-10">
          <HomePage
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            disabled={!query.trim()}
            apiKeyError={apiKeyError}
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
          <main className="flex-1 max-w-3xl mx-auto w-full px-4 pt-4 relative z-10 pb-16">
            <StatusBar hashed={hashed} hashValue={hashValue} onShowProof={handleShowProof} onShowLogs={handleShowLogs} />
            <ResultsList results={results} loading={loading} error={error} apiKeyError={apiKeyError} hashed={hashed} />
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

      <div className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-neon-purple/40 py-2 text-center text-neon-purple/70 text-xs tracking-wider z-20">
        Protected by NordVPN — affiliate link coming
      </div>
    </div>
  )
}

export default App
