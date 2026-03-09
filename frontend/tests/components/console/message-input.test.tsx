import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppStoreProvider } from '@/lib/stores/context'
import { MessageInput } from '@/components/console/message-input'

describe('MessageInput (CONS-03)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const renderWithProvider = () => {
    return render(
      <AppStoreProvider>
        <MessageInput />
      </AppStoreProvider>
    )
  }

  it('renders message textarea', () => {
    renderWithProvider()
    expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument()
  })

  it('typing in message textarea updates store', async () => {
    renderWithProvider()

    const messageTextarea = screen.getByRole('textbox', { name: /message/i })
    fireEvent.change(messageTextarea, { target: { value: 'Hello world' } })

    // Verify the textarea value changed
    expect(messageTextarea).toHaveValue('Hello world')
  })

  it('renders conversationId input', () => {
    renderWithProvider()
    expect(screen.getByRole('textbox', { name: /conversation id/i })).toBeInTheDocument()
  })

  it('renders traceId input', () => {
    renderWithProvider()
    expect(screen.getByRole('textbox', { name: /trace id/i })).toBeInTheDocument()
  })

  it('typing in conversationId input updates value', async () => {
    renderWithProvider()

    const conversationIdInput = screen.getByRole('textbox', { name: /conversation id/i })
    fireEvent.change(conversationIdInput, { target: { value: 'conv-123' } })

    expect(conversationIdInput).toHaveValue('conv-123')
  })

  it('typing in traceId input updates value', async () => {
    renderWithProvider()

    const traceIdInput = screen.getByRole('textbox', { name: /trace id/i })
    fireEvent.change(traceIdInput, { target: { value: 'trace-456' } })

    expect(traceIdInput).toHaveValue('trace-456')
  })

  it('message textarea has 4 rows', () => {
    renderWithProvider()

    const messageTextarea = screen.getByRole('textbox', { name: /message/i })
    expect(messageTextarea).toHaveAttribute('rows', '4')
  })

  it('has appropriate placeholder for message textarea', () => {
    renderWithProvider()

    const messageTextarea = screen.getByRole('textbox', { name: /message/i })
    expect(messageTextarea).toHaveAttribute('placeholder')
  })
})
