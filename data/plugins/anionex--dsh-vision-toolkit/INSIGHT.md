# DSH Vision Toolkit

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[864968a](https://github.com/Anionex/dsh-vision-toolkit/tree/864968a84007e15400429bc9fb46a415500ddfc3)

<!-- BEGIN META -->
[![GitHub ★ 907](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=907&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/dsh-vision-toolkit) [![npm 30d 10,773](https://img.shields.io/static/v1?label=npm+30d&message=10%2C773&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit)
<!-- END META -->

> **实现功能**：在DSH会话中接入图像问答、OCR、定位、截图差异和视觉产物。

> **核心亮点**：[Q02](#research-q02)支持上游视觉执行与DSH会话、设置和Artifacts的整合；按Agent激活有明确增量，不将视觉推理本身计为新贡献。

> **风险与缺陷**：[Q03](#research-q03)服务和接口就绪不能证明定位准确；错误坐标直接驱动动作会放大影响，建议保留人工核对。

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
  - [Q01 · 文字模型如何处理截图任务，什么结果才合格？](#detail-section-11)
  - [Q02 · 如何将上游视觉工具连入Agent而不向所有Agent暴露？](#detail-section-12)
  - [Q03 · 服务失败或路径错误是否仍会暴露虚假可用能力？](#detail-section-13)
  - [Q04 · 首次部署、持续调用和失败恢复各由谁付出什么？](#detail-section-14)
  - [Q05 · 能否用可核查视觉证据约束后续动作？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合使用文字模型的DSH开发者检查截图错误、界面位置和视觉差异。原办法是把图转到另一个视觉模型，再手工复制描述或坐标回来；本插件把上传、定位和Artifacts返回连入同一会话。合格结果是能追溯到输入图的文本证据或坐标，并由用户核对相应区域，而不是模型自称看见了。已有原生多模态模型或只做偶发看图的人，转接价值较小。作者长期使用和首创表述未作为独立需求证明。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 图像定位 | 返回目标框和图尺寸 | 需视觉模型；坐标准确率未测 |
| 图像处理 | 裁剪和像素差异 | 输出须在允许路径 |
| 会话接入 | 按需激活视觉工具 | 需相应宿主服务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/skills/subprocess/settings | 必需 | 注册与运行 | 不暴露工具 |
| Python与上游运行时 | 必需 | 执行视觉操作 | 设置仍可修复 |
| 视觉provider与凭据 | 远端操作必需 | 推理 | 报凭据/服务错误 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户装入正确profile并配置provider | Runtime ready |
| 2 | Agent加载Skill并执行小图任务 | 返回可核对证据 |
| 3 | 用户检查定位与产物 | 不可靠则停止动作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 运行时和本地空间 | 安装、provider配置 | 时长未知 |
| 持续 | 视觉调用与产物存储 | 核对定位/OCR | 金额、频率未知 |
| 失败恢复 | 重试调用 | 排错与输入核对 | 不将免费入口当长期保证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话内视觉操作 | 工具和作用域注册 | 节时与准确率 |
| 失败隔离 | 未就绪不挂载、期限和释放 | 多模型实用可靠性 |

> **思考**：[Q03](#research-q03)服务和接口就绪不能证明定位准确；错误坐标直接驱动动作会放大影响，建议保留人工核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)支持上游视觉执行与DSH会话、设置和Artifacts的整合；按Agent激活有明确增量，不将视觉推理本身计为新贡献。

[Q02](#research-q02)支持上游视觉执行与DSH会话、设置和Artifacts的整合；按Agent激活有明确增量，不将视觉推理本身计为新贡献。

runtime统一期限、路径与staging责任，优于每个工具各管错误；复用时须同步上游协议、宿主服务和存储生命周期。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)服务和接口就绪不能证明定位准确；错误坐标直接驱动动作会放大影响，建议保留人工核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

使用文字模型的DSH开发者可先拿非敏感截图做定位或差异检查。相比另开视觉工具再搬运结果，插件把图像证据与产物带回同一会话，这项便利有源码支持但节时未实测。若图像不能出网或坐标核对不可靠，就停止自动动作并退回人工或原生应用接口。 依据 [Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有实现为固定源码检查支持；用户收益未实测；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/tools.ts、src/runtime.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮只读固定提交，未执行目标代码或宿主验收；效果、人工耗时及持续采用情况未知。
- 下一步：以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

**分析版本**

- **仓库**：[Anionex/dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit)
- **版本号**：0.1.48（[固定提交 864968a](https://github.com/Anionex/dsh-vision-toolkit/tree/864968a84007e15400429bc9fb46a415500ddfc3)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出原图指纹与动作前状态校验的未验证假设，用变化界面对照误点和额外调用。

以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 26 | 3653 | — | — | 39980 |
| .md | example | 2 | 140 | — | — | 1215 |
| .js | source | 25 | 11923 | 10833 | 1109 | — |
| .mjs | source | 12 | 1024 | 915 | 23 | — |
| .ts | source | 34 | 13967 | 12013 | 1146 | — |
| .tsx | source | 2 | 2439 | 2139 | 151 | — |
| .ts | test | 37 | 13204 | 11955 | 256 | — |
| .tsx | test | 1 | 17 | 12 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/Anionex/dsh-vision-toolkit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/Anionex/dsh-vision-toolkit/issues?q=is%3Aissue+created%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/Anionex/dsh-vision-toolkit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查DSH Vision Toolkit的具体任务增量、关键失败条件与可控采用路径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 文字模型如何处理截图任务，什么结果才合格？

**研究主题**：场景与需求、采用判断

#### 完整回答

适合使用文字模型的DSH开发者检查截图错误、界面位置和视觉差异。原办法是把图转到另一个视觉模型，再手工复制描述或坐标回来；本插件把上传、定位和Artifacts返回连入同一会话。合格结果是能追溯到输入图的文本证据或坐标，并由用户核对相应区域，而不是模型自称看见了。已有原生多模态模型或只做偶发看图的人，转接价值较小。作者长期使用和首创表述未作为独立需求证明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-47](https://github.com/Anionex/dsh-vision-toolkit/blob/864968a84007e15400429bc9fb46a415500ddfc3/README.md#L35-L47)

作者明确区分视觉方法与DSH原生集成层。

<details>
<summary>查看原文（13行）</summary>

```text
## Highlights

- **Paste an image and ask directly.** In DSH Web, pasting an image switches the text-only model to its `(Vision Toolkit)` variant automatically — no manual path copying or model changes. Native thumbnails, session history, and workspace paths stay intact; Web can preview artifacts.
- **One command to install.** After installation, configure a vision provider in **Settings → Vision Toolkit** and start using the tools.
- **Not just a caption — the content that matters.** The model does not produce a generic description; it extracts evidence around the current task, such as “Where is the error?” or “Where is the button?”.
- **A battle-tested visual-task methodology.** The bundled Skill tells the agent what to look at for different visual tasks, which tool to choose, how to proceed, and how to verify the result.

[`agent-vision-toolkit`](https://github.com/Anionex/agent-vision-toolkit) gives an agent more than image captions: it can read, locate, crop, trace, rebuild, and verify visual work. DSH Vision Toolkit is its native DeepSeek Harness integration, bringing that workflow into Web and Headless Profiles.

This project has two layers:

1. **Visual tools and a Skill:** the agent learns when to inspect, ground, OCR, crop, trace, or compare pixels.
2. **Native DSH integration:** those capabilities live inside Profiles, sessions, Settings, Artifacts, and the Web UI.
```

</details>

#### 缺口

- 没有同条件任务记录证明减少多少人工转接。
  **影响**：缺少同条件人工转接对照，无法量化这一集成是否节省截图任务办结时间。
  **进一步探讨**：用相同截图与任务比较另开视觉工具和会话内工具，分别记录转接次数、错误与人工核对时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何将上游视觉工具连入Agent而不向所有Agent暴露？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

apply先恢复配置并初始化RuntimeManager，ready后才注册激活工具、vision-skills和作用域工具。工具把session工作区、取消信号及sessionId传给runtime；ground调用locate，把匹配框映射为结构化结果，可生成注释预览。这里贡献是把上游agent-vision-toolkit适配到会话、设置和Artifacts，并以按需暴露减少无关工具，不把上游视觉推理算法认领为DSH适配原创。相对手写Python命令，调用接口、路径约束和结果格式统一；对模型识别准确率没有源码级提升证据。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:80-107](https://github.com/Anionex/dsh-vision-toolkit/blob/864968a84007e15400429bc9fb46a415500ddfc3/src/index.ts#L80-L107)

ready后注册与失败回滚

<details>
<summary>查看原文（28行）</summary>

```text
  const ensureOperational = (): void => {
    if (!manager.ready || operationalDisposers !== undefined) return
    const exposure = new VisionToolExposure(ctx, () => createVisionTools(
      () => manager.current(),
      value => artifacts.presentationMeta(value),
      lifecycle.signal,
    ))
    let activationTool: (() => void) | undefined
    let exposureDisposer: (() => void) | undefined
    let skill: (() => void) | undefined
    try {
      activationTool = ctx.tools.register(exposure.activationTool)
      skill = ctx.skills.register(VISION_SKILLS_SKILL)
      exposureDisposer = exposure.install()
      operationalDisposers = { activationTool, exposure: exposureDisposer, skill }
      const info = manager.current().upstreamVersion
      ctx.logger.info(
        'dsh-vision-toolkit %s ready (upstream %s @ %s, checkout %s)',
        PLUGIN_VERSION,
        info.version,
        info.commit,
        info.path,
      )
    } catch (error) {
      exposureDisposer?.()
      if (skill !== undefined) skill()
      activationTool?.()
      throw error
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:63-88](https://github.com/Anionex/dsh-vision-toolkit/blob/864968a84007e15400429bc9fb46a415500ddfc3/src/tools.ts#L63-L88)

会话上下文传递

<details>
<summary>查看原文（26行）</summary>

```text
/** Resolve the caller workspace exactly like first-party fs/bash tools. */
function sessionWorkspace(exec: ToolRunContext): string {
  return exec.agent?.session.header.cwd ?? process.cwd()
}

/** Stable session key used by the runtime's per-session concurrency gate. */
function sessionId(exec: ToolRunContext): string | undefined {
  const id = exec.agent?.session.header.id
  return id === undefined ? undefined : String(id)
}

/** Runtime call options derived once so exact optional properties stay absent. */
function callOptions(
  exec: ToolRunContext,
  timeoutMs: number | undefined,
  lifecycleSignal: AbortSignal | undefined,
): ToolCallOptions {
  const id = sessionId(exec)
  const scope = exec.agent?.session
  return {
    signal: lifecycleSignal === undefined ? exec.signal : AbortSignal.any([exec.signal, lifecycleSignal]),
    workspace: sessionWorkspace(exec),
    ...(timeoutMs === undefined ? {} : { timeoutMs }),
    ...(id === undefined ? {} : { sessionId: id }),
    ...(scope === undefined ? {} : { sessionScope: scope }),
  }
```

</details>

**依据 3 · 源码核查**：[src/runtime.ts:1396-1411](https://github.com/Anionex/dsh-vision-toolkit/blob/864968a84007e15400429bc9fb46a415500ddfc3/src/runtime.ts#L1396-L1411)

定位结果与可选预览

<details>
<summary>查看原文（16行）</summary>

```text
  async ground(request: LocatePreviewRequest, options: ToolCallOptions): Promise<GroundResult> {
    return this.runOperation('vision_ground', options, async (operation) => {
      const { image, elements } = await this.locate(request, options, operation, 'ground')
      const labeled = elements.map(element => ({ label: element.label ?? request.target, box: element.box }))
      const preview = request.preview === true
        ? await this.annotateLocations('vision_ground', image, labeled, request.previewOutput, await this.pathPolicy(options.workspace), operation)
        : undefined
      return {
        target: request.target,
        image,
        imageWidth: image.width,
        imageHeight: image.height,
        matches: labeled,
        ...(preview === undefined ? {} : { preview }),
      }
    })
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 服务失败或路径错误是否仍会暴露虚假可用能力？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

启动初始化失败会记录runtime not ready，并不注册Skill和视觉工具，设置界面仍保留用于修复。操作另设排队期限和执行期限，取消后释放信号量，故单个调用不能无限占用队列。其关键限制是视觉服务可达不等于模型能正确处理图像，工具有稳定接口也不能消除识别错误；需要视觉provider、相应凭据和上游运行时，HTML截图还涉及浏览器。路径和staging模块是值得复用的边界层，但本轮未完整审计所有文件写入路径。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:111-127](https://github.com/Anionex/dsh-vision-toolkit/blob/864968a84007e15400429bc9fb46a415500ddfc3/src/index.ts#L111-L127)

准备失败不暴露执行工具

<details>
<summary>查看原文（17行）</summary>

```text
  const initialConfig = await storageHistory.restore(settings.get())
  try {
    await manager.initialize(initialConfig, candidate => persistStorageHistory(candidate.config, false))
    ensureOperational()
  } catch (error) {
    const resolvedInitial = resolveConfig(initialConfig)
    if (resolvedInitial.storageDir === undefined
      || manager.validatedStorageDirectory() === resolvedInitial.storageDir) {
      await persistStorageHistory(initialConfig, false)
    }
    const message = error instanceof Error ? error.message : String(error)
    ctx.logger.error(
      'dsh-vision-toolkit %s: runtime not ready; the vision-skills skill, activation bootstrap, and Agent-scoped visual tools are NOT registered. Settings remain available for repair. %s',
      PLUGIN_VERSION,
      message,
    )
  }
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:800-881](https://github.com/Anionex/dsh-vision-toolkit/blob/864968a84007e15400429bc9fb46a415500ddfc3/src/runtime.ts#L800-L881)

分阶段期限和finally释放

<details>
<summary>查看原文（82行）</summary>

```text
    const timeoutMs = this.timeout(options)
    const semaphore = this.semaphore(options)
    const metrics: OperationMetrics = {
      startedAt: Date.now(),
      queueMs: 0,
      upstreamMs: 0,
      imageBytes: 0,
      imagePixels: 0,
      imageCount: 0,
      cacheHits: 0,
      usedVisionService: false,
    }
    let acquired = false
    const queueDeadline = createDeadline(options.signal, timeoutMs)
    try {
      await semaphore.value.acquire(queueDeadline.signal, permits)
      acquired = true
      if (queueDeadline.signal.aborted) throw this.operationError(tool, undefined, queueDeadline, 'queue')
      metrics.queueMs = Date.now() - metrics.startedAt
    } catch (error) {
      metrics.queueMs = Date.now() - metrics.startedAt
      const classified = this.operationError(tool, error, queueDeadline, 'queue')
      if (acquired) {
        semaphore.value.release(permits)
        acquired = false
      }
      this.ctx.logger.warn(
        'dsh-vision-toolkit tool=%s outcome=error category=%s totalMs=%d queueMs=%d upstreamMs=%d images=%d imageBytes=%d imagePixels=%d cacheHits=%d',
        tool,
        classified.code,
        Date.now() - metrics.startedAt,
        metrics.queueMs,
        metrics.upstreamMs,
        metrics.imageCount,
        metrics.imageBytes,
        metrics.imagePixels,
        metrics.cacheHits,
      )
      throw classified
    } finally {
      queueDeadline.cleanup()
      if (!acquired && semaphore.value.idle) this.semaphores.delete(semaphore.key)
    }

    const executionDeadline = createDeadline(options.signal, timeoutMs)
    try {
      if (executionDeadline.signal.aborted) throw this.operationError(tool, undefined, executionDeadline)
      const value = await action({ signal: executionDeadline.signal, metrics, operationKey: semaphore.key })
      if (executionDeadline.signal.aborted) throw this.operationError(tool, undefined, executionDeadline)
      this.ctx.logger.info(
        'dsh-vision-toolkit tool=%s outcome=ok totalMs=%d queueMs=%d upstreamMs=%d images=%d imageBytes=%d imagePixels=%d cacheHits=%d model=%s',
        tool,
        Date.now() - metrics.startedAt,
        metrics.queueMs,
        metrics.upstreamMs,
        metrics.imageCount,
        metrics.imageBytes,
        metrics.imagePixels,
        metrics.cacheHits,
        metrics.usedVisionService ? this.config.provider.model : 'local',
      )
      return value
    } catch (error) {
      const classified = this.operationError(tool, error, executionDeadline)
      this.ctx.logger.warn(
        'dsh-vision-toolkit tool=%s outcome=error category=%s totalMs=%d queueMs=%d upstreamMs=%d images=%d imageBytes=%d imagePixels=%d cacheHits=%d',
        tool,
        classified.code,
        Date.now() - metrics.startedAt,
        metrics.queueMs,
        metrics.upstreamMs,
        metrics.imageCount,
        metrics.imageBytes,
        metrics.imagePixels,
        metrics.cacheHits,
      )
      throw classified
    } finally {
      if (acquired) semaphore.value.release(permits)
      executionDeadline.cleanup()
      if (semaphore.value.idle) this.semaphores.delete(semaphore.key)
    }
```

</details>

**依据 3 · 源码核查**：[src/runtime.ts:884-892](https://github.com/Anionex/dsh-vision-toolkit/blob/864968a84007e15400429bc9fb46a415500ddfc3/src/runtime.ts#L884-L892)

远端凭据解析

```text
  /** Resolve the configured credential at the remote-operation boundary. */
  async resolveVisionEnv(): Promise<UpstreamEnvironment> {
    const resolved: ResolvedCredential | undefined = isBuiltInFreeVisionProvider(this.config.provider)
      ? { value: BUILT_IN_FREE_VISION_KEY, source: 'built-in' }
      : await resolveVisionCredential(this.ctx, this.config.provider.credential)
    if (resolved === undefined) {
      throw new VisionToolkitError(
        'config',
        `credential ${this.config.provider.credential} is not configured; set it through DSH credentials`,
```

#### 缺口

- 不同模型对坐标和OCR的错误覆盖未知。
  **影响**：错误定位可能让后续动作瞄错目标。
  **进一步探讨**：固定模型与图像集，检查标注坐标、长图切块和异常返回。
- 路径与staging的所有写入链尚未完整审计。
  **影响**：无法给出完整文件边界保证。
  **进一步探讨**：沿paths.ts和commitStagedOutput/Directory核对realpath、symlink、目标覆盖与中途失败，并构造逃逸案例核验。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次部署、持续调用和失败恢复各由谁付出什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次用户需装入正确profile、配置视觉provider并满足Python/运行时条件；持续任务消耗远端视觉调用、图像处理与产物存储，金额和耗时未量化。失败需区分排队超时与执行失败，用户重新观察输入和残留产物后再重试。相对人工换工具，能够减少会话间搬运，但识别结果仍须复核，不能把现成免费服务当长期零成本保证。适合在非敏感截图小任务中试用，涉及不能出网图像或依赖精确坐标自动执行时应退回人工/原生接口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:37-50](https://github.com/Anionex/dsh-vision-toolkit/blob/864968a84007e15400429bc9fb46a415500ddfc3/README.md#L37-L50)

安装和配置路径

<details>
<summary>查看原文（14行）</summary>

````text
- **Paste an image and ask directly.** In DSH Web, pasting an image switches the text-only model to its `(Vision Toolkit)` variant automatically — no manual path copying or model changes. Native thumbnails, session history, and workspace paths stay intact; Web can preview artifacts.
- **One command to install.** After installation, configure a vision provider in **Settings → Vision Toolkit** and start using the tools.
- **Not just a caption — the content that matters.** The model does not produce a generic description; it extracts evidence around the current task, such as “Where is the error?” or “Where is the button?”.
- **A battle-tested visual-task methodology.** The bundled Skill tells the agent what to look at for different visual tasks, which tool to choose, how to proceed, and how to verify the result.

[`agent-vision-toolkit`](https://github.com/Anionex/agent-vision-toolkit) gives an agent more than image captions: it can read, locate, crop, trace, rebuild, and verify visual work. DSH Vision Toolkit is its native DeepSeek Harness integration, bringing that workflow into Web and Headless Profiles.

This project has two layers:

1. **Visual tools and a Skill:** the agent learns when to inspect, ground, OCR, crop, trace, or compare pixels.
2. **Native DSH integration:** those capabilities live inside Profiles, sessions, Settings, Artifacts, and the Web UI.

```sh
dsh plugin --profile web add @anionex/dsh-vision-toolkit
````

</details>

**依据 2 · 源码核查**：[src/runtime.ts:800-881](https://github.com/Anionex/dsh-vision-toolkit/blob/864968a84007e15400429bc9fb46a415500ddfc3/src/runtime.ts#L800-L881)

失败分类与资源释放

<details>
<summary>查看原文（82行）</summary>

```text
    const timeoutMs = this.timeout(options)
    const semaphore = this.semaphore(options)
    const metrics: OperationMetrics = {
      startedAt: Date.now(),
      queueMs: 0,
      upstreamMs: 0,
      imageBytes: 0,
      imagePixels: 0,
      imageCount: 0,
      cacheHits: 0,
      usedVisionService: false,
    }
    let acquired = false
    const queueDeadline = createDeadline(options.signal, timeoutMs)
    try {
      await semaphore.value.acquire(queueDeadline.signal, permits)
      acquired = true
      if (queueDeadline.signal.aborted) throw this.operationError(tool, undefined, queueDeadline, 'queue')
      metrics.queueMs = Date.now() - metrics.startedAt
    } catch (error) {
      metrics.queueMs = Date.now() - metrics.startedAt
      const classified = this.operationError(tool, error, queueDeadline, 'queue')
      if (acquired) {
        semaphore.value.release(permits)
        acquired = false
      }
      this.ctx.logger.warn(
        'dsh-vision-toolkit tool=%s outcome=error category=%s totalMs=%d queueMs=%d upstreamMs=%d images=%d imageBytes=%d imagePixels=%d cacheHits=%d',
        tool,
        classified.code,
        Date.now() - metrics.startedAt,
        metrics.queueMs,
        metrics.upstreamMs,
        metrics.imageCount,
        metrics.imageBytes,
        metrics.imagePixels,
        metrics.cacheHits,
      )
      throw classified
    } finally {
      queueDeadline.cleanup()
      if (!acquired && semaphore.value.idle) this.semaphores.delete(semaphore.key)
    }

    const executionDeadline = createDeadline(options.signal, timeoutMs)
    try {
      if (executionDeadline.signal.aborted) throw this.operationError(tool, undefined, executionDeadline)
      const value = await action({ signal: executionDeadline.signal, metrics, operationKey: semaphore.key })
      if (executionDeadline.signal.aborted) throw this.operationError(tool, undefined, executionDeadline)
      this.ctx.logger.info(
        'dsh-vision-toolkit tool=%s outcome=ok totalMs=%d queueMs=%d upstreamMs=%d images=%d imageBytes=%d imagePixels=%d cacheHits=%d model=%s',
        tool,
        Date.now() - metrics.startedAt,
        metrics.queueMs,
        metrics.upstreamMs,
        metrics.imageCount,
        metrics.imageBytes,
        metrics.imagePixels,
        metrics.cacheHits,
        metrics.usedVisionService ? this.config.provider.model : 'local',
      )
      return value
    } catch (error) {
      const classified = this.operationError(tool, error, executionDeadline)
      this.ctx.logger.warn(
        'dsh-vision-toolkit tool=%s outcome=error category=%s totalMs=%d queueMs=%d upstreamMs=%d images=%d imageBytes=%d imagePixels=%d cacheHits=%d',
        tool,
        classified.code,
        Date.now() - metrics.startedAt,
        metrics.queueMs,
        metrics.upstreamMs,
        metrics.imageCount,
        metrics.imageBytes,
        metrics.imagePixels,
        metrics.cacheHits,
      )
      throw classified
    } finally {
      if (acquired) semaphore.value.release(permits)
      executionDeadline.cleanup()
      if (semaphore.value.idle) this.semaphores.delete(semaphore.key)
    }
```

</details>

#### 缺口

- 单个合格截图任务的调用量、重试率与人工核对时间未知。
  **影响**：缺少按合格任务计算的provider支出与重试投入，不能判断持续使用经济性。
  **进一步探讨**：固定模型、同一截图集和验收标准，分别计量成功与失败调用、费用及人工复核。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否用可核查视觉证据约束后续动作？

**研究主题**：新假设与验证

#### 完整回答

由ground已返回图尺寸、匹配框和可选注释预览，推导一个未验证假设：将原图摘要和定位结果绑定，再要求后续动作先确认截图仍对应当前界面，可能减少坐标过期误用。增量是证据到动作的时效约束，而非再加一个看图入口。可取同一组会变化的界面，对照直接使用旧坐标与重新校验后使用，记录误点和重复视觉调用成本；若误点未下降或核对代价高于人工操作，就否定此方向。现有定位返回值不代表已经实现动作状态绑定。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime.ts:1396-1411](https://github.com/Anionex/dsh-vision-toolkit/blob/864968a84007e15400429bc9fb46a415500ddfc3/src/runtime.ts#L1396-L1411)

结构化坐标可作为绑定输入，尚不包含动作验收

<details>
<summary>查看原文（16行）</summary>

```text
  async ground(request: LocatePreviewRequest, options: ToolCallOptions): Promise<GroundResult> {
    return this.runOperation('vision_ground', options, async (operation) => {
      const { image, elements } = await this.locate(request, options, operation, 'ground')
      const labeled = elements.map(element => ({ label: element.label ?? request.target, box: element.box }))
      const preview = request.preview === true
        ? await this.annotateLocations('vision_ground', image, labeled, request.previewOutput, await this.pathPolicy(options.workspace), operation)
        : undefined
      return {
        target: request.target,
        image,
        imageWidth: image.width,
        imageHeight: image.height,
        matches: labeled,
        ...(preview === undefined ? {} : { preview }),
      }
    })
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
