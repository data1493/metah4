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
        <span className="text-zinc-500 text-xs font-mono truncate">{result.domain}</span>
        {result.isLocal && <LocalBadge />}
      </div>

      {/* Title link */}
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 font-semibold text-lg hover:text-blue-300 transition-colors duration-200 block mb-2 break-words leading-snug"
      >
        {result.title}
      </a>

      {/* Description */}
      <p className="text-zinc-400 text-sm leading-relaxed">{result.description}</p>
    </article>
  )
})

export default ResultCard
