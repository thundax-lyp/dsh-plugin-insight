# DSH UI Usage Billing

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[7780c54](https://github.com/kenz1117/dsh-ui-usage-billing/tree/7780c5462fb7ce4822cd0bfa6d422f50e0c6215b)

<!-- BEGIN META -->
[![GitHub ★ 95](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=95&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kenz1117/dsh-ui-usage-billing) [![npm 30d 14,283](https://img.shields.io/static/v1?label=npm+30d&message=14%2C283&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@kenz1117/dsh-ui-usage-billing) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@kenz1117/dsh-ui-usage-billing)
<!-- END META -->

> **功能**：在 DSH 聚合模型用量和估算费用，并提供可选任务队列。

> **亮点**：[Q01](#research-q01) 希望回顾模型使用和费用的用户可从持久会话聚合用量。aggregator 按 assistant source 归属，request header 作回退，并用计价目录估算。HTTP 回应有快照回退，避免长扫描阻塞请求。相比人工看日志和价格，统一口径便于对账。

> **主要限制**：[Q02](#research-q02) 统计通常只读，但 task-queue POST 能显式入队，校验 workspace 和模型后创建 queued 项并调用 pump。Origin 检查只限回环主机，不限定相同端口，本地进程与回环代理需要另测；peer 和 Host 也受 guard 限制。未知或订阅模型 token 仍计而成本为零，不能解释成实际免费。

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
  - [Q01 · 用量面板怎样得到数据？](#detail-section-11)
  - [Q02 · 只读默认覆盖哪些功能？](#detail-section-12)
  - [Q03 · 如何试用和退出？](#detail-section-13)
  - [Q04 · 怎样减少入队响应丢失后的重复任务？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要核对模型使用和规划任务的用户。

手工读日志、查价和发起任务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 统计 | 用量估价 | 需账单对照 |
| 队列 | 显式任务 | 宿主权限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| sessionPersistence | 统计需要 | 提供日志 | 核对快照 |
| 宿主任务控制 | 队列需要 | 执行任务 | 停用队列 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 合成日志 | 记录价表 |
| 验证 | 聚合与惰性队列 | 读回任务 |
| 退出 | 停队列禁用 | 保留账本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 资源未知 | 造基准日志 | 未测 |
| 持续 | 扫描与请求成本未知 | 对账维护 | 按模型 |
| 退出 | 恢复成本未知 | 查队列账本 | 读回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 用量 | 实际日志聚合 | 估价误差 |
| 队列 | 显式校验和调度 | 重试一致性 |

> **思考**：[Q02](#research-q02) 统计通常只读，但 task-queue POST 能显式入队，校验 workspace 和模型后创建 queued 项并调用 pump。Origin 检查只限回环主机，不限定相同端口，本地进程与回环代理需要另测；peer 和 Host 也受 guard 限制。未知或订阅模型 token 仍计而成本为零，不能解释成实际免费。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 希望回顾模型使用和费用的用户可从持久会话聚合用量。aggregator 按 assistant source 归属，request header 作回退，并用计价目录估算。HTTP 回应有快照回退，避免长扫描阻塞请求。相比人工看日志和价格，统一口径便于对账。

[Q02](#research-q02) 统计通常只读，但 task-queue POST 能显式入队，校验 workspace 和模型后创建 queued 项并调用 pump。Origin 检查只限回环主机，不限定相同端口，本地进程与回环代理需要另测；peer 和 Host 也受 guard 限制。未知或订阅模型 token 仍计而成本为零，不能解释成实际免费。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 统计通常只读，但 task-queue POST 能显式入队，校验 workspace 和模型后创建 queued 项并调用 pump。Origin 检查只限回环主机，不限定相同端口，本地进程与回环代理需要另测；peer 和 Host 也受 guard 限制。未知或订阅模型 token 仍计而成本为零，不能解释成实际免费。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在隔离 profile 导入合成会话，核对按模型、日与会话统计以及价格来源。先保持任务队列不提交，后以惰性任务验证显式入队。计价与余额需核对外部数据和凭据目的地。退出前停队列并禁用插件，保留所需账本。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码及作者说明，未执行目标。

- 已检查：作者 README、包清单、源码路径 README.md、src/aggregate.ts、src/guard.ts、src/routes/task-queue.ts、src/routes/usage-stats.ts、src/task-queue.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定身份及其直接依赖的代表实现。
- 下一步：验证价格缺失、跨来源写入和重放。

**分析版本**

- **仓库**：[kenz1117/dsh-ui-usage-billing](https://github.com/kenz1117/dsh-ui-usage-billing)
- **版本号**：1.8.3-alpha.1（[固定提交 7780c54](https://github.com/kenz1117/dsh-ui-usage-billing/tree/7780c5462fb7ce4822cd0bfa6d422f50e0c6215b)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 对照当前生成新 id 的入队路径，试验客户端操作 ID 与服务端去重。模拟提交后断线和重新提交，比较任务及会话数量；若仍重复或阻止合法新任务则调整。

验证价格缺失、跨来源写入和重放。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 4251 | — | — | 75813 |
| .js | source | 3 | 11102 | 9490 | 1741 | — |
| .ts | source | 75 | 18461 | 12581 | 4933 | — |
| .mjs | source | 5 | 999 | 733 | 193 | — |
| .tsx | source | 13 | 8091 | 6863 | 1098 | — |
| .ts | test | 57 | 10658 | 8318 | 1400 | — |
| .tsx | test | 33 | 5308 | 4218 | 604 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/kenz1117/dsh-ui-usage-billing/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=25&color=737b86&logo=github)](https://github.com/kenz1117/dsh-ui-usage-billing/issues?q=is%3Aissue+created%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z) [![近30天关闭 27](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=27&color=737b86&logo=github)](https://github.com/kenz1117/dsh-ui-usage-billing/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话地图如何组织和传递上下文？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用量面板怎样得到数据？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

希望回顾模型使用和费用的用户可从持久会话聚合用量。aggregator 按 assistant source 归属，request header 作回退，并用计价目录估算。HTTP 回应有快照回退，避免长扫描阻塞请求。相比人工看日志和价格，统一口径便于对账。

#### 证据与依据

**依据 1 · 源码核查**：[src/aggregate.ts:1-18](https://github.com/kenz1117/dsh-ui-usage-billing/blob/7780c5462fb7ce4822cd0bfa6d422f50e0c6215b/src/aggregate.ts#L1-L18)

归属和价格语义

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Real-usage aggregation: folds every persisted session log into the
 * usage-stats document the dashboard renders.
 *
 * Each LLM call is attributed to the `message.source` carried by its own
 * `assistant/message` event (copied from the request at write time); the
 * sparse `request/header` is only a fallback. Costs are estimated with the
 * shared billing catalog (`pricing.ts`, in CNY), so only models the catalog
 * prices incur a cost — subscription-plan routes and unknown models price
 * zero while their tokens still count. Pure functions only: the persistence
 * handle is injected, so the fold is unit-testable without a host.
 */

import { stat } from 'node:fs/promises'
import * as sessionTypes from '@deepseek-ai/dsh-session/types'
import type { SessionEvent, SessionHeader, SessionId, SessionLogOffset as SessionLogOffsetT } from '@deepseek-ai/dsh-session/types'
import type { TokenUsage } from '@deepseek-ai/dsh-llm'
import { isPriced, resolveCatalogKey, computeCostAt, modelOf, tierAt } from './client/pricing.ts'
```

</details>

**依据 2 · 源码核查**：[src/routes/usage-stats.ts:1-18](https://github.com/kenz1117/dsh-ui-usage-billing/blob/7780c5462fb7ce4822cd0bfa6d422f50e0c6215b/src/routes/usage-stats.ts#L1-L18)

聚合预算与快照

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * 路由：GET /api/billing/usage-stats
 *
 * 实时用量聚合文档（byDay / byModel / bySession / bySite / byTurn / perf 等）。
 * stale-while-revalidate：聚合是全量扫描（重度用户上万条会话的冷启动折叠以
 * 分钟计），HTTP 请求绝不全程等它——只给 RESPONSE_BUDGET_MS 的等待预算，超
 * 预算立即回最近一次快照；后台折叠完成后快照随之刷新（挂在聚合 promise 上，
 * 与响应路径解耦）。宿主是单进程，慢响应期间事件循环被折叠占住，会话/模型
 * 列表 RPC 会一起饿死（用户反馈的启动卡顿）。
 *
 * 路由文件只关心 HTTP 拼装：
 * - decorate（注入 PACKAGE_VERSION / 预算 / 阈值）
 * - 聚合预算（Promise.race + setTimeout.unref）
 * - 响应体缓存（`statsBodyCache`：装饰 + 序列化结果按 doc 引用 + config 字段
 *   缓存，30s 轮询期间复用）
 * - 失败路径（聚合失败 → 读快照候选 → 仍无则 `{ error }`）
 *
 * 聚合器（`aggregator.aggregate()` / `sessionUsageOf()`）+ 快照读写 + 配置在
```

</details>

**依据 3 · 作者声明**：[README.md:160-177](https://github.com/kenz1117/dsh-ui-usage-billing/blob/7780c5462fb7ce4822cd0bfa6d422f50e0c6215b/README.md#L160-L177)

作者说明数据流

<details>
<summary>查看原文（18行）</summary>

````text
## ⚙️ 工作原理

插件由服务端与浏览器端两部分组成：

```
浏览器端                                  服务端（Node）
  │                                        │
  ├─ GET /api/billing/usage-stats ────────▶ ├─ sessionPersistence 遍历持久化会话日志
  │                                        ├─ 按 request/header 归属模型
  │                                        ├─ token 按缓存命中 / 未命中分桶
  │                                        └─ 按实时单价表估算费用（人民币）
  ├─ GET /api/billing/pricing ────────────▶ ├─ models.dev 模型价 + 腾讯财经汇率（逐级降级）
  ├─ GET /api/billing/balance ────────────▶ ├─ DeepSeek 官方余额 API（凭据 seam 取 key）
  ├─ llm.models 健康探测 ─────────────────▶ └─ 返回聚合统计 JSON
  └─ 渲染仪表盘
```

- **服务端**（`src/index.ts`）：注入 `webServer`、`sessionPersistence` 与 `credentials`，注册用量、定价、余额、订阅、中转站、完成提醒、工具开关及 `GET/POST /api/billing/task-queue` 等回环端点。聚合器按会话缓存折叠结果并持久化独立用量账本。任务队列通过 `ctx.get()` 探测可选的 `sessionController` / `workspaceRegistry`，不把它们列为启动注入依赖；能力缺席时宿主与仪表盘照常工作。
````

</details>

#### 缺口

- 未与实际账单核对
  **影响**：归属、漏记和费用误差未知
  **进一步探讨**：合成多路模型日志对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 只读默认覆盖哪些功能？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

统计通常只读，但 task-queue POST 能显式入队，校验 workspace 和模型后创建 queued 项并调用 pump。Origin 检查只限回环主机，不限定相同端口，本地进程与回环代理需要另测；peer 和 Host 也受 guard 限制。未知或订阅模型 token 仍计而成本为零，不能解释成实际免费。

#### 证据与依据

**依据 1 · 源码核查**：[src/task-queue.ts:175-219](https://github.com/kenz1117/dsh-ui-usage-billing/blob/7780c5462fb7ce4822cd0bfa6d422f50e0c6215b/src/task-queue.ts#L175-L219)

校验及入队

<details>
<summary>查看原文（45行）</summary>

```text
  async enqueue(input: TaskQueueInput): Promise<void> {
    await this.enqueueMany([input])
  }

  /** Validate the whole batch before one locked append: no partially admitted import. */
  async enqueueMany(inputs: readonly TaskQueueInput[]): Promise<void> {
    const controller = usableController(this.options.getController())
    if (controller === undefined) throw new TaskQueueError('this host does not provide Session task control', 409)
    if (!Array.isArray(inputs) || inputs.length === 0) throw new TaskQueueError('at least one task is required')
    if (inputs.length > MAX_QUEUED) throw new TaskQueueError('too many active queue items', 409)
    const workspaces = this.options.getWorkspaces()
    const { models } = await this.modelOptions(controller, true)
    const validated = inputs.map((input, index) => {
      try {
        if (input === null || typeof input !== 'object' || Array.isArray(input)) {
          throw new TaskQueueError('task must be a JSON object')
        }
        const { prompt, cwd, provider, model } = input
        if (typeof prompt !== 'string' || prompt.trim() === '') throw new TaskQueueError('prompt is required')
        if (prompt.length > MAX_PROMPT_LENGTH) throw new TaskQueueError('prompt is too long')
        if (typeof cwd !== 'string' || !isAbsolute(cwd)) throw new TaskQueueError('a valid workspace is required')
        if (!workspaces.some(workspace => workspace.path === cwd)) {
          throw new TaskQueueError('workspace is no longer available', 409)
        }
        if (typeof provider !== 'string' || typeof model !== 'string') throw new TaskQueueError('model is required')
        if (!models.some(candidate => candidate.provider === provider && candidate.id === model)) {
          throw new TaskQueueError('select an available DeepSeek time-of-day model', 409)
        }
        return { prompt, cwd, provider, model }
      } catch (error) {
        if (inputs.length > 1 && error instanceof TaskQueueError) {
          throw new TaskQueueError(`task ${String(index + 1)}: ${error.message}`, error.status)
        }
        throw error
      }
    })
    await this.update(tasks => {
      const active = tasks.filter(task => !isTerminal(task.status)).length
      if (active + validated.length > MAX_QUEUED) throw new TaskQueueError('too many active queue items', 409)
      const createdAt = this.now()
      for (const input of validated) {
        tasks.push({ id: this.createId(), ...input, status: 'queued', createdAt })
      }
    })
    void this.pump()
```

</details>

**依据 2 · 源码核查**：[src/routes/task-queue.ts:23-42](https://github.com/kenz1117/dsh-ui-usage-billing/blob/7780c5462fb7ce4822cd0bfa6d422f50e0c6215b/src/routes/task-queue.ts#L23-L42)

写路由 guard

<details>
<summary>查看原文（20行）</summary>

```text
export function registerTaskQueueRoute(ctx: Context, deps: TaskQueueRouteDeps): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/api/billing/task-queue',
    handler: async (req: IncomingMessage, res: ServerResponse) => {
      if (!guardLoopback(req, res, deps.trustedHosts)) return
      if (req.method !== 'GET' && req.method !== 'POST') {
        send(res, 405, { error: 'method not allowed' })
        return
      }
      if (req.method === 'POST') {
        if (!isLoopbackOrigin(req.headers.origin)) {
          send(res, 403, { error: 'forbidden: loopback only' })
          return
        }
        if (!(req.headers['content-type'] ?? '').toLowerCase().includes('application/json')) {
          send(res, 415, { error: 'unsupported content-type' })
          return
        }
      }
```

</details>

**依据 3 · 源码核查**：[src/guard.ts:71-80](https://github.com/kenz1117/dsh-ui-usage-billing/blob/7780c5462fb7ce4822cd0bfa6d422f50e0c6215b/src/guard.ts#L71-L80)

回环来源允许

<details>
<summary>查看原文（10行）</summary>

```text
/** 校验 Origin 头是否回环（写操作用，防止跨站表单/fetch 改写设置）。Origin 缺失
 *  （curl 或同源 fetch 不带）视为放行，交给下方的 Content-Type 校验兜底；Origin 存在
 *  但主机非回环则拒绝——跨站脚本发起的写请求必带攻击者域名的 Origin。 */
export function isLoopbackOrigin(origin: string | undefined): boolean {
  if (origin === undefined || origin === '') return true
  try {
    // WHATWG URL 的 hostname 对 IPv6 保留方括号（`[::1]`）：先去括号再比对。
    const raw = new URL(origin).hostname
    const host = raw.startsWith('[') && raw.endsWith(']') ? raw.slice(1, -1) : raw
    return host === 'localhost' || host === '::1' || /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)
```

</details>

**依据 4 · 源码核查**：[src/aggregate.ts:5-11](https://github.com/kenz1117/dsh-ui-usage-billing/blob/7780c5462fb7ce4822cd0bfa6d422f50e0c6215b/src/aggregate.ts#L5-L11)

未知与订阅估价

```text
 * Each LLM call is attributed to the `message.source` carried by its own
 * `assistant/message` event (copied from the request at write time); the
 * sparse `request/header` is only a fallback. Costs are estimated with the
 * shared billing catalog (`pricing.ts`, in CNY), so only models the catalog
 * prices incur a cost — subscription-plan routes and unknown models price
 * zero while their tokens still count. Pure functions only: the persistence
 * handle is injected, so the fold is unit-testable without a host.
```

#### 缺口

- 任务生命周期、宿主审批和代理身份未知
  **影响**：不能保证重复请求无重复任务或真实成本完整
  **进一步探讨**：测试重放、取消和账单缺价

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

在隔离 profile 导入合成会话，核对按模型、日与会话统计以及价格来源。先保持任务队列不提交，后以惰性任务验证显式入队。计价与余额需核对外部数据和凭据目的地。退出前停队列并禁用插件，保留所需账本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:112-118](https://github.com/kenz1117/dsh-ui-usage-billing/blob/7780c5462fb7ce4822cd0bfa6d422f50e0c6215b/README.md#L112-L118)

作者默认和权限说明

```text
## 🛡️ 健壮性与隐私

- **真实聚合**：增量读取持久会话日志，单会话损坏容错，快照与独立账本可回退；未收录和估算价明确标注。
- **默认只读**：不注入系统提示、不创建会话、不提交 Prompt；只有用户显式入队才会写入新会话，权限仍由宿主控制。
- **回环安全**：HTTP 同时校验 peer socket 与 Host，写操作再校验 Origin、Content-Type 和 body 上限；CSV 防公式注入。
- **体验完整**：中英文与三种币种独立持久化，统一键盘焦点，厂商健康状态同时使用形状、颜色与文字。

```

**依据 2 · 作者声明**：[README.md:160-177](https://github.com/kenz1117/dsh-ui-usage-billing/blob/7780c5462fb7ce4822cd0bfa6d422f50e0c6215b/README.md#L160-L177)

外部价格余额和队列

<details>
<summary>查看原文（18行）</summary>

````text
## ⚙️ 工作原理

插件由服务端与浏览器端两部分组成：

```
浏览器端                                  服务端（Node）
  │                                        │
  ├─ GET /api/billing/usage-stats ────────▶ ├─ sessionPersistence 遍历持久化会话日志
  │                                        ├─ 按 request/header 归属模型
  │                                        ├─ token 按缓存命中 / 未命中分桶
  │                                        └─ 按实时单价表估算费用（人民币）
  ├─ GET /api/billing/pricing ────────────▶ ├─ models.dev 模型价 + 腾讯财经汇率（逐级降级）
  ├─ GET /api/billing/balance ────────────▶ ├─ DeepSeek 官方余额 API（凭据 seam 取 key）
  ├─ llm.models 健康探测 ─────────────────▶ └─ 返回聚合统计 JSON
  └─ 渲染仪表盘
```

- **服务端**（`src/index.ts`）：注入 `webServer`、`sessionPersistence` 与 `credentials`，注册用量、定价、余额、订阅、中转站、完成提醒、工具开关及 `GET/POST /api/billing/task-queue` 等回环端点。聚合器按会话缓存折叠结果并持久化独立用量账本。任务队列通过 `ctx.get()` 探测可选的 `sessionController` / `workspaceRegistry`，不把它们列为启动注入依赖；能力缺席时宿主与仪表盘照常工作。
````

</details>

**依据 3 · 源码核查**：[src/routes/task-queue.ts:72-85](https://github.com/kenz1117/dsh-ui-usage-billing/blob/7780c5462fb7ce4822cd0bfa6d422f50e0c6215b/src/routes/task-queue.ts#L72-L85)

入队及清理入口

<details>
<summary>查看原文（14行）</summary>

```text
        switch (input.action) {
          case 'enqueue':
            await deps.engine.enqueue(input)
            break
          case 'enqueueMany':
            if (!Array.isArray(input.tasks)) throw new TaskQueueError('tasks must be an array')
            await deps.engine.enqueueMany(input.tasks)
            break
          case 'remove':
            if (typeof input.id !== 'string' || input.id === '') throw new TaskQueueError('queue item id is required')
            await deps.engine.remove(input.id)
            break
          case 'clearFinished':
            await deps.engine.clearFinished()
```

</details>

#### 缺口

- 外部 API、凭据和退出未实测
  **影响**：费用与残留未知
  **进一步探讨**：先离线合成日志再分别启用外部能力

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少入队响应丢失后的重复任务？

**研究主题**：新假设与验证

#### 完整回答

对照当前生成新 id 的入队路径，试验客户端操作 ID 与服务端去重。模拟提交后断线和重新提交，比较任务及会话数量；若仍重复或阻止合法新任务则调整。

#### 证据与依据

**依据 1 · 源码核查**：[src/task-queue.ts:211-219](https://github.com/kenz1117/dsh-ui-usage-billing/blob/7780c5462fb7ce4822cd0bfa6d422f50e0c6215b/src/task-queue.ts#L211-L219)

生成 ID 和调度

```text
    await this.update(tasks => {
      const active = tasks.filter(task => !isTerminal(task.status)).length
      if (active + validated.length > MAX_QUEUED) throw new TaskQueueError('too many active queue items', 409)
      const createdAt = this.now()
      for (const input of validated) {
        tasks.push({ id: this.createId(), ...input, status: 'queued', createdAt })
      }
    })
    void this.pump()
```

#### 缺口

- 现有队列其他去重契约未知
  **影响**：可能需要持久索引
  **进一步探讨**：先核查接口再做响应丢失

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
