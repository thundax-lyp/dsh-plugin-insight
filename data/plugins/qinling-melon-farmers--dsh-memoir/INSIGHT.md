# DSH Memoir

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1f513bb](https://github.com/Qinling-Melon-Farmers/dsh-memoir/tree/1f513bbabdb3f2b10be8ee6ec53eb38d82d6e16d)

<!-- BEGIN META -->
[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Qinling-Melon-Farmers/dsh-memoir) [![npm 30d 4,102](https://img.shields.io/static/v1?label=npm+30d&message=4%2C102&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-memoir) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-memoir)
<!-- END META -->

> **功能**：在 DSH 本地记录项目记忆，按需检索并为新会话注入预算内摘要。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明，本地记录、主动搜索与预算内注入能在同一宿主支持跨会话交接。

> **主要限制**：[Q03](#research-q03) 显示，排队蒸馏只是新模型回合，未证明写入。热记忆也会进入模型输入，需控制数据范围。

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
  - [Q01 · 相对手工摘要，本地跨会话记忆增加什么？](#detail-section-11)
  - [Q02 · 记录、检索与会话项目如何绑定？](#detail-section-12)
  - [Q03 · 记忆注入与自动蒸馏会有哪些副作用？](#detail-section-13)
  - [Q04 · 怎样比较跨会话恢复的成本和收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复开启项目会话的开发者，可以记录已确认的决定并在新会话查回。

项目文档可以明确保存权威约定，插件增加自动检索和跨会话注入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 本地记忆 | 记录和查找项目决定 | 依工作目录及存储 |
| 热记忆 | 自动注入有限上下文 | 可关闭，仍交给模型 |
| 蒸馏 | 条件满足时提醒模型保存 | 提醒与实际写入不同 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 工具、提示及会话投影 | 必需 | 注册记忆能力 | 缺对应宿主接线 |
| 本地可写数据 | 保存所需 | 记录确认内容 | 无法持久化 |
| 有效会话路径 | 项目记忆所需 | 选择工作区 | 缺目录仅有引导或无法命中 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 隔离项目并关闭蒸馏 | 无敏感记录 |
| 比较 | 写测试约定后开新会话 | 按记录核对恢复内容 |
| 退出 | 关闭注入并检查历史 | 恢复项目文档流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地存储费用未知 | 准备隔离配置和样本 | 耗时未知 |
| 持续 | 模型上下文及额外回合费用未知 | 纠错并核对来源 | 净收益待测 |
| 恢复 | 备份及资源未知 | 停用并查记录 | 结果未知需回读 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 主动搜索 | 缓存 BM25 排名 | 召回质量 |
| 自动提示 | 项目预算和会话快照 | 准确性和延迟 |
| 蒸馏 | 有条件追加回合 | 实际保存和费用 |

> **思考**：[Q03](#research-q03) 显示，排队蒸馏只是新模型回合，未证明写入。热记忆也会进入模型输入，需控制数据范围。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明，本地记录、主动搜索与预算内注入能在同一宿主支持跨会话交接。

排名缓存和热记忆选择独立；本地持久结果和蒸馏提醒也分别记录，冷启结果未知时需回读。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示，排队蒸馏只是新模型回合，未证明写入。热记忆也会进入模型输入，需控制数据范围。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在隔离环境手工保存并验收一条记录，再独立评估自动蒸馏。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持记忆工具、提示节和蒸馏触发，未运行宿主。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、src/host/index.ts、src/host/store.ts、src/host/retrieval.ts、src/host/autodistill.ts、src/host/routes.ts、src/client/index.tsx、README.en.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 0.9.5，核查提示、项目、主动检索及回合触发。未运行模型或宿主。
- 下一步：以同一测试约定比较自动记忆与人工摘要，记录准确性、成本及退出状态。

**分析版本**

- **仓库**：[Qinling-Melon-Farmers/dsh-memoir](https://github.com/Qinling-Melon-Farmers/dsh-memoir)
- **版本号**：0.9.5（[固定提交 1f513bb](https://github.com/Qinling-Melon-Farmers/dsh-memoir/tree/1f513bbabdb3f2b10be8ee6ec53eb38d82d6e16d)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 验证自动选择是否降低重复摘要。若多出纠错或回合抵消节约，则放弃。

以同一测试约定比较自动记忆与人工摘要，记录准确性、成本及退出状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1535 | — | — | 29286 |
| .mjs | source | 7 | 1136 | 988 | 105 | — |
| .js | source | 19 | 7350 | 6633 | 972 | — |
| .tsx | source | 6 | 1476 | 1324 | 80 | — |
| .ts | source | 29 | 7373 | 6060 | 866 | — |
| .ts | test | 40 | 7538 | 6811 | 242 | — |
| .mjs | example | 1 | 21 | 20 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Qinling-Melon-Farmers/dsh-memoir/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/Qinling-Melon-Farmers/dsh-memoir/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Qinling-Melon-Farmers/dsh-memoir/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 会话如何使用本地历史记忆，怎样判断检索与自动归纳值得采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对手工摘要，本地跨会话记忆增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

频繁在同一项目开新会话的用户可保存已确认决定，用工具找历史，并把少量条目自动带入系统提示。相对复制上次摘要，新增的是结构化保存、预算筛选和按需查找；可审阅的项目文档仍适合充当权威依据。合格结果是新会话能恢复一条已确认约定并回查对应记录。

#### 证据与依据

**依据 1 · 作者声明**：[README.en.md:3-5](https://github.com/Qinling-Melon-Farmers/dsh-memoir/blob/1f513bbabdb3f2b10be8ee6ec53eb38d82d6e16d/README.en.md#L3-L5)

作者定位本地项目记忆。

```text
**Help each new agent session pick up your project.** dsh-memoir is a local-first project-memory plugin for DeepSeek Harness (DSH). It persists confirmed work, lessons and next actions, injects bounded Hot Memory into new sessions, and recalls complete history on demand with BM25.

No embeddings, vector database or cloud memory service. The npm package bundles no runtime dependencies; the host supplies DSH and Zod 4 peers. It fits personal and local development workflows, rather than raw chat backups or multi-user cloud sync.
```

**依据 2 · 源码核查**：[src/host/index.ts:304-317](https://github.com/Qinling-Melon-Farmers/dsh-memoir/blob/1f513bbabdb3f2b10be8ee6ec53eb38d82d6e16d/src/host/index.ts#L304-L317)

实际注册记录、更新和读取。

<details>
<summary>查看原文（14行）</summary>

```text
    const register = (): void => {
      for (const dispose of disposers) dispose()
      const languageSource = () => liveSettings.get().settings.language
      const tools = [
        memoirRecordTool(store, retrieval, languageSource, memoryHooks),
        memoirUpdateTool(store, languageSource, memoryHooks),
        memoirReadTool(store, () => {
        const current = liveSettings.get().settings
        return { defaultLimit: current.readDefaultLimit, maxLimit: current.readMaxLimit }
        }, retrieval, languageSource),
      ]
      disposers = tools.map((tool) => ctx.tools.register(tool))
    }
    register()
```

</details>

**依据 3 · 源码核查**：[src/host/index.ts:184-201](https://github.com/Qinling-Melon-Farmers/dsh-memoir/blob/1f513bbabdb3f2b10be8ee6ec53eb38d82d6e16d/src/host/index.ts#L184-L201)

按项目选热记忆并按会话管理快照。

<details>
<summary>查看原文（18行）</summary>

```text
  const guidance = memoirGuidance(language)
  const heading = memoirSectionHeading(language)
  const cwd = context?.agent?.session?.header?.cwd
  if (typeof cwd !== 'string' || cwd === '') return guidance
  const build = (): { storeRevision: number; text: string } => {
    const entries = store.entries(cwd)
    const hot = selectHotMemory(entries, budget, Date.now(), language)
    if (hot.selected.length === 0) {
      return { storeRevision: store.currentRevision(), text: guidance }
    }
    return {
      storeRevision: store.currentRevision(),
      text: guidance + '\n\n' + heading + '\n' + hot.text,
    }
  }
  const key = sessionKeyOf(context)
  if (key === undefined || manager === undefined) return build().text
  return manager.getOrCreate(key, build).text
```

</details>

#### 缺口

- 未测跨会话任务准确率
  **影响**：不能确认自动记忆比人工摘要更可靠
  **进一步探讨**：用同一约定做跨会话恢复对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 记录、检索与会话项目如何绑定？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

热记忆由会话头 cwd 查询本地记录，再按预算筛选；可取会话键时使用已有快照。项目键以路径为基础，Windows 盘符和分隔符做归一，POSIX 保留大小写，不能把路径键解释为账号权限。另一路按需搜索把索引版本、cwd、状态、标准化查询和时间桶纳入缓存键，使同查询不同输出限制可复用排名。工具和提示选择应分别验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/store.ts:279-289](https://github.com/Qinling-Melon-Farmers/dsh-memoir/blob/1f513bbabdb3f2b10be8ee6ec53eb38d82d6e16d/src/host/store.ts#L279-L289)

项目路径键及展示名。

<details>
<summary>查看原文（11行）</summary>

```text
export function projectKey(cwd: string): string {
  const raw = String(cwd).replace(/[\\/]+$/, '')
  const drive = /^([A-Za-z]):/.exec(raw)
  if (drive === null) return raw
  return (drive[1] + ':' + raw.slice(2)).toLowerCase().replace(/\\/g, '/')
}

/** Project display title: the last path segment. */
export function projectTitle(cwd: string): string {
  return projectKey(cwd).split('/').filter(Boolean).pop() || projectKey(cwd)
}
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:184-201](https://github.com/Qinling-Melon-Farmers/dsh-memoir/blob/1f513bbabdb3f2b10be8ee6ec53eb38d82d6e16d/src/host/index.ts#L184-L201)

热记忆和会话快照。

<details>
<summary>查看原文（18行）</summary>

```text
  const guidance = memoirGuidance(language)
  const heading = memoirSectionHeading(language)
  const cwd = context?.agent?.session?.header?.cwd
  if (typeof cwd !== 'string' || cwd === '') return guidance
  const build = (): { storeRevision: number; text: string } => {
    const entries = store.entries(cwd)
    const hot = selectHotMemory(entries, budget, Date.now(), language)
    if (hot.selected.length === 0) {
      return { storeRevision: store.currentRevision(), text: guidance }
    }
    return {
      storeRevision: store.currentRevision(),
      text: guidance + '\n\n' + heading + '\n' + hot.text,
    }
  }
  const key = sessionKeyOf(context)
  if (key === undefined || manager === undefined) return build().text
  return manager.getOrCreate(key, build).text
```

</details>

**依据 3 · 源码核查**：[src/host/retrieval.ts:409-428](https://github.com/Qinling-Melon-Farmers/dsh-memoir/blob/1f513bbabdb3f2b10be8ee6ec53eb38d82d6e16d/src/host/retrieval.ts#L409-L428)

排名缓存维度及调用。

<details>
<summary>查看原文（20行）</summary>

```text
  cachedSearch(
    query: string,
    options: { section?: SectionKey; cwd?: string; now?: number; limit?: number; detail?: string; status?: MemoirStatus | 'all' } = {},
  ): RankedEntry[] {
    const now = options.now ?? Date.now()
    const timeBucket = Math.floor(now / QUERY_CACHE_TIME_BUCKET_MS)
    const epoch = this.ensureIndex().epoch
    const key = [
      String(epoch),
      options.cwd ?? '',
      options.section ?? '',
      options.status ?? 'active',
      query.toLowerCase().replace(/\s+/g, ' ').trim(),
      String(timeBucket),
    ].join('|')
    const hit = this.queryCache.get(key)
    if (hit !== undefined) return hit
    const result = this.search(query, options)
    this.queryCache.set(key, result)
    return result
```

</details>

**依据 4 · 源码核查**：[src/host/index.ts:388-393](https://github.com/Qinling-Melon-Farmers/dsh-memoir/blob/1f513bbabdb3f2b10be8ee6ec53eb38d82d6e16d/src/host/index.ts#L388-L393)

Web 写入候选路径来自已见工作区或既有项目。

```text
    const allowedWorkspace = (path: string): boolean =>
      recentWorkspaces.has(projectKey(path)) || store.project(path) !== undefined
    const disposers = makeRoutes(store, diagnostics, retrieval, hotMemoryPreview, allowedWorkspace, undefined, liveSettings).map((route) => ctx.webServer.register(route))
    return () => {
      for (const dispose of disposers) dispose()
    }
```

#### 缺口

- 未验证多个路径别名、工作树和持久快照重启恢复
  **影响**：不能保证路径别名合并或结果始终一致
  **进一步探讨**：用两个测试工作区分别查热记忆、主动搜索和重启后结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 记忆注入与自动蒸馏会有哪些副作用？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

系统提示节按预算读取记忆，announceToAgent 关闭时不注入，记忆文本以不插值的方式提交。自动蒸馏监听回合结束，检查开关、子代理、取消、活动、保存与冷却条件后排入后续模型回合。排入提醒不是持久化凭证，源码单独记录实际保存，并将无法证明的冷启结果保留为未知。存储在本地不意味着提示内容不会交给所选模型。Web 写入还检查绝对路径和项目候选，但这不构成通用多租户 ACL。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:428-446](https://github.com/Qinling-Melon-Farmers/dsh-memoir/blob/1f513bbabdb3f2b10be8ee6ec53eb38d82d6e16d/src/host/index.ts#L428-L446)

系统提示、不开启时返回空与预算。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.effect(() => ctx.systemPrompt.section({
    name: 'plugin:dsh-memoir',
    order: SECTION_ORDER,
    // Memory is literal data, including {{cwd}} and legacy frozen snapshots.
    // The public SDK flag preserves text, hashes and budgets without rewriting.
    interpolate: false,
    // Always observe the trusted assembly cwd for Web write authorization.
    // When announcement is disabled, the provider returns no prompt content.
    // Hot-memory budgets are read live for each new session snapshot.
    text: (context) => {
      const cwd = context?.agent?.session?.header?.cwd
      if (typeof cwd === 'string' && cwd !== '') touchWorkspace(cwd)
      const current = liveSettings.get().settings
      if (!current.announceToAgent) return ''
      return memoirSectionText(store, context, snapshotManager, {
        targetTokens: current.hotMemoryTokens,
        hardMaxTokens: current.hotMemoryMaxTokens,
      }, current.language)
    },
```

</details>

**依据 2 · 源码核查**：[src/host/autodistill.ts:212-247](https://github.com/Qinling-Melon-Farmers/dsh-memoir/blob/1f513bbabdb3f2b10be8ee6ec53eb38d82d6e16d/src/host/autodistill.ts#L212-L247)

条件成立才调用 followup，并记录 queued。

<details>
<summary>查看原文（36行）</summary>

```text
  const dispose = wire.on('agent/turn-stopping', (payload) => {
    const { agent, turn, signal } = payload
    const now = options.now?.() ?? Date.now()
    const report = (outcome: DistillOutcome, tools = 0) => options.diagnostics?.record(outcome, now, turn, tools, gate.size)
    if (!options.enabled()) { report('disabled'); return }
    if (isSubagentSession(agent)) { report('subagent'); return }
    if (signal.aborted) { report('aborted'); return }
    const activity = options.activity?.(agent)
    if (activity === undefined) { report('unavailable'); return }
    if (activity.turn > turn) { report('duplicate'); return }
    if (activity.turn === turn && activity.distilling) { report('distillation', activity.toolCalls); return }
    const { recorded, toolCalls, reminded } = activity.turn === turn ? activity : { recorded: false, toolCalls: 0, reminded: false }
    if (toolCalls === 0 || recorded) { report(recorded ? 'recorded' : 'idle', toolCalls); return }
    if (reminded) { report('duplicate', toolCalls); return }
    const live = options.policy?.()
    const policy: AutoDistillPolicy = {
      every: integerAtLeast(live?.every ?? options.every, 1, 1),
      cooldownMs: numberAtLeast(live?.cooldownMin ?? options.cooldownMin, 0, 0) * 60_000,
      minTools: integerAtLeast(live?.minTools ?? options.minTools, 1, 1),
    }
    if (!gate.consume(agent.id, turn, toolCalls, policy, now)) {
      report(gate.reason === 'ready' ? 'duplicate' : gate.reason, toolCalls)
      return
    }
    try { agent.followup(
      createUserMessage({
        content: [{ type: 'text', text: distillPrompt(options.language?.(), turn) }],
        source: { kind: AUTO_DISTILL_PLUGIN, originTurn: turn },
      }),
    ) } catch (error) {
      report('failed', toolCalls)
      throw error
    }
    gate.recordReminder(agent.id, now)
    report('queued', toolCalls)
  })
```

</details>

**依据 3 · 源码核查**：[src/host/index.ts:223-246](https://github.com/Qinling-Melon-Farmers/dsh-memoir/blob/1f513bbabdb3f2b10be8ee6ec53eb38d82d6e16d/src/host/index.ts#L223-L246)

记录持久提交，无法回读结果保持未知。

<details>
<summary>查看原文（24行）</summary>

```text
  // Live commit truth also covers nested PTC writes and a JSON commit followed
  // by Markdown failure. No foreign event is appended to the host's log.
  // Only successful direct results have durable metadata; after a cold restart
  // an outcome without that metadata is unknown, never inferred from a call.
  const committedTurns = new WeakMap<Session, number>()
  const activityOf = (session: Session) => {
    const state = activity.stateOf(session)
    return state !== undefined && committedTurns.get(session) === state.turn ? { ...state, recorded: true } : state
  }
  const memoryHooks: MemoryToolHooks = {
    activity: (exec) => exec.agent === undefined ? undefined : activityOf(exec.agent.session),
    written: (exec) => {
      distillDiagnostics.write('persisted')
      // A store commit must never be turned into a retryable tool failure if
      // diagnostics/live commit tracking subsequently fails.
      try {
        const state = memoryHooks.activity(exec)
        if (state?.reminded) distillDiagnostics.write('afterReminder')
        // The entry links to the originating work, but its receipt belongs to
        // the executing wrap-up turn so live activity counts this save.
        const turn = resolveMemorySource(exec, memoryHooks)?.turnId === undefined ? undefined : state?.turn
        if (turn === undefined || exec.agent === undefined) { distillDiagnostics.write('receiptFailed'); return }
        committedTurns.set(exec.agent.session, turn)
      } catch { distillDiagnostics.write('receiptFailed') }
```

</details>

**依据 4 · 源码核查**：[src/host/routes.ts:347-358](https://github.com/Qinling-Melon-Farmers/dsh-memoir/blob/1f513bbabdb3f2b10be8ee6ec53eb38d82d6e16d/src/host/routes.ts#L347-L358)

Web 写入路径的授权约束。

<details>
<summary>查看原文（12行）</summary>

```text
    const path = strField(payload, 'path')
    if (path === null || !validPath(path)) {
      json(res, FAIL({ code: 'bad-request', message: copy.absolutePath }), 400)
      return
    }
    // v0.4.2 workspace authorization: a browser-submitted absolute path is
    // not authorization — writes are limited to the active workspace(s) or
    // projects already in the store.
    if (allowedWorkspace !== undefined && !allowedWorkspace(path)) {
      json(res, FAIL({ code: 'forbidden', message: copy.forbiddenPath }), 403)
      return
    }
```

</details>

#### 缺口

- 未测实际模型追加开销、敏感数据传播与重启恢复
  **影响**：无法量化预算收益或证明隔离性
  **进一步探讨**：先关闭蒸馏，用无敏感数据确认注入和持久化，再单独验收开关

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样比较跨会话恢复的成本和收益？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

在独立 profile 和可丢弃仓库保存一条无敏感的测试约定，关闭蒸馏，仅允许预期的手工写入和热记忆。新会话检查能否正确恢复，并从记录核对来源。与直接提供同一份项目摘要比较，记录整理、每轮输入、写入核对和清理成本。假设是项目历史多时自动挑选能减少重复交接；若选错事实、增加回合或无法隔离项目，停用注入和蒸馏，并恢复人工文档。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:304-317](https://github.com/Qinling-Melon-Farmers/dsh-memoir/blob/1f513bbabdb3f2b10be8ee6ec53eb38d82d6e16d/src/host/index.ts#L304-L317)

人工记录和读取入口。

<details>
<summary>查看原文（14行）</summary>

```text
    const register = (): void => {
      for (const dispose of disposers) dispose()
      const languageSource = () => liveSettings.get().settings.language
      const tools = [
        memoirRecordTool(store, retrieval, languageSource, memoryHooks),
        memoirUpdateTool(store, languageSource, memoryHooks),
        memoirReadTool(store, () => {
        const current = liveSettings.get().settings
        return { defaultLimit: current.readDefaultLimit, maxLimit: current.readMaxLimit }
        }, retrieval, languageSource),
      ]
      disposers = tools.map((tool) => ctx.tools.register(tool))
    }
    register()
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:428-446](https://github.com/Qinling-Melon-Farmers/dsh-memoir/blob/1f513bbabdb3f2b10be8ee6ec53eb38d82d6e16d/src/host/index.ts#L428-L446)

可关闭自动注入。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.effect(() => ctx.systemPrompt.section({
    name: 'plugin:dsh-memoir',
    order: SECTION_ORDER,
    // Memory is literal data, including {{cwd}} and legacy frozen snapshots.
    // The public SDK flag preserves text, hashes and budgets without rewriting.
    interpolate: false,
    // Always observe the trusted assembly cwd for Web write authorization.
    // When announcement is disabled, the provider returns no prompt content.
    // Hot-memory budgets are read live for each new session snapshot.
    text: (context) => {
      const cwd = context?.agent?.session?.header?.cwd
      if (typeof cwd === 'string' && cwd !== '') touchWorkspace(cwd)
      const current = liveSettings.get().settings
      if (!current.announceToAgent) return ''
      return memoirSectionText(store, context, snapshotManager, {
        targetTokens: current.hotMemoryTokens,
        hardMaxTokens: current.hotMemoryMaxTokens,
      }, current.language)
    },
```

</details>

**依据 3 · 作者声明**：[README.en.md:95-108](https://github.com/Qinling-Melon-Farmers/dsh-memoir/blob/1f513bbabdb3f2b10be8ee6ec53eb38d82d6e16d/README.en.md#L95-L108)

作者说明预算和检索区别。

<details>
<summary>查看原文（14行）</summary>

```text
`language` supports `zh` / `en` / `de` / `ru`, controlling tool descriptions, parameter help, distillation prompts, tool results, validation errors and Hot Memory / Markdown headings. Tool names, parameter keys and enums stay unchanged. It is independent of the Chinese/English GUI, does not infer language or translate existing memories, and affects subsequent prompts immediately without restarting. Switching alone does not rewrite JSON/Markdown; later writes use the selected language for projection headings.

### Hot Memory and session snapshots

- **Bounded injection:** complete history stays local. Only budgeted actions, lessons and recent state enter the system prompt automatically; the whole Markdown file is never injected.
- **Frozen prefixes:** new writes are immediately visible to tools and the GUI, while automatic injection refreshes in the next new session. Budget changes do not rewrite existing snapshots. Languages have separate namespaces, switching back reuses the old baseline, and forks/new session ids do not inherit parent snapshots.
- **Hard budget handling:** skip candidates exceeding the remaining budget in favor of smaller entries. Shorten an oversized first entry's content and, if needed, title against the complete rendered block. Skip it if even the minimum block cannot fit; long titles cannot bypass the hard ceiling.
- **Literal text and cache limits:** emit `{{...}}` and other template literals verbatim for new memories, cached old snapshots and restored disk snapshots, without deleting snapshots or rewriting original memories. Frozen prefixes can help caching but do not guarantee provider KV-cache retention, hit rates or billing savings.

### Local recall and caching

- **Tokenization:** Chinese 2/3-grams, Unicode letters/combining marks/numbers and code/path identifiers. NFC normalization preserves original content, German umlauts and Russian Cyrillic.
- **BM25 ranking:** retain true term frequency, boost title BM25 scores by **2.5×**, and apply exact-phrase, section and recency weights. Title and body lengths are normalized independently.
- **Shared retrieval:** the GUI and `memoir_read` share the BM25 engine. With a query, the tool takes a global Top-K for `scope=global`. For `scope=all`, it shows the current project first, then merges global results with ID deduplication; the whole call is not guaranteed to be a single global Top-K. Without a query it takes recent entries per project; see Configuration for `limit` boundaries.
```

</details>

#### 缺口

- 未测实际 token、纠错及清理成本
  **影响**：无法确认长期采用价值
  **进一步探讨**：同一模型以固定约定对照恢复正确性和总耗时

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
