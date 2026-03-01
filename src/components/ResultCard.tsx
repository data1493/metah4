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
      className={`card animate-fade-in border ${index % 2 === 0 ? 'border-neon-gold' : 'border-neon-purple'}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-${index % 2 === 0 ? 'neon-purple' : 'neon-gold'} font-bold text-sm hover:text-${index % 2 === 0 ? 'neon-gold' : 'neon-purple'} transition-colors duration-200 block mb-1 break-words`}
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
