# DeepSeek Harness Intelligent UI

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[e0338ee](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/tree/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e)

<!-- BEGIN META -->
[![GitHub ★ 38](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=38&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui) [![npm 30d 4,273](https://img.shields.io/static/v1?label=npm+30d&message=4%2C273&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-harness-intelligent-ui) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-harness-intelligent-ui)
<!-- END META -->

> **功能**：在 DSH 会话内生成可交互组件、更新视图和运行隔离小部件。

> **亮点**：把校验、会话内渲染和按 ID 更新接到原 DSH 对话，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：通过树校验只能确认结构，需核对数据内容。小部件的资源策略和受控动作也各有边界，见 [Q03](#research-q03)。

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
  - [Q01 · 什么时候会话内的交互组件比 Markdown 表更适合？](#detail-section-11)
  - [Q02 · 一张卡片怎样验证并更新，旧版本如何拒绝？](#detail-section-12)
  - [Q03 · 浏览器沙箱与桥分别约束什么？](#detail-section-13)
  - [Q04 · 如何试一张可核对的交互表？](#detail-section-14)
  - [Q05 · 显式展示版本和输入来源能否减少比较错误？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在 DSH 反复比较结构化数据的用户，见 [Q01](#research-q01)。

使用 Markdown 原表，并让用户从原始数据手工核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 声明式组件 | 表格、图及控件 | 先校验组件树 |
| UI 补丁 | 更新已显示组件 | 须匹配会话和版本 |
| Widget | 隔离脚本呈现 | 受 iframe 及桥政策约束 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 工具与回合服务 | 必需 | 调用和渲染 | 保留文本结果 |
| 对应会话历史或投影 | 更新时 | 重建 UI 版本 | 旧目标或版本被拒 |
| Widget 资源策略 | 小部件时 | 限制框架和资源 | 外部资源可能不可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定公开小表 | 保留原数据 |
| 试用 | 筛选并更新一次 | 核对版本和筛选结果 |
| 退出 | 状态或结果异常时回文本 | 独立核原表 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主与客户端资源 | 准备已知数据 | 部署未测 |
| 持续 | 模型生成与渲染 | 复查数据 | 单位合格结果未知 |
| 恢复 | 重渲染或重新调用 | 核对旧版本与状态 | 冲突行为未验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 交互 | 会话内组件与筛选 | 同任务的净收益 |
| 更新 | 会话范围与版本校验 | 并发、重载兼容 |

> **思考**：通过树校验只能确认结构，需核对数据内容。小部件的资源策略和受控动作也各有边界，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把校验、会话内渲染和按 ID 更新接到原 DSH 对话，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

组件身份与版本拒绝减少陈旧更新。宿主确认和 iframe 资源策略需分别核对，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

通过树校验只能确认结构，需核对数据内容。小部件的资源策略和受控动作也各有边界，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用固定非敏感小表核对实际筛选和一次补丁，结果不符则恢复原表，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认工具、客户端、版本与桥接逻辑；未验证运行和交互效果。

- 已检查：作者 README、包清单、源码路径 README.md、src/plugin.js、client-src/index.ts、src/tools/render.js、src/tools/patch.js、src/catalog/patch.js、package.json、client-src/widget/WidgetFrame.tsx、client-src/widget/frame.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对工具、客户端渲染、补丁和 Widget 代表安全边界；未运行 DSH 或浏览器。
- 下一步：比对固定表、筛选与版本冲突，再独立测试 iframe 各路径。

**分析版本**

- **仓库**：[dreamfarer-space/deepseek-harness-intelligent-ui](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui)
- **版本号**：0.2.15（[固定提交 e0338ee](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/tree/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

让用户核对版本与来源，比较能否减少误把本地筛选当作数据更新，见 [Q05](#research-q05)。

比对固定表、筛选与版本冲突，再独立测试 iframe 各路径。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 2410 | — | — | 31227 |
| .mjs | source | 38 | 7542 | 6493 | 742 | — |
| .ts | source | 25 | 3450 | 2690 | 585 | — |
| .tsx | source | 26 | 5488 | 4825 | 413 | — |
| .js | source | 23 | 7072 | 5836 | 1026 | — |
| .mjs | example | 3 | 43 | 40 | 4 | — |
| .js | example | 4 | 122 | 110 | 8 | — |
| .tsx | test | 22 | 4951 | 4439 | 217 | — |
| .js | test | 18 | 4015 | 3546 | 137 | — |
| .ts | example | 4 | 61 | 51 | 8 | — |
| .ts | test | 7 | 483 | 438 | 12 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对交互呈现如何挂载和更新，并确定桥接及用户复查的边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么时候会话内的交互组件比 Markdown 表更适合？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合在 DSH 比较已有结构化数据且要反复排序筛选的人。静态表适合一次阅读，交互组件能让用户就地检查不同子集，减少重复向模型要变体。作者说明设计借鉴 OpenIntelligentUI；本包增量是宿主工具、回合和浏览器组件接线。合格结果是筛选后内容仍能对照原表，不把精致呈现当数据正确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-27](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/README.md#L19-L27)

作者的任务定位及上游归属。

```text
Generative, interactive UI for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH). Ask in plain language and the agent decides on its own how to answer:

- **plain text** when that reads best;
- **native components**: dashboards, data grids, charts, scatter plots and heatmaps, timelines, live function plots, KaTeX math, Mermaid diagrams, code diffs, file trees, JSON trees, forms and choice cards;
- a fully custom **sandboxed live widget**: Three.js scenes, canvas simulations, mini-apps.

The UI renders progressively while the answer streams. Sorting, filtering, sliders, rotation, zoom and tabs respond instantly in the browser. Only explicit actions (a button, a form, a choice, `Bridge.sendPrompt`) go back to the agent, either in the current session or in a new one.

It ports the ideas of CopilotKit's [OpenIntelligentUI](https://github.com/CopilotKit/OpenIntelligentUI) (Open Generative UI + A2UI-style declarative components) onto DSH's own extension points, with no CopilotKit, LangGraph or external router.
```

**依据 2 · 源码核查**：[src/plugin.js:28-58](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/src/plugin.js#L28-L58)

工具和会话投影注册。

<details>
<summary>查看原文（31行）</summary>

```text
export function apply(ctx, rawConfig) {
  const config = resolveConfig(rawConfig);
  // tools.register / commands.register are fiber effects: unloading this
  // plugin unregisters everything, so no manual disposer bookkeeping.
  if (config.enableCatalog) {
    const unit = createUiSessionProjection({
      render: RENDER_TOOL,
      patch: PATCH_TOOL,
      ...(config.enableCompose !== false ? { compose: COMPOSE_TOOL, config } : {}),
    });
    let activePromise;
    ctx.inject(['sessionProjections'], (child) => {
      const sp = child.sessionProjections;
      if (!sp || typeof sp.register !== 'function') return;
      let disposed = false;
      const promise = Promise.resolve(sp.register(unit)).then(
        (h) => (!disposed && h && typeof h.stateOf === 'function' ? h : undefined),
        (err) => { child.logger?.warn?.(err); return undefined; },
      );
      activePromise = promise;
      child.effect(() => () => {
        disposed = true;
        if (activePromise === promise) activePromise = undefined;
      });
    });
    ctx.tools.register(createRenderTool(config));
    ctx.tools.register(createPatchTool(config, () => activePromise));
  }
  if (config.enableWidget) ctx.tools.register(createWidgetTool(config));
  // Composing needs something to compose; without a UI capability it is not offered.
  if (composeEnabled(config)) ctx.tools.register(createComposeTool(config));
```

</details>

**依据 3 · 源码核查**：[client-src/index.ts:86-103](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/client-src/index.ts#L86-L103)

客户端工具视图与回合尾部。

<details>
<summary>查看原文（18行）</summary>

```text
  const views = [[RENDER_TOOL, RenderView], [PATCH_TOOL, PatchView], [WIDGET_TOOL, WidgetView], [COMPOSE_TOOL, ComposeView]] as const
  for (const [key, view] of views) {
    ctx.slots.inject('tool.call.toolview', () => ctx.slots.register(
      { name: 'tool.call.toolview', key, locale: NS, inject: injected },
      inlineView(view),
    ))
  }

  // A finished Turn folds its tool calls away; re-present settled UIs beneath
  // the reply (same pattern as ui-schedule's created-task card).
  ctx.uiConversation.events.register(uiTurnDefinition)
  ctx.slots.inject('conversation.chat.turnTail', () => ctx.slots.register(
    { name: 'conversation.chat.turnTail', id: 'intelligent-ui', order: 15, locale: NS, inject: injected },
    TurnTail,
  ))
}

export { createControlledRuntime } from '../src/controlled/runtime.js'
```

</details>

#### 缺口

- 同一任务的查找时间和误读率未实测
  **影响**：不能证明一般对话都值得生成 UI
  **进一步探讨**：用已知小表比较静态阅读与过滤

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一张卡片怎样验证并更新，旧版本如何拒绝？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主复制输入并验证组件树，无效时返回错误，有效时以 callId 作为后续 UI ID。补丁在当前会话读投影和派生消息以重建状态，找不到目标便拒绝。baseVersion 必须等于现有版本，随后对完整下一版再校验。这可在一次普通更新时保留未变组件身份，仍不能据此断言并行补丁具有事务串行。若历史缺失则按提示重新渲染并核交互状态。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/render.js:112-130](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/src/tools/render.js#L112-L130)

校验、错误和 ID。

<details>
<summary>查看原文（19行）</summary>

```text
    async execute(rawArgs, exec) {
      const args = rawArgs && typeof rawArgs === 'object' && !Array.isArray(rawArgs) ? structuredClone(rawArgs) : rawArgs;
      const result = validateTree(args, { lenient: Boolean(config?.lenientValidation) });
      if (!result.ok) {
        return {
          ok: false,
          summary: `UI not rendered: ${result.errors.length} problem(s). Fix them and call ui_render again.`,
          errors: result.errors.slice(0, 40),
          ...(result.fixes?.length ? { fixes: result.fixes.slice(0, 20) } : {}),
        };
      }
      const kinds = Object.entries(result.types).map(([t, n]) => (n > 1 ? `${n}x ${t}` : t)).join(', ');
      const title = typeof args.title === 'string' && args.title ? ` "${args.title}"` : '';
      const warn = result.warnings.length ? ` Warning: ${result.warnings.join('; ')}.` : '';
      // The call id doubles as the UI's identity for later in-place patches.
      const handle = exec?.callId ? ` uiId ${exec.callId}, version 1 (change it later with ui_patch).` : '';
      return {
        ok: true,
        summary: `UI${title} is now displayed to the user (${result.count} components: ${kinds}).${warn}${handle} User interactions will arrive as new user messages.`,
```

</details>

**依据 2 · 源码核查**：[src/tools/patch.js:39-64](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/src/tools/patch.js#L39-L64)

重建本会话的 UI。

<details>
<summary>查看原文（26行）</summary>

```text
async function conversationUis(exec, config, getProjection) {
  const session = exec?.agent?.session;
  if (!session) return undefined;
  let projected;
  try {
    const handle = typeof getProjection === 'function' ? await getProjection() : undefined;
    if (handle && typeof handle.stateOf === 'function') {
      const state = await handle.stateOf(session);
      if (state && typeof state.uis === 'object' && state.uis !== null) {
        projected = new Map(Object.entries(state.uis));
      }
    }
  } catch { /* fallback to deriveMessages when session is a test double */ }
  let derived;
  if (typeof session.deriveMessages === 'function') {
    try {
      derived = collectUis(session.deriveMessages(), {
        render: RENDER_TOOL,
        patch: PATCH_TOOL,
        ...(config.enableCompose !== false ? { compose: COMPOSE_TOOL, config } : {}),
      });
    } catch { /* preserve projected state if deriveMessages fails */ }
  }
  if (!projected && !derived) return undefined;
  if (!projected) return derived;
  if (!derived) return projected;
```

</details>

**依据 3 · 源码核查**：[src/tools/patch.js:147-172](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/src/tools/patch.js#L147-L172)

会话内目标及返回。

<details>
<summary>查看原文（26行）</summary>

```text
    async execute(args, exec) {
      const refuse = (errors, code = 'invalid') => ({
        ok: false,
        code,
        summary: `UI not changed: ${errors.length} problem(s). The user still sees the previous version.`,
        errors,
      });
      if (typeof args !== 'object' || args === null || typeof args.uiId !== 'string' || args.uiId === '') {
        return refuse(['uiId: expected the uiId of a UI shown earlier in this conversation']);
      }
      const uis = await conversationUis(exec, config, getProjection);
      if (!uis) return refuse([`${PATCH_TOOL} is only available inside a conversation; call ${RENDER_TOOL} with the complete UI`], 'unavailable');
      const ui = uis.get(args.uiId);
      if (!ui) {
        const known = [...uis.values()].slice(-5).map(u => `${u.uiId} (v${u.version}${u.title ? ` "${u.title}"` : ''})`);
        return refuse([`uiId: no UI ${JSON.stringify(args.uiId)} in this conversation${known.length ? `; known: ${known.join(', ')}` : ''}. If it is no longer available, call ${RENDER_TOOL} with the complete UI.`], 'unknown');
      }
      const result = applyPatch(ui, args);
      if (!result.ok) return refuse(result.errors, result.code);
      const next = result.ui;
      const title = next.title ? ` "${next.title}"` : '';
      const warn = result.warnings.length ? ` Warning: ${result.warnings.join('; ')}.` : '';
      return {
        ok: true,
        summary: `UI${title} updated in place: uiId ${next.uiId}, now version ${next.version} (changed: ${result.changed.join(', ') || 'title'}).${warn} Components: ${outline(next)}.`,
        ui: next,
```

</details>

**依据 4 · 源码核查**：[src/catalog/patch.js:143-152](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/src/catalog/patch.js#L143-L152)

基线版本检查。

<details>
<summary>查看原文（10行）</summary>

```text
export function applyPatch(ui, args) {
  const fail = (errors, code = 'invalid') => ({ ok: false, errors, code });
  if (!isPlainObject(args)) return fail(['arguments: expected object']);
  for (const key of Object.keys(args)) {
    if (!['uiId', 'baseVersion', 'title', 'ops'].includes(key)) return fail([`${key}: unknown field`]);
  }
  if (!Number.isInteger(args.baseVersion)) return fail([`baseVersion: expected the integer version you are patching (current: ${ui.version})`]);
  if (args.baseVersion !== ui.version) {
    return fail([`baseVersion: UI ${JSON.stringify(ui.uiId)} is at version ${ui.version}, not ${args.baseVersion}; it changed since you read it. Re-derive the patch from version ${ui.version} and call ui_patch again with baseVersion ${ui.version}.`], 'stale');
  }
```

</details>

**依据 5 · 源码核查**：[src/catalog/patch.js:292-310](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/src/catalog/patch.js#L292-L310)

完整下一版再次校验。

<details>
<summary>查看原文（19行）</summary>

```text
  // keys this version no longer produces and must not resurrect their last
  // value as if the removed input were still there.
  const staleFields = scope ? scope.filter(key => before.has(key) && !after.has(key)) : [];
  const previous = Array.isArray(ui.staleFields) ? ui.staleFields.filter(key => scope?.includes(key) && !after.has(key)) : [];
  const retired = [...new Set([...previous, ...staleFields])];
  // The whole next version passes the same checks as a fresh ui_render.
  const check = validateTree(
    clone({ ...(title ? { title } : {}), root: ui.root, components, ...(computed ? { computed } : {}) }),
    scope ? { fields: scope } : undefined,
  );
  if (!check.ok) return fail(check.errors.slice(0, 40));
  const reached = new Set(components.map(n => n.id));
  const dropped = [...added].filter(id => !reached.has(id));
  const warnings = dropped.length ? [`new components not attached anywhere (dropped): ${dropped.join(', ')}`] : [];
  return {
    ok: true,
    ui: {
      uiId: ui.uiId, version: ui.version + 1, ...(title ? { title } : {}), root: ui.root, components,
      ...(computed ? { computed } : {}), ...(scope ? { scope } : {}),
```

</details>

#### 缺口

- 并行更新及刷新后的实际状态未验证
  **影响**：无法假设保留全部输入或不会出现冲突
  **进一步探讨**：同时发两次同版本补丁，重开后检查最终 UI 与状态

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 浏览器沙箱与桥分别约束什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Widget 在 iframe 运行，允许脚本和表单标志但未赋同源身份，CSP 默认关闭 connect-src 并允许配置的资源 CDN。因图片、脚本等资源有各自指令，关闭 connect-src 不能推出完全离线。桥在终稿可发提示，受控动作只准备申请，原生确认再调用；两者职责不同。依赖宿主工具、会话和浏览器组件接口。需要用数据审阅任务先验证，不宜以静态设置断言所有浏览器行为安全。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:58-73](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/package.json#L58-L73)

宿主补丁与客户端依赖。

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
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-chat",
        "@deepseek-ai/dsh-client-ui-tool"
      ]
    }
  },
```

</details>

**依据 2 · 源码核查**：[client-src/widget/WidgetFrame.tsx:235-267](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/client-src/widget/WidgetFrame.tsx#L235-L267)

终稿、发送提示及动作请求。

<details>
<summary>查看原文（33行）</summary>

```text
    const handleRpc = async (id: number, method: string, params: Record<string, unknown>, source: MessagePort) => {
      const reply = (msg: Record<string, unknown>) => post(msg, source)
      const p = live.current
      try {
        if (!finalized.current || p.mode !== 'final') throw new BridgeError('unavailable', 'the widget is still generating')
        if (method === 'sendPrompt') {
          const text = guard.admitPrompt(params.text)
          p.onSending?.(true)
          try { await p.sendPrompt(text) } finally { p.onSending?.(false) }
          p.onSent?.(true)
          reply({ type: 'rpc-result', id, ok: true, value: { accepted: true } })
        } else if (method === 'readData') {
          if (!p.controlled) throw new Error('Data binding unavailable')
          const entry = p.controlled.readData(contextOf(p), params.dataRef)
          reply({ type: 'rpc-result', id, ok: true, value: entry.value })
        } else if (method === 'invokeAction') {
          if (!p.controlled) throw new Error('Actions unavailable')
          if (pendingAction.current) throw new Error('An action is already awaiting confirmation')
          const request = p.controlled.prepareAction(contextOf(p), params)
          pendingAction.current = true
          setAction({ id, request }); setActionStatus('')
          // Generated code never receives authority to execute. A native host control below does.
        } else if (method === 'openLink') {
          const url = guard.admitLink(params.url)
          window.open(url, '_blank', 'noopener,noreferrer')
          reply({ type: 'rpc-result', id, ok: true, value: { opened: true } })
        } else {
          throw new BridgeError('unavailable', `unknown bridge method ${method}`)
        }
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err)
        if (method === 'sendPrompt') p.onSent?.(false, reason)
        reply({ type: 'rpc-result', id, ok: false, error: reason })
```

</details>

**依据 3 · 源码核查**：[client-src/widget/WidgetFrame.tsx:292-304](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/client-src/widget/WidgetFrame.tsx#L292-L304)

原生确认才调用。

<details>
<summary>查看原文（13行）</summary>

```text
  const finishAction = async (event: Event, accepted: boolean) => {
    if (!action || !pendingAction.current || actionFlight.current) return
    actionFlight.current = true
    const epoch = actionEpoch.current
    setActionStatus('Loading…')
    try {
      if (!accepted) throw new Error('Action cancelled')
      const p = live.current
      if (!p.controlled) throw new Error('Actions unavailable')
      const value = await p.controlled.invokeAction(contextOf(p), action.request, event)
      if (actionEpoch.current !== epoch) return
      post({ type: 'rpc-result', id: action.id, ok: true, value })
      setActionStatus('Success')
```

</details>

**依据 4 · 源码核查**：[client-src/widget/WidgetFrame.tsx:323-334](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/client-src/widget/WidgetFrame.tsx#L323-L334)

实际 iframe 标志。

<details>
<summary>查看原文（12行）</summary>

```text
      // keeps running or receiving in place of the widget.
      ? <div className="diui-card" role="alert" data-widget-strayed="true">{props.strayedMessage ?? 'The widget navigated to another page and was removed'}</div>
      : <iframe
        ref={attachFrame}
        className="diui-frame"
        title={props.title}
        sandbox="allow-scripts allow-forms"
        referrerPolicy="no-referrer"
        srcDoc={srcDoc}
        style={{ height }}
        data-mode={props.mode}
      />}
```

</details>

**依据 5 · 源码核查**：[client-src/widget/frame.ts:66-87](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/client-src/widget/frame.ts#L66-L87)

资源与连接的不同 CSP。

<details>
<summary>查看原文（22行）</summary>

```text
 * permits data in its suffix or query. An empty `cdn` blocks external resource
 * requests, but cannot stop self-navigation. The per-channel matrix,
 * including why each grant is needed, is in docs/widget-csp-audit.md.
 */
export function contentSecurityPolicy(policy: WidgetPolicy): string {
  const cdn = offlinePack ? '' : safeOrigins(policy.cdn).join(' ')
  const connect = policy.allowNetwork && cdn ? cdn : "'none'"
  return [
    "default-src 'none'",
    `script-src 'unsafe-inline' 'unsafe-eval' blob: ${cdn}`.trim(),
    `style-src 'unsafe-inline' ${cdn}`.trim(),
    `img-src data: blob: ${cdn}`.trim(),
    `font-src data: ${cdn}`.trim(),
    `media-src data: blob: ${cdn}`.trim(),
    `connect-src ${connect}`,
    // canvas-confetti (an advertised import) runs its default path in a
    // blob: Worker; a blob worker inherits this document's CSP and opaque
    // origin, so it adds no reach (verified in scripts/security/audit.mjs).
    'worker-src blob:',
    "form-action 'none'",
    "base-uri 'none'",
  ].join('; ')
```

</details>

#### 缺口

- 真实宿主和浏览器的资源与导航边界未复验
  **影响**：不能将受控桥推广成完整网络隔离
  **进一步探讨**：用无敏感输入检验资源请求、导航及桥消息

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何试一张可核对的交互表？

**研究主题**：效果与总成本、采用判断

#### 完整回答

有 DSH Web 且经常比较小表的用户，可先用非敏感的固定数据生成声明式表，核对排序、筛选和一次版本更新。用同一原数据的 Markdown 对照，记录模型生成、浏览器渲染和人工复查。若数据变动、重载后筛选错位或补丁失败，回到原始表。需要生成任意脚本的 Widget 不是这个试用的前置。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:184-202](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/README.md#L184-L202)

作者描述声明式组件与验证。

<details>
<summary>查看原文（19行）</summary>

```text
## 🧩 Component catalog (`ui_render`)

| Category | Components |
|---|---|
| Layout | `Card`, `Stack`, `Grid`, `Tabs` (keyboard navigable) |
| Text & callouts | `Text` (markdown subset), `Code`, `Alert`, `Badge`, `Divider` |
| Data | `Stat`, `Progress`, `List`, `Timeline`, **`Table`** as a data grid: typed sorting (numbers, ISO dates, booleans), search, per-column filters, paging, CSV/Markdown export |
| Charts | **`Chart`** (bar / line / area / pie, stacked, legend toggles, hover/tap/keyboard tooltips, data export), **`Scatter`** (continuous x/y), **`Heatmap`** (sequential or diverging scale, explicit missing cells) |
| Maps | **`Map`** (markers, routes, groups; drag/keyboard pan and zoom; a built-in offline world outline, or the tile basemap you configure) |
| Media | **`Image`** and **`Gallery`** (photos from https URLs, lazy and without a Referer, captions and linked credits, a modal full-size viewer with arrow keys; a broken photo shows its description); **`Video`** (YouTube / Bilibili / Vimeo links in the official player, loaded only after the user presses play, or a direct https .mp4/.webm with native controls; always a link to the original) |
| Math & diagrams | **`Plot`** (y = f(x) with sliders that redraw instantly; a safe expression compiler, never `eval`), **`Math`** (KaTeX), **`Mermaid`** |
| Code & structure | **`CodeDiff`** (multi-file before/after or unified patch), **`FileTree`** (status badges), **`JsonView`** (JSONPath, copy) |
| Interaction | `Button`, **`Choice`** (single-choice card), `Form` (text, number, range slider, select, checkbox, date, textarea) |

- **Validated before it renders.** A UI travels as a flat node list with id references (DSH's tool schema has no recursion). The Host rejects unknown types or props, dangling or duplicate ids, cycles, shape mismatches (chart series, heatmap rows), non-finite numbers, uncompilable `Plot` expressions, out-of-range map coordinates and oversized data, returning `ok:false` with paths so the model fixes and retries.
- **Text, never HTML.** Cells, code, JSON and labels render as React text. CSV export neutralises spreadsheet formula injection and is RFC 4180 with a UTF-8 BOM.
- **Accessible and responsive.** Charts are focusable and keyboard-inspectable, trees use `role=tree`, touch targets grow on coarse pointers, and charts lay out at the card's real width so axis text stays legible on phones.
- **`Math` and `Mermaid`** render in the same sandbox as widgets from the CDN allowlist, with a static fallback when the CDN is unreachable, or fully offline with the [offline resource package](docs/offline-resources.md).

```

</details>

**依据 2 · 源码核查**：[src/tools/render.js:112-130](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/src/tools/render.js#L112-L130)

实际验证返回。

<details>
<summary>查看原文（19行）</summary>

```text
    async execute(rawArgs, exec) {
      const args = rawArgs && typeof rawArgs === 'object' && !Array.isArray(rawArgs) ? structuredClone(rawArgs) : rawArgs;
      const result = validateTree(args, { lenient: Boolean(config?.lenientValidation) });
      if (!result.ok) {
        return {
          ok: false,
          summary: `UI not rendered: ${result.errors.length} problem(s). Fix them and call ui_render again.`,
          errors: result.errors.slice(0, 40),
          ...(result.fixes?.length ? { fixes: result.fixes.slice(0, 20) } : {}),
        };
      }
      const kinds = Object.entries(result.types).map(([t, n]) => (n > 1 ? `${n}x ${t}` : t)).join(', ');
      const title = typeof args.title === 'string' && args.title ? ` "${args.title}"` : '';
      const warn = result.warnings.length ? ` Warning: ${result.warnings.join('; ')}.` : '';
      // The call id doubles as the UI's identity for later in-place patches.
      const handle = exec?.callId ? ` uiId ${exec.callId}, version 1 (change it later with ui_patch).` : '';
      return {
        ok: true,
        summary: `UI${title} is now displayed to the user (${result.count} components: ${kinds}).${warn}${handle} User interactions will arrive as new user messages.`,
```

</details>

**依据 3 · 源码核查**：[src/tools/patch.js:147-172](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/src/tools/patch.js#L147-L172)

目标或版本无法满足时可重新渲染。

<details>
<summary>查看原文（26行）</summary>

```text
    async execute(args, exec) {
      const refuse = (errors, code = 'invalid') => ({
        ok: false,
        code,
        summary: `UI not changed: ${errors.length} problem(s). The user still sees the previous version.`,
        errors,
      });
      if (typeof args !== 'object' || args === null || typeof args.uiId !== 'string' || args.uiId === '') {
        return refuse(['uiId: expected the uiId of a UI shown earlier in this conversation']);
      }
      const uis = await conversationUis(exec, config, getProjection);
      if (!uis) return refuse([`${PATCH_TOOL} is only available inside a conversation; call ${RENDER_TOOL} with the complete UI`], 'unavailable');
      const ui = uis.get(args.uiId);
      if (!ui) {
        const known = [...uis.values()].slice(-5).map(u => `${u.uiId} (v${u.version}${u.title ? ` "${u.title}"` : ''})`);
        return refuse([`uiId: no UI ${JSON.stringify(args.uiId)} in this conversation${known.length ? `; known: ${known.join(', ')}` : ''}. If it is no longer available, call ${RENDER_TOOL} with the complete UI.`], 'unknown');
      }
      const result = applyPatch(ui, args);
      if (!result.ok) return refuse(result.errors, result.code);
      const next = result.ui;
      const title = next.title ? ` "${next.title}"` : '';
      const warn = result.warnings.length ? ` Warning: ${result.warnings.join('; ')}.` : '';
      return {
        ok: true,
        summary: `UI${title} updated in place: uiId ${next.uiId}, now version ${next.version} (changed: ${result.changed.join(', ') || 'title'}).${warn} Components: ${outline(next)}.`,
        ui: next,
```

</details>

#### 缺口

- 单位正确筛选任务的费用和时间未知
  **影响**：不能判定比 Markdown 更划算
  **进一步探讨**：以相同数据和筛选条件重复对照

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 显式展示版本和输入来源能否减少比较错误？

**研究主题**：新假设与验证

#### 完整回答

可以在交互结果上显示 UI 版本及数据来源，并提示筛选只是视图变化，数据更新来自重新生成或补丁。以静态和交互两组使用相同数据，插入一次旧版本编辑和一次本地筛选，盲评误认数据已更新的次数。如果现有提示已经足够，或干扰阅读，则不推广。

#### 证据与依据

**依据 1 · 源码核查**：[src/catalog/patch.js:143-152](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/src/catalog/patch.js#L143-L152)

补丁已经有版本前提。

<details>
<summary>查看原文（10行）</summary>

```text
export function applyPatch(ui, args) {
  const fail = (errors, code = 'invalid') => ({ ok: false, errors, code });
  if (!isPlainObject(args)) return fail(['arguments: expected object']);
  for (const key of Object.keys(args)) {
    if (!['uiId', 'baseVersion', 'title', 'ops'].includes(key)) return fail([`${key}: unknown field`]);
  }
  if (!Number.isInteger(args.baseVersion)) return fail([`baseVersion: expected the integer version you are patching (current: ${ui.version})`]);
  if (args.baseVersion !== ui.version) {
    return fail([`baseVersion: UI ${JSON.stringify(ui.uiId)} is at version ${ui.version}, not ${args.baseVersion}; it changed since you read it. Re-derive the patch from version ${ui.version} and call ui_patch again with baseVersion ${ui.version}.`], 'stale');
  }
```

</details>

**依据 2 · 作者声明**：[README.md:209-220](https://github.com/dreamfarer-space/deepseek-harness-intelligent-ui/blob/e0338ee7d0c7f31f4c3d26544909ca0edc4da07e/README.md#L209-L220)

作者说明更新及状态。

<details>
<summary>查看原文（12行）</summary>

```text
## 🔁 Updating a UI in place (`ui_patch`)

When the user asks to change a UI shown earlier ("make that bar chart a line chart; leave the rest"), the agent patches it by component id instead of re-sending the whole tree.

- **Identity:** every `ui_render` result reports the UI's `uiId` and `version` 1; each accepted patch reports the new version and an `id:Type` outline.
- **Operations:** `setProps` (merge, `unset` to remove), `replaceNode`, `insertChild` and `removeNode`, applied in order and **all-or-nothing**. The next version then passes the same checks as a fresh `ui_render`.
- **Concurrency:** `baseVersion` is required; a stale patch is refused with the current version, and patches never run in parallel.
- **Scope:** the Host stores nothing. It rebuilds the current version by replaying the conversation's own history, so a patch can only address UIs of the same conversation.
- **State:** components keep their ids across versions, so untouched components keep their sort, filters, tab, form input, submitted lock and slider positions. A replaced component starts fresh.
- **Linked fields:** a block keeps reading the answer-wide field pool (`scope`) after a patch, so a formula still follows a slider a sibling block publishes. A field the patch removed only goes stale when no live input backs that key any more: a sibling block still publishing it keeps it live, and a key with no producer is never read back as the removed input's last value. A patch cannot add a *new* field key (it could collide with a sibling block's `computed` id) — re-render the answer for that.
- **Display:** while a patch streams, the previous version stays live. On success the new version renders beneath the reply and the older copy collapses to "Updated to version N". Refused, failed or stopped patches change nothing.
- **Widgets** are re-rendered rather than patched, and keep their `UI.state`.
```

</details>

#### 缺口

- 用户能否从现有界面理解版本未知
  **影响**：需要先判断是否有界面缺口
  **进一步探讨**：以同一个筛选任务比较两种反馈

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
