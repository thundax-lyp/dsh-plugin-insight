# DSH GenUI

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[8ed3999](https://github.com/omdsh-dev/dsh-genui/tree/8ed3999147d0d1a4815706d087a6f6e1fca9268f)

<!-- BEGIN META -->
[![GitHub ★ 948](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=948&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-genui) [![npm 30d 64,772](https://img.shields.io/static/v1?label=npm+30d&message=64%2C772&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@changfenhuang/dsh-genui) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@changfenhuang/dsh-genui)
<!-- END META -->

> **功能**：在 DSH 对话中按组件规格生成交互界面，并把选择或提交作为后续会话动作。

> **亮点**：[Q01](#research-q01) 将受限组件和会话面板接到现有对话，让部分比较、筛选和本地判卷留在浏览器。

> **主要限制**：[Q02](#research-q02) 条件过滤仅约束聚合提交，密码字段的独立 action 仍可发送值。[Q03](#research-q03) 正文动作发送失败时没有可见回执。

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
  - [Q01 · 生成式组件怎样进入 DSH 对话，给用户增加什么？](#detail-section-11)
  - [Q02 · 条件控制和表单收集能约束哪些数据流？](#detail-section-12)
  - [Q03 · 动作投递和媒体加载由谁负责，如何识别失败和退出？](#detail-section-13)
  - [Q04 · 什么试用范围合适，怎样检验会话绑定回执的价值？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 对话里比较数据或填写轻量问卷的用户，可以直接操作模型生成的组件。

Markdown 适合静态阅读与文本答复，专门开发的表单可以承担稳定的校验和权限，但临时搭建需要更多工作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 交互组件 | 展示比较、表单与数据视图 | 受规格与前端资源限制 |
| 会话面板 | 在对话入口附近保存稳定界面 | 按来源折叠，追加需完整规格 |
| 用户动作 | 把选择交给后续模型处理 | 发送或业务完成需要查日志 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Web、会话及插槽 | 必需 | 正文、工具卡和面板 | 回原生文本 |
| 工具服务 | 模型工具需要 | 校验与展示工具注册 | 保留围栏路径 |
| 外部媒体或图形依赖 | 相关节点需要 | 图像或复杂交互 | 使用文字或本地数据 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选择公开数据和隔离会话 | 规格不索取秘密 |
| 检查 | 用户对照可见字段和会话身份 | 结果和目标都能判断 |
| 提交与退出 | 用户检查真实日志 | 无回执或投错时回文本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 插件、浏览器与模型 | 确认宿主接口和规格 | 未测接入时间 |
| 持续 | 渲染、媒体请求和生成回合 | 核对动作与 payload | 未测净节省 |
| 恢复 | 可能增加模型调用 | 查收件、回退文本 | 避免因点击不响应重复执行 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 对话交互 | 规格验证、渲染和面板发布 | 可访问性和任务效率 |
| 聚合提交 | 隐藏字段和秘密字段过滤 | 宿主发送最终内容 |
| 动作回传 | 按会话发送后续消息 | 收件、业务完成及失联恢复 |

> **思考**：[Q02](#research-q02) 条件过滤仅约束聚合提交，密码字段的独立 action 仍可发送值。[Q03](#research-q03) 正文动作发送失败时没有可见回执。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将受限组件和会话面板接到现有对话，让部分比较、筛选和本地判卷留在浏览器。

流式预览与稳定面板发布分开。条件隐藏、输入状态和提交过滤在浏览器协调。来源幂等适用于面板折叠，用户消息另走宿主。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 条件过滤仅约束聚合提交，密码字段的独立 action 仍可发送值。[Q03](#research-q03) 正文动作发送失败时没有可见回执。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 可用公开数据试一份无副作用的偏好表。若动作日志缺失或会话不匹配，回到文本确认。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持规格校验、显示、条件提交与会话动作。密码独立动作的数据流及发送失败边界已确认，实际宿主和用户效果待验证。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、cordis.patch.yml、src/plugin/index.ts、src/plugin/tool.ts、src/client/index.tsx、src/client/dom-fence.tsx、src/client/fence-render.tsx、src/client/genui-runtime/limits.ts、src/client/conditions.ts、src/client/blocks/render-node.tsx、src/client/blocks/forms.tsx、SKILL.md、src/client/genui-runtime/value-utils.ts、src/client/blocks/image.tsx、src/client/panel-store.ts、CHANGELOG.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码抽查模型工具、围栏和面板、提交、会话动作及图片加载。未运行宿主、浏览器或模型，未独立验证作者所列客户端或原生兼容范围。
- 下一步：在隔离会话用哨兵字段核对可见值和实际 payload，再注入发送失败与会话切换，并用键盘完成同一任务。

**分析版本**

- **仓库**：[omdsh-dev/dsh-genui](https://github.com/omdsh-dev/dsh-genui)
- **版本号**：0.16.0（[固定提交 8ed3999](https://github.com/omdsh-dev/dsh-genui/tree/8ed3999147d0d1a4815706d087a6f6e1fca9268f)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 把围栏来源与会话身份绑定到动作回执，可能降低误投与盲目重试。

在隔离会话用哨兵字段核对可见值和实际 payload，再注入发送失败与会话切换，并用键盘完成同一任务。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 27 | 6035 | — | — | 99826 |
| .mts | source | 2 | 707 | 543 | 136 | — |
| .mjs | source | 41 | 6983 | 6187 | 606 | — |
| .mjs | example | 6 | 583 | 519 | 49 | — |
| .mjs | test | 14 | 1337 | 1301 | 27 | — |
| .js | source | 3 | 1635 | 1338 | 150 | — |
| .cjs | source | 2 | 392 | 285 | 86 | — |
| .ts | source | 98 | 22504 | 18389 | 3203 | — |
| .tsx | source | 39 | 10236 | 8020 | 1804 | — |
| .ts | test | 59 | 9489 | 8127 | 577 | — |
| .md | test | 3 | 112 | — | — | 985 |
| .tsx | test | 103 | 18681 | 16259 | 1002 | — |

</details>

**活跃度**

[![Issue 未关闭 15](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=15&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-genui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 54](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=54&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-genui/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 48](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=48&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-genui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 对话用户能否用受限生成界面收集选择、展示结构化内容，并知道哪些操作已发送及敏感数据会流向哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 生成式组件怎样进入 DSH 对话，给用户增加什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

在对话里比较几组指标、筛选结果或做一份轻量问卷时，用户可直接操作模型生成的界面。比如选报告类型后填两项偏好，确认可见值再提交给同一会话。合格结果应包含完整选项、正确条件和用户可核对的已提交值。Markdown 适合直接阅读与复制，用户也可发文本回复；专用表单开发成本较高，能提供更稳定的校验、审计与权限。GenUI 的增量是用一个可复用的组件规格缩短短期交互搭建，并可将部分操作留在浏览器。

插件 patch 挂载后，宿主工具服务可用时注册 render_ui 和 validate_dsh_ui，前者处理规格、后者提供修复及错误反馈。模型也可发正文 dsh-ui 围栏，客户端安装 DOM 围栏、工具卡及会话 dock。流式未完成规格可呈现部分预览；会话面板发布还要求稳定来源与会话标识，追加要求完整 JSON，避免未完成流改变已保存面板。渲染受组件、树深、节点数及具体字段限制。工具报告已渲染只反映规格处理状态，浏览器实际展示、键盘与辅助技术仍需验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:32-41](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/README.zh-CN.md#L32-L41)

作者列出对话内排序、绘图和问卷场景。

<details>
<summary>查看原文（10行）</summary>

```text
`dsh-genui` 将大模型的文本回答无缝升级为**安全、可交互的原生 DSH 界面**。

例如当你询问「这个月订单表现如何？」，模型给出的回答不再只是一串文字，而是边打字边在正文中展开一张**可排序的数据面板**、一段**内嵌音视频**、一个**可拖拽调参的函数图像**、一组**即时判卷的测验**，或是一个**常驻的会话工作区**——文本与 UI 和谐共存，浑然一体。

---

## 🎬 真实界面预览

> [!NOTE]
> **真实截图与录屏：** 以下界面素材均直接截取自 DSH 真实对话环境中的渲染结果，无任何概念样机或预渲染伪造。
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-9](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/cordis.patch.yml#L1-L9)

实际 bundle 入口。

````text
# dsh-genui bundle for DeepSeek Harness (dsh).
# Inserted into the profile's composition when this bundle is installed
# (`dsh plugin --profile web add link:/path/to/dsh-genui`). The plugin row
# resolves the package by name through the profile's node_modules; the node
# half teaches the model the ```dsh-ui fence, the dshClient half registers
# the browser renderer via the fence-registry extension point.
- insert:
    - id: genui
      name: '@changfenhuang/dsh-genui'
````

**依据 3 · 源码核查**：[src/plugin/index.ts:225-234](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/plugin/index.ts#L225-L234)

工具服务在场时注册两项模型工具。

<details>
<summary>查看原文（10行）</summary>

```text
  // Hosts without tool access keep the fence channel. The dependency fiber
  // starts whenever tools becomes available and unloads its registrations
  // before either the service or this plugin is replaced.
  ctx.inject(['tools'], (toolsCtx) => {
    toolsCtx.effect(function* () {
      if (renderUiToolEnabled) {
        yield toolsCtx.tools.register(createRenderUiTool())
      }
      yield toolsCtx.tools.register(createValidateDshUiTool())
    }, 'dsh-genui: model tools')
```

</details>

**依据 4 · 源码核查**：[src/plugin/tool.ts:232-250](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/plugin/tool.ts#L232-L250)

工具处理规格、报错误和输出可展示节点统计。

<details>
<summary>查看原文（19行）</summary>

```text
    async execute(args: unknown): Promise<JsonValue> {
      const processed = processRenderableValue(specOf(args))
      if (processed.spec === null) {
        return ['[genui-render]', 'status=invalid', 'error=invalid_spec', 'required=items', 'next=fix_and_retry', 'reply_language=conversation'].join('\n')
      }
      if (!isRenderableProcess(processed)) {
        throw new Error('render_ui spec invalid: ' + processed.errors.join('; '))
      }
      const spec = processed.spec
      const warnings = formatProcessWarnings(processed)
      return [
        '[genui-render]',
        'status=rendered',
        ...(spec.title === undefined ? [] : [`title=${JSON.stringify(spec.title)}`]),
        `rendered=${processed.renderedCount}`,
        'action_feedback=[genui-action]',
        ...warnings,
        'reply_language=conversation',
      ].join('\n')
```

</details>

**依据 5 · 源码核查**：[src/client/index.tsx:136-172](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/index.tsx#L136-L172)

客户端挂载正文、工具卡和面板插槽。

<details>
<summary>查看原文（37行）</summary>

```text
  const disposers: Array<() => void> = [
    localeDispose,
    installDomFenceRenderer(ctx, (sessionId, action, payload) => sendInlineGenuiAction(ctx, sessionId, action, payload), fileLinkAvailability),
  ]
  // Idle prefetch of the lazy engine assets: the browser downloads them at
  // LOW priority whenever the page is idle, so the first mermaid/3D node in
  // a session usually hits a warm cache instead of paying the fetch on first
  // use. Never blocks first paint; the loader still handles a miss.
  prefetchGenuiAssets()
  // Achievement toasts (0.9.5): a body-level stack independent of the panel.
  disposers.push(mountAchievementToasts())
  // Keyed toolview: the harness dispatches 'tool.call.toolview' by wire tool
  // name; registering under 'render_ui' gives the tool's result card the
  // GenUI renderer (reading the repaired spec from result meta). The toolview
  // also publishes every settled spec to the session panel store.
  disposers.push(ctx.slots.inject('tool.call.toolview', () => ctx.slots.register({
    name: 'tool.call.toolview',
    key: 'render_ui',
  }, (props: ToolCallViewProps) => withFileLinkContext(
    ctx as unknown as FileLinkCordisContext,
    fileLinkAvailability,
    props.sessionId,
    false,
    createElement(GenuiToolView, props),
  ))))
  // Session panel dock: a session-scoped, always-present seat above the
  // composer (TodoDock posture). Renders the session's latest render_ui
  // spec in place; absent spec = no panel.
  disposers.push(ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
    name: 'conversation.input.dock',
    id: 'genui-panel',
    order: 50,
    inject: (sessionId: SessionId): GenuiPanelInjected => ({
      ...panelActionSend(ctx, sessionId),
      fileLinkContext: { ctx: ctx as unknown as FileLinkCordisContext, availability: fileLinkAvailability },
    }),
  }, GenuiPanel)))
```

</details>

**依据 6 · 源码核查**：[src/client/dom-fence.tsx:1089-1107](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/dom-fence.tsx#L1089-L1107)

流式预览只在完成后取得稳定来源身份。

<details>
<summary>查看原文（19行）</summary>

```text
  /** Render context for a block: session always; the stable source identity
   * only once settled — streaming renders are identity-less (no panel
   * publish, no durable state), matching inline fence behavior. */
  function contextOf(row: Element, block: Element, settled: boolean, preserveSessionIdentity = false): { key: Key; context: GenuiFenceContext } {
    if (settled && row.getAttribute('data-chat-anchor-key') === null) {
      // Safari / fallback render path: the host omitted the row anchor (the
      // attribute is a React key that React drops when undefined). Fences
      // still render with the degraded `dom:unknown:N` identity — warn once
      // per block so the degraded path is visible in the console.
      warnOnce(block, 'no [data-chat-anchor-key] ancestor for a dsh-ui fence (host render path without row anchor — e.g. Safari); using fallback identity dom:unknown:N')
    }
    const fenceIndex = fenceIndexOf(row, block, sourceLanguages.get, documentFenceIndex)
    const anchorKey = row.getAttribute('data-chat-anchor-key') ?? 'unknown'
    const key = `dom:${anchorKey}:${fenceIndex}` as Key
    const sessionId = sessionIdForRender(preserveSessionIdentity)
    const context: GenuiFenceContext = {
      ...(sessionId === undefined ? {} : { sessionId }),
      ...(settled ? { source: { id: key as string, order: [anchorSeqOf(row, documentRowIndex), 0, fenceIndex] as const } } : {}),
    }
```

</details>

**依据 7 · 源码核查**：[src/client/fence-render.tsx:214-237](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/fence-render.tsx#L214-L237)

面板发布与完整追加的门槛。

<details>
<summary>查看原文（24行）</summary>

```text
export function renderResolvedFenceNode(raw: string, key: Key, context?: GenuiFenceContext): ReactNode | null {
  const spec = resolveGenuiSpec(raw, context)
  if (spec === null) return null
  if (spec.panel === true) {
    // Publish only with a settled stable source — streaming/identity-less
    // renders keep the panel untouched. Appends additionally gate on a
    // complete body (a settled-but-malformed append never merges partial
    // content).
    if (context !== undefined && context.sessionId !== undefined && context.source !== undefined) {
      if (spec.append === true && !isCompleteJson(raw)) return <Fragment key={key} />
      return (
        <FencePanelPublisher
          key={key}
          sessionId={context.sessionId}
          sourceId={context.source.id}
          order={context.source.order}
          spec={spec}
          raw={raw}
        />
      )
    }
    return <Fragment key={key} />
  }
  return renderInlineFence(key, context, spec)
```

</details>

**依据 8 · 源码核查**：[src/client/genui-runtime/limits.ts:1-19](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/genui-runtime/limits.ts#L1-L19)

限制组件复杂度的共享预算。

<details>
<summary>查看原文（19行）</summary>

```text
/** Resource limits shared by GenUI repair, validation, and rendering. */
export const GENUI_LIMITS = {
  /** Maximum nesting depth of the component tree. */
  maxDepth: 8,
  /** Maximum total nodes across the whole spec. */
  maxNodes: 200,
  /** Maximum length of any plain string field. */
  maxString: 2000,
  /** Maximum length of a `code` body. */
  maxCode: 12_000,
  /** Copy preview only; clipboard text keeps the existing maxCode limit. */
  maxCopyPreview: 2000,
  maxCopyPreviewLines: 30,
  /** Maximum length of a mermaid source. */
  maxMermaid: 8000,
  /** Maximum `grid` columns. */
  maxGridCols: 12,
  /** Maximum `tabs` count. */
  maxTabs: 12,
```

</details>

#### 缺口

- 缺少同版本多浏览器交互与可访问性检查
  **影响**：不能确定对所有用户更容易完成
  **进一步探讨**：用同一问卷比较原生文本和交互 UI，记录输入错误与键盘可达性

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 条件控制和表单收集能约束哪些数据流？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

固定源码采用 when 隐藏节点，enableWhen 通过 inert 包裹不可操作的子树。条件收集递归标识隐藏父节点的子字段；聚合提交对 answers、multiAnswers、fields 和 required groups 都过滤隐藏键，并拒绝空值、非法数值或无效日期。该逻辑对动态表单有意义。例如更改报告类型后隐藏的旧日期，不会借聚合提交跟出去。groups 控制完成状态和本地判卷范围，但发送分支仍取全局可见 collectedAnswers 和 filledFields，因而不能把 groups 当作数据发送白名单。失去交互状态时，渲染倾向显示控件，条件也不能作为宿主权限。

密码字段不参与持久化和聚合，初始恢复为空。独立 action 则走同一 send，未按 secret 阻断，值变动后失焦或回车可把 value 放进事件。作者技能文本禁止向模型索取密码、API Key 或令牌；这是模型指导，对固定渲染实现无强制作用。掩码以及聚合过滤不能证明不会发送敏感内容。若用于需要保密输入的任务，应排除生成字段承载凭据的路径。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/conditions.ts:133-155](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/conditions.ts#L133-L155)

条件递归收集隐藏字段，包括隐藏容器下的键。

<details>
<summary>查看原文（23行）</summary>

```text
export function collectHiddenKeys(items: unknown, state: ConditionState): ReadonlySet<string> {
  if (!Array.isArray(items)) return new Set(state.conditionHidden ?? [])

  const ownKey = (node: ConditionNode): string | undefined => {
    const id = typeof node.id === 'string' ? node.id : undefined
    if (id !== undefined) return id
    return typeof node.group === 'string' ? node.group : undefined
  }

  const collectPass = (conditionHidden: ReadonlySet<string>): Set<string> => {
    const found = new Set<string>()
    const passState = { ...state, conditionHidden }
    const walk = (nodes: GenuiNode[], depth: number): void => {
      if (depth > GENUI_LIMITS.maxDepth) return
      nodes.forEach(node => {
        const visible = node.when === undefined || evaluateWhen(node.when, passState)
        if (!visible) {
          const key = ownKey(node)
          if (key !== undefined) found.add(key)
          // A found container hides every real GenUI field beneath it.
          collectKeys(node, found)
          return
        }
```

</details>

**依据 2 · 源码核查**：[src/client/blocks/render-node.tsx:233-250](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/blocks/render-node.tsx#L233-L250)

enableWhen 由浏览器 inert 表达，缺状态时不拦截。

<details>
<summary>查看原文（18行）</summary>

```text
export function renderNode(
  node: GenuiNode,
  key: number,
  onAction: GenuiBlockProps['onAction'] | undefined,
  depth = 0,
  answers?: AnswersState,
  path = `items[${key}]`,
): ReactNode {
  const rendered = renderNodeBody(node, key, onAction, depth, answers, path)
  if (rendered === null || node.enableWhen === undefined) return rendered
  // Without block state the condition cannot be evaluated: stay enabled rather
  // than disable a control for a reason the renderer cannot see.
  if (answers === undefined || evaluateWhen(node.enableWhen, answers)) return rendered
  return (
    <div key={key} className={css.nodeGate} data-genui-gated="" aria-disabled="true" {...{ inert: '' }}>
      {rendered}
      <span className={css.nodeGateReason}>{renderInline(node.disabledReason ?? t('block.gateReason'), false)}</span>
    </div>
```

</details>

**依据 3 · 源码核查**：[src/client/blocks/forms.tsx:91-116](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/blocks/forms.tsx#L91-L116)

聚合提交中隐藏、秘密和无效字段过滤。

<details>
<summary>查看原文（26行）</summary>

```text
  // Values under a false `when` condition are invisible to the reader, so they
  // are invisible to the submit too: excluded from the payload and from the
  // required set (a hidden field must not look unanswered).
  const hidden = answers?.hidden ?? EMPTY_KEYS
  const visible = <T,>(record: Readonly<Record<string, T>>): Record<string, T> =>
    Object.fromEntries(Object.entries(record).filter(([key]) => !hidden.has(key)))
  const recorded = visible(answers?.answers ?? {})
  const multiRecorded = visible(answers?.multiAnswers ?? {})
  const fields = visible(answers?.fields ?? {})
  const validFields = Object.fromEntries(Object.entries(fields).filter(([id]) => !answers?.invalidNumericFields.has(id)))
  const expected = node.groups?.filter(group => !hidden.has(group))
  // One shared notion of "filled fields" for answered/ready/payload: non-blank
  // values only, secrets (password inputs) never collected into submit.
  const filledFields = Object.fromEntries(
    Object.entries(validFields).filter(([id, v]) => {
      if (v.trim() === '' || answers?.secretFields.has(id)) return false
      const member = answers?.registry.members.get(id)
      return member?.kind !== 'field' || member.fieldType !== 'date-picker'
        || isDatePickerValueValid(v, member.datePicker?.mode ?? 'single', member.datePicker?.min, member.datePicker?.max)
    }),
  )
  const resolved = answers === undefined ? { scope: [], answered: 0, total: expected?.length ?? 0, localGradeEligible: false, hasOutOfScopePayload: false }
    : resolveSubmitState({
      registry: answers.registry,
      ...(expected === undefined ? {} : { groups: expected }),
      state: { answers: recorded, multiAnswers: multiRecorded, fields: validFields, secretFields: answers.secretFields, hidden },
```

</details>

**依据 4 · 源码核查**：[src/client/blocks/forms.tsx:119-137](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/blocks/forms.tsx#L119-L137)

可见选项的收集没有按 groups 再筛。

<details>
<summary>查看原文（19行）</summary>

```text
  const canSendAction = node.action !== undefined && onAction !== undefined
  const shouldGradeLocally = resolved.localGradeEligible && (!resolved.hasOutOfScopePayload || !canSendAction)
  const submitted = answers?.locked === true
  const collectedAnswers: Record<string, string | string[]> = {
    ...recorded,
    ...Object.fromEntries(Object.entries(multiRecorded).flatMap(([group, values]) => {
      const member = answers?.registry.members.get(group)
      if (member?.kind !== 'checkbox') return []
      return [[group, values.flatMap(value => {
        const label = member.choices.get(value)
        return label === undefined ? [] : [label]
      })]]
    })),
  }
  // Ready = enough answers AND the click can do something: either local
  // grading, or a real action name + provider. A submit with neither is a
  // display-only control — honest disabled affordance.
  const ready = answered > 0 && answered >= total
    && (shouldGradeLocally || canSendAction)
```

</details>

**依据 5 · 源码核查**：[src/client/blocks/forms.tsx:199-214](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/blocks/forms.tsx#L199-L214)

提交传实际收集的 answers 与 fields。

<details>
<summary>查看原文（16行）</summary>

```text
        onClick={ready ? () => {
          if (shouldGradeLocally) {
            // Local grading: immediate in-place result, no model round trip.
            answers?.setLocked(true)
          } else if (node.action !== undefined && onAction !== undefined) {
            // `ready` already guarantees this branch, but the narrow keeps
            // the optional-action type honest.
            onAction(node.action, {
              type: 'submit',
              answers: collectedAnswers,
              ...(Object.keys(filledFields).length > 0 ? { fields: filledFields } : {}),
              total,
              answered,
            })
          }
        } : undefined}
```

</details>

**依据 6 · 源码核查**：[src/client/blocks/forms.tsx:412-445](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/blocks/forms.tsx#L412-L445)

秘密字段初值与持久化独立处理，但 send 仍发送值。

<details>
<summary>查看原文（34行）</summary>

```text
  const action = node.action
  const id = node.id
  const secret = node.inputType === 'password'
  const numeric = node.inputType === 'number'
  const restored = !secret && id !== undefined && answers?.fields !== undefined && Object.hasOwn(answers.fields, id)
    ? answers.fields[id]
    : undefined
  // Initial value: durable state wins over the spec default. Secrets always
  // restore as blank so a password can never survive a refresh.
  const [value, setValue] = useState<string>(() => {
    const initial = secret ? '' : (restored ?? node.value ?? '')
    // Match the native color input's opaque hex value, including its black default.
    return node.inputType === 'color'
      ? /^#[0-9a-f]{6}$/i.test(initial) ? initial.toLowerCase() : '#000000'
      : initial
  })
  // Last value actually DELIVERED to the model: blur only sends when the
  // value changed since the last delivery (a focus-in/focus-out with no edit
  // used to fire a pointless action round trip). Seeded with the mount value
  // so the very first unedited blur also stays silent.
  const lastSent = useRef<string | null>(value)
  const setField = answers?.setField
  const send = (submit: boolean): void => {
    if (numeric && value.trim() !== '' && parseDecimalNumber(value) === undefined) return
    if (action !== undefined && onAction !== undefined) {
      lastSent.current = value
      onAction(action, { type: 'input', value, ...(id !== undefined ? { id } : {}), ...(submit ? { submit: true } : {}) })
    }
  }
  const ime = useImeComposing()
  // renderNode 按字段标识和类型设置输入项身份，流式更新或切换标签页后不会串到其他字段。
  useEffect(() => {
    if (!secret && id !== undefined && value.trim() !== '') setField?.(id, value)
  }, [id, value, secret, setField])
```

</details>

**依据 7 · 源码核查**：[src/client/blocks/forms.tsx:461-478](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/blocks/forms.tsx#L461-L478)

失焦与回车均能走独立动作。

<details>
<summary>查看原文（18行）</summary>

```text
        placeholder={node.placeholder}
        value={value}
        onChange={e => {
          const v = e.currentTarget.value
          setValue(v)
          if (!secret && id !== undefined) answers?.setField(id, v)
        }}
        onBlur={() => {
          if (value !== lastSent.current) send(false)
        }}
        onCompositionStart={ime.onCompositionStart}
        onCompositionEnd={ime.onCompositionEnd}
        onKeyDown={e => {
          if (e.key !== 'Enter') return
          if (ime.isComposing() || isImeSubmitKeydown(e)) return
          e.preventDefault()
          send(true)
        }}
```

</details>

**依据 8 · 作者声明**：[SKILL.md:95-103](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/SKILL.md#L95-L103)

作者文档禁止索取秘密。

```text

### 交互
**本地优先（v2.6）**：UI 自己能做的状态变化——判卷、判题、重置、展开、选中——一律本地即时完成，**零模型往返**。action 只用于必须模型参与的事（生成新内容、执行工具、下一步建议）。**交互组件必须带 action：不带 action 的按钮渲染为禁用态，用户点不了；带 action 的按钮点击后有「已触发」本地反馈。**
- button: `{"type":"button","label":"...","tone":"primary|danger|success|ghost","full":true?,"small":true?,"icon":"emoji?","action":"refresh"?}`
- **秘密禁令**：不得索取或生成密码、API Key、访问令牌、恢复码等秘密输入；遇到此类需求直接拒绝并解释
- input: `{"type":"input","label":"...","placeholder":"...","inputType":"text|email|color|number","value":"...","action":"name"?,"id":"field-id"?}` — `color` 使用浏览器原生取色器，值使用 `#RRGGBB`；`number` 可作为 Computed 数值输入；action 在失焦**和回车**时触发（回车带 `submit:true`）；**blur 仅值有变化才发送**（聚焦又离开不产生空往返）；payload 带 `id` 帮模型定位字段；带 `id` 的值刷新后保留、并被 submit 收集进 `fields`
- select: `{"type":"select","label":"...","options":["...","..."],"selected":下标?,"action":"pick"?,"id":"field-id"?}` — `selected` 预选某选项（缺省显示「请选择…」占位，不静默预选第一项）；带 `id` 的选择跨刷新保留并进 submit 的 `fields`
- date-picker: `{"type":"date-picker","label":"...","mode":"single|range","value":"YYYY-MM-DD 或 YYYY-MM-DD/YYYY-MM-DD","min":"YYYY-MM-DD","max":"YYYY-MM-DD","id":"field-id"}` — 使用浏览器原生日期控件；日期必须是真实日历日期，范围模式的值是开始和结束日期组成的 ISO 区间；范围输入完整且有效后，带 `id` 的值进入共享状态与 submit 的 `fields`
- segmented-control: `{"type":"segmented-control","label":"...","options":["...","..."],"value":"...","id":"field-id","action":"pick"}` — 胶囊式单选控件；带 `id` 时选中值进入共享状态，可用于 `when` 更新同级组件，也会进入 submit 的 `fields`；`action` 可选，设置后每次选择都会发送该 action
```

#### 缺口

- 未在宿主发送哨兵字段以观察真实消息
  **影响**：确认的是固定代码数据流，不知道宿主后段是否还有过滤
  **进一步探讨**：用虚构非秘密标记和两个 groups 捕获实际会话消息，验证已隐藏、可见其他组和独立密码 action

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 动作投递和媒体加载由谁负责，如何识别失败和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

用户动作会被序列化为后续会话文本，由宿主 conversation.send 发送。面板绑定插槽提供的会话；正文围栏点击时重新解析当前所看会话，找不到则警告并返回。面板发送异常只告警，正文吞掉异常，界面仍可互动。代码能证明发起动作和异步失败分支，不能从按钮触发推断模型或业务动作已执行。会话切换时还需检验陈旧 DOM 是否会让原界面的动作送向当前会话。

规格里的图片允许 HTTP(S) 及相对路径，浏览器 img 设置 no-referrer 减少页面来源泄露，外部地址仍会被请求。其 URL 过滤及组件预算都是局部边界。面板状态按 sessionId 写本地存储，面板操作可按来源 ID 幂等折叠，和点击消息的网络投递去重属于不同层次。首次成本包含兼容宿主、浏览器及模型生成正确规格的接入；日常有前端渲染、媒体请求、验证或 action 触发的额外回合；失败时要查发出的消息和实际业务结果，再决定是否重试。以一次正确完成的用户任务衡量，文本回退能去掉 UI 生成和渲染环节，却可能增加人工表达。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:54-71](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/index.tsx#L54-L71)

面板按插槽会话发送，失败告警但界面仍可用。

<details>
<summary>查看原文（18行）</summary>

```text
function panelActionSend(ctx: Context, sessionId: SessionId): GenuiPanelInjected {
  const scoped = ctx.sessions.scope(sessionId)
  const conversation = scoped?.get('conversation') as IConversation | undefined
  return {
    sessionId,
    sendGenuiAction: (action, payload) => {
      if (conversation === undefined) return
      const payloadText = Object.keys(payload).length === 0
        ? ''
        : t('action.payload', { json: JSON.stringify(payload) })
      void conversation.send(t('action.panel', { action, payload: payloadText })).catch((err: unknown) => {
        // A failed prompt (session gone, agent busy) drops the action; the
        // panel stays interactive — the component is not disabled. Log the
        // failure WITHOUT the action payload or any secret values (the
        // message may contain field content).
        console.warn(`[genui] 面板动作 "${action}" 发送失败（session ${sessionId}）：`, err instanceof Error ? err.message : String(err))
      })
    },
```

</details>

**依据 2 · 源码核查**：[src/client/dom-fence.tsx:1206-1220](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/dom-fence.tsx#L1206-L1220)

正文动作点击时解析宿主主视图会话，无会话时拒发。

<details>
<summary>查看原文（15行）</summary>

```text
  /**
   * 通过当前宿主会话发送 DOM 通道 action。
   *
   * @param block - 触发 action 的围栏元素
   * @param action - 组件声明的 action 名称
   * @param payload - 组件产生的交互数据
   */
  function sendActionForBlock(block: Element, action: string, payload: Record<string, unknown>): void {
    const sessionId = sessionIdOf()
    if (sessionId === undefined) {
      warnOnce(block, `cannot resolve the viewed session; action "${action}" was not sent`)
      return
    }
    sendAction(sessionId, action, payload)
  }
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:103-113](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/index.tsx#L103-L113)

正文将 payload 序列化为对话文本，发送失败直接丢弃。

<details>
<summary>查看原文（11行）</summary>

```text
function sendInlineGenuiAction(ctx: Context, sessionId: SessionId, action: string, payload: Record<string, unknown>): void {
  const scoped = ctx.sessions.scope(sessionId)
  const conversation = scoped?.get('conversation') as IConversation | undefined
  if (conversation === undefined) return
  const payloadText = Object.keys(payload).length === 0
    ? ''
    : t('action.payload', { json: JSON.stringify(payload) })
  void conversation.send(t('action.inline', { action, payload: payloadText })).catch(() => {
    // A failed prompt (session gone, agent busy) drops the action;
    // the UI stays interactive — the component is not disabled.
  })
```

</details>

**依据 4 · 源码核查**：[src/client/genui-runtime/value-utils.ts:34-45](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/genui-runtime/value-utils.ts#L34-L45)

允许外部 HTTP(S) 及相对媒体 URL。

<details>
<summary>查看原文（12行）</summary>

```text
/** Keep browser-reachable http(s) or same-origin relative media paths. */
export function safeMediaSrc(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  // Browsers strip ASCII controls while parsing URLs; do not let a split
  // scheme or authority pass as a harmless relative image path.
  if (/[\u0000-\u001f\u007f]/.test(value)) return undefined
  const normalized = value.trim()
  if (normalized === '' || normalized.length > 2048) return undefined
  if (/^https?:\/\//i.test(normalized)) return normalized
  if (/^[a-z][a-z0-9+.-]*:/i.test(normalized) || /^[/\\]{2}/.test(normalized)) return undefined
  return normalized
}
```

</details>

**依据 5 · 源码核查**：[src/client/blocks/image.tsx:15-26](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/blocks/image.tsx#L15-L26)

浏览器加载远端媒体并抑制 referrer。

<details>
<summary>查看原文（12行）</summary>

```text
      {failed
        ? <div className={css.mediaError} role="alert">{t('block.imageError')}</div>
        : <img
            className={css.mediaPlayer}
            src={node.src}
            alt={node.alt ?? t('block.image')}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            style={{ maxHeight: 'min(70vh, 720px)', objectFit: 'contain' }}
            onError={() => setFailed(true)}
          />}
```

</details>

**依据 6 · 源码核查**：[src/client/panel-store.ts:130-155](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/panel-store.ts#L130-L155)

面板状态以会话为键写本地存储。

<details>
<summary>查看原文（26行）</summary>

```text
function readPanelStorage(): PanelStorageShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return { order: [], sessions: {} }
    const parsed = JSON.parse(raw) as Partial<PanelStorageShape>
    if (!Array.isArray(parsed.order) || typeof parsed.sessions !== 'object' || parsed.sessions === null) {
      return { order: [], sessions: {} }
    }
    return {
      order: parsed.order.filter(k => typeof k === 'string'),
      sessions: parsed.sessions as Record<string, PersistedPanel>,
    }
  } catch {
    return { order: [], sessions: {} }
  }
}

function writePanelStorage(sessionId: string, entry: PersistedPanel): void {
  try {
    const store = readPanelStorage()
    const order = store.order.filter(k => k !== sessionId)
    order.unshift(sessionId)
    const sessions = { ...store.sessions, [sessionId]: entry }
    while (order.length > MAX_PERSISTED_SESSIONS) {
      const evicted = order.pop()
      if (evicted !== undefined) delete sessions[evicted]
```

</details>

**依据 7 · 源码核查**：[src/client/panel-store.ts:398-425](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/panel-store.ts#L398-L425)

来源幂等作用于面板操作折叠。

<details>
<summary>查看原文（28行）</summary>

```text
/**
 * Submit one panel operation. Idempotent per sourceId; ordering and budget
 * per the module doc. Returns the outcome so callers can diagnose once per
 * source (e.g. "panel at its node/appends budget — send a replace").
 */
export function applyPanelOperation(sessionId: string, op: PanelOperation): PanelOperationStatus {
  const state = stateOf(sessionId)
  const result = fold(state, op)
  if (result === null) {
    if (state.seen.has(op.sourceId) || state.overflow?.sourceId === op.sourceId) return 'idempotent'
    // A rejection may come from the replay/local barriers (dead old content
    // — worth one diagnostic) or from the budget overflow barrier (a later
    // append beyond the panel budget — the budget diagnostic covers it).
    const laterThanOverflow = state.overflow !== null
      && op.mode === 'append'
      && compareOrder(op.order, state.overflow.order) > 0
    if (!laterThanOverflow) diagnosePanelBlocked(sessionId, op, state)
    return 'blocked'
  }
  const status: PanelOperationStatus = result.overflow !== null && result.overflow.sourceId === op.sourceId
    ? 'overflow'
    : result.invalid.has(op.sourceId) ? 'invalid' : 'accepted'
  const changed = state.snapshot !== result.snapshot || state.invalid.size !== result.invalid.size
    || [...result.invalid].some(([sourceId, error]) => state.invalid.get(sourceId) !== error)
  commit(state, result, sessionId)
  state.seen.set(op.sourceId, op.order)
  if (changed) for (const fn of listeners) fn()
  return status
```

</details>

**依据 8 · 作者声明**：[CHANGELOG.md:37-43](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/CHANGELOG.md#L37-L43)

作者报告精确宿主验证与官方本地回放，明确真实账号未被覆盖。

```text
### 兼容性与发布验证

- 新增 DSH `0.2.2-rc.1`（npm `latest` / `next`）的精确 npm 宿主检查：公开接口、全量单元测试、构建，以及同一安装包的正文、图片选择、计算字段提交和 Linux 地图浏览器验收。
- 保留 DSH `0.2.0-rc.1`、`0.2.1-rc.3`、`0.2.1-rc.4`、`0.2.1-rc.5` 和 `0.2.2-alpha.2` 检查；第三方侧栏仍在 rc.3 上验收。现有 peer 范围已包含 0.2.2-rc.1，无需扩大版本声明。当前 RC 与 alpha 宿主要求 Node.js >=24.9.0。
- 精确 npm 宿主验收固定对应发布清单中的 Cordis 基础依赖，保持宿主依赖图一致。
- CI 取消同一 PR 的过时运行，每次 main 检查独立保留（#416）。
- 会话动作使用官方本地回放；真实模型账户、Android 真机及原 Windows Desktop 环境的验收不由这些自动检查替代。
```

#### 缺口

- 缺少会话切换、断网或并发点击时的宿主回执
  **影响**：无法知道跨会话错投或重复处理的发生条件
  **进一步探讨**：用两条隔离会话和断网条件核对动作来源、真实收件和模型回合

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么试用范围合适，怎样检验会话绑定回执的价值？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合试用的是希望用轻量 UI 比较公开数据或做低风险选择的 DSH Web 用户。可先生成一个无外部媒体、无密码字段且无业务副作用的报告偏好表，提交之前核对界面显示和结果所处的会话。送出后到对话日志确认实际 payload，若隐藏值、额外可见字段或错误会话进入消息，或点击后没有可核对反馈，就停止并用文本重述选择。不用一次试用替代权限系统或真实任务验收。

设计假设是将来源消息、面板或围栏 ID 及会话绑定到动作回执，让客户端能明确标出已排队、未知和已失败。相较当前点击时解析主视图以及异步失败无反馈，这可能减少误投和盲重试。以两个测试会话、失焦、切换和注入网络失败作为固定条件，对比当前动作通路和来源绑定回执。记录可核对动作数、错会话、重复发送以及失败恢复时间。若新机制只提高界面确认率但没有降低错投或重复，或明显增加漏发，则假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/dom-fence.tsx:1213-1220](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/dom-fence.tsx#L1213-L1220)

可重放的当前会话解析边界。

```text
  function sendActionForBlock(block: Element, action: string, payload: Record<string, unknown>): void {
    const sessionId = sessionIdOf()
    if (sessionId === undefined) {
      warnOnce(block, `cannot resolve the viewed session; action "${action}" was not sent`)
      return
    }
    sendAction(sessionId, action, payload)
  }
```

**依据 2 · 源码核查**：[src/client/index.tsx:103-113](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/index.tsx#L103-L113)

当前没有面向用户的失败回执。

<details>
<summary>查看原文（11行）</summary>

```text
function sendInlineGenuiAction(ctx: Context, sessionId: SessionId, action: string, payload: Record<string, unknown>): void {
  const scoped = ctx.sessions.scope(sessionId)
  const conversation = scoped?.get('conversation') as IConversation | undefined
  if (conversation === undefined) return
  const payloadText = Object.keys(payload).length === 0
    ? ''
    : t('action.payload', { json: JSON.stringify(payload) })
  void conversation.send(t('action.inline', { action, payload: payloadText })).catch(() => {
    // A failed prompt (session gone, agent busy) drops the action;
    // the UI stays interactive — the component is not disabled.
  })
```

</details>

**依据 3 · 源码核查**：[src/client/blocks/forms.tsx:199-214](https://github.com/omdsh-dev/dsh-genui/blob/8ed3999147d0d1a4815706d087a6f6e1fca9268f/src/client/blocks/forms.tsx#L199-L214)

可用纯本地判卷或低风险 action 设计对照。

<details>
<summary>查看原文（16行）</summary>

```text
        onClick={ready ? () => {
          if (shouldGradeLocally) {
            // Local grading: immediate in-place result, no model round trip.
            answers?.setLocked(true)
          } else if (node.action !== undefined && onAction !== undefined) {
            // `ready` already guarantees this branch, but the narrow keeps
            // the optional-action type honest.
            onAction(node.action, {
              type: 'submit',
              answers: collectedAnswers,
              ...(Object.keys(filledFields).length > 0 ? { fields: filledFields } : {}),
              total,
              answered,
            })
          }
        } : undefined}
```

</details>

#### 缺口

- 没有真实动作回执对照
  **影响**：无法量化回执对错误和恢复工时的影响
  **进一步探讨**：记录发送和接收两端的 ID、时序及用户重试行为

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
