# dsh-ops

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2c0b039](https://github.com/T-Auto/dsh-ops/tree/2c0b0397ce4b48436ff76cf5c5b039054240a45c)

<!-- BEGIN META -->
[![GitHub ★ 4,935](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C935&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/T-Auto/dsh-ops) [![npm 30d 97,591](https://img.shields.io/static/v1?label=npm+30d&message=97%2C591&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ops) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ops)
<!-- END META -->

> **功能**：为 DSH 提供文件、文档和 PTC 工具，以及按需发现和可配置的官方工具替换。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明它将 worker 文件能力、预设与动态发布组合进宿主；[Q03](#research-q03) 的归属检查降低错误替换表面的风险，但不证明节省或语义等价。

> **主要限制**：[Q03](#research-q03) 和 [Q04](#research-q04) 的核心问题是隐藏原生工具及压缩输出是否导致漏读或错误修改；准备检查不是语义对照，中断和缓存清理也不能保证没有残留。

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
  - [Q01 · 谁适合使用，合格结果及原生替代是什么？](#detail-section-11)
  - [Q02 · 入口如何经预设发布工具并执行文件操作？](#detail-section-12)
  - [Q03 · 官方工具隐藏的触发与安全边界是什么？](#detail-section-13)
  - [Q04 · 中断和结果缓存清理能证明什么？](#detail-section-14)
  - [Q05 · 兼容、权限与使用成本有哪些条件？](#detail-section-15)
  - [Q06 · 如何避免把局部完整当作任务完整？](#detail-section-16)
  - [Q07 · 对谁值得试用，何时停用？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向能复核文件结果、反复进行代码和文档操作的 DSH 用户；合格结果是修改正确、范围完整且成本可接受。

原生 read、glob、grep、宿主 shell 和手写 PTC 已支持部分操作；本组件集中提供紧凑输出与按需工具，并有选择地隐藏重复入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Native 文件工具 | 读取、搜索和修改 | 需要 worker 与宿主策略，结果需核对 |
| PTC 与按需发现 | 组合或按需加载工具 | 依赖对应预设和宿主能力 |
| 官方工具替换 | 减少重复工具入口 | 仅对选定项且需准备检查 |
| 结果生命周期 | 约束会话引用和取消 | 清理失败可能留下物理缓存 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 声明范围内的 DSH 与 Node | 接入必需 | 宿主 scope、策略和工具 | 兼容性未知或不能注册 |
| 平台 worker | 文件操作必需 | 执行工具 | 未就绪时原生能力不发布 |
| 宿主 sandboxPolicy 和 subprocess | 代表路径必需 | 策略校验与固定功能 worker | 返回执行器不可用 |
| workspace 权限 | 修改时必需 | 文件写入 | 拒绝并人工检查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份并核查版本与 worker | 保留原生回退 |
| 试用 | 在隔离副本读取固定文件 | 检查截断、范围与引用 |
| 完成 | 对照完整内容和文件差异 | 异常时停止重试并核查副作用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | 下载与机器资源未知 | 核对 profile、worker 和宿主 | dry-run 不证明兼容 |
| 使用 | 模型与 worker 成本未知 | 审核范围和结果 | token 节省未对照 |
| 故障 | 可能产生重试费用 | 回读文件及清理状态 | 中断效果可能未知 |
| 退出 | 文件备份与恢复资源 | 确认工具恢复与残留 | 不自动撤销写入 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 工具面 | 预设、动态发布及归属检查 | 语义等价和净节省 |
| 结果与状态 | 输出异常和会话生命周期有明确分支 | 故障后实际效果与物理清理 |

> **思考**：[Q03](#research-q03) 和 [Q04](#research-q04) 的核心问题是隐藏原生工具及压缩输出是否导致漏读或错误修改；准备检查不是语义对照，中断和缓存清理也不能保证没有残留。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明它将 worker 文件能力、预设与动态发布组合进宿主；[Q03](#research-q03) 的归属检查降低错误替换表面的风险，但不证明节省或语义等价。

[Q02](#research-q02) 以 scope 和宿主策略连接固定功能 worker，Native 文件路径未使用通用进程沙箱；[Q03](#research-q03) 通过归属与完整准备检查避免部分遮蔽，[Q04](#research-q04) 的清理警告不代表文件一定删除。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 和 [Q04](#research-q04) 的核心问题是隐藏原生工具及压缩输出是否导致漏读或错误修改；准备检查不是语义对照，中断和缓存清理也不能保证没有残留。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q07](#research-q07) 先在可恢复副本做只读任务并检查结果完整性和回退；遇到准备失败、遗漏或状态未知先核对文件，不盲目重试。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持代表性注册、工具调用与生命周期判断；目标宿主、worker、效率和未来假设均未运行验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/presets/defaults.ts、src/consumer/mount.ts、src/publication/native.ts、src/official-tool-hiding.ts、src/execution/files.ts、src/execution/transport.ts、src/execution/runtime.ts、src/kernel/result-lifecycle.ts、src/projections/native/render.ts、src/projections/native/ranges.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本仅静态核查 README、bundle、预设、Native 发布、worker 策略和会话生命周期的代表路径；未全审 worker 原生实现、所有 PTC API 或其他宿主。
- 下一步：以固定宿主和可丢弃文件集比较原生、现有 OPS 和 [Q06](#research-q06) 对账原型，记录覆盖、误报、总 token、时间；另故障注入中断和缓存清理。

**分析版本**

- **仓库**：[T-Auto/dsh-ops](https://github.com/T-Auto/dsh-ops)
- **版本号**：0.5.0-alpha3（[固定提交 2c0b039](https://github.com/T-Auto/dsh-ops/tree/2c0b0397ce4b48436ff76cf5c5b039054240a45c)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 假设以宿主观察对账任务目标文件与实际结果，可暴露局部完整但任务不完整；现有截断与分页提示是反证，收益、误报和成本未测。

以固定宿主和可丢弃文件集比较原生、现有 OPS 和 [Q06](#research-q06) 对账原型，记录覆盖、误报、总 token、时间；另故障注入中断和缓存清理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 86 | 11246 | — | — | 150236 |
| .mjs | source | 49 | 12420 | 8474 | 3328 | — |
| .mjs | example | 9 | 1421 | 901 | 432 | — |
| .ts | source | 216 | 14796 | 11195 | 3097 | — |
| .tsx | source | 5 | 502 | 393 | 99 | — |
| .mjs | test | 181 | 31090 | 26492 | 3023 | — |
| .ts | test | 10 | 414 | 317 | 83 | — |

</details>

**活跃度**

[![Issue 未关闭 51](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=51&color=737b86&logo=github)](https://github.com/T-Auto/dsh-ops/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 259](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=259&color=737b86&logo=github)](https://github.com/T-Auto/dsh-ops/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 208](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=208&color=737b86&logo=github)](https://github.com/T-Auto/dsh-ops/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 文件工具接线、替换条件、状态恢复和实际采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁适合使用，合格结果及原生替代是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向 DSH 中反复读取、搜索、编辑文件的编码用户：合格结果是相关文件内容和最终修改可核对，同时成本可接受。原生 read、glob、grep、宿主 shell 和直接手写 PTC 都可完成一部分任务；本包的增量是组合较紧凑的 OPS 工具、按需发现和可配置替换，而不是文件编辑或沙箱本身。README 把减少 token 和轮次作为目标与作者主张，本轮没有可复验的同任务对照，不能认定节省或更兼容。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-30](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/README.md#L21-L30)

作者定义工具、动态发现和效率目标。

<details>
<summary>查看原文（10行）</summary>

```text
# dsh-ops

以提高token效率为目的，提供新增的ops系列工具并隐藏部分官方工具为方案的插件，低改动面，低侵入性，与其他插件广泛兼容。

- Bash 与宿主 Shell 隐藏独立配置；Windows 可用 ops_bash 替代 pwsh，也可保留官方 Shell。
- Native/PTC 消费者预设发布共享的有界工具面；Bash 由单行开关控制，关闭替换时原版工具保持可用。
- 启用 DSH 预留的 `tools_addition` 动态工具加载，并提供渐进式纰漏的工具，作为高级功能（如pdf、word读取、超多文件批量修改）的加载平台，大大减少常见特定场景的token消耗量，且不会导致系统提示词膨胀
- 为 Native 模式提供返回紧凑、带行号和更好错误回馈的工具以遏制报错循环，减少调用轮次
- 为 PTC 模式提供一些返回结构化 JSON 值的工具以降低 ai 在 ptc 模式下编写 TypeScript 代码的token总量和心智负担
- PTC SDK 目录包含 18 个 API：15 个文件/文档工具，加批处理、结果引用和加载器。
```

</details>

**依据 2 · 源码核查**：[src/presets/defaults.ts:32-41](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/presets/defaults.ts#L32-L41)

标准与 Cordis 模式选择 read、glob、grep 替换；PTC 不等同原生面。

<details>
<summary>查看原文（10行）</summary>

```text
const NATIVE_REPLACEMENTS: readonly OfficialReplacement[] = Object.freeze(['read', 'glob', 'grep'])

/** Everything one mode publishes; consumers read this instead of branching on ids. */
export const MODE_PLANS: Readonly<Record<ModeId, ModePlan>> = Object.freeze({
  // Minimal keeps its terse prompts: only the Windows shell is replaced, and
  // advanced tools arrive through the discovery entry when that row is on.
  minimal: Object.freeze({ nativeFiles: false, replacements: [], shell: true, ptc: false, discovery: 'all', section: null }),
  standard: Object.freeze({ nativeFiles: true, replacements: NATIVE_REPLACEMENTS, shell: true, ptc: false, discovery: 'advanced', section: 'standard' }),
  ptc: Object.freeze({ nativeFiles: false, replacements: [], shell: true, ptc: true, discovery: 'none', section: 'ptc' }),
  cordis: Object.freeze({ nativeFiles: true, replacements: NATIVE_REPLACEMENTS, shell: true, ptc: false, discovery: 'advanced', section: 'cordis' }),
```

</details>

#### 缺口

- 未比较相同文件任务的正确率、轮次和成本
  **影响**：无法推断净收益或用户需求频率
  **进一步探讨**：固定宿主与任务，比较原生工具和 OPS 的合格结果及总成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口如何经预设发布工具并执行文件操作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

bundle patch 插入一个 dsh-ops 行，默认启用四种预设及动态工具，panel 和 TUI 默认关闭；src/index.ts 为各预设解析配置并挂载。consumer/mount.ts 按 native 或 PTC 发布文件能力和发现服务，native.ts 首先解析平台 worker，绑定 scope；调用时要求当前 Agent 和已注册定义一致。files.ts 的 invoke 以会话绑定、调用预算和可信 cwd 转入 invokeTrusted，检查宿主 sandboxPolicy/subprocess、合法策略及默认凭据路径拒绝，随后按路径和宿主策略构造固定功能 worker 请求。该 Native 文件路径不调用通用进程 sandbox.confine，而依赖 DSH fs 策略边界及 worker 的固定操作约束；不能把它称为 OS 沙箱隔离。transport 等待进程并检查采集、取消、退出码和 JSON。此路径是固定源码中代表性的 Native 文件路径，未检查全部 PTC API 或证明平台运行。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:9-35](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/cordis.patch.yml#L9-L35)

bundle 入口及默认开关。

<details>
<summary>查看原文（27行）</summary>

```text
- insert:
    - id: dsh-ops
      name: dsh-ops
      config:
        # Four bundle switches (one per preset switch), then each preset; all default on.
        global:
          bash: true
          hidePwsh: true
          hideOfficialTools: true
          dynamicTools: true
        minimal:
          enabled: true
        standard:
          enabled: true
          residentTools: true
        ptc:
          enabled: true
          residentTools: true
        cordis:
          enabled: true
          residentTools: true
        discovery:
          enabled: true
        panel:
          enabled: false
        tui:
          enabled: false
```

</details>

**依据 2 · 源码核查**：[src/index.ts:28-53](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/index.ts#L28-L53)

根入口解析预设并挂载。

<details>
<summary>查看原文（26行）</summary>

```text
export async function apply(root: Context, rawConfig: unknown): Promise<void> {
  const config = resolveMergedConfig(rawConfig)
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
  beginMergedRow()
  try {
    // The browser half mounts its `opsSettings` remote; the legacy shell row used
    // to provide that seam, so the merged row owns it now.
    await host.plugin({ name: 'dsh-ops/runtime-settings', apply: (ctx: Context) => mountRuntimeSettings(ctx) })
    for (const mode of ['minimal', 'standard', 'ptc', 'cordis'] as const) {
      const state = config[mode]
      const effective = resolveModeConfig(effectiveMode(state, config.global, typeof config.other.raw?.pwsh7Link === 'boolean' ? config.other.raw.pwsh7Link : companionVersion({ sweep: false }) !== undefined), mode)
      await host.plugin({ name: `dsh-ops/consumer-${mode}`, apply(ctx: Context) {
        applyResolvedMode(ctx, effective, mode, { enabled: state.enabled,
          discovery: { ...config.discovery.config, enabled: config.discovery.enabled },
          dynamic: dynamicForMode(state, config.global) })
      } })
    }
```

</details>

**依据 3 · 源码核查**：[src/consumer/mount.ts:14-35](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/consumer/mount.ts#L14-L35)

按展示方式选择 native、PTC、发现和替换。

<details>
<summary>查看原文（22行）</summary>

```text
export function mountConsumer(ctx: Context, plan: ConsumerPlan): void {
  const { gate, core } = plan
  if (plan.shell) {
    if (process.platform === 'win32') mountWorkspacePreparation(ctx)
    const shells = resolveShells(core)
    ctx.inject(['tools'], inner => mountSessionBash(inner, core, shells, gate))
    if (core.promptPolicy && (!plan.files || !plan.residentTools)) ctx.inject(['tools', 'systemPrompt'], inner => {
      inner.effect(() => inner.systemPrompt.section({ name: `${TOOLING_SECTION}:consumer-shell-${plan.id}`, order: 3254, interpolate: false,
        text: context => {
          const agent = context.agent ?? context.scope as Parameters<typeof gate.allows>[0]
          return agent && gate.allows(agent) ? renderToolingPolicy({ published: inner.get('tools')?.get(BASH_TOOL, agent) ? [BASH_TOOL] : [], extraGuidance: core.extraGuidance }) : ''
        } }), 'dsh-ops: consumer shell guidance')
    })
  }
  if (plan.presentation === 'native') {
    const residents = plan.files && plan.residentTools ? (plan.residentNames ?? NATIVE_RESIDENT_RAW) : []
    if (residents.length) mountNative(ctx, core, { id: plan.id, tools: residents, section: plan.section, gate })
    if (plan.discovery || plan.native.alwaysLoaded.length || plan.external.allowed.length) mountDiscovery(ctx,
      { ...plan.native, enabled: plan.discovery }, { ...gate, guidance: core.promptPolicy, extraGuidance: core.extraGuidance,
        residentTools: () => residents.map(publicToolName), external: plan.external })
  } else if (plan.files) mountPtc(ctx, plan.ptc, { ...gate, guidance: core.promptPolicy, resident: plan.residentTools, dynamic: plan.discovery })
  if (plan.replaceOfficial) mountReplacements(ctx, { id: plan.id, targets: plan.replacementTargets, gate, keepOfficial: () => false })
```

</details>

**依据 4 · 源码核查**：[src/publication/native.ts:38-48](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/publication/native.ts#L38-L48)

native 发布依赖 worker 和宿主服务。

<details>
<summary>查看原文（11行）</summary>

```text
export function mountNative(root: Context, config: ResolvedConfig, publication: NativePublication): void {
  const { id: mode, tools: names, section, gate } = publication
  let worker: string
  try { worker = resolveWorker({ binaryPath: config.binaryPath }) } catch (error) {
    if (config.required) throw error
    root.logger.warn(`dsh-ops: ${mode} mode cannot resolve its native worker; native file tools stay unpublished. ${String((error as Error)?.message ?? error)}`)
    return
  }
  root.inject(['tools', 'systemPrompt', 'sandboxPolicy', 'subprocess'], async ctx => {
    const tools = ctx.get('tools')
    const prompt = ctx.get('systemPrompt')
```

</details>

**依据 5 · 源码核查**：[src/publication/native.ts:63-79](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/publication/native.ts#L63-L79)

执行前核查 Agent scope 与定义身份。

<details>
<summary>查看原文（17行）</summary>

```text
    const publish = (agent: Agent, entry: Entry): void => {
      if (!entry.ctx) return
      const scope = agent
      const definitions = names.map(name => {
        const definition = entry.runtime.definition(name)
        return { ...definition, execute: async (args: unknown, exec: Parameters<typeof definition.execute>[1]) => {
          if (stopped || entries.get(agent) !== entry || !cover(agent) || exec.agent !== agent
            || !await isNativePresentation(prompt, agent, exec.signal).catch(() => false) || stopped || !cover(agent)
            || tools.get(definition.name, agent) !== registration(definition.name)) {
            return failure('POLICY_DENIED', 'Native capability belongs to a different or inactive scope.')
          }
          return definition.execute(args, exec)
        } }
      })
      const registration = (name: string) => definitions.find(definition => definition.name === name)
      const dispose = registerNativeProviderAtScope(entry.ctx, scope, definitions,
        tool => entry.ctx!.tools.register(tool), { inheritable: false, priority: 10 })
```

</details>

**依据 6 · 源码核查**：[src/execution/files.ts:80-108](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/execution/files.ts#L80-L108)

会话与预算、宿主 authority 入口。

<details>
<summary>查看原文（29行）</summary>

```text
export async function invoke(ctx: Context, file: string, tool: string, args: unknown, exec: ToolRunContext, signal?: AbortSignal, config?: WorkerInvokeConfig): Promise<unknown> {
  try {
    const session = exec?.agent?.session
    if (!session?.id) return failure('EXECUTOR_UNAVAILABLE', 'An authoritative session identity is required.')
    return await withResultSession(ctx, session, signal, currentSignal =>
      withCallBudget(ctx.root ?? ctx, String(session.id), currentSignal,
        async () => {
          const basis = await resolveSessionDirectory(ctx, exec.agent, currentSignal)
          const value = await invokeTrusted(ctx, file, tool, args, exec, currentSignal, basis.cwd, config)
          // Credential refusals deliberately disclose no absolute path, including ancestors.
          if (record(value) && record(value.error) && value.error.code === 'CREDENTIAL_DENIED') return value
          return { ...value as Record<string, unknown>, resolvedFrom: basis.cwd, cwdSource: basis.source }
        }))
  }
  catch (error) {
    if (error instanceof CallBudgetError) {
      const value = failure(error.code, error.message)
      value.error.nextAction = error.message
      return value
    }
    return failure('EXECUTOR_UNAVAILABLE', 'DSH file authority or preparation is unavailable; no unrestricted fallback was attempted.')
  }
}
async function invokeTrusted(ctx: Context, file: string, tool: string, args: unknown, exec: ToolRunContext, signal: AbortSignal, cwd: string, config?: WorkerInvokeConfig): Promise<unknown> {
  const session = exec?.agent?.session
  if (!session?.id || typeof cwd !== 'string' || !path.isAbsolute(cwd)) return failure('EXECUTOR_UNAVAILABLE', 'An authoritative session identity and cwd are required.')
  const policyService: SandboxPolicyService | undefined = ctx.get('sandboxPolicy')
  const subprocess: SubprocessRuntime | undefined = ctx.get('subprocess')
  if (!policyService?.resolve || !subprocess?.spawn) return failure('EXECUTOR_UNAVAILABLE', 'DSH policy and subprocess services are required.')
```

</details>

**依据 7 · 源码核查**：[src/execution/transport.ts:13-24](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/execution/transport.ts#L13-L24)

worker 完成、输出和解析条件。

<details>
<summary>查看原文（12行）</summary>

```text
export async function exchange(subprocess: SubprocessRuntime, spec: Parameters<SubprocessRuntime['spawn']>[0], started?: () => void): Promise<WorkerExchange> {
  const handle = subprocess.spawn(spec)
  started?.()
  const outcome = await handle.done
  const base = { exitCode: outcome.exitCode, interrupted: Boolean(spec.signal?.aborted || outcome.signal) }
  if (!handle.collected.stdout || !handle.collected.stderr) return { ...base, readers: false, lossy: false, stderr: '' }
  const stdout = handle.collected.stdout.readFrom(0), stderr = handle.collected.stderr.readFrom(0)
  const result = { ...base, readers: true, lossy: Boolean(stdout.lossy), stderr: stderr.text }
  if (base.interrupted || stdout.lossy || outcome.exitCode !== 0) return result
  let value: unknown
  try { value = JSON.parse(stdout.text) } catch { return { ...result, invalid: 'json' } }
  return record(value) ? { ...result, value } : { ...result, invalid: 'shape' }
```

</details>

**依据 8 · 源码核查**：[src/execution/files.ts:150-166](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/execution/files.ts#L150-L166)

按策略拒绝只读写入和越界写入。

<details>
<summary>查看原文（17行）</summary>

```text
  const requiredMode = (current: SandboxExecutionPolicy): 'workspace-write' | 'danger-full-access' => {
    const roots = [canonicalAnchor(current.workspaceRoot), anchoredPath(privateTemp, sessionAnchors(current, cwd))]
    return writeTargets.every(target => roots.some(root => inside(root, anchoredPath(target, sessionAnchors(current, cwd)))))
      ? 'workspace-write' : 'danger-full-access'
  }
  if (mutates && policy.mode === 'read-only') return denied(policy, tool, requiredMode(policy), 'The user selected read-only; no files were changed.')
  if (mutates && policy.mode === 'workspace-write') {
    for (const target of writeTargets) {
      const identity = trustedPath(target)
      if (!writeRoots.some(root => inside(root, identity))) {
        return denied(policy, `${tool} outside the workspace or this session's temporary directory`, 'danger-full-access', 'The user authorized workspace writes only; no files were changed.')
      }
      if (inside(writeRoots[1], identity)) {
        const created = ensureSessionTemp(writeRoots[1])
        if (!created.ok) return failure('EXECUTOR_UNAVAILABLE', created.message)
      }
    }
```

</details>

**依据 9 · 源码核查**：[src/execution/files.ts:169-187](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/execution/files.ts#L169-L187)

固定文件 worker 路径不经通用进程 sandbox。

<details>
<summary>查看原文（19行）</summary>

```text
  // Do NOT realpath the caller's parents here: that would erase a symlink/junction before
  // the no-follow native traversal could reject it (especially on create-only writes).
  const workerArgs = reads
    ? { ...args, files: reads.files.map(file => ({ ...file, path: trustedPath(file.path) })) }
    : { ...args, path: trustedPath(operationPath), ...(destination ? { to: trustedPath(destination) } : {}) }
  // Traversals skip credential directories by identity, so a glob or grep cannot even name a private
  // key that sits below one.
  const denyRoots = (config?.denyCredentialReads ?? true) !== false ? credentialRoots() : []
  const storage = await resultStorage(ctx, session, exec.agent, file, tool, policy, denyRoots,
    (config?.denyCredentialReads ?? true) !== false, signal).catch(() => undefined)
  const envelope = workerEnvelope('file', { root: trustedPath(cwd), scope: String(session.id), tool, args: workerArgs, read_only: policy.mode === 'read-only', deny_roots: denyRoots, deny_credential_names: (config?.denyCredentialReads ?? true) !== false, ...(policy.mode === 'workspace-write' ? { write_roots: writeRoots } : {}) }, config?.toolCallTimeoutMs, storage)
  const input = JSON.stringify(envelope)
  if (Buffer.byteLength(input) > 2 * 1024 * 1024) return failure('OUTPUT_LIMIT', 'Request exceeds the 2 MiB byte budget.')
  let spawned = false
  try {
    // Trusted, fixed file operations follow DSH fs-sandbox's policy fence,
    // not an arbitrary-code runner. The worker accepts data, never shell/code.
    // This is the only file execution path, not a sandbox-failure fallback.
    const argv = [file]
```

</details>

#### 缺口

- 未在目标 DSH 和平台运行
  **影响**：静态调用不能证明安装、权限和数据流实际成功
  **进一步探讨**：在隔离 profile 用固定文件核对注册、取消、读取和结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 官方工具隐藏的触发与安全边界是什么？

**研究主题**：缺陷与关键质疑、贡献与相对优势

#### 完整回答

对明确选定的官方工具，隐藏模块通过宿主 tools.schemas/get/restrict/guard 检查所选 OPS 对应项在 Agent scope 的可见性与所有权；缺少对应项或宿主 API 时，计划不做部分隐藏，并记录 READINESS_BLOCKED。pre-execute 的拒绝及 guard 依赖宿主执行器使用这些扩展点；collapsed PTC 的 run_code 是例外，官方工具仍按其策略处理。该检查比直接按名称隐藏更稳健，但只验证发布表面和归属，不验证 read/glob/grep 与官方工具的语义、完整性或性能等价。标准与 Cordis 仅列出三个替代项，不能泛称所有官方工具替换。

#### 证据与依据

**依据 1 · 源码核查**：[src/presets/defaults.ts:32-41](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/presets/defaults.ts#L32-L41)

替代目标和模式范围。

<details>
<summary>查看原文（10行）</summary>

```text
const NATIVE_REPLACEMENTS: readonly OfficialReplacement[] = Object.freeze(['read', 'glob', 'grep'])

/** Everything one mode publishes; consumers read this instead of branching on ids. */
export const MODE_PLANS: Readonly<Record<ModeId, ModePlan>> = Object.freeze({
  // Minimal keeps its terse prompts: only the Windows shell is replaced, and
  // advanced tools arrive through the discovery entry when that row is on.
  minimal: Object.freeze({ nativeFiles: false, replacements: [], shell: true, ptc: false, discovery: 'all', section: null }),
  standard: Object.freeze({ nativeFiles: true, replacements: NATIVE_REPLACEMENTS, shell: true, ptc: false, discovery: 'advanced', section: 'standard' }),
  ptc: Object.freeze({ nativeFiles: false, replacements: [], shell: true, ptc: true, discovery: 'none', section: 'ptc' }),
  cordis: Object.freeze({ nativeFiles: true, replacements: NATIVE_REPLACEMENTS, shell: true, ptc: false, discovery: 'advanced', section: 'cordis' }),
```

</details>

**依据 2 · 源码核查**：[src/official-tool-hiding.ts:28-40](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/official-tool-hiding.ts#L28-L40)

只处理显式选择并注入宿主。

<details>
<summary>查看原文（13行）</summary>

```text
export function apply(root: Context, raw?: unknown): void {
  if (retiredLegacyRow(root, 'hide-official')) return
  const { replaceTools }: { replaceTools: OfficialReplacement[] } = resolveHidingConfig(raw)
  // Empty and legacy-only rows install no hooks and cannot block a session.
  if (!replaceTools.length) return
  const selected = new Set<string>(replaceTools)
  const hideable = (tool: string): boolean => selected.has(tool)
  root.inject(['tools', 'systemPrompt'], ctx => {
    const entries = new Map<object, Entry>()
    let stopped = false, mutating = false
    let lastSurface: string | undefined
    const tools = ctx.get('tools')!
    const apiError = (['schemas', 'get', 'restrict', 'guard'] as const).filter(api => typeof tools[api] !== 'function')
```

</details>

**依据 3 · 源码核查**：[src/official-tool-hiding.ts:52-77](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/official-tool-hiding.ts#L52-L77)

按 scope 检查归属和完整计划；失败不部分隐藏。

<details>
<summary>查看原文（26行）</summary>

```text
    // Readiness examines the unmasked scope. It never accepts ops_<same-name>
    // as an equivalence claim, nor uses run_code as a native replacement.
    const readiness = (agent: object): boolean[] => {
      const owned = new Set(typeof tools.get === 'function' ? nativeProviders(ctx, agent).map(provider => provider.definition) : [])
      return replaceTools.map(tool => {
        const visible = typeof tools.get === 'function' ? tools.get(OFFICIAL_REPLACEMENTS[tool], agent) : undefined
        return visible !== undefined && owned.has(visible)
      })
    }
    const prepare = (agent: object, entry: Entry): Plan => {
      const names = typeof tools.schemas === 'function' ? tools.schemas(agent).map(schema => schema.name) : []
      const hidden = names.filter(hideable)
      const ready = readiness(agent)
      const missing = replaceTools.flatMap((tool, index) => {
        const replacement = OFFICIAL_REPLACEMENTS[tool]
        return names.includes(replacement) && ready[index]
          ? [] : [`${tool} -> ${replacement}`]
      })
      const diagnostics = [
        ...apiError.length ? [`missing host API: ${apiError.join(', ')}`] : [],
        ...entry.cleanupError ? [entry.cleanupError] : [],
        ...missing.length ? [`missing OPS surface: ${[...new Set(missing)].join(', ')}`] : [],
      ]
      const failure = diagnostics.length ? blocked(diagnostics.join('; ')) : undefined
      // A failed plan hides nothing: no partial mask over an unready scope.
      return { deny: failure ? [] : hidden, failure }
```

</details>

**依据 4 · 源码核查**：[src/official-tool-hiding.ts:136-154](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/official-tool-hiding.ts#L136-L154)

pre-execute 拒绝与 PTC transport 例外。

<details>
<summary>查看原文（19行）</summary>

```text
    const refusal: ToolGuard = exec => {
      if (stopped) return blocked('component disposed')
      if (!exec?.agent?.ctx) return blocked('calling agent scope unavailable')
      attach(exec.agent)
      reconcile() // Authority is live, not a startup snapshot.
      const entry = entries.get(exec.agent)
      // A collapsed (run_code) scope can never prove native readiness, so its error must
      // not refuse the transport itself. The selected official names stay refused: the
      // promise is that they never execute, in any presentation.
      const transport = entry?.collapsed === true && exec.name === RUN_CODE
      if (entry?.error && !transport) return entry.error
      return hideable(exec.name)
        ? blocked(`official tool ${exec.name} is selected for replacement`) : undefined
    }
    ctx.on('tools/pre-execute', async (exec, next) => {
      const reason = refusal(exec)
      return reason ? { kind: 'deny', reason, info: { name: 'ReadinessError', code: 'READINESS_BLOCKED' } } : next()
    })
    if (typeof tools.guard === 'function') ctx.effect(() => ctx.tools.guard(refusal), 'dsh-ops: replacement surface guard')
```

</details>

#### 缺口

- 缺少同版本原生工具对照和宿主执行器验证
  **影响**：不能由 readiness 断定语义等价或权限在所有宿主成立
  **进一步探讨**：用匹配样本检查边界、遗漏、错误及插件禁用后的工具恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 中断和结果缓存清理能证明什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

每个会话对象绑定随机 nonce；同一 ID 的另一个活跃对象被拒绝，重新打开会话产生新绑定。会话 dispose 标记停止并取消工作，等待进行中的 Promise 后执行注册的 cleanup；清理异常只警告且不自动重试，因此逻辑引用失效不等于临时文件物理消除。sandbox 模式变化会取消当前工作，但实际外部效果仍需核对。Native 文件 worker 输出丢失、截断、错误退出或中断返回 RESULT_UNKNOWN/OUTPUT_LIMIT，提示检查后置状态；不能将取消或错误当成没有发生文件修改。

#### 证据与依据

**依据 1 · 源码核查**：[src/kernel/result-lifecycle.ts:27-44](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/kernel/result-lifecycle.ts#L27-L44)

会话身份、活跃对象及 nonce。

<details>
<summary>查看原文（18行）</summary>

```text
function live(ctx: Pick<LifecycleHost, 'root'>, session: ResultSession): LiveSession {
  const state = owner(ctx)
  if (state.expired.has(session)) throw new Error('Result session has expired')
  // The pinned SessionStore emits its exact stored Session object throughout one lifetime.
  if ([...state.sessions].some(([other, entry]) => other !== session && other.id === session.id && !entry.stopped)) {
    throw new Error('Another live session owns this identity')
  }
  let entry = state.sessions.get(session)
  if (!entry) {
    entry = { nonce: randomUUID(), stopped: false, work: new Map(), cleanup: new Map() }
    state.sessions.set(session, entry)
  }
  if (entry.stopped) throw new Error('Result session is closing')
  return entry
}
/** A reopened persisted session receives a fresh authority binding, even with the same id. */
export function resultSessionNonce(ctx: Pick<LifecycleHost, 'root'>, session: ResultSession): string {
  return live(ctx, session).nonce
```

</details>

**依据 2 · 源码核查**：[src/kernel/result-lifecycle.ts:66-92](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/kernel/result-lifecycle.ts#L66-L92)

取消、等待、清理失败警告和权限变化。

<details>
<summary>查看原文（27行）</summary>

```text
export function expireResultSession(ctx: Pick<LifecycleHost, 'root' | 'logger'>, session: ResultSession, disposed = true): Promise<void> {
  const state = owner(ctx), entry = state.sessions.get(session)
  if (disposed) state.expired.add(session)
  if (!entry) return Promise.resolve()
  if (entry.closing) return entry.closing
  entry.stopped = true
  // Publish the barrier before abort listeners can synchronously reopen the same id.
  entry.closing = Promise.resolve().then(async () => {
    await Promise.allSettled(entry.work.values())
    for (const cleanup of entry.cleanup.values()) {
      try { await cleanup() }
      catch { ctx.logger?.warn?.('dsh-ops: session result references expired; physical cache cleanup did not complete under current host authority. Temporary files remain for host or operator cleanup; no automatic retry is scheduled.') }
    }
    entry.cleanup.clear(); state.sessions.delete(session)
  })
  for (const controller of entry.work.keys()) controller.abort(new Error('Result session disposed'))
  return entry.closing
}
/** Each component owns its listeners. Last-owner teardown expires remaining sessions. */
export function mountResultLifecycle(ctx: LifecycleHost): void {
  const state = owner(ctx); state.mounts++
  ctx.on('session/disposed', session => { void expireResultSession(ctx, session) })
  ctx.on('session/event', (session, event) => {
    if (event.type !== 'sandbox/mode') return
    for (const [other, entry] of state.sessions) if (other === session) {
      for (const controller of entry.work.keys()) controller.abort(new Error('Sandbox authority changed'))
    }
```

</details>

**依据 3 · 源码核查**：[src/execution/files.ts:195-207](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/execution/files.ts#L195-L207)

权限变化与 worker 结果不确定状态。

<details>
<summary>查看原文（13行）</summary>

```text
    if (current.mode !== policy.mode || current.workspaceRoot !== policy.workspaceRoot) {
      if (!['read-only', 'workspace-write', 'danger-full-access'].includes(current?.mode) || !path.isAbsolute(current?.workspaceRoot ?? '')) return failure('EXECUTOR_UNAVAILABLE', 'Invalid authoritative DSH policy after preparation.')
      const required = mutates ? requiredMode(current) : undefined
      if (mutates && (current.mode === 'read-only' || (current.mode === 'workspace-write' && required === 'danger-full-access'))) return denied(current, tool, required, 'Authority changed during preparation; no files were changed.')
      return authorityChanged(current, tool)
    }
    const result = await exchange(subprocess, { argv, cwd, stdio: { stdin: { data: input }, stdout: { maxBytes: envelope.budget.maxBytes }, stderr: { maxBytes: 16 * 1024 } }, graceMs: 1000, signal }, () => { spawned = true })
    if (!result.readers) return failure('RESULT_UNKNOWN', 'Worker output readers are unavailable; inspect postconditions.', 'verify', 'unknown')
    if (result.interrupted) return failure('RESULT_UNKNOWN', 'Worker interrupted; inspect postconditions.', 'execute', 'unknown')
    if (result.lossy) return failure('OUTPUT_LIMIT', 'Worker output exceeded the byte budget; operation facts may have changed.', 'verify', 'unknown')
    if (result.exitCode !== 0) return failure('RESULT_UNKNOWN', `Worker did not return a settled result: ${result.stderr.slice(0, 500)}`, 'execute', 'unknown')
    if (result.invalid === 'json') return failure('RESULT_UNKNOWN', 'Worker returned invalid JSON; inspect postconditions.', 'verify', 'unknown')
    if (!result.value) return failure('RESULT_UNKNOWN', 'Worker returned a non-object result; inspect postconditions.', 'verify', 'unknown')
```

</details>

**依据 4 · 源码核查**：[src/execution/transport.ts:13-24](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/execution/transport.ts#L13-L24)

中断和丢失输出不能视作成功。

<details>
<summary>查看原文（12行）</summary>

```text
export async function exchange(subprocess: SubprocessRuntime, spec: Parameters<SubprocessRuntime['spawn']>[0], started?: () => void): Promise<WorkerExchange> {
  const handle = subprocess.spawn(spec)
  started?.()
  const outcome = await handle.done
  const base = { exitCode: outcome.exitCode, interrupted: Boolean(spec.signal?.aborted || outcome.signal) }
  if (!handle.collected.stdout || !handle.collected.stderr) return { ...base, readers: false, lossy: false, stderr: '' }
  const stdout = handle.collected.stdout.readFrom(0), stderr = handle.collected.stderr.readFrom(0)
  const result = { ...base, readers: true, lossy: Boolean(stdout.lossy), stderr: stderr.text }
  if (base.interrupted || stdout.lossy || outcome.exitCode !== 0) return result
  let value: unknown
  try { value = JSON.parse(stdout.text) } catch { return { ...result, invalid: 'json' } }
  return record(value) ? { ...result, value } : { ...result, invalid: 'shape' }
```

</details>

#### 缺口

- 没有进程中断或清理故障注入
  **影响**：无法证明平台上没有残留或部分效果
  **进一步探讨**：隔离目录中断读写后独立检查文件、引用与物理缓存。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 兼容、权限与使用成本有哪些条件？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

项目源码包声明版本 0.5.0-alpha3，作者只列 DSH 0.2.0-rc.2 和 0.2.1-rc.2；Node 及宿主服务和对应平台 worker 仍是前提，不把声明范围变成运行证明。worker 路径支持 Windows x64、Linux x64、macOS arm64/x64；随包 worker 的邻接 provenance 校验可检测错配，不能防止同时替换二者，显式 worker 路径不经该校验。安装 dry-run 只检查路径与启动条件，不执行 CLI 或证明身份、版本和兼容。首次成本包括核对 profile、平台和保留回退；持续成本包括模型调用、输出完整性与权限审核，失败时还须检查副作用、缓存和文件差异；金额及净节省均未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:63-67](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/README.md#L63-L67)

作者说明 profile、桌面 CLI 与 dry-run 边界。

```text
必须显式选择目标 profile；`tui` 映射到 **dsh-TUI 产品的 `dsh-tui` profile**，不是旧的 `tui` 目录。请先初始化目标应用。该入口委托官方 DSH CLI 安装，不另写一套 profile 锁与回滚逻辑。

桌面端必须使用桌面应用自带的 CLI；默认探测 `%LOCALAPPDATA%\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd`。安装在其它位置时加 `--dsh-cli "<安装目录>\resources\runtime\cli\bin\dsh.cmd"`。Web/TUI 需要可用的 DSH CLI，可同样显式指定。

安装或卸载时可加 `--dry-run` 预演。它按指定路径或 `PATH`（Windows 同时使用 `PATHEXT`）解析 CLI，检查文件、POSIX 执行权限及通过 Node 启动的入口文件，并在预演时同样拒绝不安全的 Windows 命令脚本路径；检查失败返回非零。预演只打印计划，不启动 CLI、不修改 profile。成功表示这些静态检查已通过，不保证所选程序的身份、版本、profile 兼容性或后续安装结果。
```

**依据 2 · 作者声明**：[README.md:79-81](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/README.md#L79-L81)

作者声明支持两个宿主版本。

```text
#### 更新方法

宿主兼容范围明确声明为 DSH **0.2.0-rc.2 与 0.2.1-rc.2**。
```

**依据 3 · 源码核查**：[src/execution/runtime.ts:62-70](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/execution/runtime.ts#L62-L70)

平台及显式 worker 选择。

```text
export function resolveWorker(config: WorkerSelection = {}, { packageRoot = PACKAGE_ROOT, env = process.env, platform = process.platform, arch = process.arch }: RuntimeOptions = {}): string {
  if (!PLATFORMS.includes(`${platform}-${arch}`)) throw new Error(`dsh-ops supports Windows x64, Linux x64 and macOS (arm64/x64) only; unsupported runtime target ${platform}-${arch}.`)
  const explicit = config.binaryPath ?? env.DSH_OPS_WORKER_BIN
  const fromPackage = path.resolve(packageRoot, 'runtime', `${platform}-${arch}`, workerName(platform))
  const fromSourceTree = path.resolve(packageRoot, 'native', 'target', 'release', workerName(platform))
  const candidates = explicit !== undefined
    ? [{ file: explicit, note: 'explicit selection (config.binaryPath / DSH_OPS_WORKER_BIN) — trusting the named path is the whole point of selecting it' }]
    : [
      { file: fromPackage, note: 'packaged runtime' },
```

**依据 4 · 源码核查**：[src/execution/runtime.ts:96-116](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/execution/runtime.ts#L96-L116)

邻接 receipt 局限与缺失 worker 行为。

<details>
<summary>查看原文（21行）</summary>

```text
    // Verify the packaged candidate against its receipt. Two limits, stated so nobody
    // mistakes this for a trust boundary:
    //   · the receipt sits **beside** the payload, so whoever replaces both passes.
    //     This catches a build/metadata mismatch (a stale or mistaken runtime), not a
    //     deliberate substitution — that needs npm's integrity or a signature, which is
    //     outside this plugin.
    //   · the selection test is "is this the candidate we derived", not a substring of a
    //     path: `includes('\runtime\')` let any absolute path opt itself in (or out).
    if (same(path.resolve(file), fromPackage)) {
      const receipt = readJson(path.join(path.dirname(file), 'provenance.json'), 'provenance receipt',
        path.posix.join('runtime', `${platform}-${arch}`, 'provenance.json'))
      const version = readJson(path.join(packageRoot, 'package.json'), 'package manifest', 'package.json').version
      if (receipt.target !== `${platform}-${arch}` || receipt.version !== version || receipt.executable !== workerName(platform)
        || receipt.sha256 !== createHash('sha256').update(fs.readFileSync(file)).digest('hex')) throw new Error('Native worker provenance mismatch.')
    } else {
      // Not silent: an unverified worker binary is a fact the operator should see.
      console.warn(`dsh-ops: native worker selected without provenance verification — ${note}: ${file}`)
    }
    return file
  }
  throw new Error(`Native worker unavailable for ${platform}-${arch}. Tried:\n${skipped.map(entry => `  ${entry}`).join('\n')}\nInstall a runtime-bearing dsh-ops package, or run npm run build:ptc in the source checkout. No ACL repair, shell fallback or automatic download is performed.`)
```

</details>

#### 缺口

- 未运行目标安装、实际宿主、模型与费用比较
  **影响**：无法保证平台兼容、安全或节省成本
  **进一步探讨**：备份后在明确版本的隔离 profile 校验 worker、预算与禁用恢复。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何避免把局部完整当作任务完整？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有 Native 输出已经标识 complete、truncated、nextOffset 等事实；页式结果和错误状态也是反证，因此简单增加截断标记或自动分页不是新贡献。未验证假设：任务开始时声明需要覆盖的目标文件集合和验收约束，在模型结束前将它们与实际成功读取/修改的路径、版本和遗漏原因对账，无法对账时请求用户或回退原生完整检查。它依赖可信宿主观察、任务清单以及文件在检查后不被改写；可能增加工具调用、误拦与上下文开销，也不保证语义正确。以相同模型、固定文件集比较原生、现有 OPS、增加对账三组，记录漏读漏改、错误通过、token、时间与人工复核；若未改善合格率、观察不可信或额外成本超过收益则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/projections/native/render.ts:42-56](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/projections/native/render.ts#L42-L56)

现有结果已有截断和完整性事实。

<details>
<summary>查看原文（15行）</summary>

```text
function facts(value: Row, keys: string[]): string {
  return keys.filter(key => value[key] !== undefined).map(key => `${key}=${field(value[key])}`).join('; ')
}
function notices(value: Row, displayed: number): string[] {
  const incomplete = value.complete === false || value.truncated === true || value.status === 'partial'
  const details = [
    `${displayed} item${displayed === 1 ? '' : 's'} displayed`,
    `complete=${value.complete === undefined ? (incomplete ? 'false' : 'unspecified') : value.complete}`,
    `TruncatedBy: ${value.truncatedBy ?? (incomplete ? 'worker-limit' : 'none')}`,
    facts(value, ['nextOffset', 'nextIndex', 'pending', 'omitted', 'total', 'matched', 'files', 'matches', 'skippedFiles', 'skippedPaths', 'failed', 'continuation']),
  ].filter(Boolean)
  const output = [`[Notice: ${details.join('; ')}.]`]
  for (const item of rows(value.items)) {
    if (item.truncatedInLine === true) {
      output.push(`[Notice: Line ${label(item.line)} in ${label(item.path)} is incomplete; ${facts(item, ['bytesTotal', 'bytesOmitted'])}. Use a smaller or binary range; the next line offset does not recover its missing suffix.]`)
```

</details>

**依据 2 · 源码核查**：[src/projections/native/ranges.ts:28-48](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/projections/native/ranges.ts#L28-L48)

现有范围结果区分完整与后续偏移。

<details>
<summary>查看原文（21行）</summary>

```text
/** Canonical metadata remains unchanged; Native needs one revision and one clear continuation per file. */
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
```

</details>

**依据 3 · 源码核查**：[src/execution/files.ts:195-207](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/execution/files.ts#L195-L207)

运行中断和缺少结果明确标未知。

<details>
<summary>查看原文（13行）</summary>

```text
    if (current.mode !== policy.mode || current.workspaceRoot !== policy.workspaceRoot) {
      if (!['read-only', 'workspace-write', 'danger-full-access'].includes(current?.mode) || !path.isAbsolute(current?.workspaceRoot ?? '')) return failure('EXECUTOR_UNAVAILABLE', 'Invalid authoritative DSH policy after preparation.')
      const required = mutates ? requiredMode(current) : undefined
      if (mutates && (current.mode === 'read-only' || (current.mode === 'workspace-write' && required === 'danger-full-access'))) return denied(current, tool, required, 'Authority changed during preparation; no files were changed.')
      return authorityChanged(current, tool)
    }
    const result = await exchange(subprocess, { argv, cwd, stdio: { stdin: { data: input }, stdout: { maxBytes: envelope.budget.maxBytes }, stderr: { maxBytes: 16 * 1024 } }, graceMs: 1000, signal }, () => { spawned = true })
    if (!result.readers) return failure('RESULT_UNKNOWN', 'Worker output readers are unavailable; inspect postconditions.', 'verify', 'unknown')
    if (result.interrupted) return failure('RESULT_UNKNOWN', 'Worker interrupted; inspect postconditions.', 'execute', 'unknown')
    if (result.lossy) return failure('OUTPUT_LIMIT', 'Worker output exceeded the byte budget; operation facts may have changed.', 'verify', 'unknown')
    if (result.exitCode !== 0) return failure('RESULT_UNKNOWN', `Worker did not return a settled result: ${result.stderr.slice(0, 500)}`, 'execute', 'unknown')
    if (result.invalid === 'json') return failure('RESULT_UNKNOWN', 'Worker returned invalid JSON; inspect postconditions.', 'verify', 'unknown')
    if (!result.value) return failure('RESULT_UNKNOWN', 'Worker returned a non-object result; inspect postconditions.', 'verify', 'unknown')
```

</details>

#### 缺口

- 未实现任务级覆盖对账且未对照测试
  **影响**：无法认定方案有效或成本可接受
  **进一步探讨**：记录任务清单、实际 observation 和不可对账原因，并评估误报及漏报。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 对谁值得试用，何时停用？

**研究主题**：采用判断

#### 完整回答

能够审查文件差异且频繁执行批量读取的 DSH 用户，可先在备份或 Git 可恢复副本中使用一项只读任务，确认实际 worker、宿主版本、输出覆盖及官方工具恢复路径。相对原生工具，按需发现和归属检查提供不同的工具组织方式，但节省及兼容未实测。若出现 READINESS_BLOCKED、权限不明、遗漏结果、缓存清理失败或 RESULT_UNKNOWN，先停止重试，核对实际状态并关闭相关替换或退回原生工具；不把关闭插件当作自动撤销已发生的修改。

#### 证据与依据

**依据 1 · 源码核查**：[src/official-tool-hiding.ts:61-77](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/official-tool-hiding.ts#L61-L77)

准备失败时不部分隐藏。

<details>
<summary>查看原文（17行）</summary>

```text
    const prepare = (agent: object, entry: Entry): Plan => {
      const names = typeof tools.schemas === 'function' ? tools.schemas(agent).map(schema => schema.name) : []
      const hidden = names.filter(hideable)
      const ready = readiness(agent)
      const missing = replaceTools.flatMap((tool, index) => {
        const replacement = OFFICIAL_REPLACEMENTS[tool]
        return names.includes(replacement) && ready[index]
          ? [] : [`${tool} -> ${replacement}`]
      })
      const diagnostics = [
        ...apiError.length ? [`missing host API: ${apiError.join(', ')}`] : [],
        ...entry.cleanupError ? [entry.cleanupError] : [],
        ...missing.length ? [`missing OPS surface: ${[...new Set(missing)].join(', ')}`] : [],
      ]
      const failure = diagnostics.length ? blocked(diagnostics.join('; ')) : undefined
      // A failed plan hides nothing: no partial mask over an unready scope.
      return { deny: failure ? [] : hidden, failure }
```

</details>

**依据 2 · 源码核查**：[src/execution/files.ts:201-207](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/execution/files.ts#L201-L207)

中断、输出缺失和异常时需核实后置状态。

```text
    const result = await exchange(subprocess, { argv, cwd, stdio: { stdin: { data: input }, stdout: { maxBytes: envelope.budget.maxBytes }, stderr: { maxBytes: 16 * 1024 } }, graceMs: 1000, signal }, () => { spawned = true })
    if (!result.readers) return failure('RESULT_UNKNOWN', 'Worker output readers are unavailable; inspect postconditions.', 'verify', 'unknown')
    if (result.interrupted) return failure('RESULT_UNKNOWN', 'Worker interrupted; inspect postconditions.', 'execute', 'unknown')
    if (result.lossy) return failure('OUTPUT_LIMIT', 'Worker output exceeded the byte budget; operation facts may have changed.', 'verify', 'unknown')
    if (result.exitCode !== 0) return failure('RESULT_UNKNOWN', `Worker did not return a settled result: ${result.stderr.slice(0, 500)}`, 'execute', 'unknown')
    if (result.invalid === 'json') return failure('RESULT_UNKNOWN', 'Worker returned invalid JSON; inspect postconditions.', 'verify', 'unknown')
    if (!result.value) return failure('RESULT_UNKNOWN', 'Worker returned a non-object result; inspect postconditions.', 'verify', 'unknown')
```

**依据 3 · 源码核查**：[src/kernel/result-lifecycle.ts:73-79](https://github.com/T-Auto/dsh-ops/blob/2c0b0397ce4b48436ff76cf5c5b039054240a45c/src/kernel/result-lifecycle.ts#L73-L79)

清理失败可能保留文件。

```text
  entry.closing = Promise.resolve().then(async () => {
    await Promise.allSettled(entry.work.values())
    for (const cleanup of entry.cleanup.values()) {
      try { await cleanup() }
      catch { ctx.logger?.warn?.('dsh-ops: session result references expired; physical cache cleanup did not complete under current host authority. Temporary files remain for host or operator cleanup; no automatic retry is scheduled.') }
    }
    entry.cleanup.clear(); state.sessions.delete(session)
```

#### 缺口

- 缺少安装、真实任务和恢复验收
  **影响**：不能建议直接持续采用或保证撤销
  **进一步探讨**：隔离试用并核对同一输入、工具结果、文件差异和卸载后状态。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
