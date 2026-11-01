# DSH GenUI

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e00bdcf](https://github.com/omdsh-dev/dsh-genui/tree/e00bdcfbf7d4492afc95d5e52af350d6b68882c6)

<!-- BEGIN META -->
[![GitHub ★ 832](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=832&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-genui) [![npm 30d 44,380](https://img.shields.io/static/v1?label=npm+30d&message=44%2C380&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@changfenhuang/dsh-genui) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@changfenhuang/dsh-genui)
<!-- END META -->

> **功能**：在 DSH 对话中按受限组件规格呈现交互界面，并把动作送回模型。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示将受限组件树嵌入会话，便于在不单独开发应用的情况下呈现交互；效果尚未实测。

> **主要限制**：[Q03](#research-q03) 和 [Q04](#research-q04) 显示动作是后续消息且可能丢失，具体防护不证明所有生成内容安全。

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
  - [Q01 · 谁需要生成式界面，相对 Markdown 和手工界面有什么增量？](#detail-section-11)
  - [Q02 · 模型 spec 如何验证、展示并支持回放？](#detail-section-12)
  - [Q03 · 界面操作如何回到模型，失败和权限边界是什么？](#detail-section-13)
  - [Q04 · 如何约束生成内容和资源，边界是什么？](#detail-section-14)
  - [Q05 · 依赖、成本和停止条件是什么？](#detail-section-15)
  - [Q06 · 如何验证操作只进入预期会话且不伪装为完成事务？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要在对话中查看图表、表单和结构化内容的用户。

Markdown 提供静态内容，手工应用提供稳定交互；生成组件树可缩短一次性界面的搭建，但收益未经量化。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 规格验证与渲染 | 展示模型生成组件 | 预算裁剪可能使原始内容不完整 |
| 会话动作 | 将用户操作发送给模型 | 可能发送失败，不是事务确认 |
| 图形展示 | SVG 和 Mermaid 图形 | 特定防护不证明全部组件安全 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 宿主及 peer 服务 | 是 | 注册工具、会话和客户端入口 | 功能可能不可用 |
| 浏览器客户端 | 界面需要 | 渲染组件和接收操作 | 无法使用交互界面 |
| 模型调用 | 动态生成或响应动作需要 | 构造规格与后续回合 | 内容或反馈无法生成 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认宿主兼容并隔离输入 | 保留纯文本回退 |
| 展示 | 模型生成规格，客户端验证和渲染 | 检查缺项与警告 |
| 操作 | 用户确认会话并触发动作 | 核对后续消息和结果，失败时重试前核查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | 包与浏览器资源开销未知 | 核对宿主版本 | 部分服务可选 |
| 使用 | 模型交互及浏览器资源未知 | 核对内容、会话与权限 | 动作可能产生新回合 |
| 恢复 | 额外重试开销未知 | 检查已发送动作避免重复 | 发送失败无事务确认 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 交互界面 | 模型工具和客户端渲染路径 | 效率及可访问性 |
| 会话动作 | 按会话发送后续消息 | 可靠投递和实际业务完成 |
| 内容防护 | 规格上限与部分图形检查 | 全组件安全与性能 |

> **思考**：[Q03](#research-q03) 和 [Q04](#research-q04) 显示动作是后续消息且可能丢失，具体防护不证明所有生成内容安全。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示将受限组件树嵌入会话，便于在不单独开发应用的情况下呈现交互；效果尚未实测。

[Q02](#research-q02) 分离宿主工具与客户端呈现，[Q04](#research-q04) 限制树规模及图形输入；完整兼容与安全仍未运行验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 和 [Q04](#research-q04) 显示动作是后续消息且可能丢失，具体防护不证明所有生成内容安全。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议用非敏感数据在隔离宿主先验证界面和会话动作，遇缺项或目标不明时回退文本。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码已检查；宿主、浏览器、可访问性和实际收益未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/plugin/index.ts、src/plugin/tool.ts、src/client/index.tsx、src/client/genui-runtime/limits.ts、src/client/guard.ts、src/client/blocks/svg.tsx、src/client/mermaid-core.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交的工具、客户端动作、验证上限和 SVG/Mermaid 渲染；未执行目标、宿主或浏览器，也未穷举全部组件。
- 下一步：在固定宿主和浏览器中测试空规格、预算截断、恶意图形、会话切换、重复交互和发送失败，并记录实际消息及可访问性。

**分析版本**

- **仓库**：[omdsh-dev/dsh-genui](https://github.com/omdsh-dev/dsh-genui)
- **版本号**：0.15.0（[固定提交 e00bdcf](https://github.com/omdsh-dev/dsh-genui/tree/e00bdcfbf7d4492afc95d5e52af350d6b68882c6)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出用隔离假会话对照动作投递与会话身份，仍需验证。

在固定宿主和浏览器中测试空规格、预算截断、恶意图形、会话切换、重复交互和发送失败，并记录实际消息及可访问性。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 21 | 4909 | — | — | 88277 |
| .mts | source | 2 | 707 | 543 | 136 | — |
| .mjs | source | 39 | 6275 | 5610 | 513 | — |
| .mjs | example | 6 | 583 | 519 | 49 | — |
| .mjs | test | 14 | 1337 | 1301 | 27 | — |
| .js | source | 1 | 466 | 253 | 234 | — |
| .ts | source | 98 | 22504 | 18389 | 3203 | — |
| .tsx | source | 39 | 10235 | 8019 | 1804 | — |
| .ts | test | 59 | 9473 | 8111 | 577 | — |
| .md | test | 2 | 64 | — | — | 542 |
| .tsx | test | 102 | 18551 | 16135 | 997 | — |

</details>

**活跃度**

[![Issue 未关闭 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=12&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-genui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 62](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=62&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-genui/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)

暂未获取：近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查生成式界面的接入、渲染、会话动作和安全边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要生成式界面，相对 Markdown 和手工界面有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在 DSH 对话中查看结构化结果、筛选或填写表单的用户；Markdown 可以展示文本和表格，手工应用能提供稳定交互，本组件让模型按组件规格生成嵌入对话的界面，减少为一次性任务单独开发界面的需要。README.md:32-34 是作者对能力与安全的描述，不是用户收益或全面安全的独立验证；交互质量、可访问性与用户节省时间未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:32-34](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/README.md#L32-L34)

作者描述对话内交互式界面。

```text
`dsh-genui` turns DeepSeek Harness (DSH) assistant replies into **safe, fully interactive UI surfaces**.

Ask “How are this month’s orders doing?”, and instead of plain text or raw code blocks, the response streams out an **interactive sortable data table**, **audio/video players**, **draggable function plots**, **self-grading quizzes**, or a **persistent workspace dock** — all embedded seamlessly within the conversation.
```

**依据 2 · 源码核查**：[src/plugin/tool.ts:205-211](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/src/plugin/tool.ts#L205-L211)

render_ui 描述组件树和动作。

````text
export function createRenderUiTool(): ToolDefinition {
  return {
    name: 'render_ui',
    description:
      'Render an interactive UI card in the conversation tool row by passing a GenUI spec (a white-listed component tree; the same vocabulary as the ```dsh-ui fence, see the system prompt). '
      + 'Use it when the user asks for a structured panel, dashboard, or form that belongs in the tool row rather than inline in the reply. '
      + 'The card is interactive client-side (tabs, buttons, inputs, switches); components carrying an "action" field send [genui-action] back to you when the user interacts, and you should re-render the updated UI.',
````

#### 缺口

- 缺少固定版本宿主和浏览器运行验证
  **影响**：无法证明交互、隔离与渲染在真实配置下成立
  **进一步探讨**：隔离宿主运行并检查会话和恶意内容边界

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型 spec 如何验证、展示并支持回放？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

src/plugin/index.ts:216-248 安装系统提示和反馈逻辑，在 tools 可用时注册 render_ui 与 validate_dsh_ui，并按依赖生命周期注册资源路由。tool.ts:205-249 处理 spec，invalid 时返回或抛错，将可渲染结果放入 presentationMeta，供客户端呈现和回放；client/index.tsx:135-159 安装围栏渲染并在 render_ui 工具视图读取结果元数据。guard.ts:2071-2081 明确有意预算尾部裁剪也可渲染，故状态 rendered 不等于所有原始内容完整展示。未运行浏览器或宿主。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin/index.ts:216-248](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/src/plugin/index.ts#L216-L248)

提示、工具和资源路由按服务注册。

<details>
<summary>查看原文（33行）</summary>

```text
export function apply(ctx: Context, config?: GenuiPluginConfig): void {
  installDshGoNative(ctx)
  const renderUiToolEnabled = config?.renderUiTool !== false
  ctx.systemPrompt.section({
    name: 'genui:fence',
    order: ctx.systemPrompt.getSectionOrder('STRUCTURED_OUTPUT'),
    text: renderUiToolEnabled ? GENUI_SECTION_TEXT : GENUI_SECTION_TEXT.replace(`${RENDER_UI_TOOL_GUIDANCE}\n`, ''),
  })
  installFenceFeedback(ctx, config?.fenceFeedback !== false, renderUiToolEnabled)
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
  })

  ctx.inject(['skills'], (skillCtx) => {
    skillCtx.skills.registerProvider(() => bundledSkillProvider())
  })

  // webServer.register returns a raw disposer, so an explicit effect binds the
  // route to the dependency fiber instead of leaving it in the host route table.
  ctx.inject(['webServer'], (webCtx) => {
    const webServer = webCtx.reflect.get('webServer') as { register(route: unknown): () => void }
    webCtx.effect(
      () => webServer.register({ kind: 'prefix', path: ASSET_ROUTE_PATH, handler: serveGenuiAsset }),
      'dsh-genui: asset route',
    )
```

</details>

**依据 2 · 源码核查**：[src/plugin/tool.ts:205-249](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/src/plugin/tool.ts#L205-L249)

处理规格并产生展示元数据和结果。

<details>
<summary>查看原文（45行）</summary>

````text
export function createRenderUiTool(): ToolDefinition {
  return {
    name: 'render_ui',
    description:
      'Render an interactive UI card in the conversation tool row by passing a GenUI spec (a white-listed component tree; the same vocabulary as the ```dsh-ui fence, see the system prompt). '
      + 'Use it when the user asks for a structured panel, dashboard, or form that belongs in the tool row rather than inline in the reply. '
      + 'The card is interactive client-side (tabs, buttons, inputs, switches); components carrying an "action" field send [genui-action] back to you when the user interacts, and you should re-render the updated UI.',
    parameters: RENDER_UI_PARAMETERS,
    output: {
      schema: RENDER_UI_OUTPUT_SCHEMA,
      render(_args: unknown, value: JsonValue): ContentBlock[] {
        return [{ type: 'text', text: String(value) }]
      },
      presentationMeta(args: unknown): JsonValue {
        // The browser toolview reads the repaired spec from result meta. The
        // spec is JSON-safe by construction (only string/number/boolean/array
        // fields after repair), so the widening cast is lossless.
        const processed = processRenderableValue(specOf(args))
        if (!isRenderableProcess(processed) || processed.spec === null) return null
        const nativeView = toDshGoView(processed.spec)
        // Keep the original root fields for existing web clients and replay.
        // dsh-go reads only the namespaced, read-only native projection.
        return (nativeView === null ? processed.spec : {
          ...processed.spec, 'dsh-go/view': nativeView,
        }) as unknown as JsonValue
      },
    },
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
````

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:135-159](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/src/client/index.tsx#L135-L159)

围栏及工具视图挂接。

<details>
<summary>查看原文（25行）</summary>

```text
  console.info('[genui] client active; fence-channel=dom')
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
```

</details>

**依据 4 · 源码核查**：[src/client/guard.ts:2071-2081](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/src/client/guard.ts#L2071-L2081)

受限预算裁剪可渲染。

<details>
<summary>查看原文（11行）</summary>

```text
/** Return whether the only process errors describe an intentional budget tail cut. */
export function isIntentionalBudgetCut(processed: GenuiProcessResult): boolean {
  return processed.errors.length > 0
    && processed.errors.every(error => error.startsWith('spec exceeds ') || error.startsWith('repair dropped '))
    && processed.renderedNativeCount === GENUI_LIMITS.maxNodes
    && processed.declaredNativeCount === GENUI_LIMITS.maxNodes + 1
}

/** Decide whether a repaired spec is safe to expose to any GenUI renderer. */
export function isRenderableProcess(processed: GenuiProcessResult): boolean {
  return processed.spec !== null && (processed.errors.length === 0 || isIntentionalBudgetCut(processed))
```

</details>

#### 缺口

- 缺少固定版本宿主和浏览器运行验证
  **影响**：无法证明交互、隔离与渲染在真实配置下成立
  **进一步探讨**：隔离宿主运行并检查会话和恶意内容边界

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 界面操作如何回到模型，失败和权限边界是什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

src/client/index.tsx:51-70 根据 sessionId 取得 scoped conversation，将 action 和 JSON payload 作为后续消息发送；103-112 对内联操作同样按会话发送。服务不存在或发送失败时动作丢弃，界面仍可交互。它是触发后续模型回合，不是独立的持久业务事务或对外执行确认；payload 可能含用户输入，后续模型如何使用由宿主和工具权限决定。未验证多会话切换、重试或真实发送结果。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:51-70](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/src/client/index.tsx#L51-L70)

作用域 conversation 发送及失败处理。

<details>
<summary>查看原文（20行）</summary>

```text
/** Session panel action loop: same [genui-action] contract as inline fences,
 * routed through the scoped conversation send (queued user message). The
 * prompt asks the model to re-run render_ui so the panel updates in place. */
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
```

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:103-112](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/src/client/index.tsx#L103-L112)

内联动作发送及失败处理。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

#### 缺口

- 缺少固定版本宿主和浏览器运行验证
  **影响**：无法证明交互、隔离与渲染在真实配置下成立
  **进一步探讨**：隔离宿主运行并检查会话和恶意内容边界

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何约束生成内容和资源，边界是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

src/client/genui-runtime/limits.ts:1-10 定义树深最多 8、节点最多 200 和字符串上限；guard.ts:2371-2374 检查节点深度。SVG 组件在 src/client/blocks/svg.tsx:43-65 使用图片模式而非把模型标记注入宿主 DOM；mermaid-core.ts:48 和 107-115 使用 strict 并对结果调用 assertSafeSvg。它们是具体防护而不是全组件安全证明：图表、链接、媒体及浏览器依赖仍有更广的攻击面，缺少本次对抗性运行。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/genui-runtime/limits.ts:1-10](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/src/client/genui-runtime/limits.ts#L1-L10)

组件深度、节点和字符串上限。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/client/guard.ts:2371-2374](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/src/client/guard.ts#L2371-L2374)

深度检查。

```text
function validateNode(value: unknown, depth: number, at: string, errors: string[], walk: Walker): void {
  if (depth > GENUI_LIMITS.maxDepth) {
    errors.push(`${at}: exceeds max depth ${GENUI_LIMITS.maxDepth}`)
    return
```

**依据 3 · 源码核查**：[src/client/blocks/svg.tsx:43-65](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/src/client/blocks/svg.tsx#L43-L65)

SVG 作为图片展示。

<details>
<summary>查看原文（23行）</summary>

```text
export function SvgNode({ node }: { node: GenuiSvg }) {
  const oversized = node.code.length > GENUI_LIMITS.maxCode
  const src = useMemo(() => oversized ? null : imageSource(node.code), [node.code, oversized])
  const [failedSource, setFailedSource] = useState<string | null>(null)
  return (
    <div data-genui-svg>
      {node.title !== undefined && <div className={css.echartTitle}>{renderInline(node.title)}</div>}
      {src === null || failedSource === src ? (
        <div>
          <div role="status">{oversized
            ? t('block.svgTooLong', { actual: node.code.length, max: GENUI_LIMITS.maxCode })
            : t('block.svgError')}</div>
          {!oversized && <pre style={{ overflow: 'auto', maxHeight: 400 }}><code>{node.code}</code></pre>}
        </div>
      ) : (
        // SVG stays in image mode: never inject model markup into the host DOM
        // or expose this URL through a link, iframe, object, or embed.
        <img
          key={src}
          src={src}
          alt={node.title ?? t('block.svgLabel')}
          style={{ display: 'block', width: '100%', height: node.height ?? 'auto', maxHeight: 800, objectFit: 'contain' }}
          onError={() => { setFailedSource(src) }}
```

</details>

**依据 4 · 源码核查**：[src/client/mermaid-core.ts:107-115](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/src/client/mermaid-core.ts#L107-L115)

Mermaid 结果检查。

```text
async function renderInto(m: typeof import('mermaid'), id: string, code: string, container: HTMLDivElement): Promise<string> {
  container.style.position = 'fixed'
  container.style.left = '-100000px'
  container.style.top = '0'
  container.style.margin = '0'
  document.body?.appendChild(container)
  try {
    const { svg } = await m.default.render(id, code, container)
    assertSafeSvg(svg)
```

#### 缺口

- 缺少固定版本宿主和浏览器运行验证
  **影响**：无法证明交互、隔离与渲染在真实配置下成立
  **进一步探讨**：隔离宿主运行并检查会话和恶意内容边界

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖、成本和停止条件是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

package.json:79-94 列出 DSH Cordis 和多个宿主 peer 版本；源码接入工具、资源服务、客户端 slots 和会话服务，具体宿主配置决定能力是否存在。额外的生成、校验反馈和用户操作可能增加模型回合及推理成本；复杂可视化也增加浏览器资源和人工核验。建议先在隔离宿主用非敏感输入试用，若渲染缺项、会话目标不明或输出未经核实，停止依赖并退回纯文本。价格、兼容性和性能未实测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:79-94](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/package.json#L79-L94)

宿主 peer 依赖范围。

<details>
<summary>查看原文（16行）</summary>

```text
    "mdast-util-from-markdown": "2.0.3",
    "react": "^18.3.1"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1 || ^4.0.6-alpha.1",
    "@deepseek-ai/dsh-agent": "^0.2.0-rc.1 || ^0.2.1-rc.1 || ^0.2.2-alpha.2",
    "@deepseek-ai/dsh-agent-loop": "^0.2.0-rc.1 || ^0.2.1-rc.1 || ^0.2.2-alpha.2",
    "@deepseek-ai/dsh-api-session-controller": "^0.2.0-rc.1 || ^0.2.1-rc.1 || ^0.2.2-alpha.2",
    "@deepseek-ai/dsh-client-store": "^0.2.0-rc.1 || ^0.2.1-rc.1 || ^0.2.2-alpha.2",
    "@deepseek-ai/dsh-client-ui-chat": "^0.2.0-rc.1 || ^0.2.1-rc.1 || ^0.2.2-alpha.2",
    "@deepseek-ai/dsh-client-ui-conversation": "^0.2.0-rc.1 || ^0.2.1-rc.1 || ^0.2.2-alpha.2",
    "@deepseek-ai/dsh-client-ui-input-trigger": "^0.2.0-rc.1 || ^0.2.1-rc.1 || ^0.2.2-alpha.2",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.2.0-rc.1 || ^0.2.1-rc.1 || ^0.2.2-alpha.2",
    "@deepseek-ai/dsh-client-ui-renderer": "^0.2.0-rc.1 || ^0.2.1-rc.1 || ^0.2.2-alpha.2",
    "@deepseek-ai/dsh-client-ui-session": "^0.2.0-rc.1 || ^0.2.1-rc.1 || ^0.2.2-alpha.2",
    "@deepseek-ai/dsh-client-ui-slots": "^0.2.0-rc.1 || ^0.2.1-rc.1 || ^0.2.2-alpha.2",
```

</details>

**依据 2 · 源码核查**：[src/plugin/index.ts:202-224](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/src/plugin/index.ts#L202-L224)

围栏修正可消耗模型步数且可关闭。

<details>
<summary>查看原文（23行）</summary>

```text
export interface GenuiPluginConfig {
  /**
   * 在最终 dsh-ui 围栏无法渲染的回合中请求模型发送一次修正版（issue #160）。
   * 默认开启，设置为 false 可以关闭同回合围栏修正。GenUI 回合的 reasoning-only 响应仍会交给宿主重试策略处理。
   * 每回合和每个围栏正文最多请求一次，子代理不触发，每次修正请求会消耗模型步数。
   */
  fenceFeedback?: boolean

  /**
   * 是否注册 render_ui 模型工具。默认开启，设置为 false 时关闭；不影响 validate_dsh_ui 和 dsh-ui 围栏渲染。
   */
  renderUiTool?: boolean
}

export function apply(ctx: Context, config?: GenuiPluginConfig): void {
  installDshGoNative(ctx)
  const renderUiToolEnabled = config?.renderUiTool !== false
  ctx.systemPrompt.section({
    name: 'genui:fence',
    order: ctx.systemPrompt.getSectionOrder('STRUCTURED_OUTPUT'),
    text: renderUiToolEnabled ? GENUI_SECTION_TEXT : GENUI_SECTION_TEXT.replace(`${RENDER_UI_TOOL_GUIDANCE}\n`, ''),
  })
  installFenceFeedback(ctx, config?.fenceFeedback !== false, renderUiToolEnabled)
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:51-70](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/src/client/index.tsx#L51-L70)

动作形成后续消息。

<details>
<summary>查看原文（20行）</summary>

```text
/** Session panel action loop: same [genui-action] contract as inline fences,
 * routed through the scoped conversation send (queued user message). The
 * prompt asks the model to re-run render_ui so the panel updates in place. */
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
```

</details>

#### 缺口

- 缺少固定版本宿主和浏览器运行验证
  **影响**：无法证明交互、隔离与渲染在真实配置下成立
  **进一步探讨**：隔离宿主运行并检查会话和恶意内容边界

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何验证操作只进入预期会话且不伪装为完成事务？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

假设同一界面在两个固定会话中分别触发操作时，只有对应的 scoped conversation 收到包含动作和 payload 的消息；切换会话、发送失败或重放时不得产生跨会话投递或自动重发。Q03 的代码仅表明按 sessionId 查找，不证明并发和宿主行为。可在隔离宿主以无副作用假会话记录发送、切换和失败，以会话 ID 及消息数核对；任何串会话或重复发送均否定假设。这个实验未运行，且不证明后续模型所调用工具安全。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:51-70](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/src/client/index.tsx#L51-L70)

面板动作按 sessionId 取得作用域。

<details>
<summary>查看原文（20行）</summary>

```text
/** Session panel action loop: same [genui-action] contract as inline fences,
 * routed through the scoped conversation send (queued user message). The
 * prompt asks the model to re-run render_ui so the panel updates in place. */
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
```

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:103-112](https://github.com/omdsh-dev/dsh-genui/blob/e00bdcfbf7d4492afc95d5e52af350d6b68882c6/src/client/index.tsx#L103-L112)

内联动作按会话发送。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

#### 缺口

- 缺少固定版本宿主和浏览器运行验证
  **影响**：无法证明交互、隔离与渲染在真实配置下成立
  **进一步探讨**：隔离宿主运行并检查会话和恶意内容边界

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
