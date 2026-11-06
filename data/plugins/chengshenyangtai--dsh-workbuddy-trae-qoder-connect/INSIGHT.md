# WorkBuddy + Trae + Qoder Connect

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2b4f433](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/tree/2b4f433f005b4622303b8539c1b2800e3a2fa56d)

<!-- BEGIN META -->
[![GitHub ★ 61](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=61&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect)
<!-- END META -->

> **功能**：聚合 WorkBuddy、Trae CN 和 Qoder CN 模型渠道、凭据状态、额度与签到面板。

> **亮点**：渠道编排、统一状态/偏好、目录/档位和工具协议适配减少分散入口；自主循环继承DSH，上游额度和推理能力不由插件产生。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：停用标记未进入自动/一键签到过滤，违背不参与签到的控制承诺；历史修复和流中断也使统一界面不能证明输入与结果完整。见 [Q02](#research-q02)。

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
  - [Q01 · 多渠道怎样接入真实 Agent 工具循环，统一列表是否代表语义完全一致？](#detail-section-11)
  - [Q02 · 停用、自动签到、流中断和凭据管理有哪些实质边界？](#detail-section-12)
  - [Q03 · 聚合相对单渠道有什么增量，免费与最大窗口的成本如何判断？](#detail-section-13)
  - [Q04 · 当前采用结论是什么，什么生产方向值得验证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有多渠道账号的个人开发者在同一DSH会话选择模型并管理状态。见 [Q01](#research-q01)。

分别维护单渠道插件或原厂客户端；项目本身声明继承dsh-connect，不把全部协议实现当原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 三类provider | DSH选择不同渠道模型 | 仍是独立账号/上游 |
| 工具协议适配 | 支持DSH工具循环 | 真实任务未测 |
| 目录/档位 | 转换上游声明 | 非效果或免费保证 |
| 模型/渠道停用 | 隐藏可选模型 | 签到过滤缺口尚在 |
| 自动/一键签到 | 领取账号活动 | 状态请求可能写操作 |
| 凭据管理 | 多槽位及区域 | 完整解密/登录链未审 |

**流程与依赖**

| 依赖 | 作用 | 必要性 | 条件与边界 |
|---|---|---|---|
| DSH/llm/pi-ai | 模型消费与工具循环 | 必需 | 兼容peer与客户端服务 |
| 三家账号和接口 | 模型/额度 | 按渠道 | 当前活动价格未核 |
| 本地凭据快照 | 登录身份 | 必需 | 导出/解密链未全审 |
| Node/网络 | shim与上游连接 | 必需 | ^22.19或>=24 |


| 阶段 | 操作 | 结果与边界 |
|---|---|---|
| 当前 | 先修停用签到过滤 | 未修不以停用作为阻断 |
| 准备 | 核账号区域、关闭自动签到 | 不把面板状态当纯读 |
| 后续试用 | 单渠道已知只读任务再小改动 | 核真实工具结果与账单 |
| 失败 | 查历史、结果、积分再决定重发 | 中断/DONE非完成 |

**效果与成本**

| 阶段 | 现金 | 人工 | 未知与控制 |
|---|---|---|---|
| 首次 | 账号/套餐未知 | 凭据及版本配置 | 先审后接 |
| 持续 | 积分/token未知 | 私有协议与目录维护 | 免费口号非总成本 |
| 失败恢复 | 重试及探针耗额未知 | 账号、流、工具结果核查 | 不盲重写操作 |
| 退出 | 原服务独立 | 卸载、快照和授权分开清 | 隐藏停用非删除 |


| 结果 | 源码支持 | 未验证 |
|---|---|---|
| 多渠道入口 | 三模块与统一面板 | 用户净收益 |
| 工具适配 | 角色/碎片/finish_reason转换 | 各模型正确率 |
| 历史延续 | 同宿主会话 | 请求语义完全相同 |
| 积分操作 | 真实领取接口扇出 | 停用控制存在缺口；真实账单未测 |

> **思考**：停用标记未进入自动/一键签到过滤，违背不参与签到的控制承诺；历史修复和流中断也使统一界面不能证明输入与结果完整。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：渠道编排、统一状态/偏好、目录/档位和工具协议适配减少分散入口；自主循环继承DSH，上游额度和推理能力不由插件产生。见 [Q01](#research-q01)、[Q03](#research-q03)。

随机Bearer回环shim、工具碎片与角色适配值得参考；停用必须在动作前过滤，状态GET触发领取需显式理解。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

停用标记未进入自动/一键签到过滤，违背不参与签到的控制承诺；历史修复和流中断也使统一界面不能证明输入与结果完整。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察并先修停用过滤/核凭据；后续关闭自动签到，单账号区域与项目副本核已知工具结果，异常回原客户端。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已完成固定源码关键链路核查；未运行登录、导出、签到、模型探针或真实任务。

- 已检查：作者 README、包清单、源码路径 README.md、lib/client.js、lib/index.js、lib/panel.js、lib/providers/qoder/index.js、lib/providers/trae/index.js、lib/providers/workbuddy/index.js、lib/providers/workbuddy/variants-CnrmSn0Q.js、lib/shared/http.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查编排、WorkBuddy注册/真实chat、Qoder消息及工具参数、Trae工具碎片/终止、聚合签到和停用接线。未全审全部登录/解密/刷新、所有模型/图像/目录探针、宿主认证及继承差分；未执行目标。
- 下一步：先假渠道验证disabled零领取调用，再核固定账号区域和凭据，已知工具任务测试切换/中断并记总成本；回执方向另做对照，均未运行。

**分析版本**

- **仓库**：[chengshenyangtai/dsh-workbuddy-trae-qoder-connect](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect)
- **版本号**：0.3.2（[固定提交 2b4f433](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/tree/2b4f433f005b4622303b8539c1b2800e3a2fa56d)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先修停用过滤，再验证有效输入/账号/领取目标回执能否减少误调用与结果误判；无独立改善即推翻。见 [Q04](#research-q04)。

先假渠道验证disabled零领取调用，再核固定账号区域和凭据，已知工具任务测试切换/中断并记总成本；回执方向另做对照，均未运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 978 | — | — | 17766 |
| .js | source | 14 | 20034 | 13006 | 6574 | — |
| .mjs | source | 36 | 8469 | 6037 | 1871 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：识别多渠道模型适配的真实贡献与自动操作控制缺口，避免以免费口号代替生产判断。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多渠道怎样接入真实 Agent 工具循环，统一列表是否代表语义完全一致？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它面向已有 WorkBuddy、Trae 或 Qoder 账号，希望在 DSH 同一会话里选择模型并集中看额度的个人开发者。原办法是维护多个单渠道插件或回原客户端。编排层读渠道注册表，注入隐藏模型和偏好钩子，分别apply三个子模块，再注册聚合面板；不是把三家凭据、协议或服务合成一个上游账户。

各provider经本地回环shim适配。WorkBuddy先等随机端口就绪，再注册ctx.llm adapter；请求验证Host/Origin和随机Bearer，解析真实上游凭据后发对应区域chat请求。Qoder把developer转system，保留tool_calls/tool_call_id，传工具定义和推理档位；Trae把系统消息并入user，传工具schema，归一上游function_call碎片，并把有工具调用的finish_reason改成tool_calls，让宿主能继续执行。工具真正读写和再次决策仍由DSH Agent循环承担，本组件提供模型传输，不是另一个自主执行器。

“同一历史”只表示宿主会话可继续。协议转换会改变角色和可表示内容，WorkBuddy还对坏工具配对删孤儿结果和无回应/空名调用；同一会话切渠道不能保证模型收到逐字相同的有效上下文。具体工具成功率与模型效果未实测，作者所谓端到端实测不算本次独立运行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:136-195](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/index.js#L136-L195)

注册表和三个provider编排。

<details>
<summary>查看原文（60行）</summary>

```text
    if (typeof mod.setExternalHidden !== "function") {
      ctx.logger?.warn?.(`dsh-connect: ${label} 子模块没有 setExternalHidden，禁用模型对它不生效`);
      continue;
    }
    try {
      mod.setExternalHidden(disabledModelsFor);
    } catch (error) {
      ctx.logger?.warn?.(`dsh-connect: ${label} 注入禁用模型钩子失败`, error);
    }
  }

  // —— 0.6) 再注入"面板偏好"读写通道 ——
  // 传给子模块的是 `hubPreferences` **对象本身**（不是它当前的字段值）：
  // 面板的 `write` 要等它自己的 `ctx.inject(["settings"])` 跑完才有值，必须现取。
  // 只有 workbuddy 认这个钩子（国际版的最大上下文窗口偏好）；其余子模块忽略。
  if (typeof workbuddy.setPreferences === "function") {
    try {
      workbuddy.setPreferences(hubPreferences);
    } catch (error) {
      ctx.logger?.warn?.("dsh-connect: 注入面板偏好钩子失败（国际版窗口档位偏好将取默认值）", error);
    }
  }

  // —— 1) 三个渠道的宿主半侧 ——
  // 传空 config：这三个渠道的凭据路径与偏好都不走插件 config（凭据走环境变量/文件，
  // 偏好走面板设置段 + 上面的 hubPreferences 钩子），传 {} 即取各自的内置默认值。
  const handles = new Map();
  for (const [label, mod] of PROVIDERS) {
    if (!registry.channels.some((entry) => entry.kind === label)) continue;
    try {
      if (typeof mod.apply !== "function") throw new Error("子模块没有导出 apply");
      handles.set(label, mod.apply(ctx, {}));
    } catch (error) {
      ctx.logger?.error?.(`dsh-connect: ${label} 渠道加载失败（其余渠道与面板不受影响）`, error);
    }
  }

  /**
   * 面板「更新模型」的渠道调度：
   * · trae    —— 先跑导出脚本重抓桌面端目录，再让 provider 立刻 reload；
   * · 其余    —— 直接强制重取（workbuddy 句柄按渠道实例 id 分派）。
   */
  const refreshChannel = async (channelId) => {
    const entry = registry.channels.find((item) => item.id === channelId);
    if (entry === undefined) return { ok: false, error: `未知渠道 ${channelId}` };
    if (entry.kind === "trae") {
      const exported = await runTraeExport();
      if (!exported.ok) {
        return { ok: false, stage: "export", code: exported.code, output: exported.output, error: exported.error ?? "导出脚本失败" };
      }
      const diff = await handles.get("trae")?.forceRefresh?.();
      return { ok: true, exported: exported.output, ...(diff ?? {}) };
    }
    if (entry.kind === "workbuddy") {
      const diff = await handles.get("workbuddy")?.forceRefresh?.(channelId);
      return { ok: diff !== undefined, ...(diff ?? {}) };
    }
    if (entry.kind === "qoder") {
      const diff = await handles.get("qoder")?.forceRefresh?.();
      return { ok: diff !== undefined, ...(diff ?? {}) };
```

</details>

**依据 2 · 源码核查**：[lib/providers/workbuddy/index.js:2143-2187](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/providers/workbuddy/index.js#L2143-L2187)

shim就绪到adapter注册。

<details>
<summary>查看原文（45行）</summary>

```text
async function startVariant(ctx, runtime) {
	const { variant, store, client, catalog, probeService } = runtime;
	const shim = createWorkBuddyShim({
		store,
		client,
		catalog,
		logger: ctx.logger
	});
	try {
		await shim.ready;
	} catch (error) {
		ctx.logger.error(`dsh-workbuddy-connect: ${variant.displayName} loopback endpoint failed to start`, error);
		return false;
	}
	try {
		const workbuddy = createWorkBuddyAdapter({
			providerId: variant.id,
			displayName: variant.displayName,
			shim,
			store,
			catalog,
			resolveAttachments: () => ctx.get("attachments"),
			observe: (modelId) => probeService.recordFor(modelId),
			hidden: () => {
				const account = runtime.account();
				const own = account === void 0 ? [] : runtime.visibilityStore.disabled(account);
				// [dsh-connect] 并上面板下发的禁用列表（面板的存在对 provider 透明）。
				return [...own, ...externalHidden(runtime.variant.id)];
			}
		});
		runtime.invalidate = () => {
			workbuddy.invalidate();
			ctx.emit("llm/adapters-updated");
		};
		const releaseAdapter = ctx.llm.registerAdapter([variant.id], workbuddy.adapter);
		try {
			ctx.effect(() => () => {
				releaseAdapter();
				shim.close();
			});
		} catch {
			releaseAdapter();
			shim.close();
		}
		runtime.registered = true;
```

</details>

**依据 3 · 源码核查**：[lib/providers/workbuddy/index.js:797-840](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/providers/workbuddy/index.js#L797-L840)

随机回环Bearer与门禁。

<details>
<summary>查看原文（44行）</summary>

```text
function createWorkBuddyShim(options) {
	const { store, client, catalog } = options;
	const logger = options.logger;
	const SHARED_SECRET = randomBytes(32).toString("base64url");
	/** Constant-time bearer check; absent or mismatched bearers are rejected. */
	function bearerOk(req) {
		const header = req.headers.authorization;
		if (typeof header !== "string") return false;
		const match = /^Bearer\s+(.+)$/i.exec(header.trim());
		if (match === null) return false;
		const presented = match[1];
		const expected = SHARED_SECRET;
		const a = Buffer.from(presented);
		const b = Buffer.from(expected);
		if (a.length !== b.length) return false;
		return timingSafeEqual(a, b);
	}
	const server = createServer((req, res) => {
		handle(req, res);
	});
	const ready = new Promise((resolve, reject) => {
		server.once("listening", () => resolve());
		server.once("error", reject);
	});
	server.listen(0, "127.0.0.1");
	const baseUrl = () => {
		const address = server.address();
		if (address === null || typeof address === "string") throw new Error("workbuddy shim has no listening address");
		return `http://127.0.0.1:${address.port}`;
	};
	async function handle(req, res) {
		try {
			if (!hostIsLoopback(req.headers.host)) {
				writeOpenAIError(res, 403, "host_not_allowed", "Host header must name the loopback interface");
				return;
			}
			if (!originIsLoopback(req.headers.origin)) {
				writeOpenAIError(res, 403, "origin_not_allowed", "Origin must be a loopback origin");
				return;
			}
			if (!bearerOk(req)) {
				writeOpenAIError(res, 401, "unauthorized", "missing or invalid Authorization bearer");
				return;
			}
```

</details>

**依据 4 · 源码核查**：[lib/providers/workbuddy/variants-CnrmSn0Q.js:1119-1157](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/providers/workbuddy/variants-CnrmSn0Q.js#L1119-L1157)

区域真实上游chat请求。

<details>
<summary>查看原文（39行）</summary>

```text
	async chatStream(credential, bodyJson, signal) {
		const region = regionOf(credential.domain);
		let identity;
		try {
			identity = await this.resolveChatIdentity(region);
		} catch {
			identity = fallbackChatIdentity(region);
		}
		const userAgent = chatUserAgent(identity, region);
		let response;
		try {
			response = await fetch(`${chatBase(credential)}/v2/chat/completions`, {
				method: "POST",
				headers: {
					...chatHeaders(credential, userAgent, identity.clientVersion),
					"Authorization": `Bearer ${credential.accessToken}`
				},
				body: region === "global" ? prepareInternationalChatBody(bodyJson) : bodyJson,
				...signal === void 0 ? {} : { signal }
			});
		} catch (error) {
			return {
				ok: false,
				status: 0,
				kind: "server",
				message: `transport error: ${String(error)}`
			};
		}
		if (response.ok) return {
			ok: true,
			response
		};
		const text = (await response.text()).slice(0, ERROR_BODY_LIMIT);
		return {
			ok: false,
			status: response.status,
			kind: classifyUpstreamError(response.status, text),
			message: text
		};
```

</details>

**依据 5 · 源码核查**：[lib/providers/qoder/index.js:1842-1876](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/providers/qoder/index.js#L1842-L1876)

角色与工具历史转换。

<details>
<summary>查看原文（35行）</summary>

```text
    if (message === null || typeof message !== "object") continue;
    let role = typeof message.role === "string" ? message.role : "user";
    /**
     * `developer` → `system`。
     *
     * OpenAI 新惯例把系统提示的角色拼写从 `system` 改成 `developer`，pi-ai 对
     * **声明了 reasoning 的模型**会用新拼写发来（旧实现全部 `reasoning:false`，
     * 走老路径，所以此前从没见过这个角色）。Qoder 上游只认
     * `system/assistant/user/tool/function`，收到 `developer` 直接 400：
     *   "developer is not one of ['system', 'assistant', 'user', 'tool', 'function']"
     * 两者语义等同（都是系统指令），归一化即可，不丢内容。
     */
    if (role === "developer") role = "system";
    /** @type {Record<string, unknown>} */
    const next = { role };
    if (typeof message.content === "string") {
      next.content = message.content;
    } else if (Array.isArray(message.content)) {
      next.content = message.content
        .map((part) => {
          if (part?.type === "text" && typeof part.text === "string") return { type: "text", text: part.text };
          if (part?.type === "image_url" && part.image_url?.url) return { type: "image_url", image_url: { url: part.image_url.url } };
          return undefined;
        })
        .filter((part) => part !== undefined);
    } else {
      next.content = "";
    }
    if (Array.isArray(message.tool_calls) && message.tool_calls.length > 0) next.tool_calls = message.tool_calls;
    if (typeof message.tool_call_id === "string") next.tool_call_id = message.tool_call_id;
    if (typeof message.name === "string") next.name = message.name;
    out.push(next);
  }
  if (out.length === 0) out.push({ role: "user", content: "" });
  return out;
```

</details>

**依据 6 · 源码核查**：[lib/providers/qoder/index.js:2008-2032](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/providers/qoder/index.js#L2008-L2032)

工具定义和档位进入真实调用。

<details>
<summary>查看原文（25行）</summary>

```text
    let result;
    try {
      result = await client.chatStream({
        model: decoded.model,
        messages: toQoderMessages(request.messages),
        tools: toQoderTools(request.tools),
        toolChoice: request.tool_choice,
        isReasoning,
        /**
         * 用户选的思考档位。pi-ai 依据模型的 `thinkingLevelMap` 把 UI 档位映射成
         * 线上拼写，放在请求体的 `reasoning_effort` 里发到 shim —— 这里读出来
         * 透传给上游（WorkBuddy 那条渠道也是同一机制）。
         */
        reasoningEffort: typeof request.reasoning_effort === "string" ? request.reasoning_effort : undefined,
        /**
         * 该模型**确实支持**的档位（声明 ∪ 探查），供 `buildChatBody` 决定
         * 非法输入该回退到哪一档。传进来而不是让 buildChatBody 自己去查，
         * 是为了保持它是个纯函数（它不知道 catalog / probe）。
         */
        supportedEfforts: supportedEffortsOf(entry, probed ? probe?.service?.cached(decoded.model) : undefined),
        // 目录默认档（thinking_config 里 is_default 的那档）：未选档时的回退目标。
        defaultEffort: entry?.defaultEffort,
        maxTokens: request.max_tokens ?? request.max_completion_tokens,
        temperature: request.temperature,
      }, controller.signal);
```

</details>

**依据 7 · 源码核查**：[lib/providers/trae/index.js:2010-2034](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/providers/trae/index.js#L2010-L2034)

Trae系统/工具转换实际接线。

<details>
<summary>查看原文（25行）</summary>

```text
      function: decoded.functionName,
      /**
       * system 并入首条 user：Trae 的 function 自带系统提示，直接传 system 角色
       * 不保证被接受。原先这是可配置开关（`inlineSystemPrompt`），2026-10-08
       * 收口后恒为 true —— 见本文件「配置」段的收口说明。
       */
      messages: toTraeMessages(request.messages, true),
      maxTokens: request.max_tokens,
      effort,
      maxMode,
      promptMaxTokens,
      /**
       * 工具定义必须一路带到上游，否则模型看不到有工具可用 ——
       * 这正是「Trae 下工具调用漏成文本 / 回合空转」的根因。
       * 转换与上游契约（`parameters` 必须是 JSON 字符串）见 `toTraeTools`。
       *
       * （2026-10-08 收口）原先这里的 `settings.toolsEnabled ? … : undefined`
       * 是一个**不可达的分支**：开关的配置通道已关闭（见本文件「配置」段注释），
       * `toolsEnabled` 恒为 true，所以条件恒真 —— 现在直接表达恒定行为。
       * 这也顺带修正了一个误导：README/注释曾把它当成"退回纯聊天"的逃生阀，
       * 实际那个阀门从来拧不动。
       */
      tools: toTraeTools(request.tools),
      toolChoice: request.tool_choice,
    }, controller.signal);
```

</details>

**依据 8 · 源码核查**：[lib/providers/trae/index.js:1292-1312](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/providers/trae/index.js#L1292-L1312)

工具碎片保留index/id及function。

<details>
<summary>查看原文（21行）</summary>

```text
    const normalizeToolCalls = (raw) => {
      const out = [];
      for (const tc of raw) {
        if (tc === null || typeof tc !== "object") continue;
        const fc = tc.function_call ?? tc.function ?? {};
        /**
         * `index` 必须保留 0 兜底（与 OpenAI 首片一致）。
         *
         * ⚠️ 不要改成"缺失就不下发"（2026-10-08 试过，被
         * `verify-trae-tool-calling` 的端到端断言当场抓住）：上游的参数分片靠
         * `index` 标识自己属于哪一次调用，缺了它下游无法累积参数，拼接后直接是
         * 非法 JSON（`Unexpected end of JSON input`）。
         *
         * 这里的 `?? 0` 与上游实测形状一致：一次调用的所有分片（首片 + 4 个参数片）
         * `index` 全是 0，多个并行调用才递增。真实风险是"两次调用都缺 index 而
         * 撞在 0 上"，但按上游契约并行调用一定带 index，所以维持兜底更安全。
         */
        const entry = { index: Number.isInteger(tc.index) ? tc.index : 0 };
        if (typeof tc.id === "string" && tc.id !== "") entry.id = tc.id;
        if (typeof tc.type === "string" && tc.type !== "") entry.type = tc.type;
        const fn = {};
```

</details>

**依据 9 · 源码核查**：[lib/providers/trae/index.js:1380-1409](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/providers/trae/index.js#L1380-L1409)

工具流和finish_reason转换。

<details>
<summary>查看原文（30行）</summary>

```text
             * 工具调用：上游给的是 `function_call` 形状且分片下发，必须先归一
             * （原样透传下游认不出，等于整轮工具调用被丢弃）。
             */
            if (Array.isArray(data.tool_calls) && data.tool_calls.length > 0) {
              const calls = normalizeToolCalls(data.tool_calls);
              if (calls.length > 0) {
                sawToolCall = true;
                enqueue(chunk({ tool_calls: calls }));
              }
            }
            return;
          }
          if (event.event === "token_usage") { usage = event.data ?? {}; return; }
          if (event.event === "error") {
            const message = explainTraeError(event.data?.message, allowedFunctions);
            lastErrorHint = message;
            enqueue(chunk({ content: `\n\n[Trae 错误] ${message}` }));
            return;
          }
          if (event.event === "done") {
            finished = true;
            /**
             * 上游有工具调用时**也**报 `finish_reason:"stop"`（实测），
             * 但 OpenAI 语义里必须报 `tool_calls` —— 下游据此决定要不要执行工具。
             * 不改写的话，pi-ai 会把这一轮当成"普通回答结束"，工具永远不会被执行。
             */
            const upstreamReason = event.data?.finish_reason;
            const finishReason = sawToolCall ? "tool_calls" : (upstreamReason ?? "stop");
            enqueue(chunk({}, finishReason));
            enqueue(encoder.encode("data: [DONE]\n\n"));
```

</details>

**依据 10 · 源码核查**：[lib/providers/workbuddy/index.js:614-683](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/providers/workbuddy/index.js#L614-L683)

坏配对修复会删除部分历史。

<details>
<summary>查看原文（70行）</summary>

```text
function repairToolPairing(raw, logger) {
	let body;
	try {
		body = JSON.parse(raw);
	} catch {
		return raw;
	}
	if (typeof body !== "object" || body === null || Array.isArray(body)) return raw;
	const messages = body.messages;
	if (!Array.isArray(messages)) return raw;

	/** assistant 消息按顺序展开的全部调用 id（同一 id 可能多次出现，全部登记）。 */
	const callIds = new Set();
	/** 函数名缺失/为空的调用 id —— 规则 4 的清理对象（见函数头注释的实测证据）。 */
	const degenerateIds = new Set();
	for (const m of messages) {
		if (m === null || typeof m !== "object" || Array.isArray(m)) continue;
		const calls = m.tool_calls;
		if (!Array.isArray(calls)) continue;
		for (const c of calls) {
			if (c === null || typeof c !== "object") continue;
			if (typeof c.id === "string" && c.id !== "") callIds.add(c.id);
			/**
			 * **缺 name 键与空串同样算退化**：下游（pi-ai）建工具调用块时以 name 为准，
			 * 没有名字的调用最终就是"未知工具"，与空串的结果完全一样。OpenAI 流式
			 * 契约里首片必定带 name，所以"有 id 但无 name"只可能是首片丢失后的残片。
			 */
			const fn = c.function;
			const name = fn !== null && typeof fn === "object" ? fn.name : c.name;
			if ((typeof name !== "string" || name.trim() === "") && typeof c.id === "string" && c.id !== "") degenerateIds.add(c.id);
		}
	}

	let orphanResults = 0;
	let danglingCalls = 0;
	let degenerateResults = 0;
	const repaired = [];
	for (const m of messages) {
		if (m === null || typeof m !== "object" || Array.isArray(m)) {
			repaired.push(m);
			continue;
		}
		if (m.role === "tool") {
			const id = m.tool_call_id;
			// 规则 1：孤儿结果 → 丢弃
			if (typeof id === "string" && id !== "" && !callIds.has(id)) {
				orphanResults++;
				continue;
			}
			// 规则 4 的配套结果：调用都要删了，结果留着只会变成孤儿 → 一起丢弃
			if (typeof id === "string" && degenerateIds.has(id)) {
				degenerateResults++;
				continue;
			}
			repaired.push(m);
			continue;
		}
		if (m.role === "assistant" && Array.isArray(m.tool_calls)) {
			// 规则 2：没有结果回应的调用 → 删掉；规则 4：函数名为空的调用 → 删掉
			const kept = m.tool_calls.filter((c) => {
				if (c === null || typeof c !== "object") return false;
				if (typeof c.id !== "string" || c.id === "") return false;
				if (degenerateIds.has(c.id)) return false;
				return messages.some((x) => x !== null && typeof x === "object" && x.role === "tool" && x.tool_call_id === c.id);
			});
			if (kept.length !== m.tool_calls.length) danglingCalls += m.tool_calls.length - kept.length;
			if (kept.length === 0) {
				/**
				 * 删空后**不能**留下「无正文 + 无 tool_calls」的 assistant 消息：
				 * pi-ai 自己转换时会跳过这种消息（源码注释写明「有的上游要求
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 停用、自动签到、流中断和凭据管理有哪些实质边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

有一处源码可确定的控制缺口：设置描述“停用渠道不参与签到”，但hubChannels只附加disabled标记而不排除；probeAll逐条调用probeChannel，自动领取条件只有autoCheckin、渠道类型允许和signedIn，没有检查disabled。claimAll也逐条claimOne且不检查该标记。status把disabled装饰放在探测之后，签到动作已可能发出。于是仅停用模型渠道不能可靠实现“不参与签到”；这不是已执行领取的报告，但接线与承诺不一致足以阻止按该控制采用。

默认autoCheckin=true。客户端角标、弹窗和设置共用useHubStatus，都会带auto=1；Host的GET status可继续扇出POST领取，未打开完整面板也可能触发。它不是纯读额度视图。关闭全局自动签到可阻断这一自动条件，但手工一键/单渠道接口仍应核对目标；本次不依赖上游重复领取的幂等声明推断没有其他副作用。隐藏与停用也不同：隐藏只影响面板显示，一键签到includeHidden。

取消沿客户端断开abort上游；已生成内容或已执行工具不能回滚。Trae上游转换中断会追加明确错误与error终止，但外层Readable错误仍可只补DONE；WorkBuddy外层同样在流错时仅补DONE，不能据结束符认定完整回答。回环shim的随机Bearer比仅Host/Origin多一道门禁，面板管理路由只用loopbackRequest；缺Origin放行是本地服务取舍，不能据此宣称多人隔离。凭据导出、扫码、解密和桌面跟随是额外授权面，本次未完整审计，不能把“0600/不回显”当全路径保密证明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/panel.js:221-233](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/panel.js#L221-L233)

停用只附标记。

<details>
<summary>查看原文（13行）</summary>

```text
export function hubChannels(options = {}) {
  const prefs = livePrefs();
  const hidden = new Set(prefs.hiddenChannels);
  const disabled = new Set(prefs.disabledChannels);
  return registryChannels().filter(
    // `hiddenChannels` 只影响"面板列表里显不显示"，**不影响它参不参与** ——
    // 所以签到与单渠道路由（includeHidden）必须把它算进来，否则被隐藏的渠道
    // 会悄悄漏掉每日签到（用户只是不想看见它，不是不想签）。
    (channel) => slotConfigured(channel.id) && (options.includeHidden === true || !hidden.has(channel.id)),
  ).map((channel) => ({
    ...channel,
    disabled: disabled.has(channel.id),
  }));
```

</details>

**依据 2 · 源码核查**：[lib/panel.js:687-721](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/panel.js#L687-L721)

自动领取及无disabled检查。

<details>
<summary>查看原文（35行）</summary>

```text
/** 扇出一条渠道：拉状态（workbuddy 还要额外探一次签到看板）。 */
export async function probeChannel(channel, options = {}) {
  const base = options.base ?? loopbackBaseFallback();
  let raw;
  try {
    raw = await fetchRoute(channel.statusPath, { base });
  } catch (error) {
    return normalizeChannel(channel, undefined, undefined, error);
  }
  const adapter = KIND_ADAPTERS[channel.kind] ?? KIND_ADAPTERS.workbuddy;
  let checkinDoc;
  const signedIn = raw !== undefined && raw.status === "signed-in";
  if (options.autoCheckin === true && adapter.autoClaim === true && signedIn) {
    // 自动签到：POST 领取（幂等）。这一趟同时把"今天签没签"带回来。
    try {
      checkinDoc = { claim: await fetchRoute(channel.checkinPath, { method: "POST", timeoutMs: 25000, base }) };
    } catch (error) {
      checkinDoc = { claim: { state: "failed", message: briefMessage(error) } };
    }
  } else if (adapter.probeCheckin === true && signedIn) {
    try {
      checkinDoc = await fetchRoute(channel.checkinPath, { base });
    } catch {
      /* 签到看板拿不到不影响这一行；checkin 会退化成 unknown */
    }
  }
  return normalizeChannel(channel, raw, checkinDoc);
}

/** 扇出所有渠道（并发，互不影响）。 */
export async function probeAll(channels = registryChannels(), options = {}) {
  const results = await Promise.all(channels.map((channel) => probeChannel(channel, options)));
  return results;
}

```

</details>

**依据 3 · 源码核查**：[lib/panel.js:763-794](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/panel.js#L763-L794)

默认自动领取及停用承诺。

<details>
<summary>查看原文（32行）</summary>

```text
  autoCheckin: z.boolean().default(true).description("打开面板时自动领取各渠道的每日签到（幂等；同时也是 workbuddy 签到状态的唯一可靠来源）").volatile(),
  showDockButton: z.boolean().default(true).description("在左侧栏显示渠道中心入口（关掉后只能从设置页打开面板）").volatile(),
  hiddenChannels: z.array(z.string()).default([]).description("在面板里隐藏的渠道 id").volatile(),
  /**
   * 被**禁用**的渠道 id。
   *
   * 与 `hiddenChannels` 是两件事，别混：
   *   - `hiddenChannels` —— 面板列表里不显示，但模型照常可用（少看一眼而已）；
   *   - `disabledChannels` —— 该渠道所有模型对模型选择器**不可见**，也不参与一键签到。
   *     凭据保留，随时可启用回来。
   *
   * 实现复用既有的 `setExternalHidden` 钩子（与"禁用单个模型"同一条路），
   * 所以**运行时即刻生效，不需要重启**。
   */
  disabledChannels: z.array(z.string()).default([]).description("禁用的渠道 id（其模型不可见、不参与签到；凭据保留）").volatile(),
  disabledModels: z.array(z.string()).default([]).description("禁用的模型，条目形如 <provider id>/<模型 id>").volatile(),
  /**
   * 国际版（WorkBuddy AI）模型是否使用上游声明的**最大**上下文窗口。
   *
   * 上游对同一个模型会同时声明多档窗口（实测 `deepseek-v4.1-flash` 是
   * 300K / 1M），而适配器只广告一档。默认取最大 —— 这是用户在国际版客户端里
   * 本来就能开的能力，没有理由在 DSH 里把它砍成 300K。关掉即回到上游的默认档。
   *
   * ⚠️ 这条偏好**必须**挂在这里（面板/插件自己的 `Config`），不能挂在
   * workbuddy 子模块那份 `Config` 上：宿主只投影**插件条目**的 `Config`
   * （= 本 schema），子模块的 schema 没有任何人会读（详见 lib/index.js 的
   * `export const Config` 与 providers/workbuddy/index.js 的 setPreferences）。
   */
  useMaximumContextWindow: z.boolean().default(true).description("国际版模型使用上游声明的最大上下文窗口（如 deepseek-v4.1-flash 的 1M）").volatile(),
});

export const HUB_DEFAULTS = { autoCheckin: true, showDockButton: true, hiddenChannels: [], disabledChannels: [], disabledModels: [], useMaximumContextWindow: true };
```

</details>

**依据 4 · 源码核查**：[lib/panel.js:1002-1037](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/panel.js#L1002-L1037)

GET状态扇出领取后才装饰disabled。

<details>
<summary>查看原文（36行）</summary>

```text
      HUB_STATUS_ROUTE,
      async (req, res) => {
        if (!loopbackRequest(req)) return writeJson(res, 403, { error: "request-not-trusted" });
        if (req.method !== "GET") return writeJson(res, 405, { error: "method not allowed" });
        const prefsNow = deps.prefs();
        /**
         * 自动签到的门控 = 「偏好开着」**且**「请求带 `?auto=1`」。
         *
         * WorkBuddy 的「今天签没签」**没有只读来源**：签到看板
         * （`/v2/billing/meter/checkin-status`）在活动未开放时整份是默认值，当天
         * 已签过也一样；唯一可靠来源是幂等的 `daily-checkin`。所以客户端三个调用点
         * （角标、弹窗、设置页卡片）**一律带 `auto=1`**（见 `client.js` 的
         * `useHubStatus`），角标与面板同源，显示才不会互相矛盾。
         */
        const auto = prefsNow.autoCheckin === true && String(req.url ?? "").includes("auto=1");
        const disabledChannels = new Set(prefsNow.disabledChannels);
        const rows = hideAll(await probeAll(hubChannels(), { autoCheckin: auto, base: fanoutBaseOf(req) }), prefsNow.hiddenChannels)
          .map((row) => decorateModels(row, prefsNow.disabledModels))
          // 被禁用的渠道照常返回，只多一个标记 —— 面板据此把它画成灰色并给"启用"入口。
          // 它的模型此时已经全在 disabledModels 里，所以模型选择器里也不会出现。
          .map((row) => (disabledChannels.has(row.id) ? { ...row, disabled: true } : row));
        writeJson(res, 200, {
          channels: rows,
          summary: summarize(rows),
          preferences: deps.prefs(),
          fetchedAt: Date.now(),
        });
      },
    ],
    [
      HUB_CHECKIN_ROUTE,
      async (req, res) => {
        if (!loopbackRequest(req)) return writeJson(res, 403, { error: "request-not-trusted" });
        if (req.method !== "POST" && req.method !== "GET") return writeJson(res, 405, { error: "method not allowed" });
        const results = await claimAll(deps.channels(), { base: fanoutBaseOf(req) });
        writeJson(res, 200, { results, summary: summarizeClaims(results) });
```

</details>

**依据 5 · 源码核查**：[lib/panel.js:1627-1641](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/panel.js#L1627-L1641)

一键领取无停用过滤。

<details>
<summary>查看原文（15行）</summary>

```text
export async function claimOne(channel, options = {}) {
  const base = options.base ?? loopbackBaseFallback();
  try {
    const payload = await fetchRoute(channel.checkinPath, { method: "POST", timeoutMs: 25000, base });
    return normalizeClaim(channel, payload);
  } catch (error) {
    return normalizeClaim(channel, undefined, error);
  }
}

/** 并发签掉所有渠道（部分失败不影响其他）。 */
export async function claimAll(channels = hubChannels(), options = {}) {
  const base = options.base ?? loopbackBaseFallback();
  return Promise.all(channels.map((channel) => claimOne(channel, { base })));
}
```

</details>

**依据 6 · 源码核查**：[lib/panel.js:1710-1720](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/panel.js#L1710-L1720)

手工领取包含隐藏渠道。

<details>
<summary>查看原文（11行）</summary>

```text
  livePrefs = () => resolvePrefs(source());

  const deps = {
    prefs,
    /**
     * 用于签到与单渠道路由注册：**已配置**的槽位（空槽位不参与），
     * 但**包含被隐藏的渠道** —— 隐藏只是"面板里不显示"。
     * `/status` 自己会用 `hideAll` 再滤一次，所以两处口径不冲突。
     */
    channels: () => hubChannels({ includeHidden: true }),
    settingsApi: () => settingsApi,
```

</details>

**依据 7 · 源码核查**：[lib/client.js:2944-2962](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/client.js#L2944-L2962)

角标和面板共用auto请求。

<details>
<summary>查看原文（19行）</summary>

```text
						 * 两条路同源之后两种偏好下都自洽：
						 * - `autoCheckin` 开着（默认）：都自动签、都拿真实状态 ⇒ 角标 = 面板；
						 * - 关掉：都不签、都显示提示性的「可签」⇒ 也一致。
						 *
						 * `live` 只再控制**轮询节奏**（面板开着才定时刷新），不再影响是否自动签到。
						 */
						const response = await fetch(`${STATUS_PATH}?auto=1`, {
							credentials: "same-origin",
							headers: { accept: "application/json" },
							signal: controller.signal,
						});
						if (!response.ok) return;
						const value = await response.json().catch(() => undefined);
						if (alive && !controller.signal.aborted && isStatusDocument(value)) {
							setStatus(value);
							setLoadedAt(Date.now());
						}
					} catch {
						/* 只读装饰：失败静默，绝不影响输入框 */
```

</details>

**依据 8 · 源码核查**：[lib/providers/trae/index.js:1957-1960](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/providers/trae/index.js#L1957-L1960)

断线Abort接线。

```text
    const settings = options.settings();
    const decoded = decodeModelId(request.model, settings.function, settings.functions);
    const controller = new AbortController();
    abortOnClientDisconnect(res, controller);
```

**依据 9 · 源码核查**：[lib/providers/trae/index.js:1450-1474](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/providers/trae/index.js#L1450-L1474)

内层中断显式错误。

<details>
<summary>查看原文（25行）</summary>

```text
             * 上游中途断流（2026-10-08 修）。
             *
             * 修之前这里只补一个 `[DONE]`，**既不给 finish_reason 也不给任何
             * 正文**。下游只看到一个毫无来由的流结束，于是表现为「模型说了一半
             * 就断了、没有任何提示」—— 用户看到的是无声消失，而不是可诊断的
             * 错误。这不是"上游抖了一下"，而是失败被吞掉了。
             *
             * 现在补齐三样东西，让失败**可见**：
             *   1. 一条明确的错误正文（说明是上游断流，不是模型没话说）；
             *   2. `finish_reason: "error"`（OpenAI 没有这个值，但下游只看
             *      非 null 就知道这轮不正常，比静默收尾好；DSH 会把它标成失败）；
             *   3. `[DONE]` 收尾，保证流不会挂住。
             *
             * 注意：此时**已下发的内容不回滚** —— 用户仍能看到模型说到的那部分，
             * 再加一句明确说明为什么停在这里。
             */
            logger?.warn("dsh-trae-connect: upstream stream failed mid-flight", error);
            if (!finished) {
              finished = true;
              const reason = error instanceof Error && error.message !== "" ? error.message : String(error);
              enqueue(chunk({ content: `\n\n[Trae 上游中断] 本轮回答未完成：${reason.slice(0, 200)}。可重试一次。` }));
              enqueue(chunk({}, "error"));
              enqueue(encoder.encode("data: [DONE]\n\n"));
            }
            closeStream();
```

</details>

**依据 10 · 源码核查**：[lib/providers/workbuddy/index.js:921-930](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/providers/workbuddy/index.js#L921-L930)

外层流错误只补DONE。

<details>
<summary>查看原文（10行）</summary>

```text
		let sawDone = false;
		const body = Readable.fromWeb(result.response.body);
		body.on("data", (chunk) => {
			if (chunk.includes("[DONE]")) sawDone = true;
		});
		body.on("error", (error) => {
			logger?.warn("dsh-workbuddy-connect: upstream stream failed mid-flight", error);
			if (!sawDone && res.writable) res.end("data: [DONE]\n\n");
		});
		body.pipe(res);
```

</details>

**依据 11 · 源码核查**：[lib/shared/http.js:20-66](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/shared/http.js#L20-L66)

回环门禁及缺Origin策略。

<details>
<summary>查看原文（47行）</summary>

```text
/** 回环主机名白名单（IPv6 两种写法都收）。 */
export const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost", "[::1]", "::1"]);

/**
 * Host 头里的主机名：去端口、去大小写、IPv6 方括号保留。
 *
 * `[::1]:3088` → `[::1]`；`127.0.0.1:3088` → `127.0.0.1`；
 * `localhost:abc` → 原样（端口必须是纯数字才剥，否则不猜）。
 */
export function hostnameOfHost(host) {
  const text = String(host ?? "").trim().toLowerCase();
  if (text === "") return "";
  if (text.startsWith("[")) {
    const end = text.indexOf("]");
    return end === -1 ? text : text.slice(0, end + 1);
  }
  const colon = text.lastIndexOf(":");
  if (colon === -1) return text;
  // 冒号前还有冒号 = 无方括号的 IPv6，别把最后一段当端口剥掉。
  if (text.slice(0, colon).includes(":")) return text;
  return /^\d+$/.test(text.slice(colon + 1)) ? text.slice(0, colon) : text;
}

/** Host 头是不是回环地址。空/缺失一律 false。 */
export function hostIsLoopback(host) {
  if (host === undefined || host === null || String(host).trim() === "") return false;
  return LOOPBACK_HOSTS.has(hostnameOfHost(host));
}

/**
 * Origin 是回环吗。
 *
 * **缺失即放行**：宿主进程内的 fetch 不带 Origin，而浏览器页面一定带 ——
 * 所以这条规则挡住的是 DNS rebinding/第三方页面，不影响自己人。
 */
export function originIsLoopback(origin) {
  if (origin === undefined || origin === null || String(origin).trim() === "") return true;
  try {
    const { hostname } = new URL(String(origin));
    return LOOPBACK_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

/** 两条一起判：这是"可以信任的本地调用"吗。所有 /plugins/* 路由都用它。 */
export function loopbackRequest(req) {
```

</details>

#### 缺口

- 未复现签到调用、实际工具取消或完整登录/解密链，也未审宿主外围认证。
  **影响**：不能确认真实账号副作用和安全范围，不建议直接接生产凭据。
  **进一步探讨**：先用无网络假渠道记录停用时调用计数，修复过滤；再固定账号/桌面版本核凭据及取消。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 聚合相对单渠道有什么增量，免费与最大窗口的成本如何判断？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

项目声明基于dsh-connect，实际增量是统一渠道注册、面板偏好和模型隐藏、目录刷新、各协议/档位适配以及账号区域管理。它仍注册不同provider id，不是智能挑最便宜且自动验收的路由器。额度、模型倍率、上下文窗口与活动来自上游目录/账号；目录存在或宣称最大窗口不能证明在该任务下可用。README的限时免费及模型名称是固定版本作者描述，本研究没有核验当前活动或价格，不把它们用于省费结论。

要求兼容DSH/llm/pi-ai/客户端服务、Node ^22.19或>=24，外加三家合法可用账号与各自网络接口。Trae刷新先执行本地凭据/目录导出再reload；WorkBuddy区域和桌面跟随/自有副本改变真实凭据来源，新增槽位拓扑在启动时载入。界面偏好热更新不等于所有渠道拓扑热生效。此处不需要再实现模型推理，却需要持续维护私有协议、目录、上游头字段和客户端存储变化。

首次成本是账号与凭据准备、插件配置和已知工具任务校验；持续有积分/token、可能的套餐、联网及维护人工，实测档位探针也消耗额度。失败时需区分目录陈旧、区域/账号错误、流中断和工具历史修复；响应不明先核真实工具结果，避免重发写工具。退出要分开卸载插件、停止shim及清理快照/授权，停用/隐藏不等于删除凭据。没有总费用、成功任务和人工修复对照，不报告单位结果成本或“免费可生产”。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-16](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/README.md#L1-L16)

作者免费定位及聚合主张。

<details>
<summary>查看原文（16行）</summary>

```text
# dsh-workbuddy-trae-qoder-connect

![三家免费额度，一个模型下拉](assets/social-preview.png)

**WorkBuddy（国区版 + 国际版）、Qoder CN、Trae CN 的免费额度都能在这里用起来。这一个插件把三家接进 DeepSeek Harness：一个模型下拉、一份对话历史，打开面板顺手把能领的积分领掉。国际版另有限时免费模型（`deepseek-v4.1-flash` 当前 `x0.00`）。**

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **English** — WorkBuddy (China and international), Qoder CN and Trae CN all hand out free quota. This one DSH plugin pools all three into a single model picker with one shared conversation history, and claims the day's check-in for you when the panel opens. The international edition has no check-in campaign but does carry limited-time free models (`deepseek-v4.1-flash` at `x0.00`). Switch channels mid-conversation without losing context, with live credit multipliers, per-model reasoning effort and image input.
---

## 它解决什么

三家的额度散在三个客户端里。想都在 DSH 里用起来，就得装三个插件、开三个面板、维护三套凭据——而且每换一个渠道，对话历史就断一次。同类插件都是单渠道的，这个"散"一直没人收。

| | 三个单渠道插件 | **本插件** |
```

</details>

**依据 2 · 源码核查**：[lib/index.js:177-226](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/index.js#L177-L226)

子模块载入和Trae更新导出。

<details>
<summary>查看原文（50行）</summary>

```text
   */
  const refreshChannel = async (channelId) => {
    const entry = registry.channels.find((item) => item.id === channelId);
    if (entry === undefined) return { ok: false, error: `未知渠道 ${channelId}` };
    if (entry.kind === "trae") {
      const exported = await runTraeExport();
      if (!exported.ok) {
        return { ok: false, stage: "export", code: exported.code, output: exported.output, error: exported.error ?? "导出脚本失败" };
      }
      const diff = await handles.get("trae")?.forceRefresh?.();
      return { ok: true, exported: exported.output, ...(diff ?? {}) };
    }
    if (entry.kind === "workbuddy") {
      const diff = await handles.get("workbuddy")?.forceRefresh?.(channelId);
      return { ok: diff !== undefined, ...(diff ?? {}) };
    }
    if (entry.kind === "qoder") {
      const diff = await handles.get("qoder")?.forceRefresh?.();
      return { ok: diff !== undefined, ...(diff ?? {}) };
    }
    return { ok: false, error: `渠道类型 ${entry.kind} 暂不支持更新` };
  };

  // —— 2) 面板与聚合（渠道表 / 状态归一化 / 一键签到 / 偏好 / 禁用模型）——
  try {
    registerPanel(ctx, {
      // 先摊开 profile 里的配置，再压上我们自己的回调（避免被 config 里的同名键盖掉）。
      //
      // ⚠️ 这个展开是**有意为之且必须保留**：`config` 里标了 `.volatile()` 的字段是
      // **引用对象**（不是快照），展开后仍是同一个引用 —— panel.js 靠 `config.<字段>.get()`
      // 现读现值，从而免疫"写入 → profile patch 变更 → 本插件热重载"的窗口。
      // 千万不要改成 `structuredClone`/`JSON.parse(JSON.stringify(...))` 之类，
      // 那会把引用拍平成快照，偏好就会变成"改了不生效 / 重载后回退"。
      ...(config ?? {}),
      // 模型列表变了要让宿主重新问各 provider 要列表，否则模型选择器里还是旧的。
      // 与 workbuddy 改可见性时的做法一致：发一次 adapters-updated。
      onModelsChanged: () => {
        try {
          ctx.emit("llm/adapters-updated");
        } catch (error) {
          ctx.logger?.warn?.("dsh-connect: 广播模型列表更新失败（重启后生效）", error);
        }
      },
      // 面板「更新模型」：按渠道重抓目录（trae 先跑导出脚本），返回前后差异。
      refreshChannel,
    });
  } catch (error) {
    ctx.logger?.warn?.("dsh-connect: 面板加载失败（各渠道不受影响）", error);
  }
}
```

</details>

**依据 3 · 源码核查**：[package.json:1-32](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/package.json#L1-L32)

版本与Node范围。

<details>
<summary>查看原文（32行）</summary>

```text
{
  "name": "dsh-workbuddy-trae-qoder-connect",
  "displayName": "WorkBuddy + Trae + Qoder Connect",
  "description": "一个插件接入全部渠道模型：WorkBuddy（含企业版，多账号注册表）/ Trae / Qoder CN。支持渠道添加、改名、删除、凭据管理、统一状态面板与一键签到。",
  "version": "0.3.2",
  "author": {
    "name": "chengshenyangtai",
    "url": "https://github.com/chengshenyangtai"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect.git"
  },
  "homepage": "https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect#readme",
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
    "deepseek",
    "model-provider",
    "workbuddy",
    "trae",
    "trae-cn",
    "qoder",
    "qoder-cn",
    "connect",
    "aggregate"
  ],
  "type": "module",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "main": "lib/index.js",
```

</details>

**依据 4 · 源码核查**：[package.json:65-84](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/package.json#L65-L84)

运行服务依赖。

<details>
<summary>查看原文（20行）</summary>

```text
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-atomic-write": "^0.1.5-rc.1 || ^0.1.6-alpha.1 || ^0.1.7-alpha.1 || ^0.2.0-rc.2",
    "@deepseek-ai/dsh-attachment": "^0.1.5-rc.1 || ^0.1.6-alpha.1 || ^0.1.7-alpha.1 || ^0.2.0-rc.2",
    "@deepseek-ai/dsh-home-paths": "^0.1.5-rc.1 || ^0.1.6-alpha.1 || ^0.1.7-alpha.1 || ^0.2.0-rc.2",
    "@deepseek-ai/dsh-host-webserver": "^0.1.5-rc.1 || ^0.1.6-alpha.1 || ^0.1.7-alpha.1 || ^0.2.0-rc.2",
    "@deepseek-ai/dsh-llm": "^0.1.5-rc.1 || ^0.1.6-alpha.1 || ^0.1.7-alpha.1 || ^0.2.0-rc.2",
    "@deepseek-ai/dsh-llm-pi-ai": "^0.1.5-rc.1 || ^0.1.6-alpha.1 || ^0.1.7-alpha.1 || ^0.2.0-rc.2",
    "@deepseek-ai/dsh-settings": "^0.1.5-rc.1 || ^0.1.6-alpha.1 || ^0.1.7-alpha.1 || ^0.2.0-rc.2",
    "@deepseek-ai/schemastery": "^3.18.2",
    "@earendil-works/pi-ai": "^0.85.1",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/cordis": { "optional": true },
    "@deepseek-ai/dsh-atomic-write": { "optional": true },
    "@deepseek-ai/dsh-attachment": { "optional": true },
    "@deepseek-ai/dsh-home-paths": { "optional": true },
    "@deepseek-ai/dsh-host-webserver": { "optional": true },
```

</details>

**依据 5 · 源码核查**：[lib/panel.js:934-953](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/panel.js#L934-L953)

停用影响模型可见性。

<details>
<summary>查看原文（20行）</summary>

```text
  }
  /**
   * 渠道被禁用 ⇒ 它名下所有模型都隐藏。
   *
   * 这里返回一个**永远匹配**的哨兵而不是真实 id 列表：调用方（三个 provider 的
   * `listModels`）拿它做 `Set.has(model.id)`。用哨兵就不必为了凑出 id 列表先去
   * 探一次上游 —— 而"探测失败导致禁用不彻底"正是旧做法的另一个隐患。
   *
   * 判定时**两种 id 都认**：`disabledChannels` 里存的是渠道 id，本函数的入参是
   * provider id，二者在 Qoder 上不同（`qoder` vs `qoder1`）。只认后者会让
   * 禁用 Qoder 静默失效，所以把 provider id 反查回它所属的渠道 id 再比对一次。
   */
  const channels = new Set(prefs.disabledChannels);
  if (channels.has(providerId) || channels.has(channelIdOfProvider(providerId))) {
    return [HIDE_ALL_SENTINEL];
  }
  return out;
}

/**
```

</details>

#### 缺口

- 没有上游当前额度/价格、模型能力、真实账号与同任务账单验证。
  **影响**：不能确认经济收益或持续可用性。
  **进一步探讨**：固定账号/模型/日期跑同一已知工具任务，记录全部积分、模型请求、成功结果与修复工时。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 当前采用结论是什么，什么生产方向值得验证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前观察，先修复停用渠道的签到控制并审凭据路径。后续试用从一个明确账号/区域、关闭自动签到、非敏感项目副本和已知只读工具任务开始，再测试可恢复小改动；核对实际模型、有效档位、完整工具结果与上游账单。切渠道后出现历史缺失、流不完整或账号不符时停止，回原客户端或已验证的单渠道配置。界面统一和测试数量不能替代这些条件。

值得验证的方向是渠道切换前的有效输入与操作回执：显示实际provider/账号区域、模型/档位、历史被修复删去的部分、自动领取目标和最新额度时间，让用户在允许前知道发生什么；修复停用过滤是已有功能缺陷修复，不计新创新。最小实验对照统一面板与带回执版本在错账号、孤儿工具历史、中断流和停用签到时发现异常的比例、误调用数、纠错工时及总费用。若现有单渠道已同样清楚，或回执不减少误判却增加操作负担，则不开发这个方向。

#### 证据与依据

**依据 1 · 源码核查**：[lib/providers/workbuddy/index.js:614-683](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/providers/workbuddy/index.js#L614-L683)

有效历史会变化的依据。

<details>
<summary>查看原文（70行）</summary>

```text
function repairToolPairing(raw, logger) {
	let body;
	try {
		body = JSON.parse(raw);
	} catch {
		return raw;
	}
	if (typeof body !== "object" || body === null || Array.isArray(body)) return raw;
	const messages = body.messages;
	if (!Array.isArray(messages)) return raw;

	/** assistant 消息按顺序展开的全部调用 id（同一 id 可能多次出现，全部登记）。 */
	const callIds = new Set();
	/** 函数名缺失/为空的调用 id —— 规则 4 的清理对象（见函数头注释的实测证据）。 */
	const degenerateIds = new Set();
	for (const m of messages) {
		if (m === null || typeof m !== "object" || Array.isArray(m)) continue;
		const calls = m.tool_calls;
		if (!Array.isArray(calls)) continue;
		for (const c of calls) {
			if (c === null || typeof c !== "object") continue;
			if (typeof c.id === "string" && c.id !== "") callIds.add(c.id);
			/**
			 * **缺 name 键与空串同样算退化**：下游（pi-ai）建工具调用块时以 name 为准，
			 * 没有名字的调用最终就是"未知工具"，与空串的结果完全一样。OpenAI 流式
			 * 契约里首片必定带 name，所以"有 id 但无 name"只可能是首片丢失后的残片。
			 */
			const fn = c.function;
			const name = fn !== null && typeof fn === "object" ? fn.name : c.name;
			if ((typeof name !== "string" || name.trim() === "") && typeof c.id === "string" && c.id !== "") degenerateIds.add(c.id);
		}
	}

	let orphanResults = 0;
	let danglingCalls = 0;
	let degenerateResults = 0;
	const repaired = [];
	for (const m of messages) {
		if (m === null || typeof m !== "object" || Array.isArray(m)) {
			repaired.push(m);
			continue;
		}
		if (m.role === "tool") {
			const id = m.tool_call_id;
			// 规则 1：孤儿结果 → 丢弃
			if (typeof id === "string" && id !== "" && !callIds.has(id)) {
				orphanResults++;
				continue;
			}
			// 规则 4 的配套结果：调用都要删了，结果留着只会变成孤儿 → 一起丢弃
			if (typeof id === "string" && degenerateIds.has(id)) {
				degenerateResults++;
				continue;
			}
			repaired.push(m);
			continue;
		}
		if (m.role === "assistant" && Array.isArray(m.tool_calls)) {
			// 规则 2：没有结果回应的调用 → 删掉；规则 4：函数名为空的调用 → 删掉
			const kept = m.tool_calls.filter((c) => {
				if (c === null || typeof c !== "object") return false;
				if (typeof c.id !== "string" || c.id === "") return false;
				if (degenerateIds.has(c.id)) return false;
				return messages.some((x) => x !== null && typeof x === "object" && x.role === "tool" && x.tool_call_id === c.id);
			});
			if (kept.length !== m.tool_calls.length) danglingCalls += m.tool_calls.length - kept.length;
			if (kept.length === 0) {
				/**
				 * 删空后**不能**留下「无正文 + 无 tool_calls」的 assistant 消息：
				 * pi-ai 自己转换时会跳过这种消息（源码注释写明「有的上游要求
```

</details>

**依据 2 · 源码核查**：[lib/panel.js:687-721](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/panel.js#L687-L721)

签到目标需要解释的依据。

<details>
<summary>查看原文（35行）</summary>

```text
/** 扇出一条渠道：拉状态（workbuddy 还要额外探一次签到看板）。 */
export async function probeChannel(channel, options = {}) {
  const base = options.base ?? loopbackBaseFallback();
  let raw;
  try {
    raw = await fetchRoute(channel.statusPath, { base });
  } catch (error) {
    return normalizeChannel(channel, undefined, undefined, error);
  }
  const adapter = KIND_ADAPTERS[channel.kind] ?? KIND_ADAPTERS.workbuddy;
  let checkinDoc;
  const signedIn = raw !== undefined && raw.status === "signed-in";
  if (options.autoCheckin === true && adapter.autoClaim === true && signedIn) {
    // 自动签到：POST 领取（幂等）。这一趟同时把"今天签没签"带回来。
    try {
      checkinDoc = { claim: await fetchRoute(channel.checkinPath, { method: "POST", timeoutMs: 25000, base }) };
    } catch (error) {
      checkinDoc = { claim: { state: "failed", message: briefMessage(error) } };
    }
  } else if (adapter.probeCheckin === true && signedIn) {
    try {
      checkinDoc = await fetchRoute(channel.checkinPath, { base });
    } catch {
      /* 签到看板拿不到不影响这一行；checkin 会退化成 unknown */
    }
  }
  return normalizeChannel(channel, raw, checkinDoc);
}

/** 扇出所有渠道（并发，互不影响）。 */
export async function probeAll(channels = registryChannels(), options = {}) {
  const results = await Promise.all(channels.map((channel) => probeChannel(channel, options)));
  return results;
}

```

</details>

**依据 3 · 源码核查**：[lib/providers/workbuddy/index.js:921-930](https://github.com/chengshenyangtai/dsh-workbuddy-trae-qoder-connect/blob/2b4f433f005b4622303b8539c1b2800e3a2fa56d/lib/providers/workbuddy/index.js#L921-L930)

终止符与完整结果的边界。

<details>
<summary>查看原文（10行）</summary>

```text
		let sawDone = false;
		const body = Readable.fromWeb(result.response.body);
		body.on("data", (chunk) => {
			if (chunk.includes("[DONE]")) sawDone = true;
		});
		body.on("error", (error) => {
			logger?.warn("dsh-workbuddy-connect: upstream stream failed mid-flight", error);
			if (!sawDone && res.writable) res.end("data: [DONE]\n\n");
		});
		body.pipe(res);
```

</details>

#### 缺口

- 缺陷尚未修复且没有账号试用、回执对照。
  **影响**：当前不支持生产采用或新方案价值。
  **进一步探讨**：先修控制并验证零误签到，再做单账号已知任务和错误检出对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
