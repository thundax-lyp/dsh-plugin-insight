# VibeSkills

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[5200420](https://github.com/foryourhealth111-pixel/Vibe-Skills/tree/5200420c1992508a2d69952b9f02babf232a21ac)

<!-- BEGIN META -->
[![GitHub ★ 3,768](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C768&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/foryourhealth111-pixel/Vibe-Skills)
<!-- END META -->

> **实现功能**：通过本地Skill发现、任务分解、阶段控制和验收组织复杂工作流。

> **核心亮点**：[Q02](#research-q02)相对只写计划，把原任务、模块选择、阶段重入和验收记录接入可核查runtime；贡献在组织与治理，bundled第三方Skills本身不计原创。

> **风险与缺陷**：[Q03](#research-q03)、[Q04](#research-q04)proof链不能替代专业交付验收，作者OpenHands评测也不能直接证明当前DSH收益；部署和多次确认负担必须计入。

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
  - [Q01 · 大量本地Skill时，它改变的是选择入口还是交付组织？](#detail-section-11)
  - [Q02 · 入口如何绑定原任务、审批和后续执行？](#detail-section-12)
  - [Q03 · 规则与证明文件能否证明真正用了正确Skill？](#detail-section-13)
  - [Q04 · 作者节省token的数字可否抵消治理负担？](#detail-section-14)
  - [Q05 · 能否只保留最有用的治理而减少繁复证明？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：VibeSkills针对已有很多本地Skill、需要多种专业交付物的用户，目标把需求冻结、模块分解、Skill选择和验收连成流程。合格结果是实际交付物满足任务标准，不是生成计划与proof文件。原办法由用户手选Skill并维护计划；作者给出195个Skill池的SkillsBench对照，但这是作者报告，不能代表当前提交在DSH上的效果。简单问答或单命令任务不应承担完整治理流程，SKILL入口也明确允许不进入vibe。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 本地Skill组织 | 候选审计与Agent选择 | 候选不是已经执行证明 |
| 阶段重入 | 冻结需求计划并恢复执行 | 需要用户后续消息和凭据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python与core目录 | 必需 | canonical入口 | 无有效launch |
| PowerShell及宿主适配 | 依执行路径 | runtime bridge | 不宣称canonical verified |
| 本地Skill与用户阶段确认 | 复杂任务必需 | 模块选择和重入 | 暂停，不模拟proof |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户安装managed skills | 本地check仅证明安装 |
| 2 | Agent用原任务启动canonical | 返回session_root与receipt |
| 3 | 用户确认阶段、逐模块验收 | 失败保留原run并重入 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | runtime与Skill文件 | Python/PowerShell/宿主配置 | 当前DSH未验 |
| 持续 | 模型调用和过程存储 | 需求、计划、验收确认 | 不继承旧benchmark节省比例 |
| 失败恢复 | 保留run和重试 | 解析契约、重入 | 恢复时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 阶段契约 | CLI参数和core接线 | 全重入正确性 |
| 评测收益 | 作者结果和固定外部引用 | 当前DSH独立复现 |

> **思考**：[Q03](#research-q03)、[Q04](#research-q04)proof链不能替代专业交付验收，作者OpenHands评测也不能直接证明当前DSH收益；部署和多次确认负担必须计入。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)相对只写计划，把原任务、模块选择、阶段重入和验收记录接入可核查runtime；贡献在组织与治理，bundled第三方Skills本身不计原创。

[Q02](#research-q02)相对只写计划，把原任务、模块选择、阶段重入和验收记录接入可核查runtime；贡献在组织与治理，bundled第三方Skills本身不计原创。

宿主中立入口与core契约分离可借鉴，但Python核心与PowerShell桥接也增加维护面。JS/TS统计不能代表Python治理runtime总代码量，bundled第三方Skill不作原创。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)、[Q04](#research-q04)proof链不能替代专业交付验收，作者OpenHands评测也不能直接证明当前DSH收益；部署和多次确认负担必须计入。

<a id="detail-section-6"></a>

### 1.5 使用建议

拥有大量本地Skill并组织多交付物任务的用户可关注VibeSkills。它把选择和验收纳入阶段化runtime，相对手工计划的组织增量可见，但当前DSH收益与作者评测迁移尚未核实。若Python或PowerShell适配不明、任务只需单个Skill，就先用原有Skill与简单计划。 依据 [Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有实现为固定源码检查支持；用户收益未实测；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、SKILL.md、apps/vgo-cli/src/vgo_cli/commands.py、packages/runtime-core/src/vgo_runtime/canonical_entry.py、config/benchmark-results.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮只读固定提交，未执行目标代码或宿主验收；效果、人工耗时及持续采用情况未知。
- 下一步：以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

**分析版本**

- **仓库**：[foryourhealth111-pixel/Vibe-Skills](https://github.com/foryourhealth111-pixel/Vibe-Skills)
- **版本号**：未声明（[固定提交 5200420](https://github.com/foryourhealth111-pixel/Vibe-Skills/tree/5200420c1992508a2d69952b9f02babf232a21ac)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出按风险缩减proof与阶段开销的未验证假设，用完整流程和手选Skill作对照检验合格率及人工时间。

以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1176 | 394121 | — | — | 1519372 |
| .js | source | 3 | 1620 | 1095 | 315 | — |
| .md | example | 8 | 1633 | — | — | 8919 |
| .ts | source | 1 | 158 | 74 | 71 | — |
| .md | test | 8 | 158 | — | — | 740 |

</details>

**活跃度**

[![Issue 未关闭 36](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=36&color=737b86&logo=github)](https://github.com/foryourhealth111-pixel/Vibe-Skills/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=17&color=737b86&logo=github)](https://github.com/foryourhealth111-pixel/Vibe-Skills/issues?q=is%3Aissue+created%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z) [![近30天关闭 18](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=18&color=737b86&logo=github)](https://github.com/foryourhealth111-pixel/Vibe-Skills/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查VibeSkills的具体任务增量、关键失败条件与可控采用路径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 大量本地Skill时，它改变的是选择入口还是交付组织？

**研究主题**：场景与需求、采用判断

#### 完整回答

VibeSkills针对已有很多本地Skill、需要多种专业交付物的用户，目标把需求冻结、模块分解、Skill选择和验收连成流程。合格结果是实际交付物满足任务标准，不是生成计划与proof文件。原办法由用户手选Skill并维护计划；作者给出195个Skill池的SkillsBench对照，但这是作者报告，不能代表当前提交在DSH上的效果。简单问答或单命令任务不应承担完整治理流程，SKILL入口也明确允许不进入vibe。

#### 证据与依据

**依据 1 · 作者声明**：[SKILL.md:10-20](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/5200420c1992508a2d69952b9f02babf232a21ac/SKILL.md#L10-L20)

显式调用和轻任务例外

<details>
<summary>查看原文（11行）</summary>

```text
## Trigger Contract

Enter canonical `vibe` before ordinary execution when the user explicitly invokes `$vibe`, `/vibe`, or the `vibe` skill, or when the host intentionally chooses governed requirement/plan/execution closure for a complex task.

Do not route every loosely related task into `vibe`. Lightweight questions,
single-command checks, or tasks better served by another explicitly requested
skill may proceed outside `vibe` unless the user explicitly invoked this entry.

Installed-copy updates use `update --skills-dir <skills-dir>` on the same managed directory.

User instructions, including CLAUDE.md, GEMINI.md, AGENTS.md and direct workflow limits such as TDD exceptions, remain highest priority. Preserve canonical launch and proof rules within those limits.
```

</details>

**依据 2 · 作者声明**：[README.md:52-59](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/5200420c1992508a2d69952b9f02babf232a21ac/README.md#L52-L59)

作者评测设置和发布版本

```text
**SkillsBench** is a benchmark designed to evaluate whether AI agents can effectively use Skills to complete professional tasks across diverse domains. Its purpose is to measure how much a model’s ability to solve complex real-world tasks improves when it is equipped with specialized Skills.

To evaluate performance in production-like environments where a large number of Skills are installed simultaneously, we adapted SkillsBench into a more realistic **large-scale multi-Skill setting**. In the original SkillsBench setup, each task is provided only with the specialized Skill associated with that task. In our modified setting, every task is evaluated in a global environment containing all **195 specialized Skills**, while all other experimental conditions remain unchanged. This setting is intended to assess whether an agent can autonomously discover, select, and orchestrate the relevant Skills from a large installed Skill pool, and organize them into an effective workflow for completing complex tasks.

**vibeskills v4.1.0** was benchmarked on **SkillsBench** (https://www.skillsbench.ai/) using **DeepSeekV4Flash-VE** and **OpenHands** as the baseline evaluation setup. Compared with the baseline without vibeskills, vibeskills increased the **mean verifier reward by 21.12 percentage points**, while reducing **token consumption by 29.6%** and **tool calls by 33.1%**.


<p align="center"><sub>Analysis: 82 paired reward tasks · 81 paired resource tasks · Study: <code>full-skills-comparison</code> · Publication commit: <code>ef907ebf8370</code> · <a href="./config/benchmark-results.json">Machine-readable results and provenance</a></sub></p>
```

#### 缺口

- 真实用户多Skill任务的需求频率及当前版本收益未核实。
  **影响**：复杂任务适用性不能外推所有Skill用户。
  **进一步探讨**：收集具体多交付物任务和手选Skill基线，核对重复选择错误及验收遗漏。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口如何绑定原任务、审批和后续执行？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

SKILL要求保留用户原任务和工作区边界，由Python canonical-entry启动；CLI将prompt、artifact-root、run-id、reentry-token和host-decision转交core，而不是仅在提示词中宣称进入流程。core明列requirement_doc、xl_plan、phase_cleanup阶段与最低truth artifacts，并接入host receipt、module execution验证及kernel。相对手工计划，结构化阶段和重入凭据提供可核查组织边界；Skill最终选择仍由Agent负责，自动路由输出只是候选证据。源码模块存在不证明所有阶段不会被宿主绕过。

#### 证据与依据

**依据 1 · 源码核查**：[apps/vgo-cli/src/vgo_cli/commands.py:368-404](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/5200420c1992508a2d69952b9f02babf232a21ac/apps/vgo-cli/src/vgo_cli/commands.py#L368-L404)

入口参数直接转交core

<details>
<summary>查看原文（37行）</summary>

```text
def canonical_entry_command(args: argparse.Namespace) -> int:
    repo_root = Path(args.repo_root).resolve()
    command = [
        '--repo-root', str(repo_root),
        '--prompt', args.prompt,
    ]
    if getattr(args, 'host_id', None):
        command.extend(['--host-id', args.host_id])
    if getattr(args, 'entry_id', None):
        command.extend(['--entry-id', args.entry_id])
    if args.requested_stage_stop:
        command.extend(['--requested-stage-stop', args.requested_stage_stop])
    if args.requested_grade_floor:
        command.extend(['--requested-grade-floor', args.requested_grade_floor])
    if args.run_id:
        command.extend(['--run-id', args.run_id])
    if getattr(args, 'workspace_root', None):
        command.extend(['--workspace-root', args.workspace_root])
    if args.artifact_root:
        command.extend(['--artifact-root', args.artifact_root])
    if getattr(args, 'local_agent_root', None):
        command.extend(['--local-agent-root', args.local_agent_root])
    if getattr(args, 'continue_from_run_id', None):
        command.extend(['--continue-from-run-id', args.continue_from_run_id])
    if getattr(args, 'bounded_reentry_token', None):
        command.extend(['--bounded-reentry-token', args.bounded_reentry_token])
    if getattr(args, 'module_execution_json_file', None):
        command.extend(['--module-execution-json-file', args.module_execution_json_file])
    if getattr(args, 'host_decision_json', None):
        command.extend(['--host-decision-json', args.host_decision_json])
    if getattr(args, 'host_decision_json_file', None):
        command.extend(['--host-decision-json-file', args.host_decision_json_file])
    if args.force_runtime_neutral:
        command.append('--force-runtime-neutral')
    result = run_canonical_entry_core(repo_root, command)
    print_process_output(result)
    return int(result.returncode)
```

</details>

**依据 2 · 源码核查**：[packages/runtime-core/src/vgo_runtime/canonical_entry.py:34-76](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/5200420c1992508a2d69952b9f02babf232a21ac/packages/runtime-core/src/vgo_runtime/canonical_entry.py#L34-L76)

契约、kernel和阶段常量

<details>
<summary>查看原文（43行）</summary>

```text
from vgo_contracts.canonical_vibe_contract import resolve_canonical_vibe_contract
from vgo_contracts.discoverable_entry_surface import load_discoverable_entry_surface
from vgo_contracts.entry_root_guard import EntryRootGuardError, resolve_entry_repo_root
from vgo_contracts.host_launch_receipt import HostLaunchReceipt, read_host_launch_receipt, write_host_launch_receipt
from vgo_contracts.module_execution_contract import (
    resolve_execution_workspace,
    validate_agent_module_execution as _validate_agent_module_execution,
)
from vgo_runtime.artifact_contract import (  # noqa: E402
    resolve_runtime_artifact_projection,
    resolve_runtime_session_receipts_root,
    resolve_runtime_session_root,
    sync_session_receipts_to_run_artifact_sink,
)
from vgo_runtime.kernel.loop import run_local_kernel
from vgo_runtime.powershell_bridge import run_powershell_json_command
from vgo_runtime.runtime_support import resolve_host_id
from vgo_runtime.runtime_truth import build_runtime_truth_packet, build_runtime_truth_packet_from_payload
from vgo_runtime.runtime_summary import (
    build_runtime_summary,
    build_runtime_summary_from_payload,
    refresh_runtime_summary_acceptance,
)
from vgo_runtime.stage_stop import (
    extract_terminal_stage as extract_shared_terminal_stage,
    resolve_progressive_stage_stop_source,
    resolve_stage_stop,
    resolve_terminal_stage,
)

RUNTIME_ENTRYPOINT_RELPATH = "scripts/runtime/invoke-vibe-runtime.ps1"
CANONICAL_ENTRY_BRIDGE_RELPATH = "scripts/runtime/Invoke-VibeCanonicalEntry.ps1"
LOCAL_KERNEL_ENTRYPOINT_RELPATH = "packages/runtime-core/src/vgo_runtime/kernel/loop.py"
CANONICAL_RUNTIME_ENTRY_ID = "vibe"
CANONICAL_VIBE_PROGRESSIVE_STAGE_STOPS = ("requirement_doc", "xl_plan", "phase_cleanup")
MINIMUM_TRUTH_ARTIFACTS = {
    "runtime_input_packet": "runtime-input-packet.json",
    "governance_capsule": "governance-capsule.json",
    "stage_lineage": "stage-lineage.json",
}
REQUIRED_TRUTH_PACKET_FIELDS = (
    "module_assignments",
)
```

</details>

**依据 3 · 作者声明**：[SKILL.md:35-37](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/5200420c1992508a2d69952b9f02babf232a21ac/SKILL.md#L35-L37)

路由为候选审计、Agent负责选择

```text
Local skill candidate audit: semantic owner `packages/runtime-core/src/vgo_runtime/router_contract_runtime.py`; compatibility bridge `scripts/router/resolve-pack-route.ps1`

The audit runs inside canonical `vibe` and exposes candidates for inspection. Include work type, domain/technology, deliverable, explicit constraints, and verified frozen facts on continuation. Its output is compatibility evidence only; the Agent owns skill choice, binding, and stage progression.
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 规则与证明文件能否证明真正用了正确Skill？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

SKILL明确阅读入口、wrapper或check不等于canonical launch及交付验收，要求返回session_root后校验证据；同时硬停止阶段需要后续用户消息才允许重入。这会增加用户确认与产物管理成本，不能将“端到端”理解为无人值守。core默认非Windows需要pwsh，入口虽然是Python，仍引用PowerShell runtime bridge，跨平台部署不能只检查python存在。最关键质疑是proof链只证明流程记录一致，正确选择Skill与交付质量还需具体产物检验。

#### 证据与依据

**依据 1 · 作者声明**：[SKILL.md:58-83](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/5200420c1992508a2d69952b9f02babf232a21ac/SKILL.md#L58-L83)

证据与硬停止边界

<details>
<summary>查看原文（26行）</summary>

```text
Only validate canonical proof artifacts after canonical-entry returns a `session_root`.
`check` proves `installed locally`; runtime coherence and delivery acceptance require their own evidence.
Proof of canonical launch is post-launch and requires: `host-launch-receipt.json`, `runtime-input-packet.json`, `governance-capsule.json`, and `stage-lineage.json` under the returned `session_root`.
`local-agent-kernel` follows the same proof rule. If it cannot produce those truth artifacts, it may produce local work scaffolds, but it must not be treated as `canonical verified`.
If canonical launch fails, report `blocked` with the concrete failure reason instead of simulating the missing stages or proof artifacts.

## Consensus And Task Evolution

Use `deep_interview` until the user and Agent agree on the goal, scope, constraints, deliverables, relevant unknowns, and completion criteria. Freeze the requirement after confirmation of that task-specific summary; the first clarification is an input to the conversation.

Keep the agreement in the existing TaskCard. Append accepted revisions, update affected work and checks, and reuse results only while their inputs and acceptance remain valid. Surface decisions that change the agreed outcome, scope, risk, or required human judgment.

## Hard Stop And Re-entry

The progressive governed stops are `requirement_doc`, `xl_plan`, and `phase_cleanup`.

When `bounded_return_control.explicit_user_reentry_required = true`, stop the
current assistant turn. Do not consume re-entry credentials until a later user
message approves or revises the current boundary.

This is a hard runtime boundary, not a suggestion. It overrides ordinary host
autonomy rules such as "continue until done." A detailed original request is not
approval of the frozen requirement or frozen plan. After a hard stop, do not
perform equivalent manual work outside governed re-entry: no plan writing, task
execution, manual workaround delivery, or final artifact delivery in the same
assistant turn.
```

</details>

**依据 2 · 源码核查**：[packages/runtime-core/src/vgo_runtime/canonical_entry.py:18-28](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/5200420c1992508a2d69952b9f02babf232a21ac/packages/runtime-core/src/vgo_runtime/canonical_entry.py#L18-L28)

PowerShell默认依赖

<details>
<summary>查看原文（11行）</summary>

```text
REPO_ROOT = Path(__file__).resolve().parents[4]
RUNTIME_CORE_SRC = REPO_ROOT / "packages" / "runtime-core" / "src"
CONTRACTS_SRC = REPO_ROOT / "packages" / "contracts" / "src"
POWERSHELL_HOST_POLICY_PATH = REPO_ROOT / "config" / "powershell-host-policy.json"
POWERSHELL_HOST_POLICY_DEFAULTS: dict[str, Any] = {
    "preferred_powershell_host": "pwsh",
    "require_pwsh_on_non_windows": True,
    "allow_windows_powershell_fallback": True,
    "record_host_resolution_artifacts": True,
}
SUPPORTED_POWERSHELL_HOSTS = frozenset({"pwsh", "windows-powershell"})
```

</details>

**依据 3 · 源码核查**：[packages/runtime-core/src/vgo_runtime/canonical_entry.py:64-76](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/5200420c1992508a2d69952b9f02babf232a21ac/packages/runtime-core/src/vgo_runtime/canonical_entry.py#L64-L76)

bridge和truth文件契约

<details>
<summary>查看原文（13行）</summary>

```text
RUNTIME_ENTRYPOINT_RELPATH = "scripts/runtime/invoke-vibe-runtime.ps1"
CANONICAL_ENTRY_BRIDGE_RELPATH = "scripts/runtime/Invoke-VibeCanonicalEntry.ps1"
LOCAL_KERNEL_ENTRYPOINT_RELPATH = "packages/runtime-core/src/vgo_runtime/kernel/loop.py"
CANONICAL_RUNTIME_ENTRY_ID = "vibe"
CANONICAL_VIBE_PROGRESSIVE_STAGE_STOPS = ("requirement_doc", "xl_plan", "phase_cleanup")
MINIMUM_TRUTH_ARTIFACTS = {
    "runtime_input_packet": "runtime-input-packet.json",
    "governance_capsule": "governance-capsule.json",
    "stage_lineage": "stage-lineage.json",
}
REQUIRED_TRUTH_PACKET_FIELDS = (
    "module_assignments",
)
```

</details>

#### 缺口

- 本轮未完整追踪所有重入验证与宿主适配，无法给DSH即装即用保证。
  **影响**：当前DSH部署和重入可靠性没有闭环证据，妨碍直接建议试用。
  **进一步探讨**：跟踪DSH或generic adapter的启动、PowerShell分支及重入token校验，在隔离任务核对拒绝非法重入。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 作者节省token的数字可否抵消治理负担？

**研究主题**：效果与总成本、采用判断

#### 完整回答

作者本地benchmark-results保存82个奖励配对、81个资源配对及外部publication commit；说明统计口径而非本轮独立运行。README将结果绑定v4.1.0和OpenHands/DeepSeek模型，当前固定提交和目标DSH宿主不能直接继承百分比。首次要部署Python/PowerShell与managed skills目录，持续要确认需求/计划、维护模块组织和验收，失败要保留run证据并按同run重入。若任务不复杂，额外治理可能大于收益；本次先观察当前DSH接入与成本边界。

#### 证据与依据

**依据 1 · 作者声明**：[config/benchmark-results.json:3-22](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/5200420c1992508a2d69952b9f02babf232a21ac/config/benchmark-results.json#L3-L22)

研究版本、任务数及资源配对口径

<details>
<summary>查看原文（20行）</summary>

```text
  "study_id": "full-skills-comparison",
  "publication": {
    "repository": "https://github.com/foryourhealth111-pixel/vibeskills-benchmark",
    "commit": "ef907ebf8370807794371ba445dd22611a00d92e",
    "path": "studies/full-skills-comparison/PUBLICATION.json"
  },
  "benchmark": {
    "name": "SkillsBench",
    "version": "1.1",
    "catalog_tasks": 87,
    "source_commit": "b63b7b2850226b6aa4fb5929a8c1ac7bc4d9a6af",
    "task_skill_instances": 232,
    "global_skill_names": 195,
    "global_skill_tree_sha256": "cf36470ac20e0b2ff1cf55e592892a787ce686b0754034da3d949a83be576464"
  },
  "analysis": {
    "paired_reward_tasks": 82,
    "paired_resource_tasks": 81,
    "bootstrap_seed": 20260829,
    "bootstrap_draws": 50000
```

</details>

**依据 2 · 作者声明**：[README.md:54-59](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/5200420c1992508a2d69952b9f02babf232a21ac/README.md#L54-L59)

特定环境和版本结果

```text
To evaluate performance in production-like environments where a large number of Skills are installed simultaneously, we adapted SkillsBench into a more realistic **large-scale multi-Skill setting**. In the original SkillsBench setup, each task is provided only with the specialized Skill associated with that task. In our modified setting, every task is evaluated in a global environment containing all **195 specialized Skills**, while all other experimental conditions remain unchanged. This setting is intended to assess whether an agent can autonomously discover, select, and orchestrate the relevant Skills from a large installed Skill pool, and organize them into an effective workflow for completing complex tasks.

**vibeskills v4.1.0** was benchmarked on **SkillsBench** (https://www.skillsbench.ai/) using **DeepSeekV4Flash-VE** and **OpenHands** as the baseline evaluation setup. Compared with the baseline without vibeskills, vibeskills increased the **mean verifier reward by 21.12 percentage points**, while reducing **token consumption by 29.6%** and **tool calls by 33.1%**.


<p align="center"><sub>Analysis: 82 paired reward tasks · 81 paired resource tasks · Study: <code>full-skills-comparison</code> · Publication commit: <code>ef907ebf8370</code> · <a href="./config/benchmark-results.json">Machine-readable results and provenance</a></sub></p>
```

**依据 3 · 作者声明**：[SKILL.md:85-117](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/5200420c1992508a2d69952b9f02babf232a21ac/SKILL.md#L85-L117)

重入凭据和host decision

<details>
<summary>查看原文（33行）</summary>

````text
For re-entry, inspect `runtime-summary.json ->
bounded_return_control.host_decision_contract`, infer the user's intent, and
write a structured host decision JSON file. Use the same `run_id`,
`bounded_reentry_token`, and stable `workspace_root`:

At a requirement stop, build `agent_skill_organization` directly from `agent_skill_organization_contract`; `preferred_payload` is incomplete until then, and the schema must not be learned through failed retries or runtime source inspection.
Use the same `REPO_ROOT` and `WORKSPACE_ROOT` from bootstrap:
```bash
DECISION_JSON="$WORKSPACE_ROOT/.vibeskills/tmp/host-decision.json"
mkdir -p "$(dirname "$DECISION_JSON")"

cat > "$DECISION_JSON" <<'JSON'
{
  "decision_kind": "approval_response",
  "decision_action": "approve_requirement",
  "approval_decision": "approve",
  "agent_skill_organization": {
    "schema_version": "agent_skill_organization_v1", "derived_by": "agent", "workflow_level": "L",
    "modules": [{"module_id": "module-a", "goal": "...", "candidate_skill_ids": ["skill-a"], "depends_on": [], "execution_mode": "skill_assigned", "acceptance_criteria": [{"criterion_id": "module-a-result", "description": "The module result satisfies the frozen requirement.", "verification_mode": "automated"}]}],
    "selected_skills": [{"skill_id": "skill-a", "module_ids": ["module-a"], "responsibility": "...", "reason": "..."}],
    "uncovered_modules": [],
    "workflow_level_contract": {"L": "smallest complete organization", "XL": "bounded multi-lane organization"}
  }
}
JSON

PYTHONPATH="$REPO_ROOT/apps/vgo-cli/src" py -3 -m vgo_cli.main canonical-entry \
  --repo-root "$REPO_ROOT" \
  --artifact-root "$WORKSPACE_ROOT" \
  --prompt "<current user task, verbatim>" \
  --continue-from-run-id "<source_run_id>" \
  --bounded-reentry-token "<reentry_token>" \
  --host-decision-json-file "$DECISION_JSON"
````

</details>

#### 缺口

- 评测原始记录未独立复算、当前提交跨宿主迁移和每次审批时间未知。
  **影响**：旧版作者结果不能抵扣当前流程负担，ROI仍未知。
  **进一步探讨**：回读固定publication原始配对数据复算，再对当前提交目标宿主测审批、恢复与资源投入。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否只保留最有用的治理而减少繁复证明？

**研究主题**：新假设与验证

#### 完整回答

由轻任务例外与阶段化重入推导未验证假设：对真实多Skill任务只冻结交付标准和模块依赖，proof只保留支持恢复与质量判断的字段，可能保留可追溯性而减少流程开销。相对增加更多Skill，增量是按风险缩减治理。对同一任务比较手选Skill、完整vibe和简化组织，核对合格交付率、人工确认时间、token及恢复次数；如果简化降低关键质量或完整流程已无额外负担，则否定缩减方向。

#### 证据与依据

**依据 1 · 作者声明**：[SKILL.md:14-16](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/5200420c1992508a2d69952b9f02babf232a21ac/SKILL.md#L14-L16)

轻任务例外

```text
Do not route every loosely related task into `vibe`. Lightweight questions,
single-command checks, or tasks better served by another explicitly requested
skill may proceed outside `vibe` unless the user explicitly invoked this entry.
```

**依据 2 · 作者声明**：[SKILL.md:139-142](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/5200420c1992508a2d69952b9f02babf232a21ac/SKILL.md#L139-L142)

模块组织与证据不应过量的契约

```text
After requirement approval, the Agent must split the approved work into modules, search every declared local skill root for each module, and read each retained candidate's `SKILL.md`. The host must, before entering `xl_plan`, put the validated result in `HostDecisionJson.agent_skill_organization`; route output may remain candidate audit evidence but cannot populate this field. If one selected Skill owns multiple modules, include one `module_assignments` entry per module with the exact module id, an `owner`, `support`, or `verifier` role, module-specific responsibility, one concrete write scope, expected outputs, and verification. Role order is executable: `support` runs before and feeds the `owner`; `verifier` runs only after the `owner`. A post-owner review or minimality check must use `verifier`, not `support`. An `agent_direct` module must declare its own concrete `write_scope`, `expected_outputs`, and `verification`; the runtime must not replace them with a generic module label or restated goal. A task work scope must not claim canonical runtime artifacts such as `module-execution.json`; use a stable task-owned output scope or `no task-file writes` for read-only work. A plan revision that changes modules, Skills, roles, dependencies, write scopes, outputs, verification, or workflow level must resubmit the complete updated `agent_skill_organization`; `revision_delta` alone records text and does not mutate the frozen organization.
Use the directory name that directly contains the retained `SKILL.md` as the exact `skill_id` in both `candidate_skill_ids` and `selected_skills[].skill_id`. A displayed Skill name or frontmatter `name` is descriptive, not an execution identifier. A nested retained `SKILL.md` uses its own containing directory name. Resolve this from the candidate path before submission instead of learning the identifier through failed retries.
Module acceptance criteria must be satisfiable before canonical module-result re-entry. They must not require cleanup receipts, delivery acceptance, or completion-language permission, because canonical `phase_cleanup` creates those only after `module-execution.json` is accepted. Verify ordinary modules from their actual deliverables and normal command or test output. Do not invent task-specific hashes, receipts, ledgers, matrices, scans, or proof files solely to prove execution order, Skill use, or file scope. Only require an extra evidence artifact when the user or domain contract needs that artifact.
After plan approval, reuse the frozen `agent_skill_organization` for `plan_execute` and cleanup, and do not rerun procedural skill selection, silently add skills, or replace declared gaps unless the user revises the frozen requirement or plan. `stage_order` records dependency depth, not permission to run in parallel; L still emits one-unit sequential waves even when independent units share a dependency stage. XL may place at most two dependency-ready units in one wave, and nested or overlapping write scopes must remain serial.
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
