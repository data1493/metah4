import { memo, useState, useRef, useEffect } from 'react'

interface LocationToggleProps {
  enabled: boolean
  label: string | null
  error: string
  onToggle: () => void
  onCityEdit: (city: string) => void
  autoEdit: boolean
}

const LocationToggle = memo(function LocationToggle({ enabled, label, error, onToggle, onCityEdit, autoEdit }: LocationToggleProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  useEffect(() => {
    if (autoEdit) {
      setDraft(label ?? '')
      setEditing(true)
    }
  }, [autoEdit, label])

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDraft(label ?? '')
    setEditing(true)
  }

  const commitEdit = () => {
    const trimmed = draft.trim()
    if (trimmed) onCityEdit(trimmed)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') setEditing(false)
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1">
        <button
          onClick={onToggle}
          title={enabled ? 'Disable local results' : 'Enable local results'}
          className={[
            'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all border',
            enabled
              ? 'bg-neon-purple/10 border-neon-purple/50 text-neon-purple shadow-[0_0_8px_rgba(212,0,255,0.25)] hover:bg-neon-purple/20'
              : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300',
          ].join(' ')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={enabled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={enabled ? 0 : 1.5}
            className="w-3 h-3"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          {enabled && label && !editing ? `Local · ${label}` : !enabled ? 'Local results' : 'Local'}
        </button>

        {enabled && !editing && (
          <button
            onClick={startEdit}
            title="Correct your city"
            className="text-zinc-500 hover:text-neon-purple transition-colors"
            aria-label="Edit city"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
              <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.263a1.75 1.75 0 0 0 0-2.474ZM3.75 14A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2H7a.75.75 0 0 1 0 1.5H3.75a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25V9a.75.75 0 0 1 1.5 0v3.25A1.75 1.75 0 0 1 12.25 14h-8.5Z" />
            </svg>
          </button>
        )}

        {editing && (
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            placeholder="Enter your city"
            className="bg-zinc-900 border border-neon-purple/50 text-neon-purple text-xs rounded px-2 py-0.5 w-32 outline-none"
          />
        )}
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
})

export default LocationToggle
