import { useCallback, useEffect, useRef, useState } from 'react'

export type SSEConnectionState = 'CONNECTING' | 'OPEN' | 'CLOSED'

export interface UseSSEOptions {
  url: string
  enabled?: boolean
  onMessage?: (data: string) => void
  onError?: (error: Event) => void
}

export interface UseSSEReturn {
  connectionState: SSEConnectionState
  error: Event | null
  data: string | null
  connect: () => void
  disconnect: () => void
}

/**
 * SSE streaming hook with lifecycle management.
 * Connects to SSE endpoint, handles reconnection with exponential backoff,
 * and cleans up on unmount.
 */
export function useSSE({
  url,
  enabled = true,
  onMessage,
  onError,
}: UseSSEOptions): UseSSEReturn {
  const [connectionState, setConnectionState] = useState<SSEConnectionState>('CONNECTING')
  const [error, setError] = useState<Event | null>(null)
  const [data, setData] = useState<string | null>(null)

  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttemptRef = useRef(0)

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    setConnectionState('CLOSED')
    reconnectAttemptRef.current = 0
  }, [])

  const connect = useCallback(() => {
    // Clean up existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    setConnectionState('CONNECTING')
    setError(null)

    const eventSource = new EventSource(url)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setConnectionState('OPEN')
      setError(null)
      reconnectAttemptRef.current = 0
    }

    eventSource.onmessage = (event) => {
      setData(event.data)
      onMessage?.(event.data)
    }

    eventSource.onerror = (err) => {
      setError(err)
      onError?.(err)

      if (eventSource.readyState === EventSource.CLOSED) {
        setConnectionState('CLOSED')
        // Exponential backoff reconnection (max 30s, max 5 attempts)
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 30000)
        reconnectAttemptRef.current++

        reconnectTimeoutRef.current = setTimeout(() => {
          if (reconnectAttemptRef.current <= 5) {
            connect()
          }
        }, delay)
      }
    }
  }, [url, onMessage, onError])

  useEffect(() => {
    if (enabled) {
      connect()
    }
    return () => {
      disconnect()
    }
  }, [enabled, connect, disconnect])

  return {
    connectionState,
    error,
    data,
    connect,
    disconnect,
  }
}
