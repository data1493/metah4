import { memo, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { LogEntry } from '../types'

interface ActivityLogsModalContentProps {
  logs: LogEntry[]
  onNukeLogs: () => void
}

// Deterministic golden-angle particle spread (no random — stable across renders)
const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  angle: (i * 137.508) % 360,
  distance: 200 + (i * 7 % 350),
  size: 5 + (i % 10),
  delay: (i % 25) * 0.025,
  duration: 1.2 + (i % 12) * 0.1,
  color: ['#ff4400','#ff8800','#ffd700','#ffffff','#ff2200','#ffcc00','#ff6600','#ffee88'][i % 8],
}))

const SMOKE = Array.from({ length: 10 }, (_, i) => ({
  x: 30 + (i * 71) % 40,
  y: 30 + (i * 53) % 40,
  size: 100 + (i * 43) % 150,
  delay: 0.4 + i * 0.15,
}))

function NukeExplosion({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 4500)
    return () => clearTimeout(t)
  }, [onComplete])

  return createPortal(
    <div className="nuke-overlay">
      {/* Persistent dark cover hiding modal and dimming background */}
      <div className="nuke-backdrop" />
      <div className="nuke-shake-wrapper">
        {/* Initial blinding flash */}
        <div className="nuke-flash" />

        {/* Three fireball layers */}
        <div className="nuke-fireball nuke-fireball-outer" />
        <div className="nuke-fireball nuke-fireball-mid" />
        <div className="nuke-fireball nuke-fireball-inner" />

        {/* Three sequential shockwave rings */}
        <div className="nuke-shockwave nuke-shockwave-1" />
        <div className="nuke-shockwave nuke-shockwave-2" />
        <div className="nuke-shockwave nuke-shockwave-3" />

        {/* 60 debris particles in all directions */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="nuke-particle"
            style={{
              '--nuke-angle': `${p.angle}deg`,
              '--nuke-dist': `${p.distance}px`,
              '--nuke-size': `${p.size}px`,
              '--nuke-color': p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            } as React.CSSProperties}
          />
        ))}

        {/* Rising smoke clouds */}
        {SMOKE.map((s, i) => (
          <div
            key={i}
            className="nuke-smoke"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}

        {/* Dramatic text */}
        <div className="nuke-text">
          <div className="nuke-text-main">LOGS OBLITERATED</div>
          <div className="nuke-text-sub">All digital traces annihilated</div>
        </div>
      </div>
    </div>,
    document.body
  )
}

const ActivityLogsModalContent = memo(function ActivityLogsModalContent({ logs, onNukeLogs }: ActivityLogsModalContentProps) {
  const [isExploding, setIsExploding] = useState(false)

  const handleNuke = () => {
    setIsExploding(true)
  }

  return (
    <div
      style={{
        transition: 'opacity 0.5s ease-out',
        opacity: isExploding ? 0 : 1,
        pointerEvents: isExploding ? 'none' : undefined,
      }}
    >
      <h2 className="text-2xl font-bold mb-6 text-zinc-100">Activity Logs</h2>
      <p className="text-zinc-400 mb-4">
        Your digital paper trail - proving privacy in plain sight. Every step logged locally, nothing sent externally without your knowledge.
      </p>
      <div
        className="bg-black/60 p-4 rounded-lg font-mono text-xs space-y-2 mb-6"
        style={{ maxHeight: '256px', overflowY: 'scroll', overscrollBehavior: 'contain' }}
        role="log"
        aria-label="Activity log entries"
      >
        {logs.map((log, i) => (
          <div key={i} className="text-zinc-300">
            <span className="text-neon-purple/70">{log.timestamp.toLocaleTimeString()}</span> {log.message}
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleNuke}
          disabled={isExploding}
          className="relative px-8 py-4 bg-red-950 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-lg border-2 border-red-700 hover:border-red-500 uppercase tracking-widest text-sm transition-all duration-200 hover:shadow-lg hover:shadow-red-900/60 active:scale-95"
          style={{ fontFamily: 'Rubik, sans-serif' }}
        >
          ☢&nbsp;&nbsp;NUKE LOGS&nbsp;&nbsp;☢
        </button>
        <p className="text-red-600/60 text-xs mt-3 tracking-wide">⚠ This will permanently destroy all logs</p>
      </div>

      {isExploding && <NukeExplosion onComplete={onNukeLogs} />}
    </div>
  )
})

export default ActivityLogsModalContent
