import { memo } from 'react'
import type { LogEntry } from '../types'

interface ActivityLogsModalContentProps {
  logs: LogEntry[]
}

const ActivityLogsModalContent = memo(function ActivityLogsModalContent({ logs }: ActivityLogsModalContentProps) {
  return (
    <>
      <h2 className="text-2xl font-bold glitch-text mb-6">Activity Logs</h2>
      <p className="text-gray-300 mb-4">
        Your digital paper trail - proving privacy in plain sight. Every step logged locally, nothing sent externally without your knowledge.
      </p>
      <div
        className="bg-black/60 p-4 rounded-lg font-mono text-xs space-y-2"
        style={{ maxHeight: '256px', overflowY: 'scroll', overscrollBehavior: 'contain' }}
        role="log"
        aria-label="Activity log entries"
      >
        {logs.map((log, i) => (
          <div key={i} className="text-neon-gold/90">
            <span className="text-neon-purple/70">{log.timestamp.toLocaleTimeString()}</span> {log.message}
          </div>
        ))}
      </div>
    </>
  )
})

export default ActivityLogsModalContent
