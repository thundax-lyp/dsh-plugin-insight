# OpenViking DSH 记忆插件

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[54d4c0f](https://github.com/volcengine/OpenViking/tree/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin)

<!-- BEGIN META -->
[![GitHub ★ 40,955](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C955&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/OpenViking) [![npm 30d 35,928](https://img.shields.io/static/v1?label=npm+30d&message=35%2C928&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin)
<!-- END META -->

> **功能**：为 DSH 提供 OpenViking 画像、召回、消息采集及记忆工具

> **亮点**：贡献在 DSH 事件生命周期、按会话工作区解析身份、过滤合成上下文和进程内待发恢复的组合，能解释减少记忆交接摩擦的机制，但不能证明任务效果。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：不中断任务与记忆完整性不是同一件事：非可重试失败、有限TTL和错误记忆均可能使跨会话结果不可靠；裸 checkout 的共享模块需预打包生成。[Q03](#research-q03)

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
  - [Q01 · 跨会话用户如何从手工笔记转向自动记忆，哪些贡献属于这个 DSH 包？](#detail-section-11)
  - [Q02 · 消息如何被采集、召回并与项目身份绑定？](#detail-section-12)
  - [Q03 · 离线恢复和安装材料是否支持无损记忆的承诺？](#detail-section-13)
  - [Q04 · 在什么条件下可试用，怎样限制记录、恢复和退出成本？](#detail-section-14)
  - [Q05 · 如何把失败不中断推进为可解释的记忆完整性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有 OpenViking 的 DSH 用户，自动带入跨会话背景并采集可持续检索的项目记忆。

原办法是手工项目笔记与重述上下文；该包减少人工捕获和召回操作，服务端记忆能力不算作本包原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自动记忆事件 | 画像、召回、采集和提交 | 有效服务、身份与宿主事件 |
| MCP 与 Skill | 按需访问记忆工具 | 桥接依赖，需独立验收 |
| 待发恢复 | 短期故障后继续写入 | 有限TTL和重试，不保证无损 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| OpenViking 服务及凭证 | 必需 | 存储、提炼、画像和召回 | 主任务可继续，但记忆可能缺失 |
| DSH 事件及三个 peer 模块 | 必需 | 事件、消息与 MCP/Skill 接入 | 加载或事件接线不成立 |
| prepack 生成 shared | 源码安装必需 | 复制共享依赖闭包 | 裸 checkout 不能直接导入 |
| 可写 pending 目录 | 离线恢复必需 | 暂存敏感会话负载 | 无法将失败安全留待重放 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配置 | 用户核对服务与有效身份 | 单项目测试账号可读写 |
| 加载 | 宿主注册事件、工具与 Skill | 包内共享依赖齐备 |
| 任务 | 自动采集与召回，人工检查错误记忆 | 不串项目、能纠正偏好 |
| 恢复退出 | 核对待发、服务端记忆及开关 | 禁用后停止新增，单独处理留存 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 服务、嵌入与存储资源，金额未知 | 配置身份及兼容验收，耗时未知 | 不适合只需偶发笔记者 |
| 持续使用 | 提炼、召回与上下文资源未知 | 修正错误记忆与权限维护 | 质量收益未对照 |
| 失败恢复 | 队列磁盘及重放模型资源未知 | 排查TTL、日志和待发状态 | 有限缓冲不等于无损 |
| 退出 | 存量数据清理成本未知 | 处理本地队列与服务端记忆 | 关插件不自动抹除留存 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自动交接 | 画像、召回、采集与提交接入事件 | 对真实任务质量的影响 |
| 离线恢复 | 单飞 drainer 与 latch | 长期故障及发布包运行 |
| 上下文防污染 | 合成用户消息过滤 | 错误记忆纠正的真实效果 |

> **思考**：不中断任务与记忆完整性不是同一件事：非可重试失败、有限TTL和错误记忆均可能使跨会话结果不可靠；裸 checkout 的共享模块需预打包生成。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：贡献在 DSH 事件生命周期、按会话工作区解析身份、过滤合成上下文和进程内待发恢复的组合，能解释减少记忆交接摩擦的机制，但不能证明任务效果。[Q01](#research-q01) [Q02](#research-q02)

会话工作区身份解析、保留下游决策字段与过滤合成上下文值得借鉴；恢复链的复杂性来自同时维护内存状态、磁盘队列和服务端会话，移植需重新核对事件顺序及身份契约。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

不中断任务与记忆完整性不是同一件事：非可重试失败、有限TTL和错误记忆均可能使跨会话结果不可靠；裸 checkout 的共享模块需预打包生成。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

已有服务的用户可在非敏感单项目试用，先核对打包文件和身份，再对照手工笔记验证错误纠正、短暂断网和停用。出现串扰或不明缺失即停采集与召回，并保留人工笔记退路。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

生命周期与恢复机制有源码支持；跨会话收益、发布包和真实宿主运行未验收，完整性反馈仅为未验证假设。

- 已检查：作者 README、包清单、源码路径 examples/dsh-memory-plugin/index.mjs、examples/dsh-memory-plugin/runtime.mjs、examples/dsh-memory-plugin/capture.mjs、examples/memory-plugin-shared/lib/pending-queue.mjs、examples/dsh-memory-plugin/package.json、examples/memory-plugin-shared/sync.mjs、examples/dsh-memory-plugin/config.mjs 及固定范围 inventory；组件：examples/dsh-memory-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码核查本组件与直接导入的共享同步器和待发队列原件；共享代码在固定提交 examples/memory-plugin-shared 下，单列为必要依赖，不计为本组件原创。
- 下一步：未安装、未运行目标代码，未执行本地测试、真实宿主或 npm 归档验收；源码检查不证明服务或跨会话效果。

**分析版本**

- **仓库**：[volcengine/OpenViking](https://github.com/volcengine/OpenViking)
- **版本号**：0.5.30（[固定提交 54d4c0f](https://github.com/volcengine/OpenViking/tree/54d4c0fac91fae976325ebed618d7278ff9b5c77)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在待发队列之上公开每会话记忆覆盖与缺失原因，可能帮助用户识别历史缺口，需用故障识别时间和后续错误率验证。[Q05](#research-q05)

未安装、未运行目标代码，未执行本地测试、真实宿主或 npm 归档验收；源码检查不证明服务或跨会话效果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | example | 27 | 3878 | 3295 | 278 | — |
| .md | example | 6 | 939 | — | — | 8493 |

</details>

**活跃度**

[![Issue 未关闭 398](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=398&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 350](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=350&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+created%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z) [![近30天关闭 165](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=165&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨会话用户如何从手工笔记转向自动记忆，哪些贡献属于这个 DSH 包？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨会话用户如何从手工笔记转向自动记忆，哪些贡献属于这个 DSH 包？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适用对象是在 DSH 中反复跨会话处理同一项目、已经运行 OpenViking 的用户。原办法是会话重开后重述背景，或人工维护项目笔记；合格结果是新会话取回相关且未混入其他项目的历史，而不是仅证明写入过消息。此包把启动画像、逐步召回、消息采集、压缩前提交与 MCP 工具接到宿主事件；记忆提炼、存储和检索由服务端及共享库承担。它的具体贡献在 DSH 生命周期适配和失败后继续交付，不是新记忆模型。偶发一次性任务或手工笔记已足够时，引入服务和自动采集的总负担可能更高。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/index.mjs:37-57](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin/index.mjs#L37-L57)

启动画像接入并容忍失败。

<details>
<summary>查看原文（21行）</summary>

```text
  // Per-agent startup: register the session's disposal commit, initialize the
  // OpenViking session, and inject the profile while the agent is still idle.
  // Runs at most once per agent, whichever DSH event reaches it.
  const started = new WeakSet();
  const startAgent = async (agent, signal) => {
    if (skipMemory(agent.session) || started.has(agent)) return false;
    started.add(agent);
    agent.ctx.effect(
      () => () => runtime.dispose(agent.session),
      "openvikingMemory.disposeSession()",
    );
    try {
      return await injectStartupProfile(agent, runtime, signal);
    } catch (error) {
      // A throw from a serial `agent/created` listener fails agent creation;
      // memory startup must never do that. pre-step retries profile delivery.
      runtime.log("startup_error", {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
```

</details>

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/index.mjs:79-114](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin/index.mjs#L79-L114)

逐步召回、采集、提交与 MCP/Skill 挂载。

<details>
<summary>查看原文（36行）</summary>

```text
  ctx.on("agent/pre-step", async ({ agent, messages, signal }, next) => {
    const decision = await next();
    if (skipMemory(agent.session)) return decision;
    if (decision.kind !== "enter" || signal.aborted) return decision;
    const [profile, recall] = await Promise.all([
      runtime.profileMessage(agent),
      runtime.recallMessage(agent, decision.messages),
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

#### 缺口

- 没有同任务跨会话正确率和手工笔记维护量对照
  **影响**：不能认定自动记忆优于人工摘要
  **进一步探讨**：在固定项目任务上比较正确召回、纠错次数和总时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 消息如何被采集、召回并与项目身份绑定？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 注入 agents、sessions、tools，创建运行时后启动单进程待发队列 drainer。stateFor 由 session.id 建状态，并从会话 cwd 重新解析 peer，避免只用进程启动工作目录。启动先探活并确保服务端 session，再构建画像；pre-step 在下游决策后附加画像和用户文本召回，保留其他字段。capture 将真实用户/助手事件整形后串行写入，过滤 plugin 来源和时间上下文等合成用户消息，防止自身注入再次进入记忆。召回取用户输入而排除工具结果。这些机制有助于降低反馈污染，但 peer 命名与后端授权仍是不同层次，不能仅因存在 peerId 宣称强隔离。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/index.mjs:12-35](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin/index.mjs#L12-L35)

运行时与 drainer 挂载。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx, input = {}) {
  const config = resolveConfig(input);
  const client = new OpenVikingClient(config);
  const runtime = new OpenVikingRuntime(client, config, ctx.logger, cwd => (
    // Rebuild from the host input, not the config already merged for boot's cwd.
    // The shared loader preserves host/env precedence over workspace peers.
    resolveConfig(input, process.env, cwd).effectivePeer
  ));
  const skipMemory = session => (
    config.skipSubagentSessions && session?.header?.origin === "subagent"
  );
  ctx.provide("openvikingMemory", runtime);
  ctx.effect(
    () => () => runtime.disposeAll(),
    "openvikingMemory.disposeAll()",
  );
  // The pending-queue drainer is the in-process recovery path: without it a
  // single transient write failure latches capture/commit until the next dsh
  // restart. Started here so every session shares one single-flight drainer.
  runtime.startDrainer();
  ctx.effect(
    () => () => runtime.stopDrainer(),
    "openvikingMemory.stopDrainer()",
  );
```

</details>

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:33-60](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin/runtime.mjs#L33-L60)

按会话 cwd 解析 peer 并保存状态。

<details>
<summary>查看原文（28行）</summary>

```text
  stateFor(session) {
    let state = this.states.get(session.id);
    if (state) return state;
    const cwd = session.header?.cwd || process.cwd();
    const peer = this.resolveSessionPeer?.(cwd) ?? resolveEffectivePeerId({
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
      config: { ...this.config, peerId: peer.peerId, legacyPeerId: peer.legacyPeerId },
      ready: false,
      profileBlock: "",
      profileDelivered: false,
      toolNames: new Map(),
      writes: Promise.resolve(),
      initializationRetryable: false,
      hasPendingWrites: false,
      pendingCreatedAt: 0,
      disposing: null,
    };
    this.states.set(session.id, state);
```

</details>

**依据 3 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:78-115](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin/runtime.mjs#L78-L115)

探活、会话初始化和画像。

<details>
<summary>查看原文（38行）</summary>

```text
  async initializeState(state) {
    state.initializationRetryable = false;
    const health = await this.client.healthResult();
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
      state.initializationRetryable = isRetryableFailure(ensured);
      return state;
    }
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
```

</details>

**依据 4 · 源码核查**：[examples/dsh-memory-plugin/capture.mjs:62-96](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin/capture.mjs#L62-L96)

合成消息过滤和采集字段。

<details>
<summary>查看原文（35行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[examples/dsh-memory-plugin/capture.mjs:99-114](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin/capture.mjs#L99-L114)

召回只取用户输入。

<details>
<summary>查看原文（16行）</summary>

```text
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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 离线恢复和安装材料是否支持无损记忆的承诺？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不支持无条件无损。可重试的消息失败进入本地队列，后续消息先排队；drainer 单飞重放并刷新各会话 latch，使后端恢复后无需重启即可继续。队列原件明确含原始记忆负载，使用目录0700与文件0600，并有默认七天TTL和会话启动重试上限；因此它是有限缓冲，不是无限留存。非可重试初始化失败可能直接结束采集路径，不能把不中断主任务等同于保存成功。组件 checkout 的 shared/ 不存在，但 package prepack 会从 examples/memory-plugin-shared/lib 复制依赖闭包，属于打包设计而非缺源阻断；直接使用裸 checkout 前必须先完成预打包，不能把 npm 发布包内容视作本次已验证。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:150-177](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin/runtime.mjs#L150-L177)

仅特定失败进入队列，非可重试初始化失败会返回。

<details>
<summary>查看原文（28行）</summary>

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
      if (isRetryableFailure(response)) {
        await this.enqueuePendingMessage(state, payload);
      }
```

</details>

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:333-375](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin/runtime.mjs#L333-L375)

drainer 重放并解除 latch。

<details>
<summary>查看原文（43行）</summary>

```text
  async replayPendingQueue(options = {}) {
    await replayPending(
      (path, init) => this.client.fetchJSON(path, init),
      (stage, data) => this.log(stage, data),
      options,
    );
  }

  /**
   * One drainer tick, following the session-start replay flow: probe health
   * first and only replay when the server answers. Replays run without
   * consuming retry budgets, then every session's latch is re-derived from
   * the queue. An empty queue clears the latches with zero HTTP traffic, so
   * once a transient write failure recovers, capture and commit resume on
   * their own without restarting the long-lived dsh process.
   */
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
```

</details>

**依据 3 · 源码核查**：[examples/memory-plugin-shared/lib/pending-queue.mjs:1-40](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/memory-plugin-shared/lib/pending-queue.mjs#L1-L40)

队列原始负载、默认TTL/重试和权限。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * Local pending queue for offline resilience.
 *
 * When the OpenViking server is temporarily unreachable, write operations
 * (addMessage, commitSession) serialize their payloads to
 * `~/.openviking/pending/` as JSON files. The queue is replayed in small
 * batches, either at session-start (consuming retry budgets, with
 * maxRetries/TTL) or by a long-running drainer that passes
 * `consumeRetries: false` so transient failures stay retryable.
 *
 * Each file contains: { type, sessionId, payload, createdAt, retries, dedupKey }
 *
 * Config (env vars):
 *   OPENVIKING_PENDING_DIR         pending queue directory
 *                                  (default: ~/.openviking/pending)
 *   OPENVIKING_PENDING_MAX_RETRIES max retry attempts per item (default: 3)
 *   OPENVIKING_PENDING_TTL_DAYS    max age in days before stale cleanup
 *                                  (default: 7)
 *   OPENVIKING_PENDING_REPLAY_LIMIT max items replayed per session-start
 *                                  (default: 50)
 */

import { mkdir, readdir, readFile, rename, writeFile, unlink, stat, chmod, utimes } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { homedir } from "node:os";
import { isRetryableFailure } from "./retryable.mjs";

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_TTL_DAYS = 7;
const DEFAULT_REPLAY_LIMIT = 50;
const PROCESSING_STALE_MS = 10 * 60 * 1000;
const DEFAULT_PENDING_DIR = () => join(homedir(), ".openviking", "pending");

// Pending queue files may contain raw memory payload / transcript content.
// Use restrictive permissions explicitly so we don't depend on umask.
//   - dir: 0o700  (owner: rwx; group/other: none)
//   - file: 0o600 (owner: rw;  group/other: none)
const PENDING_DIR_MODE = 0o700;
const PENDING_FILE_MODE = 0o600;
```

</details>

**依据 4 · 源码核查**：[examples/dsh-memory-plugin/package.json:39-44](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin/package.json#L39-L44)

prepack 同步共享代码。

```text
  "scripts": {
    "prepack": "node ../memory-plugin-shared/sync.mjs",
    "check": "for f in *.mjs shared/*.mjs; do node --check \"$f\" || exit 1; done && npm run check:version",
    "check:version": "node --input-type=module -e \"import {readFileSync} from 'node:fs'; const {PLUGIN_VERSION} = await import('./config.mjs'); const v = JSON.parse(readFileSync('package.json','utf8')).version; if (PLUGIN_VERSION !== v) throw new Error('PLUGIN_VERSION ' + PLUGIN_VERSION + ' does not match package.json version ' + v);\"",
    "test": "node --test *.test.mjs",
    "prepublishOnly": "npm run prepack && npm run check && npm test"
```

**依据 5 · 源码核查**：[examples/memory-plugin-shared/sync.mjs:11-24](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/memory-plugin-shared/sync.mjs#L11-L24)

共享依赖闭包与 npm 打包原则。

<details>
<summary>查看原文（14行）</summary>

```text
// What a plugin ships equals what it imports, and neither side is written down.
// Hand-kept lists were the drift: a group named after one harness got spread
// into another's, and modules nobody imported ended up vendored into four
// directories while a module somebody did import went missing and became an
// ERR_MODULE_NOT_FOUND on the first hook of a fresh install. Each target below
// only says where its code lives, where its copies go, and whether the copies
// have to be committed; the file set is the transitive closure of what that
// code actually imports.
//
// `committed` is about how the plugin is delivered, not about taste. A host
// that installs by pointing at a directory in this repository can only see
// files git has, so those copies are committed and a bot regenerates them on
// main. A plugin published as an npm package or assembled into a tarball builds
// its copies at pack time, so committing them would only tax every review diff.
```

</details>

**依据 6 · 源码核查**：[examples/memory-plugin-shared/sync.mjs:46-50](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/memory-plugin-shared/sync.mjs#L46-L50)

DSH shared 设为不提交的生成副本。

```text
  {
    root: join(ROOT, "examples", "dsh-memory-plugin"),
    dir: join(ROOT, "examples", "dsh-memory-plugin", "shared"),
    committed: false,
  },
```

#### 缺口

- 本次未读取实际 npm 归档以核对生成闭包
  **影响**：裸源码可解释运行机制，但不能保证发布包已齐备
  **进一步探讨**：核对同版本 tarball 文件清单和依赖导入闭包，再做宿主安装验收。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 在什么条件下可试用，怎样限制记录、恢复和退出成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需准备 OpenViking 服务与正确凭证、支持事件契约的 DSH 和包声明的三个 peer 模块。配置从共享凭证链、ovcli.conf 与宿主输入合并，连接身份字段有专门优先级，用户应核对有效 endpoint、account、user、peer，而不是仅看单个文件。先在非敏感、单项目会话中验证画像、召回、压缩提交和短暂断网恢复；人为写入一个错误偏好并确认可修正，才能判断记忆是否改善任务。记录开关与召回开关要分别验收；禁用插件停止新采集不代表删除服务端记忆或本地 pending。现金成本包含服务存储、嵌入和提炼模型，人工成本包含身份配置、错误记忆修正和队列清理，均无实测。若错误记忆持续回流、项目串扰或待发队列无法解释，则先关采集和召回，退到可人工检查的笔记，并处理留存状态。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/package.json:47-51](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin/package.json#L47-L51)

声明宿主 peer 依赖。

```text
    "@deepseek-ai/dsh-llm": ">=0.1.0-rc.6 <1.0.0-0",
    "@deepseek-ai/dsh-mcp-client": ">=0.1.0-rc.6 <1.0.0-0",
    "@deepseek-ai/dsh-skill-filesystem": ">=0.1.0-rc.6 <1.0.0-0"
  },
  "devDependencies": {
```

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/config.mjs:14-46](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin/config.mjs#L14-L46)

凭证链和连接字段优先级。

<details>
<summary>查看原文（33行）</summary>

```text
 * Resolve the plugin's configuration.
 *
 * `input` is what the cordis host hands the plugin — this harness has no config
 * file of its own. Every knob is declared in `shared/config-schema.mjs`, and
 * `ovcli.conf`'s `plugin` section outranks the host's input so one file
 * configures every harness and `ov config switch` moves them together.
 * Connection fields are the exception: an endpoint, key, identity or auth mode
 * named by the host is the more specific answer and stays ahead of the
 * credential chain.
 */
export function resolveConfig(input = {}, env = process.env, cwd = process.cwd()) {
  // ov.conf's `dsh` section is the legacy layer here as everywhere else, but
  // the cordis patch shares that slot; the host named this process's settings,
  // so it wins the overlap.
  const ovSection = loadCredentialFiles(env).ovFile.dsh;
  const config = buildPluginConfig("dsh", {
    env,
    cwd,
    legacy: { ...(ovSection && typeof ovSection === "object" ? ovSection : {}), ...input },
    version: PLUGIN_VERSION,
    hostInput: {
      peerId: input.peerId,
      account: input.account,
      user: input.user,
      apiKey: input.apiKey,
      baseUrl: input.endpoint,
      // The legacy knob layer this used to ride accepted both spellings.
      authMode: input.authMode || input.auth_mode,
    },
    deriveEffectivePeer: true,
  });

  return { ...config, peerId: config.effectivePeer.peerId };
```

</details>

**依据 3 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:96-106](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin/runtime.mjs#L96-L106)

写开关约束重放，画像来自服务端。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[examples/dsh-memory-plugin/index.mjs:96-108](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin/index.mjs#L96-L108)

采集与 flush 及工具守卫接线。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

#### 缺口

- 缺乏真实宿主的错误记忆纠正、退出清理与成本测量
  **影响**：目前只能限定试用，不能给持续使用收益保证
  **进一步探讨**：以可删除测试账号记录每条记忆生命周期，验证停用、纠正、导出与清理。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何把失败不中断推进为可解释的记忆完整性？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是在现有 pending latch 与恢复日志之上提供每会话的记忆覆盖状态：明确显示已确认写入、待发、因策略过滤与无法恢复的片段，使用户知道下一次召回依赖的历史是否完整。它不同于仅显示服务健康，因为后端已恢复也可能仍有积压或过期丢弃。最小验证是注入断网、不可重试响应和超出TTL三种情形，对比只有日志与可见覆盖状态两组的故障识别时间和后续任务错误率。若用户不能更早发现缺失，或额外状态干扰显著增加，则推翻改进价值。当前包已有日志和队列机制，没有证明这一端到端用户反馈已交付。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:311-324](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin/runtime.mjs#L311-L324)

pending 状态及恢复日志提供候选基础。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:349-375](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/examples/dsh-memory-plugin/runtime.mjs#L349-L375)

健康与积压分别检查。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

#### 缺口

- 覆盖状态与用户界面尚未实现、需求未实证
  **影响**：只能作为后续设计假设
  **进一步探讨**：先访谈实际遇过记忆缺失的用户，再进行上述故障对照。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
