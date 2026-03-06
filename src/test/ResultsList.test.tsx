import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResultsList from '../components/ResultsList'

const mockResults = [
  { title: 'Result 1', description: 'Desc 1', url: 'https://one.com', hash: 'h1', domain: 'one.com', isLocal: false },
  { title: 'Result 2', description: 'Desc 2', url: 'https://two.com', hash: '', domain: 'two.com', isLocal: false },
]

describe('ResultsList', () => {
  it('shows loading state', () => {
    render(<ResultsList results={[]} loading={true} error="" apiKeyError={false} hashed={false} />)
    expect(screen.getByText('SEARCHING...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    render(<ResultsList results={[]} loading={false} error="network error" apiKeyError={false} hashed={false} />)
    expect(screen.getByText(/network error/)).toBeInTheDocument()
  })

  it('shows no results message when hashed but empty', () => {
    render(<ResultsList results={[]} loading={false} error="" apiKeyError={false} hashed={true} />)
    expect(screen.getByText('no results found')).toBeInTheDocument()
  })

  it('renders result cards when results exist', () => {
    render(<ResultsList results={mockResults} loading={false} error="" apiKeyError={false} hashed={true} />)
    expect(screen.getByText('Result 1')).toBeInTheDocument()
    expect(screen.getByText('Result 2')).toBeInTheDocument()
  })

  it('renders pagination when results exist', () => {
    render(<ResultsList results={mockResults} loading={false} error="" apiKeyError={false} hashed={true} />)
    expect(screen.getByText('Page')).toBeInTheDocument()
  })

  it('renders nothing before search', () => {
    const { container } = render(<ResultsList results={[]} loading={false} error="" apiKeyError={false} hashed={false} />)
    expect(container.innerHTML).toBe('')
  })
})
