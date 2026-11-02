# Flowix

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[a48d45c](https://github.com/text2future/flowix/tree/a48d45ca42cdfb252f80c0c2db5d213bf904546d)

<!-- BEGIN META -->
[![GitHub ★ 493](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=493&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/text2future/flowix)
<!-- END META -->

> **功能**：本地 Markdown 笔记客户端，让人工写作与多个 Agent 共用可持续读写的上下文。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 以同一可读Markdown连接人工与Agent，并协调版本/冲突，减少双份记忆维护。

> **主要限制**：[Q02](#research-q02)正文Saved非索引追平；[Q03](#research-q03)CLI当次基线非Agent旧读版本，文件共用不等语义一致或全结构可迁移。

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
  - [Q01 · 根客户端如何让笔记成为Agent上下文？](#detail-section-11)
  - [Q02 · 人工保存、冲突与索引怎样接线？](#detail-section-12)
  - [Q03 · 共同文件怎样仍会失效，代价在哪里？](#detail-section-13)
  - [Q04 · 采用条件与下一步假设？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护长期项目知识的个人/小团队希望人工与Agent共用笔记。

Markdown编辑器加独立Agent/脚本；普通文件不是本项目独有。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 共同Markdown | 人工/Agent可读写交付 | 不等语义一致/完全本地计算 |
| 编辑保存协调 | buffer CAS/merge/冲突 | CLI旧读语义另核 |
| 派生索引 | 检索与视图 | 正文Saved非全部追平 |
| Agent接入 | 按笔记继续任务 | 各桥/模型/披露未全审 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Flowix客户端/CLI/正确binary | 必需 | 编辑与Agent访问 | 发布等价未验 |
| 笔记目录/索引/备份 | 必需 | 原文与派生视图 | Saved/pending分开 |
| 选定Agent/模型/同步 | 对应功能需要 | 上下文/外部工作 | 披露/价格另核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户副本导入/备份 | 原文/附属结构可读 |
| 协作 | 人工编辑并选择Agent上下文 | 核实际输入与版本 |
| 写回 | Agent授权目标小改 | 核disk/index/重开 |
| 异常退出 | 停写/对账/导出 | 回原编辑器和备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 客户端/CLI/副本空间 | 迁入/模型配置 | 费用耗时未测 |
| 持续 | 索引/模型/同步 | 上下文和写回复核 | 净收益未知 |
| 失败恢复 | 原文/索引/同步副本 | 分清正文和派生结果 | 真实恢复未测 |
| 退出 | Markdown与附属结构 | 导出重开/停连接 | 全结构迁移未审 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 共同上下文 | Markdown/客户端/CLI | 同任务质量节时 |
| 保存保护 | 版本/CAS/merge/atomic | 语义合理与全端竞争 |
| 检索 | index pending/重建边界 | 真实追平时延/召回 |
| 退出 | 普通文件可读 | 附件/任务/同步全迁移 |

> **思考**：[Q02](#research-q02)正文Saved非索引追平；[Q03](#research-q03)CLI当次基线非Agent旧读版本，文件共用不等语义一致或全结构可迁移。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 以同一可读Markdown连接人工与Agent，并协调版本/冲突，减少双份记忆维护。

[Q02](#research-q02) buffer版本、受锁条件写/三方merge、atomic与index pending真实存在；不推成全客户端事务保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)正文Saved非索引追平；[Q03](#research-q03)CLI当次基线非Agent旧读版本，文件共用不等语义一致或全结构可迁移。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 副本核人工编辑/检索/小范围写回/重开，异常停Agent写并回原文/备份。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根客户端保存/索引与CLI关键链源码核查，未运行桌面/Agent/同步；限定副本笔记本试用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、app/flowix-web/features/document/store/save-queue.ts、app/flowix-web/features/document/use-cases/local-document-operations.ts、app/flowix-desktop/src/commands/external_document.rs、app/flowix-core/src/memo_file/file_io.rs、app/flowix-core/src/memo_file/note_index.rs、app/flowix-core/src/service.rs、app/flowix-cli/src/path_store.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根声明及前端save-queue/write adapter、Desktop external document IPC、core file_io/note_index/service和CLI path_store关键段；复核旧findings。未全面审多Agent桥/云同步/所有附件结构/模板，不执行目标。
- 下一步：双编辑器+CLI交错/语义merge/索引故障与重启、全结构导出重开对照，计有效模型输入与恢复成本。

**分析版本**

- **仓库**：[text2future/flowix](https://github.com/text2future/flowix)
- **版本号**：1.5.16（[固定提交 a48d45c](https://github.com/text2future/flowix/tree/a48d45ca42cdfb252f80c0c2db5d213bf904546d)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 跨端正文版本/索引追平合同可探索，若现有CAS/pending等效或负担更高即否定。

双编辑器+CLI交错/语义merge/索引故障与重启、全结构导出重开对照，计有效模型输入与恢复成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 934 | 29838 | — | — | 412343 |
| .js | source | 67 | 7814 | 6749 | 590 | — |
| .ts | source | 879 | 110348 | 93396 | 8755 | — |
| .ts | test | 333 | 50703 | 45297 | 828 | — |
| .tsx | source | 327 | 70743 | 63122 | 3675 | — |
| .tsx | test | 124 | 18926 | 17042 | 240 | — |
| .mjs | source | 49 | 5866 | 4926 | 489 | — |
| .mjs | test | 13 | 1175 | 939 | 103 | — |
| .md | example | 1 | 10 | — | — | 55 |
| .js | example | 7 | 853 | 740 | 58 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/text2future/flowix/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根客户端共同Markdown的正文版本/索引边界与采用代价。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根客户端如何让笔记成为Agent上下文？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Flowix根是本地Markdown笔记客户端，连接人工写作、任务/对话和外部Agent，DSH MCP接入另在dsh-flowix-memory子包；不能把根再算一份原生插件。面向长期维护项目背景、决策和研究资料的个人/小团队，它用同一普通Markdown做人工可读交付和Agent读写对象，比另建隐形记忆库少一份同步；与编辑器+独立CLI相比，价值是同一界面/身份协调而非Markdown本身创新。合格结果是正确版本被Agent使用，人工仍可改、写回可解释和下次可检索。

本轮聚焦正文保存/派生索引这一核心主张，未把大量场景模板当真实用户案例，也不全面承诺所有多Agent桥/同步服务。作者说只交主动选择内容，实际具体Agent/模型权限仍须逐接线核，文件本地并不证明后续上下文不出网。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:27-52](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/README.md#L27-L52)

作者同笔记/多Agent场景。

<details>
<summary>查看原文（26行）</summary>

```text
## Flowix 让笔记成为持续工作的记忆

用 Markdown 记录内容，把需要的上下文交给 Agent，再将结果写回同一篇笔记，方便检查、修改和下次继续使用。

<img src="./docs/images/home-write.png" width="100%" alt="Flowix 笔记在浅色与深色主题中的界面" />

---

## 让工作持续推进

把产品、开发、研究和个人知识放在一起，让 Agent 不必每次从头开始。

| 场景 | 说明 |
| --- | --- |
| **产品工作** | 集中管理需求、反馈和决策，让产品文档保持最新。 |
| **软件开发** | 保存项目背景和约束，让编码 Agent 接着推进。 |
| **课题研究** | 将资料、分析和结论放在一起，方便追溯和复用。 |
| **个人知识** | 让笔记、计划和个人偏好成为 Agent 可用的上下文。 |

<p align="center"><img src="./docs/images/home-nav.png" width="60%" alt="Flowix 中的笔记、对话、任务与标签导航" /></p>

---

## 让不同 Agent 使用同一份记忆

你可以在 Flowix 内使用 Agent，也可以连接 **Codex**、**Claude Code**、**OpenCode**、**Hermes** 及其他 MCP 或 CLI 工具，让它们基于同一套笔记和上下文工作。
```

</details>

**依据 2 · 源码核查**：[README.md:66-76](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/README.md#L66-L76)

独立DSH子包。

<details>
<summary>查看原文（11行）</summary>

````text
## dsh-flowix-memory 插件

[dsh-flowix-memory](dsh-flowix-memory/README.md) 是一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件，通过捆绑的 `flowix-cli` MCP server 把任何 Harness Agent 连接到你的**本地 Flowix 笔记**：安装后 Agent 获得 `mcp__flowix__memo` 工具，可搜索、读取、创建和编辑 Flowix 笔记（包括思维导图）。

从 flowix-main checkout 安装到 `flowix` Harness profile（尚未发布到 npm）。对于其他 DSH 客户端，`flowix` 只是一个普通的自定义 profile 名称：

```sh
dsh plugin --profile flowix add ./dsh-flowix-memory
```

需要 `flowix` CLI 位于 `PATH`（或设置 `FLOWIX_CLI_PATH`），并可访问你的笔记数据（`~/.flowix`）。详见[插件 README](dsh-flowix-memory/README.md)。
````

</details>

**依据 3 · 源码核查**：[README.md:98-104](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/README.md#L98-L104)

本地Markdown/主动选内容声明。

```text
## 笔记留在本地，由你掌控

Flowix 将笔记保存为本地 Markdown 文件。你决定 Agent 能看到什么，也可以自由选择同步和备份方式。

- **保存在本地** — 笔记是普通 Markdown 文件，可以用其他应用打开和编辑。
- **按需连接 Agent** — 使用 Codex、Claude Code、OpenCode 等 Agent 时，只提供你主动选择的内容。
- **自由同步和备份** — 继续使用你熟悉的同步、备份或版本管理工具。
```

**依据 4 · 源码核查**：[package.json:1-10](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/package.json#L1-L10)

私有根客户端版本/许可。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "flowix",
  "private": true,
  "version": "1.5.16",
  "license": "AGPL-3.0-only",
  "type": "module",
  "packageManager": "npm@10.8.2",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build && node scripts/check-web-bundle.mjs",
```

</details>

#### 缺口

- 实际用户任务、选择内容边界和多Agent全部接线未验。
  **影响**：不能从界面/模板证明协作效果或全数据最小化。
  **进一步探讨**：副本笔记本做人工→Agent→人工完整任务，记录有效上下文和合格结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 人工保存、冲突与索引怎样接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

前端save queue按文档身份串行、执行前读expected baseline、成功回调按buffer revision记账，编辑期间变化会再排保存；调用localDocumentOperations→externalDocuments.write。Rust write_external_document接operation id、window、scope/expectedContent并先解析授权路径；Markdown走merge条件写，非Markdown走CAS。底层锁内读disk，旧base不同尝试三方Markdown merge，冲突/不支持拒绝；NamedTempFile/sync/persist原子换文件，不能说没有并发/原子防护。

正文成功后刷新metadata/列表/同步事件有独立错误处理；共享NoteService路径写也在正文Saved后尝试刷新index，失败标pending并warn，返回Saved含可空index，service必要时从磁盘派生document。因此保存结果应分正文与派生索引，不应因搜索暂未命中重写正文，也不能把Saved当所有索引/视图已追平。CLI全文write同服务但caller未传早先show基线，只有CLI当次get后短窗口保护，与桌面buffer CAS不同。

#### 证据与依据

**依据 1 · 源码核查**：[app/flowix-web/features/document/store/save-queue.ts:48-108](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-web/features/document/store/save-queue.ts#L48-L108)

前端串行/版本和CAS回调。

<details>
<summary>查看原文（61行）</summary>

```text
export function scheduleSave(ctx: SaveContext, content: string): Promise<boolean> {
  return enqueueDocumentCommit(ctx.queueKey, 'body', async () => {
    if (ctx.isBlocked?.()) return false;
    const snapshot = ctx.latest?.() ?? { content, revision: ctx.revision };
    // Keep the in-flight revision aligned even when equivalent bytes only
    // need acknowledgement; onSaved must be able to clear that revision.
    ctx.onStarted?.(snapshot.revision);
    let savedContent: string | null;
    if (!ctx.force && snapshot.content === ctx.readExpected()) {
      // A previous job may have saved these bytes while this intent waited.
      // Acknowledge the newer equivalent revision without sending a second IPC.
      const displayId = ctx.queueKey.startsWith('md:') ? ctx.queueKey.slice(3) : null;
      const path = displayId ? findFileDisplayPath(displayId) ?? ctx.path : ctx.path;
      ctx.onSaved(path, snapshot.content, snapshot.revision, snapshot.content, false);
      savedContent = snapshot.content;
    } else {
      savedContent = await runOne({ ...ctx, revision: snapshot.revision }, snapshot.content);
    }
    const latest = ctx.latest?.();
    if (savedContent !== null && latest && latest.content !== savedContent && !ctx.isBlocked?.()) {
      void scheduleSave(ctx, latest.content);
    }
    return savedContent !== null && !ctx.isBlocked?.();
  });
}

async function runOne(ctx: SaveContext, content: string): Promise<string | null> {
  const expected = ctx.readExpected();
  try {
    const displayId = ctx.queueKey.startsWith('md:') ? ctx.queueKey.slice(3) : null;
    const path = displayId ? findFileDisplayPath(displayId) ?? ctx.path : ctx.path;
    const write = (target: string) => localDocumentOperations.write({
      path: target, scopePath: ctx.scopePath, content, expectedContent: expected,
    });
    let attemptedPath = path;
    let result = await write(attemptedPath);
    const rebasedPath = displayId ? findFileDisplayPath(displayId) : null;
    if ((result.status === 'refused' || result.status === 'missing') && rebasedPath && rebasedPath !== attemptedPath) {
      // Only a confirmed runtime rebase may redirect an old in-flight request.
      attemptedPath = rebasedPath;
      result = await write(attemptedPath);
    }
    if (result.status === 'saved') {
      const latestPath = displayId ? findFileDisplayPath(displayId) : null;
      const writtenPath = canonicalPath(result.path) === canonicalPath(attemptedPath) && latestPath ? latestPath : result.path;
      ctx.onSaved(writtenPath, result.content, ctx.revision, content, result.merged === true);
      return result.content;
    }
    if (result.status === 'conflict' || result.status === 'refused') {
      ctx.onCasRefused(content, ctx.revision);
      return null;
    }
    const message = result.status === 'missing'
      ? `External document is unavailable: ${ctx.path}`
      : result.message;
    ctx.onError(content, ctx.revision, new Error(message));
    return null;
  } catch (err) {
    logger.error('IPC threw', { path: ctx.path, err });
    ctx.onError(content, ctx.revision, err);
    return null;
```

</details>

**依据 2 · 源码核查**：[app/flowix-web/features/document/use-cases/local-document-operations.ts:16-23](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-web/features/document/use-cases/local-document-operations.ts#L16-L23)

前端write适配。

```text
  read: ({ path, scopePath }) => externalDocuments.read(path, scopePath),
  write: async ({ path, content, expectedContent, scopePath }) => {
    const result = await externalDocuments.write({
      filePath: path,
      content,
      expectedContent,
      scopePath,
    });
```

**依据 3 · 源码核查**：[app/flowix-desktop/src/commands/external_document.rs:279-354](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-desktop/src/commands/external_document.rs#L279-L354)

IPC授权路径、条件写与保存后刷新。

<details>
<summary>查看原文（76行）</summary>

```text
pub async fn write_external_document(
    window: tauri::WebviewWindow,
    operation_id: Option<String>,
    file_path: String,
    content: String,
    expectedContent: Option<String>,
    scopePath: Option<String>,
    app: tauri::AppHandle,
) -> ExternalDocumentWriteOutcome {
    crate::commands::document_operations::run(
        "save_external",
        operation_id,
        window.label().to_owned(),
        move || {
            Ok((|| {
                let state = app.state::<AppState>();
                let watches = app.state::<ExternalDocumentWatchState>();
                let path = match exact_existing_external_path(
                    &file_path,
                    scopePath.as_deref(),
                    window.label(),
                    &state,
                ) {
                    Ok(path) => path,
                    Err(_) if !Path::new(&file_path).is_file() => {
                        return ExternalDocumentWriteOutcome::Missing
                    }
                    Err(message) => return ExternalDocumentWriteOutcome::Error { message },
                };

                let memo_file = read_lock(&state.memo_file, "memo_file");
                let notebook_ids = match memo_file.notebook_ids_for_paths(&[&path]) {
                    Ok(ids) => ids,
                    Err(error) => return ExternalDocumentWriteOutcome::Error { message: error.to_string() },
                };
                // Capture membership independently of which pages the UI has loaded.
                let previous_favorited = notebook_note_address(&memo_file, &path).ok().flatten()
                    .and_then(|(notebook_id, relative_path)| memo_file
                        .read_indexed_note_entry_by_path(&notebook_id, &relative_path).ok().flatten())
                    .map(|entry| entry.favorited);
                watches.begin_window_write(&app, &path);
                let outcome = if is_markdown_document_path(&path) {
                    match notebook_ids.as_slice() {
                        [notebook_id] => memo_file.write_markdown_merging_for_notebook(notebook_id, &path, &content, expectedContent.as_deref()),
                        [] => memo_file.write_markdown_merging(&path, &content, expectedContent.as_deref()),
                        _ => memo_file.write_markdown_merging_for_registered_path(&path, &content, expectedContent.as_deref()),
                    }
                } else {
                    match notebook_ids.as_slice() {
                        [notebook_id] => memo_file.write_file_if_matches_for_notebook(notebook_id, &path, &content, expectedContent.as_deref()),
                        [] => memo_file.write_file_if_matches(&path, &content, expectedContent.as_deref()),
                        _ => memo_file.write_file_if_matches_for_registered_path(&path, &content, expectedContent.as_deref()),
                    }
                        .map(|outcome| match outcome {
                            FileWriteOutcome::Saved => MergedFileWriteOutcome::Saved {
                                content: content.clone(), merged: false,
                            },
                            FileWriteOutcome::Conflict { disk_content } => {
                                MergedFileWriteOutcome::Conflict { disk_content }
                            }
                        })
                };
                let saved_content = match &outcome {
                    Ok(MergedFileWriteOutcome::Saved { content, .. }) => Some(content.as_str()),
                    _ => None,
                };
                watches.finish_window_write(
                    &app, window.label(), &path,
                    saved_content,
                );
                let (saved_content, merged) = match outcome {
                    Ok(MergedFileWriteOutcome::Saved { content, merged }) => {
                        match refresh_saved_notebook_note(&memo_file, &path, window.label(), previous_favorited) {
                            Ok(Some(change)) => change.emit(&app),
                            Ok(None) => {},
                            Err(error) => tracing::warn!(path = %path.display(), "saved note metadata notification failed: {error}"),
```

</details>

**依据 4 · 源码核查**：[app/flowix-core/src/memo_file/file_io.rs:19-37](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-core/src/memo_file/file_io.rs#L19-L37)

临时文件sync/persist。

<details>
<summary>查看原文（19行）</summary>

```text
pub fn atomic_write_bytes(path: &Path, content: &[u8]) -> io::Result<()> {
    let path = dunce::canonicalize(path).unwrap_or_else(|_| path.to_path_buf());
    let parent = path
        .parent()
        .ok_or_else(|| io::Error::other("file has no parent"))?;
    fs::create_dir_all(parent)?;
    let permissions = match fs::metadata(&path) {
        Ok(metadata) => Some(metadata.permissions()),
        Err(error) if error.kind() == io::ErrorKind::NotFound => None,
        Err(error) => return Err(error),
    };
    let mut temporary = tempfile::NamedTempFile::new_in(parent)?;
    temporary.write_all(content)?;
    if let Some(permissions) = permissions {
        temporary.as_file().set_permissions(permissions)?;
    }
    temporary.as_file().sync_all()?;
    temporary.persist(&path).map_err(|error| error.error)?;
    Ok(())
```

</details>

**依据 5 · 源码核查**：[app/flowix-core/src/memo_file/file_io.rs:125-154](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-core/src/memo_file/file_io.rs#L125-L154)

受锁写入口。

<details>
<summary>查看原文（30行）</summary>

```text
    pub fn write_file_if_matches_for_notebook(
        &self,
        notebook_id: &str,
        path: &Path,
        content: &str,
        expected: Option<&str>,
    ) -> io::Result<FileWriteOutcome> {
        self.with_file_write(notebook_id, path, FileLockIntent::Existing, "write_file_if_matches", |path| {
            write_file_if_matches_locked(path, content, expected)
        })
    }

    pub fn write_file_if_matches_for_registered_path(
        &self, path: &Path, content: &str, expected: Option<&str>,
    ) -> io::Result<FileWriteOutcome> {
        self.with_registered_path_change(&[path], "write_file_nested_notebooks", || {
            write_file_if_matches_locked(path, content, expected)
        })
    }

    pub fn write_markdown_merging_for_notebook(
        &self,
        notebook_id: &str,
        path: &Path,
        content: &str,
        expected: Option<&str>,
    ) -> io::Result<MergedFileWriteOutcome> {
        self.with_file_write(notebook_id, path, FileLockIntent::Existing, "write_markdown_merging", |path| {
            write_markdown_merging_locked(path, content, expected)
        })
```

</details>

**依据 6 · 源码核查**：[app/flowix-core/src/memo_file/file_io.rs:208-242](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-core/src/memo_file/file_io.rs#L208-L242)

CAS/三方merge/冲突。

<details>
<summary>查看原文（35行）</summary>

```text
fn write_file_if_matches_locked(path: &Path, content: &str, expected: Option<&str>) -> io::Result<FileWriteOutcome> {
    let disk_content = fs::read_to_string(path)?;
    if expected.is_some_and(|expected| expected != disk_content) {
        return Ok(FileWriteOutcome::Conflict { disk_content });
    }
    atomic_write_bytes(path, content.as_bytes())?;
    Ok(FileWriteOutcome::Saved)
}

fn write_markdown_merging_locked(
    path: &Path,
    content: &str,
    expected: Option<&str>,
) -> io::Result<MergedFileWriteOutcome> {
        let disk_content = fs::read_to_string(path)?;
        let (content, merged) = match expected {
            Some(base) if base != disk_content => {
                match crate::text_merge::merge_markdown(
                    base.as_bytes(),
                    content.as_bytes(),
                    disk_content.as_bytes(),
                ) {
                    crate::text_merge::MergeOutcome::Merged(bytes) => {
                        (String::from_utf8(bytes).map_err(io::Error::other)?, true)
                    }
                    crate::text_merge::MergeOutcome::Conflict
                    | crate::text_merge::MergeOutcome::Unsupported => {
                        return Ok(MergedFileWriteOutcome::Conflict { disk_content });
                    }
                }
            }
            _ => (content.to_owned(), false),
        };
        atomic_write_bytes(path, content.as_bytes())?;
        Ok(MergedFileWriteOutcome::Saved { content, merged })
```

</details>

**依据 7 · 源码核查**：[app/flowix-core/src/memo_file/note_index.rs:351-395](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-core/src/memo_file/note_index.rs#L351-L395)

正文Saved后索引pending。

<details>
<summary>查看原文（45行）</summary>

```text
    pub(crate) fn write_note_by_path_with_result(
        &self,
        notebook_id: &str,
        relative_path: &str,
        content: &str,
        expected_content: Option<&str>,
    ) -> io::Result<NoteWriteResult> {
        let root = self.notebook_root_for_note(notebook_id)?;
        let path = self.validate_note_path(&root, relative_path, true)?;
        super::frontmatter::extract_document_metadata_tolerant(content)
            .map_err(|error| io::Error::new(io::ErrorKind::InvalidData, error.to_string()))?;
        match self.write_file_if_matches_for_notebook(
            notebook_id,
            &path,
            content,
            expected_content,
        )? {
            super::FileWriteOutcome::Conflict { disk_content } => {
                Ok(NoteWriteResult::Conflict { disk_content })
            }
            super::FileWriteOutcome::Saved => {
                let index_entry = match self.refresh_note_path_with_content(
                    notebook_id,
                    relative_path,
                    content,
                ) {
                    Ok(()) => self
                        .read_indexed_note_entry_by_path(notebook_id, relative_path)
                        .ok()
                        .flatten(),
                    Err(error) => {
                        mark_note_index_refresh_pending_logged(&root, notebook_id, relative_path);
                        tracing::warn!(
                            notebook_id,
                            relative_path,
                            "note saved but path index refresh failed: {error}"
                        );
                        None
                    }
                };
                Ok(NoteWriteResult::Saved {
                    content: content.to_string(),
                    index_entry,
                })
            }
```

</details>

**依据 8 · 源码核查**：[app/flowix-core/src/service.rs:375-412](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-core/src/service.rs#L375-L412)

文档派生。

<details>
<summary>查看原文（38行）</summary>

```text
    pub(crate) fn save_note_by_path(
        &mut self,
        notebook_key: &str,
        relative_path: &str,
        content: &str,
        expected_content: Option<&str>,
    ) -> Result<NoteSaveOutcome, FlowixError> {
        let notebook = self.resolve_notebook(notebook_key)?;
        match self.memo_file.write_note_by_path_with_result(
            &notebook.id,
            relative_path,
            content,
            expected_content,
        )? {
            NoteWriteResult::Conflict { disk_content } => {
                Ok(NoteSaveOutcome::Conflict { disk_content })
            }
            NoteWriteResult::Saved {
                content,
                index_entry,
            } => {
                let entry = match index_entry {
                    Some(entry) => entry,
                    None => self
                        .memo_file
                        .derive_note_entry_from_disk(&notebook.id, relative_path)?,
                };
                let path = notebook_path_from_relative(
                    &PathBuf::from(&notebook.path),
                    &entry.relative_path,
                )
                .map_err(FlowixError::InvalidInput)?;
                Ok(NoteSaveOutcome::Saved(NoteDocument {
                    entry,
                    notebook,
                    path,
                    body: content,
                }))
```

</details>

**依据 9 · 源码核查**：[app/flowix-cli/src/path_store.rs:134-148](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-cli/src/path_store.rs#L134-L148)

CLI内部新读基线。

<details>
<summary>查看原文（15行）</summary>

```text
pub(crate) fn write(raw: &str, content: &str) -> Result<Value, CliError> {
    if content.trim().is_empty() {
        return Err(CliError::Usage("write: content is empty".into()));
    }
    let (mf, notebook, relative) = address(raw)?;
    let current = NoteService::new(&mf).get(&notebook.id, &relative)?;
    let saved =
        NoteService::new(&mf).save(&notebook.id, &relative, content, Some(&current.body))?;
    match saved {
        flowix_core::service::NoteSaveOutcome::Saved(document) => {
            Ok(json!({"ok": true, "action": "written", "note": document_json(&document)}))
        }
        flowix_core::service::NoteSaveOutcome::Conflict { .. } => Err(CliError::Conflict(
            "note changed on disk; write was not applied".into(),
        )),
```

</details>

#### 缺口

- 真实跨进程/merge语义正确率与pending恢复未验。
  **影响**：不能保证不冲突或所有视图最终一致。
  **进一步探讨**：两个编辑器+CLI交错写、索引故障/重启核disk/base/视图与数据保全。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 共同文件怎样仍会失效，代价在哪里？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

共享Markdown减少复制，不消除语义过时：旧Agent全文可按刚读磁盘版本覆盖人工新意图；三方文本merge也不等语义合理。正文已写但派生失败必须先查原文，不把错误一律当无改动。笔记链接/附件、表格集合、身份/任务状态不是只导出正文就完整迁移，本轮未全面审这些结构及云同步，不承诺全客户端安全/可逆。

需客户端/CLI与匹配Agent运行时、可读写笔记目录、索引和备份；模型/同步选择有网络、隐私和现金条件，价格/可用性未核。首次迁入/配置/备份，持续维护上下文、人工审写回、索引/模型资源；免费开源和普通文件不能算经济创新/0成本。失败分正文、索引、Agent调用和同步结果核对，先停Agent写；退出保留原Markdown并导出附属结构验证重开，停客户端不撤销已发生Agent/同步行为。

#### 证据与依据

**依据 1 · 源码核查**：[app/flowix-cli/src/path_store.rs:134-148](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-cli/src/path_store.rs#L134-L148)

CLI旧Agent语义窗口。

<details>
<summary>查看原文（15行）</summary>

```text
pub(crate) fn write(raw: &str, content: &str) -> Result<Value, CliError> {
    if content.trim().is_empty() {
        return Err(CliError::Usage("write: content is empty".into()));
    }
    let (mf, notebook, relative) = address(raw)?;
    let current = NoteService::new(&mf).get(&notebook.id, &relative)?;
    let saved =
        NoteService::new(&mf).save(&notebook.id, &relative, content, Some(&current.body))?;
    match saved {
        flowix_core::service::NoteSaveOutcome::Saved(document) => {
            Ok(json!({"ok": true, "action": "written", "note": document_json(&document)}))
        }
        flowix_core::service::NoteSaveOutcome::Conflict { .. } => Err(CliError::Conflict(
            "note changed on disk; write was not applied".into(),
        )),
```

</details>

**依据 2 · 源码核查**：[app/flowix-core/src/memo_file/note_index.rs:371-394](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-core/src/memo_file/note_index.rs#L371-L394)

正文/index失败分离。

<details>
<summary>查看原文（24行）</summary>

```text
            super::FileWriteOutcome::Saved => {
                let index_entry = match self.refresh_note_path_with_content(
                    notebook_id,
                    relative_path,
                    content,
                ) {
                    Ok(()) => self
                        .read_indexed_note_entry_by_path(notebook_id, relative_path)
                        .ok()
                        .flatten(),
                    Err(error) => {
                        mark_note_index_refresh_pending_logged(&root, notebook_id, relative_path);
                        tracing::warn!(
                            notebook_id,
                            relative_path,
                            "note saved but path index refresh failed: {error}"
                        );
                        None
                    }
                };
                Ok(NoteWriteResult::Saved {
                    content: content.to_string(),
                    index_entry,
                })
```

</details>

**依据 3 · 源码核查**：[app/flowix-desktop/src/commands/external_document.rs:349-374](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-desktop/src/commands/external_document.rs#L349-L374)

保存后通知/同步独立路径。

<details>
<summary>查看原文（26行）</summary>

```text
                let (saved_content, merged) = match outcome {
                    Ok(MergedFileWriteOutcome::Saved { content, merged }) => {
                        match refresh_saved_notebook_note(&memo_file, &path, window.label(), previous_favorited) {
                            Ok(Some(change)) => change.emit(&app),
                            Ok(None) => {},
                            Err(error) => tracing::warn!(path = %path.display(), "saved note metadata notification failed: {error}"),
                        }
                        crate::commands::document_list::refresh_view_document_path(&memo_file, &path);
                        if is_markdown_document_path(&path) {
                            if let Ok(notebooks) = memo_file.read_notebook_configs() {
                                for notebook in notebooks {
                                    let root = Path::new(&notebook.path);
                                    if let Ok(relative) = path.strip_prefix(root) {
                                        let relative_path = relative.to_string_lossy().replace('\\', "/");
                                        crate::watcher::processor::record_cloud_path_change(
                                            &app,
                                            &crate::watcher::processor::NotebookWatchContext {
                                                notebook_id: notebook.id,
                                                root: root.to_path_buf(),
                                            },
                                            &relative_path,
                                            false,
                                        );
                                    }
                                }
                            }
```

</details>

**依据 4 · 源码核查**：[README.md:78-104](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/README.md#L78-L104)

编码/文件/Agent和同步由用户选择。

<details>
<summary>查看原文（27行）</summary>

````text
## 通过 CLI 传递 Markdown

向 `create` 和 `write` 传递 Markdown 正文时，推荐使用 UTF-8 文件，尤其是在 Windows PowerShell 5.1 中。这样可以避免 stdin 管道编码导致中文内容损坏。支持带 BOM 和不带 BOM 的 UTF-8 文件。

```powershell
flowix create <notebook> --file body.md --json
flowix write <id> --file body.md --json
```

在 Windows 上，未指定输入方式时 CLI 会拒绝隐式读取 stdin，以避免 PowerShell 5.1 的 `$OutputEncoding` 损坏中文；已确认 stdin 为 UTF-8 时请显式加 `--stdin`：

```powershell
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
Get-Content -Raw -Encoding UTF8 body.md | flowix create <notebook> --stdin --json
```

`--file` 与 `--stdin` 互斥。`--file` 会直接按 UTF-8 读取；文件不存在、无法读取或不是有效 UTF-8 时，CLI 会返回错误。使用 `--json` 时错误也会以 `{ok:false,error:{code,message}}` 输出。

---

## 笔记留在本地，由你掌控

Flowix 将笔记保存为本地 Markdown 文件。你决定 Agent 能看到什么，也可以自由选择同步和备份方式。

- **保存在本地** — 笔记是普通 Markdown 文件，可以用其他应用打开和编辑。
- **按需连接 Agent** — 使用 Codex、Claude Code、OpenCode 等 Agent 时，只提供你主动选择的内容。
- **自由同步和备份** — 继续使用你熟悉的同步、备份或版本管理工具。
````

</details>

#### 缺口

- 全部同步/附件结构、模型真实披露和恢复成本未审。
  **影响**：无法承诺零锁定/零泄露或净效率。
  **进一步探讨**：独立笔记本导入/导出附件与结构，记录模型输入/索引追平和人工恢复工时。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用条件与下一步假设？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议副本笔记本试用，以明确内容选择做人工编辑→检索→Agent小范围edit→重开任务；保留桌面expectedContent/merge保护，不用全文write替代必要的旧读校验。出现过时覆盖、索引pending无法解释或同步冲突时，停止Agent写，核原Markdown和备份，回原编辑器/CLI。

可探索跨桌面/CLI的版本与索引追平合同：将正文版本/hash、caller读基线、保存后索引revision/pending明确区分并可查询。现有buffer CAS、锁/atomic、Saved/pending都已存在，增量是端到端可对账而不是再造锁。用交错外改、非重叠merge、语义冲突、索引失败和重启五组，与现有状态/手工核原文比较覆盖错误、误认已检索、恢复时间与额外I/O。若现有UI已同效或合同提示误导/维护更重就否定；未实现。

#### 证据与依据

**依据 1 · 源码核查**：[app/flowix-web/features/document/store/save-queue.ts:23-43](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-web/features/document/store/save-queue.ts#L23-L43)

已有buffer基线/回调。

<details>
<summary>查看原文（21行）</summary>

```text
   * Read the current expectedContent (CAS expected value) just before the
   * IPC fires. Returning a fresh value here is what makes coalescing
   * safe: the chain re-reads the expected value before every IPC, so a
   * pending save always sends the latest expected version.
   */
  readExpected: () => string;
  latest?: () => { content: string; revision: number };
  isBlocked?: () => boolean;
  onStarted?: (revision: number) => void;
  /**
   * Called after a successful write. Caller is responsible for updating
   * `lastSavedContent` (and `pendingContent` if appropriate) here.
   * `writtenPath` 是磁盘上最终物理路径 ── rename 后可能跟 caller
   * 传的 path 不同, 前端需要据此切 buf / 更新 closure。
   */
  onSaved: (writtenPath: string, writtenContent: string, revision: number,
    submittedContent: string, merged: boolean) => void;
  /** Called on CAS refusal (write returned false). */
  onCasRefused: (writtenContent: string, revision: number) => void;
  /** Called on transport / IPC error. */
  onError: (writtenContent: string, revision: number, err: unknown) => void;
```

</details>

**依据 2 · 源码核查**：[app/flowix-core/src/memo_file/note_index.rs:371-394](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-core/src/memo_file/note_index.rs#L371-L394)

已有pending信号。

<details>
<summary>查看原文（24行）</summary>

```text
            super::FileWriteOutcome::Saved => {
                let index_entry = match self.refresh_note_path_with_content(
                    notebook_id,
                    relative_path,
                    content,
                ) {
                    Ok(()) => self
                        .read_indexed_note_entry_by_path(notebook_id, relative_path)
                        .ok()
                        .flatten(),
                    Err(error) => {
                        mark_note_index_refresh_pending_logged(&root, notebook_id, relative_path);
                        tracing::warn!(
                            notebook_id,
                            relative_path,
                            "note saved but path index refresh failed: {error}"
                        );
                        None
                    }
                };
                Ok(NoteWriteResult::Saved {
                    content: content.to_string(),
                    index_entry,
                })
```

</details>

**依据 3 · 源码核查**：[app/flowix-cli/src/path_store.rs:134-148](https://github.com/text2future/flowix/blob/a48d45ca42cdfb252f80c0c2db5d213bf904546d/app/flowix-cli/src/path_store.rs#L134-L148)

跨CLIcaller基线缺口。

<details>
<summary>查看原文（15行）</summary>

```text
pub(crate) fn write(raw: &str, content: &str) -> Result<Value, CliError> {
    if content.trim().is_empty() {
        return Err(CliError::Usage("write: content is empty".into()));
    }
    let (mf, notebook, relative) = address(raw)?;
    let current = NoteService::new(&mf).get(&notebook.id, &relative)?;
    let saved =
        NoteService::new(&mf).save(&notebook.id, &relative, content, Some(&current.body))?;
    match saved {
        flowix_core::service::NoteSaveOutcome::Saved(document) => {
            Ok(json!({"ok": true, "action": "written", "note": document_json(&document)}))
        }
        flowix_core::service::NoteSaveOutcome::Conflict { .. } => Err(CliError::Conflict(
            "note changed on disk; write was not applied".into(),
        )),
```

</details>

#### 缺口

- 跨端版本/追平合同尚未实现与对照。
  **影响**：不能计为已有可靠性收益。
  **进一步探讨**：先比较现有CAS/pending与人工核原文，确定最小信息增量。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
