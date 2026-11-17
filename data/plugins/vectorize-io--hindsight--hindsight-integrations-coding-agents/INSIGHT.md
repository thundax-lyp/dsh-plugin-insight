# Hindsight Coding Agents

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b92ceb1](https://github.com/vectorize-io/hindsight/tree/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents)

<!-- BEGIN META -->
[![GitHub ★ 61,271](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=61%2C271&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vectorize-io/hindsight) [![npm 30d 136,152](https://img.shields.io/static/v1?label=npm+30d&message=136%2C152&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents)
<!-- END META -->

> **功能**：在编码 Agent 的新会话中带入项目记忆，并在后台保存会话内容。

> **亮点**：按会话工作区把共享记忆内核接入 DSH 的新用户步和回合停止。保留验证方法及特定注记可让新会话获得更具体的线索，实际保真依赖抽取设置，见 [Q02](#research-q02) 至 [Q04](#research-q04)。

> **主要限制**：自动写回究竟发了什么、写到哪里，又是否已被抽取？调用参数可携带注记正文，既有 bank 可能继续采用旧策略，异步回执还需服务端对账，见 [Q03](#research-q03) 与 [Q04](#research-q04)。

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
  - [Q01 · 哪类交接值得把记忆接进 Agent？](#detail-section-11)
  - [Q02 · 记忆注入和工具能否用到正确 bank？](#detail-section-12)
  - [Q03 · 不启动自动种子时怎样得到抽取策略？](#detail-section-13)
  - [Q04 · 哪些会话内容会写回，怎么知道完成？](#detail-section-14)
  - [Q05 · 什么条件下试用有意义，费用和退出怎样算？](#detail-section-15)
  - [Q06 · 保留验证方法与注记是否改善跨会话复现？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常在同一代码库开新 DSH 会话、需要回查早期决策的开发者，可用脱敏任务核验是否找回旧决定及验证方法，见 [Q01](#research-q01)。

以 Git 历史、人工决策摘要和会话交接为对照。只有少量明确约定时原文足够，分散约定较多时可比较查回资料的时间及准确率，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 记忆注入 | 按会话工作区带入相关记忆 | 依赖可用服务及正确路由 |
| 会话写回 | 保留当前会话新增内容 | 默认开启，后台结果须查实 |
| 宿主工具 | 执行 Hindsight 记忆操作 | 依赖 tools 与启动目录模板 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH agents 服务 | 必需 | 绑定生命周期并定位会话 | 无法完成自动接线 |
| DSH tools 服务 | 手工工具需要 | 把记忆操作暴露给宿主 | 自动注入及写回仍可走 |
| 配置、凭据与可用 Hindsight 服务 | 读写需要 | 绑定 bank 与后端 | 可回落无记忆或产生故障诊断 |
| 管理开关及配置导入权限 | 调整策略需要 | 设置缺失任务和策略 | 已有配置继续生效，需查首回执 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者复制隔离 profile，设独立 bank 与凭据 | 检查根目录及原验收 |
| 挂载 | 加载固定包的 DSH 层，再核对服务权限和配置 | 实际 bank 正确，非预期写入关闭 |
| 对照 | 脱敏回放两会话，确认写回后重新查询 | 原例外被正确复做，服务记录与核对一致 |
| 退出 | 关闭自动读写并停用挂载，核查远端保留 | 恢复人工交接，可按服务权限清理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 服务部署、存储与网络 | 配置 profile、凭据和隔离 | 费用与耗时未量化 |
| 持续 | 抽取、检索和上下文增长 | 等待与核查原决定 | 总费用和延迟未知 |
| 失败 | 重发和数据保留 | 对账错误 bank 或回写 | 需可读服务诊断 |
| 退出 | 保留或删除远端记录 | 恢复人工交接与核查清理 | 权限和成本由部署决定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨轮交接 | 回忆进入带来源的当前任务消息 | 是否复做正确 |
| 准确留存 | 抽取指令和注记输入可携带具体方法 | 源部署是否使用新策略 |
| 失败可见 | 读写错误可在诊断遇到 | 失败恢复、触发覆盖和净成本 |

> **思考**：自动写回究竟发了什么、写到哪里，又是否已被抽取？调用参数可携带注记正文，既有 bank 可能继续采用旧策略，异步回执还需服务端对账，见 [Q03](#research-q03) 与 [Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：按会话工作区把共享记忆内核接入 DSH 的新用户步和回合停止。保留验证方法及特定注记可让新会话获得更具体的线索，实际保真依赖抽取设置，见 [Q02](#research-q02) 至 [Q04](#research-q04)。

动态工作区路由、按实际历史去重与 fork 写回范围分离。共享写回用确定的操作身份保护重发，但策略初始化、送达和内容核查仍分属不同阶段，见 [Q02](#research-q02) 至 [Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

自动写回究竟发了什么、写到哪里，又是否已被抽取？调用参数可携带注记正文，既有 bank 可能继续采用旧策略，异步回执还需服务端对账，见 [Q03](#research-q03) 与 [Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

用可控服务和独立 profile 回放两个脱敏会话，检查 bank、生命周期与后台记录。提前关闭不需要的自动操作。存在错库、过期决定或误写时，停用插件、查对服务端，再回到人工交接，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持宿主生命周期、工作区绑定、回忆和后台写回。实际服务端隔离、新策略生效、费用与复做精度尚待验证。

- 已检查：作者 README、包清单、源码路径 hindsight-integrations/coding-agents/package.json、hindsight-integrations/coding-agents/tsup.config.ts、hindsight-integrations/coding-agents/README.md、hindsight-integrations/coding-agents/src/dsh.ts、hindsight-integrations/coding-agents/src/core/host-client.ts、hindsight-integrations/coding-agents/src/core/hook.ts、hindsight-integrations/coding-agents/src/core/runtime.ts、hindsight-integrations/coding-agents/src/core/session-start.ts、hindsight-integrations/coding-agents/src/core/hindsight.ts、hindsight-integrations/coding-agents/src/core/missions.ts、hindsight-integrations/coding-agents/src/core/transcript-dsh.ts、hindsight-integrations/coding-agents/src/core/transcript-util.ts、hindsight-integrations/coding-agents/src/core/chat.ts、hindsight-integrations/coding-agents/cordis.patch.yml、hindsight-integrations/coding-agents/src/core/config.ts 及固定范围 inventory；组件：hindsight-integrations/coding-agents。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：研究范围为固定 DSH 适配及其共享客户端路径。未逐一核查其他宿主、服务端权限、npm 包字节、实际成本与运行效果。
- 下一步：用双仓库、既有库和新库验证路由、配置与退出，复做原验收并对账异步写回，见 [Q03](#research-q03)、[Q04](#research-q04) 与 [Q06](#research-q06)。

**分析版本**

- **仓库**：[vectorize-io/hindsight](https://github.com/vectorize-io/hindsight)
- **版本号**：0.8.7（[固定提交 b92ceb1](https://github.com/vectorize-io/hindsight/tree/b92ceb180e349a456d2b5454575067b6ff0f6306)）
- **版本日期**：2026-11-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

验证命令和数据例外的显式留存可能提升跨会话复做准确率。以故意失败的文件操作和超长注记为反例，测误引用、额外复核和净人工，见 [Q06](#research-q06)。

用双仓库、既有库和新库验证路由、配置与退出，复做原验收并对账异步写回，见 [Q03](#research-q03)、[Q04](#research-q04) 与 [Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 13 | 1 | 12 | — |
| .md | source | 3 | 2049 | — | — | 20015 |
| .mjs | source | 1 | 112 | 74 | 32 | — |
| .ts | source | 136 | 21889 | 13770 | 7123 | — |
| .ts | test | 85 | 24839 | 20731 | 2211 | — |

</details>

**活跃度**

[![Issue 未关闭 243](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=243&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 428](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=428&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 328](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=328&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在同仓库频繁开新 DSH 会话时，能否把已验证的决定从旧回合带到新任务，并约束自动写回的数据和目标？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类交接值得把记忆接进 Agent？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

同一仓库反复开 DSH 会话的开发者，可用它带回旧的接口决定、验证命令和已知误区。例如项目曾判定某列单位为分，下一次处理报表时，合格结果是能说出单位、复做原验证且不把旧草案当作当前决定。原方案是交接文档、Git 历史及人工检索，对少量清晰约定已经足够，人工维护的来源也更直接。

这项适配的增量是从 DSH 的新用户步和回合结束接到 Hindsight，按会话工作区选择记忆库，并将得到的内容作为带来源的消息送给模型。检索、综合和索引属于共享内核及后端，因此记忆文字可读与原证据正确须分开验收。插件注册、工具发现与资料读写都不等于项目确实需要后台导入。

#### 证据与依据

**依据 1 · 作者声明**：[hindsight-integrations/coding-agents/README.md:355-372](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/README.md#L355-L372)

作者描述宿主挂载、工作区和 fork 边界。

<details>
<summary>查看原文（18行）</summary>

````text
#### <img src="https://hindsight.vectorize.io/img/harness/dsh.svg" alt="" width="20" height="20" /> DeepSeek Harness

```bash
npx @vectorize-io/hindsight-coding-agents install dsh
```

A Cordis plugin row in `$DSH_HOME/cordis.patch.yml` (`~/.dsh` by default), which every dsh profile
composes — native tools, no MCP needed. Two dsh-specific notes: one dsh process serves **several
repositories** (its Web UI opens each session in whatever directory you pick), so the bank is
resolved per session workspace rather than once per process; and dsh has no plugin-facing notice
channel, so the seed line goes to the plugin log rather than the UI. A **forked** session saves only
the turns it adds after the fork — the part it inherited is already in the parent's conversation.
Everything model-facing —
recalled memory, the pages preamble, the `hindsight_*` tools — is unaffected. If you prefer the
published-package route, `dsh plugin --profile web add @vectorize-io/hindsight-coding-agents` works
too: the package ships the profile patch layer, so nothing else needs editing. Either route gets the
companion skill — a plugin wired by the host's own plugin manager installs it itself on the first
session, since that route never runs our installer.
````

</details>

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:283-328](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/dsh.ts#L283-L328)

新用户步回忆和回合停止写回的入口。

<details>
<summary>查看原文（46行）</summary>

```text
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

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:246-252](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/dsh.ts#L246-L252)

回忆消息携带插件来源。

```text
function injectionMessage(text: string): DshUserMessage {
  return {
    id: randomUUID(),
    role: "user",
    content: [{ type: "text", text }],
    source: { kind: `plugin:${HINDSIGHT_PLUGIN}`, form: "recall" },
  };
```

#### 缺口

- 未取得真实开发者的同任务交接对照。
  **影响**：只能界定目标场景，不能量化日常节省。
  **进一步探讨**：比较一次需要旧判断的实质返工和一项已有简明决策记录的任务。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 记忆注入和工具能否用到正确 bank？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

插件依赖 agents。启动和预步以 session.header.cwd 定位，以进程目录作为缺失时的退路，子 Agent 的会话直接跳过。按工作目录缓存 RuntimeCore，配置层归一化出 bank 并应用全局、工作区和单 bank 禁用设置。凭据回读时仅在 URL 不变的情况下使用新 token。明确配置可以使不同仓库落进同一 bank，因此目录路由不是服务端访问控制。

预步等待原决策，只在 enter 且未取消时走后续。仅从 source.kind 为 user 的文本发起检索，没有新用户输入的工具续步会跳过。取到注入内容后，与实际历史中上一条插件记忆比对，一样则不追加，fork 或重启后的已有内容也可参与比较。检索运行在新用户步前，Reflect 有时限，部分错误可回退，因而空记忆既可能是无结果也可能是依赖故障。

可选 tools 依赖在宿主启动时用启动目录生成名称和结构，执行时再按调用 Agent 的工作区绑定。启动目录禁用会让工具没有模板。没有调用 Agent 的执行则使用模板，因此需要用两个仓库加缺失会话信息试验，确认行为符合预期。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:160-196](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/dsh.ts#L160-L196)

目录回退、每工作区对象及 live transcript 接线。

<details>
<summary>查看原文（37行）</summary>

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
  // page tools (and retain stamps) to the workspace it is given, and dsh's process cwd is the
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

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:210-215](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/dsh.ts#L210-L215)

子 Agent 禁用。

```text
function workspaceForAgent(agent: DshAgent): Workspace | undefined {
  // A subagent session is a child of a conversation we already track: injecting into it would pay
  // for a second recall per delegation, and retaining it would file a fragment of a session that
  // the parent already stores in full.
  if (agent.session.header.origin === "subagent") return undefined;
  return workspaceFor(workspaceRoot(agent));
```

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/core/host-client.ts:29-48](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/host-client.ts#L29-L48)

禁用、bank 推导和覆盖规则。

<details>
<summary>查看原文（20行）</summary>

```text
/** Resolve config for one workspace: env + file + `harnesses.<name>`, then the `banks.<id>`
 *  section for the bank that directory maps to, with `optInOnly` enforced. */
export function resolveHostConfig(
  harness: string,
  directory: string
): { cfg: Config; bankId: string; project?: string } {
  const cfg0 = loadConfig({ harness });
  // A globally disabled plugin stops HERE, before bank derivation: `disabled` exists to be a
  // zero-overhead baseline — the same agent with no memory — not merely a silent one. Callers
  // return early on `cfg.disabled`, so the empty bank id never reaches a request.
  if (cfg0.disabled) return { cfg: cfg0, bankId: "" };
  const bankId = deriveBankIdOrSkip(cfg0, directory, harness);
  // An unidentifiable repository takes the same exit: no bank id is safer than a guessed one, and
  // `disabled` is the signal every caller already handles (#3950).
  if (bankId === null) return { cfg: { ...cfg0, disabled: true }, bankId: "" };
  const resolved = applyBankConfig(cfg0, bankId, directory);
  // The repository the bank is ABOUT, for page scoping — the same rule as deepen.ts: only a bank
  // that is this repo's, not one a `banks.<id>.bank` rename points several repos at (#4490).
  const project = resolved.bankId === bankId ? bankProjectName(resolved.cfg, directory) : undefined;
  return { ...resolved, project };
```

</details>

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/core/host-client.ts:59-85](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/host-client.ts#L59-L85)

凭据重读取的同 URL 限制。

<details>
<summary>查看原文（27行）</summary>

```text
export function resolveHostMemory(harness: string, directory: string): HostMemory {
  const { cfg, bankId, project } = resolveHostConfig(harness, directory);
  return {
    cfg,
    bankId,
    client: new HindsightClient({
      apiUrl: cfg.apiUrl,
      apiToken: cfg.apiToken,
      bank: bankId,
      // Names the repo in the initiative pages this host captures, as the seeded pages do.
      project,
      maxParallelRetains: cfg.maxParallelRetains,
      observationScopes: cfg.observationScopes,
      pageSearchLimit: cfg.pageSearchLimit,
      recallOptions: cfg.recallOptions,
      // The credential a host STARTED with is not the one it must keep using: enable auth or
      // rotate the key mid-session and the snapshot 401s every call until restart (#3600). Read
      // through the same pipeline the constructor used, so a per-bank `banks.<id>.apiToken` is
      // honoured on re-resolution exactly as it was on the first one.
      // The URL stays the one this client was built with, so a token re-read after the config
      // moved this directory to ANOTHER server is that server's credential: never send it here.
      tokenProvider: () => {
        const live = resolveHostConfig(harness, directory).cfg;
        return live.apiUrl === cfg.apiUrl ? live.apiToken : cfg.apiToken;
      },
    }),
  };
```

</details>

**依据 5 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:228-252](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/dsh.ts#L228-L252)

人类输入过滤和回忆消息标签。

<details>
<summary>查看原文（25行）</summary>

```text
function promptOf(messages: readonly DshUserMessage[]): string {
  return (messages || [])
    .filter((message) => message?.source?.kind === "user")
    .flatMap((message) => message.content || [])
    .filter((block) => block?.type === "text" && block.text)
    .map((block) => block.text!)
    .join("\n")
    .trim();
}

/**
 * Build the injected memory message.
 *
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
  };
```

</details>

**依据 6 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:264-272](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/dsh.ts#L264-L272)

去重以实际历史为准。

```text
export function lastInjectedText(events: readonly DshSessionEvent[]): string | undefined {
  for (let i = events.length - 1; i >= 0; i--) {
    const event = events[i];
    if (event?.type !== "user/message") continue;
    const message = event.data as Partial<DshUserMessage> | undefined;
    if (message?.source?.kind !== `plugin:${HINDSIGHT_PLUGIN}`) continue;
    return (message.content ?? []).map((block) => block.text ?? "").join("\n");
  }
  return undefined;
```

**依据 7 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:290-318](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/dsh.ts#L290-L318)

只有可继续且有新输入才检索并追加。

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

**依据 8 · 源码核查**：[hindsight-integrations/coding-agents/src/core/hook.ts:301-345](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/hook.ts#L301-L345)

Reflect 超时配置、日志及有条件回退。

<details>
<summary>查看原文（45行）</summary>

```text
    const timeoutMs = cfg.reflectTimeoutMs;
    try {
      reflectAnswer = await client.reflect(buildReflectQuery(prompt), {
        // Automatic reflection runs inside the host's hook window. Hindsight's low budget is the
        // supported default for bounded reflect calls; callers that explicitly invoke the MCP
        // tool still get the deeper high-budget path.
        budget: "low",
        timeoutMs,
      });
      diag(harness, reflectAnswer ? "reflect_ok" : "reflect_empty", {
        ms: Date.now() - t0,
        chars: reflectAnswer.length,
        query: prompt.slice(0, 80),
        // Verbatim injected synthesis — the ONLY durable record of what the agent actually saw
        // (post-mortems otherwise depend on the harness happening to persist hook context).
        answer: reflectAnswer.slice(0, 8000),
      });
    } catch (e) {
      // A failure is RETRYABLE, not an answer — `resolveInjection` leaves it unresolved until the
      // budget is spent. Caching "" here meant one timeout on the session's first prompt disabled
      // synthesis for the ENTIRE session, and against a real server a reflect near the timeout is a
      // coin flip, not an edge case (#4607).
      // ...except a permanent 4xx, which fails identically on every later turn: resolve it now
      // rather than spend the session's second attempt on a call that cannot succeed (#5207).
      reflectAnswer =
        e instanceof ReflectError && e.permanent
          ? ""
          : resolveInjection(undefined, reflectAttempts);
      reflectFailed = true;
      log.warn(harness, "reflect failed — session runs without memory", {
        error: describeError(e),
      });
      diag(harness, "reflect_failed", {
        ms: Date.now() - t0,
        bank: client.bank,
        timeoutMs,
        // Wider than describeError's default: the server's error body is the useful part.
        error: describeError(e, 1500),
        query: prompt.slice(0, 80),
      });
      if (e instanceof ReflectError && e.fallbackEligible) {
        fallback = await reflectFallback(harness, prompt, client, cfg.injectTimeoutMs);
        // The fallback body is cached exactly like a reflect answer: injected once, not retried.
        if (fallback) reflectAnswer = fallback;
      }
```

</details>

**依据 9 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:395-418](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/dsh.ts#L395-L418)

启动目录工具模板与执行时重绑。

<details>
<summary>查看原文（24行）</summary>

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
      },
```

</details>

#### 缺口

- 未验证目标 Web/CLI 透传的会话工作目录字段、部署权限和错误回退频率。
  **影响**：工作区隔离不能当作上线保证。
  **进一步探讨**：脱敏双仓库设置不同 bank，加入相似题目和拒绝访问样例，并查实际请求与存储。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 不启动自动种子时怎样得到抽取策略？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

DSH 在工作区第一次打开或预步时，通过共享 RuntimeCore 异步启动冷检查，共用 buildSessionStartContext。当未启动后台深化时，该函数也会调用 configureBankSettings，按设定导入缺失的任务、抽取配置与实体设置。启动管理和播种页面是分开的操作，关闭自动种子并不意味着没有设置写入。若需要禁止插件调整服务端配置，要同时核对 manageBankConfig。

对话抽取增加对验证方法、确切命令和数据例外的提示。已存在的主题和策略受保护，缺失策略才填模板，已存在策略只在抽取模式需同步时改其模式。因此已有库即使收到新版插件也可能继续执行旧的策略文字。后台配置的异常在这条启动路径被捕获，且 DSH 按工作区缓存启动 Promise。进程内后续会话不能凭注释假定它会重跑。首次写回也可能发生在配置导入结束之前，需要以实际服务设置及回执判断抽取是否应用。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:199-207](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/dsh.ts#L199-L207)

启动冷检查不阻塞且以工作区缓存 Promise。

```text
/**
 * Start this repo's cold-check + background seed once.
 *
 * Fire-and-forget by design: `agent/session-start` is an emit that no extension point awaits, and
 * the Web UI must not wait on a network round-trip to open a session. Nothing the first prompt
 * needs comes from here — it builds its own pages preamble from that session's page list.
 */
function ensureSeeded(workspace: Workspace): void {
  workspace.seeded ??= workspace.core.seedIfCold(workspace.root);
```

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:119-148](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/runtime.ts#L119-L148)

共享冷检查入口和初始化的后台副作用。

<details>
<summary>查看原文（30行）</summary>

```text
  async seedIfCold(repoPath: string | undefined): Promise<void> {
    // Anti-recursion: a headless survey session runs the agent (which loads this plugin) with
    // HINDSIGHT_DISABLE_HOOKS=1 — the tools stay registered (toolSpecs, so the survey can ingest),
    // but seeding/recall/write-back must no-op or the survey would re-seed itself (see core/survey.ts).
    if (process.env.HINDSIGHT_DISABLE_HOOKS) return;
    // Companion skill, the same housekeeping `runSessionStartHook` does for hook harnesses — but
    // with `install`, because a persistent-plugin host can be wired by its OWN plugin manager
    // (`dsh plugin add …`, `cline plugin install`), a route our installer never sees, leaving the
    // plugin loaded with its tools registered and no skill on disk at all (#4406). No-op for a host
    // with no skills directory (opencode; opencode2 registers it in memory instead).
    syncCompanionSkill(this.harness, { install: true });
    // Daemon mode: this is the SessionStart of a persistent-plugin host, so it owns the same
    // warm-up the hook harnesses do in `runSessionStartHook` — start it before the user has typed
    // anything, wait only briefly, and let a cold one keep coming up in the background. Without it
    // these hosts never started a daemon at all and every request failed with ECONNREFUSED (#3524);
    // `runSessionStartHook` is a hook-only wrapper, so calling `buildSessionStartContext` directly
    // (as every plugin harness does) skipped the ensure entirely.
    await ensureDaemon(this.cfg, this.harness, { waitMs: DAEMON_WAIT_SESSION_START_MS });
    // Same session-start housekeeping the hook harnesses do in `runSessionStartHook`: a persistent
    // plugin host is a session start too, and leaving it out would mean opencode/Kilo/Cline users
    // never got an update — the parity gap `ensureDaemon` above already had to be fixed for.
    void maybeAutoUpdate(this.cfg);
    try {
      const out = await buildSessionStartContext({
        cwd: repoPath || process.cwd(),
        bankId: this.bankId,
        cfg: this.cfg,
        client: this.client,
        harness: this.harness,
      });
```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/core/session-start.ts:355-365](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/session-start.ts#L355-L365)

不深化时也尽力配置 bank，留存管理开关。

<details>
<summary>查看原文（11行）</summary>

```text
  if (!deepening) {
    // The deepen engine is what configures the bank; without it a session write-back would name a
    // `conversation` strategy the bank does not have, and the server would extract it with its
    // generic rules (CL-Bench: "The user is working on Question 11", "The agent ran a query").
    await client
      .configureBankSettings?.({
        manage: cfg.manageBankConfig,
        extractionMode: cfg.retainExtractionMode,
        defaults: cfg.defaultBankConfig,
      })
      .catch(() => {}); // best-effort: an unreachable server is retried next session
```

</details>

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/core/hindsight.ts:688-723](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/hindsight.ts#L688-L723)

设置导入和页面种子分立，管理关闭时跳过。

<details>
<summary>查看原文（36行）</summary>

```text
    await this.configureBankSettings(opts);
    await this.seedPages(opts.pageTrigger, opts.pages, opts.customPages);
  }

  /** The config half of `configureBank` (missions, retain strategies, entity labels), without
   *  seeding pages. Session start calls it directly when the deepen engine — the usual caller of
   *  `configureBank` — will not run (`autoSeed: false`, or a directory with no git history):
   *  without it such a bank never got the `conversation` strategy, and every session write-back
   *  was extracted with the server's generic rules instead of the plugin's mission. */
  async configureBankSettings(
    opts: {
      reset?: boolean;
      manage?: boolean;
      extractionMode?: RetainExtractionMode;
      defaults?: Record<string, unknown>;
    } = {}
  ): Promise<void> {
    if (opts.manage === false) {
      this.log(`[bank] manageBankConfig: false — leaving ${this.bank}'s configuration alone`);
    } else {
      // What the bank ALREADY overrides decides what is left to write: the missions are seeded once
      // and then belong to whoever set them (#2492), and every other field is added only where the
      // bank is silent (#3927) — bar the extraction mode of the plugin's own strategies, which is
      // re-synced to `extractionMode` (#4560). A reset just deleted the bank, so there is nothing to read.
      const manifest = codingBankManifest(
        opts.reset ? undefined : await this.readBankOverrides(),
        opts.extractionMode,
        opts.defaults
      );
      if (!manifest) {
        this.log(`[bank] ${this.bank} already carries the coding structure — nothing to apply`);
      } else {
        await this.req("POST", this.bankUrl("/import"), manifest);
        this.log(`[bank] applied to ${this.bank}: ${Object.keys(manifest.bank).sort().join(", ")}`);
      }
    }
```

</details>

**依据 5 · 源码核查**：[hindsight-integrations/coding-agents/src/core/missions.ts:35-50](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/missions.ts#L35-L50)

对话任务要求明确记住验证方法和数据例外。

<details>
<summary>查看原文（16行）</summary>

```text
  "decision chat or a LONG working session — scale the facts to the substance, never to the message " +
  "count. Extract the FEWEST facts that capture the OUTCOME: the settled DECISIONS and their exact " +
  "rules/values (quote literals VERBATIM); concrete CHANGES to specific code entities; problems and " +
  "how they were resolved; conventions or invariants established; at most one fact for a notable " +
  "REJECTED alternative ('initially proposed X, changed to Y because Z'). A short decision chat " +
  "usually yields 1-2 facts; a substantial working session several. CRITICAL: a conversation REVISES " +
  "itself — record ONLY the FINAL state as what is in effect; a superseded proposal appears ONLY " +
  "inside the rejected fact, NEVER as its own 'decided' fact; if the same setting changes several " +
  "times keep only the LAST, and make unmistakably clear which choice WON. Do NOT emit one fact per " +
  "message, per intermediate proposal, or per action turn. Keep issue/PR references (#123, GH-123) " +
  "VERBATIM and emit each as an ENTITY. Preserve the 'REF-ID: <token>' marker " +
  "verbatim in every fact. When the session checked its work (a test passed or failed, a result was " +
  "judged right or wrong), record the exact METHOD behind that outcome — which file, table, column, " +
  "command or formula — and any caveat the session found in the data or code (a column mostly empty, a " +
  "value in other units), so the same work repeats what worked and avoids what failed. Do not invent; " +
  "capture only what was actually settled.";
```

</details>

**依据 6 · 源码核查**：[hindsight-integrations/coding-agents/src/core/missions.ts:728-754](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/missions.ts#L728-L754)

既有配置和策略模板的覆盖边界。

<details>
<summary>查看原文（27行）</summary>

```text
  // The missions are seeded as a GROUP: the plugin writes all three together, so any one of them
  // being present means this bank has been seeded already, or its owner wrote their own (#2492).
  if (!MISSION_FIELDS.some((f) => isSet(current[f]))) {
    bank.reflect_mission = template.reflect_mission;
    bank.enable_observations = template.enable_observations;
    bank.observations_mission = template.observations_mission;
    bank.retain_mission = template.retain_mission;
    bank.retain_extraction_mode = mode;
  }

  if (!isSet(current.retain_default_strategy))
    bank.retain_default_strategy = template.retain_default_strategy;
  if (!isSet(current.entities_allow_free_form))
    bank.entities_allow_free_form = template.entities_allow_free_form;

  const strategies =
    current.retain_strategies && typeof current.retain_strategies === "object"
      ? (current.retain_strategies as Record<string, unknown>)
      : {};
  const updates: Record<string, unknown> = {};
  for (const [name, def] of Object.entries(template.retain_strategies)) {
    // `custom` (the survey) carries its own instructions and is not the configured mode's to change.
    const synced = def.retain_extraction_mode === "custom" ? {} : { retain_extraction_mode: mode };
    const have = strategies[name] as Record<string, unknown> | null | undefined;
    if (!have || typeof have !== "object") updates[name] = { ...def, ...synced };
    else if ("retain_extraction_mode" in synced && have.retain_extraction_mode !== mode)
      updates[name] = { ...have, ...synced };
```

</details>

#### 缺口

- 实际服务端权限、空库与旧库生效时序未执行验证。
  **影响**：不能从插件版本断言新抽取策略可用。
  **进一步探讨**：用空库、已有策略库和拒绝导入权限的库逐一读取实际配置及首条写回。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些会话内容会写回，怎么知道完成？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

回合停止时重新读取完整回复，fork 通过 inheritedEventCount 跳过继承事件。用户与助手正文会被正规化，先前的插件记忆被过滤，工具事件则从呼叫参数形成 action 行。普通动作通常只保留名称及目标，但符合路径判断的 memory 或 memories 文件、MEMORY.md 以及命中启发式的 shell 写命令，可保留正文或命令至 8000 字符。它从工具调用而非工具成功事件提取，可能将失败尝试的文字也纳入待抽取材料。路径匹配和长度上限都不构成数据脱敏。

RuntimeCore 先记录本地用量。配置允许写回且转录增加时，它先推进进程内 retainedTurns，再安排异步任务。共享层按能力选择 append 或 replace，并以 bank、会话引用、操作类型和内容产生操作 ID。不同 bank 的待发追加不相互重放。请求成功日志可提示代理接受，不能替代对服务端异步完成及已存内容的核验。失败会记录 retain_failed；当前回合不会因报错同步回滚 retainedTurns，原地重复停止事件不自动发同样回合。不能把这条快路径当成严格投递保证。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:141-158](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/dsh.ts#L141-L158)

fork 只保存本会话自己新增的事件。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:321-332](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/dsh.ts#L321-L332)

回合停止安排写回，销毁移除 live Agent。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/core/transcript-dsh.ts:73-107](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/transcript-dsh.ts#L73-L107)

过滤回忆，工具输入被解析但不取结果来证明成功。

<details>
<summary>查看原文（35行）</summary>

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
}

/** `tool/call.arguments` is the model's RAW JSON string, unparsed by design. */
function parseArgs(raw: string | undefined): unknown {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return raw; // a malformed argument string still names what the model was reaching for
```

</details>

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/core/transcript-util.ts:54-106](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/transcript-util.ts#L54-L106)

memory note 内容及 shell 命令有条件进入动作，截断规则。

<details>
<summary>查看原文（53行）</summary>

```text
export function actionLine(tool: string, input: unknown): string {
  let target = "";
  if (input && typeof input === "object") {
    const rec = input as Record<string, unknown>;
    for (const k of TARGET_KEYS) {
      const v = rec[k];
      if (typeof v === "string" && v.trim()) {
        target = v.trim().split("\n")[0];
        break;
      }
    }
  } else if (typeof input === "string") {
    target = input.trim().split("\n")[0];
  }
  if (target.length > ACTION_TARGET_CAP) target = `${target.slice(0, ACTION_TARGET_CAP)}…`;
  const line = target ? `${tool} ${target}` : tool;
  const note = memoryNoteText(input);
  return note ? `${line}\n${truncate(note, MEMORY_NOTE_CAP)}` : line;
}

/** Larger than TOOL_TEXT_CAP: an agent's progress note grows to ~5KB over a run (CL-Bench, 15
 *  questions), and cutting it at 2KB drops the newest lessons, which it appends at the end. */
const MEMORY_NOTE_CAP = 8000;

/** A file under a `memory/` or `memories/` folder, or a `MEMORY.md`: where an agent keeps the
 *  notes it writes for its future self (Claude Code's auto memory, Anthropic's memory protocol). */
const MEMORY_NOTE_PATH_RE = /(^|[\\/])(memory|memories)[\\/]|(^|[\\/])MEMORY\.md$/i;
/** The notes folder named anywhere in a shell command, as a path segment or a `cd` target. */
const MEMORY_SHELL_WRITE_RE = /[\\/](memory|memories)([\\/\s"']|$)|MEMORY\.md/i;
/** Output redirected to a file (`>`, `>>`, not `2>` or `&>`) or `tee`: the command writes. */
const SHELL_WRITE_RE = /(^|[^0-9&>])>>?(?!&)|\btee\b/;

/**
 * The text an agent wrote into one of its memory notes, so the write-back keeps the lesson in the
 * agent's own words. Every other file write stays a bare action line, but a note IS the decision:
 * reduced to `Write memories/prices.md`, extraction had to rebuild "prc is cents, prc_usd is NULL
 * for most rows" from the session's queries, and on CL-Bench it kept the unit and dropped the
 * caveat that the agent itself had written down. `content` is a Write, `new_string` an Edit.
 */
function memoryNoteText(input: unknown): string {
  if (!input || typeof input !== "object") return "";
  const rec = input as Record<string, unknown>;
  // A shell write into the notes folder (`echo "lesson" >> memory/notes.md`, a heredoc after
  // `cd memory`) IS a note too: on CL-Bench 8 of the agent's 30 note writes went through Bash,
  // and the 100-char action cap cut the Q5 lesson off before its point.
  const cmd = rec.command;
  if (typeof cmd === "string")
    return MEMORY_SHELL_WRITE_RE.test(cmd) && SHELL_WRITE_RE.test(cmd) ? cmd.trim() : "";
  const path = rec.file_path ?? rec.path;
  if (typeof path !== "string" || !MEMORY_NOTE_PATH_RE.test(path)) return "";
  const text = rec.content ?? rec.new_string;
  return typeof text === "string" ? text.trim() : "";
}
```

</details>

**依据 5 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:286-307](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/runtime.ts#L286-L307)

只有开启且条数增长才入后台路径。

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

**依据 6 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:355-398](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/runtime.ts#L355-L398)

写回不阻塞宿主、失败转诊断。

<details>
<summary>查看原文（44行）</summary>

```text
  /** Fire-and-forget upsert of the session transcript; never throws into the host. */
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

**依据 7 · 源码核查**：[hindsight-integrations/coding-agents/src/core/chat.ts:370-405](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/chat.ts#L370-L405)

写回按 bank 组织并使用内容身份，提交 conversation 策略。

<details>
<summary>查看原文（36行）</summary>

```text
  // Appends built but never confirmed. A replace rewrites the whole document from the same
  // transcript, so it SUBSUMES them; on every other path they go out first, oldest first, before
  // anything new — the document only ever grows in transcript order. Buffered appends of the bank
  // the session just left belong to THAT document, so they are never replayed into this one.
  const outbox = plan.mode === "replace" || moved ? [] : (cursor?.pending ?? []);
  if (plan.mode === "skip" && !outbox.length) return;

  /** Identity of ONE payload: a resubmission of the same bytes is collapsed server-side into the
   *  original operation instead of extracting (or appending) twice. */
  const opId = (mode: string, content: string) =>
    uuidV5(`${client.bank}\n${refId}\n${mode}\n${content}`);
  const submit = (content: string, operationId: string, append: boolean) =>
    client.retain(
      content,
      // Configured context wins. Extraction reads this to decide whose claim a sentence is, so the
      // default names both speakers: the previous "coding agent session" said nothing about
      // authorship and let an assistant's proposal be recorded as the user's decision.
      stamp?.context ?? DEFAULT_RETAIN_CONTEXT,
      refId,
      // Configured tags first, built-ins last and deduped: `source:chat` and `harness:<id>` are what
      // the documents list filters and draws its agent logo from, so a template cannot displace them.
      [
        ...new Set([
          ...(stamp?.tags ?? []),
          "source:chat",
          ...(harness ? [`harness:${harness}`] : []),
        ]),
      ],
      "conversation",
      {
        timestamp: startTs,
        updateMode: append ? "append" : undefined,
        operationId,
        metadata: {
          ...stamp?.metadata, // configured first: the built-ins below win on any key collision
          source: "chat",
```

</details>

#### 缺口

- 未测试服务端能力、退出时序和失败重发。
  **影响**：回合已结束不表示服务端已保存。
  **进一步探讨**：断网后重连、立即终止宿主及 fork 三种样例逐一对账，检查是否重采和有无工具参数残留。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件下试用有意义，费用和退出怎样算？

**研究主题**：效果与总成本、采用判断

#### 完整回答

试用限于可控制服务和隔离 profile，先确认目标 bank 与凭据。retainSessions 和 autoSeed 在原始配置默认启用。先关闭不需要的写回、种子及管理动作，再逐一开启所需能力，首个样本完整脱敏。Web/Cordis 加载、tools 是否可见、后台导入与停止后已有数据应分别核对。共享内核有后台 daemon、辅助 skill 及可选的自动更新入口，实际更新和部署权限需按本地配置检查。新版服务端存在后置校验扩展接口，当前固定 DSH 挂载从客户端配置发请求，接口存在无法证明当前部署配置了租户隔离或计量。

成本包含选服务和管理凭据的接入时间、模型新步回忆等待、记忆服务的抽取与存储、错误回忆的人工纠正及退出后服务端清理。没有同任务试验，不能推定自动写回降低总成本。若新会话读到错库数据、未提交的决定、或者写回敏感内容，先停用插件及自动回写，核查远端内容，然后恢复人工交接。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/cordis.patch.yml:3-18](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/cordis.patch.yml#L3-L18)

宿主挂载范围及单 profile 停用说明。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/core/config.ts:617-626](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/config.ts#L617-L626)

会话保留的默认。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/core/config.ts:658-663](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/config.ts#L658-L663)

种子默认及周边配置。

```text
    pageTriggerCron: pageTrigger.cron,
    pages: resolvePages(raw.pages),
    customPages: resolveCustomPages(raw.customPages),
    autoSeed: raw.autoSeed ?? true,
    seedLimit: raw.seedLimit || DEFAULT_SEED_LIMIT,
    codebaseSurvey: raw.codebaseSurvey ?? true,
```

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:119-148](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/runtime.ts#L119-L148)

共享启动的 daemon、skill 和更新接线。

<details>
<summary>查看原文（30行）</summary>

```text
  async seedIfCold(repoPath: string | undefined): Promise<void> {
    // Anti-recursion: a headless survey session runs the agent (which loads this plugin) with
    // HINDSIGHT_DISABLE_HOOKS=1 — the tools stay registered (toolSpecs, so the survey can ingest),
    // but seeding/recall/write-back must no-op or the survey would re-seed itself (see core/survey.ts).
    if (process.env.HINDSIGHT_DISABLE_HOOKS) return;
    // Companion skill, the same housekeeping `runSessionStartHook` does for hook harnesses — but
    // with `install`, because a persistent-plugin host can be wired by its OWN plugin manager
    // (`dsh plugin add …`, `cline plugin install`), a route our installer never sees, leaving the
    // plugin loaded with its tools registered and no skill on disk at all (#4406). No-op for a host
    // with no skills directory (opencode; opencode2 registers it in memory instead).
    syncCompanionSkill(this.harness, { install: true });
    // Daemon mode: this is the SessionStart of a persistent-plugin host, so it owns the same
    // warm-up the hook harnesses do in `runSessionStartHook` — start it before the user has typed
    // anything, wait only briefly, and let a cold one keep coming up in the background. Without it
    // these hosts never started a daemon at all and every request failed with ECONNREFUSED (#3524);
    // `runSessionStartHook` is a hook-only wrapper, so calling `buildSessionStartContext` directly
    // (as every plugin harness does) skipped the ensure entirely.
    await ensureDaemon(this.cfg, this.harness, { waitMs: DAEMON_WAIT_SESSION_START_MS });
    // Same session-start housekeeping the hook harnesses do in `runSessionStartHook`: a persistent
    // plugin host is a session start too, and leaving it out would mean opencode/Kilo/Cline users
    // never got an update — the parity gap `ensureDaemon` above already had to be fixed for.
    void maybeAutoUpdate(this.cfg);
    try {
      const out = await buildSessionStartContext({
        cwd: repoPath || process.cwd(),
        bankId: this.bankId,
        cfg: this.cfg,
        client: this.client,
        harness: this.harness,
      });
```

</details>

**依据 5 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:443-455](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/dsh.ts#L443-L455)

agents 生命周期与可选 tools 各自接线。

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

**依据 6 · 源码核查**：[hindsight-integrations/coding-agents/src/core/host-client.ts:59-84](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/host-client.ts#L59-L84)

URL、凭据与 bank 由客户端绑定。

<details>
<summary>查看原文（26行）</summary>

```text
export function resolveHostMemory(harness: string, directory: string): HostMemory {
  const { cfg, bankId, project } = resolveHostConfig(harness, directory);
  return {
    cfg,
    bankId,
    client: new HindsightClient({
      apiUrl: cfg.apiUrl,
      apiToken: cfg.apiToken,
      bank: bankId,
      // Names the repo in the initiative pages this host captures, as the seeded pages do.
      project,
      maxParallelRetains: cfg.maxParallelRetains,
      observationScopes: cfg.observationScopes,
      pageSearchLimit: cfg.pageSearchLimit,
      recallOptions: cfg.recallOptions,
      // The credential a host STARTED with is not the one it must keep using: enable auth or
      // rotate the key mid-session and the snapshot 401s every call until restart (#3600). Read
      // through the same pipeline the constructor used, so a per-bank `banks.<id>.apiToken` is
      // honoured on re-resolution exactly as it was on the first one.
      // The URL stays the one this client was built with, so a token re-read after the config
      // moved this directory to ANOTHER server is that server's credential: never send it here.
      tokenProvider: () => {
        const live = resolveHostConfig(harness, directory).cfg;
        return live.apiUrl === cfg.apiUrl ? live.apiToken : cfg.apiToken;
      },
    }),
```

</details>

#### 缺口

- 没有部署实测、服务访问控制验收及计费对照。
  **影响**：不能据源码建议生产采用或给出价格。
  **进一步探讨**：独立账户双库回放，记录模型等待、服务账单与处置日志，停用后核对远端状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 保留验证方法与注记是否改善跨会话复现？

**研究主题**：新假设与验证

#### 完整回答

以单位、命令及空值例外作为真值，可以检验新的抽取指令和记忆注记保存是否让下一会话更准确重做旧验证。对照组给同模型和任务手工决策摘要，实验组分别用只保留动作名和保留注记的转录。记录是否能引用有效命令、复做验证、指出例外，并量化查找等待、额外纠错以及错误记忆被采信的次数。把进程启动配置抢跑与实际策略版本也记录下来。

加入一次失败的 memory 文件写入以及超过长度上限的注记，测转录是否可能把没落盘的内容变成已验证结论。若准确复做率不升、失败记录误引增多或清理成本抵消节省，收窄注记保留规则或回到人工交接。这个假设来自源码表示变化，效果尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/core/missions.ts:43-50](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/missions.ts#L43-L50)

抽取规则明确要求保存验证方法与例外。

```text
  "times keep only the LAST, and make unmistakably clear which choice WON. Do NOT emit one fact per " +
  "message, per intermediate proposal, or per action turn. Keep issue/PR references (#123, GH-123) " +
  "VERBATIM and emit each as an ENTITY. Preserve the 'REF-ID: <token>' marker " +
  "verbatim in every fact. When the session checked its work (a test passed or failed, a result was " +
  "judged right or wrong), record the exact METHOD behind that outcome — which file, table, column, " +
  "command or formula — and any caveat the session found in the data or code (a column mostly empty, a " +
  "value in other units), so the same work repeats what worked and avoids what failed. Do not invent; " +
  "capture only what was actually settled.";
```

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/core/transcript-util.ts:68-106](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/transcript-util.ts#L68-L106)

注记有更多留存空间，但判据依赖输入路径及命令。

<details>
<summary>查看原文（39行）</summary>

```text
  if (target.length > ACTION_TARGET_CAP) target = `${target.slice(0, ACTION_TARGET_CAP)}…`;
  const line = target ? `${tool} ${target}` : tool;
  const note = memoryNoteText(input);
  return note ? `${line}\n${truncate(note, MEMORY_NOTE_CAP)}` : line;
}

/** Larger than TOOL_TEXT_CAP: an agent's progress note grows to ~5KB over a run (CL-Bench, 15
 *  questions), and cutting it at 2KB drops the newest lessons, which it appends at the end. */
const MEMORY_NOTE_CAP = 8000;

/** A file under a `memory/` or `memories/` folder, or a `MEMORY.md`: where an agent keeps the
 *  notes it writes for its future self (Claude Code's auto memory, Anthropic's memory protocol). */
const MEMORY_NOTE_PATH_RE = /(^|[\\/])(memory|memories)[\\/]|(^|[\\/])MEMORY\.md$/i;
/** The notes folder named anywhere in a shell command, as a path segment or a `cd` target. */
const MEMORY_SHELL_WRITE_RE = /[\\/](memory|memories)([\\/\s"']|$)|MEMORY\.md/i;
/** Output redirected to a file (`>`, `>>`, not `2>` or `&>`) or `tee`: the command writes. */
const SHELL_WRITE_RE = /(^|[^0-9&>])>>?(?!&)|\btee\b/;

/**
 * The text an agent wrote into one of its memory notes, so the write-back keeps the lesson in the
 * agent's own words. Every other file write stays a bare action line, but a note IS the decision:
 * reduced to `Write memories/prices.md`, extraction had to rebuild "prc is cents, prc_usd is NULL
 * for most rows" from the session's queries, and on CL-Bench it kept the unit and dropped the
 * caveat that the agent itself had written down. `content` is a Write, `new_string` an Edit.
 */
function memoryNoteText(input: unknown): string {
  if (!input || typeof input !== "object") return "";
  const rec = input as Record<string, unknown>;
  // A shell write into the notes folder (`echo "lesson" >> memory/notes.md`, a heredoc after
  // `cd memory`) IS a note too: on CL-Bench 8 of the agent's 30 note writes went through Bash,
  // and the 100-char action cap cut the Q5 lesson off before its point.
  const cmd = rec.command;
  if (typeof cmd === "string")
    return MEMORY_SHELL_WRITE_RE.test(cmd) && SHELL_WRITE_RE.test(cmd) ? cmd.trim() : "";
  const path = rec.file_path ?? rec.path;
  if (typeof path !== "string" || !MEMORY_NOTE_PATH_RE.test(path)) return "";
  const text = rec.content ?? rec.new_string;
  return typeof text === "string" ? text.trim() : "";
}
```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/core/transcript-dsh.ts:88-95](https://github.com/vectorize-io/hindsight/blob/b92ceb180e349a456d2b5454575067b6ff0f6306/hindsight-integrations/coding-agents/src/core/transcript-dsh.ts#L88-L95)

从调用构建 action，未把执行结果做成前置条件。

```text
    } else if (event.type === "tool/call") {
      const call = event.data as { name?: string; arguments?: string } | undefined;
      if (!call?.name) continue;
      turns.push({
        role: "action",
        content: actionLine(call.name, parseArgs(call.arguments)),
        ...stamp,
      });
```

#### 缺口

- 未获得同版本策略端到端研究数据。
  **影响**：暂时无法判定新表示是否降低错误引用。
  **进一步探讨**：固定策略和样例，核实真实持久化后在新会话盲评准确率及风险。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
