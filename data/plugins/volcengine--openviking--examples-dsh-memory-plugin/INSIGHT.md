# OpenViking DSH 记忆插件

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[5261241](https://github.com/volcengine/OpenViking/tree/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin)

<!-- BEGIN META -->
[![GitHub ★ 41,264](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41%2C264&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/OpenViking) [![npm 30d 35,062](https://img.shields.io/static/v1?label=npm+30d&message=35%2C062&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin)
<!-- END META -->

> **功能**：为 DSH 提供 OpenViking 画像、召回、消息采集及记忆工具。

> **亮点**：把 DSH 生命周期、工作区 peer、合成消息过滤与可重试待发恢复组合；服务端存储和记忆提取归 OpenViking，不归功于适配器。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：会话不中断不等于记忆完整或停止外发：关闭采集与常驻 drainer 的行为不同，TTL、非可重试失败和后台提取均需单独核对。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 已有服务用户需要什么，插件与根服务各负责什么？](#detail-section-11)
  - [Q02 · 消息如何绑定工作区、过滤、召回并写回？](#detail-section-12)
  - [Q03 · 停用、失败和重放能否确保不丢失或不再发送？](#detail-section-13)
  - [Q04 · 使用、隐私、恢复和退出成本是什么？](#detail-section-14)
  - [Q05 · 怎样为用户提供未验证的完整性提示？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 OpenViking 服务并愿意管理隐私和留存的 DSH 用户，希望跨会话复用项目背景。[Q01](#research-q01)

手工项目笔记和每次重述不需要后台服务；插件提供宿主自动接线，记忆正确性和经济效果仍待对照。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 画像与召回 | 按项目身份注入背景 | 服务和 peer 正确；内容须核对 |
| 采集提交 | 发送会话消息并触发归档 | 采集可关闭，服务提取为后台任务 |
| 待发恢复 | 重放暂态失败 | TTL、失败分类及停用行为须核验 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容 DSH 及插件包 | 必需 | 宿主事件和工具 | 无法假定可加载 |
| 支持 home-alias 的 OpenViking 服务 | 记忆能力必需 | 会话、召回和后台提取 | 停用并回人工笔记 |
| 正确项目 peer 与权限 | 业务必需 | 隔离记忆归属 | 不采集敏感内容 |
| 可控本地队列 | 故障恢复需要 | 保留可重试写入 | 需排查失败与丢失 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 准备 | 核对包、服务与独立项目 | 使用非敏感样本 |
| 写入 | 产生一轮受控会话 | 核查远端接收与后台提取 |
| 恢复 | 模拟短暂断网并查看队列 | 对照重放与 TTL |
| 停用 | 停止相关进程并检查队列与服务端 | 不把开关当数据清除 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 服务、模型和磁盘费用未知 | 配置权限与身份 | tarball 与宿主未测 |
| 持续 | 召回与提取资源未知 | 复核记忆并维护权限 | 效果和节时未知 |
| 恢复 | 本地队列与网络重放未知 | 检查 TTL、日志和远端任务 | 非可重试项可能丢失 |
| 退出 | 本地及远端清理成本未知 | 核对积压与留存 | 停止采集不等同清除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 事件交接 | 按会话工作区接入召回与捕获 | 真实任务质量 |
| 故障恢复 | 可重试写入队列和健康重放 | 所有失败无损与后台提取完成 |

> **思考**：会话不中断不等于记忆完整或停止外发：关闭采集与常驻 drainer 的行为不同，TTL、非可重试失败和后台提取均需单独核对。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 DSH 生命周期、工作区 peer、合成消息过滤与可重试待发恢复组合；服务端存储和记忆提取归 OpenViking，不归功于适配器。[Q01](#research-q01) [Q02](#research-q02)

下游 pre-step 决策字段被保留，合成上下文被过滤；单飞 drainer 可恢复部分暂态失败，但其重放不受启动时相同采集守卫约束。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

会话不中断不等于记忆完整或停止外发：关闭采集与常驻 drainer 的行为不同，TTL、非可重试失败和后台提取均需单独核对。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

以非敏感独立项目核验 peer、召回、短断网及停用后队列；出现串扰或缺失时停止相关进程并回退人工笔记。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 DSH 事件、用户身份与待发重放路径；同仓根服务明确提取异步；未运行宿主、服务、模型或包。

- 已检查：作者 README、包清单、源码路径 examples/dsh-memory-plugin/README.md、examples/dsh-memory-plugin/package.json、examples/dsh-memory-plugin/index.mjs、examples/dsh-memory-plugin/runtime.mjs、examples/dsh-memory-plugin/capture.mjs、examples/dsh-memory-plugin/client.mjs、examples/memory-plugin-shared/sync.mjs、examples/memory-plugin-shared/lib/pending-queue.mjs、openviking/server/routers/sessions.py 及固定范围 inventory；组件：examples/dsh-memory-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子组件 inventory 覆盖 33 个指定扩展名文件；静态核查宿主事件、捕获、客户端和同仓共享队列，以及根服务 session commit 路由；未运行目标、宿主或服务。
- 下一步：固定两侧版本，在隔离目录用假数据观察捕获开关、网络恢复、TTL、永久失败及根服务提取 task 状态。

**分析版本**

- **仓库**：[volcengine/OpenViking](https://github.com/volcengine/OpenViking)
- **版本号**：0.5.31（[固定提交 5261241](https://github.com/volcengine/OpenViking/tree/52612416a9946c2b6ba38a869b01f446fbe2746e)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：用户授权后分别显示本地待发、永久失败和根服务后台提取状态，可能降低静默缺失；对照现有日志和 task 回执测误报、识别率与隐私成本。[Q05](#research-q05)

固定两侧版本，在隔离目录用假数据观察捕获开关、网络恢复、TTL、永久失败及根服务提取 task 状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | example | 27 | 3878 | 3295 | 278 | — |
| .md | example | 6 | 939 | — | — | 8493 |

</details>

**活跃度**

[![Issue 未关闭 399](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=399&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 354](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=354&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 181](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=181&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 会话如何接入 OpenViking 记忆、后台队列与服务端提取，失败、停用和退出的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有服务用户需要什么，插件与根服务各负责什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

该组件是 DSH 的 OpenViking 记忆插件，面向想在项目会话中自动召回与记录背景、并能管理外部记忆服务的用户。相对手工写项目笔记，它把工作区身份、画像、召回、消息捕获和 MCP 接入宿主生命周期；检索、归档和记忆提取由 OpenViking 服务承担，不算本包原创。固定同仓根服务的 commit 路由说明归档在返回前执行，而提取作为后台任务继续；部署版本可能不同，不能据此断言目标环境已成功记忆。是否减少重述、改善任务和节约成本未经同条件对照。

#### 证据与依据

**依据 1 · 作者声明**：[examples/dsh-memory-plugin/README.md:1-9](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/README.md#L1-L9)

作者说明插件用途与服务 home-alias 前提。

```text
# OpenViking Memory for DeepSeek Harness

An installable DeepSeek Harness bundle that adds OpenViking auto-recall, session capture, `viking://` URI protection, and the OpenViking MCP tool surface.

> **Requires an OpenViking server with `viking://~` home-alias support.** Recall targets the
> caller's own context space through `viking://~/memories` and `viking://~/skills`; the uid-less
> `viking://user/memories` shorthand is rejected by newer servers.

Published as [`@openviking/dsh-memory-plugin`](https://www.npmjs.com/package/@openviking/dsh-memory-plugin).
```

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/package.json:1-10](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/package.json#L1-L10)

包身份和版本。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "@openviking/dsh-memory-plugin",
  "version": "0.5.31",
  "description": "OpenViking memory and context bundle for DeepSeek Harness",
  "icon": "./icon.svg",
  "type": "module",
  "main": "index.mjs",
  "exports": {
    ".": "./index.mjs",
    "./package.json": "./package.json",
```

</details>

**依据 3 · 源码核查**：[examples/dsh-memory-plugin/index.mjs:12-31](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/index.mjs#L12-L31)

插件提供 runtime 并启动 drainer。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[openviking/server/routers/sessions.py:666-676](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/server/routers/sessions.py#L666-L676)

同提交根服务 commit 区分归档与后台提取。

<details>
<summary>查看原文（11行）</summary>

```text
@router.post("/{session_id}/commit")
async def commit_session(
    session_id: str = Path(..., description="Session ID"),
    body: CommitRequest = Body(default_factory=CommitRequest),
    _ctx: RequestContext = Depends(get_session_request_context),
):
    """Commit a session (archive and extract memories).

    Archive (Phase 1) completes before returning.  Memory extraction
    (Phase 2) runs in the background.  A ``task_id`` is returned for
    polling progress via ``GET /tasks/{task_id}``.
```

</details>

#### 缺口

- 目标服务版本、宿主和真实任务效果未知
  **影响**：不能把同仓代码当作部署验证或已证明节时
  **进一步探讨**：固定服务与宿主，在隔离项目对照手工笔记

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 消息如何绑定工作区、过滤、召回并写回？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 在 agent 创建和旧 session-start 入口初始化，在 pre-step 先等待下游决策，仅 enter 时并行取得 profile 与召回，再保留原决策字段并追加消息；session/event 触发捕获及提交判断。runtime 按 session.header.cwd、否则进程 cwd 解析 peer 并生成服务端 session ID；capture 排除带 plugin 或其他非用户来源的合成 user 消息，未标记的旧消息仍可捕获，工具结果是否捕获取配置。随后经客户端向服务端 session messages 写入，达到阈值或压缩边界调用 commit；同固定根服务 commit 会返回后台提取任务，插件记录响应或 trace 不能证明提取完成。源码表示接线，不证明跨宿主实际事件顺序、身份隔离和服务可用。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/index.mjs:67-100](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/index.mjs#L67-L100)

生命周期、下游决策及事件捕获。

<details>
<summary>查看原文（34行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:33-49](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/runtime.mjs#L33-L49)

按工作区推导 peer 与服务会话。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:119-153](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/runtime.mjs#L119-L153)

画像、召回及采集开关。

<details>
<summary>查看原文（35行）</summary>

```text
  async profileMessage(agent) {
    const state = await this.initialize(agent);
    if (!state.ready || !state.profileBlock || state.profileDelivered) return null;
    if (hasStartupProfile(agent)) {
      state.profileDelivered = true;
      return null;
    }
    state.profileDelivered = true;
    return pluginMessage(state.profileBlock, { form: "instructions" });
  }

  async recallMessage(agent, messages) {
    const state = await this.initialize(agent);
    if (!state.ready || !isRecallEnabled(state.config)) return null;
    const query = promptText(messages);
    if (!query || query.length < state.config.minQueryLength) return null;
    const block = await buildRecallBlock(
      (path, init, options) => this.client.fetchJSON(path, init, options),
      state.config,
      query,
      {
        actorPeerId: state.config.peerId,
        legacyPeerId: state.config.legacyPeerId,
        sessionId: state.ovSessionId,
        excludeUris: state.config.recallExcludeUris,
        log: (stage, data) => this.log(stage, data),
      },
    );
    return block ? pluginMessage(block, { form: "recall" }) : null;
  }

  capture(session, event) {
    const state = this.stateFor(session);
    if (!isCaptureEnabled(state.config)) return;
    const payload = captureEvent(event, state.config, state.toolNames);
```

</details>

**依据 4 · 源码核查**：[examples/dsh-memory-plugin/capture.mjs:23-38](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/capture.mjs#L23-L38)

合成来源过滤条件。

<details>
<summary>查看原文（16行）</summary>

```text
export function isOpenVikingPluginMessage(message) {
  const source = message?.source;
  return source?.kind === OPENVIKING_PLUGIN_KIND
    || (source?.kind === "plugin" && source.plugin === OPENVIKING_PLUGIN_SOURCE);
}

function isSyntheticUserMessage(message) {
  const kind = message?.source?.kind;
  if (kind === "plugin") return true;
  if (typeof kind === "string" && kind.startsWith("plugin:")) return true;
  // DSH's v4 migration gives first-party context producers their own kinds
  // (for example, "time-context") instead of the retired plugin wrapper.
  return message?.role === "user"
    && typeof kind === "string"
    && kind !== "user"
    && kind !== "tool";
```

</details>

**依据 5 · 源码核查**：[examples/dsh-memory-plugin/capture.mjs:62-79](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/capture.mjs#L62-L79)

捕获配置与负载整形。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[examples/dsh-memory-plugin/client.mjs:19-24](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/client.mjs#L19-L24)

服务会话创建。

```text
  async ensureSessionResult(sessionId, actorPeerId) {
    const response = await this.fetchJSON("/api/v1/sessions", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId }),
    }, { actorPeerId });
    return response;
```

**依据 7 · 源码核查**：[examples/dsh-memory-plugin/client.mjs:36-55](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/client.mjs#L36-L55)

消息及 commit 请求。

<details>
<summary>查看原文（20行）</summary>

```text
  async addMessage(sessionId, payload, actorPeerId) {
    return this.fetchJSON(
      `/api/v1/sessions/${encodeURIComponent(sessionId)}/messages`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      { actorPeerId },
    );
  }

  async commitSession(sessionId, actorPeerId, options = {}) {
    return this.fetchJSON(
      `/api/v1/sessions/${encodeURIComponent(sessionId)}/commit`,
      {
        method: "POST",
        body: JSON.stringify({ keep_recent_count: 0 }),
      },
      { timeoutMs: options.timeoutMs ?? 30000, actorPeerId },
    );
```

</details>

**依据 8 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:181-209](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/runtime.mjs#L181-L209)

压缩或阈值后提交并处理可重试失败。

<details>
<summary>查看原文（29行）</summary>

```text
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
      this.log(boundary ? "compaction_commit" : "commit", {
        sessionId: state.ovSessionId,
        ok: response.ok,
        trace_id: response.result?.trace_id || response.traceId,
        error: response.ok ? undefined : response.error?.message || response.error?.code,
      });
      if (isRetryableFailure(response)) {
        await this.enqueueFinalCommit(state, { keep_recent_count: 0 });
```

</details>

**依据 9 · 源码核查**：[openviking/server/routers/sessions.py:666-676](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/server/routers/sessions.py#L666-L676)

根服务后台提取和任务回执。

<details>
<summary>查看原文（11行）</summary>

```text
@router.post("/{session_id}/commit")
async def commit_session(
    session_id: str = Path(..., description="Session ID"),
    body: CommitRequest = Body(default_factory=CommitRequest),
    _ctx: RequestContext = Depends(get_session_request_context),
):
    """Commit a session (archive and extract memories).

    Archive (Phase 1) completes before returning.  Memory extraction
    (Phase 2) runs in the background.  A ``task_id`` is returned for
    polling progress via ``GET /tasks/{task_id}``.
```

</details>

#### 缺口

- 真实宿主事件和服务版本未验证
  **影响**：不能保证完整性、隔离或提取成功
  **进一步探讨**：隔离项目记录身份、输入来源、远端任务及最终记忆

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 停用、失败和重放能否确保不丢失或不再发送？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

初始化只有采集开启才调用启动重放，但插件加载时无条件启动共享 drainer；其健康成功分支直接 replayPendingQueue，未检查各 session 的采集开关，所以不能凭关闭采集推断已积压的队列停止发送。捕获直接发送失败只有可重试情况会排队；非可重试失败或队列写入失败可能缺失。共享待发队列默认 7 天 TTL、最多重试 3 次及每次 50 项；replay 遇到非可重试失败会删除项，长期 drainer 对可重试失败不消耗次数，但 TTL 清理仍适用。缓存文件可能含原始会话内容。以上只支持条件风险，不证明某用户真实数据已丢失；停用或退出时应先核对进程、队列与服务端留存。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/index.mjs:23-35](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/index.mjs#L23-L35)

挂载启动共享 drainer。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:78-101](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/runtime.mjs#L78-L101)

启动重放受采集开关限制。

<details>
<summary>查看原文（24行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:150-177](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/runtime.mjs#L150-L177)

仅可重试发送失败排队。

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

**依据 4 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:265-283](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/runtime.mjs#L265-L283)

排队状态及失败记录。

<details>
<summary>查看原文（19行）</summary>

```text
  async enqueuePending(state, type, payload) {
    const createdAt = Math.max(Date.now(), state.pendingCreatedAt + 1);
    state.pendingCreatedAt = createdAt;
    const result = await enqueue(type, state.ovSessionId, payload, { createdAt });
    if (result.ok) {
      // Log the latch transition only: every message that follows while the
      // latch holds takes the cheap enqueue path, so this fires once per
      // outage, not once per message.
      if (!state.hasPendingWrites) {
        this.log("pending_latched", { sessionId: state.ovSessionId, type });
      }
      state.hasPendingWrites = true;
    }
    if (!result.ok) {
      this.log("pending_enqueue_error", {
        sessionId: state.ovSessionId,
        type,
        error: result.error,
      });
```

</details>

**依据 5 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:349-369](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/runtime.mjs#L349-L369)

drainTick 健康分支无采集开关判断。

<details>
<summary>查看原文（21行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[examples/memory-plugin-shared/lib/pending-queue.mjs:1-20](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/memory-plugin-shared/lib/pending-queue.mjs#L1-L20)

队列位置与默认重试、TTL、批次。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

**依据 7 · 源码核查**：[examples/memory-plugin-shared/lib/pending-queue.mjs:349-365](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/memory-plugin-shared/lib/pending-queue.mjs#L349-L365)

过期清理。

<details>
<summary>查看原文（17行）</summary>

```text
 * Clean up stale entries older than TTL.
 */
export async function cleanStale() {
  const ttlMs = getTTLDays() * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const pending = await listPending();
  let cleaned = 0;

  for (const { filename, entry } of pending) {
    const age = now - (entry.createdAt || 0);
    if (age > ttlMs) {
      await dequeue(filename);
      cleaned++;
    }
  }
  return cleaned;
}
```

</details>

**依据 8 · 源码核查**：[examples/memory-plugin-shared/lib/pending-queue.mjs:451-478](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/memory-plugin-shared/lib/pending-queue.mjs#L451-L478)

成功、非可重试删除和可重试保留/计数。

<details>
<summary>查看原文（28行）</summary>

```text
    if (res?.ok) {
      await dequeue(claimedFilename);
      replayed++;
    } else if (!isRetryableReplayFailure(res)) {
      await dequeue(claimedFilename);
      skipped++;
    } else {
      if (consumeRetries) {
        await incrementRetry(claimedFilename, entry);
      } else {
        const released = await releaseClaim(claimedFilename);
        log("pending-queue", {
          action: released ? "replay-deferred" : "release-failed",
          sessionId: entry.sessionId,
          type: entry.type,
          status: res?.result?.status || res?.status,
          retries: entry.retries || 0,
        });
      }
      failed++;
      if (entry.type === "addMessage") {
        deferred += Math.max(0, pending.length - processed);
        break;
      }
    }
  }

  const cleaned = await cleanStale();
```

</details>

#### 缺口

- 未实测磁盘失败、后台重放、停用和长期断网
  **影响**：无法判断实际丢失或停用后的真实流量
  **进一步探讨**：隔离本地目录与假服务检查停用前后队列和网络请求

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用、隐私、恢复和退出成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH、OpenViking server 的 home-alias 能力、正确身份和可写本地队列。源码安装依赖 profile 中 peer 解析，README 还说明 shared 模块由打包同步产生；不能把源码仓或历史 npm 版本当成本轮已验收包。用户需承担服务与模型、磁盘和网络成本，核对自动采集的内容、身份、待发队列和远端记忆；费用与人工时间未测。先用非敏感独立项目核对召回、停用和短暂断网；一旦串项目、记录缺失或去留不明，停止采集与召回并检查 drainer、待发和服务端数据，再回退人工笔记。移除插件不等于清除本地或远端已有内容。

#### 证据与依据

**依据 1 · 作者声明**：[examples/dsh-memory-plugin/README.md:3-7](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/README.md#L3-L7)

插件功能和服务 home-alias 要求。

```text
An installable DeepSeek Harness bundle that adds OpenViking auto-recall, session capture, `viking://` URI protection, and the OpenViking MCP tool surface.

> **Requires an OpenViking server with `viking://~` home-alias support.** Recall targets the
> caller's own context space through `viking://~/memories` and `viking://~/skills`; the uid-less
> `viking://user/memories` shorthand is rejected by newer servers.
```

**依据 2 · 作者声明**：[examples/dsh-memory-plugin/README.md:24-37](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/README.md#L24-L37)

安装及源码共享模块依赖。

<details>
<summary>查看原文（14行）</summary>

````text
Or add the package to a profile directly:

```bash
dsh plugin --profile web add @openviking/dsh-memory-plugin
dsh --profile web --dump-config    # should list openviking-memory-runtime
```

`dsh plugin` forwards to pnpm inside the profile directory, so the bundle has to
be a real package. Linking a source checkout (`dsh plugin --profile web add
./examples/dsh-memory-plugin`) only works when that checkout has its own
`node_modules`, because Node resolves the bundle's dsh peers from the source
tree's realpath rather than from the profile.
It also needs `node examples/memory-plugin-shared/sync.mjs` run first: the
`shared/` modules the bundle imports are generated, not committed.
````

</details>

**依据 3 · 源码核查**：[examples/dsh-memory-plugin/package.json:13-44](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/package.json#L13-L44)

包内容和 prepack 同步。

<details>
<summary>查看原文（32行）</summary>

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

**依据 4 · 源码核查**：[examples/memory-plugin-shared/sync.mjs:9-24](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/memory-plugin-shared/sync.mjs#L9-L24)

共享代码的打包和未提交原因。

<details>
<summary>查看原文（16行）</summary>

```text
export const SHARED_DIR = join(ROOT, "examples", "memory-plugin-shared", "lib");

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

**依据 5 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:349-369](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/runtime.mjs#L349-L369)

退出前需考虑进程内 drainer。

<details>
<summary>查看原文（21行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[examples/memory-plugin-shared/lib/pending-queue.mjs:1-20](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/memory-plugin-shared/lib/pending-queue.mjs#L1-L20)

本地队列可能持久化内容。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

#### 缺口

- 未校验 npm tarball、目标服务、费用或真实清除行为
  **影响**：不能保证安装兼容或退出后无数据留存
  **进一步探讨**：隔离 profile 核对归档、凭据、队列与服务端数据生命周期

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样为用户提供未验证的完整性提示？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

当前已记录 pending_latched、pending_cleared、enqueue_error 和重放诊断，但这些日志不能证明远端后台提取完成；根服务 commit 暴露可轮询的 task_id，插件当前 commit 分支仅记录成功与 trace。未验证假设：在用户授权且隐私受控时，显示采集关闭状态、本地待发/过期/永久失败计数，并跟踪服务返回的提取 task_id，以分别提示“未发送、已归档待提取、提取完成或失败”。它依赖真实回执及任务 API，不应把数量归零等同内容正确，也可能产生轮询成本和泄露元数据。对照现有日志，以断网、磁盘失败、停用后积压及后台提取失败为固定故障，测遗漏识别率、误报、延迟与人工负担；若不改善或泄露过多则否定。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:265-283](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/runtime.mjs#L265-L283)

已有 latch 与入队错误日志。

<details>
<summary>查看原文（19行）</summary>

```text
  async enqueuePending(state, type, payload) {
    const createdAt = Math.max(Date.now(), state.pendingCreatedAt + 1);
    state.pendingCreatedAt = createdAt;
    const result = await enqueue(type, state.ovSessionId, payload, { createdAt });
    if (result.ok) {
      // Log the latch transition only: every message that follows while the
      // latch holds takes the cheap enqueue path, so this fires once per
      // outage, not once per message.
      if (!state.hasPendingWrites) {
        this.log("pending_latched", { sessionId: state.ovSessionId, type });
      }
      state.hasPendingWrites = true;
    }
    if (!result.ok) {
      this.log("pending_enqueue_error", {
        sessionId: state.ovSessionId,
        type,
        error: result.error,
      });
```

</details>

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:311-324](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/runtime.mjs#L311-L324)

已有 pending_cleared 日志。

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

**依据 3 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:198-209](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/dsh-memory-plugin/runtime.mjs#L198-L209)

提交日志记录 ok 和 trace。

<details>
<summary>查看原文（12行）</summary>

```text
      const response = await this.client.commitSession(
        state.ovSessionId,
        state.config.peerId,
      );
      this.log(boundary ? "compaction_commit" : "commit", {
        sessionId: state.ovSessionId,
        ok: response.ok,
        trace_id: response.result?.trace_id || response.traceId,
        error: response.ok ? undefined : response.error?.message || response.error?.code,
      });
      if (isRetryableFailure(response)) {
        await this.enqueueFinalCommit(state, { keep_recent_count: 0 });
```

</details>

**依据 4 · 源码核查**：[openviking/server/routers/sessions.py:666-676](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/server/routers/sessions.py#L666-L676)

根服务提供后台任务轮询线索。

<details>
<summary>查看原文（11行）</summary>

```text
@router.post("/{session_id}/commit")
async def commit_session(
    session_id: str = Path(..., description="Session ID"),
    body: CommitRequest = Body(default_factory=CommitRequest),
    _ctx: RequestContext = Depends(get_session_request_context),
):
    """Commit a session (archive and extract memories).

    Archive (Phase 1) completes before returning.  Memory extraction
    (Phase 2) runs in the background.  A ``task_id`` is returned for
    polling progress via ``GET /tasks/{task_id}``.
```

</details>

**依据 5 · 源码核查**：[examples/memory-plugin-shared/lib/pending-queue.mjs:451-478](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/examples/memory-plugin-shared/lib/pending-queue.mjs#L451-L478)

删除、保留与 TTL 清理。

<details>
<summary>查看原文（28行）</summary>

```text
    if (res?.ok) {
      await dequeue(claimedFilename);
      replayed++;
    } else if (!isRetryableReplayFailure(res)) {
      await dequeue(claimedFilename);
      skipped++;
    } else {
      if (consumeRetries) {
        await incrementRetry(claimedFilename, entry);
      } else {
        const released = await releaseClaim(claimedFilename);
        log("pending-queue", {
          action: released ? "replay-deferred" : "release-failed",
          sessionId: entry.sessionId,
          type: entry.type,
          status: res?.result?.status || res?.status,
          retries: entry.retries || 0,
        });
      }
      failed++;
      if (entry.type === "addMessage") {
        deferred += Math.max(0, pending.length - processed);
        break;
      }
    }
  }

  const cleaned = await cleanStale();
```

</details>

#### 缺口

- 状态界面、任务跟踪原型及任务生命周期尚未验证
  **影响**：不能证明识别改善或不存在隐私与成本副作用
  **进一步探讨**：隔离模拟故障与真实 task API，对照现有日志

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
