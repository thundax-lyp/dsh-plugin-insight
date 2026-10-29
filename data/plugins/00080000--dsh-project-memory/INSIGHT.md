# dsh-project-memory

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[27398b5](https://github.com/00080000/dsh-project-memory/tree/27398b5b7834319f2660540fa165cacbe3262ed5)

<!-- BEGIN META -->
[![GitHub ★ 28](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=28&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/00080000/dsh-project-memory) [![npm 30d 5,047](https://img.shields.io/static/v1?label=npm+30d&message=5%2C047&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)
<!-- END META -->

> **功能**：关联跨会话任务、项目文件和经验记忆，提供分层召回与自动上下文提示。

> **亮点**：把任务、文件索引与经验召回连为跨会话开发辅助流程，减少重新定位的潜在步骤。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：exact是占位，Saved不证明已落盘；相关性和作用域也不能保证经验仍正确。见[Q03](#research-q03)。

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
  - [Q01 · 项目记忆对谁增加了什么交付价值？](#detail-section-11)
  - [Q02 · 根、任务与召回怎样连成链路？](#detail-section-12)
  - [Q03 · 注入与成功回执是否足够证明可信、持久？](#detail-section-13)
  - [Q04 · 安装条件和一次受控使用需要什么？](#detail-section-14)
  - [Q05 · 哪些成本与效果已经可说？](#detail-section-15)
  - [Q06 · 什么条件可试用，未来方向怎样证伪？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：同一代码项目跨会话续接，价值应按正确完成任务而非条目数量衡量。见[Q01](#research-q01)。

任务笔记/AGENTS.md与grep更轻；插件增加自动关联和主动提示，也增加状态维护与核验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 任务工具/会话关联 | 续接清单与文件 | 绑定任务和宿主事件；非所有fork都排除 |
| 文档/符号索引与query_memory | 项目回源定位 | 安全且存在的root；exact不是陈旧检测 |
| 经验/insight | 项目和跨项目建议 | global不随任务隔离；向量合并需复核 |
| pre-step提示 | 减少主动查询步骤 | 默认开、有预算，相关性不验真 |
| 包内指南/命令/面板 | 发现入口和管理任务 | 依宿主服务，UI完整行为未验 |
| 保存与后台恢复 | 本地持久化 | dirty可待写，Saved不能作落盘回执 |

**流程与依赖**

核心需要宿主工具/事件与可写项目存储；PDF为直接依赖，向量、LLM扩展及指南/UI入口有条件。详表见[Q04](#research-q04)。

先核root和按需查询，再验任务续接、默认注入与保存重开；不要只凭Saved判断成功。步骤见[Q04](#research-q04)。

**效果与成本**

索引无LLM不代表总使用零成本；回源与dirty恢复需计入每次合格续接。完整表见[Q05](#research-q05)。

可考察重新定位步骤减少，当前不能声称更少错误/更省token。保留和否定条件见[Q06](#research-q06)。

> **思考**：exact是占位，Saved不证明已落盘；相关性和作用域也不能保证经验仍正确。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把任务、文件索引与经验召回连为跨会话开发辅助流程，减少重新定位的潜在步骤。见[Q01](#research-q01)、[Q02](#research-q02)。

根护栏、任务绑定、召回层与持久重试可借鉴；多层状态需向使用者给出一致含义。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

exact是占位，Saved不证明已落盘；相关性和作用域也不能保证经验仍正确。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

单项目保留笔记基线，先按需再自动；先解释持久状态后扩大范围。见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持续接、召回和恢复设计；正确性/净成本及锁忙回执缺实测，明确状态回执是待验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/auto-inject.js、src/doc-pipeline.js、src/index.js、src/insight-store.js、src/recall.js、src/setup/taskbridge.js、src/skill.js、src/store.js、src/tools/query-memory.js、src/tools/remember.js、src/util/fs.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核固定README/package、入口注册、根解析、任务绑定/路径、可见性、文档索引、查询返回、自动注入及保存调用链；未穷举解析器、UI编辑路由、所有工具或外部依赖实现。
- 下一步：未运行目标；一般宿主安装归范围边界，锁忙回执、陈旧误用和实际成本是待研究问题。

**分析版本**

- **仓库**：[00080000/dsh-project-memory](https://github.com/00080000/dsh-project-memory)
- **版本号**：0.6.7（[固定提交 27398b5](https://github.com/00080000/dsh-project-memory/tree/27398b5b7834319f2660540fa165cacbe3262ed5)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

让接受/待持久化/读回确认与陈旧来源状态可见，能否减少误信及总恢复成本须对照。见[Q06](#research-q06)。

未运行目标；一般宿主安装归范围边界，锁忙回执、陈旧误用和实际成本是待研究问题。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 2685 | — | — | 59725 |
| .js | source | 57 | 16485 | 12284 | 3572 | — |
| .mjs | source | 8 | 1683 | 1384 | 180 | — |
| .ts | source | 10 | 1413 | 1020 | 306 | — |
| .tsx | source | 5 | 1619 | 1370 | 166 | — |
| .mjs | test | 50 | 12178 | 9813 | 1442 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：项目记忆能否正确续接并回源，提示/成功回执怎样避免陈旧与未落盘误判？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 项目记忆对谁增加了什么交付价值？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合同一代码项目反复跨会话开发、容易丢失任务步骤和相关文件位置的 DSH 用户。作者把任务续接、文档/符号索引和经验记忆组合起来。合格结果是新会话找到正确任务与当前文件，继续完成工作并能回源核对，不是磁盘条目更多或召回分数更高。

手工任务笔记、AGENTS.md 与 grep 是较轻基线：记录清单并搜索现有代码。插件增加会话到持久任务的绑定、文件关联、多层召回和可选自动提示，可能减少重新定位；代价是维护第二份状态及确认记忆是否还适用。源码证实组件已接线，作者声称减少重复调试和上下文丢失，但未独立验证节时或正确率。偶尔单会话工作、笔记足够的人无须为索引和全局知识增加维护。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-22](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/README.md#L10-L22)

作者项目开发记忆与跨会话任务定位。

<details>
<summary>查看原文（13行）</summary>

```text
A persistent **project development memory** for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) agents. Built specifically for project development, natively integrated with dsh's task system: task lists and files read during a session are automatically persisted as cross-session task records, with tasks ↔ files linked — workflows can be switched and resumed, no need to re-scope the whole project, solving context loss. Underneath sits a **hybrid index**: document chunks, code symbols, experience notes and insights each form a layer, scored per layer and merged into one ranking. Documents (PDF/Markdown/txt) and code symbols are stored separately per workspace; documents are automatically cross-linked to the code symbols they mention. Experience notes (problem → solution) are automatically deduplicated, preventing repeated mistakes. Data survives session compaction and handover; recalls include `path:line` citations for source verification.

> The plugin keeps a compact project **memory** on disk, with every entry pointing to a concrete file and line — the agent can reorient quickly instead of re-reading the whole project.

![Task panel: task list, step progress, and involved files](docs/images/image.png)

## Features

- **TaskBridge: cross-session development tasks** — the session's todo list and the files it touches are persisted as per-project task entities, so a workflow can be switched and resumed without re-scoping the project. Associated files stay in recency-weighted order (a read never outranks a written file), so a resumed session sees where to look first. New sessions continue with `list_tasks` → `select_task`. Work delegated to subagents creates no task. On hosts without session events the task tools still work as a plain record list.
- **Task panel and editing** — draggable cards show a task's steps and files, and can collapse to a mini-bar or be hidden. Title, steps and status can be edited inline, writing back through the same path as model updates; four visual themes change material, geometry, typeface and density only, and colours follow the host. The panel stays hidden until summoned, syncs in the background on session switch, never reopens itself after a refresh, and a render failure cannot take down the host.
- **Document memory** — PDF, Markdown and plain text are chunked and summarized without a model call. Each entry keeps a short summary for injection, a bounded term set for recall, and a citation back to the source.
- **Code symbol memory** — a dependency-free scanner extracts functions, classes, methods, interfaces and type aliases with signatures; covered languages are JavaScript/TypeScript, Python, Go, Rust, C/C++/C#, Java and shell. Where `typescript` is installed, an optional second layer adds inferred return types, generics and interface shapes; it runs in the background and never blocks indexing.
- **Automatic, read-time memorization** — with lazy indexing (default), a file is memorized the moment the model reads it, so memory grows as a byproduct of normal work rather than an upfront scan. `index_repo` or a watched root can cover the rest of the tree; a background poll only re-indexes files that changed.
```

</details>

**依据 2 · 源码核查**：[src/index.js:194-219](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/index.js#L194-L219)

任务、索引、查询、经验工具与自动注入实际注册。

<details>
<summary>查看原文（26行）</summary>

```text
  ctx.tools.register(listTasksTool(config))
  ctx.tools.register(selectTaskTool(config, { llm: ctx.llm, ctx }))
  ctx.tools.register(archiveTaskTool(config, { llm: ctx.llm, ctx }))
  ctx.tools.register(showTaskPanelTool(config))

  // /tasks：唯一的用户命令（宿主命令注册后必然出现在 `/` 菜单且无法隐藏，所以只留一条）；
  // 切换/归档/审核等子动词由面板按钮经 remote.commands.execute 驱动。
  try {
    ctx.inject(['commands'], (commandsCtx) => {
      commandsCtx.commands.register(workflowCommandDefinition(config, ctx))
    })
  } catch (err) {
    console.error(`[dsh-project-memory] /tasks registration skipped: ${err.message}`)
  }

  ctx.tools.register(indexDocTool(ctx, config))
  ctx.tools.register(indexRepoTool(ctx, config))
  ctx.tools.register(queryMemoryTool(ctx, config))
  ctx.tools.register(rememberTool(config))
  ctx.tools.register(forgetTool(config))
  ctx.tools.register(lessonTool(config))
  ctx.tools.register(watchRepoTool(watchManager, config))
  ctx.tools.register(statsTool(config))

  // 注册 agent/pre-step 监听，向每步请求追加记忆消息（默认开；异常/无会话 cwd → 交回默认决策）。
  installAutoInject(ctx, config)
```

</details>

#### 缺口

- 跨会话任务对照缺失。
  **影响**：不能把接口齐备推成节时或避免错误。
  **进一步探讨**：固定项目任务，对照笔记/grep与插件，记录正确续接、回源与总人工耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 根、任务与召回怎样连成链路？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具先解析显式 root 或会话记忆根；显式根走安全校验，查询另检查根存在且非空查询，避免拼错目录被当空记忆。TaskBridge 把项目外路径丢弃，绑定任务可将已有步骤写回宿主 todo；子代理判定用 origin/delegationDepth，不把 fork 的 parentSession 一概当子代理。这里的根护栏是存储范围规则，不是多用户身份授权。

query_memory 从项目存储和 GlobalStore 取内容；任务级 insight 只对绑定任务可见，项目级和全局级均可召回，archived/draft 被过滤。可选 LLM 扩展在召回期发生；可选向量重排主要作用经验/insight，没安装时保留词法路径。文档/符号结果按层内相对分合并并保留层代表，返回 path:line；insight 的文件可缺，不能说每条记忆都有精确行号。

文档构建提取全文、分块、生成摘要/检索词并保存文本 hash，未把 LLM 传入索引构建。hash 用于索引更新，不提供经验事实真伪证明。路径和任务链接让用户知道去哪检查；它们不能替代重新读取当前文件。

#### 证据与依据

**依据 1 · 源码核查**：[src/util/fs.js:1310-1321](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/util/fs.js#L1310-L1321)

显式根安全校验、会话根与拒绝分支。

<details>
<summary>查看原文（12行）</summary>

```text
export function resolveSafeIndexRoot(exec, explicitRoot, config) {
  const allowUnsafe = config?.allowUnsafeRoots === true
  const explicit = explicitRoot && String(explicitRoot).trim() ? String(explicitRoot) : null
  if (explicit) {
    return assertSafeRoot(path.resolve(explicit), { requested: explicit, allowUnsafe, config })
  }
  const cwd = resolveIndexRoot(exec)
  const root = resolveProjectMemoryRoot(cwd, config)
  if (root) return root
  // allowUnsafeRoots 只放开内置名单；cwd 被 deny / exclude / 文件系统根命中时仍然拒绝。
  if (allowUnsafe && !rootRejection(cwd, config)) return cwd
  throw new UnsafeRootError(cwd, cwd, { config })
```

</details>

**依据 2 · 源码核查**：[src/tools/query-memory.js:88-124](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/tools/query-memory.js#L88-L124)

根/非空查询、存储、扩展和可选重排。

<details>
<summary>查看原文（37行）</summary>

```text
    async execute(args, exec) {
      const root = resolveSafeIndexRoot(exec, args.root, config)
      // 读路径也要验根存在。这条不是洁癖：可选的向量层（leanvec）在空 store 上会建
      // `<root>/.dsh-project-memory/vectors.json`，于是传错一个 root（拼写错误/旧路径）就能
      // 在任意可写位置造出目录和空 store，而回报是"No memory matches"——看起来像"这个项目
      // 没有记忆"，用户不会意识到自己查错了地方。与 index_repo/watch_repo 同一道护栏。
      assertIndexRoot(root, args.root || root)
      // 空查询不是"全部"：recallItems 会过滤空串，rankEntriesStreaming 随即返回
      // entries.slice(0, limit)（任意条目、分数 0），task 分支的 includes('') 更是命中所有任务。
      if (!String(args.query ?? '').trim()) {
        return 'query must not be empty. Use memory_stats to see what the store contains.'
      }
      const store = new ProjectMemoryStore(memoryRootFor(root, config.memoryDir)).load()
      const type = args.type || 'all'
      const limit = Math.max(1, Math.min(Number(args.limit) || 8, 20))

      const queries = config.llmQueryExpansion
        ? await expandQuery(ctx.llm, args.query, config.expansionCount, { route: resolveRoute(exec, config) })
        : [args.query]

      // 会话绑定决定 task 级 insight 的可见性；global 级始终可见。
      const sessionId = exec?.agent?.session?.id
      const boundTaskId = sessionId && typeof store.getBoundTaskId === 'function' ? store.getBoundTaskId(sessionId) : null
      const globalStore = new GlobalStore(cfgInsight(config).globalFile || defaultGlobalFile()).load()
      const wantMemory = type === 'all' || type === 'doc' || type === 'symbol'
      /** 本根记忆层（doc/symbol）的命中数：0 且存在子索引时，末尾要指路。 */
      let memHitCount = 0
      const wantInsight = type === 'all' || type === 'insight'
      // 可选向量层：**没装/没配就是 null**，此时 recallItems 拿到 rerank:null 与纯词法路径逐字段一致。
      // 只影响 experience/insight 两层的排序（doc/symbol 与返回条数都不变）。
      const cfg = cfgEngine(config)
      const rerank = await createVectorRerank({
        storeDir: memoryRootFor(root, config.memoryDir),
        items: vectorItemsFrom(store, globalStore),
        vectorDir: cfg.vectorDir,
        alpha: cfg.vectorAlpha,
      })
```

</details>

**依据 3 · 源码核查**：[src/setup/taskbridge.js:58-64](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/setup/taskbridge.js#L58-L64)

关联路径排除项目外。

```text
/** 把工具参数里的文件路径归一化为项目相对路径；项目外返回 null。 */
export function normalizeRelFile(root, file) {
  if (typeof file !== 'string' || !file) return null
  const abs = path.isAbsolute(file) ? file : path.resolve(root, file)
  const rel = path.relative(root, abs)
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return null
  return rel.split(path.sep).join('/')
```

**依据 4 · 源码核查**：[src/setup/taskbridge.js:84-107](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/setup/taskbridge.js#L84-L107)

任务todo接管及子代理判定。

<details>
<summary>查看原文（24行）</summary>

```text
export function adoptStepsToSession(session, task) {
  if (!session || typeof session.append !== 'function') return false
  const steps = Array.isArray(task?.steps) ? task.steps : null
  if (!steps || steps.length === 0) return false
  const todos = steps.map((s) => ({ content: String(stepContent(s)), status: stepStatus(s) }))
  session.append('todo/write', { todos })
  return true
}

/** 是否开启“任务接管时同步宿主清单”（config.tasklist.syncHostOnAdopt 默认 true）。 */
export function shouldAdoptToHost(config) {
  return config?.tasklist?.syncHostOnAdopt !== false
}

/**
 * 子代理会话判定：宿主 SessionHeader 对 in-process 子代理恒定写入
 * `origin: 'subagent'` 与 `delegationDepth`（parent depth + 1）。
 * 刻意不看 parentSession —— 那是 fork/seed 血缘，用户 fork 出来的顶层会话同样带它。
 */
export function isSubagentSession(session) {
  const header = session?.header
  if (!header) return false
  if (header.origin === 'subagent') return true
  return typeof header.delegationDepth === 'number' && header.delegationDepth > 0
```

</details>

**依据 5 · 源码核查**：[src/recall.js:136-162](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/recall.js#L136-L162)

project/global可见、task绑定及draft/archived过滤。

<details>
<summary>查看原文（27行）</summary>

```text
 * 召回可见的 insight：project / global 始终可见；task 只在该会话绑定了对应任务时可见
 * （任务私有，不泄露给别的会话）；两类都挡 archived 与 draft:true。
 * `kind:'experience'` 也在这里——统一存储后没有第二个真相源，本函数不做排除。
 * @returns {object[]} 可检索的 insight 条目。
 */
export function visibleInsights({ store = null, globalStore = null, boundTaskId = null } = {}) {
  const out = []
  for (const it of (store && typeof store.insightItems === 'function' ? store.insightItems() : []) || []) {
    if (!it || it.archived) continue
    if (it.scope === 'task') continue
    if (it.draft === true) continue
    out.push(it)
  }
  for (const it of (globalStore && typeof globalStore.items === 'function' ? globalStore.items() : []) || []) {
    if (!it || it.archived || it.draft === true) continue
    out.push(it)
  }
  if (boundTaskId && store && typeof store.getTask === 'function') {
    const task = store.getTask(boundTaskId)
    for (const it of (task && task.insights) || []) {
      if (!it || it.archived) continue
      // 任务级也要挡草稿：reflection 写的是 draft:true，未确认前不该被召回。
      if (it.draft === true) continue
      out.push({ ...it, scope: it.scope || 'task' })
    }
  }
  return out
```

</details>

**依据 6 · 源码核查**：[src/tools/query-memory.js:178-214](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/tools/query-memory.js#L178-L214)

文档path:line与insight可选files的不同返回。

<details>
<summary>查看原文（37行）</summary>

```text
        for (const h of merged) take(h)
        const memHits = picked
        memHitCount = memHits.length
        if (memHits.length) {
          const block = [`## Memory (${type === 'all' ? 'docs + symbols' : type})`]
          for (const { item: e, rel } of memHits) {
            const absSource = e.sourceLine ? `${toAbs(root, e.sourcePath)}:${e.sourceLine}` : toAbs(root, e.sourcePath)
            const score = Math.round((rel || 0) * 100)
            // 符号没有 summary：它的正文就是一行声明。缺正文时退到标题，绝不输出 `- undefined`。
            const body = e.type === 'symbol' ? (e.text || e.title) : e.summary
            const summaryLine = body ? `\n- ${body}` : ''
            // 条目状态占位（可证伪状态机落地前恒为 exact）。
            // 先立字段，后续状态机到位时只改值、不改输出契约。
            block.push(`### ${e.title} (score: ${score})\n- source: ${absSource}\n- status: ${e.status || 'exact'}${summaryLine}`)
            if (e.type === 'doc') {
              // 读取期解算：链接不落盘，按当前符号表排序取前 5（见 src/link.js）
              const refs = resolveLinkedSymbols(store, e, 5).map(
                (s) => `${s.title} @ ${toAbs(root, s.sourcePath)}:${s.sourceLine}`,
              )
              if (refs.length) block.push(`- references: ${refs.join('; ')}`)
            }
          }
          sections.push({ block, best: bestHint(memHits) })
        }
      }
      if (wantInsight) {
        const bucket = recalled.layers.find((l) => l.layer === 'insight')
        if (bucket && bucket.hits.length) {
          const block = ['## Insights (lessons / decisions / procedures)']
          for (const { item: e, rel } of bucket.hits) {
            const scope = e.scope ? `, scope: ${e.scope}` : ''
            const files = e.files && e.files.length ? `\n- files: ${e.files.map((f) => toAbs(root, f)).join(', ')}` : ''
            const conf = typeof e.confidence === 'number' ? `\n- confidence: ${e.confidence}` : ''
            const previous = previousLine(e)
            block.push(
              `### ${e.title} (score: ${Math.round(rel * 100)}, kind: ${e.kind}${scope}, id: ${e.insightId})\n- ${e.summary}${files}${conf}${previous ? `\n- previous: ${previous}` : ''}`,
            )
```

</details>

**依据 7 · 源码核查**：[src/doc-pipeline.js:30-53](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/doc-pipeline.js#L30-L53)

非LLM文档构建、文本hash与分块摘要。

<details>
<summary>查看原文（24行）</summary>

```text
 * 注入用 summary 与检索用 terms 分离：
 *   - summary：≤300 字符，进上下文，保持小预算；
 *   - terms：整个 chunk 的字面词项，只进 BM25 检索文本，不进注入。
 * 于是「chunk 只有前 300 字符可检索」的旧限制被移除，且没有任何 LLM 调用。
 * 函数签名里刻意没有 llm —— 索引期零 LLM 由构造保证，而不是靠 catch。
 */
export async function buildDocEntries(relPath, filePath, opts = {}) {
  const text = await extractTextFromFile(filePath, opts)
  if (looksLikeDump(text)) return null

  // Compute content hash for update detection
  const hash = createHash('sha256').update(text).digest('hex').slice(0, 16)

  const chunks = chunkText(text, opts.chunkChars, opts.maxChunks)
  return chunks.map((chunk, i) => ({
    id: `${entryIdPrefix(relPath)}#${i}`,
    sourcePath: relPath,
    sourceLine: chunk.line,
    type: 'doc',
    title: chunk.title || relPath,
    summary: summarizeText(chunk.text),
    keywords: extractKeywords(chunk.title, chunk.text),
    terms: extractTermText(chunk.text),
    termsVersion: TOKENIZER_VERSION,
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 注入与成功回执是否足够证明可信、持久？

**研究主题**：缺陷与关键质疑

#### 完整回答

不足。自动上下文默认开，pre-step 先取得宿主 enter 决策，无会话 cwd/id 或不安全根即跳过；异常记录后返回原决策。候选分 authored trigger 全文和统计相关性提示两通道，有预算与冷却。触发条件、词法/向量分数只判断可能适用，不能验证旧经验与当前代码一致；消息生产者元数据也不直接进入模型序列化内容，标题是模型可见线索。默认提示不等于已经经过人工确认。

全局内容不随项目切换隔离；任务绑定只限制 task 层。query_memory 文档/符号输出的 status 在源码注明是占位，缺状态默认 exact，因此不能把这个词当成已实现陈旧检测的验收结论。可选向量自动合并会覆盖既有字段，虽有 previous 机制，语义近似也不能保证两个项目的解决办法相同。

持久化有目录锁、冲突合并和脏存储重试。锁超时 save() 返回 false，保持 dirty 并计划重试；但 commit() 忽略 save() 布尔值返回变更结果，remember 随后仅按 result.ok 输出 Saved/Updated。静态调用链因此允许“内存更新已成功、磁盘仍待写”用同一成功文案呈现；不是本轮已复现数据丢失。普通写异常仍会抛出，不能泛称所有失败均静默。卸载限时 flush 是恢复机会，不覆盖强制退出、断电或重试最终失败。

使用时把记忆当有来源的建议，确认根/作用域、回读当前文件；重要经验除看 Saved 外，应检查持久状态并在重开后复查。遇不明成功状态先保留存储、核锁/磁盘和重开读回，避免继续依赖尚未落盘的知识。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:94-107](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/index.js#L94-L107)

自动注入默认开。

<details>
<summary>查看原文（14行）</summary>

```text
  // 静默注入（entry 常驻块 + relevance 门控）；无项目 root 可解析时零副作用。
  autoContext: Schema.object({
    enabled: Schema.boolean().default(true),
    entryOn: Schema.boolean().default(true),
    maxTokens: Schema.number().default(400),
    entryMaxInsights: Schema.number().default(6),
    // 提示通道的相对阈值（层内最高分的比例）——出厂判据
    signalMinRatio: Schema.number().default(0.5),
    // resident 任务卡最多显示几个「编辑中」文件
    editedMax: Schema.number().default(3),
    // 记忆根是"推定"的（会话工作目录且无项目标记）时，首次注入前通告模型根在哪；只发一次、不占条目额度。
    rootNotice: Schema.boolean().default(true),
    // 模型自己维护清单且之后没有新人类消息时，不把任务卡回声给模型
    skipEchoSelfTodo: Schema.boolean().default(true),
```

</details>

**依据 2 · 源码核查**：[src/auto-inject.js:25-39](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/auto-inject.js#L25-L39)

模型可见标题与生产者元数据边界。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * 注入块抬头里的插件名。
 * 消息的 `source.kind` 只有宿主看得到（请求序列化只取 `role` 与 `content`），抬头是模型与 GUI 用户
 * 唯一能看见生产者的地方。抬头不是行为契约：客户端不解析它，判据也不读它。
 */
export const PLUGIN_NAME = 'dsh-project-memory'

/**
 * 本插件在 `message.source` 上声明的生产者 kind。
 * 会话格式 v4 没有 `plugin` 兜底 kind：宿主会直接拒绝 `kind === 'plugin'` 的消息，
 * 且拒绝发生在编码落盘那一刻——整轮运行失败。
 * 值取 `plugin:<包名>`：这正是宿主 v3→v4 迁移改写本插件历史消息的结果，新写与迁移后是同一个
 * 生产者身份，自激闸门（isOwnInjection）不必按新旧分叉。
 */
export const SOURCE_KIND = 'plugin:dsh-project-memory'
```

</details>

**依据 3 · 源码核查**：[src/auto-inject.js:440-459](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/auto-inject.js#L440-L459)

预算及全文trigger/统计提示两通道。

<details>
<summary>查看原文（20行）</summary>

```text
  const reasons = []
  const dropped = []
  const parts = []
  // 预算只能是上限，不是目标。两条额度分开：stepBudget 是单轮（常驻块 + 条目）共享的 maxTokens；
  // itemBudget 是条目还受的会话字符额度，**常驻块不占这条**（它是状态快照，文档明说不受限）。
  const quotaChars = typeof opts.maxChars === 'number' ? opts.maxChars : Infinity
  const maxItems = typeof opts.maxItems === 'number' ? opts.maxItems : Infinity
  const skipItems = opts.skipItems === true
  const stepBudget = Math.max(0, (cfg.maxTokens || 400) * 3)
  const itemBudget = Math.max(0, Math.min(stepBudget, quotaChars))

  const skipItem = typeof opts.skipItem === 'function' ? opts.skipItem : null
  const cands = insightCandidates(store, globalStore, task, cfg).filter((it) => !(skipItem && skipItem(it)))

  // 两条通道：authored trigger（确定性、全文、优先级 1）→ 统计信号提示（优先级 2）。
  const triggered = collectTriggered(cands, ctx)
  if (skipItems) {
    // 会话级限流命中：条目通道本轮整体沉默，但把"本该注入什么"记进 dropped——不做静默降级。
    for (const { it } of triggered) dropped.push({ id: it.id, channel: 'trigger', reason: opts.silenceReason || 'cooldown' })
  }
```

</details>

**依据 4 · 源码核查**：[src/auto-inject.js:637-647](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/auto-inject.js#L637-L647)

enter与异常回退。

<details>
<summary>查看原文（11行）</summary>

```text
    // next 缺失会让本监听器 reject。更致命的是返回 undefined：宿主 agent.ts 直接读 `decision.kind`，
    // 会崩掉整步 → 无法回复。因此两种情况都退化为一个合法的 enter 决策。
    const fallback = () => ({ kind: 'enter', messages: (payload && payload.messages) || [] })
    const decision = typeof next === 'function' ? await next() : fallback()
    if (!decision) return fallback()
    if (decision.kind !== 'enter') return decision
    try {
      return (await injectForStep({ payload, decision, config, cfg, audit, shadow, sessions })) || decision
    } catch (err) {
      console.error(`[dsh-project-memory] auto-inject skipped: ${err?.message || err}`)
      return decision
```

</details>

**依据 5 · 源码核查**：[src/auto-inject.js:673-687](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/auto-inject.js#L673-L687)

会话身份/根护栏。

<details>
<summary>查看原文（15行）</summary>

```text
  const cwd = sessionWorkingDir(session, { agent: payload?.agent })
  const sessionId = session && session.id
  if (!cwd || !sessionId) return null
  // 会话 cwd 命中内置名单 / roots.deny / roots.exclude 时整条链路停在这里：不读 store（历史遗留的
  // 超大 store 光是 load() 就能 OOM），也不写审计——`appendShadowAudit` 里的 mkdirSync 正是把
  // `.dsh-project-memory` 造进家目录、进而触发"目录自标记 → 家目录被锁成项目"的那一步。
  const rejection = rootRejection(cwd, config)
  if (rejection) {
    warnUnsafeSessionRoot(cwd, rejection)
    return null
  }
  // 记忆根与懒索引/工具侧同一套解析：项目标记优先，其次是安全的会话工作目录。
  // 少了这一步，同一个会话的审计日志与懒索引会落在两个不同的 store 里。
  const root = resolveProjectMemoryRoot(cwd, config)
  if (!root) return null
```

</details>

**依据 6 · 源码核查**：[src/tools/query-memory.js:183-191](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/tools/query-memory.js#L183-L191)

exact占位而非已完成状态机。

```text
          for (const { item: e, rel } of memHits) {
            const absSource = e.sourceLine ? `${toAbs(root, e.sourcePath)}:${e.sourceLine}` : toAbs(root, e.sourcePath)
            const score = Math.round((rel || 0) * 100)
            // 符号没有 summary：它的正文就是一行声明。缺正文时退到标题，绝不输出 `- undefined`。
            const body = e.type === 'symbol' ? (e.text || e.title) : e.summary
            const summaryLine = body ? `\n- ${body}` : ''
            // 条目状态占位（可证伪状态机落地前恒为 exact）。
            // 先立字段，后续状态机到位时只改值、不改输出契约。
            block.push(`### ${e.title} (score: ${score})\n- source: ${absSource}\n- status: ${e.status || 'exact'}${summaryLine}`)
```

**依据 7 · 源码核查**：[src/insight-store.js:943-953](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/insight-store.js#L943-L953)

可选向量近邻自动覆盖路径。

<details>
<summary>查看原文（11行）</summary>

```text
    // 1) 已有 project 级知识 → 挂成员/命中，不再在 task 层重复存
    const pjItems = store.insightItems()
    const pjNear = vectorNear(vectorText(base), pjItems, cosine)
    const pjTarget = autoMergeTarget(pjNear, cfg)
    if (pjTarget) {
      const { replaced } = mergeInto(pjTarget.item, base, cfg, now)
      store.replaceInsightItems(pjItems)
      applyDecay(pjItems, cfg, now)
      pruneItems(pjItems, cfg.maxProject, now)
      const promoted = promoteProjectToGlobal(store, globalStore, cfg, now)
      return { ok: true, action: 'auto-merged', id: pjTarget.item.id, scope: 'project', replaced, cos: Number(pjTarget.top1.toFixed(3)), hint: `相似度 ${pjTarget.top1.toFixed(3)}，已自动覆盖 project 级既有条目${replaced.length ? `（覆盖字段 ${replaced.join('/')}）` : ''}${promoted ? '；已自动提升 global' : ''}` }
```

</details>

**依据 8 · 源码核查**：[src/store.js:838-852](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/store.js#L838-L852)

锁超时保持脏状态并返回false。

<details>
<summary>查看原文（15行）</summary>

```text
    // 跨进程：整段读改写放进目录锁，默认同步等 15s。拿不到锁就保持脏状态并登记退出 flush，
    // 默认静默，不向用户/模型抛提示。
    const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : 15000
    // `maxHoldMs`：同一次启动内 pid 被别的进程复用后，残留锁会一直被当成"活锁"（Windows 上
    // 没有 /proc，看不出 pid 复用）。一次写盘只在毫秒级持锁，超过 10 分钟就不可能是"正在写"。
    const release = acquireDirLock(this.dir, { timeoutMs, ensureDir: false, maxHoldMs: 10 * 60_000 })
    if (!release) {
      this.lastSaveOk = false
      trackDirty(this)
      if (!this._lockWarned) {
        this._lockWarned = true
        debugPersistence(`[dsh-project-memory] store ${this.dir} is busy (another dsh process is writing); this write is pending.`)
      }
      this._scheduleSaveRetry()
      return false
```

</details>

**依据 9 · 源码核查**：[src/store.js:936-950](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/store.js#L936-L950)

普通写失败抛出与成功基线。

<details>
<summary>查看原文（15行）</summary>

```text
    } catch (err) {
      // 非锁原因的写失败（ENOSPC / EISDIR / 只读挂载）也要置 lastSaveOk=false 并登记 flush。
      this.lastSaveOk = false
      trackDirty(this)
      throw err
    } finally {
      release()
    }
    this._saveRetryAttempts = 0
    this.lastSaveOk = true
    untrackDirty(this)
    // 落盘成功才推进基线：失败时保持"本进程新建"的标记，下一次 save 仍要补写。
    if (wroteInsights) {
      this._baseInsightIds = new Set(this.insights.items.map((it) => it?.id).filter(Boolean))
      this._createdInsightIds.clear()
```

</details>

**依据 10 · 源码核查**：[src/store.js:1374-1383](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/store.js#L1374-L1383)

commit返回变更结果，未传播save布尔值。

<details>
<summary>查看原文（10行）</summary>

```text
  /**
   * @param {(store: ProjectMemoryStore) => any} fn 变更函数
   * @param {{save?: boolean}} [options] save=false 时只标脏，由调用方在回合结束统一 flush
   *   （文件工具每读一次都会更新任务热点，逐次落盘会把 tasks.json 写成每工具调用一次）。
   */
  commit(fn, options = {}) {
    const result = fn(this)
    this.pruneTasks()
    if (options.save !== false) this.save()
    return result
```

</details>

**依据 11 · 源码核查**：[src/tools/remember.js:62-72](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/tools/remember.js#L62-L72)

工具按变更result.ok返回Saved。

<details>
<summary>查看原文（11行）</summary>

```text
      store.commit((s) => {
        result = saveInsight({ store: s, globalStore, raw, scope: 'project', cfg, source: 'agent', cosine })
        return result
      })
      globalStore.commit()
      if (!result || !result.ok) return `Failed: ${result?.error || '写入未完成'}`
      const verb = result.action === 'created' ? 'Saved' : 'Updated existing'
      const dropped = citation.dropped.length
        ? `\n（${citation.dropped.length} 个 source_file 不是项目内路径，已丢弃）`
        : ''
      return `${verb} experience note (${result.id}).${result.hint ? ` ${result.hint}` : ''}${dropped}`
```

</details>

**依据 12 · 源码核查**：[src/index.js:174-176](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/index.js#L174-L176)

退出限时flush。

```text
  // 卸载/退出前把还脏着的 store 同步写一次（后台重试只是兜底，不能当正确性保证）。
  if (typeof ctx.effect === 'function') {
    ctx.effect(() => () => flushDirtyStores({ timeoutMs: 1500 }))
```

#### 缺口

- 未复现锁超时后成功文案、退出与重开读回。
  **影响**：不能给出实际丢失概率，也不能把Saved视为落盘保证。
  **进一步探讨**：隔离profile制造锁等待，核工具回执/dirty/磁盘/强退与正常退出后读回。
- 陈旧经验、跨项目同名与自动覆盖的误用率未知。
  **影响**：相关性不能替代正确性收益。
  **进一步探讨**：用改过代码及相似但不同约束案例盲测回源、误用和纠正时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装条件和一次受控使用需要什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 条件

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH工具/事件与包声明版本范围 | 核心必需 | 工具、会话绑定与pre-step | 不把模块可读当宿主可加载；固定组合验收 |
| Node >=18与可写项目存储 | 包声明/持久化必需 | 本地解析、索引和任务/经验写入 | 权限/磁盘/锁分别检查，Saved可能待写 |
| pdfjs-dist | 声明直接依赖 | PDF解析路径 | PDF单独核；未独立审其版本兼容与解析安全 |
| leanvec和对应资源 | 可选 | 经验/insight向量重排/近邻 | 缺失用词法；不自动获得语义正确性 |
| LLM服务 | 扩展/反思等可选 | 召回查询扩展等 | 索引构建不传LLM，启用后另计请求成本 |
| 宿主skills/UI/命令服务 | 相应入口可选 | 包内使用指南、任务面板/工作流命令 | 入口缺失不冒充完整UI验收 |
| GlobalStore路径与范围约定 | 使用跨项目知识时必需 | 共享经验 | 先备份核作用域，别当项目专属 |

#### 使用步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定宿主/包版本，在非敏感单项目备份项目与global存储 | 能解释root、可写位置及退出方案 |
| 索引 | 用户调用index_repo/index_doc，先小文件 | 文件/行可回源；空结果先核根，不重复扩大扫描 |
| 续接 | 用户用list_tasks/select_task，并query_memory | 任务、步骤和当前文件一致；错误绑定先纠正 |
| 扩展 | 核查询后再试默认注入、可选LLM/向量 | 区分提示/事实，比较新增上下文与误用 |
| 保存 | 用户写一条非关键经验并重开读取 | 核磁盘与读回，不只接受Saved；锁忙先保留现场 |
| 退出 | 用户停用注入/插件、备份两层存储 | 回到笔记/grep继续，不依赖未验证任务状态 |

包的 main 直接指向 src/index.js，版本 0.6.7；本轮核的是固定仓库源码，尚未核对 npm 制品字节，也未加载目标。普通安装/宿主冒烟是范围边界，具体召回与落盘问题仍在Q03单列。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-7](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/package.json#L2-L7)

实际版本和直接src入口。

```text
  "name": "@yolk_vat-y/dsh-project-memory",
  "version": "0.6.7",
  "description": "Persistent project memory for dsh agents: index docs (PDF/Markdown/text) and code symbols into a searchable per-workspace store, recall them with cited sources, and keep experience entries (problems -> solutions) searchable on demand.",
  "author": "00080000 <3388065969@qq.com>",
  "type": "module",
  "main": "src/index.js",
```

**依据 2 · 源码核查**：[src/skill.js:72-85](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/skill.js#L72-L85)

可选服务实际注册及异常回退。

<details>
<summary>查看原文（14行）</summary>

```text
export function setupSkill(ctx, { build = buildProjectMemorySkill, log = console } = {}) {
  const register = (skillsCtx) => {
    try {
      skillsCtx.skills.register(build())
    } catch (err) {
      log.error(`[dsh-project-memory] skill registration skipped: ${err?.message || err}`)
    }
  }
  try {
    if (typeof ctx.inject === 'function') ctx.inject(['skills'], register)
    else if (typeof ctx.get === 'function' && ctx.get('skills')) register(ctx)
  } catch (err) {
    log.error(`[dsh-project-memory] skill registration skipped: ${err?.message || err}`)
  }
```

</details>

**依据 3 · 源码核查**：[src/index.js:194-207](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/index.js#L194-L207)

任务面板工具和可选tasks命令。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.tools.register(listTasksTool(config))
  ctx.tools.register(selectTaskTool(config, { llm: ctx.llm, ctx }))
  ctx.tools.register(archiveTaskTool(config, { llm: ctx.llm, ctx }))
  ctx.tools.register(showTaskPanelTool(config))

  // /tasks：唯一的用户命令（宿主命令注册后必然出现在 `/` 菜单且无法隐藏，所以只留一条）；
  // 切换/归档/审核等子动词由面板按钮经 remote.commands.execute 驱动。
  try {
    ctx.inject(['commands'], (commandsCtx) => {
      commandsCtx.commands.register(workflowCommandDefinition(config, ctx))
    })
  } catch (err) {
    console.error(`[dsh-project-memory] /tasks registration skipped: ${err.message}`)
  }
```

</details>

**依据 4 · 源码核查**：[package.json:50-59](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/package.json#L50-L59)

Node声明、PDF依赖。

<details>
<summary>查看原文（10行）</summary>

```text
  "engines": {
    "node": ">=18"
  },
  "dependencies": {
    "pdfjs-dist": "^4.10.38"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-client-locale": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-store": "0.2.1-rc.2",
```

</details>

**依据 5 · 源码核查**：[package.json:97-116](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/package.json#L97-L116)

宿主声明/导出及leanvec可选。

<details>
<summary>查看原文（20行）</summary>

```text
    "engines": {
      "dsh": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.3.0-0"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    }
  },
  "exports": {
    ".": "./src/index.js",
    "./client": "./client/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml"
  },
  "optionalDependencies": {
    "leanvec": "^0.2.0"
```

</details>

**依据 6 · 源码核查**：[src/index.js:25-38](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/index.js#L25-L38)

存储位置、文件上限及LLM扩展默认关。

<details>
<summary>查看原文（14行）</summary>

```text
export const Config = Schema.object({
  memoryDir: Schema.string().default('.dsh-project-memory'),
  chunkChars: Schema.number().default(3000),
  maxChunksPerFile: Schema.number().default(40),
  // 单文件内存闸门，不是磁盘设置：索引一个文件要先整个物化，峰值随文件大小线性走。
  // 实测边际系数（峰值 RSS / 磁盘 MB，见 scripts/file-peak.mjs 与 README「单文件内存预算」）：
  // 典型源码 ~10×、符号密集代码 ~22×、文本型 PDF ~20×；10 把单文件增量压在 ~+300 MB。
  maxFileSizeMb: Schema.number().default(10),
  maxOutputChars: Schema.number().default(8000),
  maxPdfPages: Schema.number().default(1000),
  llmQueryExpansion: Schema.boolean().default(false),
  expansionCount: Schema.number().default(6),
  // 辅助 LLM 调用的路由覆写 —— **索引期零 LLM**，只服务召回期查询扩展与反思期。
  // 未设置时取当前会话 header 的 provider/model，后台路径取最近一次会话路由；都拿不到时
```

</details>

**依据 7 · 源码核查**：[src/index.js:174-181](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/index.js#L174-L181)

退出flush和可选skill入口。

```text
  // 卸载/退出前把还脏着的 store 同步写一次（后台重试只是兜底，不能当正确性保证）。
  if (typeof ctx.effect === 'function') {
    ctx.effect(() => () => flushDirtyStores({ timeoutMs: 1500 }))
  }
  // TaskBridge：任务实体 + 宿主 todo 同步
  setupTaskbridge(ctx, config)
  // 用法本身也是记忆的一部分：注册成宿主 skill（可选依赖，没有 skills 服务就静默跳过）。
  setupSkill(ctx)
```

**依据 8 · 源码核查**：[src/skill.js:1-15](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/skill.js#L1-L15)

包内指南、缺skills静默跳过。

<details>
<summary>查看原文（15行）</summary>

```text
// 把"怎么用 project-memory"作为宿主 skill 暴露，而不是文档里的一段说明。
//
// 为什么不写 `.dsh/skills/`：那会把文件写进用户项目或全局 home，且与插件版本脱钩
// （升级插件后 skill 还是旧的）。运行时注册随包升级，`resourceBase` 指向包内目录，
// 模型能按相对路径取 `scripts/pm-digest.mjs`。
//
// 宿主没有 `skills` 服务时静默跳过 —— 与 `/tasks` 同一套软依赖写法（顶层 inject 会让整个
// 半边在缺服务时**不挂载**，那是最坏的失败形态，见 src/client/services.ts 的同类注释）。
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const SKILL_NAME = 'project-memory'
/** 包内目录：`skills/project-memory/`（npm files 白名单里有 `skills`）。 */
export const SKILL_DIR = fileURLToPath(new URL('../skills/project-memory/', import.meta.url))
```

</details>

**依据 9 · 源码核查**：[src/tools/query-memory.js:88-124](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/tools/query-memory.js#L88-L124)

查询与可选扩展、向量路径。

<details>
<summary>查看原文（37行）</summary>

```text
    async execute(args, exec) {
      const root = resolveSafeIndexRoot(exec, args.root, config)
      // 读路径也要验根存在。这条不是洁癖：可选的向量层（leanvec）在空 store 上会建
      // `<root>/.dsh-project-memory/vectors.json`，于是传错一个 root（拼写错误/旧路径）就能
      // 在任意可写位置造出目录和空 store，而回报是"No memory matches"——看起来像"这个项目
      // 没有记忆"，用户不会意识到自己查错了地方。与 index_repo/watch_repo 同一道护栏。
      assertIndexRoot(root, args.root || root)
      // 空查询不是"全部"：recallItems 会过滤空串，rankEntriesStreaming 随即返回
      // entries.slice(0, limit)（任意条目、分数 0），task 分支的 includes('') 更是命中所有任务。
      if (!String(args.query ?? '').trim()) {
        return 'query must not be empty. Use memory_stats to see what the store contains.'
      }
      const store = new ProjectMemoryStore(memoryRootFor(root, config.memoryDir)).load()
      const type = args.type || 'all'
      const limit = Math.max(1, Math.min(Number(args.limit) || 8, 20))

      const queries = config.llmQueryExpansion
        ? await expandQuery(ctx.llm, args.query, config.expansionCount, { route: resolveRoute(exec, config) })
        : [args.query]

      // 会话绑定决定 task 级 insight 的可见性；global 级始终可见。
      const sessionId = exec?.agent?.session?.id
      const boundTaskId = sessionId && typeof store.getBoundTaskId === 'function' ? store.getBoundTaskId(sessionId) : null
      const globalStore = new GlobalStore(cfgInsight(config).globalFile || defaultGlobalFile()).load()
      const wantMemory = type === 'all' || type === 'doc' || type === 'symbol'
      /** 本根记忆层（doc/symbol）的命中数：0 且存在子索引时，末尾要指路。 */
      let memHitCount = 0
      const wantInsight = type === 'all' || type === 'insight'
      // 可选向量层：**没装/没配就是 null**，此时 recallItems 拿到 rerank:null 与纯词法路径逐字段一致。
      // 只影响 experience/insight 两层的排序（doc/symbol 与返回条数都不变）。
      const cfg = cfgEngine(config)
      const rerank = await createVectorRerank({
        storeDir: memoryRootFor(root, config.memoryDir),
        items: vectorItemsFrom(store, globalStore),
        vectorDir: cfg.vectorDir,
        alpha: cfg.vectorAlpha,
      })
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些成本与效果已经可说？

**研究主题**：效果与总成本

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 全文解析/索引、磁盘和内存；可选向量资源 | 安装、挑根/排除项、核任务与来源 | 配置默认单文件10MB，实际峰值未测；不以索引零LLM说总成本为零 |
| 持续使用 | 检索/监视IO、存储与注入上下文；可选扩展/反思LLM | 纠正过期经验、绑定和全局范围 | 扩展默认关，默认注入仍占上下文；token与费用未知 |
| 失败恢复 | 锁等待/重试、flush和备份空间 | 核Saved/dirty/磁盘、重开对照 | 正常退出兜底不保证强退；恢复时长未知 |
| 升级退出 | 格式/存储迁移和项目/global备份 | 检查任务/引用、恢复笔记流程 | 源码存在分片压实；未核真实迁移耗时 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 跨会话定位 | 任务绑定、步骤回写与文件关联接线 | 正确续接率及总节时 |
| 有来源召回 | 文档/符号path:line，insight可带files | 文件是否仍支持经验，exact非陈旧验真 |
| 主动提示 | pre-step的触发/相关性和预算回退 | 遗漏、错误提示、上下文净收益 |
| 持久保存 | 锁/原子写与脏状态重试设计 | Saved后立即强退是否已落盘及真实故障率 |

按“正确续接并完成一次任务”计成本，计入所有失败重试、回源、纠错与迁移，不按召回条数平均宣称省钱。与手写笔记/grep比较最终正确率、总人工时间、上下文用量和恢复时间；当前材料不足给ROI或费用下降。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:25-38](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/index.js#L25-L38)

资源边界与可选LLM配置，注释的作者峰值不当独立测量。

<details>
<summary>查看原文（14行）</summary>

```text
export const Config = Schema.object({
  memoryDir: Schema.string().default('.dsh-project-memory'),
  chunkChars: Schema.number().default(3000),
  maxChunksPerFile: Schema.number().default(40),
  // 单文件内存闸门，不是磁盘设置：索引一个文件要先整个物化，峰值随文件大小线性走。
  // 实测边际系数（峰值 RSS / 磁盘 MB，见 scripts/file-peak.mjs 与 README「单文件内存预算」）：
  // 典型源码 ~10×、符号密集代码 ~22×、文本型 PDF ~20×；10 把单文件增量压在 ~+300 MB。
  maxFileSizeMb: Schema.number().default(10),
  maxOutputChars: Schema.number().default(8000),
  maxPdfPages: Schema.number().default(1000),
  llmQueryExpansion: Schema.boolean().default(false),
  expansionCount: Schema.number().default(6),
  // 辅助 LLM 调用的路由覆写 —— **索引期零 LLM**，只服务召回期查询扩展与反思期。
  // 未设置时取当前会话 header 的 provider/model，后台路径取最近一次会话路由；都拿不到时
```

</details>

**依据 2 · 源码核查**：[src/doc-pipeline.js:30-53](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/doc-pipeline.js#L30-L53)

索引无LLM但仍全文/分块工作。

<details>
<summary>查看原文（24行）</summary>

```text
 * 注入用 summary 与检索用 terms 分离：
 *   - summary：≤300 字符，进上下文，保持小预算；
 *   - terms：整个 chunk 的字面词项，只进 BM25 检索文本，不进注入。
 * 于是「chunk 只有前 300 字符可检索」的旧限制被移除，且没有任何 LLM 调用。
 * 函数签名里刻意没有 llm —— 索引期零 LLM 由构造保证，而不是靠 catch。
 */
export async function buildDocEntries(relPath, filePath, opts = {}) {
  const text = await extractTextFromFile(filePath, opts)
  if (looksLikeDump(text)) return null

  // Compute content hash for update detection
  const hash = createHash('sha256').update(text).digest('hex').slice(0, 16)

  const chunks = chunkText(text, opts.chunkChars, opts.maxChunks)
  return chunks.map((chunk, i) => ({
    id: `${entryIdPrefix(relPath)}#${i}`,
    sourcePath: relPath,
    sourceLine: chunk.line,
    type: 'doc',
    title: chunk.title || relPath,
    summary: summarizeText(chunk.text),
    keywords: extractKeywords(chunk.title, chunk.text),
    terms: extractTermText(chunk.text),
    termsVersion: TOKENIZER_VERSION,
```

</details>

**依据 3 · 源码核查**：[src/auto-inject.js:440-459](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/auto-inject.js#L440-L459)

注入字符/条目预算。

<details>
<summary>查看原文（20行）</summary>

```text
  const reasons = []
  const dropped = []
  const parts = []
  // 预算只能是上限，不是目标。两条额度分开：stepBudget 是单轮（常驻块 + 条目）共享的 maxTokens；
  // itemBudget 是条目还受的会话字符额度，**常驻块不占这条**（它是状态快照，文档明说不受限）。
  const quotaChars = typeof opts.maxChars === 'number' ? opts.maxChars : Infinity
  const maxItems = typeof opts.maxItems === 'number' ? opts.maxItems : Infinity
  const skipItems = opts.skipItems === true
  const stepBudget = Math.max(0, (cfg.maxTokens || 400) * 3)
  const itemBudget = Math.max(0, Math.min(stepBudget, quotaChars))

  const skipItem = typeof opts.skipItem === 'function' ? opts.skipItem : null
  const cands = insightCandidates(store, globalStore, task, cfg).filter((it) => !(skipItem && skipItem(it)))

  // 两条通道：authored trigger（确定性、全文、优先级 1）→ 统计信号提示（优先级 2）。
  const triggered = collectTriggered(cands, ctx)
  if (skipItems) {
    // 会话级限流命中：条目通道本轮整体沉默，但把"本该注入什么"记进 dropped——不做静默降级。
    for (const { it } of triggered) dropped.push({ id: it.id, channel: 'trigger', reason: opts.silenceReason || 'cooldown' })
  }
```

</details>

**依据 4 · 源码核查**：[src/store.js:838-852](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/store.js#L838-L852)

锁等待与重试成本。

<details>
<summary>查看原文（15行）</summary>

```text
    // 跨进程：整段读改写放进目录锁，默认同步等 15s。拿不到锁就保持脏状态并登记退出 flush，
    // 默认静默，不向用户/模型抛提示。
    const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : 15000
    // `maxHoldMs`：同一次启动内 pid 被别的进程复用后，残留锁会一直被当成"活锁"（Windows 上
    // 没有 /proc，看不出 pid 复用）。一次写盘只在毫秒级持锁，超过 10 分钟就不可能是"正在写"。
    const release = acquireDirLock(this.dir, { timeoutMs, ensureDir: false, maxHoldMs: 10 * 60_000 })
    if (!release) {
      this.lastSaveOk = false
      trackDirty(this)
      if (!this._lockWarned) {
        this._lockWarned = true
        debugPersistence(`[dsh-project-memory] store ${this.dir} is busy (another dsh process is writing); this write is pending.`)
      }
      this._scheduleSaveRetry()
      return false
```

</details>

**依据 5 · 源码核查**：[src/store.js:855-868](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/store.js#L855-L868)

存量分片压实。

<details>
<summary>查看原文（14行）</summary>

```text
    let wroteTasks = false
    try {
      // 先合并另一进程已落盘的小文档，再写；分片按“加载时 hash”做冲突检测。
      this._mergeAuxFromDisk()
      if (!this._formatWritten) {
        writeJsonAtomic(path.join(this.dir, FORMAT_FILE), { version: 2, layout: 'sharded' }, { ensureDir: false })
        this._formatWritten = true
      }
      // 存量压实：≤0.5.10 的分片带派生字段，只有重写才消失。每轮最多 COMPACT_BATCH 个，
      // 让升级后的 store 在后续任意一次 save 里自动收敛。
      let compactBudget = COMPACT_BATCH
      for (const rel of this._compactQueue) {
        if (compactBudget <= 0) break
        compactBudget--
```

</details>

#### 缺口

- 缺代表项目的端到端资源、纠错与任务结果对照。
  **影响**：不能定量净收益或维护负担。
  **进一步探讨**：固定小/中项目按合格任务记录解析/内存/磁盘、LLM和人工全程成本。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么条件可试用，未来方向怎样证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

经常恢复同一项目任务、愿意回源核查的开发者，可以先在一个非敏感项目试用，保留笔记/grep基线。先查root/任务及按需召回，再验默认注入与global范围；至少做一次保存后正常重开，以及受控锁忙情形。只有正确续接和回源节省超过索引/纠错负担才保留。若跨项目经验误用、exact被误当事实校验或保存状态无法解释，停用注入并备份恢复到原流程。

技术上值得借鉴任务绑定与多层索引共用召回、根护栏和显式dirty重试；产品上仍是项目开发工具的一段续接流程，未证实独立付费需求。

可证伪方向是把“变更已接受/待持久化/已读回确认”做成可见回执，并将陈旧来源标成待复核。相对当前Saved与exact文案，可能减少错误信赖；代价是同步确认耗时、更多状态和人工操作。这是建议，不是现有功能。对照当前版与明确回执版本，在锁忙/正常退出/强退及来源修改案例比较误信、实际丢失、恢复耗时和正确续接；若只增加等待和确认、不减少误信或总恢复成本，否定该方向。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/remember.js:62-72](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/tools/remember.js#L62-L72)

成功文案只检查变更结果。

<details>
<summary>查看原文（11行）</summary>

```text
      store.commit((s) => {
        result = saveInsight({ store: s, globalStore, raw, scope: 'project', cfg, source: 'agent', cosine })
        return result
      })
      globalStore.commit()
      if (!result || !result.ok) return `Failed: ${result?.error || '写入未完成'}`
      const verb = result.action === 'created' ? 'Saved' : 'Updated existing'
      const dropped = citation.dropped.length
        ? `\n（${citation.dropped.length} 个 source_file 不是项目内路径，已丢弃）`
        : ''
      return `${verb} experience note (${result.id}).${result.hint ? ` ${result.hint}` : ''}${dropped}`
```

</details>

**依据 2 · 源码核查**：[src/store.js:1374-1383](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/store.js#L1374-L1383)

持久布尔值未穿透commit。

<details>
<summary>查看原文（10行）</summary>

```text
  /**
   * @param {(store: ProjectMemoryStore) => any} fn 变更函数
   * @param {{save?: boolean}} [options] save=false 时只标脏，由调用方在回合结束统一 flush
   *   （文件工具每读一次都会更新任务热点，逐次落盘会把 tasks.json 写成每工具调用一次）。
   */
  commit(fn, options = {}) {
    const result = fn(this)
    this.pruneTasks()
    if (options.save !== false) this.save()
    return result
```

</details>

**依据 3 · 源码核查**：[src/tools/query-memory.js:183-191](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/tools/query-memory.js#L183-L191)

exact默认占位为改进基线。

```text
          for (const { item: e, rel } of memHits) {
            const absSource = e.sourceLine ? `${toAbs(root, e.sourcePath)}:${e.sourceLine}` : toAbs(root, e.sourcePath)
            const score = Math.round((rel || 0) * 100)
            // 符号没有 summary：它的正文就是一行声明。缺正文时退到标题，绝不输出 `- undefined`。
            const body = e.type === 'symbol' ? (e.text || e.title) : e.summary
            const summaryLine = body ? `\n- ${body}` : ''
            // 条目状态占位（可证伪状态机落地前恒为 exact）。
            // 先立字段，后续状态机到位时只改值、不改输出契约。
            block.push(`### ${e.title} (score: ${score})\n- source: ${absSource}\n- status: ${e.status || 'exact'}${summaryLine}`)
```

**依据 4 · 源码核查**：[src/recall.js:136-162](https://github.com/00080000/dsh-project-memory/blob/27398b5b7834319f2660540fa165cacbe3262ed5/src/recall.js#L136-L162)

范围核查对应实际可见性。

<details>
<summary>查看原文（27行）</summary>

```text
 * 召回可见的 insight：project / global 始终可见；task 只在该会话绑定了对应任务时可见
 * （任务私有，不泄露给别的会话）；两类都挡 archived 与 draft:true。
 * `kind:'experience'` 也在这里——统一存储后没有第二个真相源，本函数不做排除。
 * @returns {object[]} 可检索的 insight 条目。
 */
export function visibleInsights({ store = null, globalStore = null, boundTaskId = null } = {}) {
  const out = []
  for (const it of (store && typeof store.insightItems === 'function' ? store.insightItems() : []) || []) {
    if (!it || it.archived) continue
    if (it.scope === 'task') continue
    if (it.draft === true) continue
    out.push(it)
  }
  for (const it of (globalStore && typeof globalStore.items === 'function' ? globalStore.items() : []) || []) {
    if (!it || it.archived || it.draft === true) continue
    out.push(it)
  }
  if (boundTaskId && store && typeof store.getTask === 'function') {
    const task = store.getTask(boundTaskId)
    for (const it of (task && task.insights) || []) {
      if (!it || it.archived) continue
      // 任务级也要挡草稿：reflection 写的是 draft:true，未确认前不该被召回。
      if (it.draft === true) continue
      out.push({ ...it, scope: it.scope || 'task' })
    }
  }
  return out
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
