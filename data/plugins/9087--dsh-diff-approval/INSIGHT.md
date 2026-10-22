# dsh-diff-approval

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[393bdc4](https://github.com/9087/dsh-diff-approval/tree/393bdc4c9b6ee007027c9e4da4d9732d60c9e168)

<!-- BEGIN META -->
[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval) [![npm 30d 5,357](https://img.shields.io/static/v1?label=npm+30d&message=5%2C357&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-diff-approval) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-diff-approval)
<!-- END META -->

> **实现功能**：在DSH web集中审阅工具写入与VCS本地变更，提供文件/块级保留、回退及评论。

> **核心亮点**：将工具写入捕获、文件/块级决策、评论及宿主fs连为连续审阅，增量在交互接线而非新diff算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：普通回退读当前内容后写旧基线，未见写时版本比较；新建删除不可undo，全局快照也需留存治理。静态核查不承诺无损回退。详见[Q02](#research-q02)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 谁需要这个面板，成功写入到人工决策怎样连接？](#detail-section-11)
  - [Q02 · 相比独立Git diff的贡献是什么，回退有哪些关键边界？](#detail-section-12)
  - [Q03 · 安装、运行和退出依赖什么？](#detail-section-13)
  - [Q04 · 首次、持续、失败恢复成本和效果怎么衡量？](#detail-section-14)
  - [Q05 · 哪些工程机制可复用，冲突保护假设如何验证？](#detail-section-15)
  - [Q06 · 当前谁适合试用，出现什么应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给在DSH web修改工作文件的读者集中核对变更，重点是目标、差异与回退结果对应。

独立Git diff/编辑器与备份可完成审阅恢复；插件把非提交工具写入与会话交互集中，增加宿主版本和快照管理负担。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 写入捕获 | 集中累计差异 | 成功写入后，不阻止先写 |
| Keep/Revert | 接受或恢复文件/块 | 真实副作用，删除不undo |
| 评论/预览 | 审阅与可选AI讨论 | AI另需模型，完整UI未审计 |
| VCS导入 | 查看未提交变更 | 需对应CLI，非本轮运行结果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH web、Cordis和React客户端注入 | 启动必需 | 宿主事件、RPC和审阅面板 | 版本不匹配可能缺入口或捕获 |
| fs/connection/workspaceRegistry/sessions等服务 | 主链必需 | 文件快照、会话视图与回退 | 不等于普通独立diff工具 |
| 可写storageDir | 重启恢复必需 | 保存完整old/new文本 | 错误需处理，禁用不清数据 |
| Git/SVN/Perforce CLI及宿主shell | 选用VCS导入时 | 读取本地变更 | 不导入可不用 |
| 模型/agent服务 | 选用AI评论时 | 评论提问与回写 | 普通Keep/Revert无需模型调用 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者固定包/profile并备份工作树 | 明确这是事后审阅，非写前审批 |
| 加载 | 按README添加包/patch并重启web | 入口、事件与RPC均能接线 |
| 审阅 | 人工核对差异、原始文件和目标 | Keep只接受，Revert会改真实文件 |
| 退出/恢复 | 停用包并核对pending.json、评论及备份 | 不将删除状态文件当作文件恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装依赖、客户端资源与存储，金额未知 | 固定版本、备份与熟悉回退语义 | 作者安装说明非本轮安装结果 |
| 持续使用 | 全文件old/new内存与JSON，轮询读文件及diff渲染 | 逐文件/块审阅与合并外部变更 | AI评论另有模型费用，普通审阅不强制 |
| 失败恢复 | 快照、备份、冲突重做及持久写失败处理 | 区分已回退、部分完成及未知文件状态 | 无同规模数据集性能/恢复人时结果 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 审阅连贯性 | 捕获、累计文件差异与Keep/Revert同处宿主 | 是否降低漏审及人工时间 |
| 恢复 | 有限重试原子JSON保存及部分undo路径 | 断电耐久、多进程写和外部并发结果 |
| 变更归属 | 全局按路径累计并按lineage过滤 | 同文件多来源变更能否符合读者预期 |

> **思考**：普通回退读当前内容后写旧基线，未见写时版本比较；新建删除不可undo，全局快照也需留存治理。静态核查不承诺无损回退。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将工具写入捕获、文件/块级决策、评论及宿主fs连为连续审阅，增量在交互接线而非新diff算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

将工具写入捕获、文件/块级决策、评论及宿主fs连为连续审阅，增量在交互接线而非新diff算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

可复用的是纯pending状态机与I/O分离，内容版本缓存标记、请求视图统一复用、动作写策略与来源归属分离，以及原子JSON保存对EPERM/EACCES/EBUSY有限退避。Markdown预览使用DOMPurify而不是直接插入原文，但这不替代所有UI/网络面安全审计。原子rename不等fsync断电耐久或多进程事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

普通回退读当前内容后写旧基线，未见写时版本比较；新建删除不可undo，全局快照也需留存治理。静态核查不承诺无损回退。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

单人可备份工作树可试用事后审阅；先核对普通回退冲突及数据留存，保留版本控制与备份。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持成功文件工具结果的差异汇总、Keep/Revert与快照恢复入口；这是事后审阅，Revert缺当前内容CAS且新建文件删除不等可撤销。版本绑定回退和恢复收据尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/pending.ts、src/persist.ts、package.json、src/atomic-write.ts、src/client/markdown-preview.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交主捕获、pending/persist/原子写、lineage/普通回退/undo与客户端Markdown净化；未全面审计UI/VCS/AI评论，不执行目标代码或回退。
- 下一步：进一步探讨可从固定文件集、外部编辑与第N文件失败夹具入手，核对冲突、部分完成、删除恢复及人时。

**分析版本**

- **仓库**：[9087/dsh-diff-approval](https://github.com/9087/dsh-diff-approval)
- **版本号**：0.36.1（[固定提交 393bdc4](https://github.com/9087/dsh-diff-approval/tree/393bdc4c9b6ee007027c9e4da4d9732d60c9e168)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨版本绑定回退收据，冲突不覆盖并保存删除/批量恢复记录；增加空间与交互成本，尚未验证。详见[Q05](#research-q05)。

进一步探讨可从固定文件集、外部编辑与第N文件失败夹具入手，核对冲突、部分完成、删除恢复及人时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1280 | — | — | 14419 |
| .ts | test | 58 | 18044 | 13063 | 3237 | — |
| .ts | source | 51 | 19327 | 9937 | 8466 | — |
| .mjs | source | 4 | 1304 | 802 | 421 | — |
| .tsx | source | 9 | 14853 | 9390 | 5222 | — |
| .tsx | test | 6 | 17471 | 12270 | 3680 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval/issues?q=is%3Aissue+created%3A2026-09-22T05%3A18%3A37.811Z..2026-10-22T05%3A18%3A37.811Z) [![近30天关闭 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=grey&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A18%3A37.811Z..2026-10-22T05%3A18%3A37.811Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核查事后文件审阅的主链、回退/跨会话/存储边界及采用成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这个面板，成功写入到人工决策怎样连接？

**研究主题：**场景与需求、功能与机制

#### 完整回答

面向在DSH web让agent修改工作文件、希望集中核对变更的人。输入是成功edit/write/editor结果或可选VCS本地变更，输出是按文件累计差异、保留或真实回退。合格交付需差异对应实际文件，决定作用于预期目标且能辨认失败。它不在写入前等待批准，不能当作阻止模型先改文件的权限闸门。

tools/result同步折叠成功结果，editor意图钩子仅预存基线并继续next；pending按绝对路径保留最早基线与最新文本并累计触碰session。RPC列出可见条目，Keep只接受/移除待审状态，Revert通过宿主fs恢复基线或删除新建文件。全局累计不等逐工具调用回放。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-17](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/README.md#L11-L17)

作者定义成功操作后的待审列表。

```text
A DeepSeek Harness (DSH) plugin for pending-change review: it automatically tracks every successful `edit`, `write`, and editor (`str_replace_editor`) mutation, folds them into a single pending list in the sidebar where each file's diff can be reviewed and kept/reverted — and it can also import the workspace's version-control repository's local changes (Git / SVN / Perforce) in one click.

![Pending changes panel](docs/images/pending-panel.png)

The panel also collapses its file list into a floating card; while floating, each of its four edges — the left sidebar, the header above, the right sidebar, the composer below — can be chosen to be covered (all four is what used to be fullscreen, and covering nothing is a plain floating card), and it can dock as a tab in the right sidebar:

Two entries open it: the row at the sidebar foot, and a button in the Session header's right-hand controls — the cluster the app keeps its own per-session actions in (where "Download session log" lives) — so the review stays one click away with the sidebar collapsed or hidden.
```

**依据 2 · 源码核查**：[src/index.ts:2484-2496](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/index.ts#L2484-L2496)

成功工具结果进入累计store。

<details>
<summary>查看原文（13行）</summary>

```text
  ctx.on('tools/result', (exec: Readonly<ToolExecution>, result: Readonly<ToolExecutionResult>) => {
    if (exec.name === 'str_replace_editor') {
      void captureEditorMutation(exec, result)
      return
    }
    if (result.isError || exec.agent === undefined) return
    const outcome = exec.name === 'edit' ? editOutcomeOf(result.value) : exec.name === 'write' ? writeOutcomeOf(result.value) : undefined
    if (outcome === undefined || outcome.oldText === outcome.newText) return
    const sessionId = exec.agent.id
    const entry: PendingEntry = { id: outcome.path, sessionId, ...outcome, updatedAt: Date.now(), sessionIds: [sessionId], lineage: lineageOf(sessionId, exec.agent), unseen: true }
    // Fold synchronously so the very next list sees the capture; persistence
    // (hydration + save) rides the same turn asynchronously.
    if (store.fold(entry)) persistSession()
```

</details>

**依据 3 · 源码核查**：[src/index.ts:3652-3659](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/index.ts#L3652-L3659)

意图观察后继续链，不拥有批准决策。

```text
  ctx.effect(() => ctx.on('fs/edit-intent', async (target, actor, next) => {
    await stashEditorIntent(target, actor, 'file')
    return next()
  }, { prepend: true }), 'diff-approval: str_replace_editor edit basis')
  ctx.effect(() => ctx.on('fs/write-intent', async (target, actor, next) => {
    await stashEditorIntent(target, actor, 'none')
    return next()
  }, { prepend: true }), 'diff-approval: str_replace_editor create basis')
```

**依据 4 · 源码核查**：[src/pending.ts:111-142](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/pending.ts#L111-L142)

按文件合并基线和多session。

<details>
<summary>查看原文（32行）</summary>

```text
    const later = earlier === a ? b : a
    const sessionIds = [...new Set([...touchedBy(a), b.sessionId])]
    // A creation is the whole change only while creations are all there is: the entry is anchored at a
    // path that did not exist, and `earlierVersion: 'none'` is what makes a revert remove the file. As
    // soon as a later capture EDITS that file, the reader is reviewing rounds of work on a file that
    // exists, so the basis becomes the content it was created with and `回退` writes that back, keeping the
    // file. Freezing the field at 'none' (the rule from 2026-08-31 until now) left a file that had been
    // rewritten many times still tagged 新增 and still offering 删除.
    const onlyCreations = earlier.earlierVersion === 'none' && later.earlierVersion === 'none'
    return {
      ...later,
      // The global identity is the path; `id` must always equal it.
      id: later.path,
      // With no old side of the file's own to keep, the creation's content is the basis: `earlier.newText`
      // is the file as it stood right after it was created.
      oldText: onlyCreations ? '' : earlier.earlierVersion === 'none' ? earlier.newText : earlier.oldText,
      earlierVersion: onlyCreations ? 'none' : 'file',
      sessionIds,
      // Sticky until the reader looks: a capture that arrives while the dot is up does not take it down, and
      // one that arrives after it went out puts it back (that is what the capture site sets).
      unseen: earlier.unseen === true || later.unseen === true,
    }
  }

  /**
   * Copy every entry touching a session (the session's view), oldest capture
   * first. The file list is session-scoped: an entry appears for each session
   * that touched it, so a session only sees files it worked on.
   * @param sessionId - the viewing session.
   * @returns detached entries in capture order.
   */
  list(sessionId: SessionId): PendingEntry[] {
```

</details>

**依据 5 · 源码核查**：[src/index.ts:2750-2789](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/index.ts#L2750-L2789)

Keep接受已有内容，不写文件。

<details>
<summary>查看原文（40行）</summary>

```text
        const target = targetOf(payload)
        if (target === undefined) return rpcError('sessionId and id must be non-empty strings')
        // Remove synchronously: once the user acts, the entry must be gone for
        // any concurrent list. (The store is hydrated by the time an action
        // runs, since the panel lists first.)
        // Resolved through the request's merged view, so a row the reader can see is actionable and a row
        // outside its lineage answers `missing` — the same answer an id that names nothing gets.
        const lineage = lineageView()
        let entry = actionableEntryOf(lineage, target.sessionId, target.id)
        if (entry === undefined) {
          await ensureLoaded()
          entry = actionableEntryOf(lineage, target.sessionId, target.id)
          if (entry === undefined) {
            const value: DiffApprovalActionValue = { outcome: 'missing' }
            return { ok: true, value }
          }
        }
        // The file already holds the accepted content, so nothing is written:
        // folding `newText` into the baseline clears the diff. The panel asks
        // whether to also drop the resolved entry, and rides the answer here.
        if ((payload as Record<string, unknown>).keepListed === true) {
          store.update(target.id, { oldText: entry.newText })
          const afterEntry: PendingEntry = { ...entry, oldText: entry.newText, updatedAt: Date.now() }
          pushUndo(target.sessionId,
            { id: entry.path, path: entry.path, entry, fileText: undefined },
            { id: entry.path, path: entry.path, entry: afterEntry, fileText: undefined })
          persistSession(true)
          const value: DiffApprovalActionValue = { outcome: 'kept', resolved: true }
          return { ok: true, value }
        }
        // Snapshotted BEFORE the drop: the threads are what that call is about to take away.
        const beforeDrop = droppingComments({ id: entry.path, path: entry.path, entry, fileText: undefined })
        dropEntry(target.id)
        pushUndo(target.sessionId, beforeDrop,
          { id: entry.path, path: entry.path, entry: undefined, fileText: undefined })
        persistSession(true)
        const value: DiffApprovalActionValue = { outcome: 'kept' }
        return { ok: true, value }
      }
      case 'revert': {
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 相比独立Git diff的贡献是什么，回退有哪些关键边界？

**研究主题：**贡献与相对优势、缺陷与关键质疑

#### 完整回答

增量是把非提交文件变更、会话来源、块级决策、评论和宿主文件写接口连成连续审阅体验。diff、语法高亮与Markdown净化来自成熟库；创新不在差分算法。独立Git diff/编辑器加备份仍是可替代基线。

最关键边界是回退不是操作级事务。普通Revert读取当前内容作undo快照后写旧基线，没有像undo预检那样先比较当前文件与审阅newText；外部并发修改与点击之间可能被整体恢复覆盖。list会主动吸收外部内容，但这不是写入时的原子比较交换。新建文件的删除回退不进入undo，批量动作不是跨文件原子事务。此处为源码风险推断，未做覆盖复现。

数据层也不再是README所称每workspace独立文件，persist当前v3保存全局pending.json，old/new完整文本可能含敏感内容。视图按lineage/workspace筛选、动作重新检查可见性并用请求session写策略是积极约束；未知workspace采用兼容放行，不应推广成多租户安全隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:2057-2071](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/index.ts#L2057-L2071)

普通回退先读当前内容作为undo快照，随后写旧基线。

<details>
<summary>查看原文（15行）</summary>

```text
  async function revertEntryContent(entry: PendingEntry, sessionId: SessionId, signal: AbortSignal): Promise<{ before: DiffApprovalUndoState; after: DiffApprovalUndoState } | undefined> {
    const resolved = await ctx.fs.resolve(entry.path, { signal })
    if (entry.earlierVersion === 'none') {
      await removeRevert(resolved, sessionId, signal)
      return undefined
    }
    const preWrite = await ctx.fs.readText(resolved, undefined) ?? entry.newText
    const content = reencodeEol(entry.oldText, detectEol(entry.newText))
    await writeRevert(resolved, content, sessionId, signal)
    return {
      before: { id: entry.id, path: entry.path, entry, fileText: preWrite },
      after: { id: entry.id, path: entry.path, entry: undefined, fileText: content },
    }
  }

```

</details>

**依据 2 · 源码核查**：[src/index.ts:2014-2018](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/index.ts#L2014-L2018)

undo有显式文件内容比较，不能投射到普通回退。

```text
      if (write.expected !== undefined) {
        const current = await ctx.fs.readText(resolved, undefined)
        if (current !== write.expected) {
          return { path: write.path, error: new Error('the file changed outside the review after the action; undo is unavailable') }
        }
```

**依据 3 · 源码核查**：[src/index.ts:1390-1421](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/index.ts#L1390-L1421)

workspace未知兼容视图语义。

<details>
<summary>查看原文（32行）</summary>

```text
   * `undefined` — "not known", never a guess: the caller keeps the pre-workspace behaviour for it
   * rather than refusing a row it cannot show to be elsewhere.
   * @param sessionId - the session whose workspace is wanted.
   * @returns the comparison key, or `undefined` when it is not known.
   */
  function workspaceKeyOf(sessionId: SessionId): string | undefined {
    const path = workspaceOf(sessionId)?.path
    if (typeof path !== 'string' || path.length === 0) return undefined
    const resolved = resolve(path)
    return process.platform === 'win32' ? resolved.toLowerCase() : resolved
  }

  /**
   * Whether two workspaces, already reduced to comparison keys by {@link workspaceKeyOf}, are the same
   * one as far as this deployment can say.
   *
   * TRUE when either side is unknown, which is the whole point: an unknown workspace must not turn into
   * a refusal. The pending list is not scoped by workspace (see `workspaceKeyOf`), so a session the
   * registry does not account — a memory-only session, a row from a host that named no workspace, a
   * deployment whose registry the plugin cannot read — would otherwise lose rows it has always shown.
   * The check is for the case this code can actually see: two KNOWN roots that differ.
   * @param left - one session's key, or `undefined` when unknown.
   * @param right - the other's.
   * @returns whether they can be shown to share a workspace.
   */
  function sameWorkspaceKey(left: string | undefined, right: string | undefined): boolean {
    return left === undefined || right === undefined || left === right
  }

  /**
   * Resolve the file-sandbox policy for one session's Revert write, or
   * undefined when no confining backend is mounted. A live session carries
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1783-1816](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/index.ts#L1783-L1816)

可操作条目与请求session策略。

<details>
<summary>查看原文（34行）</summary>

```text
  /**
   * The entry one id names, when the requesting session may act on it; `undefined` otherwise.
   *
   * Every action path resolves its entry through this, so an id outside the requester's lineage is
   * answered exactly like an id that names nothing — `missing` — and no action can reach a row the
   * requester cannot see.
   * @param view - the request's lineage view.
   * @param sessionId - the requesting session.
   * @param id - the entry id (its path).
   * @returns the entry, or `undefined` when it is absent or outside the view.
   */
  function actionableEntryOf(
    view: { sees: (sessionId: SessionId, entry: PendingEntry) => boolean },
    sessionId: SessionId,
    id: string,
  ): PendingEntry | undefined {
    const entry = store.get(id)
    return entry !== undefined && view.sees(sessionId, entry) ? entry : undefined
  }

  /**
   * Write a Revert through `ctx.fs`, carrying the session's sandbox policy
   * only when a confining backend is mounted (so the plain 4-arg call shape is
   * preserved for the unsandboxed composition).
   * @param target - the resolved target to write.
   * @param content - the restored file content.
   * @param sessionId - the entry's session, for the per-session policy.
   * @param signal - aborts before atomic publication takes effect.
   * @returns the write outcome.
   */
  async function writeRevert(target: FsTarget, content: string, sessionId: SessionId, signal: AbortSignal): Promise<unknown> {
    const policy = sandboxPolicyOf(sessionId)
    return policy === undefined
      ? ctx.fs.writeText(target, content, undefined, signal)
```

</details>

**依据 5 · 源码核查**：[src/persist.ts:140-199](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/persist.ts#L140-L199)

v3全局持久文件和单实例保存串行。

<details>
<summary>查看原文（60行）</summary>

```text
/**
 * File-backed pending entries, one global file keyed by path.
 */
export class PendingPersistence {
  private readonly tails = new Map<string, Promise<unknown>>()
  private readonly globalFile: string

  /**
   * @param root - directory holding the global `pending.json` (and, pre-migration,
   * one JSON file per workspace).
   */
  constructor(private readonly root: string) {
    this.globalFile = join(root, 'pending.json')
  }

  /**
   * Load every persisted entry. Returns the global file's entries, or — when the
   * global file is absent — flattens the legacy per-workspace files so the
   * caller can fold them once and then save (which clears the legacy files).
   * @returns the entries plus whether they came from the legacy layout (awaiting
   * a save to finalize the migration).
   */
  async loadAll(): Promise<{ entries: PendingEntry[]; migratedLegacy: boolean }> {
    const global = await readJson(this.globalFile)
    if (global !== undefined) {
      const parsed = globalFileOf(this.globalFile, global)
      const entries: PendingEntry[] = []
      for (const row of parsed.entries) {
        const entry = pendingEntryOf(row)
        if (entry !== undefined) entries.push(entry)
      }
      return { entries: entries.sort((l, r) => l.updatedAt - r.updatedAt), migratedLegacy: false }
    }
    const legacy = await collectLegacy(this.root)
    if (legacy.length > 0) {
      return { entries: legacy.sort((l, r) => l.updatedAt - r.updatedAt), migratedLegacy: true }
    }
    return { entries: [], migratedLegacy: false }
  }

  /**
   * Replace the persisted entry set durably. Saves to the one file are
   * serialized; a previous save's failure does not block the next one. On a
   * legacy migration this also removes the per-workspace files.
   * @param entries - the complete entry list, possibly empty.
   * @returns resolution after the file is durable.
   */
  save(entries: readonly PendingEntry[]): Promise<void> {
    const task = async () => {
      await writeJsonAtomic(this.globalFile, { version: FILE_VERSION, entries })
      await removeLegacy(this.root)
    }
    const tail = this.tails.get(this.globalFile) ?? Promise.resolve()
    const run = tail.then(task, task)
    this.tails.set(this.globalFile, run.catch(() => {}))
    return run
  }
}

/** Flatten every legacy per-workspace file's entries (adding `sessionIds`). */
```

</details>

**依据 6 · 作者声明**：[README.md:43-46](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/README.md#L43-L46)

旧按workspace存储说明。

```text
- **File menu**: on by default (the "File menu" row in the "Diff view" group turns it off). It takes over the click on some file links: a file row in the shell's edited / produced lists, an `@file` reference or file link in a message, and a relative link in this plugin's Markdown preview, and offers: **Open as usual** (the shell's own behaviour, replayed), **View in the review panel**, and **Copy file path**.
- **Bundled CJK code font**: the panel ships JetBrains Maple Mono, subset and sliced by `unicode-range`; it is on by default and can be turned off in settings.
- **External changes**: files already in the pending list are monitored — if one is later modified outside the reviewed edits (another tool, an editor), the panel adopts the new content and flags the divergence.
- **Open / Reveal**: while reviewing a file's diff, open it in its default app or reveal it in the system file manager with one click.
```

#### 缺口

- 实际宿主fs的并发写/策略与插件外部写交互未完全确定。
  **影响：**不能把源码回退链称为无损或原子冲突保护。
  **进一步探讨：**可从固定外部编辑发生在list之后、Revert读写之间及新建删除场景入手，检查文件内容与undo可达性。
- 全局快照与评论的多进程冲突、敏感数据留存策略未有完整证据。
  **影响：**原子rename只解决单文件替换，不等跨进程协调或隐私删除。
  **进一步探讨：**可检查多实例共享storageDir约束及停用后的数据盘点与权限。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装、运行和退出依赖什么？

**研究主题：**依赖、兼容与流程

#### 完整回答

作者提供profile安装、patch和web重启步骤。包分服务端和客户端，主链需fs/connection/webServer/workspaceRegistry/sessions/sessionController/agents等注入；这不是任意Node中直接运行的工具。VCS导入和AI评论分别增加CLI/shell与模型依赖，普通人工审阅不强制这些功能。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH web、Cordis和React客户端注入 | 启动必需 | 宿主事件、RPC和审阅面板 | 版本不匹配可能缺入口或捕获 |
| fs/connection/workspaceRegistry/sessions等服务 | 主链必需 | 文件快照、会话视图与回退 | 不等于普通独立diff工具 |
| 可写storageDir | 重启恢复必需 | 保存完整old/new文本 | 错误需处理，禁用不清数据 |
| Git/SVN/Perforce CLI及宿主shell | 选用VCS导入时 | 读取本地变更 | 不导入可不用 |
| 模型/agent服务 | 选用AI评论时 | 评论提问与回写 | 普通Keep/Revert无需模型调用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者固定包/profile并备份工作树 | 明确这是事后审阅，非写前审批 |
| 加载 | 按README添加包/patch并重启web | 入口、事件与RPC均能接线 |
| 审阅 | 人工核对差异、原始文件和目标 | Keep只接受，Revert会改真实文件 |
| 退出/恢复 | 停用包并核对pending.json、评论及备份 | 不将删除状态文件当作文件恢复 |

持久状态与工作文件是两类数据，停用包不自动撤销已写文件，也不自动清理完整快照。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:15-28](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/package.json#L15-L28)

独立服务与客户端导出。

<details>
<summary>查看原文（14行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[package.json:41-57](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/package.json#L41-L57)

DSH web客户端注入。

<details>
<summary>查看原文（17行）</summary>

```text
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ],
      "platform": "web"
    }
  },
  "scripts": {
```

</details>

**依据 3 · 源码核查**：[package.json:72-87](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/package.json#L72-L87)

运行库与peer依赖。

<details>
<summary>查看原文（16行）</summary>

```text
    "@deepseek-ai/dsh-home-paths": "^0.1.0-rc.5",
    "@shikijs/langs": "^4.4.3",
    "diff": "^9.0.0",
    "dompurify": "^3.4.15",
    "marked": "^18.0.11",
    "shiki": "^4.4.3"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.1",
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-client-connection": "^0.1.0-rc.5",
    "@deepseek-ai/dsh-client-locale": "^0.1.0-rc.5",
    "@deepseek-ai/dsh-client-runtime": "^0.1.0-rc.5",
```

</details>

**依据 4 · 源码核查**：[src/index.ts:99-104](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/index.ts#L99-L104)

服务注入。

```text
 * base composition this plugin already requires for `sessions`, so a host that could
 * list pending changes at all has them.
 */
export const inject = ['fs', 'connection', 'webServer', 'workspaceRegistry', 'sessions', 'sessionController', 'agents']

/** The connection RPC channel this plugin serves. */
```

**依据 5 · 作者声明**：[README.md:48-78](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/README.md#L48-L78)

作者安装与存储配置。

<details>
<summary>查看原文（31行）</summary>

````text
- **Persistence**: pending state is stored per workspace at `<dshHome>/diff-approval/workspaces/<workspaceId>.json` and survives restarts — unhandled changes are still there when you come back, even in a fresh session.

## 📦 Install

If `dsh` is on your `PATH`:

```sh
dsh plugin --profile web add dsh-diff-approval
```

Or, if you run the harness through npx (e.g. `npx @deepseek-ai/dsh web`):

```sh
npx @deepseek-ai/dsh plugin --profile web add dsh-diff-approval
```

or manually: add the package to your profile's `package.json` dependencies and insert this row into the profile's `cordis.patch.yml`:

```yaml
- insert:
    - id: diff-approval
      name: dsh-diff-approval
      # Optional: relocate durable pending state (defaults to
      # <dshHome>/diff-approval/workspaces).
      # config:
      #   storageDir: ~/dsh-pending
```

Then restart `dsh web`.

## 🚀 Usage
````

</details>

**依据 6 · 作者声明**：[README.md:87-94](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/README.md#L87-L94)

VCS CLI、删除与持久注意。

```text
- The VCS import runs read-only Git/SVN/Perforce commands through the deployment's shell executor, so the respective CLI must be on `PATH`. Including files version control has not seen (default off) scans the whole workspace, which can be slow on large trees.
- For a newly-created file, the whole-file revert action reads **Delete** and removes the file.
- Reverting a file writes it back with its current line endings (LF / CRLF) preserved.
- Sessions with no workspace keep their entries memory-only; corrupt persistence files are rejected and can be deleted to reset.
- The sidebar footer entry stacks vertically with other plugins' footer actions and defers to the dedicated `dsh-footer-order` plugin when it is present.

## 🛠 Development

```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续、失败恢复成本和效果怎么衡量？

**研究主题：**效果与总成本

#### 完整回答

完整任务是一次真实变更被正确审阅并保留/恢复，不能仅以列表出现或文件数衡量。保存完整旧新文本、轮询核对、diff计算和高亮会随文件规模增长；虚拟化能减少展示节点，不证明差分计算或持久JSON的成本恒定。作者原子写注释提到本机测量，本轮没有运行，不能当独立性能或可靠性证据。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装依赖、客户端资源与存储，金额未知 | 固定版本、备份与熟悉回退语义 | 作者安装说明非本轮安装结果 |
| 持续使用 | 全文件old/new内存与JSON，轮询读文件及diff渲染 | 逐文件/块审阅与合并外部变更 | AI评论另有模型费用，普通审阅不强制 |
| 失败恢复 | 快照、备份、冲突重做及持久写失败处理 | 区分已回退、部分完成及未知文件状态 | 无同规模数据集性能/恢复人时结果 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 审阅连贯性 | 捕获、累计文件差异与Keep/Revert同处宿主 | 是否降低漏审及人工时间 |
| 恢复 | 有限重试原子JSON保存及部分undo路径 | 断电耐久、多进程写和外部并发结果 |
| 变更归属 | 全局按路径累计并按lineage过滤 | 同文件多来源变更能否符合读者预期 |


#### 证据与依据

**依据 1 · 源码核查**：[src/pending.ts:1-10](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/pending.ts#L1-L10)

保存文件完整基线与最新文本。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * In-memory pending-diff store: one entry per file path, globally, holding the
 * file's full set of unhandled changes as one cumulative span (earliest basis →
 * latest content) across every session and workspace that touched it. Every
 * later operation to a tracked path folds into its entry — `oldText` stays the
 * earliest basis, `newText` takes the latest content, and the touching sessions
 * accumulate in `sessionIds` — even when the chain breaks (an outside writer
 * changed the file between operations). Pure state and transitions; the plugin
 * body owns the `tools/result` observation, the RPC surface, and the
 * filesystem I/O.
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1130-1133](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/index.ts#L1130-L1133)

作者说明面板轮询读取状态。

```text
   * path (the panel polls once a second and the review set stays small).
   * @param entries - the store's entries for one session.
   * @returns entries with `missing` and `diverged` set from the live file.
   */
```

**依据 3 · 源码核查**：[src/persist.ts:188-199](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/persist.ts#L188-L199)

保存整份entries并串行。

<details>
<summary>查看原文（12行）</summary>

```text
    const task = async () => {
      await writeJsonAtomic(this.globalFile, { version: FILE_VERSION, entries })
      await removeLegacy(this.root)
    }
    const tail = this.tails.get(this.globalFile) ?? Promise.resolve()
    const run = tail.then(task, task)
    this.tails.set(this.globalFile, run.catch(() => {}))
    return run
  }
}

/** Flatten every legacy per-workspace file's entries (adding `sessionIds`). */
```

</details>

**依据 4 · 作者声明**：[src/atomic-write.ts:1-20](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/atomic-write.ts#L1-L20)

作者瞬时失败重试测量说明，并非本轮复现。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * Stage a JSON envelope beside its target and rename it into place, retrying the rename.
 *
 * Both stores in this plugin persist the same way — write a sibling temp file, `rename` it over the
 * real one — because a crash must leave either the old file or the new one and never a torn one. What
 * neither of them did was survive the rename itself being refused, and on Windows that is not rare:
 * replacing a file another process has open at that instant answers `EPERM`, and the readers here are
 * everyone — a second panel, a backup agent, an antivirus, the user's own editor, or this suite's own
 * 50ms `readFile` loop waiting for the write. The refusal is transient by construction (the handle that
 * caused it closes within a tick), but the write it killed was the ONLY copy of that update: the
 * pending list or a session's comment file simply kept its previous content, and the failure was
 * reported as "your threads will not survive a restart" without ever being retried.
 *
 * So the rename is attempted a few times with a short, growing pause. Measured on this machine with a
 * concurrent reader, the retry turns 6 lost writes in 12 into 0 — see `tests/atomic-write.spec.ts` for
 * the deterministic shape (an injected rename that fails once) and the commit message for the numbers.
 *
 * Failures that are NOT about a held handle (a missing directory, a full disk, a read-only mount) are
 * rethrown on the first attempt: retrying those only delays the report the caller has to make.
 *
```

</details>

#### 缺口

- 没有同一变更集、同一文件规模的审阅时间、漏审、内存和失败恢复对照。
  **影响：**不能给出节省百分比或适合超大文件承诺。
  **进一步探讨：**可和Git diff加编辑器比较完整审阅任务，统计回退冲突、人工核对、峰值内存及恢复人时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些工程机制可复用，冲突保护假设如何验证？

**研究主题：**工程质量与复用、新假设与验证

#### 完整回答

可复用的是纯pending状态机与I/O分离，内容版本缓存标记、请求视图统一复用、动作写策略与来源归属分离，以及原子JSON保存对EPERM/EACCES/EBUSY有限退避。Markdown预览使用DOMPurify而不是直接插入原文，但这不替代所有UI/网络面安全审计。原子rename不等fsync断电耐久或多进程事务。

由Q02提出未验证的“版本绑定回退收据”。用户看见差异时绑定newText哈希及条目版本，执行前检查文件/版本，冲突返回可读收据而不覆盖，并为删除与批量部分完成保存可恢复副本。相比当前普通Revert，目标是明确副作用对应哪次审阅；代价是快照空间、冲突交互和跨文件补偿复杂度。可用外部编辑、并发捕获、失败在第N文件与重启夹具，对照静默覆盖、恢复完整性与人工时间；若持续误报阻塞或仍无法恢复，应修正或否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/pending.ts:43-76](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/pending.ts#L43-L76)

纯状态store与内容版本。

<details>
<summary>查看原文（34行）</summary>

```text
 * The pending-diff store: one entry per file path across all sessions. Keep /
 * Revert decides one whole file at a time.
 */
export class PendingDiffStore {
  private readonly entries = new Map<string, PendingEntry>()
  /**
   * The content version of each entry: bumped whenever its tracked `newText` moves, and never for a
   * change that leaves the content alone (a block keep advances `oldText` only).
   *
   * It is what lets derived, content-dependent state — the lines a comment's quote resolves to, read
   * off `newText` — be cached and refreshed when the content moved rather than recomputed on every
   * read. The versions come from one monotonic counter and are never reused, so an entry that leaves
   * the list and comes back cannot hand back the number a stale cache was keyed to.
   */
  private readonly contentVersions = new Map<string, number>()
  /** The last version handed out; only ever climbs (see `contentVersions`). */
  private contentVersionCounter = 0

  /** Note that one path's tracked content moved, and give it a fresh version. */
  private bumpContent(path: string): void {
    this.contentVersions.set(pathKeyOf(path), ++this.contentVersionCounter)
  }

  /**
   * The version of one path's tracked content, or 0 while it has none.
   *
   * Two calls that return the same number describe the same `newText`: a caller caching something
   * derived from that content may serve its copy until the number changes.
   * @param path - the file path (the global entry key).
   * @returns the path's content version.
   */
  contentVersion(path: string): number {
    return this.contentVersions.get(pathKeyOf(path)) ?? 0
  }
```

</details>

**依据 2 · 源码核查**：[src/atomic-write.ts:58-71](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/atomic-write.ts#L58-L71)

瞬时错误类别与默认有限退避。

<details>
<summary>查看原文（14行）</summary>

```text
 */
export const ATOMIC_WRITE_RETRY: AtomicWriteRetry = { attempts: 5, delayMs: 25 }

/**
 * Whether one rename error is the transient "somebody else has this file open" refusal.
 *
 * Windows answers `EPERM` for a replace whose target is open; `EACCES` and `EBUSY` are the same
 * situation seen through a network share or a mapped drive. Nothing else is retried.
 *
 * @param error - whatever the rename threw.
 * @returns whether another attempt is worth making.
 */
export function isHeldOpen(error: unknown): boolean {
  const code = (error as NodeJS.ErrnoException | null | undefined)?.code
```

</details>

**依据 3 · 源码核查**：[src/atomic-write.ts:81-113](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/atomic-write.ts#L81-L113)

同目录暂存、rename、失败清理。

<details>
<summary>查看原文（33行）</summary>

```text
 * @throws the rename's own error when the attempts run out, or at once when it is not a held handle.
 */
export async function writeJsonAtomic(
  file: string,
  value: unknown,
  options: { fs?: Partial<AtomicWriteFs> | undefined; retry?: AtomicWriteRetry | undefined } = {},
): Promise<void> {
  const io: AtomicWriteFs = {
    mkdir,
    writeFile,
    rename,
    remove: staged => rm(staged, { force: true }),
    ...options.fs,
  }
  const retry = options.retry ?? ATOMIC_WRITE_RETRY
  await io.mkdir(dirname(file), { recursive: true })
  const staged = `${file}.${process.pid}.${Date.now()}.tmp`
  await io.writeFile(staged, JSON.stringify(value), 'utf8')
  for (let attempt = 1; ; attempt++) {
    try {
      await io.rename(staged, file)
      return
    } catch (error: unknown) {
      if (attempt >= retry.attempts || !isHeldOpen(error)) {
        // The staged bytes are this write's own and nothing else points at them: leaving them behind
        // would litter the state directory with files nothing reads (and `loadAll` skips `.tmp`).
        await io.remove(staged).catch(() => {})
        throw error
      }
      await new Promise(resolve => setTimeout(resolve, retry.delayMs * 2 ** (attempt - 1)))
    }
  }
}
```

</details>

**依据 4 · 源码核查**：[src/client/markdown-preview.ts:53-67](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/client/markdown-preview.ts#L53-L67)

Markdown经DOMPurify净化。

<details>
<summary>查看原文（15行）</summary>

```text
/** Render one text run to sanitized HTML (Markdown). */
function renderRun(run: DiffRun): string {
  const html = marked.parse(run.text, { async: false }) as string
  return DOMPurify.sanitize(html)
}

/** Escape HTML special characters before embedding text in the Markdown source. */
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Render a Markdown string (already carrying injected inline spans) to sanitized HTML. */
function renderMarkdownInline(markdown: string): string {
  return DOMPurify.sanitize(marked.parse(markdown, { async: false }) as string)
}
```

</details>

**依据 5 · 源码核查**：[src/index.ts:2057-2071](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/index.ts#L2057-L2071)

假设针对普通回退的真实写路径。

<details>
<summary>查看原文（15行）</summary>

```text
  async function revertEntryContent(entry: PendingEntry, sessionId: SessionId, signal: AbortSignal): Promise<{ before: DiffApprovalUndoState; after: DiffApprovalUndoState } | undefined> {
    const resolved = await ctx.fs.resolve(entry.path, { signal })
    if (entry.earlierVersion === 'none') {
      await removeRevert(resolved, sessionId, signal)
      return undefined
    }
    const preWrite = await ctx.fs.readText(resolved, undefined) ?? entry.newText
    const content = reencodeEol(entry.oldText, detectEol(entry.newText))
    await writeRevert(resolved, content, sessionId, signal)
    return {
      before: { id: entry.id, path: entry.path, entry, fileText: preWrite },
      after: { id: entry.id, path: entry.path, entry: undefined, fileText: content },
    }
  }

```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前谁适合试用，出现什么应停止？

**研究主题：**采用判断

#### 完整回答

推荐trial，面向单人可备份工作树的DSH web文件审阅，先将其视为便利的事后审阅面板。普通Git diff不能覆盖全部会话工具写入体验，但成熟版本控制/备份仍需保留。不要把名称中的approval解释为写前保护，也不要把全局路径累计解释为逐次可逆历史。

继续探讨可先核对固定宿主接口和回退冲突语义，选择无敏感小文件，分别看Keep、编辑回退、新建删除与批量失败的结果。若目标/来源不明、外部变更被覆盖、部分完成未清楚回报、持久失败或快照数据留存不清，应停止相关写动作并以备份/版本控制恢复。Q02的冲突保护与Q04成本结果会影响是否扩大范围，本轮不做文件回退。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:2750-2818](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/index.ts#L2750-L2818)

接受与真实回退的不同副作用。

<details>
<summary>查看原文（69行）</summary>

```text
        const target = targetOf(payload)
        if (target === undefined) return rpcError('sessionId and id must be non-empty strings')
        // Remove synchronously: once the user acts, the entry must be gone for
        // any concurrent list. (The store is hydrated by the time an action
        // runs, since the panel lists first.)
        // Resolved through the request's merged view, so a row the reader can see is actionable and a row
        // outside its lineage answers `missing` — the same answer an id that names nothing gets.
        const lineage = lineageView()
        let entry = actionableEntryOf(lineage, target.sessionId, target.id)
        if (entry === undefined) {
          await ensureLoaded()
          entry = actionableEntryOf(lineage, target.sessionId, target.id)
          if (entry === undefined) {
            const value: DiffApprovalActionValue = { outcome: 'missing' }
            return { ok: true, value }
          }
        }
        // The file already holds the accepted content, so nothing is written:
        // folding `newText` into the baseline clears the diff. The panel asks
        // whether to also drop the resolved entry, and rides the answer here.
        if ((payload as Record<string, unknown>).keepListed === true) {
          store.update(target.id, { oldText: entry.newText })
          const afterEntry: PendingEntry = { ...entry, oldText: entry.newText, updatedAt: Date.now() }
          pushUndo(target.sessionId,
            { id: entry.path, path: entry.path, entry, fileText: undefined },
            { id: entry.path, path: entry.path, entry: afterEntry, fileText: undefined })
          persistSession(true)
          const value: DiffApprovalActionValue = { outcome: 'kept', resolved: true }
          return { ok: true, value }
        }
        // Snapshotted BEFORE the drop: the threads are what that call is about to take away.
        const beforeDrop = droppingComments({ id: entry.path, path: entry.path, entry, fileText: undefined })
        dropEntry(target.id)
        pushUndo(target.sessionId, beforeDrop,
          { id: entry.path, path: entry.path, entry: undefined, fileText: undefined })
        persistSession(true)
        const value: DiffApprovalActionValue = { outcome: 'kept' }
        return { ok: true, value }
      }
      case 'revert': {
        const target = targetOf(payload)
        if (target === undefined) return rpcError('sessionId and id must be non-empty strings')
        // Resolved through the request's merged view, so a row the reader can see is actionable and a row
        // outside its lineage answers `missing` — the same answer an id that names nothing gets.
        const lineage = lineageView()
        let entry = actionableEntryOf(lineage, target.sessionId, target.id)
        if (entry === undefined) {
          await ensureLoaded()
          entry = actionableEntryOf(lineage, target.sessionId, target.id)
          if (entry === undefined) {
            const value: DiffApprovalActionValue = { outcome: 'missing' }
            return { ok: true, value }
          }
        }
        // The REQUESTER governs the WRITE: the sandbox and workspace a revert runs under are the pressing
        // seat's own, never another session's (see `DiffApprovalUndoPair.policySession`). Visibility has
        // already established that this session shares a workspace with an owner of the row, so the file is
        // inside this session's workspace — and a press runs under the authority of the seat that pressed it
        // rather than silently borrowing a wider grant from whoever touched the file last. The undo pair
        // below is filed under that same pressing session (`pushUndo` canonicalizes the STACK, not this).
        // A revert that deletes a created file is not undoable (the file is
        // gone); a revert that writes keeps a snapshot for Ctrl+Z.
        let undo: { before: DiffApprovalUndoState; after: DiffApprovalUndoState } | undefined
        try {
          undo = await revertEntryContent(entry, target.sessionId, signal)
        } catch (error: unknown) {
          // A refusal by this session's own authority says so, and names the file; every other failure
          // (a missing file, a diverged one, an IO fault) keeps its own answer.
          if (isPolicyRefusal(error)) return policyRefusal(entry.path, error)
```

</details>

**依据 2 · 源码核查**：[src/persist.ts:140-199](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/persist.ts#L140-L199)

全局完整快照需留存治理。

<details>
<summary>查看原文（60行）</summary>

```text
/**
 * File-backed pending entries, one global file keyed by path.
 */
export class PendingPersistence {
  private readonly tails = new Map<string, Promise<unknown>>()
  private readonly globalFile: string

  /**
   * @param root - directory holding the global `pending.json` (and, pre-migration,
   * one JSON file per workspace).
   */
  constructor(private readonly root: string) {
    this.globalFile = join(root, 'pending.json')
  }

  /**
   * Load every persisted entry. Returns the global file's entries, or — when the
   * global file is absent — flattens the legacy per-workspace files so the
   * caller can fold them once and then save (which clears the legacy files).
   * @returns the entries plus whether they came from the legacy layout (awaiting
   * a save to finalize the migration).
   */
  async loadAll(): Promise<{ entries: PendingEntry[]; migratedLegacy: boolean }> {
    const global = await readJson(this.globalFile)
    if (global !== undefined) {
      const parsed = globalFileOf(this.globalFile, global)
      const entries: PendingEntry[] = []
      for (const row of parsed.entries) {
        const entry = pendingEntryOf(row)
        if (entry !== undefined) entries.push(entry)
      }
      return { entries: entries.sort((l, r) => l.updatedAt - r.updatedAt), migratedLegacy: false }
    }
    const legacy = await collectLegacy(this.root)
    if (legacy.length > 0) {
      return { entries: legacy.sort((l, r) => l.updatedAt - r.updatedAt), migratedLegacy: true }
    }
    return { entries: [], migratedLegacy: false }
  }

  /**
   * Replace the persisted entry set durably. Saves to the one file are
   * serialized; a previous save's failure does not block the next one. On a
   * legacy migration this also removes the per-workspace files.
   * @param entries - the complete entry list, possibly empty.
   * @returns resolution after the file is durable.
   */
  save(entries: readonly PendingEntry[]): Promise<void> {
    const task = async () => {
      await writeJsonAtomic(this.globalFile, { version: FILE_VERSION, entries })
      await removeLegacy(this.root)
    }
    const tail = this.tails.get(this.globalFile) ?? Promise.resolve()
    const run = tail.then(task, task)
    this.tails.set(this.globalFile, run.catch(() => {}))
    return run
  }
}

/** Flatten every legacy per-workspace file's entries (adding `sessionIds`). */
```

</details>

**依据 3 · 源码核查**：[src/index.ts:2057-2080](https://github.com/9087/dsh-diff-approval/blob/393bdc4c9b6ee007027c9e4da4d9732d60c9e168/src/index.ts#L2057-L2080)

删除回退不进入undo。

<details>
<summary>查看原文（24行）</summary>

```text
  async function revertEntryContent(entry: PendingEntry, sessionId: SessionId, signal: AbortSignal): Promise<{ before: DiffApprovalUndoState; after: DiffApprovalUndoState } | undefined> {
    const resolved = await ctx.fs.resolve(entry.path, { signal })
    if (entry.earlierVersion === 'none') {
      await removeRevert(resolved, sessionId, signal)
      return undefined
    }
    const preWrite = await ctx.fs.readText(resolved, undefined) ?? entry.newText
    const content = reencodeEol(entry.oldText, detectEol(entry.newText))
    await writeRevert(resolved, content, sessionId, signal)
    return {
      before: { id: entry.id, path: entry.path, entry, fileText: preWrite },
      after: { id: entry.id, path: entry.path, entry: undefined, fileText: content },
    }
  }

  // Undo/redo stacks, in memory only (lost on restart). Every undoable
  // keep/revert/block action pushes its before/after pair; undo restores
  // `before`, redo re-applies `after`. Actions that delete a file (revert of a
  // created file, block-revert to empty) are not pushed.
  //
  // PER LINEAGE ROOT, not per session and not global: an entry's id is globally unique (it is the path),
  // and a single LIFO queue across every session meant session B's Ctrl+Z could pop session A's keep and
  // report success — an action the reader never took, on a file they may not even be looking at.
  //
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
