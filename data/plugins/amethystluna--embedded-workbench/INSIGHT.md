# dsh-embedded-workbench

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[f32698d](https://github.com/AmethystLuna/embedded-workbench/tree/f32698d8e61bd50295ac66721838bf6aacec1859)

<!-- BEGIN META -->
[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AmethystLuna/embedded-workbench) [![npm 30d 2,737](https://img.shields.io/static/v1?label=npm+30d&message=2%2C737&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-embedded-workbench) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-embedded-workbench)
<!-- END META -->

> **实现功能**：提供嵌入式C/C++领域技能，并向DSH会话首步注入计划核查与上下文预算提醒。

> **核心亮点**：将固件领域经验、逐声称核查与风险比例工作流组合成按需技能，减少重复组织方法的潜在劳动；并非新硬件诊断算法。见 [Q01](#research-q01)。

> **风险与缺陷**：Gate是自然语言提醒而非代码执行放行；静态fact-check不验证复杂行为，插件文案的优先级宣称也不等授权。见 [Q03](#research-q03)。

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
  - [Q01 · 嵌入式技能包相对通用助手提供什么？](#detail-section-11)
  - [Q02 · 技能注册与首步门禁怎样实现？](#detail-section-12)
  - [Q03 · 名为Gate是否会真正阻止未验证实施？](#detail-section-13)
  - [Q04 · 首次和持续使用有哪些工具链与上下文负担？](#detail-section-14)
  - [Q05 · 哪些模式可复用，怎样决定采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向有具体固件现场与工具链的开发者，合格结果须通过目标环境验证。适用任务及简单替代见 [Q01](#research-q01)。

通用助手加人工提示/工程笔记；方法整理不当作原创调试原理，未复现作者token/效果报告。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 固件领域Skill | 提供调试/构建/并发方法 | 需目标手册与工具链核实 |
| fact-check | 核API/路径/数值等声称 | 不做可执行模型验证 |
| 首步提醒 | 提醒计划核查与预算边界 | 自然语言而非硬闸门 |
| inspect状态 | 读取提醒开关与长度 | 不证明核查执行完成 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20与兼容DSH skills/llm/session | 必需 | 载入和投递 | 不保证注册 |
| 芯片手册、符号/构建产物 | 对应诊断必需 | 核对现场 | 不能由方法文档补事实 |
| 编译器、测试/硬件 | 固件验收必需 | 确认修复 | 无法宣称运行正确 |
| 外部逻辑验证Skill | 复杂行为验证可选 | 超出fact-check能力 | 明确降级为人工/未验证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户核项目规则并安装正确npm包 | 重启后Skill可发现 |
| 2 | 按任务选领域Skill并提供现场 | 不缺关键版本/产物 |
| 3 | 逐声称核查并实施可回滚改动 | 证据与当前代码对应 |
| 4 | 在目标工具链验收 | 无运行依据则明确未验证 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主和本地技能文件 | 对齐项目规则、芯片与工具链 | 配置/学习时间未知 |
| 持续使用 | 提醒/技能上下文、模型调用 | 逐声称核对、编译和硬件检查 | 真实总调用与节时未知 |
| 失败恢复 | 重测与回退分支 | 修正误诊、核对未验证声明 | 提示不提供事务回滚 |
| 退出 | 新会话与配置管理 | 关闭注入并核历史影响 | 已有消息不会自动撤回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 方法获取 | 领域流程与静态核查清单 | 真实诊断正确率 |
| 提醒投递 | 开关/历史来源去重 | 模型遵守与误放行率 |
| 流程控制 | 风险分级文字 | 净节时与过度流程负担 |

> **思考**：Gate是自然语言提醒而非代码执行放行；静态fact-check不验证复杂行为，插件文案的优先级宣称也不等授权。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将固件领域经验、逐声称核查与风险比例工作流组合成按需技能，减少重复组织方法的潜在劳动；并非新硬件诊断算法。见 [Q01](#research-q01)。

将固件领域经验、逐声称核查与风险比例工作流组合成按需技能，减少重复组织方法的潜在劳动；并非新硬件诊断算法。见 [Q01](#research-q01)。

按需材料、精简提醒和持久历史去重可复用；宿主消息协议变化与技能规则冲突是主要维护面。见 [Q02](#research-q02) 与 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

Gate是自然语言提醒而非代码执行放行；静态fact-check不验证复杂行为，插件文案的优先级宣称也不等授权。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议匹配任务时先手动试用领域Skill，再决定开启提醒；可回滚分支与实际编译/测试是验收基础，停止标准见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

技能内容和提醒投递有源码支持；不是硬验证闸门，调试效果和流程收益未测；版本绑定核查是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、skills/embedded-workbench/SKILL.md、skills/hardfault-triage/SKILL.md、skills/fact-check/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定DSH入口、首步消息/历史去重、引导Skill、HardFault和fact-check完整相关段；未逐项审阅所有领域参考与平台适配，未做硬件验证。
- 下一步：已检查源码与Skill文本，未执行目标代码、编译/硬件测试或真实宿主验收。

**分析版本**

- **仓库**：[AmethystLuna/embedded-workbench](https://github.com/AmethystLuna/embedded-workbench)
- **版本号**：0.9.5（[固定提交 f32698d](https://github.com/AmethystLuna/embedded-workbench/tree/f32698d8e61bd50295ac66721838bf6aacec1859)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为将核查证据与代码/计划版本绑定，减少无支持的核查自报；错误计划对照及否定条件见 [Q05](#research-q05)。

已检查源码与Skill文本，未执行目标代码、编译/硬件测试或真实宿主验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 41 | 4716 | — | — | 37145 |
| .js | source | 3 | 784 | 494 | 247 | — |
| .mjs | source | 2 | 213 | 168 | 28 | — |
| .ts | source | 1 | 300 | 146 | 131 | — |
| .mjs | test | 5 | 868 | 658 | 123 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/embedded-workbench/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对领域技能整理、DSH投递和计划核查承诺，区分提示与真实验证。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 嵌入式技能包相对通用助手提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是需要处理C/C++固件、中断/RTOS边界、Keil构建和异常现场的开发者。相对每次编写提示或散落项目笔记，贡献是把领域检查流程、参考和风险分级工作流组织成可发现技能，并将计划声称核查作为开工前提醒。合格结果是与目标芯片、编译器和当前代码对应的可验证修复，不是技能被加载或报告写了核查段。已抽查HardFault从捕获、分类、定位到根因的流程和fact-check逐条声称核对，其知识是方法整理，不能当新的调试算法或保证诊断正确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-41](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/README.md#L13-L41)

作者列出领域、技能及DSH边界。

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[skills/hardfault-triage/SKILL.md:14-53](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/skills/hardfault-triage/SKILL.md#L14-L53)

具体异常处理流程而非仅功能名。

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

**依据 3 · 源码核查**：[skills/fact-check/SKILL.md:20-40](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/skills/fact-check/SKILL.md#L20-L40)

逐声称证据/判定交付方法。

<details>
<summary>查看原文（21行）</summary>

```text
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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 技能注册与首步门禁怎样实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

入口通过宿主FileSystemSkillProvider只指向包内skills目录，不混扫用户根；因注册位于全局层，各预设均可发现技能。pre-step先调用next，拒绝决定不被覆盖，开关关闭或持久历史已有本插件消息时不追加，否则把gateContent作为来源标识明确的user消息加到decision。历史检测同时认识新旧来源格式；状态inspect提供是否启用和文本长度。这是消息投递与去重机制，不是程序验证执行器，也不注册作者README里的四个自定义agent到DSH。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:238-279](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/src/index.ts#L238-L279)

技能提供者与pre-step条件。

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

**依据 2 · 源码核查**：[src/index.ts:290-299](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/src/index.ts#L290-L299)

持久历史来源去重。

<details>
<summary>查看原文（10行）</summary>

```text
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

**依据 3 · 源码核查**：[src/index.ts:180-211](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/src/index.ts#L180-L211)

inspect状态读口。

<details>
<summary>查看原文（32行）</summary>

```text
function inspectProvider(config: Config): HostCordisInspectProviderRegistration {
  return {
    manifest: {
      id: 'embedded-workbench',
      description: 'Session-start gate injection for the Embedded Workbench toolbox — folds the Plan Verification Gate and the context-budget rule into the first model step of every agent session.',
      methods: [
        {
          name: 'status',
          description: 'Read whether the gate injection is active and how large the injected gate text is.',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
          outputSchema: {
            type: 'object',
            description: 'Gate-injection plugin status.',
            properties: {
              enabled: { type: 'boolean', description: 'Whether the gate folds into the first model step.' },
              gateContentLength: { type: 'integer', description: 'Length in characters of the injected gate text.' },
            },
            required: ['enabled', 'gateContentLength'],
            additionalProperties: false,
          },
        },
      ],
    },
    query: async (method) => {
      if (method === 'status') {
        return {
          enabled: injectionEnabled(config),
          gateContentLength: config.gateContent.length,
```

</details>

**依据 4 · 作者声明**：[README.md:91-95](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/README.md#L91-L95)

作者区分DSH三项接入和未移植agent。

```text
这个 bundle 做三件事：

1. **注册技能。** 技能遵循 Agent Skills 开放标准，由 dsh 的 `skill-filesystem` provider 原样发现，不需要额外代码。
2. **注入门禁。** 每个 agent 会话的第一个模型步骤会收到一段**精简后**的首步门禁，内容是 Plan Verification Gate 加上下文预算规则。它由 `enabled` 控制，默认开启。这是 Claude `SessionStart` hook 在 dsh 上的对应物。载荷里为什么不再有 1% Rule 和 Red Flags，见[设计取舍与反馈](#设计取舍与反馈)。
3. **注册目录条目。** 模型可见的目录条目（`cordis_inspect`）始终注册。4 个自定义 agent 有意不移植，因为 dsh 原生的 subagent 工具已经覆盖并行多 agent 工作。
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 名为Gate是否会真正阻止未验证实施？

**研究主题**：缺陷与关键质疑

#### 完整回答

核心质疑是提醒被误当执行门禁。默认文本要求先核查或向用户说明未验证，但代码仅追加消息，没有检查Plan Verification块、实际证据或exit_plan_mode执行结果，也不在缺验证时返回reject。fact-check明确不做可执行状态空间检查，复杂行为需外部能力或人工降级，因此“核查了文件名”不能证明状态机或中断并发安全。启用开关改变后续注入，不会撤回已进入历史的规则。领域正文还含自称优先于system的层级描述，这是插件文案而不是宿主可赋予的权限；采用前需与项目实际指令边界核对，不能照单执行。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:68-76](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/src/index.ts#L68-L76)

gate为自然语言要求。

```text
const DEFAULT_GATE_CONTENT = `<EXTREMELY_IMPORTANT>
Plugin embedded-workbench is active: embedded C/C++ firmware development skills are in your skill catalog. Load the one whose "Use when" matches before substantial work, with the skill tool.

**Plan Verification Gate**: before calling exit_plan_mode (or presenting a plan for approval), load the logicprobe skill — or the built-in fact-check skill when logicprobe is not installed — and append a "## Plan Verification" block to the plan. If you verify with neither, tell the user the plan is unverified before asking for approval; a silent skip is not an option. "This change is too small to check" and "I already read the code, the paths are right" are the two rationalizations this gate exists to catch.

**Context budget**: no token meter is visible to you, so never guess one. Act on what you can see — a pruned or spilled tool result means stop pulling it in whole, and a compaction checkpoint means move durable state into files. When a large step (many sources, a long sweep, several independent areas) shows no such signal, ask the user what to spend context on rather than deciding silently. If nobody can answer, take the reversible option and say so. When you do delegate, prefer \`subagent_fork\` over \`subagent\` if the sub-agent needs context you already built — its summary still lands here.

To load the workflows and engineering policies behind these skills: load the embedded-workbench skill.
</EXTREMELY_IMPORTANT>`
```

**依据 2 · 源码核查**：[src/index.ts:269-278](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/src/index.ts#L269-L278)

只追加消息，未验证输出结构或强制拒绝。

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

**依据 3 · 源码核查**：[skills/fact-check/SKILL.md:51-58](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/skills/fact-check/SKILL.md#L51-L58)

事实核查不等状态空间验证或安全审计。

```text
## Boundaries

- **No executable model verification** — no state-space exploration, no harness.
- State machines (≥3 states), ACK/NACK/retry/timeout logic, lock/unlock
  ordering, and "always"/"never"/"guaranteed" claims require the `logicprobe`
  plugin: install it (see `.dsh/INSTALL.md`) or tell the user verification is
  degraded to manual mode for those claims.
- Checking a claim is not a security audit; being checked ≠ being safe.
```

**依据 4 · 源码核查**：[skills/embedded-workbench/SKILL.md:14-22](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/skills/embedded-workbench/SKILL.md#L14-L22)

插件宣称的指令层级不应当作宿主授权。

```text
## Instruction Priority

This plugin's skills and policies override default system behavior, but **user instructions always take precedence**:

1. **User's explicit instructions** (CLAUDE.md, AGENTS.md, project rules, direct requests) — highest priority
2. **Plugin skills and workflows** — override default system behavior where they conflict
3. **Default system prompt** — lowest priority

If a user's CLAUDE.md says "skip design review for hotfixes" and the workflow requires it, follow the user. The user is in control.
```

#### 缺口

- 不同模型是否遵守提醒、是否过度提问及真实缺陷发现率未知
  **影响**：不能将投递成功当验证完成
  **进一步探讨**：固定简单修复/状态机/ISR任务，对照技能提醒和无提醒，盲审漏检与额外流程成本

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次和持续使用有哪些工具链与上下文负担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

插件装载需兼容DSH/skills/llm/session接口和Node>=20，真正固件验证还需要芯片参考手册、对应编译器、构建产物和可用测试/硬件。HardFault引用.map/addr2line等输入，资料不存在时不能猜现场。logicprobe是外部可选路径，fact-check回退只覆盖静态声称，不能由已安装插件推成具备全部验证能力。成本包含首步注入、按需技能正文、模型分析与人工逐声称核对；若采用完整工作流还可能增加审查/子代理开销。作者缩减token是作者报告，本轮未用模型计数或运行。禁用后也需新会话检查，以区分未来不注入和历史仍存在。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:27-34](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/package.json#L27-L34)

Node与宿主范围。

```text
    },
    "dsh": {
        "engines": {
            "dsh": ">=0.1.0-rc.7"
        },
        "category": "skill",
        "displayName": "嵌入式工作台",
        "bundle": {
```

**依据 2 · 源码核查**：[skills/hardfault-triage/SKILL.md:18-40](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/skills/hardfault-triage/SKILL.md#L18-L40)

现场寄存器和编译产物依赖。

<details>
<summary>查看原文（23行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[skills/fact-check/SKILL.md:51-58](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/skills/fact-check/SKILL.md#L51-L58)

外部验证能力的降级边界。

```text
## Boundaries

- **No executable model verification** — no state-space exploration, no harness.
- State machines (≥3 states), ACK/NACK/retry/timeout logic, lock/unlock
  ordering, and "always"/"never"/"guaranteed" claims require the `logicprobe`
  plugin: install it (see `.dsh/INSTALL.md`) or tell the user verification is
  degraded to manual mode for those claims.
- Checking a claim is not a security audit; being checked ≠ being safe.
```

**依据 4 · 源码核查**：[src/index.ts:113-127](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/src/index.ts#L113-L127)

默认启用和配置内容。

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

#### 缺口

- 真实固件任务的模型/人工/硬件成本未知
  **影响**：不能给出节时、成功率或ROI
  **进一步探讨**：固定芯片/编译器/任务记录全部加载文本、验证步骤、修订与人工耗时

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些模式可复用，怎样决定采用？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

值得借鉴的是按需领域材料与小首步提醒分离、持久历史去重及可选服务降级，移植需对应宿主消息来源和Skill目录协议。由提醒并非真实闸门可推导未验证假设：将逐声称核查结果绑定当前代码版本和计划，形成机器可检查证据声明，可能减少“写了核查段但无支持”的情况。最小验证固定错误API/过期路径/不可证行为计划，比较纯提醒、fact-check和证据绑定方案的误放行、人工负担与最终缺陷；若只是增加格式而不减少错误则否定。建议trial，先手动选择一个匹配的领域Skill，在可回滚固件分支核查实际编译/测试，逐步开启提醒；只做格式或小改动时应按风险比例避免额外仪式，任何无依据的验证宣称须停止使用其结论。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:238-279](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/src/index.ts#L238-L279)

按需提供者和一次性投递结构。

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

**依据 2 · 源码核查**：[skills/embedded-workbench/SKILL.md:56-67](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/skills/embedded-workbench/SKILL.md#L56-L67)

风险比例流程的实际文本。

<details>
<summary>查看原文（12行）</summary>

```text
## Proportionality

Match the process to the risk in front of you, not to habit. Start on the lightest path that covers the risk, and escalate only when you actually cross a boundary.

| Task shape | Path |
| --- | --- |
| Question, read-only investigation, or a bounded reversible edit (typo, constant, one call site) | Do it directly — no plan header, no sub-agent |
| One module, known repro, local refactor | Lite |
| Cross-module, public interface, shared-state ownership, new state machine, non-obvious failure/recovery mode | Full |
| Platform layer, contracts, staged migration | Full + audit matrix |

You have crossed into a heavier path when the change spans more than one module, alters a public interface or state ownership, hides a failure mode you cannot describe, or two attempts have not converged. Scaling a bounded edit up costs more than the edit.
```

</details>

**依据 3 · 源码核查**：[skills/fact-check/SKILL.md:29-49](https://github.com/AmethystLuna/embedded-workbench/blob/f32698d8e61bd50295ac66721838bf6aacec1859/skills/fact-check/SKILL.md#L29-L49)

证据绑定假设的输出基线。

<details>
<summary>查看原文（21行）</summary>

````text
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
````

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
