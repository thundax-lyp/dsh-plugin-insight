# Hindsight Coding Agents

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b4a0da1](https://github.com/vectorize-io/hindsight/tree/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents)

<!-- BEGIN META -->
[![GitHub ★ 53,255](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53%2C255&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vectorize-io/hindsight) [![npm 30d 55,816](https://img.shields.io/static/v1?label=npm+30d&message=55%2C816&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents)
<!-- END META -->

> **功能**：为编码 Agent 提供跨会话项目记忆、知识页工具和后台历史及对话摄取。

> **亮点**：相对手动粘贴历史，组件将跨宿主生命周期统一到记忆core，并为DSH按workspace绑定、fork切片和注入来源过滤；服务记忆算法不归为适配层原创。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：Agent任务停止并不保证异步retain完成；失败诊断与提前推进长度游标可能使静态会话不补写，且启动bank禁用会使后续workspace缺工具。上述源码风险未运行复现。[Q03](#research-q03)

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
  - [Q01 · 记忆集成解决哪类编码问题，收益声明能否外推DSH？](#detail-section-11)
  - [Q02 · 项目隔离、注入与写回如何闭环，哪些去重措施真实接线？](#detail-section-12)
  - [Q03 · 自动采集会把哪些负担转移给用户，何种失败会被掩盖？](#detail-section-13)
  - [Q04 · 能否把非阻塞写回与可核对记忆完成结合，当前应如何试用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向长期维护同一项目、决策散落在提交与旧对话的开发者；合格结果是用正确项目决策完成原任务。

参照手工项目说明和搜索旧对话；README基准是作者摘要且未包含DSH，不用于本次效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自动项目记忆注入 | 提示开始时带入既有决策 | 服务可用且bank启用；不向子Agent重复注入 |
| 对话异步写回 | 结束后保留新对话 | 不等于停止时已持久化；失败需诊断 |
| hindsight_sync_status | 查看当前项目同步进度 | 需工具注册与对应bank；状态不等于全部记忆完整 |
| hindsight_diagnose | 检查记忆服务配置与故障线索 | 诊断不能替代实际检索或故障恢复验收 |
| hindsight_search_knowledge_pages | 按问题搜索知识页 | 需服务可用；召回相关性与完整性未实测 |
| hindsight_list_knowledge_pages | 查看当前bank知识页目录 | 目录存在不证明页面内容正确或最新 |
| hindsight_read_knowledge_page | 读取指定知识页正文 | 需有效页面标识和服务访问权限；须复核陈旧决策 |
| hindsight_reflect | 按问题综合长期记忆 | 有超时和服务模型成本，效果未实测 |
| hindsight_capture_initiative | 保存项目目标或进行中的事项 | 修改服务端数据；需核对允许保存范围 |
| hindsight_ingest_document | 主动摄取文档内容 | 修改服务端记忆；先确认内容与目标bank的数据边界 |

启动条件与不满足时的影响见[Q03](#research-q03)的“启动与依赖”表。

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配置 | 用户选服务、bank和采集策略 | 明确允许的数据与更新策略 |
| 加载 | DSH profile应用Cordis层 | 事件与工具注册，注意启动bank禁用边界 |
| 使用 | 首次会话种子，人类输入检索与注入 | 当前项目的相关决策进入上下文 |
| 核对 | 任务结束检查retain诊断与可检索内容 | 任务成功和记忆完成分开检查 |
| 停用 | 禁用/移除层并处理服务端数据 | 不以卸载等同删除记忆 |

**效果与成本**

首次使用、持续使用、失败恢复的现金/资源与人工成本见[Q03](#research-q03)的“成本”表；没有实测金额或时长的项目保持未知。

已实现机制与未确定效果分开列在[Q03](#research-q03)的“效果”表，不从源码或作者声明推算业务收益。

> **思考**：Agent任务停止并不保证异步retain完成；失败诊断与提前推进长度游标可能使静态会话不补写，且启动bank禁用会使后续workspace缺工具。上述源码风险未运行复现。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手动粘贴历史，组件将跨宿主生命周期统一到记忆core，并为DSH按workspace绑定、fork切片和注入来源过滤；服务记忆算法不归为适配层原创。[Q01](#research-q01) [Q02](#research-q02)

DSH entry apply 注册session-start、pre-step、turn-stopping和disposed，并按session.header.cwd创建RuntimeCore缓存，而非只用进程cwd。调用工具时再绑定实际调用Agent的workspace；子Agent直接跳过记忆注入和写回。session-start启动一次冷种子；pre-step先取得宿主decision，只在人类输入存在且未取消时调用onPrompt，再把producer-owned来源的记忆消息追加到输入。

去重使用持久会话历史中的lastInjectedText，而不只依赖内存sessionId，因而可以识别fork继承的相同注入。写回读取snapshotEvents优先、legacy events兜底，按inheritedEventCount切掉fork继承前缀，再规范化对话。normalizer只接纳source.kind=user的人类提示，保留assistant正文和简化tool/call，跳过tool/result；这减少插件自己的注入再进入记忆导致循环放大。

turn-stopping虽await onSessionIdle，但retain内部仍是异步链加入inFlight，所以“已到停止边界”不等于服务已确认写入。当前机制能说明如何抑制重复与串项目，不能直接证明所有宿主事件形状都兼容。dsh.test.ts含fork、subagent和snapshotEvents测试源码，本轮仅阅读，不称通过。

可借鉴的是shared core与薄宿主适配层、生产者来源过滤和工具schema受限投影；移植需核查真实事件与调用者workspace，不能只复制结构类型接口。

<a id="detail-section-5"></a>

### 1.4 主要限制

Agent任务停止并不保证异步retain完成；失败诊断与提前推进长度游标可能使静态会话不补写，且启动bank禁用会使后续workspace缺工具。上述源码风险未运行复现。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在非敏感项目配置独立bank，固定更新策略并确认禁用/清理路径；核对记忆检索和原任务验收，发现串项目、误导决策或成本上升时停止。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持生命周期、去重、bank绑定及工具注册；DSH效果、故障恢复与数据隔离未实测；确认队列为未验证设计假设。

- 已检查：作者 README、包清单、源码路径 hindsight-integrations/coding-agents/README.md、hindsight-integrations/coding-agents/package.json、hindsight-integrations/coding-agents/cordis.patch.yml、hindsight-integrations/coding-agents/src/dsh.ts、hindsight-integrations/coding-agents/src/dsh.test.ts、hindsight-integrations/coding-agents/src/core/runtime.ts、hindsight-integrations/coding-agents/src/core/config.ts、hindsight-integrations/coding-agents/src/core/knowledge-tools.ts、hindsight-integrations/coding-agents/src/core/transcript-dsh.ts 及固定范围 inventory；组件：hindsight-integrations/coding-agents。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：限coding-agents组件，以DSH entry、shared runtime、配置、工具、转录及相关测试源码为核心；不审计整个Hindsight服务或宣称所有其他宿主可用。无安装、测试或宿主执行。
- 下一步：以非敏感固定项目比较无记忆、人工说明和插件，记录合格任务、纠正数、费用及串bank；再做瞬断/重启与fork恢复对照。

**分析版本**

- **仓库**：[vectorize-io/hindsight](https://github.com/vectorize-io/hindsight)
- **版本号**：0.8.2（[固定提交 b4a0da1](https://github.com/vectorize-io/hindsight/tree/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是服务确认后再推进持久游标并显示待确认写回状态；用断网/重启任务检验漏写、重复和敏感落盘代价。[Q04](#research-q04)

以非敏感固定项目比较无记忆、人工说明和插件，记录合格任务、纠正数、费用及串bank；再做瞬断/重启与fork恢复对照。

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

[![Issue 未关闭 122](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=122&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 498](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=498&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+created%3A2026-09-24T10%3A26%3A52.933Z..2026-10-24T10%3A26%3A52.933Z) [![近30天关闭 466](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=466&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-24T10%3A26%3A52.933Z..2026-10-24T10%3A26%3A52.933Z)



统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH记忆生命周期如何隔离项目并保持可观察的读写边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 记忆集成解决哪类编码问题，收益声明能否外推DSH？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适用对象是跨会话反复维护同一项目的开发者，尤其是约束和决策散落在提交与旧对话、当前源码不能完整表达的任务。简单替代是维护项目说明、手工搜索历史并在任务开始粘贴。合格结果应是在正确项目中取到相关既有决策、少作错误假设并完成同样验收任务，不能只以“写入记忆条数”衡量。

本组件的相对贡献是把共享记忆服务接到多个宿主的生命周期，减少人工记忆收集与提示搬运，并将知识页、reflect和文档摄取作为统一工具套件。检索与综合记忆能力依赖Hindsight服务，不能全部归为DSH适配层原创。README给出三种Agent、61任务三次运行的纠正次数和成本表，这是固定版本作者引用的外部实验摘要；表内没有DSH，本轮未回溯原始数据和模型配置，不能将数字写成DSH收益，也不能把成本变化自动归因于记忆本身。

#### 证据与依据

**依据 1 · 作者声明**：[hindsight-integrations/coding-agents/README.md:3-14](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/README.md#L3-L14)

作者说明跨Agent项目记忆与决策场景。

<details>
<summary>查看原文（12行）</summary>

```text
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

**依据 2 · 作者声明**：[hindsight-integrations/coding-agents/README.md:20-40](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/README.md#L20-L40)

作者引用的基准仅列Claude Code、Codex和opencode，没有DSH。

<details>
<summary>查看原文（21行）</summary>

```text

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

Both numbers move together, and that is the mechanism rather than a coincidence. A correction is a
round trip: the agent guesses a project-specific decision wrong, you stop it, you explain, it redoes
```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:10-23](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/src/dsh.ts#L10-L23)

原生事件绑定与工具投影说明集成层职责。

<details>
<summary>查看原文（14行）</summary>

```text
 *   agent/session-start  -> RuntimeCore.seedIfCold      (cold-check + background git/codebase seed)
 *   agent/pre-step       -> RuntimeCore.onPrompt        (recall) + the injection as a sourced message
 *   agent/turn-stopping  -> RuntimeCore.onSessionIdle   (write-back of the completed exchange)
 *   ctx.tools            -> the hindsight_* knowledge suite, registered natively
 *
 * ONE dsh PROCESS SERVES MANY WORKSPACES. Unlike opencode/Kilo/Cline — one process, one project —
 * dsh's Web UI creates sessions in whatever directory the user picks, each with its own
 * `session.header.cwd`. Memory is per-repo, so a RuntimeCore (bank, client, seed) is built PER
 * WORKSPACE ROOT and cached, never once per process.
 *
 * The plugin imports NOTHING from dsh at all: every host shape is structurally typed here, and the
 * tool definitions are built in dsh's own registry shape rather than through its `defineTool`
 * builder (see `toDshParameters`). So there is no dsh package for pnpm to resolve inside a profile,
 * and no version to keep in step — any dsh whose event names still match can load this file.
```

</details>

#### 缺口

- 基准原始任务配置和DSH对照未核查
  **影响**：不能断言DSH成本或纠正次数改善
  **进一步探讨**：同项目同模型同预算执行无记忆/人工说明/插件三臂对照，记录合格率、纠正与费用

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 项目隔离、注入与写回如何闭环，哪些去重措施真实接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DSH entry apply 注册session-start、pre-step、turn-stopping和disposed，并按session.header.cwd创建RuntimeCore缓存，而非只用进程cwd。调用工具时再绑定实际调用Agent的workspace；子Agent直接跳过记忆注入和写回。session-start启动一次冷种子；pre-step先取得宿主decision，只在人类输入存在且未取消时调用onPrompt，再把producer-owned来源的记忆消息追加到输入。

去重使用持久会话历史中的lastInjectedText，而不只依赖内存sessionId，因而可以识别fork继承的相同注入。写回读取snapshotEvents优先、legacy events兜底，按inheritedEventCount切掉fork继承前缀，再规范化对话。normalizer只接纳source.kind=user的人类提示，保留assistant正文和简化tool/call，跳过tool/result；这减少插件自己的注入再进入记忆导致循环放大。

turn-stopping虽await onSessionIdle，但retain内部仍是异步链加入inFlight，所以“已到停止边界”不等于服务已确认写入。当前机制能说明如何抑制重复与串项目，不能直接证明所有宿主事件形状都兼容。dsh.test.ts含fork、subagent和snapshotEvents测试源码，本轮仅阅读，不称通过。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:173-195](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/src/dsh.ts#L173-L195)

按workspace建立core并绑定该会话transcript。

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:286-336](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/src/dsh.ts#L286-L336)

真实生命周期逻辑及注入去重。

<details>
<summary>查看原文（51行）</summary>

```text
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
    },

    disposed({ agent }: { agent: DshAgent }): void {
      liveAgents.delete(agent.session.header.id);
    },
  };
}

```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:141-157](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/src/dsh.ts#L141-L157)

公开snapshot accessor与fork前缀切片。

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

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/core/transcript-dsh.ts:73-98](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/src/core/transcript-dsh.ts#L73-L98)

只保留人类输入和有效回复，排除其他插件上下文。

<details>
<summary>查看原文（26行）</summary>

```text
export function readDshEvents(events: readonly DshSessionEvent[]): TransportTurn[] {
  const turns: TransportTurn[] = [];
  for (const event of events || []) {
    if (!event || typeof event !== "object") continue;
    const stamp = stampOf(event);
    if (event.type === "user/message") {
      const message = event.data as DshMessage | undefined;
      if (!message || message.source?.kind !== "user") continue;
      const text = stripInjectedMemory(textOf(message)).trim();
      if (text) turns.push({ role: "user", content: text, ...stamp });
    } else if (event.type === "assistant/message") {
      const message = (event.data as { message?: DshMessage } | undefined)?.message;
      if (!message) continue;
      const text = stripInjectedMemory(textOf(message)).trim();
      if (text) turns.push({ role: "assistant", content: text, ...stamp });
    } else if (event.type === "tool/call") {
      const call = event.data as { name?: string; arguments?: string } | undefined;
      if (!call?.name) continue;
      turns.push({
        role: "action",
        content: actionLine(call.name, parseArgs(call.arguments)),
        ...stamp,
      });
    }
  }
  return turns;
```

</details>

**依据 5 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:443-455](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/src/dsh.ts#L443-L455)

apply中的实际事件及工具注册。

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

**依据 6 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:347-389](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/src/core/runtime.ts#L347-L389)

retain为异步写回与诊断，不是停止边界内已确认持久化。

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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动采集会把哪些负担转移给用户，何种失败会被掩盖？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

关键质疑是不中断编码的best-effort记忆能否让使用者可靠知道“本次未记住”。retain失败只写诊断，编码仍可继续；这利于可用性，却让完成任务与完成记忆持久化分离。onSessionIdle在发起写回前已更新retainedTurns；失败后若对话未增长，长度检查可能不再发起同一次写回。这是源码路径上的可靠性风险，未进行故障注入，不能声称已复现丢失。

另一个已可定位的设计限制是工具模板从进程启动目录生成；若该目录bank禁用，registerTools直接返回，后续其他启用workspace也不会有工具。按调用者重新绑定bank解决的是调用隔离，不解决启动时工具缺席。此外结构类型避免依赖宿主包并不等于免兼容维护，事件名、payload、schema形状仍须适配。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH agents事件面 | DSH路径必需 | 生命周期、转录与注入 | 无正常记忆闭环 |
| tools registry | 工具操作必需，自动记忆可独立 | 原生知识工具 | 缺少显式查询与写入入口 |
| Hindsight Cloud、自建server或daemon | 记忆必需 | 检索、reflect和持久化 | best-effort降级，不证明记忆完成 |
| ~/.hindsight/coding-agent.json | 按部署模式配置 | 服务、bank、退出和采集策略 | 默认Cloud URL、retainSessions为true |
| 可接受的历史/对话数据边界 | 使用前必需核对 | 自动摄取项目资料 | 不可接受上传时须先禁用或配置隔离 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | server/daemon、模型、初次摄取金额未知 | 选择服务、bank策略和敏感数据范围 | 无本次部署计量 |
| 持续使用 | reflect、摄取、存储和上下文资源未知 | 检查过期决策与记忆准确性 | 自动写回默认开启；自动更新默认开启 |
| 失败恢复 | 重试与服务恢复资源未知 | 读diagnose、核对缺失会话及重复写入 | fail-open不等于无数据缺口 |
| 退出 | 数据保留及服务费用未知 | 禁用插件并处理服务端数据 | 卸载接线不代表删除远端记忆 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自动跨会话上下文 | 源码有事件→检索→注入→异步retain链 | DSH纠正数和单位任务收益 |
| 减少重复记忆 | 历史注入去重及fork切片 | 对所有恢复/分支组合的正确性 |
| 服务失败不中断 | 写回catch诊断 | 静默缺失的频率与恢复代价 |

应先明确采集允许范围和更新策略。自动化将粘贴历史的负担转成记忆服务运维、准确性复核与退出数据治理；这些负担是否值得，不能从README成本表替DSH用户作答。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:277-298](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/src/core/runtime.ts#L277-L298)

写回前更新retainedTurns与按长度跳过。

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

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:347-389](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/src/core/runtime.ts#L347-L389)

写回错误进入diagnostic。

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

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:395-417](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/src/dsh.ts#L395-L417)

启动目录模板禁用导致不注册工具，调用时另绑workspace。

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

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/core/config.ts:600-638](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/src/core/config.ts#L600-L638)

默认服务地址、opt-in、写回与超时配置。

<details>
<summary>查看原文（39行）</summary>

```text
    apiUrl:
      serverMode === "daemon"
        ? `http://127.0.0.1:${apiPort}`
        : (raw.apiUrl ?? "https://api.hindsight.vectorize.io"),
    apiToken: raw.apiToken || undefined,
    apiPort,
    daemonIdleTimeout: raw.daemonIdleTimeout,
    daemonProfile: raw.daemonProfile || DEFAULT_DAEMON_PROFILE,
    embedVersion: raw.embedVersion || undefined,
    embedPackagePath: raw.embedPackagePath || undefined,
    bankId: raw.bankId,
    dynamicBankId: raw.dynamicBankId,
    bankIdTemplate: raw.bankIdTemplate,
    mapPathToBank: raw.mapPathToBank,
    resolveWorktrees: raw.resolveWorktrees,
    optInOnly: raw.optInOnly ?? false,
    // Same shape as retainTags: a config typo must not become a path that silently approves nothing.
    optInPaths: Array.isArray(raw.optInPaths)
      ? raw.optInPaths.filter((p): p is string => typeof p === "string" && p.trim() !== "")
      : [],
    harness: raw.harness ?? "opencode",
    disabled: raw.disabled ?? false,
    retainSessions: raw.retainSessions ?? true, // write sessions back by default, every harness
    manageBankConfig: raw.manageBankConfig ?? true,
    retainExtractionMode: RETAIN_EXTRACTION_MODES.includes(raw.retainExtractionMode!)
      ? raw.retainExtractionMode!
      : DEFAULT_RETAIN_EXTRACTION_MODE,
    defaultBankConfig: resolveDefaultBankConfig(raw.defaultBankConfig),
    maxParallelRetains: raw.maxParallelRetains || 10,
    reflectTimeoutMs: raw.reflectTimeoutMs || DEFAULT_REFLECT_TIMEOUT_MS,
    // Inherit an explicitly-raised reflectTimeoutMs (that is what users reaching for a longer
    // reflect already set), but never let it LOWER the tool below the default — a short window is
    // set to bound the automatic hook, not to cut off a call the agent is waiting on.
    reflectToolTimeoutMs:
      raw.reflectToolTimeoutMs ||
      Math.max(raw.reflectTimeoutMs || 0, DEFAULT_REFLECT_TOOL_TIMEOUT_MS),
    injectTimeoutMs: raw.injectTimeoutMs || DEFAULT_INJECT_TIMEOUT_MS,
    reflectBudget: resolveReflectBudget(raw),
    autoInject: resolveAutoInject(raw),
```

</details>

**依据 5 · 源码核查**：[hindsight-integrations/coding-agents/src/core/config.ts:688-695](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/src/core/config.ts#L688-L695)

autoUpdate默认true。

```text
    banks: raw.banks && typeof raw.banks === "object" ? raw.banks : {},
    paths: raw.paths && typeof raw.paths === "object" ? raw.paths : {},
    logLevel: ["debug", "info", "warn", "error"].includes(raw.logLevel as string)
      ? (raw.logLevel as "debug" | "info" | "warn" | "error")
      : "info",
    autoUpdate: raw.autoUpdate ?? true,
  };
}
```

**依据 6 · 源码核查**：[hindsight-integrations/coding-agents/cordis.patch.yml:1-18](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/cordis.patch.yml#L1-L18)

宿主外配置、禁用方式与挂载。

<details>
<summary>查看原文（18行）</summary>

```text
# DeepSeek Harness profile layer for Hindsight memory.
#
# `dsh plugin --profile <name> add @vectorize-io/hindsight-coding-agents` installs this package into
# the profile and — because package.json declares `dsh.bundle.patch` — appends this file to the
# profile's ordered bundle list. Nothing else needs editing: the row below mounts on the host plane,
# where the pre-step/session-start/turn-stopping events and the layered tools registry all reach
# every session, including the Web surface's per-session agent presets.
#
# Memory itself is configured OUTSIDE dsh, in ~/.hindsight/coding-agent.json (server URL, token,
# bank naming, opt-outs) — the same file every other Hindsight coding-agent harness reads. To turn
# it off for one profile without uninstalling, patch this row in the profile's own
# cordis.patch.yml:
#
#   - id: hindsight
#     disabled: true
- insert:
    - id: hindsight
      name: "@vectorize-io/hindsight-coding-agents/dsh"
```

</details>

#### 缺口

- 瞬时retain失败且会话不增长时能否由其他路径补写
  **影响**：影响记忆完整性和失败恢复成本
  **进一步探讨**：模拟服务失败后恢复，对照服务端文档确认是否重发和补偿，不只检查Agent继续运行
- 未计量摄取/reflect/上下文总成本
  **影响**：无法计算合格任务单位成本
  **进一步探讨**：在相同任务预算下记录全部调用、重试、服务费和人工复核

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 能否把非阻塞写回与可核对记忆完成结合，当前应如何试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可检验假设是增加按会话内容摘要记录的待确认写回队列：只有服务确认后推进持久游标，失败保持可重试状态，UI或diagnose显示“编码已结束、记忆待确认”。从现有inFlight、retain诊断和提前更新长度状态推导，新增的是可观察的持久交付状态，不是更换记忆算法。代价是本地队列权限、幂等键、保留时限和敏感会话落盘；简单替代是人工查看诊断后再次触发摄取。

最小验证在两个bank、fork及服务瞬断任务中比较现有流程、人工补写和持久确认队列，测漏写、重复提取、恢复时间和磁盘残留；不能以写入请求返回代替最终可检索。若新队列引入重复记忆或敏感落盘负担大于补偿收益，则否定方案。

当前推荐在无敏感数据、可单独配置bank和服务的项目试用，并把自动更新固定策略、采集范围、禁用与服务端清理先写清楚。成功要求跨会话取到正确项目决策且任务仍通过原验收，停止条件包括串bank、错误陈旧记忆影响决策，或总费用与纠正次数无改善。没有本次真实宿主证据，不能推荐持续安装。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:277-298](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/src/core/runtime.ts#L277-L298)

游标提前推进是确认队列推导依据。

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

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:347-389](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/src/core/runtime.ts#L347-L389)

现有inFlight与诊断可作为对照，不等于持久队列。

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

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/core/config.ts:610-623](https://github.com/vectorize-io/hindsight/blob/b4a0da1e9fd2dfd052843e4f95fcf368301f6a73/hindsight-integrations/coding-agents/src/core/config.ts#L610-L623)

bank、opt-in与write-back配置形成可控试用条件。

<details>
<summary>查看原文（14行）</summary>

```text
    bankId: raw.bankId,
    dynamicBankId: raw.dynamicBankId,
    bankIdTemplate: raw.bankIdTemplate,
    mapPathToBank: raw.mapPathToBank,
    resolveWorktrees: raw.resolveWorktrees,
    optInOnly: raw.optInOnly ?? false,
    // Same shape as retainTags: a config typo must not become a path that silently approves nothing.
    optInPaths: Array.isArray(raw.optInPaths)
      ? raw.optInPaths.filter((p): p is string => typeof p === "string" && p.trim() !== "")
      : [],
    harness: raw.harness ?? "opencode",
    disabled: raw.disabled ?? false,
    retainSessions: raw.retainSessions ?? true, // write sessions back by default, every harness
    manageBankConfig: raw.manageBankConfig ?? true,
```

</details>

#### 缺口

- 确认队列的隐私与幂等代价未验证
  **影响**：不能将假设作为已有可靠性能力
  **进一步探讨**：先在合成非敏感会话做断网/重启测试，检查最终可检索和本地残留，再评估真实采用

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
