import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../components/Modal'

describe('Modal', () => {
  it('renders nothing when open is false', () => {
    const { container } = render(
      <Modal open={false} onClose={() => {}} ariaLabel="Test Modal">
        <p>Content</p>
      </Modal>
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders children when open is true', () => {
    render(
      <Modal open={true} onClose={() => {}} ariaLabel="Test Modal">
        <p>Modal Content</p>
      </Modal>
    )
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('has dialog role and aria-modal', () => {
    render(
      <Modal open={true} onClose={() => {}} ariaLabel="Test Modal">
        <p>Content</p>
      </Modal>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-label', 'Test Modal')
  })

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup()
    let closed = false
    render(
      <Modal open={true} onClose={() => { closed = true }} ariaLabel="Test Modal">
        <p>Content</p>
      </Modal>
    )
    await user.keyboard('{Escape}')
    expect(closed).toBe(true)
  })

  it('calls onClose when clicking the close button', async () => {
    const user = userEvent.setup()
    let closed = false
    render(
      <Modal open={true} onClose={() => { closed = true }} ariaLabel="Test Modal">
        <p>Content</p>
      </Modal>
    )
    await user.click(screen.getByRole('button', { name: /close dialog/i }))
    expect(closed).toBe(true)
  })
})
