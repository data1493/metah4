import { memo } from 'react'
import SearchBar from './SearchBar'
import PrivacyBadge from './PrivacyBadge'

interface HomePageProps {
  query: string
  onQueryChange: (q: string) => void
  onSearch: () => void
  disabled: boolean
  apiKeyError: boolean
  hashed: boolean
  onShowProof: () => void
}

const HomePage = memo(function HomePage({ query, onQueryChange, onSearch, disabled, apiKeyError, hashed, onShowProof }: HomePageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <img
        src="/images/logo2.png"
        alt="METAH4"
        className="h-32 md:h-48 mb-4 drop-shadow-lg"
      />
      <p className="font-graffiti text-neon-purple/80 text-sm mb-10 tracking-widest uppercase text-center">
        privacy-first search engine
      </p>

      {apiKeyError && (
        <div className="mb-6 px-4 py-3 rounded border border-red-500 bg-red-500/10 text-red-400 text-xs text-center tracking-wide max-w-xl w-full">
          no api key — add VITE_BRAVE_SEARCH_API_KEY to .env and restart the dev server
        </div>
      )}

      <div className="w-full max-w-2xl">
        <SearchBar
          query={query}
          onQueryChange={onQueryChange}
          onSearch={onSearch}
          disabled={disabled}
          variant="home"
        />
      </div>

      <div className="mt-6">
        <PrivacyBadge hashed={hashed} onClick={onShowProof} variant="home" />
      </div>
    </div>
  )
})

export default HomePage
