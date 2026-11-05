# dsh-pilot

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[fae4beb](https://github.com/momasiku/dsh-pilot/tree/fae4bebc0f044e3e875cf15e47f5cadffd4bf7d0)

<!-- BEGIN META -->
[![GitHub ★ 157](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=157&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/momasiku/dsh-pilot) [![npm 30d 9,122](https://img.shields.io/static/v1?label=npm+30d&message=9%2C122&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@momasiku/dsh-pilot) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@momasiku/dsh-pilot)
<!-- END META -->

> **功能**：为 Windows 上的 DSH 提供桌面截图、输入控制和批量动作。

> **亮点**：[Q01](#research-q01) 将多步动作和结果集中到一次调用。

> **主要限制**：[Q02](#research-q02) 风险标记与 confirm 来自调用者，批次可能部分执行。

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
  - [Q01 · 批量动作减少了哪些操作？](#detail-section-11)
  - [Q02 · 确认和失败各保证什么？](#detail-section-12)
  - [Q03 · 怎么试用及退出？](#detail-section-13)
  - [Q04 · 怎样比较实际误操作？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要让 DSH 在 Windows 应用完成一组受控 UI 操作的开发者。

人工操作窗口或在每个动作后单独观察。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面序列 | 批量操作窗口 | 仅在授权环境和已核对窗口中使用 |
| 截图 | 观察结果 | 依赖实际图像线路 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Windows 与 PowerShell | 必需 | 运行桌面动作 | 使用人工操作 |
| 图像模型 | 截图线路需要 | 接收帧 | 改用无图计划 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户隔离窗口并检查计划 | 避免真实资料 |
| 核对 | 操作者执行惰性序列 | 检查每步窗口 |
| 退出 | 停止并人工读回 | 处理已经发生的动作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 运行环境未知 | 准备兼容 profile | 未实测 |
| 持续 | 截图与模型资源 | 核对窗口状态 | 真实成本未知 |
| 恢复 | 手工处理时间未知 | 检查部分执行 | 避免盲目重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 批量 | 逐步执行与回执 | 真实可靠性 |
| 风险标记 | 声明风险才要求 confirm | 真实人工授权 |

> **思考**：[Q02](#research-q02) 风险标记与 confirm 来自调用者，批次可能部分执行。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将多步动作和结果集中到一次调用。

[Q02](#research-q02) 取消与错误属于停止后续步骤，需单独处理已完成动作。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 风险标记与 confirm 来自调用者，批次可能部分执行。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先用独立环境 dryRun。[Q02](#research-q02) 结果不明时人工核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码覆盖主要批次分支，未在 Windows 执行。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定批次源码与作者设备说明，未执行目标。
- 下一步：用惰性窗口测试坐标、授权、失败和取消。

**分析版本**

- **仓库**：[momasiku/dsh-pilot](https://github.com/momasiku/dsh-pilot)
- **版本号**：0.7.1（[固定提交 fae4beb](https://github.com/momasiku/dsh-pilot/tree/fae4bebc0f044e3e875cf15e47f5cadffd4bf7d0)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 用逐步状态前提减少错误窗口中的操作。

用惰性窗口测试坐标、授权、失败和取消。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 1916 | 1430 | 393 | — |
| .md | source | 1 | 854 | — | — | 11417 |
| .mjs | source | 6 | 971 | 718 | 170 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/momasiku/dsh-pilot/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Windows 批量桌面动作的效率与风险边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 批量动作减少了哪些操作？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

要在 Windows 应用里执行聚焦、点击、输入和读取结果的 DSH 用户，原本逐步观察或手工操作。插件允许将动作序列放在一次工具调用内，按步执行并记录成功、错误和时间。需要截图时检查模型线路可用性。作者给出截图标尺和缩放回算以定位屏幕像素，仍依赖界面和输入环境稳定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:54-75](https://github.com/momasiku/dsh-pilot/blob/fae4bebc0f044e3e875cf15e47f5cadffd4bf7d0/README.md#L54-L75)

作者任务与坐标说明

<details>
<summary>查看原文（22行）</summary>

````text
## 它到底解决了什么

桌面自动化的瓶颈**从来不是鼠标点得快不快**，而是 **"模型和电脑要来回说多少次话"**：

| 一个五步任务（聚焦窗口 → 点输入框 → 打字 → 回车 → 看结果） | 只用 DSH | DSH + dsh-pilot |
| --- | --- | --- |
| 谁在看屏幕 | 你 | 模型，看真实像素 |
| 谁在点击打字 | 你 | 模型 |
| 模型 ↔ 电脑往返次数 | 5 次（每步一次，外加你的） | **1 次** |
| 送给模型的截图 | 4–5 张 | **1 张** |
| 出错时 | 你发现、你描述 | 同一次结果里就写明哪一步、为什么 |

## 为什么坐标可信（这是"点得准"的关键）

视觉驱动点击最经典的翻车方式是"坐标差一点点"，这里堵掉了三个来源：

1. **两端都是 per-monitor DPI 感知**。非 DPI 感知的进程会被 Windows 骗——它把 2560×1600 的屏幕看成 1707×1067，于是按这种截图算出来的点击**必然偏**。传感器和执行器在做任何事之前都声明 `PER_MONITOR_AWARE_V2`，所以一个图像像素就是一个物理屏幕像素。
2. **每张图都带坐标刻度尺**：上沿与左沿每 200px 一条刻度，标注的是**屏幕坐标**（不是图像偏移），还有 `origin x,y step n` 说明。模型直接读刻度，不用数像素；刻度是屏幕坐标，所以即使图片被压缩也依然有效。
3. **信封如实说明交付尺寸**。如果宿主把图压小了，模型会收到比例与乘数；坐标契约也变成条件式——**只有在"交付尺寸 == 采集尺寸"时**才承诺"照用 x、y 即可"，否则明确要求乘多少：

```text
<delivered_scale>delivered 1974x873 = 0.873x capture; multiply image readings by 1.1454 to get screen pixels</delivered_scale>
````

</details>

**依据 2 · 源码核查**：[lib/index.js:1780-1816](https://github.com/momasiku/dsh-pilot/blob/fae4bebc0f044e3e875cf15e47f5cadffd4bf7d0/lib/index.js#L1780-L1816)

归一化、计划及截图条件

<details>
<summary>查看原文（37行）</summary>

```text
		async execute(args, exec) {
			warmWorker(config);
			const steps = normalizeSequence(args, config);
			const risk = sequenceRisk(steps, args.risk, args.confirm);
			const confirmed = args.confirm === true;

			if (args.dryRun === true) {
				return pruneAbsent({
					risk,
					confirmed,
					planned: true,
					stepCount: steps.length,
					executed: 0,
					failed: 0,
					steps: steps.map((step, offset) => ({
						index: offset + 1,
						action: step.action,
						ok: true,
						ms: 0,
						...(step.risk === undefined ? {} : { risk: step.risk }),
						...(typeof step.riskNote === 'string' ? { note: step.riskNote } : {})
					})),
					notes: ['dry run: nothing was executed']
				});
			}

			const wantsFrame = args.capture !== 'none';
			if (wantsFrame) await assertImageCapableRoute(ctx, exec, 'desktop_sequence with capture');
			const options = optionsFor(exec, config);
			const stopOnError = args.stopOnError !== false;
			const results = [];
			let failed = 0;
			// One token and one ring cover the whole batch, so Esc stops the batch rather
			// than the single step that happened to be running when the key landed.
			const batchCancel = join(scratchDir(), `cancel-${nextToken()}.txt`);
			const batchStarted = Date.now();
			const batchDir = beginTakeover(batchCancel, config);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1818-1844](https://github.com/momasiku/dsh-pilot/blob/fae4bebc0f044e3e875cf15e47f5cadffd4bf7d0/lib/index.js#L1818-L1844)

动作循环和逐步结果

<details>
<summary>查看原文（27行）</summary>

```text
			try {
				for (const [offset, step] of steps.entries()) {
					if (exec?.signal?.aborted) throw new Error('desktop_sequence: the batch was cancelled');
					if (stopRequested(batchCancel)) {
						cancelledByEsc = true;
						break;
					}
					const stepStarted = Date.now();
					try {
						const entry = await runSequenceStep(step, config, options, batchCancel);
						results.push({ index: offset + 1, ...entry, ...(step.risk === undefined ? {} : { risk: step.risk }) });
					} catch (error) {
						failed += 1;
						results.push({
							index: offset + 1,
							action: step.action,
							ok: false,
							ms: Date.now() - stepStarted,
							note: error instanceof Error ? error.message : String(error),
							...(step.risk === undefined ? {} : { risk: step.risk })
						});
						if (error?.cancelled === true) {
							cancelledByEsc = true;
							break;
						}
						if (stopOnError) break;
					}
```

</details>

#### 缺口

- 未在 Windows 真机测试
  **影响**：不能支持坐标准确、节省时间或画面保真
  **进一步探讨**：用可丢弃窗口重复五步任务

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 确认和失败各保证什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

批次风险按调用参数与步骤 risk 求最大值，缺失默认 low。中高风险要求 confirm 为真。此函数没有独立核对人类授权，不能把调用者布尔值当成实际批准。执行前 dryRun 可返回计划，已开始批次按取消令牌与错误停止选项执行，先成功的动作没有在这段循环回滚。作者说明不确定送达时动作不重放，仍需读回窗口状态。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1352-1371](https://github.com/momasiku/dsh-pilot/blob/fae4bebc0f044e3e875cf15e47f5cadffd4bf7d0/lib/index.js#L1352-L1371)

风险参数与确认判定

<details>
<summary>查看原文（20行）</summary>

```text
function sequenceRisk(steps, declared, confirm) {
	let effective = RISKS.includes(declared) ? declared : 'low';
	const flagged = [];
	for (const [offset, step] of steps.entries()) {
		const stepRisk = step.risk ?? 'low';
		if (RISK_ORDER[stepRisk] > 0) {
			const why = typeof step.riskNote === 'string' && step.riskNote.length > 0 ? ` (${step.riskNote})` : '';
			flagged.push(`#${offset + 1} ${step.action}${why}`);
		}
		if (RISK_ORDER[stepRisk] > RISK_ORDER[effective]) effective = stepRisk;
	}
	if (RISK_ORDER[effective] > 0 && confirm !== true) {
		const parts = flagged.length > 0 ? flagged.join(', ') : 'the batch as a whole';
		throw new Error(
			`desktop_sequence refused before touching the desktop: this batch is declared ${effective} risk (${parts}). ` +
			'Show the user what it will do, then re-issue the same steps with confirm: true — or run the risky step on its own so it can be reviewed alone.'
		);
	}
	return effective;
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1780-1808](https://github.com/momasiku/dsh-pilot/blob/fae4bebc0f044e3e875cf15e47f5cadffd4bf7d0/lib/index.js#L1780-L1808)

计划路径

<details>
<summary>查看原文（29行）</summary>

```text
		async execute(args, exec) {
			warmWorker(config);
			const steps = normalizeSequence(args, config);
			const risk = sequenceRisk(steps, args.risk, args.confirm);
			const confirmed = args.confirm === true;

			if (args.dryRun === true) {
				return pruneAbsent({
					risk,
					confirmed,
					planned: true,
					stepCount: steps.length,
					executed: 0,
					failed: 0,
					steps: steps.map((step, offset) => ({
						index: offset + 1,
						action: step.action,
						ok: true,
						ms: 0,
						...(step.risk === undefined ? {} : { risk: step.risk }),
						...(typeof step.riskNote === 'string' ? { note: step.riskNote } : {})
					})),
					notes: ['dry run: nothing was executed']
				});
			}

			const wantsFrame = args.capture !== 'none';
			if (wantsFrame) await assertImageCapableRoute(ctx, exec, 'desktop_sequence with capture');
			const options = optionsFor(exec, config);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1818-1844](https://github.com/momasiku/dsh-pilot/blob/fae4bebc0f044e3e875cf15e47f5cadffd4bf7d0/lib/index.js#L1818-L1844)

取消与部分执行

<details>
<summary>查看原文（27行）</summary>

```text
			try {
				for (const [offset, step] of steps.entries()) {
					if (exec?.signal?.aborted) throw new Error('desktop_sequence: the batch was cancelled');
					if (stopRequested(batchCancel)) {
						cancelledByEsc = true;
						break;
					}
					const stepStarted = Date.now();
					try {
						const entry = await runSequenceStep(step, config, options, batchCancel);
						results.push({ index: offset + 1, ...entry, ...(step.risk === undefined ? {} : { risk: step.risk }) });
					} catch (error) {
						failed += 1;
						results.push({
							index: offset + 1,
							action: step.action,
							ok: false,
							ms: Date.now() - stepStarted,
							note: error instanceof Error ? error.message : String(error),
							...(step.risk === undefined ? {} : { risk: step.risk })
						});
						if (error?.cancelled === true) {
							cancelledByEsc = true;
							break;
						}
						if (stopOnError) break;
					}
```

</details>

**依据 4 · 作者声明**：[README.md:137-148](https://github.com/momasiku/dsh-pilot/blob/fae4bebc0f044e3e875cf15e47f5cadffd4bf7d0/README.md#L137-L148)

作者说明 worker 与取消

<details>
<summary>查看原文（12行）</summary>

```text
## 为什么安全

给模型装上手，最该讲究的就是这一块：

- **风险先声明、后强制**：默认 `low` 可自由批量；声明 `medium`/`high` 的批次、或含 `risk: "high"` 步骤的批次，**在碰桌面之前**就被拒绝，除非调用方带 `confirm: true`（而它只会在你同意之后带）。
- **`dryRun: true`** 只校验并列出计划，不执行。
- **默认遇错即停**：`focus` 失败绝不会有"接着往面前那个窗口里打字"的后续。
- **定向输入**：步骤里指定了窗口（`hwnd`）时，注入前会再次把该窗口置前，点击不会落进旁边的窗口。
- **结果不明就绝不静默重试**：worker 在请求送达后死掉时，动作按失败上报而不是重放——它可能已经生效了；截图没有副作用，才会自动回退重试。
- **中断是真的能中断**：按 Esc 会写取消令牌，动作循环在每一步之间轮询（拖拽中、等待中、截图前都查），拖拽在 `finally` 里松开按键——中断的回合不会留下按住的鼠标，也不会把剩下的点击跑完。
- **不会假装成功**：Windows 禁止向更高完整性级别（提权）的窗口注入输入，工具会如实报错。
- **批量有上限**：`maxSequenceSteps`（默认 24）。
```

</details>

#### 缺口

- 未核对宿主审批与 worker 异常
  **影响**：不能保证高风险动作只能由人授权或无部分副作用
  **进一步探讨**：用测试窗口注入错误、取消和回执丢失

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎么试用及退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者给出 Windows、PowerShell、兼容 DSH 和视觉线路。先在独立 profile 对无个人信息的测试窗口使用 dryRun 和短序列，显式核对每步状态。要计入视觉输入、worker 和截图资源；作者速度是特定条件。出现错窗或结果不明应停，回到人工处理并检查已执行副作用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:78-89](https://github.com/momasiku/dsh-pilot/blob/fae4bebc0f044e3e875cf15e47f5cadffd4bf7d0/README.md#L78-L89)

作者性能及图像策略

<details>
<summary>查看原文（12行）</summary>

```text
## 为什么快

批处理是大头（省的是往返，不是点击）；第二个大头是**不再每次重启 PowerShell**——一个常驻 worker 同时服务动作与截图：

| 请求 | 一次性脚本 | 常驻 worker |
| --- | --- | --- |
| 动作（移动/点击/打字…） | ~0.9–2.0 秒 | **6–12 毫秒** |
| 截图（主屏） | ~1.2–2.3 秒 | **~0.5 秒** |

（2560×1600、150% 缩放、DSH 界面还在动的情况下实测）。worker 在第一次调用时后台预热，它需要的约 1 秒与第一张截图重叠，不会拖慢第一个动作。

**没变化的帧不重复发送**：每次截图都带 `frameHash`，与同会话上一帧逐字节相同时就不重复附图（也不重复存储），结果里写 `unchanged: true`，模型手上那张图的坐标继续有效；想看就传 `forceImage: true`。
```

</details>

**依据 2 · 作者声明**：[README.md:150-172](https://github.com/momasiku/dsh-pilot/blob/fae4bebc0f044e3e875cf15e47f5cadffd4bf7d0/README.md#L150-L172)

包与环境

<details>
<summary>查看原文（23行）</summary>

````text
## 安装

```powershell
# 从 npm 装（推荐）
dsh plugin --profile <你的profile> add @momasiku/dsh-pilot

# 或从仓库装
dsh plugin --profile <你的profile> add github:momasiku/dsh-pilot

# 或用本仓库 Release 里的预构建包，免构建授权
dsh plugin --profile <你的profile> add https://github.com/momasiku/dsh-pilot/releases/latest/download/dsh-pilot.tgz

# 或你本地已有的检出
dsh plugin --profile <你的profile> add "file:E:\path\to\dsh-pilot"
```

**下载：** [npm 包](https://www.npmjs.com/package/@momasiku/dsh-pilot) · [预构建 tarball](https://github.com/momasiku/dsh-pilot/releases/latest/download/dsh-pilot.tgz) · [源码](https://github.com/momasiku/dsh-pilot)

✅ **推荐用 npm 上的 scoped 包名 `@momasiku/dsh-pilot`。** 裸名 `dsh-pilot` 在 npm 上属于另一款无关的浏览器操控插件，而 `dsh plugin add` 总是先查 npm，所以别用裸名；用仓库地址或 tarball 也照样可以。

包**自带 loader 行**：`plugin add` 会把 `@momasiku/dsh-pilot` 放进 `dsh.profile.bundles`，行本身来自包内的 `cordis.patch.yml`（由 `dsh.bundle.patch` 声明），所以不会像手写补丁行那样被插件管理器重写时弄丢。装完**重启一次 DSH Desktop**，然后**新开一个会话**，三个工具就会出现在工具列表里。

要求 DSH **0.1.5-rc.2 至 0.2.x**（即 `package.json` 里的 peer 范围，也是 `dsh plugin add` 在安装前的门禁）。环境要求：**Windows**、PowerShell 5.1 或 7、以及声明了图像输入的模型线路（`deepseek-flash` 可以）。
````

</details>

**依据 3 · 作者声明**：[README.md:251-267](https://github.com/momasiku/dsh-pilot/blob/fae4bebc0f044e3e875cf15e47f5cadffd4bf7d0/README.md#L251-L267)

使用与错误边界

<details>
<summary>查看原文（17行）</summary>

```text
## 使用要点

- 先 `desktop_control { action: "windows" }` 看清有哪些窗口、哪个在前台，再动手。
- 多步任务优先用 `desktop_sequence`：把"聚焦 → 点击 → 输入 → 回车"写成一次调用。
- 打字支持多行与中文（走剪贴板一次粘贴，之后恢复剪贴板）。
- 想更省 token：`capture: "none"` 不附图，或依赖"未变化不重发"；想看得更清：`rulers: true`（默认开）。
- 常用设置（`captureRetention`、`settleMs`、`stepSettleMs`、`maxSequenceSteps`、`useWorker`、`rulers`）写在配置行里，见上面的 Settings 一节。

## 常见问题

| 现象 | 原因与处理 |
| --- | --- |
| 提示找不到匹配窗口 | 窗口缩到托盘了，或标题变了：用 `action: "windows"` 列出来，或改用 `hwnd` 指定 |
| 点击总是差一点 | 图片被宿主压小了：看 `<delivered_scale>` 的乘数并乘上去 |
| 点了没反应 | 目标窗口可能是提权窗口，Windows 不允许跨完整性级别注入输入 |
| 升级后工具不见了 | 重启 DSH Desktop：包的代码在加载时重新导入，profile 的插件行在启动时合成 |
| 批次被拒绝执行 | 声明了 `medium`/`high`：经用户同意后带 `confirm: true` 重发，或先用 `dryRun: true` 看计划 |
```

</details>

#### 缺口

- 未验证制品、停用或实际费用
  **影响**：无法量化操作和恢复成本
  **进一步探讨**：核对目标 profile 和 Windows 环境后再试惰性窗口

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样比较实际误操作？

**研究主题**：新假设与验证

#### 完整回答

在当前批量与逐步手工检查之间，可以为窗口标题或已知控件增加逐步前提校验。对照固定窗口布局、切错窗口和前台切换，记录误输入、重试及完成时间。若不能减少误操作或低风险任务开销过高，撤回。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:54-75](https://github.com/momasiku/dsh-pilot/blob/fae4bebc0f044e3e875cf15e47f5cadffd4bf7d0/README.md#L54-L75)

现有往返和坐标方案

<details>
<summary>查看原文（22行）</summary>

````text
## 它到底解决了什么

桌面自动化的瓶颈**从来不是鼠标点得快不快**，而是 **"模型和电脑要来回说多少次话"**：

| 一个五步任务（聚焦窗口 → 点输入框 → 打字 → 回车 → 看结果） | 只用 DSH | DSH + dsh-pilot |
| --- | --- | --- |
| 谁在看屏幕 | 你 | 模型，看真实像素 |
| 谁在点击打字 | 你 | 模型 |
| 模型 ↔ 电脑往返次数 | 5 次（每步一次，外加你的） | **1 次** |
| 送给模型的截图 | 4–5 张 | **1 张** |
| 出错时 | 你发现、你描述 | 同一次结果里就写明哪一步、为什么 |

## 为什么坐标可信（这是"点得准"的关键）

视觉驱动点击最经典的翻车方式是"坐标差一点点"，这里堵掉了三个来源：

1. **两端都是 per-monitor DPI 感知**。非 DPI 感知的进程会被 Windows 骗——它把 2560×1600 的屏幕看成 1707×1067，于是按这种截图算出来的点击**必然偏**。传感器和执行器在做任何事之前都声明 `PER_MONITOR_AWARE_V2`，所以一个图像像素就是一个物理屏幕像素。
2. **每张图都带坐标刻度尺**：上沿与左沿每 200px 一条刻度，标注的是**屏幕坐标**（不是图像偏移），还有 `origin x,y step n` 说明。模型直接读刻度，不用数像素；刻度是屏幕坐标，所以即使图片被压缩也依然有效。
3. **信封如实说明交付尺寸**。如果宿主把图压小了，模型会收到比例与乘数；坐标契约也变成条件式——**只有在"交付尺寸 == 采集尺寸"时**才承诺"照用 x、y 即可"，否则明确要求乘多少：

```text
<delivered_scale>delivered 1974x873 = 0.873x capture; multiply image readings by 1.1454 to get screen pixels</delivered_scale>
````

</details>

**依据 2 · 源码核查**：[lib/index.js:1818-1844](https://github.com/momasiku/dsh-pilot/blob/fae4bebc0f044e3e875cf15e47f5cadffd4bf7d0/lib/index.js#L1818-L1844)

逐步执行可插入状态判据

<details>
<summary>查看原文（27行）</summary>

```text
			try {
				for (const [offset, step] of steps.entries()) {
					if (exec?.signal?.aborted) throw new Error('desktop_sequence: the batch was cancelled');
					if (stopRequested(batchCancel)) {
						cancelledByEsc = true;
						break;
					}
					const stepStarted = Date.now();
					try {
						const entry = await runSequenceStep(step, config, options, batchCancel);
						results.push({ index: offset + 1, ...entry, ...(step.risk === undefined ? {} : { risk: step.risk }) });
					} catch (error) {
						failed += 1;
						results.push({
							index: offset + 1,
							action: step.action,
							ok: false,
							ms: Date.now() - stepStarted,
							note: error instanceof Error ? error.message : String(error),
							...(step.risk === undefined ? {} : { risk: step.risk })
						});
						if (error?.cancelled === true) {
							cancelledByEsc = true;
							break;
						}
						if (stopOnError) break;
					}
```

</details>

#### 缺口

- 未做窗口变化对照
  **影响**：不知道额外判据是否稳定
  **进一步探讨**：用虚拟窗口做测试矩阵

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
