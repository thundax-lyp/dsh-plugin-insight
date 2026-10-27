# CC Safety Net

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[71baf74](https://github.com/kenryu42/cc-safety-net/tree/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf)

<!-- BEGIN META -->
[![GitHub ★ 1,792](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C792&color=yellow&logo=github&style=flat)](https://github.com/kenryu42/cc-safety-net) [![npm 30d 67,218](https://img.shields.io/static/v1?label=npm+30d&message=67%2C218&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/cc-safety-net) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/cc-safety-net)
<!-- END META -->

> **实现功能**：在编码 Agent 工具执行前检查破坏性命令和秘密文件访问，支持 DSH 等多个宿主。

> **核心亮点**：相对提示词约束，DSH工具guard形成执行前拒绝；多CLI复用裁决而分别提取输入，增量属于策略适配。见[Q01](#research-q01)。

> **风险与缺陷**：未声明自定义命令工具可能先执行再收到未检查提示，且它不隔离进程或网络；不能当唯一安全边界。见[Q03](#research-q03)。

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
  - [Q01 · 根工程如何给DSH提供执行前安全门槛？](#detail-section-11)
  - [Q02 · 工具输入怎样变成检查与拒绝？](#detail-section-12)
  - [Q03 · 什么覆盖边界最可能使安全承诺不成立？](#detail-section-13)
  - [Q04 · 安装、持续维护与异常退出支持什么试用？](#detail-section-14)
  - [Q05 · 怎样把覆盖缺口变成可证伪的策略解释？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：让Agent在本地仓库操作的开发者可增加执行前命令/秘密访问检查，保留原生权限控制。

提示词约束、宿主原生审批和系统沙箱是不同层次的基线；只比较执行前策略适配，不宣称取代隔离。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH执行前检查 | 拒绝危险命令与秘密路径调用 | tools.guard和正确工具/cwd语义 |
| 未覆盖工具提示 | 告知未知命令已执行未检查 | 事后提示，不是预先阻止 |
| 策略与诊断CLI | 管规则、核安装和卸载 | 自定义规则无效会回退，需看诊断 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=18与DSH tools.guard | 必需 | 分发与执行前注册 | 不能据npm安装成功认定启用 |
| 正确工具/cwd声明 | 自定义工具必需 | 命令解释范围 | 未声明可能只事后提示 |
| 有效策略及规则来源 | 自定义规则必需 | 团队防护条件 | 无效项不生效，退回保护默认 |
| 宿主权限/系统隔离 | 安全边界仍需 | 限进程与网络 | 本插件不替代它们 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者备份profile和策略，退出Desktop | 安装器选对宿主/profile |
| 检查 | 开发者doctor及只读语料评估 | 启用、应放/应拒和工具覆盖可解释 |
| 使用 | Agent经已覆盖工具执行任务 | 拒绝有规则依据，未知项保持原生审批 |
| 恢复 | 开发者修策略或按profile卸载 | 原生权限继续生效，不把卸载当放开权限 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node/npm及插件资源；金额未知 | 核profile、退出Desktop、安装doctor | 真实宿主未验 |
| 持续使用 | 每调用分析CPU/日志；量未知 | 管策略、解释误报和工具声明 | 不以配置可用推断保护完整 |
| 失败恢复 | 诊断与配置回退资源 | 核失效规则或卸载、恢复原生审批 | 延迟、误拦及修复耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 执行前门槛 | DSH guard与拒绝投影 | 真实宿主兼容与漏报率 |
| 秘密保护 | pipeline先做路径检查 | 任意自定义工具覆盖 |
| 策略维护 | 内建保护回退与诊断 | 误报/延迟及净维护收益 |

> **思考**：未声明自定义命令工具可能先执行再收到未检查提示，且它不隔离进程或网络；不能当唯一安全边界。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对提示词约束，DSH工具guard形成执行前拒绝；多CLI复用裁决而分别提取输入，增量属于策略适配。见[Q01](#research-q01)。

相对提示词约束，DSH工具guard形成执行前拒绝；多CLI复用裁决而分别提取输入，增量属于策略适配。见[Q01](#research-q01)。

宿主提取、共享裁决和结果投影分层可复用；结构预算与异常fail-closed值得借鉴。代价是工具身份、cwd和远端执行语义必须逐宿主核对，见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

未声明自定义命令工具可能先执行再收到未检查提示，且它不隔离进程或网络；不能当唯一安全边界。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

在临时无秘密仓库受控试用，先核工具覆盖和应放/应拒语料；不执行危险命令来证明阻止。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

DSH接入与共享裁决可核查；误报/漏报及真实宿主兼容未验，覆盖矩阵为未验证设计。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、dist/deepseek-harness/cordis.patch.yml、src/entries/deepseek-harness/index.ts、src/hosts/deepseek-harness/guard.ts、src/hosts/deepseek-harness/install.ts、src/hosts/hook/plugin-adapter.ts、src/gate/pipeline.ts、src/core/policy/snapshot.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查DSH专用适配、共享pipeline关键顺序和安装器；不执行目标代码、不审计全部解析分支或所有CLI，不提供绝对安全保证。
- 下一步：固定无副作用命令语料比较应拒/应放，核自定义本机与远端工具声明；临时profile再检查真实注册、诊断与卸载，记录误拦和时延。

**分析版本**

- **仓库**：[kenryu42/cc-safety-net](https://github.com/kenryu42/cc-safety-net)
- **版本号**：2.6.19（[固定提交 71baf74](https://github.com/kenryu42/cc-safety-net/tree/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是首次执行前给出工具覆盖矩阵，将本机/远端和cwd解释显式化；若误标或配置负担超过发现收益就不推广。见[Q05](#research-q05)。

固定无副作用命令语料比较应拒/应放，核自定义本机与远端工具声明；临时profile再检查真实注册、诊断与卸载，记录误拦和时延。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 65 | 3698 | — | — | 36391 |
| .ts | source | 304 | 56960 | 52165 | 185 | — |
| .ts | test | 262 | 65156 | 60448 | 866 | — |

</details>

**活跃度**

[![近30天新建 30](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=30&color=grey&logo=github&style=flat)](https://github.com/kenryu42/cc-safety-net/issues?q=is%3Aissue+created%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z) [![近30天关闭 28](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=28&color=grey&logo=github&style=flat)](https://github.com/kenryu42/cc-safety-net/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查DSH执行前策略门槛的增量、工具覆盖及非沙箱边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根工程如何给DSH提供执行前安全门槛？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标人群是让编码Agent操作本地代码和文件、又担心破坏性命令或秘密读取的开发者。合格结果是在工具执行前返回可解释拒绝，并保留正常开发调用，而不是事后告警。与提示词“不要删除”相比，DSH入口实际注入tools并注册guard，能在宿主工具调用路径形成门槛；与操作系统沙箱相比，它只分析声明的工具输入，不限制进程权限和网络。根npm是多CLI分发工程，默认导出偏OpenCode，但dsh清单指向专用dist/deepseek-harness patch，故有真实DSH集成，并非把其他CLI hook冒充DSH插件。贡献在多宿主共享策略及语义检查适配，不应宣称沙箱隔离或对全部任意执行路径的防护。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-25](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/README.md#L25-L25)

作者明确命令和秘密检查及非沙箱定位

```text
CC Safety Net (Coding CLI Safety Net) blocks destructive commands and access to secrets such as SSH keys and `.env` files before the tool call runs. It parses what the command does. Wrapping the command or reordering flags does not hide it. A broken config file falls back to safe defaults instead of stopping your agent. It is not a sandbox: it does not contain processes, set filesystem permissions, or watch network egress.
```

**依据 2 · 源码核查**：[src/entries/deepseek-harness/index.ts:1-7](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/src/entries/deepseek-harness/index.ts#L1-L7)

DSH独立入口注入tools并应用guard

```text
import { registerDeepSeekHarnessGuard } from '@/hosts/deepseek-harness/guard';

export default {
  name: 'cc-safety-net',
  inject: ['tools'],
  apply: registerDeepSeekHarnessGuard,
};
```

**依据 3 · 源码核查**：[package.json:134-138](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/package.json#L134-L138)

根包DSH bundle指向专用patch

```text
  "dsh": {
    "bundle": {
      "patch": "./dist/deepseek-harness/cordis.patch.yml"
    }
  },
```

**依据 4 · 源码核查**：[dist/deepseek-harness/cordis.patch.yml:1-3](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/dist/deepseek-harness/cordis.patch.yml#L1-L3)

DSH行加载专用入口

```text
- insert:
    - id: cc-safety-net
      name: ./index.js
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具输入怎样变成检查与拒绝？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DSH适配默认将bash路由为POSIX、pwsh为PowerShell；执行对象携带session cwd，workdir存在时相对解析成可信目录。格式不符或cwd不可用返回明确拒绝，调用共享plugin-adapter，意外异常也fail-closed。共享pipeline可按policy.commandTools把未知工具提升为已声明命令工具，随后形成语义facts、预算限制、秘密路径检查和命令分析。秘密检查先于非命令放行，因此文件型工具也可能受保护；对非命令路径的识别依赖具体工具输入分类，不能从这条顺序推断所有自定义工具都覆盖。结构/递归预算超限有deny而非无限分析，避免解析自身失控。可复用处是宿主提取、共享裁决与拒绝格式投影的分层，代价是每个新工具都需正确声明执行位置和参数语义。

#### 证据与依据

**依据 1 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:44-62](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/src/hosts/deepseek-harness/guard.ts#L44-L62)

默认命令工具映射与guard注册

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:125-184](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/src/hosts/deepseek-harness/guard.ts#L125-L184)

session/workdir及格式校验

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

**依据 3 · 源码核查**：[src/hosts/hook/plugin-adapter.ts:70-84](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/src/hosts/hook/plugin-adapter.ts#L70-L84)

顶层异常fail-closed

<details>
<summary>查看原文（15行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[src/gate/pipeline.ts:125-175](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/src/gate/pipeline.ts#L125-L175)

未知命令提升与结构/递归限制

<details>
<summary>查看原文（51行）</summary>

```text
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
  const inputCandidate = getCommandSyntaxFact(facts, 'input-candidate');
  const declaredCommand = getCommandSyntaxFact(facts, 'declared-command');
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

**依据 5 · 源码核查**：[src/gate/pipeline.ts:248-281](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/src/gate/pipeline.ts#L248-L281)

秘密路径检查先于非命令放行

<details>
<summary>查看原文（34行）</summary>

```text
  const secretTarget =
    policy.secretProtection.enabled === false
      ? null
      : callDependency('secret-protection', command, () =>
          dependencies.findSensitiveTarget(
            facts,
            policy.secretProtection,
            options.environment,
            budget,
            {
              strict:
                isCommandInvocation(invocation) || inputCandidate?.program.dialect === 'powershell'
                  ? modes.strict
                  : undefined,
            },
          ),
        );
  if (secretTarget) {
    const displayCommand = command ?? secretTarget.target;
    return {
      stage: 'secret-protection',
      ...reported,
      decision: {
        kind: 'deny',
        reason: REASON_SECRET_PROTECTION,
        intent: 'hard_stop',
        ruleId: secretTarget.ruleId,
        evidence: { command: displayCommand, segment: secretTarget.target },
      },
    };
  }

  if (!isCommandInvocation(invocation)) {
    return { stage: 'non-command', ...reported, decision: { kind: 'allow' } };
```

</details>

#### 缺口

- 解析与规则在真实工作负载中的误报/漏报未测
  **影响**：可核执行前机制，不能确认防护有效率
  **进一步探讨**：用安全的离线命令语料检查裁决，再在临时无秘密工作区核宿主实际调用边界

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么覆盖边界最可能使安全承诺不成立？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

最关键边界是工具身份而不只是命令字符串。默认只有bash/pwsh；未知工具若带command，未声明时会在post-execute添加一次提示，文字明确说明刚才命令未检查，属于执行后发现覆盖缺口。policy声明可补覆盖，但只有明确在本机执行的工具应声明，远程工具不能套用本地cwd/路径解释。错误配置会保留内建保护或salvage有效项，损坏规则来源被丢弃并给诊断，意味着可用性回退不等于自定义策略仍生效。没有进程隔离、权限限制或出站观察，允许调用内部再启动的任意程序仍超出静态输入完整推理能力；应保持宿主权限、系统隔离和人工高风险审查。故“包装命令无法隐藏”只能按已实现解析范围理解，不能泛化为不可绕过。

#### 证据与依据

**依据 1 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:72-104](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/src/hosts/deepseek-harness/guard.ts#L72-L104)

未知命令工具在post-execute告知未检查，并要求核执行位置

<details>
<summary>查看原文（33行）</summary>

```text
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
    noticed.add(key);
    const profilesDir = getDeepSeekHarnessProfilesDir(environment);
    return Object.freeze({
      id: randomUUID(),
      role: 'user',
      content: Object.freeze([
        Object.freeze({
          type: 'text',
          text: `CC Safety Net did not check the command \`${toolName}\` just ran. It checks a plugin's shell tool only after the tool is declared. First find out where \`${toolName}\` runs its commands: check its tool description, and if that doesn't say, read its plugin's source under \`${profilesDir}/<profile>/node_modules\`. If it runs them on this machine, declare it with \`npx -y cc-safety-net rule tool add ${toolName}\`. Add \`--cwd-arg <name>\` if it takes its working directory in an argument other than \`workdir\`, \`cwd\` or \`working_directory\`. Don't test the declaration by running a destructive command; \`npx -y cc-safety-net rule tool list\` confirms it. If it runs them somewhere else, such as a remote host, or you can't tell, don't declare it. Either way, tell the user what you found and what you did.`,
```

</details>

**依据 2 · 源码核查**：[src/core/policy/snapshot.ts:95-105](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/src/core/policy/snapshot.ts#L95-L105)

无效规则源/配置的保护默认与诊断

<details>
<summary>查看原文（11行）</summary>

```text
function withDroppedSourceAdvice(errors: string[]): string {
  return `${withTerminalPeriod(errors.join('; '))} Those rule sources are not active; every other rule and all built-in protections still apply`;
}

function getPolicyFallbackWarning(userPolicy: ReturnType<typeof loadPolicyConfig>) {
  if (userPolicy.errors.length === 0) return undefined;
  const fallback =
    userPolicy.fallback === 'salvaged'
      ? 'the salvaged policy with protective defaults'
      : 'built-in protective defaults';
  return `invalid policy config: ${userPolicy.errors.join('; ')}. Enforcing ${fallback}; the invalid values are not active. Fix the policy file manually`;
```

</details>

**依据 3 · 作者声明**：[README.md:25-25](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/README.md#L25-L25)

作者明确不容器化进程、不设文件权限或监控网络

```text
CC Safety Net (Coding CLI Safety Net) blocks destructive commands and access to secrets such as SSH keys and `.env` files before the tool call runs. It parses what the command does. Wrapping the command or reordering flags does not hide it. A broken config file falls back to safe defaults instead of stopping your agent. It is not a sandbox: it does not contain processes, set filesystem permissions, or watch network egress.
```

#### 缺口

- 所有自定义工具、动态执行和宿主版本的覆盖未审计
  **影响**：不能作为唯一安全边界或撤掉原生权限
  **进一步探讨**：列出实际工具及执行位置，将未覆盖项单独标记并保留原生限制

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、持续维护与异常退出支持什么试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次需要Node>=18和匹配宿主，安装器区分Desktop carrier与web npx CLI；Desktop运行时拒绝修改插件，安装后检查profile是否启用。持续负担是每次工具调用的分析延迟、误报解释、策略更新和额外规则维护；本轮无金额和延迟基准。失败恢复应区分插件fail-closed导致正常调用被拒、配置回退导致自定义规则失效，以及工具未声明导致未检查，不应把“Agent还在运行”当防护健康。用户可doctor核安装并按对应profile卸载，但移除门槛后应保留宿主权限。建议在无敏感临时仓库试用，使用无副作用语料确认应拒/应放结果与未覆盖提示，不执行破坏命令来“测试保护”；若正常任务误拦无法解释或工具执行绕过guard，暂停依赖它并退回宿主权限与人工审核。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:87-98](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/README.md#L87-L98)

Node要求、install/doctor/update/uninstall作者流程

<details>
<summary>查看原文（12行）</summary>

````text
npx -y cc-safety-net@latest doctor
```

Update with `npx -y cc-safety-net@latest update` and uninstall with `npx -y cc-safety-net uninstall`. Keep the `@latest` qualifier: a bare `cc-safety-net` spec can run an older copy from the npx cache. Per-CLI requirements are in [Installation](https://ccsafetynet.com/docs/installation).

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) to report a bug or request a feature.

## License

MIT
````

</details>

**依据 2 · 源码核查**：[src/hosts/deepseek-harness/install.ts:101-139](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/src/hosts/deepseek-harness/install.ts#L101-L139)

安装前运行检测与安装后启用检查

<details>
<summary>查看原文（39行）</summary>

```text
export async function planDeepSeekHarnessInstall(
  environment: Environment,
  options: DesktopLocation & { probe?: InstallTargetProbe } = {},
) {
  const desktop = locateDesktop(environment, options);
  if (desktop.cli && isDesktopRunning(environment, options.platform)) {
    throw new Error(DESKTOP_RUNNING);
  }
  const web =
    !desktop.cli ||
    hasProfile(environment, 'web') ||
    (await (options.probe ?? probeInstallTarget)(DEEPSEEK_HARNESS_NPM_PROBE));
  const targets = [
    ...(desktop.cli ? [{ profile: 'desktop', label: 'Desktop', dsh: [desktop.cli] as const }] : []),
    ...(web ? [{ profile: 'web', label: 'web', dsh: NPX_DSH }] : []),
  ];
  return {
    commands: targets.map(
      (target) =>
        [
          ...target.dsh,
          'plugin',
          '--profile',
          target.profile,
          'add',
          `${PACKAGE_NAME}@${getPackageVersion()}`,
        ] as const,
    ),
    afterInstall: async () => {
      const enabled = new Set(
        listInstalledDeepSeekHarnessProfiles(environment)
          .filter((profile) => profile.enabled)
          .map((profile) => profile.name),
      );
      const disabled = targets.filter((target) => !enabled.has(target.profile));
      if (disabled.length > 0) {
        throw new Error(
          `DeepSeek Harness installed ${PACKAGE_NAME} in the ${describeProfiles(disabled)} but did not enable it. Enable it from the Plugins page.`,
        );
```

</details>

**依据 3 · 源码核查**：[src/hosts/deepseek-harness/install.ts:153-180](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/src/hosts/deepseek-harness/install.ts#L153-L180)

按profile卸载并报告遗留Desktop

<details>
<summary>查看原文（28行）</summary>

```text
export function planDeepSeekHarnessUninstall(
  environment: Environment,
  location: DesktopLocation = {},
) {
  const installed = new Set(
    listInstalledDeepSeekHarnessProfiles(environment).map((profile) => profile.name),
  );
  if (!installed.has('desktop') && !installed.has('web')) {
    throw new Error(
      `${PACKAGE_NAME} is not installed in the DeepSeek Harness web or Desktop profile`,
    );
  }
  const cli = installed.has('desktop') ? locateDesktop(environment, location).cli : undefined;
  const desktopLeftBehind = installed.has('desktop') && !cli;
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

- 目标版本真实安装和裁决延迟未知
  **影响**：不支持持续安装验收或低延迟承诺
  **进一步探讨**：临时profile核启用、应放/应拒语料、doctor和卸载，记录误拦解释及分析时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样把覆盖缺口变成可证伪的策略解释？

**研究主题**：新假设与验证

#### 完整回答

由未知工具的执行后提示可推导未验证方向：在首次使用前导出工具覆盖矩阵，标明本机/远端、shell/文件/未知、cwd来源和具体策略版本，并把未知项交给用户选择停用或保留原生审批。相对仅看已阻止命令日志，它把“没有检查”也变成可见状态；新增负担是工具清单同步与宿主接口适配。最小验证固定一组内建、自定义本机和远端工具，比较现有事后提示与预先覆盖矩阵的漏覆盖发现率及人工配置时间。若矩阵会误标远端为本机、遗漏动态工具或增加配置而不减少误信，就不应作为自动放行依据。此处是未验证设计，不暗示已有guard保护无效。

#### 证据与依据

**依据 1 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:72-104](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/src/hosts/deepseek-harness/guard.ts#L72-L104)

事后未知工具提示是覆盖矩阵的推导材料

<details>
<summary>查看原文（33行）</summary>

```text
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
    noticed.add(key);
    const profilesDir = getDeepSeekHarnessProfilesDir(environment);
    return Object.freeze({
      id: randomUUID(),
      role: 'user',
      content: Object.freeze([
        Object.freeze({
          type: 'text',
          text: `CC Safety Net did not check the command \`${toolName}\` just ran. It checks a plugin's shell tool only after the tool is declared. First find out where \`${toolName}\` runs its commands: check its tool description, and if that doesn't say, read its plugin's source under \`${profilesDir}/<profile>/node_modules\`. If it runs them on this machine, declare it with \`npx -y cc-safety-net rule tool add ${toolName}\`. Add \`--cwd-arg <name>\` if it takes its working directory in an argument other than \`workdir\`, \`cwd\` or \`working_directory\`. Don't test the declaration by running a destructive command; \`npx -y cc-safety-net rule tool list\` confirms it. If it runs them somewhere else, such as a remote host, or you can't tell, don't declare it. Either way, tell the user what you found and what you did.`,
```

</details>

**依据 2 · 源码核查**：[src/gate/pipeline.ts:125-140](https://github.com/kenryu42/cc-safety-net/blob/71baf747e2a5246bdf613a2894f2d6e7a5ad80bf/src/gate/pipeline.ts#L125-L140)

声明命令可提升路由，但依赖正确声明

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

#### 缺口

- 覆盖矩阵需求和宿主工具清单接口未验证
  **影响**：不能直接确定应另建插件或产品
  **进一步探讨**：先在现有CLI配置/doctor中试验只读报告，比较基线再判断独立价值

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
