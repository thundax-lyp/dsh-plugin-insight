# dsh-model

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[74bc6c7](https://github.com/AIcivilization/dsh-model/tree/74bc6c7118e68d2b259c270921b1cf621d7f73e4)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AIcivilization/dsh-model) [![npm 30d 4,514](https://img.shields.io/static/v1?label=npm+30d&message=4%2C514&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model)
<!-- END META -->

> **功能**：为 DSH 和兼容客户端提供多来源模型中转与有序组合切换。

> **亮点**：统一多来源入口与有序回退，并提供签到等配套管理。[Q01](#research-q01)

> **主要限制**：成功状态不保证流完整，尝试多个上游可能产生重复费用或数据外发。[Q03](#research-q03)

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
  - [Q01 · 统一模型入口适合谁，相比直接调用上游有什么额外工作？](#detail-section-11)
  - [Q02 · 组合选择和错误分支如何工作？](#detail-section-12)
  - [Q03 · 成功 HTTP 响应和回退能保证最终回答完整吗？](#detail-section-13)
  - [Q04 · 部署、来源费用和凭据如何管理？](#detail-section-14)
  - [Q05 · 已有回退和成功模型响应头之外，怎样帮助用户控制回退成本？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用多个模型来源的用户；基线是逐个配置并手动切换上游。[Q01](#research-q01)

客户端直接配置单个模型或手动切换来源。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 来源 | 管理模型入口 | 账号和费用各异 |
| 组合 | 顺序回退 | 流开始后不再切换 |
| 密钥 | 撤销和轮换 | 数据与访问需管理 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 本机引擎与网关 | 必需 | 转发 | 直接调用上游 |
| 模型来源、网络与凭据 | 必需 | 生成 | 换来源或停止 |
| 预算与数据授权 | 试用需要 | 费用及隐私 | 不发送 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户选可信模型来源、密钥及预算 | 权限和费用明确 |
| 2 | 配置组合并发送短非敏感请求 | 核对响应模型，不通则检查连接 |
| 3 | 检查输出和账单 | 流中断或费用不明时停止重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 网关与网络 | 配置账户和密钥 | 版本与来源需核对 |
| 持续 | 上游可能计费 | 监控响应与账单 | 免费额度未知 |
| 恢复 | 尝试多个上游可能计费 | 核对部分输出 | 不保证幂等 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 路由 | 按序回退与成功模型头 | 可用率和费用改善 |
| 流 | 转发与错误结束 | 完整输出及上游计费 |

> **思考**：成功状态不保证流完整，尝试多个上游可能产生重复费用或数据外发。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一多来源入口与有序回退，并提供签到等配套管理。[Q01](#research-q01)

400/422 按错误文本决定回退；成功流开始后错误结束响应而不换模型。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

成功状态不保证流完整，尝试多个上游可能产生重复费用或数据外发。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

用独立可撤销密钥与低预算验证来源，流中断后核对上游。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持组合错误条件与流处理；未运行供应商或网关。

- 已检查：作者 README、包清单、源码路径 README.md、src/combo.ts、src/keys.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 135 文件、90 排除、零解析错误；静态分析组合和凭据接口，未执行目标。
- 下一步：固定网关和来源，以隔离密钥模拟状态码、流中断及费用核对。

**分析版本**

- **仓库**：[AIcivilization/dsh-model](https://github.com/AIcivilization/dsh-model)
- **版本号**：0.27.1（[固定提交 74bc6c7](https://github.com/AIcivilization/dsh-model/tree/74bc6c7118e68d2b259c270921b1cf621d7f73e4)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：在已有来源标签和响应头之外，按用户上限提示回退费用及数据范围可减少意外支出。[Q05](#research-q05)

固定网关和来源，以隔离密钥模拟状态码、流中断及费用核对。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1673 | 1523 | 102 | — |
| .md | source | 5 | 1062 | — | — | 18325 |
| .mjs | source | 1 | 44 | 31 | 8 | — |
| .ts | source | 91 | 14906 | 11244 | 2651 | — |
| .ts | test | 35 | 2998 | 2695 | 107 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AIcivilization/dsh-model/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AIcivilization/dsh-model/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AIcivilization/dsh-model/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：统一模型组合如何回退，何时不能继续切换及成本和凭据边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 统一模型入口适合谁，相比直接调用上游有什么额外工作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

使用多个模型来源的 DSH 或 OpenAI 兼容客户端用户可配置统一入口和有序组合；作者还描述账号签到。相对逐个切换模型，它提供顺序回退与统一配置，但用户需管理凭据、来源协议与费用；单一稳定模型可直接调用。来源免费、签到额度等均为作者声明而非当前验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-35](https://github.com/AIcivilization/dsh-model/blob/74bc6c7118e68d2b259c270921b1cf621d7f73e4/README.md#L22-L35)

作者声明签到和重试。

<details>
<summary>查看原文（14行）</summary>

```text
## 📅 1. 每日签到：积分自动到账

**最省心的一件事：每天的签到积分，不用再记着去领。**

| 产品 | 怎么接入 | 每天 |
|---|---|---|
| **Trae** | 本机装了 Trae 并登录过，自动识别，什么都不用做 | 签到送积分（实测每天 200） |
| **Qoder** | 粘贴一次个人访问令牌（国内版、国际版都行） | 领当天的签到积分 |
| **WorkBuddy 国内版** | 登录一次（可以加几个账号） | 签到送积分 |
| **豆包**（实验） | Mac / Windows 上点「从本机自动读取」，读豆包电脑版或浏览器里已登录的账号；也可以手动粘贴 Cookie（只支持个人账号） | 「天天领额度」送体验额度 |

- **自动签到默认打开**：北京时间零点后随机延后 5–55 分钟签好；失败的一小时后重试；电脑关机错过了，开机一分钟内补签。
- **结果看得见**：设置页顶部一行「今日已完成签到：…」，没签上的可以「一键签到」；签完在 dsh 右下角提示一次。
- **这台还能签哪些**：卡片里列出支持、但这台还没设置的，旁边就是「+ 添加」。
```

</details>

**依据 2 · 作者声明**：[README.md:53-61](https://github.com/AIcivilization/dsh-model/blob/74bc6c7118e68d2b259c270921b1cf621d7f73e4/README.md#L53-L61)

作者列出来源和费用边界。

```text
| 类型 | 来源 |
|---|---|
| **免费（推荐）** | **硅基流动**（国内直连，实名后部分模型免费）、**Gemini**（能上外网，免费模型里质量最好） |
| 免费 · 额度少 | **智谱 GLM**（Flash 系列免费）、**讯飞星火**（Spark Lite 免费）、百度千帆（ERNIE Speed / Lite）、Groq、OpenRouter（`:free` 模型） |
| 本机 | Ollama、LM Studio：启动后自动出现，不用登录 |
| 订阅 | Codex（ChatGPT Plus / Pro）、Kimi Code、Grok、Muse、Devin：在管理页里登录即可 |
| 按量付费 | DeepSeek 官方、OpenCode Zen、任意 OpenAI 兼容服务 |

每个来源都标出「免费 / 免费·额度少 / 需付费」，详见下面的[来源与费用](#来源与费用)。dsh-model 只负责转接，不提供额度。
```

**依据 3 · 源码核查**：[src/combo.ts:1-5](https://github.com/AIcivilization/dsh-model/blob/74bc6c7118e68d2b259c270921b1cf621d7f73e4/src/combo.ts#L1-L5)

组合路由设计。

```text
// combo.ts — 自定义组合切换（设计 §14.16）
//
// 一个组合 = 按顺序排好的几个模型（任意来源，订阅也行）。在 dsh 和其他软件里它就是一个模型 combo/<id>：
// 请求先发给第一个；限流、额度用完、出错就换下一个，直到有一个成功。已经开始输出之后不再切换。
// 引擎把 combo/<id> 转给守护进程（openai-compatibility 上游），守护进程再逐个调引擎里的真实模型。
```

#### 缺口

- 未运行网关、签到、供应商或 DSH
  **影响**：不能确认模型可用、费用、隐私和流式故障行为
  **进一步探讨**：固定供应商和网关，以隔离密钥测试状态码、流中断及计费

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 组合选择和错误分支如何工作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

组合需 2 至 8 个去重模型，不允许嵌套；可选模型清单会拒绝缺失项。请求按顺序发送本机网关：网络异常继续，400/422 仅在匹配额度、限流、上下文等文本时继续，其他状态可回退；取得成功响应和 body 就立即转发。开始输出后流错误只记录并结束，不再切换，不能保证无重复计费。

#### 证据与依据

**依据 1 · 源码核查**：[src/combo.ts:33-47](https://github.com/AIcivilization/dsh-model/blob/74bc6c7118e68d2b259c270921b1cf621d7f73e4/src/combo.ts#L33-L47)

组合数量、去重、嵌套和可用性检查。

<details>
<summary>查看原文（15行）</summary>

```text
/** 校验并规整一个组合；available 给了就检查模型都还在 */
export function normalizeCombo(input: { name?: unknown; models?: unknown }, available?: string[]): { name: string; models: string[] } {
  const name = String(input.name ?? '').trim()
  if (!name || name.length > 30) throw new DshModelError('bad_combo', L('组合要有名字（最多 30 个字）', 'A combo needs a name (up to 30 characters)'))
  const raw = Array.isArray(input.models) ? input.models.map((m) => String(m).trim()).filter(Boolean) : []
  const models = [...new Set(raw)]
  if (models.length < 2) throw new DshModelError('bad_combo', L('组合至少要两个模型', 'A combo needs at least two models'))
  if (models.length > MAX_COMBO_MODELS) throw new DshModelError('bad_combo', L(`组合最多 ${MAX_COMBO_MODELS} 个模型`, `A combo holds up to ${MAX_COMBO_MODELS} models`))
  const nested = models.find((m) => m.startsWith(`${COMBO_PREFIX}/`))
  if (nested) throw new DshModelError('bad_combo', L(`组合里不能再放组合（${nested}）`, `A combo cannot contain another combo (${nested})`))
  if (available) {
    const have = new Set(available)
    const missing = models.filter((m) => !have.has(m))
    if (missing.length) throw new DshModelError('bad_combo', L(`这些模型现在用不了：${missing.join('、')}`, `These models are not available now: ${missing.join(', ')}`))
  }
```

</details>

**依据 2 · 源码核查**：[src/combo.ts:51-55](https://github.com/AIcivilization/dsh-model/blob/74bc6c7118e68d2b259c270921b1cf621d7f73e4/src/combo.ts#L51-L55)

状态和错误文本回退判断。

```text
/** 这次失败值得换下一个吗：请求本身写错了（400 且不是额度/长度问题）换了也一样，直接返回 */
export function shouldFallBack(status: number, text: string): boolean {
  if (status !== 400 && status !== 422) return true
  if (BLOCKED_RE.test(text)) return true
  return /quota|rate|limit|credit|context|too long|too many tokens|maximum|exceed|overload|unavailable|not supported|unsupported/i.test(text)
```

**依据 3 · 源码核查**：[src/combo.ts:70-115](https://github.com/AIcivilization/dsh-model/blob/74bc6c7118e68d2b259c270921b1cf621d7f73e4/src/combo.ts#L70-L115)

顺序请求、流转发和中途失败。

<details>
<summary>查看原文（46行）</summary>

```text
export async function runCombo(run: ComboRun): Promise<void> {
  const { res, combo } = run
  const log = run.log ?? (() => {})
  let body: Record<string, unknown>
  try {
    body = JSON.parse(run.raw) as Record<string, unknown>
  } catch {
    return reply(res, 400, { error: { message: 'request body is not JSON', type: 'invalid_json', code: 'invalid_json' } })
  }
  const tried: string[] = []
  let last: { status: number; text: string } | undefined
  for (const model of combo.models) {
    if (run.signal.aborted) return
    let upstream: Response
    try {
      upstream = await fetch(`http://127.0.0.1:${run.port}/v1/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${run.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, model }),
        signal: run.signal,
      })
    } catch (error) {
      if (run.signal.aborted) return
      last = { status: 502, text: String((error as Error).message ?? error) }
      tried.push(`${model}: ${last.text.slice(0, 120)}`)
      continue
    }
    if (upstream.ok && upstream.body) {
      if (tried.length) log(`combo ${combo.id}: ${model} answered after ${tried.length} failed (${tried.join(' | ')})`)
      res.writeHead(upstream.status, {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'no-cache',
        'X-Dsh-Model-Combo-Model': model,
      })
      const stream = Readable.fromWeb(upstream.body as Parameters<typeof Readable.fromWeb>[0])
      stream.on('error', (error: unknown) => {
        log(`combo ${combo.id}: ${model} stream failed mid-flight: ${String(error)}`)
        if (res.writable) res.end()
      })
      stream.pipe(res)
      return
    }
    const text = await upstream.text().catch(() => '')
    last = { status: upstream.status, text }
    tried.push(`${model}: HTTP ${upstream.status}`)
    if (!shouldFallBack(upstream.status, text)) break
```

</details>

#### 缺口

- 未运行网关、签到、供应商或 DSH
  **影响**：不能确认模型可用、费用、隐私和流式故障行为
  **进一步探讨**：固定供应商和网关，以隔离密钥测试状态码、流中断及计费

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 成功 HTTP 响应和回退能保证最终回答完整吗？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不能。拿到成功状态和可读 body 后代码直接写响应并管道转发，流中失败时结束而不切换；客户端可能只收到部分输出。前一个失败请求可能已在上游执行或计费，恢复前需核对内容和账单；不同模型也未必具相同上下文、工具和数据策略。

#### 证据与依据

**依据 1 · 源码核查**：[src/combo.ts:80-110](https://github.com/AIcivilization/dsh-model/blob/74bc6c7118e68d2b259c270921b1cf621d7f73e4/src/combo.ts#L80-L110)

顺序尝试和成功流中断处理。

<details>
<summary>查看原文（31行）</summary>

```text
  let last: { status: number; text: string } | undefined
  for (const model of combo.models) {
    if (run.signal.aborted) return
    let upstream: Response
    try {
      upstream = await fetch(`http://127.0.0.1:${run.port}/v1/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${run.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, model }),
        signal: run.signal,
      })
    } catch (error) {
      if (run.signal.aborted) return
      last = { status: 502, text: String((error as Error).message ?? error) }
      tried.push(`${model}: ${last.text.slice(0, 120)}`)
      continue
    }
    if (upstream.ok && upstream.body) {
      if (tried.length) log(`combo ${combo.id}: ${model} answered after ${tried.length} failed (${tried.join(' | ')})`)
      res.writeHead(upstream.status, {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'no-cache',
        'X-Dsh-Model-Combo-Model': model,
      })
      const stream = Readable.fromWeb(upstream.body as Parameters<typeof Readable.fromWeb>[0])
      stream.on('error', (error: unknown) => {
        log(`combo ${combo.id}: ${model} stream failed mid-flight: ${String(error)}`)
        if (res.writable) res.end()
      })
      stream.pipe(res)
      return
```

</details>

**依据 2 · 源码核查**：[src/combo.ts:112-126](https://github.com/AIcivilization/dsh-model/blob/74bc6c7118e68d2b259c270921b1cf621d7f73e4/src/combo.ts#L112-L126)

错误汇总和最终返回。

<details>
<summary>查看原文（15行）</summary>

```text
    const text = await upstream.text().catch(() => '')
    last = { status: upstream.status, text }
    tried.push(`${model}: HTTP ${upstream.status}`)
    if (!shouldFallBack(upstream.status, text)) break
  }
  log(`combo ${combo.id}: all failed (${tried.join(' | ')})`)
  const message = L(`组合「${combo.name}」里的模型都失败了：${tried.join('；')}`, `Every model in combo "${combo.name}" failed: ${tried.join('; ')}`)
  let detail: unknown
  try {
    detail = last ? JSON.parse(last.text) : undefined
  } catch {
    detail = undefined
  }
  const upstreamError = (detail as { error?: unknown } | undefined)?.error
  reply(res, last?.status && last.status >= 400 ? last.status : 502, { error: { message, type: 'combo_failed', code: 'combo_failed', ...(upstreamError ? { last: upstreamError } : {}) } })
```

</details>

#### 缺口

- 未运行网关、签到、供应商或 DSH
  **影响**：不能确认模型可用、费用、隐私和流式故障行为
  **进一步探讨**：固定供应商和网关，以隔离密钥测试状态码、流中断及计费

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署、来源费用和凭据如何管理？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

网关依赖本机引擎、上游账号/网络与密钥，作者说明自身只转接不提供额度；setup 的远程 HTTPS 入口需单独核实配置。先限定可信来源和提示数据、使用独立可撤销密钥与预算，固定引擎/模型并用短请求验证；限流、流中断或异常费用先停止并核对上游。不能从本地凭据文件名推断加密或全部保护。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:53-61](https://github.com/AIcivilization/dsh-model/blob/74bc6c7118e68d2b259c270921b1cf621d7f73e4/README.md#L53-L61)

作者声明来源与额度。

```text
| 类型 | 来源 |
|---|---|
| **免费（推荐）** | **硅基流动**（国内直连，实名后部分模型免费）、**Gemini**（能上外网，免费模型里质量最好） |
| 免费 · 额度少 | **智谱 GLM**（Flash 系列免费）、**讯飞星火**（Spark Lite 免费）、百度千帆（ERNIE Speed / Lite）、Groq、OpenRouter（`:free` 模型） |
| 本机 | Ollama、LM Studio：启动后自动出现，不用登录 |
| 订阅 | Codex（ChatGPT Plus / Pro）、Kimi Code、Grok、Muse、Devin：在管理页里登录即可 |
| 按量付费 | DeepSeek 官方、OpenCode Zen、任意 OpenAI 兼容服务 |

每个来源都标出「免费 / 免费·额度少 / 需付费」，详见下面的[来源与费用](#来源与费用)。dsh-model 只负责转接，不提供额度。
```

**依据 2 · 作者声明**：[README.md:75-80](https://github.com/AIcivilization/dsh-model/blob/74bc6c7118e68d2b259c270921b1cf621d7f73e4/README.md#L75-L80)

作者描述引擎与远程入口。

```text
`setup` 可以重复执行，它会依次：

1. 下载并校验引擎，在本机 `127.0.0.1:8317/v1` 上运行，强制 key 鉴权；
2. 启动 dsh-model 的守护进程（管理页、签到、登录都靠它）。安装时不问任何 key：免费来源推荐**硅基流动**（国内直连）或 **Gemini**（能上外网），装好后在管理页里填 key。WorkBuddy 只用来签到，模型默认不接进 dsh；
3. 把管理页装进 dsh，把模型同步进 dsh；
4. 在 VPS 上，额外开通对外地址 `https://<dsh 的域名>:9443/v1`（没有域名时用 `<IP>.sslip.io`）。
```

**依据 3 · 源码核查**：[src/keys.ts:57-67](https://github.com/AIcivilization/dsh-model/blob/74bc6c7118e68d2b259c270921b1cf621d7f73e4/src/keys.ts#L57-L67)

密钥撤销与轮换。

<details>
<summary>查看原文（11行）</summary>

```text
export function revokeKey(store: KeyStore, name: string): void {
  const entry = findActive(store, name)
  if (!entry) throw new DshModelError('key_not_found', L(`没有叫 ${name} 的 key`, `No key named ${name}`))
  entry.revokedAt = new Date().toISOString()
}

export function rotateKey(store: KeyStore, name: string): KeyEntry {
  revokeKey(store, name)
  const entry: KeyEntry = { name, key: generateKey(), createdAt: new Date().toISOString() }
  store.keys.push(entry)
  return entry
```

</details>

#### 缺口

- 未运行网关、签到、供应商或 DSH
  **影响**：不能确认模型可用、费用、隐私和流式故障行为
  **进一步探讨**：固定供应商和网关，以隔离密钥测试状态码、流中断及计费

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有回退和成功模型响应头之外，怎样帮助用户控制回退成本？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：在发起请求前展示组合各来源的用户配置费用上限及数据范围，并要求对超预算回退显式决定，可能减少意外付费与数据外发。已有回退规则、成功模型响应头及来源费用标签，不是从零记录来源；未穷尽等价策略，价格也可能变化。对照现有组合在限流、响应中断和不同费用来源下测意外支出、误拦与决策时间，无改进或数据不准确时否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/combo.ts:51-55](https://github.com/AIcivilization/dsh-model/blob/74bc6c7118e68d2b259c270921b1cf621d7f73e4/src/combo.ts#L51-L55)

已有回退规则。

```text
/** 这次失败值得换下一个吗：请求本身写错了（400 且不是额度/长度问题）换了也一样，直接返回 */
export function shouldFallBack(status: number, text: string): boolean {
  if (status !== 400 && status !== 422) return true
  if (BLOCKED_RE.test(text)) return true
  return /quota|rate|limit|credit|context|too long|too many tokens|maximum|exceed|overload|unavailable|not supported|unsupported/i.test(text)
```

**依据 2 · 源码核查**：[src/combo.ts:97-103](https://github.com/AIcivilization/dsh-model/blob/74bc6c7118e68d2b259c270921b1cf621d7f73e4/src/combo.ts#L97-L103)

成功模型响应头。

```text
    if (upstream.ok && upstream.body) {
      if (tried.length) log(`combo ${combo.id}: ${model} answered after ${tried.length} failed (${tried.join(' | ')})`)
      res.writeHead(upstream.status, {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'no-cache',
        'X-Dsh-Model-Combo-Model': model,
      })
```

**依据 3 · 作者声明**：[README.md:53-61](https://github.com/AIcivilization/dsh-model/blob/74bc6c7118e68d2b259c270921b1cf621d7f73e4/README.md#L53-L61)

作者已有来源费用分类。

```text
| 类型 | 来源 |
|---|---|
| **免费（推荐）** | **硅基流动**（国内直连，实名后部分模型免费）、**Gemini**（能上外网，免费模型里质量最好） |
| 免费 · 额度少 | **智谱 GLM**（Flash 系列免费）、**讯飞星火**（Spark Lite 免费）、百度千帆（ERNIE Speed / Lite）、Groq、OpenRouter（`:free` 模型） |
| 本机 | Ollama、LM Studio：启动后自动出现，不用登录 |
| 订阅 | Codex（ChatGPT Plus / Pro）、Kimi Code、Grok、Muse、Devin：在管理页里登录即可 |
| 按量付费 | DeepSeek 官方、OpenCode Zen、任意 OpenAI 兼容服务 |

每个来源都标出「免费 / 免费·额度少 / 需付费」，详见下面的[来源与费用](#来源与费用)。dsh-model 只负责转接，不提供额度。
```

#### 缺口

- 未运行网关、签到、供应商或 DSH
  **影响**：不能确认模型可用、费用、隐私和流式故障行为
  **进一步探讨**：固定供应商和网关，以隔离密钥测试状态码、流中断及计费

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
