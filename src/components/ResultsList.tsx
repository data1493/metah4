import { memo } from 'react'
import type { SearchResult } from '../types'
import ResultCard from './ResultCard'
import SkeletonCard from './SkeletonCard'

interface ResultsListProps {
  results: SearchResult[]
  loading: boolean
  error: string
  apiKeyError: boolean
  hashed: boolean
}

const ResultsList = memo(function ResultsList({ results, loading, error, apiKeyError, hashed }: ResultsListProps) {
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

  if (!apiKeyError && hashed && results.length === 0) {
    return (
      <div className="text-center py-10 text-neon-purple/60 text-sm tracking-wide" role="status">
        no results found
      </div>
    )
  }

  if (results.length === 0) return null

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
          <span
            key={page}
            aria-current={page === 1 ? 'page' : undefined}
            className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold ${
              page === 1
                ? 'bg-neon-purple text-white'
                : 'bg-card-bg border border-neon-gold/40 text-neon-gold/50'
            }`}
          >
            {page}
          </span>
        ))}
      </nav>
    </>
  )
})

export default ResultsList
