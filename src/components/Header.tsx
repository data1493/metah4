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
  onCityEdit: (city: string) => void
  autoEdit: boolean
}

const Header = memo(function Header({ query, onQueryChange, onSearch, disabled, onLogoClick, onShowProof, locationEnabled, locationLabel, onToggleLocation, onCityEdit, autoEdit }: HeaderProps) {
  return (
    <header className="bg-deep-black/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-1.5 px-3 sm:px-4 py-1.5 sm:py-2">
        {/* Logo — clickable, returns to home */}
        <button
          onClick={onLogoClick}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
          aria-label="Return to homepage"
        >
          <img src="/images/logo2a.png" alt="METAH4" className="h-8 sm:h-10 md:h-14" />
        </button>

        {/* Compact search bar — grows to fill available row space */}
        <div className="flex-1 min-w-0 max-w-xl">
          <SearchBar
            query={query}
            onQueryChange={onQueryChange}
            onSearch={onSearch}
            disabled={disabled}
            variant="header"
          />
        </div>

        {/* Controls — on mobile wrap to second row, right-aligned */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-auto sm:ml-0">
          <LocationToggle
            enabled={locationEnabled}
            label={locationLabel}
            error=""
            onToggle={onToggleLocation}
            onCityEdit={onCityEdit}
            autoEdit={autoEdit}
          />
          <PrivacyBadge onClick={onShowProof} variant="header" />
        </div>
      </div>
    </header>
  )
})

export default Header
