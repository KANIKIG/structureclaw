# StructureClaw Frontend

## What This Is

StructureClaw 前端重写项目 — 将现有工具化调试界面升级为极简现代的工程工作台，面向 AEC（Architecture, Engineering, Construction）行业的结构工程师。

使用 Next.js 14 + React 18 + Tailwind CSS，打造类似 Linear/Notion 的极简现代设计风格。

## Core Value

**美观、专业、易用的结构工程 AI 工作台** — 用户打开页面时感受到产品的专业性与现代感，而不是调试工具的粗糙感。

## Requirements

### Validated

现有后端与核心能力已验证可用：

- ✓ Agent 编排闭环：`text-to-model-draft → convert → validate → analyze → code-check → report`
- ✓ Chat/Execute 双模式 + SSE 流式
- ✓ 会话级缺参澄清
- ✓ 统一结构模型 StructureModel v1
- ✓ 报告导出（JSON/Markdown）
- ✓ 后端 API 全部可用（/api/v1/agent/run, /chat/*, /projects/*, 等）
- ✓ Core 分析引擎可用

### Active

前端重写需求：

- [ ] 设计系统：建立统一的视觉语言（颜色、字体、间距、圆角、阴影）
- [ ] 组件库：构建可复用的 UI 组件（Button、Card、Input、Select、Modal、等）
- [ ] 布局系统：响应式布局 + 侧边栏导航 + 顶部状态栏
- [ ] 首页重写：展示产品价值与快速入口
- [ ] 控制台重写：保留所有功能，全新视觉呈现
- [ ] 深色/浅色主题：支持主题切换
- [ ] 状态反馈：Loading、Success、Error 状态的优雅展示

### Out of Scope

- 新增后端 API — 前端重写不涉及后端改动
- 新增 Core 功能 — 前端重写不涉及分析引擎改动
- 移动端 App — 本轮只做 Web 响应式
- 国际化 (i18n) — 暂时保持中文

## Context

**现有前端状态：**
- 2 个页面：首页 `/`、控制台 `/console`
- 3 个组件：AgentConsole、Button、Card
- 使用自定义 CSS 类（`.console-root`、`.console-hero`）
- 风格偏工具化/调试化

**技术栈：**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- TypeScript

**设计参考：**
- Linear — 极简、留白、微妙的动效
- Notion — 干净、功能密集但不杂乱
- Vercel — 技术感、暗色主题

## Constraints

- **技术栈**：必须保持 Next.js + React + Tailwind，不换框架
- **兼容性**：必须保持与现有后端 API 的完全兼容
- **功能保留**：控制台所有现有功能必须保留（endpoint 选择、mode 切换、模型输入、流式执行、结果展示）

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 保持 Next.js + Tailwind | 避免技术栈迁移成本，团队熟悉 | — Pending |
| 极简现代风格 | 匹配工程工具的专业气质，提升用户信任感 | — Pending |
| 从零重写而非渐进优化 | 现有 CSS 架构不现代，重写更高效 | — Pending |

---
*Last updated: 2026-03-09 after initialization*
