import { useEffect, useRef } from 'react'
import type { BraveImageResult } from '../types'

interface Props {
  result: BraveImageResult
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export default function ImagePreviewPanel({ result, onClose, onPrev, onNext, hasPrev, hasNext }: Props) {
  const imageSrc = result.properties?.url ?? result.thumbnail.src
  const pageUrl = result.url
  const closeRef = useRef<HTMLButtonElement>(null)

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && hasPrev) onPrev()
      else if (e.key === 'ArrowRight' && hasNext) onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext, hasPrev, hasNext])

  // Focus close button on open for accessibility
  useEffect(() => {
    closeRef.current?.focus()
  }, [result.url])

  return (
    <>
      {/* Mobile: full-screen overlay backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — mobile: fixed full-screen; desktop: sticky inline */}
      <aside
        aria-label="Image preview"
        className="
          fixed inset-0 z-50 flex flex-col bg-zinc-950 overflow-y-auto
          lg:static lg:z-auto lg:inset-auto lg:w-[340px] lg:flex-shrink-0
          lg:sticky lg:top-4 lg:h-fit lg:rounded-xl lg:border lg:border-zinc-800 lg:overflow-visible
        "
      >
        {/* Header row */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <span className="text-xs text-zinc-500 font-mono truncate flex-1 mr-2">
            {result.source === 'pexels.com' ? (
              <a
                href="https://www.pexels.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-zinc-300"
              >
                pexels.com
              </a>
            ) : result.source}
          </span>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close preview"
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Image */}
        <div className="px-4">
          <div className="w-full bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center max-h-[55vh] lg:max-h-[45vh]">
            <img
              src={imageSrc}
              alt={result.title}
              className="max-w-full max-h-[55vh] lg:max-h-[45vh] object-contain"
              loading="eager"
            />
          </div>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1 gap-2">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            aria-label="Previous image"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-sm text-zinc-400 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            aria-label="Next image"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-sm text-zinc-400 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <div className="px-4 pt-2">
          <p className="text-sm font-semibold text-zinc-200 leading-snug line-clamp-3">{result.title}</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 px-4 pt-3 pb-5">
          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-xs font-semibold py-2 rounded-lg bg-neon-purple text-white hover:bg-neon-purple/80 transition-colors"
          >
            Visit page
          </a>
          <a
            href={imageSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-xs font-semibold py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors border border-zinc-700"
          >
            View image
          </a>
        </div>
      </aside>
    </>
  )
}
