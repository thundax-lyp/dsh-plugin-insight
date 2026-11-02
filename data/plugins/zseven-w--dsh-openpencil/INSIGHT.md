# DSH OpenPencil

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[6be9b76](https://github.com/ZSeven-W/dsh-openpencil/tree/6be9b76c7ddeedcb4e40dd0444846b71775819b0)

<!-- BEGIN META -->
[![GitHub ★ 204](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=204&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZSeven-W/dsh-openpencil) [![npm 30d 2,827](https://img.shields.io/static/v1?label=npm+30d&message=2%2C827&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-openpencil) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-openpencil)
<!-- END META -->

> **功能**：把 OpenPencil 的 .op 文档预览、画布检查、编辑与受控草稿生成流程接入 DSH 对话。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将可编辑画布、对话预览和owner隔离草稿串成可核查交付链，版本与预览绑定避免把旧截图当当前结果。尚不能证明设计任务质量或工时改善。

> **主要限制**：[Q02](#research-q02) exact代表渲染/文档一致，不代表设计符合需求；模型自审收到有界结构digest而非该通道的PNG像素，再finish可接受发布。结构gate和受控修正不能等同用户视觉验收。

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
  - [Q01 · 设计交付对什么用户有增量，继承上游什么？](#detail-section-11)
  - [Q02 · 工具调用、草稿和质量判定如何真实接线？](#detail-section-12)
  - [Q03 · 编辑器进程、版本、成本和退出能否支持试用？](#detail-section-13)
  - [Q04 · 如何让视觉审查对应用户能接受的交付？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在DSH对话里生成并继续人工修改设计稿的团队，可以交付.op文档及对应预览。

[Q01](#research-q01) 比较图片交付后手工重建与直接独立编辑器；画布/原生导出继承OpenPencil，插件增量是宿主交接与受控发布。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| render | 已有.op快照与多帧预览 | exact与低保真后备分开 |
| 创建/编辑工具 | 操作真实可编辑画布 | 依赖匹配runtime和工作区权限 |
| 私有草稿pipeline | 分批生成、检查、发布或abort | owner/版本校验保护提交，不代用户设计验收 |
| 结构视觉自审 | digest/checklist及一次有界修正 | PNG浏览器呈现不等模型获得像素观察 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=24.11.0和匹配DSH接口 | 必需 | Host/Client工具 | 源码声明不等实测加载 |
| 对应平台OpenPencil runtime | 编辑/生成必需 | 权威画布与导出 | 需核版本/平台，不把npm安装当运行成功 |
| exact导出器 | exact渲染必需 | 对应文档PNG | 缺失可用标注为低保真的Jian后备 |
| 工作区写权限与空目标 | 新稿发布必需 | createIfAbsent提交 | 只读/目标存在/身份变化拒绝 |
| 模型与人工设计验收 | 生成及质量结果必需 | 设计决策/复核 | 结构digest不能替代最终用户判据 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主/插件/runtime与副本目录 | 本轮未安装/启动 |
| 生成 | Agent在owner私有draft中按有界批次操作 | 失败不当已发布稿 |
| 检查 | native/DSH质量、预览SHA与版本核对 | 漂移需重finalize，后备渲染明确标签 |
| 自审/发布 | digest/checklist后接受或一次修正 | createIfAbsent前重核目标/权限，用户仍看实际稿 |
| 退出 | abort未发布draft，保留副本 | 编辑与恢复另核；不把新稿保证泛化所有修改 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 平台runtime/宿主和副本空间 | 版本、路径与编辑器接线 | 费用/耗时未知 |
| 持续使用 | 模型生成修正、native进程、PNG/文档 | 设计需求、视觉和可编辑性复核 | 未测完整任务成本 |
| 失败恢复 | 草稿/预览副本与重启资源 | 区分未发布/已发布/现稿编辑 | 全平台崩溃恢复未核 |
| 退出 | 保留需要的.op和预览 | abort/停用、核runtime残留 | 不自动清未核数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可编辑交付 | 上游画布与宿主工具接线 | 真实加载/保存/设计合格率 |
| 发布一致 | owner、串行锁、版本/SHA/预览与目标重核 | 全故障/平台运行表现 |
| 视觉质量 | 结构gate、有界digest/checklist | 像素审美、需求满足与人工修改负担 |

> **思考**：[Q02](#research-q02) exact代表渲染/文档一致，不代表设计符合需求；模型自审收到有界结构digest而非该通道的PNG像素，再finish可接受发布。结构gate和受控修正不能等同用户视觉验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将可编辑画布、对话预览和owner隔离草稿串成可核查交付链，版本与预览绑定避免把旧截图当当前结果。尚不能证明设计任务质量或工时改善。

[Q02](#research-q02) owner会话绑定、串行发布锁、版本/SHA和预览完整性及目标重核值得借鉴；abort加入提交边界减少竞态。质量摘要有界且纯结构，迁移时应保留用户结果验收而非增加自证调用。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) exact代表渲染/文档一致，不代表设计符合需求；模型自审收到有界结构digest而非该通道的PNG像素，再finish可接受发布。结构gate和受控修正不能等同用户视觉验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用固定版本和独立副本试用，最后亲自看画布、保存稿与需求逐项对应。遇版本/预览不一致或反复修正不合格便停止发布，回独立编辑器；不要把exact或quality passed当用户验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查工具注册、render后备、owner草稿串行化与发布一致性；未启动编辑器/模型/渲染或验收宿主。已有保护、质量推断和未来实验分开。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/design-draft-controller.ts、src/design-draft-tools.ts、src/design-visual-review.ts、src/index.ts、src/tool.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定root plugin，重点注册/render与pipeline finish/controller；未审计全部native编辑器、签名路由安全、平台二进制、样式生成或所有恢复/卸载路径，不运行目标代码。
- 下一步：按[Q04](#research-q04)固定brief和预算，用植入视觉/内容缺陷的副本比较当前digest自审与绑定需求审阅，计误发布/人工修改和全部成本；无改善或独立性不成立则否定。本轮未执行。

**分析版本**

- **仓库**：[ZSeven-W/dsh-openpencil](https://github.com/ZSeven-W/dsh-openpencil)
- **版本号**：0.1.0-rc.14（[固定提交 6be9b76](https://github.com/ZSeven-W/dsh-openpencil/tree/6be9b76c7ddeedcb4e40dd0444846b71775819b0)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 可把brief中的可观察验收项绑定最终图像/节点，经独立审阅与当前digest自审做同预算对照，计误发布和人工修改；这项收益未验证。

按[Q04](#research-q04)固定brief和预算，用植入视觉/内容缺陷的副本比较当前digest自审与绑定需求审阅，计误发布/人工修改和全部成本；无改善或独立性不成立则否定。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 23 | 5599 | — | — | 71032 |
| .mjs | source | 22 | 2993 | 2652 | 100 | — |
| .ts | source | 33 | 16814 | 14756 | 1044 | — |
| .tsx | source | 6 | 3794 | 3375 | 197 | — |
| .mjs | test | 18 | 14091 | 13052 | 260 | — |

</details>

**活跃度**

[![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/ZSeven-W/dsh-openpencil/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/ZSeven-W/dsh-openpencil/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：设计工具怎样连接真实编辑器与可编辑交付，质量/恢复边界能否支持采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 设计交付对什么用户有增量，继承上游什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本插件面向希望在DSH对话中生成、检查和继续人工编辑设计稿的开发者与设计协作者。交付物是可编辑.op文档与对应预览，不只是生成图片；合格结果还应符合需求、内容、可读性和后续修改能力。简单参照是Agent输出图片/代码后再开独立编辑器手工重建，或直接在OpenPencil中编辑。

插件的增量在于宿主工具、对话预览、侧边编辑器和受控草稿发布的衔接。画布引擎、原生导出与编辑能力来自OpenPencil，不能全部算宿主适配的新算法。作者声明某DSH Desktop组合已验证，这是固定README的作者报告，不是本轮安装验收。可编辑文件消除部分重建步骤的机制是成立的，但并未证明所有任务质量、工时或转化效果改善。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-13](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/README.md#L8-L13)

作者定位与宿主验证声明，明确非本次执行。

```text
  <strong>The DeepSeek Harness plugin for OpenPencil — preview, inspect, and edit real <code>.op</code> documents inside a conversation.</strong><br />
  <sub>Exact Multi-Frame Previews &bull; Interactive Canvas &bull; Managed Editor &bull; Agent-Native Design Tools</sub>
</p>

<p align="center">
  <sub>npm: <a href="https://www.npmjs.com/package/@zseven-w/dsh-openpencil"><code>@zseven-w/dsh-openpencil</code></a> · Current plugin release: <code>0.1.0-rc.14</code> · Editor panel verified on DSH Desktop <code>0.2.1-rc.3</code></sub>
```

**依据 2 · 作者声明**：[README.md:35-68](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/README.md#L35-L68)

上游OpenPencil、预览、只读画布和编辑器分工。

<details>
<summary>查看原文（34行）</summary>

```text
## Why DSH OpenPencil

DSH OpenPencil connects [DeepSeek Harness](https://github.com/deepseek-ai/DSH) with [OpenPencil](https://github.com/ZSeven-W/openpencil) so an Agent drives a real, editable, interactive design canvas instead of returning a generated image.

<table>
<tr>
<td width="50%">

### 🖼️ Exact Multi-Frame Previews

The installed OpenPencil headless exporter renders design-faithful previews: the first top-level frame as a large replay-safe PNG, plus a horizontally scrollable thumbnail rail, click-to-select, and previous/next navigation for multi-frame documents.

</td>
<td width="50%">

### 🗺️ Interactive Canvas

"Open interactive canvas" lazily mounts the read-only OpenPencil Web SDK with pan, zoom, and fit — inspect any page, nested node, or inactive page without leaving the conversation.

</td>
</tr>
<tr>
<td width="50%">

### ✏️ Managed Editor

With `editable: true`, the edit action opens the managed OpenPencil editor — selection, layers, properties, drawing tools, undo/redo, and explicit save semantics — in a resizable right-hand workbench with a full-screen option.

</td>
<td width="50%">

### 🤖 Agent-Native Design Tools

Five direct-canvas tools plus six `openpencil_pipeline_*` tools let the Agent create, inspect, refine, publish, modify, and read a real canvas through managed OpenPencil runtimes.
```

</details>

**依据 3 · 源码核查**：[src/index.ts:202-234](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/src/index.ts#L202-L234)

宿主实际注册渲染/选区/新建/创建/编辑和草稿工具。

<details>
<summary>查看原文（33行）</summary>

```text
  // Tool registration: global (every agent sees it). The tool's
  // presentationMeta consults `controller.routeAvailable`, so a profile
  // without the webserver still gets a plain-JSON result — no dangling URL.
  disposers.push(ctx.effect(
    () => hostCtx.tools.register(createDesignRenderTool(controller, viewerAssets, editorHost)),
    `dsh-openpencil: ${OPENPENCIL_RENDER_TOOL_NAME} tool`,
  ))
  disposers.push(ctx.effect(
    () => hostCtx.tools.register(createDesignSelectionTool(editorHost)),
    `dsh-openpencil: ${OPENPENCIL_SELECTION_TOOL_NAME} tool`,
  ))
  disposers.push(ctx.effect(
    () => hostCtx.tools.register(createDesignNewTool(editorHost, {
      fs: hostCtx.fs,
      sandboxPolicy: hostCtx.sandboxPolicy,
      render: controller,
      observe: (target, observation, exec) => eventCtx.emit('fs/observed', target, observation, exec),
    })),
    `dsh-openpencil: ${OPENPENCIL_NEW_TOOL_NAME} tool`,
  ))
  disposers.push(ctx.effect(
    () => hostCtx.tools.register(createDesignCreateTool(editorHost)),
    `dsh-openpencil: ${OPENPENCIL_CREATE_TOOL_NAME} tool`,
  ))
  disposers.push(ctx.effect(
    () => hostCtx.tools.register(createDesignEditTool(editorHost)),
    `dsh-openpencil: ${OPENPENCIL_EDIT_TOOL_NAME} tool`,
  ))
  for (const tool of designDraftTools.createTools()) {
    disposers.push(ctx.effect(
      () => hostCtx.tools.register(tool),
      `dsh-openpencil: ${tool.name} tool`,
    ))
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具调用、草稿和质量判定如何真实接线？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

render工具先解析会话工作区相对路径并创建不可变文档快照，再用OpenPencil原生导出；缺少原生二进制才进入标注为runtime-preview的Jian后备，其他导出错误不无差别吞掉。结果返回JSON，签名预览/编辑能力通过presentationMeta给浏览器，模型结果与浏览器凭证分开。不能把低保真后备当exact，也不能把PNG校验当设计可用。

完整pipeline在私有草稿中工作。controller按ownerSessionId拒绝其他会话操作，串行排队；finish重新读取编辑器权威文档，用version和SHA检查finalization/截图一致。在同一串行发布段再次核质量与当前目标身份，检查Workspace Write，准备预览/快照后通过fs.writeText createIfAbsent发布，避免覆盖已存在文件；abort在发布边界会加入当前操作而不是竞态删除。

clean gate之后可先返回needs_visual_review，浏览器有最终PNG，模型收到结构digest和checklist。digest明确纯结构且有行数/长度预算，模型并未通过该通道看到像素；再finish即可接受发布，或执行一次有界修正。因此这是结构与一致性检查加受限自审，不能宣称真实视觉审美或用户验收已经完成。现有尺寸/布局/引用完整性保护是实际支持，质疑应落在这些判据与用户任务之间，而非假称没有质量gate。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool.ts:46-58](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/src/tool.ts#L46-L58)

浏览器presentationMeta与模型结果分离。

<details>
<summary>查看原文（13行）</summary>

```text
/** Pure, replayable presentation projection — the browser-only envelope. */
function makePresentationMeta(
  controller: RenderAccessController,
  viewerAssets?: ViewerAssetController,
  editorHost?: EditorHostController,
) {
  return (_args: unknown, value: JsonValue): JsonValue => {
    const result = value as unknown as RenderResult
    const editor = result.editable === true
      ? editorHost?.grantFor(result.sourcePath, result.document?.sha256)
      : undefined
    return projectRenderGrant(value, controller, viewerAssets?.viewerGrant, editor)
  }
```

</details>

**依据 2 · 源码核查**：[src/tool.ts:157-209](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/src/tool.ts#L157-L209)

不可变输入、exact路径与标注后备。

<details>
<summary>查看原文（53行）</summary>

```text
    async execute(args: DesignRenderArgs, exec): Promise<RenderResult> {
      const input = await resolveInputFile(args.path, sessionWorkspace(exec))
      const document = await createDocumentSnapshot(input)
      const warnings: string[] = []
      let out: string
      let renderer: 'openpencil' | 'jian'
      let rendererBinary: string
      let fidelity: 'exact' | 'runtime-preview'
      let exactFrames: Awaited<ReturnType<typeof runOpenPencilRender>>['frames'] | undefined
      const openPencil = findOpenPencilBinary()
      if (openPencil !== undefined) {
        if (args.width !== undefined || args.height !== undefined) {
          throw new Error(`${OPENPENCIL_RENDER_TOOL_NAME}: width/height are not supported by the exact OpenPencil renderer; omit them and use scale`)
        }
        try {
          const exact = await runOpenPencilRender({
            binary: openPencil,
            input: document.path,
            scale: args.scale,
            signal: exec.signal,
          })
          out = exact.png
          exactFrames = exact.frames
          warnings.push(...exact.warnings)
          renderer = 'openpencil'
          rendererBinary = openPencil
          fidelity = 'exact'
        } catch (error) {
          if (!(error instanceof RendererBinaryMissingError)) throw error
          const fallback = await createRenderOutput()
          const jian = findJianBinary()
          await runJianRender({
            binary: jian, input: document.path, out: fallback,
            width: args.width, height: args.height, scale: args.scale, signal: exec.signal,
          })
          out = fallback
          renderer = 'jian'
          rendererBinary = jian
          fidelity = 'runtime-preview'
          warnings.push('OpenPencil exact renderer was unavailable; using lower-fidelity Jian runtime preview.')
        }
      } else {
        const fallback = await createRenderOutput()
        const jian = findJianBinary()
        await runJianRender({
          binary: jian, input: document.path, out: fallback,
          width: args.width, height: args.height, scale: args.scale, signal: exec.signal,
        })
        out = fallback
        renderer = 'jian'
        rendererBinary = jian
        fidelity = 'runtime-preview'
        warnings.push('OpenPencil exact renderer was not found; using lower-fidelity Jian runtime preview.')
```

</details>

**依据 3 · 源码核查**：[src/design-draft-controller.ts:621-690](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/src/design-draft-controller.ts#L621-L690)

owner草稿finish的权威版本/SHA/截图检查与串行发布。

<details>
<summary>查看原文（70行）</summary>

```text
  async finish<Published>(
    draftId: string,
    ownerSessionId: string,
    options: DesignDraftFinishOptions<Published>,
  ): Promise<DesignDraftFinishResult<Published>> {
    const session = this.#session(draftId, ownerSessionId)
    return this.#enqueue(session, async () => {
      const signal = signalFor(session, options.signal)
      signal.throwIfAborted()
      const document = await readManagedEditorDaemon(session.daemon, signal)
      signal.throwIfAborted()
      const authoritativeSha256 = documentSha256(document.documentJson)
      const hasExpectedVersion = options.expectedVersion !== undefined
      const hasExpectedSha256 = options.expectedDocumentSha256 !== undefined
      if (hasExpectedVersion !== hasExpectedSha256) {
        throw new Error('OpenPencil draft finish expectedVersion and expectedDocumentSha256 must be provided together')
      }
      if (hasExpectedVersion && (
        !Number.isSafeInteger(options.expectedVersion)
        || options.expectedVersion! < 0
        || !/^[a-f0-9]{64}$/u.test(options.expectedDocumentSha256!)
      )) throw new Error('OpenPencil draft finish checkpoint is invalid')
      if (hasExpectedVersion && (
        options.expectedVersion !== document.version
        || options.expectedDocumentSha256 !== authoritativeSha256
      )) {
        clearPublicationProof(session)
        throw new DesignDraftCheckpointDriftError(
          options.expectedVersion!,
          options.expectedDocumentSha256!,
          document.version,
          authoritativeSha256,
        )
      }
      if ((options.requireCurrentScreenshot ?? true) && (
        session.lastScreenshotVersion !== document.version
        || session.lastScreenshotDocumentSha256 !== authoritativeSha256
        || session.lastScreenshotFinalizedVersion !== document.version
        || session.lastScreenshotFinalizedDocumentSha256 !== authoritativeSha256
        || session.finalizedVersion !== document.version
        || session.finalizedDocumentSha256 !== authoritativeSha256
      )) {
        throw new DesignDraftPreviewRequiredError({
          currentVersion: document.version,
          ...(session.finalizedVersion === undefined ? {} : { finalizedVersion: session.finalizedVersion }),
          ...(session.lastScreenshotVersion === undefined ? {} : { screenshotVersion: session.lastScreenshotVersion }),
          ...(session.lastScreenshotDocumentSha256 === undefined
            ? {}
            : { screenshotDocumentSha256: session.lastScreenshotDocumentSha256 }),
          ...(session.lastScreenshotFinalizedVersion === undefined
            ? {}
            : { screenshotFinalizedVersion: session.lastScreenshotFinalizedVersion }),
          ...(session.lastScreenshotFinalizedDocumentSha256 === undefined
            ? {}
            : { screenshotFinalizedDocumentSha256: session.lastScreenshotFinalizedDocumentSha256 }),
        })
      }
      const snapshot = this.#snapshot(session, document.version, document.documentJson)
      // Publication deliberately stays under the same serialized draft lock.
      // A failed callback leaves the draft active and retryable.
      session.publishing = true
      let published: Published
      try {
        published = await options.publish(snapshot)
      } finally {
        session.publishing = false
      }
      session.closed = true
      this.#removeAuthority(session)
      await this.#cleanup(session)
```

</details>

**依据 4 · 源码核查**：[src/design-draft-controller.ts:980-1012](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/src/design-draft-controller.ts#L980-L1012)

owner边界、串行队列和发布中abort加入。

<details>
<summary>查看原文（33行）</summary>

```text
  #session(draftId: string, ownerSessionId: string): DesignDraftSession {
    if (!DRAFT_ID_PATTERN.test(draftId)) throw new Error('OpenPencil draft was not found')
    validOwner(ownerSessionId)
    this.#pruneExpired()
    const session = this.#drafts.get(draftId)
    if (session === undefined || session.closed) throw new Error('OpenPencil draft has ended')
    if (session.ownerSessionId !== ownerSessionId) throw new Error('OpenPencil draft belongs to a different DSH session')
    return session
  }

  #enqueue<Result>(session: DesignDraftSession, task: () => Promise<Result>): Promise<Result> {
    const previous = session.activeOperation ?? Promise.resolve()
    const result = previous.then(async () => {
      if (session.closed) throw new Error('OpenPencil draft ended before its operation started')
      return task()
    })
    const settled = result.then(() => {}, () => {})
    session.activeOperation = settled
    void settled.then(() => {
      if (session.activeOperation === settled) delete session.activeOperation
    })
    return result
  }

  async #retire(session: DesignDraftSession, joinOperation: boolean): Promise<void> {
    // Publication is the commit edge. Once its callback starts, abort/dispose
    // joins that serialized transaction instead of racing a createIfAbsent
    // write. A failed publication leaves the session active, then retirement
    // proceeds; a successful one has already cleaned the session itself.
    const publishingOperation = joinOperation && session.publishing ? session.activeOperation : undefined
    if (publishingOperation !== undefined) {
      await publishingOperation.catch(() => {})
      if (session.closed) return
```

</details>

**依据 5 · 源码核查**：[src/design-draft-tools.ts:2128-2168](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/src/design-draft-tools.ts#L2128-L2168)

needs_visual_review和接受/修正路径。

<details>
<summary>查看原文（41行）</summary>

```text
        if (!pending.skipVisualReview && !pending.visualReviewDone) {
          // Single see-then-fix round: the browser gets the exact post-final
          // PNG through the standard screenshot presentation channel, and the
          // model gets a deterministic layout digest of the same document
          // (the DeepSeek adapter rejects image blocks, so the digest is the
          // model-facing rendering). One bounded I/K/U correction batch is
          // authorized; calling finish again unchanged accepts and publishes.
          const reviewed = await drafts.snapshot(args.draftId, owner, { signal: exec.signal })
          if (
            reviewed.version !== checkpoint.version
            || documentSha256(reviewed.documentJson) !== checkpoint.documentSha256
          ) {
            clearFinalizationCheckpoint(pending)
            return {
              draftId: args.draftId,
              path: pending.processPath,
              published: false,
              stage: 'needs_refinalization',
              version: reviewed.version,
              diagnostics: [],
              canContinue: true,
              next: 'The live canvas changed while the visual review was being prepared. Call finish once; the stale checkpoint was discarded.',
            }
          }
          pending.visualReviewDone = true
          pending.visualReviewAuthorized = true
          return {
            draftId: args.draftId,
            path: pending.processPath,
            published: false,
            stage: 'needs_visual_review',
            version: checkpoint.version,
            finalization: publicFinalizationCheckpoint(checkpoint, reusedFinalization),
            ...(publicScreenshot(pending.latestRootScreenshot, checkpoint.version, checkpoint.documentSha256) === undefined
              ? {}
              : { screenshot: publicScreenshot(pending.latestRootScreenshot, checkpoint.version, checkpoint.documentSha256) as JsonValue }),
            digest: buildVisualReviewDigest(reviewed.documentJson),
            checklist: [...VISUAL_REVIEW_CHECKLIST],
            diagnostics: [],
            canContinue: true,
            next: 'Quality gates passed and the exact final preview was rendered. Review the digest (and preview) against every checklist item. If everything holds, call finish exactly once more with no batch in between to publish. Otherwise send exactly ONE bounded correction batch (I/K/U only, at most 16 calls and 6 KiB, never rebuilding Header or Hero), then call finish; the gates re-validate the corrected page.',
```

</details>

**依据 6 · 源码核查**：[src/design-draft-tools.ts:2176-2244](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/src/design-draft-tools.ts#L2176-L2244)

当前目标、权限、预览哈希及createIfAbsent发布。

<details>
<summary>查看原文（69行）</summary>

```text
          const finished = await drafts.finish(args.draftId, owner, {
            signal: exec.signal,
            expectedVersion: checkpoint.version,
            expectedDocumentSha256: checkpoint.documentSha256,
            publish: async (authoritative): Promise<PublishedDraft> => {
              // Recheck under the controller's serialized publication lock so
              // a concurrent editor mutation cannot bypass the preflight.
              const jsReport = inspectGeneratedDesignQualityReport(authoritative.documentJson)
              if (jsReport.diagnostics.length > 0) throw new DesignDraftJsQualityError(jsReport)
              const inspected = pending.latestRootScreenshot
              const authoritativeSha256 = documentSha256(authoritative.documentJson)
              if (
                inspected === undefined
                || inspected.version !== authoritative.version
                || inspected.documentSha256 !== authoritativeSha256
              ) {
                throw new Error(`${OPENPENCIL_PIPELINE_FINISH_TOOL_NAME}: current post-final preview artifact is unavailable`)
              }
              const policy = services.sandboxPolicy.resolve({ session: exec.agent?.session })
              if (services.fs.sandboxMode !== undefined && policy.mode === 'read-only') {
                throw new Error(`${OPENPENCIL_PIPELINE_FINISH_TOOL_NAME}: publishing requires Workspace Write access`)
              }
              const currentPathInfo = await services.fs.lstat(pending.requestedPath, { cwd: policy.workspaceRoot }, exec.signal)
              if (currentPathInfo !== undefined) throw new Error(`${OPENPENCIL_PIPELINE_FINISH_TOOL_NAME}: target now exists: ${pending.requestedPath}`)
              const currentTarget = await services.fs.resolve(pending.requestedPath, { cwd: policy.workspaceRoot, signal: exec.signal })
              const currentProcessPath = services.fs.processPath(currentTarget)
              if (currentProcessPath !== pending.processPath || String(currentTarget.targetKey) !== String(pending.target.targetKey)) {
                throw new Error(`${OPENPENCIL_PIPELINE_FINISH_TOOL_NAME}: target identity changed while the draft was open`)
              }
              const previewPath = await createRenderOutput()
              await copyFile(inspected.path, previewPath)
              let preview: RenderFrame
              try {
                const verified = await verifyRenderOutput(previewPath)
                if (verified.bytes !== inspected.bytes || verified.sha256 !== inspected.sha256) {
                  throw new Error(`${OPENPENCIL_PIPELINE_FINISH_TOOL_NAME}: post-final preview changed after its exact PNG integrity checkpoint`)
                }
                preview = {
                  path: previewPath,
                  filename: basename(previewPath),
                  mimeType: 'image/png',
                  bytes: verified.bytes,
                  width: verified.width,
                  height: verified.height,
                  sha256: verified.sha256,
                  index: 0,
                }
              } catch (error) {
                await rm(previewPath, { force: true }).catch(() => {})
                throw error
              }
              let document: DocumentSnapshot
              try {
                document = await (services.createDocumentSnapshot ?? createDocumentSnapshotFromText)(
                  authoritative.documentJson,
                )
              } catch (error) {
                await rm(previewPath, { force: true }).catch(() => {})
                throw error
              }
              let outcome
              try {
                outcome = await services.fs.writeText(
                  pending.target,
                  authoritative.documentJson,
                  { kind: 'createIfAbsent' },
                  exec.signal,
                  policy,
                )
```

</details>

**依据 7 · 源码核查**：[src/design-visual-review.ts:125-150](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/src/design-visual-review.ts#L125-L150)

digest纯结构、有界且会省略区域。

<details>
<summary>查看原文（26行）</summary>

```text
/**
 * Deterministic model-facing rendering of the finalized page: one bounded
 * line per top-level region plus card-rail summaries and a footer verdict.
 * Purely structural — derived from the exact document the screenshot shows.
 */
export function buildVisualReviewDigest(documentJson: string): string[] {
  let document: unknown
  try {
    document = JSON.parse(documentJson)
  } catch {
    return ['digest unavailable: the finalized document was not parseable JSON.']
  }
  if (!isObject(document)) return ['digest unavailable: the finalized document was not an object.']
  const roots = Array.isArray(document.children) ? document.children.filter(isObject) : []
  const root = roots[0]
  if (root === undefined) return ['digest unavailable: the document has no root frame.']
  const regions = nodeChildren(root).filter(region => !isHidden(region))
  const lines: string[] = [
    `page ${dimension(root.width)}x${dimension(root.height)} with ${regions.length} visible regions (top to bottom):`,
  ]
  for (const region of regions) {
    if (lines.length >= MAX_DIGEST_LINES - 2) {
      lines.push(`- … ${regions.length - (lines.length - 1)} more regions elided`)
      break
    }
    describeRegion(region, lines)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 编辑器进程、版本、成本和退出能否支持试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

建议已用DSH且需要可编辑画布的开发者，固定插件/宿主/对应平台runtime，在独立目录用副本稿试用。Node要求>=24.11.0，平台可选包固定同一插件版本；GUI、原生编辑器、导出器与浏览器组件是不同环节，装到npm不等全部已能运行。编辑需权限且必须由用户最后检查实际画布与保存文件。可选模型风格推荐默认不启用的作者描述不能推成整个生成流程无模型成本。

首次需要校对平台runtime、宿主接口与文件路径；持续使用包括模型生成/修正、原生进程、导出PNG与文档/预览空间，实际耗时与金额未知。私有草稿和createIfAbsent提供可控退出，不覆盖已存目标是具体保护，但现有文档编辑是不同路径，不能把新稿原子发布保证泛化所有编辑动作。未穷尽崩溃后编辑器恢复、所有平台打包及卸载残留。若预览与保存稿不一致、runtime版本不符、交付不满足需求或需要反复绕过gate，就停止生成/发布，保留副本并回到独立编辑器或原设计工作流。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:20-34](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/package.json#L20-L34)

Node和Host/Client导出声明。

<details>
<summary>查看原文（15行）</summary>

```text
  "engines": {
    "node": ">=24.11.0"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[package.json:131-142](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/package.json#L131-L142)

平台可选runtime包同版本。

<details>
<summary>查看原文（12行）</summary>

```text
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "optionalDependencies": {
    "@zseven-w/dsh-openpencil-darwin-arm64": "0.1.0-rc.14",
    "@zseven-w/dsh-openpencil-darwin-x64": "0.1.0-rc.14",
    "@zseven-w/dsh-openpencil-linux-arm64": "0.1.0-rc.14",
    "@zseven-w/dsh-openpencil-linux-x64": "0.1.0-rc.14",
    "@zseven-w/dsh-openpencil-win32-arm64": "0.1.0-rc.14",
    "@zseven-w/dsh-openpencil-win32-x64": "0.1.0-rc.14"
  },
```

</details>

**依据 3 · 作者声明**：[README.md:140-157](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/README.md#L140-L157)

作者区分可选风格推荐、原稿编辑与新稿pipeline。

<details>
<summary>查看原文（18行）</summary>

```text
> The OpenPencil plugin is public and requires no npm token. If the DSH prerelease itself requires registry authentication, keep that credential in a user-level or temporary npm config outside the checkout. This repository intentionally contains no registry credentials.

## Design Tools

Optional style selection uses `openpencil_style_plan` → `openpencil_style_confirm` → `openpencil_pipeline_begin` with the original brief and `style_selection` handle. Catalog browsing and exact-guide choice work without a model recommendation; the recommendation provider is off by default. This handoff supports the script engine. App-agent and commerce handoffs remain unsupported; ordinary app-agent generation still works.

| Tool | What it does |
| --- | --- |
| `openpencil_new` | Compatible fast path for simple jobs: runs one transactional QuickJS `batch_design` script, publishes with create-if-absent semantics, and returns an editable presentation. Prefer the full pipeline below for production design. |
| `openpencil_pipeline_begin` | Starts an owner-scoped private draft, internally seeds its only root, returns `rootNodeId`, `continuationStyle`, and the compact runtime-matched canvas/build contract, then immediately opens the same live draft in the sidebar; the target `.op` remains unpublished. |
| `openpencil_pipeline_context` | Loads one bounded guideline, style, theme, or UI-kit detail that is genuinely missing from the begin contract; it is not a startup-context refresh loop. |
| `openpencil_pipeline_batch` | Runs at most two direct native `I(...)`/`K(...)` generation scripts: the bounded first-visible-viewport script returned by begin's `next`, then one script for every remaining region. Before exposing the second preview, an authored-structure gate rejects empty category/product helpers, atomically restores the first-batch snapshot, and permits one corrected second script without consuming the two-script budget. Each successful transaction attempts an exact user-facing PNG and must be followed immediately, without narration, by its returned `next`. A third generation script is rejected; only the complete repair gate returned by finish may authorize one bounded `U(...)` QuickJS repair script. |
| `openpencil_pipeline_inspect` | Provides manual diagnostics only when the user explicitly requests them; ordinary generation never uses it as a preview or model-inspection step. |
| `openpencil_pipeline_finish` | In one healthy call, finalizes and validates the document, automatically renders the exact post-final root preview, and atomically publishes with `createIfAbsent`. One `U(...)`-only repair and one final finish are authorized only when the result is `needs_correction`, `canContinue: true`, and contains a complete non-empty `repairTargets` array with `omitted: 0`; every other non-published result is terminal. |
| `openpencil_pipeline_abort` | Discards the unpublished draft without creating the target file. |
| `openpencil_create` | Applies a transactional `batch_design` program to generate or restructure nodes on an existing live canvas. |
| `openpencil_edit` | Modifies an explicit node or the single node selected by the user. |
| `openpencil_render` | Creates an immutable, content-addressed `.op` snapshot and renders every top-level frame on the active page — optional `scale` and `editable`. |
```

</details>

**依据 4 · 源码核查**：[src/design-draft-controller.ts:700-707](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/src/design-draft-controller.ts#L700-L707)

abort只作用未结束草稿并校验owner。

```text
  async abort(draftId: string, ownerSessionId: string): Promise<boolean> {
    if (!DRAFT_ID_PATTERN.test(draftId)) return false
    validOwner(ownerSessionId)
    const session = this.#drafts.get(draftId)
    if (session === undefined) return false
    if (session.ownerSessionId !== ownerSessionId) throw new Error('OpenPencil draft belongs to a different DSH session')
    await this.#retire(session, true)
    return true
```

**依据 5 · 源码核查**：[src/design-draft-tools.ts:2194-2203](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/src/design-draft-tools.ts#L2194-L2203)

发布权限、现存目标与身份复核。

<details>
<summary>查看原文（10行）</summary>

```text
              const policy = services.sandboxPolicy.resolve({ session: exec.agent?.session })
              if (services.fs.sandboxMode !== undefined && policy.mode === 'read-only') {
                throw new Error(`${OPENPENCIL_PIPELINE_FINISH_TOOL_NAME}: publishing requires Workspace Write access`)
              }
              const currentPathInfo = await services.fs.lstat(pending.requestedPath, { cwd: policy.workspaceRoot }, exec.signal)
              if (currentPathInfo !== undefined) throw new Error(`${OPENPENCIL_PIPELINE_FINISH_TOOL_NAME}: target now exists: ${pending.requestedPath}`)
              const currentTarget = await services.fs.resolve(pending.requestedPath, { cwd: policy.workspaceRoot, signal: exec.signal })
              const currentProcessPath = services.fs.processPath(currentTarget)
              if (currentProcessPath !== pending.processPath || String(currentTarget.targetKey) !== String(pending.target.targetKey)) {
                throw new Error(`${OPENPENCIL_PIPELINE_FINISH_TOOL_NAME}: target identity changed while the draft was open`)
```

</details>

#### 缺口

- 未实际运行平台runtime、真实宿主、编辑保存与崩溃/卸载恢复。
  **影响**：不能保证当前安装组合可用或退出无残留。
  **进一步探讨**：在副本验证runtime身份、加载、保存/重启、禁用与残留，再分别核新建与编辑路径。
- 没有同需求独立设计基线下的质量、工时和全部生成修正成本。
  **影响**：不能认定可编辑交付已经提高生产效率。
  **进一步探讨**：固定brief、模型、预算和设计判据，对照独立编辑器并计人工修改。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何让视觉审查对应用户能接受的交付？

**研究主题**：新假设与验证

#### 完整回答

已有exact PNG、结构质量gate、digest和一次修正，不能把“增加预览”包装新方向。由结构摘要不能穷尽像素和需求，可推导限定假设：在草稿发布前，将少数用户brief中的可观察验收项与最终PNG/可编辑节点绑定，由独立观察者或真正取得图像输入的审阅路径核对，再与当前digest自审比较，可能减少结构通过却不合需求的发布。不能声称所有宿主都支持模型图像输入，更不能自动把第二个模型当独立正确性保证。

用固定brief与预算构造错文案、低对比、视觉素材错配、布局遮挡和可编辑性缺失的副本稿，对照当前自审与绑定验收项的审阅。计误发布、误拒、最终可编辑性、人工修改时间、额外调用与导出成本。若审阅与生成共享盲点、没有降低误发布，或额外成本抵消修改收益，则否定；保持用户最后验收，而非由工具继续增加调用自证。

#### 证据与依据

**依据 1 · 源码核查**：[src/design-visual-review.ts:1-12](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/src/design-visual-review.ts#L1-L12)

PNG给浏览器、模型看digest的明确限制。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * Bounded see-then-fix visual review for the OpenPencil pipeline.
 *
 * The App's built-in design agent looks at a rendered screenshot and fixes
 * what it sees. The DSH pipeline ports the cheapest slice of that loop: one
 * `needs_visual_review` stage between a clean quality gate and atomic
 * publication. The finished PNG rides the existing browser presentation
 * channel, while the model receives a deterministic textual layout digest —
 * the DeepSeek adapter rejects image blocks anywhere in a request, so the
 * digest is the model-facing rendering of the same evidence — plus a fixed
 * review checklist. The model either accepts (calls finish again) or sends
 * exactly one bounded I/K/U correction batch before the final finish.
```

</details>

**依据 2 · 源码核查**：[src/design-visual-review.ts:26-33](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/src/design-visual-review.ts#L26-L33)

已有视觉checklist，不虚构缺少预览。

```text
export const VISUAL_REVIEW_CHECKLIST: readonly string[] = [
  'Vertical rhythm: section spacing is even; no giant empty band between adjacent regions.',
  'Alignment: content of every region starts on the shared horizontal inset; nothing overflows the canvas width.',
  'Repeated cards: sibling product/category cards share one width mode, media treatment, and text structure.',
  'Media: every visible media slot shows real content; a card whose image collapsed still reads as a complete text card.',
  'Copy fit: no truncated or overlapping text; headline and CTA are the strongest elements above the fold.',
  'Footer: the page ends with the complete footer band (brand, links, copyright) and nothing renders after it.',
]
```

**依据 3 · 源码核查**：[src/design-draft-tools.ts:2152-2168](https://github.com/ZSeven-W/dsh-openpencil/blob/6be9b76c7ddeedcb4e40dd0444846b71775819b0/src/design-draft-tools.ts#L2152-L2168)

当前再finish即接受的决策点。

<details>
<summary>查看原文（17行）</summary>

```text
          pending.visualReviewDone = true
          pending.visualReviewAuthorized = true
          return {
            draftId: args.draftId,
            path: pending.processPath,
            published: false,
            stage: 'needs_visual_review',
            version: checkpoint.version,
            finalization: publicFinalizationCheckpoint(checkpoint, reusedFinalization),
            ...(publicScreenshot(pending.latestRootScreenshot, checkpoint.version, checkpoint.documentSha256) === undefined
              ? {}
              : { screenshot: publicScreenshot(pending.latestRootScreenshot, checkpoint.version, checkpoint.documentSha256) as JsonValue }),
            digest: buildVisualReviewDigest(reviewed.documentJson),
            checklist: [...VISUAL_REVIEW_CHECKLIST],
            diagnostics: [],
            canContinue: true,
            next: 'Quality gates passed and the exact final preview was rendered. Review the digest (and preview) against every checklist item. If everything holds, call finish exactly once more with no batch in between to publish. Otherwise send exactly ONE bounded correction batch (I/K/U only, at most 16 calls and 6 KiB, never rebuilding Header or Hero), then call finish; the gates re-validate the corrected page.',
```

</details>

#### 缺口

- 绑定需求的独立审阅能否降低误发布及其成本未知。
  **影响**：不能声称设计质量或效率已提升。
  **进一步探讨**：固定brief和植入缺陷进行同预算对照，记录独立性、误判和人工修改。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
