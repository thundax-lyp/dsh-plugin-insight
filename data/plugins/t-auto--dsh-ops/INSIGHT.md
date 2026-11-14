# dsh-ops

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[58f6e28](https://github.com/T-Auto/dsh-ops/tree/58f6e2817618fae52476e8c7f1920aaeb4421c7a)

<!-- BEGIN META -->
[![GitHub ★ 5,782](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C782&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/T-Auto/dsh-ops) [![npm 30d 229,747](https://img.shields.io/static/v1?label=npm+30d&message=229%2C747&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ops) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ops)
<!-- END META -->

> **功能**：给 DeepSeek Harness 增加 Native 文件工具、PTC 文件批处理与可选 Bash 能力。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，作用域内的工具替代与修订回执组合能把一部分可重复的文件核对放进宿主流程。[Q03](#research-q03) 的新版预设把程序形状反馈送到实际调用附近，便于比较批处理方法。

> **主要限制**：[Q02](#research-q02) 的移动先发布目标，随后可能无法移除来源。[Q04](#research-q04) 的截断或不完整扫描也可能让局部结果看起来像任务已经办完。

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
  - [Q01 · 哪类仓库任务值得从官方文件工具切到 OPS？](#detail-section-11)
  - [Q02 · 文件改写和搬移的权限、修订确认与失败回执怎样接线？](#detail-section-12)
  - [Q03 · 新 ops-ptc 预设何时出现，批处理提示改变了什么？](#detail-section-13)
  - [Q04 · 如何验收一页搜索结果没有漏项？](#detail-section-14)
  - [Q05 · 安装、运行与退出该怎样做成本对照？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 反复盘点仓库、读取目标段落并复核小批量改动的开发者，可以对照已知清单试验 OPS 文件工具与 PTC 结果。

原办法是使用官方文件工具与 Shell、逐次核对输出并保存修订。对简单或低频任务，切换工具层和 PTC 预设可能增加配置负担。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 原生文件和搜索 | 在会话内读取、匹配及操作文件 | 受宿主策略约束，需复核覆盖 |
| 工具替代和回退 | 在适用模式选择 OPS 工具 | 同次作用域判定可保留官方定义 |
| PTC 预设 | 在 run_code 中处理结构化文件任务 | 依赖宿主预设和作用域 |
| 批处理提示 | 给部分程序形态附上后续上下文 | 启发式，效果需实测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 包声明的 Node 和 DSH 版本 | 加载条件 | 解析发布入口与宿主 API | 需核对实际运行版本 |
| sandboxPolicy、subprocess 和对应 worker | 原生文件工具必需 | 可控路径和底层执行 | 拒绝执行或证据不足 |
| agentPresets、ptcRuntime、tools | 预设及 PTC 必需 | 注册和有权运行 API | 预设未就绪或调用不获准 |
| 同文件系统 | move 必需 | 用硬链接发布目标 | 跨盘明确失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 开发者核对发行制品与主机版本 | 对应 worker 和工具服务可用 |
| 初试 | 在隔离仓库按清单做只读检索 | 命中范围与排除项可解释 |
| 复核 | 回读一次可恢复改动及权限 | 内容和旧、新修订一致 |
| 退出 | 切回原预设并停用 OPS | 官方工具可见，缓存另行盘点 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装包及缓存资源 | 核对宿主、平台和工具链 | 启动时延未知 |
| 持续使用 | 模型上下文和结果存储 | 检查模式、覆盖和修订 | 单任务用量未知 |
| 失败恢复 | 可能另存结果或产生重复请求 | 查目标与来源后置事实，必要时回到原工具 | 并发与修复成本未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文件验收 | 权限、修订与部分变更有回执 | 跨平台和异常落盘行为 |
| 搜索覆盖 | 区分遍历、输出限制与游标 | 同任务实测漏项率 |
| 批处理 | PTC 程序附加针对性提示 | 提示导致的用量与质量变化 |

> **思考**：[Q02](#research-q02) 的移动先发布目标，随后可能无法移除来源。[Q04](#research-q04) 的截断或不完整扫描也可能让局部结果看起来像任务已经办完。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，作用域内的工具替代与修订回执组合能把一部分可重复的文件核对放进宿主流程。[Q03](#research-q03) 的新版预设把程序形状反馈送到实际调用附近，便于比较批处理方法。

[Q02](#research-q02) 的写入权限复核和 no-clobber 设计保留有限失败边界，[Q04](#research-q04) 的覆盖与显示页分别报告。复用时应将后置事实与工具状态共同记录。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的移动先发布目标，随后可能无法移除来源。[Q04](#research-q04) 的截断或不完整扫描也可能让局部结果看起来像任务已经办完。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议隔离试用，从只读清单和可复位改动开始；不能解释回执或缺少预期结果时退回官方工具。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持模式挂载、受控文件操作和 PTC 提示。部分写入及不完整搜索仍需核对后置事实，实际节省与跨文件系统行为未验证。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、src/index.ts、src/publication/replacements.ts、README.md、src/execution/files.ts、native/crates/ops-files/src/file_single.rs、src/presets/ops-ptc/register.ts、src/publication/ptc.ts、src/ptc/batching-guidance.ts、src/capabilities/file.ts、native/crates/ops-search/src/paging.rs、package.json、scripts/build.mjs、src/adapter/dsh/runtime-version.ts、src/cli/cache-reclaim.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查根安装、原生文件与搜索、替换工具、PTC 预设与提示、宿主版本和缓存。未评测全部可选 Bash、TUI、下载及第三方集成，也未运行本机插件或基准。
- 下一步：用固定模型和仓库比较官方工具与 OPS，再只切换 [Q03](#research-q03) 的提示开关。记录成功产物、令牌、轮次和人工修复，按 [Q04](#research-q04) 检查故意遗漏。

**分析版本**

- **仓库**：[T-Auto/dsh-ops](https://github.com/T-Auto/dsh-ops)
- **版本号**：0.5.5（[固定提交 58f6e28](https://github.com/T-Auto/dsh-ops/tree/58f6e2817618fae52476e8c7f1920aaeb4421c7a)）
- **版本日期**：2026-11-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出把必须覆盖的路径和预期结果设为独立验收条件，再结合工具回执判定是否完成。用有意排除的匹配、长行和不可访问目录检验能否减少遗漏。

用固定模型和仓库比较官方工具与 OPS，再只切换 [Q03](#research-q03) 的提示开关。记录成功产物、令牌、轮次和人工修复，按 [Q04](#research-q04) 检查故意遗漏。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 137 | 17427 | — | — | 255977 |
| .mjs | source | 68 | 15973 | 11190 | 3974 | — |
| .mjs | example | 10 | 1750 | 1130 | 519 | — |
| .ts | source | 257 | 23426 | 17460 | 5027 | — |
| .tsx | source | 5 | 708 | 564 | 126 | — |
| .mjs | test | 276 | 44232 | 38183 | 3963 | — |
| .md | example | 1 | 19 | — | — | 100 |
| .mts | test | 1 | 15 | 11 | 4 | — |
| .ts | test | 10 | 467 | 362 | 89 | — |

</details>

**活跃度**

[![Issue 未关闭 62](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=62&color=737b86&logo=github)](https://github.com/T-Auto/dsh-ops/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 447](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=447&color=737b86&logo=github)](https://github.com/T-Auto/dsh-ops/issues?q=is%3Aissue+created%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z) [![近30天关闭 413](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=413&color=737b86&logo=github)](https://github.com/T-Auto/dsh-ops/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z)



统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本的 OPS 能否改善重复仓库任务的文件操作与 PTC 批处理，同时说明授权、回执和遗漏边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类仓库任务值得从官方文件工具切到 OPS？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

在 DSH 反复盘点一个仓库、读取目标段落再审阅改动的开发者，可以用 OPS 的文件能力和结构化短结果，以人工清单检验覆盖。官方工具或脚本已经能完成任务，新增机制是把受限能力与结果回执放进同一宿主作用域。Bundle 单行加载根模块，再按配置挂载模式消费者。替代器把当前官方定义与 OPS 对应工具放到同一次作用域判定，在模式不匹配、无对应注册或对应 admission 不通过时保留官方工具。遇上外部条件不透明或同作用域第三方注册也不尝试覆盖。该判断发生在宿主解析工具时；若后续执行阶段故障，还要查看回执和实际文件，不能期待自动重放全部操作。作者希望减少上下文和调用轮次，这一效益仍需同一任务比较。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:9-34](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/cordis.patch.yml#L9-L34)

单行宿主和模式默认配置。

<details>
<summary>查看原文（26行）</summary>

```text
- insert:
    - id: dsh-ops
      name: dsh-ops
      config:
        # Four bundle switches that gate the same-named preset switch; then each
        # preset. All default on. The default preset has no key: it is a one-shot
        # action on the row's detail page, never an automatic write.
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
```

</details>

**依据 2 · 源码核查**：[src/index.ts:32-66](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/index.ts#L32-L66)

根 apply 到有效模式消费者。

<details>
<summary>查看原文（35行）</summary>

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
      await host.plugin({ name: `dsh-ops/consumer-${mode}`, apply(ctx: Context) {
        applyResolvedMode(ctx, effective, mode, { enabled: state.enabled,
          discovery: { ...config.discovery.config, enabled: config.discovery.enabled },
          dynamic: dynamicForMode(state, config.global) })
      } })
```

</details>

**依据 3 · 源码核查**：[src/publication/replacements.ts:46-81](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/publication/replacements.ts#L46-L81)

查找继承来源、跳过不可归属的定义，并在同次判定保留官方回退。

<details>
<summary>查看原文（36行）</summary>

```text
    /** Skip this controller's ancestor shadows and inspect the actual inherited official source. */
    const sourceFor = (agent: Agent, name: string): ToolDefinition | undefined => {
      for (const scope of [...scopeChainOf(agent).slice(1), undefined]) {
        const source = tools.get(name, scope)
        if (!source || sources.has(source)) continue
        // The host has no public predicate reader for foreign conditional tools.
        // Leave an official tool with its own unknown condition untouched.
        return tools.executable(name, scope) === source ? source : undefined
      }
      return undefined
    }
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
              if (keepOfficial() || !gate.allows(activation.agent)) return true
              const replacement = tools.get(counterpart, activation.agent)
              if (!replacement) return true
              const admission = publicationAdmission(replacement)
              return admission ? !await admission(activation) : tools.executable(counterpart, activation.agent) === undefined
```

</details>

**依据 4 · 作者声明**：[README.md:23-31](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/README.md#L23-L31)

作者说明定位和性能目标。

```text
以提高token效率为目的，提供新增的ops系列工具并隐藏部分官方工具为方案的插件，低改动面，低侵入性，与其他插件广泛兼容。

- Bash 与宿主 Shell 隐藏独立配置；Windows 可用 ops_bash 替代 pwsh，也可保留官方 Shell。
- Native/PTC 消费者预设发布共享的有界工具面；Bash 由单行开关控制，关闭替换时原版工具保持可用。
- 第五个内置模式 `ops-ptc` 继承 PTC 工具面，由插件运行时注册（定义来自随包片段 `presets/ops-ptc.patch.yml`，不是插件管理器行），并可开启批量调用上下文提示（`batchingGuidance`）：会话首轮注入一次英文教学（`prompts/batching-guidance.md`，进入历史、不改系统提示词），之后按根 `run_code` 程序形状（`bypass`/`plan`/`shape`，每类每轮一次、合规解锁）以 `additionalContexts` 纠偏、不阻断不改写程序；默认预设不强制：行详情页有一个按钮，点一次就把 `ops-ptc` 设为新会话默认，apply、重挂载与卸载都不会改你自己选的默认，详见[预设与默认模式](docs/预设与默认模式.md)。
- 启用 DSH 预留的 `tools_addition` 动态工具加载，并提供渐进式纰漏的工具，作为高级功能（如pdf、word读取、超多文件批量修改）的加载平台，大大减少常见特定场景的token消耗量，且不会导致系统提示词膨胀
- 为 Native 模式提供返回紧凑、带行号和更好错误回馈的工具以遏制报错循环，减少调用轮次
- 为 PTC 模式提供一些返回结构化 JSON 值的工具以降低 ai 在 ptc 模式下编写 TypeScript 代码的token总量和心智负担
- PTC SDK 目录包含 18 个 API：15 个文件/文档工具，加批处理、结果引用和加载器。
```

#### 缺口

- 无同宿主和模型下使用官方工具的同任务对照
  **影响**：可解释接线增量，无法量化令牌或时间收益
  **进一步探讨**：用固定文件树比较交付文件、遗漏、模型请求大小及手工复核次数

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件改写和搬移的权限、修订确认与失败回执怎样接线？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

宿主桥从会话权威策略得出写入范围，对只读或越界写操作直接拒绝，并将可信根、凭据拒绝和权限信息封装给处理固定操作的原生 worker。准备与 WSL 路径都重新检查权威策略变化。新版的复制和移动先核对预期来源修订与目标不存在，再在事务锁下处理目标；复制使用临时文件流式形成事实，发布前复核实际内容与来源修订。目标文件系统可能不具备持久 ACL，Windows 创建新文件分支会报告能力警告，不能把复制或创建解释为跨平台完整权限移植。移动使用硬链接实现同文件系统不覆盖式发布，拒绝跨盘降级；目标先发布，再查新旧修订并删除来源。源删除或发布后检查失败时可能两个文件都在，RESULT_PARTIAL 需要人工查两侧，不能直接重放。宿主也会把超时、无有效 JSON 等写入结果标成未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/execution/files.ts:147-185](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/execution/files.ts#L147-L185)

权限根、凭据防护、请求上限和 worker 数据。

<details>
<summary>查看原文（39行）</summary>

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
  const envelope = workerEnvelope('file', { root: trustedPath(cwd), scope: String(session.id), tool, args: workerArgs, read_only: policy.mode === 'read-only', deny_roots: denyRoots, deny_credential_names: (config?.denyCredentialReads ?? true) !== false, ...(policy.mode === 'workspace-write' ? { write_roots: writeRoots } : {}), ...indexCacheRequest({ enabled: config?.indexCache === true }) }, config?.toolCallTimeoutMs, storage)
  const input = JSON.stringify(envelope)
  if (Buffer.byteLength(input) > 2 * 1024 * 1024) return failure('OUTPUT_LIMIT', tool === 'write_file'
    ? 'write_file content makes the request exceed the 2 MiB byte budget; split it into smaller writes.'
    : 'Request exceeds the 2 MiB byte budget.')
```

</details>

**依据 2 · 源码核查**：[src/execution/files.ts:198-219](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/execution/files.ts#L198-L219)

准备与 WSL 切换前后的权威复核。

<details>
<summary>查看原文（22行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/execution/files.ts:224-234](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/execution/files.ts#L224-L234)

区分只读失败和变更未知。

<details>
<summary>查看原文（11行）</summary>

```text
    if (!result.readers) return failure('RESULT_UNKNOWN', mutates ? 'Worker output readers are unavailable; inspect postconditions.' : 'Read-only worker output readers are unavailable; no files were changed.', 'verify', mutates ? 'unknown' : 'none')
    if (result.interrupted) {
      const code = mutates ? 'RESULT_UNKNOWN' : signal.reason instanceof InvocationDeadlineError ? 'TIMEOUT' : signal.aborted ? 'ABORTED' : 'RESULT_UNKNOWN'
      const message = mutates ? 'Worker interrupted; inspect postconditions.' : code === 'TIMEOUT' ? 'Read-only worker deadline expired; no files were changed.'
        : code === 'ABORTED' ? 'Read-only worker was cancelled; no files were changed.' : 'Read-only worker was interrupted; no files were changed.'
      return failure(code, message, 'execute', mutates ? 'unknown' : 'none')
    }
    if (result.lossy) return failure('OUTPUT_LIMIT', mutates ? 'Worker output exceeded the byte budget; operation facts may have changed.' : 'Read-only worker output exceeded the byte budget; no files were changed.', 'verify', mutates ? 'unknown' : 'none')
    if (result.exitCode !== 0) return failure(mutates ? 'RESULT_UNKNOWN' : 'EXECUTOR_UNAVAILABLE', `Worker did not return a settled result: ${result.stderr.slice(0, 500)}${mutates ? '' : '; no files were changed.'}`, 'execute', mutates ? 'unknown' : 'none')
    if (result.invalid === 'json') return failure('RESULT_UNKNOWN', mutates ? 'Worker returned invalid JSON; inspect postconditions.' : 'Read-only worker returned invalid JSON; no files were changed.', 'verify', mutates ? 'unknown' : 'none')
    if (!result.value) return failure('RESULT_UNKNOWN', mutates ? 'Worker returned a non-object result; inspect postconditions.' : 'Read-only worker returned a non-object result; no files were changed.', 'verify', mutates ? 'unknown' : 'none')
```

</details>

**依据 4 · 源码核查**：[native/crates/ops-files/src/file_single.rs:592-656](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/native/crates/ops-files/src/file_single.rs#L592-L656)

固定修订、目标不存在、权限与锁。

<details>
<summary>查看原文（65行）</summary>

```text
fn transfer_file(request: &Request) -> Result<Value> {
    let args: TransferArgs = serde_json::from_value(request.args.clone())?;
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
    };
    let moved_facts = if request.tool == "move" {
        Some(check_file_revision(
            &source.display,
            &args.expected_revision,
        )?)
    } else {
        None
    };
    let target = crate::file_path::checked_leaf(&args.to, true)?;
    match target.parent.symlink_metadata(&target.name) {
        Ok(_) => {
            return Err(Failure::new(
                "REVISION_CONFLICT",
                "Destination exists; no clobber is permitted",
            ));
        }
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => (),
        Err(error) => return Err(error.into()),
    }
    let mut output;
    if request.tool == "copy" {
        let (facts, warnings) =
            publish_new(&dest, None, Some(&source), Some(&args.expected_revision))?;
```

</details>

**依据 5 · 源码核查**：[native/crates/ops-files/src/file_single.rs:492-526](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/native/crates/ops-files/src/file_single.rs#L492-L526)

元数据约束、准备失败清理和复制修订复核。

<details>
<summary>查看原文（35行）</summary>

```text
        #[cfg(unix)]
        if !warnings.is_empty() {
            return Err(Failure::new(
                "METADATA_UNSUPPORTED",
                "Copy metadata could not be fully restored; nothing published",
            ));
        }
        #[cfg(windows)]
        if let Some(capabilities) = &new_file_volume {
            if capabilities.persistent_acls() {
                dsh_ops_windows_metadata::inherit_new_file_dacl(
                    &checked.parent.try_clone()?.into_std_file(),
                    &file.try_clone()?.into_std(),
                )
                .map_err(|error| Failure::new("METADATA_UNSUPPORTED", error))?;
            } else {
                warnings.extend(capabilities.warnings());
            }
        }
        file.sync_all()?;
        Ok((facts, warnings))
    })();
    let (facts, warnings) = match prepared {
        Ok(prepared) => prepared,
        Err(error) => {
            publication::discard_sibling(&checked.parent, &temporary, file)?;
            return Err(error);
        }
    };
    if let (Some(source), Some(expected)) = (source, expected_source)
        && let Err(error) = check_revision_value(&facts.revision, expected)
            .and_then(|_| check_file_revision(&source.display, expected).map(|_| ()))
    {
        publication::discard_sibling(&checked.parent, &temporary, file)?;
        return Err(error);
```

</details>

**依据 6 · 源码核查**：[native/crates/ops-files/src/file_single.rs:666-702](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/native/crates/ops-files/src/file_single.rs#L666-L702)

跨盘拒绝、目标发布后检查和来源删除失败。

<details>
<summary>查看原文（37行）</summary>

```text
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

#### 缺口

- 未在多文件系统和并发编辑条件下执行
  **影响**：无法验证 ACL、竞争与故障后的实际文件集合
  **进一步探讨**：对同卷、跨卷、目标先存在和并发改源分别核对目标内容、来源存在性与权限

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 新 ops-ptc 预设何时出现，批处理提示改变了什么？

**研究主题**：功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

根模块异步通过 agentPresets 服务注册第五个内置模式，依据可读取的随包定义并绑定注册释放。默认写入由明确调用触发，只有注册就绪才能请求修改，且回读宿主选择结果；卸载释放预设声明，保留既有选择，所以原先主动设成默认的使用者退出时应检查或改回默认。PTC 里先确认 Agent 拥有作用域且服务与策略允许，再检查宿主渲染为单一 run_code 场景。load_sdk 通过选择池将 API 加入 pending 并返回 nextTurn，不能把发现目录作为本轮执行许可。启用批处理指导时，可在已接收的用户批次附上教学上下文，后续只观察非取消、经后置链接受的根 run_code。根据计划、文件绕过和短程序形状，按 Agent 和轮次维护提示；合规后对应类别重新允许提示。响应追加上下文且保留工具值，构建提示失败时仍返回原决定。规则靠文本和字面形态，动态拼装、复杂语义和无检测调用点的程序不能完整识别。其价值是把反馈放到发生分散操作的回合附近，成本是多发上下文，任务改善要比较实测。

#### 证据与依据

**依据 1 · 源码核查**：[src/presets/ops-ptc/register.ts:207-229](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/presets/ops-ptc/register.ts#L207-L229)

默认只按动作写入并回读，卸载不自动改变选择。

<details>
<summary>查看原文（23行）</summary>

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
}

/**
 * Release the registration on teardown.
 *
 * The default preset is left exactly as it is: reverting an operator's selection
 * would be the same surprise the removed forced default used to cause. Only the
```

</details>

**依据 2 · 源码核查**：[src/presets/ops-ptc/register.ts:416-435](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/presets/ops-ptc/register.ts#L416-L435)

注入宿主服务并绑定生命周期。

<details>
<summary>查看原文（20行）</summary>

```text
export function registerOpsPtcPreset(root: Context, options: RegistrationOptions = {}): OpsPtcPreset {
  const live: LiveRegistration = {}
  root.inject(['agentPresets'], ctx => {
    const registry = service<PresetRegistry>(ctx, 'agentPresets')
    if (registry === undefined || typeof registry.register !== 'function') return
    // One registration per injection: the same activation cannot register twice,
    // while a remount injects a fresh child and registers again.
    const activation: object = ctx.fiber ?? ctx
    if (registered.has(activation)) return
    registered.add(activation)
    const slot: Slot = { disposed: false }
    ctx.effect(() => () => {
      slot.disposed = true
      if (live.ctx === ctx) { live.ctx = undefined; live.registry = undefined }
      releaseRegistration(ctx, slot, options)
    }, 'dsh-ops: ops-ptc preset')
    void activate(ctx, registry, slot, options, live).catch(error => {
      warn(options, ctx, `dsh-ops: cannot register the ops-ptc agent preset: ${errorText(error)}; the preset stays unavailable.`)
    })
  })
```

</details>

**依据 3 · 源码核查**：[src/presets/ops-ptc/register.ts:447-460](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/presets/ops-ptc/register.ts#L447-L460)

读定义成功才挂载，异步卸载释放注册。

<details>
<summary>查看原文（14行）</summary>

```text
async function activate(ctx: Context, registry: PresetRegistry, slot: Slot, options: RegistrationOptions, live: LiveRegistration): Promise<void> {
  const definition = await readOpsPtcDefinition(options, ctx)
  if (definition === undefined || slot.disposed) return
  // A failed registration leaves the default preset exactly as it was: this row
  // never points new sessions at a preset it could not register.
  const release = await registry.register(definition)
  if (slot.disposed) {
    await release()
    return
  }
  slot.release = release
  // The operator action reads this: only a registered preset may be made the default.
  live.ctx = ctx
  live.registry = registry
```

</details>

**依据 4 · 源码核查**：[src/publication/ptc.ts:77-96](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/publication/ptc.ts#L77-L96)

驻留与可选 API 的资格及 PTC 展示判据。

<details>
<summary>查看原文（20行）</summary>

```text
    const resident = new Set<ApiName>(gate.resident === false ? [] : [...PTC_RESIDENT_TOOLS, ...config.alwaysLoaded])
    // A loader-less scope can never select the allowed pool: registering it only
    // lets a host that renders registered definitions declare unreachable APIs.
    const selectable: ApiName[] = gate.dynamic === false ? [] : [...config.allowedTools, 'result' as ApiName]
    const pool = new Set<ApiName>([...resident, ...selectable])
    const owns = (agent: Agent): boolean => !stopped && gate.allows(agent) && Boolean(ownership?.owns(agent))
    const permitted = (agent: Agent, api: ApiName | 'load_sdk'): boolean => {
      if (!owns(agent) || !ctx.get('ptcRuntime') || !ctx.get('subprocess')) return false
      const policy = ctx.get('sandboxPolicy')?.resolve({ session: agent.session })
      return policy !== undefined && ['read-only', 'workspace-write', 'danger-full-access'].includes(policy.mode)
        && (api === 'load_sdk' || api === 'result' || !capability(api)?.mutates || policy.mode !== 'read-only')
    }
    const loadable = [...new Set<ApiName>([...config.allowedTools, 'result'])]
    const allowedApis = (agent: Agent): ApiName[] => gate.dynamic === false ? [] : loadable.filter(api => permitted(agent, api))
    const selected = (entry: Entry, api: ApiName | 'load_sdk'): boolean => api === 'load_sdk'
      ? gate.dynamic !== false : resident.has(api) || entry.selected.has(api)
    const isPtc = async (agent: Agent, signal?: AbortSignal): Promise<boolean> => {
      const assembly = await inspectPresentation(prompt, agent, signal)
      return assembly.tools.length === 1 && assembly.tools[0]?.name === 'run_code'
        && assembly.sections.some(section => section.name === 'tools:ptc-only' && Boolean(section.text.trim()))
```

</details>

**依据 5 · 源码核查**：[src/publication/ptc.ts:111-125](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/publication/ptc.ts#L111-L125)

执行前复核有效选择与提交后的加载信号。

<details>
<summary>查看原文（15行）</summary>

```text
    const execute = (entry: Entry, api: ApiName | 'load_sdk'): ToolDefinition['execute'] => async (args, exec) => {
      // The public assembly may finish after its executor sections changed.
      // Refuse that stale verdict rather than dispatching under the old text.
      const revision = presentationRevision
      const current = () => entries.get(entry.agent) === entry && exec.agent === entry.agent && !exec.signal.aborted
        && revision === presentationRevision && permitted(entry.agent, api) && selected(entry, api)
        && (capability(api)?.component === 'file' || tools.executable(publicToolName(api), entry.agent, exec.toolSet) === entry.definitions.get(publicToolName(api)))
      if (!current() || !await isPtc(entry.agent, exec.signal).catch(() => false) || !current()) {
        return failure('POLICY_DENIED', 'This API must be admitted for the calling PTC scope; no action executed.')
      }
      if (api === 'load_sdk') {
        const requested = requestedApis(args, allowedApis(entry.agent))
        if (typeof requested === 'string') return failure('INVALID_ARGUMENT', requested)
        for (const name of requested) entry.pending.add(name)
        return { status: 'completed', tools: requested, nextTurn: true }
```

</details>

**依据 6 · 源码核查**：[src/publication/ptc.ts:178-221](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/publication/ptc.ts#L178-L221)

指导输入、根调用筛选和追加上下文。

<details>
<summary>查看原文（44行）</summary>

```text
        if (gate.batching === true) {
          entry.disposers.push(agent.ctx!.on('agent/pre-step', async (payload, next) => {
            if (payload.agent === agent) shapeLatch.noteTurn(agent, payload.turn)
            return next()
          }))
          // Teach the rules once, before the model's first request: a step-tail
          // message rides the first accepted user batch and enters history.
          // The provider must not latch here. A batch can still be withdrawn before
          // admission (cancellation, rejection), and latching on the return value
          // would then skip the lesson for the whole session without a trace.
          entry.disposers.push(registerStepTailProvider(entry.ctx, agent, {
            id: BATCHING_GUIDANCE_ID,
            revision: BATCHING_GUIDANCE_REVISION,
            provide() {
              if (entry.taught) return undefined
              const text = loadBatchingGuidance()
              return text.length > 0 ? text : undefined
            },
          }))
          // The program-shape trigger observes the ROOT run_code call: only there is
          // the whole program text visible. Nested tools.ops_* calls carry a parent
          // token, and their arguments say nothing about the shape of the step.
          entry.disposers.push(agent.ctx!.on('tools/post-execute', async (exec, result, next) => {
            const decision = await next()
            if (decision.kind !== 'accept') return decision
            if (exec.agent !== agent || exec.name !== 'run_code' || exec.parent !== undefined) return decision
            if (exec.signal.aborted) return decision
            const code = (exec.arguments as { code?: unknown } | undefined)?.code
            const notice = shapeLatch.observe(agent, code)
            if (notice === undefined) return decision
            try {
              const message = await guidanceMessage(notice.turn, notice.text)
              // Observation only: one line, no context, no new dependency.
              if (gate.telemetry === true) {
                const counts = shapeLatch.stats(agent)
                ctx.logger.info('dsh-ops batching: turn=' + notice.turn + ' category=' + notice.category
                  + ' plan=' + counts.plan + ' bypass=' + counts.bypass + ' shape=' + counts.shape + ' total=' + counts.total)
              }
              // Append only: the tool result keeps its own value, content and contexts.
              return { ...decision, additionalContexts: [...(decision.additionalContexts ?? []), message] }
            } catch (error) {
              // A delivery failure is an optimisation loss, never a tool failure.
              ctx.logger.warn('dsh-ops: batching notice delivery failed: ' + String(error))
              return decision
```

</details>

**依据 7 · 源码核查**：[src/ptc/batching-guidance.ts:257-278](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/ptc/batching-guidance.ts#L257-L278)

读取工具调用、首行计划、分支和字面 Shell 形状。

<details>
<summary>查看原文（22行）</summary>

```text
export function analyzeProgram(code: unknown): ProgramShape {
  if (typeof code !== 'string' || code.length === 0) {
    return { hasFirstLinePlan: false, declaredOperations: 0, dispatchSites: 0, hasBatchingStructure: false,
      hasBranching: false, isWaiting: false, bypassesFileTools: false, chars: 0 }
  }
  const readable = readProgram(code)
  // A commented-out call is not a call: dispatch sites are read from comment-free
  // text, which is also what lets a truly dispatch-free program earn no notice.
  const sites = [...readable.code.matchAll(DISPATCH)].filter(match => readable.bare.slice(match.index, match.index + 5) === 'tools')
  const plan = parsePlan(code)
  const shellForFiles = sites.some(match => SHELL_TOOL.test(match[1] ?? match[2] ?? '')
    && literalShellFileWork(readable.code, match.index + match[0].length))
  return {
    hasFirstLinePlan: plan.length > 0,
    declaredOperations: plan.length,
    dispatchSites: sites.length,
    hasBatchingStructure: BATCHED.test(code),
    hasBranching: BRANCHING.test(code),
    isWaiting: WAITING.test(code),
    // Comments and message text are not file work; module specifiers stay readable
    // so a real import of node:fs still bypasses.
    bypassesFileTools: BYPASS.test(readable.bare) || shellForFiles,
```

</details>

**依据 8 · 源码核查**：[src/ptc/batching-guidance.ts:301-311](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/ptc/batching-guidance.ts#L301-L311)

无调用点时不提示，短程序规则的例外。

<details>
<summary>查看原文（11行）</summary>

```text
export function violationsOf(shape: ProgramShape): ProgramViolations {
  // No dispatch site means there is no call shape to correct: a value program or a
  // comment-only program must never earn a plan, bypass or shape notice.
  if (shape.dispatchSites === 0) return { plan: false, bypass: false, shape: false }
  return {
    plan: !shape.hasFirstLinePlan,
    bypass: shape.bypassesFileTools,
    // Waiting on a job and branching are legitimate non-batched shapes, and a long
    // program is not judged from its text alone.
    shape: !shape.hasBatchingStructure && !shape.hasBranching && !shape.isWaiting && shape.chars < THIN_CODE_CHARS,
  }
```

</details>

**依据 9 · 源码核查**：[src/ptc/batching-guidance.ts:385-411](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/ptc/batching-guidance.ts#L385-L411)

按 Agent 与轮次控制提示频率及重新启用。

<details>
<summary>查看原文（27行）</summary>

```text
export function createProgramLatch(): ProgramLatch {
  const states = new WeakMap<Agent, { turn: number; armed: Record<BatchingCategory, boolean>; sent: Record<BatchingCategory, number> }>()
  const fresh = (turn: number) => ({ turn, armed: { plan: true, bypass: true, shape: true }, sent: { plan: 0, bypass: 0, shape: 0 } })
  const stateFor = (agent: Agent) => {
    let state = states.get(agent)
    if (state === undefined) { state = fresh(0); states.set(agent, state) }
    return state
  }
  return {
    noteTurn(agent, turn) {
      const normalised = Number.isSafeInteger(turn) ? turn : 0
      const state = states.get(agent)
      // The host may announce one turn more than once; only a change starts a new turn.
      if (state !== undefined && state.turn === normalised) return
      states.set(agent, fresh(normalised))
    },
    observe(agent, code) {
      const state = stateFor(agent)
      const shape = analyzeProgram(code)
      const violations = violationsOf(shape)
      // A compliant program in a category restores that category's right to speak.
      for (const entry of CATEGORY_PRIORITY) if (!violations[entry]) state.armed[entry] = true
      const category = CATEGORY_PRIORITY.find(entry => violations[entry] && state.armed[entry])
      if (category === undefined) return undefined
      state.armed[category] = false
      state.sent[category] += 1
      return { category, turn: state.turn, text: noticeText(category, shape) }
```

</details>

#### 缺口

- 没有指导开关对相同产物、令牌和轮次的对照
  **影响**：帮助或扰乱模型的程度未知
  **进一步探讨**：固定模型与任务，把提示关闭和启用分别重放，核对合格产物、额外上下文与重复工具调用

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验收一页搜索结果没有漏项？

**研究主题**：功能与机制、缺陷与关键质疑、新假设与验证

#### 完整回答

应区分扫描范围完整、当前显示页是否完整和是否仍有后续结果。只要扫描不完整、仍有页或输出预算截断，返回 complete 就不能作为任务完成；报告另给排除原因、已扫描文件和观察到的匹配数。仅遍历完整、存在下一页且当前页没有局部行时生成稳定游标。exactTotal=false 提早停在行限时，观察值是下界，不能靠当前偏移补成全量。显示行被部分截断时 nextOffset 不跳过这条剩余内容，建议用有界文件读取。这里的贡献是说明为何不全与如何补查，资料仍受扫描路径、排除项和索引来源约束。可以让任务侧把事先列出的必查目录作为验收清单，只在覆盖与结果同时满足时通过。用故意加入的排除文件、不可读目录和长行对比，若仍经常出现回执合规却漏掉必要命中，说明单靠工具回执不足。

#### 证据与依据

**依据 1 · 源码核查**：[src/capabilities/file.ts:51-62](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/capabilities/file.ts#L51-L62)

exactTotal 参数区分下界、总数与游标。

<details>
<summary>查看原文（12行）</summary>

```text
    caseInsensitive: { type: 'boolean', description: 'Ignore case; default false.' },
    lineNumbers: { type: 'boolean', description: 'Include 1-based line numbers; default true.' },
    beforeContext: range(0, 32, 'Lines before each match; default 0.'),
    afterContext: range(0, 32, 'Lines after each match; default 0.'),
    multiline: { type: 'boolean', description: 'Search whole-file text instead of individual lines; default false.' },
    offset: integer,
    limit: range(1, 10000, 'Default 100.'),
    exactTotal: { type: 'boolean', description: 'Default true. False stops at the row limit with lower bounds and no stable cursor; summary and continuation still scan fully.' },
    includeHidden: { type: 'boolean', description: 'Traverse dot-prefixed directories such as .github; default false. The plugin\'s own .dsh-ops sidecars stay excluded either way.' },
    continuation: { ...string, description: 'Opaque cursor from a complete scan. Keep query options unchanged; omit offset or use nextOffset. SEARCH_STALE requires a fresh query.' },
  }, ['pattern']),
  stat: bounded({ path: filePath }, ['path']),
```

</details>

**依据 2 · 源码核查**：[native/crates/ops-search/src/paging.rs:220-255](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/native/crates/ops-search/src/paging.rs#L220-L255)

生成游标的前提、报告分类和总数写入。

<details>
<summary>查看原文（36行）</summary>

```text
        .offset
        .saturating_add(page.items.len())
        .saturating_sub(usize::from(page.partial_item));
    let more = next < item_total;
    let continuation = (complete && more && !page.partial_item && next > page.offset)
        .then(|| cursor.token(&snapshot, next));
    let truncated_by = scan.stopped.unwrap_or(if page.output_cut {
        TruncatedBy::OutputBudget
    } else if more {
        TruncatedBy::RowLimit
    } else {
        TruncatedBy::None
    });
    let report = SearchExecutionReport {
        coverage: if complete {
            SearchCoverage::Complete {
                matched_total: observed,
            }
        } else {
            SearchCoverage::Incomplete
        },
        page_complete: !page.output_cut,
        scanned_files: scan.scanned,
        skipped_files: scan.skipped,
        skip_reasons: scan.reasons,
        matched_observed: observed,
        truncated_by,
        continuation,
    };
    let mut output = json!({"status":"completed","phase":"verify","changed":0,"matched":observed,
        "skipped":page.offset,"failed":scan.failed,"complete":complete && !more && !page.output_cut,
        "truncated":!complete || more || page.output_cut,"items":page.items,"nextOffset":next});
    if complete {
        output["total"] = json!(item_total);
        output["omitted"] = json!(item_total.saturating_sub(next));
    }
```

</details>

**依据 3 · 源码核查**：[native/crates/ops-search/src/paging.rs:256-271](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/native/crates/ops-search/src/paging.rs#L256-L271)

不完整扫描和部分匹配行的进一步动作。

<details>
<summary>查看原文（16行）</summary>

```text
    if !complete {
        output["nextAction"] = json!(if scan.stopped == Some(TruncatedBy::RowLimit) {
            "Stopped at the requested row limit (exactTotal=false). matchedObserved is a lower bound; no stable continuation is available. Start a fresh query with exactTotal=true for totals, resolving any reported scan gaps. If a line is only partly displayed, inspect its file with bounded text/hex ranges."
        } else {
            "Narrow path to a smaller readable subdirectory and start a fresh query. Check skipReasons for exclusions and scan gaps. No stable continuation is available for an incomplete traversal."
        });
        if !scan.gap_examples.is_empty() {
            output["nextAction"] = json!(format!(
                "{} Gap examples: {}",
                output["nextAction"].as_str().unwrap(),
                json!(scan.gap_examples)
            ));
        }
    } else if page.partial_item {
        output["nextAction"] = json!(
            "A matching line is only partially displayed. Inspect that file with bounded text/hex ranges; nextOffset does not skip the undisplayed suffix."
```

</details>

#### 缺口

- 缺少不同索引和文件树下漏报的独立对照
  **影响**：不能将一次工具完成回执当作整库证明
  **进一步探讨**：用已知匹配清单与故意不可读、被排除、长行等样例比较还需人工复核的范围

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装、运行与退出该怎样做成本对照？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、工程质量与复用

#### 完整回答

根包从 src 编译和打包到 lib，声明 Node ^22.19 或 >=24、DSH >=0.2.2-rc.1 且低于 0.2.3。宿主版本事实现在尝试通过唯一 installation 来源的 app-boot 解析，路径越界或解析失败报 unknown。源码与清单无法确认机器上可运行平台原生产物，也无法替代实际宿主版本和服务。作者把安装预演描述为解析 CLI 路径并打印计划，成功后仍需确认实际宿主与 worker。持续运行的成本包括模型调用、结果缓存的磁盘、模式与策略设置，以及操作部分成功时对文件的人工复核。缓存命令可预览，并要求用户声明所有宿主和 Bash 作业已停才执行回收；这个开关不能独立验证没有其他进程。使用小型隔离仓库先比较只读检索与一项可复位写入，检查目标修订、文件权限与输出是否完整。若找不到 worker、回执无法解释或默认预设退出后未恢复，先停止 OPS 并回到官方工具，清理磁盘前另留需要的结果。成本或收益均无量化结论。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:185-198](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/package.json#L185-L198)

打包构建入口。

<details>
<summary>查看原文（14行）</summary>

```text
    "native/src",
    "native/crates",
    "native/windows-metadata",
    "native/darwin-metadata",
    "native/bash-ipc"
  ],
  "scripts": {
    "build": "node scripts/build.mjs",
    "prepack": "node bin/prepack.mjs",
    "pretest": "node scripts/build.mjs",
    "pretest:ptc": "node scripts/build.mjs",
    "typecheck": "tsc -p . --noEmit",
    "build:bash-ipc": "node bin/build-bash-ipc.mjs",
    "build:ptc": "node bin/dsh-ops.mjs build-ptc",
```

</details>

**依据 2 · 源码核查**：[scripts/build.mjs:47-66](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/scripts/build.mjs#L47-L66)

编译和复制发布产物到 lib。

<details>
<summary>查看原文（20行）</summary>

```text
  // tsc silently ignores unimported JavaScript when allowJs is disabled. Refuse it explicitly
  // so a missed source migration cannot produce an apparently successful incomplete package.
  requireTypedSource(source)
  const result = spawnSync(process.execPath, [compiler, '-p', path.join(root, 'tsconfig.json')], {
    cwd: root, stdio: 'inherit', windowsHide: true,
  })
  if (result.error) throw result.error
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1
    console.error('build: TypeScript compilation failed; assets were not copied.')
  } else {
    bundleClient(root)
    const assets = copyAssets(source)
    if (existsSync(path.join(source, 'ptc/contract.ts'))) {
      const { writePtcDeclarations } = await import('./lib/build/ptc-sdk.mjs')
      const sdk = await writePtcDeclarations(root)
      console.log(`build: generated PTC declarations for ${sdk.tools} capabilities (${sdk.bytes} bytes)`)
    }
    console.log(`build: compiled src/ to lib/ and copied ${assets} assets`)
  }
```

</details>

**依据 3 · 源码核查**：[package.json:276-279](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/package.json#L276-L279)

声明 Node 与 DSH 版本。

```text
  "engines": {
    "node": "^22.19 || >=24",
    "dsh": ">=0.2.2-rc.1 <0.2.3-0"
  }
```

**依据 4 · 源码核查**：[src/adapter/dsh/runtime-version.ts:14-33](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/adapter/dsh/runtime-version.ts#L14-L33)

宿主版本绑定安装来源，未知保留。

<details>
<summary>查看原文（20行）</summary>

```text
export async function runtimeVersion(ctx: Context): Promise<RuntimeVersion> {
  try {
    const packages = service<import('@deepseek-ai/dsh-app-boot').PluginPackages>(ctx, 'pluginPackages')
    const entries = packages?.resolution?.entries.filter(entry =>
      entry.scope === 'installation' && entry.name === '@deepseek-ai/dsh-app-boot') ?? []
    // An ambiguous or absent host installation cannot establish which runtime serves this session.
    if (entries.length !== 1 || !path.isAbsolute(entries[0]!.packageDir)) return { runtimeVersion: 'unknown' }
    const require = createRequire(path.join(entries[0]!.packageDir, 'package.json'))
    const file = realpathSync.native(require.resolve('@deepseek-ai/dsh-app-boot'))
    const relative = path.relative(realpathSync.native(entries[0]!.packageDir), file)
    if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) return { runtimeVersion: 'unknown' }
    const boot = await import(pathToFileURL(file).href) as {
      getDshRuntimeVersion?: () => unknown
    }
    const version = boot.getDshRuntimeVersion?.()
    if (typeof version === 'string' && /^\d+\.\d+\.\d+(?:-[\w.-]+)?(?:\+[\w.-]+)?$/u.test(version)) {
      return { runtimeVersion: version, runtimeVersionSource: 'host:app-boot/getDshRuntimeVersion' }
    }
  } catch { /* Optional host authority unavailable: do not infer a version from another source. */ }
  return { runtimeVersion: 'unknown' }
```

</details>

**依据 5 · 源码核查**：[src/cli/cache-reclaim.ts:461-479](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/src/cli/cache-reclaim.ts#L461-L479)

回收与预览的选择和离线确认。

<details>
<summary>查看原文（19行）</summary>

```text
export function commandCache(action: string, {
  yes = false, dryRun = false, allHostsStopped = false, kinds, roots, json = false, home, now,
}: {
  yes?: boolean, dryRun?: boolean, allHostsStopped?: boolean, kinds?: readonly CacheKind[], roots?: string[], json?: boolean, home?: string, now?: number
} = {}): number {
  if (action !== 'status' && action !== 'reclaim') throw new Error('Expected cache status or cache reclaim.')
  for (const kind of kinds ?? []) {
    if (!CACHE_KINDS.includes(kind)) throw new Error('--kind must be one of ' + CACHE_KINDS.join(', ') + ', got ' + JSON.stringify(kind))
  }
  const apply = action === 'reclaim' && yes && !dryRun
  if (apply && !allHostsStopped) {
    console.error('dsh-ops: stop every OPS host and Bash job, then confirm with --yes --all-hosts-stopped. No cache was changed.')
    return 2
  }
  if (action === 'status' && yes) throw new Error('--yes applies to cache reclaim only.')
  const options = { ...(home === undefined ? {} : { home }), ...(now === undefined ? {} : { now }), roots: roots ?? [] }
  const report: CacheInventory | CacheReclaimResult = apply
    ? cacheReclaim({ ...options, apply: true, allHostsStopped, ...(kinds === undefined ? {} : { kinds }) })
    : cacheInventory(options)
```

</details>

**依据 6 · 作者声明**：[README.md:56-71](https://github.com/T-Auto/dsh-ops/blob/58f6e2817618fae52476e8c7f1920aaeb4421c7a/README.md#L56-L71)

作者说明命令和预演范围。

<details>
<summary>查看原文（16行）</summary>

````text
### npm 一键安装

#### 安装方法

```console
npx --yes dsh-ops@latest install --profile desktop
npx --yes dsh-ops@latest install --profile web
npx --yes dsh-ops@latest install --profile tui
```

必须显式选择目标 profile；`tui` 映射到 **dsh-TUI 产品的 `dsh-tui` profile**，不是旧的 `tui` 目录。请先初始化目标应用。该入口委托官方 DSH CLI 安装，不另写一套 profile 锁与回滚逻辑。

桌面端必须使用桌面应用自带的 CLI；默认探测 `%LOCALAPPDATA%\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd`。安装在其它位置时加 `--dsh-cli "<安装目录>\resources\runtime\cli\bin\dsh.cmd"`。Web/TUI 需要可用的 DSH CLI，可同样显式指定。

安装或卸载时可加 `--dry-run` 预演。它按指定路径或 `PATH`（Windows 同时使用 `PATHEXT`）解析 CLI，检查文件、POSIX 执行权限及通过 Node 启动的入口文件，并在预演时同样拒绝不安全的 Windows 命令脚本路径；检查失败返回非零。预演只打印计划，不启动 CLI、不修改 profile。成功表示这些静态检查已通过，不保证所选程序的身份、版本、profile 兼容性或后续安装结果。

````

</details>

#### 缺口

- 没有真实环境的制品合法性、同任务成本及退出观察
  **影响**：可提出对照方法，持续采用证据不足
  **进一步探讨**：用相同锁定样例比较合格产物、磁盘、调用轮次和人工修复，再验证停用后只保留预期数据

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
