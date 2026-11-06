# WorkBuddy to DSH

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[5ca121b](https://github.com/Ianzhyh/workbuddy-to-dsh/tree/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin)

<!-- BEGIN META -->
[![GitHub ★ 63](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=63&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ianzhyh/workbuddy-to-dsh)
<!-- END META -->

> **功能**：把 WorkBuddy 账号模型接入 DSH，管理本地桥、模型目录、账号用量和媒体工具。

> **亮点**：把独立桥、动态模型目录、账号资源和工具接到DSH原生Provider与面板，减少分散手配和跨界面交接；构建/账号探测与取消链路有具体实现。模型、配额和网络稳定性仍来自上游，净收益未实测。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：自动管理不等于无副作用。启动可迁移旧路由并自动接入搜索，媒体工具会直接提交任务；传输失败重试可能遇上游已受理而再次计费，账号接管也须核钱包。当前真实请求和账本未验证，先保留观察。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 谁使用哪类账号完成什么任务，模型请求如何进入上游？](#detail-section-11)
  - [Q02 · 工具、媒体和本地接口有哪些权限及失败边界？](#detail-section-12)
  - [Q03 · 相比独立客户端和手动配置，增量、依赖及成本是什么？](#detail-section-13)
  - [Q04 · 对谁值得试用，如何验证最关键假设？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供已有WorkBuddy账号的Windows DSH用户在同一会话中使用模型与查看账号资源，具体输入到结果链路见 [Q01](#research-q01)。

替代是保留独立WorkBuddy客户端，或手动启动OpenAI兼容桥并配置DSH模型。比较的是集成步骤和状态管理，不将上游模型能力归为本插件贡献。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| workbuddy Provider | 在DSH调用账号模型 | 上游账号、桥、协议适配必需，不是本地推理 |
| workbuddy_status | 查询桥及账号资源状态 | 以当前账号为准，不构成服务可用验收 |
| workbuddy_models | 查看目录 | 目录声明与当前模型调用结果分开 |
| workbuddy_usage | 查询用量 | 账本覆盖和现金价格不能混同 |
| workbuddy_checkin | 查看或领取签到 | claim=true有上游副作用 |
| workbuddy_web_search | 调桥搜索 | 上游可用性与额度另核 |
| workbuddy_generate_video | 提交视频 | 有计费与结果未知风险，保存任务ID |
| workbuddy_video_status | 查询视频任务 | 不应把未知结果当未受理 |
| workbuddy_generate_image | 提交图片 | 输入先校验，仍需核账号和计费 |
| workbuddy_image_status | 查询图片任务 | 按已有任务核对，不等于重新提交 |
| workbuddy_bridge | 启停或重启桥、确保控制台 | 可改变本地进程，依赖可信健康身份 |
| workbuddy命令与设置页 | 管理登录、目录与搜索接入 | 包含配置写入与迁移，不全为只读 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Windows、Node18+、兼容DSH服务 | 声明启动必需 | 加载Provider和本地进程 | 本轮未验证宿主组合，包os为win32 |
| WorkBuddy/CodeBuddy账号与可访问上游 | 请求必需 | 模型鉴权和资源额度 | 登录失效或无额度不能办结，不是本地模型 |
| 桥与控制台完整脚本 | 桥必需，部分面板写入需控制台 | 请求转发和账号管理 | 缺脚本/端口冲突明确失败，需核实际仓库/vendor来源 |
| 宿主settings与credentials | 自动搜索配置必需 | 独立凭据引用和可恢复接入 | 服务未就绪等待，不应手工覆盖已有key |
| 媒体接口和对应额度 | 媒体操作必需 | 图像/视频任务 | 提交可计费，需保留ID核对，不等于普通聊天 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户在隔离profile核账号和配置备份 | 明确桥与搜索来源，自动接入按需关闭 |
| 加载 | 插件探测桥并注册Provider | 构建和账号匹配，端口非本服务则拒绝抢占 |
| 请求 | 模型输入经桥访问上游 | 账本账号、模型与输出一致；错误保留明确终态 |
| 验收 | 用户核钱包、取消和已知任务状态 | 结果未知先查ID与账本，不新建重试；需退出时先恢复配置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 账号套餐、桥和备份资源，金额未知 | 登录、宿主与桥构建核对 | 无配置耗时实测 |
| 持续使用 | 模型/媒体额度、本地进程、账本与轮询 | 核账号、模型参数和结果 | 积分倍率不等于现金单价 |
| 失败恢复 | 重试可能重复受理和计费 | 查任务ID、账本、令牌及端口 | 不保证取消后无上游成本 |
| 退出 | 必要备份和未结束任务资源 | 恢复搜索分节/凭据引用、旧路由和进程 | 删除插件不等于全部回滚或注销账号 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| DSH模型接入 | Provider到本地桥再到上游接线 | 当前账号和模型实际可用 |
| 生命周期 | 核构建与账号、拒绝抢占非本服务 | 目标Windows部署全组合 |
| 取消和失败 | 信号贯穿响应体并返回错误终态 | 上游停止与扣费是否同步 |
| 工具副作用 | 媒体提交和状态查询有明确入口 | 合格媒体效果、重复任务与净成本 |

无合格任务数量、现金和人工对照，不计算单位成本。

> **思考**：自动管理不等于无副作用。启动可迁移旧路由并自动接入搜索，媒体工具会直接提交任务；传输失败重试可能遇上游已受理而再次计费，账号接管也须核钱包。当前真实请求和账本未验证，先保留观察。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把独立桥、动态模型目录、账号资源和工具接到DSH原生Provider与面板，减少分散手配和跨界面交接；构建/账号探测与取消链路有具体实现。模型、配额和网络稳定性仍来自上游，净收益未实测。见 [Q01](#research-q01)、[Q03](#research-q03)。

桥复用核构建与登录配置、响应体持续保留取消信号、媒体输入先校验再提交，是具体可借鉴设计。风险在重试受理未知与多配置生命周期，不能用本地第一跳或自定义面板头推导完整安全边界。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

自动管理不等于无副作用。启动可迁移旧路由并自动接入搜索，媒体工具会直接提交任务；传输失败重试可能遇上游已受理而再次计费，账号接管也须核钱包。当前真实请求和账本未验证，先保留观察。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先保持观察；若继续验证，使用独立profile、单一已知账号和低额度文本请求核钱包与账本，媒体和跨账号接管另验。结果未知先查任务而非重发，出现账号或配置不符就退回原客户端。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查固定版本Provider、桥的请求发送、主要取消/重试和工具副作用。作者兼容与验收叙述不作为本轮运行证据；采用结论为观察，对账方案是未来假设。

- 已检查：作者 README、包清单、源码路径 dsh-plugin/package.json、dsh-plugin/README.md、dsh-plugin/lib/index.js、dsh-plugin/lib/adapter.mjs、dsh-plugin/lib/bridge.mjs、dsh-plugin/lib/routes.mjs、dsh-plugin/lib/tools.mjs、dsh-plugin/lib/web-search-config.mjs、dsh-plugin/vendor/bridge/workbuddy-bridge.mjs 及固定范围 inventory；组件：dsh-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查Provider注册、消息发送与SSE、桥凭据选择和请求发送、取消重试、部分媒体工具、自动搜索与迁移。未全审凭据加密、浏览器授权、所有媒体/搜索实现和客户端面板，也未验证真实宿主认证、上游可用性或包与源码对应。
- 下一步：独立profile固定账号/模型，记录脱敏请求与账本；中断后先查已知任务；对账假设使用受控响应丢失对照。未执行目标代码、登录或付费调用。

**分析版本**

- **仓库**：[Ianzhyh/workbuddy-to-dsh](https://github.com/Ianzhyh/workbuddy-to-dsh)
- **版本号**：1.22.5（[固定提交 5ca121b](https://github.com/Ianzhyh/workbuddy-to-dsh/tree/5ca121bfed844c784ed559d4b14af2126acb56eb)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究将逻辑请求、每次尝试、账号和上游任务状态联结的对账记录，在结果未知时先核对再决定重试。它相对盲目再发多一层受理判断，但需上游可查询身份或幂等协议。用响应丢失场景测重复任务、扣费、恢复等待与人工成本；无法关联上游状态或成本更高会削弱假设。尚未实现验证。见 [Q04](#research-q04)。

独立profile固定账号/模型，记录脱敏请求与账本；中断后先查已知任务；对账假设使用受控响应丢失对照。未执行目标代码、登录或付费调用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 15 | 7416 | 5284 | 1868 | — |
| .js | source | 2 | 11802 | 9673 | 1931 | — |
| .md | source | 1 | 694 | — | — | 13534 |
| .mjs | test | 38 | 12762 | 10230 | 1939 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Ianzhyh/workbuddy-to-dsh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=16&color=737b86&logo=github)](https://github.com/Ianzhyh/workbuddy-to-dsh/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=16&color=737b86&logo=github)](https://github.com/Ianzhyh/workbuddy-to-dsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地桥如何把账号模型接入DSH，凭据、工具和失败恢复的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用哪类账号完成什么任务，模型请求如何进入上游？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它面向已有WorkBuddy或CodeBuddy账号、希望在DSH中继续使用同一模型资源的用户。作者的预期是免去手配API地址和双份YAML，通过桌面登录态或插件浏览器授权接入；这不是新模型，也不是无需上游账号的服务。合格结果必须是指定账号、模型和参数实际处理DSH消息，响应和工具调用回到宿主，不能只以模型出现在选择器为成功。

宿主apply建立BridgeSupervisor及带本地令牌的BridgeClient，再注册workbuddy Provider。适配器把DSH消息、图像和工具描述转为OpenAI形式，保留显式temperature=0，按模型输出上限收敛max_tokens，再调用桥的chat。桥在请求时解析凭据，必要时刷新，然后向账号endpoint发送鉴权头和请求。返回SSE被逐块翻译为DSH文本、思考和工具调用块。工具调用只是模型提出的宿主动作，真正执行仍由DSH工具系统承担，不能称上游模型已自行执行本地命令。

本地桥和控制台是两个独立进程。桥复用时检查构建指纹和登录文件，不匹配才走重启；未授权或其他进程占端口时拒绝抢占。插件宣称Windows和Node18+，包的os也限定win32。本次未用账号运行，所以模型目录、倍率、上游可用性与兼容仍不作当前事实。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-plugin/package.json:1-30](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/package.json#L1-L30)

包形态、Node和Windows声明。

<details>
<summary>查看原文（30行）</summary>

```text
{
  "name": "dsh-plugin-workbuddy",
  "version": "1.22.5",
  "private": true,
  "description": "DeepSeek Harness 插件：把本机 WorkBuddy 的模型（桌面端登录或插件内浏览器授权）原生接进 dsh —— 自动管理本地桥、以 llm 适配器注册 workbuddy 路由、提供工具/命令，并在设置里带一个 WorkBuddy 面板。",
  "type": "module",
  "license": "MIT",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "scripts",
    "vendor",
    "cordis.patch.yml",
    "README.md"
  ],
  "engines": {
    "node": ">=18"
  },
  "os": [
    "win32"
  ],
  "keywords": [
    "deepseek-harness",
    "dsh-plugin",
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/lib/index.js:934-962](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/index.js#L934-L962)

Supervisor和带本地令牌的Client接线。

<details>
<summary>查看原文（29行）</summary>

```text
  const initialAccountState = readBridgeAccountState(projectRoot);
  const followDesktop = Boolean(initialAccountState.authFile);
  const supervisor = new BridgeSupervisor({
    projectRoot: projectRoot || process.cwd(),
    host: config.bridgeHost,
    port: config.bridgePort,
    token: config.localToken,
    authFile: initialAccountState.authFile || config.authFile || '',
    followAuthFile: followDesktop ? 'auto' : '',
    followUid: followDesktop ? initialAccountState.desktopUid : '',
    autoCheckin: config.autoCheckin !== undefined ? config.autoCheckin : initialAccountState.auto,
    autoStart: config.autoStart,
    nodePath: config.nodePath || undefined,
    timeoutMs: 8000,
    // 插件 config / .env / 进程环境三处的凭据来源设置都注入桥，启动方之间不漂移。
    env: {
      ...childBaseEnv,
      WORKBUDDY_DATA_DIR: runtimeDataDir(),
      ...(config.credentialSource ? { WORKBUDDY_CREDENTIAL_SOURCE: config.credentialSource } : {}),
      ...(config.credentialStore ? { WORKBUDDY_CREDENTIAL_STORE: config.credentialStore } : {}),
      ...(config.credentialDir ? { WORKBUDDY_CREDENTIAL_DIR: config.credentialDir } : {}),
      ...(config.loginRegion ? { WORKBUDDY_LOGIN_REGION: config.loginRegion } : {}),
    },
    onLog: (line) => log(line),
  });
  const client = new BridgeClient({
    baseUrl: supervisor.baseUrl,
    token: config.localToken,
    timeoutMs: 8000,
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/lib/index.js:1280-1289](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/index.js#L1280-L1289)

实际注册LLM适配器。

<details>
<summary>查看原文（10行）</summary>

```text
  // ── 2. 注册原生 LLM 路由 ───────────────────────────────────────────────
  // `ctx.llm` 的访问**必须**走属性（服务代理会把 this.ctx 绑到调用方 fiber），
  // 提前取到局部变量再在异步重试里调用，绑定关系保持不变。
  const llm = ctx.llm;
  let adapterHandle = null;

  const registerRoute = (providerName) => {
    adapterHandle = llm.registerAdapter([providerName], adapter);
    state.route = { registered: true, provider: providerName, error: '', fallback: providerName !== config.provider };
    return adapterHandle;
```

</details>

**依据 4 · 源码核查**：[dsh-plugin/lib/adapter.mjs:1200-1256](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/adapter.mjs#L1200-L1256)

消息、图片和工具描述转为请求并调用本地桥。

<details>
<summary>查看原文（57行）</summary>

```text
    // ── 组装 OpenAI 请求 ────────────────────────────────────────────────
    let payload;
    try {
      const messages = [];
      if (typeof options.system === 'string' && options.system.length) {
        messages.push({ role: 'system', content: options.system });
      }
      const resolveImage = (ref) => this.resolveImageCached(ref);
      // 历史消息之间没有依赖，一起组包：多图会话不必串行等每一张图读完。
      const converted = await Promise.all(
        (options.messages || []).map((message) => toWireMessage(message, resolveImage)),
      );
      messages.push(...converted);
      payload = { model, messages: sanitizeWire(messages), stream: true };
      const tools = toWireTools(options);
      if (tools.length) payload.tools = tools;
      // 参数优先级：调用方显式给的 > 该模型自己的默认 > 插件全局默认 > 不发。
      // 刻意不用 ?? 链合并成一层：显式 undefined 与"没配"是同一件事，
      // 但显式 0（temperature=0 是合法值）必须被保留。
      const perModel = this.modelParams?.[model] && typeof this.modelParams[model] === 'object'
        ? this.modelParams[model]
        : {};
      const hasCallerTemp = typeof options.temperature === 'number';
      const temperature = hasCallerTemp
        ? options.temperature
        : (typeof perModel.temperature === 'number' ? perModel.temperature : this.defaults.temperature);
      if (typeof temperature === 'number') payload.temperature = temperature;
      const callerMax = typeof options.maxTokens === 'number' && options.maxTokens > 0;
      const maxTokens = callerMax
        ? options.maxTokens
        : (Number(perModel.maxTokens) > 0 ? Number(perModel.maxTokens) : this.defaults.maxTokens);
      // 最后一道按模型上限收敛：dsh 可能把旧的/手填的更大的值当“显式值”传进来，
      // 直接发给上游只会 400。目录还没加载时不知道上限，保持原值不猜。
      const rawHit = this.catalogCache.models.find((m) => m && m.id === model);
      const modelMaxOutput = Number(rawHit?.max_output_tokens) || 0;
      const fittedMaxTokens = modelMaxOutput && typeof maxTokens === 'number' && maxTokens > modelMaxOutput
        ? modelMaxOutput
        : maxTokens;
      if (typeof fittedMaxTokens === 'number' && fittedMaxTokens > 0) payload.max_tokens = fittedMaxTokens;
      // 推理强度：选择器里用户选的（options.reasoningEffort）优先；其次该模型的
      // 默认；最后全局默认。都没有就完全不发 —— 上游对未知/无意义参数的容忍度
      // 不一，不猜（与 max_tokens/temperature 同一原则）。
      const reasoningEffort = typeof options.reasoningEffort === 'string' && options.reasoningEffort
        ? options.reasoningEffort
        : (typeof perModel.reasoningEffort === 'string' && perModel.reasoningEffort
          ? perModel.reasoningEffort
          : this.defaults.reasoningEffort);
      if (reasoningEffort) payload.reasoning_effort = reasoningEffort;
      if (Array.isArray(options.stop) && options.stop.length) payload.stop = options.stop;
    } catch (error) {
      yield { type: 'finish', reason: { kind: 'error', failure: { message: `请求组装失败：${error?.message || error}`, code: CODE.INVALID } } };
      return;
    }

    let res;
    try {
      res = await client.chat(payload, { signal });
```

</details>

**依据 5 · 源码核查**：[dsh-plugin/vendor/bridge/workbuddy-bridge.mjs:5624-5651](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/vendor/bridge/workbuddy-bridge.mjs#L5624-L5651)

实际解析凭据并向上游endpoint发送。

<details>
<summary>查看原文（28行）</summary>

```text
async function callUpstream(bodyString, model, conversationId, clientSignal, { skipRateLimit = false } = {}) {
  // 限流闸门（opt-in；默认关）。放在最前：超限的请求连凭据都不读、更不打上游。
  // 限流桶按调用方分（local / 各 client key）—— B2 凭据分层的一部分。
  // 11128 的兜底重试是**同一次逻辑请求**，不能再占一个许可（RPM=1 时会白等 60s）。
  if (!skipRateLimit) await acquireRateSlot(clientSignal, requestScope.getStore()?.client || 'local');
  // 上游开始前的时刻戳（供端点计算 `X-WorkBuddy-Overhead-Ms`：
  // overhead = 上游请求发出前，桥自身做的前置处理耗时 —— 鉴权、读凭据、
  // payload 归一化、Anthropic→OpenAI 翻译。**不含限流排队**（那是我们主动
  // 让请求等的）也**不含上游等待**（那是上游的耗时）—— 口径精确、可复现。
  const upEnter = Date.now();

  // 凭据来源：api-key（显式覆盖）→ 桌面端 → 插件登录（auto，见 resolveAuth）。
  let auth = await resolveAuth();
  if (auth.source !== 'api-key' && auth.refresh && auth.expiresAt - REFRESH_SKEW_MS < Date.now()) {
    const next = await refreshAuth(auth);
    if (next) auth = next;
  }

  const attempt = (a) => {
    // WORKBUDDY_TIMEOUT_MS > 0 时给整个上游往返加超时（0/未设 = 不限，
    // LLM 长回答需要）；与客户端取消信号合并。
    const timeoutSignal = UPSTREAM_TIMEOUT_MS > 0 ? AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) : null;
    const signal = combineAbortSignals([clientSignal, timeoutSignal]);
    return upstreamRequest(`${a.endpoint}${CHAT_PATH}`, {
      headers: buildChatHeaders(a, model, conversationId),
      body: bodyString,
      signal,
    }).then(shimResponse);
```

</details>

**依据 6 · 源码核查**：[dsh-plugin/lib/adapter.mjs:1343-1357](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/adapter.mjs#L1343-L1357)

SSE按块翻译到宿主输出。

<details>
<summary>查看原文（15行）</summary>

```text
      for (;;) {
        const { done, value } = await readNext();
        if (done) break;
        tail += decoder.decode(value, { stream: true });
        const lines = tail.split('\n');
        tail = lines.pop() ?? '';
        for (const line of lines) {
          for (const chunk of translator.pushLine(line)) yield chunk;
        }
        if (tail.length > 200_000) tail = tail.slice(-8192); // 上游不按行收尾时的兜底
      }
      if (tail.trim()) {
        for (const chunk of translator.pushLine(tail)) yield chunk;
      }
      for (const chunk of translator.finish()) yield chunk;
```

</details>

**依据 7 · 源码核查**：[dsh-plugin/lib/bridge.mjs:570-603](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/bridge.mjs#L570-L603)

复用前核构建和账号配置，其他端口服务不抢占。

<details>
<summary>查看原文（34行）</summary>

```text
  async #ensure({ restart, signal, readyTimeoutMs, authFile }) {
    let status = await this.probe(signal);
    if (status.state === 'aborted') {
      return { ok: false, started: false, reused: false, state: 'aborted', error: status.error };
    }
    let restartReason = '';
    if (status.state === 'running' && !restart) {
      /*
       * 复用前先核对两件事 —— 任何一件不成立都必须重启，否则用户升级后
       * 会继续被旧进程服务：
       *   1. 构建指纹：端口上的是不是当前磁盘脚本（旧桥没有 build 字段）；
       *   2. 登录文件：端口上的桥是不是按我们想要的账号启动的。
       */
      const diff = this.buildDiff(status.health);
      if (diff.stale) {
        restartReason = `bridge build changed (${diff.actual || 'unknown'} -> ${diff.expected})`;
      }
      const desiredAuth = authFile || this.authFile;
      if (!restartReason && desiredAuth) {
        const norm = (p) => String(p || '').replace(/\\/g, '/').toLowerCase();
        const want = norm(desiredAuth);
        const seen = [norm(status.health?.authFile), norm(status.health?.authFilePinned)];
        if (!seen.includes(want)) {
          restartReason = `bridge auth file changed (${desiredAuth})`;
        }
      }
      if (!restartReason) {
        return { ok: true, started: false, reused: true, state: 'running', health: status.health };
      }
      this.onLog(restartReason + '; restarting bridge');
    }
    if (status.state === 'unauthorized' || status.state === 'foreign') {
      // 端口被别人占着：不抢，如实报错（抢端口比报错危险得多）
      return { ok: false, started: false, reused: false, state: status.state, error: status.error };
```

</details>

#### 缺口

- 没有真实账号、目标模型和DSH宿主的本轮请求结果。
  **影响**：不能声称当前接入可用或倍率适用于任何套餐。
  **进一步探讨**：在用户授权的独立profile里固定账号和模型，捕获脱敏请求、响应与账本归属后再扩大。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具、媒体和本地接口有哪些权限及失败边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

“只连本机”描述的是DSH到桥的第一跳，桥会把消息送至账号上游，不能理解为数据不离机。桥管理接口与普通客户端key分层，identifyClientId未识别会401；面板写操作另要求x-workbuddy-panel头。这是本组件门禁，宿主Web监听、认证和同源策略仍是外部前提，自定义头本身不是用户身份认证。

工具具备写副作用。签到claim=true会领取积分；视频和图片工具验证输入后直接向桥提交任务，返回任务ID再查询，并无该execute内二次人工确认。桥管理工具可启停进程。当前账号与积分钱包因此需要在调用前由用户核对，不能因这些工具在状态面板旁边就统称只读。媒体提交前类型不合会拒绝，避免静默丢图变成另一任务；但请求发出后网络结果未知时，不应直接重新提交并假定未计费。

取消信号从适配器传到本地fetch并保留到响应体结束，迭代器提前退出在finally取消reader。中断时已生成内容保留，补块结束与error/aborted终态，不是完整成功。桥对连接reset/EPIPE重试一次，源码自己说明上游极端情况下已受理可能重复计费；这限制了“自动恢复无损”的说法。401/403先刷新，随后默认只让同账号另一凭据接管，显式any才可能换钱包。完整凭据加密和浏览器授权协议未在本次全部审计，因此不作凭据安全认证。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/lib/routes.mjs:75-85](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/routes.mjs#L75-L85)

面板写入仅加自定义头门禁，宿主身份仍需另看。

<details>
<summary>查看原文（11行）</summary>

```text
export function createRouteTable(deps) {
  const {
    snapshot, supervisor, consoleSupervisor, client, adapter, paths, provider, log,
    onUpstreamMutation = () => {}, onWritePrefs = () => {}, notifyAdaptersUpdated = () => false,
    enableWebSearch = async () => { throw new Error('web search configuration is unavailable'); },
    verifyWebSearch = async () => { throw new Error('web search verification is unavailable'); },
    revertWebSearch = async () => { throw new Error('web search restore is unavailable'); },
  } = deps;

  /** 写操作的准入检查。 */
  const guard = (req) => req.headers['x-workbuddy-panel'] === '1';
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/vendor/bridge/workbuddy-bridge.mjs:11444-11478](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/vendor/bridge/workbuddy-bridge.mjs#L11444-L11478)

未识别客户端401，管理接口区分local与普通key。

<details>
<summary>查看原文（35行）</summary>

```text
     * 详见 handlePreflight 的说明。
     */
    if (handlePreflight(req, res)) return;
    /*
     * 令牌**始终必需**。
     *
     * 旧写法是 `if ((LOCAL_TOKEN || CLIENT_KEY_HASHES.size) && ...)` —— 未配置令牌时
     * 整个分支不执行，等于「不配令牌就不鉴权」。LOCAL_TOKEN 现在永远非空
     * （未配置时自动生成，见 LOCAL_TOKEN 定义），所以这里可以直接判 null。
     * 保留 `CLIENT_KEY_HASHES.size` 只是为了让「只配了 client key」的语义清楚。
     */
    if (identifyClientId(req) === null) {
      // 带着排查指引返回（见 unauthorizedBody 的说明）；**不含真实令牌**。
      // API-key-404 的失败同样要落账，否则"客户端为什么连不上"在控制台上
      // 完全不可见 —— 用户只能看到一个 401，账本上一片空白。
      recordRequest({
        model: '',
        stream: false,
        ms: 0,
        ok: false,
        status: 401,
        code: null,
        error: 'bad or missing token (client not identified)',
      });
      return json(res, 401, unauthorizedBody());
    }

    /*
     * 管理面只认 local（LOCAL_TOKEN）。
     *
     * client key 是给普通 OpenAI 客户端用的：能聊天、列模型就够了。旧实现里
     * 它同样能切凭据来源、切换 active 账号、删插件凭据、发起设备码登录、
     * 清空账本 —— 只要客户端配置泄漏一把 key，就能切走别人的钱包或清掉历史。
     */
    const managementRequest = url.pathname.startsWith('/v1/auth/')
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/lib/tools.mjs:482-501](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/tools.mjs#L482-L501)

签到claim直接调用上游能力。

<details>
<summary>查看原文（20行）</summary>

```text
  const checkinTool = textTool({
    name: 'workbuddy_checkin',
    description: '查看 WorkBuddy 每日签到状态与连续天数；claim=true 时立即领取当日签到积分。',
    parameters: {
      type: 'object',
      properties: {
        claim: { type: 'boolean', description: 'true = 立即领取今日签到（会消耗一次上游请求）' },
      },
      additionalProperties: false,
    },
    async execute(args, exec) {
      const claim = args?.claim === true;
      // 桥当前账号（用于归属标注）。**容错取**：快照失败不应炸掉签到主流程，
      // 那样归属提示最多缺席一行。
      const state = await snapshot({ signal: exec?.signal }).catch(() => ({}));
      // 桥凭据异常（degraded）时 checkin 接口会回 502 —— 把它转成可读的
      // 修法提示，而不是向 agent 抛裸异常（那只会显示一个无上下文的错误码）。
      let result;
      try {
        result = await client.checkin({ claim, signal: exec?.signal });
```

</details>

**依据 4 · 源码核查**：[dsh-plugin/lib/tools.mjs:630-668](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/tools.mjs#L630-L668)

视频输入校验后直接提交任务，调用含取消信号。

<details>
<summary>查看原文（39行）</summary>

```text
    async execute(args, exec) {
      /*
       * 先把图片输入归一化。这一步**在调用桥之前**做，且失败就直接返回说明：
       * 原先用 `typeof === 'string'` 静默过滤，模型把 first_frame 写成
       * `{path: …}` 时图片被丢掉，请求退化成文生视频却照样计费。
       */
      let firstFrame;
      let lastFrame;
      let references;
      try {
        firstFrame = args?.first_frame === undefined || args.first_frame === null
          ? ''
          : imageInputString(args.first_frame, 'first_frame');
        lastFrame = args?.last_frame === undefined || args.last_frame === null
          ? ''
          : imageInputString(args.last_frame, 'last_frame');
        references = imageInputList(args?.references, 'references');
      } catch (error) {
        return `视频参数无法识别，没有提交（未计费）：${error.message}
修法：图片输入统一用字符串（本地绝对路径 / 公网 https URL / data URI / miora fileKey），然后原样重试本次提交。`;
      }
      if (args?.prompt !== undefined && args?.prompt !== null && typeof args.prompt !== 'string') {
        return '视频 prompt 必须是字符串；这次没有提交（未计费）。';
      }
      let video;
      try {
        video = await client.videoSubmit({
          prompt: typeof args?.prompt === 'string' ? args.prompt : '',
          // 显式给了但类型不对时**透传给桥**，让桥的严格校验报 400；
          // 这里如果按 typeof 过滤，会把“resolution: 1080”静默变成默认分辨率。
          mode: args?.mode ?? '',
          firstFrame,
          lastFrame,
          references,
          duration: args?.duration,
          resolution: args?.resolution ?? '',
          aspectRatio: args?.aspect_ratio ?? '',
          signal: exec?.signal,
        });
```

</details>

**依据 5 · 源码核查**：[dsh-plugin/lib/tools.mjs:854-881](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/tools.mjs#L854-L881)

图片同样在校验后直接提交。

<details>
<summary>查看原文（28行）</summary>

```text
    async execute(args, exec) {
      /*
       * 与视频同一道防线：图片输入认不出来时**不要提交**。
       * 原先非字符串项被静默过滤，模型传 `images: [{url: …}]` 时会变成
       * `images: []` → 请求退化成文生图 → 图没带上但照常计费。
       */
      let images;
      try {
        images = imageInputList(args?.images, 'images');
      } catch (error) {
        return `图片参数无法识别，没有提交（未计费）：${error.message}
修法：images[] 每项都用字符串（本地绝对路径 / 公网 https URL / data URI / miora fileKey），然后原样重试本次提交。`;
      }
      if (args?.prompt !== undefined && args?.prompt !== null && typeof args.prompt !== 'string') {
        return '图片 prompt 必须是字符串；这次没有提交（未计费）。';
      }
      const mode = images.length ? 'edit' : 'generate';
      let image;
      try {
        image = await client.imageSubmit({
          prompt: typeof args?.prompt === 'string' ? args.prompt : '',
          images,
          // 同视频：类型不对的值交给桥报 400，不能静默忽略后按默认尺寸生成。
          size: args?.size ?? '',
          quality: args?.quality ?? '',
          mode,
          signal: exec?.signal,
        });
```

</details>

**依据 6 · 源码核查**：[dsh-plugin/lib/adapter.mjs:1358-1397](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/adapter.mjs#L1358-L1397)

中断保留部分内容并以错误或取消结束，finally取消reader。

<details>
<summary>查看原文（40行）</summary>

```text
    } catch (error) {
      // 流中断：已吐出的内容保留，补上已开块的 block-end，再用终止块收尾。
      // 绝不向调用方抛 —— 契约要求失败也走 finish 块。
      for (const { kind, index } of translator.order) {
        if (kind === 'text' && translator.text) yield { type: 'block-end', index, block: { type: 'text', text: translator.text.text } };
        else if (kind === 'reasoning' && translator.reasoning) yield { type: 'block-end', index, block: { type: 'reasoning', text: translator.reasoning.text } };
        else if (kind === 'tool-call') {
          for (const entry of translator.tools.values()) {
            if (entry.index !== index) continue;
            yield { type: 'block-end', index, block: { type: 'tool-call', id: entry.id, name: entry.name, arguments: entry.args || '{}' } };
          }
        }
      }
      const aborted = signal?.aborted === true;
      const idleTimeout = error?.code === 'IDLE_TIMEOUT';
      this.log(`stream interrupted model=${model}`, error?.message || error);
      yield {
        type: 'finish',
        reason: aborted
          ? { kind: 'aborted', failure: { message: '已取消', code: CODE.ABORTED } }
          : (idleTimeout
            ? { kind: 'error', failure: { message: `${error.message} —— 已停止等待，可重试或换模型。`, code: CODE.TIMEOUT } }
            : { kind: 'error', failure: { message: `流中断：${error?.message || error} —— 上游连接提前结束，可重试或换模型。`, code: CODE.TRANSPORT } }),
      };
    } finally {
      /*
       * 消费方**提前退出**（不再 next()，dsh 会对迭代器调 `return()`）时，这个
       * 生成器在 yield 点被就地恢复并跑 finally —— 此时上游的响应体还开着。
       * 契约要求适配器主动收掉它（`docs/dsh-llm-adapter-contract.md` §4.6：
       * "adapters abort the underlying fetch from their own `finally` so the
       * socket does not leak"），否则每次"用户停止"都白留一条上游连接，
       * 直到上游把整段回答吐完。
       *
       * `cancel()` 会一路传到被包装的源流，进而 abort 掉 fetch —— 与调用方
       * signal 那条路径互补：signal 管"上层要取消"，这里管"消费者不要了"。
       *
       * `reader` 为 null 表示连 `getReader()` 都没成功（响应体不合形状）：
       * 那种情况已在 catch 里报过错，这里无事可做。
       */
      if (reader) await reader.cancel().catch(() => {});
```

</details>

**依据 7 · 源码核查**：[dsh-plugin/lib/bridge.mjs:98-125](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/bridge.mjs#L98-L125)

调用方取消持续绑定本地fetch。

<details>
<summary>查看原文（28行）</summary>

```text
    const cleanup = [];
    const runCleanup = () => { while (cleanup.length) { try { cleanup.pop()(); } catch { /* 忽略 */ } } };
    const onAbort = () => ac.abort(signal?.reason);
    if (signal) {
      signal.addEventListener('abort', onAbort, { once: true });
      cleanup.push(() => signal.removeEventListener('abort', onAbort));
      // 进来时就已经取消：让 fetch 走正常的 abort 失败路径，不静默改成别的语义
      if (signal.aborted) ac.abort(signal.reason);
    }
    if (budget > 0) {
      const timer = setTimeout(() => ac.abort(new Error('timeout')), budget);
      cleanup.push(() => clearTimeout(timer));
    }

    let res;
    try {
      res = await fetch(`${this.baseUrl}${pathname}`, {
        method,
        headers: {
          ...authHeaders(this.token),
          ...(body === undefined ? {} : { 'content-type': 'application/json' }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: ac.signal,
      });
    } catch (error) {
      runCleanup(); // 连响应头都没拿到：立刻释放监听与定时器
      throw error;
```

</details>

**依据 8 · 源码核查**：[dsh-plugin/vendor/bridge/workbuddy-bridge.mjs:5654-5671](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/vendor/bridge/workbuddy-bridge.mjs#L5654-L5671)

传输重试存在上游受理未知下的重复计费取舍。

<details>
<summary>查看原文（18行）</summary>

```text
  const attemptWithStaleRetry = async (a) => {
    try {
      return await attempt(a);
    } catch (error) {
      if (clientSignal?.aborted) throw error;
      const msg = String(error?.message || error?.code || '');
      /*
       * ① 复用的空闲连接被上游掐断（服务器先关）→ 换新连接重试一次。
       *    新连接必然不是 reused；首次连接就失败属于真故障，不重试。
       *
       * 注意：这里仍会对**首次连接**上的 reset 重试。这是被验收用例钉住的
       * 产品行为（`传输层瞬时失败重试后必须救回完整响应`）：网关抖动时宁可
       * 多试一次，也不要把整轮对话直接 500。代价是极端情况下上游可能已受理，
       * 存在重复计费风险；改变它需要同时调整那条用例与文档。
       */
      if (/ECONNRESET|socket hang up|EPIPE/i.test(msg)) {
        log('stale keep-alive socket, retrying once on a fresh connection');
        return attempt(a);
```

</details>

**依据 9 · 源码核查**：[dsh-plugin/vendor/bridge/workbuddy-bridge.mjs:3036-3059](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/vendor/bridge/workbuddy-bridge.mjs#L3036-L3059)

凭据接管按同账号或显式any选择。

<details>
<summary>查看原文（24行）</summary>

```text
async function resolveCredentialAlternative(auth) {
  if (!auth || auth.source === 'api-key' || CREDENTIAL_FAILOVER === 'off') return null;
  if (auth.source === 'desktop') {
    const creds = await readAllPluginCredentials();
    if (!creds.length) return null;
    /*
     * `readAllPluginCredentials()` 返回的是解密后的原始记录，**没有** `active`
     * 字段（active 只在 listPluginCredentials 的对外形状里）。原先查 `c.active`
     * 永远 undefined，any 模式会落到 creds[0]（目录顺序）—— 401 接管时可能
     * 换到用户没选的那个钱包。active 必须从 active.json 读。
     */
    const activeUid = readActiveUid();
    const match = CREDENTIAL_FAILOVER === 'any'
      ? (creds.find((c) => c.uid === auth.userId) || creds.find((c) => c.uid === activeUid) || creds[0])
      : creds.find((c) => c.uid === auth.userId);
    return match ? pluginAuthFromCredential(match) : null;
  }
  if (auth.source === 'plugin') {
    try {
      const desktop = await readStoredAuth();
      if (CREDENTIAL_FAILOVER === 'any' || (auth.uid && desktop.userId === auth.uid)) return desktop;
    } catch { /* 桌面端不可用：没有可接管项 */ }
  }
  return null;
```

</details>

#### 缺口

- 真实上游取消、重复受理和媒体提交结果未知后的对账行为没有独立验证。
  **影响**：不能保证停止即不再扣费，或重试不重复任务。
  **进一步探讨**：对已知任务ID先查状态与账本，隔离实验记录取消后上游完成及扣费，并在结果未知时禁止自动再提交。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比独立客户端和手动配置，增量、依赖及成本是什么？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

相对单独运行WorkBuddy或手配OpenAI兼容桥，它把模型目录、账号状态、积分、桥生命周期和工具接进DSH，减少在控制台、模型配置和会话之间的交接。实际模型能力和配额来自上游，不能计为本插件创新；本轮没有对照验证省时或稳定性。

它也会修改宿主配置。启动默认检测并清理旧llm-pi-ai同名路由，代码捕获迁移失败后继续启动。网页搜索自动接入默认开启，但等待宿主settings/credentials与桥就绪，用户显式配置或退订标记会阻止覆盖；因此它不是单纯注册一个可选模型而无其他状态影响。恢复搜索涉及独立凭据引用和搜索分节，不能用删除插件文件代替。正文“零配置”应理解为自动管理了一组配置与子进程，而非没有运维负担。

首次需Windows、Node、DSH、合法可用账号、可访问上游以及完整桥/控制台脚本；仓库脚本优先于vendor的部署顺序还需对实际安装位置核对。持续成本包括账号套餐或积分、模型请求、媒体任务、后台轮询和本地账本；没有套餐价格、工作量或耗时依据，金额未知。失败成本包括令牌不匹配、登录刷新、端口和构建漂移、任务对账及搜索配置恢复。退出应先核对已提交任务和账本，恢复搜索及旧路由备份，再停止自身管理的进程并保留必要凭据/日志备份；不能因退出插件登录就假定注销上游账号。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/lib/index.js:1255-1277](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/index.js#L1255-L1277)

默认迁移可清理旧模型路由，失败不阻断启动。

<details>
<summary>查看原文（23行）</summary>

```text
  // ── 1. 旧路由清理（必须在注册自己的路由之前） ──────────────────────────
  try {
    const detected = detectLegacyRoutes({ settingsPath: dshPaths.settingsPath, patchPath: dshPaths.patchPath, provider: config.provider });
    state.legacy = { ...detected, cleaned: null };
    if (detected.found) {
      if (config.migrateLegacy) {
        const result = cleanLegacyRoutes({ settingsPath: dshPaths.settingsPath, patchPath: dshPaths.patchPath, provider: config.provider });
        // 清理后**重新探测**：否则面板/工具会一直拿着加载时的旧结论报警告
        const after = detectLegacyRoutes({ settingsPath: dshPaths.settingsPath, patchPath: dshPaths.patchPath, provider: config.provider });
        state.legacy = {
          found: after.found,
          files: after.files,
          detail: after.detail,
          cleaned: result,
          cleanedAt: new Date().toISOString(),
        };
        log(`已清理旧的 llm-pi-ai ${config.provider} 路由：`, JSON.stringify(result.files));
      } else {
        log(`检测到旧的 llm-pi-ai ${config.provider} 路由（migrateLegacy=false，未清理）：`, detected.files.join(', '));
      }
    }
  } catch (error) {
    log('旧路由探测失败（不影响启动）', error);
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/lib/index.js:2072-2116](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/index.js#L2072-L2116)

自动搜索等待服务与明确用户层配置。

<details>
<summary>查看原文（45行）</summary>

```text
  async function maybeAutoConfigureWebSearch(trigger = 'startup') {
    const auto = state.webSearchAuto;
    if (!config.autoWebSearch) {
      if (auto.status !== 'disabled') {
        state.webSearchAuto = { ...auto, enabled: false, status: 'disabled', reason: 'disabled', at: Date.now() };
      }
      return;
    }
    if (auto.inflight) return;
    if (auto.status === 'done' || auto.status === 'opted-out') return;
    if (Date.now() < (auto.nextAt || 0)) return;

    auto.inflight = true;
    const wait = (reason, ms) => {
      state.webSearchAuto = {
        ...state.webSearchAuto,
        enabled: true,
        status: 'waiting',
        reason,
        at: Date.now(),
        nextAt: Date.now() + ms,
        inflight: false,
      };
    };
    try {
      // 没有桥脚本（未安装完整分发包 / 单测空目录）就不要探测：自动接入
      // 必须建立在「这个插件真的能拉起或复用桥」之上。
      if (!existsSync(supervisor.scriptPath)) return;
      const settings = ctx.get('settings');
      const credentials = ctx.get('credentials');
      if (!settings || !credentials) {
        // settings/credentials 通常比插件晚几十毫秒挂载；5 秒后由身份轮询补试，
        // 不必让用户对着“等待中”等 15 秒。
        wait('services', 5_000);
        return;
      }
      const probe = await supervisor.probe();
      const status = await readWebSearchStatus({ bridgeState: probe.state });
      /*
       * `explicit` 为 null = describe() 还拿不到 user 层（宿主服务未就绪/太旧）。
       * 此时不能假设用户没配过，也不该立刻放弃：先等，等到了再判断。
       */
      if (status.explicit !== true && status.explicit !== false) {
        wait('settings', 5_000);
        return;
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/lib/web-search-config.mjs:181-214](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/web-search-config.mjs#L181-L214)

恢复分别写搜索分节与独立凭据引用，部分失败会报告不完整。

<details>
<summary>查看原文（34行）</summary>

```text
export async function restoreWorkBuddyWebSearch({ settings, credentials, snapshot } = {}) {
  if (!snapshot?.ok) throw new Error('no restorable web search snapshot');
  if (!settings || typeof settings.replace !== 'function') {
    throw new Error('dsh settings service does not support restoring the previous section');
  }

  const errors = [];
  if (snapshot.webSection !== null) {
    try {
      await settings.replace(WEB_ENTRY_ID, snapshot.webSection);
    } catch (error) {
      errors.push(`web: ${String(error?.message || error)}`);
    }
  }
  try {
    await settings.replace(WEB_SEARCH_ENTRY_ID, snapshot.section || {});
  } catch (error) {
    errors.push(`web-search-deepseek: ${String(error?.message || error)}`);
  }

  if (!credentials || typeof credentials.set !== 'function') {
    errors.push('credentials service is unavailable');
  } else {
    try {
      if (snapshot.credential) await credentials.set(SEARCH_KEY_REF, snapshot.credential);
      else if (typeof credentials.unset === 'function') await credentials.unset(SEARCH_KEY_REF);
      else errors.push('credentials service does not support unset');
    } catch (error) {
      errors.push(`credential: ${String(error?.message || error)}`);
    }
  }

  if (errors.length) throw new Error(`restore incomplete: ${errors.join('; ')}`);
  return { reverted: true, summary: snapshot.summary || {} };
```

</details>

**依据 4 · 源码核查**：[dsh-plugin/lib/web-search-config.mjs:299-316](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/web-search-config.mjs#L299-L316)

显式设置与managed状态影响自动接入决定。

<details>
<summary>查看原文（18行）</summary>

```text
export function decideWebSearchAutoSetup({
  enabled = true,
  status,
  explicitOverride = false,
  managed = false,
  bridgeState = 'stopped',
} = {}) {
  if (!enabled) return { action: 'skip', reason: 'disabled' };
  if (!status || status.available !== true) return { action: 'wait', reason: 'unavailable' };
  if (status.reason === 'namespace-missing') return { action: 'skip', reason: 'unavailable' };
  // 读配置本身失败时绝不能“当作没配过”然后去写，先等下一轮。
  if (status.reason === 'error') return { action: 'wait', reason: 'settings' };
  if (status.configured === true && status.tokenMatches !== false) {
    return { action: 'skip', reason: 'configured' };
  }
  if (explicitOverride && !managed) return { action: 'skip', reason: 'explicit' };
  if (bridgeState !== 'running') return { action: 'wait', reason: 'bridge' };
  return { action: 'configure', reason: managed ? 'heal' : 'auto' };
```

</details>

**依据 5 · 源码核查**：[dsh-plugin/lib/bridge.mjs:737-765](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/bridge.mjs#L737-L765)

停止基于可信健康响应PID并轮询确认，不将abort当已停止。

<details>
<summary>查看原文（29行）</summary>

```text
  async stop(signal) {
    const status = await this.probe(signal);
    if (status.state === 'aborted') return { ok: false, stopped: false, error: status.error };
    if (status.state === 'stopped') return { ok: true, stopped: false, reason: 'bridge was not running' };
    /*
     * 未登录 / 凭据异常时桥仍然是我们的进程：503 body 现在带 pid，可以正常停止。
     * 只有 foreign / unauthorized（没有可信 pid）才拒绝。
     */
    const pid = status.health?.pid;
    if (!['running', 'degraded', 'unauthenticated'].includes(status.state) || !Number.isFinite(pid)) {
      return { ok: false, error: status.error || status.state };
    }
    try {
      process.kill(pid, 'SIGTERM');
    } catch (error) {
      return { ok: false, error: `无法结束 pid ${pid}：${error.message}` };
    }
    const deadline = Date.now() + 8000;
    while (Date.now() < deadline) {
      await sleep(200);
      if (signal?.aborted) return { ok: false, stopped: false, error: 'stop aborted by caller' };
      const nowState = (await this.probe(signal)).state;
      if (nowState === 'aborted') return { ok: false, stopped: false, error: 'stop aborted by caller' };
      if (nowState === 'stopped') {
        if (this.spawnedPid === pid) this.spawnedPid = null;
        return { ok: true, stopped: true, pid };
      }
    }
    return { ok: false, error: `pid ${pid} 在 8 秒内没有退出` };
```

</details>

**依据 6 · 作者声明**：[dsh-plugin/README.md:1-14](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/README.md#L1-L14)

作者目标是复用账号并减少手工配置。

<details>
<summary>查看原文（14行）</summary>

```text
# dsh-plugin-workbuddy

把本机 **WorkBuddy** 的模型（桌面端已登录，或在插件里完成一次浏览器授权），
做成 **DeepSeek Harness 的一等公民**。

## 一键即用（三步，零配置）

1. 安装插件（dsh 市场 / `dsh plugin add` / tgz）。
2. 设置 → WorkBuddy → 「账号」→「开始登录」——授权页会自动在浏览器打开。
3. 授权完成，回 dsh 模型选择器选一个 WorkBuddy 模型即可对话。

不用填 API Key、Base URL、令牌、端口或环境变量；桥与控制台由插件自动管理。
**没装桌面端也能用**；已经登录桌面端则自动复用，第 2 步都不用做。
国内 / 国际版会根据现有账号或桌面端域名自动预选；登录、切号或重启桥后，
```

</details>

#### 缺口

- 净成本、配额适用性与长期上游兼容没有同任务证据。
  **影响**：不能以积分倍率或免API配置推算更便宜或可持续。
  **进一步探讨**：同账号同模型同任务核对全部调用、媒体与重试账本及人工排障时间，再与原客户端流程比较。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 对谁值得试用，如何验证最关键假设？

**研究主题**：采用判断、新假设与验证

#### 完整回答

本次结论为观察。已有账号的Windows DSH用户可以理解其集成价值，但真实账号请求、宿主组合和扣费归属尚未得到本轮验证，自动搜索配置、凭据接管及媒体副作用使“装上即用”的扩大试用证据不足。若要继续，应先用独立profile、单一已知账号和一个低额度文本请求确认实际账号与账本，媒体与跨账号接管另做授权验证。遇账号不符、结果未知但账本有扣费、停止后仍有任务或搜索配置被意外改变，应停止新请求，先查已知ID与账本并恢复原客户端流程。

从“传输重试可能重复受理”与“媒体有独立任务ID”可推导一个未验证方向。把逻辑请求ID、实际尝试、账号身份和上游任务结果串成可查询的对账记录，遇未知结果先核对而非新建请求，可能减小自动恢复导致的重复成本。它不能仅靠本地ID保证上游幂等，必须查上游是否支持幂等键或请求状态。最小验证固定一个账号和受控端点，在上游已受理而响应丢失时比较现策略与先对账策略，记录重复任务、扣费和恢复等待。若上游无可查询身份，或等待与人工成本高于可避免损失，应降低该方向优先级。此方案不是已实现的收费保证或新的模型服务。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/vendor/bridge/workbuddy-bridge.mjs:5654-5671](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/vendor/bridge/workbuddy-bridge.mjs#L5654-L5671)

重试受理未知是对账假设的直接依据。

<details>
<summary>查看原文（18行）</summary>

```text
  const attemptWithStaleRetry = async (a) => {
    try {
      return await attempt(a);
    } catch (error) {
      if (clientSignal?.aborted) throw error;
      const msg = String(error?.message || error?.code || '');
      /*
       * ① 复用的空闲连接被上游掐断（服务器先关）→ 换新连接重试一次。
       *    新连接必然不是 reused；首次连接就失败属于真故障，不重试。
       *
       * 注意：这里仍会对**首次连接**上的 reset 重试。这是被验收用例钉住的
       * 产品行为（`传输层瞬时失败重试后必须救回完整响应`）：网关抖动时宁可
       * 多试一次，也不要把整轮对话直接 500。代价是极端情况下上游可能已受理，
       * 存在重复计费风险；改变它需要同时调整那条用例与文档。
       */
      if (/ECONNRESET|socket hang up|EPIPE/i.test(msg)) {
        log('stale keep-alive socket, retrying once on a fresh connection');
        return attempt(a);
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/lib/tools.mjs:656-677](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/tools.mjs#L656-L677)

视频任务返回ID可作为已知结果核对入口。

<details>
<summary>查看原文（22行）</summary>

```text
        video = await client.videoSubmit({
          prompt: typeof args?.prompt === 'string' ? args.prompt : '',
          // 显式给了但类型不对时**透传给桥**，让桥的严格校验报 400；
          // 这里如果按 typeof 过滤，会把“resolution: 1080”静默变成默认分辨率。
          mode: args?.mode ?? '',
          firstFrame,
          lastFrame,
          references,
          duration: args?.duration,
          resolution: args?.resolution ?? '',
          aspectRatio: args?.aspect_ratio ?? '',
          signal: exec?.signal,
        });
      } catch (error) {
        return mediaFailureText(error, { action: 'submit', label: '视频' });
      }
      const summary = `任务：${video.id}；状态：${video.status}（上游：${video.upstream_status || '-'}）；`
        + `模式：${video.mode || '-'}`
        + `${video.seconds ? `；时长：${video.seconds}s` : ''}`
        + `${video.resolution ? `；分辨率：${video.resolution}` : ''}`
        + `${video.aspect_ratio ? `；画幅：${video.aspect_ratio}` : ''}`
        + `${video.model ? `；模型：${video.model}` : ''}`;
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/lib/adapter.mjs:1254-1266](https://github.com/Ianzhyh/workbuddy-to-dsh/blob/5ca121bfed844c784ed559d4b14af2126acb56eb/dsh-plugin/lib/adapter.mjs#L1254-L1266)

本地桥连接失败只知道取消或传输错误，不能知道上游是否计费。

<details>
<summary>查看原文（13行）</summary>

```text
    let res;
    try {
      res = await client.chat(payload, { signal });
    } catch (error) {
      const aborted = signal?.aborted === true;
      if (!aborted) this.onTransportFailure(); // 桥可能刚挂：作废「活着」缓存，下次先探测
      yield {
        type: 'finish',
        reason: aborted
          ? { kind: 'aborted', failure: { message: '已取消', code: CODE.ABORTED } }
          : { kind: 'error', failure: { message: `本地桥连接失败：${error?.message || error} —— ${ERROR_HINTS[CODE.TRANSPORT]}`, code: CODE.TRANSPORT } },
      };
      return;
```

</details>

#### 缺口

- 上游幂等键、请求状态关联和重复扣费对照尚未核实。
  **影响**：不能将本地对账设想说成可提供端到端幂等。
  **进一步探讨**：取得上游正式协议或实际授权实验材料，分别记录受理、响应丢失、查询和账本结果。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
