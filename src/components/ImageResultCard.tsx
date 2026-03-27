import { memo } from 'react'
import type { BraveImageResult } from '../types'

interface Props {
  result: BraveImageResult
  index: number
  onSelect: () => void
  isSelected: boolean
}

const ImageResultCard = memo(function ImageResultCard({ result, index, onSelect, isSelected }: Props) {
  const w = result.thumbnail.width
  const h = result.thumbnail.height
  const aspectRatio = w && h ? `${w} / ${h}` : undefined

  return (
    <button
      onClick={onSelect}
      className={`block w-full group relative overflow-hidden rounded-lg bg-zinc-900 border transition-all text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple ${
        isSelected
          ? 'border-neon-purple ring-2 ring-neon-purple/50'
          : 'border-zinc-800 hover:border-neon-purple/50'
      }`}
      style={{ animationDelay: `${index * 40}ms` }}
      aria-label={result.title}
      aria-pressed={isSelected}
    >
      <div className="w-full bg-zinc-800 overflow-hidden" style={{ aspectRatio }}>
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
    </button>
  )
})

export default ImageResultCard
