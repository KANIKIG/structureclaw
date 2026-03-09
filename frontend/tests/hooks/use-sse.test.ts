import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { useSSE, type SSEConnectionState } from '@/hooks/use-sse'

// Type for our mock EventSource
interface MockEventSourceInstance {
  url: string
  readyState: number
  onopen: ((ev: Event) => any) | null
  onmessage: ((ev: MessageEvent) => any) | null
  onerror: ((ev: Event) => any) | null
  close: () => void
  addEventListener: () => void
  removeEventListener: () => void
}

// Get access to the mock EventSource constructor
const MockEventSource = global.EventSource as unknown as {
  new (url: string): MockEventSourceInstance
  CONNECTING: number
  OPEN: number
  CLOSED: number
}

describe('useSSE (STAT-03)', () => {
  const testUrl = 'http://localhost:8000/api/stream'

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns CONNECTING state initially', () => {
    const { result } = renderHook(() =>
      useSSE({ url: testUrl, enabled: true })
    )

    expect(result.current.connectionState).toBe('CONNECTING')
  })

  it('transitions to OPEN when connection established', async () => {
    const { result } = renderHook(() =>
      useSSE({ url: testUrl, enabled: true })
    )

    expect(result.current.connectionState).toBe('CONNECTING')

    // Advance timers to let mock EventSource fire onopen
    await act(async () => {
      vi.advanceTimersByTime(10)
    })

    expect(result.current.connectionState).toBe('OPEN')
  })

  it('calls onMessage callback with received data', async () => {
    const onMessage = vi.fn()

    renderHook(() =>
      useSSE({ url: testUrl, enabled: true, onMessage })
    )

    await act(async () => {
      vi.advanceTimersByTime(10)
    })

    // Simulate receiving a message
    await act(async () => {
      // Get the most recent EventSource instance
      const instances = (global.EventSource as any).__instances || []
      const lastInstance = instances[instances.length - 1] as MockEventSourceInstance
      if (lastInstance?.onmessage) {
        lastInstance.onmessage(new MessageEvent('message', { data: 'test data' }))
      }
    })

    expect(onMessage).toHaveBeenCalledWith('test data')
  })

  it('calls onError callback on error', async () => {
    const onError = vi.fn()

    renderHook(() =>
      useSSE({ url: testUrl, enabled: true, onError })
    )

    await act(async () => {
      vi.advanceTimersByTime(10)
    })

    // Simulate an error
    await act(async () => {
      const instances = (global.EventSource as any).__instances || []
      const lastInstance = instances[instances.length - 1] as MockEventSourceInstance
      if (lastInstance?.onerror) {
        lastInstance.onerror(new Event('error'))
      }
    })

    expect(onError).toHaveBeenCalled()
  })

  it('disconnects on unmount (cleanup)', async () => {
    const { unmount } = renderHook(() =>
      useSSE({ url: testUrl, enabled: true })
    )

    await act(async () => {
      vi.advanceTimersByTime(10)
    })

    // Track close calls before unmount
    const instances = (global.EventSource as any).__instances || []
    const lastInstance = instances[instances.length - 1] as MockEventSourceInstance
    const closeSpy = vi.spyOn(lastInstance, 'close')

    unmount()

    expect(closeSpy).toHaveBeenCalled()
  })

  it('does not connect when enabled=false', () => {
    // Track new EventSource instances
    const instanceCountBefore = ((global.EventSource as any).__instances || []).length

    renderHook(() =>
      useSSE({ url: testUrl, enabled: false })
    )

    const instanceCountAfter = ((global.EventSource as any).__instances || []).length

    // No new EventSource should be created
    expect(instanceCountAfter).toBe(instanceCountBefore)
  })

  it('connect() method creates new EventSource', async () => {
    const { result } = renderHook(() =>
      useSSE({ url: testUrl, enabled: false })
    )

    const instanceCountBefore = ((global.EventSource as any).__instances || []).length

    await act(async () => {
      result.current.connect()
    })

    const instanceCountAfter = ((global.EventSource as any).__instances || []).length

    expect(instanceCountAfter).toBe(instanceCountBefore + 1)
  })

  it('disconnect() method closes EventSource', async () => {
    const { result } = renderHook(() =>
      useSSE({ url: testUrl, enabled: true })
    )

    await act(async () => {
      vi.advanceTimersByTime(10)
    })

    const instances = (global.EventSource as any).__instances || []
    const lastInstance = instances[instances.length - 1] as MockEventSourceInstance
    const closeSpy = vi.spyOn(lastInstance, 'close')

    await act(async () => {
      result.current.disconnect()
    })

    expect(closeSpy).toHaveBeenCalled()
    expect(result.current.connectionState).toBe('CLOSED')
  })
})
