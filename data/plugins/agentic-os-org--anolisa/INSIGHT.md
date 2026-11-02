# ANOLISA

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[c60fe30](https://github.com/agentic-os-org/ANOLISA/tree/c60fe3047ed8d7623f82de67d8d65a2e7615b332)

<!-- BEGIN META -->
[![GitHub ★ 650](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=650&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentic-os-org/ANOLISA)
<!-- END META -->

> **功能**：为 Agent 环境提供上下文优化、技能、工作区恢复、安全和观测组件的系统软件栈。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持将工具生命周期、来源分类和可恢复压缩接合的贡献；根项目负责系统能力组合，压缩器和宿主原能力归属分别保留。

> **主要限制**：[Q02](#research-q02) 的格式与节省仲裁不能证明任务敏感信息保持，取回还依赖CLI与状态存续；[Q03](#research-q03) 因而不能从压缩率推净费用，更不能从status推全栈安全或轨迹已工作。

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
  - [Q01 · 根项目是什么，DSH 适配提供哪项相对增量？](#detail-section-11)
  - [Q02 · 工具结果怎样进入压缩，失败后保留什么？](#detail-section-12)
  - [Q03 · 如何接入并维持可恢复，成本与效果怎样判断？](#detail-section-13)
  - [Q04 · 采用边界和可证伪的新方向是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护 Agent 运行环境的开发者可保留原宿主，并按任务接入系统能力；本次具体检查 DSH 大工具输出的选择性压缩。

原文模式和手工裁剪是本次直接基线；没有同任务效果对照，不把系统栈的全部宣传当作相对优势。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工具结果后处理 | 把适用的成功单文本交Core | 尊重宿主策略，子工具与不支持形状旁路 |
| 选择性压缩 | 对受支持输出生成较短候选 | 仲裁不证明任务语义保持 |
| 原文恢复条件映射 | 让CLI与shell共享状态位置 | 需同一CLI与可用stash，未实测取回 |
| 配置接入driver | 委托DSH CLI处理显式profile | detect仅检查CLI存在 |
| AgentSight状态 | 报告子插件版本与active | capabilities仅status，不等于完整轨迹 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/shellEnv接口 | 适配必需 | 后置事件与恢复环境 | CLI被发现不等于接口可用 |
| Tokenless可执行CLI及协议2 | 压缩必需 | 本地Core处理 | 进程/协议失败保原文 |
| 可写状态目录与同一CLI身份 | 可恢复策略必需 | stash与后续retrieve | 未验证实际取回时不视为可恢复 |
| 明确profile配置 | 接入必需 | 宿主CLI管理加载范围 | 不猜默认profile，核收据 |
| 真实任务与原文对照 | 评估必需 | 判断语义与净费用 | 不凭压缩率宣称增效 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配对 | 开发者固定宿主、CLI和状态目录 | 核CLI身份、权限和目标profile |
| 接入 | 系统driver委托宿主CLI加载选择的bundle | 核实际配置与事件，status不够 |
| 处理 | 适配在工具后发送协议，Core选择性压缩 | applied才替换，失败保原decision |
| 验收 | 用户比较答案、原文取回与完整费用 | 有内容损失或无净收益则关闭 |
| 退出 | 用户移除所选适配，先保留需要的stash | 不先删除唯一原文再尝试恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | CLI与本地状态存储 | 固定版本、profile与权限 | 金额/耗时未知 |
| 持续使用 | 工具后进程、stash、必要取回和模型重试 | 核最终任务正确性和容量 | 净模型费用与存储增长未知 |
| 失败恢复 | 保留原文、诊断与重复任务 | 判断旁路、恢复marker与状态位置 | 失败耗时和恢复成功率未测 |
| 退出 | 历史stash存储 | 核配置范围与历史原文需求 | 清理与恢复保留周期未验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 选择性压缩 | 状态/来源/能力检查与节省仲裁 | 任务语义保持和合格率 |
| 故障退路 | CLI/协议失败保原结果 | 每类系统异常与资源残留 |
| 原文恢复前提 | 同CLI身份和状态环境映射 | 实际shell权限和长期取回 |
| 观测入口 | agentsight_status报告status | 完整轨迹、安全治理或全栈启用 |

> **思考**：[Q02](#research-q02) 的格式与节省仲裁不能证明任务敏感信息保持，取回还依赖CLI与状态存续；[Q03](#research-q03) 因而不能从压缩率推净费用，更不能从status推全栈安全或轨迹已工作。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持将工具生命周期、来源分类和可恢复压缩接合的贡献；根项目负责系统能力组合，压缩器和宿主原能力归属分别保留。

[Q02](#research-q02) 先尊重waterfall决定、传输失败保原文、压缩与恢复CLI身份配对值得借鉴；移植时须重核宿主的来源分类、取消、shell权限和状态所有权。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的格式与节省仲裁不能证明任务敏感信息保持，取回还依赖CLI与状态存续；[Q03](#research-q03) 因而不能从压缩率推净费用，更不能从status推全栈安全或轨迹已工作。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅对已能维护运行环境和保留原文的开发者，建议以任务副本小范围试用所查压缩链路；内容丢失、取回失败或净成本不降就停用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持DSH Tokenless有界机制判断与试用，未运行目标或真实宿主；其余根栈组件未全面审计。任务回执是未实现、未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、src/tokenless/adapters/tokenless/dsh/dist/index.js、src/tokenless/crates/tokenless-runtime/src/post_tool/pipeline.rs、src/tokenless/crates/tokenless-runtime/src/post_tool/arbitration.rs、src/agentsight/dsh-plugin/src/index.ts、distribution/anolisa/crates/anolisa-core/src/adapter/dsh.rs、src/tokenless/adapters/tokenless/dsh/cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根inventory保留全组件范围与排除项；本轮定向核DSH Tokenless、Rust Core关键pipeline/仲裁、driver及AgentSight status，不代表安全、记忆、快照等全部组件已核查。dist入口虽被统计启发式排除，实际为当前适配交付路径，已单独读取并保存固定正文。
- 下一步：同任务比较原文、当前策略和带任务回执策略，记录完整合格率、取回与净费用，并插入CLI/状态变化反例；此处是后续方案，未执行。

**分析版本**

- **仓库**：[agentic-os-org/ANOLISA](https://github.com/agentic-os-org/ANOLISA)
- **版本号**：未声明（[固定提交 c60fe30](https://github.com/agentic-os-org/ANOLISA/tree/c60fe3047ed8d7623f82de67d8d65a2e7615b332)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 的任务字段与实际恢复探针回执是待验证增量；与已有仲裁对照，只有同时改善合格任务质量且总负担可接受才成立。

同任务比较原文、当前策略和带任务回执策略，记录完整合格率、取回与净费用，并插入CLI/状态变化反例；此处是后续方案，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 728 | 157993 | — | — | 1409641 |
| .js | source | 50 | 11781 | 9529 | 1434 | — |
| .js | test | 8 | 2832 | 2631 | 47 | — |
| .ts | test | 423 | 162457 | 134069 | 9103 | — |
| .ts | source | 635 | 147991 | 110700 | 23229 | — |
| .tsx | test | 60 | 24618 | 20041 | 1824 | — |
| .tsx | source | 193 | 46374 | 40148 | 3347 | — |
| .md | example | 26 | 1961 | — | — | 212281 |
| .ts | example | 1 | 60 | 50 | 6 | — |
| .mjs | test | 22 | 7307 | 6750 | 191 | — |
| .md | test | 8 | 1531 | — | — | 16862 |
| .mjs | example | 60 | 8949 | 8517 | 102 | — |
| .cjs | test | 33 | 8441 | 7120 | 674 | — |
| .mjs | source | 37 | 5715 | 5188 | 248 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/agentic-os-org/ANOLISA/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查多组件系统栈通过 DSH 接入的工具输出优化路径及可恢复、采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目是什么，DSH 适配提供哪项相对增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

ANOLISA 根项目是面向 Agent 工作负载的多组件基础设施，不是一个直接加载就能启用全栈能力的原生 DSH 插件。README 声明上下文、技能、工作区恢复、安全和观测等组件，DSH 只是可接入的宿主之一。本轮把“保留 DSH 的工具和模型工作流，对大量成功工具输出作选择性压缩并保留取回路径”作为具体研究任务。目标用户是维护 Agent 运行环境的平台或开发者；合格结果必须是最终任务正确、需要的原文能取回、故障保留可解释退路，不能只看文本变短。

相对让模型自己概括工具输出或用户手工裁剪，源码适配在工具完成后统一传递状态、来源和可替换/恢复能力给本地 Tokenless CLI，并只在 Core 接受时替换单文本结果。这是生命周期接合与失败退路的具体增量，不证明它优于所有宿主原生压缩。保留原文是最简单基线，输出本来很短或依赖完整源码时也可能更合适。压缩算法归属 Rust Core 与专用压缩器，不把依赖和根栈所有声明算作 DSH 插件自身的新贡献。用户的真实重复频率、人工裁剪代价和端到端收益没有直接数据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:34-47](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/README.md#L34-L47)

根项目自己将其定义为多组件系统栈。

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

**依据 2 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:343-386](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/src/tokenless/adapters/tokenless/dsh/dist/index.js#L343-L386)

宿主适配发送状态、来源、替换与恢复能力。

<details>
<summary>查看原文（44行）</summary>

```text
/** Build one operation request from the DSH execution boundary. */
function postToolRequest(
  exec,
  config,
  content,
  status,
  origin,
  replaceOutput,
  resultKind,
  retrievalAvailable,
) {
  const attribution = {
    agent_id: String(valueOr(config, 'agentId', DEFAULT_AGENT_ID)),
  }
  if (typeof exec.agent?.id === 'string' && exec.agent.id.length > 0) {
    attribution.session_id = exec.agent.id
  }
  if (typeof exec.callId === 'string' && exec.callId.length > 0) {
    attribution.tool_use_id = exec.callId
  }
  const input = {
    result_kind: resultKind,
    tool_name: exec.name,
    content,
    status,
    content_origin: origin,
    output_optimization: 'none',
    capabilities: {
      replace_output: replaceOutput,
      recovery: { kind: retrievalAvailable ? "shell" : "none" },
      replace_with_text: replaceOutput,
    },
  }
  // Core reports a plain file print (`cat page.html`) as file_read from the
  // command line, so the page stays verbatim while data still compresses.
  if (origin === 'command_output' && typeof exec.arguments?.command === 'string') {
    input.command = exec.arguments.command
  }
  return {
    protocol_version: 2,
    operation: 'post_tool',
    attribution,
    input,
  }
```

</details>

**依据 3 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:445-468](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/src/tokenless/adapters/tokenless/dsh/dist/index.js#L445-L468)

成功单文本且 Core 明确 applied 才替换。

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

#### 缺口

- 缺少具体平台用户反复遇到的大输出任务与基线费用数据。
  **影响**：场景和机制明确，但需求强度与增效不能由根栈规模推出。
  **进一步探讨**：保留固定任务与原文，比较不压缩、手工裁剪和适配策略的合格任务结果及全费用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具结果怎样进入压缩，失败后保留什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

真实入口是 tools/post-execute 事件。适配先 await next，尊重后续策略的拒绝和 signal 取消；若其他策略替换了 value，正常结果不再压缩，失败值只附加诊断。成功路径只接受恰好一个文本块，跳过子工具，向 tokenless compress 以 JSON stdin 发送协议版本2的 post_tool 请求。默认进程时限3000ms、输出缓冲2MiB，解析异常、协议或操作不匹配都返回 undefined，调用方保留原 decision；返回 applied 且 output 为字符串才替换内容。这支持“传输和协议失败保原结果”，不能外推为“任何压缩都语义无损”。

Core 在输入超限、错误输出、文件内容、小输入或无可用内容策略时直接放行原文；最终仲裁要求字符和估计 token 都减少，并在 require_reversibility 开启时拒绝不可恢复候选。可恢复策略需要宿主提供 recovery 能力和 stash。适配比较压缩 CLI 与 PATH 中 tokenless 的文件 dev/ino 是否相同，防止压缩和后续取回调用不同文件；它还将工作区本地状态路径传给 CLI 和 shell 环境。这个检查提供有力防护，但不等于未来 shell 权限、状态存续和实际 retrieve 都已经验证。

最影响贡献成立的是“模型拿到更短文本后仍能完成同一合格任务”。结构化校验和 token 估计都没有判断任务所需字段是否被保留；因此高压缩率不能单独证明价值。另一个边界是所查 AgentSight DSH 工具仅返回 active=true 和 capabilities=[status]，这只证明状态入口被调用，不能借此宣称完整调用轨迹或安全约束已经启用，也不否认根栈其他独立组件可能有这些能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:409-437](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/src/tokenless/adapters/tokenless/dsh/dist/index.js#L409-L437)

先尊重 waterfall 决定，value替换时不覆盖正常结果。

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:297-340](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/src/tokenless/adapters/tokenless/dsh/dist/index.js#L297-L340)

子进程、时限、输出上限和协议失败退路。

<details>
<summary>查看原文（44行）</summary>

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
  }
```

</details>

**依据 3 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:445-468](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/src/tokenless/adapters/tokenless/dsh/dist/index.js#L445-L468)

成功替换的严格条件。

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

**依据 4 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:156-174](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/src/tokenless/adapters/tokenless/dsh/dist/index.js#L156-L174)

CLI文件身份一致性检查。

<details>
<summary>查看原文（19行）</summary>

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
  }
```

</details>

**依据 5 · 源码核查**：[src/tokenless/crates/tokenless-runtime/src/post_tool/pipeline.rs:63-82](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/src/tokenless/crates/tokenless-runtime/src/post_tool/pipeline.rs#L63-L82)

输入、错误、文件内容与短结果的原文旁路。

<details>
<summary>查看原文（20行）</summary>

```text
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
        }
```

</details>

**依据 6 · 源码核查**：[src/tokenless/crates/tokenless-runtime/src/post_tool/arbitration.rs:26-48](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/src/tokenless/crates/tokenless-runtime/src/post_tool/arbitration.rs#L26-L48)

最终仲裁核节省、可逆策略和超时，但并不验任务语义。

<details>
<summary>查看原文（23行）</summary>

```text
pub(super) fn decide(input: &ArbitrationInput<'_>) -> Verdict {
    if input.timed_out {
        return Verdict::Reject(Disposition::Timeout);
    }
    if !input.has_operations {
        return Verdict::Reject(Disposition::NoSavings);
    }
    if input.require_reversibility && input.recoverability == Recoverability::Unrecoverable {
        return Verdict::Reject(Disposition::RecoverabilityUnavailable);
    }
    let saves_chars = input.candidate.chars().count() < input.original.chars().count();
    let original_tokens = estimate_tokens(input.original);
    let candidate_tokens = estimate_tokens(input.candidate);
    let saves_tokens = candidate_tokens < original_tokens
        && original_tokens - candidate_tokens >= input.min_token_savings;
    if !(saves_chars && saves_tokens) {
        return Verdict::Reject(Disposition::NoSavings);
    }
    if input.dry_run {
        Verdict::DryRun
    } else {
        Verdict::Apply
    }
```

</details>

**依据 7 · 源码核查**：[src/agentsight/dsh-plugin/src/index.ts:44-50](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/src/agentsight/dsh-plugin/src/index.ts#L44-L50)

观测工具仅报告status，不能等同完整轨迹。

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

- 没有任务敏感字段保留、真实取回或宿主加载结果。
  **影响**：只能支持有条件的压缩机制分析，不能证明合格率和恢复成功。
  **进一步探讨**：固定CLI与状态目录，在失败、权限变化和需要原文的任务中记录实际取回及最终答案正确性。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何接入并维持可恢复，成本与效果怎样判断？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

系统接入不应绕过宿主配置所有权。当前 Rust DSH driver 把 bundle 当包清单与 patch 数据，注释明确所有 profile 变更委托 DSH CLI，并用收据记录显式选择的 profile。detect 只检查 PATH 中 DSH CLI，不能把 detected 解释为所有 Tokenless、权限或安全组件已工作。压缩适配自身无 DSH 运行时 import，但依赖宿主提供 tools 与 shellEnv 事件接口、本地可执行 tokenless、正确协议以及可写状态目录。默认 .tokenless 位于会话 cwd 或进程工作目录，下发状态与数据库覆盖字段，创建目录和 .gitignore；无权限时保原结果而非完成压缩。

首次成本是安装与版本配对、profile 选择、CLI身份和存储权限核对；持续成本是每次适用工具后的进程、压缩计算、stash和统计存储，以及模型必要时取回原文产生的额外调用。原文保存也带来敏感工具输出的本地存储责任，不能把 .gitignore 当访问控制或自动清理承诺。适配传入 signal 与时限，但未测进程、数据库和任务中断后的全部状态；失败诊断可能增加上下文，压缩失败保原文仍有进程时间开销。

合格任务成本必须包含原工具执行、压缩、取回、重试和人工排错，按相同任务质量分母比较。当前只有静态节省判据和旁路，不具备足够运行数据计算净费用、节时率或ROI。退出应先关闭压缩/移除已选择 profile 中的适配并保存需要的 stash；先删原文库会让历史 marker失去恢复基础。现有状态收据有助于确定配置范围，但具体 disable 和历史恢复操作本轮未运行。

#### 证据与依据

**依据 1 · 源码核查**：[distribution/anolisa/crates/anolisa-core/src/adapter/dsh.rs:1-7](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/distribution/anolisa/crates/anolisa-core/src/adapter/dsh.rs#L1-L7)

接入生命周期与收据范围的设计依据。

```text
//! DeepSeek Harness (`dsh`) native plugin driver.
//!
//! dsh owns profile configuration and plugin registration. ANOLISA therefore
//! treats a bundle as immutable package data (`package.json` plus the
//! `dsh.bundle.patch` file) and delegates every profile mutation to the dsh
//! plugin CLI. A single receipt records all explicitly selected profiles so
//! disable and status never guess an implicit profile.
```

**依据 2 · 源码核查**：[distribution/anolisa/crates/anolisa-core/src/adapter/dsh.rs:107-127](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/distribution/anolisa/crates/anolisa-core/src/adapter/dsh.rs#L107-L127)

detect只检查CLI及配置读取范围。

<details>
<summary>查看原文（21行）</summary>

```text
    fn probe_bundle(&self, resource_root: &Path, _declared_entry: Option<&str>) -> bool {
        read_dsh_bundle(resource_root).is_ok()
    }

    fn detect(&self, _env: &HostEnv) -> DetectResult {
        match dsh_program_path() {
            Some(path) => DetectResult {
                detected: true,
                reason: format!("dsh CLI found at {}", path.display()),
            },
            None => DetectResult {
                detected: false,
                reason: "dsh CLI not found on PATH".to_string(),
            },
        }
    }

    fn allowed_external_roots(&self, ctx: &DriverCtx) -> Vec<PathBuf> {
        // Profile manifests are read for status and idempotent cleanup, while
        // all profile mutations remain delegated to the dsh CLI.
        dsh_home(ctx.user_home.as_deref()).into_iter().collect()
```

</details>

**依据 3 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:75-120](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/src/tokenless/adapters/tokenless/dsh/dist/index.js#L75-L120)

CLI选择、默认工作区状态目录与ignore创建。

<details>
<summary>查看原文（46行）</summary>

```text
/** Resolve the executable without installing or mutating a DSH profile. */
function tokenlessBinary(config) {
  const configured = valueOr(config, 'tokenlessBin', undefined)
  if (typeof configured === 'string' && configured.length > 0) return configured
  return process.env.TOKENLESS_BIN || 'tokenless'
}

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

**依据 4 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:123-135](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/src/tokenless/adapters/tokenless/dsh/dist/index.js#L123-L135)

向恢复shell发布状态覆盖字段。

<details>
<summary>查看原文（13行）</summary>

```text
/** Publish the state overrides that DSH strips from model shell commands. */
function tokenlessShellEnvironment(exec) {
  const environment = {
    [DSH_TOKENLESS_DATA_DIR]: tokenlessDataDir(exec),
  }
  for (const [source, target] of [
    ['TOKENLESS_STATS_DB', DSH_TOKENLESS_STATS_DB],
    ['TOKENLESS_STASH_DB', DSH_TOKENLESS_STASH_DB],
  ]) {
    const value = process.env[source]
    if (typeof value === 'string' && value.length > 0) environment[target] = value
  }
  return environment
```

</details>

**依据 5 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:318-340](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/src/tokenless/adapters/tokenless/dsh/dist/index.js#L318-L340)

故障旁路仍会付出进程执行时间。

<details>
<summary>查看原文（23行）</summary>

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
  }
```

</details>

#### 缺口

- 没有任务级压缩/取回总费用、存储增长和恢复耗时记录。
  **影响**：不能断言省钱、低成本或退出无损。
  **进一步探讨**：以相同工具结果和任务，记录进程时延、原文命中、模型重试与存储增长，并演练禁用后历史原文取回。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用边界和可证伪的新方向是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

对已维护 DSH 运行环境、能固定 CLI 和保存原文的开发者，Tokenless 这一有界链路可以在可恢复任务副本中试用；根栈不能作为一个“全组件已验收”的整体直接采用。先选日志或结构化大输出任务，以原文模式为对照，人工检查最终答案以及模型需要时能否取回同一原文。若关键字段丢失、取回失败、超时旁路频发或完整费用不降，应关闭压缩并回到原结果，不继续以压缩率辩护。没有独立恢复条件的敏感或关键决策任务不适合先压再赌模型能补回。

可推导的未验证方向是给每次 applied 输出附带“本任务所依赖字段与实际恢复探针”的回执。现有 Core 已有节省、可逆性和时限仲裁，适配也验证CLI身份，所以不能说它没有质量和恢复控制；增量在于由任务验收约束补足通用压缩检查，并在状态目录或CLI环境变化时确认取回能力。回执本身增加 token、本地调用和维护量，需要一并测量。最小实验用同一任务集，对照现有策略、原文和加入回执的策略，插入stash缺失、CLI变更、文件/命令分类差异与模型需追问原文的反例。观察最终合格率、错误判断、取回次数、端到端费用和人工复核时间；若回执不能改善任务结果或开销抵消节省，则否定该方案。

#### 证据与依据

**依据 1 · 源码核查**：[src/tokenless/crates/tokenless-runtime/src/post_tool/arbitration.rs:26-48](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/src/tokenless/crates/tokenless-runtime/src/post_tool/arbitration.rs#L26-L48)

已有仲裁是新假设的明确基线，不是完全缺控制。

<details>
<summary>查看原文（23行）</summary>

```text
pub(super) fn decide(input: &ArbitrationInput<'_>) -> Verdict {
    if input.timed_out {
        return Verdict::Reject(Disposition::Timeout);
    }
    if !input.has_operations {
        return Verdict::Reject(Disposition::NoSavings);
    }
    if input.require_reversibility && input.recoverability == Recoverability::Unrecoverable {
        return Verdict::Reject(Disposition::RecoverabilityUnavailable);
    }
    let saves_chars = input.candidate.chars().count() < input.original.chars().count();
    let original_tokens = estimate_tokens(input.original);
    let candidate_tokens = estimate_tokens(input.candidate);
    let saves_tokens = candidate_tokens < original_tokens
        && original_tokens - candidate_tokens >= input.min_token_savings;
    if !(saves_chars && saves_tokens) {
        return Verdict::Reject(Disposition::NoSavings);
    }
    if input.dry_run {
        Verdict::DryRun
    } else {
        Verdict::Apply
    }
```

</details>

**依据 2 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:156-174](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/src/tokenless/adapters/tokenless/dsh/dist/index.js#L156-L174)

CLI一致性防护已存在。

<details>
<summary>查看原文（19行）</summary>

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
  }
```

</details>

**依据 3 · 源码核查**：[src/tokenless/adapters/tokenless/dsh/dist/index.js:343-386](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/src/tokenless/adapters/tokenless/dsh/dist/index.js#L343-L386)

已有归属与能力字段可承载有边界的结果解释。

<details>
<summary>查看原文（44行）</summary>

```text
/** Build one operation request from the DSH execution boundary. */
function postToolRequest(
  exec,
  config,
  content,
  status,
  origin,
  replaceOutput,
  resultKind,
  retrievalAvailable,
) {
  const attribution = {
    agent_id: String(valueOr(config, 'agentId', DEFAULT_AGENT_ID)),
  }
  if (typeof exec.agent?.id === 'string' && exec.agent.id.length > 0) {
    attribution.session_id = exec.agent.id
  }
  if (typeof exec.callId === 'string' && exec.callId.length > 0) {
    attribution.tool_use_id = exec.callId
  }
  const input = {
    result_kind: resultKind,
    tool_name: exec.name,
    content,
    status,
    content_origin: origin,
    output_optimization: 'none',
    capabilities: {
      replace_output: replaceOutput,
      recovery: { kind: retrievalAvailable ? "shell" : "none" },
      replace_with_text: replaceOutput,
    },
  }
  // Core reports a plain file print (`cat page.html`) as file_read from the
  // command line, so the page stays verbatim while data still compresses.
  if (origin === 'command_output' && typeof exec.arguments?.command === 'string') {
    input.command = exec.arguments.command
  }
  return {
    protocol_version: 2,
    operation: 'post_tool',
    attribution,
    input,
  }
```

</details>

**依据 4 · 源码核查**：[src/agentsight/dsh-plugin/src/index.ts:44-50](https://github.com/agentic-os-org/ANOLISA/blob/c60fe3047ed8d7623f82de67d8d65a2e7615b332/src/agentsight/dsh-plugin/src/index.ts#L44-L50)

状态输出不足以支持根栈全面启用建议。

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

- 任务回执尚未实现，未证明比现有仲裁和原文更好。
  **影响**：设计假设不能计入当前组件的已实现创新或收益。
  **进一步探讨**：在固定任务/模型/预算下比较完整质量与费用，预先写明可接受损失与停止条件。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
