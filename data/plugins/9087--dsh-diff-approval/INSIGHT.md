# dsh-diff-approval

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[c52399d](https://github.com/9087/dsh-diff-approval/tree/c52399da9e58cd46ab7403ce785d4f04579f0b71)

<!-- BEGIN META -->
[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/9087/dsh-diff-approval) [![npm 30d 4,671](https://img.shields.io/static/v1?label=npm+30d&message=4%2C671&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-diff-approval) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-diff-approval)
<!-- END META -->

> **实现功能**：记录DSH工具变更并在差异面板审阅、保留或回退，也可导入本地版本控制改动。

> **核心亮点**：把工具变更基线、细粒度审阅和会话讨论纳入同一流程，相对手工打开VCS减少切换；不替代权限审批或测试。见 [Q01](#research-q01)。

> **风险与缺陷**：Undo内容检查不等于所有回退都有并发保护，栈不跨重启且新增文件删除不可Undo；回退前需核实际内容。见 [Q03](#research-q03)。

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
  - [Q01 · 待审变更面板相对Git diff解决什么？](#detail-section-11)
  - [Q02 · 捕获、合并与回退分别使用什么基线？](#detail-section-12)
  - [Q03 · 回退和Undo是否能作为普遍恢复保证？](#detail-section-13)
  - [Q04 · 审阅便利需要什么持续投入？](#detail-section-14)
  - [Q05 · 哪些设计值得复用，怎样试用更稳妥？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适用于希望在会话中逐块审阅Agent改动的开发者，属于事后决定而非写入前批准。对照和验收见 [Q01](#research-q01)。

原生编辑器/VCS差异审阅；未以作者CI或功能数量推断正确性/速度，不将approval解释为预写门控。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 变更捕获 | 汇集edit/write/editor成功改动 | 不是所有外部变更 |
| 差异决定 | 整文件/块级保留或回退 | 已写入后的事后审阅 |
| Undo/Redo | 恢复部分决定 | 内存栈，新增删除例外 |
| VCS导入 | 纳入工具外本地改动 | CLI与扫描范围 |
| 待审持久化 | 重启后继续审阅 | 全局pending路径身份，非独立工作区文件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH fs/workspace/连接服务 | 必需 | 捕获、RPC和写回 | 不保证功能可用 |
| 可写待审存储 | 持久化必需 | 重启保留条目 | 错误需排查，Undo仍内存 |
| Git/SVN/Perforce CLI | 对应导入必需 | 读取本地变更 | 导入失败 |
| 工作树备份与人工测试 | 真实采用必需 | 恢复及语义验收 | Keep不等正确 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户备份临时工作树后安装重启 | 面板可见 |
| 2 | 制造创建/编辑/外改并核差异 | 基线对应实际内容 |
| 3 | 冻结外写，逐项Keep/Revert/Undo | 检查文件字节和删除例外 |
| 4 | 重启核pending并运行测试 | 不把待审持久化当Undo持久化 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地待审存储与客户端 | 备份工作树、核策略/基线 | 配置时间未知 |
| 持续使用 | 前后全文存储、diff/高亮 | 逐块语义判断与测试 | 大文件资源与净节时未测 |
| 失败恢复 | 回退/重试资源与备份 | 冻结外写，核部分完成内容 | 删除不可Undo，栈不跨重启 |
| 迁移退出 | pending.json与代码备份 | 核清未决条目再禁用 | 非版本控制备份替代品 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 变更汇集 | 指定工具成功结果与路径合并 | 所有shell/外部改动覆盖 |
| 策略一致 | 请求者sandbox写回 | 任意宿主策略实际执行 |
| 恢复 | 有条件Undo与持久待审 | 全回退竞态和重启后撤销 |

> **思考**：Undo内容检查不等于所有回退都有并发保护，栈不跨重启且新增文件删除不可Undo；回退前需核实际内容。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把工具变更基线、细粒度审阅和会话讨论纳入同一流程，相对手工打开VCS减少切换；不替代权限审批或测试。见 [Q01](#research-q01)。

把工具变更基线、细粒度审阅和会话讨论纳入同一流程，相对手工打开VCS减少切换；不替代权限审批或测试。见 [Q01](#research-q01)。

结构化捕获与请求者权限值得复用，统一路径身份和谱系可见性则需要严密状态管理；Undo前提可作为更普遍回退契约的参考。见 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

Undo内容检查不等于所有回退都有并发保护，栈不跨重启且新增文件删除不可Undo；回退前需核实际内容。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议单人可备份工作树先试用，回退前冻结外写并核实际文件，保持测试/VCS验收。范围和停止条件见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

捕获/合并/政策写回有源码支持；全回退竞态、实际恢复与性能未运行验证；原子内容前提是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/pending.ts、src/persist.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定宿主结果捕获、路径合并、回退/Undo、策略写回及持久化；未逐项覆盖所有客户端渲染/VCS适配、并发或真实宿主。
- 下一步：已检查源码，未运行目标代码、浏览器/VCS测试或真实宿主验收。

**分析版本**

- **仓库**：[9087/dsh-diff-approval](https://github.com/9087/dsh-diff-approval)
- **版本号**：0.36.1（[固定提交 c52399d](https://github.com/9087/dsh-diff-approval/tree/c52399da9e58cd46ab7403ce785d4f04579f0b71)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为给所有回退增加展示内容摘要与后端原子比较前提，以减少外写竞态；临时文件对照与否定边界见 [Q05](#research-q05)。

已检查源码，未运行目标代码、浏览器/VCS测试或真实宿主验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1280 | — | — | 14559 |
| .ts | test | 70 | 21824 | 16140 | 3693 | — |
| .ts | source | 54 | 27734 | 15837 | 10652 | — |
| .mjs | source | 4 | 1304 | 802 | 421 | — |
| .tsx | source | 10 | 15959 | 10092 | 5597 | — |
| .tsx | test | 6 | 18959 | 13418 | 3976 | — |
| .md | example | 6 | 443 | — | — | 2552 |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/9087/dsh-diff-approval/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/9087/dsh-diff-approval/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对事后待审变更的捕获、基线、回退与持久恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 待审变更面板相对Git diff解决什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是与Agent共同编辑、希望在会话中逐块决定保留/回退的开发者。合格结果是审阅对象和实际文件一致、用户决定只作用于明确范围、回退后内容可核对。相对命令行Git diff或编辑器审阅，贡献是自动捕捉指定工具结果、跨会话待办状态、细粒度决定及评论的集成；VCS导入补充宿主工具外改动。它是修改后的审阅，不是写入前批准，文件在工具成功时已被改动，不能因名字approval而当成预防性授权闸门。已有编辑器差异工具仍是直接替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-11](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/README.md#L11-L11)

作者明确successful mutations之后进入pending。

```text
A DeepSeek Harness (DSH) plugin for pending-change review: it automatically tracks every successful `edit`, `write`, and editor (`str_replace_editor`) mutation, folds them into a single pending list in the sidebar where each file's diff can be reviewed and kept/reverted — and it can also import the workspace's version-control repository's local changes (Git / SVN / Perforce) in one click.
```

**依据 2 · 作者声明**：[README.md:29-48](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/README.md#L29-L48)

作者列细粒度决定、撤销、VCS和持久化。

<details>
<summary>查看原文（20行）</summary>

```text
- **Diff view**: syntax-highlighted whole-file diff with +/− counts, an overview ruler on the scrollbar showing where changes sit, and an in-file search (`Ctrl+F`, step with `F3` / `Shift+F3`) that highlights matched words. Rows are virtualized, so huge files stay smooth. The line-number column keeps a surface of its own — a shade lighter than the code block, so the numbers read as a column rather than as part of the code — and stays pinned while the code scrolls sideways.
- **Block navigation & decisions**: jump between change blocks with `Ctrl+↑/↓` (or the previous/next buttons) — the focused block flashes, navigation is anchored to the scroll position and wraps at the top/bottom. Hover a block to **Keep** or **Revert** just that block from a small actions frame that also shows its position (e.g. "2/5"); after a single-block decision, focus advances to the next block. The lead rows left above the jumped-to block are configurable in settings.
- **Selection frame**: drag to select a range of lines and a frame appears to **Keep** / **Revert** exactly that range.
- **Per-file and bulk decisions**: the files in the file list can be kept / reverted one at a time, or **Keep all** / **Revert all** from its footer.
- **Resolved files stay listed**: once every change in a file has been kept/reverted, the entry remains in the list and the panel asks whether to remove it or keep it there.
- **Undo / Redo**: every keep, revert, import, and comment is undoable with `Ctrl+Z` / `Ctrl+Shift+Z` (rebindable in Shortcuts; `Ctrl+Y` remains an alias), active while the panel is open — text inputs keep their own editing.
- **Quick summon & file cycling**: `Ctrl+D` (configurable in settings) toggles the review panel from anywhere and `Esc` closes it; the panel is also one click away from the sidebar-foot row and from a button in the Session header beside the app's own controls; `Ctrl+Tab` / `Ctrl+Shift+Tab` cycle through the pending files.
- **Line references**: select text in the diff — the status bar shows its `(file:line)` / `(file:start-end)` reference; click it (or press `Ctrl+L`) to copy, and with the setting on it auto-pastes into the composer and focuses it. References in the composer and queued messages are **auto-aligned** when the referenced file changes: surviving lines re-map to their new range, and a fully-removed line becomes `(file:LINE_MISSING)`.
- **Highlight language**: auto-detected from the file extension, or overridden from a dropdown.
- **Auto-wrap**: a "Wrap lines" toggle beside the language selector wraps long lines for that language (CJK breaks between characters, Latin words stay whole), remembered per language.
- **Side-by-side split view**: an opt-in two-column diff (left "before" | right "current"), line-aligned with per-side horizontal scrolling and a shared vertical scrollbar. Toggle it from the toolbar or in settings (default: single-column unified view). In split view, changed blocks are aligned by content similarity and changed lines show intra-line word diffs — whole words for Latin text, per-character for CJK.
- **Markdown preview**: for Markdown files, toggle between the source-line diff and a rendered before/after preview (`Preview` / `Source`); the preview content max width is configurable. With "Structure-rendered Markdown diff" in the "Diff view" group on, the diff is mapped onto the document's own Markdown rendering — lists, tables and code blocks keep their structure — and even a change the rendering cannot show is marked. The switch is off by default; while it is off the preview keeps the original fragment renderer.
- **Customizable appearance**: from the "Diff view" settings group, adjust the diff's code font size (%), line height (px), the added / removed line colors, and the tab width (2 / 4 / 8 spaces), with a live preview.
- **Comments & annotations**: select any lines and write a comment. The card is anchored below the selected lines and holds the discussion with the agent. Comment mode is on by default and can be turned off in settings. The agent can comment on its own (annotate): asking it to annotate a piece of code is one way to read that code faster. Say "annotate this project's startup flow for me" and it marks the entry point, the initialisation order and the important branches, line by line, to be read in order. In the side-by-side view the comment quotes both sides of the change, the removed lines and the added ones, so the agent reads the whole replacement.
- **File menu**: on by default (the "File menu" row in the "Diff view" group turns it off). It takes over the click on some file links: a file row in the shell's edited / produced lists, an `@file` reference or file link in a message, and a relative link in this plugin's Markdown preview, and offers: **Open as usual** (the shell's own behaviour, replayed), **View in the review panel**, and **Copy file path**.
- **Bundled CJK code font**: the panel ships JetBrains Maple Mono, subset and sliced by `unicode-range`; it is on by default and can be turned off in settings.
- **External changes**: files already in the pending list are monitored — if one is later modified outside the reviewed edits (another tool, an editor), the panel adopts the new content and flags the divergence.
- **Open / Reveal**: while reviewing a file's diff, open it in its default app or reveal it in the system file manager with one click.
- **Import version-control changes**: when the list is empty, click the button to import the workspace's local changes from **Git / SVN / Perforce** — everything that is **not committed yet, staged or not** (Git is read against the last commit, the `git diff HEAD` view), plus deleted files and, opt-in, files the VCS has never seen (untracked / unversioned). The VCS root is found by walking up from the workspace, so a workspace inside a subdirectory works too.
- **Persistence**: pending state is stored per workspace at `<dshHome>/diff-approval/workspaces/<workspaceId>.json` and survives restarts — unhandled changes are still there when you come back, even in a fresh session.
```

</details>

**依据 3 · 源码核查**：[src/index.ts:2484-2496](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/src/index.ts#L2484-L2496)

实际在成功tools/result后折叠入状态。

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 捕获、合并与回退分别使用什么基线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

edit/write结果需有可信before/after，错误或无实际变化跳过；编辑器另有意图前后读盘。PendingDiffStore以绝对路径为全局身份，合并最早基线和较新内容及会话集合；创建后再编辑会把基线提升为刚创建内容，因而不再把整个文件当新增删除。回退由请求会话自己的sandbox政策执行，不借最后编辑者更宽权限。持久化代码当前是全局pending.json、单路径条目，兼容迁移旧分工作区布局；README的每工作区文件描述与代码不完全一致，运行范围应以当前源码为准而非默认为物理隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:422-454](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/src/index.ts#L422-L454)

工具结果before/after与创建基线。

<details>
<summary>查看原文（33行）</summary>

```text
 * tool's output schema declares exactly `{ path, before, after }`; anything
 * else is another tool's value or malformed data, which this recorder skips.
 * @param value - the successful result's JSON value.
 * @returns the outcome, or `undefined` when the value is not an edit outcome.
 */
function editOutcomeOf(value: unknown): OperationOutcome | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined
  const { path, before, after } = value as Record<string, unknown>
  if (typeof path !== 'string' || path.length === 0) return undefined
  if (typeof before !== 'string' || typeof after !== 'string') return undefined
  return { path, earlierVersion: 'file', oldText: before, newText: after }
}

/**
 * Narrow a successful `write` result value to an operation outcome. The write
 * tool's output schema declares `{ path, operation, before, after }`;
 * `operation: 'create'` becomes an entry with `earlierVersion: 'none'` (there is
 * no earlier version, so the whole-file action removes the file),
 * `operation: 'update'` one with `earlierVersion: 'file'`. An update whose
 * `before` is null carried no contextual basis, so it is skipped rather than
 * tracked as an un-revertable overwrite.
 * @param value - the successful result's JSON value.
 * @returns the outcome, or `undefined` when the value is not a trackable write.
 */
function writeOutcomeOf(value: unknown): OperationOutcome | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined
  const { path, operation, before, after } = value as Record<string, unknown>
  if (typeof path !== 'string' || path.length === 0) return undefined
  if (operation !== 'create' && operation !== 'update') return undefined
  if (typeof after !== 'string') return undefined
  if (operation === 'create') return { path, earlierVersion: 'none', oldText: '', newText: after }
  if (typeof before !== 'string') return undefined
  return { path, earlierVersion: 'file', oldText: before, newText: after }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:2484-2496](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/src/index.ts#L2484-L2496)

成功结果捕获。

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

**依据 3 · 源码核查**：[src/pending.ts:109-131](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/src/pending.ts#L109-L131)

路径身份、创建后编辑和会话合并。

<details>
<summary>查看原文（23行）</summary>

```text
  private mergeEntry(a: PendingEntry, b: PendingEntry): PendingEntry {
    const earlier = a.updatedAt <= b.updatedAt ? a : b
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
```

</details>

**依据 4 · 源码核查**：[src/index.ts:2804-2818](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/src/index.ts#L2804-L2818)

请求者政策控制回退。

<details>
<summary>查看原文（15行）</summary>

```text
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

**依据 5 · 源码核查**：[src/persist.ts:1-15](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/src/persist.ts#L1-L15)

当前全局存储及旧布局迁移。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Durable pending-entry persistence under the harness home: one global JSON
 * file holding one entry per file path (across all sessions and workspaces), at
 * `<storageDir>/pending.json`; the default root is `<dshHome>/diff-approval/workspaces`
 * and the plugin's `storageDir` config relocates it. Saves rewrite the whole
 * file (the entry set is small), staged as a sibling temp file and atomically
 * renamed, so a crash leaves either the old or the new file. A missing file
 * reads as empty; corrupt content and unknown versions throw.
 *
 * Legacy layout: the pre-global schema stored one JSON file per workspace
 * (`<storageDir>/<workspaceId>.json`, `{ version: 2, sessions: { [sessionId]:
 * PendingEntry[] } }`). On first load without a global file, `loadAll` scans for
 * those files, flattens every session's entries, and reports them so the caller
 * can fold them into the global store once; `save` then writes the global file
 * and deletes the legacy files.
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 回退和Undo是否能作为普遍恢复保证？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键质疑是审阅期间外部写入和不可撤销删除。whole-file revert读取当前内容供撤销快照后，把oldText写回；writeRevert没有传入内容比较前提，不能由Undo的divergence guard推成所有回退都有同样保护。Undo恢复确实比较expectedFile内容，不匹配拒绝，但栈只在内存中且新增文件删除不压栈，因此README“every revert undoable”须以此边界收窄。自动捕获只覆盖命名工具，shell改动须导入或已跟踪文件感知。用户在回退前应冻结外写并检查实际文件；批量操作也不能推成跨文件事务。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:2057-2075](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/src/index.ts#L2057-L2075)

回退、内存Undo与删除例外。

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1813-1817](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/src/index.ts#L1813-L1817)

写回没有expected内容前提参数。

```text
  async function writeRevert(target: FsTarget, content: string, sessionId: SessionId, signal: AbortSignal): Promise<unknown> {
    const policy = sandboxPolicyOf(sessionId)
    return policy === undefined
      ? ctx.fs.writeText(target, content, undefined, signal)
      : ctx.fs.writeText(target, content, undefined, signal, policy)
```

**依据 3 · 源码核查**：[src/index.ts:2351-2375](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/src/index.ts#L2351-L2375)

Undo有内容检查但批量逐项恢复。

<details>
<summary>查看原文（25行）</summary>

```text
    if (state.fileText !== undefined) {
      const resolved = await ctx.fs.resolve(state.path, { signal })
      if (expectedFile?.fileText !== undefined) {
        const current = await ctx.fs.readText(resolved, undefined)
        if (current !== expectedFile.fileText) {
          throw new Error('the file changed outside the review after the action; undo is unavailable')
        }
      }
      // The snapshot is the exact bytes the action wrote (line-endings already
      // adjusted), so restore writes it verbatim — reproducing the action
      // regardless of the current line-ending-sensitivity setting.
      if (progress !== undefined) progress.path = state.path
      await writeRevert(resolved, state.fileText, sessionId, signal)
      if (progress !== undefined) progress.written += 1
    }
    if (state.batch !== undefined) {
      // A batch is ONE decision over several entries — one VCS import, or one keep/revert asked of a
      // pick of files — so restoring it is restoring each item in turn. An item that carries `fileText`
      // writes its file exactly as a lone state does: the session-wide 全部回退 has always put the bytes
      // each file held into its undo states, and this branch used to ignore them, so undoing it brought
      // the rows back while the files stayed reverted on disk. The counterpart item is the same index on
      // the other side, so a single restore's divergence guard applies here too.
      const counterpart = expectedFile?.batch
      for (const [index, item] of state.batch.entries()) {
        await restoreState(sessionId, { ...item, batch: undefined }, counterpart?.[index], signal, scope, progress)
```

</details>

**依据 4 · 作者声明**：[README.md:84-90](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/README.md#L84-L90)

作者声明自动捕获与VCS/新建删除边界。

```text
## 📝 Notes

- Only tracked mutations (`edit`, `write`, and `str_replace_editor` editor calls) are recorded automatically. Deletions made outside these tools (e.g. shell `rm`) are sensed only for tracked files: the entry turns "File is gone" and its Revert restores the file.
- The VCS import runs read-only Git/SVN/Perforce commands through the deployment's shell executor, so the respective CLI must be on `PATH`. Including files version control has not seen (default off) scans the whole workspace, which can be slow on large trees.
- For a newly-created file, the whole-file revert action reads **Delete** and removes the file.
- Reverting a file writes it back with its current line endings (LF / CRLF) preserved.
- Sessions with no workspace keep their entries memory-only; corrupt persistence files are rejected and can be deleted to reset.
```

#### 缺口

- 外部写入竞态、批量部分失败与重启后的恢复未复现
  **影响**：不能宣称所有决定可撤销或不会覆盖新编辑
  **进一步探讨**：在临时工作树交错外写、回退/Undo与重启，核每个文件实际字节和已完成动作

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 审阅便利需要什么持续投入？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要兼容DSH连接、文件系统、workspace和策略服务以及浏览器UI；VCS导入另外要求相应Git/SVN/Perforce CLI，未跟踪扫描可能遍历大树。持久记录保存前后全文会占磁盘，差异语法高亮/Markdown渲染消耗客户端资源；源码中的虚拟化声明不等实际大文件性能。人需逐块判断业务语义，Keep只是接受当前变更，不能代替测试。恢复成本包括保存工作树备份、识别外部改动、检查存储错误和不可Undo删除；无实际耗时/资源数据，不能推出比原生编辑器总体更快。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:86-90](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/README.md#L86-L90)

CLI与扫描/删除/存储条件。

```text
- Only tracked mutations (`edit`, `write`, and `str_replace_editor` editor calls) are recorded automatically. Deletions made outside these tools (e.g. shell `rm`) are sensed only for tracked files: the entry turns "File is gone" and its Revert restores the file.
- The VCS import runs read-only Git/SVN/Perforce commands through the deployment's shell executor, so the respective CLI must be on `PATH`. Including files version control has not seen (default off) scans the whole workspace, which can be slow on large trees.
- For a newly-created file, the whole-file revert action reads **Delete** and removes the file.
- Reverting a file writes it back with its current line endings (LF / CRLF) preserved.
- Sessions with no workspace keep their entries memory-only; corrupt persistence files are rejected and can be deleted to reset.
```

**依据 2 · 源码核查**：[src/persist.ts:2-8](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/src/persist.ts#L2-L8)

前后内容全局JSON存储方式。

```text
 * Durable pending-entry persistence under the harness home: one global JSON
 * file holding one entry per file path (across all sessions and workspaces), at
 * `<storageDir>/pending.json`; the default root is `<dshHome>/diff-approval/workspaces`
 * and the plugin's `storageDir` config relocates it. Saves rewrite the whole
 * file (the entry set is small), staged as a sibling temp file and atomically
 * renamed, so a crash leaves either the old or the new file. A missing file
 * reads as empty; corrupt content and unknown versions throw.
```

**依据 3 · 源码核查**：[package.json:44-58](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/package.json#L44-L58)

客户端服务依赖。

<details>
<summary>查看原文（15行）</summary>

```text
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
    "typecheck": "tsc -b tsconfig.json",
```

</details>

**依据 4 · 源码核查**：[src/index.ts:2072-2075](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/src/index.ts#L2072-L2075)

重启后Undo消失和删除例外。

```text
  // Undo/redo stacks, in memory only (lost on restart). Every undoable
  // keep/revert/block action pushes its before/after pair; undo restores
  // `before`, redo re-applies `after`. Actions that delete a file (revert of a
  // created file, block-revert to empty) are not pushed.
```

#### 缺口

- 大文件、多会话与长时间持久记录的实际资源/审阅时间未知
  **影响**：不能量化性能与总成本
  **进一步探讨**：同一变更集比较编辑器/VCS审阅和本面板，记录漏审、误回退、资源与人工时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些设计值得复用，怎样试用更稳妥？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

可借鉴的是工具结果的结构化变更捕获、回退政策跟随请求者、Undo的expected内容检查及显式创建基线；代价是全局路径身份、谱系可见性与多状态恢复的复杂性。未验证假设是让所有回退绑定展示时内容摘要并由文件系统原子比较发布，可能缩小审阅到点击之间的竞态。最小验证在临时文件上交错外写，比较现有whole-file revert、Undo检查和候选摘要前提，测误覆盖/误拒绝与恢复时间；若后端不支持原子前提仍有同等竞态，则不能宣称已解决。建议trial于单人、可备份工作树，先核创建/多次编辑/删除/回退/重启，再决定用于真实变更；保持测试与版本控制作为最终验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:2804-2818](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/src/index.ts#L2804-L2818)

请求者权限边界。

<details>
<summary>查看原文（15行）</summary>

```text
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

**依据 2 · 源码核查**：[src/index.ts:2351-2364](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/src/index.ts#L2351-L2364)

已有expected检查的可借鉴机制。

<details>
<summary>查看原文（14行）</summary>

```text
    if (state.fileText !== undefined) {
      const resolved = await ctx.fs.resolve(state.path, { signal })
      if (expectedFile?.fileText !== undefined) {
        const current = await ctx.fs.readText(resolved, undefined)
        if (current !== expectedFile.fileText) {
          throw new Error('the file changed outside the review after the action; undo is unavailable')
        }
      }
      // The snapshot is the exact bytes the action wrote (line-endings already
      // adjusted), so restore writes it verbatim — reproducing the action
      // regardless of the current line-ending-sensitivity setting.
      if (progress !== undefined) progress.path = state.path
      await writeRevert(resolved, state.fileText, sessionId, signal)
      if (progress !== undefined) progress.written += 1
```

</details>

**依据 3 · 源码核查**：[src/index.ts:2057-2068](https://github.com/9087/dsh-diff-approval/blob/c52399da9e58cd46ab7403ce785d4f04579f0b71/src/index.ts#L2057-L2068)

全回退前提假设来自具体路径。

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
