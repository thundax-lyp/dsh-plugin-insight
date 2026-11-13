# DSH Vision Toolkit

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[41e5f3d](https://github.com/Anionex/dsh-vision-toolkit/tree/41e5f3d59fce0d122908864552513f5828024c6c)

<!-- BEGIN META -->
[![GitHub ★ 942](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=942&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/dsh-vision-toolkit) [![npm 30d 16,145](https://img.shields.io/static/v1?label=npm+30d&message=16%2C145&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit)
<!-- END META -->

> **功能**：为 DSH 文本模型提供图像问答、OCR、定位、截图差异和视觉产物。

> **亮点**：按 Agent 激活视觉工具，把检查截图到返回标注接入会话，Python 准备可以与首次发现并行。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：工具可发现时运行时可能仍在准备。远端定位的坐标即使在图像范围内也可能标错对象；Desktop 转发例外依赖宿主认证。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 模型看到 Skill 时，Python 和视觉工具是否已准备好？](#detail-section-11)
  - [Q02 · 从文本模型提交截图定位，到带回坐标和预览，谁承担视觉和准确性？](#detail-section-12)
  - [Q03 · 桌面转发丢失浏览器 Origin 后，设置与粘贴策略接口如何限制请求？](#detail-section-13)
  - [Q04 · 怎样先做只读试用，以及截图内容绑定能否减少过期坐标误用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要从非敏感截图核对位置、文字或界面变化的 DSH 文本模型用户。

用原生多模态或单独视觉工具生成结果，再手工带回当前会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 视觉工具激活 | 在 Agent 会话中发现能力 | 首次执行等待 Python 就绪 |
| 截图定位 | 返回坐标与标注图 | 需授权视觉服务与人工核对 |
| 粘贴策略 | 为适用模型提供视觉证据 | 模型不确定时保留原生路由 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Tools、Skills、Settings 等服务 | 必需 | 激活并配置工具 | Host 无法加载对应能力 |
| 受支持 Python 或固定外部运行时 | 执行必需 | 运行视觉与本地处理 | 等待或显示准备错误 |
| 已授权视觉服务与凭据 | 远端定位必需 | 识别图片内容 | 选择本地非视觉动作或退出 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选隔离 Profile、可写工作区和服务 | 记录首轮准备和版本 |
| 检查 | Agent 激活工具并定位非敏感截图 | 人核对坐标与标注 |
| 处理异常 | 用户检查运行时、网关与许可 | 无法确定时退回人工查看 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 解释器和依赖下载大小未测 | 配置凭据并等运行时 | 冷启动与平台有关 |
| 持续 | 视觉请求、OCR 重试和产物存储 | 人工复核坐标和费用 | 单位合格任务未实测 |
| 退出 | 已发生服务调用不可撤销 | 停用扩展，复核配置和产物 | 已生成文件可能保留 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 文字模型截图定位 | 实际视觉调用与可回读标注 | 坐标准确、需求强度 |
| 首轮可发现 | 激活与 Python 准备分离 | 实际首轮可用时延 |
| 桌面设置 | 请求来源兼容分支 | 目标宿主的认证和兼容 |

> **思考**：工具可发现时运行时可能仍在准备。远端定位的坐标即使在图像范围内也可能标错对象；Desktop 转发例外依赖宿主认证。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：按 Agent 激活视觉工具，把检查截图到返回标注接入会话，Python 准备可以与首次发现并行。[Q01](#research-q01) [Q02](#research-q02)

注册和运行时切换分别处理失败，代次票据防止旧准备盖过新配置。Desktop 例外应联动检查宿主认证。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

工具可发现时运行时可能仍在准备。远端定位的坐标即使在图像范围内也可能标错对象；Desktop 转发例外依赖宿主认证。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离试用优先用单张非敏感截图。逐次检查定位结果、费用和实际请求去向，坐标未经核对时不要用于自动点击。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持按需激活、运行时准备和定位产物。真实宿主、出网与坐标准确性待验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、src/index.ts、src/exposure.ts、src/runtime-manager.ts、src/runtime-install.ts、assets/python-bootstrap.json、src/runtime.ts、src/tools.ts、src/artifact-access.ts、src/image-input-variants.ts、src/client/index.tsx、src/client/paste-images.tsx、src/web-request.ts、src/web.ts、CHANGELOG.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：对比固定提交及旧研究结论，覆盖启动、远端定位、原生路由、产物和 Desktop 控制面。未执行插件、CI、真实宿主或视觉服务。
- 下一步：对照冷/热缓存、无网络、Python 不兼容、Desktop 来源与真值框任务，记录首个合格结果、人工核对和退出成本。

**分析版本**

- **仓库**：[Anionex/dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit)
- **版本号**：0.1.50（[固定提交 41e5f3d](https://github.com/Anionex/dsh-vision-toolkit/tree/41e5f3d59fce0d122908864552513f5828024c6c)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

让下游在消费坐标前比对原图和当前画面指纹，可能减少使用过期定位结果。[Q04](#research-q04)

对照冷/热缓存、无网络、Python 不兼容、Desktop 来源与真值框任务，记录首个合格结果、人工核对和退出成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 28 | 3745 | — | — | 41682 |
| .md | example | 2 | 140 | — | — | 1215 |
| .js | source | 25 | 12070 | 10969 | 1121 | — |
| .mjs | source | 12 | 1024 | 915 | 23 | — |
| .ts | source | 34 | 14107 | 12135 | 1158 | — |
| .tsx | source | 2 | 2441 | 2141 | 151 | — |
| .ts | test | 37 | 13393 | 12134 | 261 | — |
| .tsx | test | 1 | 17 | 12 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/Anionex/dsh-vision-toolkit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=16&color=737b86&logo=github)](https://github.com/Anionex/dsh-vision-toolkit/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 15](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=15&color=737b86&logo=github)](https://github.com/Anionex/dsh-vision-toolkit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用文本模型处理截图时，插件能否可靠地从宿主启动、读图、生成证据，到人工核对坐标和产物？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 模型看到 Skill 时，Python 和视觉工具是否已准备好？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

Host 先绑定 Settings、恢复存储历史并检查随包上游，再启动异步准备，在等待首个运行时代次之前注册 Skill 与激活工具。激活要求当前 Agent，工具注册在该 Agent 的 context；已有激活状态可重入，部分注册失败会撤销。实际视觉操作等 manager.whenReady：调用取消只终止该次等待，卸载会终止生命周期和准备，票据阻止过期代次发布。准备失败保留设置可修复。托管模式选 Python 3.11 到 3.14 的依赖轮子，探测不合格时可下载清单里的 Python 3.13.15；显式配置超界直接报错。外部模式对上游路径和固定提交有额外条件。首轮可发现工具与首轮能完成任务是两个时点。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:78-124](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/index.ts#L78-L124)

激活、Skill 和运行时准备分开，失败后设置保留。

<details>
<summary>查看原文（47行）</summary>

```text
  const ensureOperational = (): void => {
    if (lifecycle.signal.aborted || operationalDisposers !== undefined) return
    const exposure = new VisionToolExposure(ctx, () => createVisionTools(
      signal => manager.whenReady(signal),
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
    } catch (error) {
      exposureDisposer?.()
      if (skill !== undefined) skill()
      activationTool?.()
      throw error
    }
  }

  const initialConfig = await storageHistory.restore(settings.get())
  // Verify the shipped Skill/tool implementation before discovery. Interpreter
  // probing, downloads and installation are cancellable background work.
  await verifyBundledUpstream()
  const preparation = manager.start(initialConfig, candidate => persistStorageHistory(candidate.config, false))
  ensureOperational()
  void preparation.then(() => {
    if (lifecycle.signal.aborted) return
    ensureOperational()
    variants.reconcile()
  }).catch(async error => {
    if (lifecycle.signal.aborted || manager.ready) return
    const resolvedInitial = resolveConfig(initialConfig)
    if (resolvedInitial.storageDir === undefined
      || manager.validatedStorageDirectory() === resolvedInitial.storageDir) {
      await persistStorageHistory(initialConfig, false)
    }
    const message = error instanceof Error ? error.message : String(error)
    ctx.logger.error(
      'dsh-vision-toolkit %s: runtime preparation failed; visual calls report this failure. Settings remain available for repair. %s',
      PLUGIN_VERSION,
      message,
    )
  })
```

</details>

**依据 2 · 源码核查**：[src/exposure.ts:171-192](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/exposure.ts#L171-L192)

激活要求 Agent 并对该 Agent 生效。

<details>
<summary>查看原文（22行）</summary>

```text
    this.activationTool = defineTool({
      name: VISION_TOOLKIT_ACTIVATE,
      description: `Activate the independent Vision Toolkit execution tools for this Agent: ${Object.values(VISION_TOOL_NAMES).join(', ')}. `
        + `Loading the ${VISION_SKILLS_NAME} Skill normally activates them automatically; call this once when the visual tools are still absent, then use them for image understanding, OCR, UI detection, and related tasks. `
        + 'It is safe to call before the Skill is loaded, and this activation tool disappears after success.',
      parameters: {},
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            activated: { type: 'boolean', required: true },
            tools: { type: 'array', items: { type: 'string' }, required: true },
          },
        },
        render: renderJson,
      },
      execute: (_args, exec): Promise<VisionToolkitActivationResult> => {
        if (exec.agent === undefined) {
          throw new Error(`${VISION_TOOLKIT_ACTIVATE}: an Agent Session is required`)
        }
        return Promise.resolve(this.activate(exec.agent))
```

</details>

**依据 3 · 源码核查**：[src/exposure.ts:242-264](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/exposure.ts#L242-L264)

重复激活与工具注册失败回滚。

<details>
<summary>查看原文（23行）</summary>

```text
    this.attach(agent)
    const state = this.states.get(agent)
    /* v8 ignore next -- attach() synchronously creates this exact entry. */
    if (state === undefined) throw new Error(`dsh-vision-toolkit: Agent ${String(agent.id)} has no exposure state`)
    if (state.active) return { activated: false, tools: [...state.toolNames] }

    const definitions = this.createTools()
    const toolDisposers: Array<() => void> = []
    try {
      for (const definition of definitions) toolDisposers.push(agent.ctx.tools.register(definition))
      // A Skill call and the bootstrap can be issued in the same model step.
      // Restricting immediately would turn the still-in-flight bootstrap call
      // into an UNKNOWN_TOOL error, so live sessions hide at step/end.
      if (!this.isLiveSession(agent.session)) this.applyHideActivation(agent)
    } catch (error) {
      for (const dispose of toolDisposers.reverse()) dispose()
      throw error
    }

    state.active = true
    state.toolDisposers = toolDisposers
    state.toolNames = definitions.map(definition => definition.name)
    return { activated: true, tools: [...state.toolNames] }
```

</details>

**依据 4 · 源码核查**：[src/runtime-manager.ts:105-149](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/runtime-manager.ts#L105-L149)

调用等待和生命周期取消分开。

<details>
<summary>查看原文（45行）</summary>

```text
  /** Start preparation without holding up Profile boot. */
  start(raw: VisionToolkitConfig, beforePublish?: RuntimeGenerationBeforePublish): Promise<void> {
    return this.initialize(raw, beforePublish)
  }

  private track<T>(pending: Promise<T>): Promise<T> {
    this.pending = pending
    void pending.catch(() => {})
    return pending
  }

  /** Wait for the first generation; a caller cancellation does not cancel shared preparation. */
  async whenReady(signal?: AbortSignal): Promise<VisionToolkitRuntime> {
    const combined = signal === undefined ? this.lifetime.signal : AbortSignal.any([signal, this.lifetime.signal])
    combined.throwIfAborted()
    if (this.active !== undefined) return this.active.runtime
    let abort!: () => void
    const cancelled = new Promise<never>((_resolve, reject) => {
      abort = () => reject(combined.reason)
      combined.addEventListener('abort', abort, { once: true })
    })
    try {
      while (true) {
        const pending = this.pending
        try {
          await Promise.race([pending, cancelled])
        } catch (error) {
          combined.throwIfAborted()
          if (pending !== this.pending) continue
          throw error
        }
        combined.throwIfAborted()
        if (this.ready) return this.current()
        if (pending === this.pending) return this.current()
      }
    } finally {
      combined.removeEventListener('abort', abort)
    }
  }

  /** Invalidate queued generations and cancel their subprocesses/downloads. */
  dispose(): void {
    this.reconfigureTicket += 1
    this.lifetime.abort()
    this.preparation?.abort()
```

</details>

**依据 5 · 源码核查**：[src/runtime-manager.ts:242-261](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/runtime-manager.ts#L242-L261)

发布前检查重配票据和 abort。

<details>
<summary>查看原文（20行）</summary>

```text
  private async initializeGeneration(raw: VisionToolkitConfig, beforePublish?: RuntimeGenerationBeforePublish): Promise<void> {
    const ticket = ++this.reconfigureTicket
    this.preparation?.abort()
    const controller = this.preparation = new AbortController()
    const signal = AbortSignal.any([controller.signal, this.lifetime.signal])
    try {
      const config = resolveConfig(raw)
      if (config.storageDir !== undefined) await preflightSharedStorageBase(config.storageDir)
      this.validatedStartupStorageDir = config.storageDir ?? null
      this.rememberStorageDirectories(config.storageHistory)
      this.rememberStorageDirectory(config.storageDir)
      const candidate = await this.prepareResolvedCandidate(config, signal)
      if (ticket !== this.reconfigureTicket) return
      await beforePublish?.(candidate)
      signal.throwIfAborted()
      if (ticket !== this.reconfigureTicket) return
      this.activateCandidate(candidate)
    } catch (error) {
      if (ticket === this.reconfigureTicket) this.lastError = messageOf(error)
      throw error
```

</details>

**依据 6 · 源码核查**：[src/runtime-install.ts:839-877](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/runtime-install.ts#L839-L877)

解释器探测、显式不支持报错和内置下载。

<details>
<summary>查看原文（39行）</summary>

```text
  const candidates: RuntimeCommand[] = configured === undefined
    ? process.platform === 'win32'
      ? [
        { program: 'python', prefix: [], display: 'python' },
        { program: 'py', prefix: ['-3'], display: 'py -3' },
        { program: 'python3', prefix: [], display: 'python3' },
      ]
      : [
        { program: 'python3', prefix: [], display: 'python3' },
        { program: 'python', prefix: [], display: 'python' },
      ]
    : [{ program: configured, prefix: [], display: configured }]
  for (const command of candidates) {
    const metadata = await pythonMetadata(ctx, command, cwd)
    if (metadata !== undefined && (metadata.major > 3 || metadata.major === 3 && metadata.minor >= 11)
      && (maximumMinor === undefined || metadata.major === 3 && metadata.minor <= maximumMinor)) {
      return { command, ...metadata }
    }
  }
  if (configured !== undefined) {
    const supported = maximumMinor === undefined ? '3.11 or newer' : `3.11 through 3.${maximumMinor} for the managed runtime`
    throw new VisionToolkitError('runtime', `vision-toolkit requires Python ${supported}: ${configured}`)
  }
  try {
    const stateRoot = visionToolkitStateRoot()
    await mkdir(stateRoot, { recursive: true })
    await garbageCollectRuntimeCache(ctx, stateRoot)
    const bundled = await acquireBundledPython(ctx, stateRoot, cwd, manifestOverride, requestImpl)
    return {
      command: bundled.command,
      version: bundled.version,
      major: Number.parseInt(bundled.version.split('.')[0] ?? '', 10),
      minor: Number.parseInt(bundled.version.split('.')[1] ?? '', 10),
    }
  } catch (error) {
    if (error instanceof VisionToolkitError) throw error
    throw new VisionToolkitError(
      'runtime',
      'vision-toolkit requires Python 3.11 or newer; tried python3, python, and the Windows py launcher, and automatic bundled-Python preparation failed',
```

</details>

**依据 7 · 源码核查**：[src/runtime-install.ts:1090-1105](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/runtime-install.ts#L1090-L1105)

托管模式传入 Python 最高 minor=14，运行时缓存按版本与平台区分。

<details>
<summary>查看原文（16行）</summary>

```text
  await garbageCollectRuntimeCache(ctx, stateRoot)
  const cleanHome = join(stateRoot, 'home')
  await mkdir(cleanHome, { recursive: true })
  // Locked numpy/vtracer wheels currently cover CPython 3.11–3.14. A newer
  // system interpreter must not prevent the bundled supported Python fallback.
  const bootstrap = await resolveBootstrapPython(ctx, config.runtime.python, cleanHome, undefined, undefined, 14)
  const requirements = await readFile(REQUIREMENTS_PATH)
  const requirementsSha256 = sha256(requirements)
  const expectedDependencies = parseLockedDependencies(requirements)
  const runtimeId = [
    manifest.contentSha256.slice(0, 16),
    requirementsSha256.slice(0, 16),
    `py${String(bootstrap.major)}${String(bootstrap.minor)}`,
    process.platform,
    process.arch,
  ].join('-')
```

</details>

**依据 8 · 源码核查**：[assets/python-bootstrap.json:1-5](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/assets/python-bootstrap.json#L1-L5)

内置 Python 清单的版本。

```text
{
  "schemaVersion": 1,
  "pythonVersion": "3.13.15",
  "buildTag": "20260814",
  "mirrorBaseUrl": "https://dsh-vision-python-bootstrap-1317715800.cos.ap-guangzhou.myqcloud.com",
```

**依据 9 · 源码核查**：[src/runtime-install.ts:1333-1360](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/runtime-install.ts#L1333-L1360)

外部模式要求匹配快照或固定且干净的 checkout。

<details>
<summary>查看原文（28行）</summary>

```text
  const exactSnapshot = await externalMatchesBundledSnapshot(root, expected)
  if (exactSnapshot) return
  let head: CommandResult
  try {
    head = await runCollected(ctx, ['git', '-C', root, 'rev-parse', 'HEAD'], root)
  } catch (error) {
    throw new VisionToolkitError(
      'runtime',
      `external agent-vision-toolkit must be the clean pinned commit ${UPSTREAM_COMMIT} or an exact exported snapshot`,
      { cause: error },
    )
  }
  if (head.exitCode !== 0 || head.stdout.trim() !== UPSTREAM_COMMIT) {
    throw new VisionToolkitError('runtime', `external agent-vision-toolkit must be pinned at commit ${UPSTREAM_COMMIT}`)
  }
  const topLevel = await runCollected(ctx, ['git', '-C', root, 'rev-parse', '--show-toplevel'], root)
  let resolvedTopLevel: string | undefined
  try {
    resolvedTopLevel = topLevel.exitCode === 0 ? await realpath(topLevel.stdout.trim()) : undefined
  } catch {
    resolvedTopLevel = undefined
  }
  if (resolvedTopLevel !== root) {
    throw new VisionToolkitError('runtime', 'external agent-vision-toolkit path must be the checkout root')
  }
  const statusResult = await runCollected(ctx, ['git', '-C', root, 'status', '--porcelain=v1', '--untracked-files=all'], root)
  if (statusResult.exitCode !== 0 || statusResult.stdout.trim().length > 0) {
    throw new VisionToolkitError('runtime', 'external agent-vision-toolkit checkout has modified tracked files; use managed mode or a clean pinned checkout')
```

</details>

#### 缺口

- 未验真实 Profile 首轮调用、安装下载或各平台 wheel
  **影响**：不能估算首轮等待或可靠覆盖
  **进一步探讨**：用冷缓存、热缓存、不可用网络和 Python 版本冲突分别记录首个任务与中止

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从文本模型提交截图定位，到带回坐标和预览，谁承担视觉和准确性？

**研究主题**：场景与需求、贡献与相对优势、缺陷与关键质疑、效果与总成本

#### 完整回答

已有原生图像能力时可直接交图，文本模型用户以往要切换到其他视觉工具再复制区域或描述。插件把截图定位接到 DSH 工具和预览：调用时按工作区限制检查原图，远端视觉请求使用配置的模型地址与凭据；上游视觉进程给出结果，插件解析并检查坐标边界，再按选项产生标注图。坐标在图内仍可能标错对象，任何点击前要对照当前画面。产物读取验证 token 签名并检查文件；保有 token 可触发读取，该路径的安全性仍需测试。原生视觉或模型能力不确定时，粘贴判定倾向保留原生路由，模型目录出错也会否决该次接管。接入价值在同一会话定位和检查证据，识别能力及调用费用取决于上游。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime.ts:884-911](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/runtime.ts#L884-L911)

远程操作解析宿主或内置凭据，向上游配置地址与模型。

<details>
<summary>查看原文（28行）</summary>

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
      )
    }
    return this.visionEnv(resolved)
  }

  private visionEnv(resolved: ResolvedCredential): UpstreamEnvironment {
    const sslVerify = process.env.VISION_SSL_VERIFY?.trim()
    return {
      VISION_API_KEY: resolved.value,
      VISION_BASE_URL: this.config.provider.baseUrl,
      VISION_MODEL: this.config.provider.model,
      VISION_API_PROTOCOL: this.config.provider.protocol === 'anthropic'
        ? 'anthropic'
        : this.config.provider.protocol === 'responses'
          ? 'responses'
          : 'chat_completions',
      ...(this.config.provider.protocol === 'responses' && this.config.provider.reasoningEffort !== undefined
        ? { VISION_REASONING_EFFORT: this.config.provider.reasoningEffort }
        : {}),
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:1378-1405](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/runtime.ts#L1378-L1405)

对图像路径和结果坐标校验，实际调用视觉进程并可生成标注。

<details>
<summary>查看原文（28行）</summary>

```text
  ): Promise<{ image: ImageInfo; elements: LocatedElement[] }> {
    if (request.target.trim().length === 0) throw new VisionToolkitError('input', 'target must not be empty')
    if (request.region !== undefined) parseRegion(request.region)
    const policy = await this.pathPolicy(options.workspace)
    const image = await this.validateImage(request.image, policy, operation)
    this.accountImage(image, operation)
    const env = await this.resolveVisionEnv()
    const result = await this.runUpstream(tool, [
      image.path,
      request.target,
      ...(request.region !== undefined ? ['--region', request.region] : []),
    ], operation, env)
    const elements = parseLocationOutput(result.stdout)
    this.validateLocations(elements, image.width, image.height)
    return { image, elements }
  }

  /** ground: locate one named target and return pixel boxes. */
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
```

</details>

**依据 3 · 源码核查**：[src/artifact-access.ts:320-346](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/artifact-access.ts#L320-L346)

签名解析和方法限制。

<details>
<summary>查看原文（27行）</summary>

```text
  verify(token: string): ArtifactTokenPayload | undefined {
    if (token.length === 0 || token.length > MAX_TOKEN_LENGTH || !TOKEN_PATTERN.test(token)) return undefined
    const [encoded, signature] = token.split('.')
    if (encoded === undefined || signature === undefined) return undefined
    let supplied: Buffer
    try {
      supplied = Buffer.from(signature, 'base64url')
    } catch {
      return undefined
    }
    if (!safeEqual(mac(this.key, encoded), supplied)) return undefined
    try {
      return parsePayload(JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')))
    } catch {
      return undefined
    }
  }

  /**
   * Serve one GET/HEAD capability request with MIME, CSP, and symlink checks.
   * @param req - Node HTTP request matched under {@link ARTIFACT_ROUTE_PREFIX}.
   * @param res - response owned by this handler.
   */
  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.setHeader('Allow', 'GET, HEAD')
      res.writeHead(405)
```

</details>

**依据 4 · 源码核查**：[src/artifact-access.ts:372-393](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/artifact-access.ts#L372-L393)

验证 token 和文件后才提供产物。

<details>
<summary>查看原文（22行）</summary>

```text
    const payload = this.verify(token)
    if (payload === undefined) {
      res.writeHead(404)
      res.end()
      return
    }
    const downloadValue = url.searchParams.get('download')
    if ([...url.searchParams.keys()].some(key => key !== 'download') || (downloadValue !== null && downloadValue !== '1')) {
      res.writeHead(400)
      res.end()
      return
    }
    let opened: { handle: FileHandle; info: Stats }
    try {
      opened = await openVerifiedArtifact(payload)
    } catch {
      res.writeHead(404)
      res.end()
      return
    }
    securityHeaders(res, payload, downloadValue === '1')
    res.writeHead(200)
```

</details>

**依据 5 · 源码核查**：[src/image-input-variants.ts:784-819](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/image-input-variants.ts#L784-L819)

不可读路由或图片能力不确认时否决接管。

<details>
<summary>查看原文（36行）</summary>

```text
export async function labelTakeoverVerdict(ctx: Context, label: string): Promise<boolean | undefined> {
  const llm = ctx.get('llm')
  if (llm === undefined) return undefined
  const lowered = label.toLowerCase()
  let matchedTextOnly = false
  for (const provider of llm.listProviders()) {
    let models: readonly LlmModelInfo[]
    try {
      models = await llm.listModels(provider.id)
    } catch (error) {
      // An unreadable route cannot vote — and it is exactly where an
      // image-capable twin could hide (a variant route probes its upstream).
      // A label match on a half-read catalog must not confirm a takeover, so
      // the verdict is vetoed for THIS label; the session header fallback is
      // deliberately not used here because it may still describe a previous
      // model after a switch. Loud, so a broken provider is diagnosable.
      ctx.logger.warn(
        'dsh-vision-toolkit: paste verdict could not read route "%s"; native paste wins for this label. %s',
        provider.id,
        messageOf(error).slice(0, 300),
      )
      return false
    }
    for (const model of models) {
      for (const candidate of [model.name, model.id]) {
        if (typeof candidate !== 'string' || candidate.length === 0) continue
        if (!lowered.includes(candidate.toLowerCase())) continue
        if (!shouldWrapModel(model)) {
          // An image-capable or unconfirmed model in the label keeps its
          // native paste; the variant routes declare image input and are
          // covered by this veto.
          return false
        }
        // Positive confirmation has a floor: one- and two-character names
        // match label prose far too easily to identify the selected model.
        if (candidate.length >= 3) matchedTextOnly = true
```

</details>

**依据 6 · 源码核查**：[src/tools.ts:381-409](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/tools.ts#L381-L409)

本地裁剪调用不需远端凭据。

<details>
<summary>查看原文（29行）</summary>

```text
      description: 'Cut a pixel box into a PNG/JPEG artifact locally, without a vision credential. Boxes are clamped by the pinned upstream tool. '
        + WORKSPACE_NOTE,
      parameters: {
        image: { type: 'string', required: true, description: 'Image path.' },
        region: { type: 'string', required: true, description: REGION_NOTE },
        scale: { type: 'integer', description: 'Upscale 1-8 with LANCZOS.' },
        output: { type: 'string', description: 'Artifact filename; .png/.jpg/.jpeg.' },
        timeoutMs: { type: 'integer', description: TIMEOUT_NOTE },
      },
      output: {
        schema: {
          type: 'object', additionalProperties: false, properties: {
            imageWidth: { type: 'integer', required: true }, imageHeight: { type: 'integer', required: true }, region: requiredBoxSchema,
            outputPath: { type: 'string', required: true }, mimeType: { type: 'string', enum: ['image/png', 'image/jpeg'], required: true },
            width: { type: 'integer', required: true }, height: { type: 'integer', required: true }, clamped: { type: 'boolean', required: true },
            artifact: requiredArtifactSchema, note: { type: 'string' },
          },
        },
        render: renderJson,
        presentationMeta,
      },
      async execute(args: CropArgs, exec) {
        const request: CropRequest = {
          image: args.image, region: args.region,
          ...(args.scale === undefined ? {} : { scale: args.scale }),
          ...(args.output === undefined ? {} : { output: args.output }),
        }
        const options = callOptions(exec, args.timeoutMs, lifecycleSignal)
        return (await runtimeFrom(source, options.signal)).crop(request, options)
```

</details>

#### 缺口

- 定位质量、网络费用及图像出站范围未测
  **影响**：框的位置和实际单位任务收益不能确认
  **进一步探讨**：对两组标注过的非敏感截图，以手动工具及原生多模态为对照

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 桌面转发丢失浏览器 Origin 后，设置与粘贴策略接口如何限制请求？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

客户端为设置和粘贴请求附加 X-DSH-Vision-Request。显式 cross-site 会被拒；有 Origin 时需要 http/https 且 host 匹配。缺 Origin 时允许浏览器 same-origin、same-site、none，或同时无 fetch-site 且 marker 值为 1 的 Desktop 转发形态。设置变更 POST 与粘贴策略 GET 分别在 handler 检查，OPTIONS 不会通过其方法门槛。marker 本身可由非浏览器客户端构造，因而该兼容路径依赖 DSH Desktop 与宿主路由认证，不能据此断言可直接暴露 Host API。作者声明 0.2.2-rc.1 兼容及 Linux/Windows Profile 验收，本轮只核了清单与源码接线。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:925-934](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/client/index.tsx#L925-L934)

设置请求设置非简单请求头。

<details>
<summary>查看原文（10行）</summary>

```text
}

async function apiRequest<T>(init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  headers.set('X-DSH-Vision-Request', '1')
  const response = await fetch(SETTINGS_ROUTE, { credentials: 'same-origin', ...init, headers })
  const body = await response.json() as ApiSuccess<T> | ApiFailure
  if (!response.ok || !body.ok) {
    const failure = body as ApiFailure
    throw new Error(failure.error?.message ?? `Vision Toolkit request failed with HTTP ${response.status}`)
```

</details>

**依据 2 · 源码核查**：[src/client/paste-images.tsx:413-420](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/client/paste-images.tsx#L413-L420)

粘贴策略请求附加相同 marker。

```text
        if (selection.reasoningEffort !== undefined) query.set('reasoningEffort', selection.reasoningEffort)
      }
      let request: Promise<Response>
      try {
        request = fetch(`${PASTE_POLICY_ROUTE}?${query.toString()}`, { headers: { 'X-DSH-Vision-Request': '1' } })
      } catch {
        // No fetch surface (test runtime, pre-fetch bootstrap): leave the
        // verdict unconfirmed rather than letting the paste listener die.
```

**依据 3 · 源码核查**：[src/web-request.ts:9-28](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/web-request.ts#L9-L28)

显式跨站拒绝以及缺 Origin 的桌面例外。

<details>
<summary>查看原文（20行）</summary>

```text
export function sameOriginRequest(req: IncomingMessage): boolean {
  const fetchSite = req.headers['sec-fetch-site']
  if (fetchSite === 'cross-site') return false
  const origin = req.headers.origin
  if (origin === undefined) {
    // Desktop validates dsh-app://app then strips browser origin headers when
    // forwarding to its authenticated Host. This non-safelisted header survives
    // that bridge. Cross-origin browsers need a CORS preflight, which these
    // routes do not grant. Never let it override explicit foreign origins.
    return fetchSite === 'same-origin' || fetchSite === 'same-site' || fetchSite === 'none'
      || (fetchSite === undefined && req.headers['x-dsh-vision-request'] === '1')
  }
  const host = req.headers.host
  if (host === undefined) return false
  try {
    const parsed = new URL(origin)
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && parsed.host === host
  } catch {
    return false
  }
```

</details>

**依据 4 · 源码核查**：[src/web.ts:391-404](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/web.ts#L391-L404)

设置写入检查方法与来源。

<details>
<summary>查看原文（14行）</summary>

```text
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST')
      requestError(res, 405, 'method-not-allowed', 'Use GET or POST')
      return
    }
    if (!sameOriginPost(req)) {
      requestError(res, 403, 'origin-rejected', 'The request must originate from this DSH Web application')
      return
    }
    let parsed: SettingsRequest
    try {
      parsed = parseRequest(await readJson(req))
    } catch (error) {
      requestError(res, error instanceof RangeError ? 413 : 400, 'invalid-request', publicMessage(error))
```

</details>

**依据 5 · 源码核查**：[src/web.ts:474-481](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/web.ts#L474-L481)

粘贴策略仅 GET 并执行来源检查。

```text
      try {
        if (req.method !== 'GET') {
          requestError(res, 405, 'method-not-allowed', 'Use GET')
          return
        }
        if (!sameOriginRequest(req)) {
          requestError(res, 403, 'origin-rejected', 'The request must originate from this DSH Web application')
          return
```

**依据 6 · 作者声明**：[CHANGELOG.md:7-17](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/CHANGELOG.md#L7-L17)

作者声明指定版本和平台兼容性。

<details>
<summary>查看原文（11行）</summary>

```text
## [0.1.50] - 2026-11-12

### Compatibility

- Support exact DSH `0.2.2-rc.1` with mandatory Linux and Windows Profile acceptance, preserving earlier supported releases.
- 明确支持 DSH `0.2.2-rc.1`，通过 Linux、Windows 必跑的 Profile 验收，保留此前支持版本。

### Fixed

- Save settings and read paste policies through Desktop's authenticated request forwarding while retaining foreign-origin rejection and refusing CORS preflight.
- 修复 Desktop 请求转发后的设置保存与粘贴策略读取，保留外站来源拦截及 CORS 预检拒绝。
```

</details>

#### 缺口

- 未用真实 Desktop 或未认证直连 Host 检查请求
  **影响**：缺乏兼容与访问控制的运行证据
  **进一步探讨**：使用隔离 Host 测量经 Desktop、直接请求、跨站与预检的结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样先做只读试用，以及截图内容绑定能否减少过期坐标误用？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

适合经常从非敏感截图提取位置但主要模型不支持视觉的开发者。先用隔离 profile、可写工作区和已授权视觉服务，送单张带真值框的截图，核对标注、错误处理、出站范围与单位合格结果开销。首轮下载、日常 OCR 重试与异常清理分别计时；服务不可用或坐标无法人工复核时，回到本地人工查看并移除试用配置与产物。可以把证据的图像内容指纹与实际消费前截图比较，界面变化时要求重定位；若增加额外调用而没有降低过期坐标误用，或正常动态页面大量被误拒，则不采用。当前工具是定位与预览路径，假设针对跨步骤消费坐标。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime.ts:1381-1405](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/runtime.ts#L1381-L1405)

工具对所给图片验证并返回坐标，后续调用仍需对照界面。

<details>
<summary>查看原文（25行）</summary>

```text
    const policy = await this.pathPolicy(options.workspace)
    const image = await this.validateImage(request.image, policy, operation)
    this.accountImage(image, operation)
    const env = await this.resolveVisionEnv()
    const result = await this.runUpstream(tool, [
      image.path,
      request.target,
      ...(request.region !== undefined ? ['--region', request.region] : []),
    ], operation, env)
    const elements = parseLocationOutput(result.stdout)
    this.validateLocations(elements, image.width, image.height)
    return { image, elements }
  }

  /** ground: locate one named target and return pixel boxes. */
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
```

</details>

**依据 2 · 源码核查**：[src/index.ts:101-124](https://github.com/Anionex/dsh-vision-toolkit/blob/41e5f3d59fce0d122908864552513f5828024c6c/src/index.ts#L101-L124)

准备错误与设置修复有明确路径，首轮可测。

<details>
<summary>查看原文（24行）</summary>

```text
  const initialConfig = await storageHistory.restore(settings.get())
  // Verify the shipped Skill/tool implementation before discovery. Interpreter
  // probing, downloads and installation are cancellable background work.
  await verifyBundledUpstream()
  const preparation = manager.start(initialConfig, candidate => persistStorageHistory(candidate.config, false))
  ensureOperational()
  void preparation.then(() => {
    if (lifecycle.signal.aborted) return
    ensureOperational()
    variants.reconcile()
  }).catch(async error => {
    if (lifecycle.signal.aborted || manager.ready) return
    const resolvedInitial = resolveConfig(initialConfig)
    if (resolvedInitial.storageDir === undefined
      || manager.validatedStorageDirectory() === resolvedInitial.storageDir) {
      await persistStorageHistory(initialConfig, false)
    }
    const message = error instanceof Error ? error.message : String(error)
    ctx.logger.error(
      'dsh-vision-toolkit %s: runtime preparation failed; visual calls report this failure. Settings remain available for repair. %s',
      PLUGIN_VERSION,
      message,
    )
  })
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
