interface SearchResult {
  title: string
  description: string
  url: string
  hash: string
}

interface Props {
  result: SearchResult
  index: number
}

function ResultCard({ result, index }: Props) {
  return (
    <div
      className="card animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="text-neon-gold/50 text-xs font-mono mb-2 truncate">
        sha256: {result.hash.slice(0, 32)}…
      </div>
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neon-gold font-bold text-sm hover:text-neon-purple transition-colors duration-200 block mb-1 break-words"
      >
        {result.title}
      </a>
      <div className="text-neon-gold/70 text-xs truncate mb-2">
        <a href={result.url} target="_blank" rel="noopener noreferrer">
          {result.url}
        </a>
      </div>
      <p className="text-gray-300 text-xs leading-relaxed">{result.description}</p>
    </div>
  )
}

export default ResultCard
