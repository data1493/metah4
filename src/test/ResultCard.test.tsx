import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResultCard from '../components/ResultCard'

const mockResult = {
  title: 'Test Result Title',
  description: 'A description of the test result.',
  url: 'https://example.com/test',
  hash: 'abc123',
}

describe('ResultCard', () => {
  it('renders the result title, URL, and description', () => {
    render(<ResultCard result={mockResult} index={0} />)
    expect(screen.getByText('Test Result Title')).toBeInTheDocument()
    expect(screen.getByText('A description of the test result.')).toBeInTheDocument()
    expect(screen.getByText('https://example.com/test')).toBeInTheDocument()
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

  it('alternates border styles for even/odd indices', () => {
    const { container: c0 } = render(<ResultCard result={mockResult} index={0} />)
    expect(c0.querySelector('.pulse-border-gold')).toBeInTheDocument()

    const { container: c1 } = render(<ResultCard result={mockResult} index={1} />)
    expect(c1.querySelector('.pulse-border-purple')).toBeInTheDocument()
  })
})
