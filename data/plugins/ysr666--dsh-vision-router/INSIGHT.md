# DSH Vision Router

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[79ddbb8](https://github.com/ysr666/dsh-vision-router/tree/79ddbb8377b7319e68dba8e6570b98d3b87a01fc)

<!-- BEGIN META -->
[![GitHub ★ 1,180](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C180&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ysr666/dsh-vision-router) [![npm 30d 34,951](https://img.shields.io/static/v1?label=npm+30d&message=34%2C951&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-vision-router) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-vision-router)
<!-- END META -->

> **功能**：为 DSH 文本模型会话提供图像工具、视觉后端回退、像素处理和会话开关。

> **亮点**：把文本主模型与视觉工具分工接入DSH，结合失败分层回退和像素核对；不把模型视觉能力和演示差异归为独立效果证明。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：免Key云回退默认开启，图片会出站；本地过滤存在不等全路径隐私验收，供应商失败也不能随意绕适配再请求。[Q03](#research-q03)

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
  - [Q01 · 保留文本主模型的图像工具相对切换模型有什么价值？](#detail-section-11)
  - [Q02 · 失败回退和缓存如何避免双请求与资源失控？](#detail-section-12)
  - [Q03 · 免Key与本地开关是否意味着图片不出站？](#detail-section-13)
  - [Q04 · 什么低风险试用能判断它比原生视觉值得？](#detail-section-14)
  - [Q05 · 怎样验证回退既保隐私又不重复花费？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：以文本模型为主但需问截图和局部定位的DSH用户；已有合格原生视觉可比较后选择。[Q01](#research-q01)

切换原生多模态模型或独立看图工具；新增DSH接线和回退并非普遍更便宜更准。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 图像问答 | 文本模型借视觉后端看图 | 默认云出站，需原图复核 |
| 后端回退 | 分类失败与预算分配 | 不保证服务可用 |
| local-only | 限定本地视觉端点 | 需有效本地后端，未全链验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 声明兼容DSH与Node | 启动必需 | 工具和会话状态 | 核实发行版 |
| 视觉后端或云回退 | 模型看图必需 | 解释图片 | local-only无本地后端会失败 |
| sharp/浏览器 | 对应像素/截图功能 | 处理与渲染 | 限制相关工具 |
| 出站许可 | 云端看图必需 | 上传图像提示 | 敏感改本地 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核宿主和数据政策 | 选云或严格本地 |
| 开关 | 用户测试会话开Vision | 工具可见且范围正确 |
| 核对 | Agent问公开图，用户看原图 | 文字坐标对应任务 |
| 退出 | 用户关Vision | 连续错误不重复刷 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主、可选sharp/浏览器/本地模型 | 配后端、隐私和开关 | 配置耗时未知 |
| 持续使用 | 图像请求、回退和模型；金额未知 | 对照原图与错误 | 免费入口不等零总成本 |
| 失败恢复 | 尝试额度与诊断 | 分清已出站和本地拒绝 | 不反复改问法刷请求 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 文本会话读图 | describe与后端链 | 准确率和净节时 |
| 回退控制 | 窄桥策略与预算 | 所有供应商分类正确性 |
| 本地-only | 后端与HTTP过滤 | 全路径零出站 |

> **思考**：免Key云回退默认开启，图片会出站；本地过滤存在不等全路径隐私验收，供应商失败也不能随意绕适配再请求。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把文本主模型与视觉工具分工接入DSH，结合失败分层回退和像素核对；不把模型视觉能力和演示差异归为独立效果证明。[Q01](#research-q01) [Q02](#research-q02)

区分pre-wire与远端失败、任务预算预留、字节TTL缓存值得借鉴；移植需宿主错误协议与权限/附件边界核查。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

免Key云回退默认开启，图片会出站；本地过滤存在不等全路径隐私验收，供应商失败也不能随意绕适配再请求。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议公开截图测试会话限定试用，先明确云出站或配置local-only；敏感内容、连续错误或无法核原图则关Vision回原生/本地流程。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

路由策略、local-only过滤和缓存上限有源码支持；完整出站及供应商/像素效果未独立执行。尝试账本为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.js、src/lib/vision-execution-policy.js、src/lib/vision-backend-runtime-policy.js、src/lib/runtime-reliability.js、src/lib/vision-tool-runtime-boundary.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定README、包、describe分支、桥策略、预算和缓存模块；未审所有14工具、附件/远程设置全路径，未执行模型、测试或宿主。
- 下一步：假后端四类故障计出站与重复调用，固定截图对照原生视觉并记录全成本；本轮未执行。[Q05](#research-q05)

**分析版本**

- **仓库**：[ysr666/dsh-vision-router](https://github.com/ysr666/dsh-vision-router)
- **版本号**：3.1.0（[固定提交 79ddbb8](https://github.com/ysr666/dsh-vision-router/tree/79ddbb8377b7319e68dba8e6570b98d3b87a01fc)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是无敏感内容的逐尝试账本，记录出站和预算以验证隐私/重复费用并减少排障。[Q05](#research-q05)

假后端四类故障计出站与重复调用，固定截图对照原生视觉并记录全成本；本轮未执行。[Q05](#research-q05)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 87 | 10006 | — | — | 130676 |
| .mjs | source | 40 | 7815 | 6842 | 407 | — |
| .js | source | 143 | 50688 | 42850 | 4983 | — |
| .ts | source | 39 | 6049 | 4962 | 460 | — |
| .js | test | 225 | 61111 | 55450 | 1798 | — |
| .mjs | example | 4 | 60 | 40 | 15 | — |
| .mjs | test | 4 | 962 | 860 | 27 | — |
| .ts | test | 31 | 975 | 776 | 59 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/ysr666/dsh-vision-router/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：视觉工具和后端回退怎样改善文本模型任务，默认云端出站与兼容桥策略有哪些限制？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 保留文本主模型的图像工具相对切换模型有什么价值？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是DSH中平时使用文本模型、偶尔需要截图文字和视觉定位的用户。当前README将主模型推理与视觉工具分工，提供会话Vision开关和图像工具；相对整段会话切到视觉模型，可在同一任务按需请求图像解释并继续其他工具。截图重建还可用pixel diff检查像素变化，而不是只凭模型说像。贡献是DSH会话接线、后端路由和结果/像素工具组合；图像推理由上游模型完成，“14工具”和演示2.54%差异不证明所有UI任务有效。src/index头注释仍描述旧式整turn切模型，研究以当前工具调用实际分支和README语义为准，不从过时注释概括现产品。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:121-141](https://github.com/ysr666/dsh-vision-router/blob/79ddbb8377b7319e68dba8e6570b98d3b87a01fc/README.md#L121-L141)

主模型/视觉分工及工具可见条件。

<details>
<summary>查看原文（21行）</summary>

````text
| `vision_present` | Publish a generated or edited local image as a durable chat attachment so the user can see it | image attachment |
| `vision_pixel_diff` | Per-pixel comparison: diff ratio + worst 8×8-grid regions | red heatmap PNG + JSON report |
| `vision_colors` | Dominant colors (hex + share) | — |
| `vision_ocr` | Text transcription: configurable default engine (`auto` / local Tesseract / vision model); an explicit per-call engine still wins | — |
| `vision_trace` | SVG vectorization (potrace posterization; icons/logos) | SVG |
| `vision_extract_foreground` | Cutout via border flood fill (uniform backgrounds) | transparent PNG |
| `vision_html_screenshot` | Screenshot a local HTML file (headless system Chrome); `fullPage: true` captures the whole page and reports `pageHeight` | PNG |
| `vision_screenshot` | **Disabled by default; explicit opt-in required.** Capture the Windows virtual screen, macOS main display, or Linux root display. Windows uses PowerShell CopyFromScreen, macOS uses `screencapture`, and Linux requires ImageMagick `import` or `scrot`; optional `identify=true` tries enabled local recognition backends in order and returns the description with the path | PNG / + description |
| `vision_long_screenshot_ocr` | Long-screenshot transcription: overlapping chunks, tesseract first / vision model fallback, stitched Markdown | chunk PNGs + Markdown + manifest |

Formats are sniffed from magic bytes, so extensionless content-addressed attachment files work everywhere (no `.png` renaming needed).

**Common workflows**

```text
vision_ground image="ref.png" target="the send button"
vision_detect image="page.png" target="input fields"
vision_crop   image="ref.png" region="1067,841,1108,881"
vision_present path="rebuilt.png"
vision_describe paths=["ref.png","impl.png"] question="list the differences" json=true
vision_pixel_diff original="ref.png" rebuilt="screenshot.png"
````

</details>

**依据 2 · 源码核查**：[src/index.js:2615-2631](https://github.com/ysr666/dsh-vision-router/blob/79ddbb8377b7319e68dba8e6570b98d3b87a01fc/src/index.js#L2615-L2631)

describe工具说明当前调用语义。

<details>
<summary>查看原文（17行）</summary>

```text
      name: 'vision_describe',
      description:
        'Look at images with the configured vision chain and answer a focused question about them. ' +
        'For text-only sessions this is the bridge that provides image understanding; for native multimodal ' +
        'sessions it is an optional second look for structured evidence, comparison, grounding or verification. ' +
        'Supports comparing multiple images (e.g. a design mock vs an implementation screenshot). Provide ' +
        '`paths` (absolute local image file paths, png/jpeg/webp/gif) and/or ' +
        '`attachmentIds` (ids of images the user uploaded in this conversation), 1-4 images in ' +
        'total. `question` is the question to answer; be specific. Set `json: true` to require a ' +
        'single valid JSON object as the answer. ' +
        'FAILURE SEMANTICS: if the result is JSON with ok:false and a code like VISION_AUTH_FAILED, ' +
        'VISION_RATE_LIMITED, VISION_TIMEOUT, VISION_BACKEND_UNAVAILABLE or VISION_BACKEND_UNAVAILABLE_THIS_TURN, ' +
        'the vision backends are unavailable this turn. Do NOT call vision_describe again with a reworded ' +
        'question — rephrasing cannot fix an auth, rate-limit or outage problem. Answer from the information ' +
        'you already have and continue the text task, telling the user vision is temporarily unavailable. ' +
        'Only content-level uncertainty in a SUCCESSFUL answer justifies a second look (vision_crop, ' +
        'vision_ground or another vision_describe). If infrastructure failure leaves a file_path-only OCR/parser as the fallback, ' +
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 失败回退和缓存如何避免双请求与资源失控？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

describe先读图/附件并按配置顺序尝试适配后端和HTTP回退，每个分支受任务deadline。执行策略只对精确的本地pre-wire图片能力拒绝开放兼容桥；provider/network/auth失败不应再绕第二条transport重试同请求，避免重复费用和改变认证语义。后端预算为fallback预留时间，结果缓存有条数、字节和TTL上限，错误代码结果不缓存。可借鉴的是区分“请求尚未出站”与“远端失败”再决定回退，而不是泛化任何错误都换传输。其正确性仍依赖宿主错误码与消息协议，不能保证所有供应商准确分类。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/vision-execution-policy.js:67-114](https://github.com/ysr666/dsh-vision-router/blob/79ddbb8377b7319e68dba8e6570b98d3b87a01fc/src/lib/vision-execution-policy.js#L67-L114)

窄范围pre-wire失败和trusted unknown model策略。

<details>
<summary>查看原文（48行）</summary>

```text
/**
 * Exact DSH/pi-ai pre-wire admission rejection that proves the provider was
 * never contacted. Keep this intentionally narrow: another UNSUPPORTED_CONTENT
 * error (for example missing durable attachment support) is not evidence that
 * bypassing the adapter is safe.
 */
export function isLocalImageCapabilityAdmissionFailure(failure) {
  if (!failure || typeof failure !== 'object') return false
  if (failure.code !== 'UNSUPPORTED_CONTENT') return false
  if (failure.status !== undefined) return false
  const message = typeof failure.message === 'string' ? failure.message.trim() : ''
  return /^pi-ai model "[^"]+" does not support image input$/.test(message)
}

/** Exact pi-ai catalog miss: also pre-wire, but safe only with trusted evidence. */
export function isLocalUnknownModelFailure(failure, provider, model) {
  if (!failure || typeof failure !== 'object') return false
  if (failure.code !== 'UNKNOWN_MODEL' || failure.status !== undefined) return false
  const message = typeof failure.message === 'string' ? failure.message.trim() : ''
  return message === `pi-ai provider "${provider}" has no configured model "${model}"`
}

/**
 * Classify a provider/local failure for compatibility-bridge policy.
 * `allow` means a direct bridge is safe to attempt; `deny` means the adapter
 * reached any other failure class and the original failure must propagate.
 */
export function bridgeDispositionForFailure(failure) {
  return isLocalImageCapabilityAdmissionFailure(failure) ? 'allow' : 'deny'
}

/**
 * Apply the same narrow bridge policy to both structured terminal chunks and
 * errors thrown directly by an adapter's async iterator. DSH pi-ai throws its
 * exact pre-wire UNKNOWN_MODEL from modelOf() before yielding a chunk, so a
 * trusted/live model omitted from DSH's static catalog must not be converted
 * into a blanket deny merely because the failure arrived through `throw`.
 */
export function bridgeDispositionForObservedFailure(failure, provider, model, hasBridgeEvidence = () => false) {
  let evidence = false
  if (isLocalUnknownModelFailure(failure, provider, model)) {
    try {
      evidence = hasBridgeEvidence(provider, model) === true
    } catch {
      evidence = false
    }
  }
  return evidence ? 'allow' : bridgeDispositionForFailure(failure)
```

</details>

**依据 2 · 源码核查**：[src/lib/vision-backend-runtime-policy.js:54-61](https://github.com/ysr666/dsh-vision-router/blob/79ddbb8377b7319e68dba8e6570b98d3b87a01fc/src/lib/vision-backend-runtime-policy.js#L54-L61)

总任务预算给回退预留时间。

```text
export function adapterAttemptBudgetMs(config = {}, provider = '') {
  const requestBudget = positiveMs(config.timeoutMs, DEFAULT_REQUEST_TIMEOUT_MS)
  const taskBudget = positiveMs(config.visionTaskTimeoutMs, DEFAULT_TASK_TIMEOUT_MS)
  const pairs = configuredPairKeys(config)
  const hasFallback = config.freeFallback !== false || pairs.size > 1
  if (!hasFallback || provider === 'vision-http') return requestBudget
  const reserve = Math.max(1_000, Math.floor(taskBudget * FALLBACK_RESERVE_FRACTION))
  return Math.max(1_000, Math.min(requestBudget, taskBudget - reserve))
```

**依据 3 · 源码核查**：[src/lib/runtime-reliability.js:19-45](https://github.com/ysr666/dsh-vision-router/blob/79ddbb8377b7319e68dba8e6570b98d3b87a01fc/src/lib/runtime-reliability.js#L19-L45)

字节和TTL约束缓存。

<details>
<summary>查看原文（27行）</summary>

```text
/** Live, byte-bounded LRU for vision_describe results. */
export class LiveDescribeCache {
  constructor(options = {}) {
    this.entries = new Map()
    this.totalBytes = 0
    this.maxBytes = positiveInteger(options.maxBytes, DEFAULT_DESCRIBE_CACHE_MAX_BYTES)
    this.maxEntryBytes = positiveInteger(options.maxEntryBytes, DEFAULT_DESCRIBE_CACHE_MAX_ENTRY_BYTES)
    this.maxEntries = positiveInteger(options.maxEntries, DEFAULT_DESCRIBE_CACHE_ENTRIES)
    this.ttlMs = positiveInteger(options.ttlMs, DEFAULT_DESCRIBE_CACHE_TTL_MS)
  }

  _delete(key) {
    const entry = this.entries.get(key)
    if (!entry) return
    this.entries.delete(key)
    this.totalBytes = Math.max(0, this.totalBytes - entry.bytes)
  }

  _prune(now = Date.now()) {
    for (const [key, entry] of this.entries) {
      if (now - entry.storedAt >= this.ttlMs) this._delete(key)
    }
    while (this.entries.size > this.maxEntries || this.totalBytes > this.maxBytes) {
      const oldest = this.entries.keys().next().value
      if (oldest === undefined) break
      this._delete(oldest)
    }
```

</details>

**依据 4 · 源码核查**：[src/lib/vision-tool-runtime-boundary.js:33-43](https://github.com/ysr666/dsh-vision-router/blob/79ddbb8377b7319e68dba8e6570b98d3b87a01fc/src/lib/vision-tool-runtime-boundary.js#L33-L43)

已分类失败结果不缓存。

<details>
<summary>查看原文（11行）</summary>

```text
function cacheableVisionDescribeResult(value) {
  let parsed = value
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value)
    } catch {
      return true
    }
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return true
  return !(parsed.ok === false && VISION_FAILURE_RESULT_CODES.has(parsed.code))
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 免Key与本地开关是否意味着图片不出站？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

默认不意味着。本地策略默认false，freeFallback默认true，未配置视觉服务也可走匿名云端；包描述及README已明确图片和提示会出站。“免费”是作者服务入口主张，不是离线或长期可用性保证。开启localOnlyVision后适配后端跳非local，HTTP回退跳非loopback，提供可检查的限制点，但没有执行全流量抓取，不能宣称所有边缘路径都已验证不出站。原生视觉、宿主附件持久化、sharp和浏览器等按功能提供，缺少其一会限制相关工具。模型看图仍可能漏字误定位，历史audit badge只覆盖旧2.0.1，不认证3.1.0。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:248-260](https://github.com/ysr666/dsh-vision-router/blob/79ddbb8377b7319e68dba8e6570b98d3b87a01fc/src/index.js#L248-L260)

local-only和免费回退默认值。

<details>
<summary>查看原文（13行）</summary>

```text
  allowRemoteSettings: z.boolean().default(false),
  // Privacy policy switch: when enabled, Vision Router executes image-model
  // requests only against loopback visual endpoints (Ollama, LM Studio, or
  // custom local HTTP). Saved cloud
  // rows remain intact but inactive, so disabling the policy restores the
  // previous routing chain without destructive settings rewrites.
  localOnlyVision: z.boolean().default(false),
  freeFallback: z.boolean().default(true),
  // 云端免费优先：开启后，云端后端先尝试内置 OVH 免费模型（免注册、免
  // API Key），付费 httpProviders 仅在免费模型全部失败后作为兜底，尽量把
  // 云端识别成本降到零。默认关闭 = 保持既有顺序（用户配置在前、内置免费
  // 补全在后），关闭时行为与 current main 逐字节一致。
  freeCloudFirst: z.boolean().default(false),
```

</details>

**依据 2 · 源码核查**：[src/index.js:2846-2850](https://github.com/ysr666/dsh-vision-router/blob/79ddbb8377b7319e68dba8e6570b98d3b87a01fc/src/index.js#L2846-L2850)

适配后端local-only跳过。

```text
        for (const pair of usablePairs) {
          if (localOnlyVisionEnabled(current()) && !isLocalBackendPair(pair)) {
            errors.push(`${pair.provider}/${pair.model}: skipped (local-only vision policy)`)
            continue
          }
```

**依据 3 · 源码核查**：[src/index.js:2979-2985](https://github.com/ysr666/dsh-vision-router/blob/79ddbb8377b7319e68dba8e6570b98d3b87a01fc/src/index.js#L2979-L2985)

HTTP回退local-only过滤。

```text
        // Direct HTTP providers (built-in keyless OVHcloud by default) are the
        // final fallbacks: they bypass the harness llm service entirely, so the
        // anonymous free endpoint works without any credential.
        for (const provider of httpFallbacks) {
          if (localOnlyVisionEnabled(current()) && !isLoopbackVisionBaseURL(provider?.baseURL)) {
            errors.push(`http:${provider?.name}/${provider?.model}: skipped (local-only vision policy)`)
            continue
```

**依据 4 · 作者声明**：[README.md:17-23](https://github.com/ysr666/dsh-vision-router/blob/79ddbb8377b7319e68dba8e6570b98d3b87a01fc/README.md#L17-L23)

历史审计不认证当前版及默认出站声明。

```text
<p align="center"><sub>DeepGuard badge links to a historical v2.0.1 audit; it does not certify current releases.</sub></p>

<p align="center">English · <a href="README.zh.md">中文</a></p>

> [!CAUTION]
> **Data leaves your machine by default.** When a cloud vision model is used, Vision Router sends the image (or a derived crop), the vision prompt and related request metadata to that provider. A fresh install has an anonymous OVHcloud vision fallback enabled, so "free" and "no key" do **not** mean offline. Do not use the cloud chain for confidential, regulated or classified material. See [Data flow and strict local-only use](#data-flow-and-strict-local-only-use).

```

#### 缺口

- 严格local-only全路径出站、真实供应商可用性与坐标质量未测。
  **影响**：不能给隐私保证或所有网站/图片可用结论。
  **进一步探讨**：固定本地端点与假云端，捕获完整DNS/HTTP并做已知文字和坐标真值任务。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么低风险试用能判断它比原生视觉值得？

**研究主题**：效果与总成本、采用判断

#### 完整回答

已有兼容DSH、以文本模型为主且截图可公开的用户，可在一个测试会话试图像问答与局部裁剪，明确接受出站或先配置本地-only。首次需匹配Node/DSH和所选后端，像素工具可能要sharp，HTML截图需可用浏览器；持续投入包含模型、图片上传、后端尝试和人工复核，匿名服务不等总成本为零。失败恢复要检查具体错误与预算，不反复改问法刷请求；敏感图片、连续错误或答案无法回原图核对时关闭Vision并退回原生模型或本地人工处理。源码支持有条件trial，不能因旧认证badge升级install。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:41-45](https://github.com/ysr666/dsh-vision-router/blob/79ddbb8377b7319e68dba8e6570b98d3b87a01fc/package.json#L41-L45)

Node和DSH声明范围。

```text
  "packageManager": "pnpm@11.20.0",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "vision",
```

**依据 2 · 源码核查**：[src/index.js:2623-2631](https://github.com/ysr666/dsh-vision-router/blob/79ddbb8377b7319e68dba8e6570b98d3b87a01fc/src/index.js#L2623-L2631)

失败后不改写问题重复刷调用的工具指导。

```text
        'total. `question` is the question to answer; be specific. Set `json: true` to require a ' +
        'single valid JSON object as the answer. ' +
        'FAILURE SEMANTICS: if the result is JSON with ok:false and a code like VISION_AUTH_FAILED, ' +
        'VISION_RATE_LIMITED, VISION_TIMEOUT, VISION_BACKEND_UNAVAILABLE or VISION_BACKEND_UNAVAILABLE_THIS_TURN, ' +
        'the vision backends are unavailable this turn. Do NOT call vision_describe again with a reworded ' +
        'question — rephrasing cannot fix an auth, rate-limit or outage problem. Answer from the information ' +
        'you already have and continue the text task, telling the user vision is temporarily unavailable. ' +
        'Only content-level uncertainty in a SUCCESSFUL answer justifies a second look (vision_crop, ' +
        'vision_ground or another vision_describe). If infrastructure failure leaves a file_path-only OCR/parser as the fallback, ' +
```

**依据 3 · 源码核查**：[src/lib/vision-backend-runtime-policy.js:54-61](https://github.com/ysr666/dsh-vision-router/blob/79ddbb8377b7319e68dba8e6570b98d3b87a01fc/src/lib/vision-backend-runtime-policy.js#L54-L61)

多后端任务预算是总成本条件。

```text
export function adapterAttemptBudgetMs(config = {}, provider = '') {
  const requestBudget = positiveMs(config.timeoutMs, DEFAULT_REQUEST_TIMEOUT_MS)
  const taskBudget = positiveMs(config.visionTaskTimeoutMs, DEFAULT_TASK_TIMEOUT_MS)
  const pairs = configuredPairKeys(config)
  const hasFallback = config.freeFallback !== false || pairs.size > 1
  if (!hasFallback || provider === 'vision-http') return requestBudget
  const reserve = Math.max(1_000, Math.floor(taskBudget * FALLBACK_RESERVE_FRACTION))
  return Math.max(1_000, Math.min(requestBudget, taskBudget - reserve))
```

#### 缺口

- 实际端到端延迟、总调用金额与修图质量无本轮记录。
  **影响**：不能估算净收益或持续采用。
  **进一步探讨**：固定公开截图与原生视觉对照，计全部请求和人工修正时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证回退既保隐私又不重复花费？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是为每次图像任务输出可审尝试账本，记录后端、pre-wire/已出站、预算和隐私策略，但不保存密钥或原图。它由Q02的窄桥策略和Q03默认云回退推导；相对只有最终答案，能解释图片去哪、哪里失败及为何不重发。最小实验固定本地拒绝、远端401、429和响应丢失四种情形，比较现实现与带账本原型的远端请求数、违规出站、未知结果和人工排查时间。应仅对明确未出站情况搭桥且local-only不碰假云端；若重复请求或泄露仍存在，否定原型保证。尚未做实验，不能称目前已完成可审账本。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/vision-execution-policy.js:67-114](https://github.com/ysr666/dsh-vision-router/blob/79ddbb8377b7319e68dba8e6570b98d3b87a01fc/src/lib/vision-execution-policy.js#L67-L114)

pre-wire分类是账本和重复控制依据。

<details>
<summary>查看原文（48行）</summary>

```text
/**
 * Exact DSH/pi-ai pre-wire admission rejection that proves the provider was
 * never contacted. Keep this intentionally narrow: another UNSUPPORTED_CONTENT
 * error (for example missing durable attachment support) is not evidence that
 * bypassing the adapter is safe.
 */
export function isLocalImageCapabilityAdmissionFailure(failure) {
  if (!failure || typeof failure !== 'object') return false
  if (failure.code !== 'UNSUPPORTED_CONTENT') return false
  if (failure.status !== undefined) return false
  const message = typeof failure.message === 'string' ? failure.message.trim() : ''
  return /^pi-ai model "[^"]+" does not support image input$/.test(message)
}

/** Exact pi-ai catalog miss: also pre-wire, but safe only with trusted evidence. */
export function isLocalUnknownModelFailure(failure, provider, model) {
  if (!failure || typeof failure !== 'object') return false
  if (failure.code !== 'UNKNOWN_MODEL' || failure.status !== undefined) return false
  const message = typeof failure.message === 'string' ? failure.message.trim() : ''
  return message === `pi-ai provider "${provider}" has no configured model "${model}"`
}

/**
 * Classify a provider/local failure for compatibility-bridge policy.
 * `allow` means a direct bridge is safe to attempt; `deny` means the adapter
 * reached any other failure class and the original failure must propagate.
 */
export function bridgeDispositionForFailure(failure) {
  return isLocalImageCapabilityAdmissionFailure(failure) ? 'allow' : 'deny'
}

/**
 * Apply the same narrow bridge policy to both structured terminal chunks and
 * errors thrown directly by an adapter's async iterator. DSH pi-ai throws its
 * exact pre-wire UNKNOWN_MODEL from modelOf() before yielding a chunk, so a
 * trusted/live model omitted from DSH's static catalog must not be converted
 * into a blanket deny merely because the failure arrived through `throw`.
 */
export function bridgeDispositionForObservedFailure(failure, provider, model, hasBridgeEvidence = () => false) {
  let evidence = false
  if (isLocalUnknownModelFailure(failure, provider, model)) {
    try {
      evidence = hasBridgeEvidence(provider, model) === true
    } catch {
      evidence = false
    }
  }
  return evidence ? 'allow' : bridgeDispositionForFailure(failure)
```

</details>

**依据 2 · 源码核查**：[src/index.js:2979-2985](https://github.com/ysr666/dsh-vision-router/blob/79ddbb8377b7319e68dba8e6570b98d3b87a01fc/src/index.js#L2979-L2985)

HTTP隐私过滤是验证检查点。

```text
        // Direct HTTP providers (built-in keyless OVHcloud by default) are the
        // final fallbacks: they bypass the harness llm service entirely, so the
        // anonymous free endpoint works without any credential.
        for (const provider of httpFallbacks) {
          if (localOnlyVisionEnabled(current()) && !isLoopbackVisionBaseURL(provider?.baseURL)) {
            errors.push(`http:${provider?.name}/${provider?.model}: skipped (local-only vision policy)`)
            continue
```

#### 缺口

- 尝试账本对排障和重复成本的改善无数据。
  **影响**：仅设计方向。
  **进一步探讨**：按四类故障记录请求计数与排查时间并固定模型版本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
