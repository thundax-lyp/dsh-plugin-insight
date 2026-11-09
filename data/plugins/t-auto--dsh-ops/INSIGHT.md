# dsh-ops

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5057124](https://github.com/T-Auto/dsh-ops/tree/5057124dd7922d3d275b54f9f195fa5881dff0c9)

<!-- BEGIN META -->
[![GitHub ★ 5,591](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C591&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/T-Auto/dsh-ops) [![npm 30d 125,600](https://img.shields.io/static/v1?label=npm+30d&message=125%2C600&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ops) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ops)
<!-- END META -->

> **功能**：为 DSH 提供 Native 与 PTC 文件工具、按需加载和可配置的原版工具替换。

> **亮点**：[Q02](#research-q02) 将文件 worker、会话策略和共享工具面串接。[Q03](#research-q03) 的关键组合是按实际工具视图判断替换，并在分页中分开展示和源执行完整性。它为有界工具结果提供可核查的调用路径。

> **主要限制**：[Q03](#research-q03) 指出替换守卫能确认对应定义可执行，但不确认原版与替换语义等价。短引用和分页节省上下文的前提是模型没有遗漏关键证据。

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
  - [Q01 · 哪种文件任务值得尝试，和官方工具的差别是什么？](#detail-section-11)
  - [Q02 · Native 文件能力如何接到会话、检查权限并调用 worker？](#detail-section-12)
  - [Q03 · 隐藏官方工具何时成立，结果短小会漏掉什么？](#detail-section-13)
  - [Q04 · 安装候选与实际运行依赖怎样核对？](#detail-section-14)
  - [Q05 · 怎样计量试用成本并处理不确定结果？](#detail-section-15)
  - [Q06 · 能否识别局部正确但任务遗漏的结果？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常在仓库中定位调用点并能核查搜索范围的 DSH 开发者，可用可恢复副本衡量是否减少重复工具调用。[Q01](#research-q01)

原版 read、glob 与 grep 已能完成定位，较复杂的场景也可由用户手写脚本。采用比较应控制相同模型与仓库，用完整命中和人工复核作为验收。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Native 文件工具 | 查看、搜索或操作工作区文件 | 作用域匹配、worker 可用且宿主授权允许 |
| 原版工具替换 | 缩小模型工具面 | 对应工具实际可用，语义等价需任务核对 |
| 分页与重复读引用 | 控制模型看到的输出 | 页完整与任务覆盖分别核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 符合声明范围的 DSH、Node 与可信运行包 | 试用需要 | 加载 bundle 和工具协议 | 先保留原工具 |
| 平台相符的文件 worker | Native 文件操作需要 | 执行固定文件功能 | 工具不发布或报告不可用 |
| 宿主授权服务、subprocess 与权威会话目录 | 代表调用需要 | 决定路径、权限和启动范围 | 拒绝并核查宿主 |
| 已核实的工作区授权与可恢复副本 | 写入验收需要 | 把写入限制在目标并能回读 | 仅做只读比较 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 核查实际包、宿主和 worker，选只读定位题 | 能确定版本和关键结果清单 |
| 加载 | 选对应预设，核对当步工具面 | 区分发布、隐藏与实际可调用 |
| 验收 | 比较实际定位结果和分页 | 关键命中全部核实，缺项查来源 |
| 恢复 | 停止盲重试，回读文件及缓存状态 | 能判断已有副作用后再修正或回退 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载、运行时存储，金额未知 | 核对版本、路径和副本 | 不用 dry-run 推断兼容 |
| 持续 | 模型、worker、分页和缓存成本未知 | 审核关键命中与返回边界 | 不以单次输出字数代替任务收益 |
| 失败恢复 | 重跑和备份成本未知 | 核对磁盘与缓存、回原版工具 | 已启动调用的结果可能未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 工具面替换 | 守卫按作用域和实际步骤检查替换能力 | 目标任务语义是否等价 |
| 文件执行 | 会话策略、授权重查和结果状态各有路径 | 目标环境里的平台行为 |
| 有界输出 | 源码提供字节限制、分页和结果引用 | 同任务节省与遗漏率 |

> **思考**：[Q03](#research-q03) 指出替换守卫能确认对应定义可执行，但不确认原版与替换语义等价。短引用和分页节省上下文的前提是模型没有遗漏关键证据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将文件 worker、会话策略和共享工具面串接。[Q03](#research-q03) 的关键组合是按实际工具视图判断替换，并在分页中分开展示和源执行完整性。它为有界工具结果提供可核查的调用路径。

[Q02](#research-q02) 的共享发布器在实际调用时核对当步 toolSet，授权撤回可取消本地等待。取消不证明所有副作用已停止，调用方仍需根据 [Q05](#research-q05) 的结果分支回读。受限 Bash 与文件 worker 是两条分别核查的链。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 指出替换守卫能确认对应定义可执行，但不确认原版与替换语义等价。短引用和分页节省上下文的前提是模型没有遗漏关键证据。

<a id="detail-section-6"></a>

### 1.5 使用建议

按 [Q05](#research-q05) 取得匹配的可信发行物后，只在可恢复副本做一次带标准答案的只读搜索。核对分页和每处命中。遗漏结果、找不到预期工具或状态不明时暂停，回原工具和磁盘核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

作用域发布、调用策略和回执边界有源码支持。token 节省、文件隔离的真实平台效果和任务覆盖回执仍待验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、src/presets/defaults.ts、src/index.ts、src/consumer/mount.ts、src/publication/native.ts、src/publication/scope-owner.ts、src/publication/registrar.ts、src/projections/native/runtime.ts、src/execution/files.ts、src/shells/session-execution.ts、src/publication/replacements.ts、src/capabilities/replacements.ts、src/projections/native/read-dedup.ts、src/projections/native/result-render.ts、package.json、src/execution/runtime.ts、src/kernel/result-lifecycle.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根仓 inventory 覆盖指定 Markdown 和 JS/TS 文件。实际抽读单行配置、消费计划、Native 代表路径、替换与有界结果。未审所有 Rust worker 路径、WSL、全部工具或 Bash，未执行宿主、测试和目标代码。
- 下一步：在相同宿主和模型上比较原工具和匹配的 dsh-ops，固定仓库副本与已知目标，记录漏检、预算和恢复情况。拟议任务覆盖的反证见 [Q06](#research-q06)。

**分析版本**

- **仓库**：[T-Auto/dsh-ops](https://github.com/T-Auto/dsh-ops)
- **版本号**：0.5.1（[固定提交 5057124](https://github.com/T-Auto/dsh-ops/tree/5057124dd7922d3d275b54f9f195fa5881dff0c9)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出在已知任务目标时对照实际覆盖，避免把局部正确的结果当成仓库搜索完结。用同任务漏检和总体投入验证是否值得。

在相同宿主和模型上比较原工具和匹配的 dsh-ops，固定仓库副本与已知目标，记录漏检、预算和恢复情况。拟议任务覆盖的反证见 [Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 129 | 16215 | — | — | 230690 |
| .mjs | source | 67 | 15221 | 10616 | 3850 | — |
| .mjs | example | 10 | 1750 | 1130 | 519 | — |
| .ts | source | 252 | 22886 | 17033 | 4929 | — |
| .tsx | source | 5 | 666 | 532 | 118 | — |
| .mjs | test | 259 | 41490 | 35758 | 3748 | — |
| .md | example | 1 | 19 | — | — | 100 |
| .mts | test | 1 | 15 | 11 | 4 | — |
| .ts | test | 10 | 441 | 339 | 87 | — |

</details>

**活跃度**

[![Issue 未关闭 72](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=72&color=737b86&logo=github)](https://github.com/T-Auto/dsh-ops/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 422](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=422&color=737b86&logo=github)](https://github.com/T-Auto/dsh-ops/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 352](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=352&color=737b86&logo=github)](https://github.com/T-Auto/dsh-ops/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户在可恢复仓库里使用 dsh-ops 的文件工具时，替换工具和压缩输出的收益成立需要哪些前提？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪种文件任务值得尝试，和官方工具的差别是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

经常让 DSH 在大型仓库里定位定义和调用点、又能人工核对命中范围的开发者，可以先对一条只读定位任务做对照。使用原版 read、glob、grep 已能收集证据。dsh-ops 增加的是一组按预设发布的文件能力、候选工具发现和有界输出，并在符合条件时隐藏部分原版工具。固定配置启用 Native 与 PTC 等预设，具体使用面仍由 Agent 模式决定。合格结果是找到所有预先核定的目标位置并能解释缺口，调用少但漏掉调用点不能算节省。作者展示的 token 样例未提供足够同任务条件，不能从样例推算实际节省或跨插件兼容。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-37](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/README.md#L21-L37)

作者提出 token、紧凑输出和按需发现目标。

<details>
<summary>查看原文（17行）</summary>

```text
# dsh-ops

以提高token效率为目的，提供新增的ops系列工具并隐藏部分官方工具为方案的插件，低改动面，低侵入性，与其他插件广泛兼容。

- Bash 与宿主 Shell 隐藏独立配置；Windows 可用 ops_bash 替代 pwsh，也可保留官方 Shell。
- Native/PTC 消费者预设发布共享的有界工具面；Bash 由单行开关控制，关闭替换时原版工具保持可用。
- 启用 DSH 预留的 `tools_addition` 动态工具加载，并提供渐进式纰漏的工具，作为高级功能（如pdf、word读取、超多文件批量修改）的加载平台，大大减少常见特定场景的token消耗量，且不会导致系统提示词膨胀
- 为 Native 模式提供返回紧凑、带行号和更好错误回馈的工具以遏制报错循环，减少调用轮次
- 为 PTC 模式提供一些返回结构化 JSON 值的工具以降低 ai 在 ptc 模式下编写 TypeScript 代码的token总量和心智负担
- PTC SDK 目录包含 18 个 API：15 个文件/文档工具，加批处理、结果引用和加载器。

<p align="center">
  <img src="https://github.com/user-attachments/assets/8238e4cd-61aa-4740-83bf-3aa6dd61291b" height="300" alt="dsh token 效率">
  &nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/a0c0fdfe-337a-43d5-8ca2-326d9287bfea" height="300" alt="第二张图">
</p>
<p align="center"><em>左：deepseek-v4.1-flash-1017在各harness的跑分与开销<br>右：ops在自用benchmark上取得的的成绩。完整benchmark将随后续更新发布<br>dsh-ops团队将致力于持续优化dsh的token效率，以更低的成本更好地完成同样的任务</em></p>
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:9-34](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/cordis.patch.yml#L9-L34)

一个 bundle 行配置多种预设与隐藏开关。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/presets/defaults.ts:32-50](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/presets/defaults.ts#L32-L50)

standard 和 cordis 计划发布 Native 文件工具，PTC 与 minimal 各有不同工具面。

<details>
<summary>查看原文（19行）</summary>

```text
const NATIVE_REPLACEMENTS: readonly OfficialReplacement[] = Object.freeze(['read', 'glob', 'grep'])

/** Everything one mode publishes; consumers read this instead of branching on ids. */
export const MODE_PLANS: Readonly<Record<ModeId, ModePlan>> = Object.freeze({
  // Minimal keeps its terse prompts: OPS Bash is published independently, and
  // advanced tools arrive through the discovery entry when that row is on.
  minimal: Object.freeze({ nativeFiles: false, replacements: [], shell: true, ptc: false, discovery: 'all', section: null }),
  standard: Object.freeze({ nativeFiles: true, replacements: NATIVE_REPLACEMENTS, shell: true, ptc: false, discovery: 'advanced', section: 'standard' }),
  ptc: Object.freeze({ nativeFiles: false, replacements: [], shell: true, ptc: true, discovery: 'none', section: 'ptc' }),
  cordis: Object.freeze({ nativeFiles: true, replacements: NATIVE_REPLACEMENTS, shell: true, ptc: false, discovery: 'advanced', section: 'cordis' }),
})

/**
 * The resident native capability names of one mode.
 * @param mode - the mode to read.
 * @returns public OPS names, or an empty list when the mode publishes no native file tools.
 */
export function residentTools(mode: ModeId): readonly string[] {
  return MODE_PLANS[mode].nativeFiles ? NATIVE_RESIDENT_RAW.map(raw => publicToolName(raw)) : []
```

</details>

#### 缺口

- 缺少相同模型、仓库和验收条件下的同任务数据
  **影响**：不能判断净节省及切换所需频率
  **进一步探讨**：固定输入和预算，盲查两组已知调用点的完整性。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Native 文件能力如何接到会话、检查权限并调用 worker？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根 apply 按启用预设挂载消费端，Native 分支将常驻能力交给 mountNative。以共享文件定义为例，发布器按 Agent 取租约，要求覆盖当前会话模式且不是 PTC 展示；共享源使用 NativeFileTools，实际分派要匹配本步 toolSet 内的可执行定义及有效授权。普通文件调用进入 invoke，先取得会话 ID 和权威 cwd，受会话调用预算限制，再从宿主解析 sandboxPolicy。写入在 read-only 被拒，workspace-write 只准工作区、明确授予的根和会话临时目录内的目标，默认拒绝特定凭据路径。准备后重新核对授权，正常本地分支将 JSON 交给固定文件 worker 由 subprocess 执行。这个链路用策略和 worker 的固定操作边界，普通文件 spawn 未以通用 sandbox.confine 包装；结果存储和可选 WSL 路径另行处理。受限 Bash 则在运行前调用宿主 sandbox.confine 并拒绝无有效返回的情形。由此不能把两条执行链的隔离保证混用。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:52-59](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/index.ts#L52-L59)

根行实际按模式挂载。

```text
    for (const mode of ['minimal', 'standard', 'ptc', 'cordis'] as const) {
      const state = config[mode]
      const effective = resolveModeConfig(effectiveMode(state, config.global, typeof config.other.raw?.pwsh7Link === 'boolean' ? config.other.raw.pwsh7Link : companionVersion({ sweep: false }) !== undefined), mode)
      await host.plugin({ name: `dsh-ops/consumer-${mode}`, apply(ctx: Context) {
        applyResolvedMode(ctx, effective, mode, { enabled: state.enabled,
          discovery: { ...config.discovery.config, enabled: config.discovery.enabled },
          dynamic: dynamicForMode(state, config.global) })
      } })
```

**依据 2 · 源码核查**：[src/consumer/mount.ts:48-58](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/consumer/mount.ts#L48-L58)

Native、发现、PTC 与官方工具替换分别接线。

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
  } else if (plan.files) mountPtc(ctx, plan.ptc, { ...gate, guidance: core.promptPolicy, resident: plan.residentTools, dynamic: plan.discovery })
  if (plan.replaceOfficial) mountReplacements(ctx, { id: plan.id, targets: plan.replacementTargets, gate, keepOfficial: () => false })
```

</details>

**依据 3 · 源码核查**：[src/publication/native.ts:41-57](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/publication/native.ts#L41-L57)

先解析平台 worker，再注入宿主服务。

<details>
<summary>查看原文（17行）</summary>

```text
export function mountNative(root: Context, config: ResolvedConfig, publication: NativePublication): (agent: Agent) => boolean {
  const { id: mode, tools: names, section, gate } = publication
  let ownsGuidance: (agent: Agent) => boolean = () => false
  let worker: string
  try { worker = resolveWorker({ binaryPath: config.binaryPath }) } catch (error) {
    if (config.required) throw error
    root.logger.warn(`dsh-ops: ${mode} mode cannot resolve its native worker; native file tools stay unpublished. ${String((error as Error)?.message ?? error)}`)
    return () => false
  }
  root.inject(['tools', 'systemPrompt', 'sandboxPolicy', 'subprocess'], async ctx => {
    const tools = ctx.get('tools')
    const prompt = ctx.get('systemPrompt')
    if (!tools || !prompt) return
    mountResultLifecycle(ctx)
    const entries = new Map<Agent, Entry>()
    let stopped = false, mutating = false
    const ownership = await ownScopes(ctx, 'native-files', () => reconcile(), gate.allows)
```

</details>

**依据 4 · 源码核查**：[src/publication/native.ts:66-78](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/publication/native.ts#L66-L78)

共享文件能力由 Agent 租约按呈现面授予。

<details>
<summary>查看原文（13行）</summary>

```text
    const publish = async (agent: Agent, entry: Entry): Promise<void> => {
      if (!entry.ctx) return
      const scope = agent
      const leases: PublicationLease[] = [], registrations: (() => void)[] = []
      for (const api of names.filter(isSharedFileApi)) {
        const lease = await acquireSharedFile(agent, api, { workerPath: worker, required: true, denyCredentialReads: config.denyCredentialReads })
        if (stopped || entries.get(agent) !== entry || !cover(agent)) { lease.dispose(); return }
        entry.disposers.push(() => lease.dispose())
        lease.grant({ consumer: entry, agent, token: {}, entitled: true,
          dispatch: async () => undefined,
          present: async activation => activation.agent === agent && cover(agent) && !await activationIsPtc(prompt, activation) })
        leases.push(lease)
        entry.owned.add(publicToolName(api))
```

</details>

**依据 5 · 源码核查**：[src/publication/scope-owner.ts:82-97](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/publication/scope-owner.ts#L82-L97)

共享租约使用 Native runtime 生成的实际分派。

<details>
<summary>查看原文（16行）</summary>

```text
    await owned.ready
    if (owned.closed) throw new Error('Shared file source is disposed')
    let cached = owned.definitions.get(api)
    if (!cached) {
      // runtime.definition retains Native render, metadata and dedup hooks and wraps raw call once.
      const { name: _name, execute, ...canonical } = owned.runtime.definition(api)
      cached = { canonical, dispatch: execute }
      owned.definitions.set(api, cached)
    }
    shared = cached
    lease = await acquire(agent.ctx, agent, publicToolName(api), shared.canonical)
  } catch (error) { release(); throw error }
  let disposed = false
  return {
    grant: grant => lease.grant({ ...grant, dispatch: shared.dispatch }),
    ready: () => lease.ready(),
```

</details>

**依据 6 · 源码核查**：[src/publication/registrar.ts:126-150](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/publication/registrar.ts#L126-L150)

执行时绑定本步工具定义和调用授权。

<details>
<summary>查看原文（25行）</summary>

```text
      const next: ToolDefinition = { ...canonical, name, execute: async (args, exec) => {
        if (definition !== next || !exec.agent || !exec.toolSet || tools.executable(name, exec.agent, exec.toolSet) !== next) {
          return denied()
        }
        const matching = eligible(exec.agent)
        if (!matching.length || matching.some(grant => grant.dispatch !== matching[0].dispatch)) return denied()
        const controller = new AbortController()
        const caller = exec.signal
        const abort = () => controller.abort(caller?.reason)
        let onCancel: () => void = () => {}
        const cancellation = new Promise<Outcome<never>>(resolve => {
          onCancel = () => resolve(cancelled(true))
          controller.signal.addEventListener('abort', onCancel, { once: true })
        })
        active.set(controller, new Set(matching))
        if (caller?.aborted) abort()
        else caller?.addEventListener('abort', abort, { once: true })
        try {
          if (controller.signal.aborted) return cancelled(false)
          // Race observes late success/rejection without retaining the active grant or
          // caller listener. Cancellation cannot prove arbitrary provider effects stopped.
          // InvocationLifetime.run awaits foreign work, so it cannot bound this handoff.
          const work = Promise.resolve(matching[0].dispatch(args, { ...exec, signal: controller.signal }))
          return await Promise.race([work, cancellation])
        } finally {
```

</details>

**依据 7 · 源码核查**：[src/projections/native/runtime.ts:65-76](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/projections/native/runtime.ts#L65-L76)

Native 文件分派调用 invoke。

<details>
<summary>查看原文（12行）</summary>

```text
  async call(tool: NativeToolName, args: unknown, exec: Execution): Promise<unknown> {
    if (this.stopped) return failure('POLICY_DENIED', 'Native file component is disposed.')
    if (!this.file) return failure('EXECUTOR_UNAVAILABLE', 'Native file worker path is unavailable.')
    try {
      return await this.calls.run(exec?.signal, signal => tool === 'result'
        ? invokeResult(this.ctx, this.file!, args, exec, signal, this.config, () => this.resultAdmission.authorize({ ...exec, signal }).catch(() => undefined))
        : invoke(this.ctx, this.file!, tool, args, exec, signal, this.config), undefined,
      Math.min(this.config.toolCallTimeoutMs ?? WORKER_TIMEOUT_MS, WORKER_TIMEOUT_MS))
    } catch (error) {
      if (error instanceof InvocationNotStarted) return failure('ABORTED', error.message)
      return failure('RESULT_UNKNOWN', 'Invocation did not settle; inspect postconditions before retrying.', 'execute', 'unknown')
    }
```

</details>

**依据 8 · 源码核查**：[src/execution/files.ts:81-113](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/execution/files.ts#L81-L113)

身份、会话 cwd、调用预算与宿主策略。

<details>
<summary>查看原文（33行）</summary>

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
  let policy: SandboxExecutionPolicy
  try { policy = policyService.resolve({ session }) } catch { return failure('EXECUTOR_UNAVAILABLE', 'DSH policy resolution failed.') }
  if (!['read-only', 'workspace-write', 'danger-full-access'].includes(policy?.mode)
    || typeof policy.workspaceRoot !== 'string' || !path.isAbsolute(policy.workspaceRoot)) return failure('EXECUTOR_UNAVAILABLE', 'Invalid authoritative DSH policy.')
```

</details>

**依据 9 · 源码核查**：[src/execution/files.ts:122-131](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/execution/files.ts#L122-L131)

凭据路径默认拒绝，可配置关闭。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

**依据 10 · 源码核查**：[src/execution/files.ts:146-168](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/execution/files.ts#L146-L168)

实际写入策略门限。

<details>
<summary>查看原文（23行）</summary>

```text
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
    for (const target of writeTargets) {
      const identity = trustedPath(target)
      if (!writeRoots.some(root => inside(root, identity))) {
        return denied(policy, `${tool} outside the workspace, explicit writable roots or this session's temporary directory`, 'danger-full-access', 'The user authorized workspace writes only; no files were changed.')
      }
      if (inside(writeRoots[1], identity)) {
        const created = ensureSessionTemp(writeRoots[1])
        if (!created.ok) return failure('EXECUTOR_UNAVAILABLE', created.message)
      }
    }
  }
```

</details>

**依据 11 · 源码核查**：[src/execution/files.ts:195-220](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/execution/files.ts#L195-L220)

准备后重查权限，正常路径以固定 argv 执行 worker。

<details>
<summary>查看原文（26行）</summary>

```text
    const current = policyService.resolve({ session })
    if (!sameAuthority(current, policy)) {
      if (!['read-only', 'workspace-write', 'danger-full-access'].includes(current?.mode) || !path.isAbsolute(current?.workspaceRoot ?? '')) return failure('EXECUTOR_UNAVAILABLE', 'Invalid authoritative DSH policy after preparation.')
      const required = mutates ? requiredMode(current) : undefined
      if (mutates && (current.mode === 'read-only' || (current.mode === 'workspace-write' && required === 'danger-full-access'))) return denied(current, tool, required, 'Authority changed during preparation; no files were changed.')
      return authorityChanged(current, tool)
    }
    const delegated = await tryWslRead(subprocess, file, envelope, cwd, signal, () => {
      const latest = policyService.resolve({ session })
      return sameAuthority(latest, policy)
    }, config)
    let transportInput = input
    if (signal.aborted) return failure('CANCELLED', 'The file call was cancelled before backend admission or result publication.')
    const latest = policyService.resolve({ session })
    if (!sameAuthority(latest, policy)) {
      if (!['read-only', 'workspace-write', 'danger-full-access'].includes(latest?.mode) || !path.isAbsolute(latest?.workspaceRoot ?? '')) return failure('EXECUTOR_UNAVAILABLE', 'Invalid authoritative DSH policy after WSL preparation.')
      const required = mutates ? requiredMode(latest) : undefined
      if (mutates && (latest.mode === 'read-only' || (latest.mode === 'workspace-write' && required === 'danger-full-access'))) return denied(latest, tool, required, 'Authority changed during preparation; no files were changed.')
      return authorityChanged(latest, tool)
    }
    if (!delegated.handled) {
      if (signal.aborted || delegated.remainingMs < 1) return failure('TIMEOUT', 'The original call budget expired during WSL preparation; no replay was attempted.')
      transportInput = JSON.stringify({ ...envelope, budget: { ...envelope.budget, timeoutMs: delegated.remainingMs } })
    }
    const result = delegated.handled ? { readers: true, interrupted: false, lossy: false, exitCode: 0, stderr: '', value: delegated.value, invalid: undefined }
      : await exchange(subprocess, { argv, cwd, stdio: { stdin: { data: transportInput }, stdout: { maxBytes: envelope.budget.maxBytes }, stderr: { maxBytes: 16 * 1024 } }, graceMs: 1000, signal }, () => { spawned = true })
```

</details>

**依据 12 · 源码核查**：[src/shells/session-execution.ts:45-61](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/shells/session-execution.ts#L45-L61)

受限 Bash 路径显式调用宿主进程约束。

<details>
<summary>查看原文（17行）</summary>

```text
      await preparation
      signal.throwIfAborted()
      await prepareWorkspace(policy)
      signal.throwIfAborted()
      if (policy.mode !== 'danger-full-access') {
        const sandbox = ctx.get('sandbox')
        if (!sandbox?.confine) throw new Error('SANDBOX_UNAVAILABLE: confinement is unavailable; no command executed.')
        confinement = await sandbox.confine(argv, { ...policy, mode: policy.mode }, signal)
        if (!['full', 'partial'].includes(confinement?.enforcement) || !confinement.argv?.length) throw new Error('SANDBOX_UNAVAILABLE: invalid confinement result; no command executed.')
      }
      signal.throwIfAborted()
      assertAuthority()
      // Recheck after asynchronous confinement/preparation, immediately before host spawn.
      await runtime.verify?.()
      signal.throwIfAborted()
      assertAuthority()
      return confinement?.argv ?? argv
```

</details>

#### 缺口

- 未测试 worker 对真实文件系统的写入边界及并发变更
  **影响**：宿主层授权检查不足以证明所有平台无越界
  **进一步探讨**：在隔离仓库测试只读、外部根、符号链接及授权变化，回读文件事实。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 隐藏官方工具何时成立，结果短小会漏掉什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

替换控制器仅在当前 Agent 能看到对应能力且宿主能解析它时登记隐藏限制。条件性工具不会仅因名字出现在清单就触发全局替换。调用守卫按实际步骤的 toolSet 判断对应能力是否可执行，若本步没带替换定义，就不以该替换为由拒绝原工具。该检查只关心该作用域中的可用性，不能证明 read 与 inspect_local_file 的返回、分页或缺省范围等价。Native 的重复读压缩包装的是结果，不跳过文件读取，只有保留了匹配的请求证据与正文时才能用短引用。分页显示另设字节上限，区分展示完毕、存储页完整和原执行完整。模型若把存储页的 complete 理解为仓库搜索已穷尽，会给出部分正确的结论。

#### 证据与依据

**依据 1 · 源码核查**：[src/publication/replacements.ts:81-107](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/publication/replacements.ts#L81-L107)

隐藏限制依据当前可见、可执行工具，并按 Agent 施加。

<details>
<summary>查看原文（27行）</summary>

```text
    // A hidden official tool disappears from the visible view, so "still visible"
    // cannot decide whether to keep hiding: a target stays denied while its OPS
    // counterpart is visible and it is either still visible or already denied by
    // this row. Reading only current visibility would lift and re-apply the mask
    // on every registry change and oscillate forever.
    // Conditional counterparts cannot drive an unconditional registry restriction.
    // They are guarded only when the actual step admits the replacement.
    const plan = (agent: Agent, entry: Entry): string[] => {
      if (keepOfficial()) return []
      const visible = new Set(visibleNames(tools, agent))
      return [...targets]
        .filter(([official, counterpart]) => visible.has(counterpart) && tools.executable(counterpart, agent) !== undefined
          && (visible.has(official) || entry.deny.includes(official)))
        .map(([official]) => official)
    }
    /** Bring one entry's mask in line with the surface it currently resolves. */
    const apply = (agent: Agent, entry: Entry): void => {
      const deny = plan(agent, entry)
      if (deny.length === entry.deny.length && deny.every(name => entry.deny.includes(name))) return
      lift(agent, entry)
      if (deny.length === 0) return
      try {
        // Attributed like the lift: this registration is this Agent's own change,
        // not a global one that every other live Agent has to be re-checked for.
        entry.lifts.push(publicationRegistration(agent.ctx, () => withToolChange([agent], () => agent.ctx.tools.restrict({ deny }))))
        entry.deny = deny
      } catch (error) { ctx.logger.warn(`dsh-ops: ${mode} replacement could not hide ${deny.join(', ')}: ${String(error)}`) }
```

</details>

**依据 2 · 源码核查**：[src/publication/replacements.ts:195-211](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/publication/replacements.ts#L195-L211)

实际执行守卫使用该步工具集合，缺替换则继续。

<details>
<summary>查看原文（17行）</summary>

```text
    const refusal: ToolGuard = exec => {
      if (stopped || keepOfficial()) return undefined
      const agent = exec?.agent
      if (!agent || !matches(agent)) return undefined
      const counterpart = targets.get(String(exec.name ?? ''))
      if (counterpart === undefined) return undefined
      // Same authority as the mask: the refusal answers for the surface the request was assembled
      // with, so a call the model could only make with the official tool is not refused on behalf
      // of a replacement that request never carried (#578).
      if (tools.executable(counterpart, agent, exec.toolSet) === undefined) return undefined
      return `dsh-ops ${mode} mode replaced the official tool ${String(exec.name)} with ${counterpart}; call ${counterpart}, or turn off that replacement in the dsh-ops row settings.`
    }
    ctx.on('tools/pre-execute', async (exec, next) => {
      const reason = refusal(exec)
      return reason ? { kind: 'deny', reason, info: { name: 'ReplacementError', code: 'MODE_REPLACEMENT' } } : next()
    })
    ctx.effect(() => tools.guard(refusal), `dsh-ops: ${mode} replacement guard`)
```

</details>

**依据 3 · 源码核查**：[src/capabilities/replacements.ts:1-6](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/capabilities/replacements.ts#L1-L6)

官方 read 映射到 inspect_local_file，另有 glob 与 grep。

```text
/** Reviewed replacement choices, shared with the browser without importing host code. */
export const RAW_OFFICIAL_REPLACEMENTS = Object.freeze({
  read: 'inspect_local_file', glob: 'glob', grep: 'grep',
} as const)
export type OfficialReplacement = keyof typeof RAW_OFFICIAL_REPLACEMENTS
export const OFFICIAL_REPLACEMENT_NAMES = Object.freeze(Object.keys(RAW_OFFICIAL_REPLACEMENTS) as OfficialReplacement[])
```

**依据 4 · 源码核查**：[src/projections/native/read-dedup.ts:11-16](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/projections/native/read-dedup.ts#L11-L16)

重复读记录是有界证据，明确不跳过文件操作。

```text
const READS = new Set(OBSERVED_READ_TOOLS.map(publicToolName))
const harmless = new Set(CAPABILITIES.filter(entry => !entry.mutates).map(entry => publicToolName(entry.rawName)))
const MAX_AGENTS = 16, MAX_RECORDS = 32, MAX_BODY_BYTES = 2 * 1024 * 1024

/** Scope-owned, bounded evidence. This never caches execution values or skips file authority/IO. */
export function createNativeReadDedup(ctx: Context): { wrap(tool: ToolDefinition): ToolDefinition; dispose(): void } {
```

**依据 5 · 源码核查**：[src/projections/native/read-dedup.ts:104-120](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/projections/native/read-dedup.ts#L104-L120)

匹配观察后才返回短文本引用。

<details>
<summary>查看原文（17行）</summary>

```text
  return {
    wrap(tool) {
      if (!READS.has(tool.name) || tool.finalizeContent) return tool
      return { ...tool, finalizeContent(exec, result) {
        try {
          if (!exec.agent || !exec.token || exec.callId.length > 256) return
          const state = current(exec.agent)
          const observation = state && observeRead(tool, exec, result)
          if (!state || !observation) return
          for (const [entry, messageId] of state.proof) {
            if (entry.key !== observation.key || entry.body !== observation.body || messageId.length > 256) continue
            const text = unchangedContent(observation.body, entry.callId, messageId)
            if (text) return [{ type: 'text', text }]
          }
          pending.set(exec.token, { state, entry: readRecord(observation, exec) })
        } catch { if (exec.agent) forget(exec.agent) }
        return undefined
```

</details>

**依据 6 · 源码核查**：[src/projections/native/result-render.ts:17-32](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/projections/native/result-render.ts#L17-L32)

页展示截断和源执行完整分别报告。

<details>
<summary>查看原文（16行）</summary>

```text
  const items: unknown[] = Array.isArray(value.items) ? value.items : []
  let body = header.join('\n'), displayed = 0
  for (const item of items) {
    const next = body + '\n' + text(item)
    // Reserve the final paging notice and keep every displayed stored row intact.
    if (bytes(next) > 60 * 1024) break
    body = next; displayed++
  }
  const displayComplete = displayed === items.length
  const notice = '[Notice: displayedRows=' + displayed + '; displayComplete=' + displayComplete
    + '; pageComplete=' + text(value.complete) + '; omitted=' + text(value.omitted)
    + (displayComplete ? '; nextOffset=' + text(value.nextOffset) : '; repeatOffset=' + text(args.offset ?? 0))
    + '. Page completeness covers stored rows only; source execution and capture completeness are independent.]'
  return body + '\n' + notice + (!displayComplete
    ? '\nNext: Repeat the same offset with a smaller limit/maxBytes or fewer fields. Do not advance past undisplayed rows.'
    : typeof value.nextAction === 'string' ? '\nNext: ' + value.nextAction : '')
```

</details>

#### 缺口

- 没有跨长上下文验证模型如何解释短引用和分页
  **影响**：仍可能漏读影响采用的路径
  **进一步探讨**：让同一模型定位预埋跨页调用点，检查缺失、额外工具轮次和 token。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装候选与实际运行依赖怎样核对？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

当前源树清单版本是 0.5.1，声明 Node ^22.19 或 >=24，DSH 范围为 >=0.2.2-rc.1 且 <0.2.3-0。安装时应以实际 tarball 与宿主版本为准。作者说明从 Git 直接安装会缺少已构建运行时；README 也把开发分支候选的 Windows Bash 载荷与 @latest 区分。本轮未取得相同发布包。文件 worker 选择器只支持 Windows x64、Linux x64 及 macOS arm64/x64。包内候选以平台、包版本、文件名和 SHA-256 对照旁置收据，只能发现不一致，不能验证同时被替换的二进制与收据。显式 worker 路径不会在失败后悄悄回退，非包内路径不会自动拥有收据保证。Native 发布无法解析 worker 时按 required 配置抛错或保持未发布，不能由 profile 已挂载推断工具已可用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-6](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/package.json#L1-L6)

固定源码外层版本。

```text
{
  "name": "dsh-ops",
  "version": "0.5.1",
  "publishConfig": {
    "access": "public"
  },
```

**依据 2 · 源码核查**：[package.json:208-218](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/package.json#L208-L218)

适配器声明宿主 peer 约束。

<details>
<summary>查看原文（11行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.1.0",
    "@deepseek-ai/dsh": ">=0.2.2-rc.1 <0.2.3-0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/cordis": {
      "optional": true
    },
    "@deepseek-ai/dsh": {
      "optional": true
    }
```

</details>

**依据 3 · 源码核查**：[package.json:269-272](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/package.json#L269-L272)

Node 与 DSH 运行范围。

```text
  "engines": {
    "node": "^22.19 || >=24",
    "dsh": ">=0.2.2-rc.1 <0.2.3-0"
  }
```

**依据 4 · 作者声明**：[README.md:41-43](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/README.md#L41-L43)

作者区分候选 Windows 载荷与已发版本。

```text
## 安装、更新、卸载

> 本分支候选的 Windows 默认载荷为完整 Niubash 1.5.0，随 `dsh-ops` 主包管理，不再默认下载 Git Bash 可选包。所有 npm、市场和 CLI 更新入口的二进制位置与清理边界见[升级与卸载](docs/升级与卸载.md#二进制位置与更新清理)。`@latest` 仍指已发布版本，不代表此 PR 已发布。
```

**依据 5 · 作者声明**：[README.md:79-88](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/README.md#L79-L88)

作者说明发行物、Git 安装缺失与支持范围。

<details>
<summary>查看原文（10行）</summary>

```text
普通 DSH CLI 不能管理保留的 `desktop` profile；不要把它与桌面自带入口混淆。

请安装 registry 发行包，或已完整构建并打包的源码 tarball。直接 `git+https` 安装与未构建的
源码检出缺少完整运行时；见[不支持通过 Git 通道安装](docs/升级与卸载.md#不支持通过-git-通道安装)。

#### 更新方法

宿主支持从 DSH **0.2.2-rc.1** 起；0.5 系列不再支持 0.2.0/0.2.1 或更早的 0.2.2 预览版。保留 DSH adapter 结构，按 0.2.2 原生工具准入和执行器接口接入。
组件图标导出、profile 刷新及配置/schema 检查见
[宿主兼容范围与展示元数据](docs/使用指南.md#宿主兼容范围与展示元数据)。
```

</details>

**依据 6 · 源码核查**：[src/execution/runtime.ts:34-42](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/execution/runtime.ts#L34-L42)

包内 worker 收据匹配具体平台与字节。

```text
/** Shared receipt check for locally executed and delegated packaged payloads. */
export function verifyPackagedWorker(file: string, packageRoot: string, platform: string, arch: string): string {
  const receipt = readJson(path.join(path.dirname(file), 'provenance.json'), 'provenance receipt',
    path.posix.join('runtime', `${platform}-${arch}`, 'provenance.json'))
  const version = readJson(path.join(packageRoot, 'package.json'), 'package manifest', 'package.json').version
  const digest = createHash('sha256').update(fs.readFileSync(file)).digest('hex')
  if (!fs.statSync(file).isFile() || receipt.target !== `${platform}-${arch}` || receipt.version !== version
    || receipt.executable !== workerName(platform) || receipt.sha256 !== digest) throw new Error('Native worker provenance mismatch.')
  return digest
```

**依据 7 · 源码核查**：[src/execution/runtime.ts:72-82](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/execution/runtime.ts#L72-L82)

平台范围、显式选择与默认路径。

<details>
<summary>查看原文（11行）</summary>

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
      { file: fromSourceTree, note: 'source-tree build (npm run build:ptc) — a dev artifact, with no receipt to verify against' },
    ]
```

</details>

**依据 8 · 源码核查**：[src/execution/runtime.ts:106-122](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/execution/runtime.ts#L106-L122)

指出收据替换边界和无自动下载。

<details>
<summary>查看原文（17行）</summary>

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
      verifyPackagedWorker(file, packageRoot, platform, arch)
    } else {
      // Not silent: an unverified worker binary is a fact the operator should see.
      console.warn(`dsh-ops: native worker selected without provenance verification — ${note}: ${file}`)
    }
    return file
  }
  throw new Error(`Native worker unavailable for ${platform}-${arch}. Tried:\n${skipped.map(entry => `  ${entry}`).join('\n')}\nInstall a runtime-bearing dsh-ops package, or run npm run build:ptc in the source checkout. No ACL repair, shell fallback or automatic download is performed.`)
```

</details>

**依据 9 · 源码核查**：[src/publication/native.ts:41-50](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/publication/native.ts#L41-L50)

无法解析 worker 的发布处置。

<details>
<summary>查看原文（10行）</summary>

```text
export function mountNative(root: Context, config: ResolvedConfig, publication: NativePublication): (agent: Agent) => boolean {
  const { id: mode, tools: names, section, gate } = publication
  let ownsGuidance: (agent: Agent) => boolean = () => false
  let worker: string
  try { worker = resolveWorker({ binaryPath: config.binaryPath }) } catch (error) {
    if (config.required) throw error
    root.logger.warn(`dsh-ops: ${mode} mode cannot resolve its native worker; native file tools stay unpublished. ${String((error as Error)?.message ?? error)}`)
    return () => false
  }
  root.inject(['tools', 'systemPrompt', 'sandboxPolicy', 'subprocess'], async ctx => {
```

</details>

#### 缺口

- 未核实该提交对应的可安装发布物
  **影响**：不能把已装旧版本特性归到固定提交
  **进一步探讨**：取得可信目标 tarball 后比对清单、运行时平台和 provenance，使用相符宿主。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样计量试用成本并处理不确定结果？

**研究主题**：效果与总成本、采用判断

#### 完整回答

建议先用可恢复仓库副本做一项只读定位，固定模型、目标位置与预算。按一次全部关键命中可核对的任务计量，首次记录准备匹配版本、配置、对照与备份的人工时间；持续记录模型 token、worker、缓存和存储；失败记录重新分页、核对磁盘和恢复的全部时间。现有源码不能给出这些用量。预检拒绝时可以在更正请求后重新发起。若 worker 启动后中断、输出超额、无效或非零退出，宿主分支会将部分情况标为结果未知，并要求先检查实际文件，不能盲重试写入。会话关闭会尝试清理缓存，失败时登记延后并保留警告，不能把逻辑过期当成物理擦除。若只读任务漏结果或替换面不清楚，可停止并关闭替换，回原版工具核对范围。出现未知写入时回读文件和差异后再决定是否恢复副本。

#### 证据与依据

**依据 1 · 源码核查**：[src/execution/files.ts:30-35](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/execution/files.ts#L30-L35)

失败载荷明确区分无副作用和需回读的未知状态。

```text
export function failure(code: string, message: string, phase = 'preflight', effectState: EffectState = 'none') {
  return { status: code === 'POLICY_DENIED' ? 'rejected' : 'error', phase,
    changed: 0, matched: 0, skipped: 0, failed: 0, complete: false, omitted: 0,
    error: { code, phase, retryable: false, effectState,
      nextAction: effectState === 'none' ? 'Correct the request or restore host authority.' : 'Inspect the result; do not blindly retry after an unknown effect.', message } }
}
```

**依据 2 · 源码核查**：[src/execution/files.ts:219-239](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/execution/files.ts#L219-L239)

进程启动后异常的多类未知结果分支。

<details>
<summary>查看原文（21行）</summary>

```text
    const result = delegated.handled ? { readers: true, interrupted: false, lossy: false, exitCode: 0, stderr: '', value: delegated.value, invalid: undefined }
      : await exchange(subprocess, { argv, cwd, stdio: { stdin: { data: transportInput }, stdout: { maxBytes: envelope.budget.maxBytes }, stderr: { maxBytes: 16 * 1024 } }, graceMs: 1000, signal }, () => { spawned = true })
    if (!result.readers) return failure('RESULT_UNKNOWN', 'Worker output readers are unavailable; inspect postconditions.', 'verify', 'unknown')
    if (result.interrupted) return failure('RESULT_UNKNOWN', 'Worker interrupted; inspect postconditions.', 'execute', 'unknown')
    if (result.lossy) return failure('OUTPUT_LIMIT', 'Worker output exceeded the byte budget; operation facts may have changed.', 'verify', 'unknown')
    if (result.exitCode !== 0) return failure('RESULT_UNKNOWN', `Worker did not return a settled result: ${result.stderr.slice(0, 500)}`, 'execute', 'unknown')
    if (result.invalid === 'json') return failure('RESULT_UNKNOWN', 'Worker returned invalid JSON; inspect postconditions.', 'verify', 'unknown')
    if (!result.value) return failure('RESULT_UNKNOWN', 'Worker returned a non-object result; inspect postconditions.', 'verify', 'unknown')
    const value = result.value
    // Report reads/writes to the host's read-before-edit table, exactly like host read/edit. (#17)
    if (['inspect_local_file', 'stat'].includes(tool) && value?.status === 'completed') emitObserved(ctx, readObservation, exec)
    if (reads && Array.isArray(value?.items)) {
      for (const [index, item] of value.items.entries()) {
        if (record(item) && item.status === 'completed') emitObserved(ctx, readObservations[index], exec)
      }
    }
    if (mutates) await observeReplaced(ctx, fsService, value, cwd, exec, signal)
    const normalized = normalizeNativeDenial(value, policy, tool, mutates ? requiredMode(policy) : 'workspace-write')
    return { ...normalized, sandbox: { mode: policy.mode, enforcement: 'policy', boundary: 'trusted-native-file-operations' } }
  } catch (error) {
    return failure(spawned ? 'RESULT_UNKNOWN' : 'EXECUTOR_UNAVAILABLE', `DSH trusted file executor failed; this is not a user authorization denial. ${errorText(error)}`, 'execute', spawned ? 'unknown' : 'none')
```

</details>

**依据 3 · 源码核查**：[src/kernel/result-lifecycle.ts:147-169](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/kernel/result-lifecycle.ts#L147-L169)

关闭会话等在途工作并尝试清理，失败进入延后路径。

<details>
<summary>查看原文（23行）</summary>

```text
  entry.stopped = true
  // Publish the barrier before abort listeners can synchronously reopen the same id.
  entry.closing = Promise.resolve().then(async () => {
    await Promise.allSettled(entry.work.values())
    for (const cleanup of entry.cleanup.values()) {
      try {
        await cleanup.run()
        if (cleanup.root !== undefined) completeCleanupRoot(cleanup.root)
      } catch (error) {
        const reason = classifyCleanupFailure(error)
        if (cleanup.root !== undefined) {
          recordCleanupFailure(cleanup.root, reason)
          const attempts = (deferred.get(cleanup.root)?.attempts ?? 0) + 1
          if (deferred.size < MAX_DEFERRED_CLEANUPS && attempts <= MAX_DEFERRED_ATTEMPTS) {
            deferred.set(cleanup.root, { run: cleanup.run, attempts, reason, nextAt: Date.now() + backoffMs(attempts) })
          }
        }
        reportDeferred(ctx, `dsh-ops: session result references expired; physical cache cleanup did not complete under current host authority (${reason}). Deferred cleanup is recorded and retried when this host regains write authority or at the next start-up sweep.`)
      }
    }
    entry.cleanup.clear(); state.sessions.delete(session)
  })
  for (const controller of entry.work.keys()) controller.abort(new Error('Result session disposed'))
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:14-18](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/cordis.patch.yml#L14-L18)

官方工具隐藏由单独配置控制。

```text
        global:
          bash: true
          hidePwsh: true
          hideOfficialTools: true
          dynamicTools: true
```

**依据 5 · 作者声明**：[README.md:92-103](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/README.md#L92-L103)

作者说明 profile 退出和独立 provision 残留。

<details>
<summary>查看原文（12行）</summary>

````text
#### 卸载与查看状态

```console
npx --yes dsh-ops@latest status --profile desktop
npx --yes dsh-ops@latest uninstall --profile desktop
```

把 `desktop` 换成 `web` 或 `tui` 即可。也可在市场卸载，或执行官方 `dsh plugin --profile ... remove dsh-ops`。随包二进制由 profile 的包管理器管理；显式 provision 的副本不会随 npm 卸载，先查看 `dsh-ops bash-runtime status`，再用 `dsh-ops bash-runtime remove --dry-run` 预览、`remove --yes` 确认。不要误删系统 shell、其它 profile 或共享缓存。详见[二进制位置与更新清理](docs/升级与卸载.md#二进制位置与更新清理)。

旧版显式 provision 的 `<DSH_HOME>/dsh-ops/` 文件（provision 的 shell，以及早期版本可 provision 的 FastCtx 运行时）需单独清理：`npx --yes dsh-ops@latest uninstall --yes`。已移除的后台组件留下的 `~/.fastctx/` 状态默认不删；需要时显式加 `--purge-fastctx`。

组件 bundle 只插入一个 `dsh-ops` 行：其中按预设配置常驻、动态加载、Bash、文件替换与宿主 PowerShell 隐藏，并可通过 `presets` 显式接入自定义消费者。内置与外部预设共用装配流程。旧 `mode-*`、`discovery`、`compat`、`panel`、`tui` 及更早的 `shell`、`file`、`ptc`、`hide-official` 行覆盖须迁入单行；兼容开关已移除，改用各项隐藏开关。见[配置参考](docs/配置参考.md)。
````

</details>

#### 缺口

- 没有任务合格率和恢复操作实测
  **影响**：不能定量判断节省或未知结果的发生率
  **进一步探讨**：比较两组总 token、人工分钟、漏检和发生失败后的恢复成功数。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否识别局部正确但任务遗漏的结果？

**研究主题**：新假设与验证

#### 完整回答

假设给预先定义了目标文件或符号集合的只读任务附一张覆盖回执，区分找到、已排除、超预算待查以及来源未知。当前分页已分清展示和存储，仍没有任务级目标清单；新增工作是把每个期望和实际结果对应，要求使用者指定可核实的目标，不能从一次 grep 结果反推全部范围。取相同仓库的几组预埋调用点，控制模型、上下文、任务和预算，对照现有分页提示与附覆盖回执，比较漏检、误报、总 token 与人工。若漏检未减少、回执新增大于节省，或模型把未确认项误读成完成，就放弃该设计。

#### 证据与依据

**依据 1 · 源码核查**：[src/projections/native/result-render.ts:25-32](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/projections/native/result-render.ts#L25-L32)

当前已有展示与来源完整性提示，构成对照。

```text
  const displayComplete = displayed === items.length
  const notice = '[Notice: displayedRows=' + displayed + '; displayComplete=' + displayComplete
    + '; pageComplete=' + text(value.complete) + '; omitted=' + text(value.omitted)
    + (displayComplete ? '; nextOffset=' + text(value.nextOffset) : '; repeatOffset=' + text(args.offset ?? 0))
    + '. Page completeness covers stored rows only; source execution and capture completeness are independent.]'
  return body + '\n' + notice + (!displayComplete
    ? '\nNext: Repeat the same offset with a smaller limit/maxBytes or fewer fields. Do not advance past undisplayed rows.'
    : typeof value.nextAction === 'string' ? '\nNext: ' + value.nextAction : '')
```

**依据 2 · 源码核查**：[src/execution/files.ts:227-235](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/execution/files.ts#L227-L235)

已有宿主文件观察是针对成功读条目与写入的证据，无法替代任务范围。

```text
    const value = result.value
    // Report reads/writes to the host's read-before-edit table, exactly like host read/edit. (#17)
    if (['inspect_local_file', 'stat'].includes(tool) && value?.status === 'completed') emitObserved(ctx, readObservation, exec)
    if (reads && Array.isArray(value?.items)) {
      for (const [index, item] of value.items.entries()) {
        if (record(item) && item.status === 'completed') emitObserved(ctx, readObservations[index], exec)
      }
    }
    if (mutates) await observeReplaced(ctx, fsService, value, cwd, exec, signal)
```

**依据 3 · 源码核查**：[src/projections/native/read-dedup.ts:107-118](https://github.com/T-Auto/dsh-ops/blob/5057124dd7922d3d275b54f9f195fa5881dff0c9/src/projections/native/read-dedup.ts#L107-L118)

已有重复读基于结果与证据核对，可作为现状参照。

<details>
<summary>查看原文（12行）</summary>

```text
      return { ...tool, finalizeContent(exec, result) {
        try {
          if (!exec.agent || !exec.token || exec.callId.length > 256) return
          const state = current(exec.agent)
          const observation = state && observeRead(tool, exec, result)
          if (!state || !observation) return
          for (const [entry, messageId] of state.proof) {
            if (entry.key !== observation.key || entry.body !== observation.body || messageId.length > 256) continue
            const text = unchangedContent(observation.body, entry.callId, messageId)
            if (text) return [{ type: 'text', text }]
          }
          pending.set(exec.token, { state, entry: readRecord(observation, exec) })
```

</details>

#### 缺口

- 覆盖回执未实现或验证
  **影响**：尚不知增加的显式目标是否影响任务负担
  **进一步探讨**：先对预先有标准答案的定位任务人工生成回执并盲评。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
