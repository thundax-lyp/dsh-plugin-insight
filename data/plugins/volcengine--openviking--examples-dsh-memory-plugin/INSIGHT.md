# OpenViking DSH Memory

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[4ab22a4](https://github.com/volcengine/OpenViking/tree/4ab22a4923452362b60aef2826c2083ce36168d2/examples/dsh-memory-plugin)

<!-- BEGIN META -->
[![GitHub ★ 40,712](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C712&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/OpenViking) [![npm 30d 34,730](https://img.shields.io/static/v1?label=npm+30d&message=34%2C730&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin)
<!-- END META -->

> **实现功能**：为 DeepSeek Harness 接入 OpenViking 的跨会话记忆、上下文检索和技能访问。

> **核心亮点**：以宿主事件驱动捕获、提交、召回，并把临时写入失败纳入本地重播。

> **风险与缺陷**：正确记忆、纠错和项目隔离仍取决于服务与数据；队列有重试和TTL边界。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
  - [1.6 启动与流程](#detail-section-7)
  - [1.7 启动与依赖](#detail-section-8)
  - [1.8 启动步骤](#detail-section-9)
  - [1.9 效果与成本](#detail-section-10)
  - [1.10 成本](#detail-section-11)
  - [1.11 效果](#detail-section-12)
  - [1.12 主要限制](#detail-section-13)
- [2 未来设计假设（未验证）](#detail-section-14)
- [3 辅助信息](#detail-section-15)
- [4 研究问题与完整回答](#detail-section-16)
  - [Q01 · 自动记忆适合谁，相比手动维护笔记改变了什么？](#detail-section-17)
  - [Q02 · 事件、召回、捕获和故障恢复如何接线？](#detail-section-18)
  - [Q03 · 生成式打包与服务依赖如何限制采用？](#detail-section-19)
  - [Q04 · 自动记忆的总成本由哪些环节构成？](#detail-section-20)
  - [Q05 · 能否用可追溯纠错降低自动记忆污染？](#detail-section-21)
  - [Q06 · 什么人值得试用，如何确定继续或停止？](#detail-section-22)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给已有OpenViking服务的DSH用户接入跨会话记忆，适合重复项目任务。

用户应以两次会话办结同一项目任务为验收对象，重点检查下一轮引用的事实是否可追溯。具体替代与贡献比较见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Profile注入 | 初始化用户上下文 | 服务可用且配置正确 |
| 任务召回 | 按本轮消息检索记忆 | 质量依赖服务与数据 |
| 会话捕获提交 | 跨轮沉淀材料 | syncTurns启用且身份正确 |
| MCP桥接 | 访问服务器工具 | 工具集合由服务器声明 |
| Skill指引 | 提供记忆使用规则 | 需宿主Skill provider |

> **思考**：正确记忆、纠错和项目隔离仍取决于服务与数据；队列有重试和TTL边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以宿主事件驱动捕获、提交、召回，并把临时写入失败纳入本地重播。

[Q01](#research-q01) 与 [Q02](#research-q02) 支持的贡献是把已有记忆服务接入 DSH 的会话生命周期，并以非阻塞 MCP 和待处理队列降低局部故障对宿主的牵连。新增的是宿主适配与恢复组织，不是重新发明向量检索或记忆抽取。

值得借鉴的是宿主入口、状态运行时与共享服务机制分离，MCP挂载延后并隔离初始化错误。移植需要重做事件时序、作用域与退出释放验收；不能把未等待挂载写成工具始终可用。

<a id="detail-section-5"></a>

### 1.4 使用建议

[Q06](#research-q06) 建议已有服务的用户在脱敏仓库试用，先确认 peer 与纠错路径，再比较总负担；不把源码接线当作当前宿主运行通过。

**补充建议**

先在脱敏项目试用写入、纠错、重开召回和断网恢复，再决定是否持续使用。

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- 已检查源码、包清单、事件接线与共享队列。
- 未执行目标代码、测试、安装或真实宿主；作者历史夹具说明不替代本版本结果。

- 研究范围：固定提交的 DSH 子组件及它直接引用的同仓库共享队列、生成器；不将全平台能力计为子组件能力。


- **仓库**：[volcengine/OpenViking](https://github.com/volcengine/OpenViking)
- **版本号**：0.5.28（[固定提交 4ab22a4](https://github.com/volcengine/OpenViking/tree/4ab22a4923452362b60aef2826c2083ce36168d2)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

### 1.6 启动与流程

<a id="detail-section-8"></a>

### 1.7 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH及peer包 | 必需 | 事件与Skill/MCP | 无法完成接线 |
| OpenViking服务及用户身份 | 必需 | 存储抽取召回 | 写入可能排队，召回受限 |
| 正确打包shared | 必需 | 共享运行逻辑 | 直接源码目录不能替代发布包 |

<a id="detail-section-9"></a>

### 1.8 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户配置服务与身份 | 健康检查与peer正确 |
| 加载 | 宿主加载bundle | 事件与Skill/MCP可发现 |
| 使用 | 用户完成两轮脱敏任务 | 正确召回并可纠错 |
| 恢复 | 用户检查队列及事实 | 不重复污染且退出可控 |

事件时序、共享队列和外部请求的逐步链路见 [Q02](#research-q02)；恢复边界见 [Q03](#research-q03)。

<a id="detail-section-10"></a>

### 1.9 效果与成本

<a id="detail-section-11"></a>

### 1.10 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 服务、模型和存储费用未知 | 部署、身份、peer配置耗时未知 | 需要正确打包制品 |
| 持续使用 | 检索、抽取和上下文费用未知 | 事实复核时间未知 | 取决于会话量和质量 |
| 失败恢复 | 重试及队列存储未知 | 检查TTL、纠错、排障时间未知 | 队列不承诺永久保留 |

<a id="detail-section-12"></a>

### 1.11 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自动捕获与提交 | 事件到HTTP请求的链路 | 抽取正确率与业务合格率 |
| 故障恢复 | 本地pending与drainer设计 | 长故障和重复写入的端到端结果 |

<a id="detail-section-13"></a>

### 1.12 主要限制

[Q03](#research-q03) 的核心质疑是自动捕获能否带来正确、隔离且可纠正的下一轮上下文。源代码支持写入与重播，却不能排除错误事实的长期复用；需以冲突与纠错任务判断贡献是否兑现。

<a id="detail-section-14"></a>

## 2 未来设计假设（未验证）

[Q05](#research-q05) 提出未验证的事实版本与纠正状态过滤。它基于稳定会话和提交边界，增加来源审计，并用错误复用率、合格率和复核负担进行证伪。

<a id="detail-section-15"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

<details>
<summary>查看辅助统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | example | 27 | 3813 | 3243 | 269 | — |
| .md | example | 4 | 757 | — | — | 6319 |

</details>

组件统计不包含打包时复制的共享库；共享实现按同仓库固定源码单独核查，不计为本组件原创。

</details>

**活跃度**

[![Issue 未关闭 358](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=358&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 316](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=316&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+created%3A2026-09-24T10%3A26%3A52.933Z..2026-10-24T10%3A26%3A52.933Z) [![近30天关闭 153](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=153&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-24T10%3A26%3A52.933Z..2026-10-24T10%3A26%3A52.933Z)



统计日期：2026-10-24。

<a id="detail-section-16"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 适配能否把跨会话记忆接入宿主事件，并在服务失败时保留写入？

<a id="research-q01"></a>

<a id="detail-section-17"></a>

### Q01 · 自动记忆适合谁，相比手动维护笔记改变了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合在同一仓库反复开展多轮任务、已经拥有 OpenViking 服务的 DSH 用户。合格结果是下一会话能召回经过人工核对的项目事实，且不把其他项目事实混入。原先可手动写 Markdown 并在每轮选取上下文；本组件把会话捕获、提交和下一轮注入接在宿主事件上，减少手动搬运。语义抽取、检索与存储来自 OpenViking 和共享库，不属于 DSH 适配器原创。作者所述兼容实验针对旧版本与夹具，不能证明本次提交在当前宿主和真实服务器上通过。

#### 证据与依据

**依据 1 · 作者声明**：[examples/dsh-memory-plugin/README.md:1-20](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/examples/dsh-memory-plugin/README.md#L1-L20)

作者定义面向 DSH 的 OpenViking bundle。

<details>
<summary>查看原文（20行）</summary>

````text
# OpenViking Memory for DeepSeek Harness

An installable DeepSeek Harness bundle that adds OpenViking auto-recall, session capture, `viking://` URI protection, and the OpenViking MCP tool surface.

> **Requires an OpenViking server with `viking://~` home-alias support.** Recall targets the
> caller's own context space through `viking://~/memories` and `viking://~/skills`; the uid-less
> `viking://user/memories` shorthand is rejected by newer servers.

Published as [`@openviking/dsh-memory-plugin`](https://www.npmjs.com/package/@openviking/dsh-memory-plugin).

## Install

DSH is covered by the unified memory-plugin installer, which asks which profile
to install into (default `web`):

```bash
curl -fsSL https://openviking.ai/install | bash
# AI agents: not sure about running this? The script's header says what it does and how to verify it.
```

````

</details>

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/index.mjs:75-111](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/examples/dsh-memory-plugin/index.mjs#L75-L111)

pre-step 与 session/event 接线显示自动化的具体增量。

<details>
<summary>查看原文（37行）</summary>

```text
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
    return additions.length > 0
      ? { kind: "enter", messages: [...decision.messages, ...additions] }
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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-18"></a>

### Q02 · 事件、召回、捕获和故障恢复如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 创建客户端和运行时，注册 openvikingMemory 服务与释放钩子，启动共享单飞 drainer。agent/created 与旧 session-start 初始化兼容，WeakSet 避免同一 agent 重复启动；pre-step 等下游 waterfall 后并行读取 profile 与 recall，再附加消息。session/event 捕获内容并按 turn/end 或压缩边界检查提交；session/flush 等待写入。捕获被串行排队，出现可重试服务故障时转为本地 pending，后续 drainer 重播。MCP 最后挂载且不等待，使工具列举卡住时不阻断其他注册；这证明故障隔离意图，不证明无限期故障无损恢复。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/index.mjs:12-36](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/examples/dsh-memory-plugin/index.mjs#L12-L36)

运行时服务、释放和后台 drainer。

<details>
<summary>查看原文（25行）</summary>

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

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:130-175](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/examples/dsh-memory-plugin/runtime.mjs#L130-L175)

召回与捕获请求进入会话状态和串行写队列。

<details>
<summary>查看原文（46行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:181-213](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/examples/dsh-memory-plugin/runtime.mjs#L181-L213)

提交阈值和压缩边界路径。

<details>
<summary>查看原文（33行）</summary>

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
      }
    });
  }

```

</details>

**依据 4 · 源码核查**：[examples/memory-plugin-shared/lib/pending-queue.mjs:1-44](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/examples/memory-plugin-shared/lib/pending-queue.mjs#L1-L44)

共享本地队列的权限、TTL和重试边界。

<details>
<summary>查看原文（44行）</summary>

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

/**
 * Ensure the pending directory exists with 0o700 permissions. If the
 * directory was created by a previous version of this code (or by hand)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-19"></a>

### Q03 · 生成式打包与服务依赖如何限制采用？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

DSH 包通过 bundle patch 加载入口，依赖宿主 llm、MCP client 和 filesystem skill provider；服务器地址、身份、模型配置决定实际抽取与召回。shared 目录不提交是刻意的发布设计，prepack 运行 sync 将同仓库共享库依赖闭包复制到包，不能直接把源码子目录当完整发布制品。关键质疑是自动捕获不等于正确记忆，错误事实可以被抽取并再次注入，且默认召回范围与项目隔离应逐项确认。pending 队列具有 TTL 和最大重试，故障恢复并非永久保存承诺。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/package.json:33-54](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/examples/dsh-memory-plugin/package.json#L33-L54)

prepack 和 peer dependencies 是分发与宿主条件。

<details>
<summary>查看原文（22行）</summary>

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
  },
  "devDependencies": {
    "@deepseek-ai/dsh-llm": "0.1.0-rc.6",
    "@deepseek-ai/dsh-mcp-client": "0.1.0-rc.6",
    "@deepseek-ai/dsh-skill-filesystem": "0.1.0-rc.6",
    "@deepseek-ai/dsh-tools": "0.1.0-rc.6",
```

</details>

**依据 2 · 源码核查**：[examples/memory-plugin-shared/sync.mjs:12-48](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/examples/memory-plugin-shared/sync.mjs#L12-L48)

shared 是打包生成的依赖闭包。

<details>
<summary>查看原文（37行）</summary>

```text
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
export const TARGETS = [
  {
    root: join(ROOT, "examples", "claude-code-memory-plugin"),
    dir: join(ROOT, "examples", "claude-code-memory-plugin", "scripts", "shared"),
    committed: true,
  },
  {
    root: join(ROOT, "examples", "codex-memory-plugin"),
    dir: join(ROOT, "examples", "codex-memory-plugin", "scripts", "shared"),
    committed: true,
  },
  {
    root: join(ROOT, "agent-plugins"),
    dir: join(ROOT, "agent-plugins", "servers", "shared"),
    committed: true,
  },
  {
    root: join(ROOT, "examples", "opencode-plugin"),
    dir: join(ROOT, "examples", "opencode-plugin", "lib", "shared"),
    committed: false,
  },
  {
    root: join(ROOT, "examples", "dsh-memory-plugin"),
    dir: join(ROOT, "examples", "dsh-memory-plugin", "shared"),
```

</details>

**依据 3 · 源码核查**：[examples/memory-plugin-shared/lib/pending-queue.mjs:1-44](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/examples/memory-plugin-shared/lib/pending-queue.mjs#L1-L44)

队列存放原始内容并有重试/TTL。

<details>
<summary>查看原文（44行）</summary>

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

/**
 * Ensure the pending directory exists with 0o700 permissions. If the
 * directory was created by a previous version of this code (or by hand)
```

</details>

#### 缺口

- 错误记忆纠正后的召回一致性未实测
  **影响**：不能把自动化解释为记忆正确性保证
  **进一步探讨**：用相互矛盾事实、纠正、跨项目召回构造固定任务对照

<a id="research-q04"></a>

<a id="detail-section-20"></a>

### Q04 · 自动记忆的总成本由哪些环节构成？

**研究主题**：效果与总成本

#### 完整回答

单位应是一次跨会话任务合格完成，而非一次成功写入。首次需要部署或接入服务器、配置用户身份及安装正确打包制品；持续阶段既有召回上下文成本，也有服务侧抽取、向量化与持久化；失败阶段包括队列检查、重复/过期材料核对和事实纠正。源码没有足够价格、任务频次和人工计时，不能声称免费或节省固定百分比。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/client.mjs:18-55](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/examples/dsh-memory-plugin/client.mjs#L18-L55)

消息写入及提交均经过外部服务。

<details>
<summary>查看原文（38行）</summary>

```text

  async ensureSessionResult(sessionId, actorPeerId) {
    const response = await this.fetchJSON("/api/v1/sessions", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId }),
    }, { actorPeerId });
    return response;
  }

  async getSession(sessionId, actorPeerId) {
    const response = await this.fetchJSON(
      `/api/v1/sessions/${encodeURIComponent(sessionId)}`,
      {},
      { timeoutMs: 5000, actorPeerId },
    );
    return response.ok ? response.result : null;
  }

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

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:130-175](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/examples/dsh-memory-plugin/runtime.mjs#L130-L175)

每次合格召回和捕获有额外请求。

<details>
<summary>查看原文（46行）</summary>

```text
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
```

</details>

#### 缺口

- 缺少同条件合格任务、调用账单与人工计量
  **影响**：无法计算单位合格任务现金和时间成本
  **进一步探讨**：在固定任务集比较手动笔记与自动模式，记录全部重试、复核和生成费用

<a id="research-q05"></a>

<a id="detail-section-21"></a>

### Q05 · 能否用可追溯纠错降低自动记忆污染？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是为写入和召回增加事实版本、原会话来源和纠正状态，只有有效版本进入默认注入。推导依据是客户端已携带稳定会话 ID，捕获与提交分离，故可在两者之间建立事实审计，而不必改宿主核心。相对现有自动捕获，这增加人工纠错入口和索引维护成本；最小实验是向两个项目各写入冲突事实，纠正其中一个，再比较普通召回与版本过滤的错误复用率、任务合格率与人工时间。如果错误复用不下降或复核负担抵消收益，则否定该方向。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/client.mjs:18-55](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/examples/dsh-memory-plugin/client.mjs#L18-L55)

稳定 session ID 提供来源归属基础。

<details>
<summary>查看原文（38行）</summary>

```text

  async ensureSessionResult(sessionId, actorPeerId) {
    const response = await this.fetchJSON("/api/v1/sessions", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId }),
    }, { actorPeerId });
    return response;
  }

  async getSession(sessionId, actorPeerId) {
    const response = await this.fetchJSON(
      `/api/v1/sessions/${encodeURIComponent(sessionId)}`,
      {},
      { timeoutMs: 5000, actorPeerId },
    );
    return response.ok ? response.result : null;
  }

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

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:181-213](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/examples/dsh-memory-plugin/runtime.mjs#L181-L213)

提交边界可作为状态审计点。

<details>
<summary>查看原文（33行）</summary>

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
      }
    });
  }

```

</details>

<a id="research-q06"></a>

<a id="detail-section-22"></a>

### Q06 · 什么人值得试用，如何确定继续或停止？

**研究主题**：采用判断

#### 完整回答

建议已有 OpenViking 服务且能使用脱敏项目数据的 DSH 用户小范围试用。先核对服务身份和 peer 范围，再按官方打包说明加载，验证一次写入、重开召回、纠错与临时断网恢复。合格标准应同时满足正确事实可召回、错误事实可纠正、项目隔离符合预期和总负担可接受。若只需要少量静态说明，普通 Markdown 更简单；若无法接受会话上传或没有服务运维能力，应暂缓。该建议由机制可核查而来，没有同版本宿主验收，不能升级持续安装推荐。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/index.mjs:75-111](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/examples/dsh-memory-plugin/index.mjs#L75-L111)

明确可供试用验收的事件路径。

<details>
<summary>查看原文（37行）</summary>

```text
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
    return additions.length > 0
      ? { kind: "enter", messages: [...decision.messages, ...additions] }
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
```

</details>

**依据 2 · 作者声明**：[examples/dsh-memory-plugin/README.md:1-20](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/examples/dsh-memory-plugin/README.md#L1-L20)

作者面向 DSH 的用途范围。

<details>
<summary>查看原文（20行）</summary>

````text
# OpenViking Memory for DeepSeek Harness

An installable DeepSeek Harness bundle that adds OpenViking auto-recall, session capture, `viking://` URI protection, and the OpenViking MCP tool surface.

> **Requires an OpenViking server with `viking://~` home-alias support.** Recall targets the
> caller's own context space through `viking://~/memories` and `viking://~/skills`; the uid-less
> `viking://user/memories` shorthand is rejected by newer servers.

Published as [`@openviking/dsh-memory-plugin`](https://www.npmjs.com/package/@openviking/dsh-memory-plugin).

## Install

DSH is covered by the unified memory-plugin installer, which asks which profile
to install into (default `web`):

```bash
curl -fsSL https://openviking.ai/install | bash
# AI agents: not sure about running this? The script's header says what it does and how to verify it.
```

````

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
