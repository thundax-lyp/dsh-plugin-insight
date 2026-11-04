# AI Inner OS

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[24bfa97](https://github.com/SummerSec/AI-Inner-Os/tree/24bfa977c5a0cf34d37ada0a60acc31f7672c206)

<!-- BEGIN META -->
[![GitHub ★ 16](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=16&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SummerSec/AI-Inner-Os)
<!-- END META -->

> **功能**：通过宿主 hook 和指令配置生成带人设的可见过程说明。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将前缀、频率及近期事件组织为宿主提示；不证明可读取模型内部推理。

> **主要限制**：[Q03](#research-q03) 状态可能保存命令或路径，hook 失败静默，DSH 原生接线未确认。

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
  - [Q01 · 这项插件面向什么交互需求，相比普通进度说明增加什么？](#detail-section-11)
  - [Q02 · 会话和工具 hook 怎样生成附加上下文？](#detail-section-12)
  - [Q03 · 状态文件会保存什么，失败时如何表现？](#detail-section-13)
  - [Q04 · 启用和退出应考虑什么？](#detail-section-14)
  - [Q05 · 如何减少状态记录暴露工具参数的风险？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望代理在终端工作时提供拟人化过程说明的用户。

直接要求代理提供普通进度说明。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 会话注入 | 指定输出风格 | 不证明模型真实内部状态 |
| 工具摘要 | 提供近期事件 | 可能记录命令与路径 |
| 人设配置 | 改变说明风格 | 模型是否遵循未知 |
| 多宿主适配 | 接收各宿主事件 | DSH 接线未确认 |

**流程与依赖**

| 依赖 | 条件 | 作用 | 缺失影响 |
|---|---|---|---|
| 兼容宿主 hook | 自动注入需要 | 接收事件及提示 | 不自动执行 |
| Node >=18 | JS hook 需要 | 执行脚本 | 无法运行 |
| 状态目录权限 | 事件记录需要 | 保存近期状态 | 可能静默失败 |
| 模型响应 | 可见输出需要 | 遵循提示生成 | 文案不保证出现 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 用户核对宿主支持与数据目录 | 不含敏感命令 |
| 注入 | 宿主触发 session hook | 检查附加上下文 |
| 记录 | 工具事件更新状态 | 失败可能静默 |
| 退出 | 用户禁用并核对状态 | 检查残留 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | 宿主、Node 与配置 | 安装及检查权限 | DSH 兼容未知 |
| 持续 | 上下文与输出 | 阅读或忽略文案 | token 与收益未知 |
| 退出 | 状态目录 | 禁用及清理 | 残留未测 |

| 效果 | 材料 | 未知 |
|---|---|---|
| 提示注入 | session hook 与协议拼接 | 实际宿主生效 |
| 事件摘要 | 状态与格式化源码 | 进度有效性 |
| 人设 | 配置读取 | 模型遵循程度 |

> **思考**：[Q03](#research-q03) 状态可能保存命令或路径，hook 失败静默，DSH 原生接线未确认。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将前缀、频率及近期事件组织为宿主提示；不证明可读取模型内部推理。

[Q02](#research-q02) 将宿主事件转换为上下文；[Q03](#research-q03) 状态读写和静默失败需要单独检查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 状态可能保存命令或路径，hook 失败静默，DSH 原生接线未确认。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用非敏感隔离会话核对提示、状态和停用；不接受额外输出或状态内容时关闭。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本定向静态检查；未运行宿主、插件或模型。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、hooks/session-start.js、hooks/post-tool-use.js、hooks/lib/prompt.js、hooks/lib/events.js、hooks/lib/constants.js、hooks/lib/state.js、codex/hooks/post-tool-use.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查通用和 Codex 部分 hook、提示及状态；未完整审计其他宿主与安装程序，未发现 DSH 专用接线。
- 下一步：隔离宿主验证 hook 格式、隐私、并发和清理；本轮未执行。

**分析版本**

- **仓库**：[SummerSec/AI-Inner-Os](https://github.com/SummerSec/AI-Inner-Os)
- **版本号**：0.7.4（[固定提交 24bfa97](https://github.com/SummerSec/AI-Inner-Os/tree/24bfa977c5a0cf34d37ada0a60acc31f7672c206)）
- **版本日期**：2026-05-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 最小化事件目标保存，需平衡进度质量与隐私。

隔离宿主验证 hook 格式、隐私、并发和清理；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 57 | 5503 | — | — | 42465 |
| .js | source | 28 | 1999 | 1601 | 108 | — |
| .js | test | 5 | 456 | 391 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/SummerSec/AI-Inner-Os/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/SummerSec/AI-Inner-Os/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/SummerSec/AI-Inner-Os/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查多宿主提示接线、状态记录和数据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这项插件面向什么交互需求，相比普通进度说明增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

项目面向希望代理在工作期间显示拟人化过程说明的用户；README 把输出称为 inner monologue，但实际是按提示生成的可见文本，不能据此推断模型真实内部推理或情绪。普通代理也能按用户要求简短汇报，本项目将前缀、人设和触发频率配置为可复用指令。仓库列出多个宿主但不列 DSH，不能将来源目录收录当作 DSH 原生接线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:29-37](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/README.md#L29-L37)

作者的输出目标及多宿主声明。

````text
AI Inner OS is a plugin for AI CLI tools, supporting **Claude Code**, **Codex CLI**, **Cursor**, **OpenCode CLI**, **Hermes Agent**, and **OpenClaw**.

Through protocol injection, it enables AI to output a visible layer of free-form inner monologue while completing tasks normally:

```
▎InnerOS：This repo is still a bare shell — let me get the load-bearing walls up first.
```

Free mode by default, no tone restrictions. The AI can complain, gloat, feel anxious, smirk, free-associate — or say nothing at all. You can also switch to preset personas (tsundere, cold, philosopher, etc.) to give the monologue a specific style. Whether to produce monologue is entirely up to the AI.
````

**依据 2 · 源码核查**：[hooks/lib/prompt.js:12-38](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/hooks/lib/prompt.js#L12-L38)

读取协议与人设并拼接上下文。

<details>
<summary>查看原文（27行）</summary>

```text
export async function buildSessionStartContext() {
  let protocol;
  try {
    const raw = await readFile(SKILL_PATH, "utf8");
    protocol = stripFrontmatter(raw);
  } catch {
    protocol = "本会话启用了 Inner OS。内心独白使用 ▎InnerOS：前缀输出。";
  }

  try {
    const config = await readInnerOsConfig();
    protocol += "\n\n" + buildFrequencyContext(config.frequency);
  } catch {
    // frequency config is optional
  }

  try {
    const personaName = await readActivePersona();
    const personaText = await readPersonaContent(personaName);
    if (personaText) {
      return protocol + "\n\n---\n\n## 当前人设\n\n" + personaText;
    }
  } catch {
    // persona read failed, return protocol only
  }

  return protocol;
```

</details>

**依据 3 · 作者声明**：[README.md:87-105](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/README.md#L87-L105)

Codex 和 Cursor 适配说明。

<details>
<summary>查看原文（19行）</summary>

````text
### Codex CLI

```bash
# Codex plugin metadata is included at .codex-plugin/plugin.json
# Repo marketplace metadata is included at .agents/plugins/marketplace.json
```

See [codex/README.md](codex/README.md) | [Detailed installation guide](docs/install-codex.md).

### Cursor

```bash
# Install through Cursor plugin / marketplace
# Plugin metadata is included at .cursor-plugin/plugin.json
```

The repository also includes `.cursor-plugin/plugin.json`, which packages `cursor/` as a Cursor plugin component directory.

See [cursor/README.md](cursor/README.md) | [Detailed installation guide](docs/install-cursor.md).
````

</details>

#### 缺口

- 未发现 DSH 专用挂载，且无用户效果对照
  **影响**：不能判断 DSH 可用或协作收益
  **进一步探讨**：检查目标 DSH 版本事件接口并对照普通进度说明。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话和工具 hook 怎样生成附加上下文？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

SessionStart 读取协议和可选人设，并写入会话状态后返回 additionalContext；工具后 hook 把事件规范化，更新近期事件，再输出近期上下文。Codex 适配另以对应格式输出；这些是提示与状态接线，是否实际注入由宿主 hook 支持和启用决定，不能将其当作底层推理可观测性。

#### 证据与依据

**依据 1 · 源码核查**：[hooks/session-start.js:1-25](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/hooks/session-start.js#L1-L25)

会话开始上下文和状态。

<details>
<summary>查看原文（25行）</summary>

```text
import { readJsonStdin, writeJsonStdout } from "./lib/io.js";
import { buildSessionStartContext } from "./lib/prompt.js";
import { getSessionId } from "./lib/session.js";
import { readSessionState, writeSessionState } from "./lib/state.js";

const context = await buildSessionStartContext();

try {
  const input = await readJsonStdin();
  const sessionId = getSessionId(input);
  const state = await readSessionState(sessionId);

  await writeSessionState(sessionId, {
    ...state,
    enabled: true,
  });
} catch {
  // session state failed, still inject the protocol below
}

writeJsonStdout({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: context,
  },
```

</details>

**依据 2 · 源码核查**：[hooks/lib/prompt.js:12-38](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/hooks/lib/prompt.js#L12-L38)

协议、频率与人设。

<details>
<summary>查看原文（27行）</summary>

```text
export async function buildSessionStartContext() {
  let protocol;
  try {
    const raw = await readFile(SKILL_PATH, "utf8");
    protocol = stripFrontmatter(raw);
  } catch {
    protocol = "本会话启用了 Inner OS。内心独白使用 ▎InnerOS：前缀输出。";
  }

  try {
    const config = await readInnerOsConfig();
    protocol += "\n\n" + buildFrequencyContext(config.frequency);
  } catch {
    // frequency config is optional
  }

  try {
    const personaName = await readActivePersona();
    const personaText = await readPersonaContent(personaName);
    if (personaText) {
      return protocol + "\n\n---\n\n## 当前人设\n\n" + personaText;
    }
  } catch {
    // persona read failed, return protocol only
  }

  return protocol;
```

</details>

**依据 3 · 源码核查**：[hooks/post-tool-use.js:1-16](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/hooks/post-tool-use.js#L1-L16)

事件记录和附加上下文。

<details>
<summary>查看原文（16行）</summary>

```text
import { normalizeToolEvent } from "./lib/events.js";
import { readJsonStdin, writeTextStdout } from "./lib/io.js";
import { buildRecentEventContext } from "./lib/prompt.js";
import { getSessionId } from "./lib/session.js";
import { appendEvent } from "./lib/state.js";

try {
  const input = await readJsonStdin();
  const sessionId = getSessionId(input);
  const event = normalizeToolEvent(input);
  const state = await appendEvent(sessionId, event);

  writeTextStdout(buildRecentEventContext(state));
} catch {
  // Fail silently — hook errors should not interrupt the session.
}
```

</details>

**依据 4 · 源码核查**：[codex/hooks/post-tool-use.js:7-24](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/codex/hooks/post-tool-use.js#L7-L24)

Codex 适配格式。

<details>
<summary>查看原文（18行）</summary>

```text
try {
  const input = await readJsonStdin();
  const sessionId = getSessionId(input);
  const event = normalizeToolEvent(input);
  const state = await appendEvent(sessionId, event);
  const context = buildRecentEventContext(state);

  if (context) {
    // Codex PostToolUse: JSON with hookSpecificOutput.additionalContext
    writeJsonStdout({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext: context,
      },
    });
  }
} catch {
  // Fail silently — hook errors should not interrupt the session.
```

</details>

#### 缺口

- 未运行任何宿主 hook
  **影响**：无法确认事件输入及输出实际生效
  **进一步探讨**：使用隔离会话核对启停、失败及生成文本。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 状态文件会保存什么，失败时如何表现？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

事件规范化将 tool input 的 path、target 或 command 放进 target，并生成摘要；appendEvent 将最近事件保存到状态 JSON，保留上限十条。状态目录默认在插件数据目录或回退到项目目录，未见该路径的敏感信息过滤；写入按会话先读后写，未见锁，竞争行为未实测。hook 捕获异常并静默退出，session-start 的状态写入失败仍继续注入协议。

#### 证据与依据

**依据 1 · 源码核查**：[hooks/lib/events.js:78-85](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/hooks/lib/events.js#L78-L85)

目标摘要构造。

```text
export function summarizePayload(toolName = "", payload = {}) {
  const target = payload.path || payload.target || payload.command || payload.description;

  if (target) {
    return `${toolName} -> ${toText(target)}`;
  }

  return `${toolName} executed`;
```

**依据 2 · 源码核查**：[hooks/lib/events.js:108-119](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/hooks/lib/events.js#L108-L119)

事件 target 和摘要。

<details>
<summary>查看原文（12行）</summary>

```text
export function normalizeToolEvent(input = {}) {
  const toolName = input.tool_name || input.toolName || input.hook_event_name || "unknown";
  const payload = input.tool_input || input.payload || input;

  return {
    toolName,
    eventType: inferEventType(toolName, payload),
    result: inferResult(input),
    target: payload.path || payload.target || payload.command || null,
    summary: summarizePayload(toolName, payload),
    timestamp: new Date().toISOString(),
  };
```

</details>

**依据 3 · 源码核查**：[hooks/lib/constants.js:7-20](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/hooks/lib/constants.js#L7-L20)

数据目录与事件上限。

<details>
<summary>查看原文（14行）</summary>

```text
function dataDirFromEnv() {
  const dataDir = process.env.CLAUDE_PLUGIN_DATA;
  if (!dataDir) {
    return new URL("../../", import.meta.url);
  }

  return pathToFileURL(resolve(dataDir) + sep);
}

export const PLUGIN_DATA_DIR = dataDirFromEnv();
export const CONFIG_PATH = new URL("config.json", PLUGIN_DATA_DIR);
export const STATE_DIR = new URL("state/", PLUGIN_DATA_DIR);
export const SKILL_PATH = new URL("../../protocol/SKILL.md", import.meta.url);
export const MAX_RECENT_EVENTS = 10;
```

</details>

**依据 4 · 源码核查**：[hooks/lib/state.js:45-85](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/hooks/lib/state.js#L45-L85)

状态写入和最近事件。

<details>
<summary>查看原文（41行）</summary>

```text
export async function writeSessionState(sessionId, state) {
  await ensureStateDir();

  const nextState = {
    enabled: true,
    ...state,
    sessionId: sanitizeSessionId(sessionId),
    updatedAt: new Date().toISOString(),
  };

  await writeFile(
    getStateFileUrl(sessionId),
    JSON.stringify(nextState, null, 2),
    "utf8",
  );

  return nextState;
}

export async function appendEvent(sessionId, event) {
  const state = await readSessionState(sessionId);
  const frequency = normalizeFrequency(state.frequency);
  const eventsSinceReminder = (state.toolEventsSinceReminder || 0) + 1;
  const shouldRemindInnerOs =
    event.result === "failure" || eventsSinceReminder >= getReminderThreshold(frequency);
  const recentEvents = [event, ...(state.recentEvents || [])].slice(
    0,
    MAX_RECENT_EVENTS,
  );

  const failureCount =
    event.result === "failure" ? (state.failureCount || 0) + 1 : 0;

  return writeSessionState(sessionId, {
    ...state,
    frequency,
    lastTool: event.toolName,
    failureCount,
    toolEventsSinceReminder: shouldRemindInnerOs ? 0 : eventsSinceReminder,
    shouldRemindInnerOs,
    recentEvents,
```

</details>

**依据 5 · 源码核查**：[hooks/post-tool-use.js:7-16](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/hooks/post-tool-use.js#L7-L16)

错误静默处理。

<details>
<summary>查看原文（10行）</summary>

```text
try {
  const input = await readJsonStdin();
  const sessionId = getSessionId(input);
  const event = normalizeToolEvent(input);
  const state = await appendEvent(sessionId, event);

  writeTextStdout(buildRecentEventContext(state));
} catch {
  // Fail silently — hook errors should not interrupt the session.
}
```

</details>

#### 缺口

- 未全面审计安装、清理和其他宿主数据路径
  **影响**：不能保证状态保密、竞争安全或失败可见
  **进一步探讨**：隔离会话测试敏感命令、并发和退出清理。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启用和退出应考虑什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

需要受支持宿主及其 hook 协议，Node 包声明 >=18；可配置频率和人设，输出会占模型上下文与读者注意力，实际开销和收益未知。状态文件可能包含工具命令或路径，使用者应检查数据目录权限和清理方式，先用非敏感工作流观察；不能接受额外输出、指令影响或状态残留时关闭插件并按宿主说明清理。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-5](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/package.json#L1-L5)

项目与私有包元数据。

```text
{
  "name": "ai-inner-os",
  "version": "0.7.4",
  "private": true,
  "description": "Framework for a Claude Code plugin that surfaces visible Inner OS monologue.",
```

**依据 2 · 源码核查**：[package.json:21-25](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/package.json#L21-L25)

Node 版本声明。

```text
    }
  },
  "engines": {
    "node": ">=18"
  },
```

**依据 3 · 源码核查**：[hooks/lib/prompt.js:41-56](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/hooks/lib/prompt.js#L41-L56)

频率提示。

<details>
<summary>查看原文（16行）</summary>

```text
export function buildFrequencyContext(frequency = "normal") {
  const normalized = normalizeFrequency(frequency);
  const lines = [
    `Inner OS 触发频率：${normalized}`,
    "- low：只在关键判断、失败恢复、重要结论前输出",
    "- normal：每个任务至少一次；复杂任务在开始、转折、验证或收尾阶段可各输出一次",
    "- high：阶段推进、连续工具调用、失败重试、发现问题时都可以输出；避免每句话都刷屏",
  ];

  if (normalized === "high") {
    lines.push("当前为 high 档：只要有新的阶段、工具结果或判断点，就优先输出一条简短 `▎InnerOS：` 独白。");
  } else if (normalized === "normal") {
    lines.push("当前为 normal 档：本任务至少输出一次简短 `▎InnerOS：` 独白。");
  }

  return lines.join("\n");
```

</details>

**依据 4 · 源码核查**：[hooks/lib/state.js:45-59](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/hooks/lib/state.js#L45-L59)

持久状态写入。

<details>
<summary>查看原文（15行）</summary>

```text
export async function writeSessionState(sessionId, state) {
  await ensureStateDir();

  const nextState = {
    enabled: true,
    ...state,
    sessionId: sanitizeSessionId(sessionId),
    updatedAt: new Date().toISOString(),
  };

  await writeFile(
    getStateFileUrl(sessionId),
    JSON.stringify(nextState, null, 2),
    "utf8",
  );
```

</details>

#### 缺口

- 未测试安装、禁用和退出残留
  **影响**：不能保证各宿主均可恢复原状态
  **进一步探讨**：在隔离配置检查关闭与状态清理。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何减少状态记录暴露工具参数的风险？

**研究主题**：新假设与验证

#### 完整回答

现有事件目标可能包含命令、路径，最多保留十条；可探索默认只存工具类别和结果，并将敏感目标设为可选显示，通过对照检查是否仍可生成有用的进度说明。该方案未实现；比较敏感信息保留数、任务上下文质量和人工负担，若进度严重失真或隐私收益不明显则否定。

#### 证据与依据

**依据 1 · 源码核查**：[hooks/lib/events.js:108-119](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/hooks/lib/events.js#L108-L119)

目标与摘要来源。

<details>
<summary>查看原文（12行）</summary>

```text
export function normalizeToolEvent(input = {}) {
  const toolName = input.tool_name || input.toolName || input.hook_event_name || "unknown";
  const payload = input.tool_input || input.payload || input;

  return {
    toolName,
    eventType: inferEventType(toolName, payload),
    result: inferResult(input),
    target: payload.path || payload.target || payload.command || null,
    summary: summarizePayload(toolName, payload),
    timestamp: new Date().toISOString(),
  };
```

</details>

**依据 2 · 源码核查**：[hooks/lib/state.js:64-85](https://github.com/SummerSec/AI-Inner-Os/blob/24bfa977c5a0cf34d37ada0a60acc31f7672c206/hooks/lib/state.js#L64-L85)

最近事件状态。

<details>
<summary>查看原文（22行）</summary>

```text
export async function appendEvent(sessionId, event) {
  const state = await readSessionState(sessionId);
  const frequency = normalizeFrequency(state.frequency);
  const eventsSinceReminder = (state.toolEventsSinceReminder || 0) + 1;
  const shouldRemindInnerOs =
    event.result === "failure" || eventsSinceReminder >= getReminderThreshold(frequency);
  const recentEvents = [event, ...(state.recentEvents || [])].slice(
    0,
    MAX_RECENT_EVENTS,
  );

  const failureCount =
    event.result === "failure" ? (state.failureCount || 0) + 1 : 0;

  return writeSessionState(sessionId, {
    ...state,
    frequency,
    lastTool: event.toolName,
    failureCount,
    toolEventsSinceReminder: shouldRemindInnerOs ? 0 : eventsSinceReminder,
    shouldRemindInnerOs,
    recentEvents,
```

</details>

#### 缺口

- 未测试实际敏感信息频率及最小化效果
  **影响**：不能证明方案能防止泄露
  **进一步探讨**：使用合成敏感命令比较状态与输出。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
