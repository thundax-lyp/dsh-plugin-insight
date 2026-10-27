# AI Novel Writer DSH 插件预览

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[62880d6](https://github.com/EthanYoQ/AI-Novel-Writer/tree/62880d629af7bbfaf968c0cda5ae76816e917915/plugins/dsh-ai-novel-writer)

<!-- BEGIN META -->
[![GitHub ★ 1,859](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C859&color=yellow&logo=github&style=flat)](https://github.com/EthanYoQ/AI-Novel-Writer) [![npm 30d 1,518](https://img.shields.io/static/v1?label=npm+30d&message=1%2C518&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@ethanyoq/dsh-ai-novel-writer) [![最新发布 2026-08-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@ethanyoq/dsh-ai-novel-writer)
<!-- END META -->

> **实现功能**：为DSH Web提供独立本地小说工作台，以人工审查的Proposal应用规划与章节修改。

> **核心亮点**：[Q02](#research-q02) 用Host身份、持久proposal与逐项receipt把生成和权威保存分开，相对聊天复制增加可追踪交接；不证明文学质量。

> **风险与缺陷**：[Q03](#research-q03) 一项成功不代表整包保存，数据库又不随Git备份；维护冻结和不互通桌面限制新采用，部分失败必须先回读状态。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 启动与依赖](#detail-section-4)
  - [1.4 启动步骤](#detail-section-5)
  - [1.5 成本](#detail-section-6)
  - [1.6 效果](#detail-section-7)
  - [1.7 工程亮点](#detail-section-8)
  - [1.8 主要限制](#detail-section-9)
  - [1.9 使用建议](#detail-section-10)
  - [1.10 核查说明与分析版本](#detail-section-11)
- [2 未来设计假设（未验证）](#detail-section-12)
- [3 辅助信息](#detail-section-13)
- [4 研究问题与完整回答](#detail-section-14)
  - [Q01 · 插件与桌面版分别是什么，谁应继续使用？](#detail-section-15)
  - [Q02 · 模型建议与权威状态怎样分开？](#detail-section-16)
  - [Q03 · 人工应用的贡献与部分保存、备份风险是什么？](#detail-section-17)
  - [Q04 · 逐项接受包能否减少全保存误判？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：现有DSH小说工作台用户逐章生成建议并人工确认保存到独立本地项目。

聊天起草后人工复制与文档版本管理是简单基线；不宣称冻结预览替代桌面完整流程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| V2提案 | 结构化非权威修改 | 生成不等于保存 |
| 人工逐项应用 | 写库并留回执 | partial不是全包成功 |
| 插件项目 | 本地小说规划章节 | 不互通桌面、无项目导出 |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 条件 | 用途 | 退路 |
|---|---|---|
| 匹配DSH/Node与preset | 加载V2工具 | 冻结版本不盲目升级 |
| 本地注册工作区 | 保存novel.db | 禁用不支持同步盘 |
| 完整独立备份 | 恢复稿件 | Git不能代替DB副本 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与判据 | 失败处理 |
|---|---|---|
| 备份并配置V2 | 用户确认本地DB副本 | 不迁唯一原稿 |
| 生成并提交proposal | 作者检查非权威建议 | 文字显示不当已保存 |
| 人工apply后回读 | 作者核对逐项receipt | partial先对账再重试 |

**效果与成本**

<a id="detail-section-6"></a>

### 1.5 成本

| 阶段 | 现金／资源 | 人工／时间 |
|---|---|---|
| 首次 | 匹配宿主与模型资源，未知 | preset/工作区/项目配置，未知 |
| 持续 | 模型与DB资源，未知 | 逐章审查和手工备份，未知 |
| 失败恢复 | 重生成资源，未知 | 逐项对账、库恢复，未知 |

<a id="detail-section-7"></a>

### 1.6 效果

| 任务 | 支持 | 缺口 |
|---|---|---|
| 人工确认保存 | proposal与item receipt | workbench真实权限/呈现 |
| 小说创作 | 结构化规划与章节建议 | 文笔、连续性和整体节时 |

> **思考**：[Q03](#research-q03) 一项成功不代表整包保存，数据库又不随Git备份；维护冻结和不互通桌面限制新采用，部分失败必须先回读状态。

<a id="detail-section-8"></a>

### 1.7 工程亮点

> **亮点**：[Q02](#research-q02) 用Host身份、持久proposal与逐项receipt把生成和权威保存分开，相对聊天复制增加可追踪交接；不证明文学质量。

[Q02](#research-q02) 用Host身份、持久proposal与逐项receipt把生成和权威保存分开，相对聊天复制增加可追踪交接；不证明文学质量。

非权威建议与权威事务分离值得复用；移植必须保留Host身份和逐项状态，不能把bundle说成单事务或忽略数据库备份。

<a id="detail-section-9"></a>

### 1.8 主要限制

[Q03](#research-q03) 一项成功不代表整包保存，数据库又不随Git备份；维护冻结和不互通桌面限制新采用，部分失败必须先回读状态。

<a id="detail-section-10"></a>

### 1.9 使用建议

[Q03](#research-q03) 当前观察；已有用户备份含数据库sidecars后才操作，部分失败先回读，不把Git提交或本地form草稿当保存。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已核查V2工具与逐项应用；维护冻结、未运行，逐项接受包是假设。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-ai-novel-writer/README.md、plugins/dsh-ai-novel-writer/package.json、plugins/dsh-ai-novel-writer/src/agent.ts、plugins/dsh-ai-novel-writer/src/novel-store.ts 及固定范围 inventory；组件：plugins/dsh-ai-novel-writer。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：DSH插件独立格式与V2核心工具/存储抽读；不把桌面批量/审稿能力归插件，未运行或验收。
- 下一步：隔离副本注入第二项stale，确认已应用项不回滚和恢复/重试边界，再测试完整数据库备份；未执行。

**分析版本**

- **仓库**：[EthanYoQ/AI-Novel-Writer](https://github.com/EthanYoQ/AI-Novel-Writer)
- **版本号**：0.1.0（[固定提交 62880d6](https://github.com/EthanYoQ/AI-Novel-Writer/tree/62880d629af7bbfaf968c0cda5ae76816e917915)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证假设是用逐项接受包暴露权威revision与重试范围，以部分失败任务比较误判和重复操作；无改善或操作更重即停止。

隔离副本注入第二项stale，确认已应用项不回滚和恢复/重试边界，再测试完整数据库备份；未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

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

[![Issue 未关闭 9](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=grey&logo=github&style=flat)](https://github.com/EthanYoQ/AI-Novel-Writer/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 118](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=118&color=grey&logo=github&style=flat)](https://github.com/EthanYoQ/AI-Novel-Writer/issues?q=is%3Aissue+created%3A2026-09-27T02%3A11%3A17.154Z..2026-10-27T02%3A11%3A17.154Z) [![近30天关闭 127](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=127&color=grey&logo=github&style=flat)](https://github.com/EthanYoQ/AI-Novel-Writer/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T02%3A11%3A17.154Z..2026-10-27T02%3A11%3A17.154Z)



统计日期：2026-10-27。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查冻结小说插件的人工proposal应用与保存恢复边界。

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · 插件与桌面版分别是什么，谁应继续使用？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

固定README明确0.1.0插件preview冻结、无短期功能计划；它为DSH Web提供独立格式的本地小说工作台，不打开桌面项目。适合已有DSH与本地项目、愿逐章审查修改的现有用户；不适合期待桌面版批量创作、自动审稿和.vela互通的新用户。原办法是聊天草稿复制到本地文档，合格交付是用户实际应用并核对后的项目状态；生成文本、编辑器显示和pending proposal都不是已保存。包有严格DSH peer与Node范围，不能用桌面1.3.x版本推断插件维护或兼容。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-ai-novel-writer/README.md:1-5](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/plugins/dsh-ai-novel-writer/README.md#L1-L5)

作者明确冻结和独立项目边界。

```text
# AI Novel Writer for DeepSeek Harness

The `0.1.0` plugin preview is frozen. No short-term feature work is planned. This README supports existing users and maintainers. Development can resume only under a new, explicitly scoped plan.

The plugin adds a local novel workspace to DeepSeek Harness Web. It has its own project format and release. It does not open desktop projects. The desktop app's `1.2.0-Preview` release does not change this plugin's version or maintenance status.
```

**依据 2 · 作者声明**：[plugins/dsh-ai-novel-writer/README.md:35-59](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/plugins/dsh-ai-novel-writer/README.md#L35-L59)

V2逐项审查流程与未保存边界。

<details>
<summary>查看原文（25行）</summary>

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

The local form draft is not authoritative and does not become saved project state after a reload. Applied changes are stored in the project. The inbox retains pending proposals after restart.

If a proposal applies only partly, inspect its status before applying the remaining items. Failed items can be retried, discarded, or regenerated through the workbench. Do not assume that every item was saved because one item succeeded.
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-ai-novel-writer/package.json:1-24](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/plugins/dsh-ai-novel-writer/package.json#L1-L24)

独立包身份和入口。

<details>
<summary>查看原文（24行）</summary>

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
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
```

</details>

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 模型建议与权威状态怎样分开？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

V2只返回read与propose两项工具，propose从Host ToolRunContext读取session/call/argsHash，先解析参数、解析注册workspace，再submitProposal；model参数不决定身份，也没有apply工具。人工workbench调用store apply时逐item BEGIN IMMEDIATE提交，已applied/discarded/superseded跳过，成功保存receipt并COMMIT；遇到stale或失败记录状态并停止后续。因此生成与权威应用的界面是实质机制边界，不只一句提示，但审查者仍须检查内容和每个item状态。V1的native approval写文件是另一条路径，不把它与V2 proposal合并叙述。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-ai-novel-writer/src/agent.ts:499-518](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/plugins/dsh-ai-novel-writer/src/agent.ts#L499-L518)

V2权威读与非权威bundle定义。

<details>
<summary>查看原文（20行）</summary>

```text
 *
 * `novel_read` exposes only the authoritative V2 state projection, while
 * `novel_propose_change` persists a typed non-authoritative bundle. Proposal
 * identity is derived from `ToolRunContext`; model arguments cannot supply the
 * session, call, or args hash.
 *
 * @param config Deployment-specific proposal inbox bounds.
 * @param workspaces Host Workspace registry used to resolve the session cwd.
 * @returns The read tool followed by the persistent proposal tool.
 */
export function createNovelV2ToolDefinitions(
  config: NovelV2Config,
  workspaces: NovelV2WorkspaceRegistry,
): readonly [ToolDefinition, ToolDefinition] {
  const resolved = NovelV2Config(config)
  const options = {
    create: false as const,
    maxProposalBytes: resolved.maxProposalBytes,
    maxPendingProposals: resolved.maxPendingProposals,
  }
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-ai-novel-writer/src/agent.ts:555-588](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/plugins/dsh-ai-novel-writer/src/agent.ts#L555-L588)

Host身份、submitProposal以及只返回read/propose。

<details>
<summary>查看原文（34行）</summary>

```text
  const propose = defineTool({
    name: 'novel_propose_change',
    description: 'Persist one non-authoritative proposal bundle for user review. Changes may contain aggregate replacements or closed artifact version commands, but this tool never writes authoritative project state. Proposal session, call, and canonical args identity are supplied by the Host; only a later user-approved proposal apply can create versions or select a final.',
    parameters: v2ProposeParameters,
    output: {
      schema: { type: 'json' },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
    },
    isConcurrencySafe: () => false,
    async execute(args, exec) {
      parseProposalArgs(args as Record<string, unknown>)
      const sessionId = exec.agent?.session.id
      if (sessionId === undefined) throw new ToolArgsError(['AI novel V2 tools require a session identity'])
      const workspace = await resolveWorkspace(exec)
      const store: NovelStore = await openNovelStore(workspace.path, workspace.id, options)
      try {
        return await store.submitProposal({
          sessionId: String(sessionId),
          callId: String(exec.callId),
          argsHash: novelProposalArgsHash(exec.arguments),
          payload: exec.arguments,
        }, exec.signal) as unknown as JsonValue
      } finally {
        await store.dispose()
      }
    },
    presentCall: args => ({
      card: 'generic',
      title: '提交小说修改建议',
      kind: 'read',
      rawInput: parseProposalArgs(args as Record<string, unknown>),
    }),
  })
  return [read, propose]
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-store.ts:2553-2613](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/plugins/dsh-ai-novel-writer/src/novel-store.ts#L2553-L2613)

逐项事务、receipt与失败状态，不是整包全有全无。

<details>
<summary>查看原文（61行）</summary>

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
        const rebasedCommand = isAggregateProposalChange(command)
          && sharedSnapshotBaseGlobalRevision !== undefined
          && previouslyAppliedAggregateItems > 0
          && this.#currentRevisions(command.aggregate).global === sharedSnapshotBaseGlobalRevision + previouslyAppliedAggregateItems
          ? { ...command, baseGlobalRevision: sharedSnapshotBaseGlobalRevision + previouslyAppliedAggregateItems }
          : command
        const receipt = isAggregateProposalChange(rebasedCommand)
          ? this.#existingChange({
            ...rebasedCommand,
            operation: 'replace',
            provenance: { origin: 'model', sessionId: proposal.session_id, callId: proposal.call_id, argsHash: proposal.args_hash },
          } as NovelChangeSet) ?? this.#commitChangeInTransaction({
            ...rebasedCommand,
            operation: 'replace',
            provenance: { origin: 'model', sessionId: proposal.session_id, callId: proposal.call_id, argsHash: proposal.args_hash },
          } as NovelChangeSet)
          : this.#commitArtifactCommandInTransaction(rebasedCommand)
        const now = new Date().toISOString()
        this.#db.prepare(`UPDATE proposal_items SET status = 'applied', attempt_count = attempt_count + 1,
          failure_code = NULL, receipt = ?, updated_at = ? WHERE item_id = ?`)
          .run(stableJson(receipt), now, item.item_id)
        this.#setProposalStatus(proposalId, now)
        this.#db.exec('COMMIT')
        appliedItemIds.push(item.item_id)
        if (isAggregateProposalChange(command)) previouslyAppliedAggregateItems += 1
      } catch (error) {
        this.#rollback()
        if (error instanceof NovelStoreError && error.code === 'CANCELLED') throw error
        const code: NovelStoreErrorCode = error instanceof NovelStoreError ? error.code : 'WRITE_FAILED'
        const status: NovelProposalItemStatus = code === 'STALE_REVISION' ? 'stale' : 'failed'
        const now = new Date().toISOString()
        this.#db.exec('BEGIN IMMEDIATE')
        try {
          this.#db.prepare(`UPDATE proposal_items SET status = ?, attempt_count = attempt_count + 1,
            failure_code = ?, updated_at = ? WHERE item_id = ?`).run(status, code, now, item.item_id)
          this.#setProposalStatus(proposalId, now)
          this.#db.exec('COMMIT')
```

</details>

#### 缺口

- 未验证真实workbench对部分状态的呈现和应用权限
  **影响**：静态接线不等于完整人工确认不可绕过
  **进一步探讨**：隔离项目注入第二项stale并核对界面、DB及可重试项

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 人工应用的贡献与部分保存、备份风险是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

相对聊天复制文本，稳定身份、proposal inbox与变更receipt让用户可以先看建议再应用，贡献在可追踪的创作交接，不证明文笔、情节或人物一致。最关键限制是bundle按item独立提交，部分成功不会回滚已应用项，用户若看见一项成功就重跑整包可能误判实际状态；必须回读proposal。首次需匹配宿主、装preset、新V2会话与本地工作区，持续需逐章审核、模型费用及数据库备份。README明确novel.db及sidecars被Git忽略，没有项目导出，不支持实时云同步/网络盘或桌面互通；因此Git commit不能当完整备份。冻结维护进一步增加新宿主接入成本，当前建议观察，现有用户先备份再试，不直接迁移唯一稿件。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-store.ts:2565-2606](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/plugins/dsh-ai-novel-writer/src/novel-store.ts#L2565-L2606)

item逐项提交和stale处理限定成功含义。

<details>
<summary>查看原文（42行）</summary>

```text
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
        const rebasedCommand = isAggregateProposalChange(command)
          && sharedSnapshotBaseGlobalRevision !== undefined
          && previouslyAppliedAggregateItems > 0
          && this.#currentRevisions(command.aggregate).global === sharedSnapshotBaseGlobalRevision + previouslyAppliedAggregateItems
          ? { ...command, baseGlobalRevision: sharedSnapshotBaseGlobalRevision + previouslyAppliedAggregateItems }
          : command
        const receipt = isAggregateProposalChange(rebasedCommand)
          ? this.#existingChange({
            ...rebasedCommand,
            operation: 'replace',
            provenance: { origin: 'model', sessionId: proposal.session_id, callId: proposal.call_id, argsHash: proposal.args_hash },
          } as NovelChangeSet) ?? this.#commitChangeInTransaction({
            ...rebasedCommand,
            operation: 'replace',
            provenance: { origin: 'model', sessionId: proposal.session_id, callId: proposal.call_id, argsHash: proposal.args_hash },
          } as NovelChangeSet)
          : this.#commitArtifactCommandInTransaction(rebasedCommand)
        const now = new Date().toISOString()
        this.#db.prepare(`UPDATE proposal_items SET status = 'applied', attempt_count = attempt_count + 1,
          failure_code = NULL, receipt = ?, updated_at = ? WHERE item_id = ?`)
          .run(stableJson(receipt), now, item.item_id)
        this.#setProposalStatus(proposalId, now)
        this.#db.exec('COMMIT')
        appliedItemIds.push(item.item_id)
        if (isAggregateProposalChange(command)) previouslyAppliedAggregateItems += 1
      } catch (error) {
        this.#rollback()
        if (error instanceof NovelStoreError && error.code === 'CANCELLED') throw error
        const code: NovelStoreErrorCode = error instanceof NovelStoreError ? error.code : 'WRITE_FAILED'
        const status: NovelProposalItemStatus = code === 'STALE_REVISION' ? 'stale' : 'failed'
```

</details>

**依据 2 · 作者声明**：[plugins/dsh-ai-novel-writer/README.md:73-89](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/plugins/dsh-ai-novel-writer/README.md#L73-L89)

数据库位置、Git忽略、无导出和本地限制。

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

**依据 3 · 作者声明**：[plugins/dsh-ai-novel-writer/README.md:1-5](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/plugins/dsh-ai-novel-writer/README.md#L1-L5)

冻结状态影响维护成本。

```text
# AI Novel Writer for DeepSeek Harness

The `0.1.0` plugin preview is frozen. No short-term feature work is planned. This README supports existing users and maintainers. Development can resume only under a new, explicitly scoped plan.

The plugin adds a local novel workspace to DeepSeek Harness Web. It has its own project format and release. It does not open desktop projects. The desktop app's `1.2.0-Preview` release does not change this plugin's version or maintenance status.
```

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · 逐项接受包能否减少全保存误判？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是在应用结果中明确显示本次applied、stale、failed与权威revision，并在重试前呈现差异，只允许重试未应用项，能减少把一条成功当整包成功的错误。推导来自Q02逐item事务与Q03备份/状态风险，增量在读者理解与恢复责任，不能重新定义事务为全有全无。最小验证五个含部分失败的proposal任务，让现有用户分别读原界面与接受包，统计错误重复应用、状态判断和分钟；无误判减少或操作负担更大即停止。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-store.ts:2553-2573](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/plugins/dsh-ai-novel-writer/src/novel-store.ts#L2553-L2573)

appliedItemIds与stoppedItemId是接受包的现有数据基础。

<details>
<summary>查看原文（21行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-ai-novel-writer/src/novel-store.ts:2595-2613](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/plugins/dsh-ai-novel-writer/src/novel-store.ts#L2595-L2613)

receipt和失败码可支撑具体状态说明。

<details>
<summary>查看原文（19行）</summary>

```text
        this.#db.prepare(`UPDATE proposal_items SET status = 'applied', attempt_count = attempt_count + 1,
          failure_code = NULL, receipt = ?, updated_at = ? WHERE item_id = ?`)
          .run(stableJson(receipt), now, item.item_id)
        this.#setProposalStatus(proposalId, now)
        this.#db.exec('COMMIT')
        appliedItemIds.push(item.item_id)
        if (isAggregateProposalChange(command)) previouslyAppliedAggregateItems += 1
      } catch (error) {
        this.#rollback()
        if (error instanceof NovelStoreError && error.code === 'CANCELLED') throw error
        const code: NovelStoreErrorCode = error instanceof NovelStoreError ? error.code : 'WRITE_FAILED'
        const status: NovelProposalItemStatus = code === 'STALE_REVISION' ? 'stale' : 'failed'
        const now = new Date().toISOString()
        this.#db.exec('BEGIN IMMEDIATE')
        try {
          this.#db.prepare(`UPDATE proposal_items SET status = ?, attempt_count = attempt_count + 1,
            failure_code = ?, updated_at = ? WHERE item_id = ?`).run(status, code, now, item.item_id)
          this.#setProposalStatus(proposalId, now)
          this.#db.exec('COMMIT')
```

</details>

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
