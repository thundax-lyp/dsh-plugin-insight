# MemSearch DSH

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[65d8b22](https://github.com/zilliztech/memsearch/tree/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh)

<!-- BEGIN META -->
[![GitHub ★ 2,814](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C814&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zilliztech/memsearch) [![npm 30d 3,948](https://img.shields.io/static/v1?label=npm+30d&message=3%2C948&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zilliz/memsearch-dsh) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zilliz/memsearch-dsh)
<!-- END META -->

> **功能**：为 DSH 提供会话摘要日记、按需召回 Skill 与候选评审入口。

> **亮点**：[Q02](#research-q02) 将宿主生命周期、日记和按需 Skill 连接；根检索算法不属子包原创。

> **主要限制**：[Q03](#research-q03) 摘要失败仍生成 anchor，重放去重不保证自动修复；根索引失败也可能暂缺块。

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
  - [Q01 · 谁需要 DSH 适配，与根工具和手工笔记有什么不同？](#detail-section-11)
  - [Q02 · 轮次怎样变成日记、召回入口如何接线？](#detail-section-12)
  - [Q03 · 摘要或索引失败后能否自动修复？](#detail-section-13)
  - [Q04 · 使用有什么依赖、隐私和退出成本？](#detail-section-14)
  - [Q05 · 何时值得试用，什么时候回退？](#detail-section-15)
  - [Q06 · 如何补修失败摘要而不重复捕获？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要跨 DSH 会话回查项目历史且能核对来源的用户。

手工 Markdown 和根 CLI 可保存搜索历史；桥接减少宿主事件接线，但增加自动摘要和索引维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 首步提示 | 提醒 Agent 按需召回 | 不自动注入检索结果 |
| 日记捕获 | 摘要与原会话 anchor | 失败写 unavailable |
| 根索引 | 使日记可检索 | 失败可能暂缺块 |
| 候选页面 | review 或 install | review 与安装分开，不自动证明质量 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与子插件 | 必需 | 会话事件与 Skill | 不会自动接入 |
| 根 memsearch CLI 与 Python | 检索和索引需要 | 调用索引及摘要工具 | 检索失败 |
| 所选模型与后端 | 对应功能需要 | 摘要和 embedding | 回 unavailable 或索引失败 |
| 可写项目目录及授权 | 捕获需要 | 日记和索引 | 暂停捕获 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选择隔离项目与模型 | 明确数据范围 |
| 捕获 | 插件处理 turn/end | 检查摘要与原会话 anchor |
| 召回 | Agent 按提示调用 Skill | 回读来源和索引报告 |
| 恢复 | 用户核对失败与原会话 | 不把占位视为摘要 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | DSH、Python 和后端 | 配置 profile 与模型 | 未运行 |
| 持续 | 摘要、embedding、存储 | 复核日记和来源 | 总成本未知 |
| 失败 | 重试与重建资源 | 核查 anchor 和索引 | 失败占位不会因重放自动补全 |
| 退出 | 保留数据资源 | 移除接入并清点历史 | 退出不等于撤回数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话接入 | 事件捕获和首步提示 | 实际宿主可靠性 |
| 去重 | session/turn anchor | 失败摘要自动恢复 |
| 查询 | 根 CLI 接入 | 答案事实正确 |

> **思考**：[Q03](#research-q03) 摘要失败仍生成 anchor，重放去重不保证自动修复；根索引失败也可能暂缺块。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将宿主生命周期、日记和按需 Skill 连接；根检索算法不属子包原创。

[Q02](#research-q02) 首步只给提示；[Q03](#research-q03) 失败占位与 anchor 去重不构成自动补修。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 摘要失败仍生成 anchor，重放去重不保证自动修复；根索引失败也可能暂缺块。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先在隔离项目核查日记、索引和原会话，失败时回原文。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包与同提交根索引路径静态核查；未运行宿主、模型或故障注入。

- 已检查：作者 README、包清单、源码路径 plugins/dsh/package.json、plugins/dsh/README.md、plugins/dsh/index.js、plugins/dsh/runtime.js、plugins/dsh/client.js、src/memsearch/core.py、src/memsearch/index_report.py 及固定范围 inventory；组件：plugins/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 DSH 子包及同提交根索引静态核查，未运行宿主、模型或 Milvus。
- 下一步：隔离 profile 注入摘要与索引失败、重复事件和用户编辑，核对日记、会话及 failed_files。

**分析版本**

- **仓库**：[zilliztech/memsearch](https://github.com/zilliztech/memsearch)
- **版本号**：0.1.8（[固定提交 65d8b22](https://github.com/zilliztech/memsearch/tree/65d8b220d4265f70441785aa22203f0e85ea3ec6)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 对失败占位做版本检查后定向补摘要并重建索引，需验证并发、误覆盖和成本。

隔离 profile 注入摘要与索引失败、重复事件和用户编辑，核对日记、会话及 failed_files。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 2264 | 1702 | 445 | — |
| .md | source | 14 | 1220 | — | — | 7678 |
| .js | test | 5 | 1858 | 1694 | 72 | — |

</details>

**活跃度**

[![Issue 未关闭 42](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=42&color=737b86&logo=github)](https://github.com/zilliztech/memsearch/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=16&color=737b86&logo=github)](https://github.com/zilliztech/memsearch/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=23&color=737b86&logo=github)](https://github.com/zilliztech/memsearch/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查固定 DSH 子包的首步提示、会话摘要和根索引失败边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要 DSH 适配，与根工具和手工笔记有什么不同？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向想在 DSH 跨会话保存项目历史、按需检索的用户。根 MemSearch 和手工 Markdown/grep 已能保存和检索；子包增量是接入宿主生命周期、摘要日记、召回 Skill 与候选页面，不是 BM25、向量或语言模型的原创。当前固定版本 pre-step 注入的是召回提示而非自动检索结果；旧版报告所称候选注入不能直接沿用。能否减少重复交接和误召回未实测。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/package.json:1-15](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/package.json#L1-L15)

DSH 子包身份与入口。

<details>
<summary>查看原文（15行）</summary>

```text
{
  "name": "@zilliz/memsearch-dsh",
  "version": "0.1.8",
  "description": "MemSearch plugin for DeepSeek Harness: shared markdown memory across agents, with capture, on-demand recall, memory-recall skill, and a skill-candidate review panel.",
  "type": "module",
  "main": "index.js",
  "exports": {
    ".": {
      "types": null,
      "default": "./index.js"
    },
    "./client": "./client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/index.js:1233-1258](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L1233-L1258)

注册 Skill、首步只注入召回提示。

<details>
<summary>查看原文（26行）</summary>

```text
  // --- Recall skill (always available) ---
  registerMemoryRecallSkill(ctx, opts, memsearchCmd, bootProjectDir)

  // --- Config + distillation skills (always available) ---
  registerMemoryConfigSkill(ctx)
  registerMemoryToSkillSkill(ctx)

  // --- Pre-step recall hint: the agent decides when to search ---
  ctx.on(
    'agent/pre-step',
    async ({ agent, step, signal }, next) => {
      const decision = await next()
      if (!opts.injectEnabled) return decision
      if (decision.kind === 'reject' || signal.aborted) return decision
      if (step !== 1) return decision

      const memoryDir = memoryDirFor(projectDirFor(agent.session))
      if (!hasMemoryFiles(memoryDir)) return decision

      const memoryMessage = await createMemoryMessage(ctx, RECALL_HINT)
      return {
        ...decision,
        messages: [...decision.messages, memoryMessage],
      }
    },
    { prepend: true },
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/index.js:1261-1273](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L1261-L1273)

后台捕获队列。

<details>
<summary>查看原文（13行）</summary>

```text
  // --- Capture: summarize + write each completed turn, fire-and-forget ---
  // Each turn is processed against its *own* project directory (from
  // `session.header.cwd`), which on a long-lived web surface is not
  // necessarily `process.cwd()` — the boot directory. Turns are serialized
  // through a promise chain so LLM summarize calls never overlap, and the
  // `captureExists` dedup keeps a turn idempotent if its event replays.
  const dependencyWarnings = new Set()
  let captureChain = Promise.resolve()
  const enqueueCapture = (work) => {
    captureChain = captureChain
      .then(work)
      .catch((error) => ctx.logger.warn(`[memsearch] capture failed: ${error.message}`))
  }
```

</details>

#### 缺口

- 没有手工笔记和宿主实际任务对照
  **影响**：不能证明节省时间或提高答案质量
  **进一步探讨**：固定任务比较人工交接、根 CLI 和适配器召回。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 轮次怎样变成日记、召回入口如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 注册 memory-recall 等 Skill；首个 pre-step 在允许注入、有记忆文件且未拒绝/取消时追加提示，是否调用 Skill 留给 Agent。turn/end 提交到进程内 promise chain，按 session 的项目目录提取本轮内容，查找 session/turn anchor 去重，写 daily Markdown 并尝试索引。摘要支持配置的模型或 headless 模式；现有 anchor 将日记连接原会话，不证明摘要准确、索引完成或自动搜索。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/index.js:1169-1183](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L1169-L1183)

入口和默认配置。

<details>
<summary>查看原文（15行）</summary>

```text
export function apply(ctx, config = {}) {
  // Recursion guard: when DSH booted this plugin as the summarizer's own
  // headless sub-agent (`summarizeMode: dsh-headless` sets this flag), stay
  // inert — no capture, no injection, no skill. Otherwise the summarizer's
  // session would itself be captured and re-summarized forever.
  if (process.env.MEMSEARCH_DSH_SUMMARIZE === '1') {
    ctx.logger?.debug?.('[memsearch] summarize sub-agent: plugin inert')
    return
  }

  const opts = {
    captureEnabled: config.captureEnabled !== false,
    injectEnabled: config.injectEnabled !== false,
    summarizeEnabled: config.summarizeEnabled !== false,
    summarizeMode: config.summarizeMode,
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/index.js:1233-1258](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L1233-L1258)

Skill 注册和提示。

<details>
<summary>查看原文（26行）</summary>

```text
  // --- Recall skill (always available) ---
  registerMemoryRecallSkill(ctx, opts, memsearchCmd, bootProjectDir)

  // --- Config + distillation skills (always available) ---
  registerMemoryConfigSkill(ctx)
  registerMemoryToSkillSkill(ctx)

  // --- Pre-step recall hint: the agent decides when to search ---
  ctx.on(
    'agent/pre-step',
    async ({ agent, step, signal }, next) => {
      const decision = await next()
      if (!opts.injectEnabled) return decision
      if (decision.kind === 'reject' || signal.aborted) return decision
      if (step !== 1) return decision

      const memoryDir = memoryDirFor(projectDirFor(agent.session))
      if (!hasMemoryFiles(memoryDir)) return decision

      const memoryMessage = await createMemoryMessage(ctx, RECALL_HINT)
      return {
        ...decision,
        messages: [...decision.messages, memoryMessage],
      }
    },
    { prepend: true },
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/index.js:1261-1284](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L1261-L1284)

按项目排队与 anchor 去重。

<details>
<summary>查看原文（24行）</summary>

```text
  // --- Capture: summarize + write each completed turn, fire-and-forget ---
  // Each turn is processed against its *own* project directory (from
  // `session.header.cwd`), which on a long-lived web surface is not
  // necessarily `process.cwd()` — the boot directory. Turns are serialized
  // through a promise chain so LLM summarize calls never overlap, and the
  // `captureExists` dedup keeps a turn idempotent if its event replays.
  const dependencyWarnings = new Set()
  let captureChain = Promise.resolve()
  const enqueueCapture = (work) => {
    captureChain = captureChain
      .then(work)
      .catch((error) => ctx.logger.warn(`[memsearch] capture failed: ${error.message}`))
  }

  const processTurn = async (session, turnEndEvent) => {
    const projectDir = projectDirFor(session)
    const render = renderTurn(session, turnEndEvent)
    if (!render) return
    const sessionId = session.id
    const turn = turnEndEvent.data.turn
    const dbPath = sessionLogPath(ctx, session)
    const memoryDir = memoryDirFor(projectDir)
    if (captureExists(memoryDir, sessionId, turn)) return

```

</details>

**依据 4 · 源码核查**：[plugins/dsh/index.js:810-839](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L810-L839)

查找及写入原会话 anchor。

<details>
<summary>查看原文（30行）</summary>

```text
/** True when a session/turn anchor already exists in any daily memory file. */
function captureExists(memoryDir, sessionId, turn) {
  let files
  try {
    files = readdirSync(memoryDir)
  } catch {
    return false
  }
  const anchor = `<!-- session:${sessionId} turn:${turn} `
  for (const file of files) {
    if (!DAILY_FILE_RE.test(file)) continue
    try {
      if (readFileSync(join(memoryDir, file), 'utf-8').includes(anchor)) return true
    } catch { /* skip unreadable file */ }
  }
  return false
}

/** Append a captured turn to the daily memory file (shared 4-platform format). */
function writeCapture(memoryDir, body, sessionId, turn, dbPath) {
  mkdirSync(memoryDir, { recursive: true })
  const today = todayStr()
  const hhmm = hhmmStr()
  const file = join(memoryDir, `${today}.md`)
  if (!existsSync(file)) {
    writeFileSync(file, `# ${today}\n\n## Session ${hhmm}\n\n`, 'utf-8')
  }
  const anchor = `<!-- session:${sessionId} turn:${turn} db:${dbPath} -->\n`
  const entry = `### ${hhmm}\n${anchor}${body}\n\n`
  appendFileSync(file, entry, 'utf-8')
```

</details>

**依据 5 · 源码核查**：[plugins/dsh/index.js:1303-1322](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L1303-L1322)

写入、索引和事件触发。

<details>
<summary>查看原文（20行）</summary>

```text
        body = `- Memory summary unavailable: ${reason}; transcript content was omitted. Use the transcript anchor for progressive disclosure.`
      }
    }
    writeCapture(memoryDir, body, sessionId, turn, dbPath)
    // Index right after the write so the memory is searchable by the next
    // session (or by this one's later turns) instead of waiting for a future
    // boot-time index. The index is idempotent via chunk_hash dedup.
    const collection = resolveCollection(projectDir)
    if (collection && hasMemoryFiles(memoryDir)) {
      indexMemory(ctx, memsearchCmd, memoryDir, collection, projectDir, opts.milvusUri)
    }
  }

  if (opts.captureEnabled) {
    ctx.on('session/event', (session, event) => {
      if (event.type !== 'turn/end') return
      try {
        enqueueCapture(() => processTurn(session, event))
      } catch (error) {
        ctx.logger.warn(`[memsearch] capture listener failed: ${error.message}`)
```

</details>

#### 缺口

- 未运行 DSH、CLI 或模型
  **影响**：无法保证真实事件加载、检索或准确摘要
  **进一步探讨**：在隔离 profile 测正常、取消、重启和重复事件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 摘要或索引失败后能否自动修复？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

摘要返回空或失败时，插件写入带原因的 unavailable 提示和 transcript anchor，而不是写出完整摘要；anchor 已存在时重复事件会被去重，所以不能仅靠重复 turn/end 断言摘要会自动补好。队列捕获失败只记录警告；日记写成和索引成功是不同阶段。同固定版本根 core 先删除 stale 旧块，再 embedding/upsert；根索引异常可能让派生索引暂缺，原 Markdown 仍在。本轮未模拟中断、权限失败或并发，不称永久丢失。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/index.js:810-825](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L810-L825)

anchor 已存在时去重。

<details>
<summary>查看原文（16行）</summary>

```text
/** True when a session/turn anchor already exists in any daily memory file. */
function captureExists(memoryDir, sessionId, turn) {
  let files
  try {
    files = readdirSync(memoryDir)
  } catch {
    return false
  }
  const anchor = `<!-- session:${sessionId} turn:${turn} `
  for (const file of files) {
    if (!DAILY_FILE_RE.test(file)) continue
    try {
      if (readFileSync(join(memoryDir, file), 'utf-8').includes(anchor)) return true
    } catch { /* skip unreadable file */ }
  }
  return false
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/index.js:1268-1273](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L1268-L1273)

队列错误仅警告。

```text
  let captureChain = Promise.resolve()
  const enqueueCapture = (work) => {
    captureChain = captureChain
      .then(work)
      .catch((error) => ctx.logger.warn(`[memsearch] capture failed: ${error.message}`))
  }
```

**依据 3 · 源码核查**：[plugins/dsh/index.js:1283-1306](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L1283-L1306)

摘要失败仍写 unavailable anchor。

<details>
<summary>查看原文（24行）</summary>

```text
    if (captureExists(memoryDir, sessionId, turn)) return

    let body = render
    if (opts.summarizeEnabled) {
      try {
        const summary = await summarizeTurn(ctx, opts, render, projectDir)
        if (summary) {
          body = summary
        } else {
          ctx.logger.warn('[memsearch] summarizer returned empty output; wrote unavailable note')
          body = '- Memory summary unavailable: summarizer returned empty output. Use the transcript anchor for progressive disclosure.'
        }
      } catch (error) {
        // Collapse newlines so the reason stays a single `- ` bullet in the
        // daily file (summarize.py stderr can span lines).
        const reason = String(error.message).replace(/\s+/g, ' ').trim()
        if (error.code !== 'MEMSEARCH_DEPENDENCY_MISSING' || !dependencyWarnings.has(reason)) {
          ctx.logger.warn(`[memsearch] summarization failed (${reason}); wrote unavailable note`)
          if (error.code === 'MEMSEARCH_DEPENDENCY_MISSING') dependencyWarnings.add(reason)
        }
        body = `- Memory summary unavailable: ${reason}; transcript content was omitted. Use the transcript anchor for progressive disclosure.`
      }
    }
    writeCapture(memoryDir, body, sessionId, turn, dbPath)
```

</details>

**依据 4 · 源码核查**：[src/memsearch/core.py:178-200](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L178-L200)

根索引删除旧块先于 embedding。

<details>
<summary>查看原文（23行）</summary>

```text
        # Compute composite chunk IDs (matching OpenClaw format)
        chunk_ids = {compute_chunk_id(c.source, c.start_line, c.end_line, c.content_hash, model) for c in chunks}
        old_ids = self._store.hashes_by_source(source)

        # Delete stale chunks that are no longer in the file
        stale = old_ids - chunk_ids
        if stale:
            self._store.delete_by_hashes(list(stale))

        if not chunks:
            return 0

        if not force:
            # Only embed chunks whose ID doesn't already exist
            chunks = [
                c
                for c in chunks
                if compute_chunk_id(c.source, c.start_line, c.end_line, c.content_hash, model) not in old_ids
            ]
            if not chunks:
                return 0

        return await self._embed_and_store(chunks)
```

</details>

**依据 5 · 源码核查**：[src/memsearch/core.py:202-214](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L202-L214)

根服务分批 embedding 和 upsert。

<details>
<summary>查看原文（13行）</summary>

```text
    async def _embed_and_store(self, chunks: list[Chunk]) -> int:
        if not chunks:
            return 0

        model = self._embedder.model_name
        total = 0
        for batch in _chunk_batches(chunks, self._embedder.batch_size):
            # Clean content for embedding: strip HTML comments and metadata noise
            # so the embedding vector captures semantics, not UUIDs/paths.
            # The original content is preserved in the Milvus record below.
            contents = [clean_content_for_embedding(c.content) for c in batch]
            embeddings = await self._embedder.embed(contents)
            total += self._store.upsert(_records_for_chunks(batch, embeddings, model))
```

</details>

#### 缺口

- 未模拟重启、索引故障与恢复
  **影响**：不能断言完整性或恢复时间
  **进一步探讨**：隔离副本故障注入，核对日记、原会话、failed_files 并人工补摘要。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用有什么依赖、隐私和退出成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH、memsearch CLI、Python、所选摘要与 embedding 后端和项目目录写权限。配置可选外部模型，后台摘要会处理对话内容；不能由 Markdown 位于本地推断全程离线。首用需固定语料和 collection，持续需模型费用、磁盘与人工复核，失败要查看日志、日记及原会话。退出要分别停自动捕获、移除 profile 接入并决定日记、索引和已安装 Skill 的保留；不能把移除插件等同撤回已发送内容或删除历史。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/package.json:1-15](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/package.json#L1-L15)

子包和运行入口。

<details>
<summary>查看原文（15行）</summary>

```text
{
  "name": "@zilliz/memsearch-dsh",
  "version": "0.1.8",
  "description": "MemSearch plugin for DeepSeek Harness: shared markdown memory across agents, with capture, on-demand recall, memory-recall skill, and a skill-candidate review panel.",
  "type": "module",
  "main": "index.js",
  "exports": {
    ".": {
      "types": null,
      "default": "./index.js"
    },
    "./client": "./client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/index.js:142-147](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L142-L147)

查找 memsearch 或 uvx。

```text
function detectMemsearchCmd() {
  if (process.env.MEMSEARCH_CMD) return parseCommand(process.env.MEMSEARCH_CMD, 'MEMSEARCH_CMD')
  const executable = findExecutable('memsearch')
  if (executable) return [executable]
  const uvx = findExecutable(join(homedir(), '.local', 'bin', 'uvx')) || findExecutable('uvx')
  return uvx ? [uvx, '--from', 'memsearch[onnx]', 'memsearch'] : ['memsearch']
```

**依据 3 · 源码核查**：[plugins/dsh/index.js:1179-1203](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L1179-L1203)

自动捕获、摘要和模型选择。

<details>
<summary>查看原文（25行）</summary>

```text
  const opts = {
    captureEnabled: config.captureEnabled !== false,
    injectEnabled: config.injectEnabled !== false,
    summarizeEnabled: config.summarizeEnabled !== false,
    summarizeMode: config.summarizeMode,
  }

  const memsearchCmd = detectMemsearchCmd()
  // Legacy plugin-config fields were removed in favor of memsearch config /
  // environment (aligned with the other platform plugins). A leftover field in
  // the profile patch is now ignored; warn once so an upgrade is not silent.
  const LEGACY_CONFIG_FIELDS = ['summarizeProvider', 'summarizeModel', 'memsearchDir', 'collection', 'milvusUri', 'agentName']
  const legacyField = LEGACY_CONFIG_FIELDS.find((field) => config[field] !== undefined)
  if (legacyField) {
    ctx.logger.warn(
      `[memsearch] config field '${legacyField}' is no longer used; provider/model/milvus/memory-dir now come from memsearch config (see README "Configuration")`,
    )
  }
  // Resolve the effective summarize backend now: explicit summarizeMode wins;
  // otherwise (auto) mirror the other plugins — a configured
  // [plugins.dsh.summarize] provider selects custom-llm, else dsh-headless.
  const resolvedSummarize = resolveSummarizeMode(memsearchCmd, opts, config, ctx.logger)
  opts.summarizeMode = resolvedSummarize.mode
  if (resolvedSummarize.provider) opts.summarizeProvider = resolvedSummarize.provider
  if (resolvedSummarize.model) opts.summarizeModel = resolvedSummarize.model
```

</details>

**依据 4 · 作者声明**：[plugins/dsh/README.md:129-143](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/README.md#L129-L143)

作者说明摘要后端。

<details>
<summary>查看原文（15行）</summary>

```text
Two backends are available, selected by `summarizeMode` — the same
"configured choice" the Claude Code / Codex / OpenClaw / OpenCode plugins
offer (each can summarize with their own LLM or a headless agent + small
model). The default (`auto`) matches theirs: configure a provider and you get
a direct LLM call; configure nothing and you get a headless agent.

- **`auto`** (default) — mirrors the other platform plugins:
  - if `[plugins.dsh.summarize] provider` is set in memsearch config
    (`~/.memsearch/config.toml`, same place the other plugins read), use
    `custom-llm` with that provider/model;
  - otherwise use `dsh-headless` (zero-config DSH agent).
  This means the plugin behaves like the other four: **configure a provider
  → direct LLM; configure nothing → headless**.
- **`dsh-headless`** — boots a one-shot DSH headless agent
  (`dsh --profile headless "<summarize task>"`) to write the notes, mirroring
```

</details>

**依据 5 · 源码核查**：[plugins/dsh/index.js:828-839](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L828-L839)

日记落盘。

<details>
<summary>查看原文（12行）</summary>

```text
/** Append a captured turn to the daily memory file (shared 4-platform format). */
function writeCapture(memoryDir, body, sessionId, turn, dbPath) {
  mkdirSync(memoryDir, { recursive: true })
  const today = todayStr()
  const hhmm = hhmmStr()
  const file = join(memoryDir, `${today}.md`)
  if (!existsSync(file)) {
    writeFileSync(file, `# ${today}\n\n## Session ${hhmm}\n\n`, 'utf-8')
  }
  const anchor = `<!-- session:${sessionId} turn:${turn} db:${dbPath} -->\n`
  const entry = `### ${hhmm}\n${anchor}${body}\n\n`
  appendFileSync(file, entry, 'utf-8')
```

</details>

#### 缺口

- 未测数据流、账单和卸载
  **影响**：不能保证离线、净节省或历史已删除
  **进一步探讨**：隔离 profile 检查网络、目录和选定模型，记录费用与退出状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何时值得试用，什么时候回退？

**研究主题**：贡献与相对优势、采用判断

#### 完整回答

频繁跨会话且能核对原会话的用户可在非敏感项目试用，先查看自动摘要和召回提示，再用明确问题对照手工笔记。若摘要 unavailable、索引有失败或原会话不可读，则回原文而不把空检索当没有历史；涉及敏感内容或无法接受外部模型时先关闭自动捕获或选经过核对的本地配置。候选 Skill 的生成、review 和 install 是不同操作，展示页面不自动证明每次安装经过语义审核。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/index.js:1240-1256](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L1240-L1256)

按需召回提示。

<details>
<summary>查看原文（17行）</summary>

```text
  // --- Pre-step recall hint: the agent decides when to search ---
  ctx.on(
    'agent/pre-step',
    async ({ agent, step, signal }, next) => {
      const decision = await next()
      if (!opts.injectEnabled) return decision
      if (decision.kind === 'reject' || signal.aborted) return decision
      if (step !== 1) return decision

      const memoryDir = memoryDirFor(projectDirFor(agent.session))
      if (!hasMemoryFiles(memoryDir)) return decision

      const memoryMessage = await createMemoryMessage(ctx, RECALL_HINT)
      return {
        ...decision,
        messages: [...decision.messages, memoryMessage],
      }
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/index.js:1283-1306](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L1283-L1306)

摘要失败提示和原会话锚点。

<details>
<summary>查看原文（24行）</summary>

```text
    if (captureExists(memoryDir, sessionId, turn)) return

    let body = render
    if (opts.summarizeEnabled) {
      try {
        const summary = await summarizeTurn(ctx, opts, render, projectDir)
        if (summary) {
          body = summary
        } else {
          ctx.logger.warn('[memsearch] summarizer returned empty output; wrote unavailable note')
          body = '- Memory summary unavailable: summarizer returned empty output. Use the transcript anchor for progressive disclosure.'
        }
      } catch (error) {
        // Collapse newlines so the reason stays a single `- ` bullet in the
        // daily file (summarize.py stderr can span lines).
        const reason = String(error.message).replace(/\s+/g, ' ').trim()
        if (error.code !== 'MEMSEARCH_DEPENDENCY_MISSING' || !dependencyWarnings.has(reason)) {
          ctx.logger.warn(`[memsearch] summarization failed (${reason}); wrote unavailable note`)
          if (error.code === 'MEMSEARCH_DEPENDENCY_MISSING') dependencyWarnings.add(reason)
        }
        body = `- Memory summary unavailable: ${reason}; transcript content was omitted. Use the transcript anchor for progressive disclosure.`
      }
    }
    writeCapture(memoryDir, body, sessionId, turn, dbPath)
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/client.js:2-13](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/client.js#L2-L13)

候选 review 与 install 是独立操作。

<details>
<summary>查看原文（12行）</summary>

```text
 * memsearch-dsh — browser half (skill review panel).
 *
 * A non-blocking dock strip above the composer that lists MemSearch skill
 * candidates distilled from memory journals and lets the human review or
 * install them:
 *
 *   - data:   GET  /memsearch-dsh/skill-candidates
 *   - review: POST /memsearch-dsh/skill-review  { sessionId, name, action: 'review' }
 *             queues a user message into the live agent's inbox; the agent
 *             reviews the candidate on the next turn (non-blocking).
 *   - install:POST /memsearch-dsh/skill-review  { sessionId, name, action: 'install' }
 *             runs `memsearch skills install` in the background to the
```

</details>

**依据 4 · 源码核查**：[src/memsearch/index_report.py:19-30](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/index_report.py#L19-L30)

根索引 degraded 与失败清单。

<details>
<summary>查看原文（12行）</summary>

```text
@dataclass(frozen=True)
class IndexReport:
    """Structured result for a completed indexing pass."""

    indexed_chunks: int
    total_files: int
    indexed_files: int
    failed_files: tuple[IndexFailure, ...] = ()

    @property
    def status(self) -> str:
        return "degraded" if self.failed_files else "ok"
```

</details>

#### 缺口

- 未测检索质量和 Skill 审核流程
  **影响**：无法保证准确性与净收益
  **进一步探讨**：对比同题错误引用、来源可回读率和人工时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何补修失败摘要而不重复捕获？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有 anchor 去重、失败占位和原会话链接，增加简单重试或 anchor 不是新机制。未验证方案是把 unavailable 摘要标为独立可识别状态，在用户请求后用相同 session/turn 的原会话重新生成，再以受控的比较替换该占位并重建索引；并发改写需先验证原内容版本，避免覆盖用户编辑。通过摘要失败、重放、用户编辑和索引失败故障注入，比较重复条目、恢复成功、覆盖误伤和成本；若误伤或额外负担大于恢复收益则否定。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/index.js:810-839](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L810-L839)

已有 anchor 与 append。

<details>
<summary>查看原文（30行）</summary>

```text
/** True when a session/turn anchor already exists in any daily memory file. */
function captureExists(memoryDir, sessionId, turn) {
  let files
  try {
    files = readdirSync(memoryDir)
  } catch {
    return false
  }
  const anchor = `<!-- session:${sessionId} turn:${turn} `
  for (const file of files) {
    if (!DAILY_FILE_RE.test(file)) continue
    try {
      if (readFileSync(join(memoryDir, file), 'utf-8').includes(anchor)) return true
    } catch { /* skip unreadable file */ }
  }
  return false
}

/** Append a captured turn to the daily memory file (shared 4-platform format). */
function writeCapture(memoryDir, body, sessionId, turn, dbPath) {
  mkdirSync(memoryDir, { recursive: true })
  const today = todayStr()
  const hhmm = hhmmStr()
  const file = join(memoryDir, `${today}.md`)
  if (!existsSync(file)) {
    writeFileSync(file, `# ${today}\n\n## Session ${hhmm}\n\n`, 'utf-8')
  }
  const anchor = `<!-- session:${sessionId} turn:${turn} db:${dbPath} -->\n`
  const entry = `### ${hhmm}\n${anchor}${body}\n\n`
  appendFileSync(file, entry, 'utf-8')
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/index.js:1283-1306](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/plugins/dsh/index.js#L1283-L1306)

已有失败占位和去重。

<details>
<summary>查看原文（24行）</summary>

```text
    if (captureExists(memoryDir, sessionId, turn)) return

    let body = render
    if (opts.summarizeEnabled) {
      try {
        const summary = await summarizeTurn(ctx, opts, render, projectDir)
        if (summary) {
          body = summary
        } else {
          ctx.logger.warn('[memsearch] summarizer returned empty output; wrote unavailable note')
          body = '- Memory summary unavailable: summarizer returned empty output. Use the transcript anchor for progressive disclosure.'
        }
      } catch (error) {
        // Collapse newlines so the reason stays a single `- ` bullet in the
        // daily file (summarize.py stderr can span lines).
        const reason = String(error.message).replace(/\s+/g, ' ').trim()
        if (error.code !== 'MEMSEARCH_DEPENDENCY_MISSING' || !dependencyWarnings.has(reason)) {
          ctx.logger.warn(`[memsearch] summarization failed (${reason}); wrote unavailable note`)
          if (error.code === 'MEMSEARCH_DEPENDENCY_MISSING') dependencyWarnings.add(reason)
        }
        body = `- Memory summary unavailable: ${reason}; transcript content was omitted. Use the transcript anchor for progressive disclosure.`
      }
    }
    writeCapture(memoryDir, body, sessionId, turn, dbPath)
```

</details>

**依据 3 · 源码核查**：[src/memsearch/core.py:178-200](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L178-L200)

根索引更新失败窗口。

<details>
<summary>查看原文（23行）</summary>

```text
        # Compute composite chunk IDs (matching OpenClaw format)
        chunk_ids = {compute_chunk_id(c.source, c.start_line, c.end_line, c.content_hash, model) for c in chunks}
        old_ids = self._store.hashes_by_source(source)

        # Delete stale chunks that are no longer in the file
        stale = old_ids - chunk_ids
        if stale:
            self._store.delete_by_hashes(list(stale))

        if not chunks:
            return 0

        if not force:
            # Only embed chunks whose ID doesn't already exist
            chunks = [
                c
                for c in chunks
                if compute_chunk_id(c.source, c.start_line, c.end_line, c.content_hash, model) not in old_ids
            ]
            if not chunks:
                return 0

        return await self._embed_and_store(chunks)
```

</details>

#### 缺口

- 补修方案未实现，文件替换与索引一致性未证
  **影响**：不能宣称自动可靠修复
  **进一步探讨**：隔离目录模拟并发编辑和失败后补修，人工核查原文及索引。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
