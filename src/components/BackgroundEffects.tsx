import { memo } from 'react'

interface BackgroundEffectsProps {
  variant?: 'home' | 'results'
}

const BackgroundEffects = memo(function BackgroundEffects({ variant = 'home' }: BackgroundEffectsProps) {
  const intensity = variant === 'home' ? 1 : 0.4

  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
      {/* Full-screen background image (home only) */}
      {variant === 'home' && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/bg1.JPG)' }}
        >
          <div className="absolute inset-0 bg-deep-black/60" />
        </div>
      )}

      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-black via-zinc-900/20 to-deep-black" />

      {/* Subtle texture */}
      <div className="absolute inset-0 brick-texture" style={{ opacity: 0.3 * intensity }} />

      {/* Soft accent glow */}
      <div
        className="absolute top-0 right-0 w-96 h-96"
        style={{
          background: `radial-gradient(ellipse at 70% 20%, rgba(124, 92, 252, ${0.04 * intensity}) 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80"
        style={{
          background: `radial-gradient(ellipse at 30% 80%, rgba(232, 168, 56, ${0.03 * intensity}) 0%, transparent 55%)`,
        }}
      />

      {/* Vinyl record silhouette — bottom right (home only) */}
      {variant === 'home' && (
        <div className="absolute bottom-8 right-8 opacity-[0.03]">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="currentColor" className="text-neon-gold">
            <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="100" cy="100" r="55" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="100" cy="100" r="35" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="100" cy="100" r="12" fill="currentColor" />
            <circle cx="100" cy="100" r="4" fill="#0c0c0c" />
          </svg>
        </div>
      )}

      {/* Boombox silhouette — top left (home only) */}
      {variant === 'home' && (
        <div className="absolute top-16 left-8 opacity-[0.025]">
          <svg width="160" height="100" viewBox="0 0 160 100" fill="currentColor" className="text-neon-purple">
            <rect x="5" y="15" width="150" height="70" rx="8" />
            <circle cx="45" cy="55" r="22" fill="#0c0c0c" />
            <circle cx="45" cy="55" r="18" fill="currentColor" />
            <circle cx="45" cy="55" r="6" fill="#0c0c0c" />
            <circle cx="115" cy="55" r="22" fill="#0c0c0c" />
            <circle cx="115" cy="55" r="18" fill="currentColor" />
            <circle cx="115" cy="55" r="6" fill="#0c0c0c" />
            <rect x="65" y="25" width="30" height="12" rx="2" fill="#0c0c0c" />
            <rect x="25" y="0" width="15" height="18" rx="2" />
            <rect x="120" y="0" width="15" height="18" rx="2" />
          </svg>
        </div>
      )}

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-deep-black/20 to-transparent" />
    </div>
  )
})

export default BackgroundEffects
