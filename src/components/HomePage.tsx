import { memo } from 'react'
import SearchBar from './SearchBar'

interface HomePageProps {
  query: string
  onQueryChange: (q: string) => void
  onSearch: () => void
  disabled: boolean
}

const HomePage = memo(function HomePage({ query, onQueryChange, onSearch, disabled }: HomePageProps) {
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
      </div>
    </div>
  )
})

export default HomePage
