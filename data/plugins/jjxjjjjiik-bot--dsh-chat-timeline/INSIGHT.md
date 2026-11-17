# DSH Chat Timeline

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[8767427](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/tree/8767427f73bf38be84f3063a2c55bbc461e95352)

<!-- BEGIN META -->
[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline) [![npm 30d 1,285](https://img.shields.io/static/v1?label=npm+30d&message=1%2C285&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chat-timeline) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chat-timeline)
<!-- END META -->

> **功能**：以用户消息为索引在 DSH Web 侧栏提供长会话跳转和重点标记。

> **亮点**：为跨页长对话提供用户输入的导航与本地星标，宿主投影和客户端位置绑定减少手工翻找，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

> **主要限制**：回退事件、节点分页和 DOM 锚点都参与跳转，客户端部分视图可能缺历史，见 [Q03](#research-q03)。

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
  - [Q01 · 什么任务值得把用户输入做成时间线？](#detail-section-11)
  - [Q02 · 索引、分页和跳转如何串起来？](#detail-section-12)
  - [Q03 · 撤回和书签何时会失去一致性？](#detail-section-13)
  - [Q04 · 怎样判断时间线可以省掉定位工夫？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合要反复定位同一 DSH 长会话用户输入的使用者，见 [Q01](#research-q01)。

以宿主原生滚动及可用搜索为对照，比较找到正确输入的耗时和错误，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 时间线 | 定位早期的用户输入 | 需会话节点和 Web 槽 |
| 本地标记 | 在同浏览器筛选重点 | 依赖 localStorage |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web、Node 22+ | 运行所需 | 加载两端入口 | 需返回原生视图 |
| 会话投影服务与 Web 槽 | 完整时间线所需 | 投影及挂载 | 可回退已加载节点或没有面板 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 复制一条脱敏长会话 | 记录目标消息 |
| 跳转 | 用预览及星标定位 | 命中正确用户输入 |
| 退出 | 关闭插件或回到原生视图 | 浏览器标记按需求清理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主资源 | 装配和浏览器检查 | 耗时未知 |
| 持续 | 历史加载与本地存储 | 处理未命中的目标 | 未测超长会话 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 旧输入定位 | 按投影和节点定位 | 实际耗时 |
| 书签 | 保存在同一浏览器 | 不同客户端连续性 |

> **思考**：回退事件、节点分页和 DOM 锚点都参与跳转，客户端部分视图可能缺历史，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：为跨页长对话提供用户输入的导航与本地星标，宿主投影和客户端位置绑定减少手工翻找，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

将事件投影与 Web 槽分离，客户端将投影和节点回退与 DOM 锚点接在一起，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

回退事件、节点分页和 DOM 锚点都参与跳转，客户端部分视图可能缺历史，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在脱敏会话测试两处已知输入和一次回退。跳转未命中或目标被隐藏时，回到原视图核对，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持投影、侧栏、按需跳转及本地标记，固定宿主兼容和节时待验证。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、README.md、lib/index.js、lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定仓库发布 JS 源码。未运行目标宿主、浏览器或安装脚本。
- 下一步：测试长历史、回退、切换浏览器和窄视口，见 [Q04](#research-q04)。

**分析版本**

- **仓库**：[jjxjjjjiik-bot/dsh-chat-timeline](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline)
- **版本号**：0.1.5（[固定提交 8767427](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/tree/8767427f73bf38be84f3063a2c55bbc461e95352)）
- **版本日期**：2026-08-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

显式显示历史来源与覆盖可减少用户对回退和缺页的误判，见 [Q04](#research-q04)。

测试长历史、回退、切换浏览器和窄视口，见 [Q04](#research-q04)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 916 | 678 | 180 | — |
| .md | source | 2 | 174 | — | — | 1623 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：能否更快定位同一长会话的关键输入，并在回退、分页和更换浏览器后正确识别边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么任务值得把用户输入做成时间线？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护长编码对话的使用者经常要回到某次修改要求，而当时的助手答复未必含同样关键词。时间线把用户直接输入做成短预览和导航点，用户可标记重点。比逐屏滚动多一条按输入跳转路径。会话只有几条、只记得助手回复或目标会话不在当前窗口时，原使用方式更直接。合格结果是点选目标后真正落在对应文本节点，而非导航项仅显示。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-36](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/blob/8767427f73bf38be84f3063a2c55bbc461e95352/README.md#L23-L36)

作者说明交互及范围。

<details>
<summary>查看原文（14行）</summary>

```text
## 功能特性

- **常驻右侧导航轨**——屏幕右侧细长竖轨，每条用户消息对应一个指示线，折叠态纯净极简无多余干扰，与官网折叠态 1:1 一致
- **⭐ 重点节点书签与筛选**——展开面板点击 `★` 即可加星标记；折叠态已标记项呈现**高亮金色指示线**；展开面板顶部「★ 只看标记 (n)」支持一键筛选重点问答；本地 `localStorage` 自动持久化
- **全模式主题适配**——1:1 像素级复刻 DeepSeek 官网浅色/深色主题：浅色模式下灰线清爽优雅、白底毛玻璃展开面板；深色模式沉浸暗黑、高对比度金色标记
- **✨ 丝滑跳转与防抖**——点击条目一键平滑跳转到对应消息（按需加载更早历史）；智能防抖锁定机制，彻底消除长对话跨区域跳转时悬浮面板的抽搐乱跳
- **🔄 回退撤回深度兼容**——多层防御式解析联动 `dsh-rewind` 插件，无论中英文提示文案或结构化参数，被回退/撤回的消息均自动从时间线上即时剔除
- **动态避让**——智能检测右侧工作台（如 aionui 等工具栏），自动平移贴合聊天区边缘，避免重叠遮挡
- **自动隐藏与窄屏适配**——会话少于 2 条用户消息时自动隐藏；视口宽度 ≤ 767px（移动端/窄窗口）自动收起防遮挡
- **无障碍**——完善的 ARIA 标签与键盘导航 + 遵循系统「减弱动态效果（prefers-reduced-motion）」设置

## 工作原理

Host 侧通过会话投影（`dshChatTimeline`）持久化枚举所有用户消息（支持 surface replace 自动剔除回退消息）；客户端 `TimelineRail` 组件渲染导航轨（挂载于 `conversation.input.dock` 插槽，portal 到 body），数据源按速度优先：投影 → 已加载节点 → 后台 `loadOlder`。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:84-106](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/blob/8767427f73bf38be84f3063a2c55bbc461e95352/lib/index.js#L84-L106)

只索引直接用户消息。

<details>
<summary>查看原文（23行）</summary>

```text
const messageIndexProjectionDefinition = {
  key: PROJECTION_KEY,
  schema: MessageIndexSchema,
  init: () => ({ messages: [] }),
  apply: (state, event) => {
    // 【中文】只有用户直接发送的消息才会塑造时间线。插件注入与工具注入的
    // 上下文虽然也走 user/message 事件，但它们的 source.kind 不同（任务完成
    // 通知、工具提示、定时提醒、agent.inject 上下文……）——它们是对话里的
    // 上下文行，不是用户发出的消息，因此这里与聊天视图的节点组装器一样，
    // 把它们排除在外。
    //
    // (EN) Only DIRECT user-sent messages shape the timeline. Plugin- and
    // tool-injected context rides the same `user/message` event type with a
    // different `source.kind` (job completions, tool notices, cron
    // notifications, agent.inject context...) — those are context rows in the
    // conversation, not turns the user sent, so they are excluded here exactly
    // as the chat view's node assembler classifies them.
    if (event.type === "user/message") {
      const data = event.data;
      if (data.source === null || typeof data.source !== "object" || data.source.kind !== "user") return state;
      const text = textOf(data.content);
      const entry = { seq: event.seq, time: event.time, text, ...(typeof data.id === "string" ? { id: data.id } : {}) };
      return { messages: [...state.messages, entry] };
```

</details>

**依据 3 · 源码核查**：[lib/client.js:397-414](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/blob/8767427f73bf38be84f3063a2c55bbc461e95352/lib/client.js#L397-L414)

跳到实际宿主节点才返回成功。

<details>
<summary>查看原文（18行）</summary>

```text
    async function jumpToMessage(sessionsService, sessionId, key) {
      const session = sessionsService.binding(sessionId)?.session;
      if (session === void 0) return false;
      let guard = 0;
      while (guard++ < 120) {
        const snapshot = session.getSnapshot();
        if (snapshot?.chat?.nodes?.get(key) !== void 0) break;
        if (snapshot?.hasMore !== true) return false;
        if (snapshot.loadingOlder === true) { await delay(50); continue; }
        await session.loadOlder();
      }
      const scrollport = typeof document !== "undefined" ? document.querySelector("[data-conversation-scroll]") : null;
      const row = scrollport === null ? null : scrollport.querySelector('[data-chat-anchor-key="' + CSS.escape(key) + '"]');
      if (row === null) return false;
      const reducedMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      row.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
      return true;
    }
```

</details>

#### 缺口

- 未做用户任务比较
  **影响**：节时未知
  **进一步探讨**：对相同目标分别用滚动和时间线定位

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 索引、分页和跳转如何串起来？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

宿主需要 sessionProjections，按事件保存 seq、time、预览和消息 ID，预览仅截取文本前 80 个 UTF-16 单元。Web 通过 conversation.input.dock 与会话服务获取投影并过滤被隐藏项，无可用项时读已加载节点。跳转用会话绑定逐页 loadOlder，再以 data-chat-anchor-key 查滚动区域并滚到对应行，窗口不足或没有 DOM 行时返回失败。主题和宿主槽可见性不能保证跳转，DOM 结构和会话分页都属接线条件。代码还对低运动偏好选即时滚动。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:38-69](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/blob/8767427f73bf38be84f3063a2c55bbc461e95352/package.json#L38-L69)

Web 限制和挂载依赖。

<details>
<summary>查看原文（32行）</summary>

```text
  "exports": {
    ".": "./lib/index.js",
    "./client": { "default": "./lib/client.js" },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/*.js",
    "cordis.patch.yml",
    "assets",
    "install.ps1",
    "install.bat",
    "README.md",
    "README.en.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
    }
  },
  "engines": {
    "node": ">=22"
```

</details>

**依据 2 · 源码核查**：[lib/index.js:36-55](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/blob/8767427f73bf38be84f3063a2c55bbc461e95352/lib/index.js#L36-L55)

预览边界。

<details>
<summary>查看原文（20行）</summary>

```text
const PROJECTION_KEY = "dshChatTimeline";

/**
 * 【中文】限制预览文本长度，让投影负载保持小巧（80 字符 ≈ 1-2 行）。
 * (EN) Cap preview text so projection payloads stay small (80 chars ≈ 1-2 lines).
 */
const MAX_TEXT_CHARS = 80;

/**
 * 【中文】拼接 ContentBlock 列表中的文本块（主机侧消息内容）。
 * (EN) Join the text blocks of a ContentBlock list (host-side message content).
 */
function textOf(content) {
  if (!Array.isArray(content)) return "";
  let out = "";
  for (const block of content) {
    if (block !== null && typeof block === "object" && block.type === "text" && typeof block.text === "string") out += block.text;
  }
  return out.trim().slice(0, MAX_TEXT_CHARS);
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:129-137](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/blob/8767427f73bf38be84f3063a2c55bbc461e95352/lib/index.js#L129-L137)

投影注入。

```text
function apply(ctx) {
  // 【中文】向会话投影系统注册本插件的投影定义。
  // (EN) Register this plugin's projection definition with the session projection system.
  ctx.inject(["sessionProjections"], (projectionCtx) => {
    projectionCtx.sessionProjections.register(messageIndexProjectionDefinition);
  });
}

export { Config, apply, name };
```

**依据 4 · 源码核查**：[lib/client.js:397-415](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/blob/8767427f73bf38be84f3063a2c55bbc461e95352/lib/client.js#L397-L415)

至多 120 次判断尝试，按节点滚动。

<details>
<summary>查看原文（19行）</summary>

```text
    async function jumpToMessage(sessionsService, sessionId, key) {
      const session = sessionsService.binding(sessionId)?.session;
      if (session === void 0) return false;
      let guard = 0;
      while (guard++ < 120) {
        const snapshot = session.getSnapshot();
        if (snapshot?.chat?.nodes?.get(key) !== void 0) break;
        if (snapshot?.hasMore !== true) return false;
        if (snapshot.loadingOlder === true) { await delay(50); continue; }
        await session.loadOlder();
      }
      const scrollport = typeof document !== "undefined" ? document.querySelector("[data-conversation-scroll]") : null;
      const row = scrollport === null ? null : scrollport.querySelector('[data-chat-anchor-key="' + CSS.escape(key) + '"]');
      if (row === null) return false;
      const reducedMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      row.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
      return true;
    }

```

</details>

**依据 5 · 源码核查**：[lib/client.js:433-455](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/blob/8767427f73bf38be84f3063a2c55bbc461e95352/lib/client.js#L433-L455)

投影与节点读取。

<details>
<summary>查看原文（23行）</summary>

```text
    function TimelineRail({ useProjection, sessionId, sessionsService, t }) {
      const projected = useProjection("dshChatTimeline");
      const session = sessionId === void 0 ? void 0 : sessionsService.binding(sessionId)?.session;
      const fallbackStore = session === void 0 ? NOOP_STORE : session;
      const nodeSnapshot = react.useSyncExternalStore(
        (cb) => fallbackStore.subscribe(cb),
        () => fallbackStore.getSnapshot()
      );

      const hiddenSeqs = hiddenSeqsOfChat(nodeSnapshot?.chat);
      let messages = [];
      let source = "nodes";
      if (Array.isArray(projected?.messages) && projected.messages.length > 0) {
        messages = filterVisibleMessages(
          projected.messages.map(normalize).filter((m) => m !== null),
          hiddenSeqs
        );
        source = "projection";
      }
      if (messages.length === 0) {
        messages = collectFromNodes(nodeSnapshot);
        source = "nodes";
      }
```

</details>

**依据 6 · 源码核查**：[lib/client.js:758-770](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/blob/8767427f73bf38be84f3063a2c55bbc461e95352/lib/client.js#L758-L770)

Web 槽注入。

<details>
<summary>查看原文（13行）</summary>

```text
    function apply(ctx) {
      // 【中文】注册中英文语言包。
      // (EN) Register zh/en locale dictionaries.
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), "chat-timeline: dictionaries");
      // 【中文】把 TimelineRail 组件注入 conversation.input.dock 插槽。
      // (EN) Inject the TimelineRail component into the conversation.input.dock slot.
      ctx.slots.inject("conversation.input.dock", () => ctx.slots.register({
        name: "conversation.input.dock",
        id: "chat-timeline",
        order: 40,
        locale: NS,
        inject: () => ({ sessionsService: ctx.sessions })
      }, TimelineRail));
```

</details>

#### 缺口

- 未验证宿主私有 DOM 属性跨版本稳定
  **影响**：更新宿主后可能标记可见而不能导航
  **进一步探讨**：用长历史和缩减动态效果测试两种版本

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 撤回和书签何时会失去一致性？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

宿主只在 assistant/message event 到来且 surfaceOp 为 replace 时根据 sourceEventSeqs 删除对应用户记录。因此消费了正确事件修订的回退可以同步，其他消息抽取语义或未带 seq 的回退要靠客户端隐藏筛选或仍被展示。书签存在当前浏览器 localStorage，以会话 ID 组织。更换浏览器、隐私设置或清除存储后无法期待标记继续存在。初次配置需要匹配 Web、宿主和 Node 版本，更长历史还会引入多页加载，未测网络与浏览器成本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:70-81](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/blob/8767427f73bf38be84f3063a2c55bbc461e95352/lib/index.js#L70-L81)

具体 replace 和 seq 检查。

<details>
<summary>查看原文（12行）</summary>

```text
function dropShadowedMessages(state, event) {
  const op = event.surfaceOp;
  if (op === null || typeof op !== "object" || op.op !== "replace") return state;
  const shadowed = event.sourceEventSeqs;
  if (!Array.isArray(shadowed) || shadowed.length === 0) return state;
  const hide = new Set();
  for (const seq of shadowed) {
    if (typeof seq === "number" && Number.isFinite(seq)) hide.add(seq);
  }
  if (hide.size === 0) return state;
  const next = state.messages.filter((m) => !hide.has(m.seq));
  return next.length === state.messages.length ? state : { messages: next };
```

</details>

**依据 2 · 源码核查**：[lib/index.js:108-119](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/blob/8767427f73bf38be84f3063a2c55bbc461e95352/lib/index.js#L108-L119)

只在相应助手事件分支处理。

<details>
<summary>查看原文（12行）</summary>

```text
    // 【中文】回退 / 其他 surface replace：从索引里移除被剪掉的用户消息。
    // 压缩（compaction）不会走这条路径去掉用户消息（见文件头部说明）。
    // (EN) Rewind / other surface replaces: remove cut user messages from the
    // index. Compaction does not drop user messages this way (see header note).
    if (event.type === "assistant/message") {
      return dropShadowedMessages(state, event);
    }
    return state;
  },
  view: (state) => state,
  stateVersion: 5
};
```

</details>

**依据 3 · 源码核查**：[lib/client.js:202-229](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/blob/8767427f73bf38be84f3063a2c55bbc461e95352/lib/client.js#L202-L229)

书签读取和持久化边界。

<details>
<summary>查看原文（28行）</summary>

```text
    /** 【中文】从 localStorage 读取该会话的已标记列表。
     * (EN) Read marked message keys for a session from localStorage. */
    function readMarks(sessionId) {
      if (typeof window === "undefined" || !sessionId) return [];
      try {
        const raw = window.localStorage.getItem(MARKS_STORAGE_PREFIX + sessionId);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    /** 【中文】把已标记列表持久化到 localStorage。
     * (EN) Write marked message keys for a session to localStorage. */
    function writeMarks(sessionId, marks) {
      if (typeof window === "undefined" || !sessionId) return;
      try {
        if (!Array.isArray(marks) || marks.length === 0) {
          window.localStorage.removeItem(MARKS_STORAGE_PREFIX + sessionId);
        } else {
          window.localStorage.setItem(MARKS_STORAGE_PREFIX + sessionId, JSON.stringify(marks));
        }
      } catch {}
    }

    /** 【中文】辅助函数：从数值或字符串中安全提取 seq 数字。
```

</details>

**依据 4 · 源码核查**：[lib/client.js:501-524](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/blob/8767427f73bf38be84f3063a2c55bbc461e95352/lib/client.js#L501-L524)

缺投影时尝试后台加载。

<details>
<summary>查看原文（24行）</summary>

```text
      react.useEffect(() => {
        if (session === void 0 || isNarrow) return;
        setLoadedAll(false);
        if (Array.isArray(projected?.messages) && projected.messages.length > 0) {
          setLoadedAll(true);
          return;
        }
        let cancelled = false;
        const run = async () => {
          let guard = 0;
          while (!cancelled && guard++ < 120) {
            if (Array.isArray(projected?.messages) && projected.messages.length > 0) {
              setLoadedAll(true);
              return;
            }
            const snap = session.getSnapshot();
            if (snap?.hasMore !== true) { setLoadedAll(true); return; }
            if (snap.loadingOlder === true) { await delay(50); continue; }
            await session.loadOlder();
          }
          if (!cancelled) setLoadedAll(true);
        };
        run().catch(() => { if (!cancelled) setLoadedAll(true); });
        return () => { cancelled = true; };
```

</details>

#### 缺口

- 未在宿主执行回退或换浏览器
  **影响**：不能承诺跨客户端状态同步
  **进一步探讨**：验证已标记节点回退、重开及浏览器清理

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样判断时间线可以省掉定位工夫？

**研究主题**：新假设与验证、采用判断

#### 完整回答

复制一条脱敏长会话，提前记两个用户输入和真实序号。先用原生滚动或可用搜索，再用插件跳转及星标，比较正确命中率、载入等待及恢复。视口窄、目标不存在或已回退时记录失败，不把未调出卡片当作用户没有操作。可进一步给列表区分投影完整和节点回退，测试能否减少误以为历史缺失的重复点击。若无显著改善，或滚动延迟抵消节省，恢复原生视图。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:401-412](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/blob/8767427f73bf38be84f3063a2c55bbc461e95352/lib/client.js#L401-L412)

分页和可用节点判断。

<details>
<summary>查看原文（12行）</summary>

```text
      while (guard++ < 120) {
        const snapshot = session.getSnapshot();
        if (snapshot?.chat?.nodes?.get(key) !== void 0) break;
        if (snapshot?.hasMore !== true) return false;
        if (snapshot.loadingOlder === true) { await delay(50); continue; }
        await session.loadOlder();
      }
      const scrollport = typeof document !== "undefined" ? document.querySelector("[data-conversation-scroll]") : null;
      const row = scrollport === null ? null : scrollport.querySelector('[data-chat-anchor-key="' + CSS.escape(key) + '"]');
      if (row === null) return false;
      const reducedMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      row.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
```

</details>

**依据 2 · 源码核查**：[lib/client.js:442-467](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline/blob/8767427f73bf38be84f3063a2c55bbc461e95352/lib/client.js#L442-L467)

回退数据源及窄屏处理。

<details>
<summary>查看原文（26行）</summary>

```text
      const hiddenSeqs = hiddenSeqsOfChat(nodeSnapshot?.chat);
      let messages = [];
      let source = "nodes";
      if (Array.isArray(projected?.messages) && projected.messages.length > 0) {
        messages = filterVisibleMessages(
          projected.messages.map(normalize).filter((m) => m !== null),
          hiddenSeqs
        );
        source = "projection";
      }
      if (messages.length === 0) {
        messages = collectFromNodes(nodeSnapshot);
        source = "nodes";
      }

      const [loadedAll, setLoadedAll] = react.useState(false);
      const [activeIndex, setActiveIndex] = react.useState(-1);
      const [show, setShow] = react.useState(false);
      const [rightOffset, setRightOffset] = react.useState(12);

      // 重点标记状态
      const [marks, setMarks] = react.useState(() => readMarks(sessionId));
      const [marksOnly, setMarksOnly] = react.useState(false);

      // 视口尺寸守卫（窄屏自动隐藏）
      const [isNarrow, setIsNarrow] = react.useState(() => typeof window !== "undefined" && window.innerWidth <= 767);
```

</details>

#### 缺口

- 缺真实宿主耗时数据
  **影响**：试用要独立核验
  **进一步探讨**：回放已知早期输入和撤回样例

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
