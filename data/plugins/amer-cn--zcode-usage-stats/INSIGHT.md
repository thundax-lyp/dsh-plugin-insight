# zcode-usage-stats

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[9a43816](https://github.com/Amer-CN/zcode-usage-stats/tree/9a4381658e754515dac50611da461970462032ec)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Amer-CN/zcode-usage-stats) [![npm 30d 157](https://img.shields.io/static/v1?label=npm+30d&message=157&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/zcode-usage-stats) [![最新发布 2026-09-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/zcode-usage-stats)
<!-- END META -->

> **实现功能**：在 DSH 设置页展示全历史会话 Token 用量与模型/日期趋势的本地统计面板。

> **核心亮点**：把历史 Token 分布按时间和模型本地可视化，并对路由显式调用宿主信任栅栏。详见[Q01](#research-q01)。

> **风险与缺陷**：“全历史”扫描遇 deadline 可能只包含部分会话且仍 ok:true，总 sessionCount 未区分已处理数；费用与字段相加口径需核。详见[Q03](#research-q03)。

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
  - [Q01 · 统计面板给谁看，覆盖哪些可决策信息？](#detail-section-11)
  - [Q02 · 历史事件如何转成日、小时、模型数据？](#detail-section-12)
  - [Q03 · 20 秒扫描超时是否意味着统计完整或严格限时？](#detail-section-13)
  - [Q04 · 本地缓存和 API 的新鲜度、安全边界是什么？](#detail-section-14)
  - [Q05 · 何时可用作资源管理，哪些数据必须复核？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人/团队操作者查看模型消耗与活跃日，发现高用量时期；非账单结算。详见[Q01](#research-q01)。

手动查询会话或官方用量账单可追踪成本；面板省聚合步骤但不能替代账单。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 历史 Token 汇总 | 用量趋势 | usage 口径需对账 |
| 本地缓存/SWR | 首屏速度 | 陈旧/部分数据 |
| 图表交互 | 模型/日期探索 | 目标 UI 未验证 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| sessionPersistence | 必需 | 全历史回放 | 无统计 |
| webServer/connection | 必需 | 受栅栏 API | 无数据/拒绝 |
| DSH Web 客户端 slots | 必需 | 设置页与 SVG | 无面板 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 安装 | profile 加包、重启 | 设置页出现 |
| 浏览 | 切日期/模型图表 | 查 warnings 与 generatedAt |
| 刷新 | 点击刷新强制扫描 | 核响应完成与延迟 |
| 对账 | 抽样源事件 | 再作预算判断 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 安装 | DSH Web，价格未知 | 装插件/重启 | 版本兼容未测 |
| 扫描 | 最多8并发回放全历史、缓存磁盘 | 观察 warnings/刷新 | 20秒非硬上限 |
| 对账 | 聚合数据与本地缓存 | 核 usage 口径 | 非账单真相源 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 历史图表 | 日期/小时/模型聚合 | 真实视觉与决策收益 |
| 本地缓存 | SWR 与磁盘恢复 | 当前会话实时准确 |
| 安全 API | requestRejection 调用 | 宿主鉴权细节 |

> **思考**：“全历史”扫描遇 deadline 可能只包含部分会话且仍 ok:true，总 sessionCount 未区分已处理数；费用与字段相加口径需核。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把历史 Token 分布按时间和模型本地可视化，并对路由显式调用宿主信任栅栏。详见[Q01](#research-q01)。

把历史 Token 分布按时间和模型本地可视化，并对路由显式调用宿主信任栅栏。详见[Q01](#research-q01)。

事件聚合、SWR 和显式信任栅栏可参考；部分结果的 ok 状态与超时语义需修。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

“全历史”扫描遇 deadline 可能只包含部分会话且仍 ok:true，总 sessionCount 未区分已处理数；费用与字段相加口径需核。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可作为本地趋势观察，财务或预算决策前必须核源事件、完整率和账单口径。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可核统计/缓存/鉴权调用；20秒只阻止新任务，超时可返回 ok:true 的部分汇总，真实 usage 字段口径未独立核对。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.mjs、build/body.js、lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、lib/index.mjs、build/body.js、包声明和生成的 client 入口；未运行插件/测试/目标 DSH，旧 META 仅复用。
- 下一步：目标 DSH 抽样源事件/账单，测试部分超时、坏会话/大历史、缓存复启、鉴权和两主题/减动效 UI。

**分析版本**

- **仓库**：[Amer-CN/zcode-usage-stats](https://github.com/Amer-CN/zcode-usage-stats)
- **版本号**：0.1.0（[固定提交 9a43816](https://github.com/Amer-CN/zcode-usage-stats/tree/9a4381658e754515dac50611da461970462032ec)）
- **版本日期**：2026-09-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进是部分统计显著标记、扫描完成数/中止、缓存 schema 指纹和账单对照。详见[Q05](#research-q05)。

目标 DSH 抽样源事件/账单，测试部分超时、坏会话/大历史、缓存复启、鉴权和两主题/减动效 UI。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 1124 | 965 | 88 | — |
| .mjs | source | 1 | 416 | 351 | 58 | — |
| .md | source | 1 | 176 | — | — | 1859 |
| .cjs | test | 4 | 530 | 467 | 50 | — |

</details>

**活跃度**

[![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Amer-CN/zcode-usage-stats/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A01%3A43.721Z..2026-10-21T08%3A01%3A43.721Z)

暂未获取：Issue 未关闭、近30天新建。

统计日期：2026-10-21。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地 Token 统计是否完整、及时、可追溯，并能避免部分扫描误导？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 统计面板给谁看，覆盖哪些可决策信息？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件面向想在 DSH 内了解历史 Token 消耗的个人/团队操作者，设置页显示总量、峰值、连续活跃天数、趋势、模型分布与日历热力图，支持今天/近 7 日/全部/自定义时段。它可帮助找高用量模型和异常日，但不提供账单价格、预算阈值或成本因果分析。README 的截图、WCAG AA 和“纯本地/无需依赖”是作者展示/声明，本轮只核固定源码与资产，未复现界面或独立测对比度。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-39](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/README.md#L20-L39)

作者功能/可视化声明

<details>
<summary>查看原文（20行）</summary>

```text
一个装进 DSH 设置页的「Token 记账本」。扫描 `~/.dsh` 下的全历史会话，把每一枚 token 按天、按小时、按模型算清楚：今天写了多少、哪个模型最费、哪天是巅峰。**纯本地扫描、本地聚合、本地渲染**——数据不出本机。

> ⚠️ 非官方社区插件，与 DeepSeek / ZCode 无关联。"zcode" 仅为致敬对象与包名沿用。

## 📸 界面预览

| ☀️ 浅色主题 | 🌙 深色主题 |
|:---:|:---:|
| <img src="assets/usage-stats.png" width="400" alt="浅色主题"> | <img src="assets/usage-stats2.png" width="400" alt="深色主题"> |

## ✨ 功能特性

| 模块 | 说明 |
|------|------|
| 📅 **时间范围** | 今天 / 昨天 / 近 7 天 / 近 30 天 / 本月 / 上月 / 全部 / 自定义区间（起止自动校验防倒序） |
| 🔥 **活跃分布** | 日历点阵热力图：一格一天，点面积 = 当日 Token（sqrt 换算）；每日 / 每周 / 累计三档分桶；峰值日虚线圈标注 |
| 📈 **用量趋势** | 一条线一个模型，圆点 = 当期用量，峰值直接标数；悬停看各模型分项，图例可点击显隐 |
| 🍩 **模型用量** | 刻度环仪表盘：100 刻 = 100%，每 10 刻一枚锚点；扇形命中区悬停查看模型明细；模型超过 6 个自动并「其他」防撞色 |
| 🧮 **顶部指标** | 累计 Token / 单日峰值 / 最长会话时长 / 当前连续天数 / 最长连续天数 |
| ♿ **无障碍与体验** | WCAG AA 对比度（明暗双主题逐项核算）、`prefers-reduced-motion` 降级、透明命中层让小点也轻松悬停、深浅主题跟随 DSH |
```

</details>

**依据 2 · 作者声明**：[README.md:74-92](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/README.md#L74-L92)

作者设计与数据口径声明

<details>
<summary>查看原文（19行）</summary>

```text
## 🎨 设计与实现

| 设计点 | 说明 |
|--------|------|
| **图表** | 手写 SVG（日历点阵 / 发丝折线 / 刻度环），零运行时图表库依赖 |
| **配色** | 自研双轨色板：类目色 6 个跨色相承载模型身份，序数色单色相明度阶承载用量大小；两套主题均满足 WCAG AA，类目色两两色距核算保证一眼可分 |
| **排版** | 固定 px 字阶 + 4 的倍数间距阶梯；图表按 ResizeObserver 实测容器宽度 1:1 出图，不做等比缩放，字号真实可读 |
| **命中区** | 视觉元素不绑事件：热力图逐格透明矩形、刻度环整圈扇形 path，悬停不闪烁 |
| **服务端** | 复用宿主 `sessionPersistence` 聚合；内存 + 磁盘双层缓存，SWR 过期后台刷新，首屏不因全量扫描卡顿 |
| **安全** | `/api/usage-stats` 自行通过宿主 `connection.requestRejection` 信任栅栏鉴权 |

## 🔢 数据口径

| 指标 | 口径 |
|------|------|
| Token 用量 | 以 `assistant/message` 事件携带的全量 `usage` 为准（input + output + cacheRead + cacheWrite），按 `turn:step` 去重防重复计数 |
| Turns | 以 `step/end` 事件按新 turn 计数（覆盖 completed / failed / cancelled） |
| 模型归属 | 优先取消息自身 `model`，回退 `request/context` 当前模型，再回退归并为 `other` |
| 活跃日 | 当天有 ≥1 条 usage 事件；连续天数按活跃日相邻日推算 |
```

</details>

**依据 3 · 源码核查**：[build/body.js:105-125](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/build/body.js#L105-L125)

多时间范围计算

<details>
<summary>查看原文（21行）</summary>

```text
			{ id: "today", label: "今天", build: (now) => [rangeKeyOf(now.getFullYear(), now.getMonth() + 1, now.getDate())] },
			{ id: "yesterday", label: "昨天", build: (now) => { const d = new Date(now); d.setDate(now.getDate() - 1); return [rangeKeyOf(d.getFullYear(), d.getMonth() + 1, d.getDate())]; } },
			{ id: "last7", label: "近 7 天", build: (now) => { const a = []; for (let i = 6; i >= 0; i--) { const d = new Date(now); d.setDate(now.getDate() - i); a.push(rangeKeyOf(d.getFullYear(), d.getMonth() + 1, d.getDate())); } return a; } },
			{ id: "last30", label: "近 30 天", build: (now) => { const a = []; for (let i = 29; i >= 0; i--) { const d = new Date(now); d.setDate(now.getDate() - i); a.push(rangeKeyOf(d.getFullYear(), d.getMonth() + 1, d.getDate())); } return a; } },
			{ id: "month", label: "本月", build: (now) => { const y = now.getFullYear(), m = now.getMonth() + 1; const last = new Date(y, m, 0).getDate(); const to = Math.min(last, now.getDate()); const a = []; for (let i = 1; i <= to; i++) a.push(rangeKeyOf(y, m, i)); return a; } },
			{ id: "prevMonth", label: "上月", build: (now) => { const p = new Date(now.getFullYear(), now.getMonth() - 1, 1); const y = p.getFullYear(), m = p.getMonth() + 1; const last = new Date(y, m, 0).getDate(); const a = []; for (let i = 1; i <= last; i++) a.push(rangeKeyOf(y, m, i)); return a; } },
			{ id: "all", label: "全部", build: () => [] },
		];

		function customKeys(from, to) {
			const a = [];
			if (!from || !to || from > to) return a;
			let k = from, guard = 0;
			while (k <= to && guard < 3660) { a.push(k); k = addDays(k, 1); guard++; }
			return a;
		}
		function resolveWindow(range, now = new Date()) {
			const r = typeof range === "string" ? { id: range } : (range || {});
			if (r.id === "custom") {
				const dateKeys = customKeys(r.from, r.to);
				return { id: "custom", label: r.from || r.to ? (r.from + " 至 " + r.to) : "自定义", dateKeys };
```

</details>

**依据 4 · 源码核查**：[build/body.js:710-810](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/build/body.js#L710-L810)

设置页数据/图表与警告

<details>
<summary>查看原文（101行）</summary>

```text
			const [range, setRange] = react.useState({ id: "last30" });
			const [showCustom, setShowCustom] = react.useState(false);
			const [from, setFrom] = react.useState("");
			const [to, setTo] = react.useState("");

			const load = react.useCallback(async (force) => {
				setLoading(true);
				try {
					const res = await fetch("/api/usage-stats" + (force ? "?refresh=1" : ""), { credentials: "same-origin" });
					if (!res.ok) throw new Error("HTTP " + res.status);
					const json = await res.json();
					if (!json || json.ok === false) throw new Error((json && json.error) || "响应异常");
					setData(json);
					setError(null);
				} catch (e) {
					setError(String((e && e.message) || e));
				}
				setLoading(false);
			}, []);

			react.useEffect(() => { load(false); }, [load]);

			const days = (data && data.days) || [];
			const hasData = days.length > 0;
			const wnd = react.useMemo(() => {
				if ((typeof range === "string" ? range : range.id) === "all") {
					return { id: "all", label: "全部", dateKeys: days.map((d) => d.date).sort() };
				}
				return resolveWindow(range);
			}, [range, days]);

			if (loading && !data) {
				return element("div", { className: "ust-root" },
					element("div", { className: "ust-skeleton", style: { width: "40%" } }),
					element("div", { className: "ust-skeleton", style: { width: "100%", height: 96 } }),
					element("div", { className: "ust-placeholder" }, "统计加载中"),
				);
			}
			if (error && !data) {
				return element("div", { className: "ust-root" },
					element("div", { className: "ust-warn" }, "加载失败：" + error),
					element("div", { className: "ust-actions", style: { marginTop: 16 } },
						element("button", { className: "ust-btn", onClick: () => load(true) }, "重试")),
				);
			}

			const stats = calcStats(days, wnd);
			const winList = modelTotalsIn(days, wnd);
			const winTop = winList.length ? [...winList].sort((a, b) => b.total - a.total)[0] : null;
			const topName = winTop ? winTop.model : ((data.topModel && data.topModel.name) || "无");
			const topSub = winTop && stats.total > 0
				? "占本窗口 " + Math.round((winTop.total / stats.total) * 100) + "%"
				: "";
			const avgPerActive = stats.activeDays > 0 ? stats.total / stats.activeDays : 0;
			const invalid = !!(from && to && from > to);

			return element("div", { className: "ust-root" },
				element(SummaryMetrics, { summary: data.summary }),
				element("div", { className: "ust-header" },
					element("h1", { className: "ust-page-title" }, "使用统计"),
					element("div", { className: "ust-rangebox" },
						element("div", { className: "ust-tabs", role: "tablist" },
							RANGES.map((r) => element("span", {
								key: r.id, role: "tab", "aria-selected": range.id === r.id,
								className: "ust-tab" + (range.id === r.id ? " active" : ""),
								onClick: () => { setRange({ id: r.id }); setShowCustom(false); },
							}, r.label)),
							element("span", {
								role: "tab", "aria-selected": range.id === "custom",
								className: "ust-tab" + (range.id === "custom" ? " active" : ""),
								onClick: () => setShowCustom((v) => !v),
							}, "自定义"),
						),
						showCustom ? element("div", { className: "ust-custom" },
							element("div", { className: "ust-custom-row" },
								element("input", { className: "ust-date", type: "date", value: from, max: to || undefined, "aria-label": "开始日期", onChange: (e) => setFrom(e.target.value) }),
								element("span", { className: "ust-custom-sep" }, "至"),
								element("input", { className: "ust-date", type: "date", value: to, min: from || undefined, "aria-label": "结束日期", onChange: (e) => setTo(e.target.value) }),
							),
							invalid ? element("div", { className: "ust-warn" }, "结束日期不能早于开始日期") : null,
							element("div", { className: "ust-custom-actions" },
								element("button", { className: "ust-btn ust-btn--ghost", onClick: () => { setShowCustom(false); setFrom(""); setTo(""); } }, "取消"),
								element("button", {
									className: "ust-btn ust-btn--primary",
									disabled: !(from && to) || invalid,
									onClick: () => { setRange({ id: "custom", from, to }); setShowCustom(false); },
								}, "应用"),
							),
						) : null,
					),
				),
				element("div", { className: "ust-metrics" },
					element(Metric, { icon: element(IconToken), label: "窗口 Token", value: fmtLarge(stats.total), sub: fmtFull(stats.total) }),
					element(Metric, { icon: element(IconCalendar), label: "活跃天数", value: String(stats.activeDays) + " 天", sub: "有用量的天" }),
					element(Metric, { icon: element(IconTrend), label: "日均", value: fmtLarge(avgPerActive), sub: "按活跃天平均" }),
					element(Metric, { icon: element(IconChat), label: "会话累计", value: fmtFull((data && data.sessionCount) || 0), sub: "全部历史" }),
					element(Metric, { icon: element(IconMail), label: "消息累计", value: fmtFull((data && data.messageCount) || 0), sub: "全部历史" }),
					element(Metric, { icon: element(IconBolt), label: "最常用模型", value: topName, sub: topSub, text: true }),
				),
				wnd.dateKeys.length === 0 ? element("div", { className: "ust-warn" }, "当前时间范围没有数据") : null,
				data.warnings && data.warnings.length > 0 ? element("div", { className: "ust-warn" }, data.warnings.join("；")) : null,
```

</details>

#### 缺口

- 目标用户是否据此减少消耗、图表无障碍未测
  **影响**：不能把显示统计直接等同节费收益
  **进一步探讨**：目标数据和两主题 UI 可用性/决策试验

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 历史事件如何转成日、小时、模型数据？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 从 sessionPersistence.list 枚举历史会话，再以 readFrom 或 open/read 回放；每会话跟踪 request/context 的模型，在 assistant/message 的 usage 上按 turn:step 去重，并按本地日/小时聚合 input/output/cacheRead/cacheWrite；step/end 按新 turn 计数。无 usage 的消息不进 Token，模型缺失归 other，活跃天按有 usage 的消息计算。输出还带失败/超时 warnings，客户端仅读聚合 API，不直接访问原始会话。真实 DSH usage 是否各字段互斥、历史迁移是否完整未核。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:84-103](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/lib/index.mjs#L84-L103)

指标字段累加

<details>
<summary>查看原文（20行）</summary>

```text
function emptyMetrics() {
  return { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 };
}

function addMetrics(target, usage) {
  const input = typeof usage?.inputTokens === "number" ? usage.inputTokens : 0;
  const output = typeof usage?.outputTokens === "number" ? usage.outputTokens : 0;
  const cacheRead = typeof usage?.cacheReadTokens === "number" ? usage.cacheReadTokens : 0;
  const cacheWrite = typeof usage?.cacheWriteTokens === "number" ? usage.cacheWriteTokens : 0;
  target.input += input;
  target.output += output;
  target.cacheRead += cacheRead;
  target.cacheWrite += cacheWrite;
  target.total += input + output + cacheRead + cacheWrite;
}

function usageTotal(usage) {
  if (!usage) return 0;
  return (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0) + (usage.cacheReadTokens ?? 0) + (usage.cacheWriteTokens ?? 0);
}
```

</details>

**依据 2 · 源码核查**：[lib/index.mjs:167-249](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/lib/index.mjs#L167-L249)

历史读取/事件处理/去重

<details>
<summary>查看原文（83行）</summary>

```text
  let sessions;
  let messageCount = 0;
  try {
    sessions = sessionPersistence.list ? await sessionPersistence.list() : [];
  } catch (e) {
    sessions = [];
    warnings.push("无法枚举会话：" + (e && e.message ? e.message : e));
  }

  const scanOne = async (snapshot) => {
    // list() 项可能是 { header, ... } 快照,也可能直接就是 header(版本差异),两种都兼容
    const header = snapshot && typeof snapshot === "object" && snapshot.header ? snapshot.header : snapshot;
    let events;
    try {
      if (typeof sessionPersistence.readFrom === "function") {
        // 旧接口(0.1.0-rc.5 时代):service 级 readFrom
        ({ events } = await sessionPersistence.readFrom(header.id, 0));
      } else {
        // 0.1.5-rc.1:handle 式接口(官方 dsh-message-feedback 同一用法)
        const handle = await sessionPersistence.open(header.id, "read");
        try {
          ({ events } = await handle.read(0));
        } finally {
          await handle.close();
        }
      }
    } catch (e) {
      warnings.push("会话读取失败 " + (header.id ?? "?") + "：" + (e && e.message ? e.message : e));
      return;
    }
    // currentModel 缺失时归一为 "other"(杂项),避免 unknown 散落为独立饼块(规范 H6)
    let currentModel = "other";
    let lastTurn = null;
    let lastTime = null; // 会话内最后事件 time(毫秒)
    const seenSteps = new Set();
    const accountOnce = (model, ev, usage) => {
      const turn = ev.data?.turn;
      const step = ev.data?.step;
      if (typeof turn === "number" && typeof step === "number") {
        const stepKey = `${turn}:${step}`;
        if (seenSteps.has(stepKey)) return;
        seenSteps.add(stepKey);
      }
      account(dateKey(ev.time), hourOf(ev.time), model, usage);
    };
    for (const ev of events || []) {
      if (!ev || typeof ev !== "object") continue;
      if (typeof ev.time === "number") lastTime = ev.time;
      switch (ev.type) {
        case "request/context":
          currentModel = ev.data && typeof ev.data.model === "string" ? ev.data.model : currentModel;
          break;
        case "step/end":
          // turns 官方口径:一个新 turn 记 1 次。以 step/end 为权威——每个 step 必然发出,
          // 覆盖 completed/failed/cancelled/max-tokens;而 assistant/message 会漏 cancelled、多算 max-tokens。
          if (typeof ev.data.turn === "number" && ev.data.turn !== lastTurn) {
            lastTurn = ev.data.turn;
            const key = dateKey(ev.time);
            if (key) ensureDay(key).turns += 1;
          }
          break;
        case "assistant/message":
          messageCount += 1;
          // usage 只在每步一次的全量 assistant/message 上取;assistant/chunk 的 usage 是同一步的相同全量值,再计会重复,故不再消费
          if (ev.data && ev.data.usage !== undefined) {
            const activeKey = dateKey(ev.time);
            if (activeKey) usageDays.add(activeKey);
            // 优先从消息自身识别模型(兜底 currentModel / other)
            const m = ev.data && typeof ev.data.model === "string" ? ev.data.model : currentModel;
            accountOnce(m, ev, ev.data.usage);
          }
          break;
        default:
          break;
      }
    }
    // 最长聊天时长:会话内最后事件 time − 会话 createdAt(异常/倒挂的会话不计)
    const createdAt = header && typeof header.createdAt === "number" ? header.createdAt : null;
    if (typeof lastTime === "number" && createdAt !== null && lastTime > createdAt) {
      const dur = lastTime - createdAt;
      if (dur > longestSessionMs) longestSessionMs = dur;
    }
  };
```

</details>

**依据 3 · 源码核查**：[lib/index.mjs:251-275](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/lib/index.mjs#L251-L275)

并发扫描与摘要

<details>
<summary>查看原文（25行）</summary>

```text
  // 有限并发读取会话(规范 H4);越期自动停止(规范 H5 超时保护)
  await mapLimit(sessions || [], 8, deadline, scanOne);
  if (Date.now() > deadline) warnings.push("扫描超时，返回部分统计结果");

  // 计算当前连续活跃天数
  let currentStreak = 0;
  const sortedDates = [...days.keys()].sort();
  if (sortedDates.length > 0) {
    const todayKey = dateKey(Date.now());
    const lastActive = sortedDates[sortedDates.length - 1];
    if (lastActive === todayKey) {
      currentStreak = 1;
      const d = new Date();
      while (true) {
        d.setDate(d.getDate() - 1);
        if (days.has(dateKey(d.getTime()))) {
          currentStreak += 1;
        } else {
          break;
        }
      }
    }
  }

  return { days, hourly, modelTotals, sessionCount: sessions.length, messageCount, currentStreak, streaks: computeStreaks(usageDays), longestSessionMs, warnings };
```

</details>

**依据 4 · 作者声明**：[README.md:85-92](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/README.md#L85-L92)

作者口径说明

```text
## 🔢 数据口径

| 指标 | 口径 |
|------|------|
| Token 用量 | 以 `assistant/message` 事件携带的全量 `usage` 为准（input + output + cacheRead + cacheWrite），按 `turn:step` 去重防重复计数 |
| Turns | 以 `step/end` 事件按新 turn 计数（覆盖 completed / failed / cancelled） |
| 模型归属 | 优先取消息自身 `model`，回退 `request/context` 当前模型，再回退归并为 `other` |
| 活跃日 | 当天有 ≥1 条 usage 事件；连续天数按活跃日相邻日推算 |
```

#### 缺口

- 目标 usage schema 与实际会话样本未审
  **影响**：不能称精确账单或独立审计值
  **进一步探讨**：抽历史会话人工对照 usage 与供应商账单

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 20 秒扫描超时是否意味着统计完整或严格限时？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

mapLimit 在派发下一会话前检查 deadline，但已启动的最多8个读取任务会 await 完成，没有 abort；读完后若过期仅在 warnings 写“扫描超时，返回部分统计结果”。因此 20 秒不是硬超时，而且结果仍标 ok:true、sessionCount 为 list 的总数，即使只处理部分会话。前端显示 warnings，但顶部数字和图表仍以部分结果呈现，若忽略警告容易误判总体用量。初始无缓存时要等待扫描完成。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:105-119](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/lib/index.mjs#L105-L119)

超时只阻止未派发任务

<details>
<summary>查看原文（15行）</summary>

```text
// 有限并发池:最多并发 limit 个任务;超过 deadline(ms) 提前返回部分结果(已处理的计入)
async function mapLimit(items, limit, deadline, fn) {
  const out = new Array(items.length);
  let i = 0;
  const run = async () => {
    while (i < items.length) {
      if (Date.now() > deadline) return; // 超时:跳过未处理项,保留已处理结果(部分结果)
      const cur = i++;
      out[cur] = await fn(items[cur], cur);
    }
  };
  const n = Math.max(1, Math.min(limit || 8, items.length) || 1);
  await Promise.all(Array.from({ length: n }, run));
  return out;
}
```

</details>

**依据 2 · 源码核查**：[lib/index.mjs:251-275](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/lib/index.mjs#L251-L275)

部分结果 warning 仍返回总会话数

<details>
<summary>查看原文（25行）</summary>

```text
  // 有限并发读取会话(规范 H4);越期自动停止(规范 H5 超时保护)
  await mapLimit(sessions || [], 8, deadline, scanOne);
  if (Date.now() > deadline) warnings.push("扫描超时，返回部分统计结果");

  // 计算当前连续活跃天数
  let currentStreak = 0;
  const sortedDates = [...days.keys()].sort();
  if (sortedDates.length > 0) {
    const todayKey = dateKey(Date.now());
    const lastActive = sortedDates[sortedDates.length - 1];
    if (lastActive === todayKey) {
      currentStreak = 1;
      const d = new Date();
      while (true) {
        d.setDate(d.getDate() - 1);
        if (days.has(dateKey(d.getTime()))) {
          currentStreak += 1;
        } else {
          break;
        }
      }
    }
  }

  return { days, hourly, modelTotals, sessionCount: sessions.length, messageCount, currentStreak, streaks: computeStreaks(usageDays), longestSessionMs, warnings };
```

</details>

**依据 3 · 源码核查**：[lib/index.mjs:341-362](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/lib/index.mjs#L341-L362)

构建 ok:true 摘要

<details>
<summary>查看原文（22行）</summary>

```text
  const peakDayTokens = dayList.reduce((mx, d) => Math.max(mx, d.total), 0);
  const summary = {
    totalTokens: grandTotal, // 累计 Token 数
    peakDayTokens, // 峰值 Token 数(历史单日最大)
    longestSessionMs: s.longestSessionMs || 0, // 最长聊天时长
    currentStreak: s.streaks ? s.streaks.current : 0, // 当前连续天数
    longestStreak: s.streaks ? s.streaks.longest : 0, // 最长连续天数
  };
  return {
    ok: true,
    generatedAt: Date.now(),
    sessionCount: s.sessionCount,
    messageCount: s.messageCount,
    dayCount: dayList.length,
    currentStreak: s.currentStreak,
    summary,
    grandTotal,
    topModel,
    totals,
    days: dayList,
    warnings: s.warnings, // 失败/降级提示(规范 H5)
  };
```

</details>

**依据 4 · 源码核查**：[lib/index.mjs:402-414](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/lib/index.mjs#L402-L414)

无缓存同步扫描

<details>
<summary>查看原文（13行）</summary>

```text
      const url = new URL(req.url, "http://x");
      const refresh = url.searchParams.get("refresh") === "1";
      if (!cache || refresh) {
        // 无缓存:必须同步扫描首屏等待;或强制刷新:等待新结果
        await ensureScan();
      } else {
        // 有缓存:立即返回;若过期则后台异步刷新,不阻塞本次响应(SWR)
        const stale = Date.now() - (cache.generatedAt || 0) > CACHE_TTL;
        if (stale) ensureScan();
      }
      res.writeHead(cache && cache.ok ? 200 : 500, { "Content-Type": "application/json" });
      res.end(JSON.stringify(cache));
    },
```

</details>

**依据 5 · 源码核查**：[build/body.js:810-810](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/build/body.js#L810-L810)

前端警告显示

```text
				data.warnings && data.warnings.length > 0 ? element("div", { className: "ust-warn" }, data.warnings.join("；")) : null,
```

#### 缺口

- 目标海量/坏会话耗时及用户感知未测
  **影响**：不能把部分结果当“全历史”确定总数
  **进一步探讨**：大历史夹慢会话测进度/完整率并显著标记 partial

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本地缓存和 API 的新鲜度、安全边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

内存缓存 60 秒后先返回旧值、后台刷新，启动可读 ~/.dsh/profiles/web/usage-stats-cache.json；refresh=1 强制等待重扫，磁盘写 tmp 后 rename 失败降级覆盖。API 路由手动调用 connection.requestRejection，缺连接服务时拒绝；Host/Origin/cookie 的具体检查由宿主服务承担，本轮未核。旧缓存没有固定版本/会话增量指纹校验，生成时间仅决定刷新；落盘缓存含按日/模型聚合而非原文，但仍会暴露使用习惯给能读该文件或通过授权 API 的主体。

磁盘路径固定 HOME 下 web profile，模块级 cache/inflight 也不按当前 sessionPersistence 分区；若同进程加载不同持久源或多个 profile 共用 HOME，缓存可能混用范围。这是条件性范围问题，不能据此推断匿名读取，入口仍有失败关闭的 requestRejection。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:278-310](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/lib/index.mjs#L278-L310)

SWR/磁盘路径与写法

<details>
<summary>查看原文（33行）</summary>

```text
// ---------- 缓存 ----------
// 内存 + 磁盘双层缓存;SWR:过期后先返回旧数据、后台异步刷新,首屏不因全量扫描阻塞。
let cache = null;
let cacheAt = 0;
const CACHE_TTL = 60_000; // 60s 后触发后台刷新(SWR)
let inflight = null; // 并发重扫互斥:并发期间共享同一份扫描结果(规范 H3)

function cacheFilePath() {
  return join(homedir(), ".dsh", "profiles", "web", "usage-stats-cache.json");
}

async function loadDiskCache() {
  try {
    const s = await readFile(cacheFilePath(), "utf8");
    const j = JSON.parse(s);
    if (j && typeof j === "object" && (j.ok || j.error)) return j;
    return null;
  } catch {
    return null;
  }
}

async function persistDiskCache(data) {
  const p = cacheFilePath();
  const tmp = p + ".tmp";
  try {
    await mkdir(dirname(p), { recursive: true });
    await writeFile(tmp, JSON.stringify(data), "utf8");
    await rename(tmp, p).catch(() => writeFile(p, JSON.stringify(data), "utf8"));
  } catch {
    // 写盘失败不影响主流程(下次启动退化回全量扫描)
  }
}
```

</details>

**依据 2 · 源码核查**：[lib/index.mjs:365-415](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/lib/index.mjs#L365-L415)

缓存/路由/信任栅栏

<details>
<summary>查看原文（51行）</summary>

```text
export function apply(ctx) {
  const { sessionPersistence, webServer, connection } = ctx;
  if (!webServer) return;

  // 启动时异步加载磁盘缓存,回填内存(不阻塞 apply)
  loadDiskCache().then((c) => { if (c && c.ok && !cache) { cache = c; cacheAt = c.generatedAt || 0; } });

  const ensureScan = () => {
    if (!inflight) {
      inflight = (async () => {
        const s = await scanSessions(sessionPersistence, { timeoutMs: 20000 });
        const built = buildCache(s);
        cache = built;
        cacheAt = built.generatedAt;
        try { await persistDiskCache(built); } catch { /* 忽略写盘失败 */ }
      })().catch((e) => {
        cache = { ok: false, error: String(e && e.message ? e.message : e), generatedAt: Date.now() };
        cacheAt = Date.now();
      }).finally(() => { inflight = null; });
    }
    return inflight;
  };

  webServer.register({
    kind: "exact",
    path: "/api/usage-stats",
    handler: async (req, res) => {
      // 本路由是 /api 下的 exact 路由,优先级高于 dsh-client-connection 挂在 /api prefix 上的
      // 信任栅栏(Host/Origin + 浏览器认证 cookie),必须自己过栅栏(官方 dsh-host-open-in-app 同一做法)。
      const rejection = connection && typeof connection.requestRejection === "function"
        ? connection.requestRejection(req)
        : 503; // 拿不到栅栏服务时拒绝服务,而不是放行
      if (rejection !== undefined) {
        res.statusCode = rejection;
        res.end(rejection === 401 ? "unauthorized" : rejection === 403 ? "forbidden" : "service unavailable");
        return;
      }
      const url = new URL(req.url, "http://x");
      const refresh = url.searchParams.get("refresh") === "1";
      if (!cache || refresh) {
        // 无缓存:必须同步扫描首屏等待;或强制刷新:等待新结果
        await ensureScan();
      } else {
        // 有缓存:立即返回;若过期则后台异步刷新,不阻塞本次响应(SWR)
        const stale = Date.now() - (cache.generatedAt || 0) > CACHE_TTL;
        if (stale) ensureScan();
      }
      res.writeHead(cache && cache.ok ? 200 : 500, { "Content-Type": "application/json" });
      res.end(JSON.stringify(cache));
    },
  });
```

</details>

**依据 3 · 作者声明**：[README.md:59-83](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/README.md#L59-L83)

作者本地/鉴权声明

<details>
<summary>查看原文（25行）</summary>

````text
## ⚙️ 工作原理

```
~/.dsh 会话文件
        │
        ▼  sessionPersistence 全量枚举 + 回放事件
按天 / 按小时 / 按模型聚合 ──► 内存 + 磁盘双层缓存（SWR）
        │
        ▼
GET /api/usage-stats（过宿主信任栅栏：Host/Origin + cookie）
        │
        ▼
设置页前端：手写 SVG 按实测容器宽度 1:1 出图
```

## 🎨 设计与实现

| 设计点 | 说明 |
|--------|------|
| **图表** | 手写 SVG（日历点阵 / 发丝折线 / 刻度环），零运行时图表库依赖 |
| **配色** | 自研双轨色板：类目色 6 个跨色相承载模型身份，序数色单色相明度阶承载用量大小；两套主题均满足 WCAG AA，类目色两两色距核算保证一眼可分 |
| **排版** | 固定 px 字阶 + 4 的倍数间距阶梯；图表按 ResizeObserver 实测容器宽度 1:1 出图，不做等比缩放，字号真实可读 |
| **命中区** | 视觉元素不绑事件：热力图逐格透明矩形、刻度环整圈扇形 path，悬停不闪烁 |
| **服务端** | 复用宿主 `sessionPersistence` 聚合；内存 + 磁盘双层缓存，SWR 过期后台刷新，首屏不因全量扫描卡顿 |
| **安全** | `/api/usage-stats` 自行通过宿主 `connection.requestRejection` 信任栅栏鉴权 |
````

</details>

#### 缺口

- 目标宿主栅栏行为、缓存文件权限与恢复一致性未测
  **影响**：不能以“本地”推导无隐私或实时性风险
  **进一步探讨**：目标宿主鉴权、缓存权限和强刷/重启一致性验证

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何时可用作资源管理，哪些数据必须复核？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

适合本机粗看模型和时间段的 Token 趋势。部署后应先取小样会话逐条对账，验证四项 usage 字段是否可相加、turn:step 是否稳定；再在大量会话下观察 warnings、扫描耗时、SWR 陈旧展示和手动刷新。改进方向是明确 partial/扫描完成数、可中止扫描、缓存版本与口径迁移、费用单价来源；均未实现。README 自述验收脚本不等于独立宿主复核，本轮也没有运行插件/测试。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:41-57](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/README.md#L41-L57)

作者安装/刷新指引

<details>
<summary>查看原文（17行）</summary>

````text
## 📦 安装

前置：已安装 `@deepseek-ai/dsh`（及 DSH 插件命令依赖的 `pnpm`）。

```bash
dsh plugin --profile web add zcode-usage-stats
```

> 或从 GitHub 源安装：`dsh plugin --profile web add github:Amer-CN/zcode-usage-stats`。

安装后重启 DSH 进程，打开 **设置 → 使用统计** 即可看到统计页面。

## 🚀 使用

- 顶部切换时间范围；**「全部」**显示自使用以来的所有数据。
- 趋势图悬停查看各模型分项，点击图例显隐对应模型。
- **「刷新」**强制重新扫描全部会话。
````

</details>

**依据 2 · 源码核查**：[lib/index.mjs:201-237](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/lib/index.mjs#L201-L237)

usage 去重条件

<details>
<summary>查看原文（37行）</summary>

```text
    const seenSteps = new Set();
    const accountOnce = (model, ev, usage) => {
      const turn = ev.data?.turn;
      const step = ev.data?.step;
      if (typeof turn === "number" && typeof step === "number") {
        const stepKey = `${turn}:${step}`;
        if (seenSteps.has(stepKey)) return;
        seenSteps.add(stepKey);
      }
      account(dateKey(ev.time), hourOf(ev.time), model, usage);
    };
    for (const ev of events || []) {
      if (!ev || typeof ev !== "object") continue;
      if (typeof ev.time === "number") lastTime = ev.time;
      switch (ev.type) {
        case "request/context":
          currentModel = ev.data && typeof ev.data.model === "string" ? ev.data.model : currentModel;
          break;
        case "step/end":
          // turns 官方口径:一个新 turn 记 1 次。以 step/end 为权威——每个 step 必然发出,
          // 覆盖 completed/failed/cancelled/max-tokens;而 assistant/message 会漏 cancelled、多算 max-tokens。
          if (typeof ev.data.turn === "number" && ev.data.turn !== lastTurn) {
            lastTurn = ev.data.turn;
            const key = dateKey(ev.time);
            if (key) ensureDay(key).turns += 1;
          }
          break;
        case "assistant/message":
          messageCount += 1;
          // usage 只在每步一次的全量 assistant/message 上取;assistant/chunk 的 usage 是同一步的相同全量值,再计会重复,故不再消费
          if (ev.data && ev.data.usage !== undefined) {
            const activeKey = dateKey(ev.time);
            if (activeKey) usageDays.add(activeKey);
            // 优先从消息自身识别模型(兜底 currentModel / other)
            const m = ev.data && typeof ev.data.model === "string" ? ev.data.model : currentModel;
            accountOnce(m, ev, ev.data.usage);
          }
```

</details>

**依据 3 · 源码核查**：[lib/index.mjs:278-310](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/lib/index.mjs#L278-L310)

缓存

<details>
<summary>查看原文（33行）</summary>

```text
// ---------- 缓存 ----------
// 内存 + 磁盘双层缓存;SWR:过期后先返回旧数据、后台异步刷新,首屏不因全量扫描阻塞。
let cache = null;
let cacheAt = 0;
const CACHE_TTL = 60_000; // 60s 后触发后台刷新(SWR)
let inflight = null; // 并发重扫互斥:并发期间共享同一份扫描结果(规范 H3)

function cacheFilePath() {
  return join(homedir(), ".dsh", "profiles", "web", "usage-stats-cache.json");
}

async function loadDiskCache() {
  try {
    const s = await readFile(cacheFilePath(), "utf8");
    const j = JSON.parse(s);
    if (j && typeof j === "object" && (j.ok || j.error)) return j;
    return null;
  } catch {
    return null;
  }
}

async function persistDiskCache(data) {
  const p = cacheFilePath();
  const tmp = p + ".tmp";
  try {
    await mkdir(dirname(p), { recursive: true });
    await writeFile(tmp, JSON.stringify(data), "utf8");
    await rename(tmp, p).catch(() => writeFile(p, JSON.stringify(data), "utf8"));
  } catch {
    // 写盘失败不影响主流程(下次启动退化回全量扫描)
  }
}
```

</details>

**依据 4 · 作者声明**：[README.md:131-149](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/README.md#L131-L149)

作者测试流程声明

<details>
<summary>查看原文（19行）</summary>

````text
## 🛠️ 从源码构建

`lib/client.js` 是合成产物，**请勿直接编辑**。前端真源在 `build/`：

```bash
# 1. 编辑 build/body.js（界面 + 图表）与 build/panel.css（样式 + 配色变量）
# 2. 合成
node build/assemble.cjs

# 3. 用合成结果覆盖部署文件
cp build/client.new.js lib/client.js

# 4. 验收（15 项必须全过）
bash tests/acceptance.sh
```

验收脚本会按真实面板宽度渲染出预览 HTML（`tests/preview-*.html`）并跑几何断言、WCAG 对比度与色板合规检查。默认读取本机 `~/.dsh` 下的用量缓存；可用 `USAGE_CACHE=/path/to/cache.json bash tests/acceptance.sh` 指定其它缓存，缓存不可用时自动改用内置合成数据。

> 提 PR 请改 `build/` 下的源文件，并在描述里附上 `bash tests/acceptance.sh` 的输出。
````

</details>

#### 缺口

- 真实账单对照、效能收益和数据迁移未测
  **影响**：不宜当财务结算真相源
  **进一步探讨**：源事件抽样/账单对比/大历史性能验收

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
