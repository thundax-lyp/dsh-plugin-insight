# DSH Voice Scribe

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[e1d2e74](https://github.com/PensiveFei/dsh-voice-scribe/tree/e1d2e74b54613191b39bb6242b9d084a2f27b540)

<!-- BEGIN META -->
[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PensiveFei/dsh-voice-scribe) [![npm 30d 4,506](https://img.shields.io/static/v1?label=npm+30d&message=4%2C506&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-voice-scribe) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-voice-scribe)
<!-- END META -->

> **功能**：通过快捷键或麦克风按钮把录音转写成 DSH 输入框草稿，支持热词和可选润色。

> **亮点**：把快捷录音与实时预览接入原生草稿，并按预览所有权避免覆盖一部分人工编辑。[Q01](#research-q01)

> **主要限制**：自动选择在本地模型未就绪时走 Web Speech。云端失败会尝试其他已配置端点，润色另发文本。[Q02](#research-q02)

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
  - [Q01 · 语音如何进入原生输入框，用户同时编辑时会怎样？](#detail-section-11)
  - [Q02 · 自动选择是否保证音频离线，云端与润色有哪些路径？](#detail-section-12)
  - [Q03 · 什么样的试用可测出语音输入优势与误写草稿的成本？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在 DSH 连续口述长提示的人，可直接检查和修改转写草稿。

系统语音听写或手工键入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 语音录入 | 快捷录音到草稿 | 麦克风与引擎依赖 |
| 热词和润色 | 调整转写 | 润色可发送文本至模型 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 麦克风和浏览器权限 | 必需 | 捕捉录音 | 键入 |
| 本地模型或选定服务 | 转写需要 | 识别音频 | 查看引擎状态后退回键入 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 录音 | 用户确认引擎并触发录音 | 检查录音状态 |
| 核对 | 用户修改草稿再发送 | 失败时检查权限或退回键入 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地模型下载占用存储 | 配置麦克风和引擎 | 时间未知 |
| 持续 | 云端转写与润色可能计费 | 核对错词和草稿 | 单位任务未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 语音到草稿 | 明确输入通道与预览 | 精度与效率 |

> **思考**：自动选择在本地模型未就绪时走 Web Speech。云端失败会尝试其他已配置端点，润色另发文本。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把快捷录音与实时预览接入原生草稿，并按预览所有权避免覆盖一部分人工编辑。[Q01](#research-q01)

预览代次、长度限制和下载校验能明确部分失败，最终输入与权限仍需真机。

<a id="detail-section-5"></a>

### 1.4 主要限制

自动选择在本地模型未就绪时走 Web Speech。云端失败会尝试其他已配置端点，润色另发文本。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离 profile 用显式 local 和非敏感短句测试，核对草稿后再提交。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查固定源码；真实识别、宿主、网络出站和平台兼容待验。

- 已检查：作者 README、包清单、源码路径 lib/client.js、lib/index.js、lib/local-asr.js、lib/host-utils.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅查客户端、Host、引擎配置和下载校验。未录音、联网识别、下载模型或执行目标。
- 下一步：模拟录音权限、失焦、相邻会话、浏览器识别失败与云端候选耗尽。

**分析版本**

- **仓库**：[PensiveFei/dsh-voice-scribe](https://github.com/PensiveFei/dsh-voice-scribe)
- **版本号**：0.5.4（[固定提交 e1d2e74](https://github.com/PensiveFei/dsh-voice-scribe/tree/e1d2e74b54613191b39bb6242b9d084a2f27b540)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将录音与开始时的会话和草稿版本绑定，可能减少切换会话后的误插入。[Q03](#research-q03)

模拟录音权限、失焦、相邻会话、浏览器识别失败与云端候选耗尽。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 997 | — | — | 22131 |
| .js | source | 5 | 4842 | 3586 | 1066 | — |
| .cjs | source | 2 | 97 | 78 | 11 | — |
| .cjs | test | 4 | 3620 | 2994 | 385 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/PensiveFei/dsh-voice-scribe/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：语音输入如何选择本地、浏览器与云端引擎，并在录音期间保留用户对草稿的控制？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 语音如何进入原生输入框，用户同时编辑时会怎样？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

较长的口述提示可直接进入 DSH 草稿，不必从系统听写软件拷贝。点按与按住路径共享录音状态，异步启动前松开会设等待停止标记。局部预览使用录音代次和草稿快照，旧预览响应被丢弃，用户改过草稿时不覆盖；最终结果在未修改预览时替换预览，若已有改动则追加。失焦取消与极短音频会回滚仅由插件写入的预览。当前组件从宿主拿 setDraft，卸载释放，尚需验证跨会话切换与输入法实际表现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:938-970](https://github.com/PensiveFei/dsh-voice-scribe/blob/e1d2e74b54613191b39bb6242b9d084a2f27b540/lib/client.js#L938-L970)

结束媒体流、失焦及过短录音处理。

<details>
<summary>查看原文（33行）</summary>

```text
		async function finishRecording(blob) {
			const lifecycle = clientLifecycle;
			recording = false;
			recordingStopping = false;
			recorder = null;
			syncMicState();
			if (recordingCapTimer) { clearTimeout(recordingCapTimer); recordingCapTimer = null; }
			clearInterval(localPreviewTimer);
			localPreviewTimer = null;
			stopLevelMeter();
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
				stream = null;
			}
			if (discardOnStop) {
				// Window lost focus mid-recording (Alt+Tab …) — cancel: roll
				// back any preview and never insert text the user did not
				// intend for the composer.
				discardOnStop = false;
				busy = false;
				rollbackPreview(recDraftBase);
				setStatus("已取消");
				return;
			}
			if (blob.size < 200) {
				busy = false;
				// Too short: roll back the realtime preview so stale text does
				// not stay in the composer as if it were final. Only the local
				// engine writes a preview — rolling back unconditionally would
				// throw away anything the user typed while recording.
				rollbackPreview(recDraftBase);
				setStatus("录音太短，未转写");
				return;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1340-1416](https://github.com/PensiveFei/dsh-voice-scribe/blob/e1d2e74b54613191b39bb6242b9d084a2f27b540/lib/client.js#L1340-L1416)

草稿防覆盖、预览代次与最终拼接。

<details>
<summary>查看原文（77行）</summary>

```text
			// The user can type/send before the recognizer's first result arrives.
			if (previewSpanText === null && draftText() !== previewBaseline) return false;
			if (previewSpanText !== null) {
				const current = draftText();
				if (current !== previewSpanText && previewWritten.indexOf(current) === -1) return false;
			}
			previewSpanText = text;
			previewWritten = [text, previewWritten[0]].filter((v) => v !== undefined);
			return setDraftText(text);
		}

		/**
		 * Identifies the take a preview belongs to. Stopping and immediately
		 * starting again is allowed (nothing blocks it), so a preview still in
		 * flight from the previous take could otherwise write the OLD hypothesis
		 * into the new session and advance the chunk cursor from a stale count.
		 */
		let previewTake = 0;

		/** Reset the preview bookkeeping for a fresh recording. */
		function resetPreviewState() {
			previewChunkIndex = 0;
			previewText = "";
			previewSpanText = null;
			previewBaseline = draftText();
			previewWritten = [];
			previewTake++;
		}

		/**
		 * Commit a final transcript. Rebuilds from the pre-recording baseline only
		 * when the composer still holds exactly our preview span; otherwise the user
		 * changed (or sent) the draft while recording, so the transcript is appended
		 * to what is there now instead of clobbering their words.
		 */
		function commitTranscript(baseline, finalText) {
			const sep = (s) => (s !== "" && !/\s$/.test(s) ? " " : "");
			const current = draftText();
			const rebuild = previewSpanText !== null && current === previewSpanText;
			previewSpanText = null;
			return setDraftText(rebuild ? baseline + sep(baseline) + finalText : current + sep(current) + finalText);
		}

		/** Drop the live preview span, restoring the baseline only if untouched. */
		function rollbackPreview(baseline) {
			if (previewSpanText !== null && draftText() === previewSpanText) setDraftText(baseline);
			previewSpanText = null;
		}

		/**
		 * Realtime preview for the LOCAL engine: transcribe what has been
		 * recorded so far and stream the hypothesis into the composer. Runs on
		 * a 3s cadence while recording; errors are silent (the final
		 * transcription on stop is authoritative).
		 */
		async function runLocalPreview() {
			if (!recording || !recorder || localPreviewRunning) return;
			localPreviewRunning = true;
			try {
				// Upload the container header (chunk 0) plus only the chunks the last
				// preview has not seen yet: re-sending the whole recording every 3 s
				// grew quadratically (up to ~16 MB per request at the 4.3 min cap).
				const first = recordingChunks.length > 0 ? recordingChunks[0] : null;
				const tail = recordingChunks.slice(previewChunkIndex);
				if (first === null || tail.length === 0) return;
				const blob = new Blob(previewChunkIndex === 0 ? recordingChunks.slice() : [first, ...tail], { type: recordingMimeType });
				if (blob.size < 200) return;
				// Snapshot how far the uploaded blob reaches BEFORE awaiting: ondataavailable
				// keeps firing during the request, and advancing to the CURRENT chunk count
				// afterwards marked that in-flight audio as already transcribed — the preview
				// then silently skipped 1-3 s of speech on every cycle.
				const sentThrough = previewChunkIndex + tail.length;
				const take = previewTake;
				const result = await transcribeLocal(blob);
				if (take !== previewTake) return; // a new take owns the composer now
				if (!recording || !result.ok || !result.text) return;
				previewChunkIndex = sentThrough;
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1523-1557](https://github.com/PensiveFei/dsh-voice-scribe/blob/e1d2e74b54613191b39bb6242b9d084a2f27b540/lib/client.js#L1523-L1557)

按住手势与异步释放。

<details>
<summary>查看原文（35行）</summary>

```text
		/** Start recording for the hold gesture (engine-routed). */
		function startHold() {
			holdStopPending = false;
			const engine = effectiveEngine();
			if (engine === "web-speech") {
				startWebSpeech();
			} else if (engine === "local") {
				void startLocalRecording();
			} else {
				void startRecording();
			}
			syncMicState();
		}

		/** Release: stop whatever is actually recording. When the async start
		 *  (getUserMedia) has not landed yet, arm holdStopPending instead. */
		function stopHold() {
			if (wsRecording) stopWebSpeech();
			else if (recording) stopRecording();
			else holdStopPending = true;
			syncMicState();
		}

		/** Begin one hold gesture (keyboard or pointer). Idempotent. */
		function beginHold() {
			if (holdActive || busy || startPending || recording || wsRecording) return;
			holdActive = true;
			startHold();
		}

		/** End one hold gesture; no-op when nothing is being held. */
		function endHold() {
			if (!holdActive) return;
			holdActive = false;
			stopHold();
```

</details>

**依据 4 · 源码核查**：[lib/client.js:2915-2942](https://github.com/PensiveFei/dsh-voice-scribe/blob/e1d2e74b54613191b39bb6242b9d084a2f27b540/lib/client.js#L2915-L2942)

绑定宿主草稿通道并清理。

<details>
<summary>查看原文（28行）</summary>

```text
			_react.useEffect(() => {
				// Adopt the composer's draft channel (getDraft/setDraft) so the
				// recorder code can write realtime transcripts without touching
				// the DOM. Set on every render so a changed session re-adopts.
				if (inputActions && typeof inputActions.setDraft === "function") {
					setDraftChannel({
						getDraft: () => draftRef.current,
						setDraft: (text) => inputActions.setDraft(text)
					});
				}
				// Poll the REAL module state (wsRecording / recording) — the
				// window cache is only a convenience mirror; reading the module
				// variables directly means the button can never go stale.
				const check = () => {
					setRecState({
						recording: wsRecording === true || recording === true,
						busy: busy === true
					});
				};
				check();
				const timer = setInterval(check, 250);
				return () => {
					clearInterval(timer);
					// Release the channel we adopted — after unmount the
					// recorder must not keep writing to a dead composer.
					setDraftChannel(null);
				};
			}, [inputActions, input]);
```

</details>

#### 缺口

- 未做实际录音和快速换会话测试
  **影响**：不能确定不同浏览器、麦克风及会话切换下的稳定性
  **进一步探讨**：使用测试语句复现松键过早、失焦与换会话

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 自动选择是否保证音频离线，云端与润色有哪些路径？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、功能与机制、工程质量与复用

#### 完整回答

auto 在本地模型尚未 ready 时选 Web Speech，浏览器识别依赖浏览器实现与后端，所以 auto 不能承诺离线；浏览器失败时可准备本地，下次按键再录。显式 local 先准备模型并走 Host 的 PCM 推理，模型下载有长度和 SHA-256 检查。云端 ASR 路径将音频交给配置的提供商，失败时可能按顺序向后续端点重发；润色另将文字发到配置模型。Host 根据 loopback/trustedHosts、fetch-site 与 Origin 检查请求，缺 Origin 时不拒绝，部署须核对宿主访问控制。浏览器和 Host 分处不同设备时，本地识别仍须将音频送达 Host。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:244-249](https://github.com/PensiveFei/dsh-voice-scribe/blob/e1d2e74b54613191b39bb6242b9d084a2f27b540/lib/client.js#L244-L249)

auto 依赖 ready 决定下一次引擎。

```text
		/** Resolve the effective engine for the next recording. */
		function effectiveEngine() {
			const engine = readEngine();
			if (engine === "auto") return localReady ? "local" : "web-speech";
			return engine;
		}
```

**依据 2 · 源码核查**：[lib/client.js:1865-1873](https://github.com/PensiveFei/dsh-voice-scribe/blob/e1d2e74b54613191b39bb6242b9d084a2f27b540/lib/client.js#L1865-L1873)

Web Speech 失败后准备本地而非无声重放。

```text
		/** Auto-fallback: browser speech is unreachable → prep the local engine. */
		async function autoFallbackToLocal() {
			setStatus("🔁 浏览器识别不可用，正在切换本地离线识别（首次使用需下载模型约 230MB，只需一次）…", true);
			if (localReady) {
				setStatus("🔁 已切换到本地离线识别，请再按一次 " + activeTriggerName(), true);
				return;
			}
			const ok = await ensureLocalModel();
			if (ok) setStatus("✅ 本地识别模型已就绪，请再按一次 " + activeTriggerName() + " 开始说话", true);
```

**依据 3 · 源码核查**：[lib/index.js:319-347](https://github.com/PensiveFei/dsh-voice-scribe/blob/e1d2e74b54613191b39bb6242b9d084a2f27b540/lib/index.js#L319-L347)

远端 ASR 与独立润色入口。

<details>
<summary>查看原文（29行）</summary>

```text
	// Transcribe: { audio: base64, mimeType, language? }
	if (payload.action === "transcribe") {
		const audio = typeof payload.audio === "string" ? payload.audio : "";
		const mimeType = typeof payload.mimeType === "string" ? payload.mimeType : "audio/webm";
		const language = typeof payload.language === "string" ? payload.language : "";
		const settings = readSettings();
		try {
			const text = await transcribeAudio({ audioBase64: audio, mimeType, language, settings, signal: abort.signal });
			// Hot-word replacement table (hot.txt) applies to every engine.
			writeJson(res, 200, { ok: true, text: await applyHotwordsBounded(text, loadHotwords().rules, abort.signal) });
		} catch (error) {
			console.error("[dsh-voice-scribe] transcribe failed:", safeMessage(error && error.message));
			writeJson(res, 200, { ok: false, error: { code: error && error.code || "transcribe-failed", message: safeMessage(error && error.message) } });
		}
		return;
	}

	// Polish: { text, provider, model }
	if (payload.action === "polish") {
		const text = typeof payload.text === "string" ? payload.text : "";
		const provider = typeof payload.provider === "string" ? payload.provider : "";
		const model = typeof payload.model === "string" ? payload.model : "";
		if (text === "" || provider === "" || model === "") {
			writeJson(res, 400, { ok: false, error: { code: "bad-request", message: "text, provider and model are required" } });
			return;
		}
		try {
			const polished = await polishText({ text, provider, model, ctx, signal: abort.signal, prompt: resolvePolishPrompt(readSettings()) });
			writeJson(res, 200, { ok: true, text: polished });
```

</details>

**依据 4 · 源码核查**：[lib/index.js:385-403](https://github.com/PensiveFei/dsh-voice-scribe/blob/e1d2e74b54613191b39bb6242b9d084a2f27b540/lib/index.js#L385-L403)

PCM 交给本地转写函数。

<details>
<summary>查看原文（19行）</summary>

```text
	// Transcribe 16 kHz mono float32 PCM (base64 little-endian bytes).
	if (payload.action === "local-transcribe") {
		const audio = typeof payload.audio === "string" ? payload.audio : "";
		const sampleRate = payload.sampleRate === undefined ? 16000 : payload.sampleRate;
		if (!Number.isInteger(sampleRate) || sampleRate < 8000 || sampleRate > 192000) {
			writeJson(res, 400, { ok: false, error: { code: "bad-request", message: "sampleRate must be an integer between 8000 and 192000" } });
			return;
		}
		if (audio === "") {
			writeJson(res, 400, { ok: false, error: { code: "bad-request", message: "audio is required" } });
			return;
		}
		try {
			const text = await transcribePcm(base64ToFloat32(audio), sampleRate, modelDir(), abort.signal);
			writeJson(res, 200, { ok: true, text: await applyHotwordsBounded(text, loadHotwords().rules, abort.signal) });
		} catch (error) {
			console.error("[dsh-voice-scribe] local transcribe failed:", safeMessage(error && error.message));
			writeJson(res, 200, { ok: false, error: { code: error && error.code || "local-asr-failed", message: safeMessage(error && error.message) } });
		}
```

</details>

**依据 5 · 源码核查**：[lib/local-asr.js:176-180](https://github.com/PensiveFei/dsh-voice-scribe/blob/e1d2e74b54613191b39bb6242b9d084a2f27b540/lib/local-asr.js#L176-L180)

下载长度和哈希校验。

```text
				throw new Error("truncated download (" + done + "/" + total + " bytes)");
			}
			if (done < spec.minBytes) throw new Error("download too small (" + done + "/" + spec.minBytes + " bytes)");
			if (hash && hash.digest("hex") !== spec.sha256) throw new Error("download SHA-256 mismatch");
			await rename(part, target);
```

**依据 6 · 源码核查**：[lib/host-utils.js:623-638](https://github.com/PensiveFei/dsh-voice-scribe/blob/e1d2e74b54613191b39bb6242b9d084a2f27b540/lib/host-utils.js#L623-L638)

云端失败后按提供商继续。

<details>
<summary>查看原文（16行）</summary>

```text
	const providers = resolveAsrProviders(settings);
	const failures = [];
	for (const provider of providers) {
		// The browser hung up: stop before POSTing to the rest of the chain
		// (4 x 60s of quota burned for a client that is already gone).
		if (signal && signal.aborted) break;
		try {
			return await transcribeOneProvider({ raw, mimeType, language, provider, signal });
		} catch (error) {
			failures.push({ provider, error });
		}
	}
	if (signal && signal.aborted) {
		const error = new Error("ASR request aborted by the client");
		error.code = "asr-aborted";
		throw error;
```

</details>

**依据 7 · 源码核查**：[lib/host-utils.js:101-114](https://github.com/PensiveFei/dsh-voice-scribe/blob/e1d2e74b54613191b39bb6242b9d084a2f27b540/lib/host-utils.js#L101-L114)

Host 与跨站检查。

<details>
<summary>查看原文（14行）</summary>

```text
export function isTrustedApiRequest(req, trustedHosts) {
	const host = typeof req.headers.host === "string" ? req.headers.host : undefined;
	if (host === undefined) return false;
	const hostUrl = parseAuthority(host);
	if (hostUrl === undefined) return false;
	if (!isLoopbackHostname(hostUrl.hostname) && !isTrustedAuthority(hostUrl, trustedHosts)) return false;
	if (req.headers["sec-fetch-site"] === "cross-site") return false;
	const origin = req.headers.origin;
	if (origin === undefined) return true;
	try {
		return new URL(origin).host === hostUrl.host;
	} catch {
		return false;
	}
```

</details>

#### 缺口

- 未验 Web Speech 后端、真实反向代理及云端服务
  **影响**：无法确认自动模式实际出站范围
  **进一步探讨**：以显式 local、auto 冷启动和 cloud 分别记录测试音频的网络目的地

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么样的试用可测出语音输入优势与误写草稿的成本？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

用非敏感短句，先选本地引擎并关闭润色，在隔离 DSH 检查最终草稿再发送。首次模型准备约 230 MB 是界面提示，实际启动时延未知；日常应算捕捉失败、手工修订和重复云端费用。可试验把录音绑定开始时的会话与草稿版本，发生切换时将结果留待选择而非追加到当前输入框。若该保护没有减少错会话插入，或频繁阻断可接受的续写，则不采用。失败时清空测试草稿、关录音入口并退回键入。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1428-1437](https://github.com/PensiveFei/dsh-voice-scribe/blob/e1d2e74b54613191b39bb6242b9d084a2f27b540/lib/client.js#L1428-L1437)

本地模型未就绪会下载并要求再次操作。

<details>
<summary>查看原文（10行）</summary>

```text
		/** Start local recording: ensure the model first, then reuse MediaRecorder. */
		async function startLocalRecording() {
			if (!localReady) {
				setStatus("⏳ 首次使用需下载本地识别模型（约 230MB，只需一次）…", true);
				const ok = await ensureLocalModel();
				if (!ok) return false;
				setStatus("✅ 本地识别模型就绪，请再按一次 " + activeTriggerName() + " 开始说话", true);
				return false; // user presses again to start
			}
			return startRecording();
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1370-1386](https://github.com/PensiveFei/dsh-voice-scribe/blob/e1d2e74b54613191b39bb6242b9d084a2f27b540/lib/client.js#L1370-L1386)

最终结果根据草稿现状插入，可用于切换版本试验。

<details>
<summary>查看原文（17行）</summary>

```text
		 * Commit a final transcript. Rebuilds from the pre-recording baseline only
		 * when the composer still holds exactly our preview span; otherwise the user
		 * changed (or sent) the draft while recording, so the transcript is appended
		 * to what is there now instead of clobbering their words.
		 */
		function commitTranscript(baseline, finalText) {
			const sep = (s) => (s !== "" && !/\s$/.test(s) ? " " : "");
			const current = draftText();
			const rebuild = previewSpanText !== null && current === previewSpanText;
			previewSpanText = null;
			return setDraftText(rebuild ? baseline + sep(baseline) + finalText : current + sep(current) + finalText);
		}

		/** Drop the live preview span, restoring the baseline only if untouched. */
		function rollbackPreview(baseline) {
			if (previewSpanText !== null && draftText() === previewSpanText) setDraftText(baseline);
			previewSpanText = null;
```

</details>

**依据 3 · 源码核查**：[lib/client.js:2915-2942](https://github.com/PensiveFei/dsh-voice-scribe/blob/e1d2e74b54613191b39bb6242b9d084a2f27b540/lib/client.js#L2915-L2942)

输入动作变动时重新绑定草稿通道。

<details>
<summary>查看原文（28行）</summary>

```text
			_react.useEffect(() => {
				// Adopt the composer's draft channel (getDraft/setDraft) so the
				// recorder code can write realtime transcripts without touching
				// the DOM. Set on every render so a changed session re-adopts.
				if (inputActions && typeof inputActions.setDraft === "function") {
					setDraftChannel({
						getDraft: () => draftRef.current,
						setDraft: (text) => inputActions.setDraft(text)
					});
				}
				// Poll the REAL module state (wsRecording / recording) — the
				// window cache is only a convenience mirror; reading the module
				// variables directly means the button can never go stale.
				const check = () => {
					setRecState({
						recording: wsRecording === true || recording === true,
						busy: busy === true
					});
				};
				check();
				const timer = setInterval(check, 250);
				return () => {
					clearInterval(timer);
					// Release the channel we adopted — after unmount the
					// recorder must not keep writing to a dead composer.
					setDraftChannel(null);
				};
			}, [inputActions, input]);
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
