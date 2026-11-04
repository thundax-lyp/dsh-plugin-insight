# 嵌入式工作台

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6df9bb2](https://github.com/AmethystLuna/embedded-workbench/tree/6df9bb29547f7feeb667151447ec842ab654d38a)

<!-- BEGIN META -->
[![GitHub ★ 29](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=29&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AmethystLuna/embedded-workbench) [![npm 30d 3,820](https://img.shields.io/static/v1?label=npm+30d&message=3%2C820&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-embedded-workbench) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-embedded-workbench)
<!-- END META -->

> **功能**：为嵌入式 C/C++ 开发提供按需技能，并在 DSH 首个模型步注入计划核查提醒。

> **亮点**：[Q01](#research-q01)的按需领域材料与风险比例流程，[Q02](#research-q02)的持久来源去重和可选状态服务降级，形成比全量复制提示更可控的接线。方法和宿主能力的组合有局部增量，不宣称原创硬件知识或已测缺陷降低。

> **主要限制**：[Q03](#research-q03)确认“计划核查门”是提示消息，没有代码级拦截计划或校验证据；静态fact-check不证明状态机、并发和超时行为。出现核查章节不能作为固件交付通过。

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
  - [Q01 · 谁在什么固件任务中使用哪些按需材料，相比复制提示词改变什么？](#detail-section-11)
  - [Q02 · Skill、首步提醒和状态查询如何挂载，恢复和关闭保证到哪里？](#detail-section-12)
  - [Q03 · 计划核查能证明什么，事实核查何时不足？](#detail-section-13)
  - [Q04 · 如何试用、计算负担并停止，哪些环境不适用？](#detail-section-14)
  - [Q05 · 如何让逐声称核查和交付版本绑定而不增加无效流程？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有固件仓库和工具链的开发者，按当前异常、构建或并发问题加载方法，以可复现修复而非报告格式作为结果，见[Q01](#research-q01)。

对照手工复制领域提示和独立人工核查清单。它聚合方法并减少重复提醒，不取代真实编译、芯片文档及行为验证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 固件领域Skill目录 | 按需读取异常、构建、并发等方法 | 需具体芯片和工具链证据，不自动执行修复 |
| fact-check | 逐条核对API、路径、枚举和数量 | 不含可执行行为验证或安全保证 |
| 首步提醒 | 提醒计划提交前核查声称 | 提示机制，不拦截或校验交付 |
| 状态查询 | 读取提醒开关与文本长度 | 依赖可选cordisInspect，不证明核查完成 |
| Web提醒开关 | 控制后续提醒 | 关闭不移除Skill或历史文本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配 DSH、Skill 和消息服务 | 原生接入必需 | 注册目录及首步提醒 | 版本声明不能代替目标环境检查 |
| 包内 skills 文件、Node>=20声明 | 启动必需 | 加载方法和插件 | 缺文件不能按需读取 |
| 芯片现场、编译器和同版产物 | 修复效果必需 | 定位异常和验修复 | 无法把文本诊断升为确认结果 |
| logicprobe等外部验证器 | 行为声称时可选升级 | 外部模型或行为核查 | 本包fact-check只静态核查，不假定外部可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定固件版本、复现输入和回滚点 | 有同版构建及现场证据 |
| 加载 | 按宿主bundle方式加载，手动选择领域Skill | 目录和提醒来源可见，异常回原清单 |
| 修复 | 开发者按证据核查和实施 | 计划声称有原文，行为未验明确披露 |
| 验收 | 运行原工具链和复现检查 | 实际修复成立；仅标题齐全视为未完成 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包和宿主资源，金额未知 | 与芯片、工具链和团队规则对齐 | 学习与配置时间未测 |
| 持续使用 | 提醒及Skill上下文用量未知 | 核对声称、编译及现场复核 | 无净节时对照 |
| 失败恢复与退出 | 重测资源和外部验证成本未知 | 纠误诊、回滚、关提醒和新会话核查 | 关闭不撤历史消息 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 方法获取 | 包内材料和按需provider接线 | 实际故障修复率 |
| 提醒去重 | 持久消息来源检查和动态开关 | 目标宿主是否投递、模型是否遵守 |
| 核查交付 | 逐声称证据格式及静态范围 | 并发正确性、硬件结果和总负担 |

> **思考**：[Q03](#research-q03)确认“计划核查门”是提示消息，没有代码级拦截计划或校验证据；静态fact-check不证明状态机、并发和超时行为。出现核查章节不能作为固件交付通过。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)的按需领域材料与风险比例流程，[Q02](#research-q02)的持久来源去重和可选状态服务降级，形成比全量复制提示更可控的接线。方法和宿主能力的组合有局部增量，不宣称原创硬件知识或已测缺陷降低。

[Q02](#research-q02)用持久来源而非进程标志去重，兼容boolean/Volatile并让可选状态服务失败不阻塞方法目录，值得借鉴。历史不可读时会失去去重依据；[Q03](#research-q03)的文字规则没有形成独立执行校验层。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)确认“计划核查门”是提示消息，没有代码级拦截计划或校验证据；静态fact-check不证明状态机、并发和超时行为。出现核查章节不能作为固件交付通过。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)先在可回滚任务中手动加载匹配领域Skill，核对同版编译和复现结果，再决定是否启用提醒；格式齐全但无证据时停止使用其结论。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

领域方法、注册与提醒机制有固定源码支持；任务效果和当前宿主兼容未实测。可在已有工具链和可回滚任务中试用，版本绑定设计仍是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、lib/index.js、src/client.js、.dsh/INSTALL.md、skills/embedded-workbench/SKILL.md、skills/hardfault-triage/SKILL.md、skills/fact-check/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定根包的源码与发行入口、provider、消息来源、历史去重、开关、客户端代表段，以及fact-check、HardFault和风险比例流程。旧findings全部按当前版本重核；未全审其他领域技能、多平台适配或外部验证器。
- 下一步：后续在隔离宿主核对首步、恢复和开关，并用同固件任务比较证据遗漏、误放行与完整成本；本轮未执行。

**分析版本**

- **仓库**：[AmethystLuna/embedded-workbench](https://github.com/AmethystLuna/embedded-workbench)
- **版本号**：0.9.7（[固定提交 6df9bb2](https://github.com/AmethystLuna/embedded-workbench/tree/6df9bb29547f7feeb667151447ec842ab654d38a)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的版本绑定逐声称证据层，用计划摘要和代码版本暴露陈旧核查，并区分静态确认与行为未验。若对照无法减少误放行或维护负担更大就停止。

后续在隔离宿主核对首步、恢复和开关，并用同固件任务比较证据遗漏、误放行与完整成本；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 41 | 4880 | — | — | 38629 |
| .js | source | 3 | 784 | 494 | 247 | — |
| .mjs | source | 2 | 213 | 168 | 28 | — |
| .ts | source | 1 | 300 | 146 | 131 | — |
| .mjs | test | 5 | 868 | 658 | 123 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AmethystLuna/embedded-workbench/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：按需固件材料与首步计划核查提醒能为哪些开发任务提供增量，提醒是否真正约束交付？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在什么固件任务中使用哪些按需材料，相比复制提示词改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本组件面向已有固件仓库、编译器及现场证据的 C/C++ 开发者，提供从异常定位、RTOS/中断约束到构建和状态机方法的按需材料。合格交付不是报告写了核查标题，而是修复能在匹配芯片、构建和复现条件下成立。以 HardFault 为例，材料从异常入口捕获寄存器、故障分类、PC 对应源码到根因分类组织证据，要求保留 map/axf 或反汇编等现场；缺这些输入时不能仅用一段自然语言诊断冒充修复。

与手工复制一份巨大的固件提示词相比，包内分主题 Skill 可以按当前故障加载，工作流按改动风险区分直接处理、Lite、Full 和迁移审计，降低将全流程施加于小任务的必要性。DSH 原生增量是注册包内 Skill 并投递一次小提醒，领域知识和风险分类的实用性属于方法组合；没有证据认定其中硬件知识或静态核查方法为原创。README 列出的四个自定义 Agent 不等于 DSH 内注册了四个预设，平台说明明确尚未移植，能力清单只计已接线的 Skill 和提醒。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-47](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/README.md#L13-L47)

作者描述任务范围、Skill 和 Agent 列表。

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

**依据 2 · 源码核查**：[skills/hardfault-triage/SKILL.md:12-53](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/skills/hardfault-triage/SKILL.md#L12-L53)

代表领域流程确实要求捕获、分类、定位和根因证据。

<details>
<summary>查看原文（42行）</summary>

```text
**REQUIRED BACKGROUND:** Load `Skill("debug-methodology")` for structured root-cause analysis. If the crash involves RTOS tasks or ISR context, also load `Skill("embedded-firmware-dev")`.

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

**依据 3 · 源码核查**：[skills/embedded-workbench/SKILL.md:24-26](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/skills/embedded-workbench/SKILL.md#L24-L26)

DSH 平台映射明确四个自定义 Agent 未移植。

```text
## Platform Adaptation

This plugin's skills and agents use Claude Code tool names (`Read`, `Write`, `Edit`, `Bash`, `Skill()`). If you are NOT on Claude Code, load `references/platform-tool-mapping.md` for the tool name equivalents on your platform (Codex CLI, Cursor, Kimi CLI, OpenCode, ZCode, Copilot CLI, DeepSeek Harness). On DeepSeek Harness (dsh) the names are lowercase (`read`/`write`/`edit`/`glob`/`grep`/`pwsh`), skills load through the `skill` tool, the plan gate is `exit_plan_mode`, parallel work uses `subagent`/`subagent_fork`, and the 4 custom agents below are not ported.
```

**依据 4 · 源码核查**：[skills/embedded-workbench/SKILL.md:56-67](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/skills/embedded-workbench/SKILL.md#L56-L67)

按风险选择流程而非统一强制重流程。

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Skill、首步提醒和状态查询如何挂载，恢复和关闭保证到哪里？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

根 package 的 main 指向 lib/index.js，bundle patch 插入 embedded-workbench 行。发行入口与 src/index.ts 的核心链路一致：apply 注册指向包内 skills 目录的标准 FileSystemSkillProvider；agent/pre-step 先 await 后续处理器，遇 reject 原样返回，否则根据开关和历史判断，追加有 plugin:embedded-workbench 来源的 user 消息。来源标识让持久历史可以识别已投递提醒，恢复后不靠进程内布尔变量重发；也兼容旧 plugin 包装来源。它检查的是历史中是否出现这种消息，不检查模型已读、已遵守或计划核查完成。

开关每步读取，支持 boolean 和 Volatile 引用；schemastery 没有 volatile 方法时退化为普通字段，避免在模块初始化时直接调用缺失方法。关闭只停止未来提醒，Skill 注册仍然保留，已进历史的消息不会被撤销。若历史接口都不存在，读取返回空数组，去重依据不足，不能把“每会话恰好一次”宣称为跨所有版本的无条件保证。

可选 cordisInspect 服务提供 enabled 和 gateContentLength 的只读状态；服务晚到时在下一次 pre-step 重试注册，失败记录警告但不阻止领域材料注册。状态查询只证明配置和文本长度，不证明任何工程任务通过。客户端通过配置表单操作 enabled，属于提醒开关入口；底层宿主设置写入、模块重载和多版本兼容仍依赖实际环境。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:4-16](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/package.json#L4-L16)

真实运行入口是构建后的lib/index.js。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:11-15](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/cordis.patch.yml#L11-L15)

bundle将插件配置行接入宿主。

```text
- insert:
    - id: embedded-workbench
      name: 'dsh-embedded-workbench'
      config:
        enabled: true
```

**依据 3 · 源码核查**：[lib/index.js:68-113](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/lib/index.js#L68-L113)

volatile降级、开关读取及历史接口的实际实现。

<details>
<summary>查看原文（46行）</summary>

```text
function live(field) {
    const probe = field;
    return typeof probe.volatile === 'function' ? probe.volatile() : field;
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
});
/**
 * Read the injection switch as a boolean, whichever shape this host produced.
 * @param config - the resolved plugin configuration.
 * @returns whether the gate may be injected.
 */
function injectionEnabled(config) {
    const value = config.enabled;
    return typeof value === 'boolean' ? value : value.get();
}
function gateMessage(text) {
    return createUserMessage({
        content: [{ type: 'text', text }],
        // `form` omitted — an undeclared context is the documented default.
        source: { kind: GATE_SOURCE_KIND },
    });
}
function readSessionEvents(session) {
    const source = session;
    if (typeof source.snapshotEvents === 'function') {
        const snapshot = source.snapshotEvents();
        if (Array.isArray(snapshot))
            return snapshot;
    }
    if (Array.isArray(source.events))
        return source.events;
    return [];
```

</details>

**依据 4 · 源码核查**：[lib/index.js:147-193](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/lib/index.js#L147-L193)

状态查询及按包内路径注册Skill。

<details>
<summary>查看原文（47行）</summary>

```text
        query: async (method) => {
            if (method === 'status') {
                return {
                    enabled: injectionEnabled(config),
                    gateContentLength: config.gateContent.length,
                };
            }
            return null;
        },
    };
}
export function apply(ctx, config) {
    // Catalog visibility is optional: register only when the inspect registry
    // service is mounted, so headless assemblies without it keep the gate
    // injection working. The registry may be provided AFTER this row applies
    // (base-bundle rows can mount later), so registration is retried on the
    // first agent/session-start — by then the app is fully booted.
    let providerRegistered = false;
    const registerProvider = () => {
        if (providerRegistered)
            return;
        const inspect = ctx.get('cordisInspect');
        if (inspect === undefined)
            return;
        try {
            ctx.effect(() => inspect.register(inspectProvider(config)), 'embedded-workbench: inspect provider');
            providerRegistered = true;
        }
        catch (err) {
            console.warn('[embedded-workbench] inspect provider registration failed', err);
        }
    };
    registerProvider();
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
        });
    });
```

</details>

**依据 5 · 源码核查**：[lib/index.js:211-245](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/lib/index.js#L211-L245)

pre-step尊重reject，按来源历史去重并追加消息。

<details>
<summary>查看原文（35行）</summary>

```text
    ctx.on('agent/pre-step', async ({ agent }, next) => {
        const decision = await next();
        if (decision.kind === 'reject')
            return decision;
        registerProvider();
        if (!injectionEnabled(config))
            return decision;
        if (gateInHistory(agent.session))
            return decision;
        return {
            kind: 'enter',
            messages: [...decision.messages, gateMessage(config.gateContent)],
        };
    });
}
/**
 * Whether the gate already entered this session's durable history. The
 * pre-step listener re-appends the gate until it does; once a step committed
 * it, every later step (and a resume of a session that kept it) skips the
 * injection. A session whose gate was dropped before any step ran (e.g. an
 * inbox cleared by a blank-session preset switch) simply re-injects on the
 * first step that runs.
 */
function gateInHistory(session) {
    return readSessionEvents(session).some((event) => {
        if (event.type !== 'user/message')
            return false;
        const source = event.data?.source;
        if (source === undefined)
            return false;
        // The v4 producer-owned kind, plus the pre-v4 wrapper this bundle wrote
        // before DSH 0.1.7-alpha.1 retired it.
        return source.kind === GATE_SOURCE_KIND
            || (source.kind === 'plugin' && source.plugin === GATE_PLUGIN_ID);
    });
```

</details>

**依据 6 · 源码核查**：[src/client.js:89-118](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/src/client.js#L89-L118)

客户端开关与关闭后仍保留Skill的界面语义。

<details>
<summary>查看原文（30行）</summary>

```text
    /** Settings namespace: the Loader entry id this bundle's patch declares. */
    const NS = 'embedded-workbench'
    /** `plugins.bundle.config` key: the bundle's npm package name. */
    const PACKAGE = 'dsh-embedded-workbench'
    /** This page's dictionary namespace. */
    const LOCALE_NS = 'embedded-workbench.plugins'
    /** The Config field the switch writes inside the namespace's section. */
    const FIELD = 'enabled'

    /** English copy. */
    const en = {
      title: 'Gate injection',
      label: 'Inject the gate text',
      hint: 'Folds the Plan Verification Gate and the context-budget rule into the first model step of every session. Turning it off leaves all eight skills registered — only the injected text is dropped.',
      overridden: 'Overridden',
      reset: 'Reset to default',
      readOnly: 'This deployment stores settings read-only.',
      unavailable: 'This plugin is not loaded, so it cannot be configured right now.',
      saveFailed: 'The deployment did not accept that value; the switch shows what is stored.',
    }
    /** Simplified Chinese copy. */
    const zh = {
      title: 'Gate 注入',
      label: '注入 gate 文本',
      hint: '把 Plan Verification Gate 与上下文预算规则折进每个会话的第一个模型步。关掉后 8 个技能仍然注册，只是不再注入那段提示文本。',
      overridden: '已覆盖',
      reset: '恢复默认',
      readOnly: '本部署的设置为只读。',
      unavailable: '该插件当前未加载，暂时无法配置。',
      saveFailed: '本部署没有接受这个值，开关显示的是已存下的状态。',
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 计划核查能证明什么，事实核查何时不足？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

这里的 Plan Verification Gate 是模型可见的行为要求，不是工具调用拦截器或独立放行验证器。默认文本要求提交计划前加载 logicprobe 或 fact-check，并在都没有做时告知用户未核查；实际 pre-step 只追加消息，没有读取计划、逐条核对证据或阻止 exit_plan_mode。材料中自称更高优先级也不能改变宿主实际指令权限。用户不能用出现 Plan Verification 标题或状态查询开启来替代工程验收。

fact-check 的增量在把声称、原文、文件行号证据和 confirmed/refuted/unverifiable 逐项记录，适合核对 API、路径、枚举和数量；它明确不做状态空间探索、并发/重试/超时的可执行行为证明，也明确“已检查”不等于安全。因而对 ISR 生命周期、NVM 写入中断和状态机安全性，静态路径检查只能解决部分前提，应保留人工确认或另接匹配的验证器。没有检查外部 logicprobe 或 dsh-model-everything 的实现，本报告只认定本包有回退材料及依赖声明，不评价外部验证器效果。

最强支持是提醒和静态逐声称证据可以减少无依据的计划；最强反例是同一段报告模板可能在没有真实编译、硬件状态或行为验证时照样完整。是否实际减少误放行和诊断成本没有同条件结果数据，不能以方法写得详细替代结果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:45-53](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/lib/index.js#L45-L53)

默认门槛为提示文本，允许明确告知未核查。

```text
const DEFAULT_GATE_CONTENT = `<EXTREMELY_IMPORTANT>
Plugin embedded-workbench is active: embedded C/C++ firmware development skills are in your skill catalog. Load the one whose "Use when" matches before substantial work, with the skill tool.

**Plan Verification Gate**: before calling exit_plan_mode (or presenting a plan for approval), load the logicprobe skill — or the built-in fact-check skill when logicprobe is not installed — and append a "## Plan Verification" block to the plan. If you verify with neither, tell the user the plan is unverified before asking for approval; a silent skip is not an option. "This change is too small to check" and "I already read the code, the paths are right" are the two rationalizations this gate exists to catch.

**Context budget**: no token meter is visible to you, so never guess one. Act on what you can see — a pruned or spilled tool result means stop pulling it in whole, and a compaction checkpoint means move durable state into files. When a large step (many sources, a long sweep, several independent areas) shows no such signal, ask the user what to spend context on rather than deciding silently. If nobody can answer, take the reversible option and say so. When you do delegate, prefer \`subagent_fork\` over \`subagent\` if the sub-agent needs context you already built — its summary still lands here.

To load the workflows and engineering policies behind these skills: load the embedded-workbench skill.
</EXTREMELY_IMPORTANT>`;
```

**依据 2 · 源码核查**：[lib/index.js:211-224](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/lib/index.js#L211-L224)

实际执行只追加消息，没有校验或阻止计划工具。

<details>
<summary>查看原文（14行）</summary>

```text
    ctx.on('agent/pre-step', async ({ agent }, next) => {
        const decision = await next();
        if (decision.kind === 'reject')
            return decision;
        registerProvider();
        if (!injectionEnabled(config))
            return decision;
        if (gateInHistory(agent.session))
            return decision;
        return {
            kind: 'enter',
            messages: [...decision.messages, gateMessage(config.gateContent)],
        };
    });
```

</details>

**依据 3 · 源码核查**：[skills/fact-check/SKILL.md:20-49](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/skills/fact-check/SKILL.md#L20-L49)

逐声称核查流程和报告格式。

<details>
<summary>查看原文（30行）</summary>

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
````

</details>

**依据 4 · 源码核查**：[skills/fact-check/SKILL.md:51-58](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/skills/fact-check/SKILL.md#L51-L58)

明确不含可执行行为验证、安全审计或保证。

```text
## Boundaries

- **No executable model verification** — no state-space exploration, no harness.
- State machines (≥3 states), ACK/NACK/retry/timeout logic, lock/unlock
  ordering, and "always"/"never"/"guaranteed" claims require the `logicprobe`
  plugin: install it (see `.dsh/INSTALL.md`) or tell the user verification is
  degraded to manual mode for those claims.
- Checking a claim is not a security audit; being checked ≠ being safe.
```

**依据 5 · 源码核查**：[skills/embedded-workbench/SKILL.md:114-124](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/skills/embedded-workbench/SKILL.md#L114-L124)

上层流程也允许未核查声明和行为核查降级。

<details>
<summary>查看原文（11行）</summary>

```text
### Plan Verification Gate

> **⚠️ The verification skill ships in another plugin.** It started in `logicprobe` (v0.6.0, <https://github.com/AmethystLuna/logicprobe>) and that plugin continues as [`dsh-model-everything`](https://github.com/AmethystLuna/dsh-model-everything), which is the superset: the same claim verification plus diagram review, data-model checks, a concurrency claim family and export to external checkers. Load `Skill("model-everything")` when `dsh-model-everything` is installed, `Skill("logicprobe")` when only the older plugin is, and the built-in `Skill("fact-check")` when neither is — behavioral and model claims then degrade to manual confirmation.

**Before calling `ExitPlanMode`**, exactly one of the following must happen:

1. **Load the verification skill** — `Skill("model-everything")` when `dsh-model-everything` is installed (the successor of `logicprobe`), otherwise `Skill("logicprobe")` if the older plugin is installed. It classifies depth (LIGHTWEIGHT / STANDARD / ESCALATED), runs the verification including executable model checks, and appends a `## Plan Verification` summary block to the plan.
2. **Load `Skill("fact-check")`** (built-in fallback, only when neither plugin is installed) — verifies every verifiable claim against the codebase with evidence, appends a `## Plan Verification` block marked `fact-check (fallback)`, and tells the user that state-machine/behavioral claims degrade to manual confirmation.
3. **Inform the user** — if you load neither, say: *"此计划未经核查。是否需要我在审批前运行事实核查？（This plan has not been fact-verified. Would you like me to run verification before approving?）"*

Silent skip is not an option. Plan mode permits `Read`, `Glob`, `Grep`, and `Skill` calls, so all of this executes before exit.
```

</details>

#### 缺口

- 模型会否遵守提醒、是否减少缺陷与误放行未知。
  **影响**：不能宣称提醒已经实现严格工程质量门禁。
  **进一步探讨**：用相同固件任务和模型比较手工清单、Skill按需加载、加提醒三组，盲审遗漏和错误放行。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何试用、计算负担并停止，哪些环境不适用？

**研究主题**：采用判断、效果与总成本、依赖、兼容与流程

#### 完整回答

可对已有固件工具链、能回滚且愿意核对现场证据的开发者提出有条件试用。先选与一项真实问题匹配的 Skill，例如用异常寄存器和同版 axf/map 定位一个可重现 HardFault；先手工加载领域材料，再比较启用提醒是否增加有效证据。这个任务有清楚输入、方法和退出方式，源码也能支持可控范围；它不是替代编译器、调试器、芯片手册或硬件试验的自动固件修复器。

安装说明给出原生 bundle、重启及设置状态检查，包声明 Node>=20 与多代 DSH 范围。兼容矩阵和作者测量属于上游记录；本轮没有安装当前包或验证全部宿主。额外行为验证器只在相应声称需要时加入，不假定已安装、不把其费用或能力算作本包自有。对短小可逆修改，直接检查可能已经足够，加载全工作流反而增加文档和沟通负担。

成功判据是定位与修复有对应版本证据、实际编译和复现检查，且核查投入与错误减少相称；只生成形式化标题、重复要求无用流程、错误解释寄存器或把行为未验写成保证时，应停止相信结论，关闭提醒并回到人工核查和工具链。关闭后历史文本仍在，因此新会话可以用于确认实际退出行为。没有本次模型token、编译时间、人工分钟数或缺陷对照，不能计算节时或单位合格修复成本。

#### 证据与依据

**依据 1 · 作者声明**：[.dsh/INSTALL.md:14-24](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/.dsh/INSTALL.md#L14-L24)

安装路径及需读取宿主应用状态而非只看终端成功。

<details>
<summary>查看原文（11行）</summary>

````text
# from npm (published as dsh-embedded-workbench)
dsh plugin --profile web add dsh-embedded-workbench
# or from GitHub (source of truth)
dsh plugin --profile web add "github:AmethystLuna/embedded-workbench"
# when dsh is not installed globally
npx -p @deepseek-ai/dsh dsh plugin --profile web add dsh-embedded-workbench
```

This installs under the package name `dsh-embedded-workbench`. If you manage the profile's `package.json` by hand, use that same name for both the dependency key and the `dsh.profile.bundles` entry.

When an **agent** installs it inside a profile, the sanctioned path is the Plugin Manager rather than the CLI above: `plugin_manager` with `action: install_bundle` and the absolute package directory as `target`. Do not write the profile's `package.json` or `cordis.patch.yml` by hand, do not create packages under `$DSH_HOME`, and do not run pnpm in the profile directory — `install_bundle` performs those steps, and every hand-made write outside the workspace needs its own approval. Its result decides whether the change is live: read the returned `application` state (`applied`, `failed`, `overridden`, `restart-required`) and the `warnings`, not terminal output. Replacing an already-installed package needs a restart to load a fresh JavaScript module generation.
````

</details>

**依据 2 · 作者声明**：[.dsh/INSTALL.md:37-40](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/.dsh/INSTALL.md#L37-L40)

重启后注册Skill与投递小提醒的声明。

```text
Restart the target profile. The bundle mounts a native cordis plugin, and that plugin does two things.

1. It registers the skills from the package's `skills/` directory into dsh's `ctx.skills` registry, through the standard filesystem provider. The skills then appear in the session skill catalog, with no manual copy step.
2. It folds a **trimmed** gate into the first model step. The gate carries the Plan Verification Gate plus the context-budget rule, about 400 tokens in total. This is the dsh counterpart of the Claude Code `SessionStart` hook. The 1% Rule and the Red Flags table deliberately stay out of that payload; see "Design trade-offs and feedback" in the README. Set `enabled: false` to drop the injection entirely.
```

**依据 3 · 源码核查**：[package.json:25-40](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/package.json#L25-L40)

Node、DSH声明及bundle入口。

<details>
<summary>查看原文（16行）</summary>

```text
    "engines": {
        "node": ">=20"
    },
    "dsh": {
        "engines": {
            "dsh": ">=0.1.0-rc.7"
        },
        "category": "skill",
        "displayName": "嵌入式工作台",
        "bundle": {
            "patch": "./cordis.patch.yml"
        },
        "client": {
            "platform": "web",
            "inject": [
                "@deepseek-ai/dsh-client-locale",
```

</details>

**依据 4 · 源码核查**：[skills/hardfault-triage/SKILL.md:18-40](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/skills/hardfault-triage/SKILL.md#L18-L40)

合格定位依赖寄存器和同版构建产物。

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

**依据 5 · 源码核查**：[skills/embedded-workbench/SKILL.md:56-67](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/skills/embedded-workbench/SKILL.md#L56-L67)

轻重流程的适用和停止升级依据。

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

#### 缺口

- 同任务的合格修复率、人工投入和提醒带来的额外用量未知。
  **影响**：有条件试用不意味着已验证增效或值得持续安装。
  **进一步探讨**：记录修复是否通过实际工具链、总模型用量、人工审阅和返工，包含失败尝试。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何让逐声称核查和交付版本绑定而不增加无效流程？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是给 Plan Verification 的逐声称证据绑定代码版本、计划摘要和核查范围，并把静态确认与行为未验分开，使后续改计划或改实现后能够发现旧核查不再覆盖。推导依据是当前入口只保证提醒投递，fact-check 有逐项证据但报告块本身没有成为运行时放行依据。相对现有设计的增量应是“变更后识别陈旧证据”，而不是再多写一段已核查文案。

最小对照在同一固件小改动中预置一种API改名、一种构建产物不匹配、一种静态正确但重试状态有误的情况；比较现有fact-check、人工清单和版本绑定证据层。记录旧证据误放行、行为未验是否如实披露、额外维护分钟数与错误阻止数。若绑定层只是增加表格，不能减少陈旧证据误用，或阻断了正常小改动而没有对应缺陷收益，应否定方案。它仍不能靠摘要证明硬件行为，外部验证结果必须绑定自己的环境和边界。

#### 证据与依据

**依据 1 · 源码核查**：[skills/fact-check/SKILL.md:31-49](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/skills/fact-check/SKILL.md#L31-L49)

现有逐声称证据与统计摘要是设计参照。

<details>
<summary>查看原文（19行）</summary>

````text
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

**依据 2 · 源码核查**：[lib/index.js:211-224](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/lib/index.js#L211-L224)

当前入口没有把核查对象与计划工具绑定。

<details>
<summary>查看原文（14行）</summary>

```text
    ctx.on('agent/pre-step', async ({ agent }, next) => {
        const decision = await next();
        if (decision.kind === 'reject')
            return decision;
        registerProvider();
        if (!injectionEnabled(config))
            return decision;
        if (gateInHistory(agent.session))
            return decision;
        return {
            kind: 'enter',
            messages: [...decision.messages, gateMessage(config.gateContent)],
        };
    });
```

</details>

**依据 3 · 源码核查**：[skills/fact-check/SKILL.md:51-58](https://github.com/AmethystLuna/embedded-workbench/blob/6df9bb29547f7feeb667151447ec842ab654d38a/skills/fact-check/SKILL.md#L51-L58)

行为验证缺口必须继续显式保留。

```text
## Boundaries

- **No executable model verification** — no state-space exploration, no harness.
- State machines (≥3 states), ACK/NACK/retry/timeout logic, lock/unlock
  ordering, and "always"/"never"/"guaranteed" claims require the `logicprobe`
  plugin: install it (see `.dsh/INSTALL.md`) or tell the user verification is
  degraded to manual mode for those claims.
- Checking a claim is not a security audit; being checked ≠ being safe.
```

#### 缺口

- 版本绑定是否降低陈旧证据误用未知。
  **影响**：不能把研究者推演计为本包已实现功能或创新。
  **进一步探讨**：执行上述三组预置缺陷对照，事先定义误放行和维护成本停止线。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
