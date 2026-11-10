# VibeSkills

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[8af6e23](https://github.com/foryourhealth111-pixel/Vibe-Skills/tree/8af6e230d3db0f3022236e67632be6d8b9323bf0)

<!-- BEGIN META -->
[![GitHub ★ 3,807](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C807&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/foryourhealth111-pixel/Vibe-Skills)
<!-- END META -->

> **功能**：通过本地 Skill 候选审计、分阶段需求与计划、模块执行及交付验收组织复杂任务。

> **亮点**：将用户决策、Skill 组织、实际计划摘要和每模块验收结果连接起来，继续工作时能检查输入和依赖是否仍有效。[Q02](#research-q02) [Q03](#research-q03)

> **主要限制**：候选匹配、安装回执和启动证明分别覆盖不同事实。业务验收仍需审阅真实产物，且固定版本没有 DSH 原生接线证据。[Q01](#research-q01) [Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 什么任务适合交给 Vibe-Skills，能否作为原生 DSH 插件使用？](#detail-section-11)
  - [Q02 · 怎样把用户原文和批准绑定到运行，候选匹配能决定采用哪个 Skill 吗？](#detail-section-12)
  - [Q03 · 执行结果和检查点怎样绑定，能证明产物已满足业务验收吗？](#detail-section-13)
  - [Q04 · 公开安装会写入哪些位置，何时值得在隔离环境试用？](#detail-section-14)
  - [Q05 · 阶段确认与模块验收能减少返工，还是只增加审批和工件？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有多个本地 Skill 的开发者需在一个复杂任务中明确依赖、写入边界和可复核的结果。[Q01](#research-q01)

直接选择原生 Skill，手工记录计划、责任、产物与验收结果。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 分阶段任务组织 | 保存原文、计划、Skill 责任及验收项 | 需要能按阶段回到用户的宿主，候选不表示已执行 |
| 执行结果与续接 | 核对原计划、模块覆盖与依赖变化 | 启动与业务验收分开，真实产物需复核 |
| 独立 Skill 安装 | 使用回执、备份及归属记录管理本地安装 | 检查只证明安装文件，宿主兼容需另验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Python >=3.10 与运行时文件 | 入口需要 | 启动 canonical 或安装 CLI | 无法加载 |
| 能执行受控命令的已列宿主 | 治理流程需要 | 提交结构化决定和模块结果 | 回原生 Skill |
| 可读 Skill 根与可写任务工件目录 | 相应任务需要 | 查候选及保存运行状态 | 缩小范围或停止 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在独立 Skill 根核对安装回执 | 只证明已安装 |
| 执行 | 宿主交原文，用户核对边界后再批准 | 核对真实模块与写入范围 |
| 验收 | 用户或独立检查者核对真实输出 | 缺结果或内容错误时保留失败，不用运行收据代替 |
| 退出 | 用户保留任务产物并停止调用 | 回原生 Skill 与人工流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 安装空间与宿主资源未测 | 验证独立目录和入口 | 回执仅覆盖安装 |
| 持续使用 | 模型 token 与工具开销随任务变动 | 审查候选和批准边界 | 作者旧版评测不可直接外推 |
| 失败恢复 | 运行工件和备份空间未知 | 核对日志、依赖与交付 | 恢复和重做耗时未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 计划与验收 | 实际计划摘要和模块结果绑定 | 能否降低业务错误 |
| 可继续执行 | 局部 kernel 有输入及依赖检查 | 不同宿主断点恢复表现 |
| 安装与退出 | 安装事务和归属文件处理 | 当前机器实际写入及卸载结果 |

> **思考**：候选匹配、安装回执和启动证明分别覆盖不同事实。业务验收仍需审阅真实产物，且固定版本没有 DSH 原生接线证据。[Q01](#research-q01) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将用户决策、Skill 组织、实际计划摘要和每模块验收结果连接起来，继续工作时能检查输入和依赖是否仍有效。[Q02](#research-q02) [Q03](#research-q03)

候选证据、绑定和执行结果分层。局部 kernel 对任务输入、依赖和工作单元合同检查过期结果，安装器另有目标冲突和恢复状态。状态验证不替代内容独立复核。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

候选匹配、安装回执和启动证明分别覆盖不同事实。业务验收仍需审阅真实产物，且固定版本没有 DSH 原生接线证据。[Q01](#research-q01) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

在已列的宿主中选独立 Skill 根，仅用两模块的可丢弃任务核对原文、阶段停点和产物。计划、批准或结果不匹配时回原生流程，保留实际交付。安装回执与运行凭据分别验收。[Q01](#research-q01) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持宿主入口、计划绑定和安装事务。作者评测属于旧版本的特定设置，当前宿主运行与业务收益未验收。

- 已检查：作者 README、包清单、源码路径 pyproject.toml、SKILL.md、adapters/index.json、apps/vgo-cli/src/vgo_cli/main.py、packages/runtime-core/src/vgo_runtime/canonical_entry.py、packages/runtime-core/src/vgo_runtime/router_contract_runtime.py、packages/contracts/src/vgo_contracts/module_execution_contract.py、packages/runtime-core/src/vgo_runtime/kernel/loop.py、apps/vgo-cli/src/vgo_cli/commands.py、packages/installer-core/src/vgo_installer/simple_skill_installer.py、README.md、config/benchmark-results.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽核固定 Python 工作区、宿主登记、公开安装、canonical 重入和局部 kernel 复用。未覆盖各宿主所有桥接及捆绑 Skill。
- 下一步：只读源码核查，未执行安装、宿主、基准或用户任务。未验证 DSH 兼容。受控对照见 [Q05](#research-q05)。

**分析版本**

- **仓库**：[foryourhealth111-pixel/Vibe-Skills](https://github.com/foryourhealth111-pixel/Vibe-Skills)
- **版本号**：未声明（[固定提交 8af6e23](https://github.com/foryourhealth111-pixel/Vibe-Skills/tree/8af6e230d3db0f3022236e67632be6d8b9323bf0)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证方向是把保留的停点与实际会改变交付或写入边界的决策对应，通过同任务对照检验能否减少等待而不增加返工。[Q05](#research-q05)

只读源码核查，未执行安装、宿主、基准或用户任务。未验证 DSH 兼容。受控对照见 [Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1176 | 394142 | — | — | 1519541 |
| .js | source | 3 | 1620 | 1095 | 315 | — |
| .md | example | 8 | 1633 | — | — | 8919 |
| .ts | source | 1 | 158 | 74 | 71 | — |
| .md | test | 8 | 158 | — | — | 740 |

</details>

**活跃度**

[![Issue 未关闭 39](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=39&color=737b86&logo=github)](https://github.com/foryourhealth111-pixel/Vibe-Skills/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=23&color=737b86&logo=github)](https://github.com/foryourhealth111-pixel/Vibe-Skills/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/foryourhealth111-pixel/Vibe-Skills/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Vibe-Skills 对已使用本地 Skill 的 Agent 团队，在哪些环节提供可验证的任务组织增量，哪些机制仍依赖宿主和人工判断？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么任务适合交给 Vibe-Skills，能否作为原生 DSH 插件使用？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

适用人群是已有多个本地 Skill、经常要拆分多交付物并在不同会话继续工作的开发者或研究者。例子是从只读输入生成两个相互依赖的可复核输出，明确谁写、谁验收及失败后从哪一模块重做。直接使用原生 Skill 加人工计划也能达到结果，Vibe-Skills 的增量是把原文、确认、计划和交付状态组织成可检查的同一套工件。单条命令和轻量问题由入口文档明确留在流程外，额外确认对这类任务没有清楚收益。固定版本由 Skill 指令、Python CLI、安装器和运行时组成，适配清单中 Codex 用治理入口，Claude Code 和 OpenCode 有不同等级的桥接或预览支持。查阅适配登记与固定 Git 树未找到 DSH 适配项和 Cordis patch，因此当前可归为带 Skill 入口的工作流工具。宿主能读 SKILL.md 也不足以证明能完整执行 Python 入口、按阶段回到用户或验收产物。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:1-9](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/pyproject.toml#L1-L9)

Python 工作区项目名、版本和最低要求。

```text
[build-system]
requires = ["setuptools>=68", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "vibe-skills-workspace"
version = "4.1.2"
description = "Clean architecture workspace scaffold for Vibe-Skills"
requires-python = ">=3.10"
```

**依据 2 · 作者声明**：[SKILL.md:10-20](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/SKILL.md#L10-L20)

显式触发、复杂任务与轻量例外。

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

**依据 3 · 作者声明**：[SKILL.md:39-62](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/SKILL.md#L39-L62)

宿主将任务交给 Python canonical 入口并要求回读凭据。

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

**依据 4 · 源码核查**：[adapters/index.json:8-38](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/adapters/index.json#L8-L38)

Codex 的治理启动与生成入口。

<details>
<summary>查看原文（31行）</summary>

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
      },
      "default_target_root": {
        "env": "VIBE_AGENTS_HOME",
        "rel": ".agents",
        "kind": "shared-home"
      },
      "discoverable_entries": {
        "shared_source": "config/vibe-entry-surfaces.json",
        "authority_owner": "vibe",
        "projection_mode": "generated_wrapper_entries",
        "host_visible_surface": "commands"
      },
      "host_profile": "adapters/codex/host-profile.json",
      "settings_map": "adapters/codex/settings-map.json",
      "closure": "adapters/codex/closure.json",
      "manifest": "dist/host-codex/manifest.json"
```

</details>

**依据 5 · 源码核查**：[adapters/index.json:41-55](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/adapters/index.json#L41-L55)

Claude Code 采用另一种 managed bridge。

<details>
<summary>查看原文（15行）</summary>

```text
      "id": "claude-code",
      "status": "supported-with-constraints",
      "install_mode": "preview-guidance",
      "check_mode": "preview-guidance",
      "bootstrap_mode": "preview-guidance",
      "bootstrap_summary": "supported install/use path",
      "canonical_vibe": {
        "entry_mode": "bridged_runtime",
        "fallback_policy": "blocked",
        "proof_required": true,
        "allow_skill_doc_fallback": false,
        "launcher_kind": "managed_bridge",
        "supports_bounded_stop": true
      },
      "default_target_root": {
```

</details>

**依据 6 · 源码核查**：[adapters/index.json:164-178](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/adapters/index.json#L164-L178)

OpenCode 为预览适配，宿主支持不等价。

<details>
<summary>查看原文（15行）</summary>

```text
    {
      "id": "opencode",
      "status": "preview",
      "install_mode": "preview-guidance",
      "check_mode": "preview-guidance",
      "bootstrap_mode": "preview-guidance",
      "bootstrap_summary": "preview guidance adapter",
      "canonical_vibe": {
        "entry_mode": "bridged_runtime",
        "fallback_policy": "blocked",
        "proof_required": true,
        "allow_skill_doc_fallback": false,
        "launcher_kind": "managed_bridge",
        "supports_bounded_stop": true
      },
```

</details>

#### 缺口

- 没有目标宿主运行、重启后续接和 DSH 兼容记录。
  **影响**：不能按原生 DSH 插件或一套脚本覆盖所有宿主。
  **进一步探讨**：在已列宿主的隔离配置验收启动、用户重入和复核；若将来专门适配 DSH，应另查正式接线和权限映射。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 怎样把用户原文和批准绑定到运行，候选匹配能决定采用哪个 Skill 吗？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

入口约定分开工具仓库和用户工作区，把当前任务原文作为参数传入。CLI 声明原文、工作区与阶段参数，canonical 入口解析根、宿主和调用面后分流。对受限继续路径，运行时回读工作区的上一轮边界，核对入口许可、结构化决定或兼容的继续措辞，再检查源 run 与 token，修订必须有具体 delta。命令参数和本地状态能绑定请求，无法独立证明填写者就是终端用户，也无法阻止 Agent 走宿主的其他入口做同类动作。候选审计按模块筛能力和不适用项，每个公开 shortlist 最多前三，含依据。进入计划和执行需要 Agent 提交组织对象，运行时核对模块验收项、模式和所绑定 Skill 集合。一个 Skill 的目录名、实际职责与验收绑定应来自阅读原文后的决定，候选分数和启动证明只适合作为辅助。用户同意需求后仍应检查写入边界和依赖是否保留。

#### 证据与依据

**依据 1 · 作者声明**：[SKILL.md:22-38](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/SKILL.md#L22-L38)

任务原文、根目录和候选审计边界。

<details>
<summary>查看原文（17行）</summary>

```text
## Canonical Bootstrap

`vibe` is a host-syntax-neutral skill contract. Before canonical launch, do only the minimum needed to launch:

- Resolve `skill_root` and `workspace_root`.
- Pass the current user task verbatim as the task specification; unrelated chat history may be excluded. Do not summarize, rewrite, or reduce it to keywords. Preserve exact input paths, input immutability constraints, exact output roots, synthetic-data evidence boundaries, module dependencies and safe parallel boundaries, and acceptance criteria.

Do not search the current workspace, repository, or install root for canonical proof files before launch.
Do not inspect the repo, protocol docs, or prior run outputs before canonical launch returns.
Do not simulate stages, claim canonical entry from reading this file or wrapper text, or treat wrapper or AGENTS text as proof.
Do not manually create `outputs/runtime/vibe-sessions/<run-id>/`.
Do not use the Vibe installation root as the governed artifact root.

Local skill candidate audit: semantic owner `packages/runtime-core/src/vgo_runtime/router_contract_runtime.py`; compatibility bridge `scripts/router/resolve-pack-route.ps1`

The audit runs inside canonical `vibe` and exposes candidates for inspection. Include work type, domain/technology, deliverable, explicit constraints, and verified frozen facts on continuation. Its output is compatibility evidence only; the Agent owns skill choice, binding, and stage progression.

```

</details>

**依据 2 · 源码核查**：[apps/vgo-cli/src/vgo_cli/main.py:88-105](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/apps/vgo-cli/src/vgo_cli/main.py#L88-L105)

CLI 实际接受原文、根、阶段、用户决定和执行结果参数。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[packages/runtime-core/src/vgo_runtime/canonical_entry.py:2105-2132](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/runtime-core/src/vgo_runtime/canonical_entry.py#L2105-L2132)

运行时解析独立根和入口，可分流到本地 kernel。

<details>
<summary>查看原文（28行）</summary>

```text
    """Launch canonical vibe, verify its artifacts, and return launch metadata."""
    decision = resolve_entry_repo_root(repo_root, script_anchor=Path(__file__))
    repo_root_path = decision.repo_root
    resolved_workspace_root, resolved_artifact_root = _resolve_canonical_roots(
        repo_root_path,
        workspace_root=workspace_root,
        artifact_root=artifact_root,
    )
    resolved_host_id = resolve_host_id(host_id)
    requested_entry_id = _normalize_requested_entry_id(entry_id)
    runtime_entry_id = _runtime_entry_id_for_requested_entry(requested_entry_id)
    requested_stage_stop_seed = _seed_requested_stage_stop(requested_entry_id, requested_stage_stop)
    if local_agent_root is not None:
        return _launch_local_agent_kernel(
            repo_root=repo_root_path,
            workspace_root=resolved_workspace_root,
            host_id=resolved_host_id,
            entry_id=runtime_entry_id,
            prompt=prompt,
            requested_stage_stop=requested_stage_stop_seed,
            requested_grade_floor=requested_grade_floor,
            run_id=run_id,
            artifact_root=resolved_artifact_root,
            local_agent_root=local_agent_root,
            summary_source="explicit local agent root delegation",
            host_decision=host_decision,
        )
    auto_local_agent_root = _auto_local_agent_root_candidate(
```

</details>

**依据 4 · 源码核查**：[packages/runtime-core/src/vgo_runtime/canonical_entry.py:1348-1377](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/runtime-core/src/vgo_runtime/canonical_entry.py#L1348-L1377)

拒绝畸形状态、未获许可的入口和不合约的继续决定。

<details>
<summary>查看原文（30行）</summary>

```text
    if bool(prior_guard.get("malformed")):
        if explicit_reentry_credentials_supplied or fallback_prompt_reentry or host_decision is not None:
            raise RuntimeError(
                "bounded wrapper continuation metadata is malformed; rerun the prior bounded wrapper stage before re-entering"
            )
        return None
    if entry_id not in set(prior_guard["allowed_followup_entry_ids"]):
        if explicit_reentry_credentials_supplied:
            allowed = sorted(str(item) for item in prior_guard["allowed_followup_entry_ids"])
            raise RuntimeError(
                f"bounded wrapper continuation entry_id {entry_id!r} is not allowed; "
                f"expected one of {allowed}"
            )
        return None
    structured_reentry_action = _structured_host_decision_reentry_action(
        host_decision,
        bounded_return_control=prior_guard,
    )
    structured_reentry = structured_reentry_action is not None
    if host_decision is not None:
        looks_like_reentry = structured_reentry
    else:
        looks_like_reentry = fallback_prompt_reentry
    if not looks_like_reentry:
        if explicit_reentry_credentials_supplied:
            expected_stage = str(prior_guard.get("terminal_stage") or "pending_bounded_stop")
            if host_decision is not None:
                raise RuntimeError(
                    "structured host decision does not authorize bounded re-entry for "
                    f"{expected_stage}; send an explicit approval or revision decision for the pending governed stop"
```

</details>

**依据 5 · 源码核查**：[packages/runtime-core/src/vgo_runtime/canonical_entry.py:1384-1409](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/runtime-core/src/vgo_runtime/canonical_entry.py#L1384-L1409)

修订、源运行与 token 检查。

<details>
<summary>查看原文（26行）</summary>

```text
    revision_delta = _host_decision_revision_delta(host_decision)
    if structured_reentry_action == "revise" and not revision_delta:
        expected_stage = str(prior_guard.get("terminal_stage") or "pending_bounded_stop")
        raise RuntimeError(
            "structured revise decision for "
            f"{expected_stage} requires non-empty revision_delta"
        )

    if not provided_run_id or not provided_token:
        raise RuntimeError(
            "bounded wrapper continuation requires explicit re-entry credentials from the latest bounded run "
            f"({prior_guard['source_run_id']}); forward --continue-from-run-id and --bounded-reentry-token"
        )
    if provided_run_id != prior_guard["source_run_id"]:
        raise RuntimeError(
            "bounded wrapper continuation run mismatch; expected "
            f"{prior_guard['source_run_id']} but received {provided_run_id}"
        )
    if provided_token != prior_guard["reentry_token"]:
        raise RuntimeError("bounded wrapper continuation token mismatch")
    result = dict(prior_guard)
    if structured_reentry_action:
        result["structured_reentry_action"] = structured_reentry_action
        if structured_reentry_action == "revise":
            result["revision_target_stage"] = str(prior_guard.get("terminal_stage") or "").strip() or None
            result["revision_delta"] = revision_delta
```

</details>

**依据 6 · 源码核查**：[packages/runtime-core/src/vgo_runtime/router_contract_runtime.py:1302-1336](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/runtime-core/src/vgo_runtime/router_contract_runtime.py#L1302-L1336)

候选输出与按模块筛选及有限 shortlist。

<details>
<summary>查看原文（35行）</summary>

```text
def _public_module_candidate(module: dict[str, Any], row: dict[str, Any]) -> dict[str, Any]:
    return {
        "skill": str(row.get("skill") or ""),
        "score": float(row.get("score") or 0.0),
        "matched_capabilities": list(row.get("matched_capabilities") or []),
        "capability_evidence_level": row.get("capability_evidence_level"),
        "evidence": _module_candidate_evidence(module, row),
    }


def _build_module_candidates(
    scored_rows: list[dict[str, Any]],
    task_card: dict[str, Any],
    prompt_lower: str,
) -> list[dict[str, Any]]:
    module_candidates: list[dict[str, Any]] = []
    for module in task_card.get("modules") or []:
        rows = [
            row
            for row in scored_rows
            if not row.get("rejected_capabilities") and _row_matches_module(row, module)
        ]
        rows.sort(key=lambda row: _module_candidate_sort_key(module, row, prompt_lower))
        module_candidates.append(
            {
                "module_id": str(module.get("module_id") or ""),
                "label": str(module.get("label") or ""),
                "priority": str(module.get("priority") or ""),
                "prompt_position": module.get("prompt_position"),
                "required_capabilities": list(module.get("required_capabilities") or []),
                "candidate_rows": rows,
                "candidates": [_public_module_candidate(module, row) for row in rows[:3]],
            }
        )
    return module_candidates
```

</details>

**依据 7 · 源码核查**：[packages/runtime-core/src/vgo_runtime/canonical_entry.py:1986-2010](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/runtime-core/src/vgo_runtime/canonical_entry.py#L1986-L2010)

规划或执行前必须有组织对象及模块验收项。

<details>
<summary>查看原文（25行）</summary>

```text
    module_assignments = runtime_packet.get("module_assignments")
    if not isinstance(module_assignments, dict):
        raise RuntimeError("canonical truth packet missing module_assignments object")
    bound_skill_ids = _module_assignments_bound_skill_ids(runtime_packet)
    agent_organization = runtime_packet.get("agent_skill_organization")
    if agent_organization is None:
        if str(packet_requested_stop or "") in {"xl_plan", "plan_execute", "phase_cleanup"}:
            raise RuntimeError("canonical truth packet requires agent_skill_organization before planning or execution")
        if bound_skill_ids:
            raise RuntimeError("canonical truth packet cannot bind task skills before agent_skill_organization")
    elif not isinstance(agent_organization, dict):
        raise RuntimeError("canonical truth packet agent_skill_organization must be an object")
    else:
        modules = agent_organization.get("modules")
        if not isinstance(modules, list) or not modules:
            raise RuntimeError("canonical truth packet agent_skill_organization.modules must be a non-empty list")
        for module in modules:
            if not isinstance(module, dict):
                raise RuntimeError("canonical truth packet agent_skill_organization.modules must contain objects")
            module_id = str(module.get("module_id") or "").strip()
            criteria = module.get("acceptance_criteria")
            if not isinstance(criteria, list) or not criteria:
                raise RuntimeError(
                    f"canonical truth packet module {module_id} must include acceptance_criteria"
                )
```

</details>

**依据 8 · 源码核查**：[packages/runtime-core/src/vgo_runtime/canonical_entry.py:2024-2044](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/runtime-core/src/vgo_runtime/canonical_entry.py#L2024-L2044)

验收项合法性和绑定 Skill 集合核对。

<details>
<summary>查看原文（21行）</summary>

```text
                if criterion_id in criterion_ids:
                    raise RuntimeError(
                        f"canonical truth packet module {module_id} has duplicate acceptance criterion {criterion_id}"
                    )
                if verification_mode not in {"automated", "manual"}:
                    raise RuntimeError(
                        f"canonical truth packet module {module_id} acceptance criterion verification_mode must be automated or manual"
                    )
                criterion_ids.add(criterion_id)
        selected_rows = agent_organization.get("selected_skills")
        if not isinstance(selected_rows, list):
            raise RuntimeError("canonical truth packet agent_skill_organization.selected_skills must be a list")
        selected_skill_ids = sorted(
            {
                str(row.get("skill_id") or "").strip()
                for row in selected_rows
                if isinstance(row, dict) and str(row.get("skill_id") or "").strip()
            }
        )
        if selected_skill_ids != sorted(set(bound_skill_ids)):
            raise RuntimeError("canonical truth packet module_assignments must match agent_skill_organization selected skills")
```

</details>

#### 缺口

- 未模拟宿主错误标记批准、丢失原文及候选根冲突。
  **影响**：无法推断宿主转译、授权和当前配置的真实完整性。
  **进一步探讨**：在隔离宿主提交批准、修订、错误 token 和同名 Skill，核对阻止状态与真实计划。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 执行结果和检查点怎样绑定，能证明产物已满足业务验收吗？

**研究主题**：工程质量与复用、缺陷与关键质疑、功能与机制

#### 完整回答

从模块执行恢复走单独分支。调用方必须指定原 run，不能把用户批准 token 或 host decision 混进 Agent 结果回报。入口读取冻结任务、等待 Agent 的交接状态和提交结果，并按原 run 验证后进入 cleanup。合同对实际计划文件重算摘要，核对执行单位和模块 ID 精确覆盖、执行模式和验收项 ID、终态和声明。它可以识别过期计划或漏项。检查结果字段和绑定与独立复做业务验收是两个阶段，错误而格式正确的实验结果仍需看输出、测试和人工判断。局部 kernel 的复用路径还核对输入指纹、依赖输出指纹、旧与新工作单元的写入和验收合同，以及旧产物是否仍满足 readiness。发生依赖失效时下游不能只凭同名模块继续。该路径属于本地 kernel，不能泛化为跨任何宿主的事务恢复；启动收据与交付验收文件也是不同凭据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/runtime-core/src/vgo_runtime/canonical_entry.py:2294-2329](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/runtime-core/src/vgo_runtime/canonical_entry.py#L2294-L2329)

独立的 Agent 执行恢复入口，核对冻结任务、状态和原 run。

<details>
<summary>查看原文（36行）</summary>

```text
    source_run_id = str(continue_from_run_id or "").strip()
    if not source_run_id:
        raise RuntimeError("Agent execution re-entry requires --continue-from-run-id")
    if str(run_id or "").strip() not in {"", source_run_id}:
        raise RuntimeError("Agent execution re-entry must resume the source run")
    if bounded_reentry_token:
        raise RuntimeError("Agent execution re-entry does not accept a user approval token")
    if host_decision is not None:
        raise RuntimeError("Agent execution re-entry does not accept a host approval decision")

    session_root = _resolve_session_root(
        repo_root=repo_root,
        run_id=source_run_id,
        artifact_root=artifact_root,
    )
    runtime_packet = _load_runtime_truth_packet(session_root / "runtime-input-packet.json")
    workspace_root = resolve_execution_workspace(
        runtime_packet,
        requested_workspace_root=workspace_root if workspace_root_is_explicit else None,
        fallback_workspace_root=workspace_root,
    )
    frozen_task = str(runtime_packet.get("task") or "").strip()
    if not frozen_task:
        raise RuntimeError("Agent execution re-entry requires the frozen task from runtime-input-packet.json")
    handoff = _load_json_dict(session_root / "agent-execution-handoff.json", label="agent-execution-handoff")
    if handoff.get("status") != "agent_action_required" or handoff.get("control_owner") != "agent":
        raise RuntimeError("source run is not waiting for Agent execution results")

    submitted_path = Path(module_execution_json_file).expanduser().resolve()
    submitted = _load_json_dict(submitted_path, label="module-execution")
    _validate_agent_module_execution(
        session_root=session_root,
        source_run_id=source_run_id,
        handoff=handoff,
        submitted=submitted,
    )
```

</details>

**依据 2 · 源码核查**：[packages/runtime-core/src/vgo_runtime/canonical_entry.py:2344-2368](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/runtime-core/src/vgo_runtime/canonical_entry.py#L2344-L2368)

使用原 run 和冻结任务进入 cleanup。

<details>
<summary>查看原文（25行）</summary>

```text
    try:
        payload = invoke_vibe_runtime_entrypoint(
            repo_root=repo_root,
            host_id=host_id,
            entry_id=entry_id,
            prompt=frozen_task,
            requested_stage_stop="phase_cleanup",
            requested_grade_floor=requested_grade_floor,
            run_id=source_run_id,
            workspace_root=workspace_root,
            artifact_root=artifact_root,
            module_execution_json_file=submitted_path,
            host_decision=None,
            force_runtime_neutral=force_runtime_neutral,
        )
        return _finalize_canonical_launch_result(
            receipt=receipt,
            receipt_path=receipt_path,
            requested_entry_id=entry_id,
            requested_stage_stop=requested_stage_stop,
            effective_requested_stage_stop="phase_cleanup",
            effective_prompt=frozen_task,
            payload=payload,
            fallback_run_id=source_run_id,
            fallback_summary_path=session_root / "runtime-summary.json",
```

</details>

**依据 3 · 源码核查**：[packages/contracts/src/vgo_contracts/module_execution_contract.py:227-247](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/contracts/src/vgo_contracts/module_execution_contract.py#L227-L247)

实际计划字节哈希与完整单位列表绑定。

<details>
<summary>查看原文（21行）</summary>

```text
    plan_path = session_root / "module-work-plan.json"
    plan = _load_json_dict(plan_path, label="module-work-plan")
    if str(submitted.get("module_work_plan_digest") or "") != hashlib.sha256(plan_path.read_bytes()).hexdigest():
        raise RuntimeError("module execution does not match the approved module work plan digest")

    raw_submitted_units = submitted.get("units")
    if not isinstance(raw_submitted_units, list) or any(
        not isinstance(unit, dict) for unit in raw_submitted_units
    ):
        raise RuntimeError("module execution units must be a JSON array of objects")
    planned_units = {
        str(unit.get("unit_id") or ""): unit
        for unit in plan.get("work_units") or []
        if isinstance(unit, dict) and str(unit.get("unit_id") or "")
    }
    submitted_units = {
        str(unit.get("unit_id") or ""): unit
        for unit in raw_submitted_units
        if isinstance(unit, dict) and str(unit.get("unit_id") or "")
    }
    if set(submitted_units) != set(planned_units) or len(raw_submitted_units) != len(planned_units):
```

</details>

**依据 4 · 源码核查**：[packages/contracts/src/vgo_contracts/module_execution_contract.py:291-317](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/contracts/src/vgo_contracts/module_execution_contract.py#L291-L317)

精确模块集合和终态绑定。

<details>
<summary>查看原文（27行）</summary>

```text
    if set(submitted_modules) != set(planned_modules) or len(raw_submitted_modules) != len(planned_modules):
        raise RuntimeError("module execution modules must exactly match the approved plan")
    required_notes = module_required_binding_notes(list(planned_modules.values()), raw_submitted_modules)
    if required_notes:
        raise RuntimeError(required_notes[0])
    for module_id, planned_module in planned_modules.items():
        module = submitted_modules[module_id]
        for field in (
            "module_id",
            "required",
            "execution_mode",
            "gap_reason",
            "state",
            "criterion_results",
        ):
            if field not in module:
                raise RuntimeError(f"module execution module {module_id} is missing required field: {field}")
        if str(module.get("execution_mode") or "") != str(planned_module.get("execution_mode") or ""):
            raise RuntimeError(f"module execution module {module_id} changed its execution_mode binding")
        if module.get("gap_reason") != planned_module.get("gap_reason"):
            raise RuntimeError(f"module execution module {module_id} changed its gap_reason binding")
        if str(module.get("state") or "") not in {
            "completed",
            "failed",
            "blocked",
        }:
            raise RuntimeError(f"module execution module {module_id} is not terminal")
```

</details>

**依据 5 · 源码核查**：[packages/contracts/src/vgo_contracts/module_execution_contract.py:319-351](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/contracts/src/vgo_contracts/module_execution_contract.py#L319-L351)

校验验收项 ID 和申报状态。

<details>
<summary>查看原文（33行）</summary>

```text
        planned_criteria = [
            criterion
            for criterion in planned_module.get("acceptance_criteria") or []
            if isinstance(criterion, dict) and str(criterion.get("criterion_id") or "")
        ]
        criterion_results = module.get("criterion_results")
        if not isinstance(criterion_results, list) or any(
            not isinstance(result, dict) for result in criterion_results
        ):
            raise RuntimeError(
                f"module execution module {module_id} criterion_results must be a JSON array of objects"
            )
        planned_criterion_ids = [str(criterion["criterion_id"]) for criterion in planned_criteria]
        submitted_criterion_ids = [
            str(result.get("criterion_id") or "") for result in criterion_results
        ]
        if (
            set(submitted_criterion_ids) != set(planned_criterion_ids)
            or len(submitted_criterion_ids) != len(planned_criterion_ids)
        ):
            raise RuntimeError(
                f"module execution module {module_id} criterion results must exactly match the approved plan"
            )
        for result in criterion_results:
            criterion_id = str(result.get("criterion_id") or "")
            if "state" not in result:
                raise RuntimeError(
                    f"module execution criterion {module_id}:{criterion_id} is missing required field: state"
                )
            criterion_state = str(result.get("state") or "")
            if criterion_state not in {"passing", "failing", "blocked"}:
                raise RuntimeError(
                    f"module execution criterion {module_id}:{criterion_id} has unsupported state: {criterion_state}"
```

</details>

**依据 6 · 源码核查**：[packages/runtime-core/src/vgo_runtime/kernel/loop.py:544-574](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/runtime-core/src/vgo_runtime/kernel/loop.py#L544-L574)

复用须检查工作单元合同与输出 readiness。

<details>
<summary>查看原文（31行）</summary>

```text
def _can_reuse_previous_work(*, previous_work_unit: WorkUnit | None, current_work_unit: WorkUnit) -> bool:
    """Require unchanged execution contracts and valid skill fingerprints for checkpoint reuse."""
    if previous_work_unit is None:
        return False
    if current_work_unit.preferred_skill is not None:
        provenance = current_work_unit.selected_skill_provenance
        digests = (provenance.content_sha256, provenance.resource_sha256) if provenance is not None else ("",)
        if any(len(digest) != 64 or any(character not in "0123456789abcdef" for character in digest) for digest in digests):
            return False
    return (
        previous_work_unit.goal == current_work_unit.goal
        and previous_work_unit.expected_artifacts == current_work_unit.expected_artifacts
        and previous_work_unit.write_scope == current_work_unit.write_scope
        and previous_work_unit.binding_profile == current_work_unit.binding_profile
        and previous_work_unit.preferred_skill == current_work_unit.preferred_skill
        and previous_work_unit.selected_skill_provenance == current_work_unit.selected_skill_provenance
        and previous_work_unit.acceptance_criteria == current_work_unit.acceptance_criteria
        and previous_work_unit.depends_on == current_work_unit.depends_on
        and previous_work_unit.verification == current_work_unit.verification
        and previous_work_unit.task_verification == current_work_unit.task_verification
        and previous_work_unit.plan_hints == current_work_unit.plan_hints
        and previous_work_unit.verify_hints == current_work_unit.verify_hints
    )


def _completed_result_artifacts_are_current(result: WorkUnitResult, work_unit: WorkUnit) -> bool:
    return (
        result.work_unit_id == work_unit.id
        and bool(result.artifact_paths)
        and not completed_result_readiness_notes(result, work_unit=work_unit)
    )
```

</details>

**依据 7 · 源码核查**：[packages/runtime-core/src/vgo_runtime/kernel/loop.py:672-718](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/runtime-core/src/vgo_runtime/kernel/loop.py#L672-L718)

依赖结果指纹和任务输入阻止过期复用。

<details>
<summary>查看原文（47行）</summary>

```text
def _dependency_output_sha256(
    work_unit: WorkUnit,
    results_by_id: dict[str, WorkUnitResult],
    approved_work_units: dict[str, WorkUnit],
) -> str | None:
    dependencies: list[dict[str, object]] = []
    for dependency_id in work_unit.depends_on:
        result = results_by_id.get(dependency_id)
        approved_unit = approved_work_units.get(dependency_id)
        if result is None or approved_unit is None or not _completed_result_artifacts_are_current(result, approved_unit):
            return None
        dependencies.append({
            "work_unit_id": dependency_id,
            "artifacts": result.artifacts,
            "artifact_paths": result.artifact_paths,
            "artifact_sha256": result.artifact_sha256,
        })
    return _fingerprint({"schema_version": 1, "dependencies": dependencies})


def _reusable_completed_result(
    *,
    previous_work_unit: WorkUnit | None,
    current_work_unit: WorkUnit,
    previous_result: WorkUnitResult | None,
    task_input_sha256: str,
    reused_results_by_id: dict[str, WorkUnitResult],
    approved_work_units: dict[str, WorkUnit],
) -> WorkUnitResult | None:
    # A rerun prerequisite invalidates its dependents even if it recreates the same bytes.
    dependency_sha256 = _dependency_output_sha256(current_work_unit, reused_results_by_id, approved_work_units)
    if (
        previous_result is None
        or previous_work_unit is None
        or previous_result.work_unit_id != previous_work_unit.id
        or dependency_sha256 is None
        or previous_result.task_input_sha256 != task_input_sha256
        or previous_result.dependency_output_sha256 != dependency_sha256
        or not _can_reuse_previous_work(
            previous_work_unit=previous_work_unit,
            current_work_unit=current_work_unit,
        )
        or not previous_result.artifact_paths
        or completed_result_readiness_notes(previous_result, work_unit=current_work_unit)
    ):
        return None
    return previous_result
```

</details>

#### 缺口

- 未注入错误业务产物、错误依赖指纹和运行中断来验证完整链路。
  **影响**：不能给当前实现的端到端正确性或恢复成功率。
  **进一步探讨**：用同一审批计划分别提交旧计划哈希、错误验收 ID、内容错误但状态齐全的输出，再记录由哪一层拒绝。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 公开安装会写入哪些位置，何时值得在隔离环境试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

公开 CLI 的 install、check 和 uninstall 调用简单 Skill 安装器。安装目标是显式 Skill 根下的 vibe 目录，先验证目标路径并处理已有事务，无回执且非可恢复空目录时拒绝接管。安装把文件和回执变更写入事务记录，目标字节发生并发漂移会保留日志和备份供恢复。check 比对回执中的文件摘要并列出漂移和额外文件，不能代替宿主运行。卸载按拥有的相对路径处理，失败路径单独返回；业务交付所在工作区及工件的处置仍要由操作者核对。依赖 Python 3.10 以上、宿主有权限调用入口并访问指定 Skill 根，额外需要工作区可写、用户能确认关键边界。一次合格任务的代价包含安装和版本复查、模型和工具资源、阶段确认、产物核对和失败恢复。作者在 v4.1.0 的 SkillsBench 改设中报告 verifier 奖励高约 21.12 个百分点、token 少 29.6%、调用少 33.1%，收益和资源分别覆盖 82、81 个配对任务。其基线是 DeepSeekV4Flash-VE / OpenHands，报告与发布包版本及本轮未执行的宿主不同。试用可限已有 Codex 环境与独立 Skill 根，选一项可人工核对的多模块任务，退出时保留已验收产物，回原生 Skill 或人工计划。

#### 证据与依据

**依据 1 · 源码核查**：[apps/vgo-cli/src/vgo_cli/commands.py:150-179](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/apps/vgo-cli/src/vgo_cli/commands.py#L150-L179)

公开 CLI 使用简单安装器。

<details>
<summary>查看原文（30行）</summary>

```text
def install_command(args: argparse.Namespace) -> int:
    repo_root = Path(args.repo_root).resolve()
    skills_dir = _resolve_skills_dir(args.skills_dir)
    extend_workspace_package_path(repo_root)
    from vgo_installer.simple_skill_installer import install_vibe_skill

    try:
        receipt = install_vibe_skill(
            repo_root=repo_root,
            skills_dir=skills_dir,
            installed_at_utc=datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z'),
            **_install_source_kwargs(repo_root),
        )
    except (RuntimeError, OSError, ValueError) as exc:
        raise _installer_cli_error(exc) from exc
    print_json_payload(receipt)
    return 0


def uninstall_command(args: argparse.Namespace) -> int:
    repo_root = Path(args.repo_root).resolve()
    skills_dir = _resolve_skills_dir(args.skills_dir)
    extend_workspace_package_path(repo_root)
    from vgo_installer.simple_skill_installer import uninstall_vibe_skill

    try:
        result = uninstall_vibe_skill(skills_dir=skills_dir)
    except (RuntimeError, OSError, ValueError) as exc:
        raise _installer_cli_error(exc) from exc
    print_json_payload(result)
```

</details>

**依据 2 · 源码核查**：[packages/installer-core/src/vgo_installer/simple_skill_installer.py:2033-2049](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/installer-core/src/vgo_installer/simple_skill_installer.py#L2033-L2049)

目标根、路径检查和已有事务恢复。

<details>
<summary>查看原文（17行）</summary>

```text
    source_root = repo_root.resolve()
    resolved_skills_dir = skills_dir.resolve()
    install_root = resolved_skills_dir / "vibe"
    receipt_path = install_root / RECEIPT_RELPATH
    install_state_path = _install_state_path(resolved_skills_dir)
    uninstall_state_path = _uninstall_state_path(resolved_skills_dir)
    uninstall_completion_path = _uninstall_completion_path(resolved_skills_dir)
    _assert_install_root_is_local(resolved_skills_dir, install_root)
    _assert_install_destination_is_local(install_root, receipt_path)
    _recover_pending_install_transaction(
        skills_dir=resolved_skills_dir,
        install_root=install_root,
    )
    _validate_uninstall_completion(
        uninstall_completion_path,
        skills_dir=resolved_skills_dir,
        install_root=install_root,
```

</details>

**依据 3 · 源码核查**：[packages/installer-core/src/vgo_installer/simple_skill_installer.py:2067-2088](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/installer-core/src/vgo_installer/simple_skill_installer.py#L2067-L2088)

拒绝接管无回执既有目录，核对路径。

<details>
<summary>查看原文（22行）</summary>

```text
    has_receipt = receipt_path.is_file()
    has_uninstall_state = uninstall_state_path.is_file()
    if has_uninstall_state and not has_receipt:
        _read_uninstall_state(
            uninstall_state_path,
            skills_dir=resolved_skills_dir,
            install_root=install_root,
        )
    if (
        install_root.exists()
        and not has_receipt
        and not has_uninstall_state
        and not _is_recoverable_empty_install_root(install_root)
    ):
        raise RuntimeError(f"Install root already exists without a Vibe install receipt: {install_root}")

    governance_path = source_root / "config" / "version-governance.json"
    next_owned: list[str] = []
    for relpath in _package_file_relpaths(source_root):
        destination = install_root / relpath
        _assert_install_destination_is_local(install_root, destination)
        next_owned.append(_canonical_owned_relpath(relpath, artifact_path=governance_path, label="package"))
```

</details>

**依据 4 · 源码核查**：[packages/installer-core/src/vgo_installer/simple_skill_installer.py:2232-2259](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/installer-core/src/vgo_installer/simple_skill_installer.py#L2232-L2259)

记录事务并保留漂移冲突恢复材料。

<details>
<summary>查看原文（28行）</summary>

```text
    changes = [*payload_changes, receipt_change]

    try:
        install_state = _build_install_state(
            skills_dir=resolved_skills_dir,
            install_root=install_root,
            transaction_id=transaction_id,
            changes=changes,
        )
        _write_json(install_state_path, install_state)
    except BaseException:
        _recover_install_transaction(
            state_path=install_state_path,
            skills_dir=resolved_skills_dir,
            install_root=install_root,
        )
        raise

    try:
        _apply_install_file_changes(changes)
    except _InstallDestinationDriftError as exc:
        install_state["status"] = INSTALL_STATE_CONFLICTED
        install_state["conflicted_relpath"] = exc.relpath
        _write_json(install_state_path, install_state)
        raise RuntimeError(
            f"{exc}; transaction marked conflicted; "
            f"recovery journal and backups retained at {install_state_path}"
        ) from exc
```

</details>

**依据 5 · 源码核查**：[packages/installer-core/src/vgo_installer/simple_skill_installer.py:2293-2322](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/installer-core/src/vgo_installer/simple_skill_installer.py#L2293-L2322)

安装检查只核回执、文件和摘要。

<details>
<summary>查看原文（30行）</summary>

```text
    if not receipt_path.is_file():
        return _scoped_check_result({"ok": False, "missing_receipt": str(receipt_path)})

    receipt = _read_install_receipt(
        receipt_path,
        skills_dir=resolved_skills_dir,
        install_root=install_root,
    )
    entries = cast(list[dict[str, str]], receipt["files"])
    missing_files: list[str] = []
    drifted_files: list[str] = []
    receipt_files: set[str] = set()
    for entry in entries:
        relpath = entry["path"]
        receipt_files.add(relpath)
        expected_sha = entry["sha256"]
        file_path = _owned_file_path(install_root, relpath)
        if _path_is_link_or_reparse_point(file_path):
            drifted_files.append(relpath)
            continue
        if not file_path.is_file():
            missing_files.append(relpath)
            continue
        try:
            actual_sha = _sha256_file(file_path)
        except _FileChangedDuringReadError:
            drifted_files.append(relpath)
            continue
        if actual_sha != expected_sha:
            drifted_files.append(relpath)
```

</details>

**依据 6 · 源码核查**：[packages/installer-core/src/vgo_installer/simple_skill_installer.py:2380-2413](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/installer-core/src/vgo_installer/simple_skill_installer.py#L2380-L2413)

卸载按拥有路径操作，保留失败状态。

<details>
<summary>查看原文（34行）</summary>

```text
def _remove_owned_files(
    install_root: Path,
    entries: list[dict[str, str]],
) -> tuple[list[str], list[str], list[str], list[str]]:
    removed_files: list[str] = []
    failed_files: list[str] = []
    permission_denied_files: list[str] = []
    unavailable_files: list[str] = []
    for entry in entries:
        relpath = entry["path"]
        file_path = _owned_file_path(install_root, relpath)
        try:
            file_status = file_path.stat(follow_symlinks=False)
        except FileNotFoundError:
            continue
        is_link = _is_link_or_reparse_point(file_status)
        if not is_link and not stat.S_ISREG(file_status.st_mode):
            continue
        try:
            if is_link and stat.S_ISDIR(file_status.st_mode) and not stat.S_ISLNK(
                file_status.st_mode
            ):
                file_path.rmdir()
            else:
                file_path.unlink()
        except OSError as exc:
            failed_files.append(relpath)
            if isinstance(exc, PermissionError):
                permission_denied_files.append(relpath)
            if isinstance(exc, TimeoutError):
                unavailable_files.append(relpath)
        else:
            removed_files.append(relpath)
    return removed_files, failed_files, permission_denied_files, unavailable_files
```

</details>

**依据 7 · 作者声明**：[README.md:52-59](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/README.md#L52-L59)

作者的 v4.1.0 对照设置与结果。

```text
**SkillsBench** is a benchmark designed to evaluate whether AI agents can effectively use Skills to complete professional tasks across diverse domains. Its purpose is to measure how much a model’s ability to solve complex real-world tasks improves when it is equipped with specialized Skills.

To evaluate performance in production-like environments where a large number of Skills are installed simultaneously, we adapted SkillsBench into a more realistic **large-scale multi-Skill setting**. In the original SkillsBench setup, each task is provided only with the specialized Skill associated with that task. In our modified setting, every task is evaluated in a global environment containing all **195 specialized Skills**, while all other experimental conditions remain unchanged. This setting is intended to assess whether an agent can autonomously discover, select, and orchestrate the relevant Skills from a large installed Skill pool, and organize them into an effective workflow for completing complex tasks.

**vibeskills v4.1.0** was benchmarked on **SkillsBench** (https://www.skillsbench.ai/) using **DeepSeekV4Flash-VE** and **OpenHands** as the baseline evaluation setup. Compared with the baseline without vibeskills, vibeskills increased the **mean verifier reward by 21.12 percentage points**, while reducing **token consumption by 29.6%** and **tool calls by 33.1%**.


<p align="center"><sub>Analysis: 82 paired reward tasks · 81 paired resource tasks · Study: <code>full-skills-comparison</code> · Publication commit: <code>ef907ebf8370</code> · <a href="./config/benchmark-results.json">Machine-readable results and provenance</a></sub></p>
```

**依据 8 · 作者声明**：[config/benchmark-results.json:18-39](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/config/benchmark-results.json#L18-L39)

作者记录的两个配对样本及汇总数据。

<details>
<summary>查看原文（22行）</summary>

```text
  "analysis": {
    "paired_reward_tasks": 82,
    "paired_resource_tasks": 81,
    "bootstrap_seed": 20260829,
    "bootstrap_draws": 50000
  },
  "headline_results": {
    "native_mean_reward": 0.5028414634146342,
    "lean_vibe_mean_reward": 0.7140243902439024,
    "mean_reward_difference": 0.21118292682926829,
    "mean_reward_difference_ci_95": [
      0.10142682926829269,
      0.3225609756097561
    ],
    "native_full_score_tasks": 39,
    "lean_vibe_full_score_tasks": 57,
    "native_total_tokens": 491121515,
    "lean_vibe_total_tokens": 345756095,
    "token_reduction": 0.29598666635486337,
    "native_tool_calls": 9954,
    "lean_vibe_tool_calls": 6664,
    "tool_call_reduction": 0.3305203938115331
```

</details>

#### 缺口

- 未核查作者实验的独立重跑，也未测试本固定版本的宿主安装与卸载。
  **影响**：无法估计单个真实任务节时、成本、可恢复性或外推到 DSH。
  **进一步探讨**：在隔离环境分别测首次启动、继续同一任务、禁用后恢复和每个合格交付的总时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 阶段确认与模块验收能减少返工，还是只增加审批和工件？

**研究主题**：新假设与验证

#### 完整回答

待检验的方向是在相同 Agent 和 Skill 库下，只对会改变写入范围、依赖或验收的决策保留明确停点。现有入口已经允许轻量任务绕开整套流程，且会对具体修订重新冻结。可将常见项目分成有无高影响决策的任务组，对照原生 Skill 加人工计划、现有完整治理、只保留高影响停点的原型。三组用相同模型、文件快照、权限、交付条件和独立复核，测一次完整交付的人工确认时间、token、返工和遗漏的高影响决策。作者的 82 项配对奖励结果可以作为为什么要对比质量和成本的参考，但不能直接判定是哪一个阶段产生效果。若简化后出现更多超范围写入或返工，或完整治理本身未减少返工，相关假设即不成立。

#### 证据与依据

**依据 1 · 作者声明**：[SKILL.md:12-20](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/SKILL.md#L12-L20)

现有流程已区分轻量例外。

```text
Enter canonical `vibe` before ordinary execution when the user explicitly invokes `$vibe`, `/vibe`, or the `vibe` skill, or when the host intentionally chooses governed requirement/plan/execution closure for a complex task.

Do not route every loosely related task into `vibe`. Lightweight questions,
single-command checks, or tasks better served by another explicitly requested
skill may proceed outside `vibe` unless the user explicitly invoked this entry.

Installed-copy updates use `update --skills-dir <skills-dir>` on the same managed directory.

User instructions, including CLAUDE.md, GEMINI.md, AGENTS.md and direct workflow limits such as TDD exceptions, remain highest priority. Preserve canonical launch and proof rules within those limits.
```

**依据 2 · 源码核查**：[packages/runtime-core/src/vgo_runtime/canonical_entry.py:1384-1409](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/packages/runtime-core/src/vgo_runtime/canonical_entry.py#L1384-L1409)

修订与批准已有不同校验分支。

<details>
<summary>查看原文（26行）</summary>

```text
    revision_delta = _host_decision_revision_delta(host_decision)
    if structured_reentry_action == "revise" and not revision_delta:
        expected_stage = str(prior_guard.get("terminal_stage") or "pending_bounded_stop")
        raise RuntimeError(
            "structured revise decision for "
            f"{expected_stage} requires non-empty revision_delta"
        )

    if not provided_run_id or not provided_token:
        raise RuntimeError(
            "bounded wrapper continuation requires explicit re-entry credentials from the latest bounded run "
            f"({prior_guard['source_run_id']}); forward --continue-from-run-id and --bounded-reentry-token"
        )
    if provided_run_id != prior_guard["source_run_id"]:
        raise RuntimeError(
            "bounded wrapper continuation run mismatch; expected "
            f"{prior_guard['source_run_id']} but received {provided_run_id}"
        )
    if provided_token != prior_guard["reentry_token"]:
        raise RuntimeError("bounded wrapper continuation token mismatch")
    result = dict(prior_guard)
    if structured_reentry_action:
        result["structured_reentry_action"] = structured_reentry_action
        if structured_reentry_action == "revise":
            result["revision_target_stage"] = str(prior_guard.get("terminal_stage") or "").strip() or None
            result["revision_delta"] = revision_delta
```

</details>

**依据 3 · 作者声明**：[config/benchmark-results.json:18-39](https://github.com/foryourhealth111-pixel/Vibe-Skills/blob/8af6e230d3db0f3022236e67632be6d8b9323bf0/config/benchmark-results.json#L18-L39)

作者分开报告任务质量和资源。

<details>
<summary>查看原文（22行）</summary>

```text
  "analysis": {
    "paired_reward_tasks": 82,
    "paired_resource_tasks": 81,
    "bootstrap_seed": 20260829,
    "bootstrap_draws": 50000
  },
  "headline_results": {
    "native_mean_reward": 0.5028414634146342,
    "lean_vibe_mean_reward": 0.7140243902439024,
    "mean_reward_difference": 0.21118292682926829,
    "mean_reward_difference_ci_95": [
      0.10142682926829269,
      0.3225609756097561
    ],
    "native_full_score_tasks": 39,
    "lean_vibe_full_score_tasks": 57,
    "native_total_tokens": 491121515,
    "lean_vibe_total_tokens": 345756095,
    "token_reduction": 0.29598666635486337,
    "native_tool_calls": 9954,
    "lean_vibe_tool_calls": 6664,
    "tool_call_reduction": 0.3305203938115331
```

</details>

#### 缺口

- 没有对各阶段独立消融、同宿主可重复结果和决策错误数据。
  **影响**：无法确定要删掉或保留哪一段。
  **进一步探讨**：按任务风险分层做受控对照并记录无效审批和缺失决策。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
