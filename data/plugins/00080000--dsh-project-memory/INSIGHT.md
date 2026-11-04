# dsh-project-memory

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[26389e6](https://github.com/00080000/dsh-project-memory/tree/26389e6750ac3c363712435840a2b670e4d1e97d)

<!-- BEGIN META -->
[![GitHub ★ 29](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=29&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/00080000/dsh-project-memory) [![npm 30d 6,120](https://img.shields.io/static/v1?label=npm+30d&message=6%2C120&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)
<!-- END META -->

> **功能**：为 DSH 项目保存文档、代码符号、经验与任务，并提供跨会话检索和提示。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 支持把任务、相关文件与经验召回组合进跨会话开发流程；可减少重新整理的潜在步骤，尚无端到端收益数据。

> **主要限制**：[Q03](#research-q03) 显示 exact 是状态占位，Saved 只反映变更被接受；锁失败后的待持久化与经验是否仍正确须另行核对。

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
  - [Q01 · 任务、索引与召回组合具体改变何种开发流程？](#detail-section-11)
  - [Q02 · 按项目和任务绑定如何限制读取、注入与持久状态？](#detail-section-12)
  - [Q03 · 相关性与保存状态能否证明记忆仍正确且已持久化？](#detail-section-13)
  - [Q04 · 哪些使用负担与结果证据足以支持试用，能推导什么验证方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向反复返回同一代码项目的开发者，提供任务续接、带来源的索引召回与经验记录；合格续接仍须回原文件核对。

参照人工交接笔记加文本搜索，不声称已优于宿主原生上下文或完成同条件效果比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 文档与代码索引 | 保存可查来源 | 支持格式与安全根限制 |
| 混合召回 | 查文档、符号与经验 | 相关性不证明正确性 |
| 任务续接 | 列出并绑定历史任务 | 依赖宿主事件，非隔离 |
| 经验写入与遗忘 | 维护长期记录 | 成功文字非持久读回 |
| 自动注入 | 执行前提供相关记录 | 预算与触发门控，需回源 |
| tasks与Web面板 | 人工查看和管理任务 | 依赖相应宿主服务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 工具与事件服务 | 核心必需 | 注册工具、任务同步和注入 | 相应入口不能生效；范围见 package 声明 |
| 可写项目存储及备份 | 持久化必需 | 保存分片和任务 | 写入可能待重试，不能依赖成功文字 |
| PDF 解析包 | PDF文档必需 | 提取PDF文本 | 对应文档无法索引 |
| leanvec、LLM扩展 | 可选 | 经验重排、查询扩展 | 向量退回词法；扩展费用未知 |
| skills及Web客户端服务 | 对应入口必需 | 按需指南与任务面板 | 后台工具与这些界面应分开判断 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份项目与笔记，核对宿主版本和根 | 不在家目录误建记忆 |
| 记录 | Agent索引或按读文件记录，绑定任务 | 文件来源与任务归属正确 |
| 续接 | 新会话先列任务，再按需查询 | 回源确认引用仍适用 |
| 验收 | 用户用新进程读回关键记忆 | 读回失败则停自动注入，保留现场与笔记 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地索引存储，金额未知 | 配置、备份、选择项目，耗时未知 | 无模型索引不代表零总成本 |
| 持续使用 | 注入上下文及可选扩展调用 | 回源与经验复核 | 无合格续接成本对照 |
| 失败恢复 | 重试与存储副本 | 查锁、读回、恢复笔记 | 待写可能静默，时间未知 |
| 退出 | 保留已存记录的空间 | 关闭自动注入并回人工笔记 | global文件须单独核对 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 跨会话定位 | 任务和多层召回已接线 | 正确续接率与节时 |
| 检索可追溯 | 输出路径与行号 | 经验当前正确性 |
| 写入恢复 | 锁失败保留dirty并重试 | 崩溃前持久完成及实际恢复时间 |

> **思考**：[Q03](#research-q03) 显示 exact 是状态占位，Saved 只反映变更被接受；锁失败后的待持久化与经验是否仍正确须另行核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 支持把任务、相关文件与经验召回组合进跨会话开发流程；可减少重新整理的潜在步骤，尚无端到端收益数据。

[Q02](#research-q02) 统一根策略和分层召回减少不同入口归属漂移；[Q03](#research-q03) 保留脏状态重试有利于恢复，但调用者须区分变更接受与持久化完成。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示 exact 是状态占位，Saved 只反映变更被接受；锁失败后的待持久化与经验是否仍正确须另行核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在单项目备份中按需查询，检查根和任务归属，再新进程读回；来源冲突或回读不符时停止自动注入，返回原文件与人工笔记。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有组合机制获得固定源码支持，续接质量和成本仍未知；回执与来源状态设计属于未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.js、src/tools/query-memory.js、src/auto-inject.js、src/setup/taskbridge.js、src/store.js、src/tools/remember.js、src/skill.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件中抽读入口、查询、TaskBridge、注入、保存和经验写入；未完整审计所有解析器、UI编辑及第三方依赖，未运行目标代码。
- 下一步：在可丢弃副本中比较人工交接与插件续接，另外注入锁竞争和源文件变更，记录正确读回、误信、全部人工和恢复时间。

**分析版本**

- **仓库**：[00080000/dsh-project-memory](https://github.com/00080000/dsh-project-memory)
- **版本号**：0.6.9（[固定提交 26389e6](https://github.com/00080000/dsh-project-memory/tree/26389e6750ac3c363712435840a2b670e4d1e97d)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出未验证方向，将接受、待持久化、读回确认及来源变化分别展示；用锁竞争和源文件改动对照误信与恢复时间，若总负担不降则放弃。

在可丢弃副本中比较人工交接与插件续接，另外注入锁竞争和源文件变更，记录正确读回、误信、全部人工和恢复时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 2770 | — | — | 64132 |
| .js | source | 59 | 17731 | 13120 | 3972 | — |
| .mjs | source | 8 | 1683 | 1384 | 180 | — |
| .ts | source | 10 | 1454 | 1053 | 313 | — |
| .tsx | source | 6 | 1965 | 1619 | 244 | — |
| .mjs | test | 57 | 13806 | 11142 | 1621 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+created%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：项目任务与记忆的组合能否支持可核对的跨会话续接，以及何时应继续依赖原始文件和人工笔记？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 任务、索引与召回组合具体改变何种开发流程？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它适合反复返回同一代码项目的开发者，把会话内任务、相关文件和经验转成可在新会话查询的记录。合格结果应是新会话能定位当前任务并回到原文件核对约束，而非只看到更多记忆条目。README描述先 list_tasks 再 select_task 的续接流程；入口实际注册这组任务工具与文档、代码、经验工具，因此组合贡献有接线支持。

相对人工维护交接笔记加文本搜索，它将任务选择与检索放在同一宿主中，减少重新整理上下文的潜在步骤。文档摘要和符号提取不等于事实验证，也不能证明比直接读文件更省时间。若任务很短、文件常彻底重写或只使用一次会话，人工笔记的维护负担可能更小；没有同任务对照时不能宣称改善任务成功率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-29](https://github.com/00080000/dsh-project-memory/blob/26389e6750ac3c363712435840a2b670e4d1e97d/README.md#L18-L29)

作者将任务续接、混合召回、经验与触发注入作为组合功能。

<details>
<summary>查看原文（12行）</summary>

```text
- **TaskBridge: cross-session development tasks** — the session's todo list and the files it touches are persisted as per-project task entities, so a workflow can be switched and resumed without re-scoping the project. Associated files stay in recency-weighted order (a read never outranks a written file), so a resumed session sees where to look first. New sessions continue with `list_tasks` → `select_task`. Work delegated to subagents creates no task. On hosts without session events the task tools still work as a plain record list.
- **Task panel and editing** — draggable cards show a task's steps and files, and can collapse to a mini-bar or be hidden. Title, steps and status can be edited inline, writing back through the same path as model updates; four visual themes change material, geometry, typeface and density only, and colours follow the host. The panel stays hidden until summoned, syncs in the background on session switch, never reopens itself after a refresh, and a render failure cannot take down the host.
- **Document memory** — PDF, Markdown and plain text are chunked and summarized without a model call. Each entry keeps a short summary for injection, a bounded term set for recall, and a citation back to the source.
- **Code symbol memory** — a dependency-free scanner extracts functions, classes, methods, interfaces and type aliases with signatures; covered languages are JavaScript/TypeScript, Python, Go, Rust, C/C++/C#, Java and shell. Where `typescript` is installed, an optional second layer adds inferred return types, generics and interface shapes; it runs in the background and never blocks indexing.
- **Automatic, read-time memorization** — with lazy indexing (default), a file is memorized the moment the model reads it, so memory grows as a byproduct of normal work rather than an upfront scan. `index_repo` or a watched root can cover the rest of the tree; a background poll only re-indexes files that changed.
- **Doc ↔ code cross-linking** — a document that mentions a symbol is surfaced when that symbol is queried. Links are resolved against the current symbol table, so they cannot go stale.
- **Hybrid recall** — ranked search over documents, symbols, experience notes and insights, with optional LLM query expansion. The experience/insight layers are re-ordered by cosine when `leanvec` is present — installed by default, absent ⇒ pure lexical. Tuned for CJK: phrase boost, a synonym table, and CJK-aware boundaries for doc↔symbol linking.
  Russian (Cyrillic) is supported too: word splitting, a stopword list and Snowball stemming, so Russian queries hit Russian notes and take part in dedup.
- **Experience notes** — problems → solutions, deduplicated by overlap rather than repeated, bounded by project size, and surfaced both by search and by the same injection path as lessons.
- **Tiered insight memory (lessons / decisions / procedures)** — one entity across task, project and global scope. Near-duplicates merge or reinforce, and promotion moves an entry between scopes instead of copying it. Use is recorded, so decay and capacity rank by activity rather than age alone. The panel exposes a per-scope view for reviewing and editing entries. That list is ordered newest-first and loaded incrementally: 30 entries at a time, with the next page prefetched before the reader reaches the bottom and off-screen rows skipped by the renderer, so a large memory stays responsive.
- **Triggered injection** — an insight may carry an authored trigger: only `when` triggers, `guard` narrows it, and `prevents` records what breaks without the entry. Corpus text can never trigger an injection; the statistical channel is gated separately and silent by default. **Evidence is graded by source**: only host facts (structured tool calls, `fs`/`todo` events) and irreversible actions named by the human (commit / publish / release / push / deploy / go public) can inject full text; prose mentions of delete / clean up / render / benchmark only feed the hint channel, and subagent prompts plus notice-shaped messages never count as actions.
- **Usage is a skill too** — it registers `project-memory` into the host `skills` registry (a directory bundle with `scripts/pm-digest.mjs`, `resourceBase` pointing inside the package). The model loads the query/write workflow on demand instead of carrying it in every prompt; hosts without a `skills` service skip it silently.
```

</details>

**依据 2 · 源码核查**：[src/index.js:201-242](https://github.com/00080000/dsh-project-memory/blob/26389e6750ac3c363712435840a2b670e4d1e97d/src/index.js#L201-L242)

入口连接任务工具、索引工具和 pre-step 注入，支持组合机制存在。

<details>
<summary>查看原文（42行）</summary>

```text
  // TaskBridge：任务实体 + 宿主 todo 同步
  setupTaskbridge(ctx, config)
  // 用法本身也是记忆的一部分：注册成宿主 skill（可选依赖，没有 skills 服务就静默跳过）。
  setupSkill(ctx)
  // 跟踪会话路由（request/header 事件），为无会话上下文的召回期可选 LLM（查询扩展 / 反思）兜底
  ctx.on('session/event', (session, event) => {
    if (event?.type === 'request/header') rememberRoute(session)
    // 会话活跃信号：跑回合时把 watch 轮询压到最低，回合结束立刻补扫一次（见 watch.js）。
    const key = session?.id ?? 'unknown'
    if (event?.type === 'turn/start' || event?.type === 'step/start') watchManager.setSessionActive(key, true)
    else if (event?.type === 'turn/end') watchManager.setSessionActive(key, false)
  })
  // 会话被销毁时也要摘掉活跃标记，否则没有正常 turn/end 的会话会把轮询**永久**压在兜底节拍。
  ctx.on('session/disposed', (session) => {
    watchManager.setSessionActive(session?.id ?? 'unknown', false)
  })
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

- 缺少同一任务跨会话续接的独立对照数据。
  **影响**：不能确认定位时间、错误或 token 开销是否改善。
  **进一步探讨**：用固定项目任务比较人工交接笔记与插件，记录正确续接率和回源时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 按项目和任务绑定如何限制读取、注入与持久状态？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

查询入口先解析安全项目根，拒绝不存在的根和空查询，再加载项目存储与全局存储。会话绑定只决定任务级 insight 的可见性，全局层仍被加载，因此任务绑定是检索上下文，不是租户隔离或全局记忆保密边界。文档和符号层按层内相关性合并，返回源路径与行号；这些定位帮助回源，排序分不是正确率。

自动注入挂在 agent/pre-step，调用 next 后仅处理 enter 决策；注入出错返回原决策。它先检查会话工作目录根护栏，再加载项目与全局记忆，避免在家目录误建记忆和审计。TaskBridge 使用宿主结构化事件并只收项目内相对路径，任务步骤接管可追加 todo/write。可借鉴的是工具、注入与任务共用根解析，但全局可见性、宿主事件格式和可写存储必须一起理解，不能仅凭目录分开就声称安全隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/query-memory.js:89-139](https://github.com/00080000/dsh-project-memory/blob/26389e6750ac3c363712435840a2b670e4d1e97d/src/tools/query-memory.js#L89-L139)

真实执行入口验证根、绑定任务并组合项目和全局层。

<details>
<summary>查看原文（51行）</summary>

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

      const queries = cfgValue(config, 'llmQueryExpansion')
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
      // 一次 recall 覆盖全部层：doc/symbol/experience/insight 共用同一个检索核心（src/recall.js）。
      const recalled = recallItems({
        store,
        globalStore,
        queries,
        boundTaskId,
        limit,
        rerank,
        layers: [
          ...(wantMemory ? (type === 'symbol' ? ['symbol'] : type === 'doc' ? ['doc'] : ['doc', 'symbol']) : []),
          ...(wantInsight ? ['insight'] : []),
          ...(type === 'all' || type === 'experience' ? ['experience'] : []),
        ],
      })
```

</details>

**依据 2 · 源码核查**：[src/tools/query-memory.js:159-198](https://github.com/00080000/dsh-project-memory/blob/26389e6750ac3c363712435840a2b670e4d1e97d/src/tools/query-memory.js#L159-L198)

分层合并与引用输出均在结果构造路径。

<details>
<summary>查看原文（40行）</summary>

```text
      if (wantMemory) {
        // doc/symbol 的原始 BM25 分不可直接比：符号正文短，同等相关时分会更高/更低，
        // 用原始分排序会让一层把另一层整体挤掉。先按**层内相对分 rel** 排序，并在
        // limit≥2 时各保留一条，剩余名额再按 rel 填。
        const docHits = recalled.layers.find((l) => l.layer === 'doc')?.hits || []
        const symbolHits = recalled.layers.find((l) => l.layer === 'symbol')?.hits || []
        const byRel = (a, b) => (b.rel || 0) - (a.rel || 0) || (b.weightedScore || 0) - (a.weightedScore || 0)
        const merged = [...docHits, ...symbolHits].sort(byRel)
        const picked = []
        const seenHits = new Set()
        const take = (h) => {
          if (!h || picked.length >= limit) return
          const key = h.item?.id || `${h.item?.type}:${h.item?.title}`
          if (seenHits.has(key)) return
          seenHits.add(key)
          picked.push(h)
        }
        if (limit >= 2) {
          for (const h of [docHits[0], symbolHits[0]].filter(Boolean).sort(byRel)) take(h)
        }
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
```

</details>

**依据 3 · 源码核查**：[src/auto-inject.js:626-651](https://github.com/00080000/dsh-project-memory/blob/26389e6750ac3c363712435840a2b670e4d1e97d/src/auto-inject.js#L626-L651)

waterfall接线仅处理enter并在注入失败时退化。

<details>
<summary>查看原文（26行）</summary>

```text
export function installAutoInject(ctx, config) {
  const auto = (config && config.autoContext) || {}
  if (auto.enabled === false) return
  const cfg = cfgEngine(config)
  // 审计配置同 cfg：安装时解析一次（与 autoContext 其余开关一致）。
  const audit = cfgAudit(config)
  const shadow = cfgShadow(config)
  const sessions = new InjectionSessions()

  installCallObserver(ctx, sessions)
  if (typeof ctx.effect === 'function') {
    ctx.effect(() => () => sessions.clear())
  }
  ctx.on('agent/pre-step', async (payload, next) => {
    // 宿主契约是 waterfall(payload, next)，next 一定存在；但宿主版本漂移或事件被当普通事件调用时，
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

**依据 4 · 源码核查**：[src/auto-inject.js:673-706](https://github.com/00080000/dsh-project-memory/blob/26389e6750ac3c363712435840a2b670e4d1e97d/src/auto-inject.js#L673-L706)

注入前统一根策略并加载global，支持作用域边界判断。

<details>
<summary>查看原文（34行）</summary>

```text
async function injectForStep({ payload, decision, config, cfg, audit, shadow, sessions }) {
  const session = payload && payload.agent && payload.agent.session
  // 与工具侧同一口径的「当前工作目录」：0.2.1+ 走 workingDirectory 投影（cd 后会变），老宿主回退
  // header.cwd。少了这一步，cd 之后审计与懒索引会落在两个不同的 store 里。
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

  // 意图是**会话状态**：先看本步 delta 有没有新人类消息，没有则回退本会话最后一条。claimed delta
  // 中段通常只有 tool result / 子代理报告 / job 通知，拿它们当查询就是"这步在做什么"用错了来源。
  const deltaHuman = lastUserText(decision.messages)
  const rememberedHuman = sessions.humanText.peek(sessionId) || ''
  const query = deltaHuman || rememberedHuman
  const querySource = deltaHuman ? 'delta' : rememberedHuman ? 'session' : 'none'
  const memoryRoot = memoryRootFor(root, config.memoryDir)
  const store = new ProjectMemoryStore(memoryRoot).load()
  const globalStore = new GlobalStore(cfg.globalFile || defaultGlobalFile()).load()
  const boundTaskId = store.getBoundTaskId(sessionId)
  const task = boundTaskId ? store.getTask(boundTaskId) : null

  // 两个窗口合并进同一个就绪上下文：人类消息（先发）+ 已观察动作（反应）。动作平面**只**从结构化
  // tool/call 归一，不再把全部参数拼成 actionText（那会把 subagent 提示词/remember 正文当成动作）。
```

</details>

**依据 5 · 源码核查**：[src/setup/taskbridge.js:58-90](https://github.com/00080000/dsh-project-memory/blob/26389e6750ac3c363712435840a2b670e4d1e97d/src/setup/taskbridge.js#L58-L90)

文件归属检查与任务步骤写回宿主是具体接线。

<details>
<summary>查看原文（33行）</summary>

```text
/** 把工具参数里的文件路径归一化为项目相对路径；项目外返回 null。 */
export function normalizeRelFile(root, file) {
  if (typeof file !== 'string' || !file) return null
  const abs = path.isAbsolute(file) ? file : path.resolve(root, file)
  const rel = path.relative(root, abs)
  if (!rel || rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) return null
  return rel.split(path.sep).join('/')
}

/** content 可能是字符串或 ContentBlock[]，统一取首段文本。 */
export function firstTextOf(content) {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    for (const b of content) {
      if (b && typeof b.text === 'string' && b.text.trim()) return b.text
    }
  }
  return ''
}

/**
 * 反向接管：任务成为某会话绑定后，把任务步骤推成宿主 todo/write 快照，
 * 让 dsh 渲染的任务清单（UI/投影）变成我们这套任务的步骤。
 * 规则：任务没有步骤时不推（避免误清模型手头正在用的宿主清单）。
 * @returns {boolean} 是否实际推送
 */
export function adoptStepsToSession(session, task) {
  if (!session || typeof session.append !== 'function') return false
  const steps = Array.isArray(task?.steps) ? task.steps : null
  if (!steps || steps.length === 0) return false
  const todos = steps.map((s) => ({ content: String(stepContent(s)), status: stepStatus(s) }))
  session.append('todo/write', { todos })
  return true
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相关性与保存状态能否证明记忆仍正确且已持久化？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。查询输出中的 status 默认 exact 在源码注释中明确是状态机落地前的占位，不是针对当前文件与结论的新验证。符号定位能帮助读者检查来源，却不保证旧经验适用于当前任务。自动注入的向量分也只是改变排序；实现保留词法门控并在向量异常时降级，作者在注释里还指出余弦与真值区间重叠。这些支持保守检索设计，不能支持自动信任全部召回。

保存也存在接受与持久完成的区分。store.save 在建目录或获取目录锁失败时返回 false、保留脏状态并安排重试；commit 执行变更后调用 save，但返回变更函数结果，不传递 save 的布尔结果。remember 依据 result.ok 返回 Saved 或 Updated existing。因此成功文字只能证明变更被接受，不能独立证明进程崩溃前已持久化；后台重试与退出刷新是缓解，并非跨进程读回确认。试用者应在重要经验写入后新进程读回，并保留原笔记。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/query-memory.js:184-192](https://github.com/00080000/dsh-project-memory/blob/26389e6750ac3c363712435840a2b670e4d1e97d/src/tools/query-memory.js#L184-L192)

exact的占位说明紧邻实际输出。

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

**依据 2 · 源码核查**：[src/auto-inject.js:303-324](https://github.com/00080000/dsh-project-memory/blob/26389e6750ac3c363712435840a2b670e4d1e97d/src/auto-inject.js#L303-L324)

向量融合限定为重排，异常回退，不是正确性保证。

<details>
<summary>查看原文（22行）</summary>

```text
  const corpus = cands.map((it) => insightScoringText(it))
  // 查询与覆盖率文本用**同一个**过滤后的查询：否则缩写会在 BM25 里被剔除、却仍计入覆盖率。
  const scored = rankEntriesMergedScored(cands.map(insightToEntry), [q], cands.length)
  // ---- 向量重排（可选、默认关闭）：只改**排序**与 `relative` 那一关，绝不碰 support/coverage/thin ----
  // 实测（8 场景/24 条池）expect 为空的对照场景纯向量 top-1 = 0.38，多条真命中只有 0.20~0.38，
  // 余弦与真值区间重叠 → 任何绝对余弦阈值要么放过对照、要么杀掉真命中；所以闸门继续由词法决定。
  // `rerank.score` 返回 Map<insightId, cos∈[0,1]>；**查询无法编码时应返回空 Map**——排序退化回纯词法。
  if (rerank && typeof rerank.score === 'function') {
    const alpha = Math.max(0, Math.min(1, typeof rerank.alpha === 'number' ? rerank.alpha : 0.5))
    let cos = null
    try { cos = rerank.score(q, cands) } catch { cos = null } // 向量层任何异常都不得影响注入
    const top0 = scored[0]?.score || 1
    for (const r of scored) {
      const v = cos instanceof Map ? cos.get(r.entry.insightId) : undefined
      const has = typeof v === 'number' && Number.isFinite(v)
      // 先留一份**未融合**的 BM25 原分：影子记录的 `rel` 必须继续是词法相对分，否则离线重放会被融合分污染。
      r.bm25 = r.score
      r.vector = has ? v : null
      // 有向量分的：归一后词法分与余弦按 α 混合；没有的只保留归一后词法分（缺向量不等于不相关）。
      r.score = has ? (1 - alpha) * (r.score / top0) + alpha * v : r.score / top0
    }
    scored.sort((a, b) => b.score - a.score)
```

</details>

**依据 3 · 源码核查**：[src/store.js:905-942](https://github.com/00080000/dsh-project-memory/blob/26389e6750ac3c363712435840a2b670e4d1e97d/src/store.js#L905-L942)

保存失败保留dirty并返回false。

<details>
<summary>查看原文（38行）</summary>

```text
      if (!dirReady) {
        try {
          mkdirSync(this.dir, { recursive: true })
        } catch {
          this.lastSaveOk = false
          trackDirty(this)
          this._scheduleSaveRetry()
          return false
        }
        this._storeDirReady = true
        this._shardsDirReady = false
        this._formatWritten = false
      }
    }
    // 崩溃遗留的 *.tmp 无论有没有脏数据都顺手清掉（两次 readdir，自带 try/catch）
    this.cleanStaleTmp()
    // 无脏数据也要补自我忽略：老版本建出来的 store 会在下一次 save 时补上。
    this.ensureSelfIgnore()
    if (!dirty) {
      this.lastSaveOk = true
      untrackDirty(this)
      return true
    }
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

**依据 4 · 源码核查**：[src/store.js:1479-1488](https://github.com/00080000/dsh-project-memory/blob/26389e6750ac3c363712435840a2b670e4d1e97d/src/store.js#L1479-L1488)

commit忽略save结果而返回变更结果。

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

**依据 5 · 源码核查**：[src/tools/remember.js:61-72](https://github.com/00080000/dsh-project-memory/blob/26389e6750ac3c363712435840a2b670e4d1e97d/src/tools/remember.js#L61-L72)

成功回报取决于result.ok而非持久化回执。

<details>
<summary>查看原文（12行）</summary>

```text
      let result
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

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些使用负担与结果证据足以支持试用，能推导什么验证方向？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

可在单一、可备份的项目中有限试用，先使用按需查询，保留人工交接笔记与原文件；确认项目根、任务绑定和新进程读回一致后再考虑自动注入。直接索引不调用模型，但检索扩展可额外调用模型，注入内容也占后续上下文预算，因此不能把无模型索引写成总成本为零。全局条目、自动覆盖和删除需要人工复核，不适合直接作为无人值守任务的唯一知识来源。

待验证方向是给写入结果展示已接受、待持久化和读回确认状态，并给引用补当前来源是否变化的信息。推导来自 commit 返回值与 exact 占位的两个不同歧义，不是已有能力。最小对照在副本项目中制造锁竞争、写入后退出和源文件改动，比较现有文本回报与显式状态回报下使用者误信次数、恢复时间及有效续接率；若状态提示不减少误信，或核对负担大于改善，则否定方向。真实宿主加载和目标代码执行不在本次范围。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:47-69](https://github.com/00080000/dsh-project-memory/blob/26389e6750ac3c363712435840a2b670e4d1e97d/README.md#L47-L69)

项目与global存储位置、显式写入与删除语义决定维护和退出负担。

<details>
<summary>查看原文（23行）</summary>

```text
Each indexed project has its own store at `<root>/.dsh-project-memory/`. It keeps itself out of git by default — there is nothing to add to your `.gitignore`. Global-scope entries are kept outside the project in `~/.config/dsh-project-memory/global.json`; point `insight.globalFile` elsewhere to move it.

## Usage

The tools below are **invoked by the agent**, not typed by the user. In the chat, just ask naturally — e.g. "index this project" or "what does the auth module do?" — or simply keep working, and the agent calls the matching tool automatically. By default files are indexed the moment the model reads them, so memory fills in while you work. `watch_repo` keeps explicitly-watched roots fresh in the background; `index_repo` forces a full backfill (unchanged files are skipped).

In a git work tree the corpus is whatever `git ls-files --cached --others --exclude-standard` lists — tracked files plus untracked files that are not ignored — so `.gitignore`, nested rules included, decides what gets remembered. Hidden paths (any path segment starting with `.`) and the built-in ignore list (`node_modules`, `dist`, …) are skipped in both modes; a directory that is not a git work tree falls back to a plain walk with the same filter. Lazy indexing applies the same check when a file first enters the store; a file that is already indexed is refreshed on later reads without asking git again — if `.gitignore` starts excluding it, the `index_repo` / `watch_repo` scan drops it. An explicit `index_doc` bypasses both `.gitignore` and the hidden-path filter, but still respects `roots.exclude`, readability and the size limit, and its entry survives later scan passes for as long as the file exists.

| Tool | Purpose |
|---|---|
| `index_doc file_path` | Index one document (PDF/MD/txt): chunk, summarize deterministically, and store with a `path:line` citation. Unchanged files are skipped. |
| `index_repo root` | Index a whole project: documents get deterministic summaries, code files get a token-free symbol table. Incremental and self-healing: the store follows the file listing, so deleted, ignored or moved files are dropped (an entry created by an explicit `index_doc` is kept while its file still exists), and documents are cross-linked to symbols. A non-existent or excluded root is rejected before anything is written. |
| `watch_repo root` | Enable automatic refresh: a background poll detects new and changed files and re-indexes only those. A watched root is recorded in that project's store, so it resumes when dsh starts there; a non-existent or excluded root is refused, roots that disappear are dropped rather than re-created. |
| `memory_stats root` | Show what the store contains: totals, last index time, and the per-file list sorted by recency. Background index failures (watch or lazy, per root, most recent 50) are reported alongside, so a file that never made it into the corpus stays visible. |
| `query_memory query` | Ranked search over documents, symbols, experience and insights, optionally query-expanded by the LLM. `type` selects a layer (`all` / `doc` / `symbol` / `experience` / `insight` / `task`). Returns hits with relative scores, sources or insight ids, and doc→symbol references. |
| `list_tasks` | List task records for the project (archived marked). Call first in a new session before continuing work. |
| `select_task` | Bind the session to a task so its todo list and file reads sync into it. Exact `taskId`, or exact `title` (multiple matches return candidates; no match creates a new task). Pass `title` with `taskId` to rename. Auto-unarchives. |
| `archive_task` | Archive a task (hide from default views, exclude from capacity, stop syncing). `select_task` restores it. |
| `show_task_panel` | Show the task panel in the UI. Call when the user asks to see the task list or when you want to display the panel. |
| `/tasks` (typed by the user, not the model) | The only user command: shows the task stack and drives the workflow card. Every other action is a **sub-verb** invoked by card buttons: `switch` / `archive` / `unbind` / `rename` / `todos …` / `step` / `step-move` / `step-text` for tasks, `insight list [scope] [offset] [limit]` / `confirm` / `promote` / `demote` / `archive` / `restore` / `delete` / `save` / `edit` for memory. |
| `remember problem solution` | Save an experience note. It is a `kind: 'experience'` insight — same store, same dedup and same delete path as lessons / decisions / procedures. Similar problems merge or overwrite instead of duplicating. |
| `forget id_or_query` | Delete memories — lessons / decisions / procedures and experience notes alike, across task / project / global in one call, without knowing which layer the entry lives in. An exact id deletes that one entry; keywords match by **query-side coverage** (matched query terms ÷ query terms). Real deletion, no undo; when keywords match more than the cap (default 10) it deletes nothing and only lists the candidates. The **5** most recently deleted entries are kept as full entries in that layer's `deleted.json` next to its store (`<root>/.dsh-project-memory/deleted.json` for the project layer, beside the global file for global), and the deletion result prints that path — read it and save again to recover a mis-delete. |
| `save_lesson` | Save a lesson / decision / procedure at task, project or global scope; passing `id` **overwrites that entry in place** (only the fields you pass, the previous values stay in `prev` — write them back with the same id). Before writing it compares against existing memory: cosine ≥ 0.9 auto-overwrites that entry, ≥ 0.7 reports the nearest id in the result; without `leanvec` it falls back to lexical overlap ≥ 0.7 merge / 0.65–0.7 reinforce. Two tasks hitting the same insight promote it task → project, three or more → global. Key params: `id`, `title`, `kind`, `scope`, the content (`pattern`/`fix`, `choice`/`reason` or `steps`), and `trigger` (`when` is the only trigger surface, `guard` narrows it, `prevents` records what breaks without it). |
```

</details>

**依据 2 · 作者声明**：[README.md:103-106](https://github.com/00080000/dsh-project-memory/blob/26389e6750ac3c363712435840a2b670e4d1e97d/README.md#L103-L106)

作者说明查询扩展、并发锁和静默失败重试。

```text
- **Incremental** — a content hash per file; only changed files are re-extracted.
- **Cross-linking** — a returned document chunk resolves the symbols it mentions against the **current** symbol table and appends them as `references`, so a doc indexed before its symbols still links correctly.
- **Query expansion** — when enabled, `query_memory` asks the LLM to rewrite the query into several variants (synonyms, EN/CN, identifier guesses) and merges the scores; when off, queries never touch the LLM. Indexing itself is model-free.
- **Consistency** — the fact layer follows the codebase (hash re-extract / remove-on-delete); experience entries are updated through the same supersede and `forget` paths as other insights. Writes take a cross-process directory lock (`.write.lock`) around a short read-modify-write, so two dsh instances can share one project store: shards converge by `indexedAt`, a save that cannot get the lock is retried and flushed again at exit, failures stay silent by default (`DSH_PROJECT_MEMORY_DEBUG=1` prints one diagnostic line), and entries deleted by another process are not resurrected by a stale in-memory snapshot.
```

**依据 3 · 源码核查**：[package.json:72-117](https://github.com/00080000/dsh-project-memory/blob/26389e6750ac3c363712435840a2b670e4d1e97d/package.json#L72-L117)

宿主版本范围、Web客户端和可选向量包属于启动条件声明。

<details>
<summary>查看原文（46行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-llm": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.2.0-0 || >=0.1.1-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.2.0-0 || >=0.1.1-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/schemastery": "^3.18.3",
    "typescript": "^5.0.0 || ^6.0.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/cordis": {
      "optional": true
    },
    "@deepseek-ai/dsh-tools": {
      "optional": true
    },
    "@deepseek-ai/schemastery": {
      "optional": true
    },
    "@deepseek-ai/dsh-llm": {
      "optional": true
    },
    "typescript": {
      "optional": true
    }
  },
  "dsh": {
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
  }
```

</details>

**依据 4 · 源码核查**：[src/store.js:1479-1488](https://github.com/00080000/dsh-project-memory/blob/26389e6750ac3c363712435840a2b670e4d1e97d/src/store.js#L1479-L1488)

回执分层假设依据真实保存接口。

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

#### 缺口

- 缺少合格续接任务的现金、资源和人工测量。
  **影响**：不能给单位任务成本或节约比例。
  **进一步探讨**：在同输入、同模型下记录全部重试、回源和人工时间，并按合格续接数计量。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
