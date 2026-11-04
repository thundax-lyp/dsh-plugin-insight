# clawock

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[fcb35fd](https://github.com/KCNyu/clawock/tree/fcb35fd5a67904a8a3f62c9da62da76828d87d50)

<!-- BEGIN META -->
[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/KCNyu/clawock)
<!-- END META -->

> **功能**：为外部 AI Agent 提供投资研究的证据组织、决策校验和结果复盘流程。

> **亮点**：[Q02](#research-q02) 在 Agent 外核验上下文证书、方向性证据及失效条件，可拒绝缺失的结构。

> **主要限制**：[Q03](#research-q03) 有效回执和方向评价各有边界，不能由此推断市场数据真实、资金实际成交或投资收益。

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
  - [Q01 · 根仓解决什么交付问题，DSH 子包承担什么？](#detail-section-11)
  - [Q02 · 如何阻止输入漂移与缺反方证据的输出？](#detail-section-12)
  - [Q03 · 如何使用后验评价而避免误读为收益？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：研究人员希望跨 Agent 保留判断、引用、反方意见和结果。

普通笔记或表格可以保存判断，工作流增加程序化输入绑定和验证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 输入固定 | 绑定工作区材料 | 来源真伪仍需检查 |
| 发布校验 | 拦截格式或证据缺项 | 不能验证内容正确 |
| 结果复盘 | 按后验输入评价 | 仅流程评估，不做交易 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Python 3.11+ 和工作区 | 必需 | 准备及发布文件 | 不能使用 CLI |
| 外部 Agent | 正式流程需 | 生成判断产物 | 用离线样例校验文件协议 |
| 可信观察来源 | 评价需 | 记录后验输入 | 保留缺口 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 操作者固定工作区上下文 | 记录请求证书 |
| 发布 | Agent 写判断，操作者调用 CLI | 缺材料时拒绝 |
| 复盘 | 操作者提供后验样本 | 核对时间、币种和方向 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 运行资源未知 | 配置独立工作区 | 需 Python 和样例 |
| 持续 | 数据与模型费用未知 | 验证证据与后验标签 | 真实源与计划独立 |
| 失败 | 重跑成本未知 | 核对证书和产物 | 恢复性能未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 可交接 | 证书和产物清单 | 实际复核节时 |
| 结构门槛 | 两方证据和失效条件 | 事实质量和收益 |

> **思考**：[Q03](#research-q03) 有效回执和方向评价各有边界，不能由此推断市场数据真实、资金实际成交或投资收益。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 在 Agent 外核验上下文证书、方向性证据及失效条件，可拒绝缺失的结构。

[Q02](#research-q02) CLI 发布时重建上下文，workflow validators 由工作流获取，避免调用方漏加。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 有效回执和方向评价各有边界，不能由此推断市场数据真实、资金实际成交或投资收益。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 仅用离线模拟材料测试可审计交接，输入和回执对不上即退回人工复核。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持发布门槛与后验输入检查。没有运行模型、市场数据、宿主或真实账户。

- 已检查：作者 README、包清单、源码路径 pyproject.toml、README.md、src/clawock/cli.py、src/clawock/harness/agent_run.py、src/clawock/workflows/validators.py、src/clawock/workflows/improvements.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根 Python 工具的代表性准备、发布、证据和后验评价路径，读取根 README 识别另包 DSH 集成。未运行。
- 下一步：离线回放修改输入、无反方证据、错误观察时间和发布失败，比较人工复核结果。

**分析版本**

- **仓库**：[KCNyu/clawock](https://github.com/KCNyu/clawock)
- **版本号**：未声明（[固定提交 fcb35fd](https://github.com/KCNyu/clawock/tree/fcb35fd5a67904a8a3f62c9da62da76828d87d50)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照文档和材料证书的异构 Agent 移交，测复核错误和工时。若均无改善就停止。

离线回放修改输入、无反方证据、错误观察时间和发布失败，比较人工复核结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 273 | 74712 | — | — | 1108180 |
| .md | example | 13 | 1759 | — | — | 19599 |
| .mjs | example | 3 | 761 | 594 | 144 | — |
| .js | example | 15 | 20945 | 19276 | 1974 | — |
| .ts | example | 14 | 9392 | 6678 | 2205 | — |
| .js | source | 16 | 10545 | 8316 | 1837 | — |
| .mjs | source | 5 | 845 | 615 | 191 | — |
| .ts | source | 2 | 323 | 273 | 25 | — |
| .mjs | test | 4 | 507 | 327 | 134 | — |
| .js | test | 5 | 10908 | 7338 | 3212 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/KCNyu/clawock/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：外部 Agent 的研究判断如何绑定材料并接受独立回看？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根仓解决什么交付问题，DSH 子包承担什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

做研究复盘的团队可以把各 Agent 产生的判断和证据统一写为本地可移交文档，而不是把结果只留在对话。根仓定义 Python CLI 和文件协议，模型、会话与工具在外部 Agent；DSH 的仪表板和任务队列是 examples 中另一个安装包，作者的券商配置与调度也不随根包部署。与自行维护表格相比，根工具带来的主要增量是输入、判断和后验评价在换 Agent 时仍可复核。若只做一次临时摘要，普通文档也能满足，结构化准备成本未必值得。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:5-16](https://github.com/KCNyu/clawock/blob/fcb35fd5a67904a8a3f62c9da62da76828d87d50/pyproject.toml#L5-L16)

Python 根发行物、版本与要求。

<details>
<summary>查看原文（12行）</summary>

```text
[project]
name = "clawock"
version = "0.4.2"
description = "Investment workflows for AI agents: evidence, opposing cases, and outcomes checked by Python."
readme = "README.md"
requires-python = ">=3.11"
license = { file = "LICENSE" }
authors = [{ name = "Shengyu Li" }]
keywords = [
    "agent", "llm", "decision-workflow", "harness", "portfolio", "provenance",
    "reconciliation", "evidence", "audit", "mcp", "plugins", "strategy",
    "walk-forward",
```

</details>

**依据 2 · 源码核查**：[pyproject.toml:114-121](https://github.com/KCNyu/clawock/blob/fcb35fd5a67904a8a3f62c9da62da76828d87d50/pyproject.toml#L114-L121)

根仓命令注册。

```text
[project.scripts]
clawock = "clawock.cli:main"
clawock-brief-watchdog = "clawock.harness.brief_watchdog:main"
clawock-report-watchdog = "clawock.harness.report_watchdog:main"
clawock-intraday-watchdog = "clawock.harness.intraday_watchdog:main"
clawock-cron-heartbeat = "clawock.automation.cron_heartbeat:main"
clawock-workflow-outcomes = "clawock.automation.workflow_outcomes:main"
clawock-intraday-delta = "clawock.harness.intraday_delta:main"
```

**依据 3 · 作者声明**：[README.md:79-96](https://github.com/KCNyu/clawock/blob/fcb35fd5a67904a8a3f62c9da62da76828d87d50/README.md#L79-L96)

作者描述外部 Agent 和文件协议。

<details>
<summary>查看原文（18行）</summary>

```text
## Any harness, one decision contract that accumulates evidence

clawock was never inside the chat. It is one skill (`investment-decision`), one command line tool and a handful of files in your workspace, so any agent that can read a file, write a file and run a command can use it: **Claude Code / Codex / OpenClaw / DeepSeek Harness / your own script**. Switch from Claude Code to Codex next month and, with the same workspace, the history comes with you.

Your agent keeps its model, conversation, memory, research tools, credentials and permissions; clawock never starts a model. It pins down what went in, checks what came out, marks the result later and keeps the record:

| File | Written by | What it holds |
|---|---|---|
| `request.json` | clawock, when you run `clawock run prepare` | the material for this decision, with a fingerprint of every document so it cannot be swapped afterwards |
| `decision.json` | your agent | its answer: the case for, the case against, the action, and what would prove it wrong |
| `plan.json` | the author's setup, every morning | the same answer for a whole portfolio, one entry per position |
| `decisions.jsonl` | the author's setup | the public ledger: one line per decision, with the result added once code has marked it |
| `outcome.json` | you, once the waiting period is over | the prices you saw and where you got them |
| `evaluation.json` | clawock, when you run `clawock workflow evaluate` | whether the direction was right. It is not money made |

**The model itself does not change; the record does.** Before the next plan the agent can review earlier judgments and their results, and with enough evaluated history the author's setup also checks how reliable earlier confidence figures were. A new workspace starts empty: you build the history by recording decisions and evaluating them.

<p align="center"><img src="https://raw.githubusercontent.com/KCNyu/clawock/refs/heads/master/site/assets/product-architecture.svg" width="1016" alt="clawock product architecture — external runtimes own models, conversation, memory and tools while the package supplies portable workflows, certified context, deterministic reconciliation, evaluation and bounded improvement"></p>
```

</details>

**依据 4 · 作者声明**：[README.md:247-262](https://github.com/KCNyu/clawock/blob/fcb35fd5a67904a8a3f62c9da62da76828d87d50/README.md#L247-L262)

另有 DSH 子包与主机配置。

<details>
<summary>查看原文（16行）</summary>

````text
**Decision Mind** traces a real fill through **plan → execution → T+1 → P&L**: what the plan said, what you did, where the price was one session later and what it earned or lost. A fill with no plan, or not yet graded, says so; a new workspace has no trades to show. Ask "Can I add to 0700.HK?" and the investment skill walks the agent through the same steps as above.

<p align="center"><img src="https://raw.githubusercontent.com/KCNyu/clawock/refs/heads/master/site/assets/dsh-decision-mind.png" width="820" alt="Decision Mind inside the real dsh web GUI: fills grouped by day with paired plans and T+1 verdicts; an expanded trace follows the plan, actual execution and outcome"></p>

```bash
python -m pip install clawock
dsh plugin --profile web add clawock-dsh
mkdir -p ~/.dsh/skills
cp -r ~/.dsh/profiles/web/node_modules/clawock-dsh/skills/investment-decision ~/.dsh/skills/
```

Restart the web profile to load it. Queue controls also need the host runner; without it the panel still shows provider allowances and balances. For the chat commands, add the installed package directory to OpenClaw's `plugins.load.paths` and restart the gateway. [npm package](https://www.npmjs.com/package/clawock-dsh) · [installation and queue setup](https://github.com/KCNyu/clawock/blob/master/examples/dsh/packages/clawock-dsh/README.md).

## Under the hood

These diagrams show the author's configured account: market-data access, holdings, stored decisions, scheduled jobs and delivery destinations. Installing clawock gives you the commands and workflows; a daily service like this one needs those inputs and jobs configured too.
````

</details>

#### 缺口

- 没有独立用户流程样本
  **影响**：无法衡量移交节时或采用门槛
  **进一步探讨**：让两种 Agent 对同一材料先后接手，统计复核中可直接定位的输入比例

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何阻止输入漂移与缺反方证据的输出？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

CLI 准备命令生成工作区下的请求原件，记录运行/产物代号和证书；发布时重读任务、输出路径、元数据和工作流，重新组装上下文并比较证书，内容漂移时拒绝。AgentRun 从所选工作流获取 validator，结构验证不通过即给 rejected 回执；通过后把证书和产物列表交给 FilesystemStore。投资判断 validator 分开计数支持及反对证据，要求两边引用相应方向并列可推翻条件。它约束论证结构与材料绑定，不能判断引用对事实的解释是否正确，也不证明外部源完整。相比只让模型自述信心，规则对格式缺口可独立拒绝，但语义复核仍需要人。

#### 证据与依据

**依据 1 · 源码核查**：[src/clawock/cli.py:37-54](https://github.com/KCNyu/clawock/blob/fcb35fd5a67904a8a3f62c9da62da76828d87d50/src/clawock/cli.py#L37-L54)

入口写请求并限本地权限。

<details>
<summary>查看原文（18行）</summary>

```text
def _run_prepare(args) -> int:
    from clawock.harness import AgentRun
    from clawock.harness.config import load_request
    from clawock.publish.store import write_generation

    try:
        request = load_request(args.workspace)
        prepared = AgentRun().prepare(request)
        state = request.workspace / ".clawock" / "work" / prepared.run_id / "request.json"
        payload = prepared.as_dict()
        payload["request_file"] = str(state)
        write_generation({
            str(state): json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        })
        state.chmod(0o600)
    except (ValueError, OSError) as exc:
        print(str(exc), file=sys.stderr)
        return 1
```

</details>

**依据 2 · 源码核查**：[src/clawock/cli.py:74-101](https://github.com/KCNyu/clawock/blob/fcb35fd5a67904a8a3f62c9da62da76828d87d50/src/clawock/cli.py#L74-L101)

拒绝身份或上下文漂移。

<details>
<summary>查看原文（28行）</summary>

```text
            raise ValueError(
                f"prepared request must live under {state_root}; `clawock run prepare` "
                f"writes one to {state_root}/<run_id>/request.json — pass that path")
        payload = json.loads(state_path.read_text(encoding="utf-8"))
        if not isinstance(payload, dict) or payload.get("schema_version") != 1:
            raise ValueError("prepared request requires schema_version 1")
        run_id = payload.get("run_id")
        generation_id = payload.get("generation_id")
        if not all(
            isinstance(value, str) and len(value) == 32
            and all(char in "0123456789abcdef" for char in value)
            for value in (run_id, generation_id)
        ):
            raise ValueError("prepared request has invalid run/generation IDs")
        if payload.get("task") != request.task:
            raise ValueError("workspace task changed after this run was prepared")
        if payload.get("output_directory") != str(request.output_directory):
            raise ValueError("workspace output directory changed after this run was prepared")
        if payload.get("metadata") != dict(request.metadata):
            raise ValueError("workspace metadata changed after this run was prepared")
        if payload.get("workflow", {}) != dict(request.workflow):
            raise ValueError("workspace workflow changed after this run was prepared")
        context = assemble_explicit(request.workspace, request.context_files)
        supplied_context = payload.get("context")
        if not isinstance(supplied_context, dict) or (
            supplied_context.get("certificate") != context.certificate()
        ):
            raise ValueError("workspace context changed after this run was prepared")
```

</details>

**依据 3 · 源码核查**：[src/clawock/cli.py:116-130](https://github.com/KCNyu/clawock/blob/fcb35fd5a67904a8a3f62c9da62da76828d87d50/src/clawock/cli.py#L116-L130)

CLI 实际调用发布并返回状态。

<details>
<summary>查看原文（15行）</summary>

```text
                raise ValueError(f"duplicate artifact name: {name}")
            artifacts[name] = source.read_text(encoding="utf-8")

        prepared = PreparedRun(request, context, run_id, generation_id)
        receipt = AgentRun().publish(
            prepared,
            artifacts,
            FilesystemStore(request.output_directory / run_id),
        )
        result = receipt.as_dict()
    except (ValueError, OSError, json.JSONDecodeError) as exc:
        print(str(exc), file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if receipt.status == "published" else 1
```

</details>

**依据 4 · 源码核查**：[src/clawock/harness/agent_run.py:130-183](https://github.com/KCNyu/clawock/blob/fcb35fd5a67904a8a3f62c9da62da76828d87d50/src/clawock/harness/agent_run.py#L130-L183)

validator 和拒绝路径与发布清单。

<details>
<summary>查看原文（54行）</summary>

```text
    def _issues(
        self, prepared: PreparedRun, artifacts: Mapping[str, str]
    ) -> tuple[ValidationIssue, ...]:
        workflow_validators: tuple[ArtifactValidator, ...] = ()
        if prepared.request.workflow:
            # Lazy to keep the generic harness model independent at import time.
            # The package API and CLI must enforce the same workflow contract;
            # requiring every caller to remember to inject these validators would
            # make the most important gates optional by accident.
            from clawock.workflows import validators_for

            workflow_validators = validators_for(prepared.request.workflow)
        return tuple(
            issue
            for validator in (*self.validators, *workflow_validators)
            for issue in validator.validate(artifacts)
        )

    def publish(self, prepared: PreparedRun, artifacts: Mapping[str, str],
                store: ArtifactStore) -> RunReceipt:
        issues = self._issues(prepared, artifacts)
        members = tuple(
            Artifact(name, Path(name), _media_type(name), prepared.generation_id)
            for name in artifacts
        )
        artifact_set = ArtifactSet(prepared.generation_id, members)
        artifact_set.validate()
        if issues:
            return RunReceipt(
                run_id=prepared.run_id,
                generation_id=prepared.generation_id,
                status="rejected",
                artifacts=artifact_set,
                workflow=prepared.request.workflow,
                validation_issues=issues,
            )

        manifest = {
            "schema_version": 1,
            "run_id": prepared.run_id,
            "generation_id": prepared.generation_id,
            "context": prepared.context.certificate(),
            "artifacts": [
                {"name": name, "generation_id": prepared.generation_id}
                for name in artifacts
            ],
            "producer_metadata": dict(prepared.request.metadata),
            "workflow": dict(prepared.request.workflow),
        }
        files: Mapping[str, str] = {
            **artifacts,
            MANIFEST_NAME: json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        }
        published = store.publish(files, label=f"clawock run {prepared.run_id}")
```

</details>

**依据 5 · 源码核查**：[src/clawock/workflows/validators.py:143-182](https://github.com/KCNyu/clawock/blob/fcb35fd5a67904a8a3f62c9da62da76828d87d50/src/clawock/workflows/validators.py#L143-L182)

反方证据、引用与可推翻条件。

<details>
<summary>查看原文（40行）</summary>

```text
        }
        opposing = {
            key for key, item in evidence_by_id.items()
            if item.get("stance") == "opposing"
        }
        if len(supporting) < min_supporting:
            issues.append(_issue(
                "insufficient_supporting_evidence",
                f"requires at least {min_supporting} supporting evidence item(s)",
            ))
        if len(opposing) < min_opposing:
            issues.append(_issue(
                "insufficient_opposing_evidence",
                f"requires at least {min_opposing} opposing evidence item(s)",
            ))

        debate = _object_fields(top.get("debate"), {"bull_case", "bear_case"}, "debate", issues)
        bull_refs = self._case_refs(debate.get("bull_case"), "bull_case", issues)
        bear_refs = self._case_refs(debate.get("bear_case"), "bear_case", issues)
        self._check_refs(bull_refs, set(evidence_by_id), "bull_case", issues)
        self._check_refs(bear_refs, set(evidence_by_id), "bear_case", issues)
        if bull_refs and not (set(bull_refs) & supporting):
            issues.append(_issue("unsupported_bull_case", "bull_case must cite supporting evidence"))
        if bear_refs and not (set(bear_refs) & opposing):
            issues.append(_issue("unsupported_bear_case", "bear_case must cite opposing evidence"))

        thesis = _object_fields(
            top.get("thesis"), {"statement", "confidence", "invalidation_conditions"},
            "thesis", issues,
        )
        if not isinstance(thesis.get("statement"), str) or not thesis.get("statement", "").strip():
            issues.append(_issue("empty_thesis", "thesis.statement is required"))
        confidence = thesis.get("confidence")
        if isinstance(confidence, bool) or not isinstance(confidence, (int, float)) or not 0 <= confidence <= 1:
            issues.append(_issue("invalid_confidence", "thesis.confidence must be between 0 and 1"))
        invalidations = thesis.get("invalidation_conditions")
        if not isinstance(invalidations, list) or not invalidations or any(
            not isinstance(item, str) or not item.strip() for item in invalidations
        ):
            issues.append(_issue("missing_invalidation", "thesis requires non-empty invalidation conditions"))
```

</details>

#### 缺口

- 未检查完整发布存储故障行为和每个工作流
  **影响**：不能保证并发发布与断电恢复
  **进一步探讨**：在独立工作区用篡改文件、缺反方与写失败样本回放并检查回执和产物

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何使用后验评价而避免误读为收益？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

评价要求 decision_id 和工作流版本匹配，观察时间晚于判断时点，报价币和正价格、FX 符合输入约束，再按方向和基准币变化返回评价。数据来源类别可以是券商、交易所或市场数据，但标签和字段合规无法代替源数据、成交、成本和可重现性核验。作者也明确把方向统计和实际获利分开。离线试用可采用随仓范例或自造无敏感输入，不接真实账户；需准备 Python、独立工作区和外部 Agent。后续试验可在相同非交易任务比较模板文档和固定材料回执，检查能否更快找到篡改和证据断链；若发现率未升或手工负担抵销收益，就不采用。

#### 证据与依据

**依据 1 · 源码核查**：[src/clawock/workflows/improvements.py:106-155](https://github.com/KCNyu/clawock/blob/fcb35fd5a67904a8a3f62c9da62da76828d87d50/src/clawock/workflows/improvements.py#L106-L155)

后验匹配、时间、报价和 FX 的核查。

<details>
<summary>查看原文（50行）</summary>

```text
    expected_workflow = {
        "id": contract.get("id"), "version": contract.get("version")
    }
    if outcome.get("workflow") != expected_workflow:
        raise ValueError("outcome workflow does not match the prepared workflow")
    if outcome.get("decision_id") != decision.get("decision_id"):
        raise ValueError("outcome decision_id does not match decision.json")
    observed_at = _aware_time(outcome.get("observed_at"), "outcome.observed_at")
    decision_as_of = _aware_time(decision.get("as_of"), "decision.as_of")
    if observed_at <= decision_as_of:
        raise ValueError("outcome.observed_at must be later than decision.as_of")

    evidence = outcome.get("evidence")
    evidence_fields = {
        "source", "source_class", "quote_currency", "entry_price",
        "outcome_price", "base_currency", "entry_fx_quote_to_base",
        "outcome_fx_quote_to_base",
    }
    if not isinstance(evidence, dict) or set(evidence) != evidence_fields:
        raise ValueError(
            "outcome.evidence must contain exactly source, source_class, currencies, "
            "prices and entry/outcome FX rates"
        )
    if evidence.get("source_class") not in {"broker", "exchange", "market_data"}:
        raise ValueError("outcome.evidence.source_class must be broker, exchange or market_data")
    if not isinstance(evidence.get("source"), str) or not evidence["source"].strip():
        raise ValueError("outcome.evidence.source is required")
    for field in ("quote_currency", "base_currency"):
        if not isinstance(evidence.get(field), str) or not evidence[field].strip():
            raise ValueError(f"outcome.evidence.{field} is required")
    if evidence["quote_currency"] != decision["subject"]["currency"]:
        raise ValueError("outcome quote_currency must match decision subject currency")

    entry_price = _positive_decimal(evidence["entry_price"], "entry_price")
    outcome_price = _positive_decimal(evidence["outcome_price"], "outcome_price")
    entry_fx = _positive_decimal(
        evidence["entry_fx_quote_to_base"], "entry_fx_quote_to_base"
    )
    outcome_fx = _positive_decimal(
        evidence["outcome_fx_quote_to_base"], "outcome_fx_quote_to_base"
    )
    if evidence["quote_currency"] == evidence["base_currency"] and (
        entry_fx != Decimal("1") or outcome_fx != Decimal("1")
    ):
        raise ValueError("same-currency outcome FX rates must both equal 1")

    quote_move = ((outcome_price / entry_price) - 1) * BPS
    entry_base = entry_price * entry_fx
    outcome_base = outcome_price * outcome_fx
    base_move = ((outcome_base / entry_base) - 1) * BPS
```

</details>

**依据 2 · 作者声明**：[README.md:137-162](https://github.com/KCNyu/clawock/blob/fcb35fd5a67904a8a3f62c9da62da76828d87d50/README.md#L137-L162)

作者对方向、模拟成本和实际账户的区分。

<details>
<summary>查看原文（26行）</summary>

```text
## After the close: results feed the next decision

Code settles every call on one standard set of daily bars, read on each market's own trading calendar. Goldwind's reference was 8.645, the first tradable price after publication; the next session closed at 8.28, down 4.22%, so the record is a `loss`. It is a `watch` scored as `passive_stance` with `fill_assumed: false`: a score for the holding judgment, not profit or loss from a new trade. Every call is settled this way and published, wins, losses and ungradeable alike; nobody adjusts a result afterwards.

- **Saying the same thing every day counts once.** From 2026-07-29 to 2026-10-08 the brief said "hold and watch" on Goldwind 45 times. That is one result (`ep-f31982c6d511`), not 45.
- **A call that cannot be graded stays on the ledger.** On 2026-10-01 Hong Kong was closed, so record `dec-143614125e34` has `outcome: unknown`, `status: not_evaluable` and `session_reason: market_closed`.
- **What you did is recorded apart from what the plan said.** `clawock mark-followed` marks each call followed or not.

**The next decision starts from this record.** The 2026-10-12 brief printed the Goldwind call under "Yesterday's results" with `loss` beside it, and the model reads how reliable its earlier confidence figures were, using earlier dates only. In your own harness: observed prices go in `outcome.json`, and `clawock workflow evaluate` writes `evaluation.json`, which checks direction, not realized profit.

<p align="center"><img src="https://raw.githubusercontent.com/KCNyu/clawock/refs/heads/master/site/assets/feedback-learning.svg" width="1016" alt="After the close: a call is recorded once by the model, checked against canonical daily bars on each market’s calendar, grouped into one episode per thesis and settled by code as a win, a loss or ungradeable, all published; on the live desk execution, settlement, history and calibration loop back into the next brief; in any other harness an observed outcome can anchor a bounded proposal that a named review accepts or rejects, applied with a rollback record"></p>

Results or a rejected publication can support a proposal to change the evidence requirements: only the required evidence count and the confidence limit without a primary source, never strategies, trading rules or the skill. A named reviewer's decision is recorded before it applies, and it can be rolled back ([feedback protocol](https://github.com/KCNyu/clawock/blob/master/docs/architecture/runtime-protocol.md#evaluate-and-improve-without-owning-the-agent)).

<p align="center"><img src="https://raw.githubusercontent.com/KCNyu/clawock/refs/heads/master/site/assets/shadow-backtest.png" alt="cumulative episode win rate against a 50% directional-hit line" width="760"></p>

<sub>Cumulative episode win rate against a 50% directional-hit line: how often the direction was right, not what it earned. Refreshed weekly by GitHub Actions; live figures are on the <a href="https://kcnyu.github.io/clawock/#drill">Holdings tab</a>.</sub>

> [!CAUTION]
> **Read the scorecard with these limits.**
> - **It measures direction, not money.** Keeping the model away from its own score stops it grading itself; it does not make the market data or the definitions correct.
> - **The calls to act have not been shown to beat a coin flip.** A signal whose measured range still includes 50% is kept out of decisions, and the leverage dial's timing cannot be told apart from chance. Both are published in [Reflect](https://kcnyu.github.io/clawock/#reflect).
> - **The shadow portfolio is a simulation.** Its headline leaves out commission and spread; a second figure with a cost deduction fixed in advance sits beside it. Neither models market impact.
> - **The account's result is yours plus the model's.** Every call carries its status: followed, not followed or unknown.

With ledger data you can redo the sums: `clawock scorecard-provenance --check` rebuilds each published headline number from `memory/decisions.jsonl`, and `clawock audit-resettle` settles the whole ledger again. [How grading handles the hard cases](https://github.com/KCNyu/clawock/blob/master/docs/how-the-desk-works.md#the-public-scorecard) · [what we tested, and what failed](https://github.com/KCNyu/clawock/blob/master/docs/how-the-desk-works.md#what-we-tested-and-what-failed).
```

</details>

**依据 3 · 作者声明**：[README.md:79-94](https://github.com/KCNyu/clawock/blob/fcb35fd5a67904a8a3f62c9da62da76828d87d50/README.md#L79-L94)

文件协议可用于离线演练。

<details>
<summary>查看原文（16行）</summary>

```text
## Any harness, one decision contract that accumulates evidence

clawock was never inside the chat. It is one skill (`investment-decision`), one command line tool and a handful of files in your workspace, so any agent that can read a file, write a file and run a command can use it: **Claude Code / Codex / OpenClaw / DeepSeek Harness / your own script**. Switch from Claude Code to Codex next month and, with the same workspace, the history comes with you.

Your agent keeps its model, conversation, memory, research tools, credentials and permissions; clawock never starts a model. It pins down what went in, checks what came out, marks the result later and keeps the record:

| File | Written by | What it holds |
|---|---|---|
| `request.json` | clawock, when you run `clawock run prepare` | the material for this decision, with a fingerprint of every document so it cannot be swapped afterwards |
| `decision.json` | your agent | its answer: the case for, the case against, the action, and what would prove it wrong |
| `plan.json` | the author's setup, every morning | the same answer for a whole portfolio, one entry per position |
| `decisions.jsonl` | the author's setup | the public ledger: one line per decision, with the result added once code has marked it |
| `outcome.json` | you, once the waiting period is over | the prices you saw and where you got them |
| `evaluation.json` | clawock, when you run `clawock workflow evaluate` | whether the direction was right. It is not money made |

**The model itself does not change; the record does.** Before the next plan the agent can review earlier judgments and their results, and with enough evaluated history the author's setup also checks how reliable earlier confidence figures were. A new workspace starts empty: you build the history by recording decisions and evaluating them.
```

</details>

#### 缺口

- 没有本轮独立回放，未核作者收益和在线数据
  **影响**：只能给出流程采用判断
  **进一步探讨**：用固定虚构样例对照两套流程并记录核查分钟数和可审计错误

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
