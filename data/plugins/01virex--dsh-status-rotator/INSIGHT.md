# dsh-status-rotator

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[bce5811](https://github.com/01Virex/dsh-status-rotator/tree/bce58114d40a9db9d5ca51a3d1450889d36a67e0)

<!-- BEGIN META -->
[![GitHub ★ 203](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=203&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 10,169](https://img.shields.io/static/v1?label=npm+30d&message=10%2C169&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)
<!-- END META -->

> **实现功能**：为 DSH 运行状态提供轮换文案、主题、弹幕与鲸尾动画，并保存词库与配置。

> **核心亮点**：相对手改宿主文案，贡献在升级独立配置与条件词库形成的可维护定制入口，不能把动画或词条数量当生产率收益。[Q01](#research-q01)

> **风险与缺陷**：状态 DOM 与选择器是实际兼容契约，复杂观察器、动画及周期扫描可能增加浏览器负担；持久配置改善不证明新宿主上仍准确识别运行状态。[Q03](#research-q03)

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
  - [Q01 · 定制状态相对保留原生显示增加什么？](#detail-section-11)
  - [Q02 · 配置、词库和客户端如何连接？](#detail-section-12)
  - [Q03 · DOM接管能否保持原生语义和资源可控？](#detail-section-13)
  - [Q04 · 什么条件下值得承担采用和恢复成本？](#detail-section-14)
  - [Q05 · 事件适配层能否减少DOM扫描？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合经常等待长任务、希望区分运行阶段的 DSH Web 用户；合格结果是状态文案可读且原生进度仍可识别。

简单替代是保留原生状态行或用样式脚本换固定文本；二者维护面小，但缺少跨升级的配置存储和按运行阶段选择词库。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 阶段词库与主题 | 定制长任务状态 | 依赖宿主状态DOM，非业务进度证明 |
| 配置保存与热更新 | 升级后保留偏好 | 需可写用户目录，远程更新可关闭 |
| 弹幕与动画 | 个性化等待界面 | 资源消耗未测，可按需禁用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web 与匹配状态DOM | 展示必需 | 识别运行行并挂载控件 | 样式或定位可能失效 |
| 可写 DSH_HOME | 配置持久化必需 | 升级独立用户配置 | 保存失败需查目录权限 |
| 上游词库CDN | 自动更新可选 | 每6小时取词库 | 可关闭并使用内置词库 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户在profile加载插件并刷新页面 | 设置入口及状态行可见 |
| 2 | 用户选择词库和效果并保存 | 重启后配置保持 |
| 3 | 发起长任务后观察运行状态 | 与原生状态一致；异常先禁用动画并恢复原生 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 浏览器与配置存储；金额未知 | 安装、选择主题，耗时未知 | 需匹配宿主DOM |
| 持续使用 | 动画、观察器和轮询占用，未测 | 词库维护可选 | CDN更新可关闭 |
| 失败恢复 | 重载和排查资源，未测 | 核对用户配置、关闭插件 | 不将美化视作任务正确性来源 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 个性化状态 | 源码具备阶段条件与轮换 | 可读性、等待体验改善幅度 |
| 配置保留 | 数据目录与包镜像分离 | 用户实际升级恢复成功率 |

> **思考**：状态 DOM 与选择器是实际兼容契约，复杂观察器、动画及周期扫描可能增加浏览器负担；持久配置改善不证明新宿主上仍准确识别运行状态。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手改宿主文案，贡献在升级独立配置与条件词库形成的可维护定制入口，不能把动画或词条数量当生产率收益。[Q01](#research-q01)

相对手改宿主文案，贡献在升级独立配置与条件词库形成的可维护定制入口，不能把动画或词条数量当生产率收益。[Q01](#research-q01)

配置落位考虑包目录替换，并以内容指纹区分镜像和人工修改，适合借鉴到小型UI插件。条件键封闭校验能把拼写问题提前暴露。浏览器是大型单文件且绑定内部DOM，复用时应移植存储逻辑和事件适配边界，而非照搬选择器。

<a id="detail-section-5"></a>

### 1.4 主要限制

状态 DOM 与选择器是实际兼容契约，复杂观察器、动画及周期扫描可能增加浏览器负担；持久配置改善不证明新宿主上仍准确识别运行状态。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

可在独立profile试用，先关闭额外动画确认状态与保存正常；依赖稳定运行状态的工作应保留原生显示和禁用入口。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的设计解释，效果未独立验证；未来设计假设尚未实现或验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/client.js、SECURITY.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：已检查配置持久化、条件校验、浏览器注册和生命周期；未测新宿主DOM及长时动画资源曲线。
- 下一步：在隔离profile保存配置、升级、断网及长任务各做同一组检查，比较原生状态一致性和浏览器CPU；这里只提出核验设计，没有执行。

**分析版本**

- **仓库**：[01Virex/dsh-status-rotator](https://github.com/01Virex/dsh-status-rotator)
- **版本号**：0.37.0（[固定提交 bce5811](https://github.com/01Virex/dsh-status-rotator/tree/bce58114d40a9db9d5ca51a3d1450889d36a67e0)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把状态来源抽成宿主事件适配层，DOM 扫描只兜底，可减少误判和空扫；用相同长任务记录事件与DOM路径的状态延迟、漏判及主线程时间，若事件覆盖不足或负担未降则否定。[Q05](#research-q05)

在隔离profile保存配置、升级、断网及长任务各做同一组检查，比较原生状态一致性和浏览器CPU；这里只提出核验设计，没有执行。

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

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 22](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=22&color=grey&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+created%3A2026-09-23T01%3A49%3A27.270Z..2026-10-23T01%3A49%3A27.270Z) [![近30天关闭 22](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=22&color=grey&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T01%3A49%3A27.270Z..2026-10-23T01%3A49%3A27.270Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：01Virex/dsh-status-rotator 固定组件如何完成目标任务，贡献在何种边界成立，是否适合可控试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 定制状态相对保留原生显示增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标用户在长任务期间反复查看状态，交付是可持续维护的显示偏好，而非更快完成模型任务。作者的Node说明明确指出包替换导致配置丢失的背景，并把用户存储放到DSH_HOME。这个增量相对直接修改包内文案成立。界面装饰和词库丰富度属于体验选择，缺少对照不能推断专注度或工作产出改善。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:7-41](https://github.com/01Virex/dsh-status-rotator/blob/bce58114d40a9db9d5ca51a3d1450889d36a67e0/lib/index.js#L7-L41)

配置分层与包升级边界解释具体贡献来源。

<details>
<summary>查看原文（35行）</summary>

```text
 *   GET/HEAD /plugins/dsh-status-rotator/config.json
 *       → stream the effective document, layered as
 *         bundled config.example.json → package config.json → auto-updated phrase
 *         bank ($DSH_HOME/status-rotator/bank.remote.json) → legacy settings
 *         namespace (only on hosts whose settings service still exposes
 *         `register`) → **user config store**
 *         (`$DSH_HOME/status-rotator/config.json`, survives plugin upgrades;
 *         `DSH_STATUS_ROTATOR_CONFIG` overrides the path) → external phrase bank
 *         (`$DSH_HOME/status-rotator/phrases.json`, or
 *         `$DSH_STATUS_ROTATOR_BANK`; re-read whenever the file changes).
 *         Both banks only carry `packs` / `phrases`.
 *   PUT/POST  same route
 *       → validate the submitted JSON, persist the delta into the user config
 *         store (durable across upgrades) and mirror the full document to the
 *         package-local config.json for backward compatibility.
 *
 * Where settings actually live is the whole point of issue #51: the package
 * directory is replaced wholesale on every plugin upgrade, so anything stored
 * next to the package is gone afterwards. Host-side settings were the original
 * plan, but `@deepseek-ai/dsh-settings` 0.1.7-rc.1 only offers
 * `describe`/`update`/`replace`/`mutate` — the `register()` API this plugin was
 * written against no longer exists, so that path silently returned null and the
 * package-local config.json was the only store left. Persistence now lives in
 * the plugin's own data directory under `$DSH_HOME`, which no upgrade touches.
 *
 * On start-up (and on every GET, so a hand-edited file is picked up while it
 * still exists) the package-local config.json is absorbed into the user config
 * store, because that file is documented as editable and is otherwise lost with
 * the next upgrade. A content fingerprint recorded in the store tells our own
 * mirror apart from a human edit, so the mirror is never absorbed twice.
 *
 * The external bank is what makes a phrase update take effect without
 * republishing or reinstalling the npm package: edit that one file and the
 * node half serves the new content on the next request (the browser half
 * re-reads every `reloadIntervalMs` while the page stays open).
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配置、词库和客户端如何连接？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Node提供有效配置并将用户差量保存在独立目录，包内文件仅作为兼容镜像；默认上游是main分支经CDN提供的词库。浏览器取配置并用EventSource更新，不可用时保留轮询。when规则只接受固定键，防止无效条件静默吞掉。远端词库不是运行必需，关闭它能缩小网络依赖，但客户端仍需找到宿主状态行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:77-100](https://github.com/01Virex/dsh-status-rotator/blob/bce58114d40a9db9d5ca51a3d1450889d36a67e0/lib/index.js#L77-L100)

可写用户配置与远端更新的默认条件。

<details>
<summary>查看原文（24行）</summary>

```text
 * 用户配置的持久存储:**必须**和词库一样落在 `$DSH_HOME/status-rotator/` 下,
 * 不能落在包目录里 —— 包目录会被 npm / Release 升级整体替换,写在里面的配置每次升级
 * 都会没(issue #51「每次更新都会重置我设置的」的根因,详见 userConfigPath)。
 */
const USER_CONFIG_FILE = "config.json";
/** 覆盖用户配置存储路径的环境变量(绝对路径,或相对当前工作目录;测试用) */
const USER_CONFIG_ENV = "DSH_STATUS_ROTATOR_CONFIG";
/**
 * 自动更新(从上游拉取词库):默认源是仓库 main 分支的 config.example.json,
 * 走 jsDelivr CDN(国内可达性优于 raw.githubusercontent);可用环境变量覆盖成
 * raw / 镜像 / 自建地址,空或 off = 关闭。
 */
const BANK_URL_ENV = "DSH_STATUS_ROTATOR_BANK_URL";
const DEFAULT_BANK_URL = "https://cdn.jsdelivr.net/gh/01Virex/dsh-status-rotator@main/config.example.json";
/** 自动更新检查间隔(毫秒);未设置 = 6 小时,0 / 非法 = 关闭 */
const BANK_INTERVAL_ENV = "DSH_STATUS_ROTATOR_BANK_INTERVAL_MS";
const DEFAULT_BANK_INTERVAL_MS = 6 * 60 * 60 * 1000;
/** 上游词库的落盘缓存文件名(放在本地词库文件同目录,用户不用手改) */
const BANK_REMOTE_FILE = "bank.remote.json";
/** 单次拉取上限 2 MiB(正常 config.example.json 约 75 KB) */
const MAX_BANK_BYTES = 2 * 1024 * 1024;

/** 请求体上限(5 MiB),避免异常大 body 吃内存 */
const MAX_BODY_BYTES = 5 * 1024 * 1024;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:119-143](https://github.com/01Virex/dsh-status-rotator/blob/bce58114d40a9db9d5ca51a3d1450889d36a67e0/lib/index.js#L119-L143)

封闭条件校验。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * 校验一条 `when` 规则。这里**拒绝未知键**而不像 config 那样静默丢弃:
 * when 是一张小而封闭的词表,键名写错的结果是「这句永远不出现」——
 * 正是这个仓库一贯要避免的静默失败,不如在写盘前明确报错并指出路径。
 */
function assertWhen(value, pathLabel) {
	if (value === undefined) return;
	if (value === null || typeof value !== "object" || Array.isArray(value)) {
		throw new Error(`${pathLabel} 必须是对象`);
	}
	for (const key of Object.keys(value)) {
		if (WHEN_KEYS.indexOf(key) < 0) {
			throw new Error(`${pathLabel}.${key} 不是可用的条件(可用:${WHEN_KEYS.join(" / ")})`);
		}
	}
	if (value.tool !== undefined) {
		const okTool = (t) => typeof t === "string" && t.length > 0 && t.length <= 64;
		if (!okTool(value.tool) && !(Array.isArray(value.tool) && value.tool.length > 0 && value.tool.every(okTool))) {
			throw new Error(`${pathLabel}.tool 必须是非空字符串或非空字符串数组`);
		}
	}
	for (const key of ["retry", "firstTurn"]) {
		if (value[key] !== undefined && typeof value[key] !== "boolean") {
			throw new Error(`${pathLabel}.${key} 必须是布尔`);
		}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:5345-5383](https://github.com/01Virex/dsh-status-rotator/blob/bce58114d40a9db9d5ca51a3d1450889d36a67e0/lib/client.js#L5345-L5383)

SSE与轮询为配置传播链。

<details>
<summary>查看原文（39行）</summary>

```text
			 * 断线由 EventSource 自己重连,而服务端在每次连上时都会先推一条 hello(带当前 ETag),
			 * 所以断线期间错过的变更会在重连那一刻补上 —— 那一端不会停在一个没人再推的旧值上。
			 */
			let eventSource = null;
			let sseConnected = false;
			/** 轮询兜底定时器:只在「间隔 > 0」且「推送没连上」时跑 */
			const syncReloadTimer = () => {
				const want = config.reloadIntervalMs > 0 && !sseConnected;
				const current = reloadTimer === null ? null : activeReloadMs;
				if (want && current === config.reloadIntervalMs) return;
				if (reloadTimer !== null) { clearInterval(reloadTimer); reloadTimer = null; }
				activeReloadMs = config.reloadIntervalMs;
				if (want) reloadTimer = setInterval(loadExternal, config.reloadIntervalMs);
			};
			/** 推送说配置变了:立刻拉一次(带 If-None-Match,没变就是一次 304) */
			const onPushPayload = (payload) => {
				if (!payload || typeof payload !== "object") return;
				if (typeof payload.etag === "string" && payload.etag.length > 0 && payload.etag === configEtag) return;
				log("config push:", payload.type || "?", payload.reason || "");
				loadExternal();
			};
			const openEventStream = () => {
				if (eventSource !== null) return;
				if (typeof EventSource !== "function") { log("no EventSource in this host → polling fallback stays"); return; }
				try {
					eventSource = new EventSource(EVENTS_URL);
				} catch (error) {
					eventSource = null;
					return;
				}
				eventSource.addEventListener("open", () => {
					sseConnected = true;
					syncReloadTimer();
					log("config push channel connected; polling suspended");
				});
				eventSource.addEventListener("error", () => {
					// EventSource 会自己重连;这里只把轮询兜底放回去,别让页面停在一个不动的值上
					if (sseConnected) log("config push channel dropped → polling fallback resumed");
					sseConnected = false;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · DOM接管能否保持原生语义和资源可控？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

实现同时使用MutationObserver与2秒兜底重扫，说明宿主节点变化需要主动追踪，不能把成功注册等同正确状态。其配置持久化设计可复用，但浏览器对状态DOM、生命周期和大量定时器存在维护耦合。源码中清理路径提供正面支持；本轮没有运行浏览器，不能确认泄漏或卡顿，也不能断言跨宿主稳定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:5191-5237](https://github.com/01Virex/dsh-status-rotator/blob/bce58114d40a9db9d5ca51a3d1450889d36a67e0/lib/client.js#L5191-L5237)

重扫和观察器暴露维护边界。

<details>
<summary>查看原文（47行）</summary>

```text
			/** 兜底轮询:每 2 秒重扫一次(防止 MutationObserver 漏掉早期节点) */
			let lastSeenStatusCount = -1;
			const rescanAll = () => {
				const status = document.querySelectorAll('[role="status"][aria-live="polite"]');
				if (status.length !== lastSeenStatusCount) {
					lastSeenStatusCount = status.length;
					log("rescan: 状态标签 ×", status.length);
				}
				for (const el of status) adopt(el);
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
```

</details>

**依据 2 · 源码核查**：[lib/client.js:6495-6520](https://github.com/01Virex/dsh-status-rotator/blob/bce58114d40a9db9d5ca51a3d1450889d36a67e0/lib/client.js#L6495-L6520)

卸载清理为正面支持，未做运行复现。

<details>
<summary>查看原文（26行）</summary>

```text
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
					teardownDanmaku();
					for (const tail of Array.from(whaleTailMotionStates.keys())) stopWhaleTailMotion(tail);
					if (styleEl !== null && styleEl.isConnected) styleEl.remove();
					settingsPage.dispose();
					if (danmakuStyleEl !== null && danmakuStyleEl.isConnected) danmakuStyleEl.remove();
					if (whaleWagStyleEl !== null && whaleWagStyleEl.isConnected) whaleWagStyleEl.remove();
					whaleWagStyleEl = null;
					// 0.1.7 状态行:撤掉插件那行、把折叠头放出来
					for (const line of Array.from(lineButtons.keys())) releaseStatusLine(line);
					for (const el of adopted) {
						try {
							el.style.removeProperty("min-width");
```

</details>

#### 缺口

- 不同宿主状态节点与长时资源占用未测
  **影响**：限制持续采用的兼容和性能判断
  **进一步探讨**：对照原生运行同样的短、长、失败任务并采样状态及主线程时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么条件下值得承担采用和恢复成本？

**研究主题**：效果与总成本、采用判断

#### 完整回答

在视觉定制需求明确且可随时停用的profile中适合试用。没有模型调用节省的依据，主要代价来自首次调参、持续浏览器工作和宿主升级后的适配。用户应把配置保存到独立数据目录并核对重启保留；异常时先关闭动画或插件，再核对原生任务状态，避免把显示问题误认作模型问题。没有人工时间数据，不能称零成本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:23-45](https://github.com/01Virex/dsh-status-rotator/blob/bce58114d40a9db9d5ca51a3d1450889d36a67e0/lib/index.js#L23-L45)

独立存储与重启流程支撑恢复建议。

<details>
<summary>查看原文（23行）</summary>

```text
 * Where settings actually live is the whole point of issue #51: the package
 * directory is replaced wholesale on every plugin upgrade, so anything stored
 * next to the package is gone afterwards. Host-side settings were the original
 * plan, but `@deepseek-ai/dsh-settings` 0.1.7-rc.1 only offers
 * `describe`/`update`/`replace`/`mutate` — the `register()` API this plugin was
 * written against no longer exists, so that path silently returned null and the
 * package-local config.json was the only store left. Persistence now lives in
 * the plugin's own data directory under `$DSH_HOME`, which no upgrade touches.
 *
 * On start-up (and on every GET, so a hand-edited file is picked up while it
 * still exists) the package-local config.json is absorbed into the user config
 * store, because that file is documented as editable and is otherwise lost with
 * the next upgrade. A content fingerprint recorded in the store tells our own
 * mirror apart from a human edit, so the mirror is never absorbed twice.
 *
 * The external bank is what makes a phrase update take effect without
 * republishing or reinstalling the npm package: edit that one file and the
 * node half serves the new content on the next request (the browser half
 * re-reads every `reloadIntervalMs` while the page stays open).
 *
 * The browser half fetches that URL by default. No manual localStorage or
 * deployment step is needed — drop config.json next to this package, restart
 * `dsh web`, hard-refresh.
```

</details>

**依据 2 · 源码核查**：[lib/client.js:5420-5465](https://github.com/01Virex/dsh-status-rotator/blob/bce58114d40a9db9d5ca51a3d1450889d36a67e0/lib/client.js#L5420-L5465)

多类定时任务是持续资源成本来源。

<details>
<summary>查看原文（46行）</summary>

```text
				}
				if (!config.whaleTail || !config.whaleTailMotion.enabled || !config.whaleTailMotion.toolSwitchEnabled) clearPendingToolSwitch(true);
				if (!config.whaleTail || !config.whaleTailMotion.enabled) whaleTailPlaybackByRow.clear();
				if (config.intervalMs !== activeIntervalMs) {
					activeIntervalMs = config.intervalMs;
					if (timer !== null) clearInterval(timer);
					timer = setInterval(rotate, config.intervalMs);
				}
				// 间隔变化与推送通道的连接状态都由 syncReloadTimer 一处决定
				syncReloadTimer();
				const titleRaw = JSON.stringify(config.title ?? null);
				if (titleRaw !== lastTitleRaw) {
					lastTitleRaw = titleRaw;
					if (titleTimer !== null) clearInterval(titleTimer);
					if (titleLiveTimer !== null) clearInterval(titleLiveTimer);
					titleTimer = null;
					titleLiveTimer = null;
					const t = config.title;
					if (t && t.enabled && Array.isArray(t.templates) && t.templates.length > 0) {
						const iv = Number(t.intervalMs) > 0 ? Number(t.intervalMs) : 8000;
						titleTimer = setInterval(advanceTitle, iv);
					}
					// 标题含动态占位符({elapsed} 等)时按 liveTickMs 实时刷新
					if (t && t.enabled && config.liveTickMs > 0) {
						titleLiveTimer = setInterval(updateTitle, config.liveTickMs);
					}
					updateTitle();
				}
				const doc = effectiveDoc();
				const schedRaw = JSON.stringify(doc && doc.schedule ? doc.schedule : null);
				if (schedRaw !== lastScheduleRaw) {
					lastScheduleRaw = schedRaw;
					if (scheduleTimer !== null) clearInterval(scheduleTimer);
					scheduleTimer = doc && doc.schedule && doc.schedule.length > 0
						? setInterval(scheduleTick, 60000)
						: null;
				}
				// TPS motion needs its sampler even when text live refresh is disabled.
				const tailNeedsTps = config.whaleTail && config.whaleTailMotion && config.whaleTailMotion.enabled && config.whaleTailMotion.mode !== "fixed";
				const engineMs = tailNeedsTps ? 1000 : config.liveTickMs > 0 ? Math.max(500, config.liveTickMs) : 0;
				if (engineMs !== activeEngineMs) {
					activeEngineMs = engineMs;
					if (liveEngineTimer !== null) clearInterval(liveEngineTimer);
					liveEngineTimer = engineMs > 0 ? setInterval(engineTick, engineMs) : null;
				}
				// 弹幕:配置变化时重建层与发射定时器(和其他定时器一样按快照对比,不重复打断)
```

</details>

#### 缺口

- 缺少合格任务对照与资源测量
  **影响**：不能量化等待体验和节时收益
  **进一步探讨**：以状态误判、配置恢复、CPU与用户操作时间作同条件比较。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 事件适配层能否减少DOM扫描？

**研究主题**：新假设与验证

#### 完整回答

本次提出未验证的事件优先状态适配层。推导来自现有观察器和周期重扫对节点变化的补偿。新方案把可用宿主事件作为主输入，DOM只补齐事件缺失；状态和展示解耦后可分别测试。用同一profile和任务对照两条路径的阶段漏判、延迟及CPU；若事件不能覆盖运行、重试与结束，或资源收益抵不过适配复杂度，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:5191-5237](https://github.com/01Virex/dsh-status-rotator/blob/bce58114d40a9db9d5ca51a3d1450889d36a67e0/lib/client.js#L5191-L5237)

兜底扫描是提出替代机制的具体依据。

<details>
<summary>查看原文（47行）</summary>

```text
			/** 兜底轮询:每 2 秒重扫一次(防止 MutationObserver 漏掉早期节点) */
			let lastSeenStatusCount = -1;
			const rescanAll = () => {
				const status = document.querySelectorAll('[role="status"][aria-live="polite"]');
				if (status.length !== lastSeenStatusCount) {
					lastSeenStatusCount = status.length;
					log("rescan: 状态标签 ×", status.length);
				}
				for (const el of status) adopt(el);
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
```

</details>

#### 缺口

- 宿主事件覆盖和性能收益未知
  **影响**：假设尚不能作为当前能力
  **进一步探讨**：以小适配器验证覆盖后再考虑替换扫描。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
