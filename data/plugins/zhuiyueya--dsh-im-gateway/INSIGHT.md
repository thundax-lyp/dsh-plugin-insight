# dsh-im-gateway

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[8e8fbca](https://github.com/zhuiyueya/dsh-im-gateway/tree/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37)

<!-- BEGIN META -->
[![GitHub ★ 59](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=59&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhuiyueya/dsh-im-gateway) [![npm 30d 1,283](https://img.shields.io/static/v1?label=npm+30d&message=1%2C283&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-im-gateway) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-im-gateway)
<!-- END META -->

> **功能**：在DSH中聚合多种IM渠道，提供聊天会话、任务结果、文字审批与设置管理。

> **亮点**：[Q01](#research-q01)统一渠道配置、生命周期与会话/过程回传，[Q03](#research-q03)实际接原生审批与文件工具；渠道ID不等完整平台能力。

> **主要限制**：[Q02](#research-q02)、[Q03](#research-q03)确认命令/批准先于名单，批准只按session而非操作者/requestId；文件路径直接交adapter且控制面依外层认证，不能依插件名单开放不可信团队。

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
  - [Q01 · 聚合渠道为谁改变哪一步，支持列表到哪层？](#detail-section-11)
  - [Q02 · 消息怎样接到Host，名单是否覆盖所有入口？](#detail-section-12)
  - [Q03 · 批准、文件外发和HTTP管理的边界是什么？](#detail-section-13)
  - [Q04 · 持久与失败恢复怎样影响日常采用？](#detail-section-14)
  - [Q05 · 哪一种聚合增量值得继续验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：这是原生DSH聚合IM渠道插件，包0.3.3从lib/index.js加载并提供设置客户端。目标是已有DSH机器的个人或小团队，从日常聊天入口派任务、接结果、回答人机问题，不回终端完成每一次交接。任务正确、结果到正确聊天、审批对应真实执行才是成功，在线状态不是成功。基线是DSH原生Web/终端、远程桌面与单渠道bot；本组件贡献是统一渠道生命周期、会话路由和双向人机交接，推理、工具、沙箱来自Host。

原生Web/终端、远程桌面和单渠道bot；Agent能力继承Host，平台API/SDK提供传输。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 渠道聚合 | 统一配置和收发入口 | 三渠道骨架，其余未全验 |
| 会话/工作区 | chat路由/续接Host | 群共享，非文件租户隔离 |
| 原生审批/问题 | 远程回答人机交接 | 文字批准先于名单、无独立审批人 |
| 文件外发 | 向关联chat交付 | adapter差异、统一层无路径内容限制 |
| 管理与持久 | 启停/名单/恢复 | 依外层认证，断开重启恢复 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH rc.6系列服务/Agent preset与模型 | 必需 | 真正执行工具和会话 | 渠道不提供新沙箱 |
| 每平台API/SDK/凭据或子进程 | 按渠道必需 | 接收与发送 | 骨架不能收发，各平台不同 |
| webServer外层保护 | 设置控制面必需 | 管理渠道/名单/定时 | 本地handler无鉴权，不应暴露 |
| 可信平台成员与隔离profile | 本文观察前提 | 补足当前门禁覆盖 | 仅关闭allowAllUsers不足 |
| 可写stateDir及访问控制 | 持久必需 | 配置、凭据与会话偏好 | 写失败仅日志，秘密JSON需保护 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 隔离Host/非敏感目录、一个真实平台 | 不接不可信成员，不选骨架验任务 |
| 配置 | 维护者核SDK/凭据与HTTP保护 | 连接状态不能代替收发验收 |
| 任务 | 用只读消息核chat/Agent/原机结果 | 群聊共享，名单不覆盖命令批准 |
| 故障核查 | 两成员、超时/重启/写失败 | 保留原机效果，未知不重试副作用 |
| 退出 | remove并核Cordis enabled、撤平台权限 | disconnect会重启恢复，留存单独清理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 模型/平台/机器金额未知 | 应用/依赖/成员/API防护 | 多渠道不是一次配置全通 |
| 持续 | token/轮询/磁盘资源未知 | 平台变化、审批和原机核对 | 净节时未测 |
| 故障 | 重投/补发资源未知 | 状态/真正送达与任务核对 | 非可靠任务队列/事务 |
| 退出 | 留存资源未知 | 删除配置、撤平台凭据/权限 | 已发内容不能自动撤回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 聚合入口 | 实际Host followup和设置管理 | 所有平台可用与ROI |
| 人机交接 | 原生审批/问题接线 | 指定人安全批准和延迟消息正确性 |
| 文件 | 关联chat逐渠道调用/部分成功 | 内容限制与最终送达 |
| 恢复 | 配置重载/聊天恢复 | 丢消息/重复/坏状态的业务结果 |

> **思考**：[Q02](#research-q02)、[Q03](#research-q03)确认命令/批准先于名单，批准只按session而非操作者/requestId；文件路径直接交adapter且控制面依外层认证，不能依插件名单开放不可信团队。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)统一渠道配置、生命周期与会话/过程回传，[Q03](#research-q03)实际接原生审批与文件工具；渠道ID不等完整平台能力。

统一adapter接口/会话路由与broker清理可借鉴；安全策略必须在命令/批准等所有入口前执行，session键和聊天位置不能代替操作者及原调用身份。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)、[Q03](#research-q03)确认命令/批准先于名单，批准只按session而非操作者/requestId；文件路径直接交adapter且控制面依外层认证，不能依插件名单开放不可信团队。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前观察。在独立个人profile、一个可信平台、无秘密只读任务核接线；不要以allowAllUsers=false开放不可信群。要指定审批人、跨工作区保密或敏感文件就回原生Web，先修统一授权和决定关联。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可确认聚合Host桥接和门禁覆盖缺口；仅观察，未运行真实渠道/攻击/Host，统一协议是假设。

- 已检查：作者 README、包清单、源码路径 README.md、lib/channels/stubs.js、lib/channels/telegram.js、lib/core/approval.js、lib/core/gateway.js、lib/core/router.js、lib/index.js、lib/manager.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核README/package、运行入口配置、统一消息/Host注入/命令/审批/文件关键链、router创建恢复/preset、manager API/状态/启停、Telegram代表接收发送与全部三骨架；未逐平台审协议、cron完整实现、Host外层认证或SDK。
- 下一步：只读固定源码，未运行目标、扫码、消息、Host、攻击或测试；一般冒烟为scope_boundary，真实授权/交付故障和收益仍研究缺口。

**分析版本**

- **仓库**：[zhuiyueya/dsh-im-gateway](https://github.com/zhuiyueya/dsh-im-gateway)
- **版本号**：0.3.3（[固定提交 8e8fbca](https://github.com/zhuiyueya/dsh-im-gateway/tree/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37)）
- **版本日期**：2026-09-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的前置统一身份/角色与原生callId关联回执，先两适配器对抗/故障对照，不增加渠道数代替边界正确。

只读固定源码，未运行目标、扫码、消息、Host、攻击或测试；一般冒烟为scope_boundary，真实授权/交付故障和收益仍研究缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 40 | 7239 | 6542 | 720 | — |
| .md | source | 4 | 613 | — | — | 5019 |
| .ts | source | 38 | 7306 | 6073 | 814 | — |
| .mjs | test | 13 | 1845 | 1572 | 84 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/zhuiyueya/dsh-im-gateway/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核聚合消息到Host的真实交接、渠道实现深度及授权/恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 聚合渠道为谁改变哪一步，支持列表到哪层？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是原生DSH聚合IM渠道插件，包0.3.3从lib/index.js加载并提供设置客户端。目标是已有DSH机器的个人或小团队，从日常聊天入口派任务、接结果、回答人机问题，不回终端完成每一次交接。任务正确、结果到正确聊天、审批对应真实执行才是成功，在线状态不是成功。基线是DSH原生Web/终端、远程桌面与单渠道bot；本组件贡献是统一渠道生命周期、会话路由和双向人机交接，推理、工具、沙箱来自Host。

作者宣称25+平台不能当25种完整能力。固定index列出25个渠道ID，但Tlon、元宝和语音电话明确是无接收、发送直接抛错的骨架；connect只看start是否抛错，骨架start仅日志提示，也能显示已连接。Telegram代表路径能长轮询文本并sendMessage，发送HTML失败会纯文本再试；它没有sendMedia，不能推断平台都支持文件、语音或相同授权。其他真实渠道有各自SDK/API/子进程依赖，本次没有逐渠道验收。

聚合减少重复配置入口，未证明比单渠道方案完成更多合格任务；如果只用一种平台，额外网关、权限与持久状态维护可能抵消便利。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-35](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/README.md#L1-L35)

作者聚合网关用途与安装。

<details>
<summary>查看原文（35行）</summary>

```text
# 🐋 dsh-im-gateway

<h3 align="center">把 DeepSeek Harness 接入你常用的每一个聊天软件</h3>
<p align="center">Aggregated IM gateway for <b>DeepSeek Harness (dsh)</b> — drive your coding agents from <b>WeChat, Feishu, Telegram, Discord, QQ</b> and 25+ chat platforms, with unified sessions, remote approvals, interactive questions and one-command setup.</p>

<p align="center">
  <img alt="npm version" src="https://img.shields.io/npm/v/dsh-im-gateway?color=4d6bfe">
  <img alt="npm downloads" src="https://img.shields.io/npm/dm/dsh-im-gateway?color=4d6bfe">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-4d6bfe">
  <img alt="Platform" src="https://img.shields.io/badge/platform-DeepSeek%20Harness-4d6bfe">
  <img alt="Channels" src="https://img.shields.io/badge/channels-25%2B-238636">
  <img alt="DSH bundle" src="https://img.shields.io/badge/dsh-bundle%20plugin-4d6bfe">
  <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen">
  <img alt="Tests" src="https://img.shields.io/badge/tests-106%20passed-238636">
</p>

<p align="center"><a href="README.en.md">English</a> · <b>简体中文</b></p>

---

## 📸 效果预览

<p align="center">
  <img src="docs/screenshots/im-gateway-settings.png" width="92%" alt="dsh IM 网关设置界面">
</p>

<p align="center">
  <img src="docs/screenshots/wechat-chat.jpg" width="30%" alt="微信聊天截图">
  <img src="docs/screenshots/qq-chat.jpg" width="30%" alt="QQ 聊天截图">
  <img src="docs/screenshots/feishu-chat.jpg" width="30%" alt="飞书聊天截图">
</p>

---

## ⚡ 一键安装
```

</details>

**依据 2 · 源码核查**：[package.json:1-35](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/package.json#L1-L35)

原生Host/client导出与依赖。

<details>
<summary>查看原文（35行）</summary>

```text
{
  "name": "dsh-im-gateway",
  "version": "0.3.3",
  "description": "聚合 IM 网关插件（DeepSeek Harness）：把 dsh agent 接入微信、飞书、钉钉、企业微信、QQ、Telegram、Discord、Slack、WhatsApp 等 25+ 渠道，统一会话路由、审批桥、交互提问、定时提醒、白名单与扫码接入。",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src",
    "client.js",
    "cordis.patch.yml",
    "README.md",
    "README.en.md",
    "THIRD_PARTY_NOTICES.md",
    "docs",
    "assets"
  ],
  "scripts": {
    "build": "tsc -p tsconfig.json && node -e \"require('node:fs').copyFileSync('client.js','lib/client.js')\"",
    "prepublishOnly": "npm run typecheck && npm test",
    "prepack": "npm run build",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "node --test tests/*.test.mjs"
  },
  "license": "MIT",
```

</details>

**依据 3 · 源码核查**：[lib/channels/stubs.js:7-30](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/channels/stubs.js#L7-L30)

Tlon只有骨架。

<details>
<summary>查看原文（24行）</summary>

```text
export function createTlonChannel(config, log) {
    if (config.enabled !== true)
        return undefined;
    let stopped = false;
    return {
        id: 'tlon',
        label: 'Tlon（Urbit）',
        maxMessageLength: 2000,
        async start() {
            log(`[tlon] ⚠️ 实验性骨架：需要 Urbit ship（${config.ship ?? '未配置'}）与 %chat 应用桥接；v0.1 未实现完整协议`);
        },
        async stop() {
            stopped = true;
        },
        async send() {
            throw new Error('tlon: v0.1 骨架未实现发送');
        },
        setMessageHandler() {
            // 骨架：无接收
        },
        status() {
            return stopped ? '已停止' : '骨架（未实现）';
        },
    };
```

</details>

**依据 4 · 源码核查**：[lib/channels/stubs.js:32-80](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/channels/stubs.js#L32-L80)

元宝/语音同样无收发。

<details>
<summary>查看原文（49行）</summary>

```text
export function createYuanbaoChannel(config, log) {
    if (!config.enabled)
        return undefined;
    let stopped = false;
    return {
        id: 'yuanbao',
        label: '腾讯元宝',
        maxMessageLength: 2000,
        async start() {
            log('[yuanbao] ⚠️ 实验性骨架：腾讯元宝 bot API 未公开稳定文档，v0.1 未实现');
        },
        async stop() {
            stopped = true;
        },
        async send() {
            throw new Error('yuanbao: v0.1 骨架未实现发送');
        },
        setMessageHandler() {
            // 骨架：无接收
        },
        status() {
            return stopped ? '已停止' : '骨架（未实现）';
        },
    };
}
export function createVoiceChannel(config, log) {
    if (config.enabled !== true)
        return undefined;
    let stopped = false;
    return {
        id: 'voice',
        label: '语音电话',
        maxMessageLength: 1600,
        async start() {
            log(`[voice] ⚠️ 实验性骨架：需要 ${config.provider ?? 'twilio/plivo'} 账户与电话路由；v0.1 未实现通话流程`);
        },
        async stop() {
            stopped = true;
        },
        async send() {
            throw new Error('voice: v0.1 骨架未实现发送');
        },
        setMessageHandler() {
            // 骨架：无接收
        },
        status() {
            return stopped ? '已停止' : '骨架（未实现）';
        },
    };
```

</details>

**依据 5 · 源码核查**：[lib/channels/telegram.js:27-89](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/channels/telegram.js#L27-L89)

代表渠道实际轮询/文本发送，无文件接口。

<details>
<summary>查看原文（63行）</summary>

```text
    async function pollLoop() {
        while (!stopped) {
            try {
                const updates = await api('getUpdates', {
                    offset,
                    timeout: config.pollingTimeoutSec ?? 30,
                    allowed_updates: ['message'],
                });
                errorCount = 0;
                lastError = '';
                for (const update of updates) {
                    offset = update.update_id + 1;
                    const msg = update.message;
                    if (!msg?.text)
                        continue;
                    if (msg.chat.type === 'channel')
                        continue;
                    void handler?.({
                        chatId: String(msg.chat.id),
                        userId: msg.from ? String(msg.from.id) : undefined,
                        username: msg.from?.username ?? msg.from?.first_name,
                        text: msg.text,
                    });
                }
            }
            catch (err) {
                errorCount += 1;
                lastError = err instanceof Error ? err.message : String(err);
                log(`[telegram] 轮询错误（第 ${errorCount} 次）: ${lastError}`);
                await sleep(Math.min(1000 * errorCount, 10000));
            }
            if (stopped)
                break;
            // 空批次避免空转
            await sleep(50);
        }
    }
    return {
        id: 'telegram',
        label: 'Telegram',
        maxMessageLength: 4096,
        async start() {
            stopped = false;
            log('[telegram] 开始长轮询（Bot API）');
            void pollLoop();
        },
        async stop() {
            stopped = true;
        },
        async send(chatId, text) {
            await api('sendMessage', { chat_id: Number(chatId), text, parse_mode: 'HTML' }).catch(async () => {
                // HTML 实体非法时回退纯文本
                await api('sendMessage', { chat_id: Number(chatId), text });
            });
        },
        async sendAction(chatId, action) {
            await api('sendChatAction', { chat_id: Number(chatId), action }).catch(() => undefined);
        },
        setMessageHandler(h) {
            handler = h;
        },
        status() {
            return stopped ? '已停止' : lastError ? `轮询中（上次错误: ${lastError}）` : '轮询中';
```

</details>

**依据 6 · 源码核查**：[lib/manager.js:187-205](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/manager.js#L187-L205)

start返回即连接成功，不等协议任务完成。

<details>
<summary>查看原文（19行）</summary>

```text
        const adapter = createChannel(id, { ...cfg, enabled: true }, this.options.log, this.options.stateDir);
        if (!adapter) {
            const error = `${meta.label}：缺少必要配置（${meta.needs.join(' / ') || '未知原因'}）`;
            this.options.log(`[manager] ${id} 连接失败: ${error}`);
            return { ok: false, error };
        }
        this.options.gateway.register(adapter);
        this.running.set(id, adapter);
        try {
            await adapter.start();
            this.options.log(`[manager] ${id} 已连接`);
            return { ok: true };
        }
        catch (err) {
            this.running.delete(id);
            this.options.gateway.unregister(id);
            const error = `${meta.label} 启动失败：${err instanceof Error ? err.message : String(err)}`;
            this.options.log(`[manager] ${id} 启动失败: ${err instanceof Error ? err.message : String(err)}`);
            return { ok: false, error };
```

</details>

#### 缺口

- 多渠道真实身份/配额/送达和任务收益没有独立运行结果。
  **影响**：不能发布全渠道可用率或净节时承诺。
  **进一步探讨**：选一个真实必需平台，比较同任务的原生Web/单渠道bot与本插件，记录正确性、审批和返工。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 消息怎样接到Host，名单是否覆盖所有入口？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

统一处理器先恢复聊天会话，然后处理所有斜杠命令，再消费批准/拒绝，之后才执行渠道localAuth或网关名单检查。allowAllUsers默认true；false时普通消息按渠道名单、全局名单与UI追加名单过滤，渠道authorizes明确false也拒绝。然而命令与审批不经过这一检查，不能把关闭allowAllUsers当完整权限收口。可达该处理器且未获名单授权的消息仍可走/status、/sessions all、/workspace、/new、/continue、/bind等分支；这是固定代码顺序确认的门禁覆盖缺口，未做真实攻击，不断言每个平台允许任何陌生人到达。

普通内容创建source.kind=user消息，通过followup驱动真正Agent。默认per-chat的键是channelId:chatId，群内不同成员共用会话；bound需要已有live Agent，per-chat先恢复历史，恢复失败再create。新建挂standard preset，从而继承上游工具与权限，workspace登记失败只记日志。聊天键不是文件系统租户隔离，也没有自动证明会话属于发起用户。/workspace检查目录存在后设置偏好，不是配置roots下的canonical边界；/continue与/bind能力要求整个渠道已可信。

Telegram路径将Bot API的from.id映射userId，但统一层并未强制所有适配器有同等身份强度。应把机器人应用可见性与实际平台成员授权当首道约束；此版不适合依靠插件名单开放给不可信成员。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:29-45](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/index.js#L29-L45)

Host注入、默认per-chat/standard与allowAllUsers。

<details>
<summary>查看原文（17行）</summary>

```text
export const inject = ['agents', 'jobs', 'tools', 'attachments', 'webServer', 'sessionQuery', 'agentPresets', 'userQuestions', 'workspaceRegistry'];
/** 网关部署配置。 */
export const Config = Schema.object({
    // 渠道配置用宽松 dict：任意渠道字段（token/appId 等）原样保留，按渠道读取
    channels: Schema.dict(Schema.any()).default({}),
    sessionMode: Schema.union(['per-chat', 'bound']).default('per-chat'),
    cwd: Schema.string().default(process.cwd()),
    provider: Schema.string().default('deepseek-official'),
    model: Schema.string().default('deepseek-v4-flash'),
    agentPreset: Schema.string().default('standard'),
    // 默认放行所有用户（个人/小团队开箱即用）；需要管控时改为 false 并配置白名单
    allowAllUsers: Schema.boolean().default(true),
    allowedUserIds: Schema.dict(Schema.array(Schema.string())).default({}),
    mergeTimeoutSecs: Schema.number().default(5),
    longInputAckChars: Schema.number().default(180),
    approvalTimeoutSecs: Schema.number().default(120),
    questionTimeoutSecs: Schema.number().default(600),
```

</details>

**依据 2 · 源码核查**：[lib/core/gateway.js:330-364](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/core/gateway.js#L330-L364)

命令和批准在授权检查前。

<details>
<summary>查看原文（35行）</summary>

```text
        if (!channel)
            return;
        try {
            // 0. 恢复该 chat 的上次会话绑定（命令也会触发，使 /status 显示真实状态）
            await this.ensureChatRestored(channelId, msg.chatId);
            // 1. 命令（不经合并窗口）
            if (msg.text.startsWith('/')) {
                const reply = await this.handleCommand(channel, msg);
                if (reply !== undefined)
                    await channel.send(msg.chatId, reply);
                return;
            }
            // 2. 批准 / 拒绝（应答审批）
            const verdictText = msg.text.trim();
            if (verdictText === '批准' || verdictText === '同意' || verdictText === 'yes' || verdictText === 'y' || verdictText === 'allow') {
                const handled = await this.answerApproval(channel, msg, true);
                if (handled)
                    return;
            }
            if (verdictText === '拒绝' || verdictText === 'no' || verdictText === 'n' || verdictText === 'reject' || verdictText === 'deny') {
                const handled = await this.answerApproval(channel, msg, false);
                if (handled)
                    return;
            }
            // 3. 白名单：渠道本地授权（如微信扫码用户）优先，其次网关全局白名单
            const localAuth = channel.authorizes?.(msg.userId ?? '');
            if (localAuth === false || (localAuth === undefined && !this.authorized(channelId, msg.userId))) {
                this.logLine(`[${channelId}] 未授权用户 ${msg.userId ?? '(匿名)'} 消息被拦截（已登记待授权）`);
                const reply = this.unauthorizedHandler?.(channelId, msg) ?? '⛔ 未授权：请在 dsh 设置 → IM 网关 中批准你的访问请求。';
                await channel.send(msg.chatId, reply).catch(() => undefined);
                return;
            }
            // 4. ask_user_question 回答：在普通消息注入前消费
            if (await this.answerQuestion(channel, msg))
                return;
```

</details>

**依据 3 · 源码核查**：[lib/core/gateway.js:595-611](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/core/gateway.js#L595-L611)

普通消息名单规则。

<details>
<summary>查看原文（17行）</summary>

```text
    authorized(channelId, userId) {
        if (this.config.allowAllUsers)
            return true;
        if (!userId)
            return false;
        const perChannel = this.config.allowedUserIds[channelId];
        if (perChannel && perChannel.includes(userId))
            return true;
        // 扁平兜底：keys 为 * 或空时按全局名单
        const global = this.config.allowedUserIds['*'];
        if (global && global.includes(userId))
            return true;
        // UI 批准的渠道白名单
        const extra = this.extraAllowlist.get(channelId);
        if (extra && extra.has(userId))
            return true;
        return false;
```

</details>

**依据 4 · 源码核查**：[lib/core/gateway.js:440-469](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/core/gateway.js#L440-L469)

实际followup到live或新建Agent。

<details>
<summary>查看原文（30行）</summary>

```text
    async injectBlocks(channelId, chatId, blocks) {
        // source 必须为 user：Web 端只把 source.kind==='user' 的消息渲染为用户气泡，
        // plugin 来源会被显示为 context（看起来像"没同步"）
        const message = createUserMessage({
            content: blocks,
            source: { kind: 'user' },
        });
        if (this.config.sessionMode === 'bound') {
            const entry = this.router.get(channelId, chatId);
            if (!entry) {
                return '还没有绑定会话。请先用 /bind <session-id> 绑定一个 DSH 会话，或用 /status 查看。';
            }
            const agent = this.ctx.agents.get(SessionId(entry.sessionId));
            if (!agent) {
                return `会话 ${entry.sessionId} 当前没有运行中的 agent，无法注入。`;
            }
            agent.followup(message);
            this.logLine(`[${channelId}] 消息注入会话 ${entry.sessionId}`);
            return this.ackFor(blocks);
        }
        const entry = await this.router.getOrCreate(channelId, chatId);
        // 优先用自建 handle 的 agent；复用的 live agent 从 entry.agent 取
        const target = entry.handle?.agent ?? entry.agent;
        if (!target) {
            return `会话 ${entry.sessionId} 当前没有运行中的 agent，无法注入。`;
        }
        target.followup(message);
        this.logLine(`[${channelId}] 消息注入会话 ${entry.sessionId}`);
        this.recordTitleIfNeeded(entry.sessionId, blocks);
        this.recordActivity(entry.sessionId);
```

</details>

**依据 5 · 源码核查**：[lib/core/gateway.js:657-717](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/core/gateway.js#L657-L717)

工作区、全部会话、续接与绑定实际分支。

<details>
<summary>查看原文（61行）</summary>

```text
            case '/new':
            case '/clear': {
                if (this.config.sessionMode === 'bound') {
                    this.router.unbind(channelId, chatId);
                    return '已解绑。用 /bind <session-id> 绑定新会话。';
                }
                const entry = await this.router.rotate(channelId, chatId);
                return `已开启全新会话：${entry.sessionId}（工作区 ${entry.workspace ?? this.config.cwd}）`;
            }
            case '/workspaces': {
                return await this.listWorkspaces();
            }
            case '/workspace': {
                const pathArg = args[0];
                if (!pathArg) {
                    const current = this.router.workspaceOf(channelId, chatId) ?? this.config.cwd;
                    return `当前工作区：${current}\n用法：/workspace <路径> 切换（后续 /new 生效）`;
                }
                // 相对路径基于全局 cwd 解析
                const target = pathArg.startsWith('/') ? pathArg : resolve(this.config.cwd, pathArg);
                try {
                    if (!statSync(target).isDirectory())
                        return `不是目录：${target}`;
                }
                catch {
                    return `目录不存在：${target}`;
                }
                this.router.setWorkspace(channelId, chatId, target);
                this.persistWorkspaces();
                return `✅ 工作区已切换：${target}\n发送 /new 在此工作区开启新会话，或 /sessions 查看该工作区的历史会话。`;
            }
            case '/sessions': {
                // 默认当前聊天工作区（与 Web 侧边栏当前工作区视角一致）；all 显示全部
                const filter = args[0];
                let workspace;
                if (filter === 'all') {
                    workspace = undefined;
                }
                else if (filter) {
                    workspace = filter.startsWith('/') ? filter : resolve(this.config.cwd, filter);
                }
                else {
                    workspace = this.router.workspaceOf(channelId, chatId) ?? this.config.cwd;
                }
                return await this.listSessions(workspace);
            }
            case '/continue': {
                const sessionId = args[0];
                if (!sessionId)
                    return '用法：/continue <会话id>（用 /sessions 查看）';
                const r = await this.router.continueSession(channelId, chatId, sessionId);
                if (!r.ok)
                    return `❌ ${r.error}`;
                return `✅ 已继续会话 ${sessionId}${r.workspace ? `（工作区 ${r.workspace}）` : ''}\n直接发消息即可继续对话。`;
            }
            case '/bind': {
                const sessionId = args[0];
                if (!sessionId)
                    return '用法：/bind <session-id>';
                const r = this.router.bind(channelId, chatId, sessionId, msg.userId);
                return r.ok ? `已绑定会话 ${sessionId}。` : `绑定失败：${r.error}`;
```

</details>

**依据 6 · 源码核查**：[lib/core/router.js:49-90](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/core/router.js#L49-L90)

按chat恢复或新建，挂preset。

<details>
<summary>查看原文（42行）</summary>

```text
    /** per-chat 模式：取或建（优先恢复该 chat 上次的会话，否则创建新会话）。 */
    async getOrCreate(channelId, chatId) {
        const key = `${channelId}:${chatId}`;
        const existing = this.entries.get(key);
        if (existing)
            return existing;
        // 重启恢复：上次绑定的会话仍存在则继续它（resume/复用 live），否则新建
        const last = this.chatSessions.get(key);
        if (last) {
            const restored = await this.continueSession(channelId, chatId, last);
            if (restored.ok)
                return this.entries.get(key);
        }
        return this.create(channelId, chatId);
    }
    /** 记录 chat 当前绑定的会话（持久化，重启后恢复）。 */
    recordChatSession(channelId, chatId, sessionId) {
        const key = `${channelId}:${chatId}`;
        this.chatSessions.set(key, sessionId);
        this.options.chatSessionStore?.save(Object.fromEntries(this.chatSessions));
    }
    /** 该 chat 上次绑定的会话（无则 undefined；供命令路径恢复用）。 */
    lastSessionOf(channelId, chatId) {
        return this.chatSessions.get(`${channelId}:${chatId}`);
    }
    /** 创建新会话（per-chat；cwd 优先 chat 工作区偏好）。 */
    async create(channelId, chatId) {
        const key = `${channelId}:${chatId}`;
        const sessionId = SessionId(`im:${channelId}:${chatId}:${Date.now()}`);
        const cwd = this.workspaces.get(key) ?? this.options.cwd;
        const handle = await this.ctx.agents.create({
            sessionId,
            meta: { cwd },
            agentOptions: { provider: this.options.provider, model: this.options.model },
            setup: this.presetSetup(this.options.agentPreset),
        });
        await this.attachToWorkspace(cwd, sessionId);
        const entry = { channelId, chatId, key, sessionId: String(sessionId), handle, workspace: cwd };
        this.entries.set(key, entry);
        this.index(entry);
        this.recordChatSession(channelId, chatId, String(sessionId));
        return entry;
```

</details>

**依据 7 · 源码核查**：[lib/core/router.js:93-119](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/core/router.js#L93-L119)

workspace挂载失败非阻断，preset来自Host。

<details>
<summary>查看原文（27行）</summary>

```text
    async attachToWorkspace(cwd, sessionId) {
        let registry;
        try {
            registry = this.ctx.workspaceRegistry;
        }
        catch {
            // Older hosts do not inject the optional workspace registry.
            return;
        }
        if (!registry)
            return;
        try {
            const workspace = await registry.resolveByPath(cwd) ?? await registry.create(cwd);
            await workspace.attachSession(sessionId);
        }
        catch (err) {
            this.options.log?.(`[gateway] 会话 ${sessionId} 挂载工作区失败: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
    /** Agent setup：把 agent scope 挂入 preset（否则工具/prompt/skills 只有全局层，
     * 缺失 bash/fs/web 等核心工具）。
     */
    presetSetup(presetId) {
        const ctx = this.ctx;
        return async (agentCtx) => {
            await ctx.agentPresets.mount(agentCtx, presetId);
        };
```

</details>

#### 缺口

- 各平台限制/可见性是否阻止未授权消息进入，以及Host额外会话ACL未核。
  **影响**：缺口是插件门禁顺序，不直接等于已确认公网任意人执行shell。
  **进一步探讨**：用两个受控成员验证命令/批准与普通消息，核Host ACL；修复应把身份策略放在所有状态变更前。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 批准、文件外发和HTTP管理的边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

approval/request按Agent session找到关联chat，发送工具名/原因后按sessionId等待文字批准；未显示参数快照或callId，任何相关chat可回答且answerApproval不检查userId。统一入站在名单检查前消费批准，所以群内未授权成员只要能发消息到已绑定chat，也可能结算该session的pending；不应把一个聊天位置当指定审批人的身份。broker每key只容一个pending，重复请求返回undefined交下游，超时/abort/dispose也交回；它不撤回已执行副作用。发送失败被吞后仍等待，不证明用户收到审批。多chat共享同session key，第一个wait占有，后续wait返回undefined，文字本身没有请求编号，旧的延迟“批准”可能对应后来pending，具体时序需运行验证。

im_send_file真实注册并取exec.agent.session.id，只发关联chat，可按channel过滤；无sendMedia的渠道报不支持，各渠道可部分成功，ok表示至少一次成功。统一层把传入path直接交适配器，没有canonical工作区/大小/秘密检查或逐文件确认，不能从描述“工作区文件”推断路径已受限。实际读文件/平台限制需逐适配器检查，Host工具门禁也不等内容DLP。

管理HTTP前缀包含连接、移除、审批名单与定时任务变更。固定handler内没有身份检查，readBody无显式上限且坏JSON变空对象；真实暴露仍取决于注入webServer外层认证与监听配置，本次未审Host，不能称已证实匿名互联网可访问。采用前必须验证外层保护，不能因路径位于设置页就假定安全。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core/gateway.js:964-997](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/core/gateway.js#L964-L997)

审批发送/按session等待及答复无user检查。

<details>
<summary>查看原文（34行）</summary>

```text
    async handleApprovalRequest(req, next) {
        const sessionId = String(req.agent.session.id);
        const chats = this.router.chatsForSession(sessionId);
        if (chats.length === 0)
            return next();
        const timeoutMs = this.config.approvalTimeoutSecs * 1000;
        const text = [
            `⚠️ 批准请求（${timeoutMs / 1000}s 内回复「批准」或「拒绝」）`,
            `工具：${req.toolName}`,
            req.reason ? `原因：${req.reason}` : '',
            '回复「批准」或「拒绝」，超时转回本机批准体系。',
        ].filter(Boolean).join('\n');
        const verdicts = await Promise.all(chats.map(async (chat) => {
            const channel = this.channels.get(chat.channelId);
            if (!channel)
                return undefined;
            await channel.send(chat.chatId, text).catch(() => undefined);
            return this.broker.wait(sessionId, timeoutMs, req.signal);
        }));
        // 任一 chat 批准 → 放行；任一拒绝 → 拒绝；否则委托下游
        if (verdicts.includes('allow'))
            return 'allowed-once';
        if (verdicts.includes('reject'))
            return 'rejected';
        return next();
    }
    async answerApproval(channel, msg, allow) {
        const entry = this.router.get(channel.id, msg.chatId);
        if (!entry)
            return false;
        const answered = this.broker.answer(entry.sessionId, allow);
        if (answered)
            await channel.send(msg.chatId, allow ? '已批准 ✅' : '已拒绝 ❌').catch(() => undefined);
        return answered;
```

</details>

**依据 2 · 源码核查**：[lib/core/approval.js:19-50](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/core/approval.js#L19-L50)

单key、超时、abort与清理。

<details>
<summary>查看原文（32行）</summary>

```text
    wait(key, timeoutMs, signal) {
        if (this.pending.has(key))
            return Promise.resolve(undefined);
        return new Promise((resolve) => {
            const settle = (v) => {
                const entry = this.pending.get(key);
                if (!entry)
                    return;
                clearTimeout(entry.timer);
                this.pending.delete(key);
                resolve(v);
            };
            const timer = setTimeout(() => settle(undefined), timeoutMs);
            timer.unref?.();
            this.pending.set(key, { resolve: settle, timer });
            signal?.addEventListener('abort', () => settle(undefined), { once: true });
        });
    }
    /** IM 侧答复。没有 pending 返回 false。 */
    answer(key, allow) {
        const entry = this.pending.get(key);
        if (!entry)
            return false;
        entry.resolve(allow ? 'allow' : 'reject');
        return true;
    }
    dispose() {
        for (const key of [...this.pending.keys()]) {
            const entry = this.pending.get(key);
            // 直接 resolve：settle 内部会清理 pending 表（先 resolve 后 delete，顺序敏感）
            if (entry)
                entry.resolve(undefined);
```

</details>

**依据 3 · 源码核查**：[lib/core/gateway.js:523-559](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/core/gateway.js#L523-L559)

文件工具注册、执行上下文。

<details>
<summary>查看原文（37行）</summary>

```text
    /** 注册 im_send_file 工具：agent 把工作区文件发给当前 IM 聊天。 */
    registerSendMediaTool() {
        const tools = this.ctx.tools;
        if (!tools)
            return;
        try {
            const disposer = tools.register({
                name: 'im_send_file',
                description: '把工作区文件发送给当前 IM 会话的用户（微信/Telegram/飞书等渠道）。支持图片、视频和任意文档；' +
                    'channel 可指定渠道 id（默认发送到所有关联渠道），caption 为可选附言。',
                parameters: {
                    type: 'object',
                    properties: {
                        path: { type: 'string', description: '要发送的文件路径（相对或绝对）' },
                        caption: { type: 'string', description: '附言文本（可选，先于文件发送）' },
                        channel: { type: 'string', description: '目标渠道 id（可选，默认所有关联渠道）' },
                    },
                    required: ['path'],
                },
                output: {
                    schema: {
                        type: 'object',
                        properties: {
                            ok: { type: 'boolean' },
                            detail: { type: 'string' },
                        },
                        required: ['ok', 'detail'],
                    },
                    render: (args, value) => [{ type: 'text', text: JSON.stringify(value) }],
                },
                execute: async (args, exec) => {
                    const { path, caption, channel: channelFilter } = args;
                    const sessionId = exec.agent?.session?.id;
                    return this.sendFileToChats(path, caption, channelFilter, sessionId ? String(sessionId) : undefined);
                },
            });
            this.disposeTools.push(disposer);
```

</details>

**依据 4 · 源码核查**：[lib/core/gateway.js:565-592](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/core/gateway.js#L565-L592)

路径直接交adapter，部分成功。

<details>
<summary>查看原文（28行）</summary>

```text
    /** 把文件发送到会话关联的所有渠道（im_send_file 工具的执行体，可测试）。 */
    async sendFileToChats(filePath, caption, channelFilter, sessionId) {
        const chats = sessionId ? this.router.chatsForSession(sessionId) : [];
        if (chats.length === 0) {
            return { ok: false, detail: '当前会话没有关联的 IM 聊天（仅 IM 发起的会话可用此工具）' };
        }
        const details = [];
        let anyOk = false;
        for (const chat of chats) {
            if (channelFilter && chat.channelId !== channelFilter)
                continue;
            const ch = this.channels.get(chat.channelId);
            if (!ch?.sendMedia) {
                details.push(`${chat.channelId}: 该渠道不支持发送文件`);
                continue;
            }
            try {
                await ch.sendMedia(chat.chatId, filePath, caption);
                details.push(`${chat.channelId}: 已发送 ${filePath}`);
                anyOk = true;
            }
            catch (err) {
                details.push(`${chat.channelId}: 发送失败（${err instanceof Error ? err.message : String(err)}）`);
            }
        }
        if (details.length === 0)
            details.push('没有匹配的渠道');
        return { ok: anyOk, detail: details.join('；') };
```

</details>

**依据 5 · 源码核查**：[lib/manager.js:357-382](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/manager.js#L357-L382)

HTTP注册、正文解析无本地鉴权。

<details>
<summary>查看原文（26行）</summary>

```text
    /** 注册 HTTP API（prefix 路由，由 webServer 提供）。 */
    registerApi() {
        const webServer = this.ctx.webServer;
        if (!webServer)
            return;
        const send = (res, status, body) => {
            res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(body));
        };
        const readBody = (req) => new Promise((resolve) => {
            let body = '';
            req.on('data', (c) => { body += c; });
            req.on('end', () => {
                try {
                    resolve(body ? JSON.parse(body) : {});
                }
                catch {
                    resolve({});
                }
            });
        });
        this.apiDisposers.push(webServer.register({
            kind: 'prefix',
            path: '/dsh-im-gateway/api',
            handler: async (req, res) => {
                const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
```

</details>

**依据 6 · 源码核查**：[lib/manager.js:431-488](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/manager.js#L431-L488)

管理与名单变更路由。

<details>
<summary>查看原文（58行）</summary>

```text
                // /dsh-im-gateway/api/channels/<id>/connect|disconnect|refresh
                if (parts[2] === 'channels' && parts.length === 5) {
                    const id = parts[3];
                    const action = parts[4];
                    if (req.method !== 'POST') {
                        send(res, 405, { ok: false, error: 'method not allowed' });
                        return;
                    }
                    const body = await readBody(req);
                    if (action === 'connect') {
                        const result = await this.connect(id, body.config);
                        send(res, result.ok ? 200 : 400, result.ok ? { ok: true, channel: this.list().find((c) => c.id === id) } : { ok: false, error: result.error });
                        return;
                    }
                    if (action === 'provision') {
                        const result = await this.startProvisioning(id);
                        send(res, result.ok ? 200 : 400, result.ok ? { ok: true, channel: this.list().find((c) => c.id === id) } : { ok: false, error: result.error });
                        return;
                    }
                    if (action === 'cancel-provision') {
                        await this.cancelProvisioning(id);
                        send(res, 200, { ok: true, channel: this.list().find((c) => c.id === id) });
                        return;
                    }
                    if (action === 'disconnect') {
                        await this.disconnect(id);
                        send(res, 200, { ok: true, channel: this.list().find((c) => c.id === id) });
                        return;
                    }
                    if (action === 'remove') {
                        await this.remove(id);
                        send(res, 200, { ok: true, channel: this.list().find((c) => c.id === id) });
                        return;
                    }
                    if (action === 'refresh') {
                        const result = await this.refreshLogin(id);
                        send(res, result.ok ? 200 : 400, result.ok ? { ok: true, channel: this.list().find((c) => c.id === id) } : { ok: false, error: result.error });
                        return;
                    }
                    if (action === 'approve') {
                        const userId = String(body.userId ?? '');
                        if (!userId) {
                            send(res, 400, { ok: false, error: '缺少 userId' });
                            return;
                        }
                        this.approve(id, userId);
                        send(res, 200, { ok: true, channel: this.list().find((c) => c.id === id) });
                        return;
                    }
                    if (action === 'deny') {
                        const userId = String(body.userId ?? '');
                        if (!userId) {
                            send(res, 400, { ok: false, error: '缺少 userId' });
                            return;
                        }
                        this.deny(id, userId);
                        send(res, 200, { ok: true, channel: this.list().find((c) => c.id === id) });
                        return;
```

</details>

#### 缺口

- Host webServer外层认证和各适配器文件处理未完整核。
  **影响**：不能保证控制面访问限制或文件内容/路径安全。
  **进一步探讨**：隔离profile核未认证HTTP、两个成员与延迟审批；用无秘密目录逐适配器核真实读取和外发。
- 旧批准跨pending和平台重投的真实竞态未测。
  **影响**：不把源码候选时序当已经复现。
  **进一步探讨**：延迟第一请求文字、结束后发第二请求，核是否误结算并保留原调用ID。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 持久与失败恢复怎样影响日常采用？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

渠道配置、名单和待授权请求存channels.json，UI配置覆盖Cordis配置，connect合并后先flush再启，启动失败可能保留启用配置，下次重启再次尝试。flush写失败只日志，load任何读/解析失败回空对象；成功UI状态不能证明重启可恢复。秘密字段随任意配置原样JSON写入，未走独立secret vault，需控制DSH_HOME权限/备份。会话/目录/标题/活动也由index提供独立文件store，不是跨文件事务。

disconnect只停运行态并保留配置，下次启动会恢复；真正退出需remove并核Cordis仍是否enabled、撤平台凭据和机器人权限。停止适配器失败被吞，也不代表远程消息/文件撤回。Telegram offset在内存，处理handler以void触发且offset先推进，不是任务完成确认；重启/异常可能影响消息去重或丢失，不能把自动轮询等同可靠业务队列。HTML发送失败统一再发文本，也无法区分服务已收但响应丢失，不能保证恰好一次。

首次须搭Host/preset/模型、平台应用/SDK或子进程、成员边界及管理API保护；持续付模型、平台配额/机器与维护，金额和净节时未知。失败要核原生任务、发送与本地文件，再决定是否重试；退出保留文件、历史和已发内容均需按归属清理。鉴于命令/批准门禁缺口，当前观察，只可在完全隔离的个人测试profile做无秘密任务，不以名单补丁式配置承诺团队安全。

#### 证据与依据

**依据 1 · 源码核查**：[lib/manager.js:49-80](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/manager.js#L49-L80)

渠道状态JSON与写失败日志。

<details>
<summary>查看原文（32行）</summary>

```text
    constructor(ctx, options) {
        this.ctx = ctx;
        this.options = options;
        this.cron = options.cron;
        this.stateFile = join(options.stateDir, 'channels.json');
        const loaded = this.load();
        this.store = loaded.channels;
        this.allowlist = loaded.allowlist;
        this.pending = loaded.pending;
    }
    load() {
        try {
            const raw = readFileSync(this.stateFile, 'utf8');
            const parsed = JSON.parse(raw);
            return {
                channels: parsed.channels ?? {},
                allowlist: parsed.allowlist ?? {},
                pending: parsed.pending ?? {},
            };
        }
        catch {
            return { channels: {}, allowlist: {}, pending: {} };
        }
    }
    flush() {
        try {
            mkdirSync(this.options.stateDir, { recursive: true });
            writeFileSync(this.stateFile, JSON.stringify({ channels: this.store, allowlist: this.allowlist, pending: this.pending }, null, 2));
        }
        catch (err) {
            this.options.log(`[manager] 状态落盘失败: ${err instanceof Error ? err.message : String(err)}`);
        }
```

</details>

**依据 2 · 源码核查**：[lib/manager.js:143-180](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/manager.js#L143-L180)

配置优先/重启自动启用、connect先持久。

<details>
<summary>查看原文（38行）</summary>

```text
    /** 合并配置：channels.json（UI）优先，cordis config 兜底。 */
    mergedConfig(id) {
        const cordis = this.options.config.channels[id] ?? {};
        return { ...cordis, ...(this.store[id] ?? {}) };
    }
    /** 启动时初始化：合并配置中应启用的渠道全部启动；并把持久化白名单灌入网关。 */
    async initAll() {
        // 重启后恢复 UI 批准的渠道白名单
        for (const [channelId, users] of Object.entries(this.allowlist)) {
            for (const userId of users)
                this.options.gateway.addAuthorizedUser(channelId, userId);
        }
        for (const id of CHANNEL_IDS) {
            const cfg = this.mergedConfig(id);
            // 启用判定：cordis enabled=true，或 store 存在且未被显式禁用
            // （断开只停运行态不写 enabled，因此"配置了 = 重启自动恢复"）
            const stored = this.store[id];
            const enabled = cfg.enabled === true || (stored !== undefined && stored.enabled !== false);
            if (enabled) {
                await this.connect(id).catch((err) => {
                    this.options.log(`[manager] ${id} 启动失败: ${err instanceof Error ? err.message : String(err)}`);
                });
            }
        }
    }
    /** 持久化白名单条目（重启恢复用）。 */
    allowlistEntries() {
        return Object.entries(this.allowlist);
    }
    /** 启用并启动一个渠道。extra 里的字段合并进配置并持久化。 */
    async connect(id, extra) {
        const meta = CHANNEL_META[id];
        if (!meta)
            return { ok: false, error: `未知渠道 ${id}` };
        // 合并 extra → store
        if (extra) {
            this.store[id] = { ...(this.store[id] ?? {}), ...extra, enabled: true };
            this.flush();
```

</details>

**依据 3 · 源码核查**：[lib/manager.js:208-230](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/manager.js#L208-L230)

断开不禁用，移除范围。

<details>
<summary>查看原文（23行）</summary>

```text
    /**
     * 停用并停止一个渠道（仅运行态，不持久化 enabled——重启后按配置自动恢复）。
     * 彻底移除配置请用 {@link remove}。
     */
    async disconnect(id) {
        const adapter = this.running.get(id);
        if (adapter) {
            await Promise.resolve(adapter.stop()).catch(() => undefined);
            this.running.delete(id);
            this.options.gateway.unregister(id);
        }
        this.options.log(`[manager] ${id} 已断开（配置保留，重启自动恢复）`);
    }
    /** 彻底移除渠道：停止并删除持久化配置（重启后不再自动连接）。 */
    async remove(id) {
        await this.cancelProvisioning(id);
        await this.disconnect(id);
        if (this.store[id]) {
            delete this.store[id];
            this.flush();
        }
        // 清空该渠道的授权与待授权
        delete this.allowlist[id];
```

</details>

**依据 4 · 源码核查**：[lib/index.js:58-78](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/index.js#L58-L78)

默认stateDir与日志落盘。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx, config) {
    const dshHome = process.env.DSH_HOME ?? join(homedir(), '.dsh');
    const instanceLock = acquireDshHomeInstanceLock(dshHome);
    try {
        ctx.effect(() => () => instanceLock.release(), 'im-gateway.instance-lock');
    }
    catch (error) {
        instanceLock.release();
        throw error;
    }
    const stateDir = config.stateDir !== ''
        ? config.stateDir
        : join(dshHome, 'dsh-im-gateway');
    mkdirSync(stateDir, { recursive: true });
    // 环形日志缓冲：Web UI 的 jobs readOutput 可读（扫码链接等），同时落盘便于排查
    const recent = [];
    const rawLog = ctx.logger(name);
    const logFile = join(stateDir, 'gateway.log');
    const log = (line) => {
        const stamped = `${new Date().toISOString()} ${line}`;
        recent.push(stamped);
```

</details>

**依据 5 · 源码核查**：[lib/channels/telegram.js:27-61](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/channels/telegram.js#L27-L61)

offset先推进、void handler与内存轮询。

<details>
<summary>查看原文（35行）</summary>

```text
    async function pollLoop() {
        while (!stopped) {
            try {
                const updates = await api('getUpdates', {
                    offset,
                    timeout: config.pollingTimeoutSec ?? 30,
                    allowed_updates: ['message'],
                });
                errorCount = 0;
                lastError = '';
                for (const update of updates) {
                    offset = update.update_id + 1;
                    const msg = update.message;
                    if (!msg?.text)
                        continue;
                    if (msg.chat.type === 'channel')
                        continue;
                    void handler?.({
                        chatId: String(msg.chat.id),
                        userId: msg.from ? String(msg.from.id) : undefined,
                        username: msg.from?.username ?? msg.from?.first_name,
                        text: msg.text,
                    });
                }
            }
            catch (err) {
                errorCount += 1;
                lastError = err instanceof Error ? err.message : String(err);
                log(`[telegram] 轮询错误（第 ${errorCount} 次）: ${lastError}`);
                await sleep(Math.min(1000 * errorCount, 10000));
            }
            if (stopped)
                break;
            // 空批次避免空转
            await sleep(50);
```

</details>

**依据 6 · 源码核查**：[lib/channels/telegram.js:76-80](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/channels/telegram.js#L76-L80)

失败文本重发。

```text
        async send(chatId, text) {
            await api('sendMessage', { chat_id: Number(chatId), text, parse_mode: 'HTML' }).catch(async () => {
                // HTML 实体非法时回退纯文本
                await api('sendMessage', { chat_id: Number(chatId), text });
            });
```

#### 缺口

- 坏状态/掉盘/平台重投与凭据退出真实结果未知。
  **影响**：不可承诺无损恢复或零重复外发。
  **进一步探讨**：在隔离数据上核状态写失败、重启、断开/删除区别与丢响应，记录实际副作用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪一种聚合增量值得继续验证？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可研究把统一入口改为统一的授权与决定关联协议：先校验platform+user+chat可信身份和角色，再允许命令、普通消息、批准、文件与定时动作；每次决定携带不可混淆requestId、原生callId和参数摘要，记录批准/执行/送达分阶段状态。基线是当前先命令和批准后名单、session级文字pending及各适配器自管发送，增量应是所有渠道共享可解释的边界，而非增加平台数量。

最小实验只选Telegram文本和一个支持文件的真实适配器，对同任务注入未授权命令、群内其他成员批准、延迟旧回复、超时、重启与发送丢响应；记录越权决定数、误拒、重复副作用、真实完成率和人审恢复时间。成功需越权/错绑定为零且不比单渠道方案增加无法解释的人工恢复，仍要保留Host沙箱和未知结果状态，不能声称跨平台消息撤回或分布式事务。

若平台不能给可信用户身份或回传requestId，宁可关闭远程批准，退原生Web；若单渠道已满足需求、统一协议维护更贵，停止聚合扩展。此为未验证方向，不记入现有创新分，不代表作者已实现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core/gateway.js:330-364](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/core/gateway.js#L330-L364)

推导统一前置门禁的现有缺口。

<details>
<summary>查看原文（35行）</summary>

```text
        if (!channel)
            return;
        try {
            // 0. 恢复该 chat 的上次会话绑定（命令也会触发，使 /status 显示真实状态）
            await this.ensureChatRestored(channelId, msg.chatId);
            // 1. 命令（不经合并窗口）
            if (msg.text.startsWith('/')) {
                const reply = await this.handleCommand(channel, msg);
                if (reply !== undefined)
                    await channel.send(msg.chatId, reply);
                return;
            }
            // 2. 批准 / 拒绝（应答审批）
            const verdictText = msg.text.trim();
            if (verdictText === '批准' || verdictText === '同意' || verdictText === 'yes' || verdictText === 'y' || verdictText === 'allow') {
                const handled = await this.answerApproval(channel, msg, true);
                if (handled)
                    return;
            }
            if (verdictText === '拒绝' || verdictText === 'no' || verdictText === 'n' || verdictText === 'reject' || verdictText === 'deny') {
                const handled = await this.answerApproval(channel, msg, false);
                if (handled)
                    return;
            }
            // 3. 白名单：渠道本地授权（如微信扫码用户）优先，其次网关全局白名单
            const localAuth = channel.authorizes?.(msg.userId ?? '');
            if (localAuth === false || (localAuth === undefined && !this.authorized(channelId, msg.userId))) {
                this.logLine(`[${channelId}] 未授权用户 ${msg.userId ?? '(匿名)'} 消息被拦截（已登记待授权）`);
                const reply = this.unauthorizedHandler?.(channelId, msg) ?? '⛔ 未授权：请在 dsh 设置 → IM 网关 中批准你的访问请求。';
                await channel.send(msg.chatId, reply).catch(() => undefined);
                return;
            }
            // 4. ask_user_question 回答：在普通消息注入前消费
            if (await this.answerQuestion(channel, msg))
                return;
```

</details>

**依据 2 · 源码核查**：[lib/core/gateway.js:964-997](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/core/gateway.js#L964-L997)

推导请求关联而非session文字。

<details>
<summary>查看原文（34行）</summary>

```text
    async handleApprovalRequest(req, next) {
        const sessionId = String(req.agent.session.id);
        const chats = this.router.chatsForSession(sessionId);
        if (chats.length === 0)
            return next();
        const timeoutMs = this.config.approvalTimeoutSecs * 1000;
        const text = [
            `⚠️ 批准请求（${timeoutMs / 1000}s 内回复「批准」或「拒绝」）`,
            `工具：${req.toolName}`,
            req.reason ? `原因：${req.reason}` : '',
            '回复「批准」或「拒绝」，超时转回本机批准体系。',
        ].filter(Boolean).join('\n');
        const verdicts = await Promise.all(chats.map(async (chat) => {
            const channel = this.channels.get(chat.channelId);
            if (!channel)
                return undefined;
            await channel.send(chat.chatId, text).catch(() => undefined);
            return this.broker.wait(sessionId, timeoutMs, req.signal);
        }));
        // 任一 chat 批准 → 放行；任一拒绝 → 拒绝；否则委托下游
        if (verdicts.includes('allow'))
            return 'allowed-once';
        if (verdicts.includes('reject'))
            return 'rejected';
        return next();
    }
    async answerApproval(channel, msg, allow) {
        const entry = this.router.get(channel.id, msg.chatId);
        if (!entry)
            return false;
        const answered = this.broker.answer(entry.sessionId, allow);
        if (answered)
            await channel.send(msg.chatId, allow ? '已批准 ✅' : '已拒绝 ❌').catch(() => undefined);
        return answered;
```

</details>

**依据 3 · 源码核查**：[lib/core/gateway.js:565-592](https://github.com/zhuiyueya/dsh-im-gateway/blob/8e8fbca125dda15b5cdd2ae79ac63a91e21f7c37/lib/core/gateway.js#L565-L592)

推导执行/送达分阶段边界。

<details>
<summary>查看原文（28行）</summary>

```text
    /** 把文件发送到会话关联的所有渠道（im_send_file 工具的执行体，可测试）。 */
    async sendFileToChats(filePath, caption, channelFilter, sessionId) {
        const chats = sessionId ? this.router.chatsForSession(sessionId) : [];
        if (chats.length === 0) {
            return { ok: false, detail: '当前会话没有关联的 IM 聊天（仅 IM 发起的会话可用此工具）' };
        }
        const details = [];
        let anyOk = false;
        for (const chat of chats) {
            if (channelFilter && chat.channelId !== channelFilter)
                continue;
            const ch = this.channels.get(chat.channelId);
            if (!ch?.sendMedia) {
                details.push(`${chat.channelId}: 该渠道不支持发送文件`);
                continue;
            }
            try {
                await ch.sendMedia(chat.chatId, filePath, caption);
                details.push(`${chat.channelId}: 已发送 ${filePath}`);
                anyOk = true;
            }
            catch (err) {
                details.push(`${chat.channelId}: 发送失败（${err instanceof Error ? err.message : String(err)}）`);
            }
        }
        if (details.length === 0)
            details.push('没有匹配的渠道');
        return { ok: anyOk, detail: details.join('；') };
```

</details>

#### 缺口

- 统一身份/回执能否跨平台实现并减少恢复成本未验证。
  **影响**：仅方向，不是新增能力或收益。
  **进一步探讨**：先做两适配器故障对照；无可信身份或净收益就停止。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
