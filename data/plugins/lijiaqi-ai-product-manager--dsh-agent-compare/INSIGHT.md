# AgentCompare

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[dfc98bb](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/tree/dfc98bb432a2a3679f3b039723e659cba3c6b393)

<!-- BEGIN META -->
[![GitHub ★ 87](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=87&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare) [![npm 30d 478](https://img.shields.io/static/v1?label=npm+30d&message=478&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agent-compare) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agent-compare)
<!-- END META -->

> **功能**：在 DSH 生成双候选界面方案，绑定共同验收并控制选择与写回。

> **亮点**：[Q01](#research-q01) 共同验收与内容绑定降低候选各自自证的空间。[Q03](#research-q03)逐文件交接保留原件和冲突。

> **主要限制**：[Q02](#research-q02) 写入约束依赖宿主且有shared-root回退。[Q03](#research-q03)采用非全仓原子，恢复仍需检查。

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
  - [Q01 · 双候选怎样保持共同验收？](#detail-section-11)
  - [Q02 · 候选和项目命令的约束由谁提供？](#detail-section-12)
  - [Q03 · 写回遇到并发编辑或部分失败怎么办？](#detail-section-13)
  - [Q04 · 怎样评估双份运行的成本？](#detail-section-14)
  - [Q05 · 怎样验证逐文件恢复提示是否足够？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要人工体验选择界面方案的开发者。

手动开两个会话并维护副本、测试和合并。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 候选比较 | 同基线两方案 | 人工体验质量 |
| 共同验收 | 防候选改测试自证 | 基于预先定义 |
| 条件采用 | 原件保留与冲突恢复 | 需支持的文件系统 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH与沙箱服务 | 必需 | 候选及项目进程约束 | 拒绝无约束项目命令 |
| Git与支持的前端项目 | 必需 | 快照和候选交接 | 回单Agent |
| 两份模型及构建环境 | 必需 | 候选生成验收 | 缩小试用 |
| 硬链接与普通文件 | 直接写回需要 | 不覆盖交接 | 另存分支 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 无凭据测试仓绑定小验收 | 记录基线 |
| 生成 | 两候选并封存 | 核对hash和enforcement |
| 验收 | 冻结安装与页面步骤 | 检查未封存变化 |
| 选择 | 先另存分支 | 人工体验 |
| 恢复 | 保留patch和transfer原件 | 冲突先核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 模型和两份磁盘未知 | 准备验收与宿主约束 | 未实测 |
| 持续使用 | 两份安装预览未知 | 人工盲选与质量核对 | 按任务 |
| 失败恢复 | 备份副本资源未知 | 逐文件处理冲突 | 保留journal及原件 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 共同验收 | 绑定配置与拒绝篡改 | 实际质量 |
| 写回保护 | 指纹检查及不覆盖交接 | 断电恢复 |
| 隔离 | 宿主confine及记录 | 平台有效性 |

> **思考**：[Q02](#research-q02) 写入约束依赖宿主且有shared-root回退。[Q03](#research-q03)采用非全仓原子，恢复仍需检查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 共同验收与内容绑定降低候选各自自证的空间。[Q03](#research-q03)逐文件交接保留原件和冲突。

[Q03](#research-q03) 交接日志和保留原件可借鉴，仍需文件系统故障验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 写入约束依赖宿主且有shared-root回退。[Q03](#research-q03)采用非全仓原子，恢复仍需检查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 无凭据测试仓先另存分支，暂不直接写回真实项目。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

封存、验收、约束和写回核心路径已静态核查，质量与恢复未实测。

- 已检查：作者 README、包清单、源码路径 README.md、src/core/adopt.ts、src/core/file-transfer.ts、src/core/orchestrator.ts、src/core/project.ts、src/host/index.ts、src/host/project-process.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定宿主runner、共同验收、采用和恢复代表核心实现。
- 下一步：核对同基线、篡改测试、partial沙箱和逐文件恢复。

**分析版本**

- **仓库**：[lijiaqi-AI-Product-Manager/dsh-agent-compare](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare)
- **版本号**：1.0.1（[固定提交 dfc98bb](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/tree/dfc98bb432a2a3679f3b039723e659cba3c6b393)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 基于既有journal验证恢复阶段呈现，未形成新的存储机制主张。

核对同基线、篡改测试、partial沙箱和逐文件恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 20 | 2680 | — | — | 46083 |
| .tsx | example | 2 | 29 | 27 | 0 | — |
| .ts | example | 2 | 24 | 22 | 0 | — |
| .js | source | 37 | 6335 | 5906 | 448 | — |
| .cjs | source | 3 | 519 | 503 | 13 | — |
| .mjs | source | 13 | 1747 | 1642 | 61 | — |
| .ts | source | 39 | 6235 | 5267 | 596 | — |
| .tsx | source | 1 | 1416 | 1370 | 49 | — |
| .cts | source | 2 | 390 | 362 | 13 | — |
| .ts | test | 44 | 4835 | 4503 | 67 | — |
| .mjs | test | 2 | 59 | 55 | 2 | — |

</details>

**活跃度**

[![近30天关闭 50](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=50&color=737b86&logo=github)](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z)

暂未获取：Issue 未关闭、近30天新建。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：双候选怎样保持共同验收并安全交接到原项目？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 双候选怎样保持共同验收？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要靠体验选择界面方案的开发者，可从同一快照生成两个候选，再盲选。orchestrator固定baseline与acceptance，验证前要求所有权和candidateTree完整；project比较候选对绑定文件、配置和package scripts的修改。eligible拒绝失败、超时、验收文件被改、未封存变化和checkedTree失配，明确页面行为验收未跑也拒绝。相比手工开两个会话，插件管理共同基线与验收，避免各自改测试后自证成功。自由文本设计质量仍需人选，基础加载检查缺失可能只警告。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/orchestrator.ts:186-206](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/src/core/orchestrator.ts#L186-L206)

基线及验收记录

<details>
<summary>查看原文（21行）</summary>

```text
    const tree = await snapshotTree(root, scratch, ALWAYS_EXCLUDED)
    const dirty = head === undefined ? true : tree !== (await treeOf(root, head))
    const acceptance = await buildAcceptance(root, tree, info, input.checks)
    const snapshotCommit = await commitTree(root, tree, [head], `agent-compare baseline ${runId}`)

    const order: [number, number] = input.assignment === 'fixed' || Math.random() < 0.5 ? [0, 1] : [1, 0]
    const mk = (label: CandidateLabel, i: number): Candidate => ({ label, strategy: strategies[i]!, route: routes[i]!, stage: 'queued', timings: {} })
    const record: RunRecord = {
      schema: RUN_SCHEMA,
      coordination: RUN_COORDINATION,
      producer: { name: 'dsh-agent-compare', version: this.opts.version },
      runId,
      createdAt: Date.now(),
      task,
      ...(input.sessionId === undefined ? {} : { sessionId: input.sessionId }),
      ...(input.follows === undefined ? {} : { follows: input.follows }),
      ...(input.origin === undefined ? {} : { origin: input.origin }),
      baseline: { repoRoot: root, headCommit: head, snapshotCommit, snapshotTree: tree, dirty },
      acceptance,
      mode,
      isolation: this.opts.runner.isolation,
```

</details>

**依据 2 · 源码核查**：[src/core/orchestrator.ts:430-450](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/src/core/orchestrator.ts#L430-L450)

封存及重新验证

<details>
<summary>查看原文（21行）</summary>

```text
  /** Verify the original sealed candidate again without recapturing or generating code. */
  private async verifyCandidate(lr: LiveRun, c: Candidate, signal: AbortSignal, enter: (s: CandidateStage) => Promise<void>): Promise<void> {
    const record = lr.record, repo = record.baseline.repoRoot, dir = c.dir!
    if (!c.ownerToken || !c.candidateTree) throw new StageFailure('installing', '缺少封存内容或副本归属，不能重新验收')
    const copy = { repo, owner: { runId: record.runId, label: c.label, token: c.ownerToken }, yarnModern: record.acceptance.runtime.yarnModern }
    const artifacts = this.store.artifacts(record.runId)
    const acc = await acceptanceChanges(repo, record.acceptance, record.baseline.snapshotTree, c.candidateTree)
    c.acceptanceTouched = acc.touched
    c.dependencyChange = acc.dependencyChange

    const v = await this.verifyCopy(record.acceptance, dir, copy, c.candidateTree, path.join(artifacts, c.label), signal, enter, async evidence => {
      Object.assign(c, evidence)
      await this.persist(record)
    })
    if (v.preview) lr.previews.set(c.label, v.preview.handle)
    c.install = v.install
    c.execution = v.execution
    c.checks = v.checks
    c.checkedTree = v.checkedTree
    c.drift = v.drift
    if (v.preview) c.preview = v.preview.info
```

</details>

**依据 3 · 源码核查**：[src/core/project.ts:200-216](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/src/core/project.ts#L200-L216)

验收变更识别

<details>
<summary>查看原文（17行）</summary>

```text
export async function acceptanceChanges(repo: string, acceptance: Acceptance, baseTree: string, candTree: string): Promise<{ touched: string[]; dependencyChange: boolean }> {
  const changed = await changedPaths(repo, baseTree, candTree)
  const touched = changed.filter((p) => Object.hasOwn(acceptance.bound, p) || isConfig(p))
  let dependencyChange = changed.some((p) => (LOCKFILES as readonly string[]).includes(p))
  if (changed.includes('package.json')) {
    const before = parsePkg(await readBlob(repo, baseTree, 'package.json'))
    const after = parsePkg(await readBlob(repo, candTree, 'package.json'))
    for (const name of new Set([...Object.keys(before.scripts ?? {}), ...Object.keys(after.scripts ?? {})])) if (after.scripts?.[name] !== before.scripts?.[name]) touched.push(`package.json scripts.${name}`)
    for (const key of ['type', 'packageManager', 'engines', 'imports', 'exports', 'eslintConfig', 'jest', 'browserslist'] as const) {
      if (JSON.stringify((before as Record<string, unknown>)[key]) !== JSON.stringify((after as Record<string, unknown>)[key])) touched.push(`package.json ${key}`)
    }
    for (const k of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'] as const) {
      if (JSON.stringify(before[k] ?? {}) !== JSON.stringify(after[k] ?? {})) dependencyChange = true
    }
  }
  return { touched, dependencyChange }
}
```

</details>

**依据 4 · 源码核查**：[src/core/orchestrator.ts:1413-1430](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/src/core/orchestrator.ts#L1413-L1430)

采用资格判据

<details>
<summary>查看原文（18行）</summary>

```text
  for (const k of c.checks ?? []) {
    if (k.outcome === 'failed' || k.outcome === 'timeout') reasons.push(`${NAMES[k.name] ?? k.name}${k.outcome === 'timeout' ? '超时' : '未通过'}`)
  }
  const browser = c.checks?.find((k) => k.name === 'browser')
  const scripted = acceptance.checks.browser?.steps?.length || acceptance.checks.browser?.expectSelector || acceptance.checks.browser?.expectText
  if (acceptance.checks.browser !== undefined && (browser === undefined || browser.outcome === 'skipped')) {
    if (scripted) reasons.push('页面验收没有运行')
    else warnings.push(`页面加载检查没有运行${browser?.reason ? `（${browser.reason}）` : ''}`)
  }
  if (c.preview?.kind === 'dev') reasons.push('构建未通过，只能以开发模式预览')
  if ((c.acceptanceTouched ?? []).length > 0) reasons.push(`改动了验收相关文件：${c.acceptanceTouched!.slice(0, 5).join('、')}`)
  if ((c.drift ?? []).length > 0) reasons.push(`验收过程中副本多出了未封存的改动：${c.drift!.slice(0, 5).join('、')}`)
  if (c.checkedTree === undefined || c.checkedTree !== c.candidateTree) reasons.push('验收的内容不是封存的版本')
  if (c.generation?.ended === 'budget') warnings.push('生成被时间预算截断，Agent 没有说完成；以上结论针对截断时已写的文件')
  if (c.generation?.ended === 'agent-stopped') warnings.push(`Agent 没有正常结束（${c.generation.stopReason ?? '未知'}）；以上结论针对它已写的文件`)
  if (c.dependencyChange) warnings.push('改动了依赖（已按锁文件安装）')
  if (c.install && !c.install.frozen) warnings.push('项目没有锁文件，依赖版本可能与你本地不同')
  return { eligible: c.stage !== 'failed' && reasons.length === 0, reasons, warnings }
```

</details>

#### 缺口

- 同任务实际质量与盲选结果未测
  **影响**：不能认定双模型比单模型更好
  **进一步探讨**：合成小界面任务对照单会话与双候选

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 候选和项目命令的约束由谁提供？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

新宿主runner创建各自cwd的会话，附workspace-write及never审批，并接取消信号。无agents.create时回shared-root subagents，代码和README明确只能事后检测越界。安装、检查与预览命令另经宿主confine，以真实副本根为workspaceRoot，缺少接口或有效enforcement就拒绝，环境使用宿主scrubbedParentEnv。partial仍可执行，约束不包括读文件和网络隔离，依赖脚本本身仍需信任。因此worktree是代码副本，不是同权限恶意进程安全边界。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:205-233](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/src/host/index.ts#L205-L233)

候选会话约束和取消

<details>
<summary>查看原文（29行）</summary>

```text
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
      },
    })
    const child = handle.agent
    const start = child.session.seq
    const onAbort = (): void => { try { child.cancel({ kind: 'parent' }) } catch { /* already stopped */ } }
    req.signal.addEventListener('abort', onAbort, { once: true })
    try {
      // A stop that landed while the session was being created would otherwise never reach it.
      if (req.signal.aborted) throw new Error('cancelled before the candidate started')
      child.followup(createUserMessage({ content: [{ type: 'text', text: req.prompt }], source: { kind: 'user' } }))
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:335-343](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/src/host/index.ts#L335-L343)

shared-root回退

```text
  const { defineTool } = (await import('@deepseek-ai/dsh-tools' as string)) as { defineTool: (d: unknown) => unknown }
  const agents = ctx.get('agents') as AgentsService | undefined
  const subagents = ctx.get('subagents') as { startActivation(spec: unknown): Promise<Activation> } | undefined
  let runner: AgentRunner
  if (config.isolation !== 'shared-root' && typeof agents?.create === 'function') runner = new IsolatedSessionRunner(agents)
  else if (subagents !== undefined) {
    runner = new SubagentRunner(subagents, config.provider ?? 'spawn')
    if (config.isolation !== 'shared-root') ctx.logger.warn('agent-compare: no agent factory on this host; falling back to shared-root subagents (escapes are detected, not prevented)')
  } else throw new Error('agent-compare needs ctx.agents (or ctx.subagents) to run candidates')
```

**依据 3 · 源码核查**：[src/host/project-process.ts:46-74](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/src/host/project-process.ts#L46-L74)

项目进程约束与环境

<details>
<summary>查看原文（29行）</summary>

```text
/**
 * The canonical scrub is supplied by the host; no credential-bearing ambient
 * environment is copied back over it. Each copy owns its package caches.
 */
export function createProjectProcess(
  sandbox: () => ProjectSandbox | undefined,
  baseEnvironment: () => Promise<NodeJS.ProcessEnv> = async () => {
    const service = await import('@deepseek-ai/dsh-subprocess' as string) as { scrubbedParentEnv?: () => NodeJS.ProcessEnv }
    if (typeof service.scrubbedParentEnv !== 'function') throw new Error('宿主缺少规范的子进程环境接口，请更新宿主')
    return service.scrubbedParentEnv()
  },
  windowsProcessModule?: string,
  bundledPnpm: () => ManagedPnpm | undefined = () => undefined,
): PrepareProjectProcess {
  return async (request: ProjectProcessRequest) => {
    request.signal?.throwIfAborted()
    const provider = sandbox()
    if (typeof provider?.confine !== 'function') throw new Error('宿主没有可用的进程沙箱，请更新并启用进程沙箱；不会尝试无约束执行')
    const root = await realpath(request.cwd)
    const bundled = bundledPnpm()
    let argv = projectCommandArgv(request.argv, root, process.platform, { pnpm: bundled })
    const pnpm = /^(pnpm|pnpm\.cmd|pnpm\.exe)$/i.test(path.basename(request.argv[0] ?? ''))
    if (pnpm && process.platform !== 'win32') {
      const extension = import.meta.url.endsWith('.ts') ? 'ts' : 'js'
      argv = [process.execPath, fileURLToPath(new URL(`../core/project-command-worker.${extension}`, import.meta.url)), ...argv]
    }
    const confined = await provider.confine(argv, { mode: 'workspace-write', workspaceRoot: root }, request.signal)
    if (confined.enforcement !== 'full' && confined.enforcement !== 'partial') throw new Error('宿主没有报告有效的文件写入约束，本轮项目命令已停止')
    const env = { ...await baseEnvironment() }
```

</details>

**依据 4 · 作者声明**：[README.md:145-164](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/README.md#L145-L164)

作者明确隔离限定

<details>
<summary>查看原文（20行）</summary>

```text
封存与验收从原仓库核对副本的 Git 管理目录、双向链接和归属标记，再显式绑定 Git 目录与工作区执行。指针被改写、链接替换、过大或缺失时，拒绝继续封存和重新打开预览；清理会保留归属不明的副本并说明原因。终端遗留的 Git 仓库、index 和配置选择变量不会重定向这些操作，内部显式创建的私有 index 仍可使用。这些检查保护插件的 Git 生命周期操作；项目进程的约束仍由宿主沙箱提供。

| 方面 | 做法 | 边界 |
|---|---|---|
| 候选写文件 | 候选会话的目录就是它的副本，由 DSH 沙箱在执行前限制 | DSH 官方把 Windows 沙箱标为 partial；平台临时目录可能可写 |
| 项目命令 | 安装、检查、初次预览和重新预览都使用宿主的 `workspace-write` 约束；子进程环境使用宿主的规范清理接口 | 没有约束就停止，不会退回无约束执行。宿主报告部分约束时保留记录并提示；不提供文件读取或网络隔离 |
| 你的项目 | 生成期间检查项目是否和基线不同，并在面板中提示 | 只报告观察到的变化，不推断是谁修改；采用时检查是否重叠 |
| 并发编辑 | 核验工作区与原始文件指纹；先保留原始文件，再以不覆盖现有路径的链接交接。撤销和恢复也保留冲突内容 | 仓库锁不锁定外部编辑器；交接逐文件完成，涉及文件的编辑与目录重排请等操作结束。不是对同权限进程的安全沙箱 |
| 验收 | 绑定脚本内容、配置和测试文件的哈希；验收前后核对副本内容 | 自由文本需求中无法自动验证的部分只能靠你体验，不会被宣称已验证 |
| 依赖 | 有锁文件时总是冻结安装，包缓存各自放在候选副本内 | 没有锁文件的项目只能非冻结安装，会明确提示 |
| 进程 | 预览进程只在命令行能证明是本插件启动的那个时才会被结束；预览写入同样使用宿主约束 | 网络访问和进程可见性**不隔离** |
| 浏览器状态 | 每次启动预览分配新的随机 `.localhost` 域名，进程仍只绑定 `127.0.0.1`；宿主直接连接回环探测，并要求 HTTP 成功状态 | 嵌入 Cookie 受浏览器策略限制，登录、外部后端和共享数据库暂不支持；外部标签页可能使用不同存储。重开预览会重置页面状态，比较记录和截图仍保留 |
| 嵌入导航 | 预览允许脚本和表单，不允许跳转比较窗口的顶层页面 | 不提供完整的恶意代码沙箱；页面与网络请求仍受浏览器自身策略管理 |
| 清理 | 只删除「已注册为该仓库 worktree + 归属标记匹配」的目录 | 不能证明归属的目录会保留并列出 |
| 原始内容保留 | 项目内自忽略的 `.agent-compare-transfer-*` 目录保留原始文件和交接日志，结果中可查看位置；预览清理不会删除它 | 直接写回限普通文件、10,000 个路径及合计 128 MiB 的原始与候选内容；不支持硬链接的文件系统、符号链接及特殊文件可另存分支。未完成恢复前请保留目录 |
| 旧版记录 | 0.1 版本留下的记录只读显示 | 不会对其中记录的路径或进程做任何操作 |

DSH 宿主没有提供会话创建接口（`ctx.agents.create`）时，会退回 0.1 的子 Agent 方式（`isolation: shared-root`）：副本放在仓库内的 `.agents/worktrees`，越界写入只能事后发现。面板和运行记录都会标明当前用的是哪种。

当前 Windows 宿主限制受限进程内部创建捕获输出的命名管道。npm 安装脚本改用前台输出，不改变项目的脚本许可；esbuild 版本检查及 Vite 的可选 `net use` 探测通过私有临时文件捕获输出，esbuild 服务使用宿主公开的匿名管道接口，子进程继承同一个受限令牌。其他需要嵌套命名管道的工具仍可能失败，不会降低权限要求重试。此边界不包含文件读取和网络访问隔离。
```

</details>

#### 缺口

- 具体宿主平台的有效沙箱未运行
  **影响**：无法保证Windows partial或旧宿主不越界
  **进一步探讨**：无凭据测试仓记录enforcement并做无害越界探针

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 写回遇到并发编辑或部分失败怎么办？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

采用前preflight快照目标tree、HEAD、index和相关原文件，重叠变化拒绝，不重叠变化overlay到当前tree。逐文件写前再次比较targetChanges；交接先把旧文件rename进自有before并校验指纹，再以hardlink发布候选，目标已存在则失败而不覆盖。每个阶段保存journal，因此进程中断后仍有保留原件和阶段。写回是逐文件过程而非全仓原子事务，外部编辑器不受仓库锁约束。撤销会恢复可确认内容并把冲突交给用户，不能假设一键总能完全恢复。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/adopt.ts:25-71](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/src/core/adopt.ts#L25-L71)

目标状态和预检

<details>
<summary>查看原文（47行）</summary>

```text
export async function targetState(repo: string, scratchDir: string, paths?: readonly string[]): Promise<TargetState> {
  const files = paths === undefined ? undefined : await transferPreimages(repo, paths)
  return {
    tree: await snapshotTree(repo, scratchDir, ALWAYS_EXCLUDED),
    head: await headCommit(repo),
    staged: await stagedFingerprint(repo),
    ...(files === undefined ? {} : { files }),
  }
}

/** Locations that changed since a target was checked, including Git state. */
export async function targetChanges(repo: string, scratchDir: string, expected: TargetState): Promise<string[]> {
  const now = await targetState(repo, scratchDir, expected.files ? Object.keys(expected.files) : undefined)
  return [...new Set([
    ...(now.tree === expected.tree ? [] : await changedPaths(repo, expected.tree, now.tree)),
    ...(now.head === expected.head ? [] : ['HEAD']),
    ...(now.staged === expected.staged ? [] : ['index']),
    ...Object.keys(expected.files ?? {}).filter(file => !sameFile(expected.files![file]!, now.files![file]!)),
  ])]
}

export type Preflight =
  | { readonly ok: true; readonly targetChanged: boolean; readonly target: TargetState; readonly expectedTree: string }
  | { readonly ok: false; readonly reason: 'overlap'; readonly overlapping: string[]; readonly target: TargetState }

/**
 * Decide whether the candidate can land without touching anything the user
 * changed after the baseline, and compute the exact tree the checkout will
 * have afterwards: the checkout now, with the candidate's touched paths.
 */
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

**依据 2 · 源码核查**：[src/core/adopt.ts:85-119](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/src/core/adopt.ts#L85-L119)

逐文件条件检查

<details>
<summary>查看原文（35行）</summary>

```text
export async function writeCandidate(repo: string, candidateCommit: string, nameStatus: readonly NameStatus[], guard: {
  readonly expected: TargetState
  readonly scratchDir: string
  readonly transfer?: FileTransferRef
  /** Persist the next write's intent before checking its preconditions. */
  readonly beforeWrite?: (paths: readonly string[]) => Promise<void>
}): Promise<string[]> {
  const attempted: string[] = []
  let expected: TargetState = { ...guard.expected, files: guard.expected.files ?? await transferPreimages(repo, nameStatus.map(operation => operation.path)) }
  let transfer: FileTransfer | undefined
  const operations = [...nameStatus.filter((n) => n.status !== 'D'), ...nameStatus.filter((n) => n.status === 'D')]
  try {
    const tree = await overlayTree(repo, guard.scratchDir, expected.tree, candidateCommit, operations)
    for (const operation of operations) {
      if (expected.files![operation.path]?.kind !== 'missing' && await gitTry(repo, ['cat-file', '-e', `${expected.tree}:${operation.path}`]) === undefined) {
        throw new CandidateWriteError('待写入的位置已有未纳入快照的文件', [], [operation.path])
      }
    }
    transfer = await prepareFileTransfer(repo, tree, operations, guard.transfer ?? newFileTransferRef(), expected.files)
    for (const [index, operation] of operations.entries()) {
      const nextTree = await overlayTree(repo, guard.scratchDir, expected.tree, candidateCommit, [operation])
      await guard.beforeWrite?.([...attempted, operation.path])
      const changed = await targetChanges(repo, guard.scratchDir, { ...expected, files: { [operation.path]: expected.files![operation.path]! } })
      if (changed.length > 0) throw new CandidateWriteError('采用期间项目发生了变化', attempted, changed)
      await publishTransferEntry(transfer, index)
      attempted.push(operation.path)
      const nextFiles = expected.files === undefined ? undefined : { ...expected.files, [operation.path]: transfer.journal.entries[index]!.after }
      expected = { ...expected, tree: nextTree, ...(nextFiles === undefined ? {} : { files: nextFiles }) }
    }
    await finishFileTransfer(transfer)
    return attempted
  } catch (error) {
    const affected = transfer ? affectedTransferPaths(transfer) : attempted
    if (error instanceof CandidateWriteError) throw error
    throw new CandidateWriteError((error as Error).message, affected, error instanceof FileTransferError ? error.paths : undefined)
```

</details>

**依据 3 · 源码核查**：[src/core/file-transfer.ts:273-294](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/src/core/file-transfer.ts#L273-L294)

保留原件与不覆盖发布

<details>
<summary>查看原文（22行）</summary>

```text
export async function publishTransferEntry(transfer: FileTransfer, index: number): Promise<void> {
  await assertOwner(transfer)
  const entry = transfer.journal.entries[index]!
  if (entry.phase !== 'prepared' || await statIfPresent(slot(transfer, 'before', index))) throw new FileTransferError('这个文件交接不能重复执行', [entry.path])
  const target = path.join(transfer.journal.repo, entry.path)
  await ordinaryParents(transfer.journal.repo, entry.path, entry.after.kind !== 'missing')
  transfer.journal.state = 'writing'
  if (entry.before.kind !== 'missing') {
    entry.phase = 'capturing'; await save(transfer)
    await rename(target, slot(transfer, 'before', index))
    await syncDirectory(path.dirname(target)); await syncDirectory(path.join(transfer.root, 'before'))
    entry.phase = 'captured'; await save(transfer)
    if (!sameFile(await fileFingerprint(slot(transfer, 'before', index)), entry.before)) throw new FileTransferError('文件交接时检测到新编辑，已保留实际原始文件', [entry.path])
  }
  entry.phase = 'publishing'; await save(transfer)
  if (entry.after.kind !== 'missing') {
    if (!sameFile(await fileFingerprint(slot(transfer, 'next', index)), entry.after)) throw new FileTransferError('准备好的候选文件发生变化', [entry.path])
    await link(slot(transfer, 'next', index), target)
    await syncDirectory(path.dirname(target))
  }
  entry.phase = 'published'; await save(transfer)
}
```

</details>

**依据 4 · 源码核查**：[src/core/adopt.ts:158-181](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/src/core/adopt.ts#L158-L181)

撤销冲突语义

<details>
<summary>查看原文（24行）</summary>

```text
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

#### 缺口

- 真实文件系统断电、硬链接及编辑器竞争未复现
  **影响**：不能把journal存在当作恢复通过
  **进一步探讨**：合成仓在捕获与发布阶段注入中断并检查原件、目标和journal

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样评估双份运行的成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容DSH、Git、支持的前端项目和包管理器、模型、构建与浏览器依赖。先在无凭据测试仓做极小界面变更，固定一个验收步骤，核对每个候选的封存哈希、enforcement、冻结安装和浏览器结果，再只另存分支查看。两份模型调用、依赖及预览会增加现金和磁盘，具体值未知；人工要体验、选择和处理冲突。清理前先结束预览，保留比较记录、patch及未完成恢复的transfer目录。不能确认归属的副本应保留。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:94-97](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/README.md#L94-L97)

适用任务

```text
## 适合什么任务

界面和交互类任务：好坏要靠人体验，测试只能判断「有没有做到」。比如搜索和筛选、表单流程、落地页、仪表盘布局、组件重设计。
答案唯一的修 bug 或重构，用单个 Agent 加测试更合适。
```

**依据 2 · 源码核查**：[src/core/orchestrator.ts:599-629](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/src/core/orchestrator.ts#L599-L629)

冻结副本与依赖安装

<details>
<summary>查看原文（31行）</summary>

```text
    await enter?.('installing')
    const checkedTree = await ownedCopyTree(dir, copy, sealedTree)
    if (checkedTree !== sealedTree) throw new StageFailure('installing', '副本内容与封存的版本不一致，拒绝验收')
    const info = await inspectProject(dir)
    if (info.kind === 'unsupported') throw new StageFailure('installing', info.reason ?? '改动后项目不再受支持')
    if (copy.yarnModern) {
      // Remove only fixed root-level files in an ownership-checked copy. A
      // model-written loader must not survive a frozen dependency install.
      await ownedWorktreeAdmin(copy.repo, dir, copy.owner)
      for (const file of YARN_RUNTIME_FILES) await rm(path.join(dir, file), { force: true })
    }
    const inst = installArgv(info)
    const observed = await runProjectProcess([inst.argv[0]!, '--version'], { cwd: dir, timeoutMs: 10_000, signal, env: { CI: '1' } }, prepare).catch(error => {
      if (error instanceof ProcessStopError) throw error
      return undefined
    })
    signal.throwIfAborted()
    const reportedVersion = observed?.stdout.trim()
    const packageManagerVersion = observed?.code === 0 && !observed.truncated && reportedVersion && /^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(reportedVersion) ? reportedVersion : undefined
    if (info.packageManagerVersion || info.packageManager !== 'npm') {
      const issue = managerVersionIssue(info, packageManagerVersion)
      if (issue) throw new StageFailure('installing', issue.replace('；未请求模型。', '；未开始本次依赖安装。'))
    }
    const runtime = { hostNode: process.version, platform: `${process.platform}-${process.arch}`, packageManager: inst.argv[0]!, ...(packageManagerVersion ? { packageManagerVersion } : {}) }
    const t0 = Date.now()
    const r = await runProjectProcess(inst.argv, { cwd: dir, timeoutMs: 600_000, signal, env: { CI: '1' } }, prepare)
    const failure = r.code !== 0 || r.aborted || r.timedOut ? installFailure(r) : undefined
    const install: NonNullable<Candidate['install']> = { argv: inst.argv, frozen: inst.frozen, durationMs: Date.now() - t0, outcome: r.timedOut ? 'timeout' : r.aborted ? 'cancelled' : r.code === 0 ? 'passed' : 'failed', runtime, ...(failure ? { failure } : {}) }
    await onEvidence?.({ install })
    signal.throwIfAborted()
    if (r.code !== 0 || r.timedOut) {
```

</details>

**依据 3 · 作者声明**：[README.md:147-164](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/README.md#L147-L164)

清理与原件限定

<details>
<summary>查看原文（18行）</summary>

```text
| 方面 | 做法 | 边界 |
|---|---|---|
| 候选写文件 | 候选会话的目录就是它的副本，由 DSH 沙箱在执行前限制 | DSH 官方把 Windows 沙箱标为 partial；平台临时目录可能可写 |
| 项目命令 | 安装、检查、初次预览和重新预览都使用宿主的 `workspace-write` 约束；子进程环境使用宿主的规范清理接口 | 没有约束就停止，不会退回无约束执行。宿主报告部分约束时保留记录并提示；不提供文件读取或网络隔离 |
| 你的项目 | 生成期间检查项目是否和基线不同，并在面板中提示 | 只报告观察到的变化，不推断是谁修改；采用时检查是否重叠 |
| 并发编辑 | 核验工作区与原始文件指纹；先保留原始文件，再以不覆盖现有路径的链接交接。撤销和恢复也保留冲突内容 | 仓库锁不锁定外部编辑器；交接逐文件完成，涉及文件的编辑与目录重排请等操作结束。不是对同权限进程的安全沙箱 |
| 验收 | 绑定脚本内容、配置和测试文件的哈希；验收前后核对副本内容 | 自由文本需求中无法自动验证的部分只能靠你体验，不会被宣称已验证 |
| 依赖 | 有锁文件时总是冻结安装，包缓存各自放在候选副本内 | 没有锁文件的项目只能非冻结安装，会明确提示 |
| 进程 | 预览进程只在命令行能证明是本插件启动的那个时才会被结束；预览写入同样使用宿主约束 | 网络访问和进程可见性**不隔离** |
| 浏览器状态 | 每次启动预览分配新的随机 `.localhost` 域名，进程仍只绑定 `127.0.0.1`；宿主直接连接回环探测，并要求 HTTP 成功状态 | 嵌入 Cookie 受浏览器策略限制，登录、外部后端和共享数据库暂不支持；外部标签页可能使用不同存储。重开预览会重置页面状态，比较记录和截图仍保留 |
| 嵌入导航 | 预览允许脚本和表单，不允许跳转比较窗口的顶层页面 | 不提供完整的恶意代码沙箱；页面与网络请求仍受浏览器自身策略管理 |
| 清理 | 只删除「已注册为该仓库 worktree + 归属标记匹配」的目录 | 不能证明归属的目录会保留并列出 |
| 原始内容保留 | 项目内自忽略的 `.agent-compare-transfer-*` 目录保留原始文件和交接日志，结果中可查看位置；预览清理不会删除它 | 直接写回限普通文件、10,000 个路径及合计 128 MiB 的原始与候选内容；不支持硬链接的文件系统、符号链接及特殊文件可另存分支。未完成恢复前请保留目录 |
| 旧版记录 | 0.1 版本留下的记录只读显示 | 不会对其中记录的路径或进程做任何操作 |

DSH 宿主没有提供会话创建接口（`ctx.agents.create`）时，会退回 0.1 的子 Agent 方式（`isolation: shared-root`）：副本放在仓库内的 `.agents/worktrees`，越界写入只能事后发现。面板和运行记录都会标明当前用的是哪种。

当前 Windows 宿主限制受限进程内部创建捕获输出的命名管道。npm 安装脚本改用前台输出，不改变项目的脚本许可；esbuild 版本检查及 Vite 的可选 `net use` 探测通过私有临时文件捕获输出，esbuild 服务使用宿主公开的匿名管道接口，子进程继承同一个受限令牌。其他需要嵌套命名管道的工具仍可能失败，不会降低权限要求重试。此边界不包含文件读取和网络访问隔离。
```

</details>

#### 缺口

- 固定宿主安装、预览和退出未执行
  **影响**：不能支持当前项目直接写回或量化节时
  **进一步探讨**：先统计一个合格小任务的两候选总成本及清理结果

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证逐文件恢复提示是否足够？

**研究主题**：新假设与验证

#### 完整回答

现有journal和冲突保留机制已实现，不应再把增加日志当新贡献。可在其上检验“按文件显示恢复阶段与实际原件位置”能否降低人工误删。对照正常采用、目标突变、发布失败和撤销冲突，比较恢复准确率与时间；若没有减少误删或造成误导，就保留现有呈现。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/file-transfer.ts:273-294](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/src/core/file-transfer.ts#L273-L294)

已持久化阶段

<details>
<summary>查看原文（22行）</summary>

```text
export async function publishTransferEntry(transfer: FileTransfer, index: number): Promise<void> {
  await assertOwner(transfer)
  const entry = transfer.journal.entries[index]!
  if (entry.phase !== 'prepared' || await statIfPresent(slot(transfer, 'before', index))) throw new FileTransferError('这个文件交接不能重复执行', [entry.path])
  const target = path.join(transfer.journal.repo, entry.path)
  await ordinaryParents(transfer.journal.repo, entry.path, entry.after.kind !== 'missing')
  transfer.journal.state = 'writing'
  if (entry.before.kind !== 'missing') {
    entry.phase = 'capturing'; await save(transfer)
    await rename(target, slot(transfer, 'before', index))
    await syncDirectory(path.dirname(target)); await syncDirectory(path.join(transfer.root, 'before'))
    entry.phase = 'captured'; await save(transfer)
    if (!sameFile(await fileFingerprint(slot(transfer, 'before', index)), entry.before)) throw new FileTransferError('文件交接时检测到新编辑，已保留实际原始文件', [entry.path])
  }
  entry.phase = 'publishing'; await save(transfer)
  if (entry.after.kind !== 'missing') {
    if (!sameFile(await fileFingerprint(slot(transfer, 'next', index)), entry.after)) throw new FileTransferError('准备好的候选文件发生变化', [entry.path])
    await link(slot(transfer, 'next', index), target)
    await syncDirectory(path.dirname(target))
  }
  entry.phase = 'published'; await save(transfer)
}
```

</details>

**依据 2 · 源码核查**：[src/core/adopt.ts:158-181](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/dfc98bb432a2a3679f3b039723e659cba3c6b393/src/core/adopt.ts#L158-L181)

恢复和冲突结果

<details>
<summary>查看原文（24行）</summary>

```text
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

#### 缺口

- 真实恢复界面是否已有充分提示未做可用性实验
  **影响**：增量可能不足
  **进一步探讨**：先走查UI再以合成中断案例做用户任务

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
