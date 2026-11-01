# Univer Office

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[c593321](https://github.com/dream-num/dsh-univer-office/tree/c59332186fbd0051596b6ef5d73b8322204ad1d5)

<!-- BEGIN META -->
[![GitHub ★ 650](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=650&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dream-num/dsh-univer-office) [![npm 30d 46,073](https://img.shields.io/static/v1?label=npm+30d&message=46%2C073&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-univer-office) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-univer-office)
<!-- END META -->

> **功能**：在 DSH 中以 Univer 草稿编辑、预览和审阅表格、文档与演示。

> **亮点**：连接 DSH 工具、Univer 协作进程与审阅视图，集中编辑与发布路径；引擎和文件格式能力由上游提供。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：多进程草稿、导出和权限是否在真实宿主中可靠，收益能否超过格式保真和运维成本？[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 谁适合使用，与普通 Office 文件工作流相比增加什么？](#detail-section-11)
  - [Q02 · 模型操作和人工审阅如何连接？](#detail-section-12)
  - [Q03 · 工作区、浏览器代理和失败边界是什么？](#detail-section-13)
  - [Q04 · 安装与使用需要哪些条件和成本？](#detail-section-14)
  - [Q05 · 贡献如何归因，哪项新假设值得对照？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 用户希望在会话里生成、修改并审阅办公文件，按需交付常见格式。[Q01](#research-q01)

普通办公应用或文件库各自处理编辑与导出；本组件将 Univer 工作流接入 DSH，会话收益与保真需对照。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 草稿编辑 | 在指定 worktree 和 Unit 执行编辑 | Host 路径需要工作区校验 |
| 审阅 | 展示、合并或丢弃草稿 | 模型审批依赖宿主执行器落实 ask |
| 办公导入导出 | 转换支持格式 | 复杂格式保真未验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH、Node 与 Univer Gateway | 必需 | 注册工具、预览及协作 | 无法假定插件可用 |
| Chromium 类浏览器 | 截图、PDF 和布局检查需要 | 渲染及视觉校验 | 对应能力不可用 |
| 可信认证浏览器与文件权限 | 必需 | 限制协作访问 | 后续 Gateway 不按会话重复校验 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 备份原文件并确认宿主与权限 | 使用隔离工作区 |
| 草稿 | Agent 创建 worktree 并编辑 Unit | 核对目标文件和内容 |
| 审阅 | 用户比较并决定合并或丢弃 | 验证审批、状态和视觉效果 |
| 交付 | 导出并在目标 Office 应用检查 | 有格式损失时回退原件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 许可与计算成本未知 | 安装、备份与确认环境 | DSH 和浏览器兼容未测 |
| 持续 | Gateway、Viewer 和转换资源未知 | 审阅和格式校验 | telemetry 默认开启 |
| 恢复 | 存储和重试成本未知 | 核对状态、备份和导出 | 超时后结果不明需读回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话草稿 | 工具、Gateway 与审核入口有接线 | 宿主审批是否按预期生效 |
| 格式交付 | 提供导入导出入口 | 复杂文件往返保真 |

> **思考**：多进程草稿、导出和权限是否在真实宿主中可靠，收益能否超过格式保真和运维成本？[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：连接 DSH 工具、Univer 协作进程与审阅视图，集中编辑与发布路径；引擎和文件格式能力由上游提供。[Q01](#research-q01) [Q02](#research-q02)

工具路径重验工作区，模型合并通过 pre-execute ask 并检查 ready；Viewer 后续 /uf 范围不同，不能以会话 UI 推断文件级隔离。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

多进程草稿、导出和权限是否在真实宿主中可靠，收益能否超过格式保真和运维成本？[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先备份并在隔离工作区测试小型文件，验证审批、权限和目标 Office 打开效果，再决定交付；失败时保留原件。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码与作者文档支持代表路径；未执行宿主、浏览器、格式转换与恢复实验。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、src/host/index.ts、src/host/tools/plugin.ts、src/host/tools/definitions/execute.ts、src/host/tools/definitions/worktree.ts、src/host/provider/gateway-univer-service.ts、src/host/webServer/routes/worktree-action.ts、src/host/service/workspace.ts、src/host/webServer/viewer-proxy.ts、src/host/tools/definitions/export.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态检查 Host 组合、工具、草稿动作、Viewer 代理和作者限制；未全审 Gateway 协议、SDK 或导出，未执行目标、宿主及浏览器。
- 下一步：在隔离 profile 验证审批拒绝与同意、跨会话代理、超时读回和 Office 格式往返。

**分析版本**

- **仓库**：[dream-num/dsh-univer-office](https://github.com/dream-num/dsh-univer-office)
- **版本号**：0.3.9（[固定提交 c593321](https://github.com/dream-num/dsh-univer-office/tree/c59332186fbd0051596b6ef5d73b8322204ad1d5)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

假设审批卡展示导出结构差异及抽样渲染可减少格式损失漏检；以固定文件集和审阅人比较漏检、误报及时间，若收益不足则否定。[Q05](#research-q05)

在隔离 profile 验证审批拒绝与同意、跨会话代理、超时读回和 Office 格式往返。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 35 | 3817 | — | — | 43228 |
| .mjs | source | 10 | 1183 | 1008 | 112 | — |
| .ts | source | 395 | 40991 | 36433 | 1620 | — |
| .tsx | source | 74 | 10558 | 9675 | 300 | — |
| .ts | test | 40 | 9208 | 8423 | 316 | — |
| .tsx | test | 4 | 521 | 481 | 3 | — |
| .tsx | example | 1 | 174 | 171 | 2 | — |
| .md | example | 1 | 34 | — | — | 328 |

</details>

**活跃度**

[![Issue 未关闭 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=12&color=737b86&logo=github)](https://github.com/dream-num/dsh-univer-office/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=11&color=737b86&logo=github)](https://github.com/dream-num/dsh-univer-office/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/dream-num/dsh-univer-office/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 Univer 草稿编辑、审阅发布与安全和兼容边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁适合使用，与普通 Office 文件工作流相比增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

使用 DSH 的用户可让 Agent 在 Univer 文件草稿中编辑表格、文档和演示，再在会话界面预览、比较与审核，按需导出常见 Office 格式。作者还描述 Base 与 Board，但 Board 文件导出和部分高级功能未支持。相较外部应用中往返保存，它把草稿、工具调用和审阅接入会话；Univer 编辑引擎与 Office 格式本身是依赖，不应归为本插件原创，也没有实测精度或效率对照。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-6](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/package.json#L1-L6)

项目、版本和 Host 入口。

```text
{
  "name": "dsh-univer-office",
  "version": "0.3.9",
  "description": "DSH × Univer integration with a bundled collaboration Gateway and Viewer: inline previews, live floating Worktree windows, and session-end review actions in DeepSeek Harness.",
  "type": "module",
  "main": "./lib/index.js",
```

**依据 2 · 作者声明**：[README.md:68-78](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/README.md#L68-L78)

作者描述各内容类型、草稿和审阅。

<details>
<summary>查看原文（11行）</summary>

```text
## What can it do?

- **Analyze and build spreadsheets** — read or create Excel data, clean fields, write formulas, apply formatting and validation, create tables, charts, pivots, filters, sparklines, conditional formatting, and images, then export the result as `.xlsx`, `.csv`, or `.tsv`.
- **Write and lay out documents** — create paragraphs, rich text, lists, tasks, tables, images, charts, headers, footers, pagination, and page layouts.
- **Create and revise presentations** — generate a deck from an outline, redesign selected pages, edit text, shapes, images, tables, charts, and transitions, then detect off-page, overflowing, and overlapping text.
- **Build lightweight databases** — create Base tables, fields, records, and views with formula fields, filters, sorting, grouping, and Sheet-backed references.
- **Draw editable canvases** — create shapes, text, connectors, images, native charts, and diagrams, with connector and layout analysis.
- **Compose several content types** — one `.univer` file can contain Sheets, Docs, Slides, Bases, and Boards. Formulas and embedded content can reference other content in the same file.
- **Work with Office files** — import `.xlsx`, `.csv`, `.tsv`, `.docx`, and `.pptx`, then export the edited content in the matching format.
- **Review agent changes safely** — every write starts in an isolated draft. Watch changes live, then approve or discard them instead of letting the agent overwrite the current version.
- **Compare worktree changes semantically** — switch a draft or submitted worktree from View to Compare to inspect Sheet, Doc, Slide, Base, or Board changes side by side against a pinned trunk version or another active worktree.
```

</details>

**依据 3 · 作者声明**：[README.md:149-167](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/README.md#L149-L167)

作者列出工具与用途。

<details>
<summary>查看原文（19行）</summary>

```text
## Built-in tools

DSH selects these tools automatically; you normally do not need to call them manually.

| Tool | Purpose |
| --- | --- |
| `univer_new` | Create an empty `.univer` file without overwriting an existing file |
| `univer_status` | View the content and draft status of a file |
| `univer_worktree` | Create, submit, revise, approve, or discard an isolated draft |
| `univer_unit` | Add or remove Sheet, Doc, Slide, Base, or Board content |
| `univer_import` | Import an Office file into a `.univer` file; docx keeps its page setup by default, `docType` selects traditional (default) or modern |
| `univer_inspect` | Read document structure or a selected Sheet range |
| `univer_execute` | Read or edit content through the Univer API |
| `univer_export` | Export Sheet, Doc, Slide, or Base content |
| `univer_lint` | Find off-page, overflowing, and overlapping Slide text |
| `univer_compile_svg` | Add an SVG layout to a Slide with measured text |
| `univer_screenshot` | Render supported content as PNG images for review |
| `univer_print_pdf` | Print a Sheet, Doc, Slide, or Board to a workspace PDF file |
| `univer_api` | Find bundled Univer API symbols by keyword and show exact references |
```

</details>

**依据 4 · 作者声明**：[README.md:183-191](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/README.md#L183-L191)

作者说明格式、浏览器及功能限制。

```text
## Requirements and current limits

- DeepSeek Harness and Node.js `>=22.19.0`.
- The file-tree preview needs no extra plugin: it registers a tab type on DSH's right sidebar and claims `dsh-resource://file/**` addresses ending in `.univer`. While `dsh-better-sidebar` (`^0.19.0`) is installed it takes over file addresses at the same priority with a broader pattern, so the preview is registered as one of its file viewers instead — both shapes are covered, and only one ever applies.
- Older `.univer` files are automatically upgraded to format v3 when opened. A backup is saved beside the original; migration and validation run on a temporary copy, which replaces the original only after success. Failed upgrades leave the original unchanged. Opening the same unchanged file again reuses that backup instead of writing another copy.
- Screenshots, PDF printing, Slide layout checks, and SVG text measurement need a local Chromium-family browser. Chrome/Chromium and Microsoft Edge are detected automatically; set the `browserExecutablePath` option or the `UNIVER_RENDER_BROWSER` environment variable to point at a specific executable (for example Edge on Windows).
- Slide master pages, layout pages, and speaker notes are outside the current editing scope.
- Board mind maps, tables, ink, advanced editing, and file export are not yet supported.
- While bundled task guidance is enabled, the plugin replaces DSH's built-in `office`, `office-docx`, `office-xlsx`, and `office-pptx` skills so Word, Excel, and PowerPoint tasks go through Univer instead of python-docx, openpyxl, or python-pptx. DSH's LibreOffice Kit skills (`office-render`, `office-recalculate`, and `office-export-pdf`) stay available. Set `skills: false` to keep DSH's originals.
```

#### 缺口

- 缺少同样素材下的真实编辑、格式保真和人工时间对照。
  **影响**：当前结论仅限固定源码与作者说明，不证明实际交付效果。
  **进一步探讨**：在隔离工作区以简单 xlsx、docx、pptx 对比常用办公软件的导入、编辑与导出。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型操作和人工审阅如何连接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 挂载 Provider、Web、工具和 Skill；工具将文件限制到当前工作区，execute 要求明确的 worktree 与 Unit 并委派内容服务，worktree 调用将创建或状态变更交给 Gateway，模型路径 merge 还要求目标处于 ready。工具插件对模型的 merge/discard 注册 pre-execute ask 事件，是否真正提示并拒绝未批准调用还依赖宿主执行器遵守该事件；不能推广到所有自定义执行器。浏览器审阅路由验证 session 工作区并调用 service，其交互授权由浏览器入口与宿主承载，不等价于模型工具审批事件。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:34-46](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/src/host/index.ts#L34-L46)

组合 provider、Web、工具与 Skill。

<details>
<summary>查看原文（13行）</summary>

```text
export const name = 'dsh-univer-office'

/** Compose the Univer Provider and its Web/Tools Consumers. */
export function apply(ctx: Context, config: UniverConfig = {}): void {
  const resolved = resolveConfig(config)
  // Fire-and-forget: bounded by an internal timeout and never throws, so it
  // can neither delay activation nor leave work for unload to settle.
  void runHostTelemetry({ telemetryEnabled: resolved.telemetry })
  ctx.plugin(settings)
  ctx.plugin(provider, resolved)
  ctx.plugin(webServer)
  if (resolved.tools) ctx.plugin(tools, resolved)
  if (resolved.skills) ctx.plugin(skills)
```

</details>

**依据 2 · 源码核查**：[src/host/tools/plugin.ts:20-36](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/src/host/tools/plugin.ts#L20-L36)

注册工具并注入宿主工具服务。

<details>
<summary>查看原文（17行）</summary>

```text
export const inject = ['univer', 'tools']
export const name = 'univer-tools'

/** Register model-facing domain tools over `ctx.univer`. */
export function apply(ctx: Context, config: ResolvedConfig): void {
  const gatewayReadTimeoutMs = config.gatewayStartupTimeoutMs + config.gatewayRequestTimeoutMs
  const gatewayWriteTimeoutMs = config.gatewayStartupTimeoutMs + config.gatewayMutationTimeoutMs
  const unitContentTimeoutMs = config.gatewayStartupTimeoutMs + config.unitContentOperationTimeoutMs
  const screenshotTimeoutMs = config.gatewayStartupTimeoutMs + config.screenshotOperationTimeoutMs
  const printPdfTimeoutMs = config.gatewayStartupTimeoutMs + config.printPdfOperationTimeoutMs
  ctx.tools.register(withUniverErrorContent(newTool(ctx, gatewayWriteTimeoutMs)))
  ctx.tools.register(withUniverErrorContent(statusTool(ctx, gatewayReadTimeoutMs)))
  ctx.tools.register(withUniverErrorContent(worktreeTool(ctx, gatewayWriteTimeoutMs)))
  ctx.tools.register(withUniverErrorContent(unitTool(ctx, gatewayWriteTimeoutMs)))
  ctx.tools.register(withUniverErrorContent(importTool(ctx, unitContentTimeoutMs)))
  ctx.tools.register(withUniverErrorContent(inspectTool(ctx, unitContentTimeoutMs)))
  ctx.tools.register(withUniverErrorContent(executeTool(ctx, unitContentTimeoutMs)))
```

</details>

**依据 3 · 源码核查**：[src/host/tools/plugin.ts:48-59](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/src/host/tools/plugin.ts#L48-L59)

对模型 worktree merge/discard 注册 ask 事件。

<details>
<summary>查看原文（12行）</summary>

```text
  ctx.on('tools/pre-execute', (exec, next) => {
    if (exec.name !== 'univer_worktree' || !isRecord(exec.arguments)) return next()
    const action = exec.arguments.action
    if (action !== 'merge' && action !== 'discard') return next()
    return Promise.resolve({
      kind: 'ask',
      reason:
        action === 'merge'
          ? 'Merging publishes the selected Univer worktree into trunk.'
          : 'Discarding permanently removes the selected Univer worktree changes.'
    })
  })
```

</details>

**依据 4 · 源码核查**：[src/host/tools/definitions/execute.ts:10-47](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/src/host/tools/definitions/execute.ts#L10-L47)

执行要求工作树、Unit、工作区与代码。

<details>
<summary>查看原文（38行）</summary>

```text
export function executeTool(ctx: Context, timeoutMs: number) {
  return defineTool({
    name: 'univer_execute',
    description:
      'Execute Univer Facade JavaScript and commit mutations to a draft agent worktree. Use code only for a small snippet and codeFile for multiline or reusable code. Provide exactly one source. Explicitly return readback values; bare expressions and console.log do not populate value. Read-only code creates no revision.',
    timeoutMs,
    parameters: {
      file: {
        type: 'string',
        required: true,
        description: 'Workspace-relative or absolute .univer path.'
      },
      code: {
        type: 'string',
        description:
          'Inline Facade code; use codeFile for multiline code. Mutually exclusive with codeFile.'
      },
      codeFile: {
        type: 'string',
        description:
          'Workspace-relative or absolute multiline Facade JavaScript body file. Mutually exclusive with code.'
      },
      worktreeId: { type: 'string', required: true, description: 'Writable agent worktree id.' },
      unitId: { type: 'string', required: true, description: 'Target unit id.' }
    },
    output: operationOutput,
    async execute(args, exec) {
      const target = await existingToolFile(exec, args.file)
      const code = await resolveExecutionCode(exec, args.code, args.codeFile)
      return ctx.univer.executeUnitContent(
        {
          workspace: target.workspace,
          file: target.path,
          code,
          worktreeId: worktreeId(args.worktreeId),
          unitId: unitId(args.unitId)
        },
        exec.signal
```

</details>

**依据 5 · 源码核查**：[src/host/tools/definitions/worktree.ts:9-63](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/src/host/tools/definitions/worktree.ts#L9-L63)

worktree 工具校验与委派。

<details>
<summary>查看原文（55行）</summary>

```text
/** Create the agent-safe `univer_worktree` tool definition. */
export function worktreeTool(ctx: Context, timeoutMs: number) {
  return defineTool({
    name: 'univer_worktree',
    description:
      'Create or transition an isolated Univer worktree. Actions: create, ready, reopen, merge, or discard. Merge and discard require user approval.',
    timeoutMs,
    parameters: {
      action: {
        type: 'string',
        required: true,
        enum: ['create', 'ready', 'reopen', 'merge', 'discard'],
        description: 'Lifecycle action.'
      },
      file: {
        type: 'string',
        required: true,
        description: 'Workspace-relative or absolute .univer path.'
      },
      worktreeId: { type: 'string', description: 'Required for every action except create.' },
      name: { type: 'string', description: 'Optional human-readable name for create.' }
    },
    output: operationOutput,
    async execute(args, exec) {
      const target = await existingToolFile(exec, args.file)
      if (args.action === 'create') {
        return stripGatewaySuccessEnvelope(
          await ctx.univer.worktree(
            {
              action: 'create',
              workspace: target.workspace,
              file: target.path,
              ...(args.name === undefined ? {} : { name: args.name })
            },
            exec.signal
          )
        )
      }
      if (args.worktreeId === undefined || args.worktreeId.length === 0) {
        throw new UniverError(
          `univer_worktree ${args.action} requires worktreeId.`,
          'INVALID_REQUEST'
        )
      }
      return stripGatewaySuccessEnvelope(
        await ctx.univer.worktree(
          {
            action: args.action,
            workspace: target.workspace,
            file: target.path,
            worktreeId: worktreeId(args.worktreeId)
          },
          exec.signal
        )
      )
```

</details>

**依据 6 · 源码核查**：[src/host/provider/gateway-univer-service.ts:212-230](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/src/host/provider/gateway-univer-service.ts#L212-L230)

服务验证路径并交给 Gateway。

<details>
<summary>查看原文（19行）</summary>

```text
  /** Create or transition one worktree. */
  async worktree(
    request: WorktreeOperationRequest,
    signal?: AbortSignal
  ): Promise<UniverOperationResult> {
    await assertAuthorizedPath(request.workspace, request.file, true)
    signal?.throwIfAborted()
    const gateway = await this.requireGateway()
    const api = new GatewayWorktreeApi(
      new GatewayClient(gateway, this.config.gatewayMutationTimeoutMs)
    )
    const result =
      request.action === 'create'
        ? await api.create(request.file, request.name)
        : await this.transitionWorktree(gateway, request)
    requireGatewaySuccess(result, `Gateway rejected worktree ${request.action}.`)
    signal?.throwIfAborted()
    const id = worktreeResultId(result, request)
    this.invalidate(request.file, id)
```

</details>

**依据 7 · 源码核查**：[src/host/provider/gateway-univer-service.ts:553-561](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/src/host/provider/gateway-univer-service.ts#L553-L561)

模型 worktree merge 前核验 ready 状态。

```text
  private async transitionWorktree(
    gateway: string,
    request: Exclude<WorktreeOperationRequest, { action: 'create' }>
  ): Promise<JsonValue> {
    if (request.action === 'merge')
      await this.requireWorktreeStatus(gateway, request.file, request.worktreeId, 'ready')
    return new GatewayWorktreeApi(
      new GatewayClient(gateway, this.config.gatewayMutationTimeoutMs)
    ).action(request.file, request.worktreeId, request.action)
```

**依据 8 · 源码核查**：[src/host/webServer/routes/worktree-action.ts:16-35](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/src/host/webServer/routes/worktree-action.ts#L16-L35)

浏览器路由核验 session 文件并执行动作。

<details>
<summary>查看原文（20行）</summary>

```text
/** Validate and execute one browser-owned worktree review action. */
export async function worktreeActionRoute(
  service: UniverService,
  sessions: SessionStore,
  body: unknown
) {
  if (!isObject(body)) throw new UniverError('JSON object body is required', 'INVALID_REQUEST')
  const action = body.action
  if (action !== 'ready' && action !== 'reopen' && action !== 'discard' && action !== 'merge') {
    throw new UniverError('action must be ready | reopen | discard | merge', 'INVALID_REQUEST')
  }
  if (typeof body.worktreeId !== 'string' || body.worktreeId.length === 0) {
    throw new UniverError('worktreeId is required', 'INVALID_REQUEST')
  }
  const authorized = await resolveAuthorizedFile(body.file, body.sessionId, sessions)
  return service.worktreeAction({
    action,
    workspace: authorized.workspace,
    file: authorized.path,
    worktreeId: worktreeId(body.worktreeId)
```

</details>

#### 缺口

- 未在实际 DSH native 执行器和浏览器中验证 ask、拒绝或审批后状态。
  **影响**：当前结论仅限固定源码与作者说明，不证明实际交付效果。
  **进一步探讨**：在隔离会话分别测试拒绝、批准、切换 worktree 和重启回读。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 工作区、浏览器代理和失败边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

模型服务路径通过 realpath 检查工作区包含性并在 Provider 边界重验。Viewer 主文档打开时校验命名会话的文件范围，后续 /uf HTTP 与 WebSocket 通过宿主 connection 信任检查，但不重复按会话工作区检查；作者明确说明已认证浏览器可访问 Host 进程可访问的 .univer 文件。因此 UI 的会话展示隔离不能当作 Gateway 文件级租户隔离。服务在 worktree 请求后检查结果和取消，错误路径可尝试读回状态；发生超时或连接中断时不能凭客户端错误推断没有写入，应先刷新核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/service/workspace.ts:47-55](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/src/host/service/workspace.ts#L47-L55)

Provider 入口重新校验授权路径。

```text
/** Revalidate a branded service request at the provider boundary. */
export async function assertAuthorizedPath(
  workspace: WorkspacePath,
  value: string,
  mustExist: boolean
): Promise<void> {
  const resolved = await resolveAuthorizedPath(workspace, value, mustExist)
  if (resolved.workspace !== workspace || resolved.path !== value) {
    throw new UniverError('path changed after workspace authorization', 'SESSION_SCOPE_DENIED')
```

**依据 2 · 源码核查**：[src/host/service/workspace.ts:59-101](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/src/host/service/workspace.ts#L59-L101)

真实路径和工作区包含性校验。

<details>
<summary>查看原文（43行）</summary>

```text
async function resolveAuthorizedPath(
  cwd: string,
  value: string,
  mustExist: boolean
): Promise<AuthorizedPath> {
  if (value.trim().length === 0) throw new UniverError('path is required', 'INVALID_FILE_PATH')
  let workspace: string
  try {
    workspace = await realpath(cwd)
  } catch (error) {
    if (isPermissionError(error)) {
      throw new UniverError(
        'session workspace cannot be accessed because permission was denied',
        'FILE_PERMISSION_DENIED',
        { cause: error }
      )
    }
    const message = isMissingPathError(error)
      ? 'session workspace does not exist'
      : 'session workspace cannot be resolved'
    throw new UniverError(message, 'SESSION_SCOPE_UNAVAILABLE', { cause: error })
  }
  const candidate = isAbsolute(value) ? resolve(value) : resolve(workspace, value)
  let canonical: string
  try {
    canonical = mustExist ? await realpath(candidate) : await canonicalizePotentialPath(candidate)
  } catch (error) {
    if (isPermissionError(error)) {
      throw new UniverError(
        'path cannot be accessed because permission was denied',
        'FILE_PERMISSION_DENIED',
        { cause: error }
      )
    }
    const message =
      mustExist && isMissingPathError(error) ? 'path does not exist' : 'path cannot be resolved'
    throw new UniverError(message, 'INVALID_FILE_PATH', { cause: error })
  }
  const fromWorkspace = relative(workspace, canonical)
  if (fromWorkspace === '..' || fromWorkspace.startsWith(`..${sep}`) || isAbsolute(fromWorkspace)) {
    throw new UniverError('path is outside the session workspace', 'SESSION_SCOPE_DENIED')
  }
  return { workspace: workspacePath(workspace), path: canonical }
```

</details>

**依据 3 · 源码核查**：[src/host/webServer/viewer-proxy.ts:36-49](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/src/host/webServer/viewer-proxy.ts#L36-L49)

同源请求先检查 connection 信任。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * Same-origin proxy for the Viewer surface. Browser requests arrive on the DSH origin, pass the
 * `connection` trust fence, and are forwarded verbatim after document-only session scope checks
 * to the loopback Gateway. See docs/viewer-same-origin-deployment.md for the contract.
 */
export function createViewerProxy(options: ViewerProxyOptions): ViewerProxy {
  const { gatewayOrigin, sessions, connection } = options
  const wss = new WebSocketServer({ noServer: true })
  const bridges = new Set<() => void>()

  const httpHandler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const rejection = connection.requestRejection(req)
    if (rejection !== undefined) {
      reject(res, rejection)
```

</details>

**依据 4 · 源码核查**：[src/host/webServer/viewer-proxy.ts:77-101](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/src/host/webServer/viewer-proxy.ts#L77-L101)

仅 Viewer 文档验证命名会话范围，后续请求转发。

<details>
<summary>查看原文（25行）</summary>

```text
    if (pathname === VIEWER_BASE || pathname === `${VIEWER_BASE}/`) {
      // The Viewer document carries the addressing parameters: authorize the file against the
      // named live session. Subsequent Gateway traffic relies on DSH browser authentication.
      const file = url.searchParams.get('file')
      const sessionId = url.searchParams.get('sessionId')
      if (
        file === null ||
        !isGatewayFileKey(file) ||
        sessionId === null ||
        sessionId.length === 0
      ) {
        reject(res, 403)
        return
      }
      if (!(await isFileInSessionScope(decodeFileKey(file), sessionId, sessions))) {
        reject(res, 403)
        return
      }
    } else if (pathname.startsWith(`${VIEWER_BASE}/`)) {
      // Static Viewer assets are public code once the browser fence passed; no scope check.
    } else if (fileKeyOfUfPath(pathname) === null) {
      reject(res, url.pathname === '/uf' || url.pathname.startsWith('/uf/') ? 403 : 404)
      return
    }
    await forwardToGateway(req, res, gatewayOrigin)
```

</details>

**依据 5 · 源码核查**：[src/host/webServer/viewer-proxy.ts:104-136](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/src/host/webServer/viewer-proxy.ts#L104-L136)

WebSocket 信任检查并隧道转发。

<details>
<summary>查看原文（33行）</summary>

```text
  const upgradeHandler = (req: IncomingMessage, socket: Duplex, head: Buffer): void => {
    const fail = (status: 401 | 403): void => {
      const reason = status === 401 ? 'unauthorized' : 'forbidden'
      socket.write(`HTTP/1.1 ${String(status)} ${reason}\r\nconnection: close\r\n\r\n`)
      socket.destroy()
    }
    const rejection = connection.requestRejection(req)
    if (rejection !== undefined) {
      fail(rejection)
      return
    }
    let url: URL
    try {
      url = new URL(req.url ?? '/', 'http://localhost')
    } catch {
      socket.destroy()
      return
    }
    if (url.pathname !== VIEWER_WS_TUNNEL) {
      socket.destroy()
      return
    }
    const target = url.searchParams.get('target')
    if (target === null || !target.startsWith('/uf/')) {
      fail(403)
      return
    }
    const fileKey = fileKeyOfUfPath(target)
    if (fileKey === null) {
      fail(403)
      return
    }
    bridgeTunnel(req, socket, head, target, gatewayOrigin)
```

</details>

**依据 6 · 作者声明**：[README.md:219-219](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/README.md#L219-L219)

作者明确后续 uf 不重复会话范围检查。

```text
The Viewer, its HTTP API, and its WebSocket collaboration traffic are served by the plugin on the DSH WebServer origin itself (`/univer-viewer/...` and `/uf/...`), so remote deployments work through whatever entry already fronts DSH — no extra reverse-proxy configuration. Every browser request passes DSH browser authentication via the `connection` service. Viewer document opens and `/univer-api` requests also validate the named session workspace; subsequent `/uf` API and WebSocket requests do not require a plugin session cookie or repeat that workspace check. Authenticated browsers can address any `.univer` file accessible to the Host process, including in remote deployments. In DSH Desktop, the Viewer obtains the current Host loopback address through an authenticated runtime endpoint for WebSocket connections; HTTP requests continue through the desktop shell. The Gateway itself stays on loopback and is never exposed. (The former `viewerBaseUrl` option was removed by this change and is ignored.)
```

**依据 7 · 源码核查**：[src/host/provider/gateway-univer-service.ts:108-137](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/src/host/provider/gateway-univer-service.ts#L108-L137)

浏览器动作失败时尝试读回状态。

<details>
<summary>查看原文（30行）</summary>

```text
  /** Apply a browser review decision and return the refreshed state. */
  async worktreeAction(request: WorktreeActionRequest): Promise<WorktreeActionResult> {
    await assertAuthorizedPath(request.workspace, request.file, true)
    const available = await this.ensureGateway()
    if (!available.ok) return { ok: false, reason: available.reason }
    try {
      await this.worktrees.action(
        available.gateway,
        request.file,
        request.worktreeId,
        request.action
      )
      this.invalidate(request.file, request.worktreeId)
      return {
        ok: true,
        action: request.action,
        worktreeId: request.worktreeId,
        state: await this.fileState({ workspace: request.workspace, file: request.file })
      }
    } catch (error) {
      this.invalidate(request.file, request.worktreeId)
      const state = await this.fileState({
        workspace: request.workspace,
        file: request.file
      }).catch(() => undefined)
      return {
        ok: false,
        reason: error instanceof Error ? error.message : String(error),
        ...(state === undefined ? {} : { state })
      }
```

</details>

#### 缺口

- 未进行认证绕过、多会话对抗或超时故障注入。
  **影响**：当前结论仅限固定源码与作者说明，不证明实际交付效果。
  **进一步探讨**：用隔离工作区验证跨会话访问和超时后状态，在生产部署前确认宿主信任模型。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装与使用需要哪些条件和成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

项目声明指定 DSH 版本及 Node >=22.19，截图、PDF 和布局检查依赖本机 Chromium 类浏览器；新格式导出质量及复杂素材兼容需逐个检查。旧 .univer 文件打开时自动升级，作者称先备份并在临时副本校验后替换，但没有本轮实测。默认启用 bundled skills 会替换宿主部分 Office 指南；telemetry 默认开启，可用 DO_NOT_TRACK=1 或 telemetry: false 关闭。运行 Gateway、Viewer、进程池、Office 转换、授权及恢复均有资源与人工成本，现金数额未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:106-110](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/README.md#L106-L110)

作者列明支持的 DSH 版本。

```text
## Get started in 3 minutes

### 1. Install the plugin

Supported DSH versions are `0.1.5-rc.3`, `0.1.7-rc.1`, `0.2.0-rc.1`, and `0.2.1-rc.3`.
```

**依据 2 · 作者声明**：[README.md:183-191](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/README.md#L183-L191)

迁移、浏览器、内容功能和 Skill 替换限制。

```text
## Requirements and current limits

- DeepSeek Harness and Node.js `>=22.19.0`.
- The file-tree preview needs no extra plugin: it registers a tab type on DSH's right sidebar and claims `dsh-resource://file/**` addresses ending in `.univer`. While `dsh-better-sidebar` (`^0.19.0`) is installed it takes over file addresses at the same priority with a broader pattern, so the preview is registered as one of its file viewers instead — both shapes are covered, and only one ever applies.
- Older `.univer` files are automatically upgraded to format v3 when opened. A backup is saved beside the original; migration and validation run on a temporary copy, which replaces the original only after success. Failed upgrades leave the original unchanged. Opening the same unchanged file again reuses that backup instead of writing another copy.
- Screenshots, PDF printing, Slide layout checks, and SVG text measurement need a local Chromium-family browser. Chrome/Chromium and Microsoft Edge are detected automatically; set the `browserExecutablePath` option or the `UNIVER_RENDER_BROWSER` environment variable to point at a specific executable (for example Edge on Windows).
- Slide master pages, layout pages, and speaker notes are outside the current editing scope.
- Board mind maps, tables, ink, advanced editing, and file export are not yet supported.
- While bundled task guidance is enabled, the plugin replaces DSH's built-in `office`, `office-docx`, `office-xlsx`, and `office-pptx` skills so Word, Excel, and PowerPoint tasks go through Univer instead of python-docx, openpyxl, or python-pptx. DSH's LibreOffice Kit skills (`office-render`, `office-recalculate`, and `office-export-pdf`) stay available. Set `skills: false` to keep DSH's originals.
```

**依据 3 · 作者声明**：[README.md:195-217](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/README.md#L195-L217)

进程池限制、配置与 telemetry 默认值。

<details>
<summary>查看原文（23行）</summary>

```text
The defaults are designed for local use: the service starts at port `9080`. If that port is occupied, it tries `9081`, then continues upward one port at a time. Set these plugin options when you need different values:

| Field | Default | Purpose |
| --- | --- | --- |
| `gatewayPort` | `9080` | Initial loopback service port; occupied ports advance by one |
| `autoStartGateway` | `true` | Start the service on first use |
| `gatewayStartupTimeoutMs` | `10000` | Service startup timeout |
| `gatewayRequestTimeoutMs` | `3000` | State-read timeout |
| `gatewayMutationTimeoutMs` | `60000` | Write-operation timeout |
| `unitContentOperationTimeoutMs` | `120000` | Import, export, inspection, and execution timeout |
| `unitContentRuntimeMaxEntries` | `20` | Unit runtimes kept warm for inspection, execution, and rendering. When all are busy, further operations fail with `COLLABORATION_POOL_CAPACITY_EXCEEDED`. `0` starts a new process for every operation |
| `unitContentRuntimeIdleTtlMs` | `300000` | Idle time after which a warm Unit runtime exits |
| `screenshotOperationTimeoutMs` | `120000` | Overall timeout for one browser screenshot operation |
| `printPdfOperationTimeoutMs` | `120000` | Overall timeout for one browser PDF print operation |
| `screenshotMaxPages` | `30` | Maximum Doc or Slide pages rendered by one screenshot call |
| `screenshotMaxPixels` | `16777216` | Maximum pixel count for each screenshot image |
| `browserExecutablePath` | auto-detected | Browser executable for screenshots, PDF printing, and Slide checks; takes precedence over `UNIVER_RENDER_BROWSER` |
| `resourceCacheRoot` | `$DSH_HOME/cache/dsh-univer-office/resources` | Persistent downloaded-SVG cache; falls back to `~/.dsh` when `DSH_HOME` is unset |
| `resourceDownloadTimeoutMs` | `15000` | Timeout for one SVG resource download |
| `resourceOperationTimeoutMs` | `120000` | Overall timeout for one resource-library tool operation |
| `tools` | `true` | Enable agent editing capabilities |
| `skills` | `true` | Enable bundled task guidance |
| `telemetry` | `true` | Send anonymous product telemetry |
```

</details>

**依据 4 · 作者声明**：[README.md:221-223](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/README.md#L221-L223)

作者描述 telemetry 内容和关闭方法。

```text
## Telemetry

Sends anonymous usage stats after the plugin activates (never file contents or paths). The published package declares no `postinstall` script. Disable telemetry with `DO_NOT_TRACK=1` or `telemetry: false`.
```

**依据 5 · 源码核查**：[package.json:48-63](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/package.json#L48-L63)

bundle 与 Web 客户端声明。

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-chat",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-session",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-settings-plugins"
      ]
    }
```

</details>

#### 缺口

- 未实测迁移、导入导出保真、许可费用或资源消耗。
  **影响**：当前结论仅限固定源码与作者说明，不证明实际交付效果。
  **进一步探讨**：备份原文件，用兼容版本和可信样例验证升级、导出及第三方应用打开。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 贡献如何归因，哪项新假设值得对照？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

插件的增量是将 DSH 会话工具、Univer Gateway/Viewer 和草稿审阅连成一条工作流；它依赖 Univer 的编辑与协作实现，不证明所有 Office 文件都能无损往返。可测试假设：在审批卡加入导出格式的结构差异和抽样渲染，能比仅看原生草稿更早发现交付损失。对同一批文档、相同审阅人比较漏检、额外时间和误报；若没有减少重要损失或成本过高则否定。这是尚未验证的提议，不等于已有比较功能保证 Office 导出保真。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:34-46](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/src/host/index.ts#L34-L46)

组件挂载。

<details>
<summary>查看原文（13行）</summary>

```text
export const name = 'dsh-univer-office'

/** Compose the Univer Provider and its Web/Tools Consumers. */
export function apply(ctx: Context, config: UniverConfig = {}): void {
  const resolved = resolveConfig(config)
  // Fire-and-forget: bounded by an internal timeout and never throws, so it
  // can neither delay activation nor leave work for unload to settle.
  void runHostTelemetry({ telemetryEnabled: resolved.telemetry })
  ctx.plugin(settings)
  ctx.plugin(provider, resolved)
  ctx.plugin(webServer)
  if (resolved.tools) ctx.plugin(tools, resolved)
  if (resolved.skills) ctx.plugin(skills)
```

</details>

**依据 2 · 源码核查**：[src/host/tools/definitions/export.ts:7-45](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/src/host/tools/definitions/export.ts#L7-L45)

导出入口与参数。

<details>
<summary>查看原文（39行）</summary>

```text
/** Create the `univer_export` tool definition. */
export function exportTool(ctx: Context, timeoutMs: number) {
  return defineTool({
    name: 'univer_export',
    description: 'Export a .univer document or unit to a user-facing file format.',
    timeoutMs,
    parameters: {
      file: {
        type: 'string',
        required: true,
        description: 'Workspace-relative or absolute .univer path.'
      },
      output: {
        type: 'string',
        required: true,
        description: 'Workspace-relative or absolute output file path.'
      },
      unitId: {
        type: 'string',
        required: true,
        description: 'Explicit Unit id from univer_status.'
      },
      worktreeId: { type: 'string', description: 'Optional worktree scope; omit to export trunk.' }
    },
    output: operationOutput,
    async execute(args, exec) {
      const [target, output] = await Promise.all([
        existingToolFile(exec, args.file),
        newToolPath(exec, args.output)
      ])
      return ctx.univer.exportUnitContent(
        {
          workspace: target.workspace,
          file: target.path,
          outputWorkspace: output.workspace,
          output: output.path,
          unitId: unitId(args.unitId),
          ...(args.worktreeId === undefined ? {} : { worktreeId: worktreeId(args.worktreeId) })
        },
```

</details>

**依据 3 · 作者声明**：[README.md:75-78](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/README.md#L75-L78)

作者描述格式转换和草稿语义比较。

```text
- **Compose several content types** — one `.univer` file can contain Sheets, Docs, Slides, Bases, and Boards. Formulas and embedded content can reference other content in the same file.
- **Work with Office files** — import `.xlsx`, `.csv`, `.tsv`, `.docx`, and `.pptx`, then export the edited content in the matching format.
- **Review agent changes safely** — every write starts in an isolated draft. Watch changes live, then approve or discard them instead of letting the agent overwrite the current version.
- **Compare worktree changes semantically** — switch a draft or submitted worktree from View to Compare to inspect Sheet, Doc, Slide, Base, or Board changes side by side against a pinned trunk version or another active worktree.
```

**依据 4 · 作者声明**：[README.md:180-190](https://github.com/dream-num/dsh-univer-office/blob/c59332186fbd0051596b6ef5d73b8322204ad1d5/README.md#L180-L190)

作者明确导出及内容限制。

<details>
<summary>查看原文（11行）</summary>

```text
- **Import, export, and print** — the current version can import Office files, export supported content, and print from the Univer Ribbon. Draft and review previews do not allow import or export; Board provides print only.
- **Version history for all five Unit types** — current Sheet, Doc, Slide, Base, and Board views show time-grouped history. Read-only views can inspect versions, while editable views can restore one explicitly.

## Requirements and current limits

- DeepSeek Harness and Node.js `>=22.19.0`.
- The file-tree preview needs no extra plugin: it registers a tab type on DSH's right sidebar and claims `dsh-resource://file/**` addresses ending in `.univer`. While `dsh-better-sidebar` (`^0.19.0`) is installed it takes over file addresses at the same priority with a broader pattern, so the preview is registered as one of its file viewers instead — both shapes are covered, and only one ever applies.
- Older `.univer` files are automatically upgraded to format v3 when opened. A backup is saved beside the original; migration and validation run on a temporary copy, which replaces the original only after success. Failed upgrades leave the original unchanged. Opening the same unchanged file again reuses that backup instead of writing another copy.
- Screenshots, PDF printing, Slide layout checks, and SVG text measurement need a local Chromium-family browser. Chrome/Chromium and Microsoft Edge are detected automatically; set the `browserExecutablePath` option or the `UNIVER_RENDER_BROWSER` environment variable to point at a specific executable (for example Edge on Windows).
- Slide master pages, layout pages, and speaker notes are outside the current editing scope.
- Board mind maps, tables, ink, advanced editing, and file export are not yet supported.
```

</details>

#### 缺口

- 缺少跨 Office 应用的固定数据集和测量。
  **影响**：当前结论仅限固定源码与作者说明，不证明实际交付效果。
  **进一步探讨**：准备涵盖公式、字体、图表和页面的对照文件，记录失败与人工审阅成本。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
