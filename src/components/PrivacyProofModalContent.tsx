import { memo } from 'react'
import type { SearchResult } from '../types'

interface PrivacyProofModalContentProps {
  firstResult: SearchResult | undefined
}

const PrivacyProofModalContent = memo(function PrivacyProofModalContent({ firstResult: _firstResult }: PrivacyProofModalContentProps) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-zinc-100">Privacy Proof</h2>
      <p className="text-zinc-400 mb-4">
        Your search query is sent directly to the Brave Search API over a secure proxy. No query data is stored or logged on our end.
      </p>
      <p className="mt-6 text-xs text-zinc-500">
        Powered by Brave Search. Proxied anonymously. No tracking.
      </p>
    </>
  )
})

export default PrivacyProofModalContent
