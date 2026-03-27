import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResultsList from '../components/ResultsList'

const mockResults = [
  { title: 'Result 1', description: 'Desc 1', url: 'https://one.com', hash: 'h1', domain: 'one.com', isLocal: false },
  { title: 'Result 2', description: 'Desc 2', url: 'https://two.com', hash: '', domain: 'two.com', isLocal: false },
]

const baseProps = {
  activeTab: 'all' as const,
  results: [],
  imageResults: [],
  videoResults: [],
  newsResults: [],
  mapResults: [],
  loading: false,
  error: '',
  currentPage: 1,
  onPageChange: () => {},
  imageLoadingMore: false,
  imageHasMore: false,
  onLoadMoreImages: () => {},
  hasSearched: true,
}

describe('ResultsList', () => {
  it('shows loading state with skeleton cards', () => {
    render(<ResultsList {...baseProps} loading={true} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading search results...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    render(<ResultsList {...baseProps} error="network error" />)
    expect(screen.getByText(/network error/)).toBeInTheDocument()
  })

  it('renders result cards when results exist', () => {
    render(<ResultsList {...baseProps} results={mockResults} />)
    expect(screen.getByText('Result 1')).toBeInTheDocument()
    expect(screen.getByText('Result 2')).toBeInTheDocument()
  })

  it('renders pagination when results exist', () => {
    render(<ResultsList {...baseProps} results={mockResults} />)
    expect(screen.getByText('Page')).toBeInTheDocument()
  })

  it('shows empty message when no results', () => {
    render(<ResultsList {...baseProps} />)
    expect(screen.getByText(/No results found/)).toBeInTheDocument()
  })
})
