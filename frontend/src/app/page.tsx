import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="console-root">
      <section className="console-hero">
        <p className="console-kicker">StructureClaw Frontend</p>
        <h1>结构工程工作台</h1>
        <p>当前前端已提供可直接联调的控制台页面，用于验证 Agent/Chat 执行链路、回归字段与报告产物。</p>
        <div className="btn-row" style={{ marginTop: 14 }}>
          <Link href="/console"><Button>打开控制台</Button></Link>
        </div>
      </section>
    </main>
  )
}
