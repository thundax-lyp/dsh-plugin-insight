# DSH Harness Switch

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[678b5a2](https://github.com/AlyceStocking/dsh-harness-switch/tree/678b5a218f750c61c055bb113a4ff003948aa774)

<!-- BEGIN META -->
[![npm 30d 39](https://img.shields.io/static/v1?label=npm+30d&message=39&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-harness-switch) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-harness-switch)
<!-- END META -->

> **实现功能**：在DSH原生会话中绑定模型与harness，嵌入固定Kimi Code执行核心并桥接审批与历史。

> **核心亮点**：相对提示词替换，已实现增量是完整执行核心与DSH原生入口的桥接，以及显式审批/会话映射；核心能力归固定上游Kimi，不计为插件原创。[Q01](#research-q01) [Q02](#research-q02)

> **风险与缺陷**：“同一会话”不等于两边状态无损一致。pending避免未知结果重复执行，但用户承担多存储备份与人工恢复，外层token统计也不完整；这些限制直接约束持续采用。[Q03](#research-q03)

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
  - [Q01 · 在原生会话嵌入Kimi核心相对仅换提示词增加什么？](#detail-section-11)
  - [Q02 · 会话映射、审批和图片输入如何流动？](#detail-section-12)
  - [Q03 · 双状态与中断恢复怎样限制“无缝切换”？](#detail-section-13)
  - [Q04 · 怎样验证切换不重复副作用，并界定可控采用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望保留DSH原生会话入口并使用Kimi执行核心、需要在模型间继续工作的开发者。

直接使用Kimi CLI或用同一Kimi API配DSH原生工具是直接参照；本轮只比较职责与状态机制，未做质量或token排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 嵌入执行核心 | 在DSH原生会话执行Kimi工具/Skill/压缩 | 固定上游核心；不是仅提示词，非所有CLI交互 |
| 审批与附件桥 | 通过DSH UI审批并转换已准入图片 | 权限仍沿Kimi内部策略；非OS沙箱 |
| 会话映射 | 切回时导入新增外来历史 | 历史有损，未知pending不自动重放 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node≥24.15.0；Windows Desktop 0.2.0-rc.2为作者验证环境 | 启动必需 | 注册模型/系统提示/工具接口 | 其他平台与宿主版本本轮未验证，需隔离核对 |
| Kimi配置、账户与网络 | 执行必需 | 加载模型和调用服务 | 读取配置成功不代表账户有权限，费用未知 |
| 审批UI、工作区与三处状态 | 有副作用操作/恢复必需 | 审批及恢复DSH、engine映射、Kimi home | 缺审批不自动放行，缺状态不能无损恢复 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 备份并绑定 | 用户备份profile与Kimi状态，选择同模型harness | 模型元数据可见但仍需验证权限 |
| 只读会话 | 插件创建映射，用户处理工作区信任 | 卡片显示真实Kimi路径且没有重复工具执行 |
| 切换与停止 | 用户停止后选其他模型再返回 | 核对历史与磁盘，pending先调查不自动重放 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 上游核心依赖与本地状态空间 | 匹配宿主、Kimi配置和审批UI | 包来源固定，安装/时间未测 |
| 持续使用 | 真实模型调用、历史导入和MCP资源 | 核对权限、外来历史与交付 | 外层token覆盖不全，无单位成本数据 |
| 失败恢复 | 保留三处状态与可能已付费调用 | 调查pending副作用、备份与新会话恢复 | 不自动重放；恢复耗时和计费未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 执行核心归属 | 固定Kimi核心与DSH运输信封接线 | 所有平台工具/MCP端到端一致性 |
| 防重复执行 | pending先落盘，completed结果可复用 | 跨进程故障后完整业务恢复 |
| 同模型多harness | 可配置绑定与历史参考导入 | 同任务质量、费用和人工收益 |

> **思考**：“同一会话”不等于两边状态无损一致。pending避免未知结果重复执行，但用户承担多存储备份与人工恢复，外层token统计也不完整；这些限制直接约束持续采用。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对提示词替换，已实现增量是完整执行核心与DSH原生入口的桥接，以及显式审批/会话映射；核心能力归固定上游Kimi，不计为插件原创。[Q01](#research-q01) [Q02](#research-q02)

相对提示词替换，已实现增量是完整执行核心与DSH原生入口的桥接，以及显式审批/会话映射；核心能力归固定上游Kimi，不计为插件原创。[Q01](#research-q01) [Q02](#research-q02)

会话上下文绑定、显式拒绝未知结果重放、审批拒绝默认和宿主附件读取值得借鉴；SDK vendor与双状态版本兼容是主要维护成本。必须保留上游provenance与MIT，不把构建产物规模当原创。

<a id="detail-section-5"></a>

### 1.4 主要限制

“同一会话”不等于两边状态无损一致。pending避免未知结果重复执行，但用户承担多存储备份与人工恢复，外层token统计也不完整；这些限制直接约束持续采用。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

熟悉Kimi和DSH的开发者可在单进程隔离profile及副本工作区试用；出现pending未知结果先查日志与文件，不自动重试，要求无损迁移或完整计费者暂缓。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查桥接、上游归属与pending防重放；未做本轮真实API或宿主执行，切换不是状态无损迁移。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、vendor/provenance.json、src/engine.js、src/images.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的作者材料与关键源码只读核查；未安装或执行目标代码，未运行作者测试，未安排真实宿主验收。引用的既有作者运行记录不视为本轮独立验证。
- 下一步：故障注入prompt前/副作用后/落盘前，比较CLI/嵌入/原生同模型的执行次数、历史保留和全部费用，当前未执行。

**分析版本**

- **仓库**：[AlyceStocking/dsh-harness-switch](https://github.com/AlyceStocking/dsh-harness-switch)
- **版本号**：0.3.3（[固定提交 678b5a2](https://github.com/AlyceStocking/dsh-harness-switch/tree/678b5a218f750c61c055bb113a4ff003948aa774)）
- **版本日期**：2026-10-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是跨harness交接回执能显式暴露历史、图片、压缩、计费与未确认副作用范围，减少误继续；以故障注入后的遗漏识别与实际重复执行次数对照验证。[Q04](#research-q04)

故障注入prompt前/副作用后/落盘前，比较CLI/嵌入/原生同模型的执行次数、历史保留和全部费用，当前未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 1048 | 1008 | 14 | — |
| .md | source | 1 | 131 | — | — | 2665 |
| .mjs | source | 3 | 175 | 151 | 25 | — |
| .js | test | 7 | 481 | 458 | 2 | — |
| .mjs | test | 4 | 283 | 277 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AlyceStocking/dsh-harness-switch/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AlyceStocking/dsh-harness-switch/issues?q=is%3Aissue+created%3A2026-09-23T07%3A58%3A27.897Z..2026-10-23T07%3A58%3A27.897Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AlyceStocking/dsh-harness-switch/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T07%3A58%3A27.897Z..2026-10-23T07%3A58%3A27.897Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：如何把Kimi执行核心嵌入DSH会话并切换，权限与中断状态如何守住边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 在原生会话嵌入Kimi核心相对仅换提示词增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是希望在DSH原生会话/模型选择器中使用Kimi Code执行循环，又需要切回DSH模型的用户。合格交付是选定harness真正拥有提示词、工具执行、权限和压缩，且切换后不会重复执行工具；只让同一API换一段系统提示词不满足这一目标。作者声明embedded core、legacy提示词、DSH native三种绑定；index在embedded路径把DSH层替换为单个运输工具信封，真正工作由固定Kimi核心完成。贡献是宿主交互与执行核心的桥接、状态和审批投影，核心智能、工具、Skills和MCP来自上游Kimi，不能算插件原创。与直接开Kimi CLI相比，它保留原生会话入口但增加双状态管理；同模型不同harness的质量收益尚没有本轮独立证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/README.md#L1-L5)

作者定位明确是嵌入执行核心而非提示词包装。

```text
# DSH Harness Switch

在 DSH 原生会话中选择模型与 harness。v0.3 将开源 Kimi Code 的实际执行核心嵌入插件：提示词、工具定义与执行、Skills、权限规则、MCP 和上下文压缩由 Kimi 核心提供，不启动 Kimi CLI 聊天子进程。

## 当前版本与 npm 分发
```

**依据 2 · 源码核查**：[index.js:22-45](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/index.js#L22-L45)

embedded分支改写为本地运输信封，体现宿主/核心职责。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
    const assembled = await next();
    const binding = assembled.variables.provider === PROVIDER ? (await store.read()).bindings.find(b => b.id === assembled.variables.model) : undefined;
    const agent = context.agent;
    if (agent && scopes.has(agent) && binding?.harness !== ENGINE_HARNESS) {
      scopes.get(agent)(); scopes.delete(agent);
      return ctx.systemPrompt.assemble(context);
    }
    if (assembled.variables.provider !== PROVIDER) return assembled;
    if (!binding) throw new Error('Selected harness model binding no longer exists');
    if (binding.harness === ENGINE_HARNESS) {
      if (agent && !scopes.has(agent)) {
        const releaseMode = agent.ctx.tools.presentAs('native');
        let releaseTool;
        try { releaseTool = agent.ctx.tools.register(manager.definition()); } catch (e) { releaseMode(); throw e; }
        let released = false;
        const release = () => { if (released) return; released = true; releaseTool(); releaseMode(); };
        scopes.set(agent, release);
        agent.ctx.effect(() => () => { release(); if (scopes.get(agent) === release) scopes.delete(agent); });
      }
      const { name, description, parameters } = manager.definition();
      return { ...assembled, sections: [{ name: 'harness-switch:transport', text: 'Kimi Code embedded runtime owns the model prompt, tool execution, permissions, Skills and compaction. This DSH request is a local transport envelope.' }], contexts: [], tools: [{ name, description, parameters }] };
    }
    return applyHarness(assembled, binding);
```

</details>

**依据 3 · 源码核查**：[vendor/provenance.json:1-5](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/vendor/provenance.json#L1-L5)

固定上游与许可，约束贡献归属。

```text
{
  "repository": "https://github.com/MoonshotAI/kimi-code",
  "commit": "c9f01f07388abc2cdca40c9c5267f58c65086710",
  "license": "MIT"
}
```

#### 缺口

- 同模型同任务的CLI/嵌入/原生harness效果对照未取得
  **影响**：不能声称嵌入后质量或token更优
  **进一步探讨**：冻结模型及任务，比较交付、调用次数和全部成本

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话映射、审批和图片输入如何流动？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

index注册llm适配器和按agent作用域的kimi_harness_turn，离开embedded绑定时释放该工具范围；设置保存期间拒绝有活跃agent，避免中途改变绑定。EngineManager以DSH session映射Kimi session，固定Kimi home/cwd/core commit，不一致就拒绝复用。每个session只允许一个运行请求。审批请求映射到DSH，只有allowed-once变成approved，取消/缺服务不会默认放行；工作区信任另走同一审批桥。图片从宿主已准入附件存储读取，转换为image_url；不是接受任意路径。外来模型历史移除reasoning并作为参考导入，显示事件有长度/数量上限，不是完整原始日志。工程上职责分离和显式状态映射可借鉴，迁移需要逐一对齐宿主会话格式、附件和审批语义。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:10-43](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/index.js#L10-L43)

适配器、scope和运输工具注册。

<details>
<summary>查看原文（34行）</summary>

```text
export function apply(ctx, config = {}) {
  const home = process.env.DSH_HOME || join(homedir(), '.dsh');
  const file = config.settingsFile ? absolutePath(config.settingsFile, 'Settings file') : join(home, 'storages', 'harness-switch', `${process.env.DSH_PROFILE || 'default'}.json`);
  const store = new SettingsStore(file);
  const adapter = new EngineAdapter(store);
  const manager = new EngineManager(ctx, store, join(dirname(file), 'engine'));
  const scopes = new Map();
  ctx.effect(() => () => { for (const release of scopes.values()) release(); scopes.clear(); });
  ctx.effect(() => () => manager.dispose());
  ctx.effect(() => ctx.provide('kimiEngine', manager));
  let registration;
  ctx.effect(() => { registration = ctx.llm.registerAdapter([PROVIDER], adapter); return registration; });
  ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
    const assembled = await next();
    const binding = assembled.variables.provider === PROVIDER ? (await store.read()).bindings.find(b => b.id === assembled.variables.model) : undefined;
    const agent = context.agent;
    if (agent && scopes.has(agent) && binding?.harness !== ENGINE_HARNESS) {
      scopes.get(agent)(); scopes.delete(agent);
      return ctx.systemPrompt.assemble(context);
    }
    if (assembled.variables.provider !== PROVIDER) return assembled;
    if (!binding) throw new Error('Selected harness model binding no longer exists');
    if (binding.harness === ENGINE_HARNESS) {
      if (agent && !scopes.has(agent)) {
        const releaseMode = agent.ctx.tools.presentAs('native');
        let releaseTool;
        try { releaseTool = agent.ctx.tools.register(manager.definition()); } catch (e) { releaseMode(); throw e; }
        let released = false;
        const release = () => { if (released) return; released = true; releaseTool(); releaseMode(); };
        scopes.set(agent, release);
        agent.ctx.effect(() => () => { release(); if (scopes.get(agent) === release) scopes.delete(agent); });
      }
      const { name, description, parameters } = manager.definition();
      return { ...assembled, sections: [{ name: 'harness-switch:transport', text: 'Kimi Code embedded runtime owns the model prompt, tool execution, permissions, Skills and compaction. This DSH request is a local transport envelope.' }], contexts: [], tools: [{ name, description, parameters }] };
```

</details>

**依据 2 · 源码核查**：[src/engine.js:67-84](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/src/engine.js#L67-L84)

审批和提问的拒绝/取消映射。

<details>
<summary>查看原文（18行）</summary>

```text
  async approve(exec, request) {
    if (!this.ctx.approval || exec.signal.aborted) return { decision: 'cancelled' };
    const result = await this.ctx.approval.request({ agent: exec.agent, callId: exec.callId,
      toolName: `Kimi · ${request.toolName}`, reason: `${request.action}\n${JSON.stringify(request.display, null, 2)}`, signal: exec.signal });
    return { decision: result === 'allowed-once' ? 'approved' : result === 'cancelled' ? 'cancelled' : 'rejected' };
  }
  async question(exec, request) {
    if (!this.ctx.userQuestions || exec.signal.aborted) return null;
    const questions = request.questions.map((q, i) => ({ id: String(i), question: q.body ? `${q.question}\n${q.body}` : q.question,
      ...(q.header ? { header: q.header } : {}), options: [...q.options], multiSelect: q.multiSelect || false }));
    const result = await this.ctx.userQuestions.ask({ questions, agent: exec.agent, signal: exec.signal });
    if (exec.signal.aborted || !result.answers?.length) return null;
    const answers = {};
    for (const answer of result.answers) {
      const q = request.questions[Number(answer.id)];
      if (q) answers[q.question] = [ ...answer.selected, ...(answer.custom ? [answer.custom] : []) ].join(', ');
    }
    return { answers, method: 'enter' };
```

</details>

**依据 3 · 源码核查**：[src/engine.js:98-145](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/src/engine.js#L98-L145)

单session运行、上下文一致性和session映射。

<details>
<summary>查看原文（48行）</summary>

```text
    if (!exec.agent || typeof args?.messageId !== 'string') throw new EngineError('Embedded Kimi requires an active DSH session');
    if (this.closed) throw new EngineError('Embedded Kimi is stopping');
    const id = String(exec.agent.session.id);
    if (this.running.has(id)) throw new EngineError('A Kimi turn is already active in this session');
    const controller = new AbortController();
    this.controllers.set(id, controller);
    const job = this.execute(args, { ...exec, signal: AbortSignal.any([exec.signal, controller.signal]) });
    this.running.set(id, job);
    try { return await job; }
    catch (error) {
      if (error instanceof EngineError) throw error;
      throw new EngineError(exec.signal.aborted || controller.signal.aborted ? 'Kimi turn cancelled' : 'Kimi runtime failed. Check model configuration and local Kimi runtime logs.');
    } finally {
      const session = this.sessions.get(id);
      session?.setApprovalHandler(undefined); session?.setQuestionHandler(undefined);
      this.running.delete(id); this.controllers.delete(id);
    }
  }
  async execute(args, exec) {
    exec.signal.throwIfAborted();
    const native = exec.agent.session;
    const header = native.requestHeader()?.config;
    if (header?.provider !== PROVIDER) throw new EngineError('Kimi engine transport cannot be called by another provider');
    const settings = await this.store.read();
    const binding = settings.bindings.find(b => b.id === header.model && b.harness === ENGINE_HARNESS);
    if (!binding) throw new EngineError('The selected model is not an embedded Kimi binding');
    const history = native.deriveMessages();
    const message = history.find(m => m.id === args.messageId && m.role === 'user' && m.source?.kind === 'user');
    if (!message || message.content.some(b => !['text', 'image'].includes(b.type))) throw new EngineError('Embedded bridge accepts text and image user messages');
    const parts = await promptParts(message.content, this.ctx.attachments, exec.signal);
    const cwd = native.header?.cwd;
    if (!cwd) throw new EngineError('Select a DSH workspace before using the Kimi engine');
    await mkdir(this.directory, { recursive: true, mode: 0o700 });
    const linkFile = join(this.directory, `session-${hash(String(native.id))}.json`);
    let link = await readJson(linkFile);
    if (link && (link.home !== resolve(settings.kimiHome) || link.cwd !== cwd || link.commit !== ENGINE_COMMIT)) throw new EngineError('Kimi runtime location/version changed. Start a new DSH session to avoid reusing incompatible state.');
    if (link?.completed?.messageId === message.id) return link.completed.result;
    if (link?.pending === message.id) throw new EngineError('This Kimi turn was interrupted before its outcome was saved. It will not be run twice; send a new message to continue.');
    const host = await this.host(settings.kimiHome);
    let session = this.sessions.get(String(native.id));
    if (!session) {
      session = link ? await host.resumeSession({ id: link.kimiSessionId }) : await host.createSession({
        workDir: cwd, model: binding.model, thinking: header.reasoningEffort || 'high', permission: 'manual', drainAgentTasksOnStop: true,
        metadata: { dshSessionId: String(native.id), harnessSwitch: ENGINE_COMMIT },
      });
      this.sessions.set(String(native.id), session);
      link ||= { home: resolve(settings.kimiHome), cwd, commit: ENGINE_COMMIT, kimiSessionId: session.id, seen: [] };
      await saveJson(linkFile, link);
```

</details>

**依据 4 · 源码核查**：[src/engine.js:150-187](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/src/engine.js#L150-L187)

工作区信任、外来历史导入与有界显示。

<details>
<summary>查看原文（38行）</summary>

```text
    session.setApprovalHandler(request => this.approve(exec, request));
    session.setQuestionHandler(request => this.question(exec, request));
    const trust = await host.getWorkspaceTrustInfo(cwd);
    if (!trust.trusted) {
      const answer = await this.approve(exec, { toolName: 'Workspace trust', action: 'Allow Kimi to load this workspace’s project instructions, Skills and configured MCP servers?', display: trust });
      if (answer.decision !== 'approved') throw new EngineError('Kimi workspace trust was declined');
      await host.trustWorkspace(cwd);
    }
    const imported = conversationForImport(history, link.seen, message.id);
    const importedParts = await importWithImages(imported, this.ctx.attachments, exec.signal);
    if (imported.length) {
      await session.importContext(JSON.stringify(importedParts.history), 'DSH conversation since the previous Kimi turn');
      // Image-bearing history is only acknowledged after the visual prompt completes.
      if (!importedParts.images.length) {
        link.seen = [...new Set([...link.seen, ...history.filter(m => m.id !== message.id).map(m => m.id)])];
        await saveJson(linkFile, link);
      }
    }
    const input = textOf(message.content);
    const compact = /^\/kimi-compact(?:\s|$)/.test(input);
    const skill = /^\/kimi-skill\s+(\S+)(?:\s+([\s\S]*))?$/.exec(input);
    if (compact && (parts.some(p => p.type === 'image_url') || importedParts.images.length)) throw new EngineError('Send images in a normal message before requesting compaction.');
    const visualHistory = importedParts.images.length ? [{ type: 'text', text: 'The following images belong to the imported prior conversation, in numbered order.' }, ...importedParts.images, { type: 'text', text: 'Current user message follows.' }] : [];
    const prompt = [...visualHistory, ...parts];
    const view = { callId: exec.callId, kimiSessionId: session.id, status: 'running', events: [], commit: ENGINE_COMMIT };
    this.views.set(exec.callId, view);
    const done = Promise.withResolvers();
    let finalText = '', stepText = '', ended = false;
    const record = event => {
      // Kimi persists the full original wire journal; this is the bounded DSH display projection.
      if (event.type === 'assistant.delta' || event.type === 'thinking.delta') {
        const previous = view.events.at(-1);
        if (previous?.type === event.type && previous.agentId === event.agentId) previous.text = (previous.text + (event.delta || '')).slice(-131072);
        else view.events.push({ type: event.type, agentId: event.agentId, text: event.delta || '' });
      } else if (/^(tool\.(call.started|result|progress)|compaction\.|skill\.|turn\.(started|step.started|ended))/.test(event.type)) {
        view.events.push(JSON.parse(JSON.stringify(event)));
      }
      if (view.events.length > 2000) { view.events.splice(0, view.events.length - 2000); view.trimmed = true; }
```

</details>

**依据 5 · 源码核查**：[src/images.js:1-15](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/src/images.js#L1-L15)

图片只从宿主附件读取及格式白名单。

<details>
<summary>查看原文（15行）</summary>

```text
// Resolve only host-admitted immutable attachments, never caller-supplied paths.
export async function promptParts(blocks, attachments, signal) {
  const parts = [];
  for (const block of blocks) {
    signal?.throwIfAborted();
    if (block.type === 'text') {
      if (block.text.trim()) parts.push({ type: 'text', text: block.text });
    } else if (block.type === 'image') {
      if (!attachments || !block.attachment) throw new Error('Image attachment storage is unavailable');
      const stored = await attachments.readImage(block.attachment, signal);
      if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(stored.ref.mediaType)) throw new Error('Unsupported image format');
      parts.push({ type: 'image_url', imageUrl: { url: `data:${stored.ref.mediaType};base64,${Buffer.from(stored.data).toString('base64')}` } });
    } else throw new Error('Unsupported prompt content');
  }
  return parts;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 双状态与中断恢复怎样限制“无缝切换”？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

切换是DSH可显示历史与Kimi内部状态间的有损桥接，不是任意harness状态无损互换。Engine写入pending后才发prompt；若结果未落盘，后续同message被拒绝重跑，避免不确定副作用重复，代价是用户需新消息继续或人工核对。completed结果可返回；home/cwd/固定核心改变则需新会话。显示投影截断，完整日志与执行状态留Kimi home，因此只备份DSH数据库不足恢复，至少还要保留插件engine映射和Kimi状态。作者也明确不是OS沙箱，Kimi内部工具沿上游策略，不逐工具再过DSH allowlist；不能从原生审批UI推断所有DSH治理规则都生效。首次需要匹配宿主、Node、Kimi模型/账户与审批UI，日常可能发生额外参考历史导入；Kimi token尚未映射外层统计，无法从DSH面板得完整账单。运行和账单未本轮核验。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.js:131-145](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/src/engine.js#L131-L145)

上下文绑定、completed复用与pending阻止重跑。

<details>
<summary>查看原文（15行）</summary>

```text
    const linkFile = join(this.directory, `session-${hash(String(native.id))}.json`);
    let link = await readJson(linkFile);
    if (link && (link.home !== resolve(settings.kimiHome) || link.cwd !== cwd || link.commit !== ENGINE_COMMIT)) throw new EngineError('Kimi runtime location/version changed. Start a new DSH session to avoid reusing incompatible state.');
    if (link?.completed?.messageId === message.id) return link.completed.result;
    if (link?.pending === message.id) throw new EngineError('This Kimi turn was interrupted before its outcome was saved. It will not be run twice; send a new message to continue.');
    const host = await this.host(settings.kimiHome);
    let session = this.sessions.get(String(native.id));
    if (!session) {
      session = link ? await host.resumeSession({ id: link.kimiSessionId }) : await host.createSession({
        workDir: cwd, model: binding.model, thinking: header.reasoningEffort || 'high', permission: 'manual', drainAgentTasksOnStop: true,
        metadata: { dshSessionId: String(native.id), harnessSwitch: ENGINE_COMMIT },
      });
      this.sessions.set(String(native.id), session);
      link ||= { home: resolve(settings.kimiHome), cwd, commit: ENGINE_COMMIT, kimiSessionId: session.id, seen: [] };
      await saveJson(linkFile, link);
```

</details>

**依据 2 · 源码核查**：[src/engine.js:199-230](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/src/engine.js#L199-L230)

pending先落盘和完成落盘顺序及取消路径。

<details>
<summary>查看原文（32行）</summary>

```text
    const cancel = () => {
      cancelling ||= Promise.allSettled([session.cancel(), session.cancelCompaction()]);
      done.resolve('cancelled');
    };
    exec.signal.addEventListener('abort', cancel, { once: true });
    try {
      link.pending = message.id;
      await saveJson(linkFile, link);
      exec.signal.throwIfAborted();
      if (compact) await session.compact({ instruction: input.replace(/^\/kimi-compact\s*/, '') || undefined });
      else if (skill) await session.promptWithSkills(prompt, [{ name: skill[1], args: skill[2] || '' }]);
      else await session.prompt(prompt, { promptId: message.id });
      const reason = await done.promise;
      exec.signal.throwIfAborted();
      if (reason !== 'completed') throw new EngineError(`Kimi turn ended: ${reason}`);
      view.status = 'completed';
      const transcript = JSON.stringify(view.events.filter(e => e.type === 'tool.call.started' || e.type === 'tool.result' || e.type.startsWith('compaction.') || e.type.startsWith('skill.')));
      const result = { text: finalText || '(Kimi completed without a text reply.)', transcript, callId: exec.callId, kimiSessionId: session.id };
      link.seen = [...new Set([...link.seen, ...history.map(m => m.id)])];
      delete link.pending;
      link.completed = { messageId: message.id, result };
      await saveJson(linkFile, link);
      return result;
    } catch (error) {
      view.status = exec.signal.aborted ? 'cancelled' : 'failed';
      if (!ended) cancel();
      await cancelling;
      throw error;
    } finally {
      exec.signal.removeEventListener('abort', cancel);
      unsubscribe(); session.setApprovalHandler(undefined); session.setQuestionHandler(undefined);
      await saveJson(join(this.directory, `view-${hash(exec.callId)}.json`), view);
```

</details>

**依据 3 · 作者声明**：[README.md:75-94](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/README.md#L75-L94)

作者说明多状态存储、工具权限和用量映射限制。

<details>
<summary>查看原文（20行）</summary>

````text

- v0.3.1 的 embedded core 支持文字、单图和多图混合输入：读取 DSH 已验证的附件，通过 Kimi SDK 原生 image_url 内容块提交。模型配置须包含 capabilities = ["image_in", "thinking"]（可保留其他能力）；插件据此在 DSH 声明图片输入。DSH 上传阶段仍有自身的图片格式、尺寸和字节限制，不能承诺与 CLI 输入字节完全相同。legacy 和 DSH native 适配路径仍仅支持文字。
- 切回 Kimi 时，尚未见过的其他模型会话图片会连同参考历史作为视觉内容导入；不会把 base64 当普通文字。视频、Kimi CLI 专属面板、终端快捷键、所有 slash 命令没有移植。内部工具保持上游定义，但仍受宿主平台、依赖和 UI capability 限制。
- 原始 Kimi 日志、上下文、压缩和执行状态留在 Kimi home；DSH 存储可显示的执行投影和最终回答，不能将 DSH 工具事件无损转换成另一 harness 的内部状态。跨模型历史作为参考导入，并移除其他模型的思考字段。
- 插件映射与卡片快照位于设置文件旁的 `engine/`。同时保留 DSH 存储、该目录和 Kimi home 才能完整恢复。中断且结果未落盘的请求不会自动重跑；请发送新消息继续。
- 更改同一 session 的 Kimi home、工作区或固定核心版本会拒绝复用旧状态，需新建 session。不要同时用 CLI 操作插件正在使用的同一个 Kimi session。多个 DSH 进程共享同一 Kimi home 的嵌入缓存尚不支持。
- Kimi 原生 token 用量/预算尚未映射到 DSH 外层统计；原始记录在 Kimi 会话中。后台任务生命周期、MCP 服务和全部平台工具尚未逐项端到端验证。
- 这是插件执行桥接，不是操作系统沙箱。嵌入模式使用 Kimi 的策略；DSH 全局系统提示词扩展不自动注入 Kimi 核心。

设置文件默认位于 `$DSH_HOME/storages/harness-switch/<DSH_PROFILE 或 default>.json`。多 profile 时可在插件配置中指定独立绝对路径 `settingsFile`。

## 独立 API 配置

无需安装 CLI，但需要有效 Kimi 配置及授权。例如：

```toml
[providers.kimi]
type = "kimi"
base_url = "https://api.kimi.com/coding/v1"
api_key_env = "KIMI_API_KEY"
````

</details>

**依据 4 · 源码核查**：[package.json:85-87](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/package.json#L85-L87)

运行时明确要求Node>=24.15.0。

```text
  "engines": {
    "node": ">=24.15.0"
  },
```

#### 缺口

- 跨进程中断、MCP与后台任务的完整恢复效果未独立验证
  **影响**：不能保证切换或退出后所有副作用恢复一致
  **进一步探讨**：故障注入在prompt前/副作用后/落盘前，核对运行次数及状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证切换不重复副作用，并界定可控采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是为跨harness交接增加用户可见的状态完整性回执，列出参考历史范围、图片数量、压缩边界、未确认副作用和计费覆盖，比仅展示“已切换”更能减少错误继续。推导来自有损投影和pending拒绝重放；新增负担是维护两边可比状态摘要，不能泄露凭据或把摘要当恢复证明。最小验证同一带文件写入任务在DSH→Kimi→DSH→Kimi间切换并于关键时刻取消/崩溃，对照无回执和有回执，数实际工具执行次数、历史遗漏、人工恢复时间。若回执无法改善遗漏识别或导致额外重放，则否定。可trial给熟悉Kimi与DSH的开发者，在单进程、隔离profile和副本工作区只读起步；不适合需要完整外层计费或跨harness无损恢复的人。pending未知结果时先核对磁盘/上游日志，不重新发送相同工具执行以猜测成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.js:131-145](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/src/engine.js#L131-L145)

结果不确定时拒绝重放是设计基础。

<details>
<summary>查看原文（15行）</summary>

```text
    const linkFile = join(this.directory, `session-${hash(String(native.id))}.json`);
    let link = await readJson(linkFile);
    if (link && (link.home !== resolve(settings.kimiHome) || link.cwd !== cwd || link.commit !== ENGINE_COMMIT)) throw new EngineError('Kimi runtime location/version changed. Start a new DSH session to avoid reusing incompatible state.');
    if (link?.completed?.messageId === message.id) return link.completed.result;
    if (link?.pending === message.id) throw new EngineError('This Kimi turn was interrupted before its outcome was saved. It will not be run twice; send a new message to continue.');
    const host = await this.host(settings.kimiHome);
    let session = this.sessions.get(String(native.id));
    if (!session) {
      session = link ? await host.resumeSession({ id: link.kimiSessionId }) : await host.createSession({
        workDir: cwd, model: binding.model, thinking: header.reasoningEffort || 'high', permission: 'manual', drainAgentTasksOnStop: true,
        metadata: { dshSessionId: String(native.id), harnessSwitch: ENGINE_COMMIT },
      });
      this.sessions.set(String(native.id), session);
      link ||= { home: resolve(settings.kimiHome), cwd, commit: ENGINE_COMMIT, kimiSessionId: session.id, seen: [] };
      await saveJson(linkFile, link);
```

</details>

**依据 2 · 源码核查**：[src/engine.js:158-187](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/src/engine.js#L158-L187)

参考历史与显示投影边界提供回执内容。

<details>
<summary>查看原文（30行）</summary>

```text
    const imported = conversationForImport(history, link.seen, message.id);
    const importedParts = await importWithImages(imported, this.ctx.attachments, exec.signal);
    if (imported.length) {
      await session.importContext(JSON.stringify(importedParts.history), 'DSH conversation since the previous Kimi turn');
      // Image-bearing history is only acknowledged after the visual prompt completes.
      if (!importedParts.images.length) {
        link.seen = [...new Set([...link.seen, ...history.filter(m => m.id !== message.id).map(m => m.id)])];
        await saveJson(linkFile, link);
      }
    }
    const input = textOf(message.content);
    const compact = /^\/kimi-compact(?:\s|$)/.test(input);
    const skill = /^\/kimi-skill\s+(\S+)(?:\s+([\s\S]*))?$/.exec(input);
    if (compact && (parts.some(p => p.type === 'image_url') || importedParts.images.length)) throw new EngineError('Send images in a normal message before requesting compaction.');
    const visualHistory = importedParts.images.length ? [{ type: 'text', text: 'The following images belong to the imported prior conversation, in numbered order.' }, ...importedParts.images, { type: 'text', text: 'Current user message follows.' }] : [];
    const prompt = [...visualHistory, ...parts];
    const view = { callId: exec.callId, kimiSessionId: session.id, status: 'running', events: [], commit: ENGINE_COMMIT };
    this.views.set(exec.callId, view);
    const done = Promise.withResolvers();
    let finalText = '', stepText = '', ended = false;
    const record = event => {
      // Kimi persists the full original wire journal; this is the bounded DSH display projection.
      if (event.type === 'assistant.delta' || event.type === 'thinking.delta') {
        const previous = view.events.at(-1);
        if (previous?.type === event.type && previous.agentId === event.agentId) previous.text = (previous.text + (event.delta || '')).slice(-131072);
        else view.events.push({ type: event.type, agentId: event.agentId, text: event.delta || '' });
      } else if (/^(tool\.(call.started|result|progress)|compaction\.|skill\.|turn\.(started|step.started|ended))/.test(event.type)) {
        view.events.push(JSON.parse(JSON.stringify(event)));
      }
      if (view.events.length > 2000) { view.events.splice(0, view.events.length - 2000); view.trimmed = true; }
```

</details>

#### 缺口

- 状态回执尚未实现与用户对照
  **影响**：是假设，不能算当前切换可靠性收益
  **进一步探讨**：在相同故障矩阵下比较遗漏识别、重复副作用和人工分钟

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
