# DSH RDD Goal Tree

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[01e52f9](https://github.com/YaphetHayate/codeRDD/tree/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/rdd-goal-tree)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/YaphetHayate/codeRDD)
<!-- END META -->

> **功能**：在 DSH 会话中展示 goal-tree 状态并向规划者投递节点回调。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 在 DSH 提供角色视图和回调，不是执行引擎。

> **主要限制**：[Q03](#research-q03) 发送和 marker 不原子，持久化失败与跨进程并发不保证严格一次。

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
  - [Q01 · 目标树使用者相对手工查看状态文件得到什么？](#detail-section-11)
  - [Q02 · 状态读取与角色视图如何接线？](#detail-section-12)
  - [Q03 · 通知与去重在哪些条件下可能重复或遗漏？](#detail-section-13)
  - [Q04 · 依赖、权限和退出条件是什么？](#detail-section-14)
  - [Q05 · 如何帮助规划者判断通知已处理而不是仅已发送？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用 codeRDD goal-tree 协作并在 DSH 中查看状态的规划者和 worker。

手工读取状态文件和账本并通知规划者。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 状态路由 | 查询运行与节点 | 依赖文件和 cwd |
| 会话视图 | 显示 worker 或 planner | 会话映射未实测 |
| 回调 | 通知规划者节点报告 | 消息发送不等于已裁决 |
| marker | 减少重复发送 | 写入失败或跨进程竞态未知 |

**流程与依赖**

| 依赖 | 条件 | 作用 | 缺失影响 |
|---|---|---|---|
| 兼容 DSH Web 与 Node | 运行需要 | 路由和客户端 | 不可用 |
| goal-tree 状态文件 | 状态显示需要 | 聚合树和账本 | 无 run 或错误 |
| 活跃规划者会话 | 通知需要 | 接收消息 | 暂不投递 |
| marker 写权限 | 持久去重需要 | 保存发送记录 | 重启可能重放 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 用户配置工作区与 DSH | 状态目录可读 |
| 展示 | 客户端按会话读取状态 | 核对角色和 run |
| 回调 | watcher 发现账目并通知 | 无活跃规划者时等待 |
| 裁决 | 规划者复核并处理 | 通知不代表已裁决 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | DSH、Node 与 goal-tree 状态 | 安装和版本配置 | 兼容未知 |
| 持续 | 轮询与文件读取 | 审核通知和裁决 | 时延和负载未知 |
| 故障 | marker、账本和日志 | 检查重播及恢复 | 多进程效果未知 |

| 效果 | 材料 | 未知 |
|---|---|---|
| 角色状态视图 | 路由与选择源码 | 宿主效果 |
| 规划者回调 | watcher 发送和 marker | 实际投递可靠性 |
| 人工裁决提示 | 消息内容 | 是否真的被处理 |

> **思考**：[Q03](#research-q03) 发送和 marker 不原子，持久化失败与跨进程并发不保证严格一次。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 在 DSH 提供角色视图和回调，不是执行引擎。

[Q02](#research-q02) 区分只读状态与通知副作用；[Q03](#research-q03) 进程内串行和失败吞掉限制去重保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 发送和 marker 不原子，持久化失败与跨进程并发不保证严格一次。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在隔离仓库核对视图、通知与 marker；不接受重复或权限风险时关闭 watcher 并人工核查账本。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本定向静态检查；未运行 DSH、goal-tree 或并发故障测试。

- 已检查：作者 README、包清单、源码路径 dsh/rdd-goal-tree/README.md、dsh/rdd-goal-tree/package.json、dsh/rdd-goal-tree/src/index.ts、dsh/rdd-goal-tree/src/client/view-picker.ts、dsh/rdd-goal-tree/src/watcher.ts、dsh/rdd-goal-tree/src/goaltrees.ts 及固定范围 inventory；组件：dsh/rdd-goal-tree。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 DSH 宿主路由、角色选择、watcher 交付和 marker 写入；未穷尽上游引擎、宿主鉴权与客户端显示。
- 下一步：隔离 DSH 注入宿主重启、并发和文件故障并核对账本；本轮未执行。

**分析版本**

- **仓库**：[YaphetHayate/codeRDD](https://github.com/YaphetHayate/codeRDD)
- **版本号**：0.8.4（[固定提交 01e52f9](https://github.com/YaphetHayate/codeRDD/tree/01e52f9e1531acd7c235ab332c19298d568a1f85)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 区分发送、消费与裁决状态，需评估竞态与维护负担。

隔离 DSH 注入宿主重启、并发和文件故障并核对账本；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 103 | — | — | 3048 |
| .tsx | source | 1 | 851 | 621 | 187 | — |
| .ts | source | 4 | 2040 | 1204 | 757 | — |
| .mjs | test | 1 | 1252 | 935 | 236 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/YaphetHayate/codeRDD/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/YaphetHayate/codeRDD/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/YaphetHayate/codeRDD/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查目标树状态视图、通知和去重边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标树使用者相对手工查看状态文件得到什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

组件面向以 codeRDD goal-tree 协作的 DSH 会话，在输入区显示按当前 worker 或 planner 角色筛选的运行和节点状态。手工读取 state 与 ledger 也可获得原始事实；插件增加视图与回调接线，而不创建目标树执行引擎或代替规划者裁决。实际运行和减少等待的收益未对照。

#### 证据与依据

**依据 1 · 作者声明**：[dsh/rdd-goal-tree/README.md:1-8](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/rdd-goal-tree/README.md#L1-L8)

作者描述状态条和数据来源。

```text
# @coderrdd/dsh-rdd-goal-tree

独立的 **DSH Profile Bundle**：把 rdd-engine 的 goal-tree 运行状态做成输入框上方的**只读状态条**（`conversation.input.dock` 插槽，order 30，排在 todo/goal/queue 之后）。双半边：

- **宿主半边**（exports `.`，经 `cordis.patch.yml` 插入插件行）：`inject ['webServer']`，注册 `GET /rdd-goal-tree/runs?cwd=<会话工作区>`；按 dsh 的项目根规则（向上找 `.git`）定位仓库，纯文件读取聚合 `.rdd/goal-trees/<run-id>/{manifest.json, state/tree.json, state/round-log.jsonl}`。
- **浏览器半边**（exports `./client`，经 package.json `dsh.client: {platform:'web'}` 进 boot graph，浏览器从 `/plugins/@coderrdd/dsh-rdd-goal-tree/client.js` 加载）：`ctx.slots.inject('conversation.input.dock')` 注册 `GoalTreeDock`；`useSessions` 取当前会话 cwd，fetch 轮询（15s + 可见性恢复），渲染运行徽章、轮次 x/y、节点预算、状态计数与可展开的节点树。

**只读边界**：不触碰 goal-tree 的任何写原语（锁/账本/审计由规划者会话的 CLI 独占）；无 run、加载中、cwd 缺失一律渲染空。`@deepseek-ai/*` 导入中仅 `@deepseek-ai/dsh-llm`（`createUserMessage`）与 `@deepseek-ai/dsh-agent`（agents 注册表服务）是运行时依赖，其余 type-only——两者均为 DSH 核心包，经 profile 的 hoisted store 解析。
```

**依据 2 · 源码核查**：[dsh/rdd-goal-tree/src/client/view-picker.ts:49-62](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/rdd-goal-tree/src/client/view-picker.ts#L49-L62)

会话角色选择。

<details>
<summary>查看原文（14行）</summary>

```text
export function pickGoalTreeView<R extends PickableRunView>(
  runs: readonly R[],
  sessionId: string | null | undefined,
): GoalTreeViewSelection<R> {
  for (const run of runs) {
    const mine = run.nodes.find(node => node.claimSessionId !== null && node.claimSessionId === sessionId)
    if (mine !== undefined) return { view: 'worker', run, node: mine }
  }
  const planned = runs.find(run => run.plannerSessionId !== null && run.plannerSessionId === sessionId)
  if (planned !== undefined) return { view: 'planner', run: planned }
  if (runs.length > 0 && runs[0].plannerSessionId === null) {
    return { view: 'plain', run: runs[0] }
  }
  return null
```

</details>

**依据 3 · 作者声明**：[dsh/rdd-goal-tree/README.md:57-59](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/rdd-goal-tree/README.md#L57-L59)

作者的回调说明。

```text
## Worker 回调（v0.2.0）

宿主半边带一个 ledger 监视器（默认 5s，仅扫描该端点服务过的仓库，LRU 上限 8 个；扫描互斥——慢扫描（冷缓存/夹具 run 洪峰）超过周期间时丢弃重叠节拍，不并发重入投递臂）：发现**新的 report 账目行**或（纯自动模式 run 的）**open 升级条目**且该 run 绑定了规划者会话时，经 `agent.send(msg, 'next-turn', true)`（goal round driver 同款持久队列边界 **+ 唤醒驱动**）向规划者会话投递一条插件消息——report 为节点/worker/verdict/confidence/账目号 + settle/prune/graft 行动提示；升级为 checkpoint/风险/规则 + 呈用户与 `decide -Kind resolution` 回填指引（`decision <id>` 去重命名空间，与 ledger `L<n>` 天然隔离）。**投递送达即唤醒**：空闲的规划者会话被立即唤醒开轮消费（送达但不唤醒 = 无人值守时回调永久积压，已裁决为交付缺陷）；按 entry 幂等——内存 set + 规划者 pending inbox 扫描（**精确 token 匹配**：`ledger L2` 不再误配 `ledger L21` 的前缀子串）+ run 级 `.callback-delivered.json` 持久 marker（**按 run 串行 + 临时文件原子替换**：并发写不再互相覆盖丢 marker、崩溃不再留下半文件导致重启全量重放）三重去重，插件/宿主重启不重放；共享同一归档账本的多条 run（replan/midrun-derive）对同一升级只投一次（按账本文件去重，首条 run 承载）。
```

#### 缺口

- 没有实际协作任务及手工基线对照
  **影响**：无法确认提效和视图适用性
  **进一步探讨**：以相同任务比较文件巡检和插件通知的等待及漏报。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 状态读取与角色视图如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主注册 /rdd-goal-tree 路由并通过 cwd 定位仓库，汇总 goal-tree 文件，默认返回摘要或活跃 claim 的详情；客户端按当前会话先匹配 worker，再匹配 planner，旧 run 无 planner 时显示普通树。只读适用于状态查询路径；组件默认另启动 watcher，可能发消息并写去重 sidecar，不能把整个插件说成无副作用。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/rdd-goal-tree/src/index.ts:106-145](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/rdd-goal-tree/src/index.ts#L106-L145)

GET、cwd 和状态聚合。

<details>
<summary>查看原文（40行）</summary>

```text
async function serve(req: IncomingMessage, res: ServerResponse, config: Config, ctx: Context, learnRoot: (root: string) => void): Promise<void> {
  const send = (status: number, body: unknown): void => {
    res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
    res.end(JSON.stringify(body))
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(405, { error: 'method not allowed' })
    return
  }
  const url = new URL(req.url ?? '/', 'http://localhost')
  const pathname = decodeURIComponent(url.pathname)
  if (pathname !== ENDPOINT_PATH) {
    send(404, { error: 'unknown resource' })
    return
  }
  const cwd = url.searchParams.get('cwd')
  if (cwd === null || cwd.trim() === '') {
    send(400, { error: 'missing cwd query parameter' })
    return
  }
  const runParam = url.searchParams.get('run')
  try {
    const repoRoot = config.repoRoot !== undefined ? resolve(config.repoRoot) : findRepoRoot(cwd)
    learnRoot(repoRoot)
    // repoRoot passed explicitly so doc-pointer resolution (node-doc-links)
    // never depends on the two-level-parent derivation.
    const { runs } = await aggregateGoalTrees(join(repoRoot, '.rdd', 'goal-trees'), repoRoot)
    if (runParam !== null && runParam.trim() !== '') {
      // detail form (plugin-perf L3): one run, full node detail — a client
      // expanding a slim run fetches exactly what it renders.
      const one = runs.find(r => r.runId === runParam)
      send(200, { repoRoot, runs: one === undefined ? [] : [projectRunView(one, true)] })
      return
    }
    // default form: summaries + slim nodes; full detail only for runs a LIVE
    // worker session renders — every run-level scalar stays present so the
    // bar header (and old clients) render unchanged.
    send(200, { repoRoot, runs: runs.map(r => projectRunView(r, hasLiveClaimSession(r, ctx))) })
  } catch (error) {
    send(500, { error: error instanceof Error ? error.message : String(error) })
```

</details>

**依据 2 · 源码核查**：[dsh/rdd-goal-tree/src/index.ts:243-263](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/rdd-goal-tree/src/index.ts#L243-L263)

路由与 watcher 启动。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx: Context, config: Config = {}): void {
  const watcher = new PlannerCallbackWatcher(ctx, config.notifyPlanner !== false, config.scanIntervalMs ?? 5_000, createUserMessage)

  ctx.effect(
    () => ctx.webServer.register({
      kind: 'prefix',
      path: '/rdd-goal-tree',
      handler: (req: IncomingMessage, res: ServerResponse): Promise<void> | void => {
        const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)
        if (pathname === LIVENESS_PATH) return serveLiveness(req, res, config, ctx)
        return serve(req, res, config, ctx, root => watcher.learn(root))
      },
    }),
    'rdd-goal-tree: read-only run status + claim liveness route',
  )

  if (config.notifyPlanner !== false && (config.scanIntervalMs ?? 5_000) > 0) {
    ctx.effect(() => {
      watcher.start()
      return () => watcher.stop()
    }, 'rdd-goal-tree: worker-report callback watcher')
```

</details>

**依据 3 · 源码核查**：[dsh/rdd-goal-tree/src/client/view-picker.ts:49-62](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/rdd-goal-tree/src/client/view-picker.ts#L49-L62)

视图匹配优先级。

<details>
<summary>查看原文（14行）</summary>

```text
export function pickGoalTreeView<R extends PickableRunView>(
  runs: readonly R[],
  sessionId: string | null | undefined,
): GoalTreeViewSelection<R> {
  for (const run of runs) {
    const mine = run.nodes.find(node => node.claimSessionId !== null && node.claimSessionId === sessionId)
    if (mine !== undefined) return { view: 'worker', run, node: mine }
  }
  const planned = runs.find(run => run.plannerSessionId !== null && run.plannerSessionId === sessionId)
  if (planned !== undefined) return { view: 'planner', run: planned }
  if (runs.length > 0 && runs[0].plannerSessionId === null) {
    return { view: 'plain', run: runs[0] }
  }
  return null
```

</details>

#### 缺口

- 未运行 DSH、文件状态与浏览器
  **影响**：无法证明视图或会话映射实际正确
  **进一步探讨**：在隔离会话验证 worker/planner、旧数据和详情加载。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 通知与去重在哪些条件下可能重复或遗漏？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

watcher 只扫描已学习的仓库根目录；规划者会话不在当前进程时跳过并等待后续扫描。发送后写持久 marker，写失败被记录并吞掉，源码注释明确重启可能重新投递。markerWriteChains 是进程内 Map，不能据此证明多个独立宿主进程之间的读改写互斥；发送与 marker 写入也不是同一个原子事务，因此不保证严格一次。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/rdd-goal-tree/src/watcher.ts:119-162](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/rdd-goal-tree/src/watcher.ts#L119-L162)

扫描和两类通知。

<details>
<summary>查看原文（44行）</summary>

```text
  /** One scan pass over every learned root; per-root errors are logged and swallowed. */
  private async scan(): Promise<void> {
    if (this.scanning) return // mid-pass tick dropped: see the field doc
    this.scanning = true
    try {
      const slot = Math.floor(Date.now() / DIGEST_PERIOD_MS)
      const digestDue = slot > this.lastDigestSlot
      if (digestDue) this.lastDigestSlot = slot
      for (const repoRoot of [...this.roots.keys()]) {
        try {
          await this.scanRoot(repoRoot, digestDue)
        } catch (error) {
          this.ctx.logger.warn(`rdd-goal-tree: callback scan failed for ${repoRoot}: ${error instanceof Error ? error.message : String(error)}`)
        }
      }
    } finally {
      this.scanning = false
    }
  }

  /** One scan pass over one root: resolve callback targets, then run both delivery arms. */
  private async scanRoot(repoRoot: string, digestDue = false): Promise<void> {
    const goalTreesRoot = join(repoRoot, '.rdd', 'goal-trees')
    const [entries, decisions, { runs }] = await Promise.all([
      collectReportEntries(goalTreesRoot),
      collectDecisionEntries(goalTreesRoot),
      aggregateGoalTrees(goalTreesRoot),
    ])
    const plannerOf = await this.resolvePlanners(repoRoot, goalTreesRoot, runs)
    await this.deliverPending(repoRoot, goalTreesRoot, plannerOf, entries.map(entry => ({
      runId: entry.runId,
      marker: `ledger ${entry.entryId}`,
      message: this.buildMessage(entry),
      log: `rdd-goal-tree: callback delivered — run "${entry.runId}" ${entry.entryId} (${entry.nodeId} by ${entry.worker ?? '?'})`,
    })))
    // planner-auto-mode: open escalations ride the same pipeline with a
    // `decision <id>` marker namespace (never collides with ledger ids).
    await this.deliverPending(repoRoot, goalTreesRoot, plannerOf, decisions.map(entry => ({
      runId: entry.runId,
      marker: `decision ${entry.entryId}`,
      message: this.buildDecisionMessage(entry),
      log: `rdd-goal-tree: escalation delivered — run "${entry.runId}" ${entry.entryId} (${entry.nodeId} checkpoint ${entry.checkpoint ?? '?'})`,
    })))
    if (digestDue) await this.digestBackstop(runs, plannerOf)
```

</details>

**依据 2 · 源码核查**：[dsh/rdd-goal-tree/src/watcher.ts:267-315](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/rdd-goal-tree/src/watcher.ts#L267-L315)

会话可达、发送与 marker 失败。

<details>
<summary>查看原文（49行）</summary>

```text
  private async resolvePlanners(repoRoot: string, goalTreesRoot: string, runs: GoalTreeRunView[]): Promise<Map<string, string | null>> {
    const plannerOf = new Map<string, string | null>()
    for (const run of runs) {
      plannerOf.set(run.runId, (await readPlannerLease(join(goalTreesRoot, run.runId))) ?? run.plannerSessionId)
      for (const marker of await readDeliveredMarkers(join(goalTreesRoot, run.runId))) {
        this.delivered.add(`${repoRoot}::${run.runId}::${marker}`)
      }
    }
    return plannerOf
  }

  /**
   * The one shared delivery arm — ledger reports and open escalations are the
   * same exactly-once pipeline (the M1 dedupe: one skeleton, parameterized by
   * {@link PendingDelivery}): marker → planner resolution → live-agent
   * resolution → pending-inbox guard → wakeful send → durable marker → log.
   */
  private async deliverPending(repoRoot: string, goalTreesRoot: string, plannerOf: Map<string, string | null>, items: readonly PendingDelivery[]): Promise<void> {
    for (const item of items) {
      const key = `${repoRoot}::${item.runId}::${item.marker}`
      if (this.delivered.has(key)) continue
      const plannerSessionId = plannerOf.get(item.runId) ?? null
      if (plannerSessionId === null) continue // legacy run (no planner sidecar): no callback target
      const agent = this.resolveAgent(plannerSessionId)
      if (agent === undefined) continue // planner session not live in this process; retry next scan
      const runDir = join(goalTreesRoot, item.runId)
      if (this.alreadyQueued(agent, item.marker)) {
        await this.persist(runDir, key, item.marker) // a previous plugin life delivered it: mark and move on
        continue
      }
      agent.send(item.message, 'next-turn', true)
      await this.persist(runDir, key, item.marker)
      this.ctx.logger.info(`${item.log} → session ${plannerSessionId}`)
    }
  }

  /**
   * Mark one delivery as done in BOTH the in-memory set and the run's durable
   * sidecar (`.callback-delivered.json`) — sidecar failures are logged and
   * swallowed (advisory persistence: a failed write only re-opens the
   * restart-replay window for this one marker, it never blocks delivery).
   */
  private async persist(runDir: string, key: string, marker: string): Promise<void> {
    this.delivered.add(key)
    try {
      await recordDeliveredMarker(runDir, marker)
    } catch (error) {
      this.ctx.logger.warn(`rdd-goal-tree: delivered-marker persist failed for ${marker}: ${error instanceof Error ? error.message : String(error)}`)
    }
```

</details>

**依据 3 · 源码核查**：[dsh/rdd-goal-tree/src/goaltrees.ts:260-303](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/rdd-goal-tree/src/goaltrees.ts#L260-L303)

进程内链和文件替换。

<details>
<summary>查看原文（44行）</summary>

```text
/**
 * In-flight marker-write chains per run dir (duplicate-callback fix): the
 * sidecar update is a read-modify-write, so two concurrent writers —
 * overlapping scan passes (a slow cold scan outlives the 5s interval tick)
 * or a second host process watching the same repo — interleave their reads
 * and the last write silently drops the other's marker. Every write for one
 * run dir chains onto the previous one; the map entry is replaced with a
 * settled (never-rejecting) tail so one failure cannot poison the chain.
 */
const markerWriteChains = new Map<string, Promise<void>>()

/** Temp-file sequence for atomic sidecar replaces (per process). */
let markerTempSeq = 0

/**
 * Persist one delivered marker (idempotent; full-set rewrite keeps it plain).
 * Serialized per run dir ({@link markerWriteChains}) and committed by
 * write-temp-then-rename: a torn in-place write reads back as EMPTY on the
 * next restart hydration (the whole-ledger replay storm this sidecar exists
 * to prevent), while rename leaves either the old complete set or the new
 * one. Windows rename-over-locked-dest falls back to a direct complete
 * write (best effort) instead of dropping the marker.
 */
export async function recordDeliveredMarker(runDir: string, marker: string): Promise<void> {
  const previous = markerWriteChains.get(runDir) ?? Promise.resolve()
  const task = previous.then(() => writeDeliveredMarkerSerialized(runDir, marker))
  markerWriteChains.set(runDir, task.then(() => undefined, () => undefined))
  await task
}

/** The serialized write itself — one writer per run dir at a time. */
async function writeDeliveredMarkerSerialized(runDir: string, marker: string): Promise<void> {
  const file = join(runDir, DELIVERED_MARKERS_FILE)
  const current = await readDeliveredMarkers(runDir)
  if (current.has(marker)) return
  current.add(marker)
  const payload = `${JSON.stringify({ delivered: [...current].sort() }, null, 2)}\n`
  const temp = `${file}.tmp-${process.pid}-${++markerTempSeq}`
  try {
    await writeFile(temp, payload, 'utf8')
    await rename(temp, file)
  } catch {
    try { await unlink(temp) } catch { /* best-effort cleanup */ }
    await writeFile(file, payload, 'utf8')
```

</details>

#### 缺口

- 未做多进程、宕机或写入故障实测
  **影响**：不能量化重复和丢失窗口
  **进一步探讨**：用隔离宿主注入发送后崩溃和并发写入，对照 inbox 与 marker。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、权限和退出条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

组件需兼容 DSH Web、Node 与可读 goal-tree 状态；有回调时还需要活跃的 agents 服务及写入 marker 的文件权限。文档列 notifyPlanner=false 或非正扫描周期可关闭 watcher，但禁用、残留 marker 和宿主版本兼容未实测。用户需复核 cwd、规划者会话和风险升级，先隔离测试；若通知不可靠或共享仓库权限不可接受，应关闭回调并人工查账。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/rdd-goal-tree/package.json:1-30](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/rdd-goal-tree/package.json#L1-L30)

组件身份、依赖及 bundle。

<details>
<summary>查看原文（30行）</summary>

```text
{
  "name": "@coderrdd/dsh-rdd-goal-tree",
  "version": "0.8.4",
  "description": "dsh profile bundle: read-only goal-tree run status — a dock strip above the composer fed by the host half's /rdd-goal-tree endpoint over .rdd/goal-trees state files; worker sessions see their own node with structured goal/doc rows plus UX mockup chips (click-to-open via the workspaces opener), worker reports call back to the Planner session's inbox",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/",
    "cordis.patch.yml"
  ],
  "scripts": {
    "build": "node ../../scripts/build-dsh-goal-tree.mjs"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-agent": "*",
    "@deepseek-ai/dsh-llm": "*"
  },
  "devDependencies": {
    "@types/node": "^22.20.5",
    "typescript": "5.9.3"
```

</details>

**依据 2 · 作者声明**：[dsh/rdd-goal-tree/README.md:81-91](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/rdd-goal-tree/README.md#L81-L91)

配置与宿主版本边界。

<details>
<summary>查看原文（11行）</summary>

```text
## Config

| 字段 | 默认 | 说明 |
|---|---|---|
| `repoRoot` | 按请求从 cwd 向上找 `.git` | 仓库根覆盖（一般不需要） |
| `notifyPlanner` | `true` | Worker report 后向规划者会话投递回调消息 |
| `scanIntervalMs` | `5000` | ledger 扫描周期（毫秒）；`<= 0` 关闭监视器 |

## 已知边界

- **插件升级需重启 profile 才双半边齐换**：宿主半边（`/rdd-goal-tree/runs`）随 `dsh web` 进程启动时加载进内存，浏览器半边（client.js）每次页面刷新从磁盘现取——**进程运行中重跑 `plugin add`** 会造成「新 client + 旧 host」偏斜：0.8.0 起 client 渲染 wake 徽章 `[k/K]·duty`，旧 host 的 wire 不带这三个字段，0.8.1 及之前会显示成 `[undefined/undefined]·undefined`（守卫 `!== null` 放过 undefined）；0.8.2 起字段缺失一律退化为不显徽章。治本 = 重启 profile 让宿主半边同版。
```

</details>

**依据 3 · 源码核查**：[dsh/rdd-goal-tree/src/index.ts:243-263](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/rdd-goal-tree/src/index.ts#L243-L263)

watcher 开关及默认周期。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx: Context, config: Config = {}): void {
  const watcher = new PlannerCallbackWatcher(ctx, config.notifyPlanner !== false, config.scanIntervalMs ?? 5_000, createUserMessage)

  ctx.effect(
    () => ctx.webServer.register({
      kind: 'prefix',
      path: '/rdd-goal-tree',
      handler: (req: IncomingMessage, res: ServerResponse): Promise<void> | void => {
        const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)
        if (pathname === LIVENESS_PATH) return serveLiveness(req, res, config, ctx)
        return serve(req, res, config, ctx, root => watcher.learn(root))
      },
    }),
    'rdd-goal-tree: read-only run status + claim liveness route',
  )

  if (config.notifyPlanner !== false && (config.scanIntervalMs ?? 5_000) > 0) {
    ctx.effect(() => {
      watcher.start()
      return () => watcher.stop()
    }, 'rdd-goal-tree: worker-report callback watcher')
```

</details>

#### 缺口

- 未测试停用、持久状态或隐私权限
  **影响**：无法保证退出后没有残留
  **进一步探讨**：隔离工作区检查禁用、重启和 marker。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何帮助规划者判断通知已处理而不是仅已发送？

**研究主题**：新假设与验证

#### 完整回答

现有去重记录描述的是已发送或已排队，并不证明规划者已实际裁决。可以假设将通知发送、会话消费和账本裁决分成可见状态，能减少错误完成判断；相对现有 marker 的增量是记录消费和结果，而不是重命名已发送状态。以模拟离线、重启和裁决失败的任务对照误判率、恢复时间及额外写入负担；无改善或引入新竞态则否定。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/rdd-goal-tree/src/watcher.ts:284-315](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/rdd-goal-tree/src/watcher.ts#L284-L315)

消息发送和 marker 的实际语义。

<details>
<summary>查看原文（32行）</summary>

```text
  private async deliverPending(repoRoot: string, goalTreesRoot: string, plannerOf: Map<string, string | null>, items: readonly PendingDelivery[]): Promise<void> {
    for (const item of items) {
      const key = `${repoRoot}::${item.runId}::${item.marker}`
      if (this.delivered.has(key)) continue
      const plannerSessionId = plannerOf.get(item.runId) ?? null
      if (plannerSessionId === null) continue // legacy run (no planner sidecar): no callback target
      const agent = this.resolveAgent(plannerSessionId)
      if (agent === undefined) continue // planner session not live in this process; retry next scan
      const runDir = join(goalTreesRoot, item.runId)
      if (this.alreadyQueued(agent, item.marker)) {
        await this.persist(runDir, key, item.marker) // a previous plugin life delivered it: mark and move on
        continue
      }
      agent.send(item.message, 'next-turn', true)
      await this.persist(runDir, key, item.marker)
      this.ctx.logger.info(`${item.log} → session ${plannerSessionId}`)
    }
  }

  /**
   * Mark one delivery as done in BOTH the in-memory set and the run's durable
   * sidecar (`.callback-delivered.json`) — sidecar failures are logged and
   * swallowed (advisory persistence: a failed write only re-opens the
   * restart-replay window for this one marker, it never blocks delivery).
   */
  private async persist(runDir: string, key: string, marker: string): Promise<void> {
    this.delivered.add(key)
    try {
      await recordDeliveredMarker(runDir, marker)
    } catch (error) {
      this.ctx.logger.warn(`rdd-goal-tree: delivered-marker persist failed for ${marker}: ${error instanceof Error ? error.message : String(error)}`)
    }
```

</details>

**依据 2 · 源码核查**：[dsh/rdd-goal-tree/src/watcher.ts:351-369](https://github.com/YaphetHayate/codeRDD/blob/01e52f9e1531acd7c235ab332c19298d568a1f85/dsh/rdd-goal-tree/src/watcher.ts#L351-L369)

提示规划者进一步裁决。

<details>
<summary>查看原文（19行）</summary>

```text
  /** One queued context message for the Planner. */
  private buildMessage(entry: GoalTreeReportEntry) {
    const summary = (entry.summary ?? '').replace(/\s+/g, ' ').slice(0, 160)
    const confidence = entry.confidence === null ? '' : ` confidence=${entry.confidence}`
    // Artifact locations (planner-callback-handoff): the Planner settles from
    // this single message — change list, deliverable doc pointer, verification
    // digest — without consulting the ledger.
    const text = [
      `[rdd-goal-tree] run "${entry.runId}" · node ${entry.nodeId} reported by ${entry.worker ?? 'unknown'} — verdict=${entry.verdict ?? 'unknown'}${confidence} (ledger ${entry.entryId}).`,
      artifactLine(entry),
      'Planner action: settle (goal-tree.cmd -Command settle) or prune with a reason, or graft follow-up nodes; reported nodes are never re-consumed.',
      ...(summary === '' ? [] : [`Worker summary: ${summary}`]),
    ].join('\n')
    return this.createMessage({
      content: [{ type: 'text', text }],
      source: {
        kind: 'plugin',
        plugin: PLUGIN_ID,
        context: { form: 'notice', summary: `goal-tree ${entry.nodeId} reported (${entry.verdict ?? 'unknown'})` },
```

</details>

#### 缺口

- 消费与裁决状态方案尚未实现或核验
  **影响**：不能宣称已经闭环
  **进一步探讨**：检查宿主事件后隔离注入故障验证状态迁移。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
