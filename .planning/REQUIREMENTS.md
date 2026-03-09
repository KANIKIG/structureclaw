# Requirements: StructureClaw Frontend

**Defined:** 2026-03-09
**Core Value:** 美观、专业、易用的结构工程 AI 工作台

## v1 Requirements

前端重写需求，全部功能在 v1 实现。

### Design System

- [ ] **DSGN-01**: 建立设计令牌（颜色、字体、间距、圆角、阴影）
- [ ] **DSGN-02**: 配置 Geist 字体（Sans + Mono）
- [ ] **DSGN-03**: Tailwind 自定义配置（扩展主题）
- [ ] **DSGN-04**: `cn()` 工具函数（clsx + tailwind-merge）
- [ ] **DSGN-05**: 深色/浅色/System 三态主题切换
- [ ] **DSGN-06**: 自定义主题强调色
- [ ] **DSGN-07**: 玻璃态效果（glassmorphism）组件变体

### Components

- [ ] **COMP-01**: Button 组件（多尺寸、多变体）
- [ ] **COMP-02**: Card 组件
- [ ] **COMP-03**: Input 组件
- [ ] **COMP-04**: Textarea 组件
- [ ] **COMP-05**: Select 组件
- [ ] **COMP-06**: Dialog/Modal 组件
- [ ] **COMP-07**: Toast 通知组件（Sonner）
- [ ] **COMP-08**: Skeleton 加载组件
- [ ] **COMP-09**: Badge 组件
- [ ] **COMP-10**: Command Palette（Cmd/Ctrl+K）
- [ ] **COMP-11**: 微交互动画（hover、click、transition）

### Layout

- [ ] **LAYT-01**: 响应式侧边栏导航
- [ ] **LAYT-02**: 顶部状态栏
- [ ] **LAYT-03**: 路由分组（marketing/console）
- [ ] **LAYT-04**: 根布局 Provider 封装
- [ ] **LAYT-05**: 可拖拽分屏面板布局

### Pages

- [ ] **PAGE-01**: 首页重写（产品展示 + 快速入口）
- [ ] **PAGE-02**: 控制台页面重写

### Console

- [ ] **CONS-01**: 端点选择 UI（agent-run, chat-message, chat-execute）
- [ ] **CONS-02**: Mode 选择 UI（chat, execute, auto）
- [ ] **CONS-03**: 消息输入区域
- [ ] **CONS-04**: 模型 JSON 输入区域（可折叠）
- [ ] **CONS-05**: 配置选项面板（analysisType, reportFormat, reportOutput）
- [ ] **CONS-06**: 复选框组（includeModel, autoAnalyze, autoCodeCheck, includeReport）
- [ ] **CONS-07**: 执行按钮（同步 + SSE 流式）
- [ ] **CONS-08**: 执行结果展示（traceId, status, response）
- [ ] **CONS-09**: 指标展示（toolCount, durationMs 等）
- [ ] **CONS-10**: 工具调用时间线（执行顺序、状态、耗时）
- [ ] **CONS-11**: Artifacts 列表展示
- [ ] **CONS-12**: SSE 流式执行支持
- [ ] **CONS-13**: 流状态指示器（连接中、接收中、完成）
- [ ] **CONS-14**: 调试输出面板（Raw JSON + Stream Frames）
- [ ] **CONS-15**: 错误状态展示
- [ ] **CONS-16**: 澄清问题展示（缺参提示）
- [ ] **CONS-17**: 报告摘要展示

### State & Data

- [ ] **STAT-01**: Zustand store 工厂模式（SSR 兼容）
- [ ] **STAT-02**: API 客户端层（fetch 封装）
- [ ] **STAT-03**: SSE 流式 hook
- [ ] **STAT-04**: 主题状态管理

### Accessibility

- [ ] **ACCS-01**: 键盘导航支持（Tab、Enter、Escape）
- [ ] **ACCS-02**: Focus 管理
- [ ] **ACCS-03**: 语义化 HTML
- [ ] **ACCS-04**: ARIA 标签

## v2 Requirements

后续版本考虑的功能。

### Advanced Features

- **ADV-01**: 国际化 (i18n)
- **ADV-02**: 结果可视化图表（位移图、内力图）
- **ADV-03**: 模型 3D 预览
- **ADV-04**: 历史记录管理
- **ADV-05**: 用户设置持久化

## Out of Scope

明确排除的功能，防止范围蔓延。

| Feature | Reason |
|---------|--------|
| 后端 API 改动 | 前端重写不涉及后端 |
| Core 分析引擎改动 | 前端重写不涉及分析引擎 |
| 移动端 App | 本轮只做 Web 响应式 |
| 国际化 (i18n) | 暂时保持中文 |
| 用户认证系统 | 使用现有后端认证 |
| 数据库改动 | 使用现有后端数据层 |

## Traceability

哪个阶段覆盖哪个需求。在 roadmap 创建时更新。

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSGN-01 | Phase 1 | Pending |
| DSGN-02 | Phase 1 | Pending |
| DSGN-03 | Phase 1 | Pending |
| DSGN-04 | Phase 1 | Pending |
| DSGN-05 | Phase 1 | Pending |
| DSGN-06 | Phase 1 | Pending |
| DSGN-07 | Phase 1 | Pending |
| COMP-01 | Phase 2 | Pending |
| COMP-02 | Phase 2 | Pending |
| COMP-03 | Phase 2 | Pending |
| COMP-04 | Phase 2 | Pending |
| COMP-05 | Phase 2 | Pending |
| COMP-06 | Phase 2 | Pending |
| COMP-07 | Phase 2 | Pending |
| COMP-08 | Phase 2 | Pending |
| COMP-09 | Phase 2 | Pending |
| COMP-10 | Phase 2 | Pending |
| COMP-11 | Phase 2 | Pending |
| LAYT-01 | Phase 3 | Pending |
| LAYT-02 | Phase 3 | Pending |
| LAYT-03 | Phase 3 | Pending |
| LAYT-04 | Phase 3 | Pending |
| LAYT-05 | Phase 3 | Pending |
| STAT-01 | Phase 4 | Pending |
| STAT-02 | Phase 4 | Pending |
| STAT-03 | Phase 4 | Pending |
| STAT-04 | Phase 4 | Pending |
| PAGE-01 | Phase 5 | Pending |
| PAGE-02 | Phase 5 | Pending |
| CONS-01 | Phase 5 | Pending |
| CONS-02 | Phase 5 | Pending |
| CONS-03 | Phase 5 | Pending |
| CONS-04 | Phase 5 | Pending |
| CONS-05 | Phase 5 | Pending |
| CONS-06 | Phase 5 | Pending |
| CONS-07 | Phase 5 | Pending |
| CONS-08 | Phase 5 | Pending |
| CONS-09 | Phase 5 | Pending |
| CONS-10 | Phase 5 | Pending |
| CONS-11 | Phase 5 | Pending |
| CONS-12 | Phase 5 | Pending |
| CONS-13 | Phase 5 | Pending |
| CONS-14 | Phase 5 | Pending |
| CONS-15 | Phase 5 | Pending |
| CONS-16 | Phase 5 | Pending |
| CONS-17 | Phase 5 | Pending |
| ACCS-01 | Phase 6 | Pending |
| ACCS-02 | Phase 6 | Pending |
| ACCS-03 | Phase 6 | Pending |
| ACCS-04 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 47 total
- Mapped to phases: 47
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-09*
*Last updated: 2026-03-09 after initial definition*
