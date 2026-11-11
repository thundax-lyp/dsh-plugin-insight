# dsh-better-deepseek

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[b104386](https://github.com/EdgeTypE/dsh-better-deepseek/tree/b1043860f5f10fd7ed12664ebe32ca4fd6445aca)

<!-- BEGIN META -->
[![GitHub ★ 42](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=42&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EdgeTypE/dsh-better-deepseek) [![npm 30d 628](https://img.shields.io/static/v1?label=npm+30d&message=628&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-deepseek) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-deepseek)
<!-- END META -->

> **功能**：为 Better DeepSeek 浏览器扩展提供 DeepSeek Harness 会话控制与事件桥接。

> **亮点**：[Q01](#research-q01) 把会话创建、消息和任务结果作为扩展可调用入口提供。

> **主要限制**：[Q02](#research-q02) SSE 广播未按订阅者过滤会话，控制分支未核对会话所有者。

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
  - [Q01 · 扩展怎样从网页接入代理会话？](#detail-section-11)
  - [Q02 · SSE 与控制路由的会话授权在哪里？](#detail-section-12)
  - [Q03 · 状态回读与处理失败需要哪些成本？](#detail-section-13)
  - [Q04 · 当前如何采用，修复后怎样验收隔离？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：浏览器扩展用户可以研究如何从网页发起并观察 DSH 任务。

DSH 原生 Web 可直接使用会话；扩展桥接增加独立的浏览器侧控制入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话控制 | 创建、提示、查询与取消代理 | 未核实请求者归属 |
| 事件订阅 | 传递助手和工具进度 | 每个订阅者共享广播 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 服务与代理 | 必需 | 注册与执行会话 | 使用原生会话 |
| 浏览器扩展 | 扩展路径需要 | 发请求和接 SSE | 原生页面处理 |
| 经验证的会话隔离 | 真实数据使用条件 | 阻断交叉事件 | 仅隔离评估 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 对照 | 使用者打开两条隔离会话 | 不同会话事件可区分 |
| 检查 | 核对订阅与控制拒绝 | 目前固定源码未提供绑定 |
| 退出 | 真实会话回原生页面 | 停用桥接并核对在途任务 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 环境及模型未知 | 安装与隔离核对 | 依赖声明未验 |
| 持续 | 事件与模型开销未知 | 维护客户端和权限 | 泄露影响不可回收 |
| 失败恢复 | 重试资源未知 | 核对代理与结果 | 取消状态不够 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 扩展控制 | 会话创建、提示和取消接线 | 真实兼容 |
| 事件接收 | 广播与会话标签 | 上游外层访问限制 |

> **思考**：[Q02](#research-q02) SSE 广播未按订阅者过滤会话，控制分支未核对会话所有者。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把会话创建、消息和任务结果作为扩展可调用入口提供。

分开的事件和控制接口便于接入，但全局订阅集合、只凭会话 ID 的控制和进程内状态限制复用。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) SSE 广播未按订阅者过滤会话，控制分支未核对会话所有者。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 真实任务保留原生界面，只有隔离验收能证实无交叉事件和控制后再评估。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本已核查实际包入口和 TypeScript 分发。未运行扩展或实际宿主。

- 已检查：作者 README、包清单、源码路径 package.json、lib/index.js、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定桥接包源码和发行入口，未执行扩展、宿主或外网环境，未审计扩展本身。
- 下一步：用两组客户端在隔离宿主分别核对跨会话 SSE、控制和真实取消状态。

**分析版本**

- **仓库**：[EdgeTypE/dsh-better-deepseek](https://github.com/EdgeTypE/dsh-better-deepseek)
- **版本号**：0.1.0（[固定提交 b104386](https://github.com/EdgeTypE/dsh-better-deepseek/tree/b1043860f5f10fd7ed12664ebe32ca4fd6445aca)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 将订阅和控制统一绑定身份与会话，可能保留浏览器接线并阻断串流。

用两组客户端在隔离宿主分别核对跨会话 SSE、控制和真实取消状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 687 | 636 | 48 | — |
| .md | source | 1 | 40 | — | — | 152 |
| .ts | source | 2 | 371 | 307 | 25 | — |
| .js | test | 1 | 54 | 53 | 4 | — |
| .ts | test | 1 | 66 | 53 | 3 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-11），可前往 [GitHub Issues](https://github.com/EdgeTypE/dsh-better-deepseek/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Better DeepSeek 扩展接入 DSH 时，桥接是否把会话动作和事件限制到正确的客户端？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 扩展怎样从网页接入代理会话？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

希望从浏览器扩展发起 DSH 任务的人，需要能创建一条有明确工作目录的会话、发送文本、观察进度并读回该会话结果。原生 Web 已能完成代理会话，桥接增加扩展可消费的 HTTP/SSE 接口。包入口注册 /api/better-deepseek，创建分支接收 cwd 并调用 agents.create，prompt 分支按 session ID 查代理并调用 followup。算法和宿主工具仍由 DSH 提供，插件增加客户端适配。作者 README 声称会话过滤，是否成立要看实际服务端事件分发。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-4](https://github.com/EdgeTypE/dsh-better-deepseek/blob/b1043860f5f10fd7ed12664ebe32ca4fd6445aca/README.md#L1-L4)

作者声明浏览器扩展桥接与会话过滤。

```text
# dsh-better-deepseek


DeepSeek Harness bridge plugin for [Better DeepSeek](https://github.com/EdgeTypE/better-deepseek) Chrome extension integration. Provides an HTTP handshake endpoint and session-filtered SSE event streams over `webServer`.
```

**依据 2 · 源码核查**：[package.json:13-38](https://github.com/EdgeTypE/dsh-better-deepseek/blob/b1043860f5f10fd7ed12664ebe32ca4fd6445aca/package.json#L13-L38)

实际发布入口和 bundle 声明。

<details>
<summary>查看原文（26行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./invariant": {
      "types": "./lib/types/invariant.d.ts",
      "default": "./lib/invariant.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./src/*": "./src/*",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/index.js",
    "lib/invariant.js",
    "cordis.patch.yml",
    "lib/types/**/*.d.ts"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:70-103](https://github.com/EdgeTypE/dsh-better-deepseek/blob/b1043860f5f10fd7ed12664ebe32ca4fd6445aca/lib/index.js#L70-L103)

输入 cwd、模型选择及代理创建。

<details>
<summary>查看原文（34行）</summary>

```text
						if (pathname === "/api/better-deepseek/session.create") {
							try {
								const cwd = body.payload?.cwd ?? process.cwd();
								const sessionId = `session-${Date.now()}`;
								this.latestAssistantTextBySession.set(sessionId, "");
								const defaultModel = this.ctx.get("agentDefaultModel");
								const selection = defaultModel ? defaultModel.currentSelection() : {
									provider: "deepseek-official",
									model: "deepseek-chat"
								};
								const presets = this.ctx.get("agentPresets");
								let presetId;
								if (presets) try {
									presetId = (await presets.resolve(void 0))?.id;
								} catch {}
								await this.ctx.agents.create({
									sessionId,
									meta: {
										cwd,
										...presetId !== void 0 ? { agentPreset: presetId } : {}
									},
									agentOptions: {
										provider: selection.provider,
										model: selection.model
									},
									setup: async (agentCtx) => {
										installModelSelection(agentCtx, {
											current: selection,
											assembled: void 0
										});
										if (presets && presetId) await presets.mount(agentCtx, presetId);
									}
								});
								res.writeHead(200, { "Content-Type": "application/json" });
```

</details>

**依据 4 · 源码核查**：[lib/index.js:125-146](https://github.com/EdgeTypE/dsh-better-deepseek/blob/b1043860f5f10fd7ed12664ebe32ca4fd6445aca/lib/index.js#L125-L146)

通过 session ID 将文字排入现有代理。

<details>
<summary>查看原文（22行）</summary>

```text
						if (pathname === "/api/better-deepseek/session.prompt") {
							const sessionId = body.payload?.sessionId ?? "";
							const text = body.payload?.text ?? "";
							const agent = this.ctx.agents.get(sessionId);
							if (agent) {
								const userMsg = {
									id: crypto.randomUUID(),
									role: "user",
									source: { kind: "user" },
									content: [{
										type: "text",
										text
									}]
								};
								agent.followup(userMsg);
								res.writeHead(200, { "Content-Type": "application/json" });
								res.end(JSON.stringify({
									type: "server-response",
									rpcId,
									result: {
										ok: true,
										value: {}
```

</details>

#### 缺口

- 没有实际扩展加载与消息顺序验收。
  **影响**：不能确认浏览器客户端或打包依赖兼容。
  **进一步探讨**：在隔离宿主核对真实扩展只访问自己创建的测试会话。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · SSE 与控制路由的会话授权在哪里？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

固定包入口在订阅时把响应直接加入一个 Set，既未登记请求者也未绑定会话。广播时将每条 payload 写给集合中所有订阅者，payload 含 sessionId 只提供标签。工具事件还带 args 和 output。控制请求直接用请求中的 session ID 访问 ctx.agents，在所查分支没有请求者与会话归属匹配。默认允许任意 CORS Origin，关闭只改变浏览器响应头。因而即使有宿主外层路由保护，凡能成功订阅的客户端之间仍没有插件层会话隔离。宿主是否另有限制以及浏览器实际能否跨源访问仍需验证，不能推断互联网可直接访问。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:36-49](https://github.com/EdgeTypE/dsh-better-deepseek/blob/b1043860f5f10fd7ed12664ebe32ca4fd6445aca/lib/index.js#L36-L49)

订阅集合无会话筛选。

<details>
<summary>查看原文（14行）</summary>

```text
					if (pathname === "/api/better-deepseek/events") {
						res.writeHead(200, {
							"Content-Type": "text/event-stream",
							"Cache-Control": "no-cache",
							"Connection": "keep-alive"
						});
						res.write(": connected\n\n");
						this.sseClients.add(res);
						req.on("close", () => {
							this.sseClients.delete(res);
						});
						return;
					}
					if (pathname === "/api/better-deepseek/session.result" && req.method === "GET") {
```

</details>

**依据 2 · 源码核查**：[lib/index.js:125-140](https://github.com/EdgeTypE/dsh-better-deepseek/blob/b1043860f5f10fd7ed12664ebe32ca4fd6445aca/lib/index.js#L125-L140)

按传入 ID 取现有代理。

<details>
<summary>查看原文（16行）</summary>

```text
						if (pathname === "/api/better-deepseek/session.prompt") {
							const sessionId = body.payload?.sessionId ?? "";
							const text = body.payload?.text ?? "";
							const agent = this.ctx.agents.get(sessionId);
							if (agent) {
								const userMsg = {
									id: crypto.randomUUID(),
									role: "user",
									source: { kind: "user" },
									content: [{
										type: "text",
										text
									}]
								};
								agent.followup(userMsg);
								res.writeHead(200, { "Content-Type": "application/json" });
```

</details>

**依据 3 · 源码核查**：[lib/index.js:197-208](https://github.com/EdgeTypE/dsh-better-deepseek/blob/b1043860f5f10fd7ed12664ebe32ca4fd6445aca/lib/index.js#L197-L208)

默认星号 CORS。

<details>
<summary>查看原文（12行）</summary>

```text
	handleCors(req, res) {
		if (this.config.enableCors !== false) {
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
			res.setHeader("Access-Control-Allow-Headers", "Content-Type");
		}
		if (req.method === "OPTIONS") {
			res.writeHead(204);
			res.end();
			return true;
		}
		return false;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:247-265](https://github.com/EdgeTypE/dsh-better-deepseek/blob/b1043860f5f10fd7ed12664ebe32ca4fd6445aca/lib/index.js#L247-L265)

参数和工具结果进入事件。

<details>
<summary>查看原文（19行）</summary>

```text
		this.ctx.effect(() => {
			return this.ctx.on("tools/pre-execute", (exec, next) => {
				const sessionId = exec.agent?.id;
				if (sessionId !== void 0) this.broadcast("tool/call", {
					sessionId,
					tool: exec.name,
					args: exec.arguments
				});
				return next();
			});
		}, "better-deepseek: tool pre-execute listener");
		this.ctx.effect(() => {
			return this.ctx.on("tools/post-execute", (exec, result, next) => {
				const sessionId = exec.agent?.id;
				if (sessionId !== void 0) this.broadcast("tool/result", {
					sessionId,
					tool: exec.name,
					output: result
				});
```

</details>

**依据 5 · 源码核查**：[lib/index.js:284-291](https://github.com/EdgeTypE/dsh-better-deepseek/blob/b1043860f5f10fd7ed12664ebe32ca4fd6445aca/lib/index.js#L284-L291)

每条消息写到所有订阅者。

```text
	broadcast(type, payload) {
		const data = `data: ${JSON.stringify({
			type,
			timestamp: Date.now(),
			payload
		})}\n\n`;
		for (const client of this.sseClients) client.write(data);
	}
```

**依据 6 · 源码核查**：[src/index.ts:339-344](https://github.com/EdgeTypE/dsh-better-deepseek/blob/b1043860f5f10fd7ed12664ebe32ca4fd6445aca/src/index.ts#L339-L344)

TypeScript 源亦遍历全部订阅。

```text
  private broadcast(type: string, payload: unknown): void {
    const data = `data: ${JSON.stringify({ type, timestamp: Date.now(), payload })}\n\n`
    for (const client of this.sseClients) {
      client.write(data)
    }
  }
```

#### 缺口

- 未运行真实宿主权限或浏览器网络策略。
  **影响**：发现限于桥接接线，实际可达范围未知。
  **进一步探讨**：用两个受控扩展连接和两条测试会话检查交叉事件与控制拒绝。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 状态回读与处理失败需要哪些成本？

**研究主题**：效果与总成本、缺陷与关键质疑

#### 完整回答

结果接口读进程内 Map，找不到代理时给 idle，找不到文本时给空字符串，仍可回 ok。停止操作调用 agent.cancel 后立即返回 canceled，未等待实际终态或回滚工具动作。浏览器用户要承担核对会话 ID、实际工具状态和重连的时间；宿主承担代理运行、事件存储与并发资源。现有代码逐段拼接文本，普通结果接口没有明确的任务关联字段，断线后不能仅用空 idle 判断某次请求是否执行。费用和在途压力无实测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:49-65](https://github.com/EdgeTypE/dsh-better-deepseek/blob/b1043860f5f10fd7ed12664ebe32ca4fd6445aca/lib/index.js#L49-L65)

结果缺失以 idle 和空文本回退。

<details>
<summary>查看原文（17行）</summary>

```text
					if (pathname === "/api/better-deepseek/session.result" && req.method === "GET") {
						const sessionId = url.searchParams.get("sessionId") ?? "";
						const finalText = this.latestAssistantTextBySession.get(sessionId) ?? "";
						const agent = this.ctx.agents.get(sessionId);
						res.writeHead(200, { "Content-Type": "application/json" });
						res.end(JSON.stringify({
							type: "server-response",
							result: {
								ok: true,
								value: {
									sessionId,
									status: agent?.status ?? "idle",
									finalText
								}
							}
						}));
						return;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:162-174](https://github.com/EdgeTypE/dsh-better-deepseek/blob/b1043860f5f10fd7ed12664ebe32ca4fd6445aca/lib/index.js#L162-L174)

调用取消即返回。

<details>
<summary>查看原文（13行）</summary>

```text
						if (pathname === "/api/better-deepseek/session.cancel") {
							const sessionId = body.payload?.sessionId ?? "";
							const agent = this.ctx.agents.get(sessionId);
							if (agent) {
								agent.cancel("user-request");
								res.writeHead(200, { "Content-Type": "application/json" });
								res.end(JSON.stringify({
									type: "server-response",
									rpcId,
									result: {
										ok: true,
										value: { canceled: true }
									}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:222-242](https://github.com/EdgeTypE/dsh-better-deepseek/blob/b1043860f5f10fd7ed12664ebe32ca4fd6445aca/lib/index.js#L222-L242)

进程内保存并广播会话文本。

<details>
<summary>查看原文（21行）</summary>

```text
			return this.ctx.on("session/event", (session, event) => {
				if (event.type === "assistant/chunk") {
					const chunkData = event.data;
					const delta = chunkData.text ?? chunkData.delta ?? chunkData.chunk?.text ?? chunkData.chunk?.delta ?? "";
					if (delta) {
						const current = this.latestAssistantTextBySession.get(session.id) ?? "";
						this.latestAssistantTextBySession.set(session.id, current + delta);
						this.broadcast("assistant/chunk", {
							sessionId: session.id,
							delta
						});
					}
				}
				if (event.type === "assistant/message") {
					const text = event.data.message?.content?.filter((c) => c.type === "text").map((c) => c.text).join("") ?? "";
					if (text) {
						this.latestAssistantTextBySession.set(session.id, text);
						this.broadcast("assistant/message", {
							sessionId: session.id,
							text
						});
```

</details>

#### 缺口

- 未跑并发、长会话或进程重启。
  **影响**：不能核定实际资源压力或状态恢复。
  **进一步探讨**：在隔离环境记录重启和取消前后的实际会话和应答。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 当前如何采用，修复后怎样验收隔离？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前不建议在处理真实会话的 DSH profile 安装这版桥接。扩展用户可以继续用原生 Web 查同一会话，保留浏览器自动化研究到无敏感资料的隔离环境。未验证设计是先给订阅和控制做明确的设备或请求者鉴权，再绑定允许的会话及工具字段，拒绝跨会话请求。用两个受控扩展尝试订阅彼此会话、发 prompt 及取消；成功要求对方无事件、控制被拒，自己的流与结束回查仍完整。任一交叉数据或状态不可确认时继续原生入口。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:36-49](https://github.com/EdgeTypE/dsh-better-deepseek/blob/b1043860f5f10fd7ed12664ebe32ca4fd6445aca/lib/index.js#L36-L49)

当前未绑定订阅者。

<details>
<summary>查看原文（14行）</summary>

```text
					if (pathname === "/api/better-deepseek/events") {
						res.writeHead(200, {
							"Content-Type": "text/event-stream",
							"Cache-Control": "no-cache",
							"Connection": "keep-alive"
						});
						res.write(": connected\n\n");
						this.sseClients.add(res);
						req.on("close", () => {
							this.sseClients.delete(res);
						});
						return;
					}
					if (pathname === "/api/better-deepseek/session.result" && req.method === "GET") {
```

</details>

**依据 2 · 源码核查**：[lib/index.js:162-174](https://github.com/EdgeTypE/dsh-better-deepseek/blob/b1043860f5f10fd7ed12664ebe32ca4fd6445aca/lib/index.js#L162-L174)

当前取消按传入会话。

<details>
<summary>查看原文（13行）</summary>

```text
						if (pathname === "/api/better-deepseek/session.cancel") {
							const sessionId = body.payload?.sessionId ?? "";
							const agent = this.ctx.agents.get(sessionId);
							if (agent) {
								agent.cancel("user-request");
								res.writeHead(200, { "Content-Type": "application/json" });
								res.end(JSON.stringify({
									type: "server-response",
									rpcId,
									result: {
										ok: true,
										value: { canceled: true }
									}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:284-291](https://github.com/EdgeTypE/dsh-better-deepseek/blob/b1043860f5f10fd7ed12664ebe32ca4fd6445aca/lib/index.js#L284-L291)

广播路径提供修复对照。

```text
	broadcast(type, payload) {
		const data = `data: ${JSON.stringify({
			type,
			timestamp: Date.now(),
			payload
		})}\n\n`;
		for (const client of this.sseClients) client.write(data);
	}
```

#### 缺口

- 授权与隔离方案未实现。
  **影响**：尚无有效整改验收。
  **进一步探讨**：建立两个身份和会话的正反矩阵，分别读控制结果和 SSE 原文。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
