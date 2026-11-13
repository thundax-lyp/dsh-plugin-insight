# dsh-agy-link

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3eba8ef](https://github.com/amlyczz/dsh-agy-link/tree/3eba8eff3c993e493a1227a0978004e0f2bd7274)

<!-- BEGIN META -->
[![GitHub ★ 171](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=171&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/amlyczz/dsh-agy-link) [![npm 30d 19,331](https://img.shields.io/static/v1?label=npm+30d&message=19%2C331&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agy-link) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agy-link)
<!-- END META -->

> **功能**：把 Google Antigravity CLI 的模型、流式输出和账号操作接入 DeepSeek Harness。

> **亮点**：[Q01](#research-q01) 的流式适配将 CLI 工具活动接到 DSH 会话，并复用记录支持工具续接。[Q02](#research-q02) 看到按账号探测并刷新的目录，在存在有效账号目录时能减少混入其他账号的模型。上游模型和服务资格仍由 agy 提供。

> **主要限制**：[Q03](#research-q03) 的导入成功与平台凭据写回可能分离，[Q04](#research-q04) 的本地文件端点可按绝对路径查找。结合 [Q05](#research-q05) 的默认跳过权限确认，现有证据只支持隔离核查，不足以在常用 profile 导入凭据。

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
  - [Q01 · 与在终端直接调用 agy 相比，DSH 适配器增加了什么，失败时怎样续接？](#detail-section-11)
  - [Q02 · 切换账号后模型选择器是否只会显示该账号可运行的模型？](#detail-section-12)
  - [Q03 · token 导入、备份自愈与槽位释放能保证账号恢复到原状吗？](#detail-section-13)
  - [Q04 · 会话媒体预览和打开本地文件的路由会触及哪些路径？](#detail-section-14)
  - [Q05 · 当前适合哪些用户观察或试用，进入采用前要核对什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 agy 环境且反复在 DSH 会话使用对应模型的开发者，可以在同一会话选择模型、检查工具反馈并切换账号。

直接运行 agy 可使用同样的外部模型和权限模式，用户需要自行切换终端、转述提示和管理账号。DSH 原有供应商界面是适配器接入的基础。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| LLM 适配器 | 从 DSH 调用 agy 并呈现工具活动 | 依赖 CLI 和授权，重试未验证幂等 |
| 账号与目录 | 按账号探测模型、导入凭据 | 冷缓存可出现备用模型，凭据恢复须另验 |
| Web 媒体 | 预览本地媒体或调用系统打开器 | 需核对宿主对路由的权限和访问范围 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 24 与 DSH 的 LLM 和命令服务 | 是 | 挂载供应商适配器 | 保留直接 CLI |
| 本地 agy、合法授权及网络 | 真实调用需要 | 执行模型与探测目录 | 错误可能保留旧目录 |
| 隔离 HOME 和本机权限检查 | 本研究建议的验证前提 | 限制凭据与文件影响 | 不在常用环境导入账号 |

#### 操作流程

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 建立基准 | 开发者 | 保留直接 agy 流程，在隔离 profile 记录 Node 与宿主 | 环境不隔离则停在观察 |
| 核对权限 | 开发者 | 确认实际 CLI 参数、监听和端点访问 | 预期外路径可读时停止 |
| 核对账号 | 开发者 | 先用假账号检查目录和写回回执 | 可见模型和实际账号不符时先查缓存 |
| 退出 | 开发者 | 禁用插件并按需清理测试凭据及备份 | 回到原 CLI |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | CLI、账号与网络，价格未知 | 准备隔离环境及授权 | 宿主兼容未实测 |
| 持续 | 模型调用、探测与失败重试 | 维护账号、目录与网络 | 单位任务开销未测 |
| 失败恢复 | 凭据备份及重试资源 | 核查平台槽、令牌写回和路由 | 失败回执可能不足 |
| 退出 | 保留必要的隔离测试记录 | 禁用并清理测试凭据副本 | 实际退出未验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 原会话模型调用 | 适配器与流式续接 | 真实任务成功率 |
| 账号模型切换 | 已探测目录及更新广播 | 冷缓存误选和刷新延迟 |
| 媒体预览 | 媒体流和系统打开 | 远程宿主访问控制 |

> **思考**：[Q03](#research-q03) 的导入成功与平台凭据写回可能分离，[Q04](#research-q04) 的本地文件端点可按绝对路径查找。结合 [Q05](#research-q05) 的默认跳过权限确认，现有证据只支持隔离核查，不足以在常用 profile 导入凭据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的流式适配将 CLI 工具活动接到 DSH 会话，并复用记录支持工具续接。[Q02](#research-q02) 看到按账号探测并刷新的目录，在存在有效账号目录时能减少混入其他账号的模型。上游模型和服务资格仍由 agy 提供。

[Q01](#research-q01) 的工具游标续接和失败分类有助于明确适配器责任。[Q02](#research-q02) 的账号目录已分离配额观察，缓存回退还需可见状态。[Q03](#research-q03) 的单次释放有利于防止重复回收，平台恢复仍应做故障注入。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的导入成功与平台凭据写回可能分离，[Q04](#research-q04) 的本地文件端点可按绝对路径查找。结合 [Q05](#research-q05) 的默认跳过权限确认，现有证据只支持隔离核查，不足以在常用 profile 导入凭据。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议已有 agy 环境的开发者先观察隔离流程，具体核对 [Q03](#research-q03) 的凭据写回与 [Q04](#research-q04) 的路径范围。任何权限或账号验证有缺口时保留直接 CLI。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持流式供应商适配、模型目录和账号操作。账号冷切换一致性、宿主路由权限及凭据恢复均未完成真实验证。目录来源提示是待验证设计。

- 已检查：作者 README、包清单、源码路径 CHANGELOG.md、cordis.patch.yml、package.json、src/client/index.ts、src/domain/credentials/backup.ts、src/host/adapter.ts、src/host/media-route.ts、src/host/models.ts、src/host/pool-auth.ts、src/index.ts、src/provider/attempt.ts、src/provider/failure.ts、src/provider/model-resolution.ts、src/transport/http/routes/media.ts、src/transport/http/routes/pool.ts、tsdown.config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读根包宿主注册、流式续接、模型目录、凭据导入备份和 Web 文件端点。未穷尽所有工具镜像、图像与翻译分支，未审计宿主路由鉴权。
- 下一步：在隔离环境先用假的 agy CLI 和凭据后端进行冷切换、写失败与路由越界对照；验证作用边界后，再在获授权的实际环境测真实账号。

**分析版本**

- **仓库**：[amlyczz/dsh-agy-link](https://github.com/amlyczz/dsh-agy-link)
- **版本号**：0.6.21（[固定提交 3eba8ef](https://github.com/amlyczz/dsh-agy-link/tree/3eba8eff3c993e493a1227a0978004e0f2bd7274)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q02](#research-q02) 提出标记模型目录来源与探测阶段，并将选择时的账号和执行账号绑定到可核对的记录。比较冷切换误选率和额外等待后再决定是否显示或限制备用目录。

在隔离环境先用假的 agy CLI 和凭据后端进行冷切换、写失败与路由越界对照；验证作用边界后，再在获授权的实际环境测真实账号。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 26 | 4924 | — | — | 107418 |
| .mjs | source | 5 | 563 | 441 | 82 | — |
| .mts | source | 3 | 198 | 154 | 23 | — |
| .ts | source | 208 | 37070 | 28338 | 6383 | — |
| .ts | test | 67 | 23836 | 19912 | 1881 | — |
| .mjs | test | 1 | 358 | 274 | 72 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/amlyczz/dsh-agy-link/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=25&color=737b86&logo=github)](https://github.com/amlyczz/dsh-agy-link/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=25&color=737b86&logo=github)](https://github.com/amlyczz/dsh-agy-link/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有合法 agy 环境的 DSH 用户，能否在保留原工作流的同时获得可解释的模型切换，以及怎样控制接入新增的权限面？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 与在终端直接调用 agy 相比，DSH 适配器增加了什么，失败时怎样续接？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

已有 agy 账号并在 DSH 会话中开发的人，可在原模型选择器发起调用，保留工具过程和会话。对比切到终端运行 agy 再手工复制结果，增量是将真实 CLI 输出和工具进度纳入 DSH 的适配器契约，而模型、账号资格及上游工具权限仍由外部 CLI 和服务决定。宿主通过 ctx.llm 注册 adapter，调用解析会话与工作目录，构造 stream-json 参数。权限设为 skip 时传危险跳过确认标记，其他模式转交 CLI 的 --mode 参数。

工具镜像完成后，适配器按末尾工具结果识别原运行和事件游标，正常情况下续读同一记录；失败记录只有命中特定账号级错误和预算才放弃旧记录并重新准备调用。若宿主重启导致内存记录丢失，代码退回组装新提示。错误分类区分网络导致的表面认证错误、真正认证失败和硬额度与上游过载；这为针对性退避或账号切换提供依据。代码中重走调用的分支意味着有副作用的任务仍需检查已有结果，当前证据无法证明外部操作幂等。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:89-107](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/index.ts#L89-L107)

宿主注册适配器及用户命令。

<details>
<summary>查看原文（19行）</summary>

```text
  catalogPollTimer.unref?.()
  ctx.effect(() => () => clearInterval(catalogPollTimer))

  // ---- llm registration (dormant-safe) ----
  if (getConfig().enabled) {
    try {
      ctx.llm.registerAdapter([PROVIDER_ID], adapter)
      log('registered provider route: ' + PROVIDER_ID)
    } catch (e) {
      log('adapter registration failed: ' + String(e))
    }
  }
  // NOTE: no registerConfigurableProviders call. This plugin configures
  // through its own cordis entry (enabled/agyBin/mode/...), not the llm
  // settings directory; registering here would put an unconfigured
  // antigravity into the provider-add list and confuse the UI state.

  // ---- /agy command ----
  ctx.commands.register(
```

</details>

**依据 2 · 源码核查**：[src/host/adapter.ts:213-225](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/host/adapter.ts#L213-L225)

调用解析会话、二进制及工作目录。

<details>
<summary>查看原文（13行）</summary>

```text
  private async *streamAttempt(options: AgyGenerateOptions, suppressEffort = false): AsyncIterable<StreamChunk> {
    const ctx = resolveCallContext({
      options,
      cfg: this.deps.getConfig(),
      bin: this.deps.bin(),
      ...(this.deps.sessionCwd === undefined
        ? {}
        : { sessionCwd: (id: string) => this.deps.sessionCwd?.(id) }),
      warnOnce: (key: string, message: string) => this.warnOnce(key, message),
    })
    const { cfg, bin, isReview, isTitle, isCompaction, isTranslate, isImage, isAux } = ctx
    const { permissionMode, sessionKey, workspaceRoot, isCodeMode, hasToolSupport } = ctx
    const policy = purposePolicy(ctx)
```

</details>

**依据 3 · 源码核查**：[src/provider/attempt.ts:108-129](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/provider/attempt.ts#L108-L129)

生成 CLI 参数及权限模式。

<details>
<summary>查看原文（22行）</summary>

```text
  const ptMins = opts.printTimeoutMinutes ?? Math.max(1, Math.ceil(opts.timeoutMs / 60_000))
  const args: string[] = ['--output-format', 'stream-json', '--print-timeout', ptMins + 'm']
  if (opts.permissionMode === 'skip') args.push('--dangerously-skip-permissions')
  else args.push('--mode', opts.permissionMode)
  const effectiveModel = resolveModelSlug(opts.model)
  if (effectiveModel !== '') args.push('--model', effectiveModel)
  // Claude 5.5 accepts --effort on its base slug (verified against agy 1.5.3);
  // a tiered slug plus the flag is rejected upstream, so callers must pass the
  // base slug here — the catalog folds the tiers for exactly that reason.
  const effortModel = effectiveModel.toLowerCase()
  // Claude 5.5 only: 4.6 keeps its documented no-effort behaviour.
  const isEffortCapable = effectiveModel === '' || effortModel.startsWith('gemini') || effortModel.startsWith('argon') || /^claude-(?:sonnet|opus)-5-5$/.test(effortModel)
  if (isEffortCapable && opts.effort && opts.effort !== '') args.push('--effort', opts.effort)
  if (opts.conversationId) args.push('--conversation', opts.conversationId)
  for (const d of opts.addDirs ?? []) args.push('--add-dir', d)
  args.push(...opts.extraArgs)
  if (opts.promptViaStdin) {
    args.push('--input-format', 'stream-json')
  } else {
    args.push('-p', opts.prompt)
  }
  return args
```

</details>

**依据 4 · 源码核查**：[src/host/adapter.ts:250-287](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/host/adapter.ts#L250-L287)

按记录游标续读、按错误与预算回退。

<details>
<summary>查看原文（38行）</summary>

```text
    // ---- native tool mirroring: continuation spans (v0.3) ----
    // When the previous span cut on a completed agy tool step, DSH dispatched
    // the agy_tool mirror (which replayed the recorded output) and is now
    // calling us again to continue the SAME run. Resume the recording from
    // the cursor encoded in the trailing tool-result callId — no new process,
    // no prompt assembly, no digest.
    const continuation = detectContinuation(options.messages)
    if (continuation !== null) {
      const rec = this.deps.runs.get(continuation.runId)
      // A SETTLED recording that ended in an ACCOUNT-scoped failure must not be
      // re-driven: DSH re-issues the same step (same trailing tool result), so
      // resuming it merely replays the identical failure. That is why quota
      // exhaustion AFTER a tool call used to dead-end the turn while a healthy
      // account sat idle — the fix is to forget the dead run and fall through,
      // which re-assembles the prompt and re-selects an account.
      //
      // Only account-scoped codes qualify, and only up to the pool's spare
      // depth: a deterministic failure (or a pool with nothing left to try)
      // must still surface as the turn's error instead of re-running the work
      // forever on rotating accounts.
      const deadFailure = rec !== undefined && rec.isSettled ? rec.failureInfo : null
      if (rec !== undefined && !(deadFailure !== null && this.claimFailover(sessionKey, deadFailure.code))) {
        yield* driveSpanImpl(this.deps, rec, continuation.eventIndex + 1, hasToolSupport, isCodeMode, goalContext, supportsGoalUpdate, supportsPlanExit, options.signal)
        return
      }
      if (rec !== undefined) {
        this.deps.runs.forget(continuation.runId)
        this.warnOnce(
          'dead-continuation:' + continuation.runId,
          'agy run ' + continuation.runId + ' settled in ' + (deadFailure?.code ?? '') + ' — retrying this step instead of replaying it'
            + (deadFailure?.code === Err.NETWORK && this.sharesSingleEgress() ? ' on the same account (shared egress)' : ' on another account'),
        )
      } else {
        this.warnOnce(
          'stale-continuation:' + continuation.runId,
          'agy run ' + continuation.runId + ' is no longer available in memory (server restarted?) — falling back to fresh turn prompt assembly',
        )
      }
```

</details>

**依据 5 · 源码核查**：[src/provider/failure.ts:61-98](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/provider/failure.ts#L61-L98)

认证、网络、硬额度与容量错误分类。

<details>
<summary>查看原文（38行）</summary>

```text
    } else if (!c.consumable) {
      if (c.sawAuthFailure) {
        // agy says "not logged in" both for a real sign-out AND when it cannot
        // validate a good token over a broken network (observed live: the
        // retry account had a token that expired 9 minutes earlier, its refresh
        // died on `Post https://oauth2.googleapis.com/token: EOF`, and agy fell
        // back to "not logged in and no controlling terminal"). Reporting AUTH
        // there ends the turn on a healthy account AND DSH renders the AUTH
        // code as "API key is invalid" — a label that sent users hunting for a
        // credential that was never the problem.
        return c.transportFailure
          ? {
              kind: 'error',
              code: Err.NETWORK,
              message: 'agy could not validate its Google login over the network (transport failure'
                + (c.keyringJitter ? '; its own log shows keyring auth timing out on the network, not a sign-out' : '')
                + ', not a sign-out) — retrying on another account. '
                + (c.rawErrText !== '' ? brief(c.rawErrText) : ''),
            }
          : { kind: 'error', code: Err.AUTH, message: 'agy is not signed in — run /agy auth (or run agy once in a terminal) to login' }
      } else if (c.isRateLimit) {
        const bestMsg = c.parser.stats.lastResultError || (c.outcome.stderrTail ? brief(c.outcome.stderrTail) : 'Rate limit or quota reached')
        // Two different animals:
        //  - HARD server refusal (429 / quota reached): the account is spent, so
        //    it is cooled down and the sticky pointer advances; the retry is
        //    served by the next account.
        //  - SOFT capacity signal ("model overloaded" / high traffic): Google-side
        //    capacity pressure. Nothing was spent locally, so no cooldown — and the
        //    scheduler STAYS on the current account with backoff retry rather than rotating,
        //    preventing temporary server bursts from burning through all healthy accounts.
        const hard = looksLikeHardRateLimit(c.rawErrText)
        return {
          kind: 'error',
          code: hard ? Err.RATE_LIMIT : Err.OVERLOADED,
          message: hard
            ? 'Google Antigravity quota / rate limit reached: ' + bestMsg
            : 'Google Antigravity quota / rate limit reached (server capacity overloaded): ' + bestMsg,
        }
```

</details>

#### 缺口

- 未运行真实流式调用和带副作用的断线续接。
  **影响**：当前只能证明分支设计，不能保证调用恢复或无重复外部操作。
  **进一步探讨**：用隔离 CLI fixture 在工具前后注入错误，核对事件、取消和实际子进程数，再到授权的真实宿主复核。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 切换账号后模型选择器是否只会显示该账号可运行的模型？

**研究主题**：功能与机制、缺陷与关键质疑、新假设与验证

#### 完整回答

只有账号已有非空、已探测目录时，getModelsForAccount 直接返回该账号数据。否则会取全局已探测目录并按 Argon 资格过滤，或者采用静态备用目录。切换路由更新活跃账号后先广播一次，再后台探测并再次广播，HTTP 成功只证明活跃指针切换。探测无结果或报错会保留已有目录并记录错误。因此稳定命中账号缓存时隔离更具体，冷启动、切换刚完成或网络失败时仍可看到其他暂存模型。调用侧也把目录当提示，解析器可接受未知模型 ID，实际可调用与选择器展示应分别核对。

一个待验证方案是显示“账号探测中／已探测／备用”，将目录来源和选择时账号同实际执行账号关联；切换时保留原有响应速度，同时将尚未证实的模型标为待确认。可用两账号目录不同、一账号探测失败的模拟输入对照当前行为和原型。若误选与失败重试未减少，或因等待造成的任务失败更多，说明显示策略不值成本。

#### 证据与依据

**依据 1 · 作者声明**：[CHANGELOG.md:21-34](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/CHANGELOG.md#L21-L34)

作者主张账号范围和即时同步，需结合冷启动分支核查。

<details>
<summary>查看原文（14行）</summary>

```text
## 0.6.21 (2026-11-12)

### English

- **Fix(catalog, models): Strict real model discovery from `agy models` CLI, account-scoped catalog isolation & eliminated quota pollution.**
  - **Authoritative CLI Discovery**: Completely removed `acc.quotas` injection into runnable model catalogs. Quota buckets (such as `gemini-2.5-flash-thinking`, `gemini-3.8-flash-tiered`, and duplicate `Gemini 3.5 Flash Lite` entries returned by Google Cloud quota APIs) are strictly restricted to quota telemetry and never treated as runnable LLM models.
  - **Account-Scoped Catalog Isolation (`getModelsForAccount`)**: The DSH model picker and Settings panel ("Model visibility") now reflect strictly the active account's models discovered from `agy models`. Claude 4.6 and Claude 5.5 no longer cross-pollinate, and Argon is only shown on Argon-eligible accounts.
  - **Real-Time Account Switch Synchronization**: Switching accounts immediately resolves and refreshes the target account's catalog, updating both the picker and the settings panel with zero redundancy and no ghost models.

### 中文

- **修复(目录与模型)：严格从真实 `agy models` 提取模型列表、账号专属目录隔离与彻底根除配额分桶污染。**
  - **真实 CLI 权威探测**：彻底移除 `getAllKnownModels()` 中对 `acc.quotas` 配额分桶的合流读取。Google Cloud 配额接口返回的内部资源分桶（如 `gemini-2.5-flash-thinking`、`gemini-3.8-flash-tiered` 以及重复命名的 4 个 `Gemini 3.5 Flash Lite`）严格仅用于额度条展示，绝不再当作可运行 LLM 模型混入目录。
  - **账号专属目录隔离（`getModelsForAccount`）**：DSH 右下角模型选择器与设置面板“模型显示”直接绑定当前活动账号通过 `agy models` 真实探查到的模型列表。主账号（Claude 5.5 + Argon）与子账号（Claude 4.6，无 Argon）彻底实现互不污染，消除跨账号冗余。
```

</details>

**依据 2 · 源码核查**：[src/host/models.ts:308-325](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/host/models.ts#L308-L325)

命中账号目录与两种回退分支。

<details>
<summary>查看原文（18行）</summary>

```text
  getModelsForAccount(acc: ManagedAccount, pool?: AccountPoolManager | null): readonly CatalogEntry[] {
    const accountCat = this.accountCatalogs.get(acc.id)
    if (accountCat && accountCat.source === 'discovered' && accountCat.models.length > 0) {
      return accountCat.models
    }

    const hasArgon = accountHasArgon(acc, pool, this.current)
    if (this.current.source === 'discovered' && this.current.models.length > 0) {
      return this.current.models.filter((m) => {
        if (isArgonModel(m.id) && !hasArgon) return false
        return true
      })
    }

    return buildFallbackCatalog(this.fallbackDefs).filter((m) => {
      if (isArgonModel(m.id) && !hasArgon) return false
      return true
    })
```

</details>

**依据 3 · 源码核查**：[src/host/models.ts:402-436](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/host/models.ts#L402-L436)

成功缓存及无条目、失败时保留策略。

<details>
<summary>查看原文（35行）</summary>

```text
          const newCatalog: Catalog = { source: 'discovered', models: newModels, discoveredAt: Date.now() };
          const prev = this.get(accountId);
          const changed =
            prev.source !== 'discovered' ||
            prev.models.length !== newModels.length ||
            prev.models.some((m, i) => m.id !== newModels[i]?.id);
          if (accountId) {
            this.accountCatalogs.set(accountId, newCatalog);
            if (this.current.source !== 'discovered') {
              this.current = newCatalog;
            }
          } else {
            this.current = newCatalog;
          }
          if (changed && announce) {
            this.onUpdate?.();
          }
          return;
        }
        if (accountId) {
          const cat = this.accountCatalogs.get(accountId);
          if (cat) cat.lastError = 'agy models returned no entries';
        } else {
          this.current = { ...this.current, lastError: 'agy models returned no entries' };
        }
      } finally {
        clearTimeout(timer);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (accountId) {
        const cat = this.accountCatalogs.get(accountId);
        if (cat) cat.lastError = errMsg;
      } else {
        this.current = { ...this.current, lastError: errMsg };
```

</details>

**依据 4 · 源码核查**：[src/provider/model-resolution.ts:29-58](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/provider/model-resolution.ts#L29-L58)

选择器按活跃账号取列表并后台补探测。

<details>
<summary>查看原文（30行）</summary>

```text
export function listAvailableModels(deps: ModelResolutionDeps): readonly LlmModelInfo[] {
  const pool = deps.pool
  const accounts = pool ? pool.getAccounts().filter((a) => a.enabled) : []
  const cfg = deps.getConfig()
  const activeAcc = activeAccount(deps)

  // When an active account is selected, the picker shows only the models supported
  // by that specific account (e.g. an account without Argon access will not display
  // Argon in its picker). If no active account is resolved, falls back to the union.
  let models: readonly CatalogEntry[]
  if (activeAcc && pool) {
    models = deps.catalog.getModelsForAccount(activeAcc, pool)
    if (!deps.catalog.hasAccountCatalog(activeAcc.id)) {
      void deps.catalog.forceRefreshAndNotify(activeAcc.id).catch(() => undefined)
    }
  } else {
    models = deps.catalog.getUnion(accounts, pool)
  }

  const { entries, dropped } = sanitizeCatalogEntries(models)
  if (dropped.length > 0) {
    deps.warnOnce(
      'catalog-dupes',
      'model catalog contained duplicate ids [' + dropped.join(', ') + '] — kept first occurrence so DSH does not drop the whole provider group (INVALID_CATALOG)',
    )
  }
  const hidden = new Set(cfg.hiddenModels.map((s) => s.trim()))
  return entries
    .filter((m) => !hidden.has(m.id))
    .map((m) => ({
```

</details>

**依据 5 · 源码核查**：[src/transport/http/routes/pool.ts:287-304](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/transport/http/routes/pool.ts#L287-L304)

切换先广播，后台探测未参与 HTTP 确认。

<details>
<summary>查看原文（18行）</summary>

```text
  const { pool, catalog, notifyPicker } = services
      void (async () => {
        if (methodOf(req) !== 'POST') {
          sendJson(res as RawRes, 405, { error: 'POST only' })
          return
        }
        const body = await readBody(req)
        const id = typeof body.id === 'string' ? body.id : ''
        const ok = id !== '' && pool.setActiveAccount(id)
        if (ok) {
          notifyPicker()
          if (typeof catalog.forceRefreshAndNotify === 'function') {
            void catalog.forceRefreshAndNotify(id).catch(() => undefined)
          } else if (typeof catalog.forceRefresh === 'function') {
            void catalog.forceRefresh(id).catch(() => undefined)
          }
        }
        sendJson(res as RawRes, ok ? 200 : 400, { ok, pool: pool.getPoolData() })
```

</details>

**依据 6 · 源码核查**：[src/host/adapter.ts:292-313](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/host/adapter.ts#L292-L313)

实际执行接受未知模型 ID，目录只是辅助。

<details>
<summary>查看原文（22行）</summary>

```text
    const catalog = this.deps.catalog.get()
    const rawModel = options.model
    const model = resolveModelSlug(rawModel)
    const entry = findEntry(catalog, model)
    const isGemini = (model === '' ? cfg.defaultModel : model).toLowerCase().startsWith('gemini')
    // The catalog is advisory (the fallback list may be stale): accept unknown
    // ids, but validate explicit reasoning efforts against known entries.
    let effort: string | undefined
    if (isGemini && !suppressEffort) {
      if (this.isEffortUnsupported(model)) {
        // agy told us this model takes no --effort (issue #67). Asking again
        // would fail the whole invocation, so the flag is dropped silently —
        // the requested level is simply not selectable on this agy build.
        effort = undefined
      } else if (policy.pinLowEffort) {
        effort = 'low'
      } else if (options.reasoningEffort !== undefined) {
        const wanted = String(options.reasoningEffort)
        if (entry && entry.efforts === null) {
          throw new LlmError('model ' + model + ' has no selectable reasoning efforts', Err.UNSUPPORTED_REASONING_EFFORT)
        }
        if (entry && entry.efforts && !entry.efforts.includes(wanted)) {
```

</details>

#### 缺口

- 未测真实账号缓存刷新延迟、过期列表及多次切号竞争。
  **影响**：不能按切换成功回执确认模型资格。
  **进一步探讨**：构造不同目录与空目录的两个账号，交错切换并记录每次列表与实际调用账号。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · token 导入、备份自愈与槽位释放能保证账号恢复到原状吗？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

导入路由接收 token，经 refresh 换 access token、取邮箱并匹配已有账号。独立账号把新凭据写到目录并更新备份；Windows 系统主账号尝试写平台凭据和主凭据快照，该分支写入失败会被捕获，随后仍可能更新标签、清除认证标记并返回成功。账号状态和实际 CLI 登录应分开验收。读取凭据时若没有可用主文件会尝试恢复 .bak，写不回去时末尾仍可返回备份内容，所以本次读到内容和盘上恢复完成是两种事实；凭据备份也新增了必须保护与清理的敏感副本。

一次调用同时有并发槽与凭据租约，releaseOnce 使它们在相同流程的多条回收路径中只释放一次，已有手交接时由它处置租约。该约束属于当前代码路径。不同 OS、真实子进程关闭时机、外部凭据存储与磁盘权限的共同结果还没有经过核验。

#### 证据与依据

**依据 1 · 源码核查**：[src/transport/http/routes/pool.ts:332-355](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/transport/http/routes/pool.ts#L332-L355)

导入路由接收参数并返回池数据。

<details>
<summary>查看原文（24行）</summary>

```text
function handlePoolImport(services: HostServices, req: unknown, res: unknown): void {
  const { poolAuth, pool, notifyPicker } = services
  void (async () => {
    if (methodOf(req) !== 'POST') {
      sendJson(res as RawRes, 405, { error: 'POST only' })
      return
    }
    const body = await readBody(req)
    const token = typeof body.token === 'string' ? body.token.trim() : ''
    const alias = typeof body.alias === 'string' ? body.alias.trim() : undefined
    const proxyUrl = typeof body.proxyUrl === 'string' ? body.proxyUrl.trim() : undefined
    if (!token) {
      sendJson(res as RawRes, 400, { ok: false, error: 'Token is required' })
      return
    }
    const result = await poolAuth.importRefreshToken(token, alias, proxyUrl)
    if (result.ok) {
      notifyPicker()
      sendJson(res as RawRes, 200, {
        ok: true,
        account: result.account,
        isNew: result.isNew,
        email: result.email,
        pool: pool.getPoolData(),
```

</details>

**依据 2 · 源码核查**：[src/host/pool-auth.ts:234-270](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/host/pool-auth.ts#L234-L270)

换 token、匹配邮箱、隔离目录及 Windows 主账号写入。

<details>
<summary>查看原文（37行）</summary>

```text
    const refreshToken = extractRefreshToken(tokenInput)
    if (!refreshToken) {
      return { ok: false, error: 'Invalid refresh token or token JSON format', code: 'invalid_code' }
    }
    await this.abortActive()
    this.setStatus({ phase: 'exchanging' })
    try {
      const tokens = await this.refresh(refreshToken, proxyUrl)
      if (!tokens?.access_token) {
        this.fail('exchange_failed', new Error('Token endpoint did not return an access token'))
        return { ok: false, error: 'Failed to exchange refresh token', code: 'exchange_failed' }
      }
      const email = await this.userEmail(tokens.access_token, proxyUrl)
      const normalizedEmail = email?.toLowerCase()

      const existing = normalizedEmail
        ? this.pool.getAccounts().find((a) => a.email?.toLowerCase() === normalizedEmail)
        : undefined

      if (existing) {
        if (existing.dir && !existing.systemHome) {
          const stagedFile = writeAgyTokenFile(existing.dir, tokens)
          saveCredentialBackup(stagedFile)
        } else if (process.platform === 'win32') {
          try {
            const docStr = JSON.stringify({
              token: {
                access_token: tokens.access_token,
                token_type: tokens.token_type ?? 'Bearer',
                refresh_token: tokens.refresh_token,
              },
              auth_method: 'consumer',
            })
            writeWindowsCredentialRaw(docStr, 'gemini:antigravity')
            writePrimaryCredential({ raw: docStr, email, savedAt: Date.now() })
          } catch {
            // best effort
```

</details>

**依据 3 · 源码核查**：[src/host/pool-auth.ts:273-286](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/host/pool-auth.ts#L273-L286)

更新账号元数据并回报成功。

<details>
<summary>查看原文（14行）</summary>

```text
        if (alias?.trim()) {
          this.pool.setAccountAlias(existing.id, alias.trim())
        }
        if (proxyUrl?.trim()) {
          this.pool.setAccountProxy(existing.id, proxyUrl.trim())
        }
        this.pool.clearAuthRequired(existing.id)
        this.pool.clearCooldown(existing.id, undefined, true)
        this.pool.updateAccountQuotas(existing.id, existing.quotas ?? {}, email)
        void this.quota.refreshAccountQuota(existing).catch(() => undefined)
        this.log(`imported refresh token for existing account ${existing.id}${email ? ` <${email}>` : ''}`)
        this.setStatus({ phase: 'done', alias: existing.alias || email, code: 'account_activated' })
        this.onUpdate?.()
        return { ok: true, account: existing, isNew: false, email }
```

</details>

**依据 4 · 源码核查**：[src/domain/credentials/backup.ts:72-113](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/domain/credentials/backup.ts#L72-L113)

有效备份和回写失败时的返回路径。

<details>
<summary>查看原文（42行）</summary>

```text
export function readAccountCredential(file: string, log: (message: string) => void = () => {}): string | null {
  // 1. Normal path: read existing file and verify it contains a valid refresh token
  const current = readWithRetry(file)
  if (current !== null && hasRefreshToken(current)) {
    if (!existsSync(file + '.bak')) {
      saveCredentialBackup(file, current)
    }
    return current
  }

  // 2. File does not exist on disk or lacks a valid refresh token: check if valid backup exists
  const backupFile = file + '.bak'
  const backup = readWithRetry(backupFile)
  if (!backup || !hasRefreshToken(backup)) {
    return (current !== null && current.trim()) ? current : null
  }

  // 3. Restore backup
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (current === null) {
        copyFileSync(backupFile, file, constants.COPYFILE_EXCL)
      } else {
        copyFileSync(backupFile, file)
      }
      log('[agy-link] restored missing or corrupted account credential from backup')
      return backup
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code
      if (code === 'EEXIST' && current === null) {
        // Concurrently created or restored
        const reRead = readWithRetry(file)
        if (reRead && hasRefreshToken(reRead)) return reRead
      }
      if (attempt < 2 && (code === 'EBUSY' || code === 'EPERM' || code === 'EACCES')) {
        sleepMs(50)
        continue
      }
      break
    }
  }
  return backup
```

</details>

**依据 5 · 源码核查**：[src/provider/attempt.ts:359-396](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/provider/attempt.ts#L359-L396)

并发槽和凭据租约的单次释放。

<details>
<summary>查看原文（38行）</summary>

```text
export function createAttemptSlot(
  concurrencyRelease: (() => void) | null,
  credentialLease: Awaited<ReturnType<typeof acquireCredentialSlot>>,
  log: ((msg: string) => void) | undefined,
): AttemptSlot {
  let release = concurrencyRelease
  let released = false
  let handoff: SlotHandoff | null = null
  const releaseOnce = (): void => {
    if (released) return
    released = true
    if (handoff !== null) {
      handoff.dispose()
    } else {
      try {
        credentialLease?.release()
      } catch {
        // best-effort
      }
    }
    release?.()
    release = null
  }
  return {
    releaseOnce,
    armHandoff: () => {
      if (credentialLease === undefined) return null
      handoff = armSlotHandoff({
        release: () => {
          try {
            credentialLease?.release()
          } catch {
            // best-effort
          }
        },
        log,
      })
      return handoff
```

</details>

#### 缺口

- 未核实真实 Keychain、Windows Credential Manager 或不同用户权限下的恢复与注销。
  **影响**：导入成功和读取备份均不足以证明下一次 CLI 使用预期账号。
  **进一步探讨**：在临时 HOME 和模拟凭据存储中制造权限拒绝与进程中断，比较磁盘状态、租约和下一次身份。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 会话媒体预览和打开本地文件的路由会触及哪些路径？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

Web 预览和打开端点以请求参数中的 path 或 url 定位本地文件。路由收集配置目录、媒体目录、活跃会话目录、进程目录和用户主目录。这些目录承担查找线索的作用。解析器会直接接受已存在的绝对路径，也会 resolve 相对路径后仅检查存在性，并在有限深度搜索；没有在该流程证明目标 realpath 必须位于请求会话目录。媒体处理用文件类型与 MIME 过滤并按范围流式提供内容。系统打开处理把解析结果交给本机打开器，返回值只反映调用的发起结果。功能上减少复制路径及切换文件管理器的操作，但与模型适配器一起启用会新增由宿主进程触及本地文件的路由。

源码能直接建立路径范围风险，实际哪些浏览器来源、远程请求或会话可到达端点还取决于 DSH 宿主外层鉴权与绑定。现有证据不足以断言远程可利用，亦不能把工作目录列表当作隔离保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/transport/http/routes/media.ts:37-78](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/transport/http/routes/media.ts#L37-L78)

将主目录和活跃会话目录等传作解析线索。

<details>
<summary>查看原文（42行）</summary>

```text
function collectWorkspaceRoots(services: HostServices): string[] {
  const { getConfig, mediaDir, activeCwds } = services
  const roots: string[] = []
  const cfgRoot = getConfig().workspaceRoot
  if (cfgRoot) roots.push(cfgRoot)
  if (typeof mediaDir === 'function') {
    const md = mediaDir()
    if (md) roots.push(md)
  }

  // Collect active session directories
  if (typeof activeCwds === 'function') {
    for (const c of activeCwds()) {
      if (c && !roots.includes(c)) roots.push(c)
    }
  }

  const cwd = process.cwd()
  if (!roots.includes(cwd)) roots.push(cwd)

  const home = homedir()
  const devDirs = [join(home, 'Developer'), join(home, 'Workspace'), join(home, 'Projects')]
  for (const d of devDirs) {
    if (existsSync(d) && !roots.includes(d)) roots.push(d)
  }
  const desktop = join(home, 'Desktop')
  const downloads = join(home, 'Downloads')
  if (existsSync(desktop) && !roots.includes(desktop)) roots.push(desktop)
  if (existsSync(downloads) && !roots.includes(downloads)) roots.push(downloads)
  if (!roots.includes(home)) roots.push(home)

  return roots
}

function handleMedia(services: HostServices, req: unknown, res: unknown): void {
  const roots = collectWorkspaceRoots(services)
  handleMediaRequest(req as HttpRequestLike, res as HttpResponseLike, { workspaceRoots: roots })
}

function handleOpen(services: HostServices, req: unknown, res: unknown): void {
  const roots = collectWorkspaceRoots(services)
  handleOpenFile(req as HttpRequestLike, res as HttpResponseLike, { workspaceRoots: roots })
```

</details>

**依据 2 · 源码核查**：[src/transport/http/routes/media.ts:97-102](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/transport/http/routes/media.ts#L97-L102)

精确路由挂载到宿主 Web 服务。

```text
export function register(reg: RouteRegistrar, services: HostServices): void {
  const assetDir = resolveAssetDir(services.hostDir)
  reg({ kind: 'exact', path: '/plugins/agy-link/mermaid.min.js', handler: (req, res) => handleMermaid(services, req, res) })
  reg({ kind: 'exact', path: '/plugins/agy-link/media', handler: (req, res) => handleMedia(services, req, res) })
  reg({ kind: 'exact', path: '/plugins/agy-link/open', handler: (req, res) => handleOpen(services, req, res) })
  reg({ kind: 'prefix', path: '/plugins/agy-link/assets', handler: (req, res) => handleAssets(req, res, assetDir) })
```

**依据 3 · 源码核查**：[src/host/media-route.ts:146-184](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/host/media-route.ts#L146-L184)

绝对路径直接通过存在性检查，搜索线索并非包含校验。

<details>
<summary>查看原文（39行）</summary>

```text
  if (!rawPath || typeof rawPath !== 'string') return null;
  const p = parseRawMediaUri(rawPath.trim());
  if (p === null) return null;

  // If path is already absolute, check directly
  if ((IS_WIN && (/^[A-Za-z]:/.test(p) || p.startsWith('\\\\'))) || (!IS_WIN && p.startsWith('/'))) {
    const resolved = resolve(p);
    if (existsSync(resolved)) return resolved;
  }

  // Resolve candidates against workspace roots / media directory
  const roots: string[] = [];
  if (typeof workspaceRoots === 'string' && workspaceRoots !== '') {
    roots.push(workspaceRoots);
  } else if (Array.isArray(workspaceRoots)) {
    for (const r of workspaceRoots) {
      if (typeof r === 'string' && r !== '') roots.push(r);
    }
  }

  const strippedRel = p.replace(/^[/\\]+/, '');
  const baseName = extname(p) ? p.split(/[/\\]/).pop()! : p;

  for (const root of roots) {
    const candidate = resolve(root, p);
    if (existsSync(candidate)) return candidate;

    if (strippedRel !== p) {
      const relCandidate = resolve(root, strippedRel);
      if (existsSync(relCandidate)) return relCandidate;
    }

    const baseCandidate = resolve(root, baseName);
    if (existsSync(baseCandidate)) return baseCandidate;

    const home = homedir();
    const isRootWide = root === home || root === '/' || (IS_WIN && /^[A-Za-z]:\\?$/.test(root));
    const depth = isRootWide ? 1 : 3;
    const found = searchInDirectory(root, strippedRel, baseName, depth);
```

</details>

**依据 4 · 源码核查**：[src/host/media-route.ts:294-317](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/host/media-route.ts#L294-L317)

媒体侧核查普通文件与 MIME。

<details>
<summary>查看原文（24行）</summary>

```text
  const roots = opts.workspaceRoots ?? opts.workspaceRoot;
  const filePath = resolveLocalMediaPath(targetPath, roots);
  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('file not found');
    return;
  }

  try {
    const st = statSync(filePath);
    if (!st.isFile()) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('not a regular file');
      return;
    }

    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_MAP[ext] ?? 'application/octet-stream';

    // Allow images, videos, audios and SVG
    const isMedia = contentType.startsWith('image/') || contentType.startsWith('video/') || contentType.startsWith('audio/') || ext === '.svg';
    if (!isMedia) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('access denied: not an image');
```

</details>

**依据 5 · 源码核查**：[src/host/media-route.ts:381-399](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/host/media-route.ts#L381-L399)

系统打开接收解析出的文件并回报。

<details>
<summary>查看原文（19行）</summary>

```text
  const filePath = resolveLocalMediaPath(targetPath, opts.workspaceRoots);
  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: false, error: 'file not found' }));
    return;
  }

  const result = executeOpenInSystem(filePath, reveal);
  if (!result.ok) {
    res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: false, error: result.error }));
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify({ ok: true, path: filePath, revealed: reveal }));
```

</details>

#### 缺口

- 本轮未取得并验证宿主 Web 路由外层鉴权及实际监听配置。
  **影响**：共享或可远程访问 profile 下的暴露范围尚不能确定。
  **进一步探讨**：只用隔离测试文件和未授权测试账号检查会话内外、绝对路径及符号链接，并用假系统打开器记录调用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前适合哪些用户观察或试用，进入采用前要核对什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

现阶段建议观察。目标用户是已有独立 agy 环境、反复要在 DSH 使用对应模型和工具反馈的开发者。连接能省去在终端和 DSH 手动搬运提示与输出，但 Node 24、兼容 DSH 服务、CLI、授权及网络都需准备，真实可用模型、账号配额和使用成本未核对。后台模型探测及额度查询也会随账号数增加运行与维护负担。新增导入与备份让恢复操作集中，同时引入凭据副本清理及操作系统核验。默认 skip 将权限确认责任交给环境隔离，且 Web 媒体处理涉及广泛本地路径，这两点阻止直接在常用 profile 导入账号。

先保持原 agy 终端流程。如计划进入试验，使用临时 HOME 和无真实凭据的隔离 profile，核验权限参数与 HTTP 鉴权，检查进程是否越过预定文件范围，先测一条纯文本链再验证账号切换。权限检查无结果、误选账号、凭据回写与预期不符或 Web 可越界时停止，并继续使用原 CLI。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:103-117](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/package.json#L103-L117)

构建检查入口和 Node 版本声明。

<details>
<summary>查看原文（15行）</summary>

```text
  "scripts": {
    "build": "tsdown",
    "check": "tsc --noEmit",
    "test": "node --experimental-transform-types --test \"test/**/*.test.ts\"",
    "test:fast": "node scripts/fast-test.mjs",
    "prepare": "npm run build",
    "prepack": "npm run build",
    "lint:arch": "node scripts/check-architecture.mjs",
    "lint:budget": "node scripts/check-budgets.mjs",
    "test:coverage": "node --experimental-transform-types --test --test-concurrency=1 --experimental-test-coverage --test-coverage-lines=85 --test-coverage-branches=80 --test-coverage-functions=80 \"test/**/*.test.ts\"",
    "verify": "npm run check && npm run lint:arch && npm run lint:budget && npm run build && npm test"
  },
  "engines": {
    "node": ">=24.0.0"
  },
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:7-15](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/cordis.patch.yml#L7-L15)

默认启用、CLI 与工作区配置，默认 skip。

```text
      config:
        enabled: !!js "process.env.DSH_AGY_ENABLED ?? 'true'"
        agyBin: !!js "process.env.DSH_AGY_BIN ?? ''"
        # permissionMode: skip | plan | accept-edits  (skip passes
        # --dangerously-skip-permissions; see README security notes)
        permissionMode: !!js "process.env.DSH_AGY_MODE ?? 'skip'"
        workspaceRoot: !!js "process.env.DSH_AGY_WORKSPACE_ROOT ?? ''"
        defaultModel: !!js "process.env.DSH_AGY_DEFAULT_MODEL ?? ''"
        defaultEffort: !!js "process.env.DSH_AGY_DEFAULT_EFFORT ?? ''"
```

**依据 3 · 源码核查**：[src/provider/attempt.ts:108-123](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/provider/attempt.ts#L108-L123)

skip 具体映射到 CLI 跳过确认标记。

<details>
<summary>查看原文（16行）</summary>

```text
  const ptMins = opts.printTimeoutMinutes ?? Math.max(1, Math.ceil(opts.timeoutMs / 60_000))
  const args: string[] = ['--output-format', 'stream-json', '--print-timeout', ptMins + 'm']
  if (opts.permissionMode === 'skip') args.push('--dangerously-skip-permissions')
  else args.push('--mode', opts.permissionMode)
  const effectiveModel = resolveModelSlug(opts.model)
  if (effectiveModel !== '') args.push('--model', effectiveModel)
  // Claude 5.5 accepts --effort on its base slug (verified against agy 1.5.3);
  // a tiered slug plus the flag is rejected upstream, so callers must pass the
  // base slug here — the catalog folds the tiers for exactly that reason.
  const effortModel = effectiveModel.toLowerCase()
  // Claude 5.5 only: 4.6 keeps its documented no-effort behaviour.
  const isEffortCapable = effectiveModel === '' || effortModel.startsWith('gemini') || effortModel.startsWith('argon') || /^claude-(?:sonnet|opus)-5-5$/.test(effortModel)
  if (isEffortCapable && opts.effort && opts.effort !== '') args.push('--effort', opts.effort)
  if (opts.conversationId) args.push('--conversation', opts.conversationId)
  for (const d of opts.addDirs ?? []) args.push('--add-dir', d)
  args.push(...opts.extraArgs)
```

</details>

**依据 4 · 源码核查**：[src/domain/credentials/backup.ts:82-113](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/domain/credentials/backup.ts#L82-L113)

凭据副本、恢复和写失败。

<details>
<summary>查看原文（32行）</summary>

```text
  // 2. File does not exist on disk or lacks a valid refresh token: check if valid backup exists
  const backupFile = file + '.bak'
  const backup = readWithRetry(backupFile)
  if (!backup || !hasRefreshToken(backup)) {
    return (current !== null && current.trim()) ? current : null
  }

  // 3. Restore backup
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (current === null) {
        copyFileSync(backupFile, file, constants.COPYFILE_EXCL)
      } else {
        copyFileSync(backupFile, file)
      }
      log('[agy-link] restored missing or corrupted account credential from backup')
      return backup
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code
      if (code === 'EEXIST' && current === null) {
        // Concurrently created or restored
        const reRead = readWithRetry(file)
        if (reRead && hasRefreshToken(reRead)) return reRead
      }
      if (attempt < 2 && (code === 'EBUSY' || code === 'EPERM' || code === 'EACCES')) {
        sleepMs(50)
        continue
      }
      break
    }
  }
  return backup
```

</details>

**依据 5 · 源码核查**：[src/host/media-route.ts:146-184](https://github.com/amlyczz/dsh-agy-link/blob/3eba8eff3c993e493a1227a0978004e0f2bd7274/src/host/media-route.ts#L146-L184)

Web 文件路径边界。

<details>
<summary>查看原文（39行）</summary>

```text
  if (!rawPath || typeof rawPath !== 'string') return null;
  const p = parseRawMediaUri(rawPath.trim());
  if (p === null) return null;

  // If path is already absolute, check directly
  if ((IS_WIN && (/^[A-Za-z]:/.test(p) || p.startsWith('\\\\'))) || (!IS_WIN && p.startsWith('/'))) {
    const resolved = resolve(p);
    if (existsSync(resolved)) return resolved;
  }

  // Resolve candidates against workspace roots / media directory
  const roots: string[] = [];
  if (typeof workspaceRoots === 'string' && workspaceRoots !== '') {
    roots.push(workspaceRoots);
  } else if (Array.isArray(workspaceRoots)) {
    for (const r of workspaceRoots) {
      if (typeof r === 'string' && r !== '') roots.push(r);
    }
  }

  const strippedRel = p.replace(/^[/\\]+/, '');
  const baseName = extname(p) ? p.split(/[/\\]/).pop()! : p;

  for (const root of roots) {
    const candidate = resolve(root, p);
    if (existsSync(candidate)) return candidate;

    if (strippedRel !== p) {
      const relCandidate = resolve(root, strippedRel);
      if (existsSync(relCandidate)) return relCandidate;
    }

    const baseCandidate = resolve(root, baseName);
    if (existsSync(baseCandidate)) return baseCandidate;

    const home = homedir();
    const isRootWide = root === home || root === '/' || (IS_WIN && /^[A-Za-z]:\\?$/.test(root));
    const depth = isRootWide ? 1 : 3;
    const found = searchInDirectory(root, strippedRel, baseName, depth);
```

</details>

#### 缺口

- 真实服务资格、同版本宿主兼容、网络稳定性及单位任务成本未知。
  **影响**：没有依据宣称现有账号能可靠持续接入或节省费用。
  **进一步探讨**：记录可观察的首次配置时间、重试数、失败排查和退出状态，再比较直接 CLI 的合格任务。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
