# WeSight

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c913cd9](https://github.com/freestylefly/wesight/tree/c913cd94f1dc2559b43c55ab7ce378a20b5d96ff)

<!-- BEGIN META -->
[![GitHub ★ 961](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=961&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/freestylefly/wesight)
<!-- END META -->

> **功能**：为多种本地编码Agent提供桌面聊天、文件变化、配置与运行指标工作区。

> **亮点**：把CLI配置、图形会话、文件变化与指标集中到桌面，贡献在工作流整合，推理和工具执行仍由各引擎承担。[Q01](#research-q01)

> **主要限制**：统一界面不等于统一权限、取消或恢复语义；本次Codex路径显式传权限参数，也不能证明其他引擎和IM入口同等约束。[Q02](#research-q02)

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
  - [Q01 · 统一桌面工作区对本地Agent用户具体增加什么？](#detail-section-11)
  - [Q02 · Codex适配器怎样恢复会话并设置权限？](#detail-section-12)
  - [Q03 · 谁值得为桌面整合承担维护负担？](#detail-section-13)
  - [Q04 · 适配层值得复用什么，怎样判断统一UI是否掩盖差异？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要在多个本地编码CLI间切换并查看文件和任务状态的开发者。

终端CLI加编辑器和现有会话管理；只有多引擎、文件与指标切换摩擦足够明显时才可能值得整合。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Codex会话启动/恢复 | 在桌面继续本地编码任务 | 依赖兼容app-server |
| 权限参数传递 | 交宿主处理审批与workspace-write | 非WeSight自建沙箱证明 |
| 多引擎操作界面 | 集中配置和观察 | 不能推定各引擎语义等价 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持平台与桌面包 | 桌面入口必需 | Electron工作区 | Windows签名边界需按发行说明检查 |
| 目标CLI、登录状态与相应协议 | 运行所选引擎必需 | 真正执行任务 | UI存在不等于CLI可用 |
| 模型账户和网络 | 对应调用必需 | 模型服务 | 需用户维护授权与预算 |
| Node 24 | 源码开发必需 | 开发构建 | 非已下载发行版的统一前置要求 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户选择平台发行包并备份CLI配置 | 核对来源、校验和及配置模式 |
| 2 | 检测一条已有CLI与账号 | 确认真实版本和工作目录 |
| 3 | 副本仓库完成小任务与一次中断恢复 | 检查文件和会话状态后决定继续 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 桌面包与本地运行资源 | 多CLI检测、模型与权限配置 | 未测设置耗时 |
| 持续使用 | Electron与引擎进程、模型调用 | 更新协议适配、核对文件结果 | 指标并非合格交付证明 |
| 失败恢复 | 重发可能追加调用 | 查stderr、原thread和文件状态 | 不应盲目重复有副作用任务 |
| 退出 | 保留本地仓库与原CLI | 备份会话、恢复所选配置 | 跨引擎完整迁移未测 |

已有多CLI工作流的开发者可先只接一个已有引擎试用。若切换和观察便利不能抵消资源与配置维护，或团队要求跨引擎完全一致审批，退回原CLI和编辑器。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话恢复 | Codex协议带threadId与权限参数 | 各引擎等价恢复 |
| 进程诊断 | stderr及socket超时 | 故障后无重复副作用 |
| 集中操作 | README与适配入口 | 端到端节时与资源占用 |

> **思考**：统一界面不等于统一权限、取消或恢复语义；本次Codex路径显式传权限参数，也不能证明其他引擎和IM入口同等约束。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把CLI配置、图形会话、文件变化与指标集中到桌面，贡献在工作流整合，推理和工具执行仍由各引擎承担。[Q01](#research-q01)

适配器把引擎协议映射为共同会话事件，声明命令、文件、token及审批等事件名称；客户端保留有限stderr并对socket等待设上限。这种把进程连接与展示事件分开的方式可借鉴，但预发布app-server方法和字段需持续维护。

<a id="detail-section-5"></a>

### 1.4 主要限制

统一界面不等于统一权限、取消或恢复语义；本次Codex路径显式传权限参数，也不能证明其他引擎和IM入口同等约束。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

已有多CLI需求的开发者可先用一个已有引擎在副本仓库试用，核对权限、文件与中断状态；若配置资源负担高于切换便利，或要求各引擎同等审批而未证实，就退回原CLI与编辑器。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

Codex局部协议与权限参数已检查；全部引擎一致性、桌面发行兼容和效率未实测。

- 已检查：作者 README、包清单、源码路径 README.md、src/main/libs/agentEngine/codexAppRuntimeAdapter.ts、src/main/libs/codexAppServerClient.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查README、Codex适配器和app-server连接；未审计所有Agent、IM、内置技能和自动任务。
- 下一步：以同一副本仓库分别验证只读、写入、联网审批和中断恢复，比较原CLI与桌面所用人工时间。

**分析版本**

- **仓库**：[freestylefly/wesight](https://github.com/freestylefly/wesight)
- **版本号**：1.0.9（[固定提交 c913cd9](https://github.com/freestylefly/wesight/tree/c913cd94f1dc2559b43c55ab7ce378a20b5d96ff)）
- **版本日期**：2026-10-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

按固定引擎版本保存并展示能力契约，仅开放已验证的恢复与审批操作，比较误操作和排障时间；尚未验证。[Q04](#research-q04)

以同一副本仓库分别验证只读、写入、联网审批和中断恢复，比较原CLI与桌面所用人工时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 107 | 21458 | — | — | 110858 |
| .mjs | source | 4 | 823 | 720 | 37 | — |
| .ts | source | 272 | 102793 | 87782 | 6100 | — |
| .js | source | 32 | 10016 | 7730 | 1110 | — |
| .cjs | source | 26 | 4842 | 3809 | 420 | — |
| .ts | test | 84 | 11262 | 9873 | 317 | — |
| .tsx | source | 141 | 43659 | 40014 | 1082 | — |
| .md | example | 1 | 375 | — | — | 977 |
| .md | test | 14 | 3845 | — | — | 25073 |
| .mjs | test | 21 | 4187 | 3472 | 174 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/freestylefly/wesight/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/freestylefly/wesight/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/freestylefly/wesight/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：桌面统一入口能否降低多CLI切换与监控负担，权限与恢复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 统一桌面工作区对本地Agent用户具体增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合已经在多种CLI间切换、需要在同一界面查看会话、文件变化和运行指标的开发者。合格交付仍是原引擎生成的代码与可检查结果，不是仪表盘上出现完成状态。相较终端加编辑器，WeSight将安装检测、模型设置、权限提示和文件视图集中，减少上下文切换；模型推理与执行能力属于所接引擎，不能算桌面壳新算法。

只用一种CLI且已有稳定编辑器集成的人，额外Electron和运行时维护未必划算。README还区分使用本地CLI原配置与WeSight管理模型设置，不能将统一选择器理解为所有引擎配置和权限完全等价。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-46](https://github.com/freestylefly/wesight/blob/c913cd94f1dc2559b43c55ab7ce378a20b5d96ff/README.md#L24-L46)

作者说明桌面控制台定位和集中流程。

<details>
<summary>查看原文（23行）</summary>

```text
WeSight is an open-source desktop control console for local AI agents. It helps you install or reuse Claude Code, Codex, Kimi Code, OpenClaw, Hermes Agent, OpenCode, Qwen Code, DeepSeek-TUI, and the built-in agent runtime, then gives them a visual workspace for chat, tools, files, IM channels, skills, model providers, runtime metrics, and desktop companion workflows.

> Public releases ship signed and notarized macOS builds for Apple Silicon and Intel, plus a Windows x64 installer. If WeSight helps your agent workflow, a Star makes the project easier for more builders to discover.

## Quick Links

- Website: [wesight.ai](https://wesight.ai/)
- Latest release: [github.com/freestylefly/wesight/releases/latest](https://github.com/freestylefly/wesight/releases/latest)
- Screenshots: [Screenshots](#screenshots)
- Core features: [Core Features](#core-features)
- Agent engines: [Agent Engines](#agent-engines)
- Product roadmap: [Product Roadmap](https://github.com/users/freestylefly/projects/1)
- Development: [Quick Start](#quick-start)

## Why WeSight

Terminal-native coding agents are powerful, while their setup, model routing, permissions, IM entry points, file changes, and runtime metrics often live in separate places. WeSight turns those moving pieces into one desktop workspace:

- Install, detect, and reuse local agent CLIs from a beginner-friendly UI.
- Run coding agents through a visual chat with tool panels, slash commands, file diffs, and permission prompts.
- Connect agent tasks to IM channels such as Feishu, with per-engine configuration.
- Track every task with engine, model, token usage, TTFT, TPS, tool latency, steps, status, and duration.
- Extend workflows through SkillHub skills, built-in skills, scheduled tasks, memory, and a desktop pet that follows active work.
```

</details>

**依据 2 · 作者声明**：[README.md:127-135](https://github.com/freestylefly/wesight/blob/c913cd94f1dc2559b43c55ab7ce378a20b5d96ff/README.md#L127-L135)

管理配置和本地CLI配置是不同模式。

```text
## Model Providers

WeSight keeps model setup in one place, then maps it into the selected engine when that engine follows WeSight settings.

- Add multiple providers and models.
- Use official OpenAI, Anthropic Claude, and Google Gemini providers.
- Add OpenAI-compatible providers for DeepSeek, Qwen, Moonshot, Ollama, OpenRouter, GitHub Copilot, local gateways, or private endpoints.
- Switch between WeSight-managed model settings and existing local CLI configuration.
- Import or sync local engine configuration when you want WeSight to manage it.
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Codex适配器怎样恢复会话并设置权限？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

抽查Codex路径，适配器有thread/start、thread/resume与turn/start等JSON-RPC方法；恢复与新建都传on-request、user reviewer、workspace-write。turn/start进一步传workspaceWrite、networkAccess=false。宿主权限决定仍依赖所接app-server正确消费这些参数，不代表WeSight自己实现文件沙箱。

客户端尝试连接本地socket，不成功则启动已检测CLI的app-server并等待socket，超时会带stderr尾部报错。socket等待超时只表示连接准备没有完成，不能据此推断turn已被发送。另查子进程协议sendRequest路径，先设置响应计时器再writeMessage；响应超时只删除pending记录并reject，未在该分支发送撤销。因此仅当turn/start已写出而响应未知时，应先核对thread、turn及文件状态，再决定是否重发写操作，不能将此风险归因于socket启动等待。本次没有检查全部引擎或IM适配，不能宣称统一UI带来统一安全和取消语义。

#### 证据与依据

**依据 1 · 源码核查**：[src/main/libs/agentEngine/codexAppRuntimeAdapter.ts:27-52](https://github.com/freestylefly/wesight/blob/c913cd94f1dc2559b43c55ab7ce378a20b5d96ff/src/main/libs/agentEngine/codexAppRuntimeAdapter.ts#L27-L52)

协议方法包括会话、turn、审批与错误。

<details>
<summary>查看原文（26行）</summary>

```text
const JsonRpcMethod = {
  Initialize: 'initialize',
  Initialized: 'initialized',
  ThreadStart: 'thread/start',
  ThreadResume: 'thread/resume',
  TurnStart: 'turn/start',
  TurnInterrupt: 'turn/interrupt',
  ThreadStarted: 'thread/started',
  TurnStarted: 'turn/started',
  TurnCompleted: 'turn/completed',
  AgentMessageDelta: 'item/agentMessage/delta',
  PlanDelta: 'item/plan/delta',
  ReasoningSummaryDelta: 'item/reasoning/summaryTextDelta',
  ItemStarted: 'item/started',
  ItemCompleted: 'item/completed',
  CommandOutputDelta: 'item/commandExecution/outputDelta',
  FileChangePatchUpdated: 'item/fileChange/patchUpdated',
  TurnDiffUpdated: 'turn/diff/updated',
  TokenUsageUpdated: 'thread/tokenUsage/updated',
  CommandApproval: 'item/commandExecution/requestApproval',
  FileChangeApproval: 'item/fileChange/requestApproval',
  PermissionApproval: 'item/permissions/requestApproval',
  ToolUserInput: 'item/tool/requestUserInput',
  LegacyExecApproval: 'execCommandApproval',
  LegacyApplyPatchApproval: 'applyPatchApproval',
  Error: 'error',
```

</details>

**依据 2 · 源码核查**：[src/main/libs/agentEngine/codexAppRuntimeAdapter.ts:434-485](https://github.com/freestylefly/wesight/blob/c913cd94f1dc2559b43c55ab7ce378a20b5d96ff/src/main/libs/agentEngine/codexAppRuntimeAdapter.ts#L434-L485)

启动/恢复显式权限参数，turn禁网络。

<details>
<summary>查看原文（52行）</summary>

```text
    const systemPrompt = options.systemPrompt?.trim() || this.store.getSession(active.sessionId)?.systemPrompt?.trim() || '';
    if (active.appThreadId) {
      const resumed = await this.sendRequest(active, JsonRpcMethod.ThreadResume, {
        threadId: active.appThreadId,
        cwd,
        approvalPolicy: 'on-request',
        approvalsReviewer: 'user',
        sandbox: 'workspace-write',
        developerInstructions: systemPrompt || null,
      });
      this.captureThreadResult(active, resumed);
    } else {
      const started = await this.sendRequest(active, JsonRpcMethod.ThreadStart, {
        cwd,
        approvalPolicy: 'on-request',
        approvalsReviewer: 'user',
        sandbox: 'workspace-write',
        developerInstructions: systemPrompt || null,
        threadSource: 'user',
      });
      this.captureThreadResult(active, started);
    }

    if (!active.appThreadId) {
      throw new Error('Codex App did not return a thread id.');
    }

    active.turnStartTimer = setTimeout(() => {
      if (active.appTurnId || active.completed || active.stopped) return;
      this.handleError(active.sessionId, 'Codex App turn did not start in time.');
      this.cleanupActiveSession(active);
    }, TURN_START_TIMEOUT_MS);

    await this.sendRequest(active, JsonRpcMethod.TurnStart, {
      threadId: active.appThreadId,
      input: [
        {
          type: 'text',
          text: prompt,
          textElements: [],
        },
      ],
      cwd,
      approvalPolicy: 'on-request',
      approvalsReviewer: 'user',
      sandboxPolicy: {
        type: 'workspaceWrite',
        writableRoots: [],
        networkAccess: false,
        excludeTmpdirEnvVar: false,
        excludeSlashTmp: false,
      },
```

</details>

**依据 3 · 源码核查**：[src/main/libs/codexAppServerClient.ts:190-209](https://github.com/freestylefly/wesight/blob/c913cd94f1dc2559b43c55ab7ce378a20b5d96ff/src/main/libs/codexAppServerClient.ts#L190-L209)

连接失败后启动本地app-server。

<details>
<summary>查看原文（20行）</summary>

```text
      await this.openWebSocket();
    } catch {
      this.startServerProcess(status.cliPath, cwd);
      await this.waitForSocketFile();
      await this.openWebSocket();
    }

    await this.initializeProtocol();
  }

  private startServerProcess(cliPath: string, cwd?: string): void {
    if (this.serverProcess && !this.serverProcess.killed) return;

    const processCwd = cwd?.trim() && fs.existsSync(cwd) ? cwd : os.homedir();
    const child = spawn(cliPath, ['app-server', '--listen', 'unix://'], {
      cwd: processCwd,
      env: process.env,
      stdio: ['ignore', 'ignore', 'pipe'],
      windowsHide: process.platform === 'win32',
    });
```

</details>

**依据 4 · 源码核查**：[src/main/libs/codexAppServerClient.ts:240-254](https://github.com/freestylefly/wesight/blob/c913cd94f1dc2559b43c55ab7ce378a20b5d96ff/src/main/libs/codexAppServerClient.ts#L240-L254)

有界等待socket并保留stderr。

<details>
<summary>查看原文（15行）</summary>

```text
  private async waitForSocketFile(): Promise<void> {
    const deadline = Date.now() + SERVER_START_TIMEOUT_MS;
    while (Date.now() < deadline) {
      try {
        if (fs.statSync(this.socketPath).isSocket()) return;
      } catch {
        // Wait until the app-server creates the control socket.
      }
      await sleep(200);
    }

    const stderr = this.stderrTail.trim();
    throw new Error(stderr
      ? `Codex App app-server did not create its socket in time.\n\n${stderr}`
      : 'Codex App app-server did not create its socket in time.');
```

</details>

**依据 5 · 源码核查**：[src/main/libs/agentEngine/codexAppRuntimeAdapter.ts:489-532](https://github.com/freestylefly/wesight/blob/c913cd94f1dc2559b43c55ab7ce378a20b5d96ff/src/main/libs/agentEngine/codexAppRuntimeAdapter.ts#L489-L532)

子进程协议路径发送后等待响应，超时删除pending并拒绝，无该分支撤销。

<details>
<summary>查看原文（44行）</summary>

```text
  private sendRequest(
    active: ActiveCodexAppSession,
    method: string,
    params: unknown,
    timeoutMs = 60_000,
  ): Promise<unknown> {
    if (active.stopped) {
      return Promise.reject(new Error('Codex App session was stopped.'));
    }
    if (!active.child) {
      return this.client.sendRequest(method, params, timeoutMs);
    }
    const id = active.requestSeq;
    active.requestSeq += 1;
    const message = { id, method, params };
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        active.pendingRequests.delete(id);
        reject(new Error(`Codex App request timed out: ${method}`));
      }, timeoutMs);
      active.pendingRequests.set(id, { resolve, reject, timer });
      this.writeMessage(active, message);
    });
  }

  private sendNotification(active: ActiveCodexAppSession, method: string, params: unknown): void {
    if (!active.child) {
      this.client.sendNotification(method, params);
      return;
    }
    this.writeMessage(active, { method, params });
  }

  private sendResponse(active: ActiveCodexAppSession, id: JsonRpcId, result: unknown): void {
    if (!active.child) {
      this.client.sendResponse(id, result);
      return;
    }
    this.writeMessage(active, { id, result });
  }

  private writeMessage(active: ActiveCodexAppSession, message: unknown): void {
    if (!active.child) return;
    active.child.stdin.write(`${JSON.stringify(message)}\n`);
```

</details>

#### 缺口

- 全部引擎和IM通道的审批、取消与重复提交语义未逐一核对。
  **影响**：不能把一条Codex链路推广为所有引擎同等控制。
  **进一步探讨**：固定各引擎版本，用相同只读、写入、需联网及中断恢复任务记录实际权限和状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 谁值得为桌面整合承担维护负担？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持平台与桌面包 | 桌面入口必需 | Electron工作区 | Windows签名边界需按发行说明检查 |
| 目标CLI、登录状态与相应协议 | 运行所选引擎必需 | 真正执行任务 | UI存在不等于CLI可用 |
| 模型账户和网络 | 对应调用必需 | 模型服务 | 需用户维护授权与预算 |
| Node 24 | 源码开发必需 | 开发构建 | 非已下载发行版的统一前置要求 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户选择平台发行包并备份CLI配置 | 核对来源、校验和及配置模式 |
| 2 | 检测一条已有CLI与账号 | 确认真实版本和工作目录 |
| 3 | 副本仓库完成小任务与一次中断恢复 | 检查文件和会话状态后决定继续 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 桌面包与本地运行资源 | 多CLI检测、模型与权限配置 | 未测设置耗时 |
| 持续使用 | Electron与引擎进程、模型调用 | 更新协议适配、核对文件结果 | 指标并非合格交付证明 |
| 失败恢复 | 重发可能追加调用 | 查stderr、原thread和文件状态 | 不应盲目重复有副作用任务 |
| 退出 | 保留本地仓库与原CLI | 备份会话、恢复所选配置 | 跨引擎完整迁移未测 |

已有多CLI工作流的开发者可先只接一个已有引擎试用。若切换和观察便利不能抵消资源与配置维护，或团队要求跨引擎完全一致审批，退回原CLI和编辑器。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:139-164](https://github.com/freestylefly/wesight/blob/c913cd94f1dc2559b43c55ab7ce378a20b5d96ff/README.md#L139-L164)

发行平台、签名/校验和及开发Node要求。

<details>
<summary>查看原文（26行）</summary>

```text
Public desktop builds are published through GitHub Releases:

- Website: [wesight.ai](https://wesight.ai/)
- Latest release: [github.com/freestylefly/wesight/releases/latest](https://github.com/freestylefly/wesight/releases/latest)

Each stable release includes signed and notarized macOS Apple Silicon and Intel builds, a Windows x64 installer, update metadata, and SHA256 checksums. The Windows installer is currently unsigned and may trigger Microsoft Defender SmartScreen. CI artifacts are short-lived build outputs for maintainers to test before a release is published.

## Download And Install

### macOS

Download the matching DMG from the [latest release](https://github.com/freestylefly/wesight/releases/latest): `WeSight.<version>.mac.arm64.dmg` for Apple Silicon or `WeSight.<version>.mac.x64.dmg` for Intel. The release workflow signs, notarizes, and staples both packages. Open the DMG and drag `WeSight.app` into the `Applications` folder.

<p align="center">
  <img src="public/readme/tutorial/install-dmg.svg" alt="WeSight DMG install guide" width="760">
</p>

### Windows

Download `WeSight.Setup.<version>.exe` from the same release. The current Windows x64 installer has no code-signing certificate, so SmartScreen may show an unrecognized app warning. Check the file against `SHASUMS256.txt` before continuing.

## Quick Start

### Requirements

- Node.js `>=24 <25`
```

</details>

**依据 2 · 作者声明**：[README.md:127-135](https://github.com/freestylefly/wesight/blob/c913cd94f1dc2559b43c55ab7ce378a20b5d96ff/README.md#L127-L135)

模型配置管理责任。

```text
## Model Providers

WeSight keeps model setup in one place, then maps it into the selected engine when that engine follows WeSight settings.

- Add multiple providers and models.
- Use official OpenAI, Anthropic Claude, and Google Gemini providers.
- Add OpenAI-compatible providers for DeepSeek, Qwen, Moonshot, Ollama, OpenRouter, GitHub Copilot, local gateways, or private endpoints.
- Switch between WeSight-managed model settings and existing local CLI configuration.
- Import or sync local engine configuration when you want WeSight to manage it.
```

**依据 3 · 源码核查**：[src/main/libs/codexAppServerClient.ts:228-254](https://github.com/freestylefly/wesight/blob/c913cd94f1dc2559b43c55ab7ce378a20b5d96ff/src/main/libs/codexAppServerClient.ts#L228-L254)

错误和启动超时的恢复线索。

<details>
<summary>查看原文（27行）</summary>

```text
    child.on('error', (error) => {
      this.lastError = error.message;
    });
    child.on('close', (code, signal) => {
      if (this.serverProcess !== child) return;
      this.serverProcess = null;
      if (this.socket && !this.socket.destroyed) return;
      const suffix = signal ? ` (${signal})` : '';
      this.lastError = `Codex App app-server exited with code ${code ?? 'unknown'}${suffix}.`;
    });
  }

  private async waitForSocketFile(): Promise<void> {
    const deadline = Date.now() + SERVER_START_TIMEOUT_MS;
    while (Date.now() < deadline) {
      try {
        if (fs.statSync(this.socketPath).isSocket()) return;
      } catch {
        // Wait until the app-server creates the control socket.
      }
      await sleep(200);
    }

    const stderr = this.stderrTail.trim();
    throw new Error(stderr
      ? `Codex App app-server did not create its socket in time.\n\n${stderr}`
      : 'Codex App app-server did not create its socket in time.');
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 适配层值得复用什么，怎样判断统一UI是否掩盖差异？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

适配器把引擎协议映射为共同会话事件，声明命令、文件、token及审批等事件名称；客户端保留有限stderr并对socket等待设上限。这种把进程连接与展示事件分开的方式可借鉴，但预发布app-server方法和字段需持续维护。

未验证假设是为每引擎保存一份可执行的能力契约及最近验证结果，UI只在特定引擎支持并验证后显示恢复、联网或审批选项。最小对照用同一副本仓库比较当前统一按钮与按能力显示的按钮，观察失败恢复误操作和手工排障时间。若差异已由现有入口正确表达，就不新增重复层；若契约版本难以跟随更新，应只标明未经验证，不暗示等价。

#### 证据与依据

**依据 1 · 源码核查**：[src/main/libs/agentEngine/codexAppRuntimeAdapter.ts:27-64](https://github.com/freestylefly/wesight/blob/c913cd94f1dc2559b43c55ab7ce378a20b5d96ff/src/main/libs/agentEngine/codexAppRuntimeAdapter.ts#L27-L64)

明确多种事件类型的适配协议。

<details>
<summary>查看原文（38行）</summary>

```text
const JsonRpcMethod = {
  Initialize: 'initialize',
  Initialized: 'initialized',
  ThreadStart: 'thread/start',
  ThreadResume: 'thread/resume',
  TurnStart: 'turn/start',
  TurnInterrupt: 'turn/interrupt',
  ThreadStarted: 'thread/started',
  TurnStarted: 'turn/started',
  TurnCompleted: 'turn/completed',
  AgentMessageDelta: 'item/agentMessage/delta',
  PlanDelta: 'item/plan/delta',
  ReasoningSummaryDelta: 'item/reasoning/summaryTextDelta',
  ItemStarted: 'item/started',
  ItemCompleted: 'item/completed',
  CommandOutputDelta: 'item/commandExecution/outputDelta',
  FileChangePatchUpdated: 'item/fileChange/patchUpdated',
  TurnDiffUpdated: 'turn/diff/updated',
  TokenUsageUpdated: 'thread/tokenUsage/updated',
  CommandApproval: 'item/commandExecution/requestApproval',
  FileChangeApproval: 'item/fileChange/requestApproval',
  PermissionApproval: 'item/permissions/requestApproval',
  ToolUserInput: 'item/tool/requestUserInput',
  LegacyExecApproval: 'execCommandApproval',
  LegacyApplyPatchApproval: 'applyPatchApproval',
  Error: 'error',
} as const;

const ThreadItemType = {
  AgentMessage: 'agentMessage',
  CommandExecution: 'commandExecution',
  FileChange: 'fileChange',
  McpToolCall: 'mcpToolCall',
  DynamicToolCall: 'dynamicToolCall',
  Plan: 'plan',
  Reasoning: 'reasoning',
  ImageGeneration: 'imageGeneration',
} as const;
```

</details>

**依据 2 · 源码核查**：[src/main/libs/agentEngine/codexAppRuntimeAdapter.ts:66-70](https://github.com/freestylefly/wesight/blob/c913cd94f1dc2559b43c55ab7ce378a20b5d96ff/src/main/libs/agentEngine/codexAppRuntimeAdapter.ts#L66-L70)

对缓存和启动等待设上限。

```text
const STREAMING_TEXT_MAX_CHARS = 120_000;
const STDERR_TAIL_MAX_CHARS = 24_000;
const CONTENT_TRUNCATED_HINT = '\n...[truncated to prevent memory pressure]';
const APP_SERVER_STARTUP_TIMEOUT_MS = 30_000;
const TURN_START_TIMEOUT_MS = 30_000;
```

**依据 3 · 源码核查**：[src/main/libs/codexAppServerClient.ts:211-254](https://github.com/freestylefly/wesight/blob/c913cd94f1dc2559b43c55ab7ce378a20b5d96ff/src/main/libs/codexAppServerClient.ts#L211-L254)

进程错误、stderr及socket等待分离。

<details>
<summary>查看原文（44行）</summary>

```text
    this.serverProcess = child;
    child.stderr.on('data', (chunk: Buffer) => {
      // On Chinese Windows, the app-server process may output text in the
      // system's active code page (e.g. GBK/936) instead of UTF-8.  Try UTF-8
      // first; if the result contains replacement characters (U+FFFD), fall
      // back to GBK decoding via iconv-lite.
      let text = chunk.toString('utf8');
      if (process.platform === 'win32' && text.includes('\uFFFD')) {
        try {
          const gbk = iconv.decode(chunk, 'cp936');
          if (!gbk.includes('\uFFFD')) text = gbk;
        } catch {
          // iconv-lite decode failed; keep the UTF-8 attempt
        }
      }
      this.stderrTail = `${this.stderrTail}${text}`.slice(-12_000);
    });
    child.on('error', (error) => {
      this.lastError = error.message;
    });
    child.on('close', (code, signal) => {
      if (this.serverProcess !== child) return;
      this.serverProcess = null;
      if (this.socket && !this.socket.destroyed) return;
      const suffix = signal ? ` (${signal})` : '';
      this.lastError = `Codex App app-server exited with code ${code ?? 'unknown'}${suffix}.`;
    });
  }

  private async waitForSocketFile(): Promise<void> {
    const deadline = Date.now() + SERVER_START_TIMEOUT_MS;
    while (Date.now() < deadline) {
      try {
        if (fs.statSync(this.socketPath).isSocket()) return;
      } catch {
        // Wait until the app-server creates the control socket.
      }
      await sleep(200);
    }

    const stderr = this.stderrTail.trim();
    throw new Error(stderr
      ? `Codex App app-server did not create its socket in time.\n\n${stderr}`
      : 'Codex App app-server did not create its socket in time.');
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
