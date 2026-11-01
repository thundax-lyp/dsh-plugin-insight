# dsh-harness-chat-control

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[841f42f](https://github.com/1985899182/dsh-harness-chat-control/tree/841f42f66d30cd86131d1c7c1553a0775e6a280a)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1985899182/dsh-harness-chat-control) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-harness-chat-control)
<!-- END META -->

> **功能**：在 DSH Desktop 中引用回答并创建侧边追问会话。

> **亮点**：[Q02](#research-q02) 将引用与独立侧聊接入现有宿主。

> **主要限制**：[Q03](#research-q03) 快照不是已证明的实时同步，取消不撤销外部副作用。

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
  - [Q01 · 引用追问和侧聊比直接追问多什么？](#detail-section-11)
  - [Q02 · 侧聊如何继承主会话，如何发送和取消？](#detail-section-12)
  - [Q03 · 侧聊是实时同步还是启动时的快照？](#detail-section-13)
  - [Q04 · 适合什么条件，失败怎样处理？](#detail-section-14)
  - [Q05 · 如何让用户决定是否刷新上下文或继续追问？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望引用回答并在侧边继续追问的 DSH 用户。

复制选文到主会话或手工开新会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 引用 | 在侧聊中带入上下文 | 注意敏感信息 |
| 侧聊 | 独立追问 | 继承为创建时快照 |
| 取消 | 请求停止子 agent | 不保证撤销外部副作用 |
| 失败提示 | 显示错误 | 实际发送状态需核查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH Desktop | 必需 | UI 和会话服务 | 插件功能不可用 |
| 模型服务 | 生成回答必需 | 子会话回答 | 无法生成 |
| 用户确认引用内容 | 敏感场景必需 | 避免不当复制 | 应停止发送 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对兼容宿主和模型 | 不兼容则使用普通会话 |
| 引用 | 用户选文并打开侧聊 | 检查内容和目标 |
| 追问 | 用户发送或取消 | 失败先核对是否已发送 |
| 验收 | 用户核对答案与主上下文 | 快照过时则重新引用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主与模型费用未知 | 安装和兼容配置时间未知 | 需匹配版本 |
| 持续使用 | 子会话模型和存储消耗未知 | 选文和核对时间未知 | 复制上下文可能含敏感内容 |
| 失败恢复 | 重试模型费用未知 | 查发送状态与恢复时间未知 | 取消外部效果未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 引用侧聊 | 源码创建子会话并发送 | 节时与回答质量 |
| 上下文 | 复制已完成事件，未完成作快照 | 后续自动同步和模型遵循 |
| 取消 | 向子 agent 请求 cancel | 外部动作撤销 |

> **思考**：[Q03](#research-q03) 快照不是已证明的实时同步，取消不撤销外部副作用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将引用与独立侧聊接入现有宿主。

[Q02](#research-q02) 未完成轮次以快照传递；[Q03](#research-q03) 不是实时同步证明。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 快照不是已证明的实时同步，取消不撤销外部副作用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 核对引用与目标，断连后先查发送状态。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码静态核查；未运行 Desktop、模型或侧聊。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码静态检查；未运行宿主、模型或远端工具。
- 下一步：隔离宿主测试主会话变化、侧聊取消、断连与恢复。

**分析版本**

- **仓库**：[1985899182/dsh-harness-chat-control](https://github.com/1985899182/dsh-harness-chat-control)
- **版本号**：0.3.10（[固定提交 841f42f](https://github.com/1985899182/dsh-harness-chat-control/tree/841f42f66d30cd86131d1c7c1553a0775e6a280a)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对照已有引用和快照，验证新鲜度提示的决策收益。

隔离宿主测试主会话变化、侧聊取消、断连与恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 453 | — | — | 6619 |
| .js | source | 2 | 6489 | 5238 | 1066 | — |
| .mjs | source | 3 | 1484 | 1334 | 92 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/1985899182/dsh-harness-chat-control/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查选文侧聊、上下文继承和取消的证据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 引用追问和侧聊比直接追问多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DSH 用户可选择回答片段并在侧边继续问，主会话不必被新问题占用；直接复制选文到主会话或手工开新会话也可完成部分工作。是否更快及回答质量未测。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-14](https://github.com/1985899182/dsh-harness-chat-control/blob/841f42f66d30cd86131d1c7c1553a0775e6a280a/README.md#L1-L14)

作者描述选文及侧聊。

<details>
<summary>查看原文（14行）</summary>

```text
# dsh-harness-chat-control

在 DSH Desktop 里加入「引用式追问」：划选回答中的任意文字即可引用，带到主对话或独立的侧边对话继续问；答案生成到一半想改问题，也能随时停下就地改。

[English](README_EN.md) · [日本語](README_JA.md) · [한국어](README_KO.md)

## 功能截图

**选中即引用**——在回答里划选一段文字，浮出的工具条提供「添加到对话 / 更多详情 / 在侧边聊天中提问」。

![选中文字工具条](docs/screenshots/selection-toolbar.png)

**侧边对话**——引用带到右侧独立会话，主对话不被打断，引用以注释胶囊挂在输入框上。

```

</details>

**依据 2 · 源码核查**：[lib/client.js:4653-4666](https://github.com/1985899182/dsh-harness-chat-control/blob/841f42f66d30cd86131d1c7c1553a0775e6a280a/lib/client.js#L4653-L4666)

侧聊发送及清空输入。

<details>
<summary>查看原文（14行）</summary>

```text
			const handleSend = async () => {
				const text = composer.trim();
				if (text === "" || threadId === void 0 || busy !== null) return;
				setBusy("sending");
				setError(null);
				try {
					const wireText = typeof draftStore?.format === "function" ? draftStore.format(threadId, text) : text;
					await api.sidechatPrompt(threadId, wireText);
					draftStore?.clear?.(threadId);
					setReferenceText("");
					setComposer("");
					const field = composerRef.current;
					if (field !== null) field.style.height = "";
					fetchThread(threadId);
```

</details>

#### 缺口

- 未与手工流程对照
  **影响**：无法量化收益
  **进一步探讨**：相同问题比较操作时间和引用正确性。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 侧聊如何继承主会话，如何发送和取消？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

创建侧聊时复制已结束轮次，进行中轮次则生成引用快照，不把未完成轮次当作子会话原始事件。创建使用父配置和 Agent 服务，后续发消息到子会话；客户端取消调用 sidechatCancel，宿主对已找到的 agent 调 cancel 并保留 inbox。取消请求不是外部工具副作用回滚证明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:368-392](https://github.com/1985899182/dsh-harness-chat-control/blob/841f42f66d30cd86131d1c7c1553a0775e6a280a/lib/index.js#L368-L392)

区分已完成事件与未完成快照。

<details>
<summary>查看原文（25行）</summary>

```text
* Build the side-thread inheritance for one parent log: every COMPLETED turn
* up to the click moment.
*
* The parent's open turn is never inherited as log events.  It holds the
* question the user just asked the MAIN conversation plus the assistant
* output still streaming for it; copying those events into the child would
* make the child's own log claim the main question as one of its user
* messages, so the side panel would show the main conversation's question
* and the side model could answer it instead of the side question.  The open
* turn is handed over as a fenced, reference-only snapshot instead (see
* buildOpenTurnSnapshot), which rides the boundary injection.
*/
function buildSidechatInheritance(events) {
	if (events.length === 0) return {
		seed: [],
		snapshot: null
	};
	const boundary = lastTurnBoundary(events);
	if (boundary < 0 || events[boundary]?.type === "turn/end") return {
		seed: copyEvents(events),
		snapshot: null
	};
	return {
		seed: copyEvents(events.slice(0, boundary)),
		snapshot: buildOpenTurnSnapshot(events)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:685-701](https://github.com/1985899182/dsh-harness-chat-control/blob/841f42f66d30cd86131d1c7c1553a0775e6a280a/lib/index.js#L685-L701)

子 agent 创建和失败。

<details>
<summary>查看原文（17行）</summary>

```text
					delegationDepth: (parentSession.header.delegationDepth ?? 0) + 1,
					...agentPreset === void 0 ? {} : { agentPreset }
				},
				seed,
				agentOptions: { ...parent.options },
				setup,
				signal: AbortSignal.timeout(CREATE_TIMEOUT_MS)
			};
			const agents = ctx.get("agents");
			if (agents?.create === void 0) throw new SidechatModelError("sidechat-error", "the agents service is unavailable", 503);
			let handle;
			try {
				handle = await agents.create(options);
			} catch (error) {
				throw new SidechatModelError("sidechat-error", `thread creation failed: ${error instanceof Error ? error.message : String(error)}`, 500);
			}
			threadDisposers.set(childId, () => handle.dispose());
```

</details>

**依据 3 · 源码核查**：[lib/index.js:720-764](https://github.com/1985899182/dsh-harness-chat-control/blob/841f42f66d30cd86131d1c7c1553a0775e6a280a/lib/index.js#L720-L764)

侧聊消息及取消。

<details>
<summary>查看原文（45行）</summary>

```text
		"sidechat.prompt": async (payload) => {
			const childId = requireSidechatString(payload, "childId");
			const rawText = payload?.text;
			if (typeof rawText !== "string") throw new SidechatModelError("bad-request", "missing or invalid \"text\"");
			const text = rawText.trim();
			const imageBlocks = sideImageBlocks(payload?.images);
			if (text === "" && imageBlocks.length === 0) throw new SidechatModelError("bad-request", "text or images are required");
			// A user message made only of image blocks does not wake the driver
			// and renders as an empty row in the side transcript, so an
			// image-only question carries a neutral text part.
			const question = text === "" ? SIDE_IMAGE_PROMPT : text;
			let agent = liveThreadAgent(ctx, childId);
			if (agent === void 0) {
				const agents = ctx.get("agents");
				if (agents?.resume === void 0) throw new SidechatModelError("sidechat-error", "the agents service is unavailable", 503);
				const setup = await composePersistedSetup(ctx, childId);
				try {
					const handle = await agents.resume({
						resumeSessionId: childId,
						setup
					});
					threadDisposers.set(childId, () => handle.dispose());
					agent = handle.agent;
				} catch (error) {
					throw new SidechatModelError("sidechat-error", `thread resume failed: ${error instanceof Error ? error.message : String(error)}`, 500);
				}
			}
			const blocks = [...imageBlocks, ...textPrompt(question)];
			if (boundaryDelivered(sessionLogEvents(agent.session) ?? [])) admitFollowup(agent, blocks);
			else {
				const parts = [SIDE_BOUNDARY_PROMPT];
				const snapshot = pendingSnapshots.get(childId);
				pendingSnapshots.delete(childId);
				if (snapshot !== void 0) parts.push(snapshot);
				admitFirstContact(agent, parts.join("\n\n"), question, blocks);
				const titles = ctx.get("sessionTitle");
				if (titles !== void 0) try {
					titles.rename(agent.session, sideLabel(question));
				} catch {}
			}
			return { accepted: true };
		},
		"sidechat.cancel": async (payload) => {
			const agent = liveThreadAgent(ctx, requireSidechatString(payload, "childId"));
			if (agent !== void 0) agent.cancel({ kind: "user" }, { keepInbox: true });
```

</details>

**依据 4 · 源码核查**：[lib/client.js:4653-4679](https://github.com/1985899182/dsh-harness-chat-control/blob/841f42f66d30cd86131d1c7c1553a0775e6a280a/lib/client.js#L4653-L4679)

发送与取消 UI。

<details>
<summary>查看原文（27行）</summary>

```text
			const handleSend = async () => {
				const text = composer.trim();
				if (text === "" || threadId === void 0 || busy !== null) return;
				setBusy("sending");
				setError(null);
				try {
					const wireText = typeof draftStore?.format === "function" ? draftStore.format(threadId, text) : text;
					await api.sidechatPrompt(threadId, wireText);
					draftStore?.clear?.(threadId);
					setReferenceText("");
					setComposer("");
					const field = composerRef.current;
					if (field !== null) field.style.height = "";
					fetchThread(threadId);
					fetchInfo(threadId);
				} catch (cause) {
					setError(cause instanceof Error ? cause.message : String(cause));
				} finally {
					setBusy(null);
				}
			};
			const handleCancel = async () => {
				if (threadId === void 0 || busy !== null) return;
				try {
					await api.sidechatCancel(threadId);
				} catch (cause) {
					setError(cause instanceof Error ? cause.message : String(cause));
```

</details>

#### 缺口

- 未运行宿主和外部工具
  **影响**：不能证明取消完全停止或撤销副作用
  **进一步探讨**：隔离宿主验证流式、排队工具和取消后真实状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 侧聊是实时同步还是启动时的快照？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

继承在创建时读取父事件，未完成轮次只以当时快照作为参考；后续主会话变化不能由该路径推断自动同步。边界文字声明内容为参考，但模型是否遵循仍需验证；引用来源可能含敏感内容，跨会话复制前应审查。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:368-392](https://github.com/1985899182/dsh-harness-chat-control/blob/841f42f66d30cd86131d1c7c1553a0775e6a280a/lib/index.js#L368-L392)

以创建时事件构造 seed 和快照。

<details>
<summary>查看原文（25行）</summary>

```text
* Build the side-thread inheritance for one parent log: every COMPLETED turn
* up to the click moment.
*
* The parent's open turn is never inherited as log events.  It holds the
* question the user just asked the MAIN conversation plus the assistant
* output still streaming for it; copying those events into the child would
* make the child's own log claim the main question as one of its user
* messages, so the side panel would show the main conversation's question
* and the side model could answer it instead of the side question.  The open
* turn is handed over as a fenced, reference-only snapshot instead (see
* buildOpenTurnSnapshot), which rides the boundary injection.
*/
function buildSidechatInheritance(events) {
	if (events.length === 0) return {
		seed: [],
		snapshot: null
	};
	const boundary = lastTurnBoundary(events);
	if (boundary < 0 || events[boundary]?.type === "turn/end") return {
		seed: copyEvents(events),
		snapshot: null
	};
	return {
		seed: copyEvents(events.slice(0, boundary)),
		snapshot: buildOpenTurnSnapshot(events)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:512-524](https://github.com/1985899182/dsh-harness-chat-control/blob/841f42f66d30cd86131d1c7c1553a0775e6a280a/lib/index.js#L512-L524)

边界与子会话描述。

<details>
<summary>查看原文（13行）</summary>

```text
}


/**
* Side Chat routes of the /sidebar JSON API ('sidechat.start' /
* 'sidechat.prompt' / 'sidechat.cancel' / 'sidechat.dispose').
*
* A side thread is a child session the plugin creates ITSELF with a custom
* seed — the parent's COMPLETED turns up to the click moment; the parent's
* open turn (when it is still running) rides the boundary injection as
* reference-only text instead of being copied into the child log, so a side
* thread never inherits the main conversation's in-flight question as its
* own user message (see buildSidechatInheritance). The child is marked
```

</details>

#### 缺口

- 未验证后续父事件同步或模型行为
  **影响**：不能保证引用新鲜或遵循提示
  **进一步探讨**：固定主会话继续变化并比较侧聊可见上下文。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 适合什么条件，失败怎样处理？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要与插件 peer 版本匹配的 DSH Desktop、会话及模型服务；子会话和复制上下文会产生模型与存储成本。发送失败留错误，用户应检查目标会话、引用和实际已发送状态，再决定重试；对外部动作先人工核实，不把取消当撤销。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:20-40](https://github.com/1985899182/dsh-harness-chat-control/blob/841f42f66d30cd86131d1c7c1553a0775e6a280a/package.json#L20-L40)

依赖及版本声明。

<details>
<summary>查看原文（21行）</summary>

```text
    "lib",
    "scripts",
    "vendor",
    "cordis.patch.yml",
    "README.md",
    "README_EN.md",
    "README_JA.md",
    "README_KO.md",
    "MILESTONE.md",
    "docs",
    "LICENSE"
  ],
  "scripts": {
    "test": "node ./scripts/validate.mjs && node ./scripts/compat-check.mjs",
    "compat": "node ./scripts/compat-check.mjs"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
```

</details>

**依据 2 · 源码核查**：[lib/client.js:4653-4679](https://github.com/1985899182/dsh-harness-chat-control/blob/841f42f66d30cd86131d1c7c1553a0775e6a280a/lib/client.js#L4653-L4679)

发送成功清理与失败处理、取消。

<details>
<summary>查看原文（27行）</summary>

```text
			const handleSend = async () => {
				const text = composer.trim();
				if (text === "" || threadId === void 0 || busy !== null) return;
				setBusy("sending");
				setError(null);
				try {
					const wireText = typeof draftStore?.format === "function" ? draftStore.format(threadId, text) : text;
					await api.sidechatPrompt(threadId, wireText);
					draftStore?.clear?.(threadId);
					setReferenceText("");
					setComposer("");
					const field = composerRef.current;
					if (field !== null) field.style.height = "";
					fetchThread(threadId);
					fetchInfo(threadId);
				} catch (cause) {
					setError(cause instanceof Error ? cause.message : String(cause));
				} finally {
					setBusy(null);
				}
			};
			const handleCancel = async () => {
				if (threadId === void 0 || busy !== null) return;
				try {
					await api.sidechatCancel(threadId);
				} catch (cause) {
					setError(cause instanceof Error ? cause.message : String(cause));
```

</details>

**依据 3 · 源码核查**：[lib/index.js:760-764](https://github.com/1985899182/dsh-harness-chat-control/blob/841f42f66d30cd86131d1c7c1553a0775e6a280a/lib/index.js#L760-L764)

取消调用。

```text
			return { accepted: true };
		},
		"sidechat.cancel": async (payload) => {
			const agent = liveThreadAgent(ctx, requireSidechatString(payload, "childId"));
			if (agent !== void 0) agent.cancel({ kind: "user" }, { keepInbox: true });
```

#### 缺口

- 未测试兼容宿主、模型计费或失败重试
  **影响**：无法估算成本及重复发送风险
  **进一步探讨**：隔离模型环境测试断连与发送完成后响应丢失。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何让用户决定是否刷新上下文或继续追问？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有选文引用、进行中轮次快照和取消控件，是直接反证；假设在侧聊显示父会话快照时间及父会话是否已继续变化，辅助用户决定继续或新开侧聊。对照现有界面，在父会话不变、继续输出、切换会话和断连条件下测过期引用导致误答、误报、判断时间和提示负担；无改善、误导或成本抵消收益则否定。尚未穷尽客户端已有新鲜度提示。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:368-392](https://github.com/1985899182/dsh-harness-chat-control/blob/841f42f66d30cd86131d1c7c1553a0775e6a280a/lib/index.js#L368-L392)

创建时继承和快照。

<details>
<summary>查看原文（25行）</summary>

```text
* Build the side-thread inheritance for one parent log: every COMPLETED turn
* up to the click moment.
*
* The parent's open turn is never inherited as log events.  It holds the
* question the user just asked the MAIN conversation plus the assistant
* output still streaming for it; copying those events into the child would
* make the child's own log claim the main question as one of its user
* messages, so the side panel would show the main conversation's question
* and the side model could answer it instead of the side question.  The open
* turn is handed over as a fenced, reference-only snapshot instead (see
* buildOpenTurnSnapshot), which rides the boundary injection.
*/
function buildSidechatInheritance(events) {
	if (events.length === 0) return {
		seed: [],
		snapshot: null
	};
	const boundary = lastTurnBoundary(events);
	if (boundary < 0 || events[boundary]?.type === "turn/end") return {
		seed: copyEvents(events),
		snapshot: null
	};
	return {
		seed: copyEvents(events.slice(0, boundary)),
		snapshot: buildOpenTurnSnapshot(events)
```

</details>

**依据 2 · 源码核查**：[lib/client.js:4653-4679](https://github.com/1985899182/dsh-harness-chat-control/blob/841f42f66d30cd86131d1c7c1553a0775e6a280a/lib/client.js#L4653-L4679)

已有发送与取消。

<details>
<summary>查看原文（27行）</summary>

```text
			const handleSend = async () => {
				const text = composer.trim();
				if (text === "" || threadId === void 0 || busy !== null) return;
				setBusy("sending");
				setError(null);
				try {
					const wireText = typeof draftStore?.format === "function" ? draftStore.format(threadId, text) : text;
					await api.sidechatPrompt(threadId, wireText);
					draftStore?.clear?.(threadId);
					setReferenceText("");
					setComposer("");
					const field = composerRef.current;
					if (field !== null) field.style.height = "";
					fetchThread(threadId);
					fetchInfo(threadId);
				} catch (cause) {
					setError(cause instanceof Error ? cause.message : String(cause));
				} finally {
					setBusy(null);
				}
			};
			const handleCancel = async () => {
				if (threadId === void 0 || busy !== null) return;
				try {
					await api.sidechatCancel(threadId);
				} catch (cause) {
					setError(cause instanceof Error ? cause.message : String(cause));
```

</details>

#### 缺口

- 未穷尽所有 UI 提示和事件订阅
  **影响**：不能证明展示缺失或收益
  **进一步探讨**：在固定任务对照已有与原型，检查用户选择。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
