import React, { useState, useCallback } from 'react'
import { useSearch } from './hooks/useSearch'
import { useBodyScrollLock } from './hooks/useBodyScrollLock'
import { THEME } from './config'
import SearchBar from './components/SearchBar'
import StatusBar from './components/StatusBar'
import ResultsList from './components/ResultsList'
import Modal from './components/Modal'
import PrivacyProofModalContent from './components/PrivacyProofModalContent'
import ActivityLogsModalContent from './components/ActivityLogsModalContent'
import BackgroundEffects from './components/BackgroundEffects'

const DevColorPicker = React.lazy(() => import('./components/DevTools').then(m => ({ default: m.DevColorPicker })))
const DevFontWorkshop = React.lazy(() => import('./components/DevTools').then(m => ({ default: m.DevFontWorkshop })))

function App() {
  const { query, setQuery, results, loading, error, hashed, hashValue, apiKeyError, logs, search, resetSearch } = useSearch()
  const [showProofModal, setShowProofModal] = useState(false)
  const [showLogsModal, setShowLogsModal] = useState(false)

  useBodyScrollLock(showProofModal || showLogsModal)

  const handleShowProof = useCallback(() => setShowProofModal(true), [])
  const handleShowLogs = useCallback(() => setShowLogsModal(true), [])
  const handleCloseProof = useCallback(() => setShowProofModal(false), [])
  const handleCloseLogs = useCallback(() => setShowLogsModal(false), [])
  const handleNukeLogs = useCallback(() => {
    resetSearch()
    setShowLogsModal(false)
  }, [resetSearch])

  return (
    <div className="min-h-screen bg-deep-black flex flex-col pb-16 relative" style={{ overflowX: 'clip' }}>
      <BackgroundEffects />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 relative z-10">
        {/* Sticky header — -mx-4 px-4 extends bg to cover glow borders on left/right */}
        <div
          className="sticky top-0 z-20 pt-12 pb-2 -mx-4 px-4"
          style={{ backgroundColor: THEME.deepBlack }}
        >
          <img src="/images/logo1.png" alt="METAH4" className="h-24 md:h-36 mx-auto mb-2" />
          <p className="text-center text-neon-purple text-sm mb-10 tracking-widest uppercase">
            privacy-first search engine
          </p>

          {apiKeyError && (
            <div className="mb-6 px-4 py-3 rounded border border-red-500 bg-red-500/10 text-red-400 text-xs text-center tracking-wide">
              no api key — add VITE_BRAVE_SEARCH_API_KEY to .env and restart the dev server
            </div>
          )}

          <SearchBar query={query} onQueryChange={setQuery} onSearch={search} disabled={!query.trim()} />
          <StatusBar hashed={hashed} hashValue={hashValue} onShowProof={handleShowProof} onShowLogs={handleShowLogs} />
        </div>

        <ResultsList results={results} loading={loading} error={error} apiKeyError={apiKeyError} hashed={hashed} />
      </main>

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

      <div className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-neon-purple/40 py-2 text-center text-neon-purple/70 text-xs tracking-wider">
        Protected by NordVPN — affiliate link coming
      </div>
    </div>
  )
}

export default App
