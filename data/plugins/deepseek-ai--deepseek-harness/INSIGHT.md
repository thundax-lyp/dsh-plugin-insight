# DeepSeek Harness

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[ce7073d](https://github.com/deepseek-ai/deepseek-harness/tree/ce7073d51254c26cd63b22a60835b8f948deb447)

<!-- BEGIN META -->
[![GitHub ★ 267,009](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=267%2C009&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
<!-- END META -->

> **功能**：基于插件组合提供 Agent 运行、工具调用、会话和交互的开源宿主。

> **亮点**：宿主将插件配置、作用域工具分派和会话事件组织为可组合接缝；Cordis 基础来自上游，实际采用收益仍需任务对照。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：版本声明通过不代表运行兼容；取消等待已启动工具结束也不撤销外部副作用，内存事件尚需持久化屏障，恢复必须核对实际目标。[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 谁需要它，它和直接编写 Agent 程序有什么区别？](#detail-section-11)
  - [Q02 · 模型工具调用从循环到审批和执行如何接线？](#detail-section-12)
  - [Q03 · profile 和版本准入能保证运行兼容吗？](#detail-section-13)
  - [Q04 · 会话事件和取消对恢复意味着什么？](#detail-section-14)
  - [Q05 · 如何进行有边界的试用，有什么可证伪假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要组装模型、工具和交互面的开发者可使用该 Agent 宿主；对既有 SDK 方案的实际收益尚无同条件对照。[Q01](#research-q01)

直接使用模型 SDK 编写循环与工具调用是参照；该宿主提供组合和会话接缝，也引入版本、配置和维护成本。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Profile 与 bundle 组合 | 将插件补丁组成宿主配置 | 不兼容项可跳过；版本通过不证明行为兼容 |
| Native 工具执行 | 对模型工具调用应用策略并分派 | 具体配置和其他执行器需分别验证 |
| Session 事件持久化 | 将会话事件交给配置的后端并刷新 | 内存提交不是耐久屏障，外部副作用不会自动回滚 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 与安装成品 | 必需 | 启动宿主 | 版本或产物不符时不能假定启动 |
| 模型与凭据 | 模型任务需要 | 模型推理 | 权限、费用和可用性由配置决定 |
| 存储后端与 flush | 耐久会话需要 | 持久化事件 | 未配置或失败不能假定事件已落盘 |
| 审批服务 | 需要询问的工具调用需要 | 路由审批 | 不存在或无 Agent 时拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者选择隔离配置和模型 | 依赖或权限不明确时停止 |
| 组装 | 用户检查 profile 和插件版本 | 被跳过的 bundle 必须单独检查 |
| 执行 | Agent 在 native 执行器路径发起工具并经过策略与审批 | 该路径拒绝或缺审批时不执行工具体；其他执行器另行核查 |
| 恢复 | 用户检查事件和外部目标 | 不一致时停止重复执行并核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node、存储及模型费用未知 | profile、权限与凭据配置耗时未知 | 开发预览需要自行验收 |
| 持续使用 | 模型、计算和存储开销未知 | 插件兼容和任务复核 | 无同条件节时数据 |
| 失败恢复 | 重试与外部副作用代价未知 | 核对日志、目标及备份 | 取消并不撤销已完成写入 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 可组合宿主 | profile 与作用域工具机制存在 | 插件实际互换成本 |
| 受控执行 | native 路径有策略、询问和守卫 | 所有部署和工具的权限正确性 |
| 会话存储 | 内存事件、后端路由与 flush 契约存在 | 崩溃恢复率和外部副作用 |

> **思考**：版本声明通过不代表运行兼容；取消等待已启动工具结束也不撤销外部副作用，内存事件尚需持久化屏障，恢复必须核对实际目标。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：宿主将插件配置、作用域工具分派和会话事件组织为可组合接缝；Cordis 基础来自上游，实际采用收益仍需任务对照。[Q01](#research-q01) [Q02](#research-q02)

profile 显式记录跳过的 bundle；工具按作用域选择执行器，native 管线有审批与取消分支；JSONL 将事件排队并由 flush 建立耐久边界。这些接缝不能替代真实宿主与故障测试。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

版本声明通过不代表运行兼容；取消等待已启动工具结束也不撤销外部副作用，内存事件尚需持久化屏障，恢复必须核对实际目标。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合有 Agent 扩展需求的开发者先在隔离 profile、固定模型和小任务上验收；服务缺失、非预期写入或重启不一致时停止并回到已知配置。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持所列代表链路的机制解释，未运行宿主、插件或任务；未来设计为假设。

- 已检查：作者 README、包清单、源码路径 README.md、packages/boot/app-boot/src/profile.ts、packages/core/tools/src/index.ts、packages/core/agent-loop/src/agent.ts、packages/bundle/base/cordis.patch.yml、packages/core/tool-executor-native/src/index.ts、packages/core/tools/src/pipeline.ts、packages/boot/app-boot/src/plugin-compatibility.ts、package.json、SAFETY.md、packages/core/session/src/index.ts、packages/session/session-persistence-jsonl/src/storage.ts、packages/session/session-persistence/src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整 monorepo 固定提交的 profile、native 工具执行及 session/JSONL 代表链路；未逐一审计 11888 个文件、其他执行器、宿主部署或插件，未执行目标。
- 下一步：用隔离 profile 和固定模型分别验证插件加载、审批缺失、工具取消与持久化屏障；对照目标文件及重启结果，记录失败点。

**分析版本**

- **仓库**：[deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
- **版本号**：0.2.2-alpha.2（[固定提交 ce7073d](https://github.com/deepseek-ai/deepseek-harness/tree/ce7073d51254c26cd63b22a60835b8f948deb447)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：在插件升级中增加作用域可见性、审批、取消和持久化接缝测试，可能比只检查版本范围发现更多真实不兼容；应比较故障检出、误报和维护时间，若额外收益不足以覆盖成本则否定。[Q05](#research-q05)

用隔离 profile 和固定模型分别验证插件加载、审批缺失、工具取消与持久化屏障；对照目标文件及重启结果，记录失败点。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4583 | 445208 | — | — | 6503882 |
| .mjs | source | 116 | 9859 | 7700 | 1601 | — |
| .mjs | test | 12 | 3394 | 3209 | 83 | — |
| .ts | source | 3050 | 538389 | 385921 | 120301 | — |
| .ts | test | 2756 | 731803 | 641602 | 37895 | — |
| .mjs | example | 68 | 4664 | 4141 | 324 | — |
| .ts | example | 117 | 5587 | 4541 | 585 | — |
| .md | test | 298 | 6745 | — | — | 57974 |
| .js | source | 10 | 342 | 319 | 20 | — |
| .tsx | source | 430 | 70015 | 55241 | 11384 | — |
| .cjs | example | 3 | 32 | 30 | 2 | — |
| .tsx | test | 391 | 127122 | 111849 | 6162 | — |
| .md | example | 18 | 397 | — | — | 3644 |
| .js | example | 26 | 504 | 439 | 50 | — |
| .js | test | 5 | 977 | 851 | 44 | — |
| .cjs | source | 5 | 129 | 76 | 37 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/deepseek-ai/deepseek-harness/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/deepseek-ai/deepseek-harness/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/deepseek-ai/deepseek-harness/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：评估 Agent 宿主的插件组合、工具调用控制与兼容边界，以及试用成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要它，它和直接编写 Agent 程序有什么区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DeepSeek Harness 是提供 Agent 运行和扩展机制的宿主基础设施，而不是第三方 DSH 插件。面向需要组装模型、工具与交互面的开发者，作者描述以插件组合的架构；代码中 profile 加载 bundle 补丁层，工具执行器按作用域注册。相对直接使用模型 SDK 编写循环，这把组合和工具接缝纳入统一宿主；同时也引入 profile、插件版本和生命周期维护。Cordis 的组合基础来自其上游，不能将其原理全部归功于本仓库。源码说明机制，尚无相同任务、同模型的人力和质量对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-13](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/README.md#L5-L13)

作者说明 Agent harness、Cordis 和开发预览。

```text
DeepSeek Harness (`dsh`) is an open-source agent harness developed by [DeepSeek AI](https://deepseek.com).

It is built on an **everything-is-a-plugin** architecture and powered by [Cordis](https://github.com/cordiverse/cordis), whose design is described in [_A Programming Paradigm for Spatiotemporal Composability_](https://arxiv.org/abs/2608.25512).

Documentation: [https://deepseek-harness.github.io/deepseek-harness/](https://deepseek-harness.github.io/deepseek-harness/)

## Developer preview

DeepSeek Harness is in _developer preview_ and iterating rapidly. **THERE WILL BE COMPATIBILITY-BREAKING CHANGES.**
```

**依据 2 · 源码核查**：[packages/boot/app-boot/src/profile.ts:678-712](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/boot/app-boot/src/profile.ts#L678-L712)

按 profile 列表解析 bundle、版本检查和补丁层。

<details>
<summary>查看原文（35行）</summary>

```text
export function loadProfileDirectory(
  binName: string,
  dir: string,
  installAnchor: string,
  options: { userLayer?: boolean } = {},
): Profile {
  const manifest = dropRetiredBundles(dir, readProfileManifest(binName, dir))
  const bundles = manifest.dsh?.profile?.bundles ?? []
  const layers: ProfileLayer[] = []
  const skippedBundles: SkippedBundle[] = []
  const exemptions = bundles.length === 0 ? {} : readProfileVersionExemptions(dir)
  for (const packageName of bundles) {
    try {
      const packageDir = resolveBundleDir(binName, packageName, installAnchor, dir)
      const bundleManifest = readProfileManifest(binName, packageDir)
      const bundle = bundleManifest.dsh?.bundle
      if (bundle === undefined) {
        throw new Error(`${binName}: profile bundle ${JSON.stringify(packageName)} declares no dsh.bundle in its package.json`)
      }
      assertBundlePlatform(bundle.platforms, process.platform)
      // A bundle is not a plugin row, so row admission never reads its own dsh requirements.
      const issue = evaluatePluginCompatibility(bundleManifest, exemptions)
      if (issue !== undefined && !issue.exempted) throw new Error(pluginCompatibilityWarning(issue))
      const patchPaths = bundlePatchPaths(packageDir, bundle)
      const patches = patchPaths.flatMap(patchPath => loadOverlayPatches(binName, patchPath))
      layers.push({ packageName, packageDir, patchPaths, patches })
    } catch (error) {
      skippedBundles.push({ packageName, reason: String(error) })
    }
  }
  const patchPath = join(dir, PROFILE_PATCH_FILENAME)
  const patches = options.userLayer !== false && existsSync(patchPath)
    ? loadOverlayPatches(binName, patchPath)
    : []
  return { name: basename(dir), dir, layers, patchPath, patches, skippedBundles }
```

</details>

**依据 3 · 源码核查**：[packages/core/tools/src/index.ts:320-349](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/core/tools/src/index.ts#L320-L349)

作用域内设置和卸载工具执行器。

<details>
<summary>查看原文（30行）</summary>

```text
   * Provide the executor for the calling scope; an unscoped contribution is the deployment default.
   * Rendering any executor-owned section requires the viewing scope's selection to remain available.
   * @param executor - initialized provider owned by the contributing plugin.
   * @returns the effect disposer. Unloading leaves the selection unavailable until it is replaced.
   */
  setExecutor(executor: ToolExecutor): () => void {
    const scope = scopeOf(this.ctx)
    const existing = scope === undefined ? this.root : this.scoped.get(scope)
    if (existing?.executor !== undefined) throw new Error('Only one tool executor may be registered in each scope')
    const record: Registration = { executor }
    // oxlint-disable-next-line typescript/no-misused-promises -- synchronous cleanup; preserve the Cordis disposer identity
    return this.ctx.effect(function* (this: ToolsService) {
      for (const section of executor.sections ?? []) {
        yield this.ctx.systemPrompt.section({
          name: section.name,
          order: section.order,
          ...section.interpolate === undefined ? {} : { interpolate: section.interpolate },
          text: ({ scope, toolSet }) => {
            if (this.selectExecutor(scope) !== executor) return ''
            return typeof section.text === 'function' ? section.text(this.definitions(scope, toolSet)) : section.text
          },
        })
      }
      if (scope === undefined) this.root = record
      else this.scoped.set(scope, record)
      yield () => {
        // Keep an unavailable selection so a program cannot fall through to a different executor.
        record.executor = undefined
      }
    }.bind(this), 'tools.setExecutor()')
```

</details>

#### 缺口

- 没有同任务同模型 SDK 实现的结果对照
  **影响**：不能声称更准确、更快或更省维护
  **进一步探讨**：固定任务和模型，对比配置、代码改动、恢复步骤和结果质量。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型工具调用从循环到审批和执行如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Agent 循环从模型消息提取工具调用并把 Agent、取消信号和步骤日志传给 tools.execute。工具服务按作用域选择执行器；base bundle 包含 native executor，其实现使用公共 pipeline 与批处理。pipeline 先运行 pre-execute 策略，需要询问时走审批，允许后检查守卫再分派工具；审批服务不存在或缺少 Agent 时将询问降级为拒绝。取消在执行前会跳过工具，已经开始的工具 promise 会等其结束后再形成取消结果；这不保证工具本身可中断或撤销外部写入。其他执行器与特定部署仍需分别核实。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/agent-loop/src/agent.ts:584-603](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/core/agent-loop/src/agent.ts#L584-L603)

Agent 循环把工具调用及作用域、信号传入工具服务。

<details>
<summary>查看原文（20行）</summary>

```text
        if (finish.kind === 'max-tokens') return { kind: 'max-tokens' }

        const toolCalls = message.content.filter(block => block.type === 'tool-call')
        if (toolCalls.length === 0) return { kind: 'completed' }
        const maxParallelToolCalls = this.loopCtx.agentLoop.config.maxParallelToolCalls.get()
        try {
          const result = await this.loopCtx.tools.execute({
            calls: toolCalls, signal, agent: this, log: { turn, step },
            maxParallelToolCalls, toolSet: decision.toolSet,
          })
          for (const context of result.additionalContexts) {
            this.inbox.splice('next-step', this.inbox.nextStep.length, 0, [context])
          }
          return result.concluded ? { kind: 'completed' } : null
        } catch (error: unknown) {
          if (!(error instanceof ToolBatchExecutionError)) throw error
          for (const context of error.partial.additionalContexts) {
            this.inbox.splice('next-step', this.inbox.nextStep.length, 0, [context])
          }
          throw error.cause
```

</details>

**依据 2 · 源码核查**：[packages/core/tools/src/index.ts:353-376](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/core/tools/src/index.ts#L353-L376)

按作用域选择执行器并分派。

<details>
<summary>查看原文（24行）</summary>

```text
   * Resolve the nearest scoped provider, or the deployment default.
   * @param scope - Agent or preset scope; omitted selects only the root contribution.
   * @returns the selected executor; throws when it is missing or unloaded.
   */
  private selectExecutor(scope?: ScopeKey): ToolExecutor {
    let record: Registration | undefined
    for (const key of scopeChainOf(scope)) {
      record = this.scoped.get(key)
      if (record !== undefined) break
    }
    record ??= this.root
    const executor = record?.executor
    if (executor === undefined) throw new ToolExecutorUnavailableError()
    return executor
  }

  /**
   * Delegate a raw call batch to its Agent's provider or the deployment default.
   * Select at dispatch; accepted batches settle through that provider even if it unloads.
   * @param input - original calls, optional owning Agent, and optional logging step.
   * @returns the selected executor's settled batch; unavailable selections reject.
   */
  async execute(input: ToolBatchInput): Promise<ToolBatchResult> {
    return this.selectExecutor(input.agent).execute(input)
```

</details>

**依据 3 · 源码核查**：[packages/bundle/base/cordis.patch.yml:494-505](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/bundle/base/cordis.patch.yml#L494-L505)

base bundle 声明 native 与默认禁用的另一执行器。

<details>
<summary>查看原文（12行）</summary>

```text
    # ── rows every mode mounts, whose values each overlay may state ──────────────

    # Shared tool definitions and the deployment’s native executor.
    - id: tools
      name: '@deepseek-ai/dsh-tools'

    - id: tool-executor-native
      name: '@deepseek-ai/dsh-tool-executor-native'

    - id: tool-executor-ptc
      name: '@deepseek-ai/dsh-tool-executor-ptc'
      disabled: true
```

</details>

**依据 4 · 源码核查**：[packages/core/tool-executor-native/src/index.ts:7-20](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/core/tool-executor-native/src/index.ts#L7-L20)

native 执行器使用公共 pipeline 和批处理。

<details>
<summary>查看原文（14行）</summary>

```text
/** Executes visible capabilities directly and owns their complete batch settlement. */
export class NativeToolExecutor implements ToolExecutor {
  private readonly pipeline: ToolExecutionPipeline

  constructor(ctx: Context, private readonly maxParallel: () => number = () => 10) {
    this.pipeline = new ToolExecutionPipeline(ctx)
  }

  describe(tools: readonly ToolDefinition[]): ToolModelInput {
    return { schemas: tools.map(definition => projectToolSchema(definition, false)) }
  }

  execute(input: ToolBatchInput): Promise<ToolBatchResult> {
    return executeToolBatch(input, this.pipeline, this.maxParallel)
```

</details>

**依据 5 · 源码核查**：[packages/core/tools/src/pipeline.ts:190-231](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/core/tools/src/pipeline.ts#L190-L231)

执行前策略、审批及守卫决定是否分派。

<details>
<summary>查看原文（42行）</summary>

```text
  async prepare(input: ToolExecutionInput): Promise<ScheduledToolPreparation> {
    const created = this.createExecution(input)
    if (created.kind !== 'ready') return created
    const exec = created.exec
    if (this.callerCancelled(exec)) {
      return { kind: 'final-result', exec, result: toolAbortedBeforeDispatchResult() }
    }
    try {
      const carrier = scopeTarget(this.tools, exec.agent)
      const gate = await this.ctx.waterfall(
        carrier, 'tools/pre-execute', exec,
        () => Promise.resolve<PreToolDecision>({ kind: 'allow' }),
      )
      const askResolution = gate.kind === 'ask'
        ? await this.serviceAsk(exec, gate)
        : { decision: gate, approvalCancelled: false }
      const { decision } = askResolution
      if (this.callerCancelled(exec) && askResolution.approvalCancelled) {
        return { kind: 'post-result', exec, result: toolAbortedBeforeDispatchResult() }
      }
      if (decision.kind === 'cancel') {
        return { kind: 'post-result', exec, result: toolAbortedBeforeDispatchResult() }
      }
      const denialReason = decision.kind === 'allow' ? this.tools.checkGuards(exec) : decision.reason
      const denialInfo = decision.kind === 'deny' ? decision.info : undefined
      if (denialReason !== undefined) {
        return {
          kind: 'post-result',
          exec,
          result: this.materializeFinalResult({
            content: [{ type: 'text', text: `Error: ${denialReason}` }],
            isError: true,
            error: { message: denialReason, ...denialInfo === undefined ? {} : { info: denialInfo } },
          }),
        }
      }
      if (this.callerCancelled(exec)) {
        return { kind: 'post-result', exec, result: toolAbortedBeforeDispatchResult() }
      }
      return { kind: 'dispatch', exec }
    } catch (error: unknown) {
      return { kind: 'final-result', exec, result: toolErrorResult(error) }
```

</details>

**依据 6 · 源码核查**：[packages/core/tools/src/pipeline.ts:432-469](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/core/tools/src/pipeline.ts#L432-L469)

审批缺失、拒绝、取消和不可用的分支。

<details>
<summary>查看原文（38行）</summary>

```text
  private async serviceAsk(
    exec: ToolExecution,
    ask: Extract<PreToolDecision, { kind: 'ask' }>,
  ): Promise<ToolAskResolution> {
    const approval = this.ctx.get('approval')
    if (approval === undefined) {
      return {
        decision: { kind: 'deny', reason: ask.reason ?? `tool "${exec.name}" requires approval (not yet supported)` },
        approvalCancelled: false,
      }
    }
    if (exec.agent === undefined) {
      return {
        decision: { kind: 'deny', reason: `tool "${exec.name}" requires approval, but the call has no agent to route it through` },
        approvalCancelled: false,
      }
    }
    const outcome = await approval.request({
      agent: exec.agent,
      toolName: exec.name,
      callId: exec.callId,
      ...ask.reason !== undefined ? { reason: ask.reason } : {},
      ...ask.displayReason !== undefined ? { displayReason: ask.displayReason } : {},
      signal: exec.signal,
    })
    switch (outcome) {
      case 'allowed-once': return { decision: { kind: 'allow' }, approvalCancelled: false }
      case 'rejected': return {
        decision: { kind: 'deny', reason: `the user rejected tool "${exec.name}"` },
        approvalCancelled: false,
      }
      case 'cancelled': return {
        decision: { kind: 'deny', reason: `approval for tool "${exec.name}" was cancelled` },
        approvalCancelled: true,
      }
      case 'unavailable': return {
        decision: { kind: 'deny', reason: `tool "${exec.name}" requires approval, but no approval channel is available` },
        approvalCancelled: false,
```

</details>

**依据 7 · 源码核查**：[packages/core/tools/src/pipeline.ts:253-280](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/core/tools/src/pipeline.ts#L253-L280)

已开始工具等待完成，取消结果不说明副作用回滚。

<details>
<summary>查看原文（28行）</summary>

```text
  /**
   * Dispatch the registered body with the original caller signal fused back
   * into any around-wrapper replacement. Cancellation never abandons the body:
   * a started promise reaches quiescence before its outcome becomes `ABORTED`.
   */
  private async dispatchToolBody(exec: MutableToolRunContext): Promise<ToolExecutionResult> {
    const state = this.cancellationStates.get(exec)
    /* v8 ignore next -- only registry-minted executions reach the staged scheduler methods */
    if (state === undefined) throw new Error('tool registry scheduler invariant violated: missing cancellation state')
    const wrapperSignal = exec.signal
    const fused = fuseToolSignals(state.callerSignal, wrapperSignal)
    const signal = fused.signal

    if (isAborted(signal)) {
      fused.dispose()
      return toolAbortedBeforeDispatchResult()
    }
    exec.signal = signal
    try {
      const tool = this.resolveExecution(exec.name, exec.agent, exec.parent !== undefined, exec.toolSet)
      if (!tool) throw new ToolNotFoundError(exec.name)
      state.bodyInvoked = true
      const returned = await tool.execute(exec.arguments, exec)
      const result = this.createSuccessResult(exec, tool, returned)
      return isAborted(signal)
        ? toolAbortedResult(result)
        : result
    } catch (error: unknown) {
```

</details>

#### 缺口

- 未在实际宿主验证具体插件与权限配置
  **影响**：不能声称所有工具或自定义执行器均受同一实际策略保护
  **进一步探讨**：以匹配 profile 测允许、拒绝、无审批、取消与工具已产生副作用的路径。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · profile 和版本准入能保证运行兼容吗？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

profile 解析已列出的 bundle，读取其 manifest 和补丁，检查平台及版本；无法读取、不支持的平台或不兼容项被收集到 skippedBundles，而用户补丁仍单独加载。版本规则优先使用 engines.dsh，否则检查 DSH peer 依赖，允许精确版本豁免；匹配只表明版本声明通过该检查，不保证服务注入、数据格式或行为相容。根包是 private monorepo、声明 Node 24.9 以上；作者标注开发预览且明确提示安全能力不能保证隔离。运行者需要按实际任务配置模型、凭据、权限和受控环境，当前未做宿主兼容或安全验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/boot/app-boot/src/profile.ts:678-712](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/boot/app-boot/src/profile.ts#L678-L712)

bundle 解析、兼容检查、跳过与用户层。

<details>
<summary>查看原文（35行）</summary>

```text
export function loadProfileDirectory(
  binName: string,
  dir: string,
  installAnchor: string,
  options: { userLayer?: boolean } = {},
): Profile {
  const manifest = dropRetiredBundles(dir, readProfileManifest(binName, dir))
  const bundles = manifest.dsh?.profile?.bundles ?? []
  const layers: ProfileLayer[] = []
  const skippedBundles: SkippedBundle[] = []
  const exemptions = bundles.length === 0 ? {} : readProfileVersionExemptions(dir)
  for (const packageName of bundles) {
    try {
      const packageDir = resolveBundleDir(binName, packageName, installAnchor, dir)
      const bundleManifest = readProfileManifest(binName, packageDir)
      const bundle = bundleManifest.dsh?.bundle
      if (bundle === undefined) {
        throw new Error(`${binName}: profile bundle ${JSON.stringify(packageName)} declares no dsh.bundle in its package.json`)
      }
      assertBundlePlatform(bundle.platforms, process.platform)
      // A bundle is not a plugin row, so row admission never reads its own dsh requirements.
      const issue = evaluatePluginCompatibility(bundleManifest, exemptions)
      if (issue !== undefined && !issue.exempted) throw new Error(pluginCompatibilityWarning(issue))
      const patchPaths = bundlePatchPaths(packageDir, bundle)
      const patches = patchPaths.flatMap(patchPath => loadOverlayPatches(binName, patchPath))
      layers.push({ packageName, packageDir, patchPaths, patches })
    } catch (error) {
      skippedBundles.push({ packageName, reason: String(error) })
    }
  }
  const patchPath = join(dir, PROFILE_PATCH_FILENAME)
  const patches = options.userLayer !== false && existsSync(patchPath)
    ? loadOverlayPatches(binName, patchPath)
    : []
  return { name: basename(dir), dir, layers, patchPath, patches, skippedBundles }
```

</details>

**依据 2 · 源码核查**：[packages/boot/app-boot/src/plugin-compatibility.ts:51-73](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/boot/app-boot/src/plugin-compatibility.ts#L51-L73)

版本检查优先级和 DSH peers 的处理。

<details>
<summary>查看原文（23行）</summary>

```text
function satisfies(runtimeVersion: string, range: string): boolean {
  return range.trim() !== '' && semver.satisfies(runtimeVersion, range, { includePrerelease: true })
}

function unmetRequirements(fields: Record<string, unknown>, runtimeVersion: string): Record<string, string> {
  const engines = Object.hasOwn(fields, 'engines') ? objectOf(fields.engines, 'Plugin manifest engines') : {}
  if (Object.hasOwn(engines, 'dsh')) {
    const range = engines.dsh
    if (typeof range !== 'string') throw new Error('Plugin manifest engines.dsh must be a string')
    return satisfies(runtimeVersion, range) ? {} : { 'engines.dsh': range }
  }
  if (!Object.hasOwn(fields, 'peerDependencies')) return {}
  const dependencies = objectOf(fields.peerDependencies, 'Plugin manifest peerDependencies')
  const unmet: Record<string, string> = {}
  for (const [name, range] of Object.entries(dependencies)) {
    if (typeof range !== 'string') {
      throw new Error(`Plugin manifest peerDependencies[${JSON.stringify(name)}] must be a string`)
    }
    if (name !== '@deepseek-ai/dsh' && !name.startsWith('@deepseek-ai/dsh-')) continue
    const requirement = ['workspace:^', 'workspace:~', 'workspace:*'].includes(range) ? runtimeVersion : range
    if (!satisfies(runtimeVersion, requirement)) unmet[name] = range
  }
  return unmet
```

</details>

**依据 3 · 源码核查**：[packages/boot/app-boot/src/plugin-compatibility.ts:87-101](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/boot/app-boot/src/plugin-compatibility.ts#L87-L101)

不匹配和精确豁免结果。

<details>
<summary>查看原文（15行）</summary>

```text
export function evaluatePluginCompatibility(
  manifest: object,
  exemptions: Readonly<Record<string, readonly string[]>> = {},
  runtimeVersion = getDshRuntimeVersion(),
): PluginCompatibility | undefined {
  runtimeVersionOf(runtimeVersion)
  const fields = objectOf(manifest, 'Plugin manifest')
  const requirements = unmetRequirements(fields, runtimeVersion)
  if (Object.keys(requirements).length === 0) return undefined
  const name = identityField(fields, 'name')
  const version = identityField(fields, 'version')
  const key = `${name}@${version}`
  const exemptedVersions = Object.hasOwn(exemptions, key) ? exemptions[key] : undefined
  const exempted = exemptedVersions?.includes(runtimeVersion) === true
  return { name, version, runtimeVersion, requirements, exempted }
```

</details>

**依据 4 · 源码核查**：[package.json:1-10](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/package.json#L1-L10)

根包身份、版本和 Node 要求。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "@deepseek-ai/dsh-root",
  "version": "0.2.2-alpha.2",
  "license": "MIT",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.28.5",
  "engines": {
    "node": ">=24.9.0"
  },
```

</details>

**依据 5 · 作者声明**：[SAFETY.md:5-15](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/SAFETY.md#L5-L15)

作者的预览状态和隔离限制说明。

<details>
<summary>查看原文（11行）</summary>

```text
## Experimental status

DeepSeek Harness is experimental developer-preview software. It has not undergone a security audit and must not be treated as secure or production-ready.

The project can execute model-generated code and commands, load third-party plugins, and access the network, processes, credentials, and files made available to it. Incorrect model output, defects, misconfiguration, malicious input, or untrusted plugins may damage the host computer, modify or delete files, disclose data or credentials, or cause other unintended effects.

## Sandbox limitations

Sandboxing, approval prompts, and permission controls can reduce risk, but they do not guarantee isolation or prevent damage. Even correctly enforced restrictions cannot protect resources that the project is allowed to access.

Do not rely on DeepSeek Harness as the sole security control for untrusted workloads.
```

</details>

#### 缺口

- 没有选定插件的实际安装、加载和功能结果
  **影响**：无法从声明范围推断互换成功或完整安全边界
  **进一步探讨**：在隔离 profile 对目标插件逐项测试加载、作用域服务、状态迁移及权限。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 会话事件和取消对恢复意味着什么？

**研究主题**：功能与机制、缺陷与关键质疑、效果与总成本

#### 完整回答

会话提交先验证候选，写入进程内事件日志再通知监听者；JSONL 持久化实现为活跃 writer 监听事件并排队，flush 则排空并调用持久化屏障。持久化服务契约区分尽力 append 和 flush 屏障，未物化的会话在崩溃前可能不曾对其他进程存在。因此内存中看见事件不等于已经耐久落盘；未配置后端、写失败或崩溃点都可能改变恢复结果。工具取消等待已启动工作结束也不撤销工具已经产生的外部副作用。恢复者需要检查日志、目标文件与外部系统，不能盲目重试。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/session/src/index.ts:886-910](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/core/session/src/index.ts#L886-L910)

提交内存日志并通知监听者。

<details>
<summary>查看原文（25行）</summary>

```text
  /**
   * Accept one frozen candidate at the next sequence number, enter it into the
   * log, and notify `session/event` observers with per-listener containment.
   * @param event - the candidate built at the current log length.
   * @param entry - the attachment read before the candidate was built.
   */
  private commit(event: SessionEvent, entry: SessionEntry | undefined): void {
    this.surfaceManager.validateNext(event)

    if (entry !== undefined) entry.appending = true
    try {
      const callbackArgs: unknown[] = [this, event]
      const callbacks = entry === undefined
        ? undefined
        : collectSessionCallbacks(entry.emitCtx, [entry.carrier, 'session/event', ...callbackArgs])
      this.log.push(event)
      this.eventsSnapshot = undefined
      if (entry !== undefined && callbacks !== undefined) {
        invokeContainedSessionObservers(entry.emitCtx, 'session/event', entry.id, callbackArgs, callbacks)
      }
    } finally {
      if (entry !== undefined) {
        entry.appending = false
        if (entry.detachRequested && entry.announcement !== 'dispatching') entry.detach()
      }
```

</details>

**依据 2 · 源码核查**：[packages/session/session-persistence-jsonl/src/storage.ts:525-560](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/session/session-persistence-jsonl/src/storage.ts#L525-L560)

JSONL 后端监听 session 事件并在 flush 排空。

<details>
<summary>查看原文（36行）</summary>

```text
  /**
   * Install the backend's live session routing and teardown. Persistence
   * enforces one active write handle per id, so the listeners route published
   * sessions' events by id; the teardown effect closes every open handle —
   * close drains the routed buffer — and aggregates failures. This provider
   * owns no separate storage connection, so closing handles is the complete
   * teardown. The returned effect removes listeners before closing handles.
   * @param ctx - the backend's resource-owning context.
   * @returns the disposer to run after persistence consumers finish unloading.
   */
  install(ctx: Context): () => Promise<void> {
    const { writers, openHandles, name } = this
    return ctx.effect(function* () {
      yield async () => {
        const errors: unknown[] = []
        for (const handle of [...openHandles]) {
          try {
            await handle.close()
          } catch (error: unknown) {
            errors.push(error)
          }
        }
        if (errors.length > 0) throw new AggregateError(errors, `${name} dispose failed`)
      }
      yield ctx.on('session/event', (session: Session, event) => {
        writers.get(session.id)?.enqueueLive(event, (error) => {
          ctx.logger.warn(`session-persistence: background write for session "${session.id}" failed (buffered events retained): ${String(error)}`)
        })
      })
      yield ctx.on('session/flush', (session: Session) => {
        const writer = writers.get(session.id)
        if (writer === null || writer === undefined) return undefined
        return (async () => {
          await writer.drainLive()
          await writer.flush()
        })()
```

</details>

**依据 3 · 源码核查**：[packages/session/session-persistence/src/index.ts:124-142](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/session/session-persistence/src/index.ts#L124-L142)

存储契约区分尽力追加、flush 与物化。

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * Durable append-only session storage addressed through per-session handles.
 *
 * Storage semantics shared by every backend: events are contiguous from seq 0
 * and never rewritten; a torn physical tail is never returned to a reader and
 * is truncated by the write path before its first append; reads validate
 * current-format records only and refuse unknown vocabulary fail-closed.
 * `append` persists best-effort; `flush` — per handle or service-wide — is
 * the durability barrier.
 *
 * Visibility: a created session is observable through `stat`/`list`/`open`
 * in this process from the moment `create` resolves, even while a backend
 * defers physical materialization (a pure optimization); other processes see
 * the session only once it materializes, and a session that never
 * materialized before a crash never existed. `SessionHandle.flush` forces
 * materialization.
 *
 * Freshness: once an `append` or `flush` resolves, reads started afterwards
 * on this backend instance observe at least that prefix.
```

</details>

**依据 4 · 源码核查**：[packages/core/tools/src/pipeline.ts:253-280](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/core/tools/src/pipeline.ts#L253-L280)

等待已开始工作并返回取消结果。

<details>
<summary>查看原文（28行）</summary>

```text
  /**
   * Dispatch the registered body with the original caller signal fused back
   * into any around-wrapper replacement. Cancellation never abandons the body:
   * a started promise reaches quiescence before its outcome becomes `ABORTED`.
   */
  private async dispatchToolBody(exec: MutableToolRunContext): Promise<ToolExecutionResult> {
    const state = this.cancellationStates.get(exec)
    /* v8 ignore next -- only registry-minted executions reach the staged scheduler methods */
    if (state === undefined) throw new Error('tool registry scheduler invariant violated: missing cancellation state')
    const wrapperSignal = exec.signal
    const fused = fuseToolSignals(state.callerSignal, wrapperSignal)
    const signal = fused.signal

    if (isAborted(signal)) {
      fused.dispose()
      return toolAbortedBeforeDispatchResult()
    }
    exec.signal = signal
    try {
      const tool = this.resolveExecution(exec.name, exec.agent, exec.parent !== undefined, exec.toolSet)
      if (!tool) throw new ToolNotFoundError(exec.name)
      state.bodyInvoked = true
      const returned = await tool.execute(exec.arguments, exec)
      const result = this.createSuccessResult(exec, tool, returned)
      return isAborted(signal)
        ? toolAbortedResult(result)
        : result
    } catch (error: unknown) {
```

</details>

#### 缺口

- 未进行崩溃、重启和外部副作用故障注入
  **影响**：不能推断实际部署的恢复率或恰好一次语义
  **进一步探讨**：在隔离 profile 在不同 flush 和工具写入边界终止进程并核对记录和目标。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何进行有边界的试用，有什么可证伪假设？

**研究主题**：采用判断、新假设与验证、工程质量与复用

#### 完整回答

工具服务按作用域选择执行器；所核查的 native 执行器通过公共 pipeline 应用策略和守卫，自定义 ToolExecutor 可自行实现执行，不保证经过该 pipeline。持久化使用明确 flush 边界，这些是构造替换测试的可借鉴接缝；代价是扩展必须遵守作用域、生命周期和数据契约。未验证假设是，在升级插件时同时测试作用域工具可见性、执行前审批、取消和持久化屏障，比只检查 semver 更能发现真实不兼容；这需要维护场景和故障注入，可能增加验收成本。可用同一批插件升级样本比较版本声明检查与接缝测试发现的真实故障、误报及人工时间；若未多发现关键故障或维护成本高于收益则否定。建议有扩展需求的开发者先在隔离 profile 用固定模型和小任务核验调用、审批及重启；出现未预期写入、服务缺失或恢复不一致时停止并回到已知配置。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/tools/src/index.ts:353-376](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/core/tools/src/index.ts#L353-L376)

工具服务选择执行器后直接委派其 execute；自定义执行器不自动经过 native pipeline。

<details>
<summary>查看原文（24行）</summary>

```text
   * Resolve the nearest scoped provider, or the deployment default.
   * @param scope - Agent or preset scope; omitted selects only the root contribution.
   * @returns the selected executor; throws when it is missing or unloaded.
   */
  private selectExecutor(scope?: ScopeKey): ToolExecutor {
    let record: Registration | undefined
    for (const key of scopeChainOf(scope)) {
      record = this.scoped.get(key)
      if (record !== undefined) break
    }
    record ??= this.root
    const executor = record?.executor
    if (executor === undefined) throw new ToolExecutorUnavailableError()
    return executor
  }

  /**
   * Delegate a raw call batch to its Agent's provider or the deployment default.
   * Select at dispatch; accepted batches settle through that provider even if it unloads.
   * @param input - original calls, optional owning Agent, and optional logging step.
   * @returns the selected executor's settled batch; unavailable selections reject.
   */
  async execute(input: ToolBatchInput): Promise<ToolBatchResult> {
    return this.selectExecutor(input.agent).execute(input)
```

</details>

**依据 2 · 源码核查**：[packages/core/tools/src/index.ts:353-399](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/core/tools/src/index.ts#L353-L399)

作用域执行器和守卫。

<details>
<summary>查看原文（47行）</summary>

```text
   * Resolve the nearest scoped provider, or the deployment default.
   * @param scope - Agent or preset scope; omitted selects only the root contribution.
   * @returns the selected executor; throws when it is missing or unloaded.
   */
  private selectExecutor(scope?: ScopeKey): ToolExecutor {
    let record: Registration | undefined
    for (const key of scopeChainOf(scope)) {
      record = this.scoped.get(key)
      if (record !== undefined) break
    }
    record ??= this.root
    const executor = record?.executor
    if (executor === undefined) throw new ToolExecutorUnavailableError()
    return executor
  }

  /**
   * Delegate a raw call batch to its Agent's provider or the deployment default.
   * Select at dispatch; accepted batches settle through that provider even if it unloads.
   * @param input - original calls, optional owning Agent, and optional logging step.
   * @returns the selected executor's settled batch; unavailable selections reject.
   */
  async execute(input: ToolBatchInput): Promise<ToolBatchResult> {
    return this.selectExecutor(input.agent).execute(input)
  }

  /**
   * Register a monotonic denial in the calling scope.
   * @param guard - evaluated after extensible pre-execute policy by the shared pipeline.
   * @returns the effect disposer that removes this guard.
   */
  guard(guard: ToolGuard): () => void {
    return this.guards.effect(this.ctx, layer => layer.guards.append(guard), { label: 'tools.guard()' })
  }

  /**
   * Check global and inherited guards after pre-execute policy and approval resolve.
   * @param exec - invocation whose guards are checked before dispatch.
   * @returns the first denial reason, or undefined when no guard denies.
   */
  checkGuards(exec: ToolExecution): string | undefined {
    for (const layer of [this.guards.global, ...this.guards.chainLayers(exec.agent)]) {
      for (const guard of layer.guards.values()) {
        const reason = guard(exec)
        if (reason !== undefined) return reason
      }
    }
```

</details>

**依据 3 · 源码核查**：[packages/core/tools/src/pipeline.ts:190-231](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/core/tools/src/pipeline.ts#L190-L231)

所查 native pipeline 在分派前执行策略和审批。

<details>
<summary>查看原文（42行）</summary>

```text
  async prepare(input: ToolExecutionInput): Promise<ScheduledToolPreparation> {
    const created = this.createExecution(input)
    if (created.kind !== 'ready') return created
    const exec = created.exec
    if (this.callerCancelled(exec)) {
      return { kind: 'final-result', exec, result: toolAbortedBeforeDispatchResult() }
    }
    try {
      const carrier = scopeTarget(this.tools, exec.agent)
      const gate = await this.ctx.waterfall(
        carrier, 'tools/pre-execute', exec,
        () => Promise.resolve<PreToolDecision>({ kind: 'allow' }),
      )
      const askResolution = gate.kind === 'ask'
        ? await this.serviceAsk(exec, gate)
        : { decision: gate, approvalCancelled: false }
      const { decision } = askResolution
      if (this.callerCancelled(exec) && askResolution.approvalCancelled) {
        return { kind: 'post-result', exec, result: toolAbortedBeforeDispatchResult() }
      }
      if (decision.kind === 'cancel') {
        return { kind: 'post-result', exec, result: toolAbortedBeforeDispatchResult() }
      }
      const denialReason = decision.kind === 'allow' ? this.tools.checkGuards(exec) : decision.reason
      const denialInfo = decision.kind === 'deny' ? decision.info : undefined
      if (denialReason !== undefined) {
        return {
          kind: 'post-result',
          exec,
          result: this.materializeFinalResult({
            content: [{ type: 'text', text: `Error: ${denialReason}` }],
            isError: true,
            error: { message: denialReason, ...denialInfo === undefined ? {} : { info: denialInfo } },
          }),
        }
      }
      if (this.callerCancelled(exec)) {
        return { kind: 'post-result', exec, result: toolAbortedBeforeDispatchResult() }
      }
      return { kind: 'dispatch', exec }
    } catch (error: unknown) {
      return { kind: 'final-result', exec, result: toolErrorResult(error) }
```

</details>

**依据 4 · 源码核查**：[packages/core/session/src/index.ts:1329-1358](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/core/session/src/index.ts#L1329-L1358)

flush 等待所有监听并传播失败。

<details>
<summary>查看原文（30行）</summary>

```text
  /**
   * Dispatch the awaited `session/flush` durability checkpoint for `session`,
   * with the carrier captured at {@link enter}. THE flush entry point: the
   * store owns the carrier, so callers (the checkpoint policy's per-request
   * barrier, goal-round-driver's idle checkpoint, teardown drains, and consumers
   * that flush themselves before reading storage) must come through here
   * rather than dispatch a raw `ctx.parallel('session/flush', …)` — one owner
   * and one spelling.
   * @param session - the session whose buffered events must reach durable storage.
   * @returns whether at least one durability listener participated, after every
   *   listener has settled successfully.
   * @throws the first registered listener failure after every listener settles.
   */
  async flush(session: Session): Promise<boolean> {
    const { carrier } = this.liveEntryFor(session)
    const callbackArgs: unknown[] = [session]
    const callbacks = collectSessionCallbacks(this.ctx, [carrier, 'session/flush', session])
    const results = await Promise.allSettled(callbacks.map((callback) => {
      try {
        return callback(...callbackArgs)
      } catch (error: unknown) {
        // Preserve the listener's exact rejection value; flush is a caller-owned
        // failure boundary, and Cordis listeners may throw arbitrary values.
        // oxlint-disable-next-line typescript/prefer-promise-reject-errors
        return Promise.reject(error)
      }
    }))
    const failure = results.find((result): result is PromiseRejectedResult => result.status === 'rejected')
    if (failure !== undefined) throw failure.reason
    return callbacks.length > 0
```

</details>

**依据 5 · 源码核查**：[packages/boot/app-boot/src/plugin-compatibility.ts:87-101](https://github.com/deepseek-ai/deepseek-harness/blob/ce7073d51254c26cd63b22a60835b8f948deb447/packages/boot/app-boot/src/plugin-compatibility.ts#L87-L101)

版本准入只给出要求与豁免结果。

<details>
<summary>查看原文（15行）</summary>

```text
export function evaluatePluginCompatibility(
  manifest: object,
  exemptions: Readonly<Record<string, readonly string[]>> = {},
  runtimeVersion = getDshRuntimeVersion(),
): PluginCompatibility | undefined {
  runtimeVersionOf(runtimeVersion)
  const fields = objectOf(manifest, 'Plugin manifest')
  const requirements = unmetRequirements(fields, runtimeVersion)
  if (Object.keys(requirements).length === 0) return undefined
  const name = identityField(fields, 'name')
  const version = identityField(fields, 'version')
  const key = `${name}@${version}`
  const exemptedVersions = Object.hasOwn(exemptions, key) ? exemptions[key] : undefined
  const exempted = exemptedVersions?.includes(runtimeVersion) === true
  return { name, version, runtimeVersion, requirements, exempted }
```

</details>

#### 缺口

- 接缝验收假设无对照试验
  **影响**：不能断言其预测能力或总成本更优
  **进一步探讨**：记录真实插件升级故障、两种方法检出率与维护时间。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
