# DSH Vision Router

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ae9bac8](https://github.com/ysr666/dsh-vision-router/tree/ae9bac8b1028cad26c78f1532a559dd2e6517577)

<!-- BEGIN META -->
[![GitHub ★ 1,202](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C202&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ysr666/dsh-vision-router) [![npm 30d 38,122](https://img.shields.io/static/v1?label=npm+30d&message=38%2C122&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-vision-router) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-vision-router)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供视觉模型路由和像素级图像工具。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示将图片入口、后端与工具组合接入 DSH；模型视觉能力和任务收益不能归为插件自身证明。

> **主要限制**：[Q03](#research-q03) 的窄桥不能保证全部调用不重复；[Q04](#research-q04) 默认可向远端发送图像，本地视觉开关也不能让远程聊天模型离线。

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
  - [Q01 · 文本主模型的用户为何需要视觉路由，原生视觉有什么替代？](#detail-section-11)
  - [Q02 · 图片与附件如何进入视觉请求并受预算约束？](#detail-section-12)
  - [Q03 · 何时允许跨 transport 兼容桥，能否避免所有重复请求？](#detail-section-13)
  - [Q04 · 默认本地与免费配置是否意味着图片不出站？](#detail-section-14)
  - [Q05 · 采用成本、后端依赖和退出条件是什么？](#detail-section-15)
  - [Q06 · 能否让用户核对每次尝试的出站与费用不确定性？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要在 DSH 任务中读取截图、识别图片和核对视觉内容的用户。

原生多模态模型和人工核图也能完成图像理解；插件的价值取决于是否需要分工及额外控制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 图像理解 | 通过视觉后端回答图片问题 | 附件服务和视觉后端必需 |
| 分级回退 | 在失败时选择后备并保护窄桥 | 不保证全部请求恰好一次 |
| 本地策略 | 限制插件视觉调用目标 | 不覆盖远程聊天模型及全部宿主流量 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19 或 >=24 与兼容 DSH | 插件运行需要 | 加载宿主与工具 | 可能无法启动 |
| 宿主附件服务 | vision_describe 必需 | 读取与保存图像 | 工具直接报错 |
| 视觉后端或 HTTP fallback | 图像理解需要 | 处理图像和提示 | 返回不可用或回退 |
| sharp、浏览器或 OCR 工具 | 对应像素/截图/OCR 功能按需 | 特定本地处理 | 对应功能受限 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确定宿主、图像权限和出站目标 | 敏感内容无许可时停止 |
| 输入 | 用户提供非敏感图片与具体问题 | 工具可读取附件且后端可用 |
| 检查 | 用户核对原图、模型答案及不确定性 | 不一致时人工核图或重选后端 |
| 恢复 | 用户检查失败与缓存状态 | 持续失败停止重复调用并回退 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 安装、图像处理和后端费用未知 | 核对宿主、后端与出站目标 | 免费 fallback 不等于离线 |
| 持续 | 多次视觉调用和网络资源未知 | 对照原图并处理错误 | 图片准确率与节时未测 |
| 恢复 | 回退、重试可能产生额外费用 | 检查预算、缓存和部分输出 | 上游收费与重复率未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 视觉工具 | 读取附件并调用可配置后端 | 实际识别质量 |
| 有界任务 | 共用 deadline 和缓存约束 | 所有提供方按时停止 |
| local-only | 代表调用点过滤远端 | 全宿主网络边界 |

> **思考**：[Q03](#research-q03) 的窄桥不能保证全部调用不重复；[Q04](#research-q04) 默认可向远端发送图像，本地视觉开关也不能让远程聊天模型离线。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示将图片入口、后端与工具组合接入 DSH；模型视觉能力和任务收益不能归为插件自身证明。

[Q02](#research-q02) 的共享期限和有界缓存控制部分资源，[Q03](#research-q03) 对兼容桥实施精确错误判据；不同后备和代理仍需端到端验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的窄桥不能保证全部调用不重复；[Q04](#research-q04) 默认可向远端发送图像，本地视觉开关也不能让远程聊天模型离线。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议先用非敏感图像在固定配置试用并对照原图；出站目标或费用不明时停止并回退人工核图。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本工具、回退与部分数据边界源码已检查；真实宿主、出站和视觉质量未验证。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、src/index.js、src/lib/runtime-reliability.js、src/lib/vision-execution-policy.js、src/lib/vision-backend-runtime-policy.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交包清单、README、vision_describe、缓存、兼容桥及 local-only 代表分支；未运行插件、宿主、模型或网络，未审计全部图像工具、代理与附件路径。
- 下一步：固定 DSH、受控附件与假后端，核查输入数量、缓存、共享期限、各类失败和 local-only 网络路径；按 [Q06](#research-q06) 对照诊断与收据原型。

**分析版本**

- **仓库**：[ysr666/dsh-vision-router](https://github.com/ysr666/dsh-vision-router)
- **版本号**：3.1.1（[固定提交 ae9bac8](https://github.com/ysr666/dsh-vision-router/tree/ae9bac8b1028cad26c78f1532a559dd2e6517577)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 假设可见的脱敏尝试收据与出站前确认能改善隐私和费用判断；既有失败列表与日志是直接对照，方案尚未验证。

固定 DSH、受控附件与假后端，核查输入数量、缓存、共享期限、各类失败和 local-only 网络路径；按 [Q06](#research-q06) 对照诊断与收据原型。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 88 | 10057 | — | — | 132116 |
| .mjs | source | 41 | 8014 | 7017 | 419 | — |
| .js | source | 143 | 50692 | 42852 | 4985 | — |
| .ts | source | 39 | 6058 | 4963 | 467 | — |
| .js | test | 225 | 61158 | 55497 | 1798 | — |
| .mjs | example | 4 | 60 | 40 | 15 | — |
| .mjs | test | 4 | 962 | 860 | 27 | — |
| .ts | test | 31 | 975 | 776 | 59 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ysr666/dsh-vision-router/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 26](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=26&color=737b86&logo=github)](https://github.com/ysr666/dsh-vision-router/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 31](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=31&color=737b86&logo=github)](https://github.com/ysr666/dsh-vision-router/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查视觉工具的附件、后端回退、隐私与采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 文本主模型的用户为何需要视觉路由，原生视觉有什么替代？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标用户是在 DSH 使用文本模型时偶尔需要看截图、读取图片或定位界面元素的开发者；已有兼容视觉模型的用户也可直接使用宿主原生图像能力。package.json:1-4 将本组件描述为视觉链与像素工具；src/index.js:2612-2624 将 vision_describe 描述为文本会话的看图桥，也可在原生多模态会话中作为补充。它的可归因增量是宿主工具、后端选择及像素操作的组合，图像理解由实际视觉模型提供；相对直接切视觉模型或人工看图是否提高完成质量、节时和减少费用未对照。README 的历史审计标记明确只对应 2.0.1，不能认证本轮 3.1.1。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-4](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/package.json#L1-L4)

作者描述文本模型视觉与数据外发。

```text
{
  "name": "dsh-vision-router",
  "version": "3.1.1",
  "description": "Eyes for text-only DeepSeek Harness agents: built-in free vision chain + pixel-level tools. Remote vision providers, including the default free fallback, receive image content unless strict local-only use is configured.",
```

**依据 2 · 源码核查**：[src/index.js:2612-2624](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/index.js#L2612-L2624)

工具区分文本会话与原生多模态补充。

<details>
<summary>查看原文（13行）</summary>

```text
  if (toolEnabled()) {
    const deepToolDefs = []
    const visionDescribeTool = {
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
```

</details>

**依据 3 · 作者声明**：[README.md:14-17](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/README.md#L14-L17)

审计标记仅指历史版本。

```text
  <a href="https://github.com/SoberReport-AI/DeepGuard/blob/main/reports/dsh-vision-router/2.0.1/39c8f2b2d69aa398418fd6c8ab40b691a92a1a3d.json"><img src="https://img.shields.io/badge/DeepGuard-audit%20clean-2EA44F?style=flat-square" alt="DeepGuard audit clean" /></a>
</p>

<p align="center"><sub>DeepGuard badge links to a historical v2.0.1 audit; it does not certify current releases.</sub></p>
```

#### 缺口

- 无同任务原生视觉和人工核图对照
  **影响**：无法推定准确率、延迟或净收益
  **进一步探讨**：固定图片、主模型与预算，比较原生视觉、插件及人工验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 图片与附件如何进入视觉请求并受预算约束？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

vision_describe 的 src/index.js:2664-2680 先检查工具开关和附件服务，限定 paths 与 attachmentIds 合计 1 至 4 张；2693-2703 读取输入，2713-2721 将图像保存到宿主附件服务。2797-2806 先按后端、内容、问题等查询缓存；2826-2833 创建任务共享 deadline 并把图像块及提示组织为消息，2846-2889 按后端过滤、剩余预算和熔断状态调用。2947-2957 的 JSON 纠错失败会抛错，而非空文本与空结果提示都可缓存；runtime-reliability.js:37-44、59-77 以 TTL、容量和单项大小限制缓存。缓存与超时是条件机制，不保证视觉正确或所有底层提供方按时停止；未运行真实附件和模型。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:2664-2680](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/index.js#L2664-L2680)

检查工具、附件服务与输入数量。

<details>
<summary>查看原文（17行）</summary>

```text
      async execute(args, exec) {
        if (!toolEnabled()) {
          throw new Error('vision_describe: the vision tool is disabled in the vision-router settings')
        }
        const attachments = ctx.get('attachments')
        if (attachments === undefined) {
          throw new Error(
            'vision_describe: the durable attachment service is not available in this deployment',
          )
        }
        const blocks = []
        const contentIds = []

        const paths = Array.isArray(args.paths) ? args.paths : []
        const attachmentIds = Array.isArray(args.attachmentIds) ? args.attachmentIds : []
        if (paths.length + attachmentIds.length === 0 || paths.length + attachmentIds.length > 4) {
          throw new Error('vision_describe: provide 1-4 images via paths and/or attachmentIds')
```

</details>

**依据 2 · 源码核查**：[src/index.js:2693-2703](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/index.js#L2693-L2703)

读取路径或附件输入。

<details>
<summary>查看原文（11行）</summary>

```text
        for (const path of paths) {
          let bytes
          let mediaType
          try {
            // readImageBytes accepts both filesystem paths and attachment ids
            // ("sha256:..."), so a model that passes an uploaded image's id as
            // a path gets the right pixels instead of a not-found error.
            ;({ bytes, mediaType } = await readImageBytes(exec, path, resolvedAttachmentRefs))
          } catch (error) {
            throw new Error(
              `vision_describe: failed to read ${path} (${error && error.message ? error.message : String(error)})`,
```

</details>

**依据 3 · 源码核查**：[src/index.js:2713-2721](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/index.js#L2713-L2721)

保存图像到宿主附件。

```text
          let ref
          try {
            ref = await attachments.saveImage({
              data: bytes,
              mediaType,
              ...(isAttachmentIdInput(path) || basenameOf(path) === undefined
                ? {}
                : { name: basenameOf(path) }),
            })
```

**依据 4 · 源码核查**：[src/index.js:2797-2806](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/index.js#L2797-L2806)

缓存键与命中返回。

<details>
<summary>查看原文（10行）</summary>

```text
        const key = cacheKeyFor({
          pairs: usablePairs,
          httpProviders: httpFallbacks,
          contentIds,
          wantJson,
          question,
        })
        if (cacheEnabled()) {
          const hit = cache.get(key)
          if (hit !== undefined) return hit
```

</details>

**依据 5 · 源码核查**：[src/index.js:2826-2856](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/index.js#L2826-L2856)

任务 deadline、消息和本地策略过滤。

<details>
<summary>查看原文（31行）</summary>

```text
        // One shared deadline for the WHOLE task: every provider, fallback and
        // the JSON-correction retry draws from this single budget.
        const deadline = createDeadline(visionTaskTimeoutMs())
        const baseMessages = [
          {
            role: 'user',
            content: [...blocks, { type: 'text', text: promptText }],
            source: { kind: 'plugin', plugin: 'dsh-vision-router' },
          },
        ]
        const errors = [...rejectedPairs]
        const attempted = []
        const primaryWeight = DEFAULT_HTTP_PROVIDERS.length
        let remainingWeight =
          usablePairs.length * primaryWeight +
          httpFallbacks.reduce(
            (sum, provider) => sum + httpProviderFallbackWeight(provider),
            0,
          )

        for (const pair of usablePairs) {
          if (localOnlyVisionEnabled(current()) && !isLocalBackendPair(pair)) {
            errors.push(`${pair.provider}/${pair.model}: skipped (local-only vision policy)`)
            continue
          }
          const candidateWeight = primaryWeight
          const weightAtStart = Math.max(candidateWeight, remainingWeight)
          remainingWeight = Math.max(0, remainingWeight - candidateWeight)
          if (deadline.expired()) {
            errors.push('deadline: the vision task budget was exhausted before this backend ran')
            break
```

</details>

**依据 6 · 源码核查**：[src/index.js:2880-2895](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/index.js#L2880-L2895)

组合 deadline 信号并调用视觉后端。

<details>
<summary>查看原文（16行）</summary>

```text
                  weightAtStart,
                )
              : timeoutMs()
            const signal = combineSignals(
              currentVisionTurnBudgetSignal(),
              deadline.signal(),
              AbortSignal.timeout(attemptBudgetMs),
            )
            const capability = await resolveVisionBackendCapability(pair.provider, pair.model)
            let text = await callVisionPairWithOptionalBridge(pair, messages, {
              maxTokens: 4096,
              signal,
              sessionId,
              capability,
              bridgeBlocks: blocks,
              bridgeInstruction: promptText,
```

</details>

**依据 7 · 源码核查**：[src/index.js:2947-2957](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/index.js#L2947-L2957)

纠错失败与文本/空提示缓存。

<details>
<summary>查看原文（11行）</summary>

```text
              const invalidJson = new Error('vision_describe backend did not produce valid JSON after one correction retry')
              invalidJson.code = 'INVALID_REQUEST'
              throw invalidJson
            }
            if (text !== '') {
              if (cacheEnabled()) cache.set(key, text)
              return text
            }
            const empty = '(the vision model returned empty content)'
            if (cacheEnabled()) cache.set(key, empty)
            return empty
```

</details>

**依据 8 · 源码核查**：[src/lib/runtime-reliability.js:37-44](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/lib/runtime-reliability.js#L37-L44)

缓存按 TTL 和容量裁剪。

```text
  _prune(now = Date.now()) {
    for (const [key, entry] of this.entries) {
      if (now - entry.storedAt >= this.ttlMs) this._delete(key)
    }
    while (this.entries.size > this.maxEntries || this.totalBytes > this.maxBytes) {
      const oldest = this.entries.keys().next().value
      if (oldest === undefined) break
      this._delete(oldest)
```

**依据 9 · 源码核查**：[src/lib/runtime-reliability.js:59-77](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/lib/runtime-reliability.js#L59-L77)

命中、过期与单条大小处理。

<details>
<summary>查看原文（19行）</summary>

```text
  get(key, now = Date.now()) {
    const entry = this.entries.get(key)
    if (!entry) return undefined
    if (now - entry.storedAt >= this.ttlMs) {
      this._delete(key)
      return undefined
    }
    this.entries.delete(key)
    this.entries.set(key, entry)
    return entry.value
  }

  set(key, value, now = Date.now()) {
    const bytes = valueBytes(value)
    if (!Number.isFinite(bytes) || bytes > this.maxEntryBytes) return false
    this._delete(key)
    this.entries.set(key, { value, bytes, storedAt: now })
    this.totalBytes += bytes
    this._prune(now)
```

</details>

#### 缺口

- 未执行真实附件、缓存命中及后端调用
  **影响**：无法证明宿主兼容、时延与输出准确性
  **进一步探讨**：固定宿主和隔离图片测试附件、空结果、超时和缓存失效。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时允许跨 transport 兼容桥，能否避免所有重复请求？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

vision-execution-policy.js:67-95 仅将特定无 HTTP status 的本地图像能力拒绝识别为可桥接；105-114 对精确本地 UNKNOWN_MODEL 另要求可信能力证据。执行包装在 293-315 也处理异步迭代器抛出的错误，其他网络、鉴权或提供方失败不能仅凭该规则改走同一后端的兼容 transport。反证是 src/index.js:2958-2983 在常规后端失败后仍可走下一后端或 HTTP fallback；JSON 纠错也可能额外请求。因此窄桥减少某类重复路径，并非全任务恰好一次、零重复费用或对每个供应商的错误分类证明。未实测发送前/后边界。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/vision-execution-policy.js:67-95](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/lib/vision-execution-policy.js#L67-L95)

精确本地图像能力拒绝的桥接判据。

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/lib/vision-execution-policy.js:98-114](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/lib/vision-execution-policy.js#L98-L114)

UNKNOWN_MODEL 另需可信能力证据。

<details>
<summary>查看原文（17行）</summary>

```text
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

**依据 3 · 源码核查**：[src/lib/vision-execution-policy.js:293-315](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/lib/vision-execution-policy.js#L293-L315)

包装异步流中的终止错误。

<details>
<summary>查看原文（23行）</summary>

```text
            async *[Symbol.asyncIterator]() {
              let sawTerminalFailure = false
              try {
                // Construct the iterable inside the guarded section too. Most
                // adapters throw lazily during iteration, but a synchronous
                // pre-wire refusal must receive the identical classification.
                const iterable = stream.call(target, optionsForCall)
                for await (const chunk of iterable) {
                  const failure = failureFromChunk(chunk)
                  if (failure !== undefined) {
                    sawTerminalFailure = true
                    recordObservedFailure(scope, options, hasBridgeEvidence, provider, model, failure)
                  }
                  yield chunk
                }
              } catch (error) {
                // PiAiAdapter throws UNKNOWN_MODEL and local image-admission
                // failures directly from the async iterator before any chunk.
                // Classify that exact pre-wire shape just like a terminal
                // failure chunk; every provider/network/auth error still denies.
                sawTerminalFailure = true
                recordObservedFailure(scope, options, hasBridgeEvidence, provider, model, error)
                throw error
```

</details>

**依据 4 · 源码核查**：[src/index.js:2958-2983](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/index.js#L2958-L2983)

记录后端失败后进入 HTTP 后备。

<details>
<summary>查看原文（26行）</summary>

```text
          } catch (error) {
            const classification = classifyVisionFailure(error)
            visionBreaker.record(backendKey, fingerprint, classification, scope)
            visionTurnMemory.record(scope, backendKey, classification.kind)
            attempted.push({
              backend: backendKey,
              kind: classification.kind,
              error: error && error.message ? error.message : String(error),
            })
            const message = error && error.message ? error.message : String(error)
            errors.push(`${backendKey}: ${message}`)
            ctx.logger?.warn(
              'vision-router: vision_describe fallback [%s] (%s, %d ms): %s',
              backendKey,
              classification.kind,
              Date.now() - attemptStarted,
              message,
            )
          }
        }

        // Direct HTTP providers (built-in keyless OVHcloud by default) are the
        // final fallbacks: they bypass the harness llm service entirely, so the
        // anonymous free endpoint works without any credential.
        for (const provider of httpFallbacks) {
          if (localOnlyVisionEnabled(current()) && !isLoopbackVisionBaseURL(provider?.baseURL)) {
```

</details>

#### 缺口

- 未运行各提供方错误与丢响应场景
  **影响**：不知道真实出站次数和分类正确率
  **进一步探讨**：用假后端记录每次请求、桥接和已发送状态并核对账单。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 默认本地与免费配置是否意味着图片不出站？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不意味着。src/index.js:249-255 的基础配置为 localOnlyVision=false、freeFallback=true；README.md:20-22 明确作者说明默认匿名云端视觉服务会接收图片或裁剪、提示及元数据。工具调用在 index.js:2846-2849 跳过 local-only 下的非本地适配器，2979-2986 对直接 HTTP 后备检查 loopback；vision-backend-runtime-policy.js:198-204 对另一请求路径也限制为指定本地提供方。它们是本插件视觉调用的具体限制点，不证明 DNS、代理、宿主附件、日志或其他工具完全无外发；README.md:229-235 也指出本地视觉结果文本仍返回当前聊天模型。实际网络边界、模型保留政策和配置覆盖均未验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:249-255](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/index.js#L249-L255)

基础默认非 local-only 且启用免费 fallback。

```text
  // Privacy policy switch: when enabled, Vision Router executes image-model
  // requests only against loopback visual endpoints (Ollama, LM Studio, or
  // custom local HTTP). Saved cloud
  // rows remain intact but inactive, so disabling the policy restores the
  // previous routing chain without destructive settings rewrites.
  localOnlyVision: z.boolean().default(false),
  freeFallback: z.boolean().default(true),
```

**依据 2 · 作者声明**：[README.md:20-22](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/README.md#L20-L22)

作者说明默认云端接收图片与提示。

```text

> [!CAUTION]
> **Data leaves your machine by default.** When a cloud vision model is used, Vision Router sends the image (or a derived crop), the vision prompt and related request metadata to that provider. A fresh install has an anonymous OVHcloud vision fallback enabled, so "free" and "no key" do **not** mean offline. Do not use the cloud chain for confidential, regulated or classified material. See [Data flow and strict local-only use](#data-flow-and-strict-local-only-use).
```

**依据 3 · 源码核查**：[src/index.js:2846-2849](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/index.js#L2846-L2849)

local-only 过滤非本地适配器。

```text
        for (const pair of usablePairs) {
          if (localOnlyVisionEnabled(current()) && !isLocalBackendPair(pair)) {
            errors.push(`${pair.provider}/${pair.model}: skipped (local-only vision policy)`)
            continue
```

**依据 4 · 源码核查**：[src/index.js:2979-2986](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/index.js#L2979-L2986)

local-only 过滤非 loopback HTTP 后备。

```text
        // Direct HTTP providers (built-in keyless OVHcloud by default) are the
        // final fallbacks: they bypass the harness llm service entirely, so the
        // anonymous free endpoint works without any credential.
        for (const provider of httpFallbacks) {
          if (localOnlyVisionEnabled(current()) && !isLoopbackVisionBaseURL(provider?.baseURL)) {
            errors.push(`http:${provider?.name}/${provider?.model}: skipped (local-only vision policy)`)
            continue
          }
```

**依据 5 · 源码核查**：[src/lib/vision-backend-runtime-policy.js:198-204](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/lib/vision-backend-runtime-policy.js#L198-L204)

另一视觉请求路径的本地限制。

```text
export function localOnlyVisionCallAllowed(core, config, provider, model) {
  if (config?.localOnlyVision !== true) return true
  if (provider !== 'vision-http') return false
  const allowed = []
  try { allowed.push(...(core?.localProvidersOf?.(config) ?? [])) } catch {}
  try { allowed.push(...(core?.httpProvidersOf?.(config) ?? [])) } catch {}
  return allowed.some((entry) => `${entry?.name}/${entry?.model}` === model)
```

**依据 6 · 作者声明**：[README.md:229-235](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/README.md#L229-L235)

作者区分本地视觉和可能远程的聊天模型。

```text
| `vision_ocr` with Tesseract | Processed on the DSH machine. With the default `auto` engine, an unavailable or empty local OCR result may fall back to a vision model. |
| Image-turn routing and vision-model tools such as describe, detect, ground or vision OCR | The image or derived crop, prompt and relevant context are sent to the selected vision provider. |
| Built-in free fallback | Sent anonymously (no API key) to OVHcloud AI Endpoints at `oai.endpoints.kepler.ai.cloud.ovh.net`; the service still receives the request payload and network metadata such as the source IP. |
| User-configured cloud model / HTTP provider | Sent to that provider's configured endpoint under its own retention and privacy terms. |
| Local Ollama / LM Studio | Image pixels are sent to the configured local endpoint. The resulting text still returns to the current chat model, which may itself be remote. |

To stop **Vision Router itself** from sending image data to remote vision endpoints, enable **Settings → Vision Router → General → Local-only vision**. This is a runtime policy, not a destructive rewrite: saved cloud rows and `freeFallback` stay configured but cannot execute while the switch is on. Only loopback visual endpoints (`localhost`, `127.0.0.0/8`, `::1`) are eligible, including Ollama, LM Studio, and custom local HTTP backends. For a **strict local-only workflow**, also use a local chat model because vision result text still returns to the current chat model. Test the final network boundary in your own environment; Vision Router cannot make a remote chat model, proxy or Host integration local.
```

#### 缺口

- 未做网络抓包、代理和跨宿主验证
  **影响**：无法保证所有路径或结果文本不出站
  **进一步探讨**：以隔离图像和受控网络观察 local-only、代理与聊天模型完整路径。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用成本、后端依赖和退出条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:37-39 要求 Node ^22.19 或 >=24 并声明支持的 DSH 版本范围；54-75 列出运行依赖及可选 sharp peer，能安装或声明兼容不等于实际宿主和图像功能通过。src/index.js:2664-2672 的视觉工具需要宿主附件服务，后端、模型、网络与图像授权视配置而定；免费入口不能推断网络、人工复核或其他提供方费用为零。有兼容宿主且图像允许按所选路线处理的用户可先用非敏感图片试单次问答并核对原图，比较原生视觉；若出站目标、敏感数据、错误或费用不明，应停止并回退本地图像处理或人工核图。处理时延、模型消费和审阅成本未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:37-39](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/package.json#L37-L39)

Node 和 DSH 版本范围声明。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.1.5-rc.1 <0.2.0-0 || >=0.2.0-rc.2 <0.3.0-0"
```

**依据 2 · 源码核查**：[package.json:54-75](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/package.json#L54-L75)

依赖与可选图像 peer。

<details>
<summary>查看原文（22行）</summary>

```text
  "dependencies": {
    "@deepseek-ai/schemastery": ">=3.18.0",
    "potrace": "^2.1.8",
    "puppeteer-core": "^25.16.0",
    "undici": "^7.30.1",
    "zod": "^4.6.6"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-anonymous-user-id": ">=0.1.5-rc.1 <0.2.0-0 || >=0.2.0-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-llm-deepseek": ">=0.1.5-rc.1 <0.2.0-0 || >=0.2.0-rc.2 <0.3.0-0",
    "sharp": ">=0.35.3 <1",
    "@deepseek-ai/dsh-storage-domain": ">=0.1.5-rc.1 <0.2.0-0 || >=0.2.0-rc.2 <0.3.0-0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-anonymous-user-id": {
      "optional": true
    },
    "@deepseek-ai/dsh-llm-deepseek": {
      "optional": true
    },
    "sharp": {
      "optional": true
```

</details>

**依据 3 · 源码核查**：[src/index.js:2664-2672](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/index.js#L2664-L2672)

视觉工具依赖附件服务。

```text
      async execute(args, exec) {
        if (!toolEnabled()) {
          throw new Error('vision_describe: the vision tool is disabled in the vision-router settings')
        }
        const attachments = ctx.get('attachments')
        if (attachments === undefined) {
          throw new Error(
            'vision_describe: the durable attachment service is not available in this deployment',
          )
```

**依据 4 · 作者声明**：[README.md:229-235](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/README.md#L229-L235)

作者说明不同数据路径及结果文本边界。

```text
| `vision_ocr` with Tesseract | Processed on the DSH machine. With the default `auto` engine, an unavailable or empty local OCR result may fall back to a vision model. |
| Image-turn routing and vision-model tools such as describe, detect, ground or vision OCR | The image or derived crop, prompt and relevant context are sent to the selected vision provider. |
| Built-in free fallback | Sent anonymously (no API key) to OVHcloud AI Endpoints at `oai.endpoints.kepler.ai.cloud.ovh.net`; the service still receives the request payload and network metadata such as the source IP. |
| User-configured cloud model / HTTP provider | Sent to that provider's configured endpoint under its own retention and privacy terms. |
| Local Ollama / LM Studio | Image pixels are sent to the configured local endpoint. The resulting text still returns to the current chat model, which may itself be remote. |

To stop **Vision Router itself** from sending image data to remote vision endpoints, enable **Settings → Vision Router → General → Local-only vision**. This is a runtime policy, not a destructive rewrite: saved cloud rows and `freeFallback` stay configured but cannot execute while the switch is on. Only loopback visual endpoints (`localhost`, `127.0.0.0/8`, `::1`) are eligible, including Ollama, LM Studio, and custom local HTTP backends. For a **strict local-only workflow**, also use a local chat model because vision result text still returns to the current chat model. Test the final network boundary in your own environment; Vision Router cannot make a remote chat model, proxy or Host integration local.
```

#### 缺口

- 未测固定宿主、网络服务、模型和用户任务
  **影响**：无法量化兼容率、费用和时间收益
  **进一步探讨**：非敏感样本对照原生视觉，记录响应、人工核对和实际账单。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否让用户核对每次尝试的出站与费用不确定性？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有 src/index.js:2958-2975 已记录失败分类、attempted 和日志，vision-execution-policy.js:480-485 也说明执行范围内的来源诊断；因此简单添加失败日志不是新方案。未验证方案是为一次视觉任务生成用户可见、短期保留的脱敏尝试收据：每次记录候选、隐私模式、仅本地拒绝/已交 transport/未知等证据状态、预算消耗和已确认费用；不存原图、提示或凭据，无法证明远端是否收到或计费时必须标 unknown。运行前以最终路由展示是否可能向远端发送，并允许用户取消；这依赖宿主提供可靠的传输边界、用户确认与权限，代理或底层 SDK 若不可观察则不能声称零出站。以同一假后端对照现有失败 attempted/日志与收据原型，覆盖本地能力拒绝、可信 UNKNOWN_MODEL、远端 401/429、响应丢失、缓存命中和 local-only；记录错误出站判断、未知数、重复请求、隐私泄露与排查时间。若误把 unknown 当未出站或零费用、泄露图像/密钥、local-only 仍向受控远端发出请求、或没有降低错误判断而增加不可接受负担，应否定方案；尚未实现或运行。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:2958-2975](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/index.js#L2958-L2975)

现有失败分类、attempted 及日志。

<details>
<summary>查看原文（18行）</summary>

```text
          } catch (error) {
            const classification = classifyVisionFailure(error)
            visionBreaker.record(backendKey, fingerprint, classification, scope)
            visionTurnMemory.record(scope, backendKey, classification.kind)
            attempted.push({
              backend: backendKey,
              kind: classification.kind,
              error: error && error.message ? error.message : String(error),
            })
            const message = error && error.message ? error.message : String(error)
            errors.push(`${backendKey}: ${message}`)
            ctx.logger?.warn(
              'vision-router: vision_describe fallback [%s] (%s, %d ms): %s',
              backendKey,
              classification.kind,
              Date.now() - attemptStarted,
              message,
            )
```

</details>

**依据 2 · 源码核查**：[src/lib/vision-execution-policy.js:480-485](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/lib/vision-execution-policy.js#L480-L485)

现有执行范围来源诊断。

```text
 * is bridge-eligible only when the Host's private registry has trusted evidence
 * for that exact provider/model (current live discovery or an endpoint-scoped
 * trusted hint), which solves static-catalog lag without making arbitrary model
 * ids a direct-request capability. The same scope records backend provenance so
 * bug reports can show which model was attempted, whether the direct bridge was
 * entered, and which adapter/bridge path actually completed.
```

**依据 3 · 源码核查**：[src/lib/vision-execution-policy.js:67-95](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/lib/vision-execution-policy.js#L67-L95)

既有本地 pre-wire 判据。

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/index.js:2797-2806](https://github.com/ysr666/dsh-vision-router/blob/ae9bac8b1028cad26c78f1532a559dd2e6517577/src/index.js#L2797-L2806)

缓存命中不应虚构上游尝试。

<details>
<summary>查看原文（10行）</summary>

```text
        const key = cacheKeyFor({
          pairs: usablePairs,
          httpProviders: httpFallbacks,
          contentIds,
          wantJson,
          question,
        })
        if (cacheEnabled()) {
          const hit = cache.get(key)
          if (hit !== undefined) return hit
```

</details>

#### 缺口

- 没有端到端可观察传输边界或收据原型
  **影响**：无法证明出站/计费归因或用户决策收益
  **进一步探讨**：使用假后端、代理和缓存进行对照并保留 unknown。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
