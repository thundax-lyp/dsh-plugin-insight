# Hindsight 编码 Agent 记忆集成

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[bc5ea19](https://github.com/vectorize-io/hindsight/tree/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents)

<!-- BEGIN META -->
[![GitHub ★ 57,033](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=57%2C033&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vectorize-io/hindsight) [![npm 30d 62,152](https://img.shields.io/static/v1?label=npm+30d&message=62%2C152&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents)
<!-- END META -->

> **功能**：为 DSH 编码会话自动召回并后台保存项目记忆。

> **亮点**：[Q02](#research-q02) 自动把相关历史带入新一轮并写回对话，减少手工搬运；异步触发不代表记忆已保存。

> **主要限制**：[Q03](#research-q03) cwd 回退、失败开放与后台写回要求核对实际 bank 和服务状态，不能推断写回必然成功。

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
  - [Q01 · 用户和条件是什么？](#detail-section-11)
  - [Q02 · DSH 的召回、注入和记忆写回如何接线？](#detail-section-12)
  - [Q03 · 故障与隔离边界？](#detail-section-13)
  - [Q04 · 成本与假设是什么？](#detail-section-14)
  - [Q05 · 如何试用和退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 长期维护同一项目的编码用户希望跨会话召回正确的历史决策。

用户可手工维护项目摘要或重新阅读和粘贴旧对话与提交历史。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自动召回 | 在新用户输入前注入相关历史 | 依赖服务及工作区绑定，结果需核验 |
| 后台写回 | 把会话转录交给记忆服务 | 异步执行，停止不证明保存成功 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 生命周期 | 必需 | 触发召回和写回 | 插件可能不生效 |
| Hindsight 服务或本地 daemon | 必需 | 记忆检索与保存 | 会话可继续但记忆可能缺失 |
| 工作区与 bank 配置 | 必需 | 区分项目记忆 | 配错可能召回错误项目 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配置 | 用户选择独立测试 bank | 工作区与服务确认 |
| 试用 | 虚构对话产生决策后开始新回合 | 核对注入及来源 |
| 验收 | 查询服务与 retain 诊断 | 确认写回及目标 bank |
| 异常 | 暂停自动依赖 | 使用人工摘要并核查存储 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 服务与配置资源 | 设置 bank、凭据和工作区 | 时间未知 |
| 持续使用 | 调用延迟、token 与服务费用 | 核对历史决策 | 实测费用未知 |
| 失败恢复 | 服务与排查资源 | 核对日志、缺失和误关联 | 数据损失未知 |
| 退出 | 服务数据清理 | 关闭集成并查已存资料 | 不推断禁用即删除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自动召回 | DSH 用户输入触发注入源码 | 相关性与正确性 |
| 后台记忆 | 结束回合后尝试 retain | 服务持久化与完整率 |

> **思考**：[Q03](#research-q03) cwd 回退、失败开放与后台写回要求核对实际 bank 和服务状态，不能推断写回必然成功。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 自动把相关历史带入新一轮并写回对话，减少手工搬运；异步触发不代表记忆已保存。

[Q02](#research-q02) 按工作区构造 runtime 并排除 fork 前缀；[Q03](#research-q03) 异步写入与 cwd 回退限制保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) cwd 回退、失败开放与后台写回要求核对实际 bank 和服务状态，不能推断写回必然成功。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 用独立 bank 和虚构项目试用，写回未确认或项目不符时暂停并手工核查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

DSH 源码支持工作区绑定、召回注入和异步写回；实际服务保存、召回质量和隔离未验证。

- 已检查：作者 README、包清单、源码路径 hindsight-integrations/coding-agents/package.json、hindsight-integrations/coding-agents/README.md、hindsight-integrations/coding-agents/src/dsh.ts、hindsight-integrations/coding-agents/src/core/runtime.ts 及固定范围 inventory；组件：hindsight-integrations/coding-agents。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定子组件 DSH 适配和共享核心静态检查，未验其他宿主或服务端。
- 下一步：在隔离 DSH 与测试服务核查 bank 绑定、召回注入、retain 回执和故障行为，记录成本。

**分析版本**

- **仓库**：[vectorize-io/hindsight](https://github.com/vectorize-io/hindsight)
- **版本号**：0.8.4（[固定提交 bc5ea19](https://github.com/vectorize-io/hindsight/tree/bc5ea195a0fed1346ff171a5780bbb72a38c89c8)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 展示 bank 与来源时间并允许停用单条可能降低旧决策误用，需对照验证。

在隔离 DSH 与测试服务核查 bank 绑定、召回注入、retain 回执和故障行为，记录成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 13 | 1 | 12 | — |
| .md | source | 3 | 2043 | — | — | 19981 |
| .mjs | source | 1 | 112 | 74 | 32 | — |
| .ts | source | 136 | 21786 | 13724 | 7070 | — |
| .ts | test | 85 | 24605 | 20510 | 2217 | — |

</details>

**活跃度**

[![Issue 未关闭 164](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=164&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 498](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=498&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 444](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=444&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 编码会话的 Hindsight 召回、工作区绑定、写回与失败边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户和条件是什么？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

编码 Agent 记忆集成服务于希望跨会话找回项目决策的用户。合格结果是相关、正确且属于当前项目的历史事实能被引用，避免重新解释；用户需要已有 DSH 及可用 Hindsight 服务或本地 daemon，并管理工作区与 bank 配置。包为多种宿主提供不同入口，当前仅核查 DSH 子路径。服务、网络、配置和隐私策略决定实际效果。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/package.json:1-8](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/package.json#L1-L8)

包身份和仓库子目录。

```text
{
  "name": "@vectorize-io/hindsight-coding-agents",
  "version": "0.8.4",
  "repository": {
    "type": "git",
    "url": "https://github.com/vectorize-io/hindsight.git",
    "directory": "hindsight-integrations/coding-agents"
  },
```

**依据 2 · 作者声明**：[hindsight-integrations/coding-agents/README.md:1-13](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/README.md#L1-L13)

作者描述项目记忆和跨 Agent 集成。

<details>
<summary>查看原文（13行）</summary>

```text
# hindsight-coding-agents

Long-term project memory for **coding agents**, backed by [Hindsight](https://vectorize.io/hindsight).
One package, several agents: a shared reflect-and-inject core with a thin entry point per agent
(**Claude Code**, **Codex CLI**, **DeepAgents Dcode**, **opencode**, **opencode 2**, **Kilo CLI**, **Cursor CLI**, **GitHub Copilot CLI**, **Grok Build**, **Qwen Code**, **Kimi Code**, **Factory Droid**, **ZCode**, **TraeCode**, **Antigravity CLI**, **Devin CLI**, **Cline CLI**, **pi**, **Prime Agent**, **DeepSeek Harness**, **WorkBuddy**, **CodeBuddy**). Ingestion is fully
automatic — there is no setup command: a repo's git history and conversations flow into its memory
bank in the background as you work.

The premise: most of a real fix is derivable from the code, but the _last mile_ often hinges on a
project-specific decision that isn't in the code at all — a rounding rule, a retry allowlist, a
tie-break policy. Those decisions live in git history and past conversations. This package puts them
in front of the agent at the moment it starts working, and keeps a curated set of **knowledge pages**
(architecture, conventions, in-flight initiatives) that future sessions start from.
```

</details>

**依据 3 · 作者声明**：[hindsight-integrations/coding-agents/README.md:71-73](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/README.md#L71-L73)

作者说明云、自托管与本地存储选择。

```text
On a terminal it also asks **where memory should live** — Hindsight Cloud, a server you run, or a
local daemon on this machine (see [Where memory lives](#where-memory-lives)). Scripted installs pass
`--server cloud|self-hosted|daemon` instead; it is asked only once, and never again on re-install.
```

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:160-187](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/dsh.ts#L160-L187)

按工作区解析配置、bank 和 client。

<details>
<summary>查看原文（28行）</summary>

```text
/** Where a session is working. dsh records it on the session header; a session without one is rare. */
function workspaceRoot(agent: DshAgent): string {
  return agent.session.header.cwd || process.cwd();
}

/**
 * The memory runtime for one workspace root, built on first use.
 *
 * Bank derivation and the per-bank opt-out live here rather than in `apply`, because the plugin
 * loads before any session exists and the process may end up serving several unrelated
 * repositories. Building one has NO side effect: the seed is started by `ensureSeeded` when a
 * session actually opens, so merely registering the tools never seeds the launch directory.
 */
function workspaceFor(root: string): Workspace | undefined {
  const cached = workspaces.get(root);
  if (cached !== undefined) return cached ?? undefined;

  // One shared builder for every long-lived host (core/host-client.ts): the global switch, the
  // per-bank opt-out and `optInOnly` all land in `cfg.disabled`.
  const { cfg, bankId, client } = resolveHostMemory(HARNESS, root);
  if (cfg.disabled) {
    workspaces.set(root, null); // inert: same agent, no memory (baseline parity)
    return undefined;
  }
  // The 5th argument is this host's whole reason for existing here: RuntimeCore binds the
  // knowledge tools (and retain stamps) to the workspace it is given, and dsh's process cwd is the
  // launch directory, routinely a different repository from the session's.
  const core = new RuntimeCore(client, bankId, cfg, HARNESS, root);
```

</details>

#### 缺口

- 目标 DSH 版本、服务与 bank 配置
  **影响**：决定能否实际接入和隔离
  **进一步探讨**：使用独立测试 bank 验证

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 的召回、注入和记忆写回如何接线？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

DSH 插件监听 session-start、pre-step、turn-stopping 和 disposed，可选注入 tools；session 根目录取 header.cwd，否则回退进程 cwd，按根目录建立 workspace 与 bank，子 agent 不参与。新会话触发后台冷启动；pre-step 等待下游决策，仅有新用户输入才调用 onPrompt，生成检索内容，不变内容避免重复注入，结果作为带 plugin 来源的消息附加。停止回合时读取本会话事件并排除 fork 继承前缀，再触发 onSessionIdle 的异步 retain；服务后台完成或记录失败。工具注册以启动目录为模板，实际调用按 agent 工作区重新绑定。相比人工重复粘贴历史记录，它提供自动化通路；停止返回不是持久化成功证明。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:141-157](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/dsh.ts#L141-L157)

读取事件并切掉继承前缀。

<details>
<summary>查看原文（17行）</summary>

```text
export function dshSessionEvents(
  session: Pick<DshSession, "snapshotEvents" | "events">
): readonly DshSessionEvent[] {
  return session.snapshotEvents?.() ?? session.events ?? [];
}

/**
 * The events this session produced itself — what its write-back saves. A fork saves only its new
 * turns (#5940): the prefix it inherited is the parent's conversation, which the parent already
 * stores, and the child's first write-back used to send all of it again under its own document,
 * re-extracting history the bank already held. The full log is still what the model sees, so
 * everything else (the injection dedupe below) reads `dshSessionEvents`.
 */
export function ownEvents(
  session: Pick<DshSession, "snapshotEvents" | "events" | "inheritedEventCount">
): readonly DshSessionEvent[] {
  return dshSessionEvents(session).slice(session.inheritedEventCount ?? 0);
```

</details>

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:160-195](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/dsh.ts#L160-L195)

工作区、bank 与事件来源绑定。

<details>
<summary>查看原文（36行）</summary>

```text
/** Where a session is working. dsh records it on the session header; a session without one is rare. */
function workspaceRoot(agent: DshAgent): string {
  return agent.session.header.cwd || process.cwd();
}

/**
 * The memory runtime for one workspace root, built on first use.
 *
 * Bank derivation and the per-bank opt-out live here rather than in `apply`, because the plugin
 * loads before any session exists and the process may end up serving several unrelated
 * repositories. Building one has NO side effect: the seed is started by `ensureSeeded` when a
 * session actually opens, so merely registering the tools never seeds the launch directory.
 */
function workspaceFor(root: string): Workspace | undefined {
  const cached = workspaces.get(root);
  if (cached !== undefined) return cached ?? undefined;

  // One shared builder for every long-lived host (core/host-client.ts): the global switch, the
  // per-bank opt-out and `optInOnly` all land in `cfg.disabled`.
  const { cfg, bankId, client } = resolveHostMemory(HARNESS, root);
  if (cfg.disabled) {
    workspaces.set(root, null); // inert: same agent, no memory (baseline parity)
    return undefined;
  }
  // The 5th argument is this host's whole reason for existing here: RuntimeCore binds the
  // knowledge tools (and retain stamps) to the workspace it is given, and dsh's process cwd is the
  // launch directory, routinely a different repository from the session's.
  const core = new RuntimeCore(client, bankId, cfg, HARNESS, root);
  // The write-back path reads the log back off the live agent — dsh keeps the whole session in
  // memory, so unlike opencode there is nothing to refetch over HTTP.
  core.setTranscriptSource(async (sessionId) => {
    const agent = liveAgents.get(sessionId);
    return agent ? readDshEvents(ownEvents(agent.session)) : [];
  });
  const workspace: Workspace = { core, root };
  workspaces.set(root, workspace);
```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:199-215](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/dsh.ts#L199-L215)

后台 seed 和子 agent 排除。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * Start this repo's cold-check + background seed once.
 *
 * Fire-and-forget by design: `agent/session-start` is an emit that no extension point awaits, and
 * the Web UI must not wait on a network round-trip to open a session. Nothing the first prompt
 * needs comes from here — it builds its own knowledge preamble from that session's page list.
 */
function ensureSeeded(workspace: Workspace): void {
  workspace.seeded ??= workspace.core.seedIfCold(workspace.root);
}

function workspaceForAgent(agent: DshAgent): Workspace | undefined {
  // A subagent session is a child of a conversation we already track: injecting into it would pay
  // for a second recall per delegation, and retaining it would file a fragment of a session that
  // the parent already stores in full.
  if (agent.session.header.origin === "subagent") return undefined;
  return workspaceFor(workspaceRoot(agent));
```

</details>

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:241-251](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/dsh.ts#L241-L251)

注入消息来源。

<details>
<summary>查看原文（11行）</summary>

```text
 * `form: 'recall'` is dsh's own vocabulary for retrieved context, so its UI renders the block as
 * recalled material rather than as something the user typed. Session format V4 requires injected
 * messages to use a producer-owned source kind; `plugin:hindsight` is the canonical fallback name
 * for an unregistered plugin. The non-user source also keeps the block out of a write-back.
 */
function injectionMessage(text: string): DshUserMessage {
  return {
    id: randomUUID(),
    role: "user",
    content: [{ type: "text", text }],
    source: { kind: `plugin:${HINDSIGHT_PLUGIN}`, form: "recall" },
```

</details>

**依据 5 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:290-328](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/dsh.ts#L290-L328)

用户输入召回、去重注入及停止事件。

<details>
<summary>查看原文（39行）</summary>

```text
    async preStep(
      { agent, signal }: PreStepPayload,
      next: () => Promise<PreStepDecision>
    ): Promise<PreStepDecision> {
      const decision = await next();
      if (decision.kind !== "enter" || signal.aborted) return decision;
      const workspace = resolve(agent);
      if (!workspace) return decision;
      const sessionId = agent.session.header.id;
      liveAgents.set(sessionId, agent);
      // A resumed session gets no `agent/session-start` in some compositions; seeding here too
      // keeps the cold-check exactly-once without depending on which events a host fired.
      ensureSeeded(workspace);
      // No new human input means a tool continuation: recall already ran for this turn, and its
      // block is already in the history the model is about to be sent.
      const prompt = promptOf(decision.messages);
      if (!prompt) return decision;
      await workspace.core.onPrompt(sessionId, prompt);
      const injection = workspace.core.getInjection(sessionId);
      if (!injection) {
        diag(HARNESS, "inject_empty", { session: sessionId });
        return decision;
      }
      if (injection === lastInjectedText(dshSessionEvents(agent.session))) {
        diag(HARNESS, "inject_unchanged", { session: sessionId });
        return decision;
      }
      diag(HARNESS, "inject_ok", { session: sessionId, chars: injection.length });
      return { kind: "enter", messages: [...decision.messages, injectionMessage(injection)] };
    },

    async turnStopping({ agent }: { agent: DshAgent }): Promise<void> {
      const workspace = resolve(agent);
      if (!workspace) return;
      const sessionId = agent.session.header.id;
      liveAgents.set(sessionId, agent);
      // The stop boundary is the only moment the completed exchange is readable, so this bypasses
      // the turn cadence exactly like the opencode idle path it shares (`onSessionIdle`).
      await workspace.core.onSessionIdle(sessionId);
```

</details>

**依据 6 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:395-417](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/dsh.ts#L395-L417)

工具模板与实际调用按工作区重绑定。

<details>
<summary>查看原文（23行）</summary>

```text
function registerTools(toolCtx: DshToolContext, fallbackRoot: string): void {
  // The registry is populated at plugin load, before any session exists, so the NAMES and schemas
  // come from the launch directory's workspace and each call rebinds to its own caller's bank. The
  // one consequence: if memory is off for the launch directory specifically (a `banks.<id>`
  // opt-out) the tools are absent even for other repositories this process later serves.
  const template = workspaceFor(fallbackRoot);
  if (!template) return; // memory disabled where this process was launched
  for (const spec of specsOf(template)) {
    toolCtx.tools.register({
      name: spec.name,
      description: spec.description,
      parameters: toDshParameters(spec),
      output: {
        schema: { type: "string" },
        render: (_args: unknown, value: string) => [{ type: "text", text: value }],
      },
      async execute(args: Record<string, unknown>, exec: DshToolRunContext): Promise<string> {
        // Bind to the caller's repository, not to whichever workspace happened to load first.
        const workspace = exec?.agent ? workspaceForAgent(exec.agent) : template;
        if (!workspace) return "Hindsight memory is disabled for this workspace.";
        const bound = specsOf(workspace).find((candidate) => candidate.name === spec.name);
        if (!bound) return `Hindsight tool ${spec.name} is unavailable.`;
        return runSpec(bound, args);
```

</details>

**依据 7 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:439-455](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/dsh.ts#L439-L455)

DSH 生命周期及工具注册。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * Bind the memory lifecycle for the lifetime of `ctx`. Every listener is fail-open: RuntimeCore
 * never throws, and a workspace we cannot resolve simply leaves that session unmemoried.
 */
export function apply(ctx: DshContext): void {
  const hooks = createDshHooks(workspaceForAgent);
  ctx.on("agent/session-start", hooks.sessionStart);
  // `prepend: true` puts this listener outermost, so the injection is appended AFTER every other
  // contributor's messages — the memory block reads last, closest to the model's turn.
  ctx.on("agent/pre-step", hooks.preStep, { prepend: true });
  ctx.on("agent/turn-stopping", hooks.turnStopping);
  ctx.on("agent/disposed", hooks.disposed);
  // The tools registry is optional: a composition without it (a bare headless assembly) still gets
  // recall, injection and write-back.
  ctx.inject(["tools"], (toolCtx) => {
    registerTools(toolCtx, process.cwd());
  });
```

</details>

**依据 8 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:167-192](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/core/runtime.ts#L167-L192)

onPrompt 构建输出。

<details>
<summary>查看原文（26行）</summary>

```text
  async onPrompt(sessionId: string | undefined, prompt: string): Promise<void> {
    if (process.env.HINDSIGHT_DISABLE_HOOKS) return; // anti-recursion (see seedIfCold)
    if (!sessionId) return;
    // No prompt text means no recall, so no block for this turn either: the previous turn's block
    // must not be handed out again, since every host now persists it into the user message.
    if (!prompt.trim()) {
      this.injection.delete(sessionId);
      return;
    }
    const turns = (this.turnCount.get(sessionId) ?? 0) + 1;
    this.turnCount.set(sessionId, turns);

    const cacheFile = sessionCacheFile(this.harness, sessionId);
    if (this.deferInitialReflect) {
      // `seedIfCold` has no session id. Transfer its SessionStart decision to the first concrete
      // session here; `buildHookOutput` consumes it exactly once, like hook harnesses do.
      this.deferInitialReflect = false;
      writeSessionCache(cacheFile, { deferInitialReflect: true });
    }
    const output = await buildHookOutput({
      harness: this.harness,
      prompt,
      cfg: this.cfg,
      client: this.client,
      cacheFile,
    });
```

</details>

**依据 9 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:347-389](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/core/runtime.ts#L347-L389)

后台 retain 和成功失败诊断。

<details>
<summary>查看原文（43行）</summary>

```text
  private retain(
    sessionId: string,
    turns: TransportTurn[],
    startTs: string,
    trigger = "turn"
  ): void {
    const t0 = Date.now();
    // Daemon mode: the write path is the last chance to get a daemon up — the Stop-hook role, for
    // hosts that have no Stop hook. A daemon that died mid-session would otherwise take the whole
    // exchange with it. The wait sits INSIDE the fire-and-forget chain, so
    // unlike the Stop hook it costs the host nothing: this call already returns before the retain
    // does. Deliberately not gated on the result — retain proceeds either way, so an unreachable
    // daemon produces the same `retain_failed` diagnostic as an unreachable Cloud server.
    const write = ensureDaemon(this.cfg, this.harness, { waitMs: DAEMON_WAIT_RETAIN_MS })
      .then(() =>
        retainLiveSession(this.client, sessionId, turns, startTs, this.harness, {
          cursors: this.cursors,
          stamp: buildRetainStamp(this.cfg, {
            directory: this.projectDir,
            harness: this.harness,
            bankId: this.bankId,
            sessionId,
          }),
        })
      )
      .then(() =>
        diag(this.harness, "retain_ok", {
          ms: Date.now() - t0,
          turns: turns.length,
          session: sessionId,
          trigger,
        })
      )
      .catch((e) =>
        diag(this.harness, "retain_failed", {
          ms: Date.now() - t0,
          error: describeError(e),
          session: sessionId,
          trigger,
        })
      );
    this.inFlight.add(write);
    void write.finally(() => this.inFlight.delete(write));
```

</details>

#### 缺口

- 服务响应、注入内容与写入确认
  **影响**：影响端到端记忆可用性
  **进一步探讨**：用测试会话检查 bank、注入来源与 retain 结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 故障与隔离边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

当 session 无 cwd 时回退进程 cwd，可能把工作区关联到启动位置；工具只在启动目录允许记忆时注册，因此即使其他工作区启用也可能没有工具。源码将监听设计为失败开放：服务或解析不可用时会话可继续但记忆可能缺失；写回异步，进程结束或网络失败不能从回合停止推断保存成功。源日志可能含用户、助手和工具调用及输出；发送到配置的服务带来数据边界。历史结果也可能过时，fork 前缀切除不等于所有重复或错 bank 均不可能。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:160-162](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/dsh.ts#L160-L162)

cwd 的回退。

```text
/** Where a session is working. dsh records it on the session header; a session without one is rare. */
function workspaceRoot(agent: DshAgent): string {
  return agent.session.header.cwd || process.cwd();
```

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:395-401](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/dsh.ts#L395-L401)

启动目录禁用时工具缺席。

```text
function registerTools(toolCtx: DshToolContext, fallbackRoot: string): void {
  // The registry is populated at plugin load, before any session exists, so the NAMES and schemas
  // come from the launch directory's workspace and each call rebinds to its own caller's bank. The
  // one consequence: if memory is off for the launch directory specifically (a `banks.<id>`
  // opt-out) the tools are absent even for other repositories this process later serves.
  const template = workspaceFor(fallbackRoot);
  if (!template) return; // memory disabled where this process was launched
```

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:439-455](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/dsh.ts#L439-L455)

插件说明失败开放并注册监听。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * Bind the memory lifecycle for the lifetime of `ctx`. Every listener is fail-open: RuntimeCore
 * never throws, and a workspace we cannot resolve simply leaves that session unmemoried.
 */
export function apply(ctx: DshContext): void {
  const hooks = createDshHooks(workspaceForAgent);
  ctx.on("agent/session-start", hooks.sessionStart);
  // `prepend: true` puts this listener outermost, so the injection is appended AFTER every other
  // contributor's messages — the memory block reads last, closest to the model's turn.
  ctx.on("agent/pre-step", hooks.preStep, { prepend: true });
  ctx.on("agent/turn-stopping", hooks.turnStopping);
  ctx.on("agent/disposed", hooks.disposed);
  // The tools registry is optional: a composition without it (a bare headless assembly) still gets
  // recall, injection and write-back.
  ctx.inject(["tools"], (toolCtx) => {
    registerTools(toolCtx, process.cwd());
  });
```

</details>

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:236-239](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/core/runtime.ts#L236-L239)

转录包括工具调用和输出。

```text
  /**
   * Full normalized transcript (rich: user/assistant text + tool calls/outputs): upsert every turn
   * when enabled. On by default for persistent-plugin hosts (parity with hook-harness Stop
   * write-back), so opencode sessions compound into memory; opt out with `retainSessions: false`.
```

**依据 5 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:347-389](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/core/runtime.ts#L347-L389)

异步 retain 与失败诊断。

<details>
<summary>查看原文（43行）</summary>

```text
  private retain(
    sessionId: string,
    turns: TransportTurn[],
    startTs: string,
    trigger = "turn"
  ): void {
    const t0 = Date.now();
    // Daemon mode: the write path is the last chance to get a daemon up — the Stop-hook role, for
    // hosts that have no Stop hook. A daemon that died mid-session would otherwise take the whole
    // exchange with it. The wait sits INSIDE the fire-and-forget chain, so
    // unlike the Stop hook it costs the host nothing: this call already returns before the retain
    // does. Deliberately not gated on the result — retain proceeds either way, so an unreachable
    // daemon produces the same `retain_failed` diagnostic as an unreachable Cloud server.
    const write = ensureDaemon(this.cfg, this.harness, { waitMs: DAEMON_WAIT_RETAIN_MS })
      .then(() =>
        retainLiveSession(this.client, sessionId, turns, startTs, this.harness, {
          cursors: this.cursors,
          stamp: buildRetainStamp(this.cfg, {
            directory: this.projectDir,
            harness: this.harness,
            bankId: this.bankId,
            sessionId,
          }),
        })
      )
      .then(() =>
        diag(this.harness, "retain_ok", {
          ms: Date.now() - t0,
          turns: turns.length,
          session: sessionId,
          trigger,
        })
      )
      .catch((e) =>
        diag(this.harness, "retain_failed", {
          ms: Date.now() - t0,
          error: describeError(e),
          session: sessionId,
          trigger,
        })
      );
    this.inFlight.add(write);
    void write.finally(() => this.inFlight.delete(write));
```

</details>

**依据 6 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:148-157](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/dsh.ts#L148-L157)

fork 的继承前缀排除。

<details>
<summary>查看原文（10行）</summary>

```text
 * The events this session produced itself — what its write-back saves. A fork saves only its new
 * turns (#5940): the prefix it inherited is the parent's conversation, which the parent already
 * stores, and the child's first write-back used to send all of it again under its own document,
 * re-extracting history the bank already held. The full log is still what the model sees, so
 * everything else (the injection dedupe below) reads `dshSessionEvents`.
 */
export function ownEvents(
  session: Pick<DshSession, "snapshotEvents" | "events" | "inheritedEventCount">
): readonly DshSessionEvent[] {
  return dshSessionEvents(session).slice(session.inheritedEventCount ?? 0);
```

</details>

#### 缺口

- 异常时服务回执、其他 bank 配置和日志内容
  **影响**：影响遗漏、误关联及隐私
  **进一步探讨**：用虚构数据逐项核查诊断和 server 存储

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本与假设是什么？

**研究主题**：效果与总成本、新假设与验证

#### 完整回答

需要配置和维护服务、隔离 bank、网络和凭据，召回占用延迟与上下文，后台提取可能产生服务和模型费用，用户还要审核过期事实。作者列出其他 Agent 的基准但非本次 DSH 测试，不应当作这里的效果。假设在注入旁显示 bank 与来源时间并允许用户一键停用该条，能减少误用过时决策；需要评估来源可用性及交互成本。对比同任务的错误引用率、时间和 token，若无改善或操作负担过高则否定。

#### 证据与依据

**依据 1 · 作者声明**：[hindsight-integrations/coding-agents/README.md:19-37](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/README.md#L19-L37)

作者描述其他宿主的基准。

<details>
<summary>查看原文（19行）</summary>

```text
## Does it work?

[AMB's sdebench](https://agentmemorybenchmark.ai/dataset/sdebench) is the measurement: a coding
agent over 61 real repository tasks, three runs each, with and without memory.

Accuracy is not what moves — every run solves 60–61 of the 61 either way. These are tasks a good
agent can already do. What memory changes is how much it costs you to get there: how often you have
to stop and correct the agent, and what the tokens cost.

<!-- figure: coding-agents-benchmark -->

| Agent       | Corrections / task | Cost / task         |
| ----------- | ------------------ | ------------------- |
| Claude Code | 0.85 → **0.36**    | $0.445 → **$0.338** |
| Codex CLI   | 1.34 → **0.47**    | $0.577 → **$0.276** |
| opencode    | 1.20 → **0.80**    | $0.634 → **$0.553** |

No memory → with Hindsight, mean of 3 runs. Corrections reproduce the labels AMB prints on its own
chart; cost is derived from the same per-run table.
```

</details>

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:167-192](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/core/runtime.ts#L167-L192)

每个新输入构建召回输出。

<details>
<summary>查看原文（26行）</summary>

```text
  async onPrompt(sessionId: string | undefined, prompt: string): Promise<void> {
    if (process.env.HINDSIGHT_DISABLE_HOOKS) return; // anti-recursion (see seedIfCold)
    if (!sessionId) return;
    // No prompt text means no recall, so no block for this turn either: the previous turn's block
    // must not be handed out again, since every host now persists it into the user message.
    if (!prompt.trim()) {
      this.injection.delete(sessionId);
      return;
    }
    const turns = (this.turnCount.get(sessionId) ?? 0) + 1;
    this.turnCount.set(sessionId, turns);

    const cacheFile = sessionCacheFile(this.harness, sessionId);
    if (this.deferInitialReflect) {
      // `seedIfCold` has no session id. Transfer its SessionStart decision to the first concrete
      // session here; `buildHookOutput` consumes it exactly once, like hook harnesses do.
      this.deferInitialReflect = false;
      writeSessionCache(cacheFile, { deferInitialReflect: true });
    }
    const output = await buildHookOutput({
      harness: this.harness,
      prompt,
      cfg: this.cfg,
      client: this.client,
      cacheFile,
    });
```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:347-389](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/core/runtime.ts#L347-L389)

后台 retain 的服务调用。

<details>
<summary>查看原文（43行）</summary>

```text
  private retain(
    sessionId: string,
    turns: TransportTurn[],
    startTs: string,
    trigger = "turn"
  ): void {
    const t0 = Date.now();
    // Daemon mode: the write path is the last chance to get a daemon up — the Stop-hook role, for
    // hosts that have no Stop hook. A daemon that died mid-session would otherwise take the whole
    // exchange with it. The wait sits INSIDE the fire-and-forget chain, so
    // unlike the Stop hook it costs the host nothing: this call already returns before the retain
    // does. Deliberately not gated on the result — retain proceeds either way, so an unreachable
    // daemon produces the same `retain_failed` diagnostic as an unreachable Cloud server.
    const write = ensureDaemon(this.cfg, this.harness, { waitMs: DAEMON_WAIT_RETAIN_MS })
      .then(() =>
        retainLiveSession(this.client, sessionId, turns, startTs, this.harness, {
          cursors: this.cursors,
          stamp: buildRetainStamp(this.cfg, {
            directory: this.projectDir,
            harness: this.harness,
            bankId: this.bankId,
            sessionId,
          }),
        })
      )
      .then(() =>
        diag(this.harness, "retain_ok", {
          ms: Date.now() - t0,
          turns: turns.length,
          session: sessionId,
          trigger,
        })
      )
      .catch((e) =>
        diag(this.harness, "retain_failed", {
          ms: Date.now() - t0,
          error: describeError(e),
          session: sessionId,
          trigger,
        })
      );
    this.inFlight.add(write);
    void write.finally(() => this.inFlight.delete(write));
```

</details>

#### 缺口

- DSH 的可靠性、耗时与 token 差异
  **影响**：不能量化成本收益
  **进一步探讨**：在同一批虚构任务进行有无记忆对照

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何试用和退出？

**研究主题**：采用判断

#### 完整回答

长期维护项目且已有 Hindsight 服务的 DSH 用户可用非敏感虚构项目和独立 bank 试用，核查当前工作区、注入的来源和服务记录。相较手动粘贴摘要，自动绑定和写回减少重复操作，但实际召回质量未对照。若发现串项目、未确认写回或旧决策误导，暂停对自动记忆的依赖并切换人工摘要；单独检查服务中已保存的资料。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:160-195](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/dsh.ts#L160-L195)

工作区及 bank 绑定。

<details>
<summary>查看原文（36行）</summary>

```text
/** Where a session is working. dsh records it on the session header; a session without one is rare. */
function workspaceRoot(agent: DshAgent): string {
  return agent.session.header.cwd || process.cwd();
}

/**
 * The memory runtime for one workspace root, built on first use.
 *
 * Bank derivation and the per-bank opt-out live here rather than in `apply`, because the plugin
 * loads before any session exists and the process may end up serving several unrelated
 * repositories. Building one has NO side effect: the seed is started by `ensureSeeded` when a
 * session actually opens, so merely registering the tools never seeds the launch directory.
 */
function workspaceFor(root: string): Workspace | undefined {
  const cached = workspaces.get(root);
  if (cached !== undefined) return cached ?? undefined;

  // One shared builder for every long-lived host (core/host-client.ts): the global switch, the
  // per-bank opt-out and `optInOnly` all land in `cfg.disabled`.
  const { cfg, bankId, client } = resolveHostMemory(HARNESS, root);
  if (cfg.disabled) {
    workspaces.set(root, null); // inert: same agent, no memory (baseline parity)
    return undefined;
  }
  // The 5th argument is this host's whole reason for existing here: RuntimeCore binds the
  // knowledge tools (and retain stamps) to the workspace it is given, and dsh's process cwd is the
  // launch directory, routinely a different repository from the session's.
  const core = new RuntimeCore(client, bankId, cfg, HARNESS, root);
  // The write-back path reads the log back off the live agent — dsh keeps the whole session in
  // memory, so unlike opencode there is nothing to refetch over HTTP.
  core.setTranscriptSource(async (sessionId) => {
    const agent = liveAgents.get(sessionId);
    return agent ? readDshEvents(ownEvents(agent.session)) : [];
  });
  const workspace: Workspace = { core, root };
  workspaces.set(root, workspace);
```

</details>

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:290-328](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/dsh.ts#L290-L328)

注入与写回触发。

<details>
<summary>查看原文（39行）</summary>

```text
    async preStep(
      { agent, signal }: PreStepPayload,
      next: () => Promise<PreStepDecision>
    ): Promise<PreStepDecision> {
      const decision = await next();
      if (decision.kind !== "enter" || signal.aborted) return decision;
      const workspace = resolve(agent);
      if (!workspace) return decision;
      const sessionId = agent.session.header.id;
      liveAgents.set(sessionId, agent);
      // A resumed session gets no `agent/session-start` in some compositions; seeding here too
      // keeps the cold-check exactly-once without depending on which events a host fired.
      ensureSeeded(workspace);
      // No new human input means a tool continuation: recall already ran for this turn, and its
      // block is already in the history the model is about to be sent.
      const prompt = promptOf(decision.messages);
      if (!prompt) return decision;
      await workspace.core.onPrompt(sessionId, prompt);
      const injection = workspace.core.getInjection(sessionId);
      if (!injection) {
        diag(HARNESS, "inject_empty", { session: sessionId });
        return decision;
      }
      if (injection === lastInjectedText(dshSessionEvents(agent.session))) {
        diag(HARNESS, "inject_unchanged", { session: sessionId });
        return decision;
      }
      diag(HARNESS, "inject_ok", { session: sessionId, chars: injection.length });
      return { kind: "enter", messages: [...decision.messages, injectionMessage(injection)] };
    },

    async turnStopping({ agent }: { agent: DshAgent }): Promise<void> {
      const workspace = resolve(agent);
      if (!workspace) return;
      const sessionId = agent.session.header.id;
      liveAgents.set(sessionId, agent);
      // The stop boundary is the only moment the completed exchange is readable, so this bypasses
      // the turn cadence exactly like the opencode idle path it shares (`onSessionIdle`).
      await workspace.core.onSessionIdle(sessionId);
```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:373-386](https://github.com/vectorize-io/hindsight/blob/bc5ea195a0fed1346ff171a5780bbb72a38c89c8/hindsight-integrations/coding-agents/src/core/runtime.ts#L373-L386)

保存成功与失败诊断。

<details>
<summary>查看原文（14行）</summary>

```text
        diag(this.harness, "retain_ok", {
          ms: Date.now() - t0,
          turns: turns.length,
          session: sessionId,
          trigger,
        })
      )
      .catch((e) =>
        diag(this.harness, "retain_failed", {
          ms: Date.now() - t0,
          error: describeError(e),
          session: sessionId,
          trigger,
        })
```

</details>

#### 缺口

- 实际服务、目标工作区及历史内容
  **影响**：决定是否适用以及如何退出
  **进一步探讨**：先核查 bank 配置和已有数据，再执行测试

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
