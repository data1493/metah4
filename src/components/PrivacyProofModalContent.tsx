import { memo } from 'react'
import type { SearchResult } from '../types'

interface PrivacyProofModalContentProps {
  hashed: boolean
  firstResult: SearchResult | undefined
}

const PrivacyProofModalContent = memo(function PrivacyProofModalContent({ hashed, firstResult }: PrivacyProofModalContentProps) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-zinc-100">Privacy Proof</h2>
      <p className="text-zinc-400 mb-4">
        Your search query was hashed on-device using the Web Crypto API (SHA-256). The hash is computed locally in your browser before any network request is made.
      </p>
      {hashed && firstResult?.hash && (
        <div className="bg-black/60 p-4 rounded-lg font-mono text-xs break-all text-neon-gold">
          SHA-256: {firstResult.hash}
        </div>
      )}
      <p className="mt-6 text-xs text-zinc-500">
        Built with Web Crypto API (crypto.subtle). Auditable. No backend.
      </p>
    </>
  )
})

export default PrivacyProofModalContent
