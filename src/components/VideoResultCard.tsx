import { memo } from 'react'
import type { BraveVideoResult } from '../types'

interface Props {
  result: BraveVideoResult
  index: number
}

const VideoResultCard = memo(function VideoResultCard({ result, index }: Props) {
  const source = result.meta_url?.netloc ?? ''

  return (
    <article
      className="card animate-bounce-in flex gap-4 p-4"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Thumbnail */}
      {result.thumbnail?.src ? (
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 w-40 h-24 rounded overflow-hidden bg-zinc-800 block relative group"
          tabIndex={-1}
          aria-hidden="true"
        >
          <img
            src={result.thumbnail.src}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Play icon overlay */}
          <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
            <svg className="w-8 h-8 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </a>
      ) : (
        <div className="flex-shrink-0 w-40 h-24 rounded bg-zinc-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-zinc-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        {source && (
          <p className="text-zinc-500 text-xs font-mono mb-1 truncate">{source}</p>
        )}
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
        {result.age && (
          <p className="text-zinc-600 text-xs mt-1">{result.age}</p>
        )}
      </div>
    </article>
  )
})

export default VideoResultCard
