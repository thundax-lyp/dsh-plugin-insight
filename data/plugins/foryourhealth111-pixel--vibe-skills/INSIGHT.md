# VibeSkills

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d881d9c](https://github.com/foryourhealth111-pixel/Vibe-Skills/tree/d881d9cd6b4a37186c447f7758e802d70c2b27ef)

<!-- BEGIN META -->
[![GitHub ★ 3,786](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C786&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/foryourhealth111-pixel/Vibe-Skills)
<!-- END META -->

> **功能**：通过候选 Skill 审计、分阶段需求计划与执行验收组织复杂任务。

> **亮点**：[Q02](#research-q02) 将任务原文、阶段和受限重入接入核心，[Q03](#research-q03) 将 Skill 候选与执行证明分开；组织机制不代表捆绑 Skill 内容原创。

> **主要限制**：[Q03](#research-q03) 的选择与启动证明不能替代真实模块交付验收；[Q05](#research-q05) 作者测评不能直接外推至当前版本和 DSH。

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
  - [Q01 · 谁需要多 Skill 治理，相对手选改变什么？](#detail-section-11)
  - [Q02 · 原任务与受限重入怎样接线？](#detail-section-12)
  - [Q03 · 选择和证明文件是否等于 Skill 的实际贡献？](#detail-section-13)
  - [Q04 · 安装和反复确认有什么成本及退路？](#detail-section-14)
  - [Q05 · 作者评测能否外推到当前固定版和 DSH？](#detail-section-15)
  - [Q06 · 能否按任务风险缩减治理而不降低交付质量？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向拥有多个本地 Skill 并需组织多步骤、多交付物的 Agent 用户。

用户和 Agent 可直接选择 Skill、手写计划和验收；本项目增加统一流程和持久阶段工件，也增加依赖和确认成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 本地 Skill 候选 | 审查适合模块的候选 | 候选不等于实际执行 |
| 阶段治理 | 冻结目标、计划和验收 | 需遵循用户授权及宿主约束 |
| 受限重入 | 关联前次状态和凭据 | 失配拒绝，实际恢复未测 |
| 验收记录 | 汇总工作结果 | 不替代专业交付物验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python 3.10+ 和核心目录 | 必需 | 安装与 canonical 入口 | 无法启动 |
| 兼容宿主与模型 | 必需 | 承载 Agent、选择和执行 | 无法完成工作流 |
| 可读 Skill 根与可写工作区 | 按任务 | 候选与过程工件 | 停止或直接执行 |
| 用户判断 | 关键边界 | 需求与决策确认 | 不能假造批准 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户检查宿主和 Skill 根 | 隔离试装 |
| 启动 | Agent 原文提交任务 | 获得真实入口和 session |
| 组织 | Agent 绑定模块及验收 | 按授权处理确认 |
| 执行 | Agent 逐项工作并记录 | 失败保留原因，检查交付 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | Python 与存储 | 配置 Skill 和宿主 | DSH 未验证 |
| 持续 | 模型和工具资源 | 候选审查、阶段决策 | 净节省未知 |
| 失败 | 重试和日志资源 | 检查状态与凭据 | 恢复时间未知 |
| 退出 | 保留工件的存储 | 回人工计划并核查交付 | 卸载流程未验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模块组织 | 入口与 Skill 绑定契约 | 选择是否最优 |
| 受限重入 | 核心有凭据校验 | 目标宿主恢复正确 |
| 效率 | 作者前版本评测 | 本版本与真实任务收益 |

> **思考**：[Q03](#research-q03) 的选择与启动证明不能替代真实模块交付验收；[Q05](#research-q05) 作者测评不能直接外推至当前版本和 DSH。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将任务原文、阶段和受限重入接入核心，[Q03](#research-q03) 将 Skill 候选与执行证明分开；组织机制不代表捆绑 Skill 内容原创。

[Q02](#research-q02) CLI 将任务与受限重入参数桥接 Python core；[Q03](#research-q03) 启动工件和执行结果需分开验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的选择与启动证明不能替代真实模块交付验收；[Q05](#research-q05) 作者测评不能直接外推至当前版本和 DSH。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先确认目标宿主、任务和授权边界；轻任务直接使用原生 Skill。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码静态分析，未安装、运行 canonical、重做评测或验证 DSH 兼容。

- 已检查：作者 README、包清单、源码路径 README.md、SKILL.md、pyproject.toml、install.sh、adapters/index.json、apps/vgo-cli/src/vgo_cli/main.py、apps/vgo-cli/src/vgo_cli/commands.py、apps/vgo-cli/src/vgo_cli/core_bridge.py、packages/runtime-core/src/vgo_runtime/canonical_entry.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态核查根 Skill、CLI、Python core 代表性重入分支及宿主适配目录；未运行目标项目，未穷举宿主或所有状态。inventory 的 JS/TS 统计不代表 Python 运行时代码总量。
- 下一步：在隔离宿主用固定任务验证安装、任务原文、批准、错误与正确凭据和模块交付；再比较人工流程成本与质量。

**分析版本**

- **仓库**：[foryourhealth111-pixel/Vibe-Skills](https://github.com/foryourhealth111-pixel/Vibe-Skills)
- **版本号**：未声明（[固定提交 d881d9c](https://github.com/foryourhealth111-pixel/Vibe-Skills/tree/d881d9cd6b4a37186c447f7758e802d70c2b27ef)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 在用户授权、保留验收条件下合并低风险非必要确认，需对照现有轻任务例外验证遗漏决策和成本。

在隔离宿主用固定任务验证安装、任务原文、批准、错误与正确凭据和模块交付；再比较人工流程成本与质量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1176 | 394127 | — | — | 1519423 |
| .js | source | 3 | 1620 | 1095 | 315 | — |
| .md | example | 8 | 1633 | — | — | 8919 |
| .ts | source | 1 | 158 | 74 | 71 | — |
| .md | test | 8 | 158 | — | — | 740 |

</details>

**活跃度**

[![Issue 未关闭 39](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=39&color=737b86&logo=github)](https://github.com/foryourhealth111-pixel/Vibe-Skills/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根项目的 Skill 组织、阶段确认、执行证明及适用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要多 Skill 治理，相对手选改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向拥有多个本地 Skill、任务跨多个交付物和验收步骤的使用者。原办法是 Agent 或用户直接选 Skill、手写计划和核验；本项目将需求冻结、候选审查、Skill 与工作单元绑定、执行和验收放入一个可恢复的阶段流程。优势是组织方法和状态工件，不是自带 Skill 内容或模型能力的原创；简单问题、单命令任务入口明确允许不使用 vibe，不能把全部任务自动纳入。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:301-310](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/README.md#L301-L310)

作者描述需求、级别、组织、执行与验收流程。

<details>
<summary>查看原文（10行）</summary>

```text
<p align="center">
  <img src="./docs/assets/vibeskills-harness-overview-en.svg" width="860" alt="VibeSkills confirms the requirement, chooses L or XL, organizes Skills, records the work, and checks the result; code work can enter a TDD loop">
</p>

<ol type="I">
  <li><strong>Confirms the requirement.</strong> Before work begins, it confirms the goal, constraints, available material, and expected delivery. The process stops here until the requirement is approved, giving the plan and final check a clear basis.</li>
  <li><strong>Recommends a level.</strong> VibeSkills recommends <code>L</code> or <code>XL</code> from the task's scope, steps, dependencies, and opportunities for parallel work. You then confirm the level. Manageable work proceeds in order; larger work is split more finely.</li>
  <li><strong>Organizes Skills.</strong> VibeSkills reviews the local Skill folders, selects the methods that fit each part, and states what each Skill owns, what it should deliver, and how completion will be checked.</li>
  <li><strong>Executes and records.</strong> After plan approval, the current Agent completes the work. Code tasks can use test-driven development (TDD) when appropriate: show the problem with a failing test, make the change, and run the tests again. Completed, failed, and blocked states are recorded so a later session can continue.</li>
  <li><strong>Checks the result.</strong> VibeSkills compares the actual result with every planned item. Required work that is incomplete, failed, or blocked prevents final acceptance.</li>
```

</details>

**依据 2 · 源码核查**：[SKILL.md:10-16](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/SKILL.md#L10-L16)

显式或复杂任务入口和轻任务例外。

```text
## Trigger Contract

Enter canonical `vibe` before ordinary execution when the user explicitly invokes `$vibe`, `/vibe`, or the `vibe` skill, or when the host intentionally chooses governed requirement/plan/execution closure for a complex task.

Do not route every loosely related task into `vibe`. Lightweight questions,
single-command checks, or tasks better served by another explicitly requested
skill may proceed outside `vibe` unless the user explicitly invoked this entry.
```

**依据 3 · 源码核查**：[SKILL.md:172-184](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/SKILL.md#L172-L184)

将选择绑定到模块、输出和检查。

<details>
<summary>查看原文（13行）</summary>

```text
## Skill Execution

The frozen `agent_skill_organization` is the only task-skill truth. Before plan
approval, disclose modules, candidates, selected skills and reasons, gaps, and the L / XL difference.

Organize each confirmed module as a verifiable work unit. Use declared Skill
outputs to identify ownership, `plan_hints` to shape the work steps, and
`verify_hints` to extend the module checks. Preserve explicit module
dependencies and keep `agent_direct` as the visible fallback for a module with
no suitable Skill. Every work unit must retain its intended outputs, checks,
binding reason, and dependency links in the existing WorkPlan. Each bound
assignment must project those fields and the selected Skill guidance into the
existing ModuleAssignments artifact.
```

</details>

#### 缺口

- 没有相同任务的人工流程对照
  **影响**：无法证明净收益或适合每个任务
  **进一步探讨**：用多个真实任务比较人工选 Skill 和该流程的交付质量与额外时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 原任务与受限重入怎样接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

入口要求把当前用户任务原文传入 canonical-entry，随后返回 session_root，读取启动 receipt、输入 packet、capsule 与 lineage；check 只证明本地安装，启动失败需报告 blocked。CLI 声明 prompt、artifact root、continue-from-run-id、reentry token 和决策参数，commands.py 将其传给 core_bridge，桥接导入 Python canonical_entry。core 在提供凭据但找不到对应运行或 token 不匹配时抛错；源码支持此错误边界，不代表已验证并发、所有阶段或恢复成功。入口区分 requirement_doc、xl_plan、phase_cleanup 的显式重入，并要求稍后用户消息；实际使用需服从用户与宿主更高优先级指令。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:22-31](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/SKILL.md#L22-L31)

按原文输入任务与禁止模拟启动。

<details>
<summary>查看原文（10行）</summary>

```text
## Canonical Bootstrap

`vibe` is a host-syntax-neutral skill contract. Before canonical launch, do only the minimum needed to launch:

- Resolve `skill_root` and `workspace_root`.
- Pass the current user task verbatim as the task specification; unrelated chat history may be excluded. Do not summarize, rewrite, or reduce it to keywords. Preserve exact input paths, input immutability constraints, exact output roots, synthetic-data evidence boundaries, module dependencies and safe parallel boundaries, and acceptance criteria.

Do not search the current workspace, repository, or install root for canonical proof files before launch.
Do not inspect the repo, protocol docs, or prior run outputs before canonical launch returns.
Do not simulate stages, claim canonical entry from reading this file or wrapper text, or treat wrapper or AGENTS text as proof.
```

</details>

**依据 2 · 源码核查**：[SKILL.md:39-62](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/SKILL.md#L39-L62)

canonical 启动、证明与失败处理。

<details>
<summary>查看原文（24行）</summary>

````text
Canonical entry command shape:

```powershell
$env:PYTHONPATH = "<skill_root>/apps/vgo-cli/src"
py -3 -m vgo_cli.main canonical-entry --repo-root "<skill_root>" --artifact-root "<workspace_root>" --prompt "<current user task, verbatim>"
```

For PowerShell, do not place `$env:PYTHONPATH=...` inside a double-quoted `-Command` string; host interpolation may corrupt it to `:PYTHONPATH`.

Bash-like hosts, including Claude Code, set `PYTHONPATH` in the outer shell and call Python directly. Try `py -3`, `python`, then `python3` according to availability.

```bash
REPO_ROOT='<skill_root>'
WORKSPACE_ROOT="${WORKSPACE_ROOT:-$PWD}"
PYTHONPATH="$REPO_ROOT/apps/vgo-cli/src" python -m vgo_cli.main canonical-entry --repo-root "$REPO_ROOT" --artifact-root "$WORKSPACE_ROOT" --prompt "<current user task, verbatim>"
```

`--host-id` and `--entry-id` remain compatibility-only for wrappers or older automation; omit them on a normal launch.

Only validate canonical proof artifacts after canonical-entry returns a `session_root`.
`check` proves `installed locally`; runtime coherence and delivery acceptance require their own evidence.
Proof of canonical launch is post-launch and requires: `host-launch-receipt.json`, `runtime-input-packet.json`, `governance-capsule.json`, and `stage-lineage.json` under the returned `session_root`.
`local-agent-kernel` follows the same proof rule. If it cannot produce those truth artifacts, it may produce local work scaffolds, but it must not be treated as `canonical verified`.
If canonical launch fails, report `blocked` with the concrete failure reason instead of simulating the missing stages or proof artifacts.
````

</details>

**依据 3 · 源码核查**：[SKILL.md:70-80](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/SKILL.md#L70-L80)

显式用户重入要求。

<details>
<summary>查看原文（11行）</summary>

```text
## Hard Stop And Re-entry

The progressive governed stops are `requirement_doc`, `xl_plan`, and `phase_cleanup`.

When `bounded_return_control.explicit_user_reentry_required = true`, stop the
current assistant turn. Do not consume re-entry credentials until a later user
message approves or revises the current boundary.

This is a hard runtime boundary, not a suggestion. It overrides ordinary host
autonomy rules such as "continue until done." A detailed original request is not
approval of the frozen requirement or frozen plan. After a hard stop, do not
```

</details>

**依据 4 · 源码核查**：[apps/vgo-cli/src/vgo_cli/main.py:88-106](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/apps/vgo-cli/src/vgo_cli/main.py#L88-L106)

CLI 参数和 handler。

<details>
<summary>查看原文（19行）</summary>

```text
    canonical_entry_parser = subparsers.add_parser('canonical-entry')
    canonical_entry_parser.add_argument('--repo-root', required=True)
    canonical_entry_parser.add_argument('--host-id', default=None, help=argparse.SUPPRESS)
    canonical_entry_parser.add_argument('--entry-id', default=None, help=argparse.SUPPRESS)
    canonical_entry_parser.add_argument('--prompt', required=True)
    canonical_entry_parser.add_argument('--requested-stage-stop')
    canonical_entry_parser.add_argument('--requested-grade-floor', choices=('L', 'XL'))
    canonical_entry_parser.add_argument('--run-id')
    canonical_entry_parser.add_argument('--workspace-root', help=argparse.SUPPRESS)
    canonical_entry_parser.add_argument('--artifact-root')
    canonical_entry_parser.add_argument('--local-agent-root')
    canonical_entry_parser.add_argument('--continue-from-run-id')
    canonical_entry_parser.add_argument('--bounded-reentry-token')
    canonical_entry_parser.add_argument('--module-execution-json-file')
    canonical_entry_parser.add_argument('--host-decision-json')
    canonical_entry_parser.add_argument('--host-decision-json-file')
    canonical_entry_parser.add_argument('--force-runtime-neutral', action='store_true')
    canonical_entry_parser.add_argument('--allow-public-grade-flags', nargs='?', const='true', help=argparse.SUPPRESS)
    canonical_entry_parser.set_defaults(handler=canonical_entry_command)
```

</details>

**依据 5 · 源码核查**：[apps/vgo-cli/src/vgo_cli/commands.py:368-404](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/apps/vgo-cli/src/vgo_cli/commands.py#L368-L404)

参数转发到 core。

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

**依据 6 · 源码核查**：[apps/vgo-cli/src/vgo_cli/core_bridge.py:32-36](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/apps/vgo-cli/src/vgo_cli/core_bridge.py#L32-L36)

Python canonical core 接线。

```text
def run_canonical_entry_core(repo_root: Path, argv: Sequence[str]) -> subprocess.CompletedProcess[str]:
    extend_workspace_package_path(repo_root)
    from vgo_runtime.canonical_entry import main as canonical_entry_main

    return invoke_python_core(canonical_entry_main, list(argv))
```

**依据 7 · 源码核查**：[packages/runtime-core/src/vgo_runtime/canonical_entry.py:1315-1326](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/packages/runtime-core/src/vgo_runtime/canonical_entry.py#L1315-L1326)

提供凭据却无 artifact root 时拒绝。

<details>
<summary>查看原文（12行）</summary>

```text
    bounded_reentry_token: str | None,
    host_decision: dict[str, Any] | None = None,
) -> dict[str, Any] | None:
    provided_run_id = str(continue_from_run_id or "").strip()
    provided_token = str(bounded_reentry_token or "").strip()
    explicit_reentry_credentials_supplied = bool(provided_run_id or provided_token)
    if artifact_root is None:
        if explicit_reentry_credentials_supplied:
            raise RuntimeError(
                "bounded wrapper continuation credentials were provided but no matching bounded run could be found; "
                "verify --continue-from-run-id, --bounded-reentry-token, and artifact root"
            )
```

</details>

**依据 8 · 源码核查**：[packages/runtime-core/src/vgo_runtime/canonical_entry.py:1395-1401](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/packages/runtime-core/src/vgo_runtime/canonical_entry.py#L1395-L1401)

重入 token 不匹配时失败。

```text
    if provided_run_id != prior_guard["source_run_id"]:
        raise RuntimeError(
            "bounded wrapper continuation run mismatch; expected "
            f"{prior_guard['source_run_id']} but received {provided_run_id}"
        )
    if provided_token != prior_guard["reentry_token"]:
        raise RuntimeError("bounded wrapper continuation token mismatch")
```

#### 缺口

- 未运行 canonical、并发或重入
  **影响**：不能证明本宿主阶段恢复完整可靠
  **进一步探讨**：在隔离工作区检查正确、错误与缺失凭据的边界。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 选择和证明文件是否等于 Skill 的实际贡献？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

本项目明确规定候选审计只给兼容性证据，Agent 决定选择和阶段；Skill 的选择、加载、规划、派发或普通 manifest 均不是贡献证明，完成仍需要可观察模块结果及模块验收。启动 proof 只能证明该入口按自身契约产生了文件，不能替代独立核查交付物满足任务标准，也不能单凭文件证明模型确实按 Skill 提示执行或交付正确。当前只核查代表性入口和条件，未穷举每种 host 或执行分支。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:29-37](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/SKILL.md#L29-L37)

候选审计与 Agent 决策责任。

```text
Do not search the current workspace, repository, or install root for canonical proof files before launch.
Do not inspect the repo, protocol docs, or prior run outputs before canonical launch returns.
Do not simulate stages, claim canonical entry from reading this file or wrapper text, or treat wrapper or AGENTS text as proof.
Do not manually create `outputs/runtime/vibe-sessions/<run-id>/`.
Do not use the Vibe installation root as the governed artifact root.

Local skill candidate audit: semantic owner `packages/runtime-core/src/vgo_runtime/router_contract_runtime.py`; compatibility bridge `scripts/router/resolve-pack-route.ps1`

The audit runs inside canonical `vibe` and exposes candidates for inspection. Include work type, domain/technology, deliverable, explicit constraints, and verified frozen facts on continuation. Its output is compatibility evidence only; the Agent owns skill choice, binding, and stage progression.
```

**依据 2 · 源码核查**：[SKILL.md:58-62](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/SKILL.md#L58-L62)

启动证明与安装检查区别。

```text
Only validate canonical proof artifacts after canonical-entry returns a `session_root`.
`check` proves `installed locally`; runtime coherence and delivery acceptance require their own evidence.
Proof of canonical launch is post-launch and requires: `host-launch-receipt.json`, `runtime-input-packet.json`, `governance-capsule.json`, and `stage-lineage.json` under the returned `session_root`.
`local-agent-kernel` follows the same proof rule. If it cannot produce those truth artifacts, it may produce local work scaffolds, but it must not be treated as `canonical verified`.
If canonical launch fails, report `blocked` with the concrete failure reason instead of simulating the missing stages or proof artifacts.
```

**依据 3 · 源码核查**：[SKILL.md:174-190](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/SKILL.md#L174-L190)

组织与实际贡献证明区别。

<details>
<summary>查看原文（17行）</summary>

```text
The frozen `agent_skill_organization` is the only task-skill truth. Before plan
approval, disclose modules, candidates, selected skills and reasons, gaps, and the L / XL difference.

Organize each confirmed module as a verifiable work unit. Use declared Skill
outputs to identify ownership, `plan_hints` to shape the work steps, and
`verify_hints` to extend the module checks. Preserve explicit module
dependencies and keep `agent_direct` as the visible fallback for a module with
no suitable Skill. Every work unit must retain its intended outputs, checks,
binding reason, and dependency links in the existing WorkPlan. Each bound
assignment must project those fields and the selected Skill guidance into the
existing ModuleAssignments artifact.

Only selected skills become module-bound execution units. The host must not
invent skills, promote route candidates, hide skill sessions, or open another
requirement/plan/runtime surface. Selection, loading, planning, dispatch, or a
generic manifest is not contribution proof; completion requires observable
module results and the module acceptance defined in `protocols/runtime.md`.
```

</details>

**依据 4 · 作者声明**：[README.md:305-310](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/README.md#L305-L310)

作者对实际结果与必需项验收的流程描述。

```text
<ol type="I">
  <li><strong>Confirms the requirement.</strong> Before work begins, it confirms the goal, constraints, available material, and expected delivery. The process stops here until the requirement is approved, giving the plan and final check a clear basis.</li>
  <li><strong>Recommends a level.</strong> VibeSkills recommends <code>L</code> or <code>XL</code> from the task's scope, steps, dependencies, and opportunities for parallel work. You then confirm the level. Manageable work proceeds in order; larger work is split more finely.</li>
  <li><strong>Organizes Skills.</strong> VibeSkills reviews the local Skill folders, selects the methods that fit each part, and states what each Skill owns, what it should deliver, and how completion will be checked.</li>
  <li><strong>Executes and records.</strong> After plan approval, the current Agent completes the work. Code tasks can use test-driven development (TDD) when appropriate: show the problem with a failing test, make the change, and run the tests again. Completed, failed, and blocked states are recorded so a later session can continue.</li>
  <li><strong>Checks the result.</strong> VibeSkills compares the actual result with every planned item. Required work that is incomplete, failed, or blocked prevents final acceptance.</li>
```

#### 缺口

- 未检查真实任务交付和全部分支
  **影响**：无法确认选择的 Skill 实际造成结果或验收标准充分
  **进一步探讨**：抽查模块结果、原始测试输出与所绑定验收条件。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装和反复确认有什么成本及退路？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

根项目 Python 要求 3.10 以上；install.sh 寻找 Python 并进入 vgo-cli install，CLI 及 core 均需保留。不同 host 适配状态不同，示例 Codex 标记 supported-with-constraints；没有核实 DSH 宿主是否具备同等接线，不能把收录目录当兼容证明。实际工作还需模型、可读 Skill 根、可写 artifact 工作区，以及用户对关键阶段的判断。首次安装配置、持续候选审计和确认、失败后检查 proof 与凭据、保留工作区再回手动计划均有人工和时间成本；不应因为项目文字要求某次确认而覆盖用户已授权的边界。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:5-9](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/pyproject.toml#L5-L9)

项目 Python 要求。

```text
[project]
name = "vibe-skills-workspace"
version = "4.1.1"
description = "Clean architecture workspace scaffold for Vibe-Skills"
requires-python = ">=3.10"
```

**依据 2 · 源码核查**：[install.sh:4-20](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/install.sh#L4-L20)

Python 检查与安装 CLI 调用。

<details>
<summary>查看原文（17行）</summary>

```text
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI_MAIN="${SCRIPT_DIR}/apps/vgo-cli/src/vgo_cli/main.py"
PYTHON_HELPERS_SH="${SCRIPT_DIR}/scripts/common/python_helpers.sh"
PYTHON_MIN_MAJOR=3
PYTHON_MIN_MINOR=10

source "${PYTHON_HELPERS_SH}"

PYTHON_BIN="$(pick_supported_python || true)"
if [[ -z "${PYTHON_BIN}" ]]; then
  print_python_requirement_error "vgo-cli shell install launcher"
  exit 1
fi

if [[ -f "${CLI_MAIN}" ]]; then
  export PYTHONPATH="${SCRIPT_DIR}/apps/vgo-cli/src${PYTHONPATH:+:${PYTHONPATH}}"
  exec "${PYTHON_BIN}" -m vgo_cli.main install --repo-root "${SCRIPT_DIR}" "$@"
```

</details>

**依据 3 · 源码核查**：[adapters/index.json:8-22](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/adapters/index.json#L8-L22)

Codex 示例的受限支持与证明要求。

<details>
<summary>查看原文（15行）</summary>

```text
  "adapters": [
    {
      "id": "codex",
      "status": "supported-with-constraints",
      "install_mode": "governed",
      "check_mode": "governed",
      "bootstrap_mode": "governed",
      "bootstrap_summary": "strongest governed lane",
      "canonical_vibe": {
        "entry_mode": "direct_runtime",
        "fallback_policy": "blocked",
        "proof_required": true,
        "allow_skill_doc_fallback": false,
        "launcher_kind": "native_command",
        "supports_bounded_stop": true
```

</details>

**依据 4 · 源码核查**：[SKILL.md:58-62](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/SKILL.md#L58-L62)

启动失败与证明边界。

```text
Only validate canonical proof artifacts after canonical-entry returns a `session_root`.
`check` proves `installed locally`; runtime coherence and delivery acceptance require their own evidence.
Proof of canonical launch is post-launch and requires: `host-launch-receipt.json`, `runtime-input-packet.json`, `governance-capsule.json`, and `stage-lineage.json` under the returned `session_root`.
`local-agent-kernel` follows the same proof rule. If it cannot produce those truth artifacts, it may produce local work scaffolds, but it must not be treated as `canonical verified`.
If canonical launch fails, report `blocked` with the concrete failure reason instead of simulating the missing stages or proof artifacts.
```

**依据 5 · 源码核查**：[SKILL.md:70-80](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/SKILL.md#L70-L80)

项目要求显式重入，需尊重更高优先级用户约束。

<details>
<summary>查看原文（11行）</summary>

```text
## Hard Stop And Re-entry

The progressive governed stops are `requirement_doc`, `xl_plan`, and `phase_cleanup`.

When `bounded_return_control.explicit_user_reentry_required = true`, stop the
current assistant turn. Do not consume re-entry credentials until a later user
message approves or revises the current boundary.

This is a hard runtime boundary, not a suggestion. It overrides ordinary host
autonomy rules such as "continue until done." A detailed original request is not
approval of the frozen requirement or frozen plan. After a hard stop, do not
```

</details>

#### 缺口

- 目标 DSH 安装、依赖、费用及恢复耗时未实测
  **影响**：无法保证部署成功或净节时
  **进一步探讨**：隔离 profile 试装并记录依赖、确认次数、恢复时间和费用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 作者评测能否外推到当前固定版和 DSH？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

作者报告的是 4.1.0、195 Skill 池、DeepSeekV4Flash-VE 与 OpenHands 的 SkillsBench 改造，82 对奖励任务及 81 对资源任务；指标包含平均 verifier reward、token 和工具调用。当前 checkout 的 pyproject 是 4.1.1，且本轮未复现该实验、检查任务质量或 DSH 行为，不能将百分比当成当前版、其他模型或用户任务收益。即使评测成立，指标也不等同于读者真实交付质量或总经济成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:50-59](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/README.md#L50-L59)

作者说明测评环境、版本、规模和效果。

<details>
<summary>查看原文（10行）</summary>

```text
</p>

**SkillsBench** is a benchmark designed to evaluate whether AI agents can effectively use Skills to complete professional tasks across diverse domains. Its purpose is to measure how much a model’s ability to solve complex real-world tasks improves when it is equipped with specialized Skills.

To evaluate performance in production-like environments where a large number of Skills are installed simultaneously, we adapted SkillsBench into a more realistic **large-scale multi-Skill setting**. In the original SkillsBench setup, each task is provided only with the specialized Skill associated with that task. In our modified setting, every task is evaluated in a global environment containing all **195 specialized Skills**, while all other experimental conditions remain unchanged. This setting is intended to assess whether an agent can autonomously discover, select, and orchestrate the relevant Skills from a large installed Skill pool, and organize them into an effective workflow for completing complex tasks.

**vibeskills v4.1.0** was benchmarked on **SkillsBench** (https://www.skillsbench.ai/) using **DeepSeekV4Flash-VE** and **OpenHands** as the baseline evaluation setup. Compared with the baseline without vibeskills, vibeskills increased the **mean verifier reward by 21.12 percentage points**, while reducing **token consumption by 29.6%** and **tool calls by 33.1%**.


<p align="center"><sub>Analysis: 82 paired reward tasks · 81 paired resource tasks · Study: <code>full-skills-comparison</code> · Publication commit: <code>ef907ebf8370</code> · <a href="./config/benchmark-results.json">Machine-readable results and provenance</a></sub></p>
```

</details>

**依据 2 · 源码核查**：[pyproject.toml:5-9](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/pyproject.toml#L5-L9)

当前工作区声明 4.1.1。

```text
[project]
name = "vibe-skills-workspace"
version = "4.1.1"
description = "Clean architecture workspace scaffold for Vibe-Skills"
requires-python = ">=3.10"
```

**依据 3 · 作者声明**：[README.md:383-396](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/README.md#L383-L396)

作者解释候选发现与模型上下文成本的区别。

<details>
<summary>查看原文（14行）</summary>

```text
<summary><strong>Will a large Skill library use a lot of tokens?</strong></summary>

VibeSkills checks the Skill folders you configure, but finding files locally
and placing their full contents in the model context are different operations.

Discovery and index generation happen locally. VibeSkills first extracts compact
information such as each Skill's name, description, intended use, and boundaries,
then uses that information to shortlist candidates for each part of the task.

Only retained candidates are then read as complete `SKILL.md` files. Execution
uses only the Skills written into the plan. Token usage therefore depends mainly
on how many candidates the task retains, how long those documents are, and how
complex the task is. It is not the same as reading the full local Skill library
into the model context.
```

</details>

#### 缺口

- 未复现实验、核验原始结果与 DSH
  **影响**：效果和成本无法直接迁移
  **进一步探讨**：固定模型、Skill 池及任务，重做基线并独立检查交付。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否按任务风险缩减治理而不降低交付质量？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有入口已经把轻问题与单命令排除，且 L 用最小完整组织；因此简单增加“低复杂度跳过”不是新贡献。未验证假设是对经用户授权的可逆低风险任务，在保留原目标、必要验收和失败记录条件下合并非必要确认；高风险或明确要求确认的动作保留边界。采用分层小样本，对照现有 L 和建议规则，记录无效确认、人工耗时、任务合格率与漏掉的用户决策；如果漏决策增加或时间收益不足则否定。当前既无实现也无安全分类可靠性证明，不计入已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:10-20](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/SKILL.md#L10-L20)

入口已有简单任务例外和用户指令优先。

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

**依据 2 · 源码核查**：[SKILL.md:138-146](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/SKILL.md#L138-L146)

L 顺序和计划确认后继续。

```text

After requirement approval, the Agent must split the approved work into modules, search every declared local skill root for each module, and read each retained candidate's `SKILL.md`. The host must, before entering `xl_plan`, put the validated result in `HostDecisionJson.agent_skill_organization`; route output may remain candidate audit evidence but cannot populate this field. If one selected Skill owns multiple modules, include one `module_assignments` entry per module with the exact module id, an `owner`, `support`, or `verifier` role, module-specific responsibility, one concrete write scope, expected outputs, and verification. Role order is executable: `support` runs before and feeds the `owner`; `verifier` runs only after the `owner`. A post-owner review or minimality check must use `verifier`, not `support`. An `agent_direct` module must declare its own concrete `write_scope`, `expected_outputs`, and `verification`; the runtime must not replace them with a generic module label or restated goal. A task work scope must not claim canonical runtime artifacts such as `module-execution.json`; use a stable task-owned output scope or `no task-file writes` for read-only work. A plan revision that changes modules, Skills, roles, dependencies, write scopes, outputs, verification, or workflow level must resubmit the complete updated `agent_skill_organization`; `revision_delta` alone records text and does not mutate the frozen organization.
Use the directory name that directly contains the retained `SKILL.md` as the exact `skill_id` in both `candidate_skill_ids` and `selected_skills[].skill_id`. A displayed Skill name or frontmatter `name` is descriptive, not an execution identifier. A nested retained `SKILL.md` uses its own containing directory name. Resolve this from the candidate path before submission instead of learning the identifier through failed retries.
Module acceptance criteria must be satisfiable before canonical module-result re-entry. They must not require cleanup receipts, delivery acceptance, or completion-language permission, because canonical `phase_cleanup` creates those only after `module-execution.json` is accepted. Verify ordinary modules from their actual deliverables and normal command or test output. Do not invent task-specific hashes, receipts, ledgers, matrices, scans, or proof files solely to prove execution order, Skill use, or file scope. Only require an extra evidence artifact when the user or domain contract needs that artifact.
After plan approval, reuse the frozen `agent_skill_organization` for `plan_execute` and cleanup, and do not rerun procedural skill selection, silently add skills, or replace declared gaps unless the user revises the frozen requirement or plan. `stage_order` records dependency depth, not permission to run in parallel; L still emits one-unit sequential waves even when independent units share a dependency stage. XL may place at most two dependency-ready units in one wave, and nested or overlapping write scopes must remain serial.

After the required plan confirmation, continue through dependency-ready work
without asking for routine permission between units. Give concise progress
updates at meaningful boundaries. If the user revises the agreed task, record
```

**依据 3 · 源码核查**：[SKILL.md:70-80](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/d881d9cd6b4a37186c447f7758e802d70c2b27ef/SKILL.md#L70-L80)

现有显式重入规则是对假设的重要反证。

<details>
<summary>查看原文（11行）</summary>

```text
## Hard Stop And Re-entry

The progressive governed stops are `requirement_doc`, `xl_plan`, and `phase_cleanup`.

When `bounded_return_control.explicit_user_reentry_required = true`, stop the
current assistant turn. Do not consume re-entry credentials until a later user
message approves or revises the current boundary.

This is a hard runtime boundary, not a suggestion. It overrides ordinary host
autonomy rules such as "continue until done." A detailed original request is not
approval of the frozen requirement or frozen plan. After a hard stop, do not
```

</details>

#### 缺口

- 没有风险分类器与实验
  **影响**：不能证明减少确认不会遗漏重要决定
  **进一步探讨**：人工标注可逆性和用户授权边界，比较两组过程与结果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
