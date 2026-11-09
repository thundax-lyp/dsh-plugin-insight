# OpenViking Memory for DeepSeek Harness

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[4bd28b5](https://github.com/volcengine/OpenViking/tree/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin)

<!-- BEGIN META -->
[![GitHub ★ 41,761](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41%2C761&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/OpenViking) [![npm 30d 43,810](https://img.shields.io/static/v1?label=npm+30d&message=43%2C810&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供 OpenViking 自动召回、会话采集、URI 工具保护和 MCP 接入。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，插件把重复的记笔记、查找和搬运上下文部分转进 DSH 生命周期，保留消息来源、会话与工作区条件。存储及提取仍由服务负责。

> **主要限制**：[Q03](#research-q03) 显示关闭采集与停止已排队数据的外发是两个动作，常驻重放仍可能运行。当前连接配置和本地队列状态也需要核实，单次提交成功无法证明后台提取完成。

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
  - [Q01 · 相比手动保存笔记和查 MCP，插件把哪些操作接入宿主？](#detail-section-11)
  - [Q02 · 工作区身份怎样影响召回、注入和会话捕获？](#detail-section-12)
  - [Q03 · 失败、积压和关停何时改变数据发送？](#detail-section-13)
  - [Q04 · 首次接入、持续使用与退出需要验证什么？](#detail-section-14)
  - [Q05 · 可核验的积压与退出控制能否减少错误预期？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 OpenViking 的 DSH 开发者，可让新会话自动查阅项目背景，减少重复粘贴和主动查询。

把项目约束写入本地文档并按需读，或手动触发同一 OpenViking 服务的 MCP 工具。手动路径给操作者更明确的触发和范围。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 步前召回 | 自动附加相关项目背景 | 依赖用户输入、服务和召回范围 |
| 会话捕获 | 将选择的消息写到独立服务 | 受配置过滤，不能据此证明提取完成 |
| 待发恢复 | 服务恢复后重放暂态失败 | 受过期与重试策略限制，停采集不等同停积压 |
| MCP 代理与 Skill | 提供按需工具和包内指导 | MCP 使用进程级配置，工作区范围要分开验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与对应 Node | 运行 bundle 必需 | 提供会话、消息与工具接口 | 无法假定加载 |
| OpenViking 服务及合适凭据 | 召回与会话采集必需 | 保存消息并检索上下文 | 首次初始化可能失败，部分写入进入队列 |
| 带共享模块的包 | 首次接入必需 | 加载复用的客户端逻辑 | 直接链接源码前需准备共享模块 |
| 可控的本地队列目录 | 恢复暂态写入需要 | 保留待重放消息 | 可能无法排队或跨配置误发 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配置 | 开发者在独立 profile 配置可信服务和测试项目 | 核实实际连接、身份与包入口 |
| 采集 | 发一条公开背景并触发保存 | 观察正确会话、归档和任务状态 |
| 召回 | 开另一会话查相同事实，再从第二项目试 | 可核对来源，结果符合项目权限 |
| 退出 | 停相关进程，核对待发、在途与远端留存 | 恢复人工笔记，确认额外发送状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 服务、存储和模型资源 | 配置认证和项目范围 | 依赖准备耗时未知 |
| 持续使用 | 召回、提取和队列资源 | 复核注入质量与外发规则 | 实际资源、收益和费用未知 |
| 失败恢复 | 补发可能重复请求 | 看队列、服务回执与提取任务 | 不可重试项或过期项可能丢失 |
| 退出 | 待发磁盘及远端留存资源 | 停止相关进程并核对已归档内容 | 停采集与删除无直接等价 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 跨会话背景 | 生命周期自动附加画像和召回 | 真实任务正确率与项目隔离 |
| 暂态恢复 | 队列和健康后重放 | 回执丢失、重复写入及完整交付 |
| URI 工具保护 | 已接工具的本地 URI 守卫和提示 | 服务端权限保证及全部工具覆盖 |

> **思考**：[Q03](#research-q03) 显示关闭采集与停止已排队数据的外发是两个动作，常驻重放仍可能运行。当前连接配置和本地队列状态也需要核实，单次提交成功无法证明后台提取完成。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，插件把重复的记笔记、查找和搬运上下文部分转进 DSH 生命周期，保留消息来源、会话与工作区条件。存储及提取仍由服务负责。

[Q02](#research-q02) 通过来源标记避免用插件注入的上下文重新触发捕获与召回，[Q03](#research-q03) 把暂态恢复从新会话启动扩展到后台。与隔离策略集成时，要明确队列归属、在途请求及服务端幂等边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示关闭采集与停止已排队数据的外发是两个动作，常驻重放仍可能运行。当前连接配置和本地队列状态也需要核实，单次提交成功无法证明后台提取完成。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在独立 profile 用公开事实核对普通召回、MCP 与项目权限。观察一次断网后的恢复，再关闭采集检查本地和远端状态。若出现误召回或未解释的补送，停相关进程并回到人工笔记。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

生命周期接入和暂态重放机制有固定源码依据。跨项目权限、进程退出后待发状态与记忆提取效果需实际验证。状态提示和回放授权属于设计假设。

- 已检查：作者 README、包清单、源码路径 examples/dsh-memory-plugin/README.md、examples/dsh-memory-plugin/cordis.patch.yml、examples/dsh-memory-plugin/index.mjs、examples/dsh-memory-plugin/mcp.mjs、examples/dsh-memory-plugin/skills.mjs、examples/dsh-memory-plugin/runtime.mjs、examples/memory-plugin-shared/lib/workspace-peer.mjs、examples/dsh-memory-plugin/capture.mjs、examples/memory-plugin-shared/lib/config-schema.mjs、examples/memory-plugin-shared/lib/recall-core.mjs、examples/memory-plugin-shared/lib/pending-queue.mjs、openviking/server/auth/__init__.py、openviking/session/session.py、examples/dsh-memory-plugin/package.json、examples/memory-plugin-shared/sync.mjs、examples/dsh-memory-plugin/mcp-env.mjs 及固定范围 inventory；组件：examples/dsh-memory-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定 DSH 子包及它实际引用的同仓共享模块和服务会话接口。未执行插件、宿主、服务器和模型，也未穷尽 MCP 工具或部署权限。
- 下一步：在同版本独立 profile 使用两个公开样本、两个项目和两处受控服务，注入断网、回执丢失、关闭采集和更换连接，核对本地队列、远端会话与提取终态。

**分析版本**

- **仓库**：[volcengine/OpenViking](https://github.com/volcengine/OpenViking)
- **版本号**：0.5.33（[固定提交 4bd28b5](https://github.com/volcengine/OpenViking/tree/4bd28b5783d4fd4126ae15beebf5f19730c47219)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出按目标服务显示积压和提取状态，并将暂停与授权回放结合，验证能否减少误送和状态误判。

在同版本独立 profile 使用两个公开样本、两个项目和两处受控服务，注入断网、回执丢失、关闭采集和更换连接，核对本地队列、远端会话与提取终态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | example | 27 | 3890 | 3305 | 278 | — |
| .md | example | 7 | 984 | — | — | 8837 |

</details>

**活跃度**

[![Issue 未关闭 448](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=448&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 367](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=367&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 202](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=202&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有 OpenViking 的 DSH 项目维护者能否让会话上下文在正确的项目身份下持久化、再次召回，并判断关闭或网络失败后还有哪些数据会送达？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比手动保存笔记和查 MCP，插件把哪些操作接入宿主？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合已经管理 OpenViking 服务、经常在 DSH 新开项目会话的开发者。手动办法要记录工作背景并在新会话主动读取笔记或调用 MCP。子包通过 Cordis 补丁挂载，监听启动、步前处理、会话事件和写入刷新。它可自动补上下文，也能把合格会话事件送往服务器，并提供 MCP 工具与内置 Skill。索引、存储和记忆提取由另一个 OpenViking 服务完成。合格的跨会话结果至少需要看到正确来源和项目范围，并在新会话复述可核对事实。错误召回或无法确认写入去向会使手动笔记更容易控制。

#### 证据与依据

**依据 1 · 作者声明**：[examples/dsh-memory-plugin/README.md:1-9](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/README.md#L1-L9)

作者声明 bundle 能力和服务端 home alias 依赖。

```text
# OpenViking Memory for DeepSeek Harness

An installable DeepSeek Harness bundle that adds OpenViking auto-recall, session capture, `viking://` URI protection, and the OpenViking MCP tool surface.

> **Requires an OpenViking server with `viking://~` home-alias support.** Recall targets the
> caller's own context space through `viking://~/memories` and `viking://~/skills`; the uid-less
> `viking://user/memories` shorthand is rejected by newer servers.

Published as [`@openviking/dsh-memory-plugin`](https://www.npmjs.com/package/@openviking/dsh-memory-plugin).
```

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/cordis.patch.yml:1-3](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/cordis.patch.yml#L1-L3)

真实 DSH bundle 注册项。

```text
- insert:
    - id: openviking-memory-runtime
      name: '@openviking/dsh-memory-plugin'
```

**依据 3 · 源码核查**：[examples/dsh-memory-plugin/index.mjs:67-93](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/index.mjs#L67-L93)

新旧启动事件接线，步前中间件调用下游后附加画像和召回。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[examples/dsh-memory-plugin/index.mjs:96-114](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/index.mjs#L96-L114)

会话捕获、刷新、工具防护与末尾挂载的 MCP 和 Skill。

<details>
<summary>查看原文（19行）</summary>

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

  // Mounted last, and deliberately not awaited: the bridge's apply blocks on
  // its first tools/list, so a server that accepts the connection but never
  // answers would otherwise hold up every registration above it.
  mountOpenVikingMcp(ctx, config);
  mountOpenVikingSkills(ctx);
```

</details>

**依据 5 · 源码核查**：[examples/dsh-memory-plugin/mcp.mjs:13-15](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/mcp.mjs#L13-L15)

调用宿主 MCP 客户端插件。

```text
export function mountOpenVikingMcp(ctx, config) {
  return ctx.plugin(mcpClient, buildMcpConfig(config));
}
```

**依据 6 · 源码核查**：[examples/dsh-memory-plugin/skills.mjs:10-22](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/skills.mjs#L10-L22)

挂载自带目录，不重复宿主默认 Skill 根目录。

<details>
<summary>查看原文（13行）</summary>

```text
export function buildSkillsConfig() {
  return {
    providerName: SKILL_PROVIDER_NAME,
    includeDefaultRoots: false,
    bundledSkillDir: SKILLS_DIR,
    // Packaged skills change only on upgrade; watchers can block replacement on Windows.
    watch: false,
  };
}

export function mountOpenVikingSkills(ctx) {
  return ctx.plugin(skillFilesystem, buildSkillsConfig());
}
```

</details>

#### 缺口

- 未对照人工笔记、单独 MCP 和自动注入的同任务结果。
  **影响**：减少手动步骤可解释，收益与错引率不能量化。
  **进一步探讨**：用同一公开项目说明测试第二会话的背景复述，记录来源与人工重复输入。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工作区身份怎样影响召回、注入和会话捕获？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

运行时从会话 header.cwd 或进程工作目录计算 peer，配置显式 peer 时优先采用它。会话 ID 被转成稳定 DSH 标识。健康和会话初始化通过后，步前处理从真实用户消息构造搜索词，低于最小长度则不查。能用服务端上下文组装时优先用它，失败或不可用可走兼容召回。中间件只在 enter 判定附加上下文，保留下游决策字段。捕获过滤已标注的合成消息，按配置接受助手和工具结果，并将 peer 写入 payload。peer 是上下文组织和请求范围的一部分，不能当作账户权限证明。默认召回范围为 all，actor 兼容路径可能查询旧 peer，旧服务明确拒绝 peer_scope 字段时还可重试省略该字段。因此需要项目隔离时，应分别验收实际召回范围与服务端权限，不能只比较工作目录名字。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/index.mjs:12-22](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/index.mjs#L12-L22)

启动配置解析回调按会话工作区重新求 peer，且可跳过子 Agent 会话。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:33-54](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/runtime.mjs#L33-L54)

缓存每个会话的工作目录和身份映射。

<details>
<summary>查看原文（22行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[examples/memory-plugin-shared/lib/workspace-peer.mjs:165-190](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/memory-plugin-shared/lib/workspace-peer.mjs#L165-L190)

显式 peer 优先，余下从工作区模板得出并保留旧标识。

<details>
<summary>查看原文（26行）</summary>

```text
export function resolveEffectivePeerId({ cfg = {}, cwd = "", identity = null, env = process.env, onWarn = null } = {}) {
  const explicit = String(cfg.peerId || "").trim();
  if (explicit) return { peerId: explicit, source: "explicit", origin: "explicit", legacyPeerId: "" };

  // `OPENVIKING_WORKSPACE_PEER=0` predates `peer.source` and still means "none".
  if (cfg.workspacePeer === false) return { peerId: "", source: "none", origin: "disabled", legacyPeerId: "" };

  const templates = peerSourceTemplates(cfg.peerSource, onWarn);
  if (!templates.length) return { peerId: "", source: "none", origin: "none", legacyPeerId: "" };

  // `harness` is composed here rather than in the identity, whose result is
  // cached on disk under a cwd-only key — two harnesses in one directory would
  // otherwise read each other's peer back out of that cache.
  const vars = {
    ...((identity || resolveWorkspaceIdentity({ cwd, env })).vars || {}),
    harness: sanitizePeerId(cfg.harness || cfg.clientId || ""),
  };
  const legacyPeerId = deriveWorkspacePeerId(cwd);
  for (const template of templates) {
    const peerId = renderPeerTemplate(template, vars);
    if (!peerId) continue;
    return {
      peerId,
      source: "workspace",
      origin: template,
      legacyPeerId: peerId === legacyPeerId ? "" : legacyPeerId,
```

</details>

**依据 4 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:130-147](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/runtime.mjs#L130-L147)

按用户查询与配置生成召回，传递 session 和 actor peer。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[examples/dsh-memory-plugin/capture.mjs:62-79](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/capture.mjs#L62-L79)

按消息来源和开关过滤捕获。

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

**依据 6 · 源码核查**：[examples/dsh-memory-plugin/capture.mjs:90-113](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/capture.mjs#L90-L113)

消息附 peer_id，召回问题只采用真实用户输入。

<details>
<summary>查看原文（24行）</summary>

```text
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
```

</details>

**依据 7 · 源码核查**：[examples/memory-plugin-shared/lib/config-schema.mjs:84-86](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/memory-plugin-shared/lib/config-schema.mjs#L84-L86)

召回 peer 选择默认 all。

```text
  { name: "recallPreferAbstract", type: "bool", default: true, env: "OPENVIKING_RECALL_PREFER_ABSTRACT", capability: "recall" },
  { name: "recallPeerScope", type: "enum", values: ["all", "actor"], default: "all", env: "OPENVIKING_RECALL_PEER_SCOPE", workspace: "recall.peer_scope", capability: "recall" },
  // Sent as events_time_decay_protection ("7d", "12h"): event memories keep their score for
```

**依据 8 · 源码核查**：[examples/memory-plugin-shared/lib/recall-core.mjs:639-665](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/memory-plugin-shared/lib/recall-core.mjs#L639-L665)

旧服务兼容降级只认特定未知字段响应，或用已记降级。

<details>
<summary>查看原文（27行）</summary>

```text
  if (request.peer_scope && await readPeerScopeDowngrade(memoPath)) {
    delete request.peer_scope;
  }

  const res = await fetchJSON("/api/v1/search/recall", {
    method: "POST",
    body: JSON.stringify(request),
  }, { actorPeerId });
  if (!request.peer_scope || (res.status !== 400 && res.status !== 422)) {
    return res;
  }
  // Only an unknown-field rejection means "this server predates peer_scope".
  // Retrying every other 400/422 without it silently widens the search from
  // the caller's own peer to the whole user root.
  if (!looksLikeUnknownField(res)) {
    log("recall_peer_scope_error", { status: res.status || 0 });
    return res;
  }

  const downgraded = { ...request };
  delete downgraded.peer_scope;
  await markPeerScopeDowngrade(String(request.peer_scope), res.status || 0, memoPath);
  log("recall_peer_scope_downgrade", { status: res.status || 0 });
  return fetchJSON("/api/v1/search/recall", {
    method: "POST",
    body: JSON.stringify(downgraded),
  }, { actorPeerId });
```

</details>

**依据 9 · 源码核查**：[examples/memory-plugin-shared/lib/recall-core.mjs:683-699](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/memory-plugin-shared/lib/recall-core.mjs#L683-L699)

actor 下可另外召回旧工作区 peer。

<details>
<summary>查看原文（17行）</summary>

```text
export async function buildRecallBlockDetailed(fetchJSON, cfg, query, options = {}) {
  const primary = await recallForPeer(fetchJSON, cfg, query, options);

  const legacyPeerId = String(options.legacyPeerId || "").trim();
  const actorPeerId = options.actorPeerId ?? cfg.peerId ?? "";
  if (cfg.recallPeerScope !== "actor" || !legacyPeerId || legacyPeerId === actorPeerId) return primary;

  const log = options.log || (() => {});
  const legacy = await recallForPeer(fetchJSON, cfg, query, { ...options, actorPeerId: legacyPeerId });
  if (!legacy.block) return primary;
  log("recall_legacy_peer_hit", { legacyPeerId });
  return {
    block: primary.block ? `${primary.block}\n${legacy.block}` : legacy.block,
    contentCount: primary.contentCount + legacy.contentCount,
    hintCount: primary.hintCount + legacy.hintCount,
    budgetUsed: primary.budgetUsed + legacy.budgetUsed,
    stage: primary.block ? primary.stage : legacy.stage,
```

</details>

**依据 10 · 源码核查**：[examples/memory-plugin-shared/lib/recall-core.mjs:719-741](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/memory-plugin-shared/lib/recall-core.mjs#L719-L741)

先用服务端组装，接口不可用时再走客户端候选搜索。

<details>
<summary>查看原文（23行）</summary>

```text
  // Assembly happens server-side when the deployment offers the context face;
  // older servers fall through to /recall, then to raw find.
  const serverBlock = await buildServerAssembledBlock(fetchJSON, cfg, trimmed, {
    ...options,
    actorPeerId,
    log,
  });
  if (serverBlock !== null) {
    if (!serverBlock) return emptyRecall("no_results");
    // The server rendered one budgeted unit, so nothing here degraded to a
    // URI-only hint and the block's own estimate is what it cost.
    return {
      block: serverBlock,
      contentCount: 1,
      hintCount: 0,
      budgetUsed: estimateTokens(serverBlock),
      stage: "server_assembled",
    };
  }

  const recallLimit = Math.max(1, Number(cfg.recallLimit || DEFAULT_CONTEXT_LIMIT));
  const perSourceLimit = Math.max(recallLimit * 2, 8);
  const raw = await searchAllSources(fetchJSON, cfg, trimmed, perSourceLimit, { ...options, actorPeerId }, log);
```

</details>

#### 缺口

- 未检查真实会话下部署方的 ACL 与会话持久回放效果。
  **影响**：按工作区命名和 actor 请求不足以证明项目间隔离。
  **进一步探讨**：设两个项目不同标记及最小授权身份，分别触发普通召回、旧 peer 与 MCP。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败、积压和关停何时改变数据发送？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

会话写入以 Promise 串行。暂态错误会把可重试消息写到本地队列，后续消息在积压期间也进入队列。初始化启动的重放受 capture 开关约束；插件 apply 同时启动常驻 drainer，tick 检查队列和健康后调用重放，没有相同开关，已排队数据仍可能送出。stopDrainer 只清定时器，不能证明已启动的 replay 取消。队列以独占创建和 rename 认领减少并发重复，期限、不可重试错误或重试预算都会让条目离开待发。队列只保存操作、会话 ID 和 payload 等字段，重放使用当前运行时的 URL 与身份配置，不绑定产生记录时的服务端点。消息的 peer_id 仍保存在正文，固定服务的会话请求也不采纳 actor peer 视图，因此不能从重放未传逐会话 actor header 推断该 peer 一定改变。收到提交成功也只可能是归档和后台提取受理。写入回执丢失时可重复尝试，本地去重不证明服务端对相同效果幂等。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:150-177](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/runtime.mjs#L150-L177)

当前捕获、初始化失败和写入失败进入队列的条件。

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

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:96-101](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/runtime.mjs#L96-L101)

启动重放与当前采集开关绑定。

```text
    // Replay is a write, so it stays behind the same toggle: a backlog queued
    // while capture was on waits for a session that still writes.
    if (isCaptureEnabled(state.config)) {
      await this.replayPendingQueue();
    }
    await this.refreshPendingState(state);
```

**依据 3 · 源码核查**：[examples/dsh-memory-plugin/index.mjs:23-35](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/index.mjs#L23-L35)

插件启动常驻 drainer 并注册清定时器的退出动作。

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

**依据 4 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:333-374](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/runtime.mjs#L333-L374)

常驻 drainer 只按列表与健康决定重放，未检查采集开关。

<details>
<summary>查看原文（42行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:382-404](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/runtime.mjs#L382-L404)

定时器默认 60 秒，停止只清定时器，flush 只等待当前会话写入 Promise。

<details>
<summary>查看原文（23行）</summary>

```text
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
  }
```

</details>

**依据 6 · 源码核查**：[examples/memory-plugin-shared/lib/pending-queue.mjs:187-217](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/memory-plugin-shared/lib/pending-queue.mjs#L187-L217)

记录字段不含目标端点和认证快照，排队使用本地 JSON 和独占写入。

<details>
<summary>查看原文（31行）</summary>

```text
export async function enqueue(type, sessionId, payload, options = {}) {
  const dir = getPendingDir();
  const now = Number.isFinite(options.createdAt) ? options.createdAt : Date.now();
  const dedupKey = makeDedupKey(type, sessionId, payload);
  const filename = pendingFilename(dedupKey, 0);
  const entry = {
    type,
    sessionId,
    payload,
    createdAt: now,
    retries: 0,
    dedupKey,
  };

  try {
    await ensurePendingDir(dir);
  } catch (err) {
    return { ok: false, error: err?.message || String(err), dedupKey };
  }

  const existing = await findExistingByDedupKey(dir, dedupKey);
  if (existing) {
    return { ok: true, path: existing.filename, deduped: true, dedupKey };
  }

  try {
    await writeFile(join(dir, filename), JSON.stringify(entry), {
      encoding: "utf-8",
      flag: "wx",
      mode: PENDING_FILE_MODE,
    });
```

</details>

**依据 7 · 源码核查**：[examples/memory-plugin-shared/lib/pending-queue.mjs:265-278](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/memory-plugin-shared/lib/pending-queue.mjs#L265-L278)

以 rename 认领一个文件。

<details>
<summary>查看原文（14行）</summary>

```text
export async function claimForReplay(filename) {
  if (!filename.endsWith(".json")) return null;
  const dir = getPendingDir();
  const claimed = processingFilename(filename);
  try {
    // Recovery measures claim age, not how long the item waited offline.
    // Refresh before publishing .processing so recovery cannot see an old mtime.
    const now = new Date();
    await utimes(join(dir, filename), now, now);
    await rename(join(dir, filename), join(dir, claimed));
    return claimed;
  } catch {
    return null;
  }
```

</details>

**依据 8 · 源码核查**：[examples/memory-plugin-shared/lib/pending-queue.mjs:419-430](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/memory-plugin-shared/lib/pending-queue.mjs#L419-L430)

通过运行时提供的 HTTP 函数重放原 payload。

<details>
<summary>查看原文（12行）</summary>

```text
    try {
      const encodedSid = encodeURIComponent(entry.sessionId);
      if (entry.type === "addMessage") {
        res = await fetchJSON(`/api/v1/sessions/${encodedSid}/messages`, {
          method: "POST",
          body: JSON.stringify(entry.payload),
        });
      } else if (entry.type === "commitSession") {
        res = await fetchJSON(`/api/v1/sessions/${encodedSid}/commit`, {
          method: "POST",
          body: JSON.stringify(entry.payload || {}),
        });
```

</details>

**依据 9 · 源码核查**：[examples/memory-plugin-shared/lib/pending-queue.mjs:451-478](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/memory-plugin-shared/lib/pending-queue.mjs#L451-L478)

成功及永久失败移出，暂态按运行模式处理，并执行过期清理。

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

**依据 10 · 源码核查**：[openviking/server/auth/__init__.py:209-220](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/server/auth/__init__.py#L209-L220)

固定服务的会话接口按认证身份创建上下文，不接收 actor 视图。

<details>
<summary>查看原文（12行）</summary>

```text
async def get_session_request_context(
    request: Request,
    identity: ResolvedIdentity = Depends(resolve_identity),
    x_api_key_ctx: Optional[str] = Header(None, alias="X-API-Key"),
    authorization_ctx: Optional[str] = Header(None, alias="Authorization"),
) -> RequestContext:
    """Build a Session context without accepting an actor peer view."""
    return await _build_request_context(
        request,
        identity,
        api_key=_extract_api_key(x_api_key_ctx, authorization_ctx),
    )
```

</details>

**依据 11 · 源码核查**：[openviking/session/session.py:1967-1974](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/session/session.py#L1967-L1974)

固定服务提交返回 accepted、归档引用和后台任务 ID。

```text
        return {
            "session_id": self.session_id,
            "status": "accepted",
            "task_id": task_id,
            "archive_uri": archive_uri,
            "archived": True,
            "effective_enable_working_memory": effective_policy.enable_working_memory,
            "trace_id": trace_id,
```

#### 缺口

- 未执行断网、回执丢失、换端点或停用并发请求。
  **影响**：不能确认每个事件恰好一次，也不能把关闭采集或清空本地待发等同于删除或停止外发。
  **进一步探讨**：用两个隔离端点和公开标记制造断网后恢复，分别核对活动请求、待发目录、服务写入及任务终态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次接入、持续使用与退出需要验证什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

采用者需要兼容 DSH profile、已装依赖的 bundle、支持 home alias 的 OpenViking 服务及最小权限凭据。固定包声明 Node 范围，直接用源码还需 prepack 同步同仓共享模块。MCP 通过宿主的客户端以 stdio 起代理，配置进入子进程环境；README 说明 MCP 的 actor 用启动身份，而自动召回取会话工作区，不能将两条途径的项目边界混用。配置新开关或换服务前检查待发队列和权限。可在专用 DSH profile 用非敏感资料验证两个工作区的召回、断网回放和停用。如果不能解释队列未清、跨项目召回或远端归档，则先停止相关插件进程并回到人工笔记，核对本地及远端留存。实际模型费用和运维耗时未知。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/package.json:34-49](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/package.json#L34-L49)

声明宿主补丁、打包步骤与 DSH peer 依赖。

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

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/package.json:76-81](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/package.json#L76-L81)

声明 bundle 所需 Node 范围。

```text
  "engines": {
    "node": "^22.19.0 || >=24"
  },
  "publishConfig": {
    "access": "public"
  },
```

**依据 3 · 源码核查**：[examples/memory-plugin-shared/sync.mjs:51-55](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/memory-plugin-shared/sync.mjs#L51-L55)

DSH 的 shared 目录由同仓生成，不作为已提交文件读取。

```text
  {
    root: join(ROOT, "examples", "dsh-memory-plugin"),
    dir: join(ROOT, "examples", "dsh-memory-plugin", "shared"),
    committed: false,
  },
```

**依据 4 · 源码核查**：[examples/dsh-memory-plugin/mcp-env.mjs:19-38](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/mcp-env.mjs#L19-L38)

代理以 stdio 进程启动，继承解析后的连接配置。

<details>
<summary>查看原文（20行）</summary>

```text
export function buildMcpConfig(config) {
  // In DSH Desktop, process.execPath is Electron's executable rather than a
  // standalone Node binary. This tells Electron to run the proxy script as
  // Node instead of attempting to launch a second Desktop instance.
  const env = {
    ELECTRON_RUN_AS_NODE: "1",
    ...forwardConnectionEnv(config),
    OPENVIKING_DEBUG: config.debug ? "1" : "0",
    OPENVIKING_DEBUG_LOG: config.debugLogPath || "",
  };
  if (config.recallPeerScope) env.OPENVIKING_RECALL_PEER_SCOPE = config.recallPeerScope;
  if (config.timeoutMs) env.OPENVIKING_TIMEOUT_MS = String(config.timeoutMs);
  return {
    transport: "stdio",
    serverName: MCP_SERVER_NAME,
    command: process.execPath,
    args: [PROXY_PATH],
    env,
    toolCallTimeoutMs: config.mcpToolCallTimeoutMs,
  };
```

</details>

**依据 5 · 作者声明**：[examples/dsh-memory-plugin/README.md:217-227](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/README.md#L217-L227)

作者说明启动级 MCP 作用域与自动采集的会话作用域区别。

<details>
<summary>查看原文（11行）</summary>

```text
Two consequences follow from the proxy being one process per profile:

- **MCP actor scope is process-level.** With the default `recallPeerScope: all`, MCP tool calls omit the actor peer header. With `actor`, they use the peer resolved at boot. Automatic recall, capture, and commit resolve their peer from each session's workspace.
  Desktop boots the bundle in its profile directory, which is no repository, so
  there the boot peer is empty and `actor`-scoped tool calls fall back to broad
  recall. Set `actor_peer_id` in `ovcli.conf` or `OPENVIKING_PEER_ID` to give
  them a peer; either one also overrides the workspace peer of every session.
- **`remember` is not session-scoped.** The server's MCP `remember` stores into
  its own short-lived session rather than the live `dsh-<session-id>` stream —
  the same behavior the Claude Code, Codex, and Cursor integrations have.
  Automatic capture still records the conversation itself.
```

</details>

**依据 6 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:214-247](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/runtime.mjs#L214-L247)

关闭会话会尝试提交或留下排队项，取决于开关和当前状态。

<details>
<summary>查看原文（34行）</summary>

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
```

</details>

#### 缺口

- 未核实 npm tarball、真实宿主加载、服务端处理范围及长期账单。
  **影响**：只能确定接入和退出的检查点。
  **进一步探讨**：固定宿主、包与服务版本，检查隔离安装、启动、退出、远端留存和一次合格任务成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可核验的积压与退出控制能否减少错误预期？

**研究主题**：新假设与验证

#### 完整回答

当前会话日志有待发、重放和提交记录，但捕获停止、已有积压继续送出与服务端提取终态属于三个状态。可以试验以目标服务标识区分队列归属，暂停后列出正在发送和待处理状态，由用户决定继续回放；归档受理后再展示后台任务结果。相对现有日志与 drainer，这项设想增加可核对的去向和停止边界。用同一份公开样例分别制造断网、服务切换和关闭采集，比较错误判断已送达的次数、向非预期端点的请求、恢复等待及人工操作。若状态无法准确反映回执丢失，或暂停明显增加未发现的丢失且不减少误送，则否定该方案。

#### 证据与依据

**依据 1 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:265-285](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/runtime.mjs#L265-L285)

现在只有入队状态与失败日志，记录未包含目标端点。

<details>
<summary>查看原文（21行）</summary>

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
    }
    return result;
```

</details>

**依据 2 · 源码核查**：[examples/dsh-memory-plugin/runtime.mjs:349-374](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/examples/dsh-memory-plugin/runtime.mjs#L349-L374)

常驻恢复从进程范围处理待发。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[openviking/session/session.py:1967-1974](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/session/session.py#L1967-L1974)

远端区分受理和任务编号，可作为显示分段状态的依据。

```text
        return {
            "session_id": self.session_id,
            "status": "accepted",
            "task_id": task_id,
            "archive_uri": archive_uri,
            "archived": True,
            "effective_enable_working_memory": effective_policy.enable_working_memory,
            "trace_id": trace_id,
```

#### 缺口

- 未测新状态是否减少误判或增加人工积压。
  **影响**：不能将设想计入当前插件能力。
  **进一步探讨**：按受理、队列和已提取三种阶段核对用户判断，并注入回执丢失。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
