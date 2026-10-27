# dsh-plugin-offpeak-badge

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[7baac21](https://github.com/AK-blank/dsh-plugin-offpeak-badge/tree/7baac218a3ac9a7a31964bda164284c4647cf308)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AK-blank/dsh-plugin-offpeak-badge)
<!-- END META -->

> **实现功能**：在 DSH Web 显示 DeepSeek API 模型价格空闲/高峰时段徽章与切换提示。

> **核心亮点**：把公开计价规则放到 DSH 常驻 UI，使人工排程更快看到时段；不读取真实账单或调度请求。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：硬编码年历仅到2026，未覆盖年退化为周一至五可高峰；slot 与 DOM 类名集成也可能随宿主变化。详见[Q03](#research-q03)。

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
  - [Q01 · 谁需要提示，界面呈现什么？](#detail-section-11)
  - [Q02 · 北京时间和节假日如何计算，是否符合当前官方规则？](#detail-section-12)
  - [Q03 · 日历过期和计费范围有何限制？](#detail-section-13)
  - [Q04 · 安装、兼容和改进验证是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：API 用户希望识别可延后任务的较低费率时段。

手工查 DeepSeek 官方价格页并换算时区/假期；插件将其作为常驻本地 UI。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 时段徽章 | 显示当前价格时段 | 本地时钟/硬编码年历 |
| tooltip | 展示下一切换和规则 | 非实时账单 |
| overlay/live | 折叠与读屏提示 | 宿主 UI 接口未验 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 不满足时 |
| --- | --- | --- |
| DSH Web slots/locale/primitives | 展示与本地化 | 徽章不显示/冲突 |
| 正确系统时钟 | 时段计算 | 状态错误 |
| 更新的价格规则和年历 | 实际提示 | 跨年或调价误导 |
| 官方账单 | 金额核实 | 只能看到时段提示 |


#### 使用

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 安装 | profile 加 bundle | UI 插件加载 |
| 查看 | 读徽章/tooltip | 时区/日期/覆盖年份明确 |
| 决策 | 按实际任务选择错峰 | 不以徽章当账单 |
| 复核 | 定期看官方计价和账单 | 规则仍有效 |

**效果与成本**

#### 成本

| 阶段 | 资源/人工 | 未知 |
| --- | --- | --- |
| 首次 | 安装 bundle，验宿主 slot/UI | 实际兼容性 |
| 持续 | 核价格规则与下一年假期、必要时更新 | 维护频率 |
| 使用 | 人工选择是否延后请求 | 真实节省额、模型/工具计费 |


#### 效果

| 项 | 当前支持 | 未知 |
| --- | --- | --- |
| 时段规则 | 源码与2026-10-22官方价格页吻合 | 日后规则变更 |
| UI 可见 | slot/组件源码 | 真实宿主显示 |
| 节省 | 提醒有可能帮助排程 | 实际账单收益 |

> **思考**：硬编码年历仅到2026，未覆盖年退化为周一至五可高峰；slot 与 DOM 类名集成也可能随宿主变化。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把公开计价规则放到 DSH 常驻 UI，使人工排程更快看到时段；不读取真实账单或调度请求。详见[Q01](#research-q01)、[Q02](#research-q02)。

把公开计价规则放到 DSH 常驻 UI，使人工排程更快看到时段；不读取真实账单或调度请求。详见[Q01](#research-q01)、[Q02](#research-q02)。

客户端用 Intl 北京日历字段及固定节假日表、分钟刷新。宿主 apply 为空；品牌 slot 抢优先级，折叠栏色点依赖 DOM 类名和定时定位。

<a id="detail-section-5"></a>

### 1.4 主要限制

硬编码年历仅到2026，未覆盖年退化为周一至五可高峰；slot 与 DOM 类名集成也可能随宿主变化。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察试用。将徽章视为时段提醒，关键费用决策仍核 DeepSeek 官方实时计价页和账单。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

2026-10-22 核到的官方模型计价页时段与源码规则吻合；客户端显示、账户账单和未来假期/规则更新未验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js、selftest.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态阅读固定版 README、package、client、host 与自检；2026-10-22 查 DeepSeek 官方价格页；未执行目标代码、安装或读账单。
- 下一步：边界分钟、周末补班、工作日法定假、跨年未覆盖、错误时钟与真实账单做对照；在 DSH 多布局验证 slot。

**分析版本**

- **仓库**：[AK-blank/dsh-plugin-offpeak-badge](https://github.com/AK-blank/dsh-plugin-offpeak-badge)
- **版本号**：1.0.0（[固定提交 7baac21](https://github.com/AK-blank/dsh-plugin-offpeak-badge/tree/7baac218a3ac9a7a31964bda164284c4647cf308)）
- **版本日期**：2026-10-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

加入有来源和核查日期的规则/假期更新与过期告警，在边界、跨年和真实账单对照中降低误导；本版未实现。详见[Q04](#research-q04)。

边界分钟、周末补班、工作日法定假、跨年未覆盖、错误时钟与真实账单做对照；在 DSH 多布局验证 slot。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 2 | 650 | 506 | 78 | — |
| .js | source | 2 | 630 | 452 | 146 | — |
| .md | source | 2 | 482 | — | — | 5282 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AK-blank/dsh-plugin-offpeak-badge/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AK-blank/dsh-plugin-offpeak-badge/issues?q=is%3Aissue+created%3A2026-09-22T05%3A31%3A03.427Z..2026-10-22T05%3A31%3A03.427Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AK-blank/dsh-plugin-offpeak-badge/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A31%3A03.427Z..2026-10-22T05%3A31%3A03.427Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 API 费用时段提示的规则、年历维护、界面实现与采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要提示，界面呈现什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在 DSH Web 使用 DeepSeek API、希望把可延后请求安排在较低费率时段的用户。客户端向侧边栏品牌区注册中英双语空闲/高峰徽章、提示文本，在折叠栏添加色点并有屏幕阅读器 live 区域；提示还给出下一次切换时间。宿主端 apply 为空，实际逻辑在客户端，由浏览器时钟本地计算；没有调用计费 API、获取账号账单或自动调度请求。相对手工查看官方计价页和时钟，插件把规则变成常驻可视提醒。合格结果需让用户知道它只是当前规则的提示，并核实际账号、模型及官方价格，因为 UI 颜色不是收费凭证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-30](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/README.md#L1-L30)

作者描述徽章、tooltip、折叠栏色点和屏幕阅读器提示。

<details>
<summary>查看原文（30行）</summary>

````text
# dsh-plugin-offpeak-badge

**DeepSeek API peak / off-peak billing badge for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) Web GUI — as a plugin, in 中文 and English.**

A pill in the top-left brand row tells you, at a glance, whether the DeepSeek API is
charging you the **off-peak** rate (half price) or the **peak** rate right now. Hover it
for the rule, today's day type and the exact moment of the next switch.

[中文说明 →](README.zh-CN.md)

![Badge in the sidebar brand row](docs/badge.png)

```
🐳 deepseek HARNESS  [Idle] / 〔空闲〕   ← green = off-peak (half price)
🐳 deepseek HARNESS  [Peak] / 〔高峰〕   ← amber = peak
```

Collapse the sidebar and the badge becomes a dot on the collapse button, so it stays
visible in rail mode.

![Tooltip with rule and next switch](docs/tooltip.png)

## What it shows

| Surface | Content |
|---|---|
| Sidebar brand row (`sidebar.brand.name`) | `Idle` / `Peak` pill, colour-coded, hover tooltip |
| Tooltip | current window · today's date, weekday and day type · next switch time and countdown · the rule · which holiday calendar is in use |
| Collapsed rail (`shell.overlay`) | 8 px status dot on the sidebar collapse button |
| Screen readers (`shell.overlay`) | visually hidden `aria-live` region (the brand seat itself lives inside an `aria-hidden` subtree) |
````

</details>

**依据 2 · 源码核查**：[lib/index.js:1-19](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/lib/index.js#L1-L19)

宿主 apply 为空，功能位于客户端。

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * DeepSeek peak / off-peak badge — host half (node half).
 *
 * This package contributes browser presentation only: the badge lives in the Web
 * client's sidebar brand seat (`sidebar.brand.name`), the collapsed-rail dot and
 * the screen-reader live region live in `shell.overlay`. The billing rule, the
 * holiday calendar and both locale dictionaries are all in the browser half
 * (`exports["./client"]` → `lib/client.js`), evaluated against Beijing wall-clock
 * time in the page.
 *
 * The empty `apply` therefore exists for one reason: it gives the Cordis Loader a
 * host row, which is what makes `dsh-client-modules`' incremental `dsh.client`
 * scan pick the browser half up and add it to the `__DSH_BOOT__` graph.
 *
 * Rule and data sources: see the header of `lib/client.js` and README.
 */

/** Host plugin body — this package ships browser presentation only. */
export function apply() {}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:438-473](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/lib/client.js#L438-L473)

品牌栏徽章/tooltip 组件。

<details>
<summary>查看原文（36行）</summary>

```text
		/** The pill itself: green = off-peak, amber = peak, tooltip = the whole story. */
		function OffPeakBadge({ t }) {
			const status = useStatus();
			const anchorRef = React.useRef(null);
			const compact = useCompactLayout(anchorRef);
			const tag = React.createElement(
				Tag,
				{ tone: status.offPeak ? "success" : "warning" },
				compact ? React.createElement("span", { style: DOT }) : badgeLabel(t, status)
			);
			// The whole brand row is the "new session" button: never let a click on the
			// badge fall through to it.
			const stop = (event) => event.stopPropagation();
			const anchor = React.createElement(
				"span",
				{
					ref: anchorRef,
					style: { display: "inline-flex", alignItems: "center", flex: "none", cursor: "default" },
					onClick: stop,
					onMouseDown: stop,
					onPointerDown: stop
				},
				tag
			);
			return React.createElement(
				Tooltip,
				{
					label: () => tooltipText(t, status, new Date()),
					side: "bottom",
					align: "end",
					portal: true,
					delayMs: 120,
					maxWidth: 320
				},
				anchor
			);
```

</details>

**依据 4 · 源码核查**：[lib/client.js:545-579](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/lib/client.js#L545-L579)

live 区域和三个 slot 注册。

<details>
<summary>查看原文（35行）</summary>

```text
		/** Visually hidden live region: the brand seat is inside an aria-hidden subtree. */
		function StatusAnnouncement({ t }) {
			const status = useStatus();
			return React.createElement(
				"span",
				{ role: "status", "aria-live": "polite", style: VISUALLY_HIDDEN },
				announcementText(t, status)
			);
		}
		//#endregion

		/** Required services: the slot registry and the locale registry. */
		const inject = ["slots", "locale"];

		/**
		 * Register the dictionaries and the three seats.
		 * @param ctx - client root context.
		 */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, DICTIONARIES), "offpeak-badge: dictionaries");
			// priority -1: `sidebar.brand.name` is a single slot and only its
			// lowest-priority registration renders, so taking it over is the only way to
			// put the badge next to the official wordmark (which this plugin re-renders).
			ctx.slots.inject("sidebar.brand.name", () => ctx.slots.register(
				{ name: "sidebar.brand.name", priority: -1, locale: NS },
				BrandNameWithOffPeak
			));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register(
				{ name: "shell.overlay", id: "offpeak-badge.rail", priority: 0, locale: NS },
				RailStatusDot
			));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register(
				{ name: "shell.overlay", id: "offpeak-badge.announcement", priority: 0, locale: NS },
				StatusAnnouncement
			));
```

</details>

#### 缺口

- 未在目标 DSH Web 验证 slot 竞争、响应式布局和屏幕阅读器体验。
  **影响**：不能确认实际界面或无障碍效果。
  **进一步探讨**：在隔离 Web profile 的展开/折叠、宽窄屏与读屏场景验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 北京时间和节假日如何计算，是否符合当前官方规则？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

固定版用 Intl.DateTimeFormat 读 Asia/Shanghai 日历字段，工作日且不在内置节假日列表时，将北京时 09:00–12:00 和 14:00–18:00 两段判为高峰，其余为空闲；周末补班仍按周末算空闲。下一次切换沿当天边界或向后寻找下一个合格工作日。浏览器每分钟边界刷新，并在页面重现时刷新。2025、2026 年假期日期与补班日期硬编码，列表标注国务院通知来源。2026-10-22 检查的 DeepSeek 官方计价页 https://api-docs.deepseek.com/quick_start/pricing/ 仍列 UTC 工作日 01:00–04:00、06:00–10:00 高峰，周末与中国法定节假日全日空闲，换算与源码窗口一致；这是官方发布的规则，不是独立账单核验。源码自检有边界、节假日及年历结构断言，但本轮未运行目标自检。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:60-107](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/lib/client.js#L60-L107)

北京时高峰窗口与 2025/2026 年历硬编码。

<details>
<summary>查看原文（48行）</summary>

```text
		/** Beijing time (Asia/Shanghai has been a fixed UTC+8 zone with no DST since 1991). */
		const BEIJING_TIME_ZONE = "Asia/Shanghai";
		const BEIJING_OFFSET_MINUTES = 8 * 60;
		/** Peak windows in Beijing minutes-of-day, half-open: 09:00-12:00 and 14:00-18:00. */
		const PEAK_WINDOWS = [
			[9 * 60, 12 * 60],
			[14 * 60, 18 * 60]
		];
		/** Every window boundary of a day, used to find the next switch. */
		const PEAK_BOUNDARIES = [9 * 60, 12 * 60, 14 * 60, 18 * 60];
		/** Start of the first peak window (09:00), used when searching across days. */
		const PEAK_START_MINUTES = PEAK_WINDOWS[0][0];

		/**
		 * Statutory holidays and make-up working weekends.
		 * `holidays` are the days that never enter peak hours; `workdays` are the
		 * weekend days worked to compensate for a holiday, kept so the tooltip can
		 * explain why such a day is still billed off-peak.
		 */
		const CALENDAR = {
			2025: {
				notice: "国务院办公厅关于2025年部分节假日安排的通知（国办发明电〔2024〕12号）",
				source: "https://www.gov.cn/gongbao/2024/issue_11726/202411/content_6989767.html",
				holidays: [
					"2025-01-01",
					"2025-01-28", "2025-01-29", "2025-01-30", "2025-01-31", "2025-02-01", "2025-02-02", "2025-02-03", "2025-02-04",
					"2025-04-04", "2025-04-05", "2025-04-06",
					"2025-05-01", "2025-05-02", "2025-05-03", "2025-05-04", "2025-05-05",
					"2025-05-31", "2025-06-01", "2025-06-02",
					"2025-10-01", "2025-10-02", "2025-10-03", "2025-10-04", "2025-10-05", "2025-10-06", "2025-10-07", "2025-10-08"
				],
				workdays: ["2025-01-26", "2025-02-08", "2025-04-27", "2025-09-28", "2025-10-11"]
			},
			2026: {
				notice: "国务院办公厅关于2026年部分节假日安排的通知（国办发明电〔2025〕7号）",
				source: "https://www.gov.cn/zhengce/zhengceku/202511/content_7047091.htm",
				holidays: [
					"2026-01-01", "2026-01-02", "2026-01-03",
					"2026-02-15", "2026-02-16", "2026-02-17", "2026-02-18", "2026-02-19", "2026-02-20", "2026-02-21", "2026-02-22", "2026-02-23",
					"2026-04-04", "2026-04-05", "2026-04-06",
					"2026-05-01", "2026-05-02", "2026-05-03", "2026-05-04", "2026-05-05",
					"2026-06-19", "2026-06-20", "2026-06-21",
					"2026-09-25", "2026-09-26", "2026-09-27",
					"2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04", "2026-10-05", "2026-10-06", "2026-10-07"
				],
				workdays: ["2026-01-04", "2026-02-14", "2026-02-28", "2026-05-09", "2026-09-20", "2026-10-10"]
			}
		};
```

</details>

**依据 2 · 源码核查**：[lib/client.js:109-174](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/lib/client.js#L109-L174)

北京时钟、工作日/节假日判定。

<details>
<summary>查看原文（66行）</summary>

```text
		const beijingParts = new Intl.DateTimeFormat("en-US", {
			timeZone: BEIJING_TIME_ZONE,
			hourCycle: "h23",
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			weekday: "short",
			hour: "2-digit",
			minute: "2-digit"
		});
		const WEEKDAY_INDEX = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

		/**
		 * Read an absolute instant as Beijing calendar fields.
		 * @param date - any instant.
		 * @returns date (`YYYY-MM-DD`), ISO weekday (1 = Monday), hour, minute and minutes-of-day.
		 */
		function beijingClock(date) {
			const fields = {};
			for (const part of beijingParts.formatToParts(date)) fields[part.type] = part.value;
			const hour = Number(fields.hour);
			const minute = Number(fields.minute);
			return {
				date: fields.year + "-" + fields.month + "-" + fields.day,
				weekday: WEEKDAY_INDEX[fields.weekday],
				hour,
				minute,
				minutes: hour * 60 + minute
			};
		}

		/** Instant of Beijing midnight for a calendar day. @param ymd - `YYYY-MM-DD`. */
		function beijingMidnight(ymd) {
			const [year, month, day] = ymd.split("-").map(Number);
			return Date.UTC(year, month - 1, day, 0, 0, 0) - BEIJING_OFFSET_MINUTES * 60_000;
		}

		/** Calendar-day arithmetic. @param ymd - start day; @param days - offset. */
		function shiftDate(ymd, days) {
			const [year, month, day] = ymd.split("-").map(Number);
			return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
		}

		/** ISO weekday of a Beijing calendar day. @param ymd - `YYYY-MM-DD`. */
		function weekdayOf(ymd) {
			const [year, month, day] = ymd.split("-").map(Number);
			const iso = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
			return iso === 0 ? 7 : iso;
		}

		/** Whether a day can ever be peak: Monday–Friday and (when covered) not a holiday. */
		function isPeakEligibleDate(ymd) {
			const calendar = CALENDAR[Number(ymd.slice(0, 4))];
			if (calendar !== undefined && calendar.holidays.includes(ymd)) return false;
			return weekdayOf(ymd) <= 5;
		}

		/** Whether minutes-of-day falls inside a peak window. @param minutes - 0…1439. */
		function inPeakWindow(minutes) {
			for (const [start, end] of PEAK_WINDOWS) if (minutes >= start && minutes < end) return true;
			return false;
		}

		/**
		 * Full billing status for an instant, in locale-independent codes.
		 * @param date - any instant.
```

</details>

**依据 3 · 源码核查**：[lib/client.js:175-225](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/lib/client.js#L175-L225)

高峰判断及下次切换搜索。

<details>
<summary>查看原文（51行）</summary>

```text
		 * @returns `offPeak`, a `day` code (`holiday` / `makeupWeekend` / `weekend` /
		 * `workday` / `workdayUncovered`), the switch instant and the raw fields.
		 */
		function statusAt(date) {
			const clock = beijingClock(date);
			const year = Number(clock.date.slice(0, 4));
			const calendar = CALENDAR[year];
			const holiday = calendar !== undefined && calendar.holidays.includes(clock.date);
			const makeupWorkday = calendar !== undefined && calendar.workdays.includes(clock.date);
			const weekend = clock.weekday >= 6;
			const peakEligible = !weekend && !holiday;
			const offPeak = !(peakEligible && inPeakWindow(clock.minutes));

			// Next switch: on a peak-eligible day the next window boundary after now is
			// the switch (peak → window end, off-peak → next window start); after 18:00
			// none is left, so walk forward to the next peak-eligible day's 09:00.
			let switchMinutes = null;
			let switchDate = null;
			if (peakEligible) {
				switchDate = clock.date;
				for (const boundary of PEAK_BOUNDARIES) if (boundary > clock.minutes) { switchMinutes = boundary; break; }
			}
			if (switchMinutes === null) {
				for (let offset = 1; offset <= 30; offset += 1) {
					const candidate = shiftDate(clock.date, offset);
					if (isPeakEligibleDate(candidate)) {
						switchDate = candidate;
						switchMinutes = PEAK_START_MINUTES;
						break;
					}
				}
			}
			const switchAt = switchDate === null ? null : new Date(beijingMidnight(switchDate) + switchMinutes * 60_000);

			const day = holiday
				? "holiday"
				: weekend
					? (makeupWorkday ? "makeupWeekend" : "weekend")
					: (calendar === undefined ? "workdayUncovered" : "workday");

			return {
				offPeak,
				day,
				date: clock.date,
				year,
				weekday: clock.weekday,
				minutes: clock.minutes,
				holiday,
				weekend,
				makeupWorkday,
				calendarCovered: calendar !== undefined,
```

</details>

**依据 4 · 源码核查**：[lib/client.js:371-394](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/lib/client.js#L371-L394)

分钟边界及 visibilitychange 刷新。

<details>
<summary>查看原文（24行）</summary>

```text
		//#region state
		/** Refresh on the minute (window boundaries included) and when the page becomes visible. */
		function useStatus() {
			const [status, setStatus] = React.useState(() => statusAt(new Date()));
			React.useEffect(() => {
				let timer = null;
				const schedule = () => {
					if (timer !== null) window.clearTimeout(timer);
					timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
				};
				const tick = () => {
					setStatus(statusAt(new Date()));
					schedule();
				};
				const onVisible = () => { if (document.visibilityState === "visible") tick(); };
				tick();
				document.addEventListener("visibilitychange", onVisible);
				return () => {
					if (timer !== null) window.clearTimeout(timer);
					document.removeEventListener("visibilitychange", onVisible);
				};
			}, []);
			return status;
		}
```

</details>

**依据 5 · 作者声明**：[README.md:136-176](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/README.md#L136-L176)

作者列计价规则、年历范围和未覆盖年行为；本轮另核官方计价页。

<details>
<summary>查看原文（41行）</summary>

````text
## How the billing rule is decided

The plugin implements the footnote on DeepSeek's official pricing page, verbatim:

> 空闲时段价格为高峰时段价格的一半。北京时间周一至周五（不含中国法定节假日）9:00 - 12:00、14:00 - 18:00 为高峰时段；其余时段，包括周末及中国法定节假日全天均为空闲时段。

> Off-peak rates are half of the peak rates. Peak hours are 01:00 - 04:00 and 06:00 - 10:00 UTC, Monday through Friday, excluding Chinese public holidays. All other hours are off-peak, including weekends and Chinese public holidays in full.

The two windows are identical (UTC + 8 h = Beijing); **day classification is always the
Beijing calendar day**:

```
peak  ⇔  Beijing date is Mon–Fri  ∧  not a statutory holiday  ∧  time ∈ [09:00,12:00) ∪ [14:00,18:00)
idle  ⇔  every other instant
```

Two details people ask about:

* **Adjusted ("调休") weekends.** A weekend that holiday adjustment turns into a working
  day is *still a weekend*, and weekends are off-peak in full — so it stays off-peak all
  day. Chinese media summarised this as "调休上班的周末、中国法定节假日全天均按空闲时段计费";
  that sentence is a news headline rather than official wording, but the conclusion is
  correct and needs no extra rule. The tooltip still names such a day, so the calendar
  never looks wrong.
* **Holidays that fall on a weekday** never enter peak hours ("excluding Chinese public
  holidays"). The plugin ships the statutory holiday list, so it knows the difference
  between a holiday Monday and an ordinary Monday.

### Calendar coverage

| Year | Notice | Holiday days | Make-up workdays |
|---|---|---|---|
| 2025 | 国办发明电〔2024〕12号 | 28 | 5 |
| 2026 | 国办发明电〔2025〕7号 | 33 | 6 |

For a year whose notice is not published yet (2027 at the time of writing) the rule
degrades to "Monday–Friday are peak-eligible" and the tooltip says **"the 2027 holiday
notice is not published yet; Monday to Friday is assumed"** instead of pretending to know.
Adding a year means appending one entry to `CALENDAR` in `lib/client.js`; the self-test
then checks its day count, duplicate-free dates, that make-up days fall on a weekend, and
that an official `source` URL is recorded.
````

</details>

#### 缺口

- 没有用实际计费明细或目标宿主时钟做对照。
  **影响**：只证明静态规则对应官方页面，不能保证用户账单金额。
  **进一步探讨**：在测试账户跨时段取 API 用量明细，按模型/缓存命中区分实际账单，并核宿主时钟。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 日历过期和计费范围有何限制？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

CALENDAR 仅覆盖 2025/2026，未覆盖年份仍把周一至周五视为可进入高峰，并在 tooltip 中提示年历未覆盖。若未来某法定假日落在工作日且尚未更新插件，该日高峰时段会错误显示高峰，可能保守地错失优惠时机；对未覆盖年的假期安排不能猜。已有 2025/2026 日期也需随官方补充通知校验。本插件只呈现 DeepSeek 模型 token 价格时段，不能推断用户正在使用的模型、缓存命中、免费额度、Search/Fetch 请求计费或实际消费，不能用徽章估算完整账单。官方计价页明确价格可变，因此当前吻合是有日期的核查，不保证长期。系统时钟错误也会导致错误状态。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:72-107](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/lib/client.js#L72-L107)

日历表只有 2025/2026。

<details>
<summary>查看原文（36行）</summary>

```text

		/**
		 * Statutory holidays and make-up working weekends.
		 * `holidays` are the days that never enter peak hours; `workdays` are the
		 * weekend days worked to compensate for a holiday, kept so the tooltip can
		 * explain why such a day is still billed off-peak.
		 */
		const CALENDAR = {
			2025: {
				notice: "国务院办公厅关于2025年部分节假日安排的通知（国办发明电〔2024〕12号）",
				source: "https://www.gov.cn/gongbao/2024/issue_11726/202411/content_6989767.html",
				holidays: [
					"2025-01-01",
					"2025-01-28", "2025-01-29", "2025-01-30", "2025-01-31", "2025-02-01", "2025-02-02", "2025-02-03", "2025-02-04",
					"2025-04-04", "2025-04-05", "2025-04-06",
					"2025-05-01", "2025-05-02", "2025-05-03", "2025-05-04", "2025-05-05",
					"2025-05-31", "2025-06-01", "2025-06-02",
					"2025-10-01", "2025-10-02", "2025-10-03", "2025-10-04", "2025-10-05", "2025-10-06", "2025-10-07", "2025-10-08"
				],
				workdays: ["2025-01-26", "2025-02-08", "2025-04-27", "2025-09-28", "2025-10-11"]
			},
			2026: {
				notice: "国务院办公厅关于2026年部分节假日安排的通知（国办发明电〔2025〕7号）",
				source: "https://www.gov.cn/zhengce/zhengceku/202511/content_7047091.htm",
				holidays: [
					"2026-01-01", "2026-01-02", "2026-01-03",
					"2026-02-15", "2026-02-16", "2026-02-17", "2026-02-18", "2026-02-19", "2026-02-20", "2026-02-21", "2026-02-22", "2026-02-23",
					"2026-04-04", "2026-04-05", "2026-04-06",
					"2026-05-01", "2026-05-02", "2026-05-03", "2026-05-04", "2026-05-05",
					"2026-06-19", "2026-06-20", "2026-06-21",
					"2026-09-25", "2026-09-26", "2026-09-27",
					"2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04", "2026-10-05", "2026-10-06", "2026-10-07"
				],
				workdays: ["2026-01-04", "2026-02-14", "2026-02-28", "2026-05-09", "2026-09-20", "2026-10-10"]
			}
		};
```

</details>

**依据 2 · 源码核查**：[lib/client.js:160-186](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/lib/client.js#L160-L186)

未覆盖年份按工作日规则退化。

<details>
<summary>查看原文（27行）</summary>

```text
		function isPeakEligibleDate(ymd) {
			const calendar = CALENDAR[Number(ymd.slice(0, 4))];
			if (calendar !== undefined && calendar.holidays.includes(ymd)) return false;
			return weekdayOf(ymd) <= 5;
		}

		/** Whether minutes-of-day falls inside a peak window. @param minutes - 0…1439. */
		function inPeakWindow(minutes) {
			for (const [start, end] of PEAK_WINDOWS) if (minutes >= start && minutes < end) return true;
			return false;
		}

		/**
		 * Full billing status for an instant, in locale-independent codes.
		 * @param date - any instant.
		 * @returns `offPeak`, a `day` code (`holiday` / `makeupWeekend` / `weekend` /
		 * `workday` / `workdayUncovered`), the switch instant and the raw fields.
		 */
		function statusAt(date) {
			const clock = beijingClock(date);
			const year = Number(clock.date.slice(0, 4));
			const calendar = CALENDAR[year];
			const holiday = calendar !== undefined && calendar.holidays.includes(clock.date);
			const makeupWorkday = calendar !== undefined && calendar.workdays.includes(clock.date);
			const weekend = clock.weekday >= 6;
			const peakEligible = !weekend && !holiday;
			const offPeak = !(peakEligible && inPeakWindow(clock.minutes));
```

</details>

**依据 3 · 源码核查**：[selftest.mjs:178-184](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/selftest.mjs#L178-L184)

作者自检显式断言2027未覆盖且工作日可进高峰。

```text
// ── rule: calendar-uncovered years degrade explicitly ───────────────────────

process.stdout.write('\nrule — years without a published holiday notice (2027)\n')
const uncovered = st('2027-01-04T10:00')
check('2027 weekday peak hours still count as peak', uncovered.offPeak === false)
check('2027 day code flags the missing calendar', uncovered.calendarCovered === false && uncovered.day === 'workdayUncovered')
check('2027 weekends still off-peak', st('2027-01-09T10:00').offPeak === true)
```

**依据 4 · 作者声明**：[README.md:164-176](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/README.md#L164-L176)

作者要求新增年份时手工扩展日历。

<details>
<summary>查看原文（13行）</summary>

```text
### Calendar coverage

| Year | Notice | Holiday days | Make-up workdays |
|---|---|---|---|
| 2025 | 国办发明电〔2024〕12号 | 28 | 5 |
| 2026 | 国办发明电〔2025〕7号 | 33 | 6 |

For a year whose notice is not published yet (2027 at the time of writing) the rule
degrades to "Monday–Friday are peak-eligible" and the tooltip says **"the 2027 holiday
notice is not published yet; Monday to Friday is assumed"** instead of pretending to know.
Adding a year means appending one entry to `CALENDAR` in `lib/client.js`; the self-test
then checks its day count, duplicate-free dates, that make-up days fall on a weekend, and
that an official `source` URL is recorded.
```

</details>

#### 缺口

- 未读取用户账单、账号价格或未来官方假期/价格更新。
  **影响**：不能给出金额级节省或长期准确保证。
  **进一步探讨**：每次年份更新核官方通知与计价页，使用真实账单对照多模型和工具请求类别。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、兼容和改进验证是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

包以 DSH bundle + Web client 形式分发，README 称可用 github: spec 添加且热加载，也提供会修改 DSH home/profile 的 install.mjs 备选。package 声明 Node>=18、DSH/Cordis 客户端相关 peer 版本；这些与宿主实际兼容均是固定材料或作者说明，本轮未安装验证。UI 抢占 sidebar.brand.name 单一 slot 的 -1 优先级并重绘官方 wordmark，折叠栏色点靠 DOM 类名查找和每秒定位，这些是易受宿主 UI 变化影响的集成点。当前可在已核官方时段的 DSH Web 个人环境观察试用，别作自动计费控制。未实现的改进假设是版本化规则/年历更新与失效告警、在 UI 明示所覆盖年份和规则核查时间；最小验证按官方边界时刻、节假日、跨年、断网、系统时钟偏差及 DSH 宽窄布局测状态正确率、误导概率与维护成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:32-80](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/README.md#L32-L80)

bundle 安装、热加载与手工脚本备选声明。

<details>
<summary>查看原文（49行）</summary>

````text
## Install

Requires a DSH installation (`dsh --version`) and Node ≥ 18. The package is a DSH
**bundle** — it declares `dsh.bundle.patch` and ships a `cordis.patch.yml` — which is what
makes the one-line install work:

```bash
# straight from GitHub (pnpm fetches the sources; this package needs no build step,
# so there is no install-script approval to grant)
dsh plugin --profile web add github:AK-blank/dsh-plugin-offpeak-badge

# …or from a local clone
git clone https://github.com/AK-blank/dsh-plugin-offpeak-badge.git
dsh plugin --profile web add ./dsh-plugin-offpeak-badge
```

The same thing from the GUI: **Plugins → Add plugin**, paste the repository URL — the
[dialog section below](#install-from-the-gui-no-terminal) lists every accepted input.

`dsh plugin` installs the dependency and appends the bundle to the profile's
`dsh.profile.bundles`; the running `dsh web` reloads the configuration **live** — no
restart. If the badge does not show up, reload the browser page once.

<details>
<summary>Alternative: script install</summary>

For deployments where the bundle path is unavailable (or if you prefer the plugin to sit in
`~/.dsh/plugins/` instead of the profile's package store), `install.mjs` wires it up by
hand: it copies the package to `~/.dsh/plugins/dsh-plugin-offpeak-badge/`, links it into
`~/.dsh/profiles/node_modules/` and appends the row to
`~/.dsh/profiles/web/cordis.patch.yml`, after a timestamped backup. Nothing outside your
DSH home is touched.

```bash
git clone https://github.com/AK-blank/dsh-plugin-offpeak-badge.git
cd dsh-plugin-offpeak-badge
node install.mjs
```

Options: `--home <dir>` (DSH home, default `$DSH_HOME` or `~/.dsh`), `--profile <name>`
(default `web`), `--dir <path>`, `--copy` (default), `--link`, `--dry-run`, `--help`.
</details>

### Install from the GUI (no terminal)

Open **Plugins** in the sidebar, click **Add plugin**, paste a spec and press **Install**.

![The installed bundle card](docs/installed.png)

````

</details>

**依据 2 · 源码核查**：[package.json:1-75](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/package.json#L1-L75)

包版本、客户端、Node 和 peer 依赖声明。

<details>
<summary>查看原文（75行）</summary>

```text
{
  "name": "dsh-plugin-offpeak-badge",
  "version": "1.0.0",
  "description": "DeepSeek API peak/off-peak billing badge for the DSH (DeepSeek Harness) Web GUI — bilingual 空闲/高峰 · Idle/Peak client plugin",
  "type": "module",
  "license": "MIT",
  "author": "AK-blank",
  "homepage": "https://github.com/AK-blank/dsh-plugin-offpeak-badge#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AK-blank/dsh-plugin-offpeak-badge.git"
  },
  "bugs": {
    "url": "https://github.com/AK-blank/dsh-plugin-offpeak-badge/issues"
  },
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "install.mjs",
    "selftest.mjs",
    "README.md",
    "README.zh-CN.md",
    "LICENSE"
  ],
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "deepseek",
    "cordis",
    "cordis-plugin",
    "client-plugin",
    "off-peak",
    "peak-pricing",
    "i18n"
  ],
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node selftest.mjs",
    "install-plugin": "node install.mjs",
    "uninstall-plugin": "node install.mjs --uninstall"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-sidebar",
        "@deepseek-ai/dsh-client-locale"
      ],
      "external": [
        "@deepseek-ai/dsh-client-ui-primitives"
      ]
    },
    "compatibility": {
      "dshReleases": {
        "0.2.0-rc.2": "compatible"
      }
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.4-0 <5.0.0-0",
    "@deepseek-ai/dsh-client-locale": ">=0.2.0-rc.1 <1.0.0-0",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.2.0-rc.1 <1.0.0-0",
```

</details>

**依据 3 · 源码核查**：[lib/client.js:486-543](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/lib/client.js#L486-L543)

折叠栏定位依赖宿主 DOM 类名与一秒轮询。

<details>
<summary>查看原文（58行）</summary>

```text
		/**
		 * Collapsed-sidebar dot, drawn into `shell.overlay` (an additive list slot).
		 *
		 * It deliberately does NOT take `sidebar.toggle.badge`: that single slot is held
		 * by the official settings plugin's DesktopUpdateBadge, which also reports a
		 * dropped/reconnecting host connection; a single slot renders only its
		 * lowest-priority registration, so taking it would swallow those signals. The
		 * overlay dot is positioned from the collapse button's viewport rectangle and
		 * follows it with a 1 s poll plus a resize listener.
		 */
		function RailStatusDot({ t }) {
			const status = useStatus();
			const [anchor, setAnchor] = React.useState(null);
			React.useEffect(() => {
				const measure = () => {
					const toggle = document.querySelector('[class*="_toggle"]');
					const rail = toggle === null ? null : toggle.closest('[class*="_collapsed"]');
					if (toggle === null || rail === null) {
						setAnchor(null);
						return;
					}
					const box = toggle.getBoundingClientRect();
					if (box.width === 0) {
						setAnchor(null);
						return;
					}
					const next = { right: window.innerWidth - box.right, bottom: window.innerHeight - box.bottom };
					setAnchor((previous) => previous !== null && previous.right === next.right && previous.bottom === next.bottom ? previous : next);
				};
				measure();
				window.addEventListener("resize", measure);
				const timer = window.setInterval(measure, 1000);
				return () => {
					window.removeEventListener("resize", measure);
					window.clearInterval(timer);
				};
			}, []);
			if (anchor === null) return null;
			const dot = React.createElement("span", {
				style: {
					position: "fixed",
					right: anchor.right + 6,
					bottom: anchor.bottom + 6,
					width: 8,
					height: 8,
					borderRadius: "50%",
					cornerShape: "round",
					pointerEvents: "auto",
					background: status.offPeak ? "var(--dsw-alias-state-success-primary)" : "var(--dsw-alias-state-warn-primary)",
					boxShadow: "0 0 0 1.5px var(--dsw-alias-bg-base)"
				}
			});
			return React.createElement(
				Tooltip,
				{ label: () => tooltipText(t, status, new Date()), side: "right", portal: true, delayMs: 120, maxWidth: 320 },
				dot
			);
		}
```

</details>

**依据 4 · 源码核查**：[lib/client.js:563-579](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/lib/client.js#L563-L579)

品牌 slot 优先级 -1 与 overlay 注册。

<details>
<summary>查看原文（17行）</summary>

```text
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, DICTIONARIES), "offpeak-badge: dictionaries");
			// priority -1: `sidebar.brand.name` is a single slot and only its
			// lowest-priority registration renders, so taking it over is the only way to
			// put the badge next to the official wordmark (which this plugin re-renders).
			ctx.slots.inject("sidebar.brand.name", () => ctx.slots.register(
				{ name: "sidebar.brand.name", priority: -1, locale: NS },
				BrandNameWithOffPeak
			));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register(
				{ name: "shell.overlay", id: "offpeak-badge.rail", priority: 0, locale: NS },
				RailStatusDot
			));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register(
				{ name: "shell.overlay", id: "offpeak-badge.announcement", priority: 0, locale: NS },
				StatusAnnouncement
			));
```

</details>

#### 缺口

- 未在 DSH 0.2.0-rc.2 或其它真实宿主版本验证安装、slot 竞争与热加载。
  **影响**：不能确认作者标记的兼容性。
  **进一步探讨**：隔离 profile 逐项验收安装、卸载、展开/折叠、重载和读屏。
- 未来规则同步/失效告警未实现。
  **影响**：长期准确性取决于人工维护。
  **进一步探讨**：增加有来源和核查时间的版本化规则后，跨年回归与实际账单对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
