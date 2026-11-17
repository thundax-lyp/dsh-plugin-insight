# dsh-github

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[dfc3906](https://github.com/PerryLink/dsh-github/tree/dfc39065e3943ea05540f22a34be4750dd902964)

<!-- BEGIN META -->
[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-github) [![npm 30d 8,145](https://img.shields.io/static/v1?label=npm+30d&message=8%2C145&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@perrylink/dsh-github) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@perrylink/dsh-github)
<!-- END META -->

> **功能**：把 GitHub PR、议题、审查与 CI 接入 DSH，提供审查规则、轮询和检查发布。

> **亮点**：让审查、GitHub 操作及 DSH 任务在同一回合衔接，见 [Q01](#research-q01)。可先单独分析差异，再由显式步骤发评论和检查，见 [Q03](#research-q03)。

> **主要限制**：哪些路径会未经工具审批写入？轮询、CI 与无提示高权限有不同分支，且并发与查询失败会削弱去重，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 哪类维护者能从审查接入中获益？](#detail-section-11)
  - [Q02 · 什么时候请求批准，什么时候会直接远端写入？](#detail-section-12)
  - [Q03 · 重跑是怎样去重的，会留下什么？](#detail-section-13)
  - [Q04 · 怎样试验成本、停止条件和可能的改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合经常在 DSH 内复核一批 GitHub PR 的维护者，可先核对规则发现及目标 head，见 [Q01](#research-q01)。

用本地人工复核、gh 和仓库已有 GitHub 检查作对照。关注审查发现是否可定位、复核成本是否下降，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| GitHub 工具 | 读取或修改 PR 和 issue | 令牌权限与工具审批决定范围 |
| 审查任务 | 分析差异与返回结果 | 覆盖有上限，结果仍需复核 |
| CI 命令 | 轮询及发布检查 | 须明确配置写入范围 |
| Web 配置 | 编辑插件设置 | 依赖客户端槽与语言服务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 工具、命令、任务、审批和凭据服务 | 宿主必需 | 处理可调用接口及权限 | 能力未注册或无法访问 |
| 目标 GitHub 令牌和网络 | 调用必需 | 读取 PR 与控制写入 | 返回错误或受权限拒绝 |
| Web 语言和插件槽 | Web 配置所需 | 配置插件 | 需配置文件而非界面 |

#### 启动步骤

| 阶段 | 动作 | 验收 |
| --- | --- | --- |
| 准备 | 复制测试 profile 并选只读令牌 | 能核对仓库及身份 |
| 核查 | 禁轮询，指定 analyze | 匹配固定 head，无远端写入 |
| 结束 | 停用并复核报告和远端记录 | 原 GitHub 流程可继续 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主环境 | 检查凭据和 profile | 耗时未知 |
| 持续 | API 与可选模型使用 | 复核截断和误报 | 实测用量未知 |
| 失败与退出 | 远端修改及报告清理 | 对账、停止轮询并处理写入 | 既有记录需独立处理 |

#### 效果

| 效果 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 规则审查 | 可输出确定性发现 | 缺陷检测准确率 |
| 远端回传 | 可用 marker 和 check 避免部分重复 | 竞态及长期可靠性 |

> **思考**：哪些路径会未经工具审批写入？轮询、CI 与无提示高权限有不同分支，且并发与查询失败会削弱去重，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：让审查、GitHub 操作及 DSH 任务在同一回合衔接，见 [Q01](#research-q01)。可先单独分析差异，再由显式步骤发评论和检查，见 [Q03](#research-q03)。

同一 head 分开检查评论标记和检查记录便于修复部分失败，同时存在读后写竞态。宿主工具审批与后台扫描各有调用边界，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

哪些路径会未经工具审批写入？轮询、CI 与无提示高权限有不同分支，且并发与查询失败会削弱去重，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离 profile、测试仓库、只读令牌，先禁轮询并显式分析一个有已知规则命中的 PR。出现截断、归属错误或远端写入即停用，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可追踪宿主、审批和远端发布。仓库权限、并发去重和实际审查质量有待验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、README.md、src/index.ts、src/ci/pipeline.ts、src/client.ts、src/approval-gate.ts、src/credential.ts、src/ci/bot.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查宿主、Web 配置、审批、凭据、扫描与静态审查报告路径。未运行外部 GitHub API、发布权限或模型模式。
- 下一步：只读复核和并发发布分别在测试仓库进行，逐条回查 head、评论、检查及持久报告，见 [Q04](#research-q04)。

**分析版本**

- **仓库**：[PerryLink/dsh-github](https://github.com/PerryLink/dsh-github)
- **版本号**：0.7.28（[固定提交 dfc3906](https://github.com/PerryLink/dsh-github/tree/dfc39065e3943ea05540f22a34be4750dd902964)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

让独立发布读入绑定 head、规则版本和范围的收据，可能减少旧结论复用或重复发布。用并发和规则变更回放检验，见 [Q04](#research-q04)。

只读复核和并发发布分别在测试仓库进行，逐条回查 head、评论、检查及持久报告，见 [Q04](#research-q04)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 3047 | — | — | 34138 |
| .js | source | 19 | 4439 | 3879 | 572 | — |
| .mjs | source | 10 | 850 | 664 | 113 | — |
| .ts | source | 20 | 5834 | 4576 | 926 | — |
| .ts | test | 23 | 3659 | 3171 | 255 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/PerryLink/dsh-github/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/PerryLink/dsh-github/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/PerryLink/dsh-github/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护者能否让 DSH 辅助审查并回传 GitHub，同时控制凭据、远端写入和结论的适用范围？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类维护者能从审查接入中获益？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合在 DSH 中反复检视一批 GitHub PR 的维护者。以第三方依赖小改动为试例，合格结果是读到处理目标的 head、规则能复现的发现及明确的审查状态，维护者可回到 PR 重查实际差异。手工 gh 与普通 GitHub Actions 已能做到记录及复查。插件的增量是把 PR、issue、审查工作和可选 CI 工具放进 DSH 同一上下文，用宿主任务及审批机制连接交接。分析是固定规则或由模型另行写入的发现，零条发现无法推出测试通过。Web 入口用于配置，并不改变审查的责任归属。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:37-39](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/README.md#L37-L39)

作者描述用途和宿主接入。

```text
## 它是什么

`dsh-github` 把 GitHub 的 PR、审查、issue 与 CI 接进 agent 的回合，同时给每个写操作套上审批笼子：`pr_create`、`pr_merge`、`review_post`、`issue_close` 这类工具只有在 `ctx.approval` 得到明确同意后才会落到 GitHub。读侧（PR 元数据、截断 diff、文件、搜索、状态检查）不设审批，直接返回。后台 `/review` 在 `ctx.jobs` 上跑确定性多文件分析器，CI 侧另有一套复合动作、轮询审查机器人与状态检查门禁。token 逐操作从 credentials seam、环境变量或 `gh` CLI 解析，只进 `Authorization` 头，日志、事件、卡片、命令输出与错误消息里都看不到它。
```

**依据 2 · 源码核查**：[src/index.ts:80-113](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/src/index.ts#L80-L113)

真实工具、命令、CI 的注册与可选性。

<details>
<summary>查看原文（34行）</summary>

```text
export function applyWithDeps(ctx: Context, config: PluginConfig, deps: PluginDeps = {}) {
  // Consumer — the tool handlers consume the credentials service, the
  // optional subagents seam, and the git/gh runners assembled into `state`.
  // The subagents seam is optional at runtime although the official type
  // declares it non-optional; the cast through unknown keeps the plugin's
  // minimal structural face (see types.ts).
  const state = createState({ credentials: ctx.credentials, subagents: ctx.get('subagents') as unknown as SubagentsService | undefined }, config, deps.runGit ?? runGitCli, deps.runGh ?? runGhCli, deps.fetchImpl)

  // Service Provider — registers the GitHub tools on ctx.tools; the /pr
  // /review /issue /ci commands and the write-approval gate register through
  // the effects below.
  ctx.tools.register(prCreateTool(state))
  ctx.tools.register(prMergeTool(state))
  ctx.tools.register(prUpdateTool(state))
  ctx.tools.register(ghReviewTool(state))
  ctx.tools.register(reviewPostTool(state))
  ctx.tools.register(ghIssueTool(state))
  ctx.tools.register(issueOpenTool(state))
  ctx.tools.register(issueCommentTool(state))
  ctx.tools.register(issueCloseTool(state))
  ctx.tools.register(ghSearchTool(state))
  ctx.tools.register(ghRepoTool(state))
  ctx.tools.register(ghFileTool(state))
  ctx.tools.register(ghRepoSearchTool(state))
  ctx.tools.register(ghChecksTool(state))
  if (config.ci.enabled) {
    ctx.tools.register(ciRunTool(state))
  }

  ctx.effect(() => registerApprovalGate(ctx, state))
  ctx.effect(() => registerCommands(ctx.commands, ctx.jobs, state))
  if (config.ci.enabled) {
    ctx.effect(() => registerCiBot(ctx, ctx.commands, state))
  }
```

</details>

**依据 3 · 源码核查**：[src/ci/pipeline.ts:354-392](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/src/ci/pipeline.ts#L354-L392)

静态分析有输入上限，分析阶段先返回数据供复核。

<details>
<summary>查看原文（39行）</summary>

```text
  // The deterministic analysis runs even for an already-reviewed PR, so a
  // re-run can refresh the gate from the same inputs (zero cost, stable).
  let diffText = ''
  let truncated = false
  try {
    const text = await client.requestText('GET', `/repos/${options.repo}/pulls/${options.pr}`, { signal })
    truncated = text.text.length > maxDiffChars
    diffText = truncated ? text.text.slice(0, maxDiffChars) : text.text
  } catch (error) {
    return fail(error)
  }

  const lineFindings = analyzeDiff(diffText, maxDiffChars, { maxFindings: state.config.maxFindings, maxLineLength: state.config.maxLineLength }).findings
  const prFindings = analyzePr({
    files,
    additions,
    deletions,
    options: state.config.ci,
  })
  const staticFindings = [...prFindings, ...lineFindings]
  const extraFindings = options.task === 'publish' ? options.findings ?? [] : []
  const findings = mergeFindings(staticFindings, extraFindings)
  const verdict = verdictFor(findings, state.config.ci.failOn)

  if (options.task === 'analyze') {
    return {
      status: 'ok',
      repo: options.repo,
      pr: options.pr,
      headSha,
      verdict: 'skipped',
      engine: state.config.ci.engine,
      findings: staticFindings,
      summary: 'analysis prepared; no comments or checks were posted',
      truncated,
      alreadyReviewed: existingCheck !== undefined || commentsPosted,
      diffText,
      rateLimit,
    }
```

</details>

**依据 4 · 源码核查**：[src/client.ts:251-266](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/src/client.ts#L251-L266)

客户端注册配置项和语言。

<details>
<summary>查看原文（16行）</summary>

```text
export function apply(ctx: ClientContextLike): void {
  const t = ctx.locale.bind(NS)
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-github: card dictionaries')
  ctx.effect(() => {
    const tagId = `${NS}/card.css`
    if (document.querySelector(`style[data-plugin-css="${tagId}"]`) !== null) return () => {}
    const tag = document.createElement('style')
    tag.dataset.plugin = NS
    tag.dataset.pluginCss = tagId
    tag.textContent = CARD_CSS
    document.head.appendChild(tag)
    return () => { tag.remove() }
  }, 'dsh-github: card styles')
  ctx.slots.inject('plugins.item', () => ctx.slots.register(
    {
      name: 'plugins.item',
```

</details>

#### 缺口

- 无真实重复审查的基线数据
  **影响**：试用价值只在具体工作流中可比较
  **进一步探讨**：在一批已复核的 PR 上量化手动查找、核对与纠错时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 什么时候请求批准，什么时候会直接远端写入？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

宿主插件在 tools/pre-execute 拦截列名写工具。先查 allowedActions，未许可立即拒绝。普通会话返回 ask。CI 驱动匹配 autoApprove 时会显式允许并可把会话审批策略设为 never。普通会话如果审批策略为 never 且沙箱为 danger-full-access，也会直接允许，缺少该判定依赖则走常规路径。令牌自动模式优先已配置值，其次宿主凭据、环境和 gh。显示出的审批状态与实际 GitHub 身份需同时核对。

启用的轮询扫描和 /ci scan 命令通过调用 pipeline 发布审查与 check，扫描链在自身代码直接调用，不经过该工具前置审批。轮询限 50 个 PR 且进程内阻止重叠扫描。后台远端写入与 README「审批之外无写操作」描述存在分支差异。若只试分析，应禁轮询、只显式用 analyze，并使用仅有读取权限的凭据。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:44-49](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/src/index.ts#L44-L49)

工具、命令、任务、审批及凭据为宿主依赖。

```text
export const name = 'dsh-github'

/** Services this plugin requires; all exist in any profile built on dsh-base. */
export const inject = ['tools', 'commands', 'jobs', 'approval', 'credentials']

export { Config }
```

**依据 2 · 源码核查**：[src/approval-gate.ts:65-75](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/src/approval-gate.ts#L65-L75)

实时宿主策略可授予免提示写入。

<details>
<summary>查看原文（11行）</summary>

```text
function isUnattendedFullAccess(ctx: Context, exec: ToolExecution): boolean {
  try {
    const session = (exec.agent as unknown as { session?: unknown } | undefined)?.session
    if (session === undefined) return false
    const approval = ctx.approval as unknown as ApprovalPolicyReader
    if (approval.effectivePolicy?.(session) !== 'never') return false
    const sandbox = ctx.get('sandboxPolicy' as never) as unknown as SandboxPolicyReader | undefined
    return sandbox?.resolve?.({ session })?.mode === 'danger-full-access'
  } catch {
    return false
  }
```

</details>

**依据 3 · 源码核查**：[src/approval-gate.ts:163-185](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/src/approval-gate.ts#L163-L185)

列名写工具的允许、拒绝和询问条件。

<details>
<summary>查看原文（23行）</summary>

```text
export function registerApprovalGate(ctx: Context, state: GithubState): () => void {
  return ctx.on('tools/pre-execute', async (exec, next): Promise<PreToolDecision> => {
    if (!WRITE_TOOLS.has(exec.name)) return next()
    const action = ACTION_BY_TOOL[exec.name]
    if (action === undefined || !state.config.allowedActions.includes(action)) {
      return { kind: 'deny', reason: `dsh-github: action "${action ?? exec.name}" is not in allowedActions` }
    }
    if (state.isCiDriver && state.config.ci.autoApprove.includes(action)) {
      // The CI driver bypasses the prompt through the official policy seam:
      // pin the calling agent's approval policy to 'never' (no escalation, no
      // prompt) and allow the in-flight call. The host hands us its own Agent
      // handle, which is exactly what setPolicy declares.
      if (exec.agent !== undefined) ctx.approval.setPolicy(exec.agent, 'never')
      return { kind: 'allow' }
    }
    if (isUnattendedFullAccess(ctx, exec)) {
      // A danger-full-access session with prompts disabled cannot ask; the host
      // would reject the call and report a rejection the human never made.
      // allowedActions still gates the action before this point.
      return { kind: 'allow' }
    }
    return { kind: 'ask', reason: `dsh-github: ${askReason(exec.name, argumentsAsRecord(exec), state)}` }
  })
```

</details>

**依据 4 · 源码核查**：[src/credential.ts:72-107](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/src/credential.ts#L72-L107)

自动与指定凭据来源。

<details>
<summary>查看原文（36行）</summary>

```text
  const typed = configuredToken?.trim()
  const configured = typed === undefined || typed === '' ? undefined : typed
  const order: Array<Exclude<TokenSource, 'auto'>> =
    tokenSource === 'auto'
      ? [...(configured === undefined ? [] : (['config'] as const)), 'credentials', 'env', 'gh']
      : [tokenSource]

  for (const source of order) {
    if (source === 'config') {
      if (configured !== undefined) return { ok: true, token: { value: configured, source: 'config' } }
      continue
    }
    if (source === 'credentials') {
      let ref: ReturnType<typeof credentialRef>
      try {
        ref = credentialRef(tokenRef)
      } catch {
        return { ok: false, error: { code: 'no-token', message: `credential ref "${tokenRef}" is not a valid identifier`, guidance: NO_TOKEN_GUIDANCE } }
      }
      const resolved = await credentials.resolve(ref)
      if (resolved) return { ok: true, token: { value: resolved.value, source: 'credentials' } }
      continue
    }
    if (source === 'env') {
      const value = process.env[tokenRef]
      if (value && value.length > 0) return { ok: true, token: { value, source: 'env' } }
      continue
    }
    try {
      const { stdout } = await runGh(['auth', 'token'], signal)
      const value = stdout.trim()
      if (value.length > 0) return { ok: true, token: { value, source: 'gh' } }
    } catch {
      // gh missing or not logged in: fall through to the structured error.
    }
  }
```

</details>

**依据 5 · 源码核查**：[src/ci/bot.ts:84-131](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/src/ci/bot.ts#L84-L131)

扫描直接调用发布流水线。

<details>
<summary>查看原文（48行）</summary>

```text
  /** One pass over the open PRs: pipeline per PR under the concurrency cap. */
  const scan = async (signal?: AbortSignal): Promise<string> => {
    if (scanning) return 'a scan is already running'
    scanning = true
    const started = Date.now()
    let needsChanges = 0
    let errors = 0
    let reviewed = 0
    try {
      const token = await state.resolveToken(signal)
      if (!token.ok) {
        lastScanErrors += 1
        lastScanSummary = `scan failed: ${token.error.message}`
        ctx.logger.warn(`dsh-github ci bot: ${token.error.message}`)
        return lastScanSummary
      }
      const client = state.client(token.token.value)
      const repo = await state.resolveRepo(undefined, signal)
      if (!repo.ok) {
        lastScanErrors += 1
        lastScanSummary = `scan failed: ${repo.message}`
        ctx.logger.warn(`dsh-github ci bot: ${repo.message}`)
        return lastScanSummary
      }
      const open = await client.requestJson<OpenPullPayload[]>('GET', `/repos/${repo.repo}/pulls?state=open&per_page=${SCAN_CAP}`, { signal })
      const prs = open.data.filter(item => item.number !== undefined).slice(0, SCAN_CAP)
      const cap = state.config.ci.maxConcurrent
      const queue = [...prs]
      const workers = Array.from({ length: Math.min(cap, queue.length) }, async () => {
        for (;;) {
          const item = queue.shift()
          if (item === undefined) return
          try {
            const outcome = await runCiPipeline(state, { repo: repo.repo, pr: item.number as number, task: 'review', signal })
            if (outcome.status === 'error') {
              errors += 1
              ctx.logger.warn(`dsh-github ci bot: PR #${item.number} review failed: ${outcome.message}`)
            } else {
              reviewed += 1
              if (outcome.verdict === 'needs-changes') needsChanges += 1
              ctx.logger.info(`dsh-github ci bot: PR #${item.number} → ${outcome.verdict}${outcome.alreadyReviewed ? ' (already reviewed)' : ''}`)
            }
          } catch (error) {
            errors += 1
            ctx.logger.warn(`dsh-github ci bot: PR #${item.number} review threw: ${error instanceof Error ? error.message : String(error)}`)
          }
        }
      })
```

</details>

**依据 6 · 源码核查**：[src/ci/bot.ts:193-202](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/src/ci/bot.ts#L193-L202)

人工扫描入口复用同一调用。

<details>
<summary>查看原文（10行）</summary>

```text
    register('ci', 'CI review bot: scan PRs, publish reviews and the status-check gate', 'scan | status | start | stop | run <pr>', async (invocation) => {
      const [sub, ...rest] = invocation.rawInput.trim().split(/\s+/)
      if (sub === undefined || sub.length === 0) {
        const current = status()
        return { kind: 'success', text: `CI bot: polling ${current.polling ? `on (every ${current.intervalMs}ms)` : 'off'}\n${current.lastScanSummary}\nUsage: /ci scan | status | start | stop | run <pr>` }
      }
      if (sub === 'scan') {
        const result = await scan(invocation.signal)
        return { kind: 'success', text: result }
      }
```

</details>

**依据 7 · 作者声明**：[README.md:279-286](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/README.md#L279-L286)

作者写审批边界，需与代码中的分支对照。

```text
## 安全边界

- **审批，而非强制执行。** 写操作只在官方接缝上产生 `ask` / deny 决策；沙箱与审批系统仍是执行权威。
- **Fail closed。** 缺少审批应答者时退化为最严格决策——绝不静默放行。
- **token 不离开进程。** 逐操作读取，只写入 `Authorization` 头；从不落日志、渲染、注入或出现在错误中。
- **审批之外无写操作。** `/pr create` 自己从不 commit / push；`autoCommit: true` 时模型经 bash 工具自身的审批门执行这些写操作。审查 job 零写操作；只有 `review_post` 在审批后发布。
- **不可信内容被转义与标记。** `formatPostBody` 对 diff 派生的文件名做反引号与 HTML 转义，外部 GitHub 内容（文件、正文、评论、搜索结果）在渲染中被标记为外部内容。
- **有界工作与配额。** 429 带退避重试；剩余配额在包括失败在内的每个结果上对模型可见。
```

#### 缺口

- 未验证目标宿主 approval 版本或仓库权限
  **影响**：无法保证配置下所有写入都获得预期审计结果
  **进一步探讨**：只在隔离仓库验证工具拒绝、手工扫描和 CI 驱动三条路径

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 重跑是怎样去重的，会留下什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

流水线先读当前 head，再按该 head 查有无 completed 检查，按审查正文内 head 标记查有无评论。各自存在时复用。读 API 的错误会降级为未发现，因此可出现重复。标记读取只有每页 100 条，且读后发没有跨进程原子性。评论先发，检查后发，中断可留下部分状态。重复运行的成功判据应是同一仓库、PR 与 head 对应的远端回读，而非本地单条结论。

差异文本受字符预算，分析仍可输出已读片段的规则结果。已有 completed check 时使用旧 conclusion，因而同一提交上的新规则和发现可能与旧结论不同。review/publish 可写 JSON 和 Markdown 到报告目录，固定文件名意味着同目录并发的副本不足以作为逐 PR 历史。退出工具后，已写 GitHub 的内容和报告需独立处理。

#### 证据与依据

**依据 1 · 源码核查**：[src/ci/pipeline.ts:195-210](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/src/ci/pipeline.ts#L195-L210)

输出目录与固定文件名。

<details>
<summary>查看原文（16行）</summary>

```text
function reportDirectory(state: GithubState): string {
  const fromEnv = process.env.DSH_GITHUB_CI_OUTPUT_DIR?.trim()
  if (fromEnv !== undefined && fromEnv.length > 0) return fromEnv
  if (state.config.ci.reportDir.trim().length > 0) return state.config.ci.reportDir
  return state.workspaceDir
}

/** Write the JSON + Markdown reports and, when present, `$GITHUB_OUTPUT` lines. */
function writeReports(state: GithubState, result: CiRunResult): { json: string; markdown: string } {
  const dir = reportDirectory(state)
  mkdirSync(dir, { recursive: true })
  const jsonPath = join(dir, 'dsh-github-ci-result.json')
  const markdownPath = join(dir, 'dsh-github-ci-summary.md')
  writeFileSync(jsonPath, JSON.stringify({ schemaVersion: 1, ...result, files: { json: jsonPath, markdown: markdownPath } }, null, 2) + '\n')
  writeFileSync(markdownPath, formatMarkdownReport(result, { blocking: state.config.ci.blocking, checkName: state.config.ci.checkName }) + '\n')
  const outputFile = process.env.GITHUB_OUTPUT
```

</details>

**依据 2 · 源码核查**：[src/ci/pipeline.ts:331-366](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/src/ci/pipeline.ts#L331-L366)

先查询检查与标记，查询失败降级，文本截断。

<details>
<summary>查看原文（36行）</summary>

```text
  // Idempotency: a completed check run for this head commit means the gate was
  // already published; a review-body marker means comments were already posted.
  // The marker scan always runs (not only when the check is missing), so a
  // rerun after a comment-only failure can repair the comments without
  // duplicating them.
  let existingCheck: CheckRunPayload | undefined
  let commentsPosted = false
  try {
    const checkName = encodeURIComponent(state.config.ci.checkName)
    const response = await client.requestJson<{ check_runs?: CheckRunPayload[] }>('GET', `/repos/${options.repo}/commits/${headSha}/check-runs?check_name=${checkName}`, { signal })
    existingCheck = (response.data.check_runs ?? []).find(run => run.status === 'completed')
  } catch {
    existingCheck = undefined
  }
  if (postComments) {
    try {
      const response = await client.requestJson<ReviewPayload[]>('GET', `/repos/${options.repo}/pulls/${options.pr}/reviews?per_page=100`, { signal })
      commentsPosted = response.data.some(review => hasReviewMarker(review.body, headSha))
    } catch {
      commentsPosted = false
    }
  }

  // The deterministic analysis runs even for an already-reviewed PR, so a
  // re-run can refresh the gate from the same inputs (zero cost, stable).
  let diffText = ''
  let truncated = false
  try {
    const text = await client.requestText('GET', `/repos/${options.repo}/pulls/${options.pr}`, { signal })
    truncated = text.text.length > maxDiffChars
    diffText = truncated ? text.text.slice(0, maxDiffChars) : text.text
  } catch (error) {
    return fail(error)
  }

  const lineFindings = analyzeDiff(diffText, maxDiffChars, { maxFindings: state.config.maxFindings, maxLineLength: state.config.maxLineLength }).findings
```

</details>

**依据 3 · 源码核查**：[src/ci/pipeline.ts:395-433](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/src/ci/pipeline.ts#L395-L433)

先发评论后发检查，既有结论复用。

<details>
<summary>查看原文（39行）</summary>

```text
  let review: ReviewPostValue | undefined
  if (postComments && !commentsPosted) {
    const inline = findings.filter(finding => finding.line !== null).slice(0, state.config.maxFindings)
    const prLevel = findings.filter(finding => finding.line === null)
    try {
      const posted = await client.requestJson<{ id?: number; html_url?: string }>('POST', `/repos/${options.repo}/pulls/${options.pr}/reviews`, {
        signal,
        body: {
          body: buildReviewBody(headSha, prLevel, options.body, truncated),
          event: 'COMMENT',
          ...inline.length > 0 ? {
            comments: inline.map(finding => ({
              path: finding.file,
              line: finding.line,
              body: `**${finding.severity}** \`${finding.rule}\`: ${finding.message}`,
            })),
          } : {},
        },
      })
      review = { url: posted.data.html_url ?? '', inlineComments: inline.length }
    } catch (error) {
      return fail(error)
    }
  } else if (postComments) {
    review = { url: '', inlineComments: 0 } // already posted at this head commit
  }

  let checkRun: CheckRunValue | undefined
  if (postCheck && existingCheck === undefined) {
    checkRun = await publishCheck(client, options.repo, headSha, state, verdict, findings.length, summarize(verdict, findings, truncated))
  } else if (existingCheck !== undefined) {
    checkRun = {
      id: existingCheck.id ?? 0,
      url: existingCheck.html_url ?? '',
      conclusion: existingCheck.conclusion ?? '',
    }
  }

  const effectiveVerdict = existingCheck !== undefined ? verdictFromConclusion(existingCheck.conclusion) : verdict
```

</details>

#### 缺口

- 未做并发发布或漏页对照
  **影响**：不能承诺每个 head 只会发布一次
  **进一步探讨**：模拟两个启动器同时读取空标记并回查真实评论和检查

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试验成本、停止条件和可能的改进？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

先在测试仓库准备已知静态规则命中及一个需要人工判断的变更。关闭轮询，用只读凭据明确发 analyze，对照手工 gh 获取和当前项目检查。记录接入凭据与 profile 的时间、API 调用、报告排查以及模型审查如启用时额外的 token。以确认发现覆盖、正确 head 和零远端更改为试用验收。如果出现截断、身份不明、远端产生意外记录或重复发布，应停止并回到既有流程。

可在隔离仓库进一步测试先生成绑定 head、规则版本和范围的本地收据，由另一显式步骤上传。推测能让旧结论被错误复用的概率下降。对照同一 head 并发执行及规则变更情形，回读重复评论数量和对账用时。若要额外维护凭据和收据且漏报或重复没有改善，应放弃该设计，效果未验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/ci/pipeline.ts:375-392](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/src/ci/pipeline.ts#L375-L392)

分析阶段返回发现和范围，不发布评论或 check。

<details>
<summary>查看原文（18行）</summary>

```text
  const findings = mergeFindings(staticFindings, extraFindings)
  const verdict = verdictFor(findings, state.config.ci.failOn)

  if (options.task === 'analyze') {
    return {
      status: 'ok',
      repo: options.repo,
      pr: options.pr,
      headSha,
      verdict: 'skipped',
      engine: state.config.ci.engine,
      findings: staticFindings,
      summary: 'analysis prepared; no comments or checks were posted',
      truncated,
      alreadyReviewed: existingCheck !== undefined || commentsPosted,
      diffText,
      rateLimit,
    }
```

</details>

**依据 2 · 源码核查**：[src/ci/pipeline.ts:395-433](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/src/ci/pipeline.ts#L395-L433)

真实发布及旧检查复用的边界。

<details>
<summary>查看原文（39行）</summary>

```text
  let review: ReviewPostValue | undefined
  if (postComments && !commentsPosted) {
    const inline = findings.filter(finding => finding.line !== null).slice(0, state.config.maxFindings)
    const prLevel = findings.filter(finding => finding.line === null)
    try {
      const posted = await client.requestJson<{ id?: number; html_url?: string }>('POST', `/repos/${options.repo}/pulls/${options.pr}/reviews`, {
        signal,
        body: {
          body: buildReviewBody(headSha, prLevel, options.body, truncated),
          event: 'COMMENT',
          ...inline.length > 0 ? {
            comments: inline.map(finding => ({
              path: finding.file,
              line: finding.line,
              body: `**${finding.severity}** \`${finding.rule}\`: ${finding.message}`,
            })),
          } : {},
        },
      })
      review = { url: posted.data.html_url ?? '', inlineComments: inline.length }
    } catch (error) {
      return fail(error)
    }
  } else if (postComments) {
    review = { url: '', inlineComments: 0 } // already posted at this head commit
  }

  let checkRun: CheckRunValue | undefined
  if (postCheck && existingCheck === undefined) {
    checkRun = await publishCheck(client, options.repo, headSha, state, verdict, findings.length, summarize(verdict, findings, truncated))
  } else if (existingCheck !== undefined) {
    checkRun = {
      id: existingCheck.id ?? 0,
      url: existingCheck.html_url ?? '',
      conclusion: existingCheck.conclusion ?? '',
    }
  }

  const effectiveVerdict = existingCheck !== undefined ? verdictFromConclusion(existingCheck.conclusion) : verdict
```

</details>

**依据 3 · 源码核查**：[src/ci/bot.ts:212-220](https://github.com/PerryLink/dsh-github/blob/dfc39065e3943ea05540f22a34be4750dd902964/src/ci/bot.ts#L212-L220)

轮询控制和禁用入口。

```text
      if (sub === 'start') {
        if (state.config.ci.pollIntervalMs === 0) {
          return { kind: 'error', text: 'ci.pollIntervalMs is 0: set a positive interval in cordis.yml to enable polling (or keep using /ci scan on demand).' }
        }
        setPolling(true)
        return { kind: 'success', text: `CI bot polling enabled (every ${state.config.ci.pollIntervalMs}ms). Set ci.pollIntervalMs to 0 to disable at boot.` }
      }
      if (sub === 'stop') {
        setPolling(false)
```

#### 缺口

- 没有宿主运行、API 配额和真实误报实验
  **影响**：不具备启用必需状态检查的依据
  **进一步探讨**：在小范围只读评审后再独立对照写入收据

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
