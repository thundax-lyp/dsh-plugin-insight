# dsh-ai-arcade

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[877d80c](https://github.com/439436269-ctrl/dsh-ai-arcade/tree/877d80ccce081eb76343ddacfb591f6c404b8ddd)

<!-- BEGIN META -->
[![npm 30d 299](https://img.shields.io/static/v1?label=npm+30d&message=299&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ai-arcade) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ai-arcade)
<!-- END META -->

> **实现功能**：DSH 内的双脑贪吃蛇和中国象棋，游戏规则本地运行，模型提供策略或解说。

> **核心亮点**：用本地规则兜底并仅让模型做高层意图，游戏页与长期缓存壳分开。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：模型付费路由仅 Host/Origin 栅栏，接受 GET 和自定义 system，未见独立鉴权或频控；README 推理 effort 说明与默认代码不符。详见[Q03](#research-q03)、[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 两款游戏为何把模型与本地规则分工？](#detail-section-11)
  - [Q02 · 浏览器游戏、宿主路由和模型凭证怎样隔离？](#detail-section-12)
  - [Q03 · 哪些请求会消耗模型额度，信任栅栏够吗？](#detail-section-13)
  - [Q04 · 模型选择、推理预算和安装要求有何成本？](#detail-section-14)
  - [Q05 · 如何在不暴露额度的情况下验证玩法？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户在 DSH 界面玩游戏并希望 AI 对手有策略/台词且不阻塞帧率。

纯本地贪吃蛇/象棋；插件增加 AI 话术与策略卡。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 本地游戏 | 规则/帧率 | 浏览器负载 |
| brain | 模型回复 | 额度路由 |
| play | 页面热更新 | 宿主 no-store |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| DSH llm/webServer | 模型/SSE | 离线游戏 |
| 浏览器 iframe | 游戏 UI | 不显示 |
| provider 额度 | 台词策略 | 默认策略 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 假模型 | 规则/离线 | 帧率和合法性 |
| 安全 | 路由认证/限额 | 无越权费用 |
| 小额试用 | 对账 usage | 预算内 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 安装 | DSH/Node/llm peer | 宿主兼容 |
| 使用 | 频繁模型调用/2048 token 上限 | 每局积分 |
| 治理 | 路由身份/预算 | 外网可达 |

| 结果 | 源码支持 | 未证实 |
| --- | --- | --- |
| 游戏规则 | 本地蛇/象棋引擎 | 实际乐趣 |
| AI 台词 | ctx.llm.stream | 费用/时延 |
| 页面刷新 | no-store 热读 | 反代缓存 |

> **思考**：模型付费路由仅 Host/Origin 栅栏，接受 GET 和自定义 system，未见独立鉴权或频控；README 推理 effort 说明与默认代码不符。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：用本地规则兜底并仅让模型做高层意图，游戏页与长期缓存壳分开。详见[Q01](#research-q01)、[Q02](#research-q02)。

用本地规则兜底并仅让模型做高层意图，游戏页与长期缓存壳分开。详见[Q01](#research-q01)、[Q02](#research-q02)。

模型在宿主，游戏在浏览器；付费路由 GET/POST 均可触发，信任栅栏缺账户鉴权与频控；默认 low。

<a id="detail-section-5"></a>

### 1.4 主要限制

模型付费路由仅 Host/Origin 栅栏，接受 GET 和自定义 system，未见独立鉴权或频控；README 推理 effort 说明与默认代码不符。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

假 LLM 先验规则/性能；授权少额试用前封住付费路由的身份与预算。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

模型/规则分工成立；brain 路由 GET/query 可花额度，默认 low 与 README off 不一致。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/play.js、lib/brain.js、lib/trust.js、lib/config.js、src/client/games/snake.js、src/client/games/xiangqi/ai.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态审阅 README、package、路由、信任、模型和本地规则源码；未运行目标游戏/模型。
- 下一步：隔离假 LLM 测 GET/POST/Origin/Host、规则/离线，再授权小额测时延与 usage。

**分析版本**

- **仓库**：[439436269-ctrl/dsh-ai-arcade](https://github.com/439436269-ctrl/dsh-ai-arcade)
- **版本号**：0.1.0（[固定提交 877d80c](https://github.com/439436269-ctrl/dsh-ai-arcade/tree/877d80ccce081eb76343ddacfb591f6c404b8ddd)）
- **版本日期**：2026-10-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

给付费路由加入认证/预算与 POST-only 后，可把游戏与模型建议分离用于更广娱乐场景；尚未实现。详见[Q05](#research-q05)。

隔离假 LLM 测 GET/POST/Origin/Host、规则/离线，再授权小额测时延与 usage。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 115 | — | — | 1460 |
| .js | source | 18 | 3429 | 2234 | 948 | — |
| .mjs | test | 2 | 387 | 295 | 61 | — |
| .mjs | source | 2 | 194 | 145 | 35 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-ai-arcade/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-ai-arcade/issues?q=is%3Aissue+created%3A2026-09-22T06%3A06%3A18.310Z..2026-10-22T06%3A06%3A18.310Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-ai-arcade/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A06%3A18.310Z..2026-10-22T06%3A06%3A18.310Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：审查游戏与模型职责分离、热更新及额度路由边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 两款游戏为何把模型与本地规则分工？

**研究主题**：场景与需求

#### 完整回答

双脑贪吃蛇的模型周期性给策略意图和台词，20x20 本地规则每 tick 选方向，模型慢时继续旧/默认策略；中国象棋的本地合法着法与搜索给出候选，模型只选择/解说，不直接决定规则。此分工使动画不依赖模型每帧响应，但棋力及模型台词的体验质量只由作者代码和测试声称，本轮未玩游戏或独立评估。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-20](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/README.md#L7-L20)

作者分工与性能记录。

<details>
<summary>查看原文（14行）</summary>

```text
| 游戏 | 模型做什么 | 本地做什么 |
|---|---|---|
| 🐍 **双脑贪吃蛇** | 每 1.7 秒出一张**策略卡**（目标 / 激进程度 / 风险偏好）+ 一句挑衅 | 按 60fps 跑规则、按策略卡决定每一步、模型慢或挂了自动兜底 |
| ♟ **中国象棋** | 只**解说**（从引擎给的候选里挑一个 + 说一句心理活动） | 走法生成、合法性校验、alpha-beta 搜索 —— **全部棋力** |

## 为什么模型不直接下棋 / 不直接控制蛇

因为它做不到，而且实测数据很清楚：

- **象棋**：马腿、象眼、炮架、将帅照面这些规则一旦交给模型，非法棋是常态；就算合法，几百行的搜索也轻松赢它。所以模型只被允许**从本地给出的合法候选里挑一个**——非法棋因此不可能出现。
- **贪吃蛇**：单次模型往返 **0.8–2 秒**，而游戏一步只要 140 毫秒。所以模型只出**意图**，具体走法由本地引擎算。
- **还有一个坑**：宿主默认的 `reasoningEffort` 是 `high`，实测一次游戏规模的提问会**烧掉 2048 个输出 token 全在思考块里、耗时 17 秒、正文为空**。这个插件显式要 `off`，同样的提问变成 **0.78 秒、37 个 token、回答完整**。

断网、模型超时、额度用尽 —— 两个游戏都照常运行，只是少了那张嘴。
```

</details>

**依据 2 · 源码核查**：[src/client/games/snake.js:1-35](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/src/client/games/snake.js#L1-L35)

默认策略和非阻塞约束。

<details>
<summary>查看原文（35行）</summary>

```text
/**
 * 双脑贪吃蛇 —— 游戏引擎（纯规则，不碰 DOM、不碰网络）。
 *
 * 三条设计约束，都是从实测里逼出来的：
 *
 *  1. **每一步必须是毫秒级的**。模型单次往返 0.8–2 秒，所以模型永远不决定
 *     "这一步怎么走"——它只出一张**策略卡**（目标/激进程度/风险偏好），
 *     具体走法由这里的 `chooseDirection` 每 tick 算一次。
 *  2. **宁可平庸也不能卡**。模型没回复就用上一张卡；一直没回复就用默认策略。
 *     引擎在任何情况下都不会等待网络。
 *  3. **规则要可复现**。`step()` 是确定性的，随机只出现在食物落点和低难度
 *     的失误率上，且都走同一个注入的 `rand`，方便测试时固定种子。
 *
 * @module src/client/games/snake
 */

/** Board is square; `GRID × GRID` cells. */
export const GRID = 20;

/** Direction name → `[dx, dy]` in grid cells (`y` grows downward). */
export const DIRS = Object.freeze({
	up: Object.freeze([0, -1]),
	down: Object.freeze([0, 1]),
	left: Object.freeze([-1, 0]),
	right: Object.freeze([1, 0]),
});

const OPPOSITE = { up: "down", down: "up", left: "right", right: "left" };

/** A策略卡 that makes a snake behave reasonably before the model says anything. */
export const DEFAULT_POLICY = Object.freeze({
	target: "food",
	aggression: 0.6,
	risk: 0.3,
	reason: "",
```

</details>

**依据 3 · 源码核查**：[src/client/games/xiangqi/ai.js:1-29](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/src/client/games/xiangqi/ai.js#L1-L29)

本地搜索与合法走法依赖。

<details>
<summary>查看原文（29行）</summary>

```text
/**
 * 象棋引擎的"棋力"部分：局面评估 + alpha-beta 搜索。
 *
 * 一个刻意的分工：**棋力全部来自这里，模型不参与算棋**。原因很直接——让
 * LLM 直接给走法，它会走出马蹩腿、炮翻空、将帅照面这类非法棋；就算合法，
 * 一个几百行的 alpha-beta 也能轻松赢它。所以模型的作用被限制在"从本地给出的
 * 候选里挑一个 + 说理由"，见 `brain` 那一侧。
 *
 * 搜索是 negamax + alpha-beta，内部走**伪合法**走法（不做自将过滤，靠"吃到将
 * 就返回绝杀分"剪枝，这是标准做法，比每步都做合法性检查快一个数量级）。根节点
 * 与界面才用真正的合法走法。
 *
 * @module src/client/games/xiangqi/ai
 */

import {
	BLACK,
	HEIGHT,
	RED,
	TYPES,
	VALUES,
	WIDTH,
	findKing,
	generateMoves,
	isInCheck,
	legalMoves,
	makeMove,
	undoMove,
} from "./rules.js";
```

</details>

#### 缺口

- 未运行目标游戏或模型。
  **影响**：流畅度、棋力与台词质量未知。
  **进一步探讨**：无模型和授权模型两组实机对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 浏览器游戏、宿主路由和模型凭证怎样隔离？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

插件客户端只提供入口/iframe，游戏页经同源 /play 路由每次从磁盘读且 no-store，改变页面可刷新看；/brain 路由由宿主 ctx.llm.stream 执行，凭证留宿主，SSE 返回增量和结束/错误。客户端游戏引擎纯规则，模型只提供高层信息。这个分离避免模型慢调用卡 60fps，但页面热读不代表宿主/壳改动可热更。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-12](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/lib/index.js#L1-L12)

模型调用与浏览器边界。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * dsh-ai-arcade — host half.
 *
 * One read-only-by-nature HTTP route that turns a game situation into one
 * streamed model reply. The browser half (declared through `package.json` →
 * `dsh.client`, `platform: "web"`) owns the 60fps game loop and never talks to
 * a model directly — it cannot, because the browser bundle has no access to the
 * host's `llm` service.
 *
 * The split is deliberate: credentials and provider adapters stay in the host
 * process, the game stays in the browser, and a slow model can never stall a
 * frame.
```

</details>

**依据 2 · 源码核查**：[lib/index.js:100-185](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/lib/index.js#L100-L185)

brain SSE/ctx.llm。

<details>
<summary>查看原文（86行）</summary>

```text
async function handleBrain(ctx, settings, trustedHosts, req, res) {
	if (!isTrustedRequest(req, trustedHosts)) {
		writeJson(res, 403, { ok: false, error: { code: "forbidden", message: "forbidden" } });
		return;
	}

	let payload;
	if (req.method === "POST") {
		try {
			payload = await readJsonBody(req, settings.maxBodyBytes);
		} catch (error) {
			writeJson(res, 400, {
				ok: false,
				error: { code: "bad-body", message: error instanceof Error ? error.message : "malformed body" },
			});
			return;
		}
	} else {
		let params;
		try {
			params = new URL(req.url ?? BRAIN_ROUTE, "http://localhost").searchParams;
		} catch {
			writeJson(res, 400, { ok: false, error: { code: "bad-request", message: "malformed request url" } });
			return;
		}
		payload = { prompt: params.get("prompt") ?? "", system: params.get("system") ?? undefined };
	}

	const prompt = typeof payload?.prompt === "string" ? payload.prompt.trim() : "";
	if (prompt === "") {
		writeJson(res, 400, { ok: false, error: { code: "empty-prompt", message: "prompt is required" } });
		return;
	}
	const system = typeof payload?.system === "string" && payload.system.trim() !== "" ? payload.system : BRAIN_SYSTEM;

	res.writeHead(200, SSE_HEADERS);
	res.flushHeaders?.();

	const controller = new AbortController();
	const onClientGone = () => controller.abort();
	res.on("close", onClientGone);
	const timer = setTimeout(() => controller.abort(), settings.timeoutMs);

	/**
	 * Write one SSE frame; a write after the client vanished is not an error.
	 *
	 * @param event - event name.
	 * @param data - JSON-serialisable payload.
	 */
	const send = (event, data) => {
		try {
			res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
		} catch {
			// Client disappeared mid-write; the close handler already aborted the call.
		}
	};

	try {
		const target = await resolveTarget(ctx, settings);
		if (target === null) {
			send("error", {
				code: "no-model",
				message: "no usable provider/model is registered in this harness",
			});
			return;
		}
		send("start", {
			provider: target.provider,
			model: target.model,
			source: target.source,
			reasoningEffort: settings.reasoningEffort,
		});

		const started = Date.now();
		const result = await streamBrain(ctx, {
			system,
			prompt,
			provider: target.provider,
			model: target.model,
			reasoningEffort: settings.reasoningEffort,
			maxTokens: settings.maxTokens,
			temperature: settings.temperature,
			signal: controller.signal,
			onDelta: (text) => send("delta", { text }),
			onThought: (text) => send("thinking", { text }),
		});
```

</details>

**依据 3 · 源码核查**：[lib/play.js:4-18](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/lib/play.js#L4-L18)

页面 no-store 动机。

<details>
<summary>查看原文（15行）</summary>

```text
 * Serves the self-contained game HTML on a same-origin path; the overlay panel
 * embeds it in an iframe.
 *
 * Three details matter, and all three exist because of one measured fact: DSH
 * serves plugin client bundles as `immutable` for a year AND caches the
 * aggregate server-side, so anything inside the plugin's browser bundle can only
 * be updated by restarting the harness. This page therefore lives outside that
 * bundle — and to stay iterable it must not be captured at import time either:
 *
 *  - the HTML is **read from disk on every request** (not imported as a module
 *    constant, which would be frozen in the ESM cache exactly like the bundle);
 *  - the response is `no-store`, so the browser re-asks every time;
 *  - the same trust fence as the brain route guards it, because this page can
 *    spend the user's model credits and the DSH web UI may be reachable through
 *    a LAN bind, a reverse proxy or a tunnel.
```

</details>

**依据 4 · 源码核查**：[lib/play.js:54-87](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/lib/play.js#L54-L87)

每次读 play.html。

<details>
<summary>查看原文（34行）</summary>

```text
export function registerPlayRoute(ctx) {
	const server = ctx.get("webServer");
	if (server === undefined || typeof server.register !== "function") {
		console.warn("[dsh-ai-arcade] no webServer service — play route not registered");
		return () => {};
	}
	const trustedHosts = ctx.get("webRuntime")?.trustedHosts ?? [];
	const dispose = server.register({
		kind: "exact",
		path: PLAY_ROUTE,
		handler: (req, res) => {
			if (!isTrustedRequest(req, trustedHosts)) {
				res.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
				res.end("forbidden");
				return;
			}
			const page = readPage();
			if (page === null) {
				res.writeHead(500, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
				res.end("play.html is missing — run `node tools/build-play.mjs`");
				return;
			}
			res.writeHead(200, {
				"content-type": "text/html; charset=utf-8",
				"cache-control": "no-store, must-revalidate",
			});
			res.end(page);
		},
	});
	console.log(`[dsh-ai-arcade] play page ready at ${PLAY_ROUTE} (served from ${PAGE_FILE})`);
	return () => {
		if (typeof dispose === "function") dispose();
	};
}
```

</details>

**依据 5 · 作者声明**：[README.md:47-59](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/README.md#L47-L59)

作者架构。

<details>
<summary>查看原文（13行）</summary>

````text
## 架构

```
🎮 按钮（插件客户端 bundle：一枚按钮 + 一个 iframe）
  └─ <iframe src="/api/dsh-ai-arcade/play">
        └─ 游戏页面（宿主路由，每次现读磁盘，no-store）
              └─ fetch /api/dsh-ai-arcade/brain
                    └─ ctx.llm.stream()  ← 凭证留在主进程
```

**游戏本体为什么不在插件的客户端 bundle 里**：DSH 把所有插件的浏览器半边聚合成一个响应，带一年 `immutable` 强缓存，服务端也缓存这份聚合；改客户端代码必须重启 DSH。把游戏放到宿主路由提供的页面上（`no-store`）之后，改玩法只要刷新页面 —— 这个插件在加入象棋、暂停功能的整个过程中没有重启过。

反过来，插件那一半只当"壳"，几乎不需要改。
````

</details>

#### 缺口

- 未验证生产包缓存与重载。
  **影响**：实际刷新路径是否被代理覆盖未知。
  **进一步探讨**：固定 DSH/反代 profile 下验证。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些请求会消耗模型额度，信任栅栏够吗？

**研究主题**：缺陷与关键质疑、工程质量与复用、效果与总成本

#### 完整回答

brain route 不只接受 POST：任何非 POST 都从 URL query 读取 prompt/system，非空便调用模型；且允许调用者自定 system。isTrustedRequest 检查 Host 是否 loopback/可信、拒绝显式 cross-site、Origin 存在时只比 hostname；缺 Origin 可通过，代码未见账户认证、请求频控或单独的额度上限。因这条路由会花用户模型额度，不能把“只读 HTTP 路由”理解为无副作用。实际外部可达性受宿主绑定与反代影响，未独立复现攻击。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:100-136](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/lib/index.js#L100-L136)

信任判断和 GET query 模型输入。

<details>
<summary>查看原文（37行）</summary>

```text
async function handleBrain(ctx, settings, trustedHosts, req, res) {
	if (!isTrustedRequest(req, trustedHosts)) {
		writeJson(res, 403, { ok: false, error: { code: "forbidden", message: "forbidden" } });
		return;
	}

	let payload;
	if (req.method === "POST") {
		try {
			payload = await readJsonBody(req, settings.maxBodyBytes);
		} catch (error) {
			writeJson(res, 400, {
				ok: false,
				error: { code: "bad-body", message: error instanceof Error ? error.message : "malformed body" },
			});
			return;
		}
	} else {
		let params;
		try {
			params = new URL(req.url ?? BRAIN_ROUTE, "http://localhost").searchParams;
		} catch {
			writeJson(res, 400, { ok: false, error: { code: "bad-request", message: "malformed request url" } });
			return;
		}
		payload = { prompt: params.get("prompt") ?? "", system: params.get("system") ?? undefined };
	}

	const prompt = typeof payload?.prompt === "string" ? payload.prompt.trim() : "";
	if (prompt === "") {
		writeJson(res, 400, { ok: false, error: { code: "empty-prompt", message: "prompt is required" } });
		return;
	}
	const system = typeof payload?.system === "string" && payload.system.trim() !== "" ? payload.system : BRAIN_SYSTEM;

	res.writeHead(200, SSE_HEADERS);
	res.flushHeaders?.();
```

</details>

**依据 2 · 源码核查**：[lib/index.js:173-205](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/lib/index.js#L173-L205)

调用模型并返回。

<details>
<summary>查看原文（33行）</summary>

```text
		const started = Date.now();
		const result = await streamBrain(ctx, {
			system,
			prompt,
			provider: target.provider,
			model: target.model,
			reasoningEffort: settings.reasoningEffort,
			maxTokens: settings.maxTokens,
			temperature: settings.temperature,
			signal: controller.signal,
			onDelta: (text) => send("delta", { text }),
			onThought: (text) => send("thinking", { text }),
		});
		const elapsedMs = Date.now() - started;

		if (result.ok) {
			send("done", {
				text: result.text,
				reasoningChars: typeof result.reasoning === "string" ? result.reasoning.length : 0,
				elapsedMs,
				provider: target.provider,
				model: target.model,
				...(result.usage === undefined ? {} : { usage: result.usage }),
			});
		} else {
			send("error", {
				code: result.code,
				message: result.detail,
				...(typeof result.reasoning === "string" && result.reasoning !== ""
					? { reasoningChars: result.reasoning.length }
					: {}),
				elapsedMs,
			});
```

</details>

**依据 3 · 源码核查**：[lib/trust.js:67-81](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/lib/trust.js#L67-L81)

Host/Origin 检查。

<details>
<summary>查看原文（15行）</summary>

```text
export function isTrustedRequest(request, trustedHosts) {
	const host = headerOf(request?.headers, "host");
	if (host === undefined) return false;
	const hostname = authorityHostname(host);
	if (hostname === null) return false;
	if (!isLoopbackHostname(hostname) && !isTrustedAuthority(host, trustedHosts)) return false;
	if (headerOf(request?.headers, "sec-fetch-site") === "cross-site") return false;
	const origin = headerOf(request?.headers, "origin");
	if (origin === undefined) return true;
	try {
		return new URL(origin).hostname.toLowerCase() === hostname;
	} catch {
		return false;
	}
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1-12](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/lib/index.js#L1-L12)

源码注释称 read-only。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * dsh-ai-arcade — host half.
 *
 * One read-only-by-nature HTTP route that turns a game situation into one
 * streamed model reply. The browser half (declared through `package.json` →
 * `dsh.client`, `platform: "web"`) owns the 60fps game loop and never talks to
 * a model directly — it cannot, because the browser bundle has no access to the
 * host's `llm` service.
 *
 * The split is deliberate: credentials and provider adapters stay in the host
 * process, the game stays in the browser, and a slow model can never stall a
 * frame.
```

</details>

#### 缺口

- 未看真实 DSH 路由外层鉴权/绑定。
  **影响**：未经授权消耗额度的可达性待验证。
  **进一步探讨**：隔离假 LLM/反代矩阵核认证与频率。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 模型选择、推理预算和安装要求有何成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包要求 Node>=22、Cordis 与 dsh-llm peer，package 只宣称 DSH 0.2.0-rc.2 兼容。resolveTarget 优先配置 provider/model，失败自动选第一个可用；每次 brain 调用可用 maxTokens 2048、timeout 45s。README 示例/叙述强调 reasoningEffort=off 与测得 0.78s，但固定源码默认是 low；若模型拒绝此参数，会再试一次不带参数，可能形成额外调用。作者延迟/token 数据不是独立基准。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:35-70](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/package.json#L35-L70)

引擎/peer/兼容。

<details>
<summary>查看原文（36行）</summary>

```text
    "README.md",
    "LICENSE"
  ],
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "build": "node tools/build-client.mjs && node tools/build-play.mjs",
    "build:client": "node tools/build-client.mjs",
    "build:play": "node tools/build-play.mjs",
    "test": "node test/bundle-check.mjs && node --test test/xiangqi.test.mjs"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-llm": "^0.2.0-rc.2"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-slots"
      ],
      "platform": "web"
    },
    "compatibility": {
      "dshReleases": {
        "0.2.0-rc.2": "compatible"
      }
    }
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/439436269-ctrl/dsh-ai-arcade.git"
  },
```

</details>

**依据 2 · 源码核查**：[lib/config.js:18-35](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/lib/config.js#L18-L35)

实际 low 默认。

<details>
<summary>查看原文（18行）</summary>

```text
/** Code-side defaults, mirrored by the `Config` schema below. */
export const DEFAULTS = Object.freeze({
	enabled: true,
	provider: "deepseek-account",
	model: "deepseek-flash",
	// Measured on this box: at the host default (high) a game-sized prompt spends
	// the whole output budget on the reasoning block and returns an EMPTY text
	// block after ~9s; at `low` the same prompt answers in ~1-2s with text.
	reasoningEffort: "low",
	maxTokens: 2048,
	timeoutMs: 45_000,
	temperature: 0.7,
	maxBodyBytes: 65_536,
	// Not a feature: changing this string is what makes the loader re-read this
	// plugin row, which is how a host-half edit (and the client bundle served
	// from it) is picked up without restarting DSH. `tools/dev-sync.sh` bumps it.
	devStamp: "",
});
```

</details>

**依据 3 · 源码核查**：[lib/brain.js:73-105](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/lib/brain.js#L73-L105)

自动选模型。

<details>
<summary>查看原文（33行）</summary>

```text
/**
 * Resolve the provider/model pair this plugin should call.
 *
 * @param ctx - host plugin context (needs the `llm` service).
 * @param settings - resolved plugin settings.
 * @returns the pair, or null when the host advertises no usable model.
 */
export async function resolveTarget(ctx, settings) {
	const provider = settings.provider;
	const model = settings.model;
	if (provider !== "" && model !== "") {
		try {
			await ctx.llm.resolveModelInfo(provider, model);
			return { provider, model, source: "config" };
		} catch {
			// Fall through to discovery: a profile without this provider is not an error.
		}
	}
	try {
		const providers = ctx.llm.listProviders() ?? [];
		for (const entry of providers) {
			const id = typeof entry === "string" ? entry : entry?.id;
			if (typeof id !== "string" || id === "") continue;
			const models = await ctx.llm.listModels(id);
			if (!Array.isArray(models)) continue;
			const first = models.find((candidate) => typeof candidate === "string" && candidate !== "");
			if (first !== undefined) return { provider: id, model: first, source: "auto" };
		}
	} catch {
		// No discovery either — report the absence instead of guessing.
	}
	return null;
}
```

</details>

**依据 4 · 源码核查**：[lib/brain.js:190-210](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/lib/brain.js#L190-L210)

reasoning 参数失败重试。

<details>
<summary>查看原文（21行）</summary>

```text
	try {
		return await attempt(reasoningEffort);
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		// A model that advertises no reasoning support rejects the knob outright;
		// the call itself is still fine, so retry once without it.
		if (typeof reasoningEffort === "string" && reasoningEffort !== "" && /reasoning/i.test(detail)) {
			try {
				return await attempt("");
			} catch (retryError) {
				return {
					ok: false,
					text: "",
					reasoning: "",
					code: "stream-failed",
					detail: retryError instanceof Error ? retryError.message : String(retryError),
				};
			}
		}
		return { ok: false, text: "", reasoning: "", code: "stream-failed", detail };
	}
```

</details>

**依据 5 · 作者声明**：[README.md:12-18](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/README.md#L12-L18)

作者 off 及性能声称。

```text
## 为什么模型不直接下棋 / 不直接控制蛇

因为它做不到，而且实测数据很清楚：

- **象棋**：马腿、象眼、炮架、将帅照面这些规则一旦交给模型，非法棋是常态；就算合法，几百行的搜索也轻松赢它。所以模型只被允许**从本地给出的合法候选里挑一个**——非法棋因此不可能出现。
- **贪吃蛇**：单次模型往返 **0.8–2 秒**，而游戏一步只要 140 毫秒。所以模型只出**意图**，具体走法由本地引擎算。
- **还有一个坑**：宿主默认的 `reasoningEffort` 是 `high`，实测一次游戏规模的提问会**烧掉 2048 个输出 token 全在思考块里、耗时 17 秒、正文为空**。这个插件显式要 `off`，同样的提问变成 **0.78 秒、37 个 token、回答完整**。
```

#### 缺口

- 未用目标模型测实际 token/延迟。
  **影响**：费用与重试次数未知。
  **进一步探讨**：受控模型账号记录 usage。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何在不暴露额度的情况下验证玩法？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先禁用或替换模型为假 llm，在本地测试蛇与象棋规则、无模型降级、暂停与 UI；再用授权少量额度测策略频率和每局 usage。对部署在 LAN/隧道的宿主，先给 /brain 外层身份认证、限制 GET/自定 system 与频率/预算，之后才考虑开放他人访问。把规则引擎与模型建议分离可复用，但额度边界需额外实现。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/games/snake.js:1-35](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/src/client/games/snake.js#L1-L35)

无模型默认策略。

<details>
<summary>查看原文（35行）</summary>

```text
/**
 * 双脑贪吃蛇 —— 游戏引擎（纯规则，不碰 DOM、不碰网络）。
 *
 * 三条设计约束，都是从实测里逼出来的：
 *
 *  1. **每一步必须是毫秒级的**。模型单次往返 0.8–2 秒，所以模型永远不决定
 *     "这一步怎么走"——它只出一张**策略卡**（目标/激进程度/风险偏好），
 *     具体走法由这里的 `chooseDirection` 每 tick 算一次。
 *  2. **宁可平庸也不能卡**。模型没回复就用上一张卡；一直没回复就用默认策略。
 *     引擎在任何情况下都不会等待网络。
 *  3. **规则要可复现**。`step()` 是确定性的，随机只出现在食物落点和低难度
 *     的失误率上，且都走同一个注入的 `rand`，方便测试时固定种子。
 *
 * @module src/client/games/snake
 */

/** Board is square; `GRID × GRID` cells. */
export const GRID = 20;

/** Direction name → `[dx, dy]` in grid cells (`y` grows downward). */
export const DIRS = Object.freeze({
	up: Object.freeze([0, -1]),
	down: Object.freeze([0, 1]),
	left: Object.freeze([-1, 0]),
	right: Object.freeze([1, 0]),
});

const OPPOSITE = { up: "down", down: "up", left: "right", right: "left" };

/** A策略卡 that makes a snake behave reasonably before the model says anything. */
export const DEFAULT_POLICY = Object.freeze({
	target: "food",
	aggression: 0.6,
	risk: 0.3,
	reason: "",
```

</details>

**依据 2 · 源码核查**：[src/client/games/xiangqi/ai.js:1-29](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/src/client/games/xiangqi/ai.js#L1-L29)

本地规则。

<details>
<summary>查看原文（29行）</summary>

```text
/**
 * 象棋引擎的"棋力"部分：局面评估 + alpha-beta 搜索。
 *
 * 一个刻意的分工：**棋力全部来自这里，模型不参与算棋**。原因很直接——让
 * LLM 直接给走法，它会走出马蹩腿、炮翻空、将帅照面这类非法棋；就算合法，
 * 一个几百行的 alpha-beta 也能轻松赢它。所以模型的作用被限制在"从本地给出的
 * 候选里挑一个 + 说理由"，见 `brain` 那一侧。
 *
 * 搜索是 negamax + alpha-beta，内部走**伪合法**走法（不做自将过滤，靠"吃到将
 * 就返回绝杀分"剪枝，这是标准做法，比每步都做合法性检查快一个数量级）。根节点
 * 与界面才用真正的合法走法。
 *
 * @module src/client/games/xiangqi/ai
 */

import {
	BLACK,
	HEIGHT,
	RED,
	TYPES,
	VALUES,
	WIDTH,
	findKing,
	generateMoves,
	isInCheck,
	legalMoves,
	makeMove,
	undoMove,
} from "./rules.js";
```

</details>

**依据 3 · 源码核查**：[lib/index.js:100-136](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/lib/index.js#L100-L136)

现有输入面。

<details>
<summary>查看原文（37行）</summary>

```text
async function handleBrain(ctx, settings, trustedHosts, req, res) {
	if (!isTrustedRequest(req, trustedHosts)) {
		writeJson(res, 403, { ok: false, error: { code: "forbidden", message: "forbidden" } });
		return;
	}

	let payload;
	if (req.method === "POST") {
		try {
			payload = await readJsonBody(req, settings.maxBodyBytes);
		} catch (error) {
			writeJson(res, 400, {
				ok: false,
				error: { code: "bad-body", message: error instanceof Error ? error.message : "malformed body" },
			});
			return;
		}
	} else {
		let params;
		try {
			params = new URL(req.url ?? BRAIN_ROUTE, "http://localhost").searchParams;
		} catch {
			writeJson(res, 400, { ok: false, error: { code: "bad-request", message: "malformed request url" } });
			return;
		}
		payload = { prompt: params.get("prompt") ?? "", system: params.get("system") ?? undefined };
	}

	const prompt = typeof payload?.prompt === "string" ? payload.prompt.trim() : "";
	if (prompt === "") {
		writeJson(res, 400, { ok: false, error: { code: "empty-prompt", message: "prompt is required" } });
		return;
	}
	const system = typeof payload?.system === "string" && payload.system.trim() !== "" ? payload.system : BRAIN_SYSTEM;

	res.writeHead(200, SSE_HEADERS);
	res.flushHeaders?.();
```

</details>

**依据 4 · 源码核查**：[lib/trust.js:67-81](https://github.com/439436269-ctrl/dsh-ai-arcade/blob/877d80ccce081eb76343ddacfb591f6c404b8ddd/lib/trust.js#L67-L81)

现有信任判定。

<details>
<summary>查看原文（15行）</summary>

```text
export function isTrustedRequest(request, trustedHosts) {
	const host = headerOf(request?.headers, "host");
	if (host === undefined) return false;
	const hostname = authorityHostname(host);
	if (hostname === null) return false;
	if (!isLoopbackHostname(hostname) && !isTrustedAuthority(host, trustedHosts)) return false;
	if (headerOf(request?.headers, "sec-fetch-site") === "cross-site") return false;
	const origin = headerOf(request?.headers, "origin");
	if (origin === undefined) return true;
	try {
		return new URL(origin).hostname.toLowerCase() === hostname;
	} catch {
		return false;
	}
}
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
