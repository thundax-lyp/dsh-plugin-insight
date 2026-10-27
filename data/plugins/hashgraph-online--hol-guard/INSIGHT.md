# HOL Guard

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[dd265e7](https://github.com/hashgraph-online/hol-guard/tree/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9)

<!-- BEGIN META -->
[![GitHub ★ 1,000](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C000&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hashgraph-online/hol-guard)
<!-- END META -->

> **功能**：为Agent动作提供本地策略审查、审批与证据记录，并提供插件和依赖扫描工具。

> **亮点**：将支持入口上的执行前策略、审批和本地证据关联起来，较仅依赖宿主弹窗更便于追溯和跨工具管理；覆盖仍受事件与代理条件限制。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：保护配置不等于全部执行入口已拦截，后置事件无法撤销动作；必须按指定宿主核查真正前置消费与异常行为，不能将DSH包扫描误当运行时全覆盖。[Q01](#research-q01) [Q02](#research-q02)

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
  - [Q01 · HOL Guard比宿主一次确认增加了什么？](#detail-section-11)
  - [Q02 · 审批是否只是一个布尔值，故障时如何处理？](#detail-section-12)
  - [Q03 · 接入和故障恢复的工作由谁承担？](#detail-section-13)
  - [Q04 · 哪些工程契约值得复用？](#detail-section-14)
  - [Q05 · 怎样让保护状态更贴近真实执行覆盖？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需管理多Agent、MCP和包安装风险的开发者及团队，保留策略结论与审批依据。

简单替代为单宿主原有确认加代码/依赖扫描。只有需要统一策略与可追溯审批时，额外native服务和适配维护才可能值得。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 动作前策略与审批 | 在支持事件上审查风险动作 | 宿主必须提供并消费前置hook |
| 本地证据与诊断 | 查决策及维护集成 | 记录不代表所有入口覆盖 |
| 插件与依赖扫描 | 检查包格式和风险线索 | 静态扫描不等于运行时拦截 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python≥3.10、pipx和匹配native runtime | 本地必需 | CLI与策略执行 | 先核对平台支持，不能仅凭Python可用推断 |
| 宿主可消费的hook或受管代理 | 拦截相应动作必需 | 取得执行前事件 | 未覆盖入口仍需宿主原有约束 |
| 本地策略与审批维护者 | 持续必需 | 处理误报、审批与更新 | 可能阻塞正当工作 |
| Guard Cloud账号 | 团队同步可选 | 共享历史与fleet | 本地保护不应因此不可用 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 管理者确认宿主和平台矩阵 | 明确能前置阻断的事件 |
| 2 | 在副本环境安装并预览集成 | 核对修改范围及可恢复配置 |
| 3 | 用只读、危险模拟及失效例检查覆盖 | 正常动作可办结，拒绝有可查依据 |
| 4 | 运维维护策略并排查待批任务 | 更新后重新确认覆盖和失败行为 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地运行时与存储 | 宿主集成、策略设置与回退准备 | 时间未测 |
| 持续使用 | native进程、证据存储、可选Cloud | 审批和误报处理、更新兼容 | 未测每动作延迟与Cloud费用 |
| 失败恢复 | 可能暂停任务 | 查status、doctor、receipt，恢复resident和hook | 拒绝有利控制但降低可用性 |
| 退出 | 备份证据 | 移除受管集成并恢复宿主设置 | 本次未做卸载验收 |

适合有策略维护能力的开发团队在单一宿主副本先试，不能一次为所有工具启用并假定全覆盖。遇到大量误报应定向查规则，不应整体关掉审批来继续工作。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| native失效处理 | 抽查桥接缺运行时转拒绝 | 全部宿主消费情况 |
| 审批绑定 | 请求、策略和环境摘要及重放状态 | 所有调用方竞态与绕过 |
| 工作效率与检测 | 有诊断和历史入口 | 误报、漏报、延迟及人工节省 |

> **思考**：保护配置不等于全部执行入口已拦截，后置事件无法撤销动作；必须按指定宿主核查真正前置消费与异常行为，不能将DSH包扫描误当运行时全覆盖。[Q01](#research-q01) [Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将支持入口上的执行前策略、审批和本地证据关联起来，较仅依赖宿主弹窗更便于追溯和跨工具管理；覆盖仍受事件与代理条件限制。[Q01](#research-q01) [Q02](#research-q02)

值得借鉴的是把审批判定权集中到native resident，Python只做传输与展示；绑定请求、策略和作用域，V4消费经策略fence与binding整体比较，并在resident锁内一次消费，以拒绝上下文错配和重复消费。同时支持矩阵按事件描述返回码，避免将退出0统一误判为允许，因为部分宿主用JSON表达拒绝。

移植需验证宿主是否在真正执行前消费该JSON、注册完整性和resident生命周期。现有回归测试覆盖旧shell控制迁移时保留无关profile字节，是有价值的变更边界设计，但本次只阅读测试没有运行。大量模块和多语言边界也会增加发布与兼容维护成本。

<a id="detail-section-5"></a>

### 1.4 主要限制

保护配置不等于全部执行入口已拦截，后置事件无法撤销动作；必须按指定宿主核查真正前置消费与异常行为，不能将DSH包扫描误当运行时全覆盖。[Q01](#research-q01) [Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

有策略维护能力的团队可在单一受支持宿主副本试用，先核对前置覆盖、resident失效和误报恢复；若无法承担持续审批与兼容维护，先保留宿主原有确认及定向扫描，不扩大部署。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

局部Codex桥接拒绝路径、native审批边界和授权绑定有源码支持；完整拦截率、延迟及误报未实测。

- 已检查：作者 README、包清单、源码路径 README.md、docs/guard/harness-support.md、src/codex_plugin_scanner/guard/adapters/codex_daemon_hook_bridge.py、src/codex_plugin_scanner/guard/approval_gate.py、rust/crates/guard-runtime/src/approval_replay_memory.rs、tests/test_guard_codex_authoritative_hook_boundary.py、rust/crates/guard-runtime/src/approval_v4.rs、rust/crates/guard-runtime/src/policy_store_approval.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：大型仓库定向核查Codex桥接、审批gate、Rust防重放结构与支持矩阵；不是全部规则、代理、签名和宿主的安全审计。
- 下一步：固定一个宿主版本，比较健康、hook缺失、resident不可用及许可重放，记录实际阻断和任务恢复时间。

**分析版本**

- **仓库**：[hashgraph-online/hol-guard](https://github.com/hashgraph-online/hol-guard)
- **版本号**：未声明（[固定提交 dd265e7](https://github.com/hashgraph-online/hol-guard/tree/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用已配置、可达、宿主消费三层状态及无副作用探测验证每个事件的实际控制能力；现有doctor是否已满足应先核对，方案尚未验证。[Q05](#research-q05)

固定一个宿主版本，比较健康、hook缺失、resident不可用及许可重放，记录实际阻断和任务恢复时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 301 | 28200 | — | — | 307152 |
| .ts | test | 230 | 41912 | 36719 | 2059 | — |
| .ts | source | 226 | 38298 | 33413 | 1909 | — |
| .mjs | source | 3 | 328 | 310 | 4 | — |
| .tsx | source | 259 | 58931 | 54436 | 1068 | — |
| .tsx | test | 50 | 7866 | 7039 | 278 | — |
| .ts | example | 3 | 303 | 282 | 3 | — |
| .md | example | 54 | 726 | — | — | 3461 |
| .cjs | source | 1 | 184 | 172 | 1 | — |
| .md | test | 13 | 642 | — | — | 6050 |
| .js | source | 29 | 76245 | 76167 | 6708 | — |
| .mjs | test | 1 | 120 | 111 | 5 | — |
| .js | example | 5 | 48 | 39 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 28](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=28&color=737b86&logo=github)](https://github.com/hashgraph-online/hol-guard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 74](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=74&color=737b86&logo=github)](https://github.com/hashgraph-online/hol-guard/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 62](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=62&color=737b86&logo=github)](https://github.com/hashgraph-online/hol-guard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：执行前策略与审批证据能支持什么范围的多宿主控制，其维护成本与覆盖边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · HOL Guard比宿主一次确认增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向同时使用编码Agent、MCP与包管理工具的开发者及维护团队。合格结果是一次风险动作有明确策略结论、必要审批及可追查证据，而不是只生成安全分数。相较宿主原有确认，它增加跨工具策略、包与插件检查、审批中心和本地历史；本地不必登录Cloud，团队同步是可选扩展。

贡献是把执行前控制与事后证据连接起来，不等于能拦住全部恶意行为。README明确说覆盖取决于每个宿主提供的事件；DSH在文中被明确列为插件包扫描格式，不能据此推出DSH运行时完整拦截。对仅需单宿主少量确认的用户，额外代理和策略维护未必必要。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-25](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/README.md#L23-L25)

作者区分动作前策略与可选Cloud。

```text
HOL Guard reviews agent actions before they run: shell commands, file access, package installs, and MCP tool calls. It detects secret exposure, destructive operations, prompt injection, and supply-chain risks, then allows, blocks, or requests approval according to your policy.

Run it locally without an account. Use the CLI and local dashboard to manage protection, resolve approvals, and inspect decision history. Optional [Guard Cloud](docs/guard/local-vs-cloud.md) adds shared history, team policy, and fleet management.
```

**依据 2 · 作者声明**：[README.md:58-69](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/README.md#L58-L69)

列出保护面并注明宿主事件覆盖。

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

**依据 3 · 作者声明**：[README.md:226-242](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/README.md#L226-L242)

DSH被列为扫描格式，而非此处运行时hook承诺。

<details>
<summary>查看原文（17行）</summary>

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
```
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 审批是否只是一个布尔值，故障时如何处理？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

抽查Codex兼容桥接路径，先找native runtime，再验证注册；缺运行时或注册失败会在执行native前返回拒绝，启动异常也转拒绝。Python approval_gate将一次请求交给resident决定，已配置gate的resident不响应会抛native_approval_gate_unavailable；从未配置的home有单独未配置路径，不能泛称所有状态都严格拒绝。

Rust replay memory包含Pending、Claimed、Consumed状态，绑定请求、动作、策略代次、runtime及workspace等摘要，并标注resident重启使旧许可失效。继续跟踪V4消费路径，consume_approval先校验envelope与artifact、assertion，再由context构造binding，调用policy_store的consume_approval_nonce_fenced。后者持策略锁比较generation、policy_digest、rule_digest与runtime_identity，再转ReplayMemory。ReplayMemory持Mutex比较整个binding是否相同，仅Claimed能转Consumed；重复消费拒绝，输出失败回滚状态。这支持本地resident路径的上下文匹配与一次消费机制，不只是字段存在；仍未审核所有签发调用方、宿主消费与跨进程攻击，不宣称全链路安全。支持矩阵还明确PostToolUse只是事后报告，不能撤销已执行工具。

#### 证据与依据

**依据 1 · 源码核查**：[src/codex_plugin_scanner/guard/adapters/codex_daemon_hook_bridge.py:112-159](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/src/codex_plugin_scanner/guard/adapters/codex_daemon_hook_bridge.py#L112-L159)

native缺失、注册失败和启动失败转拒绝。

<details>
<summary>查看原文（48行）</summary>

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
    sys.stdout.flush()
    # The child inherits this hook call's stdio, so it reads the hook body and
    # writes the response itself. ``exec`` would save the fork, but this entry
    # point is also called in process, where replacing the caller is wrong.
    try:
        return subprocess.run(
            _native_argv(
                native,
                state_path=state_path,
                fallback_command=fallback_command,
                start_command=start_command,
                query=query,
                hook_timeouts=hook_timeouts,
                manifest_path=manifest_path,
                config_json=config_json,
            ),
            check=False,
        ).returncode
    except OSError:
        # A runtime that cannot be started answers nothing, and a hook that
        # answers nothing lets the call through, so deny it here instead.
        return _deny_before_the_runtime_runs(_RUNTIME_LAUNCH_FAILED_CODE)
```

</details>

**依据 2 · 源码核查**：[src/codex_plugin_scanner/guard/approval_gate.py:114-139](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/src/codex_plugin_scanner/guard/approval_gate.py#L114-L139)

native请求与从未配置gate的例外分开。

<details>
<summary>查看原文（26行）</summary>

```text
def _native(method: str, guard_home: Path, **kwargs: object) -> dict[str, object]:
    """One resident round trip; no resident means no authority (fail closed)."""
    payload = _approval_gate_native(
        method,
        guard_home,
        provision_prerequisite=_provisions_prerequisite(method, guard_home),
        **kwargs,
    )
    if payload is None:
        raise _unavailable()
    return payload


def _native_or_unconfigured(method: str, guard_home: Path, **kwargs: object) -> dict[str, object] | None:
    """Like ``_native``, but ``None`` for a home that never configured the gate."""
    payload = _approval_gate_native(
        method,
        guard_home,
        provision_prerequisite=_provisions_prerequisite(method, guard_home),
        **kwargs,
    )
    if payload is not None:
        return payload
    if (Path(guard_home) / APPROVAL_GATE_STATE_FILE).exists():
        raise _unavailable()
    return None
```

</details>

**依据 3 · 源码核查**：[rust/crates/guard-runtime/src/approval_replay_memory.rs:14-70](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/rust/crates/guard-runtime/src/approval_replay_memory.rs#L14-L70)

重放状态与请求/策略/环境绑定字段。

<details>
<summary>查看原文（57行）</summary>

```text
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ReplayStatus {
    Pending,
    Claimed,
    Consumed,
}

#[derive(Debug, Clone, Copy)]
enum ReplayTransition {
    Claim,
    Consume,
}

#[derive(Debug, Clone)]
struct ReplayEntry {
    binding: ApprovalReplayBinding,
    status: ReplayStatus,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct ReplayKey {
    epoch: String,
    nonce_digest: String,
}

#[derive(Default)]
struct ReplayState {
    entries: HashMap<ReplayKey, ReplayEntry>,
}

/// Bounded one-resident replay state; restarting invalidates prior artifacts.
pub(crate) struct ApprovalReplayMemory {
    epoch: String,
    state: Mutex<ReplayState>,
}

/// Privacy-safe identity beside a live challenge; no raw command or payload.
#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct ApprovalReplayBinding {
    pub(crate) request_id_digest: String,
    pub(crate) request_digest: String,
    pub(crate) action_digest: String,
    pub(crate) policy_generation: u64,
    pub(crate) policy_digest: String,
    pub(crate) rule_digest: String,
    pub(crate) runtime_identity: String,
    pub(crate) runtime_binary_identity: String,
    pub(crate) harness: String,
    pub(crate) workspace_binding: Option<String>,
    pub(crate) device_binding: Option<String>,
    pub(crate) installation_binding: Option<String>,
    pub(crate) publisher_binding: Option<String>,
    pub(crate) artifact_binding: Option<String>,
    pub(crate) scope_contract_version: String,
    pub(crate) scope_contract_digest: String,
    pub(crate) scope_binding: Option<String>,
    pub(crate) expires_at_ms: u64,
```

</details>

**依据 4 · 作者声明**：[docs/guard/harness-support.md:14-24](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/docs/guard/harness-support.md#L14-L24)

不同宿主返回协议，PostToolUse无法撤销执行。

<details>
<summary>查看原文（11行）</summary>

```text
| Harness | Blocking verdict | Nonblocking verdict |
| --- | --- | --- |
| Codex, Claude Code, Copilot, Pi, OMP | `0` for `PreToolUse`, `UserPromptSubmit`, and `PermissionRequest`; the JSON envelope carries the denial. `1` for other events, including `PostToolUse`. | `0` |
| Cursor, Devin, Kimi, Hermes | `2` | `0` |
| OpenCode, Superagent | `1` | `0` |
| Grok, ZCode | Adapter-defined event/recording-mode behavior, through the shared authority. | Adapter-defined |
| Unknown harness | `1` | `0` |

Blocking actions are `review`, `require-reapproval`, `sandbox-required`, and
`block`. Missing event context does not imply that an envelope will be consumed.
`PostToolUse` reports a policy violation; it cannot undo an executed tool.
```

</details>

**依据 5 · 源码核查**：[rust/crates/guard-runtime/src/approval_v4.rs:401-440](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/rust/crates/guard-runtime/src/approval_v4.rs#L401-L440)

V4消费从校验请求生成binding及策略fence，进入受控消费。

<details>
<summary>查看原文（40行）</summary>

```text
pub(crate) fn consume_approval(
    request: ApprovalConsumeRequestV4,
    store: &crate::policy_store::PolicySnapshotStore,
) -> Result<Vec<u8>, String> {
    if request.schema != NATIVE_APPROVAL_CONSUME_REQUEST_V4_SCHEMA || request.version != 4 {
        return Err("native_approval_v4_consume_request_invalid".to_owned());
    }
    let (context, authority, nonce, verified) =
        validate_common(&request.envelope, &request.artifact, store)?;
    let assertion_digest = hex::encode(verified.assertion_digest);
    let nonce_digest = super::approval_context::encode_digest(&nonce);
    if !authority::assertion_matches(&authority, &nonce_digest, &assertion_digest, now_ms()?)? {
        return Err("native_approval_v4_artifact_invalid".to_owned());
    }
    let binding = replay_binding(&context, request.artifact.expires_at_ms);
    let fence = crate::policy_store::ApprovalPolicyFence {
        generation: context.policy_generation,
        policy_digest: &context.policy_digest,
        rule_digest: &context.rule_digest,
        runtime_identity: &context.runtime_identity,
    };
    store.consume_approval_nonce_fenced(
        &request.artifact.resident_epoch,
        &nonce_digest,
        &binding,
        now_ms()?,
        &fence,
        || {
            let encoded = encode_response(&receipt(
                &context,
                &request.artifact,
                &authority,
                "consumed",
                "native_approval_v4_consumed",
                nonce_digest.clone(),
                verified.sign_count,
            ))?;
            authority::forget_assertion(&authority, &nonce_digest)?;
            Ok(encoded)
        },
```

</details>

**依据 6 · 源码核查**：[rust/crates/guard-runtime/src/policy_store_approval.rs:167-210](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/rust/crates/guard-runtime/src/policy_store_approval.rs#L167-L210)

持策略锁比较代次、策略、规则和runtime身份再转消费。

<details>
<summary>查看原文（44行）</summary>

```text
    pub(crate) fn consume_approval_nonce_fenced<F>(
        &self,
        resident_epoch: &str,
        nonce_digest: &str,
        binding: &crate::approval::ApprovalReplayBinding,
        now: u64,
        expected: &ApprovalPolicyFence<'_>,
        emit: F,
    ) -> Result<Vec<u8>, String>
    where
        F: FnOnce() -> Result<Vec<u8>, String>,
    {
        let state = self
            .state
            .lock()
            .map_err(|_| "native_policy_snapshot_state_unavailable".to_owned())?;
        if self.authority_changed.load(Ordering::SeqCst)
            || !policy_store_authority::authority_unchanged_fenced(self)
        {
            return Err("native_approval_policy_context_mismatch".to_owned());
        }
        let snapshot = state
            .snapshot
            .as_ref()
            .ok_or_else(|| "native_policy_snapshot_missing".to_owned())?;
        if state.invalid_on_startup
            || snapshot.generation != expected.generation
            || snapshot.policy_digest != expected.policy_digest
            || snapshot.rule_digest != expected.rule_digest
            || snapshot.runtime_identity != expected.runtime_identity
        {
            return Err("native_approval_policy_context_mismatch".to_owned());
        }
        let _command_lease = self.command_authority_lease(snapshot.snapshot())?;
        if snapshot.expires_at_ms <= now {
            return Err("native_approval_receipt_expired".to_owned());
        }
        self.approval_replay_memory.consume_and_emit(
            resident_epoch,
            nonce_digest,
            binding,
            now,
            emit,
        )
```

</details>

**依据 7 · 源码核查**：[rust/crates/guard-runtime/src/approval_replay_memory.rs:263-324](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/rust/crates/guard-runtime/src/approval_replay_memory.rs#L263-L324)

持Mutex比较整个binding，限制Claimed到Consumed并原子回滚输出失败。

<details>
<summary>查看原文（62行）</summary>

```text
    fn transition_and_emit<F>(
        &self,
        epoch: &str,
        nonce_digest: &str,
        binding: &ApprovalReplayBinding,
        now: u64,
        transition: ReplayTransition,
        emit: F,
    ) -> Result<Vec<u8>, String>
    where
        F: FnOnce() -> Result<Vec<u8>, String>,
    {
        let key = nonce_digest_key(epoch, nonce_digest)?;
        let mut state = self
            .state
            .lock()
            .map_err(|_| "native_approval_replay_unavailable".to_owned())?;
        // Prune on every transition, preserving the target-specific expiry error.
        let target_expired = state
            .entries
            .get(&key)
            .is_some_and(|entry| entry.binding.expires_at_ms <= now);
        state
            .entries
            .retain(|_, entry| entry.binding.expires_at_ms > now);
        if target_expired {
            return Err("native_approval_receipt_expired".to_owned());
        }
        let Some(entry) = state.entries.get_mut(&key) else {
            return Err("native_approval_receipt_not_claimed".to_owned());
        };
        if &entry.binding != binding {
            return Err("native_approval_binding_mismatch".to_owned());
        }
        let previous_status = entry.status;
        match (transition, previous_status) {
            (ReplayTransition::Claim, ReplayStatus::Pending) => {
                entry.status = ReplayStatus::Claimed
            }
            (ReplayTransition::Claim, ReplayStatus::Claimed | ReplayStatus::Consumed) => {
                return Err("native_approval_replay".to_owned());
            }
            (ReplayTransition::Consume, ReplayStatus::Pending) => {
                return Err("native_approval_receipt_not_claimed".to_owned());
            }
            (ReplayTransition::Consume, ReplayStatus::Claimed) => {
                entry.status = ReplayStatus::Consumed
            }
            (ReplayTransition::Consume, ReplayStatus::Consumed) => {
                return Err("native_approval_receipt_consumed".to_owned());
            }
        }

        // Keep the lock while emitting so a failed emission can roll back atomically.
        match emit() {
            Ok(value) => Ok(value),
            Err(error) => {
                if let Some(entry) = state.entries.get_mut(&key) {
                    entry.status = previous_status;
                }
                Err(error)
            }
```

</details>

#### 缺口

- 未审计所有签发与消费调用方、宿主事件覆盖及策略更新竞态。
  **影响**：不能把局部防重放结构等同所有动作均不可绕过。
  **进一步探讨**：对指定宿主版本测hook禁用、resident崩溃、策略更新后旧许可重放与后置事件，分别记录阻断和未覆盖。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 接入和故障恢复的工作由谁承担？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python≥3.10、pipx和匹配native runtime | 本地必需 | CLI与策略执行 | 先核对平台支持，不能仅凭Python可用推断 |
| 宿主可消费的hook或受管代理 | 拦截相应动作必需 | 取得执行前事件 | 未覆盖入口仍需宿主原有约束 |
| 本地策略与审批维护者 | 持续必需 | 处理误报、审批与更新 | 可能阻塞正当工作 |
| Guard Cloud账号 | 团队同步可选 | 共享历史与fleet | 本地保护不应因此不可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 管理者确认宿主和平台矩阵 | 明确能前置阻断的事件 |
| 2 | 在副本环境安装并预览集成 | 核对修改范围及可恢复配置 |
| 3 | 用只读、危险模拟及失效例检查覆盖 | 正常动作可办结，拒绝有可查依据 |
| 4 | 运维维护策略并排查待批任务 | 更新后重新确认覆盖和失败行为 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地运行时与存储 | 宿主集成、策略设置与回退准备 | 时间未测 |
| 持续使用 | native进程、证据存储、可选Cloud | 审批和误报处理、更新兼容 | 未测每动作延迟与Cloud费用 |
| 失败恢复 | 可能暂停任务 | 查status、doctor、receipt，恢复resident和hook | 拒绝有利控制但降低可用性 |
| 退出 | 备份证据 | 移除受管集成并恢复宿主设置 | 本次未做卸载验收 |

适合有策略维护能力的开发团队在单一宿主副本先试，不能一次为所有工具启用并假定全覆盖。遇到大量误报应定向查规则，不应整体关掉审批来继续工作。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:32-48](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/README.md#L32-L48)

平台与native要求，setup逐项确认。

<details>
<summary>查看原文（17行）</summary>

````text
## Install HOL Guard

Requires Python 3.10 or newer, [pipx](https://pipx.pypa.io/stable/installation/), and a matching native runtime. Check the [platform support and Windows ARM64 setup notes](docs/guard/get-started.md#platform-support) before installing.

```bash
pipx install hol-guard
hol-guard init
```

The first-run wizard discovers supported agents and walks you through protection setup. It asks before each setup change, including opening the dashboard, installing agent integrations, and connecting optional cloud services.

Check your installation:

```bash
hol-guard --version
hol-guard status
```
````

</details>

**依据 2 · 作者声明**：[README.md:89-117](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/README.md#L89-L117)

诊断、审批、历史和不执行命令的解释入口。

<details>
<summary>查看原文（29行）</summary>

````text
## Everyday Use

| Task | Command |
| :--- | :--- |
| Check protection status | `hol-guard status` |
| Diagnose an agent integration | `hol-guard doctor codex` |
| Inspect changes before launch | `hol-guard diff codex` |
| Review pending approvals | `hol-guard approvals` |
| Approve or deny a request | `hol-guard approvals approve <request-id>` / `hol-guard approvals deny <request-id>` |
| Read decision history | `hol-guard receipts` |
| List tracked artifacts | `hol-guard inventory` |
| Export an AI bill of materials | `hol-guard abom --format json` |
| Scan workspace dependencies | `hol-guard supply-chain scan` |
| Connect optional cloud sync | `hol-guard connect` |

<a id="guard-troubleshooting"></a>
<a id="inspect-command-protection-without-running-it"></a>

### Understand a paused command

Inspect the command's classification and matching rules:

```bash
hol-guard command test 'rm -rf ./build'
hol-guard command explain 'git clean -ndx'
hol-guard command extensions command.git --json
```

`command test` and `command explain` inspect the command without executing it or creating an approval. Use `hol-guard approvals` to resolve a pending request and `hol-guard receipts` to review the recorded decision.
````

</details>

**依据 3 · 源码核查**：[src/codex_plugin_scanner/guard/approval_gate.py:114-139](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/src/codex_plugin_scanner/guard/approval_gate.py#L114-L139)

resident不可用对任务可用性有影响。

<details>
<summary>查看原文（26行）</summary>

```text
def _native(method: str, guard_home: Path, **kwargs: object) -> dict[str, object]:
    """One resident round trip; no resident means no authority (fail closed)."""
    payload = _approval_gate_native(
        method,
        guard_home,
        provision_prerequisite=_provisions_prerequisite(method, guard_home),
        **kwargs,
    )
    if payload is None:
        raise _unavailable()
    return payload


def _native_or_unconfigured(method: str, guard_home: Path, **kwargs: object) -> dict[str, object] | None:
    """Like ``_native``, but ``None`` for a home that never configured the gate."""
    payload = _approval_gate_native(
        method,
        guard_home,
        provision_prerequisite=_provisions_prerequisite(method, guard_home),
        **kwargs,
    )
    if payload is not None:
        return payload
    if (Path(guard_home) / APPROVAL_GATE_STATE_FILE).exists():
        raise _unavailable()
    return None
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些工程契约值得复用？

**研究主题**：工程质量与复用

#### 完整回答

值得借鉴的是把审批判定权集中到native resident，Python只做传输与展示；绑定请求、策略和作用域，使授权不易被另一动作复用。同时支持矩阵按事件描述返回码，避免将退出0统一误判为允许，因为部分宿主用JSON表达拒绝。

移植需验证宿主是否在真正执行前消费该JSON、注册完整性和resident生命周期。现有回归测试覆盖旧shell控制迁移时保留无关profile字节，是有价值的变更边界设计，但本次只阅读测试没有运行。大量模块和多语言边界也会增加发布与兼容维护成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/codex_plugin_scanner/guard/approval_gate.py:1-12](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/src/codex_plugin_scanner/guard/approval_gate.py#L1-L12)

native持有决策权，Python不重新算结论。

<details>
<summary>查看原文（12行）</summary>

```text
"""Local approval gate: transport and presentation for the native authority.

The resident ``approval_gate`` op decides eligibility, identity/context
matching, grant issue/claim/consume ordering, lockout, cooldown, TOTP and
policy revalidation. This module marshals one request per call, binds it to the
resident's answer, and presents the result. It never recomputes a verdict.

A provisioned resident that fails to answer raises
``native_approval_gate_unavailable`` (fail closed). The one thing Python still
observes itself is whether a guard home has *ever* configured the gate (the
state file exists); a home that never did has nothing to enforce, so read-only
checks on it succeed without a resident.
```

</details>

**依据 2 · 源码核查**：[rust/crates/guard-runtime/src/approval_replay_memory.rs:44-70](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/rust/crates/guard-runtime/src/approval_replay_memory.rs#L44-L70)

授权绑定多种上下文并限制resident生命周期。

<details>
<summary>查看原文（27行）</summary>

```text
/// Bounded one-resident replay state; restarting invalidates prior artifacts.
pub(crate) struct ApprovalReplayMemory {
    epoch: String,
    state: Mutex<ReplayState>,
}

/// Privacy-safe identity beside a live challenge; no raw command or payload.
#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct ApprovalReplayBinding {
    pub(crate) request_id_digest: String,
    pub(crate) request_digest: String,
    pub(crate) action_digest: String,
    pub(crate) policy_generation: u64,
    pub(crate) policy_digest: String,
    pub(crate) rule_digest: String,
    pub(crate) runtime_identity: String,
    pub(crate) runtime_binary_identity: String,
    pub(crate) harness: String,
    pub(crate) workspace_binding: Option<String>,
    pub(crate) device_binding: Option<String>,
    pub(crate) installation_binding: Option<String>,
    pub(crate) publisher_binding: Option<String>,
    pub(crate) artifact_binding: Option<String>,
    pub(crate) scope_contract_version: String,
    pub(crate) scope_contract_digest: String,
    pub(crate) scope_binding: Option<String>,
    pub(crate) expires_at_ms: u64,
```

</details>

**依据 3 · 作者声明**：[docs/guard/harness-support.md:7-24](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/docs/guard/harness-support.md#L7-L24)

返回码与JSON协议独立说明。

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
| Codex, Claude Code, Copilot, Pi, OMP | `0` for `PreToolUse`, `UserPromptSubmit`, and `PermissionRequest`; the JSON envelope carries the denial. `1` for other events, including `PostToolUse`. | `0` |
| Cursor, Devin, Kimi, Hermes | `2` | `0` |
| OpenCode, Superagent | `1` | `0` |
| Grok, ZCode | Adapter-defined event/recording-mode behavior, through the shared authority. | Adapter-defined |
| Unknown harness | `1` | `0` |

Blocking actions are `review`, `require-reapproval`, `sandbox-required`, and
`block`. Missing event context does not imply that an envelope will be consumed.
`PostToolUse` reports a policy violation; it cannot undo an executed tool.
```

</details>

**依据 4 · 源码核查**：[tests/test_guard_codex_authoritative_hook_boundary.py:62-96](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/tests/test_guard_codex_authoritative_hook_boundary.py#L62-L96)

测试描述迁移仅移除受管片段、保留用户字节，不代表本次通过。

<details>
<summary>查看原文（35行）</summary>

```text
def test_install_migrates_legacy_shell_controls_without_changing_user_bytes(tmp_path, capsys):
    home_dir = tmp_path / "home"
    workspace_dir = tmp_path / "workspace"
    guard_root = home_dir / "managed" / "codex"
    user_prefix = "export KEEP_BEFORE=1\n"
    user_suffix = "export KEEP_AFTER=2\n\n"
    legacy_profile = f"{user_prefix}\n{_managed_shell_block('source /old/guard')}\n{user_suffix}"

    for startup_name in (".zshenv", ".bashrc", ".bash_profile", ".bash_login", ".profile"):
        _write_text(home_dir / startup_name, legacy_profile)
    fish_conf = home_dir / ".config" / "fish" / "conf.d" / "hol-guard-codex.fish"
    _write_text(fish_conf, f"{user_prefix}\n{_managed_shell_block('source /old/fish-guard')}\n{user_suffix}")
    for guard_name in (
        "codex-zshenv-guard.zsh",
        "codex-bashenv-guard.bash",
        "codex-fish-guard.fish",
    ):
        _write_text(guard_root / guard_name, "legacy Guard-owned shell control\n")

    output = _install_codex(home_dir, workspace_dir, capsys)
    manifest = output["managed_install"]["manifest"]

    assert manifest["enforcement_boundary"] == "codex-native-hooks"
    assert "managed_shell_guard_path" not in manifest
    assert "managed_shell_guard_paths" not in manifest
    for startup_name in (".zshenv", ".bashrc", ".bash_profile", ".bash_login", ".profile"):
        assert (home_dir / startup_name).read_text(encoding="utf-8") == f"{user_prefix}{user_suffix}"
    assert fish_conf.read_text(encoding="utf-8") == f"{user_prefix}{user_suffix}"
    assert not any(
        (guard_root / guard_name).exists()
        for guard_name in (
            "codex-zshenv-guard.zsh",
            "codex-bashenv-guard.bash",
            "codex-fish-guard.fish",
        )
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样让保护状态更贴近真实执行覆盖？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把保护状态拆成已配置、可达、宿主实际消费三层，并为每个事件保留无副作用的覆盖探测结果。只有测试动作确实到达策略并由宿主消费拒绝时，界面才标记该入口可强制控制；PostToolUse单独标观察。

依据是Q02中退出码0也可能表示拒绝、后置事件不能撤销，以及配置与真实入口之间的差距。最小验证固定一个宿主，比较hook被关闭、响应JSON损坏、resident退出和健康状态四种场景的状态展示与真实阻断。若现有doctor已经可靠覆盖这些情况，不应新增重复检查；若探测改变真实文件或造成审批噪音，则缩小为只读协议探测。

#### 证据与依据

**依据 1 · 作者声明**：[docs/guard/harness-support.md:14-24](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/docs/guard/harness-support.md#L14-L24)

宿主消费协议和前后置边界决定实际覆盖。

<details>
<summary>查看原文（11行）</summary>

```text
| Harness | Blocking verdict | Nonblocking verdict |
| --- | --- | --- |
| Codex, Claude Code, Copilot, Pi, OMP | `0` for `PreToolUse`, `UserPromptSubmit`, and `PermissionRequest`; the JSON envelope carries the denial. `1` for other events, including `PostToolUse`. | `0` |
| Cursor, Devin, Kimi, Hermes | `2` | `0` |
| OpenCode, Superagent | `1` | `0` |
| Grok, ZCode | Adapter-defined event/recording-mode behavior, through the shared authority. | Adapter-defined |
| Unknown harness | `1` | `0` |

Blocking actions are `review`, `require-reapproval`, `sandbox-required`, and
`block`. Missing event context does not imply that an envelope will be consumed.
`PostToolUse` reports a policy violation; it cannot undo an executed tool.
```

</details>

**依据 2 · 源码核查**：[src/codex_plugin_scanner/guard/adapters/codex_daemon_hook_bridge.py:125-159](https://github.com/hashgraph-online/hol-guard/blob/dd265e79cdd5f1d96c7ffa1c9dc46eeef5755bd9/src/codex_plugin_scanner/guard/adapters/codex_daemon_hook_bridge.py#L125-L159)

本地健康和注册失败是具体可测失效。

<details>
<summary>查看原文（35行）</summary>

```text
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
            _native_argv(
                native,
                state_path=state_path,
                fallback_command=fallback_command,
                start_command=start_command,
                query=query,
                hook_timeouts=hook_timeouts,
                manifest_path=manifest_path,
                config_json=config_json,
            ),
            check=False,
        ).returncode
    except OSError:
        # A runtime that cannot be started answers nothing, and a hook that
        # answers nothing lets the call through, so deny it here instead.
        return _deny_before_the_runtime_runs(_RUNTIME_LAUNCH_FAILED_CODE)
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
