# Plugin Session Export

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[3073bd8](https://github.com/whyihaveyou/dsh-suite/tree/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/whyihaveyou/dsh-suite) [![npm 30d 135](https://img.shields.io/static/v1?label=npm+30d&message=135&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dsh-suite/plugin-session-export) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dsh-suite/plugin-session-export)
<!-- END META -->

> **功能**：把 DSH live 会话投影为可读 Markdown 或自包含 HTML，并可隐藏工具参数结果

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 把同一事件投影输出两类便读报告，HTML escaping与动态代码围栏具体减少展示破坏，便于人工复盘；非新记忆/审计算法。

> **主要限制**：[Q03](#research-q03) mini仍含system/reasoning/路径，逐文件覆盖写失败可部分落盘；[Q02](#research-q02)首prompt末模型和regex委派标签丢时间/关系，不能当安全分享或完整轨迹。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 谁把什么内容交付给谁，较原生日志多什么？](#detail-section-11)
  - [Q02 · 投影是否保留完整轨迹和准确来源？](#detail-section-12)
  - [Q03 · 分享版、安全访问和写入恢复有哪些边界？](#detail-section-13)
  - [Q04 · 如何启动验收、采用与退出？](#detail-section-14)
  - [Q05 · 怎样变成可检查的分享交付？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人DSH用户整理对话供复盘/周报，见 [Q01](#research-q01)。

原生raw JSONL与人工复制整理；此处是格式投影，不替代日志存证、权限或完整多模态档案。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| md/html投影 | 人读复盘 | 不含所有事件/多模态，非完整档案 |
| mini | 隐工具参数/结果 | system/reasoning/正文/路径仍保留 |
| 单个/批量live | 文件导出 | 不自动读取历史/递归child日志 |
| 来源/用量 | 元信息摘要 | 首prompt末model、非计费账单 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
|---|---|---|
| DSH tools/sessions | 注册与取live会话 | 本工具不新增项目授权边界 |
| 构建dist/兼容peer | 执行入口 | 发布制品与兼容未知 |
| 本地目录写权限 | 保存md/html | 可覆盖进程可写路径 |
| 人工审阅 | 对外分享 | mini不等于脱敏 |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
|---|---|---|
| 准备 | 去敏当前会话、新目录与备份 | 暂不用all |
| 导出 | 明确格式/path，核返回清单 | 失败先看已有文件不直接重跑 |
| 校验 | 对比JSONL字段与顺序 | 子agent标签非自动完整链 |
| 分享 | 删除prompt/reasoning/路径等敏感字段 | 隐工具细节不代替审阅 |
| 退出 | 卸载后管理文件副本 | 已分享/覆盖内容不自动撤回 |

**效果与成本**

#### 成本

| 阶段 | 资源现金 | 人工时间与未知 |
|---|---|---|
| 首次 | 构建与本地存储，无直接模型必需 | 兼容/字段比对，工时费用未知 |
| 持续 | 导出副本磁盘 | 去敏/完整性检查，净节时未测 |
| 失败 | 部分已写、覆盖风险 | 核文件和备份恢复 |
| 退出 | 文件仍留本地与分享方 | 清理/撤回另行操作 |

#### 效果

| 效果 | 支持 | 未知 |
|---|---|---|
| 可读性 | turn/消息/工具分区与内联HTML | 实际读者理解与节时 |
| 渲染 | escape与围栏处理 | 当前宿主/浏览器实测 |
| 完整归档 | 部分事件投影 | 附件/完整委派/动态prompt未保全 |
| 安全分享 | 工具参数结果可隐藏 | 其余敏感字段仍可能泄露 |

> **思考**：[Q03](#research-q03) mini仍含system/reasoning/路径，逐文件覆盖写失败可部分落盘；[Q02](#research-q02)首prompt末模型和regex委派标签丢时间/关系，不能当安全分享或完整轨迹。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 把同一事件投影输出两类便读报告，HTML escaping与动态代码围栏具体减少展示破坏，便于人工复盘；非新记忆/审计算法。

单一Section投影统一md/html、动态fence及HTML escaping是清晰实现；渲染成功与写入成功/不半写分属不同保证，顺序writeFile没有全局回滚。权限归属依赖宿主，本文不推断多租户安全。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) mini仍含system/reasoning/路径，逐文件覆盖写失败可部分落盘；[Q02](#research-q02)首prompt末模型和regex委派标签丢时间/关系，不能当安全分享或完整轨迹。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议个人去敏单会话有限试用，写新目录并对JSONL核查；mini必须人工审阅后才分享。涉及跨会话all、重要旧文件或原始prompt敏感内容时停用批量，保留JSONL并手工整理。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持工具注册与两格式投影；作者合成渲染不代替真实落盘和权限验收，本轮未执行。

- 已检查：作者 README、包清单、源码路径 packages/plugins/plugin-session-export/src/index.ts、packages/plugins/plugin-session-export/README.md、packages/plugins/plugin-session-export/package.json、packages/plugins/plugin-session-export/scripts/render-smoke.mjs 及固定范围 inventory；组件：packages/plugins/plugin-session-export。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整458行src与合成render-smoke、package和作者验收说明已读；未检查DSH store授权实现或执行浏览器/文件故障。
- 下一步：本轮仅源码，未构建、调用export_session、渲染或写真实导出。作者14断言/截图及注册记录均是作者声明，E2E未闭环明确保留。

**分析版本**

- **仓库**：[whyihaveyou/dsh-suite](https://github.com/whyihaveyou/dsh-suite)
- **版本号**：0.2.0（[固定提交 3073bd8](https://github.com/whyihaveyou/dsh-suite/tree/3073bd8895d2f8478b9cb06f6b265977d7511d65)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证的最少字段、授权范围、seq覆盖清单及不覆盖逐项结果契约，以秘密prompt/模型切换/第二项失败反例验收。

本轮仅源码，未构建、调用export_session、渲染或写真实导出。作者14断言/截图及注册记录均是作者声明，E2E未闭环明确保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 137 | — | — | 995 |
| .mjs | source | 1 | 55 | 50 | 1 | — |
| .ts | source | 1 | 458 | 410 | 17 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/whyihaveyou/dsh-suite/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分可读报告与完整、安全、可恢复分享交付。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁把什么内容交付给谁，较原生日志多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要把DSH对话贴到复盘/周报或供同事阅读的用户，可用export_session生成Markdown或内联样式HTML。工具注册依赖tools/sessions，可选当前、指定id或全部live sessions，输出文件路径与数量；无当前agent时回退store.list最后一项，不保证就是用户期望会话。相对raw JSONL，贡献是把消息、已有reasoning、工具参数结果、todo和元信息做可读投影，而非新的记忆检索或审计存证。模型可调用是入口，渲染函数本身不依赖外部模型；完整端到端执行仍未验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-session-export/src/index.ts:12-39](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/src/index.ts#L12-L39)

export_session参数与入口。

<details>
<summary>查看原文（28行）</summary>

```text
export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'export_session',
    description:
      'Export the current session (or all live sessions) as a human-readable Markdown or HTML file, ' +
      'grouped by trajectory source: system prompt, reasoning (thinking), tool calls, and subagent delegations. ' +
      'Unlike the built-in raw JSONL exporter, this produces prose you can paste into a doc or report.',
    parameters: {
      format: {
        type: 'string',
        enum: ['markdown', 'html'],
        description: "Output format. Default 'markdown'.",
      },
      path: {
        type: 'string',
        description: 'Output directory, or an exact file path ending in .md/.html. Default: the session workspace (cwd).',
      },
      sessionId: {
        type: 'string',
        description: 'Session id to export. Default: the current session.',
      },
      all: {
        type: 'boolean',
        description: 'Export every live session (batch) instead of a single one.',
      },
      includeToolDetails: {
        type: 'boolean',
        description: "Include tool-call arguments and results in the export. When false, only the tool name is kept (cleaner share). Default true.",
```

</details>

**依据 2 · 源码核查**：[packages/plugins/plugin-session-export/src/index.ts:57-94](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/src/index.ts#L57-L94)

会话选择与文件输出。

<details>
<summary>查看原文（38行）</summary>

```text
    async execute(args, exec) {
      const format = (args.format ?? 'markdown') as 'markdown' | 'html'
      const includeToolDetails = args.includeToolDetails !== false
      const store = ctx.sessions

      let sessions: Session[]
      if (args.all) {
        sessions = store.list()
      } else if (args.sessionId) {
        const found = store.get(SessionId(args.sessionId))
        sessions = found ? [found] : []
      } else {
        const current = exec.agent?.session
        const listed = store.list()
        if (current) sessions = [current]
        else if (listed.length > 0) sessions = [listed[listed.length - 1]]
        else sessions = []
      }
      if (sessions.length === 0) {
        throw new Error('export_session: 没有可导出的会话（无 live session 且未指定 sessionId）')
      }

      const files: string[] = []
      for (const session of sessions) {
        const content = renderSession(session, format, { includeToolDetails })
        const file = outputPath(args.path, session, format, args.all === true)
        await mkdir(dirname(file), { recursive: true })
        await writeFile(file, content, 'utf8')
        files.push(file)
      }
      return { format, count: files.length, files }
    },
  }))

  // Self-check (spike-style): prove the tool landed in the registry.
  console.log(
    `[plugin-session-export] registered "export_session" — listed=${ctx.tools.get('export_session') !== undefined}`,
  )
```

</details>

**依据 3 · 源码核查**：[packages/plugins/plugin-session-export/src/index.ts:128-132](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/src/index.ts#L128-L132)

共享渲染函数。

```text
export function renderSession(session: Session, format: 'markdown' | 'html', opts?: RenderOptions): string {
  const meta = buildMeta(session)
  const sections = buildSections(session)
  const includeToolDetails = opts?.includeToolDetails !== false
  return format === 'html' ? renderHtml(meta, sections, includeToolDetails) : renderMarkdown(meta, sections, includeToolDetails)
```

#### 缺口

- 本轮未运行工具或渲染测试，宿主权限及真实版本兼容未知。
  **影响**：不能把源码投影当安全分享或完整归档验收。
  **进一步探讨**：授权后以去敏单会话验证字段、访问与故障恢复，再决定扩大。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 投影是否保留完整轨迹和准确来源？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

先收集tool/result map，再顺序构建turn/user/assistant/tool/todo sections，同一结构渲染md/html；结果仅取message.content[0]的tool-result内文本，多模态附件和其他blocks不保留。子agent标签是工具名regex匹配subagent/workflow/spawn/fork/codex等，不解析真实委派关系，也不自动递归导入child日志；可能误标普通工具或漏掉异名委派。meta只取第一个非空system prompt和最后request/context模型，动态换prompt/模型的会话会被压成不同时点组合，不能当每步准确环境。usage仅累计assistant/message字段，不是货币账单也不完整表示缓存等计费。HTML对文本escape，Markdown代码块按最长反引号加长避免围栏闭合，都是具体实现优点；Markdown消息正文保留原内容，非安全清洗或完整日志归档。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-session-export/src/index.ts:135-175](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/src/index.ts#L135-L175)

首system/末model与usage。

<details>
<summary>查看原文（41行）</summary>

```text
function buildMeta(session: Session): Meta {
  const header = session.header
  let systemPrompt = ''
  let model: string | undefined
  for (const event of session.events) {
    if (event.type === 'request/header' && !systemPrompt && event.data.header.system) {
      systemPrompt = event.data.header.system
    }
    if (event.type === 'request/context') {
      model = `${event.data.provider}/${event.data.model}`
    }
  }
  const usage = sumUsage(session.events)
  return {
    title: sessionTitle(session),
    sessionId: String(session.id),
    createdAt: new Date(header.createdAt).toISOString(),
    cwd: header.cwd,
    origin: header.origin === 'subagent' ? 'subagent' : 'main',
    delegationDepth: header.delegationDepth,
    agentPreset: header.agentPreset,
    parentSession: header.parentSession === undefined ? undefined : String(header.parentSession),
    model,
    systemPrompt,
    usage,
  }
}

function sumUsage(events: readonly SessionEvent[]): Meta['usage'] {
  let input = 0
  let output = 0
  let reasoning = 0
  for (const event of events) {
    if (event.type === 'assistant/message' && event.data.usage) {
      input += event.data.usage.inputTokens ?? 0
      output += event.data.usage.outputTokens ?? 0
      reasoning += event.data.usage.reasoningTokens ?? 0
    }
  }
  return { input, output, reasoning }
}
```

</details>

**依据 2 · 源码核查**：[packages/plugins/plugin-session-export/src/index.ts:177-243](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/src/index.ts#L177-L243)

事件投影、首resultblock与regex子agent。

<details>
<summary>查看原文（67行）</summary>

```text
function buildSections(session: Session): Section[] {
  const results = collectToolResults(session.events)
  const sections: Section[] = []
  for (const event of session.events) {
    switch (event.type) {
      case 'turn/start':
        sections.push({ kind: 'turn', turn: event.data.turn })
        break
      case 'user/message': {
        const text = extractTexts(event.data.content).join('').trim()
        if (text) sections.push({ kind: 'user', text })
        break
      }
      case 'assistant/message': {
        const text = extractTexts(event.data.message.content).join('').trim()
        const reasoning = extractReasonings(event.data.message.content)
          .map(r => r.trim())
          .filter(Boolean)
        sections.push({ kind: 'assistant', text, reasoning })
        break
      }
      case 'tool/call': {
        const outcome = results.get(String(event.data.callId))
        sections.push({
          kind: 'tool',
          name: event.data.name,
          args: prettyJson(event.data.arguments),
          result: outcome?.text ?? '',
          isError: outcome?.isError === true,
          isSubagent: isSubagentTool(event.data.name),
        })
        break
      }
      case 'todo/write': {
        const todos = event.data.todos.map(t => `[${t.status}] ${t.content}`)
        if (todos.length) sections.push({ kind: 'todo', todos })
        break
      }
      default:
        // request/header, request/context, assistant/chunk, step/*, approval/*,
        // session/end-seed — reconstructed from the durable log but not surface prose.
        break
    }
  }
  return sections
}

interface ToolOutcome {
  text: string
  isError: boolean
}

function collectToolResults(events: readonly SessionEvent[]): Map<string, ToolOutcome> {
  const map = new Map<string, ToolOutcome>()
  for (const event of events) {
    if (event.type === 'tool/result') {
      const block = event.data.message.content[0]
      const text = extractTexts(block.content).join('').trim()
      map.set(String(block.toolCallId), { text, isError: block.isError === true || event.data.error !== undefined })
    }
  }
  return map
}

function isSubagentTool(name: string): boolean {
  return /subagent|workflow|spawn|fork|codex|claude|ralph|delegate/i.test(name)
}
```

</details>

**依据 3 · 源码核查**：[packages/plugins/plugin-session-export/src/index.ts:424-437](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/src/index.ts#L424-L437)

动态fence与HTML escaping。

<details>
<summary>查看原文（14行）</summary>

```text
function fence(lang: string, text: string): string {
  const runs = text.match(/`{3,}/g)
  const n = Math.max(3, ...(runs ?? []).map(r => r.length + 1))
  const marker = '`'.repeat(n)
  return `${marker}${lang}\n${text}\n${marker}`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
```

</details>

#### 缺口

- 本轮未运行工具或渲染测试，宿主权限及真实版本兼容未知。
  **影响**：不能把源码投影当安全分享或完整归档验收。
  **进一步探讨**：授权后以去敏单会话验证字段、访问与故障恢复，再决定扩大。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 分享版、安全访问和写入恢复有哪些边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

includeToolDetails:false仅隐藏工具参数结果，系统提示、已有reasoning、用户与assistant正文、cwd/sessionId/父会话仍输出；折叠details只改变显示，不脱敏。“干净分享版”不能自动公开，需人工审阅/删除敏感内容。指定sessionId直接store.get，all直接store.list，没有本工具内对调用agent项目/用户归属校验；多租户隔离是否由store/宿主提供未检查，不能据此声称已验证跨租户泄露，但此工具不添加访问边界。path可resolve任意进程可写位置，writeFile无exclusive/atomic temp，可覆盖同名旧导出；批量逐个mkdir/write，后项失败时前项已落盘却整体抛错无files清单。即使单个writeFile失败也不能保证旧文件未截断，README“抛错不半写”超出实现。默认文件名由首消息slug和sessionId组成，同会话重复导出覆盖，格式与自选扩展还可不一致。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-session-export/src/index.ts:249-295](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/src/index.ts#L249-L295)

分享开关仅tool，system/reasoning仍在。

<details>
<summary>查看原文（47行）</summary>

```text
function renderMarkdown(meta: Meta, sections: Section[], includeToolDetails: boolean): string {
  const lines: string[] = []
  lines.push(`# ${meta.title}`, '')
  lines.push(...metaLines(meta), '')
  if (meta.systemPrompt) {
    lines.push('## 系统提示', '', fence('text', meta.systemPrompt), '')
  }
  lines.push('## 对话', '')
  for (const section of sections) {
    if (section.kind === 'turn') {
      lines.push(`### Turn ${section.turn}`, '')
    } else if (section.kind === 'user') {
      lines.push('**👤 用户**', '', section.text, '')
    } else if (section.kind === 'assistant') {
      lines.push('**🤖 助手**', '')
      if (section.text) lines.push(section.text, '')
      if (section.reasoning.length) {
        lines.push(
          '<details>',
          '<summary>🧠 思维链（Thinking）</summary>',
          '',
          fence('text', section.reasoning.join('\n\n')),
          '',
          '</details>',
          '',
        )
      }
    } else if (section.kind === 'tool') {
      const label = section.isSubagent ? '🤝 子agent 委派' : '🔧 工具调用'
      if (!includeToolDetails) {
        lines.push(`- ${label}：${section.name}${section.isError ? '（失败）' : ''}`, '')
        continue
      }
      lines.push('<details>', `<summary>${label}：${section.name}</summary>`, '')
      if (section.args) {
        lines.push('**参数**', '', fence('json', section.args), '')
      }
      if (section.result) {
        lines.push(`**结果**${section.isError ? '（失败）' : ''}`, '', fence('text', section.result), '')
      }
      lines.push('</details>', '')
    } else if (section.kind === 'todo') {
      lines.push('**📋 任务列表**', '', ...section.todos.map(t => `- ${t}`), '')
    }
  }
  return `${lines.join('\n')}\n`
}
```

</details>

**依据 2 · 源码核查**：[packages/plugins/plugin-session-export/src/index.ts:366-377](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/src/index.ts#L366-L377)

cwd/id等元信息。

<details>
<summary>查看原文（12行）</summary>

```text
function metaLines(meta: Meta): string[] {
  const lines = [`会话：\`${meta.sessionId}\``, `创建时间：${meta.createdAt}`]
  if (meta.cwd) lines.push(`工作目录：\`${meta.cwd}\``)
  if (meta.origin === 'subagent') lines.push(`来源：子agent 会话`)
  if (meta.delegationDepth !== undefined) lines.push(`委托深度：${meta.delegationDepth}`)
  if (meta.parentSession) lines.push(`父会话：\`${meta.parentSession}\``)
  if (meta.agentPreset) lines.push(`预设：\`${meta.agentPreset}\``)
  if (meta.model) lines.push(`模型：\`${meta.model}\``)
  lines.push(`用量：输入 ${meta.usage.input} · 输出 ${meta.usage.output} · 推理 ${meta.usage.reasoning} tokens`)
  return lines
}

```

</details>

**依据 3 · 源码核查**：[packages/plugins/plugin-session-export/src/index.ts:62-85](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/src/index.ts#L62-L85)

任意session选择与顺序非原子写。

<details>
<summary>查看原文（24行）</summary>

```text
      let sessions: Session[]
      if (args.all) {
        sessions = store.list()
      } else if (args.sessionId) {
        const found = store.get(SessionId(args.sessionId))
        sessions = found ? [found] : []
      } else {
        const current = exec.agent?.session
        const listed = store.list()
        if (current) sessions = [current]
        else if (listed.length > 0) sessions = [listed[listed.length - 1]]
        else sessions = []
      }
      if (sessions.length === 0) {
        throw new Error('export_session: 没有可导出的会话（无 live session 且未指定 sessionId）')
      }

      const files: string[] = []
      for (const session of sessions) {
        const content = renderSession(session, format, { includeToolDetails })
        const file = outputPath(args.path, session, format, args.all === true)
        await mkdir(dirname(file), { recursive: true })
        await writeFile(file, content, 'utf8')
        files.push(file)
```

</details>

**依据 4 · 源码核查**：[packages/plugins/plugin-session-export/src/index.ts:447-458](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/src/index.ts#L447-L458)

resolve路径及重复文件名。

<details>
<summary>查看原文（12行）</summary>

```text
function outputPath(pathArg: string | undefined, session: Session, format: 'markdown' | 'html', asDir: boolean): string {
  const ext = format === 'html' ? '.html' : '.md'
  const filename = `${slugify(sessionTitle(session))}-${String(session.id)}${ext}`
  if (pathArg) {
    if (!asDir && (pathArg.endsWith('.md') || pathArg.endsWith('.html'))) {
      return resolve(pathArg)
    }
    return resolve(join(pathArg, filename))
  }
  const base = session.header.cwd ?? process.cwd()
  return resolve(join(base, filename))
}
```

</details>

**依据 5 · 作者声明**：[packages/plugins/plugin-session-export/README.md:120-122](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/README.md#L120-L122)

作者不半写声明。

```text
遵守 `dsh-plugin-design-principles.md`：`inject` 声明依赖（#3）、`ctx.tools.register` 注册即
effect（#1）、会话数据走 `ctx.sessions`（服务依赖，非全局状态，#2）、读写文件是不可逆发射、
失败即抛错不半写（#9）。
```

#### 缺口

- 本轮未运行工具或渲染测试，宿主权限及真实版本兼容未知。
  **影响**：不能把源码投影当安全分享或完整归档验收。
  **进一步探讨**：授权后以去敏单会话验证字段、访问与故障恢复，再决定扩大。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何启动验收、采用与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需兼容DSH tools/sessions服务、TypeScript构建成dist、目标目录写权限；HTML离线自包含且未引外部脚本，分享前仍检查内容。包peer范围不能证明当前宿主兼容，checkout无dist不等于发布包不存在或可用。作者称编译/注册/合成事件14断言和浏览器渲染通过，但也明确真实模型调用→落盘→读回未闭环；smoke源码只调用renderSession，检查字符串，不测试路径权限、覆盖、批量失败或会话访问。建议先个人隔离profile做去敏单会话导出到全新目录，手工比对原JSONL的消息/工具与字段；不要all，也不把includeToolDetails:false直接发外部。首次构建/目录审阅，持续存储和手工去敏，失败核已写文件及备份再重跑，金额/工时/节省未知。可回原生JSONL加人工整理；卸载不删导出、不撤回已分享内容，已覆盖文件需备份恢复。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-session-export/package.json:1-36](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/package.json#L1-L36)

dist入口/peer与构建。

<details>
<summary>查看原文（36行）</summary>

```text
{
  "name": "@dsh-suite/plugin-session-export",
  "version": "0.2.0",
  "description": "DSH plugin: export the append-only session log as human-readable Markdown or HTML, grouped by trajectory source (system prompt / reasoning / tool calls / subagent).",
  "license": "MIT",
  "type": "module",
  "main": "./dist/index.js",
  "exports": {
    ".": "./dist/index.js"
  },
  "files": [
    "dist",
    "cordis.patch.yml"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-session": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-session": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6",
    "@types/node": "^22.10.0",
    "typescript": "^5.6.0"
  }
}
```

</details>

**依据 2 · 作者声明**：[packages/plugins/plugin-session-export/README.md:112-122](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/README.md#L112-L122)

作者渲染与E2E边界。

<details>
<summary>查看原文（11行）</summary>

```text
- ✅ 纯 ESM 编译（`pnpm build`）+ typecheck
- ✅ `dsh.bundle` + `cordis.patch.yml` 装载进真实 DSH profile（headless 无 key 跑到 MISSING_CREDENTIAL，`registered "export_session" — listed=true`）
- ✅ 渲染冒烟（`scripts/render-smoke.mjs`）：合成真实 `SessionEvent` 流 → md/html × 含/不含工具细节 4 种输出，14 项断言全 PASS；HTML 自包含样式 + 打印友好
- ✅ HTML 真实打开（playwright/Chrome）：`export-full.html`（工具详情展开）/ `export-mini.html`（仅工具名）渲染正确（截图 `research/export-screenshots/`）
- ⚠️ 端到端「模型调 export_session → 落盘 → 读回」需真实会话 + API key——未闭环（渲染逻辑按真实 `SessionEvent` 类型实现并编译通过）

## 设计准则 / Design principles

遵守 `dsh-plugin-design-principles.md`：`inject` 声明依赖（#3）、`ctx.tools.register` 注册即
effect（#1）、会话数据走 `ctx.sessions`（服务依赖，非全局状态，#2）、读写文件是不可逆发射、
失败即抛错不半写（#9）。
```

</details>

**依据 3 · 源码核查**：[packages/plugins/plugin-session-export/scripts/render-smoke.mjs:21-46](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/scripts/render-smoke.mjs#L21-L46)

合成render输出字符串断言。

<details>
<summary>查看原文（26行）</summary>

```text

const mdFull = renderSession(session, 'markdown', { includeToolDetails: true })
const mdMini = renderSession(session, 'markdown', { includeToolDetails: false })
const htmlFull = renderSession(session, 'html', { includeToolDetails: true })
const htmlMini = renderSession(session, 'html', { includeToolDetails: false })

const checks = [
  ['md-full 含工具参数', mdFull.includes('"query"')],
  ['md-full 含工具结果', mdFull.includes('检索到 3 条结果')],
  ['md-mini 无工具参数', !mdMini.includes('"query"')],
  ['md-mini 无工具结果', !mdMini.includes('检索到 3 条结果')],
  ['md-mini 保留工具名', mdMini.includes('web_search') && mdMini.includes('tool-subagent')],
  ['html-full 含参数', htmlFull.includes('&quot;query&quot;')],
  ['html-full 含结果', htmlFull.includes('检索到 3 条结果')],
  ['html-mini 无参数', !htmlMini.includes('&quot;query&quot;')],
  ['html-mini 无结果', !htmlMini.includes('检索到 3 条结果')],
  ['html-mini 保留工具名', htmlMini.includes('web_search')],
  ['html 自包含样式', htmlFull.includes('<style>') && htmlFull.includes('</style>') && !htmlFull.includes('<link rel="stylesheet"')],
  ['html 打印样式', htmlFull.includes('@media print')],
  ['对话主体保留', mdMini.includes('临界指数为 γ⁻ = γ⁺ = 1') && htmlMini.includes('临界指数为')],
  ['用户消息保留', mdMini.includes('帮我查一下') && htmlMini.includes('帮我查一下')],
]
let fail = 0
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail += 1 }

// 写两种格式文件供打开验证/截图(输出目录走环境变量,避免把本机绝对路径写进仓库;CI leak-scan 会拦)
```

</details>

**依据 4 · 源码核查**：[packages/plugins/plugin-session-export/src/index.ts:80-85](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/src/index.ts#L80-L85)

逐文件落盘。

```text
      for (const session of sessions) {
        const content = renderSession(session, format, { includeToolDetails })
        const file = outputPath(args.path, session, format, args.all === true)
        await mkdir(dirname(file), { recursive: true })
        await writeFile(file, content, 'utf8')
        files.push(file)
```

#### 缺口

- 本轮未运行工具或渲染测试，宿主权限及真实版本兼容未知。
  **影响**：不能把源码投影当安全分享或完整归档验收。
  **进一步探讨**：授权后以去敏单会话验证字段、访问与故障恢复，再决定扩大。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样变成可检查的分享交付？

**研究主题**：新假设与验证、采用判断

#### 完整回答

由Q02/Q03推导未验证的导出清单契约：默认最少数据白名单，系统提示/reasoning/路径各自显式开关；只允许当前授权会话，记录原日志revision/seq范围和未导出事件/附件，逐turn绑定prompt/model。先规划文件清单，使用不覆盖创建或版本文件+原子rename，批量结果始终逐项报告成功/失败/未知，不把失败自动当无写入。以含秘密prompt的mini、两模型切换、非文本结果、猜测sessionId、第二文件EACCES和旧文件冲突为反例。若mini仍含禁字段、模型归因错或失败没有已落盘清单，就推翻充分性；即使投影完整也不替代原JSONL和作者结果审阅。新增清单/去敏维护可能增加操作成本，不计入已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-session-export/src/index.ts:135-160](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/src/index.ts#L135-L160)

模型/prompt压缩引出逐turn归因。

<details>
<summary>查看原文（26行）</summary>

```text
function buildMeta(session: Session): Meta {
  const header = session.header
  let systemPrompt = ''
  let model: string | undefined
  for (const event of session.events) {
    if (event.type === 'request/header' && !systemPrompt && event.data.header.system) {
      systemPrompt = event.data.header.system
    }
    if (event.type === 'request/context') {
      model = `${event.data.provider}/${event.data.model}`
    }
  }
  const usage = sumUsage(session.events)
  return {
    title: sessionTitle(session),
    sessionId: String(session.id),
    createdAt: new Date(header.createdAt).toISOString(),
    cwd: header.cwd,
    origin: header.origin === 'subagent' ? 'subagent' : 'main',
    delegationDepth: header.delegationDepth,
    agentPreset: header.agentPreset,
    parentSession: header.parentSession === undefined ? undefined : String(header.parentSession),
    model,
    systemPrompt,
    usage,
  }
```

</details>

**依据 2 · 源码核查**：[packages/plugins/plugin-session-export/src/index.ts:249-295](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/src/index.ts#L249-L295)

分享字段反例。

<details>
<summary>查看原文（47行）</summary>

```text
function renderMarkdown(meta: Meta, sections: Section[], includeToolDetails: boolean): string {
  const lines: string[] = []
  lines.push(`# ${meta.title}`, '')
  lines.push(...metaLines(meta), '')
  if (meta.systemPrompt) {
    lines.push('## 系统提示', '', fence('text', meta.systemPrompt), '')
  }
  lines.push('## 对话', '')
  for (const section of sections) {
    if (section.kind === 'turn') {
      lines.push(`### Turn ${section.turn}`, '')
    } else if (section.kind === 'user') {
      lines.push('**👤 用户**', '', section.text, '')
    } else if (section.kind === 'assistant') {
      lines.push('**🤖 助手**', '')
      if (section.text) lines.push(section.text, '')
      if (section.reasoning.length) {
        lines.push(
          '<details>',
          '<summary>🧠 思维链（Thinking）</summary>',
          '',
          fence('text', section.reasoning.join('\n\n')),
          '',
          '</details>',
          '',
        )
      }
    } else if (section.kind === 'tool') {
      const label = section.isSubagent ? '🤝 子agent 委派' : '🔧 工具调用'
      if (!includeToolDetails) {
        lines.push(`- ${label}：${section.name}${section.isError ? '（失败）' : ''}`, '')
        continue
      }
      lines.push('<details>', `<summary>${label}：${section.name}</summary>`, '')
      if (section.args) {
        lines.push('**参数**', '', fence('json', section.args), '')
      }
      if (section.result) {
        lines.push(`**结果**${section.isError ? '（失败）' : ''}`, '', fence('text', section.result), '')
      }
      lines.push('</details>', '')
    } else if (section.kind === 'todo') {
      lines.push('**📋 任务列表**', '', ...section.todos.map(t => `- ${t}`), '')
    }
  }
  return `${lines.join('\n')}\n`
}
```

</details>

**依据 3 · 源码核查**：[packages/plugins/plugin-session-export/src/index.ts:80-85](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-session-export/src/index.ts#L80-L85)

部分写入引出逐项清单。

```text
      for (const session of sessions) {
        const content = renderSession(session, format, { includeToolDetails })
        const file = outputPath(args.path, session, format, args.all === true)
        await mkdir(dirname(file), { recursive: true })
        await writeFile(file, content, 'utf8')
        files.push(file)
```

#### 缺口

- 本轮未运行工具或渲染测试，宿主权限及真实版本兼容未知。
  **影响**：不能把源码投影当安全分享或完整归档验收。
  **进一步探讨**：授权后以去敏单会话验证字段、访问与故障恢复，再决定扩大。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
