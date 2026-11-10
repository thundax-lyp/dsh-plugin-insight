# Kimi Plugin CC

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[00c3e91](https://github.com/linxule/kimi-plugin-cc/tree/00c3e91fc91a1a77348d9eff757da0a79a8e97c8)

<!-- BEGIN META -->
[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/linxule/kimi-plugin-cc) [![npm 30d 3,392](https://img.shields.io/static/v1?label=npm+30d&message=3%2C392&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/kimi-plugin-cc) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/kimi-plugin-cc)
<!-- END META -->

> **功能**：把本机 Kimi Code CLI 接入 Claude Code、Codex 与 DSH，提供第二轮审查、修复及可追踪的任务控制。

> **亮点**：[Q01](#research-q01) 宿主可直接启动同一 diff 的复审，审查提示保存证据范围并返回文件行号。[Q03](#research-q03) MCP 任务状态关联实际工作目录。

> **主要限制**：[Q02](#research-q02) 安全边界依赖实际 Kimi 版本及受管钩子。[Q03](#research-q03) 取消可能保留已做的编辑，钩子范围也无法覆盖所有内部子进程。

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
  - [Q01 · 同一小型 diff 如何交给 Kimi 做第二轮只读审查？](#detail-section-11)
  - [Q02 · 谁决定工具权限，声明兼容如何和运行准入对应？](#detail-section-12)
  - [Q03 · 只读、写入、隔离补丁与取消各自留下什么？](#detail-section-13)
  - [Q04 · 怎样低成本判断第二轮审查是否值得重复使用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常需要在合并前复核小型 Git diff 的开发者，在宿主会话内发起第二轮审查并检查文件行号。

用本机 Kimi CLI 手工指定仓库及 diff，结束后回宿主整理并核对发现。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 实现 |
| --- | --- |
| 复审 | 固定范围与只读钩子 |
| 宿主接线 | Cordis / MCP |
| 写模式 | 工作区限制或补丁交付 |

**流程与依赖**

| 依赖 | 作用 |
| --- | --- |
| DSH 或 Claude Code/Codex | 提供工具入口或任务控制 |
| Node 与已准入 Kimi CLI | 启动与流式执行 |
| Kimi 账户及受管钩子 | 提供方鉴权和本地工具准入 |

| 步骤 | 可查结果 |
| --- | --- |
| 确认仓库和钩子 | 实际版本和目录 |
| 发起只读复审 | 明确 diff 与运行终态 |
| 逐条确认 | 源码行、影响和 Git 状态 |

**效果与成本**

| 阶段 | 试用者成本 |
| --- | --- |
| 首次 | 准备 CLI、账户、宿主与钩子 |
| 持续 | 提供方用量、等待、审查复核及升级检查 |
| 失败与退出 | 核查日志和 Git 状态，回宿主手工审查 |

| 人群 | 增量 |
| --- | --- |
| 维护者 | 由宿主复用同一 diff 发第二轮审查 |
| 任务操作者 | 使用任务 ID 回查终态或发取消 |

> **思考**：[Q02](#research-q02) 安全边界依赖实际 Kimi 版本及受管钩子。[Q03](#research-q03) 取消可能保留已做的编辑，钩子范围也无法覆盖所有内部子进程。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 宿主可直接启动同一 diff 的复审，审查提示保存证据范围并返回文件行号。[Q03](#research-q03) MCP 任务状态关联实际工作目录。

逐操作版本准入、终启动复核、带进程标签的工具钩子与 MCP 任务绑定分别覆盖版本、范围和生命周期。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 安全边界依赖实际 Kimi 版本及受管钩子。[Q03](#research-q03) 取消可能保留已做的编辑，钩子范围也无法覆盖所有内部子进程。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅在已有授权的 CLI 与受管钩子下试一份公开小 diff，钩子不匹配或发现不可复核就回原宿主手工查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

partial

- 已检查：作者 README、包清单、源码路径 .mcp.json、README.md、docs/safety.md、docs/upstream-2.5.2-certification.md、plugins/kimi-dsh/README.md、plugins/kimi-dsh/cordis.patch.yml、runtime/cli-client.ts、runtime/commands/review.ts、runtime/commands/swarm.ts、runtime/dsh/index.ts、runtime/hooks/approval-policy.ts、runtime/kimi-engine.ts、runtime/mcp/binding.ts、runtime/mcp/operations.ts、runtime/rescue-approval.ts、tests/runtime/real-binary-smoke.test.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的源码与作者版本验证记录。CLI 认证、供应商访问、具体宿主和审查效果需用各自环境核对。
- 下一步：本轮未安装、未调用 Kimi、未执行宿主测试。下一步对同一公开 diff 运行只读对照，并核对实际工具拒绝与终态。

**分析版本**

- **仓库**：[linxule/kimi-plugin-cc](https://github.com/linxule/kimi-plugin-cc)
- **版本号**：2.5.6（[固定提交 00c3e91](https://github.com/linxule/kimi-plugin-cc/tree/00c3e91fc91a1a77348d9eff757da0a79a8e97c8)）
- **版本日期**：2026-11-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 将第二轮审查放进宿主会话可能减少整理 diff 的步骤并补足部分回归线索，需用同一 diff 记录真实发现与复核耗时。

本轮未安装、未调用 Kimi、未执行宿主测试。下一步对同一公开 diff 运行只读对照，并核对实际工具拒绝与终态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 72 | 8632 | — | — | 172274 |
| .ts | source | 78 | 23881 | 19472 | 2803 | — |
| .mjs | source | 5 | 386 | 368 | 8 | — |
| .ts | test | 91 | 28166 | 24396 | 1747 | — |
| .mjs | test | 5 | 632 | 566 | 22 | — |
| .js | test | 1 | 52 | 47 | 0 | — |
| .md | test | 1 | 28 | — | — | 355 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-10），可前往 [GitHub Issues](https://github.com/linxule/kimi-plugin-cc/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护者能否在 DSH 或 Claude Code 中把小型 diff 交给 Kimi 做第二轮只读审查，并独立确认授权、发现及任务结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 同一小型 diff 如何交给 Kimi 做第二轮只读审查？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

维护者已有 DSH 或 Claude Code，会在合并前核对一处边界检查。可手工把 diff 交给本地 Kimi Code CLI，再回原宿主逐项验证。插件把审查范围、运行参数和结果放在宿主可调用的任务中，便于使用同一份 diff 并回查文件行号。Claude Code 的 MCP 清单把项目目录交给 companion，DSH bundle 把相应操作接为宿主子 Agent 工具并使用宿主 subprocess 服务，存在独立的 Codex 分发面。

审查入口先核对钩子，再收集本地 Git 范围、准备执行计划和任务记录。审查提示按分支基线或工作树选择证据，提醒当前目录与分支 diff 不一致时以分支 diff 为准。要求模型返回可回查的文件行号和影响。合格结果需由维护者打开对应代码核验；单次调用输出不构成测试结果。

#### 证据与依据

**依据 1 · 源码核查**：[.mcp.json:1-13](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/.mcp.json#L1-L13)

Claude Code MCP 传项目目录。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "mcpServers": {
    "kimi": {
      "command": "${CLAUDE_PLUGIN_ROOT}/scripts/companion.sh",
      "args": [
        "mcp"
      ],
      "env": {
        "KIMI_PLUGIN_CC_MCP_WORKSPACE": "${CLAUDE_PROJECT_DIR}"
      }
    }
  }
}
```

</details>

**依据 2 · 源码核查**：[plugins/kimi-dsh/cordis.patch.yml:1-27](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/plugins/kimi-dsh/cordis.patch.yml#L1-L27)

实际 DSH bundle 注册工具与 provider。

<details>
<summary>查看原文（27行）</summary>

```text
- insert:
    - id: kimi-plugin-cc
      name: 'kimi-plugin-cc'
    - id: tool-kimi-ask
      name: '@deepseek-ai/dsh-tool-subagent'
      config:
        provider: kimi-ask
        toolName: kimi_ask
        maxDepth: provider-managed
    - id: tool-kimi-review
      name: '@deepseek-ai/dsh-tool-subagent'
      config:
        provider: kimi-review
        toolName: kimi_review
        maxDepth: provider-managed
    - id: tool-kimi-challenge
      name: '@deepseek-ai/dsh-tool-subagent'
      config:
        provider: kimi-challenge
        toolName: kimi_challenge
        maxDepth: provider-managed
    - id: tool-kimi-rescue
      name: '@deepseek-ai/dsh-tool-subagent'
      config:
        provider: kimi-rescue
        toolName: kimi_rescue
        maxDepth: provider-managed
```

</details>

**依据 3 · 源码核查**：[runtime/dsh/index.ts:147-168](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/dsh/index.ts#L147-L168)

DSH subprocess、provider 和提示注册。

<details>
<summary>查看原文（22行）</summary>

```text
    dataRoot: resolved.dataRoot,
    env: resolved.env,
    disposeGraceMs: resolved.disposeGraceMs,
    maxOutputBytes: resolved.maxOutputBytes,
    model: resolved.model,
    thinkingEffort: resolved.thinkingEffort,
    budget: resolved.budget,
    reviewBase: resolved.reviewBase,
    spawn: (spawnSpec) => ctx.subprocess.spawn(spawnSpec),
  };

  for (const operation of DSH_COMPANION_OPERATIONS) {
    ctx.subagents.registerProvider(new KimiCompanionProvider(`kimi-${operation}`, operation, spec));
  }

  ctx.inject(["systemPrompt"], (promptCtx) => {
    promptCtx.systemPrompt.section({
      name: "kimi-plugin-cc:tool-boundaries",
      order: promptCtx.systemPrompt.getSectionOrder("TOOL_SUBAGENT"),
      text: () => DSH_TOOL_GUIDANCE,
    });
  });
```

</details>

**依据 4 · 源码核查**：[runtime/commands/review.ts:51-94](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/commands/review.ts#L51-L94)

检查钩子、收集范围及登记任务。

<details>
<summary>查看原文（44行）</summary>

```text
  if (context.env.KIMI_PLUGIN_CC_SKIP_HOOK_CHECK !== "1") {
    await requireReadOnlyHookInstalled(context, commandType);
  }

  const reviewContext = await collectReviewContext(context.cwd, parsed.base);
  const paths = resolvePluginPaths(context.env);
  await ensurePluginPaths(paths);
  const repoIdentity = await resolveRepoIdentity(context.cwd);
  const executionPlan = await prepareKimiExecutionPlan({
    operationKind: commandType,
    cwd: context.cwd,
    env: context.env,
  });
  const store = new JobStore(paths);

  const jobId = allocateJobId(context);
  // Leave kimi_session_id NULL until kimi announces an actual ID; never invent
  // one that no on-disk session matches.
  const reviewSessionId: string | null = null;
  const logPath = path.join(paths.logsDir, `${commandType}-${jobId}.jsonl`);
  const previewPrompt = buildReviewPrompt(commandType, reviewContext, parsed.focus);
  const job = store.createJob({
    job_id: jobId,
    repo_id: repoIdentity.repoId,
    command_type: commandType,
    cwd: context.cwd,
    model: parsed.model ?? null,
    thinking: null,
    thinking_effort: parsed.thinkingEffort ?? null,
    background: false,
    budget_ms: parsed.budgetMs ?? null,
    budget_source: parsed.budgetMs !== undefined ? "explicit" : "default",
    pid: process.pid,
    kimi_pid: null,
    status: "running",
    kimi_session_id: reviewSessionId,
    ...persistedExecutionPlanFields(executionPlan),
    agent_profile: REVIEW_AGENT_PROFILE_PLACEHOLDER,
    prompt_digest: digestPrompt(previewPrompt),
    summary: `Running ${commandType}.`,
    final_output_path: null,
    stream_log_path: logPath,
    error: null,
  });
```

</details>

**依据 5 · 源码核查**：[runtime/commands/review.ts:226-261](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/commands/review.ts#L226-L261)

分支与工作树证据区分，要求可回查发现。

<details>
<summary>查看原文（36行）</summary>

```text
function buildReviewPrompt(
  commandType: "review" | "challenge",
  reviewContext: Awaited<ReturnType<typeof collectReviewContext>>,
  focus?: string,
): string {
  const modeInstructions =
    commandType === "challenge"
      ? [
          "Steelman the current approach first, then challenge its assumptions, brittle design choices, and alternatives.",
          "Say when the current approach is preferable instead of assuming change is necessary.",
        ]
      : ["Focus on concrete bugs, regressions, and missing safeguards in the supplied changes."];
  const hasReviewInputs = reviewContext.scope === "base"
    ? reviewContext.diffText.trim().length > 0
    : reviewContext.diffText.trim().length > 0 || reviewContext.statusSummary.length > 0;
  const hasUntrackedInputs = reviewContext.scope === "working-tree" &&
    reviewContext.statusSummary.split("\n").some((line) => line.startsWith("?? "));
  const baseTreeDirty = reviewContext.scope === "base" &&
    reviewContext.statusSummary.split("\n").some((line) => line.length > 0 && !line.startsWith("?? "));
  const inspectionInstruction = reviewContext.scope === "working-tree"
    ? "Read each complete changed file, relevant surrounding code, and related tests rather than reviewing only the diff excerpt."
    : baseTreeDirty
      ? "Treat the supplied branch diff as the source of truth. Current working-tree files may differ; do not use their contents or line numbers as evidence for committed changes."
      : "Read each complete changed file at HEAD, relevant surrounding code, and related tests rather than reviewing only the diff excerpt.";

  return [
    "Perform a read-only code review of the supplied repository changes.",
    ...modeInstructions,
    "Use only the allowed repository read tools; do not use shell/Bash, writes, background tasks, or delegated operations.",
    hasReviewInputs ? inspectionInstruction : undefined,
    "Return plain markdown with a short verdict line (approve / concern / block), a brief summary, and findings with file:line references.",
    "For every finding, provide concrete evidence, impact, severity, and confidence. Do not manufacture findings; if there are none, say so honestly and note residual verification gaps.",
    "Do not emit JSON or wrap the whole response in code fences.",
    hasReviewInputs
      ? undefined
      : "There are no changes in the declared review scope. Return immediately with a one-line note that there were no changes; do not explore the repository.",
```

</details>

**依据 6 · 作者声明**：[README.md:145-161](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/README.md#L145-L161)

作者区分宿主操作及审查范围。

<details>
<summary>查看原文（17行）</summary>

```text
## Choose a task

| Task | Claude Code command | Codex skill | File access |
| --- | --- | --- | --- |
| Explain code | `/kimi:ask` | `$kimi-ask` | Read-only |
| Review code changes | `/kimi:review` | `$kimi-review` | Read-only |
| Challenge a design or approach | `/kimi:challenge` | `$kimi-challenge` | Read-only |
| Make a focused fix | `/kimi:rescue` | `$kimi-rescue` | Can edit your project |
| Review several areas at once | `/kimi:swarm` | `$kimi-swarm` | Read-only |
| Prepare edits in parallel | `/kimi:swarm --write` | `$kimi-swarm-write` | Only in a temporary Git worktree; returns a patch for you to apply |
| Work toward a goal over several turns | `/kimi:pursue` | `$kimi-pursue` | Can edit your project; experimental |

Review and challenge inspect your Git diff. Use ask for general questions about your repository.

Pursue and swarm have time limits. Swarm runs tasks in parallel, so it can use more tokens than a single task.

Claude Code also has an optional [review gate](./commands/setup.md). It checks work when Claude finishes a turn and is off by default.
```

</details>

#### 缺口

- 无本轮宿主中的同一 diff 对照
  **影响**：无法确认检查结果与用户当前分支一致
  **进一步探讨**：使用固定小型 diff，在宿主和手工 CLI 分别记录输入与发现

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 谁决定工具权限，声明兼容如何和运行准入对应？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

插件运行本机 Kimi Code CLI。作者说明调用使用操作者在 Kimi 中配置的订阅或供应商账户，提示和任务代码由所选提供方处理。Claude Code、DSH 的登录与 Kimi 的登录分别配置。运行时解析实际可执行文件、探测版本并按操作选择经过表内准入的引擎，临启动复核命令和参数。原生 v2 路径有额外本地环境与恢复条件；固定版本的 native-v2 表纳入精确 2.5.2，作者另报在该版本上验证钩子、计划模式和写入边界，本轮没有复现。

执行进程使用独立 argv 传入非交互 -p 与 stream-json。review/challenge 启动前默认要求受管 PreToolUse 钩子；钩子根据进程标签限制工具并禁止计划模式。启动环境移除继承的 workspace trust 值，关闭 CLI 自动更新。源码提供跳过 hook 检查的开关，开启后缺失或漂移不能按默认拒绝路径推断。作者列出 macOS/Linux，DSH 文档还要求 Node 24.9 或以上；包清单范围、CLI 兼容表和实际宿主验收应分别判断。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-56](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/README.md#L28-L56)

作者说明账户、发送内容和平台要求。

<details>
<summary>查看原文（29行）</summary>

````text
## Use Kimi in your coding tasks

Ask Kimi to explain code, review changes, challenge a design, or make a focused fix. You can use this plugin in Claude Code, Codex, or DeepSeek Harness (DSH).

The plugin runs the Kimi Code CLI on your computer. It uses your Kimi subscription or a provider you configure in Kimi. Calls count against that subscription or API account. Your host application's login stays unchanged. The selected provider receives the prompts and code needed for your task.

Start with a question or a review. Their tool rules allow reading files and deny file writes and shell commands. Other modes can change files. DSH provides the same seven operations with the same write boundaries. Read the [safety limits](./docs/safety.md) before asking Kimi to make changes.

## Before you install

You need:

- macOS or Linux
- Claude Code, Codex, or DSH with plugin support
- Node.js 22.5 or newer (24.9 or newer for DSH)
- Kimi Code CLI 2.4.1 (certified; 2.4.0, 2.3.3, 2.3.2, 2.3.1 and 2.3.0 are also certified)

Windows is not currently supported. Contributors can help with the [no-model Windows diagnostics checks](./docs/windows-validation.md). Check your versions in a terminal:

```sh
node --version
kimi --version
```

Use the [Kimi Code installation guide](https://www.kimi.com/code/docs/en/kimi-code-cli/getting-started) if you need the CLI. You do not need Bun or a build step to use this plugin.

We test compatibility with exact CLI versions. A newer CLI may need a newer plugin. See [supported versions and upgrades](./docs/migration.md).

Run `kimi` in your terminal. Use `/login` for a Kimi subscription, or `/provider` to set up an API provider. Enter credentials in Kimi, never in the assistant conversation. Exit Kimi when you finish setup. If you set `KIMI_CODE_HOME`, use the same location for Kimi and the plugin.
````

</details>

**依据 2 · 作者声明**：[plugins/kimi-dsh/README.md:19-28](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/plugins/kimi-dsh/README.md#L19-L28)

作者说明 DSH 宿主先决条件。

<details>
<summary>查看原文（10行）</summary>

```text
Job controls are `/kimi-status [job-id]`, `/kimi-result [job-id]`, and `/kimi-cancel [job-id]`. Without an id, status and result select the latest job for the current repository, and cancel selects the latest active job. Cancellation stops work but does not roll back changes or patches already produced.

## Requirements

- Node.js 24.9.0 or later.
- DeepSeek Harness >=0.2.1-rc.5 <0.3.0; this package is developed and composed against 0.2.1-rc.5.
- Kimi Code CLI on `PATH`, authenticated and configured through Kimi. The companion's exact-version certification table remains authoritative.
- A patched DSH host and profiles with zod >=4.6.6 and undici >=8.12.2; see [host installation and audit instructions](../../docs/registry-releases.md#patched-dsh-host-and-profiles). The plugin does not patch your host automatically.

## Install
```

</details>

**依据 3 · 源码核查**：[runtime/kimi-engine.ts:112-146](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/kimi-engine.ts#L112-L146)

native-v2 精确版本和逐操作表。

<details>
<summary>查看原文（35行）</summary>

```text
  "2.1.1",
  "2.2.0",
  "2.3.0",
  "2.3.1",
  "2.3.2",
  "2.3.3",
  "2.4.0",
  "2.4.1",
  "2.5.0",
  "2.5.1",
  "2.5.2",
]);

/** Per-operation native-v2 certification. One green operation never certifies another. */
export const NATIVE_V2_CERTIFIED: ReadonlyMap<KimiOperationKind, readonly string[]> = new Map<
  KimiOperationKind,
  readonly string[]
>([
  ["review", NATIVE_V2_CERTIFIED_VERSIONS],
  ["challenge", NATIVE_V2_CERTIFIED_VERSIONS],
  ["ask", NATIVE_V2_CERTIFIED_VERSIONS],
  ["rescue", NATIVE_V2_CERTIFIED_VERSIONS],
  ["review_gate", NATIVE_V2_CERTIFIED_VERSIONS],
  ["pursue", NATIVE_V2_CERTIFIED_VERSIONS],
  ["swarm", NATIVE_V2_CERTIFIED_VERSIONS],
  ["swarm-write", NATIVE_V2_CERTIFIED_VERSIONS],
]);

export function isNativeV2Certified(
  operationKind: KimiOperationKind,
  version: string,
): boolean {
  const normalized = parseVersionLine(version)?.raw;
  if (normalized === undefined) return false;
  return NATIVE_V2_CERTIFIED.get(operationKind)?.includes(normalized) ?? false;
```

</details>

**依据 4 · 源码核查**：[runtime/kimi-engine.ts:261-298](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/kimi-engine.ts#L261-L298)

实际探测与准入后构建计划。

<details>
<summary>查看原文（38行）</summary>

```text
  const probe = await probeKimiVersion({
    kimiBin: exactCommand,
    prefixArgs: kimi.prefixArgs,
    cwd: options.cwd,
    env: options.env,
  });
  if (probe.kind !== "ok") {
    throw new RuntimeError(
      "KIMI_EXECUTION_PLAN_UNRESOLVED",
      `Refusing to spawn kimi because the exact command/version plan could not be established: ${probe.reason}. Run Claude Code \`/kimi:setup\` or Codex \`$kimi-setup\` to verify the active binary, or correct KIMI_PLUGIN_CC_KIMI_BIN / KIMI_PLUGIN_CC_KIMI_PREFIX_ARGS and retry.`,
      "kimi-engine.plan",
      {
        details: {
          operation_kind: options.operationKind,
          intended_engine: options.intendedEngine ?? null,
          command: exactCommand,
          prefix_args: kimi.prefixArgs,
        },
      },
    );
  }

  const intendedEngine =
    options.intendedEngine ?? selectIntendedEngine(options.operationKind, probe);
  const safetyProfile = intendedEngine === "native-v2" ? NATIVE_V2_SAFETY_PROFILE : null;
  assertCertifiedCapability(intendedEngine, options.operationKind, probe);
  await runPreflight(intendedEngine);

  return Object.freeze({
    schemaVersion: 1,
    operationKind: options.operationKind,
    intendedEngine,
    command: exactCommand,
    prefixArgs: Object.freeze([...kimi.prefixArgs]),
    kimiVersion: probe.version,
    certification: "certified",
    resumedFromJobId: options.resumedFromJobId ?? null,
    safetyProfile,
```

</details>

**依据 5 · 源码核查**：[runtime/cli-client.ts:213-278](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/cli-client.ts#L213-L278)

spawn 前重验、显式 cwd 和环境。

<details>
<summary>查看原文（66行）</summary>

```text
  assertExecutionPlanMatchesSpawn(
    opts.executionPlan,
    opts.command,
    opts.prefixArgs ?? [],
    opts.env,
  );

  if (
    (opts.commandLabel === "rescue" || opts.commandLabel === "swarm-write") &&
    !opts.trustedWorkspaceRoot
  ) {
    throw new RuntimeError(
      "CLI_TRUSTED_WORKSPACE_ROOT_MISSING",
      `Refusing ${opts.commandLabel}: write-capable plugin launches require a plugin-owned trusted workspace root.`,
      "cli-client.pre-spawn",
      { details: { command_label: opts.commandLabel } },
    );
  }

  // The master experimental flag enables v2-only features (tower, subagent
  // fork) outside the certified no-plan profile. Refuse it at the final
  // boundary too, in case the environment changed after plan creation.
  assertNoUnsafeExperimentalSelector(opts.env, "cli-client.pre-spawn");

  // Validate the ACTUAL prefix argv used for this spawn — not only the
  // env-resolved value — so a forged/corrupt persisted plan cannot smuggle a
  // reserved kimi flag (e.g. `-r <session>`, which would resume a session the
  // v2 preflight never scanned for plan taint).
  assertPrefixArgsSafe(opts.prefixArgs ?? []);

  if (opts.executionPlan.intendedEngine === "native-v2") {
    // Re-run the cheap no-plan preconditions at the final boundary: the
    // operator's config.toml and the resume journal are mutable between plan
    // creation (possibly in another process) and this spawn.
    await assertNativeV2Preflight({
      kimiHome: resolveKimiHome(opts.env, opts.cwd),
      env: opts.env,
      resumeSessionId: opts.resumeSessionId,
      expectedExecutionRoot: opts.trustedWorkspaceRoot ?? opts.cwd,
      stage: "cli-client.spawn",
    });
  }

  const args = buildArgs(opts);
  assertPromptFitsCommandLine(opts.command, args);
  const env = buildKimiCliEnvironment(opts);

  if (opts.logPath !== undefined) {
    await mkdir(path.dirname(opts.logPath), { recursive: true }).catch(() => {
      // Best-effort; if mkdir fails the appendFile below will error and be
      // swallowed by the log chain (diagnostics are non-blocking).
    });
  }

  let child: ChildProcessWithoutNullStreams;
  let spawnedAt: number;
  try {
    spawnedAt = Date.now();
    child = spawn(opts.command, args, {
      cwd: opts.cwd,
      env,
      stdio: "pipe",
      // POSIX gets a fresh process group so cancellation reaches kimi's
      // descendants; Windows has no negative-pid process-group signaling.
      detached: process.platform !== "win32",
    });
```

</details>

**依据 6 · 源码核查**：[runtime/cli-client.ts:1085-1153](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/cli-client.ts#L1085-L1153)

非交互 argv、版本定向与环境控制。

<details>
<summary>查看原文（69行）</summary>

```text
function buildArgs(opts: CliClientOptions): string[] {
  const args: string[] = [...(opts.prefixArgs ?? [])];
  args.push("--output-format", "stream-json");
  const smokeCandidate = opts.executionPlan.certification === "test-bypass" && opts.env.KIMI_PLUGIN_CC_SMOKE === "1"
    ? opts.env.KIMI_PLUGIN_CC_SMOKE_V2_CANDIDATE
    : undefined;
  if (
    opts.resumeSessionId === undefined &&
    ["2.5.0", "2.5.1", "2.5.2"].includes(opts.executionPlan.kimiVersion ?? smokeCandidate ?? "")
  ) {
    args.push("--environment", "local");
  }
  if (opts.resumeSessionId !== undefined) {
    args.push("-r", opts.resumeSessionId);
  }
  if (opts.model !== undefined) {
    args.push("-m", opts.model);
  }
  if (opts.skillsDirs !== undefined) {
    for (const dir of opts.skillsDirs) {
      args.push("--skills-dir", dir);
    }
  }

  // -p accepts the prompt as the option value. We pass it as a separate argv
  // entry so prompts with leading dashes or whitespace are not interpreted as
  // additional flags.
  args.push("-p", opts.prompt);
  return args;
}

export type CliClientEnvironmentOptions = Pick<
  CliClientOptions,
  "cwd" | "env" | "executionPlan" | "thinkingEffort" | "commandLabel" | "swarmMaxConcurrency" | "trustedWorkspaceRoot"
>;

export function buildKimiCliEnvironment(opts: CliClientEnvironmentOptions): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...opts.env };
  if (opts.thinkingEffort !== undefined) env.KIMI_MODEL_THINKING_EFFORT = opts.thinkingEffort;
  // Ambient workspace trust starts project MCP stdio servers outside PreToolUse.
  delete env.KIMI_CODE_TRUST_WORKSPACE;
  // Legacy-v1 plans use this flag on releases whose unflagged -p default can
  // route to native-v2. Always overwrite ambient false values; older releases
  // ignore it. The engine choice stays plugin-owned, while certified native-v2
  // plans use the no-plan construction rather than a legacy pin.
  if (opts.executionPlan.intendedEngine === "legacy-v1") {
    env[KIMI_LEGACY_ENV] = KIMI_LEGACY_FORCED_VALUE;
  }
  // The update preflight runs on the `-p` path too; a plugin spawn must never
  // swap the certified binary underneath the execution plan.
  env.KIMI_CODE_NO_AUTO_UPDATE = "1";
  // Plugin-owned web lifecycles must not inherit ambient idle-session reclamation.
  env.KIMI_CODE_SESSION_IDLE_RECLAIM_MS = "0";
  // Rescue and pursue share the write label. Only the immutable execution
  // plan can grant pursue's narrow goal-metadata access; never trust ambient
  // state inherited from another plugin job.
  env.KIMI_PLUGIN_CC_OPERATION = opts.executionPlan.operationKind;
  env.KIMI_CODE_HOME = resolveKimiHome(opts.env, opts.cwd);
  if (opts.commandLabel !== undefined) {
    env.KIMI_PLUGIN_CC_CMD = opts.commandLabel;
  }
  if (opts.swarmMaxConcurrency !== undefined) {
    env.KIMI_CODE_AGENT_SWARM_MAX_CONCURRENCY = String(opts.swarmMaxConcurrency);
  }
  if (opts.trustedWorkspaceRoot !== undefined) {
    // Trusted allowlist root for write-capable PreToolUse cases. Forge-proof
    // (env on the spawned process; the model cannot alter it). See field doc.
    env.KIMI_PLUGIN_CC_WORKSPACE_ROOT = opts.trustedWorkspaceRoot;
  }
```

</details>

**依据 7 · 源码核查**：[runtime/commands/review.ts:198-223](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/commands/review.ts#L198-L223)

默认拒绝失配钩子，留显式跳过开关。

<details>
<summary>查看原文（26行）</summary>

```text
async function requireReadOnlyHookInstalled(
  context: CommandContext,
  commandType: "review" | "challenge",
): Promise<void> {
  if (context.env.KIMI_PLUGIN_CC_SKIP_HOOK_CHECK === "1") {
    return;
  }

  const installStatus = await verifyHookInstalled(context.env);
  if (installStatus.installed) {
    return;
  }

  maybeWarnHookMissing(installStatus, commandType, context.stderr);
  throw new RuntimeError(
    `${commandType.toUpperCase()}_HOOK_NOT_INSTALLED`,
    [
      `${commandType} refuses to run without the canonical kimi-plugin-cc PreToolUse hook.`,
      `Hook check failed: ${installStatus.reason ?? "unknown"}.`,
      "Run /kimi:setup or $kimi-setup to install or repair this host's managed block.",
      "Set KIMI_PLUGIN_CC_SKIP_HOOK_CHECK=1 only if you intentionally accept un-enforced execution.",
      hookRefusalRetryProtocol(context.env),
    ].join(" "),
    `${commandType}.hook-check`,
    { details: hookRefusalDetails(installStatus) },
  );
```

</details>

**依据 8 · 源码核查**：[runtime/hooks/approval-policy.ts:130-148](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/hooks/approval-policy.ts#L130-L148)

进程标签作用域与计划模式拒绝。

<details>
<summary>查看原文（19行）</summary>

```text
export function decideHookOutcomePure(
  input: HookInput,
  ctx: PolicyContext,
): HookDecision | { evaluator: "rescue"; workspaceRoot: string } {
  const label = typeof ctx.commandLabel === "string" ? ctx.commandLabel : undefined;
  // Out-of-plugin context: any kimi process spawned without our env var
  // is direct user usage. The hook MUST NOT restrict it.
  if (label === undefined || label.length === 0) {
    return { decision: "allow" };
  }

  const toolName = typeof input.tool_name === "string" ? input.tool_name : "";

  if (PLAN_MODE_TOOLS.has(toolName)) {
    return {
      decision: "deny",
      reason:
        `kimi-plugin-cc safety hook: tool "${toolName}" is denied for plugin-managed sessions because agent-core-v2 plan-file writes can bypass later external hooks; native plan mode is never armed in plugin-managed sessions.`,
    };
```

</details>

**依据 9 · 作者声明**：[docs/upstream-2.5.2-certification.md:17-40](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/docs/upstream-2.5.2-certification.md#L17-L40)

作者报告精确二进制与 DSH 打包验证。

<details>
<summary>查看原文（24行）</summary>

```text
## Exact-binary controls

Controls used the read-only Agent Keys API key, resolved only into each process, and empty isolated homes with absolute paths. The forced removed-tool control instead used a loopback scripted provider. No personal config or OAuth store was read, copied or symlinked. Controls ran sequentially, and a scan of the evidence tree found no key material. Raw evidence is under `.claude/kimi-code-research/cert-2.5.2-live/`.

- **Plan OFF Write:** the exact 2.5.2 marker came first. Write reached the custom deny-all hook and was denied; no target file or plan state was created.
- **Plan ON:** an armed plan journal let Glob reach the deny hook, and a **1,656-byte** plan file was written without a plan-Write hook invocation. This shows the bypass the no-plan closures exist to prevent. The workspace stayed empty.
- **Removed EnterPlanMode:** EnterPlanMode was absent from the offered tools. A forced call was rejected on the same call ID before any hook ran, and the rejection was returned to the provider. No plan state or files appeared.
- **Environment:** real activation and deactivation passed with the explicit local binding. A remote default, disabled workspace trust and a resumed remote binding each refused before spawn.
- **Swarm OFF:** a real AgentSwarm call returned the inactive-mode result with zero child journals and no probe files.
- **Swarm ON:** preactivation produced `agent-0` and `agent-1`. Each child's assigned Write was matched to a managed-denial result on the same toolCallId, no probes landed, and deactivation was verified with ambient idle reclamation set to 1 ms.
- **Out-of-root control:** child Writes outside the root were denied on their own call IDs, created no files, and deactivation was verified.

## Candidate and production matrices

Both matrices ran through the new pre-authorized monitor route, `~/.local/bin/kimi-plugin-cc-monitor-smoke`. It installs the exact binary once under `~/.cache/kimi-plugin-cc-monitor/` (same `dist/main.mjs` SHA-256 as above), uses the read-only Agent Keys API key, seeds from an empty temp home and redacts the log.

- **Candidate** (`candidate-smoke.log`, `KIMI_PLUGIN_CC_SMOKE_V2_CANDIDATE=2.5.2`): **24 tests with 167 assertions and no skips in 391.42 seconds**. Review, challenge, ask and review_gate each received a same-call managed Write denial. Real rescue confinement, the Bash.cwd denial, resume and plan-taint refusal, and both pursue outcomes passed. Six goal turns each had a managed Write denial, and the goal workspace was empty at settlement. Write-swarm captured a **278-byte** child-authored patch with a clean user tree and removed worktree, and denied the out-of-root write.
- **Production table** (`production-smoke.log`, candidate override unset): **24 tests with 167 assertions and no skips in 399.68 seconds**. It independently repeated the same evidence. Six of seven goal turns carried managed denials; the seventh was cut by the budget abort, and the workspace was empty at settlement. Write-swarm again captured a 278-byte patch.

A scan of both logs found no key material.

## Repository and package gates

Frozen dependency installation made no changes. The full `bun run check` passed **1,429 tests with 33 expected opt-in skips, 0 failures and 18,662 assertions across 82 files in 356.03 seconds**, including the generated-distribution drift gate. Package validation passed **331 files**, all three compiled distributions, isolated hook setup/check and version refusal, and a patched DSH host/profile with seven live providers/tools and Web boot. The isolated npm consumer-security audit passed. Logs: `check-standard.log`, `package-standard.log`, `consumer-security.log`, `tag-scan*.log` and `binary-sha256.txt` under `.claude/kimi-code-research/cert-2.5.2-live/`.
```

</details>

#### 缺口

- 未验实际操作者认证与所选提供方授权
  **影响**：无法从配置、版本列表或作者实验得出该用户的联网能力
  **进一步探讨**：只在已授权账户与公开仓库上核对实际二进制和钩子状态

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只读、写入、隔离补丁与取消各自留下什么？

**研究主题**：工程质量与复用、缺陷与关键质疑、效果与总成本

#### 完整回答

只读审查走工具允许列表。写入型 rescue 直接作用于验证后的工作区，写 swarm 改在临时工作树执行；后者捕获补丁，捕获或会话清理失败时保留工作树供回查。工具钩子从启动时的工作区根获取写入范围，进一步核对 Bash cwd、工具和路径；插件文档也说明钩子未覆盖所有内部进程，因而只能把这套策略用于受信任仓库和配置。

MCP 控制层把任务与实际仓库、cwd 和运行中的 companion 绑定。作者描述 Claude Code 可用任务接口，Codex 普通 MCP 调用用任务句柄。取消是协作信号，保留已发生的编辑。日常审查只需等待终态并人工核对发现；写任务若失败，开发者需检查工作树或补丁，以及任务是否仍在运行，避免把取消当作回滚。

#### 证据与依据

**依据 1 · 源码核查**：[runtime/hooks/approval-policy.ts:180-196](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/hooks/approval-policy.ts#L180-L196)

审查类标签按只读工具允许列表。

<details>
<summary>查看原文（17行）</summary>

```text
  switch (label) {
    case "ask":
    case "review":
    case "challenge":
    case "review_gate":
      // Read-only narrative surfaces share READ_ONLY_TOOLS. They run as
      // non-interactive subprocesses, so interactive tool prompts cannot
      // substitute for this allowlist.
      if (READ_ONLY_TOOLS.has(toolName)) {
        return { decision: "allow" };
      }
      return {
        decision: "deny",
        reason: denyReadOnlyMessage(label, toolName),
      };

    case "swarm":
```

</details>

**依据 2 · 源码核查**：[runtime/hooks/approval-policy.ts:212-247](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/hooks/approval-policy.ts#L212-L247)

写模式需要插件持有的可信根。

<details>
<summary>查看原文（36行）</summary>

```text
    case "swarm-write": {
      // Write-capable fan-out runs in an ephemeral worktree. AgentSwarm and the
      // read-only set are allowed; the singular Agent is denied. Every other
      // tool goes through the rescue evaluator scoped to the plugin-exported
      // KIMI_PLUGIN_CC_WORKSPACE_ROOT, never the payload cwd, so an in-process
      // subagent cannot move the trust boundary or forge its root. A missing
      // root fails closed for writes.
      if (READ_ONLY_TOOLS.has(toolName) || toolName === AGENT_SWARM_TOOL) {
        return { decision: "allow" };
      }
      const workspaceRoot =
        typeof ctx.trustedWorkspaceRoot === "string" ? ctx.trustedWorkspaceRoot : "";
      if (workspaceRoot.length === 0) {
        return {
          decision: "deny",
          reason:
            `kimi-plugin-cc safety hook: swarm-write received no trusted workspace root; tool "${toolName}" denied. ` +
            "This is a plugin misconfiguration — writes are refused rather than risk the user's working tree.",
        };
      }
      return { evaluator: "rescue", workspaceRoot };
    }

    case "rescue": {
      const workspaceRoot =
        typeof ctx.trustedWorkspaceRoot === "string" ? ctx.trustedWorkspaceRoot : "";
      if (workspaceRoot.length === 0) {
        if (READ_ONLY_TOOLS.has(toolName)) return { decision: "allow" };
        return {
          decision: "deny",
          reason:
            `kimi-plugin-cc safety hook: rescue received no trusted workspace root; tool "${toolName}" denied. ` +
            "This is a plugin misconfiguration — writes are refused rather than trusting hook payload cwd.",
        };
      }
      return { evaluator: "rescue", workspaceRoot };
```

</details>

**依据 3 · 源码核查**：[runtime/rescue-approval.ts:196-273](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/rescue-approval.ts#L196-L273)

写工具与 shell 的核查路径。

<details>
<summary>查看原文（78行）</summary>

```text
export async function evaluateRescueHookRequest(
  workspaceRoot: string,
  toolName: string,
  toolInput: unknown,
): Promise<HookDecision> {
  if (RESCUE_READ_ONLY_TOOLS.has(toolName)) {
    return { decision: "allow" };
  }

  let root: string;
  try {
    root = await realpath(workspaceRoot);
  } catch (err) {
    return {
      decision: "deny",
      reason: `rescue cannot resolve workspace root: ${(err as Error).message}`,
    };
  }

  if (toolName === "Bash") {
    const command = extractBashCommand(toolInput);
    if (command === null) {
      return {
        decision: "deny",
        reason: "rescue cannot evaluate Bash input with no command field",
      };
    }
    const cwd = isObject(toolInput) ? toolInput.cwd : undefined;
    if (cwd !== undefined) {
      if (typeof cwd !== "string" || cwd.length === 0) {
        return { decision: "deny", reason: "rescue requires Bash cwd to be a non-empty string" };
      }
      try {
        const outcome = await checkApprovedDirectory(root, cwd);
        if (outcome === "symlink") {
          return { decision: "deny", reason: `rescue rejects Bash cwd symlinks: ${cwd}` };
        }
        if (outcome === "missing") {
          return { decision: "deny", reason: `rescue rejects Bash cwd that is missing or not a directory: ${cwd}` };
        }
        if (outcome === "reject") {
          return { decision: "deny", reason: `rescue rejects Bash cwd outside the workspace or inside .git: ${cwd}` };
        }
      } catch (err) {
        return { decision: "deny", reason: `rescue cannot inspect Bash cwd ${cwd}: ${(err as Error).message}` };
      }
    }
    const result = validateShellCommand(command);
    return result.response === "approve"
      ? { decision: "allow" }
      : { decision: "deny", reason: result.feedback ?? "rescue rejected the shell command" };
  }

  if (toolName === "Write" || toolName === "Edit") {
    const filePath = extractFilePath(toolInput);
    if (filePath === null) {
      return {
        decision: "deny",
        reason: `rescue cannot evaluate ${toolName} input with no path field`,
      };
    }
    return pathDecision(await checkApprovedPath(root, filePath), filePath);
  }

  if (toolName === "MultiEdit") {
    const filePath = extractFilePath(toolInput);
    if (filePath === null) {
      return {
        decision: "deny",
        reason: "rescue cannot evaluate MultiEdit input with no path field",
      };
    }
    return pathDecision(await checkApprovedPath(root, filePath), filePath);
  }

  return {
    decision: "deny",
    reason: `rescue does not allow tool "${toolName}" — only Bash, Write, Edit, MultiEdit (with allowlist checks) and read-only tools are permitted.`,
```

</details>

**依据 4 · 源码核查**：[runtime/commands/swarm.ts:407-437](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/commands/swarm.ts#L407-L437)

隔离执行根、清理与失败保留。

<details>
<summary>查看原文（31行）</summary>

```text
          spawnCwd: worktreePath,
          workspaceRoot: worktreePath,
          onPatchCaptureFailure: () => {
            preserveWorktree = true;
          },
        },
      );
      if (preserveWorktree && completed.error) {
        throw new RuntimeError(completed.error.code, completed.error.message, completed.error.stage, {
          details: completed.error.details,
        });
      }
      if (!completed.final_output_path) {
        throw new RuntimeError(
          "SWARM_RESULT_MISSING",
          "Swarm (write) finished without a rendered result.",
          "swarm.result",
        );
      }
      return readArtifact(completed.final_output_path);
    } finally {
      if (preserveWorktree) {
        context.stderr.write(
          `[kimi-plugin-cc] swarm-write patch capture or session cleanup failed; worktree retained at ${worktreePath}.\n`,
        );
      } else {
        await removeWorktree(repoIdentity.repoRoot, worktreePath);
      }
    }
  } finally {
    store.close();
```

</details>

**依据 5 · 源码核查**：[runtime/commands/swarm.ts:453-491](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/commands/swarm.ts#L453-L491)

补丁捕获和由用户应用的退出面。

<details>
<summary>查看原文（39行）</summary>

```text
 * Capture the worktree change set as a `.patch` artifact (write mode). Returns
 * the artifact path + size, or null on capture failure. Called on EVERY terminal
 * path so partial work survives a cancel/budget-expiry.
 */
async function capturePatchArtifact(
  paths: PluginPaths,
  jobId: string,
  worktreePath: string,
  stderr: CommandContext["stderr"],
  onFailure?: () => void,
): Promise<{ path: string; bytes: number; empty: boolean } | null> {
  try {
    const patch = await captureWorktreePatch(worktreePath);
    const patchPath = path.join(paths.artifactsDir, `swarm-write-${jobId}.patch`);
    await writeFile(patchPath, patch, "utf8");
    return { path: patchPath, bytes: Buffer.byteLength(patch, "utf8"), empty: patch.trim().length === 0 };
  } catch (error) {
    onFailure?.();
    stderr.write(
      `[kimi-plugin-cc] swarm-write patch capture failed for job ${jobId}: ${(error as Error).message ?? String(error)}\n`,
    );
    return null;
  }
}

/** Render the patch-handoff header prepended to a write-swarm report. */
function renderWriteSwarmHeader(captured: { path: string; bytes: number; empty: boolean } | null): string {
  if (captured === null) {
    return "**Patch:** capture FAILED — no patch was written; inspect the run logs.";
  }
  if (captured.empty) {
    return "**Patch:** the swarm made NO changes (empty patch).";
  }
  return [
    `**Patch written to:** \`${captured.path}\` (${captured.bytes} bytes).`,
    `Review it, then apply from the repo root with: \`git apply --3way ${captured.path}\` ` +
      "(the worktree was based on HEAD, so `--3way` reconciles against your current tree; " +
      "plain `git apply` works only if your tree hasn't moved since).",
    "The plugin did NOT apply or commit anything — you own the merge.",
```

</details>

**依据 6 · 源码核查**：[runtime/mcp/binding.ts:7-23](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/mcp/binding.ts#L7-L23)

任务/仓库/工作目录/进程身份校验。

<details>
<summary>查看原文（17行）</summary>

```text
export async function assertMcpJobBinding(task: McpTaskRecord, job: JobRecord | null): Promise<JobRecord> {
  if (!job) throw bindingError(task, "The supervised job row does not exist.");
  if (job.job_id !== task.task_id) throw bindingError(task, "Task and job IDs differ.");
  if (job.operation_kind !== task.operation_kind) throw bindingError(task, "Task and job operation kinds differ.");
  if (job.repo_id !== task.repo_id) throw bindingError(task, "Task and job repositories differ.");
  if (job.background) throw bindingError(task, "Supervised MCP jobs must retain foreground companion ownership.");
  if (job.status === "running" && (task.companion_pid === null || job.pid !== task.companion_pid)) {
    throw bindingError(task, "Task and job companion process IDs differ or are missing.");
  }
  let jobCwd: string;
  try {
    jobCwd = await realpath(job.cwd);
  } catch (error) {
    throw bindingError(task, "The job workspace cannot be resolved.", error);
  }
  if (jobCwd !== task.workspace_cwd) throw bindingError(task, "Task and job workspaces differ.");
  return job;
```

</details>

**依据 7 · 源码核查**：[runtime/mcp/operations.ts:189-205](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/mcp/operations.ts#L189-L205)

结果和协作取消语义。

<details>
<summary>查看原文（17行）</summary>

```text
    name: "kimi_job_status",
    description: "Read one MCP-launched job's durable state and phase in the same workspace. This is always an ordinary MCP result, never a task.",
    inputSchema: JOB_CONTROL_SCHEMA,
    annotations: { title: "kimi job status", readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  {
    name: "kimi_job_result",
    description: "Read the terminal artifact for one MCP-launched job in the same workspace. Failed jobs return isError:true with their artifact; running jobs return JOB_NOT_TERMINAL without changing state.",
    inputSchema: JOB_CONTROL_SCHEMA,
    annotations: { title: "kimi job result", readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  {
    name: "kimi_job_cancel",
    description: "Cooperatively cancel one running MCP-launched job in the same workspace. Terminal jobs are a no-op. Cancellation does not roll back edits, and write-swarm still captures its patch before cleanup.",
    inputSchema: JOB_CONTROL_SCHEMA,
    annotations: { title: "kimi job cancel", readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  },
```

</details>

**依据 8 · 作者声明**：[README.md:205-214](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/README.md#L205-L214)

作者区分 Claude Code 与 Codex MCP 结果。

<details>
<summary>查看原文（10行）</summary>

```text
The plugin also bundles one MCP stdio server for Claude Code and Codex, alongside the existing slash commands and skills. Those interfaces remain available, and the existing safety-hook setup is still mandatory.

The seven model tools are `kimi_ask`, `kimi_review`, `kimi_challenge`, `kimi_rescue`, `kimi_pursue`, `kimi_swarm`, and `kimi_swarm_write`. Job control uses `kimi_job_status`, `kimi_job_result`, and `kimi_job_cancel`.

- **Claude Code:** task-capable calls return durable MCP tasks. Poll them with `tasks/get` and cancel them with `tasks/cancel`.
- **Codex:** calls currently use ordinary MCP results, not native MCP tasks. After attachment, a running job returns a launch handle; an already settled job returns its terminal result. Use the three job-control tools to check, read, or cancel it.

Claude supplies the project directory as the default workspace. When the host has no default, as is normal for Codex, the initial operation requires an absolute `workspace` path. Later job-control calls can rely on the job's persisted workspace binding. An MCP server disconnect does not cancel jobs. The jobs table owns status and outcomes; the terminal artifact is the result authority. Failed jobs return `isError: true` with their artifacts.

For example: “Use `kimi_review` to check this diff. In Claude Code, poll the returned task with `tasks/get`; in Codex, use the returned handle with `kimi_job_status` and then `kimi_job_result`.”
```

</details>

**依据 9 · 作者声明**：[docs/safety.md:378-384](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/docs/safety.md#L378-L384)

作者明确内部 Git 子进程的边界。

```text
| `INVALID_ENV` (`reserved_flag`) | `KIMI_PLUGIN_CC_KIMI_PREFIX_ARGS` carries a kimi root flag (session, prompt, permission/plan, model/profile/roots, or `-V`/`-h`) — the prefix is a launcher shim only | remove the flag from the prefix |

## What this safety story does NOT cover

- **Repository Git configuration and internal subprocesses.** The managed hook gates tool calls, not every internal subprocess. Upstream's explorer profile builds Git context with `git status` and `git log` outside the child tool hook. On 2.0.2 and 2.1.1, repository settings such as `core.fsmonitor` can execute a helper there, including during read-only swarm startup. Version 2.1.0 hardens these Git invocations; 2.1.1 rolls that hardening back to the previously certified behavior. Use trusted repositories and Git configuration. Certification does not establish a sandbox for hostile repositories or arbitrary Git helpers.
- **Malicious kimi-code binaries.** The threat model assumes the user trusts the kimi-code binary they installed. A hostile binary can ignore the hook entry in its own config.
- **TOCTOU between path check and edit.** The rescue allowlist resolves and checks paths at allowlist time. Between that check and the actual file write, an attacker with workspace write access could swap a symlink. The mitigation is workspace-write-trust — if untrusted code can edit your workspace, you have bigger problems than this plugin.
```

#### 缺口

- 无本轮运行、取消及写后状态比对
  **影响**：无法确认操作系统及 Host 组合下的 teardown 和损失边界
  **进一步探讨**：在受信任临时仓库模拟取消，回读终态、Git 和补丁

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样低成本判断第二轮审查是否值得重复使用？

**研究主题**：采用判断、新假设与验证、工程质量与复用

#### 完整回答

在已认证的 Kimi CLI、受管钩子及可用 DSH 或 Claude Code 前提下，先用公开仓库中一个已知回归的小 diff 做只读 review。首次成本是配置本地 CLI、准确版本、提供方账户和钩子，再核对项目路径。持续成本是提供方用量、等待和逐条复核，插件或 CLI 更新后重新检查版本和钩子。启动被拒、流式输出出现钩子疑点、Git 树变化或发现无法复核时，停止使用该任务结果，保留终态与日志线索并回宿主手工检查。

待验假设是把 Kimi 纳入现有宿主的审查，能减少手工整理输入且补到第一轮漏掉的一处回归。用相同 diff 和基线分别执行手工 Kimi CLI 审查及宿主插件审查，记录准备时间、已验证发现、错误条目及工作树变化。保留一次不同错误类型的反例以检查模型不会只复述预置回归。源码给出可检查流程，作者的版本实验没有测这个收益。

#### 证据与依据

**依据 1 · 源码核查**：[runtime/commands/review.ts:51-63](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/commands/review.ts#L51-L63)

只读审查的入口条件。

<details>
<summary>查看原文（13行）</summary>

```text
  if (context.env.KIMI_PLUGIN_CC_SKIP_HOOK_CHECK !== "1") {
    await requireReadOnlyHookInstalled(context, commandType);
  }

  const reviewContext = await collectReviewContext(context.cwd, parsed.base);
  const paths = resolvePluginPaths(context.env);
  await ensurePluginPaths(paths);
  const repoIdentity = await resolveRepoIdentity(context.cwd);
  const executionPlan = await prepareKimiExecutionPlan({
    operationKind: commandType,
    cwd: context.cwd,
    env: context.env,
  });
```

</details>

**依据 2 · 源码核查**：[runtime/commands/review.ts:238-261](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/commands/review.ts#L238-L261)

可固定和对照的审查输入。

<details>
<summary>查看原文（24行）</summary>

```text
  const hasReviewInputs = reviewContext.scope === "base"
    ? reviewContext.diffText.trim().length > 0
    : reviewContext.diffText.trim().length > 0 || reviewContext.statusSummary.length > 0;
  const hasUntrackedInputs = reviewContext.scope === "working-tree" &&
    reviewContext.statusSummary.split("\n").some((line) => line.startsWith("?? "));
  const baseTreeDirty = reviewContext.scope === "base" &&
    reviewContext.statusSummary.split("\n").some((line) => line.length > 0 && !line.startsWith("?? "));
  const inspectionInstruction = reviewContext.scope === "working-tree"
    ? "Read each complete changed file, relevant surrounding code, and related tests rather than reviewing only the diff excerpt."
    : baseTreeDirty
      ? "Treat the supplied branch diff as the source of truth. Current working-tree files may differ; do not use their contents or line numbers as evidence for committed changes."
      : "Read each complete changed file at HEAD, relevant surrounding code, and related tests rather than reviewing only the diff excerpt.";

  return [
    "Perform a read-only code review of the supplied repository changes.",
    ...modeInstructions,
    "Use only the allowed repository read tools; do not use shell/Bash, writes, background tasks, or delegated operations.",
    hasReviewInputs ? inspectionInstruction : undefined,
    "Return plain markdown with a short verdict line (approve / concern / block), a brief summary, and findings with file:line references.",
    "For every finding, provide concrete evidence, impact, severity, and confidence. Do not manufacture findings; if there are none, say so honestly and note residual verification gaps.",
    "Do not emit JSON or wrap the whole response in code fences.",
    hasReviewInputs
      ? undefined
      : "There are no changes in the declared review scope. Return immediately with a one-line note that there were no changes; do not explore the repository.",
```

</details>

**依据 3 · 源码核查**：[runtime/cli-client.ts:188-193](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/runtime/cli-client.ts#L188-L193)

流记录疑点只反映否决结果无法吻合或缺失。

```text
   * policy-denied calls whose result was not the managed denial (`mismatch`) or
   * never arrived (`unresolved`). Logged, persisted and shown; never a failure. */
  hookEscapes?: HookEscape[];
}

function spawnErrorDetails(error: unknown): Record<string, unknown> {
```

**依据 4 · 作者声明**：[README.md:28-56](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/README.md#L28-L56)

提供方用量、授权和版本成本。

<details>
<summary>查看原文（29行）</summary>

````text
## Use Kimi in your coding tasks

Ask Kimi to explain code, review changes, challenge a design, or make a focused fix. You can use this plugin in Claude Code, Codex, or DeepSeek Harness (DSH).

The plugin runs the Kimi Code CLI on your computer. It uses your Kimi subscription or a provider you configure in Kimi. Calls count against that subscription or API account. Your host application's login stays unchanged. The selected provider receives the prompts and code needed for your task.

Start with a question or a review. Their tool rules allow reading files and deny file writes and shell commands. Other modes can change files. DSH provides the same seven operations with the same write boundaries. Read the [safety limits](./docs/safety.md) before asking Kimi to make changes.

## Before you install

You need:

- macOS or Linux
- Claude Code, Codex, or DSH with plugin support
- Node.js 22.5 or newer (24.9 or newer for DSH)
- Kimi Code CLI 2.4.1 (certified; 2.4.0, 2.3.3, 2.3.2, 2.3.1 and 2.3.0 are also certified)

Windows is not currently supported. Contributors can help with the [no-model Windows diagnostics checks](./docs/windows-validation.md). Check your versions in a terminal:

```sh
node --version
kimi --version
```

Use the [Kimi Code installation guide](https://www.kimi.com/code/docs/en/kimi-code-cli/getting-started) if you need the CLI. You do not need Bun or a build step to use this plugin.

We test compatibility with exact CLI versions. A newer CLI may need a newer plugin. See [supported versions and upgrades](./docs/migration.md).

Run `kimi` in your terminal. Use `/login` for a Kimi subscription, or `/provider` to set up an API provider. Enter credentials in Kimi, never in the assistant conversation. Exit Kimi when you finish setup. If you set `KIMI_CODE_HOME`, use the same location for Kimi and the plugin.
````

</details>

**依据 5 · 作者声明**：[docs/upstream-2.5.2-certification.md:29-40](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/docs/upstream-2.5.2-certification.md#L29-L40)

作者报告版本探测与验证，不含本次收益对照。

<details>
<summary>查看原文（12行）</summary>

```text
## Candidate and production matrices

Both matrices ran through the new pre-authorized monitor route, `~/.local/bin/kimi-plugin-cc-monitor-smoke`. It installs the exact binary once under `~/.cache/kimi-plugin-cc-monitor/` (same `dist/main.mjs` SHA-256 as above), uses the read-only Agent Keys API key, seeds from an empty temp home and redacts the log.

- **Candidate** (`candidate-smoke.log`, `KIMI_PLUGIN_CC_SMOKE_V2_CANDIDATE=2.5.2`): **24 tests with 167 assertions and no skips in 391.42 seconds**. Review, challenge, ask and review_gate each received a same-call managed Write denial. Real rescue confinement, the Bash.cwd denial, resume and plan-taint refusal, and both pursue outcomes passed. Six goal turns each had a managed Write denial, and the goal workspace was empty at settlement. Write-swarm captured a **278-byte** child-authored patch with a clean user tree and removed worktree, and denied the out-of-root write.
- **Production table** (`production-smoke.log`, candidate override unset): **24 tests with 167 assertions and no skips in 399.68 seconds**. It independently repeated the same evidence. Six of seven goal turns carried managed denials; the seventh was cut by the budget abort, and the workspace was empty at settlement. Write-swarm again captured a 278-byte patch.

A scan of both logs found no key material.

## Repository and package gates

Frozen dependency installation made no changes. The full `bun run check` passed **1,429 tests with 33 expected opt-in skips, 0 failures and 18,662 assertions across 82 files in 356.03 seconds**, including the generated-distribution drift gate. Package validation passed **331 files**, all three compiled distributions, isolated hook setup/check and version refusal, and a patched DSH host/profile with seven live providers/tools and Web boot. The isolated npm consumer-security audit passed. Logs: `check-standard.log`, `package-standard.log`, `consumer-security.log`, `tag-scan*.log` and `binary-sha256.txt` under `.claude/kimi-code-research/cert-2.5.2-live/`.
```

</details>

**依据 6 · 源码核查**：[tests/runtime/real-binary-smoke.test.ts:770-785](https://github.com/linxule/kimi-plugin-cc/blob/00c3e91fc91a1a77348d9eff757da0a79a8e97c8/tests/runtime/real-binary-smoke.test.ts#L770-L785)

真 CLI 冒烟由显式条件启用。

<details>
<summary>查看原文（16行）</summary>

```text
test("real-binary smoke gating", () => {
  if (!SMOKE_ENABLED) {
    console.warn(
      "[smoke] skipped — set KIMI_PLUGIN_CC_SMOKE=1 (and have a real kimi binary + seed config) to run the real-binary smoke.",
    );
    return;
  }
  expect(
    SEED_OK,
    `seed kimi home at ${SEED_HOME} must contain config.toml + credentials/ (run kimi login first)`,
  ).toBe(true);
  expect(BINARY, "kimi binary not resolvable on PATH / KIMI_PLUGIN_CC_KIMI_BIN").toBeDefined();
});

// Goal-mode (autonomous /kimi:pursue) budget. Goal mode runs MULTIPLE
// continuation turns, so it needs a larger budget than a single prompt turn.
```

</details>

#### 缺口

- 缺少第二轮有效发现和复核时间的对照
  **影响**：无法得出重复采用能节省时间或提高检出率
  **进一步探讨**：记录一次真实缺陷和一次无缺陷变更的对照结果

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
