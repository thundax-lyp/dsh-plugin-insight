# dsh-genui

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[24cea2d](https://github.com/omdsh-dev/dsh-genui/tree/24cea2dbf4161ecd326913094680a73d1f1b6261)

<!-- BEGIN META -->
[![GitHub ★ 785](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=785&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-genui) [![npm 30d 39,865](https://img.shields.io/static/v1?label=npm+30d&message=39%2C865&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@changfenhuang/dsh-genui) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@changfenhuang/dsh-genui)
<!-- END META -->

> **功能**：把 DSH 助手回复中的声明式组件渲染为交互表格、图表、表单和会话面板。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02)显示声明式组件将部分视图变化留在浏览器，并复用会话动作形成交互回路；图形引擎与预置样式不是数据正确性或业务完成的证明。

> **主要限制**：[Q03](#research-q03)显示localStorage可失败和被LRU淘汰，send失败也不必让控件停用。能交互不代表动作已接收，浏览器状态不是业务账本，秘密字段保护也不能被泛化成全路径保证。

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
  - [Q01 · 回复内交互解决什么任务？](#detail-section-11)
  - [Q02 · 生成、渲染与回传如何串联？](#detail-section-12)
  - [Q03 · 输入状态持久化和动作失败可以承诺什么？](#detail-section-13)
  - [Q04 · 怎样低风险比较界面价值？](#detail-section-14)
  - [Q05 · 动作可见状态是否减少无反馈重试？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要对公开或脱敏数据做本地筛选、参数探索和测验的DSH用户，可比较组件与普通Markdown。

普通Markdown与静态图表更简单；只有确实需要重复局部交互时才值得承担组件格式、浏览器状态和动作回传维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 围栏组件 | 内联表格/图形等交互 | 数据正确性另核对 |
| 会话动作 | 将交互字段发回模型 | send失败不等于业务完成 |
| 交互缓存 | 刷新恢复部分状态 | localStorage失败/LRU淘汰 |
| 校验工具 | 诊断组件规格 | 不等于秘密全路径安全认证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配DSH与浏览器客户端 | 是 | 提示、slots和会话 | 围栏退为代码或不注册 |
| 正确scoped包及资源 | 是 | 渲染组件 | 缺资源降级 |
| 模型会话 | 生成/动作必需 | JSON与回传 | 本地状态不能代替 |
| 浏览器存储 | 持久化需要 | 恢复交互 | 失败仅内存，可能丢失 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 安装 | 固定正确包、重启刷新 | 新会话可渲染 |
| 试表 | 用户提供已知正确数据 | 排序筛选保持语义 |
| 动作 | 核对回传所属会话 | 无反馈先查会话 |
| 退出 | 保存关键结果并禁用 | 回普通文本/手工流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 包及图形资源未知 | 匹配宿主、生成正确JSON | scoped包需正确 |
| 持续 | JSON token、修正和动作模型费用未知 | 核对数据与交互 | 本地操作不等于全部免费 |
| 恢复 | 状态重建和重发可能成本未知 | 核对发送/存储阶段 | LRU及quota可丢状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 交互 | 声明式组件及同会话回传 | 最终用户任务正确率 |
| 本地状态 | 浏览器缓存及LRU | 永久保留或跨设备恢复 |
| 成本收益 | 部分交互可本地完成 | 总token/修正及节时 |

> **思考**：[Q03](#research-q03)显示localStorage可失败和被LRU淘汰，send失败也不必让控件停用。能交互不代表动作已接收，浏览器状态不是业务账本，秘密字段保护也不能被泛化成全路径保证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02)显示声明式组件将部分视图变化留在浏览器，并复用会话动作形成交互回路；图形引擎与预置样式不是数据正确性或业务完成的证明。

[Q03](#research-q03)submission成员冲突/秘密字段诊断与有界localStorage值得借鉴；可选服务注入和effect disposer适合插件重载。移植需保留会话所有权、格式失败退回与动作阶段语义，不能把白名单提示当安全沙箱。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)显示localStorage可失败和被LRU淘汰，send失败也不必让控件停用。能交互不代表动作已接收，浏览器状态不是业务账本，秘密字段保护也不能被泛化成全路径保证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用已知正确公开小表试排序/筛选，保留原数据和文本退路；不收集密码、key等秘密，不把本地状态作唯一记录。动作无反馈或状态丢失时先核对会话而非重复点击。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持围栏接线、本地状态和会话动作发送；未运行宿主或全面验证秘密/导出路径，动作状态设计仅为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/plugin/index.ts、src/client/index.tsx、src/client/interaction-store.ts、src/client/submission-registry.ts、src/client/fence-render.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定host/client注册、围栏pipeline、会话动作、submission与localStorage源码级核查；未执行宿主、目标测试或全组件安全审计。
- 下一步：固定数据与模型比较本地操作、格式修正回合及动作失败可理解性，秘密路径先静态追踪；本轮不执行。

**分析版本**

- **仓库**：[omdsh-dev/dsh-genui](https://github.com/omdsh-dev/dsh-genui)
- **版本号**：0.15.0（[固定提交 24cea2d](https://github.com/omdsh-dev/dsh-genui/tree/24cea2dbf4161ecd326913094680a73d1f1b6261)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出区分发送、入队与失败的可见动作状态假设，先核对现组件和宿主结果语义，再用busy/gone/断网比较重复请求；入队不能称业务完成。

固定数据与模型比较本地操作、格式修正回合及动作失败可理解性，秘密路径先静态追踪；本轮不执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 4358 | — | — | 79719 |
| .mts | source | 2 | 707 | 543 | 136 | — |
| .mjs | source | 29 | 4953 | 4441 | 380 | — |
| .mjs | example | 5 | 516 | 465 | 39 | — |
| .mjs | test | 14 | 1330 | 1294 | 27 | — |
| .js | source | 1 | 466 | 253 | 234 | — |
| .ts | source | 81 | 20163 | 16423 | 2920 | — |
| .tsx | source | 30 | 8840 | 6854 | 1642 | — |
| .ts | test | 49 | 8155 | 6889 | 531 | — |
| .tsx | test | 83 | 15831 | 13775 | 857 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-genui/issues?q=is%3Aissue+is%3Aopen) [![近30天关闭 57](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=57&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-genui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)

暂未获取：近30天新建。

统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：生成UI如何在DSH里区分本地交互与模型动作，失败和持久化影响何种采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 回复内交互解决什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要查看表格、比较参数、做小测验或调节图形的DSH用户，合格结果是数据可追溯且交互状态符合用户意图的界面。相比Markdown表格和重新提问，局部排序、筛选或判分可以由浏览器完成，避免每个视图变化都再调用模型；但图表漂亮不证明数字或答案正确。项目通过声明式dsh-ui JSON和预置组件限制输出形态，非让模型任意写页面脚本。作者“safe”“sub-millisecond”措辞未在本轮全面验证，成熟图表引擎也不应计为原创。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:65-72](https://github.com/omdsh-dev/dsh-genui/blob/24cea2dbf4161ecd326913094680a73d1f1b6261/README.md#L65-L72)

文本与本地交互/模型事件的作者对比。

```text
## ✨ Before vs. After

| Scenario | Plain Text Response | With dsh-genui |
| :--- | :--- | :--- |
| **Business Overview** | “Revenue this month is ¥128,430 (+12.4% MoM); conversion rate is slightly dipping…” | One line of concise prose + 3 stat cards (revenue/orders/conversion), a trend chart, and a progress bar rendered right beside it. |
| **Data Exploration** | Type another prompt to ask the model to re-sort or filter. | Click table headers to **sort numbers locally**, or use the search box to filter rows in real time. |
| **Parameter Tuning** | Re-prompt the model and wait for another full generation. | Drag sliders to see curves update in **sub-millisecond speed** with animation preview. |
| **Next Actions** | Copy text and manually perform follow-up tasks elsewhere. | Click interactive action buttons (e.g. “Refresh”, “Switch View”) to trigger **bidirectional model event loops**. |
```

**依据 2 · 源码核查**：[src/plugin/index.ts:98-129](https://github.com/omdsh-dev/dsh-genui/blob/24cea2dbf4161ecd326913094680a73d1f1b6261/src/plugin/index.ts#L98-L129)

组件白名单、规模、本地优先与秘密提示规则。

<details>
<summary>查看原文（32行）</summary>

```text
Allowed \`type\` values; the \`genui\` skill, when available, carries the full content→component mapping and per-component field details:

- 布局: text · row · col · grid · card · carousel · divider · spacer · hero（封面块，一条回答最多一个）
- 展示: badge · stat · progress · list · table · keyvalue · timeline · file-tree · breadcrumb · callout · steps · diff · json · code · copy · avatar · image · image-group · audio · video · icon · blocks · arrow
- 图表: chart {"kind":"bars|line|donut","data":[{"label":"...","value":n}]}（series：bars 分组/堆叠 / line 多序列） · echart (preset 名或 option 直通，清单见 skill) · plot (函数图) · svg (单图预览)
- 交互: button · input · textarea · select · checkbox · switch · slider · radio · submit · quiz · link · tabs · accordion（row.justify / col.width / card.flat 见图元）
- 高级: mermaid (流程图/时序/甘特/ER 等，关键字见 skill) · diagram (架构/流程图) · scene3d (3D WebGL)

**默认就该出 UI**：出现下列情况至少出一个围栏：
- ≥3 条并列要点 → \`list\`；数字对比 → \`table\`；指标/进度/状态 → \`stat\`/\`progress\`/\`badge\`
- 步骤/时间线 → \`steps\`/\`timeline\`/\`mermaid\`；架构/流程 → \`diagram\` 或 \`mermaid\`；单条风险/结论摘要 → \`callout\`；代码/改动 → \`code\`/\`diff\`/\`json\`
- 行内富文本：支持公式、\`code\`、加粗、高亮、链接；禁用 Markdown table 与 fenced code，改用 table/code/diff/json。
- 默认无卡：卡片用于并排项、数据对象或需底色的风险清单。

**发回答前最后自检一次**：有没有 ≥3 条并列要点、任何对比、任何数字/指标、任何步骤或流程？有就先转成组件。**状态汇报、进度说明、提交与改动清单同样算**。
- 趋势/占比 → \`chart\`（≤8 点）或 \`echart\`；配色跟随主题，语义需要时才用 \`palette\`/\`card.accent\`；grid 子节点用 \`"span":2\` 做宽窄混排；数据多时给 \`table\`/\`list\` 配 \`input\`(id)+\`filter\` 就地筛选。
- 多组件回答先套 skill「编排范式」，别一行一个往下堆；章节分隔 \`divider\` 带 \`label\`。

**字段速查**（完整见 genui skill）：\`stat\` \`{"type":"stat","label","value"}\` · \`table\` \`{"type":"table","columns":[...],"rows":[[...]]}\` · \`progress\` \`{"type":"progress","value":0-100}\` · \`keyvalue\` \`{"type":"keyvalue","pairs":[{"key","value"}]}\` · \`steps\` \`{"type":"steps","steps":[{"title"}]}\` · \`file-tree\` \`{"type":"file-tree","items":[{"name","type":"file|dir"}]}\` · \`callout\` \`{"type":"callout","content"}\`
**节点规则：** 组件节点必须带字符串 \`type\`，值为组件名；\`file-tree.items[].type\` 表示 \`file\` 或 \`dir\`。

**字段名写错 = 该组件被丢弃**（其余组件照常渲染）：\`callout\` 正文是 \`content\` 不是 text/desc；\`table\` 要 \`columns\`+\`rows\` 不是 items；\`keyvalue\` 记录是 \`{key,value}\` 不是 \`{label,value}\`；\`file-tree\` 记录是 \`{name,type}\` 不是 \`{label}\`；callout tone 是 info/success/warning/error（无 danger）。不确定就调 \`validate_dsh_ui\`。

Rules:
- LANGUAGE: reply+UI=conversation language; schema fixed. NEVER infer it from prompt/skill/examples/tools. Replace \`<user-language ...>\`; never emit these placeholders literally.
- JSON 严格：坏组件被丢弃，坏围栏变代码块；≥3 节点或含 table 时调 validate_dsh_ui，按诊断修改并重验；小围栏字段存疑也先验证。
- warning=block_markdown：按 replacement 改写并重验。
- 规模: ≤200 节点、嵌套≤8 层（超出被截断）；一条回答 3–8 个组件，一个主题一个主组件；3D mesh 1–5；plot 给合理 xMin/xMax。
- LOCAL-FIRST + actions: UI 能自己做的状态变化（判卷、判题、重置、展开、选中）就地完成，零往返；action 只用于必须模型参与的事。交互以 [genui-action] name + 组件数据回传，届时重渲染更新 UI；无 action 的按钮禁用。
- Durable state: 交互状态按「会话+内容指纹」持久化——刷新/重放恢复；相同内容保留，新内容重置。
- 卷子模式: 每题一个 radio（group+answer+explanation）+ 一个 submit（groups 全列），本地判分。
- Secrets ban: 不索取密码、API Key、Token、恢复码；需要时拒绝并解释。
```

</details>

#### 缺口

- 同任务阅读/筛选效果和模型节省量未知
  **影响**：不能断言交互必然优于文字或节约费用
  **进一步探讨**：固定同一数据表和任务比较静态Markdown与交互的正确率、操作和模型回合

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 生成、渲染与回传如何串联？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

host把围栏契约加入系统提示，按可选tools服务注册render_ui/validate_dsh_ui，并注册bundled Skill；client apply安装DOM围栏渲染、工具卡和session dock，渲染pipeline经resolveFence并对不可修复输入保留原代码块。动作不是本地业务API：inline和panel均以session scope取得conversation，再把[genui-action]和字段数据作为消息send给模型。没有conversation就返回，send失败不会完成业务。依赖匹配DSH客户端slots/sessions/systemPrompt、浏览器存储及相应按需图形资源；只安装Node依赖不等于注册插件。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin/index.ts:216-245](https://github.com/omdsh-dev/dsh-genui/blob/24cea2dbf4161ecd326913094680a73d1f1b6261/src/plugin/index.ts#L216-L245)

提示、工具、Skill及资源路由生命周期注册。

<details>
<summary>查看原文（30行）</summary>

```text
export function apply(ctx: Context, config?: GenuiPluginConfig): void {
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
```

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:103-138](https://github.com/omdsh-dev/dsh-genui/blob/24cea2dbf4161ecd326913094680a73d1f1b6261/src/client/index.tsx#L103-L138)

真实inline动作send与DOM安装回调。

<details>
<summary>查看原文（36行）</summary>

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
}

/** Cordis client entry: install the fence renderer on boot, the keyed
 * toolview for the render_ui tool, and the session panel dock; returning the
 * disposers lets cordis tear all registrations down on plugin unload. */
export function apply(ctx: Context): () => void {
  // Provider 提交所属线程身份和专属操作路由；DOM renderer 继续忽略这些 surface。
  ctx.inject(['genuiSidechat'], scope => {
    scope.effect(() => installSidechatAdapter(scope.get('genuiSidechat') as Partial<SidechatSurfaceService> | undefined), 'genui: host sidechat surface')
  })
  // BetterSidebar 保留现有 service，并沿用通用 sidechat surface contract。
  ctx.inject(['betterSidebar'], scope => {
    scope.effect(() => installSidechatAdapter(scope.get('betterSidebar') as Partial<SidechatSurfaceService> | undefined), 'genui: sidechat surface')
  })
  // Language: follow the host's DSH language preference when the deployment
  // ships the locale service, otherwise fall back to browser detection. Read
  // OPTIONALLY (never declared in `inject`) so a host without the
  // service still renders — a declared-but-absent service would park the
  // fiber forever and kill all GenUI rendering.
  const localeDispose = bridgeHostLocale(ctx)
  const fileLinkAvailability = createFileLinkAvailability(ctx as unknown as FileLinkCordisContext)
  console.info('[genui] client active; fence-channel=dom')
  const disposers: Array<() => void> = [
    localeDispose,
    installDomFenceRenderer(ctx, (sessionId, action, payload) => sendInlineGenuiAction(ctx, sessionId, action, payload), fileLinkAvailability),
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:54-69](https://github.com/omdsh-dev/dsh-genui/blob/24cea2dbf4161ecd326913094680a73d1f1b6261/src/client/index.tsx#L54-L69)

panel通过同会话send而非业务提交。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/client/fence-render.tsx:1-16](https://github.com/omdsh-dev/dsh-genui/blob/24cea2dbf4161ecd326913094680a73d1f1b6261/src/client/fence-render.tsx#L1-L16)

围栏解析与保留原代码块策略。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * The dsh-ui fence render pipeline used by the DOM observer and renderer tests.
 * An unrepairable body returns `null` so the stock code block stays visible,
 * with {@link FenceDiagnostic} mounted above it (issue #158).
 */
import { Fragment, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type Key, type ReactNode } from 'react'
import { CodeBlock } from '@deepseek-ai/dsh-client-ui-primitives'
import { codeBlockLabels } from './primitive-labels.ts'
import { t, useT } from './i18n/index.ts'
import { ErrorBoundary } from './ErrorBoundary.tsx'
import { ExportableGenuiBlock } from './artifact/ExportableGenuiBlock.tsx'
import { fenceStateKey } from './interaction-store.ts'
import { applyPanelOperation, diagnosePanelBudget, getPanelOperationError, subscribePanel, type PanelOperationStatus } from './panel-store.ts'
import type { GenuiSpec } from './spec.ts'
import { describeJsonFailure, isCompleteJson } from '../shared/fence-repair.ts'
import { resolveFence, resolveFenceSpec, type FenceResolution } from '../shared/fence-resolve.ts'
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 输入状态持久化和动作失败可以承诺什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

interaction-store将状态存在localStorage，最多200块LRU；存储损坏返回空状态，quota/privacy异常被捕获后内存交互仍继续，刷新可能丢状态。因此“持久”是有条件、可淘汰的浏览器缓存，不是业务账本。submission registry识别password input、拒绝submit.groups要求秘密字段并不将其计为已答，这是比纯提示更具体的保护，但本轮未穷尽所有payload/导出路径，不能承诺从不泄密。inline send失败被catch丢弃，panel只日志且控件仍可交互；用户看到按钮可点不代表模型已接收或任务成功，重复点击可能形成多个请求。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/interaction-store.ts:30-85](https://github.com/omdsh-dev/dsh-genui/blob/24cea2dbf4161ecd326913094680a73d1f1b6261/src/client/interaction-store.ts#L30-L85)

上限、存储异常降级和LRU淘汰。

<details>
<summary>查看原文（56行）</summary>

```text
const STORE_KEY = 'dsh.genui.interaction'
/** Max tracked blocks; LRU eviction keeps the store bounded. */
const MAX_BLOCKS = 200

interface StoreShape {
  /** Block keys in most-recently-written order (index 0 = newest). */
  order: string[]
  blocks: Record<string, BlockInteractionState>
}

function emptyStore(): StoreShape {
  return { order: [], blocks: {} }
}

function readStore(): StoreShape {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw === null) return emptyStore()
    const parsed = JSON.parse(raw) as Partial<StoreShape>
    if (!Array.isArray(parsed.order) || typeof parsed.blocks !== 'object' || parsed.blocks === null) {
      return emptyStore()
    }
    return { order: parsed.order.filter(k => typeof k === 'string'), blocks: parsed.blocks as Record<string, BlockInteractionState> }
  } catch {
    return emptyStore()
  }
}

function writeStore(store: StoreShape): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
  } catch {
    // Quota / privacy-mode failures are non-fatal: interaction stays live
    // in memory, only the persistence is lost.
  }
}

/** Load a block's durable state, or null when absent/corrupt. */
export function loadBlockState(stateKey: string): BlockInteractionState | null {
  if (stateKey === '') return null
  const store = readStore()
  return store.blocks[stateKey] ?? null
}

/** Save a block's durable state (LRU: touched keys move to the front). */
export function saveBlockState(stateKey: string, state: BlockInteractionState): void {
  if (stateKey === '') return
  const store = readStore()
  const order = store.order.filter(k => k !== stateKey)
  order.unshift(stateKey)
  const blocks = { ...store.blocks, [stateKey]: state }
  while (order.length > MAX_BLOCKS) {
    const evicted = order.pop()
    if (evicted !== undefined) delete blocks[evicted]
  }
  writeStore({ order, blocks })
```

</details>

**依据 2 · 源码核查**：[src/client/submission-registry.ts:75-108](https://github.com/omdsh-dev/dsh-genui/blob/24cea2dbf4161ecd326913094680a73d1f1b6261/src/client/submission-registry.ts#L75-L108)

秘密字段识别及非法submit引用诊断。

<details>
<summary>查看原文（34行）</summary>

```text
      case 'input':
      case 'textarea':
      case 'select':
      case 'slider':
        if (node.id === undefined) return
        member = { kind: 'field', key: node.id, fieldType: node.type, secret: node.type === 'input' && node.inputType === 'password' }
        keyPath = `${path}.id`
        break
      default:
        return
    }
    if (member === undefined) return
    const existing = members.get(member.key)
    if (existing !== undefined) {
      if (existing.kind !== 'checkbox' || member.kind !== 'checkbox') {
        diagnostics.push(`${keyPath} conflicts with ${paths.get(member.key)}: submission key '${member.key}' is already used`)
      } else {
        for (const [value, label] of member.choices) existing.choices.set(value, label)
      }
      return
    }
    members.set(member.key, member)
    paths.set(member.key, keyPath)
  })

  for (const { groups, path } of submits) {
    const seen = new Set<string>()
    groups.forEach((key, index) => {
      const at = `${path}.groups[${index}]`
      if (seen.has(key)) diagnostics.push(`${at}: duplicate submission member '${key}'`)
      seen.add(key)
      const member = members.get(key)
      if (member === undefined && !allowExternalGroups) diagnostics.push(`${at}: submit.groups references unknown submission member '${key}'`)
      else if (member?.kind === 'field' && member.secret) diagnostics.push(`${at}: submit.groups cannot require secret field '${key}'`)
```

</details>

**依据 3 · 源码核查**：[src/client/submission-registry.ts:119-129](https://github.com/omdsh-dev/dsh-genui/blob/24cea2dbf4161ecd326913094680a73d1f1b6261/src/client/submission-registry.ts#L119-L129)

秘密字段不被视为完成输入。

<details>
<summary>查看原文（11行）</summary>

```text
/** 根据当前交互状态判断一个 submission member 是否完成。 */
export function isSubmissionMemberAnswered(member: SubmissionMember, state: SubmitInteractionState): boolean {
  switch (member.kind) {
    case 'radio': return state.answers[member.key] !== undefined
    case 'checkbox': return state.multiAnswers[member.key]?.some(value => member.choices.has(value)) ?? false
    case 'field': {
      if (member.secret) return false
      if (!Object.hasOwn(state.fields, member.key)) return false
      const value = state.fields[member.key]
      return value !== undefined && value.trim() !== ''
    }
```

</details>

**依据 4 · 源码核查**：[src/client/index.tsx:54-69](https://github.com/omdsh-dev/dsh-genui/blob/24cea2dbf4161ecd326913094680a73d1f1b6261/src/client/index.tsx#L54-L69)

panel失败保留交互，仅日志。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[src/client/index.tsx:103-113](https://github.com/omdsh-dev/dsh-genui/blob/24cea2dbf4161ecd326913094680a73d1f1b6261/src/client/index.tsx#L103-L113)

inline发送失败被丢弃。

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

#### 缺口

- 全输入/导出路径秘密处理及按钮重复提交控制未全面审计
  **影响**：不能作为密码表单或关键业务提交界面
  **进一步探讨**：沿组件submit到payload/导出路径追踪秘密字段，核对重复点击及发送状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样低风险比较界面价值？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合公开或脱敏数据的展示、探索和小测验，先选择一张已知正确的小表，确认排序/筛选在本地完成及来源没有被组件隐藏。首次需匹配宿主和正确scoped包，生成JSON增加token与格式修正回合，重图形有浏览器下载/渲染负担；动作回传再调用模型，不能把本地交互零往返说成全部零费用。持续要核对数据、清楚浏览器LRU和失败状态；退出可禁用插件，历史围栏回到代码块，关键结果另存。若状态反复丢失、动作无反馈或表单索取秘密，停止使用该界面并回到普通文本/明确手工操作。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:78-114](https://github.com/omdsh-dev/dsh-genui/blob/24cea2dbf4161ecd326913094680a73d1f1b6261/README.md#L78-L114)

兼容范围、正确scope及安装注册要求。

<details>
<summary>查看原文（37行）</summary>

````text
### 1. Prerequisites

Ensure your environment meets the following requirements:
- **DSH Version**: `^0.2.0-rc.1 || ^0.2.1-rc.1` (verified against `dsh-v0.2.0-rc.1` and `dsh-v0.2.1-rc.3`)
- **pnpm on PATH**: The `dsh plugin` CLI requires pnpm. If missing: run `corepack enable` or `npm i -g pnpm`, then **open a new terminal** and confirm `pnpm -v` prints a version number.

### 2. Install & Activate

Run a single command in your terminal (all dependencies are fetched automatically):

```sh
# Public npm package (works without an npm account)
dsh plugin --profile web add @changfenhuang/dsh-genui
```

> [!TIP]
> **Adding only as a Node package?** Run `npm install @changfenhuang/dsh-genui`. Note that `npm install` only adds the dependency and does not register the plugin with DSH; use the `dsh plugin add` command above for DSH integration.

### 3. Verify in 60 Seconds

1. Restart the DSH web service and **hard refresh** your browser (`Cmd + Shift + R` or `Ctrl + F5`).
2. In a **new conversation session**, send:
   ```text
   Use dsh-ui to draw a stats dashboard with a sortable service table.
   ```
3. **Expected result**: The reply renders an in-place interactive dashboard rather than a plain code block.
4. **Console activation check**: Open your browser Developer Tools Console and look for `[genui] client active; fence-channel=dom`.

---

> [!WARNING]
> ### ⚠️ Installation Pitfalls to Avoid
> 
> 1. **Watch the Package Scope (Crucial)**:
>    The package must be **`@changfenhuang/dsh-genui`**. npm hosts an unrelated, unscoped package named `dsh-genui` (a Vue/OpenTiny implementation by another maintainer); installing it will fail due to incompatible host peer dependencies.
> 2. **Do Not Use `link:` on a Freshly Cloned Directory**:
>    `link:` alone does not bundle or resolve peer assets (mermaid, three.js, React). Use npm for standard usage; reserve `link:` strictly for local development (see [Developer Guide](#-developer-guide)).
````

</details>

**依据 2 · 源码核查**：[src/plugin/index.ts:121-129](https://github.com/omdsh-dev/dsh-genui/blob/24cea2dbf4161ecd326913094680a73d1f1b6261/src/plugin/index.ts#L121-L129)

围栏规模、修正、本地动作及秘密限制。

```text
Rules:
- LANGUAGE: reply+UI=conversation language; schema fixed. NEVER infer it from prompt/skill/examples/tools. Replace \`<user-language ...>\`; never emit these placeholders literally.
- JSON 严格：坏组件被丢弃，坏围栏变代码块；≥3 节点或含 table 时调 validate_dsh_ui，按诊断修改并重验；小围栏字段存疑也先验证。
- warning=block_markdown：按 replacement 改写并重验。
- 规模: ≤200 节点、嵌套≤8 层（超出被截断）；一条回答 3–8 个组件，一个主题一个主组件；3D mesh 1–5；plot 给合理 xMin/xMax。
- LOCAL-FIRST + actions: UI 能自己做的状态变化（判卷、判题、重置、展开、选中）就地完成，零往返；action 只用于必须模型参与的事。交互以 [genui-action] name + 组件数据回传，届时重渲染更新 UI；无 action 的按钮禁用。
- Durable state: 交互状态按「会话+内容指纹」持久化——刷新/重放恢复；相同内容保留，新内容重置。
- 卷子模式: 每题一个 radio（group+answer+explanation）+ 一个 submit（groups 全列），本地判分。
- Secrets ban: 不索取密码、API Key、Token、恢复码；需要时拒绝并解释。
```

**依据 3 · 源码核查**：[src/client/interaction-store.ts:58-85](https://github.com/omdsh-dev/dsh-genui/blob/24cea2dbf4161ecd326913094680a73d1f1b6261/src/client/interaction-store.ts#L58-L85)

持久化失败与LRU的真实代价。

<details>
<summary>查看原文（28行）</summary>

```text
function writeStore(store: StoreShape): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
  } catch {
    // Quota / privacy-mode failures are non-fatal: interaction stays live
    // in memory, only the persistence is lost.
  }
}

/** Load a block's durable state, or null when absent/corrupt. */
export function loadBlockState(stateKey: string): BlockInteractionState | null {
  if (stateKey === '') return null
  const store = readStore()
  return store.blocks[stateKey] ?? null
}

/** Save a block's durable state (LRU: touched keys move to the front). */
export function saveBlockState(stateKey: string, state: BlockInteractionState): void {
  if (stateKey === '') return
  const store = readStore()
  const order = store.order.filter(k => k !== stateKey)
  order.unshift(stateKey)
  const blocks = { ...store.blocks, [stateKey]: state }
  while (order.length > MAX_BLOCKS) {
    const evicted = order.pop()
    if (evicted !== undefined) delete blocks[evicted]
  }
  writeStore({ order, blocks })
```

</details>

#### 缺口

- 实际token、修正次数及用户操作节省未知
  **影响**：不能认定总体低成本
  **进一步探讨**：对同一数据和模型记录生成/修正/动作回合、浏览器资源及任务正确率

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 动作可见状态是否减少无反馈重试？

**研究主题**：新假设与验证

#### 完整回答

从send失败仍可交互推导未验证的动作状态假设：在会话范围内显示发送中、已入队、失败与可手动重试，并保留稳定交互ID供核对；“已入队”不能显示成业务办结。先检查其他action组件是否已有等价状态，再在会话busy/gone和网络失败情形比较重复请求与用户判断正确率。若没有宿主可靠入队结果就只报告可确认阶段；若状态不减少重复或让用户误认完成则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:54-69](https://github.com/omdsh-dev/dsh-genui/blob/24cea2dbf4161ecd326913094680a73d1f1b6261/src/client/index.tsx#L54-L69)

发送失败日志但面板仍可点，为状态观察提供直接起点。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:103-113](https://github.com/omdsh-dev/dsh-genui/blob/24cea2dbf4161ecd326913094680a73d1f1b6261/src/client/index.tsx#L103-L113)

inline失败无可见状态。

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

#### 缺口

- 其余组件的提交去重与宿主send结果语义未知
  **影响**：不能假定统一未实现或可靠ack已存在
  **进一步探讨**：先核对action组件和conversation.send契约再做定向对照

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
