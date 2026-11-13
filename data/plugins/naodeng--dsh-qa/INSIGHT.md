# dsh-qa

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c534fcd](https://github.com/naodeng/dsh-qa/tree/c534fcd6c619decadcf3e17861328d7ccb881818)

<!-- BEGIN META -->
[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/naodeng/dsh-qa) [![npm 30d 2,032](https://img.shields.io/static/v1?label=npm+30d&message=2%2C032&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-qa) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-qa)
<!-- END META -->

> **功能**：在 DeepSeek Harness 管理本地 QA 项目、受控测试、执行证据和交付门禁。

> **亮点**：[Q01](#research-q01) 的工作台把受控执行、证据保全和可解释门禁放到本机工作流。

> **主要限制**：[Q02](#research-q02) 发现任务门禁取项目最后一条运行，任务来源相同仍不足以证明证据属于所选任务。

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
  - [Q01 · QA 工作台如何将执行来源、证据和门禁组织到同一工作流？](#detail-section-11)
  - [Q02 · 门禁是否总在用户选中的质量任务上选取运行？](#detail-section-12)
  - [Q03 · 怎样使用本地工作台而保留交付负责人复核，如何验证任务绑定改进？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人 QA 或测试负责人可以在 DSH 项目旁管理需求、测试执行与交付证据。

用现有测试工具和手工表格组织结果，负责人独立核对日志与发布条件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 质量工作台 | 管理项目、执行证据和门禁 | 本机流程，受控 adapter 才真实执行 |
| QA 预设 | 辅助按阶段组织质量工作 | 负责人需独立审核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 服务与本机工作台 | 是 | 显示项目和门禁 | 继续原本工具 |
| 受控 Host adapter | 真实执行需要 | 运行任务并产生结果 | 记录 not_run |
| 项目来源与证据归档 | 门禁需要 | 校验当前版本 | 人工核对后再交付 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | QA 建立两个隔离合成任务 | 来源和用例均可定位 |
| 观察 | 执行并检查归档、门禁 | 与原始任务、报告相符 |
| 退出 | 保留源日志，继续既有审批 | 与工作台状态独立验证 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地环境与存储，费用未知 | 准备 adapter 及样本 | 宿主兼容待验 |
| 持续 | 测试运行和证据存储，费用未知 | 核对任务归属及报告 | 合格交付工时未知 |
| 失败恢复 | 重新运行与归档开销未知 | 核对原日志并补证 | 实际重试成本未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 本机证据组织 | 受控执行、归档和门禁路径 | 真实测试覆盖 |
| 交付决策 | 明确通过、警告和阻塞规则 | 跨任务归属和发布效果 |

> **思考**：[Q02](#research-q02) 发现任务门禁取项目最后一条运行，任务来源相同仍不足以证明证据属于所选任务。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的工作台把受控执行、证据保全和可解释门禁放到本机工作流。

[Q01](#research-q01) 的未运行和证据待补状态可区分失败；[Q02](#research-q02) 的来源比较需同时绑定任务身份。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 发现任务门禁取项目最后一条运行，任务来源相同仍不足以证明证据属于所选任务。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先在隔离本机观察两个合成任务，按 [Q02](#research-q02) 对照运行归属。真实交付继续由负责人核查原始执行证据。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码核实本机工作台、执行接线及门禁规则，真实 adapter 和发布价值待验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、server/quality/harness-execution.js、server/quality/http-routes.js、server/quality/gate.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对固定宿主工作台、受控 Host 执行和任务门禁关键路径；未运行测试、服务器或真实 adapter。
- 下一步：隔离复核双任务同源、异源及不同完成顺序，覆盖 not_run、证据待补和禁用后的本地数据。

**分析版本**

- **仓库**：[naodeng/dsh-qa](https://github.com/naodeng/dsh-qa)
- **版本号**：0.7.5（[固定提交 c534fcd](https://github.com/naodeng/dsh-qa/tree/c534fcd6c619decadcf3e17861328d7ccb881818)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提出贯通运行、证据和门禁的任务身份，并用交错运行验证归属。

隔离复核双任务同源、异源及不同完成顺序，覆盖 not_run、证据待补和禁用后的本地数据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 65 | 9840 | — | — | 107538 |
| .js | source | 45 | 10526 | 9815 | 155 | — |
| .js | test | 64 | 9013 | 7952 | 202 | — |
| .md | example | 8 | 32 | — | — | 80 |
| .mjs | example | 3 | 6 | 6 | 0 | — |
| .md | test | 1 | 56 | — | — | 424 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-13），可前往 [GitHub Issues](https://github.com/naodeng/dsh-qa/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：个人 QA 怎样在 DSH 组织受控测试和交付证据，什么情况下计算门禁可能关联到错误的质量任务？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · QA 工作台如何将执行来源、证据和门禁组织到同一工作流？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

QA 可在会话旁维护质量任务、测试计划、执行证据和门禁。插件通过宿主 Web 路由反代本机工作台，启动时注入受控 adapter；缺失时执行器记录 not_run/provider_unavailable。真实 adapter 接收受控参数、执行 ID、取消信号与写证据接口；通过的 Host 运行还需完成证据归档。门禁计算对照输入来源、结果信任、证据摘要和风险，失败规则可解释。与人工把测试日志粘到表格相比，机制增量是对证据来源、执行和门禁建立可查联系。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-33](https://github.com/naodeng/dsh-qa/blob/c534fcd6c619decadcf3e17861328d7ccb881818/README.md#L14-L33)

作者定义本机 QA 使用场景。

<details>
<summary>查看原文（20行）</summary>

```text
**dsh-qa 是运行在 DeepSeek Harness（DSH）中的本地 QA 工作台，面向在个人工作环境中管理质量流程的 QA 和测试负责人。**它把测试项目、需求、用例、执行、证据与交付门禁放在一个工作区，并复用 DSH 原生会话、模型、技能和命令。

## 目录

- [定位与职责边界](#定位与职责边界)
- [工作流与主要能力](#工作流与主要能力)
- [安装与首次使用](#安装与首次使用)
- [数据、集成与兼容性](#数据集成与兼容性)
- [开发与相关文档](#开发与相关文档)
- [许可证与常见问题](#许可证与常见问题)

## 定位与职责边界

| 工作台 | 主要职责 | 与 dsh-qa 的关系 |
| --- | --- | --- |
| DeepSeek Harness | 提供 AI 会话、模型、技能、命令和插件运行环境 | dsh-qa 作为插件运行在 DSH 中，沿用这些原生能力 |
| dsh-qa | 在本机管理 QA 项目、测试材料、执行证据和质量门禁 | 为单个 QA 的日常质量工作提供结构化流程 |
| 团队项目或测试管理系统 | 承载团队共享流程和跨系统记录 | 需要团队同步时继续使用现有系统；dsh-qa 当前不提供 WPS、禅道连接器或远端数据同步 |

dsh-qa 适合希望在 DSH 项目会话旁维护测试材料、执行记录和交付依据的 QA。项目数据保存在本机；它不承担团队协作平台、远端仓库监控或跨系统数据同步的职责。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:95-116](https://github.com/naodeng/dsh-qa/blob/c534fcd6c619decadcf3e17861328d7ccb881818/lib/index.js#L95-L116)

启动工作台并注入 adapter。

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.effect(async () => {
    const disposeSection = config.announceToAgent !== false
      ? ctx.systemPrompt.section({ name: 'plugin:dsh-qa', order: 215, text: ANNOUNCEMENT })
      : undefined;
    const routeDisposers = [];

    // 数据目录经环境变量注入，必须在动态 import 服务端前设置。
    process.env.QA_DATA_DIR ??= config.dataDir || PLUGIN_DATA_DIR;

    let state = { port: null, config: null, close: null, error: null };
    try {
      const { startQaBench, closeQaBench } = await import('../server/index.js');
      // Host integrations may provide the controlled adapter registry through plugin
      // config or the Harness context. Without it, the server deliberately records
      // a bounded NOT_RUN result instead of inventing a provider or shell fallback.
      const hostAdapters = config.hostAdapters || ctx.get('hostAdapters');
      const boot = await startQaBench({ port: Number(config.port) || 8899, openBrowser: false, hostAdapters, log });
      state = { port: boot.port, config: boot.config, close: () => closeQaBench(boot.server), error: null };
    } catch (error) {
      state.error = error instanceof Error ? error.message : String(error);
      log(`[dsh-qa] 工作台启动失败（路由降级为 503）：${state.error}`);
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:138-156](https://github.com/naodeng/dsh-qa/blob/c534fcd6c619decadcf3e17861328d7ccb881818/lib/index.js#L138-L156)

本机工作台代理和错误。

<details>
<summary>查看原文（19行）</summary>

```text
    routeDisposers.push(ctx.webServer.register({
      kind: 'prefix',
      path: `${BASE}/workbench`,
      handler: (req, res) => {
        if (!isLoopbackRequest(req)) return writeJson(res, 403, { ok: false, error: 'loopback only' });
        if (state.error) return writeJson(res, 503, { ok: false, error: state.error });
        const url = new URL(req.url, 'http://x');
        const targetPath = url.pathname.slice(`${BASE}/workbench`.length) || '/';
        const headers = { ...req.headers, host: `127.0.0.1:${state.port}` };
        const upstream = http.request({ host: '127.0.0.1', port: state.port, path: targetPath + url.search, method: req.method, headers }, (uRes) => {
          res.writeHead(uRes.statusCode ?? 502, uRes.headers);
          uRes.pipe(res);
        });
        upstream.on('error', (e) => {
          if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
          if (!res.writableEnded) res.end(`qa workbench proxy error: ${e?.message || e}`);
        });
        res.on('close', () => { if (!res.writableEnded) upstream.destroy(); });
        req.pipe(upstream);
```

</details>

**依据 4 · 源码核查**：[server/quality/harness-execution.js:476-508](https://github.com/naodeng/dsh-qa/blob/c534fcd6c619decadcf3e17861328d7ccb881818/server/quality/harness-execution.js#L476-L508)

无 adapter 路径及受控执行参数。

<details>
<summary>查看原文（33行）</summary>

```text
  await notify();
  if (!start) {
    if (shouldStop()) return execution;
    execution.status = 'not_run';
    execution.errorCode = 'provider_unavailable';
    execution.errorSummary = '没有可用的受控 Host adapter';
    execution.revision += 1;
    execution.updatedAt = now();
    await notify();
    return execution;
  }

  if (shouldStop()) return execution;
  execution.status = 'running';
  execution.revision += 1;
  execution.updatedAt = now();
  await notify();
  if (shouldStop()) return execution;

  try {
    const timeoutMs = Number.isInteger(normalizedRequest.timeoutMs) && normalizedRequest.timeoutMs > 0 ? normalizedRequest.timeoutMs : null;
    const timeout = timeoutMs === null ? null : setTimeout(() => requestStop('timed_out'), timeoutMs);
    const adapterResultPromise = Promise.resolve()
      .then(() => start(clone(normalizedRequest), {
        hostExecutionId: execution.id,
        signal: controller.signal,
        writeArtifact: createControlledArtifactWriter(project, execution),
      }))
      .then((value) => ({ type: 'result', value }), (error) => ({ type: 'error', error }));
    const outcome = await Promise.race([
      adapterResultPromise,
      stopPromise.then((reason) => ({ type: 'stop', reason })),
    ]);
```

</details>

**依据 5 · 源码核查**：[server/quality/http-routes.js:235-259](https://github.com/naodeng/dsh-qa/blob/c534fcd6c619decadcf3e17861328d7ccb881818/server/quality/http-routes.js#L235-L259)

结果归档和失败后待补状态。

<details>
<summary>查看原文（25行）</summary>

```text
async function finalizeHostEvidence(project, run, store, broadcast, emitProject) {
  if (!run || run.resultTrust !== 'controlled-host' || run.status !== 'passed') return;
  try {
    const bundle = await finalizeEvidence(project, run.id);
    const hadPendingFinalization = Boolean(run.evidenceFinalization);
    delete run.evidenceFinalization;
    const hasEvidenceRef = (run.evidenceRefs || []).includes(bundle.id);
    if (!hasEvidenceRef || hadPendingFinalization) {
      if (!hasEvidenceRef) run.evidenceRefs = [...new Set([...(run.evidenceRefs || []), bundle.id])];
      store.touch(project);
      store.persist();
      broadcast('quality.evidence.updated', { projectId: project.id, entityId: bundle.id, revision: bundle.revision || 1, updatedAt: bundle.updatedAt });
      emitProject(project.id);
    }
  } catch {
    run.evidenceFinalization = {
      state: 'pending',
      errorCode: 'evidence_finalize_pending',
      attempts: Number(run.evidenceFinalization?.attempts || 0) + 1,
      updatedAt: store.now(),
    };
    store.touch(project);
    store.persist();
    broadcast('quality.evidence.updated', { projectId: project.id, entityId: run.id, state: 'pending', revision: run.revision || 1, updatedAt: run.evidenceFinalization.updatedAt });
    emitProject(project.id);
```

</details>

**依据 6 · 源码核查**：[server/quality/gate.js:27-51](https://github.com/naodeng/dsh-qa/blob/c534fcd6c619decadcf3e17861328d7ccb881818/server/quality/gate.js#L27-L51)

计算受控运行和可验证证据规则。

<details>
<summary>查看原文（25行）</summary>

```text
export function evaluateGate(facts = {}, rules = {}) {
  const provenance = facts.provenance || {};
  const run = facts.latestRun;
  const evidence = facts.evidence || [];
  const readyEvidence = evidence.filter((bundle) => bundle.state === 'ready');
  const checks = [];
  const stale = !run || !equalProvenance(run.provenance, provenance) || readyEvidence.some((bundle) => !equalProvenance(bundle.provenance, provenance));
  checks.push(check('stale-evidence', stale ? 'failed' : 'passed', 'block', stale ? '测试运行或证据与当前输入不一致' : '执行来源与当前输入一致'));
  const verified = readyEvidence.filter((bundle) => bundle.integrity === 'verified' && (!run || bundle.testRunId === run.id));
  const verifiedHostEvidence = run?.resultTrust === 'controlled-host'
    ? verified.filter((bundle) => bundle.provenance?.hostExecutionId === run.provenance?.hostExecutionId && bundle.provenance?.hostResultDigest === run.provenance?.hostResultDigest)
    : verified;
  const invalidEvidence = readyEvidence.some((bundle) => bundle.integrity !== 'verified') || evidence.some((bundle) => bundle.state !== 'ready');
  const missingEvidence = invalidEvidence || (Boolean(rules.requireVerifiedEvidence) && !(run?.resultTrust === 'controlled-host' ? verifiedHostEvidence.length : verified.length));
  const evidenceRefs = run?.resultTrust === 'controlled-host' ? verifiedHostEvidence.map((bundle) => bundle.id) : verified.map((bundle) => bundle.id);
  checks.push(check('verified-evidence', missingEvidence ? 'failed' : 'passed', 'block', missingEvidence ? (invalidEvidence ? '存在未验证或完整性失败的证据' : '缺少已验证的必需证据') : '必需证据已验证', { evidenceRefs }));
  const incompleteHostRun = run?.resultTrust === 'controlled-host' && (typeof run.provenance?.hostExecutionId !== 'string' || !run.provenance.hostExecutionId || typeof run.provenance?.hostResultDigest !== 'string' || !run.provenance.hostResultDigest || !Array.isArray(run.artifacts) || run.artifacts.length === 0);
  const failedRun = !run || !['controlled-local', 'controlled-host'].includes(run.resultTrust) || run.status !== 'passed' || (run.resultTrust === 'controlled-host' && (incompleteHostRun || !verifiedHostEvidence.length));
  checks.push(check('critical-test-result', failedRun ? 'failed' : 'passed', 'block', failedRun ? '缺少受控且通过的关键测试运行' : '关键测试运行已通过', { evidenceRefs: run ? [run.id] : [] }));
  const criticalRisk = (facts.risks || []).some((risk) => risk.severity === 'critical' && risk.assessmentStatus !== 'dismissed' && !['mitigated', 'accepted', 'closed'].includes(risk.dispositionStatus || risk.status));
  checks.push(check('critical-risk', Boolean(rules.blockCriticalOpenRisk) && criticalRisk ? 'failed' : 'passed', 'block', criticalRisk ? '存在未处置的严重风险' : '严重风险已处置'));
  const mediumHigh = (facts.risks || []).some((risk) => ['medium', 'high'].includes(risk.severity) && risk.assessmentStatus !== 'dismissed' && !['mitigated', 'accepted', 'closed'].includes(risk.dispositionStatus || risk.status));
  checks.push(check('medium-coverage', mediumHigh ? 'failed' : 'passed', 'warn', mediumHigh ? '存在未完全覆盖的中高风险范围' : '中高风险范围已覆盖', { waivable: true }));
  const verdict = checks.some((item) => item.status === 'failed' && item.severity === 'block') ? 'BLOCK' : checks.some((item) => item.status === 'failed') ? 'WARN' : 'PASS';
  return { verdict, checks, rulesetVersion: rules.version || 'gate-rules-v1', inputDigest: digest({ provenance, run: run?.id || '', evidence: evidence.map((item) => item.id).sort(), risks: facts.risks || [] }), inputProvenance: structuredClone(provenance) };
```

</details>

#### 缺口

- 缺少实际 adapter 和受控外部任务样本
  **影响**：当前证据不足以证明部署后可执行任务
  **进一步探讨**：用隔离 adapter 对照 not_run、通过、超时及证据归档失败

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 门禁是否总在用户选中的质量任务上选取运行？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

计算路由按 URL 取得任务，随后 gateFacts 取项目级 testruns.at(-1)，没有先按该任务过滤运行。风险、来源摘要、部分修订从选中任务取，证据却按所选的最新项目运行筛。两个任务如来源或修订不同，后运行可能使先前任务被报证据过期；若两个任务共享来源、提交与版本，现有来源比较键不含 qualityTaskId，不能仅凭摘要匹配证明拿到了所选任务自己的测试。是否确实给出错误通过仍取决于各任务来源、计划、风险和证据条件。通用项目门禁另走 evaluateQualityGate，不能用它替代对任务计算门禁的核查。

#### 证据与依据

**依据 1 · 源码核查**：[server/quality/http-routes.js:324-343](https://github.com/naodeng/dsh-qa/blob/c534fcd6c619decadcf3e17861328d7ccb881818/server/quality/http-routes.js#L324-L343)

项目末尾运行与任务上下文分别选择。

<details>
<summary>查看原文（20行）</summary>

```text
function gateFacts(project, task) {
  const runs = project.testruns || [];
  const latestRun = runs.at(-1);
  const profile = latestRun?.provenance?.profileId && (project.executionProfiles || []).find((item) => item.id === latestRun.provenance.profileId);
  const plan = latestRun?.provenance?.planId && (project.testPlans || []).find((item) => item.id === latestRun.provenance.planId);
  const regression = (project.regressionSets || []).filter((item) => item.qualityTaskId === task.id).at(-1);
  return {
    latestRun,
    evidence: (project.evidenceBundles || []).filter((bundle) => bundle.testRunId === latestRun?.id),
    risks: task.risks || [],
    provenance: {
      sourceDigests: (task.sources || []).map((source) => source.digest).sort(),
      commit: task.commit ?? latestRun?.provenance?.commit ?? null,
      testPlanVersion: plan?.version || latestRun?.provenance?.testPlanVersion || null,
      regressionSetVersion: regression?.version || latestRun?.provenance?.regressionSetVersion || null,
      profileId: profile?.id ?? latestRun?.provenance?.profileId ?? null,
      profileVersion: profile?.currentVersion || latestRun?.provenance?.profileVersion || null,
      hostExecutionId: latestRun?.provenance?.hostExecutionId ?? null,
      hostResultDigest: latestRun?.provenance?.hostResultDigest ?? null,
    },
```

</details>

**依据 2 · 源码核查**：[server/quality/http-routes.js:834-853](https://github.com/naodeng/dsh-qa/blob/c534fcd6c619decadcf3e17861328d7ccb881818/server/quality/http-routes.js#L834-L853)

项目和任务门禁入口是不同路径。

<details>
<summary>查看原文（20行）</summary>

```text
  if (parts[1] === 'projects' && parts[2] && parts[3] === 'quality-gate' && !parts[4] && m('GET')) {
    const c = store.getProject(parts[2]);
    if (!c) return fail(res, 404, '项目不存在');
    if (!onlyFields(body, ['before'])) return fail(res, 400, '包含不允许的字段');
    await refreshEvidence(c);
    return ok(res, { gate: evaluateQualityGate(c) });
  }

  if (parts[1] === 'projects' && parts[2] && parts[3] === 'quality-tasks' && parts[4] && parts[5] === 'gates' && parts[6] === 'evaluate' && m('POST')) {
    const c = store.getProject(parts[2]);
    const task = c && getQualityTask(c, parts[4]);
    if (!task) return fail(res, 404, '质量任务不存在');
    if (!onlyFields(body, [])) return fail(res, 400, '包含不允许的字段');
    await refreshEvidence(c);
    const result = evaluateGate(gateFacts(c, task), { version: 'gate-rules-v1', requireVerifiedEvidence: true, blockCriticalOpenRisk: true });
    const gate = { id: store.uid('gate'), kind: 'computed', revision: 1, qualityTaskId: task.id, ...result, exceptions: [], calculatedAt: store.now() };
    c.gates.push(gate); store.touch(c); store.persist();
    broadcast('quality.gate.updated', { projectId: c.id, entityId: gate.id, revision: gate.revision, updatedAt: gate.calculatedAt });
    emitProject(c.id);
    return created(res, { gate });
```

</details>

**依据 3 · 源码核查**：[server/quality/gate.js:3-11](https://github.com/naodeng/dsh-qa/blob/c534fcd6c619decadcf3e17861328d7ccb881818/server/quality/gate.js#L3-L11)

来源对照键不含质量任务 ID。

```text
const TERMINAL = new Set(['passed', 'failed', 'cancelled', 'timed-out', 'environment-error']);
const provenanceKeys = ['sourceDigests', 'commit', 'testPlanVersion', 'regressionSetVersion', 'profileId', 'profileVersion', 'hostExecutionId', 'hostResultDigest'];

function equalProvenance(actual = {}, expected = {}) {
  return provenanceKeys.every((key) => {
    const left = key === 'sourceDigests' ? [...(actual[key] || [])].sort() : (actual[key] ?? null);
    const right = key === 'sourceDigests' ? [...(expected[key] || [])].sort() : (expected[key] ?? null);
    return JSON.stringify(left) === JSON.stringify(right);
  });
```

**依据 4 · 源码核查**：[server/quality/gate.js:33-46](https://github.com/naodeng/dsh-qa/blob/c534fcd6c619decadcf3e17861328d7ccb881818/server/quality/gate.js#L33-L46)

来源、证据和可信执行门槛。

<details>
<summary>查看原文（14行）</summary>

```text
  const stale = !run || !equalProvenance(run.provenance, provenance) || readyEvidence.some((bundle) => !equalProvenance(bundle.provenance, provenance));
  checks.push(check('stale-evidence', stale ? 'failed' : 'passed', 'block', stale ? '测试运行或证据与当前输入不一致' : '执行来源与当前输入一致'));
  const verified = readyEvidence.filter((bundle) => bundle.integrity === 'verified' && (!run || bundle.testRunId === run.id));
  const verifiedHostEvidence = run?.resultTrust === 'controlled-host'
    ? verified.filter((bundle) => bundle.provenance?.hostExecutionId === run.provenance?.hostExecutionId && bundle.provenance?.hostResultDigest === run.provenance?.hostResultDigest)
    : verified;
  const invalidEvidence = readyEvidence.some((bundle) => bundle.integrity !== 'verified') || evidence.some((bundle) => bundle.state !== 'ready');
  const missingEvidence = invalidEvidence || (Boolean(rules.requireVerifiedEvidence) && !(run?.resultTrust === 'controlled-host' ? verifiedHostEvidence.length : verified.length));
  const evidenceRefs = run?.resultTrust === 'controlled-host' ? verifiedHostEvidence.map((bundle) => bundle.id) : verified.map((bundle) => bundle.id);
  checks.push(check('verified-evidence', missingEvidence ? 'failed' : 'passed', 'block', missingEvidence ? (invalidEvidence ? '存在未验证或完整性失败的证据' : '缺少已验证的必需证据') : '必需证据已验证', { evidenceRefs }));
  const incompleteHostRun = run?.resultTrust === 'controlled-host' && (typeof run.provenance?.hostExecutionId !== 'string' || !run.provenance.hostExecutionId || typeof run.provenance?.hostResultDigest !== 'string' || !run.provenance.hostResultDigest || !Array.isArray(run.artifacts) || run.artifacts.length === 0);
  const failedRun = !run || !['controlled-local', 'controlled-host'].includes(run.resultTrust) || run.status !== 'passed' || (run.resultTrust === 'controlled-host' && (incompleteHostRun || !verifiedHostEvidence.length));
  checks.push(check('critical-test-result', failedRun ? 'failed' : 'passed', 'block', failedRun ? '缺少受控且通过的关键测试运行' : '关键测试运行已通过', { evidenceRefs: run ? [run.id] : [] }));
  const criticalRisk = (facts.risks || []).some((risk) => risk.severity === 'critical' && risk.assessmentStatus !== 'dismissed' && !['mitigated', 'accepted', 'closed'].includes(risk.dispositionStatus || risk.status));
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样使用本地工作台而保留交付负责人复核，如何验证任务绑定改进？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

先在隔离本机准备合成项目，建立两个共享提交但独立用例的任务，交错运行，并在任一任务执行失败和证据归档待处理时核对门禁。端点明确要求 loopback，团队共享和真实 provider 不属于本次可确认范围。QA 负责保留原始日志与独立运行证明，必要时继续沿用现有验收。使用投入包括本地存储、适配器、归档和负责人复核；费用和工时尚无实测。可检验的修正是将受控运行、证据和门禁都绑定稳定任务 ID，并比较交错运行后误选、错误 PASS 和补证时间。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:118-147](https://github.com/naodeng/dsh-qa/blob/c534fcd6c619decadcf3e17861328d7ccb881818/lib/index.js#L118-L147)

只允许 loopback 的工作台接入。

<details>
<summary>查看原文（30行）</summary>

```text
    routeDisposers.push(ctx.webServer.register({
      kind: 'exact',
      path: `${BASE}/info`,
      handler: (req, res) => {
        if (!isLoopbackRequest(req)) return writeJson(res, 403, { ok: false, error: 'loopback only' });
        if (state.error) return writeJson(res, 503, { ok: false, error: state.error });
        writeJson(res, 200, { ok: true, url: `http://127.0.0.1:${state.port}/`, port: state.port, dataDir: state.config?.dataDir || PLUGIN_DATA_DIR });
      },
    }));

    routeDisposers.push(ctx.webServer.register({
      kind: 'exact',
      path: `${BASE}/workbench`,
      handler: (req, res) => {
        if (!isLoopbackRequest(req)) return writeJson(res, 403, { ok: false, error: 'loopback only' });
        res.writeHead(302, { Location: `${BASE}/workbench/` });
        res.end();
      },
    }));

    routeDisposers.push(ctx.webServer.register({
      kind: 'prefix',
      path: `${BASE}/workbench`,
      handler: (req, res) => {
        if (!isLoopbackRequest(req)) return writeJson(res, 403, { ok: false, error: 'loopback only' });
        if (state.error) return writeJson(res, 503, { ok: false, error: state.error });
        const url = new URL(req.url, 'http://x');
        const targetPath = url.pathname.slice(`${BASE}/workbench`.length) || '/';
        const headers = { ...req.headers, host: `127.0.0.1:${state.port}` };
        const upstream = http.request({ host: '127.0.0.1', port: state.port, path: targetPath + url.search, method: req.method, headers }, (uRes) => {
```

</details>

**依据 2 · 源码核查**：[server/quality/http-routes.js:324-343](https://github.com/naodeng/dsh-qa/blob/c534fcd6c619decadcf3e17861328d7ccb881818/server/quality/http-routes.js#L324-L343)

任务来源和项目级运行选择。

<details>
<summary>查看原文（20行）</summary>

```text
function gateFacts(project, task) {
  const runs = project.testruns || [];
  const latestRun = runs.at(-1);
  const profile = latestRun?.provenance?.profileId && (project.executionProfiles || []).find((item) => item.id === latestRun.provenance.profileId);
  const plan = latestRun?.provenance?.planId && (project.testPlans || []).find((item) => item.id === latestRun.provenance.planId);
  const regression = (project.regressionSets || []).filter((item) => item.qualityTaskId === task.id).at(-1);
  return {
    latestRun,
    evidence: (project.evidenceBundles || []).filter((bundle) => bundle.testRunId === latestRun?.id),
    risks: task.risks || [],
    provenance: {
      sourceDigests: (task.sources || []).map((source) => source.digest).sort(),
      commit: task.commit ?? latestRun?.provenance?.commit ?? null,
      testPlanVersion: plan?.version || latestRun?.provenance?.testPlanVersion || null,
      regressionSetVersion: regression?.version || latestRun?.provenance?.regressionSetVersion || null,
      profileId: profile?.id ?? latestRun?.provenance?.profileId ?? null,
      profileVersion: profile?.currentVersion || latestRun?.provenance?.profileVersion || null,
      hostExecutionId: latestRun?.provenance?.hostExecutionId ?? null,
      hostResultDigest: latestRun?.provenance?.hostResultDigest ?? null,
    },
```

</details>

**依据 3 · 源码核查**：[server/quality/gate.js:54-66](https://github.com/naodeng/dsh-qa/blob/c534fcd6c619decadcf3e17861328d7ccb881818/server/quality/gate.js#L54-L66)

例外需标注操作者、原因和截止。

<details>
<summary>查看原文（13行）</summary>

```text
export function applyGateExceptions(result, exceptions = [], at = new Date()) {
  const checks = (result.checks || []).map((item) => ({ ...item, waived: false }));
  const now = new Date(at).getTime();
  for (const exception of exceptions) {
    const target = checks.find((item) => item.key === exception.checkKey && item.status === 'failed');
    if (!target || !target.waivable || !String(exception.actorLabel || '').trim() || !String(exception.reason || '').trim() || Number.isNaN(Date.parse(exception.expiresAt)) || Date.parse(exception.expiresAt) <= now) continue;
    target.waived = true;
    target.exception = { checkKey: exception.checkKey, actorLabel: exception.actorLabel, reason: exception.reason, expiresAt: exception.expiresAt };
  }
  const hasBlock = checks.some((item) => item.status === 'failed' && !item.waived && (item.severity === 'block' || !item.waivable));
  const hasWarn = checks.some((item) => item.status === 'failed');
  return { ...result, checks, verdict: hasBlock ? 'BLOCK' : hasWarn ? 'WARN' : result.verdict === 'PASS' ? 'PASS' : 'WARN' };
}
```

</details>

**依据 4 · 作者声明**：[README.md:54-59](https://github.com/naodeng/dsh-qa/blob/c534fcd6c619decadcf3e17861328d7ccb881818/README.md#L54-L59)

作者的交付评审和 provider 边界。

```text
| 执行与证据 | 管理质量任务与执行配置，启动受支持的 Host 执行，归档证据并处理失败与回归 |
| 交付评审 | 按运行来源、证据、测试结果和风险计算 PASS / WARN / BLOCK，由负责人审核待处理项 |

界面提供执行配置、Host 执行和门禁评估；测试计划创建与评审、本地运行预览目前仍有部分步骤需要通过服务端 API 完成。

质量门禁综合检查运行来源、已验证证据、关键测试结果与风险状态；未完成的运行不会作为最终结果。外部 provider 的真实执行能力需单独验收。
```

#### 缺口

- 真实宿主下执行、证据和负责人流程未验证
  **影响**：限制发布场景建议
  **进一步探讨**：以同一来源的双任务对照检查归属和失败回读

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
