# dsh-univer-office

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[b7dea7c](https://github.com/dream-num/dsh-univer-office/tree/b7dea7cb03e4bfeeba2b1a6723e30eaa6b264ba2)

<!-- BEGIN META -->
[![GitHub ★ 706](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=706&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dream-num/dsh-univer-office) [![npm 30d 61,768](https://img.shields.io/static/v1?label=npm+30d&message=61%2C768&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-univer-office) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-univer-office)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中创建、编辑和审阅电子表格、文档与演示文稿，并导出受支持的办公文件。

> **亮点**：[Q01](#research-q01) 把文件内的隔离工作副本和审阅状态带入 Agent 的办公工作流。审阅者仍需验证最终交付文件。

> **主要限制**：[Q02](#research-q02) 模型侧返回宿主 ask，Gateway 合并后还有删除和资产发布。宿主审批与失败后的主线状态都需要独立核实。

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
  - [Q01 · 何种任务从隔离草稿受益？](#detail-section-11)
  - [Q02 · 宿主审批与实际写入如何连接？](#detail-section-12)
  - [Q03 · 怎样采用并核对输出？](#detail-section-13)
  - [Q04 · 能否在交付前识别实际写入状态和转换损失？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：对需要复核公式、样式和数据变化的周期性工作簿，先审阅 Agent 草稿，再生成供收件人打开的文件。

在 Office 另存副本、人工比对变化并在收件方软件重新打开验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工作副本 | 在文件内形成待审变更 | 按文件和 worktreeId 寻址 |
| 审阅动作 | 请求合并或放弃草稿 | 模型调用由宿主处理 ask |
| Unit 导出 | 生成外部可用文件 | 核实目标范围与收件方软件效果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 和 Node ≥22.19 | 必需 | 加载宿主插件 | 无法按声明环境启用 |
| 目标 Office 应用 | 格式交付验收时必需 | 重开并核对结果 | 暂缓向收件方交付 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份原表并开隔离工作区 | 原件可恢复 |
| 审阅 | Agent 编辑工作副本，用户对比并审批 | 只接受预期变化 |
| 交付 | 用户核对实际状态并重开导出文件 | 公式与目标输出吻合 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 插件及本地进程资源 | 建立隔离环境与备份 | 安装耗时未知 |
| 持续 | 模型和转换资源 | 检查变更及导出保真 | 净工作量未知 |
| 失败恢复 | 保留原件和结果文件 | 读取主线及资产状态 | 耗时依故障范围而异 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 草稿审阅 | 显式工作副本和宿主审批入口 | 审批实际执行与净省时 |
| 格式交付 | 显式 Unit 和输出路径 | 复杂文档在目标应用的保真 |

> **思考**：[Q02](#research-q02) 模型侧返回宿主 ask，Gateway 合并后还有删除和资产发布。宿主审批与失败后的主线状态都需要独立核实。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把文件内的隔离工作副本和审阅状态带入 Agent 的办公工作流。审阅者仍需验证最终交付文件。

[Q02](#research-q02) 工作副本、主线和用户操作有明确入口；合并、删除与资产发布的顺序为失败后定向读回提供线索。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 模型侧返回宿主 ask，Gateway 合并后还有删除和资产发布。宿主审批与失败后的主线状态都需要独立核实。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用合成小表验证草稿、批准和 Excel 重开，保留原件。若主线或导出结果出现无法解释的变化，切回普通文件副本和人工比较。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查固定源码的工具接线、工作副本动作、审批入口与导出参数。宿主实际审批和收件方保真尚待验证。

- 已检查：作者 README、包清单、源码路径 src/host/tools/plugin.ts、src/host/tools/definitions/worktree.ts、src/gateway-app/collab-service.ts、src/host/tools/definitions/export.ts、README.zh-CN.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读工作副本和 Office 导出路径。未逐一审查所有类型、SDK、宿主批准服务和格式转换。
- 下一步：用带小图和公式的合成表比较审批拒绝、正常合并、转换后重开与故障读回。

**分析版本**

- **仓库**：[dream-num/dsh-univer-office](https://github.com/dream-num/dsh-univer-office)
- **版本号**：0.4.0（[固定提交 b7dea7c](https://github.com/dream-num/dsh-univer-office/tree/b7dea7cb03e4bfeeba2b1a6723e30eaa6b264ba2)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 可用源修订、文件哈希与收件方复核结果绑定导出交付，试验它能否区分版本变化和转换损失。

用带小图和公式的合成表比较审批拒绝、正常合并、转换后重开与故障读回。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 37 | 4035 | — | — | 45585 |
| .mjs | source | 10 | 1144 | 967 | 114 | — |
| .ts | source | 399 | 40612 | 36006 | 1689 | — |
| .tsx | source | 74 | 10558 | 9675 | 300 | — |
| .ts | test | 45 | 9883 | 9018 | 346 | — |
| .tsx | test | 4 | 521 | 481 | 3 | — |
| .md | example | 2 | 62 | — | — | 553 |
| .tsx | example | 1 | 174 | 171 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=16&color=737b86&logo=github)](https://github.com/dream-num/dsh-univer-office/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=17&color=737b86&logo=github)](https://github.com/dream-num/dsh-univer-office/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/dream-num/dsh-univer-office/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：办公文件制作者能否在 DSH 中审阅 Agent 的修改，再向收件人交付可打开且结果正确的工作簿？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何种任务从隔离草稿受益？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

反复整理周报数据、需要同事复核公式和行列变化的 DSH 用户，通常在原表副本上编辑并用单独窗口对比。插件把文件内的隔离工作副本标识、审阅状态与最终格式交付放在一条流程中。合格任务应同时保留原表、明确批准的变化和能在收件方软件打开并重新计算的交付物。多维表格与 Board 不应套用 Excel 交付条件。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:70-78](https://github.com/dream-num/dsh-univer-office/blob/b7dea7cb03e4bfeeba2b1a6723e30eaa6b264ba2/README.zh-CN.md#L70-L78)

作者列出表格操作、Office 格式和草稿比较。

```text
- **分析和制作表格**：读取或创建 Excel 数据，清洗字段，编写公式，设置格式、数据验证和条件格式，创建表格、图表、透视表、筛选器、迷你图与图片，最后导出为 `.xlsx`、`.csv` 或 `.tsv`。
- **撰写和排版文档**：创建段落、富文本、列表、任务、表格、图片、图表、页眉页脚、分页与页面布局。
- **创建和修改演示文稿**：从大纲生成整套幻灯片，重设计指定页面，编辑文字、形状、图片、表格、图表与转场，并检查越界、溢出和文本重叠。
- **搭建多维表格**：创建表、字段、记录和视图，使用公式字段、筛选、排序、分组及 Sheet 数据引用。
- **绘制可编辑画布**：创建形状、文本、连接线、图片、原生图表和流程图，并检查连接关系与布局。
- **组合多种内容**：一个 `.univer` 文件可以同时包含 Sheet、Doc、Slide、多维表格（Base）和 Board；公式或嵌入内容可以引用同一文件中的其他内容。
- **处理 Office 文件**：导入 `.xlsx`、`.csv`、`.tsv`、`.docx`、`.pptx`，修改后按对应格式导出。
- **安全审阅 Agent 修改**：所有写入先进入隔离草稿。你可以实时预览差异，再选择确认或放弃，不会让 Agent 直接覆盖当前版本。
- **按语义比较 worktree 修改**：把草稿或已提交 worktree 从“查看”切换到“比较”，即可将 Sheet、Doc、Slide、Base 或 Board 与固定的主线版本或另一个活跃 worktree 并排审阅。
```

**依据 2 · 源码核查**：[src/host/tools/definitions/worktree.ts:14-44](https://github.com/dream-num/dsh-univer-office/blob/b7dea7cb03e4bfeeba2b1a6723e30eaa6b264ba2/src/host/tools/definitions/worktree.ts#L14-L44)

工具区分操作与目标文件并能建立有标识的工作副本。

<details>
<summary>查看原文（31行）</summary>

```text
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
```

</details>

#### 缺口

- 未取得实际周报复核耗时与返工。
  **影响**：不能量化省下的协调步骤。
  **进一步探讨**：在同一小型周报任务比较手工副本与工作副本的复核时间和错改数。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主审批与实际写入如何连接？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

工具注册把 worktree 和导出放进 ctx.univer 服务。模型调用 merge 或 discard 时，工具预执行监听返回 ask，实际批准取决于宿主如何执行该决策。工具执行收取目标文件和 worktreeId，再调用服务。Gateway 先合并并捕获合并异常，然后单独执行主线删除及资产发布。源码顺序说明成功响应以前存在多步修改，错误后应重新读取主线、草稿及资产状态；不能仅从外围错误推定没有写入。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/tools/plugin.ts:23-39](https://github.com/dream-num/dsh-univer-office/blob/b7dea7cb03e4bfeeba2b1a6723e30eaa6b264ba2/src/host/tools/plugin.ts#L23-L39)

模型工具实际登记，分别有读写和内容操作超时。

<details>
<summary>查看原文（17行）</summary>

```text
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
  ctx.tools.register(withUniverErrorContent(exportTool(ctx, unitContentTimeoutMs)))
  ctx.tools.register(withUniverErrorContent(lintTool(ctx, unitContentTimeoutMs)))
  ctx.tools.register(withUniverErrorContent(printPdfTool(ctx, printPdfTimeoutMs)))
```

</details>

**依据 2 · 源码核查**：[src/host/tools/plugin.ts:48-58](https://github.com/dream-num/dsh-univer-office/blob/b7dea7cb03e4bfeeba2b1a6723e30eaa6b264ba2/src/host/tools/plugin.ts#L48-L58)

模型调用的 merge、discard 分支返回宿主 ask。

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

**依据 3 · 源码核查**：[src/host/tools/definitions/worktree.ts:47-63](https://github.com/dream-num/dsh-univer-office/blob/b7dea7cb03e4bfeeba2b1a6723e30eaa6b264ba2/src/host/tools/definitions/worktree.ts#L47-L63)

转换显式工作副本 ID 并传递取消信号。

<details>
<summary>查看原文（17行）</summary>

```text
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

**依据 4 · 源码核查**：[src/gateway-app/collab-service.ts:646-679](https://github.com/dream-num/dsh-univer-office/blob/b7dea7cb03e4bfeeba2b1a6723e30eaa6b264ba2/src/gateway-app/collab-service.ts#L646-L679)

合并异常返回 conflict，后续仍有删除及资产发布。

<details>
<summary>查看原文（34行）</summary>

```text
        try {
          await this.runtime.worktreeService.mergeWorktree(
            { worktreeID: worktreeId },
            callOptions(worktree.agentId || 'local', {
              [UNIVERFILE_UNIT_METADATA_KEY]: {
                unitNames: mergedUnitNames
              }
            })
          )
        } catch (error) {
          return {
            ok: false,
            conflict: true,
            failedUnit: errorUnitId(error) ?? ''
          }
        }

        const trunkDeletes = deleted.filter((unit) => unit.deleteFromTrunk)
        if (trunkDeletes.length > 0) {
          await this.runtime.trunkService.deleteUnits(
            {
              unitIDs: trunkDeletes.map((unit) => unit.unitId),
              hardDelete: false
            },
            callOptions(worktree.agentId || 'local')
          )
        }
        const deletedUnitIds = new Set(deleted.map((unit) => unit.unitId))
        this.runtime.assetStore.publishWorktreeAssets(
          worktreeId,
          worktreeUnitIds.filter((unitId) => !deletedUnitIds.has(unitId))
        )
        const mergedRevs = Object.fromEntries(
          this.runtime.trunkAdapter.listUnits().map((unit) => [unit.unitId, unit.headRev])
```

</details>

#### 缺口

- 宿主对 ask 的同版本执行及多步骤异常状态未验证。
  **影响**：不宜在生产原件上以提示文字作为审批或事务保证。
  **进一步探讨**：对一次性文档测试拒绝、冲突和合并后阶段失败，读回主线、资产与草稿。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样采用并核对输出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

可用隔离 DSH 工作区和简单合成工作簿试用，先检查当前 Node 与宿主、备份文件、创建草稿，再明确选定 Unit 与导出目标。导出工具可指定工作副本，省略时导出主线；作者所说的审阅 Viewer 预览不开放导出与此工具是两条入口。试用需在目标 Office 重开并核对公式、结果和格式。超时、主线出现预期外变动或输出校验失败时保留原表并改回普通副本流程。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:172-190](https://github.com/dream-num/dsh-univer-office/blob/b7dea7cb03e4bfeeba2b1a6723e30eaa6b264ba2/README.zh-CN.md#L172-L190)

作者描述审阅预览、Office 导出限制和 Node 版本。

<details>
<summary>查看原文（19行）</summary>

```text
- **文件树按需预览**：在 DSH 文件树中点击 `.univer` 文件即可在右侧栏打开预览，与 `.docx`、`.xlsx`、`.pptx` 的内置预览一致。整个过程不需要 Agent 执行任何操作，因此在关闭自动实时预览后依然可用。版本切换与 worktree 审阅统一在 Viewer 内完成。打开文件时若未指定目标，且主线没有文档，则默认进入第一个活跃 worktree。该入口直接注册在 DSH 自带的右侧栏上；若安装了 `dsh-better-sidebar`，由于该插件会接管文件地址，预览会改为注册成它的文件预览器。
- **实时 Univer 窗口**：修改默认自动显示在可拖动、缩放、折叠和全屏的窗口中；可在插件设置中关闭自动打开（侧边栏“插件”页面中的 **dsh-univer-office** 详情页；0.1.6-alpha.2 之前的 DSH 版本在“设置 → 插件 → 插件配置”），不影响会话审阅卡片和上面的文件树预览。
- **会话审阅卡片**：每个修改过的 `.univer` 文件都有独立的完整预览卡片；已删除的临时文件不会留下无效卡片。可在插件设置中关闭「在会话中显示审阅卡片」让会话更紧凑——文件树预览与实时窗口由各自的开关独立控制。
- **固定版本的 worktree 比较**：在草稿或已提交 worktree 中选择“比较”，可与主线或另一个活跃 worktree 对照。打开比较时会固定两侧版本，可逐项定位变更；任一侧继续更新后会显示刷新入口。
- **响应式审阅 Header**：空间充足时“查看 / 对比”居中，窗口变窄后控件紧凑排列并按顺序换行；标题显示当前文档名，超长名称截断，合并状态提示保持可见。
- **历史审阅**：草稿、已提交修改、确认和放弃结果都会保留在会话中。只有最近一次操作文件的回合卡片默认展开，更早的卡片默认折叠，展开时才加载预览。
- **多会话隔离**：每个 DSH 会话只展示属于自己的窗口、卡片和审阅状态。
- **中英文界面**：插件外壳和已打开的 Viewer 跟随 DSH 的界面语言。
- **导入、导出与打印**：当前版本可通过 Univer Ribbon 导入 Office 文件、导出受支持的内容并打印。草稿和审阅预览不开放导入导出；Board 仅提供打印。
- **五类 Unit 版本历史**：当前版本的 Sheet、Doc、Slide、Base 和 Board 均可查看按时间聚合的历史。只读视图可以查看版本，可编辑视图可以显式恢复。

## 要求与限制

- DeepSeek Harness，以及 Node.js `>=22.19.0`。
- 文件树预览不需要额外插件：它在 DSH 自带右侧栏注册一个 tab 类型，认领以 `.univer` 结尾的 `dsh-resource://file/**` 地址。安装 `dsh-better-sidebar`（`^0.19.0`）期间，该插件会以同档位、更宽的模式接管文件地址，因此预览改为注册成它的文件预览器——两种宿主形态都覆盖，且任一时刻只有一条生效。
- 打开旧版 `.univer` 文件时会自动升级到 v3 格式：先在原文件旁保存备份，在临时副本中完成迁移和验证，成功后才替换原文件；升级失败时原文件保持不变。再次打开同一份未变化的文件时复用这份备份，不会再复制一份。
- 截图、PDF 打印、Slide 布局检查和 SVG 文字度量需要本机 Chromium 系浏览器。Chrome/Chromium 与 Microsoft Edge 会被自动探测；也可以通过 `browserExecutablePath` 配置项或 `UNIVER_RENDER_BROWSER` 环境变量指定浏览器可执行文件路径（例如 Windows 上的 Edge）。
- Slide 的母版、版式页和演讲者备注不在当前编辑范围内。
- Board 的思维导图、表格、墨迹和高级编辑，以及 Board 文件导出尚未开放。
```

</details>

**依据 2 · 源码核查**：[src/host/tools/definitions/export.ts:23-47](https://github.com/dream-num/dsh-univer-office/blob/b7dea7cb03e4bfeeba2b1a6723e30eaa6b264ba2/src/host/tools/definitions/export.ts#L23-L47)

要求 Unit、可选工作副本、输入输出路径及取消信号。

<details>
<summary>查看原文（25行）</summary>

```text
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
        exec.signal
      )
```

</details>

**依据 3 · 源码核查**：[src/gateway-app/collab-service.ts:655-679](https://github.com/dream-num/dsh-univer-office/blob/b7dea7cb03e4bfeeba2b1a6723e30eaa6b264ba2/src/gateway-app/collab-service.ts#L655-L679)

合并与后续处理存在可分别失败的边界。

<details>
<summary>查看原文（25行）</summary>

```text
        } catch (error) {
          return {
            ok: false,
            conflict: true,
            failedUnit: errorUnitId(error) ?? ''
          }
        }

        const trunkDeletes = deleted.filter((unit) => unit.deleteFromTrunk)
        if (trunkDeletes.length > 0) {
          await this.runtime.trunkService.deleteUnits(
            {
              unitIDs: trunkDeletes.map((unit) => unit.unitId),
              hardDelete: false
            },
            callOptions(worktree.agentId || 'local')
          )
        }
        const deletedUnitIds = new Set(deleted.map((unit) => unit.unitId))
        this.runtime.assetStore.publishWorktreeAssets(
          worktreeId,
          worktreeUnitIds.filter((unitId) => !deletedUnitIds.has(unitId))
        )
        const mergedRevs = Object.fromEntries(
          this.runtime.trunkAdapter.listUnits().map((unit) => [unit.unitId, unit.headRev])
```

</details>

#### 缺口

- 复杂公式、嵌入图像和收件方软件往返保真未知。
  **影响**：交付质量及复核代价无法预测。
  **进一步探讨**：先用边界明确的公式、小图和样式做对照文件，逐项重算核验。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 能否在交付前识别实际写入状态和转换损失？

**研究主题**：新假设与验证

#### 完整回答

可试验将导出的 Unit 和源修订、输出哈希、收件方软件的复核结果绑定在交付记录里。现在的导出参数能定位工作副本与 Unit，复核者还需区分草稿或主线后来变化以及转换本身改变结果。对同一简单工作簿施加源修改、模拟输出重试，再比较人工清单与绑定记录能否定位三类变化。若两者识别率相同且绑定记录明显增加审阅时间，假设缺少收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/tools/definitions/export.ts:23-47](https://github.com/dream-num/dsh-univer-office/blob/b7dea7cb03e4bfeeba2b1a6723e30eaa6b264ba2/src/host/tools/definitions/export.ts#L23-L47)

显式 Unit 和工作副本可作为版本绑定的入口。

<details>
<summary>查看原文（25行）</summary>

```text
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
        exec.signal
      )
```

</details>

**依据 2 · 源码核查**：[src/gateway-app/collab-service.ts:674-684](https://github.com/dream-num/dsh-univer-office/blob/b7dea7cb03e4bfeeba2b1a6723e30eaa6b264ba2/src/gateway-app/collab-service.ts#L674-L684)

Gateway 汇总已观察到的主线修订作为合并结果。

<details>
<summary>查看原文（11行）</summary>

```text
        this.runtime.assetStore.publishWorktreeAssets(
          worktreeId,
          worktreeUnitIds.filter((unitId) => !deletedUnitIds.has(unitId))
        )
        const mergedRevs = Object.fromEntries(
          this.runtime.trunkAdapter.listUnits().map((unit) => [unit.unitId, unit.headRev])
        )
        return {
          ok: true,
          mergedRevs,
          broadcasts: [],
```

</details>

#### 缺口

- 未实现交付记录及 Office 核对回传。
  **影响**：改善归因和返工是否成立未知。
  **进一步探讨**：在一份合成工作簿上进行配对故障实验。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
