# @yolk_vat-y/dsh-project-memory

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[f5aa9dc](https://github.com/00080000/dsh-project-memory/tree/f5aa9dcfd815edf4256e619648e9455889b316a7)

<!-- BEGIN META -->
[![GitHub ★ 25](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=25&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) [![npm 30d 3,686](https://img.shields.io/static/v1?label=npm+30d&message=3%2C686&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)
<!-- END META -->

> **实现功能**：为DSH项目持久保存任务、文档、代码符号与经验，支持检索和自动上下文注入。

> **核心亮点**：从静态笔记扩展为任务绑定、索引和经验召回组合，减少重新组织入口的潜在负担，但不保证减少错误。见 [Q01](#research-q01)。

> **风险与缺陷**：相关性命中不证明条目仍正确，global可见性和模型看不到source元数据要求更强回源；内存更新也不能替代成功落盘。见 [Q03](#research-q03)。

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
  - [Q01 · 项目记忆相对AGENTS和人工任务记录增加什么？](#detail-section-11)
  - [Q02 · 任务、索引、召回和自动注入怎样接线？](#detail-section-12)
  - [Q03 · 来源分级和持久化能否保证正确记忆被适时使用？](#detail-section-13)
  - [Q04 · 采用需要支付哪些索引、存储和维护成本？](#detail-section-14)
  - [Q05 · 可借鉴什么，怎样检验并决定使用范围？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合跨会话开发同一项目并愿意维护记忆的人；合格结果是准确回源和续接任务。人工笔记及grep对照见 [Q01](#research-q01)。

人工AGENTS/任务笔记、grep和无记忆重读；未作模型质量或记忆算法效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| TaskBridge与任务管理 | 跨会话续接步骤和文件 | 依赖项目根与会话事件 |
| 文档/代码索引 | 建立可回源项目材料 | 解析范围和文件时效需核对 |
| query_memory | 召回事实/经验/任务 | global层跨项目可见，得分非正确性 |
| 自动注入 | 在触发时加入上下文 | 内容需审阅，预算和来源提示有限 |
| 记忆存储 | 保存任务与经验 | 锁超时仍可能pending |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH tools/llm | 必需 | 工具和事件接线 | 不保证注册 |
| 可写项目存储 | 持久化必需 | 任务与索引 | 写入可pending，需检查 |
| PDF解析/TypeScript增强 | 对应功能需用 | 文档/符号处理 | 相关能力降级或不可用 |
| leanvec/LLM扩展 | 可选路径 | 重排/查询扩展 | 词法替代或不扩展，成本不同 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户备份并确认工程根/global范围 | 不索引错误目录 |
| 2 | 小范围索引并按需query_memory | 引用可回当前原文 |
| 3 | 选择任务核对todo与文件 | 不误覆盖当前步骤 |
| 4 | 逐步启用注入并检查保存重启 | 无串项目/误指令，落盘明确 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 索引磁盘、解析器/可选向量表 | 确认根、范围和全局层 | 大项目首建资源未知 |
| 持续使用 | I/O、内存、注入上下文；可选LLM扩展 | 审核经验、回源和删除过期内容 | 总调用及纠错时间未知 |
| 失败恢复 | 重试写入/重建索引 | 检查目录锁、脏状态和落盘 | 崩溃/并发恢复未实测 |
| 迁移退出 | 项目及global存储备份 | 明确范围再禁用/迁移 | 未验收退出与数据迁移 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 任务续接 | 持久任务与todo接管 | 实际减少重新定界时间 |
| 多层召回 | 限根、task/global和可选扩展 | 当前事实正确率与遗漏 |
| 自动记忆使用 | trigger/提示通道与预算 | 对最终任务的净收益 |

> **思考**：相关性命中不证明条目仍正确，global可见性和模型看不到source元数据要求更强回源；内存更新也不能替代成功落盘。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：从静态笔记扩展为任务绑定、索引和经验召回组合，减少重新组织入口的潜在负担，但不保证减少错误。见 [Q01](#research-q01)。

从静态笔记扩展为任务绑定、索引和经验召回组合，减少重新组织入口的潜在负担，但不保证减少错误。见 [Q01](#research-q01)。

分层职责、跨进程锁和显式持久化状态可复用；跨项目可见性、事件归属与经验时效需要持续管理。见 [Q03](#research-q03) 与 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

相关性命中不证明条目仍正确，global可见性和模型看不到source元数据要求更强回源；内存更新也不能替代成功落盘。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议单一非敏感工程小范围试用，先按需查询和回源，后逐步开启自动注入；串项目和未落盘等停止标准见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

任务桥、召回和持久化有源码支持；任务收益、跨项目误用和崩溃恢复未独立验证；时效核对是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.js、src/setup/taskbridge.js、src/tools/query-memory.js、src/auto-inject.js、src/store.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定入口、TaskBridge、query_memory、auto-inject通道和store锁/flush；未逐项覆盖全部解析器、UI、向量实现与真实大项目。
- 下一步：已检查源码；未执行目标代码、作者测试、真实宿主或大项目效果实验。

**分析版本**

- **仓库**：[00080000/dsh-project-memory](https://github.com/00080000/dsh-project-memory)
- **版本号**：0.6.5（[固定提交 f5aa9dc](https://github.com/00080000/dsh-project-memory/tree/f5aa9dcfd815edf4256e619648e9455889b316a7)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为在经验召回后核对当前代码约束与时效，显式标注冲突；三组任务对照与否定条件见 [Q05](#research-q05)。

已检查源码；未执行目标代码、作者测试、真实宿主或大项目效果实验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 2577 | — | — | 56680 |
| .js | source | 56 | 16577 | 11931 | 4040 | — |
| .mjs | source | 8 | 1683 | 1384 | 180 | — |
| .ts | source | 10 | 1449 | 1020 | 342 | — |
| .tsx | source | 5 | 1619 | 1370 | 166 | — |
| .mjs | test | 48 | 11394 | 9165 | 1366 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对项目记忆的任务/召回/注入链路，区分可追溯机制与真实任务收益。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 项目记忆相对AGENTS和人工任务记录增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是跨会话反复进入同一代码项目、需要继续任务及过去决策的开发者。合格交付是准确找回相关事实与出处、当前任务步骤和文件，再回源核对，而不是索引更多条目。相对人工AGENTS/任务笔记，插件将宿主todo和文件事件转成持久任务，并按文档、符号、经验与分层insight检索；相对普通全文grep，增加任务绑定、经验召回和按需注入。作者报告的节省和“避免重犯”尚需同任务效果对照，词法/向量得分不是事实正确性证明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-27](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/README.md#L10-L27)

作者列出项目开发记忆和多层能力。

<details>
<summary>查看原文（18行）</summary>

```text
A persistent **project development memory** for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) agents. Built specifically for project development, natively integrated with dsh's task system: task lists and files read during a session are automatically persisted as cross-session task records, with tasks ↔ files linked — workflows can be switched and resumed, no need to re-scope the whole project, solving context loss. Documents (PDF/Markdown/txt) and code symbols are stored separately per workspace; documents are automatically cross-linked to the code symbols they mention. Experience notes (problem → solution) are automatically deduplicated, preventing repeated mistakes. All data is stored per project on disk, survives session compaction and handover; recalls include `path:line` citations for source verification. No native builds, no vector database. A 79 MB local embedding table (`leanvec`) installs and runs by default; without it, recall falls back to pure lexical.

> The plugin keeps a compact project **memory** on disk, with every entry pointing to a concrete file and line — the agent can reorient quickly instead of re-reading the whole project.

![Task panel: task list, step progress, and involved files](docs/images/image.png)

## Features

- **TaskBridge: cross-session development tasks** — the session's todo list and the files it touches are persisted as per-project task entities, so a workflow can be switched and resumed without re-scoping the project. Associated files stay in recency-weighted order (a read never outranks a written file), so a resumed session sees where to look first. New sessions continue with `list_tasks` → `select_task`. Work delegated to subagents creates no task. On hosts without session events the task tools still work as a plain record list.
- **Task panel and editing** — draggable cards show a task's steps and files, and can collapse to a mini-bar or be hidden. Title, steps and status can be edited inline, writing back through the same path as model updates; four visual themes change material, geometry, typeface and density only, and colours follow the host. The panel stays hidden until summoned, syncs in the background on session switch, never reopens itself after a refresh, and a render failure cannot take down the host.
- **Document memory** — PDF, Markdown and plain text are chunked and summarized without a model call. Each entry keeps a short summary for injection, a bounded term set for recall, and a citation back to the source.
- **Code symbol memory** — a dependency-free scanner extracts functions, classes, methods, interfaces and type aliases with full signatures across 8 languages. Where `typescript` is installed, an optional second layer adds inferred return types, generics and interface shapes; it runs in the background and never blocks indexing.
- **Automatic, read-time memorization** — a file is memorized the moment the model reads it, so memory is a byproduct of normal work rather than an upfront scan, and files nobody reads are never indexed. A background poll re-memorizes changed files only.
- **Doc ↔ code cross-linking** — a document that mentions a symbol is surfaced when that symbol is queried. Links are resolved against the current symbol table, so they cannot go stale.
- **Hybrid recall** — ranked search over documents, symbols, experience notes and insights, with optional LLM query expansion. The experience/insight layers are re-ordered by cosine when `leanvec` is present — installed by default, absent ⇒ pure lexical. Tuned for CJK: phrase boost, a synonym table, and CJK-aware boundaries for doc↔symbol linking.
- **Experience notes** — problems → solutions, deduplicated by overlap rather than repeated, bounded by project size, and surfaced both by search and by the same injection path as lessons.
- **Tiered insight memory (lessons / decisions / procedures)** — one entity across task, project and global scope. Near-duplicates merge or reinforce, and promotion moves an entry between scopes instead of copying it. Use is recorded, so decay and capacity rank by activity rather than age alone. The panel exposes a per-scope view for reviewing and editing entries. That list is ordered newest-first and loaded incrementally: 30 entries at a time, with the next page prefetched before the reader reaches the bottom and off-screen rows skipped by the renderer, so a large memory stays responsive.
- **Triggered injection** — an insight may carry an authored trigger: only `when` triggers, `guard` narrows it, and `prevents` records what breaks without the entry. Corpus text can never trigger an injection; the statistical channel is gated separately and silent by default. **Evidence is graded by source**: only host facts (structured tool calls, `fs`/`todo` events) and irreversible actions named by the human (commit / publish / release / push / deploy / go public) can inject full text; prose mentions of delete / clean up / render / benchmark only feed the hint channel, and subagent prompts plus notice-shaped messages never count as actions — in one real session they produced 72% of all injected characters.
```

</details>

**依据 2 · 源码核查**：[src/index.js:202-247](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/index.js#L202-L247)

任务、索引、召回、经验及注入入口实际注册。

<details>
<summary>查看原文（46行）</summary>

```text
  // TaskBridge：任务实体 + 宿主 todo 同步
  setupTaskbridge(ctx, config)
  // 用法本身也是记忆的一部分：注册成宿主 skill（可选依赖，没有 skills 服务就静默跳过）。
  setupSkill(ctx)
  // 跟踪会话路由（request/header 事件），为无会话上下文的召回期可选 LLM（查询扩展 / 反思）兜底
  ctx.on('session/event', (session, event) => {
    if (event?.type === 'request/header') rememberRoute(session)
    // 会话活跃信号：有人正在跑回合时把 watch 轮询压到最低，回合结束立刻补扫一次（见 watch.js）。
    // 这是"轮询只在空闲时发生"的落点 —— 交互期间把 I/O 全让给模型，停下那一刻才整理索引。
    const key = session?.id ?? 'unknown'
    if (event?.type === 'turn/start' || event?.type === 'step/start') watchManager.setSessionActive(key, true)
    else if (event?.type === 'turn/end') watchManager.setSessionActive(key, false)
  })
  // 会话被销毁时也要摘掉活跃标记：否则一个没有正常 turn/end 的会话会把轮询**永久**压在兜底节拍
  // （不会卡死，但"空闲时高速刷新"再也不会回来）。
  ctx.on('session/disposed', (session) => {
    watchManager.setSessionActive(session?.id ?? 'unknown', false)
  })
  ctx.tools.register(listTasksTool(config))
  ctx.tools.register(selectTaskTool(config, { llm: ctx.llm, ctx }))
  ctx.tools.register(archiveTaskTool(config, { llm: ctx.llm, ctx }))
  ctx.tools.register(showTaskPanelTool(config))

  // /tasks：唯一的用户命令（合并自原 /tasks、/task、/insight —— 宿主命令只要注册就会
  // 出现在 `/` 菜单的「指令」组里且无法隐藏，三条命令就是三行去不掉的原始行）。
  // 切换/归档/审核等动作作为子动词，由面板按钮经 remote.commands.execute 驱动。
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

  // PR 2：注册 agent/pre-step 监听，向每步请求的 enter 决策追加记忆消息（默认开；
  // 任何异常/无会话 cwd → 交回默认决策，零副作用）
  installAutoInject(ctx, config)
```

</details>

#### 缺口

- 没有独立跨会话任务质量与重读成本对照
  **影响**：无法把记忆存在推为节时和少犯错
  **进一步探讨**：固定工程任务比较人工笔记、grep与插件，记录过期引用、最终正确率和复核时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 任务、索引、召回和自动注入怎样接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

TaskBridge按项目根分配存储，工具文件路径归一成项目相对路径，项目外路径不加入；任务接管可把持久步骤推回宿主todo，并区分宿主子代理而非简单看parentSession。query_memory校验根实际存在、拒绝空查询，绑定task级insight可见性而global层始终可见；可选LLM扩展会增加调用，未开启则只用原查询。自动注入默认启用，定义全文trigger与统计提示两通道；来源标识与预算/自激过滤是重要机制，但不是记忆内容真实的证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/setup/taskbridge.js:47-64](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/setup/taskbridge.js#L47-L64)

根归属和项目内路径约束。

<details>
<summary>查看原文（18行）</summary>

```text
export function projectRootFor(cwd, config) {
  return resolveProjectMemoryRoot(cwd || process.cwd(), config)
}

/** 没有可用项目根时返回 `{ root: null, store: null }`，调用方据此整段跳过。 */
export function taskStoreFor(cwd, config) {
  const root = projectRootFor(cwd, config)
  if (!root) return { root: null, store: null }
  return { root, store: new ProjectMemoryStore(memoryRootFor(root, config.memoryDir)).load() }
}

/** 把工具参数里的文件路径归一化为项目相对路径；项目外返回 null。 */
export function normalizeRelFile(root, file) {
  if (typeof file !== 'string' || !file) return null
  const abs = path.isAbsolute(file) ? file : path.resolve(root, file)
  const rel = path.relative(root, abs)
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return null
  return rel.split(path.sep).join('/')
```

</details>

**依据 2 · 源码核查**：[src/setup/taskbridge.js:78-107](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/setup/taskbridge.js#L78-L107)

todo写回与子代理区分。

<details>
<summary>查看原文（30行）</summary>

```text
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

**依据 3 · 源码核查**：[src/tools/query-memory.js:88-125](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/tools/query-memory.js#L88-L125)

查询根、空串、task/global可见性及向量层。

<details>
<summary>查看原文（38行）</summary>

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
      // 一次 recall 覆盖全部层：doc/symbol/experience/insight 共用同一个检索核心（src/recall.js）。
```

</details>

**依据 4 · 源码核查**：[src/auto-inject.js:62-85](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/auto-inject.js#L62-L85)

自激身份识别与预算默认值。

<details>
<summary>查看原文（24行）</summary>

```text
export function isOwnInjection(source) {
  if (!source || typeof source !== 'object') return false
  return source.kind === SOURCE_KIND
    || source.kind === 'project-memory'
    || source.plugin === 'dsh-project-memory'
}

/**
 * 注入正文的最小可用长度：预算塞不下这么多就宁可不注入（记 dropped）。
 * 与其输出 `- [ins_xxx] procedure ` 这种 stub，不如保持沉默——stub 只消耗 token 不传递信息。
 */
const MIN_BODY_CHARS = { trigger: 48, hint: 120 }

/** 注入引擎配置：insight 默认之上叠加 autoContext 预算/门控参数。 */
export function cfgEngine(config) {
  const c = (config && config.autoContext) || {}
  const base = cfgInsight(config)
  return {
    ...base,
    maxTokens: typeof c.maxTokens === 'number' ? c.maxTokens : 400,
    entryMaxInsights: typeof c.entryMaxInsights === 'number' ? c.entryMaxInsights : 6,
    // 提示通道的相对阈值（层内最高分的比例）：尺度无关，取代旧的"绝对 overlap"常量。
    // 旧判据 normalizedTokenOverlap = |交集| / max(|A|,|B|) 对长消息必然趋零（实测 0.014–0.057）。
    signalMinRatio: typeof c.signalMinRatio === 'number' ? c.signalMinRatio : 0.5,
```

</details>

**依据 5 · 源码核查**：[src/auto-inject.js:290-314](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/auto-inject.js#L290-L314)

全文触发和统计提示不同职责。

<details>
<summary>查看原文（25行）</summary>

```text

/**
 * 通道 1：authored trigger 命中（确定性、全文、优先级 1）。procedure 先于其它 kind（步骤更完整）。
 * 准入化（S2）：只有 `when`（op / 写目标 / 意图词）能触发，guard 只能收窄；
 * **没有 `when` 的条目在这里永远不命中**（降级为可发现 + 按需拉取）。
 */
function collectTriggered(cands, ctx) {
  const hits = []
  for (const it of cands) {
    const why = matchTrigger(it.trigger, ctx)
    if (why) hits.push({ it, why })
  }
  hits.sort(
    (a, b) => (a.it.kind === 'procedure' ? 0 : 1) - (b.it.kind === 'procedure' ? 0 : 1)
      || String(a.it.id).localeCompare(String(b.it.id)),
  )
  return hits
}

/**
 * 通道 2：统计信号（提示态、优先级 2）。**双门槛**：层内相对阈值 + IDF 加权覆盖率（绝对下限）。
 * 查询只用「人类消息的意图文字 + 本次写目标」：原始工具参数不是查询文本，它们正是
 * `dcterms→rm`、`*.pptx→论文笔记` 那类假阳性的来源。被门槛拦下的记进 dropped，不静默。
 *
 * 可选的第三层：`rerank`（向量重排，默认关闭）。**职责严格分离**——闸门（支持度/覆盖率/共同词数）
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 来源分级和持久化能否保证正确记忆被适时使用？

**研究主题**：缺陷与关键质疑

#### 完整回答

最强质疑是“存下来并命中”与“在当前任务正确使用”之间的空隙。trigger确定性只相对于已编写的when/guard，不能证明条目仍正确；词法/余弦只排序相关性。global层始终可见会把跨项目复用责任交给作者与操作者，不能把项目目录当所有记忆的绝对隔离。注入消息source元数据在请求序列化中不向模型传递，正文抬头承担来源提示，模型仍可能误当当前人类指令。持久化目录锁超时返回false、保持脏状态并安排重试；若立即退出，不能将内存更新当已经落盘。源码有退出flush，但不是任意异常终止的可靠性证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/query-memory.js:108-124](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/tools/query-memory.js#L108-L124)

global可见与可选重排范围。

<details>
<summary>查看原文（17行）</summary>

```text
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

**依据 2 · 源码核查**：[src/auto-inject.js:29-50](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/auto-inject.js#L29-L50)

来源元数据与模型可见文本边界。

<details>
<summary>查看原文（22行）</summary>

```text
 * 注入块抬头里的插件名。
 *
 * 消息的 `source.kind`（= {@link SOURCE_KIND}）只有宿主看得到：请求序列化只取 `role` 与
 * `content`（provider 侧对 `.source` 零引用），所以模型从元数据里读不到"这是谁注入的"。
 * 抬头是**唯一**能让模型（和 GUI 里的用户）看见生产者的地方。抬头不是行为契约：
 * 客户端不解析它，判据也不读它。
 */
export const PLUGIN_NAME = 'dsh-project-memory'

/**
 * 本插件在 `message.source` 上声明的生产者 kind。
 *
 * 会话格式 v4 起 `MessageSourceMap` 是「每个生产者声明自己的 kind」的可合并联合类型，
 * **没有** `plugin` 这个兜底 kind：宿主的 `assertV4MessageSources` / `assertV4SourceRowAdmission`
 * 会直接拒绝 `kind === 'plugin'` 的消息（`session-format-v3-to-v4/src/message-sources.ts`），
 * 而拒绝发生在编码落盘那一刻 —— 于是整轮运行失败。
 *
 * 值选 `plugin:<包名>` 是因为这正是宿主自己的 v3→v4 迁移对本插件历史消息的改写结果
 * （`rewritePluginSource`：第三方插件 → `plugin:${plugin}`，并丢弃 `plugin` 字段）。
 * 新写的消息与迁移后的旧消息因此是**同一个生产者身份**，自激闸门（见 isOwnInjection）不需要按新旧分叉。
 */
export const SOURCE_KIND = 'plugin:dsh-project-memory'
```

</details>

**依据 3 · 源码核查**：[src/auto-inject.js:290-314](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/auto-inject.js#L290-L314)

触发与统计判据不判断事实真伪。

<details>
<summary>查看原文（25行）</summary>

```text

/**
 * 通道 1：authored trigger 命中（确定性、全文、优先级 1）。procedure 先于其它 kind（步骤更完整）。
 * 准入化（S2）：只有 `when`（op / 写目标 / 意图词）能触发，guard 只能收窄；
 * **没有 `when` 的条目在这里永远不命中**（降级为可发现 + 按需拉取）。
 */
function collectTriggered(cands, ctx) {
  const hits = []
  for (const it of cands) {
    const why = matchTrigger(it.trigger, ctx)
    if (why) hits.push({ it, why })
  }
  hits.sort(
    (a, b) => (a.it.kind === 'procedure' ? 0 : 1) - (b.it.kind === 'procedure' ? 0 : 1)
      || String(a.it.id).localeCompare(String(b.it.id)),
  )
  return hits
}

/**
 * 通道 2：统计信号（提示态、优先级 2）。**双门槛**：层内相对阈值 + IDF 加权覆盖率（绝对下限）。
 * 查询只用「人类消息的意图文字 + 本次写目标」：原始工具参数不是查询文本，它们正是
 * `dcterms→rm`、`*.pptx→论文笔记` 那类假阳性的来源。被门槛拦下的记进 dropped，不静默。
 *
 * 可选的第三层：`rerank`（向量重排，默认关闭）。**职责严格分离**——闸门（支持度/覆盖率/共同词数）
```

</details>

**依据 4 · 源码核查**：[src/store.js:830-849](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/store.js#L830-L849)

锁超时、未持久化状态与合并。

<details>
<summary>查看原文（20行）</summary>

```text
    // 跨进程：整段读改写放进目录锁。默认同步等待 15s——写路径的正确性靠"等到锁"，
    // 不靠后台重试（用户结束对话就关 dsh）。真拿不到时保持脏状态并登记退出 flush；
    // 默认静默，不向用户/模型抛提示。
    const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : 15000
    const release = acquireDirLock(this.dir, { timeoutMs, ensureDir: false })
    if (!release) {
      this.lastSaveOk = false
      trackDirty(this)
      if (!this._lockWarned) {
        this._lockWarned = true
        debugPersistence(`[dsh-project-memory] store ${this.dir} is busy (another dsh process is writing); this write is pending.`)
      }
      this._scheduleSaveRetry()
      return false
    }
    let wroteInsights = false
    let wroteTasks = false
    try {
      // 先合并另一进程已落盘的小文档，再写；分片按“加载时 hash”做冲突检测。
      this._mergeAuxFromDisk()
```

</details>

**依据 5 · 源码核查**：[src/index.js:198-201](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/index.js#L198-L201)

退出flush是补救而非所有崩溃保证。

```text
  // 卸载/退出前把还脏着的 store 同步写一次（后台重试只是兜底，不能当正确性保证）。
  if (typeof ctx.effect === 'function') {
    ctx.effect(() => () => flushDirtyStores({ timeoutMs: 1500 }))
  }
```

#### 缺口

- 过期经验、跨项目global和提示注入的实际误用率未知
  **影响**：影响自动注入安全与任务收益
  **进一步探讨**：用过期/反例/他项目同名条目构造盲审任务，检查引用核实、误指令与最终改动

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用需要支付哪些索引、存储和维护成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

基础路径需要宿主tools/llm接口、可写项目存储与支持的文件解析。PDF解析有包依赖，可选leanvec默认安装会带来本地模型表资源，TypeScript增强和LLM查询扩展属于不同开销，不应统称零模型调用。持续读时索引与空闲watch降低预扫描负担，但项目修改、索引合并与自动注入仍消耗I/O、内存、上下文和人工纠错。失败恢复要检查save返回/落盘状态、目录锁及损坏副本，退出/迁移要保留项目与global两类存储。沒有同任务总调用和人工维护数据，不能把按内容hash增量直接换算ROI。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:61-90](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/package.json#L61-L90)

运行时、解析和宿主依赖。

<details>
<summary>查看原文（30行）</summary>

```text
    "@deepseek-ai/dsh-client-ui-slots": "0.2.1-rc.2",
    "@deepseek-ai/dsh-llm": "0.2.1-rc.2",
    "@deepseek-ai/dsh-tools": "0.2.1-rc.2",
    "@deepseek-ai/schemastery": "^3.18.2",
    "@tsdown/css": "0.22.14",
    "@types/react": "^18.3.31",
    "@types/react-dom": "^18.3.7",
    "lightningcss": "^1.33.0",
    "tsdown": "^0.22.14",
    "typescript": "^5.6.3"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-llm": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.2.0-0 || >=0.1.1-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.2.0-0 || >=0.1.1-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/schemastery": "^3.18.1",
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
```

</details>

**依据 2 · 源码核查**：[src/index.js:103-127](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/index.js#L103-L127)

自动注入预算与重复注入控制。

<details>
<summary>查看原文（25行）</summary>

```text
  autoContext: Schema.object({
    enabled: Schema.boolean().default(true),
    entryOn: Schema.boolean().default(true),
    maxTokens: Schema.number().default(400),
    entryMaxInsights: Schema.number().default(6),
    // 提示通道的相对阈值（层内最高分的比例）——出厂判据
    signalMinRatio: Schema.number().default(0.5),
    // resident 任务卡最多显示几个「编辑中」文件
    editedMax: Schema.number().default(3),
    // 记忆根是"推定"的（会话工作目录，且该目录没有项目标记）时，首次注入前通告模型
    // 根在哪、怎么改。状态声明，只发一次、不占条目额度。
    rootNotice: Schema.boolean().default(true),
    // 模型自己维护清单且之后没有新人类消息时，不把任务卡回声给模型
    skipEchoSelfTodo: Schema.boolean().default(true),
    // ⚠️ 旧兼容闸门，**刻意不给默认值**：cfgEngine 以「relevanceMin 是否为 number」选分支，
    // 一旦有默认值就会永远走旧的绝对 overlap 判据——而它对长消息实测只有 0.014~0.057，
    // 必然过不了，相对阈值 signalMinRatio 就变成死代码。只有用户显式配置才保留旧行为。
    relevanceMin: Schema.number(),
    // 预算审计日志（stderr）**默认 off**：终端是用户可见面，而"预算挤掉低优先级条目"是
    // 正常降级、不是故障——默认打印会让一次 dsh web 启动刷出多行，用户的第一反应是卸载插件。
    // off（默认，永不打印）/ once（每个会话最多一行，首次出现丢弃时）/ all（丢弃组合每变化一次一行，作者排查）
    budgetLog: Schema.union(['off', 'once', 'all']).default('off'),
    // 同一条 insight 在本会话里重复注入的冷却（pre-step 步数）。0（默认）= 正文没变就不再注入：
    // 注入消息留在会话历史里（宿主只追加不压缩），整块重发只是重复占位。>0 用于外部裁剪历史的场景。
    reinjectItemsAfter: Schema.number().default(0),
```

</details>

**依据 3 · 源码核查**：[src/index.js:198-218](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/index.js#L198-L218)

退出flush和空闲watch接线。

<details>
<summary>查看原文（21行）</summary>

```text
  // 卸载/退出前把还脏着的 store 同步写一次（后台重试只是兜底，不能当正确性保证）。
  if (typeof ctx.effect === 'function') {
    ctx.effect(() => () => flushDirtyStores({ timeoutMs: 1500 }))
  }
  // TaskBridge：任务实体 + 宿主 todo 同步
  setupTaskbridge(ctx, config)
  // 用法本身也是记忆的一部分：注册成宿主 skill（可选依赖，没有 skills 服务就静默跳过）。
  setupSkill(ctx)
  // 跟踪会话路由（request/header 事件），为无会话上下文的召回期可选 LLM（查询扩展 / 反思）兜底
  ctx.on('session/event', (session, event) => {
    if (event?.type === 'request/header') rememberRoute(session)
    // 会话活跃信号：有人正在跑回合时把 watch 轮询压到最低，回合结束立刻补扫一次（见 watch.js）。
    // 这是"轮询只在空闲时发生"的落点 —— 交互期间把 I/O 全让给模型，停下那一刻才整理索引。
    const key = session?.id ?? 'unknown'
    if (event?.type === 'turn/start' || event?.type === 'step/start') watchManager.setSessionActive(key, true)
    else if (event?.type === 'turn/end') watchManager.setSessionActive(key, false)
  })
  // 会话被销毁时也要摘掉活跃标记：否则一个没有正常 turn/end 的会话会把轮询**永久**压在兜底节拍
  // （不会卡死，但"空闲时高速刷新"再也不会回来）。
  ctx.on('session/disposed', (session) => {
    watchManager.setSessionActive(session?.id ?? 'unknown', false)
```

</details>

**依据 4 · 源码核查**：[src/store.js:803-843](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/store.js#L803-L843)

脏状态与持久化失败重试。

<details>
<summary>查看原文（41行）</summary>

```text
  save(options = {}) {
    // 没有脏数据就不落盘。watch 每轮对每个根都无条件 commit → save；照旧执行的话，
    // 末尾的 ID 缓存失效会打在跨实例共享的 store 上，等于每轮清空一次 IDF 复用（v0.3.4 的 20x）。
    // 待压实队列不算"脏数据"，但它需要有界推进，所以也走这条落盘路径。
    const compacting = this._compactQueue.size > 0
    const dirty =
      compacting ||
      this._dirtyShards.size > 0 ||
      this._removedShards.size > 0 ||
      this._dirtyInsights ||
      this._dirtyTasks ||
      this._dirtyBinding ||
      this._dirtyWatch ||
      !this._formatWritten
    if (dirty && !this._storeDirReady) {
      mkdirSync(this.dir, { recursive: true })
      this._storeDirReady = true
    }
    // 崩溃遗留的 *.tmp 无论有没有脏数据都顺手清掉（两次 readdir，自带 try/catch）
    this.cleanStaleTmp()
    // 自我忽略也在无脏数据时执行：老版本建出来的 store 会在下一次 save 时补上。
    this.ensureSelfIgnore()
    if (!dirty) {
      this.lastSaveOk = true
      untrackDirty(this)
      return true
    }
    // 跨进程：整段读改写放进目录锁。默认同步等待 15s——写路径的正确性靠"等到锁"，
    // 不靠后台重试（用户结束对话就关 dsh）。真拿不到时保持脏状态并登记退出 flush；
    // 默认静默，不向用户/模型抛提示。
    const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : 15000
    const release = acquireDirLock(this.dir, { timeoutMs, ensureDir: false })
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

#### 缺口

- 工程规模下索引资源、上下文成本和纠错时间未知
  **影响**：无法给出单位合格任务成本
  **进一步探讨**：记录固定项目批次的索引/查询/注入字符、失败和人工修正，再除以合格任务数

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可借鉴什么，怎样检验并决定使用范围？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

可借鉴的是事实索引、任务绑定、经验层和注入通道分责，以及跨进程读改写锁、退出flush和显式未落盘状态。维护代价在根归属、删除合并、全局知识和宿主事件契约，不能以测试脚本数量保证正确。由相关性与时效真实性之间的缺口推导未验证假设：将经验命中与当前源码约束核对结合，标注仍成立/冲突/需复核，可能降低陈旧建议使用。最小验证用已修复故障和跨项目同名模块，比较无记忆、当前召回、召回加时效核对的正确率与总人工时间；若只是增加复核而不减少错误则否定。建议trial于单一非敏感工程，先按需查询与人工核回源，再逐步启用自动注入，先备份项目/global存储；出现串项目、无依据指令或落盘状态不明即暂停自动通道。

#### 证据与依据

**依据 1 · 源码核查**：[src/store.js:830-851](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/store.js#L830-L851)

锁、磁盘合并与格式落位。

<details>
<summary>查看原文（22行）</summary>

```text
    // 跨进程：整段读改写放进目录锁。默认同步等待 15s——写路径的正确性靠"等到锁"，
    // 不靠后台重试（用户结束对话就关 dsh）。真拿不到时保持脏状态并登记退出 flush；
    // 默认静默，不向用户/模型抛提示。
    const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : 15000
    const release = acquireDirLock(this.dir, { timeoutMs, ensureDir: false })
    if (!release) {
      this.lastSaveOk = false
      trackDirty(this)
      if (!this._lockWarned) {
        this._lockWarned = true
        debugPersistence(`[dsh-project-memory] store ${this.dir} is busy (another dsh process is writing); this write is pending.`)
      }
      this._scheduleSaveRetry()
      return false
    }
    let wroteInsights = false
    let wroteTasks = false
    try {
      // 先合并另一进程已落盘的小文档，再写；分片按“加载时 hash”做冲突检测。
      this._mergeAuxFromDisk()
      if (!this._formatWritten) {
        writeJsonAtomic(path.join(this.dir, FORMAT_FILE), { version: 2, layout: 'sharded' }, { ensureDir: false })
```

</details>

**依据 2 · 源码核查**：[src/tools/query-memory.js:88-125](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/tools/query-memory.js#L88-L125)

安全根与多层可见性是核对入口。

<details>
<summary>查看原文（38行）</summary>

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
      // 一次 recall 覆盖全部层：doc/symbol/experience/insight 共用同一个检索核心（src/recall.js）。
```

</details>

**依据 3 · 源码核查**：[src/auto-inject.js:290-314](https://github.com/00080000/dsh-project-memory/blob/f5aa9dcfd815edf4256e619648e9455889b316a7/src/auto-inject.js#L290-L314)

时效核对假设的触发/排序出发点。

<details>
<summary>查看原文（25行）</summary>

```text

/**
 * 通道 1：authored trigger 命中（确定性、全文、优先级 1）。procedure 先于其它 kind（步骤更完整）。
 * 准入化（S2）：只有 `when`（op / 写目标 / 意图词）能触发，guard 只能收窄；
 * **没有 `when` 的条目在这里永远不命中**（降级为可发现 + 按需拉取）。
 */
function collectTriggered(cands, ctx) {
  const hits = []
  for (const it of cands) {
    const why = matchTrigger(it.trigger, ctx)
    if (why) hits.push({ it, why })
  }
  hits.sort(
    (a, b) => (a.it.kind === 'procedure' ? 0 : 1) - (b.it.kind === 'procedure' ? 0 : 1)
      || String(a.it.id).localeCompare(String(b.it.id)),
  )
  return hits
}

/**
 * 通道 2：统计信号（提示态、优先级 2）。**双门槛**：层内相对阈值 + IDF 加权覆盖率（绝对下限）。
 * 查询只用「人类消息的意图文字 + 本次写目标」：原始工具参数不是查询文本，它们正是
 * `dcterms→rm`、`*.pptx→论文笔记` 那类假阳性的来源。被门槛拦下的记进 dropped，不静默。
 *
 * 可选的第三层：`rerank`（向量重排，默认关闭）。**职责严格分离**——闸门（支持度/覆盖率/共同词数）
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
