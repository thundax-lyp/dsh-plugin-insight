# opencode2dsh

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[3805a38](https://github.com/FishBottle7/opencode2dsh/tree/3805a380d096efde91bcb3b35ce962fb985e6563/packages/plugin)

<!-- BEGIN META -->
[![GitHub ★ 384](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=384&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FishBottle7/opencode2dsh) [![npm 30d 13,802](https://img.shields.io/static/v1?label=npm+30d&message=13%2C802&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opencode2dsh/dsh-plugin) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opencode2dsh/dsh-plugin)
<!-- END META -->

> **功能**：为 DSH 提供 OpenCode Zen 匿名模型适配与可选本地委派。

> **亮点**：将目录与流协议接入 DSH，不将模型服务归于适配器。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：目录探测与直接调用门控不同；答案或工具后中断仍需对账，不能保证恰好一次。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 原生适配为谁提供什么，相比直接使用上游有什么增量？](#detail-section-11)
  - [Q02 · 目录与服务资格为何不同？](#detail-section-12)
  - [Q03 · 流重试能否保证不重复工具操作？](#detail-section-13)
  - [Q04 · 可选委派和网络维护有哪些额外成本？](#detail-section-14)
  - [Q05 · 如何检验资格和中断状态的可见性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在 DSH 使用 OpenCode Zen 匿名模型的用户；基线是现有 provider 或直接使用上游。[Q01](#research-q01)

使用已有 DSH 模型 provider 或直接使用 OpenCode。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 模型目录 | 显示候选 | 探测不保证调用成功 |
| 流适配 | 传递模型输出 | 工具事件后不做该恢复 |
| 本地委派 | 可选 OpenCode 子进程 | 默认关闭 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容 DSH | 必需 | 模型接入 | 回原 provider |
| 可用匿名上游 | 调用必需 | 模型请求 | 停止并重试前核查 |
| OpenCode 二进制 | 委派才需 | 本地委派 | 保持关闭 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 选择 | 核对来源和资格 | 不明则不调用 |
| 试用 | 非敏感无副作用任务 | 核对输出 |
| 恢复 | 中断后检查状态 | 未知先对账 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主及网络资源 | 配置来源 | 当前资格未测 |
| 持续 | 实际服务费用未知 | 监测可用性 | 重试有等待 |
| 恢复 | 委派进程及网络 | 核对副作用 | 流中断不证明未执行 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 模型目录 | 出口探测和白名单 | 当前服务资格 |
| 恢复 | 答案/工具事件阻止特定重放 | 所有副作用恰好一次 |

> **思考**：目录探测与直接调用门控不同；答案或工具后中断仍需对账，不能保证恰好一次。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将目录与流协议接入 DSH，不将模型服务归于适配器。[Q01](#research-q01) [Q02](#research-q02)

白名单与目录探测分离；仅思考输出可在条件满足时恢复，答案或工具事件阻止该重放。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

目录探测与直接调用门控不同；答案或工具后中断仍需对账，不能保证恰好一次。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

非敏感任务核对实际来源、输出与网络资格；不明结果先对账。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包代码支持探测、白名单、流恢复与可选委派；未运行模型、宿主或网络。

- 已检查：作者 README、包清单、源码路径 packages/plugin/package.json、packages/plugin/src/adapter/catalog.ts、packages/plugin/src/adapter/zen-adapter.ts、packages/plugin/src/config.ts、packages/plugin/src/index.ts 及固定范围 inventory；组件：packages/plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子组件 inventory 86 个指定扩展名文件、排除 1、错误 0；静态核查目录与流，未运行目标。
- 下一步：固定宿主与上游，用无副作用任务验证资格、拒绝及流中断。

**分析版本**

- **仓库**：[FishBottle7/opencode2dsh](https://github.com/FishBottle7/opencode2dsh)
- **版本号**：0.3.14（[固定提交 3805a38](https://github.com/FishBottle7/opencode2dsh/tree/3805a380d096efde91bcb3b35ce962fb985e6563)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：分开展示目录、出口探测和实际中断状态可减少误判；须与现有机制对照。[Q05](#research-q05)

固定宿主与上游，用无副作用任务验证资格、拒绝及流中断。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 37 | 11439 | 7348 | 3467 | — |
| .tsx | source | 1 | 1082 | 923 | 112 | — |
| .ts | test | 39 | 10535 | 8529 | 1376 | — |
| .ts | example | 1 | 5 | 4 | 1 | — |
| .mjs | example | 3 | 168 | 111 | 46 | — |
| .mts | test | 5 | 505 | 380 | 84 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/FishBottle7/opencode2dsh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 34](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=34&color=737b86&logo=github)](https://github.com/FishBottle7/opencode2dsh/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 30](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=30&color=737b86&logo=github)](https://github.com/FishBottle7/opencode2dsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 模型适配如何选择匿名模型、恢复流并控制可选委派？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 原生适配为谁提供什么，相比直接使用上游有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望在 DSH 使用 OpenCode Zen 匿名模型的用户可通过原生模型适配器选择候选；基线是已有 DSH provider 或直接使用 OpenCode。它把目录、协议转换与流接到 DSH，而上游模型服务不归适配器。包说明的免 API key 是匿名路径声明，不能保证所有模型、地区始终可用或免费。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/package.json:1-5](https://github.com/FishBottle7/opencode2dsh/blob/3805a380d096efde91bcb3b35ce962fb985e6563/packages/plugin/package.json#L1-L5)

子包定位和版本。

```text
{
  "name": "@opencode2dsh/dsh-plugin",
  "version": "0.3.14",
  "description": "Free OpenCode Zen models for DeepSeek Harness (DSH): native dsh-llm adapter plugin, no API key.",
  "type": "module",
```

**依据 2 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:30-43](https://github.com/FishBottle7/opencode2dsh/blob/3805a380d096efde91bcb3b35ce962fb985e6563/packages/plugin/src/adapter/catalog.ts#L30-L43)

模型资格按出口探测。

<details>
<summary>查看原文（14行）</summary>

```text
 *   muse-spark-1.*-contributor-free      403 RegionError, chat and responses alike
 *
 * The blocklist is a VANTAGE-POINT claim, not a law of physics: issue #56's
 * matrix was measured from one egress, and the same ids answer HTTP 200 from
 * other networks (2026-10-16, Taiwan egress: both muse ids stream 200 on
 * /zen/v1/responses with the faithful adapter shape). `FREE_LANE_BLOCKLIST`
 * below therefore names only the models that can NEVER serve — a protocol
 * mismatch no amount of retrying fixes. Everything else moves to
 * `FREE_LANE_PROBE_SET` and is re-verified per egress by the catalog's
 * adaptive probe (see ModelCatalog.#probeRound): a model that answers
 * 200/429 is exposed, one that answers the recorded refusal status is kept
 * hidden, and a probe that errors is left hidden until the next round.
 */
export const FREE_LANE_BLOCKLIST: ReadonlySet<string> = new Set([
```

</details>

#### 缺口

- 未运行 DSH、模型上游或本地委派
  **影响**：不能证明当前服务资格、输出质量及恢复效果
  **进一步探讨**：固定宿主与上游，在无副作用任务中验证资格和流故障

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录与服务资格为何不同？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

目录的 probe 集按出口重新验证，注释描述 200/429 可显示、明确拒绝隐藏、探测错误暂时隐藏；永久协议不兼容项另列 blocklist。流入口明确只有白名单直接门控，probe pending 或 blocklist 的直接调用仍交上游决定。因此选择列表或 free 名称不保证请求成功，探测状态和实际调用必须分开。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:30-44](https://github.com/FishBottle7/opencode2dsh/blob/3805a380d096efde91bcb3b35ce962fb985e6563/packages/plugin/src/adapter/catalog.ts#L30-L44)

出口探测与协议 blocklist。

<details>
<summary>查看原文（15行）</summary>

```text
 *   muse-spark-1.*-contributor-free      403 RegionError, chat and responses alike
 *
 * The blocklist is a VANTAGE-POINT claim, not a law of physics: issue #56's
 * matrix was measured from one egress, and the same ids answer HTTP 200 from
 * other networks (2026-10-16, Taiwan egress: both muse ids stream 200 on
 * /zen/v1/responses with the faithful adapter shape). `FREE_LANE_BLOCKLIST`
 * below therefore names only the models that can NEVER serve — a protocol
 * mismatch no amount of retrying fixes. Everything else moves to
 * `FREE_LANE_PROBE_SET` and is re-verified per egress by the catalog's
 * adaptive probe (see ModelCatalog.#probeRound): a model that answers
 * 200/429 is exposed, one that answers the recorded refusal status is kept
 * hidden, and a probe that errors is left hidden until the next round.
 */
export const FREE_LANE_BLOCKLIST: ReadonlySet<string> = new Set([
  'jev-1.13-free', // 400 ModelProtocolUnsupported on chat AND responses — SystemOne-only
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:532-543](https://github.com/FishBottle7/opencode2dsh/blob/3805a380d096efde91bcb3b35ce962fb985e6563/packages/plugin/src/adapter/zen-adapter.ts#L532-L543)

直接服务仅由白名单门控。

<details>
<summary>查看原文（12行）</summary>

```text
  /**
   * Recover once from a reasoning-only output limit on models that offer Off.
   * Keep the first attempt's reasoning visible, but withhold its terminal
   * chunks until recovery finishes. Answer/tool events forbid replay; retry
   * blocks get fresh indices and the final usage includes both requests.
   */
  async *stream(options: HarnessGenerateOptions): AsyncGenerator<HarnessChunk> {
    // Issue #83 serving gate: same contract as prepareCall — a direct call to
    // an id the whitelist excludes fails fast, before any wire traffic, on
    // BOTH seams. ONLY the whitelist gates here; probe-pending/blocklisted
    // ids keep today's serving behavior (upstream decides).
    if (this.#whitelistBlocks(options.model)) throw notInWhitelistError(options.model)
```

</details>

#### 缺口

- 未运行 DSH、模型上游或本地委派
  **影响**：不能证明当前服务资格、输出质量及恢复效果
  **进一步探讨**：固定宿主与上游，在无副作用任务中验证资格和流故障

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 流重试能否保证不重复工具操作？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

仅思考输出耗尽且模型允许关闭思考时，适配器可恢复一次；一旦出现答案或工具事件便禁止该次重放。另有交给宿主的最多八次正常重试策略，覆盖传输等错误。此处限制降低重复工具事件风险，但不能推广为跨宿主、上游或外部副作用恰好一次；响应中断须按任务结果对账。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:159-174](https://github.com/FishBottle7/opencode2dsh/blob/3805a380d096efde91bcb3b35ce962fb985e6563/packages/plugin/src/adapter/zen-adapter.ts#L159-L174)

宿主重试策略。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * Retry policy the host (dsh-llm-retry) runs for this provider. Resolved
 * shape is FLAT (backoff fields at top level — see ResolvedNormalRetryPolicy,
 * dsh-llm index.js:1867 consumes the adapter value verbatim). Retryable codes
 * mirror the host default set so behavior differs only in patience, not in
 * which failures qualify. Cumulative worst case per step:
 * 1+2+4+8+16+20+20+20 ≈ 91s of silent retries before the error surfaces.
 */
export const FREE_LANE_RETRY_POLICY = Object.freeze({
  mode: 'normal' as const,
  maxRetries: 8,
  retryableCodes: Object.freeze(['EMPTY_RESPONSE', 'RATE_LIMIT', 'SERVER', 'TIMEOUT', 'TRANSPORT']),
  initialDelayMs: 1_000,
  maxDelayMs: 20_000,
  jitterRatio: 0.2,
})
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:532-543](https://github.com/FishBottle7/opencode2dsh/blob/3805a380d096efde91bcb3b35ce962fb985e6563/packages/plugin/src/adapter/zen-adapter.ts#L532-L543)

恢复条件和白名单。

<details>
<summary>查看原文（12行）</summary>

```text
  /**
   * Recover once from a reasoning-only output limit on models that offer Off.
   * Keep the first attempt's reasoning visible, but withhold its terminal
   * chunks until recovery finishes. Answer/tool events forbid replay; retry
   * blocks get fresh indices and the final usage includes both requests.
   */
  async *stream(options: HarnessGenerateOptions): AsyncGenerator<HarnessChunk> {
    // Issue #83 serving gate: same contract as prepareCall — a direct call to
    // an id the whitelist excludes fails fast, before any wire traffic, on
    // BOTH seams. ONLY the whitelist gates here; probe-pending/blocklisted
    // ids keep today's serving behavior (upstream decides).
    if (this.#whitelistBlocks(options.model)) throw notInWhitelistError(options.model)
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:552-577](https://github.com/FishBottle7/opencode2dsh/blob/3805a380d096efde91bcb3b35ce962fb985e6563/packages/plugin/src/adapter/zen-adapter.ts#L552-L577)

跟踪答案和工具事件。

<details>
<summary>查看原文（26行）</summary>

```text
    for (let attempt = 0; attempt < 2; attempt += 1) {
      let sawReasoning = false
      let sawAnswerOrTool = false
      let usage: Extract<HarnessChunk, { type: 'usage' }> | undefined
      let finish: Extract<HarnessChunk, { type: 'finish' }> | undefined

      for await (const chunk of this.#streamAttempt(request, (message) => {
        for (const block of message.content) {
          if (block.type === 'thinking' && typeof block.thinking === 'string' && block.thinking.length > 0) sawReasoning = true
          if (block.type !== 'thinking' && (block.type !== 'text' || (typeof block.text === 'string' && block.text.length > 0))) sawAnswerOrTool = true
        }
      })) {
        if (chunk.type === 'usage') {
          usage = chunk
          continue
        }
        if (chunk.type === 'finish') {
          finish = chunk
          continue
        }
        if (chunk.type === 'reasoning-delta' && chunk.text.length > 0) sawReasoning = true
        if (chunk.type === 'text-delta' && chunk.text.length > 0) sawAnswerOrTool = true
        if ((chunk.type === 'block-start' && chunk.blockType === 'tool-call') || chunk.type === 'tool-call-delta') sawAnswerOrTool = true
        if (chunk.type === 'block-end') {
          if (chunk.block.type === 'reasoning' && chunk.block.text.length > 0) sawReasoning = true
          if (chunk.block.type === 'tool-call' || (chunk.block.type === 'text' && chunk.block.text.length > 0)) sawAnswerOrTool = true
```

</details>

#### 缺口

- 未运行 DSH、模型上游或本地委派
  **影响**：不能证明当前服务资格、输出质量及恢复效果
  **进一步探讨**：固定宿主与上游，在无副作用任务中验证资格和流故障

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可选委派和网络维护有哪些额外成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

匿名直连与可选本地 OpenCode 委派是不同配置：delegation 默认关闭，启用后需合适二进制、子进程和其配置。还需兼容 DSH、网络及实际可用出口；目录探测、重试和人工核查增加时间，价格与隐私由实际上游决定。先用非敏感、无副作用任务确认来源和响应，资格变化或不明结果时停止并回退已有 provider。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/config.ts:230-243](https://github.com/FishBottle7/opencode2dsh/blob/3805a380d096efde91bcb3b35ce962fb985e6563/packages/plugin/src/config.ts#L230-L243)

委派默认关闭及二进制选项。

<details>
<summary>查看原文（14行）</summary>

```text
   * (not a live settings form): flipping it means editing the profile patch, so
   * the credential-custody decision stays a deliberate, reviewed act rather
   * than a settings-page toggle. Absent = the anonymous path, unchanged.
   */
  delegation: Schema.object({
    /** Master switch; default false keeps the plugin a stateless anonymous client. */
    enabled: Schema.boolean().default(false),
    /** Explicit opencode binary path (skips managed/global/npm resolution). */
    opencodePath: Schema.string().default(''),
    /** Lowest opencode version the delegate will use (free-tier floor). */
    minVersion: Schema.string().default(MIN_OPENCODE_VERSION),
    /** GOMEMLIMIT injected into the child (Go heap soft cap). */
    memLimit: Schema.string().default(DEFAULT_MEM_LIMIT),
    /** GOGC injected into the child. */
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/index.ts:239-249](https://github.com/FishBottle7/opencode2dsh/blob/3805a380d096efde91bcb3b35ce962fb985e6563/packages/plugin/src/index.ts#L239-L249)

未启用时无 delegate。

<details>
<summary>查看原文（11行）</summary>

```text
 * Build the local-opencode delegate, or null when the feature is off. The
 * opt-in gate is deliberate (issue #76): enabling delegation makes the plugin a
 * credential custodian, so it must never be armed silently. When disabled the
 * adapter receives null and its anonymous path is byte-for-byte unchanged.
 */
function createDelegate(
  delegation: DelegationConfig | undefined,
  dataDir: string,
  logger: PluginContext['logger'],
): DelegationDelegate | null {
  if (!delegation?.enabled) return null
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:159-174](https://github.com/FishBottle7/opencode2dsh/blob/3805a380d096efde91bcb3b35ce962fb985e6563/packages/plugin/src/adapter/zen-adapter.ts#L159-L174)

重试等待成本。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * Retry policy the host (dsh-llm-retry) runs for this provider. Resolved
 * shape is FLAT (backoff fields at top level — see ResolvedNormalRetryPolicy,
 * dsh-llm index.js:1867 consumes the adapter value verbatim). Retryable codes
 * mirror the host default set so behavior differs only in patience, not in
 * which failures qualify. Cumulative worst case per step:
 * 1+2+4+8+16+20+20+20 ≈ 91s of silent retries before the error surfaces.
 */
export const FREE_LANE_RETRY_POLICY = Object.freeze({
  mode: 'normal' as const,
  maxRetries: 8,
  retryableCodes: Object.freeze(['EMPTY_RESPONSE', 'RATE_LIMIT', 'SERVER', 'TIMEOUT', 'TRANSPORT']),
  initialDelayMs: 1_000,
  maxDelayMs: 20_000,
  jitterRatio: 0.2,
})
```

</details>

#### 缺口

- 未运行 DSH、模型上游或本地委派
  **影响**：不能证明当前服务资格、输出质量及恢复效果
  **进一步探讨**：固定宿主与上游，在无副作用任务中验证资格和流故障

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验资格和中断状态的可见性？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：分开展示目录可见、该出口最近探测和实际请求失败阶段，可减少用户把列出当成可用、或中断后盲重试。已有动态探测、白名单和答案/工具后禁止恢复是反证；探测不代表下次可用，也不证明外部操作未发生。对照现有状态，以地域拒绝、429、思考中断和工具事件后中断测误判、重复、延迟及网络成本；无改善则否定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:30-43](https://github.com/FishBottle7/opencode2dsh/blob/3805a380d096efde91bcb3b35ce962fb985e6563/packages/plugin/src/adapter/catalog.ts#L30-L43)

已有出口探测。

<details>
<summary>查看原文（14行）</summary>

```text
 *   muse-spark-1.*-contributor-free      403 RegionError, chat and responses alike
 *
 * The blocklist is a VANTAGE-POINT claim, not a law of physics: issue #56's
 * matrix was measured from one egress, and the same ids answer HTTP 200 from
 * other networks (2026-10-16, Taiwan egress: both muse ids stream 200 on
 * /zen/v1/responses with the faithful adapter shape). `FREE_LANE_BLOCKLIST`
 * below therefore names only the models that can NEVER serve — a protocol
 * mismatch no amount of retrying fixes. Everything else moves to
 * `FREE_LANE_PROBE_SET` and is re-verified per egress by the catalog's
 * adaptive probe (see ModelCatalog.#probeRound): a model that answers
 * 200/429 is exposed, one that answers the recorded refusal status is kept
 * hidden, and a probe that errors is left hidden until the next round.
 */
export const FREE_LANE_BLOCKLIST: ReadonlySet<string> = new Set([
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:532-543](https://github.com/FishBottle7/opencode2dsh/blob/3805a380d096efde91bcb3b35ce962fb985e6563/packages/plugin/src/adapter/zen-adapter.ts#L532-L543)

已有恢复与白名单规则。

<details>
<summary>查看原文（12行）</summary>

```text
  /**
   * Recover once from a reasoning-only output limit on models that offer Off.
   * Keep the first attempt's reasoning visible, but withhold its terminal
   * chunks until recovery finishes. Answer/tool events forbid replay; retry
   * blocks get fresh indices and the final usage includes both requests.
   */
  async *stream(options: HarnessGenerateOptions): AsyncGenerator<HarnessChunk> {
    // Issue #83 serving gate: same contract as prepareCall — a direct call to
    // an id the whitelist excludes fails fast, before any wire traffic, on
    // BOTH seams. ONLY the whitelist gates here; probe-pending/blocklisted
    // ids keep today's serving behavior (upstream decides).
    if (this.#whitelistBlocks(options.model)) throw notInWhitelistError(options.model)
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:552-577](https://github.com/FishBottle7/opencode2dsh/blob/3805a380d096efde91bcb3b35ce962fb985e6563/packages/plugin/src/adapter/zen-adapter.ts#L552-L577)

已有事件判断。

<details>
<summary>查看原文（26行）</summary>

```text
    for (let attempt = 0; attempt < 2; attempt += 1) {
      let sawReasoning = false
      let sawAnswerOrTool = false
      let usage: Extract<HarnessChunk, { type: 'usage' }> | undefined
      let finish: Extract<HarnessChunk, { type: 'finish' }> | undefined

      for await (const chunk of this.#streamAttempt(request, (message) => {
        for (const block of message.content) {
          if (block.type === 'thinking' && typeof block.thinking === 'string' && block.thinking.length > 0) sawReasoning = true
          if (block.type !== 'thinking' && (block.type !== 'text' || (typeof block.text === 'string' && block.text.length > 0))) sawAnswerOrTool = true
        }
      })) {
        if (chunk.type === 'usage') {
          usage = chunk
          continue
        }
        if (chunk.type === 'finish') {
          finish = chunk
          continue
        }
        if (chunk.type === 'reasoning-delta' && chunk.text.length > 0) sawReasoning = true
        if (chunk.type === 'text-delta' && chunk.text.length > 0) sawAnswerOrTool = true
        if ((chunk.type === 'block-start' && chunk.blockType === 'tool-call') || chunk.type === 'tool-call-delta') sawAnswerOrTool = true
        if (chunk.type === 'block-end') {
          if (chunk.block.type === 'reasoning' && chunk.block.text.length > 0) sawReasoning = true
          if (chunk.block.type === 'tool-call' || (chunk.block.type === 'text' && chunk.block.text.length > 0)) sawAnswerOrTool = true
```

</details>

#### 缺口

- 未运行 DSH、模型上游或本地委派
  **影响**：不能证明当前服务资格、输出质量及恢复效果
  **进一步探讨**：固定宿主与上游，在无副作用任务中验证资格和流故障

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
