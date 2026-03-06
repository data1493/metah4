import { useRef, useCallback, memo } from 'react'

interface SearchBarProps {
  query: string
  onQueryChange: (q: string) => void
  onSearch: () => void
  disabled: boolean
}

const SearchBar = memo(function SearchBar({ query, onQueryChange, onSearch, disabled }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') onSearch()
    },
    [onSearch]
  )

  return (
    <search role="search" aria-label="Web search" className="flex gap-2 mb-4">
      <label htmlFor="search-input" className="sr-only">Search query</label>
      <input
        ref={inputRef}
        id="search-input"
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="search the underground..."
        className="flex-1 bg-card-bg border border-neon-gold text-neon-gold px-4 py-3 rounded focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple font-mono text-sm"
        autoComplete="off"
      />
      <button
        onClick={onSearch}
        disabled={disabled}
        aria-label="Submit search"
        className="px-6 py-3 bg-neon-purple text-white font-black text-sm rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neon-gold hover:text-deep-black transition-colors duration-200"
      >
        GO
      </button>
    </search>
  )
})

export default SearchBar
