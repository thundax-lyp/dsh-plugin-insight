# dsh-oh-my-claude

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2a7fb89](https://github.com/lcestou/dsh-oh-my-claude/tree/2a7fb8922a557e338040ebcad2d3bd652447dd53)

<!-- BEGIN META -->
[![GitHub ★ 37](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lcestou/dsh-oh-my-claude) [![npm 30d 6,113](https://img.shields.io/static/v1?label=npm+30d&message=6%2C113&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-oh-my-claude) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-oh-my-claude)
<!-- END META -->

> **功能**：将已有 Claude Code CLI 接入 DSH 模型提供商，支持会话续接、交互审批及 SSH 工作区。

> **亮点**：[Q01](#research-q01) 把登录后的 CLI 挂成 DSH provider，支持会话及协议转译。[Q03](#research-q03) keeper 提供有界重放。

> **主要限制**：[Q02](#research-q02) Host 审批取决于 CLI 回调。[Q04](#research-q04) SSH 目录失败会退 HOME，远端凭据可传回本机。

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
  - [Q01 · 已有 Claude Code 使用者怎样从 DSH 启动同一类任务？](#detail-section-11)
  - [Q02 · 哪些 Claude 工具请求真正经过 DSH 审批？](#detail-section-12)
  - [Q03 · 断开后能恢复什么，哪里会丢状态？](#detail-section-13)
  - [Q04 · SSH 工作区与远端凭据在哪些路径流动？](#detail-section-14)
  - [Q05 · 什么结果能把观察改为试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 Claude Code 的用户希望从 DSH 续接代码任务与审批。

直接使用 Claude Code 可保留原生 CLI 操作；接入 DSH 增加会话界面和宿主审批，需要核对兼容和进程状态。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| CLI Provider | 从 DSH 调用 Claude Code | 需兼容登录及版本 |
| 会话重接 | 接管部分输出和恢复状态 | 缓存有界，副作用需另查 |
| 远端执行 | 通过 SSH 启动 CLI | 须核对路径、权限与凭据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 Claude Code | 必需 | 协议与运行 | 核对登录、版本与能力 |
| SSH、远端登录与工作区 | 远程必需 | 远端调用 | 优先验证本地，远端检查目标路径 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 隔离本地 CLI | 确认权限与版本 |
| 验证 | 同一只读任务续接 | 核对回复、工作区及进程 |
| 退出 | 停用 Adapter | 回 CLI 核对状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 依 CLI 与宿主条件 | 核对登录、权限 | 工时未知 |
| 持续 | 进程、网络与用量 | 回归 CLI 更新 | 收益待测 |
| 失败 | 可能重跑 | 核对输出及工件 | 真实恢复未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨入口续接 | 适配器与进程重接 | 兼容与输出完整 |
| 审批 | 部分工具回调映射 | 实际环境权限 |

> **思考**：[Q02](#research-q02) Host 审批取决于 CLI 回调。[Q04](#research-q04) SSH 目录失败会退 HOME，远端凭据可传回本机。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把登录后的 CLI 挂成 DSH provider，支持会话及协议转译。[Q03](#research-q03) keeper 提供有界重放。

JSON 帧、审批回调与 keeper ACK 彼此独立。恢复应依据实际工件和有副作用的工具回执。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) Host 审批取决于 CLI 回调。[Q04](#research-q04) SSH 目录失败会退 HOME，远端凭据可传回本机。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 当前观察。先验证隔离本地会话、回调及恢复，再决定采用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持 DSH 挂载和 CLI 桥接，实际权限、恢复和远端部署未验证。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、package.json、src/adapter.ts、src/adapter/class.ts、src/adapter/cli.ts、src/keeper.ts、src/mcp.ts、src/process.ts、src/usage.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽查固定宿主、CLI、keeper、权限与 SSH。未执行插件或核对真实账户。
- 下一步：对照本地只读任务、审批与中断，单独核对远端权限和用量凭据。

**分析版本**

- **仓库**：[lcestou/dsh-oh-my-claude](https://github.com/lcestou/dsh-oh-my-claude)
- **版本号**：1.6.3（[固定提交 2a7fb89](https://github.com/lcestou/dsh-oh-my-claude/tree/2a7fb8922a557e338040ebcad2d3bd652447dd53)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 将输出恢复和外部工具回执分别显示，测量是否减少盲目重跑。

对照本地只读任务、审批与中断，单独核对远端权限和用量凭据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 2670 | — | — | 65299 |
| .js | source | 74 | 26320 | 19356 | 7062 | — |
| .ts | test | 100 | 30224 | 26181 | 2913 | — |
| .ts | source | 187 | 50839 | 37746 | 11052 | — |
| .tsx | source | 41 | 21216 | 17618 | 3100 | — |

</details>

**活跃度**

[![近30天关闭 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=13&color=737b86&logo=github)](https://github.com/lcestou/dsh-oh-my-claude/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)

暂未获取：Issue 未关闭、近30天新建。

统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有 Claude Code 的 DSH 用户能否复用会话和审批，并核对进程恢复、远程权限与凭据边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有 Claude Code 使用者怎样从 DSH 启动同一类任务？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适用于已经登录 Claude Code、希望用 DSH 界面处理本地会话和审批的用户。直接在 Claude Code 中操作仍是功能最少依赖的基线。插件在 DSH llm 中注册可配置提供商及 Adapter，构建 Claude Code 参数，在版本支持时将提示及图像内容用 stream-json 发至 stdin，并接收 JSON 输出。工具、权限和预算参数仍依 CLI 是否支持对应标志。支持会话 ID 的版本可传新会话 ID 或 resume，用户应核对两轮消息与工作区确实对应。

这把一个已有 CLI 执行器接入 DSH 的会话和界面。选择一个只读任务，应要求原回复在当前会话可见、续问保留上下文且不会创建第二个不相关会话。插件复用登录和执行能力，模型可用性、原生 CLI 事件和真实限额由相应环境决定。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter.ts:169-198](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/adapter.ts#L169-L198)

宿主注册 provider、adapter 与会话控制服务。

<details>
<summary>查看原文（30行）</summary>

```text
export const inject = ["llm", "sessions", "attachments", "agents", "approval", "userQuestions"];

// Re-exported so tests that import from adapter.ts can reach it too.
export { ADAPTER_CURRENT };

/** The entry point dsh calls: build the adapter, register its provider and adapter, probe the login, and pin the instance on globalThis so a re-instantiation at boot shares the one already running. */
export function apply(ctx: PluginContext, config: Schemastery.TypeT<typeof Config>) {
  // Looked up on every read: `settings` is not in `inject`, so at apply it may not be mounted yet, and
  // a reference taken now stays undefined for the life of the process (every header wrote English).
  bindServerLocale({
    describe: (options) => ctx.get("settings")?.describe?.(options) ?? [],
  });
  const adapter = new ClaudeCodeAdapter(ctx, config);
  const claudeHome = adapter.claudeHome;
  ctx.llm.registerConfigurableProviders([
    {
      provider: adapter.providerId,
      displayName: adapter.displayName,
      settingsNs: adapter.settingsNs,
      settingsPath: [],
    },
  ]);
  adapter.registration = ctx.llm.registerAdapter([adapter.providerId], adapter);
  probeLogin(adapter);
  // dsh drops a session's Agent out of `ctx.agents` after a few idle minutes; the controller's
  // resolveAgent() cold-resumes it, which is what a wake after a long idle needs.
  ctx.inject?.(["sessionController"], (host) => {
    // SAFETY: cordis hands services untyped; this key holds dsh's session controller
    adapter.sessionController = host.sessionController as SessionController | undefined;
  });
```

</details>

**依据 2 · 源码核查**：[src/adapter/cli.ts:320-371](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/adapter/cli.ts#L320-L371)

CLI 输入输出、能力标志和恢复参数。

<details>
<summary>查看原文（52行）</summary>

```text
  if (usesStdin(flags)) args.push("--input-format", "stream-json");
  else args.push(promptText ?? "");
  args.push("--output-format", "stream-json", "--verbose");
  if (supports(flags, "--include-partial-messages")) args.push("--include-partial-messages");
  if (supports(flags, "--forward-subagent-text")) args.push("--forward-subagent-text");
  if (config.hookRows && supports(flags, "--include-hook-events"))
    args.push("--include-hook-events");
  if (model) args.push("--model", model);
  if (reasoningEffort && supports(flags, "--effort")) args.push("--effort", reasoningEffort);
  // In -p mode /fast only works in a session launched with fast mode in --settings (fast-mode docs).
  if (config.fastMode && supports(flags, "--settings"))
    args.push("--settings", JSON.stringify({ fastMode: true }));
  const appended = [system, mcp ? dshToolsGuidance(mcp.tools) : ""].filter(Boolean).join("\n\n");
  if (appended && supports(flags, "--append-system-prompt")) {
    args.push("--append-system-prompt", appended);
  }
  if (purpose) {
    // Auxiliary calls (title, compaction): one turn, no tools, no session of their own. Without
    // --no-session-persistence each one still leaves a transcript under the scratch project dir.
    args.push("--tools", "", "--max-turns", "1");
    if (supports(flags, "--no-session-persistence")) args.push("--no-session-persistence");
    return args;
  }
  if (temporary && supports(flags, "--no-session-persistence"))
    args.push("--no-session-persistence");
  if (supports(flags, "--permission-mode")) {
    const mode = permissionMode ?? permissionModeFor(config, accessMode);
    args.push("--permission-mode", mode);
  }
  if (config.approvals && usesStdin(flags) && supports(flags, "--permission-prompt-tool")) {
    args.push("--permission-prompt-tool", "stdio");
  }
  // "default" is what the Agent SDK passes; without it the CLI keeps AskUserQuestion out of -p runs.
  if (supports(flags, "--tools")) args.push("--tools", "default");
  if (config.allowedTools.length > 0) args.push("--allowedTools", ...config.allowedTools);
  if (config.disallowedTools.length > 0) args.push("--disallowedTools", ...config.disallowedTools);
  for (const d of config.addDirs) args.push("--add-dir", d);
  // Session-only plugins: a per-spawn flag, not a settings write, so they never touch the roster.
  if (supports(flags, "--plugin-dir"))
    for (const d of config.pluginDirs) args.push("--plugin-dir", d);
  if (supports(flags, "--plugin-url"))
    for (const u of config.pluginUrls) args.push("--plugin-url", u);
  if (config.maxTurns) args.push("--max-turns", String(config.maxTurns));
  if (config.maxBudgetUsd && supports(flags, "--max-budget-usd")) {
    args.push("--max-budget-usd", String(config.maxBudgetUsd));
  }
  if (session && supports(flags, "--session-id") && supports(flags, "--resume")) {
    args.push(session.resuming ? "--resume" : "--session-id", session.id);
  }
  if (mcp && supports(flags, "--mcp-config")) {
    // The key itself travels in the environment (`localEnvOverride`); see KEY_ENV.
    const dsh = { type: "http", url: mcp.url, headers: { [KEY_HEADER]: `\${${KEY_ENV}}` } };
```

</details>

**依据 3 · 源码核查**：[src/process.ts:437-455](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/process.ts#L437-L455)

本地进程通过管道连接。

<details>
<summary>查看原文（19行）</summary>

```text
export function nodeSpawner(
  command: string,
  args: string[],
  cwd: string,
  envOverride?: Record<string, string>,
): SubprocessHandle {
  const child = spawn(command, args, {
    cwd,
    stdio: ["pipe", "pipe", "pipe"],
    env: childEnv(process.env, envOverride),
  });
  return {
    stdin: child.stdin,
    stdout: child.stdout,
    stderr: child.stderr,
    done: new Promise((resolve) => {
      // Node emits `error` on the child for ENOENT, EACCES and a failed fork, and an EventEmitter
      // `error` with no listener throws. A `claude` that is not on PATH would take the whole dsh
      // host down with it, every session, not just this one. It reads as an exit here instead.
```

</details>

**依据 4 · 源码核查**：[src/process.ts:679-699](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/process.ts#L679-L699)

用户回合、响应与 interrupt 帧。

<details>
<summary>查看原文（21行）</summary>

```text
/** stdin line for one user turn. `session_id` empty and `parent_tool_use_id` null match what the SDK
 *  writes. `uuid` names the line for a later `cancel_async_message`; the CLI keeps it as the message's id. */
export function userTurnLine(content: unknown, uuid?: string): string {
  // Built in order, not spread: the key order is the byte order of the line, and the line without a
  // uuid must stay what it was before the steer card.
  const line: { type: "user"; uuid?: string } & Record<string, unknown> = { type: "user" };
  if (uuid) line.uuid = uuid;
  line.session_id = "";
  line.message = { role: "user", content };
  line.parent_tool_use_id = null;
  return `${JSON.stringify(line)}\n`;
}

/** stdin line answering one of the CLI's control requests with a result. */
export function controlResponseLine(requestId: string, response: unknown): string {
  return `${JSON.stringify({ type: "control_response", response: { subtype: "success", request_id: requestId, response } })}\n`;
}

/** stdin line asking the CLI to stop the current turn; it answers with a result and stays alive. */
export function interruptLine(requestId: string): string {
  return `${JSON.stringify({ type: "control_request", request_id: requestId, request: { subtype: "interrupt" } })}\n`;
```

</details>

#### 缺口

- 未运行匹配版本和真实登录
  **影响**：不能承诺任一 CLI 都可恢复
  **进一步探讨**：以固定 Host 与 CLI 跑同一个公开的两轮只读任务

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 哪些 Claude 工具请求真正经过 DSH 审批？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

当配置启用 approvals、输入使用 stdin 且 CLI 声明支持相应参数时，启动参数才加 permission-prompt-tool=stdio。适配器收到 can_use_tool 后标记当前会话待输入，按请求 ID 异步决定并把响应写回 CLI，避免 UI 等待时堵住输出。常规审批在有 agent 和 approval 服务时调用 DSH 请求，并带 toolUseId，允许一次才返回允许。服务缺失或抛错时拒绝，界面卡片不可用会形成独立结果。

AskUserQuestion 与 ExitPlanMode 有不同的交互分支。danger-full-access 可直接通过剩余审批请求。CLI 自己执行但没有发该回调的工具，不适合用这段源码证明受到 DSH 审批。适配器传入 CLI 权限模式、允许和禁止列表，与 DSH Host 沙箱边界不同，必须验证子进程实际采用的配置。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter/cli.ts:345-356](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/adapter/cli.ts#L345-L356)

权限模式和 stdio 回调的启用条件。

<details>
<summary>查看原文（12行）</summary>

```text
  if (supports(flags, "--permission-mode")) {
    const mode = permissionMode ?? permissionModeFor(config, accessMode);
    args.push("--permission-mode", mode);
  }
  if (config.approvals && usesStdin(flags) && supports(flags, "--permission-prompt-tool")) {
    args.push("--permission-prompt-tool", "stdio");
  }
  // "default" is what the Agent SDK passes; without it the CLI keeps AskUserQuestion out of -p runs.
  if (supports(flags, "--tools")) args.push("--tools", "default");
  if (config.allowedTools.length > 0) args.push("--allowedTools", ...config.allowedTools);
  if (config.disallowedTools.length > 0) args.push("--disallowedTools", ...config.disallowedTools);
  for (const d of config.addDirs) args.push("--add-dir", d);
```

</details>

**依据 2 · 源码核查**：[src/adapter/class.ts:6620-6667](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/adapter/class.ts#L6620-L6667)

回调传入 DSH 后再以请求 ID 回写。

<details>
<summary>查看原文（48行）</summary>

```text
    if (request.subtype !== "can_use_tool") {
      proc.write(
        controlErrorLine(
          requestId,
          `${request.subtype ?? "unknown"} is not supported by dsh-oh-my-claude`,
        ),
      );
      return;
    }
    const toolName = request.tool_name ?? "tool";
    const input = request.input ?? {};
    const toolUseId = request.tool_use_id ?? requestId;
    const controller = new AbortController();
    pending.set(requestId, controller);
    const awaitKind: "approval" | "question" | "plan" =
      toolName === "AskUserQuestion"
        ? "question"
        : toolName === "ExitPlanMode"
          ? "plan"
          : "approval";
    this.awaitingInput.set(options.sessionId, {
      kind: awaitKind,
      id: requestId,
      since: Date.now(),
    });
    this.publishAwaiting();
    const signal = options.signal
      ? AbortSignal.any([options.signal, controller.signal])
      : controller.signal;
    const agent = this.ctx?.agents?.get?.(options.sessionId);
    const label = toolName === "AskUserQuestion" ? "❓ question" : `⚑ approval: ${toolName}`;
    yield* tr.wholeBlock("reasoning", `${label} ${permissionReason(toolName, input, request)}`);
    // Decide asynchronously so the stream keeps flowing while the user thinks; the CLI waits on stdin.
    const reply = (line: string) => {
      if (!proc.write(line))
        this.log("warn", `control response for ${toolName} dropped: claude process already exited`);
    };
    this.decide({ toolName, input, request, toolUseId, agent, signal, accessMode: prep.accessMode })
      .then((result) => reply(controlResponseLine(requestId, result)))
      .catch((error) => reply(controlErrorLine(requestId, errorText(error))))
      .finally(() => {
        pending.delete(requestId);
        const held = this.awaitingInput.get(options.sessionId);
        if (held?.id === requestId) {
          this.awaitingInput.delete(options.sessionId);
          this.publishAwaiting();
        }
      });
```

</details>

**依据 3 · 源码核查**：[src/adapter/class.ts:6734-6744](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/adapter/class.ts#L6734-L6744)

原生问题分支。

<details>
<summary>查看原文（11行）</summary>

```text
  /** Answer one of Claude's tool permission requests. AskUserQuestion and ExitPlanMode go to dsh's
   *  question dialog, full access allows everything else, and the rest go to dsh's approval
   *  prompt. A dialog that cannot be shown, or is cancelled, answers deny with the reason. */
  async decide({ toolName, input, request, toolUseId, agent, signal, accessMode }: Decision) {
    if (toolName === "AskUserQuestion") {
      const questions = parseQuestions(input, toolUseId);
      const ask = this.ctx?.userQuestions?.ask;
      if (!questions || !ask) return denyResult(toolUseId, "dsh could not present this question");
      try {
        const response = await this.ctx.userQuestions.ask({ questions, agent, signal });
        // Claude Code 2.1.321 denies a host's answer that sets `afkTimeoutMs`, a field Claude may
```

</details>

**依据 4 · 源码核查**：[src/adapter/class.ts:6770-6825](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/adapter/class.ts#L6770-L6825)

计划交互、full access 例外及 Host 审批。

<details>
<summary>查看原文（56行）</summary>

```text
                question: serverText("planQuestion"),
                detail: plan,
                options: [
                  { label: approveLabel, description: serverText("planApproveDetail") },
                  { label: serverText("planKeep"), description: serverText("planKeepDetail") },
                ],
                intent: { kind: "plan-review", approve: approveLabel },
                multiSelect: false,
              },
            ],
            agent,
            signal,
          });
          const item = (response.answers ?? []).find((a) => a.id === id);
          const feedback = item?.custom ?? "";
          if (item?.selected?.length === 1 && item.selected[0] === approveLabel && feedback === "")
            return allowResult(toolUseId, input);
          return denyResult(
            toolUseId,
            feedback === ""
              ? "The user chose to keep planning; revise the plan and present it again."
              : `The user chose to keep planning; their feedback: ${feedback}`,
          );
        } catch (error) {
          return denyResult(toolUseId, `plan review cancelled: ${errorText(error)}`);
        }
      }
    }
    if (accessMode === "danger-full-access") return allowResult(toolUseId, input);
    const approval = this.ctx?.approval;
    if (!approval || !agent)
      return denyResult(toolUseId, "dsh approval is unavailable for this session");
    let outcome: ApprovalOutcome;
    try {
      outcome = await approval.request({
        agent,
        toolName,
        // dsh's ACP bridge (DSH Desktop) answers only a request that names its tool call; without
        // it the waterfall falls through and every ask settles "unavailable" in a millisecond (#202).
        callId: toolUseId,
        reason: permissionReason(toolName, input, request),
        signal,
      });
    } catch (error) {
      return denyResult(toolUseId, `approval failed: ${errorText(error)}`);
    }
    // What this request would have taken as a rule, for the Tune tab's chips. Kept in memory only:
    // it is a prompt, not a record, and a restart is allowed to forget it.
    const sessionId = agent.session?.id;
    if (sessionId !== undefined) {
      const rule = suggestRule(toolName, input);
      const asks = this.permissionAsks.get(sessionId)?.filter((r) => r !== rule) ?? [];
      asks.push(rule);
      this.permissionAsks.set(sessionId, asks.slice(-ASK_SUGGESTIONS));
    }
    if (outcome === "allowed-once") return allowResult(toolUseId, input);
```

</details>

#### 缺口

- 不同 CLI 模式及真实工具审批未验证
  **影响**：无法保证本机或远端工具被同一权限边界覆盖
  **进一步探讨**：用两种权限模式和无副作用工具验证允许、拒绝、缺 UI 与取消

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 断开后能恢复什么，哪里会丢状态？

**研究主题**：工程质量与复用、缺陷与关键质疑、功能与机制

#### 完整回答

插件启动后会尝试接管 keeper 与挂起工作，另延迟读取 busy.json 恢复中断任务。keeper 用序号记录 stdout，已连接且支持 ACK 时保留未确认记录，断开时也保留到上限。容量超限删最早的行并报告丢弃数；重新握手时回放未确认记录，没有 ACK 支持的客户端则当成已交付。使用 close 避免在管道尾部读完之前先报进程终止。

这能重接一部分输出，不能从输出 ACK 推出模型请求、文件写入或外部工具的事务恰好一次。进程已退出、缓存超限或恢复时读到不完整 transcript 都需要对照实际工件。用户退出前应先确认是否还有工作进程，保留恢复记录，避免同一写操作盲目重跑。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter.ts:209-229](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/adapter.ts#L209-L229)

加载时接管进程和状态。

<details>
<summary>查看原文（21行）</summary>

```text
  // Transcripts of loaded sessions go under watch now and on a timer, one per process like the
  // resume timer, reading the newest adapters at each tick.
  const sweep = () => {
    for (const a of g[ADAPTER_CURRENT]?.values() ?? []) {
      void a.watchLoadedSessions().catch((e) => a.log("warn", `watch sweep: ${errorText(e)}`));
      // The idle reaper rides the same tick; before #241 it ran only when a session spawned.
      a.reapIdle();
    }
  };
  setTimeout(sweep, 5000).unref?.();
  if (!g[WATCH_SWEEP]) {
    g[WATCH_SWEEP] = setInterval(sweep, WATCH_SWEEP_MS);
    g[WATCH_SWEEP].unref?.();
  }
  void adapter.adoptKeepers().catch((e) => adapter.log("warn", `keeper adoption: ${errorText(e)}`));
  void adapter.adoptHolds().catch((e) => adapter.log("warn", `hold adoption: ${errorText(e)}`));
  // A hot reload disposes the previous instance's command registrations with its scope and
  // brings no new init frame; re-bridge from the catalog the last one saw.
  if (g[COMMAND_CATALOG]) adapter.bridgeCommands(g[COMMAND_CATALOG], undefined);
  // A restart has no globalThis to read and adopts the keeper it finds, so no init frame follows:
  // the last catalog on disk is the only thing that puts the bridged commands back in the menu.
```

</details>

**依据 2 · 源码核查**：[src/adapter.ts:238-246](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/adapter.ts#L238-L246)

busy.json 恢复入口。

```text
  if (!g[RESUME_TIMER]) {
    g[RESUME_TIMER] = setTimeout(() => {
      // Resume every mounted instance over its own busy file.
      for (const inst of g[ADAPTER_CURRENT]?.values() ?? [])
        inst
          .resumeInterrupted(join(inst.stateDir, "busy.json"))
          .catch((e) => trace(`resume after restart failed: ${errorText(e)}`));
    }, RESUME_DELAY_MS);
    g[RESUME_TIMER].unref?.();
```

**依据 3 · 源码核查**：[src/keeper.ts:175-214](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/keeper.ts#L175-L214)

有界编号输出与 close 终态。

<details>
<summary>查看原文（40行）</summary>

```text
  // A stdout line goes out numbered. Detached, it waits in `unacked` like a sent one, so a replay
  // keeps one order; sent to a client that acknowledges, it stays until acknowledged.
  const sendOut = (text: string) => {
    const line = `${JSON.stringify({ t: "out", line: text, n: ++lastOut })}\n`;
    if (attached()) client?.write(line);
    else armOrphan();
    if (attached() && !clientAcks) return;
    if (unacked.size >= BUFFER_LINES) {
      const oldest = unacked.keys().next().value;
      if (oldest !== undefined) unacked.delete(oldest);
      dropped++;
    }
    unacked.set(lastOut, line);
  };
  const writeInfo = () =>
    writeFileSync(
      infoPath,
      JSON.stringify({
        pid: process.pid,
        claudePid: child.pid,
        sessionId: spec.sessionId,
        startedAt,
        exit: exit ?? null,
        // Why Claude ended, for the boot that finds this keeper dead: "client" means a kill
        // message from dsh, "child" means Claude exited on its own.
        endedBy,
      }),
    );
  log(`start pid=${process.pid} claudePid=${child.pid}`);
  writeInfo();

  createInterface({ input: child.stdout, crlfDelay: Infinity }).on("line", sendOut);
  createInterface({ input: child.stderr, crlfDelay: Infinity }).on("line", (line) =>
    send({ t: "err", line }),
  );
  // `close`, not `exit`: `exit` fires before stdout and stderr are drained, and the reader above
  // emits their remaining lines after it. dsh ends its stream on `t:"exit"`, so a turn whose final
  // `result` frame is still in the pipe would lose it and end as "claude exited 0: no output".
  child.on("close", (code, signal) => {
    if (exit) return; // a spawn error already reported this child; do not report it twice
```

</details>

**依据 4 · 源码核查**：[src/keeper.ts:239-267](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/keeper.ts#L239-L267)

重新握手回放与确认。

<details>
<summary>查看原文（29行）</summary>

```text
    createInterface({ input: sock, crlfDelay: Infinity }).on("line", (raw) => {
      let msg: { t?: string; line?: string; acks?: boolean; n?: number };
      try {
        // SAFETY: the only client is this plugin's attachKeeper; fields are checked before use
        msg = JSON.parse(raw) as { t?: string; line?: string; acks?: boolean; n?: number };
      } catch {
        return;
      }
      if (msg.t === "hello") {
        clientAcks = msg.acks === true;
        sock.write(
          `${JSON.stringify({ t: "hello", pid: process.pid, claudePid: child.pid, buffered: buffer.length + unacked.size, dropped })}\n`,
        );
        if (dropped > 0)
          sock.write(
            `${JSON.stringify({ t: "err", line: `keeper: ${dropped} output lines dropped while detached` })}\n`,
          );
        // What no turn used yet (sent to the client before, or waiting while detached), then the
        // rest. A client without acks takes them as delivered.
        for (const l of unacked.values()) sock.write(l);
        if (!clientAcks) unacked.clear();
        for (const l of buffer) sock.write(l);
        buffer.length = 0;
        dropped = 0;
        if (exit) sock.write(`${JSON.stringify({ t: "exit", ...exit })}\n`);
      } else if (msg.t === "ack" && typeof msg.n === "number") {
        if (client === sock) unacked.delete(msg.n);
      } else if (msg.t === "in" && typeof msg.line === "string") {
        if (!exit) child.stdin.write(msg.line);
```

</details>

#### 缺口

- 未测崩溃后的外部工具副作用及进程状态
  **影响**：不能保证一次执行或完整输出
  **进一步探讨**：在隔离工作区中断 Host，核对 CLI PID、输出序号、工件及恢复次数

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · SSH 工作区与远端凭据在哪些路径流动？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

SSH 执行器将命令、参数和环境转为远端脚本，先切目标 cwd，失败会退到远端 HOME，再启动 CLI。此处没有强制留在映射目录，因此目录不可用时任务可落到意外位置。CLI 模型调用由远端环境与登录决定。用量面板走另一条路径，经 SSH 读取远端 Claude 凭据文件，将凭据传回本机后在本机请求用量服务。SSH 只保护传输，不改变本机进程实际取得远端凭据的事实。

可选 DSH 工具 MCP 桥以共享 key 检查请求，允许会话桥接工具；CLI 配置把 key 引用放入环境。远程进程默认无法触达本机端口，实际能否使用取决于网络拓扑。启用 SSH 要单独确认工作目录、远端账号、授权、依赖与网络，不能从本地调用成功外推。

#### 证据与依据

**依据 1 · 源码核查**：[src/process.ts:651-677](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/process.ts#L651-L677)

远端命令与 cwd 失败回退。

<details>
<summary>查看原文（27行）</summary>

```text
export function sshInvocation(
  host: string,
  command: string,
  args: string[],
  cwd: string,
  far?: FarEnv,
  base: NodeJS.ProcessEnv = process.env,
) {
  const envPairs = [...forwardedEnv(base), ...Object.entries(CHILD_ENV), ...farEnvPairs(far)];
  const env = envPairs.map(([key, val]) => `${key}=${shq(val)}`).join(" ");
  const remote = [command, ...args].map(shq).join(" ");
  const script = `cd ${shq(cwd)} 2>/dev/null || cd "$HOME"; exec env ${env} ${remote}`;
  return { command: "ssh", args: sshArgs(host, script) };
}

/**
 * Spawner that runs Claude Code on a remote host over SSH: this box's harness drives the far `claude`,
 * nothing runs there but the CLI itself. The stream-json wire flows through the ssh pipe unchanged, so
 * the translator, approvals and control requests are untouched. The remote uses its own `~/.claude`
 * login; the dsh MCP bridge points at this box's port and does not reach it, so `dshTools` is best off.
 */
export const sshSpawner =
  (host: string, resolveCwd: (cwd: string) => string = (c) => c, far?: FarEnv): Spawner =>
  (command, args, cwd) => {
    const inv = sshInvocation(host, command, args, resolveCwd(cwd), far);
    return nodeSpawner(inv.command, inv.args, ".");
  };
```

</details>

**依据 2 · 源码核查**：[src/usage.ts:278-315](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/usage.ts#L278-L315)

SSH 读取远端凭据及本机用量请求。

<details>
<summary>查看原文（38行）</summary>

```text
/** A box's credentials file over ssh: its own `~/.claude`, read with `cat` so no path of this box
 *  is assumed there. Null when the box has none or does not answer. */
const remoteCredentials = (sshHost: string): Promise<string | null> =>
  new Promise((resolve) => {
    execFile(
      "ssh",
      sshArgs(sshHost, "cat ~/.claude/.credentials.json"),
      { timeout: 15_000, maxBuffer: 64 * 1024 },
      (err, stdout) => resolve(err ? null : stdout),
    );
  });

/** Read usage with the stored login; never throws, the panel shows the reason instead. An SSH
 *  box's usage is its own account's: its credentials come over ssh, the endpoint is asked from here. */
export async function readUsage(
  fetchImpl: UsageFetch = fetch,
  home?: string,
  sshHost?: string,
): Promise<UsageReply> {
  const headers = sshHost
    ? authHeadersFrom(await remoteCredentials(sshHost))
    : await authHeaders(home);
  if (!headers?.Authorization) return { ok: false, error: "needs a Claude Code login" };
  try {
    const r = await fetchImpl(USAGE_URL, {
      headers: { ...headers, Accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });
    if (r.status === 401) return { ok: false, error: "login expired: run claude auth login" };
    if (r.status === 429)
      return {
        ok: false,
        error: "usage endpoint rate limited",
        retryAfterMs: retryAfterMs(r.headers?.get("retry-after")),
      };
    if (r.status !== 200) return { ok: false, error: `HTTP ${r.status}` };
    const payload: unknown = await r.json();
    return {
```

</details>

**依据 3 · 源码核查**：[src/adapter/cli.ts:366-373](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/adapter/cli.ts#L366-L373)

配置 MCP 地址与 key 引用。

```text
  if (session && supports(flags, "--session-id") && supports(flags, "--resume")) {
    args.push(session.resuming ? "--resume" : "--session-id", session.id);
  }
  if (mcp && supports(flags, "--mcp-config")) {
    // The key itself travels in the environment (`localEnvOverride`); see KEY_ENV.
    const dsh = { type: "http", url: mcp.url, headers: { [KEY_HEADER]: `\${${KEY_ENV}}` } };
    args.push("--mcp-config", JSON.stringify({ mcpServers: { dsh } }));
  }
```

**依据 4 · 源码核查**：[src/mcp.ts:696-732](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/mcp.ts#L696-L732)

桥接注册、共享密钥和检查。

<details>
<summary>查看原文（37行）</summary>

```text
/** Wires the MCP bridge up once the required services are injected, and keeps the bridge key
 *  stable across dsh restarts so a keeper-mode claude that outlived dsh still authenticates.
 *  Under DSH Desktop, new Claude processes are pointed at the bridge's own loopback listener,
 *  which answers on 127.0.0.1 regardless of the browser-access gate Desktop puts on web server
 *  routes. Everywhere else they get the web server route as before, and no listener is started:
 *  a process that outlives a restart can only reconnect to the URL it was started with, and the
 *  web port is the one address that is fixed by configuration. */
export function registerMcpBridge(
  ctx: PluginContext,
  { log, version, relay, mode, keyFile, portFile }: BridgeOptions,
): Promise<McpBridge> {
  // SAFETY: the key symbol is this plugin's own key on globalThis, typed here once
  const g = globalThis as typeof globalThis & { [KEY_REGISTRY]?: string };
  // A key file keeps the bridge key stable across dsh restarts, so a Claude process that outlived
  // dsh (keeper mode) still authenticates against the new bridge.
  const key = (g[KEY_REGISTRY] ??= keyFile ? stableKey(keyFile) : randomUUID());
  const loopPortFile =
    portFile === null
      ? undefined
      : (portFile ?? (keyFile ? join(dirname(keyFile), "mcp-port") : undefined));
  return new Promise((resolve, reject) => {
    ctx.inject?.(
      ["webServer", "tools", "agents", "sessions", "sessionController", "workspaceRegistry"],
      // The body runs async (the loopback listen) but inject takes a sync callback.
      (host) =>
        void (async () => {
          const { webServer, tools, agents, sessions, sessionController, workspaceRegistry } = host;
          if (!webServer || !tools || !sessionController) return;
          const openHost: OpenHost = { sessions, workspaceRegistry, sessionController };
          const serve = async (req: IncomingMessage, res: ServerResponse) => {
            if (req.headers[KEY_HEADER] !== key) return send(res, 403, { error: "forbidden" });
            if (req.method !== "POST") return send(res, 405, { error: "POST only" });
            const sessionId = decodeURIComponent(
              (req.url ?? "").slice(MCP_PATH.length + 1).split("?")[0] ?? "",
            );
            const agent = agents.get(asSessionId(sessionId));
            if (!agent) return send(res, 404, { error: `no live agent for session ${sessionId}` });
```

</details>

#### 缺口

- 未验证真实远端工作区、代理、工具与凭据最小化
  **影响**：SSH 不进入首次采用范围
  **进一步探讨**：用隔离账号检查缺 cwd、路由和用量请求流向

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么结果能把观察改为试用？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

优先对照直接使用 Claude Code。隔离工作区先用同一公开、只读任务在两种入口完成两轮对话，量化到可核对结果的时间、审批步骤、异常恢复人工时间和进程清理。成本包括 Claude Code 运行条件、网络、持久会话和处理恢复状态。先核对审批缺失与恢复；SSH、用量同步、桥接工具各自单独验收。发生越界写入、未预期的审批通过或重复执行就停止 DSH Adapter，并在原 CLI 核对会话和工件。

一个未验证方向是将 keeper 重接状态与有副作用工具的独立执行回执并列展示，未见回执时明确结果未知。通过中断工具写入和丢输出行对照当前 UI，观察是否减少盲目续跑。如果对结果未知的识别率不提高，或正常恢复频繁被阻断，则放弃或只应用到有副作用工具。

#### 证据与依据

**依据 1 · 源码核查**：[src/keeper.ts:247-265](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/keeper.ts#L247-L265)

回放与丢弃是恢复状态对照。

<details>
<summary>查看原文（19行）</summary>

```text
      if (msg.t === "hello") {
        clientAcks = msg.acks === true;
        sock.write(
          `${JSON.stringify({ t: "hello", pid: process.pid, claudePid: child.pid, buffered: buffer.length + unacked.size, dropped })}\n`,
        );
        if (dropped > 0)
          sock.write(
            `${JSON.stringify({ t: "err", line: `keeper: ${dropped} output lines dropped while detached` })}\n`,
          );
        // What no turn used yet (sent to the client before, or waiting while detached), then the
        // rest. A client without acks takes them as delivered.
        for (const l of unacked.values()) sock.write(l);
        if (!clientAcks) unacked.clear();
        for (const l of buffer) sock.write(l);
        buffer.length = 0;
        dropped = 0;
        if (exit) sock.write(`${JSON.stringify({ t: "exit", ...exit })}\n`);
      } else if (msg.t === "ack" && typeof msg.n === "number") {
        if (client === sock) unacked.delete(msg.n);
```

</details>

**依据 2 · 源码核查**：[src/adapter/class.ts:6798-6825](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/adapter/class.ts#L6798-L6825)

权限策略的试验基线。

<details>
<summary>查看原文（28行）</summary>

```text
    if (accessMode === "danger-full-access") return allowResult(toolUseId, input);
    const approval = this.ctx?.approval;
    if (!approval || !agent)
      return denyResult(toolUseId, "dsh approval is unavailable for this session");
    let outcome: ApprovalOutcome;
    try {
      outcome = await approval.request({
        agent,
        toolName,
        // dsh's ACP bridge (DSH Desktop) answers only a request that names its tool call; without
        // it the waterfall falls through and every ask settles "unavailable" in a millisecond (#202).
        callId: toolUseId,
        reason: permissionReason(toolName, input, request),
        signal,
      });
    } catch (error) {
      return denyResult(toolUseId, `approval failed: ${errorText(error)}`);
    }
    // What this request would have taken as a rule, for the Tune tab's chips. Kept in memory only:
    // it is a prompt, not a record, and a restart is allowed to forget it.
    const sessionId = agent.session?.id;
    if (sessionId !== undefined) {
      const rule = suggestRule(toolName, input);
      const asks = this.permissionAsks.get(sessionId)?.filter((r) => r !== rule) ?? [];
      asks.push(rule);
      this.permissionAsks.set(sessionId, asks.slice(-ASK_SUGGESTIONS));
    }
    if (outcome === "allowed-once") return allowResult(toolUseId, input);
```

</details>

**依据 3 · 源码核查**：[src/process.ts:651-663](https://github.com/lcestou/dsh-oh-my-claude/blob/2a7fb8922a557e338040ebcad2d3bd652447dd53/src/process.ts#L651-L663)

意外目录的退出判据。

<details>
<summary>查看原文（13行）</summary>

```text
export function sshInvocation(
  host: string,
  command: string,
  args: string[],
  cwd: string,
  far?: FarEnv,
  base: NodeJS.ProcessEnv = process.env,
) {
  const envPairs = [...forwardedEnv(base), ...Object.entries(CHILD_ENV), ...farEnvPairs(far)];
  const env = envPairs.map(([key, val]) => `${key}=${shq(val)}`).join(" ");
  const remote = [command, ...args].map(shq).join(" ");
  const script = `cd ${shq(cwd)} 2>/dev/null || cd "$HOME"; exec env ${env} ${remote}`;
  return { command: "ssh", args: sshArgs(host, script) };
```

</details>

#### 缺口

- 缺少真实执行对照和恢复证据
  **影响**：保留观察
  **进一步探讨**：完成隔离正常与故障测试后重新评价

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
