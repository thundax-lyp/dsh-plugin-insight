# dsh-undo rollback bundle

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[bc8edbe](https://github.com/23swccp/dsh-undo/tree/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback)

<!-- BEGIN META -->
[![npm 30d 1,186](https://img.shields.io/static/v1?label=npm+30d&message=1%2C186&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-undo-plugin) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-undo-plugin)
<!-- END META -->

> **功能**：以DSH配置组合消息级文件回退、会话分叉和归档界面，私有Git与对话历史协同恢复但不撤销外部副作用。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 声明组合减少文件与消息目标手工对齐；私有索引、actual-tree校验和会话切分贡献归内部包，不能将组合当新快照算法。

> **主要限制**：[Q03](#research-q03) 补偿失败仍可成功写ready，启动默认跳过实际状态核对；[Q04](#research-q04) 当前来源身份未知且归档接管/退出未验，不能把回退回执当全部副作用撤销。

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
  - [Q01 · 组合入口比手工恢复文件与聊天增加什么？](#detail-section-11)
  - [Q02 · 私有文件树、子会话与归档怎样组成操作？](#detail-section-12)
  - [Q03 · 补偿失败后是否仍保留强制恢复阶段？](#detail-section-13)
  - [Q04 · 身份未知与失败窗口下值得怎样采用？](#detail-section-14)
  - [Q05 · 恢复收据怎样在已有journal之上形成可验证增量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH编程用户需要同时回退消息点的本地文件与模型上下文，单文件Git恢复或删聊天不对齐两者。

手工Git恢复并新建对话、归档原聊天；bundle集中入口，内部包实现算法，远端写入/数据库副作用不在范围。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 消息级回退组合 | 同时回本地树和模型历史 | 七包，非外部副作用撤销 |
| 私有Git | 不动用户索引的树恢复 | 支持Git库及容量，其他写者有风险 |
| 归档接管 | 源会话隐藏与恢复 | 禁原生服务，退出需核 |
| journal恢复 | 部分中间态实际核对 | catch降ready缺陷影响继续安全 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH rc.6+作者条件/七包 | 必需 | 分叉、归档、回退及客户端 | 实际包解析/宿主未验 |
| web-app | 浏览器按需 | 回退按钮和设置 | headless去客户端行 |
| Git非bare无submodule | 回退必需 | 私有树 | 拒绝不支持目录 |
| 私有目录权限/容量 | 必需 | 树、journal | 失败需停写核实际态 |
| 独立备份/独占写入 | 采用前提 | 防竞态与保留恢复路 | 不用于唯一数据保障 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 核来源 | 确认仓库ID/包字节/宿主 | 当前未知不能跳过 |
| 副本 | 一次性Git库和虚构会话 | 独立备份可回读 |
| 故障矩阵 | 注入fork/restore/archive/补偿失败 | 实际树/会话/归档一致，非只ready |
| 失败 | 停写保留私有树与日志 | 核状态后人工恢复 |
| 退出 | 备份后移patch核原生归档 | 不直接删唯一恢复材料 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主七包与备份磁盘 | 版本/归档所有权核对 | 来源当前未知 |
| 持续 | 私有对象/journal/分叉历史 | 文件对话及范围外效果复核 | 容量/重做模型费未知 |
| 失败恢复 | 备份/树/日志保留 | 停写核文件会话归档 | 补偿失败人工量未测 |
| 退出 | 恢复材料占用 | 原生归档接管核验 | 未验自动清理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 消息级回退 | 文件树/消息前缀/归档组合 | 故障与竞态无损性 |
| 撤回保护 | workspace-diverged拒绝 | 跨平台实际损失避免 |
| 恢复可见性 | 部分阶段actual校验 | ready降级后状态安全 |
| 安装组合 | 七包patch与归档接管 | 当前身份/发布字节/宿主兼容 |

> **思考**：[Q03](#research-q03) 补偿失败仍可成功写ready，启动默认跳过实际状态核对；[Q04](#research-q04) 当前来源身份未知且归档接管/退出未验，不能把回退回执当全部副作用撤销。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 声明组合减少文件与消息目标手工对齐；私有索引、actual-tree校验和会话切分贡献归内部包，不能将组合当新快照算法。

[Q02](#research-q02) 私有索引和actual-tree复核可迁移；[Q03](#research-q03) 补偿错误不能抹掉恢复义务，组合不是原子事务；[Q01](#research-q01) 归档所有权切换是部署/退出成本。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 补偿失败仍可成功写ready，启动默认跳过实际状态核对；[Q04](#research-q04) 当前来源身份未知且归档接管/退出未验，不能把回退回执当全部副作用撤销。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先观察；来源、宿主与故障矩阵在一次性副本核实并修复恢复阶段后再决定试用，不把本地树回退当外部副作用撤销或唯一安全保障。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

对固定缓存源码重新核查全部旧findings并沿内部依赖复核；未运行目标，当前仓库身份/默认分支仍未知，补偿缺陷未故障复现。

- 已检查：作者 README、包清单、源码路径 packages/bundle-rollback/README.md、packages/bundle-rollback/cordis.patch.yml、packages/bundle-rollback/package.json、packages/rollback-undo/src/index.ts、packages/rollback-undo/src/shadow-git.ts 及固定范围 inventory；组件：packages/bundle-rollback。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：bundle统计只覆盖自身；定向复核同提交undo/shadow-git及fork/archive接线，不表示全仓审计，来源扫描失败边界保留。
- 下一步：[Q05](#research-q05) 核故障矩阵、实际状态与错误继续，修复前不以ready为安全证明；另外核来源身份、发布字节和卸载归档恢复。

**分析版本**

- **仓库**：[23swccp/dsh-undo](https://github.com/23swccp/dsh-undo)
- **版本号**：0.1.0-rc.8（[固定提交 bc8edbe](https://github.com/23swccp/dsh-undo/tree/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 待验证的是不可降级恢复阶段与实际树/会话/归档核对收据，参照已有recoverRestoring减少错误继续而非再造journal。

[Q05](#research-q05) 核故障矩阵、实际状态与错误继续，修复前不以ready为安全证明；另外核来源身份、发布字节和卸载归档恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 22 | — | — | 163 |
| .ts | source | 1 | 4 | 2 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/23swccp/dsh-undo/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：文件与会话组合回退是否在失败后保留安全恢复条件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 组合入口比手工恢复文件与聊天增加什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

bundle面向希望在消息点同时恢复本地工作区并让模型从回退前对话继续的DSH编程用户。单做Git restore不改变模型历史，单删聊天不还原文件；组合以私有树、切分会话与源会话归档减少手工对齐。实际package仅发布cordis.patch.yml并依赖七包，patch配置三个后端及四个浏览器包，算法归rollback-undo/fork/archive，不是bundle发明新的快照机制。

patch还禁用原生ui-settings-archive及session-archive，让本包接管同名归档服务，不是只添加一个按钮。浏览器四包需要web-app，headless作者允许去掉。固定package声明0.1.0-rc.8/MIT；当前源码可读和包内repository声明不证明当前GitHub身份/默认分支可用，亦不证明npm发布字节与固定提交相同。对外写入、数据库或已经发送的消息不在本地树与会话回退范围。

#### 证据与依据

**依据 1 · 作者声明**：[packages/bundle-rollback/README.md:3-18](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/README.md#L3-L18)

作者回退目标和宿主条件。

<details>
<summary>查看原文（16行）</summary>

````text
Conversation undo/rollback plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`).

- **Message-level rollback** — the enter-key icon under a sent prompt, the session-header rollback button, the `/undo` command, or the composer strip: restores the file tree from a plugin-private Shadow Git snapshot (never touches your `.git`) and forks the conversation, so the model never sees the reverted prompt, reply, or tool calls
- **`/undo` node axis** — exact `/undo` opens a lineage timeline: choose a rollback point or hand the selected turn to dsh's native Trajectory view, where the full selected turn is marked
- **Archive tasks** — list, restore, and hide archived sessions from Settings
- **Tool cards** — per-tool colored cards and the reasoning-and-actions fold in the dsh web conversation trail

## Install

```sh
dsh plugin --profile web add dsh-undo-plugin
```

Requires `dsh` 0.1.0-rc.6 or newer. Restart `dsh web` after installing.

Full documentation: [中文](https://github.com/23swccp/dsh-undo#readme) | [English](https://github.com/23swccp/dsh-undo/blob/HEAD/README.en.md)
````

</details>

**依据 2 · 源码核查**：[packages/bundle-rollback/package.json:1-39](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/package.json#L1-L39)

固定发布单元、版本和七依赖。

<details>
<summary>查看原文（39行）</summary>

```text
{
  "name": "dsh-undo-plugin",
  "description": "dsh plugin: conversation undo/rollback and archive tasks for DeepSeek Harness",
  "version": "0.1.0-rc.8",
  "type": "module",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/23swccp/dsh-undo.git",
    "directory": "packages/bundle-rollback"
  },
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "plugin",
    "undo",
    "rollback",
    "session"
  ],
  "files": ["cordis.patch.yml"],
  "license": "MIT",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
    "@dsh-undo/client-rollback-button": "^0.1.0-rc.8",
    "@dsh-undo/client-rollback-settings": "^0.1.0-rc.8",
    "@dsh-undo/client-rollback-toolcards": "^0.1.0-rc.8",
    "@dsh-undo/client-rollback-trailfold": "^0.1.0-rc.8",
    "@dsh-undo/rollback-archive": "^0.1.0-rc.8",
    "@dsh-undo/rollback-fork": "^0.1.0-rc.8",
    "@dsh-undo/rollback-undo": "^0.1.0-rc.8"
  }
}
```

</details>

**依据 3 · 源码核查**：[packages/bundle-rollback/cordis.patch.yml:1-44](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/cordis.patch.yml#L1-L44)

实际组合与原生归档禁用。

<details>
<summary>查看原文（44行）</summary>

```text
# The dsh-undo-plugin bundle patch: conversation rollback + archive tasks
# as installable plugin rows. Applied after the target profile's base bundle;
# rows here insert new plugin entries. `dshHomePath` is the host-side
# expression the dsh boot injects for application-data roots.
#
# Headless profiles may drop the four `client-rollback-*` rows (they require
# the dsh-web-app browser surface).
- insert:
    - id: rollback-fork
      name: '@dsh-undo/rollback-fork'

    - id: rollback-archive
      name: '@dsh-undo/rollback-archive'
      config:
        root: !!js dshHomePath('rollback-archive')

    - id: rollback-undo
      name: '@dsh-undo/rollback-undo'
      config:
        root: !!js dshHomePath('rollback-undo')

    - id: client-rollback-button
      name: '@dsh-undo/client-rollback-button'

    - id: client-rollback-settings
      name: '@dsh-undo/client-rollback-settings'

    - id: client-rollback-toolcards
      name: '@dsh-undo/client-rollback-toolcards'

    - id: client-rollback-trailfold
      name: '@dsh-undo/client-rollback-trailfold'

# The base web-app bundle also ships ui-settings-archive and session-archive,
# whose sessionArchive Remote contributions claim the namespace first and block
# this bundle's tombstone/untombstone/restore/delete endpoints from mounting
# client-side. Disable both so the rollback archive surface owns the namespace.
- id: ui-settings-archive
  name: '@deepseek-ai/dsh-client-ui-settings-archive'
  disabled: true

- id: session-archive
  name: '@deepseek-ai/dsh-session-archive'
  disabled: true
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 私有文件树、子会话与归档怎样组成操作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

undo先要求最新消息及armed/ready状态、同工作区不在回退，并quiesce源Agent及后代。写restoring journal含redoTree和预定子会话ID后并行启动fork与文件恢复；fork按before-user-message切掉选中用户消息及之后历史，恢复用私有Git索引树，不改用户.git索引。成功后归档源、向子发布前驱点，持久complete才返回子会话。

ShadowGit用专有GIT_DIR/GIT_INDEX_FILE配合工作树，恢复差异中仅删from有而target无的捕获路径，再read-tree/checkout改变路径，拒绝bare/submodule工作区。撤销回退前verifyMatches目标树，否则workspace-diverged，保护用户后续修改。这些保护是具体贡献，但不是与会话归档共同原子事务，其他写者/范围外副作用不能靠私有Git解决。

启动restoring恢复会检查源/子归档归属、子存在和实际树；匹配才complete或ready，否则recovery-required。这比仅信journal标签强，可借鉴实际状态复核，仍须同时检查失败路径是否保住该阶段。

#### 证据与依据

**依据 1 · 源码核查**：[packages/rollback-undo/src/index.ts:675-706](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L675-L706)

准入、quiesce和工作区排它。

<details>
<summary>查看原文（32行）</summary>

```text
      if (journal.messageId !== request.userMessageId) {
        return this.failure('not-latest-message', '只能回滚最近一条已完成消息。')
      }
      if (journal.phase !== 'armed' && journal.phase !== 'ready') {
        return this.failure('undo-not-ready', '该消息尚未完成，暂时不能回滚。')
      }
      const workspace = journal.workspace
      if (this.rollbackWorkspaces.has(workspace)) {
        return this.failure('rollback-in-progress', '该工作区正在回滚。')
      }
      this.rollbackWorkspaces.add(workspace)
      const replayPromptOnRevoke = journal.phase === 'armed'
      const recoverable = { ...journal, phase: 'ready' as const }
      try {
        await this.writeJournal({ ...journal, phase: 'quiescing' })
        const source = this.ctx.agents.get(journal.sourceSessionId)
        const retainedAgentOptions = source?.options
        if (source !== undefined && (source.status !== 'idle' || this.hasRunningDescendant(source))) {
          try {
            await this.quiesce(source)
          } catch (error) {
            await this.writeJournal(recoverable)
            return this.failure('session-busy', error instanceof Error ? error.message : String(error))
          }
        }
        // Historical points stay ready so a rollback child can inherit them.
        // Resume this transaction by its immutable generation, not by the
        // generic "current" lookup (which would otherwise select its parent).
        journal = await this.findJournalByGeneration(journal.logicalConversationId, journal.generation)
        if (journal === undefined || journal.phase !== 'quiescing') {
          return this.failure('undo-not-ready', '会话尚未静止，暂时不能回滚。')
        }
```

</details>

**依据 2 · 源码核查**：[packages/rollback-undo/src/index.ts:715-773](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L715-L773)

restoring、并行fork/restore与归档发布。

<details>
<summary>查看原文（59行）</summary>

```text
        let child: AgentHandle | undefined
        try {
          const rollbackSessionId = `conversation-undo-${randomUUID()}` as SessionId
          const restoring: ConversationUndoJournal = {
            ...journal,
            rollbackSessionId,
            redoTree,
            ...replayPromptOnRevoke ? { replayPromptOnRevoke: true } : {},
            phase: 'restoring',
          }
          await this.writeJournal(restoring)
          // The fork reads only session persistence while the restore touches
          // only workspace files, so the two run concurrently. The restoring
          // journal above is already durable, so a crash mid-flight lands in
          // the same recovery state the sequential order produced.
          const forkTask = this.ctx.sessionFork.fork({
            sourceSessionId: journal.sourceSessionId,
            childSessionId: rollbackSessionId,
            cut: { kind: 'before-user-message', messageId: journal.messageId },
            ...retainedAgentOptions === undefined ? {} : { retainedAgentOptions },
          })
          const restoreTask = shadow.restore(journal.beforeTree, redoTree)
          try {
            child = (await forkTask).handle
            await restoreTask
          } catch (error) {
            if (child === undefined) {
              // The fork failed while the restore may have started moving
              // files: settle it and put the worktree back on the redo tree
              // before the generic recovery rewrites the journal.
              await restoreTask.catch(() => {})
              try {
                await shadow.restore(redoTree, journal.beforeTree)
              } catch (compensateError) {
                throw new AggregateError([error, compensateError], 'rollback undo could not recover the failed fork')
              }
            }
            throw error
          }
          try {
            await this.ctx.sessionArchive.archive(journal.sourceSessionId)
          } catch (error) {
            // The source stays unarchived; compensate the file state only.
            // The outer catch disposes the child and rewrites the recoverable
            // journal, so startup recovery re-evaluates the transaction.
            try {
              await shadow.restore(redoTree, journal.beforeTree)
            } catch (restoreError) {
              throw new AggregateError([error, restoreError], 'rollback undo could not recover the failed archive step')
            }
            throw error
          }
          // Carry the preceding message point into the freshly forked child.
          // The completed journal above remains the revocable edge; the child
          // receives a new active record that points at the same private tree.
          // This is what makes rollback #2, #3, ... available without another
          // model admission.
          await this.publishPredecessorToChild(journal, child.agent.id)
          await this.writeJournal({ ...restoring, phase: 'complete' })
```

</details>

**依据 3 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:22-39](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L22-L39)

私有索引环境。

<details>
<summary>查看原文（18行）</summary>

```text
/** Execute Git with the journal-owned directory and index, never the user's index. */async function git(
  workspace: string,
  shadowGit: string,
  args: readonly string[],
  options: { readonly shadow?: boolean } = {},
): Promise<string> {
  return await new Promise<string>((resolveResult, reject) => {
    const child = spawn('git', [...args], {
      cwd: workspace,
      windowsHide: true,
      env: options.shadow === false
        ? process.env
        : {
            ...process.env,
            GIT_DIR: shadowGit,
            GIT_WORK_TREE: workspace,
            GIT_INDEX_FILE: `${shadowGit}/index`,
          },
```

</details>

**依据 4 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:67-91](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L67-L91)

工作区限制。

<details>
<summary>查看原文（25行）</summary>

```text
/** Reject non-worktree paths before an operation can restore files.
 * @param workspace - Candidate worktree root.
 * @returns Resolution only for a supported non-bare, submodule-free worktree.
 */
export async function assertSupportedWorkspace(workspace: string): Promise<void> {
  const result = await new Promise<string>((resolveResult, reject) => {
    const child = spawn('git', ['rev-parse', '--is-inside-work-tree', '--is-bare-repository'], {
      cwd: workspace,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    const out: Buffer[] = []
    child.stdout.on('data', (chunk: Buffer) => { out.push(chunk) })
    child.once('error', reject)
    child.once('exit', code => code === 0
      ? resolveResult(Buffer.concat(out).toString('utf8').trim())
      : reject(new Error(`conversation-undo: '${workspace}' is not a Git worktree`)))
  })
  if (result !== 'true\nfalse') {
    throw new Error(`conversation-undo: '${workspace}' is not a normal Git worktree`)
  }
  const entries = await git(workspace, '', ['ls-files', '--stage'], { shadow: false })
  if (entries.split('\n').some(entry => entry.startsWith('160000 '))) {
    throw new Error(`conversation-undo: '${workspace}' contains submodules`)
  }
```

</details>

**依据 5 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:110-144](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L110-L144)

捕获路径差异恢复。

<details>
<summary>查看原文（35行）</summary>

```text
  /** Restore an exact tree, deleting only paths captured in `from` but absent from `target`.
   * @param target - Private tree to materialize.
   * @param from - Prior private tree defining removable captured paths.
   */
  async restore(target: ConversationUndoTree, from: ConversationUndoTree): Promise<void> {
    await this.ensure()
    // One name-status diff names every changed path and its direction: 'D'
    // marks paths the target no longer carries (removed from the worktree),
    // every other status (A/M/T) marks paths present in the target. With
    // --no-renames each entry is a single path, so the -z stream is a flat
    // status/path pair list and no separate full-target tree listing is
    // needed to decide removal versus materialization.
    const changed = await git(this.workspace, this.shadowGit, [
      'diff-tree', '-r', '-z', '--no-renames', '--no-commit-id', '--name-status', String(from), String(target),
    ])
    const tokens = changed.split('\0')
    const deletions: string[] = []
    const updates: string[] = []
    for (let i = 0; i + 1 < tokens.length; i += 2) {
      const status = tokens[i]
      const path = tokens[i + 1]
      if (status === undefined || path === undefined || path === '') continue
      if (status === 'D') deletions.push(path)
      else updates.push(path)
    }
    for (const path of deletions) {
      await this.removeCapturedPath(path)
    }
    await git(this.workspace, this.shadowGit, ['read-tree', String(target)])
    // Materialize only the changed paths instead of the whole worktree:
    // checkout-index --all rewrites every tracked file, which dominates the
    // restore cost on large workspaces. Fall back to the full checkout when
    // the change set would exceed the Windows command-line length limit.
    if (updates.length === 0) return
    await git(this.workspace, this.shadowGit, updates.length > MAX_RESTORE_PATHS
```

</details>

**依据 6 · 源码核查**：[packages/rollback-undo/src/index.ts:537-550](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L537-L550)

撤回前实际树保护。

<details>
<summary>查看原文（14行）</summary>

```text
          }
        }
        try {
          await this.assertWorkspace(workspace)
        } catch (error) {
          return this.failure('workspace-unsupported', error instanceof Error ? error.message : String(error))
        }
        const shadow = new ShadowGit(workspace, this.shadowDirectory(journal))
        await this.statWarmers.get(this.shadowDirectory(journal))
        const rollbackTree = rollbackTargetTree(journal)
        if (!await shadow.verifyMatches(rollbackTree)) {
          return this.failure('workspace-diverged', '回滚后工作区文件已被修改，无法安全撤回回滚。')
        }
        const redoTree = journal.redoTree
```

</details>

**依据 7 · 源码核查**：[packages/rollback-undo/src/index.ts:973-1000](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L973-L1000)

启动actual状态校验。

<details>
<summary>查看原文（28行）</summary>

```text
  private async recoverRestoring(journal: ConversationUndoJournal): Promise<void> {
    if (journal.rollbackSessionId === undefined || journal.redoTree === undefined) {
      await this.requireRecovery(journal, 'manifest has no rollback Session or redo tree')
      return
    }
    try {
      await this.assertWorkspace(journal.workspace)
      const shadow = new ShadowGit(journal.workspace, this.shadowDirectory(journal))
      const sourceArchived = this.ctx.workspaceRegistry.archivedSessionIds.includes(journal.sourceSessionId)
      const rollbackArchived = this.ctx.workspaceRegistry.archivedSessionIds.includes(journal.rollbackSessionId ?? ('' as SessionId))
      const rollbackExists = await this.sessionExists(journal.rollbackSessionId ?? ('' as SessionId))
      if (sourceArchived && !rollbackArchived && rollbackExists && await shadow.verifyMatches(rollbackTargetTree(journal))) {
        await this.publishRetainedLayerToChild(journal, journal.rollbackSessionId)
        await this.writeJournal({ ...journal, phase: 'complete' })
        return
      }
      if (!sourceArchived && await shadow.verifyMatches(journal.redoTree ?? journal.beforeTree)) {
        if (rollbackExists) await this.hideUnpublishedChild(journal.rollbackSessionId ?? ('' as SessionId))
        await this.writeJournal({ ...journal, phase: 'ready' })
        return
      }
      await this.requireRecovery(journal, 'archive membership or private Shadow Git tree does not describe a safe publication state')
    } catch (error) {
      await this.requireRecovery(journal, error instanceof Error ? error.message : String(error))
    }
  }

  /** Determine whether a rollback child is present in either live or durable session ownership. */
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 补偿失败后是否仍保留强制恢复阶段？

**研究主题**：缺陷与关键质疑

#### 完整回答

没有在所有已读分支保住。recoverable在副作用前被定义为旧journal加phase:ready；fork失败且文件restore已开始时，会等restore结算再尝试恢复redoTree，补偿失败抛AggregateError。归档失败也尝试恢复redoTree，失败同样抛；外层catch无论是否含补偿错误，均尝试写recoverable并抛错，child.dispose失败仅加入错误列表。

若补偿失败而随后writeJournal成功，持久相位成为ready，不是restoring/recovery-required。启动恢复switch只对restoring/revoking等做实际状态校验，ready默认跳过，故可能将残余文件/会话状态排除在该次启动强制复核之外。此为固定控制流确认的错误风险，不声称已故障复现或每次必然损坏；具体取决于文件补偿/归档/child失败和写journal成功的组合。

已有recoverRestoring与verifyMatches不能反驳此绕过，因为它们依赖保留相应阶段。用户看见回退报错后应停写、核实际树与会话/归档，而不是把ready当安全继续或聊天消失当全部副作用撤回。

#### 证据与依据

**依据 1 · 源码核查**：[packages/rollback-undo/src/index.ts:684-690](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L684-L690)

recoverable预设ready。

```text
      }
      this.rollbackWorkspaces.add(workspace)
      const replayPromptOnRevoke = journal.phase === 'armed'
      const recoverable = { ...journal, phase: 'ready' as const }
      try {
        await this.writeJournal({ ...journal, phase: 'quiescing' })
        const source = this.ctx.agents.get(journal.sourceSessionId)
```

**依据 2 · 源码核查**：[packages/rollback-undo/src/index.ts:738-764](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L738-L764)

两类补偿失败AggregateError。

<details>
<summary>查看原文（27行）</summary>

```text
            child = (await forkTask).handle
            await restoreTask
          } catch (error) {
            if (child === undefined) {
              // The fork failed while the restore may have started moving
              // files: settle it and put the worktree back on the redo tree
              // before the generic recovery rewrites the journal.
              await restoreTask.catch(() => {})
              try {
                await shadow.restore(redoTree, journal.beforeTree)
              } catch (compensateError) {
                throw new AggregateError([error, compensateError], 'rollback undo could not recover the failed fork')
              }
            }
            throw error
          }
          try {
            await this.ctx.sessionArchive.archive(journal.sourceSessionId)
          } catch (error) {
            // The source stays unarchived; compensate the file state only.
            // The outer catch disposes the child and rewrites the recoverable
            // journal, so startup recovery re-evaluates the transaction.
            try {
              await shadow.restore(redoTree, journal.beforeTree)
            } catch (restoreError) {
              throw new AggregateError([error, restoreError], 'rollback undo could not recover the failed archive step')
            }
```

</details>

**依据 3 · 源码核查**：[packages/rollback-undo/src/index.ts:803-820](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L803-L820)

外catch仍写ready recoverable。

<details>
<summary>查看原文（18行）</summary>

```text
        } catch (error) {
          const recoveries: unknown[] = [error]
          if (child !== undefined) {
            try {
              await child.dispose()
            } catch (disposeError) {
              recoveries.push(disposeError)
            }
          }
          try {
            await this.writeJournal(recoverable)
          } catch (journalError) {
            recoveries.push(journalError)
          }
          throw recoveries.length === 1
            ? error
            : new AggregateError(recoveries, 'rollback undo could not recover the failed rollback')
        }
```

</details>

**依据 4 · 源码核查**：[packages/rollback-undo/src/index.ts:925-949](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L925-L949)

启动对ready默认不检查。

<details>
<summary>查看原文（25行）</summary>

```text
  /** Recover or surface every durable operation interrupted before Host shutdown. */
  private async recoverJournals(): Promise<void> {
    for (const journal of await this.readJournals()) {
      if (journal.sourceTombstoned === true) continue
      if (journal.sourceTombstonePending === true) {
        await this.recoverDeferredCleanup(journal)
        continue
      }
      switch (journal.phase) {
        case 'cleanup-pending':
          await this.recoverDeferredCleanup(journal)
          break
        case 'quiescing':
          await this.writeJournal({ ...journal, phase: 'ready' })
          this.ctx.logger.warn(`rollback undo: reset interrupted pre-publication rollback for "${journal.sourceSessionId}"`)
          break
        case 'restoring':
          await this.recoverRestoring(journal)
          break
        case 'revoking':
          await this.recoverRevoking(journal)
          break
        default:
          break
      }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 身份未知与失败窗口下值得怎样采用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

建议观察，不在唯一工作目录或有外部副作用任务上依赖它安全撤销。来源扫描本轮报告repository identity/default branch unavailable；固定checkout HEAD、origin与包repository指向队列给定版本，能支持对此源码的机制判断，但不是当前仓库身份与最新版本的独立验证。不能把上轮相同代码的报告直接当新观察，亦不能因可读缓存升级availability。

首次有DSH服务、七包及浏览器依赖、Git与私有目录准备；持续有私有对象/journal/分叉会话磁盘与对齐检查，回退会丢弃模型可见历史但未逆转外部效果。失败补偿需用户停止写入、保留树和日志，从独立备份核工作区及归档归属；时间/容量/重做模型费用未知。退出要备份恢复材料后移除patch并核原生归档重新接管，不假定卸载会清对象或恢复所有被归档会话。

若做后续验证，应在一次性仓库与虚构会话注入fork、restore、archive和补偿失败，验实际文件/会话而非ready；先修保留恢复阶段与确认来源/宿主，再判断小范围试用，不能把验证建议当已成功。

#### 证据与依据

**依据 1 · 源码核查**：[packages/bundle-rollback/package.json:8-13](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/package.json#L8-L13)

包内来源与组件路径，只证明自述。

```text
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/23swccp/dsh-undo.git",
    "directory": "packages/bundle-rollback"
  },
```

**依据 2 · 源码核查**：[packages/bundle-rollback/cordis.patch.yml:34-44](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/cordis.patch.yml#L34-L44)

原生归档所有权变更，退出需核。

<details>
<summary>查看原文（11行）</summary>

```text
# The base web-app bundle also ships ui-settings-archive and session-archive,
# whose sessionArchive Remote contributions claim the namespace first and block
# this bundle's tombstone/untombstone/restore/delete endpoints from mounting
# client-side. Disable both so the rollback archive surface owns the namespace.
- id: ui-settings-archive
  name: '@deepseek-ai/dsh-client-ui-settings-archive'
  disabled: true

- id: session-archive
  name: '@deepseek-ai/dsh-session-archive'
  disabled: true
```

</details>

**依据 3 · 源码核查**：[packages/rollback-undo/src/index.ts:803-820](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L803-L820)

恢复人工负担的具体来源。

<details>
<summary>查看原文（18行）</summary>

```text
        } catch (error) {
          const recoveries: unknown[] = [error]
          if (child !== undefined) {
            try {
              await child.dispose()
            } catch (disposeError) {
              recoveries.push(disposeError)
            }
          }
          try {
            await this.writeJournal(recoverable)
          } catch (journalError) {
            recoveries.push(journalError)
          }
          throw recoveries.length === 1
            ? error
            : new AggregateError(recoveries, 'rollback undo could not recover the failed rollback')
        }
```

</details>

#### 缺口

- 本轮源扫描当前身份/默认分支未知且未核发布字节
  **影响**：不能证明最新可安装版本/维护状态
  **进一步探讨**：父流程补核仓库ID、默认分支与包产物；保留固定缓存分析边界。
- 未执行宿主及故障矩阵/退出恢复
  **影响**：不能证明无损回退和全周期成本
  **进一步探讨**：一次性副本验七包解析、故障后树/会话与归档接管，记录人工及存储。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 恢复收据怎样在已有journal之上形成可验证增量？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是在副作用后失败时保留不可降级的恢复要求，并展示实际文件树、源/子会话和归档归属核对收据，只有显式完成检查才允许继续。不是从零加journal：已有restoring实际状态验证与recovery-required；增量是避免外catch抹掉需复核阶段，并让用户知道还未对齐什么。

对照当前控制流，在隔离材料让fork/restore/archive和补偿各自失败，尤其补偿失败但journal可写的组合；测重启后能否拦错误继续、真实状态是否被识别、修复工作量与等待成本。若已有路径能保同样不变量、收据自身漂移或只增加阻塞不降低误继续，则否定该设计扩展。未运行此实验，不把新状态机制计入当前bundle贡献。

#### 证据与依据

**依据 1 · 源码核查**：[packages/rollback-undo/src/index.ts:803-820](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L803-L820)

实际阶段降级线索。

<details>
<summary>查看原文（18行）</summary>

```text
        } catch (error) {
          const recoveries: unknown[] = [error]
          if (child !== undefined) {
            try {
              await child.dispose()
            } catch (disposeError) {
              recoveries.push(disposeError)
            }
          }
          try {
            await this.writeJournal(recoverable)
          } catch (journalError) {
            recoveries.push(journalError)
          }
          throw recoveries.length === 1
            ? error
            : new AggregateError(recoveries, 'rollback undo could not recover the failed rollback')
        }
```

</details>

**依据 2 · 源码核查**：[packages/rollback-undo/src/index.ts:973-1000](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L973-L1000)

已有独立校验构成参照，不重复发明。

<details>
<summary>查看原文（28行）</summary>

```text
  private async recoverRestoring(journal: ConversationUndoJournal): Promise<void> {
    if (journal.rollbackSessionId === undefined || journal.redoTree === undefined) {
      await this.requireRecovery(journal, 'manifest has no rollback Session or redo tree')
      return
    }
    try {
      await this.assertWorkspace(journal.workspace)
      const shadow = new ShadowGit(journal.workspace, this.shadowDirectory(journal))
      const sourceArchived = this.ctx.workspaceRegistry.archivedSessionIds.includes(journal.sourceSessionId)
      const rollbackArchived = this.ctx.workspaceRegistry.archivedSessionIds.includes(journal.rollbackSessionId ?? ('' as SessionId))
      const rollbackExists = await this.sessionExists(journal.rollbackSessionId ?? ('' as SessionId))
      if (sourceArchived && !rollbackArchived && rollbackExists && await shadow.verifyMatches(rollbackTargetTree(journal))) {
        await this.publishRetainedLayerToChild(journal, journal.rollbackSessionId)
        await this.writeJournal({ ...journal, phase: 'complete' })
        return
      }
      if (!sourceArchived && await shadow.verifyMatches(journal.redoTree ?? journal.beforeTree)) {
        if (rollbackExists) await this.hideUnpublishedChild(journal.rollbackSessionId ?? ('' as SessionId))
        await this.writeJournal({ ...journal, phase: 'ready' })
        return
      }
      await this.requireRecovery(journal, 'archive membership or private Shadow Git tree does not describe a safe publication state')
    } catch (error) {
      await this.requireRecovery(journal, error instanceof Error ? error.message : String(error))
    }
  }

  /** Determine whether a rollback child is present in either live or durable session ownership. */
```

</details>

#### 缺口

- 未故障复现与测恢复收益
  **影响**：不能声称新机制避免真实损失
  **进一步探讨**：一次性项目对照重启后错误继续与人工恢复成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
