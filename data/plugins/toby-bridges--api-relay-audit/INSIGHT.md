# API Relay Audit

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3af7126](https://github.com/toby-bridges/api-relay-audit/tree/3af7126a34d099f65031c6e3af63b302a843fe59)

<!-- BEGIN META -->
[![GitHub ★ 902](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=902&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/toby-bridges/api-relay-audit) [![npm 30d 513](https://img.shields.io/static/v1?label=npm+30d&message=513&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-api-relay-audit) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-api-relay-audit)
<!-- END META -->

> **功能**：本地探测 AI API 中转行为并生成审计报告。

> **亮点**：[Q01](#research-q01) 集中可重复的中转行为探测与报告，[Q02](#research-q02) 提供 DSH 凭据和命令接入。

> **主要限制**：[Q03](#research-q03) curl -k 不验证 TLS 证书；报告与诊断脱敏范围不同，[Q01](#research-q01) 信号不等于安全证明。

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
  - [Q01 · 谁需要中转审计，相对手工探测有什么增量？](#detail-section-11)
  - [Q02 · DSH 命令如何选择目标、凭据及报告？](#detail-section-12)
  - [Q03 · 密钥、TLS 和取消失败的真实边界是什么？](#detail-section-13)
  - [Q04 · 运行前需满足哪些条件、成本与停止条件？](#detail-section-14)
  - [Q05 · 如何支持用户判断哪些结果值得复核？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用第三方 AI 中转前需要了解其请求和响应行为。

使用者手工构造请求并复核供应商行为。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| relay-audit 命令 | 选择 provider 并启动本地探测 | 模型基线与宿主版本受限 |
| 报告 | 组织探测证据 | 不等于安全认证或公开脱敏 |
| 传输 | 发送受限时间的请求 | curl -k 不验证证书 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| 兼容 DSH 和 Node | DSH 模式需要 | 解析 provider 与命令 | 无法启动命令 |
| Python 和 curl | 必需 | 运行探测和 HTTP | 无法运行 |
| 被授权中转及测试凭据 | 必需 | 探测目标 | 不应发出请求 |
| 受控可信网络 | 采用前重要 | 降低 -k 证书不验证的风险 | 不使用生产凭据 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 确认目标授权、版本与隔离环境 | 身份不明停止 |
| 配置 | 以低权限临时凭据设置 DSH | 缺凭据拒绝运行 |
| 探测 | 明确费用后启动命令 | 取消或失败核对部分报告 |
| 复核 | 查看原始证据及未知项 | 不把信号当证明，撤销测试凭据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 准备 | 测试环境成本未知 | 核授权、凭据和网络 | TLS 证书未验证 |
| 探测 | API 请求费用未知 | 等待与记录 | 运行时间未知 |
| 恢复 | 报告保管成本未知 | 脱敏、撤销凭据和复核 | 报告可能敏感 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| DSH 命令 | 注入凭据、调用脚本并输出文件 | 实际宿主兼容 |
| 传输 | curl 发请求且限时 | 目标证书真实性 |
| 报告 | 作者描述多查询族和未知 | 检测准确率、安全认证 |

> **思考**：[Q03](#research-q03) curl -k 不验证 TLS 证书；报告与诊断脱敏范围不同，[Q01](#research-q01) 信号不等于安全证明。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中可重复的中转行为探测与报告，[Q02](#research-q02) 提供 DSH 凭据和命令接入。

[Q02](#research-q02) 原始密钥不接受作命令参数，[Q03](#research-q03) curl -k 跳过证书校验。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) curl -k 不验证 TLS 证书；报告与诊断脱敏范围不同，[Q01](#research-q01) 信号不等于安全证明。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅在授权的隔离环境使用低权限临时凭据；审查敏感报告并撤销凭据。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态核查命令入口、传输与报告边界；未发请求或测探针质量。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、dsh/index.js、audit.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定根 README、清单、DSH 命令和独立脚本的传输代表路径；未运行目标、网络探测、DSH 或真实报告。
- 下一步：[Q05](#research-q05) 先核已有报告字段，再用已知行为及失败样本对照。

**分析版本**

- **仓库**：[toby-bridges/api-relay-audit](https://github.com/toby-bridges/api-relay-audit)
- **版本号**：2.5.0（[固定提交 3af7126](https://github.com/toby-bridges/api-relay-audit/tree/3af7126a34d099f65031c6e3af63b302a843fe59)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设按结论显示覆盖和可回溯证据帮助人工复核；未验证。

[Q05](#research-q05) 先核已有报告字段，再用已知行为及失败样本对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 40 | 6710 | — | — | 63052 |
| .mjs | source | 9 | 1050 | 983 | 43 | — |
| .md | example | 1 | 81 | — | — | 570 |
| .js | source | 1 | 486 | 419 | 18 | — |
| .js | test | 2 | 616 | 575 | 14 | — |
| .mjs | test | 2 | 171 | 158 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/toby-bridges/api-relay-audit/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 入口、探测调用、凭据及判断限制。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要中转审计，相对手工探测有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:82-101 面向第三方 AI API 中转使用者，描述探测提示注入、上下文和模型替换信号。相对手写请求或只依赖供应商宣传，本项目包装成重复的本地审计报告及 DSH 命令；不同探针的检测效果、误报和节省时间都未独立测量。README 同时明确报告不是安全认证，自报身份和延迟不是模型替换的单独证明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:82-101](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/README.md#L82-L101)

作者给出场景、查询族和限制。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[package.json:1-10](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/package.json#L1-L10)

DSH 包与本地脚本入口。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "dsh-api-relay-audit",
  "version": "2.5.0",
  "description": "DeepSeek Harness bundle for running API Relay Audit locally",
  "type": "module",
  "main": "./dsh/index.js",
  "exports": {
    ".": "./dsh/index.js",
    "./audit.py": "./audit.py",
    "./cordis.patch.yml": "./dsh/cordis.patch.yml"
```

</details>

#### 缺口

- 未验证探针有效率或真实使用价值
  **影响**：不能将报告当安全认证
  **进一步探讨**：以受控的已知行为对照人工探测。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 命令如何选择目标、凭据及报告？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

dsh/index.js:125-150 拒绝原始 --key 与 --key-env 并接收其他参数；243-275 从当前 provider 或覆盖值解析 URL、模型和凭据引用，检查声明的 Claude 基线。382-445 要求绝对工作区、验证输出路径、解析凭据并用环境变量注入 Python 子进程；477-485 注册 /relay-audit 且 recordInput=false。audit.py:651-682 用 curl 发 JSON、stdin 提供头并设置超时。未运行网络，无法确认对端身份、费用或报告真实性。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:125-150](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/dsh/index.js#L125-L150)

拒绝调用方传入原始密钥。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:243-275](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/dsh/index.js#L243-L275)

目标解析和 Claude 基线限制。

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

**依据 3 · 源码核查**：[dsh/index.js:382-405](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/dsh/index.js#L382-L405)

工作区和目标解析。

<details>
<summary>查看原文（24行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[dsh/index.js:405-445](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/dsh/index.js#L405-L445)

凭据及子进程参数。

<details>
<summary>查看原文（41行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[dsh/index.js:477-485](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/dsh/index.js#L477-L485)

注册命令与关闭输入记录。

```text
/** Register the command globally for every DSH command-compatible surface. */
export function apply(ctx) {
  ctx.commands.register({
    name: 'relay-audit',
    description: 'run the local API relay security audit',
    input: { hint: '[audit.py options]' },
    recordInput: false,
    handler: invocation => executeAuditCommand(invocation, ctx),
  })
```

**依据 6 · 源码核查**：[audit.py:651-682](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/audit.py#L651-L682)

curl POST 和超时。

<details>
<summary>查看原文（32行）</summary>

```text
def curl_post_json(url: str, headers: dict, body: dict, timeout: int,
                   subprocess_module=subprocess) -> dict:
    """POST JSON through curl while keeping headers out of argv.

    Headers are passed through ``--config -`` so credentials do not show up
    in process listings. The JSON body is written to a short-lived file and
    sent via ``--data-binary @file`` so very large prompts do not hit Windows'
    32 KB command-line limit.
    """
    body_path = None
    try:
        with tempfile.NamedTemporaryFile(
            "w", encoding="utf-8", delete=False, prefix="api-relay-body-", suffix=".json"
        ) as tmp:
            json.dump(body, tmp)
            body_path = tmp.name

        cmd = ["curl", "-sk", *curl_loopback_no_proxy_args(url), "-X", "POST", url,
               "--max-time", str(timeout), "--config", "-", "--data-binary", f"@{body_path}"]
        config = curl_header_config(headers)
        r = subprocess_module.run(cmd, capture_output=True, text=True, input=config,
                                  timeout=timeout + 10)
    finally:
        if body_path:
            try:
                os.unlink(body_path)
            except OSError:
                pass

    if r.returncode != 0:
        raise RuntimeError(f"curl failed: {r.stderr[:200]}")
    return json.loads(r.stdout)
```

</details>

#### 缺口

- 未运行网络或实际报告
  **影响**：无法证明完整审计或兼容
  **进一步探讨**：用测试代理核调用及报告。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 密钥、TLS 和取消失败的真实边界是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

dsh/index.js:405-445 将凭据放入子进程环境而非命令参数，360-369 和 458-473 仅对错误诊断做密钥字符串替换；这不是报告全量脱敏或所有子进程和系统观测面的秘密隔离。audit.py:668-672 的 curl 使用 -sk，其中 -k 跳过 TLS 证书校验；因此即使 URL 为 HTTPS，该调用也不验证服务端证书，不能依靠此审计保护凭据对抗中间人。450-470 对取消、非零退出和缺报告返回错误，但部分报告可能存在；用户需隔离敏感文件并自行核结果。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:360-369](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/dsh/index.js#L360-L369)

诊断输出中的密钥字符串替换。

<details>
<summary>查看原文（10行）</summary>

```text
export function redactSecret(text, secret) {
  if (secret.length === 0) return text
  return text.split(secret).join('[REDACTED]')
}

function diagnosticTail(handle, secret) {
  const combined = [collectedText(handle, 'stdout'), collectedText(handle, 'stderr')]
    .filter(Boolean)
    .join('\n')
  return redactSecret(combined, secret).slice(-4_096).trim()
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:405-445](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/dsh/index.js#L405-L445)

凭据通过环境变量传子进程。

<details>
<summary>查看原文（41行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[audit.py:668-682](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/audit.py#L668-L682)

curl -sk、超时和错误处理。

<details>
<summary>查看原文（15行）</summary>

```text
        cmd = ["curl", "-sk", *curl_loopback_no_proxy_args(url), "-X", "POST", url,
               "--max-time", str(timeout), "--config", "-", "--data-binary", f"@{body_path}"]
        config = curl_header_config(headers)
        r = subprocess_module.run(cmd, capture_output=True, text=True, input=config,
                                  timeout=timeout + 10)
    finally:
        if body_path:
            try:
                os.unlink(body_path)
            except OSError:
                pass

    if r.returncode != 0:
        raise RuntimeError(f"curl failed: {r.stderr[:200]}")
    return json.loads(r.stdout)
```

</details>

**依据 4 · 源码核查**：[dsh/index.js:450-473](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/dsh/index.js#L450-L473)

取消、退出码和报告文件处理。

<details>
<summary>查看原文（24行）</summary>

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
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { kind: 'error', text: redactSecret(message, secret) }
```

</details>

**依据 5 · 作者声明**：[README.md:69-80](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/README.md#L69-L80)

JSON 报告不自动适合公开分享。

<details>
<summary>查看原文（12行）</summary>

````text
## JSON Reports

v2.5.0 supports `--format json` for local automation:

```bash
python audit.py --key-env API_RELAY_AUDIT_KEY --url <BASE_URL> --format json --output report.json
```

Without `--output`, stdout contains one JSON document and progress goes to
stderr. JSON preserves the existing final risk rating and full Markdown
evidence; it does not sanitize the report for public sharing. See the
[JSON schema and coverage boundaries](./docs/json-report.md).
````

</details>

#### 缺口

- 未做渗透测试及报告脱敏审计
  **影响**：无法保证端点身份、秘密或报告安全
  **进一步探讨**：采用隔离测试凭据并核对报告内容。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 运行前需满足哪些条件、成本与停止条件？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:30-39 限定 Node 与 DSH peer，README:43-44 指明 Python 标准库及 curl；固定源码的 curl -k 使生产凭据不适合在不可信网络上使用。审计会向所选中转发请求并可能产生供应商费用；报告和提示词可能敏感，费用、运行时间和探测覆盖率未测。优先使用受控测试环境与低权限临时凭据，在明确授权、网络隔离且能核对接收端的前提下检查报告；端点身份不确定、输出含敏感内容或探测失败则停止，撤销测试凭据并人工复核。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:30-39](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/package.json#L30-L39)

Node 和宿主版本。

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

**依据 2 · 作者声明**：[README.md:43-44](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/README.md#L43-L44)

Python、curl 和目标端点。

```text
The standalone script uses Python's standard library plus `curl`. Your API key
is sent only to the relay URL you choose.
```

**依据 3 · 源码核查**：[audit.py:668-672](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/audit.py#L668-L672)

传输跳过证书校验。

```text
        cmd = ["curl", "-sk", *curl_loopback_no_proxy_args(url), "-X", "POST", url,
               "--max-time", str(timeout), "--config", "-", "--data-binary", f"@{body_path}"]
        config = curl_header_config(headers)
        r = subprocess_module.run(cmd, capture_output=True, text=True, input=config,
                                  timeout=timeout + 10)
```

**依据 4 · 作者声明**：[README.md:69-80](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/README.md#L69-L80)

报告可能含私密证据。

<details>
<summary>查看原文（12行）</summary>

````text
## JSON Reports

v2.5.0 supports `--format json` for local automation:

```bash
python audit.py --key-env API_RELAY_AUDIT_KEY --url <BASE_URL> --format json --output report.json
```

Without `--output`, stdout contains one JSON document and progress goes to
stderr. JSON preserves the existing final risk rating and full Markdown
evidence; it does not sanitize the report for public sharing. See the
[JSON schema and coverage boundaries](./docs/json-report.md).
````

</details>

#### 缺口

- 未实测费用、环境或端点安全
  **影响**：无法量化采用成本及安全性
  **进一步探讨**：隔离环境与临时凭据，核报告再决定。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何支持用户判断哪些结果值得复核？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有 JSON 报告已保留风险、证据和 inconclusive；简单重排风险标签不构成新增。未验证设想是按每个结论展示可追踪探针覆盖、失败/未运行原因、原始证据位置和明确的下一次人工核查动作，使用户能决定放行、补测或停止；应先核现有 JSON 是否已有等价映射。以现有报告为对照，测试超时、被阻断、模型自报不一致和已知替换样本，比较漏看未知、误把信号当证明和审查时间；若覆盖无法可靠回溯、误判不降或人工负担显著增加则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:69-80](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/README.md#L69-L80)

JSON 保留风险与完整证据。

<details>
<summary>查看原文（12行）</summary>

````text
## JSON Reports

v2.5.0 supports `--format json` for local automation:

```bash
python audit.py --key-env API_RELAY_AUDIT_KEY --url <BASE_URL> --format json --output report.json
```

Without `--output`, stdout contains one JSON document and progress goes to
stderr. JSON preserves the existing final risk rating and full Markdown
evidence; it does not sanitize the report for public sharing. See the
[JSON schema and coverage boundaries](./docs/json-report.md).
````

</details>

**依据 2 · 作者声明**：[README.md:89-101](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/README.md#L89-L101)

已有 inconclusive 和信号边界。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[dsh/index.js:450-470](https://github.com/toby-bridges/api-relay-audit/blob/3af7126a34d099f65031c6e3af63b302a843fe59/dsh/index.js#L450-L470)

命令报告进程状态。

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

#### 缺口

- 未穷尽报告字段及缺少原型
  **影响**：新增性及收益未知
  **进一步探讨**：检查现有 JSON 再做已知样本对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
