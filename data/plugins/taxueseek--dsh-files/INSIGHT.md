# DSH Files

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[5759656](https://github.com/taxueseek/dsh-files/tree/5759656699e1c4d5c3bea5bac51e674ef52158cd)

<!-- BEGIN META -->
[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/taxueseek/dsh-files) [![npm 30d 204](https://img.shields.io/static/v1?label=npm+30d&message=204&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-files) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-files)
<!-- END META -->

> **功能**：在 DSH 内查找和引用已上传附件，通过宿主文件系统抽取常见办公文档的文字。

> **亮点**：[Q01](#research-q01) 将附件库浏览和宿主引用接进会话。[Q02](#research-q02) 文档内容可按页或表选择后分窗口取用。

> **主要限制**：[Q03](#research-q03) Web 与模型导出使用不同写入路径，Web 的 Host 守卫未核对用户身份，递归删除也会影响此前引用。

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
  - [Q01 · 新会话如何找到旧会话上传的附件，并只读取需要的一段？](#detail-section-11)
  - [Q02 · 文档窗口能约束什么，遇到扫描件和大工作簿会怎样？](#detail-section-12)
  - [Q03 · 工具导出、面板导出与永久删除的边界有何区别？](#detail-section-13)
  - [Q04 · 怎样判断旧附件检索和按页读取值不值得反复使用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户在新会话复用旧会话的公开 PDF，找到指定页并核对原文。

本地打开已保存原件，找到指定页并向新会话粘贴已核对的片段。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 实现 |
| --- | --- |
| 文档抽取 | 宿主 fs 及格式解析 |
| 附件引用 | composer slot 与宿主句柄 |
| 附件管理 | 模型工具与独立 Web 路由 |

**流程与依赖**

| 依赖 | 作用 |
| --- | --- |
| DSH Host fs/tools | 文件解析与模型工具 |
| Web 会话及附件服务 | 原生上传、句柄与 Web 路由 |
| PDF/Office 解析库 | 本机文字抽取 |

| 操作 | 结果 |
| --- | --- |
| 查附件 | 按文件名或内容引用定位 |
| 读指定页 | 返回格式化文字窗口 |
| 核对原件 | 检查选页、截断与文字 |

**效果与成本**

| 阶段 | 试用者负担 |
| --- | --- |
| 首次 | 核对宿主版本、库路径和启用状态 |
| 持续 | 复核页码、工作表与截断 |
| 失败与退出 | 回原件，分别核对附件路由和工具是否停用 |

| 对象 | 可核查增量 |
| --- | --- |
| 新会话 | 复用旧附件及按页取文 |
| 资料维护者 | 识别附件库与会话导出的不同路径 |

> **思考**：[Q03](#research-q03) Web 与模型导出使用不同写入路径，Web 的 Host 守卫未核对用户身份，递归删除也会影响此前引用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将附件库浏览和宿主引用接进会话。[Q02](#research-q02) 文档内容可按页或表选择后分窗口取用。

复用原生上传草稿及句柄；解析先按宿主 fs 解析路径和限制输入，输出按格式限窗。Web 流导出与模型复制分别实现，边界需单独核验。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) Web 与模型导出使用不同写入路径，Web 的 Host 守卫未核对用户身份，递归删除也会影响此前引用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在单用户测试 profile 用公开文字 PDF 验证检索、引用和按页抽取。遇到附件不匹配或抽取失败就回本地原件。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

partial

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、src/attachment-loop.ts、src/attachment-tool.ts、src/attachments/fence.ts、src/client/dock.tsx、src/client/index.tsx、src/index.ts、src/parse/pdf.ts、src/parse/xlsx.ts、src/tool.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 dsh-files 0.7.0 源码；不推断共享宿主和代理配置。
- 下一步：本轮未安装、未执行目标代码或宿主验证。下一步跑单用户双会话试用和独立目录的并发导出。

**分析版本**

- **仓库**：[taxueseek/dsh-files](https://github.com/taxueseek/dsh-files)
- **版本号**：0.7.0（[固定提交 5759656](https://github.com/taxueseek/dsh-files/tree/5759656699e1c4d5c3bea5bac51e674ef52158cd)）
- **版本日期**：2026-11-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 复用宿主已有附件或能减少找原件和重复粘贴，需按同一 PDF 记录时间、段落一致性和扫描件失败信号。

本轮未安装、未执行目标代码或宿主验证。下一步跑单用户双会话试用和独立目录的并发导出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 30 | 22 | 6 | — |
| .md | source | 5 | 1378 | — | — | 27150 |
| .js | source | 18 | 2200 | 1801 | 410 | — |
| .ts | source | 19 | 2522 | 1944 | 438 | — |
| .tsx | source | 2 | 880 | 683 | 143 | — |
| .ts | test | 11 | 1418 | 1153 | 135 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/taxueseek/dsh-files/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/taxueseek/dsh-files/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/taxueseek/dsh-files/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户能否找回旧会话上传的办公文档并核对指定章节，同时看清附件库和会话工作区的权限边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 新会话如何找到旧会话上传的附件，并只读取需要的一段？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

反复核对项目资料的 DSH 用户想在新会话找回已上传的会议材料，从某个原生带文字层的 PDF 页中摘录一句可复核内容。手工查找本地原件、打开对应页再粘贴文字可以完成。插件增量是浏览附件库、插入宿主生成的附件句柄，并通过文档读取工具选页。Cordis 实际挂载三项工具，Web 面板进入原生 composer slot。文件夹入口借用宿主会话服务创建上传草稿，附件引用仅在宿主提供句柄时出现。

模型的 attachment_list 从配置的附件库根扫描并按文件名过滤，再做 200 条窗口。此工具的 execute 不按当前会话筛库，因此不能把 UI 或工具上显示的“会话附件”解释为会话内权限隔离。面板浏览本身走 HTTP；引用后或调用解析工具后，文档内容才可能进入模型上下文。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:5-18](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/cordis.patch.yml#L5-L18)

注册 Host 插件及配置。

<details>
<summary>查看原文（14行）</summary>

```text
- insert:
    - id: files-toolkit
      name: 'dsh-files'
      config:
        maxFileBytes: 25165824
        readLimit: 2000
        sheetRowLimit: 200
        maxSheets: 5
        maxOutputChars: 24000
        readTimeoutMs: 120000
        # 附件闭环（0.6.1）：面板/下载/导出/@ 源总开关。
        attachmentsEnabled: true
        # 单次附件下载/导出字节上限（超限 413）。
        maxDownloadBytes: 209715200
```

</details>

**依据 2 · 源码核查**：[src/index.ts:84-116](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/index.ts#L84-L116)

注册模型工具并条件挂附件路由。

<details>
<summary>查看原文（33行）</summary>

```text
  ctx.systemPrompt.section({
    name: 'tool:read-document',
    order: 110,
    text: 'read_document reads PDF/DOC/DOCX/XLSX/text the read tool cannot. For large docs: probe structure first (list_sheets, or a small first window), then page with offset/limit; read only what the task needs, then stop. attachment_list shows what was uploaded this workspace; export_attachment copies an uploaded file into the workspace (by sha prefix) so read/edit/bash can operate on it.'
  })

  const attachmentsDir = config.attachmentsDir.trim() !== '' ? config.attachmentsDir : defaultAttachmentsDir()

  ctx.tools.register(
    defineReadDocumentTool(ctx, {
      readLimit: config.readLimit,
      maxFileBytes: config.maxFileBytes,
      sheetRowLimit: config.sheetRowLimit,
      maxSheets: config.maxSheets,
      maxOutputChars: config.maxOutputChars,
      readTimeoutMs: config.readTimeoutMs
    })
  )
  ctx.tools.register(defineAttachmentListTool({ attachmentsDir }))
  ctx.tools.register(defineAttachmentExportTool(ctx, { attachmentsDir }))

  // ---- Attachment loop: panel / download / export / @ source routes ----
  // All services are optional: the read_document + attachment tools keep
  // working in headless or attachment-less deployments; routes simply skip.
  // Registration is deferred through ctx.inject — webServer/attachments/
  // sessions initialize after this plugin's apply, and a plain ctx.get at
  // apply time would see a not-yet-activated webServer (probe-verified).
  if (!config.attachmentsEnabled) return
  ctx.inject?.(
    ['webServer', 'attachments', 'sessions', 'llm'],
    (loopCtx: any) => {
      try {
        registerAttachmentRoutes(
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:46-64](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/client/index.tsx#L46-L64)

上传复用宿主 createDrafts。

<details>
<summary>查看原文（19行）</summary>

```text
function conversationOf(ctx: any, sessionId: string): ConversationService | undefined {
  const conversation = ctx.sessions?.scope?.(sessionId)?.get?.('conversation')
  return conversation !== undefined && typeof conversation.createDrafts === 'function' ? conversation : undefined
}

/** Draft creation through the official pipeline — shared by every entry. */
function makeFolderUploader(ctx: any): FolderUploader {
  return (sessionId, files) => {
    const conversation = conversationOf(ctx, sessionId)
    if (conversation === undefined) {
      return { error: 'native attachment pipeline unavailable (harness >= 0.1.3 required)' }
    }
    try {
      const drafts = conversation.createDrafts(sessionId, files)
      return { ids: drafts.map((draft) => draft.id) }
    } catch (error: unknown) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
```

</details>

**依据 4 · 源码核查**：[src/client/index.tsx:118-155](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/client/index.tsx#L118-L155)

附件引用取宿主提供的句柄。

<details>
<summary>查看原文（38行）</summary>

```text
/** Register the attachment @ source next to the host's workspace source. */
function registerAttachmentSource(ctx: {
  inputTriggers: { registerSource(source: Record<string, unknown>): void }
  effect(fn: () => unknown): void
}): void {
  if (typeof ctx.inputTriggers?.registerSource !== 'function') return
  ctx.effect(() =>
    ctx.inputTriggers.registerSource({
      trigger: '@',
      name: SOURCE_NAME,
      order: 20,
      showGroupTitle: true,
      // 5a: 候选 = 附件库条目；只有 host 给出官方 handle 文本的行才提供引用
      // (模型能看到与上传时一致的文件行)。插入文本即 handle 本身——与官方
      // @ 引用只插路径的契约不同，附件不在工作区，模型识别的就是 handle 行。
      candidates: async () => {
        const result = await fetchAttachments()
        // 路由失败（含 403 未授权 host）与「库里没附件」是两件事：前者在
        // 控制台留下服务端 hint，未知部署者据此知道该改哪个配置键。
        if (!result.ok) {
          if (result.status !== 0) {
            console.warn(`[dsh-files] @ 附件源不可用（HTTP ${result.status}）：${result.hint ?? '无 hint'}`)
          }
          return []
        }
        // 库内有附件却全部缺 handle = llm 服务缺席，@ 组会静默消失——
        // 留一条可诊断日志，区分「没附件」和「服务没接上」。
        if (result.rows.length > 0 && result.rows.every((row) => row.handle === undefined || row.handle === '')) {
          console.warn('[dsh-files] @ 附件源：库内有附件但 host 未提供 handle（llm 服务缺席），候选不可用')
        }
        return result.rows
          .filter((row) => row.handle !== undefined && row.handle !== '')
          .slice(0, 50)
          .map((row) => ({
            name: row.name,
            description: `附件 · ${formatBytes(row.bytes)}`,
            icon: 'file',
            value: row.handle ?? row.ref
```

</details>

**依据 5 · 源码核查**：[src/client/index.tsx:202-214](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/client/index.tsx#L202-L214)

附件栏通过宿主 composer slot 注册。

<details>
<summary>查看原文（13行）</summary>

```text
  // conversation.composer.dock is the host's slot for "ambient entries below
  // the composer card" (its own occupant is StatsPills). The dock bridges the
  // session identity and input actions to the shared upload flow.
  ctx.slots.inject('conversation.composer.dock', () =>
    ctx.slots.register(
      {
        name: 'conversation.composer.dock',
        id: 'dsh-files-attachments',
        order: 0,
        inject: (sessionId: string | undefined) => ({ sessionId })
      },
      AttachmentDock
    )
```

</details>

**依据 6 · 源码核查**：[src/attachment-tool.ts:70-88](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/attachment-tool.ts#L70-L88)

按配置根读取全库，先过滤再截断。

<details>
<summary>查看原文（19行）</summary>

```text
    isConcurrencySafe: () => true,
    async execute(args) {
      const all = await listAttachments(config.attachmentsDir)
      // query 是名字子串过滤：截断发生在过滤之后——大库按名检索仍然可达，
      // 而不是被前 200 条截断挡在外面。计数与字节数都按过滤后口径上报。
      const rawQuery = typeof args.query === 'string' ? args.query.trim().toLowerCase() : ''
      const matches = rawQuery === '' ? all : all.filter((entry) => entry.name.toLowerCase().includes(rawQuery))
      const items = matches.slice(0, MAX_LIST_ITEMS)
      return {
        count: matches.length,
        truncated: matches.length > items.length,
        totalBytes: matches.reduce((sum, entry) => sum + entry.bytes, 0),
        items: items.map((entry) => ({
          name: entry.name,
          sha: entry.sha.slice(0, 8),
          bytes: entry.bytes,
          modified: formatTime(entry.modifiedMs)
        }))
      }
```

</details>

**依据 7 · 作者声明**：[README.md:37-46](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/README.md#L37-L46)

作者描述上传、管理与回取。

<details>
<summary>查看原文（10行）</summary>

```text
- **Ingest**: the **folder button next to the native paperclip** (plus a same-named entry in the official "+" command menu) — the browser flattens the directory (Office lock files, `.DS_Store`, `.env` and other system/hidden files are filtered), and every file enters the official native attachment pipeline
- **Read**: the **`read_document` tool** — structured text extraction for binary documents (PDF / DOC / DOCX / PPTX / XLSX) plus enhanced text reading (encoding fallback, paging, page_range slicing, Markdown tables, sheet-level access)
- **Manage**: the **`attachment_list` / `export_attachment` tools** plus **in-panel delete** — make the attachment store visible to the model (name/size/sha) and copy a file into the workspace for read/edit/bash to work on; the panel also removes a single attachment (the store is no longer append-only)
- **Fetch back**: the **attachment dock** (one official pill below the composer card) plus download/export routes and an `@` attachment source — the store becomes visible to users and files can be pulled into the browser (the right path for remote/LAN deployments); the `@` menu inserts the official handle line, identical to what the model saw at upload

> Upload, images and `@` reference were removed in 0.5.0 — harness 0.1.3 ships them natively (universal file upload, the image vision pipeline, unified `@file`/`@session` reference), and does it better. This plugin is part of the [taxueseek plugin matrix](https://github.com/taxueseek#deepseek-harness-%E6%8F%92%E4%BB%B6); the flagship is [argo](https://github.com/taxueseek/argo).

## Why it exists

Native upload in harness 0.1.3 stores files as byte objects and hands the model one handle line (name, size, digest, read-only path) to read with **file tools** — but the built-in read tool rejects binary content with `FS_NOT_TEXT`. Structured text extraction for PDF / DOC / DOCX / XLSX, plus attachment-store listing and export (the official GC is on the roadmap and the store is invisible to the model today), are the gaps the official stack leaves open; this plugin fills them.
```

</details>

#### 缺口

- 未验证同 Host 双会话实际引用和可读范围
  **影响**：无法确认独立用户的附件在目标部署中如何隔离
  **进一步探讨**：用隔离测试 profile 和不同会话的标记附件核对列表与引用

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文档窗口能约束什么，遇到扫描件和大工作簿会怎样？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

read_document 先用会话 cwd 经宿主 fs 解析，检查普通文件、大小并给全文件读取设置上限，随后用字节头和 ZIP 内容识别类型。Bundle 配置文件上限 24 MiB、基础输出预算 24000 字符；PDF 等格式的窗口另减半。PDF/PPTX 接受页或幻灯片范围；XLSX 可先列工作表，再选择表和输出窗口。默认工作簿预览在解析期丢弃超出的行和工作表，继续翻页拿不到这部分，需要改为指定工作表。

PDF 只抽文本层，扫描件返回提示，需回原生查看或另行视觉识读。超时和取消会停止等待，但底层解析器继续运行直到完成或失败，窗口限额主要约束返回内容，不能单独作为内存或计算上限。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:8-14](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/cordis.patch.yml#L8-L14)

实际 bundle 读取与输出参数。

```text
      config:
        maxFileBytes: 25165824
        readLimit: 2000
        sheetRowLimit: 200
        maxSheets: 5
        maxOutputChars: 24000
        readTimeoutMs: 120000
```

**依据 2 · 源码核查**：[src/tool.ts:15-30](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/tool.ts#L15-L30)

分格式字符预算。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * 单次 read_document 窗口的字符预算。按格式分级：
 * - text：需要逐行精确定位（代码/配置），用满基础预算。
 * - xlsx：结构化表格行多列宽也会撑爆上下文，给 3/4，配合截断标记
 *   引导模型 offset 翻页增量取。
 * - pdf/doc/docx：叙述性流式文本，模型通常只需关键段落，一次塞满会把上下文
 *   稀释并推高 token 成本；给基础预算的一半，配合 windowLines 的截断标记
 *   引导模型用 offset/limit 翻页增量获取。
 */
export function formatOutputBudget(format: DocumentFormat, base: number): number {
  // pdf/doc/docx/pptx：叙述性流式文本，模型通常只需关键段落，减半防上下文稀释。
  if (format === 'pdf' || format === 'doc' || format === 'docx' || format === 'pptx') return Math.max(2000, Math.floor(base / 2))
  // xlsx：结构化表格信息密度高，但行多列宽也会撑爆上下文；给 3/4，配合
  // windowLines 的截断标记引导模型 offset 翻页增量取。
  if (format === 'xlsx') return Math.max(2000, Math.floor(base * 0.75))
  return base
```

</details>

**依据 3 · 源码核查**：[src/tool.ts:223-272](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/tool.ts#L223-L272)

宿主 fs、文件上限和内容类型判定。

<details>
<summary>查看原文（50行）</summary>

```text
    async execute(args, exec) {
      const input = parseArgs(args, config)
      const cwd = sessionCwd(exec)
      const target = await ctx.fs.resolve(input.filePath, {
        ...(cwd !== undefined ? { cwd } : {}),
        signal: exec.signal
      })
      const info = await ctx.fs.stat(target, exec.signal)
      if (info === undefined) {
        ctx.emit('fs/observed', target, { kind: 'absent' }, exec)
        throw new FsError(`cannot read "${target.displayPath}": not found`, 'FS_NOT_FOUND')
      }
      if (info.type !== 'file') {
        throw new FsError(`cannot read "${target.displayPath}": not a regular file`, 'FS_NOT_REGULAR_FILE')
      }
      if (info.size !== undefined && info.size > config.maxFileBytes) {
        ctx.emit('fs/observed', target, { kind: 'present', version: info.version }, exec)
        throw new FsError(
          `cannot read "${target.displayPath}": file is ${info.size} bytes, over the ${config.maxFileBytes} byte limit`,
          'FS_TOO_LARGE'
        )
      }
      // readBytes 的 maxBytes 是整个文件上限：底层 stat 后若 size > maxBytes
      // 直接抛 FS_TOO_LARGE，不做截断。因此不能先按 64 KiB 嗅探头部——那会把
      // 任何更大的文件挡在门外。一次读满 maxFileBytes，格式判定从缓冲头部截取。
      const bytes = await ctx.fs.readBytes(target, exec.signal, config.maxFileBytes)
      const head = bytes.subarray(0, Math.min(HEAD_SNIFF_BYTES, bytes.length))
      const headFormat = sniffHead(head)
      if (headFormat === null && input.format === 'auto') {
        ctx.emit('fs/observed', target, { kind: 'present', version: info.version }, exec)
        throw new FsError(
          `cannot read "${target.displayPath}": unrecognized file content (expected text, PDF, DOC, DOCX, PPTX or XLSX)`,
          'FS_NOT_TEXT'
        )
      }
      // zip 需要中央目录（在文件尾部）才能区分 docx/xlsx/pptx；
      // headFormat 为 null 只发生在显式 format 场景，走完整嗅探兜底。
      // auto 模式下的 hint 取扩展名：字节完全未知时（且非已知二进制）
      // 允许按扩展名兜底解析，解析器仍会校验结构并 loud fail。
      const hint = input.format === 'auto' ? (formatFromExtension(input.filePath) ?? undefined) : input.format
      const format =
        headFormat === 'zip' || headFormat === null
          ? sniffFormat(bytes, hint)
          : headFormat
      if (format === null) {
        ctx.emit('fs/observed', target, { kind: 'present', version: info.version }, exec)
        throw new FsError(
          `cannot read "${target.displayPath}": unrecognized file content (expected text, PDF, DOC, DOCX, PPTX or XLSX)`,
          'FS_NOT_TEXT'
        )
```

</details>

**依据 4 · 源码核查**：[src/tool.ts:274-310](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/tool.ts#L274-L310)

格式限定参数、解析与输出窗口。

<details>
<summary>查看原文（37行）</summary>

```text
      // sheet/list_sheets 只对 xlsx 有意义：对 PDF/DOCX/PPTX/text 显式报错，
      // 防止模型以为 sheet 参数生效而拿到完整（未按 sheet 过滤）内容。
      if ((input.sheet !== undefined || input.listSheets) && format !== 'xlsx') {
        ctx.emit('fs/observed', target, { kind: 'present', version: info.version }, exec)
        throw new FsError(
          `cannot read "${target.displayPath}": sheet/list_sheets parameters are only supported for XLSX files (detected format: ${format})`,
          'FS_NOT_TEXT'
        )
      }
      // page_range 只对具有天然分页/幻灯片概念的 PDF 与 PPTX 有意义。
      if (input.pageRange !== undefined && format !== 'pdf' && format !== 'pptx') {
        ctx.emit('fs/observed', target, { kind: 'present', version: info.version }, exec)
        throw new FsError(
          `cannot read "${target.displayPath}": page_range parameter is only supported for PDF and PPTX files (detected format: ${format})`,
          'FS_NOT_TEXT'
        )
      }
      // 解析器不接受 AbortSignal；这里包装一层协作取消：
      // 信号触发时立即中止等待，符合 dsh 工具的取消契约。
      const text = await parseDocumentWithAbort(bytes, format, {
        sheetRowLimit: config.sheetRowLimit,
        maxSheets: config.maxSheets,
        sheet: input.sheet,
        listOnly: input.listSheets,
        pageRange: input.pageRange,
        outputFormat: input.outputFormat
      }, exec.signal)
      const window = windowLines(text, input.offset, input.limit, formatOutputBudget(format, config.maxOutputChars))
      ctx.emit('fs/observed', target, { kind: 'present', version: info.version }, exec)
      return {
        path: target.displayPath,
        format,
        offset: input.offset,
        lines: window.lines,
        totalLines: window.totalLines,
        ...(input.sheet !== undefined ? { sheet: input.sheet } : {})
      }
```

</details>

**依据 5 · 源码核查**：[src/tool.ts:91-118](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/tool.ts#L91-L118)

外层等待竞速，未给底层解析器传信号。

<details>
<summary>查看原文（28行）</summary>

```text
/**
 * Run parseDocument with cooperative cancellation: the underlying parsers
 * (pdfjs/mammoth/read-excel-file) do not take an AbortSignal, so race the
 * parse against the signal and throw the FsError abort code when it fires.
 */
async function parseDocumentWithAbort(
  bytes: Uint8Array,
  format: DocumentFormat,
  options: ParseOptions,
  signal: AbortSignal
): Promise<string> {
  if (signal.aborted) throw new FsError('read_document aborted', 'FS_ABORTED')
  let settle!: (result: { ok: true; text: string } | { ok: false; error: unknown }) => void
  const raced = new Promise<{ ok: true; text: string } | { ok: false; error: unknown }>((resolve) => {
    settle = resolve
  })
  const onAbort = () => settle({ ok: false, error: new FsError('read_document aborted', 'FS_ABORTED') })
  signal.addEventListener('abort', onAbort, { once: true })
  try {
    void parseDocument(bytes, format, options)
      .then((text) => settle({ ok: true, text }))
      .catch((error: unknown) => settle({ ok: false, error }))
    const result = await raced
    if (result.ok) return result.text
    throw result.error
  } finally {
    signal.removeEventListener('abort', onAbort)
  }
```

</details>

**依据 6 · 源码核查**：[src/parse/xlsx.ts:58-103](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/parse/xlsx.ts#L58-L103)

表清单、指定工作表和预览截断。

<details>
<summary>查看原文（46行）</summary>

```text
export async function parseXlsx(bytes: Uint8Array, options: XlsxParseOptions): Promise<string> {
  const buf = Buffer.from(bytes)
  const sheetNames = await readSheetNames(buf)

  // 只列 sheet 名：模型先看有哪些 sheet，再决定读哪个（sheet 参数）。
  if (options.listOnly === true) {
    if (sheetNames.length === 0) return '(empty workbook)'
    return `### Sheets (${sheetNames.length})\n${sheetNames.map((s, i) => `${i + 1}. ${String(s)}`).join('\n')}`
  }

  // sheet 级读取：截断发生在解析期，offset 翻页翻不回来；
  // 指定 sheet 时返回该 sheet 全量，由工具层分页控制输出。
  if (options.sheet !== undefined) {
    const idx = options.sheet
    if (idx < 1 || idx > sheetNames.length) {
      // 越界错误带上可用列表，模型能自纠正而不是瞎猜。
      const list = sheetNames.map((s, i) => `${i + 1}. ${String(s)}`).join(', ')
      throw new Error(`sheet ${idx} out of range: workbook has ${sheetNames.length} sheet(s) — ${list}`)
    }
    const sheet = sheetNames[idx - 1]
    const rows = await readXlsxFile(buf, { sheet })
    return [`### Sheet: ${String(sheet)}（全量，共 ${rows.length} 行）`, formatRows(rows, options.outputFormat)].join('\n\n')
  }

  const maxSheets = options.maxSheets ?? 5
  const sheets = sheetNames.length > 0 ? sheetNames.slice(0, maxSheets) : [1]

  const parts: string[] = []
  let totalRows = 0
  let truncated = false
  let sheetTruncated = false

  for (const sheet of sheets) {
    const rows = await readXlsxFile(buf, { sheet })
    totalRows += rows.length
    const kept = rows.slice(0, options.sheetRowLimit)
    if (rows.length > kept.length) sheetTruncated = true
    parts.push(`### Sheet: ${String(sheet)}\n${formatRows(kept, options.outputFormat)}`)
  }

  // 多 sheet 但被 maxSheets 截断
  if (sheetNames.length > sheets.length) {
    parts.push(`… 另有 ${sheetNames.length - sheets.length} 个 sheet 未读取（上限 ${maxSheets}）`)
    truncated = true
  }
  // 单 sheet 行数被 sheetRowLimit 截断
```

</details>

**依据 7 · 源码核查**：[src/parse/pdf.ts:35-83](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/parse/pdf.ts#L35-L83)

按页抽文本，空文本提示扫描件。

<details>
<summary>查看原文（49行）</summary>

```text
    const targetPages = options.pageRange !== undefined
      ? parsePageRange(options.pageRange, doc.numPages)
      : Array.from({ length: doc.numPages }, (_, i) => i + 1)

    const pages: string[] = []
    for (const pageNo of targetPages) {
      const page = await doc.getPage(pageNo)
      try {
        const content = await page.getTextContent()
        const lines: string[] = []
        let line = ''
        let prevX: number | undefined
        let prevWidth: number | undefined
        for (const item of content.items) {
          if ('str' in item) {
            // 相邻 text run 之间若存在水平间隙则补空格：PDF 常把一个
            // 单词/句子拆成多个 run，直接拼接会得到 "Helloworld"。
            const x = item.transform?.[4]
            const width = 'width' in item ? (item.width as number) : undefined
            if (prevX !== undefined && prevWidth !== undefined && x !== undefined && x > prevX + prevWidth + 1) {
              line += ' '
            }
            line += item.str
            prevX = x
            prevWidth = width
            if (item.hasEOL) {
              lines.push(line)
              line = ''
              prevX = undefined
              prevWidth = undefined
            }
          }
        }
        if (line !== '') lines.push(line)
        const pageText = lines.join('\n')
        if (doc.numPages > 1 || options.pageRange !== undefined) {
          pages.push(`### Page ${pageNo} / ${doc.numPages}\n${pageText}`)
        } else {
          pages.push(pageText)
        }
      } finally {
        page.cleanup()
      }
    }
    const text = pages.join('\n\n')
    // 扫描件/纯图片 PDF 没有文本层：返回显式提示而非空串，
    // 防止模型把「无文本」误读成「空文件」。
    if (text.trim() === '' && doc.numPages > 0) {
      return '\n[此 PDF 没有文本层（可能是扫描件或纯图片文档），read_document 无法提取文字内容。建议直接使用宿主多模态视觉能力进行识读]\n'
```

</details>

#### 缺口

- 未测损坏文件、高压缩文档或多个大型并发解析
  **影响**：无法确认不同宿主下的内存与超时后负载
  **进一步探讨**：对带标记页、纯图 PDF 和多表工作簿测读取边界

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 工具导出、面板导出与永久删除的边界有何区别？

**研究主题**：工程质量与复用、缺陷与关键质疑、效果与总成本

#### 完整回答

模型导出先通过 ctx.fs.resolve/stat，再调用 Node copyFile 的排他模式，拒绝同名目的文件并报告宿主观察状态。Web 面板根据请求的 session 查 cwd，通过 Node 创建 attachments 目录，检查同名后按流写入。面板使用 access 后普通 createWriteStream，两个同时导出可能选中同一名字；失败清理也是按该路径删除。源代码未在面板写入口再次调用 ctx.fs，也未检查 attachments 子目录是否为符号链接，不能把模型工具的目标检查等同于面板行为。

自带路由守卫只比较 Host 头，不按用户身份核对；外层宿主或代理可能有其他准入，需单独验证。删除通过摘要定位库中对象目录后递归删除，客户端二次确认仅能减少误点。已有其他会话的内容引用可能因此无法读取，恢复要依赖原件或独立副本。

#### 证据与依据

**依据 1 · 源码核查**：[src/attachment-tool.ts:150-187](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/attachment-tool.ts#L150-L187)

经宿主解析目的地后排他复制。

<details>
<summary>查看原文（38行）</summary>

```text
    async execute(args, exec) {
      const id = requireString(args, 'attachment')
      const destPath = requireString(args, 'dest_path')
      const found = await findAttachment(config.attachmentsDir, id)

      const cwd = sessionCwd(exec)
      const target = await ctx.fs.resolve(destPath, {
        ...(cwd !== undefined ? { cwd } : {}),
        signal: exec.signal
      })
      const existing = await ctx.fs.stat(target, exec.signal)
      if (existing !== undefined) {
        throw new FsError(
          `cannot export "${found.name}" to "${target.displayPath}": destination already exists; choose another dest_path`,
          'FS_NOT_OBSERVED'
        )
      }
      ctx.emit('fs/observed', target, { kind: 'absent' }, exec)
      try {
        await copyFile(found.hostPath, target.displayPath, fsConstants.COPYFILE_EXCL)
      } catch (error) {
        const code = (error as NodeJS.ErrnoException)?.code
        if (code === 'EEXIST') {
          throw new FsError(
            `cannot export "${found.name}" to "${target.displayPath}": destination already exists; choose another dest_path`,
            'FS_NOT_OBSERVED'
          )
        }
        throw new FsError(
          `cannot export "${found.name}" to "${target.displayPath}": ${(error as Error).message ?? 'io error'}`,
          'FS_IO_ERROR'
        )
      }
      const after = await ctx.fs.stat(target, exec.signal)
      if (after !== undefined) {
        ctx.emit('fs/observed', target, { kind: 'present', version: after.version }, exec)
      }
      return { path: target.displayPath, name: found.name, bytes: after?.size ?? found.bytes }
```

</details>

**依据 2 · 源码核查**：[src/attachment-loop.ts:164-206](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/attachment-loop.ts#L164-L206)

面板名称检测与写入分开，失败按目的路径清理。

<details>
<summary>查看原文（43行）</summary>

```text
export async function exportToWorkspace(
  config: AttachmentLoopConfig,
  attachments: AttachmentStoreLike,
  entry: { name: string; sha: string; bytes: number },
  cwd: string
): Promise<string> {
  const destDir = join(cwd, 'attachments')
  await fsp.mkdir(destDir, { recursive: true })
  let base = sanitizeFileNameForPath(entry.name)
  if (base === '' || base === 'download') base = `attachment-${entry.sha.slice(0, 8)}`
  if (base.length > MAX_SAFE_NAME) base = base.slice(0, MAX_SAFE_NAME)
  const dot = base.lastIndexOf('.')
  const stem = dot > 0 ? base.slice(0, dot) : base
  const ext = dot > 0 ? base.slice(dot) : ''
  let name = `${stem}${ext}`
  let counter = 1
  for (;;) {
    try {
      await fsp.access(join(destDir, name))
      name = `${stem}-${counter}${ext}`
      counter += 1
    } catch {
      break
    }
  }
  const dest = join(destDir, name)
  // 流式写：官方 seam 本身就是 AsyncIterable，全量缓冲再 concat 会让
  // maxDownloadBytes（默认 200 MiB）级的附件吃掉双倍堆。失败时清掉半个
  // 文件，不在工作区留残骸。
  try {
    await pipeline(
      Readable.from(attachments.readFileStream({
        attachmentId: `sha256:${entry.sha}`,
        name: entry.name,
        bytes: entry.bytes
      })),
      createWriteStream(dest)
    )
  } catch (error) {
    await fsp.rm(dest, { force: true }).catch(() => {})
    throw error
  }
  return `attachments/${name}`
```

</details>

**依据 3 · 源码核查**：[src/attachment-loop.ts:425-464](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/attachment-loop.ts#L425-L464)

通过 session 标识取 cwd 并启动面板导出。

<details>
<summary>查看原文（40行）</summary>

```text
        const url = req.url ?? ''
        const sessionId = queryParam(url, 'session')
        const ref = queryParam(url, 'ref')
        const normalized = ref === undefined ? undefined : normalizeAttachmentRef(ref)
        if (sessionId === undefined || normalized === undefined) {
          json(res, 400, failurePayload(
            'missing-parameters',
            'Export needs both query parameters: session=<session id> and ref=sha256:<64 hex digits>. The panel supplies them; a manual call must pass both.'
          ))
          return
        }
        const entry = await findEntry(config, normalized)
        if (entry === undefined) {
          json(res, 404, failurePayload(
            'attachment-not-found',
            'No attachment in the library carries that content reference. List them first with GET /plugins/dsh-files/attachments and use its "ref" field.'
          ))
          return
        }
        if (entry.bytes > config.maxDownloadBytes) {
          json(res, 413, tooLargePayload('export', entry.name, entry.bytes, config.maxDownloadBytes))
          return
        }
        const session = sessions.get(sessionId)
        const cwd = session?.header?.cwd
        if (typeof cwd !== 'string' || cwd === '') {
          json(res, 400, failurePayload(
            'session-without-workspace',
            'That session has no workspace directory, so there is nowhere to export into. Open a session bound to a workspace (or set one for this session) and retry.'
          ))
          return
        }
        try {
          const relativePath = await exportToWorkspace(config, attachments, entry, cwd)
          json(res, 200, { relativePath })
        } catch (error) {
          json(res, 500, failurePayload(
            'export-failed',
            `The attachment could not be written into the session workspace. Check that the workspace directory is writable. Reason: ${error instanceof Error ? error.message : 'unknown error'}`
          ))
```

</details>

**依据 4 · 源码核查**：[src/attachment-loop.ts:228-232](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/attachment-loop.ts#L228-L232)

路由使用 Host 头守卫。

```text
  const fence = (req: IncomingMessage, res: ServerResponse): boolean => {
    if (isTrustedRequest({ headers: req.headers as { host?: string } }, config.trustedHosts)) return true
    const authority = req.headers.host
    json(res, 403, hostNotTrustedPayload(typeof authority === 'string' ? authority : '(missing)', config.trustedHosts))
    return false
```

**依据 5 · 源码核查**：[src/attachments/fence.ts:40-67](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/attachments/fence.ts#L40-L67)

回环或可信 Host 匹配。

<details>
<summary>查看原文（28行）</summary>

```text
/**
 * Decide whether one request is trusted to reach attachment routes.
 *
 * `trustedHosts` entries are either a bare host (matches any port) or
 * `host:port` (exact authority match). The Host header may contain a port;
 * `host` alone accepts any port. Loopback is always trusted.
 */
export function isTrustedRequest(req: FenceRequest, trustedHosts: readonly string[]): boolean {
  const raw = req.headers.host
  const authority = Array.isArray(raw) ? raw[0] : raw
  if (authority === undefined || authority === '') return false
  const host = hostnameOf(authority)
  if (isLoopbackHostname(host)) return true
  for (const entry of trustedHosts) {
    if (entry === '') continue
    const entryHost = hostnameOf(entry)
    if (host !== entryHost) continue
    // Entries with a port must match the request authority exactly.
    const entryPort = entry.split(':').slice(-1)[0]
    if (/^\d+$/.test(entryPort) && entry.includes(':')) {
      if (authority === entry) return true
      continue
    }
    // Bare host: any port passes.
    return true
  }
  return false
}
```

</details>

**依据 6 · 源码核查**：[src/attachment-loop.ts:259-285](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/attachment-loop.ts#L259-L285)

按摘要确认条目并递归删除。

<details>
<summary>查看原文（27行）</summary>

```text
      if (method === 'DELETE') {
        const ref = queryParam(req.url, 'ref')
        const normalized = ref === undefined ? undefined : normalizeAttachmentRef(ref)
        if (normalized === undefined) {
          json(res, 400, failurePayload(
            'invalid-ref',
            'The ref query parameter must be a content reference of the form sha256:<64 hex digits>, exactly as returned in the "ref" field of GET /plugins/dsh-files/attachments.'
          ))
          return
        }
        const entry = await findEntry(config, normalized)
        if (entry === undefined) {
          json(res, 404, failurePayload(
            'attachment-not-found',
            'No attachment in the library carries that content reference. List them first with GET /plugins/dsh-files/attachments and use its "ref" field.'
          ))
          return
        }
        const objDir = join(config.attachmentsDir, 'files', entry.sha.slice(0, 2), entry.sha)
        try {
          await fsp.rm(objDir, { recursive: true, force: true })
          json(res, 200, { deleted: entry.name, sha: entry.sha.slice(0, 8), bytes: entry.bytes })
        } catch (error) {
          json(res, 500, failurePayload(
            'delete-failed',
            `The attachment could not be deleted. Check that the attachment library directory is writable. Reason: ${error instanceof Error ? error.message : 'unknown error'}`
          ))
```

</details>

**依据 7 · 源码核查**：[src/client/dock.tsx:523-554](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/client/dock.tsx#L523-L554)

四秒内二次确认后发送 DELETE。

<details>
<summary>查看原文（32行）</summary>

```text
  // 删除是不可逆动作且按钮与下载/导出并排：两步确认（首击进入确认态，
  // 再击执行；4 秒未确认自动复位），防误点即永久丢失。
  const confirmTimer = useRef<number | undefined>(undefined)
  const armDelete = (item: AttachmentItem) => {
    if (pendingDelete === item.ref) {
      void deleteOne(item)
      return
    }
    setPendingDelete(item.ref)
    setNote(`再次点击确认删除「${item.name}」（不可恢复）`)
    window.clearTimeout(confirmTimer.current)
    confirmTimer.current = window.setTimeout(() => setPendingDelete(null), 4000)
  }
  const deleteOne = async (item: AttachmentItem) => {
    if (sessionId === undefined) {
      setNote('无当前会话')
      return
    }
    window.clearTimeout(confirmTimer.current)
    setPendingDelete(null)
    setNote('')
    setDeletingRef(item.ref)
    try {
      const response = await fetch(
        `/plugins/dsh-files/attachments?ref=${encodeURIComponent(item.ref)}`,
        { method: 'DELETE' }
      )
      const body = (await response.json()) as { deleted?: string } & RouteFailureBody
      if (response.ok && body.deleted !== undefined) {
        setNote(`已删除 ${body.deleted}`)
        // 删除后刷新列表（mtime 变化 → 缓存自动失效）
        load()
```

</details>

#### 缺口

- 未在真实宿主验证反代准入、并发导出及符号链接边界
  **影响**：无法承诺共享部署身份隔离或所有面板导出可安全重试
  **进一步探讨**：在独立库与工作区测试双请求和符号链接，检查原件哈希和路径

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样判断旧附件检索和按页读取值不值得反复使用？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断、工程质量与复用

#### 完整回答

已有可用 DSH Web 和本机受控附件库的用户，先用一个公开且自带文字层的 PDF 上传，另开会话用库检索、引用并只读一页，再与原件核对标记文字。首次需确认宿主 client/Host 兼容、附件库路径及原生服务，保留本地原件。持续负担是验证页码、截断和重新读取大型文档；遇到候选缺失、摘要对应错文件或页面抽不出，暂停使用当前引用，回本地打开原件，必要时只粘贴核对过的段落。失败和退出时停用面板路由或插件，保留原件，试用不涉及删除与向共享库写入。仅关闭附件路由仍保留模型工具，需要退出时分别核对工具和 UI 是否停用。

待验假设是让新会话重复引用宿主已存的附件，可减少再次找本地原件和粘贴的次数。用同一公开样例比较准备时间、找对附件率和段落一致性，再用扫描件作为负向样例。面板读库不会直接发送全文，工具输出开销需由实际宿主计量。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:35-73](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/package.json#L35-L73)

包声明 Web 兼容和解析依赖，部分操作状态未知。

<details>
<summary>查看原文（39行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "dsh": {
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-conversation"
      ],
      "platform": "web"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "compatibility": {
      "dsh": "^0.1.0-rc.6 || ^0.1.1-rc.2 || ^0.2.0-rc.1 || ^0.2.1-alpha.3 || ^0.2.2-0",
      "dshReleases": {
        "0.2.0-rc.2": "compatible",
        "0.2.1-alpha.3": "compatible",
        "0.2.1-rc.2": "compatible",
        "0.2.1-rc.3": "compatible",
        "0.2.2-alpha.2": "compatible",
        "0.2.2-rc.1": "compatible"
      },
      "dshOperations": {
        "0.2.0-rc.2": {
          "install": "passed",
          "start": "passed",
          "uninstall": "unknown",
          "rollback": "unknown"
        }
      }
    }
  },
  "dependencies": {
    "jszip": "^3.10.1",
    "mammoth": "^1.8.0",
    "pdfjs-dist": "^4.10.38",
    "read-excel-file": "^5.8.7",
    "word-extractor": "^1.0.4"
```

</details>

**依据 2 · 源码核查**：[src/index.ts:102-116](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/index.ts#L102-L116)

附件工具与可选路由的启停边界。

<details>
<summary>查看原文（15行）</summary>

```text
  ctx.tools.register(defineAttachmentListTool({ attachmentsDir }))
  ctx.tools.register(defineAttachmentExportTool(ctx, { attachmentsDir }))

  // ---- Attachment loop: panel / download / export / @ source routes ----
  // All services are optional: the read_document + attachment tools keep
  // working in headless or attachment-less deployments; routes simply skip.
  // Registration is deferred through ctx.inject — webServer/attachments/
  // sessions initialize after this plugin's apply, and a plain ctx.get at
  // apply time would see a not-yet-activated webServer (probe-verified).
  if (!config.attachmentsEnabled) return
  ctx.inject?.(
    ['webServer', 'attachments', 'sessions', 'llm'],
    (loopCtx: any) => {
      try {
        registerAttachmentRoutes(
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:130-155](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/client/index.tsx#L130-L155)

引用需要宿主句柄，故障与空列表分支。

<details>
<summary>查看原文（26行）</summary>

```text
      // 5a: 候选 = 附件库条目；只有 host 给出官方 handle 文本的行才提供引用
      // (模型能看到与上传时一致的文件行)。插入文本即 handle 本身——与官方
      // @ 引用只插路径的契约不同，附件不在工作区，模型识别的就是 handle 行。
      candidates: async () => {
        const result = await fetchAttachments()
        // 路由失败（含 403 未授权 host）与「库里没附件」是两件事：前者在
        // 控制台留下服务端 hint，未知部署者据此知道该改哪个配置键。
        if (!result.ok) {
          if (result.status !== 0) {
            console.warn(`[dsh-files] @ 附件源不可用（HTTP ${result.status}）：${result.hint ?? '无 hint'}`)
          }
          return []
        }
        // 库内有附件却全部缺 handle = llm 服务缺席，@ 组会静默消失——
        // 留一条可诊断日志，区分「没附件」和「服务没接上」。
        if (result.rows.length > 0 && result.rows.every((row) => row.handle === undefined || row.handle === '')) {
          console.warn('[dsh-files] @ 附件源：库内有附件但 host 未提供 handle（llm 服务缺席），候选不可用')
        }
        return result.rows
          .filter((row) => row.handle !== undefined && row.handle !== '')
          .slice(0, 50)
          .map((row) => ({
            name: row.name,
            description: `附件 · ${formatBytes(row.bytes)}`,
            icon: 'file',
            value: row.handle ?? row.ref
```

</details>

**依据 4 · 源码核查**：[src/attachment-tool.ts:70-88](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/attachment-tool.ts#L70-L88)

检索与截断。

<details>
<summary>查看原文（19行）</summary>

```text
    isConcurrencySafe: () => true,
    async execute(args) {
      const all = await listAttachments(config.attachmentsDir)
      // query 是名字子串过滤：截断发生在过滤之后——大库按名检索仍然可达，
      // 而不是被前 200 条截断挡在外面。计数与字节数都按过滤后口径上报。
      const rawQuery = typeof args.query === 'string' ? args.query.trim().toLowerCase() : ''
      const matches = rawQuery === '' ? all : all.filter((entry) => entry.name.toLowerCase().includes(rawQuery))
      const items = matches.slice(0, MAX_LIST_ITEMS)
      return {
        count: matches.length,
        truncated: matches.length > items.length,
        totalBytes: matches.reduce((sum, entry) => sum + entry.bytes, 0),
        items: items.map((entry) => ({
          name: entry.name,
          sha: entry.sha.slice(0, 8),
          bytes: entry.bytes,
          modified: formatTime(entry.modifiedMs)
        }))
      }
```

</details>

**依据 5 · 源码核查**：[src/parse/pdf.ts:79-88](https://github.com/taxueseek/dsh-files/blob/5759656699e1c4d5c3bea5bac51e674ef52158cd/src/parse/pdf.ts#L79-L88)

纯图 PDF 的停止信号。

<details>
<summary>查看原文（10行）</summary>

```text
    const text = pages.join('\n\n')
    // 扫描件/纯图片 PDF 没有文本层：返回显式提示而非空串，
    // 防止模型把「无文本」误读成「空文件」。
    if (text.trim() === '' && doc.numPages > 0) {
      return '\n[此 PDF 没有文本层（可能是扫描件或纯图片文档），read_document 无法提取文字内容。建议直接使用宿主多模态视觉能力进行识读]\n'
    }
    return text
  } finally {
    await doc.destroy()
  }
```

</details>

#### 缺口

- 未测隔离环境的启停、复用耗时与段落准确率
  **影响**：无法判断长期省时或实际支持矩阵
  **进一步探讨**：在单用户测试 profile 完成公开样例对照和停用检查

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
