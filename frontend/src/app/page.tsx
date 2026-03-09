'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Endpoint = 'agent-run' | 'chat-message' | 'chat-execute'
type ChatMode = 'chat' | 'execute' | 'auto'
type ReportFormat = 'json' | 'markdown' | 'both'
type ReportOutput = 'inline' | 'file'

interface AgentMetrics {
  toolCount?: number
  failedToolCount?: number
  totalToolDurationMs?: number
  averageToolDurationMs?: number
  maxToolDurationMs?: number
  toolDurationMsByName?: Record<string, number>
}

interface AgentToolCall {
  tool: string
  status: 'success' | 'error'
  durationMs?: number
  errorCode?: string
  error?: string
}

interface AgentResult {
  traceId?: string
  startedAt?: string
  completedAt?: string
  durationMs?: number
  success?: boolean
  needsModelInput?: boolean
  response?: string
  plan?: string[]
  toolCalls?: AgentToolCall[]
  metrics?: AgentMetrics
  clarification?: { question?: string; missingFields?: string[] }
  artifacts?: Array<{ format: string; path: string }>
  report?: { summary?: string; markdown?: string }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const DEMO_MODEL_TEXT = JSON.stringify(
  {
    schema_version: '1.0.0',
    unit_system: 'SI',
    nodes: [
      { id: '1', x: 0, y: 0, z: 0, restraints: [true, true, true, true, true, true] },
      { id: '2', x: 3, y: 0, z: 0 },
    ],
    elements: [{ id: 'E1', type: 'beam', nodes: ['1', '2'], material: '1', section: '1' }],
    materials: [{ id: '1', name: 'steel', E: 205000, nu: 0.3, rho: 7850 }],
    sections: [{ id: '1', name: 'B1', type: 'beam', properties: { A: 0.01, Iy: 0.0001 } }],
    load_cases: [{ id: 'LC1', type: 'other', loads: [{ node: '2', fy: -10 }] }],
    load_combinations: [{ id: 'ULS', factors: { LC1: 1.0 } }],
  },
  null,
  2,
)

function parseMaybeJson(input: string): { ok: true; value: Record<string, unknown> } | { ok: false; message: string } {
  try {
    const value = JSON.parse(input)
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return { ok: false, message: '模型 JSON 必须是对象。' }
    }
    return { ok: true, value: value as Record<string, unknown> }
  } catch (error: any) {
    return { ok: false, message: `模型 JSON 解析失败: ${error.message}` }
  }
}

