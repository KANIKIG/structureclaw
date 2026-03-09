import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Timeline } from '@/components/console/timeline'
import type { AgentToolCall } from '@/components/console/timeline/timeline-item'

describe('Timeline (CONS-10)', () => {
  it('renders empty state when no calls', () => {
    render(<Timeline calls={[]} />)
    expect(screen.getByText(/no tool calls/i)).toBeInTheDocument()
  })

  it('renders all tool calls in order', () => {
    const calls: AgentToolCall[] = [
      { tool: 'analyze', status: 'success', durationMs: 100 },
      { tool: 'report', status: 'success', durationMs: 200 },
    ]
    render(<Timeline calls={calls} />)

    expect(screen.getByText(/analyze/)).toBeInTheDocument()
    expect(screen.getByText(/report/)).toBeInTheDocument()
  })

  it('shows success icon for successful calls', () => {
    const calls: AgentToolCall[] = [
      { tool: 'analyze', status: 'success', durationMs: 100 },
    ]
    const { container } = render(<Timeline calls={calls} />)

    // Check for success indicator (green color or checkmark)
    expect(container.querySelector('[class*="text-green"]')).toBeTruthy()
  })

  it('shows error icon for failed calls', () => {
    const calls: AgentToolCall[] = [
      { tool: 'analyze', status: 'error', durationMs: 100 },
    ]
    const { container } = render(<Timeline calls={calls} />)

    // Check for error indicator (red color or x icon)
    expect(container.querySelector('[class*="text-red"]')).toBeTruthy()
  })

  it('displays duration', () => {
    const calls: AgentToolCall[] = [
      { tool: 'analyze', status: 'success', durationMs: 150 },
    ]
    render(<Timeline calls={calls} />)

    expect(screen.getByText(/150/)).toBeInTheDocument()
  })

  it('shows error message when present', () => {
    const calls: AgentToolCall[] = [
      { tool: 'analyze', status: 'error', error: 'Connection failed' },
    ]
    render(<Timeline calls={calls} />)

    expect(screen.getByText(/connection failed/i)).toBeInTheDocument()
  })
})
