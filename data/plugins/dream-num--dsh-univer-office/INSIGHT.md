# DSH × Univer Office

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[8f85ce4](https://github.com/dream-num/dsh-univer-office/tree/8f85ce4074fdbe51416b6c337468bb916a302c2a)

<!-- BEGIN META -->
[![GitHub ★ 612](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=612&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dream-num/dsh-univer-office) [![npm 30d 44,919](https://img.shields.io/static/v1?label=npm+30d&message=44%2C919&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-univer-office) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-univer-office)
<!-- END META -->

> **功能**：在 DSH 中创建、编辑和审阅多种办公内容，并以隔离草稿管理变更与导出

> **亮点**：[Q01](#research-q01) 将Univer内容运行时接入DSH审阅流程；[Q02](#research-q02) 草稿状态、merge审批与ready revision材料约束提供可审核变更增量。办公计算/渲染归Univer，审批执行归宿主。

> **主要限制**：[Q03](#research-q03) 草稿并非租户隔离，认证浏览器后的/uf请求不重复workspace范围校验；结构和截图不代表公式语义及Office保真。

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
  - [Q01 · 相比脚本直接改 Office 文件，多了什么审阅责任？](#detail-section-11)
  - [Q02 · 写入、ready、merge和人审核实际如何接线？](#detail-section-12)
  - [Q03 · 草稿隔离、文件权限与最终导出各有什么边界？](#detail-section-13)
  - [Q04 · 哪类单人任务值得有限试用，成本与退出是什么？](#detail-section-14)
  - [Q05 · 能否把语义检查与导出结果绑定为审核收据？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：可信单人环境下，希望在覆盖正式办公结果前预览、确认或丢弃AI变更的DSH用户。

脚本写独立Office副本后人工开文件，或原Office/WPS直接修改；比较同一格式和关键业务断言。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 隔离草稿 | 审核前保留主干 | 非多用户权限隔离 |
| 审阅合并 | 宿主ask与ready版本 | 不保证业务语义正确 |
| Office交换 | 原生格式交付 | 复杂格式保真需同任务验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配DSH与Node22.19+ | 必需 | 工具审批和本地组件 | 不按包可安装认定运行通过 |
| Chromium/Chrome/Edge | 截图/PDF/布局检查需 | 可视验证 | 不能声称截图验收已完成 |
| 可写文件与草稿存储 | 编辑必需 | 版本与合并材料 | 原件副本保全，失败停止合并 |
| 可信个人Host与文件权限 | 采用前提 | 避免误当租户隔离 | 不互信多用户不在建议范围 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份简单Office原件 | 原应用能打开基线 |
| 编辑 | Agent创建draft并显式写unit | 不直接改正式主干 |
| 复核 | 用户查公式文本和截图后ready | 陈旧版本不可混用旧验收 |
| 交付 | 用户审批merge并核导出 | 原应用符合要求，否则回副本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地组件、浏览器与模型，金额未知 | 宿主兼容和原件保全 | 未安装执行 |
| 持续使用 | 模型、渲染、草稿存储 | 公式/文案/版式审核 | 没有同任务节时数据 |
| 失败恢复 | 重跑渲染或导出 | 对照旧稿、版本和陈旧材料 | 多类型merge未全验 |
| 退出 | 保留原文件及导出 | 停止合并回Office/WPS | 未运行真实卸载 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 变更隔离 | draft写、ready merge与ask | 全内容合并/崩溃恢复 |
| 文件权限 | 初始文档校验workspace | 后续/uf非租户文件隔离 |
| 验证 | 结构/截图工具接口 | 公式语义和格式往返 |

> **思考**：[Q03](#research-q03) 草稿并非租户隔离，认证浏览器后的/uf请求不重复workspace范围校验；结构和截图不代表公式语义及Office保真。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将Univer内容运行时接入DSH审阅流程；[Q02](#research-q02) 草稿状态、merge审批与ready revision材料约束提供可审核变更增量。办公计算/渲染归Univer，审批执行归宿主。

[Q02](#research-q02)审批钩子、显式状态和ready revision检查有具体约束；[Q03](#research-q03)需将draft隔离和访问控制拆开。未全审算法不补写“合并安全已验证”。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 草稿并非租户隔离，认证浏览器后的/uf请求不重复workspace范围校验；结构和截图不代表公式语义及Office保真。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 单人简单文件副本有限试用，审核后才合并并在原Office程序核对；复杂格式和不互信多用户部署不包含在建议内。

最小验证一个表格两次变更，第一次通过后修改关键公式或文字，再导出，比较当前流程与收据流程发现陈旧验证和错误导出需要的时间。必须先核现有版本历史与语义比较是否已有等效绑定；若现有机制足够、人工断言成本过高或收据不能覆盖真正业务语义，就停止独立扩展。该设想尚未实现和运行验证。 见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

草稿入口、状态与审批接线有源码支持；全合并算法、真实宿主与Office往返未验收。版本审核收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/host/tools/plugin.ts、src/host/tools/definitions/worktree.ts、src/host/tools/definitions/execute.ts、src/host/provider/gateway-univer-service.ts、src/host/provider/worktree-operations.ts、src/gateway-app/univerfile-sqlite/database-adapters/worktree-database-adapter.ts、src/host/webServer/session-scope.ts、src/host/webServer/viewer-proxy.ts、src/host/webServer/routes/worktree-action.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定8f85ce4074fdbe51416b6c337468bb916a302c2a，检查工具到provider工作树写与状态、merge材料SQLite片段和Viewer权限代理；不涵盖全部Univer能力、转换器与运行依赖。
- 下一步：仅固定源码核查，未安装、运行目标测试或导入导出Office文件；未用截图验收产物。

**分析版本**

- **仓库**：[dream-num/dsh-univer-office](https://github.com/dream-num/dsh-univer-office)
- **版本号**：0.3.7（[固定提交 8f85ce4](https://github.com/dream-num/dsh-univer-office/tree/8f85ce4074fdbe51416b6c337468bb916a302c2a)）
- **版本日期**：2026-10-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可以提出未验证的审核收据，把readyDraftHeadRevision、人工确认的关键公式/文本断言、截图或lint结果和导出文件摘要绑定到同一版本；任何后续改动使旧结果显式过期。相对只有ready或局部渲染检查，增量是让用户知道“审核的是哪版、导出的又是哪版”，而非再增加Office功能数量。

最小验证一个表格两次变更，第一次通过后修改关键公式或文字，再导出，比较当前流程与收据流程发现陈旧验证和错误导出需要的时间。必须先核现有版本历史与语义比较是否已有等效绑定；若现有机制足够、人工断言成本过高或收据不能覆盖真正业务语义，就停止独立扩展。该设想尚未实现和运行验证。 见 [Q05](#research-q05)。

仅固定源码核查，未安装、运行目标测试或导入导出Office文件；未用截图验收产物。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 31 | 3703 | — | — | 40534 |
| .mjs | source | 9 | 1081 | 924 | 95 | — |
| .ts | source | 262 | 35735 | 32254 | 1411 | — |
| .tsx | source | 35 | 8882 | 8134 | 289 | — |
| .ts | test | 12 | 2491 | 2363 | 7 | — |
| .tsx | test | 4 | 521 | 481 | 3 | — |
| .mjs | test | 11 | 5983 | 5612 | 241 | — |
| .tsx | example | 1 | 174 | 171 | 2 | — |
| .md | example | 1 | 27 | — | — | 259 |

</details>

**活跃度**

[![Issue 未关闭 18](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=18&color=737b86&logo=github)](https://github.com/dream-num/dsh-univer-office/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=14&color=737b86&logo=github)](https://github.com/dream-num/dsh-univer-office/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/dream-num/dsh-univer-office/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Agent办公写入怎样隔离草稿并审核，文件权限与导出边界在哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比脚本直接改 Office 文件，多了什么审阅责任？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要AI修改表格、文档或演示而又想在覆盖正式结果前审阅的个人用户。简单基线是让脚本生成新Office文件再人工打开，或者直接在Excel/WPS中修改。插件将Univer多内容运行时接入DSH，在独立草稿、预览和合并之间组织流程；模型写入不是立刻覆盖主干，用户可以检查或丢弃。

办公结构、公式、渲染与导入导出主要依赖Univer；DSH提供会话、模型、工具与审批。插件贡献在将这些能力连到可审核的Agent办公流程，不是自己发明电子表格或Office格式。工作树可解释对重要文件的风险控制增量，但不证明最终文档内容正确或与原Office完全保真。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:15-28](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/README.md#L15-L28)

作者任务与预览/合并/导出流程。

<details>
<summary>查看原文（14行）</summary>

```text
`dsh-univer-office` is the Univer office plugin for DeepSeek Harness (DSH). Tell the agent what you need and it can create or edit spreadsheets, documents, presentations, multidimensional tables, and canvases, or work with existing Excel, Word, and PowerPoint files. Every change is verified and stays in the conversation for you to preview, approve, or discard.

After installation, describe the result you want in natural language. The agent handles creation, editing, and verification while you follow the work live and review the result in the conversation. Deliver spreadsheets as Excel (`.xlsx`), documents as Word (`.docx`), and presentations as PowerPoint (`.pptx`) files when needed.

## See it in action

[![Play the DSH × Univer Office demo](docs/assets/readme/nike-presentation-demo.png)](https://www.youtube.com/watch?v=k-2zW_CMiew)


The agent created this spreadsheet from a natural-language request, then added conditional formatting and a chart in the same conversation. The result can be previewed, revised, merged into the current version, or discarded in place.

![Reviewing a spreadsheet with conditional formatting and a chart in DSH](docs/assets/readme/chart-and-formatting.png)

> **Deliver a standard Excel file:** after review, ask the agent to export the spreadsheet as `.xlsx` so it can be opened and edited in Excel, WPS Office, and other compatible office applications.
```

</details>

**依据 2 · 源码核查**：[README.md:70-78](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/README.md#L70-L78)

能力与隔离草稿、语义比较定位。

```text
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

**依据 3 · 源码核查**：[src/host/tools/plugin.ts:24-47](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/src/host/tools/plugin.ts#L24-L47)

模型工具实际注册到Univer服务。

<details>
<summary>查看原文（24行）</summary>

```text
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
  ctx.tools.register(withUniverErrorContent(exportTool(ctx, unitContentTimeoutMs)))
  ctx.tools.register(withUniverErrorContent(lintTool(ctx, unitContentTimeoutMs)))
  ctx.tools.register(withUniverErrorContent(printPdfTool(ctx, printPdfTimeoutMs)))
  ctx.tools.register(withUniverErrorContent(compileSvgTool(ctx, unitContentTimeoutMs)))
  // A screenshot result must durably reference image bytes; advertise the tool only while
  // the deployment has an attachment store, and keep the execution-time re-check defensive.
  ctx.inject(['attachments'], (imageCtx) => {
    imageCtx.tools.register(withUniverErrorContent(screenshotTool(imageCtx, screenshotTimeoutMs)))
  })
  ctx.tools.register(withUniverErrorContent(apiTool(ctx)))
  ctx.tools.register(withUniverErrorContent(resourcesTool(ctx, config.resourceOperationTimeoutMs)))
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 写入、ready、merge和人审核实际如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

univer_execute要求显式file/worktreeId/unitId及唯一code来源，provider先校验工作区文件，要求worktree状态draft后交unitContent执行。worktree操作走gateway；merge要求当前ready。tools/pre-execute对univer_worktree的merge/discard返回ask，由宿主审批，而不只是在工具描述中写“请确认”。浏览器审核路由则按Session工作区解析文件后调用service工作树动作。

SQLite合并材料保存实际在事务中检查merging状态和readyDraftHeadRevision，旧版本返回stale-merge，已有材料回already-saved。这比只保存“完成”字符串更有版本约束。不过本轮只跟到主要适配和一段数据库约束，没有全面独立审计所有内容类型的合并算法、权限与崩溃恢复；不能把这些局部检查宣称完整多Agent合并正确性。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/tools/definitions/execute.ts:32-48](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/src/host/tools/definitions/execute.ts#L32-L48)

显式目标与执行服务调用。

<details>
<summary>查看原文（17行）</summary>

```text
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
      )
```

</details>

**依据 2 · 源码核查**：[src/host/provider/gateway-univer-service.ts:269-286](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/src/host/provider/gateway-univer-service.ts#L269-L286)

写入前draft状态检查。

<details>
<summary>查看原文（18行）</summary>

```text
  /** Execute Facade code against one explicit Unit in a draft worktree. */
  async executeUnitContent(
    request: ExecuteUnitContentRequest,
    signal?: AbortSignal
  ): Promise<UniverOperationResult> {
    await assertAuthorizedPath(request.workspace, request.file, true)
    const gateway = await this.requireGateway()
    await this.requireWorktreeStatus(gateway, request.file, request.worktreeId, 'draft')
    const result = await this.unitContent.execute(
      gateway,
      request.file,
      request.code,
      request.worktreeId,
      request.unitId,
      signal
    )
    this.invalidate(request.file, request.worktreeId)
    return result
```

</details>

**依据 3 · 源码核查**：[src/host/provider/gateway-univer-service.ts:544-570](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/src/host/provider/gateway-univer-service.ts#L544-L570)

merge要求ready并调用gateway。

<details>
<summary>查看原文（27行）</summary>

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
  }

  private async requireWorktreeStatus(
    gateway: string,
    file: string,
    worktreeId: string,
    expected: 'draft' | 'ready'
  ): Promise<void> {
    const listing = await new GatewayFileApi(
      new GatewayClient(gateway, this.config.gatewayRequestTimeoutMs)
    ).listWorktrees(file)
    const worktree = mapWorktrees(listing).find((entry) => entry.worktreeId === worktreeId)
    if (worktree === undefined)
      throw new UniverError(`Worktree ${worktreeId} was not found.`, 'WORKTREE_NOT_FOUND')
    if (worktree.status !== expected) {
      throw new UniverError(
        `Worktree ${worktreeId} is ${worktree.status}; expected ${expected}.`,
        'WORKTREE_STATUS_INVALID'
```

</details>

**依据 4 · 源码核查**：[src/host/tools/plugin.ts:48-58](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/src/host/tools/plugin.ts#L48-L58)

merge/discard真实返回ask。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[src/gateway-app/univerfile-sqlite/database-adapters/worktree-database-adapter.ts:503-525](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/src/gateway-app/univerfile-sqlite/database-adapters/worktree-database-adapter.ts#L503-L525)

事务检查ready revision与stale/重试状态。

<details>
<summary>查看原文（23行）</summary>

```text
  async saveUnitMergeArtifact(
    _context: DatabaseContext,
    input: SaveWorktreeUnitMergeArtifactInput
  ): Promise<SaveWorktreeUnitMergeArtifactResult> {
    this._assertOpen()
    return this._transaction(() => {
      const worktree = this._getWorktreeRow(input.worktreeID)
      const row = this._getUnitRow(input.worktreeID, input.unitID)
      if (!worktree || !row) return { status: 'not-found' }
      const unit = rowToUnitRecord(row)
      if (
        worktree.status !== 'merging' ||
        unit.source !== 'worktree' ||
        unit.readyDraftHeadRevision !== input.artifact.readyDraftHeadRevision ||
        isTerminal(unit)
      ) {
        return { status: 'stale-merge' }
      }
      const existing = this._getUnitMergeArtifact(input.worktreeID, input.unitID)
      if (existing) {
        return { status: 'already-saved', artifact: existing }
      }
      validateMergeArtifact(unit, input.artifact)
```

</details>

#### 缺口

- 全部Unit合并算法、同版审批和崩溃后恢复未验收。
  **影响**：不能把局部CAS和审批钩子等同全链绝不冲突或丢失。
  **进一步探讨**：在文件副本上用两个草稿修改相同和不同单元，确认ready版本、审批、冲突与恢复后的实际内容。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 草稿隔离、文件权限与最终导出各有什么边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

草稿是变更版本隔离，不是多用户文件权限隔离。Viewer文档打开和插件API会校验指定Session的工作区；但后续/uf HTTP与WS在浏览器认证通过后按file key代理，不重复Session workspace校验。README也明确已认证浏览器可访问Host进程可达的.univer文件。因此它适合可信个人环境的文档审阅，不能因工作树存在就承诺多人共享Host的文件隔离。

截图、PDF与Slide布局检查需要本地Chromium。结构lint和截图能检查格式或溢出，不证明财务公式业务正确、引用数据新鲜或Office导出保真。Board不支持文件导出，Slide母版/布局页/演讲者备注不在编辑范围；本轮未执行导入导出，不能把README能力表变成所有复杂文件都通过。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/webServer/session-scope.ts:5-20](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/src/host/webServer/session-scope.ts#L5-L20)

文档打开按Session cwd解析文件。

<details>
<summary>查看原文（16行）</summary>

```text
/** Resolve a browser file only when it belongs to the addressed live session. */
export async function resolveAuthorizedFile(
  value: unknown,
  sessionId: unknown,
  sessions: SessionStore
) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new UniverError('file is required', 'INVALID_REQUEST')
  }
  if (typeof sessionId !== 'string' || sessionId.length === 0) {
    throw new UniverError('sessionId is required', 'INVALID_REQUEST')
  }
  const cwd = sessions.get(SessionId(sessionId))?.header.cwd
  if (cwd === undefined)
    throw new UniverError('session is unavailable or has no workspace', 'SESSION_SCOPE_UNAVAILABLE')
  return resolveExistingUniverPath(cwd, value)
```

</details>

**依据 2 · 源码核查**：[src/host/webServer/viewer-proxy.ts:78-101](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/src/host/webServer/viewer-proxy.ts#L78-L101)

文档scope后其他文件API代理边界。

<details>
<summary>查看原文（24行）</summary>

```text
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

**依据 3 · 源码核查**：[src/host/webServer/viewer-proxy.ts:104-136](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/src/host/webServer/viewer-proxy.ts#L104-L136)

WS认证与file-key代理不重复workspace检查。

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

**依据 4 · 源码核查**：[README.md:183-190](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/README.md#L183-L190)

浏览器与编辑/导出边界。

```text
## Requirements and current limits

- DeepSeek Harness and Node.js `>=22.19.0`.
- The file-tree preview needs no extra plugin: it registers a tab type on DSH's right sidebar and claims `dsh-resource://file/**` addresses ending in `.univer`. While `dsh-better-sidebar` (`^0.19.0`) is installed it takes over file addresses at the same priority with a broader pattern, so the preview is registered as one of its file viewers instead — both shapes are covered, and only one ever applies.
- Older `.univer` files are automatically upgraded to format v3 when opened. A backup is saved beside the original; migration and validation run on a temporary copy, which replaces the original only after success. Failed upgrades leave the original unchanged. Opening the same unchanged file again reuses that backup instead of writing another copy. File optimization upgrades its output copy without changing the source.
- Screenshots, PDF printing, Slide layout checks, and SVG text measurement need a local Chromium-family browser. Chrome/Chromium and Microsoft Edge are detected automatically; set the `browserExecutablePath` option or the `UNIVER_RENDER_BROWSER` environment variable to point at a specific executable (for example Edge on Windows).
- Slide master pages, layout pages, and speaker notes are outside the current editing scope.
- Board mind maps, tables, ink, advanced editing, and file export are not yet supported.
```

**依据 5 · 源码核查**：[README.md:214-220](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/README.md#L214-L220)

作者明确浏览器认证后文件范围和可关闭遥测。

```text
| `telemetry` | `true` | Send anonymous product telemetry |

The Viewer, its HTTP API, and its WebSocket collaboration traffic are served by the plugin on the DSH WebServer origin itself (`/univer-viewer/...` and `/uf/...`), so remote deployments work through whatever entry already fronts DSH — no extra reverse-proxy configuration. Every browser request passes DSH browser authentication via the `connection` service. Viewer document opens and `/univer-api` requests also validate the named session workspace; subsequent `/uf` API and WebSocket requests do not require a plugin session cookie or repeat that workspace check. Authenticated browsers can address any `.univer` file accessible to the Host process, including in remote deployments. In DSH Desktop, the Viewer obtains the current Host loopback address through an authenticated runtime endpoint for WebSocket connections; HTTP requests continue through the desktop shell. The Gateway itself stays on loopback and is never exposed. (The former `viewerBaseUrl` option was removed by this change and is ignored.)

## Telemetry

Sends anonymous usage stats after the plugin activates (never file contents or paths). The published package declares no `postinstall` script. Disable telemetry with `DO_NOT_TRACK=1` or `telemetry: false`.
```

#### 缺口

- 真实Office复杂文件的往返保真、公式语义和部署权限策略未验证。
  **影响**：不能推荐多人不互信共享Host或关键账务直接交付。
  **进一步探讨**：只在本人文件副本上检查单一格式往返，复核公式/版式及可达文件范围。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪类单人任务值得有限试用，成本与退出是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

建议已有DSH、愿意在文件副本上预览结果的个人用户，用一个简单表格或文档先试草稿编辑、拒绝/合并和最终导出。验收单位是一份在原Office应用可打开且关键公式/文本/版式符合要求的交付，不是草稿ready或截图能渲染。保留原文件，在审核前核对结构与可视结果；若版本冲突、公式不符或导出丢格式，停止合并并回原Office/WPS编辑副本。

首次要匹配DSH、Node和浏览器，后端包含gateway、viewer、worker等本地组件；持续需模型调用、渲染资源、文件和草稿存储及人工审核。默认匿名遥测可关闭，是否启用由部署者决定。现金与时间均没有同任务测量，不能把一条自然语言生成变成免费或省时结论。多用户共享Host和高级复杂Office格式不纳入这条试用建议。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:183-190](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/README.md#L183-L190)

运行与格式功能前提。

```text
## Requirements and current limits

- DeepSeek Harness and Node.js `>=22.19.0`.
- The file-tree preview needs no extra plugin: it registers a tab type on DSH's right sidebar and claims `dsh-resource://file/**` addresses ending in `.univer`. While `dsh-better-sidebar` (`^0.19.0`) is installed it takes over file addresses at the same priority with a broader pattern, so the preview is registered as one of its file viewers instead — both shapes are covered, and only one ever applies.
- Older `.univer` files are automatically upgraded to format v3 when opened. A backup is saved beside the original; migration and validation run on a temporary copy, which replaces the original only after success. Failed upgrades leave the original unchanged. Opening the same unchanged file again reuses that backup instead of writing another copy. File optimization upgrades its output copy without changing the source.
- Screenshots, PDF printing, Slide layout checks, and SVG text measurement need a local Chromium-family browser. Chrome/Chromium and Microsoft Edge are detected automatically; set the `browserExecutablePath` option or the `UNIVER_RENDER_BROWSER` environment variable to point at a specific executable (for example Edge on Windows).
- Slide master pages, layout pages, and speaker notes are outside the current editing scope.
- Board mind maps, tables, ink, advanced editing, and file export are not yet supported.
```

**依据 2 · 源码核查**：[README.md:214-230](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/README.md#L214-L230)

遥测开关和运行组件范围。

<details>
<summary>查看原文（17行）</summary>

````text
| `telemetry` | `true` | Send anonymous product telemetry |

The Viewer, its HTTP API, and its WebSocket collaboration traffic are served by the plugin on the DSH WebServer origin itself (`/univer-viewer/...` and `/uf/...`), so remote deployments work through whatever entry already fronts DSH — no extra reverse-proxy configuration. Every browser request passes DSH browser authentication via the `connection` service. Viewer document opens and `/univer-api` requests also validate the named session workspace; subsequent `/uf` API and WebSocket requests do not require a plugin session cookie or repeat that workspace check. Authenticated browsers can address any `.univer` file accessible to the Host process, including in remote deployments. In DSH Desktop, the Viewer obtains the current Host loopback address through an authenticated runtime endpoint for WebSocket connections; HTTP requests continue through the desktop shell. The Gateway itself stays on loopback and is never exposed. (The former `viewerBaseUrl` option was removed by this change and is ignored.)

## Telemetry

Sends anonymous usage stats after the plugin activates (never file contents or paths). The published package declares no `postinstall` script. Disable telemetry with `DO_NOT_TRACK=1` or `telemetry: false`.

## Uninstall

```sh
dsh plugin --profile web remove dsh-univer-office
```

## Development

This project is a standard [DSH bundle](https://github.com/deepseek-ai/deepseek-harness/blob/main/docs/user/develop/basic/publish.md). Its Host composes the Univer Service Provider, Tools Consumer, webServer Consumer, and Skill Provider. The bundle includes its Gateway, Viewer, headless Unit Content Worker, and Slide render machine. See the [architecture document](docs/architecture.md) for dependency directions and runtime boundaries.
````

</details>

**依据 3 · 源码核查**：[src/host/tools/plugin.ts:48-58](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/src/host/tools/plugin.ts#L48-L58)

合并/丢弃的宿主审批接口。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

#### 缺口

- 同版安装、关键公式与Office往返成功率和人工审核成本未知。
  **影响**：有限试用不支持长期自动化交付保证。
  **进一步探讨**：用既有简单文件保存基线，在原应用复核导出并记录全部修改、渲染和返修时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否把语义检查与导出结果绑定为审核收据？

**研究主题**：新假设与验证

#### 完整回答

可以提出未验证的审核收据，把readyDraftHeadRevision、人工确认的关键公式/文本断言、截图或lint结果和导出文件摘要绑定到同一版本；任何后续改动使旧结果显式过期。相对只有ready或局部渲染检查，增量是让用户知道“审核的是哪版、导出的又是哪版”，而非再增加Office功能数量。

最小验证一个表格两次变更，第一次通过后修改关键公式或文字，再导出，比较当前流程与收据流程发现陈旧验证和错误导出需要的时间。必须先核现有版本历史与语义比较是否已有等效绑定；若现有机制足够、人工断言成本过高或收据不能覆盖真正业务语义，就停止独立扩展。该设想尚未实现和运行验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/gateway-app/univerfile-sqlite/database-adapters/worktree-database-adapter.ts:503-525](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/src/gateway-app/univerfile-sqlite/database-adapters/worktree-database-adapter.ts#L503-L525)

ready revision与合并材料已有版本约束可作参照。

<details>
<summary>查看原文（23行）</summary>

```text
  async saveUnitMergeArtifact(
    _context: DatabaseContext,
    input: SaveWorktreeUnitMergeArtifactInput
  ): Promise<SaveWorktreeUnitMergeArtifactResult> {
    this._assertOpen()
    return this._transaction(() => {
      const worktree = this._getWorktreeRow(input.worktreeID)
      const row = this._getUnitRow(input.worktreeID, input.unitID)
      if (!worktree || !row) return { status: 'not-found' }
      const unit = rowToUnitRecord(row)
      if (
        worktree.status !== 'merging' ||
        unit.source !== 'worktree' ||
        unit.readyDraftHeadRevision !== input.artifact.readyDraftHeadRevision ||
        isTerminal(unit)
      ) {
        return { status: 'stale-merge' }
      }
      const existing = this._getUnitMergeArtifact(input.worktreeID, input.unitID)
      if (existing) {
        return { status: 'already-saved', artifact: existing }
      }
      validateMergeArtifact(unit, input.artifact)
```

</details>

**依据 2 · 源码核查**：[README.md:96-104](https://github.com/dream-num/dsh-univer-office/blob/8f85ce4074fdbe51416b6c337468bb916a302c2a/README.md#L96-L104)

现有结构/可视检查与类型差异，不能推断语义正确。

```text
| Content | Create and edit | Verify and review | Import | Export |
| --- | --- | --- | --- | --- |
| Sheet | Cells, formulas, styles, tables, charts, pivots, filters, validation, images, and more | Structured range inspection, recalculation, screenshots, PDF printing, live preview | `.xlsx` `.csv` `.tsv` | `.xlsx` `.csv` `.tsv` |
| Doc | Paragraphs, rich text, lists, tasks, tables, images, charts, headers, footers, pagination | Document readback, page screenshots, PDF printing, live preview | `.docx` | `.docx` |
| Slide | Pages, text, shapes, images, tables, charts, SVG layouts, transitions | Structure inspection, layout lint, screenshots, PDF printing, live preview | `.pptx` | `.pptx` |
| Base | Tables, fields, records, views, formulas, filters, sorting, grouping | Structured data checks, workbench screenshot, live preview | — | `.xlsx` `.csv` `.tsv` |
| Board | Shapes, text, connectors, images, native charts, routing | Element analysis, screenshots, PDF printing, live preview | — | — |

Every content type supports isolated draft editing, side-by-side semantic comparison, review, revision, approval, and discarding. Base and Board support structural verification; Board file export is not yet supported.
```

#### 缺口

- 现有历史、lint与export是否已绑定同版本以及真实陈旧验收频率。
  **影响**：不能宣称新增独立机会或重复现有设计。
  **进一步探讨**：先对一个实际格式追踪版本到导出，再用真实误差样例比较。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
