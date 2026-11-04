# rdd-explore

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[01e52f9](https://github.com/YaphetHayate/codeRDD/tree/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/dsh-rdd-explore)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/YaphetHayate/codeRDD)
<!-- END META -->

> **功能**：为 DSH 提供代码探索缓存查询、子代理派遣和模型目录。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将现有探索索引和子代理组合成缓存优先工具。

> **主要限制**：[Q02](#research-q02) 锚点有效不证明摘要完整或新文件未改变答案；[Q03](#research-q03) 可选向量服务有外发边界。

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
  - [Q01 · 探索缓存工具为谁提供什么，相对原生搜索和子代理有什么增量？](#detail-section-11)
  - [Q02 · 命中、新鲜度和未命中派遣如何工作？](#detail-section-12)
  - [Q03 · 使用缓存、模型及外部向量服务需要什么条件？](#detail-section-13)
  - [Q04 · 怎样验证缓存候选缺少新依赖时的检测改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在同一代码库反复研究实现的 DSH 使用者。

原生 grep/glob 和子代理可直接搜索，缓存增加跨查询复用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 缓存候选 | 复用代码探索 | 只校验已记录锚点 |
| worker 派遣 | 未命中时探索 | 工具过滤依配置 |
| 向量召回 | 辅助相关性排序 | 向配置端点发送文本与令牌 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH tools、subagents、llm | 工具需要 | 注册和派遣 | 不可用或兼容未知 |
| 可写项目缓存 | 注册需要 | 保存探索结果 | 失败需回退搜索 |
| 四项只读工具配置 | 默认 worker 边界 | 代码研究 | 其他装载须重核 |
| 向量端点与密钥 | 可选 | 语义召回 | 缺条件时禁用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核宿主、缓存及端点 | 敏感数据不外发 |
| 查询 | 搜索并检查候选 | 回源核摘要与锚点 |
| 派遣 | 缺候选或强制时启动 worker | 核过滤和结构化输出 |
| 恢复 | 误命中或失败时使用 grep/glob | 不把候选当完整答案 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 模型及缓存资源未知 | 检查配置和权限 | 兼容未测 |
| 持续 | 模型和向量请求费用未知 | 核缓存结果 | 命中率和节时未知 |
| 恢复 | 重查及存储开销未知 | 回源和清理 | 故障恢复未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 缓存复用 | 哈希过滤和候选返回 | 相关性与完整性 |
| 未命中派遣 | subagent 接线及插件注册 | 宿主实际权限和质量 |
| 向量召回 | 条件启用及网络请求 | 费用、隐私和效果 |

> **思考**：[Q02](#research-q02) 锚点有效不证明摘要完整或新文件未改变答案；[Q03](#research-q03) 可选向量服务有外发边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将现有探索索引和子代理组合成缓存优先工具。

[Q02](#research-q02) 区分缓存候选和派遣；锚点校验范围不能替代语义复核。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 锚点有效不证明摘要完整或新文件未改变答案；[Q03](#research-q03) 可选向量服务有外发边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 以非敏感项目核权限与端点，结果回源码验证；不满足条件时退回原生搜索。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

定向静态核查固定版本缓存、派遣和向量请求；未运行宿主或子代理。

- 已检查：作者 README、包清单、源码路径 dsh/dsh-rdd-explore/README.md、dsh/dsh-rdd-explore/package.json、dsh/dsh-rdd-explore/cordis.patch.yml、dsh/dsh-rdd-explore/src/index.ts、dsh/dsh-rdd-explore/src/cache.ts、dsh/dsh-rdd-explore/src/recallers/vector.ts 及固定范围 inventory；组件：dsh/dsh-rdd-explore。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 package、bundle patch、工具命中/派遣、新鲜度和向量请求；未全审检索算法、宿主沙箱或跨进程竞争。
- 下一步：固定查询与项目，测试锚点变化、新文件、权限过滤、网络失败和缓存恢复。

**分析版本**

- **仓库**：[YaphetHayate/codeRDD](https://github.com/YaphetHayate/codeRDD)
- **版本号**：0.3.1（[固定提交 01e52f9](https://github.com/YaphetHayate/codeRDD/tree/01e52f9e1531acd7c235ab332c19298d568a1f85)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设记录依赖集合摘要可改善新增文件导致的遗漏，尚未验证。

固定查询与项目，测试锚点变化、新文件、权限过滤、网络失败和缓存恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 752 | — | — | 9357 |
| .ts | source | 7 | 2538 | 1642 | 745 | — |
| .mjs | test | 7 | 1027 | 797 | 145 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/YaphetHayate/codeRDD/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/YaphetHayate/codeRDD/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查探索缓存的命中、刷新与子代理权限边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 探索缓存工具为谁提供什么，相对原生搜索和子代理有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件面向反复探索同一代码库的 DSH 用户，提供 rdd_explore 和模型目录工具。相对每次用 grep/glob 或裸子代理搜索，探索工具先查项目内保存的摘要和来源锚点，缺候选时再派研究子代理；cache 是现有 rdd-engine 格式的消费者和生产者，不能把宿主子代理或现有索引协议都算本组件原创。候选排序和相同锚点哈希不能证明摘要回答了当前问题或覆盖全仓。

#### 证据与依据

**依据 1 · 作者声明**：[dsh/dsh-rdd-explore/README.md:1-5](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/dsh-rdd-explore/README.md#L1-L5)

作者说明场景和依赖归属。

```text
# @coderrdd/dsh-rdd-explore

独立的 **DSH Profile Bundle**：两件模型工具。`rdd_explore` 把 rdd-engine 的探索缓存做成**缓存优先的模型工具**：查询项目 `.rdd/exploration` 索引，命中返回按相关性精排的 candidates；未命中（或 `force_dispatch: true`）经 `ctx.subagents` service 派遣 worker 子代理探索代码并注册产物。`rdd_models` 是**活模型目录**：从宿主 `ctx.llm` 读当前注册的 provider 路由与各自可服务的模型（含 `inputModalities` 能力标注），供派遣时按需选模型——RDD-UX 的 fork-join 模型策略（`ux_subagent.json` 状态机）在 dsh 下的发现通道就是它。装一次（一个 profile），该 profile 打开的**任何项目**都能用——不要求项目里有 rdd-engine。

在标准/官方 DSH 上即可安装，无需定制构建、无需克隆 codeRDD。与裸 `subagent` 工具的关系：本插件是 subagent 能力的**另一个 Consumer**（service 层直调）；装配它之后可以让探索委派全部走缓存，而不是 prompt 约定。
```

**依据 2 · 源码核查**：[dsh/dsh-rdd-explore/src/index.ts:612-639](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/dsh-rdd-explore/src/index.ts#L612-L639)

缓存和召回顺序。

<details>
<summary>查看原文（28行）</summary>

```text
      // 1. Merged dual-zone cache read with stale cleanup, exactly as the
      // engine read face does: hot first (newest registeredAt first), then
      // the persistent index; hot shadows same-key/same-artifact persistent
      // entries; stale entries are evicted from their own zone.
      const { results: merged } = await mergedFresh(explorationDir, repoRoot)

      // 2. Precision pipeline INSIDE the tool (frozen contract with the
      // engine): multi-recall -> RRF fusion -> Top-K. Non-empty results are
      // the interface's deterministic relevance verdict (HIT — read summaries
      // by rank); empty means MISS -> dispatch below. A disabled or failed
      // recall path degrades to the remaining paths, never to an error.
      const searchConfig = await readSearchConfig(explorationDir)
      const { results: ranked, rankMeta } = await runRecallPipeline({
        query: args.query,
        merged,
        config: searchConfig,
        explorationDir,
        recallers: [lexicalRecaller, vectorRecaller],
      })
      // Query-log projection of the rankMeta outcomes (the frozen three-field
      // view; warnings stay in rankMeta only) — shared by both outcome arms
      // below so every executed query appends exactly ONE line.
      const logRecallers = rankMeta.recallers.map(outcome => ({
        name: outcome.name,
        status: outcome.status,
        qualified: outcome.qualified,
      }))
      if (ranked.length > 0 && args.force_dispatch !== true) {
```

</details>

**依据 3 · 源码核查**：[dsh/dsh-rdd-explore/src/index.ts:669-695](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/dsh-rdd-explore/src/index.ts#L669-L695)

未命中或强制时派遣。

<details>
<summary>查看原文（27行）</summary>

```text
      // 3. Dispatch the worker through the subagent service. Plugin mode runs
      // a pure researcher: the structured output carries the payload, and the
      // plugin (trusted code) owns every cache mutation afterwards.
      // MISS (or forced bypass): log the dispatch DECISION before the worker
      // starts — the log records that a dispatch was triggered, never the
      // worker's completion. `forced` stays distinct from `miss`: it bypassed
      // a possibly non-empty cache, so it is excluded from the hit-rate
      // denominator (forced -> keys always empty).
      await appendQueryLog(explorationDir, args.query, args.force_dispatch === true ? 'forced' : 'miss', [], logRecallers)
      const registerMode = config.registerMode ?? 'plugin'
      const prompt = await buildDispatchPrompt({
        query: args.query,
        repoRoot,
        explorationDir,
        artifactsDir,
        engineRoot,
        registerMode,
      })
      const run: SubagentRun = await ctx.subagents.start(config.provider ?? 'spawn', {
        label: `rdd-explore: ${args.query.slice(0, 60)}`,
        prompt: [{ type: 'text', text: prompt }] as ContentBlock[],
        parent,
        signal: exec.signal,
        ...(registerMode !== 'worker' ? { outputSchema: EXPLORATION_OUTPUT_SCHEMA } : {}),
        ...(config.persona !== undefined ? { persona: config.persona } : {}),
        ...(config.toolFilter !== undefined ? { toolFilter: config.toolFilter } : {}),
      })
```

</details>

#### 缺口

- 无同任务搜索对照
  **影响**：不能证明效率或回答完整性
  **进一步探讨**：比较原生搜索与缓存复用的正确率、时间和模型成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 命中、新鲜度和未命中派遣如何工作？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

每次按会话 cwd 解析仓库，读取 hot 与 index 并进行锚点文件 SHA-256 和产物存在检查，再做词法/向量召回和排序；非空候选且未强制时返回摘要路径，不启动子代理。未命中或强制时调用 subagents.start，默认 plugin 模式要求结构化结果并由插件写 artifacts 与注册。锚点仅覆盖记录的文件，未记录的新文件、依赖变化及摘要推理错误不会因哈希一致被自动发现；候选是线索，仍需回源。过滤器仅在配置提供时传入，包内 patch 提供四个读工具；覆盖 patch 或其他装载路径须重新核权限。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/dsh-rdd-explore/src/index.ts:592-616](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/dsh-rdd-explore/src/index.ts#L592-L616)

当前项目解析和缓存读取。

<details>
<summary>查看原文（25行）</summary>

```text
    async execute(args, exec) {
      const parent = exec.agent
      if (!parent) {
        throw new Error(`${toolName} requires a calling agent (exec.agent was undefined)`)
      }

      // The session workspace owns .rdd/: resolve per call from the session cwd
      // (the GUI session's project), never the host process launch dir — the
      // same rule tool-fs applies via session.header.cwd.
      const repoRoot = config.repoRoot !== undefined
        ? resolve(config.repoRoot)
        : findRepoRoot(parent.session.header.cwd ?? process.cwd())
      // Freeze the periodic-maintenance target on the first call; later
      // sessions' cwds never drift the pin (same config-first rule the timer
      // reads, so the two resolutions cannot disagree).
      if (config.repoRoot === undefined) pinnedRepoRoot ??= repoRoot
      const engineRoot = resolveEngineRoot(config.engineRoot, repoRoot)
      const explorationDir = join(repoRoot, '.rdd', 'exploration')
      const artifactsDir = join(explorationDir, 'artifacts')

      // 1. Merged dual-zone cache read with stale cleanup, exactly as the
      // engine read face does: hot first (newest registeredAt first), then
      // the persistent index; hot shadows same-key/same-artifact persistent
      // entries; stale entries are evicted from their own zone.
      const { results: merged } = await mergedFresh(explorationDir, repoRoot)
```

</details>

**依据 2 · 源码核查**：[dsh/dsh-rdd-explore/src/cache.ts:344-371](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/dsh-rdd-explore/src/cache.ts#L344-L371)

按记录锚点和产物存在检查新鲜度。

<details>
<summary>查看原文（28行）</summary>

```text
 * Split entries into fresh and stale by re-hashing every anchor file and
 * checking artifact presence, exactly as explore.ps1 `Select-FreshEntries`
 * does. Generic over the entry shape so the hot zone (with `registeredAt`)
 * reuses it unchanged.
 * @param entries - the full zone content.
 * @param repoRoot - absolute repository root for resolving relative paths.
 * @returns the fresh entries and the stale entry paths.
 */
export async function selectFresh<T extends ExplorationEntry>(
  entries: readonly T[],
  repoRoot: string,
): Promise<FreshSelection<T>> {
  const fresh: T[] = []
  const stalePaths: string[] = []
  for (const entry of entries) {
    let stale = false
    for (const [rel, expected] of Object.entries(entry.files)) {
      const current = await sha256File(resolveRepoPath(repoRoot, rel))
      if (current === null || current !== expected) {
        stale = true
        break
      }
    }
    if (!stale && !(await isFile(resolveRepoPath(repoRoot, entry.path)))) stale = true
    if (stale) stalePaths.push(entry.path)
    else fresh.push(entry)
  }
  return { fresh, stalePaths }
```

</details>

**依据 3 · 源码核查**：[dsh/dsh-rdd-explore/src/index.ts:618-646](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/dsh-rdd-explore/src/index.ts#L618-L646)

召回和命中分支。

<details>
<summary>查看原文（29行）</summary>

```text
      // 2. Precision pipeline INSIDE the tool (frozen contract with the
      // engine): multi-recall -> RRF fusion -> Top-K. Non-empty results are
      // the interface's deterministic relevance verdict (HIT — read summaries
      // by rank); empty means MISS -> dispatch below. A disabled or failed
      // recall path degrades to the remaining paths, never to an error.
      const searchConfig = await readSearchConfig(explorationDir)
      const { results: ranked, rankMeta } = await runRecallPipeline({
        query: args.query,
        merged,
        config: searchConfig,
        explorationDir,
        recallers: [lexicalRecaller, vectorRecaller],
      })
      // Query-log projection of the rankMeta outcomes (the frozen three-field
      // view; warnings stay in rankMeta only) — shared by both outcome arms
      // below so every executed query appends exactly ONE line.
      const logRecallers = rankMeta.recallers.map(outcome => ({
        name: outcome.name,
        status: outcome.status,
        qualified: outcome.qualified,
      }))
      if (ranked.length > 0 && args.force_dispatch !== true) {
        // HIT: one failure-isolated append before the result is returned
        // (hit-rate data source; a log failure never touches the result).
        await appendQueryLog(explorationDir, args.query, 'hit', ranked.map(result => result.key), logRecallers)
        const candidates: CandidateView[] = ranked.map(result => ({
          key: result.key,
          tags: [...result.tags],
          brief: result.brief,
```

</details>

**依据 4 · 源码核查**：[dsh/dsh-rdd-explore/src/index.ts:677-715](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/dsh-rdd-explore/src/index.ts#L677-L715)

子代理、可选过滤与插件写入。

<details>
<summary>查看原文（39行）</summary>

```text
      await appendQueryLog(explorationDir, args.query, args.force_dispatch === true ? 'forced' : 'miss', [], logRecallers)
      const registerMode = config.registerMode ?? 'plugin'
      const prompt = await buildDispatchPrompt({
        query: args.query,
        repoRoot,
        explorationDir,
        artifactsDir,
        engineRoot,
        registerMode,
      })
      const run: SubagentRun = await ctx.subagents.start(config.provider ?? 'spawn', {
        label: `rdd-explore: ${args.query.slice(0, 60)}`,
        prompt: [{ type: 'text', text: prompt }] as ContentBlock[],
        parent,
        signal: exec.signal,
        ...(registerMode !== 'worker' ? { outputSchema: EXPLORATION_OUTPUT_SCHEMA } : {}),
        ...(config.persona !== undefined ? { persona: config.persona } : {}),
        ...(config.toolFilter !== undefined ? { toolFilter: config.toolFilter } : {}),
      })
      const result = await settleWorkerRun(run)
      const report = textOf(result)

      // 4. Plugin-mode persistence from the structured payload: artifacts
      // land on disk, the entry registers into the HOT zone (visible to the
      // very next query, no async pipeline required).
      const registered: RegisterResult[] = []
      if (registerMode !== 'worker') {
        const payload = structuredPayloadOf(result)
        const { fullAbs } = await writeArtifacts(artifactsDir, slugifyKey(payload.key), payload.full, payload.summary)
        registered.push(await registerEntry(explorationDir, {
          key: payload.key,
          tags: payload.tags,
          brief: payload.brief,
          artifactAbsPath: fullAbs,
          repoRoot,
          files: payload.files,
        }))
      }
      return { outcome: 'dispatched', query: args.query, report, registered } satisfies ToolValue
```

</details>

**依据 5 · 源码核查**：[dsh/dsh-rdd-explore/cordis.patch.yml:1-17](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/dsh-rdd-explore/cordis.patch.yml#L1-L17)

默认 patch 的只读工具配置。

<details>
<summary>查看原文（17行）</summary>

```text
# The @coderrdd/dsh-rdd-explore bundle patch: inserts the rdd_explore tool plugin
# over whatever the profile already composes. Layers above (the profile's own
# cordis.patch.yml, the home-level one, any --patch overlay) can override this
# row by id `rdd-explore` — restating every key they want the row to keep.
#
# toolFilter.allow keeps the exploration worker at minimal privilege: the four
# read-only tools (read / read_image / glob / grep, all registered by the dsh
# base composition). In `registerMode: plugin` the harness itself writes the
# artifacts and registers the cache entry, so the worker needs no write tools.
- insert:
    - id: rdd-explore
      name: '@coderrdd/dsh-rdd-explore'
      config:
        provider: spawn
        registerMode: plugin
        toolFilter:
          allow: [read, read_image, glob, grep]
```

</details>

#### 缺口

- 未运行宿主、子代理和并发缓存
  **影响**：不能确认检索准确率、权限或崩溃恢复
  **进一步探讨**：固定仓库修改锚点及新增相关文件并比较结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 使用缓存、模型及外部向量服务需要什么条件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

工具依赖 DSH tools、subagents 和 llm；插件模式自行写项目 .rdd/exploration，读权限受宿主及配置影响。向量召回在端点、模型、维度和环境密钥满足时启用，会把文本和 Bearer 令牌发送配置端点；应先核目标和数据边界。模型调用、索引存储及维护有成本，金额和节时未知。先以非敏感项目检查只读 worker 配置、可写缓存和端点，重要决定应按摘要路径回到源码；误命中、外发不可接受或权限不明时停止并用 grep/glob。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/dsh-rdd-explore/src/index.ts:50-54](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/dsh-rdd-explore/src/index.ts#L50-L54)

宿主注入依赖。

```text
import { appendQueryLog } from './query-log.js'
import { registerModelsTool } from './models.js'

export const name = 'rdd-explore'
export const inject = ['tools', 'subagents', 'llm']
```

**依据 2 · 源码核查**：[dsh/dsh-rdd-explore/src/index.ts:677-715](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/dsh-rdd-explore/src/index.ts#L677-L715)

派遣及可信插件写入。

<details>
<summary>查看原文（39行）</summary>

```text
      await appendQueryLog(explorationDir, args.query, args.force_dispatch === true ? 'forced' : 'miss', [], logRecallers)
      const registerMode = config.registerMode ?? 'plugin'
      const prompt = await buildDispatchPrompt({
        query: args.query,
        repoRoot,
        explorationDir,
        artifactsDir,
        engineRoot,
        registerMode,
      })
      const run: SubagentRun = await ctx.subagents.start(config.provider ?? 'spawn', {
        label: `rdd-explore: ${args.query.slice(0, 60)}`,
        prompt: [{ type: 'text', text: prompt }] as ContentBlock[],
        parent,
        signal: exec.signal,
        ...(registerMode !== 'worker' ? { outputSchema: EXPLORATION_OUTPUT_SCHEMA } : {}),
        ...(config.persona !== undefined ? { persona: config.persona } : {}),
        ...(config.toolFilter !== undefined ? { toolFilter: config.toolFilter } : {}),
      })
      const result = await settleWorkerRun(run)
      const report = textOf(result)

      // 4. Plugin-mode persistence from the structured payload: artifacts
      // land on disk, the entry registers into the HOT zone (visible to the
      // very next query, no async pipeline required).
      const registered: RegisterResult[] = []
      if (registerMode !== 'worker') {
        const payload = structuredPayloadOf(result)
        const { fullAbs } = await writeArtifacts(artifactsDir, slugifyKey(payload.key), payload.full, payload.summary)
        registered.push(await registerEntry(explorationDir, {
          key: payload.key,
          tags: payload.tags,
          brief: payload.brief,
          artifactAbsPath: fullAbs,
          repoRoot,
          files: payload.files,
        }))
      }
      return { outcome: 'dispatched', query: args.query, report, registered } satisfies ToolValue
```

</details>

**依据 3 · 源码核查**：[dsh/dsh-rdd-explore/src/recallers/vector.ts:7-14](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/dsh-rdd-explore/src/recallers/vector.ts#L7-L14)

向量服务启用条件。

```text
 * - F5 embed request = POST {endpoint}, body { "model": M, "input": [texts] },
 *   header Authorization: Bearer $RDD_EMBED_APIKEY, response data[i].embedding
 *   (OpenAI de-facto standard)
 * - F6 vector valid = model == configured && textHash == current F2 &&
 *   len(vector) == dimensions (else silently skipped)
 * Gate: cosine >= minCosine (frozen cosine: dot / sqrt(|a|^2) / sqrt(|b|^2)).
 * Auto-enable rule (frozen): endpoint + model + dimensions>=1 +
 * RDD_EMBED_APIKEY all present, else the pipeline reports disabled with the
```

**依据 4 · 源码核查**：[dsh/dsh-rdd-explore/src/cache.ts:922-936](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/dsh-rdd-explore/src/cache.ts#L922-L936)

请求文本和令牌的网络路径。

<details>
<summary>查看原文（15行）</summary>

```text
export async function embedTexts(
  vector: Pick<VectorRecallerConfig, 'endpoint' | 'model' | 'timeoutSeconds'>,
  texts: readonly string[],
  apiKey: string,
  fetchImpl: typeof globalThis.fetch = globalThis.fetch,
): Promise<number[][]> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), Math.max(1, vector.timeoutSeconds) * 1000)
  try {
    const response = await fetchImpl(vector.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: vector.model, input: [...texts] }),
      signal: controller.signal,
    })
```

</details>

#### 缺口

- 未运行向量服务、宿主及计费
  **影响**：无法确认请求成功、隔离或成本
  **进一步探讨**：隔离数据测端点、失败降级和权限边界。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证缓存候选缺少新依赖时的检测改进？

**研究主题**：新假设与验证

#### 完整回答

假设将目录或依赖集合摘要与锚点哈希一并记录，在新相关文件出现或依赖集合变化时提示重查，可以减少旧摘要漏掉新路径；这是未验证设计，也可能增加不必要失效。固定相同查询，分别改锚点、添加相关文件及无关文件，比较遗漏、重复搜索成本和误失效；若无改善或成本抵消收益则否定。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/dsh-rdd-explore/src/cache.ts:352-371](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/dsh-rdd-explore/src/cache.ts#L352-L371)

只核记录锚点和产物。

<details>
<summary>查看原文（20行）</summary>

```text
export async function selectFresh<T extends ExplorationEntry>(
  entries: readonly T[],
  repoRoot: string,
): Promise<FreshSelection<T>> {
  const fresh: T[] = []
  const stalePaths: string[] = []
  for (const entry of entries) {
    let stale = false
    for (const [rel, expected] of Object.entries(entry.files)) {
      const current = await sha256File(resolveRepoPath(repoRoot, rel))
      if (current === null || current !== expected) {
        stale = true
        break
      }
    }
    if (!stale && !(await isFile(resolveRepoPath(repoRoot, entry.path)))) stale = true
    if (stale) stalePaths.push(entry.path)
    else fresh.push(entry)
  }
  return { fresh, stalePaths }
```

</details>

**依据 2 · 源码核查**：[dsh/dsh-rdd-explore/src/index.ts:639-666](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/dsh-rdd-explore/src/index.ts#L639-L666)

非空候选直接返回。

<details>
<summary>查看原文（28行）</summary>

```text
      if (ranked.length > 0 && args.force_dispatch !== true) {
        // HIT: one failure-isolated append before the result is returned
        // (hit-rate data source; a log failure never touches the result).
        await appendQueryLog(explorationDir, args.query, 'hit', ranked.map(result => result.key), logRecallers)
        const candidates: CandidateView[] = ranked.map(result => ({
          key: result.key,
          tags: [...result.tags],
          brief: result.brief,
          summaryPath: result.summaryPath,
          fullPath: result.fullPath,
          origin: result.origin,
          score: result.score,
          recalledBy: [...result.recalledBy],
        }))
        const metaView: RankMetaView = {
          recallers: rankMeta.recallers.map(outcome => {
            const view: RankMetaView['recallers'][number] = {
              name: outcome.name,
              status: outcome.status,
              qualified: outcome.qualified,
            }
            if (outcome.warning !== undefined) view.warning = outcome.warning
            return view
          }),
          fused: rankMeta.fused,
          returned: rankMeta.returned,
        }
        return { outcome: 'candidates', query: args.query, candidates, rankMeta: metaView } satisfies ToolValue
```

</details>

#### 缺口

- 未实现或测目录级追踪
  **影响**：不能量化遗漏和失效代价
  **进一步探讨**：构造固定版本仓库和查询进行对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
