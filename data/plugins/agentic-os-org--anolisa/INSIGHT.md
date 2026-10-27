# ANOLISA

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[6f04450](https://github.com/agentic-os-org/ANOLISA/tree/6f0445082738b8206f0aad37cf0af92b58bd7a15)

<!-- BEGIN META -->
[![GitHub ★ 641](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=641&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentic-os-org/ANOLISA)
<!-- END META -->

> **功能**：基于既有操作系统，为 Agent 提供上下文、技能、工作区恢复、安全与观测组件的软件栈。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持把选择性压缩、恢复能力和宿主工具结果生命周期接合，给系统优化明确失败退路；不将根栈全部主张算成已核实现。

> **主要限制**：[Q03](#research-q03) 压缩率不能代替合格任务净费用，marker恢复依赖同一CLI与状态；所查AgentSight仅status，不能据active声称完整轨迹或安全约束已启用。

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
  - [Q01 · 根项目是什么，系统栈贡献如何限定？](#detail-section-11)
  - [Q02 · Tokenless怎样压缩工具结果并保留恢复退路？](#detail-section-12)
  - [Q03 · 观测、安全及总成本有哪些不能扩大解释的边界？](#detail-section-13)
  - [Q04 · 谁值得试用哪个子能力，怎样证伪净收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Agent平台开发者希望在保留现有宿主时接入底层输出优化等能力，本轮以DSH工具输出为具体任务。

保留原工具全文或手工截短；DSH适配不等同完整OS栈和所有治理组件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Tokenless结果适配 | 选择性压缩成功单文本输出 | 需本地CLI，失败保留原文 |
| 恢复条件检查 | 确保marker命令匹配压缩CLI | 不证明端到端恢复已验 |
| AgentSight状态 | 查询插件版本和active | 仅status，不证明轨迹采集 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH工具钩子与shellEnv | 适配必需 | 截获并替换结果 | 无法介入 |
| Tokenless CLI与可写状态 | 压缩必需 | 运行格式管线与stash | 失败放行原结果 |
| 同文件retrieve命令 | marker恢复必需 | 模型取回原文 | 不应启用不可恢复marker |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者隔离profile并固定CLI | 压缩与retrieve身份一致 |
| 工具完成 | 适配只处理合格成功文本 | 其他结果原样放行 |
| 压缩恢复 | CLI返回applied才替换 | 需要时精确取回原文 |
| 验收退出 | 用户核答案与总成本 | 不合格关闭压缩 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 系统CLI与本地stash | 版本、权限和profile配置 | 耗时未知 |
| 持续使用 | 工具后子进程、存储及模型token | 核格式和任务正确性 | 实际净费用未知 |
| 失败恢复 | retrieve和重复推理资源 | 检查marker及保留原文 | 完整恢复未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 选择性压缩 | 文件/错误/小输入等可放行 | 各格式任务语义保持 |
| 恢复条件 | CLI身份检查及stash接口 | 真实原文取回与全成本 |
| 观测适配 | agentsight_status可报告active | 完整轨迹和安全效果 |

> **思考**：[Q03](#research-q03) 压缩率不能代替合格任务净费用，marker恢复依赖同一CLI与状态；所查AgentSight仅status，不能据active声称完整轨迹或安全约束已启用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持把选择性压缩、恢复能力和宿主工具结果生命周期接合，给系统优化明确失败退路；不将根栈全部主张算成已核实现。

[Q02](#research-q02) 先尊重后续策略decision、协议校验失败保原文和压缩/恢复CLI身份匹配值得借鉴；移植要保持工具来源、进程和状态边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 压缩率不能代替合格任务净费用，marker恢复依赖同一CLI与状态；所查AgentSight仅status，不能据active声称完整轨迹或安全约束已启用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 限Tokenless隔离试用，完整恢复与任务费用都合格才继续，不据status启用全栈治理。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

Tokenless DSH钩子到CLI运行时有源码支持；各格式语义、完整恢复和系统栈其他能力未验。

- 已检查：作者 README、包清单、源码路径 README.md、src/tokenless/adapters/tokenless/dsh/dist/index.js、src/tokenless/crates/tokenless-cli/src/main.rs、src/tokenless/crates/tokenless-runtime/src/post_tool/pipeline.rs、src/agentsight/dsh-plugin/src/index.ts、src/agentsight/dsh-plugin/README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根基础设施限定核DSH Tokenless钩子、CLI入口、部分Rust pipeline和AgentSight status；其他安全/快照/技能组件未核。
- 下一步：比较同工具结果压缩关/开，核字段依赖、原文恢复、失败放行及全部模型/进程成本；未执行。

**分析版本**

- **仓库**：[agentic-os-org/ANOLISA](https://github.com/agentic-os-org/ANOLISA)
- **版本号**：未声明（[固定提交 6f04450](https://github.com/agentic-os-org/ANOLISA/tree/6f0445082738b8206f0aad37cf0af92b58bd7a15)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出任务敏感字段和恢复可用性的压缩回执，未验证；如果不能保持正确性与净费用，则否定相应压缩策略。

比较同工具结果压缩关/开，核字段依赖、原文恢复、失败放行及全部模型/进程成本；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 684 | 157831 | — | — | 1414593 |
| .js | source | 45 | 11402 | 9185 | 1425 | — |
| .js | test | 6 | 2193 | 2027 | 40 | — |
| .ts | test | 421 | 162077 | 133721 | 9095 | — |
| .ts | source | 635 | 147941 | 110656 | 23231 | — |
| .tsx | test | 60 | 24618 | 20041 | 1824 | — |
| .tsx | source | 193 | 46320 | 40094 | 3347 | — |
| .md | example | 26 | 1961 | — | — | 212281 |
| .ts | example | 1 | 60 | 50 | 6 | — |
| .mjs | test | 22 | 7256 | 6701 | 191 | — |
| .md | test | 8 | 1531 | — | — | 16862 |
| .mjs | example | 42 | 5592 | 5351 | 71 | — |
| .cjs | test | 33 | 8216 | 6908 | 674 | — |
| .mjs | source | 32 | 4482 | 4110 | 144 | — |

</details>

**活跃度**

[![Issue 未关闭 771](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=771&color=737b86&logo=github)](https://github.com/agentic-os-org/ANOLISA/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2,364](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2%2C364&color=737b86&logo=github)](https://github.com/agentic-os-org/ANOLISA/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 1,636](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1%2C636&color=737b86&logo=github)](https://github.com/agentic-os-org/ANOLISA/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：系统优化怎样接入DSH且保持工具结果可恢复和能力边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目是什么，系统栈贡献如何限定？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

ANOLISA是建立在既有OS上的多组件基础设施，面向运行Agent的开发者和平台团队，提供上下文、技能、工作区恢复、安全和观测等组合方向；不是一个可以凭根目录安装就全部启用的DSH插件。本轮限定研究DSH的Tokenless工具输出适配与AgentSight状态工具，其他系统组件只记作者范围。相对手工压缩长工具输出、分别配置底层工具，贡献可追到系统CLI与宿主生命周期的接合；不能把安全徽章、镜像目录或“OS”名称当完整运行隔离和全部能力验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:34-47](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/README.md#L34-L47)

作者定义系统栈和既有OS归属。

<details>
<summary>查看原文（14行）</summary>

```text
**ANOLISA is a multi-component system software stack for AI Agent workloads.**
Built on existing operating system kernels and infrastructure, it provides
context management, Skills delivery, workspace recovery, security, and
observability for Agent applications, frameworks and platforms.
**Users** can carry out tasks in a native terminal that preserves a familiar
Shell experience, and enable system-level optimizations for their Agents'
runtime environments. **Developers** can extend the stack through
[AW's open architecture](https://agentic-os.sh/docs/developer-guide/aw/providers/)
by integrating their own system software optimized for Agent workloads into ANOLISA.

> **ANOLISA vs. Agentic OS:** Agentic OS describes a class of operating systems
> designed for AI Agent workloads. Our community takes a neutral and open
> approach to exploring this direction; ANOLISA is the core system software
> stack in the Agentic OS architecture we design.
```

</details>

**依据 2 · 作者声明**：[README.md:100-129](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/README.md#L100-L129)

通过适配启用系统能力的任务。

<details>
<summary>查看原文（30行）</summary>

```text
### 1.3 Enable ANOLISA for an existing Agent

If you want to keep using an existing Agent application, framework, or harness,
you can enable ANOLISA's headless system capabilities in its runtime environment
through adapters and plugins. You can continue using the Agent's interface,
model account, and workflow.

For the currently available workflow, see [installation and adapter integration](https://agentic-os.sh/docs/user-guide/getting-started/installation/).

<a id="why-anolisa"></a>

## 2. Why ANOLISA?

**ANOLISA is a system software stack that enhances Agent applications,
frameworks, and harnesses without replacing them.**

When Agents plan tasks and call tools, they also need their runtime environments
to provide context management, Skill discovery, action constraints, and execution
records. ANOLISA improves an Agent's working environment in the following ways:

- **Keep context for useful information.** Tool output compression shortens
  lengthy results. Persistent memory lets Agents retrieve and reuse information
  across sessions, reducing repeated reads.
- **Find system Skills for the task.** Agents can consult OS instructions and
  discover and read the Skills they need for a task.
- **Constrain actions and recover workspace changes.** Security policies and
  underlying isolation mechanisms constrain Agent actions. Workspace snapshots
  let users inspect file changes and roll them back when needed.
- **Understand how a task ran.** You can inspect an Agent's model and tool calls,
  trajectories, and Token usage to investigate task failures and analyze runtime
```

</details>

**依据 3 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:1-8](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/src/tokenless/adapters/tokenless/dsh/dist/index.js#L1-L8)

DSH适配依赖本地Tokenless CLI。

```text
/**
 * Native Tokenless plugin for DeepSeek Harness (dsh).
 *
 * This entry intentionally has no dsh runtime imports. DSH supplies the
 * Cordis event types at runtime, while the only process boundary is the
 * installed Tokenless CLI. Keeping the entry dependency-free lets ANOLISA
 * install one self-contained bundle without running npm in $DSH_HOME.
 */
```

**依据 4 · 源码核查**：[src/agentsight/dsh-plugin/src/index.ts:44-50](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/src/agentsight/dsh-plugin/src/index.ts#L44-L50)

所查AgentSight适配仅返回status。

```text
    async execute() {
      return {
        plugin: 'agentsight',
        version: pkg.version as string,
        active: true,
        capabilities: ['status'],
      }
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Tokenless怎样压缩工具结果并保留恢复退路？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DSH tools/post-execute waterfall先取得其他策略decision，只在accept、未中止且单文本成功结果时压缩，嵌套工具与已替换成功值跳过，避免覆盖其他策略。适配经execFile调用tokenless compress，传协议v2 JSON，默认3秒与缓冲上限，执行或响应校验失败返回undefined，继续原decision；只有disposition=applied才替换给模型的正文。CLI解析请求并分派Rust运行时，pipeline把文件内容、错误、小输入和不支持内容原样放行。恢复能力开启前检查compress所选CLI和PATH上retrieve是同一文件，减少给模型一个无法取回的marker。这里核实的是选择性输出替换和进程失败退路，不是所有压缩语义等价或恢复已运行通过。

#### 证据与依据

**依据 1 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:156-173](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/src/tokenless/adapters/tokenless/dsh/dist/index.js#L156-L173)

压缩与恢复CLI身份匹配。

<details>
<summary>查看原文（18行）</summary>

```text
/** Require compression and Marker recovery to invoke the same CLI file. */
function tokenlessRetrieveCommandAvailable(config) {
  const markerBinary = executableOnPath('tokenless')
  if (markerBinary === undefined) return false
  const selected = tokenlessBinary(config)
  const selectedBinary = isAbsolute(selected)
    ? selected
    : (selected.includes('/') ? resolve(selected) : executableOnPath(selected))
  if (selectedBinary === undefined) return false
  try {
    accessSync(selectedBinary, constants.X_OK)
    const markerStat = statSync(markerBinary)
    const selectedStat = statSync(selectedBinary)
    return selectedStat.isFile()
      && markerStat.dev === selectedStat.dev
      && markerStat.ino === selectedStat.ino
  } catch {
    return false
```

</details>

**依据 2 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:297-339](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/src/tokenless/adapters/tokenless/dsh/dist/index.js#L297-L339)

子进程边界、时限与协议校验。

<details>
<summary>查看原文（43行）</summary>

```text
/** Execute a child process with bounded output and explicit stdin. */
function runTokenless(binary, request, options) {
  return new Promise((resolve, reject) => {
    let child
    try {
      child = execFile(binary, ['compress'], options, (error, stdout) => {
        if (error) {
          reject(error)
          return
        }
        resolve(stdout)
      })
    } catch (error) {
      reject(error)
      return
    }
    child.stdin?.on('error', () => {})
    child.stdin?.end(JSON.stringify(request))
  })
}

/** Run one PostTool operation and reject malformed transport responses. */
async function runPostTool(request, exec, config) {
  try {
    const stdout = await runTokenless(tokenlessBinary(config), request, {
      timeout: positiveInteger(valueOr(config, 'timeoutMs', undefined), DEFAULT_TIMEOUT_MS),
      maxBuffer: positiveInteger(valueOr(config, 'maxBuffer', undefined), DEFAULT_MAX_BUFFER),
      encoding: 'utf8',
      windowsHide: true,
      signal: exec.signal,
      env: {
        ...process.env,
        TOKENLESS_DATA_DIR: prepareTokenlessDataDir(exec),
      },
    })
    const response = JSON.parse(stdout)
    if (!response || typeof response !== 'object' || Array.isArray(response)) return undefined
    if (response.protocol_version !== 2 || response.operation !== 'post_tool') return undefined
    const result = response.result
    if (!result || typeof result !== 'object' || Array.isArray(result)) return undefined
    return result
  } catch {
    return undefined
```

</details>

**依据 3 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:409-468](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/src/tokenless/adapters/tokenless/dsh/dist/index.js#L409-L468)

真实钩子、跳过条件和输出替换。

<details>
<summary>查看原文（60行）</summary>

```text
  ctx.on('tools/post-execute', async (exec, result, next) => {
    // DSH post-execute is a waterfall; later policies own the final projection.
    const decision = await next()
    if (decision.kind !== 'accept' || exec.signal?.aborted) return decision

    const toolName = exec.name.toLowerCase()
    const isCommand = COMMAND_TOOLS.has(toolName)
    const replacesValue = Object.prototype.hasOwnProperty.call(decision, 'value')
    const effectiveValue = replacesValue ? decision.value : result.value
    const structuredFailure = isCommand && commandFailed(effectiveValue)

    if (replacesValue) {
      if (!structuredFailure) return decision
      const content = failureText(undefined, effectiveValue)
      const request = postToolRequest(
        exec,
        config,
        content,
        'error',
        'command_output',
        false,
        'tool',
        false,
      )
      const response = await runPostTool(request, exec, config)
      const diagnostic = response?.disposition === 'tool_error'
        ? response.additional_context
        : undefined
      return withDiagnostic(decision, diagnostic)
    }

    const abortCode = result?.isError === true ? result.error?.info?.code : undefined
    const interrupted = INTERRUPTED_CODES.has(abortCode)
    const failed = result?.isError === true || structuredFailure
    const status = interrupted ? 'interrupted' : (failed ? 'error' : 'success')

    if (status === 'success') {
      if (!compressionEnabled || exec.parent !== undefined) return decision
      const effectiveContent = decision.content ?? result.content
      const content = singleText(effectiveContent)
      if (content === undefined) return decision
      const retrieveResult = isTokenlessRetrieveCommand(exec.name, exec.arguments)
      const request = postToolRequest(
        exec,
        config,
        content,
        status,
        contentOrigin(exec.name),
        true,
        retrieveResult ? 'retrieve' : 'tool',
        !retrieveResult && tokenlessRetrieveCommandAvailable(config),
      )
      const response = await runPostTool(request, exec, config)
      if (response?.disposition !== 'applied' || typeof response.output !== 'string') {
        return decision
      }
      return {
        ...decision,
        content: [{ type: 'text', text: response.output }],
      }
```

</details>

**依据 4 · 源码核查**：[src/tokenless/crates/tokenless-cli/src/main.rs:647-677](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/src/tokenless/crates/tokenless-cli/src/main.rs#L647-L677)

CLI请求解析及stash开启条件。

<details>
<summary>查看原文（31行）</summary>

```text
fn run_command(command: Commands) -> Result<(), (String, i32)> {
    match command {
        Commands::Compress { file, stash_db } => {
            let input = read_input(&file).map_err(|e| (e, 2))?;
            // Undecodable or version-mismatched requests carry no content to
            // echo, so no fail-open response can be built: exit 2.
            let request = RequestEnvelope::from_json(&input).map_err(|e| (e.to_string(), 2))?;

            // PostTool dry-runs still open the configured store to verify that
            // recovery is available. The pipeline substitutes an in-memory
            // store for candidate generation, so the persistent store receives
            // no Stash entries while the original result is emitted.
            let config = TokenlessConfig::load();
            let database_paths = DatabasePathResolver::default();
            let compression_on = config.is_compression_enabled();
            let needs_stash = match &request.request {
                Request::BeforeModel(value) => {
                    compression_on
                        && matches!(
                            value.capabilities.recovery,
                            tokenless_protocol::RecoveryMethod::Tool { .. }
                        )
                }
                Request::PostTool(value) => value.capabilities.recovery.is_available(),
                Request::Retrieve(_) => true,
                Request::PreTool(_) => false,
            };
            let stash = needs_stash
                .then(|| open_stash_store_or_err_with(&database_paths, stash_db.as_deref()))
                .transpose()
                .map_err(|error| (error, 1))?;
```

</details>

**依据 5 · 源码核查**：[src/tokenless/crates/tokenless-cli/src/main.rs:709-734](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/src/tokenless/crates/tokenless-cli/src/main.rs#L709-L734)

实际dispatch及无节省说明。

<details>
<summary>查看原文（26行）</summary>

```text
            let outcome = dispatch_with_store(
                &request,
                &EntryOptions {
                    compression_enabled: compression_on,
                    search_path_sharing_enabled: env_flag(
                        "TOKENLESS_SEARCH_PATH_SHARING_ENABLED",
                        true,
                    ),
                    diff_compression_enabled: env_flag("TOKENLESS_DIFF_COMPRESSION_ENABLED", false),
                    html_extraction_enabled: env_flag("TOKENLESS_HTML_EXTRACTION_ENABLED", true),
                    stash_enabled: true,
                    rtk_path,
                    rtk_data_dir,
                },
                stash.as_ref(),
                recorder.as_ref(),
            )
            .map_err(|error| (error.to_string(), 1))?;
            if let Response::PostTool(response) = &outcome.response.response
                && response.disposition == Disposition::NoSavings
            {
                warn_soft("tokenless: compression did not reduce size, outputting original");
            }

            let response_json = outcome.response.to_json().map_err(|e| (e.to_string(), 1))?;
            write_stdout(&response_json)?;
```

</details>

**依据 6 · 源码核查**：[src/tokenless/crates/tokenless-runtime/src/post_tool/pipeline.rs:55-81](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/src/tokenless/crates/tokenless-runtime/src/post_tool/pipeline.rs#L55-L81)

原样放行文件、错误和小输入。

<details>
<summary>查看原文（27行）</summary>

```text
impl PostToolPipeline {
    pub(crate) fn run(
        request: &PostToolRequest,
        config: &PostToolPipelineConfig,
        stash_store: Option<&Arc<dyn StashStore>>,
    ) -> PostToolRun {
        let started = Instant::now();

        if request.content.len() > config.max_input_bytes {
            let mut run = passthrough(
                request,
                estimate_tokens_from_bytes(request.content.len()) as u64,
                ContentType::Unknown,
            );
            run.response.tokenizer_id = BYTE_ESTIMATOR_ID.to_owned();
            return run;
        }
        let before_tokens = estimate_tokens(&request.content) as u64;
        let content_type = detect(&request.content);
        if request.status == ToolResultStatus::Error {
            return passthrough(request, before_tokens, content_type);
        }
        if !request.capabilities.replace_output
            || request.content_origin == ContentOrigin::FileContent
            || request.content.chars().count() < config.min_input_chars
        {
            return passthrough(request, before_tokens, content_type);
```

</details>

**依据 7 · 源码核查**：[src/tokenless/crates/tokenless-runtime/src/post_tool/pipeline.rs:129-150](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/src/tokenless/crates/tokenless-runtime/src/post_tool/pipeline.rs#L129-L150)

不适配内容不压缩及恢复存储选择。

<details>
<summary>查看原文（22行）</summary>

```text
        if !diff_candidate
            && !html_candidate
            && !json_candidate
            && !build_log_candidate
            && !tabular_candidate
            && !search_candidate
        {
            return passthrough(request, before_tokens, content_type);
        }

        let dry_run_store = (!config.compression_enabled
            && config.stash_enabled
            && request.capabilities.recovery.is_available()
            && stash_store.is_some())
        .then(InMemoryStore::new);
        let attached_store: Option<&dyn StashStore> =
            if config.stash_enabled && request.capabilities.recovery.is_available() {
                if config.compression_enabled {
                    stash_store.map(AsRef::as_ref)
                } else {
                    dry_run_store.as_ref().map(|store| store as &dyn StashStore)
                }
```

</details>

#### 缺口

- 各格式压缩的语义保持与完整取回未逐一验证
  **影响**：不能以字节减少当任务正确率不变
  **进一步探讨**：固定CLI与宿主，用需要被裁掉字段的任务检验retrieve和最终答案

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 观测、安全及总成本有哪些不能扩大解释的边界？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

压缩需要本地Tokenless CLI和DSH shellEnv/post-execute接口，恢复还需同一CLI、可写stash及模型能执行精确retrieve。适配默认在工作区.tokenless写状态和忽略文件，因此不只是无状态显示优化，仍要维护本地数据与备份。模型上下文可能变短，但每次工具结束增加子进程、token估计、存储及可能的恢复调用，不能用字节或估计token直接计算实际账单下降。AgentSight当前所查DSH插件只注册agentsight_status并返回active=true、capabilities=[status]；这证明插件工具面，不证明采集模型/工具轨迹或有效安全约束，完整AgentSight服务与安全组件未核。

#### 证据与依据

**依据 1 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:82-120](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/src/tokenless/adapters/tokenless/dsh/dist/index.js#L82-L120)

工作区状态目录和gitignore写入。

<details>
<summary>查看原文（39行）</summary>

```text
/** Keep Core and DSH's sandboxed shell on the same writable state directory. */
function tokenlessDataDir(exec) {
  const configured = process.env.TOKENLESS_DATA_DIR
  if (typeof configured === 'string' && configured.length > 0) return configured
  const sessionCwd = exec.agent?.session?.header?.cwd
  const workspace = typeof sessionCwd === 'string' && isAbsolute(sessionCwd)
    ? sessionCwd
    : process.cwd()
  return join(workspace, '.tokenless')
}

/** Prevent default workspace state from becoming a source-control candidate. */
function prepareTokenlessDataDir(exec) {
  const dataDir = tokenlessDataDir(exec)
  if (typeof process.env.TOKENLESS_DATA_DIR === 'string'
    && process.env.TOKENLESS_DATA_DIR.length > 0) return dataDir

  mkdirSync(dataDir, { recursive: true, mode: 0o700 })
  if (!lstatSync(dataDir).isDirectory()) {
    throw new Error(`Tokenless state path is not a directory: ${dataDir}`)
  }
  const ignorePath = join(dataDir, '.gitignore')
  try {
    writeFileSync(ignorePath, '*\n', { encoding: 'utf8', flag: 'wx', mode: 0o600 })
  } catch (error) {
    if (error?.code !== 'EEXIST') throw error
    const metadata = lstatSync(ignorePath)
    if (!metadata.isFile() || metadata.isSymbolicLink()) {
      throw new Error(`Tokenless state ignore file is unsafe: ${ignorePath}`)
    }
    const contents = readFileSync(ignorePath, 'utf8')
    if (!contents.split(/\r?\n/).includes('*')) {
      appendFileSync(
        ignorePath,
        `${contents.endsWith('\n') || contents.length === 0 ? '' : '\n'}*\n`,
      )
    }
  }
  return dataDir
```

</details>

**依据 2 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:318-339](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/src/tokenless/adapters/tokenless/dsh/dist/index.js#L318-L339)

子进程限制及失败放行。

<details>
<summary>查看原文（22行）</summary>

```text
/** Run one PostTool operation and reject malformed transport responses. */
async function runPostTool(request, exec, config) {
  try {
    const stdout = await runTokenless(tokenlessBinary(config), request, {
      timeout: positiveInteger(valueOr(config, 'timeoutMs', undefined), DEFAULT_TIMEOUT_MS),
      maxBuffer: positiveInteger(valueOr(config, 'maxBuffer', undefined), DEFAULT_MAX_BUFFER),
      encoding: 'utf8',
      windowsHide: true,
      signal: exec.signal,
      env: {
        ...process.env,
        TOKENLESS_DATA_DIR: prepareTokenlessDataDir(exec),
      },
    })
    const response = JSON.parse(stdout)
    if (!response || typeof response !== 'object' || Array.isArray(response)) return undefined
    if (response.protocol_version !== 2 || response.operation !== 'post_tool') return undefined
    const result = response.result
    if (!result || typeof result !== 'object' || Array.isArray(result)) return undefined
    return result
  } catch {
    return undefined
```

</details>

**依据 3 · 源码核查**：[src/agentsight/dsh-plugin/src/index.ts:14-50](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/src/agentsight/dsh-plugin/src/index.ts#L14-L50)

DSH观测工具只有状态响应。

<details>
<summary>查看原文（37行）</summary>

```text
export function apply(ctx: Context) {
  ctx.tools.register({
    name: 'agentsight_status',
    description:
      'Report AgentSight observability plugin status. Call this to confirm the plugin is active and get version info.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          plugin: { type: 'string' },
          version: { type: 'string' },
          active: { type: 'boolean' },
          capabilities: { type: 'array', items: { type: 'string' } },
        },
        required: ['plugin', 'version', 'active', 'capabilities'],
      },
      render: (_args, value) => {
        // The host validates this value against output.schema before rendering.
        const result = value as { version: string; active: boolean }
        return [{
          type: 'text',
          text: `AgentSight v${result.version} — ${result.active ? 'active' : 'inactive'}`,
        }]
      },
    },
    async execute() {
      return {
        plugin: 'agentsight',
        version: pkg.version as string,
        active: true,
        capabilities: ['status'],
      }
```

</details>

**依据 4 · 作者声明**：[src/agentsight/dsh-plugin/README.md:21-25](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/src/agentsight/dsh-plugin/README.md#L21-L25)

作者也只列status能力。

```text
## Capabilities

| Tool | Description |
|------|-------------|
| `agentsight_status` | Report plugin status and version |
```

#### 缺口

- 净模型账单、进程延迟及存储生命周期未知
  **影响**：不能承诺净省token或更低端到端成本
  **进一步探讨**：计算含恢复与失败的全部模型调用、CPU和人工修正
- 完整安全与轨迹服务未覆盖
  **影响**：不能把根栈主张当本轮已实现证据
  **进一步探讨**：按所需组件另固定入口、策略执行与轨迹落盘链

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁值得试用哪个子能力，怎样证伪净收益？

**研究主题**：新假设与验证、采用判断

#### 完整回答

能固定DSH与Tokenless二进制、管理本地stash的开发者，可在隔离profile中只试工具输出压缩，不把整个栈投入生产治理。未验证方向是把压缩候选、恢复可用性与任务所需字段一起放进结果回执，按合格任务净费用而非压缩率决定启用；现有选择性放行与恢复身份检查提供基础，但任务敏感字段判据尚无证明。固定同模型和工具结果比较压缩关闭/开启，包含失败日志、文件内容、小输入、marker恢复和原文故障，验收答案正确及精确取回，并计全部调用与时延。若字段损失、marker取不回或净成本上升，关闭压缩并保留原始工具结果；不因status active便开启未核安全组件。

#### 证据与依据

**依据 1 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:445-468](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/src/tokenless/adapters/tokenless/dsh/dist/index.js#L445-L468)

可开关压缩且只替换已应用结果。

<details>
<summary>查看原文（24行）</summary>

```text
    if (status === 'success') {
      if (!compressionEnabled || exec.parent !== undefined) return decision
      const effectiveContent = decision.content ?? result.content
      const content = singleText(effectiveContent)
      if (content === undefined) return decision
      const retrieveResult = isTokenlessRetrieveCommand(exec.name, exec.arguments)
      const request = postToolRequest(
        exec,
        config,
        content,
        status,
        contentOrigin(exec.name),
        true,
        retrieveResult ? 'retrieve' : 'tool',
        !retrieveResult && tokenlessRetrieveCommandAvailable(config),
      )
      const response = await runPostTool(request, exec, config)
      if (response?.disposition !== 'applied' || typeof response.output !== 'string') {
        return decision
      }
      return {
        ...decision,
        content: [{ type: 'text', text: response.output }],
      }
```

</details>

**依据 2 · 源码核查**：[src/tokenless/crates/tokenless-runtime/src/post_tool/pipeline.rs:74-81](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/src/tokenless/crates/tokenless-runtime/src/post_tool/pipeline.rs#L74-L81)

明确放行规则支持同条件对照。

```text
        if request.status == ToolResultStatus::Error {
            return passthrough(request, before_tokens, content_type);
        }
        if !request.capabilities.replace_output
            || request.content_origin == ContentOrigin::FileContent
            || request.content.chars().count() < config.min_input_chars
        {
            return passthrough(request, before_tokens, content_type);
```

**依据 3 · 源码核查**：[src/agentsight/dsh-plugin/src/index.ts:44-50](https://github.com/agentic-os-org/ANOLISA/blob/6f0445082738b8206f0aad37cf0af92b58bd7a15/src/agentsight/dsh-plugin/src/index.ts#L44-L50)

状态不能代表整个观测链。

```text
    async execute() {
      return {
        plugin: 'agentsight',
        version: pkg.version as string,
        active: true,
        capabilities: ['status'],
      }
```

#### 缺口

- 任务敏感压缩回执的效果未知
  **影响**：仍是新设计假设
  **进一步探讨**：在字段依赖明确的任务比较质量与全成本

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
