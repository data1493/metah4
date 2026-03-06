import { memo } from 'react'
import type { SearchResult } from '../types'
import LocalBadge from './LocalBadge'

interface Props {
  result: SearchResult
  index: number
}

const ResultCard = memo(function ResultCard({ result, index }: Props) {
  return (
    <article
      role="listitem"
      className="card animate-bounce-in p-5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Domain line with optional local badge */}
      <div className="flex items-center gap-2 mb-1.5">
        <img
          src={`https://www.google.com/s2/favicons?domain=${result.domain}&sz=16`}
          alt=""
          className="w-4 h-4 rounded-sm"
          loading="lazy"
        />
        <span className="text-neon-gold/50 text-xs font-mono truncate">{result.domain}</span>
        {result.isLocal && <LocalBadge />}
      </div>

      {/* Title link */}
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neon-purple font-bold text-lg hover:text-neon-gold transition-colors duration-200 block mb-2 break-words leading-tight"
      >
        {result.title}
      </a>

      {/* Description */}
      <p className="text-gray-300 text-sm leading-relaxed">{result.description}</p>
    </article>
  )
})

export default ResultCard
