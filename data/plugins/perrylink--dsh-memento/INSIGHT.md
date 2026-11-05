# DSH Memento

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[2fb8d7c](https://github.com/PerryLink/dsh-memento/tree/2fb8d7cd3013603910ee50a3de89d5b52e4c2938)

<!-- BEGIN META -->
[![GitHub ★ 142](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=142&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-memento) [![npm 30d 6,848](https://img.shields.io/static/v1?label=npm+30d&message=6%2C848&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-memento) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-memento)
<!-- END META -->

> **功能**：提供带审批策略与审计的跨会话记忆

> **亮点**：[Q01](#research-q01) 把持久化写入审批、工具查询与本机审计整合。

> **主要限制**：[Q03](#research-q03) 审批记录可能包含记忆正文，留存需独立审查。

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
  - [Q01 · 解决什么任务？](#detail-section-11)
  - [Q02 · 怎样写入和检索？](#detail-section-12)
  - [Q03 · 审批是否等于隐私隔离？](#detail-section-13)
  - [Q04 · 采用需要什么条件？](#detail-section-14)
  - [Q05 · 怎样验证稳定收益？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户跨会话反复交代稳定约定。

手工维护项目说明并每次显式打开。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 手工说明 | 可见且直接维护 | 每次会话手工挂载 |
| Memento | 可审批的写入和查询 | 需管理持续留存 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 审批服务 | 必需 | 接入写决策 | 验证目标 profile |
| Node 与 SQLite | 必需 | 本机保存 | 确认版本与备份 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 隔离 profile 与虚构约定 | 保留基准 |
| 操作 | 批准与拒绝各一次 | 留存审计 |
| 核对 | 新会话查找并清理 | 核对落盘 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主运行成本未知 | 安装和策略设置耗时未知 | 依版本变化 |
| 持续 | 查询和提示开销未知 | 维护、合并和审计耗时未知 | 与条目规模有关 |
| 恢复 | 数据库备份未知 | 人工核对及删除耗时未知 | 取决于保留要求 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 写入审批 | 批准和拒绝同批对照 | 仅批准可写 |
| 召回和留存 | 检查会话及日志 | 区分正文与审计 |

> **思考**：[Q03](#research-q03) 审批记录可能包含记忆正文，留存需独立审查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把持久化写入审批、工具查询与本机审计整合。

服务层连入宿主审批，公开模型工具。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 审批记录可能包含记忆正文，留存需独立审查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 隔离 profile 使用虚构条目验证批准、拒绝和删除。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的让后续会话重用已确认约束。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.mjs、lib/retrieval.mjs、lib/gate.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的让后续会话重用已确认约束。未执行目标代码或实际宿主验证。
- 下一步：双会话试验并检查审计记录。

**分析版本**

- **仓库**：[PerryLink/dsh-memento](https://github.com/PerryLink/dsh-memento)
- **版本号**：0.5.29（[固定提交 2fb8d7c](https://github.com/PerryLink/dsh-memento/tree/2fb8d7cd3013603910ee50a3de89d5b52e4c2938)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 跨会话重用稳定约束能减少重复说明且维持可核对的写入链。

双会话试验并检查审计记录。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 21 | 4073 | — | — | 50921 |
| .mjs | source | 26 | 6120 | 3950 | 2102 | — |
| .js | source | 1 | 1226 | 854 | 310 | — |
| .mjs | test | 26 | 5329 | 4506 | 511 | — |
| .mjs | example | 1 | 17 | 13 | 3 | — |
| .md | test | 1 | 55 | — | — | 314 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/PerryLink/dsh-memento/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/PerryLink/dsh-memento/issues?q=is%3Aissue+created%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/PerryLink/dsh-memento/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：让后续会话重用已确认约束

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 解决什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

为反复开启 DSH 会话的用户保留约定、偏好和经验。作者将项目定位为本机 SQLite 记忆及受策略控制的写入，与每次手工重复说明相比可减少准备。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-16](https://github.com/PerryLink/dsh-memento/blob/2fb8d7cd3013603910ee50a3de89d5b52e4c2938/README.md#L5-L16)

作者描述活动状态及 SQLite 与审批定位

<details>
<summary>查看原文（12行）</summary>

```text
> **Status: active.** Unfrozen on 2026-10-12; the old "FROZEN since 2026-10-05" description was stale.

**See also.** `dsh-mnemon` is a framework with mem0/Honcho hosted providers, pinned to the 0.2.1 line; `@openviking/dsh-memory-plugin` is a Volcengine example with no declared dsh engine; `dsh-plugin-memory` is the closest in kind and has no provenance. `dsh-memento` is the local SQLite seam with an approval gate and audit trail, not a drop-in for the hosted providers.

- **1024 store channel**: `npm i -g dsh1024` once, then `dsh1024 plugin --profile web add dsh-memento` (counts toward the [deepseek1024.com](https://deepseek1024.com) install ranking).
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-memento)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-memento?metric=downloads)](https://dshfind.com/plugins/PerryLink/dsh-memento?ref=badge)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/PerryLink/dsh-memento/badge)](https://api.securityscorecards.dev/projects/github.com/PerryLink/dsh-memento)

**Bounded, layered, approval-gated, auditable cross-session memory for DeepSeek Harness.**

*A typed `ctx.memory` seam, a write-approval gate no model path can bypass, and an audit trail you can rebuild — from the approval pair plus the plugin's own audit table, with the session-log gap named out loud.*
```

</details>

#### 缺口

- 重复说明和隐式持久化各有成本。
  **影响**：需要同时衡量节省和误召回。
  **进一步探讨**：以少量稳定约束开始。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 怎样写入和检索？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具支持新增、更改、删除、合并和查询，写路径由服务调用审批，读取可使用内置子串匹配。代码可按召回频次和更新时间排序。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:353-372](https://github.com/PerryLink/dsh-memento/blob/2fb8d7cd3013603910ee50a3de89d5b52e4c2938/index.mjs#L353-L372)

服务接入写入审批

<details>
<summary>查看原文（20行）</summary>

```text
 * DSH 专属物：审批传输（ctx.approval）与会话事件派发（memory/* 词汇的已知类型
 * 自适应门）。读方法无审批；禁用时本服务整体不存在。
 */
export class MemoryService extends MemoryProtocolCore {
  /**
   * @param {ServiceDeps} deps - {store, budgets, writePolicy, maxEntriesPerQuery, commandListLimit, commandAuditLimit, language, approval, sourceLabel}。
   */
  constructor(deps) {
    super({
      store: deps.store,
      budgets: deps.budgets,
      writePolicy: deps.writePolicy,
      defaultQueryLimit: deps.maxEntriesPerQuery,
      sourceLabel: deps.sourceLabel,
      gate: (payload, write) => askApproval(deps.approval, /** @type {WritePayload} */ (payload), write),
      emit: (session, type, data) => maybeAppendSessionEvent(session, type, data),
    })
    this.commandListLimit = deps.commandListLimit
    this.commandAuditLimit = deps.commandAuditLimit
    this.language = deps.language
```

</details>

**依据 2 · 源码核查**：[index.mjs:395-424](https://github.com/PerryLink/dsh-memento/blob/2fb8d7cd3013603910ee50a3de89d5b52e4c2938/index.mjs#L395-L424)

模型工具公开读写操作及会话快照语义

<details>
<summary>查看原文（30行）</summary>

```text
    'Read and write the bounded, layered, approval-gated cross-session memory store (dsh-memento).',
    '',
    'Tracks: "user" holds facts about the user (preferences, communication style, landmines, corrections); "agent" holds environment facts, project conventions, lessons learned, and completed-work summaries. Layers: "user-global" applies to every workspace; "workspace" applies only to the current working directory.',
    '',
    'Each track/layer pair has a hard character budget (shown in the session memory snapshot header). A write that would exceed it FAILS with a structured error carrying current usage and the limit — consolidate or remove entries, then retry. Never truncate or silently drop content.',
    '',
    'SAVE: user preferences and corrections; environment facts and project conventions; lessons learned from mistakes; summaries of completed work; anything the user explicitly asks you to remember.',
    'SKIP: trivial or re-derivable facts; encyclopedia knowledge a fresh search can answer; large data dumps or logs; one-off file paths; content already available in the current workspace.',
    '',
    'Writes (add/replace/remove/consolidate) require approval under the configured policy and are audited; reads (query) are free. replace/remove target an entry by a UNIQUE case-insensitive substring — an ambiguous match fails with the candidate list, so use a longer substring. consolidate merges 1..20 existing entries (unique substrings) into ONE new entry with a single approval and one atomic write — use it when a layer is over budget. Each session receives a frozen snapshot of current memory at startup; the snapshot never changes mid-session.',
  ].join('\n'),
  zh: [
    '读写有界、分层、带审批门、可审计的跨会话记忆库（dsh-memento）。',
    '',
    '轨道："user" 存用户相关事实（偏好、沟通风格、雷区、纠正）；"agent" 存环境事实、项目约定、教训与已完成工作总结。层："user-global" 对所有工作区生效；"workspace" 只对当前工作目录生效。',
    '',
    '每对轨道/层有硬字符预算（显示在会话记忆快照头部）。会超限的写入以结构化错误失败（携带当前用量与上限）——整合或删除条目后重试。绝不截断、绝不静默丢弃内容。',
    '',
    '应存（SAVE）：用户偏好与纠正；环境事实与项目约定；犯错得到的教训；已完成工作总结；用户明确要求记住的内容。',
    '应跳过（SKIP）：琐碎或可再推导的事实；重新搜索即可回答的百科知识；大数据转储或日志；一次性文件路径；当前工作区已有的内容。',
    '',
    '写（add/replace/remove/consolidate）需按配置策略审批并落审计；读（query）免费。replace/remove 用唯一大小写不敏感子串定位——歧义时报候选清单，请用更长子串。consolidate 以一次审批 + 一次原子写把 1..20 条整合为一条——层超预算时使用。每个会话启动时获得当前记忆的冻结快照；会话内快照不变。',
  ].join('\n'),
}

/** 记忆工具参数描述（双语）。 */
const MEMORY_TOOL_PARAMETERS = {
  en: {
    action: 'add = insert a new entry; replace = rewrite one existing entry; remove = delete one existing entry; consolidate = merge 1..20 existing entries into one new entry (single approval, atomic); query = substring search over existing entries.',
    track: 'Memory track. Defaults to "user". user = facts about the user; agent = environment/project facts and conventions.',
```

</details>

**依据 3 · 源码核查**：[lib/retrieval.mjs:28-61](https://github.com/PerryLink/dsh-memento/blob/2fb8d7cd3013603910ee50a3de89d5b52e4c2938/lib/retrieval.mjs#L28-L61)

子串匹配和稳定排序

<details>
<summary>查看原文（34行）</summary>

```text
 * 稳定排序比较器：召回频次降序 → 更新时间降序 → id 升序（与 store.queryEntries 排序一致）。
 * @param {{recallCount?: number, updatedAt?: number, id: string}} a - 条目 A。
 * @param {{recallCount?: number, updatedAt?: number, id: string}} b - 条目 B。
 * @returns {number} 比较结果（负数 = A 在前）。
 */
export function rankOrder(a, b) {
  return (b.recallCount ?? 0) - (a.recallCount ?? 0)
    || (b.updatedAt ?? 0) - (a.updatedAt ?? 0)
    || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
}

/**
 * 内置 substring 检索器（零依赖主路径）：大小写不敏感子串过滤 + 召回频次排序。
 * 语义与 store 的 instr(lower(text), lower(?)) 一致（ASCII 折叠；CJK 无大小写不受影响）。
 */
export class SubstringRetriever {
  constructor() {
    this.id = 'substring'
    this.name = 'Case-insensitive substring'
    this.description = 'Case-insensitive substring filter ranked by recall frequency (zero-dependency main path)'
    this.kind = /** @type {'substring'} */ ('substring')
  }

  /**
   * @param {string} query - 检索词。
   * @param {Array<{id: string, text: string, recallCount?: number, updatedAt?: number}>} entries - 候选条目。
   * @returns {Array<{id: string, text: string, recallCount?: number, updatedAt?: number}>} 命中条目（相关度排序，不截断）。
   */
  retrieve(query, entries) {
    const lower = String(query).toLowerCase()
    return entries
      .filter((entry) => entry.text.toLowerCase().includes(lower))
      .sort(rankOrder)
  }
```

</details>

#### 缺口

- 同义改写不保证触发子串召回。
  **影响**：配置和查询措辞影响召回结果。
  **进一步探讨**：对比同词、同义和冲突条目。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 审批是否等于隐私隔离？

**研究主题**：缺陷与关键质疑

#### 完整回答

审批 reason 可带记忆载荷。插件还明确提示会话日志不能单独重建写入，需结合其审计表。按自动策略允许写入也可能符合当前配置，因此需核对真实审批设置与读取范围。

#### 证据与依据

**依据 1 · 源码核查**：[lib/gate.mjs:4-11](https://github.com/PerryLink/dsh-memento/blob/2fb8d7cd3013603910ee50a3de89d5b52e4c2938/lib/gate.mjs#L4-L11)

有自动放行和禁止策略

```text
// - ask：委托审批链上其余 answerer（Web UI 人类审批 / ACP 一次性决策），无
//   answerer 时审批服务按失败封闭给出 unavailable → 写被拒。
// - auto：本插件 answerer 直接放行（allowed-once）；审批来源仍随 approval/asked
//   + approval/decided 审计对与审计表记录。
// - off：本插件 answerer 直接拒绝（rejected），写报结构化错误。
// 注意：会话级 ApprovalPolicy='never'（用户全局姿态）在审批服务内部、answerer
// 之前裁决，任何 answerer（含 prepend 注册的本插件）都无法绕过——这是 DSH
// 审批 seam 的硬不变量，本插件设计上遵从它。
```

**依据 2 · 源码核查**：[lib/gate.mjs:31-41](https://github.com/PerryLink/dsh-memento/blob/2fb8d7cd3013603910ee50a3de89d5b52e4c2938/lib/gate.mjs#L31-L41)

审批 reason 携带原始载荷

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * 构造审批 reason：第一行人类可读摘要，随后是完整载荷文本。
 * reason 随 approval/asked 进入会话日志（已知事件类型、可持久化），
 * S2 的"变更可自会话日志重建"由此成立。
 * @param {{action: string, track: string, scope: string, text: string, count?: number, source?: string}} input - {action, track, scope, text, count?, source?}；count 用于 seed 批量，source 供粒度策略裁决。
 * @returns {string} 审批 reason。
 */
export function buildWriteReason({ action, track, scope, text, count, source }) {
  const batch = count === undefined ? '' : ` (${count} entries)`
  const sourceTag = source === undefined ? '' : ` [source:${source}]`
  return `${REQUEST_MARKER} ${action}${batch} ${track}/${scope}${sourceTag}\n${text}`
```

</details>

**依据 3 · 源码核查**：[index.mjs:1414-1421](https://github.com/PerryLink/dsh-memento/blob/2fb8d7cd3013603910ee50a3de89d5b52e4c2938/index.mjs#L1414-L1421)

提示会话日志无法单独重建

```text
    proposalDismissed: (id) => `Proposal ${id} dismissed.`,
    auditEmpty: 'Audit is empty.',
    audit: (n) => `Recent audit (${n} rows):`,
    auditGapNotice: 'Note: the session-log side of the audit is NOT currently written — this harness does not know the memory/* session event types, so appending them would make the session unloadable. The audit chain here (approval seam + this ledger) is complete; the session log alone cannot rebuild memory writes.',
    addNeedsText: 'add needs text: /memory add [--track=user|agent] [--scope=user-global|workspace] <text>',
    added: (track, scope, text, used, limit) => `Added (${track}/${scope}): ${text}\nLayer usage: ${used}/${limit}`,
    removeNeedsSubstring: 'remove needs a unique substring: /memory remove [--track=user|agent] [--scope=user-global|workspace] <substring>',
    removed: (track, scope, text, used, limit) => `Removed (${track}/${scope}): ${text}\nLayer usage: ${used}/${limit}`,
```

#### 缺口

- 删除主条目后仍应核对审批记录和审计留存。
  **影响**：本机存储和隐私隔离要分开验收。
  **进一步探讨**：仅使用虚构记忆核对留存。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用需要什么条件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者给出 npm、Git 和 tarball 安装方式，Node 版本有约束，卸载保留数据库和日志。隔离 profile 先确认审批插件接缝和恢复方案。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-25](https://github.com/PerryLink/dsh-memento/blob/2fb8d7cd3013603910ee50a3de89d5b52e4c2938/README.md#L18-L25)

作者标注 Node 版本约束

```text
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-memento.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-top-rated.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-memento/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-memento/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-memento?label=version)](https://github.com/PerryLink/dsh-memento/releases)
[![npm version](https://img.shields.io/npm/v/dsh-memento)](https://www.npmjs.com/package/dsh-memento)
```

**依据 2 · 作者声明**：[README.md:42-47](https://github.com/PerryLink/dsh-memento/blob/2fb8d7cd3013603910ee50a3de89d5b52e4c2938/README.md#L42-L47)

作者描述安装来源与保留文件

```text
## Install & uninstall

- **git channel** (latest `main`): `dsh plugin --profile web add git+https://github.com/PerryLink/dsh-memento.git`.
- **npm channel** (published releases): `dsh plugin --profile web add dsh-memento`.
- **tarball channel**: `npm pack` in this repo, then `dsh plugin --profile web add ./dsh-memento-<version>.tgz`.
- **uninstall**: `dsh plugin --profile web remove dsh-memento` (the memory database and session logs are kept).
```

#### 缺口

- 旧数据可能在卸载后持续保留。
  **影响**：撤销和备份需要额外步骤。
  **进一步探讨**：检查可导出数据与备份位置。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证稳定收益？

**研究主题**：新假设与验证

#### 完整回答

对两个新会话分别复用已批准和已拒绝的记忆，记录命中率、额外注入内容和审计对应关系，并检查同一会话快照何时更新。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:395-424](https://github.com/PerryLink/dsh-memento/blob/2fb8d7cd3013603910ee50a3de89d5b52e4c2938/index.mjs#L395-L424)

工具说明给出快照和查询边界

<details>
<summary>查看原文（30行）</summary>

```text
    'Read and write the bounded, layered, approval-gated cross-session memory store (dsh-memento).',
    '',
    'Tracks: "user" holds facts about the user (preferences, communication style, landmines, corrections); "agent" holds environment facts, project conventions, lessons learned, and completed-work summaries. Layers: "user-global" applies to every workspace; "workspace" applies only to the current working directory.',
    '',
    'Each track/layer pair has a hard character budget (shown in the session memory snapshot header). A write that would exceed it FAILS with a structured error carrying current usage and the limit — consolidate or remove entries, then retry. Never truncate or silently drop content.',
    '',
    'SAVE: user preferences and corrections; environment facts and project conventions; lessons learned from mistakes; summaries of completed work; anything the user explicitly asks you to remember.',
    'SKIP: trivial or re-derivable facts; encyclopedia knowledge a fresh search can answer; large data dumps or logs; one-off file paths; content already available in the current workspace.',
    '',
    'Writes (add/replace/remove/consolidate) require approval under the configured policy and are audited; reads (query) are free. replace/remove target an entry by a UNIQUE case-insensitive substring — an ambiguous match fails with the candidate list, so use a longer substring. consolidate merges 1..20 existing entries (unique substrings) into ONE new entry with a single approval and one atomic write — use it when a layer is over budget. Each session receives a frozen snapshot of current memory at startup; the snapshot never changes mid-session.',
  ].join('\n'),
  zh: [
    '读写有界、分层、带审批门、可审计的跨会话记忆库（dsh-memento）。',
    '',
    '轨道："user" 存用户相关事实（偏好、沟通风格、雷区、纠正）；"agent" 存环境事实、项目约定、教训与已完成工作总结。层："user-global" 对所有工作区生效；"workspace" 只对当前工作目录生效。',
    '',
    '每对轨道/层有硬字符预算（显示在会话记忆快照头部）。会超限的写入以结构化错误失败（携带当前用量与上限）——整合或删除条目后重试。绝不截断、绝不静默丢弃内容。',
    '',
    '应存（SAVE）：用户偏好与纠正；环境事实与项目约定；犯错得到的教训；已完成工作总结；用户明确要求记住的内容。',
    '应跳过（SKIP）：琐碎或可再推导的事实；重新搜索即可回答的百科知识；大数据转储或日志；一次性文件路径；当前工作区已有的内容。',
    '',
    '写（add/replace/remove/consolidate）需按配置策略审批并落审计；读（query）免费。replace/remove 用唯一大小写不敏感子串定位——歧义时报候选清单，请用更长子串。consolidate 以一次审批 + 一次原子写把 1..20 条整合为一条——层超预算时使用。每个会话启动时获得当前记忆的冻结快照；会话内快照不变。',
  ].join('\n'),
}

/** 记忆工具参数描述（双语）。 */
const MEMORY_TOOL_PARAMETERS = {
  en: {
    action: 'add = insert a new entry; replace = rewrite one existing entry; remove = delete one existing entry; consolidate = merge 1..20 existing entries into one new entry (single approval, atomic); query = substring search over existing entries.',
    track: 'Memory track. Defaults to "user". user = facts about the user; agent = environment/project facts and conventions.',
```

</details>

**依据 2 · 源码核查**：[lib/gate.mjs:38-41](https://github.com/PerryLink/dsh-memento/blob/2fb8d7cd3013603910ee50a3de89d5b52e4c2938/lib/gate.mjs#L38-L41)

可对照审批载荷

```text
export function buildWriteReason({ action, track, scope, text, count, source }) {
  const batch = count === undefined ? '' : ` (${count} entries)`
  const sourceTag = source === undefined ? '' : ` [source:${source}]`
  return `${REQUEST_MARKER} ${action}${batch} ${track}/${scope}${sourceTag}\n${text}`
```

#### 缺口

- 当前无本机宿主验收。
  **影响**：可用对照组区分记忆和提示本身的影响。
  **进一步探讨**：双会话试验并检查审计记录。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
