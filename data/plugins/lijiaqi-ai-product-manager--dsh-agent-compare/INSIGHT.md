# AgentCompare

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[390040a](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/tree/390040aec66b9274ed83cd8cb955b23ff6e786fc)

<!-- BEGIN META -->
[![GitHub ★ 298](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=298&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare) [![npm 30d 8,822](https://img.shields.io/static/v1?label=npm+30d&message=8%2C822&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agent-compare) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agent-compare)
<!-- END META -->

> **功能**：在 DSH 主对话内生成并比较 2–4 版回答、文件或网页，选择后审查采用。

> **亮点**：将独立生成、可比较结果、选择理由和采用接进同一对话，用户可先试候选再决定是否写回。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：候选目录和 host 策略不是完整隔离保证，目标漂移与外部副作用仍需核验；有限候选的盲选也不能归因模型质量。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 相对多开会话，多版本比较解决什么？](#detail-section-11)
  - [Q02 · 候选如何运行和封存，隔离依赖什么？](#detail-section-12)
  - [Q03 · 采用如何处理目标漂移与错误授权？](#detail-section-13)
  - [Q04 · 如何计成本、采用和验证一轮选择？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复比较界面或方案并希望保留选择与验收记录的人，可从同一 DSH 对话发起候选。

手动启动多个会话可比较，但要分别同步需求、路径与验收，再手工合并结果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 候选编排 | 独立生成和共同验收 | 需要模型和宿主支持 |
| 盲选与公开比较 | 查看与选择内容 | 可见结果可能暴露来源线索 |
| 导出和采用 | 保存选中结果 | 目标漂移需复核，原地采用有条件 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| Node 与 DSH | 加载候选和预览 | 以固定包声明为门槛，实际宿主另测 |
| 项目运行工具 | 安装、验收与预览 | 普通文件可走内容比较，非运行验收 |
| 模型路线 | 生成两至四份候选 | 分别计费和等待 |

| 阶段 | 操作 | 异常 |
| --- | --- | --- |
| 首次 | 普通非 Git 隔离目录用两版无敏感文件任务 | 先核查工作目录权限 |
| 持续 | 对照共同验收后挑选并导出 | 保存失败时检查保留的部分输出 |
| 退出 | 取消并查残留预览和临时副本 | 撤销冲突保留后编辑文件 |

**效果与成本**

| 成本 | 单位 | 边界 |
| --- | --- | --- |
| 模型与运行 | 每个合格结果所有候选的 token 和生成／构建时长 | 不能只计胜出一版 |
| 人工 | 比较、检查、修订与恢复时间 | 未实测 |

| 效果 | 判据 | 限制 |
| --- | --- | --- |
| 比较可追溯 | 同需求验收且可查看选择理由 | 不证明模型排名 |
| 写回有边界 | 重叠拒绝与撤销保留后编辑 | 目标宿主与外部副作用待查 |

> **思考**：候选目录和 host 策略不是完整隔离保证，目标漂移与外部副作用仍需核验；有限候选的盲选也不能归因模型质量。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将独立生成、可比较结果、选择理由和采用接进同一对话，用户可先试候选再决定是否写回。[Q01](#research-q01) [Q03](#research-q03)

采用先计算预期树，按路径撤销以保留后编辑，值得复用。外部执行副作用与候选盲选仍需独立验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

候选目录和 host 策略不是完整隔离保证，目标漂移与外部副作用仍需核验；有限候选的盲选也不能归因模型质量。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

只在无敏感数据的普通非 Git 目录试两版会生成文件的任务。先核对同一验收规则与模型成本，再导出到新目录并检查被跳过条目；出现越界写、必要文件缺失或检查不可解释时停用。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持分候选运行和受保护采用；目标宿主隔离、预览运行与成本收益未实测。

- 已检查：作者 README、包清单、源码路径 src/host/index.ts、src/core/orchestrator.ts、src/core/adopt.ts、src/host/action-access.ts、src/core/blind-view.ts、package.json、src/core/export.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查候选生成、主会话动作和 Git 采用关键路径，未执行插件、构建、预览或真实宿主。
- 下一步：在隔离项目重放两候选、重叠修改、撤销冲突和跨会话确认，记录候选用量、时间及目标树。

**分析版本**

- **仓库**：[lijiaqi-AI-Product-Manager/dsh-agent-compare](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare)
- **版本号**：2.0.0（[固定提交 390040a](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/tree/390040aec66b9274ed83cd8cb955b23ff6e786fc)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先两版再依验收是否需要扩展到四版，可测是否降低每个合格结果的模型和人工支出。若候选质量下降或总等待不减，则停止自动扩展策略。[Q04](#research-q04)

在隔离项目重放两候选、重叠修改、撤销冲突和跨会话确认，记录候选用量、时间及目标树。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 30 | 3424 | — | — | 60453 |
| .tsx | example | 2 | 29 | 27 | 0 | — |
| .ts | example | 2 | 24 | 22 | 0 | — |
| .js | source | 45 | 8276 | 7550 | 745 | — |
| .cjs | source | 4 | 710 | 676 | 36 | — |
| .mjs | source | 20 | 2632 | 2468 | 100 | — |
| .tsx | source | 8 | 1993 | 1840 | 124 | — |
| .ts | source | 53 | 9726 | 8166 | 1043 | — |
| .cts | source | 3 | 533 | 478 | 35 | — |
| .ts | test | 64 | 6658 | 6155 | 136 | — |
| .mjs | test | 2 | 59 | 55 | 2 | — |

</details>

**活跃度**

[![近30天新建 72](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=72&color=737b86&logo=github)](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 71](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=71&color=737b86&logo=github)](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 内的平行候选能否形成可比较、可审查和可退出的交付？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对多开会话，多版本比较解决什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

经常需要比较界面稿、方案或文件的人可以从同一个需求生成两至四个候选，查看结果，留下选择原因，再考虑是否采用。手动开多个会话也可比较，但难保持同一任务、路径和验收条件，还需要手工转移选中结果。插件支持同模型比较风格与不同模型共享风格两类计划，避免把同时改变模型和提示的结果直接归因给模型。盲选会隐藏检查尾日志和诊断，正文、风格痕迹或文件内容仍可能让人猜到来源；一轮选择不能当统计意义的模型排名。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-43](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/README.md#L23-L43)

作者描述版本、文件和实时页面三种用途。

<details>
<summary>查看原文（21行）</summary>

```text
> **2.0.0 · 正式版。** DSH 桌面端与 Web 端，中英双语。在主对话内比较 2–4 版回答、文件或网页；普通文件夹也能开始，复用已配置模型。

**2.0.0 新增：**
- **全新蓝色液态玻璃界面。** 极光与星尘背景、玻璃面板、会滑动的玻璃选择器、液体进度球；选中时光粒迸发，揭晓时光束扫过。深色模式、减弱动效与高对比模式都已适配。
- **说出为什么选。** 选完点几个理由（布局、配色与质感、交互手感……）或补一句话；主对话接着修改时会保留这些优点。
- **快速组合。** 一键设好版本数和风格：经典对照、三种视觉、三种取舍、四向探索。
- **2–4 版，按风格比较。** 八种预设或一句话自定义；也可让不同模型使用同一风格。
- **盲选或公开对比。** 逐版体验，暂时排除后可恢复，用 1–4 专注、0 回到全部。
- **回答、文件、网页都可看。** Markdown 排版，复制回答、代码、文件内容和保存路径；明确标记你的选择。
- **留在主对话。** 比较、选择、采用与撤销写入当前对话记忆；继续交流时可接着修改。
- **Desktop + Web，中英双语。** 沿用已配置模型；有改动时先审查，再确认采用，并保留撤销与恢复入口。

1.3.0 起，普通文件夹、项目子目录、非 Vite 的 Node 项目、静态网页都能比较，回答和文件也能比较。范围与限制见[更新记录](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/main/CHANGELOG.md#200)。

AgentCompare 是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）插件：同一需求，独立完成 2–4 版回答、文件或网页。有可运行页面时实际预览；没有可运行项目时按内容比较，不宣称通过功能测试。先体验再选；盲选时选后才揭晓模型和风格。采用前核对当前项目与候选改动，确认后才写回。

| 你想要 | 在哪里用 | 卡片里会看到 |
|---|---|---|
| 网页或界面改版 | Git 仓库里的 Vite、Node 或静态网页项目，也包括子目录 | 2–4 个能直接点击、输入的实时页面，以及共同验收 |
| 脚本、文档或其它文件 | 任何目录，包括 DSH 默认工作区 | 各版写出的文件，盲选前就能逐个打开 |
| 一个回答 | 任何对话 | 排好版的回答并排，可一键复制；选中的那份进入主对话记忆 |
```

</details>

**依据 2 · 源码核查**：[src/core/orchestrator.ts:68-74](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/core/orchestrator.ts#L68-L74)

请求区分同模型多风格和跨模型同风格。

```text
  /** `same-model` (default): one route, a style per candidate. `cross-model`: a route per candidate, one shared style. */
  readonly mode?: 'same-model' | 'cross-model'
  /** Number of candidates, 2–4. Default: the number of strategies (same-model) or routes (cross-model), else 2. */
  readonly candidates?: number
  /** same-model: one strategy per candidate. cross-model: the shared strategy is `strategies[0]` (default balanced). */
  readonly strategies?: readonly Strategy[]
  /** same-model: routes[0] for every candidate. cross-model: one distinct route per candidate (required). */
```

**依据 3 · 源码核查**：[src/core/blind-view.ts:3-16](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/core/blind-view.ts#L3-L16)

盲选减少检查和安装诊断泄露。

<details>
<summary>查看原文（14行）</summary>

```text
function checksOf(checks: CheckResult[] | undefined): CheckResult[] | undefined {
  return checks?.map(({ tail: _tail, reason, steps, ...facts }) => ({
    ...facts, tail: '',
    ...(reason === undefined ? {} : { reason: facts.outcome === 'skipped' ? '检查未运行；详细说明在揭晓后显示' : facts.outcome === 'passed' ? '检查已完成；详细日志在揭晓后显示' : '检查未通过；详细日志在揭晓后显示' }),
    ...(steps ? { steps: steps.map(({ label, ok }) => ({ label, ok })) } : {}),
  }))
}

function installOf(install: Candidate['install']): Candidate['install'] {
  if (!install) return undefined
  const safe = { ...install }
  if (install.failure) { const { diagnostic: _diagnostic, ...failure } = install.failure; safe.failure = failure }
  if (install.runtime) { const { windowsProcessCompat: _compatibility, ...runtime } = install.runtime; safe.runtime = runtime }
  return safe
```

</details>

**依据 4 · 源码核查**：[src/core/blind-view.ts:29-50](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/core/blind-view.ts#L29-L50)

选择前仍保留阶段和结论字段。

<details>
<summary>查看原文（22行）</summary>

```text
/** Evidence safe for an active blind comparison; the durable record stays intact. */
export function blindEvidence(candidate: Candidate): Pick<Candidate, 'install' | 'checks' | 'error' | 'verificationHistory' | 'progress' | 'generation' | 'verdict'> {
  const { progress, generation, verdict } = candidate
  return {
    ...(candidate.install ? { install: installOf(candidate.install) } : {}),
    ...(candidate.checks ? { checks: checksOf(candidate.checks) } : {}),
    ...(candidate.error ? { error: errorOf(candidate.error) } : {}),
    ...(candidate.verificationHistory ? { verificationHistory: candidate.verificationHistory.map((attempt): VerificationAttempt => ({
      recordedAt: attempt.recordedAt,
      ...(attempt.durationMs === undefined ? {} : { durationMs: attempt.durationMs }),
      ...(attempt.install ? { install: installOf(attempt.install) } : {}),
      ...(attempt.checks ? { checks: checksOf(attempt.checks) } : {}),
      ...(attempt.error ? { error: errorOf(attempt.error) } : {}),
    })) } : {}),
    ...(progress ? { progress: { steps: progress.steps, lastActivityAt: progress.lastActivityAt, ...(progress.lastAction ? { lastAction: '正在处理项目' } : {}) } } : {}),
    ...(generation ? { generation: { ended: generation.ended } } : {}),
    ...(verdict ? { verdict: {
      eligible: verdict.eligible,
      reasons: verdict.reasons.map(reason => reason.startsWith('改动了验收相关文件：') ? '改动了验收相关文件；详细路径在揭晓后显示' : reason.startsWith('验收过程中副本多出了未封存的改动：') ? '验收过程中副本多出了未封存的改动；详细路径在揭晓后显示' : reason),
      warnings: verdict.warnings.map(warning => warning.startsWith('Agent 没有正常结束') ? 'Agent 没有正常结束；以上结论针对已写的文件' : warning.startsWith('页面加载检查没有运行') ? '页面加载检查没有运行；详细说明在揭晓后显示' : warning),
    } } : {}),
  }
```

</details>

#### 缺口

- 没有盲选与手工比较的真实使用对照
  **影响**：不能判断偏见降低或选中更好结果
  **进一步探讨**：固定验收条件对照手工双会话、公开比较及盲选，记录选择理由与错误采纳

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 候选如何运行和封存，隔离依赖什么？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

编排器先准备各自副本，等共享 Git 元数据准备完，再用各自目录和任务提示启动候选，合并人工取消和单候选生成超时。宿主用当前父会话设置模型和预设，为子会话追加 workspace-write，并在 approval 服务存在时设置 never。随后候选结果经封存、验收与预览，生成结束原因与验收结论分别处理。工作目录、副本和宿主策略提供边界，但 npm、构建或宿主执行能力仍需单独核对，目录分开不能证明系统级安全隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/orchestrator.ts:375-414](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/core/orchestrator.ts#L375-L414)

同步候选准备、预算、运行和结束事实。

<details>
<summary>查看原文（40行）</summary>

```text
          if (issue) throw new StageFailure('preparing', issue)
        } catch (error) { if (!signal.aborted) lr.managerFailure = (error as Error).message; throw error }
      }
      prepared()
      // Candidate tools may invoke Git too. Finish both copies' shared Git
      // metadata before either candidate can run a command in its copy.
      await allPrepared
      signal.throwIfAborted()
      if (lr.managerFailure) throw new StageFailure('preparing', lr.managerFailure)

      await enter('generating')
      signal.throwIfAborted()
      const budget = AbortSignal.timeout(record.budget.generationMs)
      let lastSave = 0
      const result = await this.opts.runner.run({
        label: c.label,
        cwd: dir,
        prompt: candidatePrompt(record.task, c.strategy, record.isolation, record.conversationContext?.text,
          record.target ? { kind: 'folder' } : { kind: 'repository', ...(record.baseline.projectPath ? { projectPath: record.baseline.projectPath } : {}), answers: acceptsAnswers(record) },
          { candidates: record.candidates.length, blind: record.blind !== false }),
        route: c.route,
        signal: AbortSignal.any([signal, budget]),
        hostContext: lr.hostContext,
        onProgress: (p) => {
          c.progress = { steps: p.steps, lastActivityAt: Date.now(), ...(p.lastAction === undefined ? {} : { lastAction: p.lastAction.slice(0, 160) }), ...(p.tokens === undefined ? {} : { tokens: p.tokens }) }
          if (Date.now() - lastSave > 3000) {
            lastSave = Date.now()
            void this.persist(record).catch(() => {})
          }
        },
      })
      c.stopReason = result.stopReason
      c.usage = result.usage
      if (result.childId !== undefined) c.childId = result.childId
      if (result.actualRoute !== undefined) c.actualRoute = result.actualRoute
      if (result.summary !== undefined) c.summary = result.summary.slice(0, SUMMARY_MAX)
      await this.noteOutsideChanges(record)
      signal.throwIfAborted()
      // How generation ended is a fact to show, not a verdict: whatever the
      // agent wrote is sealed and verified by the same acceptance either way.
```

</details>

**依据 2 · 源码核查**：[src/core/orchestrator.ts:447-469](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/core/orchestrator.ts#L447-L469)

封存候选及保存树。

<details>
<summary>查看原文（23行）</summary>

````text
    await enter('sealing')
    if (!c.ownerToken) throw new StageFailure('sealing', '候选缺少副本归属凭据，拒绝封存')
    const copy = { repo, owner: { runId: record.runId, label: c.label, token: c.ownerToken }, yarnModern: record.acceptance.runtime.yarnModern }
    const change = await captureChange(dir, record.baseline.snapshotCommit, `agent-compare candidate ${record.runId}/${c.label}`, copy)
    // Where the baseline has nothing to run, a complete reply is a result of its own.
    const answer = change.touched.length === 0 && acceptsAnswers(record) && (c.summary ?? '').trim() !== ''
    if (change.touched.length === 0 && !answer) {
      // The agent's own account is the only clue to why (e.g. sandbox denials); show its start.
      const why = (c.summary ?? '').replace(/```[\s\S]*?```/g, '').trim().slice(0, 600)
      const ended = c.generation?.ended === 'budget'
        ? `超出生成时间预算（${Math.round(record.budget.generationMs / 60_000)} 分钟）时还没有改动任何文件。`
        : c.generation?.ended === 'agent-stopped' ? `Agent 没有正常结束（${c.generation.stopReason}），也没有改动任何文件。` : 'Agent 没有改动任何文件。'
      throw new StageFailure('sealing', `${ended}${why ? `\nAgent 的说明：${why}` : ''}`)
    }
    const artifacts = this.store.artifacts(record.runId)
    c.patchFile = path.join(artifacts, `${c.label}.patch`)
    c.patchSha256 = await writePatch(c.patchFile, change.patch)
    c.patchStats = change.stats
    c.touchedFiles = change.touched
    c.candidateCommit = change.commit
    c.candidateTree = change.tree
    if (answer) c.result = 'answer'
    await pinRef(repo, `refs/agent-compare/${record.runId}/${c.label}`, change.commit)
````

</details>

**依据 3 · 源码核查**：[src/host/index.ts:202-231](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/host/index.ts#L202-L231)

宿主创建子会话并限定工作目录、沙箱和审批。

<details>
<summary>查看原文（30行）</summary>

```text
  async run(req: AgentRunRequest): Promise<AgentRunResult> {
    const parent = req.hostContext as AgentLike | undefined
    if (parent === undefined) throw new Error('没有父会话：请在对话中发起比较')
    const createUserMessage = await this.userMessage()
    const route = req.route.model !== undefined ? req.route : selectedRoute(parent)
    const agentOptions = route.provider !== undefined && route.model !== undefined
      ? { provider: route.provider, model: route.model, ...(route.reasoningEffort === undefined ? {} : { reasoningEffort: route.reasoningEffort }) }
      : undefined
    const presets = parent.ctx.get('agentPresets') as PresetService | undefined
    const agentPreset = presets?.composedPreset?.(parent.ctx)
    const handle = await this.agents.create({
      sessionId: randomUUID(),
      parentAgent: parent,
      meta: {
        cwd: req.cwd,
        parentSession: parent.session.id,
        isSeeded: false,
        origin: 'subagent',
        delegationDepth: (parent.session.header.delegationDepth ?? 0) + 1,
        ...(agentPreset === undefined ? {} : { agentPreset }),
      },
      ...(agentOptions === undefined ? {} : { agentOptions }),
      signal: req.signal,
      setup: (childCtx: ChildCtx, child: AgentLike) => {
        child.session.append('sandbox/mode', { mode: 'workspace-write', source: 'delegation' })
        if (childCtx.get('approval') !== undefined) child.session.append('approval/policy', { policy: 'never', source: 'delegation' })
        presets?.composeFrom?.(childCtx, parent.ctx)
        let order: number | undefined
        try { order = childCtx.systemPrompt?.getContextOrder?.('SUBAGENT_DELEGATION') } catch { order = undefined }
        childCtx.systemPrompt?.context({ name: 'agent-compare:candidate', ...(order === undefined ? {} : { order }), text: DELEGATION_TEXT })
```

</details>

**依据 4 · 源码核查**：[package.json:51-64](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/package.json#L51-L64)

包声明 DSH 与 Node 兼容范围及验证命令。

<details>
<summary>查看原文（14行）</summary>

```text
  "engines": {
    "node": "^22.22.2 || ^24.15.0 || >=26.0.0",
    "dsh": ">=0.2.1-rc.3 <0.3.0-0"
  },
  "scripts": {
    "build": "node -e \"require('node:fs').rmSync('lib',{recursive:true,force:true})\" && tsc -p tsconfig.json && tsc -p tsconfig.client.json && node scripts/wrap-client.mjs",
    "typecheck": "tsc -p tsconfig.json --noEmit && tsc -p tsconfig.client.json --noEmit",
    "check:docs": "node scripts/check-docs.mjs",
    "test": "npm run build && vitest run",
    "test:coverage": "npm run build && vitest run --coverage",
    "test:ui": "npm run build && node scripts/test-ui.mjs && node scripts/test-locales.mjs",
    "test:runtime": "npm run build && node scripts/test-runtime.mjs",
    "smoke": "npm run build && node scripts/smoke.mjs",
    "prepack": "npm run build",
```

</details>

#### 缺口

- 未验证候选工具和预览进程的实际文件与网络权限
  **影响**：不能保证非可信项目安全执行
  **进一步探讨**：用非敏感临时项目检查跨目录写、网络与退出后预览回收

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 采用如何处理目标漂移与错误授权？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

候选采用前读目标树，发现候选触碰路径与现有用户修改重叠就拒绝；不重叠的变化计算预期叠加树，工作区采用遇到叠加树不等于已验收候选时调用 rehearse，创建隔离副本运行验收。写入前检查目标是否又变化，保存采用前引用和恢复日志，然后写入并用 checkWritten 回读。撤销按路径比对现在、候选和采用前状态，保留后来编辑并报告冲突。宿主路由先走 connection 检查，管理动作要求主会话调用；跨会话以明确确认作为操作记录，不替代宿主权限。它保护的是版本、冲突和调用入口，不能承诺任意 repo 构建成功或恢复所有外部副作用。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/adopt.ts:55-71](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/core/adopt.ts#L55-L71)

检查重叠并计算确切预期树。

<details>
<summary>查看原文（17行）</summary>

```text
export async function preflight(input: AdoptInput): Promise<Preflight> {
  const repo = input.baseline.repoRoot
  const touched = input.nameStatus.map((n) => n.path)
  const target = await targetState(repo, input.scratchDir, touched)
  for (const file of touched) {
    if (target.files![file]?.kind !== 'missing' && await gitTry(repo, ['cat-file', '-e', `${target.tree}:${file}`]) === undefined) {
      return { ok: false, reason: 'overlap', overlapping: [file], target }
    }
  }
  if (target.tree !== input.baseline.snapshotTree) {
    const overlapping = await changedPaths(repo, input.baseline.snapshotTree, target.tree, touched)
    if (overlapping.length > 0) return { ok: false, reason: 'overlap', overlapping, target }
  }
  const expectedTree = target.tree === input.baseline.snapshotTree
    ? await treeOf(repo, input.candidateCommit)
    : await overlayTree(repo, input.scratchDir, target.tree, input.candidateCommit, input.nameStatus)
  return { ok: true, targetChanged: target.tree !== input.baseline.snapshotTree, target, expectedTree }
```

</details>

**依据 2 · 源码核查**：[src/core/adopt.ts:152-181](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/core/adopt.ts#L152-L181)

撤销只恢复仍匹配候选的路径并回读。

<details>
<summary>查看原文（30行）</summary>

```text
/**
 * Undo an adoption, path by path. A path is restored only when its content
 * is still either the candidate's (we wrote it) or already the pre-adopt
 * content; anything else was edited by someone since and is left untouched
 * and reported. Works for a finished adoption and for an interrupted one.
 */
export async function undoAdoption(repo: string, scratchDir: string, input: { preAdoptCommit: string; candidateCommit: string; touched: readonly string[]; transfer?: FileTransferRef; legacyRestore?: FileTransferRef; beforeWrite?: (paths: readonly string[]) => Promise<void> }): Promise<{ restored: string[]; conflicts: string[] }> {
  if (input.transfer) {
    if (input.touched.length === 0) return { restored: [], conflicts: [] }
    try { return await restoreFileTransfer(repo, input.transfer) } catch { return { restored: [], conflicts: [...input.touched] } }
  }
  const target = await targetState(repo, scratchDir, input.touched)
  const now = target.tree
  const candidateTree = await treeOf(repo, input.candidateCommit)
  const preTree = await treeOf(repo, input.preAdoptCommit)
  const notCandidate = new Set(await changedPaths(repo, candidateTree, now, input.touched))
  const notPre = new Set(await changedPaths(repo, preTree, now, input.touched))
  const conflicts = input.touched.filter((p) => notCandidate.has(p) && notPre.has(p))
  const restore = input.touched.filter((p) => notPre.has(p) && !notCandidate.has(p))
  const operations: NameStatus[] = []
  for (const file of restore) operations.push({ path: file, status: await gitTry(repo, ['cat-file', '-e', `${preTree}:${file}`]) === undefined ? 'D' : 'M' })
  try {
    await writeCandidate(repo, input.preAdoptCommit, operations, { expected: target, scratchDir, ...(input.legacyRestore ? { transfer: input.legacyRestore } : {}), ...(input.beforeWrite ? { beforeWrite: input.beforeWrite } : {}) })
  } catch (error) {
    const changed = error instanceof CandidateWriteError ? error.changedLocations ?? [] : []
    return { restored: [], conflicts: [...new Set([...conflicts, ...restore, ...changed])] }
  }
  const after = await snapshotTree(repo, scratchDir, ALWAYS_EXCLUDED)
  const stillWrong = await changedPaths(repo, preTree, after, restore)
  return { restored: restore.filter((p) => !stillWrong.includes(p)), conflicts: [...conflicts, ...stillWrong] }
```

</details>

**依据 3 · 源码核查**：[src/host/index.ts:763-782](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/host/index.ts#L763-L782)

HTTP 接线经宿主连接拒绝和动作分派。

<details>
<summary>查看原文（20行）</summary>

```text
  assertComparisonActionRoutes(api)

  ctx.inject(['webServer', 'connection'], (web) => web.effect(() => web.webServer.register({
    kind: 'prefix',
    path: ROUTE,
    handler: async (req, res) => {
      if (web.connection.requestRejection(req) !== undefined) return json(res, 403, { ok: false, error: 'forbidden' })
      if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method not allowed' })
      const method = new URL(req.url ?? '/', 'http://dsh.internal').pathname.slice(ROUTE.length + 1)
      const handler = Object.hasOwn(api, method) ? api[method] : undefined
      if (handler === undefined) return json(res, 404, { ok: false, error: `unknown method ${method}` })
      const ctl = new AbortController()
      res.once('close', () => { if (!res.writableEnded) ctl.abort() })
      try {
        const body = await readBody(req)
        const value = await dispatchComparisonAction({ method, comparer, caller: () => agentFor(body, ctl.signal), runId: () => runIdOf(body), confirmation: body.confirmOtherSession, signal: ctl.signal }, () => handler(body, ctl.signal))
        json(res, 200, { ok: true, value })
      } catch (error) {
        const status = error instanceof HttpError || error instanceof SessionAccessError ? error.status : error instanceof HistoryQueryError ? 400 : error instanceof RecordUnavailableError || error instanceof ChoiceChangedError || (error as Error).name === 'BusyError' ? 409 : 500
        json(res, status, { ok: false, error: (error as Error).message, ...(error instanceof HttpError && error.code ? { code: error.code } : {}) })
```

</details>

**依据 4 · 源码核查**：[src/host/action-access.ts:27-38](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/host/action-access.ts#L27-L38)

拒绝子代理并要求跨会话确认。

<details>
<summary>查看原文（12行）</summary>

```text
/** Resolve the caller through the host before this check. A confirmation records
 * cross-conversation intent; it does not replace the host's access permissions. */
export async function authorizeComparisonAction(comparer: Pick<Comparer, 'get'>, caller: { session: { id: string; header?: { origin?: string } } } | undefined, runId: string, confirmation: unknown, signal?: AbortSignal): Promise<void> {
  if (!caller?.session.id || caller.session.header?.origin === 'subagent') throw new HttpError(403, '请从主对话操作这次比较。')
  signal?.throwIfAborted()
  const record = await comparer.get(runId)
  signal?.throwIfAborted()
  if (!record) throw new HttpError(404, '没有这次比较')
  if ((!record.sessionId || record.sessionId !== caller.session.id) && confirmation !== true) {
    throw new HttpError(409, '这次比较不属于当前对话。请核对项目和运行编号，再确认操作。', 'other-session-confirmation')
  }
}
```

</details>

**依据 5 · 源码核查**：[src/core/orchestrator.ts:1060-1078](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/core/orchestrator.ts#L1060-L1078)

根据预期树决定复用验收或演练，之后检查目标漂移。

<details>
<summary>查看原文（19行）</summary>

```text
      let pf: Awaited<ReturnType<typeof preflight>>
      try { pf = await preflight({ baseline: r.baseline, candidateCommit: c.candidateCommit, nameStatus, scratchDir: scratch }) }
      catch (error) { return blocked(`无法完成采用检查：${(error as Error).message}。`) }
      if (signal.aborted) return blocked(this.closing ? '宿主正在停止，已取消采用。' : '已停止采用预演，候选成果仍保留。')
      if (!pf.ok) return blocked(`基线之后你改过这些文件，和这一版的改动重叠：${pf.overlapping.slice(0, 10).join('、')}。`, pf.overlapping)

      if (pf.expectedTree === c.candidateTree) {
        r.adoption.rehearsal = { reused: true, tree: pf.expectedTree }
      } else {
        const rehearsal = await this.rehearse(r, pf.expectedTree, pf.target.head, signal)
        r.adoption.rehearsal = rehearsal.record
        if (signal.aborted) return blocked(rehearsal.record.stopUnconfirmed
          ? '已收到停止预演请求，但进程退出尚未确认；预演副本继续保留，请检查任务进程。'
          : this.closing ? '宿主正在停止，已取消采用。' : '已停止采用预演，候选成果仍保留。')
        if (!rehearsal.ok) return blocked(`把这一版接到你当前的项目上预演后，验收没有通过：${rehearsal.reasons.join('；')}。`)
      }

      const changed = await targetChanges(repo, scratch, pf.target)
      if (changed.length > 0) return blocked(`预演期间项目发生了变化，请检查后重新采用：${changed.slice(0, 10).join('、')}。`, changed)
```

</details>

**依据 6 · 源码核查**：[src/core/orchestrator.ts:1080-1116](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/core/orchestrator.ts#L1080-L1116)

持久化恢复记录，写入并核查实际内容和并发变化。

<details>
<summary>查看原文（37行）</summary>

```text
      // Journal: everything needed to undo is durable before the first byte changes.
      const preAdopt = await pinPreAdopt(repo, pf.target)
      await pinRef(repo, `refs/agent-compare/${runId}/pre-adopt`, preAdopt)
      if (signal.aborted) return blocked(this.closing ? '宿主正在停止，已取消采用。' : '已停止采用预演，候选成果仍保留。')
      this.adoptionControllers.delete(runId)
      Object.assign(r.adoption, { state: 'writing', preAdoptCommit: preAdopt, expectedTree: pf.expectedTree, headBefore: pf.target.head, stagedBefore: pf.target.staged, writtenPaths: [], fileTransfer: newFileTransferRef(), transferDirection: 'apply' })
      await this.save(r)

      let problem: string | undefined
      let attempted: string[] = []
      let completed = false
      try {
        attempted = await writeCandidate(repo, c.candidateCommit, nameStatus, {
          expected: pf.target,
          scratchDir: scratch,
          transfer: r.adoption.fileTransfer!,
          beforeWrite: async (paths) => {
            r.adoption!.writtenPaths = [...paths]
            await this.save(r)
          },
        })
        const chk = await checkWritten(repo, scratch, { expectedTree: pf.expectedTree, candidateCommit: c.candidateCommit, touched, before: pf.target })
        if (chk.mismatched.length > 0) problem = `写入后这些文件和验收过的版本不一致：${chk.mismatched.slice(0, 10).join('、')}`
        else {
          r.adoption.endedAt = Date.now()
          const others = [...chk.concurrent, ...(chk.headChanged ? ['HEAD'] : []), ...(chk.stagedChanged ? ['index'] : [])]
          if (others.length > 0) {
            r.adoption.state = 'needs-attention'
            r.adoption.attention = others
            r.adoption.message = `已写入 ${touched.length} 个文件，内容与验收过的一致；但写入期间这些位置也变了，组合结果没有经过预演：${others.slice(0, 10).join('、')}`
          } else {
            r.adoption.state = 'adopted'
            r.adoption.message = `已写入 ${touched.length} 个文件，项目现在与${r.adoption.rehearsal?.reused ? '验收过的版本' : '预演通过的版本'}完全一致；未提交，index 和 HEAD 未改动。采用前的原始文件已保留，可从记录撤销`
          }
          r.state = 'adopted'
          await this.save(r)
          completed = true
```

</details>

**依据 7 · 源码核查**：[src/core/orchestrator.ts:1155-1172](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/core/orchestrator.ts#L1155-L1172)

确实创建演练副本并调用共同验收。

<details>
<summary>查看原文（18行）</summary>

```text
  /** Build `tree` in a scratch copy and run the full acceptance on it. */
  private async rehearse(r: RunRecord, tree: string, head: string | undefined, signal: AbortSignal): Promise<{ ok: boolean; reasons: string[]; record: NonNullable<NonNullable<RunRecord['adoption']>['rehearsal']> }> {
    const repo = r.baseline.repoRoot
    const dir = path.join(this.store.copies(r.runId), 'R')
    const token = randomBytes(12).toString('hex')
    const record: NonNullable<NonNullable<RunRecord['adoption']>['rehearsal']> = { reused: false, tree, dir, ownerToken: token }
    r.adoption!.rehearsal = record
    await this.save(r)
    let pinned = false, created = false
    try {
      signal.throwIfAborted()
      const commit = await commitTree(repo, tree, [head], `agent-compare rehearsal ${r.runId}`)
      await pinRef(repo, `refs/agent-compare/${r.runId}/rehearsal`, commit)
      pinned = true
      await addOwnedWorktree(repo, dir, commit, { runId: r.runId, label: 'R', token })
      created = true
      const v = await this.verifyCopy(r.acceptance, dir, { repo, owner: { runId: r.runId, label: 'R', token }, yarnModern: r.acceptance.runtime.yarnModern }, tree, path.join(this.store.artifacts(r.runId), 'R'), signal, undefined, undefined, { projectPath: r.baseline.projectPath })
      await v.preview?.handle.stop()
```

</details>

#### 缺口

- 没有实际覆盖热重载、并发编辑和不同 repo 的撤销
  **影响**：不能把预检当最终写入成功
  **进一步探讨**：在一次性项目注入同路径修改、不同路径修改、写入中断和跨会话请求

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何计成本、采用和验证一轮选择？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

可在无敏感数据的普通非 Git 目录试两版会生成文件的文档或静态页面，检查后保存到新目录。相比手动复制，选择先记录已就绪的候选和理由，导出读取封存树并拒绝覆盖已出现的路径，保存后回读散列。手动复制也可做到无覆盖和核验，且导出会跳过链接与特殊条目，失败留下部分输出。原 Git 项目写回不在此试用范围。两到四个子任务分别使用模型时间与可能的包安装、构建和预览资源，延迟不能只看最快结果。用单版本作为基线，以一个达到共同验收的结果为单位统计成本、等待、修订和人工选择时间。可先两版，只有验收不达标时扩展到三至四版，假设可少花 token 又保持有效候选。若遗漏高质量方向或总等待未改善，就保留固定两版或回到人工对照。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/orchestrator.ts:387-409](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/core/orchestrator.ts#L387-L409)

每个候选独立预算、状态及用量。

<details>
<summary>查看原文（23行）</summary>

```text
      const budget = AbortSignal.timeout(record.budget.generationMs)
      let lastSave = 0
      const result = await this.opts.runner.run({
        label: c.label,
        cwd: dir,
        prompt: candidatePrompt(record.task, c.strategy, record.isolation, record.conversationContext?.text,
          record.target ? { kind: 'folder' } : { kind: 'repository', ...(record.baseline.projectPath ? { projectPath: record.baseline.projectPath } : {}), answers: acceptsAnswers(record) },
          { candidates: record.candidates.length, blind: record.blind !== false }),
        route: c.route,
        signal: AbortSignal.any([signal, budget]),
        hostContext: lr.hostContext,
        onProgress: (p) => {
          c.progress = { steps: p.steps, lastActivityAt: Date.now(), ...(p.lastAction === undefined ? {} : { lastAction: p.lastAction.slice(0, 160) }), ...(p.tokens === undefined ? {} : { tokens: p.tokens }) }
          if (Date.now() - lastSave > 3000) {
            lastSave = Date.now()
            void this.persist(record).catch(() => {})
          }
        },
      })
      c.stopReason = result.stopReason
      c.usage = result.usage
      if (result.childId !== undefined) c.childId = result.childId
      if (result.actualRoute !== undefined) c.actualRoute = result.actualRoute
```

</details>

**依据 2 · 源码核查**：[src/core/orchestrator.ts:968-978](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/core/orchestrator.ts#L968-L978)

回答、普通目录和 Git 候选有不同采用边界。

<details>
<summary>查看原文（11行）</summary>

```text
    const r = await this.mustLoad(runId)
    const c = r.candidates.find((x) => x.label === r.choice?.pick)
    if (!c?.candidateCommit) return { ok: false, eligible: false, reasons: ['没有选中的候选'] }
    if (r.target !== undefined) return { ok: false, eligible: c.verdict?.eligible === true, reasons: ['这次比较从非 Git 目录开始，请用「保存到当前目录」把选中的版本存成新文件夹'] }
    if (c.result === 'answer') return { ok: false, eligible: false, reasons: ['这一版只有回答，没有可以写入的文件；回答已写入主对话'] }
    const nameStatus = await nameStatusOf(r.baseline.repoRoot, r.baseline.snapshotCommit, c.candidateCommit)
    const p = await preflight({ baseline: r.baseline, candidateCommit: c.candidateCommit, nameStatus, scratchDir: this.store.artifacts(runId) })
    const verdict = c.verdict ?? { eligible: false, reasons: ['没有验收结论'], warnings: [] }
    return p.ok
      ? { ok: verdict.eligible, eligible: verdict.eligible, reasons: verdict.reasons, targetChanged: p.targetChanged, rehearsal: p.expectedTree !== c.candidateTree }
      : { ok: false, eligible: verdict.eligible, reasons: verdict.reasons, overlapping: p.overlapping }
```

</details>

**依据 3 · 作者声明**：[README.md:37-43](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/README.md#L37-L43)

区分运行页面与只比较文本和文件。

```text
AgentCompare 是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）插件：同一需求，独立完成 2–4 版回答、文件或网页。有可运行页面时实际预览；没有可运行项目时按内容比较，不宣称通过功能测试。先体验再选；盲选时选后才揭晓模型和风格。采用前核对当前项目与候选改动，确认后才写回。

| 你想要 | 在哪里用 | 卡片里会看到 |
|---|---|---|
| 网页或界面改版 | Git 仓库里的 Vite、Node 或静态网页项目，也包括子目录 | 2–4 个能直接点击、输入的实时页面，以及共同验收 |
| 脚本、文档或其它文件 | 任何目录，包括 DSH 默认工作区 | 各版写出的文件，盲选前就能逐个打开 |
| 一个回答 | 任何对话 | 排好版的回答并排，可一键复制；选中的那份进入主对话记忆 |
```

**依据 4 · 源码核查**：[src/core/orchestrator.ts:864-895](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/core/orchestrator.ts#L864-L895)

选择只接受就绪候选，并记录选择和理由。

<details>
<summary>查看原文（32行）</summary>

```text
  choose(runId: string, pick: CandidateLabel | 'none', note?: string): Promise<RunRecord> {
    return this.operation(() => this.mutate(runId, (r) => {
      const revising = r.state === 'revealed' && r.choice !== undefined
      if (revising) {
        if (pick === 'none' || pick === r.choice!.pick) throw new Error(pick === 'none' ? '揭晓后只能改选另一版已完成的结果' : '已经选了这一版')
        // An adoption attempt owns journals, retained originals and rehearsal
        // copies that belong to its pick; keep them bound to that pick.
        if (r.adoption !== undefined) throw new Error('这次比较已有采用记录，不能改选')
      } else if (r.state !== 'judging' && !(r.state === 'interrupted' && pick === 'none')) throw new Error(`现在不能选择（${r.state}）`)
      if (pick !== 'none' && r.candidates.find((c) => c.label === pick)?.stage !== 'ready') throw new Error(`候选 ${pick} 还没有可体验的结果`)
      const initialPick = revising ? r.choice!.initialPick ?? r.choice!.pick : undefined
      r.choice = { pick, at: Date.now(), ...(note === undefined ? {} : { note }), ...(initialPick === undefined ? {} : { initialPick }) }
      r.state = 'revealed'
      r.revealedAt ??= Date.now()
    }), runId)
  }

  /**
   * Say why the picked version won: fixed reasons and an optional short note.
   * It changes nothing else, may follow the adoption, and an empty answer
   * clears it. A pick changed later starts without reasons.
   */
  explainChoice(runId: string, reasons: readonly PickReason[], note?: string, expectedPick?: CandidateLabel): Promise<RunRecord> {
    return this.operation(() => this.mutate(runId, (r) => {
      if (r.choice === undefined || r.choice.pick === 'none') throw new Error('先选出一版，再说明理由')
      if (expectedPick !== undefined && r.choice.pick !== expectedPick) throw new ChoiceChangedError()
      const unique = PICK_REASONS.filter(reason => reasons.includes(reason))
      const text = (note ?? '').replace(/\s+/g, ' ').trim()
      if ([...text].length > MAX_PICK_NOTE) throw new Error(`理由补充不能超过 ${MAX_PICK_NOTE} 个字`)
      const { reasons: _reasons, note: _note, ...rest } = r.choice
      r.choice = { ...rest, ...(unique.length ? { reasons: unique } : {}), ...(text ? { note: text } : {}) }
    }), runId)
```

</details>

**依据 5 · 源码核查**：[src/core/orchestrator.ts:1194-1219](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/core/orchestrator.ts#L1194-L1219)

非 Git 来源限定、所选封存树校验及保存摘要。

<details>
<summary>查看原文（26行）</summary>

```text
  private async exportPick(runId: string): Promise<RunRecord> {
    const first = await this.mustLoad(runId)
    return withRepositoryWrite(first.baseline.repoRoot, () => this.serial(runId, async () => {
      const r = await this.fresh(runId)
      if (r.state !== 'revealed') throw new AdoptError('state', `现在不能保存（${r.state}）`)
      if (r.target === undefined) throw new AdoptError('state', '只有从非 Git 目录开始的比较可以保存到文件夹')
      if (r.target.folder === undefined) throw new AdoptError('state', '这次比较没有关联的目录；可以在卡片里查看文件内容')
      const pick = r.choice?.pick
      if (pick === undefined || pick === 'none') throw new AdoptError('state', '没有选中的候选')
      const c = r.candidates.find((x) => x.label === pick)!
      if (c.stage !== 'ready' || c.candidateCommit === undefined || c.candidateTree === undefined) throw new AdoptError('state', '这个候选没有可保存的结果')
      if (c.result === 'answer') throw new AdoptError('state', '这一版只有回答，没有文件；回答已写入主对话')
      const repo = r.baseline.repoRoot
      if ((await treeOf(repo, c.candidateCommit)) !== c.candidateTree) throw new AdoptError('integrity', '候选提交和封存的内容不一致')
      if (!existsSync(r.target.folder)) throw new AdoptError('state', `目标目录不存在：${r.target.folder}`)
      const target = freeFolder(r.target.folder, exportFolderName(r.task, r.runId))
      const startedAt = Date.now()
      const saved = await exportTree(repo, c.candidateTree, this.store.artifacts(runId), target)
      r.adoption = {
        label: c.label, mode: 'folder', state: 'adopted', startedAt, endedAt: Date.now(),
        exportPath: saved.exportPath, exportDigests: saved.digests, writtenPaths: saved.written,
        ...(r.adoption?.retainedExports?.length ? { retainedExports: r.adoption.retainedExports } : {}),
        message: `已保存 ${saved.written.length} 个文件到 ${saved.exportPath}；没有改动目录里原有的文件${saved.skipped.length ? `。${saved.skipped.length} 个链接或特殊条目没有保存：${saved.skipped.slice(0, 5).join('、')}` : ''}`,
      }
      r.state = 'adopted'
      await this.save(r)
```

</details>

**依据 6 · 源码核查**：[src/core/export.ts:67-95](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/390040aec66b9274ed83cd8cb955b23ff6e786fc/src/core/export.ts#L67-L95)

实际独占创建目录及文件，散列回读，跳过特殊条目，失败保留部分输出。

<details>
<summary>查看原文（29行）</summary>

```text
export async function exportTree(repo: string, tree: string, scratchDir: string, target: string): Promise<ExportResult> {
  const listing = await git(repo, ['ls-tree', '-r', '-z', '--full-tree', tree])
  const entries = listing.split('\0').filter(Boolean).map(line => ({ mode: line.slice(0, 6), file: line.slice(line.indexOf('\t') + 1) }))
  const regular = entries.filter(entry => entry.mode === '100644' || entry.mode === '100755').map(entry => entry.file)
  const skipped = entries.filter(entry => entry.mode !== '100644' && entry.mode !== '100755').map(entry => entry.file)
  if (regular.length === 0) throw new Error('这一版没有可以保存的文件')
  if (regular.length > MAX_EXPORT_FILES) throw new Error(`这一版有 ${regular.length} 个文件，超过一次保存 ${MAX_EXPORT_FILES} 个的上限`)
  await mkdir(path.dirname(target), { recursive: true })
  // Not recursive: a folder that appeared in the meantime is refused, never merged into.
  await mkdir(target)
  target = await realpath(target)
  await mkdir(scratchDir, { recursive: true })
  const checkout = await mkdtemp(path.join(scratchDir, 'export-checkout-'))
  const index = path.join(scratchDir, `export-index-${randomBytes(6).toString('hex')}`)
  const env = { GIT_INDEX_FILE: index, GIT_WORK_TREE: checkout }
  try {
    await git(repo, ['read-tree', tree], env, undefined, { timeoutMs: 60_000 })
    await git(repo, ['checkout-index', '--force', '--stdin', '-z', `--prefix=${checkout.replace(/\\/g, '/')}/`], env, regular.join('\0') + '\0', { timeoutMs: 120_000 })
    const digests: Record<string, string> = {}
    for (const file of regular) {
      const source = path.join(checkout, ...file.split('/'))
      const destination = await ordinaryPath(target, file, true)
      digests[file] = sha256(await readFile(source))
      await copyFile(source, destination, constants.COPYFILE_EXCL)
      if ((await fileFingerprint(destination)).sha256 !== digests[file]) throw new Error('Saved file changed during publication')
    }
    return { exportPath: target, written: regular, digests, skipped }
  } catch (error) {
    throw new Error(`Save did not complete; partial files were retained at ${target}`, { cause: error })
```

</details>

#### 缺口

- 尚未测固定两版、扩展和单版的合格结果成本
  **影响**：不能声称多候选更便宜或更可靠
  **进一步探讨**：相同任务对照三种分支，记录所有候选消耗和最终接受情况

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
