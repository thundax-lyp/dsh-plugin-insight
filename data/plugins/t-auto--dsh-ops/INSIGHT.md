# dsh-ops

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[bfdfdf6](https://github.com/T-Auto/dsh-ops/tree/bfdfdf68765f8bdd04914df0cade49de21913746)

<!-- BEGIN META -->
[![GitHub ★ 5,977](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C977&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/T-Auto/dsh-ops) [![npm 30d 258,191](https://img.shields.io/static/v1?label=npm+30d&message=258%2C191&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ops) [![最新发布 2026-11-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ops)
<!-- END META -->

> **功能**：为 DSH 提供原生文件工具、可在代码中批处理的文件接口和可选 Bash 能力。

> **亮点**：[Q01](#research-q01) 的作用域工具替代与[Q02](#research-q02) 的修订/后置回执组合提供可验收文件流程；[Q03](#research-q03) 把后续建议限定到当前可调用能力。

> **主要限制**：[Q02](#research-q02) 的move目标可先发布再删源失败，不能把报错当未执行；[Q04](#research-q04) 的扫描/页面/格式限制也使工具完整不等于任务无遗漏。

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
  - [Q01 · 何时替代官方工具，宿主过旧或Bash失效时怎样处理？](#detail-section-11)
  - [Q02 · 写入与移动在部分成功或未知时能否直接重试？](#detail-section-12)
  - [Q03 · PTC选取、批处理指导与下一步建议会授予执行权限吗？](#detail-section-13)
  - [Q04 · 精简显示、搜索和PDF读取怎样影响完整性判断？](#detail-section-14)
  - [Q05 · 安装、退出默认预设和失败恢复有哪些实际负担？](#detail-section-15)
  - [Q06 · 把任务清单与回执联合验收能否减少遗漏和重复写入？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向反复盘点仓库、检索段落并复核小批改动的开发者，把受策略限制的文件工具与结果回执接入DSH。

官方文件工具、原生shell或简单脚本已可处理文件；OPS增加作用域内发布、修订和结构化恢复事实，收益仍需同任务比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 文件读取与搜索 | 盘点仓库和查看范围 | 扫描、页面与输出完整性分开验收 |
| 文件写入/复制/移动 | 有revision约束的小批改动 | 策略允许；move限同文件系统，partial不重放 |
| PTC文件API | 代码内批处理 | 当前scope/策略及nextTurn选取；发现不授予权限 |
| 批处理指导 | 对根run_code程序形态反馈 | 非语义证明，会增加上下文 |
| OPS(PTC)预设 | 提供内置模式与可选默认动作 | 显式设置、回读，退出恢复best effort |
| 可选Bash | 对应Windows执行模式 | 依赖有效执行器，失败回退范围有限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 包声明Node/DSH范围 | 加载必需 | 解析发布入口与宿主API | 已知过旧宿主激活拒绝，unknown不保证兼容 |
| 对应平台原生worker、subprocess和sandboxPolicy | 文件执行必需 | 固定操作与权限 | 不可用或拒绝，保留回执与原工具 |
| tools、systemPrompt与PTC运行时 | 对应模式必需 | 发布/发现/代码批处理 | 发现不等于当前API获准 |
| agentPresets与settings | 预设及默认动作按需 | 注册和回读/恢复选择 | 无服务只能告警并人工选回 |
| 同文件系统 | move必需 | 不覆盖硬链接发布 | 跨盘拒绝，不copy/delete降级 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户核对版本、平台与隔离仓库 | worker及策略可说明 |
| 2 | 宿主按模式发布/替代工具 | 作用域和当前可调用集合明确 |
| 3 | Agent读取revision再作有界任务 | coverage、effectState和实际文件共同核对 |
| 4 | 用户处理部分结果并退出试用 | 先查后置事实，再检查默认预设恢复；不盲重放 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 包/worker与缓存资源未知 | 核对平台、宿主、模式与策略 | 未测安装时延 |
| 持续使用 | 模型上下文、反馈、溢出存储未知 | 检查回执和任务清单 | 不承诺节Token或省时 |
| 失败恢复 | 重读/重复调用与存储未知 | 查两侧revision、权限和默认选择 | 未测异常恢复总成本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 文件办结 | revision/不覆盖/部分副作用回执 | 目标平台异常结果 |
| 范围读取 | 按行和revision精简显示及完整性事实 | 端到端漏项率 |
| 批处理 | 权限约束选择与程序形态反馈 | 合格率、轮次与总费用改善 |

> **思考**：[Q02](#research-q02) 的move目标可先发布再删源失败，不能把报错当未执行；[Q04](#research-q04) 的扫描/页面/格式限制也使工具完整不等于任务无遗漏。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的作用域工具替代与[Q02](#research-q02) 的修订/后置回执组合提供可验收文件流程；[Q03](#research-q03) 把后续建议限定到当前可调用能力。

[Q02](#research-q02) 的不覆盖发布、修订复核与effectState值得复用；[Q03](#research-q03) 下一步建议与授权分离。[Q05](#research-q05) 默认预设best effort清理需保留失败告警，移植时不能只复制理想分支。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的move目标可先发布再删源失败，不能把报错当未执行；[Q04](#research-q04) 的扫描/页面/格式限制也使工具完整不等于任务无遗漏。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 从隔离仓库只读清单与可复位改动开始，发生部分结果先查实际文件；缺worker、回执或默认恢复失败时回官方工具。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

接线、权限、文件操作与回执边界已检查；未运行平台或宿主任务，性能收益未证；任务联合验收是未实现假设。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、src/index.ts、src/adapter/dsh/host-floor.ts、src/consumer/mount.ts、src/publication/replacements.ts、src/publication/ptc.ts、src/execution/files.ts、native/crates/ops-files/src/file_single.rs、src/projections/ptc/outcome.ts、src/projections/ptc/next-step.ts、src/projections/native/ranges.ts、src/projections/native/render.ts、src/presets/ops-ptc/register.ts、native/crates/ops-documents/src/pdf_container.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件，覆盖原生文件与搜索、PTC/预设和新增host-floor、恢复建议、显示及PDF容器限制；未全面评测可选Bash/TUI、全部文档提取和第三方集成。
- 下一步：未运行目标。可用排除目录、长行、revision冲突与目标已发布场景对照任务清单/工具status，计合格结果和全部恢复投入，见[Q06](#research-q06)。

**分析版本**

- **仓库**：[T-Auto/dsh-ops](https://github.com/T-Auto/dsh-ops)
- **版本号**：0.5.6（[固定提交 bfdfdf6](https://github.com/T-Auto/dsh-ops/tree/bfdfdf68765f8bdd04914df0cade49de21913746)）
- **版本日期**：2026-11-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出把必查目录与预期后置状态联合回执验收的未验证假设，比较漏项、重复写入和全部人工/资源成本。

未运行目标。可用排除目录、长行、revision冲突与目标已发布场景对照任务清单/工具status，计合格结果和全部恢复投入，见[Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 148 | 19251 | — | — | 288297 |
| .mjs | source | 73 | 17378 | 12217 | 4283 | — |
| .mjs | example | 11 | 1815 | 1167 | 544 | — |
| .ts | source | 260 | 24859 | 18290 | 5579 | — |
| .tsx | source | 5 | 745 | 598 | 131 | — |
| .mjs | test | 308 | 50070 | 42801 | 4843 | — |
| .md | example | 1 | 19 | — | — | 100 |
| .mts | test | 1 | 15 | 11 | 4 | — |
| .ts | test | 10 | 467 | 362 | 89 | — |

</details>

**活跃度**

[![Issue 未关闭 29](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=29&color=737b86&logo=github)](https://github.com/T-Auto/dsh-ops/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 375](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=375&color=737b86&logo=github)](https://github.com/T-Auto/dsh-ops/issues?q=is%3Aissue+created%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z) [![近30天关闭 387](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=387&color=737b86&logo=github)](https://github.com/T-Auto/dsh-ops/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z)



统计日期：2026-11-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：文件/PTC工具的替代、修订与回执能否帮助开发者办结仓库任务，恢复建议是否扩大实际权限？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何时替代官方工具，宿主过旧或Bash失效时怎样处理？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、依赖、兼容与流程

#### 完整回答

面向在DSH里反复列文件、检索、读段落并审阅小批改动的开发者，OPS增加原生文件操作、可在代码中批处理的PTC接口及结构化回执。合格任务需同时满足必查路径覆盖和目标文件后置状态，不能只因工具返回completed就结束。官方工具或脚本仍是基线；新增价值是将作用域、工具可见性、修订和结果状态接入同一宿主流程，作者主张的节Token与轮次收益没有本轮实测。

根补丁加载单行插件，apply先解析配置并assertHostFloor，再按模式装配consumer。明确低于包声明下限的宿主在激活时被拒绝；unknown版本放行，上界兼容仍不能由这个下限检查保证。consumer按Native/PTC呈现挂载工具和替代器，Bash执行器解析不可用时不遮蔽官方工具。replacement还识别若干不可恢复的Bash准备失败，以Agent为单位恢复官方工具；它只识别特定错误形态，不能推为任意运行失败都自动回退，也不会自动重放已发生的写操作。

PTC路径基于当前可服务集合和对应发布定义判断遮蔽，不把“已发现工具”当成所有调用均获准。第三方同作用域注册或不可见的外部条件保留原工具，避免覆盖未知策略。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:33-75](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/index.ts#L33-L75)

host-floor、配置和mode消费器装配。

<details>
<summary>查看原文（43行）</summary>

```text
export async function apply(root: Context, rawConfig: unknown): Promise<void> {
  const config = resolveMergedConfig(rawConfig)
  // Activation-time host support boundary (#701): an older host hears one named
  // diagnosis here instead of loading halfway and failing with TypeError scope
  // errors backstage and EXECUTOR_UNAVAILABLE in front. An unknown host version
  // cannot be proven below the floor, so it loads as before.
  await assertHostFloor(root)
  const host = root
  const mount = async (module: { apply(...args: unknown[]): unknown }, state: { enabled: boolean; raw?: Record<string, unknown>; config: unknown }, slice?: Record<string, unknown>): Promise<void> => {
    if (!state.enabled) return
    const payload = slice ?? state.raw ?? state.config
    if (state.raw === undefined && slice === undefined) {
      await host.plugin({ name: `dsh-ops/${moduleName(module)}`, apply: (ctx: Context) => { (module.apply as (ctx: Context, config: unknown) => void)(ctx, state.config) } })
      return
    }
    await host.plugin(module, payload)
  }
  // The retention sweep is process-wide (it scans the temp directory once per start-up and once
  // per shutdown), so its validated budget is installed here instead of inside each consumer.
  const retention = config.resultCache
  configureResultCacheGc(retention.enabled ? retention.config : undefined)
  root.effect(() => () => configureResultCacheGc(undefined), 'dsh-ops: result cache retention')
  // The ops-ptc preset is a runtime contribution, not a bundle row: registering it
  // through the host registry means disabling this row can never leave a profile's
  // selected preset dangling. It never blocks the rest of apply.
  const preset = registerOpsPtcPreset(root)
  beginMergedRow()
  try {
    // The browser half mounts its `opsSettings` remote; the legacy shell row used
    // to provide that seam, so the merged row owns it now.
    await host.plugin({ name: 'dsh-ops/runtime-settings',
      apply: (ctx: Context) => mountRuntimeSettings(ctx, { config: () => rawConfig, applyDefaultPreset: () => preset.applyDefault() }) })
    for (const mode of MODE_IDS) {
      const state = config[mode]
      const effective = resolveModeConfig(effectiveMode(state, config.global, typeof config.other.raw?.pwsh7Link === 'boolean' ? config.other.raw.pwsh7Link : companionVersion({ sweep: false }) !== undefined), mode)
      await host.plugin({ name: `dsh-ops/consumer-${mode}`, async apply(ctx: Context) {
        applyResolvedMode(ctx, effective, mode, { enabled: state.enabled,
          discovery: { ...config.discovery.config, enabled: config.discovery.enabled },
          dynamic: dynamicForMode(state, config.global) })
        // Built-in modes answer ops_status too (#753): the named diagnosis used
        // to exist only behind an external preset row.
        await mountModeDiagnostics(ctx, mode)
      } })
```

</details>

**依据 2 · 源码核查**：[src/adapter/dsh/host-floor.ts:89-96](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/adapter/dsh/host-floor.ts#L89-L96)

只在已知版本低于声明下限时拒绝。

```text
export async function assertHostFloor(ctx: Context): Promise<void> {
  const floor = declaredHostFloor()
  if (floor === undefined) return
  const { runtimeVersion: version } = await runtimeVersion(ctx)
  if (version === 'unknown') return
  if (versionBelowFloor(version, floor)) {
    throw new Error(`This dsh-ops build requires DSH ${floor} or newer (package.json engines.dsh); the running host reports ${version}. Upgrade the host runtime instead of reloading this plugin: an older host loads it halfway at best, showing TypeError scope errors backstage and EXECUTOR_UNAVAILABLE in front.`)
  }
```

**依据 3 · 源码核查**：[src/consumer/mount.ts:18-39](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/consumer/mount.ts#L18-L39)

Bash解析状态和宿主装配。

<details>
<summary>查看原文（22行）</summary>

```text
export function mountConsumer(ctx: Context, plan: ConsumerPlan): void {
  const { gate, core } = plan
  let ptc: ReturnType<typeof mountPtc> | undefined
  let renderShellGuidance: (agent: Agent) => string = () => ''
  const shellOwnsGuidance = (agent: Agent): boolean => Boolean(core.extraGuidance.trim()) && Boolean(renderShellGuidance(agent))
  // A shell slot whose executor never resolved must never hide the official tools it was
  // going to replace (#962): the replacement would advertise a counterpart that cannot run.
  let bashUnavailable = false
  if (plan.shell) {
    // Host subprocess spills outlive the call that produced them upstream, so the
    // row that publishes the shell also owns one bounded retention runtime.
    const releaseSpillRetention = mountSpillRetention(spillRetentionConfig(core), {
      report: message => ctx.logger?.warn?.(message),
    })
    ctx.effect(() => () => releaseSpillRetention(), 'dsh-ops: spill retention')
    if (process.platform === 'win32') mountWorkspacePreparation(ctx)
    const shells = resolveShells(core)
    // Resolved once at mount: a slot whose executor never resolved publishes no tool at all, so the
    // section below has to report that instead of rendering nothing for the whole session.
    const bashResolution = shells.bash
    bashUnavailable = !bashResolution.available
    ctx.inject(['tools'], inner => mountSessionBash(inner, core, shells, gate))
```

</details>

**依据 4 · 源码核查**：[src/consumer/mount.ts:59-69](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/consumer/mount.ts#L59-L69)

Native/PTC及keepOfficial接线。

<details>
<summary>查看原文（11行）</summary>

```text
  if (plan.presentation === 'native') {
    const residents = plan.files && plan.residentTools ? (plan.residentNames ?? NATIVE_RESIDENT_RAW) : []
    const nativeOwnsGuidance = residents.length
      ? mountNative(ctx, core, { id: plan.id, tools: residents, section: plan.section, gate, extraGuidanceOwner: shellOwnsGuidance })
      : () => false
    if (plan.discovery || plan.native.alwaysLoaded.length || plan.external.allowed.length) mountDiscovery(ctx,
      { ...plan.native, enabled: plan.discovery }, { ...gate, guidance: core.promptPolicy, extraGuidance: core.extraGuidance,
        extraGuidanceOwner: agent => shellOwnsGuidance(agent) || nativeOwnsGuidance(agent),
        residentTools: () => residents.map(publicToolName), external: plan.external })
  } else if (plan.files) ptc = mountPtc(ctx, plan.ptc, { ...gate, guidance: core.promptPolicy, resident: plan.residentTools, dynamic: plan.discovery })
  if (plan.replaceOfficial) mountReplacements(ctx, { id: plan.id, targets: plan.replacementTargets, gate, keepOfficial: () => bashUnavailable, ptc })
```

</details>

**依据 5 · 源码核查**：[src/publication/replacements.ts:13-34](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/publication/replacements.ts#L13-L34)

特定不可恢复Bash错误识别。

<details>
<summary>查看原文（22行）</summary>

```text
/** Bash preparation stages that no retry of the same call can repair; each lifts the official fallback (#962). */
const UNRECOVERABLE_BASH_STAGES = new Set(['bash-runtime-missing', 'bash-ipc-mismatch', 'bash-lifecycle-lock-busy', 'bash-cache-unusable'])

/**
 * Whether one settled replacement-counterpart value reports a runtime failure that
 * retrying the same call cannot repair (#962). Only Bash preparation stages without a
 * retry remedy qualify: a staging interruption is repaired by the next call, and lifting
 * the shadow for it would flap between two tool sets. The stage is the stable second
 * segment of the model-facing EXECUTOR_UNAVAILABLE text (src/bash-runtime-failure.ts);
 * bash-runtime-incompatible keeps its own complete message without that prefix, so its
 * stage name inside the message is its identifier. PTC Outcome failures carry a structured
 * error object, never this text, so they never classify.
 * @param value - one settled tool-call value.
 * @returns whether the official fallback must be restored for the calling agent.
 */
export function unrecoverableCounterpartRuntime(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false
  const error = (value as { error?: unknown }).error
  if (typeof error !== 'string') return false
  const stage = /^EXECUTOR_UNAVAILABLE:\s*([a-z-]+):/.exec(error)
  if (stage !== null) return UNRECOVERABLE_BASH_STAGES.has(stage[1]!)
  return error.includes('bash-runtime-incompatible')
```

</details>

**依据 6 · 源码核查**：[src/publication/replacements.ts:82-95](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/publication/replacements.ts#L82-L95)

PTC可服务集合与发布定义共同判定。

<details>
<summary>查看原文（14行）</summary>

```text
    const hiddenByPtc = (agent: Agent, official: string, counterpart: string): { hidden: boolean; state: string } => {
      const raw = (RAW_OFFICIAL_REPLACEMENTS as Record<string, ApiName>)[official]
      // A counterpart the publisher registered (even before the model selects it)
      // proves a replacement exists; the value of its admission is not consulted,
      // so loading the SDK cannot change this decision.
      const served = ptc!.servable(agent)
      const published = tools.get(counterpart, agent)
      const candidate = served !== undefined && served.has(raw)
      const hidden = candidate && published !== undefined && publicationAdmission(published) !== undefined
      const state = served === undefined ? 'unattached'
        : !candidate ? 'not-servable'
        : hidden ? 'hidden'
        : 'counterpart-missing'
      return { hidden, state }
```

</details>

**依据 7 · 源码核查**：[src/publication/replacements.ts:126-165](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/publication/replacements.ts#L126-L165)

作用域和probe失败时保留官方工具。

<details>
<summary>查看原文（40行）</summary>

```text
    const apply = (agent: Agent, entry: Entry): void => {
      withToolChange([agent], () => {
        for (const [official, counterpart] of targets) {
          if (inactive.has(agent)) return
          const source = sourceFor(agent, official)
          const old = entry.shadows.get(official)
          const current = tools.get(official, agent)
          // A same-scope foreign registration cannot be shadowed; never replace its policy.
          const canShadow = current !== undefined && tools.get(official, entry.probe) !== undefined
            && (sources.has(current) || current === source)
          if (old && old.source === source && canShadow) continue
          if (old) { old.dispose(); entry.shadows.delete(official) }
          if (!source || !canShadow) continue
          const definition = { ...source }
          sources.add(definition)
          const dispose = publicationRegistration(agent.ctx, () => {
            const unregister = agent.ctx.get('tools')!.register(definition, { when: async activation => {
              // Own registrations bypass restrictions in the host view. The empty descendant
              // probe makes our shadow inherited, so even agent-local restrictions still apply.
              if (tools.get(official, entry.probe) !== definition || sourceFor(activation.agent, official) !== source) return false
              if (keepOfficial() || broken.has(activation.agent) || !gate.allows(activation.agent)) return true
              if (ptc && Object.hasOwn(RAW_OFFICIAL_REPLACEMENTS, official)) {
                let ptcNowValue: boolean
                try { ptcNowValue = await ptcNow(activation) }
                catch (error) {
                  // A probe failure carries no replacement proof. Verified host behaviour:
                  // a rejected `when` fails the whole step resolve, so the documented
                  // fail-open contract must be enforced here. Keep the official tool.
                  notePtc(activation.agent, official, 'probe-failed')
                  if (!probeFailures.has(activation.agent)) {
                    probeFailures.add(activation.agent)
                    ctx.logger.warn(`dsh-ops: ${mode} PTC presentation probe failed for ${official}: ${String(error)}`)
                  }
                  return true
                }
                if (ptcNowValue) {
                  // Explicit implementation faults below must surface, not masquerade as a probe failure.
                  const { hidden, state } = hiddenByPtc(activation.agent, official, counterpart)
                  notePtc(activation.agent, official, state)
                  return !hidden
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 写入与移动在部分成功或未知时能否直接重试？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

不能直接重试。宿主文件执行先拒绝凭据路径，按会话自己的临时根和沙箱策略计算写入根；只读或越界写直接拒绝，worker接收固定数据操作而非任意代码。原生transfer对来源revision和目标不存在先作快照校验，再按有序锁复核，复制只锁目标以允许读取不可写来源。该前置检查缩小误操作，但并不把跨步骤任务变成一项全局事务。

copy使用发布函数保留facts和metadataWarnings。move用同文件系统硬链接作不覆盖发布，不降级跨盘copy/delete；发布目标后复核目标与来源revision，再删除来源。任何发布后复核或unlink失败都可能保留两个名称，源码明确RESULT_PARTIAL。此时应先读两端及revision，再决定人工恢复；重复移动可能被目标已存在拒绝，盲目清理也可能丢失需要的数据。

PTC将未识别对象、unknown状态或失败无结构错误映射为RESULT_UNKNOWN，保留观测；partial和unknown不是“没做”。可靠办结需要工具回执与实际文件后置事实一起检查，不能只依据自动建议或一条失败消息判定可重试。平台ACL/扩展元数据仍有条件，不宣称所有复制完整保留安全属性。

#### 证据与依据

**依据 1 · 源码核查**：[src/execution/files.ts:123-158](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/execution/files.ts#L123-L158)

凭据防护、会话临时根和只读拒绝。

<details>
<summary>查看原文（36行）</summary>

```text
  // Credential locations are refused before the worker is spawned, so no read of one ever reaches a
  // result. On by default; a row can turn the fence off for itself (report: credential fence).
  if ((config?.denyCredentialReads ?? true) !== false) {
    for (const target of reads ? reads.files.map(file => file.path) : [operationPath]) {
      const verdict = credentialPath(target)
      if (verdict.denied) {
        const refusal = credentialRefusal(target, verdict.matched)
        return credentialDenied(refusal.message)
      }
    }
  }
  const destination = ['copy', 'move'].includes(tool) ? absoluteTarget(args?.to, cwd) : undefined
  if (['copy', 'move'].includes(tool) && !destination) return failure('INVALID_ARGUMENT', 'to must be a non-empty path.')
  if (destination && (config?.denyCredentialReads ?? true) !== false) {
    const verdict = credentialPath(destination)
    if (verdict.denied) {
      const refusal = credentialRefusal(destination, verdict.matched)
      return credentialDenied(refusal.message)
    }
  }
  // The temporary root is the session's OWN directory, not the shared system temp: the host sandbox
  // grants `/tmp` to workspace-write on Linux, so endorsing the whole directory here would let one
  // session replace another session's temporary files. The kernel still allows more than this fence
  // does; the fence is deliberately the narrower of the two.
  const privateTemp = sessionTempDir(session.id)
  const anchors = sessionAnchors(policy, cwd)
  const trustedPath = (value: string): string => anchoredPath(value, anchors)
  const writeRoots = fileWriteRoots(policy, privateTemp, cwd)
  const writeTargets = tool === 'copy' && destination ? [destination] : [operationPath, ...(destination ? [destination] : [])]
  const requiredMode = (current: SandboxExecutionPolicy): 'workspace-write' | 'danger-full-access' => {
    const roots = fileWriteRoots(current, privateTemp, cwd)
    return writeTargets.every(target => roots.some(root => inside(root, anchoredPath(target, sessionAnchors(current, cwd)))))
      ? 'workspace-write' : 'danger-full-access'
  }
  if (mutates && policy.mode === 'read-only') return denied(policy, tool, requiredMode(policy), 'The user selected read-only; no files were changed.')
  if (mutates && policy.mode === 'workspace-write') {
```

</details>

**依据 2 · 源码核查**：[native/crates/ops-files/src/file_single.rs:632-670](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/native/crates/ops-files/src/file_single.rs#L632-L670)

来源/目标校验与锁边界。

<details>
<summary>查看原文（39行）</summary>

```text
    valid_revision(&args.expected_revision, false)?;
    request.authorize_path(Path::new(&args.path))?;
    let source = crate::file_path::checked(&args.path)?;
    let dest = authorize_write(request, &args.to)?;
    if request.tool == "move" {
        authorize_write(request, &args.path)?;
    }
    if source.display == dest {
        return Err(Failure::new(
            "REVISION_CONFLICT",
            "Source and destination are the same path",
        ));
    }
    // Same reason as write_single: a request that cannot succeed must not create the update
    // sidecar. These are pure snapshots of the source and the destination; the checks below the
    // locks stay the authoritative ones and still decide when a concurrent writer won the race.
    check_file_revision(&source.display, &args.expected_revision)?;
    let snapshot_target = crate::file_path::checked_leaf(&args.to, true)?;
    match snapshot_target
        .parent
        .symlink_metadata(&snapshot_target.name)
    {
        Ok(_) => {
            return Err(Failure::new(
                "REVISION_CONFLICT",
                "Destination exists; no clobber is permitted",
            ));
        }
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => (),
        Err(error) => return Err(error.into()),
    }
    // Total path order avoids deadlock; try-lock still reports concurrency as a CAS conflict.
    let mut names = [args.path.as_str(), args.to.as_str()];
    names.sort();
    let _locks = if request.tool == "copy" {
        // A readable external source may be outside every writable root: no source sidecar.
        vec![lock_single(&args.to)?]
    } else {
        vec![lock_single(names[0])?, lock_single(names[1])?]
```

</details>

**依据 3 · 源码核查**：[native/crates/ops-files/src/file_single.rs:692-740](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/native/crates/ops-files/src/file_single.rs#L692-L740)

copy警告、move硬链接、跨盘拒绝及目标先发布后删源。

<details>
<summary>查看原文（49行）</summary>

```text
    if request.tool == "copy" {
        let (facts, warnings) =
            publish_new(&dest, None, Some(&source), Some(&args.expected_revision))?;
        output = transfer_receipt(&dest, &facts);
        if !warnings.is_empty() {
            output["items"][0]["metadataWarnings"] = json!(warnings);
        }
    } else {
        output = transfer_receipt(
            &dest,
            moved_facts.as_ref().expect("move revision was observed"),
        );
        // A hard link is atomic no-clobber and preserves the original security metadata.
        // The OS rejects cross-device links; never degrade into copy/delete.
        source
            .parent
            .hard_link(&source.name, &target.parent, &target.name)
            .map_err(|error| {
                if error.raw_os_error() == Some(if cfg!(windows) { 17 } else { 18 }) {
                    Failure::new(
                        "CROSS_DEVICE",
                        "Move requires the same filesystem; no copy-delete fallback",
                    )
                } else {
                    error.into()
                }
            })?;
        sync_applied(&target.parent)?;
        check_applied_file_revision(
            &args.to,
            &args.expected_revision,
            "Destination published but its revision differs; source was retained",
        )?;
        check_applied_file_revision(
            &args.path,
            &args.expected_revision,
            "Destination published but source changed; source was retained",
        )?;
        source.parent.remove_file(&source.name).map_err(|error| {
            applied_failure(
                "RESULT_PARTIAL",
                format!("Destination published but source unlink failed: {error}"),
            )
        })?;
        sync_applied(&source.parent)?;
        output["items"]
            .as_array_mut()
            .expect("receipt items")
            .push(json!({"path":source.display,"removed":true}));
```

</details>

**依据 4 · 源码核查**：[src/projections/ptc/outcome.ts:34-46](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/projections/ptc/outcome.ts#L34-L46)

错误结构与下一步安排。

<details>
<summary>查看原文（13行）</summary>

```text
export function toOutcome(tool: string, args: unknown, value: unknown, surface?: NextStepSurface): Outcome<CanonicalData> {
  const data = record(value)
  if (!data) return failure(undefined, 'RESULT_UNKNOWN', 'The worker did not return a canonical object.', 'unknown')
  const error = record(data.error)
  if (error) {
    const code = typeof error.code === 'string' ? error.code : 'RESULT_UNKNOWN'
    const message = typeof error.message === 'string' ? error.message : 'The operation did not return a settled receipt.'
    const state = effect(error, 'unknown')
    const workerNext = typeof error.nextAction === 'string' ? error.nextAction : undefined
    const retry = errorPolicy(code, state).retry
    const recommended = nextStepFor(tool, args, { code, message, retry }, data, surface)
      ?? (workerNext === undefined && retry === 'after-input-change' ? CHANGE_FIRST : undefined)
    return failure(data, code, message, state, workerNext, recommended)
```

</details>

**依据 5 · 源码核查**：[src/projections/ptc/outcome.ts:63-82](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/projections/ptc/outcome.ts#L63-L82)

unknown与部分操作的保留事实。

<details>
<summary>查看原文（20行）</summary>

```text
  const next = typeof data.nextAction === 'string' ? data.nextAction : undefined
  if (data.status === 'unknown' || count(data.unknown) > 0) {
    return failure(data, 'RESULT_UNKNOWN', 'Some effects are unknown; inspect retained observations before any recovery.', 'unknown', next)
  }
  if (data.status === 'rejected' || data.status === 'conflict' || data.status === 'error') {
    return failure(data, 'RESULT_UNKNOWN', 'A failed receipt omitted its structured error.', 'unknown', next)
  }
  // Batch summaries intentionally omit audit rows. Successful planning/execution is still complete.
  if (tool === 'batch') {
    if (data.status === 'completed' || data.status === 'planned') return { status: 'completed', data }
    return failure(data, 'RESULT_PARTIAL', 'The batch contains failed or unsettled operations; inspect detailsRef.',
      count(data.done) > 0 ? 'partial' : 'none', next)
  }
  // Stored rows are not echoed by put/release; their own successful operation is complete.
  if (tool === 'result' && record(args)?.action !== 'page' && data.status === 'completed') return { status: 'completed', data }
  if (count(data.failed) > 0) {
    const recommended = nextStepFor(tool, args, { code: 'RESULT_PARTIAL', message: 'Some items failed; inspect each retained receipt.',
      retry: 'never' }, data, surface)
    return failure(data, 'RESULT_PARTIAL', 'Some items failed; inspect each retained receipt.',
      effect(data, count(data.changed) > 0 ? 'partial' : 'none'), next, recommended)
```

</details>

#### 缺口

- 跨平台权限和异常落盘行为未执行。
  **影响**：源码不能证明故障后文件/元数据在全部平台一致。
  **进一步探讨**：用可复位文件分别在目标平台检验来源变化、目标存在、跨盘和unlink失败，并保存两侧后置事实。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · PTC选取、批处理指导与下一步建议会授予执行权限吗？

**研究主题**：功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

不会。load_sdk只接受配置池和当前策略允许的API，选择先进入pending，返回nextTurn；step/end才把仍获准API移入selected，sandbox/mode会清pending并取消调用。发现名称或提示里出现一个命令不等于当步可执行。该区分使动态发现仍服从Agent作用域与沙箱，用户不能用重复load绕过只读限制。

批处理指导只观察经下游接受、未取消的根run_code，读取完整程序形状并把notice排到下一pre-step，保留原工具结果不改。它是基于程序形态的教学反馈，不是语义证明或失败自动修复；复杂动态代码仍可能不符合检测假设。教过的标记在宿主实际提交对应user/message后才置位，拒绝批次不消耗提示机会。反馈本身带来额外上下文，减少轮次须对照测量。

新next-step给目录、编码和revision冲突生成具体后续调用，但跨工具建议检查callable集合，只读时不建议重新提交变更。outcome调用nextStepFor并将建议放到失败或partial回执；continuation只描述安全读取，不能授权写重放。建议正确与否仍要和effectState及已发生副作用一起判断，RESULT_PARTIAL尤其不能按同参重新执行。

#### 证据与依据

**依据 1 · 源码核查**：[src/publication/ptc.ts:202-231](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/publication/ptc.ts#L202-L231)

权限、选择拒绝及pending/nextTurn。

<details>
<summary>查看原文（30行）</summary>

```text
        if (!permitted(entry.agent, api)) {
          const wasUsable = api !== 'load_sdk' && (resident.has(api) || entry.selected.has(api))
          return failure('POLICY_DENIED', wasUsable
            ? 'This API was admitted for the calling PTC scope, but the sandbox policy has since withdrawn its permission; the admission is revoked. No action executed.'
            : 'The current sandbox policy does not permit this API for the calling PTC scope; no action executed.')
        }
        if (!selected(entry, api)) {
          // A declared-but-unselected pool API points at the loader with an executable
          // next step (#968); every other admission failure keeps the P5 refusal text.
          const deferred = api === 'load_sdk' || full ? undefined : deferredRejection(entry, api)
          if (deferred !== undefined) return deferred
          return api !== 'load_sdk' && gate.dynamic !== false && !full
            ? failure('SDK_NOT_LOADED', `This API (${String(api)}) is not loaded for the current step. Call tools.${publicToolName('load_sdk')} with its raw name; the selection takes effect on the next model step.`)
            : failure('POLICY_DENIED', 'This API is not admitted for the current step and no loader can select it; no action executed.')
        }
        return failure('POLICY_DENIED', 'This API must be admitted for the calling PTC scope; no action executed.')
      }
      const ptc = await isPtc(entry.agent, exec.signal).catch(() => false)
      if (!current() || !ptc || !current()) return refusal(ptc)
      if (api === 'load_sdk') {
        // Validate against the configured pool, then split permission refusals from
        // pool refusals: a mutating API under read-only is inside its pool yet
        // forbidden, and reloading cannot change that permission (#997).
        const requested = requestedApis(args, gate.dynamic === false ? [] : loadable)
        if (typeof requested === 'string') return failure('INVALID_ARGUMENT', requested)
        const forbidden = requested.filter(name => !permitted(entry.agent, name))
        if (forbidden.length) return failure('POLICY_DENIED',
          'The current sandbox policy does not permit ' + forbidden.join(', ') + ' for the calling PTC scope; no action executed.')
        for (const name of requested) entry.pending.add(name)
        return { status: 'completed', tools: requested, nextTurn: true }
```

</details>

**依据 2 · 源码核查**：[src/publication/ptc.ts:453-470](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/publication/ptc.ts#L453-L470)

持久消息提交标记及step/end/策略撤回。

<details>
<summary>查看原文（18行）</summary>

```text
    ctx.on('session/event', (session, event) => {
      if ((event as { type: string }).type === 'agent-preset/selected') { refresh(); return }
      for (const [agent, entry] of entries) if (agent.session === session) {
        // The lesson counts as taught only once the host commits the exact message
        // the pre-step delivered: a rejected or cancelled batch commits nothing, so
        // the next accepted batch teaches again instead of going silent forever.
        if (event.type === 'user/message') {
          if (entry.lessonId !== undefined && (event.data as { id?: unknown }).id === entry.lessonId) {
            entry.taught = true
            entry.lessonId = undefined
          }
        } else if (event.type === 'step/end') {
          for (const api of entry.pending) if (permitted(agent, api)) entry.selected.add(api)
          entry.pending.clear()
          rotateFiles(entry)
        } else if (event.type === 'sandbox/mode') {
          entry.pending.clear(); entry.calls.cancel('Sandbox authority changed')
          rotateFiles(entry)
```

</details>

**依据 3 · 源码核查**：[src/publication/ptc.ts:339-365](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/publication/ptc.ts#L339-L365)

根run_code、accept、未取消及notice入队。

<details>
<summary>查看原文（27行）</summary>

```text
          // The program-shape trigger observes the ROOT run_code call: only there is
          // the whole program text visible. Nested tools.ops_* calls carry a parent
          // token, and their arguments say nothing about the shape of the step.
          entry.disposers.push(agent.ctx!.on('tools/post-execute', async (exec, result, next) => {
            const decision = await next()
            if (decision.kind !== 'accept') return decision
            if (exec.agent !== agent || exec.name !== 'run_code' || exec.parent !== undefined) return decision
            if (exec.signal.aborted) return decision
            const code = (exec.arguments as { code?: unknown } | undefined)?.code
            try {
              // Queue the corrective notice for the next pre-step, where it is
              // delivered as user-role text; the tool result keeps its own value,
              // content and contexts untouched.
              const notice = shapeLatch.observe(agent, code)
              if (notice !== undefined) {
                entry.queuedGuidance.push(notice.text)
                // Observation only: one line, no context, no new dependency.
                if (gate.telemetry === true) {
                  const counts = shapeLatch.stats(agent)
                  ctx.logger.info('dsh-ops batching: turn=' + notice.turn + ' category=' + notice.category
                    + ' plan=' + counts.plan + ' bypass=' + counts.bypass + ' shape=' + counts.shape + ' total=' + counts.total)
                }
              }
            } catch (error) {
              // A delivery failure is an optimisation loss, never a tool failure.
              ctx.logger.warn('dsh-ops: batching notice queueing failed: ' + String(error))
            }
```

</details>

**依据 4 · 源码核查**：[src/projections/ptc/next-step.ts:7-50](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/projections/ptc/next-step.ts#L7-L50)

callable和readOnly限制下一步建议。

<details>
<summary>查看原文（44行）</summary>

```text
/** What the calling step can execute now, resolved by the dispatching runtime. */
export interface NextStepSurface {
  /** Public tool names the calling step admits. */
  readonly callable: ReadonlySet<string>
  /** True when the calling scope's sandbox policy forbids every mutation. */
  readonly readOnly: boolean
}

const record = (value: unknown): CanonicalData | undefined =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? value as CanonicalData : undefined
const call = (rawName: string, args: CanonicalData): string => publicToolName(rawName) + ' ' + JSON.stringify(args)
const admitted = (surface: NextStepSurface | undefined, rawName: string): boolean =>
  surface !== undefined && surface.callable.has(publicToolName(rawName))

/** Render the safe continuation token as an explicit, parameter-legal call. */
export function continueReading(continuation: string): string | undefined {
  const decoded = decodeContinuation(continuation)
  return decoded !== undefined
    ? `Continue this read with ${call(decoded.tool, decoded.args)}; a page that reports complete=true is the last one.`
    : undefined
}

function directoryStep(path: string, surface: NextStepSurface | undefined): string {
  if (admitted(surface, 'glob')) {
    return `The path is a directory, not a file. List its immediate entries with ${call('glob', { path, pattern: ['*'] })}, then read one concrete file path.`
  }
  return 'The path is a directory, not a file, and no directory-listing API is callable in this step; supply one concrete file path.'
}

function encodingStep(tool: string, path: string, surface: NextStepSurface | undefined): string {
  // The calling tool just executed, so the same tool stays callable; a cross-tool
  // recommendation additionally requires an admitted surface entry.
  if (tool === 'inspect_local_file' || admitted(surface, 'inspect_local_file')) {
    return `The bytes are not valid UTF-8. Read a hex window with ${call('inspect_local_file', { path, view: 'hex' })}.`
  }
  return `File ${JSON.stringify(path)} is not valid UTF-8; no hex-capable reader is callable in this step.`
}

function revisionStep(path: string, surface: NextStepSurface | undefined): string {
  const reader = admitted(surface, 'stat') ? 'stat' : admitted(surface, 'inspect_local_file') ? 'inspect_local_file' : undefined
  const resubmit = surface?.readOnly === true ? '' : ', then re-submit with that expectedRevision'
  return reader !== undefined
    ? `The file changed since the revision you observed; nothing was applied. Read the current revision with ${call(reader, { path })}${resubmit}.`
    : `The file changed since the revision you observed; nothing was applied. Read the current revision of ${JSON.stringify(path)} with a callable read API${resubmit}.`
```

</details>

**依据 5 · 源码核查**：[src/projections/ptc/outcome.ts:34-46](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/projections/ptc/outcome.ts#L34-L46)

建议实际接到回执。

<details>
<summary>查看原文（13行）</summary>

```text
export function toOutcome(tool: string, args: unknown, value: unknown, surface?: NextStepSurface): Outcome<CanonicalData> {
  const data = record(value)
  if (!data) return failure(undefined, 'RESULT_UNKNOWN', 'The worker did not return a canonical object.', 'unknown')
  const error = record(data.error)
  if (error) {
    const code = typeof error.code === 'string' ? error.code : 'RESULT_UNKNOWN'
    const message = typeof error.message === 'string' ? error.message : 'The operation did not return a settled receipt.'
    const state = effect(error, 'unknown')
    const workerNext = typeof error.nextAction === 'string' ? error.nextAction : undefined
    const retry = errorPolicy(code, state).retry
    const recommended = nextStepFor(tool, args, { code, message, retry }, data, surface)
      ?? (workerNext === undefined && retry === 'after-input-change' ? CHANGE_FIRST : undefined)
    return failure(data, code, message, state, workerNext, recommended)
```

</details>

**依据 6 · 源码核查**：[src/projections/ptc/outcome.ts:84-97](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/projections/ptc/outcome.ts#L84-L97)

只在安全continuation存在时返回partial续读。

<details>
<summary>查看原文（14行）</summary>

```text
  const incomplete = data.complete === false || data.truncated === true || data.scanComplete === false
    || data.pageComplete === false || data.status === 'partial' || data.status === 'partial_completion'
  if (incomplete) {
    const continuation = continuationFor(tool, args, data)
    if (continuation) {
      const recommended = continueReading(continuation)
      return { status: 'partial', data, coverage: { ...coverage(data, false), isComplete: false }, continuation,
        ...(recommended !== undefined ? { nextAction: recommended } : {}) }
    }
    return failure(data, 'RESULT_PARTIAL', 'Observation is incomplete and has no safe continuation; refine the request.',
      effect(data, count(data.changed) > 0 ? 'applied' : 'none'), next)
  }
  return { status: 'completed', data, ...(typeof data.scanComplete === 'boolean'
    ? { coverage: { ...coverage(data, true), isComplete: true as const } } : {}) }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 精简显示、搜索和PDF读取怎样影响完整性判断？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Native精简多范围读取只在响应状态、revision、行数、nextOffset、complete、顺序路径都一致且没有截断/警告时使用紧凑格式，否则退回一般诊断渲染。它显式显示每文件revision和后续行，并说明可逆转义，不应把一段展示内容当原始文件字节直接粘回。输出更短属于呈现变化，不证明底层扫描更完整。

搜索回执分开scanComplete和pageComplete，并保留scannedFiles、skipReasons、matchedObserved与matchedTotal；grep行数与正则匹配数也不必相同。PTC将扫描、页或输出不完整视为partial；没有安全游标时返回错误及保留观测，而不是伪造下一页。用户仍须以事先列明的必查目录验收，排除规则和索引覆盖可能使“完整扫描”不等于业务任务没有遗漏。

文档读取也有格式边界。所查PDF container只支持有精确头和经典xref的PDF1.0—1.7，文件上限16MiB，并拒绝xref stream、增量等特征。普通文件名.pdf不能保证该读取路径可支持；不能把拒绝后没有文字解释成文件为空。本研究只核查这一显式限制，未声称完整审计PDF提取、编码或全部文件元数据。

#### 证据与依据

**依据 1 · 源码核查**：[src/projections/native/ranges.ts:9-26](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/projections/native/ranges.ts#L9-L26)

紧凑范围渲染要求完整可核事实。

<details>
<summary>查看原文（18行）</summary>

```text
function range(input: unknown, value: unknown): Range | undefined {
  if (!record(input) || !record(value) || value.status !== 'completed' || value.error || value.reference || value.storageError
    || value.truncated !== false || value.truncatedBy !== undefined || value.nextAction !== undefined
    || value.metadataWarnings !== undefined || value.failed !== 0 || !integer(value.lineCount)
    || !integer(value.nextOffset) || typeof value.path !== 'string' || !path.isAbsolute(value.path)
    || typeof value.revision !== 'string' || !/^[a-f0-9]{64}$/.test(value.revision) || !Array.isArray(value.items)) return
  const offset = input.offset ?? 1, limit = input.limit ?? 200
  if (!integer(offset) || offset < 1 || !integer(limit) || limit < 1) return
  const expected = Math.max(0, Math.min(limit, value.lineCount - offset + 1))
  if (value.items.length !== expected || value.nextOffset !== offset + expected
    || value.complete !== (offset - 1 + expected >= value.lineCount)) return
  const lines: Range['lines'] = []
  for (const [index, item] of value.items.entries()) {
    if (!record(item) || item.line !== offset + index || item.path !== value.path || typeof item.text !== 'string'
      || item.view === 'hex' || item.truncatedInLine === true || item.metadataWarnings !== undefined) return
    lines.push({ line: offset + index, text: item.text })
  }
  return { path: value.path, revision: value.revision, total: value.lineCount, next: value.nextOffset, complete: value.complete, lines }
```

</details>

**依据 2 · 源码核查**：[src/projections/native/ranges.ts:29-54](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/projections/native/ranges.ts#L29-L54)

revision、nextOffset与可逆转义提示。

<details>
<summary>查看原文（26行）</summary>

```text
export function compactRanges(input: Row, value: Row): string[] | undefined {
  if (!Array.isArray(input.files) || !Array.isArray(value.items) || !input.files.length || input.files.length !== value.items.length
    || value.reference || value.storageError || value.truncated !== false || value.failed !== 0 || value.pending !== 0
    || value.total !== input.files.length || value.nextIndex !== input.files.length) return
  const observed: Range[] = []
  for (const [index, item] of value.items.entries()) {
    const current = range(input.files[index], item)
    if (!current) return
    observed.push(current)
  }
  const parent = path.dirname(observed[0]!.path)
  const base = observed.length > 1 && observed.every(item => path.dirname(item.path) === parent) ? parent : undefined
  const output = base ? [`[Base: ${quoted(base)}]`] : []
  for (const item of observed) {
    const span = item.lines.length ? `${item.lines[0]!.line}-${item.lines.at(-1)!.line}` : 'none'
    output.push(`=== FILE: ${quoted(base ? path.basename(item.path) : item.path)} (Lines ${span} of ${item.total}) ===`)
    for (const line of item.lines) output.push(`${line.line}|${encodeSourceLine(line.text)}`)
    if (!item.lines.length) output.push(item.total === 0 ? '(empty file)' : '(no lines in this range)')
    output.push(`[revision=${item.revision}; ${item.complete ? 'end of file; complete=true' : `more lines; nextOffset=${item.next}`}]`)
  }
  // The compact reader states the escape contract once for the whole result (#939).
  const escaped = observed.reduce(
    (count, item) => count + item.lines.filter(line => encodeSourceLine(line.text) !== line.text).length, 0)
  if (escaped) output.push(`[Notice: ${escaped} rendered line(s) use reversible escapes; ops_edit_file matches oldText as raw bytes first, then as this displayed form decoded.]`)
  output.push(`[Notice: ${observed.length}/${input.files.length} requested ranges returned.]`)
  return output
```

</details>

**依据 3 · 源码核查**：[src/projections/native/render.ts:146-157](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/projections/native/render.ts#L146-L157)

扫描/页面/匹配等元数据分别显示。

<details>
<summary>查看原文（12行）</summary>

```text
function listing(tool: string, args: Row, value: Row): string[] {
  const output: string[] = []
  const represented: string[] = []
  // These aliases are established by the search kernel, not inferred from equal-looking counts.
  if ((tool === 'glob' || tool === 'grep') && value.scanComplete !== undefined) {
    represented.push('skippedFiles')
    if (count(value.matchedObserved) && value.matched === value.matchedObserved) represented.push('matched')
    // Grep's total counts output rows, which can differ from regex matches.
    if (tool === 'glob' && value.scanComplete === true && count(value.matchedTotal) && value.total === value.matchedTotal) represented.push('total')
  }
  if (value.scanComplete !== undefined) output.push(`[Notice: ${facts(value, ['scanComplete', 'pageComplete', 'scannedFiles', 'skippedFiles', 'skipReasons', 'matchedObserved', 'matchedTotal'])}.]`)
  if (typeof value.nextAction === 'string' && (!record(value.error) || value.error.nextAction !== value.nextAction)) output.push(`Next: ${label(value.nextAction)}`)
```

</details>

**依据 4 · 源码核查**：[src/projections/ptc/outcome.ts:84-97](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/projections/ptc/outcome.ts#L84-L97)

不完整无安全续读时不伪造分页。

<details>
<summary>查看原文（14行）</summary>

```text
  const incomplete = data.complete === false || data.truncated === true || data.scanComplete === false
    || data.pageComplete === false || data.status === 'partial' || data.status === 'partial_completion'
  if (incomplete) {
    const continuation = continuationFor(tool, args, data)
    if (continuation) {
      const recommended = continueReading(continuation)
      return { status: 'partial', data, coverage: { ...coverage(data, false), isComplete: false }, continuation,
        ...(recommended !== undefined ? { nextAction: recommended } : {}) }
    }
    return failure(data, 'RESULT_PARTIAL', 'Observation is incomplete and has no safe continuation; refine the request.',
      effect(data, count(data.changed) > 0 ? 'applied' : 'none'), next)
  }
  return { status: 'completed', data, ...(typeof data.scanComplete === 'boolean'
    ? { coverage: { ...coverage(data, true), isComplete: true as const } } : {}) }
```

</details>

**依据 5 · 源码核查**：[native/crates/ops-documents/src/pdf_container.rs:186-203](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/native/crates/ops-documents/src/pdf_container.rs#L186-L203)

16MiB与经典xref格式边界。

<details>
<summary>查看原文（18行）</summary>

```text
pub fn parse(data: &[u8]) -> Result<Document<'_>> {
    if data.len() > MAX_FILE {
        return Err(limit("PDF file exceeds 16 MiB"));
    }
    if data.len() < 9
        || &data[..7] != b"%PDF-1."
        || !matches!(data[7], b'0'..=b'7')
        || !matches!(data[8], 10 | 13)
    {
        return Err(unsupported(
            "Only PDF 1.0-1.7 with an exact header and classic xref table is supported",
        ));
    }
    let (xref, footer_start) = footer(data)?;
    if !data[xref..].starts_with(b"xref") {
        return Err(unsupported(
            "PDF requires a classic xref table; xref streams are unsupported",
        ));
```

</details>

**依据 6 · 源码核查**：[native/crates/ops-documents/src/pdf_container.rs:247-266](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/native/crates/ops-documents/src/pdf_container.rs#L247-L266)

增量等格式被拒绝。

<details>
<summary>查看原文（20行）</summary>

```text
    let trailer = lexer.value(0)?;
    let trailer = trailer.dict()?;
    // Only a trailer key means "this file has an earlier xref section"; the same
    // names inside an object dictionary are ordinary keys (outline items carry
    // `/Prev` for their previous sibling).
    for key in [b"Prev".as_slice(), b"XRefStm"] {
        if trailer.contains_key(key) {
            return Err(unsupported(
                "Encrypted, incremental, object-stream and xref-stream PDFs are unsupported",
            ));
        }
    }
    let size = get(trailer, b"Size")?.integer()?;
    if size == 0
        || size > MAX_OBJECTS
        || entries.len() != size
        || entries.keys().copied().ne(0..size)
    {
        return Err(bad(
            "PDF xref must fully declare its bounded Size without incremental sections",
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装、退出默认预设和失败恢复有哪些实际负担？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

首次需核对包声明的Node/DSH范围、平台worker和宿主注入服务；版本下限检查只拒绝已知过旧版本，不代替发行物和平台实测。持续成本包含模型上下文、程序形态反馈、缓存/溢出结果磁盘以及策略与模式维护；失败成本包含部分操作后检查文件、重载依赖和人工恢复。现金、时延、资源峰值与节Token比例没有本轮测量，不能因为原生或批处理就写低成本。

ops-ptc注册为宿主预设，设为新会话默认是明确动作且会回读；退出时除了释放声明，根effect还调用restoreLeftoverDefault。它仅在当前selectedDefault仍为本预设时选择宿主默认，设置服务不可用、无可用fallback或写失败会记录警告。因此当前实现有最佳努力恢复，不应沿用“永不改变默认”的旧注释作为行为结论，也不能宣称卸载必然恢复。用户须检查新会话默认是否仍有效。

建议个人隔离小仓库先比较只读检索与一项可复位改动，预先记录必查目录、预期revision和输出。worker不可用、回执无法解释、部分变更后状态不明或退出预设仍悬空时停止OPS，回官方工具/原脚本处理；回收磁盘前保留所需结果并核对作业是否停止，不能把禁用等同于结果已回收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-3](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/package.json#L1-L3)

固定版本。

```text
{
  "name": "dsh-ops",
  "version": "0.5.6",
```

**依据 2 · 源码核查**：[src/adapter/dsh/host-floor.ts:89-96](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/adapter/dsh/host-floor.ts#L89-L96)

下限而非全兼容检查。

```text
export async function assertHostFloor(ctx: Context): Promise<void> {
  const floor = declaredHostFloor()
  if (floor === undefined) return
  const { runtimeVersion: version } = await runtimeVersion(ctx)
  if (version === 'unknown') return
  if (versionBelowFloor(version, floor)) {
    throw new Error(`This dsh-ops build requires DSH ${floor} or newer (package.json engines.dsh); the running host reports ${version}. Upgrade the host runtime instead of reloading this plugin: an older host loads it halfway at best, showing TypeError scope errors backstage and EXECUTOR_UNAVAILABLE in front.`)
  }
```

**依据 3 · 源码核查**：[src/presets/ops-ptc/register.ts:218-233](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/presets/ops-ptc/register.ts#L218-L233)

明确设置默认并回读。

<details>
<summary>查看原文（16行）</summary>

```text
async function applyDefaultPreset(live: LiveRegistration, options: RegistrationOptions): Promise<PresetDefaultAction> {
  const { ctx, registry } = live
  if (ctx === undefined || registry === undefined) {
    return { status: 'unavailable',
      message: 'the OPS (PTC) preset is not registered right now (the dsh-ops row is disabled or still starting), so the default preset was not changed' }
  }
  const before = currentDefault(registry)
  if (before === PRESET_ID) return { status: 'no-update', message: 'new sessions already default to OPS (PTC)', defaultPreset: before }
  const failure = await writeSelectedDefault(ctx, PRESET_ID)
  if (failure !== undefined) {
    warn(options, ctx, `dsh-ops: ${failure}.`)
    return { status: 'failed', message: failure }
  }
  const after = currentDefault(registry)
  if (after !== PRESET_ID) return { status: 'failed', message: `the host did not keep the new default (it reports ${after ?? 'no default'})` }
  return { status: 'applied', message: 'new sessions now default to OPS (PTC)', defaultPreset: after }
```

</details>

**依据 4 · 源码核查**：[src/presets/ops-ptc/register.ts:265-293](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/presets/ops-ptc/register.ts#L265-L293)

默认恢复条件与警告。

<details>
<summary>查看原文（29行）</summary>

```text
/**
 * Restore the profile default this row is about to strand.
 *
 * Unload and disable remove the ops-ptc preset, but the profile keeps the
 * `selectedDefault` the operator's one click wrote: every new session then
 * fails to compose against a preset that no longer exists (#928). The lease
 * writes the host default back — only when the live value still names this
 * row's preset; a default naming any other preset is an operator choice and is
 * never touched. Best effort with a warning: a host without a usable settings
 * service, or one that refuses the write, reports the leftover and its
 * remediation instead of guessing.
 * @param served - the last registration this row served.
 * @param options - test seams; production passes none.
 */
async function restoreLeftoverDefault(served: LiveRegistration, options: RegistrationOptions): Promise<void> {
  const { ctx, registry } = served
  if (ctx === undefined || registry === undefined) return
  if (currentDefault(registry) !== PRESET_ID) return
  const fallback = hostDefaultOf(registry)
  if (fallback === undefined) {
    warn(options, ctx, 'dsh-ops: the profile still names the removed ops-ptc preset as its default; choose another default on the host settings page.')
    return
  }
  const failure = await writeSelectedDefault(ctx, fallback, served.settings)
  if (failure !== undefined) {
    warn(options, ctx, `dsh-ops: ${failure}; the profile still names the removed ops-ptc preset, so new sessions may fail to compose until another default is chosen.`)
    return
  }
  warn(options, ctx, `dsh-ops: restored the default agent preset to ${fallback}, because the ops-ptc preset was removed with this row.`)
```

</details>

**依据 5 · 源码核查**：[src/presets/ops-ptc/register.ts:491-501](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/presets/ops-ptc/register.ts#L491-L501)

释放声明和根effect恢复接线。

<details>
<summary>查看原文（11行）</summary>

```text
      releaseRegistration(ctx, slot, options)
    }, 'dsh-ops: ops-ptc preset')
    void activate(ctx, registry, slot, options, live, served).catch(error => {
      warn(options, ctx, `dsh-ops: cannot register the ops-ptc agent preset: ${errorText(error)}; the preset stays unavailable.`)
    })
  })
  // The lease below is the row's own lifetime: the Loader reuses a row's fiber
  // across a config remount, so a remount never fires it. It fires when the row
  // is disabled or unloaded — the one moment the profile can be left naming a
  // preset that no longer exists (#928).
  root.effect(() => () => { void restoreLeftoverDefault(served, options) }, 'dsh-ops: ops-ptc preset default lease')
```

</details>

**依据 6 · 源码核查**：[cordis.patch.yml:21-69](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/cordis.patch.yml#L21-L69)

溢出/结果缓存设置与默认开关。

<details>
<summary>查看原文（49行）</summary>

```text
        minimal:
          enabled: true
          spillRetentionDays: 30
          spillTotalBudgetMiB: 256
          spillSweepEnabled: true
        standard:
          enabled: true
          residentTools: true
          spillRetentionDays: 30
          spillTotalBudgetMiB: 256
          spillSweepEnabled: true
        ptc:
          enabled: true
          residentTools: true
          spillRetentionDays: 30
          spillTotalBudgetMiB: 256
          spillSweepEnabled: true
        # The batching-guidance arm: its preset inherits the PTC tool surface and
        # turns the guidance on. Other modes keep the key absent (default false).
        ops-ptc:
          enabled: true
          residentTools: true
          batchingGuidance: true
          spillRetentionDays: 30
          spillTotalBudgetMiB: 256
          spillSweepEnabled: true
        cordis:
          enabled: true
          residentTools: true
          spillRetentionDays: 30
          spillTotalBudgetMiB: 256
          spillSweepEnabled: true
        discovery:
          enabled: true
        # Inert until template is set; off by default so an install that never
        # opted in gets no listener at all.
        download-guard:
          enabled: false
          downloadGuard:
            template: ""
        # Result-cache retention. The aggregate budgets stay 0 (report only): the default sweep
        # only reclaims roots whose cache data is already gone. maxAgeMs is the idle grace that
        # protects another live host sharing the temp directory.
        resultCache:
          enabled: true
          maxRoots: 0
          maxTotalBytes: 0
          maxAgeMs: 3600000
          sweepEnabled: true
```

</details>

#### 缺口

- 实际发行物、平台运行及恢复耗时未核验。
  **影响**：只能建议有界试用，不能承诺持续运行收益或卸载完全回收。
  **进一步探讨**：按目标平台验证只读、可复位写入、失败回执与禁用后新会话默认，记录全部成本。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 把任务清单与回执联合验收能否减少遗漏和重复写入？

**研究主题**：新假设与验证

#### 完整回答

可以提出未验证假设：对仓库盘点或小批改动，预先固定必查路径与预期后置状态，再将scan/page完整性、effectState和实际revision共同作为完成判据，可能比单读completed或Next提示更少遗漏和重复写入。插件已经提供可用回执和受权限限制的建议，联合任务验收还需要调用方维护任务语义，不能算当前工具自动保证。

最小验证用同一组有排除文件、长行、不可读目录、revision冲突、目标已发布但源删除失败的任务，比较只读工具status与联合清单。保持模型、平台、初始目录和权限一致，记录合格办结比例、重复变更、漏项、人工复核和全部调用/结果资源。若联合清单只是增加操作而不降低错误，或误把已应用副作用重新执行，则不支持推广。下一步建议是否可执行还应在只读和缺工具作用域下检验，不以出现命令文本作成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/projections/native/render.ts:146-157](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/projections/native/render.ts#L146-L157)

可用于任务覆盖核对的事实。

<details>
<summary>查看原文（12行）</summary>

```text
function listing(tool: string, args: Row, value: Row): string[] {
  const output: string[] = []
  const represented: string[] = []
  // These aliases are established by the search kernel, not inferred from equal-looking counts.
  if ((tool === 'glob' || tool === 'grep') && value.scanComplete !== undefined) {
    represented.push('skippedFiles')
    if (count(value.matchedObserved) && value.matched === value.matchedObserved) represented.push('matched')
    // Grep's total counts output rows, which can differ from regex matches.
    if (tool === 'glob' && value.scanComplete === true && count(value.matchedTotal) && value.total === value.matchedTotal) represented.push('total')
  }
  if (value.scanComplete !== undefined) output.push(`[Notice: ${facts(value, ['scanComplete', 'pageComplete', 'scannedFiles', 'skippedFiles', 'skipReasons', 'matchedObserved', 'matchedTotal'])}.]`)
  if (typeof value.nextAction === 'string' && (!record(value.error) || value.error.nextAction !== value.nextAction)) output.push(`Next: ${label(value.nextAction)}`)
```

</details>

**依据 2 · 源码核查**：[src/projections/ptc/outcome.ts:63-97](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/projections/ptc/outcome.ts#L63-L97)

unknown/partial及安全续读边界。

<details>
<summary>查看原文（35行）</summary>

```text
  const next = typeof data.nextAction === 'string' ? data.nextAction : undefined
  if (data.status === 'unknown' || count(data.unknown) > 0) {
    return failure(data, 'RESULT_UNKNOWN', 'Some effects are unknown; inspect retained observations before any recovery.', 'unknown', next)
  }
  if (data.status === 'rejected' || data.status === 'conflict' || data.status === 'error') {
    return failure(data, 'RESULT_UNKNOWN', 'A failed receipt omitted its structured error.', 'unknown', next)
  }
  // Batch summaries intentionally omit audit rows. Successful planning/execution is still complete.
  if (tool === 'batch') {
    if (data.status === 'completed' || data.status === 'planned') return { status: 'completed', data }
    return failure(data, 'RESULT_PARTIAL', 'The batch contains failed or unsettled operations; inspect detailsRef.',
      count(data.done) > 0 ? 'partial' : 'none', next)
  }
  // Stored rows are not echoed by put/release; their own successful operation is complete.
  if (tool === 'result' && record(args)?.action !== 'page' && data.status === 'completed') return { status: 'completed', data }
  if (count(data.failed) > 0) {
    const recommended = nextStepFor(tool, args, { code: 'RESULT_PARTIAL', message: 'Some items failed; inspect each retained receipt.',
      retry: 'never' }, data, surface)
    return failure(data, 'RESULT_PARTIAL', 'Some items failed; inspect each retained receipt.',
      effect(data, count(data.changed) > 0 ? 'partial' : 'none'), next, recommended)
  }
  const incomplete = data.complete === false || data.truncated === true || data.scanComplete === false
    || data.pageComplete === false || data.status === 'partial' || data.status === 'partial_completion'
  if (incomplete) {
    const continuation = continuationFor(tool, args, data)
    if (continuation) {
      const recommended = continueReading(continuation)
      return { status: 'partial', data, coverage: { ...coverage(data, false), isComplete: false }, continuation,
        ...(recommended !== undefined ? { nextAction: recommended } : {}) }
    }
    return failure(data, 'RESULT_PARTIAL', 'Observation is incomplete and has no safe continuation; refine the request.',
      effect(data, count(data.changed) > 0 ? 'applied' : 'none'), next)
  }
  return { status: 'completed', data, ...(typeof data.scanComplete === 'boolean'
    ? { coverage: { ...coverage(data, true), isComplete: true as const } } : {}) }
```

</details>

**依据 3 · 源码核查**：[native/crates/ops-files/src/file_single.rs:720-735](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/native/crates/ops-files/src/file_single.rs#L720-L735)

发布后源仍可能保留，提供重复执行反例。

<details>
<summary>查看原文（16行）</summary>

```text
        check_applied_file_revision(
            &args.to,
            &args.expected_revision,
            "Destination published but its revision differs; source was retained",
        )?;
        check_applied_file_revision(
            &args.path,
            &args.expected_revision,
            "Destination published but source changed; source was retained",
        )?;
        source.parent.remove_file(&source.name).map_err(|error| {
            applied_failure(
                "RESULT_PARTIAL",
                format!("Destination published but source unlink failed: {error}"),
            )
        })?;
```

</details>

**依据 4 · 源码核查**：[src/projections/ptc/next-step.ts:7-50](https://github.com/T-Auto/dsh-ops/blob/bfdfdf68765f8bdd04914df0cade49de21913746/src/projections/ptc/next-step.ts#L7-L50)

下一步文本受callable/只读限制但不授予权限。

<details>
<summary>查看原文（44行）</summary>

```text
/** What the calling step can execute now, resolved by the dispatching runtime. */
export interface NextStepSurface {
  /** Public tool names the calling step admits. */
  readonly callable: ReadonlySet<string>
  /** True when the calling scope's sandbox policy forbids every mutation. */
  readonly readOnly: boolean
}

const record = (value: unknown): CanonicalData | undefined =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? value as CanonicalData : undefined
const call = (rawName: string, args: CanonicalData): string => publicToolName(rawName) + ' ' + JSON.stringify(args)
const admitted = (surface: NextStepSurface | undefined, rawName: string): boolean =>
  surface !== undefined && surface.callable.has(publicToolName(rawName))

/** Render the safe continuation token as an explicit, parameter-legal call. */
export function continueReading(continuation: string): string | undefined {
  const decoded = decodeContinuation(continuation)
  return decoded !== undefined
    ? `Continue this read with ${call(decoded.tool, decoded.args)}; a page that reports complete=true is the last one.`
    : undefined
}

function directoryStep(path: string, surface: NextStepSurface | undefined): string {
  if (admitted(surface, 'glob')) {
    return `The path is a directory, not a file. List its immediate entries with ${call('glob', { path, pattern: ['*'] })}, then read one concrete file path.`
  }
  return 'The path is a directory, not a file, and no directory-listing API is callable in this step; supply one concrete file path.'
}

function encodingStep(tool: string, path: string, surface: NextStepSurface | undefined): string {
  // The calling tool just executed, so the same tool stays callable; a cross-tool
  // recommendation additionally requires an admitted surface entry.
  if (tool === 'inspect_local_file' || admitted(surface, 'inspect_local_file')) {
    return `The bytes are not valid UTF-8. Read a hex window with ${call('inspect_local_file', { path, view: 'hex' })}.`
  }
  return `File ${JSON.stringify(path)} is not valid UTF-8; no hex-capable reader is callable in this step.`
}

function revisionStep(path: string, surface: NextStepSurface | undefined): string {
  const reader = admitted(surface, 'stat') ? 'stat' : admitted(surface, 'inspect_local_file') ? 'inspect_local_file' : undefined
  const resubmit = surface?.readOnly === true ? '' : ', then re-submit with that expectedRevision'
  return reader !== undefined
    ? `The file changed since the revision you observed; nothing was applied. Read the current revision with ${call(reader, { path })}${resubmit}.`
    : `The file changed since the revision you observed; nothing was applied. Read the current revision of ${JSON.stringify(path)} with a callable read API${resubmit}.`
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
