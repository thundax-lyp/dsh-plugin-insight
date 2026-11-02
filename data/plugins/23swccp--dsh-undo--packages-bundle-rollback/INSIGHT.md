# dsh-undo rollback bundle

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[bc8edbe](https://github.com/23swccp/dsh-undo/tree/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback)

<!-- BEGIN META -->
[![npm 30d 1,186](https://img.shields.io/static/v1?label=npm+30d&message=1%2C186&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-undo-plugin) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-undo-plugin)
<!-- END META -->

> **功能**：组合DSH消息级私有文件树恢复、会话分叉和归档，固定版本可研究，来源当前身份和失败恢复仍有限制。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将文件树/会话/归档集中同一入口，私有索引与实际态复核归内部包；不将配置入口算独立算法。

> **主要限制**：[Q03](#research-q03) 补偿失败后仍可持久ready而启动跳过强制实际复核；[Q04](#research-q04) 来源当前身份未知，归档接管/退出未验，不作无损撤销保证。

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
  - [Q01 · bundle给什么任务提供何种组合贡献？](#detail-section-11)
  - [Q02 · 文件/会话正常对齐依赖哪些准入和状态？](#detail-section-12)
  - [Q03 · 补偿失败会否把恢复义务降成普通ready？](#detail-section-13)
  - [Q04 · 当前应怎样采用，并验证恢复阶段补强？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要同步恢复本地文件与模型历史的编程用户，外部动作和共享写者另核。

手工Git恢复加新会话/归档；bundle减少组合接线，非快照算法新发明。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 回退组合 | 文件/模型历史同目标 | 外部副作用不回滚 |
| 私有Git | 不动用户索引 | 支持库/容量/独立备份 |
| 归档接管 | 源隐藏/恢复 | 原生服务禁用，退出另验 |
| phase恢复 | 部分中间态实际核验 | 补偿catch降ready绕过 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH作者rc.6+和七包 | 必需 | fork/archive/undo与客户端 | 发布/宿主兼容未验 |
| web-app | 客户端按需 | 按钮/归档设置 | headless去四行 |
| Git非bare无submodule | 回退必需 | 私有树 | 不支持目录拒绝 |
| 独立备份/私有目录容量 | 安全前提 | 恢复/对象历史 | 不能唯一恢复保障 |
| 来源ID与固定发布核验 | 采用前提 | 安装溯源 | 当前default branch unknown |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 核身份 | 来源/包字节/宿主 | 固定缓存不当最新 |
| 副本 | 一次性Git/虚构会话与备份 | 不测唯一目录 |
| 矩阵 | fork/restore/archive/补偿故障 | 实际三资源/重启状态一致 |
| 错误 | 停写保树/日志 | 不信ready直接继续 |
| 退出 | 移patch核原生归档 | 不删唯一恢复材料 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 七包/宿主/备份磁盘 | 版本与归档接管核验 | 来源当前未知 |
| 持续 | 私有对象/journal/分叉历史 | 文件/聊天/范围外动作复核 | 容量/重做模型费未知 |
| 失败恢复 | 独立备份与保留树 | 停写查实际三资源 | 补偿失败人工量未知 |
| 退出 | 历史/恢复材料占用 | 原生归档恢复核验 | 无自动清理验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 同步回退 | beforeTree/切会话/归档 | 故障/竞态真实无损 |
| 撤回保护 | verifyMatches拒diverged | 跨平台损失避免 |
| 恢复 | restoring实际态核验 | ready降级残余安全 |
| 分发组合 | 七包/原生归档替换 | 当前身份/发布字节/兼容 |

> **思考**：[Q03](#research-q03) 补偿失败后仍可持久ready而启动跳过强制实际复核；[Q04](#research-q04) 来源当前身份未知，归档接管/退出未验，不作无损撤销保证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将文件树/会话/归档集中同一入口，私有索引与实际态复核归内部包；不将配置入口算独立算法。

[Q02](#research-q02) 私有索引/实际态验证可借鉴；[Q03](#research-q03) 补偿失败不能降级普通阶段，文件/会话/归档非共同事务，接管退出另验。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 补偿失败后仍可持久ready而启动跳过强制实际复核；[Q04](#research-q04) 来源当前身份未知，归档接管/退出未验，不作无损撤销保证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 观察，核来源和一次性故障矩阵并保恢复义务后再评试用；错误停写回独立备份/人工，不把本地回退当外部副作用撤销。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

相同固定提交重新核完整正式findings与准入/补偿/启动关键源；可复用版本匹配证据但非继承结论，未执行目标/故障矩阵，来源当前未知。

- 已检查：作者 README、包清单、源码路径 packages/bundle-rollback/README.md、packages/bundle-rollback/cordis.patch.yml、packages/bundle-rollback/package.json、packages/rollback-undo/src/index.ts、packages/rollback-undo/src/shadow-git.ts 及固定范围 inventory；组件：packages/bundle-rollback。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：bundle组件统计范围，仅定向内部undo/shadowGit/fork/archive调用和恢复；不全仓审计，不称当前源码远端可取得或最新发布已验。
- 下一步：[Q04](#research-q04) 来源映射+隔离故障矩阵测重启实际态/错误继续/总人工与磁盘，均未执行。

**分析版本**

- **仓库**：[23swccp/dsh-undo](https://github.com/23swccp/dsh-undo)
- **版本号**：0.1.0-rc.8（[固定提交 bc8edbe](https://github.com/23swccp/dsh-undo/tree/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证不可降级恢复阶段与三资源收据，参照已有recoverRestoring，用补偿失败/重启矩阵检错继续和恢复负担，未计现有能力。

[Q04](#research-q04) 来源映射+隔离故障矩阵测重启实际态/错误继续/总人工与磁盘，均未执行。

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

**插件研究总目标**：组合回退正常/补偿失败状态是否保留安全恢复义务？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · bundle给什么任务提供何种组合贡献？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

这是dsh-undo-plugin配置bundle，固定声明0.1.0-rc.8/MIT，只分发patch并依赖三个后端、四个浏览器包。它为编程用户把消息点的本地文件恢复、模型历史切分和源会话归档串起来；手工Git restore只恢复文件，删聊天不还原工作树，组合价值是减少错位对齐。算法属于undo/fork/archive内部包，不算bundle自创Git快照。

patch禁原生ui-settings-archive与session-archive，接管归档命名空间，退出需确认原生接回；web-app只对四客户端必要，headless须按作者说明去客户端项。外部数据库、远端发布、已发送消息及其他写者不在本地树/会话撤销范围。包内repository/目录与固定缓存身份一致，不证明本轮当前仓库可取得或默认分支最新；来源失败边界保留。

#### 证据与依据

**依据 1 · 源码核查**：[packages/bundle-rollback/package.json:1-39](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/package.json#L1-L39)

真实配置bundle与版本/依赖。

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

**依据 2 · 源码核查**：[packages/bundle-rollback/cordis.patch.yml:1-44](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/cordis.patch.yml#L1-L44)

组合和原生归档接管。

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

**依据 3 · 作者声明**：[packages/bundle-rollback/README.md:3-18](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/README.md#L3-L18)

作者任务/宿主条件。

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件/会话正常对齐依赖哪些准入和状态？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

undo检查最近消息和armed/ready，并按工作区排它、quiesce源及后代；先存含redoTree/预定子ID的restoring journal，再并行fork before-user-message与恢复beforeTree。成功归档原源、把前驱点发布给子会话并写complete，模型从被回退用户消息前继续。

ShadowGit独立GIT_DIR和GIT_INDEX_FILE，差异恢复只删除from捕获而target无的路径；拒bare/submodule工作区，撤回回退前verifyMatches避免覆盖之后新改动。启动restoring检查归档成员/子存在/实际树，安全才complete或ready，不确定recovery-required。这些保护比仅信记录强，但文件、会话和归档仍不同资源，不是跨资源原子事务；文件系统/宿主兼容未运行验。

#### 证据与依据

**依据 1 · 源码核查**：[packages/rollback-undo/src/index.ts:675-706](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L675-L706)

准入/排它与静止。

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

restoring到fork/restore/archive/发布。

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

私有Git索引。

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

工作区支持范围。

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

精确捕获差异恢复。

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

撤回树核对。

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

启动实际状态检查。

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

### Q03 · 补偿失败会否把恢复义务降成普通ready？

**研究主题**：缺陷与关键质疑

#### 完整回答

会在特定已核控制流发生：recoverable在副作用前固定为旧journal+ready；fork失败后尝试恢复redoTree，或archive失败后恢复redoTree，二次恢复失败抛AggregateError。外catch即使拿到补偿错误/child.dispose错误，也仍尝试writeJournal(recoverable)，成功则持久ready。后续recoverJournals对ready走default，不执行recoverRestoring的真实树/归档核对。

条件是副作用/补偿失败而最后journal写成功，不是所有回退都损坏；它能让残余状态失去重启时强制复核，源码支持缺陷路径，未注入故障复现或推断真实损失次数。已有verifyMatches与recovery-required是反证但依赖阶段仍在，不能覆盖外catch抹阶段。看到错误必须停写查实际树/会话/归档，不将ready或聊天已隐藏当撤销完毕。

#### 证据与依据

**依据 1 · 源码核查**：[packages/rollback-undo/src/index.ts:684-690](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L684-L690)

recoverable预置ready。

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

补偿二次错误。

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

外catch写recoverable不看残态。

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

启动按phase分派且ready跳过。

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

**依据 5 · 源码核查**：[packages/rollback-undo/src/index.ts:973-1000](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L973-L1000)

安全复核反证与适用前提。

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

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 当前应怎样采用，并验证恢复阶段补强？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议观察，不用在唯一工作目录/外部副作用任务上提供“安全撤销”保障。当前轮INPUT-PROBLEMS仍记录仓库身份或default branch unavailable；固定clean checkout与包声明足以研究这份源码，不能补成当前可安装/最新发布字节已验。首次需核宿主、七包、私有Git目录容量及归档接管；持续有对象/journal/分叉会话增长与范围外动作人工判断，失败停写保树/日志/独立备份核三资源，模型重做与恢复工时未知。退出备份后移patch并核原生归档，不直接删唯一恢复材料。

若后续做验证，先一次性仓库/虚构会话注入fork/restore/archive及其补偿失败，确认实际树/会话/归档和重启阶段；修复前不升级试用。未验证假设是副作用后失败保留不可降级recovery-required及可见三资源核对收据，参照已有recoverRestoring，而非重新造journal。若已有路径达同不变量、收据漂移或阻塞/人工负担比减少错误继续更大，则不扩展；本轮未执行任何目标代码。

#### 证据与依据

**依据 1 · 源码核查**：[packages/bundle-rollback/cordis.patch.yml:34-44](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/cordis.patch.yml#L34-L44)

退出归档所有权。

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

**依据 2 · 源码核查**：[packages/rollback-undo/src/index.ts:803-820](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L803-L820)

恢复与假设的具体线索。

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

**依据 3 · 源码核查**：[packages/rollback-undo/src/index.ts:973-1000](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L973-L1000)

已有实际核对作为基线。

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

- 来源当前身份/default branch未知且发布字节/宿主与故障恢复未验
  **影响**：不能当前取得/无损恢复/持续采用保证
  **进一步探讨**：父流程核来源与发布映射，再一次性故障矩阵核三资源；记录对象/人工/退出成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
