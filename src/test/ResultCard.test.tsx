import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResultCard from '../components/ResultCard'

const mockResult = {
  title: 'Test Result Title',
  description: 'A description of the test result.',
  url: 'https://example.com/test',
  hash: 'abc123',
  domain: 'example.com',
  isLocal: false,
}

describe('ResultCard', () => {
  it('renders the result title, domain, and description', () => {
    render(<ResultCard result={mockResult} index={0} />)
    expect(screen.getByText('Test Result Title')).toBeInTheDocument()
    expect(screen.getByText('A description of the test result.')).toBeInTheDocument()
    expect(screen.getByText('example.com')).toBeInTheDocument()
  })

  it('renders title as a link with correct href', () => {
    render(<ResultCard result={mockResult} index={0} />)
    const link = screen.getByText('Test Result Title')
    expect(link.closest('a')).toHaveAttribute('href', 'https://example.com/test')
    expect(link.closest('a')).toHaveAttribute('target', '_blank')
    expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('uses listitem role for accessibility', () => {
    render(<ResultCard result={mockResult} index={0} />)
    expect(screen.getByRole('listitem')).toBeInTheDocument()
  })

  it('renders with correct card styling', () => {
    const { container: c0 } = render(<ResultCard result={mockResult} index={0} />)
    expect(c0.querySelector('.card')).toBeInTheDocument()
  })

  it('shows LocalBadge when result isLocal', () => {
    render(<ResultCard result={{ ...mockResult, isLocal: true }} index={0} />)
    expect(screen.getByText('Local')).toBeInTheDocument()
  })

  it('does not show LocalBadge when result is not local', () => {
    render(<ResultCard result={mockResult} index={0} />)
    expect(screen.queryByText('Local')).not.toBeInTheDocument()
  })
})
