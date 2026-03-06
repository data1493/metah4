import { memo } from 'react'

const BackgroundEffects = memo(function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
      {/* Floating Basketball Animation */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-20 animate-basketball-bounce">
        <div className="absolute inset-2 border-2 border-black rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-8 bg-black rounded-full transform rotate-45" />
          <div className="w-1 h-8 bg-black rounded-full transform -rotate-45 absolute" />
        </div>
      </div>

      <div className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-15 animate-basketball-bounce" style={{ animationDelay: '1s' }}>
        <div className="absolute inset-1.5 border-2 border-black rounded-full" />
      </div>

      <div className="absolute bottom-32 left-20 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-10 animate-basketball-bounce" style={{ animationDelay: '2s' }}>
        <div className="absolute inset-3 border-2 border-black rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-10 bg-black rounded-full transform rotate-45" />
          <div className="w-1.5 h-10 bg-black rounded-full transform -rotate-45 absolute" />
        </div>
      </div>

      {/* Lakers Logo-inspired Geometric Shapes */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-lakers-purple rounded-full opacity-10 animate-lakers-float">
        <div className="absolute inset-4 border-2 border-lakers-gold rounded-full" />
        <div className="absolute inset-8 border border-lakers-purple rounded-full" />
      </div>

      <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border-3 border-lakers-gold rounded-full opacity-15 animate-pulse">
        <div className="absolute inset-2 border-2 border-lakers-purple rounded-full" />
      </div>

      {/* Floating Particles */}
      <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-lakers-purple rounded-full opacity-60 animate-particle-twinkle" />
      <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-lakers-gold rounded-full opacity-50 animate-particle-twinkle" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-lakers-purple rounded-full opacity-40 animate-particle-twinkle" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/2 w-1 h-1 bg-lakers-gold rounded-full opacity-70 animate-particle-twinkle" style={{ animationDelay: '1.5s' }} />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-lakers-purple/5 via-transparent to-lakers-gold/5" />
      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-deep-black/20 to-transparent" />
    </div>
  )
})

export default BackgroundEffects
