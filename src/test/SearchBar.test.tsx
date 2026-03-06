import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '../components/SearchBar'

describe('SearchBar', () => {
  const defaultProps = {
    query: '',
    onQueryChange: () => {},
    onSearch: () => {},
    disabled: true,
  }

  it('renders search input and button', () => {
    render(<SearchBar {...defaultProps} />)
    expect(screen.getByPlaceholderText('search the underground...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit search/i })).toBeInTheDocument()
  })

  it('disables button when disabled prop is true', () => {
    render(<SearchBar {...defaultProps} disabled={true} />)
    expect(screen.getByRole('button', { name: /submit search/i })).toBeDisabled()
  })

  it('enables button when disabled prop is false', () => {
    render(<SearchBar {...defaultProps} disabled={false} />)
    expect(screen.getByRole('button', { name: /submit search/i })).toBeEnabled()
  })

  it('calls onQueryChange when typing', async () => {
    const user = userEvent.setup()
    let capturedValue = ''
    const onQueryChange = (v: string) => { capturedValue = v }
    render(<SearchBar {...defaultProps} onQueryChange={onQueryChange} />)

    await user.type(screen.getByPlaceholderText('search the underground...'), 'a')
    expect(capturedValue).toBe('a')
  })

  it('calls onSearch when Enter is pressed', async () => {
    const user = userEvent.setup()
    let called = false
    const onSearch = () => { called = true }
    render(<SearchBar {...defaultProps} query="test" onSearch={onSearch} />)

    await user.type(screen.getByPlaceholderText('search the underground...'), '{Enter}')
    expect(called).toBe(true)
  })

  it('has proper search role for accessibility', () => {
    render(<SearchBar {...defaultProps} />)
    expect(screen.getByRole('search')).toBeInTheDocument()
  })

  it('renders compact variant for header', () => {
    render(<SearchBar {...defaultProps} variant="header" />)
    expect(screen.getByPlaceholderText('search the underground...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit search/i })).toBeInTheDocument()
  })
})
