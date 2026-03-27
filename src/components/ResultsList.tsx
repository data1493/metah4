import { memo, useRef, useEffect, useState, lazy, Suspense } from 'react'
import type { SearchResult, BraveImageResult, BraveVideoResult, BraveNewsResult, NominatimResult, SearchTab } from '../types'
import ResultCard from './ResultCard'
import ImageResultCard from './ImageResultCard'
import VideoResultCard from './VideoResultCard'
import NewsResultCard from './NewsResultCard'
import SkeletonCard from './SkeletonCard'
import ImagePreviewPanel from './ImagePreviewPanel'

const MapView = lazy(() => import('./MapView'))

function ImageResultsSection({ imageResults, imageLoadingMore, imageHasMore, onLoadMoreImages, hasSearched }: {
  imageResults: BraveImageResult[]
  imageLoadingMore: boolean
  imageHasMore: boolean
  onLoadMoreImages: () => void
  hasSearched: boolean
}) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!imageHasMore) return
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMoreImages()
      },
      { rootMargin: '400px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [imageHasMore, onLoadMoreImages, imageResults.length])

  // Reset selection on new search (when results cleared)
  useEffect(() => {
    setSelectedIndex(null)
  }, [imageResults.length === 0])

  // Pre-load more when nearing the end via panel navigation
  const handleNext = () => {
    if (selectedIndex === null) return
    const next = selectedIndex + 1
    if (next >= imageResults.length - 3) onLoadMoreImages()
    if (next < imageResults.length) setSelectedIndex(next)
  }

  const handlePrev = () => {
    if (selectedIndex === null || selectedIndex === 0) return
    setSelectedIndex(selectedIndex - 1)
  }

  if (imageResults.length === 0) {
    return <div className="text-center py-8 text-zinc-500 text-sm">{hasSearched ? 'No images found. Try a different search.' : 'Search to see image results.'}</div>
  }

  const panelOpen = selectedIndex !== null

  return (
    <div className={panelOpen ? 'flex gap-4 items-start' : undefined}>
      {/* Grid */}
      <div className="flex-1 min-w-0">
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3" role="list" aria-label="Image results">
          {imageResults.map((r, i) => (
            <div key={`${r.url}-${i}`} className="break-inside-avoid mb-3">
              <ImageResultCard
                result={r}
                index={i}
                onSelect={() => setSelectedIndex(i === selectedIndex ? null : i)}
                isSelected={i === selectedIndex}
              />
            </div>
          ))}
        </div>
        {imageLoadingMore && (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 rounded-full border-2 border-neon-purple border-t-transparent animate-spin" aria-label="Loading more images" />
          </div>
        )}
        {imageHasMore && (
          <div ref={sentinelRef} className="h-16" aria-hidden="true" />
        )}
        {!imageHasMore && (
          <p className="text-center py-6 text-zinc-600 text-xs">All results loaded</p>
        )}
        <p className="text-center py-2 text-zinc-600 text-xs">
          Photos provided by{' '}
          <a
            href="https://www.pexels.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-400"
          >
            Pexels
          </a>
        </p>
      </div>

      {/* Preview panel */}
      {panelOpen && selectedIndex !== null && (
        <ImagePreviewPanel
          result={imageResults[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < imageResults.length - 1}
        />
      )}
    </div>
  )
}

interface ResultsListProps {
  activeTab: SearchTab
  results: SearchResult[]
  imageResults: BraveImageResult[]
  videoResults: BraveVideoResult[]
  newsResults: BraveNewsResult[]
  mapResults: NominatimResult[]
  userLat: number | null
  userLon: number | null
  loading: boolean
  error: string
  currentPage: number
  onPageChange: (page: number) => void
  imageLoadingMore: boolean
  imageHasMore: boolean
  onLoadMoreImages: () => void
  hasSearched: boolean
}

const ResultsList = memo(function ResultsList({ activeTab, results, imageResults, videoResults, newsResults, mapResults, userLat, userLon, loading, error, currentPage, onPageChange, imageLoadingMore, imageHasMore, onLoadMoreImages, hasSearched }: ResultsListProps) {
  if (loading) {
    return (
      <div className="space-y-4" role="status" aria-live="polite" aria-label="Loading search results">
        {[0, 1, 2, 3].map(i => (
          <SkeletonCard key={i} index={i} />
        ))}
        <span className="sr-only">Loading search results...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-400 text-sm border border-red-400/30 rounded p-4" role="alert">
        error: {error}
      </div>
    )
  }

  if (activeTab === 'images') {
    return (
      <ImageResultsSection
        imageResults={imageResults}
        imageLoadingMore={imageLoadingMore}
        imageHasMore={imageHasMore}
        onLoadMoreImages={onLoadMoreImages}
        hasSearched={hasSearched}
      />
    )
  }

  if (activeTab === 'videos') {
    if (videoResults.length === 0) {
      return <div className="text-center py-8 text-zinc-500 text-sm">{hasSearched ? 'No videos found. Try a different search.' : 'Search to see video results.'}</div>
    }
    return (
      <div className="space-y-4" role="list" aria-label="Video results">
        {videoResults.map((r, i) => (
          <VideoResultCard key={`${r.url}-${i}`} result={r} index={i} />
        ))}
      </div>
    )
  }

  if (activeTab === 'news') {
    if (newsResults.length === 0) {
      return <div className="text-center py-8 text-zinc-500 text-sm">{hasSearched ? 'No news found. Try a different search.' : 'Search to see news results.'}</div>
    }
    return (
      <div className="space-y-4" role="list" aria-label="News results">
        {newsResults.map((r, i) => (
          <NewsResultCard key={`${r.url}-${i}`} result={r} index={i} />
        ))}
      </div>
    )
  }

  if (activeTab === 'maps') {
    return (
      <Suspense fallback={<div className="text-center py-8 text-zinc-500 text-sm">Loading map...</div>}>
        <MapView results={mapResults} hasSearched={hasSearched} userLat={userLat} userLon={userLon} />
      </Suspense>
    )
  }

  // 'all' tab (web results)
  if (results.length === 0) {
    return <div className="text-center py-8 text-zinc-500 text-sm">{hasSearched ? 'No results found. Try a different search.' : 'Search to explore the web.'}</div>
  }

  return (
    <>
      <div className="space-y-6 relative" role="list" aria-label="Search results">
        {results.map((r, i) => (
          <ResultCard key={`${r.url}-${i}`} result={r} index={i} />
        ))}
      </div>

      <nav aria-label="Search result pages" className="flex items-center justify-center gap-2 mt-10 mb-8">
        <span className="text-neon-purple/60 text-sm mr-2">Page</span>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Page ${page}`}
            className={`w-8 h-8 flex items-center justify-center rounded text-sm font-semibold transition-colors ${
              page === currentPage
                ? 'bg-neon-purple text-white'
                : 'bg-card-bg border border-zinc-700 text-zinc-400 hover:border-neon-purple/50 hover:text-zinc-200'
            }`}
          >
            {page}
          </button>
        ))}
      </nav>
    </>
  )
})

export default ResultsList
