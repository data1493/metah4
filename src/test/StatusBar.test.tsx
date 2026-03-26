import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StatusBar from '../components/StatusBar'

describe('StatusBar', () => {
  const defaultProps = {
    onShowProof: () => {},
    onShowLogs: () => {},
  }

  it('renders Privacy Proof and View Logs buttons', () => {
    render(<StatusBar {...defaultProps} />)
    expect(screen.getByText('Privacy Proof')).toBeInTheDocument()
    expect(screen.getByText('View Logs')).toBeInTheDocument()
  })

  it('does not show hash indicator', () => {
    render(<StatusBar {...defaultProps} />)
    expect(screen.queryByText('hashed on device')).not.toBeInTheDocument()
  })

  it('calls onShowProof when Privacy Proof is clicked', async () => {
    const user = userEvent.setup()
    let called = false
    render(<StatusBar {...defaultProps} onShowProof={() => { called = true }} />)
    await user.click(screen.getByText('Privacy Proof'))
    expect(called).toBe(true)
  })

  it('calls onShowLogs when View Logs is clicked', async () => {
    const user = userEvent.setup()
    let called = false
    render(<StatusBar {...defaultProps} onShowLogs={() => { called = true }} />)
    await user.click(screen.getByText('View Logs'))
    expect(called).toBe(true)
  })

  it('has toolbar role for accessibility', () => {
    render(<StatusBar {...defaultProps} />)
    expect(screen.getByRole('toolbar')).toBeInTheDocument()
  })
})
