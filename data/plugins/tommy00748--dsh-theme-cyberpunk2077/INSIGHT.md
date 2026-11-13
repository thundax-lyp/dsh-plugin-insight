# DSH Cyberpunk 2077 Theme

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[a3681ee](https://github.com/Tommy00748/dsh-theme-cyberpunk2077/tree/a3681ee431f59c64b8bf37d34ee609ddc7811278)

<!-- BEGIN META -->
[![GitHub ★ 38](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=38&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tommy00748/dsh-theme-cyberpunk2077) [![npm 30d 500](https://img.shields.io/static/v1?label=npm+30d&message=500&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-theme-cyberpunk2077) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-theme-cyberpunk2077)
<!-- END META -->

> **功能**：为 DSH Web 提供赛博朋克风格暗色主题、状态装饰与合成音效。

> **亮点**：统一配色、音效和页面状态装饰，适合偏好此风格的工作区，见 [Q01](#research-q01)。

> **主要限制**：完成音效由 DOM 推断，热退出也需复核先前样式是否恢复，见 [Q02](#research-q02)。

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
  - [Q01 · 为什么用这个主题，而不是只切换宿主暗色？](#detail-section-11)
  - [Q02 · 状态提示从哪里来，卸载能否还原当前页？](#detail-section-12)
  - [Q03 · 怎样试用而不妨碍真实工作状态？](#detail-section-13)
  - [Q04 · 优先消费宿主状态事件能否减少误判？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合想在个人 DSH Web 使用主题与状态装饰的用户，见 [Q01](#research-q01)。

使用原生暗色主题与会话自身状态。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 主题 | 配色、动效及声音 | Web 和宿主服务 |
| 状态装饰 | 从页面判断运行 | 需核真实会话状态 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 与 theme 服务 | 必需 | 注册主题 | 失败时记录错误 |
| Web Audio | 音效所需 | 合成声音 | 不可用时跳过 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在独立 profile 加载 | 原配置可恢复 |
| 核对 | 查看成功及失败任务 | 用原会话判断 |
| 退出 | 关闭效果或移除并重开 | 确认样式恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 浏览器加载资源 | 选择偏好与检查显示 | 开销未测 |
| 持续 | 计时和视觉渲染 | 必要时关闭效果 | 可读性待核 |
| 恢复 | 重新打开页面 | 核查配置行 | 热卸载效果未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 视觉呈现 | 主题和样式接线 | 真实可读性 |
| 状态提示 | DOM 变化触发 | 实际误报率 |

> **思考**：完成音效由 DOM 推断，热退出也需复核先前样式是否恢复，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一配色、音效和页面状态装饰，适合偏好此风格的工作区，见 [Q01](#research-q01)。

状态视觉与宿主真正完成分开检查。关闭计时器与恢复全部 DOM 是两项验证，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

完成音效由 DOM 推断，热退出也需复核先前样式是否恢复，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

用独立 profile 调低动效并核真实会话状态，显示不适时恢复原主题，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认 Web 主题挂载与效果，未验证实际可读性、运行和兼容。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查浏览器注册、状态、样式与清理，未实际载入浏览器或运行 DSH。
- 下一步：对照原生暗色、启用、停用和重开页面的任务状态及可读性。

**分析版本**

- **仓库**：[Tommy00748/dsh-theme-cyberpunk2077](https://github.com/Tommy00748/dsh-theme-cyberpunk2077)
- **版本号**：0.1.4（[固定提交 a3681ee](https://github.com/Tommy00748/dsh-theme-cyberpunk2077/tree/a3681ee431f59c64b8bf37d34ee609ddc7811278)）
- **版本日期**：2026-08-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

让宿主状态事件优先驱动提示，比较能否减少页面选择器误报，见 [Q04](#research-q04)。

对照原生暗色、启用、停用和重开页面的任务状态及可读性。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1223 | 1064 | 116 | — |
| .md | source | 1 | 97 | — | — | 1280 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/Tommy00748/dsh-theme-cyberpunk2077/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对主题如何挂载、状态提示从何而来及退出时的显示边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 为什么用这个主题，而不是只切换宿主暗色？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

想给个人 DSH Web 加统一暗色配色、状态动画和声音的用户，可以把视觉主题和提示集中配置。普通暗色已经满足降低亮度的需求，扩展的增量在状态反馈与风格，而非改变模型和会话结果。宿主入口为空，补丁使浏览器端通过 theme 服务注册，同时插入页面样式和效果。合格结果是显示符合个人偏好且仍能读清工作状态。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-17](https://github.com/Tommy00748/dsh-theme-cyberpunk2077/blob/a3681ee431f59c64b8bf37d34ee609ddc7811278/README.md#L9-L17)

作者声明纯客户端主题。

```text
Cyberpunk 2077（夜之城）风格的 DSH Web UI 主题。纯浏览器客户端插件，零音频资源——所有声音都是 Web Audio 实时合成，不下载一个字节的音频文件。

![NIGHT CITY — screenshot](assets/screenshot.png)

## ✨ 这是什么

一个把 DSH Web 界面整个搬进 2077 年的主题：夜之城黄 × 霓虹青的配色、CRT 扫描线、Kiroshi 义眼式悬停锁定、战斗状态的 HUD、合成音效……以及两个只有夜之城老司机才知道的彩蛋。

所有的效果都可以关——动画、音效、干扰，一个按钮的事。它在小屏幕上和「减弱动态效果」系统设置下也会自动收敛，不会烦你。
```

**依据 2 · 源码核查**：[lib/index.js:1-6](https://github.com/Tommy00748/dsh-theme-cyberpunk2077/blob/a3681ee431f59c64b8bf37d34ee609ddc7811278/lib/index.js#L1-L6)

宿主无实际逻辑。

```text
/** @cyberpunk2077/dsh-theme — host half.
 * This package contributes nothing to the host plane; the browser half is a
 * pure-visual client plugin. An empty apply exists so the row mounts in the
 * host Loader and the client-modules scan recognises it as a client package.
 */
export function apply() {}
```

**依据 3 · 源码核查**：[lib/client.js:1165-1198](https://github.com/Tommy00748/dsh-theme-cyberpunk2077/blob/a3681ee431f59c64b8bf37d34ee609ddc7811278/lib/client.js#L1165-L1198)

注册主题并执行页面效果。

<details>
<summary>查看原文（34行）</summary>

```text
		function apply(ctx) {
			ctx.effect(() => {
				document.documentElement.style.colorScheme = "dark";
				document.body.toggleAttribute("data-ds-dark-theme", true);
				loadCfg();
				applyCfgToBody();
				injectCyberpunkStyles();
				playBootTransition();
				ensureSndChip();
				ensureDeckPanel();
				document.addEventListener("keydown", onKeydown, true);
				const stopPending = startPendingPoll();
				const stopNotices = startNoticeObserver();
				const stopRelic = startRelicLoop();
				const stopWake = startTriggerWatcher();
				const stopTitle = applyTabIdentity();
				const stopClock = startHudFooter();
				// Keep dark chroma even if the theme service later resolves the
				// preference to a light scheme and flips the attribute off.
				const observer = new MutationObserver(() => {
					document.documentElement.style.colorScheme = "dark";
					document.body.toggleAttribute("data-ds-dark-theme", true);
				});
				observer.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });
				try {
					ctx.theme.register({
						id: THEME_ID,
						colorScheme: "dark",
						tokens: TOKENS
					});
					ctx.theme.setTheme(THEME_ID);
				} catch (e) {
					console.error("dsh-theme-cyberpunk2077 theme register failed", e);
				}
```

</details>

#### 缺口

- 实际对比度、可读性与用户偏好未经验证
  **影响**：不能把风格当效率提升
  **进一步探讨**：以相同会话对比原生暗色与主题

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 状态提示从哪里来，卸载能否还原当前页？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

开关保存在 localStorage，Web Audio 有能力检查。运行提示每 450ms 匹配 class 包含 _pending 的元素，变化后更新标题、声音和状态标签。这是页面启发式，不是任务完成回执。卸载 effect 会释放监听器和计时器，但所查 cleanup 未直接恢复先前的主题注册、样式标签和暗色状态。撤下后应在重开页面核对，不宜假定热卸载立刻完全还原。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:194-224](https://github.com/Tommy00748/dsh-theme-cyberpunk2077/blob/a3681ee431f59c64b8bf37d34ee609ddc7811278/lib/client.js#L194-L224)

偏好与音频能力。

<details>
<summary>查看原文（31行）</summary>

```text
		// ── config (persisted in localStorage under one key) ───────────────
		const CFG_KEY = "cp2077-cfg";
		const CFG_DEFAULTS = { scan: true, relic: true, boot: true, type: true, sfx: true };
		let cfg = { ...CFG_DEFAULTS };
		function loadCfg() {
			try {
				const raw = localStorage.getItem(CFG_KEY);
				if (raw !== null) cfg = { ...CFG_DEFAULTS, ...JSON.parse(raw) };
			} catch {}
		}
		function saveCfg() {
			try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch {}
		}
		// Effects gate on body classes so CSS can switch them off cheaply.
		function applyCfgToBody() {
			const b = document.body;
			if (b === undefined || b === null) return;
			b.classList.toggle("cp-off-scan", !cfg.scan);
			b.classList.toggle("cp-off-relic", !cfg.relic);
			b.classList.toggle("cp-off-sfx", !cfg.sfx);
		}

		// ── sound engine (Web Audio; everything synthesized, no assets) ────
		let audioCtx = null;
		let noiseBuf = null;
		function ensureAudio() {
			const AC = window.AudioContext || window.webkitAudioContext;
			if (AC === undefined) return null;
			if (audioCtx === null) audioCtx = new AC();
			if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
			return audioCtx;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:462-479](https://github.com/Tommy00748/dsh-theme-cyberpunk2077/blob/a3681ee431f59c64b8bf37d34ee609ddc7811278/lib/client.js#L462-L479)

运行状态通过 DOM 轮询。

<details>
<summary>查看原文（18行）</summary>

```text
		// Poll the composer's pending dot: appears while the agent streams,
		// vanishes on completion → combat-state chrome off, PREEM chip + chime.
		// (An interval is cheaper and more robust than a subtree
		// MutationObserver against a React tree.)
		function startPendingPoll() {
			const timer = setInterval(() => {
				const pending = document.querySelector("[class*='_pending']");
				const is = pending !== null;
				if (is !== workingNow) {
					workingNow = is;
					document.body.classList.toggle("cp-working", is);
					paintTitle();
					if (is) startTipRotation();
					else { stopTipRotation(); flashChip("PREEM. // 任务完成", "ok"); playDone(); }
				}
			}, 450);
			return () => { clearInterval(timer); stopTipRotation(); };
		}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1165-1208](https://github.com/Tommy00748/dsh-theme-cyberpunk2077/blob/a3681ee431f59c64b8bf37d34ee609ddc7811278/lib/client.js#L1165-L1208)

启动副作用与 cleanup。

<details>
<summary>查看原文（44行）</summary>

```text
		function apply(ctx) {
			ctx.effect(() => {
				document.documentElement.style.colorScheme = "dark";
				document.body.toggleAttribute("data-ds-dark-theme", true);
				loadCfg();
				applyCfgToBody();
				injectCyberpunkStyles();
				playBootTransition();
				ensureSndChip();
				ensureDeckPanel();
				document.addEventListener("keydown", onKeydown, true);
				const stopPending = startPendingPoll();
				const stopNotices = startNoticeObserver();
				const stopRelic = startRelicLoop();
				const stopWake = startTriggerWatcher();
				const stopTitle = applyTabIdentity();
				const stopClock = startHudFooter();
				// Keep dark chroma even if the theme service later resolves the
				// preference to a light scheme and flips the attribute off.
				const observer = new MutationObserver(() => {
					document.documentElement.style.colorScheme = "dark";
					document.body.toggleAttribute("data-ds-dark-theme", true);
				});
				observer.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });
				try {
					ctx.theme.register({
						id: THEME_ID,
						colorScheme: "dark",
						tokens: TOKENS
					});
					ctx.theme.setTheme(THEME_ID);
				} catch (e) {
					console.error("dsh-theme-cyberpunk2077 theme register failed", e);
				}
				return () => {
					observer.disconnect();
					document.removeEventListener("keydown", onKeydown, true);
					stopPending();
					stopNotices();
					stopRelic();
					stopWake();
					stopTitle();
					stopClock();
				};
```

</details>

#### 缺口

- 各子系统清理对宿主重新挂载的最终效果未验证
  **影响**：可能仍看到旧样式或误读状态
  **进一步探讨**：在测试页面分别热停用和重开，比对标题和样式

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样试用而不妨碍真实工作状态？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

适合愿意尝试装饰效果的 Web 用户。在独立 profile 用一个已知成功和一个失败任务检查视觉反馈，同时试关闭声音和动效。减弱动态效果对样式有明确覆盖，仍需观察标题和动效是否符合个人需求。依赖主题服务及实际 DOM 形状，页面改版后可能匹配不到状态。记录加载资源、显示延迟和人工恢复，不将没有音频文件当零成本。若提示与原会话不符或妨碍阅读，回到原生暗色，检查移除配置后重开。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:73-93](https://github.com/Tommy00748/dsh-theme-cyberpunk2077/blob/a3681ee431f59c64b8bf37d34ee609ddc7811278/README.md#L73-L93)

作者的护栏和退出路径。

<details>
<summary>查看原文（21行）</summary>

````text
## 🛡️ 性能护栏

- 小屏（≤768px）：自动关闭扫描线、数据流和重动画
- `prefers-reduced-motion`：停掉全部循环动画
- 所有特效都能在 `DECK` 面板独立关闭，偏好存 localStorage

## 📁 项目结构

```
package.json     # dsh.bundle + dsh.client manifest（platform: web）
cordis.patch.yml # 一键安装的补丁层
lib/index.js     # 宿主端（空壳，让插件行挂载）
lib/client.js    # 浏览器 bundle：主题 + 全部子系统
assets/          # README 截图
```

## 🧹 想卸载？

把 `cordis.patch.yml` 里的 `ui-theme-cyberpunk` 行删掉，再移除依赖并重启 `dsh web` 即可。夜之城随时欢迎你回来。

> ⚠️ **`dsh plugin rm` 的已知坑**：它不会自动清掉 `cordis.patch.yml` 里已插入的主题行。卸载后如果重启 `dsh web` 报找不到包，手动删掉 profile 补丁里的 `ui-theme-cyberpunk` 行（见上），再重启一次就好。另注意 `0.1.3` 及更早版本存在安装即崩溃的问题，卸载请认准 `0.1.4+`。
````

</details>

**依据 2 · 源码核查**：[lib/client.js:1152-1158](https://github.com/Tommy00748/dsh-theme-cyberpunk2077/blob/a3681ee431f59c64b8bf37d34ee609ddc7811278/lib/client.js#L1152-L1158)

减弱动态效果的 CSS。

```text
				"@media (prefers-reduced-motion: reduce) {",
				"  button[class*='primary'], button[class*='newSession'], [class*='logoRow'] { animation: none !important; }",
				"  [class*='_sessionRow']:hover::before { animation: none !important; }",
				"  body.cp-working [class*='_accessory']:has([class*='_pending'])::before { animation: none !important; }",
				"  [class*='_accessory']:has([class*='_pending'])::after { animation: none !important; }",
				"  #cp2077-hud #cp2077-hex, #cp2077-chip { display: none !important; }",
				"}"
```

**依据 3 · 源码核查**：[lib/client.js:1190-1214](https://github.com/Tommy00748/dsh-theme-cyberpunk2077/blob/a3681ee431f59c64b8bf37d34ee609ddc7811278/lib/client.js#L1190-L1214)

依赖宿主 theme 接线。

<details>
<summary>查看原文（25行）</summary>

```text
					ctx.theme.register({
						id: THEME_ID,
						colorScheme: "dark",
						tokens: TOKENS
					});
					ctx.theme.setTheme(THEME_ID);
				} catch (e) {
					console.error("dsh-theme-cyberpunk2077 theme register failed", e);
				}
				return () => {
					observer.disconnect();
					document.removeEventListener("keydown", onKeydown, true);
					stopPending();
					stopNotices();
					stopRelic();
					stopWake();
					stopTitle();
					stopClock();
				};
			}, "dsh-theme-cyberpunk2077: register");
		}

		exports.isPlugin = true;
		exports.inject = ["theme"];
		exports.apply = apply;
```

</details>

#### 缺口

- 不同宿主、窄屏及辅助技术实际效果未知
  **影响**：不宜默认替换常用 profile
  **进一步探讨**：分别核普通与减弱动态效果的真实页面

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 优先消费宿主状态事件能否减少误判？

**研究主题**：新假设与验证

#### 完整回答

如果宿主能给出会话状态事件，可以让声音与标题基于事件，DOM 只做兼容退路。用成功、失败、页面切换和后台任务四组对照，记录错误完成提示及页面开销。如果事件覆盖不足或延迟增加，则保留现有视觉主题，只降低状态提示的信任程度。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:462-479](https://github.com/Tommy00748/dsh-theme-cyberpunk2077/blob/a3681ee431f59c64b8bf37d34ee609ddc7811278/lib/client.js#L462-L479)

当前运行状态是 DOM class 有无。

<details>
<summary>查看原文（18行）</summary>

```text
		// Poll the composer's pending dot: appears while the agent streams,
		// vanishes on completion → combat-state chrome off, PREEM chip + chime.
		// (An interval is cheaper and more robust than a subtree
		// MutationObserver against a React tree.)
		function startPendingPoll() {
			const timer = setInterval(() => {
				const pending = document.querySelector("[class*='_pending']");
				const is = pending !== null;
				if (is !== workingNow) {
					workingNow = is;
					document.body.classList.toggle("cp-working", is);
					paintTitle();
					if (is) startTipRotation();
					else { stopTipRotation(); flashChip("PREEM. // 任务完成", "ok"); playDone(); }
				}
			}, 450);
			return () => { clearInterval(timer); stopTipRotation(); };
		}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1182-1188](https://github.com/Tommy00748/dsh-theme-cyberpunk2077/blob/a3681ee431f59c64b8bf37d34ee609ddc7811278/lib/client.js#L1182-L1188)

当前实现还观察暗色属性。

```text
				// Keep dark chroma even if the theme service later resolves the
				// preference to a light scheme and flips the attribute off.
				const observer = new MutationObserver(() => {
					document.documentElement.style.colorScheme = "dark";
					document.body.toggleAttribute("data-ds-dark-theme", true);
				});
				observer.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });
```

#### 缺口

- 目标宿主能提供何种稳定事件未知
  **影响**：不能证明可替换状态源
  **进一步探讨**：先核事件与实际任务状态一一对应

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
