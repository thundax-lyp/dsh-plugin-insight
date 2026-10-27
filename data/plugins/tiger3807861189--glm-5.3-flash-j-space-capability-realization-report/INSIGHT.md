# GLM-5.3-Flash J-Space能力报告

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[7be8a2f](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/tree/7be8a2f5c458fa302d5ff934c4e6f6baa407ed47)

<!-- BEGIN META -->
[![GitHub ★ 1,017](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C017&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report)
<!-- END META -->

> **功能**：介绍J-Space选择性加载、任务状态记录与恢复协议，并汇总作者报告的基准估计。

> **亮点**：将长任务状态漂移、重试和完成判断组织成一份可读机制说明，贡献是研究材料与设计框架；不把未包含的原始套件算成本组件实现。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：增强成绩明确为有限实验估算，缺逐任务配置与轨迹；当前提交还缺所描述Skill入口和控制器，因此不能由报告推出可复现的提升。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 这份报告为长任务研究者提供什么，是否就是可安装套件？](#detail-section-11)
  - [Q02 · 选择性加载和账本控制是否有可检查实现？](#detail-section-12)
  - [Q03 · 五项基准和效率数字能支持怎样的效果判断？](#detail-section-13)
  - [Q04 · 报告值得如何使用，怎样验证它提出的方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供长任务Agent研究者阅读状态外化、选择性加载和恢复设计，提取可复核问题。

简单替代是直接记录目标、约束、下一步和验证结果的任务文件。复杂协议是否优于该基线尚无本次独立材料。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| PDF与双语报告 | 阅读长任务控制设计 | 资源而非本仓库已实现插件 |
| 作者基准汇总 | 形成待复核效果主张 | 增强分数标为估算，非独立复现 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Markdown或PDF阅读器 | 阅读必需 | 查看报告 | 可使用另一文档格式 |
| 原始套件固定源码与宿主Skill加载 | 验证机制必需 | 安装和追踪控制器 | 当前仓库无法提供 |
| 同模型任务级实验材料 | 效果核验必需 | 复核预算和质量 | 只保留作者声明 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 研究者阅读报告与基准脚注 | 区分估计和实测 |
| 2 | 研究者取得原始套件与逐例材料 | 对不上固定版本则不安装或推断 |
| 3 | 在同预算任务上做消融 | 只有可复现结果才调整采用建议 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 阅读与存储资源 | 阅读报告、寻找原始套件 | 实际安装包不在本仓库 |
| 持续使用 | 追加上下文与模型调用可能增加 | 维护账本与复核完成条件 | 无同任务用量和耗时数据 |
| 失败恢复 | 失败重试调用成本未知 | 对照检查点重建状态 | 控制器恢复未核查 |

不能把只依赖标准库当作零token成本，也不能将有限配对效率推广到所有长任务。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 机制说明 | 报告给出模式与控制器责任 | 对应源码正确性 |
| 基准提升 | 作者提供有限实验估计 | 同条件可复现收益 |
| 效率 | 声称来自GAIA配对 | 泛化和单位成本 |

> **思考**：增强成绩明确为有限实验估算，缺逐任务配置与轨迹；当前提交还缺所描述Skill入口和控制器，因此不能由报告推出可复现的提升。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将长任务状态漂移、重试和完成判断组织成一份可读机制说明，贡献是研究材料与设计框架；不把未包含的原始套件算成本组件实现。[Q01](#research-q01) [Q02](#research-q02)

作为资源，README区分状态记录与解法选择值得保留；但结构图的路径未在提交中实现，应显著标注原始来源，避免读者将说明仓库当可安装包。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

增强成绩明确为有限实验估算，缺逐任务配置与轨迹；当前提交还缺所描述Skill入口和控制器，因此不能由报告推出可复现的提升。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

长任务Agent研究者可阅读报告并提取状态外化与恢复的验证问题；先取得原始套件固定提交和任务级数据，不把README安装指令当作本仓库已提供实现；关键材料未补齐前仅观察。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

报告内容与作者声明已核查；实现缺失、估计基准不可独立复核；简单账本对照为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh-CN.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：研究对象为报告资源；核查固定README、完整Git树与PDF文本，不是源码实现审计或基准复现。
- 下一步：检查报告原始套件固定提交，随后开展同模型同预算三组消融，报告失败样本及人工复核成本。

**分析版本**

- **仓库**：[Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report)
- **版本号**：未声明（[固定提交 7be8a2f](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/tree/7be8a2f5c458fa302d5ff934c4e6f6baa407ed47)）
- **版本日期**：2026-09-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用原生指令、简单账本和完整协议三组消融判断收益是否主要来自状态外化；若简单组等效且更便宜就停止增加模块，尚未验证。[Q04](#research-q04)

检查报告原始套件固定提交，随后开展同模型同预算三组消融，报告失败样本及人工复核成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 413 | — | — | 4151 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本报告提供的长任务控制设计与效果材料能支持何种研究或采用结论？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这份报告为长任务研究者提供什么，是否就是可安装套件？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本组件是J-Space推理时控制的介绍与能力报告，面向研究长程任务中约束遗忘、无诊断重试与过早完成的读者。材料把选择性加载、共享状态、检查点与恢复组织成可讨论框架；可用交付物是设计线索与核验问题，不是当前仓库中一套已检查可运行的Skill。

固定Git树只有说明文档、PDF和元数据。README中的安装步骤指向j-space目录，但该目录并不在本提交中；PDF也明确把另一J-Space-Cognition-Suite-V3.7仓库作为来源。由此只能评价报告呈现的方案，不能把另一仓库的实现完整性或控制效果归给本组件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-13](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/blob/7be8a2f5c458fa302d5ff934c4e6f6baa407ed47/README.md#L7-L13)

README声明协议定位，不改权重。

```text
J-Space Cognition Suite is a model-agnostic inference-time control system for deep reasoning, long-horizon work, tool use, verification, and recovery.

It is packaged as a Skill for cross-platform use, selective loading, and low-friction integration.

The suite organizes an agent's accessible working representations into a deliberately managed workspace. It operates through a single entry, nine selectively loaded modules, four supporting references, and an optional standard-library controller for durable task state.

J-Space operates at inference time. Model weights and training remain unchanged.
```

**依据 2 · 作者声明**：[README.md:19-36](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/blob/7be8a2f5c458fa302d5ff934c4e6f6baa407ed47/README.md#L19-L36)

安装要求完整j-space目录。

<details>
<summary>查看原文（18行）</summary>

````text
1. Download or clone this repository.
2. Locate the user-level Skills directory used by your AI host.
3. Copy the complete [`j-space/`](j-space/) directory into it so that the installed entry is `<skills-directory>/j-space/SKILL.md`.
4. Run the integrity check with an available Python 3 interpreter:

   ```text
   <python-command> <skills-directory>/j-space/scripts/verify_suite.py
   ```

   Replace `<python-command>` with the Python 3 command available on the host, commonly `python`, `python3`, or `py -3`.

5. Reload the host if it discovers Skills at startup.

- The directory must remain intact because `SKILL.md` routes to relative paths under `modules/`, `references/`, and `scripts/`.


- The repository-level `LICENSE` and `THIRD_PARTY_NOTICES.md` remain part of the distribution.
- Include copies of both when redistributing `j-space/` as a standalone package.
````

</details>

**依据 3 · 作者声明**：[README.md:151-174](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/blob/7be8a2f5c458fa302d5ff934c4e6f6baa407ed47/README.md#L151-L174)

README展示的结构属于声称的套件结构，当前Git树没有这些路径。

<details>
<summary>查看原文（24行）</summary>

````text
## Project structure

```text
J-Space-Cognition-Suite-V3.7/
├── .github/workflows/verify.yml    # three-platform integrity and regression checks
├── .gitignore                      # keeps .jspace/ working state out of the repo
├── CITATION.cff                    # machine-readable citation metadata
├── CONTRIBUTING.md                 # contribution and provenance requirements
├── LICENSE                         # Apache License 2.0
├── README.md                       # English engineering guide
├── README.zh-CN.md                 # Chinese engineering guide
├── THIRD_PARTY_NOTICES.md          # attribution and license boundaries for source material
├── tests/test_jspace.py            # standard-library controller regression tests
└── j-space/
    ├── SKILL.md                    # single entry, gate, routing, and invariants
    ├── modules/                    # nine selectively loaded protocols
    ├── references/                 # evidence, induction, problem modeling, and worked exemplars
    └── scripts/
        ├── jspace.py               # optional loop controller
        ├── workspace-ledger.md     # ledger template and contract
        └── verify_suite.py         # authoring-time integrity check
```

`SKILL.md` is the only registered entry. Modules and references are loaded on demand so the control system does not become its own source of context pressure.
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 选择性加载和账本控制是否有可检查实现？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

报告描述fast/full/loop三种任务分级，复杂任务加载账本、检查点和恢复；可选Python控制器记状态而不替模型选择解法。其可借鉴处在把状态、下一步和验证覆盖外化，避免将流畅回答等同完成。

但这里只能追踪作者叙述。README指向的SKILL.md、九模块、控制器和回归测试不在当前Git树，所以无法检查入口如何路由、账本如何校验或错误状态如何恢复。Python标准库、只写.jspace等也都是作者声明；不应据此断言实现没有其他副作用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:62-84](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/blob/7be8a2f5c458fa302d5ff934c4e6f6baa407ed47/README.md#L62-L84)

三种模式及选择性机制表。

<details>
<summary>查看原文（23行）</summary>

```text
## Operating modes

| Pass | Suitable work | What loads |
|---|---|---|
| `fast` | One step, or a result checkable in one glance | Nothing extra |
| `full` | Several dependent steps and one bounded deliverable | One or two relevant modules; `ship` before delivery |
| `loop` | Multiple stages, files, turns, tools, or persistent state | Ledger, seams, checkpoints, register audit, and recovery |

A request for brevity changes the outer response length while verification remains aligned with the task's floor. Short work stays light; long work receives durable state only when it needs it.

## Core mechanisms

| Mechanism | Function |
|---|---|
| Selective workspace loading | Keeps one or two load-bearing ideas active and externalizes the rest |
| Broadcast hub | Gives dependent branches one shared source for names, values, constraints, and style anchors |
| Dense Track | Carries long internal chains in compact, decodable notation before returning to clean outer language |
| Bridge-before-conclusion reasoning | Makes required intermediates explicit before a conclusion consumes them |
| Metacognitive control | Routes confidence, inconsistency, and failure signals into a concrete next action |
| Empirical escape and verification | Converts stalled derivation into bounded tests with a named verifier and coverage |
| First-person agency and functional echo | Uses `I`, `we`, `let's`, and `we need` to bind workspace state to later actions and checks |

The mechanisms are selectively loaded. They are not a fixed checklist for every request.
```

</details>

**依据 2 · 作者声明**：[README.md:86-113](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/blob/7be8a2f5c458fa302d5ff934c4e6f6baa407ed47/README.md#L86-L113)

控制器命令和状态责任。

<details>
<summary>查看原文（28行）</summary>

````text
## Optional controller

[`j-space/scripts/jspace.py`](j-space/scripts/jspace.py) externalizes `loop` state into
`.jspace/` in the current task workspace. Invoke it by its resolved Skill path while keeping the task workspace as the current directory.

| Command | Purpose |
|---|---|
| `note --goal "..." --next "..."` | Open the ledger and define done plus the first action |
| `note --next "..."` | Replace the single next action after a checkpoint or seam |
| `note --core "name — defining fact"` | Record a hub entry |
| `note --core "name — defining fact" --core-slot 1` | Swap a selected live hub entry |
| `note --check "..." --by "..."` | Append a checkpoint with verifier and coverage |
| `note --open "..." --settled-by "..."` | Record a question and what would settle it |
| `note --close N --check "..." --by "..."` | Close question `N` against a new recorded checkpoint |
| `seam` | Re-read current state and report recent movement |
| `ship FILE` | Inspect outgoing text for register leakage and failure signatures |
| `resume` | Reload the premise, invariants, and full ledger after a long gap |

```text
<python-command> <skill-root>/scripts/jspace.py note --goal "what done means" --next "first action"
<python-command> <skill-root>/scripts/jspace.py note --open "does the parser preserve state?" --settled-by "unit tests over all ledger sections and edge inputs"
<python-command> <skill-root>/scripts/jspace.py note --close 1 --check "the parser preserves state" --by "unit tests over all ledger sections and edge inputs"
<python-command> <skill-root>/scripts/jspace.py seam
<python-command> <skill-root>/scripts/jspace.py ship OUTPUT_FILE
<python-command> <skill-root>/scripts/jspace.py resume
```

The controller records and reports state. Solution choice remains with the model. It uses the Python standard library and writes working state only under the task's `.jspace/` directory.
````

</details>

**依据 3 · 作者声明**：[README.md:151-180](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/blob/7be8a2f5c458fa302d5ff934c4e6f6baa407ed47/README.md#L151-L180)

结构与验证命令虽列出，但当前仓库未包含目标文件。

<details>
<summary>查看原文（30行）</summary>

````text
## Project structure

```text
J-Space-Cognition-Suite-V3.7/
├── .github/workflows/verify.yml    # three-platform integrity and regression checks
├── .gitignore                      # keeps .jspace/ working state out of the repo
├── CITATION.cff                    # machine-readable citation metadata
├── CONTRIBUTING.md                 # contribution and provenance requirements
├── LICENSE                         # Apache License 2.0
├── README.md                       # English engineering guide
├── README.zh-CN.md                 # Chinese engineering guide
├── THIRD_PARTY_NOTICES.md          # attribution and license boundaries for source material
├── tests/test_jspace.py            # standard-library controller regression tests
└── j-space/
    ├── SKILL.md                    # single entry, gate, routing, and invariants
    ├── modules/                    # nine selectively loaded protocols
    ├── references/                 # evidence, induction, problem modeling, and worked exemplars
    └── scripts/
        ├── jspace.py               # optional loop controller
        ├── workspace-ledger.md     # ledger template and contract
        └── verify_suite.py         # authoring-time integrity check
```

`SKILL.md` is the only registered entry. Modules and references are loaded on demand so the control system does not become its own source of context pressure.

Maintainers can verify the package from its root:

```text
<python-command> j-space/scripts/verify_suite.py
<python-command> -m unittest discover -s tests -v
````

</details>

#### 缺口

- 当前仓库缺少可安装入口、控制器与测试文件。
  **影响**：无法核实机制实现和运行成本，不能推荐直接安装本仓库。
  **进一步探讨**：取得报告指向原始套件的固定提交，独立核对入口、状态写入与恢复。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 五项基准和效率数字能支持怎样的效果判断？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

README明确将增强后五项基准标作基于有限对照实验的估算，速度1.87和token效率1.41只说明来自GAIA对照对。它们是作者报告，不能视为本次复现，也不能据此断言达到另一模型的整体能力。PDF的数据说明还将口径截止于2026-09-04，而非本轮检查日期。

已检查PDF文本含机制讲解、架构类比和场景举例，未取得可逐例复核的测试清单、采样设置、失败轨迹和原始账单。注意力架构类比不代表文本协议修改了模型内部注意力。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 阅读与存储资源 | 阅读报告、寻找原始套件 | 实际安装包不在本仓库 |
| 持续使用 | 追加上下文与模型调用可能增加 | 维护账本与复核完成条件 | 无同任务用量和耗时数据 |
| 失败恢复 | 失败重试调用成本未知 | 对照检查点重建状态 | 控制器恢复未核查 |

不能把只依赖标准库当作零token成本，也不能将有限配对效率推广到所有长任务。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:121-143](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/blob/7be8a2f5c458fa302d5ff934c4e6f6baa407ed47/README.md#L121-L143)

基准表脚注标估算且效率来自GAIA对照对。

<details>
<summary>查看原文（23行）</summary>

```text
## Benchmark

### 1. Main table

| Benchmark                | GLM-5.3-Flash | GLM-5.3-Flash **+ J-Space V3.7**† | GLM-5.3 | Opus-5 | Fable 5.1 |
| ------------------------ | ------------: | -------------------------------: | ------: | -----: | --------: |
| HLE (w/ tools)           |          55.3 |                              59.2 |    62.5 |   64.7 |      65.0 |
| Terminal Bench 2.1       |          84.3 |                              88.8 |    88.2 |  *89.1 |     *91.4 |
| DeepSWE v1.1             |          63.4 |                              68.0 |    66.9 |   68.8 |      67.4 |
| Agents' Last Exam        |          26.3 |                              30.5 |    28.5 |   31.6 |         — |
| AutomationBench (Public) |          48.8 |                              51.1 |    48.2 |   50.3 |         — |

\* Terminal Bench 2.1 figures for Opus-5 and Fable 5.1 are independently measured by a third party; no official entries exist.

\† Estimated, based on limited controlled experiments.

### 2. Speed and token efficiency

| Speed                | 1.87     |
| -------------------- | :------- |
| **Token efficiency** | **1.41** |

Speed and token efficiency come from a GAIA controlled pair.
```

</details>

**依据 2 · 作者声明**：[README.md:145-149](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/blob/7be8a2f5c458fa302d5ff934c4e6f6baa407ed47/README.md#L145-L149)

作者承认效果取决于基础能力、上下文、采样及基准。

```text
## Cross-model compatibility

The operating effects have been reproduced across the DeepSeek, Qwen, GLM, GPT, and Claude model families. Effect size varies with base capability, context policy, tool harness, sampling configuration, and benchmark implementation.

The portable unit is the protocol: workspace loading, selective routing, state externalization, verification, and recovery. It is independent of a vendor-specific tokenizer or model API.
```

**依据 3 · 作者声明**：[README.zh-CN.md:180-191](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/blob/7be8a2f5c458fa302d5ff934c4e6f6baa407ed47/README.zh-CN.md#L180-L191)

科学术语与设计原则的声明。

<details>
<summary>查看原文（12行）</summary>

```text
## 技术依据与适用边界

J-Space 采用 Anthropic 相关可解释性研究建立的操作性工作空间术语。在本套件中，第一人称语言被作为一种控制语法：可访问状态描述会绑定到明确的动作、检查与收束。

套件关注可报告性、主动保持、中间计算、广播、监控和因果敏感性等可观察功能属性。详细的研究解释、术语、证据边界与来源维护在
[`j-space/references/j-space-science.md`](j-space/references/j-space-science.md) 中。

设计原则：

> **内部稠密，按需可解码，外部保持清晰。**

只使用任务真正需要的机制。
```

</details>

#### 缺口

- 缺逐题样本、运行配置、配对轨迹和费用。
  **影响**：不能判断效果归因、估计误差和单位合格任务成本。
  **进一步探讨**：固定同一模型及预算，提供任务级轨迹与验收结果，比较原生指令、简单账本和完整协议。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 报告值得如何使用，怎样验证它提出的方向？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可作为待复核设计资料观察，不建议把本仓库当作可直接安装插件。先从真实长任务中选择一个约束遗忘案例，比较普通任务说明、简单目标与下一步账本、完整选择性协议三组，在同模型、同工具和总预算内，记录约束违反、错误恢复、合格完成率及人工时间。

未验证假设是简单账本已经解释主要改善，完整认知术语并非必要。若简化组得到相同或更好的合格率且成本更低，应优先采用简单状态机制；只有完整组在重复实验中明显减少不可恢复错误，才继续研究复杂协议。该假设由作者将状态外化与更多控制模块同时引入推导，不能当作已发现模块无效。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:66-70](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/blob/7be8a2f5c458fa302d5ff934c4e6f6baa407ed47/README.md#L66-L70)

作者按任务复杂度增减机制。

```text
| `fast` | One step, or a result checkable in one glance | Nothing extra |
| `full` | Several dependent steps and one bounded deliverable | One or two relevant modules; `ship` before delivery |
| `loop` | Multiple stages, files, turns, tools, or persistent state | Ledger, seams, checkpoints, register audit, and recovery |

A request for brevity changes the outer response length while verification remains aligned with the task's floor. Short work stays light; long work receives durable state only when it needs it.
```

**依据 2 · 作者声明**：[README.md:113-119](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/blob/7be8a2f5c458fa302d5ff934c4e6f6baa407ed47/README.md#L113-L119)

状态控制和选择性加载明确分离。

```text
The controller records and reports state. Solution choice remains with the model. It uses the Python standard library and writes working state only under the task's `.jspace/` directory.

## Generic model integration

An environment with a native Skill loader can install `j-space/` directly. For a chat or API environment, provide [`j-space/SKILL.md`](j-space/SKILL.md) as a system- or developer-level instruction and expose `modules/` and `references/` through file or retrieval tools.

Selected files should be retrieved on demand. Selective loading is part of the operating design.
```

**依据 3 · 作者声明**：[README.md:135-147](https://github.com/Tiger3807861189/GLM-5.3-Flash-J-Space-Capability-Realization-Report/blob/7be8a2f5c458fa302d5ff934c4e6f6baa407ed47/README.md#L135-L147)

估算和条件依赖要求独立受控比较。

<details>
<summary>查看原文（13行）</summary>

```text
\† Estimated, based on limited controlled experiments.

### 2. Speed and token efficiency

| Speed                | 1.87     |
| -------------------- | :------- |
| **Token efficiency** | **1.41** |

Speed and token efficiency come from a GAIA controlled pair.

## Cross-model compatibility

The operating effects have been reproduced across the DeepSeek, Qwen, GLM, GPT, and Claude model families. Effect size varies with base capability, context policy, tool harness, sampling configuration, and benchmark implementation.
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
