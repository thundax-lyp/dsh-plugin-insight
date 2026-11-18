# dsh-chatgpt-web

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[b134353](https://github.com/WLV-ZEDD/dsh-chatgpt-web/tree/b13435383e2ddffea24fde660c850392ff0caf97)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WLV-ZEDD/dsh-chatgpt-web) [![npm 30d 3,262](https://img.shields.io/static/v1?label=npm+30d&message=3%2C262&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wlv-zedd/dsh-chatgpt-web) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wlv-zedd/dsh-chatgpt-web)
<!-- END META -->

> **功能**：为 DeepSeek Harness 挂载本地 Responses 桥，使用已登录的 ChatGPT 网页会话进行纯聊天。

> **亮点**：[Q01](#research-q01) 把已登录浏览器的文本问答包装成 DSH 能消费的 Responses 流，在无需工具执行的问答中省去手工搬运。[Q04](#research-q04) 具体模型、输入和页面退化仍分别由本地适配表及实际网页控制。

> **主要限制**：[Q03](#research-q03) 模型 POST 与管理接口的认证路径不同，本机回环端口没有使用控制令牌保护普通模型调用。网页登录态和续接状态可写到本机，SSE 的 force 缓存在部分路径覆盖客户端 store:false [Q05](#research-q05)。

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
  - [Q01 · 和直接在 ChatGPT 网页发问相比，纯聊天桥为 DSH 用户增加什么？](#detail-section-11)
  - [Q02 · 从装载到 provider 出现要走哪些步骤，Host effect 能独立完成启停吗？](#detail-section-12)
  - [Q03 · 网页登录保存了什么，回环模型请求和控制路由是否同等认证？](#detail-section-13)
  - [Q04 · 一次 Luna 文本请求如何到网页并返回，模型名和窗口参数能否照用？](#detail-section-14)
  - [Q05 · 一次请求取消、重复发送或失去续接状态时，如何区分回合结局？](#detail-section-15)
  - [Q06 · 什么读者适合先观察，当前材料能证明多少成本和可用性？](#detail-section-16)
  - [Q07 · 让宿主明确传稳定会话身份和显示已提交状态，会减少重复工作吗？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常同时打开 DSH 与 ChatGPT 网页的开发者，可用一条公开短问题评估是否需要同一对话窗口里的问答。工具任务、长上下文和高可靠业务有额外条件。

直接打开网页便于确认账号和页面状态，但可读结果需在 DSH 任务中人工搬运。可通过正式接口的经授权 provider 能避免依赖网页 UI，选型需结合自己的环境和授权。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Browser-only provider | 同一 DSH 会话内获得网页回答 | 本地 Chrome 登录状态与实际账户路线 |
| Responses 流式转换 | 让宿主接收网页轮次产物 | DOM 结构、实际提交和回包必须稳定 |
| 模型目录 | 显示本地适配的模型路线 | 和真实网页账户条件对应，Luna 有能力条件 |
| 续接与退出 | 按回包 ID 恢复，控制本地进程 | 缓存有留存，缺 ID 时拒绝，卸载只停自己启动的进程 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 Node 或 Bun、DSH 及发布入口 | DSH 主路径所需 | 加载 Host 插件及启动本地桥 | 先核对对应包版本 |
| 可用 Chrome 与专用状态目录 | 主路径所需 | 登录并呈现可自动化会话 | 去独立浏览器验证状态 |
| DSH profile 中的 llm-pi-ai provider | 选择模型所需 | 指向实际回环服务及 slug | 单独安装 Host 插件不配置模型 |
| 可用账号和模型能力 | 发问时所需 | 选择账户支持的实际网页路线 | 可能因 Sol/Luna 选择不匹配被拒 |
| 仅可信本机进程可达 | 共享安全条件 | 约束回环模型请求可达范围 | 管理令牌不能代替模型端限制 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 核对 | 核对 Host、浏览器、授权与状态目录 | 不同用途的已有路径需隔离 |
| 配置 | 单设一个可控试验 profile | 模型清单与本地绑定匹配 |
| 验收 | 检查短问答输出和退出 | 没有明确终态、流错或端口未停时先查本机状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 主机、Chrome 和浏览器账号 | 初次登录、配置 provider 及存储 | 当前资格、费用及耗时未核验 |
| 持续使用 | 浏览器进程、数据存储及网络 | 检修 DOM 变化、账号状态、流式返回 | 等待时间、调用容量、总体成本未知 |
| 失败与退出 | 可能留下已开始网页回合或会话缓存 | 返回原入口，检查本机活动和数据保留 | 关闭回执和站点处理未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 同窗短问答 | 回环代理把网页输出适配到宿主 | 实际耗时和问答质量 |
| 会话续接 | 本地缓存并按 response ID 恢复 | 并发 DSH 线程的真实请求身份 |
| 退出 | Host effect 尝试停止所启子进程 | 活跃轮次的实际清退和外部监听 |

> **思考**：[Q03](#research-q03) 模型 POST 与管理接口的认证路径不同，本机回环端口没有使用控制令牌保护普通模型调用。网页登录态和续接状态可写到本机，SSE 的 force 缓存在部分路径覆盖客户端 store:false [Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把已登录浏览器的文本问答包装成 DSH 能消费的 Responses 流，在无需工具执行的问答中省去手工搬运。[Q04](#research-q04) 具体模型、输入和页面退化仍分别由本地适配表及实际网页控制。

[Q05](#research-q05) 对完全一致的轮次复用执行，另外等待浏览器物理结算，并在历史无法扩展时拒绝继续。控制进程和浏览器响应是不同状态，必须同时核对；缺省线程身份和本机留存影响并行管理。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 模型 POST 与管理接口的认证路径不同，本机回环端口没有使用控制令牌保护普通模型调用。网页登录态和续接状态可写到本机，SSE 的 force 缓存在部分路径覆盖客户端 store:false [Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06) 先观察或在明确授权的隔离环境用合成短问答核对模型和终态。共同使用主机时应先查到回环端口的实际访问边界。若账号失效、应答重复或回环服务仍有未预期活动，停用并回原有入口 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查 DSH browser-only Host 入口、账户状态、模型和发送路径、回环控制与持久化。主站身份、当前服务资格、真实运行尚未验证；收据改进是待验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、client.js、lib/cli.js、src/setup.ts、src/config.ts、src/server.ts、cordis.patch.yml、lib/plugin.js、src/browser-login.ts、src/adapters/chatgpt-web/browser-worker.ts、src/chatgpt-web-models.ts、src/responses/state.ts、src/adapters/chatgpt-web/environment.ts、src/adapters/chatgpt-web/turn-execution.ts、scripts/smoke-tarball.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：范围为固定根包的 DSH browser-only 自动化路径、共享服务普通请求及已读代码。未运行目标、浏览器、真实模型，未审计 Codex full/manual、所有第三方登录策略和外部服务条款。
- 下一步：用浏览器桩回放响应成功、输入区变化、断流和两个 DSH 线程，记录模型路由、响应终态、线程所有权和落盘。另用合成登录状态核对实际宿主请求权限。

**分析版本**

- **仓库**：[WLV-ZEDD/dsh-chatgpt-web](https://github.com/WLV-ZEDD/dsh-chatgpt-web)
- **版本号**：1.0.5（[固定提交 b134353](https://github.com/WLV-ZEDD/dsh-chatgpt-web/tree/b13435383e2ddffea24fde660c850392ff0caf97)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q07](#research-q07) 可以用 DSH 真实会话标识和明确的已提交收据来检验跨会话等待和重试误发是否减少。只有能和网页实际提交证据对账，才能计为恢复。

用浏览器桩回放响应成功、输入区变化、断流和两个 DSH 线程，记录模型路由、响应终态、线程所有权和落盘。另用合成登录状态核对实际宿主请求权限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 23079 | 21275 | 1661 | — |
| .md | source | 6 | 3320 | — | — | 12528 |
| .mjs | source | 1 | 222 | 188 | 23 | — |
| .ts | source | 73 | 30970 | 27287 | 1987 | — |
| .cjs | source | 1 | 140 | 119 | 3 | — |
| .ts | test | 4 | 449 | 396 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/WLV-ZEDD/dsh-chatgpt-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/WLV-ZEDD/dsh-chatgpt-web/issues?q=is%3Aissue+created%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/WLV-ZEDD/dsh-chatgpt-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z)



统计日期：2026-11-18。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已登录网页的用户能否用 DSH 完成短对话，安装、纯聊天、数据留存和会话并发有哪些条件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 和直接在 ChatGPT 网页发问相比，纯聊天桥为 DSH 用户增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对同时使用 DSH 和 ChatGPT 网页、只想在当前 DSH 会话把一条公开问题问完的人，它提供了一个可选择的本地 provider 接口。宿主自身配置 llm-pi-ai，调用本地 Responses POST，后台用登录浏览器提交同样的问题，再把结果按宿主可用的 SSE 或整段 JSON 返回。相比手工在网页与 DSH 之间复制输入和输出，主要省下窗口切换及搬运。源码 DSH setup 仅保留 browser-only，providerConfig 中 full 才使能本地工具；该路线适合完成解释或文本问答，不支持把本地工具执行当成应用结果。继续直接使用网页仍能有可见账户与人工操作的边界；有生产可靠性需求者还应独立评估已授权的目标 provider。源码只证实接线，没有给出响应质量、速度、费用或网页授权条件的当前保证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-43](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/README.md#L35-L43)

作者提出将网页会话带进 DSH 单纯聊天的用途。

```text
## Overview

**dsh-chatgpt-web** turns your local browser session of ChatGPT into a seamless, **$0.00 API-free conversational model provider** directly inside DeepSeek Harness (DSH).

It connects via headless or visible Chrome/Chromium browser automation to `chatgpt.com`, streaming real-time Markdown responses, code solutions, explanations, and reasoning back to your DSH chats without consuming API credits.

### Why Pure Chat?

Small conversational web models (like GPT-6 Luna) excel at explanations, dialogue, Q&A, brainstorming, code snippet generation, and side-assistant tasks. By running in **Pure Chat Mode**, the bridge eliminates prompt overhead, tool hallucinations, and syntax errors of autonomous multi-tool execution loops, providing a fast, rock-solid, zero-cost LLM provider.
```

**依据 2 · 源码核查**：[src/setup.ts:409-426](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/setup.ts#L409-L426)

DSH setup 明确采用 browser-only 和 managed Chrome。

<details>
<summary>查看原文（18行）</summary>

```text
function prepareDshSetup(options: SetupOptions): AppConfig {
  const existing = loadExistingConfig();
  if (existing && existing.purpose !== "dsh") {
    throw new Error("DSH setup requires its own storage home; refusing to replace a Codex or DEV configuration");
  }
  if (options.mode !== "browser-only" || options.browserInteractionMode === "manual"
    || options.browserHostDescriptorPath || options.replaceCodexRoute || options.restartService
    || options.tunnelId || options.runtimeKeyFile || options.runtimeKeyValue) {
    throw new Error("DSH setup supports only managed Chrome in browser-only mode; DSH owns the sidecar");
  }
  const config = baseConfig(existing, options);
  if (config.browserHost !== "managed-chrome" || config.browserInteractionMode !== "automatic") {
    throw new Error("DSH setup requires managed Chrome with automatic browser interaction");
  }
  if (!existsSync(config.chromeExecutablePath)) {
    throw new Error(`Google Chrome executable not found at: ${config.chromeExecutablePath}. Provide --chrome <path>`);
  }
  config.purpose = "dsh";
```

</details>

**依据 3 · 源码核查**：[src/config.ts:674-685](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/config.ts#L674-L685)

只有 full 模式开启本地工具路径。

<details>
<summary>查看原文（12行）</summary>

```text
    chatgptWeb: {
      appName: manual ? config.manualAppName : config.automaticAppName,
      browserInteractionMode: config.browserInteractionMode,
      browserHost: config.browserHost,
      browserHostDescriptorPath: config.browserHostDescriptorPath,
      storageStatePath: config.storageStatePath,
      chromeExecutablePath: config.chromeExecutablePath,
      brokerSocketPath: config.brokerSocketPath,
      threadEnvironmentStatePath: join(getConfigDir(), "runtime", "thread-environments.json"),
      lunaCheckpointStatePath: join(getConfigDir(), "runtime", "luna-checkpoints.json"),
      headed: config.headed,
      localToolsEnabled: config.mode === "full",
```

</details>

**依据 4 · 源码核查**：[src/server.ts:593-628](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/server.ts#L593-L628)

响应按 SSE 或 JSON 交给宿主。

<details>
<summary>查看原文（36行）</summary>

```text
  if (parsed.stream) {
    void run();
    const stream = bridgeToResponsesSSE(
      queue,
      responseModel,
      maps.toolNsMap,
      maps.freeformToolNames,
      maps.toolSearchToolNames,
      () => abort.abort(),
      2_000,
      {
        hideThinkingSummary: parsed.options.hideThinkingSummary,
        ...(provider.chatgptWeb?.stallTimeoutSec !== undefined
          ? { stallTimeoutSec: provider.chatgptWeb.stallTimeoutSec }
          : {}),
        ...(compaction ? { compaction: true } : {
          ...(options.rememberState === false ? {} : {
            onCompletedResponse: (response: Record<string, unknown>) => rememberResponseState(parsed._rawBody, response, { force: true }),
          }),
        }),
      },
    );
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  }

  await run();
  const events = await queue.collect();
  const json = buildResponseJSON(events, responseModel, {
    hideThinkingSummary: parsed.options.hideThinkingSummary,
```

</details>

#### 缺口

- 同一短问题的成功、等待和返工率未测
  **影响**：收益限流程层面的可解释增量
  **进一步探讨**：用合成问答比较直接网页与受控 DSH 请求的可见终态和耗时

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从装载到 provider 出现要走哪些步骤，Host effect 能独立完成启停吗？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

发布根清单导出 lib/plugin.js，patch 将组件插入 profile，在 effect 中检查本地健康。已有监听可直接附接，否则组件用已编译 CLI 的 serve 启动子进程。普通启用还需先运行 DSH 专用 setup，有非 DSH 用途的既有配置时拒绝覆写；该入口只接受自动化 managed Chrome，建立或读取浏览器登录状态和账户能力。然后由使用者在目标 profile 的 llm-pi-ai 配置中登记模型和本地 baseURL，补丁没有提供自动 provider 注册。健康探测只是服务响应，尚不能说明目标账号、选择器或终态均可用。Host 子进程启动使用 launcher 固定 argv 并继承环境，effect 配置中的 host/port 用于探测和日志；自定义端口因此仍要确保 CLI 配置相符。释放时仅处理自己启动的子进程，先向 admin/shutdown 发请求但未送控制令牌，也未先 drain；服务端会要求令牌及零活跃回合。所见路径随后尝试 SIGTERM，外部附接服务不会被该 effect 关闭。应根据实际进程和请求回执判断退出。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:15-24](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/package.json#L15-L24)

明确区分服务端、CLI、Web 模块。

<details>
<summary>查看原文（10行）</summary>

```text
  "main": "./lib/plugin.js",
  "bin": {
    "dsh-chatgpt-web": "./lib/cli.js"
  },
  "exports": {
    ".": "./lib/plugin.js",
    "./client": "./client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-4](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/cordis.patch.yml#L1-L4)

挂载根插件，不注册 provider。

```text
# dsh-chatgpt-web bundle patch: inserts the sidecar plugin into a profile layer stack.
- insert:
    - id: dsh-chatgpt-web
      name: '@wlv-zedd/dsh-chatgpt-web'
```

**依据 3 · 源码核查**：[lib/plugin.js:65-92](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/lib/plugin.js#L65-L92)

发布入口探测／复用和启动。

<details>
<summary>查看原文（28行）</summary>

```text
function apply(ctx, config = {}) {
  const host = config.host || "127.0.0.1";
  const port = config.port || 17841;
  const autoStart = config.autoStart !== false;
  const readyTimeoutMs = config.readyTimeoutMs || 30000;
  const logger = typeof ctx.logger === "function" ? ctx.logger("chatgpt-web") : console;
  let spawnedProcess;
  const startDaemon = async () => {
    const alreadyHealthy = await isSidecarHealthy(host, port);
    if (alreadyHealthy) {
      logger.info(`[dsh-chatgpt-web] Sidecar already running and healthy at http://${host}:${port}/v1`);
      return;
    }
    if (!autoStart) {
      logger.warn(`[dsh-chatgpt-web] Sidecar is offline and autoStart is false. Start it manually with 'bun run src/cli.ts serve'`);
      return;
    }
    const launcher = resolveLauncher(config.bunPath);
    logger.info(`[dsh-chatgpt-web] Starting dsh-chatgpt-web daemon via ${launcher.cmd} at http://${host}:${port}/v1...`);
    const child = spawn(launcher.cmd, launcher.args, {
      cwd: ROOT_DIR,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
      env: {
        ...process.env
      }
    });
    spawnedProcess = child;
```

</details>

**依据 4 · 源码核查**：[src/setup.ts:409-441](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/setup.ts#L409-L441)

DSH 配置隔离、浏览器条件与登录能力写入。

<details>
<summary>查看原文（33行）</summary>

```text
function prepareDshSetup(options: SetupOptions): AppConfig {
  const existing = loadExistingConfig();
  if (existing && existing.purpose !== "dsh") {
    throw new Error("DSH setup requires its own storage home; refusing to replace a Codex or DEV configuration");
  }
  if (options.mode !== "browser-only" || options.browserInteractionMode === "manual"
    || options.browserHostDescriptorPath || options.replaceCodexRoute || options.restartService
    || options.tunnelId || options.runtimeKeyFile || options.runtimeKeyValue) {
    throw new Error("DSH setup supports only managed Chrome in browser-only mode; DSH owns the sidecar");
  }
  const config = baseConfig(existing, options);
  if (config.browserHost !== "managed-chrome" || config.browserInteractionMode !== "automatic") {
    throw new Error("DSH setup requires managed Chrome with automatic browser interaction");
  }
  if (!existsSync(config.chromeExecutablePath)) {
    throw new Error(`Google Chrome executable not found at: ${config.chromeExecutablePath}. Provide --chrome <path>`);
  }
  config.purpose = "dsh";
  return config;
}

async function setupDsh(options: SetupOptions): Promise<SetupResult> {
  const config = prepareDshSetup(options);
  await assertPortAvailable(config.host, config.port);
  const loginCreated = options.forceLogin === true || !browserLoginStateExists(config);
  const capabilities = loginCreated
    ? await loginToChatGpt(config)
    : options.refreshAccountCapabilities
      ? await inspectBrowserLoginCapabilities(config)
      : storedBrowserLoginCapabilities(config);
  config.solAvailable = capabilities.solAvailable === true;
  config.proAvailable = config.solAvailable && capabilities.proAvailable === true;
  saveConfig(config);
```

</details>

**依据 5 · 作者声明**：[README.md:143-168](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/README.md#L143-L168)

用户手工给 llm-pi-ai 配置 provider 及回环地址。

<details>
<summary>查看原文（26行）</summary>

````text
### 3. Enable in DeepSeek Harness

Provider configuration lives in the profile's Cordis patch layer (`~/.dsh/profiles/<profile>/cordis.patch.yml`), not in a global settings file. Add the `chatgpt-web` provider under the existing `providers` map of the `llm-pi-ai` entry:

```yaml
- id: llm-pi-ai
  name: "@deepseek-ai/dsh-llm-pi-ai"
  config:
    providers:
      # ...your existing providers...
      chatgpt-web:
        displayName: "ChatGPT Web (Free)"
        api: openai-responses
        baseURL: http://127.0.0.1:17841/v1
        headers:
          Authorization: "Bearer chatgpt-web-free"
        streamIdleTimeoutMs: 300000
        models:
          - id: chatgpt-web/luna
            name: "ChatGPT Web — Luna (Free)"
            contextWindow: 1050000
            maxTokens: 32768
            input:
              - text
              - image
```
````

</details>

**依据 6 · 源码核查**：[lib/plugin.js:122-149](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/lib/plugin.js#L122-L149)

卸载尝试控制请求以及 SIGTERM 兜底。

<details>
<summary>查看原文（28行）</summary>

```text
  const stopDaemon = async () => {
    if (!spawnedProcess)
      return;
    logger.info("[dsh-chatgpt-web] Stopping sidecar daemon...");
    try {
      const controller = new AbortController;
      const timer = setTimeout(() => controller.abort(), 2000);
      await fetch(`http://${host}:${port}/admin/shutdown`, {
        method: "POST",
        signal: controller.signal
      }).catch(() => {});
      clearTimeout(timer);
    } catch {}
    if (spawnedProcess && !spawnedProcess.killed) {
      spawnedProcess.kill("SIGTERM");
    }
    spawnedProcess = undefined;
  };
  if (typeof ctx.effect === "function") {
    ctx.effect(() => {
      startDaemon();
      return () => {
        stopDaemon();
      };
    });
  } else {
    startDaemon();
    process.once("beforeExit", () => void stopDaemon());
```

</details>

**依据 7 · 源码核查**：[src/server.ts:1098-1112](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/server.ts#L1098-L1112)

控制认证和 drain／活跃回合条件。

<details>
<summary>查看原文（15行）</summary>

```text
    if (req.method === "POST" && url.pathname === "/admin/shutdown") {
      if (!controlAuthorized(req)) return new Response("Unauthorized", { status: 401 });
      const current = activity();
      if (!draining || current.active_http_turns > 0 || current.active_browser_turns > 0) {
        return Response.json(
          {
            status: "refused",
            accepting_turns: !draining,
            ...current,
          },
          { status: 409 },
        );
      }
      setTimeout(shutdown, 0);
      return Response.json({ status: "ok", accepting_turns: false, ...current });
```

</details>

#### 缺口

- 宿主实装和重载时的端口／退出未测
  **影响**：健康和进程退出条件不能证明流按预期收口
  **进一步探讨**：用固定 Host 和合成请求检查新旧 PID、活跃回合、关闭路径和实际端口

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 网页登录保存了什么，回环模型请求和控制路由是否同等认证？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

登录首先等待可见的已认证输入区域，然后提取浏览器 storageState。首次采集过滤非 ChatGPT/OpenAI 域和分区 cookie，并仅保留 ChatGPT origin 下的 localStorage；写入原子文件，Unix 目录与文件权限限制，Windows 路径的 chmod 为尽力处理。运行时 managed Chrome 完成回合会重新读 context.storageState，直接原子写回，在该调用点未复用登录时的过滤。状态 JSON 是可重用的登录材料。配置读取拒绝非 127.0.0.1 的监听地址，控制、诊断或关闭端点校验单独的随机令牌；/v1/responses 入口直接跟踪实际请求，没有同一令牌校验，所阅 responseRequest 主入口先解析 JSON 和模型也未接入控制认证。README 的 provider 兼容 header 因此不能视为模型端的访问门。回环缩小远端访问，仍须按拥有该机器访问权限的本地进程看待，尤其避免共享主机和反向代理转发。账号使用资格、远端保留及条款要由部署者另行查证，本研究没有使用真实账号。

#### 证据与依据

**依据 1 · 源码核查**：[src/browser-login.ts:119-132](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/browser-login.ts#L119-L132)

首次采集会过滤 Cookie 和 origin。

<details>
<summary>查看原文（14行）</summary>

```text
export function sanitizeBrowserLoginStorageState(
  storageState: BrowserLoginStorageState,
): BrowserLoginStorageState {
  return {
    cookies: storageState.cookies
      .filter(cookie => !Object.prototype.hasOwnProperty.call(cookie, "partitionKey")
        && allowedLoginStorageHost(cookie.domain.replace(/^\.+/, "")))
      .map(cookie => ({ ...cookie })),
    origins: storageState.origins
      .filter(origin => origin.origin === CHATGPT_ORIGIN)
      .map(origin => ({
        origin: origin.origin,
        localStorage: origin.localStorage.map(item => ({ ...item })),
      })),
```

</details>

**依据 2 · 源码核查**：[src/browser-login.ts:467-483](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/browser-login.ts#L467-L483)

等待认证并写入状态和标记。

<details>
<summary>查看原文（17行）</summary>

```text
    if (!activePage) {
      throw new Error("The authenticated ChatGPT page did not produce a visible composer within 5 minutes");
    }

    await assertAuthenticatedChatGptPage(activePage);
    const rawState = await context.storageState();
    const state = sanitizeBrowserLoginStorageState(rawState);

    let capabilities: ChatGptWebAccountCapabilities;
    try {
      capabilities = await detectChatGptAccountCapabilities(activePage, { selectorTimeoutMs: 15_000 });
    } catch {
      capabilities = { solAvailable: true, proAvailable: false };
    }

    atomicWriteFile(config.storageStatePath, `${JSON.stringify(state)}\n`);
    writeVerificationMarker(config.storageStatePath, capabilities);
```

</details>

**依据 3 · 源码核查**：[src/config.ts:271-286](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/config.ts#L271-L286)

原子写和文件权限。

<details>
<summary>查看原文（16行）</summary>

```text
export function atomicWriteFile(path: string, data: string | Uint8Array): void {
  const directory = dirname(path);
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  try { chmodSync(directory, 0o700); } catch { /* Windows ACLs are managed by the installer. */ }
  const temp = `${path}.tmp-${process.pid}-${crypto.randomUUID()}`;
  const fd = openSync(temp, "wx", 0o600);
  try {
    writeFileSync(fd, data);
    closeSync(fd);
    renameAtomicFile(temp, path);
  } catch (error) {
    try { closeSync(fd); } catch {}
    rmSync(temp, { force: true });
    throw error;
  }
  try { chmodSync(path, 0o600); } catch { /* Windows ACLs are managed by the installer. */ }
```

</details>

**依据 4 · 源码核查**：[src/adapters/chatgpt-web/browser-worker.ts:5151-5154](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/adapters/chatgpt-web/browser-worker.ts#L5151-L5154)

运行时直接保存全部 context state。

```text
      if (this.context && this.config.browserHost === "managed-chrome") {
        const state = await this.context.storageState();
        atomicWriteFile(this.config.storageStatePath, `${JSON.stringify(state)}\n`);
      }
```

**依据 5 · 源码核查**：[src/config.ts:478-505](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/config.ts#L478-L505)

只接受回环监听。

<details>
<summary>查看原文（28行）</summary>

```text
function parseConfig(value: unknown, path: string): AppConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`Invalid configuration object in ${path}`);
  const parsed = value as Partial<AppConfig>;
  if (parsed.version !== 3) throw new Error(`Unsupported configuration version in ${path}; rerun setup to migrate it`);
  if (parsed.purpose !== undefined && parsed.purpose !== "dev-harness" && parsed.purpose !== "dsh") {
    throw new Error(`Invalid configuration purpose in ${path}`);
  }
  if (typeof parsed.releaseVersion !== "string" || !parsed.releaseVersion.trim()) throw new Error(`Missing releaseVersion in ${path}`);
  if (parsed.mode !== "browser-only" && parsed.mode !== "full") throw new Error(`Invalid runtime mode in ${path}`);
  const subagentProtocol = parsed.subagentProtocol ?? "compatibility-v1";
  if (subagentProtocol !== "compatibility-v1" && subagentProtocol !== "native") {
    throw new Error(`Invalid subagentProtocol in ${path}`);
  }
  if (parsed.host !== "127.0.0.1") throw new Error("The Responses proxy must bind to 127.0.0.1");
  if (parsed.browserHost !== "managed-chrome" && parsed.browserHost !== "launcher") {
    throw new Error(`Invalid browserHost in ${path}`);
  }
  const browserInteractionMode = parsed.browserInteractionMode ?? "automatic";
  if (browserInteractionMode !== "automatic" && browserInteractionMode !== "manual") {
    throw new Error(`Invalid browserInteractionMode in ${path}`);
  }
  if (browserInteractionMode === "manual" && parsed.mode !== "full") {
    throw new Error(`Zero Risk requires full mode in ${path}`);
  }
  if (browserInteractionMode === "manual" && parsed.browserHost !== "launcher") {
    throw new Error(`Zero Risk requires the launcher browser host in ${path}`);
  }
  if (!Number.isInteger(parsed.port) || parsed.port! < 1 || parsed.port! > 65_535) throw new Error(`Invalid port in ${path}`);
```

</details>

**依据 6 · 源码核查**：[src/server.ts:913-941](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/server.ts#L913-L941)

控制路径的独立令牌检查。

<details>
<summary>查看原文（29行）</summary>

```text
  const controlAuthorized = (req: Request): boolean => {
    const header = req.headers.get("authorization") ?? "";
    const expected = Buffer.from(`Bearer ${config.controlToken}`);
    const actual = Buffer.from(header);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  };
  const handleFetch = async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    if (req.method === "GET" && url.pathname === "/healthz") {
      return Response.json({
        status: "ok",
        service: "dsh-chatgpt-web",
        version: VERSION,
        mode: config.mode,
        pid: process.pid,
        port: config.port,
        uptime: (Date.now() - startedAt) / 1_000,
        accepting_turns: !draining,
        successful_model_catalog_requests: successfulModelCatalogRequests,
        last_successful_model_catalog_request_at: lastSuccessfulModelCatalogRequestAt,
        ...activity(),
      });
    }
    if (req.method === "OPTIONS" && url.pathname.startsWith("/v1/control/")) {
      return new Response(null, { status: 204, headers: controlCorsHeaders() });
    }
    if (url.pathname.startsWith("/v1/control/") && !controlAuthorized(req)) {
      return new Response("Unauthorized", { status: 401, headers: controlCorsHeaders() });
    }
```

</details>

**依据 7 · 源码核查**：[src/server.ts:1157-1169](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/server.ts#L1157-L1169)

模型请求使用自己的 dispatch，没有控制令牌验证。

<details>
<summary>查看原文（13行）</summary>

```text
    if (req.method === "POST" && url.pathname === "/v1/responses") {
      if (draining) return formatErrorResponse(503, "server_error", "dsh-chatgpt-web is draining for a requested service operation");
      return httpTurns.track(
        (signal, bindIdentity) => responseRequest(
          new Request(req, { signal }),
          config,
          dependencies.adapterFactory,
          { onTurnIdentity: bindIdentity },
        ),
        req.signal,
        process.platform,
        "responses",
      );
```

</details>

**依据 8 · 源码核查**：[src/server.ts:450-484](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/server.ts#L450-L484)

模型请求先解析 JSON，按模型分流。

<details>
<summary>查看原文（35行）</summary>

```text
export async function responseRequest(
  req: Request,
  config: AppConfig,
  adapterFactory: ChatGptWebAdapterFactory = createChatGptWebAdapter,
  options: ResponseRequestOptions = {},
): Promise<Response> {
  const nativeRequest = req.clone();
  let raw: unknown;
  try {
    raw = await readJsonRequestBody(req);
  } catch (error) {
    return formatErrorResponse(
      400,
      "invalid_request_error",
      error instanceof Error ? error.message : "Request body must be valid JSON",
    );
  }
  const requestedModel = raw && typeof raw === "object" && !Array.isArray(raw)
    ? (raw as { model?: unknown }).model
    : undefined;
  try {
    const identity = extractCodexTurnIdentityFromBody(raw);
    if (identity.threadId && identity.turnId) {
      options.onTurnIdentity?.({ threadId: identity.threadId, turnId: identity.turnId });
    }
  } catch (error) {
    return formatErrorResponse(400, "invalid_request_error", error instanceof Error ? error.message : String(error));
  }
  if (typeof requestedModel === "string" && !isChatGptWebModelSlug(requestedModel)) {
    try {
      return await forwardNativeCodexRequest(nativeRequest, "responses", undefined, raw);
    } catch (error) {
      return formatErrorResponse(502, "upstream_error", error instanceof Error ? error.message : String(error));
    }
  }
```

</details>

#### 缺口

- 共享主机、进程级隔离和浏览器运行时的额外域状态未实测
  **影响**：访问边界只能按源码条件描述
  **进一步探讨**：用假浏览器状态和两种本地调用者检查模型及控制令牌的真实行为

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 一次 Luna 文本请求如何到网页并返回，模型名和窗口参数能否照用？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

模型 slug 通过代码表映射到适配器内部标识，源码把 Luna 对应写作 gpt-5.6-luna，和 README 的宣传字符串不同。代码先按本地已探测的账号能力过滤模型，具有 Sol 能力时 Luna slug 直接被拒，取模型清单比照抄 README 更能解释 400。请求解析提取本轮消息，适配器接收取消信号，并把提示及附件填进浏览器。浏览器等待当前提交的证据与响应，读取当前 DOM 轮次，最后把 Markdown、分段和终态交回 SSE 或整段 JSON。站点输入区域不可用、会话过期、限流和 SPA 状态变化都可在这个链路报错。Luna 名义 contextWindow 值是代码声明，兼容层另在发送前拒绝超过网页的字符或估算 token，不能用 105 万作实际单条提交能力。输出模型身份与当前网页真实能力都未运行核实。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-43](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/README.md#L35-L43)

作者对渠道名称和使用目标的描述。

```text
## Overview

**dsh-chatgpt-web** turns your local browser session of ChatGPT into a seamless, **$0.00 API-free conversational model provider** directly inside DeepSeek Harness (DSH).

It connects via headless or visible Chrome/Chromium browser automation to `chatgpt.com`, streaming real-time Markdown responses, code solutions, explanations, and reasoning back to your DSH chats without consuming API credits.

### Why Pure Chat?

Small conversational web models (like GPT-6 Luna) excel at explanations, dialogue, Q&A, brainstorming, code snippet generation, and side-assistant tasks. By running in **Pure Chat Mode**, the bridge eliminates prompt overhead, tool hallucinations, and syntax errors of autonomous multi-tool execution loops, providing a fast, rock-solid, zero-cost LLM provider.
```

**依据 2 · 源码核查**：[src/chatgpt-web-models.ts:1-8](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/chatgpt-web-models.ts#L1-L8)

代码中的模型标识。

```text
export const CHATGPT_WEB_MODEL_PREFIX = "chatgpt-web/";
export const CHATGPT_WEB_BACKEND_MODEL = "gpt-5.6-sol";
export const CHATGPT_WEB_LUNA_BACKEND_MODEL = "gpt-5.6-luna";
/** GPT-6 appears in the Plus picker (2026-10) alongside GPT-5.6 Sol. Selecting it is a
 *  pure browser-UI action (click the model row), so it needs no extra transport window. */
export const CHATGPT_WEB_GPT6_BACKEND_MODEL = "gpt-6";
/** Internal adapter identity for a turn whose ChatGPT model is selected by the user in the launcher. */
export const CHATGPT_WEB_ZERO_RISK_BACKEND_MODEL = "chatgpt-web-zero-risk";
```

**依据 3 · 源码核查**：[src/chatgpt-web-models.ts:430-442](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/chatgpt-web-models.ts#L430-L442)

按账号能力拒绝不适用的路线。

<details>
<summary>查看原文（13行）</summary>

```text
  if (route.backendModel === CHATGPT_WEB_LUNA_BACKEND_MODEL) {
    if (capabilities.solAvailable) {
      throw new Error(`${route.displayName} is only available for Luna-only accounts`);
    }
    return route;
  }
  if (!capabilities.solAvailable) {
    throw new Error(`${route.displayName} is not available for this Luna-only account`);
  }
  if (route.requiresPro && !capabilities.proAvailable) {
    throw new Error(`${route.displayName} is not available for this account`);
  }
  return route;
```

</details>

**依据 4 · 源码核查**：[src/adapters/chatgpt-web/browser-worker.ts:4758-4796](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/adapters/chatgpt-web/browser-worker.ts#L4758-L4796)

文件附加与根据当前基线发出请求。

<details>
<summary>查看原文（39行）</summary>

```text
                );
                submissionBaseline = await this.captureSubmissionBaseline(page);
              },
            );
            await diagnostics.capture(page, `${stagePrefix}connector-catalog-refreshed`);
          }
        }
        await diagnostics.capture(page, `${stagePrefix}prompt-attachment-complete`);
        await this.runStage(
          turn.traceId,
          `${stagePrefix}file_attachment`,
          browserStageTimeouts.fileAttachment,
          () => this.attachFiles(page, prepared),
        );
        await diagnostics.capture(page, `${stagePrefix}file-attachment-complete`);
        const finalSubmissionEvidence = await this.runStage(
          turn.traceId,
          `${stagePrefix}send`,
          // A multipart commit lands on a conversation already carrying every staged part, so it
          // needs the same acceptance headroom the stages themselves get.
          prepared.multipart ? browserStageTimeouts.multipartStageSend : browserStageTimeouts.send,
          (stageSignal) => this.sendAttachedPrompt(
            page,
            submissionBaseline,
            checkpoint => diagnostics.capture(page, checkpoint),
            turn.abortSignal ? AbortSignal.any([stageSignal, turn.abortSignal]) : stageSignal,
            turn.externalProgress,
            turn,
            completionTracker,
            toolTurnObservationRecovery
              ? async (...args) => {
                const recovered = await recoverSubmissionObservation(...args);
                submissionBaseline = recovered.baseline;
                return recovered;
              }
              : undefined,
          ),
        );
        console.info(`[chatgpt-web] browser turn ${turn.traceId} submission accepted evidence=${finalSubmissionEvidence}`);
```

</details>

**依据 5 · 源码核查**：[src/adapters/chatgpt-web/browser-worker.ts:5079-5100](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/adapters/chatgpt-web/browser-worker.ts#L5079-L5100)

浏览器内容转 Markdown 或提取续接摘要。

<details>
<summary>查看原文（22行）</summary>

```text
              try {
                return markdownBuffer.finish();
              } catch (error) {
                if (error instanceof ChatGptMarkdownConsistencyError) {
                  return { markdown: snapshot.visibleText, delta: "" };
                }
                throw error;
              }
            })();
            if (!final.markdown && snapshot.visibleText) {
              throw new Error("ChatGPT completed with visible text that could not be serialized as Markdown");
            }
            if (final.delta) emitMarkdownDelta(final.delta);
            if (checkpointStream) {
              const completed = checkpointStream.finishOptional(snapshot.visibleText);
              if (completed.visibleRemainder) turn.onTextDelta(completed.visibleRemainder);
              if (completed.captured) turn.onLunaCheckpoint!(completed.captured);
              else console.warn(`[chatgpt-web] browser turn ${turn.traceId} completed without a Luna rolling checkpoint; preserving full native history`);
              finalText = completed.answer;
            } else {
              finalText = final.markdown;
            }
```

</details>

**依据 6 · 源码核查**：[src/server.ts:571-621](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/server.ts#L571-L621)

事件传播和请求取消到 adapter。

<details>
<summary>查看原文（51行）</summary>

```text
  const adapter = adapterFactory(provider);
  const queue = new AsyncEventQueue<AdapterEvent>();
  const abort = new AbortController();
  if (req.signal.aborted) abort.abort();
  else req.signal.addEventListener("abort", () => abort.abort(), { once: true });
  const run = async () => {
    try {
      await adapter.runTurn!(parsed, { headers: req.headers, abortSignal: abort.signal }, event => {
        options.onAdapterEvent?.(event);
        queue.push(event);
      });
    } catch (error) {
      const event: AdapterEvent = { type: "error", message: error instanceof Error ? error.message : String(error) };
      options.onAdapterEvent?.(event);
      queue.push(event);
    } finally {
      queue.close();
    }
  };
  const maps = toolBridgeMaps(parsed);
  const responseModel = route.slug;

  if (parsed.stream) {
    void run();
    const stream = bridgeToResponsesSSE(
      queue,
      responseModel,
      maps.toolNsMap,
      maps.freeformToolNames,
      maps.toolSearchToolNames,
      () => abort.abort(),
      2_000,
      {
        hideThinkingSummary: parsed.options.hideThinkingSummary,
        ...(provider.chatgptWeb?.stallTimeoutSec !== undefined
          ? { stallTimeoutSec: provider.chatgptWeb.stallTimeoutSec }
          : {}),
        ...(compaction ? { compaction: true } : {
          ...(options.rememberState === false ? {} : {
            onCompletedResponse: (response: Record<string, unknown>) => rememberResponseState(parsed._rawBody, response, { force: true }),
          }),
        }),
      },
    );
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      },
```

</details>

**依据 7 · 源码核查**：[src/chatgpt-web-models.ts:68-81](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/chatgpt-web-models.ts#L68-L81)

目录窗口与更低的 composer 字符限制分开定义。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * The underlying Luna model owns this context window. ChatGPT Free's much smaller browser request
 * envelope is enforced separately at the browser boundary; rolling checkpoints keep completed
 * history out of later browser requests without asking Codex to compact its canonical history.
 */
export const CHATGPT_WEB_LUNA_CONTEXT_WINDOW = 1_050_000;
export const CHATGPT_WEB_BIGGER_CONTEXT_MULTIPLIER = 3;
/**
 * Measured Free-account composer boundary for the Luna route: a 119,341-character prompt enables
 * the send button within a second, while a 139,231-character prompt leaves it disabled
 * indefinitely. Above this boundary ChatGPT accepts the text into the ProseMirror composer but
 * never arms the send button, so the boundary must be enforced before the browser turn starts.
 */
export const CHATGPT_WEB_LUNA_COMPOSER_CHAR_LIMIT = 120_000;
```

</details>

#### 缺口

- 网页模型标识、有效输入上限和账号限制未独立验收
  **影响**：不能把项目配置或注释中的测量当可用承诺
  **进一步探讨**：短合成提示先确认实际模型清单和回执，再分级验证边界

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 一次请求取消、重复发送或失去续接状态时，如何区分回合结局？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

Responses 路径试图按 previous_response_id 还原上下文，缺对应记录时返回 409，避免只带不完整会话继续。完成的 SSE 回包使用 force 记缓存，输入与输出可保存在本机的 responses-state.json，故客户端 store:false 也不足以避免此兼容层留存。Luna 若缺 Codex turn_id，程序从消息串哈希造 turnId，无 threadId 则用同一固定 dsh-session。所有者键优先采线程身份，所以未带这些元数据的不同请求可能共享 owner 队列，后请求等待前请求的物理结算。同一 execution key 可复用已建回合。取消时浏览器尝试看见 Stop 按钮后按下，页面关闭或到时也可报错；控制状态和远端已发生处理不是同一事件。某些陈旧临时页可在限定条件刷新重试，复用已有对话不走这次刷新。使用合成任务检查已发送、已收尾和本机记录，尤其两个并行 DSH 会话可能缺少明确隔离键。

#### 证据与依据

**依据 1 · 源码核查**：[src/server.ts:509-515](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/server.ts#L509-L515)

缺续接状态直接 409。

```text
  if (typeof requestedPreviousResponseId === "string" && expanded === raw) {
    return formatErrorResponse(
      409,
      "invalid_request_error",
      "Local continuation state for previous_response_id is unavailable; refusing to run ChatGPT Web with partial Codex context. Compact the Codex task or start a new task before retrying.",
    );
  }
```

**依据 2 · 源码核查**：[src/server.ts:593-612](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/server.ts#L593-L612)

SSE 完成带 force 缓存。

<details>
<summary>查看原文（20行）</summary>

```text
  if (parsed.stream) {
    void run();
    const stream = bridgeToResponsesSSE(
      queue,
      responseModel,
      maps.toolNsMap,
      maps.freeformToolNames,
      maps.toolSearchToolNames,
      () => abort.abort(),
      2_000,
      {
        hideThinkingSummary: parsed.options.hideThinkingSummary,
        ...(provider.chatgptWeb?.stallTimeoutSec !== undefined
          ? { stallTimeoutSec: provider.chatgptWeb.stallTimeoutSec }
          : {}),
        ...(compaction ? { compaction: true } : {
          ...(options.rememberState === false ? {} : {
            onCompletedResponse: (response: Record<string, unknown>) => rememberResponseState(parsed._rawBody, response, { force: true }),
          }),
        }),
```

</details>

**依据 3 · 源码核查**：[src/responses/state.ts:204-229](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/responses/state.ts#L204-L229)

force 绕过 store:false，保存输入与输出。

<details>
<summary>查看原文（26行）</summary>

```text
export function rememberResponseState(
  requestBody: unknown,
  response: { id?: unknown; output?: unknown; status?: unknown; incomplete_details?: unknown },
  opts?: { force?: boolean },
): void {
  if (!requestBody || typeof requestBody !== "object" || Array.isArray(requestBody)) return;
  const request = requestBody as Record<string, unknown>;
  // `force` bypasses only the store:false skip: Codex sends `store:false` on every non-Azure
  // HTTP request (and WS inherits it), yet its WS turns still chain with previous_response_id.
  // The passthrough branch records with force so those chains can be expanded locally; the
  // store stays in-memory with a 1h TTL, so this is a proxy-internal continuation cache, not
  // real server-side response storage.
  if (request.store === false && !opts?.force) return;
  if (typeof response.id !== "string" || !Array.isArray(response.output)) return;
  if (response.status === "incomplete") {
    const details = response.incomplete_details;
    if (!details || typeof details !== "object" || Array.isArray(details)
      || (details as { reason?: unknown }).reason !== "max_output_tokens") return;
  } else if (response.status !== undefined && response.status !== "completed") return;
  ensureLoaded();
  setEntry(response.id, {
    createdAt: now(),
    items: [...inputItems(request.input), ...response.output],
  });
  pruneResponses();
  schedulePersist();
```

</details>

**依据 4 · 源码核查**：[src/responses/state.ts:111-132](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/responses/state.ts#L111-L132)

选定近期对话持久写入。

<details>
<summary>查看原文（22行）</summary>

```text
    const entries: [string, StoredResponseState][] = [];
    let total = 0;
    // Newest-first so the most recent chains survive both caps.
    for (const entry of [...states].reverse()) {
      // sizeBytes is in-memory accounting only; keep it out of the disk snapshot.
      const [id, state] = entry;
      const { sizeBytes: _sizeBytes, ...persistable } = state;
      const persistEntry: [string, StoredResponseState] = [id, persistable];
      const size = JSON.stringify(persistEntry).length;
      if (size > SNAPSHOT_ENTRY_MAX_BYTES) continue;
      if (total + size > SNAPSHOT_TOTAL_MAX_BYTES) break;
      total += size;
      entries.push(persistEntry);
    }
    entries.reverse();
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    // mkdirSync's mode only applies on creation — re-harden an existing config dir so the
    // conversation-content snapshot never lands in a group/world-readable directory.
    try { chmodSync(dirname(path), 0o700); } catch { /* best-effort (e.g. Windows) */ }
    atomicWriteFile(path, JSON.stringify({ version: 1, states: entries }));
  } catch {
    /* best-effort: disk trouble must never affect request handling */
```

</details>

**依据 5 · 源码核查**：[src/adapters/chatgpt-web/environment.ts:609-625](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/adapters/chatgpt-web/environment.ts#L609-L625)

Luna 的 DSH 兼容身份回退。

<details>
<summary>查看原文（17行）</summary>

```text
export function extractChatGptTurnIdentity(parsed: CodexParsedRequest): ChatGptTurnIdentity {
  const body = record(parsed._rawBody);
  const base = extractCodexTurnIdentityFromBody(body);
  if (!base.turnId && parsed.modelId === CHATGPT_WEB_LUNA_MODEL_ID) {
    const contentHash = createHash("sha256")
      .update(JSON.stringify(parsed.context.messages))
      .digest("hex")
      .slice(0, 16);
    return {
      threadId: base.threadId ?? "dsh-session",
      turnId: `dsh-luna-${contentHash}`,
      ...(base.parentThreadId ? { parentThreadId: base.parentThreadId } : {}),
      ...(base.agentName ? { agentName: base.agentName } : {}),
      ...(base.subagentKind ? { subagentKind: base.subagentKind } : {}),
      ...(typeof body?.prompt_cache_key === "string" ? { promptCacheKey: body.prompt_cache_key } : {}),
    };
  }
```

</details>

**依据 6 · 源码核查**：[src/adapters/chatgpt-web/turn-execution.ts:227-239](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/adapters/chatgpt-web/turn-execution.ts#L227-L239)

优先线程作为浏览器所有者。

<details>
<summary>查看原文（13行）</summary>

```text
/** One native Codex thread may own at most one live ChatGPT browser surface. */
export function chatGptThreadOwnershipKey(parsed: CodexParsedRequest): string {
  const identity = extractChatGptTurnIdentity(parsed);
  const owner = identity.threadId
    ? { kind: "thread", id: identity.threadId }
    : identity.promptCacheKey
      ? { kind: "prompt_cache", id: identity.promptCacheKey }
      : identity.turnId
        ? { kind: "turn", id: identity.turnId }
        : undefined;
  if (!owner) throw new Error("ChatGPT web requires native Codex turn identity metadata for browser ownership");
  return createHash("sha256").update(JSON.stringify(owner)).digest("hex");
}
```

</details>

**依据 7 · 源码核查**：[src/adapters/chatgpt-web/turn-execution.ts:527-552](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/adapters/chatgpt-web/turn-execution.ts#L527-L552)

复用执行或等待同 owner 结算。

<details>
<summary>查看原文（26行）</summary>

```text
    for (;;) {
      if (signal?.aborted) throw new DOMException("ChatGPT web turn aborted", "AbortError");
      const existing = this.entries.get(key);
      if (existing) {
        existing.touch();
        return existing;
      }
      const pending = this.retirements.get(key) ?? this.ownerRetirements.get(ownerKey);
      if (pending) {
        await awaitWithAbort(pending, signal);
        continue;
      }
      const activeOwner = [...this.entries].find(([ownedKey, session]) => (
        ownedKey !== key && session.ownerKey === ownerKey && !session.isPhysicallySettled()
      ));
      if (activeOwner) {
        const [, ownedSession] = activeOwner;
        // A different native message for the same thread is sequential work, not permission to
        // kill the response already using that retained conversation. Wait for its complete
        // browser/launcher settlement; explicit tab close and lifecycle cancellation remain the
        // only paths that preempt an active owner.
        await awaitWithAbort(ownedSession.physicalSettlement, signal);
        continue;
      }
      if (signal?.aborted) throw new DOMException("ChatGPT web turn aborted", "AbortError");
      return this.getOrCreate(key, start, traceId, ownerKey, nativeTurnId, nativeThreadId);
```

</details>

**依据 8 · 源码核查**：[src/adapters/chatgpt-web/browser-worker.ts:4821-4832](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/adapters/chatgpt-web/browser-worker.ts#L4821-L4832)

只有符合条件的临时页陈旧才可恢复。

<details>
<summary>查看原文（12行）</summary>

```text
      const surfaceStaleRecoveryAttempts = 2;
      let responseTurn: ChatGptAssistantTurnBinding;
      for (let surfaceStaleAttempt = 1; ; surfaceStaleAttempt++) {
        try {
          responseTurn = await sendAndWaitForResponse(surfaceStaleAttempt);
          break;
        } catch (error) {
          if (!(error instanceof ChatGptSurfaceStaleError)
            || surfaceStaleAttempt >= surfaceStaleRecoveryAttempts
            || reuseConversation) {
            throw error;
          }
```

</details>

**依据 9 · 源码核查**：[src/adapters/chatgpt-web/browser-worker.ts:4902-4914](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/adapters/chatgpt-web/browser-worker.ts#L4902-L4914)

浏览器取消尝试、超时和错误。

<details>
<summary>查看原文（13行）</summary>

```text
        if (page.isClosed()) {
          throw chatGptBrowserTabClosedError();
        }
        if (turn.abortSignal?.aborted) {
          const stop = page.locator(CHATGPT_STOP_BUTTON_SELECTOR).last();
          if (await stop.isVisible().catch(() => false)) await stop.press("Enter").catch(() => {});
          throw new DOMException("ChatGPT web turn aborted", "AbortError");
        }
        if (deadline !== undefined && Date.now() >= deadline) {
          throw new Error("ChatGPT web turn timed out");
        }
        await throwIfChatGptSessionFailureAlert(page);
        await throwIfChatGptTerminalErrorAlert(responseTurn.locator);
```

</details>

#### 缺口

- 实际 DSH 是否普遍传 thread metadata 未验证
  **影响**：只确认回退条件可能共享 owner，无证据称生产已互串或重复
  **进一步探讨**：采集脱敏请求形状，以两条隔离对话回放同 owner、显式独立和取消测试

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么读者适合先观察，当前材料能证明多少成本和可用性？

**研究主题**：采用判断、效果与总成本

#### 完整回答

适合想评估同一 DSH 窗口内完成一次公开短问答的用户先观察。安装需要符合包清单的 Node、Bun 开发链或对应发布产物、兼容 DSH 和本地 Chrome；首次有独立登录和 profile 配置成本，持续维护浏览器会话、站点 DOM 和等待时间，失败需要分别查账户、并发与进程状态。项目的 tarball smoke 文件包含干净安装、解析 Playwright 和 tiktoken；脚本内容不能证明本轮完成浏览器及 DSH 真机验收。README 的无 API 费用是项目定位，费用、账户政策、用量和真实业务结果都未核实，部署仍有本机和人工资源。看到登录状态不稳、应答未完整收束、未知实际身份、共享主机可达或端口关闭不清楚时，不应把桥接作为默认 provider，回到原有入口处理。不以该项目替代受控正式接口。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:51-69](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/package.json#L51-L69)

声明构建与浏览器依赖。

<details>
<summary>查看原文（19行）</summary>

```text
  "scripts": {
    "build": "bun build src/cli.ts src/plugin.ts --outdir lib --target node --format esm --packages external",
    "start": "node lib/cli.js serve",
    "setup": "node lib/cli.js setup",
    "login": "node lib/cli.js login",
    "doctor": "node lib/cli.js doctor",
    "test": "node scripts/smoke-tarball.mjs",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.30.0",
    "ajv": "8.20.0",
    "ajv-formats": "3.0.1",
    "chromium-bidi": "12.1.0",
    "fflate": "^0.8.2",
    "playwright-core": "^1.62.0",
    "tiktoken": "1.0.22",
    "turndown": "7.2.0",
    "turndown-plugin-gfm": "1.0.2",
```

</details>

**依据 2 · 源码核查**：[package.json:77-89](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/package.json#L77-L89)

声明运行与兼容范围。

<details>
<summary>查看原文（13行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^3.0.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/cordis": {
      "optional": true
    }
  },
  "engines": {
    "bun": ">=1.3.0",
    "node": ">=22.19.0",
    "dsh": ">=0.2.0-rc.2"
  },
```

</details>

**依据 3 · 源码核查**：[scripts/smoke-tarball.mjs:173-212](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/scripts/smoke-tarball.mjs#L173-L212)

脚本具体检查干净依赖解析及 tokenizer。

<details>
<summary>查看原文（40行）</summary>

```text
  // 7. Runtime dependency resolution from the clean install.
  const depCheck = run(
    process.execPath,
    [
      "-e",
      [
        "const { createRequire } = require('node:module');",
        `const req = createRequire(process.cwd() + '/node_modules/${packageName}/lib/cli.js');`,
        "console.log(req.resolve('playwright-core/package.json'));",
        "console.log(req.resolve('tiktoken'));",
      ].join("\n"),
    ],
    { cwd: cleanDir },
  );
  const depLines = (depCheck.stdout || "").trim().split("\n").filter(Boolean);
  if (depCheck.status !== 0 || depLines.length !== 2) {
    fail(`dependency resolution check failed: ${(depCheck.stderr || depCheck.stdout).trim().slice(-400)}`);
  } else {
    const [pwPath, twPath] = depLines;
    if (!pwPath.startsWith(cleanDir) || !twPath.startsWith(cleanDir)) {
      fail(`dependencies resolve outside the clean install: ${pwPath} | ${twPath}`);
    } else {
      ok("playwright-core and tiktoken resolve from the clean install");
    }
  }

  // 8. tiktoken actually loads (wasm) from the clean install.
  const twLoad = run(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      "import { get_encoding } from 'tiktoken'; get_encoding('cl100k_base').encode('smoke'); console.log('tiktoken-ok');",
    ],
    { cwd: cleanDir },
  );
  if (twLoad.status === 0 && /tiktoken-ok/.test(twLoad.stdout)) {
    ok("tiktoken loads from the clean install");
  } else {
    fail(`tiktoken failed to load from the clean install: ${(twLoad.stderr || twLoad.stdout).trim().slice(-400)}`);
```

</details>

**依据 4 · 作者声明**：[README.md:216-221](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/README.md#L216-L221)

作者对非官方、用量及纯聊天的说明。

```text
## Notes & Limitations

1. **Unofficial Bridge:** Operates via local Playwright browser automation on `chatgpt.com`. Not affiliated with or endorsed by OpenAI.
2. **Single-Session Concurrency:** Runs within a single browser tab. Sequential queries and normal DSH agent chats work seamlessly; avoid launching parallel multi-subagent swarms against the same tab simultaneously.
3. **Pure Chat Only:** This provider generates pure conversational responses, explanations, reasoning, and code blocks. It does not execute local filesystem, terminal, or autonomous tool loops.
4. **Standard Free Tier Rate Limits:** Subject to standard OpenAI free-tier hourly usage limits.
```

**依据 5 · 源码核查**：[src/server.ts:921-934](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/server.ts#L921-L934)

健康输出只含过程信息。

<details>
<summary>查看原文（14行）</summary>

```text
    if (req.method === "GET" && url.pathname === "/healthz") {
      return Response.json({
        status: "ok",
        service: "dsh-chatgpt-web",
        version: VERSION,
        mode: config.mode,
        pid: process.pid,
        port: config.port,
        uptime: (Date.now() - startedAt) / 1_000,
        accepting_turns: !draining,
        successful_model_catalog_requests: successfulModelCatalogRequests,
        last_successful_model_catalog_request_at: lastSuccessfulModelCatalogRequestAt,
        ...activity(),
      });
```

</details>

#### 缺口

- 没有真实 DSH、网页账号或可控实验结果
  **影响**：不能承诺 Browser host 的成功率、节省量和长期兼容
  **进一步探讨**：在明确授权且隔离的宿主用合成会话衡量启动和失效恢复

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 让宿主明确传稳定会话身份和显示已提交状态，会减少重复工作吗？

**研究主题**：新假设与验证

#### 完整回答

提出待验证设计。为 DSH provider 接入增加明确、去敏的宿主会话标识和命令回合 ID；在浏览器已经确认发送却尚未输出结果时，向宿主保存提交收据。这样两个不提供 Codex 原生字段的 DSH 会话可以分开回放，而连接重试可先查原提交。该想法来自缺省 dsh-session owner、按执行身份复用和读取网页提交证据的组合。它仍依赖跨断线能识别先前网页回合；收据如果只写在本机却没有实际提交证据，仍会让用户误判。用两条隔离对话和一个受控浏览器 stub 重放断流、重复提交、标签关闭和 owner 退出，比对错误串线、重复提交、原答复丢失和恢复时间。若标识变化频繁或 stale 回包依然占住新会话，收益在该边界不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapters/chatgpt-web/environment.ts:609-625](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/adapters/chatgpt-web/environment.ts#L609-L625)

Luna 兼容路径的默认身份。

<details>
<summary>查看原文（17行）</summary>

```text
export function extractChatGptTurnIdentity(parsed: CodexParsedRequest): ChatGptTurnIdentity {
  const body = record(parsed._rawBody);
  const base = extractCodexTurnIdentityFromBody(body);
  if (!base.turnId && parsed.modelId === CHATGPT_WEB_LUNA_MODEL_ID) {
    const contentHash = createHash("sha256")
      .update(JSON.stringify(parsed.context.messages))
      .digest("hex")
      .slice(0, 16);
    return {
      threadId: base.threadId ?? "dsh-session",
      turnId: `dsh-luna-${contentHash}`,
      ...(base.parentThreadId ? { parentThreadId: base.parentThreadId } : {}),
      ...(base.agentName ? { agentName: base.agentName } : {}),
      ...(base.subagentKind ? { subagentKind: base.subagentKind } : {}),
      ...(typeof body?.prompt_cache_key === "string" ? { promptCacheKey: body.prompt_cache_key } : {}),
    };
  }
```

</details>

**依据 2 · 源码核查**：[src/adapters/chatgpt-web/turn-execution.ts:527-552](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/adapters/chatgpt-web/turn-execution.ts#L527-L552)

owner 和 execution 的重用、等待语义。

<details>
<summary>查看原文（26行）</summary>

```text
    for (;;) {
      if (signal?.aborted) throw new DOMException("ChatGPT web turn aborted", "AbortError");
      const existing = this.entries.get(key);
      if (existing) {
        existing.touch();
        return existing;
      }
      const pending = this.retirements.get(key) ?? this.ownerRetirements.get(ownerKey);
      if (pending) {
        await awaitWithAbort(pending, signal);
        continue;
      }
      const activeOwner = [...this.entries].find(([ownedKey, session]) => (
        ownedKey !== key && session.ownerKey === ownerKey && !session.isPhysicallySettled()
      ));
      if (activeOwner) {
        const [, ownedSession] = activeOwner;
        // A different native message for the same thread is sequential work, not permission to
        // kill the response already using that retained conversation. Wait for its complete
        // browser/launcher settlement; explicit tab close and lifecycle cancellation remain the
        // only paths that preempt an active owner.
        await awaitWithAbort(ownedSession.physicalSettlement, signal);
        continue;
      }
      if (signal?.aborted) throw new DOMException("ChatGPT web turn aborted", "AbortError");
      return this.getOrCreate(key, start, traceId, ownerKey, nativeTurnId, nativeThreadId);
```

</details>

**依据 3 · 源码核查**：[src/adapters/chatgpt-web/browser-worker.ts:4773-4796](https://github.com/WLV-ZEDD/dsh-chatgpt-web/blob/b13435383e2ddffea24fde660c850392ff0caf97/src/adapters/chatgpt-web/browser-worker.ts#L4773-L4796)

已有浏览器提交证据，可作为假设起点。

<details>
<summary>查看原文（24行）</summary>

```text
        const finalSubmissionEvidence = await this.runStage(
          turn.traceId,
          `${stagePrefix}send`,
          // A multipart commit lands on a conversation already carrying every staged part, so it
          // needs the same acceptance headroom the stages themselves get.
          prepared.multipart ? browserStageTimeouts.multipartStageSend : browserStageTimeouts.send,
          (stageSignal) => this.sendAttachedPrompt(
            page,
            submissionBaseline,
            checkpoint => diagnostics.capture(page, checkpoint),
            turn.abortSignal ? AbortSignal.any([stageSignal, turn.abortSignal]) : stageSignal,
            turn.externalProgress,
            turn,
            completionTracker,
            toolTurnObservationRecovery
              ? async (...args) => {
                const recovered = await recoverSubmissionObservation(...args);
                submissionBaseline = recovered.baseline;
                return recovered;
              }
              : undefined,
          ),
        );
        console.info(`[chatgpt-web] browser turn ${turn.traceId} submission accepted evidence=${finalSubmissionEvidence}`);
```

</details>

#### 缺口

- 没有实现或实测该收据
  **影响**：不能把它计入当前功能或保证
  **进一步探讨**：以合成生命周期事件对照原有路径与新身份收据

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
