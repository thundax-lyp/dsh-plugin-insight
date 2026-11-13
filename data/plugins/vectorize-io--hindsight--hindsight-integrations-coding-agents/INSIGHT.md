# Hindsight for Coding Agents

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[7cec128](https://github.com/vectorize-io/hindsight/tree/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents)

<!-- BEGIN META -->
[![GitHub ★ 60,482](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=60%2C482&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vectorize-io/hindsight) [![npm 30d 126,990](https://img.shields.io/static/v1?label=npm+30d&message=126%2C990&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents)
<!-- END META -->

> **功能**：为编码 Agent 保存会话记忆，并在后续任务中检索相关上下文。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 的增量是将共享记忆内核接到 DSH 的新输入及回合结束，并按会话目录路由读取、工具和写回。共享检索和存储来自 Hindsight 内核，DSH 接入提供生命周期和工作区绑定。

> **主要限制**：[Q02](#research-q02) 与 [Q03](#research-q03) 显示，bank 路由受目录与配置影响，后台写回也可能失败。依赖团队隔离或处理敏感内容时，需先核实凭据和部署权限以及服务端记录，不能仅凭会话继续来判断已成功或已隔离。

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
  - [Q01 · 自动记忆比手工项目摘要增加什么？](#detail-section-11)
  - [Q02 · 读取、写回和工具如何选择 bank？](#detail-section-12)
  - [Q03 · 需要哪些宿主服务和网络条件，故障如何表现？](#detail-section-13)
  - [Q04 · 用一个可逆任务怎样评估采用成本和收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常在同一代码库开新会话的开发者，可以用 Hindsight 在新任务中带入过去决定，并选择保留新增会话内容。

人工项目说明和手工传入摘要可提供明确来源，原生会话继续也适合沿用同一线程。跨会话检索更适合历史分散、愿意复核召回结果的工作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 记忆注入 | 将相关历史加入 DSH 新输入 | 需要可用 bank，重复块会跳过 |
| 会话写回 | 在回合完成后保存新增会话内容 | 由配置控制，后台结果需核对 |
| 原生工具 | 从宿主调用 Hindsight 操作 | tools 可选且依赖启动目录模板 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH agents 生命周期 | 核心必需 | 接收新输入及回合事件 | 不会完成事件接线 |
| DSH tools 服务 | 手工工具必需 | 注册 Hindsight 工具 | 自动路径仍可运行 |
| 选定的 Hindsight 服务与凭据 | 实际检索或写回所需 | 存取指定 bank | 可能缺少记忆或出现等待 |
| 明确的工作区和 bank 配置 | 控制读写范围所需 | 限制试用对象 | 路由可能停用或与预期不同 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者为隔离 profile 配置独立服务地址和 bank | 无敏感资料，配置只允许目标仓库 |
| 加载 | 通过 profile 装载固定插件，检查事件及工具 | 观察所需服务及配置已生效 |
| 交接 | 在一个会话写入测试约定，新会话读取 | 服务端核实写回并能回查原文 |
| 退出 | 禁用挂载，处理测试记录 | 检查新会话不再使用插件，服务端清理单独确认 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 服务、网络和存储成本未知 | 选择部署、凭据和隔离 profile | 耗时未知 |
| 持续使用 | 每轮网络、上下文和综合资源未知 | 核对回忆及项目约定 | 延迟和错误纠正次数待测 |
| 失败恢复 | 重试和排查资源未知 | 对账写回、排查错 bank | 需要服务访问权限 |
| 退出 | 记录保存与清理成本未知 | 禁用并查服务保留状态 | 删除条件由服务决定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 交接 | 带来源的新输入注入 | 决定能否正确召回 |
| 复用 | 会话工作区路由并写回新增内容 | 实际重复工作降低多少 |
| 故障可见性 | 写回失败有诊断记录 | 进程退出后的实际损失 |

> **思考**：[Q02](#research-q02) 与 [Q03](#research-q03) 显示，bank 路由受目录与配置影响，后台写回也可能失败。依赖团队隔离或处理敏感内容时，需先核实凭据和部署权限以及服务端记录，不能仅凭会话继续来判断已成功或已隔离。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 的增量是将共享记忆内核接到 DSH 的新输入及回合结束，并按会话目录路由读取、工具和写回。共享检索和存储来自 Hindsight 内核，DSH 接入提供生命周期和工作区绑定。

按目录缓存客户端与运行时，工具从注册模板按调用者重绑。会话写回串行规划并区分 append 和 replace，提交身份结合 bank、会话和内容；这可减少重复提交，服务端实际语义仍需验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 与 [Q03](#research-q03) 显示，bank 路由受目录与配置影响，后台写回也可能失败。依赖团队隔离或处理敏感内容时，需先核实凭据和部署权限以及服务端记录，不能仅凭会话继续来判断已成功或已隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 只建议在隔离 profile 和可控服务上试无敏感的样本。明确关闭与任务无关的自动动作，查对目标 bank 和服务记录。若偏离约定或进入意外范围，停止试用并回到人工摘要。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 DSH 挂载、工作区记忆路由和后台写回。服务可用性、权限、效果和成本待实测，收益假设尚未验证。

- 已检查：作者 README、包清单、源码路径 hindsight-integrations/coding-agents/src/dsh.ts、hindsight-integrations/coding-agents/package.json、hindsight-integrations/coding-agents/cordis.patch.yml、hindsight-integrations/coding-agents/tsup.config.ts、hindsight-integrations/coding-agents/src/core/host-client.ts、hindsight-integrations/coding-agents/src/core/bank.ts、hindsight-integrations/coding-agents/src/core/runtime.ts、hindsight-integrations/coding-agents/src/core/chat.ts、hindsight-integrations/coding-agents/src/core/config.ts、hindsight-integrations/coding-agents/src/core/hook.ts 及固定范围 inventory；组件：hindsight-integrations/coding-agents。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 DSH 适配子目录，核查入口、工作区、自动注入、写回与服务边界。其余编码 Agent、服务端权限、发布包字节和效果均未验证。
- 下一步：同一隔离 profile 对照人工摘要与自动记忆，记录原文一致性、总耗时和错误 bank。在可控环境单独演练服务不可用与退出后的记录核查。

**分析版本**

- **仓库**：[vectorize-io/hindsight](https://github.com/vectorize-io/hindsight)
- **版本号**：0.8.7（[固定提交 7cec128](https://github.com/vectorize-io/hindsight/tree/7cec128b8fdb0a696366d888e63be71fe1d52338)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出待验证假设：对有较多分散决定的项目，自动交接能减少重复整理。用准确恢复约定且可回查来源的任务，对照人工摘要，计入等待和纠错后若无净节省则放弃假设。

同一隔离 profile 对照人工摘要与自动记忆，记录原文一致性、总耗时和错误 bank。在可控环境单独演练服务不可用与退出后的记录核查。

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
| .ts | source | 136 | 21810 | 13722 | 7095 | — |
| .ts | test | 85 | 24749 | 20632 | 2228 | — |

</details>

**活跃度**

[![Issue 未关闭 195](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=195&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 460](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=460&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 411](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=411&color=737b86&logo=github)](https://github.com/vectorize-io/hindsight/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Hindsight 在 DSH 中如何把跨会话记忆带入当前工作区，哪些数据、等待和故障边界会改变是否适合试用的判断？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 自动记忆比手工项目摘要增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在同一代码库开新会话接续工作的开发者，可以让 DSH 在有新的人类输入时补入历史记忆。DSH 回调先等待已有 pre-step 判定，只有继续且未取消时才检查工作区和输入。工具继续步没有新的人类输入时跳过，完全相同的最近注入块也不再追加。注入带 plugin:hindsight 和 recall 标识，便于宿主识别其来源。共享内核支持综合、观察召回、页面检索和工具为主等模式，自动注入使用会话缓存，不能理解为每一步都完整搜索。

相比人工把前次决定整理到仓库说明或新会话提示中，增量是把检索和消息拼接接到普通输入处，减少主动查找步骤。初次配置或早期空 bank 可能没有有效历史。对于需要团队审阅和长期定版的关键约定，仓库文档仍适合作为核对依据。研究合格结果是新会话准确恢复一条事先定义的非敏感项目约定并能回查原文。

#### 证据与依据

**依据 1 · 作者声明**：[hindsight-integrations/coding-agents/README.md:355-372](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/README.md#L355-L372)

作者说明原生入口、工作区和分支会话范围。

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

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:239-252](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/dsh.ts#L239-L252)

构造带 recall 来源的消息。

<details>
<summary>查看原文（14行）</summary>

```text
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

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:290-318](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/dsh.ts#L290-L318)

按继续判定、新输入和内容重复情况控制注入。

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

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/core/hook.ts:242-280](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/core/hook.ts#L242-L280)

会话缓存、自动注入模式和首次新 bank 延迟。

<details>
<summary>查看原文（39行）</summary>

```text
  const cached = readSessionCache(cacheFile);
  const turns = (cached.turns ?? 0) + 1;

  // ── auto-inject: once per session, on the first prompt ────────────────────────
  // cfg.autoInject picks the source: a reflect synthesis, a page search, or a recall of
  // observations. "none" = tool-only mode: the roster's tool guide instead sends new goals through
  // pages first and reserves reflection for gaps. Whatever the source, its body is
  // cached as `reflectAnswer` (the field name predates the other sources).
  let reflectAnswer = cached.reflectAnswer;
  let reflectAttempts = cached.reflectAttempts ?? 0;
  let reflectRanThisTurn = false;
  // Set by whichever source actually FAILED — reflect's catch, or a pages/recall helper returning
  // undefined. An empty answer is not a failure: a source can legitimately have nothing to say on a
  // sparse bank (diag records reflect_empty), and reporting that would tell the user the plugin
  // broke on exactly the sessions where it did not.
  let reflectFailed = false;
  // Set when reflect timed out / 5xx'd and a retrieval-only fallback supplied the memory instead.
  let fallback: string | null | undefined;
  const deferInitialReflect = cached.deferInitialReflect === true;
  if (deferInitialReflect) {
    // A new bank has no useful history yet. Do not burn the once-per-session synthesis on prompt
    // one; this marker is deliberately consumed below so prompt two remains eligible to reflect.
    diag(harness, "reflect_deferred_new_bank", { query: prompt.slice(0, 80) });
  } else if (cfg.autoInject === "pages" && reflectAnswer === undefined) {
    reflectRanThisTurn = true;
    reflectAttempts++;
    const got = await injectPages(
      harness,
      prompt,
      client,
      cfg.injectTimeoutMs,
      "inject_pages",
      PAGE_INJECT_LEAD
    );
    // `undefined` is the search FAILING, distinct from `null` (it ran, nothing matched). These
    // modes stayed silent on a failure while reflect announced one — the same turn looked healthy
    // whether memory was unavailable or simply had nothing to say.
    if (got === undefined) reflectFailed = true;
    reflectAnswer = resolveInjection(got, reflectAttempts);
```

</details>

#### 缺口

- 未测相同任务的召回正确性与人工摘要成本
  **影响**：无法确认自动记忆比明确提示更可靠
  **进一步探讨**：在同一代码任务以显式摘要和自动记忆分别恢复事先定义的决定

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 读取、写回和工具如何选择 bank？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DSH 取会话头中的 cwd，缺失时采用进程 cwd。按目录缓存 RuntimeCore，配置再按映射、显式 bank 或动态仓库名称解析；无法识别的情况会停用记忆。子 Agent 会话被主动跳过，分叉会话写回从 inheritedEventCount 之后的事件，避免重复保存父会话已有内容。非禁用工作区的工具在执行时通常按调用 Agent 重绑。无 Agent 上下文时会回到工具注册时的启动目录模板，启动目录停用时则可能根本没有工具，即便其他仓库具备自动记忆。

默认仓库名及显式映射只是存取路由。共享 bank、重名仓库或相同服务凭据均可能改变可见范围，访问隔离仍需服务侧凭据和权限。对测试样本要分别核对自动注入和手工调用的 bank，尤其不要把两个不同目录无条件等同为两个权限域。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:157-196](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/dsh.ts#L157-L196)

会话自己的事件、cwd、目录级缓存及禁用分支。

<details>
<summary>查看原文（40行）</summary>

```text
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

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:199-215](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/dsh.ts#L199-L215)

后台 seed 和子会话排除。

<details>
<summary>查看原文（17行）</summary>

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
}

function workspaceForAgent(agent: DshAgent): Workspace | undefined {
  // A subagent session is a child of a conversation we already track: injecting into it would pay
  // for a second recall per delegation, and retaining it would file a fragment of a session that
  // the parent already stores in full.
  if (agent.session.header.origin === "subagent") return undefined;
  return workspaceFor(workspaceRoot(agent));
```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/core/host-client.ts:29-48](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/core/host-client.ts#L29-L48)

配置解析与无法辨认工作区时的停用。

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

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/core/bank.ts:310-324](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/core/bank.ts#L310-L324)

路径映射、静态 bank 和动态项目名的优先级。

<details>
<summary>查看原文（15行）</summary>

```text
  const mapped = mappedBank(config, directory, sessionRoot);
  if (mapped) return mapped;

  // dynamic by default — but an explicit bankId (without dynamicBankId: true) means "static".
  const dynamic = config.dynamicBankId ?? !config.bankId;
  if (!dynamic) return config.bankId || DEFAULT_BANK_NAME;

  const resolvers: Record<string, () => string> = {
    harness: () => harness,
    project: () => dirName(directory),
    gitProject: () => gitProjectName(directory, config.resolveWorktrees ?? true, sessionRoot),
    channel: () => process.env.HINDSIGHT_CHANNEL_ID || "default",
    user: () => process.env.HINDSIGHT_USER_ID || "anonymous",
  };
  return applyTemplate(config.bankIdTemplate || DEFAULT_TEMPLATE, resolvers, "bankIdTemplate");
```

</details>

**依据 5 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:395-418](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/dsh.ts#L395-L418)

启动模板和调用 Agent 重绑，缺上下文时退回模板。

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

- 未验证多租户权限及无 Agent 上下文调用的宿主实况
  **影响**：无法把 bank 名解释为隔离保证
  **进一步探讨**：以两个同名测试仓库与独立凭据分别验证读写和工具路径

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 需要哪些宿主服务和网络条件，故障如何表现？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

Cordis 生命周期需要 agents 服务；tools 服务可选，缺失时仍可能运行自动回调。服务默认采用 Cloud 模式和默认远程地址，可显式改为自托管或本地 daemon，认证和请求时限由配置与部署决定。冷启动 seed 会在会话建立时后台进行，可能同步伴随 Skill、预热服务并触发自动更新检查。默认会话写回、git seed 和代码调查均开启，试用前需要显式核对或关闭。

有新输入的 pre-step 等待共享检索逻辑，综合调用带超时。服务故障可能让任务继续但缺少期望记忆，并产生额外等待。回合结束时读取新增会话内容，内部将 retain 放入后台链，诊断区分成功与失败。后台发起并不能保证服务接收，进程提前退出或同一轮写回报错均可能让后续会话看不到该轮；不能把继续对话视为写回成功。发送内容和目标 bank 在可见源码内能追踪，服务端保留期限、数据删除和访问边界仍由实际部署确认。

#### 证据与依据

**依据 1 · 源码核查**：[hindsight-integrations/coding-agents/src/dsh.ts:437-455](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/dsh.ts#L437-L455)

事件必需服务与可选 tools 的接线。

<details>
<summary>查看原文（19行）</summary>

```text
// ── cordis entrypoint ───────────────────────────────────────────────────────────

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

**依据 2 · 源码核查**：[hindsight-integrations/coding-agents/src/core/config.ts:589-622](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/core/config.ts#L589-L622)

Cloud 默认、服务地址与会话写回默认值。

<details>
<summary>查看原文（34行）</summary>

```text
export function resolveConfig(raw: RawConfig = {}): Config {
  const serverMode = ["cloud", "self-hosted", "daemon"].includes(raw.serverMode as string)
    ? (raw.serverMode as "cloud" | "self-hosted" | "daemon")
    : "cloud";
  const apiPort = raw.apiPort || DEFAULT_DAEMON_PORT;
  const pageTrigger = resolvePageTrigger(raw);
  return {
    serverMode,
    // Daemon mode resolves the URL HERE rather than at each call site: every entry point already
    // builds its client from cfg.apiUrl, so collapsing the mode into that one field means the
    // daemon needs no plumbing through eight separate constructors.
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
```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/core/config.ts:657-667](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/core/config.ts#L657-L667)

默认 seed 及代码调查。

<details>
<summary>查看原文（11行）</summary>

```text
    pageTriggerType: pageTrigger.type,
    pageTriggerCron: pageTrigger.cron,
    pages: resolvePages(raw.pages),
    customPages: resolveCustomPages(raw.customPages),
    autoSeed: raw.autoSeed ?? true,
    seedLimit: raw.seedLimit || DEFAULT_SEED_LIMIT,
    codebaseSurvey: raw.codebaseSurvey ?? true,
    surveyModel: raw.surveyModel || "haiku",
    surveyBudgetUsd: raw.surveyBudgetUsd || 2,
    surveyRefreshCommits: raw.surveyRefreshCommits ?? 20,
    gitIngest: ["message", "full", "none"].includes(raw.gitIngest as string)
```

</details>

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:123-147](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/core/runtime.ts#L123-L147)

伴随 Skill、daemon 预热和自动更新入口。

<details>
<summary>查看原文（25行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[hindsight-integrations/coding-agents/src/core/hook.ts:294-309](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/core/hook.ts#L294-L309)

自动综合请求带超时且位于等待路径。

<details>
<summary>查看原文（16行）</summary>

```text
  } else if (cfg.autoInject === "reflect" && reflectAnswer === undefined) {
    reflectRanThisTurn = true;
    reflectAttempts++;
    const t0 = Date.now();
    // Previously clamped to a hardcoded 20s, which made a raised reflectTimeoutMs dead config on
    // this path (#4398); the 20s now lives in the default instead. Not clamped: a user who raises reflectTimeoutMs past the host's prompt-hook timeout (30s on
    // the hook harnesses) must raise that too — see the README's reflectTimeoutMs row.
    const timeoutMs = cfg.reflectTimeoutMs;
    try {
      reflectAnswer = await client.reflect(buildReflectQuery(prompt), {
        // Automatic reflection runs inside the host's hook window. Hindsight's low budget is the
        // supported default for bounded reflect calls; callers that explicitly invoke the MCP
        // tool still get the deeper high-budget path.
        budget: "low",
        timeoutMs,
      });
```

</details>

**依据 6 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:286-307](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/core/runtime.ts#L286-L307)

读取最新会话回合，未增长则不再次写回。

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

**依据 7 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:369-398](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/core/runtime.ts#L369-L398)

后台提交与 retain 失败诊断。

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

- 未观察实际网络超时、服务存储和进程退出时的后台写回
  **影响**：无法保证可用性、延迟上界或数据删除
  **进一步探讨**：用自控服务和非敏感会话分别测试请求失败、进程退出和服务侧回查

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 用一个可逆任务怎样评估采用成本和收益？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

有可控 Hindsight 服务的开发者可在临时 DSH profile 与无敏感内容的测试仓库里试一次跨会话交接。固定组件版本并使用独立配置、明确的 API 地址及独立 bank，仅启用该仓库。关闭 git seed、代码调查和自动更新，若测试需要验证会话写回则明确授权该项，写入一条可验证的虚构约定。在服务端确认写回后开新会话提问，并用原文检查是否正确复用；再用人工传递同一摘要作对照。

分别计入初次设置和凭据、每轮等待和上下文、服务及模型资源，以及故障排查和清理。待验证假设是，跨会话检索能减少人工重复交接，并在相关约定较多时抵消请求等待及误召回复核。若使用方发现资料进入错误 bank、结果无法追溯或端到端耗时高于手工摘要，停止试用，禁用 profile 挂载、重启相关进程并按服务策略处理既有记录。禁用只会阻止后续集成动作，已经提交的资料需独立检查。

#### 证据与依据

**依据 1 · 作者声明**：[hindsight-integrations/coding-agents/cordis.patch.yml:9-18](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/cordis.patch.yml#L9-L18)

作者给出 profile 禁用补丁。

<details>
<summary>查看原文（10行）</summary>

```text
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

**依据 2 · 作者声明**：[hindsight-integrations/coding-agents/README.md:561-585](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/README.md#L561-L585)

配置按目录及 bank 覆盖，支持独立配置路径。

<details>
<summary>查看原文（25行）</summary>

```text
## Configuration

Configuration is **one JSON file**: `~/.hindsight/coding-agent.json`. Layering, later wins per field:

1. built-in defaults
2. environment variables — `HINDSIGHT_API_URL`, `HINDSIGHT_API_TOKEN`, and one per scalar setting
   (`HINDSIGHT_<FIELD_IN_CAPS>`), for containers and CI that inject config rather than write a file
3. the file's top level
4. its `harnesses.<name>` section — per-agent override
5. its `paths.<prefix>` section — per-directory override, applied after the bank is resolved
   (see [Per-directory overrides](#per-directory-overrides--pathsprefix))
6. its `banks.<resolvedBankId>` section — per-repo override, applied after the bank is resolved
   (see [Per-repo opt-in/out](#per-repo-opt-inout--banksbankid))

Environment variables are a **fallback**: the file wins wherever it sets a value, so adding env to
an existing setup changes nothing. The two list-valued settings, `retainTags` and `optInPaths`, take
a comma-separated value (`HINDSIGHT_RETAIN_TAGS="project:{gitProject},env:work"`); entries are
trimmed and blanks dropped.
The map-valued settings (`mapPathToBank`, `harnesses`, `paths`, `banks`, `retainMetadata`) are file-only —
per-key branching doesn't survive flattening into one variable. `maxParallelRetains` is available
as `HINDSIGHT_MAX_PARALLEL_RETAINS` for containers and CI.

`HINDSIGHT_CONFIG` moves the file itself — point it at another path for a container or a test
harness where `$HOME` is not the right anchor. It is still exactly one file; only its location
changes. (The other variables that are not settings are `HINDSIGHT_LOG_FILE`, `HINDSIGHT_DIAG_FILE`,
```

</details>

**依据 3 · 源码核查**：[hindsight-integrations/coding-agents/src/core/chat.ts:377-405](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/core/chat.ts#L377-L405)

会话内容、标记及操作身份进入 retain。

<details>
<summary>查看原文（29行）</summary>

```text
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

**依据 4 · 源码核查**：[hindsight-integrations/coding-agents/src/core/runtime.ts:286-307](https://github.com/vectorize-io/hindsight/blob/7cec128b8fdb0a696366d888e63be71fe1d52338/hindsight-integrations/coding-agents/src/core/runtime.ts#L286-L307)

仅在启用写回且出现新增内容时安排后台提交。

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

- 未测实际服务费用、延迟、误召回与历史记录清理耗时
  **影响**：只能给出可控试用条件，不能量化净收益
  **进一步探讨**：记录每阶段耗时、人工纠正次数、服务与模型消耗，并从服务侧验证清理结果

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
