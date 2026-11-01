# CC Safety Net

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[24b5e01](https://github.com/kenryu42/cc-safety-net/tree/24b5e018d20f21335619e40fb855de3b6c27ee9e)

<!-- BEGIN META -->
[![GitHub ★ 1,877](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C877&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kenryu42/cc-safety-net) [![npm 30d 89,094](https://img.shields.io/static/v1?label=npm+30d&message=89%2C094&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cc-safety-net) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cc-safety-net)
<!-- END META -->

> **功能**：在编码 Agent 的工具调用前检查危险命令和敏感文件访问。

> **亮点**：[Q02](#research-q02) 将可配置命令和敏感路径检查接入 DSH 执行前 guard，相对仅依赖提示词提供一个可解释的判断点；它不是进程隔离。

> **主要限制**：[Q03](#research-q03) 中标准模式允许部分动态形式，未知工具的提醒在执行后；覆盖遗漏不能由异常拒绝机制消除。

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
  - [Q01 · 用户、类型和依赖是什么？](#detail-section-11)
  - [Q02 · 请求如何从 DSH 工具到策略判定和阻断？](#detail-section-12)
  - [Q03 · 覆盖范围、异常和策略边界是什么？](#detail-section-13)
  - [Q04 · 成本效果和假设是什么？](#detail-section-14)
  - [Q05 · 谁可试用、何时退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向希望减少编码 Agent 误执行危险命令的用户，合格结果须兼顾阻断与正常工作。

宿主原生审批、沙箱与人工复核是原有控制；提示词本身不能保证工具执行被阻止。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 执行前规则检查 | 对受覆盖命令和敏感目标作允许或拒绝判断 | 依赖 DSH guard 实际接线和规则覆盖，不是沙箱 |
| 未声明工具通知 | 告知用户命令工具尚未被检查 | 通知发生在执行后，不能撤销副作用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与 tools 服务 | DSH 接入必需 | 注册执行前 guard | 不经过 guard 的操作无法被该路径检查 |
| Node 和已启用 profile | 安装运行必需 | 装载插件和策略 | 无法获得预期保护 |
| 已声明的自定义本地命令工具 | 检查该工具时需要 | 识别命令与目录 | 未声明时可能只在执行后提示 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份配置并盘点工具 | 明确 profile 与执行位置 |
| 加载 | 用户在隔离环境检查插件启用 | guard 和规则按预期注册 |
| 验收 | 用户用非破坏样本查看解释 | 拒绝与放行符合预期 |
| 异常 | 用户停止依赖并核查配置 | 回到宿主审批和人工复核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地安装与运行资源 | 检查 profile 和工具覆盖 | 时间未知 |
| 持续使用 | 本地分析与日志资源 | 维护规则并处理误拦 | 频率与耗时未知 |
| 失败恢复 | 排查与重试资源 | 核查未受检动作及副作用 | 实际损失未知 |
| 退出 | 配置迁移资源 | 恢复原生审批并核对状态 | 停用不撤销已执行动作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 调用前检查 | DSH guard 和策略管线接线 | 实际工具覆盖和误拦率 |
| 异常处理 | 共享 handler 的异常拒绝 | 所有执行渠道均受保护 |

> **思考**：[Q03](#research-q03) 中标准模式允许部分动态形式，未知工具的提醒在执行后；覆盖遗漏不能由异常拒绝机制消除。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将可配置命令和敏感路径检查接入 DSH 执行前 guard，相对仅依赖提示词提供一个可解释的判断点；它不是进程隔离。

[Q02](#research-q02) 将宿主适配与共享规则分离；[Q03](#research-q03) 事后通知和标准模式残余风险必须限制防护声明。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 中标准模式允许部分动态形式，未知工具的提醒在执行后；覆盖遗漏不能由异常拒绝机制消除。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议保留宿主审批并用非破坏样本核查工具覆盖；误拦或未检查提示出现时停止依赖并人工复核。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 DSH guard 接线及规则判定；完整覆盖、实际宿主效果与用户收益未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、docs/residual-risk.md、src/entries/deepseek-harness/index.ts、src/hosts/deepseek-harness/guard.ts、src/hosts/deepseek-harness/install.ts、src/hosts/hook/plugin-adapter.ts、src/hosts/runtime.ts、src/gate/pipeline.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查 DSH 入口、命令工具提取和共享规则管线，未审计全部规则、其他宿主或真实执行。
- 下一步：在隔离 DSH profile 盘点实际工具，使用无破坏输入核查拒绝和解释，记录误拦及不受检调用。

**分析版本**

- **仓库**：[kenryu42/cc-safety-net](https://github.com/kenryu42/cc-safety-net)
- **版本号**：2.7.1（[固定提交 24b5e01](https://github.com/kenryu42/cc-safety-net/tree/24b5e018d20f21335619e40fb855de3b6c27ee9e)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设安装后提供待审阅的工具覆盖清单可减少首次不受检调用，需用安全样本对照覆盖与误声明，尚未验证。

在隔离 DSH profile 盘点实际工具，使用无破坏输入核查拒绝和解释，记录误拦及不受检调用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 65 | 3717 | — | — | 36695 |
| .ts | source | 306 | 57740 | 52894 | 188 | — |
| .ts | test | 262 | 66084 | 61352 | 1037 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/kenryu42/cc-safety-net/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 29](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=29&color=737b86&logo=github)](https://github.com/kenryu42/cc-safety-net/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 27](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=27&color=737b86&logo=github)](https://github.com/kenryu42/cc-safety-net/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 中危险命令拦截如何接线及其规则、拒绝、覆盖与旁路边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户、类型和依赖是什么？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

CC Safety Net 是跨多个编码 Agent 宿主的命令与敏感路径检查工具，包也提供 DSH 插件入口。目标用户希望在工具执行前拦截部分破坏性操作并得到原因；合格结果是预期危险调用被拒、正常工作仍能继续，并保持宿主原有权限边界。包声明 Node 运行时、CLI 与 DSH 集成入口；DSH 侧依赖 tools 服务和对应 profile 中实际启用。它不是沙箱，不能约束未经过已覆盖工具的进程、文件权限或网络。未安装、执行目标插件或验证当前宿主。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-25](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/README.md#L23-L25)

作者描述用途及非沙箱边界。

```text
</div>

CC Safety Net (Coding CLI Safety Net) blocks destructive commands and access to secrets such as SSH keys and `.env` files before the tool call runs. It parses what the command does. Wrapping the command or reordering flags does not hide it. A broken config file falls back to safe defaults instead of stopping your agent. It is not a sandbox: it does not contain processes, set filesystem permissions, or watch network egress.
```

**依据 2 · 作者声明**：[README.md:40-54](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/README.md#L40-L54)

作者列出 DSH 支持。

<details>
<summary>查看原文（15行）</summary>

```text
## Supported coding CLIs

CC Safety Net supports these coding agent CLIs on Windows, macOS, and Linux.

<table align="center">
  <tr>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/amp-code"><picture><source media="(prefers-color-scheme: dark)" srcset="./.github/assets/amp-dark.svg"><img alt="Amp Code" src="./.github/assets/amp-light.svg" height="32"></picture><br>Amp Code</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/antigravity-cli"><img alt="Antigravity CLI" src="./.github/assets/antigravity-cli.png" height="32"><br>Antigravity CLI</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/claude-code"><img alt="Claude Code" src="./.github/assets/claude-code.svg" height="32"><br>Claude Code</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/codex"><img alt="Codex" src="./.github/assets/codex.svg" height="32"><br>Codex</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/cursor"><picture><source media="(prefers-color-scheme: dark)" srcset="./.github/assets/cursor-dark.svg"><img alt="Cursor" src="./.github/assets/cursor-light.svg" height="32"></picture><br>Cursor</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/deepseek-harness"><img alt="DeepSeek Harness" src="./.github/assets/deepseek.svg" height="32"><br>DeepSeek Harness</a></td>
    <td align="center"><a href="https://ccsafetynet.com/docs/installation/devin-cli"><picture><source media="(prefers-color-scheme: dark)" srcset="./.github/assets/devin-dark.svg"><img alt="Devin CLI" src="./.github/assets/devin-light.svg" height="32"></picture><br>Devin CLI</a></td>
```

</details>

**依据 3 · 作者声明**：[README.md:81-90](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/README.md#L81-L90)

安装和 Node 条件。

<details>
<summary>查看原文（10行）</summary>

````text
## Quick start

You need Node.js 22 or higher. Install into the coding CLIs on this machine, then check that protection is working:

```bash
npx -y cc-safety-net@latest install
npx -y cc-safety-net@latest doctor
```

Update with `npx -y cc-safety-net@latest update` and uninstall with `npx -y cc-safety-net uninstall`. Keep the `@latest` qualifier: a bare `cc-safety-net` spec can run an older copy from the npx cache. Per-CLI requirements are in [Installation](https://ccsafetynet.com/docs/installation).
````

</details>

**依据 4 · 源码核查**：[src/entries/deepseek-harness/index.ts:1-6](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/entries/deepseek-harness/index.ts#L1-L6)

DSH 插件入口与 tools 注入。

```text
import { registerDeepSeekHarnessGuard } from '@/hosts/deepseek-harness/guard';

export default {
  name: 'cc-safety-net',
  inject: ['tools'],
  apply: registerDeepSeekHarnessGuard,
```

**依据 5 · 源码核查**：[src/hosts/deepseek-harness/install.ts:101-127](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/hosts/deepseek-harness/install.ts#L101-L127)

DSH 安装计划针对 desktop/web profile。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

#### 缺口

- 目标 DSH profile 中 guard 是否实际安装启用并覆盖用户所用工具
  **影响**：决定拦截是否发生
  **进一步探讨**：在隔离环境核查实际注册和非破坏性解释结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 请求如何从 DSH 工具到策略判定和阻断？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

DSH 入口注册 tools.guard，并把执行对象交给共享 handler；提取器使用会话 cwd 和可选 workdir 构造调用，内建 bash/pwsh 映射到对应 shell，格式错误或路径不可用可返回拒绝。共享 handler 调用 runtime guard，后者进入 evaluateGuard：装载适用策略、将已声明的命令工具提升为命令调用，检查受保护目标，再对命令执行分析；结果经宿主适配转换为拒绝文本或放行。未知命令工具若未声明，后执行监听会提醒用户这一调用没有检查，提醒发生在动作之后。相比依赖提示词自律，源码提供了执行前规则判定接线，但只覆盖实际进入该宿主 guard 且能识别的调用，不能推断系统级隔离或全量阻止。

#### 证据与依据

**依据 1 · 源码核查**：[src/entries/deepseek-harness/index.ts:1-6](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/entries/deepseek-harness/index.ts#L1-L6)

DSH 入口挂载 guard。

```text
import { registerDeepSeekHarnessGuard } from '@/hosts/deepseek-harness/guard';

export default {
  name: 'cc-safety-net',
  inject: ['tools'],
  apply: registerDeepSeekHarnessGuard,
```

**依据 2 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:44-68](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/hosts/deepseek-harness/guard.ts#L44-L68)

内建工具映射、执行前 guard 与后执行通知。

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:125-155](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/hosts/deepseek-harness/guard.ts#L125-L155)

会话 cwd、工具路由和非法输入处理。

<details>
<summary>查看原文（31行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:157-185](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/hosts/deepseek-harness/guard.ts#L157-L185)

命令和 workdir 校验。

<details>
<summary>查看原文（29行）</summary>

```text
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
  );
```

</details>

**依据 5 · 源码核查**：[src/hosts/hook/plugin-adapter.ts:65-75](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/hosts/hook/plugin-adapter.ts#L65-L75)

handler 捕获错误并阻断。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[src/hosts/hook/plugin-adapter.ts:88-118](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/hosts/hook/plugin-adapter.ts#L88-L118)

提取、拒绝和实际策略调用。

<details>
<summary>查看原文（31行）</summary>

```text
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
  }

  const project = (
    evaluation: Parameters<typeof projectGuardDenial>[0],
    includeEvidence: boolean,
  ) => {
    const denial = projectGuardDenial(evaluation, { includeEvidence });
    return denial ? host.block(denial) : host.allow;
  };

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
```

</details>

**依据 7 · 源码核查**：[src/hosts/runtime.ts:24-33](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/hosts/runtime.ts#L24-L33)

runtime 调用 evaluateGuard 与审计。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

**依据 8 · 源码核查**：[src/gate/pipeline.ts:113-145](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/gate/pipeline.ts#L113-L145)

策略和已声明工具的路由。

<details>
<summary>查看原文（33行）</summary>

```text
export function evaluateGuard(
  hostInvocation: ToolInvocation,
  options: GuardOptions,
): GuardEvaluation {
  const dependencies = { ...DEFAULT_DEPENDENCIES, ...options.dependencies };
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

**依据 9 · 源码核查**：[src/gate/pipeline.ts:280-310](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/gate/pipeline.ts#L280-L310)

非命令放行与命令分析。

<details>
<summary>查看原文（31行）</summary>

```text
  if (!isCommandInvocation(invocation)) {
    return { stage: 'non-command', ...reported, decision: { kind: 'allow' } };
  }

  if (!invocation.command || invocation.command.trim() === '') {
    return { ...malformedToolCallEvaluation(command), ...reported };
  }

  const analysis = callDependency('command-analysis', command, () =>
    analyzeOrCapBreach(
      () =>
        dependencies.analyzeCommand(
          invocation.command as string,
          {
            cwd: invocation.context.configCwd,
            effectiveCwd: invocation.context.executionCwd,
            shell: invocation.route.shell,
            policySnapshot: snapshot,
            environment: options.environment,
            protectedGitMetadata,
            effectiveCapabilities: modes.capabilities,
            worktreeMode: modes.worktreeMode,
            budget,

            ...(options.trace ? { trace: options.trace } : {}),
          },
          getDeclaredCommandProgram(facts),
          facts.store,
        ),
      invocation.command as string,
      options.trace,
```

</details>

**依据 10 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:72-104](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/hosts/deepseek-harness/guard.ts#L72-L104)

未知命令工具的事后通知。

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

#### 缺口

- 实际 DSH 版本、所有工具与插件的 guard 接线及策略有效性
  **影响**：决定覆盖是否满足具体用户需求
  **进一步探讨**：对列出的工具用无破坏性输入和解释功能核查，单独审阅自定义工具

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 覆盖范围、异常和策略边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

作者明确说明它不是进程沙箱；标准模式对部分动态拼出的命令名称和参数接受残余风险，不能承诺拦截所有危险输入。DSH 内置命令映射只有 bash 和 pwsh，其他命令工具需通过策略声明；未声明时可在执行后发通知，不能逆转已执行副作用。代码对格式错误、未知异常采取拒绝，但非命令调用在前面的目标检查后可放行；不能把 fail closed 推广成所有可执行渠道都受到检查。误拦可能中断正常工作，策略变更与配置回退需要单独核对。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-25](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/README.md#L23-L25)

明确非沙箱边界。

```text
</div>

CC Safety Net (Coding CLI Safety Net) blocks destructive commands and access to secrets such as SSH keys and `.env` files before the tool call runs. It parses what the command does. Wrapping the command or reordering flags does not hide it. A broken config file falls back to safe defaults instead of stopping your agent. It is not a sandbox: it does not contain processes, set filesystem permissions, or watch network egress.
```

**依据 2 · 作者声明**：[docs/residual-risk.md:111-129](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/docs/residual-risk.md#L111-L129)

标准模式对动态命令与参数的已知风险。

<details>
<summary>查看原文（19行）</summary>

```text
## Adjudicated Families

### RR-1: Dynamic Executables and Computed Command Names

Command names assembled at runtime: `$(printf r)m -rf /`; `c=rm; "$c" -rf dir`;
`$(which rm) -rf dir`. Standard allows these by contract: helpful agents write the literal command
name, and resolving computed names means emulating shell expansion. Strict blocks the family as
`shell.dynamic-executable`.

Adjudicated 2026-07-22. Sources: `SECURITY.md` safety-preset contract; behavioral-contract case
"allows an executable assembled by command substitution at standard safety".

### RR-2: Command Structure Assembled Through Substitution

Flags or operands that materialize from substitution output at runtime, such as
`rm $(printf -- '-rf') dir`. Standard allows guarded structure-via-substitution; the bounded
conservative rules that already catch dynamic input, such as the xargs and GNU Parallel
dynamic-input rules and the linear dangerous-text scans, stay active. Strict fails closed on
unverifiable forms.
```

</details>

**依据 3 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:44-68](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/hosts/deepseek-harness/guard.ts#L44-L68)

内建映射与事后通知。

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/hosts/hook/plugin-adapter.ts:65-75](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/hosts/hook/plugin-adapter.ts#L65-L75)

未捕获异常转拒绝。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[src/gate/pipeline.ts:280-285](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/gate/pipeline.ts#L280-L285)

非命令分支的放行。

```text
  if (!isCommandInvocation(invocation)) {
    return { stage: 'non-command', ...reported, decision: { kind: 'allow' } };
  }

  if (!invocation.command || invocation.command.trim() === '') {
    return { ...malformedToolCallEvaluation(command), ...reported };
```

#### 缺口

- 目标环境的旁路覆盖、误拦率和策略配置是否适配
  **影响**：影响实际防护与工作连续性
  **进一步探讨**：用安全样本对照宿主工具清单和审计记录，不执行破坏命令

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本效果和假设是什么？

**研究主题**：效果与总成本、新假设与验证

#### 完整回答

安装和持续维护需要确认宿主 profile、Node、规则与自定义工具，排除误拦要读拒绝原因并修订策略；日志与本地分析也消耗资源。没有本次同任务的危险拦截率、误拦率、时间或真实损失数据，不能宣称杜绝事故。可提出未验证假设：在安装后用宿主注册表生成待审阅的工具覆盖清单，标出会执行本地命令但未声明的工具，可能减少首次不受检调用；新增发现和审核成本，也不能自动判断远程执行位置。比较人工盘点与清单方式的覆盖准确率、错误声明率与时间；错误声明或未覆盖率未下降即否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:72-104](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/hosts/deepseek-harness/guard.ts#L72-L104)

当前在未知命令工具执行后才提示声明。

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

**依据 2 · 作者声明**：[README.md:72-79](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/README.md#L72-L79)

规则和解释入口的产品声明。

```text
## Features

- **Blocks destructive commands** such as `git reset --hard`, `git push --force`, and `rm -rf` on dangerous targets, and install scripts piped from the internet (`curl … | bash`), even inside `bash -c` or `python -c`. See [Blocked commands](https://ccsafetynet.com/docs/reference/blocked-commands).
- **Blocks secret access** to SSH keys, `.env` files, `~/.aws`, and coding-CLI credentials, from the shell and from the agent's file tools. See [Secret protection](https://ccsafetynet.com/docs/reference/secret-protection).
- **Tunes the policy in a GUI.** Run `npx cc-safety-net gui` to pick the Standard, Strict, or Paranoid preset and turn rules on or off. See [Dashboard](https://ccsafetynet.com/docs/guides/dashboard).
- **Adds blocks through rulebooks**: official packs for Terraform, AWS, gcloud, and Azure, or your own JSON. See [Official rulebooks](https://ccsafetynet.com/docs/configuration/rulebooks).
- **Shares policy through git.** Commit `.cc-safety-net/` so clones and cloud sessions get the same rules. See [Team setup](https://ccsafetynet.com/docs/guides/team-setup).
- **Embeds in your own tools.** Call `checkCommand` from Node.js without installing the hook. See [Library API](https://ccsafetynet.com/docs/reference/library-api).
```

**依据 3 · 作者声明**：[docs/residual-risk.md:113-129](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/docs/residual-risk.md#L113-L129)

标准模式残余风险。

<details>
<summary>查看原文（17行）</summary>

```text
### RR-1: Dynamic Executables and Computed Command Names

Command names assembled at runtime: `$(printf r)m -rf /`; `c=rm; "$c" -rf dir`;
`$(which rm) -rf dir`. Standard allows these by contract: helpful agents write the literal command
name, and resolving computed names means emulating shell expansion. Strict blocks the family as
`shell.dynamic-executable`.

Adjudicated 2026-07-22. Sources: `SECURITY.md` safety-preset contract; behavioral-contract case
"allows an executable assembled by command substitution at standard safety".

### RR-2: Command Structure Assembled Through Substitution

Flags or operands that materialize from substitution output at runtime, such as
`rm $(printf -- '-rf') dir`. Standard allows guarded structure-via-substitution; the bounded
conservative rules that already catch dynamic input, such as the xargs and GNU Parallel
dynamic-input rules and the linear dangerous-text scans, stay active. Strict fails closed on
unverifiable forms.
```

</details>

#### 缺口

- 相同任务的覆盖率、误拦及维护时间
  **影响**：不能计算每次合格操作成本或事故降低
  **进一步探讨**：用无破坏性的已标注样本比较拦截和人工审核成本

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁可试用、何时退出？

**研究主题**：采用判断

#### 完整回答

能维护本地 DSH profile 并理解规则边界的用户，可先在无敏感数据的隔离环境检查安装状态和工具覆盖，用非破坏输入查看解释，保留宿主原有审批。相比仅写提示词，它在受覆盖的调用前有规则判断，但不能替代沙箱或人工权限管理。若正常操作反复误拦、出现未检查工具提示或实际工具不走 guard，应停止依赖该插件作为执行门槛，先查规则和宿主注册并回到原生审批与人工复核；不要用真实破坏命令验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:60-68](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/hosts/deepseek-harness/guard.ts#L60-L68)

注册 guard 和执行后通知。

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
```

**依据 2 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:89-104](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/src/hosts/deepseek-harness/guard.ts#L89-L104)

未声明工具提示和非破坏性检查建议。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 3 · 作者声明**：[README.md:23-25](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/README.md#L23-L25)

非沙箱界限。

```text
</div>

CC Safety Net (Coding CLI Safety Net) blocks destructive commands and access to secrets such as SSH keys and `.env` files before the tool call runs. It parses what the command does. Wrapping the command or reordering flags does not hide it. A broken config file falls back to safe defaults instead of stopping your agent. It is not a sandbox: it does not contain processes, set filesystem permissions, or watch network egress.
```

**依据 4 · 作者声明**：[docs/residual-risk.md:113-129](https://github.com/kenryu42/cc-safety-net/blob/24b5e018d20f21335619e40fb855de3b6c27ee9e/docs/residual-risk.md#L113-L129)

标准模式有明确残余风险。

<details>
<summary>查看原文（17行）</summary>

```text
### RR-1: Dynamic Executables and Computed Command Names

Command names assembled at runtime: `$(printf r)m -rf /`; `c=rm; "$c" -rf dir`;
`$(which rm) -rf dir`. Standard allows these by contract: helpful agents write the literal command
name, and resolving computed names means emulating shell expansion. Strict blocks the family as
`shell.dynamic-executable`.

Adjudicated 2026-07-22. Sources: `SECURITY.md` safety-preset contract; behavioral-contract case
"allows an executable assembled by command substitution at standard safety".

### RR-2: Command Structure Assembled Through Substitution

Flags or operands that materialize from substitution output at runtime, such as
`rm $(printf -- '-rf') dir`. Standard allows guarded structure-via-substitution; the bounded
conservative rules that already catch dynamic input, such as the xargs and GNU Parallel
dynamic-input rules and the linear dangerous-text scans, stay active. Strict fails closed on
unverifiable forms.
```

</details>

#### 缺口

- 实际宿主的安装、规则及自定义工具是否按预期生效
  **影响**：影响用户是否可依赖它阻止具体调用
  **进一步探讨**：使用隔离环境与非破坏样本核验并检查记录

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
