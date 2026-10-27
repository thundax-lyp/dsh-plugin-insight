# dsh-mnemon

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[58fae98](https://github.com/omdsh-dev/dsh-mnemon/tree/58fae98cd586d41e2ce9843c1593236936e0e9e5)

<!-- BEGIN META -->
[![GitHub ★ 719](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=719&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-mnemon) [![npm 30d 55,434](https://img.shields.io/static/v1?label=npm+30d&message=55%2C434&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mnemon) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mnemon)
<!-- END META -->

> **功能**：为 DSH 组合运行记忆、项目文档和长期记忆来源，并提供每回合查看与管理界面。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02)支持的贡献是将分层来源、每回合固定视图及可管理状态组合为宿主记忆机制，减少全量注入和配置中途漂移；不把召回命中或条目数当任务收益。

> **主要限制**：[Q03](#research-q03) 的scope和[Q04](#research-q04) revision/容量保护解决状态一致性，不保证事实语义正确或所有Provider隔离。压缩成功、写入receipt和可见引用仍不能证明旧错已消除或最终答案正确；关闭组件也不等于删除数据。

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
  - [Q01 · 分层记忆相比手工文件有什么增量？](#detail-section-11)
  - [Q02 · 回合实际怎样固定组合并进入提示？](#detail-section-12)
  - [Q03 · 固定View与工作区哈希能保证什么隔离？](#detail-section-13)
  - [Q04 · 确认与revision校验会保证记忆内容真实吗？](#detail-section-14)
  - [Q05 · 怎样限定本地试用与退出？](#detail-section-15)
  - [Q06 · 纠错传播评估能否比单纯召回命中更有意义？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：跨会话反复使用同一项目资料且愿意维护事实的用户，可用独立本地存储和虚构项目先比较手工MEMORY文件。

手工USER/MEMORY和按需打开项目文档是低复杂度参照；Mnemon增量是分层可组合、固定回合和管理可见性，效果需同任务检验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 分层View | 固定回合来源并按预算投影 | 不保证事实正确 |
| runtime来源 | 常驻记忆与用户资料 | scope及revision需匹配 |
| 管理写入/压缩 | 受确认和版本约束修改 | 语义候选仍需核对 |
| 可组合扩展 | 选择来源与可写范围 | 不等于全部Provider隔离认证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配DSH及回合服务 | 是 | 固定View和提示 | 可能该回合无记忆 |
| 唯一或明确选择的来源/策略 | 是 | 按角色组合 | 歧义报错不静默选 |
| 本地独立数据根与备份 | 试用必需 | 隔离和回退 | 不在唯一资料直接试 |
| 外部Provider/同步凭据 | 可选 | 远程存储/同步 | 不启用则不扩大流向 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选独立本地根与合成项目 | 保留手工基线 |
| 试记忆 | 写入一条可核对事实并跨回合读取 | 来源/范围清楚 |
| 纠错 | 更正带条件事实并核对新回答 | 不用receipt代替答案检查 |
| 退出 | 禁用并查备份与残留 | 回手工文件，不假设删除 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 插件/本地存储资源未知 | 匹配宿主、选策略与数据根 | 先独立存储及备份 |
| 持续 | 投影token、任务Agent/检索费用未知 | 纠错、来源管理与清理 | 非命中越多越好 |
| 恢复退出 | 备份、导入与残留存储未知 | 核对各层旧事实和删除 | 关闭非删除，改位置不搬数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 回合一致性 | 固定View/generation与scope | 全场景运行效果 |
| 状态写入 | 确认、revision、容量及不重引入已删项 | 语义压缩/跨层纠错正确性 |
| 知识任务 | 分层与可见来源机制 | 任务错误率、节时和总费用 |

> **思考**：[Q03](#research-q03) 的scope和[Q04](#research-q04) revision/容量保护解决状态一致性，不保证事实语义正确或所有Provider隔离。压缩成功、写入receipt和可见引用仍不能证明旧错已消除或最终答案正确；关闭组件也不等于删除数据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02)支持的贡献是将分层来源、每回合固定视图及可管理状态组合为宿主记忆机制，减少全量注入和配置中途漂移；不把召回命中或条目数当任务收益。

[Q02](#research-q02)generation lease与配置batch延迟reconcile值得复用，避免中途换来源；[Q04](#research-q04)只读超时不冒充写取消及语义候选/确定性packing职责分离较清楚。移植需真实回合、释放、scope权威和Provider契约，不是复制一个记忆提示。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的scope和[Q04](#research-q04) revision/容量保护解决状态一致性，不保证事实语义正确或所有Provider隔离。压缩成功、写入receipt和可见引用仍不能证明旧错已消除或最终答案正确；关闭组件也不等于删除数据。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 只启用本地来源，用虚构项目验证保存、读取、纠错及禁用，保持手工文件参照；第三方Provider和Git同步先关闭。串项目、旧错持续或预算失控时停该来源，明确备份范围并核对残留，不把receipt当正确性。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查真实回合装配、View/scope、默认分层、runtime写入与压缩保护；未运行模型或审计全部Provider/同步链。可有限本地试用，纠错传播验证是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/host/agent-memory-turn.ts、src/host/lifecycle.ts、src/core/runtime.ts、plugins/dsh-mnemon-strategy-default-three-tier/src/strategy.ts、plugins/dsh-mnemon-source-runtime/src/source.ts、plugins/dsh-mnemon-source-runtime/src/controller.ts、src/core/turns.ts、src/sdk/workspace-storage.ts、src/core/source-calls.ts、plugins/dsh-mnemon-strategy-scoped/src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定Host回合接线、Core registry/generation、View scope、默认三层策略、runtime来源及写入压缩源码；未执行插件、模型或完整审计所有Provider/Git同步/技能演化。
- 下一步：使用固定项目事实、过期项和带否定的修正集合，比较手工文件与本地分层的回答错误、跨项目混入、token和人工纠错；本轮不运行。

**分析版本**

- **仓库**：[omdsh-dev/dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon)
- **版本号**：0.5.36（[固定提交 58fae98](https://github.com/omdsh-dev/dsh-mnemon/tree/58fae98cd586d41e2ce9843c1593236936e0e9e5)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出跨层纠错传播的任务级验证假设，区分合理固定的旧回合与新回合过期污染，对照手工文件的错误、token和维护时间；若无改善不推广自动跨层能力。

使用固定项目事实、过期项和带否定的修正集合，比较手工文件与本地分层的回答错误、跨项目混入、token和人工纠错；本轮不运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 581 | 38597 | — | — | 788630 |
| .mjs | source | 56 | 6289 | 5661 | 434 | — |
| .mts | source | 2 | 253 | 207 | 28 | — |
| .ts | source | 295 | 47151 | 39217 | 4646 | — |
| .js | source | 4 | 67 | 60 | 7 | — |
| .ts | test | 205 | 40963 | 36687 | 1420 | — |
| .tsx | source | 72 | 12930 | 10942 | 1203 | — |
| .tsx | test | 30 | 11589 | 10274 | 456 | — |
| .mjs | example | 34 | 4460 | 3998 | 335 | — |
| .cjs | example | 2 | 30 | 22 | 7 | — |
| .ts | example | 15 | 1000 | 925 | 34 | — |
| .tsx | example | 2 | 177 | 165 | 4 | — |
| .mjs | test | 15 | 1915 | 1698 | 115 | — |
| .md | example | 4 | 40 | — | — | 217 |

</details>

**活跃度**

[![Issue 未关闭 18](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=18&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-mnemon/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 63](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=63&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-mnemon/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 49](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=49&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-mnemon/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：分层可组合记忆如何固定每回合与作用域，能否在本地有限试用中保持可追溯且正确可修？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 分层记忆相比手工文件有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向跨会话反复使用同一项目事实、偏好和资料的DSH用户，合格结果是回答用到当前相关资料且能查到来源与修正位置，而非记忆条目更多。手工USER/MEMORY文件简单但容易全量塞入或遗漏长资料；项目把常驻运行记忆、项目文档和长期证据来源按不同角色组合，并提供每回合读写可见性和管理入口。默认策略把runtime eager投影、documents/memory spaces routed读取，按预算分配，而不是所有存储无差别注入。机制上减少资料组织分歧，但召回命中不保证答案正确，作者演示为虚构seed项目不等于真实用户效果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-45](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/README.md#L31-L45)

目标摩擦、分层能力及虚构演示边界。

<details>
<summary>查看原文（15行）</summary>

```text
## Why dsh-mnemon

An Agent that starts every session from scratch keeps asking what it was already told. Putting everything into one memory store is no better: it either floods each turn or misses what matters. dsh-mnemon gives DeepSeek Harness memory that is layered, visible and composable, and skills that improve with use.

- **The right memory for each turn.** Preferences and working facts stay in context. Project documents and long-term evidence are searched only when a question needs them.
- **You can see what a turn used.** Under each reply, the turn memory bar lists the documents and memories the turn read and wrote, and one click opens each in the Memory System. The Memory System shows everything that is stored and lets you edit it.
- **Save to memory in one click.** When a conversation turns up a fact worth keeping, the brain mark under the reply hands it to a task Agent, which removes duplicates, distils it and writes it to the right Memory Space, or saves it where you choose: working memory, your profile or a Memory Space. The receipt says where it went.
- **Skills that improve with use.** Skills keeps every DSH skill in one place. It can review your real conversations, draft a better `SKILL.md` and backtest it before you adopt it, and it installs more skills from skills.sh, GitHub and sites that publish Agent Skills.
- **Compose it on the Plugins page.** Choose a main strategy and optional enhancements, and switch them without moving any data. Every component has its own page for its settings.
- **Keep data where you want it.** Local by default with Mnemon Native, or one of eight third-party Providers. Storage can be global, per workspace, centralized or in a directory you choose, with ZIP backup.
- **Extend it.** Sources and Strategies are ordinary DSH plugins built on public SDKs. An installed component gets the same pages and switches as the shipped ones.

## See it in action

These recordings come from a real WebUI with the live DeepSeek model answering, on a seeded, fictional project, Lumen. Waits for the model play faster, marked in the lower right corner.
```

</details>

**依据 2 · 作者声明**：[README.md:67-75](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/README.md#L67-L75)

三层数据和进入上下文方式。

```text
## Three kinds of memory

| Memory | Keep here | How it reaches the Agent |
|---|---|---|
| **Runtime memory** | Preferences, working agreements, facts needed on the next turn | Injected every turn as compact USER.md and MEMORY.md |
| **Project Documents** | Designs, investigations, procedures and handoffs | Searched first, then read when relevant |
| **Memory Spaces** | Durable facts, decisions, entities and their relationships | Recalled on demand from the enabled Providers |

The default **Layered strategy** keeps runtime memory resident and reads the other two on demand. The **General strategy** offers every available source within one budget and lets the model decide how to use each. A **memory space** is one named, Provider-backed scope for long-term evidence; the Chinese product term is 记忆空间.
```

**依据 3 · 源码核查**：[plugins/dsh-mnemon-strategy-default-three-tier/src/strategy.ts:54-95](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/plugins/dsh-mnemon-strategy-default-three-tier/src/strategy.ts#L54-L95)

角色选择、90%runtime预算及eager/routed分配。

<details>
<summary>查看原文（42行）</summary>

```text
function composeThreeTier(request: MemoryViewRequest, sources: readonly MemorySourceFacts[]): MemoryViewSpec {
    const runtime = soleSource(sources, 'working-context')
    const documents = soleSource(sources, 'narrative')
    const memorySpaces = soleSource(sources, 'durable-evidence')
    const durable = memorySpaces?.sourceTypeId === 'memory-spaces'
    // The guidance names mnemon_recall only while Memory Spaces offer recall, and
    // archiving into them only while one takes writes here (#336). Both follow the
    // View's facts, after the layer's participation settings.
    const recall = durable && memorySpaces.routeIds.includes('recall')
    const hints = memorySpaces?.hints
    const count = (key: string): number | undefined => {
      const value = hints !== null && typeof hints === 'object' && !Array.isArray(hints) ? hints[key] : undefined
      return typeof value === 'number' ? value : undefined
    }
    const archivable = count('archivableCount') ?? count('activeCount')
    const archive = durable && memorySpaces.actionIds.includes('remember') && (archivable === undefined || archivable > 0)
    const classicSources = runtime?.sourceTypeId === 'runtime' && documents?.sourceTypeId === 'documents' && durable
    const selected = [runtime, documents, memorySpaces].filter((source): source is MemorySourceFacts => source !== undefined)
    const projectionBudget = request.budget.maxProjectionCharacters
    const runtimeBudget = runtime === undefined || !runtime.capabilities.includes('project') ? 0 : Math.max(1, Math.floor(projectionBudget * 0.9))
    let remaining = Math.max(0, projectionBudget - runtimeBudget)
    const documentsBudget = documents === undefined || !documents.capabilities.includes('project') || remaining === 0 ? 0 : Math.max(1, Math.floor(remaining / (memorySpaces === undefined ? 1 : 2)))
    remaining -= documentsBudget
    const memorySpacesBudget = memorySpaces === undefined || !memorySpaces.capabilities.includes('project') ? 0 : remaining
    const allocation = new Map<string, { mode: 'eager' | 'routed'; maxCharacters: number }>()
    if (runtime !== undefined && runtimeBudget > 0) allocation.set(runtime.sourceInstanceKey, { mode: 'eager', maxCharacters: runtimeBudget })
    if (documents !== undefined && documentsBudget > 0) allocation.set(documents.sourceInstanceKey, { mode: 'routed', maxCharacters: documentsBudget })
    if (memorySpaces !== undefined && memorySpacesBudget > 0) allocation.set(memorySpaces.sourceInstanceKey, { mode: 'routed', maxCharacters: memorySpacesBudget })
    return {
      strategyTypeId: 'default-three-tier',
      guidance: {
        ...(classicSources ? recall ? { routing: ROUTING_GUIDANCE, reminders: THREE_TIER_REMINDERS } : { routing: ROUTING_GUIDANCE_WITHOUT_RECALL, reminders: THREE_TIER_REMINDERS_WITHOUT_RECALL } : {}),
        ...(runtime?.sourceTypeId === 'runtime' && runtime.capabilities.includes('project') ? { system: boundedRuntimeMemoryProtocol({ recall, archive }) } : {}),
      },
      sources: selected.map(source => ({
        sourceInstanceKey: source.sourceInstanceKey,
        required: false,
        ...(allocation.get(source.sourceInstanceKey) === undefined ? {} : { projection: allocation.get(source.sourceInstanceKey)! }),
        routeIds: source.routeIds.filter(route => route === 'inspect' || route === 'search' || route === 'recall' || route === 'related'),
        actionIds: [...source.actionIds],
      })),
      explanation: 'Project exact working context eagerly, expose bounded narrative and durable-evidence covers, then route reads through View-pinned grants.',
```

</details>

#### 缺口

- 同项目任务正确率、纠错效果和独立用户价值未知
  **影响**：不能从命中率或UI可见性推导生产收益
  **进一步探讨**：固定项目任务及过期事实，对照手工MEMORY文件的回答正确、来源有效和修正时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 回合实际怎样固定组合并进入提示？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

host assemblePrompt先从持久session事件确定open turn，取消idle工作，调用memoryTurn.begin后继续宿主提示装配，最后applyMemoryViewGuidance。AgentMemoryTurn通过executions.turn取得graph/context和释放句柄，锁定同回合View；代际已变或关闭会release并拒绝晚到结果。Core runtime集中注册Source/Strategy，批量配置变更期间保留旧snapshot，fiber稳定后reconcile；已有回合引用不是即时换成新配置。runtime source facts先缓存scope对应projection，project检查expectedRevision再按字符预算输出fragment。具体链支持每回合一致的来源版本，而不是每次工具读取随机取最新。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/lifecycle.ts:390-416](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/src/host/lifecycle.ts#L390-L416)

真实提示装配begin、guidance和turn结束释放。

<details>
<summary>查看原文（27行）</summary>

```text
  private async assemblePrompt(assembly: PromptAssembly, context: PromptAssemblyContext, next: () => Promise<PromptAssembly>): Promise<PromptAssembly> {
    if (context.agent !== undefined && context.agent.id !== this.agent.id) return next()
    const turn = openAgentTurn(this.agent)
    if (turn === undefined) return next()
    // Cancel idle work before prompt assembly; the execution owner drains it.
    this.cancelIdleReview(true)
    if (context.signal?.aborted === true || openAgentTurn(this.agent) !== turn) return next()
    await this.memoryTurn?.begin(turn, context.signal)
    const assembled = await next()
    return applyMemoryViewGuidance(assembled, this.memoryTurn?.current?.context.view, this.config.routingGuidance)
  }

  private releaseView(turn?: number): void {
    this.memoryTurn?.end(turn)
  }

  private async finishTurn(payload: TurnStoppingPayload): Promise<void> {
    this.scheduleIdleReview(payload.turn)
  }

  private sessionEvent(session: HostAgent['session'], event: HostSessionEvent): void {
    if (session !== this.agent.session || event.type !== 'turn/end') return
    const turn = eventTurn(event)
    const current = this.memoryTurn?.current
    const pinned = turn === undefined || current?.turn !== turn ? undefined : current
    if (pinned === undefined) return
    this.releaseView(turn)
```

</details>

**依据 2 · 源码核查**：[src/host/agent-memory-turn.ts:90-127](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/src/host/agent-memory-turn.ts#L90-L127)

begin去重、不可用降级与结束取消释放。

<details>
<summary>查看原文（38行）</summary>

```text
  async begin(turn: number, signal?: AbortSignal): Promise<void> {
    if (this.closed) throw new Error('memory Agent lifetime has ended')
    signal?.throwIfAborted()
    if (this.pinned?.turn === turn || this.unavailable?.turn === turn) return
    if (this.pending?.turn === turn) return this.pending.result
    this.end()
    const generation = this.generation
    const controller = new AbortController()
    const abort = () => controller.abort(signal!.reason)
    signal?.addEventListener('abort', abort, { once: true })
    const result = this.pin(turn, generation, controller.signal).catch((error: unknown) => {
      // Memory is optional for a conversation. With no composition serving,
      // the turn runs without a View: nothing revives a disabled policy, and
      // the turn itself does not fail. It stays that way until the turn ends.
      if (!isMemoryCompositionUnavailable(error) || this.closed || this.generation !== generation) throw error
      this.unavailable = { turn, reason: error.message }
      this.clearInspection()
      if (this.warned !== error.message) console.warn(`[dsh-mnemon] this turn runs without memory: ${error.message}`)
      this.warned = error.message
    })
    this.pending = { turn, generation, controller, result }
    try {
      await result
    } finally {
      signal?.removeEventListener('abort', abort)
      if (this.pending?.generation === generation) this.pending = undefined
    }
  }

  end(turn?: number): void {
    if (turn !== undefined && this.pinned?.turn !== turn && this.pending?.turn !== turn && this.unavailable?.turn !== turn) return
    this.generation += 1
    this.unavailable = undefined
    this.pending?.controller.abort(new Error('memory turn ended during View preparation'))
    this.pending = undefined
    const pinned = this.pinned
    this.pinned = undefined
    pinned?.release()
```

</details>

**依据 3 · 源码核查**：[src/host/agent-memory-turn.ts:137-150](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/src/host/agent-memory-turn.ts#L137-L150)

execution取得及代际/关闭检查。

<details>
<summary>查看原文（14行）</summary>

```text
  private async pin(turn: number, generation: number, signal: AbortSignal): Promise<void> {
    const execution = await this.runtime.executions.turn(this.agent, turn, signal, this.delegation)
    const { graph, context } = execution
    try {
      if (this.closed || this.generation !== generation) throw new Error('memory turn ended during View preparation')
      signal?.throwIfAborted()
      const inspection = inspectMemoryView(graph.memoryComposition.generation(context.view.runtimeGeneration)!, context.view, 'active', turn, modelMemoryWake(graph, context).text)
      this.pinned = { turn, graph, context, release: execution.release }
      this.warned = undefined
      this.lastInspection = inspection
      this.lastWorkspace = context.scope.workspaceId === undefined ? undefined : resolve(context.scope.workspaceId)
    } catch (error) {
      execution.release()
      throw error
```

</details>

**依据 4 · 源码核查**：[src/core/runtime.ts:37-76](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/src/core/runtime.ts#L37-L76)

配置事务snapshot和generation reconcile。

<details>
<summary>查看原文（40行）</summary>

```text
  /** Host assembly transaction: existing leases stay served until all Fibers settle. */
  async batch<T>(operation: () => Promise<T>): Promise<T> {
    if (this.closed) throw new Error('Memory Runtime is disposed')
    if (this.batchDepth++ === 0) this.batchSnapshot = this.contributions.snapshot()
    try { return await operation() }
    finally {
      if (--this.batchDepth === 0) {
        this.batchSnapshot = undefined
        const pending = [...this.reconciliations]
        this.reconciliations.clear()
        for (const [host, snapshot] of pending) host.reconcile(snapshot)
      }
    }
  }

  installContributions(value: MemoryContributionInstall): () => void {
    if (this.closed) throw new Error('Memory Runtime is disposed')
    return this.contributions.install(value)
  }

  contributionSnapshot(): MemoryContributionSnapshot {
    return this.contributions.snapshot()
  }

  onContributionsChanged(listener: MemoryContributionListener): () => void {
    return this.contributions.subscribe(listener)
  }

  /** Attach one Host runtime graph to the current definition set. */
  attachGeneration(options: CompileMemoryGenerationOptions = {}): MemoryGenerationAttachment {
    if (this.closed) throw new Error('Memory Runtime is disposed')
    const host = new MemoryGenerationHost(options)
    host.reconcile(this.batchSnapshot ?? this.contributions.snapshot())
    // A workspace first opened during a settings transaction also starts from
    // the committed baseline, then joins the final reconciliation.
    if (this.batchSnapshot !== undefined) this.reconciliations.set(host, this.contributions.snapshot())
    const unsubscribe = this.contributions.subscribe(snapshot => {
      if (this.batchDepth) this.reconciliations.set(host, snapshot)
      else host.reconcile(snapshot)
    })
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-mnemon-source-runtime/src/source.ts:75-105](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/plugins/dsh-mnemon-source-runtime/src/source.ts#L75-L105)

facts与project共享projection并核对revision。

<details>
<summary>查看原文（31行）</summary>

```text
      facts(request) {
        if (request.scenario.startsWith('management.')) return {
          sourceInstanceKey: context.sourceInstanceKey, sourceTypeId: 'runtime', role: 'working-context', availability: 'ready',
          revision: controller.snapshot().revision, capabilities: ['status', 'project', 'write'], routeIds: [], actionIds: ['mutate'],
        }
        const current = projection(request.scope.workspaceId)
        prepared.set(request.scope, current)
        return {
          sourceInstanceKey: context.sourceInstanceKey,
          sourceTypeId: 'runtime',
          role: 'working-context',
          availability: 'ready',
          revision: current.revision,
          capabilities: ['status', 'project', 'write'],
          routeIds: [],
          actionIds: ['mutate'],
        }
      },
      project(request) {
        if (!request.includeProjection) return { fragments: [] }
        const current = prepared.get(request.scope) ?? projection(request.scope.workspaceId)
        prepared.delete(request.scope)
        if (current.revision !== request.expectedRevision) throw new Error('Runtime projection revision changed during composition')
        return {
          fragments: [{
            id: `${context.sourceInstanceKey}/projection`,
            sourceInstanceKey: context.sourceInstanceKey,
            mode: request.mode,
            text: truncate(current.text, request.maxCharacters),
            revision: current.revision,
            provenance: { sourceTypeId: 'runtime' },
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 固定View与工作区哈希能保证什么隔离？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

turns按storage/workspace/session/agent检查turnID是否已绑定另一scope；delegated View不能改变storage和workspace。workspaceStorageId以绝对路径真实祖先规范化后哈希，可识别符号别名和未创建后缀，但移动目录会选择新身份，不自动迁移。Scoped extension能选择sourceKeys和writableSourceKeys，空列表含义明确，属于组合层约束而非操作系统多用户身份。默认策略同角色出现多个来源会报歧义，避免悄悄选一项；它也不是所有第三方Provider数据隔离或删除能力证明。必须固定来源、存储根、宿主和Provider契约，不能把一个本地锁或View称为跨实例服务隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/turns.ts:84-106](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/src/core/turns.ts#L84-L106)

回合ID与scope绑定及固定预算View。

<details>
<summary>查看原文（23行）</summary>

```text
  async beginTurn(turnId: string, scope: MemoryOperationScope, scenario = 'agent.root-turn', signal?: AbortSignal): Promise<ComposableMemoryTurn> {
    if (this.closed) throw new Error('Composable Memory turn manager is disposed')
    signal?.throwIfAborted()
    const id = turnId.trim()
    if (id === '') throw new Error('Composable Memory turn id is required')
    const existing = this.turns.get(id)
    const beginning = this.beginnings.get(id)
    const previousScope = existing?.context.scope ?? beginning?.scope
    if (previousScope !== undefined && (['storage', 'workspaceId', 'sessionId', 'agentId'] as const).some(key => previousScope[key] !== scope[key])) {
      throw new Error('Composable Memory turn id is already bound to another scope')
    }
    if (existing !== undefined) return existing.context
    if (beginning !== undefined) return beginning.promise
    const lease = this.generations.acquire()
    const pending = { scope: { ...scope }, controller: new AbortController(), promise: undefined as unknown as Promise<ComposableMemoryTurn> }
    const abort = () => pending.controller.abort(signal!.reason)
    signal?.addEventListener('abort', abort, { once: true })
    this.beginnings.set(id, pending)
    pending.promise = (async () => {
      try {
        const view = await lease.generation.compose({ scope: pending.scope, scenario, budget: { ...DEFAULT_MEMORY_VIEW_BUDGET } }, pending.controller.signal)
        pending.controller.signal.throwIfAborted()
        const context = Object.freeze({ turnId: id, view, scope: Object.freeze(pending.scope), startedAt: new Date().toISOString() })
```

</details>

**依据 2 · 源码核查**：[src/core/turns.ts:156-170](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/src/core/turns.ts#L156-L170)

委派View禁止改变存储/工作区。

<details>
<summary>查看原文（15行）</summary>

```text
  pinTurn(turnId: string, scope: MemoryOperationScope, viewId: string): ComposableMemoryTurn {
    if (this.closed) throw new Error('Composable Memory turn manager is disposed')
    const id = turnId.trim()
    if (id === '') throw new Error('Composable Memory turn id is required')
    const view = this.get(viewId)
    if (view === undefined) throw new Error(`Composable Memory View is not pinned: ${viewId}`)
    if (view.scope.storage !== scope.storage || view.scope.workspaceId !== scope.workspaceId) throw new Error('Delegated View cannot change its storage scope')
    const existing = this.turns.get(id)
    if (existing !== undefined) {
      if (existing.context.view.id !== viewId || (['storage', 'workspaceId', 'sessionId', 'agentId'] as const).some(key => existing.context.scope[key] !== scope[key])) throw new Error('Composable Memory turn authority changed while pinned')
      return existing.context
    }
    if (this.beginnings.has(id)) throw new Error('Composable Memory turn is already being prepared')
    const lease = this.generations.acquire(view.runtimeGeneration)
    const context = Object.freeze({ turnId: id, view, scope: Object.freeze({ ...scope }), startedAt: new Date().toISOString() })
```

</details>

**依据 3 · 源码核查**：[src/sdk/workspace-storage.ts:5-31](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/src/sdk/workspace-storage.ts#L5-L31)

真实路径与哈希身份，不隐式迁移。

<details>
<summary>查看原文（27行）</summary>

```text
/** Local workspace identity, including aliases with not-yet-created descendants. */
export function canonicalWorkspacePath(workspacePath: string): string {
  if (!isAbsolute(workspacePath) || workspacePath.includes('\0')) throw new Error('Workspace path must be absolute')
  let parent = resolve(workspacePath)
  const suffix: string[] = []
  for (;;) {
    let real: string
    try { real = realpathSync.native(parent) }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
      const next = dirname(parent)
      if (next === parent) throw error
      suffix.unshift(parent.slice(next.length).replace(/^[/\\]+/u, ''))
      parent = next
      continue
    }
    // Windows can report ENOENT below a file, then successfully resolve that file.
    if (suffix.length > 0 && !statSync(real).isDirectory()) {
      throw Object.assign(new Error(`ENOTDIR: not a directory, realpath '${parent}'`), { code: 'ENOTDIR', path: parent, syscall: 'realpath' })
    }
    return join(real, ...suffix)
  }
}

/** A rename or move selects a new directory; resolving identity never writes. */
export function workspaceStorageId(workspacePath: string): string {
  return createHash('sha256').update(canonicalWorkspacePath(workspacePath)).digest('hex')
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-mnemon-strategy-scoped/src/index.ts:17-44](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/plugins/dsh-mnemon-strategy-scoped/src/index.ts#L17-L44)

来源/可写范围及空列表语义。

<details>
<summary>查看原文（28行）</summary>

```text
export function createScopedExtension(config: Config = {}) {
  const selection = config.sourceKeys === undefined ? undefined : validateMemoryViewExtension('selection', {
    sourceKeys: config.sourceKeys, ...(config.writableSourceKeys === undefined ? {} : { writableSourceKeys: config.writableSourceKeys }),
  })
  const writable = config.writableSourceKeys === undefined ? undefined : validateMemoryViewExtension('selection', {
    sourceKeys: config.writableSourceKeys, writableSourceKeys: config.writableSourceKeys,
  }).writableSourceKeys
  return defineMemoryViewExtension({ typeId: 'scoped', packageName: name, slot: 'selection',
    contribute: (_request, sources) => selection ?? {
      sourceKeys: sources.filter(source => roles.includes(source.role))
        .sort((a, b) => roles.indexOf(a.role) - roles.indexOf(b.role) || a.sourceInstanceKey.localeCompare(b.sourceInstanceKey))
        .map(source => source.sourceInstanceKey),
      ...(writable === undefined ? {} : { writableSourceKeys: writable }),
    },
  })
}

export function apply(ctx: Context, config: Config = {}): void {
  installMemory(ctx, { plugin: memoryPlugin, strategyExtensions: [createScopedExtension(config)] })
}

export const memoryStrategyConfiguration = defineMemoryStrategyConfiguration({
  kind: 'strategy-extension', typeId: 'scoped',
  label: { en: 'Scoped composition', 'zh-CN': '范围组合' },
  description: { en: 'Select and order existing Source instances; optionally narrow writes.', 'zh-CN': '选择并排序已有 Source 实例，可进一步收窄写入范围。' },
  fields: [
    { key: 'sourceKeys', input: 'source-list', label: { en: 'Sources, in priority order', 'zh-CN': '参与 Source（按优先顺序）' }, description: { en: 'Unset uses all eligible instances. An explicit empty list selects none.', 'zh-CN': '未设置时使用全部适用实例；明确留空则不选择任何实例。' } },
    { key: 'writableSourceKeys', input: 'source-list', label: { en: 'Writable Sources', 'zh-CN': '允许写入的 Source' }, description: { en: 'Unset preserves existing permissions. An empty list makes this View read-only.', 'zh-CN': '未设置时保留已有权限；明确留空使此 View 只读。' } },
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-mnemon-strategy-default-three-tier/src/strategy.ts:9-14](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/plugins/dsh-mnemon-strategy-default-three-tier/src/strategy.ts#L9-L14)

同角色多个来源主动拒绝歧义。

```text
function soleSource(sources: readonly MemorySourceFacts[], role: typeof VIEW_ROLES[number]): MemorySourceFacts | undefined {
  const matches = sources
    .filter(source => source.role === role && source.availability !== 'unavailable')
    .sort((left, right) => left.sourceInstanceKey.localeCompare(right.sourceInstanceKey))
  if (matches.length > 1) throw new Error(`default-three-tier View Strategy found ambiguous ${role} Sources; select an explicit Strategy`)
  return matches[0]
```

#### 缺口

- 各Provider的隔离、删除及多进程部署契约未逐一核查
  **影响**：本地默认试用结论不能推广至全部服务
  **进一步探讨**：每个拟启用Provider单独核对作用域、数据流和删除能力，在合成项目A/B核对交叉召回

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 确认与revision校验会保证记忆内容真实吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不会。runtime management mutate要求confirmed，controller把变更排在队列并持锁；compactAndMutate校验expectedRevision，拒绝压缩结果重新引入刚替换/删除项、检查字节预算，保护状态一致性。这个约束值得借鉴，但压缩候选由worker供给，确定性packing只负责UTF-8和容量，不判断候选语义是否漏条件、把猜测当事实或同义旧错仍存。readSource超时包装明确只用于只读composition且不把写操作race成未提交，这能防错误恢复语义，不能证明第三方write天然幂等。旧事实修正仍需核对正文、长期记忆和下游答案，不能用“已写入receipt”代替正确性。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-mnemon-source-runtime/src/source.ts:117-128](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/plugins/dsh-mnemon-source-runtime/src/source.ts#L117-L128)

管理写入需明确确认。

<details>
<summary>查看原文（12行）</summary>

```text
      async manage(request) {
        const input = request.input === null ? {} : record(request.input, 'Runtime Memory management')
        if (request.mode === 'read') {
          let value: unknown
          if (request.operation === 'snapshot') value = controller.snapshot()
          else if (request.operation === 'maintenance-plan') value = await controller.planMaintenance(runtimeMutation(request.input), { preserveImportance: input.preserveImportance === true })
          else throw new Error('unsupported Runtime management read operation: ' + request.operation)
          return { revision: controller.snapshot().revision, value: value as MemoryJsonValue }
        }
        if (!request.confirmed) throw new Error('Runtime management mutation requires explicit confirmation')
        let result: unknown
        if (request.operation === 'mutate') result = await controller.mutate(runtimeMutation(request.input), { preserveImportance: input.preserveImportance === true })
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-mnemon-source-runtime/src/controller.ts:510-514](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/plugins/dsh-mnemon-source-runtime/src/controller.ts#L510-L514)

变更串行队列及锁。

```text
  mutate(request: RuntimeMemoryMutation, options: { preserveImportance?: boolean } = {}): Promise<RuntimeMemoryMutationResult> {
    if (request.target === 'user' && this.userController !== undefined) return this.userController.mutate(request, options)
    const operation = this.queue.then(() => this.withLock(() => this.mutateLocked(request, options.preserveImportance)))
    this.queue = operation.catch(() => undefined)
    return operation
```

**依据 3 · 源码核查**：[plugins/dsh-mnemon-source-runtime/src/controller.ts:551-588](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/plugins/dsh-mnemon-source-runtime/src/controller.ts#L551-L588)

revision冲突、避免重引入、容量和packing语义。

<details>
<summary>查看原文（38行）</summary>

```text
  compactAndMutate(
    expectedRevision: string,
    request: RuntimeMemoryMutation,
    compacted: RuntimeMemoryCompactedEntry[],
    maxCompactedBytes?: number,
    options: { archive?: 'local'; preserveImportance?: boolean } = {},
  ): Promise<RuntimeMemoryMutationResult> {
    if (request.target === 'user' && this.userController !== undefined) {
      return this.userController.compactAndMutate(expectedRevision, request, compacted, maxCompactedBytes, options)
    }
    const operation = this.queue.then(() => this.withLock(() => {
      const file = this.readSource()
      const beforeRevision = revision(file)
      if (beforeRevision !== expectedRevision) throw new RuntimeMemoryConflictError()
      const now = this.now().toISOString()
      const prepared = prepareMutation(file.entries, request, now, options.preserveImportance)
      const compactedByteBudget = maxCompactedBytes ?? this.limits[request.target]
      if (!Number.isInteger(compactedByteBudget) || compactedByteBudget < 0 || compactedByteBudget > this.limits[request.target]) {
        throw new Error('compaction byte budget is invalid')
      }
      if (!prepared.changed) {
        return this.result(request.target, prepared.projectedEntries, prepared.fields)
      }
      const replacements = compactionCandidates(compacted, prepared.compactableEntries, request.target, now)
      if (prepared.pendingEntry !== undefined && replacements.some(entry => entry.content === prepared.pendingEntry!.content)) {
        throw new Error('compacted runtime memory duplicates the pending mutation')
      }
      if (prepared.excludedEntry !== undefined && replacements.some(entry => entry.content === prepared.excludedEntry!.content)) {
        throw new Error('compacted runtime memory reintroduces the replaced or removed entry')
      }
      // The worker supplies semantic candidates; deterministic packing owns exact
      // UTF-8 accounting so the LLM never has to count bytes or delimiters.
      const fitted = packCompactionCandidates(replacements, request.target, compactedByteBudget)
      const targetEntries = [...fitted, ...(prepared.pendingEntry === undefined ? [] : [prepared.pendingEntry])]
      const entries = [...file.entries.filter(entry => entry.target !== request.target), ...targetEntries]
      const used = runtimeBytes(entries, request.target)
      const limit = this.limits[request.target]
      if (used > limit) throw new RuntimeMemoryCapacityError(request.target, runtimeBytes(file.entries, request.target), used, limit)
```

</details>

**依据 4 · 源码核查**：[src/core/source-calls.ts:19-51](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/src/core/source-calls.ts#L19-L51)

只读超时与写结果不race的明确设计。

<details>
<summary>查看原文（33行）</summary>

```text
/**
 * Bounds read-only composition work. Signals stay outside the JSON Strategy
 * input. This is cooperative cancellation, not a sandbox; writes must not be
 * raced against a timeout and then falsely reported as uncommitted.
 */
export async function readSource<T>(
  sourceInstanceKey: string,
  phase: SourceReadPhase,
  timeoutMs: number,
  execute: (signal: AbortSignal) => T | Promise<T>,
  signal?: AbortSignal,
): Promise<T> {
  signal?.throwIfAborted()
  const controller = new AbortController()
  let interrupt!: (reason: unknown) => void
  const interrupted = new Promise<never>((_resolve, reject) => { interrupt = reject })
  const cancel = (reason: unknown) => {
    interrupt(reason)
    controller.abort(reason)
  }
  const abort = () => cancel(signal!.reason)
  signal?.addEventListener('abort', abort, { once: true })
  const timer = setTimeout(() => cancel(new SourceReadFailure(sourceInstanceKey, phase, true)), timeoutMs)
  try {
    const operation = Promise.resolve().then(() => {
      controller.signal.throwIfAborted()
      return execute(controller.signal)
    }).catch(() => {
      if (controller.signal.aborted) throw controller.signal.reason
      // Raw provider errors may contain secrets. Only the owning plugin may log them.
      throw new SourceReadFailure(sourceInstanceKey, phase, false)
    })
    return await Promise.race([operation, interrupted])
```

</details>

#### 缺口

- 语义压缩、纠错后跨层旧事实及最终答案是否仍受污染未知
  **影响**：持久化成功不足以确认正确记忆
  **进一步探讨**：用含否定、条件和冲突的事实集逐项核对压缩与replace/remove后召回和答案，保留反例

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样限定本地试用与退出？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合已有反复项目资料需求且愿意管理事实的用户，先用独立存储与虚构小项目，只启用本地runtime/文档，第三方Provider和Git同步关闭。首次要匹配宿主、选策略与存储根并备份；持续占用每回合投影token，任务Agent保存/压缩、嵌入或第三方检索另有费用，用户还需纠错和清理。失效时View可让该回合无记忆继续而非自动恢复已禁用policy，这不等于任务答案不受影响。README明确关闭组件不删除数据、改位置不搬数据，备份不包含技能演化读过的对话等数据；Git同步会向自己仓库发布可读payload，因此默认本地不代表所有可选链路本地。若项目串记忆、旧错持续注入或费用不可控，禁用相关来源回手工文件，并单独核对删除与备份。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:150-157](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/README.md#L150-L157)

本地/Provider边界、关闭非删除、迁移和Git可读同步。

```text
## Data and trust

- Runtime memory and Project Documents are local files; Mnemon Native is local. Third-party Providers use their own services and scopes.
- Turning a component off does not erase its memory, and changing the storage location does not move data. Use ZIP backup to carry it.
- Skills keeps its evolution data (suggestions, test cases and the conversations reviews read, with secrets redacted) in the local storage root, outside backups. An Agent follows a skill from the market as written, so preview it before installing.
- Git sync publishes the same Mnemon Pack payload as readable files to a repository you own, so another machine can pull it, with **Sync now**, **Check remote** before anything is written, or **Automatic sync**. When two machines wrote one subject differently, both wordings stay until you accept and apply a **Memory reconciliation** plan; see [Git repository sync](https://github.com/omdsh-dev/dsh-mnemon/blob/main/docs/en/guides/operations.md#git-repository-sync).
- Saved Provider credentials stay on the Host and are never exported. Backups still contain private memory; protect them.
- Sources and Strategies are trusted in-process JavaScript, not sandboxed code. Remembered history never outranks current instructions.
```

**依据 2 · 源码核查**：[plugins/dsh-mnemon-strategy-default-three-tier/src/strategy.ts:72-95](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/plugins/dsh-mnemon-strategy-default-three-tier/src/strategy.ts#L72-L95)

每回合有界投影仍占上下文。

<details>
<summary>查看原文（24行）</summary>

```text
    const projectionBudget = request.budget.maxProjectionCharacters
    const runtimeBudget = runtime === undefined || !runtime.capabilities.includes('project') ? 0 : Math.max(1, Math.floor(projectionBudget * 0.9))
    let remaining = Math.max(0, projectionBudget - runtimeBudget)
    const documentsBudget = documents === undefined || !documents.capabilities.includes('project') || remaining === 0 ? 0 : Math.max(1, Math.floor(remaining / (memorySpaces === undefined ? 1 : 2)))
    remaining -= documentsBudget
    const memorySpacesBudget = memorySpaces === undefined || !memorySpaces.capabilities.includes('project') ? 0 : remaining
    const allocation = new Map<string, { mode: 'eager' | 'routed'; maxCharacters: number }>()
    if (runtime !== undefined && runtimeBudget > 0) allocation.set(runtime.sourceInstanceKey, { mode: 'eager', maxCharacters: runtimeBudget })
    if (documents !== undefined && documentsBudget > 0) allocation.set(documents.sourceInstanceKey, { mode: 'routed', maxCharacters: documentsBudget })
    if (memorySpaces !== undefined && memorySpacesBudget > 0) allocation.set(memorySpaces.sourceInstanceKey, { mode: 'routed', maxCharacters: memorySpacesBudget })
    return {
      strategyTypeId: 'default-three-tier',
      guidance: {
        ...(classicSources ? recall ? { routing: ROUTING_GUIDANCE, reminders: THREE_TIER_REMINDERS } : { routing: ROUTING_GUIDANCE_WITHOUT_RECALL, reminders: THREE_TIER_REMINDERS_WITHOUT_RECALL } : {}),
        ...(runtime?.sourceTypeId === 'runtime' && runtime.capabilities.includes('project') ? { system: boundedRuntimeMemoryProtocol({ recall, archive }) } : {}),
      },
      sources: selected.map(source => ({
        sourceInstanceKey: source.sourceInstanceKey,
        required: false,
        ...(allocation.get(source.sourceInstanceKey) === undefined ? {} : { projection: allocation.get(source.sourceInstanceKey)! }),
        routeIds: source.routeIds.filter(route => route === 'inspect' || route === 'search' || route === 'recall' || route === 'related'),
        actionIds: [...source.actionIds],
      })),
      explanation: 'Project exact working context eagerly, expose bounded narrative and durable-evidence covers, then route reads through View-pinned grants.',
```

</details>

**依据 3 · 源码核查**：[src/host/agent-memory-turn.ts:100-108](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/src/host/agent-memory-turn.ts#L100-L108)

不可用该回合无View继续，不复活禁用策略。

```text
    const result = this.pin(turn, generation, controller.signal).catch((error: unknown) => {
      // Memory is optional for a conversation. With no composition serving,
      // the turn runs without a View: nothing revives a disabled policy, and
      // the turn itself does not fail. It stays that way until the turn ends.
      if (!isMemoryCompositionUnavailable(error) || this.closed || this.generation !== generation) throw error
      this.unavailable = { turn, reason: error.message }
      this.clearInspection()
      if (this.warned !== error.message) console.warn(`[dsh-mnemon] this turn runs without memory: ${error.message}`)
      this.warned = error.message
```

#### 缺口

- 备份恢复、技能演化数据清理及总token账单未实测
  **影响**：不能保证退出即删除或总体更省
  **进一步探讨**：对合成项目记录投影/保存/检索账单并核对备份内容及关闭后的残留，不启用未知外部链路

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 纠错传播评估能否比单纯召回命中更有意义？

**研究主题**：新假设与验证

#### 完整回答

已有View版本绑定和replace/remove保护，由此可提出未验证的纠错传播验证假设：以同一项目先写事实、再提供带证据的更正，追踪runtime、文档和长期来源是否保留旧语义、哪些固定回合仍合理使用旧snapshot、下一回合答案是否采纳新事实。它不要求打破在途View一致性，而区分“旧回合固定”和“新回合仍被过期证据污染”。相对只测记忆搜索命中，这更贴近用户能否恢复正确任务。最小对照用手工MEMORY和本地Mnemon跑同批带否定/条件修正题，记录答案错误、纠正次数、token与人工时间；若没有更少错误或维护成本更高，则放弃自动跨层推广，只保留可见管理。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/agent-memory-turn.ts:90-127](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/src/host/agent-memory-turn.ts#L90-L127)

每回合固定与释放说明旧回合和新回合的正确边界。

<details>
<summary>查看原文（38行）</summary>

```text
  async begin(turn: number, signal?: AbortSignal): Promise<void> {
    if (this.closed) throw new Error('memory Agent lifetime has ended')
    signal?.throwIfAborted()
    if (this.pinned?.turn === turn || this.unavailable?.turn === turn) return
    if (this.pending?.turn === turn) return this.pending.result
    this.end()
    const generation = this.generation
    const controller = new AbortController()
    const abort = () => controller.abort(signal!.reason)
    signal?.addEventListener('abort', abort, { once: true })
    const result = this.pin(turn, generation, controller.signal).catch((error: unknown) => {
      // Memory is optional for a conversation. With no composition serving,
      // the turn runs without a View: nothing revives a disabled policy, and
      // the turn itself does not fail. It stays that way until the turn ends.
      if (!isMemoryCompositionUnavailable(error) || this.closed || this.generation !== generation) throw error
      this.unavailable = { turn, reason: error.message }
      this.clearInspection()
      if (this.warned !== error.message) console.warn(`[dsh-mnemon] this turn runs without memory: ${error.message}`)
      this.warned = error.message
    })
    this.pending = { turn, generation, controller, result }
    try {
      await result
    } finally {
      signal?.removeEventListener('abort', abort)
      if (this.pending?.generation === generation) this.pending = undefined
    }
  }

  end(turn?: number): void {
    if (turn !== undefined && this.pinned?.turn !== turn && this.pending?.turn !== turn && this.unavailable?.turn !== turn) return
    this.generation += 1
    this.unavailable = undefined
    this.pending?.controller.abort(new Error('memory turn ended during View preparation'))
    this.pending = undefined
    const pinned = this.pinned
    this.pinned = undefined
    pinned?.release()
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-mnemon-source-runtime/src/controller.ts:563-579](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/plugins/dsh-mnemon-source-runtime/src/controller.ts#L563-L579)

已有revision和不重新引入刚删项，语义级传播仍需专门评估。

<details>
<summary>查看原文（17行）</summary>

```text
      const beforeRevision = revision(file)
      if (beforeRevision !== expectedRevision) throw new RuntimeMemoryConflictError()
      const now = this.now().toISOString()
      const prepared = prepareMutation(file.entries, request, now, options.preserveImportance)
      const compactedByteBudget = maxCompactedBytes ?? this.limits[request.target]
      if (!Number.isInteger(compactedByteBudget) || compactedByteBudget < 0 || compactedByteBudget > this.limits[request.target]) {
        throw new Error('compaction byte budget is invalid')
      }
      if (!prepared.changed) {
        return this.result(request.target, prepared.projectedEntries, prepared.fields)
      }
      const replacements = compactionCandidates(compacted, prepared.compactableEntries, request.target, now)
      if (prepared.pendingEntry !== undefined && replacements.some(entry => entry.content === prepared.pendingEntry!.content)) {
        throw new Error('compacted runtime memory duplicates the pending mutation')
      }
      if (prepared.excludedEntry !== undefined && replacements.some(entry => entry.content === prepared.excludedEntry!.content)) {
        throw new Error('compacted runtime memory reintroduces the replaced or removed entry')
```

</details>

#### 缺口

- 当前是否已有同类评估和真实纠错频率未知
  **影响**：不能把验证方案包装成已确认产品机会
  **进一步探讨**：先核对现测试与用户修正案例，再用固定事实/修正集合形成对照

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
