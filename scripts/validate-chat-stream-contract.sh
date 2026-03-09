#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

npm run build --prefix backend >/dev/null

node - <<'JS'
const assert = (cond, msg) => {
  if (!cond) {
    throw new Error(msg);
  }
};

const parseSseEvents = (raw) => raw
  .split('\n\n')
  .map((chunk) => chunk.trim())
  .filter(Boolean)
  .filter((chunk) => chunk.startsWith('data: '))
  .map((chunk) => chunk.slice('data: '.length));

const run = async () => {
  const { createRequire } = await import('node:module');
  const require = createRequire(process.cwd() + '/backend/package.json');
  const Fastify = require('fastify');

  const { AgentService } = await import('./backend/dist/services/agent.js');
  AgentService.prototype.runStream = async function *mockRunStream() {
    const traceId = 'stream-trace-001';
    yield { type: 'start', content: { traceId, mode: 'execute' } };
    yield {
      type: 'result',
      content: {
        traceId,
        durationMs: 8,
        success: true,
        mode: 'rule-based',
        needsModelInput: false,
        plan: ['validate', 'analyze', 'report'],
        toolCalls: [],
        response: 'ok',
      },
    };
    yield { type: 'done' };
  };

  const { chatRoutes } = await import('./backend/dist/api/chat.js');
  const app = Fastify();
  await app.register(chatRoutes, { prefix: '/api/v1/chat' });

  const resp = await app.inject({
    method: 'POST',
    url: '/api/v1/chat/stream',
    payload: {
      message: 'stream contract test',
      mode: 'execute',
      context: {
        model: { schema_version: '1.0.0' },
      },
    },
  });

  assert(resp.statusCode === 200, 'chat/stream should return 200');
  const events = parseSseEvents(resp.body);
  assert(events.length >= 4, 'stream should include events and done marker');
  assert(events[events.length - 1] === '[DONE]', 'stream should end with [DONE]');

  const chunks = events
    .filter((item) => item !== '[DONE]')
    .map((item) => JSON.parse(item));
  assert(chunks[0].type === 'start', 'first chunk should be start');
  assert(chunks.some((c) => c.type === 'result'), 'stream should contain result chunk');
  assert(chunks[chunks.length - 1].type === 'done', 'last chunk before [DONE] should be done');

  const startTrace = chunks.find((c) => c.type === 'start')?.content?.traceId;
  const resultTrace = chunks.find((c) => c.type === 'result')?.content?.traceId;
  assert(startTrace && resultTrace && startTrace === resultTrace, 'traceId should match between start and result');

  await app.close();
  console.log('[ok] chat stream contract regression');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
JS
