import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResultsList from '../components/ResultsList'

const mockResults = [
  { title: 'Result 1', description: 'Desc 1', url: 'https://one.com', hash: 'h1', domain: 'one.com', isLocal: false },
  { title: 'Result 2', description: 'Desc 2', url: 'https://two.com', hash: '', domain: 'two.com', isLocal: false },
]

describe('ResultsList', () => {
  it('shows loading state with skeleton cards', () => {
    render(<ResultsList results={[]} loading={true} error="" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading search results...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    render(<ResultsList results={[]} loading={false} error="network error" />)
    expect(screen.getByText(/network error/)).toBeInTheDocument()
  })

  it('renders result cards when results exist', () => {
    render(<ResultsList results={mockResults} loading={false} error="" />)
    expect(screen.getByText('Result 1')).toBeInTheDocument()
    expect(screen.getByText('Result 2')).toBeInTheDocument()
  })

  it('renders pagination when results exist', () => {
    render(<ResultsList results={mockResults} loading={false} error="" />)
    expect(screen.getByText('Page')).toBeInTheDocument()
  })

  it('renders nothing before search', () => {
    const { container } = render(<ResultsList results={[]} loading={false} error="" />)
    expect(container.innerHTML).toBe('')
  })
})
