# dsh-web-ui-notify

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9130800](https://github.com/bill9109/dsh-web-ui-notify/tree/9130800a2553e3a64937e426ea4a5346d3f99a88)

<!-- BEGIN META -->
[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bill9109/dsh-web-ui-notify) [![npm 30d 1,402](https://img.shields.io/static/v1?label=npm+30d&message=1%2C402&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-ui-notify) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-ui-notify)
<!-- END META -->

> **功能**：为 DeepSeek Harness Web 的审批、提问和任务完成发送桌面通知。

> **亮点**：[Q01](#research-q01) 核实后台状态订阅与点击回会话，减少切换多个页面检查待审批事件。

> **主要限制**：[Q02](#research-q02) 发现发送前先去重，授权变化或浏览器异常可能漏提醒；系统通知也可能展示会话片段。

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
  - [Q01 · 什么事件会变成可跳回原会话的通知？](#detail-section-11)
  - [Q02 · 去重何时会放弃一条原本没有送达的提醒？](#detail-section-12)
  - [Q03 · 怎样试用而不会把通知当成唯一审批入口？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：同时使用多个 Web 会话的人，可离开当前页面后通过桌面提醒回到待处理会话。

用户可保留原生页面提示并主动轮询会话，通知只提供额外传递渠道。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 后台互动提醒 | 发现待审批和提问 | 需要浏览器权限和持续打开页面 |
| 回到会话 | 点击打开对应会话 | 宿主导航服务必须可用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Web 状态服务 | 是 | 获取交互和轮次状态 | 按原网页处理 |
| 打开页面且通知权限已授予 | 是 | 向系统送出提醒 | 原生 Web 仍可操作 |
| 支持跨页通信和存储 | 去重需要 | 协调不同标签 | 可能重复或漏报 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在隔离环境开启权限 | 显示一条公开测试提醒 |
| 执行 | 切后台并触发合成审批 | 通知回到正确会话 |
| 退出 | 撤销权限并禁用组件 | 原网页审批仍可用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 浏览器与宿主环境，费用未知 | 核对权限和锁屏设置 | 不同系统行为待验 |
| 持续 | 事件订阅与跨页消息 | 保留网页并复核状态 | 实际资源及响应耗时未知 |
| 失败恢复 | 重新开启页面，资源未知 | 从原会话检查待处理项 | 重复或漏报需对照 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 后台提醒 | 状态订阅和 Notification | 实际漏报率 |
| 点击跳回 | 调用 uiWorkspace.openSession | 目标浏览器是否聚焦 |
| 跨页去重 | 权限、可见性和去重键参与选举 | 异常后的补发 |

> **思考**：[Q02](#research-q02) 发现发送前先去重，授权变化或浏览器异常可能漏提醒；系统通知也可能展示会话片段。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 核实后台状态订阅与点击回会话，减少切换多个页面检查待审批事件。

[Q02](#research-q02) 分离跨页通信与状态订阅便于复查，但发送前写去重标记将失败与成功合并。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 发现发送前先去重，授权变化或浏览器异常可能漏提醒；系统通知也可能展示会话片段。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用公开合成任务试用，并按 [Q02](#research-q02) 检查权限切换与通知正文。原生 Web 状态仍作为审批依据。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定客户端支持实际订阅、跨页选举与通知；送达、权限与锁屏效果待验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读固定宿主/客户端映射、状态订阅、跨页选举、通知和清理；未执行插件、浏览器或真实宿主。
- 下一步：用隔离浏览器测试前后台、两个标签、先无权限后授权、系统锁屏与关闭页面，并核对禁用后行为。

**分析版本**

- **仓库**：[bill9109/dsh-web-ui-notify](https://github.com/bill9109/dsh-web-ui-notify)
- **版本号**：0.1.7（[固定提交 9130800](https://github.com/bill9109/dsh-web-ui-notify/tree/9130800a2553e3a64937e426ea4a5346d3f99a88)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提出分开发现与送达标记，在授权变化和双标签对照中检验漏报与重复。

用隔离浏览器测试前后台、两个标签、先无权限后授权、系统锁屏与关闭页面，并核对禁用后行为。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 414 | — | — | 4616 |
| .js | source | 8 | 1529 | 1114 | 428 | — |
| .mjs | source | 5 | 293 | 205 | 67 | — |
| .ts | source | 6 | 1024 | 592 | 368 | — |
| .tsx | source | 1 | 63 | 46 | 12 | — |
| .ts | test | 1 | 722 | 611 | 62 | — |
| .tsx | test | 1 | 72 | 62 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/bill9109/dsh-web-ui-notify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/bill9109/dsh-web-ui-notify/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/bill9109/dsh-web-ui-notify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用户切到其他标签时，插件怎样把会话阻塞或完成通知送到桌面，何时会丢提醒或暴露会话信息？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么事件会变成可跳回原会话的通知？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

同时跑多个 Web 会话的用户离开主视图时，可以收到待审批、提问或完成提示。客户端独立订阅 sessionStatus，枚举全部会话的待处理交互与未读完成；当前会话另订阅 chat legacy 的轮次结束并吸收首扫历史。每条待处理交互用 session ID 与 wait key 去重；选举后进入浏览器 Notification，点击后窗口聚焦并调用 uiWorkspace.openSession。和切回 Web 逐页查看相比，增量是把需要人介入的状态送出原视图。关闭所有标签后，客户端订阅无法继续提供此路径。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-28](https://github.com/bill9109/dsh-web-ui-notify/blob/9130800a2553e3a64937e426ea4a5346d3f99a88/README.md#L14-L28)

作者的通知场景与承诺。

<details>
<summary>查看原文（15行）</summary>

```text
## Why this exists

While you browse other pages, DSH needs human confirmation (tool approvals, questions) or finishes a round of work, and the Web UI in the foreground tab is the only place it asks. If you are looking anywhere else, the request waits silently. This plugin moves those moments onto your desktop: a native system notification appears, names the session, and clicks back into the conversation.

## Features

- **Notify on interaction with the current session**: tool approvals and DSH questions carry context in the body (approvals show the over-permission reason, questions show the question text)
- **Notify on background sessions too**: sessions you are not looking at also notify when they need approval or a question (same contextual body as the current session); a finished background session notifies as well — click it to jump straight to that session
- **Notify on turn completion**: every finished turn of the current session notifies, with the first 80 characters of the final answer; tool-only turns without a final answer show the turn number. Completion, interruption, and error turns all notify
- **Session name in the title**: every notification title names its session, e.g. "Refactor database · needs approval"
- **Click to jump to the session**: clicking a notification not only returns to the DSH page but also opens that session
- Notifies only while you are away from the tab; when the page is in the foreground DSH already shows its own prompts, so it does not double-notify
- Each event notifies once — reconnects do not repeat it, and opening a session with history does not replay old turns
- Notifications do not auto-dismiss after a few seconds; they wait for you
- A toggle lives in Settings → General, following the DSH language (zh/en)
```

</details>

**依据 2 · 源码核查**：[lib/client.js:156-181](https://github.com/bill9109/dsh-web-ui-notify/blob/9130800a2553e3a64937e426ea4a5346d3f99a88/lib/client.js#L156-L181)

权限条件、系统通知构造和点击动作。

<details>
<summary>查看原文（26行）</summary>

```text
		function notificationUsable() {
			return typeof Notification !== "undefined" && Notification.permission === "granted";
		}
		/**
		* Attach the click-to-jump behavior shared by every notification this plugin
		* builds: raise the window, jump to the source conversation, and dismiss.
		*/
		function withClickFocus(notification, onOpen) {
			notification.onclick = () => {
				window.focus();
				onOpen();
				notification.close();
			};
			return notification;
		}
		/** Compose a notification title: the session label first, then the kind title. */
		function titled(kindTitle, label) {
			return label === "" ? kindTitle : `${label} · ${kindTitle}`;
		}
		/** The one rendering path every notification kind funnels through. */
		function show(title, body, tag, target) {
			return withClickFocus(new Notification(title, {
				body,
				tag,
				requireInteraction: true
			}), target.onOpen);
```

</details>

**依据 3 · 源码核查**：[lib/client.js:613-656](https://github.com/bill9109/dsh-web-ui-notify/blob/9130800a2553e3a64937e426ea4a5346d3f99a88/lib/client.js#L613-L656)

点击打开与当前会话的完成状态扫描。

<details>
<summary>查看原文（44行）</summary>

```text
			const openOf = (sid) => () => {
				if (sessions.list.getSnapshot().byId[sid] === void 0) return;
				try {
					ctx.uiWorkspace.openSession(sid);
				} catch (error) {
					degrade("session navigation (uiWorkspace.openSession)", error);
				}
			};
			/** Scan the current session's chat snapshot; notify newly finished turns.
			*  alpha2 moved turnEnds/nodes off the session snapshot onto the Chat view's
			*  legacy projection, so this reads the chat target. A chat view that is not
			*  materialized yet yields undefined and is simply skipped. The turn's
			*  `turn/end` reason comes from the same snapshot's timeline, so a stopped or
			*  failed turn is not reported as a finished one.
			*/
			const scan = () => {
				try {
					const current = mainSessionId(sessions.list.getSnapshot());
					if (current === void 0) return;
					const snapshot = ctx.uiConversation.binding(current).target("chat").getSnapshot();
					if (snapshot === void 0) return;
					if (snapshot.legacy === void 0) {
						degrade("chat legacy slice (ChatSnapshot.legacy)", /* @__PURE__ */ new Error("ChatSnapshot.legacy is missing"));
						return;
					}
					let turns = seenTurns.get(current);
					if (turns === void 0) {
						turns = new Set(snapshot.legacy.turnEnds.keys());
						seenTurns.set(current, turns);
						return;
					}
					for (const turn of snapshot.legacy.turnEnds.keys()) {
						if (turns.has(turn)) continue;
						turns.add(turn);
						const facts = turnFactsOf(snapshot.timeline?.turns.get(turn)?.end?.data.reason);
						if (facts === void 0) continue;
						const tag = `${current}:turn:${turn}`;
						pages.elect(tag, current, "showing-session", () => {
							fireTurnNotification(turn, turnSummaryOf(snapshot.legacy.nodes, turn), facts, t, {
								label: labelOf(current),
								onOpen: openOf(current),
								tag
							});
						});
```

</details>

**依据 4 · 源码核查**：[lib/client.js:676-709](https://github.com/bill9109/dsh-web-ui-notify/blob/9130800a2553e3a64937e426ea4a5346d3f99a88/lib/client.js#L676-L709)

后台会话状态扫描与事件键。

<details>
<summary>查看原文（34行）</summary>

```text
			const scanStatus = () => {
				try {
					const statuses = ctx.uiSession.sessionStatus.getSnapshot();
					const current = mainSessionId(sessions.list.getSnapshot());
					for (const [sid, status] of statuses) {
						const wait = status.pendingInteraction;
						if (wait !== void 0) {
							const key = `${sid}:${wait.key}`;
							if (!notified.has(key)) {
								notified.add(key);
								pages.elect(key, sid, "any-page", () => {
									fireNotification(wait, t, {
										label: labelOf(sid),
										onOpen: openOf(sid),
										tag: key
									});
								});
							}
						}
						if (status.completionUnread === true && sid !== current) {
							if (!completionNotified.has(sid)) {
								completionNotified.add(sid);
								pages.elect(`${sid}:done`, sid, "any-page", () => {
									fireSessionDoneNotification(t, {
										label: labelOf(sid),
										onOpen: openOf(sid),
										tag: `${sid}:done`
									});
								});
							}
						} else if (status.completionUnread !== true) {
							completionNotified.delete(sid);
							pages.forget(`${sid}:done`);
						}
```

</details>

**依据 5 · 源码核查**：[lib/client.js:732-748](https://github.com/bill9109/dsh-web-ui-notify/blob/9130800a2553e3a64937e426ea4a5346d3f99a88/lib/client.js#L732-L748)

订阅与清理。

<details>
<summary>查看原文（17行）</summary>

```text
			const unsubList = sessions.list.subscribe(() => {
				watchCurrent();
				syncView();
			});
			const unsubStatus = ctx.uiSession.sessionStatus.subscribe(scanStatus);
			const onVisibilityChange = () => syncView();
			if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVisibilityChange);
			syncView();
			watchCurrent();
			scanStatus();
			ctx.effect(() => () => {
				unsubList();
				unsubStatus();
				unsubSession?.();
				if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVisibilityChange);
				pages.close();
			}, "ui-notify: session subscription");
```

</details>

#### 缺口

- 当前宿主版本的状态投影与真实浏览器权限
  **影响**：影响各类事件是否能发送
  **进一步探讨**：用合成审批和完成事件分别覆盖前台、后台与关闭页面

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 去重何时会放弃一条原本没有送达的提醒？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

scanStatus 在选举前将交互键加入本页集合，随后即便选举因无获权页而返回 false，也没有在这条分支移除同一键。已授权页胜出时，选举还会先 markShown 再调用 fire；如果构造 Notification 抛错，去重记录已经写入。因而先拒绝通知权限、同一 pending 尚在时再授权，或浏览器发送异常，都可能漏掉这一事件。跨页 BroadcastChannel 和存储帮助去重，落后的标签按定时回退补发；它也不证明每次一定只有一个系统弹窗。通知正文可含审批原因、问题片段或计划文本，系统锁屏是否展示取决于浏览器及操作系统。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:156-181](https://github.com/bill9109/dsh-web-ui-notify/blob/9130800a2553e3a64937e426ea4a5346d3f99a88/lib/client.js#L156-L181)

权限判断和直接构造通知。

<details>
<summary>查看原文（26行）</summary>

```text
		function notificationUsable() {
			return typeof Notification !== "undefined" && Notification.permission === "granted";
		}
		/**
		* Attach the click-to-jump behavior shared by every notification this plugin
		* builds: raise the window, jump to the source conversation, and dismiss.
		*/
		function withClickFocus(notification, onOpen) {
			notification.onclick = () => {
				window.focus();
				onOpen();
				notification.close();
			};
			return notification;
		}
		/** Compose a notification title: the session label first, then the kind title. */
		function titled(kindTitle, label) {
			return label === "" ? kindTitle : `${label} · ${kindTitle}`;
		}
		/** The one rendering path every notification kind funnels through. */
		function show(title, body, tag, target) {
			return withClickFocus(new Notification(title, {
				body,
				tag,
				requireInteraction: true
			}), target.onOpen);
```

</details>

**依据 2 · 源码核查**：[lib/client.js:207-215](https://github.com/bill9109/dsh-web-ui-notify/blob/9130800a2553e3a64937e426ea4a5346d3f99a88/lib/client.js#L207-L215)

通知正文采用交互字段。

```text
		function fireNotification(wait, t, target) {
			const title = titled(wait.kind === "approval" ? t("notify.approval.title") : wait.kind === "plan-review" ? t("notify.plan.title") : t("notify.question.title"), target.label);
			let body;
			if (wait.kind === "approval") body = wait.reason ?? t("notify.approval.body", { toolName: wait.toolName });
			else if (wait.kind === "plan-review") {
				const first = wait.questions[0];
				body = excerptOf(first?.detail, PLAN_MAX) ?? excerptOf(first?.question, PLAN_MAX) ?? t("notify.plan.body");
			} else body = excerptOf(wait.questions[0]?.question, PLAN_MAX) ?? t("notify.question.bodyGeneric");
			return show(title, body, target.tag, target);
```

**依据 3 · 源码核查**：[lib/client.js:352-370](https://github.com/bill9109/dsh-web-ui-notify/blob/9130800a2553e3a64937e426ea4a5346d3f99a88/lib/client.js#L352-L370)

持久与跨页去重写入。

<details>
<summary>查看原文（19行）</summary>

```text
			const markShown = (key) => {
				shown.add(key);
				memory?.write(`${MEMORY_PREFIX}${key}`, JSON.stringify({ at: now() }));
				bus?.postMessage({
					kind: "shown",
					id: pageId,
					key,
					at: now()
				});
			};
			const shownBefore = (key) => {
				if (shown.has(key)) return true;
				const raw = memory?.read(`${MEMORY_PREFIX}${key}`);
				if (raw === null || raw === void 0) return false;
				try {
					const parsed = JSON.parse(raw);
					return typeof parsed.at === "number" && now() - parsed.at < MEMORY_TTL_MS;
				} catch {
					return false;
```

</details>

**依据 4 · 源码核查**：[lib/client.js:420-441](https://github.com/bill9109/dsh-web-ui-notify/blob/9130800a2553e3a64937e426ea4a5346d3f99a88/lib/client.js#L420-L441)

无获权候选返回，赢家先标记后发送。

<details>
<summary>查看原文（22行）</summary>

```text
				elect: (key, sessionId, scope, fire) => {
					if (shownBefore(key)) return false;
					if (view.visible && view.sessionId === sessionId) return false;
					if (live().some((peer) => peer.visible && peer.sessionId === sessionId)) return false;
					const winner = [selfState(), ...live()].filter((candidate) => candidate.granted).filter((candidate) => scope === "any-page" || candidate.sessionId === sessionId).sort((left, right) => Number(right.visible) - Number(left.visible) || (left.id < right.id ? -1 : 1))[0];
					if (winner === void 0) return false;
					if (winner.id === pageId) {
						markShown(key);
						fire();
						return true;
					}
					const timer = setTimeout(() => {
						fallbacks.delete(key);
						if (shown.has(key)) return;
						markShown(key);
						fire();
					}, FALLBACK_MS);
					timer.unref?.();
					fallbacks.set(key, () => {
						clearTimeout(timer);
					});
					return false;
```

</details>

**依据 5 · 源码核查**：[lib/client.js:676-705](https://github.com/bill9109/dsh-web-ui-notify/blob/9130800a2553e3a64937e426ea4a5346d3f99a88/lib/client.js#L676-L705)

待处理事件先写本地键再选举。

<details>
<summary>查看原文（30行）</summary>

```text
			const scanStatus = () => {
				try {
					const statuses = ctx.uiSession.sessionStatus.getSnapshot();
					const current = mainSessionId(sessions.list.getSnapshot());
					for (const [sid, status] of statuses) {
						const wait = status.pendingInteraction;
						if (wait !== void 0) {
							const key = `${sid}:${wait.key}`;
							if (!notified.has(key)) {
								notified.add(key);
								pages.elect(key, sid, "any-page", () => {
									fireNotification(wait, t, {
										label: labelOf(sid),
										onOpen: openOf(sid),
										tag: key
									});
								});
							}
						}
						if (status.completionUnread === true && sid !== current) {
							if (!completionNotified.has(sid)) {
								completionNotified.add(sid);
								pages.elect(`${sid}:done`, sid, "any-page", () => {
									fireSessionDoneNotification(t, {
										label: labelOf(sid),
										onOpen: openOf(sid),
										tag: `${sid}:done`
									});
								});
							}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样试用而不会把通知当成唯一审批入口？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

在持续开着的隔离浏览器里使用无敏感文本的会话，启用通知权限，核对后台审批提示及点击回到原会话。并行开两个页，先拒绝后恢复权限，比较是否能为未解除的交互补发；用目标系统设置确认锁屏是否展示。保留 Web 原生审批界面作为来源，并可撤销通知权限、禁用组件后刷新。可检验的改进是分开记录“观察到”与“浏览器已接受”，只有成功构造后传播去重确认；测试权限变化、构造失败和两标签并发，如果能减少漏报且重复提醒没有增加，再采用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:54-65](https://github.com/bill9109/dsh-web-ui-notify/blob/9130800a2553e3a64937e426ea4a5346d3f99a88/package.json#L54-L65)

Web 能力注入。

<details>
<summary>查看原文（12行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-chat",
        "@deepseek-ai/dsh-client-ui-session",
```

</details>

**依据 2 · 作者声明**：[README.md:48-64](https://github.com/bill9109/dsh-web-ui-notify/blob/9130800a2553e3a64937e426ea4a5346d3f99a88/README.md#L48-L64)

作者的重启及禁用路径。

<details>
<summary>查看原文（17行）</summary>

````text
After installing, **restart the Web UI** (the way you normally start DSH) and refresh the browser page — the plugin takes effect.

### Upgrade

```sh
dsh plugin --profile web update github:omdsh-dev/dsh-web-ui-notify
```

For a local-path installation, run `add` again against the replacement checkout. User settings (the Settings → General toggle) live in the profile's Settings provider and survive upgrades.

### Uninstall

```sh
dsh plugin --profile web remove dsh-web-ui-notify
```

The command runs `pnpm remove <pkg>` in the profile directory and removes it from `dsh.profile.bundles`. After uninstalling, restart web and hard-refresh the browser.
````

</details>

**依据 3 · 源码核查**：[lib/client.js:731-754](https://github.com/bill9109/dsh-web-ui-notify/blob/9130800a2553e3a64937e426ea4a5346d3f99a88/lib/client.js#L731-L754)

订阅、清理与设置入口。

<details>
<summary>查看原文（24行）</summary>

```text
			};
			const unsubList = sessions.list.subscribe(() => {
				watchCurrent();
				syncView();
			});
			const unsubStatus = ctx.uiSession.sessionStatus.subscribe(scanStatus);
			const onVisibilityChange = () => syncView();
			if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVisibilityChange);
			syncView();
			watchCurrent();
			scanStatus();
			ctx.effect(() => () => {
				unsubList();
				unsubStatus();
				unsubSession?.();
				if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVisibilityChange);
				pages.close();
			}, "ui-notify: session subscription");
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "web-ui-notify",
				order: 30,
				locale: NS
			}, NotificationSettingsRow));
```

</details>

**依据 4 · 源码核查**：[lib/client.js:426-438](https://github.com/bill9109/dsh-web-ui-notify/blob/9130800a2553e3a64937e426ea4a5346d3f99a88/lib/client.js#L426-L438)

确认次序与定时回退。

<details>
<summary>查看原文（13行）</summary>

```text
					if (winner.id === pageId) {
						markShown(key);
						fire();
						return true;
					}
					const timer = setTimeout(() => {
						fallbacks.delete(key);
						if (shown.has(key)) return;
						markShown(key);
						fire();
					}, FALLBACK_MS);
					timer.unref?.();
					fallbacks.set(key, () => {
```

</details>

#### 缺口

- 未验证系统级通知呈现与隔离 profile 卸载
  **影响**：影响隐私和退出
  **进一步探讨**：对照浏览器、操作系统与禁用后事件

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
