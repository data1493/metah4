import { memo } from 'react'

interface LocationToggleProps {
  enabled: boolean
  country: string | null
  error: string
  onToggle: () => void
}

const LocationToggle = memo(function LocationToggle({ enabled, country, error, onToggle }: LocationToggleProps) {
  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={onToggle}
        title={enabled ? 'Disable local results' : 'Enable local results'}
        className={[
          'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all border',
          enabled
            ? 'bg-neon-purple/10 border-neon-purple/50 text-neon-purple shadow-[0_0_8px_rgba(212,0,255,0.25)] hover:bg-neon-purple/20'
            : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300',
        ].join(' ')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={enabled ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={enabled ? 0 : 1.5}
          className="w-3 h-3"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
        {enabled && country ? `Local · ${country}` : 'Local results'}
      </button>
      {error && (
        <span className="text-xs text-red-400">{error}</span>
      )}
    </div>
  )
})

export default LocationToggle
