import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PrivacyBadge from '../components/PrivacyBadge'

describe('PrivacyBadge', () => {
  it('shows Privacy Protected text', () => {
    render(<PrivacyBadge onClick={() => {}} />)
    expect(screen.getByText('Privacy Protected')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    let clicked = false
    render(<PrivacyBadge onClick={() => { clicked = true }} />)
    await user.click(screen.getByText('Privacy Protected'))
    expect(clicked).toBe(true)
  })

  it('renders header variant without error', () => {
    render(<PrivacyBadge onClick={() => {}} variant="header" />)
    expect(screen.getByText('Privacy Protected')).toBeInTheDocument()
  })
})
