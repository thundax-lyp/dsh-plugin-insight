# Custom Plugin

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3e2d72a](https://github.com/AlexPeng07/dsh-custom-plugin/tree/3e2d72aeafdc46700907c1076eb73b9d21cee5a5)

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AlexPeng07/dsh-custom-plugin) [![npm 30d 2,822](https://img.shields.io/static/v1?label=npm+30d&message=2%2C822&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@alexpeng/dsh-custom-plugin) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@alexpeng/dsh-custom-plugin)
<!-- END META -->

> **功能**：为 DSH Web 提供外观、会话管理、用量与本地备份等便利功能。

> **亮点**：[Q01](#research-q01) 将多种入口接入同一 Host 与 Client，并在 [Q02](#research-q02) 为状态提供预览及恢复副本；这是组合和接线增量，不证明原创底层能力。

> **主要限制**：[Q02](#research-q02) 的读合并写不是跨 Host 事务，[Q03](#research-q03) 的密钥在系统凭据写入失败时可能落入状态，且本地估算不能替代账单。 [Q02](#research-q02) 的只读分支可能仍向写入调用方报告成功，不能以成功响应证明持久化。

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
  - [Q01 · 谁适合集中使用这个套件，它比原有办法新增什么？](#detail-section-11)
  - [Q02 · 状态保存与备份怎样工作，能否防止所有并发覆盖？](#detail-section-12)
  - [Q03 · 回环访问、密钥和费用估算的保护边界是什么？](#detail-section-13)
  - [Q04 · 试用需要哪些前提、代价与退路？](#detail-section-14)
  - [Q05 · 如何验证冲突提示是否比现有合并更可靠？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH Web 用户集中使用会话整理、外观和用量入口，具体流程见 [Q01](#research-q01)。

已有宿主界面及单功能扩展可分别完成部分工作；本次没有同任务实测，不推断节时。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话整理入口 | 文件夹、引用和提示词操作 | 需要对应 Client 插槽；渲染未实测 |
| 会话搜索及导出 | 查询或输出指定会话 | 依赖 Host 会话查询；效果未测 |
| 本地用量与余额 | 查看估算和远端余额 | 估算不等于账单；余额需要可用 Key 和网络 |
| 状态备份与恢复 | 预览、合并或替换配置投影 | 备份不包括 Key；跨 Host 并发不保证 |
| 状态工具 | 查看配置、今日用量和诊断 | 依赖 Host 工具注册 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node 与兼容 DSH 服务 | 加载必需 | Host 路由、会话及 Client 注入 | 版本声明不保证具体宿主兼容 |
| slots | 界面必需 | 注册面板入口 | 界面跳过并报告诊断 |
| 可写状态目录 | 保存必需 | 设置与用量持久化 | 启动无法保护原文件时只读 |
| 系统凭据与 API Key | 余额可选 | 保存密钥和查询余额 | 凭据写失败可能回落状态；无 Key 无余额 |
| Mermaid 包或网络回退 | 图表条件 | 图表引擎 | 无可用引擎时不能渲染 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对宿主版本，备份已有数据 | 备份能读取；Key 需另行管理 |
| 加载 | 用户在隔离配置加载插件 | 检查所需面板及诊断，缺失则停止 |
| 使用 | 用户试做会话整理或用量查看 | 结果与宿主记录核对 |
| 恢复 | 用户先预览导入并核对恢复副本 | 冲突时停止写入，回到宿主工具 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 运行资源与费用未知 | 核对版本及备份 | 实际兼容未知 |
| 持续使用 | 查询和存储资源未知 | 核对用量及变更 | 未测节时 |
| 失败恢复 | 备份和排障资源未知 | 检查冲突及密钥落点 | 跨 Host 未测试 |
| 退出 | 数据残留及资源未知 | 导出所需内容并核查残留 | 禁用不保证删除历史文件 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中入口 | 注册多处 Client 插槽 | 实际节时与兼容 |
| 备份保护 | 投影、预览和恢复副本源码 | 故障下完整恢复 |
| 费用线索 | 内置价格估算 | 与实际账单一致性 |

> **思考**：[Q02](#research-q02) 的读合并写不是跨 Host 事务，[Q03](#research-q03) 的密钥在系统凭据写入失败时可能落入状态，且本地估算不能替代账单。 [Q02](#research-q02) 的只读分支可能仍向写入调用方报告成功，不能以成功响应证明持久化。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将多种入口接入同一 Host 与 Client，并在 [Q02](#research-q02) 为状态提供预览及恢复副本；这是组合和接线增量，不证明原创底层能力。

[Q02](#research-q02) 启动保护不可保存原件时禁止持久化，且进程内队列和恢复副本减少部分失误；跨进程原子性仍需单独确认。 在无法隔离原状态文件的只读分支，保存回调仍返回已完成 Promise，响应与持久化结果可能分离，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的读合并写不是跨 Host 事务，[Q03](#research-q03) 的密钥在系统凭据写入失败时可能落入状态，且本地估算不能替代账单。 [Q02](#research-q02) 的只读分支可能仍向写入调用方报告成功，不能以成功响应证明持久化。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q02](#research-q02) 只读分支可能返回成功而未持久化；在此条件得到验证前建议观察。若隔离环境中重启后状态丢失、面板缺失或密钥落点不符，停止写入并回到宿主工具。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

代码支持双端接线、备份及进程内保存机制；实际兼容与并发结果未测。冲突提示是假设，不是现有能力。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/client/index.ts、src/client/custom.tsx、src/routes.ts、src/host-service.ts、src/state.ts、src/backup.ts、src/loopback.ts、src/pricing.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅抽查声明、Host 和 Client 接线、状态与恢复、密钥、围栏及估算代表路径；未审完全部 UI 或所有外部行为。
- 下一步：在隔离环境复现状态文件不可读且无法隔离时的写入响应和重启结果，并检查槽位渲染、双 Host 并发、合成 Key 回退与账单对照；本次未运行目标代码、测试或宿主。

**分析版本**

- **仓库**：[AlexPeng07/dsh-custom-plugin](https://github.com/AlexPeng07/dsh-custom-plugin)
- **版本号**：0.9.3（[固定提交 3e2d72a](https://github.com/AlexPeng07/dsh-custom-plugin/tree/3e2d72aeafdc46700907c1076eb73b9d21cee5a5)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设原子版本比较和显式冲突提示可减少静默覆盖；须以受控双 Host 对照检验，尚未实现或验证。

在隔离环境复现状态文件不可读且无法隔离时的写入响应和重启结果，并检查槽位渲染、双 Host 并发、合成 Key 回退与账单对照；本次未运行目标代码、测试或宿主。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1808 | — | — | 27819 |
| .mjs | source | 7 | 1410 | 1092 | 227 | — |
| .ts | source | 26 | 4962 | 3830 | 839 | — |
| .tsx | source | 1 | 3068 | 2740 | 283 | — |
| .ts | test | 27 | 3518 | 2907 | 321 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/AlexPeng07/dsh-custom-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/AlexPeng07/dsh-custom-plugin/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AlexPeng07/dsh-custom-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本的整合价值、共享状态及密钥边界，明确适用与退出条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁适合集中使用这个套件，它比原有办法新增什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

使用 DSH Web 且经常需要整理会话、调整外观、查看用量的人，可在同一个扩展中访问这些入口。包清单提供 Host 和 Client 双入口，Host 注册状态、搜索及导出等路由，Client 向侧栏、对话和设置等位置请求注入；这使原本可能分别切换的面板集中到一个包。相比只用宿主现有界面或分别装单功能扩展，这是一种整合而非新会话引擎。单独只需一项功能的人仍可能更适合保留现有工具；尚无任务对照证明节约时间或需求频率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-18](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/README.md#L16-L18)

作者描述目标功能及双端结构。

```text
Custom convenience suite for the DeepSeek Harness (DSH) Web GUI: personalization, weather FX, glass effects, project folders, enhanced prompts, conversation export/search, Mermaid rendering, quote reply, 7/30/90-day usage analytics, budget and key-free local backups, plus a Ctrl/Cmd+K command palette.

The plugin is dual-face: the host half (`src/`) owns the state document, registers the `/api/custom-plugin` routes and the `custom_plugin_status` agent tool; the browser half (`src/client/`) injects its UI through eight injections into seven official slots and talks to the host over same-origin fetch. Mounted through the official profile mechanism — no DSH source changes.
```

**依据 2 · 源码核查**：[package.json:7-34](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/package.json#L7-L34)

包导出 Host、Client 并声明注入目标。

<details>
<summary>查看原文（28行）</summary>

```text
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-chat",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ]
    }
```

</details>

**依据 3 · 源码核查**：[src/client/custom.tsx:3013-3026](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/client/custom.tsx#L3013-L3026)

源码请求八个入口并区分请求和实际注册。

<details>
<summary>查看原文（14行）</summary>

```text
  }
  injectOne('sidebar.footer.action', 'custom-plugin-folders', { id: 'custom-plugin-folders', order: -100, label: '项目' }, FolderSidebarButton)
  injectOne('shell.overlay', 'custom-plugin-overlay', { id: 'custom-plugin-overlay', order: 10, label: 'Custom 便利套件' }, OverlayRoot)
  injectOne('conversation.input.dock', 'custom-plugin-quote', { id: 'custom-plugin-quote', order: 30, label: '引用回复' }, QuoteDock)
  injectOne('conversation.chat.turnTail', 'custom-plugin-turn-tail', { id: 'custom-plugin-turn-tail', order: 10 }, TurnTailEntry)
  injectOne('settings.section', 'custom-plugin-appearance', { id: 'custom-plugin-appearance', order: 30, label: '个性化' }, SettingsPage)
  injectOne('conversation.session.header.actions', 'custom-plugin-panel-open', { id: 'custom-plugin-panel-open', order: 5, label: '个性化' }, HeaderPanelButton)
  injectOne('conversation.session.header.actions', 'custom-plugin-prompts', { id: 'custom-plugin-prompts', order: 6, label: '提示词' }, PromptQuickButton)
  injectOne('conversation.session.header.utilities', 'custom-plugin-balance', { id: 'custom-plugin-balance', order: -5, label: '额度' }, HeaderBalance)
  // Requests submitted, not surfaces proven: dsh defers the callback above until
  // the slot is declared, so nothing here knows yet whether the host accepted
  // any of them. Materialization reports itself, per slot, through the `ok` /
  // `register` lines this one follows.
  reportDiag(`client installed: ${injectedCount} injection requests / ${injectedKeys.size} slots`)
```

</details>

#### 缺口

- 未测真实用户的重复任务和节时
  **影响**：不能判断集中入口是否覆盖额外维护负担
  **进一步探讨**：对同一批任务比较原生流程、单功能扩展和本套件的完成与恢复成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 状态保存与备份怎样工作，能否防止所有并发覆盖？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 启动时载入共享状态，无法读取或隔离原文件时进入禁止持久化的只读分支；会话消息用量在加载完成前暂存，之后折叠。进程内的操作队列串行编辑、导入与保存，文件保存使用进程限定临时文件后 rename；检测到外部修改时，会将未触碰的区段和用量按基线合并。本机制减轻常见竞争，但并无跨进程锁或比较并交换：两个 Host 可能都在读完后再写，且同一有本地修改的区段保留本地值；检测到外部文件不可读或无法解析时合并函数直接返回，随后保存仍继续。导入可先预览，实际执行先写恢复备份，保存失败则回滚内存；这些源码分支不证明在目标文件系统上完整恢复。 另外只读状态下 saveNow 直接返回成功的空 Promise，而状态路由和导入路径继续在等待后返回成功；因此调用方可能看到操作成功但更改只在内存中，重启后未保留。此结论是源码条件分析，尚未复现。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:71-107](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/index.ts#L71-L107)

启动加载失败时只读并缓冲用量。

<details>
<summary>查看原文（37行）</summary>

```text
  const stateReady = loadStateFile(state).then(async (path) => {
    statePath = path
    if (await host.migrateLegacyApiKey()) reportDiag('legacy API key migrated to system credentials')
    stateLoaded = true
    for (const item of pendingUsage.splice(0)) host.foldUsage(item.sessionId, item.usage, item.time, item.model ?? undefined)
    try {
      await saveStateFile(state)
    } catch (error) {
      // The load itself succeeded; a failed normalization save (full disk,
      // read-only home) must not flip the host read-only — later saves retry.
      reportDiag(`state save failed: ${String((error as Error)?.message ?? error)}`)
    }
  }).catch((error) => {
    // The document could be neither read nor preserved aside. Keep the host
    // usable but read-only: events still fold in memory, while saves are
    // suppressed — persisting the never-loaded defaults would destroy the
    // very file the plugin could not read.
    reportDiag(`state file unreadable, running read-only: ${String((error as Error)?.message ?? error)}`)
    stateWritable = false
    stateLoaded = true
    for (const item of pendingUsage.splice(0)) host.foldUsage(item.sessionId, item.usage, item.time, item.model ?? undefined)
  })

  // Daily token usage: fold request/context (model) + assistant/message (usage).
  ctx.on('session/event', (session: Session, event: SessionEvent) => {
    try {
      if (event === undefined || event === null) return
      const sessionId = String(session.id)
      if (event.type === 'request/context') {
        const model = event.data.model ?? null
        sessionModels.set(sessionId, model)
        host.rememberModel(sessionId, model)
      } else if (event.type === 'assistant/message' && event.data.usage !== undefined) {
        if (!stateLoaded) pendingUsage.push({ sessionId, usage: event.data.usage, time: event.time, model: sessionModels.get(sessionId) ?? null })
        else {
          host.foldUsage(sessionId, event.data.usage, event.time)
          saveSoon()
```

</details>

**依据 2 · 源码核查**：[src/host-service.ts:168-199](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/host-service.ts#L168-L199)

单 Host 将状态操作及排队用量串行化。

<details>
<summary>查看原文（32行）</summary>

```text
  /** Persist after all queued state mutations have reached a stable point. */
  async persistWhenIdle(): Promise<void> {
    await this.runStateOperation(() => this.persist())
  }

  private runStateOperation<T>(operation: () => Promise<T>): Promise<T> {
    this.stateOperationPending++
    // Mark the gate synchronously, before the promise continuation runs. A
    // session event delivered in the same turn as an import/edit must not
    // slip into a stale snapshot between scheduling and execution.
    this.stateOperationActive = true
    const run = this.stateOperation.catch(() => {}).then(async () => {
      try {
        return await operation()
      } finally {
        // Keep the gate closed while persisting the queued events. This
        // avoids a tiny window in which a new event could bypass the flush.
        while (this.queuedUsage.length > 0) {
          const pending = this.queuedUsage.splice(0)
          for (const item of pending) this.foldUsageNow(item.usage, item.time, item.model)
          try {
            await this.persist()
          } catch (error) {
            this.pushDiag(`queued usage save failed: ${String((error as Error)?.message ?? error)}`)
          }
        }
        this.stateOperationPending--
        if (this.stateOperationPending === 0) this.stateOperationActive = false
      }
    })
    this.stateOperation = run.then(() => {}, () => {})
    return run
```

</details>

**依据 3 · 源码核查**：[src/state.ts:310-335](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/state.ts#L310-L335)

保存前合并、临时写入后重命名及进程内队列。

<details>
<summary>查看原文（26行）</summary>

```text
/** Atomically persist the state document. Saves to the same path are
 * serialized: a caller awaits its own turn's completion, a failed turn never
 * poisons the queue behind it. Before writing, another host's changes since
 * this process last loaded or saved the file are merged back in (see
 * `mergeExternalChanges`). */
export function saveStateFile(state: CustomPluginState, home: string = dshHome()): Promise<void> {
  const statePath = join(home, STATE_FILE)
  const turn = (saveQueues.get(statePath) ?? Promise.resolve())
    .catch(() => {})
    .then(async () => {
      await mergeExternalChanges(state, statePath)
      await mkdir(dirname(statePath), { recursive: true })
      const doc = JSON.stringify(state)
      const tmpPath = tempPathFor(statePath)
      try {
        await writeFile(tmpPath, doc, 'utf8')
        await rename(tmpPath, statePath)
      } catch (error) {
        // A pid-qualified temp would otherwise survive a failed turn and accumulate.
        await rm(tmpPath, { force: true }).catch(() => { /* the rename may have landed; nothing left to clean */ })
        throw error
      }
      // Record what this process just made the file look like, so the next
      // turn can tell its own writes from another host's.
      const st = await stat(statePath).catch(() => null)
      syncBaselines.set(statePath, st !== null ? { mtimeMs: st.mtimeMs, size: st.size, doc } : null)
```

</details>

**依据 4 · 源码核查**：[src/state.ts:351-405](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/state.ts#L351-L405)

外部变更检查、不可读回退与同区段取本地。

<details>
<summary>查看原文（55行）</summary>

```text
/**
 * Fold another host's writes back in before this process saves over them.
 *
 * Each host holds the whole document in memory, so an unchecked save is
 * last-writer-wins and silently discards the other host's usage folds and
 * config edits. When the file's stat identity no longer matches what this
 * process last wrote or loaded, the current bytes are re-read and three-way
 * merged against the last-saved snapshot: sections this process has not
 * touched adopt the external version, the usage ledger unions arithmetically
 * (`theirs + ours − base` per counter — exact for two hosts that both
 * started from `base`), and locally-dirty sections keep the local version.
 *
 * The stat fast path misses only a same-instant, same-length rewrite by
 * another host. An unreadable or undecodable external document falls back to
 * the plain overwrite — the boot-time quarantine remains the backstop for
 * the destructive case.
 */
async function mergeExternalChanges(state: CustomPluginState, statePath: string): Promise<void> {
  const baseline = syncBaselines.get(statePath)
  if (baseline === undefined) return
  const st = await stat(statePath).catch(() => null)
  if (st === null) return // absent (or vanishing mid-check): nothing to merge
  if (baseline !== null && st.mtimeMs === baseline.mtimeMs && st.size === baseline.size) return
  const text = await readFile(statePath, 'utf8').catch(() => null)
  if (text === null) return
  let theirs: unknown
  try {
    theirs = JSON.parse(text)
  } catch {
    return // an undecodable external document has nothing mergeable
  }
  if (theirs === null || typeof theirs !== 'object') return
  mergeThreeWay(state, baseline !== null ? safeParse(baseline.doc) : null, theirs as Record<string, unknown>)
}

function safeParse(text: string): CustomPluginState | null {
  try {
    return JSON.parse(text) as CustomPluginState
  } catch {
    return null
  }
}

function sameJson(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

function mergeThreeWay(state: CustomPluginState, base: CustomPluginState | null, theirs: Record<string, unknown>): void {
  const t = theirs as Partial<CustomPluginState>
  const b = (base ?? {}) as Partial<CustomPluginState>
  if (sameJson(state.cfg, b.cfg)) state.cfg = normalizeCfg(t.cfg)
  if (sameJson(state.folders, b.folders) && Array.isArray(t.folders)) state.folders = t.folders as FolderNode[]
  if (sameJson(state.prompts, b.prompts) && Array.isArray(t.prompts)) state.prompts = t.prompts.map(normalizePrompt).filter((item): item is PromptItem => item !== null)
  if (sameJson(state.stars, b.stars) && t.stars !== null && typeof t.stars === 'object' && !Array.isArray(t.stars)) state.stars = t.stars as StarsMap
  if (sameJson(state.apiKey, b.apiKey) && typeof t.apiKey === 'string') state.apiKey = t.apiKey
```

</details>

**依据 5 · 源码核查**：[src/host-service.ts:317-349](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/host-service.ts#L317-L349)

导入预览、恢复副本及写失败内存回滚。

<details>
<summary>查看原文（33行）</summary>

```text
  /** Validate/preview or atomically apply a portable backup. */
  async backupImport(raw: unknown, mode: BackupImportMode, dryRun: boolean): Promise<{ ok: true; preview: ReturnType<typeof backupPreview>; recoveryPath?: string } | { ok: false; error: string }> {
    return await this.runStateOperation(() => this.backupImportNow(raw, mode, dryRun))
  }

  private async backupImportNow(raw: unknown, mode: BackupImportMode, dryRun: boolean): Promise<{ ok: true; preview: ReturnType<typeof backupPreview>; recoveryPath?: string } | { ok: false; error: string }> {
    try {
      if (mode !== 'merge' && mode !== 'replace') return { ok: false, error: '导入模式无效' }
      const backup = parseBackup(raw)
      const preview = backupPreview(this.state, backup)
      if (dryRun) return { ok: true, preview }
      // Same shallow-rollback reasoning as applyEdit: importedState builds
      // fresh objects, so section references are enough to undo the commit.
      const previous = {
        cfg: this.state.cfg,
        folders: this.state.folders,
        prompts: this.state.prompts,
        stars: this.state.stars,
        usage: this.state.usage,
        apiKey: this.state.apiKey,
      }
      const recoveryPath = await writeRecoveryBackup(this.statePath(), previous)
      const next = importedState(previous, backup, mode)
      Object.assign(this.state, next)
      try {
        await this.persist()
      } catch (error) {
        Object.assign(this.state, previous)
        throw error
      }
      return { ok: true, preview, recoveryPath }
    } catch (error) {
      return { ok: false, error: String((error as Error)?.message ?? error) }
```

</details>

**依据 6 · 源码核查**：[src/index.ts:61-66](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/index.ts#L61-L66)

只读时保存回调直接返回成功的空 Promise。

```text
  const host = new CustomPluginHost({
    sessionQuery: ctx.sessionQuery,
    state,
    statePath: () => statePath,
    saveNow: () => (stateWritable ? saveStateFile(state) : Promise.resolve()),
    reportDiag,
```

**依据 7 · 源码核查**：[src/routes.ts:87-99](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/routes.ts#L87-L99)

状态编辑后等待保存并返回成功。

<details>
<summary>查看原文（13行）</summary>

```text
        const body = rawBody as Record<string, unknown>
        await host.applyEdit({
          cfg: body.cfg as never,
          folders: Array.isArray(body.folders) ? (body.folders as never) : undefined,
          prompts: Array.isArray(body.prompts) ? (body.prompts as never) : undefined,
          stars: body.stars as never,
          apiKey: typeof body.apiKey === 'string' ? body.apiKey : undefined,
        })
        await host.persistWhenIdle()
        json(res, 200, { ok: true, ...(await host.credentialStatus()) })
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        json(res, message === 'body-too-large' ? 413 : 400, { ok: false, error: message })
```

</details>

#### 缺口

- 跨进程交错写入及异常断电未实测
  **影响**：不能声称无丢更新或持久恢复保证
  **进一步探讨**：在隔离目录让两个 Host 同时修改相同及不同区段并注入读写失败，核对最终文件和恢复副本。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 回环访问、密钥和费用估算的保护边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

路由先检查连接来自回环地址、Host 为回环地址，拒绝 cross-site 标记，Origin 缺失或与 Host 匹配时通过；这允许本机无标记客户端访问，不能当作通用远端身份认证。Key 设置优先写系统凭据，写入失败时回落到状态中的明文；备份投影只包含配置、文件夹、提示词、星标和用量，不包含 apiKey，但这不意味着原状态文件一定无密钥。余额查询调用 DeepSeek 余额服务；本地费用使用内置模型单价，未知或旧模型按 Flash 回退，缺失峰谷拆分时 exact 为 false。它提供预算线索而非权威账单。

#### 证据与依据

**依据 1 · 源码核查**：[src/loopback.ts:41-66](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/loopback.ts#L41-L66)

回环、Host、站点标志和 Origin 的实际判断。

<details>
<summary>查看原文（26行）</summary>

```text
/**
 * Request-level trust fence, mirroring the platform fence's semantics: a
 * loopback socket address AND a loopback Host header, non-`cross-site` fetch
 * marker, and an Origin that is absent (trusted — the dsh Desktop forward
 * shape) or matches the Host authority. The socket address is authoritative;
 * X-Forwarded-For is never trusted.
 */
export function isLoopbackRequest(request: IncomingMessage): boolean {
  if (!isLoopbackAddress(request.socket.remoteAddress)) return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  if (!isLoopbackHostname(hostUrl.hostname)) return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
```

</details>

**依据 2 · 源码核查**：[src/host-service.ts:299-307](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/host-service.ts#L299-L307)

系统凭据失败后回退状态字段。

```text
    if (typeof edit.apiKey === 'string') {
      const key = edit.apiKey.trim()
      if (key === '') {
        const cleared = await this.credentialStore.clear()
        if (this.credentialStore.available && !cleared) throw new Error('系统凭据清除失败，请重试')
        this.state.apiKey = ''
      } else {
        if (!/^sk-/.test(key)) throw new Error('DeepSeek API Key 必须以 sk- 开头')
        this.state.apiKey = await this.credentialStore.set(key) ? '' : key
```

**依据 3 · 源码核查**：[src/backup.ts:83-109](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/backup.ts#L83-L109)

备份显式投影字段，不包含 apiKey。

<details>
<summary>查看原文（27行）</summary>

```text
export function createBackup(state: CustomPluginState): CustomPluginBackupV1 {
  const seen = new Set<string>()
  const folders = (Array.isArray(state.folders) ? state.folders : []).map((item) => folder(item, seen)).filter((item): item is FolderNode => item !== null)
  const prompts = (Array.isArray(state.prompts) ? state.prompts : []).map(normalizePrompt).filter((item): item is PromptItem => item !== null)
  const stars: StarsMap = {}
  if (state.stars !== null && typeof state.stars === 'object') {
    for (const [sessionId, entries] of Object.entries(state.stars)) {
      if (!safeKey(sessionId) || entries === null || typeof entries !== 'object' || Array.isArray(entries)) continue
      const clean: Record<string, boolean> = {}
      for (const [seq, value] of Object.entries(entries)) if (value === true && /^\d+$/.test(seq)) clean[seq] = true
      if (Object.keys(clean).length > 0) stars[sessionId] = clean
    }
  }
  const usage: UsageMap = {}
  if (state.usage !== null && typeof state.usage === 'object') {
    for (const [day, models] of Object.entries(state.usage)) {
      if (!validDayKey(day) || models === null || typeof models !== 'object' || Array.isArray(models)) continue
      const clean: Record<string, UsageRow> = {}
      for (const [model, rawRow] of Object.entries(models)) {
        if (!safeKey(model)) continue
        const row = usageRow(rawRow)
        if (model !== '' && row !== null) clean[model] = row
      }
      if (Object.keys(clean).length > 0) usage[day] = clean
    }
  }
  return clone({ format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: new Date().toISOString(), data: { cfg: normalizeCfg(state.cfg), folders, prompts, stars, usage } })
```

</details>

**依据 4 · 源码核查**：[src/host-service.ts:565-577](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/host-service.ts#L565-L577)

余额使用远端服务并处理失败。

<details>
<summary>查看原文（13行）</summary>

```text

  /** Query the DeepSeek balance endpoint (15s timeout). */
  async balanceGet(): Promise<{ ok: boolean; keyConfigured: boolean; balance?: BalanceInfo | null; error?: string | null; usageToday?: unknown; available?: boolean }> {
    const usageToday = this.state.usage[dayKey()] ?? {}
    const key = await this.resolveApiKey()
    if (key === '') return { ok: false, keyConfigured: false, error: '未配置 DeepSeek API Key（请在额度面板粘贴 sk- 开头的密钥）', usageToday }
    let response
    try {
      response = await this.httpJson('https://api.deepseek.com/user/balance', { Authorization: `Bearer ${key}`, Accept: 'application/json' })
    } catch (error) {
      return { ok: false, keyConfigured: true, error: String((error as Error)?.message ?? error), usageToday }
    }
    if (!response.ok) return { ok: false, keyConfigured: true, error: response.error ?? '请求失败', usageToday }
```

</details>

**依据 5 · 源码核查**：[src/pricing.ts:35-52](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/pricing.ts#L35-L52)

内置价格和未知模型回退。

<details>
<summary>查看原文（18行）</summary>

```text
const FLASH_PRICE: DeepSeekUnitPrice = { input: 2, cacheHit: 0.04, output: 8 }

/** Current official peak prices, in CNY per 1M tokens. Off-peak is exactly
 * half of peak per the official page (weekday 9-12 / 14-18 Beijing time). */
const PEAK_PRICES: Readonly<Record<string, DeepSeekUnitPrice>> = {
  'deepseek-flash': FLASH_PRICE,
  'deepseek-v4-flash': FLASH_PRICE,
  'deepseek-v4-flash-vision-exp': FLASH_PRICE,
  'deepseek-v4-pro': { input: 9, cacheHit: 0.3, output: 27 },
  // Retired names remain readable for older session logs; they no longer
  // appear on the official page and are approximated at Flash pricing.
  'deepseek-chat': FLASH_PRICE,
  'deepseek-reasoner': FLASH_PRICE,
}

/** Resolve a model's peak price, falling back to Flash for unknown/legacy rows. */
export function priceOf(model: string): DeepSeekUnitPrice {
  return PEAK_PRICES[model] ?? FLASH_PRICE
```

</details>

**依据 6 · 源码核查**：[src/pricing.ts:55-80](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/pricing.ts#L55-L80)

峰谷拆分未知的 exact 状态和估算。

<details>
<summary>查看原文（26行）</summary>

```text
/**
 * Split one row into peak/off-peak token volume and CNY cost. Rows without
 * peak counters retain the old all-off-peak numeric fallback for compatibility,
 * but `exact` is false until a rescan rebuilds the row with split counters.
 */
export function usageCostBreakdown(row: UsageRow, model: string): UsageCostBreakdown {
  const price = priceOf(model)
  const peakIn = row.peakIn ?? 0
  const peakCacheIn = row.peakCacheIn ?? 0
  const peakCacheW = row.peakCacheW ?? 0
  const peakOut = row.peakOut ?? 0
  const peakCost = peakIn * price.input
    + peakCacheIn * price.cacheHit
    + peakCacheW * price.input
    + peakOut * price.output
  const offPeakCost = (row.in - peakIn) * price.input
    + (row.cacheIn - peakCacheIn) * price.cacheHit
    + (row.cacheW - peakCacheW) * price.input
    + (row.out - peakOut) * price.output
  return {
    exact: hasKnownPeakSplit(row),
    peakTokens: peakIn + peakCacheIn + peakCacheW + peakOut,
    offPeakTokens: (row.in - peakIn) + (row.cacheIn - peakCacheIn) + (row.cacheW - peakCacheW) + (row.out - peakOut),
    peakCostCny: peakCost / 1e6,
    offPeakCostCny: offPeakCost / 2e6,
    totalCostCny: (peakCost + offPeakCost / 2) / 1e6,
```

</details>

#### 缺口

- 不同系统凭据服务及实际文件权限未核验
  **影响**：无法断定本机密钥最终落点或权限
  **进一步探讨**：在隔离环境用合成 Key 检查状态返回、文件权限及系统凭据故障回退。
- 实际计费与价格变化未核验
  **影响**：本地估算不能用于最终对账
  **进一步探讨**：与供应商账单及适用时点价目逐项比较。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 试用需要哪些前提、代价与退路？

**研究主题**：效果与总成本、采用判断

#### 完整回答

包声明 Node 22 以上、DSH 0.1.7-rc.2 以上和对应工具依赖；开放的下限是安装声明，不保证以后所有宿主接口兼容。客户端等待 slots，缺失或注册失败时记录诊断并降级；因此启动完成也不证明所需面板已出现。初次需要核对版本并先导出设置备份；持续成本包括维护多个 UI 注入、检查用量与账单差异，以及共享状态冲突排查。导入支持预览及恢复副本，但 Key 不在导出中。若面板缺失、存储落点不符合要求或两个 Host 出现冲突，停止写入并使用备份核对后回到宿主现有功能。费用、操作时长、卸载后的残留和具体版本兼容均未实际测量。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:21-34](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/package.json#L21-L34)

客户端声明五个宿主注入目标。

<details>
<summary>查看原文（14行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-chat",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ]
    }
```

</details>

**依据 2 · 源码核查**：[package.json:46-70](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/package.json#L46-L70)

运行版本下限、peer 及 Mermaid 依赖声明。

<details>
<summary>查看原文（25行）</summary>

```text
  "engines": {
    "node": ">=22",
    "dsh": ">=0.1.7-rc.2"
  },
  "packageManager": "pnpm@11.28.5",
  "scripts": {
    "build": "tsc -p tsconfig.build.json && tsdown",
    "bundle": "tsdown",
    "watch": "tsdown --watch",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "check:readme": "node scripts/check-readme-i18n.mjs",
    "smoke": "node scripts/smoke.mjs",
    "canary": "node scripts/compat-canary.mjs",
    "bench:mermaid": "node scripts/mermaid-scan-bench.mjs",
    "prepare": "npm run build",
    "prepublishOnly": "tsc --noEmit && vitest run"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-tools": ">=0.1.7-rc.2"
  },
  "dependencies": {
    "mermaid": "^11.6.0"
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:25-48](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/client/index.ts#L25-L48)

等待 slots 并在安装失败时报告、降级。

<details>
<summary>查看原文（24行）</summary>

```text
export const inject = []

/**
 * Mount the Custom suite once the slots service is available.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => {
    // The slots provider (client-ui-layout) may activate after this entry on
    // newer dsh builds — a synchronous `ctx.get('slots')` here would lose
    // that race and silently skip every surface. `ctx.inject` re-runs the
    // mount whenever the service (re)appears, while staying fail-soft: if the
    // service never shows up, the GUI boots without this plugin's surfaces.
    ctx.inject(['slots'], (slotCtx) => {
      try {
        return installCustomPlugin(slotCtx, apiDiagReport)
      } catch (error) {
        // Fail soft: a broken plugin must degrade to a diagnostic line, never
        // fail its fiber (which would take the entire GUI boot down with it).
        const message = `install failed: ${String((error as Error)?.message ?? error)}`
        console.error(`[custom-plugin] ${message}`)
        apiDiagReport(message)
        return () => {}
      }
```

</details>

**依据 4 · 源码核查**：[src/routes.ts:121-161](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/routes.ts#L121-L161)

备份 GET、导入模式与预览参数。

<details>
<summary>查看原文（41行）</summary>

```text
  const backupRoute: WebRoute = {
    kind: 'exact',
    path: `${CUSTOM_PLUGIN_API_PREFIX}/backup`,
    handler: async (req, res): Promise<void> => {
      if (!guard(req, res)) return
      await ready
      if (req.method === 'GET') {
        json(res, 200, { ok: true, data: host.backupExport() })
        return
      }
      if (!isMethod(req, 'POST', res)) return
      try {
        const rawBody = await readBody(req, BACKUP_REQUEST_LIMIT)
        if (rawBody === null || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
          json(res, 400, { ok: false, error: '备份请求结构无效' })
          return
        }
        const body = rawBody as Record<string, unknown>
        if (body.mode !== 'merge' && body.mode !== 'replace') {
          json(res, 400, { ok: false, error: '导入模式无效' })
          return
        }
        if (!Object.prototype.hasOwnProperty.call(body, 'document')) {
          json(res, 400, { ok: false, error: '备份文档缺失' })
          return
        }
        if (body.dryRun !== undefined && typeof body.dryRun !== 'boolean') {
          json(res, 400, { ok: false, error: 'dryRun 字段无效' })
          return
        }
        const encodedDocument = JSON.stringify(body.document)
        if (encodedDocument === undefined) {
          json(res, 400, { ok: false, error: '备份文档无效' })
          return
        }
        if (Buffer.byteLength(encodedDocument, 'utf8') > BACKUP_BODY_LIMIT) {
          json(res, 413, { ok: false, error: '备份文档不能超过 5 MB' })
          return
        }
        const result = await host.backupImport(body.document, body.mode, body.dryRun === true)
        json(res, result.ok ? 200 : 400, result)
```

</details>

#### 缺口

- 未进行真实安装和禁用后残留检查
  **影响**：不能确定当前环境的可用性和完整退出成本
  **进一步探讨**：先在隔离 profile 进行备份、加载、功能、禁用与状态残留核验。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证冲突提示是否比现有合并更可靠？

**研究主题**：新假设与验证

#### 完整回答

未验证假设：在保存前对读取到的版本增加跨进程原子比较和冲突拒绝，并将同时修改同一区段展示给用户选择，可能比现有本地优先策略更容易发现覆盖。它需要同一文件版本原子检查与写入的实际机制，单独比较时间戳后再 rename 仍存在竞争。最小比较是在隔离目录同时编辑同一配置或文件夹，分别记录现有合并与候选方案最终内容、冲突呈现和人工恢复工作量。如果候选仍静默丢改、经常拒绝无冲突写入且用户成本超过收益，这个假设就不成立。当前代码的三方合并不等于该设计已存在。

#### 证据与依据

**依据 1 · 源码核查**：[src/state.ts:351-383](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/state.ts#L351-L383)

现有变更检测在写前执行且不可读时返回。

<details>
<summary>查看原文（33行）</summary>

```text
/**
 * Fold another host's writes back in before this process saves over them.
 *
 * Each host holds the whole document in memory, so an unchecked save is
 * last-writer-wins and silently discards the other host's usage folds and
 * config edits. When the file's stat identity no longer matches what this
 * process last wrote or loaded, the current bytes are re-read and three-way
 * merged against the last-saved snapshot: sections this process has not
 * touched adopt the external version, the usage ledger unions arithmetically
 * (`theirs + ours − base` per counter — exact for two hosts that both
 * started from `base`), and locally-dirty sections keep the local version.
 *
 * The stat fast path misses only a same-instant, same-length rewrite by
 * another host. An unreadable or undecodable external document falls back to
 * the plain overwrite — the boot-time quarantine remains the backstop for
 * the destructive case.
 */
async function mergeExternalChanges(state: CustomPluginState, statePath: string): Promise<void> {
  const baseline = syncBaselines.get(statePath)
  if (baseline === undefined) return
  const st = await stat(statePath).catch(() => null)
  if (st === null) return // absent (or vanishing mid-check): nothing to merge
  if (baseline !== null && st.mtimeMs === baseline.mtimeMs && st.size === baseline.size) return
  const text = await readFile(statePath, 'utf8').catch(() => null)
  if (text === null) return
  let theirs: unknown
  try {
    theirs = JSON.parse(text)
  } catch {
    return // an undecodable external document has nothing mergeable
  }
  if (theirs === null || typeof theirs !== 'object') return
  mergeThreeWay(state, baseline !== null ? safeParse(baseline.doc) : null, theirs as Record<string, unknown>)
```

</details>

**依据 2 · 源码核查**：[src/state.ts:398-406](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/state.ts#L398-L406)

同一区段本地变更时保留本地，未见冲突交互。

```text
function mergeThreeWay(state: CustomPluginState, base: CustomPluginState | null, theirs: Record<string, unknown>): void {
  const t = theirs as Partial<CustomPluginState>
  const b = (base ?? {}) as Partial<CustomPluginState>
  if (sameJson(state.cfg, b.cfg)) state.cfg = normalizeCfg(t.cfg)
  if (sameJson(state.folders, b.folders) && Array.isArray(t.folders)) state.folders = t.folders as FolderNode[]
  if (sameJson(state.prompts, b.prompts) && Array.isArray(t.prompts)) state.prompts = t.prompts.map(normalizePrompt).filter((item): item is PromptItem => item !== null)
  if (sameJson(state.stars, b.stars) && t.stars !== null && typeof t.stars === 'object' && !Array.isArray(t.stars)) state.stars = t.stars as StarsMap
  if (sameJson(state.apiKey, b.apiKey) && typeof t.apiKey === 'string') state.apiKey = t.apiKey
  state.usage = mergeUsageThreeWay(state.usage, base?.usage ?? {}, t.usage)
```

**依据 3 · 源码核查**：[src/state.ts:315-326](https://github.com/AlexPeng07/dsh-custom-plugin/blob/3e2d72aeafdc46700907c1076eb73b9d21cee5a5/src/state.ts#L315-L326)

先合并后写临时文件和 rename，说明存在独立步骤。

<details>
<summary>查看原文（12行）</summary>

```text
export function saveStateFile(state: CustomPluginState, home: string = dshHome()): Promise<void> {
  const statePath = join(home, STATE_FILE)
  const turn = (saveQueues.get(statePath) ?? Promise.resolve())
    .catch(() => {})
    .then(async () => {
      await mergeExternalChanges(state, statePath)
      await mkdir(dirname(statePath), { recursive: true })
      const doc = JSON.stringify(state)
      const tmpPath = tempPathFor(statePath)
      try {
        await writeFile(tmpPath, doc, 'utf8')
        await rename(tmpPath, statePath)
```

</details>

#### 缺口

- 未实现或比较冲突拒绝方案
  **影响**：无法确认减少损失或值得引入交互
  **进一步探讨**：执行带精确交错控制的两进程对照并检查拒绝与恢复。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
