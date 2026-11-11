# MemSearch for DeepSeek Harness

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[a81ac68](https://github.com/zilliztech/memsearch/tree/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh)

<!-- BEGIN META -->
[![GitHub ★ 2,856](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C856&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zilliztech/memsearch) [![npm 30d 11,903](https://img.shields.io/static/v1?label=npm+30d&message=11%2C903&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zilliz/memsearch-dsh) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zilliz/memsearch-dsh)
<!-- END META -->

> **功能**：为 DeepSeek Harness 捕获会话记忆、检索共享 Markdown 日记并在 Web 面板审阅技能候选。

> **亮点**：[Q01](#research-q01) 用宿主事件维护项目日记，并把召回线索连接到原会话，减少每次从头翻找历史所需的入口切换。

> **主要限制**：[Q02](#research-q02) 摘要失败占位仍带有去重锚点，普通事件重放无法补摘要。[Q03](#research-q03) 候选安装返回 started 后仍需读回。

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
  - [Q01 · 哪些跨会话任务适合接入，检索结果如何回到原会话？](#detail-section-11)
  - [Q02 · 捕获和索引的失败是否能被重放修复，接入要承担哪些成本？](#detail-section-12)
  - [Q03 · Web 的审阅和安装响应具体承诺什么？](#detail-section-13)
  - [Q04 · 何时可试用，怎样验证对失败占位的补修设计？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复从新 DSH 会话接手同一项目的开发者，可以搜索上次决策并从摘要回查原话。

开发者可以手工搜索项目文档和原会话。此接入把宿主事件、可搜索日记与原文锚点串在一起，项目目录、索引和原始会话均需保持可用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 历史召回 | 查项目日记并回到原会话 | 项目索引和原会话仍可用 |
| 会话捕获 | 回合结束时生成日记并触发索引 | 摘要失败仍留锚点，重放不改占位 |
| 候选审阅 | 将待审候选送给活跃代理 | 排队和安装启动分别需要核实实际结果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH profile、Node 与 MemSearch CLI | 接入必需 | 注册会话回调、搜索及索引 | 回到原会话与文档 |
| Python 与适用模型配置 | 摘要或原文解析时需要 | 生成摘要和按锚点读回 | 摘要失败可留占位，原文另查 |
| 宿主 Web 和连接服务 | 候选面板需要 | 注册、鉴权并调度操作 | 无面板或请求被拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 记录 | 使用者在隔离项目完成一条测试决策 | 日记有可定位锚点 |
| 查找 | 新会话按需搜索并核对原文 | 决策及上下文吻合 |
| 退出 | 失败占位、错项目或原文不符时回原会话 | 暂停依赖召回结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 工具链和索引后端资源未知 | 配置 profile 与隔离目录 | 宿主组合未验 |
| 持续 | 摘要模型、嵌入和存储开销未知 | 核对来源和质量 | 无单位回查成本记录 |
| 失败恢复 | 重试及重建资源未知 | 区分摘要占位、索引延迟与原文缺失 | 普通重放不会改写旧占位 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 复用会话历史 | 按项目捕获、搜索和锚点回查 | 真实命中率与节时 |
| 候选处理 | 审阅排队、安装启动 | 实际落盘和宿主加载结果 |

> **思考**：[Q02](#research-q02) 摘要失败占位仍带有去重锚点，普通事件重放无法补摘要。[Q03](#research-q03) 候选安装返回 started 后仍需读回。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 用宿主事件维护项目日记，并把召回线索连接到原会话，减少每次从头翻找历史所需的入口切换。

进程内串行和锚点去重降低重复捕获，日记与索引之间仍有故障边界。Web 路由按请求使用宿主鉴权，后台安装状态需要另查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 摘要失败占位仍带有去重锚点，普通事件重放无法补摘要。[Q03](#research-q03) 候选安装返回 started 后仍需读回。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先只处理无敏感内容的测试决策，逐项核对日记、检索和原会话。找不到原话时回到项目文档。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交已核查捕获、召回和候选路由。摘要可靠性、实际查询收益与宿主授权策略尚需验证。

- 已检查：作者 README、包清单、源码路径 plugins/dsh/index.js、plugins/dsh/skills/memory-recall/SKILL.md、plugins/dsh/runtime.js 及固定范围 inventory；组件：plugins/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子包的 DSH 生命周期、候选路由和召回文档已查。未执行目标插件、模型、索引、测试或真实宿主，未全面审计 MemSearch 核心。
- 下一步：隔离项目检查一条确定决策的回查，再分别注入摘要失败、索引失败和安装子进程失败，区分各阶段的真实结果。

**分析版本**

- **仓库**：[zilliztech/memsearch](https://github.com/zilliztech/memsearch)
- **版本号**：0.1.9（[固定提交 a81ac68](https://github.com/zilliztech/memsearch/tree/a81ac682b547f86df25cd70a9477ada543de67ae)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 允许失败占位在锚点和版本匹配时定向补摘要并回读索引，可能修复可追溯但查不到有效内容的记录。

隔离项目检查一条确定决策的回查，再分别注入摘要失败、索引失败和安装子进程失败，区分各阶段的真实结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 2295 | 1722 | 457 | — |
| .md | source | 14 | 1274 | — | — | 7971 |
| .js | test | 8 | 2212 | 2028 | 88 | — |
| .mjs | example | 1 | 38 | 35 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 41](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=41&color=737b86&logo=github)](https://github.com/zilliztech/memsearch/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=19&color=737b86&logo=github)](https://github.com/zilliztech/memsearch/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 28](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=28&color=737b86&logo=github)](https://github.com/zilliztech/memsearch/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨会话工作的开发者能否从 DSH 找回上次决策并核对原话，捕获失败或候选技能安装时有哪些状态需要另查？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些跨会话任务适合接入，检索结果如何回到原会话？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

经常从新 DSH 会话接手同一项目的开发者，可以用历史决策查找来检验这个接入。一个合格答案应给出上次的决定、出处及适用条件，开发者能沿日记锚点核对原会话。相比直接搜索项目文档和过去对话，宿主在首个 agent step 且项目有日记时追加提示，让代理按需调用已注册的召回 Skill。Skill 按当前工作目录的 collection 搜索，然后展开相关 Markdown 片段，再用锚点内的数据库路径和 turn 定位原始内容。召回时代理仍需主动执行这些步骤，首步钩子没有直接把查得的历史注入每轮。检索排序和索引由 MemSearch 核心提供，DSH 子包的贡献在会话生命周期与来源回查的接线。只有一条会话或已有可靠决策文档时，建立额外索引未必值得。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:3-12](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh/README.md#L3-L12)

作者定义共享 Markdown、Milvus 和宿主挂接范围。

<details>
<summary>查看原文（10行）</summary>

````text
MemSearch plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH).
It gives DSH persistent, cross-agent memory on the same `.memsearch/memory/`
markdown store used by the Claude Code, Codex, OpenClaw, and OpenCode plugins,
backed by a Milvus hybrid search index.

```
capture  ── session/event turn/end ──> summarize (dsh-headless agent default, or custom-llm) ──> memory/YYYY-MM-DD.md
hint     ── agent/pre-step step 1  ──> remind the agent to use memory-recall when needed
recall   ── native memory-recall skill ──> search → expand → transcript
review   ── web UI dock panel ──> GET/POST /memsearch-dsh/* ──> list candidates / queue review / install
````

</details>

**依据 2 · 源码核查**：[plugins/dsh/index.js:1259-1284](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh/index.js#L1259-L1284)

注册召回和配置技能，首步满足条件时追加提示。

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

**依据 3 · 源码核查**：[plugins/dsh/skills/memory-recall/SKILL.md:18-37](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh/skills/memory-recall/SKILL.md#L18-L37)

按项目 collection 搜索及展开。

<details>
<summary>查看原文（20行）</summary>

````text
### 1. Search for relevant chunks

Run a semantic search over the project's memsearch collection. The plugin derives the collection from the current working directory when this skill is loaded:

```bash
{{MEMSEARCH_CMD}} search "{{QUERY}}" --top-k 5 --json-output {{MILVUS_FLAG}}--default-collection "{{COLLECTION}}"
```

Before each search, check whether `~/.memsearch/config.toml` or the project's
`.memsearch.toml` exists. If neither exists, add `--provider onnx` to the command.
Otherwise, leave the provider unset so the existing configuration applies.

Replace `{{QUERY}}` with a concise natural-language summary of what the user needs. The `--json-output` results contain `content`, `source`, `heading`, `score`, and `chunk_hash`.

### 2. Expand promising results

For the most promising results, expand the full markdown section to see surrounding context:

```bash
{{MEMSEARCH_CMD}} expand <chunk_hash> {{MILVUS_FLAG}}--default-collection "{{COLLECTION}}"
````

</details>

**依据 4 · 源码核查**：[plugins/dsh/skills/memory-recall/SKILL.md:40-54](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh/skills/memory-recall/SKILL.md#L40-L54)

锚点可作为原始对话定位参数。

<details>
<summary>查看原文（15行）</summary>

````text
### 3. Drill into the original conversation (optional)

When an expanded result contains an anchor comment like

```
<!-- session:<id> turn:<N> db:<path> -->
```

you can render the original conversation around that turn:

```bash
{{PYTHON_CMD}} "{{PLUGIN_DIR}}/scripts/parse-transcript.py" --db "<path>" --turn <N> --context 3
```

Pass `--context 0` for just the target turn, or omit `--turn` to see the most recent turns.
````

</details>

#### 缺口

- 没有同任务的人工查找与代理召回对照。
  **影响**：无法量化找回正确决策的时间与来源准确率。
  **进一步探讨**：对同一组已知决策比较两种方式，记录事实、锚点和上下文一致率。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 捕获和索引的失败是否能被重放修复，接入要承担哪些成本？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本、工程质量与复用

#### 完整回答

捕获按 session 工作目录排入当前进程的 Promise 链，任务串行处理并在写前查 session/turn 锚点。摘要成功后写正文，空输出或异常时仍写带原会话锚点的不可用说明，再尝试索引。重播同一 turn 已命中锚点时直接返回，单靠重播无法把失败摘要补成成功摘要。索引调用位于写入之后，日记写入和可搜索状态之间存在故障窗口。代价来自 DSH profile 和工具链配置、摘要模型或 ONNX／索引计算、日记存储、查询及原文复核。摘要启用时需核查所用模型和数据处理条件，禁用摘要时会把渲染后的对话直接作为 body 保存。每条可核对回查的开销应计入后台捕获、索引和后续纠错时间，当前无法估算。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:15-25](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh/README.md#L15-L25)

作者列出 memsearch、DSH profile、Node 与 Python 前提。

<details>
<summary>查看原文（11行）</summary>

````text
## Prerequisites

- Install memsearch:

  ```bash
  uv tool install "memsearch[onnx]"
  ```

- A DSH profile (web / headless / tui) you want to attach memory to.
- Node >= 22.19 (DSH's requirement).
- Python 3 on the profile's `PATH` (`python3`, `python`, or the Windows `py -3` launcher).
````

</details>

**依据 2 · 源码核查**：[plugins/dsh/index.js:1293-1312](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh/index.js#L1293-L1312)

串行链、工作目录、既有锚点提前退出及原文 body。

<details>
<summary>查看原文（20行）</summary>

```text
  const captureWarnings = new Set()
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

    let body = render
    if (opts.summarizeEnabled) {
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/index.js:1314-1334](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh/index.js#L1314-L1334)

空输出和异常以不可用说明降级。

<details>
<summary>查看原文（21行）</summary>

```text
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
        const missingCredential = opts.summarizeMode === 'dsh-headless' && /\bMISSING_CREDENTIAL\b/.test(reason)
        const warning = missingCredential
          ? 'DSH headless reported MISSING_CREDENTIAL. Use memory-config to check summary credentials.'
          : `summarization failed (${reason}); wrote unavailable note`
        const warnOnce = missingCredential || error.code === 'MEMSEARCH_DEPENDENCY_MISSING'
        if (!warnOnce || !captureWarnings.has(warning)) {
          ctx.logger.warn(`[memsearch] ${warning}`)
          if (warnOnce) captureWarnings.add(warning)
        }
        body = `- Memory summary unavailable: ${reason}; transcript content was omitted. Use the transcript anchor for progressive disclosure.`
```

</details>

**依据 4 · 源码核查**：[plugins/dsh/index.js:1337-1355](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh/index.js#L1337-L1355)

写日记后触发索引，捕获入口绑定 turn/end。

<details>
<summary>查看原文（19行）</summary>

```text
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
      }
    })
```

</details>

**依据 5 · 源码核查**：[plugins/dsh/index.js:836-865](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh/index.js#L836-L865)

查重依据仅是锚点存在，日记追加包含锚点。

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

#### 缺口

- 未测试进程崩溃、两个进程同时捕获或索引失败。
  **影响**：不能将进程内序列和锚点判断视为跨进程一致性。
  **进一步探讨**：用两个隔离进程回放同一测试 turn，分别在摘要、追加和索引边界中断并读回。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Web 的审阅和安装响应具体承诺什么？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

审阅接口会把描述候选位置和核对步骤的消息追加到活跃代理的下一轮队列，缺少活跃代理时返回 404。安装分支按会话目录解析目标并启动后台 CLI，HTTP 200 中 started 只表示调用路径已启动，子进程失败会进日志，使用者仍需核对目标 SKILL 文件是否写入并被宿主识别。所有这些路由经过宿主 connection.requestRejection，连接服务不可用时返回 503；源代码只能说明委托现有宿主认证的接线，具体用户隔离和 Host／Origin 策略取决于目标宿主配置。对多项目使用者，发起安装前要核实当前会话和目标目录。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/index.js:516-536](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh/index.js#L516-L536)

每请求委托宿主认证和策略，缺失时返回 503。

<details>
<summary>查看原文（21行）</summary>

```text
  const registerAuthenticatedRoute = (route) => webServer.register({
    ...route,
    handler: (req, res) => {
      let rejection
      try {
        // The connection service mounts after this plugin. Resolve it for each
        // request and reuse DSH's authentication and Host/Origin policy.
        const connection = ctx.get('connection')
        rejection = typeof connection?.requestRejection === 'function'
          ? connection.requestRejection({ headers: req.headers })
          : 503
      } catch {
        rejection = 503
      }
      if (rejection !== undefined) {
        return sendJson(res, rejection, {
          error: rejection === 503 ? 'authentication unavailable' : 'request rejected',
        })
      }
      return route.handler(req, res)
    },
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/index.js:580-604](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh/index.js#L580-L604)

审阅请求查活跃代理并将消息放入下一轮。

<details>
<summary>查看原文（25行）</summary>

```text
    path: '/memsearch-dsh/skill-review',
    handler: async (req, res) => {
      if (req.method !== 'POST') return sendJson(res, 405, { error: 'method not allowed' })
      const body = await readJsonBody(req)
      const { sessionId, name, action } = body
      if (!name || (action !== 'review' && action !== 'install')) {
        return sendJson(res, 400, { error: 'name and action (review|install) are required' })
      }
      if (action === 'review') {
        // Non-blocking: queue a user message into the live agent's inbox.
        // The agent picks it up on the next turn (never interrupts a running
        // turn, never asks the human via a blocking dialog).
        const agent = ctx.agents?.get?.(sessionId)
        if (!agent) {
          return sendJson(res, 404, { error: `no live agent for session ${sessionId}` })
        }
        const text =
          `[memsearch] Skill candidate "${name}" is ready for review.\n\n` +
          `Read the candidate at .memsearch/skill-candidates/${name}/ (SKILL.md plus meta.json), ` +
          `verify it against the cited memory journals, decide whether it is worth installing, ` +
          `and report your recommendation to the user. Installation stays a manual step: ` +
          `memsearch skills install ${name} --path <dir>.`
        const message = await createMemoryMessage(ctx, text)
        agent.inbox.append('next-turn', message)
        return sendJson(res, 200, { ok: true, action, name, injected: true })
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/index.js:606-622](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh/index.js#L606-L622)

安装异步启动，失败记日志，响应字段为 started。

<details>
<summary>查看原文（17行）</summary>

```text
      // install: background `memsearch skills install` to the resolved target.
      // Detached + unref so the install survives the DSH process; the
      // skill-filesystem watcher picks up the new SKILL.md automatically.
      const projectDir = await projectDirForSession(sessionId)
      const target = resolveSkillInstallTarget(memsearchCmd, projectDir)
      const child = execCommand(memsearchCmd, ['skills', 'install', name, '--path', target], {
        cwd: projectDir,
        timeout: 60000,
        maxBuffer: 4 * 1024 * 1024,
        detached: true,
        stdio: 'ignore',
        env: { ...process.env, MEMSEARCH_NO_WATCH: '1' },
      }, (error) => {
        if (error) ctx.logger.warn(`[memsearch] skill install failed: ${error.message}`)
      })
      child.unref()
      return sendJson(res, 200, { ok: true, action, name, started: true, target })
```

</details>

**依据 4 · 源码核查**：[plugins/dsh/index.js:1387-1407](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh/index.js#L1387-L1407)

等待 Web 服务出现后注册路由。

<details>
<summary>查看原文（21行）</summary>

```text
  // --- Skill review panel: browser-facing JSON API (web only) ---
  // The memsearch plugin mounts in the base bundle layer, before the DSH web
  // server service exists. Retry until the service appears (web profile) or
  // give up silently (headless / tui profiles never provide it). The retry
  // timer is unref'd so it never keeps the process alive, and the routes are
  // registered exactly once.
  let skillReviewAttempted = false
  const tryRegisterSkillReview = () => {
    if (skillReviewAttempted) return
    const webServer = typeof ctx.get === 'function' ? ctx.get('webServer') : undefined
    if (webServer === undefined) return // not available yet; retry later
    skillReviewAttempted = true
    try {
      registerSkillReviewRoutes(ctx, webServer, memsearchCmd)
    } catch (error) {
      ctx.logger.warn(`[memsearch] skill-review route registration failed: ${error.message}`)
    }
  }
  tryRegisterSkillReview()
  const skillReviewTimer = setInterval(tryRegisterSkillReview, 1000)
  skillReviewTimer.unref?.()
```

</details>

#### 缺口

- 没有同版本 Web 操作及实际跨项目权限记录。
  **影响**：无法确认部署配置满足多人访问边界，也未证实安装后的宿主加载。
  **进一步探讨**：在单独 Web profile 先模拟无活跃代理及安装子进程失败，再核对 HTTP、日志与目标路径。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时可试用，怎样验证对失败占位的补修设计？

**研究主题**：新假设与验证、采用判断

#### 完整回答

适合在隔离项目保存一条无敏感内容的明确决策，等 turn/end 后读日记，在新会话中询问该决策并检查索引结果和原始锚点。如果只召回不可用说明、原话与摘要冲突或源锚点找不到，就回原会话和项目文档，并暂停将召回结果用于决策。现有占位保住了来源线索，却让按锚点去重的普通重播跳过补修。可检验的设计是给失败占位单独记录需补摘要状态，恢复任务按原锚点读取原文，只在版本与占位仍匹配时替换，再回读索引。用同一测试 turn 注入一次摘要失败和一次索引失败，对照现有重播，统计能否恢复原锚点、避免双份日记并找回正确决策。若导致重复、覆盖正常日记或跨项目更新，应保留人工回查。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/index.js:1301-1309](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh/index.js#L1301-L1309)

重放分支先看已存在的锚点。

```text
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

**依据 2 · 源码核查**：[plugins/dsh/index.js:1314-1344](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh/index.js#L1314-L1344)

失败占位和后续索引调用提供补修的候选边界。

<details>
<summary>查看原文（31行）</summary>

```text
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
        const missingCredential = opts.summarizeMode === 'dsh-headless' && /\bMISSING_CREDENTIAL\b/.test(reason)
        const warning = missingCredential
          ? 'DSH headless reported MISSING_CREDENTIAL. Use memory-config to check summary credentials.'
          : `summarization failed (${reason}); wrote unavailable note`
        const warnOnce = missingCredential || error.code === 'MEMSEARCH_DEPENDENCY_MISSING'
        if (!warnOnce || !captureWarnings.has(warning)) {
          ctx.logger.warn(`[memsearch] ${warning}`)
          if (warnOnce) captureWarnings.add(warning)
        }
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
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/skills/memory-recall/SKILL.md:40-58](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/plugins/dsh/skills/memory-recall/SKILL.md#L40-L58)

手工回查原话与引用来源已有操作路径。

<details>
<summary>查看原文（19行）</summary>

````text
### 3. Drill into the original conversation (optional)

When an expanded result contains an anchor comment like

```
<!-- session:<id> turn:<N> db:<path> -->
```

you can render the original conversation around that turn:

```bash
{{PYTHON_CMD}} "{{PLUGIN_DIR}}/scripts/parse-transcript.py" --db "<path>" --turn <N> --context 3
```

Pass `--context 0` for just the target turn, or omit `--turn` to see the most recent turns.

### 4. Report a curated summary

Return a concise summary of the relevant context to the user, citing the memory source files where useful. If the search finds nothing relevant, say so plainly in one line and proceed without it. Do not fabricate memories.
````

</details>

#### 缺口

- 补修设计没有实现或测试。
  **影响**：对恢复率、重复率和新增后台开销的影响未知。
  **进一步探讨**：针对失败占位做有无修复任务的隔离重放对照。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
