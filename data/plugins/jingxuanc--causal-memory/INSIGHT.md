# causal-memory

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[b05d671](https://github.com/JingxuanC/causal-memory/tree/b05d671fc45d1f73c99c36a58f05c0bdd673cb88)

<!-- BEGIN META -->
[![GitHub ★ 104](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=104&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/JingxuanC/causal-memory)
<!-- END META -->

> **功能**：本地记忆引擎存储事实与决策结果关系，并以 DSH 工具提供召回。

> **亮点**：[Q01](#research-q01) 让决策记录独立于会话压缩并提供查询。

> **主要限制**：[Q02](#research-q02) 超时不代表服务端取消，默认同库及能力降级要核对。

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
  - [Q01 · 经验如何在压缩后再次被 DSH 查到？](#detail-section-11)
  - [Q02 · 超时、模型配置和数据库作用域有什么代价？](#detail-section-12)
  - [Q03 · 怎样开始可复验的记忆试用？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：代理跨会话反复处理相同决策，需要查到旧结果。

会话摘要或手写 Markdown 经验表。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 记忆 | 持久事实和决策 | 需正确录入与查询 |
| DSH 适配 | 工具发现和提示 | 另配后端 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| causal-memory 二进制与 SQLite | 必需 | 提供后端 | 启动失败默认拒绝 |
| LLM 与 embedding 路由 | 按功能需要 | 语义和提取 | 缺省可降级 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定独立数据库 | 核对服务路径 |
| 记录 | 写决策与反例 | 确认持久化 |
| 召回 | 在新会话查询 | 比较原始条目 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 配置二进制和库 | 需校准查询 |
| 持续 | 费用未知 | 整理过时经验 | 可选模型开销 |
| 失败 | 工时未知 | 核对库中实际结果 | 避免盲重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 经验复用 | 工具可查询持久条目 | 真实准确率和节时 |

> **思考**：[Q02](#research-q02) 超时不代表服务端取消，默认同库及能力降级要核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 让决策记录独立于会话压缩并提供查询。

[Q02](#research-q02) 超时只影响等待，远端写入结果需查询。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 超时不代表服务端取消，默认同库及能力降级要核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 独立库小样本对照后再扩展。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核对 DSH 桥和 Rust 工具入口，未复跑。

- 已检查：作者 README、包清单、源码路径 dsh-plugin/index.js、crates/causal-memory-cli/src/server/tools.rs、README.md、dsh-plugin/README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 DSH 入口与 Rust 工具，未运行目标。
- 下一步：对照压缩、否定、不同项目及超时写入。

**分析版本**

- **仓库**：[JingxuanC/causal-memory](https://github.com/JingxuanC/causal-memory)
- **版本号**：未声明（[固定提交 b05d671](https://github.com/JingxuanC/causal-memory/tree/b05d671fc45d1f73c99c36a58f05c0bdd673cb88)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照手写表测实际召回与误归因。

对照压缩、否定、不同项目及超时写入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 128 | 22346 | — | — | 214962 |
| .js | source | 1 | 425 | 285 | 116 | — |
| .js | test | 1 | 15 | 1 | 13 | — |
| .mjs | test | 1 | 322 | 259 | 23 | — |

</details>

**活跃度**

[![Issue 未关闭 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=11&color=737b86&logo=github)](https://github.com/JingxuanC/causal-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/JingxuanC/causal-memory/issues?q=is%3Aissue+created%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/JingxuanC/causal-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：编码代理能否在上下文压缩后重新利用已记录的决策经验？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 经验如何在压缩后再次被 DSH 查到？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

DSH 子目录是原生适配器，启动外部 Rust 服务，经 stdio 发现工具并注入查阅指引。Rust 工具将决策、结果和关系交给 memory，搜索按参数返回结果。相对保留摘要，它将条目保存在外部 SQLite，但召回仍取决于当时录入和查询。根项目的因果名称指存储的关系，不能由接口证明因果推断正确。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/index.js:127-145](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/index.js#L127-L145)

握手、发现和调用。

<details>
<summary>查看原文（19行）</summary>

```text
    async connect() {
      await rpc('initialize', {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'dsh-causal-memory-plugin', version: '1.0.0' },
      })
      notify('notifications/initialized')
      const list = await rpc('tools/list', {})
      return list.tools ?? []
    },
    async call(toolName, args, signal) {
      if (signal?.aborted) throw new Error(`causal-memory: ${toolName} aborted before call`)
      const result = await rpc('tools/call', { name: toolName, arguments: args ?? {} })
      const text = (result.content ?? [])
        .filter((block) => block.type === 'text' && typeof block.text === 'string')
        .map((block) => block.text)
        .join('\n')
      if (result.isError === true) throw new Error(text || `causal-memory tool ${toolName} failed`)
      return text
```

</details>

**依据 2 · 源码核查**：[crates/causal-memory-cli/src/server/tools.rs:282-324](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/crates/causal-memory-cli/src/server/tools.rs#L282-L324)

记录与搜索的服务端接线。

<details>
<summary>查看原文（43行）</summary>

```text
        name = "record_decision",
        description = "Record a decision and its observed outcome as a causal memory. Call this AFTER you've acted on a decision and observed the result, especially if the outcome was surprising or educational. This builds your experience base for future similar tasks."
    )]
    fn record_decision(&self, Parameters(params): Parameters<RecordDecisionParams>) -> String {
        self.timed("record_decision", || {
            self.memory.record_decision(
                &params.decision,
                &params.outcome,
                &params.relation,
                &params.task_tag,
                params.confidence_source.as_deref(),
                params.context.as_deref(),
                params.influenced_by.as_deref(),
            )
        })
    }

    #[tool(
        name = "remember",
        description = "Extract and store memories from conversation text. The system automatically identifies facts, lessons, and causal relationships (caused/enabled/prevented) using LLM analysis. Call this after any meaningful conversation exchange — just paste the conversation text, no need to manually identify decisions or outcomes."
    )]
    fn remember(&self, Parameters(params): Parameters<RememberParams>) -> String {
        self.timed("remember", || {
            self.memory
                .remember(&params.messages, params.date.as_deref())
        })
    }

    #[tool(
        name = "search_causal",
        description = "Search past decisions and their outcomes for situations similar to your current task. Call this BEFORE attempting a non-trivial decision to learn from past experience. Filter by task_tag for domain-specific lessons, or use query text for broader search."
    )]
    fn search_causal(&self, Parameters(params): Parameters<SearchCausalParams>) -> String {
        self.timed("search_causal", || {
            self.memory.search_causal(
                params.task_tag.as_deref(),
                params.query.as_deref(),
                params.limit,
                params.detail_level.as_deref(),
                params.max_tokens,
                params.explain,
            )
        })
```

</details>

**依据 3 · 作者声明**：[README.md:22-39](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/README.md#L22-L39)

作者的压缩比较。

<details>
<summary>查看原文（18行）</summary>

```text
## Why

Every agent forgets *why* it made past decisions after a few context compactions.
It re-fixes the same bug the same wrong way, re-debates the same architecture
choice, relearns the same lesson.

This happens because **causal information is the most fragile type under text
compaction**. Real-LLM benchmark (grok-build's production compaction prompt):

| Compactions (k) | Textual recall | Causal-table recall |
|---|---|---|
| 1 | 100% | 100% |
| 2 | 85% | 100% |
| 3 | 55% | 100% |
| 5 | **45%** | **100%** |

The causal table survives because it lives **outside the agent's context window** —
compaction cannot touch it.
```

</details>

#### 缺口

- 未复跑作者基准或真实任务
  **影响**：不能量化召回与因果判断收益
  **进一步探讨**：同一任务比较摘要和外部记忆，记录误召回

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 超时、模型配置和数据库作用域有什么代价？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

默认数据库在用户级目录，多个项目除非单独配置会使用同库。调用只在发起前检查 signal，超时删除本地等待项，源码没有发远程取消，因此写操作超时后状态未知。缺 LLM 或地址错误会走规则回退，成功返回不等于启用语义能力。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/index.js:104-145](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/index.js#L104-L145)

超时和信号边界。

<details>
<summary>查看原文（42行）</summary>

```text
  const rpc = (method, params = {}) => {
    const id = ++seq
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id)
        reject(new Error(`causal-memory: timeout on ${method}`))
      }, timeoutMs)
      pending.set(id, (msg) => {
        clearTimeout(timer)
        if (msg.error) reject(new Error(msg.error.message ?? 'causal-memory rpc error'))
        else resolve(msg.result)
      })
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n')
    })
  }

  const notify = (method, params = {}) => {
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n')
  }

  return {
    child,
    /** Resolve the MCP handshake and return the discovered tool list. */
    async connect() {
      await rpc('initialize', {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'dsh-causal-memory-plugin', version: '1.0.0' },
      })
      notify('notifications/initialized')
      const list = await rpc('tools/list', {})
      return list.tools ?? []
    },
    async call(toolName, args, signal) {
      if (signal?.aborted) throw new Error(`causal-memory: ${toolName} aborted before call`)
      const result = await rpc('tools/call', { name: toolName, arguments: args ?? {} })
      const text = (result.content ?? [])
        .filter((block) => block.type === 'text' && typeof block.text === 'string')
        .map((block) => block.text)
        .join('\n')
      if (result.isError === true) throw new Error(text || `causal-memory tool ${toolName} failed`)
      return text
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/index.js:269-295](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/index.js#L269-L295)

数据库和子进程环境。

<details>
<summary>查看原文（27行）</summary>

```text
export async function apply(ctx, config = {}) {
  const command = resolveCommand(config.command)
  const dbPath = config.dbPath ?? process.env.CAUSAL_MEMORY_DB ?? DEFAULT_DB()
  const timeoutMs = config.toolCallTimeoutMs ?? DEFAULT_TIMEOUT_MS
  const exclude = new Set(Array.isArray(config.exclude) ? config.exclude : [])
  const failOnStartupError = config.failOnStartupError !== false

  // Extra env for the child. Needed because the server reads its LLM / embed
  // configuration from the environment (CAUSAL_MEMORY_LLM_API / _KEY / _MODEL,
  // CAUSAL_MEMORY_EMBED_*). Without this the tools that delegate to an LLM —
  // resolve_updates, reconstruct_lesson's narrative + calibration, and the
  // extraction path behind `remember` — silently degrade to their rule-based
  // fallbacks. Values in config.env win over the ambient environment; non-string
  // values are dropped rather than coerced, so `!!js` expressions that evaluate
  // to undefined cannot kill the child at spawn.
  const configEnv = config.env && typeof config.env === 'object' && !Array.isArray(config.env)
    ? config.env
    : {}
  const envFromConfig = Object.fromEntries(
    Object.entries(configEnv)
      .filter(([, value]) => typeof value === 'string' && value.length > 0),
  )
  const droppedEnvKeys = Object.keys(configEnv).filter((key) => !(key in envFromConfig))
  if (droppedEnvKeys.length > 0) {
    ctx.logger.warn(`causal-memory: ignored non-string config.env value(s): ${droppedEnvKeys.join(', ')}`)
  }
  const childEnv = { ...process.env, ...envFromConfig, CAUSAL_MEMORY_DB: dbPath }
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/README.md:61-76](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/README.md#L61-L76)

作者说明静默降级。

<details>
<summary>查看原文（16行）</summary>

````text
### 用 `env` 打开 LLM 能力（可选）

服务端从环境变量读 LLM / Embed 配置。缺了它，依赖 LLM 的工具会**静默降级**成规则回退——`resolve_updates`、`reconstruct_lesson` 的叙事与 calibrate、以及 `remember` 的自动抽取都会被影响：

```yaml
    - id: causal-memory-plugin
      name: causal-memory-dsh-plugin
      config:
        env:
          # 注意：此值是 base URL，源码会自行追加 /chat/completions
          CAUSAL_MEMORY_LLM_API: https://api.deepseek.com/v1
          CAUSAL_MEMORY_LLM_KEY: !!js process.env.DEEPSEEK_API_KEY || ''
          CAUSAL_MEMORY_LLM_MODEL: deepseek-chat
```

⚠️ `CAUSAL_MEMORY_LLM_API` 必须填 **base**（`https://api.deepseek.com/v1`）。填成完整路径 `.../v1/chat/completions` 会被再拼一次，得到 `.../chat/completions/chat/completions` → 404，而工具**不会报错**，只会悄悄退回规则路径。密钥建议走环境变量或 vault，不要明文写进本文件。
````

</details>

#### 缺口

- 没验证超时后的实际写入与多项目隔离
  **影响**：重试可能重复写入或错误归因
  **进一步探讨**：注入迟到返回，分别查询 DB 和工具结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样开始可复验的记忆试用？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

先在隔离数据库固定几个决策与反例，核对关键词和语义配置下的召回，明确每次查询是否用了 embedding。对照简单 Markdown 经验表，测答对率、误召回和 token 成本。若同库混入无关事实或迟到写入无法判断，切回显式查阅与独立库。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/index.js:269-295](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/index.js#L269-L295)

可设置独立 DB 和配置。

<details>
<summary>查看原文（27行）</summary>

```text
export async function apply(ctx, config = {}) {
  const command = resolveCommand(config.command)
  const dbPath = config.dbPath ?? process.env.CAUSAL_MEMORY_DB ?? DEFAULT_DB()
  const timeoutMs = config.toolCallTimeoutMs ?? DEFAULT_TIMEOUT_MS
  const exclude = new Set(Array.isArray(config.exclude) ? config.exclude : [])
  const failOnStartupError = config.failOnStartupError !== false

  // Extra env for the child. Needed because the server reads its LLM / embed
  // configuration from the environment (CAUSAL_MEMORY_LLM_API / _KEY / _MODEL,
  // CAUSAL_MEMORY_EMBED_*). Without this the tools that delegate to an LLM —
  // resolve_updates, reconstruct_lesson's narrative + calibration, and the
  // extraction path behind `remember` — silently degrade to their rule-based
  // fallbacks. Values in config.env win over the ambient environment; non-string
  // values are dropped rather than coerced, so `!!js` expressions that evaluate
  // to undefined cannot kill the child at spawn.
  const configEnv = config.env && typeof config.env === 'object' && !Array.isArray(config.env)
    ? config.env
    : {}
  const envFromConfig = Object.fromEntries(
    Object.entries(configEnv)
      .filter(([, value]) => typeof value === 'string' && value.length > 0),
  )
  const droppedEnvKeys = Object.keys(configEnv).filter((key) => !(key in envFromConfig))
  if (droppedEnvKeys.length > 0) {
    ctx.logger.warn(`causal-memory: ignored non-string config.env value(s): ${droppedEnvKeys.join(', ')}`)
  }
  const childEnv = { ...process.env, ...envFromConfig, CAUSAL_MEMORY_DB: dbPath }
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/index.js:327-346](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/index.js#L327-L346)

不同工具的召回边界。

<details>
<summary>查看原文（20行）</summary>

```text
      + 'Retrieval and its failure modes — read this before concluding a tool is broken:\n'
      + (embedLive
        ? '- Retrieval is BM25 fused with semantic cosine over embeddings.\n'
        : '- Retrieval is BM25 keyword matching only (no embedding endpoint configured), so '
          + 'QUOTE THE ORIGINAL WORDING: reuse the exact words a lesson was recorded with, '
          + 'especially the outcome polarity (成功 / 失败 / 无效 / no_effect). An abstract '
          + 'paraphrase can miss an edge that exists — that is a phrasing mismatch, not a '
          + 'missing memory. Configure CAUSAL_MEMORY_EMBED_* to add the semantic leg.\n')
      + '- `trace_cause` is single-hop and needs lexical overlap with the recorded OUTCOME '
      + 'text; if it returns nothing, retry with the original wording before giving up.\n'
      + '- `trace_cause_chain` returns empty until the graph holds multi-hop chains (it needs '
      + '>1 hop). An empty result means "not enough depth yet", never "broken".\n'
      + '- `search_patterns` returns empty until pattern mining has produced meta-edges. An '
      + 'empty result means "not mined yet", never "broken". Neither tool is worth skipping '
      + 'permanently: the store grows.\n'
      + '- `counterfactual_query` matches DECISION text — put the alternative you are weighing '
      + 'verbatim in the decision string, or it returns insufficient evidence.\n'
      + '- A prediction from `counterfactual_query` resolves only when a later `record_decision` '
      + 'under the SAME task_tag carries matching text; comparing two already-recorded options '
      + 'leaves it pending by design. An empty report is not a broken ledger.\n'
```

</details>

#### 缺口

- 没有当前宿主实际节时证据
  **影响**：不能估计维护工时和模型费用
  **进一步探讨**：小型对照含更新、否定、跨项目和迟到请求

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
