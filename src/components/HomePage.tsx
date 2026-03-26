import { memo } from 'react'
import SearchBar from './SearchBar'
import PrivacyBadge from './PrivacyBadge'
import LocationToggle from './LocationToggle'

interface HomePageProps {
  query: string
  onQueryChange: (q: string) => void
  onSearch: () => void
  disabled: boolean
  hashed: boolean
  hashValue: string
  onShowProof: () => void
  locationEnabled: boolean
  locationLabel: string | null
  locationError: string
  onToggleLocation: () => void
}

const HomePage = memo(function HomePage({ query, onQueryChange, onSearch, disabled, hashed, hashValue, onShowProof, locationEnabled, locationLabel, locationError, onToggleLocation }: HomePageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <img
        src="/images/logo2a.png"
        alt="METAH4"
        className="h-72 md:h-96 mb-4 drop-shadow-lg"
      />
      <p className="font-graffiti text-neon-purple/80 text-base md:text-lg mb-10 tracking-widest uppercase text-center">
        privacy-first search engine
      </p>

      <div className="w-full max-w-2xl">
        <SearchBar
          query={query}
          onQueryChange={onQueryChange}
          onSearch={onSearch}
          disabled={disabled}
          variant="home"
        />
        <div className="flex justify-end mt-2">
          <LocationToggle
            enabled={locationEnabled}
            label={locationLabel}
            error={locationError}
            onToggle={onToggleLocation}
          />
        </div>
      </div>

      <div className="mt-6">
        <PrivacyBadge hashed={hashed} hashValue={hashValue} onClick={onShowProof} variant="home" />
      </div>
    </div>
  )
})

export default HomePage
