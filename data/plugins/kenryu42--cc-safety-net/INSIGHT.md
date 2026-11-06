# cc-safety-net

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[7cb1936](https://github.com/kenryu42/cc-safety-net/tree/7cb1936d32660a3841d9128814af19ec5b82c615)

<!-- BEGIN META -->
[![GitHub ★ 1,920](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C920&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kenryu42/cc-safety-net) [![npm 30d 119,120](https://img.shields.io/static/v1?label=npm+30d&message=119%2C120&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cc-safety-net) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cc-safety-net)
<!-- END META -->

> **功能**：为编码 Agent 提供执行前危险命令与敏感路径检查，含原生 DSH guard 适配和本地策略/审计。

> **亮点**：宿主适配与共享语义规则/配置/审计分离，把已识别命令/路径的程序拒绝接到DSH执行前，见 [Q02](#research-q02)。

> **主要限制**：未知工具可能先运行再提醒，标准/配置有具体允许边界，坏配置回退/异常拒绝不能补所有渠道覆盖；日志写失败可静默，见 [Q03](#research-q03)-[Q04](#research-q04)。

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
  - [Q01 · 多宿主根和DSH插件是什么关系，解决什么事？](#detail-section-11)
  - [Q02 · DSH实际如何在执行前阻止工具，cwd和自定义工具怎么选？](#detail-section-12)
  - [Q03 · 标准/严格模式、未知工具和敏感路径能防到哪里？](#detail-section-13)
  - [Q04 · 策略和审计可信到什么程度，失败/退出会怎样？](#detail-section-14)
  - [Q05 · 如何试用，收益和全周期成本怎么核？](#detail-section-15)
  - [Q06 · 已有贡献和可证伪方向怎样划分？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：能审阅本机工具位置和项目策略的编码Agent用户，保留Host审批做无破坏试点，见 [Q01](#research-q01)/[Q05](#research-q05)。

原生人工审批、最小OS权限/沙箱与提示词；本包增加可解释规则点，不替代进程/文件/网络隔离。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| DSH guard | 调用前deny理由 | 需真实Host执行该gate |
| 命令规则 | bash/pwsh/声明本机工具 | 未识别不等已安全检查 |
| 敏感路径 | 语义路径与policy规则 | 非文件隔离/全外传监控 |
| 配置模式 | 标准/strict/paranoid | 可override/项目覆盖 |
| 事后notice | 提醒工具没受检 | 已运行，非阻断 |
| 审计 | 本地允许/拒绝记录 | 无sid/写失败可缺 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=22/匹配DSH/tools | 原生guard | 声明/注册非运行覆盖 |
| 可信本机cwd/工具声明 | 分析路径/命令 | 远程不套本机声明 |
| 用户/项目规则与有效模式 | 判断依据 | 项目默认可覆盖，坏源退化 |
| Host审批/OS最小权限 | 补覆盖与执行限制 | 插件非隔离 |
| 本地审计目录/保留策略 | 可查拒绝/允许 | 写失败静默/隐私成本 |

#### 步骤

| 阶段 | 动作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 隔离profile/备份/原审批 | 核工具位置/有效策略 |
| 预检 | 无破坏正常/拒绝样本 | 不执行危险命令验证 |
| 接线 | 核Host实际拒绝和cwd | 未受检渠道仍人工审批 |
| 异常 | notice/坏config/误拦先查目标 | 不补声明后盲重跑 |
| 退出 | 原审批在、核guard撤销 | 不撤回已执行效果 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工与未知 |
| --- | --- | --- |
| 首次 | 本地安装/配置 | 核profile/工具/规则，工时未知 |
| 持续 | 同步CPU/IO/日志 | 误拦/规则/自定义工具维护 |
| 失败 | 查漏检/退化/外部效果 | 恢复与损失未知，不推算避免损失 |
| 退出 | 策略/敏感日志 | 恢复审批/核卸载/清理 |

#### 效果

| 项目 | 当前支持 | 尚未验证 |
| --- | --- | --- |
| 执行前 | 真实guard→语义deny | 当前Host/所有渠道覆盖 |
| 模式 | 标准/strict/paranoid具体规则 | 全动态载荷/误拦率 |
| 未知工具 | 精确声明+事后notice | 首次未受检损害 |
| 异常 | 依赖错误deny/坏config回退 | 配置/供应链/OS隔离 |
| 审计 | 本地脱敏有界JSONL | 写失败静默，非不可篡改 |

> **思考**：未知工具可能先运行再提醒，标准/配置有具体允许边界，坏配置回退/异常拒绝不能补所有渠道覆盖；日志写失败可静默，见 [Q03](#research-q03)-[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：宿主适配与共享语义规则/配置/审计分离，把已识别命令/路径的程序拒绝接到DSH执行前，见 [Q02](#research-q02)。

DSH适配到共享pipeline/异常投影真实，模式/项目配置与审计需解释具体分支；未受检/日志失败/Host生命周期不能由fail-closed口号替代，见 [Q02](#research-q02)-[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

未知工具可能先运行再提醒，标准/配置有具体允许边界，坏配置回退/异常拒绝不能补所有渠道覆盖；日志写失败可静默，见 [Q03](#research-q03)-[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离profile保留Host审批，用工具清单/无破坏预检核覆盖与cwd；未知工具或策略不清先人工审查，不能靠一次安装/strict名字替代安全验收，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定2.7.3/source，根多宿主产品含原生DSH bundle。633文件定向审DSH entry/guard/cwd/声明、共享pipeline/代表rm与secret、policy fallback/项目覆盖和审计；未运行或全审其他宿主/全部规则/GUI与策略编辑/来源更新/Host卸载和产物兼容。

- 已检查：作者 README、包清单、源码路径 README.md、dist/deepseek-harness/cordis.patch.yml、package.json、src/audit/writer.ts、src/core/denial.ts、src/core/policy/effective-rules.ts、src/core/policy/env.ts、src/core/policy/merge.ts、src/core/policy/safety-level.ts、src/core/policy/scope-policy.ts、src/core/policy/snapshot.ts、src/core/policy/store.ts、src/entries/deepseek-harness/index.ts、src/gate/analyzer/index.ts、src/gate/analyzer/recursive-delete-targets.ts、src/gate/analyzer/rm.ts、src/gate/pipeline.ts、src/gate/secret/secret-protection.ts、src/hosts/audit.ts、src/hosts/deepseek-harness/guard.ts、src/hosts/deepseek-harness/install.ts、src/hosts/hook/plugin-adapter.ts、src/hosts/runtime.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：DSH source entry/dist patch/guard/cwd/事后notice；共享adapter/runtime/pipeline/deny、command analyzer调用及rm分类/secret代表链；policy scopes/merge/snapshot坏配置；审计投影/JSONL写失败。未运行或全633文件、全部规则/Host/CLI/GUI/外部rulebook更新/策略写盘/脱敏/当前Host卸载、dist全比对。
- 下一步：- 下一步隔离Host无破坏样本核guard实际拒绝/允许、有效策略与工具cwd。
- 副本坏JSON/项目放宽/审计禁写分别看判定与日志，缺日志非没发生。
- 未运行目标/命令样本，误拦/漏检/资源与净收益未知。

**分析版本**

- **仓库**：[kenryu42/cc-safety-net](https://github.com/kenryu42/cc-safety-net)
- **版本号**：2.7.3（[固定提交 7cb1936](https://github.com/kenryu42/cc-safety-net/tree/7cb1936d32660a3841d9128814af19ec5b82c615)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

会话首次未知command-bearing工具前作可选人工覆盖分类，对照现有post notice和tool list；未受检调用不降或误声明/误拦增加即否定，见 [Q06](#research-q06)。

- 下一步隔离Host无破坏样本核guard实际拒绝/允许、有效策略与工具cwd。
- 副本坏JSON/项目放宽/审计禁写分别看判定与日志，缺日志非没发生。
- 未运行目标/命令样本，误拦/漏检/资源与净收益未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 65 | 3725 | — | — | 36762 |
| .ts | source | 306 | 57868 | 53017 | 188 | — |
| .ts | test | 262 | 66346 | 61609 | 1040 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/kenryu42/cc-safety-net/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核DSH真实guard→工具/cwd→共享策略语义规则→deny返回、未知覆盖/模式与审计失败边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多宿主根和DSH插件是什么关系，解决什么事？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

cc-safety-net 2.7.3是多编码Agent宿主的本地命令/敏感路径检查产品，根发布CLI、共享API与原生DSH bundle适配；本项类型plugin，但不把所有宿主都叫DSH原生插件。DSH bundle patch确加载dist/deepseek-harness/index.js，源码entry inject tools并apply guard。Node>=22为声明；构建dist与源码/真实Host兼容尚未运行验收。

面向能审阅工具和本机项目策略的编码Agent用户，在实际执行前增加可解释deny，比仅提示词有程序闸；原生人工审批/文件权限/沙箱仍需保留。命令分析不执行目标命令，也不容纳进程/文件权限/出网；未检查的工具/远程执行不能靠本机路径分析补全。研究633文件中DSH到共享guard、代表rm/secret与策略/审计，不审所有规则/宿主/GUI/管理CLI，作者站点/测试数量不作独立效果证据。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-5](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/package.json#L1-L5)

包身份/版本/用途。

```text
{
  "name": "cc-safety-net",
  "version": "2.7.3",
  "description": "A coding agent CLI hook - block destructive commands and secret file access",
  "keywords": [
```

**依据 2 · 源码核查**：[package.json:132-139](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/package.json#L132-L139)

Node声明与DSH bundle入口。

```text
  "engines": {
    "node": ">=22"
  },
  "packageManager": "bun@1.4.4",
  "dsh": {
    "bundle": {
      "patch": "./dist/deepseek-harness/cordis.patch.yml"
    }
```

**依据 3 · 源码核查**：[package.json:34-63](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/package.json#L34-L63)

CLI/多API exports。

<details>
<summary>查看原文（30行）</summary>

```text
  },
  "bin": {
    "cc-safety-net": "dist/bin/cc-safety-net.js",
    "ccsn": "dist/bin/cc-safety-net.js"
  },
  "files": [
    "dist"
  ],
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./api": {
      "types": "./dist/api.d.ts",
      "import": "./dist/api.js"
    },
    "./opencode/v2": {
      "types": "./dist/opencode-v2.d.ts",
      "import": "./dist/index.js"
    },
    "./package.json": "./package.json"
  },
  "scripts": {
    "audit:dependencies": "bun audit --ignore=GHSA-ch52-4w7c-c8xp",
    "build": "bun run clean && bun scripts/project-bun.ts scripts/build.ts",
    "build:plugin": "bun scripts/project-bun.ts scripts/build-plugin-tree.ts",
```

</details>

**依据 4 · 源码核查**：[dist/deepseek-harness/cordis.patch.yml:1-3](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/dist/deepseek-harness/cordis.patch.yml#L1-L3)

真实DSH bundle行。

```text
- insert:
    - id: cc-safety-net
      name: ./index.js
```

**依据 5 · 源码核查**：[src/entries/deepseek-harness/index.ts:1-7](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/entries/deepseek-harness/index.ts#L1-L7)

原生entry真实apply guard。

```text
import { registerDeepSeekHarnessGuard } from '@/hosts/deepseek-harness/guard';

export default {
  name: 'cc-safety-net',
  inject: ['tools'],
  apply: registerDeepSeekHarnessGuard,
};
```

**依据 6 · 作者声明**：[README.md:25-25](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/README.md#L25-L25)

作者明确非沙箱边界。

```text
CC Safety Net (Coding CLI Safety Net) blocks destructive commands and access to secrets such as SSH keys and `.env` files before the tool call runs. It parses what the command does. Wrapping the command or reordering flags does not hide it. A broken config file falls back to safe defaults instead of stopping your agent. It is not a sandbox: it does not contain processes, set filesystem permissions, or watch network egress.
```

#### 缺口

- 未安装/运行DSH、比对dist完整产物或审所有633文件/宿主，误拦与实际损失未量化。
  **影响**：能判断防护接线，不承诺全面保护/生产收益。
  **进一步探讨**：先副本列当前工具和本机/远程位置、保留原生审批，用无破坏请求核deny/allow而不执行危险命令。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH实际如何在执行前阻止工具，cwd和自定义工具怎么选？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

entry调registerDeepSeekHarnessGuard，ctx.tools.guard同步调用handle(execution,process.cwd())；Host descriptor allow为undefined、block为formatDenial字符串，经共享handler projectGuardDenial返回deny才block。注册存在，但当前DSH是否把此返回字符串作为所有工具的强制闸需真实Host验证，不能把静态注册当上线覆盖。

默认只认bash posix/pwsh PowerShell，session header cwd优先，缺则launch cwd；firstTrustedRoot不能建立workspace则拒绝。命令必须非空字符串，workdir若给必须有效，并resolve到可信真实目录。其他名字先按path/patch/glob/grep/unknown归类，unknown若有command且策略commandTools精确声明才promote为命令；自定义cwd字段或默认workdir/cwd/working_directory冲突/无效拒绝。只应声明确定在这台机器执行的工具，远程/未知位置不声明。

共享evaluateGuard加载规则/用户项目策略、建semantic facts、先护policy修改与git metadata，再按secret规则检查路径，非command可在检查后allow；命令才进analyzeCommandWithProgram→analyzeCommandInternal真实规则分析，预算/异常经failedClosedEvaluation deny，handler外层异常也返回block。不是只做正则工具名黑名单，但程序allow仍只说明当前已识别事实没命中，不保证运行安全。

#### 证据与依据

**依据 1 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:44-70](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/hosts/deepseek-harness/guard.ts#L44-L70)

默认bash/pwsh与真实guard/post事件注册。

<details>
<summary>查看原文（27行）</summary>

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
}
```

</details>

**依据 2 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:125-186](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/hosts/deepseek-harness/guard.ts#L125-L186)

真实工具提取/cwd拒绝到invocation。

<details>
<summary>查看原文（62行）</summary>

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
  );
}
```

</details>

**依据 3 · 源码核查**：[src/hosts/hook/plugin-adapter.ts:65-126](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/hosts/hook/plugin-adapter.ts#L65-L126)

共享handler真实调用与deny投影/异常block。

<details>
<summary>查看原文（62行）</summary>

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

**依据 4 · 源码核查**：[src/core/denial.ts:71-90](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/core/denial.ts#L71-L90)

deny投影而非自动放行。

<details>
<summary>查看原文（20行）</summary>

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
  };
}
```

</details>

**依据 5 · 源码核查**：[src/hosts/runtime.ts:24-44](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/hosts/runtime.ts#L24-L44)

真实evaluateGuard/审计调用。

<details>
<summary>查看原文（21行）</summary>

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
  }
```

</details>

**依据 6 · 源码核查**：[src/gate/pipeline.ts:113-145](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/gate/pipeline.ts#L113-L145)

unknown tool策略精确声明与promotion。

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

**依据 7 · 源码核查**：[src/gate/pipeline.ts:375-408](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/gate/pipeline.ts#L375-L408)

自定义cwd多值/无效拒绝。

<details>
<summary>查看原文（34行）</summary>

```text
): ToolInvocation | GuardEvaluation {
  const requestedCwds = [
    ...new Set(
      (cwdArgument ? [cwdArgument] : WORKING_DIRECTORY_ARGUMENTS).flatMap((key) => {
        const descriptor = Object.getOwnPropertyDescriptor(invocation.input, key);
        return descriptor ? [descriptor.value] : [];
      }),
    ),
  ];
  const usableCwds = requestedCwds.filter(
    (value): value is string => typeof value === 'string' && value.trim() !== '',
  );
  if (requestedCwds.length > 1 || usableCwds.length !== requestedCwds.length) {
    return malformedToolCallEvaluation(command);
  }
  const requestedCwd = usableCwds[0];
  const executionCwd =
    requestedCwd === undefined
      ? invocation.context.configCwd
      : resolveCanonicalCwd(requestedCwd, invocation.context.configCwd, paths);
  if (!executionCwd) {
    const denial = createCwdDenial({
      directory: 'requested',
      problem: 'unusable',
      cwd: requestedCwd ?? '',
    });
    return {
      stage: 'command-validation',
      decision: {
        kind: 'deny',
        reason: denial.reason,
        ruleId: denial.ruleId,
        intent: denial.intent,
        evidence: { command, segment: command },
```

</details>

**依据 8 · 源码核查**：[src/gate/pipeline.ts:178-216](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/gate/pipeline.ts#L178-L216)

policy修改/管理命令的真实拒绝。

<details>
<summary>查看原文（39行）</summary>

```text
  const budget = createBudget();
  const protectedGitMetadata = callDependency('policy-protection', command, () =>
    dependencies.resolveGitMetadata(
      [invocation.context.executionCwd, invocation.context.configCwd],
      options.environment,
    ),
  );
  const policyTarget = callDependency('policy-protection', command, () =>
    dependencies.findPolicyMutation(facts, options.environment, budget),
  );
  if (policyTarget) {
    const displayCommand = command ?? policyTarget.target;
    return {
      stage: 'policy-protection',
      ...promoted,
      decision: {
        kind: 'deny',
        reason: REASON_POLICY_CONFIG_PROTECTION,
        ruleId: 'guard.policy-config',
        intent: 'hard_stop',
        evidence: { command: displayCommand, segment: policyTarget.target },
      },
    };
  }

  const policyApplyTarget = callDependency('policy-protection', command, () =>
    findPolicyApplyInvocationInSemanticFacts(facts, options.environment, budget),
  );
  if (policyApplyTarget) {
    const displayCommand = command ?? policyApplyTarget.target;
    return {
      stage: 'policy-protection',
      ...promoted,
      decision: {
        kind: 'deny',
        reason: REASON_POLICY_APPLY_PROTECTION,
        ruleId: 'guard.policy-apply',
        intent: 'hard_stop',
        evidence: { command: displayCommand, segment: policyApplyTarget.target },
```

</details>

**依据 9 · 源码核查**：[src/gate/pipeline.ts:240-299](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/gate/pipeline.ts#L240-L299)

secret调用/非command允许与命令分析。

<details>
<summary>查看原文（60行）</summary>

```text
  const policy = snapshot.policy;
  const modes = dependencies.getModes(policy, options.environment.env);

  const reported = {
    level: modes.effectiveLevel,
    ...getConfigFallback(snapshot),
    ...promoted,
  };
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
```

</details>

**依据 10 · 源码核查**：[src/gate/analyzer/index.ts:29-56](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/gate/analyzer/index.ts#L29-L56)

真实进入共享analyzeCommandInternal返回deny。

<details>
<summary>查看原文（28行）</summary>

```text
export function analyzeCommandWithProgram(
  command: string,
  options: AnalyzeInput,
  program?: CommandProgram,
  factStore?: SemanticFactStore,
): Extract<Decision, { kind: 'deny' }> | null {
  const result = analyzeCommandInternal(
    command,
    0,
    {
      ...options,
      ...resolveCommandAnalysisContext(options),
      budget: options.budget ?? createBudget(),
      factStore,
    },
    program,
  );
  if (!result) return null;
  return {
    kind: 'deny',
    reason: result.scriptLocation ? `${result.scriptLocation}: ${result.reason}` : result.reason,
    intent: result.intent ?? 'manual_only',
    ruleId: result.ruleId,
    evidence: { command, segment: result.segment },
  };
}

export function analyzeOrCapBreach(
```

</details>

**依据 11 · 源码核查**：[src/gate/pipeline.ts:467-505](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/gate/pipeline.ts#L467-L505)

依赖异常转failedClosed deny。

<details>
<summary>查看原文（39行）</summary>

```text
  command: string | null | undefined,
  call: () => T,
): T {
  try {
    return call();
  } catch (cause) {
    throw new GuardEvaluationError(
      stage,
      failedClosedEvaluation(
        stage,
        cause instanceof ToolInputLimitError ? undefined : command,
        cause,
      ),
      cause,
    );
  }
}

function failedClosedEvaluation(
  stage: GuardStage,
  command: string | null | undefined,
  cause?: unknown,
): GuardEvaluation {
  const denial =
    cause instanceof UnparseableCommandError
      ? { reason: REASON_STRICT_UNPARSEABLE, ruleId: 'analysis.strict-unparseable' }
      : cause instanceof AnalysisLimit || cause instanceof StructuralShellSyntaxLimitError
        ? { reason: REASON_COMMAND_ANALYSIS_LIMIT, ruleId: 'analysis.limit' }
        : { reason: REASON_SAFETY_NET_FAILED_CLOSED, ruleId: 'analysis.failed-closed' };
  return {
    stage,
    decision: {
      kind: 'deny',
      ...denial,
      intent: 'stop_and_explain',
      ...(command ? { evidence: { command, segment: command } } : {}),
    },
  };
}
```

</details>

#### 缺口

- 未运行当前Host guard覆盖、所有cwd/工具形状/Host权限契约，非所有本机动作都经本入口。
  **影响**：共享fail-closed不能填补没有被识别/没有经过guard的操作。
  **进一步探讨**：安全样本记录工具名/cwd/声明与预检结果，核实际Host是否拒绝调用；任何不受检渠道保留原生审批并停止依赖。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 标准/严格模式、未知工具和敏感路径能防到哪里？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

标准默认fail_closed=false，strict=true，paranoid再加rm/解释器敏感能力；具体规则仍可override，不能把模式名字当完全隔离。代表rm链对target分类，dynamic_target规则按strict/effective规则开关可不命中；root/home等灾难规则另受强制保护，不能说所有动态删除一律允许。危险raw-text/dynamic-shell-source在pipeline有unverifiedByStandardMode标记，但decision仍deny、projectGuardDenial不消除它，所以不能把该标记误读为本DSH adapter放行。标准残余风险应逐规则说明，不承接旧泛化。

secret在policy enabled=false可不检查，规则来自工具路径/语义facts，allowPaths/disabledRules和标准metadata精化会影响判断；不是进程级文件隔离或秘密扫描/外传全覆盖。本轮只核真实secret调用与代表提取，不证明所有shell/解释器/原生工具名都可识别。

未知tool若命令未声明，可能在policy/secret检查后以non-command allow。tools/post-execute先await next再产生一会话一工具notice，明确“did not check command just ran”；这是事后信息，不是执行前补救，notice内部失败也静默。新工具、非command字段、无session header或其他渠道可能连notice都没有；不能用有告警等同不会漏检。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/policy/safety-level.ts:11-15](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/core/policy/safety-level.ts#L11-L15)

标准/strict/paranoid实际能力表。

```text
export const SAFETY_LEVEL_CAPABILITIES = {
  standard: { fail_closed: false, paranoid_rm: false, paranoid_interpreters: false },
  strict: { fail_closed: true, paranoid_rm: false, paranoid_interpreters: false },
  paranoid: { fail_closed: true, paranoid_rm: true, paranoid_interpreters: true },
} as const satisfies Record<PolicySafetyLevel, Record<SafetyLevelCapability, boolean>>;
```

**依据 2 · 源码核查**：[src/core/policy/env.ts:82-101](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/core/policy/env.ts#L82-L101)

默认standard与preset能力。

<details>
<summary>查看原文（20行）</summary>

```text
export function getCCSafetyNetEnvModes(
  policy: { safety?: PolicySafety; worktreeMode?: boolean } = {},
  env: ReadonlyMap<string, string>,
) {
  const policyLevel = policy.safety?.level ?? 'standard';
  const envLevel = parseEnvLevel(env);
  const baseLevel = maxSafetyLevel(policyLevel, envLevel);
  const presetCapabilities = SAFETY_LEVEL_CAPABILITIES[baseLevel];
  const values = {
    failClosed: presetCapabilities.fail_closed,
    paranoidRm: presetCapabilities.paranoid_rm,
    paranoidInterpreters: presetCapabilities.paranoid_interpreters,
  };
  const capabilitySources: Record<Capability, EffectiveCapabilitySource> = {
    failClosed: baseLevel === policyLevel ? 'preset' : 'environment',
    paranoidRm: baseLevel === policyLevel ? 'preset' : 'environment',
    paranoidInterpreters: baseLevel === policyLevel ? 'preset' : 'environment',
  };
  const sources: Record<Capability, string[]> = {
    failClosed: [`policy safety.level=${policyLevel}`],
```

</details>

**依据 3 · 源码核查**：[src/gate/analyzer/recursive-delete-targets.ts:96-117](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/gate/analyzer/recursive-delete-targets.ts#L96-L117)

dynamic/anchored按模式与effective开关的真实匹配。

<details>
<summary>查看原文（22行）</summary>

```text
export function matchRecursiveDeleteClassification(
  classification: RecursiveDeleteTargetClassification,
  ctx: RecursiveDeleteTargetContext,
  policy: DestructiveCommandRulePolicy | undefined,
  table: RecursiveDeleteRuleTable,
): DestructiveCommandRuleMatch | null {
  if (classification.kind === 'temp_target') return null;
  const rule = table[classification.kind];
  if (
    classification.kind === 'dynamic_target' &&
    !destructiveCommandRuleIsEnabled(policy, rule.id, ctx.strict)
  ) {
    return null;
  }
  if (
    classification.kind === 'within_anchored_cwd' &&
    !destructiveCommandRuleIsEnabled(policy, rule.id, ctx.paranoid)
  ) {
    return null;
  }
  return destructiveCommandMatch(rule.id, rule.reason);
}
```

</details>

**依据 4 · 源码核查**：[src/core/policy/effective-rules.ts:35-43](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/core/policy/effective-rules.ts#L35-L43)

灾难规则强制/其他依有效policy或继承值。

```text
export function destructiveCommandRuleIsEnabled(
  policy: DestructiveCommandRulePolicy | undefined,
  id: DestructiveCommandRuleId,
  inheritedEnabled: boolean,
): boolean {
  if (CATASTROPHIC_DESTRUCTIVE_COMMAND_RULE_IDS.has(id)) return true;
  if (policy?.destructiveCommandProtectionEnabled === false) return false;
  return policy?.effectiveDestructiveCommandRules[id]?.enabled ?? inheritedEnabled;
}
```

**依据 5 · 源码核查**：[src/gate/analyzer/rm.ts:57-111](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/gate/analyzer/rm.ts#L57-L111)

rm真实target分类匹配调用。

<details>
<summary>查看原文（55行）</summary>

```text
): DestructiveCommandRuleMatch | null {
  const ctx = createRecursiveDeleteTargetContext({
    ...options,
    allowPaths: options.policy?.destructiveCommandAllowPaths,
    posixShell: true,
  });
  const flagTexts = words.map(analysisWordText);
  const recursive = hasRecursiveOption(flagTexts);
  const targets = extractTargets(words);

  for (const target of targets) {
    const facts = deleteTargetWordFacts(target.word);
    if (recursive && facts.unsafeBraceExpansion) {
      const match = filterDestructiveCommandMatch(
        matchRecursiveDeleteClassification(
          { kind: 'outside_anchored_cwd' },
          ctx,
          options.policy,
          RM_RULES,
        ),
        options.policy,
      );
      if (match) return match;
      continue;
    }

    for (const expandedTarget of facts.expandedTargets ?? [target.text]) {
      const nativeTarget = normalizeMsysDrivePath(expandedTarget);
      const classificationOptions = {
        targetIsLiteral: facts.expandedTargets !== undefined || facts.targetIsLiteral,
        tmpdirWordSplittingProtected: facts.tmpdirWordSplittingProtected,
      };
      if (
        !recursive &&
        ctx.resolvedCwd &&
        isProtectedGitDeleteTarget(
          nativeTarget,
          ctx.resolvedCwd,
          ctx.protectedGitMetadata,
          recursive,
          ctx.environment,
          ctx.budget,
        )
      ) {
        return destructiveCommandMatch('rm.git-metadata', REASON_GIT_METADATA_PROTECTION);
      }
      if (!recursive) continue;
      const match = firstRecursiveDeleteMatch(
        nativeTarget,
        ctx,
        options.policy,
        RM_RULES,
        classificationOptions,
      );
      if (match) return match;
```

</details>

**依据 6 · 源码核查**：[src/gate/pipeline.ts:341-363](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/gate/pipeline.ts#L341-L363)

标准未验证标记仍是deny decision。

<details>
<summary>查看原文（23行）</summary>

```text
  if (analysis.decision) {
    const unverifiedByStandardMode =
      !modes.strict &&
      (analysis.decision.ruleId === 'raw-text.dangerous-command' ||
        (analysis.decision.reason === REASON_DYNAMIC_SHELL_SOURCE &&
          !BARE_SHELL_READING_STDIN.test(analysis.decision.evidence?.segment ?? '') &&
          dangerousInTextMatch(invocation.command as string) === null));
    const posixReading = unverifiedByStandardMode ? readAsPosix?.() : undefined;
    if (posixReading?.decision.kind === 'deny' && !posixReading.decision.unverifiedByStandardMode) {
      return posixReading.withItsTrace();
    }
    return {
      stage: 'command-analysis',
      ...reported,
      ...('errorCode' in analysis ? { errorCode: analysis.errorCode } : {}),
      decision: unverifiedByStandardMode
        ? { ...analysis.decision, unverifiedByStandardMode: true }
        : analysis.decision,
    };
  }
  return (
    readAsPosix?.().withItsTrace() ?? {
      stage: 'command-analysis',
```

</details>

**依据 7 · 源码核查**：[src/core/denial.ts:71-90](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/core/denial.ts#L71-L90)

投影不因unverified标记放行。

<details>
<summary>查看原文（20行）</summary>

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
  };
}
```

</details>

**依据 8 · 源码核查**：[src/gate/pipeline.ts:248-292](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/gate/pipeline.ts#L248-L292)

secret开关/真检查与noncommand allow。

<details>
<summary>查看原文（45行）</summary>

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
  }

  if (!invocation.command || invocation.command.trim() === '') {
    return { ...malformedToolCallEvaluation(command), ...reported };
  }

  const analysis = callDependency('command-analysis', command, () =>
    analyzeOrCapBreach(
      () =>
        dependencies.analyzeCommand(
          invocation.command as string,
```

</details>

**依据 9 · 源码核查**：[src/gate/secret/secret-protection.ts:344-364](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/gate/secret/secret-protection.ts#L344-L364)

真实敏感target提取与标准精化分支。

<details>
<summary>查看原文（21行）</summary>

```text
export function findSensitiveTargetInSemanticFacts(
  facts: SemanticFacts,
  config: SecretProtectionPolicy | undefined,
  environment: EnvironmentContext,
  budget: Budget,
  options: SecretInspectionOptions = {},
): SecretTarget | null {
  const candidates = extractToolPathTargets(facts, environment, budget);
  const target = findSensitivePolicyPathTarget(
    candidates,
    config,
    facts.invocation.context.configCwd,
    environment,
    budget,
  );
  if (target === null || target.ruleId === 'secret.deny-path' || options.strict !== false) {
    return target;
  }
  const refinedWithLoopWords = extractToolPathTargets(facts, environment, budget, {
    skipMetadataOnlySegments: true,
    inlineLiteralsPresumedData: true,
```

</details>

**依据 10 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:63-119](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/hosts/deepseek-harness/guard.ts#L63-L119)

未知工具事后notice的条件/声明/去重/静默失败。

<details>
<summary>查看原文（57行）</summary>

```text
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
    noticed.add(key);
    const profilesDir = getDeepSeekHarnessProfilesDir(environment);
    return Object.freeze({
      id: randomUUID(),
      role: 'user',
      content: Object.freeze([
        Object.freeze({
          type: 'text',
          text: `CC Safety Net did not check the command \`${toolName}\` just ran. It checks a plugin's shell tool only after the tool is declared. First find out where \`${toolName}\` runs its commands: check its tool description, and if that doesn't say, read its plugin's source under \`${profilesDir}/<profile>/node_modules\`. If it runs them on this machine, declare it with \`npx -y cc-safety-net rule tool add ${toolName}\`. Add \`--cwd-arg <name>\` if it takes its working directory in an argument other than \`workdir\`, \`cwd\` or \`working_directory\`. Don't test the declaration by running a destructive command; \`npx -y cc-safety-net rule tool list\` confirms it. If it runs them somewhere else, such as a remote host, or you can't tell, don't declare it. Either way, tell the user what you found and what you did.`,
        }),
      ]),
      source: Object.freeze({
        kind: 'cc-safety-net',
        form: 'notice',
        summary: `${toolName} commands are not checked`,
      }),
    });
  } catch {
    return undefined;
  }
}

/** @internal */
export function createDeepSeekHarnessGuardHandler(
```

</details>

#### 缺口

- 未枚举所有动态载荷/解释器/敏感路径规则、已知绕过或误拦率，不判定完整漏洞覆盖。
  **影响**：风险依工具形状/模式/配置而变，不能用更严格模式保证全覆盖。
  **进一步探讨**：只在分析/预检层对比literal/dynamic/unknown与正常样本，核deny原因；不发破坏命令验证，不明工具先人工判位置。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 策略和审计可信到什么程度，失败/退出会怎样？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

每次evaluation由session configCwd读用户与项目策略；项目可参与覆盖，只有CC_SAFETY_NET_PROJECT_TIGHTEN_ONLY等约束明确启用才忽略weakening字段，不默认所有repo只能收紧。env level只能向更高preset，仍需核项目allow/disabled/规则来源；sessionId用于审计关联，不是可信多租户身份。policy mutation/cli apply有guard保护，但有OS写权限的人、外部程序/工具渠道仍可改策略，插件不是OS安全边界。

snapshot把有效规则/配置structuredClone deepFreeze；无效policy JSON会salvage/default并报degraded而继续护栏，坏自定义来源不活跃、其他内建仍用，非配置一坏全停Agent。异常依赖/分析预算另走deny，不和“坏配置回退”混为同一fail-closed。整个policy编辑写盘/GUI/外部rulebook更新事务本轮未审，不假称都原子可靠。

审计先按sessionId、cwd归目录、redact/cap字段，0700目录/0600 append JSONL，写失败catch空，缺session id也不记；日志缺失不代表没执行/没拒绝，审计失败不强制改变判定。默认auditScope是all，允许command也可能记录，敏感命令/路径脱敏非完整秘密证明，需管理保留/访问。DSH注册函数没有显式汇总返guard/on disposers，依赖Host上下文资源托管；本轮未核当前Host卸载行为，不承诺卸载后零监听。guard只作执行前判断，不持有工具进程/回滚外部副作用，停用不取消已执行命令。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/policy/store.ts:82-121](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/core/policy/store.ts#L82-L121)

真实用户/项目加载及tighten-only来源。

<details>
<summary>查看原文（40行）</summary>

```text
export function loadPolicyConfig(
  environment: Environment,
  options: RulesPolicyOptions,
): PolicyConfig {
  const user = readPolicyConfig(getUserPolicyPath(environment, options), environment.home);
  const projectFile: ReturnType<typeof readPolicyFile> = projectPolicyIsUserPolicy(
    environment,
    options,
  )
    ? { exists: false, policy: createDefaultGuiPolicy(), errors: [] }
    : readPolicyFile(getProjectPolicyPath(options.cwd), environment.home);
  const project = projectPolicyProjection(projectFile.parsed, environment.home);
  const weakeningsIgnored = envTruthy(ENV_FLAGS.projectTightenOnly, environment.env);
  const userPolicy = user.gui ?? DEFAULT_GUI_POLICY;
  const merged =
    Object.keys(project.policy).length > 0
      ? mergeProjectPolicy(
          userPolicy,
          project.policy,
          weakeningsIgnored,
          sessionSafetyLevel(userPolicy.safety.level, environment.env),
        )
      : undefined;
  const errors = [...user.errors, ...projectFile.errors, ...project.diagnostics];

  const fallback =
    (user.fallback === 'defaults' && merged ? 'salvaged' : user.fallback) ??
    (user.gui ? undefined : projectFile.fallback) ??
    (errors.length > 0 ? 'salvaged' : undefined);

  const levelScope =
    project.policy.safety?.level && merged?.policy.safety.level === project.policy.safety.level
      ? 'project'
      : user.levelPresent
        ? 'user'
        : 'default';
  return {
    ...(merged ? normalizePolicyConfig(merged.policy) : user.policy),
    errors,
    ...(fallback ? { fallback } : {}),
```

</details>

**依据 2 · 源码核查**：[src/core/policy/merge.ts:32-55](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/core/policy/merge.ts#L32-L55)

project默认可覆盖、仅指定weakening忽略。

<details>
<summary>查看原文（24行）</summary>

```text
export function mergeProjectPolicy(
  user: GuiPolicy,
  project: ProjectPolicyProjection,
  tightenOnly = false,
  sessionLevel = user.safety.level,
): { policy: GuiPolicy; weakenings: readonly string[] } {
  const weakenings = collectWeakenings(user, project, sessionLevel);
  const ignored = new Set(tightenOnly ? weakenings.map((weakening) => weakening.field) : []);
  const kept = <T>(field: string, value: T | undefined) => (ignored.has(field) ? undefined : value);
  const keptEntries = <T>(field: string, entries: Record<string, T> | undefined) =>
    Object.fromEntries(
      Object.entries(entries ?? {}).filter(([key]) => !ignored.has(`${field}.${key}`)),
    );
  const keptPaths = (field: string, paths: readonly string[] | undefined) =>
    paths?.filter((path) => !ignored.has(`${field}.${path}`));
  const policy: GuiPolicy = {
    version: 1,
    safety: {
      level: kept('safety.level', project.safety?.level) ?? user.safety.level,
      overrides: {
        ...user.safety.overrides,
        ...keptEntries('safety.overrides', project.safety?.overrides),
      },
    },
```

</details>

**依据 3 · 源码核查**：[src/core/policy/scope-policy.ts:172-191](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/core/policy/scope-policy.ts#L172-L191)

坏rulebook/重名来源实际被flatMap丢弃。

<details>
<summary>查看原文（20行）</summary>

```text
    source === 'user' ? 'user policy' : 'project policy',
  ),
  claimedRulebookNames: Set<string> = new Set(),
): ScopePolicy {
  const errors: string[] = [];
  const warnings: string[] = [];
  const loaded = config.rules.flatMap((spec) => {
    const loadedRulebook = loadRulebookForSpec(spec, configDir, filesystemScope);
    if (loadedRulebook.errors.length > 0 || !loadedRulebook.rulebook) {
      errors.push(...loadedRulebook.errors);
      return [];
    }
    const rulebook = loadedRulebook.rulebook;

    if (claimedRulebookNames.has(rulebook.name)) {
      warnings.push(
        `duplicate active rulebook name "${rulebook.name}" for ${spec}; keeping the first and ignoring this one, so its rules are not active; rename one of them in its rulebook file and in the rules config that lists it`,
      );
      return [];
    }
```

</details>

**依据 4 · 源码核查**：[src/core/policy/snapshot.ts:82-110](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/core/policy/snapshot.ts#L82-L110)

坏来源/配置回退说明由真实状态生成。

<details>
<summary>查看原文（29行）</summary>

```text
) {
  const policyWarning = getPolicyFallbackWarning(userPolicy);
  if (rules.errors.length === 0 && rules.warnings.length === 0 && !policyWarning) return undefined;
  return {
    diagnostics: [...rules.errors, ...rules.warnings, ...userPolicy.errors],
    reason: combineInvalidReasons(
      rules.errors.length > 0 ? withDroppedSourceAdvice(rules.errors) : undefined,
      rules.warnings.length > 0 ? withTerminalPeriod(rules.warnings.join('; ')) : undefined,
      policyWarning,
    ),
  };
}

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
}

function isPublicRuleSource(source: string): boolean {
  return /^(?:[A-Za-z0-9_.-]+$|https:\/\/github\.com\/|github:|gh:|[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:#|$))/.test(
    source,
```

</details>

**依据 5 · 源码核查**：[src/core/policy/snapshot.ts:118-149](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/core/policy/snapshot.ts#L118-L149)

实际clone/freeze与degraded snapshot。

<details>
<summary>查看原文（32行）</summary>

```text
  policyScopes?: PolicyScopes,
): PolicySnapshot {
  const frozenPolicy = deepFreeze(structuredClone(policy));
  const scopes = policyScopes ? { policyScopes: deepFreeze(structuredClone(policyScopes)) } : {};
  if (!failure) {
    return Object.freeze({
      state: 'ready',
      policy: frozenPolicy,
      diagnostics: Object.freeze([]),
      ruleMetadata,
      ...scopes,
    });
  }
  return Object.freeze({
    state: 'degraded',
    policy: frozenPolicy,
    diagnostics: Object.freeze([...failure.diagnostics]),
    reason: failure.reason,
    ruleMetadata,
    ...scopes,
  });
}

function deepFreeze<T>(value: T): T {
  if (typeof value !== 'object' || value === null) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function combineInvalidReasons(...reasons: Array<string | undefined>): string {
  return withTerminalPeriod(reasons.filter((reason): reason is string => !!reason).join('; '));
}
```

</details>

**依据 6 · 源码核查**：[src/core/policy/store.ts:557-589](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/core/policy/store.ts#L557-L589)

实际JSON坏/空/读失败salvage/default。

<details>
<summary>查看原文（33行）</summary>

```text
} {
  if (!existsSync(path)) return { exists: false, policy: createDefaultGuiPolicy(), errors: [] };

  try {
    const content = readFileSync(path, 'utf-8');
    if (!content.trim()) {
      return {
        exists: true,
        policy: createDefaultGuiPolicy(),
        errors: [`${path}: Config file is empty`],
        fallback: 'defaults',
      };
    }
    const parsed = JSON.parse(content) as unknown;
    const salvaged = validateUserPolicy(parsed, home);
    if (salvaged.issues.length === 0) {
      return { exists: true, parsed, policy: salvaged.policy, errors: [] };
    }
    return {
      exists: true,
      parsed,
      policy: salvaged.policy,
      errors: salvaged.issues.map((issue) => `${path}: ${renderSalvageIssue(issue)}`),
      fallback: isRecord(parsed) ? 'salvaged' : 'defaults',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      exists: true,
      policy: createDefaultGuiPolicy(),
      errors: [`${path}: ${error instanceof SyntaxError ? 'Invalid JSON' : message}`],
      fallback: 'defaults',
    };
```

</details>

**依据 7 · 源码核查**：[src/core/policy/env.ts:63-71](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/core/policy/env.ts#L63-L71)

默认all审计允许命令。

```text
export function resolveAuditScope(value: string | undefined): 'all' | 'blocked' | 'invalid' {
  if (value === undefined || value === 'all') return 'all';
  if (value === 'blocked') return 'blocked';
  return 'invalid';
}

export function shouldRecordAllowedCommands(env: ReadonlyMap<string, string>): boolean {
  return resolveAuditScope(getEnvFlagValue(ENV_FLAGS.auditScope, env)) === 'all';
}
```

**依据 8 · 源码核查**：[src/hosts/audit.ts:76-103](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/hosts/audit.ts#L76-L103)

审计缺/坏sessionId跳过。

<details>
<summary>查看原文（28行）</summary>

```text
export function writeGuardAudit(
  environment: Environment,
  audit: GuardAuditDescriptor | undefined,
  getSessionId: () => string | undefined,
  options: { agent: string; shape?: string },
): void {
  if (!audit) return;
  let sessionId: string | undefined;
  try {
    sessionId = getSessionId();
  } catch {
    return;
  }
  if (typeof sessionId !== 'string' || !sessionId.trim()) return;
  writeAuditLog(environment, sessionId, audit.command, audit.segment, audit.reason, audit.cwd, {
    decision: audit.decision,
    agent: options.agent,
    shape: options.shape,
    level: audit.level,
    configFallback: audit.configFallback,
    toolName: audit.toolName,
    ruleId: audit.ruleId,
    intent: audit.intent,
    failureStage: audit.failureStage,
    errorCode: audit.errorCode,
  });
}

```

</details>

**依据 9 · 源码核查**：[src/audit/writer.ts:79-143](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/audit/writer.ts#L79-L143)

真实redact/cap/0700/0600 append及吞错。

<details>
<summary>查看原文（65行）</summary>

```text

    const cappedCommand = capField(
      redactSecrets(command),
      options.failureStage ? Number.POSITIVE_INFINITY : COMMAND_MAX_LENGTH,
    );
    const cappedSegment = capField(redactSecrets(segment), SEGMENT_MAX_LENGTH);
    const cappedToolName = options.toolName
      ? capField(redactSecrets(options.toolName), TOOL_NAME_MAX_LENGTH)
      : undefined;
    const cappedCwd = cwd === null ? undefined : capField(redactSecrets(cwd), CWD_MAX_LENGTH);
    const sessionDir = join(
      logsDir,
      encodeCwdForLogDirname(cappedCwd?.value ?? null),
      ts.slice(0, 7),
    );
    mkdirSync(sessionDir, { recursive: true, mode: 0o700 });

    const logFile = join(sessionDir, `${ts.slice(0, 10)}-${safeSessionId}.jsonl`);
    const entry: AuditLogEntry = {
      ts,
      id: (options.createId ?? randomHex16)(),
      v: AUDIT_LOG_VERSION,
      sessionId: safeSessionId,
      decision: options.decision ?? 'deny',
      agent: options.agent,
      shape: options.shape,
      level: options.level,
      configFallback: options.configFallback,
      toolName: cappedToolName?.value,
      command: cappedCommand.value,
      segment: cappedSegment.value,
      ...(cappedCommand.truncated ||
      cappedSegment.truncated ||
      cappedToolName?.truncated ||
      cappedCwd?.truncated
        ? { truncated: true }
        : {}),
      reason,
      ruleId: options.ruleId,
      intent: options.intent,
      failureStage: options.failureStage,
      errorCode: options.errorCode,
      cwd: cappedCwd?.value ?? null,
    };

    appendFileSync(logFile, `${JSON.stringify(entry)}\n`, { encoding: 'utf-8', mode: 0o600 });

    pruneExpiredAuditLogs(environment, logsDir, options.now);
  } catch {}
}

function capField(value: string, maxLength: number) {
  return { value: value.slice(0, maxLength), truncated: value.length > maxLength };
}

export function getAuditLogHomeDir(environment: Environment): string | null {
  const homeFromEnv = environment.env.get('CC_SAFETY_NET_AUDIT_HOME');
  if (environment.env.get('NODE_ENV') === 'test' && !homeFromEnv) {
    return null;
  }
  const home = homeFromEnv || environment.home;
  return home && isAbsolute(home) ? home : null;
}

export function getAuditLogsDir(environment: Environment): string | null {
```

</details>

**依据 10 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:61-70](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/hosts/deepseek-harness/guard.ts#L61-L70)

注册未显式汇总disposer，须依Host托管。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

#### 缺口

- 未审Host卸载所有权、全部策略编辑/来源拉取/保留/脱敏算法与用户身份隔离。
  **影响**：只能信已读分支，不把日志/策略保护当不可篡改安全审计。
  **进一步探讨**：副本坏JSON/项目放宽/日志禁写分别核effective policy、deny和日志；退出核Hostguard已撤与原审批仍在，保留必要证据后清敏感日志。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何试用，收益和全周期成本怎么核？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

有本机编码Agent风险需要、能维护策略与工具声明的用户，可在隔离DSH profile固定2.7.3，核原生bundle启用/Node>=22/当前Host tools.guard；保留Host审批和最小OS权限。先列bash/pwsh/文件工具与已声明自定义工具，确认执行位置/cwd，不给未知远程shell套本机声明；用不执行目标的规则预检/无破坏样本验证正常allow和明确deny原因，不能把安装成功当全工具覆盖。实际Host门禁尚无本轮运行证据。

首次安装/兼容/策略来源与项目权限核实，持续每次本地同步分析/文件读取/审计有CPU/IO/日志开销，现金/耗时未知；无模型调用主链证据，不填费用0或推算避免损失。误拦、坏配置回退、自定义工具新增、strict/paranoid调参和审计保留都需人工，默认all允许命令记录还带隐私管理成本。编写/更新外部rulebook和其他宿主另验，不用README覆盖面/测试数量替代实测。

试点同任务正常样本/拒绝样本分别记录漏检、误拦、理由可理解性与恢复总工时；未知工具提醒已在事后，看到后先检查实际目标，不重跑/补声明危险命令。退出先恢复原审批并确认没有在飞操作，再停对应profile插件、核guard是否撤销，保留策略/必要脱敏日志并按策略清理；不回滚已执行影响。若无法界定工具位置、持续误拦或有效配置不清，停依赖回人工审查/系统隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/entries/deepseek-harness/index.ts:1-7](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/entries/deepseek-harness/index.ts#L1-L7)

实际Host入口依赖。

```text
import { registerDeepSeekHarnessGuard } from '@/hosts/deepseek-harness/guard';

export default {
  name: 'cc-safety-net',
  inject: ['tools'],
  apply: registerDeepSeekHarnessGuard,
};
```

**依据 2 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:44-70](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/hosts/deepseek-harness/guard.ts#L44-L70)

默认工具与guard/事后提醒。

<details>
<summary>查看原文（27行）</summary>

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
}
```

</details>

**依据 3 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:94-111](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/hosts/deepseek-harness/guard.ts#L94-L111)

声明只能针对确定本机工具的具体提示。

<details>
<summary>查看原文（18行）</summary>

```text
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
        }),
      ]),
      source: Object.freeze({
        kind: 'cc-safety-net',
        form: 'notice',
        summary: `${toolName} commands are not checked`,
      }),
```

</details>

**依据 4 · 源码核查**：[src/core/policy/env.ts:63-71](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/core/policy/env.ts#L63-L71)

默认审计all带持续负担。

```text
export function resolveAuditScope(value: string | undefined): 'all' | 'blocked' | 'invalid' {
  if (value === undefined || value === 'all') return 'all';
  if (value === 'blocked') return 'blocked';
  return 'invalid';
}

export function shouldRecordAllowedCommands(env: ReadonlyMap<string, string>): boolean {
  return resolveAuditScope(getEnvFlagValue(ENV_FLAGS.auditScope, env)) === 'all';
}
```

**依据 5 · 源码核查**：[src/audit/writer.ts:79-143](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/audit/writer.ts#L79-L143)

实际本地日志/隐私与失败。

<details>
<summary>查看原文（65行）</summary>

```text

    const cappedCommand = capField(
      redactSecrets(command),
      options.failureStage ? Number.POSITIVE_INFINITY : COMMAND_MAX_LENGTH,
    );
    const cappedSegment = capField(redactSecrets(segment), SEGMENT_MAX_LENGTH);
    const cappedToolName = options.toolName
      ? capField(redactSecrets(options.toolName), TOOL_NAME_MAX_LENGTH)
      : undefined;
    const cappedCwd = cwd === null ? undefined : capField(redactSecrets(cwd), CWD_MAX_LENGTH);
    const sessionDir = join(
      logsDir,
      encodeCwdForLogDirname(cappedCwd?.value ?? null),
      ts.slice(0, 7),
    );
    mkdirSync(sessionDir, { recursive: true, mode: 0o700 });

    const logFile = join(sessionDir, `${ts.slice(0, 10)}-${safeSessionId}.jsonl`);
    const entry: AuditLogEntry = {
      ts,
      id: (options.createId ?? randomHex16)(),
      v: AUDIT_LOG_VERSION,
      sessionId: safeSessionId,
      decision: options.decision ?? 'deny',
      agent: options.agent,
      shape: options.shape,
      level: options.level,
      configFallback: options.configFallback,
      toolName: cappedToolName?.value,
      command: cappedCommand.value,
      segment: cappedSegment.value,
      ...(cappedCommand.truncated ||
      cappedSegment.truncated ||
      cappedToolName?.truncated ||
      cappedCwd?.truncated
        ? { truncated: true }
        : {}),
      reason,
      ruleId: options.ruleId,
      intent: options.intent,
      failureStage: options.failureStage,
      errorCode: options.errorCode,
      cwd: cappedCwd?.value ?? null,
    };

    appendFileSync(logFile, `${JSON.stringify(entry)}\n`, { encoding: 'utf-8', mode: 0o600 });

    pruneExpiredAuditLogs(environment, logsDir, options.now);
  } catch {}
}

function capField(value: string, maxLength: number) {
  return { value: value.slice(0, maxLength), truncated: value.length > maxLength };
}

export function getAuditLogHomeDir(environment: Environment): string | null {
  const homeFromEnv = environment.env.get('CC_SAFETY_NET_AUDIT_HOME');
  if (environment.env.get('NODE_ENV') === 'test' && !homeFromEnv) {
    return null;
  }
  const home = homeFromEnv || environment.home;
  return home && isAbsolute(home) ? home : null;
}

export function getAuditLogsDir(environment: Environment): string | null {
```

</details>

**依据 6 · 源码核查**：[src/hosts/deepseek-harness/install.ts:118-140](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/hosts/deepseek-harness/install.ts#L118-L140)

安装计划与启用检查不等运行覆盖。

<details>
<summary>查看原文（23行）</summary>

```text
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
      }
```

</details>

#### 缺口

- 未安装/运行/真实预检样本或同任务安全效果/性能/维护工时实验。
  **影响**：只支持受控试点，不证明损失减少和净收益。
  **进一步探讨**：先脱敏工具清单和小样本，单独核有效策略/Host拒绝；维护负担高于审批基线即停用，不自动提高权限。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 已有贡献和可证伪方向怎样划分？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

本项提供宿主适配与共享语义规则/策略/审计分层，可把已识别命令和路径拒绝理由带回Host；相对仅提示词是实质执行前判断，继承Host gate权威而非自造隔离。现有rule tool list/declare与未知工具post notice已经能手工查覆盖，不能再提泛泛“展示工具清单”作全新方向。

剩余候选是用户可选择的会话前覆盖核对：在第一次未知command-bearing工具运行前暴露“未声明/执行位置未核”并要求人工分类，本地才声明，远程保留未受检且明确退路；不自动宣称未知全部危险、不自动把远程映射本机路径。与现有事后notice+手工tool list对照，三个无破坏假工具样本：已声明本机、未知本机、未知远程；只观察到调用前的核对/拒绝，不执行破坏命令。测首次不受检调用、错误本机声明、正常流程误拦与总人工时间。若Host已自带充分工具授权、现有提示已足够，或核对只制造错误声明/噪声，则推翻。未实现/实测，不计已存在能力与评分。

#### 证据与依据

**依据 1 · 源码核查**：[src/hosts/deepseek-harness/guard.ts:63-119](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/hosts/deepseek-harness/guard.ts#L63-L119)

当前提醒只在post且已指导tool list/声明。

<details>
<summary>查看原文（57行）</summary>

```text
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
    noticed.add(key);
    const profilesDir = getDeepSeekHarnessProfilesDir(environment);
    return Object.freeze({
      id: randomUUID(),
      role: 'user',
      content: Object.freeze([
        Object.freeze({
          type: 'text',
          text: `CC Safety Net did not check the command \`${toolName}\` just ran. It checks a plugin's shell tool only after the tool is declared. First find out where \`${toolName}\` runs its commands: check its tool description, and if that doesn't say, read its plugin's source under \`${profilesDir}/<profile>/node_modules\`. If it runs them on this machine, declare it with \`npx -y cc-safety-net rule tool add ${toolName}\`. Add \`--cwd-arg <name>\` if it takes its working directory in an argument other than \`workdir\`, \`cwd\` or \`working_directory\`. Don't test the declaration by running a destructive command; \`npx -y cc-safety-net rule tool list\` confirms it. If it runs them somewhere else, such as a remote host, or you can't tell, don't declare it. Either way, tell the user what you found and what you did.`,
        }),
      ]),
      source: Object.freeze({
        kind: 'cc-safety-net',
        form: 'notice',
        summary: `${toolName} commands are not checked`,
      }),
    });
  } catch {
    return undefined;
  }
}

/** @internal */
export function createDeepSeekHarnessGuardHandler(
```

</details>

**依据 2 · 源码核查**：[src/gate/pipeline.ts:128-145](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/gate/pipeline.ts#L128-L145)

未知有声明才promote。

<details>
<summary>查看原文（18行）</summary>

```text
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

**依据 3 · 源码核查**：[src/gate/pipeline.ts:280-282](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/gate/pipeline.ts#L280-L282)

non-command可allow，是具体剩余边界。

```text
  if (!isCommandInvocation(invocation)) {
    return { stage: 'non-command', ...reported, decision: { kind: 'allow' } };
  }
```

**依据 4 · 源码核查**：[src/hosts/hook/plugin-adapter.ts:100-118](https://github.com/kenryu42/cc-safety-net/blob/7cb1936d32660a3841d9128814af19ec5b82c615/src/hosts/hook/plugin-adapter.ts#L100-L118)

当前有deny才返回block，不能用未命中表示全面核过。

<details>
<summary>查看原文（19行）</summary>

```text

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

#### 缺口

- 未读取全Host工具发现/授权UI与真实用户首漏检频率。
  **影响**：不能断言新增核对必需或现UI完全没有覆盖信息。
  **进一步探讨**：先比较现有notice/list在三样本的理解与错误，只有提前核对降低首漏检且不增错误声明才做小原型。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
