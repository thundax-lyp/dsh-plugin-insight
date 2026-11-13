# CC Safety Net

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e3df63b](https://github.com/kenryu42/cc-safety-net/tree/e3df63b8ee54bfe01b5063d7f07aeb60d358cf48)

<!-- BEGIN META -->
[![GitHub ★ 1,999](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C999&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kenryu42/cc-safety-net) [![npm 30d 153,287](https://img.shields.io/static/v1?label=npm+30d&message=153%2C287&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cc-safety-net) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cc-safety-net)
<!-- END META -->

> **功能**：为 DSH 等编码工具提供执行前规则，检查危险命令和敏感文件访问。

> **亮点**：[Q01](#research-q01) 在宿主实际执行前给出规则决定。[Q02](#research-q02) 将命令、目录、策略和审计连接起来。

> **主要限制**：[Q03](#research-q03) 的未声明第三方工具未进入完整命令分析路径，后置提示无法撤回本次调用。目录也必须与实际执行环境吻合。

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
  - [Q01 · 哪些工具使用者能从前置规则获益？](#detail-section-11)
  - [Q02 · 如何从 DSH 调用进入策略判定？](#detail-section-12)
  - [Q03 · 未声明工具与失败会带来什么采用限制？](#detail-section-13)
  - [Q04 · 怎样验证覆盖和误拦而不执行危险命令？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合维护 DSH 开发工作区的人，在保留宿主审批的情况下增加可解释的工具规则。

以宿主审批与最小工具权限为基线。插件增加项目规则，仍由宿主决定实际执行与隔离。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 执行前规则 | 检查声明工具的命令与路径 | 宿主必须调用 guard |
| 后置提醒 | 发现某类未声明工具 | 发生在执行后，不撤回操作 |
| 分 profile 退出 | 撤除对应挂载 | 按目标 profile 核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=22、兼容 DSH 与 tools 服务 | 必需 | 挂载前置规则 | 检查插件和 profile 是否加载 |
| 匹配工作目录及工具声明 | 策略按需 | 为命令解释正确上下文 | 核相应工具和执行位置 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户建立临时 profile 与测试规则 | 保持宿主审批 |
| 验证 | 用户让假工具处理测试字符串 | 拒绝后不调用假工具 |
| 退出 | 用户按 profile 移除 | 恢复原审批并核记录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 环境成本未知 | 盘点工具、核目录 | 第三方工具须单独声明 |
| 持续 | 评估与审计资源未知 | 维护规则与误拦 | 覆盖不随安装自动补齐 |
| 失败及退出 | 恢复成本未知 | 查规则、停用与复核 | 保留宿主审批 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 拒绝 | 前置守卫返回规则判断 | 宿主实际阻断和误报 |
| 覆盖 | 声明提升与后置提醒 | 所有第三方工具兼容 |

> **思考**：[Q03](#research-q03) 的未声明第三方工具未进入完整命令分析路径，后置提示无法撤回本次调用。目录也必须与实际执行环境吻合。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在宿主实际执行前给出规则决定。[Q02](#research-q02) 将命令、目录、策略和审计连接起来。

[Q02](#research-q02) 区分畸形输入、不可用目录和策略拒绝。[Q03](#research-q03) 的后置提醒可诊断遗漏，但无追溯阻断能力。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的未声明第三方工具未进入完整命令分析路径，后置提示无法撤回本次调用。目录也必须与实际执行环境吻合。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先核固定 profile、工具名单和工作目录。用假工具而非破坏性命令试验，出现覆盖或误拦问题时恢复原审批。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持 DSH 规则、异常处理和未声明提醒，真实宿主阻断率及误拦未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/hosts/deepseek-harness/guard.ts、src/core/denial.ts、src/entries/deepseek-harness/index.ts、src/hosts/hook/plugin-adapter.ts、src/hosts/runtime.ts、src/gate/pipeline.ts、src/hosts/deepseek-harness/install.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定 DSH bundle、工具适配、策略声明及移除路径。未运行插件、宿主、命令或攻击用例。
- 下一步：按 [Q04](#research-q04) 核对前置拒绝、执行计数和后置提示。

**分析版本**

- **仓库**：[kenryu42/cc-safety-net](https://github.com/kenryu42/cc-safety-net)
- **版本号**：2.7.12（[固定提交 e3df63b](https://github.com/kenryu42/cc-safety-net/tree/e3df63b8ee54bfe01b5063d7f07aeb60d358cf48)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 用只记调用次数的假工具核对规则覆盖、错误允许和误拦。若拒绝后仍调用或未声明工具被误当已覆盖，就不扩大使用。

按 [Q04](#research-q04) 核对前置拒绝、执行计数和后置提示。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 65 | 3738 | — | — | 37067 |
| .ts | source | 306 | 58040 | 53181 | 188 | — |
| .ts | test | 263 | 66947 | 62184 | 1041 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/kenryu42/cc-safety-net/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：CC Safety Net 能在 DSH 的哪些工具上形成前置判断，使用者怎样发现覆盖缺口和误拦？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些工具使用者能从前置规则获益？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合让 DSH Agent 在开发工作区频繁调用 shell、希望对明确危险操作多一层规则的工程师。README 描述阻止危险命令和读取敏感文件。固定 DSH 接线将回调注册到 tools.guard，确实存在执行前判定位置。相对只看聊天提示或人工逐次批准，新增规则判断能在宿主识别的工具上返回拒绝和理由。对已经完全不开放 shell 的任务，价值较小。合格结果应包括预期测试操作被阻止，常规只读动作仍可执行，人工审批继续覆盖未纳入工具。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:84-89](https://github.com/kenryu42/cc-safety-net/blob/e3df63b8ee54bfe01b5063d7f07aeb60d358cf48/README.md#L84-L89)

作者声明保护范围与可配置策略。

```text

- **Blocks destructive commands** such as `git reset --hard`, `git push --force`, and `rm -rf` on dangerous targets, and install scripts piped from the internet (`curl … | bash`), even inside `bash -c` or `python -c`. See [Blocked commands](https://ccsafetynet.com/docs/reference/blocked-commands).
- **Blocks secret access** to SSH keys, `.env` files, `~/.aws`, and coding-CLI credentials, from the shell and from the agent's file tools. See [Secret protection](https://ccsafetynet.com/docs/reference/secret-protection).
- **Tunes the policy in a GUI.** Run `npx cc-safety-net gui` to pick the Standard, Strict, or Paranoid preset and turn rules on or off. See [Dashboard](https://ccsafetynet.com/docs/guides/dashboard).
- **Adds blocks through rulebooks**: official packs for Terraform, AWS, gcloud, and Azure, or your own JSON. See [Official rulebooks](https://ccsafetynet.com/docs/configuration/rulebooks).
- **Shares policy through git.** Commit `.cc-safety-net/` so clones and cloud sessions get the same rules. See [Team setup](https://ccsafetynet.com/docs/guides/team-setup).
```

**依据 2 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:44-69](https://github.com/kenryu42/cc-safety-net/blob/e3df63b8ee54bfe01b5063d7f07aeb60d358cf48/src/hosts/deepseek-harness/guard.ts#L44-L69)

真实 shell 名单和宿主前置及后置注册。

<details>
<summary>查看原文（26行）</summary>

```text
export const DEEPSEEK_HARNESS_COMMAND_TOOLS = new Map<string, CommandToolKind>([
  ['bash', 'posix'],
  ['pwsh', 'powershell'],
]);

const DEEPSEEK_HARNESS_HOST: PluginToolCallHost<unknown, string, string | undefined> = {
  agent: 'deepseek-harness',
  debugLabel: 'deepseek-harness tool guard',
  extract: (execution, launchCwd, paths) => getDeepSeekHarnessToolCall(execution, launchCwd, paths),
  getSessionId: (execution) =>
    (execution as DeepSeekHarnessToolExecution | null)?.agent?.session.header.id,
  allow: undefined,
  block: (denial) => formatDenial(denial),
  includeEvidenceOnError: (toolCall) => toolCall.route.kind === 'command',
};

export function registerDeepSeekHarnessGuard(ctx: DeepSeekHarnessContext): void {
  const handle = createDeepSeekHarnessGuardHandler();
  ctx.tools.guard((execution) => handle(execution, process.cwd()));
  const noticed = new Set<string>();
  ctx.on('tools/post-execute', async (execution, _result, next) => {
    const decision = await next();
    const notice = noticeUndeclaredCommandTool(execution, noticed);
    if (!notice) return decision;
    return { ...decision, additionalContexts: [notice, ...(decision.additionalContexts ?? [])] };
  });
```

</details>

**依据 3 · 源码核查**：[src/core/denial.ts:71-88](https://github.com/kenryu42/cc-safety-net/blob/e3df63b8ee54bfe01b5063d7f07aeb60d358cf48/src/core/denial.ts#L71-L88)

把 deny 判定转成宿主可用理由。

<details>
<summary>查看原文（18行）</summary>

```text
export function projectGuardDenial(
  evaluation: { decision: Decision; configFallback?: { reason: string } },
  options: { includeEvidence: boolean; toolName?: string },
): IntegrationDenial | undefined {
  if (evaluation.decision.kind !== 'deny') return undefined;
  const evidence = options.includeEvidence ? evaluation.decision.evidence : undefined;
  return {
    reason: evaluation.decision.reason,
    ruleId: evaluation.decision.ruleId,
    intent: evaluation.decision.intent,
    command: evidence?.command,
    segment: evidence?.segment,
    toolName: options.toolName,

    ...(evaluation.configFallback ? { configWarning: evaluation.configFallback.reason } : {}),
    ...(evaluation.decision.unverifiedByStandardMode
      ? { unverifiedByStandardMode: true as const }
      : {}),
```

</details>

#### 缺口

- 实际阻断率和误拦没有同任务对照。
  **影响**：不能由接线推出全场景安全收益。
  **进一步探讨**：对固定测试政策记录允许、拒绝和缺覆盖样本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何从 DSH 调用进入策略判定？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

包的补丁加载独立 DSH 入口，要求 tools 服务。适配器提取工具名、会话工作目录和参数，将 bash 与 pwsh 映射为对应命令类型。工作目录无效、命令或参数形状不合法会形成拒绝，而非用空命令替代。合法调用进入共享策略，按配置与实际执行目录区分评估。入口把策略决定和必要审计交给宿主；未预期异常会返回拒绝，已知 GuardEvaluationError 则根据其所带评估投影处理，不能统称所有异常都表现相同。日志是诊断信号，真实宿主是否把拒绝拦在执行前仍需在隔离环境核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/entries/deepseek-harness/index.ts:1-7](https://github.com/kenryu42/cc-safety-net/blob/e3df63b8ee54bfe01b5063d7f07aeb60d358cf48/src/entries/deepseek-harness/index.ts#L1-L7)

入口与 tools 注入。

```text
import { registerDeepSeekHarnessGuard } from '@/hosts/deepseek-harness/guard';

export default {
  name: 'cc-safety-net',
  inject: ['tools'],
  apply: registerDeepSeekHarnessGuard,
};
```

**依据 2 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:125-184](https://github.com/kenryu42/cc-safety-net/blob/e3df63b8ee54bfe01b5063d7f07aeb60d358cf48/src/hosts/deepseek-harness/guard.ts#L125-L184)

解析工作区、工具名、shell 与显式 workdir。

<details>
<summary>查看原文（60行）</summary>

```text
function getDeepSeekHarnessToolCall(
  execution: unknown,
  launchCwd: string,
  paths: PathResolver,
): MalformedToolCall | ToolInvocation {
  if (!execution || typeof execution !== 'object') return failedClosedToolCall(null);
  const toolCall = execution as DeepSeekHarnessToolExecution;
  const sessionCwd = toolCall.agent?.session.header.cwd ?? launchCwd;
  const workspace = firstTrustedRoot([sessionCwd], paths);
  const toolName = toolCall.name;
  if (typeof toolName !== 'string' || toolName.trim() === '') {
    return malformedToolCall(workspace ?? null);
  }
  if (!workspace) {
    return refusedCwdToolCall(
      { directory: 'session', problem: 'unusable', cwd: sessionCwd },
      { toolName },
    );
  }

  const input = toolCall.arguments;
  const shell = DEEPSEEK_HARNESS_COMMAND_TOOLS.get(toolName);
  if (!shell) {
    return createToolInvocation(
      toolName,
      input,
      { kind: getNonCommandToolInputKind(toolName) },
      { configCwd: workspace, executionCwd: workspace },
      null,
    );
  }

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return malformedToolCall(workspace, { toolName });
  }
  const shellInput = input as Record<string, unknown>;
  const command = shellInput.command;
  if (typeof command !== 'string' || command.trim() === '') {
    return malformedToolCall(workspace, { toolName });
  }

  const workdir = shellInput.workdir;
  if (workdir !== undefined && (typeof workdir !== 'string' || workdir.trim() === '')) {
    return malformedToolCall(workspace, { command, toolName });
  }
  const executionCwd =
    workdir === undefined ? workspace : firstTrustedRoot([resolve(workspace, workdir)], paths);
  if (!executionCwd) {
    return refusedCwdToolCall(
      { directory: 'requested', problem: 'unusable', cwd: workdir as string },
      { command, toolName },
    );
  }

  return createToolInvocation(
    toolName,
    input,
    { kind: 'command', shell },
    { configCwd: workspace, executionCwd },
    command,
```

</details>

**依据 3 · 源码核查**：[src/hosts/hook/plugin-adapter.ts:65-98](https://github.com/kenryu42/cc-safety-net/blob/e3df63b8ee54bfe01b5063d7f07aeb60d358cf48/src/hosts/hook/plugin-adapter.ts#L65-L98)

未预期异常和畸形调用的拒绝。

<details>
<summary>查看原文（34行）</summary>

```text
export function createPluginToolCallHandler<Event, Context, Result>(
  host: PluginToolCallHost<Event, Context, Result>,
  options: PluginHandlerOptions = {},
): (event: Event, ctx: Context) => Result {
  return (event, ctx) => {
    try {
      return handlePluginToolCall(event, ctx, host, options);
    } catch (error) {
      console.error('CC Safety Net error:', error);
      return host.block(createFailedClosedDenial());
    }
  };
}

function handlePluginToolCall<Event, Context, Result>(
  event: Event,
  ctx: Context,
  host: PluginToolCallHost<Event, Context, Result>,
  options: PluginHandlerOptions,
): Result {
  const environment = createProcessEnvironment();
  if (host.cancelled?.(ctx)) return host.block(createFailedClosedDenial());

  const toolCall = host.extract(event, ctx, environment.paths);
  if (!toolCall) return host.allow;

  const getSessionId = () => host.getSessionId(event, ctx);
  if ('malformed' in toolCall) {
    writeIntegrationDenialAudit(environment, toolCall.denial, getSessionId, {
      agent: host.agent,
      toolName: toolCall.denial.toolName,
      cwd: toolCall.cwd,
    });
    return host.block(toolCall.denial);
```

</details>

**依据 4 · 源码核查**：[src/hosts/hook/plugin-adapter.ts:109-126](https://github.com/kenryu42/cc-safety-net/blob/e3df63b8ee54bfe01b5063d7f07aeb60d358cf48/src/hosts/hook/plugin-adapter.ts#L109-L126)

评估、审计入口和已知错误处理。

<details>
<summary>查看原文（18行）</summary>

```text
  try {
    const evaluation = evaluateRuntimeGuard(environment, toolCall, {
      guard: {
        auditAllowed: shouldRecordAllowedCommands(environment.env),
        policyOptions: options.policyOptions,
        dependencies: options.guardDependencies,
      },
      audit: { agent: host.agent, getSessionId },
    });
    return project(evaluation, true);
  } catch (error) {
    if (!(error instanceof GuardEvaluationError)) throw error;
    if (envTruthy(ENV_FLAGS.debug, environment.env)) {
      console.error(
        `CC Safety Net debug: ${host.debugLabel} analysis failed: ${formatIntegrationError(error.cause)}`,
      );
    }
    return project(error.evaluation, host.includeEvidenceOnError(toolCall));
```

</details>

**依据 5 · 源码核查**：[src/hosts/runtime.ts:24-43](https://github.com/kenryu42/cc-safety-net/blob/e3df63b8ee54bfe01b5063d7f07aeb60d358cf48/src/hosts/runtime.ts#L24-L43)

成功和可分类失败的审计。

<details>
<summary>查看原文（20行）</summary>

```text
export function evaluateRuntimeGuard(
  environment: Environment,
  invocation: ToolInvocation,
  options: { guard?: Omit<GuardOptions, 'environment'>; audit: RuntimeAuditOptions },
) {
  try {
    const evaluation = evaluateGuard(invocation, { environment, ...options.guard });
    writeRuntimeAudit(environment, invocation, evaluation, options);
    return evaluation;
  } catch (error) {
    if (!(error instanceof GuardEvaluationError)) throw error;
    writeRuntimeAudit(
      environment,
      invocation,
      error.evaluation,
      options,
      !(error.cause instanceof ToolInputLimitError),
      { stage: error.stage, errorCode: classifyAuditError(error.cause) },
    );
    throw error;
```

</details>

#### 缺口

- 实际 DSH 执行前拒绝与日志可见性未跑。
  **影响**：不能证明固定宿主中的事件次序和留存。
  **进一步探讨**：对模拟工具比较 guard 返回、调用次数和审计。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 未声明工具与失败会带来什么采用限制？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

原生 bash 和 pwsh 是明确的命令入口。其他未知工具即使提供 command 字段，也要由策略中的同名声明提升为 shell 工具，未知工具仍可能走有限结构或其他输入检查。后置监听在 next() 后对未声明、带 command 的未知工具给一次提示，此时原调用已经通过执行阶段，不能充当本次阻断。规则也依赖传入路径与工具执行位置相符，远端实际目录另需核对。

先在临时 profile 和一次性仓库用虚构测试文件验证已声明工具，不执行破坏性命令，核对宿主自己的审批仍生效。首次要盘点工具与规则，长期要维护声明和审计，误拦或漏检都要诊断，现金和时间均未知。未声明工具仍可能发起敏感操作或合法命令持续误拦时，停止该工作区的 Agent 操作，恢复宿主原有审批并检查策略范围。

#### 证据与依据

**依据 1 · 源码核查**：[src/gate/pipeline.ts:118-145](https://github.com/kenryu42/cc-safety-net/blob/e3df63b8ee54bfe01b5063d7f07aeb60d358cf48/src/gate/pipeline.ts#L118-L145)

声明提升到 shell 路由的实际条件。

<details>
<summary>查看原文（28行）</summary>

```text
  const inputCommand = getInputCommandOrFail(hostInvocation);
  const loadSnapshot = () =>
    callDependency('config-load', inputCommand, () =>
      dependencies.loadPolicySnapshot(options.environment, {
        ...options.policyOptions,
        cwd: hostInvocation.context.configCwd,
      }),
    );
  const declarationSnapshot =
    hostInvocation.route.kind === 'unknown' && inputCommand ? loadSnapshot() : undefined;
  const declaration = declarationSnapshot?.policy.commandTools.find(
    (tool) => tool.name === hostInvocation.toolName,
  );
  const promotion =
    declaration && inputCommand
      ? promoteDeclaredCommandTool(
          hostInvocation,
          inputCommand,
          declaration.cwd,
          options.environment.paths,
        )
      : hostInvocation;
  if ('decision' in promotion) return promotion;
  const invocation = promotion;
  const promoted = invocation === hostInvocation ? {} : { promotedInvocation: invocation };
  const command = isCommandInvocation(invocation) ? invocation.command : inputCommand;

  const facts = callDependency('policy-protection', command, () => createSemanticFacts(invocation));
```

</details>

**依据 2 · 源码核查**：[src/gate/pipeline.ts:148-175](https://github.com/kenryu42/cc-safety-net/blob/e3df63b8ee54bfe01b5063d7f07aeb60d358cf48/src/gate/pipeline.ts#L148-L175)

命令结构超过上限的拒绝。

<details>
<summary>查看原文（28行）</summary>

```text
  if (
    isCommandInvocation(invocation) &&
    invocation.command?.trim() &&
    declaredCommand?.program.status === 'limited'
  ) {
    return {
      stage: 'command-analysis',
      ...promoted,
      decision: {
        kind: 'deny',
        reason: REASON_RECURSION_LIMIT,
        ruleId: 'analysis.recursion-limit',
        intent: 'stop_and_explain',
        evidence: { command: invocation.command, segment: invocation.command },
      },
    };
  }
  if (inputCandidate?.program.status === 'limited') {
    return {
      stage: 'command-validation',
      ...promoted,
      decision: {
        kind: 'deny',
        reason: REASON_STRUCTURAL_COMMAND_VALIDATION_LIMIT,
        ruleId: 'analysis.structural-limit',
        intent: 'stop_and_explain',
      },
    };
```

</details>

**依据 3 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:60-95](https://github.com/kenryu42/cc-safety-net/blob/e3df63b8ee54bfe01b5063d7f07aeb60d358cf48/src/hosts/deepseek-harness/guard.ts#L60-L95)

后置提醒触发位置及名单排除。

<details>
<summary>查看原文（36行）</summary>

```text
export function registerDeepSeekHarnessGuard(ctx: DeepSeekHarnessContext): void {
  const handle = createDeepSeekHarnessGuardHandler();
  ctx.tools.guard((execution) => handle(execution, process.cwd()));
  const noticed = new Set<string>();
  ctx.on('tools/post-execute', async (execution, _result, next) => {
    const decision = await next();
    const notice = noticeUndeclaredCommandTool(execution, noticed);
    if (!notice) return decision;
    return { ...decision, additionalContexts: [notice, ...(decision.additionalContexts ?? [])] };
  });
}

function noticeUndeclaredCommandTool(execution: unknown, noticed: Set<string>) {
  try {
    const toolCall = execution as DeepSeekHarnessToolExecution | null;
    const header = toolCall?.agent?.session.header;
    const toolName = toolCall?.name;
    const input = toolCall?.arguments;
    const command = (input as { command?: unknown } | null | undefined)?.command;
    if (
      !header ||
      typeof toolName !== 'string' ||
      DEEPSEEK_HARNESS_COMMAND_TOOLS.has(toolName) ||
      getNonCommandToolInputKind(toolName) !== 'unknown' ||
      typeof command !== 'string' ||
      command.trim() === ''
    ) {
      return undefined;
    }
    const key = JSON.stringify([header.id, toolName]);
    if (noticed.has(key)) return undefined;
    const environment = createProcessEnvironment();
    const declared = loadPolicySnapshot(environment, {
      cwd: header.cwd ?? process.cwd(),
    }).policy.commandTools.some((tool) => tool.name === toolName);
    if (declared) return undefined;
```

</details>

**依据 4 · 源码核查**：[src/hosts/deepseek-harness/install.ts:167-180](https://github.com/kenryu42/cc-safety-net/blob/e3df63b8ee54bfe01b5063d7f07aeb60d358cf48/src/hosts/deepseek-harness/install.ts#L167-L180)

分 profile 移除路径。

<details>
<summary>查看原文（14行）</summary>

```text
  if (desktopLeftBehind && !installed.has('web')) throw new Error(desktopNotFound('remove'));
  if (cli && isDesktopRunning(environment, location.platform)) throw new Error(DESKTOP_RUNNING);
  return {
    commands: [
      ...(cli ? [[cli, 'plugin', '--profile', 'desktop', 'remove', PACKAGE_NAME] as const] : []),
      ...(installed.has('web')
        ? [[...NPX_DSH, 'plugin', '--profile', 'web', 'remove', PACKAGE_NAME] as const]
        : []),
    ],
    ...(desktopLeftBehind
      ? {
          afterUninstall: () => {
            throw new Error(
              `Removed ${PACKAGE_NAME} from the DeepSeek Harness web profile, but ${desktopNotFound('remove')}`,
```

</details>

#### 缺口

- 未实测第三方 shell 和工作目录语义。
  **影响**：不能保证未声明工具享受完整 shell 策略。
  **进一步探讨**：用模拟工具分别检查已声明、未声明和错目录。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证覆盖和误拦而不执行危险命令？

**研究主题**：新假设与验证

#### 完整回答

假设在明确工具名单和项目目录后，前置规则能增加危险意图识别，同时保持合法操作不被大量拦截。在可丢弃目录注册仅记调用次数的假 bash、pwsh 与第三方工具，传入测试字符串而不执行其中命令。覆盖正常只读、命令嵌套、错误工作目录和未声明工具。比较仅宿主审批与加装规则时的拒绝原因、误拦、假工具调用次数和后置提示时序。如果未声明第三方工具被当作已保护、原生拒绝仍执行，或误拦造成大量手工改写，就不扩大使用。

#### 证据与依据

**依据 1 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:44-69](https://github.com/kenryu42/cc-safety-net/blob/e3df63b8ee54bfe01b5063d7f07aeb60d358cf48/src/hosts/deepseek-harness/guard.ts#L44-L69)

测试可分前置和后置观测。

<details>
<summary>查看原文（26行）</summary>

```text
export const DEEPSEEK_HARNESS_COMMAND_TOOLS = new Map<string, CommandToolKind>([
  ['bash', 'posix'],
  ['pwsh', 'powershell'],
]);

const DEEPSEEK_HARNESS_HOST: PluginToolCallHost<unknown, string, string | undefined> = {
  agent: 'deepseek-harness',
  debugLabel: 'deepseek-harness tool guard',
  extract: (execution, launchCwd, paths) => getDeepSeekHarnessToolCall(execution, launchCwd, paths),
  getSessionId: (execution) =>
    (execution as DeepSeekHarnessToolExecution | null)?.agent?.session.header.id,
  allow: undefined,
  block: (denial) => formatDenial(denial),
  includeEvidenceOnError: (toolCall) => toolCall.route.kind === 'command',
};

export function registerDeepSeekHarnessGuard(ctx: DeepSeekHarnessContext): void {
  const handle = createDeepSeekHarnessGuardHandler();
  ctx.tools.guard((execution) => handle(execution, process.cwd()));
  const noticed = new Set<string>();
  ctx.on('tools/post-execute', async (execution, _result, next) => {
    const decision = await next();
    const notice = noticeUndeclaredCommandTool(execution, noticed);
    if (!notice) return decision;
    return { ...decision, additionalContexts: [notice, ...(decision.additionalContexts ?? [])] };
  });
```

</details>

**依据 2 · 源码核查**：[src/gate/pipeline.ts:126-145](https://github.com/kenryu42/cc-safety-net/blob/e3df63b8ee54bfe01b5063d7f07aeb60d358cf48/src/gate/pipeline.ts#L126-L145)

声明对第三方工具的可测差异。

<details>
<summary>查看原文（20行）</summary>

```text
  const declarationSnapshot =
    hostInvocation.route.kind === 'unknown' && inputCommand ? loadSnapshot() : undefined;
  const declaration = declarationSnapshot?.policy.commandTools.find(
    (tool) => tool.name === hostInvocation.toolName,
  );
  const promotion =
    declaration && inputCommand
      ? promoteDeclaredCommandTool(
          hostInvocation,
          inputCommand,
          declaration.cwd,
          options.environment.paths,
        )
      : hostInvocation;
  if ('decision' in promotion) return promotion;
  const invocation = promotion;
  const promoted = invocation === hostInvocation ? {} : { promotedInvocation: invocation };
  const command = isCommandInvocation(invocation) ? invocation.command : inputCommand;

  const facts = callDependency('policy-protection', command, () => createSemanticFacts(invocation));
```

</details>

#### 缺口

- 未运行宿主模拟。
  **影响**：验证设计不能作为已测安全证据。
  **进一步探讨**：分别保存规则输入、宿主结果与假工具执行计数。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
