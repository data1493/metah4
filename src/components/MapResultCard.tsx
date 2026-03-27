import { memo } from 'react'
import type { NominatimResult } from '../types'

interface MapResultCardProps {
  result: NominatimResult
  index: number
  isSelected: boolean
  onSelect: () => void
}

const MapResultCard = memo(function MapResultCard({ result, index, isSelected, onSelect }: MapResultCardProps) {
  const address = [
    result.address?.road,
    result.address?.suburb,
    result.address?.city,
    result.address?.state,
    result.address?.postcode,
  ].filter(Boolean).join(', ')

  return (
    <button
      onClick={onSelect}
      className={[
        'w-full text-left p-3 rounded border transition-all',
        isSelected
          ? 'bg-neon-purple/10 border-neon-purple/50 shadow-[0_0_8px_rgba(212,0,255,0.2)]'
          : 'bg-card-bg border-zinc-800 hover:border-zinc-600',
      ].join(' ')}
      aria-label={`Select ${result.display_name}`}
    >
      <div className="flex items-start gap-2">
        <span className="text-neon-purple text-xs font-mono mt-0.5 flex-shrink-0">{index + 1}</span>
        <div className="min-w-0">
          <p className="text-zinc-200 text-sm font-medium truncate">{result.name || result.display_name.split(',')[0]}</p>
          {address && <p className="text-zinc-500 text-xs mt-0.5 line-clamp-2">{address}</p>}
          <p className="text-zinc-600 text-xs mt-1 capitalize">{result.type}</p>
        </div>
      </div>
    </button>
  )
})

export default MapResultCard
