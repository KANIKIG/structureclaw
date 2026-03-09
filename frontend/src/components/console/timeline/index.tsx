import { TimelineItem, type AgentToolCall } from './timeline-item'

export type { AgentToolCall }

export interface TimelineProps {
  calls: AgentToolCall[]
}

/**
 * Timeline renders a list of tool calls in execution order
 */
export function Timeline({ calls }: TimelineProps) {
  if (calls.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No tool calls to display.</p>
    )
  }

  return (
    <ol className="relative">
      {calls.map((call, index) => (
        <TimelineItem key={`${call.tool}-${index}`} call={call} index={index} />
      ))}
    </ol>
  )
}
