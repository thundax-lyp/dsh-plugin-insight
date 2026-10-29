# Embedded Workbench

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f4ebc1b](https://github.com/AmethystLuna/embedded-workbench/tree/f4ebc1bca8ed3fcbc44b0fc45bdae89adf0851b0)

<!-- BEGIN META -->
[![GitHub ★ 25](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=25&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AmethystLuna/embedded-workbench) [![npm 30d 3,501](https://img.shields.io/static/v1?label=npm+30d&message=3%2C501&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-embedded-workbench) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-embedded-workbench)
<!-- END META -->

> **功能**：分发嵌入式 C/C++ 开发与逐声称核查 Skills，并在 DSH 首步注入可关闭的计划核查提醒。

> **亮点**：按需材料、小首步提醒、持久历史去重与旧宿主volatile降级减少接线分散，领域方法组合有实用增量，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

> **主要限制**：Gate无代码级计划校验，静态fact-check不能证明状态机/并发行为；作者优先级文案和兼容矩阵不等权限或实测，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 领域方法为谁解决什么问题，属于新诊断能力吗？](#detail-section-11)
  - [Q02 · 首步Gate是否实际拒绝未核查的计划，开关及历史如何？](#detail-section-12)
  - [Q03 · 静态fact-check足以验复杂行为吗，如何采用与证伪改进？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：固件开发者处理异常、RTOS/ISR与构建现场时可按需调用领域方法，目标是实际修复而非核查段存在，见 [Q01](#research-q01)。

项目笔记/手工提示和直接编译调试；插件整理方法并提醒取证，硬件与编译能力不归插件新实现。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 领域Skills | 固件诊断/构建方法 | 需真实现场与工具链 |
| fact-check | 静态声称取证 | 非状态空间/硬件验证 |
| 首步提醒 | 计划核查与上下文提示 | 不拒未验证计划，历史不撤 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH/skills/llm/session | 启动必需 | 目录与消息协议 | 广范围声明须实际核 |
| Node>=20/包内文件 | 必需 | 插件与材料加载 | 不提供硬件工具链 |
| 芯片/编译器/现场产物 | 效果必需 | 诊断和验修复 | 缺信息保持未知 |
| 外部行为验证器 | 复杂行为可选升级 | 状态/协议验证 | fact-check只静态，手工降级 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选匹配Skill/规则 | 对齐芯片和现场 |
| 处理 | 模型按方法逐声称取证 | 提醒不代替证明 |
| 验收 | 人编译/测试/硬件验证 | 真实结果支持修复 |
| 恢复 | 回滚分支并纠误诊 | 新会话核禁用效果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 文件/运行时金额未知 | 工作流、芯片与工具链对齐 | 学习时间未知 |
| 持续使用 | 提醒/模型上下文未知 | 逐声称与硬件复核 | 净节时未知 |
| 失败恢复 | 重测资源未知 | 纠误诊、回滚及再验证 | 无事务恢复 |
| 退出 | 配置管理未知 | 关闭并新会话核查 | 既有消息不撤 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 方法获取 | 包内代表领域流程 | 真实诊断率 |
| 提醒 | 开关/去重/投递 | 模型遵守和误放行 |
| 工作负担 | 风险比例方法 | 净节时及过度流程成本 |

> **思考**：Gate无代码级计划校验，静态fact-check不能证明状态机/并发行为；作者优先级文案和兼容矩阵不等权限或实测，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：按需材料、小首步提醒、持久历史去重与旧宿主volatile降级减少接线分散，领域方法组合有实用增量，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

[Q02](#research-q02) 持久来源去重和可选服务降级值得复用；投递与验证的边界必须保留，不能把文字Gate包装成执行器。

<a id="detail-section-5"></a>

### 1.4 主要限制

Gate无代码级计划校验，静态fact-check不能证明状态机/并发行为；作者优先级文案和兼容矩阵不等权限或实测，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先手动选匹配Skill，在可回滚固件分支核实际编译/测试，再决定提醒开关；只有核查格式而无证据时停用结论，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定入口、投递/去重和代表Skill已核，试用匹配领域方法；未运行目标/编译/硬件。假设不计现有能力。

- 已检查：作者 README、包清单、源码路径 package.json、skills/embedded-workbench/SKILL.md、skills/fact-check/SKILL.md、skills/hardfault-triage/SKILL.md、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整inventory复用；旧五题/11 findings及自code依赖复核，当前读入口、provider/消息/去重、fact-check、HardFault及风险工作流代表段，未全审其他Skills/平台。
- 下一步：新计划样本比较提醒/fact-check/版本绑定，核误放行及编译/硬件实际结果。普通宿主/硬件实验本轮未执行，非通过。

**分析版本**

- **仓库**：[AmethystLuna/embedded-workbench](https://github.com/AmethystLuna/embedded-workbench)
- **版本号**：0.9.6（[固定提交 f4ebc1b](https://github.com/AmethystLuna/embedded-workbench/tree/f4ebc1bca8ed3fcbc44b0fc45bdae89adf0851b0)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把逐声称证据绑定代码/计划版本并区分行为未验，对照误放行与负担；未实现、无效则停止，见 [Q03](#research-q03)。

新计划样本比较提醒/fact-check/版本绑定，核误放行及编译/硬件实际结果。普通宿主/硬件实验本轮未执行，非通过。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 41 | 4784 | — | — | 37807 |
| .js | source | 3 | 784 | 494 | 247 | — |
| .mjs | source | 2 | 213 | 168 | 28 | — |
| .ts | source | 1 | 300 | 146 | 131 | — |
| .mjs | test | 5 | 868 | 658 | 123 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/embedded-workbench/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/embedded-workbench/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/embedded-workbench/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：领域Skills与首步提醒提供什么增量，何时不能替代可执行验证和硬件验收？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 领域方法为谁解决什么问题，属于新诊断能力吗？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

dsh-embedded-workbench 0.9.6是DSH原生插件，随包分发嵌入式开发Skills并可注入首步提醒，不只是一个独立Skill文件。目标是处理C/C++固件、RTOS/ISR、Keil构建和处理器异常的开发者，合格输出要与当前芯片、编译器、固件及现场寄存器对应。相较反复组织提示和项目笔记，其贡献是按需领域流程与风险比例工作流；不是新的硬件诊断算法或自动实验平台。

HardFault代表方法要求先捕获寄存器/栈，再分类、用map或addr2line定位及找根因；这些依赖手册、实际构建产物与硬件现场，日志缺失不能靠规则补成事实。包声明Node>=20和广范围DSH兼容，源码复用宿主filesystem Skill provider只加载自身skills目录。作者兼容矩阵和token缩减描述不是本轮运行证据，技能可发现也不代表目标工具链具备或修复正确。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-29](https://github.com/AmethystLuna/embedded-workbench/blob/f4ebc1bca8ed3fcbc44b0fc45bdae89adf0851b0/package.json#L2-L29)

包/版本/Node和Skill资源。

<details>
<summary>查看原文（28行）</summary>

```text
    "name": "dsh-embedded-workbench",
    "version": "0.9.6",
    "description": "Embedded C/C++ firmware development toolbox — FreeRTOS, ISR, NVM storage, Keil MDK, ARMCLANG, HardFault, state machines, architecture, LVGL patterns, and claim fact-checking. Ships a native DeepSeek Harness (dsh) bundle that folds a short gate — the Plan Verification Gate plus a context-budget rule — into the first model step.",
    "type": "module",
    "main": "lib/index.js",
    "types": "lib/types/index.d.ts",
    "exports": {
        ".": {
            "types": "./lib/types/index.d.ts",
            "default": "./lib/index.js"
        },
        "./cordis.patch.yml": "./cordis.patch.yml",
        "./client": "./lib/client.js",
        "./package.json": "./package.json",
        "./locale/*.json": "./locale/*.json"
    },
    "files": [
        "lib",
        "src",
        "skills",
        "cordis.patch.yml",
        "locale"
    ],
    "engines": {
        "node": ">=20"
    },
    "dsh": {
        "engines": {
```

</details>

**依据 2 · 源码核查**：[src/index.ts:238-250](https://github.com/AmethystLuna/embedded-workbench/blob/f4ebc1bca8ed3fcbc44b0fc45bdae89adf0851b0/src/index.ts#L238-L250)

独立包内目录provider。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 3 · 作者声明**：[skills/hardfault-triage/SKILL.md:14-53](https://github.com/AmethystLuna/embedded-workbench/blob/f4ebc1bca8ed3fcbc44b0fc45bdae89adf0851b0/skills/hardfault-triage/SKILL.md#L14-L53)

代表现场捕获到根因流程。

<details>
<summary>查看原文（40行）</summary>

```text
## Triage Methodology

Every processor exception triage follows the same four-step flow:

### Step 1 — Capture

Read the architecture's fault-status and fault-address registers **before any other code runs**. The first instructions after exception entry are the only guaranteed-clean snapshot.

- Cortex-M: CFSR, HFSR, MMFAR, BFAR at SCB base `0xE000ED00`
- Cortex-A: DFSR, DFAR, IFSR, IFAR (data/prefetch abort)
- RISC-V: mcause, mtval, mepc
- Xtensa (ESP32): EXCCAUSE, EXCVADDR, EPC1

### Step 2 — Classify

Match the fault-status bit pattern against known signatures. The tables in the architecture-specific sections below cover the most frequent Cortex-M patterns. For other architectures:

- Look up the exception cause code in the architecture reference manual
- Determine the fault class: memory access, instruction fetch, undefined opcode, alignment, privilege violation, bus error

### Step 3 — Locate

Extract the program counter (PC) at the moment of the fault and resolve it to source:

- **.map file Global Symbols**: search for the function whose address range contains the PC
- **addr2line**: `arm-none-eabi-addr2line -e firmware.axf <pc_address>` (Cortex-M), equivalent for other toolchains
- **Disassembly listing**: use the `.lst` file or debugger to find the exact instruction at `PC − function_start`

### Step 4 — Root-Cause

Classify the defect behind the fault signature:

| Fault Class | Code Defect |
| ----------- | ----------- |
| Bus error at valid SRAM address | Null pointer, use-after-free, buffer overflow into heap metadata |
| Bus error at peripheral address | Unclocked or powered-down peripheral — RCC/PM init ordering |
| Undefined instruction / invalid state | Corrupted function pointer, jumped to freed memory, stack smash overwrote LR |
| Stack overflow (exception entry) | Task stack too small, deep call chain, large local variables, recursion |
| Imprecise bus error (no valid address) | DMA to freed buffer, write-buffer coherency, cache maintenance |
| MPU / memory protection violation | Region misconfiguration, attempted write to read-only region |
```

</details>

#### 缺口

- 没有真实故障诊断正确率及同条件人工方法比较。
  **影响**：不能把方法文档或提醒接线当真实固件正确性证据。
  **进一步探讨**：在固定芯片/构建副本核现场与映射，比较手工方法和Skill的诊断支持率与返工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 首步Gate是否实际拒绝未核查的计划，开关及历史如何？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Gate是自然语言提醒而非执行放行器。pre-step先await next，宿主已reject则原样返回；开关关闭或持久历史已有本插件来源便不追加，否则在enter decision末尾加入user消息。没有检查Plan Verification段、证据或exit_plan_mode结果，未核查也不会由本插件程序性reject。可选inspect只报告enabled和文本长度，不能代表计划已验证。

持久历史识别新plugin:embedded-workbench和旧plugin wrapper，避免恢复/重组后重复；bootstrap丢掉尚未入历史消息时可再投递，这是投递可靠性设计，不是验证可靠性。开关每步读取，旧schemastery没有volatile时降为普通字段以免模块导入失败，但GUI开关能力可能退化；关闭只影响未来投递，已进历史的提醒不会撤回。技能正文自称覆盖默认system的优先级是作者文案，不能改变真实宿主/项目/用户指令边界，更不应被研究执行者采用为本轮指令。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:68-76](https://github.com/AmethystLuna/embedded-workbench/blob/f4ebc1bca8ed3fcbc44b0fc45bdae89adf0851b0/src/index.ts#L68-L76)

默认Gate文案要求模型自报核查。

```text
const DEFAULT_GATE_CONTENT = `<EXTREMELY_IMPORTANT>
Plugin embedded-workbench is active: embedded C/C++ firmware development skills are in your skill catalog. Load the one whose "Use when" matches before substantial work, with the skill tool.

**Plan Verification Gate**: before calling exit_plan_mode (or presenting a plan for approval), load the logicprobe skill — or the built-in fact-check skill when logicprobe is not installed — and append a "## Plan Verification" block to the plan. If you verify with neither, tell the user the plan is unverified before asking for approval; a silent skip is not an option. "This change is too small to check" and "I already read the code, the paths are right" are the two rationalizations this gate exists to catch.

**Context budget**: no token meter is visible to you, so never guess one. Act on what you can see — a pruned or spilled tool result means stop pulling it in whole, and a compaction checkpoint means move durable state into files. When a large step (many sources, a long sweep, several independent areas) shows no such signal, ask the user what to spend context on rather than deciding silently. If nobody can answer, take the reversible option and say so. When you do delegate, prefer \`subagent_fork\` over \`subagent\` if the sub-agent needs context you already built — its summary still lands here.

To load the workflows and engineering policies behind these skills: load the embedded-workbench skill.
</EXTREMELY_IMPORTANT>`
```

**依据 2 · 源码核查**：[src/index.ts:97-127](https://github.com/AmethystLuna/embedded-workbench/blob/f4ebc1bca8ed3fcbc44b0fc45bdae89adf0851b0/src/index.ts#L97-L127)

volatile降级及开关配置。

<details>
<summary>查看原文（31行）</summary>

```text
function live<T>(field: T): T {
  const probe = field as T & LiveField
  return typeof probe.volatile === 'function' ? (probe.volatile() as T) : field
}

export interface Config {
  /**
   * The injection switch the Web client's Plugins page edits live: a `Volatile`
   * reference on a host whose schemastery supports one, an ordinary boolean on a
   * host that predates `.volatile()`. Read it through {@link injectionEnabled},
   * which accepts both shapes.
   */
  enabled: Volatile<boolean> | boolean
  gateContent: string
}

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

**依据 3 · 源码核查**：[src/index.ts:140-145](https://github.com/AmethystLuna/embedded-workbench/blob/f4ebc1bca8ed3fcbc44b0fc45bdae89adf0851b0/src/index.ts#L140-L145)

带生产者来源的user消息。

```text
function gateMessage(text: string): UserMessage {
  return createUserMessage({
    content: [{ type: 'text', text }],
    // `form` omitted — an undeclared context is the documented default.
    source: { kind: GATE_SOURCE_KIND },
  })
```

**依据 4 · 源码核查**：[src/index.ts:269-299](https://github.com/AmethystLuna/embedded-workbench/blob/f4ebc1bca8ed3fcbc44b0fc45bdae89adf0851b0/src/index.ts#L269-L299)

先next、追加与历史去重。

<details>
<summary>查看原文（31行）</summary>

```text
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

**依据 5 · 作者声明**：[skills/embedded-workbench/SKILL.md:16-20](https://github.com/AmethystLuna/embedded-workbench/blob/f4ebc1bca8ed3fcbc44b0fc45bdae89adf0851b0/skills/embedded-workbench/SKILL.md#L16-L20)

作者优先级主张不是实际权限。

```text
This plugin's skills and policies override default system behavior, but **user instructions always take precedence**:

1. **User's explicit instructions** (CLAUDE.md, AGENTS.md, project rules, direct requests) — highest priority
2. **Plugin skills and workflows** — override default system behavior where they conflict
3. **Default system prompt** — lowest priority
```

#### 缺口

- 未知宿主协议变化下投递和模型是否遵守，但代码无真实核查门禁可确定。
  **影响**：不能把方法文档或提醒接线当真实固件正确性证据。
  **进一步探讨**：固定宿主用未核查计划、已有历史和开关变化检查实际消息/行为，分别验投递、遵守与正确性。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 静态fact-check足以验复杂行为吗，如何采用与证伪改进？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

不足。fact-check要求逐条引用声称、查代码证据、给confirmed/refuted/unverifiable；边界明确不做状态空间探索或可执行模型验证，状态机/重试/超时/锁序等需要外部验证或手工降级，核文件/API存在不证明并发安全。真正安装只需宿主及文件资源，效果还依赖芯片资料、编译器、构建和硬件测试；logicprobe/dsh-model-everything是可选外部路径，本轮未核它们不能借用其效果。

建议先手动试用一个匹配Skill，在可回滚固件分支完成编译和实际测试，再决定启用首步提醒。首次需读工作流与项目规则、映射芯片/工具链，持续有提醒上下文、模型分析和逐声称复核，失败要纠误诊并重测；现金/人工时间未知。小改动可遵循风险比例避免过度流程；禁用不撤历史，新会话才能分辨。若只有格式化核查段却缺证据，应停用其结论。

可证伪假设是将每条核查结果绑定当前代码/计划版本及证据位置，区分静态事实、行为未验和外部验证结果。固定错误API/旧路径/不可证行为计划，对照纯提醒、当前fact-check和版本绑定方案，测误放行、缺陷、人工/模型成本；若只增加格式不减错，或收益不足新增负担，停止。现有方法不因此升级为机器门禁，真实需求仍未知。

#### 证据与依据

**依据 1 · 作者声明**：[skills/fact-check/SKILL.md:20-58](https://github.com/AmethystLuna/embedded-workbench/blob/f4ebc1bca8ed3fcbc44b0fc45bdae89adf0851b0/skills/fact-check/SKILL.md#L20-L58)

逐声称流程及无模型验证边界。

<details>
<summary>查看原文（39行）</summary>

````text
## What to verify (per claim)

| Claim type | Method |
|-----------|--------|
| Numeric claims (counts, sizes, frequencies) | `grep -c` / `grep -rn` |
| API/type/enum names | Extract actual signatures/values from headers |
| File paths and line numbers | Confirm existence and content |
| Mechanism feasibility | Check language standard / compiler support |

## Process

1. Enumerate every verifiable claim (quote it verbatim).
2. Verify each against the codebase with evidence (file:line + excerpt).
3. Output per claim: claim → evidence → verdict.

## Output format

- **Claim**: <verbatim quote>
- **Evidence**: <file:line + grep/read excerpt>
- **Verdict**: confirmed | refuted | unverifiable
- **Correction direction** (when refuted) — never fix inline.

Append a `## Plan Verification` block:

```markdown
## Plan Verification
- **Mode**: fact-check (fallback — logicprobe plugin not installed)
- **Claims checked**: [N] confirmed, [M] refuted, [K] unverifiable
- **Escalation**: model verification NOT run (requires logicprobe plugin)
```

## Boundaries

- **No executable model verification** — no state-space exploration, no harness.
- State machines (≥3 states), ACK/NACK/retry/timeout logic, lock/unlock
  ordering, and "always"/"never"/"guaranteed" claims require the `logicprobe`
  plugin: install it (see `.dsh/INSTALL.md`) or tell the user verification is
  degraded to manual mode for those claims.
- Checking a claim is not a security audit; being checked ≠ being safe.
````

</details>

**依据 2 · 作者声明**：[skills/embedded-workbench/SKILL.md:55-59](https://github.com/AmethystLuna/embedded-workbench/blob/f4ebc1bca8ed3fcbc44b0fc45bdae89adf0851b0/skills/embedded-workbench/SKILL.md#L55-L59)

按风险选最轻流程。

```text

## Proportionality

Match the process to the risk in front of you, not to habit. Start on the lightest path that covers the risk, and escalate only when you actually cross a boundary.

```

**依据 3 · 源码核查**：[src/index.ts:269-278](https://github.com/AmethystLuna/embedded-workbench/blob/f4ebc1bca8ed3fcbc44b0fc45bdae89adf0851b0/src/index.ts#L269-L278)

提醒无程序校验，形成假设依据。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

#### 缺口

- 没有误放行率、真实诊断/编译收益或版本绑定实验。
  **影响**：不能把方法文档或提醒接线当真实固件正确性证据。
  **进一步探讨**：用新的受控固件计划和真实编译/硬件证据比较，记录错误和复核成本，不把模型自报已核当通过。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
