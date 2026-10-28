# Hindsight 编码 Agent 记忆集成

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1e3a484](https://github.com/vectorize-io/hindsight/tree/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents)

<!-- BEGIN META -->
[![GitHub ★ 54,364](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=54%2C364&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vectorize-io/hindsight) [![npm 30d 61,353](https://img.shields.io/static/v1?label=npm+30d&message=61%2C353&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents)
<!-- END META -->

> **功能**：为编码 Agent 提供 Hindsight 长期记忆、自动摄取和按需知识工具

> **亮点**：按会话工作区绑定 RuntimeCore、fork 切片和历史注入去重组成具体适配增量，避免把进程工作目录或继承对话当作当前项目新输入。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：停止边界不代表异步 retain 已确认；提前推进长度和只记诊断可能让静态会话尾部缺失。启动目录禁用和重构 decision 也限制多工作区及扩展组合。[Q03](#research-q03)

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
  - [Q01 · 长期项目的历史决策如何在 DSH 中成为可用上下文？](#detail-section-11)
  - [Q02 · 召回、工具与写回如何保持调用者项目身份？](#detail-section-12)
  - [Q03 · 停止、禁用和失败诊断能保证记忆已保存吗？](#detail-section-13)
  - [Q04 · 如何进行有意义且可退出的采用验证？](#detail-section-14)
  - [Q05 · 怎样避免写回完成状态与用户理解脱节？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向长期维护同一项目的开发者，在 DSH 中召回历史决策并自动写回完成的交流。

人工摘要和重读会话；组件增加跨宿主共享实现及原生事件适配，服务端记忆算法不归为适配层原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 生命周期记忆 | 按项目召回与异步摄取 | 服务、bank与事件匹配 |
| 原生知识工具 | 工作区绑定的知识操作 | 启动目录未禁用且有tools服务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Hindsight服务/daemon与模型 | 必需 | 召回、提炼与保存 | 记忆缺失，需诊断 |
| DSH 生命周期语义 | 必需 | 获取输入和完成交流 | 无宿主包依赖仍可能语义不兼容 |
| 正确 bank 和工作区策略 | 必需 | 项目范围与工具可见性 | 启动目录禁用会影响其他工作区工具 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户配置非敏感独立bank | 服务与工作区匹配 |
| 交互 | 宿主召回并在停止异步写回 | 核对服务端新交流而非只看停止 |
| 故障验收 | 用户测试fork与断网 | 无继承重复，能发现缺失 |
| 退出 | 禁用接线并处理远端记忆 | 人工摘要可接管 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 服务及初次摄取，金额未知 | bank与策略配置，耗时未知 | 非敏感项目先验证 |
| 持续使用 | 反思、提炼、存储未知 | 纠错和任务复核 | 无合格任务净收益 |
| 失败恢复 | 重试与重复提炼未知 | 查诊断、核对缺失与游标 | 停止不等于已保存 |
| 退出 | 服务留存费用未知 | 清理远端状态及配置 | 卸载不删除记忆 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 项目绑定 | 调用时按Agent工作区选bank | 跨租户授权正确性 |
| 去重复 | fork自有事件和历史块比较 | 复杂分支组合表现 |
| 自动记忆 | 召回和异步retain链 | 原任务质量与漏写频率 |

> **思考**：停止边界不代表异步 retain 已确认；提前推进长度和只记诊断可能让静态会话尾部缺失。启动目录禁用和重构 decision 也限制多工作区及扩展组合。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：按会话工作区绑定 RuntimeCore、fork 切片和历史注入去重组成具体适配增量，避免把进程工作目录或继承对话当作当前项目新输入。[Q01](#research-q01) [Q02](#research-q02)

共享core与薄宿主层可减少重复适配，工具schema受限投影避免悄悄注册错误形状；新宿主需核对真实事件和下游决定字段，不能仅复制结构类型。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

停止边界不代表异步 retain 已确认；提前推进长度和只记诊断可能让静态会话尾部缺失。启动目录禁用和重构 decision 也限制多工作区及扩展组合。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

在独立非敏感bank试用，先验收启动目录工具可见、fork切片和停止后服务端确认；出现串扰、无法确认保存或错误决策即停用并回到人工摘要。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

原生接线与写回边界有源码支持；实际记忆收益和宿主组合未验证，确认游标是研究假设。

- 已检查：作者 README、包清单、源码路径 hindsight-integrations/coding-agents/package.json、hindsight-integrations/coding-agents/src/dsh.ts、hindsight-integrations/coding-agents/src/core/runtime.ts 及固定范围 inventory；组件：hindsight-integrations/coding-agents。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅coding-agents组件，聚焦DSH入口、共享runtime、package导出和关键失败分支；未审计整个Hindsight服务。
- 下一步：当前证据支持机制和条件，原任务收益、写回缺失率和扩展组合需同版本验收。未执行目标代码、安装或测试。

**分析版本**

- **仓库**：[vectorize-io/hindsight](https://github.com/vectorize-io/hindsight)
- **版本号**：0.8.2（[固定提交 1e3a484](https://github.com/vectorize-io/hindsight/tree/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：以服务确认而不是已尝试长度来推进持久写回水位，并将待确认与失败状态暴露给用户，可能减少静态会话尾部漏写。这个改进需设计幂等文档身份、重试和本地敏感数据留存，不能只添加无限重试。最小验证对照当前游标与确认游标，在断网、超时后重启及fork场景记录漏写、重复提炼、恢复时长和磁盘残留。若确认水位的重复与存储负担抵消漏写改善，或现有服务幂等语义不支持，则否定方案。它是由现有异步写回链推导的设计，不能计为已交付功能。 [Q05](#research-q05)

当前证据支持机制和条件，原任务收益、写回缺失率和扩展组合需同版本验收。未执行目标代码、安装或测试。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 11 | 1 | 10 | — |
| .md | source | 3 | 2043 | — | — | 19981 |
| .mjs | source | 1 | 112 | 74 | 32 | — |
| .ts | source | 136 | 21779 | 13723 | 7064 | — |
| .ts | test | 85 | 24574 | 20486 | 2214 | — |

</details>

**活跃度**

[![Issue 未关闭 164](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=164&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 512](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=512&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+created%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z) [![近30天关闭 442](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=442&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：长期项目的历史决策如何在 DSH 中成为可用上下文？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 长期项目的历史决策如何在 DSH 中成为可用上下文？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户是在同一代码库长期开发、背景分散于旧会话和提交的开发者。基线是重读历史并手工粘贴决策；合格结果是新任务得到正确、属于本项目的历史，同时避免旧错误影响新任务。coding-agents 是多宿主适配包，DSH 使用独立 ./dsh 入口和 Cordis bundle，不能把默认 main 与 DSH 入口混淆。其贡献在共享 RuntimeCore 与薄宿主接线、按工作区 bank 绑定、fork 自有事件切片和历史注入去重；记忆算法和反思由服务提供。一次性任务和手工摘要已足够时，自动摄取不一定值得额外服务与纠错负担。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/package.json:54-75](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/package.json#L54-L75)

./dsh 导出与 bundle 独立于默认入口。

<details>
<summary>查看原文（22行）</summary>

```text
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./server": "./index.js",
    "./dsh": "./dist/dsh.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json",
    "./dist/*": "./dist/*"
  },
  "files": [
    "skill",
    "dist",
    "index.js",
    "cordis.patch.yml",
    "plugin.json",
    "hooks"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
```

</details>

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:148-196](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/src/dsh.ts#L148-L196)

fork切片与每工作区 RuntimeCore。

<details>
<summary>查看原文（49行）</summary>

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
}

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
  return workspace;
```

</details>

#### 缺口

- 没有同任务的历史决策正确率与手工时间对照
  **影响**：自动记忆收益仍属条件性分析
  **进一步探讨**：在固定项目问题上对照人工摘要与插件，记录正确决策及纠错分钟。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 召回、工具与写回如何保持调用者项目身份？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

sessionStart 建立 liveAgents 映射并启动一次 seed；preStep 先获取下游决定，只在人类输入存在时调用 core.onPrompt，再把带 plugin:hindsight 来源的 recall 消息追加。去重读取持久会话历史而不是只靠内存 sessionId，因此重启与fork继承历史可保留同块识别。workspace 来自 session.header.cwd，工具执行时再次按调用 Agent 解析 bank；子 Agent 被跳过，避免同一父任务多次摄取。停止边界读取 snapshotEvents，兼容旧 events，再按 inheritedEventCount 去除继承前缀。这些是逻辑命名和路由约束，不是多租户认证证明；有效 bank 和服务权限仍需配置验收。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:141-162](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/src/dsh.ts#L141-L162)

公开事件读取与fork切片。

<details>
<summary>查看原文（22行）</summary>

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
}

/** Where a session is working. dsh records it on the session header; a session without one is rare. */
function workspaceRoot(agent: DshAgent): string {
  return agent.session.header.cwd || process.cwd();
```

</details>

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:210-235](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/src/dsh.ts#L210-L235)

子Agent跳过与仅人类输入。

<details>
<summary>查看原文（26行）</summary>

```text
function workspaceForAgent(agent: DshAgent): Workspace | undefined {
  // A subagent session is a child of a conversation we already track: injecting into it would pay
  // for a second recall per delegation, and retaining it would file a fragment of a session that
  // the parent already stores in full.
  if (agent.session.header.origin === "subagent") return undefined;
  return workspaceFor(workspaceRoot(agent));
}

// ── message helpers ─────────────────────────────────────────────────────────────

/**
 * The human text in this step's claimed batch.
 *
 * `agent/pre-step` fires before EVERY step, including tool continuations that claimed no new input,
 * and other plugins contribute their own context messages to the same batch (V3 hosts tag them
 * `kind: 'plugin'`, V4 hosts use a producer-owned kind such as `time-context`). Only a
 * `kind: 'user'` message is a prompt worth recalling on.
 */
function promptOf(messages: readonly DshUserMessage[]): string {
  return (messages || [])
    .filter((message) => message?.source?.kind === "user")
    .flatMap((message) => message.content || [])
    .filter((block) => block?.type === "text" && block.text)
    .map((block) => block.text!)
    .join("\n")
    .trim();
```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:281-328](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/src/dsh.ts#L281-L328)

生命周期接线与历史注入去重。

<details>
<summary>查看原文（48行）</summary>

```text
export function createDshHooks(resolve: (agent: DshAgent) => Workspace | undefined) {
  return {
    sessionStart({ agent }: { agent: DshAgent }): void {
      const workspace = resolve(agent);
      if (!workspace) return;
      liveAgents.set(agent.session.header.id, agent);
      ensureSeeded(workspace);
    },

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

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:410-417](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/src/dsh.ts#L410-L417)

工具按实际调用者重绑。

```text
      },
      async execute(args: Record<string, unknown>, exec: DshToolRunContext): Promise<string> {
        // Bind to the caller's repository, not to whichever workspace happened to load first.
        const workspace = exec?.agent ? workspaceForAgent(exec.agent) : template;
        if (!workspace) return "Hindsight memory is disabled for this workspace.";
        const bound = specsOf(workspace).find((candidate) => candidate.name === spec.name);
        if (!bound) return `Hindsight tool ${spec.name} is unavailable.`;
        return runSpec(bound, args);
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 停止、禁用和失败诊断能保证记忆已保存吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。turnStopping 虽 await onSessionIdle，后者先把 retainedTurns 推进，再发起异步 retain；retain 的失败链只写诊断，当前没有新增长度的同一会话再次 idle 不会重发。因此任务停止不能等价于服务已确认；需要后续对话、其他恢复策略或人工核对缺失。启动目录如果禁用 memory，工具注册会提前 return，其他工作区仍可能有生命周期记忆但缺少工具。这是注册模板和实际调用 bank 分离的限制。preStep 注入分支重新构造只有 kind/messages 的决定，未展开原 decision；若其他扩展附带语义字段，这些字段会丢失，此处源码事实明确，但当前宿主组合是否依赖字段未运行验证。字符串参数投影会拒绝非 string 工具 schema，降低误注册同时限制可扩展性。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:277-298](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/src/core/runtime.ts#L277-L298)

长度游标先推进后异步retain。

<details>
<summary>查看原文（22行）</summary>

```text
  async onSessionIdle(sessionId: string): Promise<void> {
    if (process.env.HINDSIGHT_DISABLE_HOOKS) return; // anti-recursion (see seedIfCold)
    if (!sessionId || !this.fetchTranscript) return;
    let turns: TransportTurn[];
    try {
      turns = await this.fetchTranscript(sessionId);
    } catch (e) {
      diag(this.harness, "idle_fetch_failed", {
        error: describeError(e),
        session: sessionId,
      });
      return;
    }
    if (!turns.length) return;
    this.recordUsage(sessionId, turns, true); // idle: the reply is in
    if (!this.writeBackEnabled) return; // usage above is local and recorded regardless (#5391)
    const st = this.stateFor(sessionId);
    // idle can fire more than once for one exchange (and again on a session with no new activity);
    // only retain when this transcript actually grew past what we last wrote.
    if (turns.length <= st.retainedTurns) return;
    st.retainedTurns = turns.length;
    this.retain(sessionId, turns, st.startTs, "idle");
```

</details>

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:347-389](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/src/core/runtime.ts#L347-L389)

失败只诊断并维护inFlight。

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

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:395-401](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/src/dsh.ts#L395-L401)

启动目录禁用导致不注册工具。

```text
function registerTools(toolCtx: DshToolContext, fallbackRoot: string): void {
  // The registry is populated at plugin load, before any session exists, so the NAMES and schemas
  // come from the launch directory's workspace and each call rebinds to its own caller's bank. The
  // one consequence: if memory is off for the launch directory specifically (a `banks.<id>`
  // opt-out) the tools are absent even for other repositories this process later serves.
  const template = workspaceFor(fallbackRoot);
  if (!template) return; // memory disabled where this process was launched
```

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:313-318](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/src/dsh.ts#L313-L318)

注入返回未保留下游附加字段。

```text
      if (injection === lastInjectedText(dshSessionEvents(agent.session))) {
        diag(HARNESS, "inject_unchanged", { session: sessionId });
        return decision;
      }
      diag(HARNESS, "inject_ok", { session: sessionId, chars: injection.length });
      return { kind: "enter", messages: [...decision.messages, injectionMessage(injection)] };
```

**依据 5 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:352-375](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/src/dsh.ts#L352-L375)

工具投影仅支持字符串。

<details>
<summary>查看原文（24行）</summary>

```text
export function toDshParameters(spec: ToolSpec): Record<string, unknown> {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  for (const [key, schema] of Object.entries(spec.inputSchema)) {
    const zod = schema as {
      def?: { type?: string; innerType?: { def?: { type?: string } } };
      description?: string;
      isOptional?: () => boolean;
    };
    // `.optional()` wraps the real type, so unwrap before checking it — otherwise every optional
    // parameter would pass the guard below whatever it actually holds.
    const inner = zod.def?.type === "optional" ? zod.def.innerType?.def?.type : zod.def?.type;
    if (inner !== undefined && inner !== "string") {
      throw new Error(
        `hindsight tool ${spec.name}: dsh projection supports string parameters only`
      );
    }
    properties[key] = {
      type: "string",
      ...(zod.description ? { description: zod.description } : {}),
    };
    if (typeof zod.isOptional !== "function" || !zod.isOptional()) required.push(key);
  }
  return { type: "object", properties, ...(required.length ? { required } : {}) };
```

</details>

#### 缺口

- 下游决策附加字段的实际影响未在本次宿主组合验证
  **影响**：可能影响其他扩展协作，不能宣称已复现任务故障
  **进一步探讨**：用带额外标记的pre-step决定核对注入前后，并在目标宿主验证对应行为。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何进行有意义且可退出的采用验证？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要可用 Hindsight 服务或 daemon、模型配置、明确 bank 范围，以及匹配生命周期语义的 DSH；不依赖宿主 npm 包并不意味着事件永远兼容。使用者先在非敏感库配置独立 bank，核对启动目录和会话工作区的工具可见性，固定自动摄取与更新策略。随后测试一次带fork的任务、一次服务中断后的停止写回，验收服务端确有新对话且无继承重复，再比较原任务正确性。现金成本包含初次仓库摄取、反思、提炼和存储，人工成本包含修正旧决策、核对诊断与清理状态，当前均未测。退出需停用接线并单独处理服务器记忆；出现串项目、记忆误导或无法确认保存时，应停止自动依赖并退回人工摘要。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:173-196](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/src/dsh.ts#L173-L196)

共享解析器和disabled bank决定运行时。

<details>
<summary>查看原文（24行）</summary>

```text
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
  return workspace;
```

</details>

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:443-455](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/src/dsh.ts#L443-L455)

实际事件与可选工具注册。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:167-192](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/src/core/runtime.ts#L167-L192)

每提示运行共享输出构建。

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

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:277-298](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/src/core/runtime.ts#L277-L298)

写回开关与长度约束影响验收。

<details>
<summary>查看原文（22行）</summary>

```text
  async onSessionIdle(sessionId: string): Promise<void> {
    if (process.env.HINDSIGHT_DISABLE_HOOKS) return; // anti-recursion (see seedIfCold)
    if (!sessionId || !this.fetchTranscript) return;
    let turns: TransportTurn[];
    try {
      turns = await this.fetchTranscript(sessionId);
    } catch (e) {
      diag(this.harness, "idle_fetch_failed", {
        error: describeError(e),
        session: sessionId,
      });
      return;
    }
    if (!turns.length) return;
    this.recordUsage(sessionId, turns, true); // idle: the reply is in
    if (!this.writeBackEnabled) return; // usage above is local and recorded regardless (#5391)
    const st = this.stateFor(sessionId);
    // idle can fire more than once for one exchange (and again on a session with no new activity);
    // only retain when this transcript actually grew past what we last wrote.
    if (turns.length <= st.retainedTurns) return;
    st.retainedTurns = turns.length;
    this.retain(sessionId, turns, st.startTs, "idle");
```

</details>

#### 缺口

- 没有当前宿主、服务配置和合格任务计量
  **影响**：只能支持受控试用而非持续采用
  **进一步探讨**：同版本记录安装、断网恢复、停用与任务结果，计入所有摄取和人工纠错。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样避免写回完成状态与用户理解脱节？

**研究主题**：新假设与验证

#### 完整回答

未验证假设：以服务确认而不是已尝试长度来推进持久写回水位，并将待确认与失败状态暴露给用户，可能减少静态会话尾部漏写。这个改进需设计幂等文档身份、重试和本地敏感数据留存，不能只添加无限重试。最小验证对照当前游标与确认游标，在断网、超时后重启及fork场景记录漏写、重复提炼、恢复时长和磁盘残留。若确认水位的重复与存储负担抵消漏写改善，或现有服务幂等语义不支持，则否定方案。它是由现有异步写回链推导的设计，不能计为已交付功能。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:293-298](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/src/core/runtime.ts#L293-L298)

尝试前推进水位。

```text
    const st = this.stateFor(sessionId);
    // idle can fire more than once for one exchange (and again on a session with no new activity);
    // only retain when this transcript actually grew past what we last wrote.
    if (turns.length <= st.retainedTurns) return;
    st.retainedTurns = turns.length;
    this.retain(sessionId, turns, st.startTs, "idle");
```

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:360-389](https://github.com/vectorize-io/hindsight/blob/1e3a4841a7eed5d76e796d2f31e5f0a13e78e5cf/hindsight-integrations/coding-agents/src/core/runtime.ts#L360-L389)

异步结果可用于确认反馈。

<details>
<summary>查看原文（30行）</summary>

```text
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

- 确认游标和可见待发状态尚未实现
  **影响**：不能声称当前无损或自动恢复
  **进一步探讨**：先验证服务文档幂等契约，再进行上述故障对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
