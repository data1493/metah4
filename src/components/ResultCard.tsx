interface SearchResult {
  title: string
  url: string
  snippet: string
}

interface Props {
  result: SearchResult
  hash: string
  index: number
}

function ResultCard({ result, hash, index }: Props) {
  return (
    <div
      className="card animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="text-neon-gold/50 text-xs font-mono mb-2 truncate">
        sha256: {hash.slice(0, 32)}…
      </div>
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neon-green font-bold text-sm hover:text-neon-purple transition-colors duration-200 block mb-1 break-words"
      >
        {result.title || result.url}
      </a>
      <div className="text-neon-purple/60 text-xs truncate mb-2">{result.url}</div>
      <p className="text-gray-400 text-xs leading-relaxed">{result.snippet}</p>
    </div>
  )
}

export default ResultCard
