import { memo } from 'react'
import type { BraveNewsResult } from '../types'

interface Props {
  result: BraveNewsResult
  index: number
}

const NewsResultCard = memo(function NewsResultCard({ result, index }: Props) {
  const sourceName = result.source?.name ?? result.meta_url?.netloc ?? ''

  return (
    <article
      className="card animate-bounce-in flex gap-4 p-4"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {sourceName && (
            <span className="text-zinc-500 text-xs font-mono truncate">{sourceName}</span>
          )}
          {result.age && (
            <>
              <span className="text-zinc-700 text-xs">·</span>
              <span className="text-zinc-600 text-xs flex-shrink-0">{result.age}</span>
            </>
          )}
        </div>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 font-semibold text-base hover:text-blue-300 transition-colors block mb-1 leading-snug break-words"
        >
          {result.title}
        </a>
        {result.description && (
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">{result.description}</p>
        )}
      </div>

      {/* Thumbnail */}
      {result.thumbnail?.src && (
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 w-24 h-20 rounded overflow-hidden bg-zinc-800 block"
          tabIndex={-1}
          aria-hidden="true"
        >
          <img
            src={result.thumbnail.src}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </a>
      )}
    </article>
  )
})

export default NewsResultCard
