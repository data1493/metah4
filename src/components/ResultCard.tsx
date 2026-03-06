import { memo } from 'react'
import type { SearchResult } from '../types'
import LocalBadge from './LocalBadge'

interface Props {
  result: SearchResult
  index: number
}

const ResultCard = memo(function ResultCard({ result, index }: Props) {
  const isEven = index % 2 === 0
  const titleColor = isEven ? 'text-neon-purple' : 'text-neon-gold'
  const titleHoverColor = isEven ? 'hover:text-neon-gold' : 'hover:text-neon-purple'
  const pulseBorder = isEven ? 'pulse-border-gold' : 'pulse-border-purple'

  return (
    <article
      role="listitem"
      className={`card animate-fade-in ${pulseBorder} p-6`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Domain line with optional local badge */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-neon-gold/50 text-xs font-mono truncate">{result.domain}</span>
        {result.isLocal && <LocalBadge />}
      </div>
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${titleColor} font-bold text-lg ${titleHoverColor} transition-colors duration-200 block mb-2 break-words leading-tight`}
      >
        {result.title}
      </a>
      <p className="text-gray-200 text-base leading-relaxed">{result.description}</p>
    </article>
  )
})

export default ResultCard
