# HOL Guard

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[2664e5a](https://github.com/hashgraph-online/hol-guard/tree/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20)

<!-- BEGIN META -->
[![GitHub ★ 1,038](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C038&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hashgraph-online/hol-guard)
<!-- END META -->

> **功能**：为 Agent 动作提供策略审查、审批、扫描和证据入口。

> **亮点**：[Q02](#research-q02) 统一不同宿主 verdict 映射及代表性失败拒绝；不等于所有入口被保护。

> **主要限制**：[Q03](#research-q03) DSH 格式扫描不证明 DSH 运行时拦截，post 钩子不能撤销已执行动作。

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
  - [Q01 · 谁需要 Guard，与宿主原生审批相比如何？](#detail-section-11)
  - [Q02 · Codex 钩子缺少运行时如何处理？](#detail-section-12)
  - [Q03 · 支持扫描 DSH 格式等于运行时保护吗？](#detail-section-13)
  - [Q04 · 策略、依赖和退出成本是什么？](#detail-section-14)
  - [Q05 · 怎样让保护状态反映真实覆盖？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要管理多个 Agent 和工具调用风险的开发者或团队。

宿主原生确认与代码/依赖扫描已能覆盖部分风险；Guard 组合策略和适配，增加配置和运维。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 预执行钩子 | 按策略拦截 | 宿主事件需实际接入 |
| 后执行反馈 | 记录违规 | 无法撤销 |
| 包格式扫描 | 静态检查 DSH 等 | 不证明运行时拦截 |
| 审批和记录 | 审查决策 | 误拦与恢复未测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 对应宿主钩子与 native runtime | 运行时保护需要 | 拦截事件 | 依适配器失败 |
| 本地策略与审批 | 保护需要 | 判断与授权 | 不得假定通过 |
| Guard Cloud | 可选 | 团队同步 | 可用本地流程 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选隔离宿主 | 检查钩子与版本 |
| 配置 | 用户审阅策略 | 明确允许/拒绝 |
| 验证 | 测代表工具前后事件 | 区分阻断与记录 |
| 退出 | 恢复宿主保护 | 核对记录与云状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | native runtime 与宿主 | 检查事件 | 未运行 |
| 持续 | 策略及可选云 | 处理审批和误拦 | 效果未知 |
| 失败 | 恢复工具与日志 | 查钩子状态 | post 不能撤销 |
| 退出 | 记录与配置 | 移除接入并核查 | 未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| Codex 钩子 | 代表路径缺 runtime 拒绝 | 全宿主真实覆盖 |
| DSH 扫描 | 识别包格式 | DSH 运行时阻断 |
| 后置事件 | 可报告违反 | 撤销已执行动作 |

> **思考**：[Q03](#research-q03) DSH 格式扫描不证明 DSH 运行时拦截，post 钩子不能撤销已执行动作。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 统一不同宿主 verdict 映射及代表性失败拒绝；不等于所有入口被保护。

[Q02](#research-q02) 区分宿主和事件的 verdict 传输，post 无法撤销。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) DSH 格式扫描不证明 DSH 运行时拦截，post 钩子不能撤销已执行动作。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 隔离验证实际钩子，不能以静态扫描代替执行覆盖。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根源码静态核查代表 Codex 桥及支持矩阵；未运行 native、宿主或扫描。

- 已检查：作者 README、包清单、源码路径 README.md、docs/guard/harness-support.md、src/codex_plugin_scanner/guard/adapters/codex_daemon_hook_bridge.py、src/codex_plugin_scanner/guard/cli/native_hook_exit_code.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根源码静态核查代表 Codex native bridge、退出码及支持矩阵；未运行宿主、native 或扫描。
- 下一步：隔离宿主测试缺 runtime、预执行拒绝、后执行记录和 DSH 接入覆盖。

**分析版本**

- **仓库**：[hashgraph-online/hol-guard](https://github.com/hashgraph-online/hol-guard)
- **版本号**：未声明（[固定提交 2664e5a](https://github.com/hashgraph-online/hol-guard/tree/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对每个宿主入口展示最近受控探针的阻断/记录/未知状态，须测覆盖与负担。

隔离宿主测试缺 runtime、预执行拒绝、后执行记录和 DSH 接入覆盖。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 368 | 35098 | — | — | 482653 |
| .ts | test | 248 | 43946 | 38577 | 2158 | — |
| .ts | source | 263 | 41095 | 35949 | 2029 | — |
| .mjs | source | 4 | 641 | 622 | 6 | — |
| .tsx | source | 285 | 62130 | 57383 | 1182 | — |
| .tsx | test | 66 | 9284 | 8325 | 320 | — |
| .ts | example | 3 | 303 | 282 | 3 | — |
| .md | example | 54 | 726 | — | — | 3461 |
| .cjs | source | 1 | 184 | 172 | 1 | — |
| .md | test | 13 | 642 | — | — | 6050 |
| .js | source | 30 | 81876 | 81782 | 7628 | — |
| .mjs | test | 1 | 120 | 111 | 5 | — |
| .js | example | 5 | 48 | 39 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/hashgraph-online/hol-guard/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根安全工具的代表性钩子、扫描和运行时覆盖边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要 Guard，与宿主原生审批相比如何？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向希望管理 Agent 命令、包与 MCP 风险的开发者或团队。宿主确认、代码审查及依赖扫描已能提供部分控制；Guard 组合策略、适配、审批和记录以支持多入口治理，不保证所有动作都经过它。作者将本地无账号和可选云同步分开，真实覆盖取决于宿主事件和安装。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:23-25](https://github.com/hashgraph-online/hol-guard/blob/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20/README.md#L23-L25)

作者描述本地策略和可选云。

```text
HOL Guard reviews agent actions before they run: shell commands, file access, package installs, and MCP tool calls. It detects secret exposure, destructive operations, prompt injection, and supply-chain risks, then allows, blocks, or requests approval according to your policy.

Run it locally without an account. Use the CLI and local dashboard to manage protection, resolve approvals, and inspect decision history. Optional [Guard Cloud](docs/guard/local-vs-cloud.md) adds shared history, team policy, and fleet management.
```

**依据 2 · 源码核查**：[README.md:58-69](https://github.com/hashgraph-online/hol-guard/blob/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20/README.md#L58-L69)

作者说明覆盖依赖宿主。

<details>
<summary>查看原文（12行）</summary>

```text
## What HOL Guard Protects

| Surface | Protection |
| :--- | :--- |
| **Shell commands and file access** | Reviews destructive operations, sensitive file access, credential exposure, and suspicious outbound commands. |
| **Package installs** | Evaluates supported package-manager operations against supply-chain intelligence before installation. |
| **Plugins, skills, and agent configuration** | Inventories local artifacts and reviews new or changed tools before launch. |
| **MCP servers and tools** | Inspects server configuration and reviews tool calls through supported hooks and managed proxies. |
| **Prompts and tool results** | Screens supported events for prompt injection and sensitive content. |
| **Approvals and evidence** | Routes decisions to native prompts or the approval center, and records local receipts for review. |

Guard connects through native agent hooks, managed MCP proxies, and launch integrations. Coverage depends on the events each agent exposes; the [support matrix](docs/guard/harness-support.md) documents enforcement, approval delivery, and failure behavior per integration.
```

</details>

**依据 3 · 源码核查**：[docs/guard/harness-support.md:26-35](https://github.com/hashgraph-online/hol-guard/blob/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20/docs/guard/harness-support.md#L26-L35)

具体 Codex 支持声明。

<details>
<summary>查看原文（10行）</summary>

```text
## Harness coverage


Current Guard support in this repo:

- `codex`
  - detects global and project `config.toml`
  - detects Guard-managed native hook entries in `.codex/config.toml` and migrates legacy `.codex/hooks.json` entries
  - parses configured MCP servers
  - installs Guard-owned Codex `PreToolUse` and `PermissionRequest` hooks as the authoritative complete-command boundary, so native shell commands can be denied before execution even when Codex itself is running in YOLO mode
```

</details>

#### 缺口

- 未与原生审批做真实任务对照
  **影响**：无法证明误拦和风险改善
  **进一步探讨**：隔离环境比较相同动作、审批和恢复负担。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Codex 钩子缺少运行时如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

代表性 Codex bridge 的 main 在非 desktop 分支检查 native 可执行及注册，缺失或注册失败走拒绝，再运行子进程；共享 exit-code 规范将未知 action 归入 review，针对不同宿主和事件映射不同进程状态。Codex 某些前置事件阻止以 JSON envelope 表达而退出码可为 0，不能只看进程状态称放行；PostToolUse 在执行后只能报告，不能撤销。此为特定分支而非所有宿主统一行为。

#### 证据与依据

**依据 1 · 源码核查**：[src/codex_plugin_scanner/guard/adapters/codex_daemon_hook_bridge.py:102-143](https://github.com/hashgraph-online/hol-guard/blob/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20/src/codex_plugin_scanner/guard/adapters/codex_daemon_hook_bridge.py#L102-L143)

检查 native 与注册后运行子进程。

<details>
<summary>查看原文（42行）</summary>

```text
def main(
    *,
    state_path: str | Path,
    fallback_command: Sequence[str],
    start_command: Sequence[str],
    query: str,
    hook_timeouts: Mapping[str, int],
    manifest_path: str | Path | None = None,
    config_json: str | None = None,
) -> int:
    """Run this hook call in the native bridge, or deny when there is no runtime."""

    state = Path(state_path)
    if _desktop_probe_lane():
        return _desktop_main(
            state=state,
            query=query,
            hook_timeouts=hook_timeouts,
            fallback_command=fallback_command,
            start_command=start_command,
            manifest_path=manifest_path,
            config_json=config_json,
        )
    native = _native_bridge_executable(state.parent)
    if native is None:
        return _deny_before_the_runtime_runs(_NATIVE_RUNTIME_MISSING_CODE)
    unauthenticated = _registration_failure(
        state_path=state,
        fallback_command=fallback_command,
        start_command=start_command,
        hook_timeouts=hook_timeouts,
        manifest_path=manifest_path,
        config_json=config_json,
    )
    if unauthenticated is not None:
        return _deny_before_the_runtime_runs(unauthenticated)
    sys.stdout.flush()
    # The child inherits this hook call's stdio, so it reads the hook body and
    # writes the response itself. ``exec`` would save the fork, but this entry
    # point is also called in process, where replacing the caller is wrong.
    try:
        return subprocess.run(
```

</details>

**依据 2 · 源码核查**：[src/codex_plugin_scanner/guard/cli/native_hook_exit_code.py:35-65](https://github.com/hashgraph-online/hol-guard/blob/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20/src/codex_plugin_scanner/guard/cli/native_hook_exit_code.py#L35-L65)

动作归一和宿主/事件退出码。

<details>
<summary>查看原文（31行）</summary>

```text

    ``policy_action`` is the resolved action (``"allow"``, ``"block"``,
    ``"review"``, ``"require-reapproval"``, ``"sandbox-required"``, …), not the
    wire ``decision`` string.  Callers pass ``"block"`` for the unavailable /
    fail-closed deny and the adapter's own contract decides the rc.

    An action outside the canonical lattice is not evidence of permission, so
    it is normalized to the review tier rather than falling through to the
    non-blocking exit code.
    """

    policy_action = normalize_guard_action(policy_action)
    blocking = policy_action in _BLOCKING_ACTIONS
    if harness == "grok":
        from ..adapters.grok_hooks import grok_hook_process_exit

        return grok_hook_process_exit(policy_action)
    if harness == "zcode":
        from ..adapters._modules.zcode.zcode_hooks import zcode_hook_process_exit

        return zcode_hook_process_exit(policy_action=policy_action, event_name=event_name)
    if harness in _RC_BLOCK_IS_TWO:
        return 2 if blocking else 0
    if harness in _RC_BLOCK_IS_ONE:
        return 1 if blocking else 0
    if harness in _RC_BLOCK_IS_ZERO_ENVELOPE:
        if not blocking or event_name in _PREEMPTIVE_EVENTS:
            return 0
        return 1
    # Unknown harness: fail safe on the exit status only for blocking verdicts.
    return 1 if blocking else 0
```

</details>

**依据 3 · 源码核查**：[docs/guard/harness-support.md:7-24](https://github.com/hashgraph-online/hol-guard/blob/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20/docs/guard/harness-support.md#L7-L24)

作者说明 envelope 和后置钩子。

<details>
<summary>查看原文（18行）</summary>

```text
## Hook verdict exit codes

`guard/cli/native_hook_exit_code.py::native_hook_verdict_exit_code` is the
authority for verdict exit codes, including `--json` responses. Emitters pass
the canonical harness, resolved policy action, and normalized hook event;
they do not maintain independent exit-code tables.

| Harness | Blocking verdict | Nonblocking verdict |
| --- | --- | --- |
| Codex, Claude Code, Copilot, Pi, OMP, Muse | `0` for `PreToolUse`, `UserPromptSubmit`, and `PermissionRequest`; the JSON envelope carries the denial. `1` for other events, including `PostToolUse`. | `0` |
| Cursor, Devin, Kimi, Hermes | `2` | `0` |
| OpenCode, Superagent | `1` | `0` |
| Grok, ZCode | Adapter-defined event/recording-mode behavior, through the shared authority. | Adapter-defined |
| Unknown harness | `1` | `0` |

Blocking actions are `review`, `require-reapproval`, `sandbox-required`, and
`block`. Missing event context does not imply that an envelope will be consumed.
`PostToolUse` reports a policy violation; it cannot undo an executed tool.
```

</details>

#### 缺口

- 未运行 Codex、native 或其他宿主
  **影响**：不能保证目标部署真实拦截
  **进一步探讨**：隔离宿主模拟缺 runtime、缺注册、阻止与 post 事件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 支持扫描 DSH 格式等于运行时保护吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

README 的 DSH 指的是插件扫描器识别 package.json、bundle 和 Cordis 导出；support matrix 的运行时钩子是按具体宿主列举。识别源码格式或产生扫描报告不证明 DSH 工具执行一定经过 Guard，也不保证其他宿主所有事件被拦截。仅当特定部署的 hook、代理、策略和后置结果逐项验证后才能说相应路径受保护。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:149-155](https://github.com/hashgraph-online/hol-guard/blob/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20/README.md#L149-L155)

作者说明扫描器识别生态。

```text
| `verify` | Install-surface and runtime readiness checks. |
| `submit` | A submission artifact for one plugin package. |
| `doctor` | Component diagnostics and troubleshooting bundles. |

The scanner detects Codex, Claude Code, DeepSeek Harness, Gemini CLI, Kimi Code, and OpenCode package formats. Use `plugin-scanner --list-ecosystems` to list them or `--ecosystem` to select one. At a Codex marketplace root, it discovers local plugin entries automatically.

Checks cover manifests, secrets, MCP transport and command configuration, approval defaults, skills, dependency lockfiles, and GitHub Actions permissions. Optional Cisco integrations add skill and MCP analysis. Reports support text, JSON, Markdown, and SARIF.
```

**依据 2 · 源码核查**：[README.md:226-241](https://github.com/hashgraph-online/hol-guard/blob/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20/README.md#L226-L241)

DSH 包格式及扫描示例。

<details>
<summary>查看原文（16行）</summary>

````text
## Ecosystem Support

| Ecosystem | Detection surfaces |
| :--- | :--- |
| Codex | `.codex-plugin/plugin.json`, `marketplace.json`, `.agents/plugins/marketplace.json` |
| Claude Code | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` |
| DeepSeek Harness | `package.json` with `dsh.bundle`, declared patches, and Cordis `apply(ctx)` exports, or `dsh.bundle.mode` set to `"patch"` for patch-only bundles |
| Gemini CLI | `gemini-extension.json`, `commands/**/*.toml` |
| Kimi Code | `kimi.plugin.json`, `.kimi-plugin/plugin.json`, declared skills, agents, commands, prompts, and MCP servers |
| OpenCode | `opencode.json`, `opencode.jsonc`, `.opencode/commands`, `.opencode/plugins` |

Use `--ecosystem auto` to detect supported packages in a repository, or select an ecosystem explicitly:

```bash
plugin-scanner scan ./plugins-repo --ecosystem claude
plugin-scanner scan ./dsh-plugin --ecosystem deepseek-harness
````

</details>

**依据 3 · 源码核查**：[docs/guard/harness-support.md:14-24](https://github.com/hashgraph-online/hol-guard/blob/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20/docs/guard/harness-support.md#L14-L24)

各宿主与事件的不同响应。

<details>
<summary>查看原文（11行）</summary>

```text
| Harness | Blocking verdict | Nonblocking verdict |
| --- | --- | --- |
| Codex, Claude Code, Copilot, Pi, OMP, Muse | `0` for `PreToolUse`, `UserPromptSubmit`, and `PermissionRequest`; the JSON envelope carries the denial. `1` for other events, including `PostToolUse`. | `0` |
| Cursor, Devin, Kimi, Hermes | `2` | `0` |
| OpenCode, Superagent | `1` | `0` |
| Grok, ZCode | Adapter-defined event/recording-mode behavior, through the shared authority. | Adapter-defined |
| Unknown harness | `1` | `0` |

Blocking actions are `review`, `require-reapproval`, `sandbox-required`, and
`block`. Missing event context does not imply that an envelope will be consumed.
`PostToolUse` reports a policy violation; it cannot undo an executed tool.
```

</details>

**依据 4 · 源码核查**：[docs/guard/harness-support.md:26-35](https://github.com/hashgraph-online/hol-guard/blob/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20/docs/guard/harness-support.md#L26-L35)

代表性运行时支持。

<details>
<summary>查看原文（10行）</summary>

```text
## Harness coverage


Current Guard support in this repo:

- `codex`
  - detects global and project `config.toml`
  - detects Guard-managed native hook entries in `.codex/config.toml` and migrates legacy `.codex/hooks.json` entries
  - parses configured MCP servers
  - installs Guard-owned Codex `PreToolUse` and `PermissionRequest` hooks as the authoritative complete-command boundary, so native shell commands can be denied before execution even when Codex itself is running in YOLO mode
```

</details>

#### 缺口

- 未穷举所有适配器和目标 DSH 接线
  **影响**：不能给完整运行时覆盖保证
  **进一步探讨**：按宿主列出实际工具事件与绕过路径，在隔离环境测试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 策略、依赖和退出成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

本地流程需兼容宿主、对应 native runtime、策略及审批界面；云同步是可选项，启用后需另核查数据与权限。首次要检查钩子安装及 fail 行为，持续需处理误拦、审批、日志与策略更新；失败时区分 pre 是否拦截和 post 是否仅记录。可退回宿主原生保护，但卸载适配、保留或删除记录及撤销云接入需要分别核对。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:23-25](https://github.com/hashgraph-online/hol-guard/blob/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20/README.md#L23-L25)

作者描述本地与可选云。

```text
HOL Guard reviews agent actions before they run: shell commands, file access, package installs, and MCP tool calls. It detects secret exposure, destructive operations, prompt injection, and supply-chain risks, then allows, blocks, or requests approval according to your policy.

Run it locally without an account. Use the CLI and local dashboard to manage protection, resolve approvals, and inspect decision history. Optional [Guard Cloud](docs/guard/local-vs-cloud.md) adds shared history, team policy, and fleet management.
```

**依据 2 · 源码核查**：[README.md:65-69](https://github.com/hashgraph-online/hol-guard/blob/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20/README.md#L65-L69)

作者说明覆盖依赖宿主。

```text
| **MCP servers and tools** | Inspects server configuration and reviews tool calls through supported hooks and managed proxies. |
| **Prompts and tool results** | Screens supported events for prompt injection and sensitive content. |
| **Approvals and evidence** | Routes decisions to native prompts or the approval center, and records local receipts for review. |

Guard connects through native agent hooks, managed MCP proxies, and launch integrations. Coverage depends on the events each agent exposes; the [support matrix](docs/guard/harness-support.md) documents enforcement, approval delivery, and failure behavior per integration.
```

**依据 3 · 源码核查**：[docs/guard/harness-support.md:14-24](https://github.com/hashgraph-online/hol-guard/blob/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20/docs/guard/harness-support.md#L14-L24)

不同事件拦截和 post 限制。

<details>
<summary>查看原文（11行）</summary>

```text
| Harness | Blocking verdict | Nonblocking verdict |
| --- | --- | --- |
| Codex, Claude Code, Copilot, Pi, OMP, Muse | `0` for `PreToolUse`, `UserPromptSubmit`, and `PermissionRequest`; the JSON envelope carries the denial. `1` for other events, including `PostToolUse`. | `0` |
| Cursor, Devin, Kimi, Hermes | `2` | `0` |
| OpenCode, Superagent | `1` | `0` |
| Grok, ZCode | Adapter-defined event/recording-mode behavior, through the shared authority. | Adapter-defined |
| Unknown harness | `1` | `0` |

Blocking actions are `review`, `require-reapproval`, `sandbox-required`, and
`block`. Missing event context does not imply that an envelope will be consumed.
`PostToolUse` reports a policy violation; it cannot undo an executed tool.
```

</details>

**依据 4 · 源码核查**：[src/codex_plugin_scanner/guard/adapters/codex_daemon_hook_bridge.py:112-137](https://github.com/hashgraph-online/hol-guard/blob/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20/src/codex_plugin_scanner/guard/adapters/codex_daemon_hook_bridge.py#L112-L137)

代表路径的缺失 runtime 拒绝。

<details>
<summary>查看原文（26行）</summary>

```text
    """Run this hook call in the native bridge, or deny when there is no runtime."""

    state = Path(state_path)
    if _desktop_probe_lane():
        return _desktop_main(
            state=state,
            query=query,
            hook_timeouts=hook_timeouts,
            fallback_command=fallback_command,
            start_command=start_command,
            manifest_path=manifest_path,
            config_json=config_json,
        )
    native = _native_bridge_executable(state.parent)
    if native is None:
        return _deny_before_the_runtime_runs(_NATIVE_RUNTIME_MISSING_CODE)
    unauthenticated = _registration_failure(
        state_path=state,
        fallback_command=fallback_command,
        start_command=start_command,
        hook_timeouts=hook_timeouts,
        manifest_path=manifest_path,
        config_json=config_json,
    )
    if unauthenticated is not None:
        return _deny_before_the_runtime_runs(unauthenticated)
```

</details>

#### 缺口

- 未测安装、误拦、恢复或实际费用
  **影响**：不能证明保护全面或负担可接受
  **进一步探讨**：隔离宿主测误拦、退出和日志保留。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样让保护状态反映真实覆盖？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有支持矩阵、native 缺失拒绝和 verdict 退出码；简单增加绿色状态或一次静态扫描不是新贡献。未验证方案是针对每个启用宿主和工具入口，记录最近一次无副作用的受控探针和版本，分别展示阻断、仅记录和未知，并在探针过期后标未知；不能用探针替代真实攻击覆盖。比较现有静态状态与该方案对漏接线发现率、误告警与维护时间；若不能改善发现率或带来不可接受干扰则否定。

#### 证据与依据

**依据 1 · 源码核查**：[docs/guard/harness-support.md:7-24](https://github.com/hashgraph-online/hol-guard/blob/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20/docs/guard/harness-support.md#L7-L24)

已有宿主和事件矩阵。

<details>
<summary>查看原文（18行）</summary>

```text
## Hook verdict exit codes

`guard/cli/native_hook_exit_code.py::native_hook_verdict_exit_code` is the
authority for verdict exit codes, including `--json` responses. Emitters pass
the canonical harness, resolved policy action, and normalized hook event;
they do not maintain independent exit-code tables.

| Harness | Blocking verdict | Nonblocking verdict |
| --- | --- | --- |
| Codex, Claude Code, Copilot, Pi, OMP, Muse | `0` for `PreToolUse`, `UserPromptSubmit`, and `PermissionRequest`; the JSON envelope carries the denial. `1` for other events, including `PostToolUse`. | `0` |
| Cursor, Devin, Kimi, Hermes | `2` | `0` |
| OpenCode, Superagent | `1` | `0` |
| Grok, ZCode | Adapter-defined event/recording-mode behavior, through the shared authority. | Adapter-defined |
| Unknown harness | `1` | `0` |

Blocking actions are `review`, `require-reapproval`, `sandbox-required`, and
`block`. Missing event context does not imply that an envelope will be consumed.
`PostToolUse` reports a policy violation; it cannot undo an executed tool.
```

</details>

**依据 2 · 源码核查**：[src/codex_plugin_scanner/guard/adapters/codex_daemon_hook_bridge.py:112-137](https://github.com/hashgraph-online/hol-guard/blob/2664e5a03b3563bff4b08f04fe2e3abb2f67ba20/src/codex_plugin_scanner/guard/adapters/codex_daemon_hook_bridge.py#L112-L137)

已有缺失 runtime 拒绝。

<details>
<summary>查看原文（26行）</summary>

```text
    """Run this hook call in the native bridge, or deny when there is no runtime."""

    state = Path(state_path)
    if _desktop_probe_lane():
        return _desktop_main(
            state=state,
            query=query,
            hook_timeouts=hook_timeouts,
            fallback_command=fallback_command,
            start_command=start_command,
            manifest_path=manifest_path,
            config_json=config_json,
        )
    native = _native_bridge_executable(state.parent)
    if native is None:
        return _deny_before_the_runtime_runs(_NATIVE_RUNTIME_MISSING_CODE)
    unauthenticated = _registration_failure(
        state_path=state,
        fallback_command=fallback_command,
        start_command=start_command,
        hook_timeouts=hook_timeouts,
        manifest_path=manifest_path,
        config_json=config_json,
    )
    if unauthenticated is not None:
        return _deny_before_the_runtime_runs(unauthenticated)
```

</details>

#### 缺口

- 探针方案和评测未实现
  **影响**：不能证明真实防护覆盖
  **进一步探讨**：在隔离环境模拟移除钩子、误配置和事件缺失。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
