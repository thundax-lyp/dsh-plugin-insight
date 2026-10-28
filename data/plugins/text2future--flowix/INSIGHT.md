# Flowix

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[825c1c5](https://github.com/text2future/flowix/tree/825c1c58d37daa36be3ed56572407273c1908552)

<!-- BEGIN META -->
[![GitHub ★ 484](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=484&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/text2future/flowix)
<!-- END META -->

> **功能**：本地 Markdown 笔记客户端，通过 CLI 与 MCP 向 Agent 提供持续上下文

> **亮点**：[Q02](#research-q02) 以人可读Markdown为共同交付物连接人工和Agent，减少另建记忆存储与重复传递；检索与写入效果仍需任务验证。

> **主要限制**：[Q03](#research-q03) 保存成功不等于索引已追平，CLI全文写入也未携带Agent最初读时基线，共享文件不能自动消除语义覆盖。

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
  - [Q01 · 谁用什么产物，根对象是什么类型？](#detail-section-11)
  - [Q02 · 不同入口怎样保存到同一笔记？](#detail-section-12)
  - [Q03 · 正文保存、搜索可见和并发无冲突是否同一件事？](#detail-section-13)
  - [Q04 · 什么条件下试用，如何验证共享笔记的收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向以Markdown保存项目知识的个人与小团队，把同一笔记用于人工阅读和Agent上下文。

普通Markdown编辑器加手动复制上下文及回填结果；本产品整合笔记客户端、CLI和Agent接口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Markdown笔记 | 人和Agent共享可读资料 | 内容质量与写回需复核 |
| 冲突/索引状态 | 分开正文与派生数据 | Saved不保证搜索已追平 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Flowix客户端或CLI | 必需 | 编辑/操作笔记 | 可用普通编辑器保留原文 |
| 注册笔记本与权限 | 必需 | 定位和写回 | 拒绝未注册路径，先修配置 |
| 模型或外部Agent | AI任务必需 | 理解和生成 | 保留人工编辑 |
| 独立备份/同步策略 | 写入重要数据必需 | 恢复与迁移 | 先副本试用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户注册副本笔记本并写背景 | 普通编辑器可打开 |
| 2 | 用户/Agent读取并小范围修改 | 磁盘正文与预期相符 |
| 3 | 用户核对搜索与冲突恢复 | 索引延迟分开处理，冲突不盲目覆盖 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 客户端/CLI与备份空间 | 迁入笔记并配置Agent | 费用/耗时未测 |
| 持续 | 模型与同步资源 | 维护上下文和复核写回 | 合格任务成本未知 |
| 失败恢复 | 备份和重试 | 核对磁盘、索引及覆盖 | 恢复正确率未测 |
| 退出 | 普通Markdown存储 | 导出并回原编辑器 | 附加结构迁移未全面审计 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 共同上下文 | 桌面/CLI共享笔记服务 | 同任务节时与质量 |
| 写入可解释 | Saved/Conflict与索引pending分开 | 真实并发、语义过期覆盖率 |

> **思考**：[Q03](#research-q03) 保存成功不等于索引已追平，CLI全文写入也未携带Agent最初读时基线，共享文件不能自动消除语义覆盖。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 以人可读Markdown为共同交付物连接人工和Agent，减少另建记忆存储与重复传递；检索与写入效果仍需任务验证。

[Q03](#research-q03) 正文与索引失败分离值得借鉴；跨进程及语义版本仍需独立任务验收，不能从API存在推定完成。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 保存成功不等于索引已追平，CLI全文写入也未携带Agent最初读时基线，共享文件不能自动消除语义覆盖。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在副本笔记本验证人工修改、检索和写回；出现过期覆盖或无法解释的搜索结果时停止Agent写入，核对原Markdown与备份。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

共同笔记模型、内容冲突和索引pending机制有源码支持；协作正确率、办结效率及新状态合同未验证。

- 已检查：作者 README、包清单、源码路径 README.md、app/flowix-web/platform/tauri/client/notes.ts、app/flowix-desktop/src/commands/memo/reads.rs、app/flowix-cli/src/path_store.rs、app/flowix-core/src/service.rs、app/flowix-core/src/memo_file/note_index.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根产品说明、桌面/CLI写入路径、共享服务与索引刷新；未全面审计所有Agent、同步服务或UI。
- 下一步：同一笔记任务对比编辑器复制、现有Flowix及带读时版本/索引状态合同方案，交错编辑并测覆盖错误、修复时间和总体办结时间。

**分析版本**

- **仓库**：[text2future/flowix](https://github.com/text2future/flowix)
- **版本号**：1.5.14（[固定提交 825c1c5](https://github.com/text2future/flowix/tree/825c1c58d37daa36be3ed56572407273c1908552)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 从正文/索引分离和写入基线推导版本与追平状态合同，比较交错编辑的覆盖错误和修复时间；无改善或总负担上升则推翻。

同一笔记任务对比编辑器复制、现有Flowix及带读时版本/索引状态合同方案，交错编辑并测覆盖错误、修复时间和总体办结时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 932 | 29447 | — | — | 407868 |
| .js | source | 67 | 7032 | 6110 | 498 | — |
| .ts | source | 794 | 102126 | 86907 | 7524 | — |
| .ts | test | 314 | 48946 | 43788 | 770 | — |
| .tsx | source | 289 | 68583 | 62029 | 2694 | — |
| .tsx | test | 103 | 15566 | 14143 | 137 | — |
| .mjs | source | 47 | 5253 | 4459 | 385 | — |
| .mjs | test | 13 | 1175 | 939 | 103 | — |
| .md | example | 1 | 10 | — | — | 55 |
| .js | example | 7 | 853 | 740 | 58 | — |

</details>

**活跃度**

[![Issue 未关闭 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=19&color=737b86&logo=github)](https://github.com/text2future/flowix/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/text2future/flowix/issues?q=is%3Aissue+created%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z) [![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/text2future/flowix/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：共享Markdown上下文能否兼顾人工编辑、Agent写回和可恢复状态？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁用什么产物，根对象是什么类型？

**研究主题**：场景与需求

#### 完整回答

Flowix根组件是本地笔记客户端，而非单个记忆插件。README针对产品、开发、研究及个人知识提出同篇笔记反复保存背景、交给Agent处理并写回的场景。合格交付应是人可打开、来源和改动可核对的Markdown；多Agent使用同一份资料不等于彼此已安全协调。普通Markdown编辑器加手动复制上下文是基线，主要增量是减少资料传递和结果回填的接线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-14](https://github.com/text2future/flowix/blob/825c1c58d37daa36be3ed56572407273c1908552/README.md#L9-L14)

作者定义本地笔记产品

```text
<h1 align="center">你的笔记，<br />AI 的记忆。</h1>

<p align="center"><strong>本地 Markdown 笔记本，让你的写作无缝成为 Agent 可以持续使用的上下文。</strong></p>

<p align="center">
  Markdown · 开源 · 多 Agent · MCP 与 CLI
```

**依据 2 · 作者声明**：[README.md:27-52](https://github.com/text2future/flowix/blob/825c1c58d37daa36be3ed56572407273c1908552/README.md#L27-L52)

共享上下文及场景

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 不同入口怎样保存到同一笔记？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

前端notes.writeDocument通过Tauri文档变更入口发送路径、正文及expectedContent；桌面端要求绝对路径且属于注册笔记本，并检查预期内容。CLI路径解析支持notebook::relative和已注册本下的绝对路径，拒绝空段/点段。CLI write读当前正文并调用NoteService.save；service把写文件结果映射为Saved或Conflict，再构造用户可见文档。贡献是把桌面与CLI围绕共享笔记模型组织，而非让每个Agent维护独立记忆库。

#### 证据与依据

**依据 1 · 源码核查**：[app/flowix-web/platform/tauri/client/notes.ts:101-110](https://github.com/text2future/flowix/blob/825c1c58d37daa36be3ed56572407273c1908552/app/flowix-web/platform/tauri/client/notes.ts#L101-L110)

前端IPC写入接线

<details>
<summary>查看原文（10行）</summary>

```text
/** Path-identified Markdown operations. Existing IPC command names remain adapters. */
export const notes = {
  resolveLocation: (filePath: string) =>
    invoke<MarkdownLocation>('resolve_markdown_location', { filePath }),
  readDocument: (filePath: string) => invoke<string | null>('read_document', { filePath }),
  writeDocument: (params: { filePath: string; content: string; expectedContent?: string }) =>
    invokeDocumentMutation<({ path: string; content: string } & NoteContentCommit) | null>('write_document', {
      filePath: params.filePath,
      content: params.content,
      expectedContent: params.expectedContent,
```

</details>

**依据 2 · 源码核查**：[app/flowix-desktop/src/commands/memo/reads.rs:281-305](https://github.com/text2future/flowix/blob/825c1c58d37daa36be3ed56572407273c1908552/app/flowix-desktop/src/commands/memo/reads.rs#L281-L305)

桌面写入进入operation流程

<details>
<summary>查看原文（25行）</summary>

```text
pub async fn write_document(
    operation_id: Option<String>,
    filePath: String,
    content: String,
    expectedContent: Option<String>,
    app: AppHandle,
    window: tauri::WebviewWindow,
) -> Result<Option<WriteDocumentResult>, String> {
    let origin_window_label = window.label().to_owned();
    crate::commands::document_operations::run(
        "save",
        operation_id,
        origin_window_label.clone(),
        move || {
            let state = app.state::<AppState>();
            write_document_internal(
                &filePath,
                &content,
                expectedContent.as_deref(),
                &state,
                &app,
                &origin_window_label,
            )
        },
    )
```

</details>

**依据 3 · 源码核查**：[app/flowix-desktop/src/commands/memo/reads.rs:318-332](https://github.com/text2future/flowix/blob/825c1c58d37daa36be3ed56572407273c1908552/app/flowix-desktop/src/commands/memo/reads.rs#L318-L332)

注册笔记边界和expectedContent判断

<details>
<summary>查看原文（15行）</summary>

```text
    if !Path::new(file_path).is_absolute() {
        return Err("absolute document path required".into());
    }
    let requested_path = Path::new(file_path);
    let (notebook_id, relative_path) =
        notebook_note_address(&read_lock(&state.memo_file, "memo_file"), requested_path)?
            .ok_or_else(|| {
                "document is not a Markdown note inside a registered notebook".to_string()
            })?;

    let current_content = fs::read_to_string(requested_path).map_err(|error| error.to_string())?;
    if expected_content
        .is_some_and(|expected| !cas_content_matches(&current_content, expected, content))
    {
        return Ok(None);
```

</details>

**依据 4 · 源码核查**：[app/flowix-cli/src/path_store.rs:9-49](https://github.com/text2future/flowix/blob/825c1c58d37daa36be3ed56572407273c1908552/app/flowix-cli/src/path_store.rs#L9-L49)

CLI地址解析

<details>
<summary>查看原文（41行）</summary>

```text
) -> Result<(flowix_core::memo_file::MemoFile, NotebookConfig, String), CliError> {
    let mf = store::open()?;
    let configs = mf.read_notebook_configs()?;
    let (notebook, relative) = if let Some((key, relative)) = raw.split_once("::") {
        let notebook = store::find_notebook(&configs, key)
            .ok_or_else(|| CliError::NotFound(format!("notebook not found: {key}")))?;
        (notebook, relative.replace('\\', "/"))
    } else if Path::new(raw).is_absolute() {
        let absolute = std::fs::canonicalize(raw)?;
        let notebook = configs
            .iter()
            .filter_map(|config| {
                let root = std::fs::canonicalize(&config.path).ok()?;
                absolute
                    .strip_prefix(&root)
                    .ok()
                    .map(|relative| (config, relative.to_path_buf(), root.components().count()))
            })
            .max_by_key(|(_, _, depth)| *depth)
            .ok_or_else(|| {
                CliError::NotFound(format!("note is outside configured notebooks: {raw}"))
            })?;
        (notebook.0, notebook.1.to_string_lossy().replace('\\', "/"))
    } else {
        let key = store::resolve_notebook_key(None)?;
        let notebook = store::find_notebook(&configs, &key)
            .ok_or_else(|| CliError::NotFound(format!("notebook not found: {key}")))?;
        (notebook, raw.replace('\\', "/"))
    };
    if relative.is_empty()
        || relative.starts_with('/')
        || relative
            .split('/')
            .any(|part| part.is_empty() || part == "." || part == "..")
    {
        return Err(CliError::Usage(
            "note address must be a notebook-relative Markdown path".into(),
        ));
    }
    let notebook = notebook.clone();
    Ok((mf, notebook, relative))
```

</details>

**依据 5 · 源码核查**：[app/flowix-cli/src/path_store.rs:134-148](https://github.com/text2future/flowix/blob/825c1c58d37daa36be3ed56572407273c1908552/app/flowix-cli/src/path_store.rs#L134-L148)

CLI写入与冲突结果

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

**依据 6 · 源码核查**：[app/flowix-core/src/service.rs:375-411](https://github.com/text2future/flowix/blob/825c1c58d37daa36be3ed56572407273c1908552/app/flowix-core/src/service.rs#L375-L411)

服务写入与用户结果

<details>
<summary>查看原文（37行）</summary>

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 正文保存、搜索可见和并发无冲突是否同一件事？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不是。note_index先写正文，再尝试刷新派生索引；刷新失败会标记pending并记录警告，仍返回Saved。这样避免把索引故障伪装成正文未保存，但意味着后续搜索可能暂未看到最新内容。CLI write在调用时读取当前正文作为expected值，可防读后写期间冲突，却不能检测Agent早先读到旧内容后生成全文覆盖的语义过期；调用前的旧基线不在该write参数里。局部edit则要求唯一匹配并把当次读取正文用于保存。需区分磁盘提交、索引追平和语义冲突，不能由共享文件直接推出多Agent一致性。

#### 证据与依据

**依据 1 · 源码核查**：[app/flowix-core/src/memo_file/note_index.rs:351-394](https://github.com/text2future/flowix/blob/825c1c58d37daa36be3ed56572407273c1908552/app/flowix-core/src/memo_file/note_index.rs#L351-L394)

保存与索引刷新分开，失败置pending

<details>
<summary>查看原文（44行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[app/flowix-cli/src/path_store.rs:99-130](https://github.com/text2future/flowix/blob/825c1c58d37daa36be3ed56572407273c1908552/app/flowix-cli/src/path_store.rs#L99-L130)

唯一匹配局部编辑

<details>
<summary>查看原文（32行）</summary>

```text
pub(crate) fn edit(
    raw: &str,
    old: &str,
    replacement: &str,
    dry_run: bool,
) -> Result<Value, CliError> {
    if old.is_empty() {
        return Err(CliError::Usage("edit: --old cannot be empty".into()));
    }
    let (mf, notebook, relative) = address(raw)?;
    let current = NoteService::new(&mf).get(&notebook.id, &relative)?;
    let matches = current.body.match_indices(old).count();
    if matches != 1 {
        return Err(CliError::Usage(format!(
            "edit: expected exactly one match, found {matches}"
        )));
    }
    let next = current.body.replacen(old, replacement, 1);
    if !dry_run {
        match NoteService::new(&mf).save(&notebook.id, &relative, &next, Some(&current.body))? {
            flowix_core::service::NoteSaveOutcome::Saved(_) => {}
            flowix_core::service::NoteSaveOutcome::Conflict { .. } => {
                return Err(CliError::Conflict(
                    "note changed on disk; edit was not applied".into(),
                ))
            }
        }
    }
    Ok(
        json!({"ok": true, "action": if dry_run {"edit_preview"} else {"edited"},
        "notebookId": notebook.id, "relativePath": relative, "address": locator(&notebook.id, &relative),
        "path": current.path, "oldBytes": old.len(), "newBytes": replacement.len(), "wrote": !dry_run}),
```

</details>

**依据 3 · 源码核查**：[app/flowix-cli/src/path_store.rs:134-148](https://github.com/text2future/flowix/blob/825c1c58d37daa36be3ed56572407273c1908552/app/flowix-cli/src/path_store.rs#L134-L148)

全文写入只传当次读取基线

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

- 外部同步、多进程写入与索引恢复效果未测
  **影响**：无法保证实际并发与搜索最终可见时间
  **进一步探讨**：用独立笔记本交错写入、注入索引刷新失败并核对磁盘和搜索

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么条件下试用，如何验证共享笔记的收益？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

已使用Markdown且愿意维护资料的个人或小团队可用非敏感笔记副本试用，先验证人工修改、CLI检索和Agent写回三者一致。首次有客户端/CLI和笔记本配置，持续有模型费用与内容审阅，失败要核对磁盘及索引，退出可保留普通Markdown。由Saved与索引pending分离推导未验证假设：显示文档版本与索引追平状态，并要求Agent带读时版本写回，可减少过期覆盖和“保存后搜不到”的误判。与普通编辑器+复制流程、现有Flowix各做同一组交错编辑任务，记录覆盖错误、人工修复和办结时间；若额外状态管理未减少错误或总体更慢，就否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:98-104](https://github.com/text2future/flowix/blob/825c1c58d37daa36be3ed56572407273c1908552/README.md#L98-L104)

本地Markdown与自主备份的作者声明

```text
## 笔记留在本地，由你掌控

Flowix 将笔记保存为本地 Markdown 文件。你决定 Agent 能看到什么，也可以自由选择同步和备份方式。

- **保存在本地** — 笔记是普通 Markdown 文件，可以用其他应用打开和编辑。
- **按需连接 Agent** — 使用 Codex、Claude Code、OpenCode 等 Agent 时，只提供你主动选择的内容。
- **自由同步和备份** — 继续使用你熟悉的同步、备份或版本管理工具。
```

**依据 2 · 作者声明**：[README.md:118-123](https://github.com/text2future/flowix/blob/825c1c58d37daa36be3ed56572407273c1908552/README.md#L118-L123)

初始笔记本操作

```text
## 快速开始

1. 从 [官网](https://flowix-memo.com/) 下载并安装 Flowix。
2. 新建一个本地文件夹，或将已有文件夹注册为笔记本。
3. 创建一篇文档，记录任务背景、参考资料、目标与约束。
4. 在文档内调用 Agent，或继续用标签与属性组织内容。
```

**依据 3 · 源码核查**：[app/flowix-core/src/memo_file/note_index.rs:371-394](https://github.com/text2future/flowix/blob/825c1c58d37daa36be3ed56572407273c1908552/app/flowix-core/src/memo_file/note_index.rs#L371-L394)

索引pending为假设依据

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

**依据 4 · 源码核查**：[app/flowix-cli/src/path_store.rs:134-148](https://github.com/text2future/flowix/blob/825c1c58d37daa36be3ed56572407273c1908552/app/flowix-cli/src/path_store.rs#L134-L148)

读时版本缺口为假设依据

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

- 共享上下文节时、语义覆盖率与全周期成本未测
  **影响**：不能把文件共用当已兑现的协作收益
  **进一步探讨**：在同任务中计入失败重做和审阅，比较原编辑器/CLI流程

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
