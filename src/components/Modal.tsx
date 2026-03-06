import { useCallback, useEffect, useRef, memo } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  ariaLabel: string
}

const Modal = memo(function Modal({ open, onClose, children, ariaLabel }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement
      // Focus the overlay so keyboard events work
      overlayRef.current?.focus()
    } else if (previousFocus.current) {
      previousFocus.current.focus()
      previousFocus.current = null
    }
  }, [open])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose()
    },
    [onClose]
  )

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in outline-none"
    >
      <div className="card max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 text-2xl leading-none"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
})

export default Modal
