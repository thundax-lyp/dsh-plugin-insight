# DSH Think Translate

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[15579da](https://github.com/UncleK/dsh-think-translate/tree/15579dac387c53d0347a1da28b89ada898cdcd60)

<!-- BEGIN META -->
[![GitHub ★ 73](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=73&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/UncleK/dsh-think-translate) [![npm 30d 5,662](https://img.shields.io/static/v1?label=npm+30d&message=5%2C662&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-think-translate) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-think-translate)
<!-- END META -->

> **功能**：对DSH已显示的思考、任务卡及可选回答添加翻译

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 原界面保原文并添加译文和技术片段保护。

> **主要限制**：[Q03](#research-q03) [Q03](#research-q03) 默认外部优先，语言守卫不等保真，同源路由不等授权。

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
  - [Q01 · 翻译插件增量是什么？](#detail-section-11)
  - [Q02 · 分段、请求、缓存和失败如何工作？](#detail-section-12)
  - [Q03 · 隐私、授权和翻译质量的关键限制？](#detail-section-13)
  - [Q04 · 本地模型、安装和退出成本怎样安排？](#detail-section-14)
  - [Q05 · 怎样证伪保真与阅读便利？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：跨语言用户希望在DSH内读懂已展示思考和任务内容。

人工复制翻译或官方思考翻译单独启用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 显示翻译 | 读已展示思考/todo/可选回答 | 保原文，不读隐藏推理，官方冲突暂停 |
| 技术段与缓存 | 散文翻译、代码原offset拼接、去重 | 仅规则保护非完整语义验证 |
| 本地模型管理 | 显式准备/模型驻留与release | Windows可安装，其他已有服务；release不删模型 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=20/DSH>=rc.6与匹配UI契约 | 必需 | Host+renderer | 实际新版本需隔离验证 |
| 明确provider链与凭据 | 必需 | 指定翻译目标 | 默认Google/Bing优先，local-only需删外部链 |
| 本地Ollama及内存/磁盘 | 本地模式 | 下载/加载/推理 | setup显式授权，缺程序/模型返回提示 |
| 受保护Host监听和缓存策略 | 隐私前置 | 防路由滥用与译文残留 | 组件路由未统一认证，外层另核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 官方二选一，脱敏块，local-only链/禁fallback | 核目标地址与Host门禁 |
| 阅读 | 看原文/译文及attempts，核技术段字节 | 错语/错误回原文不视成功 |
| 退出 | 禁翻译/释放模型并核active，清cache/凭据再卸 | 原服务/权重和共享inflight另核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型下载/VRAM与Host资源未知 | 配provider与本地链、技术文本验收耗时未知 | 首次费用/耗时未知 |
| 持续 | 翻译调用与常驻模型/300项浏览器缓存未知 | 核语义/语言和外发目的地耗时未知 | 0 idle为无限驻留，费用未知 |
| 恢复 | 配置/cache/模型和服务资源未知 | 等待active、release核ps并处理服务/权重耗时未知 | 卸UI不保证请求止费，恢复耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 原文/技术段 | 显示原块且只prose交provider | 所有语义和新语法保真未测 |
| 恢复 | 失败回原文、旧namespace拒缓存回填 | 弱网账单和重复调用实效未知 |
| 阅读价值 | 界面译文路径存在 | 理解/耗时改善无独立对照 |

> **思考**：[Q03](#research-q03) [Q03](#research-q03) 默认外部优先，语言守卫不等保真，同源路由不等授权。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 原界面保原文并添加译文和技术片段保护。

源码追显示、分段、模型协议、缓存和本地生命周期，未执行目标。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) [Q03](#research-q03) 默认外部优先，语言守卫不等保真，同源路由不等授权。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) [Q04](#research-q04) 脱敏隔离Host，只留本地链、禁fallback并核释放；官方插件二选一。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的核显示层翻译是否保原文与技术文本，以及出站、缓存和本地模型生命周期边界。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 lib/client.js、README.zh-CN.md、lib/text.js、lib/index.js、package.json、lib/ollama.js、lib/local-model.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的核显示层翻译是否保原文与技术文本，以及出站、缓存和本地模型生命周期边界。未执行目标代码或实际宿主验证。
- 下一步：保存原始块/译文/网络目标和真实用量，以保真失败否定采用

**分析版本**

- **仓库**：[UncleK/dsh-think-translate](https://github.com/UncleK/dsh-think-translate)
- **版本号**：1.2.20（[固定提交 15579da](https://github.com/UncleK/dsh-think-translate/tree/15579dac387c53d0347a1da28b89ada898cdcd60)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) [Q05](#research-q05) 原文+译文可能改善阅读，需盲评及用量对照。

保存原始块/译文/网络目标和真实用量，以保真失败否定采用

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 4046 | — | — | 41176 |
| .js | source | 11 | 6299 | 5488 | 650 | — |
| .mjs | test | 18 | 5337 | 4651 | 437 | — |
| .md | example | 1 | 3 | — | — | 40 |
| .mjs | source | 1 | 148 | 108 | 6 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/UncleK/dsh-think-translate/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核显示层翻译是否保原文与技术文本，以及出站、缓存和本地模型生命周期边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 翻译插件增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要跨语言阅读DSH已展示内容的用户，可对思考块、todo任务卡及可选回答看译文，原始会话内容仍来自宿主，不是获取隐藏推理。真实root为plugin，Host同源翻译路由加Web renderer；不是新模型供应商。它在assistant-step/todo_write/input dock注册较低priority替换视图，按node.data.blocks传原文给翻译组件，没有沿该链写回会话/模型上下文。与外部复制翻译相比增量是原界面显示、缓存与技术文本保护；与官方翻译占同位置，检测官方启用则卸译文视图/暂停，不能同时叠加。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1952-1998](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/client.js#L1952-L1998)

原始blocks到显示组件

<details>
<summary>查看原文（47行）</summary>

```text
		function AssistantView(props) {
			var node = props.node;
			var data = node.data;
			var groupPart = props.groupPart;
			var useTurnData = props.useTurnData;
			var tt = UI_TEXT[useStore().lang] || UI_TEXT.en;
			var tail = useTurnData("turn-tail");
			var loc = node.location || {};
			var turn = (loc.kind === "turn" || loc.kind === "step") ? loc.turn : undefined;
			var owner = undefined;
			if (turn && turn.status === "closed" && data.finalNode !== undefined && tail && tail.closing && tail.closing.finalNode && tail.closing.finalNode.seq === data.finalNode.seq) {
				owner = { turn: turn, seq: data.finalNode.seq, openFile: props.openFile };
			}
			var mentions = owner !== undefined && props.fileMentions ? props.fileMentions(owner) : undefined;
			var streaming = data.status === "running";
			var interrupted = data.status === "interrupted"; var isLatest = !streaming && data.finalNode !== undefined && tail && tail.closing && tail.closing.finalNode && tail.closing.finalNode.seq === data.finalNode.seq; var eager = streaming || isLatest;
			var blocks = data.blocks || [];
			var process = props.turnProcess;
			var reasoningHidden = !!(process && process.foldable && !process.open && groupPart !== "reasoning");
			var revealProcess = function () { if (process) process.setOpen(true); };
			var hasVisible = streaming || interrupted === true || blocks.some(function (b) { return b.kind !== "tool-call"; });
			if (!hasVisible) return null;
			var rendered = [];
			var last = blocks.length - 1;
			for (var i = 0; i < blocks.length; i++) {
				var block = blocks[i];
				if (!block) continue;
				// DSH may mount this step separately for reasoning and response.
				// Keep original block indexes so streaming-tail detection is unchanged.
				if (groupPart === "reasoning" && block.kind !== "reasoning") continue;
				if (groupPart === "response" && block.kind === "reasoning") continue;
				if (block.kind === "text") {
					rendered.push(createElement(TextBlockSafe, { key: "t" + i, text: block.text, streaming: streaming,
						fileMentions: mentions, textInteractionSource: data.status === "settled" && !!(data.finalNode && data.finalNode.messageId) }));
				} else if (block.kind === "reasoning") {
					rendered.push(createElement(ProcessReasoning, { key: "r" + i, hidden: reasoningHidden,
						useGroupAction: props.useGroupAction, reveal: revealProcess },
						createElement(ThinkRow, { text: block.text, running: streaming && i === last, eager: eager })));
				} else if (block.kind === "image") {
					var start = i;
					var group = [block];
					while (i + 1 < blocks.length && blocks[i + 1] && blocks[i + 1].kind === "image") { group.push(blocks[i + 1]); i++; }
					var gallery = { images: group.map(function (b) { return { attachment: b.attachment }; }), loadImage: props.loadImage, align: "start" };
					rendered.push(createElement(Fragment, { key: "g" + start }, props.renderFactorySlot
						? props.renderFactorySlot("conversation.images.content", gallery) : props.renderMessageImages(gallery)));
				} else if (block.kind === "tool-call") {
					// grouped into tool rows by the chat view
```

</details>

**依据 2 · 源码核查**：[lib/client.js:3436-3507](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/client.js#L3436-L3507)

替换slot与官方冲突生命周期

<details>
<summary>查看原文（72行）</summary>

```text
            function mountTranslationViews() {
                var disposers = [];
                function trackSlot(name, mount) { var dispose = recordSlot(name, mount); if (typeof dispose === "function") disposers.push(dispose); }
			trackSlot("conversation", function () {
				return ctx.slots.inject("conversation.chat.node", function () {
					try {
						var d = ctx.slots.register(
							// priority -1: the official ui-conversation AssistantNodeView
							// registers the same key at priority 0, and keyed slots throw on
							// same-key + same-priority duplicates (lowest priority renders).
							// Without this the official renderer wins and the thinking chain
							// shows untranslated (2026-08-24).
							{ name: "conversation.chat.node", key: "assistant-step", locale: "chat", priority: -1 },
							function (props) {
								return createElement(AssistantViewSafe, props);
							});
						diag.slots.conversation = "registered";
						return d;
					} catch (e) {
						diag.slots.conversation = "REG-ERR: " + (e && e.message ? e.message : e);
						throw e;
					}
				});
			});
			trackSlot("todo", function () {
				return ctx.slots.inject("tool.call.toolview", function () {
					return ctx.slots.register(
						// Shadow the official todo-toolview at priority 0 without
						// triggering a same-key + same-priority collision (issue #4).
						{ name: "tool.call.toolview", key: "todo_write", locale: "conversation", priority: -1 },
						function (props) {
							return createElement(XBoundary, null, createElement(XTodoRow, props));
						});
				});
			});
			// Shadow the official plan strip (TodoDock) so the todo list above
			// the composer is translated too. Same id 'todo' at a lower priority
			// replaces the shipped entry; empty list renders nothing, matching
			// the official panel's self-hiding behaviour.
			trackSlot("todoDock", function () {
				return ctx.slots.inject("conversation.input.dock", function () {
					return ctx.slots.register(
						{ name: "conversation.input.dock", id: "todo", order: 0, locale: "conversation", priority: -1 },
						function (props) {
							return createElement(XBoundary, null, createElement(XDockTodo, props));
						});
				});
			});

                trackSlot("approvalReview", installApprovalReviewTranslation);
                return function () { disposers.reverse().forEach(function (dispose) { dispose(); }); };
            }
            var watchContext = function () {
                var disposed = false, disposeViews = null;
                var sync = function () {
                    var allowed = store.contextKnown && !store.officialEnabled;
                    if (allowed && !disposeViews) disposeViews = mountTranslationViews();
                    if (!allowed && disposeViews) { disposeViews(); disposeViews = null; }
                };
                var refresh = function () {
                    return Promise.resolve().then(refreshTranslationContext).catch(function () {
                        if (!disposed) store.set({ contextKnown: false, contextError: true });
                    });
                };
                var unsubscribe = store.subscribe(sync);
                sync();
                refresh();
                var timer = setInterval(refresh, 5000);
                if (timer && typeof timer.unref === "function") timer.unref();
                return function () { disposed = true; clearInterval(timer); unsubscribe(); if (disposeViews) disposeViews(); };
            };
            if (typeof ctx.effect === "function") ctx.effect(watchContext, "think-translate: exclusive translation lifecycle");
```

</details>

**依据 3 · 作者声明**：[README.zh-CN.md:54-65](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/README.zh-CN.md#L54-L65)

作者冲突与设置说明

<details>
<summary>查看原文（12行）</summary>

````text

本插件与官方思考翻译都接管思考界面，请二选一启用。检测到官方插件启用时，本插件暂停翻译并显示冲突提示；关闭官方插件后自动恢复，不会修改官方插件的启用状态。

<a id="quick-start"></a>
## 一条命令，开始使用

```bash
dsh plugin --profile web add dsh-think-translate
```

安装后**完整重启 DSH Web**，打开 **设置 → 思考链翻译**，选择目标语言和翻译提供方即可。 开启 **在侧边栏显示翻译入口**，即可把翻译设置固定到左侧全局面板列表。独立页面按翻译偏好、翻译服务和运行状态分成卡片，小窗口自动使用单栏布局；设置弹窗使用紧凑的单栏分区，控件样式与独立页面一致。选择保存在当前浏览器中，刷新页面或重启 DSH 后仍会保留；在设置窗口或翻译页面关闭此开关即可取消固定。

````

</details>

#### 缺口

- 本轮未运行新宿主渲染或与官方翻译对照
  **影响**：不能确认所有交互/宿主版本一致，也不能宣称提高理解效率
  **进一步探讨**：同一可见文本对照原生与本插件，核原文和会话事件未被改写

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 分段、请求、缓存和失败如何工作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

protectedTextParts按原始offset隔离围栏、未闭合代码、inline code、路径/URL及部分命令；仅prose分块交提供方并按原文拼回，避免靠模型完整重建代码。Host顺序遍历启用的provider链，术语保护→调用→语言规则验证，失败试下一provider，全部失败返回原文。Host cache上限600且同key inflight合并，配置generation/namespace变更不再回填旧缓存。浏览器先核context，再按namespace+语言+文本合并pending、持久cache最多300，Host失败最多2次400ms间隔/失败30秒后重试；结果返回前再核context，官方冲突或旧namespace拒绝。useXlate卸载清重试timer及alive标记，但不取消共享inflight，HTTP客户端超时300s；云/本地每提供方另有超时，不能把视图消失当调用已停止。

#### 证据与依据

**依据 1 · 源码核查**：[lib/text.js:1-111](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/text.js#L1-L111)

技术段保护与仅散文翻译

<details>
<summary>查看原文（111行）</summary>

```text
// Code spans keep their exact source offsets so neither translation nor batching
// needs placeholders that a provider could translate, remove, or reorder.
export function protectedTextParts(text) {
  const parts = []
  let proseStart = 0
  let cursor = 0
  function protect(start, end, complete) {
    if (start > proseStart) parts.push({ text: text.slice(proseStart, start), start: proseStart, end: start, code: false, complete: true })
    parts.push({ text: text.slice(start, end), start, end, code: true, complete })
    proseStart = end
    cursor = end
  }
  function lineEnd(start) {
    const newline = text.indexOf('\n', start)
    return newline < 0 ? text.length : newline + 1
  }
  function technicalSpan(start) {
    const before = text[start - 1] || ''
    if (before && /[A-Za-z0-9_\\/]/.test(before)) return 0
    const rest = text.slice(start)
    // Quotes are part of a path token only when its prefix is unambiguous.
    const quoted = rest.match(/^("|'|“)(?:[A-Za-z]:[\\/]|\\\\|~?\/|\.\.?\/)/)
    if (quoted) {
      const close = quoted[1] === '“' ? '”' : quoted[1]
      const end = text.indexOf(close, start + 1)
      return end < 0 ? text.length - start : end + 1 - start
    }
    const token = rest.match(/^(?:https?:\/\/|file:\/\/|[A-Za-z]:[\\/]|\\\\|~?\/|\.\.?\/)[^\s<>"'`，。！？；：、]+/)
      || rest.match(/^[\w@.-]+\.(?:[cm]?js|jsx|tsx?|jsonl?|ya?ml|toml|ini|env|md|py|sh|ps1|cmd|bat|exe|lock|go|rs|cpp|sql|html|css|txt|zstd|png|jpe?g|svg)(?![\w.])/i)
    if (token) {
      let value = token[0].replace(/[.,;:!?，。！？；：、]+$/, '')
      // Keep balanced URL parentheses, but leave Markdown/prose delimiters out.
      for (const [open, close] of [['(', ')'], ['[', ']'], ['{', '}']]) {
        while (value.endsWith(close) && value.split(close).length > value.split(open).length) value = value.slice(0, -1)
      }
      return value.length
    }
    const command = rest.match(/^(?:(?:npm|pnpm|yarn)\s+(?:run\s+[\w:.-]+|test|ci|install|build|start)|git\s+(?:status|diff|log|fetch|pull|push|show|branch)|(?:python3?|node)\s+[\w./\\:-]+\.(?:py|[cm]?js))(?=$|[\s.,;:!?，。！？；：、)]|--)(?:[ \t]+(?:--?[\w-]+(?:=[\w./\\:@=-]+)?|--|"[^"\r\n]*"|'[^'\r\n]*'))*/)
    return command ? command[0].length : 0
  }
  while (cursor < text.length) {
    if (cursor === 0 || text[cursor - 1] === '\n') {
      const end = lineEnd(cursor)
      const line = text.slice(cursor, end)
      // Treat indented/quoted fences conservatively as code as well.
      const fence = line.match(/^[\t ]*(?:>[\t ]*)*(?:(?:[-+*]|[0-9]+[.)])[\t ]+)?(`{3,}|~{3,})[^\r\n]*(?:\r?\n)?$/)
      if (fence) {
        const close = new RegExp('^[\\t ]*(?:>[\\t ]*)*' + fence[1][0] + '{' + fence[1].length + ',}[\\t ]*(?:\\r?\\n)?$')
        let stop = end
        let complete = false
        while (stop < text.length) {
          const next = lineEnd(stop)
          if (close.test(text.slice(stop, next))) { stop = next; complete = true; break }
          stop = next
        }
        protect(cursor, stop, complete)
        continue
      }
      if (/^(?: {4}|\t)/.test(line)) {
        protect(cursor, end, end < text.length || line.endsWith('\n'))
        continue
      }
      const shellLine = /^(?:\$\s*)?(?:(?:npm|pnpm|yarn)\s+(?:run|test|ci|install|add|remove|uninstall|build|start)\b|git\s+(?:status|diff|log|fetch|pull|push|show|branch|checkout|switch|commit|add)\b|(?:curl|wget)\s+-)/.test(line)
      if (shellLine && !/\b(?:and|then|before|after|because|please|shows|prints|returns|failed|succeeded|should|will|can|is|are)\b/.test(line)) {
        protect(cursor, end, end < text.length || line.endsWith('\n'))
        continue
      }
    }
    if (text[cursor] === '`') {
      let slashes = 0
      for (let i = cursor - 1; i >= 0 && text[i] === '\\'; i--) slashes++
      if (slashes % 2) { cursor++; continue }
      let after = cursor + 1
      while (text[after] === '`') after++
      const size = after - cursor
      let next = after
      let stop = text.length
      let complete = false
      while ((next = text.indexOf('`', next)) >= 0) {
        let end = next + 1
        while (text[end] === '`') end++
        if (end - next === size) { stop = end; complete = true; break }
        next = end
      }
      // An unfinished streaming code span must not expose its body as prose.
      protect(cursor, stop, complete)
      continue
    }
    const technicalLength = technicalSpan(cursor)
    if (technicalLength) {
      protect(cursor, cursor + technicalLength, true)
      continue
    }
    cursor++
  }
  if (proseStart < text.length) parts.push({ text: text.slice(proseStart), start: proseStart, end: text.length, code: false, complete: true })
  return parts
}

// Only prose reaches a provider; separators adjoining code stay byte-for-byte.
export async function translateProtectedText(text, translate, split = value => [value]) {
  const output = []
  for (const part of protectedTextParts(text)) {
    const match = !part.code && part.text.match(/^(\s*)([\s\S]*?)(\s*)$/)
    if (!match || !/\p{L}/u.test(match[2])) { output.push(part.text); continue }
    const chunks = []
    for (const chunk of split(match[2])) chunks.push((await translate(chunk)).trim())
    output.push(match[1] + chunks.join('\n\n') + match[3])
  }
  return output.join('')
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1188-1247](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/index.js#L1188-L1247)

顺序chain、术语和fail-open

<details>
<summary>查看原文（60行）</summary>

```text
// Run one ordered provider-id list; returns { ok } or { ok: false, error }.
async function runChainFor(ids, text, target, cfg) {
  let lastErr = null
  const attempts = []
  for (const id of ids) {
    const p = cfg.providers && cfg.providers[id]
    // DSH-sourced providers are activated by chain membership (they cannot be
    // enabled via the config UI, which is read-only); everything else must be
    // explicitly enabled.
    if (!p) continue
    if (!p.enabled && p.source !== 'dsh') continue
    const adapter = ADAPTERS[p.type || id]
    if (!adapter) continue
    let localLease
    try {
      const local = ollamaOrigin(id, p)
      if (local) localLease = await localModels.acquire(p, cfg.localModel)
      const glossary = glossaryEntriesForTarget(cfg.glossary, target)
      const glossaryTargets = new Set()
      const translated = await translateProtectedText(text, async chunk => {
        const out = await translateWithGlossary(chunk, glossary, value => local ? viaLocalOllama(value, target, p, cfg.localModel) : adapter(value, target, p))
        const error = translationLanguageError(out.text, target, out.targets)
        if (error) throw new Error(error)
        out.targets.forEach(term => glossaryTargets.add(term))
        return out.text
      }, value => splitGlossaryText(value, glossary, chunkText))
      state.ok++
      state.lastProvider = id
      state.lastError = null
      // Carry the concrete model name so the UI can show e.g. "openai: qwen2.5:14b".
      attempts.push({ provider: id, signature: providerFingerprint(p), ok: true, model: p.model || null })
      return { ok: true, text: translated, provider: id, providerSignature: providerFingerprint(p), attempts,
        ...(glossaryTargets.size ? { glossaryTargets: [...glossaryTargets] } : {}), ...(p.model ? { model: p.model } : {}) }
    } catch (e) {
      lastErr = e
      attempts.push({ provider: id, signature: providerFingerprint(p), ok: false, model: p.model || null,
        ...(e instanceof Error && e.message.startsWith('translation language mismatch:') ? { error: e.message } : {}) })
      if (id === 'bing') bingCache = null
    } finally { if (localLease) localLease() }
  }
  return { ok: false, attempts, error: lastErr instanceof Error ? lastErr.message : (lastErr || 'no enabled provider in chain') }
}

function providerFingerprint(p) {
  return fnv(JSON.stringify({ type: p.type, baseURL: p.baseURL, model: p.model, apiKeyEnv: p.apiKeyEnv, apiKeyRef: p.apiKeyRef,
    apiKey: p.source === 'dsh' || p.apiKeyEnv ? undefined : p.apiKey }))
}

async function translateViaChain(text, target, cfg) {
  const primary = await runChainFor(cfg.chain || [], text, target, cfg)
  if (primary.ok) return primary
  let fb = null
  if (cfg.fallback && cfg.fallback.enabled && Array.isArray(cfg.fallback.chain)) {
    fb = await runChainFor(cfg.fallback.chain, text, target, cfg)
    if (fb.ok) return { ...fb, attempts: [...primary.attempts, ...fb.attempts] }
  }
  state.fail++
  state.lastError = primary.error || (fb && fb.error) || 'translate unavailable'
  return { ok: false, text: text, attempts: [...primary.attempts, ...(fb ? fb.attempts : [])], error: state.lastError }
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1249-1314](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/index.js#L1249-L1314)

cache、inflight与generation

<details>
<summary>查看原文（66行）</summary>

```text
async function handleTranslate(body) {
  const text = body && typeof body.text === 'string' ? body.text : ''
  const target = body && typeof body.target === 'string' && body.target ? body.target : 'zh-CN'
  const forced = body && typeof body.provider === 'string' && body.provider ? body.provider : null
  if (!text.trim()) return { ok: true, text: '', skipped: true }
  if (!forced && !needsTranslate(text, target)) return { ok: true, text, skipped: true }
  const cfg = structuredCloneSafe(await loadConfig())
  const context = translationContext(cfg)
  if (context.officialEnabled) return { ok: false, text, error: 'Official thinking translation is enabled; choose exactly one translation plugin', conflict: true, ...context }
  const generation = configGeneration
  const key = (forced ? 'f|' + forced + '|' : '') + target + '|' + context.cacheNamespace + '|' + fnv(text)
  const hit = cacheGet(key)
  if (hit !== undefined) {
    if (!hit.ok || !translationLanguageError(hit.text, target, hit.glossaryTargets)) return hit
    cache.delete(key)
  }
  const busy = inflight.get(key)
  if (busy !== undefined) return busy
  const job = (async function () {
    // Forced (single-provider test) goes before needsTranslate so test buttons
    // always hit the provider regardless of text autodetection.
    if (forced) {
      const p = cfg.providers && cfg.providers[forced]
      if (!p) return { ok: false, text, error: 'unknown provider: ' + forced }
      // DSH providers are activated by chain membership, not the enabled flag.
      if (!p.enabled && p.source !== 'dsh' && !ollamaOrigin(forced, p)) return { ok: false, text, error: 'provider disabled: ' + forced }
      const adapter = ADAPTERS[p.type || forced]
      if (!adapter) return { ok: false, text, error: 'unsupported type: ' + p.type }
      let localLease
      try {
        const local = ollamaOrigin(forced, p)
        if (local) localLease = await localModels.acquire(p, cfg.localModel)
        const glossary = glossaryEntriesForTarget(cfg.glossary, target)
        const glossaryTargets = new Set()
        const out = await translateProtectedText(text, async chunk => {
          const translated = await translateWithGlossary(chunk, glossary, value => local ? viaLocalOllama(value, target, p, cfg.localModel) : adapter(value, target, p))
          const error = translationLanguageError(translated.text, target, translated.targets)
          if (error) throw new Error(error)
          translated.targets.forEach(term => glossaryTargets.add(term))
          return translated.text
        }, value => splitGlossaryText(value, glossary, chunkText))
        return { ok: true, text: out, provider: forced, providerSignature: providerFingerprint(p), ...context,
          ...(glossaryTargets.size ? { glossaryTargets: [...glossaryTargets] } : {}), ...(p.model ? { model: p.model } : {}) }
      } catch (e) {
        return { ok: false, text, error: e instanceof Error ? e.message : String(e) }
      } finally { if (localLease) localLease() }
    }
    const r = await translateViaChain(text, target, cfg)
    Object.assign(r, context)
    if (!r.ok) r.retryAt = Date.now() + 30000
    // A result already in flight must not repopulate an invalidated cache.
    if (generation === configGeneration && context.cacheNamespace === translationContext(await loadConfig()).cacheNamespace) cacheSet(key, r)
    return r
  })()
  inflight.set(key, job)
  try {
    return await job
  } finally {
    if (inflight.get(key) === job) inflight.delete(key)
  }
}

// ---------------------------------------------------------------- http glue

function sendJson(res, code, obj) {
  const body = JSON.stringify(obj)
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1358-1430](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/client.js#L1358-L1430)

客户端去重/重试/过期回填门禁

<details>
<summary>查看原文（73行）</summary>

```text

        function requestTranslate(text, target) {
            if (!needsTranslate(text, target)) return Promise.resolve({ ok: true, text: text, skipped: true });
            return refreshTranslationContext().then(function (context) {
                if (context.officialEnabled) return { ok: false, text: text, conflict: true };
                var namespace = context.cacheNamespace;
                var key = translationCacheKey(text, target);
                var hit = cacheMemGet(key);
                if (hit !== undefined) return hit;
                var busy = pend.get(key);
                if (busy !== undefined) return busy;
                var job = (async function () {
                    try {
                        var result = null, lastError = null;
                        var backoff = [0, 400];
                        for (var i = 0; i < backoff.length; i++) {
                            if (backoff[i]) await sleepMs(backoff[i]);
                            try { result = await hostAttempt(text, target); break; }
                            catch (error) { lastError = error; if (error && error.retryAt > Date.now()) break; }
                        }
                        if (!result) throw lastError || new Error("Translation unavailable");
                        // Read the Host again before admitting an in-flight result. Another
                        // window may have changed providers while this request was running.
                        var current = await refreshTranslationContext();
                        if (namespace !== current.cacheNamespace || current.officialEnabled || result.cacheNamespace !== namespace) {
                            return { ok: false, text: text, stale: true, retryAt: Date.now() + 1 };
                        }
                        if (result.providerSignature) recordCheck(result.provider, true, result.model, result.providerSignature);
                        stats.ok++; stats.lastError = null; stats.lastProvider = result.provider; stats.lastModel = result.model || null;
                        memSet(key, result);
                        return result;
                    } catch (error) {
                        if (namespace !== activeNamespace) return { ok: false, text: text, stale: true, retryAt: Date.now() + 1 };
                        stats.fail++;
                        stats.lastError = error instanceof Error ? error.message : String(error);
                        var failed = { ok: false, text: text, cacheNamespace: namespace,
                            retryAt: Math.max(Date.now() + 30000, error && error.retryAt || 0) };
                        memSet(key, failed);
                        return failed;
                    }
                })();
                pend.set(key, job);
                job.then(function () { if (pend.get(key) === job) pend.delete(key); }, function () { if (pend.get(key) === job) pend.delete(key); });
                return job;
            }).catch(function () { return { ok: false, text: text, retryAt: Date.now() + 30000 }; });
        }
		function memSet(key, entry) {
			cacheMemSet(key, entry);
		}

		function useXlate(text, enabled) {
			var s = useStore();
			var active = !!(enabled && !s.officialEnabled && s.contextKnown && text && text.trim());
			var key = active ? translationCacheKey(text, s.lang) : null;
			var pair = useState(function () { return key !== null ? cacheMemGet(key) : undefined; });
			var entry = pair[0];
			var setEntry = pair[1];
			useEffect(function () {
				if (!active || key === null) { setEntry(undefined); return undefined; }
				var alive = true;
				var retryTimer = null;
				function attempt() {
					if (!alive) return;
					retryTimer = null;
					requestTranslate(text, s.lang).then(function (r) {
						if (!alive) return;
						setEntry(r);
						if (!(r && r.ok)) retryTimer = setTimeout(attempt, Math.max(1, (r && r.retryAt || Date.now() + 30000) - Date.now()));
					});
				}
				attempt();
				return function () { alive = false; if (retryTimer !== null) clearTimeout(retryTimer); };
			}, [key, active]);
```

</details>

#### 缺口

- 翻译正确率、长流更新/去重与真实超时账单未测
  **影响**：代码保护不是全语义保真，视图卸载仍可能继续费用或出站
  **进一步探讨**：混合代码/未闭合围栏/改配置/关闭视图逐项验原文字节与网络请求

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 隐私、授权和翻译质量的关键限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

默认chain为google,bing,openai且前两项enabled，openai虽默认本地Ollama但排最后，默认不是local-only；失败也可能切其他提供方。只要散文含敏感内容仍会发所配服务，技术段保护不是脱敏。OpenAI兼容走/chat/completions system+user、非stream，本机fetch限15s，远端transport约25s，语言脚本检查仅拒明显不符，不能测事实/否定词或注入忠实性。Host /_xlate/translate、config分支没有本组件认证/Origin检查（local prepare/release另有同Origin约束但缺Origin仍允许），需核Host外层保护，不把同源URL当授权。浏览器localStorage保留译文，清界面不清缓存。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:65-80](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/index.js#L65-L80)

默认外部优先与fallback关闭区别

<details>
<summary>查看原文（16行）</summary>

```text
const DEFAULT_CONFIG = {
  glossary: { enabled: true, builtin: false, entries: {} },
  localModel: { idleMinutes: 5 },
  chain: ['google', 'bing', 'openai'],
  // Legacy safety net, config-only since 2026-09-11: the settings UI no longer
  // offers it (the chain itself ends with the free providers on a fresh install,
  // and unchecking one is how you stop using it). Off by default so nothing runs
  // behind the user's back.
  fallback: { enabled: false, chain: ['google', 'bing'] },
  providers: {
    google: { type: 'google', enabled: true },
    bing: { type: 'bing', enabled: true },
    openai: { type: 'openai', enabled: true, baseURL: 'http://localhost:11434/v1', model: 'qwen2.5:7b-instruct', apiKey: 'ollama-local' },
  },
}

```

</details>

**依据 2 · 源码核查**：[lib/index.js:560-615](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/index.js#L560-L615)

OpenAI真实协议与超时

<details>
<summary>查看原文（56行）</summary>

```text
async function viaOpenAI(text, to, cfg) {
  const apiKey = await resolveProviderKey(cfg)
  if (!apiKey) throw new Error(missingApiKey('openai', cfg))
  let url = String(cfg.baseURL || '').replace(/\/+$/, '')
  if (!url) throw new Error('openai: missing baseURL')
  if (!url.endsWith('/chat/completions')) url += '/chat/completions'
  const body = JSON.stringify({
    model: cfg.model || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemForTarget(to) },
      { role: 'user', content: translationUserText(text) },
    ],
    stream: false,
  })
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|::1)([:/]|$)/i.test(url)
  let raw
  if (isLocal) {
    // Loopback endpoints (Ollama etc.): use Node fetch. curl carries the JSON
    // body through the Windows command line, where CJK text is decoded with
    // the ANSI code page and corrupted before the server ever sees it
    // (2026-08-24: zh->ja via host chain returned garbage/off-topic output
    // while direct fetch worked). Loopback bypasses the system proxy anyway,
    // so fetch is both correct and proxy-safe here.
    //
    // A local model with insufficient VRAM can hang the request indefinitely
    // (fetch has no default timeout), which stalls the whole host chain and
    // every pending request. Bound it so a slow local model fails fast and the
    // chain falls through to google/bing instead of wedging the UI (2026-08-26).
    const controller = new AbortController()
    const timer = setTimeout(function () { controller.abort() }, 15000)
    let res
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'Content-Type': 'application/json',
        },
        body,
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timer)
    }
    if (!res.ok) throw new Error('openai HTTP ' + res.status)
    raw = await res.text()
  } else {
    raw = await curlPostJson(url, [
      'Authorization: Bearer ' + apiKey,
      'Content-Type: application/json',
    ], body)
  }
  const j = JSON.parse(raw)
  const msg = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content
  if (typeof msg !== 'string' || !msg.trim()) throw new Error('openai empty output: ' + JSON.stringify(j).slice(0, 200))
  return msg.trim()
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1109-1135](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/index.js#L1109-L1135)

语言规则仅脚本启发式

<details>
<summary>查看原文（27行）</summary>

```text
  const unquoted = prose.replace(/"[^"\n]*"|“[^”\n]*”|「[^」\n]*」|『[^』\n]*』/g, ' ')
    .replace(/(^|[\s([{])'[^'\n]*'/g, '$1 ')
  const languageProse = /\p{L}/u.test(unquoted) ? unquoted : prose
  if (cjkRatio(languageProse) < 0.3) return true
  const traditionalTarget = !/(?:^|-)hans(?:-|$)/i.test(tag) && /(?:^|-)(?:hant|tw|hk|mo)(?:-|$)/i.test(tag)
  return (traditionalTarget ? SIMPLIFIED_CUES : TRADITIONAL_CUES).test(prose)
}
// Reject only clear mismatches. Script-neutral fragments, names and short
// ambiguous text are deliberately allowed; this is not a full language ID model.
function translationLanguageError(text, target, glossaryTargets) {
  if (typeof text !== 'string' || !text.trim()) return 'translation language mismatch: empty output'
  if (Array.isArray(glossaryTargets)) {
    for (const term of glossaryTargets) if (typeof term === 'string' && term) text = text.split(term).join(' ')
  }
  const tag = String(target || '').trim().replace(/_/g, '-').split('-')[0].toLowerCase()
  if (!['zh', 'ja', 'ko', 'ru', 'en', 'es', 'fr', 'de', 'pt'].includes(tag)) return null
  const prose = proseForDetection(text)
  const unquoted = prose.replace(/"[^"\n]*"|“[^”\n]*”|「[^」\n]*」|『[^』\n]*』/g, ' ')
  const sample = /\p{L}/u.test(unquoted) ? unquoted : prose
  const count = re => (sample.match(re) || []).length
  const han = count(/\p{Script=Han}/gu), kana = count(/[\u3040-\u30ff\u31f0-\u31ff]/g)
  const hangul = count(/\p{Script=Hangul}/gu), cyrillic = count(/\p{Script=Cyrillic}/gu)
  const latin = count(/\p{Script=Latin}/gu)
  const total = han + kana + hangul + cyrillic + latin
  if (!total) return null
  const wrong = language => 'translation language mismatch: expected ' + target + ', got ' + language
  if (tag !== 'ja' && kana >= 3 && (han + kana) / total > 0.5 && (tag !== 'zh' || kana / (han + kana) > 0.2)) return wrong('Japanese')
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1515-1552](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/index.js#L1515-L1552)

翻译/config路由缺局部授权

<details>
<summary>查看原文（38行）</summary>

```text
    const dispose = webServer.register({
      kind: 'exact',
      path: '/_xlate/translate',
      handler: async function (req, res) {
        try {
          if (req.method !== 'POST') { sendJson(res, 405, { error: 'POST only' }); return }
          const body = await readBody(req)
          sendJson(res, 200, await handleTranslate(body))
        } catch (e) {
          sendJson(res, 500, { ok: false, error: e instanceof Error ? e.message : String(e) })
        }
      },
    })
    return dispose
  }, 'dsh-think-translate: translate route')

  ctx.effect(function () {
    const dispose = webServer.register({
      kind: 'exact',
      path: '/_xlate/config',
      handler: async function (req, res) {
        try {
          if (req.method === 'GET') {
            // Strip DSH-resolved apiKeys from the response — they are
            // resolved from .credentials.yaml at runtime and never persisted.
            sendJson(res, 200, await publicConfig(await loadConfig()))
            return
          }
          if (req.method === 'POST') {
            const patch = await readBody(req)
            if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
              // A null/array body used to reach normalizeConfigPatch and answer
              // 500 with an internal TypeError; it is a client error.
              sendJson(res, 400, { ok: false, error: 'a JSON object body is required' })
              return
            }
            const updated = await queueConfigChange(async () => {
              const live = structuredCloneSafe(await loadConfig())
```

</details>

**依据 5 · 源码核查**：[lib/client.js:954-1015](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/client.js#L954-L1015)

译文持久cache

<details>
<summary>查看原文（62行）</summary>

```text
		// Translation cache persisted to localStorage so switching sessions or
		// refreshing a page reuses prior results instead of re-translating every
		// historical message (which wedged the UI when the local model was slow,
		// 2026-08-26). In-memory map is the fast path; localStorage is the
		// durable cross-session floor.
		var MEM_KEY = "dsh-xlate-cache:v6:";
        // Discard unchecked translations from older versions; retain preferences.
        try {
          var legacyKeys = [];
          for (var cacheIndex = 0; cacheIndex < localStorage.length; cacheIndex++) {
            var cacheKey = localStorage.key(cacheIndex);
            if (cacheKey && cacheKey.indexOf("dsh-xlate-cache:") === 0 && cacheKey.indexOf(MEM_KEY) !== 0) legacyKeys.push(cacheKey);
          }
          legacyKeys.forEach(function (key) { localStorage.removeItem(key); });
        } catch (error) { /* Storage may be unavailable in private browsing. */ }
		function cacheMemGet(key) {
			var v = mem.get(key);
			if (v !== undefined) {
				if (v.ok === false) {
					if (Date.now() < v.retryAt) return v;
					mem.delete(key);
					return undefined;
				}
				if (v.ok && !v.skipped && translationLanguageError(v.text, key.split("|")[0], v.glossaryTargets)) {
					mem.delete(key);
					try { localStorage.removeItem(MEM_KEY + key); } catch (e) {}
					return undefined;
				}
				return v;
			}
			try {
				var lv = localStorage.getItem(MEM_KEY + key);
				if (lv !== null) {
					var parsed = JSON.parse(lv);
					if (parsed && parsed.ok) {
						if (!parsed.skipped && translationLanguageError(parsed.text, key.split("|")[0], parsed.glossaryTargets)) {
							localStorage.removeItem(MEM_KEY + key);
							return undefined;
						}
						mem.set(key, parsed); return parsed;
					}
				}
			} catch (e) {}
			return undefined;
		}
		// The persisted cache is bounded on purpose: one localStorage key per
		// translated text would otherwise grow forever, and once the origin quota
		// is full every OTHER localStorage writer in this app fails silently too —
		// including this plugin's own settings. Entries carry `at` so the prune
		// can drop the oldest ones first (2026-09-11).
		var LS_CACHE_MAX = 300;
		var cacheWrites = 0;
		function pruneCache() {
			try {
				var keys = [];
				for (var i = 0; i < localStorage.length; i++) {
					var k = localStorage.key(i);
					if (k && k.indexOf(MEM_KEY) === 0) keys.push(k);
				}
				if (keys.length <= LS_CACHE_MAX) return;
				var rows = keys.map(function (k) {
					var at = 0;
```

</details>

#### 缺口

- 外部服务保留策略、Host外层认证及语义忠实度本轮未运行
  **影响**：敏感思考散文可能外发，未认证路由若可达可消耗配置模型/改配置，不能泛用真实资料
  **进一步探讨**：只留本地provider链并禁fallback，隔离Host验无cookie拒绝，脱敏文本复核否定词与技术段

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本地模型、安装和退出成本怎样安排？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

要求Node>=20、DSH>=0.1.0-rc.6且实际renderer契约随版本变，先隔离核宿主。配置本地链时只识别http loopback:11434/v1的openai provider；ensure不自动授权安装/下载，setup按钮提交allowInstall/allowDownload才允许，Windows可下载官方OllamaSetup经HTTPS并核Authenticode Valid/Ollama Inc再静默安装，其他平台需已有程序。prepare可启动Ollama serve、拉模型并核/api/ps，模型加载可120s，安装/下载更长。默认驻留5分钟，0分钟意为无限驻留；release等本插件active归零后keep_alive0再核ps，不代表停止整个Ollama服务/删除权重。首次下载磁盘与VRAM、持续翻译调用和历史cache、恢复配置与凭据都需管理。退出关闭翻译/释放模型，核请求已终止及服务/权重留存，再卸包清命名cache与配置凭据；UI disposer只还原slot/timer，后台子进程结束由subprocess provider负责，本轮未验。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:51-54](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/package.json#L51-L54)

运行时要求

```text
  "engines": {
    "node": ">=20",
    "dsh": ">=0.1.0-rc.6"
  },
```

**依据 2 · 源码核查**：[lib/ollama.js:3-26](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/ollama.js#L3-L26)

本地识别与签名条件

<details>
<summary>查看原文（24行）</summary>

```text
export function ollamaOrigin(id, provider) {
  if (id !== 'openai' || !provider || provider.type !== 'openai') return null
  try {
    const url = new URL(provider.baseURL)
    if (url.protocol !== 'http:' || !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) ||
        url.port !== '11434' || !/^\/v1\/?$/.test(url.pathname) || url.username || url.password || url.search || url.hash) return null
    return url.origin
  } catch { return null }
}

export function localFirst(cfg) {
  const id = (cfg.chain || []).find(id => {
    const p = cfg.providers && cfg.providers[id]
    return p && (p.enabled || p.source === 'dsh')
  })
  const provider = cfg.providers && cfg.providers[id]
  return ollamaOrigin(id, provider) !== null && typeof provider.model === 'string' && !!provider.model.trim()
}

export function validOllamaSignature(report) {
  return report && report.status === 'Valid' && typeof report.subject === 'string' &&
    /(^|, )O=Ollama Inc\.(,|$)/.test(report.subject)
}

```

</details>

**依据 3 · 源码核查**：[lib/ollama.js:99-130](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/ollama.js#L99-L130)

准备只按显式安装下载许可

<details>
<summary>查看原文（32行）</summary>

```text
  }
  function start(provider, options = {}) {
    const origin = ollamaOrigin('openai', provider)
    const model = typeof provider?.model === 'string' ? provider.model.trim() : ''
    if (!origin || !model) throw new Error('A local Ollama endpoint and model are required')
    // No automatic installation or model download: the setup button grants both.
    const allowed = { allowInstall: options.allowInstall === true, allowDownload: options.allowDownload === true,
      keepAlive: options.keepAlive ?? 300 }
    const busy = [...jobs.values()].find(j => j.running && j.origin === origin && j.model === model)
    if (busy) {
      busy.options.allowInstall ||= allowed.allowInstall
      busy.options.allowDownload ||= allowed.allowDownload
      return snapshot(busy.id)
    }
    const job = { id: String(++sequence), origin, model, phase: 'checking', running: true,
      percent: null, completed: 0, total: 0, error: null, updatedAt: Date.now() }
    job.options = allowed
    latest = job
    jobs.set(job.id, job)
    job.promise = Promise.resolve().then(() => run(job, allowed))
    if (jobs.size > 30) for (const [id, old] of jobs) {
      if (!old.running && old !== latest) { jobs.delete(id); break }
    }
    return snapshot(job.id)
  }
  async function ensure(provider, options = {}) {
    const result = start(provider, options)
    const job = jobs.get(result.id)
    await job.promise
    if (job.phase !== 'ready') throw new Error(job.error || (job.phase === 'needs_install'
      ? 'Ollama is not installed; use the local setup button' : 'Selected model is not downloaded; use the local setup button'))
    return snapshot(job.id)
```

</details>

**依据 4 · 源码核查**：[lib/index.js:174-228](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/index.js#L174-L228)

实际下载安装签名与临时清理

<details>
<summary>查看原文（55行）</summary>

```text
async function installOllama(progress) {
  const file = join(tmpdir(), 'dsh-ollama-' + randomUUID() + '.exe')
  try {
    progress({ phase: 'downloading_ollama', percent: null, completed: 0, total: 0 })
    let totalBytes = 0
    try {
      const headers = await runProgram('curl', await curlArgs(['--fail', '--head', '--location', 'https://ollama.com/download/OllamaSetup.exe']), 30000)
      const lengths = [...headers.matchAll(/content-length:\s*(\d+)/gi)]
      if (lengths.length) totalBytes = Number(lengths[lengths.length - 1][1])
    } catch { /* A missing HEAD size does not prevent a signed download. */ }
    const args = await curlArgs(['--fail', '--location', '--proto', '=https', '--proto-redir', '=https',
      '--progress-bar', '--retry', '2', '--max-time', '1800', '--output', file, 'https://ollama.com/download/OllamaSetup.exe'])
    // Replace curlArgs' silent/25-second prefix with the download's own limit.
    const filtered = args.slice(3)
    const executable = await subprocessRef.resolveExecutable('curl')
    const child = subprocessRef.spawn({ argv: [executable, ...filtered], cwd: await workdir(), graceMs: 2000,
      signal: AbortSignal.timeout(30 * 60 * 1000), stdio: { stdin: 'ignore', stdout: 'ignore', stderr: 'pipe' } })
    let tail = ''
    if (child.stderr) for await (const bytes of child.stderr) {
      tail = (tail + new TextDecoder().decode(bytes)).slice(-2000)
      const matches = [...tail.matchAll(/(\d+(?:\.\d+)?)%/g)]
      const downloaded = await stat(file).catch(() => null)
      progress({ completed: downloaded ? downloaded.size : 0, total: totalBytes,
        percent: matches.length ? Math.min(100, Number(matches[matches.length - 1][1])) : null })
    }
    const outcome = await child.done
    if (outcome.exitCode !== 0) throw new Error('Ollama installer download failed: ' + tail.trim().slice(-300))
    progress({ phase: 'verifying', percent: null })
    const quoted = "'" + file.replace(/'/g, "''") + "'"
    const signature = await runProgram('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
      '$s=Get-AuthenticodeSignature -LiteralPath ' + quoted + '; @{status=[string]$s.Status;subject=$s.SignerCertificate.Subject}|ConvertTo-Json -Compress'], 30000)
    if (!validOllamaSignature(JSON.parse(signature))) throw new Error('Ollama installer signature verification failed')
    progress({ phase: 'installing', percent: null })
    const appState = join(process.env.LOCALAPPDATA, 'Ollama')
    await mkdir(appState, { recursive: true })
    await writeFile(join(appState, 'upgraded'), '', 'utf8') // Official installer convention: launch the app hidden.
    // The official per-user installer supports these unattended flags.
    const controller = new AbortController()
    const deadline = setTimeout(() => controller.abort(), 10 * 60 * 1000)
    try {
      // Ignore inherited pipes: a background app launched by the installer can
      // retain them even after the installer itself exits successfully.
      const child = subprocessRef.spawn({ argv: [file, '/VERYSILENT', '/NORESTART', '/SUPPRESSMSGBOXES'],
        cwd: await workdir(), graceMs: 2000, signal: controller.signal,
        stdio: { stdin: 'ignore', stdout: 'ignore', stderr: 'ignore' } })
      const outcome = await child.done
      if (outcome.exitCode !== 0) throw new Error('Ollama installation failed with exit code ' + outcome.exitCode)
    } finally { clearTimeout(deadline) }
  } finally {
    await unlink(file).catch(() => {}) // Only this operation's unique installer download.
  }
}

const localPreparation = createLocalPreparation({
  platform: process.platform, json: localJson, findExecutable: findOllamaExecutable,
```

</details>

**依据 5 · 源码核查**：[lib/local-model.js:5-12](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/local-model.js#L5-L12)

0是无限驻留

```text
export function modelKeepAlive(policy) {
  const minutes = policy?.idleMinutes === undefined ? 5 : policy.idleMinutes
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 1440) throw new Error('idleMinutes must be an integer from 0 to 1440')
  return minutes === 0 ? -1 : minutes * 60
}

const modelKey = name => name.includes(':') ? name : name + ':latest'

```

**依据 6 · 源码核查**：[lib/local-model.js:57-94](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/local-model.js#L57-L94)

等待active与release核模型状态

<details>
<summary>查看原文（38行）</summary>

```text
    const previous = model.release
    const unloading = keepAlive === 0
    const job = { id: (unloading ? 'release-' : 'policy-') + (++sequence), origin: model.origin, model: model.model, keepAlive,
      phase: model.active ? 'waiting_idle' : unloading ? 'unloading_model' : 'checking',
      running: true, percent: null, error: null, updatedAt: Date.now() }
    const progress = patch => Object.assign(job, patch, { updatedAt: Date.now() })
    latest = job
    model.job = job
    jobs.set(job.id, job)
    model.release = job.promise = Promise.resolve().then(async () => {
      try {
        if (previous) await previous
        if (model.active) await new Promise(resolve => { model.drained = resolve })
        await runtime.preparation.whenIdle(provider)
        progress({ phase: unloading ? 'unloading_model' : 'checking' })
        const current = await status(provider)
        if (current.loaded) {
          await runtime.json(model.origin + '/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: model.model, prompt: '', stream: false, keep_alive: keepAlive }) }, 120000)
          if (unloading && (await status(provider)).loaded) throw new Error('Ollama still reports this model as loaded')
        }
        progress({ phase: unloading || !current.loaded ? 'unloaded' : 'ready', running: false, percent: 100 })
      } catch (error) {
        progress({ phase: 'error', running: false, error: error instanceof Error ? error.message : String(error) })
      } finally { if (model.release === job.promise) model.release = null }
    })
    if (jobs.size > 30) for (const [id, old] of jobs) {
      if (!old.running && old !== latest) { jobs.delete(id); break }
    }
    return snapshot(job.id)
  }
  const release = provider => residency(provider, 0)
  function configChanged(before, after, policy, previousPolicy) {
    if (before?.enabled && !after?.enabled && ollamaOrigin('openai', before) && typeof before.model === 'string' && before.model.trim()) return release(before)
    if (after?.enabled && policy && ollamaOrigin('openai', after) && after.model?.trim() &&
        modelKeepAlive(policy) !== modelKeepAlive(previousPolicy)) return residency(after, modelKeepAlive(policy))
    return null
  }
```

</details>

#### 缺口

- 本轮未安装/下载/运行模型或卸载，实际VRAM/速度/费用和退出耗时未知
  **影响**：本地不等零成本，release不等卸载服务，视图退出不证明止费
  **进一步探讨**：先已有小模型和单脱敏块，核驻留/释放和失败回原文；安装另人工审操作与空间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证伪保真与阅读便利？

**研究主题**：新假设与验证

#### 完整回答

固定同一批已显示文本比较原文、人工翻译与插件输出，盲验否定词、参数、文件路径、代码字节及任务完成理解；不同语言与短混合文本单独核。注入提供方输出错语言/漏术语、慢本地模型、改namespace、官方翻译切换和隐藏视图。若翻译改变命令/否定含义、原文不可取回或出站越过local-only设置，则停止译文采用并回原文/官方单插件；省时与费用要同时记录，不能以cache命中当实测节省。

#### 证据与依据

**依据 1 · 源码核查**：[lib/text.js:98-111](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/text.js#L98-L111)

按原段拼接可逐字验

<details>
<summary>查看原文（14行）</summary>

```text
}

// Only prose reaches a provider; separators adjoining code stay byte-for-byte.
export async function translateProtectedText(text, translate, split = value => [value]) {
  const output = []
  for (const part of protectedTextParts(text)) {
    const match = !part.code && part.text.match(/^(\s*)([\s\S]*?)(\s*)$/)
    if (!match || !/\p{L}/u.test(match[2])) { output.push(part.text); continue }
    const chunks = []
    for (const chunk of split(match[2])) chunks.push((await translate(chunk)).trim())
    output.push(match[1] + chunks.join('\n\n') + match[3])
  }
  return output.join('')
}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1358-1430](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/client.js#L1358-L1430)

旧结果/错误重试对照

<details>
<summary>查看原文（73行）</summary>

```text

        function requestTranslate(text, target) {
            if (!needsTranslate(text, target)) return Promise.resolve({ ok: true, text: text, skipped: true });
            return refreshTranslationContext().then(function (context) {
                if (context.officialEnabled) return { ok: false, text: text, conflict: true };
                var namespace = context.cacheNamespace;
                var key = translationCacheKey(text, target);
                var hit = cacheMemGet(key);
                if (hit !== undefined) return hit;
                var busy = pend.get(key);
                if (busy !== undefined) return busy;
                var job = (async function () {
                    try {
                        var result = null, lastError = null;
                        var backoff = [0, 400];
                        for (var i = 0; i < backoff.length; i++) {
                            if (backoff[i]) await sleepMs(backoff[i]);
                            try { result = await hostAttempt(text, target); break; }
                            catch (error) { lastError = error; if (error && error.retryAt > Date.now()) break; }
                        }
                        if (!result) throw lastError || new Error("Translation unavailable");
                        // Read the Host again before admitting an in-flight result. Another
                        // window may have changed providers while this request was running.
                        var current = await refreshTranslationContext();
                        if (namespace !== current.cacheNamespace || current.officialEnabled || result.cacheNamespace !== namespace) {
                            return { ok: false, text: text, stale: true, retryAt: Date.now() + 1 };
                        }
                        if (result.providerSignature) recordCheck(result.provider, true, result.model, result.providerSignature);
                        stats.ok++; stats.lastError = null; stats.lastProvider = result.provider; stats.lastModel = result.model || null;
                        memSet(key, result);
                        return result;
                    } catch (error) {
                        if (namespace !== activeNamespace) return { ok: false, text: text, stale: true, retryAt: Date.now() + 1 };
                        stats.fail++;
                        stats.lastError = error instanceof Error ? error.message : String(error);
                        var failed = { ok: false, text: text, cacheNamespace: namespace,
                            retryAt: Math.max(Date.now() + 30000, error && error.retryAt || 0) };
                        memSet(key, failed);
                        return failed;
                    }
                })();
                pend.set(key, job);
                job.then(function () { if (pend.get(key) === job) pend.delete(key); }, function () { if (pend.get(key) === job) pend.delete(key); });
                return job;
            }).catch(function () { return { ok: false, text: text, retryAt: Date.now() + 30000 }; });
        }
		function memSet(key, entry) {
			cacheMemSet(key, entry);
		}

		function useXlate(text, enabled) {
			var s = useStore();
			var active = !!(enabled && !s.officialEnabled && s.contextKnown && text && text.trim());
			var key = active ? translationCacheKey(text, s.lang) : null;
			var pair = useState(function () { return key !== null ? cacheMemGet(key) : undefined; });
			var entry = pair[0];
			var setEntry = pair[1];
			useEffect(function () {
				if (!active || key === null) { setEntry(undefined); return undefined; }
				var alive = true;
				var retryTimer = null;
				function attempt() {
					if (!alive) return;
					retryTimer = null;
					requestTranslate(text, s.lang).then(function (r) {
						if (!alive) return;
						setEntry(r);
						if (!(r && r.ok)) retryTimer = setTimeout(attempt, Math.max(1, (r && r.retryAt || Date.now() + 30000) - Date.now()));
					});
				}
				attempt();
				return function () { alive = false; if (retryTimer !== null) clearTimeout(retryTimer); };
			}, [key, active]);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1188-1247](https://github.com/UncleK/dsh-think-translate/blob/15579dac387c53d0347a1da28b89ada898cdcd60/lib/index.js#L1188-L1247)

provider失败链对照

<details>
<summary>查看原文（60行）</summary>

```text
// Run one ordered provider-id list; returns { ok } or { ok: false, error }.
async function runChainFor(ids, text, target, cfg) {
  let lastErr = null
  const attempts = []
  for (const id of ids) {
    const p = cfg.providers && cfg.providers[id]
    // DSH-sourced providers are activated by chain membership (they cannot be
    // enabled via the config UI, which is read-only); everything else must be
    // explicitly enabled.
    if (!p) continue
    if (!p.enabled && p.source !== 'dsh') continue
    const adapter = ADAPTERS[p.type || id]
    if (!adapter) continue
    let localLease
    try {
      const local = ollamaOrigin(id, p)
      if (local) localLease = await localModels.acquire(p, cfg.localModel)
      const glossary = glossaryEntriesForTarget(cfg.glossary, target)
      const glossaryTargets = new Set()
      const translated = await translateProtectedText(text, async chunk => {
        const out = await translateWithGlossary(chunk, glossary, value => local ? viaLocalOllama(value, target, p, cfg.localModel) : adapter(value, target, p))
        const error = translationLanguageError(out.text, target, out.targets)
        if (error) throw new Error(error)
        out.targets.forEach(term => glossaryTargets.add(term))
        return out.text
      }, value => splitGlossaryText(value, glossary, chunkText))
      state.ok++
      state.lastProvider = id
      state.lastError = null
      // Carry the concrete model name so the UI can show e.g. "openai: qwen2.5:14b".
      attempts.push({ provider: id, signature: providerFingerprint(p), ok: true, model: p.model || null })
      return { ok: true, text: translated, provider: id, providerSignature: providerFingerprint(p), attempts,
        ...(glossaryTargets.size ? { glossaryTargets: [...glossaryTargets] } : {}), ...(p.model ? { model: p.model } : {}) }
    } catch (e) {
      lastErr = e
      attempts.push({ provider: id, signature: providerFingerprint(p), ok: false, model: p.model || null,
        ...(e instanceof Error && e.message.startsWith('translation language mismatch:') ? { error: e.message } : {}) })
      if (id === 'bing') bingCache = null
    } finally { if (localLease) localLease() }
  }
  return { ok: false, attempts, error: lastErr instanceof Error ? lastErr.message : (lastErr || 'no enabled provider in chain') }
}

function providerFingerprint(p) {
  return fnv(JSON.stringify({ type: p.type, baseURL: p.baseURL, model: p.model, apiKeyEnv: p.apiKeyEnv, apiKeyRef: p.apiKeyRef,
    apiKey: p.source === 'dsh' || p.apiKeyEnv ? undefined : p.apiKey }))
}

async function translateViaChain(text, target, cfg) {
  const primary = await runChainFor(cfg.chain || [], text, target, cfg)
  if (primary.ok) return primary
  let fb = null
  if (cfg.fallback && cfg.fallback.enabled && Array.isArray(cfg.fallback.chain)) {
    fb = await runChainFor(cfg.fallback.chain, text, target, cfg)
    if (fb.ok) return { ...fb, attempts: [...primary.attempts, ...fb.attempts] }
  }
  state.fail++
  state.lastError = primary.error || (fb && fb.error) || 'translate unavailable'
  return { ok: false, text: text, attempts: [...primary.attempts, ...(fb ? fb.attempts : [])], error: state.lastError }
}
```

</details>

#### 缺口

- 没有本轮盲评、用户任务或账单对照
  **影响**：无法确认读懂思考、减少时间或可靠保密
  **进一步探讨**：保存原始块/译文/网络目标和真实用量，以保真失败否定采用

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
