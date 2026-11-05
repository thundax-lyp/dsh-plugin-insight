# leantoken

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5cfab83](https://github.com/morluto/leantoken/tree/5cfab83047d4dc77b1b5826016bc75edcd9b4bc4)

<!-- BEGIN META -->
[![GitHub ★ 144](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=144&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/morluto/leantoken)
<!-- END META -->

> **功能**：通过本地索引和 MCP 为开发 Agent 返回带 token 预算的仓库代码上下文。

> **亮点**：[Q01](#research-q01) 把任务检索与有限上下文打包，帮助 Agent 决定下一步精读位置。

> **主要限制**：[Q02](#research-q02) 预算会裁掉诊断或片段，覆盖与索引状态仍需核对。[Q03](#research-q03) 作者结果限特定只读任务。

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
  - [Q01 · 代码定位能在哪一步用更小上下文？](#detail-section-11)
  - [Q02 · 如何在预算下返回片段，哪些证据可能被省略？](#detail-section-12)
  - [Q03 · 作者的节省能否指导采用，怎样做最小验证？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：代码修改前需要在大仓库定位相关实现和证据。

由开发 Agent 用原生搜索和文件读取逐步探索仓库。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 仓库上下文 | 按任务定位片段 | 依赖索引和范围，预算不保证覆盖 |
| 响应预算 | 控制检索输出体量 | 作者节省只对应固定实验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 可运行 LeanToken 的宿主和测试仓库 | 必需 | 建立本地索引及 MCP 查询 | 缺集成时使用原生工具 |
| 匹配运行时或预构建包 | 按安装方式必需 | 启动查询服务 | 启动及索引可能失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户固定仓库、任务和模型 | 记录索引冷暖及基线 |
| 检索 | 用户比较上下文和路径覆盖 | 人工核对关键代码 |
| 退出 | 用户回原生查读 | 保留正确性验收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 索引资源未知 | 配置宿主与建立测试索引 | 依赖仓库体量 |
| 持续 | token 和资源未知 | 复核遗漏、过期索引 | 只读定位与修改不同 |
| 失败 | 回退时间未知 | 用原生工具补查 | 关键证据不足时退出 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 代码定位 | 预算约束的证据片段 | 目标宿主上的准确率、总耗时和输入 |

> **思考**：[Q02](#research-q02) 预算会裁掉诊断或片段，覆盖与索引状态仍需核对。[Q03](#research-q03) 作者结果限特定只读任务。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把任务检索与有限上下文打包，帮助 Agent 决定下一步精读位置。

[Q02](#research-q02) 响应拟合会在强约束场景保留选中项并可能返回预算错误，不能只看字数。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 预算会裁掉诊断或片段，覆盖与索引状态仍需核对。[Q03](#research-q03) 作者结果限特定只读任务。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 以同模型同仓库做只读对照，先确认关键证据，再判断节省。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 MCP 和预算路径；作者实验未复算，目标宿主和真实修改未验收。

- 已检查：作者 README、包清单、源码路径 README.md、src/mcp/tools.rs、src/services/context/execution.rs、src/mcp/requests/context.rs、src/services/context/finalize.rs、docs/measurement.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Rust MCP 和上下文路径及作者方法。未运行目标、建立索引或复算模型实验。
- 下一步：复验已标注任务的覆盖、预算、更新、冷索引和模型总输入。

**分析版本**

- **仓库**：[morluto/leantoken](https://github.com/morluto/leantoken)
- **版本号**：未声明（[固定提交 5cfab83](https://github.com/morluto/leantoken/tree/5cfab83047d4dc77b1b5826016bc75edcd9b4bc4)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 在同一测试集比较总输入、必要证据覆盖和冷索引成本，判断何时启用。

复验已标注任务的覆盖、预算、更新、冷索引和模型总输入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 48 | 13909 | — | — | 106361 |
| .ts | example | 9 | 48 | 41 | 0 | — |
| .tsx | example | 2 | 10 | 9 | 0 | — |
| .md | example | 1 | 3 | — | — | 10 |
| .js | example | 2 | 10 | 8 | 0 | — |
| .cjs | source | 1 | 59 | 51 | 0 | — |
| .mjs | source | 2 | 325 | 300 | 1 | — |
| .mjs | test | 1 | 245 | 223 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/morluto/leantoken/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=23&color=737b86&logo=github)](https://github.com/morluto/leantoken/issues?q=is%3Aissue+created%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z) [![近30天关闭 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=23&color=737b86&logo=github)](https://github.com/morluto/leantoken/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：开发 Agent 能否在较少上下文下定位可核对代码证据，并保留必要覆盖？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 代码定位能在哪一步用更小上下文？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

大型仓库的开发 Agent 可先请求某个任务相关的符号、文件和片段，再回原生工具精读和修改。相比不断搜索和读整文件，LeanToken 用任务候选及输出预算组织第一批证据。MCP 是独立工具，README 所列安装宿主不包含 DSH，需另外验证集成。合格结果是定位足够的关键路径、代码依据及缺失项，之后仍需要测试补丁。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-71](https://github.com/morluto/leantoken/blob/5cfab83047d4dc77b1b5826016bc75edcd9b4bc4/README.md#L30-L71)

支持的宿主和任务示例。

<details>
<summary>查看原文（42行）</summary>

````text
## Quick start

Add LeanToken to Claude Code, Cursor, OpenCode, Codex, Gemini CLI, or
Antigravity:

```bash
npx leantoken setup
```

<details>
<summary><strong>Setup behavior and safety</strong></summary>

Current releases stop setup before writing when `npx` resolves a stale
project-local or ancestor install, and point to
`npx leantoken@latest setup`. Older releases that predate this check can be
bootstrapped directly with that versioned command.

The interactive setup wizard preselects supported clients it detects; you can
change that selection before continuing. It then shows the exact configuration
paths and MCP launcher and asks for a separate final confirmation. Automation
never treats detection as consent. An npx-based setup pins the exact LeanToken
version that ran setup, so restarting a client cannot silently move to a newer
release.

Global setup never stores the repository where setup happened. OpenCode gets a
workspace-relative working directory; other supported clients launch LeanToken
from the workspace cwd selected by the host. If a host instead starts it from
the home directory or a filesystem root, LeanToken refuses to index that broad
root by default.

</details>

Restart or reload the configured clients, then verify the connection and first
retrieval from a repository:

```bash
npx leantoken doctor
```

Try a broad task such as: *Find the code related to request cancellation before
editing.* LeanToken helps the agent start with `leantoken.context`, while its
normal tools remain available for edits, builds, and tests.
````

</details>

**依据 2 · 源码核查**：[src/mcp/tools.rs:365-390](https://github.com/morluto/leantoken/blob/5cfab83047d4dc77b1b5826016bc75edcd9b4bc4/src/mcp/tools.rs#L365-L390)

MCP context 入口。

<details>
<summary>查看原文（26行）</summary>

```text
    async fn leantoken_context(
        &self,
        Parameters(req): Parameters<ContextMcpRequest>,
        context: RequestContext<RoleServer>,
    ) -> Result<CallToolResult, ErrorData> {
        let protocol = context.protocol_version();
        let prepared = match self
            .prepare_retrieval_call(
                context.ct.clone(),
                req.repository_context.as_deref(),
                |limits| req.validate_limits(limits),
            )
            .await?
        {
            RetrievalPreparation::Ready(prepared) => prepared,
            RetrievalPreparation::Unavailable(result) => return Ok(result),
        };
        let max_response_tokens = req.max_response_tokens;
        let (
            request,
            workflow,
            workflow_evidence,
            consistency,
            options,
            expected_repository_id,
            handoff,
```

</details>

**依据 3 · 源码核查**：[src/services/context/execution.rs:174-235](https://github.com/morluto/leantoken/blob/5cfab83047d4dc77b1b5826016bc75edcd9b4bc4/src/services/context/execution.rs#L174-L235)

查询和候选组装。

<details>
<summary>查看原文（62行）</summary>

```text
            let mut phases = ContextPhaseTracker::new(diagnostics, generation);
            let candidate_generation_started = phases.timer();
            phases.counters.queries_planned = queries.len();
            phases.counters.queries_executed = queries
                .iter()
                .filter(|query| !query.is_generic_test_path_prior())
                .count();
            let terms = queries
                .iter()
                .map(|query| query.value.clone())
                .collect::<Vec<_>>();
            let path_scorer = ContextPathScorer::new(&terms, &request.task);
            let mut batch = CandidateBatch::default();
            let constraint_expansion = self.append_constraint_candidates(
                ConstraintCandidateExpansion {
                    session,
                    request: &scoped_request,
                    queries: &queries,
                    path_scorer: &path_scorer,
                    cancellation,
                    focus: policy.focus(),
                },
                &mut batch.candidates,
                &mut phases,
            )?;
            batch.coverage = constraint_expansion.coverage;
            batch.warnings = self.append_focus_candidates(
                FocusExpansion {
                    session,
                    request: &scoped_request,
                    queries: &queries,
                    path_scorer: &path_scorer,
                    resolutions: &constraint_expansion.focus_paths,
                    cancellation,
                    focus: policy.focus(),
                },
                &mut batch.candidates,
                &mut phases,
            )?;

            // Workflow words such as `test` are useful path priors but terrible
            // retrieval queries: nearly every test function becomes a high-
            // scoring symbol candidate. Keep them out of candidate generation.
            for query in queries
                .iter()
                .filter(|query| !query.is_generic_test_path_prior())
            {
                let result = self.append_query_candidates(
                    QueryCandidateExpansion {
                        session,
                        request: &request,
                        query,
                        path_filter: &path_filter,
                        strict_changed_paths: strict_changed_paths.as_ref(),
                        changed_paths: &changed_paths,
                        path_scorer: &path_scorer,
                        cancellation,
                        signals,
                    },
                    &mut batch,
                    &mut phases,
                );
```

</details>

#### 缺口

- 未复验 DSH 或真实修复任务
  **影响**：不能断言目标宿主的使用和补丁结果
  **进一步探讨**：在固定仓库对照首轮定位与必要精读

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何在预算下返回片段，哪些证据可能被省略？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

请求分别验证 token_budget、max_response_tokens、片段数及 focus 约束。引擎将约束候选、focus 候选和查询候选组合。成品超预算时先剔除部分遗漏详情、diff evidence、routing 和候选解释，再在没有强约束时裁剪选中片段；仍无法满足时需看返回失败。预算是响应生成限制，不能推导仓库内容覆盖、模型真实上下文或任务正确率。

#### 证据与依据

**依据 1 · 源码核查**：[src/mcp/requests/context.rs:119-174](https://github.com/morluto/leantoken/blob/5cfab83047d4dc77b1b5826016bc75edcd9b4bc4/src/mcp/requests/context.rs#L119-L174)

预算和输入验证。

<details>
<summary>查看原文（56行）</summary>

```text
    pub(in crate::mcp) fn validate_limits(&self, limits: McpLimitPolicy) -> crate::Result<()> {
        validate_optional_positive_limit(
            "token_budget",
            self.token_budget,
            limits.max_output_tokens,
        )?;
        validate_optional_positive_limit(
            "max_response_tokens",
            self.max_response_tokens,
            limits.max_response_tokens,
        )?;
        validate_optional_positive_limit("max_fragments", self.max_fragments, limits.max_results)?;
        validate_optional_positive_limit(
            "minimum_fragments_per_focus_path",
            self.minimum_fragments_per_focus_path,
            limits.max_results,
        )?;
        if (self.strict_focus_paths || self.minimum_fragments_per_focus_path.is_some())
            && self.focus_paths.is_empty()
        {
            return Err(crate::Error::InvalidInput {
                field: "focus paths",
                reason: "must not be empty when focus path constraints are enabled",
            });
        }
        Ok(())
    }

    pub(in crate::mcp) fn into_parts(
        self,
        default_token_budget: usize,
    ) -> (
        ContextRequest,
        ContextWorkflow,
        WorkflowEvidence,
        IndexConsistency,
        ServiceCallOptions,
        Option<String>,
        Option<HandoffManifestRequest>,
    ) {
        let options = if self.plan_only {
            service_call_options(self.max_response_tokens)
        } else {
            service_call_options_with_receipt(self.max_response_tokens)
        };
        let options = self.response_profile.map_or(options, |profile| {
            options.with_context_response_profile(profile)
        });
        (
            ContextRequest {
                task: self.task.into_string(),
                token_budget: self.token_budget.unwrap_or(default_token_budget),
                include_paths: self.include_paths,
                must_include_paths: self.must_include_paths,
                must_include_symbols: self.must_include_symbols,
                required_evidence: self.required_evidence,
```

</details>

**依据 2 · 源码核查**：[src/services/context/execution.rs:174-235](https://github.com/morluto/leantoken/blob/5cfab83047d4dc77b1b5826016bc75edcd9b4bc4/src/services/context/execution.rs#L174-L235)

候选机制。

<details>
<summary>查看原文（62行）</summary>

```text
            let mut phases = ContextPhaseTracker::new(diagnostics, generation);
            let candidate_generation_started = phases.timer();
            phases.counters.queries_planned = queries.len();
            phases.counters.queries_executed = queries
                .iter()
                .filter(|query| !query.is_generic_test_path_prior())
                .count();
            let terms = queries
                .iter()
                .map(|query| query.value.clone())
                .collect::<Vec<_>>();
            let path_scorer = ContextPathScorer::new(&terms, &request.task);
            let mut batch = CandidateBatch::default();
            let constraint_expansion = self.append_constraint_candidates(
                ConstraintCandidateExpansion {
                    session,
                    request: &scoped_request,
                    queries: &queries,
                    path_scorer: &path_scorer,
                    cancellation,
                    focus: policy.focus(),
                },
                &mut batch.candidates,
                &mut phases,
            )?;
            batch.coverage = constraint_expansion.coverage;
            batch.warnings = self.append_focus_candidates(
                FocusExpansion {
                    session,
                    request: &scoped_request,
                    queries: &queries,
                    path_scorer: &path_scorer,
                    resolutions: &constraint_expansion.focus_paths,
                    cancellation,
                    focus: policy.focus(),
                },
                &mut batch.candidates,
                &mut phases,
            )?;

            // Workflow words such as `test` are useful path priors but terrible
            // retrieval queries: nearly every test function becomes a high-
            // scoring symbol candidate. Keep them out of candidate generation.
            for query in queries
                .iter()
                .filter(|query| !query.is_generic_test_path_prior())
            {
                let result = self.append_query_candidates(
                    QueryCandidateExpansion {
                        session,
                        request: &request,
                        query,
                        path_filter: &path_filter,
                        strict_changed_paths: strict_changed_paths.as_ref(),
                        changed_paths: &changed_paths,
                        path_scorer: &path_scorer,
                        cancellation,
                        signals,
                    },
                    &mut batch,
                    &mut phases,
                );
```

</details>

**依据 3 · 源码核查**：[src/services/context/finalize.rs:140-202](https://github.com/morluto/leantoken/blob/5cfab83047d4dc77b1b5826016bc75edcd9b4bc4/src/services/context/finalize.rs#L140-L202)

先剔除诊断、强约束时不裁选中项。

<details>
<summary>查看原文（63行）</summary>

```text
    pub(super) fn fit_context_response(
        &self,
        response: &mut ContextResponse,
        request: &ContextRequest,
        policy: &ContextPolicy,
        options: ServiceCallOptions,
    ) -> Result<()> {
        let max_response_tokens = options
            .max_response_tokens()
            .expect("context fitting requires a response token limit");
        self.finalize_context_response_accounting(response, options)?;
        if self.context_response_fits(response, policy, max_response_tokens, options)? {
            return Ok(());
        }

        response.omitted.clear();
        response.omission_summary.by_path.clear();
        response.omission_summary.by_language_or_file_type.clear();
        response.omission_summary.by_reason.clear();
        response.omission_summary.by_score_band.clear();
        if self.context_response_fits(response, policy, max_response_tokens, options)? {
            self.finalize_context_response_accounting(response, options)?;
            return Ok(());
        }

        if let Some(scope) = &mut response.diff_scope {
            scope.evidence = None;
        }
        if self.context_response_fits(response, policy, max_response_tokens, options)? {
            self.finalize_context_response_accounting(response, options)?;
            return Ok(());
        }

        response.routing = None;
        if self.context_response_fits(response, policy, max_response_tokens, options)? {
            self.finalize_context_response_accounting(response, options)?;
            return Ok(());
        }

        if let Some(plan) = &mut response.plan {
            for candidate in &mut plan.candidates {
                candidate.reasons.clear();
            }
        }
        for fragment in &mut response.fragments {
            fragment.reason.clear();
        }
        if self.context_response_fits(response, policy, max_response_tokens, options)? {
            self.finalize_context_response_accounting(response, options)?;
            return Ok(());
        }

        let can_reduce_selected = request.include_paths.is_empty()
            && request.must_include_paths.is_empty()
            && request.must_include_symbols.is_empty()
            && request.required_evidence.is_empty()
            && request.focus_paths.is_empty()
            && request.focus_symbols.is_empty()
            && policy.focus_minimum().is_none()
            && request.base_revision.is_none()
            && request.changed_paths.is_empty()
            && !request.strict_changed_paths
            && response.handoff_manifest.is_none();
```

</details>

**依据 4 · 源码核查**：[src/services/context/finalize.rs:203-231](https://github.com/morluto/leantoken/blob/5cfab83047d4dc77b1b5826016bc75edcd9b4bc4/src/services/context/finalize.rs#L203-L231)

查找可装入的前缀。

<details>
<summary>查看原文（29行）</summary>

```text
        if can_reduce_selected {
            let selected = response
                .plan
                .as_ref()
                .map_or(response.fragments.len(), |plan| plan.candidates.len());
            let omission_reserve = response
                .omission_summary
                .budget_or_result_limit
                .saturating_add(selected);
            let budget = ResponseBudget::new(max_response_tokens);
            let keep = budget.largest_fitting_prefix(selected, |keep| {
                let mut candidate = response.clone();
                Self::trim_context_selection(&mut candidate, keep);
                candidate.omission_summary.budget_or_result_limit = omission_reserve;
                Self::refresh_context_omission_warning(&mut candidate);
                self.context_response_tokens_with_receipt_reserve(&candidate, policy, options)
            })?;
            if let Some(keep) = keep {
                Self::trim_context_selection(response, keep);
                self.finalize_context_response_accounting(response, options)?;
                if self.context_response_fits(response, policy, max_response_tokens, options)? {
                    return Ok(());
                }
                return Err(Error::ResponseAccountingInvariant(
                    "context prefix fitting violated its monotonic sizing reserve".into(),
                ));
            }
            Self::trim_context_selection(response, 0);
        }
```

</details>

#### 缺口

- 未测试目标仓库冷索引、更新及预算边界
  **影响**：无法知道必需证据遗漏率和真实端到端延迟
  **进一步探讨**：用有隐藏必要证据和刚修改文件的任务测试范围与遗漏

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 作者的节省能否指导采用，怎样做最小验证？

**研究主题**：效果与总成本、依赖、兼容与流程、采用判断、新假设与验证

#### 完整回答

作者 v2 的 60 次试验使用固定任务、Codex CLI、模型和低推理设置，对 thin native 的总输入减少 20.1%，对 full native 减少 37.6%，路径集成功 15/20；v1 迭代方案表现较差，说明调度策略会影响结论。它衡量只读路径定位，不能转述为目标 DSH 或生产修改的节省。本轮未复算。先在可弃用仓库与受支持宿主确认本地索引范围，按同任务对照原生搜索。可用要求覆盖关键路径与证据的门槛，按仓库和任务规模比较总输入、准确率、冷索引及总时长；若输入下降但遗漏或总耗时变差，则不采纳。

#### 证据与依据

**依据 1 · 源码核查**：[docs/measurement.md:1060-1075](https://github.com/morluto/leantoken/blob/5cfab83047d4dc77b1b5826016bc75edcd9b4bc4/docs/measurement.md#L1060-L1075)

作者实验环境与指标。

<details>
<summary>查看原文（16行）</summary>

```text
validation tasks from Flask, Gin, Express, and Tokio. The Python, Go,
JavaScript, and Rust repositories are pinned to the revisions already frozen in
`validation.json`; the multi-agent experiment did not create new answer labels.
Path-set success requires the complete labeled file set with no extra path.
This is stricter than file recall but does not require one evidence item per
symbol in a file. It still measures repository triage, not patch correctness.

Each suite runs three arms five times per task, for 60 model runs. A fixed seed
orders the task/arm/repetition Cartesian product by SHA-256 so provider drift
does not systematically favor one arm. Every run uses Codex CLI 0.144.1,
account-selected `gpt-5.6-sol`, low reasoning, read-only sandboxing, one root,
one depth-one child, and the same parent-history calibration. Total input is the
primary context-volume metric. Uncached input is secondary because provider
cache state is not controlled. The deterministic bootstrap resamples the five
repetitions within each fixed task; its interval describes run variability for
these tasks, not generalization to unseen repositories.
```

</details>

**依据 2 · 源码核查**：[docs/measurement.md:1112-1137](https://github.com/morluto/leantoken/blob/5cfab83047d4dc77b1b5826016bc75edcd9b4bc4/docs/measurement.md#L1112-L1137)

两轮反证与 v2 数据。

<details>
<summary>查看原文（26行）</summary>

```text
| --- | ---: | ---: | ---: | ---: | ---: |
| v1 full native | 13/20 | 3,058,682 | 152,934 | 5.05 | 0 |
| v1 thin native | 13/20 | 2,398,194 | 119,910 | 4.70 | 0 |
| v1 iterative structured LeanToken | 11/20 | 3,619,594 | 180,980 | 8.20 | 13 |
| v2 full native | 13/20 | 3,107,550 | 155,378 | 5.15 | 0 |
| v2 thin native | 12/20 | 2,427,935 | 121,397 | 4.90 | 0 |
| v2 context-bundle LeanToken | 15/20 | 1,939,338 | 96,967 | 3.75 | 0 |

| Paired comparison | Total-input savings | Stratified bootstrap 95% interval | Wins |
| --- | ---: | ---: | ---: |
| v1 thin native vs full native | 21.6% | 15.3% to 27.4% | 18/20 |
| v2 thin native vs full native | 21.9% | 10.1% to 32.3% | 16/20 |
| v2 context bundle vs thin native | 20.1% | 13.4% to 26.3% | 18/20 |
| v2 context bundle vs full native | 37.6% | 32.3% to 43.0% | 20/20 |

The v2 context bundle also reduced uncached input by 16.0% versus thin native
and 27.2% versus full native. Its total-input coefficient of variation was
7.8%, compared with 25.7% and 33.7% for the fresh native controls. All
predeclared v2 gates passed: 75% path-set success versus 60% thin native and
65% full native, positive savings and confidence lower bounds, no per-task
success regression, and no MCP or tool-contract violation. Relative to the v1
LeanToken arm, v2 cut provider requests from 164 to 75 and family input by
46.4%, while increasing successes from 11 to 15.

The two aggregate reports retain all 60 redacted run samples and a hash of the
receipt set, so the summaries can be recomputed without private rollouts:
```

</details>

**依据 3 · 作者声明**：[README.md:47-71](https://github.com/morluto/leantoken/blob/5cfab83047d4dc77b1b5826016bc75edcd9b4bc4/README.md#L47-L71)

配置、目录和验收入口。

<details>
<summary>查看原文（25行）</summary>

````text
The interactive setup wizard preselects supported clients it detects; you can
change that selection before continuing. It then shows the exact configuration
paths and MCP launcher and asks for a separate final confirmation. Automation
never treats detection as consent. An npx-based setup pins the exact LeanToken
version that ran setup, so restarting a client cannot silently move to a newer
release.

Global setup never stores the repository where setup happened. OpenCode gets a
workspace-relative working directory; other supported clients launch LeanToken
from the workspace cwd selected by the host. If a host instead starts it from
the home directory or a filesystem root, LeanToken refuses to index that broad
root by default.

</details>

Restart or reload the configured clients, then verify the connection and first
retrieval from a repository:

```bash
npx leantoken doctor
```

Try a broad task such as: *Find the code related to request cancellation before
editing.* LeanToken helps the agent start with `leantoken.context`, while its
normal tools remain available for edits, builds, and tests.
````

</details>

#### 缺口

- 未独立复现和比较不同宿主及任务
  **影响**：不能预测成本、召回或真实修复效果
  **进一步探讨**：固定模型、任务和索引状态进行同条件 A/B

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
