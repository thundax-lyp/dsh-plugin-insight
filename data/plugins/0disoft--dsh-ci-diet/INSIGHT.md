# dsh-ci-diet

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[90dd385](https://github.com/0disoft/dsh-ci-diet/tree/90dd38518bb9acb0b3013537cf7861e1c1fb0915)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/0disoft/dsh-ci-diet) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ci-diet)
<!-- END META -->

> **实现功能**：分析GitHub Actions运行与工作流，标注浪费候选并生成需明确审批的本地YAML补丁。

> **核心亮点**：把CI节省建议和可写补丁资格分离，结合覆盖、人工声明、精确字节编辑与重校，形成受限本地变更流程；同时不把观测分钟冒充实际账单。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：是否可取消旧run和减少保留期取决于CI之外的发布、保护及工件消费者。代码能在coverage/claim不足时拒写，但人类声明仍是外部前提；历史counterfactual与价目估计不能证明真实收益或用户等待减少。参见[Q03](#research-q03)。

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
  - [Q01 · 谁需要CI费用诊断与补丁，相对手工或宿主原生办法增加什么？](#detail-section-11)
  - [Q02 · 分析覆盖、定价模型和变更审批如何从入口形成完整调用链，依赖失效怎么办？](#detail-section-12)
  - [Q03 · 什么实现边界最可能使CI费用诊断与补丁的贡献不成立，哪些工程设计可复用？](#detail-section-13)
  - [Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？](#detail-section-14)
  - [Q05 · 可从分析覆盖、定价模型和变更审批的限制推导什么可证伪改进？](#detail-section-15)
  - [Q06 · 哪些用户可以受控采用CI费用诊断与补丁，何时应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供维护GitHub Actions且愿逐条核业务语义的工程团队，定位重复/长耗时运行并形成小范围可审YAML补丁；交付是有覆盖说明的建议，不是已兑现账单节省。

手查Actions历史和YAML可得同类建议；插件把证据和变更防线结构化，收益仍需真实结果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| ci_diet_scan | 静态workflow诊断 | 不联网，历史相关判断unknown |
| ci_diet_sync | 只读采集Actions历史 | gh认证与显式网络授权 |
| ci_diet_report | 读取成本/规则报告 | 价目/模型估计非实际账单 |
| ci_diet_prune | 清理过期本地状态 | 按存储策略，不删除远程工件 |
| ci_diet_plan | 生成小diff预览 | 规则资格与coverage/claims，不能审批 |
| CLI approve/apply | 明确批准并写本地YAML | digest/nonce/过期/当前依赖/备份重校 |
| CLI revert | 按记录恢复本地字节 | 需核并发变化与备份 |
| 设置页 | 编辑引擎配置 | 报告和apply界面尚未实现 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19||>=24 | 必需 | CLI/分析引擎 | 不满足不能正常启动 |
| 本地Git checkout与workflow可读 | 必需 | 扫描和绑定源码 | 无解析/覆盖不能安全给补丁 |
| gh认证与只读API权限 | 历史分析需要 | 运行/job/保护策略 | 离线仅静态，coverage不足拒写 |
| 仓库owner对CI/工件用途声明 | 补丁必需 | 补齐不可从YAML证明的语义 | 缺attestation或过期拒apply |
| 兼容DSH与tools/settings | 插件使用需要 | 五工具和设置页 | 报告/apply UI未完成，最终走CLI |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 先scan，按授权sync只读历史 | coverage/归属/价格快照明确 |
| 2 | 审findings和人工业务声明后plan | 查看小diff与blockers，缺覆盖不强写 |
| 3 | 人类CLI输入digest尾12位批准 | 审批绑定确切plan且未过期 |
| 4 | apply后运行项目必要验证并观察下一批CI | 这里只写本地，Git/PR/CI部署由用户流程另管 |
| 5 | 不符预期用revert并核备份 | 并发改动/陈旧依赖应拒绝重放 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地包/状态存储、API额度，金额未知 | 对齐仓库和历史覆盖，理解规则 | 工具不需LLM判断 |
| 持续使用 | 同步API、缓存和报告存储 | 审误报、声明用途、复核CI正确性 | 价目delta不等于实际账单 |
| 失败恢复 | 备份和重新扫描资源 | 重作过期plan/revert/恢复CI | 取消旧运行可能影响外部副作用，需owner判断 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可审建议 | 规则coverage与observed/inferred/static分层 | 真实各仓库误报和采纳率 |
| 补丁控制 | digest/nonce/expiry/依赖/源码重校 | 业务声明正确与CI结果 |
| 费用估计 | 观测秒数、取整分钟、价目与边际估计分离 | actualBilledUsd仍unknown，不是省钱收据 |

> **思考**：是否可取消旧run和减少保留期取决于CI之外的发布、保护及工件消费者。代码能在coverage/claim不足时拒写，但人类声明仍是外部前提；历史counterfactual与价目估计不能证明真实收益或用户等待减少。参见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把CI节省建议和可写补丁资格分离，结合覆盖、人工声明、精确字节编辑与重校，形成受限本地变更流程；同时不把观测分钟冒充实际账单。参见[Q01](#research-q01)、[Q02](#research-q02)。

把CI节省建议和可写补丁资格分离，结合覆盖、人工声明、精确字节编辑与重校，形成受限本地变更流程；同时不把观测分钟冒充实际账单。参见[Q01](#research-q01)、[Q02](#research-q02)。

coverage资格与finding分离、nonce绑定、realpath/依赖重采集和单写者lease可借鉴。移植需保存拒绝条件、人工语义声明及故障日志，不能只复制“审批”按钮。

<a id="detail-section-5"></a>

### 1.4 主要限制

是否可取消旧run和减少保留期取决于CI之外的发布、保护及工件消费者。代码能在coverage/claim不足时拒写，但人类声明仍是外部前提；历史counterfactual与价目估计不能证明真实收益或用户等待减少。参见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合熟悉自家CI的维护者先用只读scan/sync/report试用，再逐个plan审语义；复杂部署副作用、保护归属不清或无工件owner时只观察不apply。失败应保留备份和拒绝原因，不能绕coverage凑补丁。参见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

规则、coverage和审批/重校机制可核；真实误报、补丁收益及账单效果未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/dsh/host/plugin.ts、src/core/rules/cd001.ts、src/core/savings/report-metrics.ts、src/core/patch/apply.ts、src/core/patch/approval.ts、src/core/patch/verify.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读规则CD001、指标、DSH工具和补丁approval/verify/apply；未遍历全规则、全部历史适配/锁实现或执行质量门。
- 下一步：在owner理解的单仓库先只读核标签和coverage，再选可回退规则比较补丁前后必要检查、消费者和实际计费。

**分析版本**

- **仓库**：[0disoft/dsh-ci-diet](https://github.com/0disoft/dsh-ci-diet)
- **版本号**：0.3.1（[固定提交 90dd385](https://github.com/0disoft/dsh-ci-diet/tree/90dd38518bb9acb0b3013537cf7861e1c1fb0915)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可在补丁后自动生成只读的前后任务/工件可用性收据，绑定同类工作量与实际计费区间，区分规则命中、owner采纳及结果。若必要检查/消费者受损或实际净成本未降即否定；假设未验证，采集与长期观察增加负担。参见[Q05](#research-q05)。

在owner理解的单仓库先只读核标签和coverage，再选可回退规则比较补丁前后必要检查、消费者和实际计费。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 1337 | — | — | 9849 |
| .md | test | 6 | 1154 | — | — | 10758 |
| .md | example | 1 | 28 | — | — | 238 |
| .mjs | source | 12 | 1706 | 1499 | 83 | — |
| .ts | source | 79 | 15057 | 13172 | 932 | — |
| .ts | test | 40 | 9306 | 8596 | 74 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/0disoft/dsh-ci-diet/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 90dd38518bb9acb0b3013537cf7861e1c1fb0915 和截止 2026-10-23T01:41:11Z 范围内，CI费用诊断与补丁能为明确用户提供什么可核查增量，其关键限制、总成本和采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要CI费用诊断与补丁，相对手工或宿主原生办法增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护Actions的工程团队常需判断重复run、过大矩阵和工件保留是否浪费。原办法是人工查YAML与Actions历史，插件把规则证据/coverage及小diff集中，成功标准为必要CI和消费者不受损且总投入合理。它没有自动提交/运行/远程删除能力，DSH报告和apply界面仍未完成，不能按完整优化平台描述。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-18](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/README.md#L3-L18)

alpha和未完成UI状态

<details>
<summary>查看原文（16行）</summary>

```text
Find wasted GitHub Actions runner time and propose small, reviewable patches.

Status: **alpha**, `dsh-ci-diet@0.3.1` is released on npm. The contracts,
specification, analysis engine, patch engine, CLI, DSH plugin tools, and a
self-contained HTML report are implemented and tested. The DSH Web client has a
Settings screen; the report and apply screens are still open.

## What it does

CI Diet reads two things and compares them:

1. Workflow YAML from the current working tree.
2. Optionally, execution history fetched with read-only `gh api` calls.

From that it reports where runner minutes are spent and which findings are
safe to turn into a small YAML edit. Every finding carries an evidence level
```

</details>

**依据 2 · 源码核查**：[README.md:35-44](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/README.md#L35-L44)

边界为本地补丁且无GitHub写

<details>
<summary>查看原文（10行）</summary>

```text
## What it never does

- No commits, pushes, pull requests, or merges.
- No workflow runs, no cancelling running jobs, no deleting artifacts or caches.
- No branch protection changes.
- No write permission on GitHub. History access is read-only; a repository
  with no network access still gets the static scan.
- No LLM judging whether a job is wasteful.
- Patches are byte-range edits of the YAML you already have. You review the
  diff, approve it explicitly, and apply it to your working tree.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 分析覆盖、定价模型和变更审批如何从入口形成完整调用链，依赖失效怎么办？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

scan解析当前workflow，sync通过只读gh历史补齐运行、job和policy；规则先产finding及写资格，plan绑定源码/依赖/policy和人类claims。批准需CLI digest尾12位，apply在锁内重读依赖、nonce、覆盖及备份后字节替换。需要Node/checkout，历史需gh认证，写入需owner语义确认；用户先只读诊断再逐个plan/approve/apply，冲突重作不硬写，DSH工具不能审批。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh/host/plugin.ts:420-435](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/src/dsh/host/plugin.ts#L420-L435)

plan工具只预览不审批

<details>
<summary>查看原文（16行）</summary>

```text
  ctx.tools.register(defineTool({
    name: "ci_diet_plan",
    description: t("dsh.plan.description"),
    parameters: {
      rule: { type: "string", enum: ["CD001", "CD005", "CD008"], required: true, description: t("dsh.param.rule") },
      workflow: { type: "string", description: t("dsh.param.workflow") },
      job: { type: "string", description: t("dsh.param.job") },
      step: { type: "number", description: t("dsh.param.step") },
      minutes: { type: "number", description: t("dsh.param.minutes") },
      cwd: { type: "string", description: t("dsh.param.cwd") },
      claims: {
        type: "array",
        items: { type: "string" },
        description:
          "Human attestation claims for this preview only: ci-only, replace-safe, artifact-purpose:temporary|release, " +
          "consumer-min-days:N, reviewed-opaque-nodes. The tool never approves anything.",
```

</details>

**依据 2 · 源码核查**：[src/core/patch/approval.ts:27-29](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/src/core/patch/approval.ts#L27-L29)

明确digest确认

```text
/** The human must type the last 12 hex characters of the plan digest. */
export function approvalConfirmation(plan: PatchPlan): string {
  return plan.planDigest.slice(-12);
```

**依据 3 · 源码核查**：[src/core/patch/approval.ts:47-79](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/src/core/patch/approval.ts#L47-L79)

nonce和状态版本处理

<details>
<summary>查看原文（33行）</summary>

```text
function approveLocked(input: ApproveInput): ApproveResult {
  const stored = input.store.readPlan(input.planId);
  if (stored === null) throw new Error("PLAN_NOT_FOUND: " + input.planId);
  const plan = stored.plan;
  if (plan.status.state === "approved") throw new Error("PLAN_ALREADY_APPROVED: " + input.planId);
  if (input.now.getTime() >= Date.parse(plan.payload.expiresAt)) throw new Error("PLAN_EXPIRED: " + plan.payload.expiresAt);
  if (input.confirmation.trim() !== approvalConfirmation(plan)) throw new Error("NONCE_INVALID: confirmation does not match the plan digest");
  const at = input.now.toISOString().replace(/\.\d{3}Z$/, "Z");
  const nonce: ApprovalNonce = {
    nonceId: "n_" + digestOf({ planId: plan.planId, digest: plan.planDigest, at }).slice("sha256:".length, "sha256:".length + 24),
    planDigest: plan.planDigest,
    createdAt: at,
    subjectId: input.subjectId,
    channel: input.channel,
  };
  const approved: PatchPlan = {
    ...plan,
    status: {
      state: "approved",
      revision: plan.status.revision + 1,
      previewedAt: plan.status.previewedAt ?? at,
      approvedAt: at,
      approvalNonceId: nonce.nonceId,
    },
  };
  // A failed nonce write must leave the plan available for an explicit approval retry.
  input.store.saveNonce(plan.planId, nonce);
  try {
    input.store.updatePlanStatus(plan.planId, approved.status, plan.status.revision);
  } catch (error) {
    // Do not leave a nonce that names a status this approval never published.
    input.store.consumeNonce(plan.planId, nonce.nonceId);
    throw error;
```

</details>

**依据 4 · 源码核查**：[src/core/patch/verify.ts:119-147](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/src/core/patch/verify.ts#L119-L147)

apply重校关键不变量

<details>
<summary>查看原文（29行）</summary>

```text
/** Return the closed list of failed apply invariants, in contract order. */
export function checkApply(input: ApplyCheckInput): ApplyReasonCode[] {
  const reasons: ApplyReasonCode[] = [];
  const now = input.now.getTime();
  const payload = input.plan.payload;

  if (digestOf(payload) !== input.plan.planDigest) reasons.push("PLAN_DIGEST_MISMATCH");
  if (input.plan.provenance !== "observed") reasons.push("SYNTHETIC_PLAN");
  if (isExpired(now, isoMillis(payload.expiresAt))) reasons.push("PLAN_EXPIRED");

  const attestationCheck = validAttestations(input);
  reasons.push(...attestationCheck.reasons);
  if (attestationCheck.valid.length > 0) {
    for (const edit of payload.edits) {
      if (!isPatchRule(edit.ruleId)) continue;
      const rule: PatchRule = edit.ruleId;
      if (!attestationCheck.valid.some((attestation) => attestationSatisfiesRule(rule, attestation.claims))) {
        reasons.push("ATTESTATION_CLAIMS_INSUFFICIENT");
        break;
      }
    }
  }

  if (digestOf({ dependencies: payload.dependencies }) !== input.currentDependencyHash) reasons.push("DEPENDENCY_HASH_MISMATCH");
  if (payload.blockers.length > 0) reasons.push("BLOCKERS_PRESENT");
  if (!input.coverageWriteAllowed) reasons.push("COVERAGE_INSUFFICIENT_FOR_WRITE");
  const currentHash = "sha256:" + sha256Hex(input.currentText);
  if (currentHash !== payload.sourceHash) reasons.push("SOURCE_HASH_MISMATCH");
  if (!input.nonceValid) reasons.push("NONCE_INVALID");
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么实现边界最可能使CI费用诊断与补丁的贡献不成立，哪些工程设计可复用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

核心质疑是“可去掉的工作”是否真无业务副作用。CD001检查PR-only、部署/环境、reusable和保护未知等阻断，说明工具主动收窄；但ci-only/replace-safe依赖owner声明，无法仅从YAML证明。CD001用0/30秒取消滞后建模而非真实取消结果，listPrice/边际估计还依SKU与账户额度。路径realpath、regular-file拒符号链接和依赖重采集值得借鉴，不能替代业务验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/rules/cd001.ts:96-126](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/src/core/rules/cd001.ts#L96-L126)

保护和静态阻断条件

<details>
<summary>查看原文（31行）</summary>

```text
/**
 * The stored protection snapshot is read for the default branch only, so a run
 * whose pull request targets another branch cannot be judged from it. Classic
 * protection and required checks also hide ownership that this tool cannot
 * resolve, so anything other than "no classic protection, zero required
 * checks, on the default branch" stays review-only.
 */
function protectionBlockers(context: RuleContext, run: HistoryRun): string[] {
  const blockers: string[] = [];
  const protection = context.history?.protection ?? null;
  if (context.coverage.protectionRules.status !== "complete" || protection === null) {
    blockers.push("PROTECTION_RULES_UNAVAILABLE");
    return blockers;
  }
  const pull = context.history?.pulls.get(run.pullRequestNumbers[0] ?? -1) ?? null;
  if (pull === null) blockers.push("PULL_REQUEST_BASE_BRANCH_UNKNOWN");
  else if (pull.baseBranch !== protection.defaultBranch) blockers.push("PULL_REQUEST_BASE_BRANCH_NOT_DEFAULT");
  if (protection.classicProtection !== false) blockers.push("CLASSIC_BRANCH_PROTECTION_UNKNOWN");
  if (protection.ruleCount === null || protection.ruleCount > 0) blockers.push("REQUIRED_CHECK_OWNERSHIP_UNKNOWN");
  return blockers;
}

function staticBlockers(context: RuleContext, definition: WorkflowDefinition, run: HistoryRun): string[] {
  const blockers: string[] = [];
  const triggers = [...definition.triggers].sort();
  if (triggers.length !== 1 || triggers[0] !== "pull_request") blockers.push("WORKFLOW_TRIGGERS_NOT_PR_ONLY");
  if (definition.concurrency !== null) blockers.push("EXISTING_CONCURRENCY_POLICY");
  if (definition.jobs.some((job) => job.environment !== null)) blockers.push("ENVIRONMENT_DEPENDENCY");
  if (definition.jobs.some((job) => job.reusableWorkflow !== null)) blockers.push("REUSABLE_WORKFLOW_JOB");
  if (definition.jobs.some((job) => jobLooksRisky(job))) blockers.push("DEPLOY_OR_RELEASE_JOB");
  blockers.push(...protectionBlockers(context, run));
```

</details>

**依据 2 · 源码核查**：[src/core/rules/cd001.ts:14-15](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/src/core/rules/cd001.ts#L14-L15)

取消滞后场景是模型参数

```text
/** Cancellation-lag scenarios used to present CD001 as a range. */
export const CD001_LAGS_SECONDS = [0, 30] as const;
```

**依据 3 · 源码核查**：[src/core/savings/report-metrics.ts:84-118](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/src/core/savings/report-metrics.ts#L84-L118)

SKU/额度影响价目与边际估计

<details>
<summary>查看原文（35行）</summary>

```text
  const listPriceUsd = unknownSku
    ? unknownUsd(
        "known subset " + formatUsd(knownRateMicroUsd) + " USD across " + knownSkuJobs + "/" + jobs.length + " jobs",
        "UNKNOWN_SKU",
      )
    : knownUsd(formatUsd(knownRateMicroUsd), "list price delta at confirmed SKUs");

  const billing = options.billing ?? null;
  let estimatedMarginalUsd;
  if (unknownSku || knownSkuJobs === 0) {
    estimatedMarginalUsd = unknownUsd(
      "known subset " + formatUsd(knownRateMicroUsd) + " USD across " + knownSkuJobs + "/" + jobs.length + " jobs",
      "UNKNOWN_SKU",
    );
  } else if (knownRateMinutes <= 0) {
    // Nothing removable means nothing billed, even though the SKU is known.
    estimatedMarginalUsd = knownUsd("0.000000", "no removable minutes at confirmed SKUs");
  } else if (billing === null) {
    estimatedMarginalUsd = unknownUsd(
      "configure billing.includedMinutes and billing.accountMinutesUsed",
      "BILLING_ESTIMATE_UNCONFIGURED",
    );
  } else {
    // accountMinutesUsed is current usage and already includes the analyzed
    // runs, so savings only avoid a charge for minutes that are over the
    // allowance now: overage before minus overage after. An account under its
    // allowance saves no billed minutes today even though the list price drops.
    const overageMinutes = Math.max(0, billing.accountMinutesUsed - billing.includedMinutes);
    const billableMinutes = Math.min(knownRateMinutes, overageMinutes);
    const billableMicro = Math.round((knownRateMicroUsd * billableMinutes) / knownRateMinutes);
    estimatedMarginalUsd = knownUsd(
      formatUsd(billableMicro),
      "saved " + knownRateMinutes + " min at confirmed SKUs; " + overageMinutes
        + " min of the account were already over " + billing.includedMinutes + " included minutes",
    );
```

</details>

**依据 4 · 源码核查**：[src/core/patch/apply.ts:77-105](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/src/core/patch/apply.ts#L77-L105)

路径及当前依赖检查

<details>
<summary>查看原文（29行）</summary>

```text
function resolveInside(root: string, relative: string): string {
  const base = resolve(root);
  const target = resolve(base, relative);
  if (!target.startsWith(base + sep)) throw new Error("WRITE_CONFLICT: path escapes the workspace");
  const physical = relativePath(realpathSync.native(base), realpathSync.native(target));
  if (physical === "" || isAbsolute(physical) || physical === ".." || physical.startsWith(".." + sep)) {
    throw new Error("WRITE_CONFLICT: resolved path escapes the workspace");
  }
  return target;
}

function assertRegularFile(path: string): void {
  const stats = lstatSync(path);
  if (stats.isSymbolicLink()) throw new Error("WRITE_CONFLICT: refusing to replace a symbolic link");
  if (!stats.isFile()) throw new Error("WRITE_CONFLICT: target is not a regular file");
}

/**
 * Re-collect the files the workflow names right now instead of trusting the
 * refs stored in the plan: a symlink can be repointed at different bytes
 * without changing the path the plan recorded.
 */
function dependencyHashNow(binding: RepositoryBinding, workflowPath: string, text: string): string {
  try {
    const workflow = parseWorkflow(workflowPath, text);
    return digestOf({ dependencies: collectDependencies(binding.workspaceRoot, workflow).dependencies });
  } catch {
    // Bytes that cannot be parsed cannot match the approved dependency set.
    return "sha256:unparsable";
```

</details>

#### 缺口

- 本轮未复核质量门的全部真实仓库标签及补丁后CI
  **影响**：不能独立确认误报率或无副作用收益
  **进一步探讨**：选owner能解释的仓库对照finding标签、必要检查及工件消费

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？

**研究主题**：效果与总成本

#### 完整回答

首次需安装和绑定仓库、获取历史/保护覆盖；持续需同步API额度、存储和逐项语义审阅；失败需重扫描、重批过期plan或revert并恢复CI。工具不依赖LLM不等于无维护成本。应按一个保持正确性的被采纳补丁计量人工与实际账单；observedRunnerSeconds、roundedMinutes、listPrice、actualBilled分别看，未知不填零。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/savings/report-metrics.ts:38-49](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/src/core/savings/report-metrics.ts#L38-L49)

无历史时显式unknown而非0

<details>
<summary>查看原文（12行）</summary>

```text
  if (jobs.length === 0) {
    const metrics: AnalysisReport["metrics"] = {
      observedRunnerSeconds: unknownSeconds("no_observed_jobs", unknownReason),
      candidateRemovableSeconds: unknownSeconds("no_observed_jobs", unknownReason),
      modeledRoundedMinutes: unknownCount("no_observed_jobs", unknownReason),
      listPriceUsd: unknownUsd("no_observed_jobs", unknownReason),
      estimatedMarginalUsd: unknownUsd("allowance_unknown", "ACCOUNT_ALLOWANCE_UNKNOWN"),
      actualBilledUsd: unknownUsd("billing_not_queried", "BILLING_NOT_QUERIED"),
      queueSeconds: unknownSeconds("queue_not_observed", unknownReason),
      executionSpanSeconds: unknownSeconds("span_not_observed", unknownReason),
      criticalPathWorkSeconds: unknownSeconds("dag_not_observed", unknownReason),
      estimatedUserWaitReductionSeconds: unknownSeconds("causality_not_observed", unknownReason),
```

</details>

**依据 2 · 源码核查**：[src/core/patch/verify.ts:125-147](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/src/core/patch/verify.ts#L125-L147)

过期/依赖/coverage导致重作成本

<details>
<summary>查看原文（23行）</summary>

```text
  if (digestOf(payload) !== input.plan.planDigest) reasons.push("PLAN_DIGEST_MISMATCH");
  if (input.plan.provenance !== "observed") reasons.push("SYNTHETIC_PLAN");
  if (isExpired(now, isoMillis(payload.expiresAt))) reasons.push("PLAN_EXPIRED");

  const attestationCheck = validAttestations(input);
  reasons.push(...attestationCheck.reasons);
  if (attestationCheck.valid.length > 0) {
    for (const edit of payload.edits) {
      if (!isPatchRule(edit.ruleId)) continue;
      const rule: PatchRule = edit.ruleId;
      if (!attestationCheck.valid.some((attestation) => attestationSatisfiesRule(rule, attestation.claims))) {
        reasons.push("ATTESTATION_CLAIMS_INSUFFICIENT");
        break;
      }
    }
  }

  if (digestOf({ dependencies: payload.dependencies }) !== input.currentDependencyHash) reasons.push("DEPENDENCY_HASH_MISMATCH");
  if (payload.blockers.length > 0) reasons.push("BLOCKERS_PRESENT");
  if (!input.coverageWriteAllowed) reasons.push("COVERAGE_INSUFFICIENT_FOR_WRITE");
  const currentHash = "sha256:" + sha256Hex(input.currentText);
  if (currentHash !== payload.sourceHash) reasons.push("SOURCE_HASH_MISMATCH");
  if (!input.nonceValid) reasons.push("NONCE_INVALID");
```

</details>

**依据 3 · 作者声明**：[README.md:47-62](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/README.md#L47-L62)

成本字段分离

<details>
<summary>查看原文（16行）</summary>

```text

Cost output keeps four separate values and never mixes them:

| Field | Meaning |
| --- | --- |
| `observedRunnerSeconds` | What the run records actually say |
| `modeledRoundedMinutes` | Per-job minutes, rounded up the way billing does |
| `listPriceUsd` | Converted at the snapshot list price |
| `actualBilledUsd` | Always `null` until we can prove otherwise |

Every report embeds the pricing snapshot it used (with a content hash), so a
number can be reproduced later. If the snapshot cannot be verified, the report
is not shipped.

## Install

```

</details>

#### 缺口

- 采纳后账单与人工工时未知
  **影响**：不能给ROI或净节省承诺
  **进一步探讨**：同类CI工作量比较必要检查、人工投入和实际账单

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可从分析覆盖、定价模型和变更审批的限制推导什么可证伪改进？

**研究主题**：新假设与验证

#### 完整回答

未验证假设为补丁后的结果收据：当前已冻结计划输入并区分估计，可以再绑定实际部署版本、工作量和工件消费者健康，让“建议”“采纳”“省钱”分别有证据。最小实验只选可回退单规则，比较前后同类PR的合格CI、等待和账单，任何关键消费者损坏或净成本不降都否定收益；长期采集本身也要计成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/patch/verify.ts:125-147](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/src/core/patch/verify.ts#L125-L147)

现有输入绑定可延伸到结果

<details>
<summary>查看原文（23行）</summary>

```text
  if (digestOf(payload) !== input.plan.planDigest) reasons.push("PLAN_DIGEST_MISMATCH");
  if (input.plan.provenance !== "observed") reasons.push("SYNTHETIC_PLAN");
  if (isExpired(now, isoMillis(payload.expiresAt))) reasons.push("PLAN_EXPIRED");

  const attestationCheck = validAttestations(input);
  reasons.push(...attestationCheck.reasons);
  if (attestationCheck.valid.length > 0) {
    for (const edit of payload.edits) {
      if (!isPatchRule(edit.ruleId)) continue;
      const rule: PatchRule = edit.ruleId;
      if (!attestationCheck.valid.some((attestation) => attestationSatisfiesRule(rule, attestation.claims))) {
        reasons.push("ATTESTATION_CLAIMS_INSUFFICIENT");
        break;
      }
    }
  }

  if (digestOf({ dependencies: payload.dependencies }) !== input.currentDependencyHash) reasons.push("DEPENDENCY_HASH_MISMATCH");
  if (payload.blockers.length > 0) reasons.push("BLOCKERS_PRESENT");
  if (!input.coverageWriteAllowed) reasons.push("COVERAGE_INSUFFICIENT_FOR_WRITE");
  const currentHash = "sha256:" + sha256Hex(input.currentText);
  if (currentHash !== payload.sourceHash) reasons.push("SOURCE_HASH_MISMATCH");
  if (!input.nonceValid) reasons.push("NONCE_INVALID");
```

</details>

**依据 2 · 源码核查**：[src/core/savings/report-metrics.ts:38-49](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/src/core/savings/report-metrics.ts#L38-L49)

实际账单/因果字段仍unknown

<details>
<summary>查看原文（12行）</summary>

```text
  if (jobs.length === 0) {
    const metrics: AnalysisReport["metrics"] = {
      observedRunnerSeconds: unknownSeconds("no_observed_jobs", unknownReason),
      candidateRemovableSeconds: unknownSeconds("no_observed_jobs", unknownReason),
      modeledRoundedMinutes: unknownCount("no_observed_jobs", unknownReason),
      listPriceUsd: unknownUsd("no_observed_jobs", unknownReason),
      estimatedMarginalUsd: unknownUsd("allowance_unknown", "ACCOUNT_ALLOWANCE_UNKNOWN"),
      actualBilledUsd: unknownUsd("billing_not_queried", "BILLING_NOT_QUERIED"),
      queueSeconds: unknownSeconds("queue_not_observed", unknownReason),
      executionSpanSeconds: unknownSeconds("span_not_observed", unknownReason),
      criticalPathWorkSeconds: unknownSeconds("dag_not_observed", unknownReason),
      estimatedUserWaitReductionSeconds: unknownSeconds("causality_not_observed", unknownReason),
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些用户可以受控采用CI费用诊断与补丁，何时应停止？

**研究主题**：采用判断

#### 完整回答

熟悉自家CI语义的维护者可以先只读扫描与历史同步，核coverage、job归属和价目日期后再逐项生成plan。存在发布副作用、工件消费者不清或保护未知时保持解释级输出，不绕过拒写。试用成功是建议可回原证据且无误导成本；真正apply后仍需项目CI验收，出现覆盖回退、必要job漏跑或备份失效就停止并回滚。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/rules/cd001.ts:118-126](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/src/core/rules/cd001.ts#L118-L126)

复杂CI阻断依据

```text
function staticBlockers(context: RuleContext, definition: WorkflowDefinition, run: HistoryRun): string[] {
  const blockers: string[] = [];
  const triggers = [...definition.triggers].sort();
  if (triggers.length !== 1 || triggers[0] !== "pull_request") blockers.push("WORKFLOW_TRIGGERS_NOT_PR_ONLY");
  if (definition.concurrency !== null) blockers.push("EXISTING_CONCURRENCY_POLICY");
  if (definition.jobs.some((job) => job.environment !== null)) blockers.push("ENVIRONMENT_DEPENDENCY");
  if (definition.jobs.some((job) => job.reusableWorkflow !== null)) blockers.push("REUSABLE_WORKFLOW_JOB");
  if (definition.jobs.some((job) => jobLooksRisky(job))) blockers.push("DEPLOY_OR_RELEASE_JOB");
  blockers.push(...protectionBlockers(context, run));
```

**依据 2 · 源码核查**：[src/core/patch/verify.ts:140-147](https://github.com/0disoft/dsh-ci-diet/blob/90dd38518bb9acb0b3013537cf7861e1c1fb0915/src/core/patch/verify.ts#L140-L147)

写前必须当前覆盖和源码一致

```text
  }

  if (digestOf({ dependencies: payload.dependencies }) !== input.currentDependencyHash) reasons.push("DEPENDENCY_HASH_MISMATCH");
  if (payload.blockers.length > 0) reasons.push("BLOCKERS_PRESENT");
  if (!input.coverageWriteAllowed) reasons.push("COVERAGE_INSUFFICIENT_FOR_WRITE");
  const currentHash = "sha256:" + sha256Hex(input.currentText);
  if (currentHash !== payload.sourceHash) reasons.push("SOURCE_HASH_MISMATCH");
  if (!input.nonceValid) reasons.push("NONCE_INVALID");
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
