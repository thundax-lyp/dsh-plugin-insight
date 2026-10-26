# dsh-status-rotator

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[ae83fc8](https://github.com/01Virex/dsh-status-rotator/tree/ae83fc850c30e78b429a44865f5016b2ef26b08b)

<!-- BEGIN META -->
[![GitHub ★ 208](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=208&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 9,207](https://img.shields.io/static/v1?label=npm+30d&message=9%2C207&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)
<!-- END META -->

> **实现功能**：定制DSH运行状态文案、主题、弹幕与鲸尾动画，并提供设置和词库更新。

> **核心亮点**：将可编辑内容、阶段呈现和包外保存组合成等待区定制流程，相对一次性CSS更易调整；没有证据表明提升任务质量。见 [Q01](#research-q01)。

> **风险与缺陷**：核心取舍在定制收益与宿主DOM/其他主题耦合之间，公开白名单不能强制第三方配合；并发保存保护也有明确条件。见 [Q03](#research-q03)。

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
  - [Q01 · 状态文案定制改变了什么用户任务？](#detail-section-11)
  - [Q02 · 前后端如何同步词库并接管状态显示？](#detail-section-12)
  - [Q03 · 最可能削弱其独立价值的条件是什么？](#detail-section-13)
  - [Q04 · 用户为动态内容与保存需要承担哪些依赖和恢复成本？](#detail-section-14)
  - [Q05 · 哪些工程安排值得复用，未来怎样检验更稳定的状态适配？](#detail-section-15)
  - [Q06 · 哪些用户值得先试用，何时停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向想个性化长回合等待区的DSH用户；任务是改善状态呈现而非提高模型速度。合格结果与原生对照见 [Q01](#research-q01)。

比较原生等待文案和简单本地样式定制；未把视觉装饰等同生产率，也未运行竞品对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 状态文案与主题 | 个性化等待呈现 | 依赖宿主DOM与主题兼容 |
| 配置设置与保存 | 编辑并跨重启保留个人设置 | 依赖可写用户目录，If-Match才提供并发保护 |
| 词库更新 | 获取动态短句 | 网络可选，失败保留旧内容 |
| 弹幕及鲸尾动画 | 视觉定制 | 资源与无障碍影响需现场检查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH Web/Desktop与客户端DOM | 必需 | 挂载状态呈现 | 可能无法显示或冲突 |
| 用户配置目录可写 | 保存必需 | 升级后保留设置 | 保存应报错 |
| CDN/GitHub词库网络 | 自动更新可选 | 更新内容 | 保留上次成功词库，可关闭 |
| 同源可信访问环境 | 配置服务必需 | 限制跨站读写 | 公开网络需额外认证边界 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户在独立profile安装并重启 | 设置页出现 |
| 2 | 先选静态词句，关闭可选动画/远端更新 | 时间与状态仍可理解 |
| 3 | 保存并重新打开客户端 | 设置仍在且无陈旧覆盖 |
| 4 | 开启所需外观并运行长回合 | 无干扰、可禁用恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主与本地存储 | 安装重启、选择文案/动画 | 时间未知，不涉及已核实的额外订阅 |
| 持续使用 | DOM观察、动画和远端词库网络 | 文案维护、兼容检查 | CPU/内存及干扰未量化 |
| 失败恢复 | 排查与重载资源 | 保留包外配置、关闭冲突外观 | 真实恢复耗时未知 |
| 升级退出 | 配置保留和备份 | 重启、检查禁用恢复 | 有清理代码但未验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自定义显示 | 多代DOM接管与刷新路径 | 所有宿主/主题组合兼容 |
| 配置持久 | 包外原子替换与ETag | 实际迁移与跨进程竞态 |
| 词库更新 | 失败保留与字段限制 | 内容质量和个人体验收益 |

> **思考**：核心取舍在定制收益与宿主DOM/其他主题耦合之间，公开白名单不能强制第三方配合；并发保存保护也有明确条件。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将可编辑内容、阶段呈现和包外保存组合成等待区定制流程，相对一次性CSS更易调整；没有证据表明提升任务质量。见 [Q01](#research-q01)。

将可编辑内容、阶段呈现和包外保存组合成等待区定制流程，相对一次性CSS更易调整；没有证据表明提升任务质量。见 [Q01](#research-q01)。

分层所有权、保存前提与生命周期清理有借鉴价值；隐含代价是多状态来源与大规模客户端接线的维护。具体机制与适配假设见 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

核心取舍在定制收益与宿主DOM/其他主题耦合之间，公开白名单不能强制第三方配合；并发保存保护也有明确条件。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议先在独立profile试用，从静态文案开始逐项开启装饰；验收原生计时、读屏、配置保存和禁用恢复。人群和停止条件见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

显示、配置分层、更新和清理机制有源码支持；体验收益、性能和任意宿主兼容未验证；稳定适配层是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定版本README、package以及lib/index.js和lib/client.js的配置、请求、接管及清理路径；未执行目标测试，未逐项审阅全部动画与设置控件。
- 下一步：已检查源码，未运行目标脚本、浏览器测试或同版本真实宿主验收；作者截图/测试脚本只按作者材料处理。

**分析版本**

- **仓库**：[01Virex/dsh-status-rotator](https://github.com/01Virex/dsh-status-rotator)
- **版本号**：0.37.0（[固定提交 ae83fc8](https://github.com/01Virex/dsh-status-rotator/tree/ae83fc850c30e78b429a44865f5016b2ef26b08b)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为以稳定状态数据与呈现插槽替代部分DOM接管，减少宿主升级维护；比较矩阵和否定条件见 [Q05](#research-q05)。

已检查源码，未运行目标脚本、浏览器测试或同版本真实宿主验收；作者截图/测试脚本只按作者材料处理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 4190 | — | — | 71098 |
| .cjs | source | 25 | 7094 | 5859 | 943 | — |
| .js | source | 3 | 11855 | 9219 | 2337 | — |
| .mjs | source | 1 | 111 | 88 | 15 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 18](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=18&color=grey&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 17](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=17&color=grey&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查状态定制相对原生等待区的贡献、配置与DOM机制及采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 状态文案定制改变了什么用户任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是经常在 DSH Web/Desktop 等待长回合、希望状态区具有个人表达的使用者。作者用自定义短句、阶段轮换、主题及动画替代原生固定等待文案，并保留宿主计时。相对简单浏览器样式或手工改宿主，增量在可编辑词库、持续配置与阶段联动的组合，合格结果是等待区正常显示、时间/读屏语义仍正确且禁用可恢复。它并不改变模型任务质量或执行速度，也没有实证显示装饰改善生产率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-11](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/README.md#L3-L11)

作者明确定位和替换范围。

```text
> Give DSH's running status your own voice: **custom phrases, typewriter output, day/night gradients, danmaku and an optional animated whale tail**. Ships **1382 phrases, 14 theme packs**; choose which packs to enable.

**English** | [中文](./README_ZH.md) · [Effects](#effect-preview) · [Install](#installation) · [Reference](#feature-overview) · [Changelog](./CHANGELOG.md)

[![npm version](https://img.shields.io/npm/v/dsh-status-rotator?color=4a6cf7)](https://www.npmjs.com/package/dsh-status-rotator)
[![GitHub stars](https://img.shields.io/github/stars/01Virex/dsh-status-rotator?color=4a6cf7)](https://github.com/01Virex/dsh-status-rotator)
[![license](https://img.shields.io/github/license/01Virex/dsh-status-rotator)](LICENSE)

A [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) client plugin that replaces `Deep diving...` / `深度求索中...` with editable phrases while preserving the host's elapsed-time clock.
```

**依据 2 · 作者声明**：[README.md:146-155](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/README.md#L146-L155)

功能范围含定制、配置和扩展入口。

<details>
<summary>查看原文（10行）</summary>

```text
## Feature Overview

| What to customize | What you can do |
| --- | --- |
| Status text | Rotate by thinking, running and long-task phases; typewriter output, weighted picks and an anti-repeat shuffle bag |
| Phrase content | Toggle and edit packs; use conditions, live placeholders and Chinese/English text |
| Appearance | Light/dark gradients, appearance themes, danmaku with optional hover-pause and click-to-copy, and whale-tail motion |
| Daily workflow | Schedule presets by weekday and time; optionally rotate the browser tab title |
| Saving and updates | Store settings outside the package; hot-apply config changes and report conflicting settings-page writes |
| Plugin integration | Register packs, placeholders and dynamic phrases, or send danmaku through `ctx.statusRotator` |
```

</details>

#### 缺口

- 缺少等待体验与注意力负担的用户对照
  **影响**：不能将趣味性推成效率收益
  **进一步探讨**：用同样长任务比较原生和定制状态，观察干扰、可理解性和偏好

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 前后端如何同步词库并接管状态显示？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

服务端将内置、文件、远端、保存设置与外部词库合成有效文档，配置读取返回与正文一致的 ETag；客户端通过推送/轮询获得新配置，并观察宿主 DOM。当前实现针对 data-turn-process 与 data-chat-running 两代结构维护状态行，主题、会话属性及子节点变化会触发刷新，另有定时重扫描作为兜底。用户设置写入包外存储，临时文件 rename 后更新缓存；因此正常升级不必把用户配置放回包内。该机制依赖选择器和生命周期契约，静态存在不能证明任意宿主版本可用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1382-1394](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/lib/index.js#L1382-L1394)

配置层合成顺序。

<details>
<summary>查看原文（13行）</summary>

```text
	// 两个可选的词库层,顺序即优先级(低 → 高):
	//   自动更新词库(remote):上游 main 的 config.example.json 落盘缓存,压在
	//     config.json 之上(否则插件目录/示例文件层会把它整份顶掉),但在用户配置之下
	//     —— 用户显式保存过的包仍以用户为准;上游新增的包按 id 追加,不影响其余包。
	//   本地词库(bank):手改的那份,优先级最高,改完即生效(见 externalBankDocument)。
	// 两者都只带 packs / phrases,不会碰运行时配置。
	const remoteDoc = await remoteBankDocument();
	// 用户配置存储($DSH_HOME/status-rotator/config.json):设置页保存的落点,
	// 也是「手改 config.json」被搬过来的落点;升级插件不会清空它(issue #51)。
	const storedDoc = await healedUserConfigDocument();
	const bankDoc = await externalBankDocument();
	return mergeLayers(await bundledDocument(), fileDoc, remoteDoc, userDoc, storedDoc, bankDoc);
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1712-1739](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/lib/index.js#L1712-L1739)

正文与ETag和304路径。

<details>
<summary>查看原文（28行）</summary>

```text
function createServeConfig(getSettingsApi) {
	return async function serveConfig(req, res) {
		if (req.method === "GET" || req.method === "HEAD") {
			if (!isTrustedRead(req)) {
				rejectUntrusted(res, "读取");
				return;
			}
			const doc = await effectiveConfigDocument(getSettingsApi);
			if (doc === null) {
				res.writeHead(404);
				res.end();
				return;
			}
			const text = documentText(doc);
			const etag = etagFor(text);
			// 客户端带着上次的 ETag 来问时,没变就 304 —— 轮询兜底路径也就不必再传整个 body
			const inm = String(req.headers["if-none-match"] || "").trim();
			if (inm.length > 0 && inm === etag) {
				res.writeHead(304, { "cache-control": "no-cache", [ETAG_HEADER]: etag });
				res.end();
				return;
			}
			res.writeHead(200, {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "no-cache",
				[ETAG_HEADER]: etag
			});
			res.end(text);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1195-1214](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/lib/index.js#L1195-L1214)

用户配置原子文件替换。

<details>
<summary>查看原文（20行）</summary>

```text
/** 原子写用户配置存储(先写同目录临时文件再 rename);写不进去就抛,由调用方决定怎么报错 */
async function writeUserConfigDocument(doc) {
	const path = userConfigPath();
	await mkdir(dirname(path), { recursive: true });
	const tmpPath = `${path}.tmp-${process.pid}-${Date.now()}`;
	try {
		await writeFile(tmpPath, JSON.stringify(doc, null, 4) + "\n", "utf8");
		await rename(tmpPath, path);
	} catch (error) {
		try {
			await unlink(tmpPath);
		} catch (cleanupError) {
			if (cleanupError.code !== "ENOENT") throw cleanupError;
		}
		throw error;
	}
	// 写盘后就地更新缓存(mtimeNs 置空 → 下一次读会重新 stat,拿到的仍是盘上的真实内容)
	userConfigCache = { path, mtimeNs: null, size: -1, text: null, doc, reloads: userConfigCache.path === path ? userConfigCache.reloads + 1 : 1, error: null };
}

```

</details>

**依据 4 · 源码核查**：[lib/client.js:5200-5255](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/lib/client.js#L5200-L5255)

重扫与DOM观测接线。

<details>
<summary>查看原文（56行）</summary>

```text
				// 会话/输入框座位重渲染可能把那行状态行一起换掉:清掉失效的再重扫重建
				for (const line of Array.from(lineButtons.keys())) {
					if (!line.isConnected) releaseStatusLine(line);
				}
				scanTurnProcess(document.body);
				scanRunningRows(document.body);
				pruneWatchedButtons();
				// 实时引擎兜底:服务或「当前会话」可能晚于插件就绪(0.1.7 的 sessions
				// 服务就常晚一拍),或用户在会话间切换 —— 每 2 秒重新接一次线
				try {
					wireLiveEngine();
					syncCurrentSession();
				} catch (error) { /* ignore */ }
				// 窗口尺寸变化后重新判断是否溢出(2 秒一次,开销可忽略);
				// 同时兜底同步一次 0.1.7 宿主的时长/回合状态(正常路径由按钮观察器触发)
				for (const el of adopted) {
					if (!el.isConnected) continue;
					if (lineButtons.has(el)) syncTurnProcessLine(el);
					syncTruncation(el);
				}
				// 宿主遮罩兜底:只切样式(不增删节点)的显隐不会触发 mutation,2 秒查一次
				syncDanmakuMask();
			};

			const observer = new MutationObserver((records) => {
				// A replaced icon can be deep inside an already-adopted row. Scanning
				// just the added icon misses its ancestor; recover immediately on its row.
				for (const record of records) {
					const target = record.target instanceof Element ? record.target : record.target.parentElement;
					const row = target && target.closest(RUNNING_ROW_SELECTOR);
					if (row && runningLines.has(row)) syncRunningRow(row);
				}
				for (const record of records) {
					// 深浅色主题切换(body[data-ds-dark-theme] 增删)→ 重算渐变 CSS 并刷新已接管元素
					if (record.type === "attributes" && record.attributeName === "data-conversation-session") {
						syncCurrentSession();
						continue;
					}
					if (record.type === "attributes" && record.attributeName === "data-ds-dark-theme") {
						updateStyle();
						for (const el of adopted) if (el.isConnected) { syncGradient(el); syncAppearance(el); }
						continue;
					}
					// 阶段变化:adopted 元素内部结构变化(时钟出现/移除)→ 立即换文案;
					// 自己 wrap 渐变 span 造成的新增要排除(防自我触发循环);
					// 但"span 被移除"(自己 unwrap 或 React 重渲染接管)必须刷新——
					// 否则 React 恢复的初始文案(Deep diving.../深度求索中...)
					// 会闪回并丢渐变/文案。
					if (record.type === "childList" && adopted.has(record.target)) {
						const selfAdded = [...record.addedNodes].some(
							(n) => n.nodeType === 1 && n.classList && n.classList.contains(TEXT_SPAN_CLASS)
						);
						if (!selfAdded) {
							refresh(record.target);
							updateTitle();
						}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 最可能削弱其独立价值的条件是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

最强质疑是它能否在宿主和其他美化插件变化后持续保留可靠状态语义。客户端明确使用 DOM 结构标记，并提供自己的白名单属性供其他样式放行；注释也指出这不是自愈机制，其他插件未配合时仍可能隐藏该行。无障碍公告、宿主时间与装饰短句应分别验收，不能把动画速度或短句当作模型真实进度。保存并发保护也只在携带 If-Match 时成立，旧脚本或无条件写入仍可能覆盖。该边界不是本轮复现故障，而是源码可识别的接口依赖。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:2959-3004](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/lib/client.js#L2959-L3004)

两代DOM结构和白名单接口，不能强制第三方样式配合。

<details>
<summary>查看原文（46行）</summary>

```text
			/** 0.1.7 宿主:回合折叠头 class 名带构建哈希,只能靠 data-turn-process 按钮定位 */
			const TURN_PROCESS_SELECTOR = "[data-turn-process]";
			/** 0.1.7 宿主:插件自己的时钟 span(内容 = 宿主时长文本原样搬过来) */
			const CLOCK_CLASS = "dsh-status-rotator-clock";
			/** 0.1.7 宿主:插件自己的状态行(dsh ≤0.1.6 的位置:输入框上方、对话下方) */
			const LINE_CLASS = "dsh-status-rotator-line";
			/**
			 * 行根节点的**公开标记**:第三方样式表按它放行这条线(issue #141)。
			 *
			 * 为什么需要:接管 0.2.0 的运行行时,这条线是 append 进宿主的
			 * `runningContent` —— 与「运行中」那一行同父母,所以别人写「除我之外全隐藏」
			 * 的规则(dsh-claude-style 0.13.2 就是:
			 * `[data-chat-running][data-dsh-claude-wait] > span >
			 *  :not([aria-hidden="true"]):not(.dsh-claude-chat-wait){display:none}`)
			 * 会连它一起 `display:none`。插件照旧轮换、读时长、推 SSE,**只是看不见**。
			 *
			 * 注意这不是自愈机制:别人的选择器不写 `:not(...)` 时,加属性不改变级联结果
			 * (scripts/issue-141-coexist-test.html 的 whitelist 场景量的就是这件事)。
			 * 它的作用是给消费方一个**稳定的白名单口** —— 以前唯一的白名单口是
			 * `aria-hidden="true"`,但一条可见的文字行打上它会丢读屏,不适合当公开契约。
			 * 消费方写法(二选一,值恒为 "";`.dsh-status-rotator-line` 就是下面的
			 * LINE_CLASS,它同时充当公开别名,不再另立新类名):
			 *   [data-chat-running] > span > :not([data-dsh-status-rotator-line]) { … }
			 *   [data-chat-running] > span > :not(.dsh-status-rotator-line) { … }
			 * 反向亦然:要让位给这条线时,可以直接选中这两个标记。
			 */
			const LINE_MARKER_ATTR = "data-dsh-status-rotator-line";
			/** 观测徽标(重试 / 降级等结构化信号):挂在时钟后面,两代宿主都渲染 */
			const BADGE_CLASS = "dsh-status-rotator-badge";

			/**
			 * dsh 0.2.0 起,「运行中」不再是折叠头按钮里的一段文本,而是会话流里独立的一行:
			 *   div[data-chat-running]
			 *     ├─ span(visuallyHidden, role=status, aria-live=polite)  ← 读屏公告,别动
			 *     ├─ span(class*=runningDivider)
			 *     └─ span(class*=runningContent)
			 *          ├─ span(class*=runningIcon)   ← **鲸鱼尾巴**(svg,stroke=currentColor)
			 *          └─ span(class*=runningText)   ← shimmer 文案("Deep diving for 12s")
			 * 折叠头按钮(button[data-turn-process])在 0.2.0 只在**回合结束后**才渲染(收起态摘要),
			 * 所以运行期间插件必须认得这一行,否则整条状态行都不会被接管(0.2.0 兼容的核心)。
			 */
			const RUNNING_ROW_SELECTOR = "[data-chat-running]";
			const RUNNING_TEXT_SELECTOR = '[class*="runningText"]';
			const RUNNING_ICON_SELECTOR = '[class*="runningIcon"]';
			/** 插件给宿主鲸鱼尾巴加的类:样式表据此给它上炫彩流光 */
			const TAIL_CLASS = "dsh-status-rotator-whale-tail";
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1784-1801](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/lib/index.js#L1784-L1801)

If-Match是自愿前提，无头写入仍无条件覆盖。

<details>
<summary>查看原文（18行）</summary>

```text

	// ── If-Match 前提校验(必须在任何写入之前) ──
	// 语义按标准 HTTP:前提是**客户端自愿**的。
	//   缺省 / `*` → 无条件写(后写覆盖)。这是既有写入方(手写脚本、老设置页)一直以来的行为,
	//                 不做静默变更 —— 它们照样能用,只是拿不到并发保护;
	//   带了且不匹配 → 409:两端基于同一份旧配置先后写入时,后到的这次被明确拒绝。
	// 本插件的设置页**始终**带 If-Match,所以「两个标签页互相覆盖」那条路已经堵上。
	const ifMatch = String(req.headers["if-match"] || "").trim();
	if (ifMatch.length > 0 && ifMatch !== "*") {
		const current = await currentConfigEtag(getSettingsApi);
		if (ifMatch !== current) {
			res.writeHead(409, { "content-type": "application/json; charset=utf-8", [ETAG_HEADER]: current || "" });
			res.end(JSON.stringify({ ok: false, code: "conflict", etag: current, error: "配置在别处已经变更,这次写入已拒绝 —— 重读后再保存" }));
			return;
		}
	}

	const s = await getSettingsApi();
```

</details>

#### 缺口

- 多插件组合、读屏与长回合资源开销未实际验证
  **影响**：无法确认个人装饰没有破坏状态可理解性
  **进一步探讨**：在隔离profile按宿主版本与美化组合检查原生时间、读屏公告、禁用恢复和资源占用

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 用户为动态内容与保存需要承担哪些依赖和恢复成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

主要条件是兼容的 DSH 客户端、配置服务路由和可写的用户存储。远端词库默认经 CDN 从 main 拉取，每六小时更新，属于持续内容依赖而非固定发布内容；拉取限制体积、做结构检查、只保留词库字段，失败保留最后成功版本。需要稳定复现的人应冻结或关闭远端更新。配置写接口校验 JSON、来源与浏览器请求信号，但注释保留 DNS rebinding 与外网暴露边界，不能视作认证服务。成本主要是配置/兼容排查、DOM观察与动画资源、热更新网络和个人文案维护；没有实际金额和耗时数据。失败时应先保留用户存储、关闭更新或装饰，再核对是否由宿主结构变化引起，避免直接覆盖配置。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:90-95](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/lib/index.js#L90-L95)

默认远端来源和周期。

```text
const DEFAULT_BANK_URL = "https://cdn.jsdelivr.net/gh/01Virex/dsh-status-rotator@main/config.example.json";
/** 自动更新检查间隔(毫秒);未设置 = 6 小时,0 / 非法 = 关闭 */
const BANK_INTERVAL_ENV = "DSH_STATUS_ROTATOR_BANK_INTERVAL_MS";
const DEFAULT_BANK_INTERVAL_MS = 6 * 60 * 60 * 1000;
/** 上游词库的落盘缓存文件名(放在本地词库文件同目录,用户不用手改) */
const BANK_REMOTE_FILE = "bank.remote.json";
```

**依据 2 · 源码核查**：[lib/index.js:857-915](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/lib/index.js#L857-L915)

远端更新、校验、原子写盘和失败保留。

<details>
<summary>查看原文（59行）</summary>

```text
 * 拉一次上游词库:结构校验 → 只留 packs / phrases → 与当前缓存比对,变了才原子写盘,
 * 并立刻在内存里生效(下一次 GET 就能读到,不需要重启、不需要重装包)。任何失败都只
 * 记录状态并保留上一次成功的词库 —— 离线 / CDN 挂掉不影响插件运行。
 */
async function refreshRemoteBank() {
	const url = remoteBankUrl();
	if (!url) return { ok: false, skipped: "disabled" };
	if (remoteBankUpdate.inFlight) return { ok: false, skipped: "in-flight" };
	if (typeof fetch !== "function") {
		remoteBankUpdate.lastCheckAt = Date.now();
		remoteBankUpdate.lastError = "当前运行时没有全局 fetch";
		return { ok: false, error: remoteBankUpdate.lastError };
	}
	remoteBankUpdate.inFlight = true;
	remoteBankUpdate.lastCheckAt = Date.now();
	try {
		const response = await fetch(url, {
			redirect: "follow",
			signal: AbortSignal.timeout(15000),
			headers: { accept: "application/json", "user-agent": "dsh-status-rotator" }
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		const text = await response.text();
		if (Buffer.byteLength(text, "utf8") > MAX_BANK_BYTES) throw new Error("上游词库超过 2 MiB,已忽略");
		const doc = phraseOnlyDocument(validateConfigDocument(JSON.parse(text)));
		if (doc.packs === undefined && doc.phrases === undefined) throw new Error("上游词库为空");
		const current = await remoteBankDocument();
		let updated = false;
		if (current === null || !deepEqualJson(current, doc)) {
			const path = remoteBankPath();
			await mkdir(dirname(path), { recursive: true });
			const tmpPath = `${path}.tmp-${process.pid}-${Date.now()}`;
			const serialized = JSON.stringify(doc, null, 4) + "\n";
			try {
				await writeFile(tmpPath, serialized, "utf8");
				await rename(tmpPath, path);
			} catch (error) {
				try {
					await unlink(tmpPath);
				} catch (cleanupError) {
					if (cleanupError.code !== "ENOENT") throw cleanupError;
				}
				throw error;
			}
			const kept = remoteBankCache.path === path ? remoteBankCache : null;
			remoteBankCache = { path, mtimeNs: null, size: -1, text: serialized, doc, reloads: (kept ? kept.reloads : 0) + 1, error: null };
			remoteBankUpdate.updates++;
			updated = true;
		}
		remoteBankUpdate.lastSuccessAt = Date.now();
		remoteBankUpdate.lastError = null;
		return { ok: true, updated };
	} catch (error) {
		remoteBankUpdate.lastError = String((error && error.message) || error);
		return { ok: false, error: remoteBankUpdate.lastError };
	} finally {
		remoteBankUpdate.inFlight = false;
	}
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:626-650](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/lib/index.js#L626-L650)

请求栅栏及剩余网络边界。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * 写请求栅栏:
 *   - content-type 必须是 application/json —— 跨域带这个头必然触发预检,
 *     CORS 下预检失败,恶意页面只能发 text/plain 之类的简单请求,直接拒掉;
 *   - sec-fetch-site(浏览器自己带、页面无法伪造)只接受 same-origin / none;
 *   - 带 Origin 时必须同源(非 GET 请求即使同源也会带 Origin)。
 * 残余风险:DNS rebinding 在浏览器视角是 same-origin,拦不住;端口只监听
 * 回环地址时风险可控,若要暴露到局域网,请自行加反向代理鉴权。
 */
function isTrustedWrite(req) {
	const headers = (req && req.headers) || {};
	const type = String(headers["content-type"] || "").toLowerCase();
	if (!type.startsWith("application/json")) return false;
	const site = String(headers["sec-fetch-site"] || "").toLowerCase();
	if (site && site !== "same-origin" && site !== "none") return false;
	return originMatchesHost(headers.origin, headers.host);
}

/** 读请求栅栏:挡掉跨站读取(简单请求即可读,不需要 cookie) */
function isTrustedRead(req) {
	const headers = (req && req.headers) || {};
	if (String(headers["sec-fetch-site"] || "").toLowerCase() === "cross-site") return false;
	return originMatchesHost(headers.origin, headers.host);
}

```

</details>

#### 缺口

- 动画/观测器真实资源与配置迁移耗时未知
  **影响**：总采用成本无法量化
  **进一步探讨**：记录同任务开启前后的CPU、内存、配置修复时间和失败次数

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些工程安排值得复用，未来怎样检验更稳定的状态适配？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

值得复用的是把内容来源分层、用户差异放到包外、使用 ETag 在保存前检测陈旧写入，并将路由/事件/观察器清理挂到宿主 effect 生命周期。其代价是多层合成与前后端状态同步复杂，必须检查外部词库的所有权和老客户端兼容。由 DOM 接管的脆弱边界可推导未验证假设：将宿主状态数据与呈现插槽作为稳定适配层，可能减少每次UI结构变化后的修补。最小验证以当前DOM方案作对照，固定两代宿主及一项第三方主题，比较显示正确率、读屏保留、修复代码量和后台开销；若稳定层仍需同等DOM补丁或不减少错误，则否定其维护优势。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1784-1801](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/lib/index.js#L1784-L1801)

显式并发前提机制。

<details>
<summary>查看原文（18行）</summary>

```text

	// ── If-Match 前提校验(必须在任何写入之前) ──
	// 语义按标准 HTTP:前提是**客户端自愿**的。
	//   缺省 / `*` → 无条件写(后写覆盖)。这是既有写入方(手写脚本、老设置页)一直以来的行为,
	//                 不做静默变更 —— 它们照样能用,只是拿不到并发保护;
	//   带了且不匹配 → 409:两端基于同一份旧配置先后写入时,后到的这次被明确拒绝。
	// 本插件的设置页**始终**带 If-Match,所以「两个标签页互相覆盖」那条路已经堵上。
	const ifMatch = String(req.headers["if-match"] || "").trim();
	if (ifMatch.length > 0 && ifMatch !== "*") {
		const current = await currentConfigEtag(getSettingsApi);
		if (ifMatch !== current) {
			res.writeHead(409, { "content-type": "application/json; charset=utf-8", [ETAG_HEADER]: current || "" });
			res.end(JSON.stringify({ ok: false, code: "conflict", etag: current, error: "配置在别处已经变更,这次写入已拒绝 —— 重读后再保存" }));
			return;
		}
	}

	const s = await getSettingsApi();
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1930-1988](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/lib/index.js#L1930-L1988)

服务端effect与路由清理。

<details>
<summary>查看原文（59行）</summary>

```text
	 * webServer 同样可能晚于插件激活(inject=[] 不等待依赖,加载器不推迟激活):
	 * 轮询等待其就绪后注册路由(500ms × 20 次);headless 宿主等不到就静默结束,
	 * 插件保持激活(回应 DSH Testkit 生命周期检查发现)。
	 * 路由 disposer 与轮询定时器都挂在 effect 清理里,卸载不留残留。
	 */
	/**
	 * 自动更新:定时拉上游词库(默认 6 小时;DSH_STATUS_ROTATOR_BANK_INTERVAL_MS=0
	 * 或 DSH_STATUS_ROTATOR_BANK_URL=off 可关闭)。拉取、校验、写盘都在后台,
	 * 失败只记录状态,永远不影响正在服务的词库。
	 */
	ctx.effect(() => startRemoteBankUpdater(), "status-rotator: remote bank updater");

	ctx.effect(() => {
		const handler = createServeConfig(getSettingsApi);
		// SSE 事件路由(独立的 exact path)与事件路由自己的 disposer
		const eventsHandler = createEventsRoute(getSettingsApi);
		let attempts = 0;
		let routeDisposer = null;
		let eventsDisposer = null;
		let timer = null;
		let changeTimer = null;
		/** 本地变更检测 —— 手改的 config.json、上游词库更新也就能推出去,而不只是设置页保存 */
		const tick = async () => {
			try { await broadcastIfChanged(getSettingsApi, "file"); } catch (error) { /* 单拍失败不影响下一拍 */ }
		};
		const registerNow = () => {
			let ws = null;
			try {
				ws = typeof ctx.get === "function" ? ctx.get("webServer") : null;
			} catch (error) { /* ignore */ }
			if (!ws) {
				try { ws = ctx.webServer || null; } catch (error) { /* ignore */ }
			}
			if (!ws || typeof ws.register !== "function") return false;
			routeDisposer = ws.register({
				kind: "exact",
				path: "/plugins/dsh-status-rotator/config.json",
				handler
			});
			// 事件路由注册失败(比如宿主版本不支持长连接)不算致命:轮询兜底仍然可用
			try {
				eventsDisposer = ws.register({ kind: "exact", path: EVENTS_PATH, handler: eventsHandler });
			} catch (error) {
				eventsDisposer = null;
			}
			// 事件路由一就位就起变更检测(注册失败则不起,免得白跑)
			if (eventsDisposer && changeTimer === null) {
				changeTimer = setInterval(tick, CHANGE_TICK_MS);
			}
			return true;
		};
		if (registerNow()) {
			// 正常路径也要把路由 disposer 交回去:否则插件重载/二次 apply 时
			// 宿主对重复 path 抛 duplicate exact route,激活直接失败。
			return () => {
				if (routeDisposer) {
					try { routeDisposer(); } catch (error) { /* ignore */ }
				}
				if (eventsDisposer) {
```

</details>

**依据 3 · 源码核查**：[lib/client.js:6469-6508](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/lib/client.js#L6469-L6508)

客户端观察器/事件/定时器回收。

<details>
<summary>查看原文（40行）</summary>

```text
			// dsh 的 ctx.effect 会「立即执行」回调,并把回调的「返回值」当作卸载时的
			// 清理函数注册。因此清理逻辑必须包在返回的函数里,否则 apply 一结束
			// 观察器和定时器就被立刻拆掉,文本替换永远不会生效。
			ctx.effect(() => {
				return () => {
					unsubscribe();
					document.removeEventListener("visibilitychange", onVisibility);
					window.removeEventListener("pageshow", onPageShow);
					document.removeEventListener("pointermove", onDanmakuPointerMove);
					observer.disconnect();
					sourceObserver.disconnect();
					if (timer !== null) clearInterval(timer);
					if (rescanner !== null) clearInterval(rescanner);
					if (reloadTimer !== null) clearInterval(reloadTimer);
					closeEventStream();
					if (titleTimer !== null) clearInterval(titleTimer);
					if (titleLiveTimer !== null) clearInterval(titleLiveTimer);
					if (scheduleTimer !== null) clearInterval(scheduleTimer);
					if (liveEngineTimer !== null) clearInterval(liveEngineTimer);
					if (liveSessionUnsub) { try { liveSessionUnsub(); } catch (error) { /* ignore */ } }
					if (liveEventsUnsub) { try { liveEventsUnsub(); } catch (error) { /* ignore */ } }
					liveEventsGeneration++;
					clearPendingToolSwitch(true);
					whaleTailPlaybackByRow.clear();
					toolMotionListeners.clear();
					if (liveListUnsub) { try { liveListUnsub(); } catch (error) { /* ignore */ } }
					if (pendingUnsub) { try { pendingUnsub(); } catch (error) { /* ignore */ } }
					for (const state of typists.values()) {
						if (state.timer !== null) clearInterval(state.timer);
					}
					for (const live of liveTimers.values()) clearInterval(live);
					if (danmakuMaskProbeTimer !== null) {
						clearTimeout(danmakuMaskProbeTimer);
						danmakuMaskProbeTimer = null;
					}
					// 卸载时只交还「我们自己写上去的」标题;没持有过就别碰(见 updateTitle)
					if (titleOwned) {
						titleOwned = false;
						if (origTitle && document.title !== origTitle) document.title = origTitle;
					}
```

</details>

**依据 4 · 源码核查**：[lib/client.js:2959-3004](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/lib/client.js#L2959-L3004)

稳定适配层假设来自现有DOM耦合。

<details>
<summary>查看原文（46行）</summary>

```text
			/** 0.1.7 宿主:回合折叠头 class 名带构建哈希,只能靠 data-turn-process 按钮定位 */
			const TURN_PROCESS_SELECTOR = "[data-turn-process]";
			/** 0.1.7 宿主:插件自己的时钟 span(内容 = 宿主时长文本原样搬过来) */
			const CLOCK_CLASS = "dsh-status-rotator-clock";
			/** 0.1.7 宿主:插件自己的状态行(dsh ≤0.1.6 的位置:输入框上方、对话下方) */
			const LINE_CLASS = "dsh-status-rotator-line";
			/**
			 * 行根节点的**公开标记**:第三方样式表按它放行这条线(issue #141)。
			 *
			 * 为什么需要:接管 0.2.0 的运行行时,这条线是 append 进宿主的
			 * `runningContent` —— 与「运行中」那一行同父母,所以别人写「除我之外全隐藏」
			 * 的规则(dsh-claude-style 0.13.2 就是:
			 * `[data-chat-running][data-dsh-claude-wait] > span >
			 *  :not([aria-hidden="true"]):not(.dsh-claude-chat-wait){display:none}`)
			 * 会连它一起 `display:none`。插件照旧轮换、读时长、推 SSE,**只是看不见**。
			 *
			 * 注意这不是自愈机制:别人的选择器不写 `:not(...)` 时,加属性不改变级联结果
			 * (scripts/issue-141-coexist-test.html 的 whitelist 场景量的就是这件事)。
			 * 它的作用是给消费方一个**稳定的白名单口** —— 以前唯一的白名单口是
			 * `aria-hidden="true"`,但一条可见的文字行打上它会丢读屏,不适合当公开契约。
			 * 消费方写法(二选一,值恒为 "";`.dsh-status-rotator-line` 就是下面的
			 * LINE_CLASS,它同时充当公开别名,不再另立新类名):
			 *   [data-chat-running] > span > :not([data-dsh-status-rotator-line]) { … }
			 *   [data-chat-running] > span > :not(.dsh-status-rotator-line) { … }
			 * 反向亦然:要让位给这条线时,可以直接选中这两个标记。
			 */
			const LINE_MARKER_ATTR = "data-dsh-status-rotator-line";
			/** 观测徽标(重试 / 降级等结构化信号):挂在时钟后面,两代宿主都渲染 */
			const BADGE_CLASS = "dsh-status-rotator-badge";

			/**
			 * dsh 0.2.0 起,「运行中」不再是折叠头按钮里的一段文本,而是会话流里独立的一行:
			 *   div[data-chat-running]
			 *     ├─ span(visuallyHidden, role=status, aria-live=polite)  ← 读屏公告,别动
			 *     ├─ span(class*=runningDivider)
			 *     └─ span(class*=runningContent)
			 *          ├─ span(class*=runningIcon)   ← **鲸鱼尾巴**(svg,stroke=currentColor)
			 *          └─ span(class*=runningText)   ← shimmer 文案("Deep diving for 12s")
			 * 折叠头按钮(button[data-turn-process])在 0.2.0 只在**回合结束后**才渲染(收起态摘要),
			 * 所以运行期间插件必须认得这一行,否则整条状态行都不会被接管(0.2.0 兼容的核心)。
			 */
			const RUNNING_ROW_SELECTOR = "[data-chat-running]";
			const RUNNING_TEXT_SELECTOR = '[class*="runningText"]';
			const RUNNING_ICON_SELECTOR = '[class*="runningIcon"]';
			/** 插件给宿主鲸鱼尾巴加的类:样式表据此给它上炫彩流光 */
			const TAIL_CLASS = "dsh-status-rotator-whale-tail";
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些用户值得先试用，何时停止？

**研究主题**：采用判断

#### 完整回答

建议试用，限定为希望个性化等待区并能接受兼容维护的人。先在独立 profile 关闭远端词库与非必要动画，只验证自定义文案、宿主时间、读屏公告和保存重启，再逐项开启外观。成功标准是显示符合个人需要、跨重启设置不丢、长回合不中断且禁用可回到原生；如果与主题冲突、语义变混乱或资源增长超过个人可接受范围，应禁用并保留配置供排查。它没有同版本真实宿主验收，不能提升为持续安装结论；不关心视觉定制的人直接使用原生状态即可。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:49-94](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/README.md#L49-L94)

作者给出的安装、重启和设置入口。

<details>
<summary>查看原文（46行）</summary>

````text
## Installation

Install from npm through the Desktop plugin manager, or use `dsh plugin add` for Web. Restart the corresponding host after the first install.

### Desktop npm walkthrough

DSH Desktop can install directly from npm without cloning this repository. The screenshots below show **DSH Desktop 0.2.0-rc.2** with a Chinese interface; layouts may differ between host versions.

1. Open DSH Desktop, select **Plugins** (插件) in the sidebar, then click **Add plugin** (添加插件) at the top right.

2. Enter this in the **Package name or address** (包名或地址) field:

   ```text
   dsh-status-rotator
   ```

   Choose an **Install source** (安装源) suitable for your network. The screenshot uses the Mainland China mirror. Click **Install** (安装); Desktop downloads the npm package and registers the plugin.

   ![Add plugin dialog with dsh-status-rotator entered, the Mainland China mirror selected and the Install button available.](https://raw.githubusercontent.com/A7m0spHere/dsh-status-rotator/b5c1634e99eb810d8c7c00c2506fee8dad7bca43/assets/readme/desktop-npm-install.png)

3. Wait for installation to finish. Find `dsh-status-rotator` under **Installed** (已安装) and confirm that its enable switch is on. Follow any restart prompt; if the settings page has not appeared, fully exit Desktop, including its tray process, and reopen it.

4. Open the account menu at the bottom left, then **Settings → Status Texts** (设置 → 状态文案). Choose packs or edit phrases. For tail motion, enable **Keep the whale tail** and **Tail motion** under **Appearance → Whale tail**. Settings save automatically; start a new turn to see the status line.

<details>
<summary>Install the npm package from the command line</summary>

```bash
dsh plugin --profile desktop add dsh-status-rotator
```

Restart DSH Desktop afterward. Desktop uses the `desktop` profile; if your terminal cannot find `dsh`, use the Desktop installation dialog above.

</details>

### Quick start

For Web, run:

```bash
dsh plugin --profile web add dsh-status-rotator
```

Restart `dsh web`, then open **Settings → Status Texts** and start a turn. For Desktop, use the npm walkthrough above or its command-line alternative. Later settings changes save and apply automatically; restart the corresponding host after upgrading plugin code.

The whale tail and tail motion start off; enable them under **Appearance → Whale tail**. Danmaku starts on and can be disabled under **Appearance → Danmaku**.
````

</details>

**依据 2 · 源码核查**：[lib/client.js:6469-6508](https://github.com/01Virex/dsh-status-rotator/blob/ae83fc850c30e78b429a44865f5016b2ef26b08b/lib/client.js#L6469-L6508)

存在清理路径，仍需实际验收恢复。

<details>
<summary>查看原文（40行）</summary>

```text
			// dsh 的 ctx.effect 会「立即执行」回调,并把回调的「返回值」当作卸载时的
			// 清理函数注册。因此清理逻辑必须包在返回的函数里,否则 apply 一结束
			// 观察器和定时器就被立刻拆掉,文本替换永远不会生效。
			ctx.effect(() => {
				return () => {
					unsubscribe();
					document.removeEventListener("visibilitychange", onVisibility);
					window.removeEventListener("pageshow", onPageShow);
					document.removeEventListener("pointermove", onDanmakuPointerMove);
					observer.disconnect();
					sourceObserver.disconnect();
					if (timer !== null) clearInterval(timer);
					if (rescanner !== null) clearInterval(rescanner);
					if (reloadTimer !== null) clearInterval(reloadTimer);
					closeEventStream();
					if (titleTimer !== null) clearInterval(titleTimer);
					if (titleLiveTimer !== null) clearInterval(titleLiveTimer);
					if (scheduleTimer !== null) clearInterval(scheduleTimer);
					if (liveEngineTimer !== null) clearInterval(liveEngineTimer);
					if (liveSessionUnsub) { try { liveSessionUnsub(); } catch (error) { /* ignore */ } }
					if (liveEventsUnsub) { try { liveEventsUnsub(); } catch (error) { /* ignore */ } }
					liveEventsGeneration++;
					clearPendingToolSwitch(true);
					whaleTailPlaybackByRow.clear();
					toolMotionListeners.clear();
					if (liveListUnsub) { try { liveListUnsub(); } catch (error) { /* ignore */ } }
					if (pendingUnsub) { try { pendingUnsub(); } catch (error) { /* ignore */ } }
					for (const state of typists.values()) {
						if (state.timer !== null) clearInterval(state.timer);
					}
					for (const live of liveTimers.values()) clearInterval(live);
					if (danmakuMaskProbeTimer !== null) {
						clearTimeout(danmakuMaskProbeTimer);
						danmakuMaskProbeTimer = null;
					}
					// 卸载时只交还「我们自己写上去的」标题;没持有过就别碰(见 updateTitle)
					if (titleOwned) {
						titleOwned = false;
						if (origTitle && document.title !== origTitle) document.title = origTitle;
					}
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
