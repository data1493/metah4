import { useRef, useCallback, memo } from 'react'

interface SearchBarProps {
  query: string
  onQueryChange: (q: string) => void
  onSearch: () => void
  disabled: boolean
  variant?: 'home' | 'header'
}

const SearchBar = memo(function SearchBar({ query, onQueryChange, onSearch, disabled, variant = 'home' }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') onSearch()
    },
    [onSearch]
  )

  const isHeader = variant === 'header'

  return (
    <search role="search" aria-label="Web search" className={isHeader ? 'flex gap-0' : 'flex gap-2 mb-4'}>
      <label htmlFor={isHeader ? 'header-search-input' : 'search-input'} className="sr-only">Search query</label>
      <div className={`flex flex-1 items-center bg-card-bg border border-neon-gold/60 ${isHeader ? 'rounded-full px-3 py-1' : 'rounded-full px-4 py-3'} focus-within:border-neon-purple focus-within:ring-1 focus-within:ring-neon-purple transition-all`}>
        {/* Search icon */}
        <svg
          className={`text-neon-gold/50 flex-shrink-0 ${isHeader ? 'w-4 h-4 mr-2' : 'w-5 h-5 mr-3'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          ref={inputRef}
          id={isHeader ? 'header-search-input' : 'search-input'}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="search the underground..."
          className={`flex-1 bg-transparent text-neon-gold outline-none font-mono placeholder:text-neon-gold/30 ${isHeader ? 'text-sm py-1' : 'text-base'}`}
          autoComplete="off"
        />
        <button
          onClick={onSearch}
          disabled={disabled}
          aria-label="Submit search"
          className={`flex-shrink-0 bg-neon-purple text-white font-black rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neon-gold hover:text-deep-black transition-colors duration-200 ${isHeader ? 'text-xs px-4 py-1 ml-2' : 'text-sm px-6 py-2 ml-3'}`}
        >
          GO
        </button>
      </div>
    </search>
  )
})

export default SearchBar
