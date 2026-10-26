# Amoji for DSH

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[833cfc8](https://github.com/5101good/amoji/tree/833cfc8a332810ef195a1e0466259ef7687b3a65/adapters/dsh)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：向 DSH 添加固定语义表情、库管理、表情包与市场发布入口。

> **核心亮点**：相对粘贴图片或普通emoji，关键增量是固定语义、版本化库与原生消息回执组合，使图像、语义和操作身份可核对；核心能力属于共享库，DSH组件贡献在宿主桥接。[Q01](#research-q01)

> **风险与缺陷**：宿主接受、消息落盘与图片渲染是不同事实，不能用accepted宣布完整送达；本地共享服务、宿主版本及不同提供方工具续答仍约束可用性。[Q03](#research-q03)

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
  - [Q01 · 固定语义表情相对普通图片的可核查增量是什么？](#detail-section-11)
  - [Q02 · 共享核心怎样连接到DSH工具与原生消息？](#detail-section-12)
  - [Q03 · 为什么接受、观察与渲染不能合并成送达？](#detail-section-13)
  - [Q04 · 共享服务和人工确认是否值得？](#detail-section-14)
  - [Q05 · 统一核对页是否减少未知结果重复操作？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向希望以图形表达固定意图、同时让模型读取明确语义的用户；合格交付包含指定版本表情、对应语义与独立的消息和显示状态。

普通图片和emoji可直接发送，但模型读到的语义与版本不稳定；人工说明可替代固定语义协议，代价是每次重复解释和自行核对送达。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 搜索与解析表情 | 查固定语义资产 | 依赖共享库和精确版本 |
| 原生发送及状态核对 | 对话内表达 | accepted、observed、rendered须分别判断 |
| 库与包管理 | 草稿、历史及导入导出 | 动作启用与安装分离 |
| 市场投稿 | 上传及审核版本 | 需设备授权和人工确认 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=24、作者指定DSH基线 | 必需 | 运行Host和Client | 新版本兼容未知 |
| API2/数据库4共享服务及四项能力 | 必需 | 库、消息和包操作 | 握手拒绝，不能靠刷新假装成功 |
| 模型提供方 | AI建议才需 | 生成文字建议 | 可手工创作；按提供方计费 |
| 市场连接及设备授权 | 发布才需 | 上传和审核 | 本地库仍可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户在隔离profile安装核对后的发布包并启动 | 共享服务能力握手通过 |
| 2 | 在选择器选固定表情并发送 | 分别核对原生消息observed与图片rendered |
| 3 | 结果未知时核对原请求 | 不另建发送操作盲重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node依赖、共享核心和本地存储，金额未知 | 安装包核对、profile隔离 | 非离线安装 |
| 持续使用 | 库与资产存储；可选模型费用未知 | 创作、预览和明确入库确认 | 只发文字意图不代表模型免费 |
| 失败恢复 | 服务重连、请求核对资源 | 查看原操作与宿主回执，时间未知 | 不自动重放未知操作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 固定语义与回执 | 版本库与Host状态区分有源码 | 跨提供方理解与显示一致率 |
| 创作和投稿 | 作者描述有完整人工确认链 | 实际创作耗时、市场价值和需求 |

> **思考**：宿主接受、消息落盘与图片渲染是不同事实，不能用accepted宣布完整送达；本地共享服务、宿主版本及不同提供方工具续答仍约束可用性。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对粘贴图片或普通emoji，关键增量是固定语义、版本化库与原生消息回执组合，使图像、语义和操作身份可核对；核心能力属于共享库，DSH组件贡献在宿主桥接。[Q01](#research-q01)

相对粘贴图片或普通emoji，关键增量是固定语义、版本化库与原生消息回执组合，使图像、语义和操作身份可核对；核心能力属于共享库，DSH组件贡献在宿主桥接。[Q01](#research-q01)

共享客户端先校验API与能力，再建立lease；断连明确中断上下文，恢复以原操作核对代替自动重放，值得借鉴。DSH适配入口小，但承担会话、模型和文件显示的多个状态边界，不能以入口LOC代表维护负担。

<a id="detail-section-5"></a>

### 1.4 主要限制

宿主接受、消息落盘与图片渲染是不同事实，不能用accepted宣布完整送达；本地共享服务、宿主版本及不同提供方工具续答仍约束可用性。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

目前建议观察。需要固定语义表情的团队可先核对共享服务和指定宿主，再做隔离试验；未知结果必须核对原请求，不能将接受入队当作完整送达。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的设计解释，效果未独立验证；未来设计假设尚未实现或验证。

- 已检查：作者 README、包清单、源码路径 adapters/dsh/README.md、adapters/dsh/index.mjs、src/dsh/host.ts、src/shared-client.ts 及固定范围 inventory；组件：adapters/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读DSH入口、共享连接和宿主提交/回执；不把作者描述的macOS验收升级为本轮宿主执行。
- 下一步：用同一固定表情和requestId覆盖断连前后、页面刷新、消息已观察但图片失败三种情形，检查重复消息和状态归因；方案未执行。

**分析版本**

- **仓库**：[5101good/amoji](https://github.com/5101good/amoji)
- **版本号**：1.1.0（[固定提交 833cfc8](https://github.com/5101good/amoji/tree/833cfc8a332810ef195a1e0466259ef7687b3a65)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是将同一操作的消息观察与渲染回执做成统一核对页，减少未知结果后的重复发送；以断连、刷新和重启下的重复数与人工核对时间检验，若回执缺失仍无法归因则不成立。[Q05](#research-q05)

用同一固定表情和requestId覆盖断连前后、页面刷新、消息已观察但图片失败三种情形，检查重复消息和状态归因；方案未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 27 | 27 | 1 | — |
| .md | source | 2 | 106 | — | — | 2145 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/5101good/amoji/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/5101good/amoji/issues?q=is%3Aissue+created%3A2026-09-23T01%3A49%3A38.790Z..2026-10-23T01%3A49%3A38.790Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/5101good/amoji/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T01%3A49%3A38.790Z..2026-10-23T01%3A49%3A38.790Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：5101good/amoji 固定组件如何完成目标任务，贡献在何种边界成立，是否适合可控试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 固定语义表情相对普通图片的可核查增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者把产品定位为人看图、模型读固定语义；本组件的增量是将共享资产版本与原生DSH消息结合，而不是另造图片模型。普通图片加文字也能表达意图，但每次需人工保证图文配对并检查消息状态。这里库历史和包管理把表达固定成可重复使用资产。需求规模和模型理解改善仍没有独立对照，因此贡献只认设计与流程，不认普遍交流效率提升。

#### 证据与依据

**依据 1 · 作者声明**：[adapters/dsh/README.md:5-25](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/adapters/dsh/README.md#L5-L25)

作者功能、安装基线和库管理说明。

<details>
<summary>查看原文（21行）</summary>

````text
面向人和 AI 的原生表情：人看图，模型读固定语义。1.1.0 以 dsh **0.1.5-rc.2** 为基线，需要 Node.js **>=24**；已有实际宿主证据的平台为 macOS arm64。

## 安装与使用

从 [GitHub Releases](https://github.com/5101good/amoji/releases) 下载并核对 `amoji-dsh-1.1.0.tgz`，在文件所在目录执行：

第一条命令为新 profile 初始化 Web 模板并显示帮助；随后安装并启动。

```sh
npx @deepseek-ai/dsh@0.1.5-rc.2 --profile amoji --from-default-profile web --help
npx @deepseek-ai/dsh@0.1.5-rc.2 plugin --profile amoji add ./amoji-dsh-1.1.0.tgz --ignore-scripts
npx @deepseek-ai/dsh@0.1.5-rc.2 --profile amoji
```

`amoji` 是示例 profile，替换为自己的名称。安装到已有 profile 时先保存工作，安装后重启。选择工作区即可从输入区打开“表情”，无需先发送普通文字。点图发送，详情只查看含义；新库的经典/办公各有24个同语义表情，共48个资产。

“管理表情”支持草稿、个人副本、不可变历史版本、归档、偏好及 `.amoji` 包导入导出。创作只有一个意图输入框；AI 文字建议默认当前会话模型，可另选宿主已配置模型。只发送文字意图和生成指令，不发送图片或会话历史。采用建议后仍需编辑、保存、图文加载预览、勾选并确认入库。手工填写无需模型请求。

界面跟随 dsh 中英语言，固定语义不会随 UI 翻译改写。内置语义为中文。模型建议按所选提供方配置计费，不自动重试。

## 数据与兼容
````

</details>

**依据 2 · 源码核查**：[src/dsh/host.ts:98-111](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/src/dsh/host.ts#L98-L111)

原生消息及显示状态是源码可核查增量。

<details>
<summary>查看原文（14行）</summary>

```text
    return [...legacy.filter(m=>!m.action_intent && !current.some(c=>c.message_id===m.message_id) && events.some(e=>references(e.data,m.message_id))),...current];
  }
  private async rows(sessionId: string, events: readonly DshEvent[]): Promise<HistoryEntry[]> {
    const messages=await this.messageRows(sessionId,events);
    if(this.collaboration && messages.some(m=>m.action_intent))await this.session(sessionId,this.lifecycle);
    return Promise.all(messages.map(async message => {
      const action = message.action_intent ? (this.collaboration ? await this.collaboration.receipt(sessionId,message) : {status:'unsupported' as const,reason:'host-context-unavailable'}) : undefined;
      if (message.direction !== 'human_to_ai') return { message, meta: visualMeta(message), host: null };
      const requestId = `amoji:${message.message_id}`;
      const user = events.find(e => e.type === 'user/message' && record(record(e.data).source).kind === 'user' && record(record(e.data).source).rpcId === requestId);
      const accepted = message.dsh_submission === 'accepted';
      const turn = user ? [...events].reverse().find(e => e.type === 'turn/start' && e.seq <= user.seq) : undefined;
      return { ...(action?{action}:{}), message, meta: visualMeta(message), host: { status: user ? 'observed' : accepted ? 'accepted' : message.dsh_submission === 'attempted' ? 'unknown' : 'prepared', requestId, ...(user ? { hostMessageId: nonempty(record(user.data).id), seq: user.seq } : {}), ...(turn ? { turnStartSeq: turn.seq } : {}) } };
    }));
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 共享核心怎样连接到DSH工具与原生消息？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

adapter先请求四项能力，失败即无法启动完整路径；随后构建ConnectedRuntime、profile身份、协作和发布服务。共享客户端通过发现、健康检查和lease建立受控连接，工具经Host注册。src/dsh/host.ts把已有消息匹配到宿主用户事件，而非把共享数据库存在当成原生落盘。本提交adapter的runtime路径由构建产物提供，研究通过同提交src模块追踪，未声称源码目录可直接装载。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.mjs:1-27](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/adapters/dsh/index.mjs#L1-L27)

适配入口与依赖注入。

<details>
<summary>查看原文（27行）</summary>

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
}
```

</details>

**依据 2 · 源码核查**：[src/shared-client.ts:31-43](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/src/shared-client.ts#L31-L43)

能力协商失败条件。

<details>
<summary>查看原文（13行）</summary>

```text
  static async connect(options: ConnectOptions = {}): Promise<SharedClient> {
    let directory = resolve(options.directory ?? dataDirectory());
    await mkdir(directory, { recursive: true, mode: 0o700 });
    directory = await realpath(directory);
    const range = options.apiRange ?? { min: API_VERSION, max: API_VERSION };
    const descriptor = await discover(directory, range);
    const identity = await health(descriptor, range);
    for (const capability of options.requiredCapabilities ?? []) {
      if (!identity.capabilities?.includes(capability)) fail('CAPABILITY_UNAVAILABLE', `共享服务缺少 ${capability}；请更新服务后重新连接`);
    }
    const client = new SharedClient(descriptor, identity, { ...options, directory });
    await client.openLease();
    return client;
```

</details>

**依据 3 · 源码核查**：[src/dsh/host.ts:247-260](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/src/dsh/host.ts#L247-L260)

工具与认证RPC注册。

<details>
<summary>查看原文（14行）</summary>

```text
export function installDsh(ctx: HostPort, runtime: AdapterRuntime, hostInstanceId: string, defineTool: (options: ToolOptions) => unknown, collaboration?: DshCollaboration, publisher?: DshPublisher): DshAdapter {
  const adapter = new DshAdapter(ctx, runtime, hostInstanceId, collaboration, publisher);
  for (const name of ['amoji_search', 'amoji_resolve', 'amoji_emit'] as const) ctx.tools.register(defineTool(adapter.tool(name)));
  ctx.effect(() => {
    const releases: Array<() => Promise<void>> = [];
    const dispose = async () => { await Promise.all(releases.splice(0).reverse().map(async release => release())); };
    try {
      releases.push(...installPackRoutes(ctx, runtime, (id, signal) => adapter.rpc('amoji/history', { sessionId: id }, signal)));
      for (const method of [...['beginLogin','loginStatus','cancelLogin','logout','drafts','create','save','upload','submit','retrySubmit','reconcile','submissions','withdraw'].map(m=>'publisher.'+m),...['search','detail','install','installStatus','collect','uncollect','remove','updateCheck','local','visual','refreshRevocations'].map(m=>'marketplace.'+m),'reconnect', 'catalog', 'search', 'history', 'visual', 'collaboration.rules', 'collaboration.enable', 'collaboration.disable', 'collaboration.disableAll', 'collaboration.capabilities', 'collaboration.receipts', 'actions', 'submit', 'submitWithAction', 'display', 'manage', 'management']) {
        const endpoint = `amoji/${method}`;
        releases.push(ctx.connection.fetch.register({ path: `/api/${endpoint}`, methods: ['POST'], requestBody: 'buffered', fetch: async request => {
          if (request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase() !== 'application/json') return new Response('content type must be application/json', { status: 415 });
          let body: unknown; try { body = await request.json(); } catch { return new Response('body is not JSON', { status: 400 }); }
          const parsed = clientRequestSchema.safeParse(body);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为什么接受、观察与渲染不能合并成送达？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Host明确按原生user事件判断observed，只有共享提交标记时仍是accepted，attempted可能unknown。显示回执又单独接受rendered/fallback/failed。这个分层限制作者宣传的送达含义，却也避免重试放大副作用。SharedClient重连注释和实现要求显式恢复并核对原请求。工程可借鉴的是操作身份贯穿状态层，而不是保证任何模型都完成工具回合。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh/host.ts:98-111](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/src/dsh/host.ts#L98-L111)

不同事实来源决定不同状态。

<details>
<summary>查看原文（14行）</summary>

```text
    return [...legacy.filter(m=>!m.action_intent && !current.some(c=>c.message_id===m.message_id) && events.some(e=>references(e.data,m.message_id))),...current];
  }
  private async rows(sessionId: string, events: readonly DshEvent[]): Promise<HistoryEntry[]> {
    const messages=await this.messageRows(sessionId,events);
    if(this.collaboration && messages.some(m=>m.action_intent))await this.session(sessionId,this.lifecycle);
    return Promise.all(messages.map(async message => {
      const action = message.action_intent ? (this.collaboration ? await this.collaboration.receipt(sessionId,message) : {status:'unsupported' as const,reason:'host-context-unavailable'}) : undefined;
      if (message.direction !== 'human_to_ai') return { message, meta: visualMeta(message), host: null };
      const requestId = `amoji:${message.message_id}`;
      const user = events.find(e => e.type === 'user/message' && record(record(e.data).source).kind === 'user' && record(record(e.data).source).rpcId === requestId);
      const accepted = message.dsh_submission === 'accepted';
      const turn = user ? [...events].reverse().find(e => e.type === 'turn/start' && e.seq <= user.seq) : undefined;
      return { ...(action?{action}:{}), message, meta: visualMeta(message), host: { status: user ? 'observed' : accepted ? 'accepted' : message.dsh_submission === 'attempted' ? 'unknown' : 'prepared', requestId, ...(user ? { hostMessageId: nonempty(record(user.data).id), seq: user.seq } : {}), ...(turn ? { turnStartSeq: turn.seq } : {}) } };
    }));
```

</details>

**依据 2 · 源码核查**：[src/dsh/host.ts:175-182](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/src/dsh/host.ts#L175-L182)

图片显示确认独立。

```text
    }
    if (method === 'display') {
      const messageId = nonempty(args.messageId); const currentMessages=await this.runtime.messages(context); const message = (await this.messageRows(sessionId,events)).find(m => m.message_id === messageId);
      if (!message || ![message.revision.visual.primary.sha256, message.revision.visual.poster?.sha256].includes(nonempty(args.hash))) fail('BINDING_MISMATCH', '显示回执不匹配消息素材');
      if (!['rendered', 'fallback', 'failed'].includes(String(args.state))) fail('INVALID_ARGUMENT', '显示状态不合法');
      signal.throwIfAborted();
      await this.runtime.acknowledge(currentMessages.some(m=>m.message_id===messageId)?context:{...context,hostInstanceId:'local'}, messageId, args.state === 'rendered' ? 'rendered' : 'fallback');
      return null;
```

**依据 3 · 源码核查**：[src/shared-client.ts:63-80](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/src/shared-client.ts#L63-L80)

断连传播与显式核对恢复。

<details>
<summary>查看原文（18行）</summary>

```text
        let reason: unknown = new ServiceError('CONNECTION_CLOSED', '共享服务连接已断开，请重新连接并核对原会话');
        try { while (!(await reader.read()).done) {} } catch (error) { reason = error; }
        finally {
          if (client.lease === lease) client.closed = true;
          disconnected.abort(new ServiceError('CONNECTION_CLOSED', `共享服务连接已断开，请重新连接并核对原会话（${reason instanceof Error ? reason.name : '连接结束'}）`));
        }
      })();
    } catch (error) { client.lease.abort(); throw error; }
    finally { clearTimeout(deadline); }
  }
  /** Explicit recovery only: callers reconcile their original request; no operation is replayed. */
  async reconnect(): Promise<void> {
    if (this.disposed) fail('CONNECTION_CLOSED', '插件已卸载，不能恢复旧连接');
    if (this.reconnecting) return this.reconnecting;
    this.reconnecting = (async () => {
      const range = this.options.apiRange ?? { min: API_VERSION, max: API_VERSION };
      // A healthy lease is shared by concurrent operations and must not be replaced.
      if (!this.closed) {
```

</details>

#### 缺口

- 多宿主和多提供方工具回合一致性未知
  **影响**：不能由局部回执推断完整交流成功
  **进一步探讨**：用相同requestId和图片资产观察各状态，并收集提供方失败原因。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 共享服务和人工确认是否值得？

**研究主题**：效果与总成本、采用判断

#### 完整回答

创作、预览、勾选入库、市场投稿都是用户需要承担的步骤，适合反复使用固定表达资产的人群，偶发图片发送未必划算。安装依赖不随发布包离线附带，AI建议按已配置提供方计费，卸载不主动删除共享库，退出须另做资产和凭据管理。当前建议观察，优先核对环境和关键状态，而非扩大安装范围；没有耗时与合格表达样本，不能估算单位交流成本。

#### 证据与依据

**依据 1 · 作者声明**：[adapters/dsh/README.md:21-37](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/adapters/dsh/README.md#L21-L37)

创作确认、模型费用、兼容边界与分发条件。

<details>
<summary>查看原文（17行）</summary>

```text
“管理表情”支持草稿、个人副本、不可变历史版本、归档、偏好及 `.amoji` 包导入导出。创作只有一个意图输入框；AI 文字建议默认当前会话模型，可另选宿主已配置模型。只发送文字意图和生成指令，不发送图片或会话历史。采用建议后仍需编辑、保存、图文加载预览、勾选并确认入库。手工填写无需模型请求。

界面跟随 dsh 中英语言，固定语义不会随 UI 翻译改写。内置语义为中文。模型建议按所选提供方配置计费，不自动重试。

## 数据与兼容

Host 连接本地共享服务，要求 API 2、数据库4，以及 `dsh-native-delivery-v1`、`dsh-reliable-delivery-v1`、`library-management-v1`、`packs-v1`。macOS 默认数据目录为 `~/Library/Application Support/Amoji/prototype`，可用 `AMOJI_DATA_DIR` 隔离。升级保留共享数据和宿主会话；卸载插件不主动删除共享库。

浏览器只使用宿主认证 RPC，模型只使用三个文字工具。`accepted` 表示宿主已接收入队，原生用户消息是否落盘仍需核对；`observed` 表示已观察到对应原生消息，图片 `rendered` 是独立的加载证据。断连或结果未知时核对原请求，避免另发。

direct tools 是 AI 图像展示的验证路径；Code Dispatch/PTC 嵌套工具不保证显示。Linux、Windows、新版 dsh 与全部模型组合尚未验证。某提供方续答会因 `reasoning_text` 兼容返回400，插件不能保证所有模型完整工具回合成功。Codex/Claude Code legacy 不在本包范围。

## 包内容与许可

包含 Host/Client、共享核心、基础资产、构建信息与许可清单，不嵌入 `node_modules`、Sharp `.node` 或 libvips 动态库；宿主包管理器安装依赖，因此不是离线安装包。Client 使用宿主 React，Host 使用宿主服务。

代码 MIT；基础素材 CC0-1.0；第三方依赖保留各自许可。参见包内 `LICENSE`、`NOTICE`、`THIRD_PARTY.json`、`THIRD_PARTY_LICENSES/` 和 `assets/base-library/`。
```

</details>

**依据 2 · 作者声明**：[adapters/dsh/README.md:49-53](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/adapters/dsh/README.md#L49-L53)

投稿与凭据边界。

```text
### 从 dsh 投稿

在管理页的「导入与导出」先确认本地表情包，再打开「发布到市场」。向导保存说明、许可和可选动作；纯视觉包可以不带动作。浏览器登录后核对 dsh 显示的设备名称及短码，勾选确认并授权。配对五分钟内有效，取消后需重新开始；无需修改模型设置。

完整预览后上传、校验并明确投稿。结果不明时点击「核对原操作与审核状态」，不要另建投稿。退回理由显示在原草稿；选择修订后的本地包，创建新版本重新审核。断网保留已保存草稿。访问凭据仅保存在当前 dsh profile 的 `plugins/amoji/publisher` 私有目录，不进入网页、包、模型输入或共享库；不要分享该目录。注销设备会撤销授权。
```

#### 缺口

- 实际资产复用频率、人工核对时间未知
  **影响**：采用价值仍偏设计解释
  **进一步探讨**：比较固定表达任务中人工图片流程与插件的误配、重复及总耗时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 统一核对页是否减少未知结果重复操作？

**研究主题**：新假设与验证

#### 完整回答

这是未验证设计。既有Host已区分原生消息观察与渲染，客户端又知道连接是否失效，因而可围绕原requestId汇总完整状态。增量是用户无需跨多个界面判断是否应重发。最小实验在三种断连时刻比较统一页与现状的重复消息数和人工核对时间；若仍缺失宿主事件或没有更低重复率，不应扩大为可靠送达承诺。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh/host.ts:216-242](https://github.com/5101good/amoji/blob/833cfc8a332810ef195a1e0466259ef7687b3a65/src/dsh/host.ts#L216-L242)

原请求匹配、提交与未知状态为统一核对提供推导基础。

<details>
<summary>查看原文（27行）</summary>

```text
    // Read-only preflight happens before creating the atomic message/intent pair.
    if(action){
      const previous=(await this.runtime.messages(context)).find(m=>m.action_intent?.requestId===requestId);
      if(!previous){await this.collaboration!.rules(sessionId);const choice=(await this.runtime.collaboration!.choices(context,ref)).find(c=>JSON.stringify(c.selection)===JSON.stringify(action));if(!choice)fail('ACTION_UNAVAILABLE','此精确动作不可用于所选表情');this.collaboration!.validate(sessionId,choice,ref);}
    }
    const message = await this.runtime.receive(context, ref, requestId, action); signal.throwIfAborted();
    const existing = (await this.rows(sessionId, await this.inspect(sessionId, signal))).find(r => r.message.message_id === message.message_id)!;
    if (existing.host!.status !== 'prepared' || (message.action_intent?.checkpoint && existing.action?.status==='unknown')) return existing;
    await this.flush(session); signal.throwIfAborted();
    if(message.action_intent)await this.collaboration!.prepare(sessionId,message);
    if (!this.runtime.dshAttempted || !this.runtime.dshAccepted) fail('CAPABILITY_UNAVAILABLE', '共享服务不支持可靠投递，请升级服务后重新连接');
    // The single writer claims dispatch before crossing the host boundary. Any
    // later uncertainty is reconciled by native rpcId, never by another prompt.
    try {
    if (!await this.runtime.dshAttempted(context, message.message_id)) {
      return (await this.rows(sessionId, await this.inspect(sessionId, signal))).find(r => r.message.message_id === message.message_id)!;
    }
      signal.throwIfAborted();
      if(message.action_intent)this.collaboration!.dispatched(sessionId,message);
      const result = await this.ctx.sessionController.prompt({ sessionId, requestId: `amoji:${message.message_id}`, mode: 'queue', content: [{ type: 'text', text: expressionMessageText(message.revision) }] }, signal);
      signal.throwIfAborted();
      if (result.accepted !== true) fail('DSH_NOT_ACCEPTED', '宿主未接受输入');
      await this.flush(session); signal.throwIfAborted();
      await this.runtime.dshAccepted(context, message.message_id); signal.throwIfAborted();
      return (await this.rows(sessionId, await this.inspect(sessionId, signal))).find(r => r.message.message_id === message.message_id)!;
    } catch {
      if(message.action_intent)this.collaboration!.uncertain(sessionId,message);
```

</details>

#### 缺口

- 统一页效果尚未验证
  **影响**：不能记作已实现功能
  **进一步探讨**：用故障注入对照原有核对路径后再决定。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