export default function Home() {
  const [endpoint, setEndpoint] = useState<Endpoint>('chat-message')
  const [mode, setMode] = useState<ChatMode>('auto')
  const [message, setMessage] = useState('请按这个模型做静力分析并按 GB50017 校核，最后生成报告。')
  const [conversationId, setConversationId] = useState('')
  const [traceId, setTraceId] = useState('')
  const [includeModel, setIncludeModel] = useState(true)
  const [modelFormat, setModelFormat] = useState('structuremodel-v1')
  const [analysisType, setAnalysisType] = useState<'static' | 'dynamic' | 'seismic' | 'nonlinear'>('static')
  const [reportFormat, setReportFormat] = useState<ReportFormat>('both')
  const [reportOutput, setReportOutput] = useState<ReportOutput>('inline')
  const [autoAnalyze, setAutoAnalyze] = useState(true)
  const [autoCodeCheck, setAutoCodeCheck] = useState(true)
  const [includeReport, setIncludeReport] = useState(true)
  const [modelText, setModelText] = useState(DEMO_MODEL_TEXT)

  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [rawResponse, setRawResponse] = useState('')
  const [result, setResult] = useState<AgentResult | null>(null)
  const [streamFrames, setStreamFrames] = useState<string[]>([])

  const endpointUrl = useMemo(() => {
    if (endpoint === 'agent-run') return `${API_BASE}/api/v1/agent/run`
    if (endpoint === 'chat-execute') return `${API_BASE}/api/v1/chat/execute`
    return `${API_BASE}/api/v1/chat/message`
  }, [endpoint])

  const statusTone = result?.success ? 'ok' : result ? 'fail' : 'idle'

  async function runRequest() {
    setLoading(true)
    setErrorText('')
    setRawResponse('')
    setResult(null)
    setStreamFrames([])

    let modelPayload: Record<string, unknown> | undefined
    if (includeModel) {
      const parsed = parseMaybeJson(modelText)
      if (!parsed.ok) {
        setLoading(false)
        setErrorText(parsed.message)
        return
      }
      modelPayload = parsed.value
    }

    const contextPayload = {
      model: modelPayload,
      modelFormat,
      analysisType,
      autoAnalyze,
      autoCodeCheck,
      includeReport,
      reportFormat,
      reportOutput,
    }

    const body =
      endpoint === 'chat-execute'
        ? {
            message,
            conversationId: conversationId || undefined,
            traceId: traceId || undefined,
            context: contextPayload,
          }
        : {
            message,
            mode,
            conversationId: conversationId || undefined,
            traceId: traceId || undefined,
            context: contextPayload,
          }

    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const payload = await response.json()
      setRawResponse(JSON.stringify(payload, null, 2))
      if (!response.ok) {
        setErrorText(payload?.message || `请求失败: HTTP ${response.status}`)
        return
      }

      const normalized = payload?.result || payload
      if (normalized && typeof normalized === 'object') {
        setResult(normalized as AgentResult)
      }
    } catch (error: any) {
      setErrorText(error.message || '请求失败')
    } finally {
      setLoading(false)
    }
  }

  async function runStream() {
    setLoading(true)
    setErrorText('')
    setRawResponse('')
    setResult(null)
    setStreamFrames([])

    let modelPayload: Record<string, unknown> | undefined
    if (includeModel) {
      const parsed = parseMaybeJson(modelText)
      if (!parsed.ok) {
        setLoading(false)
        setErrorText(parsed.message)
        return
      }
      modelPayload = parsed.value
    }

    const body = {
      message,
      mode,
      conversationId: conversationId || undefined,
      traceId: traceId || undefined,
      context: {
        model: modelPayload,
        modelFormat,
        analysisType,
        autoAnalyze,
        autoCodeCheck,
        includeReport,
        reportFormat,
        reportOutput,
      },
    }

    try {
      const response = await fetch(`${API_BASE}/api/v1/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!response.ok || !response.body) {
        setErrorText(`流式请求失败: HTTP ${response.status}`)
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let pending = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        pending += decoder.decode(value, { stream: true })
        const lines = pending.split('\n')
        pending = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data:')) continue
          const data = trimmed.slice(5).trim()
          if (data === '[DONE]') {
            setStreamFrames((prev) => [...prev, '[DONE]'])
            continue
          }
          setStreamFrames((prev) => [...prev, data])
          try {
            const parsed = JSON.parse(data)
            if (parsed?.type === 'result' && parsed?.content) {
              setResult(parsed.content as AgentResult)
              setRawResponse(JSON.stringify(parsed.content, null, 2))
            }
          } catch {
            // Keep raw frame for debugging.
          }
        }
      }
    } catch (error: any) {
      setErrorText(error.message || '流式请求失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="console-root">
      <section className="console-hero">
        <p className="console-kicker">StructureClaw Frontend Console</p>
        <h1>结构工程 AI 控制台</h1>
        <p>
          当前页面可直接调用 Agent 与 Chat 链路，验证 `mode` 路由、可观测字段、工具链执行与报告产物。
        </p>
      </section>

      <section className="console-grid">
        <Card className="console-card">
          <CardHeader>
            <CardTitle className="text-white">请求配置</CardTitle>
            <CardDescription className="text-zinc-300">
              选择入口、输入消息、设置执行上下文
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="field">
                <span>入口</span>
                <select value={endpoint} onChange={(e) => setEndpoint(e.target.value as Endpoint)}>
                  <option value="chat-message">/chat/message</option>
                  <option value="chat-execute">/chat/execute</option>
                  <option value="agent-run">/agent/run</option>
                </select>
              </label>
              <label className="field">
                <span>Mode</span>
                <select value={mode} onChange={(e) => setMode(e.target.value as ChatMode)} disabled={endpoint === 'chat-execute'}>
                  <option value="auto">auto</option>
                  <option value="execute">execute</option>
                  <option value="chat">chat</option>
                </select>
              </label>
            </div>

            <label className="field">
              <span>Message</span>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="field">
                <span>conversationId（可选）</span>
                <input value={conversationId} onChange={(e) => setConversationId(e.target.value)} placeholder="conv-001" />
              </label>
              <label className="field">
                <span>traceId（可选）</span>
                <input value={traceId} onChange={(e) => setTraceId(e.target.value)} placeholder="trace-demo-001" />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="field">
                <span>analysisType</span>
                <select value={analysisType} onChange={(e) => setAnalysisType(e.target.value as 'static' | 'dynamic' | 'seismic' | 'nonlinear')}>
                  <option value="static">static</option>
                  <option value="dynamic">dynamic</option>
                  <option value="seismic">seismic</option>
                  <option value="nonlinear">nonlinear</option>
                </select>
              </label>
              <label className="field">
                <span>reportFormat</span>
                <select value={reportFormat} onChange={(e) => setReportFormat(e.target.value as ReportFormat)}>
                  <option value="both">both</option>
                  <option value="json">json</option>
                  <option value="markdown">markdown</option>
                </select>
              </label>
              <label className="field">
                <span>reportOutput</span>
                <select value={reportOutput} onChange={(e) => setReportOutput(e.target.value as ReportOutput)}>
                  <option value="inline">inline</option>
                  <option value="file">file</option>
                </select>
              </label>
            </div>

            <div className="flag-row">
              <label><input type="checkbox" checked={includeModel} onChange={(e) => setIncludeModel(e.target.checked)} /> 携带模型</label>
              <label><input type="checkbox" checked={autoAnalyze} onChange={(e) => setAutoAnalyze(e.target.checked)} /> autoAnalyze</label>
              <label><input type="checkbox" checked={autoCodeCheck} onChange={(e) => setAutoCodeCheck(e.target.checked)} /> autoCodeCheck</label>
              <label><input type="checkbox" checked={includeReport} onChange={(e) => setIncludeReport(e.target.checked)} /> includeReport</label>
            </div>

            {includeModel && (
              <label className="field">
                <span>Model JSON（structuremodel-v1）</span>
                <textarea value={modelText} onChange={(e) => setModelText(e.target.value)} rows={10} />
                <small>modelFormat: {modelFormat}</small>
              </label>
            )}

            <div className="btn-row">
              <Button onClick={runRequest} disabled={loading}>发送请求</Button>
              <Button variant="secondary" onClick={runStream} disabled={loading}>流式执行（SSE）</Button>
            </div>

            <small className="text-zinc-300">API Base: {API_BASE}</small>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="console-card">
            <CardHeader>
              <CardTitle className="text-white">执行结果</CardTitle>
              <CardDescription className="text-zinc-300">
                Agent/Chat 返回的结构化信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="result-header">
                <span className={`status-pill ${statusTone}`}>
                  {statusTone === 'idle' ? 'idle' : statusTone === 'ok' ? 'success' : 'failed'}
                </span>
                <span className="mono">{result?.traceId || '-'}</span>
              </div>

              {result?.response && <p className="result-text">{result.response}</p>}
              {result?.clarification?.question && (
                <p className="result-warn">
                  澄清问题: {result.clarification.question}
                </p>
              )}

              {result?.metrics && (
                <div className="metric-grid">
                  <div><span>toolCount</span><strong>{result.metrics.toolCount ?? '-'}</strong></div>
                  <div><span>failedToolCount</span><strong>{result.metrics.failedToolCount ?? '-'}</strong></div>
                  <div><span>totalToolDurationMs</span><strong>{result.metrics.totalToolDurationMs ?? '-'}</strong></div>
                  <div><span>maxToolDurationMs</span><strong>{result.metrics.maxToolDurationMs ?? '-'}</strong></div>
                </div>
              )}

              {result?.plan && result.plan.length > 0 && (
                <div>
                  <h3 className="section-title">Plan</h3>
                  <ul className="bullet-list">
                    {result.plan.map((item, idx) => <li key={`${idx}-${item}`}>{item}</li>)}
                  </ul>
                </div>
              )}

              {result?.toolCalls && result.toolCalls.length > 0 && (
                <div>
                  <h3 className="section-title">Tool Calls</h3>
                  <div className="tool-table">
                    <div className="tool-row head">
                      <span>tool</span><span>status</span><span>duration(ms)</span><span>errorCode</span>
                    </div>
                    {result.toolCalls.map((call, idx) => (
                      <div className="tool-row" key={`${call.tool}-${idx}`}>
                        <span>{call.tool}</span>
                        <span>{call.status}</span>
                        <span>{call.durationMs ?? '-'}</span>
                        <span>{call.errorCode || '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result?.artifacts && result.artifacts.length > 0 && (
                <div>
                  <h3 className="section-title">Artifacts</h3>
                  <ul className="bullet-list">
                    {result.artifacts.map((artifact, idx) => (
                      <li key={`${artifact.path}-${idx}`}>{artifact.format}: {artifact.path}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="console-card">
            <CardHeader>
              <CardTitle className="text-white">调试输出</CardTitle>
              <CardDescription className="text-zinc-300">
                原始 JSON 与 SSE 帧
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {errorText && <p className="result-error">{errorText}</p>}
              <div>
                <h3 className="section-title">Raw JSON</h3>
                <pre>{rawResponse || '暂无'}</pre>
              </div>
              <div>
                <h3 className="section-title">Stream Frames</h3>
                <pre>{streamFrames.length > 0 ? streamFrames.join('\n') : '暂无'}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
