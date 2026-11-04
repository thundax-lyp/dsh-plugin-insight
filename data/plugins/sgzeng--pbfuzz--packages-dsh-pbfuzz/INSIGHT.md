# @pbfuzz/dsh-pbfuzz

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[0c65a84](https://github.com/sgzeng/pbfuzz/tree/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-pbfuzz)

<!-- BEGIN META -->
[![GitHub ★ 18](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=18&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sgzeng/pbfuzz) [![npm 30d 471](https://img.shields.io/static/v1?label=npm+30d&message=471&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@pbfuzz/dsh-pbfuzz) [![最新发布 2026-10-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@pbfuzz/dsh-pbfuzz)
<!-- END META -->

> **功能**：为 DSH 提供定向 fuzz 的计划、生成、执行、复盘与触发证据报告。

> **亮点**：把计划、执行、停止和触发输入绑定到同一 campaign 及轮次，减少使用旧指标或错报输入的机会。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：草稿确认前已经可能编译和运行，模式式保护也不能隔离任意目标代码。成功状态与独立重现仍需区分。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 什么任务需要把定向 fuzz 组织成一轮轮计划？](#detail-section-11)
  - [Q02 · 怎样从审批和工具调用走到成功状态？](#detail-section-12)
  - [Q03 · 审批和预算实际约束哪些动作？](#detail-section-13)
  - [Q04 · 怎样比较触发证据的可靠性？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在授权项目中从目标行或缺陷线索寻找可独立复核的本地触发输入。

手工 fuzz harness 与日志整理能做相同试验，插件将审批、阶段和证据连接起来。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 定向 fuzz 活动 | 生成与核对目标触发输入 | 仅授权隔离目标，独立回放 |

**流程与依赖**

| 依赖 | 用途 | 条件 |
| --- | --- | --- |
| DSH 工具与命令 | 宿主编排 | 隔离 Profile |
| Python 与目标构建环境 | 执行与复核 | 可信授权目标 |

| 阶段 | 操作 | 验收 |
| --- | --- | --- |
| 草稿 | 核查目标与运行环境 | 确认前限制权限 |
| 运行 | 设小预算及 oracle | 检查触发输入与停止 |
| 退出 | 停止后独立回放 | 记录现有证据 |

**效果与成本**

| 阶段 | 资源 | 边界 |
| --- | --- | --- |
| 运行 | 构建、测试与模型推理 | 费用和退出未测 |

| 结果 | 支持 | 待测 |
| --- | --- | --- |
| 触发输入及记录 | 本轮证据门槛 | 真实复现率和时长 |

> **思考**：草稿确认前已经可能编译和运行，模式式保护也不能隔离任意目标代码。成功状态与独立重现仍需区分。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把计划、执行、停止和触发输入绑定到同一 campaign 及轮次，减少使用旧指标或错报输入的机会。[Q01](#research-q01) [Q02](#research-q02)

Host、sidecar 与投影职责可分别检查；阶段验证和状态保护不能替代执行权限限制。

<a id="detail-section-5"></a>

### 1.4 主要限制

草稿确认前已经可能编译和运行，模式式保护也不能隔离任意目标代码。成功状态与独立重现仍需区分。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

在隔离授权的教学项目上先检查一次构建、停止和独立回放；不满足时回手工 harness。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持阶段和证据约束。真实漏洞发现率、退出清理和宿主行为待验。

- 已检查：作者 README、包清单、源码路径 README.md、packages/dsh-pbfuzz/src/tools.ts、packages/dsh-pbfuzz/src/index.ts、packages/dsh-pbfuzz/src/engine-bridge.ts、packages/dsh-pbfuzz/src/campaign-flow.ts、packages/dsh-pbfuzz/src/core/bash-guard.ts 及固定范围 inventory；组件：packages/dsh-pbfuzz。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定插件子包的 Host、活动流、触发证据和 guard 说明；未执行任何目标或生成器。
- 下一步：使用已知 oracle 与小预算，记录本轮输入、失败、回放和清理。

**分析版本**

- **仓库**：[sgzeng/pbfuzz](https://github.com/sgzeng/pbfuzz)
- **版本号**：0.1.0（[固定提交 0c65a84](https://github.com/sgzeng/pbfuzz/tree/0c65a84a0138133bfb33303ba041f47edfa0aa59)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

独立核查回放是否提升证据可靠性，对照误报、漏报和额外耗时。尚未验证。[Q04](#research-q04)

使用已知 oracle 与小预算，记录本轮输入、失败、回放和清理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 302 | — | — | 2959 |
| .mjs | source | 2 | 282 | 200 | 66 | — |
| .ts | source | 49 | 10789 | 6568 | 3529 | — |
| .tsx | source | 3 | 559 | 459 | 73 | — |
| .ts | test | 41 | 5640 | 4545 | 633 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/sgzeng/pbfuzz/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：授权的本地安全测试能否通过有限轮次生成可复核的触发输入，并明确审批、执行及停止的界线？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么任务需要把定向 fuzz 组织成一轮轮计划？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

拥有授权的测试工程师知道目标代码位置或已有修补线索，但还没有能触发条件的本地输入时，可用 PBFuzz 组织计划、生成器、执行和复盘。合格结果是具体输入和可核对触发判据，能独立按记录命令复现。相比手写 fuzz 命令与人工整理运行日志，增量是工作流、状态和判据绑定；已有稳定 harness 与生成器的小任务可能用普通 fuzz 即可，发现输入的能力仍依赖目标、oracle 和生成质量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:64-82](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/README.md#L64-L82)

作者描述计划、确认和循环。

<details>
<summary>查看原文（19行）</summary>

```text
Open a session in the target repository and describe the bug in plain language — pbfuzz's skill
triggers automatically:

> There's a bug in `src/http/modules/ngx_http_rewrite_module.c:178` (nginx). Reproduce it as a
> verified PoV.

The agent probes the repo, proposes a campaign (target, build command, oracle) and shows you a
one-screen summary to **Approve** or **Revise**. Once approved it drives PLAN → IMPLEMENT → EXECUTE
→ REFLECT on its own — writing a fuzzing plan, a generator, running it, and reflecting on the
result — until it reports a triggering input or gives up and explains why.

Useful commands inside a session:

| Command | Does |
|---|---|
| `/pbfuzz [notes]` | start a new campaign, with `notes` as the bug report |
| `/pbfuzz run <campaign.yaml>` | headless: load a hand-written, already-confirmed campaign and start PIER with no prompts |
| `/pbfuzz status` | print the current campaign's phase and metrics |
| `/pbfuzz selfcheck` | run the environment self-check (LLVM, tracers, Python) now |
```

</details>

**依据 2 · 作者声明**：[README.md:94-104](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/README.md#L94-L104)

作者区分宿主插件与 Python sidecar。

<details>
<summary>查看原文（11行）</summary>

```text

- **`@pbfuzz/dsh-pbfuzz`** — the campaign FSM (PLAN → IMPLEMENT → EXECUTE → REFLECT, "PIER"),
  its tools (`pbfuzz_campaign`, `pbfuzz_plan`, `pbfuzz_fuzz`, `pbfuzz_reflect`, …), the state
  guards that keep the model from tampering with engine-owned evidence, and the settings/dashboard
  UI. It runs as a native Cordis plugin — no Claude-Code-style hooks, no compatibility layer.
- **`@pbfuzz/dsh-kanalyzer`** *(optional)* — a general-purpose LLVM static-analysis plugin
  (reachability, call graphs) that `dsh-pbfuzz` consumes when static analysis is turned on.
- **`engine/`** — the Python sidecar that actually runs the target: generates inputs, executes
  them, judges the oracle, and is the sole writer of `metrics.json`. It speaks JSON-RPC over
  stdio and never runs model-written code outside a resource-bounded sandbox.

```

</details>

**依据 3 · 源码核查**：[packages/dsh-pbfuzz/src/tools.ts:951-979](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-pbfuzz/src/tools.ts#L951-L979)

触发输入与 PoC 状态的写入关系。

<details>
<summary>查看原文（29行）</summary>

```text
          // The reported PoC must correspond to what the engine itself recorded as the trigger,
          // never a caller-supplied path that was never actually run.
          const firstTriggeringInput = metrics?.last_session?.first_triggering_input
          if (firstTriggeringInput !== undefined && args.poc?.input_path !== undefined && args.poc.input_path !== firstTriggeringInput) {
            throw new Error(`pbfuzz_reflect: claiming success needs a poc matching the engine's own evidence — metrics.json's last_session.first_triggering_input is ${firstTriggeringInput}, but poc.input_path is ${args.poc.input_path}`)
          }
          const inputPath = args.poc?.input_path ?? firstTriggeringInput
          if (inputPath === undefined) {
            throw new Error('pbfuzz_reflect: the engine recorded a trigger but no triggering input path; pass poc.input_path')
          }
          // Everything else the PoC needs is already on disk: asking the model for it meant it
          // first read the run files by hand to find out.
          const iterationsPath = latestIterationsPath(active.layout.dir)
          const trigger = iterationsPath === undefined ? undefined : triggeringIteration(readIterations(iterationsPath))
          const parameters = args.poc?.parameters ?? trigger?.parameters
          const poc = {
            input_path: inputPath,
            run_cmd: args.poc?.run_cmd ?? reproduceCommand(active.campaign, inputPath),
            ...parameters !== undefined ? { parameters } : {},
          }
          // The engine re-ran the triggering input after the session stopped; that is the only
          // reproduction count anyone can stand behind, so it is stamped on the PoC here rather
          // than asked of the agent (which previously meant running the target by hand).
          const reproduced = metrics?.last_session?.reproduced_ok
          const state = advancePhase(host, agent, active, 'SUCCESS', {
            status: 'trigger confirmed',
            current_task: 'report the PoC',
            next_action: NEXT_STEP.SUCCESS,
            poc: reproduced === undefined ? poc : { ...poc, reproduced_times: reproduced },
```

</details>

#### 缺口

- 缺相同目标的手工和代理对照。
  **影响**：不能承诺更快或更高命中。
  **进一步探讨**：用授权教学夹具比较预算相同的首次复现与失败率。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 怎样从审批和工具调用走到成功状态？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 创建 Host，挂载模型工具、投影和命令，sidecar 通过 Python 模块提供执行。草稿校验后保存 YAML，confirm 能检查 draftVersion 不匹配和未处理修订，有问答服务时请求批准，headless 要求事先标记确认。成功反思检查本轮触发增量以及 campaign_id 与 pier_round，避免使用旧 metrics；若有引擎记录的触发输入，调用者路径必须匹配。状态中可附引擎 replay 计数，但代码允许该计数缺省仍进入 SUCCESS，因此应把触发与独立重现分开复核。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-pbfuzz/src/index.ts:88-101](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-pbfuzz/src/index.ts#L88-L101)

Host 初始化及副作用回收。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  // The loader hands over live `Volatile` references. Settings are resolved once and re-resolved
  // after the loader commits a form edit (`loader/volatile-update`, below) — guards read them on
  // every tool call, so they are not re-parsed per read.
  let resolved: PbfuzzSettings | undefined
  const current = (): PbfuzzSettings => (resolved ??= resolveSettings(config))
  const host = new PbfuzzHost(
    current,
    { info: m => { ctx.logger.info(m) }, warn: m => { ctx.logger.warn(m) } },
    () => new Set(ctx.tools.schemas().map(s => s.name)),
    // PYTHONPATH=<engine dir> so `python -m pbfuzz_engine.rpc` runs without a pip install.
    engineEnv(PACKAGE_ROOT),
  )
  ctx.effect(() => () => { host.dispose() })
```

</details>

**依据 2 · 源码核查**：[packages/dsh-pbfuzz/src/index.ts:136-159](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-pbfuzz/src/index.ts#L136-L159)

工具、投影和命令实际接线。

<details>
<summary>查看原文（24行）</summary>

```text
  registerTools(ctx, host)
  ctx.inject(['sessionProjections'], (pctx) => { registerProjection(pctx.sessionProjections) })

  // Apply tool visibility the moment an agent exists. Before, restrict() first ran on the first
  // pbfuzz tool call, so a fresh session listed every pbfuzz tool (hideToolsWithoutCampaign had no
  // effect on the first step).
  ctx.on('agent/created', ({ agent }) => {
    try { host.refresh(agent as AgentLike) } catch (error) { ctx.logger.warn(`pbfuzz: tool visibility for a new agent failed: ${(error as Error).message}`) }
    return undefined
  })

  const skills = loadSkills(join(PACKAGE_ROOT, 'skills'))
  ctx.inject(['skills'], (skctx) => {
    registerSkills(skctx.skills, skills)
  })

  /** pbfuzz's own procedure text, as the collapsed "Context injection · pbfuzz" row. */
  const instructionMessage = (text: string): ReturnType<typeof createUserMessage> => createUserMessage({
    content: [{ type: 'text', text }],
    source: { kind: 'pbfuzz', form: 'instructions' },
  })

  ctx.inject(['commands'], (cctx) => {
    registerCommand(cctx.commands, {
```

</details>

**依据 3 · 源码核查**：[packages/dsh-pbfuzz/src/engine-bridge.ts:15-36](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-pbfuzz/src/engine-bridge.ts#L15-L36)

外部 Python 模块与环境来源。

<details>
<summary>查看原文（22行）</summary>

```text
 * way (`engine/pbfuzz_engine/rpc.py` delegates to the package entry point).
 */
export const ENGINE_ARGV = ['-m', 'pbfuzz_engine.rpc'] as const

/**
 * Environment that lets `python -m pbfuzz_engine.rpc` import the engine without a pip install:
 * `PYTHONPATH` gains the engine source directory, found as `$PBFUZZ_ENGINE_DIR`, the in-repo
 * `<repo>/engine` (a development checkout wins, so a staged copy is never stale there), or the
 * copy shipped in the npm package at `<package>/engine` (engine + pure-Python PyYAML, staged by
 * `scripts/stage-engine.mjs`; nothing to pip install). Empty when none exists, i.e. the engine is
 * expected to be installed into `execution.pythonPath`, which then also needs PyYAML.
 * @param packageRoot - the dsh-pbfuzz package root.
 * @param env - the environment to extend (defaults to this process's).
 * @returns extra environment for the sidecar.
 */
export function engineEnv(packageRoot: string, env: NodeJS.ProcessEnv = process.env): Record<string, string> {
  const candidates = [env.PBFUZZ_ENGINE_DIR, join(packageRoot, '..', '..', 'engine'), join(packageRoot, 'engine')]
  const dir = candidates.find((d): d is string => d !== undefined && d !== '' && existsSync(join(d, 'pbfuzz_engine', 'rpc.py')))
  if (dir === undefined) return {}
  const abs = resolve(dir)
  const existing = env.PYTHONPATH
  return { PYTHONPATH: existing !== undefined && existing !== '' ? `${abs}${delimiter}${existing}` : abs }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-pbfuzz/src/campaign-flow.ts:98-128](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-pbfuzz/src/campaign-flow.ts#L98-L128)

确认和 headless 条件。

<details>
<summary>查看原文（31行）</summary>

```text
export async function confirm(flow: FlowContext, expectedDraftVersion?: string): Promise<ConfirmOutcome> {
  const active = flow.host.active(flow.agent)
  if (active === undefined) return { verdict: 'error', message: 'no drafted campaign; call pbfuzz_campaign with action "draft" first' }
  if (active.campaign.confirmed === true) {
    return { verdict: 'approved', path: active.path, phase: openPlan(flow, active) }
  }
  if (expectedDraftVersion !== undefined && expectedDraftVersion !== active.draftVersion) {
    return {
      verdict: 'error',
      message: `the draft has changed since draftVersion ${expectedDraftVersion} (now ${active.draftVersion}); call pbfuzz_campaign with action "draft" again and confirm with the new draftVersion`,
    }
  }
  if (active.pendingRevision !== undefined && active.pendingRevision.sinceVersion === active.draftVersion) {
    return {
      verdict: 'error',
      message: `a Revise was requested ("${active.pendingRevision.feedback}") but the campaign was never redrafted to incorporate it; call pbfuzz_campaign with action "draft" again before confirming`,
    }
  }
  if (active.headless || flow.asker === undefined) {
    return { verdict: 'error', message: 'headless run: the campaign must be hand-confirmed (`confirmed: true`) before `/pbfuzz run`' }
  }
  const markdown = campaignReviewMarkdown(active.campaign, { ...active.review, path: active.path })
  const askPromise = flow.asker.ask({
    questions: [{
      id: 'campaign-review',
      question: 'Approve this pbfuzz campaign?',
      header: 'Campaign',
      detail: markdown,
      options: [
        { label: APPROVE, description: 'Start the campaign: it moves to PLAN and the PIER loop begins.' },
        { label: REVISE, description: 'Tell pbfuzz what to change; it regenerates the campaign and asks again.' },
```

</details>

**依据 5 · 源码核查**：[packages/dsh-pbfuzz/src/tools.ts:935-979](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-pbfuzz/src/tools.ts#L935-L979)

当前轮证据和重现计数可选。

<details>
<summary>查看原文（45行）</summary>

```text
          const thisRoundTriggered = metrics?.last_session?.triggered ?? 0
          if (thisRoundTriggered <= 0) {
            throw new Error(`pbfuzz_reflect: claiming success needs real engine evidence — only pbfuzz_fuzz can produce a trigger, and metrics.json's last_session shows triggered=${thisRoundTriggered} for this round (lifetime triggered_count=${metrics?.triggered_count ?? 0})`)
          }
          // Cross-check the metrics really came from THIS campaign's THIS round, not a stale file
          // whose `last_session` still shows a genuine — but no-longer-current — trigger from an
          // earlier round (or a different campaign, if output.dir was ever reused). `pbfuzz_fuzz`
          // reads `pier_round` off state.json BEFORE the EXECUTE->REFLECT bump (state-writer.ts's
          // advancePhase increments `pier_round` only on entry to REFLECT), so the metrics a
          // round's fuzz session writes always carry `pier_round = state.pier_round - 1` by the
          // time that round reaches REFLECT and this tool runs.
          const currentState = host.state(active)
          const expectedRound = (currentState?.pier_round ?? 0) - 1
          if (metrics?.campaign_id !== active.campaign.id || metrics?.pier_round !== expectedRound) {
            throw new Error(`pbfuzz_reflect: claiming success needs evidence from the CURRENT campaign and round — metrics.json shows campaign_id=${metrics?.campaign_id ?? 'undefined'}, pier_round=${metrics?.pier_round ?? 'undefined'}, but this round is ${active.campaign.id}/${expectedRound}; run pbfuzz_fuzz again this round before claiming success`)
          }
          // The reported PoC must correspond to what the engine itself recorded as the trigger,
          // never a caller-supplied path that was never actually run.
          const firstTriggeringInput = metrics?.last_session?.first_triggering_input
          if (firstTriggeringInput !== undefined && args.poc?.input_path !== undefined && args.poc.input_path !== firstTriggeringInput) {
            throw new Error(`pbfuzz_reflect: claiming success needs a poc matching the engine's own evidence — metrics.json's last_session.first_triggering_input is ${firstTriggeringInput}, but poc.input_path is ${args.poc.input_path}`)
          }
          const inputPath = args.poc?.input_path ?? firstTriggeringInput
          if (inputPath === undefined) {
            throw new Error('pbfuzz_reflect: the engine recorded a trigger but no triggering input path; pass poc.input_path')
          }
          // Everything else the PoC needs is already on disk: asking the model for it meant it
          // first read the run files by hand to find out.
          const iterationsPath = latestIterationsPath(active.layout.dir)
          const trigger = iterationsPath === undefined ? undefined : triggeringIteration(readIterations(iterationsPath))
          const parameters = args.poc?.parameters ?? trigger?.parameters
          const poc = {
            input_path: inputPath,
            run_cmd: args.poc?.run_cmd ?? reproduceCommand(active.campaign, inputPath),
            ...parameters !== undefined ? { parameters } : {},
          }
          // The engine re-ran the triggering input after the session stopped; that is the only
          // reproduction count anyone can stand behind, so it is stamped on the PoC here rather
          // than asked of the agent (which previously meant running the target by hand).
          const reproduced = metrics?.last_session?.reproduced_ok
          const state = advancePhase(host, agent, active, 'SUCCESS', {
            status: 'trigger confirmed',
            current_task: 'report the PoC',
            next_action: NEXT_STEP.SUCCESS,
            poc: reproduced === undefined ? poc : { ...poc, reproduced_times: reproduced },
```

</details>

#### 缺口

- 未执行端到端。
  **影响**：不能确认实际工具事件、状态或 sidecar 互操作。
  **进一步探讨**：在最小项目逐阶段记录状态和引擎日志。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 审批和预算实际约束哪些动作？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

草稿会先调用 verifyEnvironment，再保存供确认的材料；源码注释说明包含编译和一次空输入执行，故确认挡的是进入循环，不能视为确认前没有执行。bash guard 自己声明是基于模式的尽力检查，不是任意代码沙箱。需可信隔离环境、目标构建依赖、Python、模型及 tracer；运行目标及生成器时仍要限制网络、工作目录与权限。作者给出阶段轮数、总时长及强制继续预算，不能仅凭预算字段推导任意子进程不会超时或产生副作用。首次设置 oracle 和复现、持续跑模型及测试、失败清理都有成本，不能拿命中次数代替合格产物。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-pbfuzz/src/campaign-flow.ts:49-64](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-pbfuzz/src/campaign-flow.ts#L49-L64)

预审批草稿实际调用环境核验。

<details>
<summary>查看原文（16行）</summary>

```text
 * `draft`: validate the answers, write the yaml, then build the target and run it once on an
 * empty input so the campaign states something observed rather than claimed.
 * @param flow - caller context.
 * @param input - the answers.
 * @returns the outcome; `issues` lists every violation when not ok.
 */
export async function draft(flow: FlowContext, input: CampaignDraftInput): Promise<DraftOutcome> {
  const settings = flow.host.settings()
  const seeds = input.analysis?.corpus?.seeds_dir
  const result = draftCampaign(input, settings, seeds !== undefined && flow.host.seedsAvailable(flow.host.resolvePath(flow.agent, seeds)))
  if (!result.validation.ok) return { ok: false, issues: result.validation.issues, decisions: result.decisions, verification: [] }
  const verification = await verifyEnvironment(result.campaign, undefined, flow.signal)
  const active = flow.host.save(flow.agent, result.campaign, {
    decisions: result.decisions,
    verification,
    ...input.evidence !== undefined ? { evidence: input.evidence } : {},
```

</details>

**依据 2 · 源码核查**：[packages/dsh-pbfuzz/src/core/bash-guard.ts:2-13](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-pbfuzz/src/core/bash-guard.ts#L2-L13)

保护状态的规则有明确设计边界。

<details>
<summary>查看原文（12行）</summary>

```text
 * Best-effort detection of a shell command that would tamper with pbfuzz's campaign state.
 *
 * Ported from `engine/hooks/pbfuzz_hooks/guards.py`'s `_bash_guard_verdict` and its regex
 * machinery, verbatim in structure: clause-by-clause scanning for a *protected path mention* and
 * a *mutation* landing in the same clause, with a `cd`-tracking carve-out for a bare state
 * filename used right after `cd`-ing into the campaign directory. This is explicitly **not a
 * security boundary** — it is regex matching over the raw command text, with no real shell
 * tokenization — the guarded `write`/`edit` denial in `guard-policy.ts` is the actually-enforced
 * path; this module only makes the common, unobfuscated cases of "just `cat`/`echo >` the state
 * file" visible before they run. Do not "improve" the regexes' coverage as part of any future
 * change without re-running them against every row of the precision/recall table in
 * `tests/bash-guard.spec.ts` — a wider match here trades a false negative for a new false
```

</details>

**依据 3 · 作者声明**：[README.md:84-88](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/README.md#L84-L88)

作者列出无人值守预算。

```text
Settings (tracer, budget caps, oracle defaults, which auxiliary analyses are on) live under
**Plugins → @pbfuzz/dsh-pbfuzz → Configure** in the web UI, or under the `pbfuzz` entry's `config:` in
your profile's `cordis.patch.yml`. Three budgets —
`budget.maxPierRounds`, `budget.campaignWallTimeMin`, `budget.maxConsecutiveForcedContinues` — are
the only brake on an unattended run; reaching one stops the campaign for real (`phase: STOPPED`).
```

**依据 4 · 源码核查**：[packages/dsh-pbfuzz/src/tools.ts:984-999](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-pbfuzz/src/tools.ts#L984-L999)

停止状态和预算处理位置。

<details>
<summary>查看原文（16行）</summary>

```text
        case 'stop': {
          const state = advancePhase(host, agent, active, 'STOPPED', {
            status: 'stopped by the agent',
            current_task: 'report the stop reason and the best evidence gathered',
            next_action: NEXT_STEP.STOPPED,
            stopReason: args.stop_reason ?? 'agent-requested stop',
          })
          exec.concludeTurn()
          return withDashboard({ phase: state.phase, stop_reason: state.stop_reason ?? null }, exec)
        }
        default: {
          // Budget enforcement (maxPierRounds / campaignWallTimeMin) lives entirely inside
          // advancePhase(); it may silently redirect this PLAN request to STOPPED. Whatever it
          // actually produced is what gets reported back — never re-implement the check here.
          const state = advancePhase(host, agent, active, 'PLAN', {
            status: 'reflecting; next PLAN round pending',
```

</details>

#### 缺口

- 未核实大进程被打断后如何清理。
  **影响**：不能证明隔离、时限或成本。
  **进一步探讨**：在无外网沙箱用慢目标、重复轮次和可观察退出记录验证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样比较触发证据的可靠性？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先用自有无网络教学项目和确定性 oracle，审批前也仅允许可丢弃环境。固定一小轮预算，检查 YAML、实际目标、停止原因及同一输入独立回放；若目标构建不可控、触发与重现不一致或超预算就停止，回到手工 harness。可试验将引擎回放设为报告层的独立门槛，比较现有触发状态和强制复现的误报、漏报及时间。若确定性样本无误报差异，或不稳定目标的大量有效线索被丢弃，应保留分级证据而非统一拒绝。假设未验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-pbfuzz/src/tools.ts:951-979](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-pbfuzz/src/tools.ts#L951-L979)

当前状态可携带但不强制回放计数。

<details>
<summary>查看原文（29行）</summary>

```text
          // The reported PoC must correspond to what the engine itself recorded as the trigger,
          // never a caller-supplied path that was never actually run.
          const firstTriggeringInput = metrics?.last_session?.first_triggering_input
          if (firstTriggeringInput !== undefined && args.poc?.input_path !== undefined && args.poc.input_path !== firstTriggeringInput) {
            throw new Error(`pbfuzz_reflect: claiming success needs a poc matching the engine's own evidence — metrics.json's last_session.first_triggering_input is ${firstTriggeringInput}, but poc.input_path is ${args.poc.input_path}`)
          }
          const inputPath = args.poc?.input_path ?? firstTriggeringInput
          if (inputPath === undefined) {
            throw new Error('pbfuzz_reflect: the engine recorded a trigger but no triggering input path; pass poc.input_path')
          }
          // Everything else the PoC needs is already on disk: asking the model for it meant it
          // first read the run files by hand to find out.
          const iterationsPath = latestIterationsPath(active.layout.dir)
          const trigger = iterationsPath === undefined ? undefined : triggeringIteration(readIterations(iterationsPath))
          const parameters = args.poc?.parameters ?? trigger?.parameters
          const poc = {
            input_path: inputPath,
            run_cmd: args.poc?.run_cmd ?? reproduceCommand(active.campaign, inputPath),
            ...parameters !== undefined ? { parameters } : {},
          }
          // The engine re-ran the triggering input after the session stopped; that is the only
          // reproduction count anyone can stand behind, so it is stamped on the PoC here rather
          // than asked of the agent (which previously meant running the target by hand).
          const reproduced = metrics?.last_session?.reproduced_ok
          const state = advancePhase(host, agent, active, 'SUCCESS', {
            status: 'trigger confirmed',
            current_task: 'report the PoC',
            next_action: NEXT_STEP.SUCCESS,
            poc: reproduced === undefined ? poc : { ...poc, reproduced_times: reproduced },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-pbfuzz/src/campaign-flow.ts:104-128](https://github.com/sgzeng/pbfuzz/blob/0c65a84a0138133bfb33303ba041f47edfa0aa59/packages/dsh-pbfuzz/src/campaign-flow.ts#L104-L128)

确认界面明确计划快照。

<details>
<summary>查看原文（25行）</summary>

```text
  if (expectedDraftVersion !== undefined && expectedDraftVersion !== active.draftVersion) {
    return {
      verdict: 'error',
      message: `the draft has changed since draftVersion ${expectedDraftVersion} (now ${active.draftVersion}); call pbfuzz_campaign with action "draft" again and confirm with the new draftVersion`,
    }
  }
  if (active.pendingRevision !== undefined && active.pendingRevision.sinceVersion === active.draftVersion) {
    return {
      verdict: 'error',
      message: `a Revise was requested ("${active.pendingRevision.feedback}") but the campaign was never redrafted to incorporate it; call pbfuzz_campaign with action "draft" again before confirming`,
    }
  }
  if (active.headless || flow.asker === undefined) {
    return { verdict: 'error', message: 'headless run: the campaign must be hand-confirmed (`confirmed: true`) before `/pbfuzz run`' }
  }
  const markdown = campaignReviewMarkdown(active.campaign, { ...active.review, path: active.path })
  const askPromise = flow.asker.ask({
    questions: [{
      id: 'campaign-review',
      question: 'Approve this pbfuzz campaign?',
      header: 'Campaign',
      detail: markdown,
      options: [
        { label: APPROVE, description: 'Start the campaign: it moves to PLAN and the PIER loop begins.' },
        { label: REVISE, description: 'Tell pbfuzz what to change; it regenerates the campaign and asks again.' },
```

</details>

#### 缺口

- 缺相同输入的真实独立回放。
  **影响**：仅适合已知结果样本。
  **进一步探讨**：记录当前轮、输入摘要及复现次数。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
