# DSH WeChat

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d3682b4](https://github.com/pan17/dsh-wechat/tree/d3682b47b5fe003ea2988a5cf25bff9391c55a5c)

<!-- BEGIN META -->
[![GitHub ★ 50](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=50&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/pan17/dsh-wechat) [![npm 30d 12,761](https://img.shields.io/static/v1?label=npm+30d&message=12%2C761&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wechat) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wechat)
<!-- END META -->

> **功能**：微信iLink单用户第二客户端，将消息投递同一DSH Agent并镜像审批、问答及结果文件。

> **亮点**：[Q01](#research-q01)微信第二客户端；[Q02](#research-q02)会话/消息适配；[Q03](#research-q03)官方审批镜像；[Q04](#research-q04)限流FIFO/私有持久存储。

> **主要限制**：[Q02](#research-q02)首peer信任与游标先保存/内存去重不是事务交付；[Q03](#research-q03)远端数字可批准真动作，stop非回滚；[Q04](#research-q04)硬队列丢旧、API成功非到人、文件根含所有workspace。

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
  - [Q01 · 微信第二客户端面向谁，执行能力来自哪里？](#detail-section-11)
  - [Q02 · 消息怎样进入真实Agent，身份与游标保证到哪？](#detail-section-12)
  - [Q03 · 远端审批和stop会真正决定宿主吗？](#detail-section-13)
  - [Q04 · 媒体、发件窗口和持久队列有哪些交付边界？](#detail-section-14)
  - [Q05 · 什么方向比再加slash命令更可验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：dsh-wechat0.16.1是原生DSH双端渠道插件，用iLink bot连接个人微信与同一DSH Agent，面向离桌聊天、收取结果及答复审批/问答的人。支持slash管理工作区/会话/模型/权限、媒体指针和send_wechat推送；不是独立微信客服多租户系统，也不包含新Agent推理执行引擎。成功是正确会话收到意图、动作经过本人授权且结果真实到人，不是扫码成功/服务端send成功。

DSH Web/手机浏览器加人工转抄附件，Agent能力来自宿主、消息窗口来自iLink。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 入站 | 微信意图进Host | 单peer/非事务游标 |
| 决策 | 远端审批/问答 | 本人目标核验/软超时 |
| 回推 | 结论/文件 | 网关接受非已读 |
| 队列 | 窗口关闭后补发 | 硬400丢旧/文件可变 |
| stop | 请求Agent取消 | 不回滚远端副作用 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失/边界 |
|---|---|---|---|
| DSH >=0.2.1-0 <0.3.0-0/Node>=20 | 必需 | Agent/审批/会话 | 非独立引擎 |
| 有权微信iLink bot/网络 | 必需 | 收发/媒体 | 平台窗口/账号条件外部 |
| 白名单/本人peer和低权Host | 采用前提 | 防错人操控 | 空名单首次信任非多人隔离 |
| 私有存储/人工核验 | 必需 | token/映射/队列 | API接受非到人 |

#### 启动步骤

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 准备 | 隔离Host、明确allowedUsers/权限 | 不先暴露生产凭据 |
| 配对 | 有权本人扫码并核peer/会话 | 首入站不是独立认证 |
| 小样 | 文本/小文件→查Web实际消息 | 路径不等模型已读取 |
| 决策 | 核会话/工具再批准 | 超时/旧卡回Web |
| 退出 | 查Host动作、停通道清凭据/残留 | stop仅请求取消，卸载可flush输入 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 账号/网络/Host金额未知 | 配对白名单/版本 | 非官方/服务条件须核 |
| 持续 | token/CDN/磁盘未知 | 核会话/审批/文件 | 合并潜在节省未测 |
| 故障 | 队列/重复/漏投未知 | 到人确认/补发/查Host | 硬上限会丢旧 |
| 退出 | token/媒体/队列留存未知 | 清归属/检查取消和已发 | 不回滚已接受操作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 第二客户端 | 真Agent.followup/steer | 消息崩溃交付/任务质量 |
| 审批 | Host waterfall outcome | 旧卡/双端/重启 |
| 回推 | API/预算/FIFO | 到人/硬上限不丢 |
| 媒体 | 私有落盘/路径与根守卫 | 资源上限/可变附件 |

> **思考**：[Q02](#research-q02)首peer信任与游标先保存/内存去重不是事务交付；[Q03](#research-q03)远端数字可批准真动作，stop非回滚；[Q04](#research-q04)硬队列丢旧、API成功非到人、文件根含所有workspace。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)微信第二客户端；[Q02](#research-q02)会话/消息适配；[Q03](#research-q03)官方审批镜像；[Q04](#research-q04)限流FIFO/私有持久存储。

[Q02](#research-q02)内存去重与游标持久分离，[Q03](#research-q03)双端race/stop请求，[Q04](#research-q04)发前预算/硬队列和文件根边界值得借鉴；不可混称恰好一次/已读/回滚。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)首peer信任与游标先保存/内存去重不是事务交付；[Q03](#research-q03)远端数字可批准真动作，stop非回滚；[Q04](#research-q04)硬队列丢旧、API成功非到人、文件根含所有workspace。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)观察；个人隔离Host非敏感小样先核白名单/权限、Host接收与到人，关键决策回Web核验。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态支持代表真实Host投递/审批/发送和失败边界；未登录发送或全审桥，观察。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/adapter/inbound.ts、src/bridge/bridge.ts、src/dsh/sessions.ts、src/index.ts、src/state.ts、src/weixin/auth.ts、src/weixin/media.ts、src/weixin/monitor.ts、src/weixin/send.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核package/README、原生start/stop与审批waterfall、monitor轮询游标、bridge代表peer/去重/Host投递/输出/审批/stop/文件/队列、实际AgentSessions与CDN读写/私有state/token；未全审8279行bridge、全部slash/配置路由/媒体分支/测试。
- 下一步：只读固定源，不扫码/登录/发微信/运行Host或插件测试；iLink限制为作者观察，无独立送达/恢复/成本验证。

**分析版本**

- **仓库**：[pan17/dsh-wechat](https://github.com/pan17/dsh-wechat)
- **版本号**：0.16.1（[固定提交 d3682b4](https://github.com/pan17/dsh-wechat/tree/d3682b47b5fe003ea2988a5cf25bff9391c55a5c)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)消息到Host/到人分段回执与不可变附件/审批目标核验，故障对照验错卡/补发负担，未实现。

只读固定源，不扫码/登录/发微信/运行Host或插件测试；iLink限制为作者观察，无独立送达/恢复/成本验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1623 | — | — | 52250 |
| .mjs | source | 3 | 276 | 166 | 76 | — |
| .ts | source | 32 | 19711 | 12666 | 5877 | — |
| .js | source | 1 | 1244 | 1029 | 169 | — |
| .cjs | source | 1 | 738 | 513 | 180 | — |
| .ts | test | 65 | 23684 | 19015 | 2531 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/pan17/dsh-wechat/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核微信身份/Host真实执行/审批、游标与队列持久化及到人边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 微信第二客户端面向谁，执行能力来自哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-wechat0.16.1是原生DSH双端渠道插件，用iLink bot连接个人微信与同一DSH Agent，面向离桌聊天、收取结果及答复审批/问答的人。支持slash管理工作区/会话/模型/权限、媒体指针和send_wechat推送；不是独立微信客服多租户系统，也不包含新Agent推理执行引擎。成功是正确会话收到意图、动作经过本人授权且结果真实到人，不是扫码成功/服务端send成功。

基线是DSH Web/移动浏览器与人工转抄附件。插件贡献是iLink轮询、宿主followup/steer与官方审批waterfall镜像、会话映射/消息合并/回推限流。Agent工具执行来自宿主，文字/媒体通道和窗口限制来自iLink；项目非DSH/腾讯官方附属。README声称10条连续窗口/24小时窗口和语音气泡不可见，是作者通道观察，未独立验证当前规则。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-7](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/README.md#L7-L7)

作者微信第二客户端定位。

```text
把微信变成 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) 的第二客户端：在微信里和你的 agent 聊天，文字、图片、文件和语音双向传输，用 slash 命令管理会话、工作区、模型、权限等等。
```

**依据 2 · 作者声明**：[README.md:53-63](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/README.md#L53-L63)

作者通道限制而非运行保证。

<details>
<summary>查看原文（11行）</summary>

```text
| `/rq` | 关闭当前会话的待处理卡 |

其它 `/xxx` 作为文本转发给 agent。DSH 原生 slash 命令（`/plan`、`/goal`、`/compact` 等）由 bridge 直接交给原生 handler，微信端无需改动即可识别。

## 已知限制

下面三条都是微信 iLink 通道本身的限制，插件改不了；设置页底部的「已知限制」里也是这三条。

1. **一个窗口最多连发 10 条**：bot 连续向同一个人发 10 条后，要等你在微信里先发一条才会解锁。超出的部分不会丢，会进 `/next` 缓存队列，发 `/next`（或随便发条消息）就能接着推。
2. **24 小时互动窗口**：你最后一次在微信发消息后的 24 小时内，bot 才能主动给你发消息；超过 24 小时没互动，得先在微信里发一条，回复才会继续送到。
3. **发不出原生语音气泡**：bot 发的语音条会被微信客户端整条丢弃——服务端返回成功、审计也记成已发送，手机端却什么都没有（连占位都没有），所以目前音频都当作普通文件发送。另外入站语音不受影响，会被微信自动转成文字，DSH 无需配置语音转文本。
```

</details>

**依据 3 · 源码核查**：[package.json:1-24](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/package.json#L1-L24)

原生双端入口/版本。

<details>
<summary>查看原文（24行）</summary>

```text
{
  "name": "dsh-wechat",
  "version": "0.16.1",
  "description": "Bridge WeChat (iLink bot) to DeepSeek Harness (DSH)",
  "type": "module",
  "files": [
    "dist/",
    "resources/",
    "docs/",
    "cordis.patch.yml",
    "README.md",
    "LICENSE",
    "package.json"
  ],
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./client": "./dist/client.js",
    "./package.json": "./package.json"
  },
```

</details>

**依据 4 · 源码核查**：[package.json:41-47](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/package.json#L41-L47)

Node/DSH版本条件。

```text
  "engines": {
    "node": ">=20.0.0",
    "dsh": ">=0.2.1-0 <0.3.0-0"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.1-0 <0.3.0-0"
  },
```

**依据 5 · 源码核查**：[package.json:65-65](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/package.json#L65-L65)

MIT许可。

```text
  "license": "MIT",
```

#### 缺口

- 真实个人任务需求、微信当前账号条件/规则与净收益未核。
  **影响**：不能当通用企业客服渠道或稳定送达SLA。
  **进一步探讨**：用有权账号的隔离Host对照Web，测正确会话/答复/到人和全部成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 消息怎样进入真实Agent，身份与游标保证到哪？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

原生入口start bridge，并将stop挂自身effect；monitor长轮询getUpdates，检查abort所有权，保存get_updates_buf后逐条调用onMessage；入口onMessage异步handleMessage不作为批次持久确认。这能恢复轮询位置，但游标先保存/处理后异步之间崩溃可能留下交付空隙，不是事务outbox或恰好一次。

handleMessage拒绝非USER/群聊/无userId；非空allowedUsers先过滤，peer存在再拒其它user。白名单空时首入站者成为peer，是单用户信任绑定而非多人隔离；升级可seed旧peer白名单，初装应先明确allowedUsers。seenInbound在await前内存预留、TTL/上限清理，失败释放槽；重启无此去重账本。

forwardToAgent实际ensure/恢复会话、持久绑定、媒体转换后forwardBlocks；损坏会话可新建并告知，不能静默假装旧上下文恢复。busy选queue/steer，AgentSessions创建user消息后真实调用agent.followup或steer；后续宿主assistant/message事件取文本经pushOutput→sendReply。微信身份相当于可操作绑定宿主/切会话的人，仍依赖宿主权限而非独立微信租户权限。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:510-530](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/index.ts#L510-L530)

真实start及effect stop绑定。

<details>
<summary>查看原文（21行）</summary>

```text
  // Start the bridge (token resume or QR login), stop on dispose.
  void bridge.start().catch((err) => {
    console.error(`[dsh-wechat] bridge start failed: ${String(err)}`);
  });

  const stopBridge = (): Promise<void> => bridge.stop();
  // Park the teardown on the plugin's OWN fiber (`ctx.effect`) and only fall
  // back to the returned function. This host's cordis does not turn a
  // functional plugin's return value into a disposer, so returning it alone
  // left `bridge.stop()` uncalled: the iLink long poll, its timers and its
  // socket survived dispose, the host process could never drain its event
  // loop, and the desktop shell killed it after the 10 s graceful deadline
  // (which is what refused every in-app update).
  //
  // Both paths are registered on purpose: `stop()` is idempotent, so a host
  // that honours the return value as well cannot tear down twice.
  if (typeof context.effect === "function") {
    context.effect(() => stopBridge);
  }
  return stopBridge;
}
```

</details>

**依据 2 · 源码核查**：[src/weixin/monitor.ts:203-218](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/weixin/monitor.ts#L203-L218)

真实轮询与abort所有权检查。

<details>
<summary>查看原文（16行）</summary>

```text

  while (!abortSignal?.aborted) {
    try {
      const resp: GetUpdatesResp = await getUpdates({
        baseUrl,
        token,
        get_updates_buf: getUpdatesBuf,
        timeoutMs: nextTimeoutMs,
        abortSignal,
      });
      // An old poll may resolve while stop/reload is cancelling it. Do not
      // advance the cursor or dispatch its messages after ownership ended.
      if (abortSignal?.aborted) return;

      if (resp.longpolling_timeout_ms != null && resp.longpolling_timeout_ms > 0) {
        nextTimeoutMs = resp.longpolling_timeout_ms;
```

</details>

**依据 3 · 源码核查**：[src/weixin/monitor.ts:251-263](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/weixin/monitor.ts#L251-L263)

保存游标先于逐条dispatch。

<details>
<summary>查看原文（13行）</summary>

```text
      consecutiveFailures = 0;
      resetRecoveryState();
      onSessionRecovered?.();

      if (resp.get_updates_buf != null && resp.get_updates_buf !== "") {
        saveSyncBuf(storageDir, resp.get_updates_buf);
        getUpdatesBuf = resp.get_updates_buf;
      }

      for (const msg of resp.msgs ?? []) {
        if (abortSignal?.aborted) return;
        onMessage(msg);
      }
```

</details>

**依据 4 · 源码核查**：[src/bridge/bridge.ts:1803-1813](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L1803-L1813)

实际onMessage异步handle，不await批次提交。

<details>
<summary>查看原文（11行）</summary>

```text
      storageDir: this.config.storageDir,
      abortSignal: abort.signal,
      log: (msg) => console.log(`[dsh-wechat] ${msg}`),
      onMessage: (msg) => {
        if (abort.signal.aborted || this.monitorAbort !== abort || this.interactionStopped) return;
        this.handleMessage(msg).catch((err) => {
          console.error(`[dsh-wechat] handleMessage error: ${String(err)}`);
        });
      },
      onSessionInvalid: () => this.markTokenInvalid(),
      onSessionRecovered: () => this.markTokenRecovered(),
```

</details>

**依据 5 · 源码核查**：[src/bridge/bridge.ts:1956-2021](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L1956-L2021)

白名单/单peer、内存去重和首peer绑定。

<details>
<summary>查看原文（66行）</summary>

```text
  private async handleMessage(msg: WeixinMessage): Promise<void> {
    if (this.interactionStopped || msg.message_type !== MessageType.USER || msg.group_id || !msg.from_user_id) return;
    // Inbound allowlist, BEFORE dedupe, budget reset, session creation and any
    // command handling: a rejected sender must not consume a dedupe slot, a
    // session, or an agent turn. An empty list is the historical behaviour
    // (first inbound user becomes the peer), so this is opt-in only.
    const allowed = this.config.allowedUsers;
    if (allowed.length > 0 && !allowed.some((id) => id === msg.from_user_id)) {
      // Logged, never answered: replying would confirm the bot is live to an
      // unknown sender and spend a gateway message doing it. Both the log line
      // and the audit record carry the MASKED id (S4).
      this.log(`ignore inbound from ${maskUserId(msg.from_user_id)}: not in allowedUsers`);
      this.audit.record({
        event: "inbound-rejected",
        user: maskUserId(msg.from_user_id),
        reason: "allowedUsers",
      });
      return;
    }
    if (this.peerUserId && this.peerUserId !== msg.from_user_id) return;
    const key = this.inboundKey(msg);
    const now = Date.now();
    for (const [seenKey, at] of this.seenInbound) {
      if (now - at < INBOUND_TTL_MS) break;
      this.seenInbound.delete(seenKey);
    }
    if (key) {
      if (this.seenInbound.has(key)) return;
      // Reserve synchronously, before the first await, so concurrent replays
      // cannot execute commands, reset the send budget, or create agents twice.
      this.seenInbound.set(key, now);
      if (this.seenInbound.size > INBOUND_MAX_SEEN) {
        this.seenInbound.delete(this.seenInbound.keys().next().value!);
      }
    }
    try {
      await this.processMessage(msg);
    } catch (err) {
      if (key && this.seenInbound.get(key) === now) this.seenInbound.delete(key);
      throw err;
    }
  }

  private async processMessage(msg: WeixinMessage): Promise<void> {
    if (msg.message_type !== MessageType.USER) return;
    if (msg.group_id) return;

    const userId = msg.from_user_id;
    if (!userId) return;

    if (this.peerUserId && this.peerUserId !== userId) {
      this.log(`ignore inbound from ${userId} (single-user peer is ${this.peerUserId})`);
      return;
    }
    if (!this.peerUserId) this.peerUserId = userId;
    if (typeof msg.context_token === "string" && msg.context_token) {
      this.wireContextToken = msg.context_token;
    }

    // Any incoming message from the one peer opens a fresh gateway window.
    this.wechatMsgCount = 0;
    this.cacheNoticeSent = false;

    const user = this.ensureBoundUser(userId);
    this.persistOutboundState(userId);
    // S3 one-time notice: the allowlist was seeded on upgrade, and the peer
```

</details>

**依据 6 · 源码核查**：[src/bridge/bridge.ts:2378-2409](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L2378-L2409)

ensure/恢复/新会话提示与媒体指针转换。

<details>
<summary>查看原文（32行）</summary>

```text
  private async forwardToAgent(user: UserState, msg: WeixinMessage): Promise<void> {
    const previousSessionId = user.sessionId;
    const { agent, replacedSessionId } = await this.agents.ensure(user, { replaceOnResumeFailure: true });
    if (this.interactionStopped) return;
    this.persistSessionBinding(user);
    if (!agent) {
      const hint = previousSessionId
        ? `（绑定会话 ${previousSessionId} 无法恢复）`
        : "";
      await this.sendReply(user.userId, `⚠️ 无法创建/恢复 DSH 会话${hint}，请检查 DSH 日志。`);
      return;
    }
    if (replacedSessionId) {
      await this.sendReply(
        user.userId,
        `⚠️ 原会话 ${replacedSessionId} 已损坏，无法恢复；已新建会话 ${user.sessionId}。`,
      );
    }

    const blocks = await this.promptBlocksFor(msg);
    if (this.interactionStopped) return;
    await this.forwardBlocksToAgent(user, blocks, agent);
  }

  /**
   * Convert ONE inbound WeChat message into prompt blocks (text + media).
   *
   * Split out of {@link forwardToAgent} so a merged batch can build its blocks
   * from SEVERAL messages and then hand them to the same delivery path — the
   * agent ensure, the `/at` mention, the source marker and the busy-enter
   * choice must exist exactly once.
   */
```

</details>

**依据 7 · 源码核查**：[src/bridge/bridge.ts:2480-2493](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L2480-L2493)

busy模式和真正调用agents.followup。

<details>
<summary>查看原文（14行）</summary>

```text
    this.markSessionSource(user.sessionId, "wechat");
    // Busy-time delivery follows the DSH `ui-conversation.busyEnter` setting
    // (the GUI's 「繁忙时 Enter 键行为」 row): while the agent is running,
    // `queue` keeps the historical follow-up-turn behavior and `steer`
    // splices the message into the running turn at its nearest step
    // boundary. Idle agents always take the ordinary queue path — the same
    // "idle Enter = Queue" rule the GUI composer applies. A steer whose
    // window already closed degrades to the next waking queue turn inside
    // AgentLoop, so neither mode can lose the message.
    const mode = agent.status === "running" ? this.ops.busyEnter() : "queue";
    this.agents.followup(agent, blocks, mode, (id) => this.markWechatMessage(id));
    if (staged) this.dropPendingRefs(user.userId);
  }

```

</details>

**依据 8 · 源码核查**：[src/dsh/sessions.ts:206-229](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/dsh/sessions.ts#L206-L229)

真实agent.steer/followup调用。

<details>
<summary>查看原文（24行）</summary>

```text
  followup(
    agent: Agent,
    content: ContentBlock[],
    mode: BusyEnterBehavior = "queue",
    onCreated?: (messageId: string) => void,
  ): string {
    const message = createUserMessage({
      content,
      // kind 'user' — identical to messages sent from the GUI chat box, so
      // the WeChat user's messages render as ordinary user messages (a
      // 'plugin' source renders as "context injection" in the GUI).
      source: { kind: "user" },
    });
    // Record the minted id BEFORE followup/steer. Those calls synchronously
    // emit `agent/inbox/spliced`; the surface-prompt marker must already
    // know this id or the splice handler treats the WeChat message as GUI.
    onCreated?.(message.id);
    if (mode === "steer") {
      agent.steer(message);
    } else {
      agent.followup(message);
    }
    return message.id;
  }
```

</details>

**依据 9 · 源码核查**：[src/bridge/bridge.ts:3095-3126](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L3095-L3126)

assistant/message真实输出文本处理。

<details>
<summary>查看原文（32行）</summary>

```text
      case "assistant/message": {
        const data = event.data as { turn?: number; step?: number; message?: { content?: OutputContentBlock[] } };
        const blocks = data?.message?.content ?? [];
        const activeStream = this.assistantStreams.get(sessionId);
        const stream = activeStream?.turn === data?.turn && activeStream?.step === data?.step ? activeStream : undefined;
        const streamKey = JSON.stringify([sessionId, event.seq]);
        const handledReasoning = this.streamedReasoning.get(streamKey) ?? stream?.handledReasoning;
        this.streamedReasoning.delete(streamKey);
        if (this.isConcise()) {
          const text = blocks.filter((b) => b.type === "text" && typeof b.text === "string")
            .map((b) => b.text).join("\n");
          if (text.trim()) this.conciseBuffers.set(sessionId, [text]);
          break;
        }
        // Keep adjacent prose blocks together, flushing the process group BEFORE prose.
        let prose: string[] = [];
        const sendProse = () => {
          if (!prose.length) return;
          this.flushProcess(sessionId, user.userId);
          const proseText = prose.join("\n");
          prose = [];
          // 极简模式 (per-task) outranks 简洁 (per-turn): hold the exact text
          // this turn would otherwise push and let the quiescence timer deliver
          // the conclusion once the whole task — every auto-continued round
          // included — has stopped. The typing indicator stays on through the
          // whole turn: agent.status is still "running" while text is produced,
          // and it is only cancelled on turn/end / agent/error / plugin stop.
          if (this.holdFinalText(user.userId, sessionId, proseText)) return;
          this.pushOutput(user.userId, proseText);
        };
        for (const [blockIndex, block] of blocks.entries()) {
          if (block.type === "text" && typeof block.text === "string" && block.text.trim()) {
```

</details>

**依据 10 · 源码核查**：[src/bridge/bridge.ts:3452-3455](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L3452-L3455)

pushOutput转sendReply。

```text
  private pushOutput(userId: string, text: string, plainText = false): void {
    void this.sendReply(userId, text, { plainText }).catch((err) => this.log(`output send failed: ${String(err)}`));
  }

```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 远端审批和stop会真正决定宿主吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

入口在approval/request prepend waterfall中调用bridge答复；bridge获取sessionId/recipient，创建WeChat卡，并与next() GUI结果Promise.race，先完成者返回Host outcome并移除卡/取消GUI分支。微信选择通过respondApproval同步settled标记再settleWechat，允许一次/拒绝确实决定同一请求，不只是发提示。软超时只移除微信卡并告知可在GUI继续，不是自动拒绝或批准。

微信卡可跨会话通知/编号，旧卡或会话切换必须核目标和工具内容；默认单peer不是按不同操作者分权，远程输入数字可能批准真实Host副作用。settled/卡Map是进程内仲裁，不是跨重启持久授权日志。/stop实际agent.cancel({kind:user})，回“已发送停止指令”，不是已杀远端子进程或恢复文件/网络效果。停止插件还会先flush合并入站再stopInteraction，因此卸载不能理解成丢弃所有尚未投递输入或回滚当前任务。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:225-234](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/index.ts#L225-L234)

真实Host审批waterfall接线。

<details>
<summary>查看原文（10行）</summary>

```text
  context.on("approval/request", async (req, next) => {
    const nextFn = next as () => Promise<"allowed-once" | "rejected" | "cancelled" | "unavailable">;
    try {
      return await bridge.answerApprovalRequest(req as never, nextFn);
    } catch (err) {
      console.error(`[dsh-wechat] approval/request answerer failed: ${String(err)}`);
      return nextFn();
    }
  }, { prepend: true });
  context.on("user-questions/request", async (req, next) => {
```

</details>

**依据 2 · 源码核查**：[src/bridge/bridge.ts:3545-3557](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L3545-L3557)

session/recipient和退出条件。

<details>
<summary>查看原文（13行）</summary>

```text
  async answerApprovalRequest(
    req: ApprovalRequestLike,
    next: () => Promise<ApprovalOutcome>,
  ): Promise<ApprovalOutcome> {
    if (this.interactionStopped) return next();
    if (req.signal?.aborted) return next();
    const sessionId = this.sessionIdOfRequest(req);
    const toolName = typeof req.toolName === "string" && req.toolName ? req.toolName : "?";
    if (!sessionId) return next();
    const userId = this.recipientForSession(sessionId);
    if (!userId) {
      this.log(`approval/request ignored (no WeChat peer for session ${sessionId})`);
      return next();
```

</details>

**依据 3 · 源码核查**：[src/bridge/bridge.ts:3566-3589](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L3566-L3589)

卡创建及软超时仅移除/通知。

<details>
<summary>查看原文（24行）</summary>

```text
      settleWechat = resolve;
    });
    const card: PendingApproval = {
      rpcId,
      sessionId,
      approvalId,
      userId,
      toolName,
      reason: typeof req.reason === "string" ? req.reason : undefined,
      askedAt: Date.now(),
      settled: false,
      settleWechat,
      timer: setTimeout(() => {
        if (card.settled) return;
        this.removeApprovalCard(userId, rpcId);
        void this.sendReply(
          userId,
          `⏰ 权限卡超时未回复（${toolName}），已移除；可在 DSH 界面继续处理。`,
        ).catch(() => {});
      }, this.config.cardTimeoutMs),
    };
    const list = this.pendingApprovals.get(userId) ?? [];
    list.push(card);
    this.pendingApprovals.set(userId, list);
```

</details>

**依据 4 · 源码核查**：[src/bridge/bridge.ts:3595-3622](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L3595-L3622)

GUI/微信race、清卡并返回Host outcome。

<details>
<summary>查看原文（28行）</summary>

```text
    const gui = Promise.resolve()
      .then(() => next())
      .then((outcome) => ({ source: "gui" as const, outcome }))
      .catch((err) => {
        this.log(`approval next() failed: ${String(err)}`);
        return { source: "gui" as const, outcome: "unavailable" as ApprovalOutcome };
      });
    const wechatWrapped = wechat.then((outcome) => ({ source: "wechat" as const, outcome }));

    const winner = await Promise.race([gui, wechatWrapped]);
    void gui.then(() => undefined, () => undefined);
    void wechatWrapped.then(() => undefined, () => undefined);
    this.removeApprovalCard(userId, rpcId);
    this.abortGuiCard(guiAbort);
    if (winner.source === "gui") {
      if (this.shouldNotifyCrossSession(userId)) {
        const label =
          winner.outcome === "allowed-once"
            ? "✅ 已允许"
            : winner.outcome === "rejected"
              ? "⛔ 已拒绝"
              : "🚫 已取消";
        void this.sendReply(userId, `🔒 权限请求结果：${label}（${toolName}）`).catch(() => {});
      }
    }
    return winner.outcome;
  }

```

</details>

**依据 5 · 源码核查**：[src/bridge/bridge.ts:4299-4322](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L4299-L4322)

settled守卫、审计与settleWechat实际执行。

<details>
<summary>查看原文（24行）</summary>

```text
  }

  private async respondApproval(
    entry: PendingApproval,
    outcome: "allowed-once" | "rejected",
  ): Promise<{ accepted: boolean; reason?: string }> {
    if (entry.settled) return { accepted: false, reason: "not-pending" };
    entry.settled = true;
    // S4 audit: one line per decision actually applied (a duplicate attempt
    // returns early above and is not a decision).
    this.audit.record({
      event: "decision",
      kind: "approval",
      user: maskUserId(entry.userId),
      session: maskUserId(entry.sessionId),
      tool: entry.toolName,
      decision: outcome,
    });
    if (entry.settleWechat) {
      entry.settleWechat(outcome);
      return { accepted: true };
    }
    // Test-seeded cards have no live waterfall waiter; treating the
    // WeChat reply as accepted keeps /rp and reply grammar working.
```

</details>

**依据 6 · 源码核查**：[src/bridge/bridge.ts:4870-4878](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L4870-L4878)

真实Agent cancel及仅发送指令回执。

```text
  private async handleStopCommand(userId: string, user: UserState): Promise<void> {
    const agent = this.agents.get(user);
    if (!agent) {
      await this.sendReply(userId, "⚠️ 当前没有活动的会话。");
      return;
    }
    agent.cancel({ kind: "user" });
    await this.sendReply(userId, "🛑 已发送停止指令。");
  }
```

**依据 7 · 源码核查**：[src/bridge/bridge.ts:1556-1578](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L1556-L1578)

卸载先flush合并入站再停互动。

<details>
<summary>查看原文（23行）</summary>

```text
    // keep asking the gateway every 1.5 s for up to 5 minutes after dispose,
    // with a ref'd timer and an open socket each round.
    this.stopLoginFlow();
    this.stopIlink("plugin-stop");
    // The CANCEL above is best-effort and fire-and-forget; give it a short
    // window to leave, then cut it. Nothing here may outlive dispose: the host
    // drains its event loop only once no socket or timer is left.
    await this.settleTypingSends();
    if (!this.disposeAbort.signal.aborted) this.disposeAbort.abort();
    probeTeardown(this.config.storageDir, "dispose:ilink-stopped", {
      monitorTask: this.monitorTask !== null,
      typingSends: this.typingSends.size,
    });
    // Deliver what 打字合并 is holding BEFORE `stopInteraction()`: the merged
    // batch is forwarded through `forwardToAgent`, which aborts as soon as the
    // interaction is marked stopped — flushing afterwards would silently
    // discard the user's own words. Same rule as the 极简模式 flush below: the
    // peer is not changing, so already-produced input is delivered.
    await this.flushAllMergedText("dispose");
    this.stopInteraction();
    this.processes.clear();
    this.assistantStreams.clear();
    this.streamedReasoning.clear();
```

</details>

#### 缺口

- 双端/重启/延迟审批、取消传播到具体工具未验证。
  **影响**：不能把发送停止/卡消失当副作用撤销或操作已安全终结。
  **进一步探讨**：隔离Host测GUI与微信同时答、旧卡、软超时、停止时合并输入与工具取消。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 媒体、发件窗口和持久队列有哪些交付边界？

**研究主题**：采用判断、效果与总成本

#### 完整回答

入站媒体从CDN全量arrayBuffer后解密，当前downloadAndDecrypt没有signal、超时或流式大小预算；保存文件名净化+随机名，私有目录文件策略，给模型的是路径/@引用而非内联内容，不等模型已读成功。用户媒体和宿主输出会经过微信/CDN，应明确第三方数据边界。

send_wechat发文件先stat/大小并canonicalPath判断根；允许根是调用session cwd加所有注册workspace，allowAnyFilePath可绕此限制，不能称严格每会话孤岛。队列保存filePath，之后读取的文件可能变化；实际发送点再stat大小不等不可变快照。

出站串行、发前持久预占窗口预算，文本API有client_id并可网络重试；send成功只证明API返回，不是用户已见。超限/无效token可park到FIFO并/next恢复，但队列有硬400上限丢最旧并日志；其它控制回执可配置不排队而失败丢弃，不能照README说一概不会丢。state用0600临时文件rename保存mapping/正文队列，token同私有写；POSIX模式非Windows权限保证。账号/网络/模型token、存储、人工核授权/补发成本未知，不能填0。

#### 证据与依据

**依据 1 · 源码核查**：[src/weixin/media.ts:42-56](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/weixin/media.ts#L42-L56)

真实全量fetch/解密无signal/流式预算。

<details>
<summary>查看原文（15行）</summary>

```text
  encryptQueryParam: string,
  aesKey: Buffer,
  cdnBaseUrl: string,
  filekey?: string,
): Promise<Buffer> {
  let url = `${cdnBaseUrl}/download?encrypted_query_param=${encodeURIComponent(encryptQueryParam)}`;
  if (filekey) {
    url += `&filekey=${encodeURIComponent(filekey)}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CDN download failed: HTTP ${res.status}`);
  const ciphertext = Buffer.from(await res.arrayBuffer());
  return decryptAesEcb(ciphertext, aesKey);
}

```

</details>

**依据 2 · 源码核查**：[src/adapter/inbound.ts:44-53](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/adapter/inbound.ts#L44-L53)

随机净化名/私有文件保存。

<details>
<summary>查看原文（10行）</summary>

```text
 * policy as the rest of the storage dir: directory 0o700, file 0o600 (Windows
 * ignores the mode and relies on the inherited ACLs — see secure-fs).
 */
function saveToTemp(buffer: Buffer, fileName: string, tempDir: string): string {
  ensurePrivateDir(tempDir);
  const safeName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}-${fileName.replace(/[^\w.-]/g, "_")}`;
  const filePath = path.join(tempDir, safeName);
  writePrivateFile(filePath, buffer);
  return filePath;
}
```

</details>

**依据 3 · 源码核查**：[src/adapter/inbound.ts:239-249](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/adapter/inbound.ts#L239-L249)

真实下载媒体后转文件。

<details>
<summary>查看原文（11行）</summary>

```text
  tempDir: string,
  refStyle: MediaRefStyle,
): Promise<PromptBlock | null> {
  if (item.type === MessageItemType.IMAGE && item.image_item?.media) {
    const media = item.image_item.media;
    const aesKey = parseAesKey(media);
    if (!aesKey || !media.encrypt_query_param) return null;

    log("Downloading image from CDN...");
    const buffer = await downloadAndDecrypt(media.encrypt_query_param, aesKey, cdnBaseUrl);
    const ext = detectImageExtension(buffer);
```

</details>

**依据 4 · 源码核查**：[src/bridge/bridge.ts:7573-7638](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L7573-L7638)

所有注册workspace根及canonical/大小/allowAnyFilePath守卫。

<details>
<summary>查看原文（66行）</summary>

```text
  /**
   * Roots an outgoing file may live under: the working directory of the
   * session that is ACTUALLY sending, plus every registered workspace.
   *
   * The sender is resolved from the calling agent id — never from the
   * recipient fallback. Those are different questions: an unbound (GUI)
   * session still sends to the first known WeChat user, and the file bound
   * must be the CALLER's, otherwise any session could read any other
   * session's workspace by relying on the recipient fallback.
   */
  private async outgoingFileRoots(senderAgentId: string): Promise<string[]> {
    const roots = new Set<string>();
    if (senderAgentId) {
      try {
        const live = this.ctx.get<{ get(id: string): Agent | undefined }>("agents")?.get(senderAgentId);
        const liveCwd = live?.session?.header?.cwd;
        if (typeof liveCwd === "string" && liveCwd) roots.add(liveCwd);
      } catch {
        // A host without the live header simply falls through to the roster.
      }
      const record = await this.ops.findSessionRecord(senderAgentId);
      if (record?.header.cwd) roots.add(record.header.cwd);
      const bound = this.userForAgent(senderAgentId);
      if (bound?.cwd) roots.add(bound.cwd);
    }
    for (const workspace of this.ops.listWorkspaces()) {
      if (workspace.path) roots.add(workspace.path);
    }
    return [...roots];
  }

  /**
   * Validate one `send_wechat` file: it must exist, be a regular file, fit in
   * {@link maxOutgoingFileBytes}, and — unless `allowAnyFilePath` is set —
   * resolve inside one of {@link outgoingFileRoots}.
   *
   * @returns `undefined` when the file may be sent, else the refusal message
   *   the tool returns verbatim.
   */
  private async guardOutgoingFile(senderAgentId: string, filePath: string): Promise<string | undefined> {
    let stat: fs.Stats;
    try {
      stat = await fs.promises.stat(filePath);
    } catch {
      return `file not found: ${filePath}`;
    }
    if (!stat.isFile()) return `not a regular file: ${filePath}`;
    const max = this.maxOutgoingFileBytes();
    if (stat.size > max) {
      return `file too large: ${filePath} is ${stat.size} bytes (limit ${max}; raise maxOutgoingFileBytes in the plugin settings)`;
    }
    if (this.config.allowAnyFilePath) return undefined;
    // Canonicalize BOTH sides: a symlink inside the workspace pointing at
    // /etc/shadow must not pass, and `..` must not escape.
    const target = await canonicalPath(filePath);
    const roots = await this.outgoingFileRoots(senderAgentId);
    for (const root of roots) {
      const canonicalRoot = await canonicalPath(root);
      if (isPathInside(canonicalRoot, target)) return undefined;
    }
    const where = roots.length > 0 ? roots.join(", ") : "(no session cwd and no registered workspace)";
    return (
      `refused: ${filePath} is outside the calling session's workspace. `
      + `Allowed roots: ${where}. Move the file there, or set allowAnyFilePath=true in the plugin settings to allow any path.`
    );
  }
```

</details>

**依据 5 · 源码核查**：[src/bridge/bridge.ts:7827-7887](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L7827-L7887)

实际读文件、FIFO/预算预占并发送。

<details>
<summary>查看原文（61行）</summary>

```text
    let buffer: Buffer | undefined;
    if (item.kind === "file") {
      // Size ceiling at the READ site too, not only at the tool entry: a
      // cached item outlives restarts (state.json) and a file can grow after
      // it was queued. `stat` before `readFile` so an oversized file is never
      // pulled into memory at all.
      const size = await this.outgoingFileSize(item.filePath);
      const max = this.maxOutgoingFileBytes();
      if (size !== undefined && size > max) {
        this.log(`drop outbound file (${size} bytes > ${max} limit): ${item.fileName}`);
        return "failed";
      }
      try {
        buffer = await fs.promises.readFile(item.filePath);
      } catch (err) {
        this.log(`outbound file read failed (${item.filePath}): ${String(err)}`);
        return "failed";
      }
    }

    if (generation !== this.outboundGeneration) return "failed";
    // Payloads behind a failed / rate-limited item must not overtake it.
    if (parkOnError && this.outboundCache.length > 0) {
      await this.parkOutbound(userId, item);
      return "cached";
    }
    const count = this.wechatMsgCount;
    if (count >= MSG_LIMIT_MAX) {
      if (!parkOnError) return "failed";
      await this.parkOutbound(userId, item);
      // No notice here: an 11th direct send would hit the same closed window.
      return "cached";
    }

    // Persist the conservative reservation before crossing the remote-send boundary.
    this.wechatMsgCount = count + 1;
    this.persistOutboundState(userId);
    const contextToken = this.wireContextToken ?? undefined;
    try {
      if (item.kind === "text") {
        const payload = count + 1 > MSG_LIMIT_WARN
          ? item.text + `\n\n⚠️ 微信限制连续发送消息数量10条（已发 ${count + 1} 条），发送 /next 可继续`
          : item.text;
        await sendTextMessage(userId, payload, {
          baseUrl: token.baseUrl,
          token: token.token,
          contextToken,
        });
      } else {
        await sendMediaMessage(userId, mediaTypeForFile(item.fileName), buffer!, {
          baseUrl: token.baseUrl,
          token: token.token,
          contextToken,
          cdnBaseUrl: this.config.cdnBaseUrl,
          fileName: item.fileName,
        });
      }
      return "sent";
    } catch (err) {
      this.log(`outbound send error (${item.kind}): ${String(err)}`);
      if (generation !== this.outboundGeneration) return "failed";
```

</details>

**依据 6 · 源码核查**：[src/bridge/bridge.ts:7898-7918](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L7898-L7918)

异常/未排队回执失败或park。

<details>
<summary>查看原文（21行）</summary>

```text
      if (isSessionTimeoutError(err)) {
        this.markTokenInvalid();
        this.logDropOutbound(item.kind === "text" ? item.text.slice(0, 60) : item.fileName);
        if (!parkOnError) return "failed";
        await this.parkOutbound(userId, item);
        return "cached";
      }
      // Logout/re-login may abort an in-flight send. Never carry that text
      // across identities; every other delivery error is parked.
      if (!this.token || this.tokenGiveUp) {
        this.logDropOutbound(item.kind === "text" ? item.text.slice(0, 60) : item.fileName);
        return "failed";
      }
      if (!parkOnError) {
        this.log(`drop outbound (control reply, not queued): ${item.kind === "text" ? item.text.slice(0, 60) : item.fileName}`);
        return "failed";
      }
      await this.parkOutbound(userId, item);
      await this.notifyCachePendingLocked(userId);
      return "cached";
    }
```

</details>

**依据 7 · 源码核查**：[src/bridge/bridge.ts:7970-7977](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L7970-L7977)

硬上限丢最旧/持久队列。

```text
    while (this.outboundCache.length >= MAX_OUTBOUND_QUEUE_HARD) {
      const evicted = this.outboundCache.shift();
      if (evicted === undefined) break;
      this.log(`outbound cache hard ceiling (${MAX_OUTBOUND_QUEUE_HARD}) reached; dropping oldest to bound memory: ${evicted.kind === "text" ? evicted.text.slice(0, 60) : evicted.fileName}`);
    }
    this.outboundCache.push({ ...item });
    this.persistOutboundState(userId);
  }
```

**依据 8 · 源码核查**：[src/state.ts:157-173](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/state.ts#L157-L173)

临时私有写/rename和失败抛出。

<details>
<summary>查看原文（17行）</summary>

```text
  private save(): void {
    ensurePrivateDir(path.dirname(this.filePath));
    const tempPath = `${this.filePath}.tmp-${process.pid}`;
    try {
      // 0o600 on both the temp file and the renamed target: the state file
      // carries the WeChat↔session mapping and the queued outbound bodies.
      writePrivateFile(tempPath, JSON.stringify(this.state, null, 2));
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      try {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      } catch {
        // best effort cleanup
      }
      throw err;
    }
  }
```

</details>

**依据 9 · 源码核查**：[src/weixin/auth.ts:69-77](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/weixin/auth.ts#L69-L77)

token私有文件写与Windows模式边界。

```text
export function saveToken(storageDir: string, data: TokenData): void {
  const authDir = getAuthDir(storageDir);
  ensurePrivateDir(authDir);
  const tokenPath = getTokenPath(storageDir);
  // 0o600 (dir 0o700): this file IS the bot credential — anyone who can read
  // it can send messages as the bot. On Windows Node ignores the mode and the
  // inherited `%USERPROFILE%` ACLs apply (see src/utils/secure-fs.ts).
  writePrivateFile(tokenPath, JSON.stringify(data, null, 2));
}
```

**依据 10 · 源码核查**：[src/weixin/send.ts:30-53](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/weixin/send.ts#L30-L53)

clientId/重试及真实sendMessage。

<details>
<summary>查看原文（24行）</summary>

```text
export async function sendTextMessage(
  to: string,
  text: string,
  opts: WeixinSendOpts,
): Promise<string> {
  const clientId = `wechat-acp-${crypto.randomUUID()}`;
  await sendMessage({
    baseUrl: opts.baseUrl,
    token: opts.token,
    retries: opts.retries ?? 2,
    body: {
      msg: {
        from_user_id: "",
        to_user_id: to,
        client_id: clientId,
        message_type: MessageType.BOT,
        message_state: MessageState.FINISH,
        ...(opts.contextToken ? { context_token: opts.contextToken } : {}),
        item_list: [{ type: 1, text_item: { text: sanitizeWeChatText(text) } }],
      },
    },
  });
  return clientId;
}
```

</details>

#### 缺口

- 到人送达、窗口规则、队列崩溃重复/丢失、媒体内存和文件变化尚未实测。
  **影响**：不能给关键审批/大附件/敏感文档稳定性保证。
  **进一步探讨**：先非敏感小样核到人、队列/预算/重启与文件变化，记录补发/核验成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么方向比再加slash命令更可验证？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

独立假设：为每条入站意图/出站结果维护可核的消息→会话→Host接受→待发→网关接受→用户确认回执，关键审批再显式展示会话/工具/不可逆后果，且队列存不可变附件摘要和归属，可能降低崩溃漏投、错卡批准与“已发送=已读”误判。这不是当前已实现事务消息账本，不计当前创新。

以Web直接操作为对照，在隔离Host模拟游标保存后崩溃、重复入站、双端审批、24小时关闭窗口/400队列、发前修改附件，记录错会话/重复副作用/漏结果、到人延迟和补发人工/token/费用。若回执不能减少错误和补发成本或人审负担上升则停止。当前观察，个人小样先明确白名单和宿主权限，生产敏感/关键审批退回可信本机Web核验。

#### 证据与依据

**依据 1 · 源码核查**：[src/weixin/monitor.ts:254-263](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/weixin/monitor.ts#L254-L263)

游标先保存后派发的具体缺口。

<details>
<summary>查看原文（10行）</summary>

```text

      if (resp.get_updates_buf != null && resp.get_updates_buf !== "") {
        saveSyncBuf(storageDir, resp.get_updates_buf);
        getUpdatesBuf = resp.get_updates_buf;
      }

      for (const msg of resp.msgs ?? []) {
        if (abortSignal?.aborted) return;
        onMessage(msg);
      }
```

</details>

**依据 2 · 源码核查**：[src/bridge/bridge.ts:7864-7887](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L7864-L7887)

窗口预算/发送API边界非到人。

<details>
<summary>查看原文（24行）</summary>

```text
    const contextToken = this.wireContextToken ?? undefined;
    try {
      if (item.kind === "text") {
        const payload = count + 1 > MSG_LIMIT_WARN
          ? item.text + `\n\n⚠️ 微信限制连续发送消息数量10条（已发 ${count + 1} 条），发送 /next 可继续`
          : item.text;
        await sendTextMessage(userId, payload, {
          baseUrl: token.baseUrl,
          token: token.token,
          contextToken,
        });
      } else {
        await sendMediaMessage(userId, mediaTypeForFile(item.fileName), buffer!, {
          baseUrl: token.baseUrl,
          token: token.token,
          contextToken,
          cdnBaseUrl: this.config.cdnBaseUrl,
          fileName: item.fileName,
        });
      }
      return "sent";
    } catch (err) {
      this.log(`outbound send error (${item.kind}): ${String(err)}`);
      if (generation !== this.outboundGeneration) return "failed";
```

</details>

**依据 3 · 源码核查**：[src/bridge/bridge.ts:7970-7977](https://github.com/pan17/dsh-wechat/blob/d3682b47b5fe003ea2988a5cf25bff9391c55a5c/src/bridge/bridge.ts#L7970-L7977)

硬队列丢旧是具体停止/补发起点。

```text
    while (this.outboundCache.length >= MAX_OUTBOUND_QUEUE_HARD) {
      const evicted = this.outboundCache.shift();
      if (evicted === undefined) break;
      this.log(`outbound cache hard ceiling (${MAX_OUTBOUND_QUEUE_HARD}) reached; dropping oldest to bound memory: ${evicted.kind === "text" ? evicted.text.slice(0, 60) : evicted.fileName}`);
    }
    this.outboundCache.push({ ...item });
    this.persistOutboundState(userId);
  }
```

#### 缺口

- 消息回执/附件快照方向收益未验证。
  **影响**：不将概念计为当前可靠消息或业务经济创新。
  **进一步探讨**：做固定故障对照，预先定义错卡/漏投和人工补发阈值。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
