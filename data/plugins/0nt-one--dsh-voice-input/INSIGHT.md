# dsh-voice-input-web

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[c2fceee](https://github.com/0nt-one/dsh-voice-input/tree/c2fceee6a865a8466f3909d3896172f0f2fad2fa)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0nt-one/dsh-voice-input) [![npm 30d 60](https://img.shields.io/static/v1?label=npm+30d&message=60&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-voice-input-web) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-voice-input-web)
<!-- END META -->

> **实现功能**：为 DSH Web 输入栏增加浏览器 Web Speech 麦克风转写按钮，把识别最终文本写入草稿。

> **核心亮点**：无需额外 ASR key 即可把浏览器语音识别接入 DSH 草稿。详见[Q01](#research-q01)。

> **风险与缺陷**：听写期间手工编辑可被后续 final 覆写，autoSend 在识别结束时无草稿确认；音频可能经浏览器网络服务处理。详见[Q02](#research-q02)。

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
  - [Q01 · 麦克风按钮怎样写入草稿？](#detail-section-11)
  - [Q02 · 自动发送与用户编辑会发生什么竞态？](#detail-section-12)
  - [Q03 · 兼容性和采用成本是什么？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望以语音输入聊天草稿、随后可编辑再发送的 Web 用户。

操作系统语音输入或外部转写后粘贴聊天框；本包嵌入按钮。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| Web Speech | 语音转草稿 | 浏览器/网络 |
| autoSend | 结束时发送 | 无内容确认 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Web Speech 浏览器与麦克风/安全上下文 | 必需 | 采集和识别音频 | 不支持时提示，不能转写 |
| DSH client slot | 必需 | 显示按钮、写草稿/提交 | 按钮无法接入 |
| 浏览器本地存储 | 仅保存偏好时 | 语言与 autoSend 状态 | 偏好不能持久化 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 权限 | 允许麦克风 | 可启动 |
| 转写 | 说非敏感文本 | 草稿准确 |
| 校对 | 手工编辑后发送 | 无覆盖/误发 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 兼容 Web Speech 的浏览器、麦克风与可能网络服务；收费及设备价格未知 | 开麦权限、检查浏览器隐私设置、说明自动发送默认关闭；耗时未知 | 音频处理地点和许可按目标浏览器核 |
| 持续使用 | 浏览器识别资源及可能网络通信；用量/现金未知 | 转写校对、手工编辑草稿；耗时随语音长度变化但未量测 | 准确率与自动语言选择未知 |
| 失败恢复 | 错误后重录可能增加浏览器服务/网络消耗；数值未知 | 撤回误发、重录或改键盘输入并检查草稿覆盖；耗时未知 | 自动发送与编辑竞态未在真实 UI 复现 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 语音草稿 | final→setDraft | 准确率 |
| 多语言 | zh/en/auto | 真正自动语言识别 |
| 自动发送 | onend→submit | 误发概率 |

> **思考**：听写期间手工编辑可被后续 final 覆写，autoSend 在识别结束时无草稿确认；音频可能经浏览器网络服务处理。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：无需额外 ASR key 即可把浏览器语音识别接入 DSH 草稿。详见[Q01](#research-q01)。

无需额外 ASR key 即可把浏览器语音识别接入 DSH 草稿。详见[Q01](#research-q01)。

自包含客户端 bundle 注入输入栏 slot，localStorage 保存语言/autoSend；Host 为空 apply。

<a id="detail-section-5"></a>

### 1.4 主要限制

听写期间手工编辑可被后续 final 覆写，autoSend 在识别结束时无草稿确认；音频可能经浏览器网络服务处理。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

默认保持 autoSend 关闭，先用非敏感语音验证识别和草稿编辑；转写后人工检查再发送。详见[Q02](#research-q02)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

客户端 UI/数据流可核；“完全本地”与联网依赖表述冲突，自动发送/草稿编辑存在时序边界，真实浏览器未验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、client.js、lib/index.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交 README、client bundle 和空 Host；未启动浏览器、录音或上传音频。 普通安装、宿主加载及目标测试属本轮范围边界，具体机制/效果未知仍在逐题缺口保留。
- 下一步：在 Chrome/Edge 隔离 profile 测网络/权限、听写中编辑、连续识别 onend 与 autoSend。

**分析版本**

- **仓库**：[0nt-one/dsh-voice-input](https://github.com/0nt-one/dsh-voice-input)
- **版本号**：0.1.3（[固定提交 c2fceee](https://github.com/0nt-one/dsh-voice-input/tree/c2fceee6a865a8466f3909d3896172f0f2fad2fa)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用草稿版本合并而非会话开始快照覆盖，并在自动发送前人工确认/校验，会降低误发；待实测。详见[Q02](#research-q02)。

在 Chrome/Edge 隔离 profile 测网络/权限、听写中编辑、连续识别 onend 与 autoSend。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 314 | 250 | 37 | — |
| .md | source | 1 | 71 | — | — | 564 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/0nt-one/dsh-voice-input/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/0nt-one/dsh-voice-input/issues?q=is%3Aissue+created%3A2026-09-22T06%3A52%3A31.713Z..2026-10-22T06%3A52%3A31.713Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/0nt-one/dsh-voice-input/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A52%3A31.713Z..2026-10-22T06%3A52%3A31.713Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实浏览器语音转写、隐私/网络边界和自动发送/草稿更新时序。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 麦克风按钮怎样写入草稿？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

插件 Host 端 apply 为空，仅为 Web client bundle 挂载；客户端在 conversation.input.right 注入按钮，调用浏览器 SpeechRecognition/webkitSpeechRecognition，显示 interim 文字，把 final transcript 追加到输入栏草稿。用户可选择中文、英文或 auto，语言设定持久化到 localStorage。没有自建 ASR 服务和 API key，语音识别引擎由浏览器/系统提供。因浏览器实现可使用网络服务，README 同时写“完全浏览器本地”与“需要联网”，前者不能理解为音频绝不离设备；需核浏览器提供商隐私政策。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-18](https://github.com/0nt-one/dsh-voice-input/blob/c2fceee6a865a8466f3909d3896172f0f2fad2fa/README.md#L7-L18)

作者描述按钮、转写及本地说法。

<details>
<summary>查看原文（12行）</summary>

```text
语音输入客户端插件（client plugin）——给 DeepSeek Harness Web GUI 的聊天输入框工具行加一个**麦克风按钮**：点击开始说话，浏览器 Web Speech API（Chrome / Edge 内置，免费、无需 API 密钥）把语音**实时转成文字填入输入框**。

<img src="docs/preview.svg" alt="dsh-voice-input-web 运行效果预览" width="760">

## 功能

- 麦克风按钮位于输入框工具行右侧（发送按钮左侧，`conversation.input.right` 插槽）
- 点击开始/停止聆听；聆听时按钮红色脉冲，上方浮层实时显示转写中间结果
- 每段识别完成的最终文本自动追加到输入框草稿，可继续编辑后发送
- 浮层内可一键切换识别语言：中文 / English / 自动
- 可选自动发送：`localStorage` 设置 `dsh-voice-input-web.autoSend = "1"` 后，一段语音识别完成即自动发送
- 零依赖、零密钥、无服务端改动；识别完全在浏览器本地进行
```

</details>

**依据 2 · 作者声明**：[README.md:63-67](https://github.com/0nt-one/dsh-voice-input/blob/c2fceee6a865a8466f3909d3896172f0f2fad2fa/README.md#L63-L67)

作者又说明需要联网。

```text
## 兼容性

- 需要 **Chrome / Edge**（或任何支持 `webkitSpeechRecognition` 的浏览器）；Firefox 不支持 Web Speech API，会显示提示
- 页面需在 `localhost` / `127.0.0.1` 或 HTTPS 下访问（浏览器安全限制）
- 语音识别需要联网（由浏览器调用系统语音服务）
```

**依据 3 · 源码核查**：[lib/index.js:1-23](https://github.com/0nt-one/dsh-voice-input/blob/c2fceee6a865a8466f3909d3896172f0f2fad2fa/lib/index.js#L1-L23)

Host 空 apply，行为在客户端。

<details>
<summary>查看原文（23行）</summary>

```text
/* dsh-voice-input-web — host half (dual-face package shape, mirroring the official
 * dsh-client-* packages and dsh-neo-skin).
 *
 * The loader mounts a cordis entry for this package by its root export; the
 * client-modules node half only composes client bundles from entries that
 * mounted a fiber. All behaviour lives in the client half (client.js), which
 * registers a voice-input mic button into the composer's tool row through the
 * `conversation.input.right` slot. Keeping a real (no-op) host apply makes the
 * fiber mount so the client bundle reaches window.__DSH_BOOT__.
 *
 * Preferences (recognition language, auto-send) persist in localStorage — a
 * dsh-settings namespace would not be exposed to the Web client (the host
 * apiproxy only serves settings namespaces on an explicit allowlist), so the
 * plugin stays self-contained without patching the harness.
 */

/** Stable Cordis plugin name. */
const name = "dsh-voice-input-web";

/** No host-side services or registries are required. */
function apply() {}

export { apply, name };
```

</details>

**依据 4 · 源码核查**：[client.js:120-187](https://github.com/0nt-one/dsh-voice-input/blob/c2fceee6a865a8466f3909d3896172f0f2fad2fa/client.js#L120-L187)

SpeechRecognition 与 final 草稿更新。

<details>
<summary>查看原文（68行）</summary>

```text
		// ---- the composer voice-input control ----------------------------------
		function VoiceInput({ input, inputActions }) {
			const setDraft = inputActions && inputActions.setDraft;
			const submit = inputActions && inputActions.submit;
			const [listening, setListening] = useState(false);
			const [interim, setInterim] = useState("");
			const [error, setError] = useState(null);
			const [lang, setLang] = useState(readLang);

			const recRef = useRef(null);
			const langRef = useRef(lang);
			const draftRef = useRef((input && input.draft) || "");
			draftRef.current = (input && input.draft) || "";
			const baseRef = useRef("");
			const finalCountRef = useRef(0);
			const hadErrorRef = useRef(false);
			const restartRef = useRef(false);

			const stopRec = useCallback(() => {
				const rec = recRef.current;
				if (rec) {
					try { rec.stop(); } catch {}
				}
			}, []);

			const startRec = useCallback(() => {
				if (recRef.current) return;
				if (!SR) {
					setError("当前浏览器不支持语音识别，请使用 Chrome 或 Edge");
					return;
				}
				setError(null);
				hadErrorRef.current = false;
				restartRef.current = false;
				baseRef.current = draftRef.current;
				finalCountRef.current = 0;

				let rec;
				try {
					rec = new SR();
				} catch (err) {
					setError("无法创建语音识别器: " + (err && err.message ? err.message : err));
					return;
				}
				const wanted = langRef.current;
				rec.lang = wanted === "auto" ? "" : wanted;
				rec.continuous = true;
				rec.interimResults = true;
				rec.maxAlternatives = 1;

				rec.onresult = (e) => {
					let interimText = "";
					for (let i = e.resultIndex; i < e.results.length; i++) {
						const result = e.results[i];
						const text = (result[0] && result[0].transcript) || "";
						if (result.isFinal) {
							if (text) {
								const next = baseRef.current ? baseRef.current + " " + text : text;
								baseRef.current = next;
								finalCountRef.current += 1;
								try { setDraft(next); } catch {}
							}
						} else {
							interimText += text;
						}
					}
					setInterim(interimText);
				};
```

</details>

#### 缺口

- 未在 Chrome/Edge 实测音频处理或网络流量。
  **影响**：识别质量与音频去向取决于浏览器实现。
  **进一步探讨**：在隔离浏览器检查麦克风权限、网络请求和提供商数据政策。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 自动发送与用户编辑会发生什么竞态？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

autoSend 默认关闭，只有 localStorage key 被设为 "1" 才启用；onend 时若本次有 final 且无识别错误就调用 submit。它并非 README 描述的“每段识别完成即自动发送”，连续识别模式下要等结束事件。识别开始时 baseRef 快照当前草稿；每次 final 从该快照追加，若用户在聆听期间手动编辑输入栏，下一段 final 会调用 setDraft(baseRef+transcript) 覆盖手工编辑。若 autoSend 已开，结束时不再比对当前草稿与识别生成稿，也无确认门禁，可能发送被手工改过或上下文已变化的内容。应把 autoSend 作为显式 UI 开关并在发送前核对草稿版本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-18](https://github.com/0nt-one/dsh-voice-input/blob/c2fceee6a865a8466f3909d3896172f0f2fad2fa/README.md#L13-L18)

作者声称最终文本追加及每段自动发送。

```text
- 麦克风按钮位于输入框工具行右侧（发送按钮左侧，`conversation.input.right` 插槽）
- 点击开始/停止聆听；聆听时按钮红色脉冲，上方浮层实时显示转写中间结果
- 每段识别完成的最终文本自动追加到输入框草稿，可继续编辑后发送
- 浮层内可一键切换识别语言：中文 / English / 自动
- 可选自动发送：`localStorage` 设置 `dsh-voice-input-web.autoSend = "1"` 后，一段语音识别完成即自动发送
- 零依赖、零密钥、无服务端改动；识别完全在浏览器本地进行
```

**依据 2 · 源码核查**：[client.js:27-48](https://github.com/0nt-one/dsh-voice-input/blob/c2fceee6a865a8466f3909d3896172f0f2fad2fa/client.js#L27-L48)

localStorage autoSend 默认值。

<details>
<summary>查看原文（22行）</summary>

```text
		// ---- identity & storage keys ----------------------------------------
		const SOURCE = "dsh-voice-input-web";
		const LANG_KEY = "dsh-voice-input-web.lang";
		const AUTO_SEND_KEY = "dsh-voice-input-web.autoSend";
		const DEFAULT_LANG = "zh-CN";
		const CSS_TAG_ID = SOURCE + "/VoiceInput.css";

		function readLang() {
			try {
				const v = localStorage.getItem(LANG_KEY);
				return v && v.length ? v : DEFAULT_LANG;
			} catch { return DEFAULT_LANG; }
		}
		function writeLang(v) {
			try { localStorage.setItem(LANG_KEY, v); } catch {}
		}
		function readAutoSend() {
			try {
				const v = localStorage.getItem(AUTO_SEND_KEY);
				return v === null ? false : v === "1";
			} catch { return false; }
		}
```

</details>

**依据 3 · 源码核查**：[client.js:129-155](https://github.com/0nt-one/dsh-voice-input/blob/c2fceee6a865a8466f3909d3896172f0f2fad2fa/client.js#L129-L155)

开始时草稿快照。

<details>
<summary>查看原文（27行）</summary>

```text
			const recRef = useRef(null);
			const langRef = useRef(lang);
			const draftRef = useRef((input && input.draft) || "");
			draftRef.current = (input && input.draft) || "";
			const baseRef = useRef("");
			const finalCountRef = useRef(0);
			const hadErrorRef = useRef(false);
			const restartRef = useRef(false);

			const stopRec = useCallback(() => {
				const rec = recRef.current;
				if (rec) {
					try { rec.stop(); } catch {}
				}
			}, []);

			const startRec = useCallback(() => {
				if (recRef.current) return;
				if (!SR) {
					setError("当前浏览器不支持语音识别，请使用 Chrome 或 Edge");
					return;
				}
				setError(null);
				hadErrorRef.current = false;
				restartRef.current = false;
				baseRef.current = draftRef.current;
				finalCountRef.current = 0;
```

</details>

**依据 4 · 源码核查**：[client.js:170-209](https://github.com/0nt-one/dsh-voice-input/blob/c2fceee6a865a8466f3909d3896172f0f2fad2fa/client.js#L170-L209)

final 覆盖与 onend 提交。

<details>
<summary>查看原文（40行）</summary>

```text
				rec.onresult = (e) => {
					let interimText = "";
					for (let i = e.resultIndex; i < e.results.length; i++) {
						const result = e.results[i];
						const text = (result[0] && result[0].transcript) || "";
						if (result.isFinal) {
							if (text) {
								const next = baseRef.current ? baseRef.current + " " + text : text;
								baseRef.current = next;
								finalCountRef.current += 1;
								try { setDraft(next); } catch {}
							}
						} else {
							interimText += text;
						}
					}
					setInterim(interimText);
				};

				rec.onerror = (e) => {
					if (e && e.error === "aborted") return;
					hadErrorRef.current = true;
					const code = (e && e.error) || "unknown";
					setError(errorText(code));
					setInterim("");
				};

				rec.onend = () => {
					recRef.current = null;
					if (restartRef.current) {
						restartRef.current = false;
						startRec();
						return;
					}
					setListening(false);
					setInterim("");
					if (!hadErrorRef.current && readAutoSend() && finalCountRef.current > 0) {
						try { if (submit) submit(); } catch {}
					}
					finalCountRef.current = 0;
```

</details>

#### 缺口

- 未在真实 UI 同时编辑/说话复现。
  **影响**：具体宿主 setDraft/submit 时序影响待验证。
  **进一步探讨**：隔离浏览器在聆听中编辑草稿、开启 autoSend 后停止，检查实际发送内容。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 兼容性和采用成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

此包不需要 DSH 服务端模型或 API key，但依赖 Web profile 的 client module/slot 契约、浏览器 Web Speech 实现、麦克风权限、安全上下文以及网络可用性。错误码有权限拒绝、无麦克风、网络、服务不可用等提示；不支持的浏览器显示提示而不提供离线降级。识别语言和 autoSend 保存在浏览器本地，跨 profile/设备不会自动同步。采用时先关闭自动发送、用非敏感语音在目标浏览器试转写并编辑确认，再考虑是否允许自动发送。

成本分期：首次使用涉及兼容 Web Speech 的浏览器、麦克风与可能网络服务；收费及设备价格未知，人工需开麦权限、检查浏览器隐私设置、说明自动发送默认关闭；耗时未知；持续使用涉及浏览器识别资源及可能网络通信；用量/现金未知，人工需转写校对、手工编辑草稿；耗时随语音长度变化但未量测；失败恢复涉及错误后重录可能增加浏览器服务/网络消耗；数值未知，人工需撤回误发、重录或改键盘输入并检查草稿覆盖；耗时未知。金额、频次、实际耗时均未有同条件证据，不能填0或推算单位收益。

创新假设推导：Q02 代码以识别开始时的 baseRef 拼接 final，再 setDraft，用户中途编辑可被下一段覆盖；autoSend 在 onend 不校对版本。相对当前快照拼接，若基于草稿版本进行冲突检测、发送前显式确认，应降低覆盖和误发。代价是 UI 状态管理与一次确认操作，且浏览器识别行为仍未知。最小证伪：在模拟两段 final 中插入人工编辑并触发 onend，比对旧/新草稿与提交次数；若新方案仍覆盖手改内容或未经确认提交，假设失败。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:56-69](https://github.com/0nt-one/dsh-voice-input/blob/c2fceee6a865a8466f3909d3896172f0f2fad2fa/client.js#L56-L69)

Web Speech 检测及错误提示。

<details>
<summary>查看原文（14行）</summary>

```text
		const SR = typeof window !== "undefined"
			? (window.SpeechRecognition || window.webkitSpeechRecognition || null)
			: null;

		const ERROR_TEXT = {
			"not-allowed": "麦克风权限被拒绝：请在地址栏点击麦克风图标，允许本页使用麦克风",
			"service-not-allowed": "语音识别服务不可用（可能被浏览器策略限制）",
			"no-speech": "没有听到声音，请靠近麦克风再说一次",
			"audio-capture": "没有检测到麦克风设备，请检查系统麦克风",
			"network": "语音识别需要联网，请检查网络后重试",
			"language-not-supported": "当前浏览器不支持该识别语言"
		};
		function errorText(code) {
			return ERROR_TEXT[code] || ("语音识别失败: " + code);
```

</details>

**依据 2 · 源码核查**：[client.js:145-168](https://github.com/0nt-one/dsh-voice-input/blob/c2fceee6a865a8466f3909d3896172f0f2fad2fa/client.js#L145-L168)

浏览器识别器启动/语言/连续模式。

<details>
<summary>查看原文（24行）</summary>

```text
			const startRec = useCallback(() => {
				if (recRef.current) return;
				if (!SR) {
					setError("当前浏览器不支持语音识别，请使用 Chrome 或 Edge");
					return;
				}
				setError(null);
				hadErrorRef.current = false;
				restartRef.current = false;
				baseRef.current = draftRef.current;
				finalCountRef.current = 0;

				let rec;
				try {
					rec = new SR();
				} catch (err) {
					setError("无法创建语音识别器: " + (err && err.message ? err.message : err));
					return;
				}
				const wanted = langRef.current;
				rec.lang = wanted === "auto" ? "" : wanted;
				rec.continuous = true;
				rec.interimResults = true;
				rec.maxAlternatives = 1;
```

</details>

**依据 3 · 源码核查**：[client.js:243-255](https://github.com/0nt-one/dsh-voice-input/blob/c2fceee6a865a8466f3909d3896172f0f2fad2fa/client.js#L243-L255)

不支持或缺 setDraft 时 UI 边界。

<details>
<summary>查看原文（13行）</summary>

```text
			if (!setDraft) return null;

			return jsx("div", {
				className: "dvi_wrap",
				children: [
					jsx("button", {
						className: "dvi_btn" + (listening ? " dvi_listening" : ""),
						type: "button",
						title: listening ? "停止聆听" : "语音输入（点击开始说话）",
						"aria-label": listening ? "停止语音输入" : "开始语音输入",
						"aria-pressed": listening,
						onClick: toggle,
						children: MicIcon()
```

</details>

**依据 4 · 作者声明**：[README.md:56-67](https://github.com/0nt-one/dsh-voice-input/blob/c2fceee6a865a8466f3909d3896172f0f2fad2fa/README.md#L56-L67)

localStorage 与浏览器/安全上下文要求。

<details>
<summary>查看原文（12行）</summary>

```text
## 配置（localStorage）

| key | 值 | 默认 | 说明 |
| :-- | :-- | :-- | :-- |
| `dsh-voice-input-web.lang` | `zh-CN` / `en-US` / `auto` | `zh-CN` | 识别语言 |
| `dsh-voice-input-web.autoSend` | `"1"` / `"0"` | `"0"` | 识别完成后自动发送 |

## 兼容性

- 需要 **Chrome / Edge**（或任何支持 `webkitSpeechRecognition` 的浏览器）；Firefox 不支持 Web Speech API，会显示提示
- 页面需在 `localhost` / `127.0.0.1` 或 HTTPS 下访问（浏览器安全限制）
- 语音识别需要联网（由浏览器调用系统语音服务）
```

</details>

#### 缺口

- 不同浏览器、语言及网络条件下转写准确率、延迟与权限行为缺少对照。
  **影响**：不能由Web Speech API接线推断跨环境可用性或省时。
  **进一步探讨**：固定去敏语料与浏览器版本，分别比较准确率、时延、权限及断网表现。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
