'use client'

import { useStore } from '@/lib/stores/context'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

/**
 * MessageInput - Message and context fields input
 *
 * CONS-03: User can input message text
 * Also includes optional conversationId and traceId inputs
 */
export function MessageInput() {
  const message = useStore((state) => state.message)
  const conversationId = useStore((state) => state.conversationId)
  const traceId = useStore((state) => state.traceId)
  const setMessage = useStore((state) => state.setMessage)
  const setConversationId = useStore((state) => state.setConversationId)
  const setTraceId = useStore((state) => state.setTraceId)

  return (
    <div className="space-y-4">
      {/* Main Message Textarea */}
      <div className="space-y-2">
        <label htmlFor="message-input" className="text-sm font-medium">
          Message
        </label>
        <Textarea
          id="message-input"
          aria-label="Message"
          placeholder="Enter your message..."
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* Secondary Fields Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Conversation ID Input */}
        <div className="space-y-2">
          <label htmlFor="conversation-id" className="text-sm font-medium">
            Conversation ID
          </label>
          <Input
            id="conversation-id"
            aria-label="Conversation ID"
            type="text"
            placeholder="optional"
            value={conversationId ?? ''}
            onChange={(e) => setConversationId(e.target.value || null)}
          />
        </div>

        {/* Trace ID Input */}
        <div className="space-y-2">
          <label htmlFor="trace-id" className="text-sm font-medium">
            Trace ID
          </label>
          <Input
            id="trace-id"
            aria-label="Trace ID"
            type="text"
            placeholder="optional"
            value={traceId ?? ''}
            onChange={(e) => setTraceId(e.target.value || null)}
          />
        </div>
      </div>
    </div>
  )
}
