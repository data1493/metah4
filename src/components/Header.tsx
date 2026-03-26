import { memo } from 'react'
import SearchBar from './SearchBar'
import PrivacyBadge from './PrivacyBadge'
import LocationToggle from './LocationToggle'

interface HeaderProps {
  query: string
  onQueryChange: (q: string) => void
  onSearch: () => void
  disabled: boolean
  onLogoClick: () => void
  onShowProof: () => void
  locationEnabled: boolean
  locationLabel: string | null
  onToggleLocation: () => void
}

const Header = memo(function Header({ query, onQueryChange, onSearch, disabled, onLogoClick, onShowProof, locationEnabled, locationLabel, onToggleLocation }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-deep-black/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-5xl mx-auto flex items-center gap-4 px-4 py-2">
        {/* Logo — clickable, returns to home */}
        <button
          onClick={onLogoClick}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
          aria-label="Return to homepage"
        >
          <img src="/images/logo2a.png" alt="METAH4" className="h-12 md:h-14" />
        </button>

        {/* Compact search bar */}
        <div className="flex-1 max-w-xl">
          <SearchBar
            query={query}
            onQueryChange={onQueryChange}
            onSearch={onSearch}
            disabled={disabled}
            variant="header"
          />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <LocationToggle
            enabled={locationEnabled}
            label={locationLabel}
            error=""
            onToggle={onToggleLocation}
          />
          <PrivacyBadge onClick={onShowProof} variant="header" />
        </div>
      </div>
    </header>
  )
})

export default Header
