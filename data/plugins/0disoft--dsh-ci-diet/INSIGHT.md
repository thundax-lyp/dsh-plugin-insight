# CI Diet

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[bfb57ab](https://github.com/0disoft/dsh-ci-diet/tree/bfb57ab7f07333a0a88c50e35f348bb3dac6d290)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0disoft/dsh-ci-diet) [![npm 30d 208](https://img.shields.io/static/v1?label=npm+30d&message=208&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ci-diet) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ci-diet)
<!-- END META -->

> **功能**：发现 GitHub Actions 潜在浪费，保留证据并预览供人工审查的小幅工作流补丁。

> **亮点**：把规则证据、覆盖、局部diff、人工批准和恢复材料串成可追溯流程，减少手工对照工作；不将缓存机制算原创。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：规则命中、缓存或取消不保证净节省，可能转移到缓存开销、重跑或交付损失；预检不是强制优化门禁。见 [Q03](#research-q03)。

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
  - [Q01 · 相对人工优化工作流新增什么？](#detail-section-11)
  - [Q02 · 预检与写入如何分离？](#detail-section-12)
  - [Q03 · 成本降低为何仍不确定？](#detail-section-13)
  - [Q04 · 启动、数据与总成本是什么？](#detail-section-14)
  - [Q05 · 如何验证节省归因？](#detail-section-15)
  - [Q06 · 当前谁值得试用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：工作流维护者审核一项资源优化，以质量不退化且实际资源改善为合格交付。

人工查Actions历史并手工改YAML是直接替代；比较应控制测试、变更类型和缓存冷热，不能只数命中规则。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 扫描/同步/报告 | 形成候选与证据 | 历史需gh，覆盖可能不完整 |
| 计划预览 | 提供局部工作流diff | 受限形态，工具不直接批准应用 |
| 预检提醒 | 部署前发现候选 | 复杂shell跳过，异常放行 |
| 审阅与受控应用 | 人工批准、备份、回退 | 当前宿主与净节省未验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 声明Node版本与DSH0.2.x | 对应入口必需 | CLI或宿主注册 | 不在兼容范围不假定可用 |
| gh认证与Actions读权限 | 历史同步必需 | 收集run/job | 保留离线静态报告 |
| 同一state目录与可写工作区 | 批准/应用必需 | 共享plan及备份 | 不一致需重新定位或规划 |
| 人工审阅与质量对照 | 采纳必需 | 判断取消/缓存语义 | 无证据不应用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 维护者离线扫描、按需同步历史 | 明确证据覆盖与候选 |
| 2 | 维护者审核单plan并独立批准 | 摘要、文件与依赖一致 |
| 3 | 维护者应用后检验质量和净资源 | 无改善或退化即回退 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地运行、历史API及试验CI资源未知 | 配置state/权限、审查规则，耗时未知 | 静态可离线 |
| 持续使用 | runner、缓存、artifact及存储 | 审阅与收益/质量跟踪 | 不能按候选估算当实际账单 |
| 失败恢复 | 备份、重跑及回退资源未知 | 核对journal、当前hash和业务影响 | 恢复未运行验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 候选发现 | 静态规则与历史覆盖结构存在 | 真正可省资源范围 |
| 受控改动 | 摘要、nonce、备份与校验存在 | 当前宿主全流程可靠性 |
| 节省 | 估算与实际账单明确区分 | 净分钟、实际金额和质量影响 |

> **思考**：规则命中、缓存或取消不保证净节省，可能转移到缓存开销、重跑或交付损失；预检不是强制优化门禁。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把规则证据、覆盖、局部diff、人工批准和恢复材料串成可追溯流程，减少手工对照工作；不将缓存机制算原创。见 [Q01](#research-q01)、[Q02](#research-q02)。

写前证据/依赖hash绑定、nonce与备份回读值得复用；文件替换前重读减少并发覆盖。预检故障放行是可用性取舍，适合作提示，不适合当发布安全保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

规则命中、缓存或取消不保证净节省，可能转移到缓存开销、重跑或交付损失；预检不是强制优化门禁。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有限试用，离线scan后只审查一个受支持工作流；净收益或质量不达标即回退。见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持候选到受控补丁的工程链；净节省、当前宿主和浏览器验收未验证；质量约束采纳是假设。

- 已检查：作者 README、包清单、源码路径 src/dsh/host/preflight.ts、src/core/patch/approval.ts、src/core/patch/verify.ts、src/core/patch/apply.ts、src/dsh/host/plugin.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定源码抽查 preflight、approval、verify、apply 与作者说明，不运行CLI/插件、gh同步、目标测试或改写工作流。
- 下一步：单工作流交错冷/热缓存并核对hash，记录净运行、失败重跑、实际账单与人工成本，再执行回退验收。

**分析版本**

- **仓库**：[0disoft/dsh-ci-diet](https://github.com/0disoft/dsh-ci-diet)
- **版本号**：0.5.1（[固定提交 bfb57ab](https://github.com/0disoft/dsh-ci-diet/tree/bfb57ab7f07333a0a88c50e35f348bb3dac6d290)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的质量约束采纳门槛，以交错冷/热缓存和同任务对照检验净资源收益，若退化就回退。见 [Q05](#research-q05)。

单工作流交错冷/热缓存并核对hash，记录净运行、失败重跑、实际账单与人工成本，再执行回退验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 2683 | — | — | 31875 |
| .md | test | 6 | 1490 | — | — | 14199 |
| .md | example | 1 | 28 | — | — | 238 |
| .mjs | source | 12 | 1733 | 1524 | 85 | — |
| .ts | source | 100 | 19717 | 17458 | 1146 | — |
| .ts | test | 53 | 14171 | 13183 | 136 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/0disoft/dsh-ci-diet/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：CI Diet 能否将 GitHub Actions 浪费候选转成可审查、可回退且可验证收益的小改动？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对人工优化工作流新增什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向有 GitHub Actions 工作流、愿意审核 YAML 变化的维护者。合格交付是保持构建质量的同时减少实际资源浪费，不能以规则命中或生成 diff 算节省。作者明确安装本身不节省；静态规则覆盖并发取消、缓存、保留期等不同成本轴。相对人工查 runs 后手改 YAML，插件将候选证据、覆盖范围、局部补丁、人工批准和回退串成一个可追溯流程。其贡献是证据到改动的工程约束组合，缓存或 concurrency 不是插件原创。作用于保留期的规则不应宣传为减少 runner minutes。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-17](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/README.md#L9-L17)

明确安装与预检不自动节省或改文件

```text
CI Diet finds GitHub Actions work that is likely wasted, preserves the evidence behind each finding, and previews small workflow edits for a human to review.

**Installation alone does not save runner minutes.** Supported DSH deploy commands are checked automatically for savings candidates before running; workflow changes are applied only after review and approval. The DSH plugin has no approval, apply, or revert tools, and preflight itself never changes files. Its Settings pages store tool configuration and show the host's session-scoped reports and plans; they do not optimize a workflow. Approved local writes are enabled by default, but applying still requires a separate digest approval. There is no guarantee that any finding will reduce cost.

`preflightEnabled` is on by default. Before a literal `git push`, `npm|pnpm|bun publish`, `wrangler deploy`, or `npm|pnpm|bun run deploy` in a supported stateless DSH bash tool (one with a `workdir` argument), CI Diet runs an offline check. It flags npm/pnpm CD006 candidates, a missing concurrency block in a PR-only workflow, and a Bun frozen install without an explicit download cache for review. When a candidate exists, the first command does not run; after the model reviews the items, retrying the same command is allowed. Preflight itself makes no network request and no automatic file change, and applying a plan still needs human approval. Persistent shells and complex shell wrappers cannot be identified reliably, so preflight skips them. Savings remain unmeasured, so no saving is claimed.

## What it does

The static scan reads workflow YAML in a target checkout. The optional history sync uses read-only `gh api` calls to collect recent runs. Findings carry an evidence level (`observed`, `inferred`, or `static`) and per-axis collection coverage.
```

**依据 2 · 作者声明**：[README.md:19-33](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/README.md#L19-L33)

规则和不同成本轴边界

<details>
<summary>查看原文（15行）</summary>

```text
| Rule | Finds | Possible plan |
| --- | --- | --- |
| CD001 | PR runs made obsolete by a newer commit | `concurrency` edit |
| CD002 | Overlapping triggers | explanation only |
| CD003 | Heavy checks for docs-only changes | explanation only; off by default |
| CD004 | Oversized matrices | explanation only |
| CD005 | Jobs without `timeout-minutes` | timeout edit; off by default |
| CD006 | npm / pnpm / Bun | [CD006](docs/spec/rules.md) |
| CD008 | Long artifact retention | retention edit |

CD001 helps overlapping superseded PR runs. CD005 caps abnormal runs; it does not reduce normal job runtime. CD008 changes artifact storage retention, not runner minutes. CD003 and CD005 remain off until their quality gates pass.

CD006 also supports verified npm/pnpm setups and Bun jobs using `oven-sh/setup-bun@v2` followed by `bun install --frozen-lockfile` with a tracked text `bun.lock`. Bun adds a download-cache step; installation and tests still run. Cache restore/save overhead can outweigh the benefit. See the [current cache guards](docs/spec/rules.md#bun-dependency-cache-variant) and [a measured example](docs/measurements/2026-10-25-cache-review.md). The npm example below demonstrates one supported shape.

## Install and upgrade
```

</details>

#### 缺口

- 没有本研究同条件优化前后质量和账单数据
  **影响**：不支持节省金额或ROI结论
  **进一步探讨**：固定同一任务/工作流版本收集运行时间、重跑、失败与实际账单

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 预检与写入如何分离？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

preflight 只解析受支持的字面部署命令，对无状态 bash/workdir 契约才拦截；同会话与源码指纹首次发现候选返回 deny，重试允许，异常则放行。它是一次提醒而非强制质量门禁，也不修改文件。写入路径另要求 plan 摘要确认、nonce、未过期、当前源码和依赖 hash、覆盖足够及规则声明匹配。apply 在写前保存并回读备份，再写 PREPARED journal，重读源码防止备份期间并发修改。可借鉴处是“摘要绑定审阅对象+一次授权+回读备份+恢复日志”，移植仍要核验路径与文件系统语义，不能从几段源码宣称无竞态。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh/host/preflight.ts:114-149](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/src/dsh/host/preflight.ts#L114-L149)

受支持bash、一次提醒及异常放行

<details>
<summary>查看原文（36行）</summary>

```text
/** A once-per-session/source reminder, never an automatic patch or network request. */
export function registerPreflight(ctx: Context, settings: () => PreflightSettings, notice: () => string): void {
  const seen = new WeakMap<object, Map<string, string>>();
  ctx.on("tools/pre-execute", async (exec: ToolExecution, next: () => Promise<PreToolDecision>) => {
    const decision = await next();
    if (decision.kind !== "allow" || exec.name !== "bash" || exec.agent === undefined || exec.signal.aborted) return decision;
    const args = exec.arguments as { command?: unknown; workdir?: unknown } | null;
    if (typeof args?.command !== "string") return decision;
    // Only the stateless bash contract is supported. Persistent bash may have
    // changed its own cwd, which the session directory cannot establish.
    const definition = ctx.tools.get("bash", exec.agent);
    const parameters = definition?.parameters as { properties?: Record<string, unknown> } | undefined;
    if (parameters?.properties?.workdir === undefined) return decision;
    try {
      const config = settings();
      if (!config.enabled) return decision;
      const service = ctx.get("workingDirectory") as { get(session: unknown): string } | undefined;
      const base = service?.get(exec.agent.session);
      const cwd = typeof args.workdir === "string" && isAbsolute(args.workdir) ? args.workdir
        : base === undefined ? null : resolve(base, typeof args.workdir === "string" ? args.workdir : ".");
      if (cwd === null) return decision;
      const notices = [];
      const previous = new Map(seen.get(exec.agent));
      for (const directory of deploymentDirectories(args.command, cwd)) {
        const report = inspectPreflight(directory, config);
        if (report.opportunities.length === 0 || previous.get(report.root) === report.fingerprint) continue;
        if (previous.size >= 64) previous.delete(previous.keys().next().value!);
        previous.set(report.root, report.fingerprint);
        notices.push({ cwd: report.root, opportunities: report.opportunities.slice(0, 8), total: report.opportunities.length });
      }
      if (exec.signal.aborted || notices.length === 0) return decision;
      seen.set(exec.agent, previous);
      return { kind: "deny", reason: notice() + "\n" + JSON.stringify(notices) };
    } catch {
      // Advisory inspection must never lock users out of deploying.
      return decision;
```

</details>

**依据 2 · 源码核查**：[src/core/patch/approval.ts:48-80](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/src/core/patch/approval.ts#L48-L80)

摘要确认及nonce绑定

<details>
<summary>查看原文（33行）</summary>

```text
function approveLocked(input: ApproveInput): ApproveResult {
  const stored = input.store.readPlan(input.planId);
  if (stored === null) throw new Error("PLAN_NOT_FOUND: " + input.planId);
  const plan = stored.plan;
  const previous = input.store.readNonce(plan.planId);
  if (input.store.listChanges().some((change) => change.planId === plan.planId && change.state !== "NOT_APPLIED")) {
    throw new Error("PLAN_ALREADY_USED: " + input.planId);
  }
  if (plan.status.state === "approved") {
    if (previous === null || previous.nonceId !== plan.status.approvalNonceId || previous.planDigest !== plan.planDigest) {
      throw new Error("NONCE_INVALID: approval record missing or mismatched");
    }
    const until = Date.parse(previous.createdAt) + (input.approvalTtlSeconds ?? DEFAULT_APPROVAL_TTL_SECONDS) * 1000;
    if (!Number.isFinite(until) || input.now.getTime() < until) throw new Error("PLAN_ALREADY_APPROVED: " + input.planId);
  }
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
```

</details>

**依据 3 · 源码核查**：[src/core/patch/verify.ts:120-154](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/src/core/patch/verify.ts#L120-L154)

写前源码、依赖、nonce与覆盖校验

<details>
<summary>查看原文（35行）</summary>

```text
export function checkApply(input: ApplyCheckInput): ApplyReasonCode[] {
  const reasons: ApplyReasonCode[] = [];
  const now = input.now.getTime();
  const payload = input.plan.payload;

  if (digestOf(payload) !== input.plan.planDigest) reasons.push("PLAN_DIGEST_MISMATCH");
  // A matching digest proves unchanged bytes, not that the rule summary names
  // the actual edits. Policy selection and allowedRules must not trust a
  // different rule set, including in previously saved/externally built plans.
  const editedRules = new Set(payload.edits.map((edit) => edit.ruleId));
  const declaredRules = new Set(payload.ruleIds);
  if (editedRules.size !== declaredRules.size || declaredRules.size !== payload.ruleIds.length
    || payload.ruleIds.some((rule) => !editedRules.has(rule))) reasons.push("RULE_NOT_ALLOWED");
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

**依据 4 · 源码核查**：[src/core/patch/apply.ts:577-610](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/src/core/patch/apply.ts#L577-L610)

备份回读、journal与并发重读

<details>
<summary>查看原文（34行）</summary>

```text
  // Past this point a replace is committed: do not abort between the journal
  // entry and the rename, because the user asked for a recoverable transaction.
  throwIfAborted(options.signal);
  const changeId = options.store.changeIdFor(plan.planId, options.now);
  const manifest = options.store.writeBackup(changeId, inspection.beforeText, inspection.text, plan.payload.workflowPath, options.now);
  if (manifest.beforeHash !== textHash(inspection.beforeText) || manifest.afterHash !== inspection.hash) {
    discardBackup(options.store, changeId);
    return { state: "not_applied", reasons: ["BACKUP_UNAVAILABLE"], change: null, resultText: null };
  }
  const backup = options.store.readBackup(changeId);
  // Verify the stored bytes, not only hashes copied into the manifest. A bad
  // backup must be rejected while the original workflow is still untouched.
  if (backup === null || backup.manifest.beforeHash !== inspection.beforeHash
    || backup.manifest.afterHash !== inspection.hash
    || textHash(backup.beforeText) !== inspection.beforeHash
    || textHash(backup.afterText) !== inspection.hash) {
    discardBackup(options.store, changeId);
    return { state: "not_applied", reasons: ["BACKUP_UNAVAILABLE"], change: null, resultText: null };
  }

  const reference = plan.status.approvalNonceId ?? "";
  const prepared = changeRecord(plan, changeId, "PREPARED", binding, inspection.beforeText, inspection.text, reference, inspection.approvalChannel, options.now);
  try {
    options.store.saveChange(prepared);
  } catch (error) {
    // No journal record exists, so the file was never touched and nothing can
    // reference the backup.
    discardBackup(options.store, changeId);
    throw error;
  }

  // The bytes may have changed while the backup was written. Read again and
  // refuse rather than overwrite a concurrent user edit.
  const recheck = readFileSync(target, "utf8");
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 成本降低为何仍不确定？

**研究主题**：缺陷与关键质疑

#### 完整回答

最强质疑是减少某类工作并不自动提高单位合格交付效率。缓存可能增加 restore/save 成本，并发取消可能中断仍有业务价值的工作，缩短 artifact 保留可能影响消费者。静态形态受限是安全取舍，不支持的 SHA pin、动态目录、混合安装或复杂 shell 不能当已优化。actualBilledUsd 明确保持 null，价目表模型不是实际账单。默认 network/local apply 的允许开关也不等于已经调用网络或授权写入；但生产配置应确认是否符合维护者意图。作者报告早期浏览器 E2E 与单独迁移验证不能转作当前版本新验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-33](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/README.md#L27-L33)

缓存开销可能反超收益

```text
| CD008 | Long artifact retention | retention edit |

CD001 helps overlapping superseded PR runs. CD005 caps abnormal runs; it does not reduce normal job runtime. CD008 changes artifact storage retention, not runner minutes. CD003 and CD005 remain off until their quality gates pass.

CD006 also supports verified npm/pnpm setups and Bun jobs using `oven-sh/setup-bun@v2` followed by `bun install --frozen-lockfile` with a tracked text `bun.lock`. Bun adds a download-cache step; installation and tests still run. Cache restore/save overhead can outweigh the benefit. See the [current cache guards](docs/spec/rules.md#bun-dependency-cache-variant) and [a measured example](docs/measurements/2026-10-25-cache-review.md). The npm example below demonstrates one supported shape.

## Install and upgrade
```

**依据 2 · 作者声明**：[README.md:89-99](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/README.md#L89-L99)

CD006 支持形态与保守边界

<details>
<summary>查看原文（11行）</summary>

````text
`--step` is the zero-based index of the setup-node step; this example assumes checkout is step 0 and setup-node is step 1. CLI `plan` performs this static scan in memory and saves the plan without a prior `sync`; it leaves the latest saved report untouched. The plugin `ci_diet_plan` still needs a saved report, so run `ci_diet_scan` first. Approve and apply through the existing commands below. The plan and its attestation are saved during planning; no workflow file changes until a person approves the plan and runs apply.

## CLI command reference

```
ci-diet scan --cwd .
ci-diet sync --cwd . --network
ci-diet sync --cwd . --network --repo OWNER/REPO --days 7
ci-diet report --cwd .
ci-diet report --cwd . --format json
ci-diet report --cwd . --format html --out report.html
````

</details>

**依据 3 · 作者声明**：[README.md:125-143](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/README.md#L125-L143)

状态、早期测试和估算口径

<details>
<summary>查看原文（19行）</summary>

```text
## State and limitations

The CLI and plugin share the default state directory: `%LOCALAPPDATA%\CI-Diet\profiles\default` on Windows, otherwise `~/.local/state/ci-diet/profiles/default`. A plugin `stateDir` override is a separate store; pass the same absolute path to the CLI with `--state-dir` on `plan`, `approve`, `apply`, and `revert`. Relative CLI `--state-dir` paths resolve against the effective `--cwd`. Existing state is never migrated automatically between directories.

The Web client has Settings and the **CI Diet Reports** review screen. Report, approve, apply, and revert controls passed a real-browser E2E check in an earlier commit. The defaults migration was verified separately in a DSH `0.2.1-rc.2` runtime with configEditor, SettingsForms, and Loader in a temporary profile: legacy `false` values were saved as `true`, and a later explicit `false` survived restart. That runtime check was not a new browser render. Approval and apply reach the host from that screen, and `localApplyEnabled` is on by default. No plugin tool performs approval or application. A plan edits one existing workflow file at byte ranges and refuses unsupported structures. Findings can be wrong or incomplete when history or workflow attribution is partial, and another system may have more accurate billing data. Use the report as review evidence, then verify the effect in GitHub.

## Cost and evidence

| Field | Meaning |
| --- | --- |
| `observedRunnerSeconds` | Runner time recorded by collected runs |
| `modeledRoundedMinutes` | Per-job minutes rounded up for modeling |
| `listPriceUsd` | Cost at the embedded list-price snapshot |
| `actualBilledUsd` | Always `null` until the actual bill can be proven |

Reports embed the pricing snapshot and a content hash so numbers can be reproduced. They do not claim automatic savings. The HTML report has inline CSS, no scripts, and no external requests.

## Languages

```

</details>

**依据 4 · 源码核查**：[src/dsh/host/preflight.ts:12-35](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/src/dsh/host/preflight.ts#L12-L35)

复杂shell直接不解析

<details>
<summary>查看原文（24行）</summary>

```text
/** Only literal commands; substitutions, heredocs, pipelines and script wrappers stay untouched. */
function commands(source: string): string[][] | null {
  if (source.length > 16_384) return null;
  const out: string[][] = [];
  let words: string[] = [], word = "", quote = "";
  const flushWord = () => { if (word !== "") { words.push(word); word = ""; } };
  const flush = () => { flushWord(); if (words.length > 0) out.push(words); words = []; };
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i]!;
    if (quote !== "") {
      if (ch === quote) { quote = ""; continue; }
      if ((quote === '"' && /[$`\\]/.test(ch)) || ch === "\n") return null;
      word += ch; continue;
    }
    if (ch === "'" || ch === '"') { quote = ch; continue; }
    if (ch === "#" && word === "") { while (i < source.length && source[i] !== "\n") i += 1; flush(); continue; }
    if (/[$`\\<>|(){}]/.test(ch)) return null;
    if (ch === "&") { if (source[++i] !== "&") return null; flush(); continue; }
    if (ch === ";" || ch === "\n") { if (words[0] === "cd") return null; flush(); continue; }
    if (/\s/.test(ch)) { flushWord(); continue; }
    word += ch;
  }
  if (quote !== "") return null;
  flush(); return out;
```

</details>

#### 缺口

- 当前版本浏览器流程、质量退化和实际净节省未测
  **影响**：只能推荐审查试点，不能自动批量优化
  **进一步探讨**：单工作流做可回退实验，同时测失败/重跑/缓存开销

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、数据与总成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

CLI 需声明 Node 版本，DSH 插件限定0.2.x范围；历史同步额外依赖已认证且有读 runs/jobs 权限的 gh。静态扫描可离线，sync 才取历史；扫描、规划、批准、应用是不同阶段。用户首次需要确认工作区、状态目录及权限，持续审核候选、维护历史覆盖和质量门槛，失败时检查 journal/backup 与当前 hash 后回退；状态目录不同会造成 CLI 和插件看不到同一 plan。现金/工时无实测，不能用“本地工具”替代计算总负担。受支持范围小可能降低自动覆盖率，但也避免不确定 YAML 改写。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:39-42](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/package.json#L39-L42)

Node与DSH兼容声明

```text
  ],
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.1-rc.2 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0"
```

**依据 2 · 作者声明**：[README.md:61-77](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/README.md#L61-L77)

扫描、网络同步与state差异

<details>
<summary>查看原文（17行）</summary>

````text

```
ci-diet scan --cwd .
gh auth status
ci-diet sync --cwd . --network
ci-diet report --cwd .
ci-diet report --cwd . --format html --out report.html
```

`scan` prints a static report without network access; `--json` or `--out FILE` writes that output, but CLI scan does not save a report in the state store. `report` needs a saved report from CLI `sync`, plugin `ci_diet_scan`, or plugin `ci_diet_sync`. In this CLI-only sequence, sync stores the report; the HTML option then writes one self-contained file. History sync needs `gh` installed, authenticated, and able to read the repository’s Actions runs and jobs. `sync --network` is the CLI opt-in. It never needs GitHub write permission. A partial history still produces and stores a report, marking incomplete coverage. The plugin’s offline `ci_diet_scan` does save its report, so `ci_diet_report` can follow it directly.

For the DSH plugin, network access is enabled by default, so `ci_diet_sync` can run once `gh` is installed and authenticated. The switch only permits that tool to call `gh`; installation, startup, and Settings saves do not collect history by themselves. To block plugin network use, turn off **Allow network access** in **Settings → CI Diet** and choose **Save changes**. The page setting applies to plugin tools; it does not enable the CLI’s `--network` flag. Static scan and report work without network. The Settings page does not run an optimization by itself.

A useful chat request makes the sequence and review boundary explicit. Replace the example absolute path with your own repository:

> Run `ci_diet_scan` with cwd `C:\work\my-repo`, then `ci_diet_sync` for that same cwd and `ci_diet_report`. If `gh` is not authenticated or I turn off network access, stop after the scan. If you preview a patch with `ci_diet_plan`, show the edits only. Do not approve, apply, revert, commit, push, or deploy anything.

````

</details>

**依据 3 · 作者声明**：[README.md:125-127](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/README.md#L125-L127)

CLI/plugin state目录需对齐

```text
## State and limitations

The CLI and plugin share the default state directory: `%LOCALAPPDATA%\CI-Diet\profiles\default` on Windows, otherwise `~/.local/state/ci-diet/profiles/default`. A plugin `stateDir` override is a separate store; pass the same absolute path to the CLI with `--state-dir` on `plan`, `approve`, `apply`, and `revert`. Relative CLI `--state-dir` paths resolve against the effective `--cwd`. Existing state is never migrated automatically between directories.
```

**依据 4 · 源码核查**：[src/core/patch/apply.ts:577-610](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/src/core/patch/apply.ts#L577-L610)

失败恢复材料成本

<details>
<summary>查看原文（34行）</summary>

```text
  // Past this point a replace is committed: do not abort between the journal
  // entry and the rename, because the user asked for a recoverable transaction.
  throwIfAborted(options.signal);
  const changeId = options.store.changeIdFor(plan.planId, options.now);
  const manifest = options.store.writeBackup(changeId, inspection.beforeText, inspection.text, plan.payload.workflowPath, options.now);
  if (manifest.beforeHash !== textHash(inspection.beforeText) || manifest.afterHash !== inspection.hash) {
    discardBackup(options.store, changeId);
    return { state: "not_applied", reasons: ["BACKUP_UNAVAILABLE"], change: null, resultText: null };
  }
  const backup = options.store.readBackup(changeId);
  // Verify the stored bytes, not only hashes copied into the manifest. A bad
  // backup must be rejected while the original workflow is still untouched.
  if (backup === null || backup.manifest.beforeHash !== inspection.beforeHash
    || backup.manifest.afterHash !== inspection.hash
    || textHash(backup.beforeText) !== inspection.beforeHash
    || textHash(backup.afterText) !== inspection.hash) {
    discardBackup(options.store, changeId);
    return { state: "not_applied", reasons: ["BACKUP_UNAVAILABLE"], change: null, resultText: null };
  }

  const reference = plan.status.approvalNonceId ?? "";
  const prepared = changeRecord(plan, changeId, "PREPARED", binding, inspection.beforeText, inspection.text, reference, inspection.approvalChannel, options.now);
  try {
    options.store.saveChange(prepared);
  } catch (error) {
    // No journal record exists, so the file was never touched and nothing can
    // reference the backup.
    discardBackup(options.store, changeId);
    throw error;
  }

  // The bytes may have changed while the backup was written. Read again and
  // refuse rather than overwrite a concurrent user edit.
  const recheck = readFileSync(target, "utf8");
```

</details>

#### 缺口

- 历史覆盖、真实账单与维护工时未知
  **影响**：无法计算单位合格优化成本
  **进一步探讨**：以一项批准改动记录审阅、应用、验证和回退全部投入

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证节省归因？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是将优化采纳条件绑定为“净runner/cache资源改善且成功/重跑不退化”，会比只看候选节省分钟更少误采纳。来自 Q03 中缓存额外开销与质量风险，现有 hash/plan 能提供归因锚点。最小实验选同一仓库一条符合CD006的工作流，交错冷/热缓存与相似变更工作负载，对照修改前后各10次；记录有效运行时间、restore/save开销、失败重跑和人工维护。若净时间未下降、失败增多或清理成本超收益，则撤销该改动并否定这类任务的收益。需保持测试步骤和依赖锁文件不变，不能用跳过测试制造节省。该采纳门槛方案未在本轮运行。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/patch/verify.ts:149-154](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/src/core/patch/verify.ts#L149-L154)

hash约束可绑定归因对象

```text
  if (digestOf({ dependencies: payload.dependencies }) !== input.currentDependencyHash) reasons.push("DEPENDENCY_HASH_MISMATCH");
  if (payload.blockers.length > 0) reasons.push("BLOCKERS_PRESENT");
  if (!input.coverageWriteAllowed) reasons.push("COVERAGE_INSUFFICIENT_FOR_WRITE");
  const currentHash = "sha256:" + sha256Hex(input.currentText);
  if (currentHash !== payload.sourceHash) reasons.push("SOURCE_HASH_MISMATCH");
  if (!input.nonceValid) reasons.push("NONCE_INVALID");
```

**依据 2 · 作者声明**：[README.md:31-33](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/README.md#L31-L33)

缓存保留install/test且存在开销风险

```text
CD006 also supports verified npm/pnpm setups and Bun jobs using `oven-sh/setup-bun@v2` followed by `bun install --frozen-lockfile` with a tracked text `bun.lock`. Bun adds a download-cache step; installation and tests still run. Cache restore/save overhead can outweigh the benefit. See the [current cache guards](docs/spec/rules.md#bun-dependency-cache-variant) and [a measured example](docs/measurements/2026-10-25-cache-review.md). The npm example below demonstrates one supported shape.

## Install and upgrade
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前谁值得试用？

**研究主题**：采用判断

#### 完整回答

建议有限试用，有明确重复CI负担、工作流符合受支持形态且愿意人工审阅者可从离线 scan 开始。先确认候选含义和覆盖，再生成单个可回退 plan，人工批准后由维护者验证；本研究不执行这些动作。需要“安装即自动省钱”的团队不适合。停止标准包括质量下降、净资源不改善、历史归因不完整或当前文件与批准摘要不符。当前源码支持小范围审查路径，但没有同版本宿主与效果验收，不给持续安装结论。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:113-123](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/README.md#L113-L123)

plan/approve/apply/revert需独立人工审阅

<details>
<summary>查看原文（11行）</summary>

````text
```
ci-diet plan --cwd . --rule CD001 --workflow .github/workflows/ci.yml --claims ci-only,replace-safe
ci-diet plans --cwd . --plan PLAN_ID
ci-diet approve --cwd . --plan PLAN_ID --confirm CONFIRMATION
ci-diet apply --cwd . --plan PLAN_ID
ci-diet revert --cwd . --change CHANGE_ID
```

Replace `PLAN_ID` with the id printed by the plan, `CONFIRMATION` with its 12-character digest tail, and `CHANGE_ID` with the id printed by apply. Every value is a literal argument; do not type angle brackets. `approve` creates a single-use approval, `apply` rewrites only the planned byte range in one workflow file, and `revert` restores that change’s backup. Review the resulting diff and run the repository’s checks as needed. CI Diet does not commit, push, deploy, run workflows, change branch protection, or delete artifacts.

For eligible PR-only CI, the CD001 example uses `ci-only` and `replace-safe` as human attestations. They state the operator’s review of cancellation semantics; they are not bypass switches. CD005 needs a measured `--job` and `--minutes`, and CD008 needs `--job`, a zero-based numeric `--step` array index for the target step, and artifact claims. CD006 needs `--job` and the zero-based `--step` index of the setup-node/setup-bun step; it has no claims. In both step rules, the numeric step is an array index, not a step-name token.
````

</details>

**依据 2 · 源码核查**：[src/core/patch/verify.ts:149-154](https://github.com/0disoft/dsh-ci-diet/blob/bfb57ab7f07333a0a88c50e35f348bb3dac6d290/src/core/patch/verify.ts#L149-L154)

证据或文件漂移拒绝应用

```text
  if (digestOf({ dependencies: payload.dependencies }) !== input.currentDependencyHash) reasons.push("DEPENDENCY_HASH_MISMATCH");
  if (payload.blockers.length > 0) reasons.push("BLOCKERS_PRESENT");
  if (!input.coverageWriteAllowed) reasons.push("COVERAGE_INSUFFICIENT_FOR_WRITE");
  const currentHash = "sha256:" + sha256Hex(input.currentText);
  if (currentHash !== payload.sourceHash) reasons.push("SOURCE_HASH_MISMATCH");
  if (!input.nonceValid) reasons.push("NONCE_INVALID");
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
