import { memo } from 'react'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AgentToolCall {
  tool: string
  status: 'success' | 'error'
  durationMs?: number
  errorCode?: string
  error?: string
}

export interface TimelineItemProps {
  call: AgentToolCall
  index: number
}

/**
 * TimelineItem renders a single tool call in the execution timeline
 */
export const TimelineItem = memo(function TimelineItem({ call, index }: TimelineItemProps) {
  const isSuccess = call.status === 'success'

  return (
    <li
      className={cn(
        'relative pl-6 pb-4',
        'before:absolute before:left-[7px] before:top-6 before:bottom-0 before:w-px before:bg-border'
      )}
    >
      {/* Status marker */}
      <div
        className={cn(
          'absolute left-0 top-1 flex h-4 w-4 items-center justify-center rounded-full',
          isSuccess ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
        )}
      >
        {isSuccess ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <strong className="text-sm">
            {index + 1}. {call.tool}
          </strong>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {call.durationMs ?? '-'}ms
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          status: {call.status}
          {call.errorCode && ` | errorCode: ${call.errorCode}`}
        </p>

        {call.error && (
          <p className="text-xs text-red-500">{call.error}</p>
        )}
      </div>
    </li>
  )
})
