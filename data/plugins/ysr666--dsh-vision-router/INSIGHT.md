# DSH Vision Router

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[020d0a5](https://github.com/ysr666/dsh-vision-router/tree/020d0a57f36e5b2c4dd20e477c065faa1918f946)

<!-- BEGIN META -->
[![GitHub ★ 1,249](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C249&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ysr666/dsh-vision-router) [![npm 30d 60,243](https://img.shields.io/static/v1?label=npm+30d&message=60%2C243&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-vision-router) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-vision-router)
<!-- END META -->

> **功能**：为 DeepSeek Harness 的文本代理接入视觉模型，并提供截图对照与像素级图像工具。

> **亮点**：在同一 DSH 会话组合可追踪的附件引用、视觉问答和独立像素差分产物，文本模型可继续完成多步核查。[Q01](#research-q01)

> **主要限制**：默认回退可以把图片和问题发送给远端，任务超时或取消也不足以判断远端是否已处理。仅本地视觉不覆盖聊天模型和外部代理链。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 文本模型参与截图审查时，这个插件比原生多模态问答或人工切换工具多做了什么？](#detail-section-11)
  - [Q02 · 后端能力预检、兼容桥和失败回退怎样配合，是否可能重复发送同一图片？](#detail-section-12)
  - [Q03 · 默认与仅本地视觉设置分别允许图片、问题和识图结果去哪？](#detail-section-13)
  - [Q04 · 如何对一次合格截图审查估算代价，什么人适合试用 3.2.0？](#detail-section-14)
  - [Q05 · 能否用可见的尝试记录和人工标注，提高视觉路由的可核对性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者在 DSH 中审查截图或对照页面原型，希望保留当前对话并得到可人工复核的差分。[Q01](#research-q01)

直接切换原生多模态模型完成单次理解，或在独立截图工具中完成差分后人工带回结果。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 视觉问答 | 用同一会话的截图回答具体问题 | 需附件服务和可用视觉端，云端会接收内容 |
| 像素差分 | 查看不同像素比例、热点和热图 | 需可比尺寸和渲染条件，大图热图可为预览 |
| 本地文件交接 | 给需要文件路径的本地解析器提供工作区副本 | 限能读取的图像，副本需考虑留存 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=24.9 和 DSH >=0.2.1-rc.5 <0.3.0-0 | 包声明要求 | 加载插件与生命周期 | 不使用本版本覆盖现有配置 |
| Host 附件服务与已启用视觉工具 | vision_describe 需要 | 将图片交给视觉端 | 工具报错 |
| 可用视觉端 | 后端问答需要 | 看图并返回回答 | 结构化失败并转人工核图 |
| sharp | 像素差分需要 | 解码、缩放和比较 | 对应像素能力无法使用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户用独立配置记录宿主、模型和出站目标 | 只用非敏感参考图 |
| 对照 | 用户启用视觉，比较两图并打开热图与报告 | 热点和原图可对应 |
| 退出 | 用户关闭视觉或停用插件并回原生查看 | 失败时核对是否曾上传，不重复盲试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 后端费率与安装资源未知 | 独立配置并核对版本和出站 | 升级预检不保证数据兼容 |
| 持续使用 | 后端尝试、编码及本地差分开销未测 | 核对热点和原图 | 缓存可能省重复调用，实际节时未知 |
| 失败恢复 | 回退可能增加网络或收费 | 停止重复请求并转人工 | 取消时远端处理状态不明 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 截图对照 | 支持视觉问答与差分报告 | 业务验收与人工效率 |
| 故障处理 | 候选按预算推进并可返回结构化失败 | 远端次数和收费 |
| 本地视觉 | 运行时限制视觉端为环回地址 | 聊天模型、代理和本机服务的实际出站 |

> **思考**：默认回退可以把图片和问题发送给远端，任务超时或取消也不足以判断远端是否已处理。仅本地视觉不覆盖聊天模型和外部代理链。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在同一 DSH 会话组合可追踪的附件引用、视觉问答和独立像素差分产物，文本模型可继续完成多步核查。[Q01](#research-q01)

生命周期拥有视觉传输的释放，图像、问题、候选列表和输出模式参与缓存。候选预检、熔断和共享截止各约束不同阶段，不能用兼容桥代替服务端交付回执。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

默认回退可以把图片和问题发送给远端，任务超时或取消也不足以判断远端是否已处理。仅本地视觉不覆盖聊天模型和外部代理链。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

在独立 profile 先用两张无敏感内容、尺寸和渲染环境可说明的截图做一次对照。检查报告阈值、热点与原图，并在意外出站、空回答或显示错误时停用视觉并回原生或人工检查。升级旧环境先用副本核验历史记录。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码支持附件接线、候选回退、出站策略和差分产物。截图任务收益、真实网络边界和宿主升级仍待验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.js、cordis.patch.yml、src/lib/vision-backend-runtime-policy.js、src/lib/vision-execution-policy.js、src/lib/core-primitives.js、package.json、src/lib/public-entry.js、docs/releases/v3.2.0.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：覆盖本版本入口、包与宿主接线、视觉问答和像素差分路径、HTTP 兼容、仅本地约束及作者迁移说明。未声称覆盖全部深度工具和宿主组合。
- 下一步：只读核查固定源码和作者说明，未安装、执行插件、访问模型后端或验证正式数据迁移。验证方案见 [Q05](#research-q05)。

**分析版本**

- **仓库**：[ysr666/dsh-vision-router](https://github.com/ysr666/dsh-vision-router)
- **版本号**：3.2.0（[固定提交 020d0a5](https://github.com/ysr666/dsh-vision-router/tree/020d0a57f36e5b2c4dd20e477c065faa1918f946)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证的方向是在正常结果旁给出脱敏的发送与回退记录，并把人工标注的结果作为差分验收条件，以便检查误发、误判和核对负担。[Q05](#research-q05)

只读核查固定源码和作者说明，未安装、执行插件、访问模型后端或验证正式数据迁移。验证方案见 [Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 98 | 10811 | — | — | 144961 |
| .js | source | 146 | 51944 | 43790 | 5269 | — |
| .mjs | source | 46 | 8429 | 7374 | 459 | — |
| .ts | source | 39 | 6058 | 4963 | 467 | — |
| .js | test | 232 | 64213 | 58388 | 1868 | — |
| .mjs | example | 4 | 68 | 45 | 18 | — |
| .mjs | test | 4 | 962 | 860 | 27 | — |
| .ts | test | 31 | 975 | 776 | 59 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/ysr666/dsh-vision-router/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=23&color=737b86&logo=github)](https://github.com/ysr666/dsh-vision-router/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=23&color=737b86&logo=github)](https://github.com/ysr666/dsh-vision-router/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DSH 的文本推理模型与视觉后端分工时，这个插件怎样保留可核对的图像任务，又在何种数据、故障及升级条件下值得试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 文本模型参与截图审查时，这个插件比原生多模态问答或人工切换工具多做了什么？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

对于用 DSH 反复核对页面截图的开发者，插件把询问截图、读取上传附件、产出差分图和返回 Agent 继续推理接到工具接口。vision_describe 在工具允许且宿主附件服务存在时接收一至四张图，支持本地路径和会话附件引用。上传 ID 会从调用会话解析，然后经附件服务读取。启用缩放时会为视觉调用尝试生成较小附件。问题与图像组成同一个视觉请求，视觉返回供原会话使用。若只是看一眼图片，直接选原生多模态模型已能覆盖核心任务，另设路由可能增加等待。这里较明确的增量是保留宿主推理会话的同时，重复比较同一对截图并让操作者读取差分报告与热图。工具注册由宿主管理，默认配置采用完整工具集；工具真正可见和可调用还受到宿主会话策略约束。参考图像坐标以宿主保存的规范化像素为准，不能把图像上传前的编码或尺寸直接等同于工具输入。合格结果应能指出目标区域并由人对照实际截图，而单一文字描述不足以验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:47-54](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/README.md#L47-L54)

作者列出原型对照、识字和裁图的工作场景。

```text
## Try it on real images

- **Understand a screenshot:** “What does this error dialog mean? Read the exact message.”
- **Find a UI element:** “Where is the Save button in this screenshot? Give me its position.”
- **Compare two designs:** “Compare my page to this reference. What should I fix next?” Use `vision_pixel_diff` to measure changes after each iteration.
- **Read and inspect a long image:** “Extract the relevant text, then crop the unclear part to double-check it.”

These are ordinary chat requests: your normal model reasons through the task and calls vision tools as needed. [See the tool list](#tools) or [configure your own/local vision backend](#configuration).
```

**依据 2 · 源码核查**：[src/index.js:2871-2898](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L2871-L2898)

工具启用、附件服务与数量前置条件，上传 ID 绑定会话。

<details>
<summary>查看原文（28行）</summary>

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
        }
        // Preserve only durable upload ids for a deterministic offline fallback.
        // Never expose or guess the attachment store's private filesystem path.
        const materializableAttachmentIds = [...new Set([
          ...attachmentIds.map((id) => String(id)).filter((id) => isAttachmentIdInput(id)),
          ...paths.map((item) => String(item)).filter((item) => isAttachmentIdInput(item)),
        ])]
        const attachmentSession = exec && exec.agent && exec.agent.session
        const resolvedAttachmentRefs = materializableAttachmentIds.length > 0
          ? await resolveAttachments(attachmentSession, materializableAttachmentIds)
          : new Map()
```

</details>

**依据 3 · 源码核查**：[src/index.js:2938-2979](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L2938-L2979)

按会话引用读取附件及派生缩放。

<details>
<summary>查看原文（42行）</summary>

```text
        for (const id of attachmentIds) {
          const attachmentId = String(id)
          const ref = isAttachmentIdInput(attachmentId)
            ? resolvedAttachmentRefs.get(attachmentId)
            : await resolveAttachment(attachmentSession, attachmentId)
          if (ref === undefined) {
            throw new Error(
              `vision_describe: unknown attachment id "${id}" (it must come from an image uploaded in this conversation)`,
            )
          }
          let stored
          try {
            stored = await attachments.readImage(ref)
          } catch (error) {
            throw new Error(
              `vision_describe: failed to read attachment ${id} (${error && error.message ? error.message : String(error)})`,
            )
          }
          // Downscale oversized uploads before the vision call: retina
          // screenshots easily reach 10MP+ and the vision encoder's cost
          // scales with pixels — a full-size upload is the dominant part of
          // the tool-call latency. Re-save a resized attachment so the
          // adapter reads the small one.
          if (downscaleEnabled() && stored.data && stored.data.length > 0) {
            const resized = await downscaleImage(stored.data, downscaleMaxPixels())
            if (resized !== stored.data) {
              try {
                const resizedRef = await attachments.saveImage({
                  data: resized,
                  mediaType: stored.ref && stored.ref.mediaType ? stored.ref.mediaType : 'image/png',
                  ...(stored.ref && stored.ref.name ? { name: stored.ref.name } : {}),
                })
                stored = { ref: resizedRef, data: resized }
                ctx.logger?.info('vision-router: downscaled attachment %s for the vision call', id)
              } catch {
                stored = { ...stored, data: resized }
              }
            }
          }
          contentIds.push(String(ref.attachmentId))
          blocks.push({ type: 'image', attachment: stored.ref })
        }
```

</details>

**依据 4 · 源码核查**：[src/index.js:3033-3042](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L3033-L3042)

图像与问题进入同一视觉调用。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[src/index.js:4304-4328](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L4304-L4328)

输出分区结果、热图和 JSON 路径。

<details>
<summary>查看原文（25行）</summary>

```text
        const worst = diff.cells.slice(0, 5).map((cell) => ({
          x1: cell.x1,
          y1: cell.y1,
          x2: cell.x2,
          y2: cell.y2,
          ratio: Number(cell.ratio.toFixed(4)),
          differing: cell.differing,
          total: cell.total,
        }))
        const report = {
          original: args.original,
          rebuilt: args.rebuilt,
          threshold,
          width,
          height,
          differingPixels: diff.differing,
          totalPixels: diff.total,
          diffRatio: Number(diff.ratio.toFixed(4)),
          worstRegions: worst,
          ...(heatmapPreview ? { heatmapPreview: true, heatmapWidth, heatmapHeight } : {}),
        }
        const stem = artifactStem(args.original, 'diff')
        const heatmapPath = await saveArtifact(exec, `${stem}-heatmap.png`, heatmapPng)
        const reportPath = await saveArtifact(exec, `${stem}-report.json`, Buffer.from(JSON.stringify(report, null, 2)))
        return JSON.stringify({ ...report, heatmapPath, reportPath })
```

</details>

**依据 6 · 源码核查**：[src/index.js:4943-4975](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L4943-L4975)

深度工具通过 ctx.tools.register 挂载。

<details>
<summary>查看原文（33行）</summary>

```text
    activateDeepTools = () => {
      if (deepActive) return '视觉深看工具已在挂载状态。请在下一模型步骤调用深度工具，不要与 vision_activate 同批并行调用。'
      deepActive = true
      try {
        for (const def of deepToolDefs) {
          const registeredDef =
            def.name === 'vision_bootstrap' || typeof def.execute !== 'function'
              ? def
              : {
                  ...def,
                  async execute(args, exec) {
                    const session = exec && exec.agent && exec.agent.session
                    const state = session ? structuredBootstrapTurnState.get(session) : undefined
                    if (structuredBootstrapEnabled() && state && state.required && state.completed !== true) {
                      return JSON.stringify({
                        ok: false,
                        code: state.failed ? 'STRUCTURED_BOOTSTRAP_FAILED' : 'STRUCTURED_BOOTSTRAP_REQUIRED',
                        retryable: !state.failed,
                        reason: state.failed
                          ? 'the required structured bootstrap visual pass failed; do not make more visual calls this turn'
                          : 'call vision_bootstrap and wait for its universal structured visual result before any other vision tool',
                      })
                    }
                    // 识图档位不在这里做调用次数拦截；显式 visionDepthMaxCalls 由
                    // structured-flow hardening 统一执行，避免与 evidence 完成状态重复计数。
                    // Tool-specific execution policy belongs to the tool itself; this wrapper owns
                    // only bootstrap ordering and never rewrites model/user arguments.
                    const result = await def.execute(args, exec)
                    return result
                  },
                }
          deepDisposers.push(ctx.tools.register(registeredDef))
        }
```

</details>

**依据 7 · 源码核查**：[cordis.patch.yml:33-41](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/cordis.patch.yml#L33-L41)

聚合默认关闭渐进挂载，采用完整工具表。

```text
# 挂载插件行。默认保持完整视觉工具表常驻（issue #81）：虽然渐进挂载可以
# 少发一小段工具 schema，但图片轮首次扩展工具列表会改变请求前缀，可能让
# 长会话的 provider KV/prefix cache 整体失效。高级用户仍可在 profile /
# composition 补丁中显式把 progressiveTools 改回 true（启动期配置）。
- insert:
    - id: vision-router
      name: dsh-vision-router
      config:
        progressiveTools: false
```

**依据 8 · 源码核查**：[cordis.patch.yml:54-67](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/cordis.patch.yml#L54-L67)

规范化像素由 Host 持有，坐标口径以 canonical raster 为准。

<details>
<summary>查看原文（14行）</summary>

```text
# Vision Router 的附件产品契约：Host attachment store 是 durable 图片的唯一
# owner，视觉工具只读取 Host 已持久化、校验后的 canonical pixels。DSH rc.8
# 以前 Host 会把已准入的源编码直接持久化；0.1.2-alpha.1 开始又增加独立的
# provider-independent normalization stage。若沿用 alpha.1 的 4.2MP / 4MiB
# 默认值，DVR 的 crop / grounding / OCR / pixel-diff 会在用户毫不知情时换到
# 一个更小的像素坐标系。因此这里把 normalization policy 同步到 DVR 既有的
# 20MiB / 1 亿像素 / 10000px 准入边界：普通 8-bit sRGB 图片继续 pass-through，
# 不扩大 DVR 在 rc.8 时已经允许的 durable 存储上限，同时仍让 Host 独占
# normalization、完整性校验和对象身份。
#
# 注意：alpha.1 对 EXIF/色彩空间/GIF/超限编码等输入仍可能规范化或重编码。
# DVR 不另存第二份 raw attachment，也不声称能从 canonical object 恢复源字节；
# 像素工具的合同因此以 Host canonical pixels 为准。ImageAttachmentRef 的
# originalDimensions 仅用于说明 Host 曾缩放，不能被当作可读取的原图。
```

</details>

#### 缺口

- 缺少原生多模态和工具链同样例比较，也未验证宿主会话开关的端到端可见性。
  **影响**：无法断定真实任务更快或模型更准。
  **进一步探讨**：用固定的非敏感截图对比定位正确率、完成同一差分任务的步骤和耗时，并核查开关前后的工具目录。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 后端能力预检、兼容桥和失败回退怎样配合，是否可能重复发送同一图片？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

可能。视觉工具范围内，宿主若把图像投影为纯文本，运行时会检查候选声明或显式配置。此时能识别兼容的 HTTP Chat Completions 传输就转桥接，否则返回不可交付图像。对适配器运行后才暴露的错误，另有窄规则，只将精确匹配的本地 pi-ai 图片准入拒绝或有可信能力依据的静态模型目录漏项允许接兼容桥。普通鉴权、限流和服务错误不能借这条兼容桥再次调用原目标。正常故障仍可走候选链到下一视觉提供方，且无效 JSON 有一次同目标纠正。共享 deadline 限制整条视觉任务的时间，单次尝试叠加剩余预算和用户取消信号，缓存命中可直接返回。空文本按失败处理，用户取消不记作后端故障。同一轮全链失败后，重复询问可以直接返回结构化错误。上述机制减少某些重复，但没有远端提交回执，超时或取消不能证明远端没收图或没计费。结构化错误附本地 OCR 或工作区副本的退路，不能用于外部视觉结论背书。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/vision-backend-runtime-policy.js:90-104](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/lib/vision-backend-runtime-policy.js#L90-L104)

传输桥仅接受兼容的 HTTP 协议。

<details>
<summary>查看原文（15行）</summary>

```text
function bridgePlan(ctx, llm, core, provider, model) {
  if (typeof core?.resolveChannelBridgeTransport !== 'function') {
    return { ok: false, reason: 'bridge transport resolver unavailable' }
  }
  const rawProfile = rawChannelProfileOf(ctx, provider)
  const resolvedProfile = resolvedChannelProfileOf(llm, provider)
  const transport = core.resolveChannelBridgeTransport(rawProfile, resolvedProfile, model)
  const supported = typeof core?.isOpenAIHttpBridgeTransport === 'function'
    ? core.isOpenAIHttpBridgeTransport(transport)
    : transport?.api === 'openai-completions' && /^https?:/.test(String(transport?.baseURL ?? ''))
  if (!supported) {
    return { ok: false, reason: 'no safe OpenAI-compatible HTTP transport', rawProfile, resolvedProfile, transport }
  }
  return { ok: true, rawProfile, resolvedProfile, transport }
}
```

</details>

**依据 2 · 源码核查**：[src/lib/vision-backend-runtime-policy.js:303-329](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/lib/vision-backend-runtime-policy.js#L303-L329)

仅工具范围内含图请求进入预检，先执行 local-only。

<details>
<summary>查看原文（27行）</summary>

```text
      return (call) => {
        const scope = visionBackendScope.getStore()
        if (!scope || !call || !contentHasImage(core, call.messages)) return stream.call(target, call)
        const provider = typeof call.provider === 'string' ? call.provider : ''
        const model = typeof call.model === 'string' ? call.model : ''
        if (provider === '' || model === '') return stream.call(target, call)
        const config = currentConfig(ctx, options.config ?? {})
        const source = typeof options.evidenceSource === 'function'
          ? options.evidenceSource(provider, model) ?? 'configured'
          : 'configured'
        return {
          async *[Symbol.asyncIterator]() {
            if (!localOnlyVisionCallAllowed(core, config, provider, model)) {
              safeLog(
                logger,
                'info',
                'vision-router: local-only policy blocks visual backend [%s/%s] source=%s',
                provider,
                model,
                source,
              )
              yield* failureStream(
                `vision backend ${provider}/${model} is blocked by the local-only vision policy`,
                'VISION_LOCAL_ONLY_POLICY',
              )
              return
            }
```

</details>

**依据 3 · 源码核查**：[src/lib/vision-backend-runtime-policy.js:330-354](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/lib/vision-backend-runtime-policy.js#L330-L354)

已知文本投影时先决定改走桥或结束。

<details>
<summary>查看原文（25行）</summary>

```text
            const info = await resolvedHostInfo(target, call)
            const delivery = hostImageDeliveryFromInfo(info)
            const capability = typeof core?.decideVisionBackendCapability === 'function'
              ? core.decideVisionBackendCapability(info, provider, model, config.extraVisionModels)
              : { image: false, inferred: false }
            const explicit = configuredPairKeys(config).has(`${provider}/${model}`)
            if (delivery === 'text-projected' && (capability.image === true || explicit)) {
              const plan = bridgePlan(ctx, target, core, provider, model)
              if (!plan.ok) {
                safeLog(
                  logger,
                  'info',
                  'vision-router: vision preflight blocks text projection [%s/%s] source=%s reason=%s',
                  provider,
                  model,
                  source,
                  plan.reason,
                )
                yield* failureStream(
                  `vision backend ${provider}/${model} is declared text-only by the Host, which strips image pixels before the registered adapter runs; no safe HTTP image bridge is available. If this endpoint really supports images, enable Image under DSH Settings > Models > provider > Customized settings > Model options > Input types (when available); on older Hosts set the provider-specific model field (llm-pi-ai: input: [text, image]; llm-deepseek: inputModalities: [text, image]), then reload model configuration. Otherwise choose a declared image-capable backend. Direct bridging is supported only for verified HTTP OpenAI Chat Completions endpoints.`,
                )
                return
              }
              yield* directStream(ctx, core, plan, call, logger, source, options.providerTransport)
              return
```

</details>

**依据 4 · 源码核查**：[src/lib/vision-execution-policy.js:73-114](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/lib/vision-execution-policy.js#L73-L114)

针对准入拒绝和受信目录漏项的狭窄错误分类。

<details>
<summary>查看原文（42行）</summary>

```text
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

**依据 5 · 源码核查**：[src/index.js:3004-3035](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L3004-L3035)

问题和输入参与缓存键，并有本轮全链失败短路。

<details>
<summary>查看原文（32行）</summary>

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
        }

        // Turn-level failure memory: once every backend has failed this turn,
        // later calls answer instantly — no network, no re-hitting a tripped
        // 401 provider, no minutes of "deep diving".
        const session = exec && exec.agent && exec.agent.session
        const sessionId = sessionIdentityOf(session)
        const scope = visionScopeOf(session)
        if (visionTurnMemory.allFailed(scope)) {
          return JSON.stringify(
            buildVisionFailure({
              code: VISION_RESULT_CODES.BACKEND_UNAVAILABLE_THIS_TURN,
              retryable: false,
              reason: 'all vision backends already failed for this turn; skipping further network attempts',
              attempted: visionTurnMemory.attempted(scope),
            }),
          )
        }

        // One shared deadline for the WHOLE task: every provider, fallback and
        // the JSON-correction retry draws from this single budget.
        const deadline = createDeadline(visionTaskTimeoutMs())
```

</details>

**依据 6 · 源码核查**：[src/index.js:3054-3095](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L3054-L3095)

预算、熔断和取消信号。

<details>
<summary>查看原文（42行）</summary>

```text
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
          }
          const backendKey = `${pair.provider}/${pair.model}`
          const fingerprint = await credentialFingerprintFor({ provider: pair.provider })
          const gate = visionBreaker.inspect(backendKey, fingerprint, scope)
          if (gate.blocked) {
            errors.push(`${backendKey}: skipped (circuit open: ${gate.reason})`)
            ctx.logger?.info('vision-router: vision call %s skipped (circuit open: %s)', backendKey, gate.reason)
            continue
          }
          // Declared outside the try so the catch can report the elapsed time
          // even when the failure happens before the first network call.
          let attemptStarted = Date.now()
          try {
            let messages = baseMessages
            // Local backends get an independent anti-hang budget (a fair share
            // of the remaining task deadline) so a hung local service cannot
            // starve the next local backend. Regular providers keep main's
            // per-call timeout, bounded by the shared deadline.
            const attemptBudgetMs = isLocalBackendPair(pair)
              ? weightedFallbackBudget(
                  deadline.remaining(),
                  timeoutMs(),
                  candidateWeight,
                  weightAtStart,
                )
              : timeoutMs()
            const signal = combineSignals(
              currentVisionTurnBudgetSignal(),
              deadline.signal(),
              AbortSignal.timeout(attemptBudgetMs),
            )
```

</details>

**依据 7 · 源码核查**：[src/index.js:3113-3144](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L3113-L3144)

结构化结果纠正可再次调用。

<details>
<summary>查看原文（32行）</summary>

```text
            if (wantJson) {
              for (let attempt = 0; attempt < 2; attempt++) {
                const parsed = extractJson(text)
                if (parsed !== undefined) {
                  const compact = JSON.stringify(normalizeDescribeResult(parsed) ?? parsed)
                  if (cacheEnabled()) cache.set(key, compact)
                  return compact
                }
                if (attempt === 0) {
                  messages = [
                    ...baseMessages,
                    {
                      role: 'user',
                      content: [
                        {
                          type: 'text',
                          text: 'That output was not valid JSON. Respond with ONLY a valid JSON object now.',
                        },
                      ],
                      source: { kind: 'plugin', plugin: 'dsh-vision-router' },
                    },
                  ]
                  attemptStarted = Date.now()
                  text = await callVisionPairWithOptionalBridge(pair, messages, {
                    maxTokens: 4096,
                    signal,
                    sessionId,
                    capability,
                    bridgeBlocks: blocks,
                    bridgeInstruction:
                      promptText + '\n\nThat output was not valid JSON. Respond with ONLY a valid JSON object now.',
                  })
```

</details>

**依据 8 · 源码核查**：[src/index.js:3155-3184](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L3155-L3184)

空响应失败，取消不进入故障记账。

<details>
<summary>查看原文（30行）</summary>

```text
              const invalidJson = new Error('vision_describe backend did not produce valid JSON after one correction retry')
              invalidJson.code = 'INVALID_REQUEST'
              throw invalidJson
            }
            if (text !== '') {
              if (cacheEnabled()) cache.set(key, text)
              return text
            }
            // A successfully transported but empty answer is not visual evidence.
            // In particular, reasoning models can exhaust their output budget
            // before emitting any content. Never cache a fabricated success or
            // suppress a healthy later backend in the configured chain.
            const empty = new Error('vision_describe backend returned empty content')
            empty.code = 'EMPTY_RESPONSE'
            throw empty
          } catch (error) {
            // A user/Host cancel is not a backend outage. Otherwise the
            // canceled attempt poisons this turn's breaker/failure memory and
            // a healthy retry returns BACKEND_UNAVAILABLE_THIS_TURN.
            throwIfVisionTaskAborted(currentVisionTurnBudgetSignal(), error)
            const classification = classifyVisionFailure(error)
            consecutiveServerFailures = classification.kind === VISION_FAILURE_KINDS.SERVER
              ? consecutiveServerFailures + 1 : 0
            visionBreaker.record(backendKey, fingerprint, classification, scope)
            visionTurnMemory.record(scope, backendKey, classification.kind)
            attempted.push({
              backend: backendKey,
              kind: classification.kind,
              error: error && error.message ? error.message : String(error),
            })
```

</details>

**依据 9 · 源码核查**：[src/index.js:3345-3369](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L3345-L3369)

最终失败是结构化结果，上传附件有本地取证建议。

<details>
<summary>查看原文（25行）</summary>

```text
        // Structured failure instead of a thrown tool exception: the model
        // must see a retryable=false result code, not an "occasional glitch".
        const reason =
          errors.length > 0
            ? ensureSentencePunctuation(
              `All vision models failed: ${errors.slice(0, 6).join(' | ')}${errors.length > 6 ? ` | … ${errors.length - 6} more` : ''}`,
            )
            : 'No vision-capable backend is configured.'
        const failure = await visionFailureResult(
          scope,
          attempted.length > 0 ? attempted : errors.map((text) => ({ backend: 'configured', kind: 'NO_ADAPTER', error: text })),
          reason,
        )
        const baseFailure = attempted.length > 0
          ? failure
          : { ...failure, code: VISION_RESULT_CODES.UNSUPPORTED_BACKEND }
        if (materializableAttachmentIds.length > 0) {
          baseFailure.degradedAccess = {
            tool: 'vision_materialize',
            attachmentIds: materializableAttachmentIds,
            advice:
              'For text transcription, call vision_ocr with {"image":"<attachment id>","engine":"tesseract"}; vision_ocr accepts uploaded attachment ids directly. Use vision_materialize only when a separate non-Vision-Router local parser genuinely requires a filesystem path. Do not guess a filename or the attachment store path.',
          }
        }
        return JSON.stringify(baseFailure)
```

</details>

#### 缺口

- 没有模拟后端记录发送字节、取消时序和计费回执。
  **影响**：无法确认一次用户请求产生几次远端处理或是否收费。
  **进一步探讨**：用只记录发送计数的受控视觉端注入预检拒绝、无效 JSON、429 和发送后超时，分别核对网络次数与会话提示。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认与仅本地视觉设置分别允许图片、问题和识图结果去哪？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

默认配置允许内置匿名 OVHcloud HTTP 回退。vision_describe 走直接 HTTP 时重新从附件服务读取视觉输入，将图片编码和问题放在兼容消息内，因此无密钥也可以把两者发送到远端。已保存仅本地视觉后，候选列表只容许已配置的环回视觉地址，视觉请求执行前还会再次检查，匿名默认列表不进入该模式。该判断基于 URL 的协议和主机名，外部配置的本机服务是否再转发无法由这里证明。默认的聊天模型也不是视觉后端设置所控制的对象，结果文本可跟随当前聊天模型发往远端。原生多模态路径是否另行上传需看宿主选用的模型。另有屏幕捕获工具只在显式配置时入工具集。输入限非敏感图时可试用，若要建立全链本地性，则需要本地聊天与视觉端、明确宿主和代理配置并核对真实出站。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:323-331](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L323-L331)

默认关闭仅本地视觉并启用免费兜底。

```text
  // Privacy policy switch: when enabled, Vision Router executes image-model
  // requests only against loopback visual endpoints (Ollama, LM Studio, or
  // custom local HTTP). Saved cloud
  // rows remain intact but inactive, so disabling the policy restores the
  // previous routing chain without destructive settings rewrites.
  localOnlyVision: z.boolean().default(false),
  freeFallback: z.boolean().default(true),
  // 云端免费优先：开启后，云端后端先尝试内置 OVH 免费模型（免注册、免
  // API Key），付费 httpProviders 仅在免费模型全部失败后作为兜底，尽量把
```

**依据 2 · 源码核查**：[src/lib/core-primitives.js:1773-1788](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/lib/core-primitives.js#L1773-L1788)

匿名远端模型与地址来自内置候选表。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * Direct OpenAI-compatible HTTP providers (no harness llm service involved).
 * `httpProviders` is an explicit list; when the config leaves it empty, the
 * built-in default is the OVHcloud AI Endpoints anonymous layer — a free,
 * registration-free vision endpoint (2 requests/min/IP, best-effort).
 */
export const DEFAULT_HTTP_PROVIDERS = [
  // OVHcloud anonymous quota is per IP AND per model. Keep the free chain
  // ordered by preferred quality so quality wins first. Retired models are
  // removed from this implicit chain; explicit user rows are never rewritten. A 429 on one model can
  // immediately fall through to the next model's independent anonymous bucket.
  { name: 'ovh', baseURL: 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1', model: 'Qwen3.5-397B-A17B', apiKeyEnv: '', maxTokens: 4096 },
  { name: 'ovh', baseURL: 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1', model: 'Qwen2.5-VL-72B-Instruct', apiKeyEnv: '', maxTokens: 4096 },
  { name: 'ovh', baseURL: 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1', model: 'Qwen3.6-27B', apiKeyEnv: '', maxTokens: 4096 },
  { name: 'ovh', baseURL: 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1', model: 'Qwen3.5-9B', apiKeyEnv: '', maxTokens: 4096 },
]
```

</details>

**依据 3 · 源码核查**：[src/index.js:3197-3204](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L3197-L3204)

直接 HTTP 回退在调用前重验本地约束。

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

**依据 4 · 源码核查**：[src/index.js:3223-3240](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L3223-L3240)

构造图像与同一问题的 HTTP 内容。

<details>
<summary>查看原文（18行）</summary>

```text
          try {
            // Precompute bytes once per block (attachments.readImage is async).
            const openAIBlocks = []
            for (const block of blocks) {
              if (block.type === 'image' && block.attachment) {
                const stored = await attachments.readImage(block.attachment)
                openAIBlocks.push(toOpenAIContent([block], () => stored.data)[0])
              } else {
                openAIBlocks.push({ type: 'text', text: block.text })
              }
            }
            // Direct HTTP providers must receive the same image + question as
            // adapter-backed providers. Some endpoints (e.g. Zhipu GLM) reject
            // a pure-image user message even when permissive endpoints accept it.
            const openAIBaseMessages = appendPromptToImageOnlyMessage(
              [{ role: 'user', content: openAIBlocks }],
              promptText,
            ).messages
```

</details>

**依据 5 · 源码核查**：[src/lib/core-primitives.js:176-204](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/lib/core-primitives.js#L176-L204)

只接受 HTTP(S) 环回地址，过滤宿主路由候选。

<details>
<summary>查看原文（29行）</summary>

```text
export function localOnlyVisionEnabled(config = {}) {
  return !!config && config.localOnlyVision === true
}

export function isLoopbackVisionBaseURL(value) {
  try {
    const url = new URL(String(value ?? ''))
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
    const host = String(url.hostname ?? '').toLowerCase().replace(/^\[|\]$/g, '')
    if (host === 'localhost' || host === '::1') return true
    const parts = host.split('.')
    return parts.length === 4 && parts[0] === '127' && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)
  } catch {
    return false
  }
}

/** Flatten the single-provider shorthand and the multi-provider form into one ordered chain. */
export function providersOf(config = {}) {
  const localOnly = localOnlyVisionEnabled(config)
  const localHttpModels = localOnly
    ? new Set([
        ...localProvidersOf(config),
        ...httpProvidersOf(config, false),
      ].map((provider) => `${provider.name}/${provider.model}`))
    : undefined
  const allowed = (pair) =>
    !localOnly ||
    (pair && pair.provider === 'vision-http' && localHttpModels.has(pair.model))
```

</details>

**依据 6 · 源码核查**：[src/lib/core-primitives.js:2105-2120](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/lib/core-primitives.js#L2105-L2120)

本地模式不追加内置远端默认项。

<details>
<summary>查看原文（16行）</summary>

```text
export function httpProvidersOf(config, allowDefault = true) {
  const configured = Array.isArray(config.httpProviders)
    ? config.httpProviders.filter(
        (p) => p && typeof p.baseURL === 'string' && typeof p.model === 'string',
      )
    : []
  if (localOnlyVisionEnabled(config)) {
    return configured.filter((provider) => isLoopbackVisionBaseURL(provider.baseURL))
  }
  if (!allowDefault) return configured
  if (configured.length === 0) return DEFAULT_HTTP_PROVIDERS
  const seen = new Set(configured.map((p) => `${p.name}/${p.model}`))
  return [
    ...configured,
    ...DEFAULT_HTTP_PROVIDERS.filter((p) => !seen.has(`${p.name}/${p.model}`)),
  ]
```

</details>

**依据 7 · 源码核查**：[src/lib/vision-backend-runtime-policy.js:198-204](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/lib/vision-backend-runtime-policy.js#L198-L204)

实际工具调用再次按允许的本地模型判断。

```text
export function localOnlyVisionCallAllowed(core, config, provider, model) {
  if (config?.localOnlyVision !== true) return true
  if (provider !== 'vision-http') return false
  const allowed = []
  try { allowed.push(...(core?.localProvidersOf?.(config) ?? [])) } catch {}
  try { allowed.push(...(core?.httpProvidersOf?.(config) ?? [])) } catch {}
  return allowed.some((entry) => `${entry?.name}/${entry?.model}` === model)
```

**依据 8 · 作者声明**：[README.md:222-235](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/README.md#L222-L235)

作者列出数据流并说明结果文本与聊天模型边界。

<details>
<summary>查看原文（14行）</summary>

```text
## Data flow and strict local-only use

Vision Router does not operate fully offline in its default configuration. The exact boundary depends on the operation and the selected models:

| Operation | Where data goes |
|---|---|
| Local pixel tools such as crop, pixel diff, palette, SVG trace, cutout, materialize and HTML screenshot | Processed on the DSH machine; these operations do not call a vision model. |
| `vision_ocr` with Tesseract | Processed on the DSH machine. With the default `auto` engine, an unavailable or empty local OCR result may fall back to a vision model. |
| Image-turn routing and vision-model tools such as describe, detect, ground or vision OCR | The image or derived crop, prompt and relevant context are sent to the selected vision provider. |
| Built-in free fallback | Sent anonymously (no API key) to OVHcloud AI Endpoints at `oai.endpoints.kepler.ai.cloud.ovh.net`; the service still receives the request payload and network metadata such as the source IP. |
| User-configured cloud model / HTTP provider | Sent to that provider's configured endpoint under its own retention and privacy terms. |
| Local Ollama / LM Studio | Image pixels are sent to the configured local endpoint. The resulting text still returns to the current chat model, which may itself be remote. |

To stop **Vision Router itself** from sending image data to remote vision endpoints, enable **Settings → Vision Router → General → Local-only vision**. This is a runtime policy, not a destructive rewrite: saved cloud rows and `freeFallback` stay configured but cannot execute while the switch is on. Only loopback visual endpoints (`localhost`, `127.0.0.0/8`, `::1`) are eligible, including Ollama, LM Studio, and custom local HTTP backends. For a **strict local-only workflow**, also use a local chat model because vision result text still returns to the current chat model. Test the final network boundary in your own environment; Vision Router cannot make a remote chat model, proxy or Host integration local.
```

</details>

**依据 9 · 源码核查**：[src/index.js:4926-4938](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L4926-L4938)

屏幕捕获需显式启用才进入工具集。

<details>
<summary>查看原文（13行）</summary>

```text
    // Desktop capture implementation lives behind the existing Core/tool
    // exposure boundary. Core still decides whether the candidate enters the
    // deep-tool set; LocalVisionStabilizer owns live schema mounting.
    if (current().desktopScreenshot === true) {
      deepToolDefs.push(createDesktopScreenshotTool({
        current,
        timeoutMs,
        saveArtifact,
        stringOutput,
        instantLocalStyle,
        providerTransport,
      }))
    }
```

</details>

#### 缺口

- 未验证实际代理、原生模型、环回后端的网络拓扑。
  **影响**：本地 URL 过滤无法证明整个任务没有数据出站。
  **进一步探讨**：用非敏感合成图对比默认链、仅本地加远端聊天、全本地三种配置的应用请求和代理出站。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何对一次合格截图审查估算代价，什么人适合试用 3.2.0？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

适合已有兼容 DSH Web、反复需要截图对照且能先使用非敏感样例的个人开发者。固定清单要求 Node 至少 24.9 和 DSH 至少 0.2.1-rc.5、低于 0.3.0-0。启动要求 Cordis effect，外层绑定视觉传输释放，调用宿主入口后才附加兼容包装。安装的 patch 给 Connection 增加启动注入顺序，不接管其信任名单，且有 attachment-local 的规范化上限配置。sharp 是可选依赖，但像素差分功能使用它。单次合格任务至少包含打开两张可比图、得出与截图相符的差分、人工核对热点和明确是否通过。缓存可以省掉同问题的再次视觉推理，首轮仍可能产生多次远端请求，收费或免费额度依赖部署而未知。大图代码可分流读取并对热图做有界预览，输出比率和可视化预览有不同精度。升级已有环境时，作者提供只读预检并要求备份、用目标 Host 单独读验历史会话、保留旧配置；预检通过不能替代真实数据恢复。发现原图尺寸、差分目标、上传目的地或宿主状态不一致，就在测试配置停用插件并回原生查看或人工比较。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:38-41](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/package.json#L38-L41)

声明 Node 与 DSH 版本范围。

```text
  "engines": {
    "node": ">=24.9.0",
    "dsh": ">=0.2.1-rc.5 <0.3.0-0"
  },
```

**依据 2 · 源码核查**：[package.json:63-74](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/package.json#L63-L74)

sharp 以及 DSH LLM peer 的可选关系。

<details>
<summary>查看原文（12行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-llm-deepseek": ">=0.2.1-rc.5 <0.3.0-0",
    "sharp": ">=0.35.3 <1"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-llm-deepseek": {
      "optional": true
    },
    "sharp": {
      "optional": true
    }
  },
```

</details>

**依据 3 · 源码核查**：[src/lib/public-entry.js:36-45](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/lib/public-entry.js#L36-L45)

入口拒绝没有 lifecycle effect 的宿主。

<details>
<summary>查看原文（10行）</summary>

```text
export function apply(ctx, config = {}) {
  // Cordis effect() is a required plugin-fiber primitive across the entire
  // supported DSH window, not an optional capability. Refuse malformed/partial
  // Hosts before any DVR route, wrapper, transport, watcher or global mutation
  // can be published without a lifecycle owner.
  let effect
  try { effect = ctx?.effect } catch (error) { throw error }
  if (typeof effect !== 'function') {
    throw new TypeError('vision-router requires a Cordis lifecycle context with effect()')
  }
```

</details>

**依据 4 · 源码核查**：[src/lib/public-entry.js:65-89](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/lib/public-entry.js#L65-L89)

创建视觉传输、绑定释放与初始化失败回收。

<details>
<summary>查看原文（25行）</summary>

```text
  const transport = createVisionProviderTransport({
    ctx: hardening.ctx,
    config: () => liveVisionConfig(hardening.ctx, config),
  })
  let transportReleased = false
  let transportReleasePromise
  const releaseTransport = () => {
    if (transportReleasePromise) return transportReleasePromise
    if (transportReleased) return Promise.resolve()
    transportReleased = true
    transportReleasePromise = Promise.resolve().then(() => transport.dispose())
    return transportReleasePromise
  }
  try {
    runtimeCtx.effect(
      () => releaseTransport,
      'vision-router: provider transport',
    )
    const result = base.apply(runtimeCtx, hardening.config, { providerTransport: transport })
    installLegacyGlobalProxyBoundary(runtimeCtx, hardening.config)
    hardening.installClientBoundary()
    return result
  } catch (error) {
    void releaseTransport().catch(() => {})
    throw error
```

</details>

**依据 5 · 源码核查**：[cordis.patch.yml:22-31](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/cordis.patch.yml#L22-L31)

Connection 只调整依赖启动顺序。

<details>
<summary>查看原文（10行）</summary>

```text
# The supported DSH Web Connection owns trustedHosts and authorization, but its
# generic connection.rpc.handle() registers a WebServer route from its provider
# Fiber. In 0.2.1-rc.5 / 0.2.2-rc.1 that Fiber does not explicitly inject
# webServer, so foreign plugins' RPC endpoints can fall through to the static
# GET/HEAD resource handler (HTTP 405). Retain ONLY the official webServer
# activation dependency; never replace the native Connection config/trust list.
# Verified by real Windows multi-plugin RPC red/green, #807.
- id: connection
  name: '@deepseek-ai/dsh-client-connection'
  inject: [webStartup, webServer]
```

</details>

**依据 6 · 源码核查**：[cordis.patch.yml:80-87](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/cordis.patch.yml#L80-L87)

附件规范化大小、像素和长边上限。

```text
- id: attachment-local
  config:
    maxImageBytes: 20971520
    maxImagePixels: 100000000
    maxImageDimension: 10000
    normalizedImageMaxBytes: 20971520
    normalizedImageMaxPixels: 100000000
    normalizedImageMaxDimension: 10000
```

**依据 7 · 源码核查**：[src/index.js:4254-4272](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L4254-L4272)

大图分流计算后额外生成受限热图预览。

<details>
<summary>查看原文（19行）</summary>

```text
              .resize(width, height, { fit: 'fill' })
              .ensureAlpha()
              .raw()
            diff = await compareRgbaStreams(originalStream, rebuiltStream, { width, height, threshold })
          } finally {
            release()
          }

          // The report stays exact, while the visual heatmap is intentionally
          // bounded. Build it from a <=4MP representation instead of allocating
          // another 100MP RGBA heatmap just for display.
          const preview = scaledDimensions(width, height, 4_000_000)
          heatmapWidth = preview.width
          heatmapHeight = preview.height
          heatmapPreview = true
          const releasePreview = await defaultImageResourceGovernor.acquire(
            estimateImageOperationBytes('preview', width, height),
            { exclusive: true },
          )
```

</details>

**依据 8 · 源码核查**：[src/index.js:3004-3014](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L3004-L3014)

缓存命中减少再调用，绑定问题和候选。

<details>
<summary>查看原文（11行）</summary>

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
        }
```

</details>

**依据 9 · 作者声明**：[docs/releases/v3.2.0.md:19-30](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/docs/releases/v3.2.0.md#L19-L30)

作者声明升级预检与历史数据手工验收边界。

<details>
<summary>查看原文（12行）</summary>

```text
## Upgrading an existing installation / 已有安装升级

1. Confirm Node >=24.9.0 and the actual DSH Host version meets the new floor. Prefer an exact-tested Host; do not assume untested 0.2.x releases have equivalent behavior.
2. Run the **read-only** `doctor --upgrade-preflight` before upgrading. It rejects known legacy Connection overlays, private readiness bridges, floating GitHub-version references and older Node; a pass does **not** guarantee complete historical data compatibility.
3. Back up profile, Settings, image/attachment state and historical Session records; separately read-validate the copied records with the **target** DSH Host before changing a working profile. User-owned custom patches require manual review. Do not edit or normalize the live Session event log.
4. Keep the prior known-good DVR 3.1.5 / Host environment available for rollback if real startup, Vision, Desktop reload, or data restoration fails. No automatic profile or Session migration/deletion is performed by this release.

## Known boundaries / 已知边界

- Older DSH persistence formats, including released v0 `permission/preset.origin` and older `subagent/descriptor` records, can fail in particular Host readers. This is an upstream Host migration issue, not a DVR-owned session rewrite. Do not promise a universally lossless upgrade.
- The separate upstream DSH stale-Fiber/HMR defect remains open; the DVR-specific reload/404 trigger is mitigated, not the entire Host lifecycle issue. The original reported Windows raw JS/CSS screenshot and certain user-field failures have not been conclusively attributed to DVR.
- Non-loopback network, reverse proxy, untested custom profiles and future DSH releases are not universally certified by loopback CI. The default cloud Vision fallback sends image content to remote providers unless strictly local-only is configured.
```

</details>

#### 缺口

- 没有该宿主版本下的渲染验收、耗时数据、收费证据或历史会话兼容记录。
  **影响**：试用可限定在新 profile，无法判断持续部署成本及旧环境能否升级。
  **进一步探讨**：在隔离 profile 对照原生查看、插件对照及退出恢复，分别记时和记录调用次数，另对备份 Session 做目标宿主只读验证。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否用可见的尝试记录和人工标注，提高视觉路由的可核对性？

**研究主题**：新假设与验证

#### 完整回答

可检验方向是让用户知道某张图的哪次尝试已进入发送路径，哪次只做了能力检查，以及取消后哪些远端结果未知。当前日志记录失败目标和阶段，结构化失败给出尝试结果，但成功时通常返回文字或 JSON，未见在本工具结果中把之前的失败与这次成功一起列出。可在隔离环境做脱敏收据原型，保存目标类别、图片份数、是否远端和发送状态而不记图像或提示内容。把不同目标的回退策略与同一视觉任务的人类标注绑定，比较收据是否帮助操作者分辨本地与云端，以及发现了多少错误热点或伪成功。模型故障时也可利用已有的本地 OCR 或内容寻址副本对照，但副本另占存储并需要清理边界。若加收据后用户对出站判断无改善，或误把开始发送理解成对方已计费且增加确认时间，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:3159-3168](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L3159-L3168)

成功路径立即返回内容，空内容不能作为成功。

<details>
<summary>查看原文（10行）</summary>

```text
            if (text !== '') {
              if (cacheEnabled()) cache.set(key, text)
              return text
            }
            // A successfully transported but empty answer is not visual evidence.
            // In particular, reasoning models can exhaust their output budget
            // before emitting any content. Never cache a fabricated success or
            // suppress a healthy later backend in the configured chain.
            const empty = new Error('vision_describe backend returned empty content')
            empty.code = 'EMPTY_RESPONSE'
```

</details>

**依据 2 · 源码核查**：[src/index.js:3175-3193](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L3175-L3193)

失败路径有类别、目标与时长诊断。

<details>
<summary>查看原文（19行）</summary>

```text
            const classification = classifyVisionFailure(error)
            consecutiveServerFailures = classification.kind === VISION_FAILURE_KINDS.SERVER
              ? consecutiveServerFailures + 1 : 0
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

**依据 3 · 源码核查**：[src/index.js:3353-3369](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L3353-L3369)

最终失败带尝试和本地降级提示。

<details>
<summary>查看原文（17行）</summary>

```text
        const failure = await visionFailureResult(
          scope,
          attempted.length > 0 ? attempted : errors.map((text) => ({ backend: 'configured', kind: 'NO_ADAPTER', error: text })),
          reason,
        )
        const baseFailure = attempted.length > 0
          ? failure
          : { ...failure, code: VISION_RESULT_CODES.UNSUPPORTED_BACKEND }
        if (materializableAttachmentIds.length > 0) {
          baseFailure.degradedAccess = {
            tool: 'vision_materialize',
            attachmentIds: materializableAttachmentIds,
            advice:
              'For text transcription, call vision_ocr with {"image":"<attachment id>","engine":"tesseract"}; vision_ocr accepts uploaded attachment ids directly. Use vision_materialize only when a separate non-Vision-Router local parser genuinely requires a filesystem path. Do not guess a filename or the attachment store path.',
          }
        }
        return JSON.stringify(baseFailure)
```

</details>

**依据 4 · 源码核查**：[src/index.js:3603-3634](https://github.com/ysr666/dsh-vision-router/blob/020d0a57f36e5b2c4dd20e477c065faa1918f946/src/index.js#L3603-L3634)

本地降级写内容寻址工作区副本并返回路径。

<details>
<summary>查看原文（32行）</summary>

```text
        const { bytes, mediaType } = await readImageBytes(exec, source)
        const extension = mediaType === 'image/jpeg'
          ? 'jpg'
          : mediaType === 'image/webp'
            ? 'webp'
            : mediaType === 'image/gif'
              ? 'gif'
              : 'png'
        const fingerprint = createHash('sha256').update(bytes).digest('hex').slice(0, 20)
        const relativeArtifactPath = path.join('materialized', `${fingerprint}.${extension}`)
        const artifactName = path.basename(relativeArtifactPath)
        const target = await savePersistentArtifact(exec, relativeArtifactPath, bytes)
        const workspaceRelativePath = path.join(
          normalizeArtifactsDir(artifactsRel),
          ARTIFACT_RUNS_DIR,
          ARTIFACT_HANDOFF_RUN_ID,
          relativeArtifactPath,
        ).split(path.sep).join('/')
        if (session) {
          visionTurnMemory.recordDerivedArtifact(
            visionScopeOf(session),
            visionEvidenceSourceKey(source),
            artifactName,
          )
        }
        return JSON.stringify({
          path: target,
          workspaceRelativePath,
          mediaType,
          bytes: bytes.length,
          ...(isAttachmentIdInput(source) ? { source } : {}),
          safeWorkspaceCopy: true,
```

</details>

#### 缺口

- 收据未实现，也没有用户判断对照。
  **影响**：不能认为能减少漏报、泄露或费用。
  **进一步探讨**：对同一批受控失败与合成截图做随机顺序对照，记录出站分类正确率、过度信任率和核对时长。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
