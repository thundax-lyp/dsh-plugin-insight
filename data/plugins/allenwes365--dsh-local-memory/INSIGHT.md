# DSH Local Memory

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[45045e4](https://github.com/AllenWES365/dsh-local-memory/tree/45045e44ffebecceca4f68ab4351895148bbc696)

<!-- BEGIN META -->
[![npm 30d 137](https://img.shields.io/static/v1?label=npm+30d&message=137&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-local-memory) [![最新发布 2026-09-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-local-memory)
<!-- END META -->

> **实现功能**：保留Hindsight项目分库，提供跨库查询、项目记忆状态总览与Git历史播种入口。

> **核心亮点**：相对Hindsight平级分库，增量是读取时跨库视图与“发现缺失→播种→核对状态”闭环；不复制总库，不将上游抽取引擎算作自身创新。[Q01](#research-q01) [Q02](#research-q02)

> **风险与缺陷**：项目隔离能否成立取决于库身份。源码只用目录basename，同名仓库会映射到同库；分库不是访问控制，本地daemon也不自动代表离线LLM处理。[Q03](#research-q03)

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 跨库视图和项目播种相对原生分库改变了什么？](#detail-section-11)
  - [Q02 · 库名、召回与播种如何连接，怎样保持结果边界？](#detail-section-12)
  - [Q03 · 同名项目和上游daemon依赖怎样限制隔离与成本？](#detail-section-13)
  - [Q04 · 怎样改进项目身份并界定可控试用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多项目维护者需要知道哪个项目缺记忆并对指定项目联合查询；合格结果必须有库归属和缺失诊断。

简单替代为手工列Hindsight库并逐个recall，或共享总库；插件避免复制但仍依赖上游命名和召回质量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 跨库召回 | 查询若干项目并分库展示 | 单库失败隔离；最多展示若干条不代表后端少检索 |
| 项目记忆总览 | 对照工作区发现缺失/陈旧记忆 | 扫描深度有限，basename同名会碰撞 |
| 历史播种 | 调用上游deepen建立/更新库 | 只接受发现的Git项目；落地不等于抽取全部完成 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Hindsight daemon及插件 | 必需 | 提供库API和抽取引擎 | 无后端即无数据，发现不到deepen不能播种 |
| LLM环境/本地provider | 播种抽取必需 | 生成记忆事实 | 云端可能收费/传出信息；离线需本地模型 |
| 工作区与唯一项目库身份 | 效果必需 | 发现与正确归属 | 同名目录先人工核查，不能默认隔离 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备后端 | 用户配置daemon/LLM并安装插件 | 库API可读且工具出现 |
| 发现并播种 | 插件列项目，用户选Git项目 | 核对gitlog标记与实际事实数，不能只看spawn |
| 定向查询 | 用户指定库并核对已知事实 | 结果按库归属；失败库单列，错配立即停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | daemon、LLM抽取与本地存储 | 配置工作区和检查库身份 | 金额、配置耗时未测 |
| 持续使用 | 查询后端资源和新增抽取费用 | 选库与核对过时/错误事实 | 作者性能报告非本轮测量 |
| 失败恢复 | 重复播种/查询资源及日志 | 核对进程、标记与重试结果 | 只启动子进程不能当成功，恢复时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 聚合与缺失诊断 | 源码比对目录和库，无第二副本 | 是否降低最终回答错误和人工时间 |
| 检索表现 | 作者报告不同库规模延迟 | 本轮无独立性能复现 |
| 项目隔离 | 按上游basename库名约定 | 同名项目、重命名及权限隔离不保证 |

> **思考**：项目隔离能否成立取决于库身份。源码只用目录basename，同名仓库会映射到同库；分库不是访问控制，本地daemon也不自动代表离线LLM处理。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对Hindsight平级分库，增量是读取时跨库视图与“发现缺失→播种→核对状态”闭环；不复制总库，不将上游抽取引擎算作自身创新。[Q01](#research-q01) [Q02](#research-q02)

相对Hindsight平级分库，增量是读取时跨库视图与“发现缺失→播种→核对状态”闭环；不复制总库，不将上游抽取引擎算作自身创新。[Q01](#research-q01) [Q02](#research-q02)

单库失败局部化、结果截断说明与播种进度看证据值得借鉴；basename身份、文档列表limit=200与有界扫描限制完整性。移植需对齐后端身份/播种协议和错误语义，不能只复用HTTP并发。

<a id="detail-section-5"></a>

### 1.4 主要限制

项目隔离能否成立取决于库身份。源码只用目录basename，同名仓库会映射到同库；分库不是访问控制，本地daemon也不自动代表离线LLM处理。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

已有稳定daemon且库名唯一的多项目用户可试用，先显式指定少数库并核对事实；强隔离或同名项目应暂缓跨库汇总。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查只读聚合、项目发现和播种接线；本轮未运行daemon，basename命名限制已识别。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的作者材料与关键源码只读核查；未安装或执行目标代码，未运行作者测试，未安排真实宿主验收。引用的既有作者运行记录不视为本轮独立验证。
- 下一步：用两个同名仓库、worktree和陈旧gitlog构造归属对照；另测合格回答率、所有召回/抽取资源与人工时间。本轮未执行。

**分析版本**

- **仓库**：[AllenWES365/dsh-local-memory](https://github.com/AllenWES365/dsh-local-memory)
- **版本号**：0.1.0（[固定提交 45045e4](https://github.com/AllenWES365/dsh-local-memory/tree/45045e44ffebecceca4f68ab4351895148bbc696)）
- **版本日期**：2026-09-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是增加稳定项目身份映射和同名碰撞预警，在不破坏上游库命名兼容的条件下改善归属可信度；用同名、worktree和重命名矩阵比较误归属与维护负担。[Q04](#research-q04)

用两个同名仓库、worktree和陈旧gitlog构造归属对照；另测合格回答率、所有召回/抽取资源与人工时间。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1967 | 1477 | 357 | — |
| .md | source | 2 | 523 | — | — | 4403 |
| .mjs | test | 7 | 2446 | 2026 | 258 | — |
| .mjs | example | 1 | 29 | 12 | 14 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AllenWES365/dsh-local-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AllenWES365/dsh-local-memory/issues?q=is%3Aissue+created%3A2026-09-23T07%3A58%3A08.706Z..2026-10-23T07%3A58%3A08.706Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AllenWES365/dsh-local-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T07%3A58%3A08.706Z..2026-10-23T07%3A58%3A08.706Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨项目记忆视图和播种如何补足分库管理，身份隔离和检索边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨库视图和项目播种相对原生分库改变了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向同时维护多个Git项目、又需要跨项目询问记忆的DSH用户。合格结果是能区分哪些项目已有记忆、哪些缺失，以及回答来自哪个库；不是仅列出存在的库。作者以Hindsight平级库为基线，保留每项目一库并在读取时聚合，无需维护另一份总库副本；另用工作区目录发现预期项目，补足“没有记忆”和“没有项目”难以区分的问题。源码的discoverProjects将工作区路径与daemon实际库比对，并检查gitlog标记，播种直接调用上游deepen.js，因此抽取引擎和持久化能力归Hindsight，插件增量是视图、诊断和操作闭环。README中的性能数值是作者环境报告，本轮没有重现，不能外推所有库或证明任务回答更准。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-48](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/README.md#L30-L48)

作者明确共享库/分库的选择及无副本聚合基线。

<details>
<summary>查看原文（19行）</summary>

```text

---

## 它解决什么问题

Hindsight 的记忆库是**平级**的——没有层级，没有"总库管理分库"这回事。所以原生只有两个选择：

| 方案 | 结果 |
| --- | --- |
| 一个共享库 | CEO 视角能看到全部 ✅ 但项目之间**不再隔离**（检索是库级的）❌ |
| 每个项目一个库 | 隔离干净 ✅ 但**总视角那个库永远是空的** ❌ |

**这个插件保留"每项目一库"（Hindsight 原生就做得好），再在读取时补上缺失的跨库视角。**

聚合结果是一份**视图**，不是第二份副本——所以没有东西需要同步，也不会有数据重复。

### 还有一个更隐蔽的缺口

「库列表」只能回答**"我记得什么"**。它回答不了**"我该记得什么"**——**一个从没被工作过的项目根本不在列表里，沉默和不存在的表现一模一样。**
```

</details>

**依据 2 · 源码核查**：[lib/index.js:590-635](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/lib/index.js#L590-L635)

目录发现与实际库比对支持识别缺失记忆的工作流贡献。

<details>
<summary>查看原文（46行）</summary>

```text
  const discoverProjects = async () => {
    if (scanCache.value !== undefined && Date.now() - scanCache.at < SCAN_TTL_MS) {
      return scanCache.value
    }
    pruneSeeds()

    // Roots come from the durable workspace registry when it is available; the
    // session's own directory is always a root, so discovery still works before
    // the registry has loaded.
    const roots = []
    const push = (value) => {
      if (typeof value === 'string' && value !== '' && !roots.includes(value)) roots.push(value)
    }
    const registry = ctx.get('workspaceRegistry')
    if (registry !== undefined && typeof registry.list === 'function') {
      try {
        for (const workspace of registry.list()) push(workspace?.path)
      } catch {
        // A registry that will not enumerate must not break discovery.
      }
    }
    push(config.root)

    const paths = new Set()
    for (const root of roots) {
      // The root ITSELF is a candidate: a session started there gets a bank named
      // after the directory, whether or not the directory is a repository. Setting
      // a working root to a plain folder is the normal case here, and omitting it
      // reported its bank as matching no project.
      paths.add(root)
      for (const project of findProjects(root, scanDepth)) paths.add(project)
    }

    const banks = new Map((await listBanksDetailed()).map((bank) => [bank.id, bank]))
    const projects = []
    for (const path of [...paths].sort()) {
      const bankId = bankIdForProject(path)
      const bank = banks.get(bankId)
      if (bank !== undefined) banks.delete(bankId)
      const git = gitInfoFor(path)

      // The `gitlog:` document is the plugin's own marker for "git history has
      // been ingested". Reading it is how this view can tell a bank that was
      // created by a conversation apart from one that actually holds history —
      // they look identical in the bank list, and only the first is `synced`.
      const seeded = bank === undefined ? undefined : await gitlogStateOf(bankId)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:539-562](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/lib/index.js#L539-L562)

播种调用上游deepen入口，归属应区分。

<details>
<summary>查看原文（24行）</summary>

```text
   * Start the Hindsight seeding engine for one repository.
   *
   * This runs the plugin's own `deepen.js`, detached, exactly as that plugin
   * does on session start — same bank, same `gitlog` strategy, same target. It
   * is not a reimplementation of the seeding logic, so there is nothing here
   * that can drift away from what a session would have produced.
   */
  const startSeed = (projectPath) => {
    if (seedEngine === null) {
      return { ok: false, error: '找不到 Hindsight 的播种引擎（deepen.js）' }
    }
    if (seedsInFlight.has(projectPath)) return { ok: false, error: '这个项目正在播种中' }
    if (!gitInfoFor(projectPath).isGit) return { ok: false, error: '不是 git 仓库，没有历史可播种' }
    try {
      const child = spawn(process.execPath, [
        seedEngine,
        '--repo', projectPath,
        '--harness', seedHarness,
        '--gitlog-limit', String(seedLimit),
      ], { detached: true, stdio: 'ignore', windowsHide: true })
      child.on('error', () => {})
      child.unref()
      seedsInFlight.set(projectPath, { startedAt: Date.now(), pid: child.pid })
      return { ok: true, bankId: bankIdForProject(projectPath), pid: child.pid }
```

</details>

#### 缺口

- 跨项目答案的正确性与人工节时未独立测量
  **影响**：只确认操作机制，不能声称记忆提升质量
  **进一步探讨**：同一项目集合比较人工逐库查询和聚合查询的来源完整性、错误和时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 库名、召回与播种如何连接，怎样保持结果边界？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

host以daemon HTTP API列库和召回，默认127.0.0.1:9077、单请求20秒超时、并发6、每库最多展示5条。recallOne先只取observation，没有结果才退到全类型，单库错误被封装而不让其余库中止；最终按库输出并明确省略条数。这个fallback解决新写入尚未合并的空结果，但也使结果语义可能从整合事实变成原始记忆，调用者仍需核对来源。项目发现按工作区有界扫描，Git worktree指针作专门处理，库名采用coding-agent::加目录basename。播种只允许已发现的绝对Git项目路径，由分离的子进程执行上游引擎；进度依据gitlog落地时间或进程是否存活，不能把开始spawn等同于事实抽取完成。四个模型工具及设置页面/运维Skill形成接线，既有测试文件仅作覆盖设计材料，未执行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:301-325](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/lib/index.js#L301-L325)

默认超时、并发和展示上限属于客户端负担控制，不是daemon加速证明。

<details>
<summary>查看原文（25行）</summary>

```text
/** Tuned defaults; every one is overridable from the profile patch `config`. */
const DEFAULT_API_URL = 'http://127.0.0.1:9077'
const DEFAULT_TIMEOUT_MS = 20000
const DEFAULT_CONCURRENCY = 6
/** Hits kept per bank. A bank can return dozens; uncapped output floods the turn. */
const DEFAULT_MAX_PER_BANK = 5
/**
 * When a sweep is slow, say so and say why. The time threshold comes from
 * measurement, not guessing: a bank holding ~60 memories really does cost about
 * a second, so anything past this is worth explaining.
 */
const WIDE_SEARCH_BANKS = 8
const SLOW_SEARCH_MS = 1000

export function apply(ctx, config = {}) {
  const apiUrl = String(config.apiUrl ?? DEFAULT_API_URL).replace(/\/+$/, '')
  const bankPrefix = typeof config.bankPrefix === 'string' && config.bankPrefix !== ''
    ? config.bankPrefix
    : ''
  const timeoutMs = Number.isFinite(config.timeoutMs) ? config.timeoutMs : DEFAULT_TIMEOUT_MS
  const concurrency = Number.isFinite(config.concurrency) && config.concurrency > 0
    ? Math.floor(config.concurrency)
    : DEFAULT_CONCURRENCY
  const maxPerBank = Number.isFinite(config.maxPerBank) && config.maxPerBank > 0
    ? Math.floor(config.maxPerBank)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:425-436](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/lib/index.js#L425-L436)

先observation再fallback，单库错误隔离。

<details>
<summary>查看原文（12行）</summary>

```text
  const recallOne = async (bankId, query) => {
    const path = `/v1/default/banks/${encodeURIComponent(bankId)}/memories/recall`
    try {
      const observations = extractTexts(
        await daemonPost(path, { query, types: ['observation'] }),
      )
      if (observations.length > 0) return { bankId, texts: observations, error: undefined }
      const all = extractTexts(await daemonPost(path, { query }))
      return { bankId, texts: all, error: undefined }
    } catch (error) {
      return { bankId, texts: [], error: error instanceof Error ? error.message : String(error) }
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:850-902](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/lib/index.js#L850-L902)

显式选库、并发召回、去重与截断展示。

<details>
<summary>查看原文（53行）</summary>

```text
          },
          banks: {
            type: 'string',
            description:
              'Optional comma-separated bank ids to restrict the search. Omit to search all banks.',
          },
        },
        required: ['query'],
      },
      output: textOutput(),
      async execute(args) {
        const query = typeof args?.query === 'string' ? args.query.trim() : ''
        if (query === '') return 'memory_recall_all needs a non-empty query.'

        let targets
        try {
          if (typeof args?.banks === 'string' && args.banks.trim() !== '') {
            targets = args.banks.split(',').map((id) => id.trim()).filter((id) => id !== '')
          } else {
            targets = await listBanks()
          }
        } catch (error) {
          const detail = error instanceof Error ? error.message : String(error)
          return `Cannot reach the local memory daemon at ${apiUrl}.\n${detail}`
        }

        if (targets.length === 0) return 'No memory banks to search.'

        const startedAt = Date.now()
        const results = await mapLimit(targets, concurrency, (bankId) => recallOne(bankId, query))
        const elapsedMs = Date.now() - startedAt

        const sections = []
        const failures = []
        for (const result of results) {
          if (result.error !== undefined) {
            failures.push(`- ${result.bankId}: ${result.error}`)
            continue
          }
          if (result.texts.length === 0) continue
          const seen = new Set()
          const unique = []
          for (const text of result.texts) {
            if (seen.has(text)) continue
            seen.add(text)
            unique.push(text)
          }
          // Cap each bank so one deep bank cannot drown the others, and say so
          // rather than silently dropping the rest.
          const kept = unique.slice(0, maxPerBank)
          const overflow = unique.length - kept.length
          const more = overflow > 0 ? `\n- … ${overflow} more in this bank` : ''
          sections.push(`## ${result.bankId}\n${kept.map((t) => `- ${t}`).join('\n')}${more}`)
```

</details>

**依据 4 · 源码核查**：[lib/index.js:546-587](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/lib/index.js#L546-L587)

播种入口与已发现项目授权边界。

<details>
<summary>查看原文（42行）</summary>

```text
  const startSeed = (projectPath) => {
    if (seedEngine === null) {
      return { ok: false, error: '找不到 Hindsight 的播种引擎（deepen.js）' }
    }
    if (seedsInFlight.has(projectPath)) return { ok: false, error: '这个项目正在播种中' }
    if (!gitInfoFor(projectPath).isGit) return { ok: false, error: '不是 git 仓库，没有历史可播种' }
    try {
      const child = spawn(process.execPath, [
        seedEngine,
        '--repo', projectPath,
        '--harness', seedHarness,
        '--gitlog-limit', String(seedLimit),
      ], { detached: true, stdio: 'ignore', windowsHide: true })
      child.on('error', () => {})
      child.unref()
      seedsInFlight.set(projectPath, { startedAt: Date.now(), pid: child.pid })
      return { ok: true, bankId: bankIdForProject(projectPath), pid: child.pid }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) }
    }
  }

  /**
   * Reject anything that is not a repository already found by discovery.
   *
   * The route spawns a process, so the path it accepts must be one this plugin
   * itself discovered — never an arbitrary string from the page. Re-running the
   * same discovery (which is cached) is the check: membership in that set is the
   * authorisation, and it is the same set the buttons were drawn from.
   */
  const authoriseSeed = async (rawPath) => {
    if (typeof rawPath !== 'string' || rawPath === '' || !isAbsolute(rawPath)) {
      return { ok: false, error: 'path 必须是绝对路径' }
    }
    const wanted = resolve(rawPath)
    const data = await discoverProjects()
    const hit = data.projects.find((project) => project.path === wanted)
    if (hit === undefined) {
      return { ok: false, error: '这个路径不在已发现的项目里' }
    }
    if (!hit.isGit) return { ok: false, error: '不是 git 仓库，没有历史可播种' }
    return { ok: true, project: hit }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:637-648](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/lib/index.js#L637-L648)

标记落地和进程退出用于结束播种展示。

<details>
<summary>查看原文（12行）</summary>

```text
      // Retire a finished run HERE, against evidence, rather than on a timer.
      //
      // This is not bookkeeping: `seeding` drives the button's label, and a flag
      // that only ever expires made the page say "播种中…" under a line that
      // already read "播种完成" — observed in a real browser. A run is over when
      // the bank's own timestamp for when git history landed is at or after the
      // moment it started, or when the process is simply gone.
      const started = seedsInFlight.get(path)
      if (started !== undefined) {
        const landedAt = seeded?.at === undefined ? NaN : Date.parse(seeded.at)
        const landed = !Number.isNaN(landedAt) && landedAt >= started.startedAt - 60000
        if (landed || !isProcessAlive(started.pid)) seedsInFlight.delete(path)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 同名项目和上游daemon依赖怎样限制隔离与成本？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

“每项目一库”依赖目录名足以代表项目，但bankIdForProject只取basename。同一工作区不同路径的同名仓库会预测相同库名；discoverProjects又按bankId从Map删除已匹配库，后一项目可能被报为缺失或播种至同一库。因此源码支持的是上游命名约定下的逻辑分库，不是普遍项目身份隔离，更不是用户间访问控制。显式banks输入也只是请求目标，不是权限边界。另一个价值限制是本地不等于全离线：daemon事实抽取依赖LLM，README仅在本地provider如Ollama配置下描述离线；其性能测量不能当独立实测。首次需安装Hindsight、设daemon环境与工作区；持续查询可能全库扇出且结果截断不减少daemon已做工作；失败恢复需核对抽取进程与gitlog证据并重试，不按按钮状态猜完成。现金、内存和人工量未测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:44-50](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/lib/index.js#L44-L50)

库身份以目录basename命名，存在同名碰撞条件。

```text
 * `bankId` is derived exactly the way the Hindsight plugin derives it — the
 * rule is `coding-agent::` + the main worktree's directory name, resolved from
 * `git rev-parse --git-common-dir`. Worktrees therefore resolve to the main
 * checkout's name, which is what the plugin does too, so a prediction here and
 * a bank created later agree.
 */
const bankIdForProject = (root) => `coding-agent::${basename(root)}`
```

**依据 2 · 源码核查**：[lib/index.js:623-635](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/lib/index.js#L623-L635)

相同bankId匹配与删除的具体逻辑限制完整项目映射。

<details>
<summary>查看原文（13行）</summary>

```text
    const banks = new Map((await listBanksDetailed()).map((bank) => [bank.id, bank]))
    const projects = []
    for (const path of [...paths].sort()) {
      const bankId = bankIdForProject(path)
      const bank = banks.get(bankId)
      if (bank !== undefined) banks.delete(bankId)
      const git = gitInfoFor(path)

      // The `gitlog:` document is the plugin's own marker for "git history has
      // been ingested". Reading it is how this view can tell a bank that was
      // created by a conversation apart from one that actually holds history —
      // they look identical in the bank list, and only the first is `synced`.
      const seeded = bank === undefined ? undefined : await gitlogStateOf(bankId)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:866-879](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/lib/index.js#L866-L879)

显式banks直接形成目标列表，非权限管理。

<details>
<summary>查看原文（14行）</summary>

```text
          if (typeof args?.banks === 'string' && args.banks.trim() !== '') {
            targets = args.banks.split(',').map((id) => id.trim()).filter((id) => id !== '')
          } else {
            targets = await listBanks()
          }
        } catch (error) {
          const detail = error instanceof Error ? error.message : String(error)
          return `Cannot reach the local memory daemon at ${apiUrl}.\n${detail}`
        }

        if (targets.length === 0) return 'No memory banks to search.'

        const startedAt = Date.now()
        const results = await mapLimit(targets, concurrency, (bankId) => recallOne(bankId, query))
```

</details>

**依据 4 · 作者声明**：[README.md:103-153](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/README.md#L103-L153)

作者说明Hindsight daemon与环境LLM配置。

<details>
<summary>查看原文（51行）</summary>

````text
```

装完**重启 DSH**，然后在 **设置 → 本地记忆** 看到界面。

这条命令是验证过的：在一个干净的 profile 里（`--from-default-profile web` 初始化、全新的 `DSH_HOME`）执行它，命令会自动把这个包加进 `dsh.profile.bundles` 并挂载，界面和路由都正常。

> 本插件**尚未发布到 npm**，所以 `add dsh-local-memory` 这种写法在别人机器上会失败——请用上面的 GitHub 地址。
>
> 从本地源码开发时才用 `dsh plugin --profile web add link:$PWD`。

## 前置配置（一次性）

配置文件在 `~/.hindsight/coding-agent.json`，**正确内容就是这一行**：

```json
{ "serverMode": "daemon" }
```

### 为什么不能多写

| 字段 | 后果 |
| --- | --- |
| `bankId` | **强制所有项目共用一个库**——项目隔离和跨库视角同时失效。**危害最大的一个设置。** |
| `retainTags` / `retainMetadata` | 每个库本来就是项目，多余 |
| `observationScopes` | 默认 `shared` 才对；`combined` 只是"单库内假装分区"的补丁 |

### LLM key 不在配置文件里

事实提取需要一个 LLM。它**只能通过环境变量**传给 daemon：

```sh
export HINDSIGHT_API_LLM_PROVIDER=deepseek
export HINDSIGHT_API_LLM_MODEL=deepseek-v4-flash
export HINDSIGHT_API_LLM_API_KEY=...
```

写进 `~/.zshrc` 之后**必须开新终端**——`.zshrc` 每个交互式 shell 只读一次，在旧终端里重启 `dsh web` 什么也不会生效。

用 `ollama` 做 provider 可以做到**完全离线**。

## 库名规则

| 会话所在目录 | 库名 |
| --- | --- |
| `/Volumes/SSD-2TB`（不是 git 仓库 → 用目录名兜底） | `coding-agent::SSD-2TB` |
| `…/project/verify` | `coding-agent::verify` |
| `…/Loop` | `coding-agent::Loop` |

规则是 `coding-agent::` + 项目目录名，**全自动**。库在某个项目里第一次记录内容时创建——你还没进去工作过的项目没有库，这是正常的。

## 性能：老实说
````

</details>

#### 缺口

- 同名目录碰撞未在真实daemon中执行复现
  **影响**：源码可识别命名约束，实际库写入后果仍需专门验收
  **进一步探讨**：以不同路径同名两仓库播种不同事实，检查库ID与查询归属

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样改进项目身份并界定可控试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是在保持上游库名兼容的前提下，新增规范项目路径/远端身份到库的显式映射与碰撞预警，比悄悄合并同名项目更能保持视图可信。推导来自basename碰撞和读取时聚合的设计，新增成本是迁移旧库、处理重命名和worktree共用身份，不能只给名称加随机后缀便宣称兼容。最小验证包含两个同名仓库、worktree、重命名路径、只由对话建立的库和陈旧gitlog，对照当前推导与显式映射，验收每条事实归属及缺失诊断；如果映射维护成本高于误归属减少则不支持。对库名唯一且已经有稳定Hindsight daemon的用户可trial，从显式选一两个库开始，并拿已知事实核对回答。对存在同名项目、强隔离要求或无能力维护daemon的人应先观察；发生归属错配即停止跨库汇总，不自动重播种。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:44-50](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/lib/index.js#L44-L50)

身份约定产生具体改进空间。

```text
 * `bankId` is derived exactly the way the Hindsight plugin derives it — the
 * rule is `coding-agent::` + the main worktree's directory name, resolved from
 * `git rev-parse --git-common-dir`. Worktrees therefore resolve to the main
 * checkout's name, which is what the plugin does too, so a prediction here and
 * a bank created later agree.
 */
const bankIdForProject = (root) => `coding-agent::${basename(root)}`
```

**依据 2 · 源码核查**：[lib/index.js:576-587](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/lib/index.js#L576-L587)

项目授权集合可作为映射校验接点。

<details>
<summary>查看原文（12行）</summary>

```text
  const authoriseSeed = async (rawPath) => {
    if (typeof rawPath !== 'string' || rawPath === '' || !isAbsolute(rawPath)) {
      return { ok: false, error: 'path 必须是绝对路径' }
    }
    const wanted = resolve(rawPath)
    const data = await discoverProjects()
    const hit = data.projects.find((project) => project.path === wanted)
    if (hit === undefined) {
      return { ok: false, error: '这个路径不在已发现的项目里' }
    }
    if (!hit.isGit) return { ok: false, error: '不是 git 仓库，没有历史可播种' }
    return { ok: true, project: hit }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:623-635](https://github.com/AllenWES365/dsh-local-memory/blob/45045e44ffebecceca4f68ab4351895148bbc696/lib/index.js#L623-L635)

实际库与预期项目的比对提供验收目标。

<details>
<summary>查看原文（13行）</summary>

```text
    const banks = new Map((await listBanksDetailed()).map((bank) => [bank.id, bank]))
    const projects = []
    for (const path of [...paths].sort()) {
      const bankId = bankIdForProject(path)
      const bank = banks.get(bankId)
      if (bank !== undefined) banks.delete(bankId)
      const git = gitInfoFor(path)

      // The `gitlog:` document is the plugin's own marker for "git history has
      // been ingested". Reading it is how this view can tell a bank that was
      // created by a conversation apart from one that actually holds history —
      // they look identical in the bank list, and only the first is `synced`.
      const seeded = bank === undefined ? undefined : await gitlogStateOf(bankId)
```

</details>

#### 缺口

- 显式映射方案尚未实现与迁移验证
  **影响**：属于设计假设而非现有隔离能力
  **进一步探讨**：用碰撞、重命名和worktree矩阵验证正确性与操作成本

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
