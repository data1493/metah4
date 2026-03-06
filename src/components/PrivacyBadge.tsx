import { memo } from 'react'

interface PrivacyBadgeProps {
  hashed: boolean
  onClick: () => void
  variant?: 'header' | 'home'
}

const PrivacyBadge = memo(function PrivacyBadge({ hashed, onClick, variant = 'home' }: PrivacyBadgeProps) {
  const isHeader = variant === 'header'

  return (
    <button
      onClick={onClick}
      title="Click to see privacy proof"
      className={`inline-flex items-center gap-2 rounded-full font-medium transition-all border ${
        hashed
          ? 'bg-neon-purple/25 border-neon-purple text-neon-purple shadow-[0_0_12px_rgba(212,0,255,0.3)]'
          : 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple/60 hover:border-neon-purple/60'
      } ${isHeader ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'}`}
    >
      {/* Shield icon */}
      <svg
        className={`flex-shrink-0 ${isHeader ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${hashed ? 'animate-pulse' : ''}`}
        fill={hashed ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={hashed ? 0 : 2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
      <span>{hashed ? 'Verified: Hashed on Device' : 'Privacy Protected'}</span>
    </button>
  )
})

export default PrivacyBadge
