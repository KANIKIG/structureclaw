import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AppStoreProvider, useStore, createAppStore, initStore } from '@/lib/stores/context'
import type { StoreState } from '@/lib/stores/context'
import { createElement, useState } from 'react'

describe('Store Context (STAT-01)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('AppStoreProvider renders children without error', () => {
    render(
      <AppStoreProvider>
        <div>Child Content</div>
      </AppStoreProvider>
    )
    expect(screen.getByText('Child Content')).toBeInTheDocument()
  })

  it('useStore throws error when used outside AppStoreProvider', () => {
    // Component that uses useStore outside provider
    function TestComponent() {
      try {
        useStore((state) => state.endpoint)
        return <div>No Error</div>
      } catch (e) {
        return <div>Error: {(e as Error).message}</div>
      }
    }

    render(<TestComponent />)
    expect(screen.getByText(/Error:/)).toBeInTheDocument()
    expect(screen.getByText(/useStore must be used within AppStoreProvider/)).toBeInTheDocument()
  })

  it('useStore returns selected state from store', () => {
    function TestComponent() {
      const endpoint = useStore((state) => state.endpoint)
      return <div data-testid="endpoint">{endpoint}</div>
    }

    render(
      <AppStoreProvider>
        <TestComponent />
      </AppStoreProvider>
    )

    expect(screen.getByTestId('endpoint')).toHaveTextContent('chat-message')
  })

  it('Multiple components share same store instance within provider', () => {
    function ComponentA() {
      const mode = useStore((state) => state.mode)
      return <div data-testid="mode-a">{mode}</div>
    }

    function ComponentB() {
      const mode = useStore((state) => state.mode)
      return <div data-testid="mode-b">{mode}</div>
    }

    render(
      <AppStoreProvider>
        <ComponentA />
        <ComponentB />
      </AppStoreProvider>
    )

    // Both components should show the same initial value
    expect(screen.getByTestId('mode-a')).toHaveTextContent('auto')
    expect(screen.getByTestId('mode-b')).toHaveTextContent('auto')
  })

  it('Store state updates propagate to all consumers', async () => {
    function SetterComponent() {
      const { mode, setMode } = useStore((state) => ({
        mode: state.mode,
        setMode: state.setMode,
      }))
      return (
        <button onClick={() => setMode('chat')} data-testid="setter">
          Set Mode: {mode}
        </button>
      )
    }

    function ReaderComponent() {
      const mode = useStore((state) => state.mode)
      return <div data-testid="reader">{mode}</div>
    }

    render(
      <AppStoreProvider>
        <SetterComponent />
        <ReaderComponent />
      </AppStoreProvider>
    )

    // Initial state
    expect(screen.getByTestId('setter')).toHaveTextContent('Set Mode: auto')
    expect(screen.getByTestId('reader')).toHaveTextContent('auto')

    // Click to update
    fireEvent.click(screen.getByTestId('setter'))

    // Both components should reflect the change
    await waitFor(() => {
      expect(screen.getByTestId('setter')).toHaveTextContent('Set Mode: chat')
      expect(screen.getByTestId('reader')).toHaveTextContent('chat')
    })
  })
})

describe('createAppStore and initStore', () => {
  it('initStore returns correct initial state', () => {
    const state = initStore()
    expect(state.endpoint).toBe('chat-message')
    expect(state.mode).toBe('auto')
    expect(state.conversationId).toBeNull()
    expect(state.traceId).toBeNull()
  })

  it('createAppStore creates a store with initial state', () => {
    const store = createAppStore()
    const state = store.getState()
    expect(state.endpoint).toBe('chat-message')
    expect(state.mode).toBe('auto')
  })

  it('createAppStore accepts custom initial state', () => {
    const customState = initStore()
    customState.endpoint = 'agent-run'
    customState.mode = 'execute'

    const store = createAppStore(customState)
    const state = store.getState()

    expect(state.endpoint).toBe('agent-run')
    expect(state.mode).toBe('execute')
  })

  it('store actions work correctly', () => {
    const store = createAppStore()

    store.getState().setEndpoint('chat-execute')
    expect(store.getState().endpoint).toBe('chat-execute')

    store.getState().setConversationId('test-conv-123')
    expect(store.getState().conversationId).toBe('test-conv-123')

    store.getState().resetConsole()
    expect(store.getState().endpoint).toBe('chat-message')
    expect(store.getState().conversationId).toBeNull()
  })
})
