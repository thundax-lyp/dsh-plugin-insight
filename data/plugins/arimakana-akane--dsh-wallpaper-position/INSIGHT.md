# dsh-wallpaper-position

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[14a054e](https://github.com/ArimaKana-Akane/dsh-wallpaper-position/tree/14a054eef21ec5bf9c884340a2da8814735a75d3)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：为 dream-skin 壁纸提供按图片、URL 或渐变分别记忆的水平和垂直像素位移设置。

> **核心亮点**：相对手写一条固定 background-position，本插件把位移参数绑定到壁纸内容并暴露在现有外观设置内，省去换图后人工维护选择器和偏移值的重复步骤。这是对 dream-skin 的局部可用性补充，背景渲染和插槽来自上游，不能归为新壁纸引擎。[Q01](#research-q01) 与 [Q02](#research-q02) 支持此归属。

> **风险与缺陷**：精确调整能否只作用于目标壁纸决定这一便利是否可靠。源码选择器会命中任意 body 直属的固定背景层，非零位移可能同时移动其他插件背景；而上游更改 DOM 或键名又可能失效。另有轮询未见释放、写存储失败被吞掉的维护负担，不能从界面即时变化推断持久化成功。[Q03](#research-q03)

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 什么用户需要按壁纸保存构图，合格结果是什么？](#detail-section-11)
  - [Q02 · 壁纸身份、设置输入、存储及 CSS 生效如何相连？](#detail-section-12)
  - [Q03 · 哪些选择器和生命周期前提可能使位移效果失真？](#detail-section-13)
  - [Q04 · 首次使用、持续使用和恢复有什么成本，适合怎样试用？](#detail-section-14)
  - [Q05 · 如何减少匿名壁纸层耦合，并证伪改进假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在 dream-skin 使用不同构图背景的用户，按壁纸保存 X/Y 位移，减少每次换图后重写 CSS 的操作。

对照为在开发者工具或自定义样式里直接设 background-position。该方式适合单图且无需插件，但逐图记忆和设置交互要自行实现；本研究没有证明宿主所有版本都缺少等价原生能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| X/Y 像素微调 | 输入整数或使用 ±1/±10 按钮改变构图 | 依赖 dream-skin 插槽，范围 ±5000px |
| 按壁纸记忆 | 图片、URL 与渐变分别恢复偏移 | localStorage 可用，身份为内容简易哈希 |
| 恢复默认位置 | 清零当前壁纸位移 | 不清理其他壁纸记录 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH web 客户端、React 与 slots | 启动及设置必需 | 加载模块、渲染容器、注册设置 | seed 缺失降级；插槽不可用时设置不显示 |
| dream-skin 插槽、DOM 和存储键 | 核心功能必需 | 识别壁纸及施加位移 | DOM 或键名变化可能静默失效 |
| 浏览器 localStorage | 记忆必需 | 保存每图偏移 | 异常被吞掉，持久性不可保证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份 profile 并确认 dream-skin 背景存在 | 插槽和背景层满足要求 |
| 加载 | 用户安装包、登记 bundles 后重新加载 | 外观设置出现位移控件，否则禁用排查 |
| 执行 | 用户选择背景并调 X/Y | 目标层移动且其他层保持 |
| 验收 | 用户换图再返回并重载 | 原偏移恢复；失败恢复备份并检查存储 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 现有 DSH 与 dream-skin 环境，金额未知 | 备份 profile、安装、重启及构图调整，时长未知 | 不需要独立远程服务 |
| 持续使用 | 浏览器两秒轮询与 localStorage，资源量未知 | 每张新图调整并复核 | 大 data URL 哈希开销未测 |
| 失败恢复 | 重新加载或禁用的资源量未知 | 核对 profile 与浏览器偏移表，必要时外部终端处理 | 存储写入错误未反馈，恢复耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 按壁纸保存位置 | 三类内容身份映射到偏移表 | 哈希冲突和浏览器存储失败频率 |
| 界面直接微调 | 数值输入、步进按钮、恢复默认接线存在 | 当前宿主可见性和操作体验 |
| 阅读改善 | 可以改变背景位置 | 合格阅读任务耗时与舒适度，没有同条件对照 |

> **思考**：精确调整能否只作用于目标壁纸决定这一便利是否可靠。源码选择器会命中任意 body 直属的固定背景层，非零位移可能同时移动其他插件背景；而上游更改 DOM 或键名又可能失效。另有轮询未见释放、写存储失败被吞掉的维护负担，不能从界面即时变化推断持久化成功。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对手写一条固定 background-position，本插件把位移参数绑定到壁纸内容并暴露在现有外观设置内，省去换图后人工维护选择器和偏移值的重复步骤。这是对 dream-skin 的局部可用性补充，背景渲染和插槽来自上游，不能归为新壁纸引擎。[Q01](#research-q01) 与 [Q02](#research-q02) 支持此归属。

相对手写一条固定 background-position，本插件把位移参数绑定到壁纸内容并暴露在现有外观设置内，省去换图后人工维护选择器和偏移值的重复步骤。这是对 dream-skin 的局部可用性补充，背景渲染和插槽来自上游，不能归为新壁纸引擎。[Q01](#research-q01) 与 [Q02](#research-q02) 支持此归属。

空 host apply 保持插件接口成立，浏览器 seed 探测能在缺模块时降级；数值限幅和输入中间态处理值得借鉴。代价是大量 catch 隐藏存储和应用错误，setInterval 没有保存句柄或注册销毁，样式也未见卸载清理。可复用逐图状态映射思想，但应重新设计稳定身份和组件清理，不能直接复制全局选择器。[Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

精确调整能否只作用于目标壁纸决定这一便利是否可靠。源码选择器会命中任意 body 直属的固定背景层，非零位移可能同时移动其他插件背景；而上游更改 DOM 或键名又可能失效。另有轮询未见释放、写存储失败被吞掉的维护负担，不能从界面即时变化推断持久化成功。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

已有 dream-skin 的用户可在备份 profile 后试用，以换图返回能恢复偏移且其他背景不移动为通过标准；发现误匹配、重载后偏移丢失或界面异常就停止并禁用。只想偶尔移动一张图的人可先用局部 CSS，未使用 dream-skin 者缺少必要插槽。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

按壁纸持久化和设置插槽接线已有源码支持；跨背景层隔离、当前宿主兼容与改善阅读的效果未验证。未来设计假设未实现。

- 已检查：作者 README、包清单、源码路径 lib/client.js、lib/index.js、scripts/install.sh、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定提交的 README、包清单、主机空入口、完整浏览器实现和安装脚本；未检查 dream-skin 当前实现，跨插件接口以本项目声明及引用方式为边界。
- 下一步：在隔离 profile 记录四类背景的偏移恢复、其他固定背景层误匹配、重复加载后的轮询数量与禁用后样式残留。再比较手写 CSS 与设置控件完成同批构图任务的人工时间和失误，尚未执行这些实验。

**分析版本**

- **仓库**：[ArimaKana-Akane/dsh-wallpaper-position](https://github.com/ArimaKana-Akane/dsh-wallpaper-position)
- **版本号**：1.2.0（[固定提交 14a054e](https://github.com/ArimaKana-Akane/dsh-wallpaper-position/tree/14a054eef21ec5bf9c884340a2da8814735a75d3)）
- **版本日期**：2026-09-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

由匿名 DOM 选择器与跨插件存储键耦合，可推导一个未验证假设：让 dream-skin 提供稳定壁纸 ID、专属 DOM 标识和变化事件，可在保持逐图记忆的同时替代轮询并隔离其他背景层。该方案需要上游协作及旧记录迁移，增加接口维护成本。用两张图片、URL、渐变和第二背景层测试事件版与现版，若仍误移动其他层、丢失偏移或事件开销没有改善，就否定改进成立。[Q05](#research-q05)

在隔离 profile 记录四类背景的偏移恢复、其他固定背景层误匹配、重复加载后的轮询数量与禁用后样式残留。再比较手写 CSS 与设置控件完成同批构图任务的人工时间和失误，尚未执行这些实验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 336 | 258 | 65 | — |
| .md | source | 1 | 192 | — | — | 1790 |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/ArimaKana-Akane/dsh-wallpaper-position/issues?q=is%3Aissue+created%3A2026-09-24T05%3A56%3A31.678Z..2026-10-24T05%3A56%3A31.678Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/ArimaKana-Akane/dsh-wallpaper-position/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-24T05%3A56%3A31.678Z..2026-10-24T05%3A56%3A31.678Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本能否让 dream-skin 用户可靠地逐图调整构图，相对手写 CSS 有何价值及代价？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么用户需要按壁纸保存构图，合格结果是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者针对 dream-skin 背景中心裁切导致构图压住文字的场景提供逐图位移。使用者是已经启用该主题并经常切换背景的用户，合格结果是目标主体避开文字、换图再返回无需重设。固定 CSS 本来就能改变一个背景的位置，因此本插件的增量是状态记忆和设置入口，而非背景渲染算法。README 的遮挡说明属于作者设定，未取得独立用户需求或阅读效果数据；偶尔调整一张图可能不足以摊薄插件维护。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-26](https://github.com/ArimaKana-Akane/dsh-wallpaper-position/blob/14a054eef21ec5bf9c884340a2da8814735a75d3/README.md#L9-L26)

作者给出中心裁切问题及逐图设置的功能边界，可界定任务与比较基线，不能证明用户收益。

<details>
<summary>查看原文（18行）</summary>

```text
> A vibe-coded satellite plugin for `dsh-dream-skin`: nudge the wallpaper's position
> per wallpaper (X/Y in pixels) from 设置 → 外观, remembered separately for every one.

[dsh-dream-skin](https://github.com/RevolutionLA/dsh-dream-skin) 的壁纸是整屏铺满（`background-size: cover`、
`background-position: center`）的固定层。构图偏左/偏上的图会压住聊天文字，
而它本身没有提供位移设置。这个插件补上这一块：**在设置页里按像素微调，且每张壁纸各自记忆**。

---

## 1. 它做什么

- 在 **设置 → 外观（dream-skin 页）** 注册一项设置：**「壁纸位移（仅对当前壁纸生效）」**；
- 两个数值输入框（X / Y），步进 1 px，范围 ±5000 px，配 `−10 / −1 / +1 / +10` 微调按钮与「恢复默认位置」；
- **按壁纸记忆**：键是当前壁纸**内容**哈希，并区分类型（`image` / `url` / `gradient`），
  换图 / 换 URL / 换渐变即换一套位移，互不干扰；换壁纸后面板数字会跟着同步成新壁纸的记忆值；
- 纯前端实现：只写 CSS 变量，不动图片、不改 dream-skin 的任何文件；
- 即时生效，无需重启 dsh（改完立刻反映到壁纸上）。

```

</details>

#### 缺口

- 真实换图频率及构图调整收益未采样。
  **影响**：无法判断便利能否摊薄维护负担。
  **进一步探讨**：记录使用者一周换图任务并与单条 CSS 操作比较。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 壁纸身份、设置输入、存储及 CSS 生效如何相连？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

currentWallpaper 根据类型选择图片 data URL、URL 或渐变键，imgId 用内容滚动哈希与长度形成键；URL 和渐变加类型前缀，图片保留旧格式。setPos 限幅并写入位移表，再将读取值写成根 CSS 变量，选择器通过 background-position calc 生效。设置控件由 React 容器承载原生 DOM，通过 slots 注册进外观页。这条链完整依赖上游私有存储键、匿名背景结构及客户端服务；缺少壁纸身份会退回零偏移，不能把字段声明视为已经在当前宿主可用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:97-155](https://github.com/ArimaKana-Akane/dsh-wallpaper-position/blob/14a054eef21ec5bf9c884340a2da8814735a75d3/lib/client.js#L97-L155)

三类来源、哈希、持久化和 CSS 链路可直接跟踪。

<details>
<summary>查看原文（59行）</summary>

```text
		function currentWallpaper() {
			const kind = readKey(KIND_KEY);
			if (kind === 'url') {
				const v = readKey(URL_KEY);
				return v ? { kind: 'url', value: v } : null;
			}
			if (kind === 'gradient') {
				const v = readKey(GRADIENT_KEY);
				return v ? { kind: 'gradient', value: v } : null;
			}
			const v = readKey(IMG_KEY);
			return v ? { kind: 'image', value: v } : null;
		}
		/** 当前壁纸指纹：内容哈希，换图 / 换 URL / 换渐变即换记录。 */
		function imgId() {
			const w = currentWallpaper();
			if (!w) return null;
			let x = 5381;
			for (let i = 0; i < w.value.length; i++) x = ((x * 33) ^ w.value.charCodeAt(i)) >>> 0;
			const base = x.toString(36) + ':' + w.value.length.toString(36);
			// image 类沿用旧格式（不带类型前缀），这样升级后已保存的位移记录不会失效。
			return w.kind === 'image' ? base : w.kind + ':' + base;
		}
		function getPos() {
			const id = imgId();
			if (!id) return { x: 0, y: 0 };
			const e = readMap()[id];
			return e && typeof e.x === 'number'
				? { x: clampNum(e.x), y: clampNum(e.y) }
				: { x: 0, y: 0 };
		}
		function setPos(x, y) {
			const next = { x: clampNum(x), y: clampNum(y) };
			const id = imgId();
			if (id) { const m = readMap(); m[id] = next; writeMap(m); }
			applyPos();
			return next;
		}

		// ── 应用位移 ────────────────────────────────────────────────────────
		function injectCss() {
			if (document.getElementById(STYLE_ID)) return;
			const st = document.createElement('style');
			st.id = STYLE_ID;
			// 同时给出两个分量的值，避免被内联的 background-position 覆盖。
			st.textContent = [
				'body > [style*="background-image"][style*="position:fixed"],',
				'body > [style*="background-image"][style*="position: fixed"] {',
				'  background-position: calc(50% + var(' + VAR_X + ', 0px)) calc(50% + var(' + VAR_Y + ', 0px)) !important;',
				'}'
			].join('\n');
			(document.head || document.documentElement).appendChild(st);
		}
		function applyPos() {
			const root = document.documentElement;
			if (!root) return;
			const p = getPos();
			root.style.setProperty(VAR_X, p.x + 'px');
			root.style.setProperty(VAR_Y, p.y + 'px');
```

</details>

**依据 2 · 源码核查**：[lib/client.js:302-318](https://github.com/ArimaKana-Akane/dsh-wallpaper-position/blob/14a054eef21ec5bf9c884340a2da8814735a75d3/lib/client.js#L302-L318)

设置通过 dream-skin 指定插槽注册，inject 依赖 slots。

<details>
<summary>查看原文（17行）</summary>

```text
			try {
				if (ctx && ctx.slots && typeof ctx.slots.inject === 'function' && typeof ctx.slots.register === 'function') {
					ctx.slots.inject('settings.dreamSkin.item', () => ctx.slots.register({
						name: 'settings.dreamSkin.item',
						id: 'wallpaper-position',
						order: 90
					}, WallpaperPositionRow));
				} else {
					try { console.warn('[wallpaper-position] 未取得 slots 服务，跳过设置项注册'); } catch (e) {}
				}
			} catch (err) {
				try { console.warn('[wallpaper-position] 注册设置项失败：', err); } catch (e) {}
			}
		}

		exports.apply = apply;
		exports.inject = ['slots'];
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些选择器和生命周期前提可能使位移效果失真？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

CSS 只要求 body 直接子节点内联含背景图和 fixed 定位，没有专属 ID，因此第二背景插件满足同样条件时也会被非零位移影响，这是选择器本身的范围限制。两秒定时器没有保存句柄或清理注册，重复 apply 是否发生取决于宿主生命周期，但代码未提供自行释放路径。readMap 和 writeMap 吞掉异常，失败会表现为默认位置或未保存，界面不足以证明落盘。对 seed 缺失的 no-op 降级减小加载错误外溢，但也会使功能消失，应该和报错诊断一起评估。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:55-67](https://github.com/ArimaKana-Akane/dsh-wallpaper-position/blob/14a054eef21ec5bf9c884340a2da8814735a75d3/lib/client.js#L55-L67)

存储错误被吞掉且数值有边界。

<details>
<summary>查看原文（13行）</summary>

```text
		function readMap() {
			try {
				const raw = localStorage.getItem(POS_KEY);
				const o = raw ? JSON.parse(raw) : null;
				return o && typeof o === 'object' ? o : {};
			} catch (e) { return {}; }
		}
		function writeMap(m) {
			try { localStorage.setItem(POS_KEY, JSON.stringify(m)); } catch (e) {}
		}
		function clampNum(v) {
			const n = Math.round(Number(v) || 0);
			return Math.max(-LIMIT, Math.min(LIMIT, n));
```

</details>

**依据 2 · 源码核查**：[lib/client.js:137-148](https://github.com/ArimaKana-Akane/dsh-wallpaper-position/blob/14a054eef21ec5bf9c884340a2da8814735a75d3/lib/client.js#L137-L148)

背景选择器没有绑定 dream-skin 专属层。

<details>
<summary>查看原文（12行）</summary>

```text
		function injectCss() {
			if (document.getElementById(STYLE_ID)) return;
			const st = document.createElement('style');
			st.id = STYLE_ID;
			// 同时给出两个分量的值，避免被内联的 background-position 覆盖。
			st.textContent = [
				'body > [style*="background-image"][style*="position:fixed"],',
				'body > [style*="background-image"][style*="position: fixed"] {',
				'  background-position: calc(50% + var(' + VAR_X + ', 0px)) calc(50% + var(' + VAR_Y + ', 0px)) !important;',
				'}'
			].join('\n');
			(document.head || document.documentElement).appendChild(st);
```

</details>

**依据 3 · 源码核查**：[lib/client.js:283-300](https://github.com/ArimaKana-Akane/dsh-wallpaper-position/blob/14a054eef21ec5bf9c884340a2da8814735a75d3/lib/client.js#L283-L300)

轮询启动未提供定时器句柄清理，风险是否触发依赖加载生命周期。

<details>
<summary>查看原文（18行）</summary>

```text
		function apply(ctx) {
			try {
				injectCss();
				applyPos();
				try { lastId = imgId(); } catch (e) {}
				if (ctx && typeof ctx.on === 'function') {
					try { ctx.on('theme/change', () => { try { applyPos(); } catch (e) {} }); } catch (e) {}
				}
				setInterval(() => {
					try {
						applyPos();
						// 壁纸换了（换图 / 换 URL / 换渐变）→ 把面板数字同步成新壁纸的记忆值。
						const id = imgId();
						if (id !== lastId) { lastId = id; refreshInputs(); }
					} catch (e) {}
				}, 2000);
			} catch (err) {
				try { console.warn('[wallpaper-position] 应用位移失败：', err); } catch (e) {}
```

</details>

#### 缺口

- 重复加载和多背景共存的实际表现没有复现。
  **影响**：不能给出泄漏频率或故障概率。
  **进一步探讨**：记录重复加载前后计时器及多层背景位置，验证何时触发。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次使用、持续使用和恢复有什么成本，适合怎样试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次需已有 dream-skin 环境，再复制客户端文件、登记 profile bundles 并重载；安装脚本的市场登记与普通手装不同，需要额外选项。持续成本来自逐图调整、两秒轮询和存储维护；无独立服务不等于资源为零。失败恢复应包括禁用、核对 profile 和清理浏览器映射，现金与人工时间都没有实测。适合在备份的 profile 中验证多图返回、重载持久化及其他背景不移动；误匹配或持久化丢失就停止。只调整一张图者先用 CSS 更容易评估收益。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/install.sh:34-73](https://github.com/ArimaKana-Akane/dsh-wallpaper-position/blob/14a054eef21ec5bf9c884340a2da8814735a75d3/scripts/install.sh#L34-L73)

文件复制和 bundles 修改说明首次部署及恢复责任，未运行该脚本。

<details>
<summary>查看原文（40行）</summary>

```text
printf '== 1) 拷贝插件文件 ==\n'
[ -d "$SRC/lib" ] || { bad "源目录不完整：$SRC"; exit 1; }
mkdir -p "$DEST/lib" || { bad "无法创建 $DEST"; exit 1; }
cp -f "$SRC/package.json" "$DEST/package.json"
cp -f "$SRC/cordis.patch.yml" "$DEST/cordis.patch.yml"
cp -f "$SRC/lib/index.js" "$DEST/lib/index.js"
cp -f "$SRC/lib/client.js" "$DEST/lib/client.js"
ok "已部署到 $DEST"

printf '== 2) 注册到 dsh.profile.bundles ==\n'
node - "$PKG" "$PKG_NAME" "$MARKET" "$DEP_SPEC" <<'NODE'
const fs = require('fs')
const [file, name, market, depSpec] = process.argv.slice(2)
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'))
let changed = false
pkg.dsh = pkg.dsh || {}
pkg.dsh.profile = pkg.dsh.profile || {}
pkg.dsh.profile.bundles = pkg.dsh.profile.bundles || []
if (!pkg.dsh.profile.bundles.includes(name)) {
  pkg.dsh.profile.bundles.push(name)
  changed = true
  console.log('   ✓ 已加入 bundles')
} else {
  console.log('   ✓ bundles 中已存在（跳过）')
}
if (market === '1') {
  pkg.dependencies = pkg.dependencies || {}
  if (!pkg.dependencies[name]) {
    pkg.dependencies[name] = depSpec
    changed = true
    console.log('   ✓ 已加入 dependencies（市场会显示为已安装）: ' + depSpec)
  } else {
    console.log('   ✓ dependencies 中已存在: ' + pkg.dependencies[name])
  }
} else {
  console.log('   · 未写 dependencies（手装默认）；要让市场识别，加 --market 重新执行')
}
if (changed) fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n')
NODE
[ $? -eq 0 ] || bad "注册 bundles 失败"
```

</details>

**依据 2 · 源码核查**：[lib/client.js:291-298](https://github.com/ArimaKana-Akane/dsh-wallpaper-position/blob/14a054eef21ec5bf9c884340a2da8814735a75d3/lib/client.js#L291-L298)

定时工作是持续资源投入，不足以推算资源量或金额。

```text
				setInterval(() => {
					try {
						applyPos();
						// 壁纸换了（换图 / 换 URL / 换渐变）→ 把面板数字同步成新壁纸的记忆值。
						const id = imgId();
						if (id !== lastId) { lastId = id; refreshInputs(); }
					} catch (e) {}
				}, 2000);
```

#### 缺口

- 安装、调图及故障恢复耗时未知。
  **影响**：不能计算每次合格构图的单位成本。
  **进一步探讨**：以同组图片记录部署、调整、失败重试和复核总人工时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何减少匿名壁纸层耦合，并证伪改进假设？

**研究主题**：新假设与验证

#### 完整回答

根据选择器覆盖过宽和轮询重复读取内容的事实，可提出尚未实现的稳定壁纸协议。让上游提供 ID、专属元素标识与变化事件，插件只保存 ID 对应偏移并响应事件，可能减少其他背景误匹配与大内容重复哈希。它要求上游维护接口和旧记录迁移，不能视为当前能力。最小实验在同一 profile 上对比现版与事件原型，覆盖图片、URL、渐变、第二固定背景层和重载；成功需偏移保持且没有其他层移动，并记录空闲资源。若接口兼容负担高于节省或仍有身份错配，该假设应被否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:110-118](https://github.com/ArimaKana-Akane/dsh-wallpaper-position/blob/14a054eef21ec5bf9c884340a2da8814735a75d3/lib/client.js#L110-L118)

内容哈希提示稳定 ID 替代方向，不证明替代方案有效。

```text
		/** 当前壁纸指纹：内容哈希，换图 / 换 URL / 换渐变即换记录。 */
		function imgId() {
			const w = currentWallpaper();
			if (!w) return null;
			let x = 5381;
			for (let i = 0; i < w.value.length; i++) x = ((x * 33) ^ w.value.charCodeAt(i)) >>> 0;
			const base = x.toString(36) + ':' + w.value.length.toString(36);
			// image 类沿用旧格式（不带类型前缀），这样升级后已保存的位移记录不会失效。
			return w.kind === 'image' ? base : w.kind + ':' + base;
```

**依据 2 · 源码核查**：[lib/client.js:291-298](https://github.com/ArimaKana-Akane/dsh-wallpaper-position/blob/14a054eef21ec5bf9c884340a2da8814735a75d3/lib/client.js#L291-L298)

周期性读取提供事件驱动假设的推导依据。

```text
				setInterval(() => {
					try {
						applyPos();
						// 壁纸换了（换图 / 换 URL / 换渐变）→ 把面板数字同步成新壁纸的记忆值。
						const id = imgId();
						if (id !== lastId) { lastId = id; refreshInputs(); }
					} catch (e) {}
				}, 2000);
```

#### 缺口

- 上游是否愿意提供稳定接口及迁移成本未知。
  **影响**：改进方案可能无法实施或不值得采用。
  **进一步探讨**：先形成接口原型和迁移样本，再测隔离与资源收益。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
