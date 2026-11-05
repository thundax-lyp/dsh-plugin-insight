# DSH 个人中心

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[09bc317](https://github.com/PolinniZhong/dsh-personal-center/tree/09bc3178c96c8afc07122d055696946298b7d39e)

<!-- BEGIN META -->
[![GitHub ★ 115](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=115&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PolinniZhong/dsh-personal-center) [![npm 30d 2,054](https://img.shields.io/static/v1?label=npm+30d&message=2%2C054&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-personal-center) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-personal-center)
<!-- END META -->

> **功能**：在 DSH Web 聚合用量与估算成本，管理工作区指令和桌宠。

> **亮点**：[Q01](#research-q01) 将本地活动回顾与指令维护并入个人中心。

> **主要限制**：[Q02](#research-q02) 整行日志解析、模型传输和路由访问分别核对。

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
  - [Q01 · 个人中心在 DSH 集成了什么？](#detail-section-11)
  - [Q02 · 本地日志及配置的边界是什么？](#detail-section-12)
  - [Q03 · 何时适合试用和停用？](#detail-section-13)
  - [Q04 · 怎样降低本机代理场景的配置越权风险？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望查看用量并按项目配置指令的 DSH 用户。

手工检查日志和编辑各项目配置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 用量 | 本地日志聚合 | 依赖日志格式和价表 |
| 个性化 | 按工作区合并指令 | 进入系统提示词 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH Web | 必需 | 路由与设置 | 保持人工流程 |
| 本地会话日志 | 统计所需 | 提供用量事件 | 空数据核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 合成日志与配置 | 记录基准 |
| 验证 | 检查估算和工作区切换 | 核对实际提示词 |
| 退出 | 禁用并读回设置 | 按需清除 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本机资源未知 | 准备基准日志 | 未测 |
| 持续 | 价表维护成本未知 | 与账单核对 | 按模型 |
| 退出 | 恢复成本未知 | 清理配置 | 保留日志 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统计 | 按记录估算用量与成本 | 真实计费 |
| 个性化 | 按工作区合并文本 | 宿主兼容 |

> **思考**：[Q02](#research-q02) 整行日志解析、模型传输和路由访问分别核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将本地活动回顾与指令维护并入个人中心。

[Q02](#research-q02) 检查宿主认证与传给模型的字段。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 整行日志解析、模型传输和路由访问分别核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用合成日志及指令。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定 lib 运行文件及作者文档，未执行。

- 已检查：作者 README、包清单、源码路径 PRIVACY.md、README.zh-CN.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的 lib 运行文件与文档。
- 下一步：检查日志、提示词及路由身份。

**分析版本**

- **仓库**：[PolinniZhong/dsh-personal-center](https://github.com/PolinniZhong/dsh-personal-center)
- **版本号**：1.2.0（[固定提交 09bc317](https://github.com/PolinniZhong/dsh-personal-center/tree/09bc3178c96c8afc07122d055696946298b7d39e)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 宿主身份和来源约束可测试写入边界。

检查日志、提示词及路由身份。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 23 | 3101 | — | — | 50089 |
| .js | source | 2 | 4996 | 4192 | 628 | — |
| .mjs | source | 1 | 115 | 82 | 27 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/PolinniZhong/dsh-personal-center/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/PolinniZhong/dsh-personal-center/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/PolinniZhong/dsh-personal-center/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：个人中心怎样聚合数据和注入个性化指令？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 个人中心在 DSH 集成了什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

希望查看本地使用情况和管理工作区指令的用户，可从个人中心查看会话用量和估算成本；宿主事件把全局与匹配工作区的指令合并进 custom-instructions。相比读日志和手工改配置，插件将回顾与编辑集中于一个界面。固定树提供的是已提交的 lib 运行文件。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:375-394](https://github.com/PolinniZhong/dsh-personal-center/blob/09bc3178c96c8afc07122d055696946298b7d39e/lib/index.js#L375-L394)

解压与解析事件

<details>
<summary>查看原文（20行）</summary>

```text
	} catch {
		return [];
	}
	const frames = scanZstdFrames(buf);
	if (frames.length === 0) return [];
	const events = [];
	for (const fr of frames) {
		let text;
		try {
			text = zstdDecompressSync(buf.subarray(fr.start, fr.end)).toString("utf8");
		} catch {
			continue;
		}
		for (const line of text.split("\n")) {
			if (!line.trim()) continue;
			try {
				events.push(JSON.parse(line));
			} catch {
				/* 忽略坏行 */
			}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:541-560](https://github.com/PolinniZhong/dsh-personal-center/blob/09bc3178c96c8afc07122d055696946298b7d39e/lib/index.js#L541-L560)

用量和价格计算

<details>
<summary>查看原文（20行）</summary>

```text
			sessionRequests += 1;
			if (time && time >= todayStart) {
				todayTokens += toks;
				sessionToday = true;
			}
			if (provider && model) {
				const key = provider + "::" + model;
				const price = prices[key];
				let cost = 0;
				let currency = null;
				// 成本(按模型价格,含峰谷分时;只有配置了该模型价格才计)
				if (price && typeof price.output === "number") {
					cost = usageCost({ inputTokens: input, cacheReadTokens: cache, outputTokens: output, reasoningTokens: reasoning }, price, isBeijingPeak(time ?? Date.now()));
					currency = price.currency === "usd" ? "usd" : "cny";
					const add = (bucket) => { bucket[currency] = (bucket[currency] ?? 0) + cost; };
					add(costTotals.all);
					if (time !== null) {
						if (time >= weekStartMs) add(costTotals.week);
						if (time >= monthStartMs) add(costTotals.month);
						if (time >= todayStart) add(costToday);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1050-1071](https://github.com/PolinniZhong/dsh-personal-center/blob/09bc3178c96c8afc07122d055696946298b7d39e/lib/index.js#L1050-L1071)

组装提示词

<details>
<summary>查看原文（22行）</summary>

```text
	ctx.on("system-prompt/assemble", async (assembly, context, next) => {
		const result = await next();
		if (!result || !Array.isArray(result.sections)) return result;
		try {
			const settings = settingsAdapter;
			const global = settings?.get(NS)?.text ?? "";
			const cwd = context?.agent?.session?.header?.cwd ?? null;
			const { workspaces } = parseInstructions(settings);
			const wsText = cwd ? matchWorkspace(cwd, workspaces) : "";
			const merged = mergeInstructions(global, wsText);
			const idx = result.sections.findIndex((s) => s && s.name === "custom-instructions");
			if (typeof merged !== "string" || merged.trim() === "") {
				if (idx >= 0) result.sections.splice(idx, 1); // 空则移除(与未配置一致)
			} else {
				const section = { name: "custom-instructions", text: merged };
				if (idx >= 0) result.sections[idx] = section;
				else result.sections.splice(1, 0, section); // 紧跟第一个(身份)段之后
			}
		} catch {
			/* 注入失败不阻塞组装 */
		}
		return result;
```

</details>

**依据 4 · 作者声明**：[README.zh-CN.md:61-102](https://github.com/PolinniZhong/dsh-personal-center/blob/09bc3178c96c8afc07122d055696946298b7d39e/README.zh-CN.md#L61-L102)

作者列出统计、指令及桌宠

<details>
<summary>查看原文（42行）</summary>

```text
## ✨ 功能

### Token 用量(统计)

- **今日概览**:Token 消耗 / 会话 / 工具调用;
- **累计数据**:累计 Token / 最长聊天时长 / 会话总数 / **缓存命中率** / **估算成本**;
- **Token 活动**:GitHub 贡献图风格热力图,支持 **每日 / 每周 / 累计** 三态切换;
- **按供应商分布**:按 provider 分组的 Token、请求数、**缓存命中率**与成本(供应商小计 + 其下各模型明细;多供应商 / 多模型分别统计);
- **常用工具**:按调用次数排序(含 `mcp__<server>__<tool>` 形式的 MCP 工具);
- **会话回顾**:最近会话列表(标题 / 日期 / 时长 / Token / 缓存命中率),**自动排除已归档会话**。

数据来源:扫描本机会话日志(session.v4 / session.v3 / 旧版会话日志)实时聚合,只读数字、不读正文。见 [docs/common/DESIGN.md](docs/common/DESIGN.md)。

### 模型成本(估算)

- 按模型 × 每百万 token 单价估算成本,**分币种**(¥/$)分别合计;
- 支持 **峰谷分时**(DeepSeek 官方口径:北京 9:00-12:00、14:00-18:00 为高峰,空闲=高峰一半);
- 内置官方预设价(deepseek / kimi / gemini / gpt),提供「提供方→模型」联想添加,可自改;
- 展示:**本周 / 本月 / 累计** 成本。

### 个性化(分层指令:v0.7)

- **全局指令**(身份基线):输入身份 / 工作原则 / 回答偏好,保存后**本机所有会话**的下一次请求自动带上;
- **按工作区指令**(项目适配):为每个工作区配置专属指令,会话按 **cwd 最长前缀匹配**自动注入「全局 + 工作区」合并文本;未配置的工作区回退仅全局(与旧版行为一致);
- **指令模板库**:内置 5 个高质量模板(产品经理 / 开发者 / 写作 / 翻译 / 通用助手),一键应用到全局或当前工作区;支持把当前指令「存为模板」、编辑、删除;
- **注入预览**:底部实时显示「全局 + 当前工作区」合并后的最终指令 + ≈token 估算,切换工作区联动更新;
- 全部纯本地(settings.yaml)、零网络、不迁移现有 `custom-instructions` 数据,中英文双语、DSH 设计令牌。

### 桌面宠物(黑鲸 / 蓝鲸)

- 界面右下角圆滚滚小黑鲸(默认 S 尺寸),纯前端零依赖(素材为宿主托管的动画 WebP,真 alpha 透明,深色主题有描边光);
- **矢量皮肤「圆滚滚小黑 / 圆滚滚小蓝」**(v1.1,皮肤 id `black-vector` / `blue-vector`):纯 DOM 渲染(圆形渐变身体 + 胶囊眼),**零素材**;鼠标跟随四层(眼睛朝向 / 头位移 / 上下"驼"形变 / 渐变光源)+ 转向透视(转向侧眼睛变小 + 两眼间距压缩)+ 靠近眨眼 / 点眼眯线 / 点身挠痒 / 随机头放大;与位图皮肤并存、互斥,位图↔矢量切换销毁重建实例;
- **宠物列表**:圆滚滚小黑鲸 / 圆滚滚小蓝鲸**各一张完整配置卡**(预览 + 今日统计 + 不透明度 + 开关),**开关互斥只能启用一只**;左边形象图在面板打开期间**交替随机播放小表情动画**(每 10s 轮换一只,启用瞬间再动一次 = 唤醒);未启用的卡片保持静态(固定表情 + 占位统计);
- **常驻显示,平时静止不打扰**(参考 Codex 宠物设计):待机时显示单帧静态表情,不做循环动作;**情绪变化时会播放对应动画**,约 2 秒后回到静止;**鼠标悬停或点击也会按当前情绪做个小动作**;
- **5 种数据驱动情绪**,30 秒轮询 `/personal-center/stats`,优先级:钱包痛 > 疲惫 > 忙碌 > 打盹 > 开心;
  - 开心 = 缓存命中率 ≥ 70%;忙碌 = 今日工具调用 ≥ 400 次;疲惫 = 今日 Token ≥ 2 亿;钱包痛 = 今日成本 ≥ ¥10(需配置价格);打盹 = 无活动 ≥ 10 分钟(阈值已按本机真实数据校准);
- **点击**弹出随机数据气泡(今日 Token / 缓存命中率 / 最常用工具 / 今日成本),3 秒后消失;
- **会话状态概览**:宠物页顶部「会话状态」卡可**开关**状态概览(默认开);开启后悬停宠物右上角「会话状态」按钮(或点击宠物)→ 毛玻璃面板,实时列出会话状态(运行中 / 失败 / 已完成 / 待机 + 摘要计数,**运行中/失败置顶**);**双击某条直接进入对应会话**;失败如实标红(绝不伪装绿色成功);数据来自平台已有 `sessions` 投影,事件驱动、零轮询;点面板外或 ESC 关闭;关闭会话状态时按钮隐藏、宠物情绪回到用量驱动;
- **自由拖拽**:拖到哪就停在哪,松手后位置记忆到宿主配置(刷新后恢复);窗口缩放**按比例跟随**(缩小/拉大都跟随,始终留在视口内不丢出);
- **右键**快捷菜单:隐藏宠物;
- 「宠物」tab 极简面板:顶部「会话状态」卡(标题 + 开关 + 说明,宠物未启用时置灰)+ 下方两张宠物卡片(预览 + 宠物名 + ⓘ 提示 + 今日统计 + **不透明度档位(30%/60%/100%)** + **启用开关**);开关互斥、交互只靠开关(无 hover/选中视觉);
- `enabled:false` 时不创建任何 DOM、不轮询;接口失败保留上一状态不崩溃;
```

</details>

#### 缺口

- 未运行发行物或核对模型账单
  **影响**：成本误差和配置兼容未知
  **进一步探讨**：用合成日志和已知费率核对输出

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地日志及配置的边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

源码会对解压的日志逐行 JSON.parse，统计输出以用量等字段聚合。作者声称不读取正文，适合解读为统计用途及输出范围，源码的读取和解析粒度仍是整行。路由以 socket 远端地址判断回环，允许更新指令；宿主是否再验证身份、反向代理后远端地址和浏览器跨站提交待核。自定义文本会进入系统提示词。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:375-394](https://github.com/PolinniZhong/dsh-personal-center/blob/09bc3178c96c8afc07122d055696946298b7d39e/lib/index.js#L375-L394)

整行解析

<details>
<summary>查看原文（20行）</summary>

```text
	} catch {
		return [];
	}
	const frames = scanZstdFrames(buf);
	if (frames.length === 0) return [];
	const events = [];
	for (const fr of frames) {
		let text;
		try {
			text = zstdDecompressSync(buf.subarray(fr.start, fr.end)).toString("utf8");
		} catch {
			continue;
		}
		for (const line of text.split("\n")) {
			if (!line.trim()) continue;
			try {
				events.push(JSON.parse(line));
			} catch {
				/* 忽略坏行 */
			}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1074-1109](https://github.com/PolinniZhong/dsh-personal-center/blob/09bc3178c96c8afc07122d055696946298b7d39e/lib/index.js#L1074-L1109)

回环判断及 GET、POST

<details>
<summary>查看原文（36行）</summary>

```text
	// 环回路由:统计 + 自定义指令读写(绕开 Web 设置白名单,直接走 ctx.settings)。
	ctx.inject(["webServer", "settings"], (webCtx) => {
		const route = {
			kind: "prefix",
			path: "/personal-center",
			handler: async (req, res) => {
				if (!isLoopback(req.socket?.remoteAddress ?? "")) {
					sendJson(res, 403, { ok: false, error: "仅允许本机访问" });
					return;
				}
				const url = new URL(req.url ?? "/", "http://x");
				const method = req.method ?? "GET";
				try {
					if (method === "GET" && url.pathname === "/personal-center/stats") {
						sendJson(res, 200, { ok: true, ...getStats(webCtx, url.searchParams.get("refresh") === "1") });
						return;
					}
					if (url.pathname === "/personal-center/custom-instructions") {
						const settings = settingsAdapter;
						if (method === "GET") {
							const text = settings ? settings.get(NS)?.text ?? "" : "";
							sendJson(res, 200, { ok: true, text });
							return;
						}
						if (method === "POST") {
							const body = await readBody(req);
							if (typeof body.text !== "string") {
								sendJson(res, 400, { ok: false, error: "text 字段必须是字符串" });
								return;
							}
							if (!settings) {
								sendJson(res, 500, { ok: false, error: "settings 服务不可用" });
								return;
							}
							await settings.update(NS, { text: body.text });
							sendJson(res, 200, { ok: true });
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1050-1071](https://github.com/PolinniZhong/dsh-personal-center/blob/09bc3178c96c8afc07122d055696946298b7d39e/lib/index.js#L1050-L1071)

文本写入提示词

<details>
<summary>查看原文（22行）</summary>

```text
	ctx.on("system-prompt/assemble", async (assembly, context, next) => {
		const result = await next();
		if (!result || !Array.isArray(result.sections)) return result;
		try {
			const settings = settingsAdapter;
			const global = settings?.get(NS)?.text ?? "";
			const cwd = context?.agent?.session?.header?.cwd ?? null;
			const { workspaces } = parseInstructions(settings);
			const wsText = cwd ? matchWorkspace(cwd, workspaces) : "";
			const merged = mergeInstructions(global, wsText);
			const idx = result.sections.findIndex((s) => s && s.name === "custom-instructions");
			if (typeof merged !== "string" || merged.trim() === "") {
				if (idx >= 0) result.sections.splice(idx, 1); // 空则移除(与未配置一致)
			} else {
				const section = { name: "custom-instructions", text: merged };
				if (idx >= 0) result.sections[idx] = section;
				else result.sections.splice(1, 0, section); // 紧跟第一个(身份)段之后
			}
		} catch {
			/* 注入失败不阻塞组装 */
		}
		return result;
```

</details>

**依据 4 · 作者声明**：[PRIVACY.md:7-16](https://github.com/PolinniZhong/dsh-personal-center/blob/09bc3178c96c8afc07122d055696946298b7d39e/PRIVACY.md#L7-L16)

作者对统计和模型传输的声明

<details>
<summary>查看原文（10行）</summary>

```text
### 自定义指令(个性化)

- 你在「个性化」里输入的文本,保存在**本机**的 `settings.yaml`(`<DSH_HOME>/settings.yaml`);
- 它会随每次请求作为系统提示词的一部分发给**你已配置的模型服务商**(与 DeepSeek Harness 自身发送请求的方式一致,不增加新的传输路径)。

### 个人资料统计

- 统计只读取本机会话日志(`<DSH_HOME>/sessions/**/session.v4.jsonl.zstd`(兼容 v3 / 旧版 `session.jsonl.zstd`));
- **只聚合数字**,例如:Token 数量、会话数、工具调用次数、供应商 / 模型名、时间戳;
- **不读取、不存储、不展示任何聊天正文内容**(你的消息、AI 回复、文件内容都不会被统计模块读取)。
```

</details>

#### 缺口

- 宿主外层路由与代理防护未知
  **影响**：不能据此认定外网可用或仅特定用户可用
  **进一步探讨**：隔离测试本地进程、代理和浏览器来源

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时适合试用和停用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

在兼容的 DSH Web 及测试目录中造几份用量日志，检查估算、工作区匹配与空指令清除。成本来自合成验证、价表维护和本机扫描，实际金额应与账单核对。退出时禁用插件，再查看保留的设置并按需删掉测试指令。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:74-88](https://github.com/PolinniZhong/dsh-personal-center/blob/09bc3178c96c8afc07122d055696946298b7d39e/README.zh-CN.md#L74-L88)

估算及个性化

<details>
<summary>查看原文（15行）</summary>

```text
### 模型成本(估算)

- 按模型 × 每百万 token 单价估算成本,**分币种**(¥/$)分别合计;
- 支持 **峰谷分时**(DeepSeek 官方口径:北京 9:00-12:00、14:00-18:00 为高峰,空闲=高峰一半);
- 内置官方预设价(deepseek / kimi / gemini / gpt),提供「提供方→模型」联想添加,可自改;
- 展示:**本周 / 本月 / 累计** 成本。

### 个性化(分层指令:v0.7)

- **全局指令**(身份基线):输入身份 / 工作原则 / 回答偏好,保存后**本机所有会话**的下一次请求自动带上;
- **按工作区指令**(项目适配):为每个工作区配置专属指令,会话按 **cwd 最长前缀匹配**自动注入「全局 + 工作区」合并文本;未配置的工作区回退仅全局(与旧版行为一致);
- **指令模板库**:内置 5 个高质量模板(产品经理 / 开发者 / 写作 / 翻译 / 通用助手),一键应用到全局或当前工作区;支持把当前指令「存为模板」、编辑、删除;
- **注入预览**:底部实时显示「全局 + 当前工作区」合并后的最终指令 + ≈token 估算,切换工作区联动更新;
- 全部纯本地(settings.yaml)、零网络、不迁移现有 `custom-instructions` 数据,中英文双语、DSH 设计令牌。

```

</details>

**依据 2 · 作者声明**：[README.zh-CN.md:105-133](https://github.com/PolinniZhong/dsh-personal-center/blob/09bc3178c96c8afc07122d055696946298b7d39e/README.zh-CN.md#L105-L133)

安装和卸载

<details>
<summary>查看原文（29行）</summary>

````text
## 🛠 安装

### 方式一:插件控制台 / CLI(推荐)

```sh
dsh plugin --profile web add github:PolinniZhong/dsh-personal-center
```

或打开 Web GUI → 设置 → 插件 → 插件控制台,搜索「个人中心」安装。

### 方式二:本地开发(link 依赖,和 dsh-omi-voice 同款)

1. 克隆本仓库到本地任意目录;
2. 在 profile 的 `package.json` 中加入依赖:

   ```json
   "dsh-personal-center": "link:/绝对路径/DSH 个人中心"
   ```

3. 在 profile 的 `dsh.profile.bundles` 列表中加入 `"dsh-personal-center"`;
4. 重启 DSH 应用。

> 注:重启后,若 `node_modules` 中没有该包,可手动建立软链接:
> `ln -s /绝对路径/DSH 个人中心 <DSH_HOME>/profiles/web/node_modules/dsh-personal-center`

### 卸载

设置 → 插件 → 插件控制台,停用 / 删除 `dsh-personal-center`;或删除 `package.json` 中的依赖与 `bundles` 条目。

````

</details>

**依据 3 · 作者声明**：[PRIVACY.md:30-34](https://github.com/PolinniZhong/dsh-personal-center/blob/09bc3178c96c8afc07122d055696946298b7d39e/PRIVACY.md#L30-L34)

作者说明停用后数据保留

```text
## 数据归属与删除

- 所有数据留在本机,归你所有;
- 停用 / 卸载本插件不会删除你的会话日志或 `settings.yaml` 中的指令文本;如需彻底删除,请手动清理相应文件;
- 统计结果每次打开时现场计算(带 60 秒内存缓存),不落盘生成新的统计文件。
```

#### 缺口

- 未验证宿主版本、运行效率或卸载
  **影响**：不能估计本机扫描和维护开销
  **进一步探讨**：以合成 v3/v4 日志复核成本与目录

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样降低本机代理场景的配置越权风险？

**研究主题**：新假设与验证

#### 完整回答

在当前回环限制外试验使用宿主身份和来源校验，比较同源编辑、缺少身份、跨来源请求及经回环代理的写入。以配置实际读回为判据。若未授权写入没有减少或同源编辑不能通过，则调整。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1074-1109](https://github.com/PolinniZhong/dsh-personal-center/blob/09bc3178c96c8afc07122d055696946298b7d39e/lib/index.js#L1074-L1109)

当前路由与配置写入

<details>
<summary>查看原文（36行）</summary>

```text
	// 环回路由:统计 + 自定义指令读写(绕开 Web 设置白名单,直接走 ctx.settings)。
	ctx.inject(["webServer", "settings"], (webCtx) => {
		const route = {
			kind: "prefix",
			path: "/personal-center",
			handler: async (req, res) => {
				if (!isLoopback(req.socket?.remoteAddress ?? "")) {
					sendJson(res, 403, { ok: false, error: "仅允许本机访问" });
					return;
				}
				const url = new URL(req.url ?? "/", "http://x");
				const method = req.method ?? "GET";
				try {
					if (method === "GET" && url.pathname === "/personal-center/stats") {
						sendJson(res, 200, { ok: true, ...getStats(webCtx, url.searchParams.get("refresh") === "1") });
						return;
					}
					if (url.pathname === "/personal-center/custom-instructions") {
						const settings = settingsAdapter;
						if (method === "GET") {
							const text = settings ? settings.get(NS)?.text ?? "" : "";
							sendJson(res, 200, { ok: true, text });
							return;
						}
						if (method === "POST") {
							const body = await readBody(req);
							if (typeof body.text !== "string") {
								sendJson(res, 400, { ok: false, error: "text 字段必须是字符串" });
								return;
							}
							if (!settings) {
								sendJson(res, 500, { ok: false, error: "settings 服务不可用" });
								return;
							}
							await settings.update(NS, { text: body.text });
							sendJson(res, 200, { ok: true });
```

</details>

#### 缺口

- 宿主是否已有等价防护未知
  **影响**：增量取决于具体部署
  **进一步探讨**：先查固定宿主路由再用合成配置试验

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
