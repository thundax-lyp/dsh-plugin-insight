# dsh-msg-hub

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[0fd11c3](https://github.com/AbcdefgXW/dsh-msg-hub/tree/0fd11c38fa21d5639ea53f067a221d8ff7d8675c)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-msg-hub) [![npm 30d 1,164](https://img.shields.io/static/v1?label=npm+30d&message=1%2C164&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-msg-hub) [![最新发布 2026-09-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-msg-hub)
<!-- END META -->

> **实现功能**：把微信、QQ、飞书消息接入 DSH 会话，并提供主动推送与远程审批/状态功能。

> **核心亮点**：将三渠道收发、媒体、主动推送和远程监控整合到 DSH；详见[Q01](#research-q01)。

> **风险与缺陷**：全局 pending 第一项可由任意经桥进入的 peer 的“批准”应答，/bind 也缺会话授权核对；详见[Q02](#research-q02)。 回传失败仍可返回ok，入站无全链deadline，处理完成不能当送达回执。

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
  - [Q01 · 三渠道消息和主动推送如何接入 Agent？](#detail-section-11)
  - [Q02 · 远程 /bind 与“批准/拒绝”是否只作用于有权的会话和请求？](#detail-section-12)
  - [Q03 · 部署、媒体处理与失败恢复成本如何决定采用？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 IM 中与 DSH Agent 会话、接收定时任务回复和远程审批通知。

分别部署微信、QQ、飞书单渠道机器人或人工转发 Agent 结果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 三渠道桥 | 微信/QQ/飞书消息收发及会话 | 平台凭据与各自权限 |
| dsh-channels-push | push/task 与第三方渠道注册 | 依赖适配器、送达未实测 |
| 远程审批/状态 | IM 通知并回复批准/拒绝 | 当前应答未绑定来源，不宜开放 |
| 会话命令 | /sessions、/bind、/status 等管理 | /bind 缺会话授权校验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH agents/sessions/agentDefaultModel | 必需 | 会话桥与任务下发 | 插件无法按声明运行 |
| 微信/QQ/飞书凭据 | 各启用渠道必需 | 平台登录与消息收发 | 该渠道不可用 |
| QQ 主动消息权限 | 仅主动推送必需 | 计划任务主动发消息 | 可能静默失败 |
| DASHSCOPE_API_KEY | 仅自建 ASR 必需 | 微信/回退语音转写 | 语音可跳过 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 管理员核平台凭据、消息权限与 DSH profile | 测试账号可连接 |
| 加载 | 安装 bundle、登录并重启 web | 三渠道逐一有状态 |
| 任务 | 测试 peer 发送文字/媒体，按需用 push/task | 会话与回传可核 |
| 验收/恢复 | 管理员量测送达与授权；先关闭远程批准 | 越权 peer 不可批准；失败重登/排障 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH web、各平台应用/账号、可选 ASR key；价格未知 | 扫码/配置凭据、平台审核、审远程授权；耗时未知 | QQ 主动消息权限需另申请 |
| 持续使用 | 平台消息、媒体下载/ASR、state/日志/媒体存储；量值未知 | 监控连接/消息送达、清理媒体、复核审批；耗时未知 | 微信模拟协议稳定性与费率未知 |
| 失败恢复 | 重登/重试/ASR 失败与日志媒体留存占资源；金额未知 | 轮换凭据、排查误审批/漏发、恢复会话；耗时未知 | 无全链deadline/取消，回传失败仍可能ok；实际送达与重复副作用影响未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多渠道桥 | Q01 源码有三适配器与 Agent 入站链 | 真实送达率 |
| push/task | Q01 源码有服务接口 | 平台主动消息权限与实际回传 |
| 远程审批 | Q02 源码有通知/应答 | 越权影响及外层准入 |

> **思考**：全局 pending 第一项可由任意经桥进入的 peer 的“批准”应答，/bind 也缺会话授权核对；详见[Q02](#research-q02)。 回传失败仍可返回ok，入站无全链deadline，处理完成不能当送达回执。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将三渠道收发、媒体、主动推送和远程监控整合到 DSH；详见[Q01](#research-q01)。

将三渠道收发、媒体、主动推送和远程监控整合到 DSH；详见[Q01](#research-q01)。

渠道适配器注册表、会话绑定持久化、状态/审批事件、媒体和日志生命周期。

runTurn先等Agent idle、followup后再次whenIdle并flush，未见本层总deadline或调用方AbortSignal；远程审批5分钟timer仅在逐peer通知完成后建立，不能限制整个Agent回合、平台发送或入站锁等待。inbound回传outcome.text失败只记日志，随后仍返回ok:true，因此桥处理成功不证明平台受理/送达。未知外部结果不能直接整包重发，否则可能重复执行Agent工具副作用。

<a id="detail-section-5"></a>

### 1.4 主要限制

全局 pending 第一项可由任意经桥进入的 peer 的“批准”应答，/bind 也缺会话授权核对；详见[Q02](#research-q02)。 回传失败仍可返回ok，入站无全链deadline，处理完成不能当送达回执。

<a id="detail-section-6"></a>

### 1.5 使用建议

远程批准应先停用或仅在严格可信单 peer 环境隔离评估，修复来源绑定后再用真实渠道；详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可核多渠道入口；远程审批应答未绑定 peer/session/请求，存在条件性越权批准风险，未活平台复现。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/bridge.js、lib/remote.js、lib/session-events.js、lib/qq/adapter.js、lib/feishu/adapter.js、lib/weixin/adapter.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态审阅；未登录真实 IM、运行目标代码或宿主。外层平台准入及 DSH approval 最终语义未知。
- 下一步：双 peer/双会话并发审批、未授权 /bind 与 /sessions 测试；各渠道送达/媒体/ASR 量测。

**分析版本**

- **仓库**：[AbcdefgXW/dsh-msg-hub](https://github.com/AbcdefgXW/dsh-msg-hub)
- **版本号**：0.1.11（[固定提交 0fd11c3](https://github.com/AbcdefgXW/dsh-msg-hub/tree/0fd11c38fa21d5639ea53f067a221d8ff7d8675c)）
- **版本日期**：2026-09-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

以 peer/session/callId 做严格关联并授权 /bind 可收窄远程批准风险；需双 peer 并发试验，详见[Q03](#research-q03)。

双 peer/双会话并发审批、未授权 /bind 与 /sessions 测试；各渠道送达/媒体/ASR 量测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 19 | 2940 | 2252 | 542 | — |
| .ts | source | 9 | 1892 | 1403 | 304 | — |
| .md | source | 2 | 322 | — | — | 2816 |
| .mjs | source | 5 | 449 | 344 | 75 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-msg-hub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-msg-hub/issues?q=is%3Aissue+created%3A2026-09-22T08%3A11%3A16.485Z..2026-10-22T08%3A11%3A16.485Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-msg-hub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T08%3A11%3A16.485Z..2026-10-22T08%3A11%3A16.485Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实多渠道桥与远程审批实际边界，特别是 IM peer 与待审批请求的绑定。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 三渠道消息和主动推送如何接入 Agent？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

入口注入 agents/sessions/agentDefaultModel，启动微信监控、QQ 与飞书 bot，入站消息先过远程命令处理，再交 bridge.inbound；ChannelsPushApi 提供 push、task、registerChannel、resolveChannel，内置三适配器并可扩展。微信使用 ilinkai 模拟协议，QQ/飞书使用开放平台 API；图片落工作区路径、语音可转写是 README 声明及对应代码模块，需真实账户验证。

runTurn先等Agent idle、followup后再次whenIdle并flush，未见本层总deadline或调用方AbortSignal；远程审批5分钟timer仅在逐peer通知完成后建立，不能限制整个Agent回合、平台发送或入站锁等待。inbound回传outcome.text失败只记日志，随后仍返回ok:true，因此桥处理成功不证明平台受理/送达。未知外部结果不能直接整包重发，否则可能重复执行Agent工具副作用。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:23-66](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/index.js#L23-L66)

注入、主动推送服务与适配器注册。

<details>
<summary>查看原文（44行）</summary>

```text
export const name = "dsh-msg-hub";

export const inject = ["agents", "sessions", "agentDefaultModel"];

/**
 * 主动推送服务（供其他插件调用，如 dsh-toolbox 定时心跳推送渠道）。
 * - push({channel, peerId, text})：直接发文本到 IM（不经过 agent）
 * - task({channel, peerId, prompt})：完整流程——唤醒渠道 agent 执行 prompt，回复回传 IM
 * - registerChannel(channel, adapter)：**适配器注册表**——第三方插件可注册自己的渠道
 *   adapter = { send: (peerId, text) => Promise, matchSessionId?: (sessionId) => boolean }
 *   （内置 weixin/qq/feishu 已注册；注册后 push/task 与 sessionId 解析自动支持该渠道）
 * - resolveChannel(sessionId)：把 ch-<channel>-<peerId> 会话 ID 解析为 {channel, peerId}
 * peerId 与 dsh-msg-hub 会话 ID 反推一致（如 ch-weixin-<peerId>）。
 */
export class ChannelsPushApi extends Service {
  constructor(ctx, deps) {
    super(ctx, "dsh-channels-push");
    this.deps = deps; // { bridge, getWeixinAccount, getQqBot, getFeishuClient }
    /** 适配器注册表：channel -> adapter */
    this.channels = new Map();
  }

  /** 注册渠道适配器（第三方渠道插件接入点）。 */
  registerChannel(channel, adapter) {
    if (!channel || typeof channel !== "string") throw new TypeError("channel 必须是非空字符串");
    if (!adapter || typeof adapter.send !== "function") throw new TypeError("adapter 必须提供 send(peerId, text)");
    this.channels.set(channel, adapter);
    return { ok: true, channel };
  }

  /** 通过会话 ID 解析渠道（优先注册表 matchSessionId，内置前缀兜底）。 */
  resolveChannel(sessionId) {
    const s = String(sessionId || "");
    // 轮换后的 ID 带 -N 尾缀（ch-weixin-<openid>-2），反解时剥掉，不影响真实 peerId
    const stripEpoch = (pid) => String(pid).replace(/-\d+$/, "");
    for (const [channel, adapter] of this.channels) {
      if (typeof adapter.matchSessionId === "function" && adapter.matchSessionId(s)) {
        const prefix = "ch-" + channel + "-";
        if (s.startsWith(prefix)) return { channel, peerId: stripEpoch(s.slice(prefix.length)) };
      }
    }
    // 内置前缀兜底
    for (const [prefix, channel] of [["ch-weixin-", "weixin"], ["ch-qq-", "qq"], ["ch-feishu-", "feishu"]]) {
      if (s.startsWith(prefix)) return { channel, peerId: stripEpoch(s.slice(prefix.length)) };
```

</details>

**依据 2 · 源码核查**：[index.js:180-313](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/index.js#L180-L313)

三渠道监控/入站处理和远程命令优先。

<details>
<summary>查看原文（134行）</summary>

```text
  const pushApi = new ChannelsPushApi(ctx, deps);
  // 内置三渠道注册进适配器注册表（第三方插件可用 registerChannel 继续扩展）
  pushApi.registerChannel("weixin", {
    send: async (peerId, text) => {
      const acc = deps.getWeixinAccount();
      if (!acc) throw new Error("无已配置微信账户");
      await sendWeixinText(acc, peerId, text);
    },
    matchSessionId: (id) => String(id).startsWith("ch-weixin-"),
  });
  pushApi.registerChannel("qq", {
    send: async (peerId, text) => {
      const bot = deps.getQqBot();
      if (!bot) throw new Error("无 QQ bot 在线");
      if (!String(peerId).startsWith("c2c:")) throw new Error("QQ 群聊推送暂不支持（仅 c2c 私聊）");
      await sendQqText(bot, { scope: "c2c", targetId: String(peerId).slice(4) }, text);
    },
    matchSessionId: (id) => String(id).startsWith("ch-qq-"),
  });
  pushApi.registerChannel("feishu", {
    send: async (peerId, text) => {
      const client = deps.getFeishuClient();
      if (!client) throw new Error("无飞书 client 在线");
      if (!String(peerId).startsWith("p2p:")) throw new Error("飞书群聊推送暂不支持（仅 p2p 私聊）");
      await sendFeishuText(client, String(peerId).slice(4), text);
    },
    matchSessionId: (id) => String(id).startsWith("ch-feishu-"),
  });
  log.info("dsh-msg-hub: push 服务已提供（dsh-channels-push，含适配器注册表）");

  // ── 远程监控：审批远程批准 / turn 推送 / /sessions /bind /status /new /release /cfg ──
  const remote = createRemoteMonitor(ctx, {
    push: async (channel, peerId, text) => {
      const r = await pushApi.push({ channel, peerId, text });
      if (!r.ok) log.warn(`dsh-msg-hub: 远程推送失败 ${channel}/${peerId}: ${r.error}`);
    },
    rotate: (channel, peerId) => bridge.rotate(channel, peerId),
    releaseTarget: (channel, peerId) => bridge.releaseTarget(channel, peerId),
    release: (keepCount) => bridge.release(keepCount),
    getCfg: () => getChannelsCfg(),
    setCfg: (patch) => setChannelsCfg(patch),
  });
  log.info("dsh-msg-hub: 远程监控已启用（/sessions /bind /status + 审批远程批准）");
  ctx.on("dispose", () => remote.stop());

  // ── 微信 ──
  async function handleWeixinMessage(text, peerId, contextToken) {
    // 远程监控命令（/sessions /bind /status /审批应答）优先拦截
    const sessionsSvc = ctx.get("sessions");
    if (await remote.handleCommand("weixin", peerId, text, sessionsSvc)) return;
    // 找到 peerId 对应的账户（token/contextToken 匹配）；简化：用第一个已配置账户
    const account = resolveFirstConfiguredAccount();
    if (!account) {
      log.warn("没有已配置的微信账户，忽略消息");
      return;
    }
    await bridge.inbound({
      channel: "weixin",
      peerId,
      text,
      reply: async (replyText) => {
        await sendWeixinText(account, peerId, replyText, contextToken);
      },
    });
  }

  function resolveFirstConfiguredAccount() {
    const ids = listWeixinAccountIds();
    for (const id of ids) {
      const acc = resolveWeixinAccount(id);
      if (acc.configured) return acc;
    }
    return null;
  }

  const stopWeixin = startWeixinMonitors({ onMessage: handleWeixinMessage });
  log.info("dsh-msg-hub: weixin monitors started");

  // ── QQ ──
  const qqRuntime = { bots: new Map(), stop: () => {} };
  startQqBots({
    onMessage: async (text, peerKey, replyTarget, msg, bot) => {
      const sessionsSvc = ctx.get("sessions");
      if (await remote.handleCommand("qq", peerKey, text, sessionsSvc)) return;
      await bridge.inbound({
        channel: "qq",
        peerId: peerKey,
        text,
        reply: async (replyText) => {
          await sendQqText(bot, replyTarget, replyText);
        },
      });
    },
  })
    .then((runtime) => {
      qqRuntime.bots = runtime.bots;
      qqBotsMap = runtime.bots;
      qqRuntime.stop = runtime.stop;
      log.info(`dsh-msg-hub: qq bots started (${runtime.bots.size})`);
    })
    .catch((err) => {
      diagLog(`[qq] 启动失败: ${String(err)}`);
    });

  // ── 飞书 ──
  const feishuRuntime = { clients: new Map(), stop: () => {} };
  startFeishuBots({
    onMessage: async (text, peerKey, event, client) => {
      const openId = event?.sender?.sender_id?.open_id ?? "";
      if (!openId) return;
      const sessionsSvc = ctx.get("sessions");
      if (await remote.handleCommand("feishu", peerKey, text, sessionsSvc)) return;
      await bridge.inbound({
        channel: "feishu",
        peerId: peerKey,
        text,
        reply: async (replyText) => {
          await sendFeishuText(client, openId, replyText);
        },
      });
    },
  })
    .then((runtime) => {
      feishuRuntime.clients = runtime.clients;
      feishuClientsMap = runtime.clients;
      feishuRuntime.stop = runtime.stop;
      log.info(`dsh-msg-hub: feishu bots started (${runtime.clients.size})`);
    })
    .catch((err) => {
      diagLog(`[feishu] 启动失败: ${String(err)}`);
    });

  // 卸载时停止
  ctx.on("dispose", () => {
```

</details>

**依据 3 · 作者声明**：[README.md:8-29](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/README.md#L8-L29)

作者描述渠道、媒体、主动推送与远程审批。

<details>
<summary>查看原文（22行）</summary>

```text
> dsh（DeepSeek Harness）IM 渠道桥插件：把微信（ilinkai）/ QQ（开放平台）/ 飞书（开放平台）的消息接入 dsh agent 会话，并支持**主动推送**（供定时任务等场景唤醒 bot 并把 AI 回复回传手机）。

## 功能

- **📱 微信**：ilinkai 模拟协议（扫码登录），收发文本 / 图片 / 语音
- **💬 QQ**：腾讯开放平台官方 WebSocket 通道，收发文本 / 图片 / 语音（C2C 私聊 / 群聊）
- **📡 飞书**：飞书开放平台官方 API（应用凭证），收发文本 / 图片 / 语音（P2P 私聊 / 群聊）
- **🖼️ 图片与语音**（三渠道均已支持）：
  - **图片**：下载后存到工作区 `.im-media/<渠道>/<日期>/`，会话里只带路径，由 agent 用 `read_image` 自行查看——dsh 原生支持图片输入，纯文本模型会自动降级；默认保留 7 天（`DSH_MSG_HUB_MEDIA_KEEP_DAYS` 可调）
  - **语音**：转成文字后注入会话（模型听不了音频）。QQ 直接用官方给的 `asr_refer_text`（免费、即时、比自建更准），为空才回退自建 ASR
  - **微信语音**：官方 CDN 下载 → AES-128-ECB 解密 → silk→WAV 转码（`silk-wasm`）→ 自建 ASR
  - **自建 ASR 需配置**：`state/asr.env` 写 `DASHSCOPE_API_KEY`；未配置时语音自动跳过，不影响文本与图片
  - **清理策略**：媒体按日期分目录，写入时每天最多清理一次超期文件
- **🩺 诊断日志**：`state/logs/bridge-debug.log`，内置大小轮转（默认 5MB × 3 份）与每日日志清理（默认 14 天），可用 `DSH_MSG_HUB_LOG_MAX_BYTES` / `DSH_MSG_HUB_LOG_KEEP` / `DSH_MSG_HUB_LOG_KEEP_DAYS` 调整
- **🧩 主动推送服务**（`dsh-channels-push` cordis 服务）：
  - `push({channel, peerId, text})`：直接向 IM 发文本
  - `task({channel, peerId, prompt})`：唤醒渠道 agent 执行任务，AI 回复自动回传 IM
  - 供 dsh-toolbox-web 定时心跳等插件调用（未安装本插件时渠道推送自动不可用，不影响其他功能）
- **📡 远程监控**（离开电脑也能盯任务）：
  - **审批远程批准**：绑定会话的 agent 请求批准时推送到 IM（含工具名/原因/命令详情），回复「批准」或「拒绝」应答；5 分钟超时按拒绝处理（安全默认）
  - **turn 状态推送**：绑定会话的任务开始 / 完成 / 出错 / 被阻塞时实时推送
  - **会话命令**：`/sessions` 列出最近 5 个会话（名称+ID）、`/bind <会话ID>` 绑定、`/status` 查看绑定状态
```

</details>

**依据 4 · 源码核查**：[lib/bridge.js:401-416](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/lib/bridge.js#L401-L416)

等待Agent/flush无本层deadline或signal。

<details>
<summary>查看原文（16行）</summary>

```text
    try {
      await agent.whenIdle();
      const firstSeq = agent.session.seq;
      agent.followup(
        createUserMessage({
          content: [{ type: "text", text }],
          source: { kind: "user" },
        }),
      );
      await agent.whenIdle();
      await sessions.flush(agent.session);
      // dsh 0.1.5-rc.2 起 Session 不再暴露 events 属性（改 snapshotEvents()），统一经 sessionEvents 兼容取
      return summarize(sessionEvents(agent.session, firstSeq), firstSeq);
    } finally {
      // 释放决策统一交给 sweep()：按常驻策略保留最近 N 个，超出/未启用即释放
      await sweep();
```

</details>

**依据 5 · 源码核查**：[lib/bridge.js:523-545](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/lib/bridge.js#L523-L545)

回传失败记日志后仍ok:true。

<details>
<summary>查看原文（23行）</summary>

```text
  async function inbound({ channel, peerId, text, reply }) {
    const sessionId = sessionIdFor(channel, peerId);
    return withLock(sessionId, async () => {
      try {
        const outcome = await runTurn(sessionId, text);
        if (outcome.reason?.kind === "error") {
          const errText = `处理出错：${outcome.reason.error?.message ?? "未知错误"}`;
          diagLog(`${errText}（sessionId=${sessionId}）`);
          await reply?.(errText).catch((e) => diagLog(`错误回传失败：${e instanceof Error ? e.message : String(e)}（sessionId=${sessionId}）`));
          return { ok: false, error: errText };
        }
        // 回复回传必须留痕：此前 .catch(()=>{}) 把发送失败完全吞掉，线上无法判断"没发"还是"发了没到"
        if (outcome.text) {
          try {
            await reply?.(outcome.text);
            diagLog(`回复回传成功（${outcome.text.length} 字，sessionId=${sessionId}）`);
          } catch (e) {
            diagLog(`❌ 回复回传失败：${e instanceof Error ? e.message : String(e)}（${outcome.text.length} 字，sessionId=${sessionId}）\n${e instanceof Error ? (e.stack ?? "") : ""}`);
          }
        } else {
          diagLog(`⚠️ 回复文本为空，未回传（sessionId=${sessionId}，reason=${JSON.stringify(outcome.reason ?? null)}）`);
        }
        return { ok: true };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 远程 /bind 与“批准/拒绝”是否只作用于有权的会话和请求？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

remote.handleCommand 对任何已进入该桥的渠道 peer 提供 /sessions 最近会话标题与 ID，/bind 直接把给定 sid 写入绑定，未见该 peer 对会话的授权或 sid 存在性校验。approval/request 向绑定 peers 发详情，pending 仅按 callId 存 resolve/timer；处理“批准/拒绝”时只要全局 pending 非空就取 pending.values() 第一项，不核回复 peer、channel、sessionId、callId，也不核其是否收到该审批通知。因此若多个 peer 可发消息到 bot，其中任一 peer 的匹配文本可应答最早未决审批，包括不是自己会话的审批。超时 5 分钟拒绝仅覆盖无人应答情形，不能替代身份绑定。此为固定源码逻辑风险，未做真实 IM 攻击复现；外层各渠道身份/准入策略另核。

#### 证据与依据

**依据 1 · 源码核查**：[lib/remote.js:122-150](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/lib/remote.js#L122-L150)

按 session 选推送对象，但 pending 只存 resolve/timer。

<details>
<summary>查看原文（29行）</summary>

```text
  // ── 审批远程批准：拦截 approval/request waterfall ──
  const stopApproval = ctx.on("approval/request", async (req, next) => {
    try {
      const sessionId = req?.agent?.id;
      if (!sessionId) return next();
      const peers = findPeersForSession(bindings, sessionId);
      if (peers.length === 0) return next(); // 无绑定：走默认流程
      const callDetail = extractCallDetail(req.agent.session, req.callId);
      const reason = req.reason ? `\n原因：${req.reason}` : "";
      const cmd = callDetail ? `\n命令：${callDetail}` : "";
      const prompt = `🔐 需要批准\n工具：${req.toolName || "?"}${reason}${cmd}\n\n回复「批准」或「拒绝」（5 分钟内有效）`;
      for (const p of peers) {
        try { await deps.push(p.channel, p.peerId, prompt); } catch {}
      }
      // 等待用户回复（任一 peer 回复即可）
      const id = req.callId || req.agent.id + ":" + Date.now();
      return await new Promise((resolve) => {
        const timer = setTimeout(() => {
          pending.delete(id);
          resolve("rejected"); // 超时 fail-closed
        }, APPROVAL_TIMEOUT_MS);
        pending.set(id, {
          resolve: (outcome) => {
            clearTimeout(timer);
            pending.delete(id);
            resolve(outcome);
          },
        });
      });
```

</details>

**依据 2 · 源码核查**：[lib/remote.js:176-209](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/lib/remote.js#L176-L209)

/sessions 列全局最近项，/bind 无授权校验。

<details>
<summary>查看原文（34行）</summary>

```text
  /** 处理 /sessions /bind /status 命令；命中返回 true（不再转发给 agent）。 */
  async function handleCommand(channel, peerId, text, sessionsSvc) {
    const t = String(text || "").trim();
    const reply = (msg) => deps.push(channel, peerId, msg);
    if (t === "/sessions" || t === "/会话") {
      try {
        const list = (typeof sessionsSvc?.list === "function" ? sessionsSvc.list() : []) || [];
        const recent = list.slice(-5).reverse();
        if (recent.length === 0) {
          await reply("当前没有会话。请在 Web 端开始一个任务后重试。");
          return true;
        }
        const lines = recent.map((s) => {
          const id = s.id || "?";
          const title = s.title || s.displayTitle || "(无标题)";
          return `${title} · ${id}`;
        });
        await reply(`最近 ${recent.length} 个会话（用 /bind 后面接会话 ID 绑定）：\n` + lines.join("\n"));
        return true;
      } catch (e) {
        await reply("/sessions 失败：" + String(e).slice(0, 100));
        return true;
      }
    }
    if (t.startsWith("/bind")) {
      const sid = t.replace("/bind", "").trim();
      if (!sid) {
        const cur = findBoundSession(bindings, channel, peerId);
        await reply(cur ? `当前绑定：${cur}` : "未绑定会话。用法：/bind <会话ID>（用 /sessions 查看列表）");
        return true;
      }
      setBinding(bindings, channel, peerId, sid);
      await reply(`已绑定会话：${sid}\n该会话的任务状态与审批请求将推送到这里。`);
      return true;
```

</details>

**依据 3 · 源码核查**：[lib/remote.js:276-287](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/lib/remote.js#L276-L287)

全局 first pending 应答不核 peer/session。

<details>
<summary>查看原文（12行）</summary>

```text
    // 审批应答：仅在存在 pending 且文本匹配时消费
    if (pending.size > 0) {
      const outcome = answerApproval(t);
      if (outcome) {
        const first = pending.values().next().value;
        if (first) {
          first.resolve(outcome);
          await reply(outcome === "allowed-once" ? "✅ 已批准" : "🚫 已拒绝");
          return true;
        }
      }
    }
```

</details>

**依据 4 · 源码核查**：[index.js:225-292](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/index.js#L225-L292)

三渠道都先交 handleCommand。

<details>
<summary>查看原文（68行）</summary>

```text
  // ── 微信 ──
  async function handleWeixinMessage(text, peerId, contextToken) {
    // 远程监控命令（/sessions /bind /status /审批应答）优先拦截
    const sessionsSvc = ctx.get("sessions");
    if (await remote.handleCommand("weixin", peerId, text, sessionsSvc)) return;
    // 找到 peerId 对应的账户（token/contextToken 匹配）；简化：用第一个已配置账户
    const account = resolveFirstConfiguredAccount();
    if (!account) {
      log.warn("没有已配置的微信账户，忽略消息");
      return;
    }
    await bridge.inbound({
      channel: "weixin",
      peerId,
      text,
      reply: async (replyText) => {
        await sendWeixinText(account, peerId, replyText, contextToken);
      },
    });
  }

  function resolveFirstConfiguredAccount() {
    const ids = listWeixinAccountIds();
    for (const id of ids) {
      const acc = resolveWeixinAccount(id);
      if (acc.configured) return acc;
    }
    return null;
  }

  const stopWeixin = startWeixinMonitors({ onMessage: handleWeixinMessage });
  log.info("dsh-msg-hub: weixin monitors started");

  // ── QQ ──
  const qqRuntime = { bots: new Map(), stop: () => {} };
  startQqBots({
    onMessage: async (text, peerKey, replyTarget, msg, bot) => {
      const sessionsSvc = ctx.get("sessions");
      if (await remote.handleCommand("qq", peerKey, text, sessionsSvc)) return;
      await bridge.inbound({
        channel: "qq",
        peerId: peerKey,
        text,
        reply: async (replyText) => {
          await sendQqText(bot, replyTarget, replyText);
        },
      });
    },
  })
    .then((runtime) => {
      qqRuntime.bots = runtime.bots;
      qqBotsMap = runtime.bots;
      qqRuntime.stop = runtime.stop;
      log.info(`dsh-msg-hub: qq bots started (${runtime.bots.size})`);
    })
    .catch((err) => {
      diagLog(`[qq] 启动失败: ${String(err)}`);
    });

  // ── 飞书 ──
  const feishuRuntime = { clients: new Map(), stop: () => {} };
  startFeishuBots({
    onMessage: async (text, peerKey, event, client) => {
      const openId = event?.sender?.sender_id?.open_id ?? "";
      if (!openId) return;
      const sessionsSvc = ctx.get("sessions");
      if (await remote.handleCommand("feishu", peerKey, text, sessionsSvc)) return;
      await bridge.inbound({
```

</details>

#### 缺口

- 未核真实平台消息身份及宿主 approval 语义
  **影响**：可触发范围和最终权限影响需部署环境判定
  **进一步探讨**：用两个隔离 peer/会话并发审批，核来源及结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 部署、媒体处理与失败恢复成本如何决定采用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

首次需 DSH web profile、Node≥22.13、三平台各自授权凭据及登录/审核；微信模拟协议还有风控边界，QQ 主动推送另需主动消息权限。持续成本含外部平台连接、媒体下载/ASR、state 凭据/日志/媒体和人工监控，金额与量未知；失败恢复要重登、轮换凭据、查媒体/日志并处理误审批。当前 Q02 的授权绑定缺口影响采用，建议修复前不启用远程批准。创新假设：相对全局 first pending，应把每个审批与允许回复的 channel+peerId+sessionId+callId 绑定，并让 /bind 走会话拥有者授权。代价是跨平台身份映射、并发状态和安全回归。最小证伪：两个 peer 绑定不同会话并同时产生审批，让非收件人/未绑定 peer 回复“批准”；若任一越权回复仍能 resolve 或 /bind 无授权生效，假设失败。

runTurn先等Agent idle、followup后再次whenIdle并flush，未见本层总deadline或调用方AbortSignal；远程审批5分钟timer仅在逐peer通知完成后建立，不能限制整个Agent回合、平台发送或入站锁等待。inbound回传outcome.text失败只记日志，随后仍返回ok:true，因此桥处理成功不证明平台受理/送达。未知外部结果不能直接整包重发，否则可能重复执行Agent工具副作用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-97](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/README.md#L31-L97)

运行要求、各渠道登录/凭据/主动消息权限。

<details>
<summary>查看原文（67行）</summary>

````text
## 环境要求

- **dsh** 运行时（cordis 插件，需在 dsh web profile 注册）
- **Node.js ≥ 22.13**
- 各渠道凭证：微信扫码 / QQ 开放平台 AppID+Secret / 飞书 AppID+Secret

## 安装

```bash
# 方式一：npm 包（推荐）
dsh plugin --profile web add dsh-msg-hub

# 方式二：GitHub 仓库
dsh plugin --profile web add github:AbcdefgXW/dsh-msg-hub

# 方式三：手动（本地开发/内网）
git clone https://github.com/AbcdefgXW/dsh-msg-hub.git
cd dsh-msg-hub && npm install
# 软链进 profile 并加入 bundles：
cd $DSH_HOME/profiles/web && pnpm link /路径/dsh-msg-hub
# 然后确认 package.json 的 dsh.profile.bundles 包含 dsh-msg-hub
```

> `dsh plugin add` 会自动将本插件加入 profile 的 `dsh.profile.bundles` 并挂载插件自带的注册行（`cordis.patch.yml`），**无需也不应手动修改任何配置文件**。
>
> ⚠️ 排查注册问题时请检查 `package.json` 的 `dsh.profile.bundles` 是否包含 `dsh-msg-hub`；**切勿**再在 profile 的 `cordis.patch.yml` 里手动 `insert` 本插件——bundles 已挂载时手动 insert 会导致 `duplicate loader entry id` 启动崩溃。

重启 `dsh web`。

### 渠道连接指南

**微信（ilinkai 扫码登录）**

```bash
node scripts/weixin-login.mjs login
```

1. 终端显示二维码 → 用微信「扫一扫」扫码确认
2. 登录成功自动保存 token 到 `state/weixin/`，**重启 dsh** 生效
3. 建议使用专用微信号（模拟协议登录，存在风控风险，见「安全提示」）

**QQ（开放平台官方机器人，两种方式）**

先到 [QQ 开放平台](https://q.qq.com) 注册机器人应用，拿到 AppID 与 AppSecret：

```bash
# 方式 A：凭证直填（推荐，机器人已创建时）
node scripts/qq-login.mjs --appid <AppID> --secret <AppSecret>

# 方式 B：扫码绑定（要求该 QQ 账号下已存在机器人应用）
node scripts/qq-login.mjs
```

配置后**重启 dsh** 生效。⚠️ 定时主动推送还需在开放平台**申请「主动消息权限」**，否则推送会静默失败（被动回复不受影响）。

**飞书（开放平台企业自建应用）**

1. 到[飞书开放平台](https://open.feishu.cn)创建「企业自建应用」→ 开启「机器人」能力 → 发布应用
2. 在应用「凭证与基础信息」页复制 AppID 与 AppSecret（需应用管理员权限）

```bash
node scripts/feishu-login.mjs --appid <AppID> --secret <AppSecret>
```

配置后**重启 dsh** 生效。

> 凭证全部保存在插件 `state/` 目录（已 gitignore，不会提交）；三个渠道可同时启用。
````

</details>

**依据 2 · 源码核查**：[lib/remote.js:99-150](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/lib/remote.js#L99-L150)

绑定和 pending 审批生命周期。

<details>
<summary>查看原文（52行）</summary>

```text
export function createRemoteMonitor(ctx, deps) {
  const bindings = loadBindings();
  const pending = new Map(); // approvalId -> { resolve, timer, sessionId }

  /** 向绑定该会话的所有 peer 推送文本。 */
  async function notifySession(sessionId, text) {
    for (const p of findPeersForSession(bindings, sessionId)) {
      try {
        await deps.push(p.channel, p.peerId, text);
      } catch (e) {
        ctx.logger?.warn?.(`dsh-msg-hub: 远程通知失败 ${p.channel}/${p.peerId}: ${String(e)}`);
      }
    }
  }

  /** 应答等待中的审批（用户渠道回复「批准/拒绝」）。 */
  function answerApproval(text) {
    const t = String(text || "").trim();
    if (t === "批准" || t === "同意" || t === "允许" || t === "approve" || t === "yes") return "allowed-once";
    if (t === "拒绝" || t === "不同意" || t === "拒绝执行" || t === "reject" || t === "no") return "rejected";
    return null;
  }

  // ── 审批远程批准：拦截 approval/request waterfall ──
  const stopApproval = ctx.on("approval/request", async (req, next) => {
    try {
      const sessionId = req?.agent?.id;
      if (!sessionId) return next();
      const peers = findPeersForSession(bindings, sessionId);
      if (peers.length === 0) return next(); // 无绑定：走默认流程
      const callDetail = extractCallDetail(req.agent.session, req.callId);
      const reason = req.reason ? `\n原因：${req.reason}` : "";
      const cmd = callDetail ? `\n命令：${callDetail}` : "";
      const prompt = `🔐 需要批准\n工具：${req.toolName || "?"}${reason}${cmd}\n\n回复「批准」或「拒绝」（5 分钟内有效）`;
      for (const p of peers) {
        try { await deps.push(p.channel, p.peerId, prompt); } catch {}
      }
      // 等待用户回复（任一 peer 回复即可）
      const id = req.callId || req.agent.id + ":" + Date.now();
      return await new Promise((resolve) => {
        const timer = setTimeout(() => {
          pending.delete(id);
          resolve("rejected"); // 超时 fail-closed
        }, APPROVAL_TIMEOUT_MS);
        pending.set(id, {
          resolve: (outcome) => {
            clearTimeout(timer);
            pending.delete(id);
            resolve(outcome);
          },
        });
      });
```

</details>

**依据 3 · 源码核查**：[lib/remote.js:176-287](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/lib/remote.js#L176-L287)

命令及应答。

<details>
<summary>查看原文（112行）</summary>

```text
  /** 处理 /sessions /bind /status 命令；命中返回 true（不再转发给 agent）。 */
  async function handleCommand(channel, peerId, text, sessionsSvc) {
    const t = String(text || "").trim();
    const reply = (msg) => deps.push(channel, peerId, msg);
    if (t === "/sessions" || t === "/会话") {
      try {
        const list = (typeof sessionsSvc?.list === "function" ? sessionsSvc.list() : []) || [];
        const recent = list.slice(-5).reverse();
        if (recent.length === 0) {
          await reply("当前没有会话。请在 Web 端开始一个任务后重试。");
          return true;
        }
        const lines = recent.map((s) => {
          const id = s.id || "?";
          const title = s.title || s.displayTitle || "(无标题)";
          return `${title} · ${id}`;
        });
        await reply(`最近 ${recent.length} 个会话（用 /bind 后面接会话 ID 绑定）：\n` + lines.join("\n"));
        return true;
      } catch (e) {
        await reply("/sessions 失败：" + String(e).slice(0, 100));
        return true;
      }
    }
    if (t.startsWith("/bind")) {
      const sid = t.replace("/bind", "").trim();
      if (!sid) {
        const cur = findBoundSession(bindings, channel, peerId);
        await reply(cur ? `当前绑定：${cur}` : "未绑定会话。用法：/bind <会话ID>（用 /sessions 查看列表）");
        return true;
      }
      setBinding(bindings, channel, peerId, sid);
      await reply(`已绑定会话：${sid}\n该会话的任务状态与审批请求将推送到这里。`);
      return true;
    }
    if (t === "/status" || t === "/状态") {
      const cur = findBoundSession(bindings, channel, peerId);
      await reply(cur ? `📌 绑定会话：${cur}\n状态推送与远程批准已开启。` : "未绑定会话。用 /sessions 查看会话列表，/bind <会话ID> 绑定。");
      return true;
    }
    // ── 会话常驻治理：/new 开新会话、/release 释放本渠道会话、/cfg 查看/设置策略 ──
    if (t === "/new" || t === "/新会话") {
      try {
        const r = await deps.rotate(channel, peerId);
        if (r && r.ok === false) { await reply("/new 失败：" + (r.error || "未知错误")); return true; }
        const note = r.released && r.released.length > 0 ? "（旧会话已释放）" : "";
        await reply(`已开新会话 ✅ 会话 ID 保持不变（永远干净），新会话自动继承上一段会话的最近对话摘要，记忆无缝接续。\n旧会话已归档为时间戳备份：${r.archived || "（旧会话暂无落盘文件）"}${note}\n会话 ID：${r.sessionId}`);
      } catch (e) {
        await reply("/new 失败：" + String(e).slice(0, 100));
      }
      return true;
    }
    if (t === "/release" || t === "/释放") {
      try {
        const r = await deps.releaseTarget(channel, peerId);
        await reply(r.released.length > 0
          ? `已释放本渠道常驻会话 ✓（会话已落盘，下次消息自动恢复）`
          : "本渠道会话当前不在常驻列表中（已按策略自动释放）");
      } catch (e) {
        await reply("/release 失败：" + String(e).slice(0, 100));
      }
      return true;
    }
    if (t === "/cfg" || t.startsWith("/cfg ")) {
      try {
        const parts = t.replace("/cfg", "").trim().split(/\s+/);
        if (parts.length >= 1 && parts[0].toLowerCase() === "keepalive") {
          const onOff = parts[1]?.toLowerCase();
          if (onOff === "on" || onOff === "off") {
            const count = parts.length >= 3 ? Number(parts[2]) : undefined;
            const cfg = deps.setCfg({ keepAliveSessions: { enabled: onOff === "on", count } });
            await reply(`已设置：会话常驻= ${cfg.keepAliveSessions.enabled ? "开" : "关"}，保留个数= ${cfg.keepAliveSessions.count}（1~5）`);
          } else {
            await reply("用法 /cfg keepalive on|off [1-5]（如 /cfg keepalive on 3）");
          }
        } else if (parts.length >= 1 && parts[0].toLowerCase() === "inherit") {
          const n = parts[1] === undefined ? undefined : Number(parts[1]);
          if (n === undefined || Number.isFinite(n)) {
            const cfg = deps.setCfg({ inheritRecentCount: n });
            await reply(`已设置：记忆继承条数 = ${cfg.inheritRecentCount}（1~30，默认 10）`);
          } else {
            await reply("用法 /cfg inherit <1-30>（如 /cfg inherit 10）");
          }
        } else if (parts.length >= 1 && parts[0].toLowerCase() === "sweep") {
          const n = parts[1] === undefined ? undefined : Number(parts[1]);
          if (n === undefined || Number.isFinite(n)) {
            const cfg = deps.setCfg({ sweepIntervalMinutes: n });
            await reply(`已设置：自动释放间隔 = ${cfg.sweepIntervalMinutes} 分钟（0=不自动，1~60；每到间隔自动保留最近 ${cfg.keepAliveSessions.count} 个常驻会话、释放其余）`);
          } else {
            await reply("用法 /cfg sweep <0-60>（0=不自动，如 /cfg sweep 5）");
          }
        } else {
          const cfg = deps.getCfg();
          await reply(`📊 渠道会话策略：\n· 常驻：${cfg.keepAliveSessions.enabled ? "开" : "关"}，保留最近 ${cfg.keepAliveSessions.count} 个活跃会话\n· 自动释放间隔：${cfg.sweepIntervalMinutes === 0 ? "不自动（手动释放）" : cfg.sweepIntervalMinutes + " 分钟"}\n· /new 记忆继承条数：${cfg.inheritRecentCount} 条 ${cfg.inheritRecentCount >= 20 ? "⚠️" : ""}（建议最大 30，数值越大注入上下文越长，内存占用越高）\n\n设置：/cfg keepalive on|off [1-5]；/cfg sweep <0-60>；/cfg inherit <1-30>`);
        }
      } catch (e) {
        await reply("/cfg 失败：" + String(e).slice(0, 100));
      }
      return true;
    }
    // 审批应答：仅在存在 pending 且文本匹配时消费
    if (pending.size > 0) {
      const outcome = answerApproval(t);
      if (outcome) {
        const first = pending.values().next().value;
        if (first) {
          first.resolve(outcome);
          await reply(outcome === "allowed-once" ? "✅ 已批准" : "🚫 已拒绝");
          return true;
        }
      }
    }
```

</details>

#### 缺口

- 无平台额度/消息量、ASR 费用和恢复工时数据
  **影响**：单位任务总成本与误审批影响无法量化
  **进一步探讨**：在测试账户量测消息/媒体/ASR 与双 peer 审批

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
