# dsh-piano

[返回分类](../../views/categories/OTHER.md) · [返回首页](../../../README.md)

分析版本：[6d04df3](https://github.com/439436269-ctrl/dsh-piano/tree/6d04df38659655b3c71136bfe0172d0d14439d64)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在 DSH web 提供可拖按钮、浮动键盘与 Web Audio 合成的单音和刮奏。

> **核心亮点**：把钢琴键盘、24ms 跨键限速、Web Audio 合成与可拖浮钮接入 DSH overlay；增量主要是宿主内就近娱乐交互，非音乐算法突破。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：style 在模块加载时插入、AudioContext 在模块作用域缓存，没有显式卸载移除/关闭；热卸载后的资源状态未知，不能把零采样等于零成本。详见[Q03](#research-q03)。

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
  - [Q01 · 谁会用它，完成什么？](#detail-section-11)
  - [Q02 · 音色、跨键和悬浮按钮怎样实现？](#detail-section-12)
  - [Q03 · 启动、持续使用、失败恢复与生命周期成本是什么？](#detail-section-13)
  - [Q04 · 适合怎样采用，哪些改进假设可最小验证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在 DSH web 界面临时体验钢琴音效的个人用户。

独立网页钢琴或浏览器 Web Audio 示例可提供同类玩法；本包把它嵌入 DSH overlay。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Web Audio 合成 | 单键音与泛音效果 | AudioContext 和首用户手势 |
| 指针刮奏 | 跨键连续触发 | pointer capture 和 keyAt 命中 |
| 浮钮与本地记忆 | 收起、移动、音量/八度记忆 | localStorage，本地单设备 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH web 模块与 slots | 必需 | 挂 shell.overlay | 面板不出现 |
| React | 必需 | 状态与指针组件 | 客户端模块不可用 |
| AudioContext 和用户手势 | 发声必需 | 浏览器音频合成/解锁 | 静默不发声 |
| localStorage | 记忆需要 | 保存音量/八度/位置 | 失败时回默认 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 安装 | 用户按已核来源加 web bundle | 🎹 overlay 出现 |
| 解锁与演奏 | 点击按钮/琴键，拖跨键 | 实际出声、音高随键变 |
| 收起/退出 | 收起面板或移除插件并刷新 | UI 消失、音频资源无残留需核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 现金未知；浏览器音频资源 | 安装、刷新与首手势解锁 | 实际首音成功率未测 |
| 持续使用 | oscillators、压缩链和指针事件资源未知 | 调音量/八度、移动按钮 | 长时 CPU/内存未知 |
| 失败恢复 | 刷新/移除资源未知 | 核浏览器音频权限与退出残留 | 热卸载未验证 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 单键和跨键发声 | 有合成器、pointer capture 与 keyAt 路径 | 真实音质、触控兼容和首音可靠性 |
| 本地记忆 | localStorage 保存音量、八度与按钮位置 | 多设备同步、清站点后恢复 |
| 零远端样本 | 源码合成且未见 fetch | 长时本地资源与卸载状态 |

> **思考**：style 在模块加载时插入、AudioContext 在模块作用域缓存，没有显式卸载移除/关闭；热卸载后的资源状态未知，不能把零采样等于零成本。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把钢琴键盘、24ms 跨键限速、Web Audio 合成与可拖浮钮接入 DSH overlay；增量主要是宿主内就近娱乐交互，非音乐算法突破。详见[Q01](#research-q01)、[Q02](#research-q02)。

把钢琴键盘、24ms 跨键限速、Web Audio 合成与可拖浮钮接入 DSH overlay；增量主要是宿主内就近娱乐交互，非音乐算法突破。详见[Q01](#research-q01)、[Q02](#research-q02)。

共享音频输出链与缓存噪声 buffer 减少逐音分配；跨键变化才触发并用24ms限速。样式在模块顶层插入，音频上下文未显式 close；结构自测不等于听觉或资源验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

style 在模块加载时插入、AudioContext 在模块作用域缓存，没有显式卸载移除/关闭；热卸载后的资源状态未知，不能把零采样等于零成本。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

娱乐用途可观察或在隔离浏览器小范围试用，先核发声、刮奏与停用后资源；不用于需 MIDI/录音交付的场景。详见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

键盘和音频链路有源码支持；实际发声、触控和资源退出未验证；生命周期托管是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/client.js、lib/index.js、test/bundle-check.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交读取 README、包清单、浏览器源码和测试说明；未运行目标测试或播放声音。
- 下一步：在有声浏览器同宿主反复首次解锁、快速刮奏、收起和热卸载，记录音频输出、触控、CPU/内存及残留样式/上下文。

**分析版本**

- **仓库**：[439436269-ctrl/dsh-piano](https://github.com/439436269-ctrl/dsh-piano)
- **版本号**：0.2.0（[固定提交 6d04df3](https://github.com/439436269-ctrl/dsh-piano/tree/6d04df38659655b3c71136bfe0172d0d14439d64)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可把样式、音频和按钮延迟 timer 绑定 overlay 生命周期，并以重复挂载/卸载对照资源残留与再进入首音成功率；当前未实现。详见[Q04](#research-q04)。

在有声浏览器同宿主反复首次解锁、快速刮奏、收起和热卸载，记录音频输出、触控、CPU/内存及残留样式/上下文。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 445 | 376 | 47 | — |
| .md | source | 1 | 50 | — | — | 520 |
| .mjs | test | 1 | 36 | 32 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-piano/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-piano/issues?q=is%3Aissue+created%3A2026-09-22T05%3A17%3A56.340Z..2026-10-22T05%3A17%3A56.340Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-piano/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A17%3A56.340Z..2026-10-22T05%3A17%3A56.340Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本的 DSH 网页钢琴交互与音频合成增量、浏览器依赖、资源边界和适用人群。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁会用它，完成什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向想在 DSH web 界面里临时玩键盘音效的个人用户。插件以左下角可拖按钮进入浮动钢琴，点单键发声、按住跨键产生刮奏，音量和起始八度可以调整，设置与按钮位置保存在 localStorage。合格结果是手势后浏览器实际出声、跨键按音高变化，并能收起，不应妨碍正常会话。它没有音乐输入输出协议、录音或乐谱导出，因而交付是一个界面娱乐组件，不是音乐制作任务成果。

原有替代是独立网页钢琴或其它 Web Audio 小工具。本包把相同玩法接到 DSH overlay，减少离开当前页面的步骤；音频合成与键盘绘制是常见浏览器技术，不能仅因零样本/零网络就称新音频算法。README 中“零依赖”指运行时自带代码与浏览器 API，不意味着零 CPU、内存或宿主版本依赖。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-21](https://github.com/439436269-ctrl/dsh-piano/blob/6d04df38659655b3c71136bfe0172d0d14439d64/README.md#L1-L21)

作者定义使用场景、按钮/键盘交互与合成路径。

<details>
<summary>查看原文（21行）</summary>

```text
# dsh-piano · 滑动钢琴

在 DSH 界面里弹一条钢琴键盘：**点单个键出声，按住鼠标 / 触控板横向滑动会像刮奏（glissando）一样连续发声**。声音用 Web Audio 实时合成，零采样、零网络、零第三方依赖。

## 效果

- 左下角一枚 🎹 按钮（默认收起，不打扰正常使用）。**按钮可拖动**：按住移动超过 6px 即判定为拖（不会误开面板），松手后位置存 `localStorage`，下次进来仍在原处；400ms 内的 `click` 才算"点开"，拖动不会吞掉下一次真正点击。
- 点开是底部居中的浮动键盘面板：音量滑块、八度移调（− / +）、收起。
- 键盘含白键 + 黑键；按住后滑动，指到哪个键就响哪个音（按住拖动 = 刮奏）。
- 设置（音量、起始八度）持久化到 `localStorage`，刷新后保留。

## 技术要点

| 项 | 做法 |
|---|---|
| 挂载槽位 | `shell.overlay`（常驻应用面座位） |
| 音频 | Web Audio 合成：基音 + 泛音（指数衰减）+ 高通噪声锤击瞬态 + 低通 + 压缩器防削波 |
| 刮奏 | 指针按下 `setPointerCapture` → `pointermove` 用 `document.elementFromPoint` 命中 `data-midi` 键 → 键变化即触发新音 |
| 客户端形态 | 手写 `window.__ModuleLoader__.load` 零构建 bundle，`platform: web` |

## 安装
```

</details>

**依据 2 · 源码核查**：[lib/client.js:285-317](https://github.com/439436269-ctrl/dsh-piano/blob/6d04df38659655b3c71136bfe0172d0d14439d64/lib/client.js#L285-L317)

设置读写 localStorage 与音量/八度控制。

<details>
<summary>查看原文（33行）</summary>

```text
		//#region widget
		const LS_KEY = "dsh-piano:settings";
		const DEFAULTS = { volume: 0.35, startMidi: 48, octaves: 3 };
		function loadSettings() {
			try {
				return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(LS_KEY) || "{}")) };
			} catch {
				return { ...DEFAULTS };
			}
		}
		function saveSettings(s) {
			try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
		}

		function PianoWidget() {
			const [open, setOpen] = useState(false);
			const [settings, setSettings] = useState(loadSettings);
			const [activeMidi, setActiveMidi] = useState(null);

			const setVolume = useCallback((volume) => {
				setSettings((s) => {
					const next = { ...s, volume };
					saveSettings(next);
					return next;
				});
			}, []);
			const shiftOctave = useCallback((delta) => {
				setSettings((s) => {
					const startMidi = Math.max(24, Math.min(84, s.startMidi + delta * 12));
					const next = { ...s, startMidi };
					saveSettings(next);
					return next;
				});
```

</details>

**依据 3 · 源码核查**：[lib/client.js:372-427](https://github.com/439436269-ctrl/dsh-piano/blob/6d04df38659655b3c71136bfe0172d0d14439d64/lib/client.js#L372-L427)

收起按钮、浮动面板和 shell.overlay 注册。

<details>
<summary>查看原文（56行）</summary>

```text
			if (!open) {
				return h("button", {
					className: "dshp_btn",
					title: "滑动钢琴（可拖动，点开面板）",
					onClick: onBtnClick,
					onPointerDown: onBtnDown,
					onPointerMove: onBtnMove,
					onPointerUp: onBtnUp,
					onPointerCancel: onBtnUp,
					style: btnPos ? { left: btnPos.left + "px", top: btnPos.top + "px", bottom: "auto" } : undefined
				}, "🎹 钢琴");
			}

			return h("div", { className: "dshp_panel" },
				h("div", { className: "dshp_head" },
					h("span", { className: "dshp_title" }, "🎹 滑动钢琴"),
					h("div", { className: "dshp_controls" },
						h("label", { className: "dshp_vol" },
							"音量",
							h("input", {
								type: "range",
								min: 0,
								max: 1,
								step: 0.05,
								value: settings.volume,
								onChange: (e) => setVolume(parseFloat(e.target.value))
							})
						),
						h("div", { className: "dshp_oct" },
							h("button", { onClick: () => shiftOctave(-1), title: "低一个八度" }, "−"),
							"八度",
							h("button", { onClick: () => shiftOctave(1), title: "高一个八度" }, "+")
						)
					),
					h("button", { className: "dshp_close", onClick: () => setOpen(false) }, "收起")
				),
				h(PianoKeyboard, {
					startMidi: settings.startMidi,
					octaves: settings.octaves,
					volume: settings.volume,
					activeMidi,
					setActiveMidi
				}),
				h("p", { className: "dshp_hint" }, "按住鼠标 / 触控板横向滑动 = 刮奏；点单个键 = 单音")
			);
		}

		//#region apply
		const inject = ["slots"];
		function apply(ctx) {
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "dsh-piano:overlay",
				order: 100,
				inject: () => ({})
			}, PianoWidget));
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 音色、跨键和悬浮按钮怎样实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

浏览器半通过 __ModuleLoader__ 注册，React 组件挂 shell.overlay。音频在首个用户手势中创建/恢复 AudioContext；每个音有基音和三枚正弦泛音的短时包络，再加 20ms 缓存噪声作为锤击瞬态。所有音共用低通与压缩链，避免每音重建主总线；oscillator 安排 stop，单音不会无限响。没有下载采样或远端请求路径。

刮奏靠 pointer capture 后在 pointermove 中用 document.elementFromPoint 查 data-midi；只有跨到新键才触发，24ms 限速控制快速移动时的密集叠音。按键布局按七白五黑生成，面板为底部固定位置。收起按钮移动超过 6px 才判拖动，坐标限在视口内、松手保存；400ms 清除拖标志避免吞掉下一次真实点击。贡献是把可感知的钢琴交互细节组装进宿主 overlay，特别是跨键事件与复用音频总线，但没有证据证明主观音色领先独立工具。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:53-153](https://github.com/439436269-ctrl/dsh-piano/blob/6d04df38659655b3c71136bfe0172d0d14439d64/lib/client.js#L53-L153)

AudioContext、共享链和每音波形/包络生成。

<details>
<summary>查看原文（101行）</summary>

```text
		//#region audio engine
		let _ctx = null;
		let _out = null;
		let _noiseBuf = null;
		function audioCtx() {
			if (!_ctx) {
				const AC = window.AudioContext || window.webkitAudioContext;
				if (!AC) return null;
				_ctx = new AC();
			}
			if (_ctx.state === "suspended") _ctx.resume().catch(() => {});
			return _ctx;
		}
		function midiToFreq(m) {
			return 440 * Math.pow(2, (m - 69) / 12);
		}
		/**
		 * 共享输出链（只建一次）：总线 → 低通 → 压缩器。
		 * 所有音共用一个压缩器，滑奏时多音叠加由它统一压住：既防削波，
		 * 也避免每个音都重建一条 master/lowpass/compressor 链。
		 */
		function outputChain(ctx) {
			if (_out) return _out;
			const master = ctx.createGain();
			master.gain.value = 0.85;
			const lp = ctx.createBiquadFilter();
			lp.type = "lowpass";
			lp.frequency.value = 6500;
			lp.Q.value = 0.3;
			const comp = ctx.createDynamicsCompressor();
			comp.threshold.value = -22;
			comp.knee.value = 24;
			comp.ratio.value = 12;
			comp.attack.value = 0.004;
			comp.release.value = 0.18;
			master.connect(lp);
			lp.connect(comp);
			comp.connect(ctx.destination);
			_out = master;
			return master;
		}
		/**
		 * 缓存的锤击噪声缓冲（只建一次）。
		 * 上一版每个音都新建一个 AudioBuffer，快速滑动时分配抖动会引入杂音。
		 */
		function noiseBuffer(ctx) {
			if (_noiseBuf) return _noiseBuf;
			const len = Math.max(1, Math.floor(ctx.sampleRate * 0.02));
			const buf = ctx.createBuffer(1, len, ctx.sampleRate);
			const data = buf.getChannelData(0);
			for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
			_noiseBuf = buf;
			return buf;
		}
		/**
		 * 合成一枚「电钢」音：基音 + 3 枚泛音（各带指数衰减）+ 极轻的击弦瞬态。
		 * 泛音改成更少更柔的正弦、瞬态降到 0.05 倍，叠加时靠共享压缩器兜底。
		 */
		function playNote(midi, volume) {
			if (volume <= 0.01) return;
			const ctx = audioCtx();
			if (!ctx) return;
			const out = outputChain(ctx);
			const freq = midiToFreq(midi);
			const now = ctx.currentTime;
			const v = Math.max(0.02, Math.min(1, volume));

			const partials = [
				{ r: 1, a: 0.85, d: 2.0, type: "sine" },
				{ r: 2, a: 0.28, d: 1.1, type: "sine" },
				{ r: 3, a: 0.11, d: 0.6, type: "sine" },
				{ r: 4, a: 0.045, d: 0.4, type: "sine" }
			];
			for (const p of partials) {
				const osc = ctx.createOscillator();
				osc.type = p.type;
				osc.frequency.value = freq * p.r;
				osc.detune.value = (Math.random() - 0.5) * 3;
				const g = ctx.createGain();
				g.gain.setValueAtTime(0.0001, now);
				g.gain.linearRampToValueAtTime(p.a * v, now + 0.006);
				g.gain.exponentialRampToValueAtTime(0.0001, now + p.d);
				osc.connect(g);
				g.connect(out);
				osc.start(now);
				osc.stop(now + p.d + 0.08);
			}

			// 极轻的击弦瞬态：只留一点触键质感，不再是明显嘶声
			const noise = ctx.createBufferSource();
			noise.buffer = noiseBuffer(ctx);
			const hp = ctx.createBiquadFilter();
			hp.type = "highpass";
			hp.frequency.value = 2500;
			const ng = ctx.createGain();
			ng.gain.value = v * 0.05;
			noise.connect(hp);
			hp.connect(ng);
			ng.connect(out);
			noise.start(now);
		}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:155-189](https://github.com/439436269-ctrl/dsh-piano/blob/6d04df38659655b3c71136bfe0172d0d14439d64/lib/client.js#L155-L189)

白黑键与 MIDI 音高布局。

<details>
<summary>查看原文（35行）</summary>

```text
		//#region note layout
		const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
		const WHITE_SEMITONES = [0, 2, 4, 5, 7, 9, 11];
		// 黑键：afterWhite = 它右侧紧邻白键在“每个八度内”的序号（用于定位到边界），offset = 半音偏移。
		const BLACK_KEYS = [
			{ name: "C#", afterWhite: 1, offset: 1 },
			{ name: "D#", afterWhite: 2, offset: 3 },
			{ name: "F#", afterWhite: 4, offset: 6 },
			{ name: "G#", afterWhite: 5, offset: 8 },
			{ name: "A#", afterWhite: 6, offset: 10 }
		];

		function buildKeys(startMidi, octaves) {
			const white = [];
			const black = [];
			for (let o = 0; o < octaves; o++) {
				for (let i = 0; i < 7; i++) {
					const midi = startMidi + o * 12 + WHITE_SEMITONES[i];
					const pc = midi % 12;
					white.push({
						midi,
						label: NOTE_NAMES[pc] + (pc === 0 ? "" + (Math.floor(midi / 12) - 1) : ""),
						idx: o * 7 + i
					});
				}
				for (const b of BLACK_KEYS) {
					black.push({
						midi: startMidi + o * 12 + b.offset,
						label: b.name,
						boundary: o * 7 + b.afterWhite
					});
				}
			}
			return { white, black, totalWhite: white.length };
		}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:191-282](https://github.com/439436269-ctrl/dsh-piano/blob/6d04df38659655b3c71136bfe0172d0d14439d64/lib/client.js#L191-L282)

跨键检测、捕获、24ms 限速和释放。

<details>
<summary>查看原文（92行）</summary>

```text
		//#region keyboard component
		function PianoKeyboard({ startMidi, octaves, volume, activeMidi, setActiveMidi }) {
			const { white, black, totalWhite } = useMemo(
				() => buildKeys(startMidi, octaves),
				[startMidi, octaves]
			);
			const kbRef = useRef(null);
			const draggingRef = useRef(false);
			const lastMidiRef = useRef(null);
			const lastPlayRef = useRef(0);
			const volumeRef = useRef(volume);
			volumeRef.current = volume;

			const keyAt = useCallback((e) => {
				const el = document.elementFromPoint(e.clientX, e.clientY);
				if (!el || !el.closest) return null;
				const keyEl = el.closest("[data-midi]");
				if (!keyEl) return null;
				return parseInt(keyEl.getAttribute("data-midi"), 10);
			}, []);

			const onPointerDown = useCallback((e) => {
				if (e.button !== 0 && e.pointerType === "mouse") return;
				audioCtx(); // 用户手势里解锁/恢复 AudioContext
				draggingRef.current = true;
				const midi = keyAt(e);
				if (midi != null) {
					lastMidiRef.current = midi;
					setActiveMidi(midi);
					playNote(midi, volumeRef.current);
				}
				try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
			}, [keyAt, setActiveMidi]);

			const onPointerMove = useCallback((e) => {
				if (!draggingRef.current) return;
				const midi = keyAt(e);
				if (midi == null) {
					setActiveMidi(null);
					return;
				}
				if (midi !== lastMidiRef.current) {
					lastMidiRef.current = midi;
					setActiveMidi(midi);
					// 限速：快速划过整排键时不要瞬间堆满音（会糊成一片）
					const nowMs = performance.now();
					if (nowMs - lastPlayRef.current >= 24) {
						lastPlayRef.current = nowMs;
						playNote(midi, volumeRef.current);
					}
				}
			}, [keyAt, setActiveMidi]);

			const onPointerEnd = useCallback((e) => {
				draggingRef.current = false;
				lastMidiRef.current = null;
				setActiveMidi(null);
				try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
			}, [setActiveMidi]);

			const whiteWidthPct = 100 / totalWhite;
			const blackWidthPct = whiteWidthPct * 0.62;

			const whiteRow = white.map((k) =>
				h("div", {
					key: "w" + k.midi,
					"data-midi": k.midi,
					className: "dshp_white" + (k.midi === activeMidi ? " isActive" : ""),
					style: { flex: "1 1 0" }
				}, k.label)
			);

			const blackRow = black.map((k) => {
				const leftPct = k.boundary * whiteWidthPct - blackWidthPct / 2;
				return h("div", {
					key: "b" + k.midi,
					"data-midi": k.midi,
					className: "dshp_black" + (k.midi === activeMidi ? " isActive" : ""),
					style: { left: leftPct + "%", width: blackWidthPct + "%" }
				}, k.label);
			});

			return h("div", {
				ref: kbRef,
				className: "dshp_kb",
				style: { display: "flex" },
				onPointerDown,
				onPointerMove,
				onPointerUp: onPointerEnd,
				onPointerCancel: onPointerEnd,
				onContextMenu: (e) => e.preventDefault()
			}, whiteRow, blackRow);
```

</details>

**依据 4 · 源码核查**：[lib/client.js:324-381](https://github.com/439436269-ctrl/dsh-piano/blob/6d04df38659655b3c71136bfe0172d0d14439d64/lib/client.js#L324-L381)

按钮拖动阈值、位置持久化及点击区分。

<details>
<summary>查看原文（58行）</summary>

```text
			// —— 收起态按钮**可拖动**：移动超过 6px 判定为「拖」（不触发开面板），
			//    松手后位置存 localStorage，下次进来仍在原处。 ——
			const [btnPos, setBtnPos] = useState(() => {
				try { return JSON.parse(localStorage.getItem("dsh-piano:btnPos") || "null"); } catch { return null; }
			});
			const btnPosRef = useRef(btnPos);
			btnPosRef.current = btnPos;
			const dragRef = useRef(null);
			const draggedRef = useRef(false);
			const dragClearRef = useRef(0);

			const onBtnDown = (e) => {
				if (e.pointerType === "mouse" && e.button !== 0) return;
				draggedRef.current = false;
				const r = e.currentTarget.getBoundingClientRect();
				dragRef.current = { x: e.clientX, y: e.clientY, left: r.left, top: r.top, moved: false };
				try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
			};
			const onBtnMove = (e) => {
				const d = dragRef.current;
				if (!d) return;
				const dx = e.clientX - d.x;
				const dy = e.clientY - d.y;
				if (!d.moved && Math.abs(dx) + Math.abs(dy) > 6) d.moved = true;
				if (!d.moved) return;
				const left = Math.max(4, Math.min(window.innerWidth - 70, d.left + dx));
				const top = Math.max(4, Math.min(window.innerHeight - 50, d.top + dy));
				btnPosRef.current = { left, top };
				setBtnPos({ left, top });
			};
			const onBtnUp = (e) => {
				const d = dragRef.current;
				dragRef.current = null;
				try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
				if (!d || !d.moved) return;
				draggedRef.current = true;
				const pos = btnPosRef.current;
				if (pos) { try { localStorage.setItem("dsh-piano:btnPos", JSON.stringify(pos)); } catch {} }
				// 拖完不一定紧跟 click（拖到按钮外松手就点不出来）→ 400ms 后自动清标志，
				// 免得把**下一次**真正的点击吞掉
				if (dragClearRef.current) window.clearTimeout(dragClearRef.current);
				dragClearRef.current = window.setTimeout(() => { draggedRef.current = false; }, 400);
			};
			const onBtnClick = () => {
				if (draggedRef.current) { draggedRef.current = false; return; } // 刚才那一下是拖，不是点
				onOpen();
			};

			if (!open) {
				return h("button", {
					className: "dshp_btn",
					title: "滑动钢琴（可拖动，点开面板）",
					onClick: onBtnClick,
					onPointerDown: onBtnDown,
					onPointerMove: onBtnMove,
					onPointerUp: onBtnUp,
					onPointerCancel: onBtnUp,
					style: btnPos ? { left: btnPos.left + "px", top: btnPos.top + "px", bottom: "auto" } : undefined
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启动、持续使用、失败恢复与生命周期成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

需要 DSH web 客户端模块、React、slots、浏览器 AudioContext 和用户手势解锁。包的 Host 半为空，实际功能全在浏览器；无 AudioContext 时 playNote 直接返回，不显示明确错误。首次安装、刷新与第一次点开或按键是人工步骤；持续成本来自重叠 oscillator、噪声、压缩链和 React 指针事件，现金与资源量没有测量。音量与位置存本地浏览器，跨设备/清站点会失去设置。

源码在模块加载时立即插入 style 标签，位置在 ctx.apply 之外；AudioContext/_out/_noiseBuf 也在模块作用域缓存。组件没有看到显式 style 移除、AudioContext.close 或按钮拖动清标志 timer 的卸载清理。宿主切换/热卸载后是否残留取决于模块生命周期，不能宣称已发生泄漏。测试脚本被作者标为 bundle 结构与 marker 断言，不能替代真实声音、键盘触控或卸载验收。声音不能播放时可刷新页面、确认用户手势和浏览器声音权限；完整禁用需移除插件或宿主关闭 overlay，实际退出未本轮验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:21-65](https://github.com/439436269-ctrl/dsh-piano/blob/6d04df38659655b3c71136bfe0172d0d14439d64/lib/client.js#L21-L65)

style 在模块加载时插入，AudioContext 懒创建但无显式 close。

<details>
<summary>查看原文（45行）</summary>

```text
		//#region styles
		const CSS = [
			".dshp_btn{box-sizing:border-box;position:fixed;left:16px;bottom:16px;z-index:2147483000;height:44px;min-width:44px;padding:0 14px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;border-radius:22px;background:var(--dsw-alias-bg-elevated,#1f2430);color:var(--dsw-alias-label-primary,#e6e8ee);box-shadow:0 6px 24px rgba(0,0,0,.35);cursor:pointer;user-select:none;touch-action:none;will-change:transform;font-size:16px;line-height:20px}",
			".dshp_btn:hover{background:var(--dsw-alias-interactive-bg-hover,#2a3140)}",
			".dshp_panel{box-sizing:border-box;position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147483000;width:min(94vw,760px);display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:14px;background:var(--dsw-alias-bg-elevated,#1f2430);color:var(--dsw-alias-label-primary,#e6e8ee);box-shadow:0 12px 40px rgba(0,0,0,.45);user-select:none}",
			".dshp_head{display:flex;align-items:center;gap:12px}",
			".dshp_title{flex:none;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary,#9aa2b1)}",
			".dshp_controls{flex:1;display:flex;align-items:center;gap:12px}",
			".dshp_vol{display:flex;align-items:center;gap:6px;color:var(--dsw-alias-label-tertiary,#6b7280);font-size:11px;line-height:16px}",
			".dshp_vol input[type=range]{width:96px;accent-color:var(--dsw-alias-state-business-primary,#5b8def)}",
			".dshp_oct{display:flex;align-items:center;gap:6px;color:var(--dsw-alias-label-tertiary,#6b7280);font-size:11px;line-height:16px}",
			".dshp_oct button{box-sizing:border-box;width:24px;height:24px;padding:0;border:1px solid var(--dsw-alias-border-l2,#3a4150);border-radius:6px;background:transparent;color:var(--dsw-alias-label-primary,#e6e8ee);cursor:pointer;font-size:14px;line-height:1;display:inline-flex;align-items:center;justify-content:center}",
			".dshp_oct button:hover{background:var(--dsw-alias-interactive-bg-hover,#2a3140)}",
			".dshp_close{margin-left:auto;box-sizing:border-box;height:24px;padding:0 10px;border:none;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary,#9aa2b1);cursor:pointer;font-size:12px;line-height:20px}",
			".dshp_close:hover{background:var(--dsw-alias-interactive-bg-hover,#2a3140);color:var(--dsw-alias-label-primary,#e6e8ee)}",
			".dshp_kb{position:relative;height:180px;touch-action:none;cursor:pointer;border-radius:10px;overflow:hidden}",
			".dshp_kb::after{content:\"\";position:absolute;left:0;right:0;bottom:0;height:4px;background:linear-gradient(90deg,#d33,#e88,#d33);opacity:.55;pointer-events:none}",
			".dshp_white{position:relative;z-index:1;flex:1 1 0;height:100%;border-right:1px solid var(--dsw-alias-border-l2,#3a4150);border-radius:0 0 4px 4px;background:linear-gradient(180deg,#f7f8fa 0%,#e8ebf0 96%);color:#3a4150;display:flex;align-items:flex-end;justify-content:center;padding-bottom:8px;font-size:11px;line-height:14px}",
			".dshp_white:last-child{border-right:none}",
			".dshp_white.isActive{background:linear-gradient(180deg,#bcd4ff 0%,#9fc0ff 96%)}",
			".dshp_black{position:absolute;z-index:2;top:0;height:62%;border-radius:0 0 4px 4px;background:linear-gradient(180deg,#2b303b 0%,#11141a 100%);color:#9aa2b1;box-shadow:0 2px 6px rgba(0,0,0,.4);display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;font-size:9px;line-height:12px}",
			".dshp_black.isActive{background:linear-gradient(180deg,#4a6fb0 0%,#2f4d8f 100%)}",
			".dshp_hint{margin:0;font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary,#6b7280)}"
		].join("");
		const tagId = "dsh-piano/piano.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const style = document.createElement("style");
			style.setAttribute("data-plugin-css", tagId);
			style.textContent = CSS;
			document.head.appendChild(style);
		}

		//#region audio engine
		let _ctx = null;
		let _out = null;
		let _noiseBuf = null;
		function audioCtx() {
			if (!_ctx) {
				const AC = window.AudioContext || window.webkitAudioContext;
				if (!AC) return null;
				_ctx = new AC();
			}
			if (_ctx.state === "suspended") _ctx.resume().catch(() => {});
			return _ctx;
		}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:285-297](https://github.com/439436269-ctrl/dsh-piano/blob/6d04df38659655b3c71136bfe0172d0d14439d64/lib/client.js#L285-L297)

配置本地记忆与读取失败回默认。

<details>
<summary>查看原文（13行）</summary>

```text
		//#region widget
		const LS_KEY = "dsh-piano:settings";
		const DEFAULTS = { volume: 0.35, startMidi: 48, octaves: 3 };
		function loadSettings() {
			try {
				return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(LS_KEY) || "{}")) };
			} catch {
				return { ...DEFAULTS };
			}
		}
		function saveSettings(s) {
			try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
		}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:419-434](https://github.com/439436269-ctrl/dsh-piano/blob/6d04df38659655b3c71136bfe0172d0d14439d64/lib/client.js#L419-L434)

overlay 注册路径没有资源清理逻辑。

<details>
<summary>查看原文（16行）</summary>

```text
		//#region apply
		const inject = ["slots"];
		function apply(ctx) {
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "dsh-piano:overlay",
				order: 100,
				inject: () => ({})
			}, PianoWidget));
		}
		exports.apply = apply;
		exports.inject = inject;

		return module.exports;
	}
});
```

</details>

**依据 4 · 作者声明**：[README.md:22-50](https://github.com/439436269-ctrl/dsh-piano/blob/6d04df38659655b3c71136bfe0172d0d14439d64/README.md#L22-L50)

作者安装、首次手势和旧浏览器限制。

<details>
<summary>查看原文（29行）</summary>

````text

```sh
dsh plugin --profile desktop add dsh-piano
```

装好后左下角出现 🎹 按钮（包名会进 `dsh.profile.bundles`，实测热载入，一般不用重启；没生效就刷新页面）。

本包是「双面」的（`dsh.bundle.patch` + `dsh.client`）：Loader 行拉起空的 Host 半，浏览器半通过 `exports["./client"]` 到达。

### 本地开发安装

```sh
# 以 file:/link: 目录依赖装进 profile，并加入 bundles（或 cordis insert）
dsh plugin --profile desktop add /path/to/dsh-piano -w
# 或手写：profile/package.json 加 "dsh-piano": "link:...", 并在 dsh.profile.bundles 加 "dsh-piano"
```

## 开发

```sh
npm test          # node test/bundle-check.mjs —— 断言 bundle 结构与关键 marker
```

客户端 bundle 用 `link:` 目录依赖时，改完浏览器刷新即生效；服务端半改动需重启 Host。

## 说明

- 首次出声需要一次用户手势（点开按钮或按下琴键即自动解锁 AudioContext）。
- 浏览器无 `AudioContext`（极老环境）时静默不发声。
````

</details>

#### 缺口

- 没有真实浏览器音频、长时资源、热卸载和多设备结果。
  **影响**：不能保证音色、资源释放或稳定体验。
  **进一步探讨**：在有声浏览器中测首手势、快速刮奏、长时 CPU/内存、热卸载后的 style/AudioContext 与新一轮加载。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 适合怎样采用，哪些改进假设可最小验证？

**研究主题**：新假设与验证、采用判断、贡献与相对优势

#### 完整回答

娱乐用途明确、没有远端网络和敏感数据读取路径；对想在 DSH 页面临时玩声音的个人用户可观察或小范围试用。当前建议观察，娱乐用途的集成便利有限，样式和音频资源也缺少显式卸载清理。它不适合需要准确 MIDI、录音、可访问键盘控制或音乐生产交付的用户；不能用“零依赖”推断无资源成本。

可以探索生命周期托管音频与样式。把 style 插入和 AudioContext 生命周期绑定 overlay 或 ctx.effect，关闭/卸载时取消延迟 timer、释放音频资源；保持用户下次点开可再次解锁。最小对照在同一宿主反复打开/收起/热卸载，测 style 节点数、活跃 AudioContext、音频是否继续发声、重新进入首音延迟和触控行为。若释放后频繁首音静音或音质成本变差且残留没有实质风险，假设收益不成立。这是未实现方案，不能计入当前创新评分。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:45-65](https://github.com/439436269-ctrl/dsh-piano/blob/6d04df38659655b3c71136bfe0172d0d14439d64/lib/client.js#L45-L65)

加载时样式插入与全局音频上下文的比较基线。

<details>
<summary>查看原文（21行）</summary>

```text
		const tagId = "dsh-piano/piano.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const style = document.createElement("style");
			style.setAttribute("data-plugin-css", tagId);
			style.textContent = CSS;
			document.head.appendChild(style);
		}

		//#region audio engine
		let _ctx = null;
		let _out = null;
		let _noiseBuf = null;
		function audioCtx() {
			if (!_ctx) {
				const AC = window.AudioContext || window.webkitAudioContext;
				if (!AC) return null;
				_ctx = new AC();
			}
			if (_ctx.state === "suspended") _ctx.resume().catch(() => {});
			return _ctx;
		}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:319-370](https://github.com/439436269-ctrl/dsh-piano/blob/6d04df38659655b3c71136bfe0172d0d14439d64/lib/client.js#L319-L370)

按钮点击预解锁与 timer 生命周期。

<details>
<summary>查看原文（52行）</summary>

```text
			const onOpen = useCallback(() => {
				audioCtx(); // 点开时预解锁，避免第一次按键静音
				setOpen(true);
			}, []);

			// —— 收起态按钮**可拖动**：移动超过 6px 判定为「拖」（不触发开面板），
			//    松手后位置存 localStorage，下次进来仍在原处。 ——
			const [btnPos, setBtnPos] = useState(() => {
				try { return JSON.parse(localStorage.getItem("dsh-piano:btnPos") || "null"); } catch { return null; }
			});
			const btnPosRef = useRef(btnPos);
			btnPosRef.current = btnPos;
			const dragRef = useRef(null);
			const draggedRef = useRef(false);
			const dragClearRef = useRef(0);

			const onBtnDown = (e) => {
				if (e.pointerType === "mouse" && e.button !== 0) return;
				draggedRef.current = false;
				const r = e.currentTarget.getBoundingClientRect();
				dragRef.current = { x: e.clientX, y: e.clientY, left: r.left, top: r.top, moved: false };
				try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
			};
			const onBtnMove = (e) => {
				const d = dragRef.current;
				if (!d) return;
				const dx = e.clientX - d.x;
				const dy = e.clientY - d.y;
				if (!d.moved && Math.abs(dx) + Math.abs(dy) > 6) d.moved = true;
				if (!d.moved) return;
				const left = Math.max(4, Math.min(window.innerWidth - 70, d.left + dx));
				const top = Math.max(4, Math.min(window.innerHeight - 50, d.top + dy));
				btnPosRef.current = { left, top };
				setBtnPos({ left, top });
			};
			const onBtnUp = (e) => {
				const d = dragRef.current;
				dragRef.current = null;
				try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
				if (!d || !d.moved) return;
				draggedRef.current = true;
				const pos = btnPosRef.current;
				if (pos) { try { localStorage.setItem("dsh-piano:btnPos", JSON.stringify(pos)); } catch {} }
				// 拖完不一定紧跟 click（拖到按钮外松手就点不出来）→ 400ms 后自动清标志，
				// 免得把**下一次**真正的点击吞掉
				if (dragClearRef.current) window.clearTimeout(dragClearRef.current);
				dragClearRef.current = window.setTimeout(() => { draggedRef.current = false; }, 400);
			};
			const onBtnClick = () => {
				if (draggedRef.current) { draggedRef.current = false; return; } // 刚才那一下是拖，不是点
				onOpen();
			};
```

</details>

**依据 3 · 源码核查**：[lib/client.js:419-434](https://github.com/439436269-ctrl/dsh-piano/blob/6d04df38659655b3c71136bfe0172d0d14439d64/lib/client.js#L419-L434)

overlay 注册无显式卸载资源管理。

<details>
<summary>查看原文（16行）</summary>

```text
		//#region apply
		const inject = ["slots"];
		function apply(ctx) {
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "dsh-piano:overlay",
				order: 100,
				inject: () => ({})
			}, PianoWidget));
		}
		exports.apply = apply;
		exports.inject = inject;

		return module.exports;
	}
});
```

</details>

#### 缺口

- 音频/样式托管的资源收益与重新进入音频延迟未对照。
  **影响**：只能作为未来设计假设，不能评价为现有能力。
  **进一步探讨**：反复挂载、播放、卸载时测资源数与首次发声成功率。

[返回分类](../../views/categories/OTHER.md) · [返回首页](../../../README.md)
