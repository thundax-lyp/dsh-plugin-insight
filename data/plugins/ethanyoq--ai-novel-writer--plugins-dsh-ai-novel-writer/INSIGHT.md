# AI Novel Writer DSH 插件预览

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[59153ce](https://github.com/EthanYoQ/AI-Novel-Writer/tree/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer)

<!-- BEGIN META -->
[![GitHub ★ 2,172](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C172&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EthanYoQ/AI-Novel-Writer) [![npm 30d 1,545](https://img.shields.io/static/v1?label=npm+30d&message=1%2C545&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ethanyoq/dsh-ai-novel-writer) [![最新发布 2026-08-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ethanyoq/dsh-ai-novel-writer)
<!-- END META -->

> **功能**：在 DSH 工作台中组织小说项目和待人工应用的写作提案。

> **亮点**：[Q02](#research-q02) 将模型建议与人工应用分离，[Q03](#research-q03) 已记录逐项和 partial；不是自动文学质量保证。

> **主要限制**：[Q03](#research-q03) 部分应用不能视为整包成功，Git 不备份数据库；[Q04](#research-q04) 本轮没有资格测试。

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
  - [Q01 · 谁使用 DSH 预览，与桌面版和手写有何区别？](#detail-section-11)
  - [Q02 · 模型建议怎样与权威项目状态分开？](#detail-section-12)
  - [Q03 · 部分应用与备份/迁移失败如何处理？](#detail-section-13)
  - [Q04 · 资格、模型和退出成本是什么？](#detail-section-14)
  - [Q05 · 如何检验跨提案的故事一致性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在 DSH 中逐章写作并愿意人工审阅提案的作者。

手工文件和根桌面应用可以写作；子包提供宿主内的结构和建议审阅，但项目格式不互通。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 生成建议 | 提案草稿 | 未应用前非权威 |
| 人工应用 | 将变更写数据库 | 可能 partial |
| 逐项恢复 | 重试、丢弃或重生成 | 需核查状态 |
| 备份 | 恢复作品 | Git 不包含数据库 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH Web 与 workspace | 必需 | V2 工具和工作台 | 不可使用 |
| 可写本地项目数据库 | 必需 | 持久化提案和内容 | 无法应用 |
| 模型 | AI 草稿需要 | 生成建议 | 手工编辑 |
| 独立备份 | 采用需要 | 恢复数据库 | 不能依赖 Git |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户验证资格并备份 | 隔离项目 |
| 草拟 | 模型提交 proposal | 尚非权威状态 |
| 审阅 | 用户检查内容 | 选择应用 |
| 恢复 | 查看 partial 和数据库 | 逐项核对，不盲重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | 宿主及模型 | 资格与配置 | 未执行 |
| 持续 | 模型与数据库 | 审稿 | 净收益未知 |
| 失败 | 数据库与备份 | 核查 partial | 不保证整包回滚 |
| 退出 | 独立备份 | 核实数据库与迁移 | Git 不含 sidecar |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模型建议 | V2 提案非权威 | 故事质量 |
| 应用 | 逐项状态和回执 | 整包原子性 |
| 备份 | 文档要求独立备份 | 恢复实测 |

> **思考**：[Q03](#research-q03) 部分应用不能视为整包成功，Git 不备份数据库；[Q04](#research-q04) 本轮没有资格测试。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将模型建议与人工应用分离，[Q03](#research-q03) 已记录逐项和 partial；不是自动文学质量保证。

[Q02](#research-q02) RPC 驱动人工应用，[Q03](#research-q03) 逐项事务允许 partial。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 部分应用不能视为整包成功，Git 不备份数据库；[Q04](#research-q04) 本轮没有资格测试。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 资格验证前观察，实际使用需备份并逐项核对 partial。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包静态核查，遵项目门禁不称合格；未运行宿主、浏览器或模型。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-ai-novel-writer/package.json、plugins/dsh-ai-novel-writer/README.md、plugins/dsh-ai-novel-writer/src/agent-v2.ts、plugins/dsh-ai-novel-writer/src/command-rpc.ts、plugins/dsh-ai-novel-writer/src/novel-store.ts 及固定范围 inventory；组件：plugins/dsh-ai-novel-writer。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 DSH 子包静态核查 V2 入口、提案存储与项目资格规则；未运行浏览器或模型。
- 下一步：遵项目门禁隔离验证 preset、提案、部分失败、重启和数据库恢复。

**分析版本**

- **仓库**：[EthanYoQ/AI-Novel-Writer](https://github.com/EthanYoQ/AI-Novel-Writer)
- **版本号**：0.1.0（[固定提交 59153ce](https://github.com/EthanYoQ/AI-Novel-Writer/tree/59153ceb1174b20339e205b801f4e694e5ad5507)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对角色和时间线引用展示可复核差异；现有逐项处理是反证，效果未验证。

遵项目门禁隔离验证 preset、提案、部分失败、重启和数据库恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 362 | — | — | 6015 |
| .mjs | source | 7 | 2200 | 2042 | 37 | — |
| .ts | source | 22 | 13107 | 11177 | 1086 | — |
| .tsx | source | 3 | 2274 | 2095 | 84 | — |
| .ts | test | 38 | 10142 | 9255 | 21 | — |
| .tsx | test | 4 | 3333 | 3070 | 4 | — |
| .mjs | example | 4 | 1256 | 1190 | 25 | — |

</details>

**活跃度**

[![Issue 未关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/EthanYoQ/AI-Novel-Writer/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 112](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=112&color=737b86&logo=github)](https://github.com/EthanYoQ/AI-Novel-Writer/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 122](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=122&color=737b86&logo=github)](https://github.com/EthanYoQ/AI-Novel-Writer/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 小说预览 V2 提案、权威状态、部分应用与备份。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用 DSH 预览，与桌面版和手写有何区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向希望在 DSH Web 中逐章组织小说素材并审阅 AI 草稿的作者。直接编辑文件或使用根桌面版是替代；该子包有自己的项目格式和发行，作者明确桌面项目不能直接打开，且预览已冻结。增量是将写作结构、模型建议和人工应用组织在宿主工作台，不保证故事质量或替代桌面批处理。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-ai-novel-writer/package.json:1-18](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/package.json#L1-L18)

子包身份及入口。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "@ethanyoq/dsh-ai-novel-writer",
  "version": "0.1.0",
  "description": "A local-first novel project plugin for DeepSeek Harness",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/EthanYoQ/AI-Novel-Writer.git",
    "directory": "plugins/dsh-ai-novel-writer"
  },
  "bugs": {
    "url": "https://github.com/EthanYoQ/AI-Novel-Writer/issues"
  },
  "homepage": "https://github.com/EthanYoQ/AI-Novel-Writer/tree/master/plugins/dsh-ai-novel-writer#readme",
  "publishConfig": {
    "access": "public"
  },
  "type": "module",
  "packageManager": "pnpm@11.11.0",
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-ai-novel-writer/README.md:1-5](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/README.md#L1-L5)

预览冻结和桌面格式区分。

```text
# AI Novel Writer for DeepSeek Harness

The `0.1.0` plugin preview is frozen. No short-term feature work is planned. This README supports existing users and maintainers. Development can resume only under a new, explicitly scoped plan.

The plugin adds a local novel workspace to DeepSeek Harness Web. It has its own project format and release. It does not open desktop projects. The desktop app's `1.2.0-Preview` release does not change this plugin's version or maintenance status.
```

**依据 3 · 源码核查**：[plugins/dsh-ai-novel-writer/README.md:35-55](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/README.md#L35-L55)

逐章与人工审阅流程。

<details>
<summary>查看原文（21行）</summary>

```text
## Write with the V2 workbench

V2 supports project settings, story architecture, characters, a whole-book outline, chapter blueprints, and prose. Work on one chapter at a time. It does not provide the desktop app's batch workflows or automated review process.

Use the workbench's project setup controls for an empty workspace. Complete the story architecture and characters before you prepare the outline and chapter blueprints.

For AI drafting, follow this sequence:

1. Select the stage or chapter you want to write.

2. Enter any instructions and request an AI draft in the selected session.

3. Inspect the generated values in the local editor.

4. Edit the values if needed and submit the revised proposal.

5. Review the Proposal inbox item.

6. Apply the proposal to update the project.

A Proposal is a pending change for human review. Receiving a proposal or seeing generated text in the editor does not save that text as project state. Editing the local form does not change the pending proposal until you submit the replacement.
```

</details>

#### 缺口

- 未与手工或桌面写作对照
  **影响**：无法证明创作效率与质量
  **进一步探讨**：固定章节任务比较可用稿、审阅时间和人工改写。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型建议怎样与权威项目状态分开？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

V2 agent 入口要求 workspaceRegistry 并调用 applyV2；作者说明模型使用 novel_read 与 novel_propose_change，proposal 先进入可持久收件箱，只有工作台人工 apply 后改变项目。RPC 调 store.applyProposal；apply 在逐项处理时使用数据库事务并保存回执，不能把编辑器草稿、生成文本或 proposal 收到视为已保存。该边界是固定源码和作者流程，未跑浏览器或实际模型。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-ai-novel-writer/src/agent-v2.ts:1-17](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/src/agent-v2.ts#L1-L17)

V2 依赖和入口。

<details>
<summary>查看原文（17行）</summary>

```text
/** V2-only agent entry: its Workspace registry is a required Host dependency. */
import type { Context } from '@deepseek-ai/cordis'
import { applyV2, NovelV2Config } from './agent.ts'
import type { NovelV2Config as NovelV2ConfigType } from './agent.ts'

/** Stable Cordis plugin name for the isolated V2 tool surface. */
export const name = 'dsh-ai-novel-writer-agent-v2'

/** V2 needs the Host-owned Workspace registry; V1 deliberately does not. */
export const inject = ['agents', 'systemPrompt', 'tools', 'workspaceRegistry']

/** Runtime config schema for the V2 proposal inbox bounds. */
export const Config = NovelV2Config

/** Register V2 tools with the separately injected Workspace registry. */
export function apply(ctx: Context, config: NovelV2ConfigType = {}): void {
  applyV2(ctx, config)
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-ai-novel-writer/README.md:41-59](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/README.md#L41-L59)

作者说明建议与人工应用。

<details>
<summary>查看原文（19行）</summary>

```text
For AI drafting, follow this sequence:

1. Select the stage or chapter you want to write.

2. Enter any instructions and request an AI draft in the selected session.

3. Inspect the generated values in the local editor.

4. Edit the values if needed and submit the revised proposal.

5. Review the Proposal inbox item.

6. Apply the proposal to update the project.

A Proposal is a pending change for human review. Receiving a proposal or seeing generated text in the editor does not save that text as project state. Editing the local form does not change the pending proposal until you submit the replacement.

The local form draft is not authoritative and does not become saved project state after a reload. Applied changes are stored in the project. The inbox retains pending proposals after restart.

If a proposal applies only partly, inspect its status before applying the remaining items. Failed items can be retried, discarded, or regenerated through the workbench. Do not assume that every item was saved because one item succeeded.
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-ai-novel-writer/README.md:61-69](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/README.md#L61-L69)

V1/V2 工具和权威边界。

```text
## Keep an existing V1 session

The package also installs the original AI 小说作家 Preset. Existing sessions keep their original Preset. To switch to V2, create a new session with AI 小说作家 V2.

V1 reads with `novel_read` and changes one file with `novel_apply_change`. The tool presents the replacement for Harness native one-time approval. A successful `CommitReceipt` means the approved file was saved.

V2 reads with `novel_read` and proposes changes with `novel_propose_change`. The model does not apply those proposals. Human application in the workbench changes project state.

Neither Preset includes shell access, general filesystem writes, text replacement tools, or Code Mode. Creative strategy controls writing order and emphasis. It does not select a model provider or reasoning parameter.
```

**依据 4 · 源码核查**：[plugins/dsh-ai-novel-writer/src/command-rpc.ts:615-624](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/src/command-rpc.ts#L615-L624)

RPC 调用 applyProposal。

<details>
<summary>查看原文（10行）</summary>

```text
        return { ok: true, value }
      }
      if (endpoint === 'chapter/context') {
        const value: NovelChapterContextResult = await store.readChapterContext(chapter!, signal)
        return { ok: true, value }
      }
      if (endpoint === 'proposal/apply') {
        return { ok: true, value: await store.applyProposal(proposalId!, signal) }
      }
      if (endpoint === 'proposal/retry') {
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-store.ts:2553-2576](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/src/novel-store.ts#L2553-L2576)

按项应用和事务起点。

<details>
<summary>查看原文（24行）</summary>

```text
  #applyProposal(proposalId: string, signal: AbortSignal): NovelProposalApplyResult {
    const proposal = this.#proposalRow(proposalId)
    const appliedItemIds: string[] = []
    const items = this.#proposalItems(proposalId)
    const commands = items.map(item => this.#proposalCommand(item, proposal))
    const aggregateCommands = commands.filter(isAggregateProposalChange)
    const sharedSnapshotBaseGlobalRevision = aggregateCommands.length > 1
      && aggregateCommands.every(command => command.baseGlobalRevision === aggregateCommands[0]!.baseGlobalRevision)
      && new Set(aggregateCommands.map(command => aggregateKey(command.aggregate))).size === aggregateCommands.length
      ? aggregateCommands[0]!.baseGlobalRevision
      : undefined
    let previouslyAppliedAggregateItems = 0
    for (const [index, item] of items.entries()) {
      const command = commands[index]!
      if (item.status === 'applied' || item.status === 'discarded' || item.status === 'superseded') {
        if (item.status === 'applied' && isAggregateProposalChange(command)) previouslyAppliedAggregateItems += 1
        continue
      }
      if (item.status !== 'pending') {
        return { proposal: this.#proposalSummary(proposalId), appliedItemIds, stoppedItemId: item.item_id }
      }
      requireNotAborted(signal)
      try {
        this.#db.exec('BEGIN IMMEDIATE')
```

</details>

#### 缺口

- 未验证宿主 roster、用户界面和真实模型
  **影响**：不能证明端到端可用或所有保存动作受控
  **进一步探讨**：遵项目门禁在隔离 profile 核对工具、proposal、apply 和重启。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 部分应用与备份/迁移失败如何处理？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

提案按项依序应用；一项不可继续时返回 stoppedItemId，已应用项保留，汇总状态可为 partial，失败项支持受限重试、丢弃或重生成。因此旧报告提出的“逐项状态”已是现有实现，不能继续当未实现创新。V2 数据库及 sidecar 被 Git 忽略，Git 提交不等于备份；作者说明 V1 转换发布数据库后验证失败时数据库仍存在，必须检查状态再重试，不能宣称全流程回滚。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-store.ts:390-405](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/src/novel-store.ts#L390-L405)

partial 状态及回执。

<details>
<summary>查看原文（16行）</summary>

```text
function proposalStatusFromItems(statuses: readonly NovelProposalItemStatus[]): NovelProposalStatus {
  if (statuses.length === 0) throw new NovelStoreError('UNSUPPORTED_FORMAT', 'proposal has no items')
  if (statuses.every(status => status === 'applied')) return 'applied'
  const recoverable = statuses.find(status => status === 'pending' || status === 'stale' || status === 'failed')
  if (recoverable !== undefined) return statuses.includes('applied') ? 'partial' : recoverable
  return statuses.find(status => status !== 'applied')!
}

/** Path-free machine-readable failure retained after an item cannot be applied. */
export type NovelProposalItemFailure = NovelStoreErrorCode

/** Receipt retained atomically with a proposal item that has changed durable state. */
export type NovelProposalItemReceipt = NovelChangeReceipt | {
  readonly kind: NovelArtifactProposalChange['kind']
  readonly chapter: number
  readonly artifactId: string
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-store.ts:2357-2405](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/src/novel-store.ts#L2357-L2405)

应用、重试及丢弃。

<details>
<summary>查看原文（49行）</summary>

```text
  async applyProposal(proposalId: string, signal: AbortSignal): Promise<NovelProposalApplyResult> {
    requireNotAborted(signal)
    return this.#enqueue(() => {
      this.#requireWritable()
      this.#requireWrittenBinding()
      return this.#applyProposal(proposalId, signal)
    })
  }

  async retryProposalItem(proposalId: string, itemId: string, signal: AbortSignal): Promise<NovelProposalApplyResult> {
    requireNotAborted(signal)
    return this.#enqueue(() => {
      this.#requireWritable()
      const item = this.#proposalItem(proposalId, itemId)
      if (item.status !== 'failed' || item.failure_code === null || !isRetryableFailure(item.failure_code)) {
        throw new NovelStoreError('PROPOSAL_ITEM_NOT_RETRYABLE', 'proposal item is not retryable')
      }
      const now = new Date().toISOString()
      this.#db.exec('BEGIN IMMEDIATE')
      try {
        this.#db.prepare("UPDATE proposal_items SET status = 'pending', failure_code = NULL, updated_at = ? WHERE item_id = ?").run(now, itemId)
        this.#setProposalStatus(proposalId, now)
        this.#db.exec('COMMIT')
      } catch (error) {
        this.#rollback()
        throw error
      }
      return this.#applyProposal(proposalId, signal)
    })
  }

  async discardProposalItem(proposalId: string, itemId: string, signal: AbortSignal): Promise<NovelProposalItemMutationResult> {
    requireNotAborted(signal)
    return this.#enqueue(() => {
      this.#requireWritable()
      const item = this.#proposalItem(proposalId, itemId)
      if (item.status === 'applied') throw new NovelStoreError('PROPOSAL_ITEM_APPLIED', 'applied proposal items cannot be discarded')
      if (item.status === 'superseded') throw new NovelStoreError('INVALID_CONTENT', 'superseded proposal items cannot be discarded')
      const now = new Date().toISOString()
      this.#db.exec('BEGIN IMMEDIATE')
      try {
        this.#db.prepare("UPDATE proposal_items SET status = 'discarded', updated_at = ? WHERE item_id = ?").run(now, itemId)
        this.#setProposalStatus(proposalId, now)
        this.#db.exec('COMMIT')
      } catch (error) {
        this.#rollback()
        throw error
      }
      const proposal = this.#proposalSummary(proposalId)
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-store.ts:2553-2576](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/src/novel-store.ts#L2553-L2576)

已应用项跳过与停止。

<details>
<summary>查看原文（24行）</summary>

```text
  #applyProposal(proposalId: string, signal: AbortSignal): NovelProposalApplyResult {
    const proposal = this.#proposalRow(proposalId)
    const appliedItemIds: string[] = []
    const items = this.#proposalItems(proposalId)
    const commands = items.map(item => this.#proposalCommand(item, proposal))
    const aggregateCommands = commands.filter(isAggregateProposalChange)
    const sharedSnapshotBaseGlobalRevision = aggregateCommands.length > 1
      && aggregateCommands.every(command => command.baseGlobalRevision === aggregateCommands[0]!.baseGlobalRevision)
      && new Set(aggregateCommands.map(command => aggregateKey(command.aggregate))).size === aggregateCommands.length
      ? aggregateCommands[0]!.baseGlobalRevision
      : undefined
    let previouslyAppliedAggregateItems = 0
    for (const [index, item] of items.entries()) {
      const command = commands[index]!
      if (item.status === 'applied' || item.status === 'discarded' || item.status === 'superseded') {
        if (item.status === 'applied' && isAggregateProposalChange(command)) previouslyAppliedAggregateItems += 1
        continue
      }
      if (item.status !== 'pending') {
        return { proposal: this.#proposalSummary(proposalId), appliedItemIds, stoppedItemId: item.item_id }
      }
      requireNotAborted(signal)
      try {
        this.#db.exec('BEGIN IMMEDIATE')
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-ai-novel-writer/README.md:73-89](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/README.md#L73-L89)

作者说明 Git 备份与迁移失败边界。

<details>
<summary>查看原文（17行）</summary>

```text
## Store and back up projects

V1 stores settings and planning files under `.ai-novel/`. Its chapter prose is in `chapters/NNNN.md`. V2 stores its project database in `.ai-novel/novel.db`.

V2 uses stable project and character identities, a proposal inbox, and a change audit. Character identity is separate from the character's displayed name. The browser sends workspace identifiers, not local filesystem paths.

Back up the project folder yourself. The V2 database and its sidecars are excluded from Git by `.ai-novel/.gitignore`. A Git commit alone does not back up that database. Plugin project export is not provided.

Use a local workspace. Real-time cloud-synchronized folders and network drives are unsupported. The plugin does not import desktop `.vela` projects or synchronize them with desktop projects.

### Convert plugin V1 data for development

The exported `previewV1NovelMigration` and `migrateV1NovelProject` functions support an explicit plugin V1-to-V2 conversion. They are development APIs, not a desktop import feature.

Conversion archives the original five assets under `.ai-novel/v1-archive/<fingerprint>/` and checks the source again before publishing the staged database. It does not replace an existing database. A cross-device layout fails with `WRITE_FAILED`.

If validation fails after database publication, the error states that the database remains published. Inspect that state before retrying. The V1 archive is also excluded from Git, so keep an independent backup.
```

</details>

#### 缺口

- 未运行 SQLite 故障及迁移
  **影响**：无法保证磁盘故障时状态与恢复
  **进一步探讨**：可丢弃副本注入逐项失败、重启及备份恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 资格、模型和退出成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需兼容 DSH Web、项目 workspace、适用模型及本地存储；项目规则要求隔离构建与浏览器资格证据，浏览器 skipped 不算 qualified，keyless 结果也不替代在线模型。本轮禁止执行目标，所以只能给有条件试用建议。首次需备份和检查格式，持续需模型费用及人工审稿，失败后核对 partial/数据库，退出要单独保存数据库，不把 Git 或卸载当备份。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-ai-novel-writer/README.md:73-81](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/README.md#L73-L81)

本地存储和手动备份。

```text
## Store and back up projects

V1 stores settings and planning files under `.ai-novel/`. Its chapter prose is in `chapters/NNNN.md`. V2 stores its project database in `.ai-novel/novel.db`.

V2 uses stable project and character identities, a proposal inbox, and a change audit. Character identity is separate from the character's displayed name. The browser sends workspace identifiers, not local filesystem paths.

Back up the project folder yourself. The V2 database and its sidecars are excluded from Git by `.ai-novel/.gitignore`. A Git commit alone does not back up that database. Plugin project export is not provided.

Use a local workspace. Real-time cloud-synchronized folders and network drives are unsupported. The plugin does not import desktop `.vela` projects or synchronize them with desktop projects.
```

**依据 2 · 源码核查**：[plugins/dsh-ai-novel-writer/README.md:155-167](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/README.md#L155-L167)

项目资格要求及限制。

<details>
<summary>查看原文（13行）</summary>

````text
## Release qualification

Qualification requires a clean DeepSeek Harness checkout at `47f943859bef60e4160492346772ded9b24f765a`, pnpm, tar, and locally installed Google Chrome. Supply the checkout's absolute path:

```powershell
pnpm run qualify -- --harness-root '<path-to-deepseek-harness>'
```

The command packs the plugin and installs those bytes into an isolated Web profile. It checks Preset installation, the exact V2 tools `novel_read` and `novel_propose_change`, human Proposal application, partial status, and durable state after restart. A browser skipped result is not qualified.

See [V2 development gates](docs/v2-development-gates.md) for evidence order and failure handling. Each run stores temporary logs, screenshots, and a machine-readable receipt under a task-owned `.runtime/.cache/` directory with `.vibe-owner.json` ownership and expiry.

The keyless snapshot does not replace manual qualification with a configured online model. Historical receipts apply only to their tested source and package.
````

</details>

**依据 3 · 源码核查**：[plugins/dsh-ai-novel-writer/src/agent-v2.ts:6-17](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/src/agent-v2.ts#L6-L17)

宿主 workspace 依赖。

<details>
<summary>查看原文（12行）</summary>

```text
/** Stable Cordis plugin name for the isolated V2 tool surface. */
export const name = 'dsh-ai-novel-writer-agent-v2'

/** V2 needs the Host-owned Workspace registry; V1 deliberately does not. */
export const inject = ['agents', 'systemPrompt', 'tools', 'workspaceRegistry']

/** Runtime config schema for the V2 proposal inbox bounds. */
export const Config = NovelV2Config

/** Register V2 tools with the separately injected Workspace registry. */
export function apply(ctx: Context, config: NovelV2ConfigType = {}): void {
  applyV2(ctx, config)
```

</details>

#### 缺口

- 未执行项目规定的资格与在线模型
  **影响**：不能称已可用或评估净费用
  **进一步探讨**：由授权执行者按门禁在隔离 profile 测试并备份恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验跨提案的故事一致性？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有逐项状态、失败重试、丢弃和数据库回执，单纯新增逐项接受或 partial 标签不是创新。未验证方案是应用前把角色、时间线与章节的受影响引用汇总为可复核差异，对缺少来源和冲突标未知，由作者审定；它不自动判文学质量。用同一组含角色改名、时间矛盾和无冲突变更的提案，比较错漏、误报、阅读时间及模型费用；若发现率不提升或干扰过大则否定。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-store.ts:390-405](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/src/novel-store.ts#L390-L405)

已有逐项状态和回执。

<details>
<summary>查看原文（16行）</summary>

```text
function proposalStatusFromItems(statuses: readonly NovelProposalItemStatus[]): NovelProposalStatus {
  if (statuses.length === 0) throw new NovelStoreError('UNSUPPORTED_FORMAT', 'proposal has no items')
  if (statuses.every(status => status === 'applied')) return 'applied'
  const recoverable = statuses.find(status => status === 'pending' || status === 'stale' || status === 'failed')
  if (recoverable !== undefined) return statuses.includes('applied') ? 'partial' : recoverable
  return statuses.find(status => status !== 'applied')!
}

/** Path-free machine-readable failure retained after an item cannot be applied. */
export type NovelProposalItemFailure = NovelStoreErrorCode

/** Receipt retained atomically with a proposal item that has changed durable state. */
export type NovelProposalItemReceipt = NovelChangeReceipt | {
  readonly kind: NovelArtifactProposalChange['kind']
  readonly chapter: number
  readonly artifactId: string
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-store.ts:2357-2405](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/src/novel-store.ts#L2357-L2405)

已有失败项操作。

<details>
<summary>查看原文（49行）</summary>

```text
  async applyProposal(proposalId: string, signal: AbortSignal): Promise<NovelProposalApplyResult> {
    requireNotAborted(signal)
    return this.#enqueue(() => {
      this.#requireWritable()
      this.#requireWrittenBinding()
      return this.#applyProposal(proposalId, signal)
    })
  }

  async retryProposalItem(proposalId: string, itemId: string, signal: AbortSignal): Promise<NovelProposalApplyResult> {
    requireNotAborted(signal)
    return this.#enqueue(() => {
      this.#requireWritable()
      const item = this.#proposalItem(proposalId, itemId)
      if (item.status !== 'failed' || item.failure_code === null || !isRetryableFailure(item.failure_code)) {
        throw new NovelStoreError('PROPOSAL_ITEM_NOT_RETRYABLE', 'proposal item is not retryable')
      }
      const now = new Date().toISOString()
      this.#db.exec('BEGIN IMMEDIATE')
      try {
        this.#db.prepare("UPDATE proposal_items SET status = 'pending', failure_code = NULL, updated_at = ? WHERE item_id = ?").run(now, itemId)
        this.#setProposalStatus(proposalId, now)
        this.#db.exec('COMMIT')
      } catch (error) {
        this.#rollback()
        throw error
      }
      return this.#applyProposal(proposalId, signal)
    })
  }

  async discardProposalItem(proposalId: string, itemId: string, signal: AbortSignal): Promise<NovelProposalItemMutationResult> {
    requireNotAborted(signal)
    return this.#enqueue(() => {
      this.#requireWritable()
      const item = this.#proposalItem(proposalId, itemId)
      if (item.status === 'applied') throw new NovelStoreError('PROPOSAL_ITEM_APPLIED', 'applied proposal items cannot be discarded')
      if (item.status === 'superseded') throw new NovelStoreError('INVALID_CONTENT', 'superseded proposal items cannot be discarded')
      const now = new Date().toISOString()
      this.#db.exec('BEGIN IMMEDIATE')
      try {
        this.#db.prepare("UPDATE proposal_items SET status = 'discarded', updated_at = ? WHERE item_id = ?").run(now, itemId)
        this.#setProposalStatus(proposalId, now)
        this.#db.exec('COMMIT')
      } catch (error) {
        this.#rollback()
        throw error
      }
      const proposal = this.#proposalSummary(proposalId)
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-ai-novel-writer/README.md:41-59](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/plugins/dsh-ai-novel-writer/README.md#L41-L59)

已有人工审阅和部分保存提示。

<details>
<summary>查看原文（19行）</summary>

```text
For AI drafting, follow this sequence:

1. Select the stage or chapter you want to write.

2. Enter any instructions and request an AI draft in the selected session.

3. Inspect the generated values in the local editor.

4. Edit the values if needed and submit the revised proposal.

5. Review the Proposal inbox item.

6. Apply the proposal to update the project.

A Proposal is a pending change for human review. Receiving a proposal or seeing generated text in the editor does not save that text as project state. Editing the local form does not change the pending proposal until you submit the replacement.

The local form draft is not authoritative and does not become saved project state after a reload. Applied changes are stored in the project. The inbox retains pending proposals after restart.

If a proposal applies only partly, inspect its status before applying the remaining items. Failed items can be retried, discarded, or regenerated through the workbench. Do not assume that every item was saved because one item succeeded.
```

</details>

#### 缺口

- 引用差异方案未实现且缺文学质量评测
  **影响**：不能声称减少情节矛盾
  **进一步探讨**：让作者盲审标注提案并测误报及时间。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
