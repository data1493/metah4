import { memo } from 'react'

interface StatusBarProps {
  hashed: boolean
  hashValue: string
  onShowProof: () => void
  onShowLogs: () => void
}

const StatusBar = memo(function StatusBar({ hashed, hashValue, onShowProof, onShowLogs }: StatusBarProps) {
  return (
    <div className="flex items-center gap-4 mb-4" role="toolbar" aria-label="Privacy controls">
      <button
        onClick={onShowProof}
        className="flex items-center gap-2 px-3 py-1.5 bg-neon-purple/20 hover:bg-neon-purple/40 rounded-full text-xs font-medium text-neon-purple transition-all border border-neon-purple/40"
        title="Click to see privacy proof"
      >
        <span className="w-3 h-3 rounded-full bg-neon-purple animate-pulse" aria-hidden="true" />
        Privacy Proof
      </button>

      <button
        onClick={onShowLogs}
        className="flex items-center gap-2 px-3 py-1.5 bg-neon-gold/20 hover:bg-neon-gold/40 rounded-full text-xs font-medium text-neon-gold transition-all border border-neon-gold/40"
        title="View activity logs"
      >
        <span className="w-3 h-3 rounded-full bg-neon-gold animate-pulse" aria-hidden="true" />
        View Logs
      </button>

      {hashed && (
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-gold/10 border border-neon-gold text-neon-gold text-xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-neon-gold inline-block" aria-hidden="true" />
            hashed on device
          </span>
          <span className="text-neon-gold/60 text-xs font-mono break-all" aria-label={`Hash value: ${hashValue}`}>
            {hashValue}
          </span>
        </div>
      )}
    </div>
  )
})

export default StatusBar
