# 鲸鱼娘桌宠

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[18fec90](https://github.com/aceice01/dsh-whale-pet/tree/18fec904ec3b4fd3958b6fb8c2fa9c209679328f)

<!-- BEGIN META -->
[![GitHub ★ 30](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=30&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/aceice01/dsh-whale-pet) [![npm 30d 1,189](https://img.shields.io/static/v1?label=npm+30d&message=1%2C189&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-whale-pet) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-whale-pet)
<!-- END META -->

> **功能**：为 DSH 提供鲸鱼娘浮动桌宠、动画语音互动、工作状态提醒和会话余额徽章。

> **亮点**：已有贡献是复用同一pet页面承接Web浮层和桌面窗口，通过宿主事件驱动互动，余额请求留在服务端；增量主要是陪伴/外围提示与同页面查看，不是任务可靠性提高。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：状态只有一份全局work对象，轮次结束计数不能代表当前会话交付；余额服务端stale标志又被客户端忽略，旧值可能看似新鲜。这直接限制其作为监控或付款依据的价值。见 [Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 谁会用桌宠代替持续盯着DSH，实际增量是什么？](#detail-section-11)
  - [Q02 · 双端入口、状态轮询和声音如何连到可见结果？](#detail-section-12)
  - [Q03 · 完成、出错和审批状态是否属于当前会话并能作为验收？](#detail-section-13)
  - [Q04 · 余额缓存失败是否真的向用户标明陈旧？](#detail-section-14)
  - [Q05 · Web、桌面补丁及退出有哪些依赖、副作用和成本？](#detail-section-15)
  - [Q06 · 什么试用可控，怎样验证提醒减少漏看而不误导？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向喜欢角色陪伴的 DSH 用户，把宿主事件转为动画或声音提示，并在会话页眉显示余额；提示仍需回原会话或官方页面确认。

原DSH会话状态和日志可直接确认工作，官方开放平台余额页可核对账户；本插件增加外围呈现，不新增任务执行或业务验收。见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Web桌宠浮层 | 动画、拖动、隐藏和声音 | 依赖slots，音频需浏览器允许 |
| 工作状态提示 | 反映轮次/工具/审批事件 | 全局归并，不是会话独立验收 |
| 余额徽章 | 同页面查看及点击刷新 | 服务端缓存stale未由前端正确显示 |
| 桌面独立小窗 | 外围置顶角色显示 | 需要另行Electron集成，整文件补丁有版本负担 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22与兼容DSH | 必需 | 加载根包及事件 | 需检查具体profile依赖 |
| webServer和客户端slots/react | Web模式必需 | 提供路由、页眉与浮层 | 无对应服务就不能显示 |
| credentials与DeepSeek key | 余额查询必需 | 服务端代理余额 | 返回missing-api-key |
| 浏览器音频和用户手势 | 声音条件 | 播放内嵌音频 | 可能静音，匹配缺失会尝试在线/系统TTS |
| Electron主进程窗口 | 仅桌面独立窗 | 创建透明置顶小窗 | 普通Web插件不保证该窗口 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选独立Web profile，确认入口和依赖 | 不混装根包与复制脚本 |
| 加载 | 插件挂路由、客户端挂插槽 | 先核对状态来源，不以动画当成功 |
| 使用 | 用户开启非关键任务并手势解锁音频 | 提示后回原会话检查 |
| 异常与退出 | 禁用/移除profile插件，桌面改动单独回滚 | 不只隐藏界面；核对备份来源与主文件版本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包/媒体存储，费用未知 | profile依赖核对与可选桌面适配 | 时长未测 |
| 持续使用 | 1.5秒状态、10秒整页、1分钟余额轮询 | 注意力/音量与显示核查 | CPU流量和总成本未测 |
| 失败恢复 | 重试请求/排障成本未知 | 区分旧状态、缓存与依赖失败 | 有误导边界不能只看庆祝 |
| 退出 | 关闭插件加载 | 撤profile和单独主进程改动 | 历史备份需人工核对 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 外围提醒 | 事件经轮询触发动画声音 | 漏报率、错归属实际影响 |
| 余额入口 | 同源路由代理服务端key | 陈旧显示已识别问题，不能当实时保证 |
| 陪伴互动 | 隐藏/拖动和声音路径可读 | 偏好、干扰及工作效率 |

> **思考**：状态只有一份全局work对象，轮次结束计数不能代表当前会话交付；余额服务端stale标志又被客户端忽略，旧值可能看似新鲜。这直接限制其作为监控或付款依据的价值。见 [Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：已有贡献是复用同一pet页面承接Web浮层和桌面窗口，通过宿主事件驱动互动，余额请求留在服务端；增量主要是陪伴/外围提示与同页面查看，不是任务可靠性提高。见 [Q01](#research-q01)、[Q02](#research-q02)。

复用pet.html和服务端保管凭据是可借鉴的展示组合，但单全局状态、丢失stale信号与脚本整文件替换让它不宜直接演化为可靠监控；移植需先明确状态所有权和真实备份恢复，见 [Q02](#research-q02)至[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

状态只有一份全局work对象，轮次结束计数不能代表当前会话交付；余额服务端stale标志又被客户端忽略，旧值可能看似新鲜。这直接限制其作为监控或付款依据的价值。见 [Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用原会话和官方余额页作核对依据，确需角色陪伴时仅在独立Web profile检查非关键提示，不优先使用整文件桌面补丁。发现错归会话、声音干扰或缓存不可辨识时移除挂载；完整比较和退出边界见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

双端展示与轮询机制有源码依据；状态归属和陈旧标志问题为静态路径判断，未运行复现；新设计与效率收益未验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、README.md、plugin/dsh-balance-widget/lib/index.js、plugin/dsh-balance-widget/lib/client.js、plugin/dsh-balance-widget/lib/pet.html、install.ps1、apply-main-patch.ps1、patch/main.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根清单/补丁、完整server181行与client模块、pet声音/状态/更新段、固定Git原件的安装和main替换脚本及桌面窗口路径；没有执行外部服务/插件，不把稀疏检出缺文件当Git缺失。
- 下一步：- 已检查固定源码的双端与脚本接线。
- 未运行目标代码、浏览器/桌面或外部余额/语音服务。
- 静态归属和缓存显示判断未声称运行复现，资源/收益尚无测量。

**分析版本**

- **仓库**：[aceice01/dsh-whale-pet](https://github.com/aceice01/dsh-whale-pet)
- **版本号**：1.0.0（[固定提交 18fec90](https://github.com/aceice01/dsh-whale-pet/tree/18fec904ec3b4fd3958b6fb8c2fa9c209679328f)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证方向是按session/turn归属并显式显示采样与陈旧信号，结合结束原因而非单一idle庆祝；以双会话交错、取消重启与断网序列核对误报、漏报和人工核查成本，不能降低误导则只保留陪伴模式。见 [Q06](#research-q06)。

- 已检查固定源码的双端与脚本接线。
- 未运行目标代码、浏览器/桌面或外部余额/语音服务。
- 静态归属和缓存显示判断未声称运行复现，资源/收益尚无测量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 376 | — | — | 3394 |
| .js | source | 3 | 650 | 555 | 71 | — |
| .mjs | source | 1 | 96 | 66 | 21 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/aceice01/dsh-whale-pet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/aceice01/dsh-whale-pet/issues?q=is%3Aissue+created%3A2026-10-20T03%3A16%3A38.300Z..2026-11-19T03%3A16%3A38.300Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/aceice01/dsh-whale-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-20T03%3A16%3A38.300Z..2026-11-19T03%3A16%3A38.300Z)



统计日期：2026-11-19。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对事件/余额到桌宠显示的机制与可靠性边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁会用桌宠代替持续盯着DSH，实际增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向喜欢角色陪伴、希望在处理DSH任务时收到外围视觉或声音提示的用户。Web版在右下角显示可隐藏的浮层，桌面版需要Electron小窗；附带余额徽章减少离开会话页查看账户余额的切换。相比原界面，增量是事件到动画/声音的另一种呈现和同页面余额入口，不增加Agent任务能力，也不能把庆祝动画当作交付验收。

合格结果是用户知道“需要回DSH查看状态”，不是桌宠证明代码、业务或审批已完成。原有DSH会话状态、日志和开放平台余额页仍是直接替代；不喜欢声音/遮挡、并行多会话或需要精确告警的人，可能承担更多而非更少干扰。作者提供素材、语音和互动主张，源码可确认显示路径，但没有独立用户的漏看率或工作效率对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-53](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/README.md#L26-L53)

作者列出互动、两种形态和附带余额。

<details>
<summary>查看原文（28行）</summary>

```text
## ✨ 功能

| 功能 | 说明 |
|---|---|
| 🐋 同人形象 | DeepSeek 鲸鱼娘同人动画（透明背景，已去绿幕/品红残留） |
| 🎞️ 状态动画 | 待机 / 工作 / 完成 / 出错 / 撒娇 / 跳跃，待机变体轮换 |
| 🗣️ 晓伊语音 | 神经网络人声，49 条台词预合成，完全离线播放 |
| 🥰 互动 | 戳一戳随机反应 · 长按摸头 · 双击静音 · 右键菜单 · 三击诊断 |
| 📢 提醒 | 任务完成（跳跃+纸屑+琶音+语音）· 出错安慰 · 审批提示 · 进度播报 |
| 🎛️ 音量 | 总音量 + 语音/音效/庆祝分动作音量（持久保存） |
| 🖱️ 拖动 | 桌面版全身拖动 · Web 版按住鲸鱼娘拖动 |

支持 **两种形态**：

- 🖥️ **桌面版**：DSH Desktop（Electron）右下角独立透明置顶小窗
- 🌐 **Web 版**：浏览器访问 `dsh --profile web` 时，页面右下角悬浮层

## 💰 附带功能：余额徽章 + 充值入口

插件还包含一个**会话头部余额徽章**（`/api/balance` 代理官方接口）：

| 功能 | 说明 |
|---|---|
| 💰 余额显示 | 会话头部显示 DeepSeek 账户余额（如 `余额 ¥12.34`），每分钟自动刷新 |
| 🔄 点击刷新 | 点击徽章立即刷新余额 |
| ⚡ 充值入口 | 徽章旁的 **"充值"** 链接，一键跳转 DeepSeek 开放平台充值页 |
| 🔒 安全 | API Key 只在服务端使用，**不会传到浏览器**（通过 `credentialRef` 解析） |
| 🛡️ 容错 | 网络失败时保留上次余额并标记 `stale`，不闪断 |
```

</details>

**依据 2 · 源码核查**：[plugin/dsh-balance-widget/lib/client.js:145-154](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/client.js#L145-L154)

Web浮层内嵌pet页面。

<details>
<summary>查看原文（10行）</summary>

```text
		function WebPet() {
			const [hidden, setHidden] = react.useState(false);
			const rootRef = react.useRef(null);
			react.useEffect(() => {
				if (typeof document === "undefined") return;
				const root = document.createElement("div");
				root.className = "dswp-root";
				root.innerHTML =
					'<button class="dswp-hide" title="隐藏桌宠">✕</button>' +
					'<iframe src="/pet.html" title="DeepSeek 鲸鱼娘桌宠" scrolling="no"></iframe>';
```

</details>

**依据 3 · 源码核查**：[plugin/dsh-balance-widget/lib/client.js:204-219](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/client.js#L204-L219)

页眉与浮层实际注册。

<details>
<summary>查看原文（16行）</summary>

```text
			ctx.slots.inject("conversation.session.header.actions", () => ctx.slots.register({
				name: "conversation.session.header.actions",
				id: "balance-widget",
				order: 10
			}, BalanceBadge));
			// web floating pet: register into shell.overlay when available
			try {
				if (ctx.slots && typeof ctx.slots.inject === "function") {
					ctx.slots.inject("shell.overlay", () => ctx.slots.register({
						name: "shell.overlay",
						id: "dsh-balance-widget-webpet",
						order: 1000
					}, WebPet));
				}
			} catch (e) {
				try { window.__dshWebPetError = String(e && e.message || e); } catch (e2) {}
```

</details>

#### 缺口

- 缺少同任务提醒合格率和干扰成本数据。
  **影响**：不能从动画/声音存在推导效率收益。
  **进一步探讨**：固定任务和提醒事件，对比原界面记录漏看、误报、返回检查次数及人工注意力投入。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 双端入口、状态轮询和声音如何连到可见结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根包导出服务端index.js与客户端client.js，bundle补丁按根包名挂载。服务端注入webServer并监听session/event，将turn、tool、todo、goal、approval、command事件写进内存work对象；路由/api/status返回这个对象，/pet.html返回嵌入动画与语音的页面。客户端把余额组件挂到会话页眉，把pet.html iframe挂到shell.overlay。

pet页面每1.5秒拉取状态，首次只建立时间基线，后续按running、工具错误与doneAt变化触发动画或庆祝；请求失败直接返回，不显示新错误。声音先按文本匹配内嵌音频，Web Audio在用户手势后解锁，解码失败被吞掉；匹配不到时会尝试在线Edge语音，再退到系统speechSynthesis。因此预合成片段可离线播放，但整条语音路径不是绝不联网，浏览器音频策略和外部语音可用性都会影响结果。事件到显示链条可读，不代表当前浏览器已成功出声。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:9-11](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/cordis.patch.yml#L9-L11)

根bundle实际挂载。

```text
- insert:
    - id: balance-widget
      name: dsh-whale-pet
```

**依据 2 · 源码核查**：[plugin/dsh-balance-widget/lib/index.js:21-49](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/index.js#L21-L49)

依赖与全局work对象/事件入口。

<details>
<summary>查看原文（29行）</summary>

```text
/** Services required before this plugin mounts. */
const inject = ["webServer"];

/** Official DeepSeek account-balance endpoint. */
const BALANCE_URL = "https://api.deepseek.com/user/balance";

/** Serve cached results within this window to stay responsive on flaky networks. */
const CACHE_TTL_MS = 30 * 1000;

function apply(ctx) {
	/** Last successful balance payload plus its fetch time. */
	let cache = null;

	/** Live agent work state, updated from the session/event firehose. */
	const work = {
		status: "idle", // "idle" | "running"
		runningSince: null,
		doneAt: null,
		doneCount: 0,
		lastTool: null, // { name, at } — most recent tool/call
		lastToolError: null, // { name, code, at } — most recent failed tool
		todos: null, // { total, done, summary } — latest todo/write snapshot
		goal: null, // { state, reason? } — latest goal/change
		waitingApproval: null, // { toolName, reason, at }
		command: null, // { name, running, at } — latest command/run|done
		lastEvent: null, // { type, at }
	};

	ctx.on("session/event", (session, event) => {
```

</details>

**依据 3 · 源码核查**：[plugin/dsh-balance-widget/lib/index.js:157-178](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/index.js#L157-L178)

状态和页面路由。

<details>
<summary>查看原文（22行）</summary>

```text
	ctx.effect(() => ctx.webServer.register({
		kind: "exact",
		path: "/api/status",
		handler: (_req, res) => {
			const body = JSON.stringify({ ok: true, ...work });
			res.writeHead(200, {
				"Content-Type": "application/json; charset=utf-8",
				"Cache-Control": "no-store"
			});
			res.end(body);
		}
	}), "balance-widget: /api/status route");

	ctx.effect(() => ctx.webServer.register({
		kind: "exact",
		path: "/pet.html",
		handler: (_req, res) => {
			const html = readFileSync(new URL("./pet.html", import.meta.url), "utf8");
			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.end(html);
		}
	}), "balance-widget: /pet.html route");
```

</details>

**依据 4 · 源码核查**：[plugin/dsh-balance-widget/lib/client.js:204-219](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/client.js#L204-L219)

双插槽接线。

<details>
<summary>查看原文（16行）</summary>

```text
			ctx.slots.inject("conversation.session.header.actions", () => ctx.slots.register({
				name: "conversation.session.header.actions",
				id: "balance-widget",
				order: 10
			}, BalanceBadge));
			// web floating pet: register into shell.overlay when available
			try {
				if (ctx.slots && typeof ctx.slots.inject === "function") {
					ctx.slots.inject("shell.overlay", () => ctx.slots.register({
						name: "shell.overlay",
						id: "dsh-balance-widget-webpet",
						order: 1000
					}, WebPet));
				}
			} catch (e) {
				try { window.__dshWebPetError = String(e && e.message || e); } catch (e2) {}
```

</details>

**依据 5 · 源码核查**：[plugin/dsh-balance-widget/lib/pet.html:496-526](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/pet.html#L496-L526)

音频解锁、解码失败分支。

<details>
<summary>查看原文（31行）</summary>

```text
  function unlockAudio() {
    if (!audioCtxForClip) {
      try { audioCtxForClip = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audioCtxForClip = null; }
    }
    if (audioCtxForClip && audioCtxForClip.state === "suspended") {
      audioCtxForClip.resume().catch(function () {});
    }
  }
  // unlock as soon as the user interacts anywhere (any click gesture)
  window.addEventListener("pointerdown", unlockAudio, { once: true, capture: true });

  function playClip(key, action) {
    var entry = AUDIO && AUDIO[key];
    if (!entry || !entry.b64) return false;
    try {
      unlockAudio();
      if (!audioCtxForClip) return false;
      var bin = atob(entry.b64);
      var u8 = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      var ab = u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
      var p = audioCtxForClip.decodeAudioData(ab).then(function (buf) {
        var src = audioCtxForClip.createBufferSource();
        src.buffer = buf;
        var gain = audioCtxForClip.createGain();
        gain.gain.value = volFor(action || "voice");
        src.connect(gain).connect(audioCtxForClip.destination);
        src.start(0);
      }).catch(function () {});
      return true;
    } catch (e) { return false; }
```

</details>

**依据 6 · 源码核查**：[plugin/dsh-balance-widget/lib/pet.html:530-562](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/pet.html#L530-L562)

内嵌匹配后在线及系统语音降级。

<details>
<summary>查看原文（33行）</summary>

```text
  function speakText(text) {
    // find a matching pre-synthesized clip by exact text
    if (AUDIO) {
      for (var k in AUDIO) {
        if (AUDIO[k].text === text) {
          playClip(k);
          return true;
        }
      }
    }
    return false;
  }

  function speak(text) {
    if (muted || !ttsEnabled) return;
    // strip emoji / symbols so the text matches the pre-synthesized clip text
    var clean = String(text).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{200D}\u{20E3}]/gu, "").trim();
    if (speakText(clean)) return;
    // fallback: edge online, then system tts
    edgeSpeak(clean).then(function (ok) {
      if (ok) return;
      if (typeof speechSynthesis === "undefined") return;
      try {
        if (!ttsVoice) ttsVoice = pickVoice();
        var u = new SpeechSynthesisUtterance(clean);
        u.lang = "zh-CN";
        u.rate = 1.0;
        u.pitch = 1.1;
        u.volume = 0.9;
        if (ttsVoice) u.voice = ttsVoice;
        speechSynthesis.speak(u);
      } catch (e) {}
    });
```

</details>

**依据 7 · 源码核查**：[plugin/dsh-balance-widget/lib/pet.html:1021-1035](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/pet.html#L1021-L1035)

轮询失败与首次基线。

<details>
<summary>查看原文（15行）</summary>

```text
  /* ---------------- status polling ---------------- */
  async function poll() {
    var status;
    try {
      var rs = await fetch("/api/status", { cache: "no-store" });
      status = await rs.json();
    } catch (e) { return; }
    if (!status || status.ok !== true) return;

    if (!hasLoadedOnce) {
      hasLoadedOnce = true;
      lastDoneAt = status.doneAt;
      lastSadAt = status.lastToolError ? status.lastToolError.at : null;
      setMode(status.status === "running" ? "running" : "idle");
      return;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 完成、出错和审批状态是否属于当前会话并能作为验收？

**研究主题**：缺陷与关键质疑

#### 完整回答

不是当前会话独立状态。apply只建立一个work对象，session/event回调虽然收到session参数却不按它分组；任一可见事件都更新同一status、todo、审批或错误字段。turn/end在上次全局status为running时加doneCount，表达一次被观察到的轮次结束，不区分成功、取消或业务交付。该计数也不持久化，宿主重启后归零。

并发时，A开始、B开始、A结束即可把全局状态切回idle，即使B仍执行；这可由赋值路径直接推导，尚未作为运行复现。pet首次轮询建立doneAt基线以免重播，但断连后也不会告知状态已旧；错误动画的条件使用!lastSadAt，初次设置后后续不同错误可能不再触发同一路径。审批事件只是显示待批提示，不提供批准、停止或任务回滚控制。应将它看作低风险外围提示，回到对应会话确认，不能用于多会话精确监控或业务放行。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/dsh-balance-widget/lib/index.js:34-67](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/index.js#L34-L67)

单一内存状态，session参数未参与归属，turn/end按全局wasRunning计数。

<details>
<summary>查看原文（34行）</summary>

```text
	/** Live agent work state, updated from the session/event firehose. */
	const work = {
		status: "idle", // "idle" | "running"
		runningSince: null,
		doneAt: null,
		doneCount: 0,
		lastTool: null, // { name, at } — most recent tool/call
		lastToolError: null, // { name, code, at } — most recent failed tool
		todos: null, // { total, done, summary } — latest todo/write snapshot
		goal: null, // { state, reason? } — latest goal/change
		waitingApproval: null, // { toolName, reason, at }
		command: null, // { name, running, at } — latest command/run|done
		lastEvent: null, // { type, at }
	};

	ctx.on("session/event", (session, event) => {
		if (!event?.type) return;
		const at = event.time ?? Date.now();
		work.lastEvent = { type: event.type, at };
		switch (event.type) {
			case "turn/start": {
				work.status = "running";
				work.runningSince = at;
				break;
			}
			case "turn/end": {
				const wasRunning = work.status === "running";
				work.status = "idle";
				work.runningSince = null;
				if (wasRunning) {
					work.doneAt = at;
					work.doneCount += 1;
				}
				break;
```

</details>

**依据 2 · 源码核查**：[plugin/dsh-balance-widget/lib/index.js:74-110](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/index.js#L74-L110)

工具错误和审批也共用状态。

<details>
<summary>查看原文（37行）</summary>

```text
			case "tool/result": {
				const d = event.data ?? {};
				if (d.error) {
					work.lastToolError = { name: d.error.name ?? "error", code: d.error.code ?? "", at };
				}
				break;
			}
			case "todo/write": {
				const d = event.data ?? {};
				const list = Array.isArray(d.todos) ? d.todos : [];
				const done = list.filter((t) => t && (t.status === "done" || t.done)).length;
				work.todos = { total: list.length, done, summary: list.map((t) => t?.content ?? "").filter(Boolean).slice(0, 3) };
				break;
			}
			case "goal/change": {
				const d = event.data ?? {};
				work.goal = { state: d.state ?? d.status ?? "active", reason: d.reason ?? d.blocked_reason ?? null };
				break;
			}
			case "approval/asked": {
				const d = event.data ?? {};
				work.waitingApproval = { toolName: d.toolName ?? d.tool ?? "tool", reason: d.reason ?? null, at };
				break;
			}
			case "approval/decided": {
				work.waitingApproval = null;
				break;
			}
			case "command/run": {
				const d = event.data ?? {};
				work.command = { name: d.name ?? "command", running: true, at };
				break;
			}
			case "command/done": {
				if (work.command) work.command.running = false;
				break;
			}
```

</details>

**依据 3 · 源码核查**：[plugin/dsh-balance-widget/lib/pet.html:1021-1035](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/pet.html#L1021-L1035)

失败直接返回且首次只建基线。

<details>
<summary>查看原文（15行）</summary>

```text
  /* ---------------- status polling ---------------- */
  async function poll() {
    var status;
    try {
      var rs = await fetch("/api/status", { cache: "no-store" });
      status = await rs.json();
    } catch (e) { return; }
    if (!status || status.ok !== true) return;

    if (!hasLoadedOnce) {
      hasLoadedOnce = true;
      lastDoneAt = status.doneAt;
      lastSadAt = status.lastToolError ? status.lastToolError.at : null;
      setMode(status.status === "running" ? "running" : "idle");
      return;
```

</details>

**依据 4 · 源码核查**：[plugin/dsh-balance-widget/lib/pet.html:1058-1069](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/pet.html#L1058-L1069)

错误提示门禁与doneAt庆祝条件。

<details>
<summary>查看原文（12行）</summary>

```text
    if (status.lastToolError && !lastSadAt && status.lastToolError.at >= (status.doneAt || 0) - 60000) {
      lastSadAt = status.lastToolError.at;
      sad();
      return;
    }
    if (lastDoneAt !== status.doneAt && status.doneAt !== null) {
      lastDoneAt = status.doneAt;
      celebrate(status.doneCount);
      return;
    }
    if (body.classList.contains("running")) {
      setMode("idle");
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 余额缓存失败是否真的向用户标明陈旧？

**研究主题**：缺陷与关键质疑

#### 完整回答

服务端在30秒TTL内返回缓存；过期后解析宿主凭据、请求官方余额接口并设15秒超时，异常时若已有缓存就回ok=true、stale=true。前端收到任何ok=true却把自身stale强制设为false，没有读取payload.stale；因此服务端降级余额可能以正常新鲜值显示，提示文字也不出现“上次余额”。这是固定源码两端字段不对齐的判断，未声称浏览器中实际复现。

服务端没有先判断response.ok或官方业务success就把解析到的JSON写入缓存；异常HTTP的JSON响应不一定走catch，前端可能显示“余额不可用”。凭据缺失直接返回missing-api-key而非回用旧缓存。API key只用于服务端Authorization，浏览器请求同源余额路由，不直接收到key；这不代替对宿主HTTP访问控制的安全验收。使用者不能据徽章替代付款前的官方余额核对。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/dsh-balance-widget/lib/index.js:126-153](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/index.js#L126-L153)

TTL、凭据缺失、fetch和stale缓存异常路径。

<details>
<summary>查看原文（28行）</summary>

```text
			const now = Date.now();
			if (cache !== null && now - cache.at < CACHE_TTL_MS) {
				write(cache.payload);
				return;
			}
			try {
				const credentials = ctx.get("credentials");
				const hit = credentials ? await credentials.resolve(credentialRef("DEEPSEEK_API_KEY")) : void 0;
				if (!hit?.value) {
					write({ ok: false, error: "missing-api-key" });
					return;
				}
				const response = await fetch(BALANCE_URL, {
					headers: { Authorization: `Bearer ${hit.value}` },
					signal: AbortSignal.timeout(15000)
				});
				const data = await response.json();
				const payload = { ok: true, ...data };
				cache = { payload, at: Date.now() };
				write(payload);
			} catch (error) {
				// Fall back to the last known balance instead of failing the badge.
				if (cache !== null) {
					write({ ...cache.payload, ok: true, stale: true });
					return;
				}
				write({ ok: false, error: String(error?.message ?? error) });
			}
```

</details>

**依据 2 · 源码核查**：[plugin/dsh-balance-widget/lib/client.js:43-63](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/client.js#L43-L63)

ok=true时忽略payload.stale。

<details>
<summary>查看原文（21行）</summary>

```text
				fetch("/api/balance", { cache: "no-store" })
					.then((r) => r.json())
					.then((payload) => {
						if (payload && payload.ok === true) {
							setState({ loading: false, data: payload, error: null, stale: false });
						} else {
							setState((prev) => ({
								loading: false,
								data: prev.data,
								error: String(payload?.error ?? "failed"),
								stale: prev.data !== null
							}));
						}
					})
					.catch((err) => {
						setState((prev) => ({
							loading: false,
							data: prev.data,
							error: String(err),
							stale: prev.data !== null
						}));
```

</details>

**依据 3 · 源码核查**：[plugin/dsh-balance-widget/lib/client.js:75-85](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/client.js#L75-L85)

title依赖客户端state.stale。

<details>
<summary>查看原文（11行）</summary>

```text
			if (state.data) {
				const info = Array.isArray(state.data.balance_infos) ? state.data.balance_infos[0] : null;
				if (info && typeof info.total_balance === "string") {
					const currency = info.currency === "CNY" ? "¥" : (info.currency ? info.currency + " " : "");
					label = "余额 " + currency + info.total_balance;
					dataState = "ok";
					title = "DeepSeek 账户余额（点击立即刷新）" + (state.stale ? "；最近一次更新失败，显示上次余额" : "");
				} else {
					label = "余额不可用";
					title = "余额接口返回异常";
					dataState = "error";
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · Web、桌面补丁及退出有哪些依赖、副作用和成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

普通profile模式需要Node>=22、DSH webServer/session事件以及客户端slots/react/runtime；余额另需宿主credentials服务和可用DeepSeek key。根清单没有直接声明服务端import的dsh-credentials依赖，实际依赖解析必须由目标profile提供。Web浮层无需Electron主进程补丁，声音仍受浏览器手势和TTS降级条件影响。

桌面独立小窗来自patch/main.js，它创建透明置顶BrowserWindow并加载本机/pet.html。可选apply-main-patch.ps1写死D盘安装路径，经字符串标记检查后整文件替换main.js，并做当前文件备份；Revert复制的是仓内main.js.original，不是刚才生成的时间戳备份。不同桌面版本不宜盲用这种替换。install.ps1则向所选profile复制嵌套dsh-balance-widget包、改补丁并保留备份，和根包bundle安装是不同通道，不应重复叠装。

持续资源包括每1.5秒状态查询、每分钟余额查询以及每10秒拉取整份pet.html检查版本；嵌入媒体文件会影响本机流量/解析负担，不能凭本地请求称成本为零。用户还要承担声音/遮挡、依赖升级和失败排查。退出普通插件可移除挂载并重启，脚本/主进程补丁要分别撤回并核对备份；不能把隐藏浮层当停止全部后台轮询。实际现金、耗时和合格提醒成本没有测量。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:12-34](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/package.json#L12-L34)

根导出和分发文件。

<details>
<summary>查看原文（23行）</summary>

```text
  "main": "plugin/dsh-balance-widget/lib/index.js",
  "exports": {
    ".": "./plugin/dsh-balance-widget/lib/index.js",
    "./client": "./plugin/dsh-balance-widget/lib/client.js",
    "./package.json": "./package.json",
    "./cordis.patch.yml": "./cordis.patch.yml"
  },
  "files": [
    "LICENSE",
    "README.md",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "cordis.patch.yml",
    "docs",
    "plugin",
    "patch",
    "tools",
    "install.ps1",
    "apply-main-patch.ps1"
  ],
  "engines": {
    "node": ">=22"
  },
```

</details>

**依据 2 · 源码核查**：[plugin/dsh-balance-widget/lib/index.js:1-3](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/index.js#L1-L3)

运行时credentialRef来自宿主依赖。

```text
import { readFileSync } from "node:fs";
import { credentialRef } from "@deepseek-ai/dsh-credentials";

```

**依据 3 · 源码核查**：[install.ps1:98-149](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/install.ps1#L98-L149)

脚本卸载对应复制包与补丁。

<details>
<summary>查看原文（52行）</summary>

```text
# ---------- uninstall ----------
if ($Uninstall) {
    foreach ($t in $SelectedTargets) {
        $prof  = $t.Profile
        $pdir  = Join-Path $prof "node_modules\$PluginName"
        $patch = Join-Path $prof "cordis.patch.yml"

        if ($DryRun) {
            Write-Host "  [DryRun] would delete: $pdir"
            Write-Host "  [DryRun] would patch:   $patch"
            continue
        }

        Step "Uninstalling $($t.Label)"
        if (Test-Path $pdir) {
            try {
                Remove-Item $pdir -Recurse -Force
                Ok "removed plugin: $pdir"
            } catch {
                Fail "could not remove plugin: $($_.Exception.Message)"
            }
        } else {
            Skip "plugin dir absent, skip"
        }

        if (Test-Path $patch) {
            $content = Get-Content $patch -Raw -Encoding UTF8
            $result = Remove-BalanceWidgetBlock $content
            if ($result.Removed) {
                $new = $result.Text.TrimEnd()
                # If nothing (or only comments) remains, the file would no
                # longer be a top-level YAML array — DSH requires that. Restore
                # the default empty-patch template (comment header + "[]").
                $hasArrayItem = $false
                foreach ($ln in ($new -split "\r?\n")) {
                    $t = $ln.Trim()
                    if ($t -ne "" -and -not $t.StartsWith("#")) {
                        $hasArrayItem = $true
                        break
                    }
                }
                if (-not $hasArrayItem) {
                    $new = "# Your patch layer for this dsh profile, applied after every bundle layer:`r`n# a top-level YAML array of loader patch entries (id-targeted config`r`n# overrides, disables, and insert lists; ``!!js`` expressions allowed).`r`n[]"
                }
                Set-Content $patch $new -Encoding UTF8 -NoNewline
                Ok "removed balance-widget from $patch"
            } else {
                Skip "balance-widget not in patch, skip"
            }
        }
    }
    Write-Host "`nUninstall done. Restart DSH Desktop / dsh web." -ForegroundColor Green
```

</details>

**依据 4 · 源码核查**：[install.ps1:174-190](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/install.ps1#L174-L190)

旧包备份和复制行为。

<details>
<summary>查看原文（17行）</summary>

```text
    if (Test-Path $pdir) {
        $bak = "$pdir.bak-$(Get-Date -Format yyyyMMddHHmmss)"
        try {
            Copy-Item $pdir $bak -Recurse -Force
            Ok "backed up old plugin to: $bak"
            Remove-Item $pdir -Recurse -Force
        } catch {
            Fail "could not back up old plugin: $($_.Exception.Message)"
        }
    }

    try {
        Copy-Item $PluginSrc $pdir -Recurse -Force
        Ok "plugin copied to: $pdir"
    } catch {
        Fail "could not copy plugin: $($_.Exception.Message)"
        continue
```

</details>

**依据 5 · 源码核查**：[apply-main-patch.ps1:25-39](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/apply-main-patch.ps1#L25-L39)

路径写死，找不到即要求手改。

<details>
<summary>查看原文（15行）</summary>

```text
$AppDir = "D:\Program Files\DSH Desktop\resources\app"
$MainJs = Join-Path $AppDir "main.js"
$Patched = Join-Path $PSScriptRoot "patch\main.js"
$Original = Join-Path $PSScriptRoot "patch\main.js.original"

function Step($m) { Write-Host "`n=== $m ===" -ForegroundColor Cyan }
function Ok($m)   { Write-Host "  [OK] $m" -ForegroundColor Green }
function Skip($m) { Write-Host "  [--] $m" -ForegroundColor DarkGray }
function Warn($m) { Write-Host "  [!] $m" -ForegroundColor Yellow }
function Fail($m) { Write-Host "  [X] $m" -ForegroundColor Red }

if (-not (Test-Path $AppDir)) {
    Fail "app directory not found: $AppDir"
    Fail "edit AppDir at the top of this script to match your install path"
    exit 1
```

</details>

**依据 6 · 源码核查**：[apply-main-patch.ps1:56-70](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/apply-main-patch.ps1#L56-L70)

Revert使用仓内original而非时间戳备份。

<details>
<summary>查看原文（15行）</summary>

```text
if ($Revert) {
    Step "Reverting main.js"
    if (-not (Test-Path $Original)) {
        Fail "original main.js not found at $Original"
        exit 1
    }
    if (-not $hasFix) {
        Skip "current main.js does not contain the patch — nothing to revert"
        exit 0
    }
    $bak = "$MainJs.bak-$(Get-Date -Format yyyyMMddHHmmss)"
    Copy-Item $MainJs $bak -Force
    Ok "backed up patched main.js to: $bak"
    Copy-Item $Original $MainJs -Force
    Ok "restored original main.js"
```

</details>

**依据 7 · 源码核查**：[apply-main-patch.ps1:84-98](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/apply-main-patch.ps1#L84-L98)

整文件备份/替换，不是版本约束补丁。

<details>
<summary>查看原文（15行）</summary>

```text
if (-not (Test-Path $Original)) {
    Fail "original main.js not found at $Original (required for revert)"
    exit 1
}
try {
    $bak = "$MainJs.bak-$(Get-Date -Format yyyyMMddHHmmss)"
    Copy-Item $MainJs $bak -Force
    Ok "backed up current main.js to: $bak"
    Copy-Item $Patched $MainJs -Force
    Ok "applied patched main.js"
    Warn "restart DSH Desktop to take effect"
} catch {
    Fail "could not apply patch: $($_.Exception.Message)"
    Fail "if the app is in Program Files, run PowerShell as Administrator"
    exit 1
```

</details>

**依据 8 · 源码核查**：[patch/main.js:113-142](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/patch/main.js#L113-L142)

桌面独立窗口实际创建与加载。

<details>
<summary>查看原文（30行）</summary>

```text
function createPetWindow(port) {
  if (petWindow) return;
  const display = screen.getPrimaryDisplay().workArea;
  const x = display.x + display.width - PET_SIZE.width - 16;
  const y = display.y + display.height - PET_SIZE.height - 16;
  petWindow = new BrowserWindow({
    width: PET_SIZE.width,
    height: PET_SIZE.height,
    x,
    y,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    fullscreenable: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  petWindow.setAlwaysOnTop(true, "screen-saver");
  petWindow.loadURL(`http://127.0.0.1:${port}/pet.html`);
  petWindow.on("closed", () => {
    log("[main] pet window closed");
    petWindow = null;
  });
  petWindow.webContents.on("did-fail-load", (_e, code, desc) => {
```

</details>

**依据 9 · 源码核查**：[plugin/dsh-balance-widget/lib/pet.html:1073-1086](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/pet.html#L1073-L1086)

每10秒检查整页及1.5秒状态轮询。

<details>
<summary>查看原文（14行）</summary>

```text
  /* ---------------- self-update (cache-busting reload) ---------------- */
  var CURRENT_VERSION = "whale-v21";
  setInterval(function () {
    fetch("/pet.html?" + Date.now(), { cache: "no-store" }).then(function (r) { return r.text(); }).then(function (t) {
      var m = t.match(/id="ver">([^<]+)</);
      if (m && m[1] && m[1] !== CURRENT_VERSION) {
        // force a fresh load, bypassing any HTTP/disk cache
        location.replace("/pet.html?" + Date.now());
      }
    }).catch(function () {});
  }, 10000);

  poll();
  setInterval(poll, 1500);
```

</details>

#### 缺口

- 缺少资源和注意力投入测量。
  **影响**：不能计算单位合格提醒成本或声称轻量。
  **进一步探讨**：记录状态请求量、整页字节、CPU和误报后的人工检查时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么试用可控，怎样验证提醒减少漏看而不误导？

**研究主题**：新假设与验证、采用判断

#### 完整回答

当前建议观察。单会话、愿意接受角色动画的用户可在隔离Web profile核查浮层与声音，但不应把它作为关键任务唯一提醒；余额陈旧显示和状态无会话隔离是影响采用的已识别限制。桌面整文件补丁不作为优先路径。需要按会话精确状态或付款核对的用户，直接使用原会话与官方余额页更可控。

可推导的待验证方向是把状态按session/turn分组，连同采样时间、陈旧标志和结束原因呈现，再由用户选择关注会话；这可能把陪伴展示变成可核对的提醒。用双会话交错执行、取消、宿主重启和余额断网的固定事件序列作比较，衡量错归属、漏报、旧余额被当新值和用户返回核对成本。若分组及新鲜度提示仍不减少误导，或新增配置高于收益，就只保留手动陪伴模式，不宣称可靠监控。该方案未实现/未实验，不属于当前插件贡献。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/dsh-balance-widget/lib/index.js:34-67](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/index.js#L34-L67)

全局状态是分组假设的出处。

<details>
<summary>查看原文（34行）</summary>

```text
	/** Live agent work state, updated from the session/event firehose. */
	const work = {
		status: "idle", // "idle" | "running"
		runningSince: null,
		doneAt: null,
		doneCount: 0,
		lastTool: null, // { name, at } — most recent tool/call
		lastToolError: null, // { name, code, at } — most recent failed tool
		todos: null, // { total, done, summary } — latest todo/write snapshot
		goal: null, // { state, reason? } — latest goal/change
		waitingApproval: null, // { toolName, reason, at }
		command: null, // { name, running, at } — latest command/run|done
		lastEvent: null, // { type, at }
	};

	ctx.on("session/event", (session, event) => {
		if (!event?.type) return;
		const at = event.time ?? Date.now();
		work.lastEvent = { type: event.type, at };
		switch (event.type) {
			case "turn/start": {
				work.status = "running";
				work.runningSince = at;
				break;
			}
			case "turn/end": {
				const wasRunning = work.status === "running";
				work.status = "idle";
				work.runningSince = null;
				if (wasRunning) {
					work.doneAt = at;
					work.doneCount += 1;
				}
				break;
```

</details>

**依据 2 · 源码核查**：[plugin/dsh-balance-widget/lib/client.js:43-53](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/client.js#L43-L53)

陈旧信号未保留。

<details>
<summary>查看原文（11行）</summary>

```text
				fetch("/api/balance", { cache: "no-store" })
					.then((r) => r.json())
					.then((payload) => {
						if (payload && payload.ok === true) {
							setState({ loading: false, data: payload, error: null, stale: false });
						} else {
							setState((prev) => ({
								loading: false,
								data: prev.data,
								error: String(payload?.error ?? "failed"),
								stale: prev.data !== null
```

</details>

**依据 3 · 源码核查**：[plugin/dsh-balance-widget/lib/pet.html:1021-1035](https://github.com/aceice01/dsh-whale-pet/blob/18fec904ec3b4fd3958b6fb8c2fa9c209679328f/plugin/dsh-balance-widget/lib/pet.html#L1021-L1035)

采样和失败未知边界。

<details>
<summary>查看原文（15行）</summary>

```text
  /* ---------------- status polling ---------------- */
  async function poll() {
    var status;
    try {
      var rs = await fetch("/api/status", { cache: "no-store" });
      status = await rs.json();
    } catch (e) { return; }
    if (!status || status.ok !== true) return;

    if (!hasLoadedOnce) {
      hasLoadedOnce = true;
      lastDoneAt = status.doneAt;
      lastSadAt = status.lastToolError ? status.lastToolError.at : null;
      setMode(status.status === "running" ? "running" : "idle");
      return;
```

</details>

#### 缺口

- 会话分组与新鲜度提示是否能降低误导未知。
  **影响**：不能称为已存在可靠告警或新设计已有效。
  **进一步探讨**：用交错事件和网络失败实验比对归属、误报漏报、陈旧识别和人工检查投入。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
