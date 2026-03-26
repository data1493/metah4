import { memo } from 'react'
import type { SearchResult, BraveImageResult, BraveVideoResult, BraveNewsResult, SearchTab } from '../types'
import ResultCard from './ResultCard'
import ImageResultCard from './ImageResultCard'
import VideoResultCard from './VideoResultCard'
import NewsResultCard from './NewsResultCard'
import SkeletonCard from './SkeletonCard'

interface ResultsListProps {
  activeTab: SearchTab
  results: SearchResult[]
  imageResults: BraveImageResult[]
  videoResults: BraveVideoResult[]
  newsResults: BraveNewsResult[]
  loading: boolean
  error: string
  currentPage: number
  onPageChange: (page: number) => void
}

const ResultsList = memo(function ResultsList({ activeTab, results, imageResults, videoResults, newsResults, loading, error, currentPage, onPageChange }: ResultsListProps) {
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
    if (imageResults.length === 0) {
      return <div className="text-center py-8 text-zinc-500 text-sm">No images found. Try another search.</div>
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="list" aria-label="Image results">
        {imageResults.map((r, i) => (
          <ImageResultCard key={`${r.url}-${i}`} result={r} index={i} />
        ))}
      </div>
    )
  }

  if (activeTab === 'videos') {
    if (videoResults.length === 0) {
      return <div className="text-center py-8 text-zinc-500 text-sm">No videos found. Try another search.</div>
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
      return <div className="text-center py-8 text-zinc-500 text-sm">No news found. Try another search.</div>
    }
    return (
      <div className="space-y-4" role="list" aria-label="News results">
        {newsResults.map((r, i) => (
          <NewsResultCard key={`${r.url}-${i}`} result={r} index={i} />
        ))}
      </div>
    )
  }

  // 'all' tab (web results)
  if (results.length === 0) {
    return <div className="text-center py-8 text-zinc-500 text-sm">No results found. Try another search.</div>
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
