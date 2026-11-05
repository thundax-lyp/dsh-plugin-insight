# DSH Better Display

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[2bfb1a6](https://github.com/aa2246740/dsh-better-display/tree/2bfb1a63ac332d8d2032485ea9b182022edd9e78)

<!-- BEGIN META -->
[![GitHub ★ 95](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=95&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/aa2246740/dsh-better-display) [![npm 30d 3,832](https://img.shields.io/static/v1?label=npm+30d&message=3%2C832&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-display) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-display)
<!-- END META -->

> **功能**：以独立阅读页呈现过程并折叠已成功结束的步骤

> **亮点**：[Q01](#research-q01) 提供最终回复与可展开过程的布局。

> **主要限制**：[Q03](#research-q03) 依赖完整边界与第三方渲染兼容。

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
  - [Q01 · 交付怎样核对？](#detail-section-11)
  - [Q02 · 怎样判断完成？](#detail-section-12)
  - [Q03 · 渲染扩展边界？](#detail-section-13)
  - [Q04 · 采用退出？](#detail-section-14)
  - [Q05 · 什么结果否定目标？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长任务过程遮住最终回答。

官方对话和轨迹。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 官方对话和轨迹。 | 可直接比较 | 保留人工步骤 |
| DSH Better Display | 提供最终回复与可展开过程的布局。 | 依赖完整边界与第三方渲染兼容。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 独立阅读视图根据轮次边界折叠并复用渲染入口。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 长任务过程遮住最终回答。 | 保留原流程 |
| 试验 | 独立阅读视图根据轮次边界折叠并复用渲染入口。 | 观察固定版本 |
| 复核 | 同会话对照成功、失败及卸载。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 在长轮次中更快找到最终回答并能展开过程 | 可减少定位最终结果的时间。 | 同会话对照成功、失败及卸载。 |

> **思考**：[Q03](#research-q03) 依赖完整边界与第三方渲染兼容。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 提供最终回复与可展开过程的布局。

投影按明确完成条件分类。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 依赖完整边界与第三方渲染兼容。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 同会话对照成功、失败及卸载。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的在长轮次中更快找到最终回答并能展开过程。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/index.tsx、src/client/projection.ts、src/client/live-turn.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的在长轮次中更快找到最终回答并能展开过程。未执行目标代码或实际宿主验证。
- 下一步：保存同轮原生与阅读页对照。

**分析版本**

- **仓库**：[aa2246740/dsh-better-display](https://github.com/aa2246740/dsh-better-display)
- **版本号**：0.3.12（[固定提交 2bfb1a6](https://github.com/aa2246740/dsh-better-display/tree/2bfb1a63ac332d8d2032485ea9b182022edd9e78)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可减少定位最终结果的时间。

保存同轮原生与阅读页对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 1349 | — | — | 15946 |
| .js | source | 80 | 60452 | 49947 | 11169 | — |
| .md | example | 1 | 37 | — | — | 421 |
| .ts | example | 1 | 179 | 153 | 12 | — |
| .mjs | source | 14 | 1554 | 1401 | 67 | — |
| .tsx | source | 30 | 6404 | 5189 | 878 | — |
| .ts | source | 46 | 4850 | 3559 | 895 | — |
| .tsx | test | 7 | 529 | 482 | 27 | — |
| .ts | test | 46 | 5741 | 5135 | 240 | — |
| .tsx | example | 3 | 524 | 494 | 9 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/aa2246740/dsh-better-display/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在长轮次中更快找到最终回答并能展开过程

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 交付怎样核对？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户可在阅读页看执行过程，成功后聚焦最终回复。对照官方对话与轨迹，应核对最终文本、工具结果和失败记录仍可访问。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-27](https://github.com/aa2246740/dsh-better-display/blob/2bfb1a63ac332d8d2032485ea9b182022edd9e78/README.md#L23-L27)

作者说明阅读页及扩展渲染

```text
这条官方 CLI 命令只写入 `web` profile，不能修改 Desktop App 的 profile。本机 PATH 上需要有 **pnpm**。对于已经运行的 Web Host，请重新打开该 Host 一次，再刷新网页；插件 bundle 会在启动时读取。

给 DeepSeek Harness 加一个 **阅读** 页签：执行时能看到步骤、思考和进度；整轮成功结束后把过程收起来，留下最终回答。原版「对话 / 轨迹」、输入框、模型选择、工具和审批都还在。阅读列保留宿主 ChatView 的 `data-chat-flow` 钩子，依赖该标记显示输入框的第三方皮肤不会把阅读页当成仅检视视图。若另一个插件用低于官方的 priority 替换了 `assistant-step`（例如 `dsh-raw-html-v2` 渲染 `<div id="vcp-root">` 卡片），阅读页把回答正文交给它，思考、折叠和过程动效仍由阅读页负责。详见 [官方能力接入说明](docs/official-rendering-bridge.md)。

另一个插件可以在展示层改写思考和回答（例如翻译），阅读页仍负责浮现、跟随和折叠。复制的是原文，会话记录不变。契约和最小例子见 [扩展点](docs/extension-points.md)。
```

**依据 2 · 源码核查**：[src/client/index.tsx:79-90](https://github.com/aa2246740/dsh-better-display/blob/2bfb1a63ac332d8d2032485ea9b182022edd9e78/src/client/index.tsx#L79-L90)

注册独立阅读视图

<details>
<summary>查看原文（12行）</summary>

```text
  ctx.slots.inject('conversation.chat.node', function* () {
    yield ctx.slots.register({
    name: 'conversation.view',
    id: 'reader',
    order: -5,
    label: () => '阅读',
    locale: 'chat',
    children: {
      'dsh-better-display.block': { kind: 'chain', scope: 'session' },
      ...officialChildren(ctx.slots as unknown as CompositionRegistry),
    },
    store,
```

</details>

#### 缺口

- 更少滚动不能牺牲错误可见性。
  **影响**：减少过程淹没最终回答。
  **进一步探讨**：固定长轮次对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 怎样判断完成？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

投影只在 assistant settled、边界 closed 且 reason completed 时判定可折叠正文；新正文或工具结束不足以判整个轮次完成。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/projection.ts:37-51](https://github.com/aa2246740/dsh-better-display/blob/2bfb1a63ac332d8d2032485ea9b182022edd9e78/src/client/projection.ts#L37-L51)

结束和折叠条件

<details>
<summary>查看原文（15行）</summary>

```text
 * A settled body step before the closing step of a successful turn.
 *
 * This is presentation classification only. Narration is never process content
 * and never folds. The flag only marks body text that is no longer the turn's
 * final answer, so copy and fork stay on that final answer.
 */
export function isEarlierNarration(data: AssistantChatData, boundary: TurnBoundary): boolean {
  // New body text, a tool call, or a settled step is not a completed turn.
  if (data.status !== 'settled' || boundary.status !== 'closed' || boundary.reason !== 'completed') return false;
  if (data.blocks.some(block => block.kind === 'image' || block.kind === 'other')) return false;
  return boundary.closingStep !== null && data.step < boundary.closingStep;
}

export function processExpanded(choice: boolean | undefined, boundary: TurnBoundary): boolean {
  return choice ?? !(boundary.status === 'closed' && boundary.reason === 'completed');
```

</details>

**依据 2 · 源码核查**：[src/client/live-turn.ts:19-39](https://github.com/aa2246740/dsh-better-display/blob/2bfb1a63ac332d8d2032485ea9b182022edd9e78/src/client/live-turn.ts#L19-L39)

运行中折叠及摘要

<details>
<summary>查看原文（21行）</summary>

```text
export function liveFoldEnabled(boundary: TurnBoundary): boolean {
  return boundary.status === 'open';
}

export function foldSummary(steps: readonly LiveStep[]): string {
  let reasoning = 0;
  let body = 0;
  let tool = 0;
  let extra = 0;
  for (const step of steps) {
    if (step.kind === 'reasoning') reasoning += 1;
    else if (step.kind === 'body') body += 1;
    else if (step.kind === 'tool') tool += 1;
    else if (step.kind !== 'user') extra += 1;
  }
  const parts: string[] = [];
  if (reasoning) parts.push(`思考×${reasoning}`);
  if (body) parts.push(`输出×${body}`);
  if (tool) parts.push(`工具×${tool}`);
  if (extra) parts.push(`记录×${extra}`);
  return parts.join(' · ') || '此前步骤';
```

</details>

#### 缺口

- 宿主边界状态需验证。
  **影响**：失败和取消应保留诊断。
  **进一步探讨**：测试成功、失败和取消。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 渲染扩展边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

自定义文本转换服务和官方子插槽在阅读视图中组合。其他插件可变更展示，复制原文与显示文本需核对一致性说明。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:68-88](https://github.com/aa2246740/dsh-better-display/blob/2bfb1a63ac332d8d2032485ea9b182022edd9e78/src/client/index.tsx#L68-L88)

文本转换和官方 children

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx: Context): void {
  const textTransform = createTextTransformRegistry();
  const restoreTextTransform = installTextTransformRegistry(textTransform);
  ctx.provide(TEXT_TRANSFORM_SERVICE, textTransform);
  ctx.effect(() => restoreTextTransform);
  const store = createReaderStore();
  // conversation.view is session-scoped, so session persist keys are
  // `dsh.reader.v1.<sessionId>`. One root instance keeps glass, fold
  // intensity, and open-mode on the unsuffixed `dsh.reader.v1` key.
  const prefs = store.create();
  installBetterDisplaySettings(ctx, prefs);
  ctx.slots.inject('conversation.chat.node', function* () {
    yield ctx.slots.register({
    name: 'conversation.view',
    id: 'reader',
    order: -5,
    label: () => '阅读',
    locale: 'chat',
    children: {
      'dsh-better-display.block': { kind: 'chain', scope: 'session' },
      ...officialChildren(ctx.slots as unknown as CompositionRegistry),
```

</details>

**依据 2 · 作者声明**：[README.md:25-27](https://github.com/aa2246740/dsh-better-display/blob/2bfb1a63ac332d8d2032485ea9b182022edd9e78/README.md#L25-L27)

作者说明原文复制与外部渲染

```text
给 DeepSeek Harness 加一个 **阅读** 页签：执行时能看到步骤、思考和进度；整轮成功结束后把过程收起来，留下最终回答。原版「对话 / 轨迹」、输入框、模型选择、工具和审批都还在。阅读列保留宿主 ChatView 的 `data-chat-flow` 钩子，依赖该标记显示输入框的第三方皮肤不会把阅读页当成仅检视视图。若另一个插件用低于官方的 priority 替换了 `assistant-step`（例如 `dsh-raw-html-v2` 渲染 `<div id="vcp-root">` 卡片），阅读页把回答正文交给它，思考、折叠和过程动效仍由阅读页负责。详见 [官方能力接入说明](docs/official-rendering-bridge.md)。

另一个插件可以在展示层改写思考和回答（例如翻译），阅读页仍负责浮现、跟随和折叠。复制的是原文，会话记录不变。契约和最小例子见 [扩展点](docs/extension-points.md)。
```

#### 缺口

- 第三方替换可能隐藏附件或内容。
  **影响**：交付正确性需按插件组合测试。
  **进一步探讨**：比较链接、附件和外部卡片。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

按作者要求固定 Desktop 或 Web 安装渠道，检查版本。首次成本含皮肤及卡片回归，持续资源来自长会话渲染和状态存储。退出恢复原视图并检查会话仍可读，偏好键另行清理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-23](https://github.com/aa2246740/dsh-better-display/blob/2bfb1a63ac332d8d2032485ea9b182022edd9e78/README.md#L7-L23)

作者说明安装及宿主

<details>
<summary>查看原文（17行）</summary>

````text
### DSH Studio 桌面 App（推荐）

打开 **设置 → 插件 → 添加插件**，在“包名或地址”中输入：

```text
github:aa2246740/dsh-better-display#v0.3.12
```

桌面端的插件管理器负责 Desktop profile 和其内置包管理器。`v0.3.12` 是目前已打 tag、且 `engines.dsh` 接受 Harness `0.2.1-rc.5` 的安装目标。本 tag 已包含编译好的 `lib/`；普通使用不需要 clone、构建或安装 DSHX。若应用在安装完成后提示刷新或重新打开，请按提示完成。

### Web CLI

```sh
dsh plugin --profile web add github:aa2246740/dsh-better-display#v0.3.12
```

这条官方 CLI 命令只写入 `web` profile，不能修改 Desktop App 的 profile。本机 PATH 上需要有 **pnpm**。对于已经运行的 Web Host，请重新打开该 Host 一次，再刷新网页；插件 bundle 会在启动时读取。
````

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:73-76](https://github.com/aa2246740/dsh-better-display/blob/2bfb1a63ac332d8d2032485ea9b182022edd9e78/src/client/index.tsx#L73-L76)

会话及全局偏好键

```text
  const store = createReaderStore();
  // conversation.view is session-scoped, so session persist keys are
  // `dsh.reader.v1.<sessionId>`. One root instance keeps glass, fold
  // intensity, and open-mode on the unsuffixed `dsh.reader.v1` key.
```

#### 缺口

- 内存和旧偏好迁移未知。
  **影响**：原生回退需实测。
  **进一步探讨**：卸载后重开同一会话。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么结果否定目标？

**研究主题**：新假设与验证

#### 完整回答

比较查最终结论、错误和附件的时间及成功率，增加并行、撤回、断流和第三方卡片。若失败过程被折、最终正文少字或引用打不开，则当前展示组合不满足任务。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/projection.ts:37-51](https://github.com/aa2246740/dsh-better-display/blob/2bfb1a63ac332d8d2032485ea9b182022edd9e78/src/client/projection.ts#L37-L51)

可构造折叠边界

<details>
<summary>查看原文（15行）</summary>

```text
 * A settled body step before the closing step of a successful turn.
 *
 * This is presentation classification only. Narration is never process content
 * and never folds. The flag only marks body text that is no longer the turn's
 * final answer, so copy and fork stay on that final answer.
 */
export function isEarlierNarration(data: AssistantChatData, boundary: TurnBoundary): boolean {
  // New body text, a tool call, or a settled step is not a completed turn.
  if (data.status !== 'settled' || boundary.status !== 'closed' || boundary.reason !== 'completed') return false;
  if (data.blocks.some(block => block.kind === 'image' || block.kind === 'other')) return false;
  return boundary.closingStep !== null && data.step < boundary.closingStep;
}

export function processExpanded(choice: boolean | undefined, boundary: TurnBoundary): boolean {
  return choice ?? !(boundary.status === 'closed' && boundary.reason === 'completed');
```

</details>

**依据 2 · 源码核查**：[src/client/live-turn.ts:50-75](https://github.com/aa2246740/dsh-better-display/blob/2bfb1a63ac332d8d2032485ea9b182022edd9e78/src/client/live-turn.ts#L50-L75)

步骤和工具关联

<details>
<summary>查看原文（26行）</summary>

```text
function stepsFromAssistant(
  nodeKey: string,
  data: AssistantChatData,
  toolsByCallId: Map<string, ToolActivityEntry>,
  consumed: Set<string>,
): LiveStep[] {
  const marks: { at: number; step: LiveStep }[] = [];
  for (const part of assistantSegments(data.blocks)) {
    if (skipReasoning(part) || skipBody(part)) continue;
    marks.push({
      at: part.start,
      step: {
        kind: part.kind,
        key: `${nodeKey}:${part.kind}:${part.start}`,
        nodeKey,
        start: part.start,
        blocks: part.blocks,
        step: data.step,
      },
    });
  }
  data.blocks.forEach((block, index) => {
    if (block.kind !== 'tool-call' || !block.callId) return;
    const tool = toolsByCallId.get(block.callId);
    if (!tool || consumed.has(tool.callId)) return;
    consumed.add(tool.callId);
```

</details>

#### 缺口

- 未运行目标 GUI。
  **影响**：阅读效率与完整性分别计量。
  **进一步探讨**：保存同轮原生与阅读页对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
