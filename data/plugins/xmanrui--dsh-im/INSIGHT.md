# DSH-IM

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3a0a987](https://github.com/xmanrui/dsh-im/tree/3a0a9871137da94c646547865e999043a2a2c44d)

<!-- BEGIN META -->
[![GitHub ★ 3,266](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C266&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xmanrui/dsh-im) [![npm 30d 106,140](https://img.shields.io/static/v1?label=npm+30d&message=106%2C140&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xmanrui/dsh-im) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xmanrui/dsh-im)
<!-- END META -->

> **功能**：把多种IM机器人接入DSH并回传会话结果，统一管理渠道与AI Office连接。

> **亮点**：[Q02](#research-q02)实际身份到工作区会话/Host调用与平台回传；[Q04](#research-q04)明确unknown不盲重试、snapshot/回执与有边界的恢复机制。

> **主要限制**：[Q03](#research-q03)新QQ bot默认open含命令，访问不替工具授权/Host认证；[Q04](#research-q04)写pending失败会继续，跨Host/平台非事务，workspace非文件安全根。

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
  - [Q01 · DSH-IM交付什么，远程入口价值与原生能力怎样比较？](#detail-section-11)
  - [Q02 · QQ消息如何真正提交Host并回到平台？](#detail-section-12)
  - [Q03 · 默认谁能发消息/命令，聊天身份能替工具授权吗？](#detail-section-13)
  - [Q04 · 重启、超时、取消和文件回传能提供怎样的恢复边界？](#detail-section-14)
  - [Q05 · 何时值得接入，费用与退路怎样核？](#detail-section-15)
  - [Q06 · 在已有receipt/去重之外，怎样验证更可靠的交付方向？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：@xmanrui/dsh-im5.10.0是社区维护的DSH原生IM桥接插件，MIT/Node>=22.19，包提供bundle与Web设置入口；多平台/AI Office是作者能力范围，不能凭名称当全渠道验收。本轮以QQ普通消息链为代表，不运行登录/发送/Host；相应机器人账号、平台SDK/网络、凭据与本机DSH/模型/工作区是条件，客户端版本兼容声明不是实测。

原生DSH Web/桌面、可信远程访问或自建最小桥，需以正确目标/文件范围和恢复成本对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| QQ消息/Host | 远程任务 | 新bot默认open须收紧 |
| 会话绑定 | bot工作区/聊天 | 非模型工具授权替代 |
| 文字/附件回传 | 返回结果 | unknown/部分送达 |
| pending/stop | 有边界恢复/取消请求 | 非原子执行/外部回滚 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 必需性 | 用途 | 缺失/边界 |
|---|---|---|---|
| Node>=22.19/兼容DSH/工作区模型 | 必需 | 真实Host任务 | 作者兼容声明非运行验收 |
| QQ账号机器人/固定SDK/凭据/网络 | QQ必需 | 接收/回传 | SDK/平台本轮未独立审 |
| 单人allowlist/最小权限 | 采用前提 | 限输入/命令 | 新bot默认open |
| Host工具/管理认证 | 必需 | 控执行/设置 | 不能由聊天权限替代 |
| 文件外发范围/正确target | 附件必需 | 本机读→平台 | workspace非磁盘安全根 |

#### 启动步骤

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 比较 | 先原生Web/明确远程需求 | 便利需超过维护 |
| 收紧 | 测试bot/allowlist/禁群/命令 | 不沿新bot默认open |
| 小试 | 确定文本任务/后批准文件 | 核Host/平台ID/目标 |
| 故障 | 写失败/超时/部分发送 | 未知先对账不重跑 |
| 退出 | 断连/核在途/撤凭据/查状态 | 不撤已发与工具副作用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 平台/模型/Host资源未知 | 凭据/权限/版本/工作区 | 不运行账号安装 |
| 持续 | token/网络/附件/状态未知 | 轮换/审批/对账 | replyTimeout非费用封顶 |
| 故障 | 重复/未知请求/备份未知 | 核ID/文件/恢复 | pending写失败可继续 |
| 退出 | 凭据/消息/文件留存未知 | 停在途/撤凭据/清状态 | 断连非撤回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 远程任务 | QQ到Host真实prompt | 全渠道/正确率 |
| 访问策略 | 实际open/allowlist/命令判定 | Host完整工具授权 |
| 投递 | SDK发送/分片/unknown | 完整送达/用户阅读 |
| 恢复 | pending/ID确认/正常stop | 不丢不重/外部回滚 |

> **思考**：[Q03](#research-q03)新QQ bot默认open含命令，访问不替工具授权/Host认证；[Q04](#research-q04)写pending失败会继续，跨Host/平台非事务，workspace非文件安全根。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)实际身份到工作区会话/Host调用与平台回传；[Q04](#research-q04)明确unknown不盲重试、snapshot/回执与有边界的恢复机制。

[Q04](#research-q04)将unknown与明确拒绝分开、snapshot摘要/consumer与提交ID有价值；持久写吞错、提交前标记窗口/真实权限要另核。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)新QQ bot默认open含命令，访问不替工具授权/Host认证；[Q04](#research-q04)写pending失败会继续，跨Host/平台非事务，workspace非文件安全根。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)观察；需用先单人allowlist/测试bot/隔离工作区，默认open与文件范围未清不接生产，未知回Host/平台对账。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

代表QQ链静态可追；新bot开放默认、Host/文件授权与跨系统恢复需先核，观察且不接生产数据。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、plugin-src/host/channels/qq/index.mjs、plugin-src/host/channels/qq/production.mjs、plugin-src/host/channels/shared/access-policy-production.mjs、plugin-src/host/index.mjs、plugin-src/host/modern-harness-api.mjs、plugin-src/host/rpc-authority.mjs、plugin-src/management-rpc.mjs、src/channels/qq/markdown-reply.mjs、src/channels/qq/qq-bridge.mjs、src/channels/qq/qq-runtime.mjs、src/channels/qq/state-store.mjs、src/channels/shared/access-policy.mjs、src/channels/shared/control-command.mjs、src/channels/shared/harness-client.mjs、src/channels/shared/inbound-access.mjs、src/channels/shared/semantic/artifact-delivery.mjs、src/channels/shared/semantic/artifact.mjs、src/channels/shared/semantic/delivery.mjs、src/channels/shared/workspace-session.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：12旧findings当前完整复核；核根原生身份/QQ production→SDK事件→访问/去重→workspace/session→Host gateway prompt代表链、结果SDK send、pending持久/写失败/重启与timeout/stop、文件stage/result commit/snapshot/materialize/receipt、管理RPC信任声明；未全审916统计文件、所有渠道/Office/群历史/命令审批、Host工具认证/SDK网络与deferred全部恢复。
- 下一步：只读固定源码，不安装/登录/启动SDK或Host/发送消息/模型/测试；无真实任务、可靠投递、安全/费用、取消/崩溃恢复独立验证。

**分析版本**

- **仓库**：[xmanrui/dsh-im](https://github.com/xmanrui/dsh-im)
- **版本号**：5.10.0（[固定提交 3a0a987](https://github.com/xmanrui/dsh-im/tree/3a0a9871137da94c646547865e999043a2a2c44d)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)跨授权/Host请求/允许目标文件/平台回执收据与恢复责任，对比原Web/人工清单小修，未验证。

只读固定源码，不安装/登录/启动SDK或Host/发送消息/模型/测试；无真实任务、可靠投递、安全/费用、取消/崩溃恢复独立验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 402 | 103030 | 89949 | 7424 | — |
| .md | source | 106 | 24839 | — | — | 488807 |
| .js | source | 92 | 50570 | 48023 | 1295 | — |
| .mjs | test | 306 | 136212 | 125283 | 2498 | — |
| .js | test | 4 | 575 | 549 | 8 | — |
| .mjs | example | 3 | 322 | 290 | 12 | — |
| .js | example | 2 | 78 | 73 | 5 | — |
| .md | example | 1 | 34 | — | — | 223 |

</details>

**活跃度**

[![近30天新建 121](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=121&color=737b86&logo=github)](https://github.com/xmanrui/dsh-im/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 57](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=57&color=737b86&logo=github)](https://github.com/xmanrui/dsh-im/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：以QQ代表链核消息身份→真实Host提交→平台文字/文件回执，限定默认策略、持久化/未知/取消边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH-IM交付什么，远程入口价值与原生能力怎样比较？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

@xmanrui/dsh-im5.10.0是社区维护的DSH原生IM桥接插件，MIT/Node>=22.19，包提供bundle与Web设置入口；多平台/AI Office是作者能力范围，不能凭名称当全渠道验收。本轮以QQ普通消息链为代表，不运行登录/发送/Host；相应机器人账号、平台SDK/网络、凭据与本机DSH/模型/工作区是条件，客户端版本兼容声明不是实测。

需要从授权私聊发一项本机任务、把结果返回明确会话的用户，可比较原生DSH Web/桌面、可信远程访问或自己搭桥。贡献是消息身份/工作区会话映射、回执/恢复与统一配置，不是新模型或替Host完成全部工具授权。成功要正确人/会话/文件范围、任务结果可核且未知投递可对账，不是机器人连接绿灯或messagesReplied计数。跨平台可用/群聊/Office/所有命令另审，不由QQ推出。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:94-98](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/README.md#L94-L98)

作者统一IM/AI Office功能范围，非全渠道独立验收。

```text
## 简介

通过扫码、App Manifest 或已有机器人凭据把 IM 机器人接入 DeepSeek Harness，并让本机 Harness 主动连接公网 AI Office。一个插件、一个设置入口，统一管理内置 IM 渠道和 AI Office Connector。**每个 IM 渠道都支持接入多个机器人**，各机器人的连接状态、工作区、模型和会话绑定彼此独立；iMessage 是本机 Messages.app 身份接入的例外，详见[iMessage 渠道说明](docs/imessage.md)。

Connect IM bots to DeepSeek Harness by scanning a QR code, using an App Manifest, or entering existing bot credentials, and let the local Harness connect outward to a public AI Office. One plugin and one settings entry manage the built-in IM channels and the AI Office Connector.
```

**依据 2 · 作者声明**：[README.md:66-66](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/README.md#L66-L66)

作者明确社区独立维护。

```text
      <p>本项目由社区开发者独立开发与维护。</p>
```

**依据 3 · 源码核查**：[package.json:1-5](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/package.json#L1-L5)

原生包当前名称/版本。

```text
{
  "name": "@xmanrui/dsh-im",
  "version": "5.10.0",
  "icon": "./assets/logo-plugin-message-link-gradient.webp",
  "description": "把微信、飞书、企微、钉钉、QQ、Telegram、WhatsApp、Slack、Discord、Matrix接入DSH。 Connect Telegram, WhatsApp, Slack, Discord, Matrix, WeChat, Feishu, WeCom, DingTalk, and QQ to DSH.",
```

**依据 4 · 源码核查**：[package.json:28-29](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/package.json#L28-L29)

MIT声明。

```text
  "author": "xmanrui (https://github.com/xmanrui)",
  "license": "MIT",
```

**依据 5 · 源码核查**：[package.json:77-100](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/package.json#L77-L100)

bundle/client与作者兼容声明。

<details>
<summary>查看原文（24行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    },
    "compatibility": {
      "dsh": "0.2.1-rc.2",
      "dshReleases": {
        "0.2.0-rc.2": "compatible",
        "0.2.1-rc.2": "compatible"
      },
      "profiles": [
        "web"
      ]
    }
```

</details>

**依据 6 · 源码核查**：[package.json:107-115](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/package.json#L107-L115)

Node及QQ SDK固定依赖。

```text
  "engines": {
    "node": ">=22.19"
  },
  "dependencies": {
    "@matrix-org/olm": "3.2.15",
    "@tencent-connect/qqbot-connector": "1.2.0",
    "@tencent-connect/qqbot-nodejs": "1.0.4",
    "@wecom/aibot-node-sdk": "1.0.7",
    "dingtalk-stream": "2.1.4",
```

**依据 7 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/cordis.patch.yml#L1-L3)

真实DSH加载行。

```text
- insert:
    - id: xmanrui-dsh-im
      name: '@xmanrui/dsh-im'
```

**依据 8 · 源码核查**：[plugin-src/host/index.mjs:80-90](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/index.mjs#L80-L90)

真实多渠道集合含QQ。

<details>
<summary>查看原文（11行）</summary>

```text
  const channels = [
    ['feishu', startFeishu],
    ['weixin', startWeixin],
    ['dingtalk', startDingtalk],
    ['wecom', startWecom],
    ['wecomApp', startWecomApp],
    ['qq', startQq],
    ['slack', startSlack],
    ['telegram', startTelegram],
    ['discord', startDiscord],
    ['whatsapp', startWhatsapp],
```

</details>

**依据 9 · 源码核查**：[plugin-src/host/channels/qq/index.mjs:5-17](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/channels/qq/index.mjs#L5-L17)

QQ真实Host服务注入与production。

<details>
<summary>查看原文（13行）</summary>

```text
export const name = 'dsh-im-qq-host';
export const inject = ['connection', 'credentials', 'typertGateway'];

export async function apply(ctx, config = {}) {
  if (config?.controller) {
    return installQqRpc(ctx, config.controller, config.rpcOptions, config.rpcAuthority);
  }
  return installProductionChannel(ctx, config, {
    channel: 'qq',
    rpcChannel: QQ_RPC_CHANNEL,
    createProduction: () => createProductionController(ctx, config, config.internals),
    createHandler: controller => createQqRpcHandler(controller, config.rpcOptions),
  });
```

</details>

#### 缺口

- 实际平台/发行包/Host兼容、任务需求和收益未验证。
  **影响**：不能按渠道数/热度或连接成功推荐生产。
  **进一步探讨**：先核所需一个渠道/授权人/隔离工作区，用已知任务对照原生Web。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · QQ消息如何真正提交Host并回到平台？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根host逐渠道启动，QQ production构造credentials/config/state/workspaces及本机Host apiProxy，new Runtime注入bot专属workspace/state/accessPolicy。runtime实例化QQ SDK WebSocket机器人、挂message→bridge.accept并start；不是仅列配置。bridge先校消息ID/发送者/类型/seen/进程accepted去重，对addressed事件评策略，随后入队普通消息。

普通任务askInWorkspaceSession在绑定锁下查/建所属工作区session、持久绑定并核切换generation，准备内容后session.ask。shared HarnessClient将session.prompt以queue/content、稳定promptRpcId提交：本机apiProxy→modern sessions.prompt→gateway.invoke(session,prompt,requestId...)，外部URL另走HTTP；这是提交真实Host执行入口，不是插件自行模型工具循环。Host权限与实际工具副作用仍属宿主，源码不能保证任务完成。

返回answer后优先已有stream结果，不成走sendMarkdownReply→SDK bot.send msgType2分片，明确Markdown被拒可回纯文本，收平台messageIds；附件另走共同materialize/SDK sendFile，汇总receipt。API响应/回执并不证明目标人读到或任务正确。SDK是固定依赖，本轮未独立审它的网络实现/平台现时可达性。

#### 证据与依据

**依据 1 · 源码核查**：[plugin-src/host/index.mjs:249-258](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/index.mjs#L249-L258)

根真实各渠道启动/失败记录。

<details>
<summary>查看原文（10行）</summary>

```text
    await Promise.all(channels.map(async ([channel, start]) => {
      try {
        await start(ctx, channelConfig(config, channel, deliveryService));
      } catch (error) {
        failures.push(error);
        logger.error?.(`[dsh-im] failed to activate ${channel}; continuing with the remaining channels`, error);
      }
    }));
    if (failures.length === channels.length) {
      throw new AggregateError(failures, 'dsh-im failed to activate every channel');
```

</details>

**依据 2 · 源码核查**：[plugin-src/host/channels/qq/production.mjs:48-72](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/channels/qq/production.mjs#L48-L72)

真实credentials/config/workspace状态准备。

<details>
<summary>查看原文（25行）</summary>

```text
export async function createProductionController(ctx, config = {}, internals = {}) {
  if (!ctx?.credentials) throw new TypeError('dsh-im QQ requires ctx.credentials');
  const connection = harnessConnection(ctx, config, { competitiveApprovals: true });

  const ConfigStore = internals.ConfigStore ?? QqConfigStore;
  const StateStore = internals.StateStore ?? QqStateStore;
  const Harness = internals.HarnessClient ?? QqHarnessClient;
  const Controller = internals.Controller ?? QqController;
  const Runtime = internals.Runtime ?? QqRuntime;
  const QrAuth = internals.QrAuth ?? QqQrAuth;
  const createSupervisor = internals.createConnectionSupervisor ?? createConnectionSupervisor;
  const logger = typeof ctx.logger === 'function' ? ctx.logger('dsh-im:qq') : (ctx.logger ?? console);
  const agentPresetCatalog = () => listAgentPresetCatalog(ctx);
  const paths = pluginPaths(config);
  const configStore = await new ConfigStore(paths.config).load();
  const { defaultWorkspace, ungroupedWorkspace } = await prepareBotWorkspace(config);
  const WorkspaceStore = internals.WorkspaceStore ?? BotWorkspaceStore;
  const workspaces = internals.workspaces
    ?? await new WorkspaceStore(paths.workspaces, { defaultWorkspace, ungroupedWorkspace, groupByAgentPreset: config.groupByAgentPreset }).load();
  const configuredBots = configStore.list();
  await workspaces.reconcile(configuredBots.map((bot) => bot.botId));
  await Promise.all(configuredBots.map((bot) => workspaces.ensure(bot.botId, {
    defaultAgentPreset: config.agentPreset,
    initialAccessPolicy: initialAccessPolicyFor('qq', bot),
  })));
```

</details>

**依据 3 · 源码核查**：[plugin-src/host/channels/qq/production.mjs:117-155](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/channels/qq/production.mjs#L117-L155)

真实Harness/runtime注入作用域和策略。

<details>
<summary>查看原文（39行）</summary>

```text
  const harness = new Harness({
    ...connection,
    workspace: defaultWorkspace,
    ungroupedWorkspace,
    autostart: false,
    dshBin: config.dshBin ?? 'dsh',
    ...(commandExecutor ? { commandExecutor } : {}),
    ...(controlExecutor ? { controlExecutor } : {}),
    ...(sessionMaintenanceExecutor ? { sessionMaintenanceExecutor } : {}),
    ...(fileIngressExecutor ? { fileIngressExecutor } : {}),
    imageInputPolicy: () => getImageInputSettingsStore(config).get(),
  });
  const modelCatalog = (options) => listModelCatalog(harness, options);
  const coreController = new Controller({
    qrAuth,
    credentials: ctx.credentials,
    configStore: observedConfigStore,
    logger,
    createRuntime: async ({ botId, config: botConfig, appSecret }) => {
      const state = await stateFor(botId);
      await workspaces.ensure(botId, {
        defaultAgentPreset: config.agentPreset,
        initialAccessPolicy: newBotAccessPolicyFor('qq', botConfig),
      });
      const workspaceScope = createBotWorkspaceScope(harness, {
        dsBot: config.deliveryService?.dsBot,
        botId, workspaces, state, agentPresetCatalog,
      });
      return new Runtime({
        config: botConfig,
        appSecret,
        harness: workspaceScope.harness,
        state: workspaceScope.state,
        groupHistory: internals.groupHistory ?? getGroupHistoryStore(ctx, config),
        contextEnhancement: { botId, getSettings: () => workspaces.contextEnhancementFor(botId) },
        accessPolicy: accessPolicyProvider(workspaces, botId, {
          channel: 'qq', config: botConfig,
        }),
        replyTimeoutMs: config.replyTimeoutMs ?? 600_000,
```

</details>

**依据 4 · 源码核查**：[src/channels/qq/qq-runtime.mjs:174-203](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/qq-runtime.mjs#L174-L203)

真实SDK构造与bridge。

<details>
<summary>查看原文（30行）</summary>

```text
    const bot = this.#createBot({
      appId: this.#config.appId,
      appSecret: this.#appSecret,
      accountId: this.#config.botId,
      logger: sdkLogger,
      transport: 'websocket',
      tokenPrefetch: 'sync',
      // sendText is reserved for literal notices/connection tests. Markdown
      // replies use the explicit msg_type=2 path in sendMarkdownReply().
      markdownSupport: false,
    });
    if (!bot || typeof bot.start !== 'function' || typeof bot.stop !== 'function') {
      throw new TypeError('QQ bot factory returned an invalid client');
    }
    const controller = new AbortController();
    this.#abortController = controller;
    this.#bot = bot;
    this.#bridge = new QqHarnessBridge({
      bot,
      ownerUserOpenid: this.#config.ownerUserOpenid,
      harness: this.#harness,
      state: this.#state,
      contextEnhancement: this.#contextEnhancement,
      groupHistory: this.#groupHistory,
      accessPolicy: this.#accessPolicy,
      status: this.#status,
      logger: this.#logger,
      replyTimeoutMs: this.#replyTimeoutMs,
      signal: controller.signal,
    });
```

</details>

**依据 5 · 源码核查**：[src/channels/qq/qq-runtime.mjs:257-273](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/qq-runtime.mjs#L257-L273)

真实message handler/start。

<details>
<summary>查看原文（17行）</summary>

```text
    const onMessage = (_ctx, message) => {
      const task = this.#bridge?.accept(message);
      if (!task) return;
      void task.catch((error) => {
        if (controller.signal.aborted) return;
        this.#logger.error?.(
          `[dsh-im:qq] bot ${this.#config.botId} message handling failed:`,
          extractConnectionEvidence(error).details,
        );
      });
    };
    bot.on('ready', onReady);
    bot.on('resumed', onReady);
    bot.on('error', onError);
    bot.on('message', onMessage);

    const runTask = Promise.resolve().then(() => bot.start(controller.signal));
```

</details>

**依据 6 · 源码核查**：[src/channels/qq/qq-bridge.mjs:570-607](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/qq-bridge.mjs#L570-L607)

真实身份/去重/访问准入。

<details>
<summary>查看原文（38行）</summary>

```text
  #accept(message) {
    if (this.#signal?.aborted) return Promise.resolve();
    const messageId = nonEmptyString(message?.messageId);
    const sender = nonEmptyString(message?.senderId);
    if (!messageId || !sender || message?.senderIsBot === true
      || !['c2c', 'group'].includes(message?.kind)
      || this.#state.hasSeen(messageId)
      || this.#acceptedMessageIds.has(messageId)) return Promise.resolve();
    message = normalizeQqMentions(message, new Set([this.#bot.appId]));
    const key = conversationKey(message);
    const addressed = isQqMessageAddressed(message);
    const commandText = safeText(message);
    const menuTextOnly = !hasQqImageAttachments(message) && !hasQqFileAttachments(message)
      && !qqReplyReference(message);
    const explicitMenu = menuTextOnly && isQqMenuCommand(commandText);
    const numericMenu = menuTextOnly && /^\d{1,2}$/u.test(commandText)
      && this.#menus.has(key, sender)
      && !this.#pendingInteractions.has(key) && !this.#approvals.hasPending(key)
      && this.#batchInputs.status(key).phase === 'idle';
    const menuInput = numericMenu
      ? `/m pick ${this.#menus.tokenFor(key, sender)} ${commandText}` : commandText;
    if (addressed) {
      const access = this.#accessPolicy
        ? evaluateInboundAccess(this.#accessPolicy, {
            conversationType: message.kind === 'c2c' ? 'direct' : 'group',
            senderIds: sender,
            text: commandText,
            hasImages: hasQqImageAttachments(message),
            hasFiles: hasQqFileAttachments(message),
            ...(explicitMenu || numericMenu || isPermissionCommand(commandText) ? { isCommand: true } : {}),
          })
        : senderAllowed(message, this.#ownerUserOpenid)
          ? { allowed: true, reason: 'legacy-owner' }
          : { allowed: false, reason: 'sender-not-allowed' };
      if (!access.allowed) {
        this.#acceptedMessageIds.set(messageId, null);
        return this.#finishAccessDecision(message, messageId, access);
      }
```

</details>

**依据 7 · 源码核查**：[src/channels/qq/qq-bridge.mjs:1360-1387](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/qq-bridge.mjs#L1360-L1387)

真实普通任务提交shared session。

<details>
<summary>查看原文（28行）</summary>

```text
        // Persist consumption before handing the prompt to Harness. Provider
        // redelivery after a failed error notice must never execute it twice.
        await markMessageSeen();
        // The prompt is about to enter the Harness inbox, which is itself
        // durable. Marking the entry submitted first means a crash after this
        // point reports the message instead of replaying a turn the Harness may
        // already own.
        await this.#markPendingSubmitted(key, messageId);
        ({ answer, artifacts = [] } = await askInWorkspaceSession({
          onNotice: (notice) => this.#bot.sendText(target, notice),
          deferredDelivery: () => ({ coordinator: this.#deferred, target: deferredQqTarget(message, target, acceptedAt) }),
          harness: this.#harness,
          state: this.#state,
          key,
          text,
          content,
          titleText: batchSubmission?.title,
          sourceGuidance: snapshot?.config?.guidance,
          contextEnhanced,
          createOptions: { signal: this.#signal },
          existsOptions: { signal: this.#signal },
          askOptions: {
            groupHistory: message.groupHistory,
            timeoutMs: this.#replyTimeoutMs,
            signal: this.#signal,
            control: { owner: this, key },
            progressMode: 'all',
            finalAnswerOnly: true,
```

</details>

**依据 8 · 源码核查**：[src/channels/shared/workspace-session.mjs:125-177](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/workspace-session.mjs#L125-L177)

绑定锁/实际session创建与state.setSession。

<details>
<summary>查看原文（53行）</summary>

```text
      const binding = await withSessionBindingLock(state, key, async () => {
        await awaitPendingConversationSwitch(harness, key);
        const dsBotSessionId = await harness.resolveDsBotSession?.(key);
        dsBotSession = Boolean(dsBotSessionId);
        let sessionId = dsBotSessionId || state.sessionFor(key);
        diagnostic.sessionId = sessionId;
        let session = sessionId ? workspaceSession(harness, sessionId, key) : null;
        const replacingUnreadable = sessionId && sessionId === unreadableSessionId;
        if (!session || replacingUnreadable || !(await sessionExists(session, existsOptions))) {
          if (dsBotSessionId) {
            throw Object.assign(new Error('DS Bot 的当前会话不可用。'), { code: 'ds-bot-unavailable' });
          }
          // Name the Session here and bind it *before* creating it. Prompt
          // assembly runs inside creation, and a subscriber that resolves the
          // conversation by session id can only answer if the conversation owns
          // the id by then.
          // A Harness that accepts a caller-chosen id lets the binding exist
          // before the Session does; anything else keeps the old order.
          const plannedSessionId = harness?.canChooseSessionId === true ? `session-${randomUUID()}` : null;
          const previousSessionId = plannedSessionId === null ? null : state.sessionFor(key) ?? null;
          if (plannedSessionId !== null && await state.setSession(key, plannedSessionId) === false) return null;
          try {
            sessionId = await createSession(harness, {
              conversationKey: key,
              ...(plannedSessionId === null ? {} : { sessionId: plannedSessionId }),
              ...(createOptions ?? {}),
            });
          } catch (error) {
            // The binding must not outlive a Session that was never created, and a
            // failed replacement must leave the previous binding in place.
            if (plannedSessionId !== null) {
              if (previousSessionId === null) await state.clearSession?.(key);
              else await state.setSession(key, previousSessionId);
            }
            throw error;
          }
          diagnostic.sessionId = sessionId;
          if (plannedSessionId === null) {
            if (await state.setSession(key, sessionId) === false) return null;
          } else if (sessionId !== plannedSessionId && await state.setSession(key, sessionId) === false) {
            return null;
          }
          // Binding committed: capture the conversation's effective-workspace
          // generation together with the session, so the prompt below is fenced
          // against a conversation switch that only commits after the bind.
          const conversationGeneration = readConversationGeneration(harness, key);
          session = workspaceSession(harness, sessionId, key);
          // A title the user set with /title before any Session existed wins over
          // the one derived from the first message, and is consumed exactly once.
          const pendingTitle = typeof state.takePendingTitle === 'function'
            ? await state.takePendingTitle(key).catch(() => null)
            : null;
          const effectiveTitle = pendingTitle || initialTitle;
```

</details>

**依据 9 · 源码核查**：[src/channels/shared/workspace-session.mjs:188-203](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/workspace-session.mjs#L188-L203)

切换generation核验。

<details>
<summary>查看原文（16行）</summary>

```text
          // A switch that committed while the title was being set has already
          // cleared the mapping and must not receive this prompt.
          if (conversationGenerationMoved(harness, key, conversationGeneration)) {
            throw workspaceSessionStaleError();
          }
          // Record the newly bound Session in the conversation's navigation ring
          // so /ls, /go, /prev and /next can find it later. Optional: a state
          // store without ring support simply skips this.
          try {
            const registered = await state.ensureSessionRing?.(key, sessionId, {
              title: typeof effectiveTitle === 'string' && effectiveTitle ? effectiveTitle : undefined,
            });
            if (registered?.entry) await state.appendRing?.(key, registered.entry.n);
          } catch (error) {
            console.warn('[dsh-im] unable to record the session in the navigation ring:', error?.message ?? error);
          }
```

</details>

**依据 10 · 源码核查**：[src/channels/shared/workspace-session.mjs:229-255](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/workspace-session.mjs#L229-L255)

真实session.ask与timeout延后登记。

<details>
<summary>查看原文（27行）</summary>

```text
      let answer;
      // Prepare session-dependent context after binding, outside the binding
      // lock. A stale-workspace retry must prepare it for the new session too.
      const prompt = prepareContent
        ? await prepareContent({ sessionId: binding.sessionId, content, text })
        : content ?? text;
      try {
        // An alternate Harness adapter may not supply finer ask() diagnostics.
        diagnostic.stage = 'operation';
        diagnostic.submissionState = 'unknown';
        answer = await binding.session.ask(prompt, artifactOptions);
      } catch (error) {
        if (error?.code === 'harness-reply-timeout' && deferredDelivery) {
          try {
            const { coordinator, ...destination } = deferredDelivery();
            await coordinator.trackTimeout(error, { ...destination, key, sessionId: binding.sessionId });
          } catch (registrationError) {
            console.warn('[dsh-im] unable to persist deferred delivery:', registrationError.message);
          }
        }
        throw error;
      }
      return {
        sessionId: binding.session.replySessionId ?? binding.sessionId,
        answer,
        ...(artifacts.length > 0 ? { artifacts } : {}),
      };
```

</details>

**依据 11 · 源码核查**：[src/channels/shared/harness-client.mjs:1098-1114](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/harness-client.mjs#L1098-L1114)

真实本机apiProxy或HTTP分流。

<details>
<summary>查看原文（17行）</summary>

```text
      if (this.#apiProxy) {
        const [domain, action, extra] = method.split('.');
        const namespace = { host: 'host', workspace: 'workspace', session: 'sessions', llm: 'llm' }[domain];
        const api = namespace && this.#apiProxy[namespace];
        if (extra !== undefined || !Object.hasOwn(api ?? {}, action)
          || typeof api[action] !== 'function') {
          throw new HarnessTransportError('harness-api-not-found', method);
        }
        const response = await callWithSignal(() => api[action]({ rpcId, payload }, signal), signal);
        body = { type: 'server-response', ...response };
      } else {
        const response = await this.#fetch(new URL(`/api/${method}`, this.#baseUrl), {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ type: 'client-request', rpcId, method, payload }),
          signal,
        });
```

</details>

**依据 12 · 源码核查**：[src/channels/shared/harness-client.mjs:2203-2211](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/harness-client.mjs#L2203-L2211)

实际session.prompt queue/content/requestID。

```text
        const sendPrompt = (promptContent) => {
          diagnostic.stage = 'prompt.submit';
          diagnostic.submissionState = 'unknown';
          return this.#sessionRpc('session.prompt', {
            sessionId,
            mode: 'queue',
            content: promptContent,
            ...timeZoneFields,
          }, 30_000, { rpcId: promptRpcId, signal });
```

**依据 13 · 源码核查**：[plugin-src/host/modern-harness-api.mjs:245-258](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/modern-harness-api.mjs#L245-L258)

真实prompt/cancel映射。

<details>
<summary>查看原文（14行）</summary>

```text
      prompt: (request, signal) => rpcResult(request, () => this.#invoke(
        'session',
        'prompt',
        { request: { requestId: request.rpcId, ...request.payload } },
        signal,
      )),
      rename: (request, signal) => rpcResult(request, () => this.#invoke(
        'session', 'rename', { request: request.payload }, signal,
      )),
      fork: (request, signal) => rpcResult(request, () => this.#invoke(
        'session', 'fork', { request: request.payload }, signal,
      )),
      cancel: (request, signal) => rpcResult(request, () => this.#invoke(
        'session', 'cancel', { request: { sessionId: request.payload.sessionId } }, signal,
```

</details>

**依据 14 · 源码核查**：[plugin-src/host/modern-harness-api.mjs:312-313](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/modern-harness-api.mjs#L312-L313)

真正调用Host gateway.invoke。

```text
  async #invoke(namespace, method, args, signal) {
    return this.#gateway.invoke(remoteRequest(namespace, method, args, signal, this.#peer));
```

**依据 15 · 源码核查**：[src/channels/qq/qq-bridge.mjs:1448-1478](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/qq-bridge.mjs#L1448-L1478)

实际文字/附件/回执汇总。

<details>
<summary>查看原文（31行）</summary>

```text
        if (!streamFinished) {
          const deliveries = await sendMarkdownReply(this.#bot, target, displayAnswer, {
            logger: this.#logger,
          });
          textReceipt = createDeliveryReceipt({
            deliveryId: messageId,
            presentation: 'qq-text',
            providerMessageIds: deliveries.flatMap((delivery) => providerMessageIdsFor(delivery)),
          });
        }
      } catch (error) {
        textSendError = channelDeliveryFailure(error);
        this.#logger.warn?.('[dsh-im:qq] final text delivery failed; continuing with result files:', error);
      }
      const delivery = await this.#deliverArtifacts(target, messageId, artifacts, textReceipt);
      const artifactDispatched = delivery.receipt?.artifacts?.some(
        ({ outcome }) => outcome === 'sent' || outcome === 'unknown',
      );
      if (textSendError && !artifactDispatched && !delivery.failureNoticeVisible) {
        throw textSendError;
      }
      if (textSendError && delivery.artifactSendErrors === 0) {
        setLastMessageFailure(this.#status, textSendError);
      }
      this.#status.messagesReplied += 1;
      this.#status.lastReplyAt = new Date().toISOString();
      this.#status.lastError = null;
      if (!textSendError && delivery.artifactSendErrors === 0) {
        clearLastMessageFailure(this.#status);
      }
      return delivery.receipt;
```

</details>

**依据 16 · 源码核查**：[src/channels/qq/markdown-reply.mjs:75-100](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/markdown-reply.mjs#L75-L100)

真实SDK markdown发送与不确定不重试。

<details>
<summary>查看原文（26行）</summary>

```text
  for (const [index, chunk] of chunks.entries()) {
    signal?.throwIfAborted();
    const msgSeq = (firstMsgSeq + index) & 0xFFFF;
    const deliveryTarget = overflow && index >= passiveContentCount
      ? proactiveTarget
      : target;
    if (typeof bot?.send === 'function') {
      try {
        results.push(await bot.send({
          target: deliveryTarget,
          msgType: 2,
          markdown: { content: chunk.markdown },
          extra: { msg_seq: msgSeq },
        }));
        continue;
      } catch (error) {
        if (!isMarkdownRejection(error)) {
          logger?.warn?.(
            '[dsh-im:qq] markdown delivery outcome is uncertain; refusing a duplicate-prone retry:',
            error,
          );
          if (requireComplete || results.length === 0) throw error;
          await sendPartialNotice();
          break;
        }
        logger?.warn?.('[dsh-im:qq] markdown delivery failed; retrying as plain text:', error);
```

</details>

#### 缺口

- 未运行Host/SDK/模型/平台，未全审所有命令/渠道。
  **影响**：已核代表提交与结果回传接线，不证明执行质量、全部平台可靠。
  **进一步探讨**：隔离QQ私聊发一个确定任务，核Host requestID/session/结果/平台ID和正确人。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认谁能发消息/命令，聊天身份能替工具授权吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

新QQ机器人initial/new seed不同：旧config迁移direct按owner/*、group open，新bot newBotAccessPolicyFor明确direct/group都open；openScope默认命令权限true。production使用new seed且workspace ensure保留现有策略，不可概称默认仅本人或旧owner即唯一授权。evaluateAccessPolicy会拒无效/缺失策略、allowlist不匹配和命令无权；evaluateInboundAccess还有privileged sender旁路与兼容无provider放行，production provider读bot workspace策略。群聊是否addressed/历史内容及全部命令来源未全审。

消息/命令访问开关限制谁能进入桥，不保证模型后续读写/运行命令都是逐项人审。Host工具权限、预设/审批竞争和远端身份必须另核，不把onInteraction存在当权限全闭环。首次连接必须先设私聊allowlist/关闭不需要群聊和命令，再授权测试账号/最小工作区；未核前保持观察，不接生产。

管理RPC默认trusted-host：实际Fetch POST只在显式loopback policy时加插件本地检查，其余借Host浏览器认证/Host-Origin信任；JSON/envelope检查不是用户认证。本轮未独立核当前Host认证与所有审批入口，不能承诺公网管理/租户隔离，也不能仅此断言公网越权。

#### 证据与依据

**依据 1 · 源码核查**：[plugin-src/host/channels/shared/access-policy-production.mjs:10-29](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/channels/shared/access-policy-production.mjs#L10-L29)

真实open默认允许命令/allowlist模式。

<details>
<summary>查看原文（20行）</summary>

```text
function openScope(allowlistUsers = []) {
  return createAccessPolicyScope({
    mode: 'open',
    open: {
      defaultCanExecuteCommands: true,
      commandPermissionOverrides: [],
    },
    allowlist: { users: policyUsers(allowlistUsers) },
  });
}

function allowlistScope(users = []) {
  return createAccessPolicyScope({
    mode: 'allowlist',
    open: {
      defaultCanExecuteCommands: false,
      commandPermissionOverrides: [],
    },
    allowlist: { users: policyUsers(users) },
  });
```

</details>

**依据 2 · 源码核查**：[plugin-src/host/channels/shared/access-policy-production.mjs:61-66](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/channels/shared/access-policy-production.mjs#L61-L66)

旧QQ迁移direct/group种子不同。

```text
  if (key === 'qq') {
    const owners = cleanIds(config.ownerUserOpenid);
    return createAccessPolicy({
      direct: owners.includes('*') ? openScope() : allowlistScope(),
      group: openScope(),
    });
```

**依据 3 · 源码核查**：[plugin-src/host/channels/shared/access-policy-production.mjs:100-110](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/channels/shared/access-policy-production.mjs#L100-L110)

新QQ/飞书direct/group都open。

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * Seed newly connected bots after startup has migrated existing bots with
 * initialAccessPolicyFor(). Open Feishu/QQ messages and commands in both chat
 * types; workspace ensure() preserves any policy already saved.
 */
export function newBotAccessPolicyFor(channel, config = {}) {
  const key = String(channel ?? '').trim().toLowerCase();
  if (key === 'feishu' || key === 'qq') {
    return createAccessPolicy({ direct: openScope(), group: openScope() });
  }
  return initialAccessPolicyFor(channel, config);
```

</details>

**依据 4 · 源码核查**：[plugin-src/host/channels/qq/production.mjs:135-154](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/channels/qq/production.mjs#L135-L154)

真实new seed与provider注入。

<details>
<summary>查看原文（20行）</summary>

```text
    createRuntime: async ({ botId, config: botConfig, appSecret }) => {
      const state = await stateFor(botId);
      await workspaces.ensure(botId, {
        defaultAgentPreset: config.agentPreset,
        initialAccessPolicy: newBotAccessPolicyFor('qq', botConfig),
      });
      const workspaceScope = createBotWorkspaceScope(harness, {
        dsBot: config.deliveryService?.dsBot,
        botId, workspaces, state, agentPresetCatalog,
      });
      return new Runtime({
        config: botConfig,
        appSecret,
        harness: workspaceScope.harness,
        state: workspaceScope.state,
        groupHistory: internals.groupHistory ?? getGroupHistoryStore(ctx, config),
        contextEnhancement: { botId, getSettings: () => workspaces.contextEnhancementFor(botId) },
        accessPolicy: accessPolicyProvider(workspaces, botId, {
          channel: 'qq', config: botConfig,
        }),
```

</details>

**依据 5 · 源码核查**：[src/channels/shared/inbound-access.mjs:14-42](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/inbound-access.mjs#L14-L42)

实际provider/privileged/缺失及错误策略处理。

<details>
<summary>查看原文（29行）</summary>

```text
export function evaluateInboundAccess(accessPolicy, {
  conversationType,
  senderIds,
  text = '',
  hasImages = false,
  hasFiles = false,
  isCommand = isSharedLocalCommand(text, { hasImages, hasFiles }),
} = {}) {
  if (!accessPolicy) return POLICY_NOT_CONFIGURED;
  try {
    if (typeof accessPolicy.isPrivileged === 'function'
      && accessPolicy.isPrivileged(senderIds, conversationType) === true) {
      return PRIVILEGED_SENDER;
    }
  } catch {
    // A broken privilege lookup must not bypass the persisted policy.
  }
  let policy = null;
  try {
    policy = accessPolicy.getSettings();
  } catch {
    // Provider failures are equivalent to an unavailable persisted policy.
  }
  return evaluateAccessPolicy(policy, {
    conversationType,
    senderIds,
    isCommand,
    ...(typeof accessPolicy.equals === 'function' ? { equals: accessPolicy.equals } : {}),
  });
```

</details>

**依据 6 · 源码核查**：[src/channels/shared/access-policy.mjs:166-209](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/access-policy.mjs#L166-L209)

真实allowlist/open与命令拒绝。

<details>
<summary>查看原文（44行）</summary>

```text
export function evaluateAccessPolicy(policy, {
  conversationType,
  senderIds,
  isCommand = false,
  equals = (left, right) => left === right,
} = {}) {
  const normalizedPolicy = normalizeAccessPolicy(policy);
  if (!normalizedPolicy) return POLICY_UNAVAILABLE;
  if (!ACCESS_POLICY_CONVERSATION_TYPES.includes(conversationType)
    || typeof isCommand !== 'boolean' || typeof equals !== 'function') {
    return INVALID_CONTEXT;
  }
  const candidates = (Array.isArray(senderIds) ? senderIds : [senderIds])
    .flatMap((candidate) => {
      try {
        return [normalizeAccessPolicyUserId(candidate)];
      } catch {
        return [];
      }
    });
  if (candidates.length === 0) return SENDER_UNAVAILABLE;

  const scope = normalizedPolicy[conversationType];
  const users = scope.mode === 'open'
    ? scope.open.commandPermissionOverrides
    : scope.allowlist.users;
  let matchedUsers;
  try {
    matchedUsers = users.filter((user) => (
      candidates.some((candidate) => equals(candidate, user.id) === true)
    ));
  } catch {
    return INVALID_CONTEXT;
  }
  if (scope.mode === 'allowlist' && matchedUsers.length === 0) return SENDER_NOT_ALLOWED;
  if (isCommand) {
    const canExecuteCommands = scope.mode === 'open'
      ? (matchedUsers.length > 0
        ? matchedUsers.every((user) => user.canExecuteCommands)
        : scope.open.defaultCanExecuteCommands)
      : matchedUsers.every((user) => user.canExecuteCommands);
    if (!canExecuteCommands) return COMMAND_NOT_ALLOWED;
  }
  return ALLOWED;
```

</details>

**依据 7 · 源码核查**：[plugin-src/host/channels/shared/access-policy-production.mjs:129-149](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/channels/shared/access-policy-production.mjs#L129-L149)

真实privileged sender与bot策略。

<details>
<summary>查看原文（21行）</summary>

```text
export function accessPolicyProvider(workspaces, botId, { channel, config, equals } = {}) {
  if (!workspaces || typeof workspaces.accessPolicyFor !== 'function') {
    throw new TypeError('A workspace store with access policies is required');
  }
  const privilegedSenderIds = new Set(privilegedSenderIdsFor(channel, config));
  const sameSender = typeof equals === 'function' ? equals : (left, right) => left === right;
  return Object.freeze({
    botId,
    getSettings: () => workspaces.accessPolicyFor(botId),
    isPrivileged(senderIds, conversationType) {
      if (!['direct', 'group'].includes(conversationType)) return false;
      const candidates = Array.isArray(senderIds) ? senderIds : [senderIds];
      try {
        return candidates.some((senderId) => typeof senderId === 'string'
          && [...privilegedSenderIds].some((privilegedId) => (
            sameSender(senderId.trim(), privilegedId) === true
          )));
      } catch {
        return false;
      }
    },
```

</details>

**依据 8 · 源码核查**：[plugin-src/host/rpc-authority.mjs:1-11](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/rpc-authority.mjs#L1-L11)

管理RPC默认trusted-host。

<details>
<summary>查看原文（11行）</summary>

```text
const RPC_AUTHORITIES = new Set(['loopback', 'trusted-host']);

/**
 * Resolve the browser authority accepted by an IM management RPC channel.
 * By default, use the browser authentication and Host/Origin trust checks
 * already enforced by Harness before it dispatches a management Fetch route.
 */
export function resolveRpcAuthority(value) {
  if (value === undefined) return 'trusted-host';
  if (RPC_AUTHORITIES.has(value)) return value;
  throw new TypeError('dsh-im rpcAuthority must be "loopback" or "trusted-host"');
```

</details>

**依据 9 · 源码核查**：[plugin-src/management-rpc.mjs:41-69](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/management-rpc.mjs#L41-L69)

实际Fetch注册/显式loopback/格式检查/handler。

<details>
<summary>查看原文（29行）</summary>

```text
export function registerManagementRpc(ctx, channel, handler, { authority } = {}) {
  const policy = resolveRpcAuthority(authority);
  const endpoint = rpcEndpoint(channel);
  if (typeof ctx?.connection?.fetch?.register !== 'function') {
    throw new TypeError('DSH Host Connection Fetch registry is required');
  }
  return ctx.connection.fetch.register({
    path: `/api/${endpoint}`,
    methods: ['POST'],
    requestBody: 'buffered',
    async fetch(request) {
      // DSH applies browser authentication and Host/Origin trust before this handler.
      if (policy === 'loopback' && !isLoopbackRequest(request)) return new Response('forbidden', { status: 403 });
      if (request.method !== 'POST') return new Response('method not allowed', { status: 405 });
      if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
        return new Response('content type must be application/json', { status: 415 });
      }
      let message;
      try { message = await request.json(); }
      catch { return new Response('body is not JSON', { status: 400 }); }
      const rpcId = typeof message?.rpcId === 'string' ? message.rpcId : 'invalid-request';
      const call = message?.payload;
      if (!isRecord(message) || message.type !== 'client-request' || typeof message.rpcId !== 'string'
        || message.method !== endpoint || !isRecord(call) || typeof call.method !== 'string'
        || !Object.hasOwn(call, 'payload')) {
        return reply(rpcId, { ok: false, error: { code: 'gateway/bad-request', message: 'Invalid IM management request.' } });
      }
      try { return reply(rpcId, await handler(call.method, call.payload, request.signal)); }
      catch { return new Response('IM management handler failed', { status: 500 }); }
```

</details>

#### 缺口

- 当前Host工具权限/管理认证、群历史与全部审批/命令链未全审。
  **影响**：源码有访问策略仍不能担保新bot默认私有或所有副作用获人审，限制采用。
  **进一步探讨**：保存并验证最小allowlist/禁群/命令权限；伪装sender/错误策略/Host拒绝样本对照，不满足不连接业务。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 重启、超时、取消和文件回传能提供怎样的恢复边界？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

QQ入队先调用recordPending再串行process；state真实tmp0600→rename写文件、最多200条pending，但recordPending自身catch写失败只warn，不阻止后续process，不能称必先持久成功再执行。提交前markSeen并markPendingSubmitted，重启submitted条目只通知而不重放，未提交条目unmarkSeen再重放；标submitted与Host提交不原子，标后提交前崩溃可能只通知不执行，是防重复的取舍，非exactly-once。

Host prompt提交超时按promptRpcId查持久history确认，未知不盲发第二次；shared session只在明确not-submitted等条件重试。回复等待超时可登记deferred协调，未全审其全部持久恢复。/stop实际请求session.stopActiveTurn/Host cancel，runtime.stop abort SDK再等待最多2秒runTask及bridge idle；请求取消不等外部工具/已发送平台消息/文件副作用回滚。

文件不是任意文本路径就发送：根安装工具与tools/result observer，stage要求活session/turn/active IM consumer；成功native/CodeMode父结果才commit。snapshotFile接受绝对路径或workspace相对路径，realpath/lstat后复制私有snapshot，此处无workspace包含检查，因此workspace是相对解析基准，非磁盘读取安全根；实际Host工具授权另核。materialize核registry/size/identity/digest后读bytes，再真实SDK sendImage/sendFile。等待超时/取消不能保证SDK已物理停止；不确定文件结果回unknown，禁止图片不确定后再文件盲重试，最终释放snapshot。

文字也有平台配额/分片/部分送达边界：只有明确Markdown拒绝可纯文本回退，未知发送拒重复重试。messagesReplied增加或文本失败仍有附件不等完整送达，更不等用户阅读。结果未知先对账Host与平台ID/文件，不直接重发原任务。

#### 证据与依据

**依据 1 · 源码核查**：[src/channels/qq/qq-bridge.mjs:776-806](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/qq-bridge.mjs#L776-L806)

实际先recordPending后入内存链。

<details>
<summary>查看原文（31行）</summary>

```text
  #enqueueMessage(message, messageId, key, {
    releaseMessageId = true,
    alreadyRecorded = false,
    batchSubmission = null,
  } = {}) {
    // Persist before the message joins the in-memory chain: the chain may wait
    // behind a long turn, and a restart in that window must not lose the input.
    const pending = this.#recordPendingMessage(message, messageId, key);
    const addressed = isQqMessageAddressed(message);
    const preparedMessage = addressed
      ? prefetchInboundFiles(
          qqInboundMessage(message, { fetchImpl: this.#fetchImpl }),
          { signal: this.#signal },
        )
      : undefined;
    const previous = this.#queues.get(key) ?? Promise.resolve();
    const current = previous
      .catch(() => undefined)
      .then(() => pending)
      .then(() => this.#process(message, key, {
        alreadyRecorded,
        preparedMessage,
        batchSubmission,
      }))
      .finally(async () => {
        if (releaseMessageId) this.#acceptedMessageIds.delete(messageId);
        if (this.#queues.get(key) === current) this.#queues.delete(key);
        await this.#removePendingMessage(pendingMessageId(key, messageId));
      });
    this.#queues.set(key, current);
    return current;
```

</details>

**依据 2 · 源码核查**：[src/channels/qq/qq-bridge.mjs:864-876](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/qq-bridge.mjs#L864-L876)

真实pending写失败warn与submitted标记。

<details>
<summary>查看原文（13行）</summary>

```text
      submitted: false,
      createdAt: new Date().toISOString(),
      ...(senderId ? { senderId } : {}),
      ...(message.replyTarget !== undefined ? { target: message.replyTarget } : {}),
    };
    return this.#state.putPendingMessage(entry).catch((error) => {
      this.#logger.warn?.('[dsh-im:qq] failed to persist a queued message:', error?.message ?? error);
    });
  }

  async #markPendingSubmitted(key, messageId) {
    if (typeof this.#state?.patchPendingMessage !== 'function') return;
    await this.#state.patchPendingMessage(pendingMessageId(key, messageId), { submitted: true });
```

</details>

**依据 3 · 源码核查**：[src/channels/qq/state-store.mjs:163-176](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/state-store.mjs#L163-L176)

真实pending上限与持久调用。

<details>
<summary>查看原文（14行）</summary>

```text
  async putPendingMessage(entry) {
    const normalized = normalizePendingMessage({
      createdAt: new Date().toISOString(),
      ...entry,
    });
    if (!normalized) throw new TypeError('Invalid pending message entry');
    const list = this.#state.pendingMessages ??= [];
    const index = list.findIndex((candidate) => candidate.id === normalized.id);
    if (index < 0) list.push(normalized);
    else list[index] = normalized;
    if (list.length > PENDING_MESSAGE_LIMIT) {
      list.splice(0, list.length - PENDING_MESSAGE_LIMIT);
    }
    await this.#persist();
```

</details>

**依据 4 · 源码核查**：[src/channels/qq/state-store.mjs:275-284](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/state-store.mjs#L275-L284)

真实tmp/rename/0600与错误。

<details>
<summary>查看原文（10行）</summary>

```text
  async #persist() {
    const snapshot = `${JSON.stringify(this.#state, null, 2)}\n`;
    const operation = this.#writeQueue.then(async () => {
      await fs.mkdir(dirname(this.#path), { recursive: true, mode: 0o700 });
      const temporary = `${this.#path}.tmp`;
      await fs.writeFile(temporary, snapshot, { encoding: 'utf8', mode: 0o600 });
      await fs.rename(temporary, this.#path);
    });
    this.#writeQueue = operation.then(() => undefined, () => undefined);
    await operation.catch(error => { throw qqStateError('state-write-failed', error); });
```

</details>

**依据 5 · 源码核查**：[src/channels/qq/qq-bridge.mjs:821-842](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/qq-bridge.mjs#L821-L842)

实际submitted只报告/未提交重放。

<details>
<summary>查看原文（22行）</summary>

```text
  async #recoverPendingMessages() {
    if (typeof this.#state?.pendingMessages !== 'function') return;
    const entries = this.#state.pendingMessages();
    if (!Array.isArray(entries) || entries.length === 0) return;
    for (const entry of entries) {
      if (!entry || this.#signal?.aborted) return;
      try {
        if (entry.submitted === true) {
          await this.#notifyInterruptedPending(entry);
          await this.#removePendingMessage(entry.id);
          continue;
        }
        this.#logger.warn?.(
          '[dsh-im:qq] replaying a queued message that a restart interrupted:',
          entry.messageId,
        );
        // The turn never reached Harness, so any earlier mark-seen is an
        // attempt, not a completed delivery; clear it so the replay can run.
        if (typeof this.#state.unmarkSeen === 'function') {
          await this.#state.unmarkSeen(entry.messageId).catch(() => undefined);
        }
        await this.#replayPendingMessage(entry);
```

</details>

**依据 6 · 源码核查**：[src/channels/qq/qq-bridge.mjs:1360-1368](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/qq-bridge.mjs#L1360-L1368)

真实提交前seen/submitted。

```text
        // Persist consumption before handing the prompt to Harness. Provider
        // redelivery after a failed error notice must never execute it twice.
        await markMessageSeen();
        // The prompt is about to enter the Harness inbox, which is itself
        // durable. Marking the entry submitted first means a crash after this
        // point reports the message instead of replaying a turn the Harness may
        // already own.
        await this.#markPendingSubmitted(key, messageId);
        ({ answer, artifacts = [] } = await askInWorkspaceSession({
```

**依据 7 · 源码核查**：[src/channels/shared/harness-client.mjs:2216-2234](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/harness-client.mjs#L2216-L2234)

真实超时确认/未知抛出不再提交。

<details>
<summary>查看原文（19行）</summary>

```text
        const submitPrompt = async (promptContent) => {
          try {
            await sendPrompt(promptContent);
          } catch (error) {
            if (!isPromptSubmitTimeout(error) || signal?.aborted) throw error;
            let confirmed = false;
            try {
              confirmed = await this.#confirmPromptSubmit(sessionId, promptRpcId, { signal });
            } catch (confirmError) {
              // 确认途中被取消时恢复调用方的取消语义（与图片暂存路径一致）。
              if (signal?.aborted) throw signal.reason ?? confirmError;
              throw error;
            }
            if (!confirmed) throw error;
            diagnostic.submissionState = 'accepted';
          }
        };
        try {
          await submitPrompt(content);
```

</details>

**依据 8 · 源码核查**：[src/channels/shared/workspace-session.mjs:270-278](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/workspace-session.mjs#L270-L278)

只在确定not-submitted条件恢复重试。

```text
      // Retry once, only with positive evidence that no prompt was submitted.
      // The binding lock rechecks identity so a concurrent /new or workspace
      // switch cannot be overwritten by recovery of the previous Session.
      if (!unreadableSessionId && !dsBotSession && diagnostic.sessionId
        && error?.code === 'session-unreadable'
        && !renameSignal?.aborted && !existsOptions?.signal?.aborted
        && extractConnectionEvidence(failure).details.submissionState === 'not-submitted') {
        unreadableSessionId = diagnostic.sessionId;
        continue;
```

**依据 9 · 源码核查**：[src/channels/shared/control-command.mjs:80-93](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/control-command.mjs#L80-L93)

真实stop调用/仅请求文案。

<details>
<summary>查看原文（14行）</summary>

```text
    if (!session) return commandResult(t('当前聊天没有正在运行的任务。'));
    if (typeof session.stopActiveTurn !== 'function') {
      throw new TypeError('Harness session does not support stopping active turns');
    }
    const stopped = await session.stopActiveTurn(control, requestOptions(signal));
    if (!stopped && deferredDelivery) {
      const background = await deferredDelivery.stop(key);
      if (background === 'stopped') return commandResult(t('已请求停止后台任务。'), { stopped: true });
      if (background === 'unavailable') {
        return commandResult(t('无法安全停止后台任务，请在 Harness 中查看并停止对应任务。'));
      }
    }
    return stopped
      ? commandResult(t('已请求停止当前任务。'), { stopped: true })
```

</details>

**依据 10 · 源码核查**：[plugin-src/host/modern-harness-api.mjs:257-258](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/modern-harness-api.mjs#L257-L258)

Host cancel映射。

```text
      cancel: (request, signal) => rpcResult(request, () => this.#invoke(
        'session', 'cancel', { request: { sessionId: request.payload.sessionId } }, signal,
```

**依据 11 · 源码核查**：[src/channels/qq/qq-runtime.mjs:310-328](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/qq-runtime.mjs#L310-L328)

真实停止abort/SDK stop/等待。

<details>
<summary>查看原文（19行）</summary>

```text
  async stop() {
    const bot = this.#bot;
    const bridge = this.#bridge;
    const runTask = this.#runTask;
    this.#abortController?.abort();
    this.#abortController = null;
    this.#bot = null;
    this.#bridge = null;
    this.#runTask = null;
    try {
      bot?.stop();
    } catch (error) {
      this.#logger.warn?.(`[dsh-im:qq] bot ${this.#config.botId} failed to stop cleanly:`, extractConnectionEvidence(error).details);
    }
    await Promise.race([
      runTask?.catch(() => undefined) ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 2_000)),
    ]);
    await bridge?.waitForIdle();
```

</details>

**依据 12 · 源码核查**：[plugin-src/host/index.mjs:199-206](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/index.mjs#L199-L206)

真实工具安装接线。

```text
    if (typeof ctx?.inject === 'function') {
      ctx.inject(['tools', 'systemPrompt'], (artifactCtx) => {
        installOutboundArtifactTool(artifactCtx);
        installGroupHistoryTools(artifactCtx);
      });
    } else {
      installOutboundArtifactTool(ctx);
      installGroupHistoryTools(ctx);
```

**依据 13 · 源码核查**：[src/channels/shared/semantic/artifact.mjs:424-448](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/semantic/artifact.mjs#L424-L448)

真实stage活上下文/consumer及snapshot调用。

<details>
<summary>查看原文（25行）</summary>

```text
  async stage(args, exec) {
    const requestedPath = args?.path;
    if (typeof requestedPath !== 'string' || !requestedPath.trim()) {
      throw new TypeError('A file path is required.');
    }
    const agent = exec?.agent;
    const sessionId = agent?.session?.header?.id;
    const workspace = agent?.session?.header?.cwd;
    const turn = this.#currentTurn(agent?.session);
    if (typeof sessionId !== 'string' || !sessionId
      || typeof workspace !== 'string' || !workspace || turn === null) {
      throw artifactError(
        'artifact-context-required',
        'A live Harness Session is required to return a file.',
      );
    }

    const consumer = this.#consumerForTurn(sessionId, turn);
    const unavailable = () => artifactError(
      'artifact-consumer-required',
      'No active IM delivery consumer owns this turn. The file was not queued. Use the host present tool if available to return the file in this conversation.',
    );
    if (!consumer) throw unavailable();

    const snapshot = await snapshotFile(workspace, requestedPath, exec?.signal);
```

</details>

**依据 14 · 源码核查**：[src/channels/shared/semantic/artifact.mjs:185-218](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/semantic/artifact.mjs#L185-L218)

实际绝对/相对路径realpath复制，非workspace包含判断。

<details>
<summary>查看原文（34行）</summary>

```text
async function snapshotFile(workspace, requestedPath, signal) {
  signal?.throwIfAborted();
  let storagePath;
  try {
    const candidate = isAbsolute(requestedPath)
      ? requestedPath
      : resolve(workspace, requestedPath);
    const canonicalPath = await realpath(candidate);
    const source = await lstat(canonicalPath, { bigint: true });
    if (!source.isFile()) {
      throw artifactError('artifact-not-file', 'The requested path is not a file.');
    }

    const directory = await managedSnapshotDirectory();
    storagePath = join(directory, `${randomUUID()}.artifact`);
    try {
      await copyFile(canonicalPath, storagePath, fsConstants.COPYFILE_EXCL);
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
      signal?.throwIfAborted();
      // System temp cleanup can remove the cached directory between sends.
      // Recreate it with mkdtemp's private permissions and retry only once.
      await mkdir(directory, { recursive: true, mode: 0o700 });
      signal?.throwIfAborted();
      await copyFile(canonicalPath, storagePath, fsConstants.COPYFILE_EXCL);
    }
    signal?.throwIfAborted();

    const snapshot = await lstat(storagePath, { bigint: true });
    const size = Number(snapshot.size);
    if (!snapshot.isFile() || !Number.isSafeInteger(size) || size < 0) {
      throw artifactError('artifact-unavailable', 'The file could not be prepared for delivery.');
    }
    const fileName = safeFileName(basename(candidate));
```

</details>

**依据 15 · 源码核查**：[src/channels/shared/semantic/artifact.mjs:691-736](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/semantic/artifact.mjs#L691-L736)

真实结果commit/release与tools/result注册。

<details>
<summary>查看原文（46行）</summary>

```text
  const onResult = (exec, result) => {
    if (exec?.name === OUTBOUND_ARTIFACT_TOOL) {
      const artifact = staged.get(exec);
      if (!artifact) return;
      staged.delete(exec);
      if (result?.isError) {
        registry.release(artifact);
        return;
      }
      if (exec.parent === undefined) registry.commit(artifact);
      else appendPending(exec.parent, artifact);
      return;
    }
    const pending = pendingByParent.get(exec?.token);
    if (!pending) return;
    pendingByParent.delete(exec.token);
    if (result?.isError) {
      for (const artifact of pending.artifacts) registry.release(artifact);
      return;
    }
    if (exec.parent !== undefined) {
      for (const artifact of pending.artifacts) appendPending(exec.parent, artifact);
      return;
    }
    for (const artifact of pending.artifacts) registry.commit(artifact);
  };

  return Object.freeze({ definition, onResult });
}

/** Register the file-return tool with guidance scoped to an owned IM Turn. */
export function installOutboundArtifactTool(ctx, { registry = outboundArtifactRegistry } = {}) {
  if (typeof ctx?.tools?.register !== 'function'
    || typeof ctx?.systemPrompt?.context !== 'function'
    || typeof ctx?.on !== 'function') return false;
  const logger = typeof ctx.logger === 'function'
    ? ctx.logger('dsh-im:outbound-artifact')
    : (ctx.logger ?? console);
  const tool = createOutboundArtifactTool({ registry });
  ctx.tools.register(tool.definition);
  ctx.on('tools/result', tool.onResult);
  ctx.on('agent/inbox/claimed', ({ agent, message, turn }) => {
    registry.observeClaimedMessage(agent?.session, message, turn);
  }, { global: true });
  ctx.on('session/event', (session, event) => registry.observeSessionEvent(session, event, { logger }));
  ctx.on('session/disposed', (session) => registry.disposeSession(session));
```

</details>

**依据 16 · 源码核查**：[src/channels/shared/semantic/artifact.mjs:755-791](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/semantic/artifact.mjs#L755-L791)

实际registry/read/snapshot身份/摘要验证。

<details>
<summary>查看原文（37行）</summary>

```text
  if (artifact?.kind !== ARTIFACT_KIND || artifact.schemaVersion !== 1
    || !artifactStorage.has(artifact)
    || typeof artifact.digest !== 'string'
    || !Number.isSafeInteger(artifact.size) || artifact.size < 0) {
    throw artifactError('artifact-invalid', 'The file registration is invalid.');
  }
  const storage = artifactStorage.get(artifact);
  storage.materializing += 1;
  let handle;
  let materialized = false;
  try {
    const noFollow = Number.isInteger(fsConstants.O_NOFOLLOW) ? fsConstants.O_NOFOLLOW : 0;
    handle = await open(storage.path, fsConstants.O_RDONLY | noFollow);
    const before = await handle.stat({ bigint: true });
    if (!before.isFile() || before.size !== BigInt(artifact.size)) {
      throw artifactError('artifact-invalid', 'The file registration is invalid.');
    }
    const bytes = await readExactArtifactFile(handle, artifact.size, {
      signal,
      errorCode: 'artifact-invalid',
      errorMessage: 'The file registration is invalid.',
    });
    const after = await handle.stat({ bigint: true });
    if (!sameIdentity(before, after)
      || bytes.byteLength !== artifact.size
      || sha256(bytes) !== artifact.digest) {
      throw artifactError('artifact-invalid', 'The file registration is invalid.');
    }
    signal?.throwIfAborted();
    materialized = true;
    const file = Object.freeze({
      artifactId: artifact.artifactId,
      deliveryKey: artifact.deliveryKey,
      fileName: artifact.fileName,
      mediaType: artifact.mediaType,
      size: artifact.size,
      bytes,
```

</details>

**依据 17 · 源码核查**：[src/channels/qq/qq-bridge.mjs:420-448](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/qq-bridge.mjs#L420-L448)

真实SDK file bytes发送/超时等待。

<details>
<summary>查看原文（29行）</summary>

```text
async function sendQqFile(
  bot,
  target,
  file,
  { signal, timeoutMs = DEFAULT_FILE_UPLOAD_TIMEOUT_MS } = {},
) {
  signal?.throwIfAborted();
  if (typeof bot?.sendFile !== 'function') {
    const unavailable = new Error('QQ file delivery is unavailable');
    unavailable.code = 'artifact-provider-unavailable';
    throw unavailable;
  }

  try {
    const timeout = AbortSignal.timeout(timeoutMs);
    const waitSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;
    const pending = bot.sendFile(
      target,
      { buffer: file.bytes },
      {
        fileName: file.fileName,
        onProgress: () => signal?.throwIfAborted(),
      },
    );
    trackOutboundArtifactProviderPromise(file, pending);
    return await waitWithSignal(pending, waitSignal);
  } catch (error) {
    if (signal?.aborted) throw abortReason(signal);
    throw qqArtifactError(error, { dispatched: true });
```

</details>

**依据 18 · 源码核查**：[src/channels/shared/semantic/artifact-delivery.mjs:36-57](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/semantic/artifact-delivery.mjs#L36-L57)

图片不确定禁止再文件fallback。

<details>
<summary>查看原文（22行）</summary>

```text
async function sendMaterializedArtifact(file, {
  sendFile,
  sendImage,
  signal,
}) {
  if (file.mediaType?.startsWith('image/') && typeof sendImage === 'function') {
    try {
      return {
        presentation: 'image',
        result: await sendImage(file),
      };
    } catch (error) {
      if (isAbort(error, signal) || error?.code === 'artifact-delivery-uncertain') {
        throw error;
      }
    }
  }
  signal?.throwIfAborted();
  if (typeof sendFile !== 'function') throw unavailableError();
  return {
    presentation: 'file',
    result: await sendFile(file),
```

</details>

**依据 19 · 源码核查**：[src/channels/shared/semantic/artifact-delivery.mjs:86-147](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/semantic/artifact-delivery.mjs#L86-L147)

实际物化/发送/失败回执/释放。

<details>
<summary>查看原文（62行）</summary>

```text
  try {
    while (artifactIndex < artifacts.length) {
      const artifact = artifacts[artifactIndex];
      artifactIndex += 1;
      try {
        signal?.throwIfAborted();
        const file = await materializeOutboundArtifact(artifact, { signal });
        signal?.throwIfAborted();
        const sent = await sendMaterializedArtifact(file, {
          sendFile,
          sendImage,
          signal,
        });
        signal?.throwIfAborted();
        receipts.push(createDeliveryReceipt({
          deliveryId: file.deliveryKey,
          presentation: `${channelKey}-${sent.presentation}`,
          providerMessageIds: providerIds(sent.result),
          artifacts: [{ artifactId: file.artifactId, outcome: 'sent' }],
        }));
        artifactsSent += 1;
        userVisible = true;
      } catch (error) {
        if (isAbort(error, signal)) throw error;
        artifactSendErrors += 1;
        const failure = typeof onFailure === 'function'
          ? await onFailure(artifact, error)
          : null;
        const reference = typeof failure?.referenceId === 'string'
          ? ` [${failure.referenceId}]`
          : '';
        logger?.warn?.(
          `[dsh-im:${channelKey}] result artifact delivery failed${reference} (${error?.code ?? 'unknown'})`,
        );
        let messageIds = [];
        if (typeof sendFailureNotice === 'function') {
          try {
            signal?.throwIfAborted();
            const notice = await sendFailureNotice(artifact, error, failure);
            signal?.throwIfAborted();
            messageIds = providerIds(notice);
            failureNoticeVisible = true;
          } catch (noticeError) {
            if (isAbort(noticeError, signal)) throw noticeError;
            logger?.warn?.(
              `[dsh-im:${channelKey}] unable to send the safe artifact failure notice`,
            );
          }
        }
        const failureReceipt = createArtifactFailureReceipt({
          artifactId: artifact?.artifactId ?? 'unknown',
          deliveryId: artifact?.deliveryKey ?? artifact?.artifactId ?? 'unknown',
          error,
          providerMessageIds: messageIds,
        });
        receipts.push(failureReceipt);
        if (failureNoticeVisible || failureReceipt.artifacts[0]?.outcome === 'unknown') {
          userVisible = true;
        }
      } finally {
        releaseOutboundArtifact(artifact);
      }
```

</details>

**依据 20 · 源码核查**：[src/channels/shared/semantic/delivery.mjs:109-113](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/semantic/delivery.mjs#L109-L113)

不确定结果映射unknown。

```text
export function artifactOutcomeForError(error) {
  const code = typeof error === 'string' ? error : error?.code;
  if (code === 'artifact-delivery-uncertain') return 'unknown';
  if (REJECTED_ARTIFACT_ERRORS.has(code)) return 'rejected';
  return 'failed';
```

**依据 21 · 源码核查**：[src/channels/qq/markdown-reply.mjs:90-115](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/markdown-reply.mjs#L90-L115)

真实未知不重复/明确拒绝纯文本回退。

<details>
<summary>查看原文（26行）</summary>

```text
      } catch (error) {
        if (!isMarkdownRejection(error)) {
          logger?.warn?.(
            '[dsh-im:qq] markdown delivery outcome is uncertain; refusing a duplicate-prone retry:',
            error,
          );
          if (requireComplete || results.length === 0) throw error;
          await sendPartialNotice();
          break;
        }
        logger?.warn?.('[dsh-im:qq] markdown delivery failed; retrying as plain text:', error);
      }
    }
    // Synthetic Markdown can represent an empty fenced-code body even though
    // its plain equivalent is empty. Never turn that into an invalid QQ text
    // message after a definite Markdown rejection (or on legacy text clients).
    if (chunk.plain.length === 0) continue;
    try {
      results.push(await sendPlainText(bot, deliveryTarget, chunk.plain, msgSeq));
    } catch (error) {
      if (requireComplete || results.length === 0) throw error;
      await sendPartialNotice();
      break;
    }
  }
  return results;
```

</details>

#### 缺口

- 强杀/多进程/全部deferred、平台幂等与文件授权/取消底层行为未实测或全审。
  **影响**：不能保证不丢不重、磁盘只读workspace、物理停机或完整投递/撤回。
  **进一步探讨**：可丢弃工作区测写失败/标后崩溃/提交超时/部分发送/取消，对账ID/文件与状态再恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何时值得接入，费用与退路怎样核？

**研究主题**：采用判断、效果与总成本

#### 完整回答

现在建议观察；确需离开桌面从IM操作同一Host的人，先比较原生Web/可信远程入口，只有额外便利明确才用独立测试bot、单人私聊、保存allowlist、关闭群/不需命令及不需同步，隔离非敏感工作区/模型预算。先纯文本确定任务，再测试批准的文件；不能先用新bot默认open接业务。

首次机器人/平台凭据和权限、Host/version/工作区/策略配置，持续平台/模型token、网络/附件存储与凭据轮换/审批/对账人时，故障重复请求/未知投递/持久写和退出清理成本未知，不填0。QQ SDK/平台配额与Host/模型费用单独核；replyTimeout不是任务停止或费用上限。所有IM消息、模型输入和文件实际会离开本机到相应服务，不因本机Host而隐去。

出现sender/目标/session不明、状态写失败、未知提交/发送或文件范围超预期，先停该bot新输入，回Host核请求/结果/平台记录，不盲重试。断连/卸载不能撤已发消息/文件或工具写入；退出应停runtime、核在途Host任务，撤平台凭据并查profile/state/暂存与同步目标，必要恢复备份，真实清理率待验。

#### 证据与依据

**依据 1 · 源码核查**：[plugin-src/host/channels/shared/access-policy-production.mjs:100-110](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/channels/shared/access-policy-production.mjs#L100-L110)

新bot默认open需先收紧。

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * Seed newly connected bots after startup has migrated existing bots with
 * initialAccessPolicyFor(). Open Feishu/QQ messages and commands in both chat
 * types; workspace ensure() preserves any policy already saved.
 */
export function newBotAccessPolicyFor(channel, config = {}) {
  const key = String(channel ?? '').trim().toLowerCase();
  if (key === 'feishu' || key === 'qq') {
    return createAccessPolicy({ direct: openScope(), group: openScope() });
  }
  return initialAccessPolicyFor(channel, config);
```

</details>

**依据 2 · 源码核查**：[plugin-src/host/channels/qq/production.mjs:135-155](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/channels/qq/production.mjs#L135-L155)

真实bot工作区/策略/超时配置。

<details>
<summary>查看原文（21行）</summary>

```text
    createRuntime: async ({ botId, config: botConfig, appSecret }) => {
      const state = await stateFor(botId);
      await workspaces.ensure(botId, {
        defaultAgentPreset: config.agentPreset,
        initialAccessPolicy: newBotAccessPolicyFor('qq', botConfig),
      });
      const workspaceScope = createBotWorkspaceScope(harness, {
        dsBot: config.deliveryService?.dsBot,
        botId, workspaces, state, agentPresetCatalog,
      });
      return new Runtime({
        config: botConfig,
        appSecret,
        harness: workspaceScope.harness,
        state: workspaceScope.state,
        groupHistory: internals.groupHistory ?? getGroupHistoryStore(ctx, config),
        contextEnhancement: { botId, getSettings: () => workspaces.contextEnhancementFor(botId) },
        accessPolicy: accessPolicyProvider(workspaces, botId, {
          channel: 'qq', config: botConfig,
        }),
        replyTimeoutMs: config.replyTimeoutMs ?? 600_000,
```

</details>

**依据 3 · 源码核查**：[src/channels/qq/qq-bridge.mjs:864-876](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/qq-bridge.mjs#L864-L876)

写失败/提交标记边界。

<details>
<summary>查看原文（13行）</summary>

```text
      submitted: false,
      createdAt: new Date().toISOString(),
      ...(senderId ? { senderId } : {}),
      ...(message.replyTarget !== undefined ? { target: message.replyTarget } : {}),
    };
    return this.#state.putPendingMessage(entry).catch((error) => {
      this.#logger.warn?.('[dsh-im:qq] failed to persist a queued message:', error?.message ?? error);
    });
  }

  async #markPendingSubmitted(key, messageId) {
    if (typeof this.#state?.patchPendingMessage !== 'function') return;
    await this.#state.patchPendingMessage(pendingMessageId(key, messageId), { submitted: true });
```

</details>

**依据 4 · 源码核查**：[src/channels/qq/qq-runtime.mjs:310-328](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/qq-runtime.mjs#L310-L328)

断连/取消范围。

<details>
<summary>查看原文（19行）</summary>

```text
  async stop() {
    const bot = this.#bot;
    const bridge = this.#bridge;
    const runTask = this.#runTask;
    this.#abortController?.abort();
    this.#abortController = null;
    this.#bot = null;
    this.#bridge = null;
    this.#runTask = null;
    try {
      bot?.stop();
    } catch (error) {
      this.#logger.warn?.(`[dsh-im:qq] bot ${this.#config.botId} failed to stop cleanly:`, extractConnectionEvidence(error).details);
    }
    await Promise.race([
      runTask?.catch(() => undefined) ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 2_000)),
    ]);
    await bridge?.waitForIdle();
```

</details>

**依据 5 · 源码核查**：[src/channels/qq/qq-bridge.mjs:420-448](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/qq-bridge.mjs#L420-L448)

文件确实交SDK。

<details>
<summary>查看原文（29行）</summary>

```text
async function sendQqFile(
  bot,
  target,
  file,
  { signal, timeoutMs = DEFAULT_FILE_UPLOAD_TIMEOUT_MS } = {},
) {
  signal?.throwIfAborted();
  if (typeof bot?.sendFile !== 'function') {
    const unavailable = new Error('QQ file delivery is unavailable');
    unavailable.code = 'artifact-provider-unavailable';
    throw unavailable;
  }

  try {
    const timeout = AbortSignal.timeout(timeoutMs);
    const waitSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;
    const pending = bot.sendFile(
      target,
      { buffer: file.bytes },
      {
        fileName: file.fileName,
        onProgress: () => signal?.throwIfAborted(),
      },
    );
    trackOutboundArtifactProviderPromise(file, pending);
    return await waitWithSignal(pending, waitSignal);
  } catch (error) {
    if (signal?.aborted) throw abortReason(signal);
    throw qqArtifactError(error, { dispatched: true });
```

</details>

**依据 6 · 源码核查**：[src/channels/qq/markdown-reply.mjs:45-57](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/markdown-reply.mjs#L45-L57)

被动配额/主动目标分片变化。

<details>
<summary>查看原文（13行）</summary>

```text
export async function sendMarkdownReply(bot, target, text, { logger, signal, requireComplete = false, passiveRepliesUsed = 0 } = {}) {
  const chunks = chunkMarkdownParts(text);
  const results = [];
  const firstMsgSeq = nextMsgSeq();
  // Earlier replies to the same msg_id (for example a timeout notice) spend
  // part of QQ's passive budget; at least one slot is kept for this reply.
  const passiveLimit = target?.msgId
    ? Math.max(1, PASSIVE_REPLY_LIMIT[target.scope] - passiveRepliesUsed) : null;
  const overflow = passiveLimit !== null && chunks.length > passiveLimit;
  const passiveContentCount = overflow ? passiveLimit - 1 : chunks.length;
  const proactiveTarget = target?.msgId
    ? { scope: target.scope, targetId: target.targetId }
    : target;
```

</details>

#### 缺口

- 真实端到端质量、误投率、模型平台费用与维护/退出工时未知。
  **影响**：多渠道/自动回传不等净收益，关键权限未清前不宜生产。
  **进一步探讨**：低敏单任务比原生Web计延迟/错误/人工审批和恢复费用，满足再扩大。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 在已有receipt/去重之外，怎样验证更可靠的交付方向？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

独立假设：把入站授权快照、Host request/session、允许外发的目标和文件范围以及平台receipt形成同一任务可核收据，在结果unknown时明确谁对账/谁可重试，可能比继续加渠道减少误投/重复执行。已有messageId、pending submitted、snapshot摘要和receipt是真基础，不将“加回执”本身当新贡献；增量是跨授权/Host/平台的一致范围与恢复责任，仍非跨系统事务。

先和人工对账清单、原生Web及现有插件小修比较，不新建消息平台。用新bot默认open、策略变更/工作区切换、pending写失败/标后崩溃、Host已收但响应超时、平台部分发送/文件unknown样本，盲测误投、重复与漏执行、错误重试和包含人审总成本。若已有界面/清单已够或收据维护超收益则推翻，不算现成安全保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/channels/qq/qq-bridge.mjs:864-876](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/qq/qq-bridge.mjs#L864-L876)

授权到执行前状态不是强事务。

<details>
<summary>查看原文（13行）</summary>

```text
      submitted: false,
      createdAt: new Date().toISOString(),
      ...(senderId ? { senderId } : {}),
      ...(message.replyTarget !== undefined ? { target: message.replyTarget } : {}),
    };
    return this.#state.putPendingMessage(entry).catch((error) => {
      this.#logger.warn?.('[dsh-im:qq] failed to persist a queued message:', error?.message ?? error);
    });
  }

  async #markPendingSubmitted(key, messageId) {
    if (typeof this.#state?.patchPendingMessage !== 'function') return;
    await this.#state.patchPendingMessage(pendingMessageId(key, messageId), { submitted: true });
```

</details>

**依据 2 · 源码核查**：[src/channels/shared/harness-client.mjs:2203-2211](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/harness-client.mjs#L2203-L2211)

已有稳定请求ID。

```text
        const sendPrompt = (promptContent) => {
          diagnostic.stage = 'prompt.submit';
          diagnostic.submissionState = 'unknown';
          return this.#sessionRpc('session.prompt', {
            sessionId,
            mode: 'queue',
            content: promptContent,
            ...timeZoneFields,
          }, 30_000, { rpcId: promptRpcId, signal });
```

**依据 3 · 源码核查**：[src/channels/shared/semantic/artifact.mjs:760-791](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/semantic/artifact.mjs#L760-L791)

已有snapshot身份/摘要。

<details>
<summary>查看原文（32行）</summary>

```text
  }
  const storage = artifactStorage.get(artifact);
  storage.materializing += 1;
  let handle;
  let materialized = false;
  try {
    const noFollow = Number.isInteger(fsConstants.O_NOFOLLOW) ? fsConstants.O_NOFOLLOW : 0;
    handle = await open(storage.path, fsConstants.O_RDONLY | noFollow);
    const before = await handle.stat({ bigint: true });
    if (!before.isFile() || before.size !== BigInt(artifact.size)) {
      throw artifactError('artifact-invalid', 'The file registration is invalid.');
    }
    const bytes = await readExactArtifactFile(handle, artifact.size, {
      signal,
      errorCode: 'artifact-invalid',
      errorMessage: 'The file registration is invalid.',
    });
    const after = await handle.stat({ bigint: true });
    if (!sameIdentity(before, after)
      || bytes.byteLength !== artifact.size
      || sha256(bytes) !== artifact.digest) {
      throw artifactError('artifact-invalid', 'The file registration is invalid.');
    }
    signal?.throwIfAborted();
    materialized = true;
    const file = Object.freeze({
      artifactId: artifact.artifactId,
      deliveryKey: artifact.deliveryKey,
      fileName: artifact.fileName,
      mediaType: artifact.mediaType,
      size: artifact.size,
      bytes,
```

</details>

**依据 4 · 源码核查**：[src/channels/shared/semantic/delivery.mjs:109-113](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/src/channels/shared/semantic/delivery.mjs#L109-L113)

已有unknown分类。

```text
export function artifactOutcomeForError(error) {
  const code = typeof error === 'string' ? error : error?.code;
  if (code === 'artifact-delivery-uncertain') return 'unknown';
  if (REJECTED_ARTIFACT_ERRORS.has(code)) return 'rejected';
  return 'failed';
```

**依据 5 · 源码核查**：[plugin-src/host/channels/shared/access-policy-production.mjs:100-110](https://github.com/xmanrui/dsh-im/blob/3a0a9871137da94c646547865e999043a2a2c44d/plugin-src/host/channels/shared/access-policy-production.mjs#L100-L110)

默认open是需可见授权基线。

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * Seed newly connected bots after startup has migrated existing bots with
 * initialAccessPolicyFor(). Open Feishu/QQ messages and commands in both chat
 * types; workspace ensure() preserves any policy already saved.
 */
export function newBotAccessPolicyFor(channel, config = {}) {
  const key = String(channel ?? '').trim().toLowerCase();
  if (key === 'feishu' || key === 'qq') {
    return createAccessPolicy({ direct: openScope(), group: openScope() });
  }
  return initialAccessPolicyFor(channel, config);
```

</details>

#### 缺口

- 跨边界收据对误投/恢复总人时的改善未测。
  **影响**：仅方向，非已证生产插件机会/安全或经济创新。
  **进一步探讨**：固定故障样本对照清单与小修，设错误和总成本反证。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
