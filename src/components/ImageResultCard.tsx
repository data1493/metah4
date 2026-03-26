import { memo } from 'react'
import type { BraveImageResult } from '../types'

interface Props {
  result: BraveImageResult
  index: number
}

const ImageResultCard = memo(function ImageResultCard({ result, index }: Props) {
  const href = result.properties?.url ?? result.url

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 hover:border-neon-purple/50 transition-all"
      style={{ animationDelay: `${index * 40}ms` }}
      aria-label={result.title}
    >
      <div className="aspect-video w-full bg-zinc-800 overflow-hidden">
        <img
          src={result.thumbnail.src}
          alt={result.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-2">
        <p className="text-xs text-zinc-300 font-medium truncate leading-snug">{result.title}</p>
        <p className="text-xs text-zinc-600 truncate mt-0.5">{result.source}</p>
      </div>
    </a>
  )
})

export default ImageResultCard
