# RoundTable

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[cbc55a4](https://github.com/9931666/dsh-plugin-roundtable/tree/cbc55a489b104980423c0e32b559a5397987efbd)

<!-- BEGIN META -->
[![GitHub ★ 13](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=13&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/9931666/dsh-plugin-roundtable) [![npm 30d 1,891](https://img.shields.io/static/v1?label=npm+30d&message=1%2C891&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable) [![最新发布 2026-10-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable)
<!-- END META -->

> **功能**：在 DSH 会话中组织多专家圆桌、汇总和人工评审。

> **亮点**：结合节点拓扑、发言记录、汇总与人工选择组织多视角讨论。[Q01](#research-q01)

> **主要限制**：截断摘要并非完整证据，发言 token 预算也不是账单上限。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 圆桌适合什么任务，相比单代理有什么取舍？](#detail-section-11)
  - [Q02 · 发言和直接消息有什么区别，汇总丢失哪些信息？](#detail-section-12)
  - [Q03 · 预算限制是否等于供应商账单上限？](#detail-section-13)
  - [Q04 · 缺决策服务或恢复失败时怎样使用？](#detail-section-14)
  - [Q05 · 实际用量提示之外能否提供完整预算可信度？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要讨论设计或评审复杂方案的用户；基线是单代理回答并由用户自行比较。[Q01](#research-q01)

单代理回答或人工分别收集意见。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 圆桌 | 汇集多专家意见 | 子代理与模型成本 |
| 汇聚 | 提取发言核心 | 截断需回看原文 |
| 预算 | 限制估算与轮次 | 不等于真实账单 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH tools、subagents、agents、systemPrompt | 必需 | 注册与代理 | 插件不加载 |
| 模型与预算 | 讨论必需 | 专家推理 | 停止讨论 |
| userQuestions | 人工卡片需要 | 用户决策 | 使用文字处理 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户准备非敏感问题并设置小预算 | 模型与费用限制确认 |
| 2 | 组织两节点并收集发言 | 可查原文与汇总，否则停止 |
| 3 | 用户检查证据并作决定 | 缺决策服务或预算耗尽转人工 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 多模型调用 | 角色与预算设置 | 模型能力未知 |
| 持续 | 真实账单未知 | 核查观点 | 估算不含全部开销 |
| 恢复 | 追加调用可能计费 | 校验状态 | 冷会话可能不可测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 讨论 | 分工与汇聚规则 | 意见正确性 |
| 预算 | 估算额度和部分真实用量 | 实际货币账单 |

> **思考**：截断摘要并非完整证据，发言 token 预算也不是账单上限。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：结合节点拓扑、发言记录、汇总与人工选择组织多视角讨论。[Q01](#research-q01)

汇聚按文本提取并截断；预算估算与部分 provider 计量分开。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

截断摘要并非完整证据，发言 token 预算也不是账单上限。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

以小预算、两节点和非敏感任务试验，用户核对原文并承担最终决策。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持消息语义、聚合截断与预算检查；未运行模型或宿主。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/tools.ts、src/aggregator.ts、src/budget.ts、src/token-usage.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 75 文件、2 排除、零解析错误；静态追踪聚合与预算，不执行目标。
- 下一步：固定宿主与模型，对照单代理测质量、费用、恢复及人工决策。

**分析版本**

- **仓库**：[9931666/dsh-plugin-roundtable](https://github.com/9931666/dsh-plugin-roundtable)
- **版本号**：1.0.0-rc.6（[固定提交 cbc55a4](https://github.com/9931666/dsh-plugin-roundtable/tree/cbc55a489b104980423c0e32b559a5397987efbd)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：完整显示覆盖率并提示未测账单，可降低费用误判；须对照已有 provider 用量及不可测提示。[Q05](#research-q05)

固定宿主与模型，对照单代理测质量、费用、恢复及人工决策。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 1935 | — | — | 32429 |
| .mjs | source | 7 | 1387 | 1016 | 248 | — |
| .ts | source | 30 | 8156 | 5985 | 1754 | — |
| .tsx | source | 5 | 3125 | 2689 | 305 | — |
| .mjs | test | 18 | 2099 | 1691 | 210 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/9931666/dsh-plugin-roundtable/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/9931666/dsh-plugin-roundtable/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)

暂未获取：近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多专家圆桌怎样记录与汇总，预算和真人决策有什么边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 圆桌适合什么任务，相比单代理有什么取舍？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要多个视角协商或审查方案的用户可在同一会话组织专家节点和评审；主持人把发言汇聚并在需要时询问用户。相对单代理回答，它暴露分歧和决策过程，但增加模型调用与主持成本；简单问题用单代理可能更快。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-11](https://github.com/9931666/dsh-plugin-roundtable/blob/cbc55a489b104980423c0e32b559a5397987efbd/src/index.ts#L1-L11)

插件入口描述节点、汇聚与视图。

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * RoundTable for DeepSeek Harness — host plugin entry.
 *
 * A host-plane plugin that registers the `roundtable_*` tools and one usage
 * section into the global system prompt. After installation any session can
 * run a visualized round-table meeting through natural language: the model
 * creates a meeting (it becomes the captain), adds expert nodes as durable
 * continuable subagents, wires directed edges, collects contributions through
 * the aggregation gateway, and asks the human when a decision is needed.
 * The Web GUI shows the meeting as a topology tab via the `conversation.view`
 * slot, fed by the `/plugins/dsh-plugin-roundtable/state` snapshot route.
```

</details>

**依据 2 · 作者声明**：[README.md:43-50](https://github.com/9931666/dsh-plugin-roundtable/blob/cbc55a489b104980423c0e32b559a5397987efbd/README.md#L43-L50)

作者描述评审与用户表态。

```text
| --- | --- |
| **评审全流程** | 定稿方案 → `roundtable_start_review` 记录"问题 + 方案"（首轮 reviewPass=1）→ 拉红队专家（只挑毛病、不给替代方案）→ `roundtable_collect_review` 收集观点 → Web 评审弹窗自动打开。 |
| **逐条三态表态** | 每个观点独立一张卡片，可单独「支持 / 驳回 / 取消」（三态互切，支持可取消）；**驳回必填理由**（C2，无理由拒绝提交，理由计入 user-action 供主持人修订对照）；已认定数只计「支持」，缺陷进入下一轮方案修改。 |
| **观点证据分级** | 拆分时按观点给出证据（C1）：代码/bug 类附**可复现步骤**（`repro`），设计类缺陷附**论证链**（`argument`，不强制伪复现）；观点卡按类型展示证据徽标。 |
| **闭环复审（最多 3 轮）** | 用户表态 + 主持人修订后，`roundtable_finish_review` 结束本轮（落 `done` 并附修订说明）；再开下一轮复审（reviewPass+1，只核对旧缺陷是否修复）。`maxReviewPass=3`（首轮 + 最多复审 2 次），超上限继续须用户显式批准（C3，杜绝无限循环）。 |
| **影响概览** | 评审弹窗顶部显示已认定/已驳回/未表态计数；认定数 ≥ 3 提示"建议重新协商方案"（C4）。 |
| **Markdown 导出** | `roundtable_export_review` 把全部轮次/观点/表态/驳回理由/修订对照导出为一份交付物（C5），可留存或贴入 GitHub issue。 |
| **观点自动拆分** | 专家一条发言自动拆成多条独立观点，每条带维度标签 + 原文引用 + 观点序号 + 证据；拆分 LLM 优先，失败自动降级为本地按「观点 N」段落结构切分（零 token，不会整段糊在一起）。 |
```

#### 缺口

- 未运行 DSH、子代理或模型
  **影响**：不能确认讨论质量、账单及故障恢复
  **进一步探讨**：固定模型与宿主，在隔离会议测报告、预算、决策和恢复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 发言和直接消息有什么区别，汇总丢失哪些信息？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具说明 speak 记录会议发言而不唤醒其他节点，send_message 则唤醒接收者；聚合器仅处理 speech 和 proxy-thinking，提取核心或立场、压缩单条并截断总长度。因此拓扑与摘要有助定位观点，但截断和非涵盖的消息不构成完整证据，应回原始记录。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:838-839](https://github.com/9931666/dsh-plugin-roundtable/blob/cbc55a489b104980423c0e32b559a5397987efbd/src/tools.ts#L838-L839)

speak 工具契约。

```text
    name: 'roundtable_speak',
    description: 'Report into the meeting transcript — the default channel: durable, feeds the aggregation gateway, and wakes nobody. Use this instead of roundtable_send_message unless someone must act right now. Keep the charter format and the report envelope [REPORT R{轮} {key}] 结论（≤3 条）｜证据｜待决策; [核心产出] is the exact segment the gateway captures. Leave `to` empty to submit to the gateway; set it to a participant key for a directed remark.',
```

**依据 2 · 源码核查**：[src/tools.ts:893-894](https://github.com/9931666/dsh-plugin-roundtable/blob/cbc55a489b104980423c0e32b559a5397987efbd/src/tools.ts#L893-L894)

直接消息唤醒语义。

```text
    name: 'roundtable_send_message',
    description: 'Send a direct message that WAKES the recipient as its next turn — use it only when they must act right now; ordinary reporting goes through roundtable_speak (durable, wakes nobody). When forwarding someone else\'s opinion, quote the reference R{n}[{speaker}] instead of pasting the full text. In "orchestrated" mode only the captain may message nodes (nodes report to the captain); in "egalitarian" mode any participant may message any other — this is how experts debate peer-to-peer.',
```

**依据 3 · 源码核查**：[src/aggregator.ts:11-23](https://github.com/9931666/dsh-plugin-roundtable/blob/cbc55a489b104980423c0e32b559a5397987efbd/src/aggregator.ts#L11-L23)

核心提取优先级。

<details>
<summary>查看原文（13行）</summary>

```text
const MAX_LENGTH = 4000
const MAX_PER_UTTERANCE = 160

/** Pull the "core output" / stance out of a formatted contribution, else compact the whole text.
 *
 *  导出给 `roundtable_status` 复用：同一条 400 字符的配额，取 `[核心产出]`
 *  比取发言开头（`[当前状态]`）信息量大得多 —— 不是配额不够，是取错了地方。 */
export function extractCore(text: string): string {
  const core = text.match(/\[核心产出\]\s*([\s\S]*?)(?=\n\s*\[|$)/)?.[1]?.trim()
  if (core) return core
  const stance = text.match(/(?:立场|主张|观点|结论)[：:]\s*([\s\S]*?)(?=\n|$)/)?.[1]?.trim()
  if (stance) return stance
  return text.replace(/\s+/g, ' ').trim()
```

</details>

**依据 4 · 源码核查**：[src/aggregator.ts:26-42](https://github.com/9931666/dsh-plugin-roundtable/blob/cbc55a489b104980423c0e32b559a5397987efbd/src/aggregator.ts#L26-L42)

筛选、压缩和截断。

<details>
<summary>查看原文（17行）</summary>

```text
function compact(text: string, limit: number): string {
  const single = text.replace(/\s+/g, ' ').trim()
  return single.length > limit ? `${single.slice(0, limit)}…` : single
}

/** Merge utterances into a compact, chronological exchange (who → whom: core point). */
export function aggregateUtterances(utterances: readonly MeetingUtterance[], maxLength = MAX_LENGTH): string {
  const lines: string[] = []
  for (const utterance of utterances) {
    if (utterance.kind !== 'speech' && utterance.kind !== 'proxy-thinking') continue
    const from = utterance.nodeKey
    const to = utterance.to ?? '网关'
    const body = compact(extractCore(utterance.summary ?? utterance.content), MAX_PER_UTTERANCE)
    lines.push(`[R${utterance.round}] ${from} → ${to}\n${body}`)
  }
  const text = `[汇聚网关·交锋摘要]\n${lines.join('\n\n') || '（暂无发言）'}`
  return text.length > maxLength ? `${text.slice(0, maxLength)}\n…(截断)` : text
```

</details>

#### 缺口

- 未运行 DSH、子代理或模型
  **影响**：不能确认讨论质量、账单及故障恢复
  **进一步探讨**：固定模型与宿主，在隔离会议测报告、预算、决策和恢复

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 预算限制是否等于供应商账单上限？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不是。预算按轮数和估算 token 判断并可阻止新工作，muted 时仍保留补预算和关闭路径；估算使用发言文本，不包括全部提示和工具开销。另有 provider usage 的状态读取，但冷会话可能不可测；它不等于已结算货币账单。用户应设外部费用限制并核对供应商，不能将代理意见当真人共识。

#### 证据与依据

**依据 1 · 源码核查**：[src/budget.ts:9-14](https://github.com/9931666/dsh-plugin-roundtable/blob/cbc55a489b104980423c0e32b559a5397987efbd/src/budget.ts#L9-L14)

轮次与估算额度触发条件。

```text
export function budgetExceeded(meeting: Meeting): 'rounds' | 'tokens' | undefined {
  // 设 N 轮就能开 N 轮：`round` 是"已开启的轮次"，只有想开第 N+1 轮时才触顶。
  // （旧口径 `>=` 会让 maxRounds=10 实际只能开 9 轮——对面向用户的设置项不直觉。）
  if (meeting.round > meeting.budget.maxRounds) return 'rounds'
  if (meeting.budget.usedTokens >= meeting.budget.maxTokens) return 'tokens'
  return undefined
```

**依据 2 · 源码核查**：[src/budget.ts:37-58](https://github.com/9931666/dsh-plugin-roundtable/blob/cbc55a489b104980423c0e32b559a5397987efbd/src/budget.ts#L37-L58)

关闭与补预算路径可用。

<details>
<summary>查看原文（22行）</summary>

```text
/**
 * Gate a write against the meeting's status and budget WITHOUT mutating it.
 *
 * The previous `ensureActive` both flipped `status` to `'muted'` and then threw
 * on the same call. Because the throw happened before the caller could persist
 * anything, `muted` never reached disk, and the very tools meant to resolve the
 * situation (`roundtable_set_budget`, `roundtable_close`, the two exporters)
 * were rejected by that same gate — a meeting that had spent its budget stayed
 * `active` forever while refusing every action.
 *
 * @param meeting - meeting to test.
 * @param options.allowMuted - resolve/escalate paths (top up the budget, close,
 *   export, clear the user-action queue) stay reachable while muted; everything
 *   that produces new work still throws.
 */
export function assertUsable(meeting: Meeting, options: { allowMuted?: boolean } = {}): void {
  if (meeting.status === 'ended' || meeting.status === 'archived') {
    throw new MeetingEndedError(meeting.id)
  }
  if (options.allowMuted === true) return
  const axis = budgetExceeded(meeting)
  if (axis !== undefined) throw new MeetingMutedError(meeting.id, axis)
```

</details>

**依据 3 · 源码核查**：[src/token-usage.ts:1-24](https://github.com/9931666/dsh-plugin-roundtable/blob/cbc55a489b104980423c0e32b559a5397987efbd/src/token-usage.ts#L1-L24)

估算缺项与真实用量读取边界。

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * 真实用量读取（第 3 批）。
 *
 * 背景：`meeting.budget.usedTokens` 只累加**发言文本**的粗估（≈0.6 token/字），
 * 不含 system prompt、专家 persona、历史上下文与工具调用开销。真实会议数据
 * 里，它 7/7 场与"逐条发言文本估算"完全相等，而主持人自己的发言就吃掉
 * 38.9%（某一场达 73.4%）—— 用户设 200k，专家实际能用的远不到一半。v0.2.35
 * 只补了 UI 标注（"不是真实账单"），根因未修。
 *
 * 宿主其实有精确的 provider 上报值：
 * - `ctx.sessionProjections.snapshot(session, ['tokenUsage'])` 的
 *   `tokenUsage` 由每个 assistant settlement 的 usage 采样累加而来
 *   （`uncachedInputTokens` / `outputTokens` / `cacheReadTokens` /
 *   `cacheWriteTokens`，四桶互不重叠）；
 * - `Agent.session` 是拿到 `Session` 的现成入口（`tools.ts` 早已在用
 *   `agent.session.header.cwd`）。
 *
 * **明确否定的一条**：`ctx.subagents.sendMessage` / `startContinuable` 的返回值
 * 都不带 usage，`SubagentResult` / `SubagentRunEndInfo` 也没有 —— 想接真实用量
 * 只能走"子会话的 session"这条路。
 *
 * 本模块只读、不写状态：把真实值作为 `roundtable_status` 的派生输出，而不是
 * 新落一个半成品字段（否则又是"定义了却没人用"的账）。冷会话（进程重启后的
 * 旧节点）取不到值 —— 宁可标注"不可测"，也不拿估算冒充实测。
```

</details>

**依据 4 · 源码核查**：[src/tools.ts:1761-1764](https://github.com/9931666/dsh-plugin-roundtable/blob/cbc55a489b104980423c0e32b559a5397987efbd/src/tools.ts#L1761-L1764)

状态输出明确可能不可测。

```text
  const realMissing = Number(real.unmeasured_sessions ?? 0)
  const realLine = realMeasured === 0
    ? 'Real token usage: not measurable right now (provider-reported usage requires a live child session)'
    : `Real token usage (provider-reported): ${String(real.measured_total ?? 0)} tokens across ${realMeasured} expert session(s)${realMissing > 0 ? `; ${realMissing} not measurable` : ''}`
```

#### 缺口

- 未运行 DSH、子代理或模型
  **影响**：不能确认讨论质量、账单及故障恢复
  **进一步探讨**：固定模型与宿主，在隔离会议测报告、预算、决策和恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 缺决策服务或恢复失败时怎样使用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

tools、subagents、agents 和 systemPrompt 为强依赖；作者源码注释说明 userQuestions 不作强依赖，缺失时有不可用处理。模型调用、持久状态和人工核验都需要成本。先用两节点、小预算和非敏感题目检验状态、原始发言与用户决策；出现缺服务、预算耗尽或错误时停止新增工作，可补预算或关闭并人工继续。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:49-67](https://github.com/9931666/dsh-plugin-roundtable/blob/cbc55a489b104980423c0e32b559a5397987efbd/src/index.ts#L49-L67)

必需与可选服务边界。

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * REQUIRED services only — and the list is load-gating, which is why it is
 * short. cordis has no "optional inject" form (`Inject` is `string[] | Record`
 * and the record form is only intercept config), so every name listed here
 * keeps the whole plugin fiber PENDING until that service exists: no
 * `roundtable_*` tools, no `/plugins/dsh-plugin-roundtable/*` routes and no GUI
 * tab. A missing OPTIONAL capability listed here therefore presents to the user
 * as "圆桌会议整个不见了 / 无法调用界面" with no error anywhere.
 *
 * `userQuestions` and `skills` are deliberately NOT listed: both are optional
 * capabilities that the plugin reads live through `ctx.get(...)`:
 *   - skills.ts hard constraint #1 — the plugin MUST load in a profile without
 *     the skill service and degrade to an empty catalog;
 *   - tools.ts falls back to `decision: 'unavailable'` when the userQuestions
 *     service is absent (the captain then states the draft in words).
 * v0.2.36 removed both from this list; v0.2.21 had already fixed the mirrored
 * over-constraint on the browser half (`connection`).
 */
export const inject = ['tools', 'subagents', 'agents', 'systemPrompt']
```

</details>

**依据 2 · 源码核查**：[src/budget.ts:25-34](https://github.com/9931666/dsh-plugin-roundtable/blob/cbc55a489b104980423c0e32b559a5397987efbd/src/budget.ts#L25-L34)

超限可补预算或关闭。

<details>
<summary>查看原文（10行）</summary>

```text
/** Error when the meeting is muted (闭麦) on a budget axis. */
export class MeetingMutedError extends Error {
  readonly axis: 'rounds' | 'tokens'
  constructor(meetingId: string, axis: 'rounds' | 'tokens') {
    super(
      `roundtable: meeting "${meetingId}" is muted on ${axis} — the captain may top up the budget with roundtable_set_budget or close the meeting`,
    )
    this.name = 'MeetingMutedError'
    this.axis = axis
  }
```

</details>

**依据 3 · 作者声明**：[README.md:52-59](https://github.com/9931666/dsh-plugin-roundtable/blob/cbc55a489b104980423c0e32b559a5397987efbd/README.md#L52-L59)

作者说明成本与状态持久化。

```text
### 成本与状态
| 能力 | 说明 |
| --- | --- |
| **预算熔断** | 轮数与 Token 双预算，超限自动「闭麦」，可补预算继续或汇总收场。⚠️ **Token 数是「发言文本量」的粗估**（中文约 0.6 token/字），**不含** system prompt、专家 persona、历史上下文与工具调用开销，**不等于真实账单**——把它当"说了多少"的刻度，而不是成本表。 |
| **回答限制** | 专家每轮输出上限（模型 `max_tokens`）+ 每轮最多意见数；专家 prompt 内置简洁约束（只答相关 / 不用假设 / 不举无关例子 / 无修辞）。 |
| **匿名反馈回路** | 会议结束后 1 键有用度询问 + 可选一句"最卡的点"（E1）；匿名聚合到工作区级 `feedback.jsonl`（E3，只记模式/模型/轮数/Token/时间戳 + 用户主动填写内容，绝不记对话），设置页可查看/一键清空/关闭（E4）。 |
| **知识库摘要缓存** | 主持人读过的 KB 文件按 `path + size + mtimeMs` 记下要点摘要（`kb-digest.json`）；`roundtable_status` 直接标 `[HIT]` / `[STALE]`，命中的不必重读——省掉"主持人读一遍 + 专家读一遍"的双倍 token。缓存本身不耗模型 token，超 50 条按最旧淘汰。 |
| **持久化** | 会议状态落盘于 `<workspace>/.roundtable/<meetingId>/`（meeting.json + transcript.jsonl + review.json + user-actions.jsonl + kb-digest.json），重启后可恢复拓扑与历史；`roundtable_export_meeting` 另写一份 export.md。 |
```

#### 缺口

- 未运行 DSH、子代理或模型
  **影响**：不能确认讨论质量、账单及故障恢复
  **进一步探讨**：固定模型与宿主，在隔离会议测报告、预算、决策和恢复

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 实际用量提示之外能否提供完整预算可信度？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：在状态中展示主持人与每个专家的测量覆盖率，并在不完整时要求用户自行核对供应商账单，可能减少把文本估算当总成本的误解。反证是当前已读 provider 用量、区分未测子会话并在状态提示不可测；这不是从零增加真实用量，且主持会话与价格计量能否完整接入未验证，未穷尽等价实现。对照现有界面测用户费用判断错误、缺失覆盖提示和时间；无改善或误导则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/token-usage.ts:1-24](https://github.com/9931666/dsh-plugin-roundtable/blob/cbc55a489b104980423c0e32b559a5397987efbd/src/token-usage.ts#L1-L24)

已有 provider 用量与冷会话未知。

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * 真实用量读取（第 3 批）。
 *
 * 背景：`meeting.budget.usedTokens` 只累加**发言文本**的粗估（≈0.6 token/字），
 * 不含 system prompt、专家 persona、历史上下文与工具调用开销。真实会议数据
 * 里，它 7/7 场与"逐条发言文本估算"完全相等，而主持人自己的发言就吃掉
 * 38.9%（某一场达 73.4%）—— 用户设 200k，专家实际能用的远不到一半。v0.2.35
 * 只补了 UI 标注（"不是真实账单"），根因未修。
 *
 * 宿主其实有精确的 provider 上报值：
 * - `ctx.sessionProjections.snapshot(session, ['tokenUsage'])` 的
 *   `tokenUsage` 由每个 assistant settlement 的 usage 采样累加而来
 *   （`uncachedInputTokens` / `outputTokens` / `cacheReadTokens` /
 *   `cacheWriteTokens`，四桶互不重叠）；
 * - `Agent.session` 是拿到 `Session` 的现成入口（`tools.ts` 早已在用
 *   `agent.session.header.cwd`）。
 *
 * **明确否定的一条**：`ctx.subagents.sendMessage` / `startContinuable` 的返回值
 * 都不带 usage，`SubagentResult` / `SubagentRunEndInfo` 也没有 —— 想接真实用量
 * 只能走"子会话的 session"这条路。
 *
 * 本模块只读、不写状态：把真实值作为 `roundtable_status` 的派生输出，而不是
 * 新落一个半成品字段（否则又是"定义了却没人用"的账）。冷会话（进程重启后的
 * 旧节点）取不到值 —— 宁可标注"不可测"，也不拿估算冒充实测。
```

</details>

**依据 2 · 源码核查**：[src/token-usage.ts:53-60](https://github.com/9931666/dsh-plugin-roundtable/blob/cbc55a489b104980423c0e32b559a5397987efbd/src/token-usage.ts#L53-L60)

已区分可测与未测会话。

```text
/** How many expert sessions could be measured for one meeting. */
export interface MeetingRealUsage {
  /** Sum of measured session totals. */
  measuredTotal: number
  /** Sessions that produced a provider-reported figure. */
  measuredSessions: number
  /** Child sessions that exist but could not be measured (cold / not live). */
  unmeasuredSessions: number
```

**依据 3 · 源码核查**：[src/tools.ts:1761-1764](https://github.com/9931666/dsh-plugin-roundtable/blob/cbc55a489b104980423c0e32b559a5397987efbd/src/tools.ts#L1761-L1764)

已有状态输出提示。

```text
  const realMissing = Number(real.unmeasured_sessions ?? 0)
  const realLine = realMeasured === 0
    ? 'Real token usage: not measurable right now (provider-reported usage requires a live child session)'
    : `Real token usage (provider-reported): ${String(real.measured_total ?? 0)} tokens across ${realMeasured} expert session(s)${realMissing > 0 ? `; ${realMissing} not measurable` : ''}`
```

#### 缺口

- 未运行 DSH、子代理或模型
  **影响**：不能确认讨论质量、账单及故障恢复
  **进一步探讨**：固定模型与宿主，在隔离会议测报告、预算、决策和恢复

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
