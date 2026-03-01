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
  const isEven = index % 2 === 0
  const titleColor = isEven ? 'text-neon-purple' : 'text-neon-gold'
  const titleHoverColor = isEven ? 'hover:text-neon-gold' : 'hover:text-neon-purple'
  const pulseBorder = isEven ? 'pulse-border-gold' : 'pulse-border-purple'

  return (
    <div
      className={`card animate-fade-in ${pulseBorder} p-6`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${titleColor} font-bold text-lg ${titleHoverColor} transition-colors duration-200 block mb-2 break-words leading-tight`}
      >
        {result.title}
      </a>
      <div className="text-neon-gold/80 text-sm mb-3 break-all">
        <a href={result.url} target="_blank" rel="noopener noreferrer" className="hover:text-neon-gold transition-colors">
          {result.url}
        </a>
      </div>
      <p className="text-gray-200 text-sm leading-relaxed">{result.description}</p>
    </div>
  )
}

export default ResultCard
