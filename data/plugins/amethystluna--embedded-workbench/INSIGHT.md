# embedded-workbench

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[1bb1bcf](https://github.com/AmethystLuna/embedded-workbench/tree/1bb1bcfc45ca6efab327967a252d4d9203a323a7)

<!-- BEGIN META -->
[![GitHub ★ 21](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21&color=yellow&logo=github&style=flat)](https://github.com/AmethystLuna/embedded-workbench) [![npm 30d 2,906](https://img.shields.io/static/v1?label=npm+30d&message=2%2C906&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench)
<!-- END META -->

> **实现功能**：为嵌入式固件开发提供八份 Skill，并在 DSH 会话首个模型步骤注入短验证提示。

> **核心亮点**：把嵌入式经验指南作为跨平台 Skill 打包，并给 DSH 单独实现注册与门禁。详见[Q01](#research-q01)。

> **风险与缺陷**：门禁是提示而非强制计划验收；作者兼容测试主要检安装/注入，不等于固件建议可靠。详见[Q02](#research-q02)和[Q03](#research-q03)。

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
  - [Q01 · DSH 原生 bundle 与跨平台仓库里的代理有什么不同？](#detail-section-11)
  - [Q02 · 门禁注入如何保证一次，关闭开关会影响技能吗？](#detail-section-12)
  - [Q03 · 兼容性证据支持到什么程度？](#detail-section-13)
  - [Q04 · 首步提示及 Skill 规则会带来什么成本与误用？](#detail-section-14)
  - [Q05 · 如何试用才区分安装成功与工程质量提升？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：固件设计、调试和构建工作中按任务加载领域 Skill；DSH 原生 bundle 也向每个 agent 会话注入短门禁。详见[Q01](#research-q01)。

普通 DSH 会话依赖模型通用知识或用户手动提供固件规范；插件提供领域 Skill 目录和首步提示。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| Skill | 领域指导 | 非自动专家验证 |
| 门禁 | 首步计划核查提示 | 非强制拦截 |
| 开关 | 实时关闭提示 | 依宿主版本 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH skills 服务 | 必需 | 文件系统注册 | Skill 不可发现 |
| DSH agent/pre-step | 门禁必需 | 注入/去重 | 无首步提示 |
| 目标构建/硬件工具 | 实际固件任务必需 | 验证建议 | 仅文本建议 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 安装 | 隔离 profile 挂载 | 八 Skill 可见 |
| 门禁 | 检首步/恢复轮 | 只注入一次，可关闭 |
| 试用 | 专家固件样例 | 实际编译/审阅 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | npm/DSH安装磁盘；采购/订阅金额未知 | 配profile、核8Skill与首步门禁/版本，工时未知 | 失败需移除bundle/修依赖重启，耗时未知 |
| 持续使用 | 每Agent首步门禁token与按需Skill/构建资源 | 编译/硬件/专家核固件建议，工时未知 | 作者约400token为报告；多Agent开销/误触发未知 |
| 失败恢复 | 重跑模型/构建、日志/profile恢复资源，金额未知 | 核门禁/Skill发现与专业回归，关开关或重启，工时未知 | 开关只影响门禁，作者mock兼容不等真实任务质量/恢复率 |

#### 效果

| 效果项 | 固定源码/作者材料 | 未证实 |
| --- | --- | --- |
| Skill 目录 | 八份文件/注册 | 真实任务触发率 |
| 门禁 | 一次性注入与作者模拟测试 | 计划质量提升 |
| 固件指导 | 领域文档 | 专家级正确率 |

> **思考**：门禁是提示而非强制计划验收；作者兼容测试主要检安装/注入，不等于固件建议可靠。详见[Q02](#research-q02)和[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把嵌入式经验指南作为跨平台 Skill 打包，并给 DSH 单独实现注册与门禁。详见[Q01](#research-q01)。

把嵌入式经验指南作为跨平台 Skill 打包，并给 DSH 单独实现注册与门禁。详见[Q01](#research-q01)。

较清楚分离 Skill 注册与门禁注入，对旧宿主 volatile 接口有回退；但输出质量仍取决于模型遵循提示与技能内容。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

门禁是提示而非强制计划验收；作者兼容测试主要检安装/注入，不等于固件建议可靠。详见[Q02](#research-q02)和[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先验证安装与注入，再以专家任务检行为；保留关闭门禁开关并单独考察 Skill 效果。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可确认八份 Skill 注册和一次性注入路径；作者有隔离环境兼容测试记录，本轮未重跑，模型专业建议质量未知。

- 已检查：作者 README、包清单、源码路径 README.md、DSH-COMPATIBILITY.md、src/index.ts、package.json、skills/embedded-workbench/SKILL.md、skills/fact-check/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、DSH-COMPATIBILITY.md、src/index.ts、skills/ 与 package.json；未运行目标 DSH 或固件工具。旧 META 复用。
- 下一步：隔离 profile 测八 Skill 发现、首次/恢复步骤去重、开关切换，再以专家标注 HardFault/ISR/Keil 样例对照质量及成本。

**分析版本**

- **仓库**：[AmethystLuna/embedded-workbench](https://github.com/AmethystLuna/embedded-workbench)
- **版本号**：0.9.4（[固定提交 1bb1bcf](https://github.com/AmethystLuna/embedded-workbench/tree/1bb1bcfc45ca6efab327967a252d4d9203a323a7)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

为代表性固件问题建立专家标注与失败回归集，将 Skill 触发、建议质量和门禁成本同时测量。详见[Q05](#research-q05)。

隔离 profile 测八 Skill 发现、首次/恢复步骤去重、开关切换，再以专家标注 HardFault/ISR/Keil 样例对照质量及成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 41 | 4641 | — | — | 36437 |
| .js | source | 3 | 784 | 494 | 247 | — |
| .mjs | source | 2 | 213 | 168 | 28 | — |
| .ts | source | 1 | 300 | 146 | 131 | — |
| .mjs | test | 5 | 868 | 658 | 123 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AmethystLuna/embedded-workbench/issues?q=is%3Aissue+created%3A2026-09-21T08%3A01%3A47.868Z..2026-10-21T08%3A01%3A47.868Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AmethystLuna/embedded-workbench/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A01%3A47.868Z..2026-10-21T08%3A01%3A47.868Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-21。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：嵌入式 Skill 与首步提示在 DSH 中有哪些实际行为、证据与工程边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 原生 bundle 与跨平台仓库里的代理有什么不同？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者仓库提供 8 个嵌入式 Skill、4 个其他平台的代理定义；DSH bundle 的实际功能是通过 filesystem provider 注册 8 份 Skill，在 agent 首个模型步骤注入短门禁，并可选向 cordis_inspect 注册目录条目。README 明言 4 个代理不移植到 DSH。不能把仓库里的 agent 文件当作 DSH agent preset。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-47](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/README.md#L13-L47)

跨平台组件及八份 Skill

<details>
<summary>查看原文（35行）</summary>

```text
嵌入式 C/C++ 固件开发工具箱：覆盖 FreeRTOS、中断、NVM 存储、Keil MDK（AC5/AC6）、ARMCLANG、HardFault 分析、状态机、架构原则与 LVGL 陷阱。

**跨平台**：支持 Claude Code、Codex CLI、Cursor、Kimi CLI、OpenCode、ZCode、DeepSeek Harness (dsh)。基于 [Agent Skills](https://agentskills.io) 开放标准构建。

## 组件

### 代理 (4)

| 代理 | 说明 |
| ------ | ------ |
| `architecture-steward` | 只读规划：设计包、模块边界、切片拆分 |
| `design-reviewer` | 设计文档事实核查：逐条核验声称与代码库事实 |
| `execution-worker` | 计划 → 审批 → 实施循环，含编译验证 |
| `quality-coordinator` | 实现审查：Bug 发现、合规检查、结束完整性 |

### 技能 (8)

| 技能 | 说明 |
| ------ | ------ |
| `embedded-workbench` | 引导技能：工作流、策略、子代理映射、主动建议、跨平台工具映射、文档模板 |
| `debug-methodology` | 8 条调试铁律、修复准则、迭代调试案例研究 |
| `embedded-firmware-dev` | FreeRTOS、中断、NVM 存储、异步生命周期、边界分析、架构原则、LVGL 陷阱 |
| `keil-mdk-build` | UV4 CLI、ARM Compiler 5/6、.map 分析、合并打包、构建诊断 |
| `c-cpp-dev` | C/C++ 代码生成、风格、内存布局、重构 |
| `state-machine-design` | 状态模型、重试、超时、转换门控、实现模式 |
| `hardfault-triage` | 处理器异常分类：故障寄存器、栈帧、PC 定位源码、根因分类 |
| `fact-check` | 声称核查回退：逐条对照代码库核实 API 名、文件路径、枚举值、数量与机制可行性。logicprobe 未安装时由 Plan Verification Gate 使用 |

`logicprobe`（文档与计划声称核查技能）**已拆分为独立插件**，见下方[其他插件推荐](#其他插件推荐)。未安装时，Plan Verification Gate 回退到本插件自带的 `fact-check` 技能。只有行为与模型类声称会降级为人工确认。

> 技能内容大多来自作者个人嵌入式与固件开发的工作经验，按实际工程踩坑与约束沉淀，而非泛泛的模型生成内容。

### 深度参考

`embedded-firmware-dev`、`debug-methodology`、`state-machine-design`、`c-cpp-dev` 包含深度参考或代码示例。内容包括 12 条架构原则、嵌入式模式（GIF 定时器安全、状态锁存、异步生命周期）、LVGL 陷阱、7 轮迭代调试案例研究、状态机实现模式，以及嵌入式 C 专项（volatile MMIO、链接器段、ISR 安全路径）。
```

</details>

**依据 2 · 作者声明**：[README.md:87-96](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/README.md#L87-L96)

DSH bundle 三功能与代理不移植

<details>
<summary>查看原文（10行）</summary>

```text
## DeepSeek Harness (dsh)

原生 dsh 支持以 cordis 插件 bundle 的形式提供，位于**仓库根**，由根 `package.json` 声明。

这个 bundle 做三件事：

1. **注册技能。** 技能遵循 Agent Skills 开放标准，由 dsh 的 `skill-filesystem` provider 原样发现，不需要额外代码。
2. **注入门禁。** 每个 agent 会话的第一个模型步骤会收到一段**精简后**的首步门禁，内容是 Plan Verification Gate 加上下文预算规则。它由 `enabled` 控制，默认开启。这是 Claude `SessionStart` hook 在 dsh 上的对应物。载荷里为什么不再有 1% Rule 和 Red Flags，见[设计取舍与反馈](#设计取舍与反馈)。
3. **注册目录条目。** 模型可见的目录条目（`cordis_inspect`）始终注册。4 个自定义 agent 有意不移植，因为 dsh 原生的 subagent 工具已经覆盖并行多 agent 工作。

```

</details>

**依据 3 · 源码核查**：[src/index.ts:219-279](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/src/index.ts#L219-L279)

实际注册与注入入口

<details>
<summary>查看原文（61行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  // Catalog visibility is optional: register only when the inspect registry
  // service is mounted, so headless assemblies without it keep the gate
  // injection working. The registry may be provided AFTER this row applies
  // (base-bundle rows can mount later), so registration is retried on the
  // first agent/session-start — by then the app is fully booted.
  let providerRegistered = false
  const registerProvider = (): void => {
    if (providerRegistered) return
    const inspect = ctx.get('cordisInspect')
    if (inspect === undefined) return
    try {
      ctx.effect(() => inspect.register(inspectProvider(config)), 'embedded-workbench: inspect provider')
      providerRegistered = true
    } catch (err) {
      console.warn('[embedded-workbench] inspect provider registration failed', err)
    }
  }
  registerProvider()
  // Ship the bundled skills through the registry: reuse the standard
  // filesystem provider over this package's own `skills/` directory, so
  // catalog discovery, frontmatter parsing, and SKILL.md loading behave
  // exactly like project/user skills while the plugin stays self-contained.
  // Registration lands in the global registry layer (this row mounts at the
  // profile root), so every agent preset sees the skills. `registerProvider`
  // returns the effect disposer; its teardown unregisters and invalidates.
  ctx.skills.registerProvider((control) => {
    return new FileSystemSkillProvider(ctx, control, {
      providerName: 'embedded-workbench',
      includeDefaultRoots: false,
      customSkillDirs: [SKILLS_DIR],
    })
  })
  // Injection listens unconditionally, including while the switch is off: the
  // switch is volatile, so `apply` runs once and the value behind it can turn on
  // later from the Web Plugins page. Returning early on a false value here would
  // freeze that decision for the lifetime of the mount, and turning the switch
  // back on could never take effect without a profile restart.
  //
  // Inject the gate once per session on the FIRST model step that runs,
  // instead of at session-start: session-start injection lands in the agent's
  // inbox, which a blank-session preset switch (agentPreset.select ->
  // recompose) can clear before the first step - the gate would then be lost
  // for the whole session. The pre-step decision is the durable path a
  // first-step injection takes: the gate is appended to the first step's
  // decision and enters session history there, so every later step (and a
  // resume) skips it. Anchored/bootstrap presets that strip first-step
  // injected reminders (skill catalog, AGENTS.md, gate plugins) simply defer
  // this message to the first step after their promotion - the history guard
  // re-injects it there, so the gate still lands exactly once per session.
  ctx.on('agent/pre-step', async ({ agent }, next) => {
    const decision = await next()
    if (decision.kind === 'reject') return decision
    registerProvider()
    if (!injectionEnabled(config)) return decision
    if (gateInHistory(agent.session)) return decision
    return {
      kind: 'enter',
      messages: [...decision.messages, gateMessage(config.gateContent)],
    }
  })
```

</details>

#### 缺口

- DSH 目标会话中 Skill 触发行为未独立观察
  **影响**：注册不等于模型正确使用
  **进一步探讨**：目标版本检查目录并运行代表性嵌入式任务

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 门禁注入如何保证一次，关闭开关会影响技能吗？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Config.enabled 默认 true；支持 volatile 的宿主可在 Web 中实时改，旧宿主回落普通布尔配置。插件仍注册 Skill provider，然后在 agent/pre-step 的 next() 非 reject 时、且开关开启且持久会话事件无此来源时，追加 user/message；若首步未提交，后续 pre-step 继续补发。它在历史中出现后停止注入。因此关闭只影响门禁文本，不影响 Skill；“验证计划”由自然语言提示驱动，源码没有禁止未验证计划提交的强制拦截。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:113-145](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/src/index.ts#L113-L145)

开关/消息类型

<details>
<summary>查看原文（33行）</summary>

```text
export const Config = z.object({
  // Live so the Web Plugins page can flip the gate injection inside a running
  // session: dsh's settings service projects ONLY fields under a `.volatile()`
  // node and rejects writes to every other path. The price is that the injection
  // reads the reference per step instead of deciding once at mount, which is also
  // what lets a toggle take effect without remounting the row.
  //
  // On by default, but deliberately small: the payload carries the verification
  // gate and the context-budget rule only, so leaving it on costs a few hundred
  // tokens once per session rather than the ~900 of the previous payload.
  enabled: live(z.boolean().default(true)),
  // Not volatile, deliberately: the settings projection feeds a GUI form, and a
  // multi-kilobyte text field does not belong in one. Override it in the
  // profile's `cordis.patch.yml` row instead.
  gateContent: z.string().default(DEFAULT_GATE_CONTENT),
})

/**
 * Read the injection switch as a boolean, whichever shape this host produced.
 * @param config - the resolved plugin configuration.
 * @returns whether the gate may be injected.
 */
function injectionEnabled(config: Config): boolean {
  const value = config.enabled
  return typeof value === 'boolean' ? value : value.get()
}

function gateMessage(text: string): UserMessage {
  return createUserMessage({
    content: [{ type: 'text', text }],
    // `form` omitted — an undeclared context is the documented default.
    source: { kind: GATE_SOURCE_KIND },
  })
```

</details>

**依据 2 · 源码核查**：[src/index.ts:238-279](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/src/index.ts#L238-L279)

Skill 注册与 pre-step 注入

<details>
<summary>查看原文（42行）</summary>

```text
  // Ship the bundled skills through the registry: reuse the standard
  // filesystem provider over this package's own `skills/` directory, so
  // catalog discovery, frontmatter parsing, and SKILL.md loading behave
  // exactly like project/user skills while the plugin stays self-contained.
  // Registration lands in the global registry layer (this row mounts at the
  // profile root), so every agent preset sees the skills. `registerProvider`
  // returns the effect disposer; its teardown unregisters and invalidates.
  ctx.skills.registerProvider((control) => {
    return new FileSystemSkillProvider(ctx, control, {
      providerName: 'embedded-workbench',
      includeDefaultRoots: false,
      customSkillDirs: [SKILLS_DIR],
    })
  })
  // Injection listens unconditionally, including while the switch is off: the
  // switch is volatile, so `apply` runs once and the value behind it can turn on
  // later from the Web Plugins page. Returning early on a false value here would
  // freeze that decision for the lifetime of the mount, and turning the switch
  // back on could never take effect without a profile restart.
  //
  // Inject the gate once per session on the FIRST model step that runs,
  // instead of at session-start: session-start injection lands in the agent's
  // inbox, which a blank-session preset switch (agentPreset.select ->
  // recompose) can clear before the first step - the gate would then be lost
  // for the whole session. The pre-step decision is the durable path a
  // first-step injection takes: the gate is appended to the first step's
  // decision and enters session history there, so every later step (and a
  // resume) skips it. Anchored/bootstrap presets that strip first-step
  // injected reminders (skill catalog, AGENTS.md, gate plugins) simply defer
  // this message to the first step after their promotion - the history guard
  // re-injects it there, so the gate still lands exactly once per session.
  ctx.on('agent/pre-step', async ({ agent }, next) => {
    const decision = await next()
    if (decision.kind === 'reject') return decision
    registerProvider()
    if (!injectionEnabled(config)) return decision
    if (gateInHistory(agent.session)) return decision
    return {
      kind: 'enter',
      messages: [...decision.messages, gateMessage(config.gateContent)],
    }
  })
```

</details>

**依据 3 · 源码核查**：[src/index.ts:282-299](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/src/index.ts#L282-L299)

历史去重来源检测

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Whether the gate already entered this session's durable history. The
 * pre-step listener re-appends the gate until it does; once a step committed
 * it, every later step (and a resume of a session that kept it) skips the
 * injection. A session whose gate was dropped before any step ran (e.g. an
 * inbox cleared by a blank-session preset switch) simply re-injects on the
 * first step that runs.
 */
function gateInHistory(session: Session): boolean {
  return readSessionEvents(session).some((event) => {
    if (event.type !== 'user/message') return false
    const source = event.data?.source as { kind?: string; plugin?: string } | undefined
    if (source === undefined) return false
    // The v4 producer-owned kind, plus the pre-v4 wrapper this bundle wrote
    // before DSH 0.1.7-alpha.1 retired it.
    return source.kind === GATE_SOURCE_KIND
      || (source.kind === 'plugin' && source.plugin === GATE_PLUGIN_ID)
  })
```

</details>

**依据 4 · 作者声明**：[README.md:223-230](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/README.md#L223-L230)

作者配置说明

```text
在 DeepSeek Harness 中，bundle 支持以下配置：

| 键 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `enabled` | boolean | `true` | 设为 `false` 可完全关闭首步 Gate 注入；技能注册不受影响。 |
| `gateContent` | string | 内置 gate 文本 | 覆盖注入到首轮模型上下文中的文本。 |

在 dsh Web GUI 里可以直接改这个开关：侧边栏 **插件** → 本插件卡片 → 「Gate 注入」。它实时生效，不必重启 profile。它只管注入的那段文本：关掉后技能照常注册。同一张卡片上还有一个更粗粒度的行开关，关掉它会整行卸载插件，技能和这个开关一起消失。要持久化覆盖，仍按下面的 profile patch 写。
```

#### 缺口

- 模型是否服从门禁与用户指令交互未测
  **影响**：提示存在不等于实际核查
  **进一步探讨**：构造有缺陷计划观察模型是否读取 fact-check/标注未核查

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 兼容性证据支持到什么程度？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

作者提供 Windows 11、Node 24 下不同 DSH 版本的独立 profile 安装/挂载/卸载记录；较新的 0.2.1-rc.1/rc.2 轮用模拟 SSE 端点核首步和恢复轮请求/持久日志中的门禁。该记录是作者报告，方法比单纯 README 声明更可审阅，但本轮未重跑。模拟端点固定答复，不能证明真实模型选择 Skill、计划核查质量或固件构建成功。Web 实时开关要求支持 volatile 投影的较新 DSH。

#### 证据与依据

**依据 1 · 作者声明**：[DSH-COMPATIBILITY.md:8-50](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/DSH-COMPATIBILITY.md#L8-L50)

作者环境与模拟端点方法

<details>
<summary>查看原文（43行）</summary>

```text
## Environment

| Item | Value |
|---|---|
| Host | Windows 11 (x64), build 19045 |
| Node.js | v24.17.0 |
| npm | 11.13.0 |
| pnpm | 11.21.0 |
| Test date | 2026-09-25 (headless rounds) · 2026-09-29 (live-field round) · 2026-10-05 (headless round for 0.2.1-alpha.1) · 2026-10-09 (headless round for 0.9.2 on 0.2.1-alpha.2) · 2026-10-18 (headless gate round for 0.9.3 on 0.2.1-rc.1 and 0.2.1-rc.2) |
| Package under test | `dsh-embedded-workbench` 0.9.4 (bundle patch `cordis.patch.yml`, entry id `embedded-workbench`) |

## Method (one disposable profile per version)

Each DSH release was run from its own runtime (global CLI for
0.1.0-rc.7 … 0.1.2-alpha.3; temporary npm install under an isolated prefix for
0.1.2-alpha.4 through 0.2.0-rc.2) against a fresh `DSH_HOME`, so no state
leaked between versions. 0.1.3-alpha.1 predates its npm publish, so it ran from
a local pnpm workspace build of git tag `dsh-v0.1.3-alpha.1`; every later row was
installed from its published npm release. The `fs-ext` native dependency
introduced in 0.1.3 (cross-process session write lease) is a POSIX `flock` shim
that the Windows lease path never calls — it takes a kernel semaphore instead —
so the two 0.1.3 rows ran with `fs-ext` substituted by a no-op stub on this
MSVC-less host (`npm install --ignore-scripts`). 0.1.5-alpha.1 replaced `fs-ext`
with the lazily loaded prebuilt `@deepseek-ai/node-addon-system/flock`, so that
row installed exactly as published.

The 2026-10-09 round (`0.9.2`) installed the published `0.2.1-alpha.2` into a temporary npm
prefix under one task scratch root, gave it a fresh `DSH_HOME` under that same root, and
added both this package and its sibling `dsh-logicprobe` 1.0.0 to one disposable `headless`
profile. `DSH_HOME` is set explicitly for every command and never inherited: this host's own
`DSH_HOME` points at the real user home, which the round must not touch. Both packages were
removed from the profile afterwards and the row was confirmed gone.

The 2026-10-18 round (`0.9.3`) repeated that isolated shape for `0.2.1-rc.2` and `0.2.1-rc.1`:
one `npm install --prefix <scratch>/<version> @deepseek-ai/dsh@<version>` tree per release, one
fresh `DSH_HOME` per release under the same scratch root, and the plugin added from this
checkout with `file:`. It also measured the gate, which the 2026-10-09 round could not: a local
HTTP endpoint speaking the Messages SSE protocol stood in for the provider, because the round ran
without a real provider key. One run opened a session and ran its first model step. A second run
adopted that session with `--session-id` and ran the next turn. The persisted v4 log was
decompressed with `zstd` and read as events, and the mock endpoint logged every request body, so
the gate was counted in both the durable history and the bytes the model received. The reply text
is fixed; the round measures the injection path, not model behaviour.
```

</details>

**依据 2 · 作者声明**：[DSH-COMPATIBILITY.md:52-71](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/DSH-COMPATIBILITY.md#L52-L71)

安装/启动/卸载边界

<details>
<summary>查看原文（20行）</summary>

````text
```bash
# 1) install: fresh profile, plugin added as a file: dependency
dsh plugin --profile headless add "file:<this-repo>"      # pnpm add succeeds

# 2) mount check: composed tree contains the plugin row, enabled
dsh --profile headless --dump-config                       # id: embedded-workbench / enabled: true

# 3) start: headless boot with a deliberately invalid API key.
#    Expected: tree mounts and the app reaches the model-provider stage,
#    failing only with AUTH for the fake key; no plugin load errors.
DEEPSEEK_API_KEY=fake-key-for-boot-test dsh --profile headless "reply OK"

# 4) uninstall: plugin removed, row gone from the composed tree
dsh plugin --profile headless remove dsh-embedded-workbench
dsh --profile headless --dump-config                       # no embedded-workbench row
```

The headless `AUTH` rejection proves the profile booted with the plugin applied
(any bundle apply error would surface before the provider call). End-to-end
model calls were not exercised (no real provider key used).
````

</details>

**依据 3 · 作者声明**：[README.md:216-230](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/README.md#L216-L230)

兼容/实时开关说明

<details>
<summary>查看原文（15行）</summary>

```text
- 宿主：Claude Code v2.1+ / Codex CLI 最新版 / Cursor 2.5+ / Kimi CLI 最新版 / OpenCode 最新版 / ZCode 3.0+
- DeepSeek Harness (dsh)：dev preview，声明支持 `>= 0.1.0-rc.7`。最新一轮在 0.2.1-rc.2 与 0.2.1-rc.1 上实测了安装、挂载、启动、门禁注入与卸载；更早一轮实测覆盖 0.1.5-rc.2 到 0.2.0-rc.2。逐版本证据见 [DSH-COMPATIBILITY.md](DSH-COMPATIBILITY.md)。
- Web 端的「Gate 注入」开关需要 **dsh ≥ 0.1.7-alpha.1**，因为设置服务必须能投影即时字段。更早的 dsh 上插件与技能照常加载、照常注入，只是开关不出现，也不报错。
- 无外部依赖。

## 配置

在 DeepSeek Harness 中，bundle 支持以下配置：

| 键 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `enabled` | boolean | `true` | 设为 `false` 可完全关闭首步 Gate 注入；技能注册不受影响。 |
| `gateContent` | string | 内置 gate 文本 | 覆盖注入到首轮模型上下文中的文本。 |

在 dsh Web GUI 里可以直接改这个开关：侧边栏 **插件** → 本插件卡片 → 「Gate 注入」。它实时生效，不必重启 profile。它只管注入的那段文本：关掉后技能照常注册。同一张卡片上还有一个更粗粒度的行开关，关掉它会整行卸载插件，技能和这个开关一起消失。要持久化覆盖，仍按下面的 profile patch 写。
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首步提示及 Skill 规则会带来什么成本与误用？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

默认注入 Plan Verification Gate 和上下文预算规则，作者报告缩短至约 400 token，称 dsh 侧注入量降 58%；该数值没有本轮独立测量。gateContent 可用 profile patch 覆盖而非 Web 实时文本字段；默认内容要求核查计划、不能核查须告知用户，也建议长任务在无上下文指标时询问用户。门禁作为 user/message 提示，可能与目标任务、已有更高优先级规则冲突；每个 agent 会话都注入一次，需衡量重复 token 与行为副作用。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | npm/DSH安装磁盘；采购/订阅金额未知 | 配profile、核8Skill与首步门禁/版本，工时未知 | 失败需移除bundle/修依赖重启，耗时未知 |
| 持续使用 | 每Agent首步门禁token与按需Skill/构建资源 | 编译/硬件/专家核固件建议，工时未知 | 作者约400token为报告；多Agent开销/误触发未知 |
| 失败恢复 | 重跑模型/构建、日志/profile恢复资源，金额未知 | 核门禁/Skill发现与专业回归，关开关或重启，工时未知 | 开关只影响门禁，作者mock兼容不等真实任务质量/恢复率 |

成本以一次正确、可复核的嵌入式任务为单位，包含真实构建/专家核查与失败恢复，而不是能发现Skill或门禁出现在wire。各项金额/工时未知，不将作者注入缩短比例推成总模型费下降。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:61-75](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/src/index.ts#L61-L75)

默认提示正文

<details>
<summary>查看原文（15行）</summary>

```text
const SKILLS_DIR = fileURLToPath(new URL('../skills', import.meta.url))

const GATE_PLUGIN_ID = 'embedded-workbench'

/** Producer-owned message source kind declared in `MessageSourceMap` above. */
const GATE_SOURCE_KIND: 'plugin:embedded-workbench' = 'plugin:embedded-workbench'

const DEFAULT_GATE_CONTENT = `<EXTREMELY_IMPORTANT>
Plugin embedded-workbench is active: embedded C/C++ firmware development skills are in your skill catalog. Load the one whose "Use when" matches before substantial work, with the skill tool.

**Plan Verification Gate**: before calling exit_plan_mode (or presenting a plan for approval), load the logicprobe skill — or the built-in fact-check skill when logicprobe is not installed — and append a "## Plan Verification" block to the plan. If you verify with neither, tell the user the plan is unverified before asking for approval; a silent skip is not an option. "This change is too small to check" and "I already read the code, the paths are right" are the two rationalizations this gate exists to catch.

**Context budget**: no token meter is visible to you, so never guess one. Act on what you can see — a pruned or spilled tool result means stop pulling it in whole, and a compaction checkpoint means move durable state into files. When a large step (many sources, a long sweep, several independent areas) shows no such signal, ask the user what to spend context on rather than deciding silently. If nobody can answer, take the reversible option and say so. When you do delegate, prefer \`subagent_fork\` over \`subagent\` if the sub-agent needs context you already built — its summary still lands here.

To load the workflows and engineering policies behind these skills: load the embedded-workbench skill.
```

</details>

**依据 2 · 源码核查**：[src/index.ts:113-127](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/src/index.ts#L113-L127)

开关与自定义文本

<details>
<summary>查看原文（15行）</summary>

```text
export const Config = z.object({
  // Live so the Web Plugins page can flip the gate injection inside a running
  // session: dsh's settings service projects ONLY fields under a `.volatile()`
  // node and rejects writes to every other path. The price is that the injection
  // reads the reference per step instead of deciding once at mount, which is also
  // what lets a toggle take effect without remounting the row.
  //
  // On by default, but deliberately small: the payload carries the verification
  // gate and the context-budget rule only, so leaving it on costs a few hundred
  // tokens once per session rather than the ~900 of the previous payload.
  enabled: live(z.boolean().default(true)),
  // Not volatile, deliberately: the settings projection feeds a GUI form, and a
  // multi-kilobyte text field does not belong in one. Override it in the
  // profile's `cordis.patch.yml` row instead.
  gateContent: z.string().default(DEFAULT_GATE_CONTENT),
```

</details>

**依据 3 · 作者声明**：[README.md:125-136](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/README.md#L125-L136)

作者缩短及取舍报告

<details>
<summary>查看原文（12行）</summary>

```text
这一版做了一次**基于证据的回退**。理由写在下面，欢迎质疑。

**背景**：我们逐个核对了 8 个受支持 harness 的官方文档，Codex 还对照了源码。这次核对推翻了一个此前想当然的前提：**8 家里有 7 家根本不向模型暴露任何上下文预算读数**。这 7 家是 Claude Code、Copilot CLI、Cursor、OpenCode、Kimi CLI、ZCode 和 dsh，它们只把 token 数给用户界面。只有 Codex 提供一个 `get_context_remaining` 工具，而且默认关闭。也就是说，"让模型按预算自行判断要不要委派或切窗口"这件事本身没有依据。

**因此分两步处理**：

1. **不再用"关掉注入"控制成本，改为"瘦身"。** 首步门禁现在只保留两块。第一块是 **Plan Verification Gate**：未核查就必须告诉用户，不许静默跳过。第二块是**上下文预算规则**：看不到读数就不要猜；工作量大且无信号时问用户。载荷从约 1,400 token 降到约 400 token，实测 Claude 侧降 72%，dsh 侧降 58%。它现在默认开启。
2. **验证门禁保留，强制执行脚手架退场。** 原来的 1% Rule 与 9 行 Red Flags 表从**注入载荷**中移除。它们属于"强制纪律"，而社区实证显示这类提示会被能力较强的模型字面执行，产生僵硬阶段、多余提问，以及五行任务拉起六七个 agent 的 10–15× 开销。相关反馈见 [obra/superpowers#1120](https://github.com/obra/superpowers/issues/1120)、[openai/codex#22005](https://github.com/openai/codex/issues/22005)、[#20366](https://github.com/openai/codex/issues/20366)。完整表格仍保留在 `Skill("embedded-workbench")` 正文里：需要纪律时纪律还在，只是不再对所有人默认施压。工作流选择也从固定 agent 串场改为**按风险比例**。

**有意保留的**：Plan Verification Gate 的语义没有削弱。它的回退链是 logicprobe → 未安装则用内置 `fact-check` → 两者都没用就必须告知用户。按 [Superpowers Lite](https://github.com/BB-84C/superpowers-lite) 的原则，安全、权限与**验证**门禁属于应当保留的一类，按比例裁掉的应该是流程仪式。

**已知的不确定**：各 harness 的预算接口变动很快，我们只在 2026-09-25 核对过一次。[`platform-tool-mapping.md`](skills/embedded-workbench/references/platform-tool-mapping.md) 里凡厂商未公开的格子都明确标为 `UNVERIFIED`，没有靠类比填空。
```

</details>

#### 缺口

- 目标任务 token 与多代理累计开销未测
  **影响**：成本或过度提问可能超过收益
  **进一步探讨**：测单/多 agent 注入量及计划任务遵从率

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何试用才区分安装成功与工程质量提升？

**研究主题**：采用判断、新假设与验证

#### 完整回答

在隔离 DSH profile 安装，检查 8 份 Skill 可发现、门禁只在首个实际模型步骤进入历史且恢复轮不重复，再分别切换 enabled 验技能仍可用。用 HardFault、ISR/FreeRTOS、Keil 构建三个有专家答案的样例对照无插件基线，记录真实模型是否引用恰当 Skill、是否完成可执行验证、错误率与 token/时间。作者兼容性报告中的模拟回复只覆盖注入路径，专业建议质量仍待独立评估。 创新假设的推导是：固定源码只负责 Skill 注册与自然语言门禁，作者的模拟端点也只证明消息到达；因此真正待证的增量不是“能装上”，而是领域 Skill 加门禁能减少固件建议错误且不因过度核查拖慢小任务。条件是模型实际发现并读取匹配 Skill，专家参考答案可判分，目标工具链可编译/复现。对照同一任务和同一模型的无插件、仅 Skill、Skill 加门禁三组；记录触发率、错误率、验证完成率、token、时长和不必要追问。若三组正确率无改善或成本/追问显著恶化，则该增量假设被推翻；若只改善计划披露而不改善固件建议，应限缩到计划透明度价值。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:238-299](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/src/index.ts#L238-L299)

注册/去重机制

<details>
<summary>查看原文（62行）</summary>

```text
  // Ship the bundled skills through the registry: reuse the standard
  // filesystem provider over this package's own `skills/` directory, so
  // catalog discovery, frontmatter parsing, and SKILL.md loading behave
  // exactly like project/user skills while the plugin stays self-contained.
  // Registration lands in the global registry layer (this row mounts at the
  // profile root), so every agent preset sees the skills. `registerProvider`
  // returns the effect disposer; its teardown unregisters and invalidates.
  ctx.skills.registerProvider((control) => {
    return new FileSystemSkillProvider(ctx, control, {
      providerName: 'embedded-workbench',
      includeDefaultRoots: false,
      customSkillDirs: [SKILLS_DIR],
    })
  })
  // Injection listens unconditionally, including while the switch is off: the
  // switch is volatile, so `apply` runs once and the value behind it can turn on
  // later from the Web Plugins page. Returning early on a false value here would
  // freeze that decision for the lifetime of the mount, and turning the switch
  // back on could never take effect without a profile restart.
  //
  // Inject the gate once per session on the FIRST model step that runs,
  // instead of at session-start: session-start injection lands in the agent's
  // inbox, which a blank-session preset switch (agentPreset.select ->
  // recompose) can clear before the first step - the gate would then be lost
  // for the whole session. The pre-step decision is the durable path a
  // first-step injection takes: the gate is appended to the first step's
  // decision and enters session history there, so every later step (and a
  // resume) skips it. Anchored/bootstrap presets that strip first-step
  // injected reminders (skill catalog, AGENTS.md, gate plugins) simply defer
  // this message to the first step after their promotion - the history guard
  // re-injects it there, so the gate still lands exactly once per session.
  ctx.on('agent/pre-step', async ({ agent }, next) => {
    const decision = await next()
    if (decision.kind === 'reject') return decision
    registerProvider()
    if (!injectionEnabled(config)) return decision
    if (gateInHistory(agent.session)) return decision
    return {
      kind: 'enter',
      messages: [...decision.messages, gateMessage(config.gateContent)],
    }
  })
}

/**
 * Whether the gate already entered this session's durable history. The
 * pre-step listener re-appends the gate until it does; once a step committed
 * it, every later step (and a resume of a session that kept it) skips the
 * injection. A session whose gate was dropped before any step ran (e.g. an
 * inbox cleared by a blank-session preset switch) simply re-injects on the
 * first step that runs.
 */
function gateInHistory(session: Session): boolean {
  return readSessionEvents(session).some((event) => {
    if (event.type !== 'user/message') return false
    const source = event.data?.source as { kind?: string; plugin?: string } | undefined
    if (source === undefined) return false
    // The v4 producer-owned kind, plus the pre-v4 wrapper this bundle wrote
    // before DSH 0.1.7-alpha.1 retired it.
    return source.kind === GATE_SOURCE_KIND
      || (source.kind === 'plugin' && source.plugin === GATE_PLUGIN_ID)
  })
```

</details>

**依据 2 · 作者声明**：[DSH-COMPATIBILITY.md:41-71](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/DSH-COMPATIBILITY.md#L41-L71)

作者模拟端点验证边界

<details>
<summary>查看原文（31行）</summary>

````text
The 2026-10-18 round (`0.9.3`) repeated that isolated shape for `0.2.1-rc.2` and `0.2.1-rc.1`:
one `npm install --prefix <scratch>/<version> @deepseek-ai/dsh@<version>` tree per release, one
fresh `DSH_HOME` per release under the same scratch root, and the plugin added from this
checkout with `file:`. It also measured the gate, which the 2026-10-09 round could not: a local
HTTP endpoint speaking the Messages SSE protocol stood in for the provider, because the round ran
without a real provider key. One run opened a session and ran its first model step. A second run
adopted that session with `--session-id` and ran the next turn. The persisted v4 log was
decompressed with `zstd` and read as events, and the mock endpoint logged every request body, so
the gate was counted in both the durable history and the bytes the model received. The reply text
is fixed; the round measures the injection path, not model behaviour.

```bash
# 1) install: fresh profile, plugin added as a file: dependency
dsh plugin --profile headless add "file:<this-repo>"      # pnpm add succeeds

# 2) mount check: composed tree contains the plugin row, enabled
dsh --profile headless --dump-config                       # id: embedded-workbench / enabled: true

# 3) start: headless boot with a deliberately invalid API key.
#    Expected: tree mounts and the app reaches the model-provider stage,
#    failing only with AUTH for the fake key; no plugin load errors.
DEEPSEEK_API_KEY=fake-key-for-boot-test dsh --profile headless "reply OK"

# 4) uninstall: plugin removed, row gone from the composed tree
dsh plugin --profile headless remove dsh-embedded-workbench
dsh --profile headless --dump-config                       # no embedded-workbench row
```

The headless `AUTH` rejection proves the profile booted with the plugin applied
(any bundle apply error would surface before the provider call). End-to-end
model calls were not exercised (no real provider key used).
````

</details>

**依据 3 · 作者声明**：[README.md:28-47](https://github.com/AmethystLuna/embedded-workbench/blob/1bb1bcfc45ca6efab327967a252d4d9203a323a7/README.md#L28-L47)

领域覆盖

<details>
<summary>查看原文（20行）</summary>

```text
### 技能 (8)

| 技能 | 说明 |
| ------ | ------ |
| `embedded-workbench` | 引导技能：工作流、策略、子代理映射、主动建议、跨平台工具映射、文档模板 |
| `debug-methodology` | 8 条调试铁律、修复准则、迭代调试案例研究 |
| `embedded-firmware-dev` | FreeRTOS、中断、NVM 存储、异步生命周期、边界分析、架构原则、LVGL 陷阱 |
| `keil-mdk-build` | UV4 CLI、ARM Compiler 5/6、.map 分析、合并打包、构建诊断 |
| `c-cpp-dev` | C/C++ 代码生成、风格、内存布局、重构 |
| `state-machine-design` | 状态模型、重试、超时、转换门控、实现模式 |
| `hardfault-triage` | 处理器异常分类：故障寄存器、栈帧、PC 定位源码、根因分类 |
| `fact-check` | 声称核查回退：逐条对照代码库核实 API 名、文件路径、枚举值、数量与机制可行性。logicprobe 未安装时由 Plan Verification Gate 使用 |

`logicprobe`（文档与计划声称核查技能）**已拆分为独立插件**，见下方[其他插件推荐](#其他插件推荐)。未安装时，Plan Verification Gate 回退到本插件自带的 `fact-check` 技能。只有行为与模型类声称会降级为人工确认。

> 技能内容大多来自作者个人嵌入式与固件开发的工作经验，按实际工程踩坑与约束沉淀，而非泛泛的模型生成内容。

### 深度参考

`embedded-firmware-dev`、`debug-methodology`、`state-machine-design`、`c-cpp-dev` 包含深度参考或代码示例。内容包括 12 条架构原则、嵌入式模式（GIF 定时器安全、状态锁存、异步生命周期）、LVGL 陷阱、7 轮迭代调试案例研究、状态机实现模式，以及嵌入式 C 专项（volatile MMIO、链接器段、ISR 安全路径）。
```

</details>

#### 缺口

- 专家标注任务的效果与多平台表现未知
  **影响**：安装通过无法证明固件建议可靠
  **进一步探讨**：建立专家审阅和故障注入小样本

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
