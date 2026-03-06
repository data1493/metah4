import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchTabs from '../components/SearchTabs'

describe('SearchTabs', () => {
  const defaultProps = {
    activeTab: 'all' as const,
    onTabChange: () => {},
  }

  it('renders all four tabs', () => {
    render(<SearchTabs {...defaultProps} />)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Images')).toBeInTheDocument()
    expect(screen.getByText('Videos')).toBeInTheDocument()
    expect(screen.getByText('News')).toBeInTheDocument()
  })

  it('marks active tab with aria-selected', () => {
    render(<SearchTabs {...defaultProps} activeTab="images" />)
    expect(screen.getByText('Images')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('All')).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onTabChange when a tab is clicked', async () => {
    const user = userEvent.setup()
    let selected = ''
    render(<SearchTabs {...defaultProps} onTabChange={(tab) => { selected = tab }} />)

    await user.click(screen.getByText('News'))
    expect(selected).toBe('news')
  })

  it('has proper navigation role for accessibility', () => {
    render(<SearchTabs {...defaultProps} />)
    expect(screen.getByRole('navigation', { name: /search categories/i })).toBeInTheDocument()
  })

  it('supports arrow key navigation', async () => {
    const user = userEvent.setup()
    let selected = 'all'
    render(<SearchTabs activeTab="all" onTabChange={(tab) => { selected = tab }} />)

    // Focus the active tab and press ArrowRight
    await user.click(screen.getByText('All'))
    await user.keyboard('{ArrowRight}')
    expect(selected).toBe('images')
  })
})
