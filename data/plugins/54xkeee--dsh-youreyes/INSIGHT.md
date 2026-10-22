# dsh-youreyes

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[86f02fa](https://github.com/54xkeee/dsh-youreyes/tree/86f02fa124cd158438e4d9290625d2f8dd610967)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/54xkeee/dsh-youreyes) [![npm 30d 1,096](https://img.shields.io/static/v1?label=npm+30d&message=1%2C096&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-youreyes) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-youreyes)
<!-- END META -->

> **实现功能**：将图片交给视觉模型生成文字记录，供 DSH 文本模型调用，支持 OCR、区域、多图与记忆复用。

> **核心亮点**：把VLM、图片占位、模型工具和会话记忆接成多轮流程；架构明确继承vision-toolkit，不能将模型识别能力或已有架构算新增原创。详见[Q01](#research-q01)。

> **风险与缺陷**：生成性描述可能被缓存/压缩恢复持续复用，结构化不等正确；默认本地路径无目录限制，curl回退会临时落盘，固定Git树还缺main所指lib。详见[Q03](#research-q03)和[Q04](#research-q04)。

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
  - [Q01 · 纯文本模型看图增加了什么，贡献归谁？](#detail-section-11)
  - [Q02 · 图片、通道、升级和记忆怎样流动？](#detail-section-12)
  - [Q03 · “证据”与路径/网络边界是否可信？](#detail-section-13)
  - [Q04 · 启动、构建、成本和工程条件是什么？](#detail-section-14)
  - [Q05 · 可形成何种假设与采用决定？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：文本模型用户需要解释图片和截图，合格结果是可追图的观察而非把VLM生成文字当已证事实。详见[Q01](#research-q01)。

手工调用VLM复制描述或直接使用多模态主模型；桥减少交接但多一层生成性解释和持久记录。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| vision桥 | 将图变文字观察 | 依赖VLM，准确度未测 |
| auto升级 | 复杂图再调用 | 自判可能漏判、费用增加 |
| 视觉记忆 | 跨轮复用 | 错误需要失效和纠正 |
| 多通道 | 适配服务/本地/IDE | 隐私、安装和费用各异 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| 已构建lib与宿主API | 实际加载 | Git源码不能直接视为可启动 |
| VLM端点/本地Ollama/IDE | 识别 | 成本和数据路线不同 |
| attachments/sessions/tools | 图片与证据 | 接口变更影响流程 |
| 明确allowedImageDirs | 本地读取限制 | 默认空不限制工作区 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 核查发布物或构建 | 维护者 | main/client入口存在 |
| 设通道和目录 | 用户 | 数据发送和本地读范围清楚 |
| 非敏感图片识别 | 用户/Agent | 原图标签支持观察 |
| 检查多轮记录 | 用户 | 错误不被当事实延续 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | VLM服务或本地模型、可能构建 | 端点/Key和发布物核查 | VLM端点或本地模型/构建需核；初始金额和工时未知 |
| 持续使用 | 单/双遍调用、重试、base64和记忆 | 原图校核，金额/收益未知 | 单/双遍、重试/base64和记忆资源；金额与净收益未知 |
| 失败恢复 | 可能重复调用与旧记录复用 | 纠错、失效缓存和检查临时文件 | 重复调用可能再收费；纠错/缓存失效/临时文件排查工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 文本模型利用图片 | VLM文字记录 | 不是原生像素视觉 |
| 复杂度升级 | 模型自判再deep | 多一遍不保证更正确 |
| 同图复用 | digest和问题key | 错误可被持续复用 |

> **思考**：生成性描述可能被缓存/压缩恢复持续复用，结构化不等正确；默认本地路径无目录限制，curl回退会临时落盘，固定Git树还缺main所指lib。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把VLM、图片占位、模型工具和会话记忆接成多轮流程；架构明确继承vision-toolkit，不能将模型识别能力或已有架构算新增原创。详见[Q01](#research-q01)。

把VLM、图片占位、模型工具和会话记忆接成多轮流程；架构明确继承vision-toolkit，不能将模型识别能力或已有架构算新增原创。详见[Q01](#research-q01)。

内容指纹、失败缓存清除、结构归一和compaction接线可借鉴；需同时设计纠错失效、隐私和发布入口，纯函数测试不测视觉质量。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

生成性描述可能被缓存/压缩恢复持续复用，结构化不等正确；默认本地路径无目录限制，curl回退会临时落盘，固定Git树还缺main所指lib。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，先补发布物和数据边界，以不敏感有标签图片验证；不把auto或结构化记录当隐私/准确保证。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

视觉桥、两遍和记录接线有源码支持；生成性正确性与发布物入口未核验。可校核纠错记录为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/channels.ts、tests/core.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交关键源码及纯函数测试阅读，未运行模型/构建，不获取私密图片；Git树缺lib是本次实际清单核查，不推断npm包同样缺失。
- 下一步：进一步探讨从构建发布物、默认目录、curl临时文件和视觉错误跨轮四条线入手，再比较单遍/auto/直接多模态的正确任务与总成本。

**分析版本**

- **仓库**：[54xkeee/dsh-youreyes](https://github.com/54xkeee/dsh-youreyes)
- **版本号**：0.1.0（[固定提交 86f02fa](https://github.com/54xkeee/dsh-youreyes/tree/86f02fa124cd158438e4d9290625d2f8dd610967)）
- **版本日期**：2026-08-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究原图/区域定位与纠错失效绑定的视觉记录，用固定错误跨轮样例比较纠正效果、调用量和上下文代价。当前未验证。详见[Q05](#research-q05)。

进一步探讨从构建发布物、默认目录、curl临时文件和视觉错误跨轮四条线入手，再比较单遍/auto/直接多模态的正确任务与总成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 49 | 43 | 2 | — |
| .md | source | 2 | 580 | — | — | 4871 |
| .ts | source | 4 | 1607 | 1426 | 107 | — |
| .tsx | source | 1 | 350 | 334 | 2 | — |
| .mjs | test | 1 | 244 | 212 | 13 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/54xkeee/dsh-youreyes/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/54xkeee/dsh-youreyes/issues?q=is%3Aissue+created%3A2026-09-22T05%3A08%3A46.667Z..2026-10-22T05%3A08%3A46.667Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/54xkeee/dsh-youreyes/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A08%3A46.667Z..2026-10-22T05%3A08%3A46.667Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本如何桥接VLM为文本模型提供视觉记录，生成性证据、缓存和数据/安装边界怎样限制采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 纯文本模型看图增加了什么，贡献归谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向使用文本模型却需要解释截图、OCR、区域细节或多图差异的DSH用户。合格结果应是视觉模型对指定图片/问题的观察被准确交给主模型，并且不确定项、通道和图片身份可追溯，不能把文字描述当主模型直接获得像素视觉。简单替代是手工调用VLM再复制描述，或直接选择支持图片的主模型。

增量在包装provider接受图片占位、模型vision工具、结构化视觉记录与跨轮恢复的接线。README和源码明确架构继承vision-toolkit，通道约定参考其它社区项目；本轮不把既有架构和VLM能力计作原创。OCR/compare等是提示任务模式，不是经过测量的独立算法优势。自动深度调用增加预算，效果需要和直接一次VLM或多模态主模型对照，而不是从功能多推导识别准确。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:29-44](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/index.ts#L29-L44)

源码明确文字视觉桥及继承架构。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * dsh-youreyes — server half.
 *
 * 给纯文本 DSH 模型一双眼睛。图片经视觉通道（反重力 / OpenAI 兼容 / Gemini /
 * 本地 Ollama）理解后，把文字证据送回对话流，DeepSeek 仍然是大脑。
 *
 * 通道（auto 优先 antigravity）：
 *   - antigravity : Antigravity IDE agentapi（默认；flash/pro 双档，走 IDE 订阅额度）
 *   - openai      : 任意 OpenAI 兼容 /chat/completions（智谱、通义、OpenRouter、vLLM…）
 *   - gemini      : Google Gemini Developer API（AIza… 或 AQ. 新格式 key）
 *   - ollama      : 本地 Ollama（零配置自动检测，图片不出本机）
 *
 * 特色（继承自 vision-toolkit）：
 *   1) 包装适配器：每个上游 LLM 注册一个带识图能力的 provider，图片块→文本占位
 *   2) vision 工具：模型看到占位符后主动调用（单图/多图/OCR/区域/对比 + 档位分流）
 *   3) 视觉证据：结果写入会话时间线，跨轮复用、compaction 后自动恢复
```

</details>

**依据 2 · 作者声明**：[README.md:20-29](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/README.md#L20-L29)

作者列举痛点、缓存和auto策略。

<details>
<summary>查看原文（10行）</summary>

```text
| 痛点 | dsh-youreyes 的解法 |
|---|---|
| DeepSeek 纯文本，粘贴图片直接被拒 | 包装适配器声明图片输入，图片自动转文本占位，不再报错 |
| 别的识图插件只认自家 API | **反重力（默认）+ 任意 OpenAI 兼容端点** + Gemini + 本地 Ollama，你的 key 都能用 |
| 配置麻烦、要注册一堆东西 | **本地 Ollama 零配置自动检测**；有 Gemini 免费 key 一行配置即可 |
| 模型看到图但"忘了" | **视觉证据记忆**：识图结果写入会话，后续轮次可复用，压缩后自动恢复 |
| 同一张图反复花钱识别 | **内容哈希缓存**：同图同问进程内只识别一次 |
| 复杂画面识别不准 | **auto 档位分流**：先标准检查，画面复杂自动升级深度检查 |
| WSL / 被墙环境连不上 API | **winCurl 自动降级**：fetch 失败自动走 Windows curl 重试 |

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 图片、通道、升级和记忆怎样流动？

**研究主题**：功能与机制

#### 完整回答

入口注入webServer/llm/tools/sessions/attachments，vision工具从附件或本地路径收集图片，限制数量，读字节后哈希并转base64。cache key绑定图片digest、问题、detail/mode/region、模型和通道；内存Promise缓存共用在途结果，失败删除，已持久视觉记录也可复用。文本模型通过占位知道附件，调用vision后文字记录deferContext写入会话，后续manifest和compaction逻辑恢复近期视觉记录。

auto先以standard和triage提示调用视觉通道，由模型回答complexity；仅complex时再deep，第二次失败回第一遍并附escalationError。OpenAI/Gemini/Ollama和Antigravity通道各自依端点或本地进程；网络异常可回退Windows curl，把请求payload写临时文件，finally清理。自动升级是模型自判驱动的路由，不是独立检测器，也不能保证复杂图总被识别或第二遍更正确。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:217-249](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/index.ts#L217-L249)

auto两遍与失败保留首遍。

<details>
<summary>查看原文（33行）</summary>

```text
async function runAdaptiveVision(cfg: any, channel: string, requestedModel: string, detail: string, visionMode: string, userPrompt: string, region: string, images: { b64: string; mime: string }[], signal?: AbortSignal) {
	const selectedDetail = normalizeDetail(detail);
	const selectedMode = normalizeVisionMode(visionMode);
	const model = requestedModel || cfg.defaultModel || VISION_MODEL;
	const runOne = async (oneDetail: string, triage: boolean) => {
		const prompt = buildVisionPrompt({
			detail: oneDetail,
			mode: selectedMode,
			userPrompt,
			region,
			imageCount: images.length,
			triage
		});
		const raw = await runVisionChannel(cfg, channel, model, prompt, images, signal);
		if (raw.error) return raw;
		const normalized = normalizeVisionResponse(raw.text);
		return { text: normalized.answer, evidence: normalized.evidence, complexity: normalized.complexity, structured: normalized.structured, truncatedBytes: normalized.truncatedBytes };
	};

	if (selectedDetail !== "auto") {
		const result = await runOne(selectedDetail, false);
		return { ...result, detail: selectedDetail, mode: selectedMode, model, escalated: false };
	}
	const first = await runOne("standard", true);
	if (first.error) return { ...first, detail: "auto", mode: selectedMode, model, escalated: false };
	if (first.complexity !== "complex") {
		return { ...first, detail: "auto", mode: selectedMode, model, escalated: false };
	}
	const deep = await runOne("deep", false);
	if (deep.error) {
		return { ...first, detail: "auto", mode: selectedMode, model, escalated: false, escalationError: deep.error };
	}
	return { ...deep, detail: "auto", mode: selectedMode, model, escalated: true };
```

</details>

**依据 2 · 源码核查**：[src/index.ts:393-416](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/index.ts#L393-L416)

本地读取、hash和缓存绑定。

<details>
<summary>查看原文（24行）</summary>

```text
		for (const imagePath of imagePaths) {
			try {
				if (!pathIsAllowed(cfg, imagePath)) return { error: `图片路径超出 allowedImageDirs: ${imagePath}` };
				const bytes = readFileSync(imagePath);
				if (bytes.length > cfg.maxImageBytes) return { error: `图片超过 ${cfg.maxImageBytes} 字节限制` };
				images.push({ id: `path:${resolve(imagePath)}`, b64: bytes.toString("base64"), mime: mimeForPath(imagePath), digest: sha256(bytes) });
			} catch (error) {
				return { error: `读取图片失败: ${String(error?.message || error).slice(0, 500)}` };
			}
		}

		const channel = args.channel || cfg.defaultChannel || "auto";
		const resolvedChannel = channel === "auto" ? resolveAutoChannel(cfg) : channel;
		const model = args.model || cfg.defaultModel || VISION_MODEL;
		const key = visionCacheKey({
			attachmentIds: images.map((image) => image.id),
			imageDigests: images.map((image) => image.digest),
			prompt,
			detail,
			mode,
			region,
			model,
			channel: resolvedChannel
		});
```

</details>

**依据 3 · 源码核查**：[src/index.ts:450-471](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/index.ts#L450-L471)

视觉记录与deferContext。

<details>
<summary>查看原文（22行）</summary>

```text
			key,
			attachmentIds: images.map((image) => image.id),
			attachmentRefs: images.map((image) => image.ref).filter(Boolean),
			imageDigests: images.map((image) => image.digest),
			prompt: prompt.slice(0, 12000),
			promptHash: sha256(prompt),
			model: result.model || model,
			detail,
			mode,
			region,
			channel: result.channel,
			escalated: Boolean(result.escalated),
			evidence: result.evidence || { summary: result.text },
			answer: String(result.text || "").slice(0, 20000)
		});
		exec.deferContext(createUserMessage({
			content: [{ type: "text", text: visionRecordText(record) }],
			source: {
				kind: "plugin",
				plugin: "dsh-youreyes",
				form: "notice",
				summary: `视觉证据已记录：${record.attachmentIds.join(", ")}`.slice(0, 120)
```

</details>

**依据 4 · 源码核查**：[src/channels.ts:56-87](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/channels.ts#L56-L87)

fetch失败、临时文件和curl清理。

<details>
<summary>查看原文（32行）</summary>

```text
async function postJson(url: string, headers: Record<string, string>, payload: unknown, call: ChannelCall): Promise<{ status: number; body: string }> {
	const doFetch = call.fetchImpl ?? fetch;
	const bodyText = JSON.stringify(payload);
	try {
		const response = await doFetch(url, {
			method: "POST",
			headers,
			body: bodyText,
			signal: call.signal
		});
		return { status: response.status, body: await response.text() };
	} catch (error) {
		if (!isNetworkError(error) || !call.winCurl) throw error;
		// WSL → Windows curl 降级
		const { wsl, win } = winTempPaths();
		const { writeFileSync, unlinkSync } = await import("node:fs");
		writeFileSync(wsl, bodyText);
		try {
			const { execFile } = await import("node:child_process");
			const args = [call.winCurl, "-s", "-S", "--max-time", String(Math.ceil((call.timeoutMs || 60000) / 1000)), "-X", "POST", "--data-binary", `@${win}`];
			for (const [key, value] of Object.entries(headers)) args.push("-H", `${key}: ${value}`);
			args.push(url);
			const stdout = await new Promise<string>((resolve, reject) => {
				execFile(args[0], args.slice(1), { timeout: (call.timeoutMs || 60000) + 10000, maxBuffer: 64 * 1024 * 1024, windowsHide: true }, (err, out) => {
					if (err) reject(err);
					else resolve(String(out));
				});
			});
			return { status: 200, body: stdout };
		} finally {
			try { unlinkSync(wsl); } catch { /* ignore */ }
		}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “证据”与路径/网络边界是否可信？

**研究主题**：缺陷与关键质疑

#### 完整回答

视觉记录是另一模型的生成性解释，JSON字段和uncertainty提示不能使其自动成为已确认事实。把错误识别写入会话并在compaction后恢复，可能延长错误影响；缓存还会让同一错误稳定复用。需要保留原图/区域和人工可核对关系，不以结构化、置信度或同问缓存代替独立正确性依据。auto的complexity同样由被评估视觉模型产生，有漏判和预算增加的取舍。

allowedImageDirs默认空数组直接允许全部image_path，读取发生在host fs而非每次工具沙箱，局部没有默认工作区限制；配置非空后才realpath检查范围。图片限制在readFileSync之后检查，不能阻止大文件先占内存。网络回退会将图片payload落到Windows可见临时文件，尽管finally删除，故“图片仅发送”不能被理解为完全不落盘。API Key还可出现在curl参数头中，需要用户了解本机进程和临时目录信任；本轮没有读取凭据或发送图片。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:320-328](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/index.ts#L320-L328)

空根列表允许所有路径，非空才物理检查。

```text
function pathIsAllowed(cfg: any, imagePath: string) {
	const roots = Array.isArray(cfg.allowedImageDirs) ? cfg.allowedImageDirs.filter(Boolean) : [];
	if (!roots.length) return true;
	const candidate = realpathSync(imagePath);
	return roots.some((root: string) => {
		let resolvedRoot: string;
		try { resolvedRoot = realpathSync(root); } catch { resolvedRoot = resolve(root); }
		return candidate === resolvedRoot || candidate.startsWith(resolvedRoot.endsWith(sep) ? resolvedRoot : resolvedRoot + sep);
	});
```

**依据 2 · 源码核查**：[src/index.ts:393-398](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/index.ts#L393-L398)

先整文件读入后检查大小。

```text
		for (const imagePath of imagePaths) {
			try {
				if (!pathIsAllowed(cfg, imagePath)) return { error: `图片路径超出 allowedImageDirs: ${imagePath}` };
				const bytes = readFileSync(imagePath);
				if (bytes.length > cfg.maxImageBytes) return { error: `图片超过 ${cfg.maxImageBytes} 字节限制` };
				images.push({ id: `path:${resolve(imagePath)}`, b64: bytes.toString("base64"), mime: mimeForPath(imagePath), digest: sha256(bytes) });
```

**依据 3 · 源码核查**：[src/index.ts:450-466](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/index.ts#L450-L466)

生成性视觉描述写入会话。

<details>
<summary>查看原文（17行）</summary>

```text
			key,
			attachmentIds: images.map((image) => image.id),
			attachmentRefs: images.map((image) => image.ref).filter(Boolean),
			imageDigests: images.map((image) => image.digest),
			prompt: prompt.slice(0, 12000),
			promptHash: sha256(prompt),
			model: result.model || model,
			detail,
			mode,
			region,
			channel: result.channel,
			escalated: Boolean(result.escalated),
			evidence: result.evidence || { summary: result.text },
			answer: String(result.text || "").slice(0, 20000)
		});
		exec.deferContext(createUserMessage({
			content: [{ type: "text", text: visionRecordText(record) }],
```

</details>

**依据 4 · 源码核查**：[src/channels.ts:69-86](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/channels.ts#L69-L86)

payload临时落盘、header参数和清理。

<details>
<summary>查看原文（18行）</summary>

```text
		// WSL → Windows curl 降级
		const { wsl, win } = winTempPaths();
		const { writeFileSync, unlinkSync } = await import("node:fs");
		writeFileSync(wsl, bodyText);
		try {
			const { execFile } = await import("node:child_process");
			const args = [call.winCurl, "-s", "-S", "--max-time", String(Math.ceil((call.timeoutMs || 60000) / 1000)), "-X", "POST", "--data-binary", `@${win}`];
			for (const [key, value] of Object.entries(headers)) args.push("-H", `${key}: ${value}`);
			args.push(url);
			const stdout = await new Promise<string>((resolve, reject) => {
				execFile(args[0], args.slice(1), { timeout: (call.timeoutMs || 60000) + 10000, maxBuffer: 64 * 1024 * 1024, windowsHide: true }, (err, out) => {
					if (err) reject(err);
					else resolve(String(out));
				});
			});
			return { status: 200, body: stdout };
		} finally {
			try { unlinkSync(wsl); } catch { /* ignore */ }
```

</details>

#### 缺口

- 视觉记录错误率、压缩后错误放大和HTTP入口权限未完成独立核查。
  **影响**：不能给出图像事实可靠性或远程服务安全保证。
  **进一步探讨**：固定原图与正确标签，追踪跨轮/压缩复用；另检查部署宿主对自定义路由的认证并缩窄允许目录。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、构建、成本和工程条件是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

清单main指向lib/index.js，但固定Git树没有lib目录，仓库有build脚本和prepublishOnly而没有prepare；因此此checkout本身不能视为可直接Git安装的完整入口。npm发布物是否包含构建产物需实际包材料验证，本轮不把Git缺lib推断为npm也缺。宿主API包在devDependencies，构建可能打包或由宿主提供，需核对实际发布物。Node>=20和DSH>=0.1.0是声明而非跨版本验收。

首次需选视觉端点/模型/Key或本地Ollama，Antigravity还需IDE环境与额外路径配置；不能沿用README的免费档、价格或无限流宣传作为当前费用事实。本轮不查询实时价格。持续成本按实际VLM调用计，auto最多两遍并可能有网络重试，base64、哈希缓存和会话证据占内存/上下文；失败恢复要区分首遍保留、已写证据和可能重复账单。工程可借鉴内容指纹与错误缓存清除、归一化响应，但core测试依赖构建lib并主要针对纯函数，不等模型效果验证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-18](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/package.json#L1-L18)

运行入口指向lib。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "dsh-youreyes",
  "version": "0.1.0",
  "description": "Eyes for text-only DeepSeek on DeepSeek Harness: image understanding via Antigravity IDE quota (default, flash/pro), OpenAI-compatible VLM endpoints, Gemini API, or local Ollama — model-invokable vision tool, wrapper adapters for deepseek/opencode-go, evidence memory, and a polished client panel.",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client.d.ts",
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
  },
```

</details>

**依据 2 · 源码核查**：[tests/core.test.mjs:1-16](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/tests/core.test.mjs#L1-L16)

测试从lib导入并只列核心函数。

<details>
<summary>查看原文（16行）</summary>

```text
// dsh-youreyes core tests: channels, vision-core, cache, prompt building.
// Run: npm test  (node --test tests/*.test.mjs)

import { test } from "node:test";
import assert from "node:assert/strict";
import { __testing } from "../lib/index.js";

const {
	openaiChat,
	geminiGenerate,
	ollamaChat,
	detectOllama,
	normalizeDetail,
	normalizeVisionMode,
	normalizeVisionResponse,
	buildVisionPrompt,
```

</details>

**依据 3 · 源码核查**：[src/index.ts:217-249](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/index.ts#L217-L249)

auto增量调用与保留结果。

<details>
<summary>查看原文（33行）</summary>

```text
async function runAdaptiveVision(cfg: any, channel: string, requestedModel: string, detail: string, visionMode: string, userPrompt: string, region: string, images: { b64: string; mime: string }[], signal?: AbortSignal) {
	const selectedDetail = normalizeDetail(detail);
	const selectedMode = normalizeVisionMode(visionMode);
	const model = requestedModel || cfg.defaultModel || VISION_MODEL;
	const runOne = async (oneDetail: string, triage: boolean) => {
		const prompt = buildVisionPrompt({
			detail: oneDetail,
			mode: selectedMode,
			userPrompt,
			region,
			imageCount: images.length,
			triage
		});
		const raw = await runVisionChannel(cfg, channel, model, prompt, images, signal);
		if (raw.error) return raw;
		const normalized = normalizeVisionResponse(raw.text);
		return { text: normalized.answer, evidence: normalized.evidence, complexity: normalized.complexity, structured: normalized.structured, truncatedBytes: normalized.truncatedBytes };
	};

	if (selectedDetail !== "auto") {
		const result = await runOne(selectedDetail, false);
		return { ...result, detail: selectedDetail, mode: selectedMode, model, escalated: false };
	}
	const first = await runOne("standard", true);
	if (first.error) return { ...first, detail: "auto", mode: selectedMode, model, escalated: false };
	if (first.complexity !== "complex") {
		return { ...first, detail: "auto", mode: selectedMode, model, escalated: false };
	}
	const deep = await runOne("deep", false);
	if (deep.error) {
		return { ...first, detail: "auto", mode: selectedMode, model, escalated: false, escalationError: deep.error };
	}
	return { ...deep, detail: "auto", mode: selectedMode, model, escalated: true };
```

</details>

**依据 4 · 源码核查**：[src/channels.ts:56-87](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/channels.ts#L56-L87)

重试与本地payload开销。

<details>
<summary>查看原文（32行）</summary>

```text
async function postJson(url: string, headers: Record<string, string>, payload: unknown, call: ChannelCall): Promise<{ status: number; body: string }> {
	const doFetch = call.fetchImpl ?? fetch;
	const bodyText = JSON.stringify(payload);
	try {
		const response = await doFetch(url, {
			method: "POST",
			headers,
			body: bodyText,
			signal: call.signal
		});
		return { status: response.status, body: await response.text() };
	} catch (error) {
		if (!isNetworkError(error) || !call.winCurl) throw error;
		// WSL → Windows curl 降级
		const { wsl, win } = winTempPaths();
		const { writeFileSync, unlinkSync } = await import("node:fs");
		writeFileSync(wsl, bodyText);
		try {
			const { execFile } = await import("node:child_process");
			const args = [call.winCurl, "-s", "-S", "--max-time", String(Math.ceil((call.timeoutMs || 60000) / 1000)), "-X", "POST", "--data-binary", `@${win}`];
			for (const [key, value] of Object.entries(headers)) args.push("-H", `${key}: ${value}`);
			args.push(url);
			const stdout = await new Promise<string>((resolve, reject) => {
				execFile(args[0], args.slice(1), { timeout: (call.timeoutMs || 60000) + 10000, maxBuffer: 64 * 1024 * 1024, windowsHide: true }, (err, out) => {
					if (err) reject(err);
					else resolve(String(out));
				});
			});
			return { status: 200, body: stdout };
		} finally {
			try { unlinkSync(wsl); } catch { /* ignore */ }
		}
```

</details>

#### 缺口

- 固定版本npm tarball及构建产物与源码一致性未取得。
  **影响**：不能宣称当前Git或npm安装路线已经核验可启动。
  **进一步探讨**：检查对应发布包文件清单、入口及构建摘要，Git使用者需自行构建后再由维护者决定验收。
- 缺少OCR/compare等任务正确率与总调用成本。
  **影响**：不能判断auto优于一次VLM或多模态主模型。
  **进一步探讨**：固定问题/图片对照单遍、auto和直接多模态，计入失败重试和人工校核。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可形成何种假设与采用决定？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是把视觉记忆改成可校核记录，保留原图指纹、查询区域、每项观察的原图定位以及后续纠错的失效关系，错误被用户指出后不再自动复用旧记录。推导来自生成性证据会被缓存和压缩恢复，而不是假设JSON本身可靠。最小验证用有文字/区域标签的固定图，注入一次错误后观察当前流程与候选流程跨轮纠错、调用量和主模型答案，若结构更重仍不改善错误持久化，应否定方向。

当前建议观察。先核查可启动发布物、缩窄allowedImageDirs、明确图片发送/临时落盘端点，并以不敏感图片完成有标签对照后再定义试用。需要保密图片的用户只能在核实本地路线和日志/临时文件条件后考虑，不因autoOllama配置推断所有请求本地。没有同版本安装、核心功能与卸载验收，不给值得安装，也不以作者单张猫照片示例证明复杂OCR能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:450-471](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/index.ts#L450-L471)

会话长期记录为纠错/失效关系推导起点。

<details>
<summary>查看原文（22行）</summary>

```text
			key,
			attachmentIds: images.map((image) => image.id),
			attachmentRefs: images.map((image) => image.ref).filter(Boolean),
			imageDigests: images.map((image) => image.digest),
			prompt: prompt.slice(0, 12000),
			promptHash: sha256(prompt),
			model: result.model || model,
			detail,
			mode,
			region,
			channel: result.channel,
			escalated: Boolean(result.escalated),
			evidence: result.evidence || { summary: result.text },
			answer: String(result.text || "").slice(0, 20000)
		});
		exec.deferContext(createUserMessage({
			content: [{ type: "text", text: visionRecordText(record) }],
			source: {
				kind: "plugin",
				plugin: "dsh-youreyes",
				form: "notice",
				summary: `视觉证据已记录：${record.attachmentIds.join(", ")}`.slice(0, 120)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:320-328](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/index.ts#L320-L328)

采用需显式目录根。

```text
function pathIsAllowed(cfg: any, imagePath: string) {
	const roots = Array.isArray(cfg.allowedImageDirs) ? cfg.allowedImageDirs.filter(Boolean) : [];
	if (!roots.length) return true;
	const candidate = realpathSync(imagePath);
	return roots.some((root: string) => {
		let resolvedRoot: string;
		try { resolvedRoot = realpathSync(root); } catch { resolvedRoot = resolve(root); }
		return candidate === resolvedRoot || candidate.startsWith(resolvedRoot.endsWith(sep) ? resolvedRoot : resolvedRoot + sep);
	});
```

**依据 3 · 源码核查**：[src/channels.ts:69-86](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/channels.ts#L69-L86)

网络fallback的数据边界。

<details>
<summary>查看原文（18行）</summary>

```text
		// WSL → Windows curl 降级
		const { wsl, win } = winTempPaths();
		const { writeFileSync, unlinkSync } = await import("node:fs");
		writeFileSync(wsl, bodyText);
		try {
			const { execFile } = await import("node:child_process");
			const args = [call.winCurl, "-s", "-S", "--max-time", String(Math.ceil((call.timeoutMs || 60000) / 1000)), "-X", "POST", "--data-binary", `@${win}`];
			for (const [key, value] of Object.entries(headers)) args.push("-H", `${key}: ${value}`);
			args.push(url);
			const stdout = await new Promise<string>((resolve, reject) => {
				execFile(args[0], args.slice(1), { timeout: (call.timeoutMs || 60000) + 10000, maxBuffer: 64 * 1024 * 1024, windowsHide: true }, (err, out) => {
					if (err) reject(err);
					else resolve(String(out));
				});
			});
			return { status: 200, body: stdout };
		} finally {
			try { unlinkSync(wsl); } catch { /* ignore */ }
```

</details>

#### 缺口

- 记录纠错失效方案与固定发布物尚未完成验证。
  **影响**：阻碍当前一般试用和可靠性判断。
  **进一步探讨**：先补发布物及数据边界，再以固定错误样例比较纠错与跨轮复用。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
