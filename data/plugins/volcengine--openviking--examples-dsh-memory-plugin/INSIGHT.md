# OpenViking DSH Memory

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[d462af0](https://github.com/volcengine/OpenViking/tree/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin)

<!-- BEGIN META -->
[![GitHub ★ 42,206](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=42%2C206&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/OpenViking) [![npm 30d 45,856](https://img.shields.io/static/v1?label=npm+30d&message=45%2C856&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin) [![最新发布 2026-11-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin)
<!-- END META -->

> **功能**：在 DeepSeek Harness 会话中接入 OpenViking 召回、消息捕获、Skill 和 MCP。

> **亮点**：[Q01](#research-q01) 将记忆操作绑定到 Agent 和会话事件，保留手动 MCP。[Q03](#research-q03) 复用宿主模型流为低侵入的可选压缩路径，并保留失败回退。

> **主要限制**：[Q02](#research-q02) 的会话 peer 和启动客户端有不同作用域。[Q03](#research-q03) 与 [Q04](#research-q04) 说明摘要可发往宿主配置的模型，关闭新捕获后旧队列仍可能发送。

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
  - [Q01 · 插件怎样把手动记忆移入 DSH 会话？](#detail-section-11)
  - [Q02 · 工作区是配置、身份还是隔离？](#detail-section-12)
  - [Q03 · 新增压缩在哪条网络路径生效，何时退回？](#detail-section-13)
  - [Q04 · 哪些写入告警后放弃，哪些停止捕获后还会重放？](#detail-section-14)
  - [Q05 · 什么工作负担与数据治理会改变建议？](#detail-section-15)
  - [Q06 · 能否提供可核查的积压处置和压缩来源？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常重启会话的项目维护者可让 DSH 复用已保存的决策并查清来源。[Q01](#research-q01)

手动 MCP 或项目笔记由维护者选择每次保存和查阅的材料。事件监听将高频步骤移到会话生命周期，变更了默认数据流。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 召回和可选摘要 | 将已保存的候选按预算附加给 Agent | 需要可用服务，默认关闭压缩 |
| 自动会话捕获 | 将允许的会话内容发送到服务 | 可关闭新写，旧队列需核对 |
| MCP 与 Skill | 手动访问记忆资源 | MCP 桥接在启动时按配置挂载 |
| URI 守卫 | 在已有工具参量中提醒远端资源路径 | 支持列表内的调用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 支持的 Node 与 DSH peer | 是 | 加载模型、Skill 和 MCP 接线 | 保留原宿主流程 |
| 可访问的 OpenViking 服务与可信账号 | 自动功能必需 | 检索、捕获、提交与恢复 | 先验证连通、权限和待发状态 |
| 模型 Provider | 启用压缩才需 | 生成可选摘要 | 使用默认关闭或源码明确的退回路径 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者建立独立测试环境并核对捕获／召回范围 | 能解释凭据、工作区与服务器归属 |
| 验证 | 发无敏感标记，检查下一次会话的结果和引用 | 检查实际来源及临时服务实收 |
| 恢复与退出 | 停止添加、查待发、查远端状态 | 确认退出前后积压去向和删除责任 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 部署和索引资源未知 | 配置宿主、权限、服务器和模型 | 只用受控无敏感环境验证 |
| 持续 | 主模型、可选压缩和后台重放用量未知 | 查来源、质量、队列 | 压缩增量和节省分开计 |
| 恢复 | 补发和重新抽取开销未知 | 排查警告并核验对端状态 | 关闭捕获不会自动撤销旧数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 新会话复用 | 会话前置能附加检索内容 | 真实服务抽取和准确率 |
| 压缩退回 | 取消及非法摘要设有明确分支 | 同任务单位成本和收益 |
| 恢复写入 | 定时探活并重放待发 | 跨进程和用户数据处置结果 |

> **思考**：[Q02](#research-q02) 的会话 peer 和启动客户端有不同作用域。[Q03](#research-q03) 与 [Q04](#research-q04) 说明摘要可发往宿主配置的模型，关闭新捕获后旧队列仍可能发送。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将记忆操作绑定到 Agent 和会话事件，保留手动 MCP。[Q03](#research-q03) 复用宿主模型流为低侵入的可选压缩路径，并保留失败回退。

[Q03](#research-q03) 将宿主生成与共享文字、引用和回退策略解耦。[Q04](#research-q04) 的按阶段告警区分永久拒绝与补发，但退出需要远端证据。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的会话 peer 和启动客户端有不同作用域。[Q03](#research-q03) 与 [Q04](#research-q04) 说明摘要可发往宿主配置的模型，关闭新捕获后旧队列仍可能发送。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议先保留手动管理，在有授权的临时服务验证唯一标记、实际模型出口与停用后队列。发现数据归属不清时不扩大范围。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码已核查宿主回调和数据路径。真实服务抽取、模型收益及关停后的数据处置需要分别验证。

- 已检查：作者 README、包清单、源码路径 examples/dsh-memory-plugin/package.json、examples/dsh-memory-plugin/index.mjs、examples/dsh-memory-plugin/capture.mjs、examples/dsh-memory-plugin/mcp.mjs、examples/dsh-memory-plugin/uri-guard.mjs、examples/dsh-memory-plugin/runtime.mjs、examples/dsh-memory-plugin/client.mjs、examples/dsh-memory-plugin/README.md、examples/dsh-memory-plugin/session-workspace.test.mjs、examples/dsh-memory-plugin/compressor.mjs、examples/memory-plugin-shared/lib/recall-core.mjs、examples/memory-plugin-shared/lib/recall-compress-core.mjs、examples/memory-plugin-shared/sync.mjs 及固定范围 inventory；组件：examples/dsh-memory-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：统计仅覆盖 DSH 子组件，打包共享代码定向核查。使用固定 Git 文件与作者环境说明，未安装或运行插件、测试、宿主、模型与外部服务。
- 下一步：[Q06](#research-q06) 用暂时离线、永久拒绝和压缩超时组合比较操作者对下一次写入的判断。保留对端记录与各阶段回执以证伪。

**分析版本**

- **仓库**：[volcengine/OpenViking](https://github.com/volcengine/OpenViking)
- **版本号**：0.5.36（[固定提交 d462af0](https://github.com/volcengine/OpenViking/tree/d462af04e651335261d4972cb546788a788b2a47)）
- **版本日期**：2026-11-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 建议让操作者同时核对待发记录状态和最近一次召回为何使用摘要、原文或空结果。分别用恢复和压缩失败的对照验证。

[Q06](#research-q06) 用暂时离线、永久拒绝和压缩超时组合比较操作者对下一次写入的判断。保留对端记录与各阶段回执以证伪。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | example | 29 | 4276 | 3668 | 283 | — |
| .md | example | 7 | 1024 | — | — | 9222 |

</details>

**活跃度**

[![Issue 未关闭 509](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=509&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 418](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=418&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+created%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z) [![近30天关闭 216](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=216&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z)



统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 怎样自动复用 OpenViking 的项目记忆，开启宿主压缩和存在待发消息时，数据会去哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件怎样把手动记忆移入 DSH 会话？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

维护者重启 DSH 后还要复用项目决策和操作约定，可直接记笔记或手动调用 OpenViking MCP。插件的额外价值在会话接线。补丁按包名挂载 index，初始化提供运行时并注册 Agent 事件。pre-step 先等下游决定，再对确实进入的对话并行查一次 profile 和相关记忆，用来源标记追加到消息列表，保留宿主决策的其他字段。session/event 调用 capture 和 maybeCommit。capture 排除合成用户消息并按配置决定是否接纳助手或工具输出，再形成含角色、内容与可选 peer 的发送体。用户还能手动走独立注册的 MCP 和 Skill。工具守卫对受支持工具参数中的 viking:// 错用给出拒绝或后置提示，覆盖范围由已登记工具决定。合格任务是新会话找到一条已知且可追到来源的项目约定，人工方法在低频或不应外送的会话仍容易控制。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/package.json:35-50](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/package.json#L35-L50)

补丁与所需宿主 peer。

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "scripts": {
    "prepack": "node ../memory-plugin-shared/sync.mjs",
    "check": "for f in *.mjs shared/*.mjs; do node --check \"$f\" || exit 1; done && npm run check:version",
    "check:version": "node --input-type=module -e \"import {readFileSync} from 'node:fs'; const {PLUGIN_VERSION} = await import('./config.mjs'); const v = JSON.parse(readFileSync('package.json','utf8')).version; if (PLUGIN_VERSION !== v) throw new Error('PLUGIN_VERSION ' + PLUGIN_VERSION + ' does not match package.json version ' + v);\"",
    "test": "node --test *.test.mjs",
    "prepublishOnly": "npm run prepack && npm run check && npm test"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-llm": ">=0.1.0-rc.6 <1.0.0-0",
    "@deepseek-ai/dsh-mcp-client": ">=0.1.0-rc.6 <1.0.0-0",
    "@deepseek-ai/dsh-skill-filesystem": ">=0.1.0-rc.6 <1.0.0-0"
```

</details>

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/index.mjs:67-114](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/index.mjs#L67-L114)

启动、步前、捕获、flush 与工具的实际接线。

<details>
<summary>查看原文（48行）</summary>

```text
  ctx.on("agent/created", async ({ agent, source, signal }) => {
    if (source === undefined) return undefined;
    await untilAborted(startAgent(agent, signal), signal);
    return undefined;
  });
  ctx.on("agent/session-start", ({ agent }) => startAgent(agent));

  // prepend: downstream waterfall listeners run first, so this plugin sees
  // the final claimed batch and appends after every other contributor.
  // Profile + recall are independent after `next()`; run them concurrently so
  // the agent/pre-step waterfall (which currently gates user/message push in
  // dsh-agent-loop) spends less wall time (#4515).
  ctx.on("agent/pre-step", async ({ agent, messages, signal }, next) => {
    const decision = await next();
    if (skipMemory(agent.session)) return decision;
    if (decision.kind !== "enter" || signal.aborted) return decision;
    const [profile, recall] = await Promise.all([
      runtime.profileMessage(agent),
      runtime.recallMessage(agent, decision.messages, signal),
    ]);
    if (signal.aborted) return decision;
    const additions = [profile, recall].filter(Boolean);
    // Keep the rest of the decision: goal-round-driver marks its entries with
    // `startsRequestSeries`, and rebuilding the object would drop that flag.
    return additions.length > 0
      ? { ...decision, messages: [...decision.messages, ...additions] }
      : decision;
  }, { prepend: true });

  ctx.on("session/event", (session, event) => {
    if (skipMemory(session)) return;
    runtime.capture(session, event);
    runtime.maybeCommit(session, event);
  });

  ctx.on("session/flush", async session => {
    if (skipMemory(session)) return;
    await runtime.flush(session);
  });

  ctx.on("tools/pre-execute", guardVikingUri);
  ctx.on("tools/post-execute", noticeVikingUri);

  // Mounted last, and deliberately not awaited: the bridge's apply blocks on
  // its first tools/list, so a server that accepts the connection but never
  // answers would otherwise hold up every registration above it.
  mountOpenVikingMcp(ctx, config);
  mountOpenVikingSkills(ctx);
```

</details>

**依据 3 · 源码核查**：[examples/dsh-memory-plugin/capture.mjs:62-114](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/capture.mjs#L62-L114)

捕获和召回对消息来源的过滤。

<details>
<summary>查看原文（53行）</summary>

```text
function captureMessage(event, message, config, toolNames) {
  // DSH v4 gives producer-owned context messages their own kind. Treat
  // user-role messages with an explicit non-user/tool kind as synthetic;
  // untagged legacy messages stay capturable for backward compatibility.
  if (isSyntheticUserMessage(message)) return null;
  if (message.role === "assistant" && config.captureAssistantTurns === false) {
    return null;
  }
  if (message.source?.kind === "tool" && config.captureToolResults !== true) {
    return null;
  }

  const role = message.role === "assistant" ? "assistant" : "user";
  const toolNameById = Object.fromEntries(toolNames);
  const shaped = shapeCapturePayload(message, role, config, {
    toolNameById,
  });
  if (shaped.dropped) return null;
  const structuredParts = shaped.parts.filter(part => part?.type !== "text");
  if (!shaped.text && structuredParts.length === 0) return null;

  const hasTextPart = shaped.parts.some(part => part?.type === "text");
  const bodyParts = [
    ...(hasTextPart && shaped.text
      ? [{ type: "text", text: shaped.text }]
      : []),
    ...structuredParts,
  ];
  const payload = bodyParts.length > 0
    ? { role, parts: bodyParts }
    : { role, content: shaped.text };
  const createdAt = eventCreatedAt(event);
  if (createdAt) payload.created_at = createdAt;
  if (config.peerId) payload.peer_id = config.peerId;
  return payload;
}

// Recall queries use only what the user typed. Injected context (time-context,
// job notices, other plugins' blocks, our own recall) and tool results would
// otherwise trigger recall on their own and pollute the query text.
function isUserInput(message) {
  if (!message || message.role !== "user") return false;
  if (message.source?.kind === "tool") return false;
  return !isSyntheticUserMessage(message);
}

export function promptText(messages) {
  return (messages || [])
    .filter(isUserInput)
    .map(message => extractTextFromPayload(message))
    .filter(Boolean)
    .join("\n\n")
    .trim();
```

</details>

**依据 4 · 源码核查**：[examples/dsh-memory-plugin/mcp.mjs:7-15](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/mcp.mjs#L7-L15)

通过宿主 MCP 客户端注册。

```text
/**
 * Mount the tool surface. The bridge ships with dsh itself, so it resolves
 * from the host installation and never needs a separate install step.
 * Startup failure is contained: recall, capture, and commit keep working
 * against a server whose MCP endpoint is unreachable.
 */
export function mountOpenVikingMcp(ctx, config) {
  return ctx.plugin(mcpClient, buildMcpConfig(config));
}
```

**依据 5 · 源码核查**：[examples/dsh-memory-plugin/uri-guard.mjs:52-71](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/uri-guard.mjs#L52-L71)

针对已有工具的拒绝与附加提示。

<details>
<summary>查看原文（20行）</summary>

```text
export async function guardVikingUri(exec, next) {
  const decision = evaluateUriGuard(exec.name, exec.arguments, { hints: GUARDED_TOOLS });
  if (!decision) return next();
  return { kind: "deny", reason: decision.reason };
}

// Delegates first so a later listener's block or content replacement survives;
// the notice only rides along as one more context.
export async function noticeVikingUri(exec, _result, next) {
  const notice = evaluateUriNotice(exec.name, exec.arguments, { hints: GUARDED_TOOLS });
  if (!notice) return next();
  const decision = await next();
  const context = pluginMessage(notice.reason, {
    form: "notice",
    summary: boundContextSummary(`OpenViking URI guard: shell command contains ${notice.uri}`),
  });
  return {
    ...decision,
    additionalContexts: [...(decision.additionalContexts ?? []), context],
  };
```

</details>

#### 缺口

- 缺真实团队的相同工作负载对照。
  **影响**：目前确认自动化位置，无法量化节时或纠错收益。
  **进一步探讨**：比较按项目手动笔记与自动注入相同已知决策。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工作区是配置、身份还是隔离？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

本轮 index 传入完整配置解析器。runtime 首次使用 session 时取 header.cwd，合并解析后的设置与有效 peer，并在进程内按 DSH 会话保存。因此工作区里的召回和捕获参数可以在该会话生效。客户端仍由启动配置构建，单个 HTTP 客户端持有连接与身份默认值，调用传会话 peer 作为参数。手动 MCP 也是启动时建桥。工作区 peer 用于标记和查询，默认全 peer 召回、进程级 MCP 与服务器帐户边界意味着仅改变目录不足以建立隔离。初始化先探活再建远端会话，已有会话的 409 ALREADY_EXISTS 可复用，profile 由同一初始化取得并阻止重复投递。禁止出域的项目需要通过不同凭据与服务器所执行的权限来验证。未查实滚动升级会按会话重新构造网络客户端，所以内容治理应检查真实请求的端点与对端身份。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/index.mjs:12-22](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/index.mjs#L12-L22)

启动时建立客户端，每会话传入全配置解析器。

<details>
<summary>查看原文（11行）</summary>

```text
export function apply(ctx, input = {}) {
  const config = resolveConfig(input);
  const client = new OpenVikingClient(config);
  const runtime = new OpenVikingRuntime(client, config, ctx.logger, cwd => (
    // Rebuild from the host input, not the config already merged for boot's cwd.
    // The shared loader preserves host/env precedence over workspace settings.
    resolveConfig(input, process.env, cwd)
  ));
  const skipMemory = session => (
    config.skipSubagentSessions && session?.header?.origin === "subagent"
  );
```

</details>

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:37-67](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/runtime.mjs#L37-L67)

会话 cwd、有效 peer 和已保存状态。

<details>
<summary>查看原文（31行）</summary>

```text
  stateFor(session) {
    let state = this.states.get(session.id);
    if (state) return state;
    const cwd = session.header?.cwd || process.cwd();
    const resolved = this.resolveSessionConfig?.(cwd);
    const peer = resolved?.effectivePeer ?? resolveEffectivePeerId({
      cfg: {
        peerId: this.config.explicitPeerId,
        peerSource: this.config.peerSource,
        workspacePeer: this.config.workspacePeer,
        harness: this.config.harness,
      },
      cwd,
    });
    state = {
      dshSessionId: String(session.id),
      ovSessionId: deriveDshSessionId(session.id),
      config: { ...this.config, ...resolved, peerId: peer.peerId, legacyPeerId: peer.legacyPeerId },
      ready: false,
      profileBlock: "",
      profileDelivered: false,
      toolNames: new Map(),
      writes: Promise.resolve(),
      warnedFailures: new Set(),
      initializationRetryable: false,
      hasPendingWrites: false,
      pendingCreatedAt: 0,
      disposing: null,
    };
    this.states.set(session.id, state);
    return state;
```

</details>

**依据 3 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:84-136](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/runtime.mjs#L84-L136)

探活、建立、复用会话并去重 profile。

<details>
<summary>查看原文（53行）</summary>

```text
  async initializeState(state) {
    state.initializationRetryable = false;
    const health = await this.client.healthResult();
    this.reportWriteResult(state, "health", health, "/health");
    if (!health.ok) {
      state.initializationRetryable = isRetryableFailure(health);
      return state;
    }
    const ensured = await this.client.ensureSessionResult(
      state.ovSessionId,
      state.config.peerId,
    );
    if (
      !ensured.ok
      && !(ensured.status === 409 && ensured.error?.code === "ALREADY_EXISTS")
    ) {
      this.reportWriteResult(state, "ensure_session", ensured, "/api/v1/sessions");
      state.initializationRetryable = isRetryableFailure(ensured);
      return state;
    }
    state.warnedFailures.delete("ensure_session");
    // Replay is a write, so it stays behind the same toggle: a backlog queued
    // while capture was on waits for a session that still writes.
    if (isCaptureEnabled(state.config)) {
      await this.replayPendingQueue();
    }
    await this.refreshPendingState(state);
    const profile = await buildProfileBlock(
      (path, init, options) => this.client.fetchJSON(path, init, options),
      state.config.profileTokenBudget,
      state.config.peerId,
      state.config,
    );
    state.profileBlock = profile?.block
      ? [
          '<openviking-context source="profile">',
          profile.block,
          "</openviking-context>",
        ].join("\n")
      : "";
    state.ready = true;
    return state;
  }

  async profileMessage(agent) {
    const state = await this.initialize(agent);
    if (!state.ready || !state.profileBlock || state.profileDelivered) return null;
    if (hasStartupProfile(agent)) {
      state.profileDelivered = true;
      return null;
    }
    state.profileDelivered = true;
    return pluginMessage(state.profileBlock, { form: "instructions" });
```

</details>

**依据 4 · 源码核查**：[examples/dsh-memory-plugin/client.mjs:3-24](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/client.mjs#L3-L24)

启动客户端配置固定，建会话另传 actor peer。

<details>
<summary>查看原文（22行）</summary>

```text
export class OpenVikingClient {
  constructor(config) {
    this.config = config;
    this.connected = false;
    this.fetchJSON = createOvHttp(config, {
      defaultTimeoutMs: config.requestTimeoutMs,
      resolveActorPeerId: () => this.config.peerId,
    });
  }

  async healthResult() {
    const response = await this.fetchJSON("/health", {}, { timeoutMs: 5000 });
    this.connected = response.ok;
    return response;
  }

  async ensureSessionResult(sessionId, actorPeerId) {
    const response = await this.fetchJSON("/api/v1/sessions", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId }),
    }, { actorPeerId });
    return response;
```

</details>

**依据 5 · 作者声明**：[examples/dsh-memory-plugin/README.md:209-225](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/README.md#L209-L225)

作者区分 MCP 进程级身份、默认跨 peer 与会话操作。

<details>
<summary>查看原文（17行）</summary>

```text
The bundle's resolved connection — url, MCP url, key, account, user and auth
mode — travels to the proxy through the child environment, because DSH scrubs
credential-shaped names out of the inherited env and a subprocess cannot see the
Cordis patch. It goes with `OPENVIKING_CREDENTIAL_SOURCE=env`, so the proxy reads
no config file and reaches the server exactly as the runtime does, including
with no key when the runtime has none. A changed `ovcli.conf` therefore takes
effect for the tools when DSH restarts the bundle, as it does for the runtime.

Two consequences follow from the proxy being one process per profile:

- **MCP actor scope is process-level.** With the default `recallPeerScope: all`, MCP tool calls omit the actor peer header. With `actor`, they use the peer resolved at boot. Automatic recall, capture, and commit resolve their peer from each session's workspace.
  Desktop boots the bundle in its profile directory, which is no repository, so
  there the boot peer is empty and `actor`-scoped tool calls fall back to broad
  recall. Set `actor_peer_id` in `ovcli.conf` or `OPENVIKING_PEER_ID` to give
  them a peer; either one also overrides the workspace peer of every session.
- **`remember` is not session-scoped.** The server's MCP `remember` stores into
  its own short-lived session rather than the live `dsh-<session-id>` stream —
```

</details>

**依据 6 · 源码核查**：[examples/dsh-memory-plugin/session-workspace.test.mjs:155-176](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/session-workspace.test.mjs#L155-L176)

测试源码专门约束每会话召回与捕获开关。

<details>
<summary>查看原文（22行）</summary>

```text
test("a session's workspace recall and capture switches apply to that session", async t => {
  const { b, writeConfig, start, session } = setup(t);
  writeConfig(b, { recall: { enabled: false }, capture: { enabled: false } });
  const requests = [];
  t.mock.method(globalThis, "fetch", async (url, init = {}) => {
    const path = new URL(url).pathname;
    requests.push(path);
    const result = path.startsWith("/api/v1/sessions/") && !init.method ? { pending_tokens: 20000 } : {};
    return new Response(JSON.stringify({ status: "ok", result }), {
      headers: { "Content-Type": "application/json" },
    });
  });
  const runtime = start();
  const current = session(b, "quiet");
  const message = { role: "user", content: [{ type: "text", text: "Keep this repository off the server." }], source: { kind: "user" } };
  assert.equal(await runtime.recallMessage({ session: current }, [message]), null);
  runtime.capture(current, { type: "user/message", data: message });
  runtime.maybeCommit(current, { type: "turn/end" });
  await runtime.flush(current);

  assert.ok(!requests.includes("/api/v1/search/search"));
  assert.ok(!requests.includes("/api/v1/sessions/dsh-quiet/messages"));
```

</details>

#### 缺口

- 未用真实不同权限的账号和 peer 检查传输。
  **影响**：无法把项目归属标记作为组织级权限证明。
  **进一步探讨**：对同一服务器用隔离账号和无权限对象测试自动召回与 MCP。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 新增压缩在哪条网络路径生效，何时退回？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

默认 off。client 或 auto 时，runtime 尝试以 Agent 的 provider、配置或 Agent 的 model 和当前取消信号创建压缩函数。共享模块在有客户端函数的 auto 下不请求服务端 rewrite，缺函数时 auto 委托服务器，client 缺函数保留原召回。服务端已给 digest 或标出没有相关材料时，共享模块不重复展开。达到字符门槛时，压缩请求包含查询及限定长度的记忆，调用同一宿主 provider 的 LLM 流，无工具、没有新 Agent 循环、不写会话。传远程 provider 时会把这些材料带出本机，费用由实际 provider 决定。聚合只接收文本并要求 finish=stop，超时或父信号会结束等待，适配器可能仍发送请求，runtime 不注入取消后的晚结果。共享模块对输出规范化，按已知 URI 修复引用，显式无关则不注入，超时或非法摘要退回原片段；原始检索回退路径还检查注入 token 预算。路径按连接、账号、会话、peer、provider、模型及设置区分，命中另比输入摘要键；缓存保存 digest 原文，既不是隔离机制，也无法证明摘要里的推断准确。这个共享模块由 prepack 生成，不应把 checkout 中缺少 shared/ 目录解释为发布包里缺文件。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:139-168](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/runtime.mjs#L139-L168)

模型选择、信号、缓存路径及晚结果控制。

<details>
<summary>查看原文（30行）</summary>

```text
  async recallMessage(agent, messages, signal) {
    const state = await this.initialize(agent);
    if (!state.ready || !isRecallEnabled(state.config)) return null;
    const query = promptText(messages);
    if (!query || query.length < state.config.minQueryLength) return null;
    if (signal?.aborted) return null;
    const runCompressor = ["client", "auto"].includes(state.config.recallRewrite)
      ? createRecallCompressor(agent, state.config, signal) : null;
    const cacheId = createHash("sha256").update(JSON.stringify([
      state.config.baseUrl, state.config.account, state.config.user, state.config.apiKey,
      state.config.peerId, state.ovSessionId, agent.options?.provider,
      state.config.recallCompressModel || agent.options?.model,
      state.config.recallCompressThinking,
    ])).digest("hex");
    const block = await buildRecallBlock(
      (path, init, options) => this.client.fetchJSON(path, init, options),
      state.config,
      query,
      {
        runCompressor,
        localCompressorAvailable: Boolean(runCompressor),
        digestCachePath: join(stateDir(), `dsh-recall-${cacheId}.json`),
        actorPeerId: state.config.peerId,
        legacyPeerId: state.config.legacyPeerId,
        sessionId: state.ovSessionId,
        excludeUris: state.config.recallExcludeUris,
        log: (stage, data) => this.log(stage, data),
      },
    );
    return block && !signal?.aborted ? pluginMessage(block, { form: "recall" }) : null;
```

</details>

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/compressor.mjs:4-55](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/compressor.mjs#L4-L55)

单次生成、无工具、finish 状态和取消。

<details>
<summary>查看原文（52行）</summary>

```text
/** One host model call, without an agent loop, tools, or session-log writes. */
export function createRecallCompressor(agent, config, signal) {
  const llm = agent.ctx?.llm;
  const provider = agent.options?.provider;
  const model = config.recallCompressModel || agent.options?.model;
  if (!llm?.stream || !provider || !model) return null;

  return async prompt => {
    const controller = new AbortController();
    const abort = () => controller.abort(signal.reason);
    if (signal?.aborted) abort();
    else signal?.addEventListener("abort", abort, { once: true });
    const timer = setTimeout(
      () => controller.abort(new Error("Recall compression timed out")),
      config.recallCompressTimeoutMs,
    );
    let rejectAbort;
    const aborted = new Promise((_, reject) => {
      rejectAbort = () => reject(controller.signal.reason);
      controller.signal.addEventListener("abort", rejectAbort, { once: true });
      if (controller.signal.aborted) rejectAbort();
    });
    try {
      const generate = async () => {
        controller.signal.throwIfAborted();
        const output = new BlockAssembler();
        let stopped = false;
        for await (const chunk of llm.stream({
          provider,
          model,
          ...(config.recallCompressThinking ? { reasoningEffort: config.recallCompressThinking } : {}),
          messages: [pluginMessage(prompt)],
          tools: [],
          signal: controller.signal,
        })) {
          controller.signal.throwIfAborted();
          output.push(chunk);
          if (chunk.type === "finish") {
            if (chunk.reason.kind !== "stop") throw new Error(`Recall compression: ${chunk.reason.kind}`);
            stopped = true;
          }
        }
        if (!stopped) throw new Error("Recall compression ended without a successful finish");
        return output.blocks().filter(block => block.type === "text").map(block => block.text).join("\n");
      };
      // Bound the hook even if a provider fails to honor cancellation promptly.
      return await Promise.race([generate(), aborted]);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      controller.signal.removeEventListener("abort", rejectAbort);
    }
```

</details>

**依据 3 · 源码核查**：[examples/memory-plugin-shared/lib/recall-core.mjs:148-158](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/memory-plugin-shared/lib/recall-core.mjs#L148-L158)

server 与无客户端能力的 auto 请求改写。

<details>
<summary>查看原文（11行）</summary>

```text
  const excludeUris = Array.isArray(options.excludeUris) ? options.excludeUris.slice(0, 200) : [];
  if (excludeUris.length) body.exclude_uris = excludeUris;

  if (rewriteMode === "server") body.rewrite = true;
  else if (rewriteMode === "auto" && !options.localCompressorAvailable) body.rewrite = "auto";
  const rewriteMaxBullets = Math.max(
    1,
    Math.floor(Number(cfg.recallCompressMaxBullets || DEFAULT_REWRITE_MAX_BULLETS)),
  );
  const rewriteMaxBulletsConfigured = cfg.recallCompressMaxBulletsConfigured === true;
  if (body.rewrite !== undefined && rewriteMaxBulletsConfigured) {
```

</details>

**依据 4 · 源码核查**：[examples/memory-plugin-shared/lib/recall-core.mjs:576-606](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/memory-plugin-shared/lib/recall-core.mjs#L576-L606)

共享模块接管已有摘要、无相关和错误回退。

<details>
<summary>查看原文（31行）</summary>

```text
function wantsLocalCompression(cfg, options) {
  const mode = String(cfg.recallRewrite || "off").toLowerCase();
  return (mode === "client" || mode === "auto")
    && options.localCompressorAvailable !== false
    && typeof options.runCompressor === "function";
}

// Context, legacy recall, and raw retrieval share the same result policy.
// The host callback only runs its model; it never chooses a fallback or digest.
async function finalizeRecall(result, cfg, query, options, log, shortContext) {
  const selected = selectRecallContent(result);
  if (String(result.stats?.rewrite || "").toLowerCase() === "no_relevant") return "";
  const entries = (result.entries || []).map(normalizeContextEntry).filter((entry) => entry.uri);
  const rendered = String(result.rendered || "").trim();
  if (String(result.digest || "").trim() || !wantsLocalCompression(cfg, options)) return selected;
  const fallback = shortContext ?? (entries.length ? formatFallback(entries, cfg).rendered : rendered);
  const input = rendered || entries.map((entry) => `${entry.uri}\n${entry.text}`).join("\n");
  if (!input) return "";
  try {
    const compression = await compressRecallContext({
      query, rendered: input, shortContext: shortContext ?? (rendered || fallback),
      entries, cfg, runCompressor: options.runCompressor,
      cachePath: options.digestCachePath || stateFile("recall-digest.json"), now: Date.now(),
    });
    log("recall_local_compression", { status: compression.status });
    if (compression.status === "ok") return compression.context;
    if (compression.status === "empty") return "";
  } catch (err) {
    log("recall_local_compression_failed", { error: String(err?.message || err) });
  }
  return fallback;
```

</details>

**依据 5 · 源码核查**：[examples/memory-plugin-shared/lib/recall-core.mjs:757-775](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/memory-plugin-shared/lib/recall-core.mjs#L757-L775)

原始检索路径回退及末尾预算。

<details>
<summary>查看原文（19行）</summary>

```text
  const local = wantsLocalCompression(cfg, options);
  const inputLimit = Math.max(1000, Number(cfg.recallCompressMaxInputChars || 18000));
  const contentCfg = local ? { ...cfg, recallPreferAbstract: false, recallMaxContentChars: inputLimit } : cfg;
  const entries = await Promise.all(picked.map(async (item) => ({
    ...item, text: await resolveItemContent(fetchJSON, item, contentCfg, actorPeerId),
  })));
  const fallback = formatFallback(entries, cfg, log);
  let text = await finalizeRecall({
    rendered: local ? entries.map((item) => `${item.uri}\n${item.text}`).join("\n").slice(0, inputLimit) : fallback.rendered,
    entries,
  }, cfg, trimmed, options, log, fallback.rendered);
  if (estimateTokens(wrapContext(text)) > Math.max(200, Number(cfg.recallTokenBudget || 2000))) {
    text = fallback.rendered;
  }
  if (!text) return emptyRecall("no_results");
  const unchanged = text === fallback.rendered;
  return {
    block: wrapContext(text), contentCount: unchanged ? fallback.contentCount : 1,
    hintCount: unchanged ? fallback.hintCount : 0,
```

</details>

**依据 6 · 源码核查**：[examples/memory-plugin-shared/lib/recall-compress-core.mjs:160-210](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/memory-plugin-shared/lib/recall-compress-core.mjs#L160-L210)

最短长度、缓存键、URI 修复与摘要写入。

<details>
<summary>查看原文（51行）</summary>

```text
export async function compressRecallContext({
  query,
  rendered,
  shortContext = rendered,
  entries = [],
  cfg = {},
  runCompressor,
  cachePath = "",
  now = 0,
}) {
  const input = String(rendered || "").trim();
  if (!input) return { status: COMPRESS_EMPTY, context: "" };
  const minChars = Math.max(0, Number(cfg.recallCompressMinInputChars ?? 1500));
  if (input.length < minChars) {
    return { status: COMPRESS_OK, context: String(shortContext ?? input).trim() };
  }

  const maxInputChars = Math.max(1000, Number(cfg.recallCompressMaxInputChars || 18000));
  const maxBullets = Math.max(1, Number(cfg.recallCompressMaxBullets || 6));
  const key = recallDigestCacheKey({
    query,
    rendered: input,
    entries,
    maxInputChars,
    maxBullets,
  });
  const cached = await readCache(cachePath);
  if (cached?.key === key && typeof cached.digest === "string") {
    const digest = normalizeCompressedContext(cached.digest, 4000, maxBullets);
    if (digest) return { status: COMPRESS_OK, context: digest };
  }

  const prompt = buildRecallCompressionPrompt({
    query,
    rendered: input.slice(0, maxInputChars),
    maxBullets,
  });
  const raw = await runCompressor(prompt);
  const normalized = normalizeCompressedContext(raw, 4000, maxBullets);
  if (normalized === null) return { status: COMPRESS_FAILED, context: "" };
  if (!normalized) return { status: COMPRESS_EMPTY, context: "" };

  const validUris = entries.map((entry) => entry?.uri).filter(Boolean);
  const repaired = repairDigestUris(normalized, validUris.length
    ? validUris
    : (input.match(/viking:\/\/[^\s<>"']+/g) || []));
  const digest = normalizeCompressedContext(repaired, 4000, maxBullets);
  if (!digest) return { status: COMPRESS_FAILED, context: "" };

  await writeCache(cachePath, { key, digest, updatedAt: now || 0 });
  return { status: COMPRESS_OK, context: digest };
```

</details>

**依据 7 · 源码核查**：[examples/dsh-memory-plugin/package.json:13-45](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/package.json#L13-L45)

包内 shared 和预打包同步。

<details>
<summary>查看原文（33行）</summary>

```text
  "files": [
    "icon.svg",
    "index.mjs",
    "client.mjs",
    "config.mjs",
    "capture.mjs",
    "lifecycle.mjs",
    "mcp.mjs",
    "mcp-env.mjs",
    "runtime.mjs",
    "compressor.mjs",
    "session-id.mjs",
    "skills.mjs",
    "uri-guard.mjs",
    "servers/",
    "shared/",
    "skills/",
    "locale/",
    "docs/",
    "cordis.patch.yml",
    "README.md"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "scripts": {
    "prepack": "node ../memory-plugin-shared/sync.mjs",
    "check": "for f in *.mjs shared/*.mjs; do node --check \"$f\" || exit 1; done && npm run check:version",
    "check:version": "node --input-type=module -e \"import {readFileSync} from 'node:fs'; const {PLUGIN_VERSION} = await import('./config.mjs'); const v = JSON.parse(readFileSync('package.json','utf8')).version; if (PLUGIN_VERSION !== v) throw new Error('PLUGIN_VERSION ' + PLUGIN_VERSION + ' does not match package.json version ' + v);\"",
    "test": "node --test *.test.mjs",
    "prepublishOnly": "npm run prepack && npm run check && npm test"
```

</details>

**依据 8 · 源码核查**：[examples/memory-plugin-shared/sync.mjs:47-55](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/memory-plugin-shared/sync.mjs#L47-L55)

DSH 使用打包生成的 shared。

```text
    root: join(ROOT, "examples", "opencode-plugin"),
    dir: join(ROOT, "examples", "opencode-plugin", "lib", "shared"),
    committed: false,
  },
  {
    root: join(ROOT, "examples", "dsh-memory-plugin"),
    dir: join(ROOT, "examples", "dsh-memory-plugin", "shared"),
    committed: false,
  },
```

#### 缺口

- 没有真实模型输出、单位成本和延迟样本。
  **影响**：无法证明新调用带来净节省或参考记忆完整。
  **进一步探讨**：用相同请求比较 off、client、server 的引用正确率、额外调用与步前耗时。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些写入告警后放弃，哪些停止捕获后还会重放？

**研究主题**：缺陷与关键质疑、工程质量与复用、功能与机制

#### 完整回答

一会话内按 promise 队列串行写。提交触发来自 turn/end 的 pending_tokens 门槛，或 compaction/start 的主动提交；退出有单独最后提交与三秒上限。暂时性失败的捕获或提交可以落盘，积压时后续消息先落盘，新消息入队后清理旧提交票据，最后提交留在它们之后。初始化路径仅在启用捕获时主动重放，进程定时任务则依据整个待发队列和服务器健康状态重放，并重新读取每个会话是否仍有积压；这说明关闭新捕获不应被理解为清除旧项或取消后续发送。flush 只等当前会话的进程内 promise；远端抽取成功和磁盘积压为空要另查。本轮新增永久错误按阶段每会话提示，使用固定路径模板、状态、有限错误码；成功后复位。重试错误另走队列，不能从一次警告推断保存成功。某些 debug 分支仍拼接异常或服务器错误消息，所以警告不含正文并不能替代检查整体日志配置。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:171-235](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/runtime.mjs#L171-L235)

捕获、阈值和 compaction 触发，以及暂时性失败入队。

<details>
<summary>查看原文（65行）</summary>

```text
  capture(session, event) {
    const state = this.stateFor(session);
    if (!isCaptureEnabled(state.config)) return;
    const payload = captureEvent(event, state.config, state.toolNames);
    if (!payload) return;
    this.enqueueWrite(state, async () => {
      if (state.hasPendingWrites) {
        await this.enqueuePendingMessage(state, payload);
        return;
      }
      if (!state.ready && !(await this.ensureState(state)).ready) {
        if (state.initializationRetryable) {
          await this.enqueuePendingMessage(state, payload);
        }
        return;
      }
      if (state.hasPendingWrites) {
        await this.enqueuePendingMessage(state, payload);
        return;
      }
      const response = await this.client.addMessage(
        state.ovSessionId,
        payload,
        state.config.peerId,
      );
      this.reportWriteResult(state, "capture", response, "/api/v1/sessions/{session_id}/messages");
      if (isRetryableFailure(response)) {
        await this.enqueuePendingMessage(state, payload);
      }
    });
  }

  maybeCommit(session, event) {
    // DSH appends compaction/start before it summarizes and rewrites history,
    // so commit there regardless of the threshold, like PreCompact elsewhere.
    const boundary = event.type === "compaction/start";
    if (event.type !== "turn/end" && !boundary) return;
    const state = this.stateFor(session);
    if (!isCaptureEnabled(state.config)) return;
    this.enqueueWrite(state, async () => {
      if (state.hasPendingWrites) return;
      if (!state.ready && !(await this.ensureState(state)).ready) return;
      if (!boundary) {
        const metadata = await this.client.getSession(
          state.ovSessionId,
          state.config.peerId,
        );
        if (Number(metadata?.pending_tokens || 0) < state.config.commitTokenThreshold) return;
      }
      const response = await this.client.commitSession(
        state.ovSessionId,
        state.config.peerId,
      );
      const stage = boundary ? "compaction_commit" : "commit";
      this.reportWriteResult(state, stage, response, "/api/v1/sessions/{session_id}/commit");
      this.log(stage, {
        sessionId: state.ovSessionId,
        ok: response.ok,
        trace_id: response.result?.trace_id || response.traceId,
        error: response.ok ? undefined : response.error?.message || response.error?.code,
      });
      if (isRetryableFailure(response)) {
        await this.enqueueFinalCommit(state, { keep_recent_count: 0 });
      }
    });
```

</details>

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:238-273](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/runtime.mjs#L238-L273)

退出时最终提交、定时器预算、状态释放。

<details>
<summary>查看原文（36行）</summary>

```text
  dispose(session) {
    const state = this.states.get(session.id);
    if (!state) return;
    if (state.disposing) return state.disposing;
    state.disposing = (async () => {
      this.enqueueWrite(state, async () => {
        if (!isCaptureEnabled(state.config)) return;
        const commitPayload = { keep_recent_count: 0 };
        if (state.hasPendingWrites) {
          await this.enqueueFinalCommit(state, commitPayload);
          return;
        }
        if (!state.ready && !(await this.ensureState(state)).ready) return;
        const response = await this.client.commitSession(
          state.ovSessionId,
          state.config.peerId,
          { timeoutMs: Math.min(3000, Number(state.config.requestTimeoutMs) || 3000) },
        );
        this.reportWriteResult(state, "shutdown_commit", response, "/api/v1/sessions/{session_id}/commit");
        this.log("shutdown_commit", {
          sessionId: state.ovSessionId,
          ok: response.ok,
          trace_id: response.result?.trace_id || response.traceId,
        });
        if (isRetryableFailure(response)) {
          await this.enqueueFinalCommit(state, commitPayload);
        }
      });
      try {
        await state.writes;
      } finally {
        if (this.states.get(session.id) === state) this.states.delete(session.id);
      }
    })();
    return state.disposing;
  }
```

</details>

**依据 3 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:281-317](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/runtime.mjs#L281-L317)

warning 脱敏与 debug 输出分支的差异。

<details>
<summary>查看原文（37行）</summary>

```text
  enqueueWrite(state, operation) {
    state.writes = state.writes
      .then(async () => {
        await operation();
        state.warnedFailures.delete("write_error");
      })
      .catch(error => {
        this.log("write_error", {
          sessionId: state.ovSessionId,
          error: error instanceof Error ? error.message : String(error),
        });
        this.warnOnce(state, "write_error", {});
      });
  }

  reportWriteResult(state, stage, response, path) {
    if (response.ok) {
      state.warnedFailures.delete(stage);
    } else if (!isRetryableFailure(response)) {
      // Error messages/bodies may echo captured content or credentials. Keep
      // only a bounded code token and a static endpoint template in warnings.
      const code = response.error?.code;
      this.warnOnce(state, stage, {
        path,
        status: Number(response.status) || 0,
        code: typeof code === "string" && /^[A-Z][A-Z0-9_]{0,63}$/.test(code) ? code : undefined,
      });
    }
  }

  warnOnce(state, stage, data) {
    if (state.warnedFailures.has(stage)) return;
    state.warnedFailures.add(stage);
    this.logger?.warn?.(`[openviking:dsh] ${stage} ${JSON.stringify({
      sessionId: state.ovSessionId,
      ...data,
    })}`);
```

</details>

**依据 4 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:343-392](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/runtime.mjs#L343-L392)

提交队列次序和状态回读。

<details>
<summary>查看原文（50行）</summary>

```text
  async enqueueFinalCommit(state, payload) {
    await this.removePendingCommits(state);
    return this.enqueuePending(state, "commitSession", payload);
  }

  async enqueuePendingMessage(state, payload) {
    const result = await this.enqueuePending(state, "addMessage", payload);
    if (result.ok) await this.removePendingCommits(state);
    return result;
  }

  async removePendingCommits(state) {
    const pending = await listPending();
    for (const item of pending) {
      if (
        item.entry?.type === "commitSession"
        && item.entry.sessionId === state.ovSessionId
      ) {
        await dequeue(item.filename);
      }
    }
  }

  async refreshPendingState(state) {
    const wasPending = state.hasPendingWrites;
    const pending = (await listPending()).filter(
      item => item.entry?.sessionId === state.ovSessionId,
    );
    state.hasPendingWrites = pending.length > 0;
    state.pendingCreatedAt = pending.reduce(
      (latest, item) => Math.max(latest, Number(item.entry?.createdAt || 0)),
      state.pendingCreatedAt,
    );
    // Only the flip back to direct sends is logged: the recovery moment that
    // proves the drainer worked, once per outage.
    if (wasPending && !state.hasPendingWrites) {
      this.log("pending_cleared", { sessionId: state.ovSessionId });
    }
  }

  /**
   * Replay the pending queue through this runtime's client. The session-start
   * path calls it without options and keeps consuming retries; the drainer
   * passes consumeRetries:false so transient failures stay retryable.
   */
  async replayPendingQueue(options = {}) {
    await replayPending(
      (path, init) => this.client.fetchJSON(path, init),
      (stage, data) => this.log(stage, data),
      options,
```

</details>

**依据 5 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:404-458](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/runtime.mjs#L404-L458)

定时健康检查、重放与 flush 的边界。

<details>
<summary>查看原文（55行）</summary>

```text
  async drainTick() {
    if (this.drainRunning) return;
    this.drainRunning = true;
    try {
      const pending = await listPending();
      if (pending.length > 0) {
        const health = await this.client.healthResult();
        if (!health.ok) {
          // Only the flip into the outage is logged, not every 60s probe.
          if (this.drainHealth !== false) {
            this.log("drain_health_down", { status: health.status || 0 });
          }
          this.drainHealth = false;
        } else {
          if (this.drainHealth === false) {
            this.log("drain_health_restored", {});
          }
          this.drainHealth = true;
          await this.replayPendingQueue({ consumeRetries: false });
        }
      }
      for (const state of this.states.values()) {
        await this.refreshPendingState(state);
      }
    } finally {
      this.drainRunning = false;
    }
  }

  /**
   * Start the background drainer. The interval is fixed per process; each tick
   * is single-flight, so a slow replay run never overlaps the next one.
   */
  startDrainer() {
    if (this.drainTimer) return this.drainTimer;
    const parsed = parseInt(process.env.OPENVIKING_PENDING_DRAIN_INTERVAL_MS || "", 10);
    const intervalMs = Number.isFinite(parsed) && parsed > 0 ? parsed : 60000;
    this.drainTimer = setInterval(() => {
      this.drainPromise = this.drainTick().catch(error => this.log("drain_error", {
        error: error instanceof Error ? error.message : String(error),
      }));
    }, intervalMs);
    this.drainTimer.unref?.();
    return this.drainTimer;
  }

  stopDrainer() {
    if (!this.drainTimer) return;
    clearInterval(this.drainTimer);
    this.drainTimer = null;
  }

  async flush(session) {
    const state = this.states.get(session.id);
    if (state) await state.writes;
```

</details>

#### 缺口

- 远端抽取完成状态以及跨进程队列并发未实测。
  **影响**：本地 flush 和服务器回复都不足以完成退出或删除验证。
  **进一步探讨**：注入离线再恢复，核对已排队标记及远端材料，验证销毁会话后是否继续补发。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么工作负担与数据治理会改变建议？

**研究主题**：效果与总成本、采用判断

#### 完整回答

继续观察已有 OpenViking 服务且需要跨会话复用项目决策的团队。首次要对齐宿主依赖、服务器凭据、工作区和捕获策略；持续会占用前置召回等待、服务器检索或抽取资源，启用压缩时还可能追加一次供应商推理及磁盘摘要。人工需要验出处、判定同项目跨工作区合并是否合理、定期查异常积压。失败时停用新的捕获仍要盘点 pending 及远端已保存材料；关停运行时尝试提交，不能视为远端撤回。普通队列恢复不等于保密边界恢复。当前较合适的下一个判据是授权的临时服务与临时 profile 读取一条无敏感信息的唯一标记，复查服务端抽取、正确 peer、来源引用、关闭后积压去向再考虑扩大。先保持默认 off 能把新压缩变量排除在服务回归之外。作者的集成记录以模拟 HTTP/MCP 与确定模型为主，真实抽取门槛另有 opt-in 测试。一次合格结果以新会话能复核标记、不会跨错项目且退出可说明为单位，现金支出、延迟与人工耗时分别记录。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/package.json:47-58](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/package.json#L47-L58)

运行 peer 范围与开发环境 pin。

<details>
<summary>查看原文（12行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-llm": ">=0.1.0-rc.6 <1.0.0-0",
    "@deepseek-ai/dsh-mcp-client": ">=0.1.0-rc.6 <1.0.0-0",
    "@deepseek-ai/dsh-skill-filesystem": ">=0.1.0-rc.6 <1.0.0-0"
  },
  "devDependencies": {
    "@deepseek-ai/dsh-llm": "0.1.0-rc.6",
    "@deepseek-ai/dsh-mcp-client": "0.1.0-rc.6",
    "@deepseek-ai/dsh-skill-filesystem": "0.1.0-rc.6",
    "@deepseek-ai/dsh-tools": "0.1.0-rc.6",
    "semver": "7.8.5"
  },
```

</details>

**依据 2 · 作者声明**：[examples/dsh-memory-plugin/README.md:367-382](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/README.md#L367-L382)

作者限定集成测试环境，另有真实服务器验收。

<details>
<summary>查看原文（16行）</summary>

```text
and browser loading, skill discovery/read, MCP tool calls, profile/recall
injection, user/assistant capture, resume deduplication, threshold commits, and
disposal commits. The check used a local HTTP/MCP fixture and a deterministic
model adapter on macOS with Node.js 26.5.0; it verifies harness integration, not
real-server memory extraction. The rc.2 CLI also exited cleanly on SIGTERM.

The startup failure from issue #4944 was reproduced by adding the reported
old skill packages to an rc.2 profile; removing those direct dependencies and
reinstalling the bundle restored the same integration checks. A clean rc.2
profile with the published `0.3.0` bundle did not reproduce that import error.

`live-recall.test.mjs` is an opt-in end-to-end gate against a real OpenViking
server: it stores a sentinel memory through a session commit, waits for
extraction, and asserts recall returns that sentinel — the property no stub
can certify. Enable it with `OPENVIKING_E2E=1` plus the normal credential
chain; it skips otherwise (including in CI until a server secret exists).
```

</details>

**依据 3 · 作者声明**：[examples/dsh-memory-plugin/README.md:384-421](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/README.md#L384-L421)

开启模型路径、取消、缓存和宿主测试边界。

<details>
<summary>查看原文（38行）</summary>

````text
### Client-side recall compression

Compression stays off by default. To use DSH's configured model instead of the
server query planner, merge this into `~/.openviking/ovcli.conf` and restart DSH:

```json
{"plugin":{"dsh":{"recallCompress":"client","recallCompressTimeoutMs":10000}}}
```

The plugin makes one tool-free `ctx.llm.stream()` call using the agent's
`options.provider` and `options.model`. `recallCompressModel` optionally selects
another model on that same provider; `recallCompressThinking` supplies a
provider-supported reasoning effort. Credentials and endpoints belong to DSH's
provider configuration, not OpenViking's server credentials. DSH does not use
`recallCompressBaseUrl` or the CLI compressor detection settings. “Client-side”
means the call runs through DSH; inference is on-device only if that DSH provider
points to a local model service. Model switches implemented solely by host request
middleware are not inferred from `agent.options`; configure the compressor model
explicitly or restart with the intended model.

`client` never requests server rewrite. `auto` prefers the host compressor when
its model/service are available, otherwise retains server `rewrite: "auto"`.
`server` and `off` keep their existing behavior. An unavailable host compressor in
`client` mode leaves the retrieved context uncompressed. Short input skips the
model call; the shared input limit, cited-digest handling and fallback still apply.
Timeouts, unsuccessful streams and invalid digests fall back to budgeted original
fragments; an explicitly irrelevant result injects nothing. Cancellation stops
waiting and signals the adapter. An adapter that ignores abort may continue its
request, but cannot inject its late result. Auxiliary messages are not appended
to the session or captured as memories. Digest caches are separated by connection,
identity, session and model. Shared compression status is logged through DSH.

The compressor contract is checked against the published `@deepseek-ai/dsh-llm`
`0.1.0-rc.6` service/types: `LlmRuntime.stream`, `BlockAssembler`, successful
`finish.reason.kind === "stop"`, and `GenerateOptions.signal`. The adapter uses no
agent creation, prompt assembly, tools, or session append API. Unit and packaged
service smoke tests cover Linux; real-model quality/latency and Desktop behavior
still require deployment validation.
````

</details>

**依据 4 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:238-269](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/runtime.mjs#L238-L269)

退出有最终写入。

<details>
<summary>查看原文（32行）</summary>

```text
  dispose(session) {
    const state = this.states.get(session.id);
    if (!state) return;
    if (state.disposing) return state.disposing;
    state.disposing = (async () => {
      this.enqueueWrite(state, async () => {
        if (!isCaptureEnabled(state.config)) return;
        const commitPayload = { keep_recent_count: 0 };
        if (state.hasPendingWrites) {
          await this.enqueueFinalCommit(state, commitPayload);
          return;
        }
        if (!state.ready && !(await this.ensureState(state)).ready) return;
        const response = await this.client.commitSession(
          state.ovSessionId,
          state.config.peerId,
          { timeoutMs: Math.min(3000, Number(state.config.requestTimeoutMs) || 3000) },
        );
        this.reportWriteResult(state, "shutdown_commit", response, "/api/v1/sessions/{session_id}/commit");
        this.log("shutdown_commit", {
          sessionId: state.ovSessionId,
          ok: response.ok,
          trace_id: response.result?.trace_id || response.traceId,
        });
        if (isRetryableFailure(response)) {
          await this.enqueueFinalCommit(state, commitPayload);
        }
      });
      try {
        await state.writes;
      } finally {
        if (this.states.get(session.id) === state) this.states.delete(session.id);
```

</details>

**依据 5 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:404-427](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/runtime.mjs#L404-L427)

后台可重放已有积压。

<details>
<summary>查看原文（24行）</summary>

```text
  async drainTick() {
    if (this.drainRunning) return;
    this.drainRunning = true;
    try {
      const pending = await listPending();
      if (pending.length > 0) {
        const health = await this.client.healthResult();
        if (!health.ok) {
          // Only the flip into the outage is logged, not every 60s probe.
          if (this.drainHealth !== false) {
            this.log("drain_health_down", { status: health.status || 0 });
          }
          this.drainHealth = false;
        } else {
          if (this.drainHealth === false) {
            this.log("drain_health_restored", {});
          }
          this.drainHealth = true;
          await this.replayPendingQueue({ consumeRetries: false });
        }
      }
      for (const state of this.states.values()) {
        await this.refreshPendingState(state);
      }
```

</details>

#### 缺口

- 没有部署成本或目标团队数据分类实测。
  **影响**：不能将额外模型支出与减少主轮 token 的净值混为一谈。
  **进一步探讨**：测量恢复原任务的累计费用、延迟、合格率、人审和退出处置时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否提供可核查的积压处置和压缩来源？

**研究主题**：新假设与验证

#### 完整回答

可尝试在同一会话只读界面展示新捕获状态、既有待发计数、最后健康重放和最近一次压缩是原文、服务器改写、主机摘要还是无相关。积压和自动注入由两个路径决定，当前 warn 去重有助于减少重复提醒却不能解释旧项还会发送。摘要状态来自共享块，管理员需要看到它去向和是否经过外部 provider。诊断回执只展示计数、状态与已验证的配置类别，正文、凭据和会话原始 ID 不应进入面向共享的回执。先用临时服务器依次制造永久拒绝、暂时离线、捕获关闭后恢复、压缩超时和无关标记，比较仅查日志与带回执时对远端行为的预测准确率。如果分类无法与服务器实收记录对上，或操作者同样容易通过当前日志正确定位，便不应增加控制层。暂停／丢弃已有队列若另做功能，需要由队列所有者明确确认并验证重复重放和过期的行为。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:296-317](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/runtime.mjs#L296-L317)

告警可分类，但只报告有限故障状态。

<details>
<summary>查看原文（22行）</summary>

```text
  reportWriteResult(state, stage, response, path) {
    if (response.ok) {
      state.warnedFailures.delete(stage);
    } else if (!isRetryableFailure(response)) {
      // Error messages/bodies may echo captured content or credentials. Keep
      // only a bounded code token and a static endpoint template in warnings.
      const code = response.error?.code;
      this.warnOnce(state, stage, {
        path,
        status: Number(response.status) || 0,
        code: typeof code === "string" && /^[A-Z][A-Z0-9_]{0,63}$/.test(code) ? code : undefined,
      });
    }
  }

  warnOnce(state, stage, data) {
    if (state.warnedFailures.has(stage)) return;
    state.warnedFailures.add(stage);
    this.logger?.warn?.(`[openviking:dsh] ${stage} ${JSON.stringify({
      sessionId: state.ovSessionId,
      ...data,
    })}`);
```

</details>

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:404-427](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/dsh-memory-plugin/runtime.mjs#L404-L427)

积压与健康决定实际重放。

<details>
<summary>查看原文（24行）</summary>

```text
  async drainTick() {
    if (this.drainRunning) return;
    this.drainRunning = true;
    try {
      const pending = await listPending();
      if (pending.length > 0) {
        const health = await this.client.healthResult();
        if (!health.ok) {
          // Only the flip into the outage is logged, not every 60s probe.
          if (this.drainHealth !== false) {
            this.log("drain_health_down", { status: health.status || 0 });
          }
          this.drainHealth = false;
        } else {
          if (this.drainHealth === false) {
            this.log("drain_health_restored", {});
          }
          this.drainHealth = true;
          await this.replayPendingQueue({ consumeRetries: false });
        }
      }
      for (const state of this.states.values()) {
        await this.refreshPendingState(state);
      }
```

</details>

**依据 3 · 源码核查**：[examples/memory-plugin-shared/lib/recall-core.mjs:585-606](https://github.com/volcengine/OpenViking/blob/d462af04e651335261d4972cb546788a788b2a47/examples/memory-plugin-shared/lib/recall-core.mjs#L585-L606)

不同原因各自返回摘要、原片段或空。

<details>
<summary>查看原文（22行）</summary>

```text
async function finalizeRecall(result, cfg, query, options, log, shortContext) {
  const selected = selectRecallContent(result);
  if (String(result.stats?.rewrite || "").toLowerCase() === "no_relevant") return "";
  const entries = (result.entries || []).map(normalizeContextEntry).filter((entry) => entry.uri);
  const rendered = String(result.rendered || "").trim();
  if (String(result.digest || "").trim() || !wantsLocalCompression(cfg, options)) return selected;
  const fallback = shortContext ?? (entries.length ? formatFallback(entries, cfg).rendered : rendered);
  const input = rendered || entries.map((entry) => `${entry.uri}\n${entry.text}`).join("\n");
  if (!input) return "";
  try {
    const compression = await compressRecallContext({
      query, rendered: input, shortContext: shortContext ?? (rendered || fallback),
      entries, cfg, runCompressor: options.runCompressor,
      cachePath: options.digestCachePath || stateFile("recall-digest.json"), now: Date.now(),
    });
    log("recall_local_compression", { status: compression.status });
    if (compression.status === "ok") return compression.context;
    if (compression.status === "empty") return "";
  } catch (err) {
    log("recall_local_compression_failed", { error: String(err?.message || err) });
  }
  return fallback;
```

</details>

#### 缺口

- 可读回执尚无实现或使用验证。
  **影响**：不能声称降低误判。
  **进一步探讨**：用相同故障事件盲测操作者能否预测下一条网络请求。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
