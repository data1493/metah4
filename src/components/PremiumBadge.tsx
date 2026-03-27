import { memo } from 'react'

interface Props {
  enabled: boolean
  onToggle: () => void
}

const PremiumBadge = memo(function PremiumBadge({ enabled, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      title={enabled ? 'Premium: queries encrypted on device' : 'Enable encrypted search (Premium)'}
      aria-pressed={enabled}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold transition-all ${
        enabled
          ? 'bg-neon-gold/10 border-neon-gold/60 text-neon-gold'
          : 'bg-zinc-800/60 border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
      }`}
    >
      <svg
        className="w-3 h-3 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        aria-hidden="true"
      >
        {enabled ? (
          // Unlocked padlock — active state
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 0 1 8 0m0 0v4M5 11h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z" />
        ) : (
          // Locked padlock — inactive state
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11V7a4 4 0 0 0-8 0v4M5 11h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z" />
        )}
      </svg>
      {enabled ? 'Encrypted' : 'Premium'}
    </button>
  )
})

export default PremiumBadge
