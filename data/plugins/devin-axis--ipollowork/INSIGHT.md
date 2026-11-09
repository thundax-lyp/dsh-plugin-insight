# iPolloWork

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2e3886a](https://github.com/Devin-AXIS/iPolloWork/tree/2e3886a031b78df46e2ee1820bfba9de8cede9b5)

<!-- BEGIN META -->
[![GitHub ★ 7,427](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7%2C427&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Devin-AXIS/iPolloWork)
<!-- END META -->

> **功能**：本地优先的多引擎 Agent 工作台，用于组织项目、任务、插件与可编辑产物，并接入 DeepSeek Harness。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，工作台复用原生 DSH 的会话执行，同时提供项目绑定和消息投影，减少了在原生引擎与任务记录之间的手工转移。

> **主要限制**：[Q03](#research-q03) 显示，订阅取消、会话取消、进程停止和文件交付分别有不同入口。历史终态也未按明确的 turn 标识验证产物，不宜将界面 done 当作验收完成。

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
  - [Q01 · 谁需要工作台接管 DSH 会话，增量在哪？](#detail-section-11)
  - [Q02 · 工作区和会话如何进入 DSH，并映射到用户界面？](#detail-section-12)
  - [Q03 · 关闭订阅、终止推理和切工作区的边界是什么？](#detail-section-13)
  - [Q04 · 怎样验收一个可回退的项目任务？](#detail-section-14)
  - [Q05 · 能否用原生终态与产物状态减少误认完成？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在同一项目管理多个 Agent 会话的团队，可以从工作台进入 DSH 运行时，关联进度和产物。

继续使用原生 DSH，通过项目任务板手工记录会话与输出。仅单一引擎、低频协作时新增工作台的增量有限。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| DSH 会话入口 | 在项目里运行原生会话 | 需要兼容运行时、凭据和正确绑定 |
| 会话事件 | 在工作台查看生成和状态 | 取消订阅不等于取消生成 |
| 待答交互 | 对原生审批和问题回应 | 依赖运行时保存的待答项 |
| 状态投影 | 将原生历史映射为任务进度 | 终态不证明文件交付 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| iPolloWork 工作台与项目服务 | 必需 | 管理会话与工作区 | 回到原生工作流 |
| 可用 DSH Web 运行时 | DSH 模式必需 | 推理会话与控制接口 | 启动或调用不可用 |
| 允许使用的模型凭据 | 模型任务必需 | 执行生成 | 模型不可用或拒绝 |
| 可独立核对的项目文件 | 产物验收需要 | 核实实际写入和退出 | 不扩大试点 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 建立副本 | 项目用户准备独立项目和模型 | 确认实际 DSH home 与工作目录 |
| 运行 | 用户从工作台执行公开样例 | 原生会话、事件和文件对应 |
| 复核 | 用户制造断流和显式取消 | 分别核对会话、进程和文件 |
| 退出 | 用户暂停请求，保留副本与日志 | 以原生入口继续并对账 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 工作台、运行时及项目存储 | 核对版本、配置和身份 | 部署耗时未知 |
| 持续使用 | 模型、计算、历史和文件资源 | 复核任务、权限及产物 | 单位任务成本未测 |
| 失败恢复 | 重试及外部工具资源 | 对照原生状态与工作台 | 断线和回执丢失的成本未知 |
| 退出 | 项目副本及历史留存 | 回到原生入口并对账 | 不保证自动撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 项目接入 | 绑定工作区和 DSH 运行时 | 宿主环境实际兼容 |
| 会话协作 | prompt、事件和待答映射 | 多窗口与断线恢复效果 |
| 任务终态 | 轮询历史并投影状态 | 实际产物正确性和节时 |

> **思考**：[Q03](#research-q03) 显示，订阅取消、会话取消、进程停止和文件交付分别有不同入口。历史终态也未按明确的 turn 标识验证产物，不宜将界面 done 当作验收完成。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，工作台复用原生 DSH 的会话执行，同时提供项目绑定和消息投影，减少了在原生引擎与任务记录之间的手工转移。

[Q02](#research-q02) 分开了工作区、引擎 cookie 和待答事件关联。[Q03](#research-q03) 的订阅、会话和进程级退出须保持分离，任务状态应能交代自身关联证据。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示，订阅取消、会话取消、进程停止和文件交付分别有不同入口。历史终态也未按明确的 turn 标识验证产物，不宜将界面 done 当作验收完成。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 只用副本项目验证一次工作台会话，并保留原生入口。遇到断流、审批失联或产物与状态不符时暂停发新任务，用原生历史和实际文件核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

项目绑定、原生会话代理及事件映射已有源码支持。实际兼容性与状态错配频率待验证。产物级终态是研究假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、apps/server/src/routes/deepseek-harness.ts、apps/server/src/deepseek-harness-runtime.ts、apps/server/src/workspace-session-runtime.ts、apps/server/src/deepseek-harness-remote.ts、apps/server/src/server.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定根工作台 DSH 路由、运行时、订阅和终态投影。未审计所有桌面页面、其他引擎、创作插件、云服务及权限策略。没有安装或运行。
- 下一步：固定工作台、DSH 和项目版本，使用两个独立副本试一次正常会话、一次跨工作区拒绝和一次订阅中断。比较原生状态、工具结果、产物和手工核对时长。

**分析版本**

- **仓库**：[Devin-AXIS/iPolloWork](https://github.com/Devin-AXIS/iPolloWork)
- **版本号**：0.18.0（[固定提交 2e3886a](https://github.com/Devin-AXIS/iPolloWork/tree/2e3886a031b78df46e2ee1820bfba9de8cede9b5)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出将原生运行、预期文件和核验状态可追溯地绑定，观察能否降低错认完成。

固定工作台、DSH 和项目版本，使用两个独立副本试一次正常会话、一次跨工作区拒绝和一次订阅中断。比较原生状态、工具结果、产物和手工核对时长。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1178 | 169398 | — | — | 1487154 |
| .mjs | source | 510 | 115954 | 107120 | 3868 | — |
| .js | source | 2 | 3895 | 2170 | 447 | — |
| .ts | source | 494 | 142150 | 126785 | 6182 | — |
| .ts | test | 249 | 67355 | 61950 | 1255 | — |
| .tsx | source | 313 | 82634 | 75972 | 1429 | — |
| .tsx | test | 16 | 1636 | 1559 | 60 | — |
| .mjs | test | 35 | 7503 | 6875 | 248 | — |
| .cjs | source | 4 | 434 | 369 | 11 | — |
| .jsx | source | 7 | 797 | 781 | 18 | — |
| .md | example | 195 | 26333 | — | — | 238387 |
| .ts | example | 145 | 26499 | 24845 | 895 | — |
| .mjs | example | 81 | 10579 | 10148 | 273 | — |
| .js | example | 27 | 13054 | 12093 | 664 | — |
| .tsx | example | 45 | 11787 | 11604 | 38 | — |
| .mts | example | 1 | 24 | 22 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 60](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=60&color=737b86&logo=github)](https://github.com/Devin-AXIS/iPolloWork/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Devin-AXIS/iPolloWork/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Devin-AXIS/iPolloWork/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有 DSH 的项目协作者能否用 iPolloWork 统一工作区与会话操作，并能区分工作台投影、引擎执行和实际文件交付？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要工作台接管 DSH 会话，增量在哪？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要在同一项目并行使用多种 Agent 的协作者，可把 DSH 会话映射到工作台记录。相对在原生 DSH 和项目任务板之间手工搬运会话 ID、进度与结果，固定代码提供 workspace 运行时、会话绑定和原生事件的代理。合格结果是工作台打开正确项目、显示同一原生会话，使用者能复核文件和任务状态。根包为独立多包工作台，README 中安装进 DSH Web 的 Design、PPT、Video 是单列扩展。作者的跨引擎编辑愿景不证明当前每个格式都能使用。只用一个 DSH 会话的个人，保留原生入口及手工记录可能更轻。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-29](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/README.md#L23-L29)

作者将项目定位为多引擎项目工作台。

```text
**The enterprise-grade, local-first Agent Workbench for people and agent teams—one workspace for multiple agent engines, one unified system for plugins and Skills, multi-agent projects and tasks, and editable creation across code, documents, presentations, websites, design, and video.**

https://github.com/user-attachments/assets/201b561a-22ec-4c8e-a4e8-f34172cf0aa3

iPolloWork is the unified workspace layer for the next agent-native way of working. It does not split projects or extensions by runtime: teams coordinate agents, tasks, schedules, plugins, Skills, tools, execution, and editable outputs from one control surface. Describe the outcome; agents plan and execute; your team reviews progress, approves actions, and keeps editing the result in the same place.

iPolloWork is not positioned as a replacement for a single coding agent. It connects [Codex](https://github.com/openai/codex), [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), OpenCode, and future agent runtimes through explicit compatibility boundaries while preserving the native strengths of each ecosystem. Coding is only the starting point: when the output is a deck, web page, visual design, or video, it remains editable instead of becoming a finished file or a chat transcript.
```

**依据 2 · 作者声明**：[README.md:45-65](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/README.md#L45-L65)

作者区分工作台 DSH 运行时与独立创作插件。

<details>
<summary>查看原文（21行）</summary>

````text
## Agent runtime compatibility

OpenCode is the default local execution runtime today. [Codex](https://github.com/openai/codex) and [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) are optional peer runtimes with native session and tool adapters. The [`ipollowork-ui-mcp`](https://www.npmjs.com/package/ipollowork-ui-mcp) control surface also lets external clients operate the desktop. These paths share the workbench while preserving each runtime's capabilities.

The collaboration model keeps iPolloWork as the project workspace: a task can delegate bounded work to DSH subagents when useful, then bring structured progress and results back into the same project. Each runtime retains its own agents, Skills, plugins, and execution model.

### Run iPolloWork creative plugins directly in DeepSeek Harness

DeepSeek Harness users can install iPolloWork's native Design, PPT, and Video views into the DSH Web UI and start them from any project directory:

<p>
  <a href="https://www.npmjs.com/package/deepseek-idesign"><img src="https://img.shields.io/npm/v/deepseek-idesign?label=DeepSeek%20Design&amp;logo=npm&amp;color=CB3837" alt="deepseek-idesign npm version" /></a>
  <a href="https://www.npmjs.com/package/deepseek-ivideo"><img src="https://img.shields.io/npm/v/deepseek-ivideo?label=DeepSeek%20Video&amp;logo=npm&amp;color=CB3837" alt="deepseek-ivideo npm version" /></a>
</p>

```bash
npx @deepseek-ai/dsh plugin --profile web add deepseek-idesign deepseek-ippt deepseek-ivideo
npx @deepseek-ai/dsh web
```

Open [http://127.0.0.1:3080](http://127.0.0.1:3080), start a conversation, and choose **Design**, **PPT**, or **Video**. If the `dsh` command is already installed, replace `npx @deepseek-ai/dsh` with `dsh`. DeepSeek Harness is currently a developer preview, so plugin compatibility follows its active release line.
````

</details>

**依据 3 · 源码核查**：[package.json:1-18](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/package.json#L1-L18)

根是私有工作区，桌面构建另有入口。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "@ipollo/ipollowork-workspace",
  "private": true,
  "version": "0.18.0",
  "scripts": {
    "prepare": "lefthook install",
    "setup": "node scripts/ipollowork.mjs setup",
    "dev:cloud": "node scripts/ipollowork.mjs dev:cloud",
    "check": "node scripts/ipollowork.mjs check",
    "document:design": "node scripts/document-to-design-compiler.mjs",
    "document:video": "node scripts/document-to-design-compiler.mjs --target video",
    "readme:zh-hant": "node scripts/sync-readme-zh-hant.mjs",
    "readme:zh-hant:check": "node scripts/sync-readme-zh-hant.mjs --check",
    "plugins:package": "bun scripts/package-plugin-collection.mjs",
    "package": "node scripts/ipollowork.mjs package",
    "package:dir": "node scripts/ipollowork.mjs package:dir",
    "package:windows": "cross-env IPOLLOWORK_WINDOWS_INSTALLER=1 pnpm --filter @ipollowork/desktop package:windows",
    "dev": "cross-env IPOLLOWORK_DEV_MODE=1 IPOLLOWORK_ELECTRON_REMOTE_DEBUG_PORT=9823 pnpm_config_verify_deps_before_run=warn pnpm --filter @ipollowork/desktop dev",
```

</details>

**依据 4 · 源码核查**：[apps/server/src/routes/deepseek-harness.ts:174-183](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/routes/deepseek-harness.ts#L174-L183)

创建和分叉所得 sessionId 绑定到当前工作区及引擎。

<details>
<summary>查看原文（10行）</summary>

```text
      const value = await runtime.forWorkspace(workspace).call(method, body.payload ?? {});
      if (method === "commands/execute" && sessionId) options.monitorSessionExecution?.(workspace, sessionId);
      if ((method === "session.create" || method === "session.fork") && isRecord(value) && typeof value.sessionId === "string") {
        await bindConversationSession(config, workspace, value.sessionId, {
          title: "New conversation",
          engineId: DEEPSEEK_HARNESS_ENGINE_ID,
          ...(method === "session.fork" && sessionId ? { parentSessionId: sessionId } : {}),
        });
      }
      return Response.json({ value });
```

</details>

#### 缺口

- 未比较原生 DSH 与工作台的同项目交接或产物质量。
  **影响**：可以识别操作增量，不能量化采用价值。
  **进一步探讨**：让同一操作者完成两条相同的公开项目任务，记录会话查找、授权与产物复核。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工作区和会话如何进入 DSH，并映射到用户界面？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

运行池以 workspace ID 复用 DSH 实例。普通工作区使用独立的 DSH_HOME 子目录，同时为一个已识别旧工作区保留原生历史目录。引擎进程以工作区路径为 cwd 启动，在本机交换一次启动 token 得到 cookie。项目 prompt 要求 collaborator 和 sessionId，检查删除状态以及引擎绑定。明确绑定可直接复用；对子会话可查原生列表、比对 cwd 并验证祖先，若发现未验证的子树会拒绝，完全无绑定信息时仍有退回 workspace 默认配置的分支。prompt 经过插件指令装配后映射到原生 session/prompt，并按请求 ID 与响应对应。事件端用 WebSocket mux 跟踪，再以 SSE 形式给工作台。待答审批或问题保存在运行实例的 RPC 映射，回应使用当时的 clientId 和 eventId，收到成功后移除。可见状态用于协作，但不代替后端引擎的数据边界。

#### 证据与依据

**依据 1 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:1178-1191](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-runtime.ts#L1178-L1191)

独立工作区存储与旧 home 例外。

<details>
<summary>查看原文（14行）</summary>

```text
export function deepSeekHarnessHome(
  config: ServerConfig,
  workspace: WorkspaceInfo,
  configuredHome?: string,
  legacyWorkspaceId?: string | null,
): string {
  const root = runtimeStorageDir(config);
  if (legacyWorkspaceId === workspace.id) {
    // Preserve the original single-runtime home so existing DSH sessions remain available.
    return configuredHome || join(root, "deepseek-harness");
  }
  if (configuredHome) return join(configuredHome, "workspaces", safeRuntimeSegment(workspace.id));
  return join(root, "deepseek-harness-workspaces", safeRuntimeSegment(workspace.id));
}
```

</details>

**依据 2 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:1243-1258](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-runtime.ts#L1243-L1258)

按 workspace ID 复用实例。

<details>
<summary>查看原文（16行）</summary>

```text
  forWorkspace(workspace: WorkspaceInfo): DeepSeekHarnessRuntime {
    if (this.#closed) throw new DeepSeekHarnessUnavailableError("The server runtime pool has been closed");
    const existing = this.#runtimes.get(workspace.id);
    if (existing) return existing;
    if (!this.#legacyWorkspaceResolved) {
      this.#legacyWorkspaceId = resolveLegacyDeepSeekHarnessWorkspaceId(this.#config, workspace);
      this.#legacyWorkspaceResolved = true;
    }
    const runtime = new DeepSeekHarnessRuntime({
      config: this.#config,
      env: this.#env,
      workspace,
      legacyWorkspaceId: this.#legacyWorkspaceId,
    });
    this.#runtimes.set(workspace.id, runtime);
    return runtime;
```

</details>

**依据 3 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:1120-1141](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-runtime.ts#L1120-L1141)

以项目 cwd 和 DSH_HOME 启动，认证后才可用。

<details>
<summary>查看原文（22行）</summary>

```text
    const child = spawn(executable, args, {
      cwd: this.#workspace.path,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...childEnv,
        DSH_HOME: dshHome,
        ELECTRON_RUN_AS_NODE: "1",
        NO_COLOR: "1",
      },
    });
    this.#child = child;

    try {
      const baseUrl = await waitForReadyUrl(child);
      child.stdout?.resume();
      child.stderr?.resume();
      const connection = await authenticateDeepSeekHarness(baseUrl);
      const normalizedBaseUrl = connection.baseUrl;
      this.#cookie = connection.cookie;
      await waitForDeepSeekHarnessApi(normalizedBaseUrl, { cookie: this.#cookie });
      this.#baseUrl = normalizedBaseUrl;
```

</details>

**依据 4 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:455-470](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-runtime.ts#L455-L470)

只接受带 token 的回环 HTTP 启动 URL，交换 cookie。

<details>
<summary>查看原文（16行）</summary>

```text
export async function authenticateDeepSeekHarness(
  launchUrl: string,
  fetcher: typeof fetch = fetch,
): Promise<{ baseUrl: string; cookie: string }> {
  const url = new URL(launchUrl);
  if (url.protocol !== "http:" || url.hostname !== "127.0.0.1" || !url.searchParams.get("token")) {
    throw new DeepSeekHarnessUnavailableError("DeepSeek Harness returned an invalid local authentication URL");
  }
  // Exchange the process token once. Never persist it or forward it to Work clients.
  const response = await fetcher(url, { redirect: "manual", signal: AbortSignal.timeout(5_000) });
  const cookie = response.headers.getSetCookie().map((value) => value.split(";", 1)[0]).join("; ");
  await response.body?.cancel();
  if (response.status !== 303 || !cookie) {
    throw new DeepSeekHarnessUnavailableError("DeepSeek Harness authentication failed");
  }
  return { baseUrl: url.origin, cookie };
```

</details>

**依据 5 · 源码核查**：[apps/server/src/routes/deepseek-harness.ts:126-151](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/routes/deepseek-harness.ts#L126-L151)

工作台实际注册提示入口，检查角色、资源及引擎。

<details>
<summary>查看原文（26行）</summary>

```text
  addRoute(routes, "POST", "/workspace/:id/engine/deepseek-harness/prompt", "client", async (ctx) => {
    requireClientScope(ctx, "collaborator");
    let workspace: WorkspaceInfo = { ...await resolveWorkspace(config, ctx.params.id), engineId: DEEPSEEK_HARNESS_ENGINE_ID };
    const body = await readJsonBody(ctx.request);
    if (!isRecord(body.payload) || typeof body.payload.sessionId !== "string" || !body.payload.sessionId.trim()) {
      throw new ApiError(400, "invalid_payload", "A DeepSeek Harness sessionId is required");
    }
    await assertResourceWritable(config, workspace.id, body.payload.sessionId.trim());
    workspace = await resolveWorkspaceSession(config, await resolveWorkspace(config, ctx.params.id), body.payload.sessionId.trim(), { deepseekHarness: runtime });
    if (workspace.engineId !== DEEPSEEK_HARNESS_ENGINE_ID) {
      throw new ApiError(409, "session_engine_mismatch", "This conversation is bound to a different engine");
    }
    const promptPayload = await withPluginPromptInstructions(
      config,
      body.payload,
      parseEnginePluginPromptSelection(body.plugins),
    );
    rememberSessionContext(workspace.id, body.payload.sessionId.trim());
    await options.preparePlugins(workspace);
    try {
      await runtime.forWorkspace(workspace).call("session.prompt", promptPayload);
      options.monitorSessionExecution?.(workspace, body.payload.sessionId.trim());
      return Response.json({ ok: true });
    } catch (error) {
      remapDeepSeekHarnessError(error);
    }
```

</details>

**依据 6 · 源码核查**：[apps/server/src/workspace-session-runtime.ts:89-111](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/workspace-session-runtime.ts#L89-L111)

已有绑定优先，未绑定 DSH 会话需读取原生元数据。

<details>
<summary>查看原文（23行）</summary>

```text
  const lifecycle = await readResourceLifecycle(config, workspace.id, sessionId);
  if (lifecycle?.engineId) return { ...workspace, engineId: lifecycle.engineId };
  const binding = await readProjectSessionWorkItem(config, workspace.id, sessionId);
  if (binding?.execution) return { ...workspace, engineId: binding.execution.runtime.engineId };
  const engines = new Set([workspace.engineId || DEFAULT_ENGINE_ID, ...await listBoundSessionEngines(config, workspace.id)]);
  let foundUnverifiedChild = false;
  for (const engineId of engines) {
    if (engineId !== CODEX_HARNESS_ENGINE_ID && engineId !== DEEPSEEK_HARNESS_ENGINE_ID) continue;
    const engineWorkspace = { ...workspace, engineId };
    let readMetadata: ((id: string) => Promise<{ cwd?: string; parentId?: string | null } | null>) | null = null;
    if (engineId === CODEX_HARNESS_ENGINE_ID && runtimes.codexHarness) {
      const runtime = runtimes.codexHarness.forWorkspace(engineWorkspace);
      readMetadata = async (id) => {
        const result = await runtime.call<{ thread?: CodexThread }>("thread/read", { threadId: id, includeTurns: false });
        return result.thread?.id === id ? { cwd: result.thread.cwd, parentId: result.thread.parentThreadId } : null;
      };
    } else if (engineId === DEEPSEEK_HARNESS_ENGINE_ID && runtimes.deepseekHarness) {
      const result = await runtimes.deepseekHarness.forWorkspace(engineWorkspace).call<{ items: DeepSeekHarnessSummary[] }>("session.list", {}).catch(() => null);
      const summaries = new Map((result?.items ?? []).slice(0, 2_000).map((summary) => [summary.sessionId, summary]));
      readMetadata = async (id) => {
        const summary = summaries.get(id);
        return summary ? { cwd: summary.cwd, parentId: summary.parentSessionId } : null;
      };
```

</details>

**依据 7 · 源码核查**：[apps/server/src/workspace-session-runtime.ts:114-142](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/workspace-session-runtime.ts#L114-L142)

比对 cwd、验证祖先关系与未找到时的处理。

<details>
<summary>查看原文（29行）</summary>

```text
    const visited = new Set<string>();
    let currentId = sessionId;
    let child = false;
    for (let depth = 0; depth < 16 && !visited.has(currentId); depth++) {
      visited.add(currentId);
      const metadata = await readMetadata(currentId).catch(() => null);
      if (!metadata) break;
      if (!workspacePathMatches(metadata.cwd, workspace.path)) {
        foundUnverifiedChild = true;
        break;
      }
      const parentBinding = currentId === sessionId ? null : await readProjectSessionWorkItem(config, workspace.id, currentId);
      if (parentBinding?.execution) {
        if (parentBinding.execution.runtime.engineId === engineId) return engineWorkspace;
        foundUnverifiedChild = true;
        break;
      }
      const parentId = metadata.parentId?.trim();
      if (!parentId) {
        if (child) foundUnverifiedChild = true;
        break;
      }
      child = true;
      foundUnverifiedChild = true;
      currentId = parentId;
    }
  }
  if (foundUnverifiedChild) throw new ApiError(404, "session_not_found", "Session does not belong to this workspace's bound conversation tree");
  return workspace;
```

</details>

**依据 8 · 源码核查**：[apps/server/src/deepseek-harness-remote.ts:125-129](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-remote.ts#L125-L129)

工作台 prompt 变成原生请求，提供 requestId。

```text
    case "session.prompt": {
      const { clientUserMessageId, ...request } = payload;
      return { method: "session/prompt", args: { request: { ...request, requestId: clientUserMessageId ?? randomUUID() } } };
    }
    default: return { method: method.replace(".", "/"), args: { request: payload } };
```

**依据 9 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:600-624](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-runtime.ts#L600-L624)

认证 POST、时限、RPC 关联检查及错误。

<details>
<summary>查看原文（25行）</summary>

```text
    const remote = deepSeekRemoteCall(method, payload);
    const rpcId = randomUUID();
    let response: Response;
    try {
      const methodPath = remote.method.split("/").map(encodeURIComponent).join("/");
      response = await fetch(`${baseUrl}/api/${methodPath}`, {
        method: "POST",
        headers: { "content-type": "application/json", cookie: this.#cookie },
        body: JSON.stringify({ type: "client-request", rpcId, method: remote.method, payload: { args: remote.args } }),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      throw new DeepSeekHarnessUnavailableError("DeepSeek Harness could not be reached", { cause: error });
    }
    if (!response.ok) {
      throw new DeepSeekHarnessUnavailableError(
        `DeepSeek Harness returned HTTP ${response.status}`,
      );
    }
    const envelope = await response.json() as RpcResponse<T>;
    if (envelope.rpcId !== rpcId) {
      throw new DeepSeekHarnessUnavailableError("DeepSeek Harness returned a mismatched response");
    }
    if (!envelope.result.ok) throw new DeepSeekHarnessRpcError(envelope.result.error);
    const value = envelope.result.value;
```

</details>

**依据 10 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:939-964](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-runtime.ts#L939-L964)

跟踪工作区会话事件和流式片段。

<details>
<summary>查看原文（26行）</summary>

```text
        const watch = async (sessionId: string) => {
          if (watched.has(sessionId)) return;
          watched.add(sessionId);
          let attempt: Record<string, unknown> = {};
          for await (const frame of connection.stream("session/follow", {
            request: { address: { kind: "session", sessionId }, maxMessages: 1, assistantStream: true },
          }, combined)) {
            if (frame.type === "event") emit({ type: "session/event", sessionId, event: frame.event });
            if (frame.type === "assistant-stream") {
              const current = remoteRecord(frame.frame);
              if (current.type === "start") attempt = current;
              if (current.type === "chunk") emit({ type: "session/event", sessionId, event: {
                type: "assistant/chunk", seq: 0, time: current.time,
                data: { turn: attempt.turn, step: attempt.step, chunk: current.chunk },
              } });
            }
          }
        };
        const run = async () => {
          const observe = (session: { sessionId: string; cwd?: string }) => {
            if (!workspacePathMatches(session.cwd, this.#workspace.path)) return;
            void watch(session.sessionId).catch((error) => {
              watched.delete(session.sessionId);
              if (!combined.aborted) emit({ type: "host/agent-error", sessionId: session.sessionId,
                message: error instanceof Error ? error.message : "DSH session could not be observed" });
            });
```

</details>

**依据 11 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:997-1018](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-runtime.ts#L997-L1018)

登记待答及取消，订阅结束删除对应映射。

<details>
<summary>查看原文（22行）</summary>

```text
            if (frame.type === "waterfall" && typeof frame.eventId === "string" && typeof frame.event === "string") {
              if (frame.event !== "approval/request" && frame.event !== "user-questions/request") continue;
              this.#remoteResponses.set(frame.eventId, { clientId, event: frame.event });
              pendingIds.set(frame.eventId, { event: frame.event, sessionId: frame.agentId });
              emit({ ...remoteRecord(frame.request), sessionId: frame.agentId, approvalId: frame.eventId,
                type: frame.event === "approval/request" ? "approval/requested" : "question/requested",
              }, frame.eventId);
            }
            if (frame.type === "cancel" && typeof frame.eventId === "string") {
              const pending = pendingIds.get(frame.eventId);
              if (pending) emit({
                type: pending.event === "approval/request" ? "approval/resolved" : "question/resolved",
                sessionId: pending.sessionId, approvalId: frame.eventId, questionRpcId: frame.eventId,
              });
              this.#remoteResponses.delete(frame.eventId);
              pendingIds.delete(frame.eventId);
            }
          }
        };
        void run().catch(fail).finally(() => {
          for (const id of pendingIds.keys()) this.#remoteResponses.delete(id);
          finish();
```

</details>

**依据 12 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:899-910](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-runtime.ts#L899-L910)

发送匹配待答记录的原生结果。

<details>
<summary>查看原文（12行）</summary>

```text
  async respond(input: { rpcId: string; result: unknown }): Promise<void> {
    const baseUrl = await this.#ensureStarted();
    const pending = this.#remoteResponses.get(input.rpcId);
    if (!pending) throw new DeepSeekHarnessUnavailableError("DeepSeek Harness request is no longer pending");
    const result = remoteRecord(input.result);
    const value = remoteRecord(result.value);
    const answer = pending.event === "approval/request" ? value.outcome : value.answer;
    if (result.ok !== true || answer === undefined) throw new DeepSeekHarnessUnavailableError("Invalid DeepSeek Harness response");
    await this.#callAtBaseUrl(baseUrl, "$events/result", {
      clientId: pending.clientId, eventId: input.rpcId, outcome: { kind: "result", value: answer },
    });
    this.#remoteResponses.delete(input.rpcId);
```

</details>

#### 缺口

- 未在两工作区同时创建会话、跨窗口回应和复用历史。
  **影响**：静态检查只能证明这些路径存在，不能证明所有 UI 或 API 入口都达到同样范围。
  **进一步探讨**：用两个隔离项目测试错误 sessionId、子会话来源、断线后审批及原生历史。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 关闭订阅、终止推理和切工作区的边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

事件端的请求取消会终止 mux 和订阅，发送的 cancel 帧按 streamId 指向订阅。工作台另有 session.cancel RPC，其调用通过协作者检查，面向 DSH 的会话；工作区实例关闭又是进程级动作，清理订阅、cookie 和待答记录，并有界尝试结束子进程。断网、关闭窗口、会话取消以及释放实例不应视作同一结果。会话监控会轮询历史，在运行记录仍匹配起始时间的情况下写入终态。当前 DSH 完成判定选最后一个 turn/end，旧于 startedAt 则不认，error 和取消类标失败，其他原因默认 done；通用 target 提供 turnId，但这个 DSH 判定未使用它。因而工作台 done 是历史事件投影，单靠该标签不能确认期待的轮次与文件均已完成。若请求发出后回执丢失，不能从超时推断该引擎从未收到。

#### 证据与依据

**依据 1 · 源码核查**：[apps/server/src/routes/deepseek-harness.ts:25-46](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/routes/deepseek-harness.ts#L25-L46)

允许显式会话取消的方法。

<details>
<summary>查看原文（22行）</summary>

```text
const ALLOWED_METHODS = new Set([
  "session.list",
  "session.search",
  "session.create",
  "session.history",
  "session.models",
  "session.selectModel",
  "session.rename",
  "session.fork",
  "session.cancel",
  "llm.providers",
  "llm.models",
  "credentials.describe",
  "credentials.set",
  "credentials.unset",
  "settings.describe",
  "settings.mutate",
  "workspace.list",
  "agentPreset.list",
  "agentPreset.select",
  "commands/execute",
]);
```

</details>

**依据 2 · 源码核查**：[apps/server/src/routes/deepseek-harness.ts:154-174](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/routes/deepseek-harness.ts#L154-L174)

非只读调用检查协作者，按绑定分派。

<details>
<summary>查看原文（21行）</summary>

```text
  addRoute(routes, "POST", "/workspace/:id/engine/deepseek-harness/rpc", "client", async (ctx) => {
    let workspace: WorkspaceInfo = { ...await resolveWorkspace(config, ctx.params.id), engineId: DEEPSEEK_HARNESS_ENGINE_ID };
    const body = await readJsonBody(ctx.request);
    const method = typeof body.method === "string" ? body.method.trim() : "";
    if (!ALLOWED_METHODS.has(method)) {
      throw new ApiError(400, "invalid_payload", `Unsupported DeepSeek Harness method: ${method || "missing"}`);
    }
    if (!READ_METHODS.has(method)) requireClientScope(ctx, "collaborator");
    const sessionId = isRecord(body.payload) && typeof body.payload.sessionId === "string"
      ? body.payload.sessionId.trim()
      : "";
    await assertResourceWritable(config, workspace.id, sessionId);
    if (sessionId) {
      workspace = await resolveWorkspaceSession(config, await resolveWorkspace(config, ctx.params.id), sessionId, { deepseekHarness: runtime });
      if (workspace.engineId !== DEEPSEEK_HARNESS_ENGINE_ID) {
        throw new ApiError(409, "session_engine_mismatch", "This conversation is bound to a different engine");
      }
    }
    if (["session.create", "session.fork", "commands/execute"].includes(method)) await options.preparePlugins(workspace);
    try {
      const value = await runtime.forWorkspace(workspace).call(method, body.payload ?? {});
```

</details>

**依据 3 · 源码核查**：[apps/server/src/routes/deepseek-harness.ts:206-224](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/routes/deepseek-harness.ts#L206-L224)

事件端将 HTTP 取消信号交给订阅。

<details>
<summary>查看原文（19行）</summary>

```text
  addRoute(routes, "GET", "/workspace/:id/engine/deepseek-harness/events/:stream", "client", async (ctx) => {
    const workspace: WorkspaceInfo = { ...await resolveWorkspace(config, ctx.params.id), engineId: DEEPSEEK_HARNESS_ENGINE_ID };
    const workspaceRuntime = runtime.forWorkspace(workspace);
    const stream = ctx.params.stream;
    if (stream !== "mux" && stream !== "host") {
      throw new ApiError(404, "not_found", "DeepSeek Harness event stream not found");
    }
    try {
      const upstream = await workspaceRuntime.events(stream, ctx.request.signal);
      return new Response(upstream.body, {
        headers: {
          "cache-control": "no-cache",
          "content-type": "text/event-stream",
        },
      });
    } catch (error) {
      if (ctx.request.signal.aborted) return new Response(null, { status: 204 });
      remapDeepSeekHarnessError(error);
    }
```

</details>

**依据 4 · 源码核查**：[apps/server/src/deepseek-harness-remote.ts:38-60](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-remote.ts#L38-L60)

取消帧的目标是 streamId。

<details>
<summary>查看原文（23行）</summary>

```text
  async *stream(endpoint: string, args: Record<string, unknown>, signal: AbortSignal): AsyncGenerator<Record<string, unknown>> {
    signal.throwIfAborted();
    if (this.#closed) throw new Error("DSH Remote connection is closed");
    const socket = this.#socket;
    const streamId = randomUUID();
    let controller: ReadableStreamDefaultController<Record<string, unknown>>;
    let closed = false;
    const finish = (error?: unknown) => {
      if (closed) return;
      closed = true;
      clearTimeout(timeout);
      signal.removeEventListener("abort", abort);
      if (error) controller.error(error);
      else controller.close();
      this.#streams.delete(streamId);
      if (!this.#closed && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: "cancel", streamId }));
    };
    const abort = () => finish(signal.reason);
    const source = new ReadableStream<Record<string, unknown>>({
      start(value) { controller = value; },
      cancel() { finish(); },
    });
    const timeout = setTimeout(() => finish(new Error("DSH Remote stream did not become ready")), 15_000);
```

</details>

**依据 5 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:1036-1067](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-runtime.ts#L1036-L1067)

实例关闭清理状态并尝试信号终止。

<details>
<summary>查看原文（32行）</summary>

```text
  async #close(): Promise<void> {
    const starting = this.#starting;
    if (starting) await starting.catch(() => undefined);
    for (const finish of this.#eventStreams) finish();
    const child = this.#child;
    this.#baseUrl = null;
    this.#cookie = "";
    this.#remoteResponses.clear();
    this.#child = null;
    this.#starting = null;
    this.#syncedCredentialFingerprint = "";
    this.#syncedProviderIds.clear();
    this.#syncedCompatibleProviderIds.clear();
    this.#syncedCredentialRefs.clear();
    this.#syncedRouteProjections = [];
    if (child && child.exitCode === null) {
      // Stop the gateway client before waiting for its loopback server. This
      // lets any active streamed request disconnect instead of making server
      // shutdown wait indefinitely for the DSH child.
      child.kill("SIGTERM");
      await Promise.race([
        new Promise<void>((resolve) => child.once("exit", () => resolve())),
        new Promise<void>((resolve) => setTimeout(resolve, 3_000)),
      ]);
      if (child.exitCode === null) {
        child.kill("SIGKILL");
        await Promise.race([
          new Promise<void>((resolve) => child.once("exit", () => resolve())),
          new Promise<void>((resolve) => setTimeout(resolve, 2_000)),
        ]);
      }
    }
```

</details>

**依据 6 · 源码核查**：[apps/server/src/server.ts:831-860](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/server.ts#L831-L860)

以工作记录起始时间启用监控并保护写回。

<details>
<summary>查看原文（30行）</summary>

```text
  const monitorSessionExecution = (workspace: WorkspaceInfo, sessionId: string, turnId?: string): void => {
    if (config.readOnly || sessionMonitorAbort.signal.aborted) return;
    void (async () => {
      const item = await readProjectSessionWorkItem(config, workspace.id, sessionId);
      if (sessionMonitorAbort.signal.aborted || item?.status !== "running" || item.runStartedAt === null) return;
      const startedAt = item.runStartedAt;
      const key = `${workspace.id}\u0000${item.id}`;
      const existing = sessionMonitors.get(key);
      if (existing?.sessionId === sessionId && existing.startedAt === startedAt) return;
      existing?.abort.abort(new Error("Conversation run superseded"));
      const abort = new AbortController();
      const stop = () => abort.abort(sessionMonitorAbort.signal.reason);
      sessionMonitorAbort.signal.addEventListener("abort", stop, { once: true });
      let monitor: Promise<void>;
      monitor = (async () => {
        try {
          const completion = await sessionRuntime.waitForCompletion(workspace, sessionId, {
            signal: abort.signal,
            startedAt,
            ...(turnId ? { turnId } : {}),
          });
          await finishProjectSessionExecution(config, workspace.id, sessionId, completion, { expectedRunStartedAt: startedAt });
        } catch (error) {
          if (abort.signal.aborted) return;
          const message = error instanceof Error ? error.message : "Conversation monitoring failed";
          try {
            await finishProjectSessionExecution(config, workspace.id, sessionId, {
              status: "failed",
              error: message,
            }, { expectedRunStartedAt: startedAt });
```

</details>

**依据 7 · 源码核查**：[apps/server/src/workspace-session-runtime.ts:158-179](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/workspace-session-runtime.ts#L158-L179)

DSH 历史终态判据只用最新 turn/end 和起始时间，特殊原因失败，其余 done。

<details>
<summary>查看原文（22行）</summary>

```text
export function deepSeekHarnessCompletion(
  history: DeepSeekHarnessHistory,
  target: WorkspaceSessionCompletionTarget = {},
): WorkspaceSessionCompletion | null {
  for (let index = history.events.length - 1; index >= 0; index -= 1) {
    const event = history.events[index]?.event;
    if (event?.type !== "turn/end") continue;
    if (target.startedAt !== undefined && event.time < target.startedAt) return null;
    const data = isRecord(event.data) ? event.data : null;
    const reason = data && isRecord(data.reason) ? data.reason : null;
    if (reason?.kind === "error") {
      return {
        status: "failed",
        error: errorMessage(reason.error, "DeepSeek Harness task failed"),
      };
    }
    if (["cancelled", "canceled", "interrupted"].includes(String(reason?.kind))) {
      return { status: "failed", error: "DeepSeek Harness task was interrupted" };
    }
    return { status: "done" };
  }
  return null;
```

</details>

**依据 8 · 源码核查**：[apps/server/src/workspace-session-runtime.ts:596-608](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/workspace-session-runtime.ts#L596-L608)

工作台监控确实使用该 DSH 历史判据。

<details>
<summary>查看原文（13行）</summary>

```text
  async #readCompletion(
    workspace: WorkspaceInfo,
    sessionId: string,
    target: WorkspaceSessionCompletionTarget = {},
  ): Promise<WorkspaceSessionCompletion | null> {
    workspace = await resolveWorkspaceSession(this.#config, workspace, sessionId, { codexHarness: this.#codexHarness, deepseekHarness: this.#deepseekHarness });
    if (workspace.engineId === DEEPSEEK_HARNESS_ENGINE_ID) {
      const snapshot = await readDeepSeekHarnessSnapshot(
        this.#deepseekHarness.forWorkspace(workspace),
        workspace,
        sessionId,
      );
      return deepSeekHarnessCompletion(snapshot.history, target);
```

</details>

#### 缺口

- 没有真实宿主的断流、同会话多轮竞争、工具外部写入和停止观测。
  **影响**：不能确认投影何时与原生状态偏离，也不能承诺停止外部作用。
  **进一步探讨**：用同一原生会话制造断流与显式取消，对照历史、进程、产物和测试端点结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验收一个可回退的项目任务？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

使用根应用需要独立工作台，源码开发的构建环境与桌面制品是两条路径。DSH 模式需要可运行的 Web profile 与可用模型。引擎包有配置的 CLI 时走 Node，否则可用系统 dsh；工作台以独立运行时配置与项目 cwd 启动，再同步必要的提供商凭据。先用副本项目保留原生 DSH 入口，运行一次公开样例并核对 sessionId、cwd、原生历史和预期文件。后续使用需要维护工具链、身份、可见项目以及模型访问和留存。启动、请求、确认和退出的实际费用与人时未测。权限错误、待答无法确认或终态与文件不符时先停止新增请求，再从原生 DSH 和文件状态人工对账。工作区迁移和外部工具操作应单独核查。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:67-98](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/README.md#L67-L98)

作者区分发行安装和源构建的依赖。

<details>
<summary>查看原文（32行）</summary>

```text
## Install iPolloWork

### Download the desktop app

Official installers are published on [GitHub Releases](https://github.com/Devin-AXIS/iPolloWork/releases). If you prefer a manual download, choose the file that matches both your operating system and CPU:

| System | CPU | Installer to use |
| --- | --- | --- |
| macOS | Apple Silicon (M-series) | `ipollowork-mac-arm64-<version>.dmg` |
| macOS | Intel | `ipollowork-mac-x64-<version>.dmg` |
| Windows | Intel/AMD 64-bit | `ipollowork-win-x64-<version>.exe` |
| Windows | ARM64 | `ipollowork-win-arm64-<version>.exe` |
| Linux | Intel/AMD 64-bit | `ipollowork-linux-x64-<version>.AppImage` |
| Linux | ARM64 | `ipollowork-linux-arm64-<version>.AppImage` |

The macOS `.zip` and Linux `.tar.gz` files are portable/update artifacts; most users should choose `.dmg`, `.exe`, or `.AppImage`. If the Releases page does not yet contain an installer for your system, run or package the app from source below.

Installation after downloading:

- **macOS:** open the `.dmg`, then drag **iPolloWork** into Applications.
- **Windows:** run the `.exe` installer. A locally built, unsigned installer may trigger Microsoft Defender SmartScreen.
- **Linux:** make the AppImage executable with `chmod +x ipollowork-*.AppImage`, then run it. The `.tar.gz` package can be extracted and run without installation.

### Requirements for source development and packaging

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download) 22 or newer
- pnpm 11, enabled through Corepack with `corepack enable`
- [Bun](https://bun.sh/docs/installation) 1.3.10 or newer, used to build the local Orchestrator sidecar
- macOS: Xcode Command Line Tools (`xcode-select --install`)
- Windows: [Visual Studio 2022 Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with **Desktop development with C++** and the Windows SDK; use PowerShell or Command Prompt
- Linux: a standard Electron build environment with a C/C++ toolchain, Python 3, `pkg-config`, and the desktop libraries required by Electron; the release build uses Ubuntu 22.04
```

</details>

**依据 2 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:101-116](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-runtime.ts#L101-L116)

启动使用 Web profile、动态端口及可配置 Node。

<details>
<summary>查看原文（16行）</summary>

```text
export function deepSeekHarnessWebArgs(
  configuredCli: string,
  patchPath: string,
): string[] {
  const webArgs = ["--profile", "web", "--patch", patchPath, "--port", "0", "--no-open"];
  return configuredCli ? [configuredCli, ...webArgs] : webArgs;
}

export function deepSeekHarnessNodeExecutable(
  environment: NodeJS.ProcessEnv = process.env,
  platform: NodeJS.Platform = process.platform,
): string {
  return environment.IPOLLOWORK_DSH_NODE_BIN?.trim()
    || environment.IPOLLOWORK_NODE_BIN?.trim()
    || (platform === "win32" ? "node.exe" : "node");
}
```

</details>

**依据 3 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:1083-1087](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-runtime.ts#L1083-L1087)

显式配置的 CLI 缺失立即报不可用。

```text
  async #start(): Promise<string> {
    const configuredCli = process.env.IPOLLOWORK_DSH_CLI?.trim() ?? "";
    if (configuredCli && !existsSync(configuredCli)) {
      throw new DeepSeekHarnessUnavailableError(`DeepSeek Harness runtime was not found at ${configuredCli}`);
    }
```

**依据 4 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:567-580](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-runtime.ts#L567-L580)

提示和模型入口会等待提供商凭据同步。

<details>
<summary>查看原文（14行）</summary>

```text
  async call<T>(method: string, payload: unknown): Promise<T> {
    const baseUrl = await this.#ensureStarted();
    const isCompaction = method === "commands/execute"
      && remoteRecord(remoteRecord(payload).args).line === "/compact";
    if (
      method === "session.selectModel"
      || method === "session.prompt"
      || method === "llm.models"
      || method === "llm.providers"
      || isCompaction
    ) {
      await this.#syncSharedProviderApiCredentials(baseUrl);
    }
    return this.#callAtBaseUrl<T>(baseUrl, method, payload, isCompaction ? 180_000 : 60_000);
```

</details>

**依据 5 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:1104-1129](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-runtime.ts#L1104-L1129)

运行时继承环境并设置本地服务、项目、DSH_HOME，需核对接入凭据和边界。

<details>
<summary>查看原文（26行）</summary>

```text
    const storedEnv = deepSeekHarnessChildEnvironment(await this.#env.list());
    const childEnv = withLoopbackProxyBypass({ ...process.env, ...storedEnv });
    // The Authorization Center owns this media-service credential. A chat
    // provider is enabled only through an explicit shared provider key.
    delete childEnv.DASHSCOPE_API_KEY;
    childEnv.IPOLLOWORK_SERVER_URL = `http://127.0.0.1:${this.#config.port}`;
    childEnv.IPOLLOWORK_SERVER_TOKEN = this.#config.token;
    childEnv.IPOLLOWORK_WORKSPACE_ID = this.#workspace.id;
    // DSH's web profile does not stay alive when its JavaScript entrypoint is
    // booted through Electron's run-as-Node compatibility mode. Downloaded
    // engine packs therefore carry a matching Node runtime; official local
    // installs fall back to the user's Node executable.
    const nodeExecutable = deepSeekHarnessNodeExecutable();
    const executable = configuredCli ? nodeExecutable : process.platform === "win32" ? "dsh.cmd" : "dsh";
    const args = deepSeekHarnessWebArgs(configuredCli, patchPath);

    const child = spawn(executable, args, {
      cwd: this.#workspace.path,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...childEnv,
        DSH_HOME: dshHome,
        ELECTRON_RUN_AS_NODE: "1",
        NO_COLOR: "1",
      },
```

</details>

**依据 6 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:614-623](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-runtime.ts#L614-L623)

引擎网络、响应关联和 RPC 错误分别影响验收。

<details>
<summary>查看原文（10行）</summary>

```text
    if (!response.ok) {
      throw new DeepSeekHarnessUnavailableError(
        `DeepSeek Harness returned HTTP ${response.status}`,
      );
    }
    const envelope = await response.json() as RpcResponse<T>;
    if (envelope.rpcId !== rpcId) {
      throw new DeepSeekHarnessUnavailableError("DeepSeek Harness returned a mismatched response");
    }
    if (!envelope.result.ok) throw new DeepSeekHarnessRpcError(envelope.result.error);
```

</details>

#### 缺口

- 未下载发行制品、启动 DSH、测部署成本或核实所有子进程隔离。
  **影响**：仅能提供可核对试点，长期采用、数据移植与付费未知。
  **进一步探讨**：锁定版本和项目副本，记录安装、一次会话、一次拒绝、一次退出及恢复时长。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否用原生终态与产物状态减少误认完成？

**研究主题**：新假设与验证

#### 完整回答

当前实现可把原生事件转发给工作台，并根据最近 turn/end 更新任务。可以试验将某次请求或 turn 的原生状态与明确预期文件的版本标记绑定，分别显示引擎结束、文件已验收与等待核对。对照现有监控和人工找文件，注入掉线后恢复、迟到的事件、非错误终止但文件未落盘，记录错误判定完成、旧文件误认、核对时间和绑定失败。若不能找到稳定对应的原生事件，或误判不降而增加较多同步与隐私负担，则不采用。这个设想不等于当前工作台已有统一的跨引擎完成证据。

#### 证据与依据

**依据 1 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:939-953](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/deepseek-harness-runtime.ts#L939-L953)

已有原生事件和流式片段映射。

<details>
<summary>查看原文（15行）</summary>

```text
        const watch = async (sessionId: string) => {
          if (watched.has(sessionId)) return;
          watched.add(sessionId);
          let attempt: Record<string, unknown> = {};
          for await (const frame of connection.stream("session/follow", {
            request: { address: { kind: "session", sessionId }, maxMessages: 1, assistantStream: true },
          }, combined)) {
            if (frame.type === "event") emit({ type: "session/event", sessionId, event: frame.event });
            if (frame.type === "assistant-stream") {
              const current = remoteRecord(frame.frame);
              if (current.type === "start") attempt = current;
              if (current.type === "chunk") emit({ type: "session/event", sessionId, event: {
                type: "assistant/chunk", seq: 0, time: current.time,
                data: { turn: attempt.turn, step: attempt.step, chunk: current.chunk },
              } });
```

</details>

**依据 2 · 源码核查**：[apps/server/src/workspace-session-runtime.ts:158-179](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/workspace-session-runtime.ts#L158-L179)

已有终态来源与时间约束。

<details>
<summary>查看原文（22行）</summary>

```text
export function deepSeekHarnessCompletion(
  history: DeepSeekHarnessHistory,
  target: WorkspaceSessionCompletionTarget = {},
): WorkspaceSessionCompletion | null {
  for (let index = history.events.length - 1; index >= 0; index -= 1) {
    const event = history.events[index]?.event;
    if (event?.type !== "turn/end") continue;
    if (target.startedAt !== undefined && event.time < target.startedAt) return null;
    const data = isRecord(event.data) ? event.data : null;
    const reason = data && isRecord(data.reason) ? data.reason : null;
    if (reason?.kind === "error") {
      return {
        status: "failed",
        error: errorMessage(reason.error, "DeepSeek Harness task failed"),
      };
    }
    if (["cancelled", "canceled", "interrupted"].includes(String(reason?.kind))) {
      return { status: "failed", error: "DeepSeek Harness task was interrupted" };
    }
    return { status: "done" };
  }
  return null;
```

</details>

**依据 3 · 源码核查**：[apps/server/src/server.ts:845-852](https://github.com/Devin-AXIS/iPolloWork/blob/2e3886a031b78df46e2ee1820bfba9de8cede9b5/apps/server/src/server.ts#L845-L852)

监控结果写入当前匹配的任务记录。

```text
      monitor = (async () => {
        try {
          const completion = await sessionRuntime.waitForCompletion(workspace, sessionId, {
            signal: abort.signal,
            startedAt,
            ...(turnId ? { turnId } : {}),
          });
          await finishProjectSessionExecution(config, workspace.id, sessionId, completion, { expectedRunStartedAt: startedAt });
```

#### 缺口

- 未验证 requestId、turn 和文件版本能否完整且可信关联。
  **影响**：不能保证提示可实现或会减少错判。
  **进一步探讨**：使用公开样例文件哈希和原生运行记录进行对照，统计关联失败。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
