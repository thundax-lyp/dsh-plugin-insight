# dsh-lowtide

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e1f8efa](https://github.com/KelaoHu/dsh-lowtide/tree/e1f8efa528b8e509c68e294919f6b74d0a17aaeb)

<!-- BEGIN META -->
[![GitHub ★ 178](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=178&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/KelaoHu/dsh-lowtide)
<!-- END META -->

> **功能**：提供 DSH 任务队列、峰谷窗口调度及批次执行结果复核。

> **亮点**：[Q01](#research-q01) 把任务队列和跨日窗口纳入固定工作流。

> **主要限制**：[Q02](#research-q02) 自动等级、窗口和实际计价要分别验收。

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
  - [Q01 · 根工程和可安装包的区别是什么？](#detail-section-11)
  - [Q02 · 人工放行及低价运行的边界？](#detail-section-12)
  - [Q03 · 如何试用及退出？](#detail-section-13)
  - [Q04 · 如何验证峰谷排程节省？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要延后运行非紧急 DSH 任务并集中验收的开发者。

手工在指定时间启动任务，之后逐项看结果和账单。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 窗口批处理 | 延迟非紧急任务 | 需宿主及模型 |
| 任务状态 | 审核和查看结果 | 自动等级与路径需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容宿主及 Node | 必需 | 运行可安装子包 | 保留手工调度 |
| 模型与权限 | 执行必需 | 完成任务 | 停在队列 |
| 独立 profile | 验证必需 | 限定状态单写者 | 避免并行部署 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 操作者核对制品与状态路径 | 不直接安装根包 |
| 试用 | 保留人工确认并投入惰性任务 | 核对窗口和权限 |
| 退出 | 关闭调度并检查活跃任务 | 保留需要的台账 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 模型和环境成本未知 | 配置窗口与权限 | 未实测 |
| 持续 | 请求与重试费用 | 核对批次 | 价格待对账 |
| 恢复 | 停止及重跑费用未知 | 检查任务和写入 | 不盲目重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 调度 | 窗口和批次接线 | 重启及真实可靠性 |
| 节省 | 价格窗口提供动机 | 实际账单 |

> **思考**：[Q02](#research-q02) 自动等级、窗口和实际计价要分别验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把任务队列和跨日窗口纳入固定工作流。

[Q01](#research-q01) 根构建与宿主装配分离，时段按起始日标识。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 自动等级、窗口和实际计价要分别验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先核对子包身份和隔离 profile，再按 [Q02](#research-q02) 测试自动等级。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根工程及子包接线的静态核查，未测试实际宿主和价格。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/dsh-lowtide/package.json、packages/dsh-lowtide/src/scheduler.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根 workspace 和子包代表路径，未执行插件。
- 下一步：用固定时钟测试跨日、重启、暂停及账单口径。

**分析版本**

- **仓库**：[KelaoHu/dsh-lowtide](https://github.com/KelaoHu/dsh-lowtide)
- **版本号**：0.2.8（[固定提交 e1f8efa](https://github.com/KelaoHu/dsh-lowtide/tree/e1f8efa528b8e509c68e294919f6b74d0a17aaeb)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 将实际请求和账单关联以检查净节省。

用固定时钟测试跨日、重启、暂停及账单口径。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 3699 | — | — | 42483 |
| .ts | source | 32 | 6293 | 4703 | 1173 | — |
| .ts | test | 39 | 4289 | 3353 | 499 | — |
| .tsx | source | 18 | 3539 | 2983 | 369 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/KelaoHu/dsh-lowtide/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/KelaoHu/dsh-lowtide/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/KelaoHu/dsh-lowtide/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：根工程如何组织峰谷批处理，哪些结果需要单独验证？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根工程和可安装包的区别是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要在非工作时段执行低优先级开发任务的用户可把任务放入队列，延后执行并集中验收。根包是私有 workspace 的构建入口，core 与实际可安装的 packages/dsh-lowtide 分开。子包导出宿主和客户端，并声明 bundle patch。具体窗口识别与调度在插件子包，跨午夜窗口按起始日期识别，触发后交给批处理。相比人工按时启动任务，项目提供有状态的窗口与任务队列。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-22](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/package.json#L1-L22)

根私有工作区入口

<details>
<summary>查看原文（22行）</summary>

```text
{
  "name": "dsh-lowtide",
  "version": "0.2.8",
  "private": true,
  "license": "MIT",
  "author": "dsh-lowtide contributors",
  "repository": {
    "type": "git",
    "url": "https://github.com/KelaoHu/dsh-lowtide"
  },
  "description": "dsh-lowtide: human-adjudicated off-peak batch task pipeline for DeepSeek Harness (peak/valley pricing aware)",
  "type": "module",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "packageManager": "pnpm@11.7.0",
  "scripts": {
    "build": "pnpm -r bundle",
    "test": "pnpm -r test",
    "typecheck": "pnpm -r typecheck",
    "dev:dsh": "pnpm --filter dsh-lowtide dev",
    "watch:dsh": "pnpm --filter dsh-lowtide watch"
```

</details>

**依据 2 · 源码核查**：[packages/dsh-lowtide/package.json:1-31](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/package.json#L1-L31)

可安装子包

<details>
<summary>查看原文（31行）</summary>

```text
{
  "name": "dsh-lowtide",
  "version": "0.2.8",
  "description": "lowtide: human-adjudicated off-peak batch task pipeline for dsh (peak/valley pricing aware)",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/src/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/src/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-connection"
      ],
      "platform": "web"
    }
```

</details>

**依据 3 · 作者声明**：[README.md:52-65](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/README.md#L52-L65)

作者说明任务生命周期

<details>
<summary>查看原文（14行）</summary>

````text
## How lowtide works

```
① Intake             ② Adjudicate         ③ Execute               ④ Accept
Whenever you have    The queue dock        When the off-peak       When you're back:
a moment: one-click  groups tasks by       window opens: five      open the report —
from the intercept   workspace; triage    preflight gates pass,    results + diff
card, or file a  →   line by line:    →   then sandboxed runs →    + actual spend
ticket (4 strategies) ✓approve ⏸defer     one batch per window     + money saved
                     ✕drop / approve-all
```

A task's life: `pending-review → queued → preflight → running → done / failed / stale / timeout`, plus `deferred` (postponed) and `dropped` (soft-deleted, restorable).

````

</details>

**依据 4 · 源码核查**：[packages/dsh-lowtide/src/scheduler.ts:77-93](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/scheduler.ts#L77-L93)

跨午夜窗口标识

<details>
<summary>查看原文（17行）</summary>

```text
 * Identity of the batch window currently in progress, keyed by the calendar
 * day the window STARTED (so a midnight-crossing window cannot run twice)
 * plus the window's range string — with multiple windows (issue #5) each
 * window earns its own once-per-occurrence latch. Returns null when `now`
 * is outside every window.
 */
export function currentWindowKey(now: Date, window: string | string[], tz?: string): string | null {
  const list = Array.isArray(window) ? window : [window]
  const active = activeWindows(now, list, tz)
  if (active.length === 0) return null
  const range = active[0]
  const resolvedTz = tz ?? systemTimeZone()
  const { start } = parseWindowRange(range)
  const { minutes } = localParts(now, resolvedTz)
  const anchor = minutes >= start ? now : addDaysInTz(now, resolvedTz, -1)
  return `${localDateKey(anchor, resolvedTz)}|${range}|${resolvedTz}`
}
```

</details>

**依据 5 · 源码核查**：[packages/dsh-lowtide/src/scheduler.ts:119-155](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/scheduler.ts#L119-L155)

调度与批处理调用

<details>
<summary>查看原文（37行）</summary>

```text
export function startScheduler(ctx: Context, store: LowtideStore, tickMs = 30_000): Scheduler {
  let running = false
  let startedAt: Date | null = null
  let lastWindowKey: string | null = null

  async function run(forced: boolean): Promise<void> {
    if (running) return
    if (!forced && store.config.batch.paused) return
    const now = new Date()
    const wins = batchWindowList(store.config.batch)
    const activeRange = forced ? undefined : activeWindows(now, wins, store.config.batch.tz)[0]
    if (!forced && activeRange === undefined) {
      // Outside every window: clear the once-per-window latch so the next
      // window (possibly the same day after a config change) may run again.
      if (lastWindowKey !== null) lastWindowKey = null
      return
    }
    const key = activeRange === undefined ? null : currentWindowKey(now, wins, store.config.batch.tz)
    if (!forced) {
      if (key !== null && key === lastWindowKey) return
      if (key !== null) lastWindowKey = key
      recoverDeferred(store)
      if (!hasQueuedWork(store)) return
    }
    running = true
    startedAt = new Date()
    try {
      const end = forced ? new Date(Date.now() + 24 * 3600_000) : batchWindowEnd(new Date(), wins, store.config.batch.tz)
      // The report records the window that actually triggered this batch
      // (forced manual runs label the first configured window, as before).
      await runBatch(ctx, store, end, forced, activeRange ?? wins[0])
    } catch (error) {
      ctx.logger('lowtide').warn('batch failed: %s', error instanceof Error ? error.message : String(error))
    } finally {
      running = false
      startedAt = null
    }
```

</details>

#### 缺口

- 未运行宿主排程、跨午夜或重启
  **影响**：无法确认重复窗口和实际作业结果
  **进一步探讨**：用测试时钟和惰性任务核对多窗口、跨日与重启

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 人工放行及低价运行的边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

README 总览写每任务经人工放行，自治等级实际另说明 L3 入队后不逐项确认。需用实际配置区分批确认和全自动。窗口负责限制何时启动，不会因为到了结束时间而自动撤回已开始的操作。预检、预算和权限均需要按实际宿主验证，设置一段窗口也不能决定供应商的真实计价。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:54-66](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/README.md#L54-L66)

总览的人工承诺

<details>
<summary>查看原文（13行）</summary>

````text
```
① Intake             ② Adjudicate         ③ Execute               ④ Accept
Whenever you have    The queue dock        When the off-peak       When you're back:
a moment: one-click  groups tasks by       window opens: five      open the report —
from the intercept   workspace; triage    preflight gates pass,    results + diff
card, or file a  →   line by line:    →   then sandboxed runs →    + actual spend
ticket (4 strategies) ✓approve ⏸defer     one batch per window     + money saved
                     ✕drop / approve-all
```

A task's life: `pending-review → queued → preflight → running → done / failed / stale / timeout`, plus `deferred` (postponed) and `dropped` (soft-deleted, restorable).

Step two is where lowtide differs from a "fully automated script": **every task must be released by your hand before it runs** (in L2, you release the whole batch at once, 30 minutes before the window). The machine cannot move itself into the run queue. Execution is automated; decisions are not. That's why you can safely be absent.
````

</details>

**依据 2 · 作者声明**：[README.md:115-133](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/README.md#L115-L133)

不同自治等级与作者预检说明

<details>
<summary>查看原文（19行）</summary>

```text
## Three autonomy levels

- **L1 per-task**: every task needs your individual ✓. Use it early on, or when the repo is precious.
- **L2 batch** (default): tasks wait in review; a gate card appears 30 minutes before the batch and releases everything at once; no release, no run. The daily driver.
- **L3 full-auto**: filed tasks queue immediately and run in the sandbox at off-peak, zero confirmations (switching asks twice). Built for always-on servers.

Individual tasks can override the global level in the ticket modal.

## Architecture: how it runs while you're away

Letting an agent run batch jobs while you sleep is a big ask. Four layers underneath make it safe.

**The Cordis microkernel.** dsh runs on the Cordis microkernel plugin ecosystem: every capability is a plugin, and plugins talk through service injection rather than direct dependency. lowtide's host half is a set of well-behaved Cordis services — routes, scheduler, state machine — each doing its own job, registered into the kernel, starting with the harness, uninstalling cleanly. In plain words: it's not a skin stapled onto dsh; it's an organ grown inside the kernel.

**Two faces, one artifact.** The host half (Node.js) owns scheduling, execution, and the ledger; the browser half (React) owns every pixel. One build produces both — and since dsh Desktop's GUI is itself web-rendered, desktop and web need no separate branches. Same bytes, same behavior.

**A platform-agnostic core.** `lowtide-core` holds the window model, price tables, the billing formula, queue digest, ledger, and batch-window math — all pure functions that touch zero dsh APIs, shipped as their own package with their own tests. The practical payoff: the core has been hammered by 44 pure-function unit tests, and if you ever port lowtide to another agent framework, this package lifts out intact.

**Defense in depth.** Five preflight gates (is the workspace still there, did git HEAD move, do the locked-file sha256s match, does the window fit, is there budget left) — fail any one and the task goes stale or defers; never a blind run. Three sandbox presets with approval set to never — unattended means nobody is there to click "allow", so what's permitted is decided before the run starts. The state file is written atomically and rolls back to a backup if corrupted. HTTP routes only accept same-origin requests from this machine.
```

</details>

**依据 3 · 源码核查**：[packages/dsh-lowtide/src/scheduler.ts:1-10](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/scheduler.ts#L1-L10)

窗口结束的作用范围

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Lowtide scheduler (PLAN T1.4): minute-aligned tick driving the batch
 * runner inside the configured window. The window end stops new launches but
 * never interrupts a running task. `runNow` is the manual/test path.
 *
 * Fixes over the MVP tick (2026-08 review round 1):
 *  - once-per-window guard: a window (start-day keyed, midnight-crossing
 *    safe) runs the batch at most once even when the host restarts inside it;
 *  - deferred auto-recovery: at window start, preflight-deferred tasks
 *    (deferCount > 0) go back to queued (retry next window), user-triaged
```

</details>

**依据 4 · 源码核查**：[packages/dsh-lowtide/src/scheduler.ts:119-155](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/scheduler.ts#L119-L155)

批次触发与状态

<details>
<summary>查看原文（37行）</summary>

```text
export function startScheduler(ctx: Context, store: LowtideStore, tickMs = 30_000): Scheduler {
  let running = false
  let startedAt: Date | null = null
  let lastWindowKey: string | null = null

  async function run(forced: boolean): Promise<void> {
    if (running) return
    if (!forced && store.config.batch.paused) return
    const now = new Date()
    const wins = batchWindowList(store.config.batch)
    const activeRange = forced ? undefined : activeWindows(now, wins, store.config.batch.tz)[0]
    if (!forced && activeRange === undefined) {
      // Outside every window: clear the once-per-window latch so the next
      // window (possibly the same day after a config change) may run again.
      if (lastWindowKey !== null) lastWindowKey = null
      return
    }
    const key = activeRange === undefined ? null : currentWindowKey(now, wins, store.config.batch.tz)
    if (!forced) {
      if (key !== null && key === lastWindowKey) return
      if (key !== null) lastWindowKey = key
      recoverDeferred(store)
      if (!hasQueuedWork(store)) return
    }
    running = true
    startedAt = new Date()
    try {
      const end = forced ? new Date(Date.now() + 24 * 3600_000) : batchWindowEnd(new Date(), wins, store.config.batch.tz)
      // The report records the window that actually triggered this batch
      // (forced manual runs label the first configured window, as before).
      await runBatch(ctx, store, end, forced, activeRange ?? wins[0])
    } catch (error) {
      ctx.logger('lowtide').warn('batch failed: %s', error instanceof Error ? error.message : String(error))
    } finally {
      running = false
      startedAt = null
    }
```

</details>

#### 缺口

- 未验证各自治等级的真实审批、预算和隔离
  **影响**：无法支持无人值守的安全采用
  **进一步探讨**：以惰性任务核对 L1、L2、L3、跨窗执行与宿主权限

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用及退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

根不是直接安装入口。包需相应 DSH、Node 与可用模型，说明给出预构建子包及源码构建。作者指状态文件可按 profile 隔离，同时要求同一文件单写者。试用宜用独立 profile 的可丢弃任务，保留人工放行并核对实际状态与价格。终止时关调度并检查活跃任务，保留或处理含提示的台账。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:13-22](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/package.json#L13-L22)

根构建条件

<details>
<summary>查看原文（10行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "packageManager": "pnpm@11.7.0",
  "scripts": {
    "build": "pnpm -r bundle",
    "test": "pnpm -r test",
    "typecheck": "pnpm -r typecheck",
    "dev:dsh": "pnpm --filter dsh-lowtide dev",
    "watch:dsh": "pnpm --filter dsh-lowtide watch"
```

</details>

**依据 2 · 作者声明**：[README.md:137-145](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/README.md#L137-L145)

作者宿主及工具要求

```text
## Installation

**One-line install (prebuilt):** `dsh plugin --profile web add https://github.com/KelaoHu/dsh-lowtide/releases/latest/download/dsh-lowtide.tgz` — or build from source below.

Prerequisites: Node `^22.19 || >=24`, pnpm `11.7`. Everything is on the public npm registry — no private registry needed.

First install dsh (pick one): Desktop from DeepSeek's official channels, or `npm install -g @deepseek-ai/dsh` for the CLI. Then configure a working model in dsh's settings (e.g. an official DeepSeek API key) — lowtide never touches your credentials.

> **Compatibility (dsh-lowtide ≥ 0.2.8):** dsh CLI **≥ 0.1.5-rc.1**, **DSH Desktop 2.0.3**, or the runtime bundled with **DeepSeek Harness 0.2.1-rc.2**. The browser half limits itself to the module words every shell generation seeds statically, so one artifact boots on both; 0.1.1-era CLI shells share the desktop's seed table and should behave the same, but only the targets above are tested. (0.2.2 and older fail to boot on CLI 0.1.5 — see issue #4.) **0.2.8 raises the declared host range to `>=0.1.0-rc.7 <0.2.2-0`:** 0.2.6 and 0.2.7 stopped at `<0.2.1-0`, which excludes the 0.2.1 runtime, so the gate skipped the entire bundle and no part of the plugin loaded; 0.2.3–0.2.5 used a caret (`^0.1.0-rc.7`, later `^0.1.5-rc.1`) whose 0.x upper bound stopped short of the 0.2.0 line.
```

**依据 3 · 作者声明**：[README.md:230-251](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/README.md#L230-L251)

单写者、数据及安全边界

<details>
<summary>查看原文（22行）</summary>

````text
## Data & state

- Everything persists in `$DSH_HOME/lowtide.json` (atomic writes, automatic rollback on corruption); with `DSH_PROFILE` set, state is isolated per profile. **One writer per file at a time** — don't run Desktop and Web at once without profile isolation.
- One batch per window, overnight-safe; an empty queue produces no empty report.
- Deferral recovery: at window start, preflight-deferred tasks re-queue automatically (failed after ≥3); manually deferred tasks return to pending-review.

## Testing & CI

```powershell
pnpm --filter lowtide-core test    # 44 pure-function core tests
pnpm --filter dsh-lowtide test     # 124 plugin unit tests
pnpm --filter dsh-lowtide exec playwright test   # e2e (needs dsh web running on :3080)
```

Ten e2e specs run serially, from two-face load smoke to the full intake→adjudicate→run→report loop against the real API. The repo includes a GitHub Actions workflow: every push / PR runs install → build → typecheck → the full unit suite on four environments.

## Security

- Routes only accept loopback + same-origin; **don't expose port 3080 to the public internet** — use an SSH tunnel or an authenticated reverse proxy.
- The Windows sandbox is mitigation-grade; Linux/macOS enforce fully. For unattended use, stack the file allowlist and the daily budget.
- Switching to L3 full-auto asks twice.
- The state file holds full task prompts and paths; treat backups accordingly.
````

</details>

#### 缺口

- 未验证平台隔离、运行费用或移除后的活跃任务
  **影响**：不能估算真实节省与运维时间
  **进一步探讨**：先检查实际子包制品、状态目录、暂停和恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证峰谷排程节省？

**研究主题**：新假设与验证

#### 完整回答

在现有报告窗口标记旁可展示每次请求的开始时间和实际账单匹配范围，把模型单价差、额外轮次和等待分开。用同一类可重复任务随机走当前时段或排程，在真实账单可查时比较合格结果、总代价和等待时间。若价格收益被重跑或交付时间抵消，则不采用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-36](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/README.md#L21-L36)

作者的低价假设

<details>
<summary>查看原文（16行）</summary>

```text
## Introduction

lowtide is a plugin for [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/dsh). The problem it solves is plain and perfectly natural:

Usually, when you want an agent to do some work, you sit at the computer, send the agent an instruction, wait for the reply, and then review it by hand. But this workflow seems to forget that you have plenty of idle time — and a chance to dodge the peak/off-peak pricing that some models charge.

With lowtide installed, the day goes like this: whenever a job crosses your mind during the day, toss it in the queue, glance at it, release it. The tasks pile up until the time you set (say, after 7 PM — that's when DeepSeek is at valley pricing), then run by themselves. Next morning you open the report: keep what went well, send back what didn't.

That's all it is. But use it for a week and your working rhythm genuinely slows down — and don't forget, "time is money, efficiency is life"...

A few key capabilities:

- Four execution strategies: single, iterative, sampling, review — from "one pass is enough" to "run five candidates and I'll pick"
- 168 unit tests + 10 end-to-end specs, CI green across ubuntu / windows × node 22 / 24
- One build artifact serves both desktop and web — install once, works on both
- Off-peak execution lands in DeepSeek's valley hours: the same batch costs about half of what peak would
```

</details>

**依据 2 · 源码核查**：[packages/dsh-lowtide/src/scheduler.ts:144-155](https://github.com/KelaoHu/dsh-lowtide/blob/e1f8efa528b8e509c68e294919f6b74d0a17aaeb/packages/dsh-lowtide/src/scheduler.ts#L144-L155)

现有报告窗口口径

<details>
<summary>查看原文（12行）</summary>

```text
    startedAt = new Date()
    try {
      const end = forced ? new Date(Date.now() + 24 * 3600_000) : batchWindowEnd(new Date(), wins, store.config.batch.tz)
      // The report records the window that actually triggered this batch
      // (forced manual runs label the first configured window, as before).
      await runBatch(ctx, store, end, forced, activeRange ?? wins[0])
    } catch (error) {
      ctx.logger('lowtide').warn('batch failed: %s', error instanceof Error ? error.message : String(error))
    } finally {
      running = false
      startedAt = null
    }
```

</details>

#### 缺口

- 未取得账单或任务对照
  **影响**：不能量化净节省
  **进一步探讨**：用固定模型和任务记录账单及完成标准

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
