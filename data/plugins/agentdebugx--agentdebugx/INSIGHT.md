# AgentDebugX

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2437c73](https://github.com/AgentDebugX/AgentDebugX/tree/2437c73c3183e6b6495259dfbb12464a7f07f6b8)

<!-- BEGIN META -->
[![GitHub ★ 73](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=73&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AgentDebugX/AgentDebugX)
<!-- END META -->

> **功能**：把Agent轨迹转为诊断报告、恢复建议和可区分模拟的重跑记录

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 统一事件、定位finding和恢复交接，根Python工具独立于DSH桥。

> **主要限制**：[Q03](#research-q03) [Q03](#research-q03) 批准只是元数据、proxy不是任务效果；runner是信任边界。

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
  - [Q01 · 根工具怎样帮助定位Agent失败？](#detail-section-11)
  - [Q02 · 诊断和重跑真正执行什么？](#detail-section-12)
  - [Q03 · 哪些输出不能当根因、批准或成功证明？](#detail-section-13)
  - [Q04 · 采用、成本与退出怎样区分三种模式？](#detail-section-14)
  - [Q05 · 怎么证伪诊断和恢复的净价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有Agent失败日志的开发者要定位症状并准备恢复。

人工看各框架日志并手写恢复步骤。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 轨迹规范化与本地存储 | 跨导出保存统一事件 | auto格式有歧义，strict_native可选 |
| 诊断及恢复建议 | 规则finding、归因假设和rerun request | 最早finding不等因果，模型模式会外发 |
| 受控重跑协议 | plan/simulation/live区分及proof校验 | executor可信、批准需调用方，proxy仅error计数 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Python>=3.9<4、Pydantic/httpx | 根工具 | 导入、schema与CLI | 不是DSH子包安装 |
| 原始轨迹和可写.agentdebug目录 | 离线诊断 | 可定位事件和报告留存 | 缺上下文易误诊，追加存储需清理 |
| 模型端点/凭据 | LLM模式 | 外部归因/模拟 | 审外发与token预算，失败回退口径保留 |
| 受信runner/环境/批准 | live模式 | 真实工具与环境执行 | 轨迹本身不可重放，默认元数据不强制批准 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 保存原始轨迹并脱敏，选明确格式/strict_native | 核事件ID与工具配对 |
| 离线 | heuristic报告对照已知故障 | 少finding不证明任务成功 |
| 选配live | 独立批准、隔离runner和账号，核外部验收 | 模拟和proof自述不得当业务成功 |
| 退出 | 停capture/runner，核后代及远端效果，归档再清trace和凭据 | 临时文件删不回滚业务副作用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Python环境与轨迹磁盘资源未知 | 规范化和脱敏日志耗时未知 | 离线无模型调用但准备耗时/存储未知 |
| 持续 | 可选LLM token与live模型工具资源未知 | 复核finding/归因与runner配置耗时未知 | 费用和准确率未知 |
| 恢复 | 轨迹/报告归档与runner残留资源未知 | 核重复效果、停进程与撤凭据耗时未知 | 无自动业务回滚，恢复耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 诊断记录 | 代码保存规则finding和归因假设 | 因果准确率、漏报及省时未测 |
| 重跑证据 | 模拟/live字段和proof格式校验 | runner声明真实性及任务结果未验 |
| 分支比较 | 按event.error数量比较improved | 不证明目标完成或副作用减少 |

> **思考**：[Q03](#research-q03) [Q03](#research-q03) 批准只是元数据、proxy不是任务效果；runner是信任边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 统一事件、定位finding和恢复交接，根Python工具独立于DSH桥。

规则到runner/proof内部链已核，未运行任何目标。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) [Q03](#research-q03) 批准只是元数据、proxy不是任务效果；runner是信任边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) [Q04](#research-q04) 先脱敏离线heuristic，live需外置审批、隔离runner与外部验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的判断根Python调试工具的诊断与重跑证据能否支持安全人工决策。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/agentdebug/diagnose/pipeline.py、src/agentdebug/ingest/adapters/importers.py、src/agentdebug/diagnose/detect/analyzers.py、src/agentdebug/diagnose/detect/rules/packs/core/rules.py、src/agentdebug/rerun/workflow.py、src/agentdebug/rerun/executors/process_live.py、src/agentdebug/rerun/live_validation.py、src/agentdebug/cli/legacy.py、src/agentdebug/rerun/branch.py、src/agentdebug/diagnose/attribute/attribution.py、pyproject.toml、src/agentdebug/runtime/storage.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的判断根Python调试工具的诊断与重跑证据能否支持安全人工决策。未执行目标代码或实际宿主验证。
- 下一步：保留原始日志、盲标根因、报告和外部验收，不按报告confidence自评

**分析版本**

- **仓库**：[AgentDebugX/AgentDebugX](https://github.com/AgentDebugX/AgentDebugX)
- **版本号**：未声明（[固定提交 2437c73](https://github.com/AgentDebugX/AgentDebugX/tree/2437c73c3183e6b6495259dfbb12464a7f07f6b8)）
- **版本日期**：2026-09-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) [Q05](#research-q05) 可检验诊断辅助是否减少定位负担，当前没有收益数据。

保留原始日志、盲标根因、报告和外部验收，不按报告confidence自评

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 70 | 8135 | — | — | 40846 |
| .md | example | 7 | 736 | — | — | 3689 |
| .js | source | 1 | 1526 | 1339 | 94 | — |
| .js | test | 1 | 747 | 672 | 24 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/AgentDebugX/AgentDebugX/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断根Python调试工具的诊断与重跑证据能否支持安全人工决策

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根工具怎样帮助定位Agent失败？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Agent开发者已有失败轨迹时，可用Python库/CLI将不同导出规范化为AgentTrajectory，再将症状、归因假设和恢复指令保存在同一报告。root是tool，DSH集成在integrations/dsh-agentdebugx独立子包，不能把两者当同一安装。相比人工读日志，本体贡献是统一事件、可定位finding及便携rerun request；不是自动证明根因或修好任务。local_default明确为无LLM heuristic detector+attributor，恢复器未提供则不运行。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-35](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/README.md#L25-L35)

作者整体流程与本地定位

<details>
<summary>查看原文（11行）</summary>

```text
AgentDebugX turns failed agent runs into structured, auditable debugging
artifacts. It ingests a live or exported trajectory, detects visible failure
signals, attributes them to responsible steps or agents, proposes recovery
actions, and prepares controlled reruns so fixes can be validated instead of
guessed.

The project is designed for researchers and engineers building complex LLM
agents: multi-agent systems, tool-using agents, computer-use agents, benchmark
runners, and local agent development workflows. AgentDebugX is local-first by
default: traces stay on your machine, sharing is opt-in, and recovery proposals
carry explicit policy and approval metadata into the Rerun boundary.
```

</details>

**依据 2 · 源码核查**：[src/agentdebug/diagnose/pipeline.py:43-91](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/diagnose/pipeline.py#L43-L91)

实际Detect→Attribute→Recover及local默认

<details>
<summary>查看原文（49行）</summary>

```text
    context: Optional[DiagnoseContext] = None


class DiagnosePipeline:
    """Run Detect -> Attribute -> Recover over one trajectory.

    Defaults are intentionally local and dependency-free. Passing ``None`` for
    ``attributor`` or ``recoverer`` disables that sub-stage.
    """

    def __init__(
        self,
        *,
        detector: Optional[DetectorStage] = None,
        attributor: Optional[Attributor] = None,
        recoverer: Optional[Recoverer] = None,
    ) -> None:
        self.detector = detector or HeuristicAnalyzer()
        self.attributor = attributor
        self.recoverer = recoverer

    @classmethod
    def local_default(cls) -> 'DiagnosePipeline':
        """Return a zero-LLM pipeline with deterministic detect + attribution."""

        return cls(detector=HeuristicAnalyzer(), attributor=HeuristicAttributor())

    def run(self, trajectory: AgentTrajectory) -> DiagnosePipelineResult:
        report = self.detector.analyze(trajectory)
        attribution = None
        recovery = None

        if self.attributor is not None:
            attribution = self.attributor.attribute(trajectory, report.findings)
            report.attribution = _attribution_payload(attribution)

        context = DiagnoseContext.build(trajectory, report, attribution)

        if self.recoverer is not None:
            recovery = suggest_from_context(self.recoverer, context)
            report.recovery = _recovery_payload(recovery)
            if recovery:
                report.suggestions = [proposal.suggestion_text for proposal in recovery]

        return DiagnosePipelineResult(
            report=report,
            context=context,
            attribution=attribution,
            recovery=recovery,
```

</details>

**依据 3 · 源码核查**：[src/agentdebug/ingest/adapters/importers.py:116-174](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/ingest/adapters/importers.py#L116-L174)

导入规范化与strict_native可选

<details>
<summary>查看原文（59行）</summary>

```text
def convert_payload(
    payload: Any,
    *,
    format: FormatName = 'auto',
    trace_id: Optional[str] = None,
    task_id: Optional[str] = None,
    goal: Optional[str] = None,
    framework: Optional[str] = None,
    strict_native: bool = False,
) -> AgentTrajectory:
    """Convert an offline trace payload into ``AgentTrajectory``.

    ``strict_native=True`` refuses a ``messages`` export whose native tool-calling
    envelope is inconsistent (an assistant ``tool_calls`` id not answered exactly
    once, an orphan ``tool`` message, a missing or duplicate call id); see
    :mod:`agentdebug.ingest.native_protocol`. The default stays lenient because
    text-protocol transcripts carry no envelope at all.

    ``format='auto'`` is intended for CLI use and common exported logs. Pass an
    explicit format when a payload is ambiguous, for example a list of objects
    that could be either messages or events.
    """

    fmt = detect_payload_format(payload) if format == 'auto' else _normalize_format_name(format)
    if fmt == 'agenttrajectory':
        if not isinstance(payload, (dict, str)):
            raise ConversionError('agenttrajectory payload must be a JSON object or string')
        text = payload if isinstance(payload, str) else json.dumps(payload)
        traj = trajectory_from_json(text)
        if trace_id is not None:
            traj.trace_id = trace_id
            for event in traj.events:
                event.trace_id = trace_id
        if task_id is not None:
            traj.task_id = task_id
        if goal is not None:
            traj.goal = goal
        if framework is not None:
            traj.framework = framework
        return traj
    if fmt in {'messages', 'message_list'}:
        messages = payload.get('messages') if isinstance(payload, dict) else payload
        if strict_native:
            from agentdebug.ingest.native_protocol import native_tool_message_violations

            violations = native_tool_message_violations(
                cast(Sequence[Any], messages), trace_uid=trace_id)
            if violations:
                reasons = sorted({str(v['reason']) for v in violations})
                raise ConversionError(
                    'native tool-calling envelope is inconsistent: ' + '; '.join(reasons))
        return _convert_messages_payload(
            payload if isinstance(payload, dict) else {'messages': messages},
            cast(Sequence[Dict[str, Any]], messages),
            trace_id=trace_id,
            task_id=task_id,
            goal=goal,
            framework=framework,
        )
```

</details>

#### 缺口

- 异构导出保真与独立开发者定位效率未测
  **影响**：不完整日志可能导致错误归因，不能把规范化成功当保真
  **进一步探讨**：先保留原始轨迹，对照事件ID/工具call配对和已知根因样例

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 诊断和重跑真正执行什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

heuristic加载事件及轨迹规则，遍历事件生成finding，root选最早step/事件顺序再用confidence打破平局；KeywordRule匹配事件文本关键词，EventErrorRule使用显式error字段。HeuristicAttributor重排finding而非因果干预，corrected_action为None。RerunWorkflow默认只plan，轨迹单独不具live执行能力；配置executor并execute=true才执行，模拟须allow_simulated，输出明示simulated与verified=false。ProcessLiveExecutor将request和完整源轨迹写临时文件，用环境变量传给配置进程，继承os.environ，subprocess.run捕获输出、默认1800s；非零退出/缺JSON失败，之后检proof模式、runner/framework、工具计数与事件。它信任runner声明的observed_execution而非独立捕获所有外部效果。

#### 证据与依据

**依据 1 · 源码核查**：[src/agentdebug/diagnose/detect/analyzers.py:37-82](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/diagnose/detect/analyzers.py#L37-L82)

规则遍历及报告

<details>
<summary>查看原文（46行）</summary>

```text
    def analyze(self, trajectory: AgentTrajectory) -> DiagnosticReport:
        pack_names = resolve_rule_pack_names(self.rule_packs, trajectory)
        event_rules = load_event_rules(pack_names)
        trajectory_rules = load_trajectory_rules(pack_names)
        findings = [
            finding
            for event in trajectory.events
            for finding in self._event_findings(event, trajectory, event_rules)
        ]
        findings.extend(self._trajectory_findings(trajectory, trajectory_rules))
        # Build event-order map so the root selector can fall back to it when
        # findings lack step_index (e.g., events recorded via traced_tool on
        # pre-0.2.4 captures that pre-date the auto-counter).
        event_order = {evt.event_id: i for i, evt in enumerate(trajectory.events)}
        root = self._select_root_cause(findings, event_order=event_order)
        suggestions = self._dedupe(
            finding.suggestion for finding in findings if finding.suggestion is not None
        )

        report = DiagnosticReport(
            trace_id=trajectory.trace_id,
            task_id=trajectory.task_id,
            findings=findings,
            suggestions=suggestions,
            metadata={
                'analyzer': self.__class__.__name__,
                'rule_packs': pack_names,
                'event_rule_count': len(event_rules),
                'trajectory_rule_count': len(trajectory_rules),
            },
        )
        if root is not None:
            report.root_cause_event_id = root.event_id
            report.root_cause_agent = root.agent_name
            # If the finding lacked an explicit step_index, fall back to the
            # event's position so root_cause_step_index is non-null in the UI
            # and the AgentTraceback header reads sensibly.
            inferred_step = root.step_index
            if inferred_step is None and root.event_id is not None:
                pos = event_order.get(root.event_id)
                if pos is not None:
                    inferred_step = pos
            report.root_cause_step_index = inferred_step
            report.summary = (
                f'Likely root cause: {root.failure_mode.name}'
                f' in {root.agent_name or "unknown agent"}'
```

</details>

**依据 2 · 源码核查**：[src/agentdebug/diagnose/detect/analyzers.py:163-190](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/diagnose/detect/analyzers.py#L163-L190)

最早finding选根因

<details>
<summary>查看原文（28行）</summary>

```text
    def _select_root_cause(
        self,
        findings: List[FailureFinding],
        *,
        event_order: Optional[dict[str, int]] = None,
    ) -> Optional[FailureFinding]:
        if not findings:
            return None
        # Primary key: step_index (None pushed to end).
        # Fallback: when step_index is None, use the event's position in the
        # trajectory so we still pick the *earliest* finding rather than just
        # the highest-confidence one.
        event_order = event_order or {}

        def _key(f: FailureFinding) -> tuple[int, int, int, float]:
            step = f.step_index if f.step_index is not None else 10**9
            order = (
                event_order.get(f.event_id, 10**9)
                if f.event_id is not None and f.step_index is None
                else 10**9
            )
            return (
                0 if f.step_index is not None else 1,
                step,
                order,
                -confidence_or_default(f.confidence),
            )

```

</details>

**依据 3 · 源码核查**：[src/agentdebug/diagnose/detect/rules/packs/core/rules.py:28-90](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/diagnose/detect/rules/packs/core/rules.py#L28-L90)

关键词及显式错误规则

<details>
<summary>查看原文（63行）</summary>

```text
class KeywordRule:
    rule_id: str
    mode_id: str
    needles: List[str]
    evidence: str
    confidence_basis: str
    priority: int
    rule_pack: str = 'core'

    def match(
        self,
        event: AgentEvent,
        text: str,
        trajectory: AgentTrajectory,
    ) -> Optional[RuleMatch]:
        lowered = text.lower()
        if not _contains(lowered, self.needles):
            return None
        return RuleMatch(
            mode_id=self.mode_id,
            evidence=[self.evidence],
            rule_id=self.rule_id,
            rule_pack=self.rule_pack,
            confidence_basis=self.confidence_basis,
            priority=self.priority,
        )


class EventErrorRule:
    rule_id = 'core.system.event_error'
    rule_pack = 'core'
    priority = 100

    def match(
        self,
        event: AgentEvent,
        text: str,
        trajectory: AgentTrajectory,
    ) -> Optional[RuleMatch]:
        if not event.error:
            return None
        if _event_type_value(event.event_type) in {
            EventType.TOOL_CALL.value,
            EventType.TOOL_RESULT.value,
        }:
            return RuleMatch(
                mode_id='system.tool_execution_error',
                evidence=[event.error],
                rule_id='core.system.tool_execution_error.explicit_error',
                rule_pack=self.rule_pack,
                confidence_basis='explicit error field on tool event',
                priority=self.priority,
            )
        return RuleMatch(
            mode_id='system.environment_error',
            evidence=[event.error],
            rule_id='core.system.environment_error.explicit_error',
            rule_pack=self.rule_pack,
            confidence_basis='explicit error field on non-tool event',
            priority=self.priority,
        )


```

</details>

**依据 4 · 源码核查**：[src/agentdebug/rerun/workflow.py:144-198](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/rerun/workflow.py#L144-L198)

执行开关与模拟标签

<details>
<summary>查看原文（55行）</summary>

```text
        trajectory: AgentTrajectory,
        *,
        execute: bool = False,
        checkpoint_policy: str = 'from_root_cause',
        checkpoint_event_id: Optional[str] = None,
    ) -> RerunWorkflowResult:
        """Run the second-stage workflow.

        When ``execute`` is false, this returns a plan only. When true, an
        executor must be configured and its resulting trajectory is compared
        against the original trajectory with local proxy evaluation.
        """

        plan = self.plan(
            report,
            trajectory,
            checkpoint_policy=checkpoint_policy,
            checkpoint_event_id=checkpoint_event_id,
        )
        if not execute:
            return RerunWorkflowResult(plan=plan)
        if self.executor is None:
            raise ValueError('Rerun execution requires an approved executor.')
        if not plan.capability.executable:
            raise ValueError(plan.capability.reason)

        execution = self.executor.run(plan.request)
        _validate_execution_result(execution, allow_simulated=self.allow_simulated)
        evaluation = evaluate_local_proxy(trajectory, execution.trajectory)
        return RerunWorkflowResult(
            plan=plan,
            execution=execution,
            evaluation=evaluation,
        )


def _validate_execution_result(
    execution: RerunResult,
    *,
    allow_simulated: bool,
) -> None:
    mode = execution.execution_mode
    if mode == LIVE_EXECUTION:
        if execution.metadata.get('observed_execution') is not True:
            raise ValueError(
                'live rerun result must confirm observed_execution=true'
            )
        return
    if mode == SIMULATED_ROLLOUT and allow_simulated:
        return
    if mode == SIMULATED_ROLLOUT:
        raise ValueError(
            'simulated rollout rejected: configure a live executor or explicitly '
            'allow simulation'
        )
```

</details>

**依据 5 · 源码核查**：[src/agentdebug/rerun/executors/process_live.py:50-119](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/rerun/executors/process_live.py#L50-L119)

实际子进程与临时文件

<details>
<summary>查看原文（70行）</summary>

```text

    def run(self, request: RerunRequest) -> RerunResult:
        with tempfile.TemporaryDirectory(prefix='agentdebug-rerun-') as temp_dir:
            workspace = Path(temp_dir)
            request_path = workspace / 'request.json'
            source_path = workspace / 'source.trajectory.json'
            output_path = workspace / 'result.json'
            request_path.write_text(
                json.dumps(asdict(request), indent=2),
                encoding='utf-8',
            )
            source_path.write_text(
                model_to_json(self.source, indent=2),
                encoding='utf-8',
            )
            process_env = {
                **os.environ,
                **self.env,
                'AGENTDEBUG_RERUN_REQUEST': str(request_path),
                'AGENTDEBUG_RERUN_SOURCE': str(source_path),
                'AGENTDEBUG_RERUN_OUTPUT': str(output_path),
            }
            completed = subprocess.run(
                self.command,
                cwd=self.cwd,
                env=process_env,
                capture_output=True,
                text=True,
                timeout=self.timeout,
                check=False,
            )
            if completed.returncode != 0:
                stderr = completed.stderr.strip()[-2000:]
                raise RuntimeError(
                    f'live rerun runner exited with {completed.returncode}: {stderr}'
                )
            if not output_path.exists():
                raise RuntimeError(
                    'live rerun runner did not write AGENTDEBUG_RERUN_OUTPUT'
                )
            try:
                payload = json.loads(output_path.read_text(encoding='utf-8'))
            except json.JSONDecodeError as exc:
                raise ValueError('live rerun output is not valid JSON') from exc

        trajectory, proof, metadata = parse_live_result(payload)
        trajectory.metadata.update(
            {
                'rerun_of': self.source.trace_id,
                'rerun_report_id': request.report_id,
                'rerun_policy': request.checkpoint.policy,
                'execution_mode': LIVE_EXECUTION,
                'observed_execution': True,
                'tools_executed': proof['tools_executed'],
                'live_runner': proof['runner'],
            }
        )
        return RerunResult(
            request=request,
            trajectory=trajectory,
            metadata={
                **metadata,
                'executor': self.id,
                'execution_mode': LIVE_EXECUTION,
                'observed_execution': True,
                'tools_executed': proof['tools_executed'],
                'runner': proof['runner'],
                'framework': proof.get('framework'),
                'tool_execution_count': proof['tool_execution_count'],
                'command': self.command[0],
```

</details>

**依据 6 · 源码核查**：[src/agentdebug/rerun/live_validation.py:12-64](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/rerun/live_validation.py#L12-L64)

自述执行proof校验

<details>
<summary>查看原文（53行）</summary>

```text
def parse_live_result(
    payload: Any,
) -> tuple[AgentTrajectory, dict[str, Any], dict[str, Any]]:
    """Validate live execution proof and return its observed trajectory."""

    if not isinstance(payload, dict):
        raise ValueError('live rerun output must be a JSON object')
    proof = payload.get('execution')
    if not isinstance(proof, dict):
        raise ValueError('live rerun output requires an execution proof object')
    if proof.get('mode') != LIVE_EXECUTION:
        raise ValueError('live rerun execution.mode must be live_execution')
    if proof.get('observed_execution') is not True:
        raise ValueError('live rerun execution.observed_execution must be true')
    tools_executed = proof.get('tools_executed')
    if not isinstance(tools_executed, bool):
        raise ValueError('live rerun execution.tools_executed must be a boolean')
    runner = str(proof.get('runner') or '').strip()
    if not runner:
        raise ValueError('live rerun execution.runner is required')
    framework = str(proof.get('framework') or '').strip()
    if not framework:
        raise ValueError('live rerun execution.framework is required')
    tool_execution_count = proof.get('tool_execution_count')
    if not isinstance(tool_execution_count, int) or tool_execution_count < 0:
        raise ValueError(
            'live rerun execution.tool_execution_count must be a non-negative integer'
        )
    if tools_executed != (tool_execution_count > 0):
        raise ValueError(
            'live rerun tools_executed must match tool_execution_count'
        )
    trajectory_payload = payload.get('trajectory')
    if not isinstance(trajectory_payload, dict):
        raise ValueError('live rerun output requires a trajectory object')
    trajectory = trajectory_from_json(json.dumps(trajectory_payload))
    if not trajectory.events:
        raise ValueError('live rerun trajectory must contain observed events')
    observed_tool_calls = sum(
        1
        for event in trajectory.events
        if str(getattr(event.event_type, 'value', event.event_type))
        == EventType.TOOL_CALL.value
    )
    if observed_tool_calls < tool_execution_count:
        raise ValueError(
            'live rerun trajectory does not contain the declared tool executions'
        )
    metadata = payload.get('metadata')
    return trajectory, proof, dict(metadata) if isinstance(metadata, dict) else {}


__all__ = ['parse_live_result']
```

</details>

#### 缺口

- 真实runner证据完整性与诊断准确率未独立运行
  **影响**：trusted runner可提供形式合格而不真实的证明，静态协议不足认证外部执行
  **进一步探讨**：用受控runner造无效proof、缺事件和错误结果，外部采集副作用核对

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些输出不能当根因、批准或成功证明？

**研究主题**：缺陷与关键质疑

#### 完整回答

最早finding是启发式而非因果证据，日志缺error仍可能任务失败。local proxy只数event.error减少就improved，不测任务目标、授权或副作用。重要反证：approval_required只是plan字段，Workflow.run只核execute和executor能力，不检查一次人类批准凭证；CLI未plan-only时配runner直接execute=true，所以调用方必须另设批准，不能称默认强审批。Process runner继承环境和指定cwd，没有沙箱或幂等保证，超时不证明所有后代/远端调用停止。LLM AllAtOnce路径渲染轨迹/发现给llm.complete，失败最多重试后heuristic fallback；本地存储不等该模式无外发。

#### 证据与依据

**依据 1 · 源码核查**：[src/agentdebug/rerun/workflow.py:125-174](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/rerun/workflow.py#L125-L174)

批准字段与执行门槛分离

<details>
<summary>查看原文（50行）</summary>

```text
            executor=self.executor,
            allow_simulated=self.allow_simulated,
        )
        return RerunPlan(
            request=request,
            capability=capability,
            status='planned' if capability.executable else 'not_executable',
            execution_required=capability.executable,
            approval_required=request.directive.requires_human_approval,
            reason=capability.reason,
            metadata={
                'source': 'diagnose',
                'has_trajectory_context': trajectory is not None,
            },
        )

    def run(
        self,
        report: DiagnosticReport,
        trajectory: AgentTrajectory,
        *,
        execute: bool = False,
        checkpoint_policy: str = 'from_root_cause',
        checkpoint_event_id: Optional[str] = None,
    ) -> RerunWorkflowResult:
        """Run the second-stage workflow.

        When ``execute`` is false, this returns a plan only. When true, an
        executor must be configured and its resulting trajectory is compared
        against the original trajectory with local proxy evaluation.
        """

        plan = self.plan(
            report,
            trajectory,
            checkpoint_policy=checkpoint_policy,
            checkpoint_event_id=checkpoint_event_id,
        )
        if not execute:
            return RerunWorkflowResult(plan=plan)
        if self.executor is None:
            raise ValueError('Rerun execution requires an approved executor.')
        if not plan.capability.executable:
            raise ValueError(plan.capability.reason)

        execution = self.executor.run(plan.request)
        _validate_execution_result(execution, allow_simulated=self.allow_simulated)
        evaluation = evaluate_local_proxy(trajectory, execution.trajectory)
        return RerunWorkflowResult(
            plan=plan,
```

</details>

**依据 2 · 源码核查**：[src/agentdebug/cli/legacy.py:1064-1126](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/cli/legacy.py#L1064-L1126)

CLI实际live执行入口

<details>
<summary>查看原文（63行）</summary>

```text
        return 2
    runner_command = str(
        args.runner_command or os.environ.get('AGENTDEBUG_RERUN_COMMAND') or ''
    ).strip()
    explicit_modes = sum(
        bool(value) for value in (runner_command, args.runner, args.simulate)
    )
    if explicit_modes > 1:
        print(
            'rerun accepts only one of --runner, --runner-command, or --simulate.',
            file=sys.stderr,
        )
        return 2
    if args.runner:
        try:
            _, runner = _configured_runner(args.runner)
            executor = _http_executor_from_config(runner, trajectory)
        except Exception as exc:
            print(f'rerun failed: {exc}', file=sys.stderr)
            return 4
        workflow = RerunWorkflow(executor)
    elif runner_command:
        from agentdebug.rerun import ProcessLiveExecutor

        runner_env = _live_runner_llm_env(args)
        executor = ProcessLiveExecutor(
            runner_command,
            trajectory,
            cwd=args.runner_cwd,
            timeout=args.runner_timeout,
            env=runner_env,
        )
        workflow = RerunWorkflow(executor)
    elif args.simulate:
        llm = _build_llm(args, command_name='rerun --simulate')
        if llm is None:
            return 4
        from agentdebug.rerun import LLMContinuationExecutor, RolloutContext

        executor = LLMContinuationExecutor(llm, RolloutContext(trajectory))
        workflow = RerunWorkflow(executor, allow_simulated=True)
    else:
        try:
            _, runner = _configured_runner(None)
            executor = _http_executor_from_config(runner, trajectory)
            workflow = RerunWorkflow(executor)
        except ValueError:
            print(
                'rerun requires a configured HTTP runner, --runner-command, or '
                '--simulate. Add one with `agentdebug config set-runner`.',
                file=sys.stderr,
            )
            return 4
    try:
        result = workflow.run(
            report,
            trajectory,
            execute=True,
            checkpoint_policy=checkpoint_policy,
            checkpoint_event_id=checkpoint_event_id,
        )
    except Exception as exc:
        print(f'rerun failed: {exc}', file=sys.stderr)
```

</details>

**依据 3 · 源码核查**：[src/agentdebug/rerun/branch.py:34-57](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/rerun/branch.py#L34-L57)

代理效果仅错误计数

<details>
<summary>查看原文（24行）</summary>

```text
    original: AgentTrajectory,
    rerun: AgentTrajectory,
) -> RerunComparison:
    """Compare two trajectories using local error counts only."""

    original_errors = _error_count(original)
    rerun_errors = _error_count(rerun)
    if rerun_errors < original_errors:
        result = 'improved'
    elif rerun_errors > original_errors:
        result = 'worse'
    else:
        result = 'unchanged'
    return RerunComparison(
        original_trace_id=original.trace_id,
        rerun_trace_id=rerun.trace_id,
        original_error_count=original_errors,
        rerun_error_count=rerun_errors,
        result=result,
    )


def _error_count(trajectory: AgentTrajectory) -> int:
    return sum(1 for event in trajectory.events if event.error)
```

</details>

**依据 4 · 源码核查**：[src/agentdebug/diagnose/attribute/attribution.py:387-420](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/diagnose/attribute/attribution.py#L387-L420)

LLM归因请求及失败回退

<details>
<summary>查看原文（34行）</summary>

```text
    def attribute(
        self,
        trajectory: AgentTrajectory,
        findings: Optional[List[FailureFinding]] = None,
    ) -> AttributionResult:
        findings = findings or []
        prompt_user = self._render_prompt(trajectory, findings[: self.max_findings])
        system_prompt = (
            _ATTR_SYSTEM_PROMPT_WITH_ACTION
            if self.propose_corrected_action
            else _ATTR_SYSTEM_PROMPT
        )
        messages = [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': prompt_user},
        ]
        result = None
        for _attempt in range(2):
            try:
                result = self.llm.complete(messages=messages, max_tokens=self.max_tokens)
                break
            except Exception as exc:  # pragma: no cover - defensive
                if _attempt == 0:
                    LOG.warning('LLM attribution failed (retrying in 2s): %s', exc)
                    time.sleep(2)
                else:
                    LOG.warning('LLM attribution failed; falling back: %s', exc)
                    return self.fallback.attribute(trajectory, findings)
        parsed = extract_json_block(result.text)
        if not parsed:
            LOG.info('LLM attributor returned no JSON; falling back')
            return self.fallback.attribute(trajectory, findings)
        blame = Blame(
            span_id=self._coerce_str(parsed.get('span_id')),
```

</details>

#### 缺口

- 因果正确性、模型数据保留与外部副作用停止未验证
  **影响**：可误把少报错误当修复、把批准元数据当授权，敏感轨迹可能发模型
  **进一步探讨**：只用脱敏离线heuristic起步，live前独立审批、最小环境与外部任务验收

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用、成本与退出怎样区分三种模式？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

根包Python>=3.9<4、Pydantic和httpx，可先用只读脱敏轨迹离线heuristic，无模型调用但仍有本地轨迹/报告存储。JsonlTraceStore默认.agentdebug/traces.jsonl及同stem.reports.jsonl追加完整结构，后者按report_id取最新，删除文件前确认保留策略。LLM模式另配模型端点/密钥并审轨迹外发和token成本。live模式还需应用自有runner、工具权限、凭据及可复原环境；配置命令继承本进程环境，必须用隔离账号/目录，外置批准和费用限制。退出先停止capture/UI/runner并核外部进程、撤API/runner凭据，再清.agentdebug及导出报告；临时rerun目录会在with结束删除，但项目/外部系统变更不会回滚。DSH子包是另装入口，不把Python卸载当宿主移除。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:56-65](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/pyproject.toml#L56-L65)

Python和基本依赖

<details>
<summary>查看原文（10行）</summary>

```text
]

[tool.poetry.dependencies]
python = ">=3.9, <4.0"
# Pydantic v1 and v2 both supported via runtime shims in agentdebug.models.
pydantic = ">=1.10,<3.0"
# httpx powers the OpenAI-compatible LLM client.
httpx = ">=0.24,<1.0"

# GUI / computer-use (OSWorld / CUA) integration — optional.
```

</details>

**依据 2 · 源码核查**：[src/agentdebug/runtime/storage.py:46-104](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/runtime/storage.py#L46-L104)

默认本地追加存储

<details>
<summary>查看原文（59行）</summary>

```text
    """Append-only local store for quick adoption and reproducible examples."""

    def __init__(self, path: str = '.agentdebug/traces.jsonl') -> None:
        self.path = Path(path)
        self.reports_path = self.path.with_name(self.path.stem + '.reports.jsonl')
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def save_trajectory(self, trajectory: AgentTrajectory) -> None:
        with self.path.open('a', encoding='utf-8') as handle:
            handle.write(model_to_json(trajectory))
            handle.write('\n')

    def load_trajectory(self, trace_id: str) -> Optional[AgentTrajectory]:
        if not self.path.exists():
            return None
        match = None
        with self.path.open('r', encoding='utf-8') as handle:
            for idx, line in enumerate(handle):
                if not line.strip():
                    continue
                candidate = trajectory_from_jsonl_record(line, idx)
                if candidate.trace_id == trace_id:
                    match = candidate
        return match

    def list_traces(self) -> List[str]:
        if not self.path.exists():
            return []
        trace_ids = []
        with self.path.open('r', encoding='utf-8') as handle:
            for idx, line in enumerate(handle):
                if not line.strip():
                    continue
                trace_ids.append(trajectory_from_jsonl_record(line, idx).trace_id)
        return trace_ids

    def save_report(self, report: DiagnosticReport) -> None:
        with self.reports_path.open('a', encoding='utf-8') as handle:
            handle.write(model_to_json(report))
            handle.write('\n')

    def list_reports(self, trace_id: Optional[str] = None) -> List[DiagnosticReport]:
        if not self.reports_path.exists():
            return []
        reports: dict[str, DiagnosticReport] = {}
        with self.reports_path.open('r', encoding='utf-8') as handle:
            for line in handle:
                if not line.strip():
                    continue
                report = report_from_json(line)
                if trace_id is None or report.trace_id == trace_id:
                    reports[report.report_id] = report
        return sorted(reports.values(), key=lambda item: item.generated_at, reverse=True)

    def load_report(
        self, trace_id: str, report_id: str
    ) -> Optional[DiagnosticReport]:
        return next(
            (r for r in self.list_reports(trace_id) if r.report_id == report_id),
```

</details>

**依据 3 · 源码核查**：[src/agentdebug/rerun/executors/process_live.py:50-95](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/rerun/executors/process_live.py#L50-L95)

完整轨迹、继承环境、临时目录

<details>
<summary>查看原文（46行）</summary>

```text

    def run(self, request: RerunRequest) -> RerunResult:
        with tempfile.TemporaryDirectory(prefix='agentdebug-rerun-') as temp_dir:
            workspace = Path(temp_dir)
            request_path = workspace / 'request.json'
            source_path = workspace / 'source.trajectory.json'
            output_path = workspace / 'result.json'
            request_path.write_text(
                json.dumps(asdict(request), indent=2),
                encoding='utf-8',
            )
            source_path.write_text(
                model_to_json(self.source, indent=2),
                encoding='utf-8',
            )
            process_env = {
                **os.environ,
                **self.env,
                'AGENTDEBUG_RERUN_REQUEST': str(request_path),
                'AGENTDEBUG_RERUN_SOURCE': str(source_path),
                'AGENTDEBUG_RERUN_OUTPUT': str(output_path),
            }
            completed = subprocess.run(
                self.command,
                cwd=self.cwd,
                env=process_env,
                capture_output=True,
                text=True,
                timeout=self.timeout,
                check=False,
            )
            if completed.returncode != 0:
                stderr = completed.stderr.strip()[-2000:]
                raise RuntimeError(
                    f'live rerun runner exited with {completed.returncode}: {stderr}'
                )
            if not output_path.exists():
                raise RuntimeError(
                    'live rerun runner did not write AGENTDEBUG_RERUN_OUTPUT'
                )
            try:
                payload = json.loads(output_path.read_text(encoding='utf-8'))
            except json.JSONDecodeError as exc:
                raise ValueError('live rerun output is not valid JSON') from exc

        trajectory, proof, metadata = parse_live_result(payload)
```

</details>

**依据 4 · 源码核查**：[src/agentdebug/rerun/workflow.py:202-249](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/rerun/workflow.py#L202-L249)

只轨迹不能live及需runtime环境

<details>
<summary>查看原文（48行）</summary>

```text
def assess_rerun_capability(
    trajectory: Optional[AgentTrajectory],
    *,
    executor: Optional[RerunExecutor] = None,
    allow_simulated: bool = False,
) -> RerunCapability:
    """Classify trajectory-only, replay-bundle, and live-runner inputs."""

    available = ['diagnostic_report']
    if trajectory is not None:
        available.append('trajectory')
    replay = _replay_capabilities(trajectory)
    available.extend(replay)
    mode = str(getattr(executor, 'execution_mode', '') or '') if executor else ''
    if mode == LIVE_EXECUTION:
        return RerunCapability(
            level='live_runner',
            executable=True,
            execution_mode=LIVE_EXECUTION,
            available=tuple(available + ['framework_runner', 'tool_runtime']),
            reason='Live framework runner is configured for real model/tool execution.',
        )
    if mode == SIMULATED_ROLLOUT and allow_simulated:
        return RerunCapability(
            level='trajectory_only',
            executable=True,
            execution_mode=SIMULATED_ROLLOUT,
            missing=('framework_runner', 'tool_runtime', 'environment_state'),
            available=tuple(available),
            reason='Only an explicitly labeled simulation can run; no tools are executed.',
        )
    level = 'replay_bundle' if replay else 'trajectory_only'
    missing = ['framework_runner', 'tool_runtime', 'environment_state']
    if 'environment_snapshot' in replay:
        missing.remove('environment_state')
    if 'tool_manifest' in replay:
        missing.remove('tool_runtime')
    return RerunCapability(
        level=level,
        executable=False,
        missing=tuple(missing),
        available=tuple(available),
        reason=(
            'Real rerun is unavailable from a trajectory alone. Configure a live '
            'framework runner that owns the model, tools, credentials, and environment.'
            if level == 'trajectory_only'
            else 'Replay metadata is present, but a live framework runner is still required.'
        ),
```

</details>

#### 缺口

- 本轮没有安装/capture/live/清理测试，磁盘增长、模型账单和退出耗时未知
  **影响**：不能把local-first推成零成本、无隐私风险或可一键回滚
  **进一步探讨**：先限文件与事件规模留原件，测离线报告；live独立验证批准、超时及幂等后再开

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎么证伪诊断和恢复的净价值？

**研究主题**：新假设与验证

#### 完整回答

同一批带独立已知故障的轨迹，比较人工读日志、heuristic和LLM诊断，核定位准确/漏报及人工耗时；root选择最早finding应加入早期无关警告、后期真实故障反例。恢复比较同一初始快照下原任务与建议重跑，外部业务验收、重复副作用和实费独立记录；模拟不得并入live成功。若归因不准、只是错误字段变少或恢复重放未批准效果，则停用live，保留报告辅助人工排错。

#### 证据与依据

**依据 1 · 源码核查**：[src/agentdebug/diagnose/detect/analyzers.py:163-190](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/diagnose/detect/analyzers.py#L163-L190)

最早finding可构造反例

<details>
<summary>查看原文（28行）</summary>

```text
    def _select_root_cause(
        self,
        findings: List[FailureFinding],
        *,
        event_order: Optional[dict[str, int]] = None,
    ) -> Optional[FailureFinding]:
        if not findings:
            return None
        # Primary key: step_index (None pushed to end).
        # Fallback: when step_index is None, use the event's position in the
        # trajectory so we still pick the *earliest* finding rather than just
        # the highest-confidence one.
        event_order = event_order or {}

        def _key(f: FailureFinding) -> tuple[int, int, int, float]:
            step = f.step_index if f.step_index is not None else 10**9
            order = (
                event_order.get(f.event_id, 10**9)
                if f.event_id is not None and f.step_index is None
                else 10**9
            )
            return (
                0 if f.step_index is not None else 1,
                step,
                order,
                -confidence_or_default(f.confidence),
            )

```

</details>

**依据 2 · 源码核查**：[src/agentdebug/rerun/branch.py:34-57](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/rerun/branch.py#L34-L57)

错误计数不足业务验证

<details>
<summary>查看原文（24行）</summary>

```text
    original: AgentTrajectory,
    rerun: AgentTrajectory,
) -> RerunComparison:
    """Compare two trajectories using local error counts only."""

    original_errors = _error_count(original)
    rerun_errors = _error_count(rerun)
    if rerun_errors < original_errors:
        result = 'improved'
    elif rerun_errors > original_errors:
        result = 'worse'
    else:
        result = 'unchanged'
    return RerunComparison(
        original_trace_id=original.trace_id,
        rerun_trace_id=rerun.trace_id,
        original_error_count=original_errors,
        rerun_error_count=rerun_errors,
        result=result,
    )


def _error_count(trajectory: AgentTrajectory) -> int:
    return sum(1 for event in trajectory.events if event.error)
```

</details>

**依据 3 · 源码核查**：[src/agentdebug/rerun/workflow.py:60-75](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/src/agentdebug/rerun/workflow.py#L60-L75)

模拟与执行展示分离

<details>
<summary>查看原文（16行）</summary>

```text
    def to_dict(self) -> dict[str, Any]:
        execution_mode = self.execution.execution_mode if self.execution else None
        simulated = execution_mode == SIMULATED_ROLLOUT
        payload = {
            'stage': 'rerun',
            'status': 'simulated' if simulated else 'executed' if self.executed else self.plan.status,
            'execution_mode': execution_mode,
            'plan': self.plan.to_dict(),
            'executed': self.executed,
            'live_execution': execution_mode == LIVE_EXECUTION,
            'verified': False if simulated else None,
            'evaluation': asdict(self.evaluation) if self.evaluation else None,
        }
        if simulated and payload['evaluation'] is not None:
            payload['evaluation']['scope'] = 'simulated_trajectory_only'
            payload['evaluation']['verified_task_outcome'] = False
```

</details>

#### 缺口

- 没有本轮对照或真实恢复成功证据
  **影响**：不能宣称提高任务成功率或自动修复
  **进一步探讨**：保留原始日志、盲标根因、报告和外部验收，不按报告confidence自评

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
