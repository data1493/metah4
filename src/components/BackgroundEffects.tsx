import { memo } from 'react'

const BackgroundEffects = memo(function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
      {/* Multi-layered gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-black via-lakers-purple/10 to-lakers-gold/5" />
      <div className="absolute inset-0 bg-gradient-to-tl from-lakers-gold/8 via-transparent to-lakers-purple/12" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-deep-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-lakers-purple/3 via-transparent to-lakers-gold/4" />
    </div>
  )
})

export default BackgroundEffects
