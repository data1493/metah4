import { memo } from 'react'
import type { SearchResult } from '../types'

interface PrivacyProofModalContentProps {
  hashed: boolean
  firstResult: SearchResult | undefined
}

const PrivacyProofModalContent = memo(function PrivacyProofModalContent({ hashed, firstResult }: PrivacyProofModalContentProps) {
  return (
    <>
      <h2 className="text-2xl font-bold glitch-text mb-6">Privacy Proof</h2>
      <p className="text-gray-300 mb-4">
        Your search query was hashed on-device using SHA-256. Nothing — not even the raw text — left your computer. Brave API only sees the hash if we ever send it (we don't). Zero logs. Zero tracking.
      </p>
      {hashed && firstResult?.hash && (
        <div className="bg-black/60 p-4 rounded-lg font-mono text-xs break-all text-neon-gold/90">
          SHA-256: {firstResult.hash}
        </div>
      )}
      <p className="mt-6 text-xs opacity-70">
        Built with libsodium-wrappers. Auditable. No backend. No bullshit.
      </p>
    </>
  )
})

export default PrivacyProofModalContent
