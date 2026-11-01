# OMA for DeepSeek Harness

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6f772a1](https://github.com/first-fluke/oh-my-agent/tree/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh)

<!-- BEGIN META -->
[![GitHub ★ 1,356](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C356&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/first-fluke/oh-my-agent)
<!-- END META -->

> **功能**：将 OMA 项目 Skill 和验证钩子桥接 DSH。

> **亮点**：[Q02](#research-q02) 将钩子 deny/ask、post 反馈与有限 Stop 接入宿主；不提供完整上游原生派工。

> **主要限制**：[Q02](#research-q02) post 不能撤销工具副作用，Stop 到上限只警告，不能当通过。

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
  - [Q01 · 谁需要 OMA 桥接，与手写规则有何区别？](#detail-section-11)
  - [Q02 · 工具前后和停止钩子怎样映射？](#detail-section-12)
  - [Q03 · 自动初始化下载与写入的边界是什么？](#detail-section-13)
  - [Q04 · 采用需要什么，如何退出？](#detail-section-14)
  - [Q05 · 怎样避免停止上限被误读为验收通过？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向希望在 DSH 项目中使用 OMA 工具前后检查的开发者。

人工规则和手工检查可完成类似流程；桥接自动调用但增加子进程和项目配置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| pre 钩子 | 检查工具参数 | 检查异常拒绝 |
| post 钩子 | 补充验证反馈 | 不能撤销操作 |
| Stop | 请求后续处理 | 上限后只警告 |
| 自动 setup | 安装缺失项目资产 | 下载及写入需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node 22+ 与兼容 DSH | 必需 | 宿主钩子 | 无法启动 |
| 固定 OMA CLI | 必需 | 执行检查 | pre 检查拒绝 |
| 项目资产和写权限 | 自动 setup 需要 | 安装 Skill/规则 | 报告失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份隔离项目 | 检查依赖与 autoSetup |
| 初始化 | 插件校验并安装缺失资产 | 核对变更 |
| 执行 | 工具前后运行钩子 | 拒绝时核原因 |
| 验收 | 用户审查 Stop 与交付 | 上限警告不是通过 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Node、下载和项目存储 | 备份审查 | 未运行 |
| 持续 | 钩子子进程 | 排查误拦 | 延迟未知 |
| 失败 | 恢复和重试 | 审查规则与文件 | Stop 上限不等于通过 |
| 退出 | 项目资产 | 关闭插件并核对文件 | 清理未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| pre 检查 | deny/ask 和错误拒绝 | 实际宿主覆盖 |
| post 检查 | 追加上下文 | 撤销已执行作用 |
| Stop | 有限继续及警告 | 最终验收合格 |

> **思考**：[Q02](#research-q02) post 不能撤销工具副作用，Stop 到上限只警告，不能当通过。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将钩子 deny/ask、post 反馈与有限 Stop 接入宿主；不提供完整上游原生派工。

[Q02](#research-q02) pre 错误拒绝，post 仅反馈；Stop 达上限警告后返回。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) post 不能撤销工具副作用，Stop 到上限只警告，不能当通过。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在备份项目审查规则和 setup，停止上限须独立验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定子包；未运行 DSH、OMA 子进程或下载。

- 已检查：作者 README、包清单、源码路径 integrations/dsh/package.json、integrations/dsh/index.mjs、integrations/dsh/README.md、integrations/dsh/bridge.mjs、integrations/dsh/protocol.mjs、integrations/dsh/runner.mjs、integrations/dsh/setup.mjs 及固定范围 inventory；组件：integrations/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子包静态核查，不运行 DSH、OMA、下载或目标项目；OMA 依赖版本以子包声明为准。
- 下一步：隔离工作区模拟 setup 校验失败、工具拒绝、post 错误及 Stop 上限。

**分析版本**

- **仓库**：[first-fluke/oh-my-agent](https://github.com/first-fluke/oh-my-agent)
- **版本号**：0.2.0（[固定提交 6f772a1](https://github.com/first-fluke/oh-my-agent/tree/6f772a1a46073c2962a388338a24e262231e67a3)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提议显式未解决状态，须对照已有警告评估误判和阻塞。

隔离工作区模拟 setup 校验失败、工具拒绝、post 错误及 Stop 上限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 8 | 1241 | 1179 | 15 | — |
| .mjs | test | 5 | 1420 | 1355 | 2 | — |
| .md | source | 1 | 199 | — | — | 1361 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/first-fluke/oh-my-agent/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/first-fluke/oh-my-agent/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)

暂未获取：近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 OMA DSH 子包的项目初始化、工具钩子和停止边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要 OMA 桥接，与手写规则有何区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有或准备采用 OMA 项目 Skill、希望在 DSH 工具调用前后使用其验证钩子的开发者。手写 AGENTS 和人工执行检查是直接替代；子包把 DSH 事件映射到 OMA CLI 和项目资产，而不是实现 OMA 全部原生角色调度。模板明确说不提供自动关键词工作流及原生角色派工，不能把上游 Skill 内容或结果都算子包贡献。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/package.json:1-24](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/package.json#L1-L24)

子包与固定依赖。

<details>
<summary>查看原文（24行）</summary>

```text
{
  "name": "dsh-plugin-oma",
  "version": "0.2.0",
  "description": "Use OMA project skills and tool validation hooks in DeepSeek Harness.",
  "type": "module",
  "main": "./index.mjs",
  "exports": {
    ".": "./index.mjs",
    "./cordis.patch.yml": "./cordis.patch.yml"
  },
  "files": [
    "index.mjs",
    "bridge.mjs",
    "protocol.mjs",
    "runner.mjs",
    "runtime.mjs",
    "setup.mjs",
    "skills.mjs",
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "test": "node --test *.test.mjs"
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/bridge.mjs:14-20](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/bridge.mjs#L14-L20)

运行时指引和功能边界。

```text
const RUNTIME_NOTE = [
  "[OMA runtime]",
  "Runtime: DeepSeek Harness (DSH). OMA skills are available under .agents/skills.",
  "Follow the project's AGENTS.md and the selected skill's instructions.",
  "Use the tools and agent APIs actually exposed by DSH. OMA hook JSON uses the Claude compatibility dialect; this does not make the session a Claude session.",
  "Automatic OMA keyword workflows and native OMA role dispatch are not provided by this plugin.",
].join("\n");
```

**依据 3 · 源码核查**：[integrations/dsh/index.mjs:1-8](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/index.mjs#L1-L8)

宿主入口。

```text
import { createUserMessage } from "@deepseek-ai/dsh-llm/message";
import { registerBridge } from "./bridge.mjs";

export const name = "oma";
export const inject = [];

export function apply(ctx, config = {}) {
  registerBridge(ctx, config, createUserMessage);
```

#### 缺口

- 未与手工规则或 DSH 实测对照
  **影响**：不能证明更少错误或净节时
  **进一步探讨**：在隔离项目比较同一任务的阻止率、误拦与人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具前后和停止钩子怎样映射？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

pre-execute 运行 PreToolUse，映射 deny/ask；钩子要求修改输入时因宿主冻结参数而拒绝并要求重试，钩子本身失败也拒绝。post-execute 已在操作后，只向下游追加上下文，不能撤销已执行副作用。Stop 的反馈通过 steer 请求继续，但每轮 maxStopBlocks 默认 2，达到上限仅警告并返回，不能把停止或上限视为通过。runner 有输入输出上限、超时及进程终止，真实宿主取消与子进程后代未运行验证。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/bridge.mjs:31-43](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/bridge.mjs#L31-L43)

停止重试上限配置。

<details>
<summary>查看原文（13行）</summary>

```text
export function registerBridge(
  ctx,
  config,
  createUserMessage,
  dependencies = {},
) {
  const maxStopBlocks = config?.maxStopBlocks ?? 2;
  if (
    !Number.isSafeInteger(maxStopBlocks) ||
    maxStopBlocks < 1 ||
    maxStopBlocks > 10
  ) {
    throw new TypeError("maxStopBlocks must be an integer between 1 and 10");
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/bridge.mjs:176-197](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/bridge.mjs#L176-L197)

pre 钩子和失败拒绝。

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.on("tools/pre-execute", async (execution, next) => {
    const agent = execution.agent;
    try {
      if (!(await active(agent, execution.signal)))
        return inactive(agent, execution.signal) ? { kind: "cancel" } : next();
      const output = await run(
        "PreToolUse",
        agent,
        execution.signal,
        execution,
      );
      if (inactive(agent, execution.signal)) return { kind: "cancel" };
      const context = hookContext(output);
      if (context) agent.inject(message(context));
      return preDecision(output, execution.arguments) ?? next();
    } catch (error) {
      if (inactive(agent, execution.signal)) return { kind: "cancel" };
      if (!(error instanceof WorkspaceSetupError)) report(error);
      return {
        kind: "deny",
        reason: `OMA hook could not validate this tool: ${error.message}`,
      };
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/bridge.mjs:200-222](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/bridge.mjs#L200-L222)

post 钩子追加上下文。

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.on("tools/post-execute", async (execution, result, next) => {
    const agent = execution.agent;
    let context;
    try {
      if (!(await active(agent, execution.signal))) return next();
      context = postContext(
        await run("PostToolUse", agent, execution.signal, execution, result),
      );
    } catch (error) {
      if (
        !inactive(agent, execution.signal) &&
        !(error instanceof WorkspaceSetupError)
      )
        report(error);
      context = `OMA post-tool validation failed: ${error.message}`;
    }
    const downstream = await next();
    if (!context || inactive(agent, execution.signal)) return downstream;
    return {
      ...downstream,
      additionalContexts: [
        message(context),
        ...(downstream.additionalContexts ?? []),
```

</details>

**依据 4 · 源码核查**：[integrations/dsh/protocol.mjs:74-101](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/protocol.mjs#L74-L101)

deny、ask 和改参拒绝。

<details>
<summary>查看原文（28行）</summary>

```text
export function preDecision(output, argumentsValue) {
  const specific = output.hookSpecificOutput ?? {};
  const reason = [specific.permissionDecisionReason, output.reason].find(
    (value) => typeof value === "string" && value.trim(),
  );
  if (
    specific.permissionDecision === "deny" ||
    output.decision === "block" ||
    output.continue === false
  ) {
    return { kind: "deny", reason: reason || "Blocked by an OMA hook." };
  }
  const updatedInput = Object.hasOwn(specific, "updatedInput")
    ? specific.updatedInput
    : output.updatedInput;
  if (
    updatedInput !== undefined &&
    !isDeepStrictEqual(updatedInput, argumentsValue)
  ) {
    return {
      kind: "deny",
      reason: `OMA requested changed tool input. DSH 0.2.0-rc.2 freezes arguments before hooks; retry the tool with this required input: ${JSON.stringify(updatedInput)}`,
    };
  }
  if (specific.permissionDecision === "ask") {
    return { kind: "ask", ...(reason ? { reason } : {}) };
  }
  return undefined;
```

</details>

**依据 5 · 源码核查**：[integrations/dsh/bridge.mjs:225-266](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/bridge.mjs#L225-L266)

Stop 和达到上限后的行为。

<details>
<summary>查看原文（42行）</summary>

```text
  });
  ctx.on("agent/turn-stopping", async ({ agent, turn, signal }) => {
    let state = stopStates.get(agent);
    if (state?.turn !== turn) {
      state = { turn, blocks: 0, inFlight: false, warned: false };
      stopStates.set(agent, state);
    }
    if (state.inFlight) return;
    state.inFlight = true;
    let reason;
    try {
      if (!(await active(agent, signal))) return;
      const payload = await hookPayload("Stop", agent);
      if (inactive(agent, signal)) return;
      const latest = assistantResponses.get(agent.session);
      if (latest?.turn === turn) payload.response = latest.text;
      const stdout = await runner.run("Stop", payload, {
        signal,
        owner: agent,
      });
      reason = stopReason(decodeOutput(stdout, "Stop"));
    } catch (error) {
      if (!inactive(agent, signal) && !(error instanceof WorkspaceSetupError))
        report(error);
      reason = `OMA stop validation failed: ${error.message}`;
    } finally {
      state.inFlight = false;
    }
    if (!reason || inactive(agent, signal)) return;
    if (state.blocks >= maxStopBlocks) {
      if (!state.warned) {
        state.warned = true;
        report(
          new Error(
            `Stop validation remains unresolved after ${maxStopBlocks} continuation requests: ${reason}`,
          ),
        );
      }
      return;
    }
    state.blocks += 1;
    agent.steer(message(reason));
```

</details>

**依据 6 · 源码核查**：[integrations/dsh/runner.mjs:24-34](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/runner.mjs#L24-L34)

子进程时间和输入输出限制。

<details>
<summary>查看原文（11行）</summary>

```text
  }
  const timeoutMs = positiveInteger(config.timeoutMs, 10000, "timeoutMs");
  const maxOutputBytes = positiveInteger(
    config.maxOutputBytes,
    262144,
    "maxOutputBytes",
  );
  const maxInputBytes = positiveInteger(
    config.maxInputBytes,
    4194304,
    "maxInputBytes",
```

</details>

#### 缺口

- 未运行真实宿主与所有钩子
  **影响**：不能证明阻止或停止完整可靠
  **进一步探讨**：隔离工作区测试拒绝、改参、异常、取消和达到上限。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动初始化下载与写入的边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

作者称首次自动 setup 获取固定版本项目资产并校验 SHA-256，只复制缺少的项目模板、保留现有配置；源码过滤 archive 路径，仅接受目标 .agents 子目录并排除非法段，配置以临时文件和 link 创建，存在时保留。即使有校验和过滤，也不能证明网络来源或所有归档/并发情形绝对安全；初始化是写工作区，失败应报告，不应把安装包存在当项目已可用。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/README.md:57-75](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/README.md#L57-L75)

作者描述下载、校验和现有文件边界。

<details>
<summary>查看原文（19行）</summary>

```text
When DSH creates the first agent in an uninitialized workspace, the plugin:

1. Finds the nearest Git root, or uses the workspace directory when it has no
   Git root.
2. Downloads the approximately 1 MB `agent-skills.tar.gz` release asset for
   `cli-v20.4.1`, checks its SHA-256 checksum, and verifies its version.
3. Copies missing project templates into `.agents/` and creates a minimal
   `.agents/oma-config.yaml`. Existing files are preserved.
4. Refreshes DSH's skill discovery before the first model turn.

An existing `.agents/oma-config.yaml` or `.agents/oma-config.cue` skips setup
and remains unchanged. Automatic setup installs project skills, rules,
workflows, agent definitions, configuration templates, and hooks. It does not
run the full `oma install` command or configure vendor tools in your home
directory. The generated configuration disables automatic CLI updates and
keeps `providers.code_intelligence_guard: off` until you configure a code
intelligence provider and its DSH tools.

After setup, the plugin no longer needs the setup download to use that project.
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/setup.mjs:90-104](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/setup.mjs#L90-L104)

归档路径过滤。

<details>
<summary>查看原文（15行）</summary>

```text
// before stripping that prefix, and extract only project assets into staging.
export function projectArchiveFilter() {
  let total = 0;
  return (path, entry) => {
    const parts = path.replace(/\/$/, "").split("/");
    if (parts[0] !== ".agents" || !DIRECTORIES.has(parts[1])) return false;
    if (
      parts.some(
        (part) =>
          !part ||
          part === "." ||
          part === ".." ||
          part.includes("\\") ||
          part.includes(":"),
      )
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/setup.mjs:301-320](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/setup.mjs#L301-L320)

配置原子创建与已有文件保留。

<details>
<summary>查看原文（20行）</summary>

```text
    if (await initialized(root)) return;
    await mergeMissing(assets, join(root, ".agents"), signal);
    signal.throwIfAborted();
    // The marker is committed last; partial copies never activate OMA guards.
    if (!(await initialized(root))) {
      const marker = join(root, ".agents", `.oma-config-${randomUUID()}.tmp`);
      try {
        await writeFile(marker, INITIAL_CONFIG, { flag: "wx" });
        signal.throwIfAborted();
        try {
          await link(marker, join(root, ".agents", "oma-config.yaml"));
        } catch (error) {
          if (error.code !== "EEXIST") throw error;
        }
      } finally {
        await rm(marker, { force: true });
      }
      if (!(await initialized(root)))
        throw new Error(
          "Existing OMA config is not a usable file; it was preserved",
```

</details>

**依据 4 · 源码核查**：[integrations/dsh/bridge.mjs:68-86](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/bridge.mjs#L68-L86)

setup 失败报告。

<details>
<summary>查看原文（19行）</summary>

```text
  async function active(agent, signal) {
    if (inactive(agent, signal)) return false;
    try {
      const ready = await setup.ensure(agent, signal);
      if (!ready || inactive(agent, signal)) return false;
      if (!preparedAgents.has(agent)) {
        skillInvalidator.invalidate();
        preparedAgents.add(agent);
      }
      return true;
    } catch (error) {
      if (inactive(agent, signal)) throw error;
      const failure = new WorkspaceSetupError(error);
      if (!setupFailures.has(agent)) {
        setupFailures.add(agent);
        report(failure);
        agent.inject(message(failure.message));
      }
      throw failure;
```

</details>

#### 缺口

- 未执行网络、归档或并发初始化
  **影响**：不能证明所有失败与恢复
  **进一步探讨**：隔离目录用无害 archive 模拟校验失败、冲突和取消。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用需要什么，如何退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

子包声明 Node >=22、OMA 20.4.1 和 DSH peer 依赖；首次可自动下载并写项目，持续每次钩子启动子进程，带时间、资源与误拦成本。适合可以审查规则且需要反复工具检查的团队先在备份项目试用；不希望自动写入时可按说明关闭 autoSetup 或使用已初始化项目。退出需分别移除宿主插件并检查生成的项目文件；不应假定卸载会撤销已执行工具或清理全部资产。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/package.json:20-33](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/package.json#L20-L33)

Node 和 OMA 依赖。

<details>
<summary>查看原文（14行）</summary>

```text
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "test": "node --test *.test.mjs"
  },
  "engines": {
    "node": ">=22"
  },
  "dependencies": {
    "oh-my-agent": "20.4.1",
    "tar": "7.5.22"
  },
  "peerDependencies": {
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/runner.mjs:24-34](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/runner.mjs#L24-L34)

默认限制与进程调用成本。

<details>
<summary>查看原文（11行）</summary>

```text
  }
  const timeoutMs = positiveInteger(config.timeoutMs, 10000, "timeoutMs");
  const maxOutputBytes = positiveInteger(
    config.maxOutputBytes,
    262144,
    "maxOutputBytes",
  );
  const maxInputBytes = positiveInteger(
    config.maxInputBytes,
    4194304,
    "maxInputBytes",
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/README.md:133-141](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/README.md#L133-L141)

关闭自动 setup 的说明。

````text
    autoSetup: true
    setupTimeoutMs: 120000
    timeoutMs: 10000
    maxOutputBytes: 262144
    maxInputBytes: 4194304
    maxStopBlocks: 2
```

Set `autoSetup: false` to enable the plugin only in projects you have already
````

**依据 4 · 源码核查**：[integrations/dsh/bridge.mjs:176-197](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/bridge.mjs#L176-L197)

失败时工具拒绝。

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.on("tools/pre-execute", async (execution, next) => {
    const agent = execution.agent;
    try {
      if (!(await active(agent, execution.signal)))
        return inactive(agent, execution.signal) ? { kind: "cancel" } : next();
      const output = await run(
        "PreToolUse",
        agent,
        execution.signal,
        execution,
      );
      if (inactive(agent, execution.signal)) return { kind: "cancel" };
      const context = hookContext(output);
      if (context) agent.inject(message(context));
      return preDecision(output, execution.arguments) ?? next();
    } catch (error) {
      if (inactive(agent, execution.signal)) return { kind: "cancel" };
      if (!(error instanceof WorkspaceSetupError)) report(error);
      return {
        kind: "deny",
        reason: `OMA hook could not validate this tool: ${error.message}`,
      };
```

</details>

#### 缺口

- 未测启动延迟、兼容和卸载
  **影响**：无法量化负担或保证清理
  **进一步探讨**：在可丢弃项目计时并检查修改文件和退出状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样避免停止上限被误读为验收通过？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有 Stop 反馈、最多次数和达到上限警告，因此简单增加重试或日志不是新机制。未验证方案是在达到上限时生成独立未解决状态，明确列出未通过的检查，并在用户最终验收前展示；应允许用户授权结束且不能把状态代替实际验证。模拟持续失败、钩子异常与用户确认，对比误认为通过的次数、误拦及交互负担；若理解无改善或阻塞成本不合适则否定。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/bridge.mjs:225-266](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/bridge.mjs#L225-L266)

现有 Stop、继续和上限警告。

<details>
<summary>查看原文（42行）</summary>

```text
  });
  ctx.on("agent/turn-stopping", async ({ agent, turn, signal }) => {
    let state = stopStates.get(agent);
    if (state?.turn !== turn) {
      state = { turn, blocks: 0, inFlight: false, warned: false };
      stopStates.set(agent, state);
    }
    if (state.inFlight) return;
    state.inFlight = true;
    let reason;
    try {
      if (!(await active(agent, signal))) return;
      const payload = await hookPayload("Stop", agent);
      if (inactive(agent, signal)) return;
      const latest = assistantResponses.get(agent.session);
      if (latest?.turn === turn) payload.response = latest.text;
      const stdout = await runner.run("Stop", payload, {
        signal,
        owner: agent,
      });
      reason = stopReason(decodeOutput(stdout, "Stop"));
    } catch (error) {
      if (!inactive(agent, signal) && !(error instanceof WorkspaceSetupError))
        report(error);
      reason = `OMA stop validation failed: ${error.message}`;
    } finally {
      state.inFlight = false;
    }
    if (!reason || inactive(agent, signal)) return;
    if (state.blocks >= maxStopBlocks) {
      if (!state.warned) {
        state.warned = true;
        report(
          new Error(
            `Stop validation remains unresolved after ${maxStopBlocks} continuation requests: ${reason}`,
          ),
        );
      }
      return;
    }
    state.blocks += 1;
    agent.steer(message(reason));
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/protocol.mjs:104-110](https://github.com/first-fluke/oh-my-agent/blob/6f772a1a46073c2962a388338a24e262231e67a3/integrations/dsh/protocol.mjs#L104-L110)

Stop 原因提取。

```text
export function stopReason(output) {
  if (output.decision === "block" || output.continue === false) {
    return typeof output.reason === "string" && output.reason.trim()
      ? output.reason
      : "An OMA stop hook requires follow-up work.";
  }
  return undefined;
```

#### 缺口

- 方案未实现、未做人机评估
  **影响**：无法证明减少误判
  **进一步探讨**：用隔离任务和模拟失败比较状态呈现。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
