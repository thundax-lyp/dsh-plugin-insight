# Caliper

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[96eb25f](https://github.com/edonadei/caliper/tree/96eb25fc6948e726f72cda5abe3bc489cf4de021)

<!-- BEGIN META -->
[![GitHub ★ 229](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=229&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/edonadei/caliper)
<!-- END META -->

> **功能**：真实安装 Agent Skill，重复运行任务并分别评估激活、执行检查与有无 Skill 的差异。

> **亮点**：[Q01](#research-q01) 将Skill自然发现、重复任务和activation独立评分串联，[Q02](#research-q02)保留infra／timeout／judge_error与环境漂移，使单次演示之外的回归可被定位。已有CLI执行和LLM判断是继承能力，不把README示例增益当普遍收益。

> **主要限制**：[Q02](#research-q02) Rule B只聚合产出verdict的检查，assert过而expect故障也可PASS，compare按任务名而非语义完全一致配对。[Q03](#research-q03)默认用户工具和危险绕过审批选项使fresh attempt不能当隔离；正式结论须审缺判、可用分母和真实权限。

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
  - [Q01 · Skill评测给谁增加什么，activation和结果为何分开？](#detail-section-11)
  - [Q02 · 从fresh attempt到检查结果和compare的成功／失败怎么定义？](#detail-section-12)
  - [Q03 · fresh home是否安全隔离，默认环境和全周期成本是什么？](#detail-section-13)
  - [Q04 · ablation差异何时不能归因Skill，新方向怎样证伪？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：自有Skill维护者要在修改／模型更新／邻居竞争后判断触发和任务正确性。替代为单次手测；合格结果是逐attempt可追溯检查与环境一致的双臂实验，不是一次漂亮成功。

手动显式调用Skill一次、人工看输出；成熟重复评测、消融和CLI能力是先例，增量是安装发现/activation/多类结果与compare诊断的组合。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 安装与自然激活评测 | 检查Skill是否被选择 | backend实际发现行为待验 |
| 任务断言与judge | 分开激活、执行和基础设施结果 | 缺判可被剩余verdict覆盖；会执行Python |
| ablation/compare | 审Skill增量与环境漂移 | warning非因果保证；需控制双臂条件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python3.10+与匹配CLI | 必需 | 执行评测 | 根Alpha0.21.0，后端能力不同 |
| 模型／认证与可选judge | 对应任务需 | Agent与expect判断 | refusal/infra与无判单列 |
| 可信spec／Skill／脚本 | 必需 | 安装、setup和断言 | 会实际执行shell/Python |
| 真正独立执行环境 | 推荐试用前提 | 限制本机／网络副作用 | fresh home不是sandbox |
| 固定双臂条件 | 归因必需 | 比较Skill贡献 | warning不自动封锁漂移 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 自有非敏感Skill、独立环境、关闭customizations | 核CLI工具／账户权限 |
| 写spec | 维护者先定义激活与可验断言 | k1核检查而非调分 |
| 执行 | 固定模型/来源做小双臂 | 读retries/outcome/hook与缺判 |
| 比较 | 核同名任务实际prompt/setup/assert与环境 | 主成功率不单独决定归因 |
| 退出 | 保存JSON与必要证据、撤销测试凭据 | 临时清除不回滚外部副作用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | CLI/模型/隔离环境 | 写spec与可信assert、固定来源 | 金额工时未知 |
| 持续 | k次Agent、双臂、expect judge | 核缺判、漂移和任务代表性 | token/墙钟非美元封顶 |
| 失败恢复 | 节流重试和重跑模型 | 查infra/timeout/judge_error | k不是最大spawn数 |
| 退出 | JSON与必要原件保留 | 撤销登录／权限，确认外部动作 | 临时目录删除不撤销已发生写入 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 激活诊断 | 真实发现与独立activation | CLI实际版本兼容 |
| 任务检查 | assert/autorater与多类outcome | 缺判时PASS是否满足全部预期 |
| 消融比较 | 漂移warning和匹配集合 | 自动因果归因或普遍提升 |
| 权限安全 | 可关闭用户层、临时目录 | 没有OS sandbox保证 |

> **思考**：[Q02](#research-q02) Rule B只聚合产出verdict的检查，assert过而expect故障也可PASS，compare按任务名而非语义完全一致配对。[Q03](#research-q03)默认用户工具和危险绕过审批选项使fresh attempt不能当隔离；正式结论须审缺判、可用分母和真实权限。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将Skill自然发现、重复任务和activation独立评分串联，[Q02](#research-q02)保留infra／timeout／judge_error与环境漂移，使单次演示之外的回归可被定位。已有CLI执行和LLM判断是继承能力，不把README示例增益当普遍收益。

[Q02](#research-q02) 生命周期与判定分离、infra不误算任务fail、None不补0和完整逐检查字段值得借鉴；[Q03](#research-q03) sandbox命名不可误读为执行隔离，hook/autorater脚本仍本机权限。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) Rule B只聚合产出verdict的检查，assert过而expect故障也可PASS，compare按任务名而非语义完全一致配对。[Q03](#research-q03)默认用户工具和危险绕过审批选项使fresh attempt不能当隔离；正式结论须审缺判、可用分母和真实权限。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03)仅在独立环境对可信spec小试，先关闭user customizations并查实际工具清单。比较时审全部verdict和usable分母、同名任务语义；不一致先修实验，无法控制权限则退回原CLI手动核验。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持真实发现、activation与任务结果分开及漂移诊断；无本轮CLI/模型运行。fresh home不构成安全隔离，Rule B缺判与比较条件须人工复核。

- 已检查：作者 README、包清单、源码路径 README.md、caliper/attempt.py、caliper/compare.py、caliper/harness/claude_code.py、caliper/harness/codex.py、caliper/harness/user_layer.py、caliper/judge/eval_judge.py、caliper/runner.py、caliper/sandbox.py、caliper/schema/results.py、caliper/workdir.py、pyproject.toml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根Python tool source研究，定向runner/attempt/judge/compare、Codex与Claude权限／connector、user layer、workdir与cheat判定。未全审Pi/Hermes后端、登录／git下载、全部MCP插值和结果持久层；无目标执行。
- 下一步：[Q04](#research-q04)固定环境小spec先核真实发现、judge故障、同名换检查与工具漂移，再做双臂；本轮未安装／登录／执行，不把作者示例或test存在当通过。

**分析版本**

- **仓库**：[edonadei/caliper](https://github.com/edonadei/caliper)
- **版本号**：未声明（[固定提交 96eb25f](https://github.com/edonadei/caliper/tree/96eb25fc6948e726f72cda5abe3bc489cf4de021)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 推导补充“全检查都有verdict”的并列口径与任务语义摘要，可能减少缺判／漂移假增益。用同名换断言、judge故障、环境变化和真改进四组盲测；错误归因不降或误阻断增即否定，尚未实现不计贡献。

[Q04](#research-q04)固定环境小spec先核真实发现、judge故障、同名换检查与工具漂移，再做双臂；本轮未安装／登录／执行，不把作者示例或test存在当通过。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 54 | 6885 | — | — | 58140 |
| .md | example | 7 | 238 | — | — | 1610 |

</details>

**活跃度**

[![Issue 未关闭 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=16&color=737b86&logo=github)](https://github.com/edonadei/caliper/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 15](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=15&color=737b86&logo=github)](https://github.com/edonadei/caliper/issues?q=is%3Aissue+created%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z) [![近30天关闭 18](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=18&color=737b86&logo=github)](https://github.com/edonadei/caliper/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查Skill评测的真实安装、检查口径、ablation可比性和本机执行权限。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Skill评测给谁增加什么，activation和结果为何分开？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Caliper是Python评测CLI与配套写spec的Skill，根类型tool，不是DSH插件。Skill维护者在改描述、正文、模型或竞争邻居后，需要知道它是否自然触发、每次是否完成任务以及相对无Skill有没有增量。基线是单次手动显式调用Skill并看满意回答，易掩盖触发失败和随机性。合格交付是逐attempt原始记录、明确检查与可比实验，不是pass@k好看或一次演示。

它把Skill真实安装到CLI发现位置，不直接贴入prompt；重复任务并独立记录activation、执行断言与LLM judge。activation-only没有业务检查时记NOT_CHECKED不付judge，超时／基础设施失败时已观察加载仍保留、无观察记未知而非“未加载”。success_rate以usable尝试为分母，无可用尝试为null，不把0与未知混写。增加的是评测工作流与口径，CLI执行／模型判断仍来自后端；README示例的100%和token下降仅示例任务作者结果，不能外推任意Skill。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:40-90](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/README.md#L40-L90)

作者提出真实安装、activation、ablation和raw成功率。

<details>
<summary>查看原文（51行）</summary>

```text

<table>
<tr>
<td width="33%" valign="top">

**Real installs**<br>
Your skill is installed where the agent looks, never pasted into the prompt.

</td>
<td width="33%" valign="top">

**Activation scoreboard**<br>
Did the agent <i>pick</i> your skill? Scored apart from whether it worked.

</td>
<td width="33%" valign="top">

**Neighbourhoods**<br>
Declare competing skills and assert which one should win each prompt.

</td>
</tr>
<tr>
<td width="33%" valign="top">

**Ablation**<br>
<code>--ablate</code> re-runs without the skill. Same score? It isn't earning its context.

</td>
<td width="33%" valign="top">

**Honest numbers**<br>
Single-run success rate first. <code>pass@k</code> flatters flaky skills.

</td>
<td width="33%" valign="top">

**Four agents**<br>
Claude Code, Codex, Pi, Hermes. One spec, pick the engine at run time.

</td>
</tr>
</table>

## Quick start

<table>
<tr>
<th width="50%">🤖 In your agent</th>
<th width="50%">⌨️ In your terminal</th>
</tr>
```

</details>

**依据 2 · 源码核查**：[caliper/runner.py:509-526](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/runner.py#L509-L526)

实际安装发现、同attempt节流重试说明。

<details>
<summary>查看原文（18行）</summary>

```text
def _invoke_agent(
    task: TaskSpec, attempt: int, env: _RunEnv, workdir: AttemptWorkdir
) -> RetriedInvocation:
    # The neighbourhood is *installed* by the harness at its own skills root
    # and never preloaded.
    def invoke():
        # Built inside the closure, so a retried attempt gets its own
        # context rather than the previous invocation's scratch
        # (docs/adr/0019 — the attempt is the shot, not the spawn).
        return env.harness.run(env.environment.context(task, attempt, workdir))

    # A throttled invocation measured nothing, so it is retried rather than
    # recorded — the attempt is the shot at the task, not the spawn
    # (docs/adr/0019). The retry holds this worker: under throttling there is
    # no other work to give the slot, since every peer is meeting the same
    # 429. Raises SpendingCapReached, which the job above turns into a run
    # abort.
    return invoke_with_retry(invoke)
```

</details>

**依据 3 · 源码核查**：[caliper/attempt.py:120-140](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/attempt.py#L120-L140)

失败截断的activation保留与未知。

<details>
<summary>查看原文（21行）</summary>

```text
    # A timeout or infra failure can cut the transcript off partway. A skill we
    # saw load before the cut still loaded, so keep it. Seeing nothing is
    # ambiguous (nothing loaded, or we missed it), so record ``None``, not an
    # empty list. Neither is graded. See docs/CONTEXT.md → Activation admissibility.
    observed = activation.detect(
        result.transcript,
        additional_names=result.user_skill_names,
        additional_paths=result.user_skill_paths,
    )
    builtin = activation.detect_builtin(
        result.transcript,
        result.builtin_skill_names,
        plugin_paths=result.user_skill_paths,
    )
    if pre_judge is None:
        activated = observed
        activation_passed = check_activation(activated, expected_activation)
    else:
        activated = observed or None
        builtin = builtin or None
        activation_passed = None
```

</details>

**依据 4 · 源码核查**：[caliper/attempt.py:178-207](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/attempt.py#L178-L207)

cheat、activation-only与judge接线。

<details>
<summary>查看原文（30行）</summary>

```text
    cheat_violations = sandbox.violations(result.transcript)
    if cheat_violations:
        return with_outcome(Outcome.CHEAT, cheat_evidence=cheat_violations)

    # An `activates:`-only task authored no execution check, so there is nothing
    # to grade — skip the (paid) judge call rather than spending it to receive a
    # non-verdict and label the attempt an error. Ranks below cheat so a
    # forbidden-file read is still caught on a trigger probe.
    if not (task.expect or task.assert_script):
        return with_outcome(Outcome.NOT_CHECKED)

    judge_result = judge.evaluate(
        task=task,
        transcript=result.transcript,
        workdir=workdir,
        history=history,
    )
    return with_outcome(
        _judge_outcome(judge_result),
        judge_model=judge_result.resolved_model,
        # The judge times its own autorater: only a model call is judge time
        # (docs/CONTEXT.md → Judge time), and every earlier exit above leaves
        # it None, which is the difference between "the judge was fast" and
        # "no judge ran".
        judge_seconds=judge_result.autorater_seconds,
        assert_passed=judge_result.assert_passed,
        assert_evidence=judge_result.assert_evidence,
        autorater_passed=judge_result.autorater_passed,
        autorater_reasoning=judge_result.autorater_reasoning,
        autorater_script=judge_result.autorater_script,
```

</details>

**依据 5 · 源码核查**：[caliper/schema/results.py:363-376](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/schema/results.py#L363-L376)

raw成功率按usable分母且无数据null。

<details>
<summary>查看原文（14行）</summary>

```text
def success_rate(successes: int, usable: int) -> float | None:
    """The **raw** per-attempt success rate — Caliper's primary metric.

    ``None`` when no attempt got a fair shot (``usable == 0``): a task that was
    never measured has no rate, which is not the same claim as ``0.0``.

    This and its two siblings live beside :class:`Outcome` and
    :class:`TaskResult` because they are defined over an attempt set and
    ``Outcome.is_usable`` is what carves that set out. The run-level roll-ups
    below build on them; nothing re-derives them. See
    docs/adr/0007-raw-success-rate-is-the-primary-metric.md and
    docs/CONTEXT.md → Usable / unusable attempt.
    """
    return successes / usable if usable > 0 else None
```

</details>

#### 缺口

- 真实维护者是否据此减少回归或无效Skill上下文未对照。
  **影响**：不能宣称普遍成功率或节时收益。
  **进一步探讨**：先选自有非敏感Skill固定检查，比较单次手测发现的回归与重复ablation新增发现。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从fresh attempt到检查结果和compare的成功／失败怎么定义？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

runner每attempt建新workdir，先setup再调用CLI，最后cleanup，setup失败形成记录，cleanup失败单独附hook_failures。节流调用可多次spawn仍只算一个attempt，记retries；因此k不是最多CLI调用次数或绝对现金预算。工作区退出会删临时目录，JSON保留transcript／判断脚本不等完整原始文件快照。

assemble先分timeout、非零退出、CLI明确refusal、甚至零退出却未观察模型调用等infra情况，跳过付费judge；之后检查转录中的forbidden path作为CHEAT，再运行显式assert与expect。Judge可以直接文本裁决或生成Python脚本执行；断言超时返回None，LLM异常也无verdict。Rule B只聚合有verdict的检查，至少一个存在且全True就PASS；例如assert通过而expect的autorater出错，仍可PASS，不能称“每个作者声明的检查全通过”。没有任何检查产出才JUDGE_ERROR，activation与业务成功分开。

compare按task_name匹配，同名重复任务按位置配对，只在双方测量的可比集合做汇总；spec路径／k／工具邻居／customizations／judge／git来源漂移可给warning。它不是强制prompt／setup／assert内容完全一致的实验封锁：同名任务或模型环境变化仍需人核对，警告不等禁止比较。成功率也受usable选择影响，不能只看主数而隐藏timeout／infra／judge无判和hook失败。

#### 证据与依据

**依据 1 · 源码核查**：[caliper/runner.py:443-480](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/runner.py#L443-L480)

fresh workdir、setup/cleanup与记录生命周期。

<details>
<summary>查看原文（38行）</summary>

```text
def _run_attempt(task: TaskSpec, attempt: int, env: _RunEnv) -> AttemptRecord | None:
    """Run one attempt end to end: its lifecycle here, its verdict next door.

    This function owns what an attempt *costs* — the task's setup/cleanup
    hooks around one harness invocation, in a fresh :class:`AttemptWorkdir` —
    and hands how it ended to :func:`caliper.attempt.assemble_attempt`, which
    owns what it *means*, including whether it is a record at all.

    Raises :class:`StepCancelled` when the run's cancellation killed a step;
    the job above turns that into no record at all.
    """
    failures: list[HookFailure] = []
    record: AttemptRecord | None = None
    with AttemptWorkdir(env.spec_path.parent) as workdir:
        try:
            setup = _run_hook(workdir, task, attempt, "setup")
            if setup is not None:
                failure, reason = setup
                failures.append(failure)
                record = _assemble(SetupFailed(reason), task, attempt, env, workdir)
            elif not cancel.requested():
                invoked = _invoke_agent(task, attempt, env, workdir)
                record = _assemble(
                    invoked.result, task, attempt, env, workdir, invoked.retries
                )
        finally:
            try:
                cleanup = _run_hook(workdir, task, attempt, "cleanup")
            except StepCancelled:
                # A cancellation that arrived during cleanup: the attempt it
                # tidies up after is still evidence.
                cleanup = None
            if cleanup is not None:
                failures.append(cleanup[0])
            env.hook_failures.extend(failures)
    if record is not None:
        record.hook_failures.extend(failures)
    return record
```

</details>

**依据 2 · 源码核查**：[caliper/runner.py:509-526](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/runner.py#L509-L526)

节流重试与多调用同attempt。

<details>
<summary>查看原文（18行）</summary>

```text
def _invoke_agent(
    task: TaskSpec, attempt: int, env: _RunEnv, workdir: AttemptWorkdir
) -> RetriedInvocation:
    # The neighbourhood is *installed* by the harness at its own skills root
    # and never preloaded.
    def invoke():
        # Built inside the closure, so a retried attempt gets its own
        # context rather than the previous invocation's scratch
        # (docs/adr/0019 — the attempt is the shot, not the spawn).
        return env.harness.run(env.environment.context(task, attempt, workdir))

    # A throttled invocation measured nothing, so it is retried rather than
    # recorded — the attempt is the shot at the task, not the spawn
    # (docs/adr/0019). The retry holds this worker: under throttling there is
    # no other work to give the slot, since every peer is meeting the same
    # 429. Raises SpendingCapReached, which the job above turns into a run
    # abort.
    return invoke_with_retry(invoke)
```

</details>

**依据 3 · 源码核查**：[caliper/attempt.py:247-297](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/attempt.py#L247-L297)

prejudge失败与judge outcome定义。

<details>
<summary>查看原文（51行）</summary>

```text
def _classify_pre_judge(harness: AttemptResult) -> _PreJudgeExit | None:
    """The terminal outcome an attempt earns from its harness result alone.

    Returns a ``TIMEOUT`` or ``INFRA_ERROR`` exit when the attempt never got a
    fair shot, so it must skip cheat detection and the (paid) judge entirely;
    returns ``None`` when the attempt ran cleanly enough to proceed.
    ``assemble_attempt`` both skips on it and records it as the label, so the
    two cannot disagree. The harness's own error, when it reported one, is the
    evidence; otherwise the branch says what it saw.
    """

    def ends(outcome: Outcome, seen: str) -> _PreJudgeExit:
        return _PreJudgeExit(outcome, harness.error or seen)

    exited = f"harness exited {harness.exit_code}"
    if harness.timed_out:
        return ends(Outcome.TIMEOUT, exited)

    if harness.exit_code != 0:
        return ends(Outcome.INFRA_ERROR, exited)

    # Zero exit, but the CLI said the provider refused: a throttle that
    # outlasted its retries. Read from what the CLI wrote, so an attempt that
    # passed while writing about rate limits is not one (docs/adr/0030).
    # Before the no-model-call check, whose evidence is only a guess at why.
    if harness.refusal is not None:
        return _PreJudgeExit(Outcome.INFRA_ERROR, harness.refusal.message)

    # Zero exit, but no model call was ever seen: there is no attempt to judge,
    # and an activation check would read "nothing fired" as a verdict on the
    # skill rather than on a CLI that never started (docs/adr/0001).
    if _no_model_call_observed(harness):
        return ends(
            Outcome.INFRA_ERROR,
            "no model call observed: nothing parsed from the agent's stream "
            "and no tokens reported",
        )

    return None


def _judge_outcome(judge: JudgeResult) -> Outcome:
    """The outcome an attempt earns from the verdict the judge returned.

    ``JUDGE_ERROR`` when the judge produced no usable verdict; otherwise the
    verdict itself. The last step of the precedence ``assemble_attempt`` walks,
    reached only by an attempt that got a fair shot and had a check to grade.
    """
    if judge.errored:
        return Outcome.JUDGE_ERROR
    return Outcome.PASS if judge.passed else Outcome.TASK_FAIL
```

</details>

**依据 4 · 源码核查**：[caliper/judge/eval_judge.py:23-43](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/judge/eval_judge.py#L23-L43)

judge可产Python脚本，并非只读文本。

<details>
<summary>查看原文（21行）</summary>

```text
_SYSTEM = """\
You are an evaluation judge for an AI assistant. You will be shown the user's request, \
the transcript of the assistant's attempt at it, and an expectation describing what \
success looks like.

You have two response modes:

1. **Direct verdict** — if you can tell from the transcript alone whether the expectation \
was met, respond with:
   {"mode": "verdict", "passed": true|false, "reasoning": "<one or two sentences>"}

2. **Assertion script** — if verifiable facts (files exist, output matches a pattern, \
a value equals something) would make your judgment more reliable, write a Python script \
that asserts those facts and respond with:
   {"mode": "script", "code": "<python script>", "reasoning": "<why you chose this>"}

The script must use `assert` statements. `assert` failure = task failed. \
The script runs with no extra imports beyond the standard library, in the \
directory the assistant worked in, so relative paths name the files it wrote.

Respond with valid JSON only — no markdown fences, no extra text.
```

</details>

**依据 5 · 源码核查**：[caliper/judge/eval_judge.py:180-194](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/judge/eval_judge.py#L180-L194)

超时无verdict而非task fail。

<details>
<summary>查看原文（15行）</summary>

```text
def _run_inline_script(
    code: str, workdir: AttemptWorkdir, phase: StepPhase
) -> tuple[bool | None, str]:
    """Run an assertion in the attempt workdir, where the agent left its files.

    ``(None, evidence)`` when it timed out: a check that hung has no verdict,
    so it cannot count against the skill (docs/adr/0029).
    """
    step = workdir.run_python(phase, code)
    if step.timed_out_after is not None:
        return None, f"{phase} timed out after {step.timed_out_after}s"
    if step.ok:
        return True, ""
    # The tail, where a traceback names the assertion that failed.
    return False, step.output[-500:]
```

</details>

**依据 6 · 源码核查**：[caliper/judge/eval_judge.py:338-375](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/judge/eval_judge.py#L338-L375)

Rule B仅剩余检查聚合，部分无判仍可PASS。

<details>
<summary>查看原文（38行）</summary>

```text
    def evaluate(
        self,
        task: TaskSpec,
        transcript: list[ConversationTurn],
        workdir: AttemptWorkdir,
        history: list[PlantedTurn] | None = None,
    ) -> JudgeResult:
        assert_passed: bool | None = None
        assert_evidence: str | None = None
        static_result = _run_assert_from_task(task, workdir)
        if static_result is not None:
            assert_passed, assert_evidence = static_result

        autorater: _AutoraterVerdict | None = None
        autorater_passed: bool | None = None
        if task.expect:
            autorater = self._llm_evaluate(task, transcript, workdir, history)
            # An errored autorater yields no verdict: leave autorater_passed
            # None so it is dropped from the checks rather than counted as a
            # failure.
            autorater_passed = None if autorater.errored else autorater.passed

        # Rule B: only checks that produced a verdict count. A judge_error is
        # raised only when *no* verdict survives (see ADR-0001).
        checks = [c for c in (assert_passed, autorater_passed) if c is not None]

        result = JudgeResult(
            passed=all(checks) if checks else False,
            assert_passed=assert_passed,
            assert_evidence=assert_evidence,
            autorater_passed=autorater_passed,
            errored=not checks,
        )
        if autorater is not None:
            result.autorater_reasoning = autorater.reasoning
            result.resolved_model = autorater.resolved_model
            result.autorater_seconds = autorater.seconds
            result.autorater_script = autorater.script
```

</details>

**依据 7 · 源码核查**：[caliper/compare.py:308-350](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/compare.py#L308-L350)

task_name/位置配对和spec路径warning。

<details>
<summary>查看原文（43行）</summary>

```text
def diff_runs(a: RunResults, b: RunResults) -> RunComparison:
    """Diff two already-saved runs of (nominally) the same eval, A vs B.

    Matches tasks by ``task_name``; tasks present on only one side are surfaced
    as unmatched. The headline aggregate is computed over the *fully-comparable*
    set — tasks measured on both sides — so the delta is strictly like-for-like.

    Raises ``IncomparableRunsError`` when the two runs come from different eras.
    """
    _check_era(a.run, b.run)
    a_run, b_run = a.run, b.run
    a_tasks, b_tasks = a.task_results, b.task_results
    a_neighbourhood, b_neighbourhood = _neighbourhood(a), _neighbourhood(b)

    a_by_name = _group_by_name(a_tasks)
    b_by_name = _group_by_name(b_tasks)

    matched: list[TaskComparison] = []
    unmatched_a: list[str] = []

    # Walk A's order; pair each name positionally against B's tasks of that name.
    for name, a_group in a_by_name.items():
        b_group = b_by_name.get(name, [])
        pairs = min(len(a_group), len(b_group))
        for i in range(pairs):
            matched.append(_compare_task(name, a_group[i], b_group[i]))
        # A-side tasks with no B counterpart (name absent or fewer in B).
        unmatched_a.extend(name for _ in a_group[pairs:])

    # B-side leftovers: names absent from A, plus surplus duplicates of a shared name.
    unmatched_b: list[str] = []
    for name, b_group in b_by_name.items():
        matched_count = min(len(a_by_name.get(name, [])), len(b_group))
        unmatched_b.extend(name for _ in b_group[matched_count:])

    spec_mismatch = a_run.spec != b_run.spec
    k_mismatch = a_run.k != b_run.k
    warnings: list[str] = []
    if spec_mismatch:
        warnings.append(
            f"comparing different specs: {a_run.spec} vs {b_run.spec} "
            f"— verify this is intentional"
        )
```

</details>

**依据 8 · 源码核查**：[caliper/compare.py:380-423](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/compare.py#L380-L423)

邻居/MCP/用户层/git/judge漂移为warning。

<details>
<summary>查看原文（44行）</summary>

```text
    neighbourhood_mismatch = labels is None and a_neighbourhood != b_neighbourhood
    if neighbourhood_mismatch:
        warnings.append(
            f"different skill neighbourhoods: {a_neighbourhood or ['(none)']} vs "
            f"{b_neighbourhood or ['(none)']} — the larger set gives the agent "
            "competitors, so some attempts may never activate the skill at all"
        )
    # The same guard on the tool axis. Only when both runs recorded their
    # membership: a legacy run's ``None`` is "unknown", not "none", and warning
    # on it would fire for every comparison against an older run. A recognised
    # ablation pair is excluded — there the difference is the experiment.
    a_mcp, b_mcp = a_run.mcp_servers, b_run.mcp_servers
    mcp_mismatch = (
        labels is None
        and a_mcp is not None
        and b_mcp is not None
        and set(a_mcp) != set(b_mcp)
    )
    if mcp_mismatch:
        warnings.append(
            f"different MCP servers configured: {a_mcp or ['(none)']} vs "
            f"{b_mcp or ['(none)']} — tool availability can move the score for "
            "reasons unrelated to the skill"
        )

    cross_backend_warning = _cross_backend_user_customizations_warning(a_run, b_run)
    # One message per cause: across backends, isolating both runs is the only
    # fix, and the generic mismatch advice would contradict it.
    if cross_backend_warning:
        warnings.append(cross_backend_warning)
    elif customizations_warning:
        warnings.append(customizations_warning)

    # Drift is reported for every member but only *warned* about for a git
    # source. Warning on a path source would fire on every iteration of the core
    # loop — you edited your skill, which is what the run is measuring — and a
    # warning trained past is worse than none, because it takes the confounding
    # case down with it. See docs/adr/0017.
    skill_drift = _drift(a, b)
    warnings += [r.message for r in skill_drift if r.source_kind == "git"]

    judge_warning = _judge_warning(a, b)
    if judge_warning:
        warnings.append(judge_warning)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · fresh home是否安全隔离，默认环境和全周期成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需Python3.10+、对应Claude Code／Codex／Pi／Hermes CLI及认证、可用模型；expect另调用judge，默认跟同后端，Pi的MCP支持有特定限制，不能认定四后端能力完全等价。运行自己的可信spec、Skill和检查，先关闭user customizations，用无外部副作用的临时项目；本轮不安装CLI、登录或执行spec。

“fresh”指历史与安装位置，不是安全sandbox。Codex实际带dangerously-bypass-approvals-and-sandbox，Claude带dangerously-skip-permissions；setup/cleanup是shell，显式assert与judge生成检查是本机Python，steps继承操作者HOME/PATH。SpecSandbox只扫描transcript工具输入路径来判cheat，不阻止OS读写／网络，也不能看到所有间接访问。需要另用真正隔离环境保护工作机，不能把违规被评分发现当执行前阻断。

默认可继承用户customizations、MCP／插件／规则和账户connector，污染实验也带真实权限。Codex只有user_customizations关闭才关apps/plugins；开启时仅声明codex_apps同名覆盖可关hosted apps。Claude只有关闭用户层才strict-mcp-config，否则可合入账户connector。因此“每次新home”不等只见spec工具；旧ADR“never account connectors”不能跨当前条件分支套用。

首次成本含CLI认证、spec与可验assert、Skill来源固定；持续为k次Agent、expect judge、可能judge脚本、节流重试和双臂ablation。工具记录token和墙钟，不提供可靠美元封顶；金额／工时未知。失败先读outcome、hook和无verdict，避免只为抬分重复跑；退出保存JSON和必要非敏感原件，撤销测试登录／外部权限，临时workdir自动删除不回滚已发网络或宿主写入。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:5-17](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/pyproject.toml#L5-L17)

Python版本、0.21.0和Alpha定位。

<details>
<summary>查看原文（13行）</summary>

```text
[project]
name = "caliper-eval"
version = "0.21.0"
description = "A lightweight evaluation harness for agent skills"
readme = "README.md"
requires-python = ">=3.10"
license = "MIT"
authors = [
    { name = "Emrick Donadei" },
]
keywords = ["ai", "agents", "evals", "skills", "codex", "claude"]
classifiers = [
    "Development Status :: 3 - Alpha",
```

</details>

**依据 2 · 源码核查**：[caliper/harness/codex.py:239-281](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/harness/codex.py#L239-L281)

真实安装发现、绕过审批sandbox及connector条件。

<details>
<summary>查看原文（43行）</summary>

```text
        self, ctx: RunContext
    ) -> tuple[list[str], str | None, Callable[[], None] | None]:
        # The prompt goes to the agent unmodified. Codex has no force-load flag,
        # and caliper no longer invents one: the skill is installed at
        # .codex/skills/<name>/ and the agent discovers it (docs/adr/0013).
        full_prompt = ctx.prompt
        codex = self.cli_path() or "codex"
        cmd = [
            codex,
            "exec",
            "--json",
            "--skip-git-repo-check",
            "--dangerously-bypass-approvals-and-sandbox",
            "--color",
            "never",
            *self._connector_overrides(ctx),
            *self._provider_overrides(),
            "-",
        ]
        if ctx.model:
            cmd[2:2] = ["--model", ctx.model]
        # The prompt becomes the next user turn after the planted ones. The
        # exec flags stay ahead of the subcommand, and the JSON stream does not
        # replay the planted turns, so they never reach the transcript.
        if ctx.history:
            home = self.attempt_config_home(ctx)
            planted = CODEX_ROLLOUT.plant(ctx, home, self.skills_root(ctx))
            cmd[-1:-1] = ["resume", planted.id]
        return cmd, full_prompt, None

    @staticmethod
    def _connector_overrides(ctx: RunContext) -> tuple[str, ...]:
        """The ``-c`` overrides that keep the account's connectors out, if any.

        All of them when isolated. When loading user customizations, only the
        hosted apps, and only if the spec declares a ``codex_apps`` of its own:
        the spec wins a name clash, ablated or not (docs/adr/0028).
        """
        if not ctx.user_customizations:
            return NO_ACCOUNT_CONNECTORS
        if CODEX_APPS_SERVER in ctx.spec_mcp_names:
            return ("-c", "features.apps=false")
        return ()
```

</details>

**依据 3 · 源码核查**：[caliper/harness/claude_code.py:277-295](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/harness/claude_code.py#L277-L295)

skip permissions与strict配置条件。

<details>
<summary>查看原文（19行）</summary>

```text
        cmd = [
            "claude",
            "-p",
            "--output-format",
            "stream-json",
            "--verbose",
            "--dangerously-skip-permissions",
        ]

        mcp_config = self._materialize_mcp_config(ctx)
        # --strict-mcp-config so the attempt sees ONLY the declared servers —
        # never the account's claude.ai connectors, which the seeded login
        # brings along otherwise (docs/adr/0026). The config file (which may hold
        # resolved secrets) lives in the 0700 run tempdir, never argv.
        cmd += ["--mcp-config", str(mcp_config)]
        # Loading user customizations drops it, so the declared servers merge
        # with the user's own and the account's connectors (docs/adr/0028).
        if not ctx.user_customizations:
            cmd.append("--strict-mcp-config")
```

</details>

**依据 4 · 源码核查**：[caliper/harness/user_layer.py:90-112](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/harness/user_layer.py#L90-L112)

按用户层选择复制规则、插件与Skills。

<details>
<summary>查看原文（23行）</summary>

```text
def stage(harness: CliHarness, ctx: RunContext) -> StagedUserLayer:
    """Copy the user layer into the attempt's home, if this attempt loads it.

    One step of :meth:`~caliper.harness.base.CliHarness.stage_home`, after
    ``_prepare``. Files are recorded before the agent runs, so it cannot mutate
    what the record says it was given.
    """
    # The run seam already turns the choice off on a backend without MCP
    # (environment.choose_user_customizations); checked once more here so no
    # other context can stage a layer that backend has nothing to load into.
    isolated = StagedUserLayer(
        spec_skill_names=ctx.spec_skill_names, spec_mcp_names=ctx.spec_mcp_names
    )
    if not (ctx.user_customizations and harness.supports_mcp):
        return isolated
    files = _copy_rules(harness, ctx)
    plugin_files, plugin_skill_paths = harness.stage_plugins(ctx)
    return replace(
        isolated,
        loads_user_layer=True,
        files=(*files, *plugin_files),
        skills=tuple(_install_skills(harness, ctx)),
        plugin_skill_paths=plugin_skill_paths,
```

</details>

**依据 5 · 源码核查**：[caliper/workdir.py:89-106](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/workdir.py#L89-L106)

临时home/work及退出清理。

<details>
<summary>查看原文（18行）</summary>

```text
    def __enter__(self) -> AttemptWorkdir:
        self._root = tempfile.mkdtemp(prefix="caliper-")
        os.mkdir(self.path)
        return self

    def __exit__(self, *exc: object) -> None:
        if self._root is not None:
            shutil.rmtree(self._root, ignore_errors=True)

    @property
    def path(self) -> str:
        """The workdir itself, where every step and the agent run."""
        return os.path.join(self._require_root(), "work")

    @property
    def home(self) -> str:
        """The agent's isolated home: the temp dir, beside the workdir."""
        return self._require_root()
```

</details>

**依据 6 · 源码核查**：[caliper/workdir.py:113-155](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/workdir.py#L113-L155)

shell/Python检查、PYTHONOPTIMIZE清理与操作者环境。

<details>
<summary>查看原文（43行）</summary>

```text
    def run_shell(self, phase: StepPhase, cmd: str) -> StepResult:
        """Run a shell command in the workdir.

        Raises :class:`StepCancelled` when the run's cancellation killed it.
        ``cleanup`` is not killed by a cancellation already requested, so it
        still tidies up after an interrupt.
        """
        return self._run(phase, cmd, shell=True)

    def run_python(self, phase: StepPhase, code: str) -> StepResult:
        """Run Python source in the workdir with this interpreter.

        The source is staged in the attempt's temp dir, beside the workdir
        rather than in it, so the step sees only what the agent left.
        """
        with tempfile.NamedTemporaryFile(
            suffix=".py", mode="w", dir=self._require_root(), delete=False
        ) as f:
            f.write(code)
            script = f.name
        try:
            # A check is its `assert` statements, which the caller's
            # PYTHONOPTIMIZE would strip, passing every check unrun.
            return self._run(
                phase, [sys.executable, script], shell=False, unset=("PYTHONOPTIMIZE",)
            )
        finally:
            Path(script).unlink(missing_ok=True)

    def _run(
        self,
        phase: StepPhase,
        args: str | list[str],
        shell: bool,
        unset: tuple[str, ...] = (),
    ) -> StepResult:
        limit = _STEP_TIMEOUTS[phase]
        # Tagged like an agent CLI, so a kill reaches descendants that left
        # its process group or outlived it.
        process_tag = uuid.uuid4().hex
        # Deliberately the caller's own environment rather than the agent's
        # isolated one: steps are the spec author's code, not the agent under
        # test, and have always run with the developer's ``HOME`` and ``PATH``.
```

</details>

**依据 7 · 源码核查**：[caliper/sandbox.py:112-126](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/sandbox.py#L112-L126)

cheat只是转录路径匹配。

<details>
<summary>查看原文（15行）</summary>

```text
    def violations(self, transcript: list[ConversationTurn]) -> list[str]:
        """Every path in ``transcript`` that the sandbox forbids.

        Reported rather than counted: the record keeps the offending paths as
        the evidence behind a ``cheat`` outcome (docs/adr/0001).
        """
        patterns = self._compiled
        found: list[str] = []
        for turn in transcript:
            if not turn.tool_input:
                continue
            for value in _paths_in(turn.tool_input):
                if any(p.search(value) for p in patterns):
                    found.append(value)
        return found
```

</details>

#### 缺口

- 匹配CLI版本的安装发现、connector过滤和真实权限／隔离行为未运行。
  **影响**：不能把源码策略当实际宿主通过，含真实凭据的spec不适合直接试。
  **进一步探讨**：在独立可丢弃环境固定CLI版本，先验无副作用Skill、关闭customizations并核工具清单与网络范围。
- 模型价格、节流重试总费用和spec维护时间未实测。
  **影响**：不能承诺现金封顶或ROI。
  **进一步探讨**：先k1核spec，再设外部账户用量限制做小双臂评测，人工记录实际账单与总时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · ablation差异何时不能归因Skill，新方向怎样证伪？

**研究主题**：新假设与验证

#### 完整回答

ablation控制是否加载指定Skill／MCP，但不自动消除模型更新、账户工具、同名任务内容变化、判断标准漂移和可用尝试筛选影响。compare警告是诊断辅助，不能成为“除Skill外相同”的保证。README演示改善不代表普遍效果，也不能仅因为无Skill同样通过就断言Skill没有其他任务价值。

从Q02按task_name配对且部分检查无verdict仍可PASS，推导一个未实现假设：同时显示“同一检查集合都取得verdict的成功率”和现有Rule B成功率，并绑定prompt/setup/assert语义摘要，可能更早暴露缺判与任务漂移造成的假增益。相对当前warning与逐检查字段，增量是归因条件可见性而非换掉原主指标。最小试验用同名不同assert、judge故障、两臂不同user layer和真实Skill改进四类样本，盲让维护者判断是否可归因，计错误结论、正确放行和核验时间。若错误归因不降或真实改进被大量误阻断则否定，未实现不可计入当前评分。

#### 证据与依据

**依据 1 · 源码核查**：[caliper/compare.py:308-350](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/compare.py#L308-L350)

同名任务配对与spec warning不能保证语义相同。

<details>
<summary>查看原文（43行）</summary>

```text
def diff_runs(a: RunResults, b: RunResults) -> RunComparison:
    """Diff two already-saved runs of (nominally) the same eval, A vs B.

    Matches tasks by ``task_name``; tasks present on only one side are surfaced
    as unmatched. The headline aggregate is computed over the *fully-comparable*
    set — tasks measured on both sides — so the delta is strictly like-for-like.

    Raises ``IncomparableRunsError`` when the two runs come from different eras.
    """
    _check_era(a.run, b.run)
    a_run, b_run = a.run, b.run
    a_tasks, b_tasks = a.task_results, b.task_results
    a_neighbourhood, b_neighbourhood = _neighbourhood(a), _neighbourhood(b)

    a_by_name = _group_by_name(a_tasks)
    b_by_name = _group_by_name(b_tasks)

    matched: list[TaskComparison] = []
    unmatched_a: list[str] = []

    # Walk A's order; pair each name positionally against B's tasks of that name.
    for name, a_group in a_by_name.items():
        b_group = b_by_name.get(name, [])
        pairs = min(len(a_group), len(b_group))
        for i in range(pairs):
            matched.append(_compare_task(name, a_group[i], b_group[i]))
        # A-side tasks with no B counterpart (name absent or fewer in B).
        unmatched_a.extend(name for _ in a_group[pairs:])

    # B-side leftovers: names absent from A, plus surplus duplicates of a shared name.
    unmatched_b: list[str] = []
    for name, b_group in b_by_name.items():
        matched_count = min(len(a_by_name.get(name, [])), len(b_group))
        unmatched_b.extend(name for _ in b_group[matched_count:])

    spec_mismatch = a_run.spec != b_run.spec
    k_mismatch = a_run.k != b_run.k
    warnings: list[str] = []
    if spec_mismatch:
        warnings.append(
            f"comparing different specs: {a_run.spec} vs {b_run.spec} "
            f"— verify this is intentional"
        )
```

</details>

**依据 2 · 源码核查**：[caliper/compare.py:380-423](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/compare.py#L380-L423)

环境／来源与judge漂移以warning呈现。

<details>
<summary>查看原文（44行）</summary>

```text
    neighbourhood_mismatch = labels is None and a_neighbourhood != b_neighbourhood
    if neighbourhood_mismatch:
        warnings.append(
            f"different skill neighbourhoods: {a_neighbourhood or ['(none)']} vs "
            f"{b_neighbourhood or ['(none)']} — the larger set gives the agent "
            "competitors, so some attempts may never activate the skill at all"
        )
    # The same guard on the tool axis. Only when both runs recorded their
    # membership: a legacy run's ``None`` is "unknown", not "none", and warning
    # on it would fire for every comparison against an older run. A recognised
    # ablation pair is excluded — there the difference is the experiment.
    a_mcp, b_mcp = a_run.mcp_servers, b_run.mcp_servers
    mcp_mismatch = (
        labels is None
        and a_mcp is not None
        and b_mcp is not None
        and set(a_mcp) != set(b_mcp)
    )
    if mcp_mismatch:
        warnings.append(
            f"different MCP servers configured: {a_mcp or ['(none)']} vs "
            f"{b_mcp or ['(none)']} — tool availability can move the score for "
            "reasons unrelated to the skill"
        )

    cross_backend_warning = _cross_backend_user_customizations_warning(a_run, b_run)
    # One message per cause: across backends, isolating both runs is the only
    # fix, and the generic mismatch advice would contradict it.
    if cross_backend_warning:
        warnings.append(cross_backend_warning)
    elif customizations_warning:
        warnings.append(customizations_warning)

    # Drift is reported for every member but only *warned* about for a git
    # source. Warning on a path source would fire on every iteration of the core
    # loop — you edited your skill, which is what the run is measuring — and a
    # warning trained past is worse than none, because it takes the confounding
    # case down with it. See docs/adr/0017.
    skill_drift = _drift(a, b)
    warnings += [r.message for r in skill_drift if r.source_kind == "git"]

    judge_warning = _judge_warning(a, b)
    if judge_warning:
        warnings.append(judge_warning)
```

</details>

**依据 3 · 源码核查**：[caliper/judge/eval_judge.py:353-369](https://github.com/edonadei/caliper/blob/96eb25fc6948e726f72cda5abe3bc489cf4de021/caliper/judge/eval_judge.py#L353-L369)

缺判可以被剩余通过检查覆盖，为假设起点。

<details>
<summary>查看原文（17行）</summary>

```text
        if task.expect:
            autorater = self._llm_evaluate(task, transcript, workdir, history)
            # An errored autorater yields no verdict: leave autorater_passed
            # None so it is dropped from the checks rather than counted as a
            # failure.
            autorater_passed = None if autorater.errored else autorater.passed

        # Rule B: only checks that produced a verdict count. A judge_error is
        # raised only when *no* verdict survives (see ADR-0001).
        checks = [c for c in (assert_passed, autorater_passed) if c is not None]

        result = JudgeResult(
            passed=all(checks) if checks else False,
            assert_passed=assert_passed,
            assert_evidence=assert_evidence,
            autorater_passed=autorater_passed,
            errored=not checks,
```

</details>

#### 缺口

- 附加完整verdict口径与语义摘要能否改善维护者归因未验证。
  **影响**：仅未来可证伪方向，不替代当前结果。
  **进一步探讨**：按四组样本盲测错误归因、误阻断和人工投入，无改善则放弃。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
