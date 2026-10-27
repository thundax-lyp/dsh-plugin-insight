# API Relay Audit

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[d261bcc](https://github.com/toby-bridges/api-relay-audit/tree/d261bcc196c43dfd072ae24210dd57870399437b)

<!-- BEGIN META -->
[![GitHub ★ 895](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=895&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/toby-bridges/api-relay-audit) [![npm 30d 281](https://img.shields.io/static/v1?label=npm+30d&message=281&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-api-relay-audit) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-api-relay-audit)
<!-- END META -->

> **功能**：在本地检查 AI API 中转行为，生成逐步证据和风险报告，并提供 DSH 命令入口。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持的已有贡献是把多类中转探针组织为保留未知项的本地报告，再用宿主凭据和当前线路减少手工接线。检测语义来自项目已有 Python 实现，DSH 适配不另创检测算法；没有同条件准确率或节时证据。

> **主要限制**：[Q03](#research-q03) 显示 MEDIUM 同时表示未知和异常，SSE 异常也能升为 HIGH。报告保留原因值得肯定，但网络和协议问题不能直接归因为恶意中转，评级不能代替生产信任决定。

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
  - [Q01 · 本地审计为谁提供什么结果，安全认证是否成立？](#detail-section-11)
  - [Q02 · 命令如何从当前线路走到本地报告？](#detail-section-12)
  - [Q03 · 中断和异常是否被误当成安全或攻击证明？](#detail-section-13)
  - [Q04 · 什么范围值得试用，成本和退出如何控制？](#detail-section-14)
  - [Q05 · 双轴输出能否减少把网络故障当攻击的误判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用第三方中转的开发者可在发送敏感任务前生成可复查报告，但不能据此认定线路安全。

直接使用同仓库 audit.py 可取得相同检测语义；手工 curl 是更简单的连通性基线，不能等同多类异常审计。DSH包价值主要在凭据、目标与报告管理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH审计命令 | 复用当前线路及凭据，输出本地报告 | 声明Claude线路及兼容服务；不提供安全认证 |
| Python探针报告 | 汇集提示、响应与流异常及未知项 | 需要网络与模型费用，结果需人工归因 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node与匹配DSH服务 | 是 | commands、credentials、llm等接线 | 无法加载或解析目标 |
| Python与curl | 是 | 本地探针及HTTP | 审计无法完成 |
| Claude声明线路与凭据 | DSH操作必需 | 当前检测基线 | 拒绝或报告未知 |
| 人工归因与预算 | 是 | 不将评级当认证 | 暂缓扩大流量 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户固定版本并配置宿主凭据 | 不将密钥写入命令 |
| 接线 | 先进行连通性检查 | 确认目标；失败停止 |
| 审计 | 在有限预算内运行选定探针 | 报告生成且未知可辨认 |
| 审阅 | 用户逐项判断证据和协议影响 | 不确定则回退手工调查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Python与DSH环境，金额未知 | 配置线路及凭据，时间未知 | 兼容宿主版本必需 |
| 持续使用 | 中转模型调用与上下文，费用未知 | 审阅探针与归因，时间未知 | 默认完整审计可能较贵 |
| 失败恢复 | 重试请求可能再次计费 | 查部分报告、区分网络与异常 | 已发送内容不可撤回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 接线 | 复用当前线路、凭据引用和本地报告路径 | 现场兼容及配置耗时 |
| 异常处理 | 探针崩溃保留未知，取消保留部分报告 | 误报漏报与真实攻击覆盖 |
| 审计收益 | 多类检查集中输出 | 合格率、节时与单位成本 |

> **思考**：[Q03](#research-q03) 显示 MEDIUM 同时表示未知和异常，SSE 异常也能升为 HIGH。报告保留原因值得肯定，但网络和协议问题不能直接归因为恶意中转，评级不能代替生产信任决定。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持的已有贡献是把多类中转探针组织为保留未知项的本地报告，再用宿主凭据和当前线路减少手工接线。检测语义来自项目已有 Python 实现，DSH 适配不另创检测算法；没有同条件准确率或节时证据。

[Q02](#research-q02)适配层明确分发与检测职责，无shell argv与环境传钥值得借鉴；[Q03](#research-q03)部分报告及诊断有利于恢复。迁移需宿主凭据、子进程取消和工作区路径语义，不能只复制命令注册；路径预检也不是对恶意并发文件系统的完整保护。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示 MEDIUM 同时表示未知和异常，SSE 异常也能升为 HIGH。报告保留原因值得肯定，但网络和协议问题不能直接归因为恶意中转，评级不能代替生产信任决定。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议有技术能力的线路使用者先做连通性检查，再在不含真实业务秘密的有限请求上试用，逐项读原因而非只看评级。持续未知、预算失控或敏感报告无法妥善保管时停止，改用手工HTTP调查；本次不支持长期安装验收结论。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查源码中的适配链路与风险聚合。检测效果与现场兼容未执行验证；双轴报告仅为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、dsh/index.js、audit.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定提交中的README、包清单、DSH适配器及Python风险汇总；未运行目标代码，不据此判断实际中转安全。
- 下一步：未执行实验。进一步研究可用透明、故障、篡改代理记录原始响应和每步覆盖，比较归因错误、模型账单与人工审阅时间；双轴呈现若不优于原报告则放弃。

**分析版本**

- **仓库**：[toby-bridges/api-relay-audit](https://github.com/toby-bridges/api-relay-audit)
- **版本号**：2.5.0（[固定提交 d261bcc](https://github.com/toby-bridges/api-relay-audit/tree/d261bcc196c43dfd072ae24210dd57870399437b)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 推导出未验证的“完成覆盖与异常证据分列”假设。用透明、故障和篡改代理同样本盲评归因；正确率不改善或审阅负担上升则停止。

未执行实验。进一步研究可用透明、故障、篡改代理记录原始响应和每步覆盖，比较归因错误、模型账单与人工审阅时间；双轴呈现若不优于原报告则放弃。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 40 | 6697 | — | — | 62932 |
| .mjs | source | 9 | 1050 | 983 | 43 | — |
| .md | example | 1 | 81 | — | — | 570 |
| .js | source | 1 | 486 | 419 | 18 | — |
| .js | test | 2 | 616 | 575 | 14 | — |
| .mjs | test | 2 | 171 | 158 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/toby-bridges/api-relay-audit/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本的DSH适配能否帮助中转API使用者获得可追溯行为审计材料，其风险标签可以支撑什么采用决定？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 本地审计为谁提供什么结果，安全认证是否成立？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

使用第三方中转的开发者在发送生产、编码或钱包敏感流量前，需要检查请求和响应有没有可观察异常。合格交付是逐步证据与不确定项保留的本地报告，而非证明供应商诚实。相比手动 curl 只检查连通性，项目把提示、工具文本、错误泄漏及流事件检查组织为同一次审计；相比直接运行同仓库 audit.py，DSH 包增加当前线路和凭据的接线，不能把 Python 检测器归为适配层原创。作者明确拒绝安全认证，模型自称和延迟也不足以证明换模，因此报告适合筛查与后续调查，不应作为自动放行依据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:82-102](https://github.com/toby-bridges/api-relay-audit/blob/d261bcc196c43dfd072ae24210dd57870399437b/README.md#L82-L102)

定位目标场景并明确非认证及各探针族的证据限制。

<details>
<summary>查看原文（21行）</summary>

```text
## When to Use It

- You use a third-party AI API relay, mirror, gateway, or LLM proxy.
- You want to check whether a Claude-compatible or OpenAI-compatible proxy injects prompts, swaps models, truncates context, or rewrites tool output.
- You are testing relay behavior before production traffic, coding-agent automation, package-install suggestions, or wallet-related actions.
- You need a local, repeatable audit report instead of a web tool that asks for your API key.

## What It Does Not Claim

- It does not certify that a relay is safe.
- It does not replace manual security review or operational monitoring.
- It does not treat `inconclusive` as `clean`; blocked probes and ambiguous responses stay visible in the report.

## Query Family Boundaries

| Query family | User intent | Profile / steps | Evidence boundary |
|---|---|---|---|
| API relay audit | Audit a third-party relay, mirror, gateway, LLM proxy, or resale API before trusting traffic. | `general` by default; `full` for every probe | Produces a local report, not a safety certificate. |
| Prompt injection audit | Detect hidden prompt injection, prompt leakage, instruction override, and extraction behavior. | `general`; Steps 3-6 | Records prompt evidence without publishing private prompts or secrets. |
| Model substitution signals | Collect model identity, stream, latency, and upstream channel signals. | `general`; Steps 5, 10, 13, 14 | Self-ID, latency, and channel fingerprints are signals, not standalone proof of provider substitution. |
| Web3 relay audit | Check wallet-sensitive relay behavior before agent workflows touch signing or transactions. | `web3` or `full`; Step 11 | Profile-gated; general relay audits do not imply wallet safety. |
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:1-6](https://github.com/toby-bridges/api-relay-audit/blob/d261bcc196c43dfd072ae24210dd57870399437b/dsh/index.js#L1-L6)

适配器主动限定自身只拥有分发、目标与凭据接线，检测语义保留Python。

```text
/**
 * DeepSeek Harness adapter for the generated standalone API Relay Audit.
 *
 * This module deliberately owns only distribution concerns: resolve one DSH
 * provider target, resolve one credential, launch the existing audit.py, and
 * return its report path. Detection semantics remain entirely in Python.
```

#### 缺口

- 缺少同条件手工审计对照与误报漏报数据
  **影响**：不能认定更准确或更省时间
  **进一步探讨**：对可控透明代理与已知篡改代理重复同组请求，记录原始事件、误报、漏报和人工复核时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 命令如何从当前线路走到本地报告？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

用户调用 relay-audit 后，适配器无 shell 地拆分参数，拒绝原始 key 与 key-env 及受控参数缩写。它从当前 agent 与 settings 读取 URL、模型和凭据引用，先检查 URL 和声明的 Claude 家族，再向 Credentials 取值。Python 以 argv 启动，密钥放入子进程环境，报告路径要求位于工作区并检查已有符号链接祖先。子进程结束后必须发现报告文件才返回成功。这个成功只证明进程和文件条件，不证明报告所评线路可信。必须有兼容 commands、credentials、subprocess、llm、settings 服务、Python 及联网线路；根包要求 Node 22.19 或24及以上相应范围。Claude 标签是适用性筛选，不是供应商真实性证明。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:125-173](https://github.com/toby-bridges/api-relay-audit/blob/d261bcc196c43dfd072ae24210dd57870399437b/dsh/index.js#L125-L173)

拒绝密钥和缩写，提取适配器拥有的参数。

<details>
<summary>查看原文（49行）</summary>

```text
/** Parse DSH-owned options and leave existing audit.py options untouched. */
export function parseCommandInput(rawInput) {
  const tokens = tokenizeCommandInput(rawInput)
  const values = new Map()
  const passthrough = []
  let help = false

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]
    const name = optionName(token)
    if (FORBIDDEN_OPTIONS.has(name)) {
      throw new Error(`${name} is not accepted; store the key in DSH Credentials`)
    }
    const abbreviations = abbreviatedControlledOptions(name)
    if (abbreviations.length > 0) {
      throw new Error(
        `${name} is an abbreviation of adapter-controlled option ${abbreviations.join(' or ')}`,
      )
    }
    if (token === '--help' || token === '-h') {
      help = true
      continue
    }
    if (!OWNED_OPTIONS.has(name)) {
      passthrough.push(token)
      continue
    }
    if (values.has(name)) throw new Error(`${name} may be specified only once`)

    let value = optionInlineValue(token)
    if (value === undefined) {
      index += 1
      value = tokens[index]
    }
    if (value === undefined || value.length === 0 || value.startsWith('--')) {
      throw new Error(`${name} requires a value`)
    }
    values.set(name, value)
  }

  return Object.freeze({
    help,
    url: values.get('--url'),
    model: values.get('--model'),
    credentialRef: values.get('--credential-ref'),
    output: values.get('--output'),
    transparentLog: values.get('--transparent-log'),
    passthrough: Object.freeze(passthrough),
  })
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:243-275](https://github.com/toby-bridges/api-relay-audit/blob/d261bcc196c43dfd072ae24210dd57870399437b/dsh/index.js#L243-L275)

目标字段与Claude标签校验。

<details>
<summary>查看原文（33行）</summary>

```text
export async function resolveTarget(ctx, agent, parsed, signal) {
  const provider = agent.options?.provider
  const profile = parsed.url === undefined || parsed.credentialRef === undefined
    ? configuredProviderProfile(ctx, provider)
    : undefined
  const url = parsed.url ?? (typeof profile?.baseURL === 'string' ? profile.baseURL : undefined)
  const model = parsed.model ?? agent.options?.model
  const credentialRef = parsed.credentialRef
    ?? (typeof profile?.apiKeyEnv === 'string' ? profile.apiKeyEnv : undefined)

  const missing = []
  if (url === undefined) missing.push('--url')
  if (model === undefined) missing.push('--model')
  if (credentialRef === undefined) missing.push('--credential-ref')
  if (missing.length > 0) {
    throw new Error(
      `could not resolve ${missing.join(', ')} from the current DSH provider; provide the missing override(s)`,
    )
  }

  const resolvedUrl = validateUrl(url)
  const resolvedCredentialRef = assertCredentialRef(credentialRef)
  if (!await modelLooksLikeClaude(ctx, provider, model, signal)) {
    throw new Error(
      'the current audit baseline applies only to routes that declare a Claude model; no report was generated',
    )
  }
  return Object.freeze({
    provider,
    url: resolvedUrl,
    model,
    credentialRef: resolvedCredentialRef,
  })
```

</details>

**依据 3 · 源码核查**：[dsh/index.js:381-470](https://github.com/toby-bridges/api-relay-audit/blob/d261bcc196c43dfd072ae24210dd57870399437b/dsh/index.js#L381-L470)

凭据解析、Python argv/env、结果及报告文件检查。

<details>
<summary>查看原文（90行）</summary>

```text
/** Execute one human-command invocation against the existing audit.py CLI. */
export async function executeAuditCommand(invocation, ctx, options = {}) {
  let secret = ''
  try {
    const parsed = parseCommandInput(invocation.rawInput)
    if (parsed.help) return { kind: 'success', text: USAGE }

    const workspace = invocation.agent.session?.header?.cwd
    if (typeof workspace !== 'string' || workspace.length === 0 || !isAbsolute(workspace)) {
      throw new Error('the receiving DSH session has no absolute workspace')
    }

    const target = await resolveTarget(ctx, invocation.agent, parsed, invocation.signal)
    const now = options.now ?? new Date()
    const fallbackReport = defaultReportPath(workspace, invocation.commandId, now)
    const reportPath = resolveWorkspacePath(workspace, parsed.output, fallbackReport)
    const transparentLogPath = parsed.transparentLog === undefined
      ? undefined
      : resolveWorkspacePath(workspace, parsed.transparentLog, parsed.transparentLog)
    await assertWorkspacePathContained(workspace, reportPath)
    if (transparentLogPath !== undefined) {
      await assertWorkspacePathContained(workspace, transparentLogPath)
    }

    const credential = await ctx.credentials.resolve(target.credentialRef)
    if (credential === undefined || typeof credential.value !== 'string' || credential.value.length === 0) {
      throw new Error(`DSH Credential ${target.credentialRef} is missing or empty`)
    }
    secret = credential.value

    const python = await resolvePython(
      ctx,
      invocation.signal,
      options.platform ?? process.platform,
    )

    const argv = [
      python.executable,
      ...python.prefix,
      options.auditScript ?? AUDIT_SCRIPT,
      '--key-env',
      CHILD_KEY_ENV,
      '--url',
      target.url,
      '--model',
      target.model,
      '--output',
      reportPath,
      ...parsed.transparentLog === undefined
        ? []
        : ['--transparent-log', transparentLogPath],
      ...parsed.passthrough,
    ]

    const handle = ctx.subprocess.spawn({
      argv,
      cwd: workspace,
      stdio: {
        stdin: 'ignore',
        stdout: { maxBytes: OUTPUT_LIMIT_BYTES },
        stderr: { maxBytes: OUTPUT_LIMIT_BYTES },
      },
      graceMs: PROCESS_GRACE_MS,
      signal: invocation.signal,
      env: { [CHILD_KEY_ENV]: secret },
    })
    const outcome = await handle.done
    const reportExists = await fileExists(reportPath)

    if (invocation.signal.aborted) {
      return {
        kind: 'error',
        text: reportExists
          ? `Audit canceled. Partial report: ${reportPath}`
          : 'Audit canceled; no report was generated.',
      }
    }
    if (outcome.exitCode !== 0) {
      const diagnostic = diagnosticTail(handle, secret)
      const report = reportExists ? `\nReport: ${reportPath}` : ''
      const detail = diagnostic.length > 0 ? `\n${diagnostic}` : ''
      return {
        kind: 'error',
        text: `Audit process exited with code ${String(outcome.exitCode)}.${report}${detail}`,
      }
    }
    if (!reportExists) {
      throw new Error('audit.py exited successfully but did not create its report')
    }
    return { kind: 'success', text: `Report: ${reportPath}` }
```

</details>

**依据 4 · 源码核查**：[dsh/index.js:285-316](https://github.com/toby-bridges/api-relay-audit/blob/d261bcc196c43dfd072ae24210dd57870399437b/dsh/index.js#L285-L316)

词法路径与真实已有祖先约束。

<details>
<summary>查看原文（32行）</summary>

```text
/** Resolve an optional user path and require that it remains in the workspace. */
export function resolveWorkspacePath(workspace, input, fallback) {
  const candidate = input === undefined ? fallback : resolve(workspace, input)
  if (candidate === workspace || isOutsideWorkspace(workspace, candidate)) {
    throw new Error('output paths must resolve to a file inside the current workspace')
  }
  return candidate
}

async function nearestExistingRealPath(candidate) {
  let current = candidate
  for (;;) {
    try {
      return await realpath(current)
    } catch (error) {
      if (error?.code !== 'ENOENT' && error?.code !== 'ENOTDIR') throw error
      const parent = dirname(current)
      if (parent === current) throw error
      current = parent
    }
  }
}

/** Reject existing symlinks that would make an output escape the workspace. */
export async function assertWorkspacePathContained(workspace, candidate) {
  const canonicalWorkspace = await realpath(workspace)
  const canonicalAncestor = await nearestExistingRealPath(candidate)
  if (canonicalAncestor !== canonicalWorkspace
    && isOutsideWorkspace(canonicalWorkspace, canonicalAncestor)) {
    throw new Error('output paths must not escape the current workspace through a symlink')
  }
  return candidate
```

</details>

**依据 5 · 源码核查**：[package.json:30-39](https://github.com/toby-bridges/api-relay-audit/blob/d261bcc196c43dfd072ae24210dd57870399437b/package.json#L30-L39)

Node与宿主peer版本范围。

<details>
<summary>查看原文（10行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-commands": "0.1.0-rc.6 || 0.1.7-rc.2 || 0.2.0-rc.2",
    "@deepseek-ai/dsh-credentials": "0.1.0-rc.6 || 0.1.7-rc.2 || 0.2.0-rc.2",
    "@deepseek-ai/dsh-llm": "0.1.0-rc.6 || 0.1.7-rc.2 || 0.2.0-rc.2",
    "@deepseek-ai/dsh-settings": "0.1.0-rc.6 || 0.1.7-rc.2 || 0.2.0-rc.2",
    "@deepseek-ai/dsh-subprocess": "0.1.0-rc.6 || 0.1.7-rc.2 || 0.2.0-rc.2"
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 中断和异常是否被误当成安全或攻击证明？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

实现的优点是探针异常不会丢掉所有前序输出，_run_step 写黄旗、保留异常名并返回未知默认值，聚合将任一步崩溃或维度未知提升到 MEDIUM。DSH 取消后返回部分报告路径，非零退出带脱敏诊断，适合人工继续调查。限制在于 MEDIUM 同时容纳无法完成和较弱异常，HIGH 中也有仅为协议结构异常的分支；协议适配差异、网络失败与恶意行为不是同一因果。不能把评级直接当恶意运营者判定。路径检查到实际打开之间仍存在时间间隔，静态祖先校验不等于防御并发恶意修改文件系统；本轮未复现这种攻击。凭据环境与诊断替换减少命令行暴露，不证明报告全文或子进程环境对本地同权限主体保密。

#### 证据与依据

**依据 1 · 源码核查**：[audit.py:6564-6594](https://github.com/toby-bridges/api-relay-audit/blob/d261bcc196c43dfd072ae24210dd57870399437b/audit.py#L6564-L6594)

探针异常保留报告并转为未知，避免整轮丢失。

<details>
<summary>查看原文（31行）</summary>

```text
def _run_step(name, reporter, step_fn, *args, default=None, crashes=None):
    """Run ``step_fn(*args)`` with fail-open exception handling.

    If ``crashes`` is a list, the step name is appended to it on
    failure so the risk-matrix section can add a catch-all MEDIUM
    escalation for ANY step crash — not just the dimension-bearing
    steps that have their own d1i..d6i flags.
    """
    try:
        return step_fn(*args)
    except KeyboardInterrupt:
        raise
    except Exception as e:
        import traceback
        exc_type = type(e).__name__
        print(
            f"\n[{name}] CRASHED: {exc_type}: {e}",
            file=sys.stderr,
        )
        traceback.print_exc(file=sys.stderr)
        if crashes is not None:
            crashes.append(name)
        try:
            reporter.flag(
                "yellow",
                f"{name} crashed mid-step: {exc_type}: {e} "
                f"(continued with inconclusive default)",
            )
        except Exception:
            pass  # Reporter itself is broken; stderr already has the trace
        return default
```

</details>

**依据 2 · 源码核查**：[audit.py:6826-6864](https://github.com/toby-bridges/api-relay-audit/blob/d261bcc196c43dfd072ae24210dd57870399437b/audit.py#L6826-L6864)

未知与已知风险共用三档评级，HIGH包括SSE异常。

<details>
<summary>查看原文（39行）</summary>

```text
    # Overall rating
    # Dimensions (v3, post-v1.7.5):
    #   D1  = hidden system-prompt injection > 100 tokens   (Step 3)
    #   D1i = Step 3 crashed / inconclusive                 (Step 3)
    #   D2  = caller system instruction not followed        (Step 5)
    #   D2i = Step 5 crashed / inconclusive                 (Step 5)
    #   D3  = tool-call package substitution detected       (Step 8)
    #   D3i = Step 8 inconclusive (all probes errored)      (Step 8)
    #   D4  = error response leakage (critical or high)     (Step 9)
    #   D4m = error response leakage (medium only)          (Step 9)
    #   D4i = Step 9 inconclusive                           (Step 9)
    #   D5  = stream integrity anomaly detected             (Step 10)
    #   D5i = Step 10 inconclusive (non-Anthropic / broken) (Step 10)
    #   D6  = Web3 prompt injection detected                (Step 11, profile=web3|full)
    #   D6i = Step 11 inconclusive                          (Step 11, profile=web3|full)
    # Rules (first match wins):
    #   d3 or d4 or d5 or d6                        -> HIGH
    #   d1 and d2                                   -> HIGH
    #   d1                                          -> MEDIUM
    #   d2                                          -> MEDIUM
    #   d1i or d2i or d3i or d4i or d4m or d5i or d6i or any_crashed -> MEDIUM
    #   else                                        -> LOW
    report.h2("14. Overall Rating")
    any_step_crashed = bool(step_crashes)
    d1 = injection is not None and injection > 100
    d1i = injection is None
    d2 = overridden is not None and overridden
    d2i = overridden is None
    d3 = substitution_detected
    d3i = substitution_inconclusive
    d4 = err_severity in ("critical", "high")
    d4m = err_severity == "medium"
    d4i = err_inconclusive
    d5 = stream_verdict == "anomaly"
    d5i = stream_inconclusive
    d6 = web3_inj_verdict == "anomaly"
    d6i = web3_inj_inconclusive
    if d3 or d4 or d5 or d6:
        risk_level = "HIGH"
```

</details>

**依据 3 · 源码核查**：[audit.py:6920-6975](https://github.com/toby-bridges/api-relay-audit/blob/d261bcc196c43dfd072ae24210dd57870399437b/audit.py#L6920-L6975)

MEDIUM原因明确列出崩溃及协议不兼容。

<details>
<summary>查看原文（56行）</summary>

```text
        report.p("### MEDIUM RISK\n")
        medium_reasons = []
        if any_step_crashed:
            crashed_names = ", ".join(step_crashes)
            medium_reasons.append(
                f"One or more audit steps **crashed** ({crashed_names}): "
                "the audit is incomplete and should be re-run to get "
                "a definitive verdict."
            )
        if d1i:
            medium_reasons.append(
                "Token injection test (Step 3) **crashed or was inconclusive**: "
                "the relay's injection behavior could not be verified."
            )
        if d2i:
            medium_reasons.append(
                "Instruction override test (Step 5) **crashed or was inconclusive**: "
                "whether the relay respects user system prompts could not be verified."
            )
        if d3i:
            medium_reasons.append(
                "Tool-call substitution test (Step 8) was **inconclusive**: "
                "every probe errored, so the relay's AC-1.a behavior could not "
                "be verified -- a relay that blocks plaintext echo is itself a red flag."
            )
        if d4m:
            medium_reasons.append(
                "Error response leaks filesystem paths or stack traces. "
                "Information disclosure is present but not directly credential-exposing."
            )
        if d4i:
            medium_reasons.append(
                "Error leakage test (Step 9) was **inconclusive**: every probe "
                "returned HTTP 200 or failed with a transport error, so no error "
                "surface could be inspected."
            )
        if d5i:
            medium_reasons.append(
                "Stream integrity test (Step 10) was **inconclusive**: the relay "
                "did not speak Anthropic SSE cleanly, so the event-layer invariants "
                "could not be verified. A relay that cannot return a standard "
                "Anthropic stream is itself a suspicious signal."
            )
        if d6i:
            medium_reasons.append(
                "Web3 prompt injection test (Step 11) was **inconclusive**: all "
                "three Web3 probes errored or produced ambiguous responses, so "
                "Web3 safety behavior could not be verified."
            )
        report.p(" ".join(medium_reasons))
    else:
        risk_level = "LOW"
        report.p("### LOW RISK\n")
        report.p("No significant injection, instruction override, tool-call "
                 "substitution, error response leakage, stream integrity "
                 "anomaly, or Web3 injection detected.")
```

</details>

**依据 4 · 源码核查**：[dsh/index.js:435-473](https://github.com/toby-bridges/api-relay-audit/blob/d261bcc196c43dfd072ae24210dd57870399437b/dsh/index.js#L435-L473)

中断返回部分报告，非零退出脱敏但不验证报告安全结论。

<details>
<summary>查看原文（39行）</summary>

```text
    const handle = ctx.subprocess.spawn({
      argv,
      cwd: workspace,
      stdio: {
        stdin: 'ignore',
        stdout: { maxBytes: OUTPUT_LIMIT_BYTES },
        stderr: { maxBytes: OUTPUT_LIMIT_BYTES },
      },
      graceMs: PROCESS_GRACE_MS,
      signal: invocation.signal,
      env: { [CHILD_KEY_ENV]: secret },
    })
    const outcome = await handle.done
    const reportExists = await fileExists(reportPath)

    if (invocation.signal.aborted) {
      return {
        kind: 'error',
        text: reportExists
          ? `Audit canceled. Partial report: ${reportPath}`
          : 'Audit canceled; no report was generated.',
      }
    }
    if (outcome.exitCode !== 0) {
      const diagnostic = diagnosticTail(handle, secret)
      const report = reportExists ? `\nReport: ${reportPath}` : ''
      const detail = diagnostic.length > 0 ? `\n${diagnostic}` : ''
      return {
        kind: 'error',
        text: `Audit process exited with code ${String(outcome.exitCode)}.${report}${detail}`,
      }
    }
    if (!reportExists) {
      throw new Error('audit.py exited successfully but did not create its report')
    }
    return { kind: 'success', text: `Report: ${reportPath}` }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { kind: 'error', text: redactSecret(message, secret) }
```

</details>

#### 缺口

- 协议异常与恶意行为的区分准确率未知
  **影响**：若用评级自动禁用线路可能误封
  **进一步探讨**：使用可控延迟、断流、协议转换和真实篡改分别标注原因，统计同类误报

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么范围值得试用，成本和退出如何控制？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合已能配置 DSH 线路且愿意逐项审阅证据的开发者做上线前筛查。先用低成本连通检查确认接线，再决定是否运行计费探针；完整审计需要承担模型调用、长上下文、网络重试及人工归因成本，仓库没有可用的同条件成本实测。报告是本地输出，退出可停止命令、保留部分报告并回到独立脚本或手动 HTTP 检查；已发送给中转的内容不能撤回。只有报告成功生成、未知项可辨认且没有真实秘密进入测试内容时，才继续小范围审阅。持续出现无法判断、敏感报告无法控制或预算无法预测时，应停止扩大流量，不能因 LOW 就信任生产。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:32-48](https://github.com/toby-bridges/api-relay-audit/blob/d261bcc196c43dfd072ae24210dd57870399437b/dsh/index.js#L32-L48)

默认完整审计可能计费，提供连通性检查及路径选项。

<details>
<summary>查看原文（17行）</summary>

```text
const USAGE = `Usage: /relay-audit [audit options]

Uses the current DSH provider/model. This DSH adapter currently accepts only
routes declaring a Claude model; other routes are refused before any probe.
No options runs the full audit and may consume metered tokens.
Use --connectivity first for the lower-cost connectivity check.

Target overrides:
  --url <URL>
  --model <claude-model>
  --credential-ref <DSH_CREDENTIAL_REF>

Output paths:
  --output <workspace path>
  --transparent-log <workspace path>

Raw --key and caller-supplied --key-env are not accepted.`
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:450-470](https://github.com/toby-bridges/api-relay-audit/blob/d261bcc196c43dfd072ae24210dd57870399437b/dsh/index.js#L450-L470)

取消保留部分报告并区分进程成功。

<details>
<summary>查看原文（21行）</summary>

```text
    if (invocation.signal.aborted) {
      return {
        kind: 'error',
        text: reportExists
          ? `Audit canceled. Partial report: ${reportPath}`
          : 'Audit canceled; no report was generated.',
      }
    }
    if (outcome.exitCode !== 0) {
      const diagnostic = diagnosticTail(handle, secret)
      const report = reportExists ? `\nReport: ${reportPath}` : ''
      const detail = diagnostic.length > 0 ? `\n${diagnostic}` : ''
      return {
        kind: 'error',
        text: `Audit process exited with code ${String(outcome.exitCode)}.${report}${detail}`,
      }
    }
    if (!reportExists) {
      throw new Error('audit.py exited successfully but did not create its report')
    }
    return { kind: 'success', text: `Report: ${reportPath}` }
```

</details>

**依据 3 · 作者声明**：[README.md:77-93](https://github.com/toby-bridges/api-relay-audit/blob/d261bcc196c43dfd072ae24210dd57870399437b/README.md#L77-L93)

JSON不会自动脱敏，且审计不提供安全认证。

<details>
<summary>查看原文（17行）</summary>

```text
Without `--output`, stdout contains one JSON document and progress goes to
stderr. JSON preserves the existing final risk rating and full Markdown
evidence; it does not sanitize the report for public sharing. See the
[JSON schema and coverage boundaries](./docs/json-report.md).

## When to Use It

- You use a third-party AI API relay, mirror, gateway, or LLM proxy.
- You want to check whether a Claude-compatible or OpenAI-compatible proxy injects prompts, swaps models, truncates context, or rewrites tool output.
- You are testing relay behavior before production traffic, coding-agent automation, package-install suggestions, or wallet-related actions.
- You need a local, repeatable audit report instead of a web tool that asks for your API key.

## What It Does Not Claim

- It does not certify that a relay is safe.
- It does not replace manual security review or operational monitoring.
- It does not treat `inconclusive` as `clean`; blocked probes and ambiguous responses stay visible in the report.
```

</details>

#### 缺口

- 缺少任务调用量、现金账单和人工审阅时间
  **影响**：无法计算单位合格报告成本
  **进一步探讨**：对固定代理和固定探针组合记录账单、失败尝试和审阅时间，报告现金与时间分列

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 双轴输出能否减少把网络故障当攻击的误判？

**研究主题**：新假设与验证

#### 完整回答

从未知和攻击共用评级的事实，可以提出未验证的双轴报告假设：分别呈现“完成覆盖”与“异常证据”，保留原有风险摘要作为兼容输出。用户可先判断探针是否有效，再决定是否将异常归因于攻击。最小验证是在同一批透明代理、受控断流代理及已知篡改代理上，对比原报告和双轴报告，盲评正确归因率、未知识别率及审阅时间。若双轴没有改善归因或显著增加阅读负担，否定本次设计；不能把这个研究者假设计入当前插件创新。

#### 证据与依据

**依据 1 · 源码核查**：[audit.py:6841-6847](https://github.com/toby-bridges/api-relay-audit/blob/d261bcc196c43dfd072ae24210dd57870399437b/audit.py#L6841-L6847)

单评级把未知与多类检测维度合并，提供设计推导起点。

```text
    # Rules (first match wins):
    #   d3 or d4 or d5 or d6                        -> HIGH
    #   d1 and d2                                   -> HIGH
    #   d1                                          -> MEDIUM
    #   d2                                          -> MEDIUM
    #   d1i or d2i or d3i or d4i or d4m or d5i or d6i or any_crashed -> MEDIUM
    #   else                                        -> LOW
```

**依据 2 · 源码核查**：[audit.py:6920-6967](https://github.com/toby-bridges/api-relay-audit/blob/d261bcc196c43dfd072ae24210dd57870399437b/audit.py#L6920-L6967)

详细原因已有数据，可作为双轴材料来源。

<details>
<summary>查看原文（48行）</summary>

```text
        report.p("### MEDIUM RISK\n")
        medium_reasons = []
        if any_step_crashed:
            crashed_names = ", ".join(step_crashes)
            medium_reasons.append(
                f"One or more audit steps **crashed** ({crashed_names}): "
                "the audit is incomplete and should be re-run to get "
                "a definitive verdict."
            )
        if d1i:
            medium_reasons.append(
                "Token injection test (Step 3) **crashed or was inconclusive**: "
                "the relay's injection behavior could not be verified."
            )
        if d2i:
            medium_reasons.append(
                "Instruction override test (Step 5) **crashed or was inconclusive**: "
                "whether the relay respects user system prompts could not be verified."
            )
        if d3i:
            medium_reasons.append(
                "Tool-call substitution test (Step 8) was **inconclusive**: "
                "every probe errored, so the relay's AC-1.a behavior could not "
                "be verified -- a relay that blocks plaintext echo is itself a red flag."
            )
        if d4m:
            medium_reasons.append(
                "Error response leaks filesystem paths or stack traces. "
                "Information disclosure is present but not directly credential-exposing."
            )
        if d4i:
            medium_reasons.append(
                "Error leakage test (Step 9) was **inconclusive**: every probe "
                "returned HTTP 200 or failed with a transport error, so no error "
                "surface could be inspected."
            )
        if d5i:
            medium_reasons.append(
                "Stream integrity test (Step 10) was **inconclusive**: the relay "
                "did not speak Anthropic SSE cleanly, so the event-layer invariants "
                "could not be verified. A relay that cannot return a standard "
                "Anthropic stream is itself a suspicious signal."
            )
        if d6i:
            medium_reasons.append(
                "Web3 prompt injection test (Step 11) was **inconclusive**: all "
                "three Web3 probes errored or produced ambiguous responses, so "
                "Web3 safety behavior could not be verified."
```

</details>

#### 缺口

- 尚无使用者归因实验
  **影响**：不能宣称双轴更易用
  **进一步探讨**：准备同数据不同呈现的匿名报告进行盲评并记录错误类型

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
