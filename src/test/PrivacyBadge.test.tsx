import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PrivacyBadge from '../components/PrivacyBadge'

describe('PrivacyBadge', () => {
  it('shows idle state when not hashed', () => {
    render(<PrivacyBadge hashed={false} onClick={() => {}} />)
    expect(screen.getByText('Privacy Protected')).toBeInTheDocument()
  })

  it('shows active state when hashed', () => {
    render(<PrivacyBadge hashed={true} onClick={() => {}} />)
    expect(screen.getByText('hashed on device + proxied anonymously')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    let clicked = false
    render(<PrivacyBadge hashed={false} onClick={() => { clicked = true }} />)
    await user.click(screen.getByText('Privacy Protected'))
    expect(clicked).toBe(true)
  })

  it('renders compact variant for header', () => {
    render(<PrivacyBadge hashed={true} hashValue="abcdef1234567890" onClick={() => {}} variant="header" />)
    expect(screen.getByText(/abcdef123456/)).toBeInTheDocument()
  })
})
