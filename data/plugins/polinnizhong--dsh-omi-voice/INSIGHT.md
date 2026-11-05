# DSH Omi Voice

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[025489d](https://github.com/PolinniZhong/dsh-omi-voice/tree/025489d85f14cf9c48ba0b94fd6b059e64a34597)

<!-- BEGIN META -->
[![GitHub ★ 75](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=75&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PolinniZhong/dsh-omi-voice) [![npm 30d 1,727](https://img.shields.io/static/v1?label=npm+30d&message=1%2C727&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-omi-voice) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-omi-voice)
<!-- END META -->

> **功能**：在DSH回复旁提供点读按钮，通过本机Omi引擎调用豆包合成并播放。

> **亮点**：[Q01](#research-q01) 把DSH单条回复接到现有Omi，不用复制。

> **主要限制**：[Q02](#research-q02) pause不取消合成，200/202非停止完成；[Q03](#research-q03) 回环无鉴权且地址可覆盖。

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
  - [Q01 · 点读怎样选择文本并进入豆包？](#detail-section-11)
  - [Q02 · 缓存、暂停与停止能证明什么？](#detail-section-12)
  - [Q03 · Key、回环服务与退出有哪些条件？](#detail-section-13)
  - [Q04 · 请求身份和停止确认能否减少错认播放？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在macOS按需听DSH文字回答、可接受文本送豆包的用户。

手动复制回复到通用朗读器或使用系统朗读。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 回复点读 | 选assistant文本无需复制 | 依赖兼容node形状 |
| 播放遥控 | 按钮pause/resume和状态 | 全局乐观非task级 |
| 引擎接入 | 清洗分段豆包PCM朗读 | 另运行macOS引擎与Key |
| 缓存接入 | 复用引擎LRU与去重 | 不保证暂停停止计费 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web slots | 插件必需 | 回复旁点读 | 兼容node形状需核 |
| macOS Omi引擎 | 朗读必需 | 回环服务与播放器 | npm包不带可执行引擎 |
| Swift/macOS SDK | 源码构建需要 | 组合服务App | 未执行构建 |
| 豆包资源与Key | 合成必需 | 固定官方HTTP端点 | 字符费用/额度需实核 |
| 同浏览器机器服务 | 连接条件 | 127.0.0.1 | 远程DSH不等于远程引擎 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 测试Key短文，核engineBase未覆盖及回环服务 | 仅允许预期目的地 |
| 朗读 | 点单条回复比较过滤与分段 | 音频符合所选文字 |
| 控制 | 测pause长文和prepare中Stop | 图标与实际音频/network分别核 |
| 退出 | 引擎Stop后退出App关开机启动再移除插件 | 清Keychain/撤销Key及日志偏好 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 引擎构建与账号资源未测 | 配置Keychain及音色资源 | 不把badge当验证 |
| 持续 | 按字符及分段API费用 | 核缓存命中和暂停继续合成 | 无现场费用实测 |
| 长文 | Recording在途内存无5MiB硬界 | 核峰值和清洗误删 | LRU只限完整入缓存 |
| 退出 | 日志偏好和Keychain留存 | 分别停服务清Key | 关页面不停止引擎 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 点读接入 | assistant文本按钮与无自动朗读 | 实际宿主可用性 |
| 内容清洗 | 引擎过滤和UTF8分段 | 误删及阅读完整性 |
| 播放控制 | 代次守卫与播放器pause/stop | 停声延迟与费用 |
| 缓存去重 | 短时去重和LRU | 真实节费率 |

> **思考**：[Q02](#research-q02) pause不取消合成，200/202非停止完成；[Q03](#research-q03) 回环无鉴权且地址可覆盖。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把DSH单条回复接到现有Omi，不用复制。

[Q02](#research-q02) 清理有代次设计，但HTTP确认和实际停止仍不同。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) pause不取消合成，200/202非停止完成；[Q03](#research-q03) 回环无鉴权且地址可覆盖。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 测试Key短文确认目的地及Stop后再试长文。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态覆盖插件和固定Swift引擎链路，音质、费用和停止未实测。

- 已检查：作者 README、包清单、源码路径 client/lib/client.js、engine/Sources/ReadAloudConfig/DoubaoHTTPStreamingClient.swift、engine/Sources/ReadAloudConfig/KeychainStore.swift、engine/Sources/ReadAloudConfig/PCMStreamPlayer.swift、engine/Sources/ReadAloudConfig/ReadAloudAudioCache.swift、engine/Sources/ReadAloudConfig/ReadAloudSession.swift、engine/Sources/ReadAloudConfig/ReadAloudTextPreparation.swift、engine/Sources/ReadAloudService/LocalTTSService.swift、engine/Sources/ReadAloudService/main.swift、engine/build/build-service.sh、host/lib/index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根DSH client插件及直接依赖的仓库Swift引擎；独立引擎功能不冒充插件自带执行物。
- 下一步：真实点读/过滤、两标签、暂停网络、prepare-stop和完整退出需复现，未运行目标。

**分析版本**

- **仓库**：[PolinniZhong/dsh-omi-voice](https://github.com/PolinniZhong/dsh-omi-voice)
- **版本号**：0.1.3（[固定提交 025489d](https://github.com/PolinniZhong/dsh-omi-voice/tree/025489d85f14cf9c48ba0b94fd6b059e64a34597)）
- **版本日期**：2026-08-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) taskId/generation确认是否减少多标签错认需对照。

真实点读/过滤、两标签、暂停网络、prepare-stop和完整退出需复现，未运行目标。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 20 | 1258 | — | — | 15403 |
| .js | source | 2 | 279 | 238 | 26 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/PolinniZhong/dsh-omi-voice/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/PolinniZhong/dsh-omi-voice/issues?q=is%3Aissue+created%3A2026-10-06T06%3A34%3A44.234Z..2026-11-05T06%3A34%3A44.234Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/PolinniZhong/dsh-omi-voice/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T06%3A34%3A44.234Z..2026-11-05T06%3A34%3A44.234Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Omi Voice怎样从DSH回复发起点读，文本外传、缓存与暂停停止的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 点读怎样选择文本并进入豆包？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

根是DSH Web client插件，host Node只是no-op挂载，npm files不带engine可执行物；需另构建并运行macOS Omi服务。assistant-actions按钮按messageId查assistant node，仅拼字符串/text kind blocks，没有把tool/image/file等块全量读走，但不能据此保证流中尚未完成的text永不被点读。默认HTTP回环8765，localStorage engineBase可任意覆盖，源码没有只回环校验，所以“仅本机通信”是缺省而非不可改变约束。

引擎remoteSpeak先prepare过滤表格及不朗读块，检查有效字母数字并按UTF8段切分；缓存miss读Keychain，构造SegmentedTTSClient顺序逐段请求实际HTTP v3 openspeech.bytedance.com/api/v3/tts/unidirectional，携X-Api-Key和text，收到PCM播放。README叫TTS1.0/resource属于供应商资源配置，不应混淆实际HTTP路径版本。插件自己不拿Key不等于文本不出本机，清洗也不是secret/隐私识别；发出的是用户点选AI回复，不是自动后台朗读整场会话。

#### 证据与依据

**依据 1 · 源码核查**：[host/lib/index.js:1-15](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/host/lib/index.js#L1-L15)

Node无逻辑

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * dsh-omi-voice - minimal Node entry
 *
 * This plugin is pure client UI (read-aloud remote control for the local Omi
 * engine). The Node half is a no-op placeholder so the bundle mounts
 * cleanly; the client bundle loads via package.json exports["./client"] +
 * dsh.client.platform.
 */
const name = 'dsh-omi-voice'

export function apply(ctx) {
  // Pure client plugin: no Node-side logic needed.
}

export { name }
```

</details>

**依据 2 · 源码核查**：[package.json:14-22](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/package.json#L14-L22)

发布files无engine

```text
    "host",
    "client",
    "cordis.patch.yml",
    "docs/API.md",
    "README.md",
    "LICENSE"
  ],
  "repository": {
    "type": "git",
```

**依据 3 · 源码核查**：[client/lib/client.js:57-90](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/client/lib/client.js#L57-L90)

默认地址覆盖和text请求

<details>
<summary>查看原文（34行）</summary>

```text
		// ---- 引擎地址（可选覆盖，默认 127.0.0.1:8765）----
		const DEFAULT_ENGINE_BASE = "http://127.0.0.1:8765";
		function engineBase() {
			try {
				var v = localStorage.getItem("dsh-omi-voice/engineBase");
				if (v) return v;
			} catch (_) {}
			return DEFAULT_ENGINE_BASE;
		}

		// 播放状态全局同步（引擎是权威播放器；插件只做乐观状态）
		let activeMessageId = null;
		let activePaused = false;
		function broadcastState() {
			window.dispatchEvent(new CustomEvent("dsh-omi-voice/state", { detail: { messageId: activeMessageId, paused: activePaused } }));
		}
		function setActiveMessage(id) { activeMessageId = id; broadcastState(); }
		function setActivePaused(p) { activePaused = p; broadcastState(); }

		// ---- Omi 引擎 HTTP 客户端（协议见 docs/API.md v1）----
		async function engineStatus() {
			const res = await fetch(engineBase() + "/v1/status", { method: "GET" });
			if (!res.ok) throw { code: "unreachable" };
			return res.json();
		}
		async function speakText(text) {
			const res = await fetch(engineBase() + "/v1/speak", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: text })
			});
			let body = {};
			try { body = await res.json(); } catch (_) {}
			if (!res.ok) throw (body && body.error) || { code: "unknown", message: "朗读失败" };
```

</details>

**依据 4 · 源码核查**：[client/lib/client.js:124-155](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/client/lib/client.js#L124-L155)

assistant文本提取

<details>
<summary>查看原文（32行）</summary>

```text
		function findAssistantNode(session, messageId) {
			if (!session || !messageId) return null;
			var nodes = session.nodes || [];
			for (var i = 0; i < nodes.length; i++) {
				var n = nodes[i];
				if (n && n.kind === "assistant" && n.messageId === messageId) return n;
			}
			if (session.chat && session.chat.nodes) {
				try {
					var store = session.chat.nodes;
					var all = (typeof store.values === "function") ? store.values() : [];
					for (var j = 0; j < all.length; j++) {
						var inner = (all[j] && all[j].node) || all[j];
						if (inner && inner.kind === "assistant" && inner.messageId === messageId) return inner;
					}
				} catch (_) {}
			}
			return null;
		}
		function findMessageText(session, messageId) {
			var node = findAssistantNode(session, messageId);
			if (!node) return "";
			var blocks = node.blocks || node.content || [];
			var out = "";
			for (var i = 0; i < blocks.length; i++) {
				var b = blocks[i];
				if (!b) continue;
				if (typeof b === "string") { out += b; continue; }
				if (b.kind === "text" && typeof b.text === "string") out += b.text;
			}
			return out.trim();
		}
```

</details>

**依据 5 · 源码核查**：[client/lib/client.js:250-257](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/client/lib/client.js#L250-L257)

点读注册

```text
		function apply(ctx) {
			// 每条 assistant 回复旁的朗读按钮（仅点读，无自动朗读）
			ctx.slots.inject("conversation.chat.assistant-actions", function () {
				return ctx.slots.register(
					{ name: "conversation.chat.assistant-actions", id: "omi-voice-speak", order: 5, label: "朗读" },
					function (props) { return react.createElement(SpeakButton, props); }
				);
			});
```

**依据 6 · 源码核查**：[engine/Sources/ReadAloudService/main.swift:1346-1368](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudService/main.swift#L1346-L1368)

清洗验证与enqueue

<details>
<summary>查看原文（23行）</summary>

```text
    func remoteSpeak(text: String, rate: Float?) throws -> Int {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { throw RemoteSpeakError.invalidText }
        // 内容校验先于 Key 校验：无有效内容时，即使未配 Key 也返回 invalid_text
        let prepared = ReadAloudTextPreparation.prepare(plainText: trimmed, html: nil)
        let hasSpeakableContent = ReadAloudTextPreparation.containsSpeakableContent(prepared.text)
        let segments = hasSpeakableContent
            ? ReadAloudTextPreparation.segments(for: prepared.text)
            : []
        guard !segments.isEmpty else { throw RemoteSpeakError.invalidText }
        guard remoteKeyConfigured else { throw RemoteSpeakError.keyNotConfigured }
        if let rate {
            let step = Int((rate * 10).rounded())
            let normalizedRate = Float(step) / 10
            if (10...20).contains(step), abs(rate - normalizedRate) < 0.0001 {
                currentRate = normalizedRate
                ReadAloudPlaybackPreferences.saveRate(normalizedRate)
                serviceLog("localtts speech-rate applied rate=\(rateText(normalizedRate))")
            }
        }
        enqueue(trimmed, html: nil, source: "dsh-plugin")
        return segments.count
    }
```

</details>

**依据 7 · 源码核查**：[engine/Sources/ReadAloudConfig/ReadAloudTextPreparation.swift:15-68](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudConfig/ReadAloudTextPreparation.swift#L15-L68)

清洗与字节分段

<details>
<summary>查看原文（54行）</summary>

```text
    static func prepare(plainText: String, html: String? = nil) -> ReadAloudPreparedText {
        let plainResult = removingPlainTextTables(from: plainText)

        let base: ReadAloudPreparedText
        if let html,
           containsHTMLTable(html),
           plainResult.removedTableBlocks == 0 {
            let htmlResult = removingHTMLTables(from: html)
            base = htmlResult.removedTableBlocks > 0 ? htmlResult : plainResult
        } else {
            base = plainResult
        }

        let cleaned = removingNonReadableBlocks(from: base.text)
        return ReadAloudPreparedText(
            text: cleaned.text,
            removedTableBlocks: base.removedTableBlocks,
            removedNonReadableBlocks: base.removedNonReadableBlocks + cleaned.removedNonReadableBlocks
        )
    }

    /// 至少包含一个 Unicode 字母或数字，才值得进入语音服务。
    /// 语言是否与音色匹配属于独立节点，这里不判断具体语种。
    static func containsSpeakableContent(_ text: String) -> Bool {
        text.unicodeScalars.contains { scalar in
            switch scalar.properties.generalCategory {
            case .uppercaseLetter, .lowercaseLetter, .titlecaseLetter,
                 .modifierLetter, .otherLetter,
                 .decimalNumber, .letterNumber, .otherNumber:
                return true
            default:
                return false
            }
        }
    }

    static func segments(
        for text: String,
        maximumUTF8Bytes: Int = defaultMaximumSegmentBytes
    ) -> [String] {
        precondition(maximumUTF8Bytes > 0)
        var remaining = text[...]
        var result: [String] = []

        while !remaining.isEmpty {
            if remaining.utf8.count <= maximumUTF8Bytes {
                appendSegment(String(remaining), to: &result)
                break
            }

            var byteCount = 0
            var maximumEnd = remaining.startIndex
            var strongBoundary: (index: String.Index, bytes: Int)?
            var secondaryBoundary: (index: String.Index, bytes: Int)?
```

</details>

**依据 8 · 源码核查**：[engine/Sources/ReadAloudService/main.swift:1065-1106](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudService/main.swift#L1065-L1106)

缓存miss及合成

<details>
<summary>查看原文（42行）</summary>

```text
                let client: any TTSClient
                if let cachedAudio = await audioCache.audio(for: cacheKey) {
                    serviceLog(
                        "tts-cache hit chunks=\(cachedAudio.chunks.count) bytes=\(cachedAudio.totalBytes)"
                    )
                    client = CachedAudioTTSClient(audio: cachedAudio)
                } else {
                    serviceLog("tts-cache miss")
                    let key = try await readAPIKeyWithRetry()
                    try Task.checkCancellation()
                    guard generation == requestGeneration else { return }
                    ReadAloudDiagnostics.registerSensitiveValue(key)
                    serviceLog("keychain-read ok")
                    var configuration = TTSConfiguration(apiKey: key)
                    configuration.model = providerSettings.model
                    configuration.resourceID = providerSettings.resourceID
                    configuration.voiceType = providerSettings.voiceID
                    configuration.speechRate = cacheKey.speechRate
                    serviceLog(
                        "tts-request profile=configured speechRate=\(configuration.speechRate) targetRate=\(rateText(synthesisRate))"
                    )
                    let networkClient = SegmentedTTSClient(
                        base: DoubaoHTTPStreamingClient(configuration: configuration),
                        segments: segments
                    )
                    serviceLog(
                        "tts-request segmented count=\(segments.count) maximumBytes=\(ReadAloudTextPreparation.defaultMaximumSegmentBytes)"
                    )
                    client = RecordingTTSClient(
                        base: networkClient,
                        key: cacheKey,
                        cache: audioCache,
                        onStored: { stored, chunkCount, byteCount in
                            Task { @MainActor in
                                serviceLog(
                                    "tts-cache store=\(stored) chunks=\(chunkCount) bytes=\(byteCount)"
                                )
                            }
                        }
                    )
                }
                try await controller.start(text: text, client: client) { [weak self] in
```

</details>

**依据 9 · 源码核查**：[engine/Sources/ReadAloudConfig/DoubaoHTTPStreamingClient.swift:15-27](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudConfig/DoubaoHTTPStreamingClient.swift#L15-L27)

固定实际HTTP目的地

<details>
<summary>查看原文（13行）</summary>

```text

        var endpoint = configuration.endpoint
        endpoint = URL(string: "https://openspeech.bytedance.com/api/v3/tts/unidirectional")!
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.timeoutInterval = 60
        for (key, value) in headers() { request.setValue(value, forHTTPHeaderField: key) }
        request.httpBody = try requestPayload(text: text)
        let preparedRequest = request

        return AsyncThrowingStream { continuation in
            let worker = Task {
                do {
```

</details>

**依据 10 · 源码核查**：[engine/Sources/ReadAloudConfig/DoubaoHTTPStreamingClient.swift:58-85](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudConfig/DoubaoHTTPStreamingClient.swift#L58-L85)

key和文本外发

<details>
<summary>查看原文（28行）</summary>

```text
    private func headers() -> [String: String] {
        var values = [
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Api-Key": configuration.apiKey,
            "X-Api-Request-Id": UUID().uuidString,
            "X-Control-Require-Usage-Tokens-Return": "text_words",
            "Connection": "keep-alive"
        ]
        if let resourceID = configuration.resourceID, !resourceID.isEmpty {
            values["X-Api-Resource-Id"] = resourceID
        }
        return values
    }

    func requestPayload(text: String) throws -> Data {
        let body: [String: Any] = [
            "req_params": [
                "text": text,
                "speaker": configuration.voiceType,
                "additions": "{\"disable_markdown_filter\":true,\"enable_language_detector\":true,\"enable_latex_tn\":true}",
                "audio_params": [
                    "format": "pcm",
                    "sample_rate": 24_000,
                    "speech_rate": configuration.clampedSpeechRate
                ]
            ]
        ]
```

</details>

#### 缺口

- 真实DSH node版本、音质和过滤误删未运行
  **影响**：不能由宣传认定最终回答完整保留或文本本地处理
  **进一步探讨**：无敏感短回复对照显示文字、清洗结果和供应商请求

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 缓存、暂停与停止能证明什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

服务同文本3秒去重、不同请求300ms节流都会返回202/new taskId/segments0，不代表新合成启动，且lastSpeak时间在内容/Key验证前更新。客户端成功后乐观设置activeMessage，pause/resume吞错误且立即换图标，再每秒读全局status；状态没有按taskId绑定，多标签/多DSH共享一个播放器会互相打断或误归属。

引擎startReading取消旧readingTask，递增requestGeneration并先await controller.stop，session actor也有generation隔离旧chunk；stop使session task.cancel、player停引擎并清队列，HTTP流onTermination取消worker，分段流逐段检查Cancellation。但remoteStop只调stopReading安排异步controller.stop后，服务即返回200，不能当所有网络已停止或供应商退费证明。pause只改session状态和player.pause，未cancel合成，暂停仍可能继续下载和消耗字符。缓存LRU最多3项/5MiB且包含text/model/resource/voice/rate/sampleRate，完整成功才store；Recording先把所有chunks积内存，5MiB只限制入缓存而非整次在途峰值，超长请求仍需测。

#### 证据与依据

**依据 1 · 源码核查**：[engine/Sources/ReadAloudService/LocalTTSService.swift:171-201](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudService/LocalTTSService.swift#L171-L201)

去重节流先记时间

<details>
<summary>查看原文（31行）</summary>

```text
        let rate = (body["rate"] as? NSNumber)?.floatValue
        // 同文本 3 秒内短时间去重：连点/重复请求不重复消耗豆包字符配额
        let normalizedText = text.trimmingCharacters(in: .whitespacesAndNewlines)
        if lastSpeakText == normalizedText,
           let lastSpeakAt,
           Date().timeIntervalSince(lastSpeakAt) < 3 {
            let payload: [String: Any] = [
                "ok": true,
                "taskId": UUID().uuidString,
                "segments": 0
            ]
            log("localtts speak deduplicated textLength=\(normalizedText.count)")
            respondJSON(connection, status: 202, reason: "Accepted", request: request, payload: payload)
            return
        }
        // 任意朗读请求间最小间隔 300ms，防连点不同消息时连续烧字数
        if let lastSpeakAt, Date().timeIntervalSince(lastSpeakAt) < 0.3 {
            let payload: [String: Any] = [
                "ok": true,
                "taskId": UUID().uuidString,
                "segments": 0
            ]
            log("localtts speak throttled")
            respondJSON(connection, status: 202, reason: "Accepted", request: request, payload: payload)
            return
        }
        lastSpeakText = normalizedText
        lastSpeakAt = Date()
        Task { @MainActor [weak self, weak provider] in
            guard let self, let provider else { return }
            do {
```

</details>

**依据 2 · 源码核查**：[client/lib/client.js:178-227](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/client/lib/client.js#L178-L227)

全局轮询与乐观pause

<details>
<summary>查看原文（50行）</summary>

```text
			react.useEffect(function () {
				if (!speaking[0]) return;
				var timer = setInterval(function () {
					engineStatus().then(function (st) {
						if (st.state === "playing") {
							setPaused(false);
						} else if (st.state === "paused") {
							setPaused(true);
						} else if (st.state === "failed") {
							setSpeaking(false);
							setPaused(false);
							setActiveMessage(null);
							toast(st.message || "朗读失败");
						} else if (st.state === "idle") {
							setSpeaking(false);
							setPaused(false);
							setActiveMessage(null);
						}
					}).catch(function () {
						setSpeaking(false);
						setPaused(false);
						setActiveMessage(null);
						toast("引擎已断开：请重新打开应用「Omi DSH」");
					});
				}, 1000);
				return function () { clearInterval(timer); };
			}, [speaking[0]]);

			var onClick = function () {
				if (speaking[0] && !paused[0]) {
					pauseEngine();
					setPaused(true);
					setActivePaused(true);
					return;
				}
				if (speaking[0] && paused[0]) {
					resumeEngine();
					setPaused(false);
					setActivePaused(false);
					return;
				}
				if (!text) { toast("这条回复没有可朗读的内容"); return; }
				speakText(text).then(function () {
					setActiveMessage(props.messageId);
					setActivePaused(false);
					setPaused(false);
				}).catch(function (err) {
					toast(errorMessage(err));
				});
			};
```

</details>

**依据 3 · 源码核查**：[engine/Sources/ReadAloudService/main.swift:1046-1064](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudService/main.swift#L1046-L1064)

代次及先停旧任务

<details>
<summary>查看原文（19行）</summary>

```text
    ) {
        readingTask?.cancel()
        updateReadingPresentation(.preparing)
        requestGeneration += 1
        let generation = requestGeneration
        let synthesisRate = currentRate
        let segments = suppliedSegments ?? ReadAloudTextPreparation.segments(for: text)
        let cacheKey = suppliedCacheKey ?? makeAudioCacheKey(text: text, rate: synthesisRate)
        activeRequestKey = cacheKey
        setRateControlEnabled(false)
        controller.setRate(1.0)
        readingTask = Task { @MainActor [weak self] in
            guard let self else { return }
            do {
                try Task.checkCancellation()
                await controller.stop()
                try Task.checkCancellation()
                guard generation == requestGeneration else { return }
                serviceLog("previous-session-cleared")
```

</details>

**依据 4 · 源码核查**：[engine/Sources/ReadAloudConfig/ReadAloudSession.swift:35-106](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudConfig/ReadAloudSession.swift#L35-L106)

session代次和pause不取消

<details>
<summary>查看原文（72行）</summary>

```text
    func start(
        text: String,
        client: any TTSClient,
        onAudioChunk: @escaping @Sendable (Data) -> Bool,
        onPlaybackStarted: @escaping @Sendable () -> Void
    ) {
        task?.cancel()
        generation &+= 1
        let currentGeneration = generation
        state = .preparing
        task = Task { [weak self] in
            do {
                let audioStream = try await client.stream(text: text)
                var didStartPlayback = false
                for try await chunk in audioStream {
                    try Task.checkCancellation()
                    switch await self?.accept(
                        chunk,
                        generation: currentGeneration,
                        onAudioChunk: onAudioChunk
                    ) {
                    case .accepted:
                        break
                    case .rejected:
                        continue
                    case .stale, .none:
                        throw CancellationError()
                    }
                    guard !didStartPlayback else { continue }
                    didStartPlayback = true
                    guard await self?.setState(.playing, generation: currentGeneration) == true else {
                        throw CancellationError()
                    }
                    onPlaybackStarted()
                }
                try Task.checkCancellation()
                if !didStartPlayback {
                    await self?.setState(
                        .failed(ReadAloudSessionError.noPlayableAudio.localizedDescription),
                        generation: currentGeneration
                    )
                }
            } catch is CancellationError {
                await self?.setState(.stopped, generation: currentGeneration)
            } catch {
                await self?.setState(
                    .failed(ReadAloudDiagnostics.userFacingMessage(error)),
                    generation: currentGeneration
                )
            }
        }
    }

    func stop() {
        generation &+= 1
        task?.cancel()
        task = nil
        state = .stopped
    }

    @discardableResult
    func pause() -> Bool {
        guard state == .playing else { return false }
        state = .paused
        return true
    }

    @discardableResult
    func resume() -> Bool {
        guard state == .paused else { return false }
        state = .playing
        return true
```

</details>

**依据 5 · 源码核查**：[engine/Sources/ReadAloudService/main.swift:1269-1282](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudService/main.swift#L1269-L1282)

stop异步安排

<details>
<summary>查看原文（14行）</summary>

```text
    @objc private func stopReading() {
        requestGeneration += 1
        readingTask?.cancel()
        readingTask = nil
        let generation = requestGeneration
        Task { @MainActor [weak self] in
            guard let self else { return }
            await controller.stop()
            guard generation == requestGeneration else { return }
            updateReadingPresentation(.stopped)
            setRateControlEnabled(true)
            serviceLog("reading-stopped source=menu")
        }
    }
```

</details>

**依据 6 · 源码核查**：[engine/Sources/ReadAloudService/LocalTTSService.swift:238-244](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudService/LocalTTSService.swift#L238-L244)

200未等待底层

```text
    private func handleStop(on connection: NWConnection, request: HTTPRequest) {
        Task { @MainActor [weak self, weak provider] in
            guard let self, let provider else { return }
            provider.remoteStop()
            self.respondJSON(connection, status: 200, reason: "OK", request: request, payload: ["ok": true])
        }
    }
```

**依据 7 · 源码核查**：[engine/Sources/ReadAloudConfig/PCMStreamPlayer.swift:150-164](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudConfig/PCMStreamPlayer.swift#L150-L164)

播放器清队列

<details>
<summary>查看原文（15行）</summary>

```text
    func stop() {
        let waiters: [CheckedContinuation<Void, Never>]
        lock.lock()
        playbackGeneration &+= 1
        pendingBufferCount = 0
        waiters = drainWaiters
        drainWaiters.removeAll()
        started = false
        paused = false
        lock.unlock()

        player.stop()
        engine.stop()
        waiters.forEach { $0.resume() }
    }
```

</details>

**依据 8 · 源码核查**：[engine/Sources/ReadAloudConfig/ReadAloudAudioCache.swift:31-57](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudConfig/ReadAloudAudioCache.swift#L31-L57)

LRU入缓存限制

<details>
<summary>查看原文（27行）</summary>

```text
    init(maximumEntries: Int = 3, maximumBytes: Int = 5 * 1024 * 1024) {
        self.maximumEntries = maximumEntries
        self.maximumBytes = maximumBytes
    }

    func audio(for key: ReadAloudAudioCacheKey) -> ReadAloudCachedAudio? {
        guard let entry = entries[key] else { return nil }
        touch(key)
        return entry.audio
    }

    @discardableResult
    func store(chunks: [Data], for key: ReadAloudAudioCacheKey) -> Bool {
        let bytes = chunks.reduce(into: 0) { $0 += $1.count }
        guard !chunks.isEmpty, bytes > 0, bytes <= maximumBytes else {
            if entries[key] != nil { remove(key) }
            return false
        }
        if let existing = entries[key] {
            totalBytes -= existing.audio.totalBytes
        }
        entries[key] = Entry(key: key, audio: ReadAloudCachedAudio(chunks: chunks, totalBytes: bytes))
        touch(key)
        totalBytes += bytes
        evictIfNeeded()
        return true
    }
```

</details>

**依据 9 · 源码核查**：[engine/Sources/ReadAloudConfig/ReadAloudAudioCache.swift:99-124](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudConfig/ReadAloudAudioCache.swift#L99-L124)

完整录制后存储

<details>
<summary>查看原文（26行）</summary>

```text
    let cache: ReadAloudLastAudioCache
    let onStored: @Sendable (Bool, Int, Int) -> Void

    func stream(text: String) async throws -> AsyncThrowingStream<Data, Error> {
        let source = try await base.stream(text: text)
        return AsyncThrowingStream { continuation in
            let worker = Task {
                var chunks: [Data] = []
                do {
                    for try await chunk in source {
                        try Task.checkCancellation()
                        chunks.append(chunk)
                        continuation.yield(chunk)
                    }
                    try Task.checkCancellation()
                    let stored = await cache.store(chunks: chunks, for: key)
                    onStored(stored, chunks.count, chunks.reduce(into: 0) { $0 += $1.count })
                    continuation.finish()
                } catch is CancellationError {
                    continuation.finish()
                } catch {
                    continuation.finish(throwing: error)
                }
            }
            continuation.onTermination = { _ in worker.cancel() }
        }
```

</details>

**依据 10 · 源码核查**：[engine/Sources/ReadAloudConfig/ReadAloudTextPreparation.swift:388-417](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudConfig/ReadAloudTextPreparation.swift#L388-L417)

分段取消链

<details>
<summary>查看原文（30行）</summary>

```text
struct SegmentedTTSClient: TTSClient {
    let base: any TTSClient
    let segments: [String]

    func stream(text: String) async throws -> AsyncThrowingStream<Data, Error> {
        let preparedSegments = segments.isEmpty ? ReadAloudTextPreparation.segments(for: text) : segments
        guard !preparedSegments.isEmpty else { throw TTSClientError.emptyText }

        return AsyncThrowingStream { continuation in
            let worker = Task {
                do {
                    for segment in preparedSegments {
                        try Task.checkCancellation()
                        let stream = try await base.stream(text: segment)
                        for try await chunk in stream {
                            try Task.checkCancellation()
                            continuation.yield(chunk)
                        }
                    }
                    continuation.finish()
                } catch is CancellationError {
                    continuation.finish()
                } catch {
                    continuation.finish(throwing: error)
                }
            }
            continuation.onTermination = { _ in worker.cancel() }
        }
    }
}
```

</details>

#### 缺口

- 实际停声延迟、取消后供应商计费和峰值内存未知
  **影响**：HTTP成功与图标不能证明停止，暂停不节省已发合成费
  **进一步探讨**：两标签/快速切换/暂停长文/stop故障对照实际音频与网络

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Key、回环服务与退出有哪些条件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

必须兼容DSH client slots、macOS Swift/AVFoundation/Network/AppKit引擎以及已开通对应豆包资源的测试Key；源码build-service实际swiftc组合服务，不把文档下载或badge当构建成功。KeychainStore用Security增改读删且可能迁移旧service，插件bundle无key；引擎日志有长度/段数/状态和经脱敏错误，内存缓存仍含文本和音频，不能宣称无敏感内容留存。

LocalTTSService只bind127.0.0.1，v1无鉴权；CORS给任意loopback hostname/port回Origin，这不是本机进程认证。非允许Origin只是无CORS响应头，并非dispatch层统一拒绝；native客户端仍可使用。HTTP每次receive64KiB但buffer可累计，未见总body/文本硬上限；应用不应向不可信本机调用者开放无限付费合成。使用远程DSH时浏览器127.0.0.1是浏览器自己的机器而非DSH服务器，需同机引擎，不能建议随意改远程地址绕过。

试用短且无敏感回答，先核engineBase未被覆盖、服务版本/Key配置及实际豆包资源，确认清洗、pause继续与stop，预算按清洗后字符及分段/重试实际账单，不能承诺缓存必然节费。退出先在引擎Stop并看声卡/网络停止，再关Omi及开机启动、移除DSH插件；客户端卸载清effect定时器但没调用stopEngine，不能靠关页面停服务。缓存进程退出清，Keychain要在引擎单独删除（还需核迁移旧项）并供应商侧撤销；退出不自动删除日志/偏好。

#### 证据与依据

**依据 1 · 源码核查**：[engine/build/build-service.sh:15-45](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/build/build-service.sh#L15-L45)

引擎构建依赖及组成

<details>
<summary>查看原文（31行）</summary>

```text
# 显式选择其他版本；未指定时优先使用标准安装位置的 Xcode。
if [[ -z "${DEVELOPER_DIR:-}" && -d "/Applications/Xcode.app/Contents/Developer" ]]; then
  export DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer"
fi

mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp "$ROOT/Resources/ReadAloudService-Info.plist" "$APP/Contents/Info.plist"
cp "$ROOT/Resources/Omi_logo.svg" "$APP/Contents/Resources/Omi_logo.svg"
cp "$ROOT/Resources/OmiDSH.icns" "$APP/Contents/Resources/OmiDSH.icns"
cp -R "$ROOT/Resources/en.lproj" "$APP/Contents/Resources/"
cp -R "$ROOT/Resources/zh-Hans.lproj" "$APP/Contents/Resources/"
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $OMI_VERSION" "$APP/Contents/Info.plist"
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $OMI_VERSION" "$APP/Contents/Info.plist"

swiftc \
  -module-cache-path /tmp/readaloud-swift-cache \
  "$ROOT"/Sources/ReadAloudConfig/KeychainStore.swift \
  "$ROOT"/Sources/ReadAloudConfig/ReadAloudDiagnostics.swift \
  "$ROOT"/Sources/ReadAloudConfig/ReadAloudPreferences.swift \
  "$ROOT"/Sources/ReadAloudConfig/DoubaoHTTPStreamingClient.swift \
  "$ROOT"/Sources/ReadAloudConfig/DoubaoTTSClient.swift \
  "$ROOT"/Sources/ReadAloudConfig/ReadAloudTextPreparation.swift \
  "$ROOT"/Sources/ReadAloudConfig/ReadAloudAudioCache.swift \
  "$ROOT"/Sources/ReadAloudConfig/PCMStreamPlayer.swift \
  "$ROOT"/Sources/ReadAloudConfig/ReadAloudController.swift \
  "$ROOT"/Sources/ReadAloudConfig/ReadAloudSession.swift \
  "$ROOT"/Sources/ReadAloudConfig/HTMLListPlainTextConverter.swift \
  "$ROOT"/Sources/ReadAloudConfig/TTSBinaryProtocol.swift \
  "$ROOT"/Sources/ReadAloudService/main.swift \
  "$ROOT"/Sources/ReadAloudService/LocalTTSService.swift \
  -parse-as-library \
```

</details>

**依据 2 · 源码核查**：[engine/Sources/ReadAloudConfig/KeychainStore.swift:41-93](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudConfig/KeychainStore.swift#L41-L93)

Keychain CRUD

<details>
<summary>查看原文（53行）</summary>

```text
    init(
        service: String = readAloudKeychainServiceV4,
        usesDataProtectionKeychain: Bool = false,
        migratesLegacyItem: Bool = true
    ) {
        self.service = service
        self.usesDataProtectionKeychain = usesDataProtectionKeychain
        self.migratesLegacyItem = migratesLegacyItem
    }

    func save(_ rawValue: String) throws {
        let value = normalized(rawValue)
        guard !value.isEmpty else { throw KeychainError.emptyValue }
        let data = Data(value.utf8)
        let query = baseQuery()
        let attributes: [String: Any] = [kSecValueData as String: data]
        let updateStatus = SecItemUpdate(query as CFDictionary, attributes as CFDictionary)
        if updateStatus == errSecItemNotFound {
            var addQuery = query
            addQuery[kSecValueData as String] = data
            if usesDataProtectionKeychain {
                addQuery[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
            }
            let addStatus = SecItemAdd(addQuery as CFDictionary, nil)
            guard addStatus == errSecSuccess else {
                throw keychainError(for: addStatus)
            }
        } else if updateStatus != errSecSuccess {
            throw keychainError(for: updateStatus)
        }
    }

    func exists() -> Bool {
        var query = baseQuery()
        query[kSecReturnData as String] = false
        query[kSecMatchLimit as String] = kSecMatchLimitOne
        return SecItemCopyMatching(query as CFDictionary, nil) == errSecSuccess
    }

    func read() throws -> String {
        do {
            return try readStoredValue()
        } catch KeychainError.itemNotFound where migratesLegacyItem {
            return try migrateLegacyValue()
        }
    }

    func remove() throws {
        let status = SecItemDelete(baseQuery() as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw keychainError(for: status)
        }
    }
```

</details>

**依据 3 · 源码核查**：[engine/Sources/ReadAloudService/LocalTTSService.swift:40-60](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudService/LocalTTSService.swift#L40-L60)

回环绑定

<details>
<summary>查看原文（21行）</summary>

```text
    func start() throws {
        let parameters = NWParameters.tcp
        parameters.requiredLocalEndpoint = NWEndpoint.hostPort(
            host: NWEndpoint.Host("127.0.0.1"),
            port: NWEndpoint.Port(rawValue: port)!
        )
        let listener = try NWListener(using: parameters)
        listener.newConnectionHandler = { [weak self] connection in
            self?.handle(connection)
        }
        listener.stateUpdateHandler = { [weak self] state in
            self?.log("localtts listener state=\(state)")
        }
        listener.start(queue: queue)
        self.listener = listener
        log("localtts started port=\(port) bound=127.0.0.1")
    }

    func stop() {
        listener?.cancel()
        listener = nil
```

</details>

**依据 4 · 源码核查**：[engine/Sources/ReadAloudService/LocalTTSService.swift:84-106](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudService/LocalTTSService.swift#L84-L106)

dispatch无鉴权

<details>
<summary>查看原文（23行）</summary>

```text
    private func dispatch(_ request: HTTPRequest, on connection: NWConnection) {
        switch (request.method, request.path) {
        case ("OPTIONS", _):
            respond(connection, status: 204, reason: "No Content", headers: corsHeaders(for: request), body: Data())
        case ("GET", "/v1/status"):
            handleStatus(on: connection, request: request)
        case ("POST", "/v1/speak"):
            handleSpeak(on: connection, request: request)
        case ("POST", "/v1/stop"):
            handleStop(on: connection, request: request)
        case ("POST", "/v1/pause"):
            handlePause(on: connection, request: request)
        case ("POST", "/v1/resume"):
            handleResume(on: connection, request: request)
        default:
            respondJSON(
                connection,
                status: 404,
                reason: "Not Found",
                request: request,
                payload: errorPayload(code: "not_found", message: "未知端点：\(request.path)")
            )
        }
```

</details>

**依据 5 · 源码核查**：[engine/Sources/ReadAloudService/LocalTTSService.swift:288-306](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudService/LocalTTSService.swift#L288-L306)

CORS非认证

<details>
<summary>查看原文（19行）</summary>

```text
    private func corsHeaders(for request: HTTPRequest) -> [String: String] {
        var headers: [String: String] = [:]
        if let origin = request.headers["origin"], Self.isLoopbackOrigin(origin) {
            headers["Access-Control-Allow-Origin"] = origin
            headers["Vary"] = "Origin"
        }
        headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        headers["Access-Control-Allow-Headers"] = "Content-Type"
        return headers
    }

    /// 服务只监听 127.0.0.1，放行任意 loopback origin（任意端口），
    /// 避免 DSH 换端口/代理端口时出现难排查的 "Load failed"。
    private static func isLoopbackOrigin(_ origin: String) -> Bool {
        guard let url = URL(string: origin), let host = url.host?.lowercased() else {
            return false
        }
        return host == "127.0.0.1" || host == "localhost" || host == "::1"
    }
```

</details>

**依据 6 · 源码核查**：[engine/Sources/ReadAloudService/LocalTTSService.swift:367-417](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudService/LocalTTSService.swift#L367-L417)

累计HTTP body

<details>
<summary>查看原文（51行）</summary>

```text
    private func receive() {
        connection.receive(minimumIncompleteLength: 1, maximumLength: 64 * 1024) { [weak self] data, _, isComplete, error in
            guard let self else { return }
            if let data, !data.isEmpty {
                self.buffer.append(data)
            }
            if error == nil {
                if let request = self.parseRequestIfReady() {
                    self.onRequest(request)
                    return
                }
                if isComplete {
                    self.connection.cancel()
                    return
                }
                self.receive()
            } else {
                self.connection.cancel()
            }
        }
    }

    private func parseRequestIfReady() -> HTTPRequest? {
        guard let headerRange = buffer.range(of: Data("\r\n\r\n".utf8)) else { return nil }
        let headerData = buffer.subdata(in: buffer.startIndex..<headerRange.lowerBound)
        guard let headerText = String(data: headerData, encoding: .utf8) else { return nil }
        var lines = headerText.components(separatedBy: "\r\n")
        guard !lines.isEmpty else { return nil }
        let requestLine = lines.removeFirst().split(separator: " ").map(String.init)
        guard requestLine.count >= 2 else { return nil }
        var headers: [String: String] = [:]
        for line in lines {
            guard let colon = line.firstIndex(of: ":") else { continue }
            let key = line[..<colon].trimmingCharacters(in: .whitespaces).lowercased()
            let value = line[line.index(after: colon)...].trimmingCharacters(in: .whitespaces)
            headers[key] = value
        }
        let contentLength = Int(headers["content-length"] ?? "") ?? 0
        let bodyStart = headerRange.upperBound
        let available = buffer.count - bodyStart
        guard available >= contentLength else { return nil }
        let body = buffer.subdata(in: bodyStart..<(bodyStart + contentLength))
        buffer.removeAll(keepingCapacity: true)
        return HTTPRequest(
            method: requestLine[0],
            path: requestLine[1],
            headers: headers,
            body: body
        )
    }
}
```

</details>

**依据 7 · 源码核查**：[client/lib/client.js:178-204](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/client/lib/client.js#L178-L204)

解绑轮询不停止引擎

<details>
<summary>查看原文（27行）</summary>

```text
			react.useEffect(function () {
				if (!speaking[0]) return;
				var timer = setInterval(function () {
					engineStatus().then(function (st) {
						if (st.state === "playing") {
							setPaused(false);
						} else if (st.state === "paused") {
							setPaused(true);
						} else if (st.state === "failed") {
							setSpeaking(false);
							setPaused(false);
							setActiveMessage(null);
							toast(st.message || "朗读失败");
						} else if (st.state === "idle") {
							setSpeaking(false);
							setPaused(false);
							setActiveMessage(null);
						}
					}).catch(function () {
						setSpeaking(false);
						setPaused(false);
						setActiveMessage(null);
						toast("引擎已断开：请重新打开应用「Omi DSH」");
					});
				}, 1000);
				return function () { clearInterval(timer); };
			}, [speaking[0]]);
```

</details>

**依据 8 · 源码核查**：[engine/Sources/ReadAloudConfig/ReadAloudAudioCache.swift:17-20](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudConfig/ReadAloudAudioCache.swift#L17-L20)

缓存进程内

```text
/// 进程内 LRU 音频缓存：默认最多 3 条、总量 ≤5MB，超出按最久未用淘汰。
/// 只存内存、不写磁盘，退出 Omi 进程即清空。
actor ReadAloudLastAudioCache {
    private struct Entry: Sendable {
```

#### 缺口

- 真实Keychain访问、供应商费用/可用性及退出验证未完成
  **影响**：本机服务仍可被其他进程使用，成本和数据去向要实核
  **进一步探讨**：仅测试Key短文本核真实网络与完整退出，之后撤销Key

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 请求身份和停止确认能否减少错认播放？

**研究主题**：新假设与验证

#### 完整回答

已有全局状态和代次守卫，候选增量不是从零加取消，而是让taskId真实对应一次accepted任务，并在status/stop返回generation及stopped确认，使客户端区分去重/节流/排队/停止完成。对照同文本连点、两个标签切换、prepare中Stop和pause时继续合成，比较错图标次数、停止等待与额外付费字符。若单用户当前体验已足够且确认增加延迟，应保持简单；接口状态也不能证明供应商费用撤销或远端副作用全终止。

#### 证据与依据

**依据 1 · 源码核查**：[engine/Sources/ReadAloudService/LocalTTSService.swift:171-201](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudService/LocalTTSService.swift#L171-L201)

每响应随机taskId

<details>
<summary>查看原文（31行）</summary>

```text
        let rate = (body["rate"] as? NSNumber)?.floatValue
        // 同文本 3 秒内短时间去重：连点/重复请求不重复消耗豆包字符配额
        let normalizedText = text.trimmingCharacters(in: .whitespacesAndNewlines)
        if lastSpeakText == normalizedText,
           let lastSpeakAt,
           Date().timeIntervalSince(lastSpeakAt) < 3 {
            let payload: [String: Any] = [
                "ok": true,
                "taskId": UUID().uuidString,
                "segments": 0
            ]
            log("localtts speak deduplicated textLength=\(normalizedText.count)")
            respondJSON(connection, status: 202, reason: "Accepted", request: request, payload: payload)
            return
        }
        // 任意朗读请求间最小间隔 300ms，防连点不同消息时连续烧字数
        if let lastSpeakAt, Date().timeIntervalSince(lastSpeakAt) < 0.3 {
            let payload: [String: Any] = [
                "ok": true,
                "taskId": UUID().uuidString,
                "segments": 0
            ]
            log("localtts speak throttled")
            respondJSON(connection, status: 202, reason: "Accepted", request: request, payload: payload)
            return
        }
        lastSpeakText = normalizedText
        lastSpeakAt = Date()
        Task { @MainActor [weak self, weak provider] in
            guard let self, let provider else { return }
            do {
```

</details>

**依据 2 · 源码核查**：[engine/Sources/ReadAloudService/main.swift:1269-1282](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/engine/Sources/ReadAloudService/main.swift#L1269-L1282)

停止异步

<details>
<summary>查看原文（14行）</summary>

```text
    @objc private func stopReading() {
        requestGeneration += 1
        readingTask?.cancel()
        readingTask = nil
        let generation = requestGeneration
        Task { @MainActor [weak self] in
            guard let self else { return }
            await controller.stop()
            guard generation == requestGeneration else { return }
            updateReadingPresentation(.stopped)
            setRateControlEnabled(true)
            serviceLog("reading-stopped source=menu")
        }
    }
```

</details>

**依据 3 · 源码核查**：[client/lib/client.js:178-227](https://github.com/PolinniZhong/dsh-omi-voice/blob/025489d85f14cf9c48ba0b94fd6b059e64a34597/client/lib/client.js#L178-L227)

全局乐观状态

<details>
<summary>查看原文（50行）</summary>

```text
			react.useEffect(function () {
				if (!speaking[0]) return;
				var timer = setInterval(function () {
					engineStatus().then(function (st) {
						if (st.state === "playing") {
							setPaused(false);
						} else if (st.state === "paused") {
							setPaused(true);
						} else if (st.state === "failed") {
							setSpeaking(false);
							setPaused(false);
							setActiveMessage(null);
							toast(st.message || "朗读失败");
						} else if (st.state === "idle") {
							setSpeaking(false);
							setPaused(false);
							setActiveMessage(null);
						}
					}).catch(function () {
						setSpeaking(false);
						setPaused(false);
						setActiveMessage(null);
						toast("引擎已断开：请重新打开应用「Omi DSH」");
					});
				}, 1000);
				return function () { clearInterval(timer); };
			}, [speaking[0]]);

			var onClick = function () {
				if (speaking[0] && !paused[0]) {
					pauseEngine();
					setPaused(true);
					setActivePaused(true);
					return;
				}
				if (speaking[0] && paused[0]) {
					resumeEngine();
					setPaused(false);
					setActivePaused(false);
					return;
				}
				if (!text) { toast("这条回复没有可朗读的内容"); return; }
				speakText(text).then(function () {
					setActiveMessage(props.messageId);
					setActivePaused(false);
					setPaused(false);
				}).catch(function (err) {
					toast(errorMessage(err));
				});
			};
```

</details>

#### 缺口

- 多标签错认和确认的体验收益未知
  **影响**：更复杂协议可能无实际价值
  **进一步探讨**：短文本两标签任务记录图标/实际播放与network对照

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
