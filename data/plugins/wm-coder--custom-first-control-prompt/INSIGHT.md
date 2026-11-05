# Custom First Control Prompt

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[cab57ab](https://github.com/WM-CODER/custom-first-control-prompt/tree/cab57abe28d565839e026e0018b292aa32d55531)

<!-- BEGIN META -->
[![GitHub ★ 80](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=80&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WM-CODER/custom-first-control-prompt) [![npm 30d 822](https://img.shields.io/static/v1?label=npm+30d&message=822&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wm-coders/dsh-custom-first-control-prompt) [![最新发布 2026-09-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wm-coders/dsh-custom-first-control-prompt)
<!-- END META -->

> **功能**：为 DSH 注入部署提示词和参考问答，并提供请求监听与配置面板。

> **亮点**：[Q01](#research-q01) 用请求路径注入保留真实日志编号，section与示例各有入口。

> **主要限制**：[Q02](#research-q02) 调试ring跨请求范围；[Q03](#research-q03)面板写web patch并有整体导入。

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
  - [Q01 · 参考对话怎样进入真实模型请求？](#detail-section-11)
  - [Q02 · 请求监听器是否按当前会话隔离？](#detail-section-12)
  - [Q03 · 面板保存会写哪个文件？](#detail-section-13)
  - [Q04 · 何时值得在隔离配置中观察？](#detail-section-14)
  - [Q05 · 怎样避免读失败或并发保存丢配置？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在普通会话请求重复提供示例和部署指令的维护者。

手工在每次请求贴规则和示例。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 部署规则 | 注册system section | 加载时生效 |
| 参考问答 | 普通请求前置消息 | 不写会话历史 |
| 调试面板 | 捕获请求和管理配置 | 隐私与文件权限需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| systemPrompt、llm、sessions | 核心必需 | section和请求过滤 | 不加载 |
| fs/settings/remote | 面板需要 | 读写web patch和调试 | 仅手工配置 |
| 独立web profile及备份 | 观察必需 | 隔离配置变更 | 回手贴示例 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份web patch并放一对合成示例 | 暂停监听 |
| 验证 | 查看实际模型输入 | 不只看聊天history |
| 保存 | 核对文件并重载 | saved不当生效 |
| 退出 | 还原patch禁用及清ring | 再次核对请求 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 模型请求费用未知 | 配置独立profile和样例 | 未实测 |
| 持续使用 | 每请求重复token未知 | 检查前缀与监听范围 | 按模型缓存 |
| 失败恢复 | 额外请求及人时未知 | 恢复patch并重载查输入 | 需清调试ring |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 注入 | 真实角色消息前置 | 模型遵循 |
| 监听 | 30条请求文本ring | 跨authority可见性 |
| 保存 | 写web patch | 生效和并发完整性 |

> **思考**：[Q02](#research-q02) 调试ring跨请求范围；[Q03](#research-q03)面板写web patch并有整体导入。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 用请求路径注入保留真实日志编号，section与示例各有入口。

[Q03](#research-q03) 文件读取失败与写回之间缺显式失败关闭，需优先验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 调试ring跨请求范围；[Q03](#research-q03)面板写web patch并有整体导入。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先手工配置并停监听，再核对面板权限。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

注入、监听与写回静态核查，remote隐私与保存生效未实测。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/panel.ts、src/seed.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定请求层、seed构造及面板捕获和写回。
- 下一步：核对实际请求、跨会话ring、读取失败与并发保存。

**分析版本**

- **仓库**：[WM-CODER/custom-first-control-prompt](https://github.com/WM-CODER/custom-first-control-prompt)
- **版本号**：0.3.0（[固定提交 cab57ab](https://github.com/WM-CODER/custom-first-control-prompt/tree/cab57abe28d565839e026e0018b292aa32d55531)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 条件读写可能减少配置覆盖，需核对宿主CAS。

核对实际请求、跨会话ring、读取失败与并发保存。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 1439 | — | — | 18170 |
| .js | source | 18 | 10061 | 9425 | 853 | — |
| .ts | source | 6 | 1039 | 691 | 273 | — |
| .ts | test | 5 | 630 | 541 | 35 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/WM-CODER/custom-first-control-prompt/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：参考对话怎样在请求层注入，配置和真实会话记录有何区别？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 参考对话怎样进入真实模型请求？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

希望反复提供示例问答或部署规则的DSH维护者，可配置system sections及reference history。启用section在加载时注册，history经校验后构造交替user/assistant Message并深冻结。llm/stream过滤purpose、无sessionId以及默认subagent请求，再克隆options、前置seed并重派发；WeakSet按克隆对象身份避免递归。它改变实际模型输入而不追加会话事件，因而聊天history看不到示例是机制结果，不能拿干净日志证明模型没收到内容。相比每次手贴示例，统一配置可重复发送，但输出是否遵循仍需模型验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:189-229](https://github.com/WM-CODER/custom-first-control-prompt/blob/cab57abe28d565839e026e0018b292aa32d55531/src/index.ts#L189-L229)

section与请求路径

<details>
<summary>查看原文（41行）</summary>

```text
  const panel = ctx.get('custom-first-control-prompt-panel') as PanelService | undefined
  const sections = config.sections ?? []
  const { clean: mountableSections, problems: sectionProblems } = partitionSections(sections)
  for (const problem of sectionProblems) ctx.logger.warn('skipping a configured section: %s', problem)
  for (const section of mountableSections) {
    if (section.enabled === false) continue
    ctx.effect(() => ctx.systemPrompt.section({
      name: `${name}:${section.name}`,
      order: section.order,
      text: section.text,
    }), `${name}.section(${section.name})`)
  }
  const history = config.history
  if (history === undefined || history.length === 0) return
  const { clean: pairs, problems: pairProblems } = partitionPairs(history)
  for (const problem of pairProblems) ctx.logger.warn('skipping a configured reference-history pair: %s', problem)
  if (pairs.length === 0) return
  const seedMessages = buildSeedMessages(pairs)
  // Reentry guard: the redispatched clone re-enters this waterfall; the
  // WeakSet marks it so it passes straight through instead of being
  // intercepted recursively. Keyed by request object identity — no teardown
  // bookkeeping, and entries vanish with the request.
  const reentry = new WeakSet<GenerateOptions>()
  ctx.on('llm/stream', (options, next) => {
    if (reentry.has(options)) {
      reentry.delete(options)
      return next()
    }
    // Hot injection toggle: when off, pass through without seeding.
    if (panel !== undefined && !panel.injectionEnabled) return next()
    // Ordinary conversation requests only: auxiliary calls (compaction,
    // session-title) carry `purpose`; hand-built calls carry no `sessionId`.
    if (options.purpose !== undefined) return next()
    const sessionId = options.sessionId
    if (sessionId === undefined) return next()
    if (config.includeSubagents !== true
      && ctx.sessions.get(sessionId)?.header.origin === 'subagent') return next()
    const cloned: GenerateOptions = { ...options, messages: [...seedMessages, ...options.messages] }
    reentry.add(cloned)
    return ctx.llm.stream(cloned)
  }, { prepend: true })
```

</details>

**依据 2 · 源码核查**：[src/seed.ts:86-100](https://github.com/WM-CODER/custom-first-control-prompt/blob/cab57abe28d565839e026e0018b292aa32d55531/src/seed.ts#L86-L100)

角色消息构造和冻结

<details>
<summary>查看原文（15行）</summary>

```text
export function buildSeedMessages(pairs: readonly HistoryPair[]): readonly Message[] {
  const messages: Message[] = []
  for (const [index, pair] of pairs.entries()) {
    messages.push(createUserMessage({
      content: [{ type: 'text', text: pair.user }],
      source: { kind: 'user' },
    }))
    messages.push({
      id: MessageId(`${SEED_SOURCE}-intercept-${index}`),
      role: 'assistant',
      source: { kind: 'plugin', plugin: SEED_SOURCE },
      content: [{ type: 'text', text: pair.assistant }],
    })
  }
  return deepFreeze(messages)
```

</details>

**依据 3 · 作者声明**：[README.md:59-68](https://github.com/WM-CODER/custom-first-control-prompt/blob/cab57abe28d565839e026e0018b292aa32d55531/README.md#L59-L68)

作者解释不写历史

<details>
<summary>查看原文（10行）</summary>

```text
## Injection mechanism

The reference exchanges are built once at plugin activation into alternating real `Message` objects (deep-frozen, shared by reference across requests), then prepended onto every ordinary conversation request by an `llm/stream` waterfall listener:

- **Clone and redispatch**: loop-built requests are deep-frozen and marker-tagged (`markAgentLoopRequest(deepFreeze(...))`) and never mutated; the listener clones the request, prepends the seed messages, and redispatches through `ctx.llm.stream`. The clone carries no loop marker, the agent-loop log-reconstruction invariant does not apply to it, and the discarded original is a pure `deriveMessages()` projection.
- **Zero log writes**: seed messages live only on the request path — real turn numbering starts at 1 with no collisions, forks are ordinary copies, and compaction cannot shadow the reference history (every request re-injects it).
- **Scope filtering**: auxiliary calls (`purpose`-stamped, e.g. session-title, compaction) and hand-built requests (no `sessionId`) pass straight through; subagent-origin sessions are skipped by default (`includeSubagents: true` opts in).
- **Panel verification**: not seeing the seed messages in the chat transcript is expected; use the panel's LLM listener to inspect the injected real request (Settings → "Custom first control prompt" → LLM listening, or the dock strip above the composer).

**Verifying the injection works**: in a fresh session ask a question only the injected history can answer (e.g. "repeat our earliest user message") — the model quoting the configured content proves it. `session.history` shows no seed messages (a clean log is a feature, not a failure).
```

</details>

#### 缺口

- 具体宿主模型路由与示例遵循效果未测
  **影响**：不能把示例注入当成权限控制或必然遵循
  **进一步探讨**：无敏感示例记录实际请求并对照输出

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 请求监听器是否按当前会话隔离？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

PanelService默认paused=true，启用后监听全局llm/stream并把system与每条文本消息拷到30条内存ring。该capture分支没有按sessionId或agent过滤，requests-list虽接Agent参数却忽略，返回整个ring。因此它是调试观测范围，不是当前会话私有记录。截断的是条目数而非每条文本大小，可能持有大量内容。清除ring和暂停可减少留存，但不撤回已经展示的内容，宿主remote访问权限仍由外层决定。

#### 证据与依据

**依据 1 · 源码核查**：[src/panel.ts:50-102](https://github.com/WM-CODER/custom-first-control-prompt/blob/cab57abe28d565839e026e0018b292aa32d55531/src/panel.ts#L50-L102)

默认暂停与全局文本捕获

<details>
<summary>查看原文（53行）</summary>

```text
/** The web panel management service. */
export class PanelService extends TypertRemoteService {
  private readonly ring: PanelRequestView[] = []
  private seq = 0
  private paused = true
  private dockVisible = true
  /** Hot injection toggle; when false the llm/stream listener passes through. */
  injectionEnabled = true
  /** Name of the last applied template; empty when none. */
  activeTemplate = ''
  /** Composed plugin config snapshot, shown when the profile patch has no row. */
  private readonly effective: PanelConfigView | undefined

  constructor(ctx: Context, effective?: PanelConfigView) {
    super(ctx, 'custom-first-control-prompt-panel')
    this.effective = effective
    ctx.on('llm/stream', (options: GenerateOptions, next) => {
      const stream = next()
      if (!this.paused) this.capture(options)
      return stream
    })
  }

  // ---- capture ----

  private capture(options: GenerateOptions): void {
    try {
      const record = options as GenerateOptions & Record<string, unknown>
      const entry: PanelRequestView = {
        id: ++this.seq,
        time: Date.now(),
        model: typeof record['model'] === 'string' ? record['model'] : '',
        provider: typeof record['provider'] === 'string' ? record['provider'] : '',
        system: typeof record['system'] === 'string' ? record['system'] : '',
        purpose: typeof record['purpose'] === 'string' ? record['purpose'] : '',
        messages: [],
      }
      const msgs = Array.isArray(record['messages']) ? record['messages'] : []
      entry.messages = msgs.map((msg: unknown) => {
        let text = ''
        const m = typeof msg === 'object' && msg !== null ? msg as Record<string, unknown> : undefined
        if (typeof m?.['content'] === 'string') text = m['content']
        else if (Array.isArray(m?.['content'])) {
          text = (m['content'] as unknown[]).map((block) => {
            if (typeof block === 'string') return block
            const b = typeof block === 'object' && block !== null ? block as Record<string, unknown> : undefined
            return b?.['type'] === 'text' && typeof b['text'] === 'string' ? b['text'] : ''
          }).join('')
        }
        return { role: typeof m?.['role'] === 'string' ? m['role'] : 'unknown', text }
      })
      this.ring.push(entry)
      if (this.ring.length > 30) this.ring.shift()
```

</details>

**依据 2 · 源码核查**：[src/panel.ts:346-367](https://github.com/WM-CODER/custom-first-control-prompt/blob/cab57abe28d565839e026e0018b292aa32d55531/src/panel.ts#L346-L367)

整体读取、暂停、清除

<details>
<summary>查看原文（22行）</summary>

```text
  /** Snapshot the captured request ring plus listener state. */
  @Remote('requests-list')
  requestsList(agent: Agent): PanelRequestsView {
    void agent
    return { requests: this.ring.slice(), paused: this.paused, dockVisible: this.dockVisible, injectionEnabled: this.injectionEnabled, activeTemplate: this.activeTemplate }
  }

  /** Pause or resume request capture. */
  @Remote('requests-set-paused')
  requestsSetPaused(agent: Agent, paused: boolean): PanelRequestsView {
    void agent
    this.paused = paused === true
    return { requests: this.ring.slice(), paused: this.paused, dockVisible: this.dockVisible, injectionEnabled: this.injectionEnabled, activeTemplate: this.activeTemplate }
  }

  /** Clear the captured request ring. */
  @Remote('requests-clear')
  requestsClear(agent: Agent): PanelRequestsView {
    void agent
    this.ring.length = 0
    this.seq = 0
    return { requests: [], paused: this.paused, dockVisible: this.dockVisible, injectionEnabled: this.injectionEnabled, activeTemplate: this.activeTemplate }
```

</details>

#### 缺口

- 真实remote身份策略和多会话可见性未验收
  **影响**：不能支持共享部署中的请求隐私结论
  **进一步探讨**：在两段合成会话中启监听并以不同authority读回

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 面板保存会写哪个文件？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

patchPath从settings.prepareDocument路径取目录后固定拼profiles/web/cordis.patch.yml，不随任意安装profile自动切换。常规保存先读原文件并merge核心块，再经fs.writeText写回，writePolicy尝试resolve danger-full-access。raw-import则把整份非空文本直接写入该patch，范围明显大于插件自身配置。读取失败时常规保存仍可用空串merge，可能覆盖未读出的原有配置。这里没有显式revision/CAS或串行写队列；两个客户端从相同旧raw保存时可能后者覆盖前者。外层fs及remote是否限制操作要实际核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/panel.ts:110-133](https://github.com/WM-CODER/custom-first-control-prompt/blob/cab57abe28d565839e026e0018b292aa32d55531/src/panel.ts#L110-L133)

固定web路径与写策略

<details>
<summary>查看原文（24行）</summary>

```text
  private async patchPath(): Promise<string | null> {
    const settings = this.ctx.get('settings') as PanelSettings | undefined
    if (settings !== undefined) {
      try {
        const doc = await settings.prepareDocument()
        if (typeof doc === 'string' && doc.length > 0) {
          const norm = doc.replace(/\\/g, '/')
          const i = norm.lastIndexOf('/')
          if (i > 0) return `${norm.slice(0, i)}/profiles/web/cordis.patch.yml`
        }
      } catch {
        // fall through to the explicit failure below
      }
    }
    return null
  }

  private writePolicy(): unknown {
    const policy = this.ctx.get('sandboxPolicy') as PanelSandboxPolicy | undefined
    try {
      return policy?.resolve({ mode: 'danger-full-access' })
    } catch {
      return undefined
    }
```

</details>

**依据 2 · 源码核查**：[src/panel.ts:274-305](https://github.com/WM-CODER/custom-first-control-prompt/blob/cab57abe28d565839e026e0018b292aa32d55531/src/panel.ts#L274-L305)

读取及写入失败

<details>
<summary>查看原文（32行）</summary>

```text
  private async readPatch(): Promise<PanelConfigReadResult> {
    const path = await this.patchPath()
    if (path === null) {
      return { ok: false, path: '', raw: '', parsed: PanelService.parseBlock(''), error: 'unable to locate the profile patch file (settings.prepareDocument() returned no path)' }
    }
    const fs = this.ctx.get('fs') as PanelFs | undefined
    if (fs === undefined) return { ok: false, path, raw: '', parsed: PanelService.parseBlock(''), error: 'fs service unavailable' }
    try {
      const target = await fs.resolve(path)
      const raw = await fs.readText(target)
      const parsed = PanelService.parseBlock(raw)
      // With the bundle layer carrying the row, the profile patch starts out
      // without one; show the composed config so the editor is not blank.
      return { ok: true, path, raw, parsed: parsed.found || this.effective === undefined ? parsed : this.effective, error: '' }
    } catch (error) {
      return { ok: false, path, raw: '', parsed: PanelService.parseBlock(''), error: error instanceof Error ? error.message : String(error) }
    }
  }

  private async writePatch(raw: string): Promise<PanelWriteResult> {
    const path = await this.patchPath()
    if (path === null) {
      return { ok: false, path: '', error: 'unable to locate the profile patch file (settings.prepareDocument() returned no path)' }
    }
    const fs = this.ctx.get('fs') as PanelFs | undefined
    if (fs === undefined) return { ok: false, path, error: 'fs service unavailable' }
    try {
      const target = await fs.resolve(path)
      await fs.writeText(target, raw, undefined, undefined, this.writePolicy())
      return { ok: true, path, saved: true, error: '' }
    } catch (error) {
      return { ok: false, path, error: error instanceof Error ? error.message : String(error) }
```

</details>

**依据 3 · 源码核查**：[src/panel.ts:319-343](https://github.com/WM-CODER/custom-first-control-prompt/blob/cab57abe28d565839e026e0018b292aa32d55531/src/panel.ts#L319-L343)

常规保存与整体导入

<details>
<summary>查看原文（25行）</summary>

```text
  @Remote('config-write')
  async configWrite(agent: Agent, config: PanelConfigView): Promise<PanelWriteResult> {
    void agent
    const existing = await this.readPatch()
    return this.writePatch(PanelService.mergeCoreBlock(existing.ok ? existing.raw : '', config))
  }

  /** Clear the configured prompt content, keeping the plugin installed (and any other patch lines). */
  @Remote('config-clear')
  async configClear(agent: Agent): Promise<PanelWriteResult> {
    void agent
    const existing = await this.readPatch()
    return this.writePatch(PanelService.mergeCoreBlock(existing.ok ? existing.raw : '', {
      found: true, sections: [], history: [], includeSubagents: false,
    }))
  }

  /** Import a raw patch file text wholesale. */
  @Remote('config-raw-import')
  configRawImport(agent: Agent, raw: string): Promise<PanelWriteResult> {
    void agent
    if (typeof raw !== 'string' || raw.trim() === '') {
      return Promise.resolve({ ok: false, path: '', error: 'raw content is empty; nothing written' })
    }
    return this.writePatch(raw)
```

</details>

#### 缺口

- 宿主文件层是否有额外冲突控制及自动重载未测
  **影响**：不能把saved=true当当前请求已使用新配置
  **进一步探讨**：用临时web patch核对读取失败和并发保存，重载后再看请求

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得在隔离配置中观察？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容systemPrompt、llm、sessions及面板的fs、settings和remote服务。每个section及history在普通请求重复，token费用随长度、路由和缓存变化，金额未知；未记录到会话日志还增加调试与审计复核成本。先在独立web profile手工放一对合成示例，保持监听暂停，记录真实请求和一次模型输出，再核对禁用后的请求。面板清空配置只写文件，热injection-toggle控制的是seed分支，已注册section需重载或卸载后再核对。退出备份并还原patch、停监听及清ring，不依赖聊天history证明已清除。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:31-31](https://github.com/WM-CODER/custom-first-control-prompt/blob/cab57abe28d565839e026e0018b292aa32d55531/src/index.ts#L31-L31)

核心服务依赖

```text
export const inject = ['systemPrompt', 'llm', 'sessions']
```

**依据 2 · 源码核查**：[src/index.ts:195-218](https://github.com/WM-CODER/custom-first-control-prompt/blob/cab57abe28d565839e026e0018b292aa32d55531/src/index.ts#L195-L218)

section加载与seed热开关

<details>
<summary>查看原文（24行）</summary>

```text
    ctx.effect(() => ctx.systemPrompt.section({
      name: `${name}:${section.name}`,
      order: section.order,
      text: section.text,
    }), `${name}.section(${section.name})`)
  }
  const history = config.history
  if (history === undefined || history.length === 0) return
  const { clean: pairs, problems: pairProblems } = partitionPairs(history)
  for (const problem of pairProblems) ctx.logger.warn('skipping a configured reference-history pair: %s', problem)
  if (pairs.length === 0) return
  const seedMessages = buildSeedMessages(pairs)
  // Reentry guard: the redispatched clone re-enters this waterfall; the
  // WeakSet marks it so it passes straight through instead of being
  // intercepted recursively. Keyed by request object identity — no teardown
  // bookkeeping, and entries vanish with the request.
  const reentry = new WeakSet<GenerateOptions>()
  ctx.on('llm/stream', (options, next) => {
    if (reentry.has(options)) {
      reentry.delete(options)
      return next()
    }
    // Hot injection toggle: when off, pass through without seeding.
    if (panel !== undefined && !panel.injectionEnabled) return next()
```

</details>

**依据 3 · 源码核查**：[src/panel.ts:327-343](https://github.com/WM-CODER/custom-first-control-prompt/blob/cab57abe28d565839e026e0018b292aa32d55531/src/panel.ts#L327-L343)

清空文件配置

<details>
<summary>查看原文（17行）</summary>

```text
  @Remote('config-clear')
  async configClear(agent: Agent): Promise<PanelWriteResult> {
    void agent
    const existing = await this.readPatch()
    return this.writePatch(PanelService.mergeCoreBlock(existing.ok ? existing.raw : '', {
      found: true, sections: [], history: [], includeSubagents: false,
    }))
  }

  /** Import a raw patch file text wholesale. */
  @Remote('config-raw-import')
  configRawImport(agent: Agent, raw: string): Promise<PanelWriteResult> {
    void agent
    if (typeof raw !== 'string' || raw.trim() === '') {
      return Promise.resolve({ ok: false, path: '', error: 'raw content is empty; nothing written' })
    }
    return this.writePatch(raw)
```

</details>

**依据 4 · 作者声明**：[README.md:84-90](https://github.com/WM-CODER/custom-first-control-prompt/blob/cab57abe28d565839e026e0018b292aa32d55531/README.md#L84-L90)

每请求token与前缀条件

```text
#### Token impact

Every section repeats on every request; cost scales with rendered length.

#### KV-cache impact

Prefixes stay stable while section text, order, and the enabled set render identically. Any change can break reuse from the first changed system-prompt token.
```

#### 缺口

- 安装、卸载及模型计费未实测
  **影响**：不支持长期低成本或控制强度结论
  **进一步探讨**：对相同任务比较注入前后输入tokens与请求内容

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样避免读失败或并发保存丢配置？

**研究主题**：新假设与验证

#### 完整回答

针对当前readPatch失败仍以空raw合并，可试验强制成功读取和revision条件写入，失败时让用户保存独立导出。两客户端同时编辑、读取拒绝和外部修改做对照，检验其他patch行是否保留以及冲突是否明确。若宿主已有完整CAS且新增检查无收益，保留现有接口；若仍覆盖则不能仅靠提示解决。本轮未实现。

#### 证据与依据

**依据 1 · 源码核查**：[src/panel.ts:319-343](https://github.com/WM-CODER/custom-first-control-prompt/blob/cab57abe28d565839e026e0018b292aa32d55531/src/panel.ts#L319-L343)

read-modify-write及整体导入

<details>
<summary>查看原文（25行）</summary>

```text
  @Remote('config-write')
  async configWrite(agent: Agent, config: PanelConfigView): Promise<PanelWriteResult> {
    void agent
    const existing = await this.readPatch()
    return this.writePatch(PanelService.mergeCoreBlock(existing.ok ? existing.raw : '', config))
  }

  /** Clear the configured prompt content, keeping the plugin installed (and any other patch lines). */
  @Remote('config-clear')
  async configClear(agent: Agent): Promise<PanelWriteResult> {
    void agent
    const existing = await this.readPatch()
    return this.writePatch(PanelService.mergeCoreBlock(existing.ok ? existing.raw : '', {
      found: true, sections: [], history: [], includeSubagents: false,
    }))
  }

  /** Import a raw patch file text wholesale. */
  @Remote('config-raw-import')
  configRawImport(agent: Agent, raw: string): Promise<PanelWriteResult> {
    void agent
    if (typeof raw !== 'string' || raw.trim() === '') {
      return Promise.resolve({ ok: false, path: '', error: 'raw content is empty; nothing written' })
    }
    return this.writePatch(raw)
```

</details>

**依据 2 · 源码核查**：[src/panel.ts:293-305](https://github.com/WM-CODER/custom-first-control-prompt/blob/cab57abe28d565839e026e0018b292aa32d55531/src/panel.ts#L293-L305)

实际写入调用

<details>
<summary>查看原文（13行）</summary>

```text
  private async writePatch(raw: string): Promise<PanelWriteResult> {
    const path = await this.patchPath()
    if (path === null) {
      return { ok: false, path: '', error: 'unable to locate the profile patch file (settings.prepareDocument() returned no path)' }
    }
    const fs = this.ctx.get('fs') as PanelFs | undefined
    if (fs === undefined) return { ok: false, path, error: 'fs service unavailable' }
    try {
      const target = await fs.resolve(path)
      await fs.writeText(target, raw, undefined, undefined, this.writePolicy())
      return { ok: true, path, saved: true, error: '' }
    } catch (error) {
      return { ok: false, path, error: error instanceof Error ? error.message : String(error) }
```

</details>

#### 缺口

- 宿主文件层CAS与UI冲突呈现未知
  **影响**：改动可能要求宿主协议
  **进一步探讨**：先核对fs写入契约再用合成patch竞争

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
