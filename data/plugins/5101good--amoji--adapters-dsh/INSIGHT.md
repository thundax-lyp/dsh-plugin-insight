# Amoji for DSH

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[a22c633](https://github.com/5101good/amoji/tree/a22c633ad9ee14353a4110461641f3f2fbfa00d3/adapters/dsh)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：给 DSH 提供图形表情与固定文字语义，支持表达、搜索、精确版本解析和表情库管理。

> **亮点**：相比普通emoji或自由图片，以精确资产revision绑定固定语义并保留原生消息与显示回执，属于协议和宿主适配贡献。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：accepted不等于原生消息observed，文字送达也不等于图片rendered；未知结果重发可能重复。平台与模型支持范围受限。见 [Q03](#research-q03)。

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
  - [Q01 · 表情相对图片和短语新增什么？](#detail-section-11)
  - [Q02 · 图与语义如何进入真实会话？](#detail-section-12)
  - [Q03 · 送达和版本承诺有哪些限制？](#detail-section-13)
  - [Q04 · 依赖与总成本如何承担？](#detail-section-14)
  - [Q05 · 可检验什么新假设，当前如何采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在同一DSH对话以图形表达意图，要求资产版本、文字语义与送达状态可核对。

普通emoji、图片加说明或固定短语均为低负担替代；本轮没有同条件证明图形表达比短语更好。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 表达/搜索/解析 | 模型使用固定文字语义 | 三工具绑定真实会话与回合 |
| 图像呈现 | 人查看表情与语义 | rendered需单独回执，嵌套工具不保证展示 |
| 库与市场管理 | 保存精确版本和包 | 共享服务/备份/远端状态需维护 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node≥24、声明DSH接口版本 | 启动必需 | 宿主工具/会话/展示 | 新宿主或平台不假定兼容 |
| 完整tgz、共享服务、SQLite与Sharp | 启动/资产必需 | 库、渲染与协议 | 单入口源文件不能替代打包 |
| 宿主已配置模型 | AI建议可选 | 文字创作建议 | 可手动编辑，不承诺免费 |
| 市场origin与设备授权 | 市场发布必需 | 安装/投稿状态 | 断网核对原operation |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户备份库并隔离profile安装完整包 | 协议握手与资产可读 |
| 2 | 用户发固定revision表达 | 原生文字observed且图片独立rendered |
| 3 | 用户模拟断连并核对原request | 不另建请求盲重试，异常回退文字 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node/Sharp/本地共享库资源，金额未知 | profile隔离、安装和备份，耗时未知 | 发布tgz完整性需验收 |
| 持续使用 | 资产存储、渲染；可选模型建议计费 | 语义、库与市场版本维护 | 理解/节费收益未测 |
| 失败恢复 | 重连、核对及备份资源未知 | 核对原request和图像状态 | 卸载不删除共享库 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 固定语义 | 精确revision与文字工具接线 | 理解准确率 |
| 可追溯送达 | accepted/observed/display分离 | 当前宿主恢复可靠性 |
| 表情管理 | 共享库与版本接口存在 | 维护负担和跨平台表现 |

> **思考**：accepted不等于原生消息observed，文字送达也不等于图片rendered；未知结果重发可能重复。平台与模型支持范围受限。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相比普通emoji或自由图片，以精确资产revision绑定固定语义并保留原生消息与显示回执，属于协议和宿主适配贡献。见 [Q01](#research-q01)、[Q02](#research-q02)。

会话/回合身份捕获与异步后复核值得借鉴；文字语义与图像meta分离降低模型视觉依赖。移植要实现宿主持久化、RPC与回执语义，源入口不含全部发布runtime，不能将其视作自足单文件插件。

<a id="detail-section-5"></a>

### 1.4 主要限制

accepted不等于原生消息observed，文字送达也不等于图片rendered；未知结果重发可能重复。平台与模型支持范围受限。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有限试用非敏感表达，锁定声明版本并分别核对文字、图像与效果；不把表情当业务授权。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持图文语义分离及回执设计；人机理解收益、发布包与宿主运行未验证；分层确认收益是假设。

- 已检查：作者 README、包清单、源码路径 adapters/dsh/index.mjs、adapters/dsh/package.json、src/dsh/host.ts 及固定范围 inventory；组件：adapters/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅 adapters/dsh 组件及明确共享依赖 src/dsh/host.ts 抽读；统计仅组件，不把全仓库当插件；未执行安装、构建、模型、市场或宿主操作。
- 下一步：以相同表达任务比较理解、重复发送、确认正确率和修正时间，单独核验当前tgz安装/重连/卸载。

**分析版本**

- **仓库**：[5101good/amoji](https://github.com/5101good/amoji)
- **版本号**：2.0.0（[固定提交 a22c633](https://github.com/5101good/amoji/tree/a22c633ad9ee14353a4110461641f3f2fbfa00d3)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的分层办结状态可能减少误确认/重复发送；与普通图片和短语对照，收益不成立则不增加交互负担。见 [Q05](#research-q05)。

以相同表达任务比较理解、重复发送、确认正确率和修正时间，单独核验当前tgz安装/重连/卸载。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 27 | 27 | 1 | — |
| .md | source | 2 | 106 | — | — | 2381 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/5101good/amoji/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/5101good/amoji/issues?q=is%3Aissue+created%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/5101good/amoji/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定语义表情能否让 DSH 人机表达更可追溯，同时避免将显示或入队误认成消息送达？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 表情相对图片和短语新增什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合希望在 DSH 对话里用图形表达确认、迟疑或决策意图，同时让模型读到固定文字含义的人。合格结果是人看到正确资产版本、模型收到对应语义，并且操作者能核对送达状态；图片漂亮或码位数量不是成功标准。相对普通emoji，增量是图像资产与不可变语义版本、交互动作和回执绑定；相对固定文字短语，可能提高人类识别效率，但此收益未测。语义标准由项目协议定义，不能将固定文本推断为跨文化理解一致。

#### 证据与依据

**依据 1 · 作者声明**：[adapters/dsh/README.md:5-23](https://github.com/5101good/amoji/blob/a22c633ad9ee14353a4110461641f3f2fbfa00d3/adapters/dsh/README.md#L5-L23)

作者图像给人、固定语义给模型与创作流程

<details>
<summary>查看原文（19行）</summary>

````text
面向人和 AI 的原生表情：人看图，模型读固定语义。2.0.0 以 dsh **0.1.5-rc.2** 为基线，需要 Node.js **>=24**。历史真机记录来自 macOS arm64，本次发行范围见[2.0.0 发布说明](https://github.com/5101good/amoji/blob/v2.0.0/docs/releases/v2.0.0.md)。

## 安装与使用

从 [GitHub Releases](https://github.com/5101good/amoji/releases) 下载并核对 `amoji-dsh-2.0.0.tgz`，在文件所在目录执行：

第一条命令为新 profile 初始化 Web 模板并显示帮助；随后安装并启动。

```sh
npx @deepseek-ai/dsh@0.1.5-rc.2 --profile amoji --from-default-profile web --help
npx @deepseek-ai/dsh@0.1.5-rc.2 plugin --profile amoji add ./amoji-dsh-2.0.0.tgz --ignore-scripts
npx @deepseek-ai/dsh@0.1.5-rc.2 --profile amoji
```

`amoji` 是示例 profile，替换为自己的名称。安装到已有 profile 时先保存工作，安装后重启。选择工作区即可从输入区打开“表情”，无需先发送普通文字。点图发送，详情只查看含义；新库的经典与办公各有 24 个表情、实现相同的 22 个码位，共 48 个资产。选择器只提供可由人发送的表情。

“管理表情”支持草稿、个人副本、不可变历史版本、归档、偏好及 `.amoji` 包导入导出。创作只有一个意图输入框；AI 文字建议默认当前会话模型，可另选宿主已配置模型。只发送文字意图和生成指令，不发送图片或会话历史。采用建议后仍需编辑、保存、图文加载预览、勾选并确认入库。手工填写无需模型请求。

界面跟随 dsh 中英语言，固定语义不会随 UI 翻译改写。内置表情提供中文原文与英文语义，并标明翻译来源。模型建议按所选提供方配置计费，不自动重试。
````

</details>

**依据 2 · 源码核查**：[src/dsh/host.ts:20-24](https://github.com/5101good/amoji/blob/a22c633ad9ee14353a4110461641f3f2fbfa00d3/src/dsh/host.ts#L20-L24)

visual meta绑定asset/revision/hash与方向

```text
export function visualMeta(message: StoredMessage): VisualMeta {
  const e = message.revision; const direction = message.from.role === 'human' ? 'h2a' : 'a2h';
  return { kind: 'amoji', messageId: message.message_id, act: message.act, direction, policy: message.glyph_policy,
    ref: e ? { asset_id: e.asset_id, revision_id: e.revision_id } : null, visualHash: e?.visual.primary.sha256 ?? null, posterHash: e?.visual.poster?.sha256 ?? null,
    alt: actGloss(message.act, direction).text };
```

#### 缺口

- 没有人类理解和模型执行的同任务对照
  **影响**：不能确认表情优于固定短语
  **进一步探讨**：比较普通emoji、文字短语和Amoji的误解率、修正时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 图与语义如何进入真实会话？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

adapter 入口连接共享核心、要求能力握手，再安装宿主工具与路由，卸载时关闭连接。实际实现位于根src/dsh，是组件之外的共享依赖，本次额外抽读而不把整个仓库统计算到adapter。三个模型工具分别表达、搜索、解析；工具捕获真实 agent/session 和 turnBoundary，并在异步返回后复核未换会话/回合。返回给模型的是固定文字JSON，图片元信息走宿主 presentationMeta；这避免模型靠图像猜语义。可借鉴处是语义与展示分离、身份冻结及异步后复核，移植需要宿主真实会话和投影接口，不能只复制三个工具名。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.mjs:1-26](https://github.com/5101good/amoji/blob/a22c633ad9ee14353a4110461641f3f2fbfa00d3/adapters/dsh/index.mjs#L1-L26)

共享运行时和生命周期接线

<details>
<summary>查看原文（26行）</summary>

```text
import {DshPublisher,MARKET_ORIGIN} from './runtime/src/dsh/publisher.js';
import { dshHomePath } from '@deepseek-ai/dsh-home-paths';
import { loadProfileIdentity } from './runtime/src/dsh/profile-identity.js';
import { DshCollaboration } from './runtime/src/dsh/collaboration.js';
import { defineTool } from '@deepseek-ai/dsh-tools';
import { SharedClient } from './runtime/src/shared-client.js';
import { ConnectedRuntime } from './runtime/src/adapter-runtime.js';
import { DSH_RELIABILITY_CAPABILITY, DSH_NATIVE_CAPABILITY, LIBRARY_MANAGEMENT_CAPABILITY, PACKS_CAPABILITY } from './runtime/src/shared-contract.js';
import { installDsh } from './runtime/src/dsh/host.js';
export const inject = ['tools', 'sessions', 'sessionProjections', 'sessionController', 'connection', 'llm', 'agents', 'systemPrompt'];
export const name = 'amoji';
export async function apply(ctx) {
  const client = await SharedClient.connect({ requiredCapabilities: [DSH_RELIABILITY_CAPABILITY, DSH_NATIVE_CAPABILITY, LIBRARY_MANAGEMENT_CAPABILITY, PACKS_CAPABILITY] });
  ctx.effect(() => () => client.close(), 'amoji: shared core connection');
  const runtime = new ConnectedRuntime(client);
  let hostInstanceId = 'local';
  let collaboration;
  if (ctx.agents && ctx.systemPrompt && typeof ctx.on === 'function') {
    try {
      hostInstanceId = (await loadProfileIdentity(dshHomePath('plugins', 'amoji'))).id;
      collaboration = new DshCollaboration(ctx, runtime, hostInstanceId);
      ctx.effect(() => () => collaboration.dispose(), 'amoji: collaboration lifecycle');
    } catch { /* Identity unavailable: preserve expressions; actions fail explicitly. */ }
  }
  const publisher=new DshPublisher(dshHomePath('plugins','amoji','publisher'),runtime,process.env.AMOJI_MARKET_ORIGIN||MARKET_ORIGIN);
  installDsh(ctx, runtime, hostInstanceId, defineTool, collaboration,publisher);
```

</details>

**依据 2 · 源码核查**：[src/dsh/host.ts:93-114](https://github.com/5101good/amoji/blob/a22c633ad9ee14353a4110461641f3f2fbfa00d3/src/dsh/host.ts#L93-L114)

会话/回合捕获、异步后检查与文字/元信息分离

<details>
<summary>查看原文（22行）</summary>

```text
  private capture(exec: DshExecution): { context: BindingContext; check(): void } {
    const agent = exec.agent;
    if (!agent || !agent.id || agent.session?.id !== agent.id || this.ctx.sessions.get(agent.id) !== agent.session) fail('DSH_CONTEXT_UNAVAILABLE', '缺少宿主登记的真实会话身份');
    nonempty(exec.callId); if (exec.rootCallId !== undefined) nonempty(exec.rootCallId);
    const session = agent.session; const sessionId = agent.id;
    const seq = this.ctx.sessionProjections.stateOf(session, 'turnBoundary')?.openTurnStartSeq;
    if (!Number.isSafeInteger(seq) || seq === null || seq === undefined || seq < 0) fail('DSH_TURN_UNAVAILABLE', '工具必须运行在真实开启的回合');
    const starts = session.snapshotEvents().filter(event => event.type === 'turn/start' && event.seq <= seq);
    if (!starts.some(event => event.seq === seq)) fail('DSH_TURN_UNAVAILABLE', '当前回合缺少原生事件，无法执行频率策略');
    const turnOrdinal = starts.length;
    const check = () => { exec.signal.throwIfAborted(); if (exec.agent !== agent || agent.id !== sessionId || agent.session !== session || this.ctx.sessions.get(sessionId) !== session || this.ctx.sessionProjections.stateOf(session, 'turnBoundary')?.openTurnStartSeq !== seq) fail('DSH_CONTEXT_CHANGED', '调用会话或回合已变化'); };
    check(); return { context: { ...this.context(sessionId), turnId: `turn:${seq}`, turnOrdinal }, check };
  }
  tool(name: 'amoji_express' | 'amoji_search' | 'amoji_resolve'): ToolOptions {
    return { name, description: TOOL_DESCRIPTIONS[name], parameters: TOOL_PARAMETERS[name],
      output: { schema: { type: 'json' }, render: (_args, value) => [{ type: 'text', text: modelText(value) }], ...(name === 'amoji_express' ? { presentationMeta: (_args: unknown, value: unknown) => (record(value).meta ?? null) as JsonValue } : {}) },
      execute: async (raw, exec): Promise<JsonValue> => {
        const frozen = this.capture(exec);
        const args = modelArguments(name, raw);
        const run = await runModelTool(this.runtime, frozen.context, name, args); frozen.check();
        return { text: JSON.stringify(run.result), ...(run.message ? { meta: visualMeta(run.message) as unknown as JsonValue } : {}) };
      } };
```

</details>

**依据 3 · 源码核查**：[src/dsh/host.ts:349-357](https://github.com/5101good/amoji/blob/a22c633ad9ee14353a4110461641f3f2fbfa00d3/src/dsh/host.ts#L349-L357)

三工具与认证RPC注册

```text
  for (const name of ['amoji_express', 'amoji_search', 'amoji_resolve'] as const) ctx.tools.register(defineTool(adapter.tool(name)));
  ctx.effect(() => {
    const releases: Array<() => Promise<void>> = [];
    const dispose = async () => { await Promise.all(releases.splice(0).reverse().map(async release => release())); };
    try {
      releases.push(...installPackRoutes(ctx, runtime, (id, signal) => adapter.rpc('amoji/history', { sessionId: id }, signal)));
      for (const method of [...['beginLogin', 'loginStatus', 'cancelLogin', 'logout', 'drafts', 'create', 'save', 'upload', 'submit', 'retrySubmit', 'reconcile', 'submissions', 'withdraw'].map(m => 'publisher.' + m), ...['search', 'detail', 'install', 'installStatus', 'collect', 'uncollect', 'remove', 'updateCheck', 'local', 'visual', 'refreshRevocations'].map(m => 'marketplace.' + m), 'reconnect', 'catalog', 'packs', 'search', 'history', 'visual', 'collaboration.rules', 'collaboration.enable', 'collaboration.disable', 'collaboration.disableAll', 'collaboration.capabilities', 'collaboration.receipts', 'effects', 'submit', 'retract', 'choose', 'display', 'manage', 'management']) {
        const endpoint = `amoji/${method}`;
        releases.push(ctx.connection.fetch.register({ path: `/api/${endpoint}`, methods: ['POST'], requestBody: 'buffered', fetch: async request => {
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 送达和版本承诺有哪些限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

accepted、observed 和 rendered 是三个不同事实。host history 通过原生 user event 的 rpcId 判断 observed；曾标记accepted而没有事件时只报accepted，attempted则unknown。图片加载有独立display回执，不能从原生文字存在推断图片渲染。这个边界比笼统“发送成功”可靠，但仍依赖宿主持久化和共享服务状态，断连后必须核对原 requestId，不能新发导致重复。README 明确旧库不就地迁移、旧包不能导入，Linux/Windows及全部模型组合未验证，direct tools展示路径也不保证PTC嵌套展示。源码中存在接线不证明发布包生成的 runtime 与 client 完整可用。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh/host.ts:130-148](https://github.com/5101good/amoji/blob/a22c633ad9ee14353a4110461641f3f2fbfa00d3/src/dsh/host.ts#L130-L148)

原生事件与accepted/unknown分层

<details>
<summary>查看原文（19行）</summary>

```text
  private async rows(sessionId: string, events: readonly DshEvent[]): Promise<HistoryEntry[]> {
    const context = this.context(sessionId);
    const messages = await this.runtime.messages(context);
    if (this.collaboration && messages.some(m => m.effect_intent)) await this.session(sessionId, this.lifecycle);
    return Promise.all(messages.map(async message => {
      const effect = message.effect_intent ? (this.collaboration ? await this.collaboration.receipt(sessionId, message) : { status: 'unsupported' as const, reason: 'host-context-unavailable' }) : undefined;
      if (message.direction !== 'human_to_ai') {
        if (!message.choice) return { message, meta: visualMeta(message), host: null };
        const choiceId = `amoji-choice:${message.message_id}`;
        const answered = events.find(e => e.type.startsWith('user/') && record(record(e.data).source).rpcId === choiceId);
        return { message, meta: visualMeta(message), host: { status: answered ? 'observed' as const : 'prepared' as const, requestId: choiceId, ...(answered ? { hostMessageId: nonempty(record(answered.data).id), seq: answered.seq } : {}) } };
      }
      const requestId = `amoji:${message.message_id}`;
      const user = events.find(e => e.type.startsWith('user/') && record(record(e.data).source).rpcId === requestId);
      // A steering signal that the agent claimed during its turn reached the model there.
      if (user && message.signal === 'queued' && this.runtime.signalState) await Promise.resolve(this.runtime.signalState(context, message.message_id, 'delivered_to_model')).then(updated => { message.signal = updated.signal; }).catch(() => {});
      const accepted = message.dsh_submission === 'accepted';
      const turn = user ? [...events].reverse().find(e => e.type === 'turn/start' && e.seq <= user.seq) : undefined;
      return { ...(effect ? { effect } : {}), message, meta: visualMeta(message), host: { status: user ? 'observed' : accepted ? 'accepted' : message.dsh_submission === 'attempted' ? 'unknown' : 'prepared', requestId, ...(user ? { hostMessageId: nonempty(record(user.data).id), seq: user.seq } : {}), ...(turn ? { turnStartSeq: turn.seq } : {}) } };
```

</details>

**依据 2 · 源码核查**：[src/dsh/host.ts:243-245](https://github.com/5101good/amoji/blob/a22c633ad9ee14353a4110461641f3f2fbfa00d3/src/dsh/host.ts#L243-L245)

显示回执独立登记

```text
      if (!['rendered', 'fallback', 'failed'].includes(String(args.state))) fail('INVALID_ARGUMENT', '显示状态不合法');
      signal.throwIfAborted();
      await this.runtime.acknowledge(context, messageId, args.state === 'rendered' ? 'rendered' : 'fallback');
```

**依据 3 · 作者声明**：[adapters/dsh/README.md:25-31](https://github.com/5101good/amoji/blob/a22c633ad9ee14353a4110461641f3f2fbfa00d3/adapters/dsh/README.md#L25-L31)

数据迁移、送达状态和模型/平台边界

```text
## 数据与兼容

Host 连接本地共享服务；产品版本为 2.0.0，协议为 Amoji 0.1，共享 API 为 `3`，数据库为 `1`。macOS 默认数据目录为 `~/Library/Application Support/Amoji/prototype`，可用 `AMOJI_DATA_DIR` 隔离。从 1.x 升级前须停止旧服务并备份完整目录。2.0.0 使用新的 `library-0.1.sqlite`，保留旧 `library.sqlite`，不要求空目录；不支持旧库就地迁移或旧 `.amoji` 包导入。不要手改数据库版本号。卸载插件不主动删除共享库。

浏览器只使用宿主认证 RPC，模型只使用三个文字工具。`accepted` 表示宿主已接收入队，原生用户消息是否落盘仍需核对；`observed` 表示已观察到对应原生消息，图片 `rendered` 是独立的加载证据。断连或结果未知时核对原请求，避免另发。

direct tools 是 AI 图像展示的验证路径；Code Dispatch/PTC 嵌套工具不保证显示。Linux、Windows、新版 dsh 与全部模型组合尚未验证。某提供方续答会因 `reasoning_text` 兼容返回400，插件不能保证所有模型完整工具回合成功。Codex/Claude Code legacy 不在本包范围。
```

#### 缺口

- 当前发布包、宿主与断连恢复未执行
  **影响**：无法确认端到端送达或跨平台兼容
  **进一步探讨**：隔离profile测试丢响应、重连、同request核对和图片失败

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖与总成本如何承担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

Node≥24、特定DSH接口版本、共享服务、SQLite库与Sharp等依赖共同决定启动；源adapter导入runtime构建产物，需按发布打包流程获取完整tgz，不能直接把入口单文件装成可用插件。首次包括独立profile、备份共享库、依赖安装；持续包括资产/语义维护、渲染与本地存储。可选AI建议使用宿主配置模型并产生其调用费用，手工创作不需该模型请求；本轮没有查询价格或调用，金额未知。市场安装与发布加入远端状态和凭据责任，离线能用已安装资产不等于所有操作离线。卸载不删共享库，退出与迁移要单独负责。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/package.json:26-48](https://github.com/5101good/amoji/blob/a22c633ad9ee14353a4110461641f3f2fbfa00d3/adapters/dsh/package.json#L26-L48)

Node、宿主接口与Sharp等依赖

<details>
<summary>查看原文（23行）</summary>

```text
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": "0.1.5-rc.2",
    "@deepseek-ai/cordis": "4.0.2",
    "@deepseek-ai/dsh-client-connection": "0.1.5-rc.2",
    "@deepseek-ai/dsh-llm": "0.1.5-rc.2",
    "@deepseek-ai/dsh-client-locale": "0.1.5-rc.2",
    "@deepseek-ai/dsh-home-paths": "0.1.5-rc.2",
    "@deepseek-ai/dsh-session": "0.1.5-rc.2",
    "@deepseek-ai/dsh-system-prompt": "0.1.5-rc.2"
  },
  "dependencies": {
    "ajv": "8.20.0",
    "ajv-formats": "3.0.1",
    "sharp": "0.35.5",
    "yauzl": "3.4.0",
    "yazl": "3.3.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./patch.yml"
    },
    "client": {
```

</details>

**依据 2 · 作者声明**：[adapters/dsh/README.md:19-29](https://github.com/5101good/amoji/blob/a22c633ad9ee14353a4110461641f3f2fbfa00d3/adapters/dsh/README.md#L19-L29)

创作调用、共享库与卸载保留

<details>
<summary>查看原文（11行）</summary>

```text
`amoji` 是示例 profile，替换为自己的名称。安装到已有 profile 时先保存工作，安装后重启。选择工作区即可从输入区打开“表情”，无需先发送普通文字。点图发送，详情只查看含义；新库的经典与办公各有 24 个表情、实现相同的 22 个码位，共 48 个资产。选择器只提供可由人发送的表情。

“管理表情”支持草稿、个人副本、不可变历史版本、归档、偏好及 `.amoji` 包导入导出。创作只有一个意图输入框；AI 文字建议默认当前会话模型，可另选宿主已配置模型。只发送文字意图和生成指令，不发送图片或会话历史。采用建议后仍需编辑、保存、图文加载预览、勾选并确认入库。手工填写无需模型请求。

界面跟随 dsh 中英语言，固定语义不会随 UI 翻译改写。内置表情提供中文原文与英文语义，并标明翻译来源。模型建议按所选提供方配置计费，不自动重试。

## 数据与兼容

Host 连接本地共享服务；产品版本为 2.0.0，协议为 Amoji 0.1，共享 API 为 `3`，数据库为 `1`。macOS 默认数据目录为 `~/Library/Application Support/Amoji/prototype`，可用 `AMOJI_DATA_DIR` 隔离。从 1.x 升级前须停止旧服务并备份完整目录。2.0.0 使用新的 `library-0.1.sqlite`，保留旧 `library.sqlite`，不要求空目录；不支持旧库就地迁移或旧 `.amoji` 包导入。不要手改数据库版本号。卸载插件不主动删除共享库。

浏览器只使用宿主认证 RPC，模型只使用三个文字工具。`accepted` 表示宿主已接收入队，原生用户消息是否落盘仍需核对；`observed` 表示已观察到对应原生消息，图片 `rendered` 是独立的加载证据。断连或结果未知时核对原请求，避免另发。
```

</details>

**依据 3 · 作者声明**：[adapters/dsh/README.md:35-45](https://github.com/5101good/amoji/blob/a22c633ad9ee14353a4110461641f3f2fbfa00d3/adapters/dsh/README.md#L35-L45)

包内容和许可边界

<details>
<summary>查看原文（11行）</summary>

```text
包含 Host/Client、共享核心、基础资产、构建信息与许可清单，不嵌入 `node_modules`、Sharp `.node` 或 libvips 动态库；宿主包管理器安装依赖，因此不是离线安装包。Client 使用宿主 React，Host 使用宿主服务。

代码 MIT；官方表情包 CC0-1.0；第三方依赖保留各自许可。参见包内 `LICENSE`、`NOTICE`、`THIRD_PARTY.json`、`THIRD_PARTY_LICENSES/` 和 `assets/official-packs/`。

完整[安装恢复](https://github.com/5101good/amoji/blob/main/docs/dsh-installation.md)、[使用](https://github.com/5101good/amoji/blob/main/docs/usage.md)和[已知限制](https://github.com/5101good/amoji/blob/main/docs/release.md)见源码仓库。

### 表情市场

在选择器点击「表情市场」，可匿名搜索、预览精确版本、安装表情包或独立收藏单张表情。安装不会启用任何效果。检查更新会列出语义和效果差异，采用后停用旧包规则；仍可在库管理中选择已经保留的旧表情版本。移除包不会删除独立收藏、其他导入或历史。

Host 启动环境的 `AMOJI_MARKET_ORIGIN` 固定市场 origin（默认正式市场 `https://amoji.ai-web.ai`）；显式本地测试可使用 loopback HTTP origin。客户端及包不能覆盖它。修改此部署配置前应关闭使用同一库的宿主及共享服务，再重新启动。用 `DSH_HOME` 和 `AMOJI_DATA_DIR` 隔离测试。
```

</details>

#### 缺口

- 首次安装、资产管理与失败恢复工时未测
  **影响**：总成本和采用便利性未知
  **进一步探讨**：记录完整安装/备份/重连/卸载流程人工时

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可检验什么新假设，当前如何采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是用户可见“文字送达/图片加载/效果执行”分层状态，比单个发送成功提示更能降低误确认与重复发送。来源是Q03的已有状态分离，而新增之处是把它作为用户办结判据。最小实验在隔离宿主对同10个表达任务注入文字入队后断连、图片失败和效果未知，对照普通图片/固定短语，记录正确确认率、重复发送与纠错时间；若状态负担增加却不减少误判，就否定。当前可有限试用非敏感表达，先锁定README声明宿主和Node版本，验证文本与图分别可观测、原请求可恢复；不得作为自动执行业务授权信号。出现语义版本错配或未知结果被当成功时停止。未验证跨平台与发布流程，不给持续安装建议。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh/host.ts:130-148](https://github.com/5101good/amoji/blob/a22c633ad9ee14353a4110461641f3f2fbfa00d3/src/dsh/host.ts#L130-L148)

分层送达事实基础

<details>
<summary>查看原文（19行）</summary>

```text
  private async rows(sessionId: string, events: readonly DshEvent[]): Promise<HistoryEntry[]> {
    const context = this.context(sessionId);
    const messages = await this.runtime.messages(context);
    if (this.collaboration && messages.some(m => m.effect_intent)) await this.session(sessionId, this.lifecycle);
    return Promise.all(messages.map(async message => {
      const effect = message.effect_intent ? (this.collaboration ? await this.collaboration.receipt(sessionId, message) : { status: 'unsupported' as const, reason: 'host-context-unavailable' }) : undefined;
      if (message.direction !== 'human_to_ai') {
        if (!message.choice) return { message, meta: visualMeta(message), host: null };
        const choiceId = `amoji-choice:${message.message_id}`;
        const answered = events.find(e => e.type.startsWith('user/') && record(record(e.data).source).rpcId === choiceId);
        return { message, meta: visualMeta(message), host: { status: answered ? 'observed' as const : 'prepared' as const, requestId: choiceId, ...(answered ? { hostMessageId: nonempty(record(answered.data).id), seq: answered.seq } : {}) } };
      }
      const requestId = `amoji:${message.message_id}`;
      const user = events.find(e => e.type.startsWith('user/') && record(record(e.data).source).rpcId === requestId);
      // A steering signal that the agent claimed during its turn reached the model there.
      if (user && message.signal === 'queued' && this.runtime.signalState) await Promise.resolve(this.runtime.signalState(context, message.message_id, 'delivered_to_model')).then(updated => { message.signal = updated.signal; }).catch(() => {});
      const accepted = message.dsh_submission === 'accepted';
      const turn = user ? [...events].reverse().find(e => e.type === 'turn/start' && e.seq <= user.seq) : undefined;
      return { ...(effect ? { effect } : {}), message, meta: visualMeta(message), host: { status: user ? 'observed' : accepted ? 'accepted' : message.dsh_submission === 'attempted' ? 'unknown' : 'prepared', requestId, ...(user ? { hostMessageId: nonempty(record(user.data).id), seq: user.seq } : {}), ...(turn ? { turnStartSeq: turn.seq } : {}) } };
```

</details>

**依据 2 · 作者声明**：[adapters/dsh/README.md:27-31](https://github.com/5101good/amoji/blob/a22c633ad9ee14353a4110461641f3f2fbfa00d3/adapters/dsh/README.md#L27-L31)

断连核对原请求与支持范围

```text
Host 连接本地共享服务；产品版本为 2.0.0，协议为 Amoji 0.1，共享 API 为 `3`，数据库为 `1`。macOS 默认数据目录为 `~/Library/Application Support/Amoji/prototype`，可用 `AMOJI_DATA_DIR` 隔离。从 1.x 升级前须停止旧服务并备份完整目录。2.0.0 使用新的 `library-0.1.sqlite`，保留旧 `library.sqlite`，不要求空目录；不支持旧库就地迁移或旧 `.amoji` 包导入。不要手改数据库版本号。卸载插件不主动删除共享库。

浏览器只使用宿主认证 RPC，模型只使用三个文字工具。`accepted` 表示宿主已接收入队，原生用户消息是否落盘仍需核对；`observed` 表示已观察到对应原生消息，图片 `rendered` 是独立的加载证据。断连或结果未知时核对原请求，避免另发。

direct tools 是 AI 图像展示的验证路径；Code Dispatch/PTC 嵌套工具不保证显示。Linux、Windows、新版 dsh 与全部模型组合尚未验证。某提供方续答会因 `reasoning_text` 兼容返回400，插件不能保证所有模型完整工具回合成功。Codex/Claude Code legacy 不在本包范围。
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
