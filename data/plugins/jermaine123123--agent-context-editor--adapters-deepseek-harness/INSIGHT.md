# Context Editor for DeepSeek Harness

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[759646d](https://github.com/jermaine123123/agent-context-editor/tree/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness)

<!-- BEGIN META -->
[![GitHub ★ 63](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=63&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/jermaine123123/agent-context-editor)
<!-- END META -->

> **功能**：为 DSH 会话提供搜索、消息文本编辑与排除、摘要检查点及恢复入口。

> **亮点**：相对手动摘要重开会话，它以不可变请求profile保留原始日志和消息角色，按ID与指纹选择性替换有效输入，再以持久回读核对提交结果。增量在请求治理与恢复接线，尚无语义质量或净节费实测。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：持久回读只能确认所选有效消息与预期一致，不能证明摘要保留任务所需事实。profile仍依赖插件和两份存储域，结果未知时需暂停并查询操作，不能把恢复当作随时无损卸载。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 用户编辑什么，如何映射到下一次模型请求？](#detail-section-11)
  - [Q02 · 写入验证、并发与恢复能约束哪些失败？](#detail-section-12)
  - [Q03 · 相对重开会话或手动摘要的增量及全周期负担是什么？](#detail-section-13)
  - [Q04 · 谁值得试用，后续哪项假设可被推翻？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要在长会话中修正或压缩有效输入的用户，按消息定位编辑并保存可恢复的请求映射，见 [Q01](#research-q01)。

替代办法是保留原会话不改、手动摘要重开会话，或在面板只隐藏记录。这里比较请求身份与恢复机制，不声称已检验当前宿主全部原生上下文功能。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话搜索与分页 | 定位长历史和选择消息 | 基线变化拒绝混合分页 |
| 文本替换与排除 | 改变后续有效请求 | 保留原日志，受保护结构和版本门禁约束 |
| 摘要检查点 | 用摘要替代完整回合范围 | 语义需用户核对，非任意碎片压缩 |
| 摘要恢复入口 | 原位恢复或建立分支 | checkpoint被覆盖时需分支，不能一概原位撤销 |
| 操作查询 | 断线后核对已知operation | 未核实时暂停继续写，不能盲重试 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node >=22.19.0及包peer范围内DSH服务 | 启动必需 | 日志、会话、Agent、存储和模型服务 | 缺服务无法初始化，版本声明不代表运行验收 |
| Web slots、remote与会话视图 | 面板必需 | 用户搜索、预览与提交 | 无界面不能使用该交互流程 |
| Session日志与两个插件存储域 | 持续使用必需 | 原件、编辑状态与请求profile | 缺profile可使后续请求拒绝，不应单独删除 |
| v4格式与关系验证器 | v4写入必需 | 验证候选日志 | 缺写契约明确拒绝写 |
| 原模型Provider及摘要模型 | 请求与摘要必需 | 执行后续任务或生成摘要 | 不能把侧栏编辑成功当模型任务完成 |
| 默认支持的compaction路由 | 请求变换必需 | 继承有效请求映射 | 自定义Provider或策略不支持 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份完整profile，在兼容宿主加载插件 | 诊断说明实际可用能力；接口识别不等于持久验收 |
| 预览 | 用户选择文本或完整回合，审阅修改或摘要 | 基线冲突则刷新，受保护范围不得强改 |
| 提交 | 插件写profile和选择事件，再flush回读 | 只有持久消息匹配才报告核实；未知即暂停 |
| 继续与恢复 | 用户核对下游请求，再选择原会话恢复或新分支 | 被覆盖checkpoint不能假定原位恢复，先读恢复范围 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 隔离profile与备份存储，金额未知 | 宿主能力核查和样例验证 | 未测配置时间 |
| 持续使用 | 摘要和后续模型调用、双域存储 | 选择范围与摘要语义复核 | 无任务级token和正确率数据 |
| 失败恢复 | 保留日志与存储域，可能重新请求 | 按operation核对未知、恢复分支或备份 | 不应以新ID盲目重试 |
| 退出 | 保留依赖profile的插件和存储 | 先确认路由释放或改用完整备份 | 不能假定还原文本即能卸载 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 选择性上下文编辑 | 真实Provider请求变换接线 | 实际目标宿主运行效果 |
| 提交核实 | 持久回读比较有效输入 | 跨进程故障全组合 |
| 上下文压缩 | 提供摘要与恢复机制 | 事实遗漏、任务质量和净token收益 |
| 结果未知恢复 | 操作ID查询和阻止继续写 | 全量真实恢复时间 |

没有合格后续任务计数及全部成本，不计算单位成本。见 [Q03](#research-q03)。

> **思考**：持久回读只能确认所选有效消息与预期一致，不能证明摘要保留任务所需事实。profile仍依赖插件和两份存储域，结果未知时需暂停并查询操作，不能把恢复当作随时无损卸载。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手动摘要重开会话，它以不可变请求profile保留原始日志和消息角色，按ID与指纹选择性替换有效输入，再以持久回读核对提交结果。增量在请求治理与恢复接线，尚无语义质量或净节费实测。见 [Q01](#research-q01)、[Q03](#research-q03)。

消息ID与指纹、不可变profile、写后回读以及未知操作核对把界面状态与实际请求区分开，值得在上下文治理中借鉴。单实例队列和结构验证不保证全局事务或摘要语义，迁移需适配宿主日志和重放协议。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

持久回读只能确认所选有效消息与预期一致，不能证明摘要保留任务所需事实。profile仍依赖插件和两份存储域，结果未知时需暂停并查询操作，不能把恢复当作随时无损卸载。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

在非关键会话副本先改一条可核对文本并检查实际下游输入和重启结果；遇未核实状态停止写入，保留操作ID、日志和双域，退回完整备份或核对后的恢复分支。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查请求转发、提交核对与恢复限制的源码；作者验收叙述未作本轮运行证据。现有贡献是有条件的机制判断，关键事实清单属于未来假设。

- 已检查：作者 README、包清单、源码路径 adapters/deepseek-harness/index.js、adapters/deepseek-harness/request-transform.js、adapters/deepseek-harness/host-api.js、adapters/deepseek-harness/client.js、adapters/deepseek-harness/client-state.js、adapters/deepseek-harness/package.json、adapters/deepseek-harness/README.md 及固定范围 inventory；组件：adapters/deepseek-harness。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查该adapter的宿主/浏览器入口、请求投影、受保护消息、操作身份、冲突和持久回读。未完整审计共享Core、全部摘要闭包、恢复分支执行和作者验收日志，不把作者历史版本测试当成本轮执行。
- 下一步：固定会话捕获变换前后下游输入，再在写入各阶段中断并按原operation核对；同任务比较摘要后的关键事实与后续正确率，计入全部token和人工。以上未执行。

**分析版本**

- **仓库**：[jermaine123123/agent-context-editor](https://github.com/jermaine123123/agent-context-editor)
- **版本号**：0.6.0（[固定提交 759646d](https://github.com/jermaine123123/agent-context-editor/tree/759646d8d73c504d7480b9def3e7a0af56c667af)）
- **版本日期**：2026-10-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

现有验证主要覆盖身份、结构和持久结果，可进一步试验摘要前后关键事实清单，检查工具结论和未完成承诺是否丢失。用相同会话与模型比较遗漏率、后续任务正确率、人工复核和全部调用成本；若清单仍漏关键事实或新增负担超过节省，应否定该设计增量。此假设未实现、未验证。见 [Q04](#research-q04)。

固定会话捕获变换前后下游输入，再在写入各阶段中断并按原operation核对；同任务比较摘要后的关键事实与后续正确率，计入全部token和人工。以上未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 15 | 13914 | 13168 | 431 | — |
| .md | source | 2 | 238 | — | — | 4739 |
| .mjs | source | 2 | 104 | 90 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/jermaine123123/agent-context-editor/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：上下文编辑如何进入下一次请求，验证与恢复边界能否支持有限试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户编辑什么，如何映射到下一次模型请求？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它面向长会话中需要查找某条消息、修正文本、排除已过时材料或把完整回合压为摘要的用户。合格结果不是面板里文字改变，而是后续模型请求使用编辑后的有效输入，同时原始会话事件可追溯。界面hide只是视图操作，不能当成模型上下文排除。

宿主apply初始化ContextEditorHost，浏览器conversation.view挂载Context Editor并按sessionId构建控制器。现代Surface适配器具备必要服务时安装RequestTransformRuntime。替换与排除生成不可变profile，以原消息ID和内容指纹关联；model/selection选择context-editor Provider，再在agent/request与llm/stream链路中将消息变换后转发到原Provider。这是实际请求转接而非只改UI或系统提示。

transformMessages核对原消息指纹，替换保留消息ID和角色，非文本块须符合受保护规则；工具结果核对call身份，已知签名推理不能被任意改写。没有profile的普通会话保持原路由。这样的投影保留原始日志，但数据不从日志物理删除，用户若想删除敏感历史不能把排除当作擦除。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/deepseek-harness/index.js:1291-1328](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/index.js#L1291-L1328)

初始化根据宿主能力安装请求变换，能力标签明确只是interface-recognized。

<details>
<summary>查看原文（38行）</summary>

```text
  async init() {
    this.domain = await this.ctx.storageDomain.open(contextEditorDomainSpec)
    this.table = this.domain.table('sessions')
    this.hostAdapter = detectHostAdapter(this.ctx)
    const initialReport = createCompatibilityReport(this.ctx, PLUGIN_VERSION, this.hostAdapter)
    this.compatibilityCacheKey = compatibilityCacheKey(initialReport)
    const cached = ContextEditorHost.compatibilityReports.get(this.compatibilityCacheKey)
    if (cached !== undefined) {
      this.compatibilityReport = cached
    } else {
      const selfTest = this.hostAdapter === SURFACE_ADAPTER_ID ? runSurfaceSelfTest(this.ctx) : undefined
      this.compatibilityReport = createCompatibilityReport(this.ctx, PLUGIN_VERSION, this.hostAdapter, selfTest)
      ContextEditorHost.compatibilityReports.set(this.compatibilityCacheKey, this.compatibilityReport)
    }
    if (this.hostAdapter === SURFACE_ADAPTER_ID
      && typeof this.ctx.llm?.registerAdapter === 'function' && typeof this.ctx.llm?.resolveModelInfo === 'function') {
      const domain = await this.ctx.storageDomain.open(requestTransformDomain)
      this.requestTransform = new RequestTransformRuntime(this.ctx, domain)
      try { await this.requestTransform.install() } catch (error) {
        await this.requestTransform.dispose()
        await this.domain.close()
        throw error
      }
      this.applyRequestCapabilities()
    }
  }

  applyRequestCapabilities() {
    if (this.requestTransform) {
      const reason = this.requestTransform.availabilityReason()
      this.compatibilityReport = structuredClone(this.compatibilityReport)
      for (const feature of ['contextExclusion', 'assistantReplacement', 'contextReplacement']) {
        this.compatibilityReport.features[feature] = {
          available: !reason, status: reason ? 'unsupported' : 'available', verificationLevel: 'interface-recognized',
          ...(reason ? { reason } : {}),
          scope: 'recognized-text-reasoning-tools-and-image-text-through-context-editor-provider',
          evidence: ['Plugin-owned persisted model profiles; original Session events remain intact', 'Requires the Context Editor Provider; full host acceptance is recorded separately'],
        }
```

</details>

**依据 2 · 源码核查**：[adapters/deepseek-harness/client.js:1961-1989](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/client.js#L1961-L1989)

真实会话视图与sessionId控制器注册。

<details>
<summary>查看原文（29行）</summary>

```text
export async function apply(ctx) {
  const disposeRemote = await ctx.remote.$mount(contextEditorRemote)
  ctx.inject(['slots', 'remote', 'remote.contextEditor', 'uiWorkspace'], scopedCtx => {
    const controllers = new Map()
    const controllerFor = sessionId => {
      const key = String(sessionId)
      let controller = controllers.get(key)
      if (controller === undefined) {
        controller = new ContextEditorController(scopedCtx.remote.contextEditor, key)
        controllers.set(key, controller)
      }
      return controller
    }

    scopedCtx.effect(() => () => {
      for (const controller of controllers.values()) controller.dispose()
      controllers.clear()
    }, 'context-editor-deepseek-harness: controllers')

    scopedCtx.slots.inject('conversation.view', () => scopedCtx.slots.register({
      name: 'conversation.view',
      id: 'context-editor',
      order: 20,
      label: () => 'Context Editor',
      inject: sessionId => ({
        controller: controllerFor(sessionId),
        openSession: target => scopedCtx.uiWorkspace.openSession(target),
      }),
    }, ContextEditorView))
```

</details>

**依据 3 · 源码核查**：[adapters/deepseek-harness/request-transform.js:137-163](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/request-transform.js#L137-L163)

实际按消息ID和原文指纹实施替换或移除，并保留角色。

<details>
<summary>查看原文（27行）</summary>

```text
export function transformMessages(messages, profile) {
  profile = migrateRequestProfile(profile, messages)
  const patches = new Map(profile.changes.map(change => [change.originalId, change]))
  const seen = new Set()
  return expandCheckpointMessages(messages, profile).flatMap(message => {
    const change = patches.get(message.id)
    if (!change) return [message]
    if (seen.has(message.id)) throw new Error('CONTEXT_EDITOR_DUPLICATE_MESSAGE_ID')
    seen.add(message.id)
    if (messageFingerprint(message) !== change.originalFingerprint) throw new Error('CONTEXT_EDITOR_MESSAGE_CHANGED')
    const modern = profile.version === 2 || profile.version === 3
    if (!modern && !isPlainMessage(message)) throw new Error('CONTEXT_EDITOR_PLAIN_TEXT_REQUIRED')
    if (modern && !canTransformMessage(message)) throw new Error('CONTEXT_EDITOR_UNSUPPORTED_MESSAGE_CONTRACT')
    if (change.mode === 'remove') return []
    if ((!modern && !isPlainMessage(change.message)) || change.message.id !== message.id || change.message.role !== message.role) {
      throw new Error('CONTEXT_EDITOR_INVALID_PROFILE_MESSAGE')
    }
    const replacement = structuredClone(change.message)
    if (modern) {
      validateReplacement(message, replacement)
      replacement.source = projectedMessageSource(message, replacement.content)
      return [replacement]
    }
    // Text edits cannot retain an adapter's old serialized response. Signed blocks are rejected above.
    if (replacement.role === 'assistant' && replacement.source?.kind === 'model') delete replacement.source.replayState
    return [replacement]
  })
```

</details>

**依据 4 · 源码核查**：[adapters/deepseek-harness/request-transform.js:350-373](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/request-transform.js#L350-L373)

agent/request路由与llm/stream拦截实际接通。

<details>
<summary>查看原文（24行）</summary>

```text
    this.disposers.push(this.ctx.llm.registerAdapter([REQUEST_PROVIDER], new ProfileAdapter()))
    this.disposers.push(this.ctx.on('agent/pre-step', async ({ agent }, next) => {
      const decision = await next()
      if (decision.kind !== 'enter' || !owner.fromSession(agent.session) || owner.fromSession(agent.session).profile.routeState === 'released') return decision
      return { ...decision, messages: decision.messages.filter(message => message.source?.plugin !== 'model-selection' && message.source?.kind !== 'model-selection') }
    }, { global: true, prepend: true }))
    this.disposers.push(this.ctx.on('agent/request', async ({ agent }, next) => {
      const route = await next()
      let selected = owner.fromSession(agent.session)
      if (!selected) return route
      selected = await owner.upgradeProfile(agent.session, selected)
      if (selected.profile.routeState === 'released') return route.provider === REQUEST_PROVIDER ? { ...route, ...selected.profile.upstream } : route
      selected = await owner.rebind(agent.session, selected, route)
      return { ...route, provider: REQUEST_PROVIDER, model: selected.id }
    }, { global: true, prepend: true }))
    this.disposers.push(this.ctx.on('llm/stream', (options, next) => {
      if (owner.forwarded.has(options)) return next()
      const session = options.sessionId === undefined ? undefined : owner.ctx.sessions.get(options.sessionId)
      const selected = options.provider === REQUEST_PROVIDER
        ? { id: options.model, profile: owner.profile(options.model) }
        : session ? owner.fromSession(session) : undefined
      if (!selected || (selected.profile.routeState === 'released' && options.provider !== REQUEST_PROVIDER)) return next()
      return owner.stream(options, selected.profile, owner.effectiveRequests.has(options))
    }, { global: true, prepend: true }))
```

</details>

**依据 5 · 源码核查**：[adapters/deepseek-harness/request-transform.js:405-414](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/request-transform.js#L405-L414)

变换后的messages转发到上游Provider。

<details>
<summary>查看原文（10行）</summary>

```text
      let messages = alreadyEffective ? options.messages : transformMessages(options.messages, profile)
      messages = messages.map(message => {
        if (message.role !== 'assistant' || message.source?.provider !== REQUEST_PROVIDER) return message
        const sourceProfile = this.profile(message.source.model)
        return { ...message, source: { ...message.source, ...sourceProfile.upstream } }
      })
      const route = options.provider === REQUEST_PROVIDER ? profile.upstream : { provider: options.provider, model: options.model }
      const forwarded = { ...options, ...route, messages, signal: options.signal ? AbortSignal.any([options.signal, controller.signal]) : controller.signal }
      this.forwarded.add(forwarded)
      yield* this.ctx.llm.stream(forwarded)
```

</details>

**依据 6 · 源码核查**：[adapters/deepseek-harness/request-transform.js:37-66](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/request-transform.js#L37-L66)

工具身份与非文本块、签名推理保护。

<details>
<summary>查看原文（30行）</summary>

```text
export function canTransformMessage(message) {
  if (!Array.isArray(message?.content) || !['user', 'assistant', 'tool'].includes(message.role)) return false
  if (message.role === 'tool' && (message.source?.kind !== 'tool' || !message.toolCallId
    || message.toolCallId !== message.source.callId)) return false
  if (message.source?.signed || message.source?.replayBound) return false
  const replay = message.source?.replayState
  if (replay && (replay.response?.kind !== 'deepseek-messages' || replay.response?.version !== 1
    || replay.blocks?.length !== message.content.length
    || replay.blocks.some((block, i) => block.type !== message.content[i].type))) return false
  return message.content.every(block => (['text', 'reasoning', 'tool-call', 'image'].includes(block.type)
      || (block.type === 'tool-result' && message.source?.kind === 'tool' && block.toolCallId === message.source.callId
        && Array.isArray(block.content) && block.content.every(value => ['text', 'image'].includes(value.type))))
    && (block.type !== 'text' || (!block.signature && !block.signed)))
}

function validateReplacement(original, replacement) {
  if (!canTransformMessage(original) || !canTransformMessage({ ...replacement, source: { ...replacement.source, replayState: undefined } })) throw new Error('CONTEXT_EDITOR_UNSUPPORTED_MESSAGE_CONTRACT')
  // Non-text blocks can only be retained unchanged or removed as a validated selection.
  const remaining = [...original.content]
  for (const block of replacement.content) {
    if (block.type === 'text') continue
    const index = remaining.findIndex(value => requestFingerprint(value) === requestFingerprint(block))
    if (index < 0) throw new Error('CONTEXT_EDITOR_PROTECTED_BLOCK_CHANGED')
    remaining.splice(index, 1)
  }
  const protectedBlocks = original.content.filter((block, index) => block.type === 'reasoning'
    && (block.signature || original.source?.replayState?.blocks?.[index]?.signature))
  for (const block of protectedBlocks) {
    if (!replacement.content.some(value => requestFingerprint(value) === requestFingerprint(block))) throw new Error('CONTEXT_EDITOR_SIGNED_REASONING_REQUIRED')
  }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 写入验证、并发与恢复能约束哪些失败？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

写操作在单个Host服务实例内按sessionId排队，忙碌会话拒绝写入；请求携带基线版本，第一次提交遇版本不匹配返回冲突。同operationId绑定请求指纹，复用同ID改了载荷会拒绝；已有pending或unverified操作会阻止本会话继续写。它解决的是常见同服务多视图竞态与结果未知后的重复操作，不应从局部队列宣称跨进程全局事务。

提交先准备profile，再追加选择事件并flush；随后从持久层重新读取日志、恢复会话、重算有效消息，与预期结果逐字比较，通过才记录persisted-and-verified。失败记录unverified并返回明确状态，而不是自动回滚所有已写内容。浏览器记住操作ID，断线后调用getOperation核对，未知状态会暂停写入。重试应复用身份并先核对，不能盲目创建新操作。

v4候选通过官方格式与关系验证器，缺少写契约时拒绝；这不能替代摘要语义正确性。单条摘要能否原会话恢复，取决于checkpoint仍在active Surface中；被后续摘要或原生压缩覆盖时需要恢复为分支，不能把“恢复”理解为保留所有后来消息的一键撤销。作者还报告桌面和模型请求验收，但本轮未读取并复现其完整日志，因此证据仍为作者声明与源码核查。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/deepseek-harness/index.js:1724-1732](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/index.js#L1724-L1732)

按session排队只在当前服务实例内。

```text
  enqueue(sessionId, operation) {
    if (!this.mutationAdmissionOpen) return Promise.reject(new Error('CONTEXT_EDITOR_DISPOSING'))
    const previous = this.operationTails.get(sessionId) ?? Promise.resolve()
    const result = previous.then(operation)
    const tail = result.then(() => undefined, () => undefined)
    this.operationTails.set(sessionId, tail)
    return result.finally(() => {
      if (this.operationTails.get(sessionId) === tail) this.operationTails.delete(sessionId)
    })
```

**依据 2 · 源码核查**：[adapters/deepseek-harness/index.js:2820-2842](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/index.js#L2820-L2842)

忙碌、版本冲突、操作复用及待核实写入门禁。

<details>
<summary>查看原文（23行）</summary>

```text
    if (!operationId) throw new Error('CONTEXT_EDITOR_OPERATION_ID_REQUIRED')
    return this.enqueue(sessionId, async () => {
      if (!this.mutationAdmissionOpen) throw new Error('CONTEXT_EDITOR_UNLOADING')
      if (isBusySession(this.ctx, sessionId)) throw new Error('CONTEXT_EDITOR_BUSY')
      return withSourceAgent(this.ctx, sessionId, async agent => {
        const session = agent.session
        const initial = this.projectionFromSession(session)
        const input = {
          mutation, action: request.action ?? null, unitId: request.unitId ?? null,
          ...(mutation === 'restore-condensation' ? { targetOperationId: request.targetOperationId } : {}),
          unitIds: request.unitIds ?? null, recordIds: request.recordIds ?? null,
          text: request.text ?? null, excludeAssociatedReasoning: Boolean(request.excludeAssociatedReasoning),
        }
        const prior = this.requestTransform.operation(session, operationId)
        if (prior && prior.requestFingerprint !== requestFingerprint(input)) throw new Error('CONTEXT_EDITOR_OPERATION_REUSED')
        const expected = String(request.baseContextRevision ?? request.expectedRevision ?? request.baseRevision ?? '')
        if (!prior && expected !== initial.contextRevision && expected !== initial.revision) {
          return { ok: false, conflict: true, operationId, snapshot: this.snapshotOf(initial, false), commit: { operationId, status: 'conflict', contextVersion: initial.contextRevision } }
        }
        for (const [, value] of this.requestTransform.operations.entries()) {
          if (value === prior || !['pending', 'unverified'].includes(value.status)) continue
          const origin = this.requestTransform.profile(value.profileId).origin
          if (origin.id === session.id && origin.createdAt === session.header.createdAt) throw new Error('CONTEXT_EDITOR_PENDING_OPERATION_REQUIRES_VERIFICATION')
```

</details>

**依据 3 · 源码核查**：[adapters/deepseek-harness/index.js:2900-2925](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/index.js#L2900-L2925)

flush后持久回读和有效消息比较，不通过记录unverified。

<details>
<summary>查看原文（26行）</summary>

```text
        const prepared = await this.requestTransform.prepare(session, operationId, input, changes, replacementEvent, checkpointRestoration)
        const alreadySelected = session.snapshotEvents().some(value => isProfileSelection(value, REQUEST_PROVIDER, prepared.id))
        const verificationProfile = alreadySelected ? this.requestTransform.fromSession(session)?.profile ?? prepared.profile : prepared.profile
        const expectedMessages = transformMessages(session.deriveMessages(), verificationProfile)
        try {
          const event = this.requestTransform.appendSelection(session, prepared)
          await this.ctx.sessions.flush(session)
          this.historyCache.delete(sessionId)
          const persisted = await this.inspect(sessionId)
          if (!persisted.events.some(value => isProfileSelection(value, REQUEST_PROVIDER, prepared.id))) {
            throw new Error('CONTEXT_EDITOR_COMMIT_VERIFICATION_FAILED:profile-selection-not-persisted')
          }
          const restored = restoreSession(sessionId, persisted.events, persisted.meta, persisted.inheritedEventCount, this.ctx.sessions.messageProjections)
          const latest = this.requestTransform.fromSession(restored)
          if (!latest) throw new Error('CONTEXT_EDITOR_COMMIT_VERIFICATION_FAILED:profile-not-selected')
          if (!sameJson(transformMessages(restored.deriveMessages(), latest.profile), expectedMessages)) throw new Error('CONTEXT_EDITOR_COMMIT_VERIFICATION_FAILED:effective-message-mismatch')
          await this.requestTransform.settle(session, operationId, 'persisted-and-verified')
          this.searchCache.clear()
          const next = await this.readProjection(sessionId)
          return success(this.snapshotOf(next, false), {
            operationId, eventId: String(event.seq), expectedRevision: next.revision,
            commit: { operationId, status: 'persisted-and-verified', eventId: String(event.seq), persistenceLocations: ['session-log', 'context_editor_requests'], contextVersion: next.contextRevision },
          })
        } catch (error) {
          await this.requestTransform.settle(session, operationId, 'unverified', String(error?.message ?? error))
          return { ok: false, operationId, commit: { operationId, status: 'unverified', reason: String(error?.message ?? error), contextVersion: initial.contextRevision } }
```

</details>

**依据 4 · 源码核查**：[adapters/deepseek-harness/client.js:1511-1537](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/client.js#L1511-L1537)

客户端按操作ID核对，查询失败保留未知状态。

<details>
<summary>查看原文（27行）</summary>

```text
  const resolvePendingReplacement = useCallback(async operationId => {
    let operation
    try {
      operation = await controller.getOperation(operationId)
    } catch {
      if (currentSessionIdRef.current !== String(sessionId)) return 'stale'
      setOperationRecoveryPending(false)
      setOperationUnverified(true)
      setNotice(text.operationUnverified)
      return 'unverified'
    }
    if (currentSessionIdRef.current !== String(sessionId)) return 'stale'
    if (!operation) {
      clearPendingReplacement(sessionId, operationId)
      setOperationRecoveryPending(false)
      setOperationUnverified(false)
      return 'missing'
    }
    const status = operation.status ?? operation.commit?.status
    if (status === 'persisted-and-verified') {
      clearPendingReplacement(sessionId, operationId)
      replacementOperationIds.current.delete(`${operation.action}:${operation.targetOperationId ?? operation.unitId}`)
      setOperationRecoveryPending(false)
      setOperationUnverified(false)
      setNotice('')
      await refresh(true)
      return status
```

</details>

**依据 5 · 源码核查**：[adapters/deepseek-harness/index.js:1125-1129](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/index.js#L1125-L1129)

原会话恢复要求checkpoint仍在active Surface。

```text
function inlineCondensationRecovery(event, projection) {
  if (!projection?.requestTransform) return { available: false, reason: 'request-transform-unavailable' }
  if (!Number.isSafeInteger(event.checkpointSeq)) return { available: false, reason: 'checkpoint-unverified' }
  if (!projection.activeSurfaceSeqs?.includes(event.checkpointSeq)) return { available: false, reason: 'checkpoint-covered' }
  return { available: true }
```

**依据 6 · 源码核查**：[adapters/deepseek-harness/host-api.js:21-32](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/host-api.js#L21-L32)

v4写契约不支持时拒绝，候选交官方验证器。

<details>
<summary>查看原文（12行）</summary>

```text
/** Validate a detached candidate before touching the live log or its persistence handle. */
export function validateSessionCandidate(session) {
  const version = session.header?.version ?? SESSION_FORMAT_VERSION
  if (version < 4) return
  if (version !== 4 || !hasV4WriteContract) throw new Error('CONTEXT_EDITOR_SESSION_FORMAT_WRITE_UNSUPPORTED')
  const artifact = {
    // Session's logical header omits the root depth; the durable v4 codec requires it explicitly.
    header: { ...structuredClone(session.header), delegationDepth: session.header.delegationDepth ?? 0 },
    events: structuredClone(eventsOf(session)),
    inheritedEventCount: session.inheritedEventCount ?? 0,
  }
  v4Api.restoreReleasedV4Artifact(artifact, sessionApi.KNOWN_SESSION_EVENT_TYPES)
```

</details>

**依据 7 · 作者声明**：[adapters/deepseek-harness/README.md:7-17](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/README.md#L7-L17)

作者报告验证和恢复范围，不作为本轮执行证据。

<details>
<summary>查看原文（11行）</summary>

```text
The v4 adapter saves the next request through the official `model/selection` event. Normal Agent execution creates its own `request/header`; edits and exclusions saved before a restart remain selected. Plugin messages use the producer source `context-editor`. Detached checkpoint candidates pass the official v4 format and relationship validator before append, flush and persistence readback.

First-class tool messages retain their call identity and error flag. Image attachments and known signed reasoning remain protected. Restore A preserves summary B, existing edits and later messages. A checkpoint covered by another checkpoint or native compaction requires recovery to a new branch. Ranges cannot cross an unselected System snapshot in the active host Surface; select a contiguous complete turn or regenerate the selection.

Request profile formats 1/2/3 remain readable. When a v4 conversion is necessary, the plugin verifies original message identities, writes a new immutable profile, and checks its persisted selection. Historical profiles are never overwritten. Keep session logs and both plugin storage domains together; the plugin remains required while a profile depends on it.

Some old plugin logs contain a `request/header` outside an open turn. The official v3→v4 importer rejects those logs. The repository helper `scripts/upgrade-deepseek-legacy-session.mjs` creates a separate validated session while preserving the original file. It accepts standalone uncompressed v3 logs and config-only plugin headers; seeded sessions, catalog/delivery markers and other header changes are refused. Back up the complete isolated profile and stop it before using this recovery helper.

The exact release archive is installed through the official plugin manager without version exemptions. Integration uses the Harness actually bundled in the verified Desktop installer; Desktop window checks are recorded separately from local model request tests and real cloud smoke. Diagnostics distinguish interface recognition, memory checks, persistent replay and external acceptance. Unknown formats or missing v4 validators disable writes with an explicit reason. Only `0.2.0-rc.2` has been added to the peer range; future releases require fresh acceptance. See [COMPATIBILITY.md](./COMPATIBILITY.md).

Build the archive with the commands below. For repeatable isolated acceptance, use `scripts/verify-deepseek-060.ps1` in the repository, supplying the prepared Desktop root, exact archive and optional installed old Harness / Playwright paths. Cloud tests are opt-in and retain the cumulative eight-request limit for this task.
```

</details>

#### 缺口

- 跨进程并发、断电及真实宿主重启的全组合结果未独立验证。
  **影响**：不能把单实例队列与持久回读称为全局无损事务。
  **进一步探讨**：在独立副本上按提交前、flush后及回读前注入中断，核对原日志、profile和重连状态；跨进程写需另验存储契约。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对重开会话或手动摘要的增量及全周期负担是什么？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

相对复制摘要重开会话，它提供按消息身份选择性修改有效请求、保留原日志和局部恢复的路线，原角色与受保护结构不会简单扁平化为一条摘要。相对只隐藏消息的面板，它实际接入Provider转发；这属于上下文治理与恢复机制的增量，不证明摘要后任务质量不降或token一定节省。

代价是引入持续的请求路由与两份存储域依赖。会话日志、context_editor和context_editor_requests需共同保留；profile仍依赖插件时卸载会影响请求继续。代码会在没有变化及没有特殊重放依赖时释放路由，但不能据此声称所有恢复操作都能立即卸载。自定义compaction Provider或modelPolicies被明确判为不支持。当前包列Node>=22.19.0，若干宿主peer范围和明确0.2.0-rc.2；未来版本不能只靠版本相近推可用。

首次需要隔离副本、包与宿主能力检查；每次替换、排除或摘要均需要人理解哪些事实会被模型看见。摘要生成会有模型调用，持续存储与排障也有资源和人工成本。失败时先查询operation状态，未知即暂停，保留日志与存储域；重要任务可回完整备份的新profile或经核对的恢复分支。没有按合格后续任务计的token、耗时和错误率记录，无法计算净成本。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/deepseek-harness/request-transform.js:433-484](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/request-transform.js#L433-L484)

prepare建立不可变profile和操作记录；无变化且无特殊重放依赖才释放路由。

<details>
<summary>查看原文（52行）</summary>

```text
  async prepare(session, operationId, request, changes, replacementEvent, checkpointRestoration) {
    if (this.availabilityReason()) throw new Error('CONTEXT_EDITOR_COMPACTION_ROUTE_UNSUPPORTED')
    const requestHash = requestFingerprint(request)
    const prior = this.operation(session, operationId)
    if (prior) {
      if (prior.requestFingerprint !== requestHash) throw new Error('CONTEXT_EDITOR_OPERATION_REUSED')
      return { id: prior.profileId, profile: this.profile(prior.profileId), existing: true }
    }
    const priorSelected = this.fromSession(session)
    const selected = priorSelected ? { ...priorSelected, profile: migrateRequestProfile(priorSelected.profile, session.deriveMessages()) } : undefined
    const config = session.requestHeader()?.config
    const upstream = selected && selected.profile.routeState !== 'released'
      ? selected.profile.upstream
      : config?.provider === REQUEST_PROVIDER ? selected?.profile.upstream : config && { provider: config.provider, model: config.model }
    if (!upstream || upstream.provider === REQUEST_PROVIDER) throw new Error('CONTEXT_EDITOR_MODEL_ROUTE_REQUIRED')
    const patches = new Map((selected?.profile.changes ?? []).map(change => [change.rootEventSeq, change]))
    const events = session.snapshotEvents()
    const messages = session.deriveMessages()
    const checkpointRestorations = [...(selected?.profile.checkpointRestorations ?? []), ...(checkpointRestoration ? [checkpointRestoration] : [])]
    const editableMessages = expandCheckpointMessages(messages, { checkpointRestorations })
    for (const change of changes) {
      const originalEvent = events[change.rootEventSeq]
      const source = originalEvent?.type === 'user/message' ? originalEvent.data : originalEvent?.data?.message
      const previous = patches.get(change.rootEventSeq)
      const raw = editableMessages.find(message => message.id === (previous?.originalId ?? source?.id))
      if (!raw || !canTransformMessage(raw)) throw new Error('CONTEXT_EDITOR_UNSUPPORTED_MESSAGE_CONTRACT')
      if (change.mode === 'clear') { patches.delete(change.rootEventSeq); continue }
      const message = change.mode === 'replace' ? { ...structuredClone(raw), content: structuredClone(change.message.content) } : undefined
      if (message) validateReplacement(raw, message)
      if (message && messageFingerprint(message) === messageFingerprint(raw)) { patches.delete(change.rootEventSeq); continue }
      patches.set(change.rootEventSeq, {
        rootEventSeq: change.rootEventSeq, originalId: raw.id, originalFingerprint: messageFingerprint(raw),
        mode: change.mode, ...(message ? { message } : {}),
      })
    }
    const profile = profileSchema.parse({
      version: checkpointRestorations.length ? 3 : 2, routeState: 'active', upstream, origin: { id: session.id, createdAt: session.header.createdAt },
      ...(checkpointRestorations.length ? { checkpointRestorations } : {}),
      operation: { action: (request.mutation === 'context' ? request.action : request.mutation) ?? 'context', unitId: request.unitId ?? null, unitIds: request.unitIds ?? null, ...(request.targetOperationId ? { targetOperationId: request.targetOperationId } : {}) },
      previous: selected?.id ?? null, operationId,
      baseline: requestFingerprint({ messages, header: session.requestHeader() }),
      changes: [...patches.values()].sort((a, b) => a.rootEventSeq - b.rootEventSeq),
      replacementEvents: [...(selected?.profile.replacementEvents ?? []), ...(replacementEvent ? [replacementEvent] : [])],
    })
    transformMessages(messages, profile)
    // Unsigned plain responses do not need their old Provider replay envelope after restore.
    if (!profile.checkpointRestorations?.length && !profile.changes.length && !messages.some(message => message.source?.provider === REQUEST_PROVIDER
      && (!canTransformMessage(message) || message.content.some(block => block.type !== 'text')))) profile.routeState = 'released'
    const id = `ce${profile.version}-${requestFingerprint(profile)}`
    await this.profiles.put(id, profile)
    await this.operations.put(operationKey(session, operationId), { profileId: id, requestFingerprint: requestHash, status: 'pending' })
    return { id, profile, existing: false }
```

</details>

**依据 2 · 源码核查**：[adapters/deepseek-harness/request-transform.js:424-429](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/request-transform.js#L424-L429)

自定义压缩路由被判不支持。

```text
  availabilityReason() {
    const compaction = this.ctx.get('compaction')
    if (compaction && (compaction.constructor.name !== 'BasicCompactionEngine'
      || compaction.config?.summarizationProvider !== '' || compaction.config?.modelPolicies?.length)) {
      return 'request-transform-compaction-route'
    }
```

**依据 3 · 作者声明**：[adapters/deepseek-harness/README.md:9-15](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/README.md#L9-L15)

作者明确保留日志与两个存储域，插件持续依赖和恢复版本限制。

```text
First-class tool messages retain their call identity and error flag. Image attachments and known signed reasoning remain protected. Restore A preserves summary B, existing edits and later messages. A checkpoint covered by another checkpoint or native compaction requires recovery to a new branch. Ranges cannot cross an unselected System snapshot in the active host Surface; select a contiguous complete turn or regenerate the selection.

Request profile formats 1/2/3 remain readable. When a v4 conversion is necessary, the plugin verifies original message identities, writes a new immutable profile, and checks its persisted selection. Historical profiles are never overwritten. Keep session logs and both plugin storage domains together; the plugin remains required while a profile depends on it.

Some old plugin logs contain a `request/header` outside an open turn. The official v3→v4 importer rejects those logs. The repository helper `scripts/upgrade-deepseek-legacy-session.mjs` creates a separate validated session while preserving the original file. It accepts standalone uncompressed v3 logs and config-only plugin headers; seeded sessions, catalog/delivery markers and other header changes are refused. Back up the complete isolated profile and stop it before using this recovery helper.

The exact release archive is installed through the official plugin manager without version exemptions. Integration uses the Harness actually bundled in the verified Desktop installer; Desktop window checks are recorded separately from local model request tests and real cloud smoke. Diagnostics distinguish interface recognition, memory checks, persistent replay and external acceptance. Unknown formats or missing v4 validators disable writes with an explicit reason. Only `0.2.0-rc.2` has been added to the peer range; future releases require fresh acceptance. See [COMPATIBILITY.md](./COMPATIBILITY.md).
```

**依据 4 · 作者声明**：[adapters/deepseek-harness/package.json:1-8](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/package.json#L1-L8)

包名、版本及Node运行时声明。

```text
{
  "name": "context-editor-deepseek-harness",
  "version": "0.6.0",
  "description": "Context Editor with verified User Surface edits and checkpoint recovery for DeepSeek Harness",
  "type": "module",
  "engines": {
    "node": ">=22.19.0"
  },
```

**依据 5 · 源码核查**：[adapters/deepseek-harness/index.js:3211-3257](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/index.js#L3211-L3257)

视图hide写入侧栏状态，区别于请求变换。

<details>
<summary>查看原文（47行）</summary>

```text
  async commitView(request) {
    const sessionId = requestSessionId(request)
    return this.enqueue(sessionId, async () => {
      if (isBusySession(this.ctx, sessionId)) throw new Error('CONTEXT_EDITOR_BUSY')
      const projection = await this.readProjection(sessionId)
      if (String(request?.baseRevision ?? '') !== projection.revision) {
        return { ok: false, conflict: true, snapshot: this.snapshotOf(projection) }
      }
      const action = request?.action
      if (!['hide', 'restore', 'reset'].includes(action)) throw new Error('CONTEXT_EDITOR_ACTION_INVALID')
      // Re-read immediately before constructing the event.  This closes the
      // normal cross-client race window even when another writer shares the
      // same storage-domain table; a stale writer gets the authoritative
      // snapshot and never performs a partial write.
      const latest = await this.readProjection(sessionId)
      if (latest.revision !== projection.revision) {
        return { ok: false, conflict: true, snapshot: this.snapshotOf(latest) }
      }
      const event = buildViewEvent({
        identity: latest.identity,
        sourceRevision: latest.sourceRevision,
        baseRevision: latest.revision,
        events: latest.events,
        records: latest.records,
        states: latest.states,
        action,
        recordIds: Array.isArray(request?.recordIds) ? request.recordIds : undefined,
        unitIds: Array.isArray(request?.unitIds) ? request.unitIds : undefined,
        transactionId: randomId('context-view'),
      })
      if (event.changes.length === 0) return success(this.snapshotOf(projection))
      const nextRow = {
        session: {
          createdAt: latest.identity.createdAt,
          ...(latest.identity.cwd === undefined ? {} : { cwd: latest.identity.cwd }),
        },
        schemaVersion: 1,
        storageVersion: 1,
        events: [...latest.events, event],
        replacementEvents: latest.replacementEvents ?? [],
        condensationEvents: latest.condensationEvents ?? [],
        recoveryEvents: latest.recoveryEvents ?? [],
      }
      await this.table.put(sessionId, nextRow)
      this.searchCache.clear()
      const next = await this.readProjection(sessionId)
      return success(this.snapshotOf(next), { eventId: event.transactionId })
```

</details>

#### 缺口

- 没有真实长会话任务的节省量、遗漏事实率和恢复人工记录。
  **影响**：不能用摘要长度下降当作合格任务成本改善。
  **进一步探讨**：同任务比较不编辑、手动摘要新会话和本组件，在保留事实准确率相近时统计全部摘要/重试token、人工时间与后续任务正确率。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁值得试用，后续哪项假设可被推翻？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议仅由理解请求上下文和备份操作的用户，在兼容宿主的非关键会话副本中试用。先对一条可核对文本做替换或排除，再捕获实际下游输入并重启验证；单看面板和接口诊断不足以证明成功。遇unverified、缺profile、受保护块拒绝或自定义压缩路由不支持时停止写，保留原目录并查询同一operation，不以新ID反复尝试。正式关键会话在确认恢复路线前应继续用原会话或完整备份。

可从“结构和持久化验证充分，但摘要语义仍靠人”推导一个未验证假设。将用户标出的关键事实、工具结论与未完成承诺作为摘要前后的可核对清单，可能在保持选择性压缩的同时暴露语义遗漏。它增加的是结果验收层，不是新的压缩模型，也不应自动将模型自评当事实。最小对照固定会话和摘要模型，比较现有确认与关键事实检查两种流程，测遗漏率、后续任务正确率、人工复核时间及全部调用成本。若检查清单只是重复摘要、仍漏掉关键信息或人工负担超过节省，假设应被削弱。该方案尚未实现，不能计入当前创新贡献。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/deepseek-harness/index.js:2903-2925](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/index.js#L2903-L2925)

现有成功判据比较有效消息的结构化结果，失败需停止核实。

<details>
<summary>查看原文（23行）</summary>

```text
        const expectedMessages = transformMessages(session.deriveMessages(), verificationProfile)
        try {
          const event = this.requestTransform.appendSelection(session, prepared)
          await this.ctx.sessions.flush(session)
          this.historyCache.delete(sessionId)
          const persisted = await this.inspect(sessionId)
          if (!persisted.events.some(value => isProfileSelection(value, REQUEST_PROVIDER, prepared.id))) {
            throw new Error('CONTEXT_EDITOR_COMMIT_VERIFICATION_FAILED:profile-selection-not-persisted')
          }
          const restored = restoreSession(sessionId, persisted.events, persisted.meta, persisted.inheritedEventCount, this.ctx.sessions.messageProjections)
          const latest = this.requestTransform.fromSession(restored)
          if (!latest) throw new Error('CONTEXT_EDITOR_COMMIT_VERIFICATION_FAILED:profile-not-selected')
          if (!sameJson(transformMessages(restored.deriveMessages(), latest.profile), expectedMessages)) throw new Error('CONTEXT_EDITOR_COMMIT_VERIFICATION_FAILED:effective-message-mismatch')
          await this.requestTransform.settle(session, operationId, 'persisted-and-verified')
          this.searchCache.clear()
          const next = await this.readProjection(sessionId)
          return success(this.snapshotOf(next, false), {
            operationId, eventId: String(event.seq), expectedRevision: next.revision,
            commit: { operationId, status: 'persisted-and-verified', eventId: String(event.seq), persistenceLocations: ['session-log', 'context_editor_requests'], contextVersion: next.contextRevision },
          })
        } catch (error) {
          await this.requestTransform.settle(session, operationId, 'unverified', String(error?.message ?? error))
          return { ok: false, operationId, commit: { operationId, status: 'unverified', reason: String(error?.message ?? error), contextVersion: initial.contextRevision } }
```

</details>

**依据 2 · 源码核查**：[adapters/deepseek-harness/request-transform.js:37-66](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/request-transform.js#L37-L66)

受保护消息门禁限定可编辑范围。

<details>
<summary>查看原文（30行）</summary>

```text
export function canTransformMessage(message) {
  if (!Array.isArray(message?.content) || !['user', 'assistant', 'tool'].includes(message.role)) return false
  if (message.role === 'tool' && (message.source?.kind !== 'tool' || !message.toolCallId
    || message.toolCallId !== message.source.callId)) return false
  if (message.source?.signed || message.source?.replayBound) return false
  const replay = message.source?.replayState
  if (replay && (replay.response?.kind !== 'deepseek-messages' || replay.response?.version !== 1
    || replay.blocks?.length !== message.content.length
    || replay.blocks.some((block, i) => block.type !== message.content[i].type))) return false
  return message.content.every(block => (['text', 'reasoning', 'tool-call', 'image'].includes(block.type)
      || (block.type === 'tool-result' && message.source?.kind === 'tool' && block.toolCallId === message.source.callId
        && Array.isArray(block.content) && block.content.every(value => ['text', 'image'].includes(value.type))))
    && (block.type !== 'text' || (!block.signature && !block.signed)))
}

function validateReplacement(original, replacement) {
  if (!canTransformMessage(original) || !canTransformMessage({ ...replacement, source: { ...replacement.source, replayState: undefined } })) throw new Error('CONTEXT_EDITOR_UNSUPPORTED_MESSAGE_CONTRACT')
  // Non-text blocks can only be retained unchanged or removed as a validated selection.
  const remaining = [...original.content]
  for (const block of replacement.content) {
    if (block.type === 'text') continue
    const index = remaining.findIndex(value => requestFingerprint(value) === requestFingerprint(block))
    if (index < 0) throw new Error('CONTEXT_EDITOR_PROTECTED_BLOCK_CHANGED')
    remaining.splice(index, 1)
  }
  const protectedBlocks = original.content.filter((block, index) => block.type === 'reasoning'
    && (block.signature || original.source?.replayState?.blocks?.[index]?.signature))
  for (const block of protectedBlocks) {
    if (!replacement.content.some(value => requestFingerprint(value) === requestFingerprint(block))) throw new Error('CONTEXT_EDITOR_SIGNED_REASONING_REQUIRED')
  }
```

</details>

**依据 3 · 作者声明**：[adapters/deepseek-harness/README.md:11-17](https://github.com/jermaine123123/agent-context-editor/blob/759646d8d73c504d7480b9def3e7a0af56c667af/adapters/deepseek-harness/README.md#L11-L17)

作者说明插件依赖、版本界限与独立验收要求。

```text
Request profile formats 1/2/3 remain readable. When a v4 conversion is necessary, the plugin verifies original message identities, writes a new immutable profile, and checks its persisted selection. Historical profiles are never overwritten. Keep session logs and both plugin storage domains together; the plugin remains required while a profile depends on it.

Some old plugin logs contain a `request/header` outside an open turn. The official v3→v4 importer rejects those logs. The repository helper `scripts/upgrade-deepseek-legacy-session.mjs` creates a separate validated session while preserving the original file. It accepts standalone uncompressed v3 logs and config-only plugin headers; seeded sessions, catalog/delivery markers and other header changes are refused. Back up the complete isolated profile and stop it before using this recovery helper.

The exact release archive is installed through the official plugin manager without version exemptions. Integration uses the Harness actually bundled in the verified Desktop installer; Desktop window checks are recorded separately from local model request tests and real cloud smoke. Diagnostics distinguish interface recognition, memory checks, persistent replay and external acceptance. Unknown formats or missing v4 validators disable writes with an explicit reason. Only `0.2.0-rc.2` has been added to the peer range; future releases require fresh acceptance. See [COMPATIBILITY.md](./COMPATIBILITY.md).

Build the archive with the commands below. For repeatable isolated acceptance, use `scripts/verify-deepseek-060.ps1` in the repository, supplying the prepared Desktop root, exact archive and optional installed old Harness / Playwright paths. Cloud tests are opt-in and retain the cumulative eight-request limit for this task.
```

#### 缺口

- 关键事实检查方案和实际语义效果对照尚无结果。
  **影响**：不能称为已验证的新功能或可靠压缩保证。
  **进一步探讨**：以固定会话内事先标定的事实清单核对压缩前后，并把人工时间和所有模型调用计入。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
