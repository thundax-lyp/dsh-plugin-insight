# DSH 提示音

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[bb258df](https://github.com/BillCx330/dsh-plugin-notify-sounds/tree/bb258df3ddd25a02ddf9ba8ca4c04623436866a5)

<!-- BEGIN META -->
[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/BillCx330/dsh-plugin-notify-sounds) [![npm 30d 5,944](https://img.shields.io/static/v1?label=npm+30d&message=5%2C944&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-notify-sounds) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-notify-sounds)
<!-- END META -->

> **功能**：为 DeepSeek Harness 的审批、提问和任务完成播放提示音，并提供系统通知与静音设置。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 说明提醒利用会话状态区分审批、提问和完成，并可延迟多轮目标的中间提示。相比固定定时器，用户能根据触发类型安排是否回来。

> **主要限制**：[Q01](#research-q01) 的跨页去重依赖客户端能力，[Q02](#research-q02) 在目标状态未知时倾向仍提示，[Q03](#research-q03) 的本机回执也不代表窗口已唤起。

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
  - [Q01 · 哪些事件产生通知，何时可能重复或丢失？](#detail-section-11)
  - [Q02 · 目标任务什么时候才响？](#detail-section-12)
  - [Q03 · 通知如何回到用户视野，为什么有成功回执却没唤窗？](#detail-section-13)
  - [Q04 · 试用成本及退出是什么，怎样减少可确认的漏报？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：等待审批或任务结束时会切到其他窗口的 DSH 用户，可以用一个公开任务试验声音、通知到达和回到窗口。

用户原本定时打开 DSH 查看，或者使用操作系统自带提醒。若一直在看会话，本插件减少的回看步骤有限。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 事件提醒 | 在需要人处理时发声 | 按配置、领导页和后台条件投递 |
| 目标阶段 | 跳过目标连续中间轮部分提醒 | 依赖宿主投影 |
| 窗口唤起 | 试图把提醒点击送回 DSH | 受系统权限与焦点限制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web 客户端与会话状态 | 主要功能必需 | 观察审批或完成 | 无边沿可投递 |
| 浏览器音频或系统通知权限 | 对应输出必需 | 播放和显示 | 对应渠道可能静默 |
| Host 目标投影 | 仅最终轮功能适用 | 读取目标状态 | 退回更容易提示的行为 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 自己在插件设置试听内置音 | 辨认音量并核对通知权限 |
| 验收 | 离开窗口后触发公开审批和任务结束 | 分清提醒并定位原会话 |
| 退出 | 关闭声音、系统通知或停用插件 | 后续直接看会话状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 音频及客户端资源 | 确认设置和系统权限 | 用时未知 |
| 持续使用 | 后台监听、轮询和通知资源 | 检查误报与音量 | 节省时间和打扰成本未知 |
| 失败恢复 | 无现金数据 | 停用提醒并切回会话检查 | 后台重新投递情况因状态而异 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 识别事件 | 会话边沿与类型分支 | 实际漏报率 |
| 降低重复 | 跨页选举与已见记录 | 分区和多窗口竞争表现 |
| 唤窗 | 连接检查和分平台路径 | 真实操作系统权限与焦点结果 |

> **思考**：[Q01](#research-q01) 的跨页去重依赖客户端能力，[Q02](#research-q02) 在目标状态未知时倾向仍提示，[Q03](#research-q03) 的本机回执也不代表窗口已唤起。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 说明提醒利用会话状态区分审批、提问和完成，并可延迟多轮目标的中间提示。相比固定定时器，用户能根据触发类型安排是否回来。

[Q02](#research-q02) 区分页面和宿主投影，可在客户端没有打开目标会话时读取状态。[Q01](#research-q01) 状态与投递分离，便于选择是否加本地可确认记录。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 的跨页去重依赖客户端能力，[Q02](#research-q02) 在目标状态未知时倾向仍提示，[Q03](#research-q03) 的本机回执也不代表窗口已唤起。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用小任务检查提醒准确和点击返回。出现重复或无法唤窗时保留原会话入口。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可追踪审批、提问、完成和部分唤窗依赖。实际通知送达、操作系统窗口恢复与去重效果等待同版本对照。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、lib/client.js、lib/index.js、README.zh.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定宿主和浏览器代码，覆盖提醒调度、目标投影、窗口恢复与设置接线。未执行安装、平台通知、真实切窗、自定义音频和发布制品测试。
- 下一步：以两个浏览器窗口和真实桌面外壳分别录制会话转移、提示、点击及前台恢复，比较 [Q04](#research-q04) 的事件记录方案与现状。

**分析版本**

- **仓库**：[BillCx330/dsh-plugin-notify-sounds](https://github.com/BillCx330/dsh-plugin-notify-sounds)
- **版本号**：1.9.5（[固定提交 bb258df](https://github.com/BillCx330/dsh-plugin-notify-sounds/tree/bb258df3ddd25a02ddf9ba8ca4c04623436866a5)）
- **版本日期**：2026-11-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出用页面内的待确认事件记录补偿未送达的高优先级提醒，同时保留静音行为。用多窗口和人为关闭后台计时条件比较漏看与人为检查次数。

以两个浏览器窗口和真实桌面外壳分别录制会话转移、提示、点击及前台恢复，比较 [Q04](#research-q04) 的事件记录方案与现状。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 5060 | 2739 | 2118 | — |
| .md | source | 2 | 435 | — | — | 15891 |
| .mjs | test | 2 | 2679 | 2091 | 433 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/BillCx330/dsh-plugin-notify-sounds/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/BillCx330/dsh-plugin-notify-sounds/issues?q=is%3Aissue+created%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/BillCx330/dsh-plugin-notify-sounds/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z)



统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用户离开 DeepSeek Harness 窗口时，提醒能否准确区分待处理状态和目标完成，并让用户回到正确窗口？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些事件产生通知，何时可能重复或丢失？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

当开发者等待 DSH 审批、提问或完成而转去另一窗口时，原办法是定时切回查看。Bundle 挂载宿主与 Web 客户端，新页面先读会话快照，后续把 pendingInteraction 的变化与停止运行边沿作为提醒线索。决策和提问可重复提示，客户回到页面后标记已见，之后离开也不重新提醒。事件若在静音时段进入等待表，会标成静音并跳过之后的补发。普通警报还看主开关和可见性选项。页面用浏览器存储与 BroadcastChannel 选举一个发声者，存储或广播不可用时各页视自己为 leader，跨浏览器也难共享，因此不能用这一设计保证只响一次。收益是将等待状态主动呈现给用户，实际少等待多久需要对照。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:3-12](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/cordis.patch.yml#L3-L12)

宿主和 Web 客户端的实际接线。

<details>
<summary>查看原文（10行）</summary>

```text
# One row: this package's own Host half. The row declares the volatile Config
# schema the Settings document serves under the `notify-sounds` namespace, and
# mounting it is what makes the package discoverable by the client-module
# scanner (`dsh.client` is read from the manifest of the package a Loader row
# mounts), so the browser half — the notification sounds and the Settings
# section — is served with it.

- insert:
    - id: notify-sounds
      name: 'dsh-plugin-notify-sounds'
```

</details>

**依据 2 · 源码核查**：[lib/client.js:3363-3394](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/lib/client.js#L3363-L3394)

会话快照及新交互和完成边沿。

<details>
<summary>查看原文（32行）</summary>

```text
				const read = () => {
					const snapshot = source.getSnapshot();
					// One row snapshot for this whole pass, handed to every
					// check below instead of being taken per session.
					const rows = readSessionRows();
					if (previous !== undefined) {
						for (const [sessionId, status] of snapshot) {
							// Sub-agent sessions stay out of it unless asked for:
							// the user wants the main conversation's alerts.
							if (!isNotifiable(sessionId, rows)) continue;
							const before = previous.get(sessionId);
							const beforePending = before === undefined ? undefined : before.pendingInteraction;
							if (status.pendingInteraction !== undefined && status.pendingInteraction !== beforePending) {
								// Every interaction but a question takes the
								// decision trigger. Measured kinds: `question`
								// (ask_user_question) and `approval` (a tool
								// approval, carrying toolName/reason/
								// displayReason/result). Anything DSH adds later
								// lands in the same bucket rather than going
								// silent, which is the safe default for a
								// notification that exists to get attention.
								notify(status.pendingInteraction.kind === "question" ? "question" : "decision", status.pendingInteraction, sessionId);
							}
							if (before !== undefined && before.running === true && status.running === false) {
								handleCompletion(sessionId, form.getSnapshot().value);
							}
						}
					}
					previous = snapshot;
					trackPending(snapshot, rows);
				};
				// Returning to the page clears the alert even while the
```

</details>

**依据 3 · 源码核查**：[lib/client.js:3115-3134](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/lib/client.js#L3115-L3134)

领导页、静音、可见状态及重复过滤条件。

<details>
<summary>查看原文（20行）</summary>

```text
				// a notification; every page still keeps its own title mark,
				// because a title belongs to its own window.
				if (!alertLeader.isLeader()) return false;
				const value = form.getSnapshot().value;
				if (value?.enabled === false) return false;
				if (value?.quietHours === true && inQuietHours(new Date(), value?.quietStart, value?.quietEnd)) return false;
				if (value?.onlyWhenHidden === true && typeof document !== "undefined" && document.visibilityState === "visible") return false;
				const reminder = options.reminder === true;
				const now = Date.now();
				// `Date.now()` is not monotonic: a clock correction backwards
				// would otherwise make this difference negative and mute every
				// trigger for the length of the jump.
				const last = cooldown.get(`${kind}:${sessionId}`) ?? 0;
				const elapsed = now - last;
				if (!reminder && elapsed >= 0 && elapsed < RETRIGGER_COOLDOWN_MS) return false;
				// A reminder keeps its own cadence and must not claim the
				// cooldown: writing it would silence a genuinely new decision
				// from the same session for the next two seconds, and because
				// triggers are edge-fired that alert is lost rather than
				// delayed.
```

</details>

**依据 4 · 源码核查**：[lib/client.js:3333-3356](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/lib/client.js#L3333-L3356)

等待记录继承已见与静音位。

<details>
<summary>查看原文（24行）</summary>

```text
				const trackPending = (snapshot, rows) => {
					const next = new Map();
					for (const [sessionId, status] of snapshot) {
						// A filtered session is invisible to the whole package:
						// it gets no reminder and no title mark either.
						if (!isNotifiable(sessionId, rows)) continue;
						const interaction = status.pendingInteraction;
						if (interaction === undefined) continue;
						const record = pending.get(sessionId);
						next.set(sessionId, record !== undefined && record.interaction === interaction ? record : {
							interaction,
							kind: interaction.kind === "question" ? "question" : "decision",
							since: Date.now(),
							lastPing: 0,
							// Seen or not from the moment it appears: a decision
							// that shows up while the user is at the window has
							// already been SEEN, and a seen decision never gets
							// a repeat reminder (see the reminder timer).
							seen: pageIsWatched(),
							// Quiet hours mean the event is forgotten, not
							// queued: a decision that appears during them gets
							// no reminder and no title mark, and nothing about
							// it is delivered when the quiet window ends.
							quiet: quietNow(),
```

</details>

**依据 5 · 源码核查**：[lib/client.js:3430-3459](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/lib/client.js#L3430-L3459)

重复提醒只处理未见项，拒绝时不累积。

<details>
<summary>查看原文（30行）</summary>

```text
				const renotifyTimer = setInterval(() => {
					// Quiet hours are time-based; refresh the title at the same
					// cadence so its alert appears or clears when the range changes.
					refreshFlash();
					const value = form.getSnapshot().value;
					if (value?.renotify !== true || pending.size === 0) return;
					const minutes = renotifyInterval(value?.renotifyMinutes);
					const intervalMs = minutes * 60000;
					const now = Date.now();
					const watching = pageIsWatched();
					for (const [sessionId, record] of pending) {
						// Seen once, done forever: leaving again does not
						// re-arm this decision for another round. A decision
						// from quiet hours is done too — it was forgotten.
						if (record.seen || record.quiet === true) continue;
						if (watching) {
							// Watched right now counts as seen as well (the
							// visibility event normally records it first), and a
							// seen decision leaves this loop for good.
							record.seen = true;
							continue;
						}
						const last = record.lastPing !== 0 ? record.lastPing : record.since;
						if (now - last >= intervalMs) {
							// A reminder that cannot fire right now is dropped,
							// not queued: quiet hours must not end with a burst
							// of everything that was missed overnight. The
							// cadence simply continues afterwards.
							notify(record.kind, record.interaction, sessionId, { reminder: true });
							record.lastPing = now;
```

</details>

**依据 6 · 源码核查**：[lib/client.js:1245-1289](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/lib/client.js#L1245-L1289)

跨页面选举及 API 缺失退路。

<details>
<summary>查看原文（45行）</summary>

```text
		function createAlertLeader() {
			const storage = safeAlertStorage();
			const Channel = typeof BroadcastChannel === "function" ? BroadcastChannel : undefined;
			if (storage === undefined || Channel === undefined) {
				return { isLeader: () => true, refresh: () => {}, dispose: () => {} };
			}
			const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
			let channel;
			try {
				channel = new Channel(ALERT_CHANNEL);
			} catch {
				return { isLeader: () => true, refresh: () => {}, dispose: () => {} };
			}
			let leader = false;
			const readClaim = () => {
				try {
					const parsed = JSON.parse(storage.getItem(ALERT_LEADER_KEY) ?? "null");
					return parsed !== null && typeof parsed?.id === "string" && Number.isFinite(parsed?.at) ? parsed : undefined;
				} catch {
					return undefined;
				}
			};
			const claim = () => {
				leader = true;
				try {
					storage.setItem(ALERT_LEADER_KEY, JSON.stringify({ id, at: Date.now() }));
				} catch {}
				try {
					channel.postMessage({ id });
				} catch {}
			};
			const refresh = () => {
				const current = readClaim();
				if (current === undefined || current.id === id) {
					claim();
					return;
				}
				// Somebody else holds a claim. While it is fresh this page stays
				// silent; once it goes stale its holder is gone and this page
				// takes over.
				if (Date.now() - current.at < ALERT_STALE_MS) {
					leader = false;
					return;
				}
				claim();
```

</details>

#### 缺口

- 跨页面启动竞争与后台节流导致的误发或漏发未知
  **影响**：不能承诺送达率
  **进一步探讨**：同一审批样例比较单页、同时两页、关闭广播及静音后的提醒次数与到达时延

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目标任务什么时候才响？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

开启目标只在最终轮提醒后，客户端针对运行变空闲时查目标当前 phase。宿主路由需会话和投影服务，连接检查失败就拒绝，从嵌套目标字段或兼容的扁平字段返回 phase。active 继续等并轮询；会话又运行则结束这个等待，目标不再 active 或读取失败可按普通完成提示。每次请求有条件地使用浏览器的 AbortSignal.timeout，不能提供该 API 就无单次超时信号；等待另有 30 分钟截止。提示前重新读取配置，用户期间取消则不补响。投影字段因宿主变化读取不到时，插件倾向让用户仍有通知，代价是可能每轮响。它说明了终态信号的工程边界，不能根据一次提示推断目标实际成果已经验收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1322-1365](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/lib/index.js#L1322-L1365)

宿主投影形状与 connection 门禁。

<details>
<summary>查看原文（44行）</summary>

```text
	ctx.inject(["webServer", "connection", "sessions", "sessionProjections"], (child) => {
		/** The goal phase for one session, or undefined when there is none. */
		const phaseOf = (sessionId) => {
			try {
				const session = child.sessions.get(sessionId);
				if (session === undefined) return undefined;
				const projection = child.sessionProjections.stateOf(session, "goal");
				if (projection === undefined || projection.failure != null) return undefined;
				const phase = projection.current?.goal?.phase ?? projection.current?.phase;
				return typeof phase === "string" ? phase : undefined;
			} catch (error) {
				// The projection API is internal, and it has already changed
				// shape once (1.8.2). A throw here would otherwise be invisible:
				// the browser reads "no phase" as "no goal" and goal mode goes
				// back to chiming on every round, with nothing to explain it.
				// One deduplicated line in the Host log is the difference
				// between "a DSH update broke this" and "the plugin is buggy".
				warn(`goal projection unreadable: ${error?.message ?? error}`);
				return undefined;
			}
		};
		child.effect(() => child.webServer.register({
			kind: "exact",
			path: GOAL_PHASE_PATH,
			handler: (req, res) => {
				const rejection = child.connection.requestRejection(req);
				if (rejection !== undefined) {
					res.statusCode = rejection;
					res.end();
					return;
				}
				if (req.method !== "GET") {
					res.statusCode = 405;
					res.setHeader("allow", "GET");
					res.end();
					return;
				}
				const sessionId = new URL(req.url ?? "/", "http://localhost").searchParams.get("session") ?? "";
				const phase = sessionId === "" ? undefined : phaseOf(sessionId);
				res.statusCode = 200;
				res.setHeader("content-type", "application/json");
				res.end(JSON.stringify({ phase: phase ?? null }));
			},
		}), "notify-sounds: goal phase route");
```

</details>

**依据 2 · 源码核查**：[lib/client.js:3220-3245](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/lib/client.js#L3220-L3245)

轮询间隔和超时、请求失败时的默认行为。

<details>
<summary>查看原文（26行）</summary>

```text
				const GOAL_POLL_MS = 2000;
				/** Longest a goal may stay `active` before its watcher gives up. */
				const GOAL_SETTLE_TIMEOUT_MS = 30 * 60 * 1000;
				/** A single phase read gives up rather than parking the watcher for good. */
				const GOAL_FETCH_TIMEOUT_MS = 5000;
				/**
				 * One goal phase from the Host, or undefined when it cannot be read.
				 *
				 * The Host owns the durable projection; this page's own store only
				 * carries sessions it has opened, and a completion edge can belong to a
				 * session this page never opened. Undefined keeps the old behaviour
				 * (alert) for any runtime that does not answer the route — and for a
				 * read that timed out, which is the same "cannot know, so speak" case.
				 */
				const readGoalPhase = async (sessionId) => {
					try {
						const signal = typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
							? AbortSignal.timeout(GOAL_FETCH_TIMEOUT_MS)
							: undefined;
						const response = await fetch(GOAL_PHASE_PATH + "?session=" + encodeURIComponent(sessionId), { method: "GET", signal });
						if (!response.ok) return undefined;
						const payload = await response.json();
						return typeof payload?.phase === "string" ? payload.phase : undefined;
					} catch {
						return undefined;
					}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:3264-3303](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/lib/client.js#L3264-L3303)

取消、终态判断、设置重查和等待截止。

<details>
<summary>查看原文（40行）</summary>

```text
				const handleCompletion = (sessionId, value) => {
					if (value?.goalFinalOnly !== true) {
						alertCompletion(sessionId);
						return;
					}
					if (goalWatchers.has(sessionId)) return;
					let settled = false;
					let pollTimer;
					let deadline;
					const finish = (chime) => {
						if (settled) return;
						settled = true;
						goalWatchers.delete(sessionId);
						clearTimeout(pollTimer);
						clearTimeout(deadline);
						// The decision to wait was taken at the edge, but the wait
						// can last half an hour — long enough for the user to turn
						// the switch OFF precisely because they did not want this
						// chime. Re-read it here: a preference that was honoured
						// when it arrived must not be ignored when it leaves.
						const stillWanted = form.getSnapshot().value?.goalFinalOnly === true;
						if (chime && stillWanted) alertCompletion(sessionId);
					};
					goalWatchers.set(sessionId, () => finish(false));
					const poll = async () => {
						if (source.getSnapshot().get(sessionId)?.running === true) {
							finish(false);
							return;
						}
						const phase = await readGoalPhase(sessionId);
						if (settled) return;
						if (phase !== "active") {
							finish(true);
							return;
						}
						pollTimer = setTimeout(poll, GOAL_POLL_MS);
					};
					deadline = setTimeout(() => finish(true), GOAL_SETTLE_TIMEOUT_MS);
					deadline?.unref?.();
					void poll();
```

</details>

#### 缺口

- 未测目标投影时序以及中间轮是否短暂读不到
  **影响**：可能过早收到终态提示
  **进一步探讨**：控制一个多轮虚拟任务，模拟 active、正常完成、暂时读取失败与等待中新运行时的投递

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 通知如何回到用户视野，为什么有成功回执却没唤窗？

**研究主题**：工程质量与复用、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

客户端只有配置系统通知且页面处于离开状态时才尝试系统提醒。用户点击后，插件发起同一宿主的 focus POST。宿主先检查连接，再用 Origin 或 Sec-Fetch-Site 区分普通浏览器和桌面外壳，普通浏览器分支不再唤桌面。宿主先送 204 回执再处理窗口，所以 204 只说明请求被接收。Windows 可见或最小化分支尝试原生聚焦，页面隐藏时偏向深链由外壳唤回，系统焦点与权限仍能改变结果。设置图标先注册宿主插槽，同时安装兼容用 DOM 替换，卸载时回收两者。主题设置能显示与通知能到达是两项不同判据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:3151-3169](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/lib/client.js#L3151-L3169)

系统通知另有选项及离开状态。

<details>
<summary>查看原文（19行）</summary>

```text
				const volume = Number.isFinite(value?.volume) ? value.volume : DEFAULT_VOLUME;
				// One entry point for "which sound": the trigger's own file,
				// the legacy inline payload, or the preset its picker names.
				playAlert(kind, value, volume);
				if (value?.systemNotify === true && pageIsAway()) {
					// The name the user knows this conversation by, when the
					// runtime exposes one. Naming it only helps if the toast
					// still says what happened, so for a decision the event
					// moves into the body instead of being dropped.
					const conversation = conversationTitle(sessionId, readSessionRows());
					const eventTitle = t(kind === "completion" ? "notify.completion.title" : "notify.decision.title");
					const title = conversation !== "" ? conversation : eventTitle;
					if (kind === "completion") {
						showSystemNotification(title, t("notify.completion.body"), "dsh-notify-sounds:completion");
					} else {
						const detail = interactionSummary(interaction, resolvePackageText) ?? t("notify.decision.body");
						const body = conversation !== "" ? t("notify.decision.event", { detail }) : detail;
						showSystemNotification(title, body, "dsh-notify-sounds:decision");
					}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1217-1268](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/lib/index.js#L1217-L1268)

本机连接检查、浏览器识别和先发响应。

<details>
<summary>查看原文（52行）</summary>

```text
	ctx.inject(["webServer", "connection"], (child) => {
		child.effect(() => child.webServer.register({
			kind: "exact",
			path: FOCUS_PATH,
			handler: async (req, res) => {
				const rejection = child.connection.requestRejection(req);
				if (rejection !== undefined) {
					res.statusCode = rejection;
					res.end();
					return;
				}
				if (req.method !== "POST") {
					res.statusCode = 405;
					res.setHeader("allow", "POST");
					res.end();
					return;
				}
				// Which client asked? The Desktop's renderer fetches from its
				// own `dsh-app://app/` origin, and the shell STRIPS Origin and
				// Sec-Fetch-Site before forwarding to this server (the shell's
				// `forwardWebRequest` in `lib/main.js`), so a Desktop click
				// arrives with neither header while a real browser always sends
				// at least one. Checking BOTH keeps this working if the shell
				// ever stops stripping only one of them: the day it strips
				// neither, a Desktop click would silently start looking like a
				// browser one and clicks would stop raising the window — with no
				// other symptom to explain it.
				//
				// The two need opposite things, so the choice is derived here
				// rather than configured: a browser click needs no help, since
				// activating the notification raises the browser window itself
				// and raising the Desktop window instead would be the wrong
				// window entirely.
				const headers = req.headers ?? {};
				const fromBrowser = headers.origin !== undefined || headers["sec-fetch-site"] !== undefined;
				// The page knows something Win32 cannot see: whether its renderer
				// was told to stop. That is the difference between a window that
				// is merely behind another app and one left "fake visible" by an
				// earlier raise, which frames alone never recover from.
				const pageHidden = new URL(req.url ?? "/", "http://localhost").searchParams.get("vis") === "hidden";
				res.statusCode = 204;
				res.end();
				if (fromBrowser) {
					// A browser brings its own window forward; raising the Desktop
					// instead would be the wrong window entirely.
					log(`focus click (fromBrowser=true, pageHidden=${pageHidden}, outcome=browser)`);
					return;
				}
				// A hidden window is not a matter of retrying — the frame is not
				// the problem, so only Electron can show it. Retrying would just
				// stack 540ms in front of the same deep link.
				const attempts = pageHidden ? 1 : 3;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1265-1285](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/lib/index.js#L1265-L1285)

桌面聚焦与深链处理。

<details>
<summary>查看原文（21行）</summary>

```text
				// A hidden window is not a matter of retrying — the frame is not
				// the problem, so only Electron can show it. Retrying would just
				// stack 540ms in front of the same deep link.
				const attempts = pageHidden ? 1 : 3;
				let outcome = false;
				for (let attempt = 0; attempt < attempts; attempt += 1) {
					outcome = tryRaiseNative(pageHidden);
					if (outcome === true || outcome === RAISE_HIDDEN) break;
					if (attempt < attempts - 1) await new Promise((resolve) => setTimeout(resolve, 180));
				}
				if (outcome !== true) {
					log(`focus: ${outcome === RAISE_HIDDEN ? "window is hidden, Electron must show it" : "native raise unavailable"} (pageHidden=${pageHidden})`);
					focusDesktopWindowDeepLink();
				}
				log(`focus click (fromBrowser=false, pageHidden=${pageHidden}, outcome=${String(outcome)})`);
			},
		}), "notify-sounds: focus route");

		// The update check route: a fixed, read-only question about this
		// plugin's own npm package. Same fence as the focus route. It takes no
		// URL, package name or version from the caller — there is nothing here
```

</details>

**依据 4 · 源码核查**：[lib/client.js:3558-3576](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/lib/client.js#L3558-L3576)

官方设置图标插槽、DOM 兼容及卸载。

<details>
<summary>查看原文（19行）</summary>

```text
				// 0.2.2's supported route. A shell without the slot (0.2.1) throws
				// here — or ignores it — and the DOM patch below still swaps the
				// gear, so both generations show the same glyph.
				let disposeIcon = () => {};
				try {
					disposeIcon = ctx.slots.inject("settings.section.icon", () => ctx.slots.register({
						name: "settings.section.icon",
						id: SETTINGS_NAMESPACE,
						order: 5,
						locale: NS,
					}, NotifySoundsNavIcon));
				} catch {}
				const disposeNavIcon = installNavIconPatch(t);
				return () => {
					disposeIcon();
					disposeNavIcon();
					disposeSection();
				};
			}), "notify-sounds: settings section");
```

</details>

**依据 5 · 作者声明**：[README.zh.md:130-139](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/README.zh.md#L130-L139)

作者说明操作系统通知权限与本机窗口跳转。

<details>
<summary>查看原文（10行）</summary>

```text
- **通知权限**：桌面端放行；受限环境（某些浏览器策略）下被拒时，行内会引导手动允许，其余功能不受影响。
- **macOS 的系统通知**：桌面外壳对权限请求一律放行，所以设置里恒显示「已授权」；**实际是否弹横幅由 macOS 决定**（系统设置 → 通知 → DeepSeek Harness），未签名的开发版可能静默失败——「显示已授权却没通知」多半不是插件的问题。

## 🧩 设计与实现

给想改代码的人看的要点（实现细节以源码注释为准）：

- **触发不碰事件瀑布**：审批/提问的请求是 waterfall 事件，UI 应答后晚注册的监听器收不到。本插件改读 `uiSession.sessionStatus`（DSH 自己聚合的 pending/running 事实，与侧栏状态点同源），纯观察、零侵入。
- **重复提醒的节拍**：15 秒粒度检查未处理决策；**看过即除名**（决策出现时你正在窗口、或之后回到窗口，都算看过），切走不重新武装；新问题替换旧问题会重置计时。免打扰期间的提醒直接作废，不会顺延到时段结束补发。
- **通知点击回到窗口**：渲染进程唤不起 OS 窗口，点击时 POST 到宿主半边的 `/notify-sounds/focus`（带 connection 围栏），由宿主唤起。Windows 用 DSH 自带的 `koffi` 直接调 `user32.dll`（不引新依赖、只操作窗口、不启动 PowerShell——那会触发杀软主动防御并归因到 DSH）；桌面端/浏览器端按 `Origin` 头自动区分，浏览器端不误唤桌面窗口。
```

</details>

#### 缺口

- 未验证系统通知权限、窗口隐藏和同源 HTTP 头的组合
  **影响**：不能把网页提示或成功 HTTP 当成唤窗可用
  **进一步探讨**：分别测浏览器、可见桌面、最小化和托盘的通知点击与窗口录像

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 试用成本及退出是什么，怎样减少可确认的漏报？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

先用内置音响跑单一公开小任务，发起一次待批准和一次用户离开后的结束，核对提醒是否能区分两种事件。内置音省去管理音频文件，系统通知还需平台权限，重复提醒受后台计时。若用户不在页面时经常听到两次、静音结束后误以为任务已获处理，或点击后无法回到对应界面，应停用插件提醒并恢复直接查看会话。首次要确认宿主与权限，持续承担打扰和可见性检查。现金消耗与等待时间节省没有对照。一个后续设想是只为已经生成但未被用户确认的高优先级决定保留页面内可查看记录，按事件标识去重，且静音继续不播放声音；以故意关闭背景计时、两个并行会话和同一事件重复写入观察漏报、误报与回看工时。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:47-57](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/README.zh.md#L47-L57)

作者说明内置音、自定义与设置选项。

<details>
<summary>查看原文（11行）</summary>

```text
## 🔔 声音

双音铃 · 风铃 · 单音叮 · 水滴 · 脉冲 · 上行琶音 · 金币 · 达成 · 敲门 —— 九种内置音效全部由 Web Audio 现场合成，不含任何音频文件、不发一次网络请求。

也可以换上你自己的音频（mp3 / wav / ogg / m4a，每个 ≤15 秒、3MB，自动校验并做响度归一化），或者干脆选「无声」只留通知。三种触发（审批 / 提问 / 完成）各选各的音效，设置里随时试听。

## ⚙️ 设置

设置 → **提示音**（位于「通用设置」与「模型」之间），每项功能都有独立开关，界面与 DSH 原生设置完全一致：

总开关与音量 · 三种触发各自的音效（含试听）· 子智能体提醒 · 系统通知 · 窗口标题提醒 · 重复提醒间隔 · 静音时段 · 仅后台提示 · 最多 3 个可改名的自定义音频 · 自动检查更新（安装走包管理器）
```

</details>

**依据 2 · 源码核查**：[lib/client.js:3342-3356](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/lib/client.js#L3342-L3356)

在状态跟踪中记录是否已见与进入时是否静音。

<details>
<summary>查看原文（15行）</summary>

```text
						next.set(sessionId, record !== undefined && record.interaction === interaction ? record : {
							interaction,
							kind: interaction.kind === "question" ? "question" : "decision",
							since: Date.now(),
							lastPing: 0,
							// Seen or not from the moment it appears: a decision
							// that shows up while the user is at the window has
							// already been SEEN, and a seen decision never gets
							// a repeat reminder (see the reminder timer).
							seen: pageIsWatched(),
							// Quiet hours mean the event is forgotten, not
							// queued: a decision that appears during them gets
							// no reminder and no title mark, and nothing about
							// it is delivered when the quiet window ends.
							quiet: quietNow(),
```

</details>

**依据 3 · 源码核查**：[lib/client.js:3430-3459](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/lib/client.js#L3430-L3459)

重复的代价和已见不再响条件。

<details>
<summary>查看原文（30行）</summary>

```text
				const renotifyTimer = setInterval(() => {
					// Quiet hours are time-based; refresh the title at the same
					// cadence so its alert appears or clears when the range changes.
					refreshFlash();
					const value = form.getSnapshot().value;
					if (value?.renotify !== true || pending.size === 0) return;
					const minutes = renotifyInterval(value?.renotifyMinutes);
					const intervalMs = minutes * 60000;
					const now = Date.now();
					const watching = pageIsWatched();
					for (const [sessionId, record] of pending) {
						// Seen once, done forever: leaving again does not
						// re-arm this decision for another round. A decision
						// from quiet hours is done too — it was forgotten.
						if (record.seen || record.quiet === true) continue;
						if (watching) {
							// Watched right now counts as seen as well (the
							// visibility event normally records it first), and a
							// seen decision leaves this loop for good.
							record.seen = true;
							continue;
						}
						const last = record.lastPing !== 0 ? record.lastPing : record.since;
						if (now - last >= intervalMs) {
							// A reminder that cannot fire right now is dropped,
							// not queued: quiet hours must not end with a burst
							// of everything that was missed overnight. The
							// cadence simply continues afterwards.
							notify(record.kind, record.interaction, sessionId, { reminder: true });
							record.lastPing = now;
```

</details>

**依据 4 · 源码核查**：[lib/client.js:3558-3575](https://github.com/BillCx330/dsh-plugin-notify-sounds/blob/bb258df3ddd25a02ddf9ba8ca4c04623436866a5/lib/client.js#L3558-L3575)

UI 兼容和回收。

<details>
<summary>查看原文（18行）</summary>

```text
				// 0.2.2's supported route. A shell without the slot (0.2.1) throws
				// here — or ignores it — and the DOM patch below still swaps the
				// gear, so both generations show the same glyph.
				let disposeIcon = () => {};
				try {
					disposeIcon = ctx.slots.inject("settings.section.icon", () => ctx.slots.register({
						name: "settings.section.icon",
						id: SETTINGS_NAMESPACE,
						order: 5,
						locale: NS,
					}, NotifySoundsNavIcon));
				} catch {}
				const disposeNavIcon = installNavIconPatch(t);
				return () => {
					disposeIcon();
					disposeNavIcon();
					disposeSection();
				};
```

</details>

#### 缺口

- 没有记录与普通查看相比的等待次数及后台恢复表现
  **影响**：只能定义试用判据和停止条件
  **进一步探讨**：使用固定任务记录人工回看的次数、提示次数、权限及真实返回窗口结果

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
