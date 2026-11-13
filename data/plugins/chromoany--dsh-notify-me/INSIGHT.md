# DSH Notify Me

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[71ffeca](https://github.com/chromoany/dsh-notify-me/tree/71ffecacbaa49fa03e92463f8eb71b4743336b6c)

<!-- BEGIN META -->
[![GitHub ★ 127](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=127&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chromoany/dsh-notify-me) [![npm 30d 21,453](https://img.shields.io/static/v1?label=npm+30d&message=21%2C453&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-notify-me) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-notify-me)
<!-- END META -->

> **功能**：为 DSH 等待交互和后台完成提供系统提醒，并支持审批快捷入口与外部推送。

> **亮点**：把多个会话的等待与完成引入系统提醒，可选宿主通道覆盖关页场景，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：页面在线不等于某条提醒已送达，本地按钮反馈也不证明宿主批准。两条边界需要独立验收，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 用户离开对话时，通知比轮询标签页多做什么？](#detail-section-11)
  - [Q02 · 关页面后的宿主兜底怎样避免重复，又可能漏在哪？](#detail-section-12)
  - [Q03 · 通知上的同意是否证明宿主已批准？](#detail-section-13)
  - [Q04 · 怎样小范围评估提醒，何时值得开启外发？](#detail-section-14)
  - [Q05 · 先确认宿主结果再收起通知能否减少误判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合保留人工审批、又需要暂时离开 DSH 页面的人，见 [Q01](#research-q01)。

定时回到会话查看待办，并在宿主审批界面处理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 本地提醒 | 告知待办和完成 | 需页面和通知权限 |
| 快捷审批 | 从通知发送答复 | 需宿主复核 |
| 关页兜底 | 从宿主向网关推送 | 需配置目标并保持宿主运行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 页面及通知权限 | 本地提醒所需 | 显示通知 | 回到会话查看 |
| Service Worker 或 Windows 宿主助手 | 相应快捷按钮所需 | 传送用户选择 | 用会话内审批 |
| 宿主和可达网关 | 关页外发所需 | 转发宿主事件 | 缺目标不订阅 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 保留人工审批并关闭外发 | 使用无害任务 |
| 触发 | 在后台等待一次提醒 | 核对会话和真实待办 |
| 退出 | 动作反馈不明确时返回会话 | 查看宿主批准结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 系统通知或网关环境 | 核对权限和版本 | 耗时未知 |
| 持续 | 可能的网关费用 | 管理静音、渠道与内容 | 未测净节省 |
| 失败恢复 | 重复推送与日志 | 核对是否真的批准 | 宿主与网关需分别排查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 审批触达 | 页面及宿主事件链 | 漏报和延迟 |
| 快速裁决 | 按钮映射至页面对象 | 宿主最终结果 |

> **思考**：页面在线不等于某条提醒已送达，本地按钮反馈也不证明宿主批准。两条边界需要独立验收，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把多个会话的等待与完成引入系统提醒，可选宿主通道覆盖关页场景，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

租约先于去重和限频，使页面在线时的跳过不消耗缓存。它也留下页面仍在线但未投递的窗口，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

页面在线不等于某条提醒已送达，本地按钮反馈也不证明宿主批准。两条边界需要独立验收，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先关闭外发，验证无害通知及真实待办。答复不明确就从原会话处理，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认双面挂载、租约和快捷动作逻辑。端到端送达、平台和宿主批准仍需核对。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/client.js、lib/index.js、lib/host-fallback.js、lib/page-bridge.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对双面挂载、代表性宿主提醒、桥请求和按钮答复。未验证任何实际宿主或网关。
- 下一步：同一低风险审批比较正常、过期及断网三种条件，逐项核对通知、按钮与宿主状态。

**分析版本**

- **仓库**：[chromoany/dsh-notify-me](https://github.com/chromoany/dsh-notify-me)
- **版本号**：1.19.0（[固定提交 71ffeca](https://github.com/chromoany/dsh-notify-me/tree/71ffecacbaa49fa03e92463f8eb71b4743336b6c)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

通知动作等宿主可关联结果后再标成功，检验能否减少本地反馈引起的误判，见 [Q05](#research-q05)。

同一低风险审批比较正常、过期及断网三种条件，逐项核对通知、按钮与宿主状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 2461 | — | — | 69704 |
| .mjs | source | 8 | 2606 | 2062 | 404 | — |
| .js | source | 7 | 7753 | 4687 | 2924 | — |
| .cjs | source | 1 | 4303 | 3428 | 665 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/chromoany/dsh-notify-me/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确定 DSH 提醒何时从页面或宿主发出，以及快捷审批、外发和故障如何复核。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户离开对话时，通知比轮询标签页多做什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合在多个 DSH 会话保留人工审批、同时需要离开当前页面的开发者。相比轮流打开标签页，扩展能让等待交互或后台完成进入通知渠道。宿主和页面分别挂载，用户可从设置调提醒和渠道。它增加的是触达与回到会话的入口，权限判断仍由宿主审批处理。合格结果是正确会话的真实请求提醒及时到达，用户在宿主看见并处理该请求。单独收到测试通知只能验证部分渠道。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-29](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/README.md#L23-L29)

作者描述等待与完成提醒。

```text
DSH Web / Desktop 的通知插件，让你敢不开完整访问，也不必一直守着页面。

- **需要你操作时**：审批、方案确认、提问，用通知、提示音和标题标记提醒。
- **后台回复完成时**：及时回来查看结果，点击通知可回到对应对话；提醒时机可选「仅后台 / 仅当前对话静默 / 总是提醒」。
- **人走开但窗口没走**：窗口留在最前台、人却离开座位，超过 3 分钟没有输入也算离开，该提醒的照常提醒；收到的那条通知不会在你回来之前自己消失，一回到页面（点任务栏、Alt+Tab、点通知都算）就收起（想让它在回到页面后继续留着，打开「回到页面也保留提醒」）。
- **离开电脑时**：可选转发到 Discord、Bark、Gotify、飞书群机器人、Server酱、WxPusher 或自己的 Webhook。
- **连页面都关掉时**：可选让宿主进程兜底——页面不在时宿主继续把「需要你操作」「回复完成」推到你的网关；也可以只开同源中继，让页面够到要认证的网关。两项默认关，配置写在 profile 的 patch 层（见[页面关闭后：宿主侧兜底与同源中继](#页面关闭后宿主侧兜底与同源中继)）。
```

**依据 2 · 作者声明**：[README.md:71-77](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/README.md#L71-L77)

作者测试入口与平台差异。

```text
## 首次验证

1. 在 DSH 页面上点击一次，按提示允许通知；若此前拒绝过，在浏览器站点设置中允许通知。操作系统也需要允许对应浏览器 / DSH Desktop 显示通知。
2. 打开 **设置 → 通知提醒**，确认出现该分区及底部插件版本号，保持「启用提醒」「提示音」开启。
3. 点击设置页的「测试『回复完成』」按钮：应出现一条测试通知，并按当前音效设置播放声音。这个本地测试不会转发到外部通知端点，也不受「窗口在前台时也提醒」开关限制。

Web 用户可再测审批按钮，通知上会带「同意 / 拒绝」。Windows 桌面端由宿主发原生 Toast，同样带按钮；macOS 桌面端只发普通通知（渠道差异见[提醒渠道](#提醒渠道)）。
```

**依据 3 · 源码核查**：[package.json:94-105](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/package.json#L94-L105)

DSH bundle 与浏览器入口声明。

<details>
<summary>查看原文（12行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-session",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-conversation"
      ],
      "platform": "web"
    },
```

</details>

**依据 4 · 源码核查**：[lib/client.js:5082-5102](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/lib/client.js#L5082-L5102)

实际注册设置入口。

<details>
<summary>查看原文（21行）</summary>

```text
          // The effect returns register()'s own disposer, so a client-plugin
          // reload (HMR) unregisters the dictionaries before re-registering
          // them; locale.register throws when a namespace already has a locale.
          ctx.effect(function () {
            return ctx.locale.register(NS, { zh: UI_zh, en: UI_en });
          }, "dsh-notify-me: settings dictionaries");
          var t = ctx.locale.bind(NS);
          ctx.slots.inject("settings.section", function () {
            return ctx.slots.register({
              name: "settings.section",
              id: "dsh-notify-me",
              order: 45,
              label: function () { return t("nav"); },
              locale: NS,
              inject: function () { return { t: t }; }
            }, function (ownerProps) {
              return React.createElement(NotifySettingsView, { ctx: ctx, t: t });
            });
          });
          // Same page, different layer: give the sidebar row the bell instead of
          // the gear the shell falls back to for unknown section ids.
```

</details>

**依据 5 · 源码核查**：[lib/index.js:697-722](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/lib/index.js#L697-L722)

宿主实际注册窗口及原生通道。

<details>
<summary>查看原文（26行）</summary>

```text
  ctx.inject(["webServer"], (webCtx) => {
    // The listener may be bound to one concrete LAN interface; read it so the
    // gate can accept the self-addressed request the shell makes in that setup.
    // The bridge and relay handlers read it from `shared` at request time, so
    // one read serves every route that was mounted before this callback ran.
    shared.bindHost = bindHostOf(webCtx.webServer);

    webCtx.effect(
      () => webCtx.webServer.register({ kind: "exact", path: FOCUS_ROUTE, handler: createHandler(shared.bindHost) }),
      "dsh-notify-me: window focus route",
    );

    // macOS native notifications (on by default on macOS when the helper app
    // has been built; `macNotify: { enabled: false }` turns it off).
    mountMacNotify(webCtx, section(config?.macNotify), shared, ctx.logger);

    // Windows native approvals: the host posts the toast because Electron's
    // renderer path drops the action buttons (issue #33). `winToast: { enabled:
    // false }` turns it off and leaves approval alerts on the page channel.
    mountWinToast(webCtx, section(config?.winToast), shared, ctx.logger);

    if (bridgeEnabled) {
      webCtx.effect(
        () => webCtx.webServer.register({ kind: "exact", path: BRIDGE_ROUTE, handler: createBridgeHandler(state, shared) }),
        "dsh-notify-me: page bridge route",
      );
```

</details>

#### 缺口

- 实际漏报率和等待时间未知
  **影响**：无法判定相比人工查看的净收益
  **进一步探讨**：用两个低风险会话比较前台、后台时的到达及处理时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 关页面后的宿主兜底怎样避免重复，又可能漏在哪？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主兜底显式启用且目标非空才订阅，页面也可独立发提醒。宿主收到会话事件后检查静音、允许的外发类型以及页面租约；有活页面就跳过。关闭通过释放或心跳过期让宿主接手。审批按事件 ID 限量去重，正常完成按会话限频，异常完成另行保留。租约衡量页面最近报活，它无法证明该事件已经被页面或网关投递。若页面仍被认为在线但实际已经不能交付，这个事件可能在交接时没有宿主推送，代码没有每条确认后补发的逻辑证据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:680-695](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/lib/index.js#L680-L695)

明确启用才挂兜底。

<details>
<summary>查看原文（16行）</summary>

```text
export function apply(ctx, config) {
  const state = normalizeConfig(config, ctx.logger);
  const bridgeEnabled = state.hostFallback.enabled || state.relay.enabled;
  const shared = {
    version: VERSION,
    bindHost: undefined,
    allowedOrigins: state.allowedOrigins,
    presence: createPresence({ leaseMs: state.hostFallback.pageLeaseMs }),
  };

  // Both are mounted whenever they are enabled, even if the configuration is
  // incomplete: the module itself refuses to run and leaves one warning behind,
  // which is the only trace an operator gets for a half-written patch. `active`
  // is what the status reply and the feature list report.
  if (state.hostFallback.enabled) mountHostFallback(ctx, state.hostFallback, shared);
  if (state.relay.enabled) mountRelay(ctx, state.relay, shared);
```

</details>

**依据 2 · 源码核查**：[lib/host-fallback.js:100-117](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/lib/host-fallback.js#L100-L117)

目标缺失时不订阅。

<details>
<summary>查看原文（18行）</summary>

```text
export function mountHostFallback(ctx, config, shared) {
  // A pusher with nowhere to push is not mounted at all: subscribing would
  // only fail every delivery, and a warn once is easier to act on than a
  // silent stream of gateway errors.
  if (typeof config.target !== "string" || config.target.length === 0) {
    ctx.logger?.warn?.("dsh-notify-me: hostFallback.enabled is true but no hostFallback.target and no gateway.target, nothing subscribed");
    return;
  }
  const events = new Set(Array.isArray(config.events) && config.events.length > 0 ? config.events : DEFAULT_EVENTS);
  const includeSubagents = config.includeSubagents === true;
  const throttleMs = Number.isFinite(config.turnEndThrottleMs) ? Math.max(0, config.turnEndThrottleMs) : DEFAULT_THROTTLE_MS;
  const prefix = typeof config.titlePrefix === "string" && config.titlePrefix.length > 0 ? config.titlePrefix : "DSH";
  const healthPath =
    typeof config.healthPath === "string" && config.healthPath.startsWith("/") ? config.healthPath : DEFAULT_HEALTH_PATH;
  const presence = shared?.presence ?? createPresence({ leaseMs: 0 });

  const credentials = createCredentialReader(config.credentialsFile, ctx.logger);
  const delivery = { target: config.target, headers: config.headers, credentials, logger: ctx.logger };
```

</details>

**依据 3 · 源码核查**：[lib/host-fallback.js:170-214](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/lib/host-fallback.js#L170-L214)

静音、租约及审批去重。

<details>
<summary>查看原文（45行）</summary>

```text
  const handle = (session, event) => {
    if (session?.header?.origin === "subagent" && !includeSubagents) return;
    const key = keyOf(session);
    const type = event?.type;
    // A session muted from the sidebar stays silent here too: the switch has to
    // survive the tab closing, otherwise the fallback fires exactly the alert
    // the user asked not to get. Titles are still remembered below, so lifting
    // the mute does not leave the session nameless.
    const quiet = presence.isMuted(key);

    if (type === "session/title") {
      const title = typeof event.data?.title === "string" ? event.data.title : "";
      if (title.length > 0) remember(titles, key, title);
      return;
    }
    if (quiet) return;
    if (type === "approval/asked") {
      if (!events.has("approval/asked")) return;
      // The page's master switch or its 「需要你」 switch says this alert goes
      // nowhere outside the machine. Checked before the dedupe cache for the
      // same reason as the lease: an alert held back by a switch must not burn
      // the id, or turning the switch back on would never deliver that ask.
      if (!presence.externalAllowed("attention")) return;
      // An open page raised its own approval alert; pushing here would be the
      // second notification for one event. Checked before the dedupe cache, so
      // a skipped approval does not burn the id and the host can still report
      // a later ask for it.
      if (presence.isAlive()) return;
      const id = String(event.data?.id ?? "");
      if (id.length > 0) {
        if (seenApprovals.has(id)) return;
        seenApprovals.add(id);
        if (seenApprovals.size > CACHE_LIMIT) seenApprovals.delete(seenApprovals.values().next().value);
      }
      const words = copy();
      const tool = typeof event.data?.toolName === "string" && event.data.toolName.length > 0 ? event.data.toolName : "tool";
      const reason = clip(typeof event.data?.reason === "string" ? event.data.reason : "", APPROVAL_REASON_LIMIT);
      // Exactly what the page's toast says for an approval: the tool, then its
      // reason, joined by ` · ` inside the body — the tool alone ("pwsh") is
      // not a sentence anyone can act on.
      void push({
        title: `${prefix}${words.separator}${words.approval}`,
        body: `${describe(session, key)}${words.bodySeparator}${tool}${reason.length > 0 ? `${words.detailJoiner}${reason}` : ""}`,
        type: "warning",
      });
```

</details>

**依据 4 · 源码核查**：[lib/host-fallback.js:217-241](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/lib/host-fallback.js#L217-L241)

正常结束限频与异常处理。

<details>
<summary>查看原文（25行）</summary>

```text
    if (type === "turn/end") {
      if (!events.has("turn/end")) return;
      // Same gate as the approval branch, before the throttle so a turn held
      // back by a switch does not spend this session's window either.
      if (!presence.externalAllowed("done")) return;
      // The lease is checked before the throttle so a turn the page delivered
      // does not consume this session's window: the window exists to keep the
      // host's own alerts apart, and it is only spent when one is sent.
      if (presence.isAlive()) return;
      const now = Date.now();
      const reason = turnEndReason(event.data?.reason);
      // Only a normal finish is throttled. The window exists to keep a burst of
      // completed turns from becoming a burst of alerts; an abnormal end is
      // exactly the alert worth interrupting for, and it is rare by nature —
      // swallowing it because the previous turn finished 15 s ago loses the one
      // notification the user had to act on.
      if (reason === "completed" && now - (lastTurnAt.get(key) ?? 0) < throttleMs) return;
      lastTurnAt.set(key, now);

      const words = copy();
      // The page's "reply finished" toast is the session label and nothing
      // else; the only addition here is the parenthetical naming an abnormal
      // end, which is the one fact the page cannot show once it is closed.
      const suffix = reason.length > 0 && reason !== "completed" ? words.reason(reason) : "";
      void push({
```

</details>

**依据 5 · 源码核查**：[lib/host-fallback.js:249-273](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/lib/host-fallback.js#L249-L273)

实际注册会话事件与销毁订阅。

<details>
<summary>查看原文（25行）</summary>

```text
  ctx.effect(
    () => {
      const offEvent = ctx.on("session/event", (session, event) => {
        try {
          handle(session, event);
        } catch (error) {
          ctx.logger?.warn?.(`dsh-notify-me: host fallback handler failed: ${error?.message ?? String(error)}`);
        }
      });
      // Disposal is a context event of its own, not a session log entry
      // (`SessionEventMap` has no such type), so it takes its own subscription:
      // without it a host that opens and closes many sessions leaks one cache
      // entry per closed session for the lifetime of the process.
      const offDisposed = ctx.on("session/disposed", (session) => {
        try {
          forget(session);
        } catch {}
      });
      return () => {
        offEvent?.();
        offDisposed?.();
      };
    },
    "dsh-notify-me: host fallback subscription",
  );
```

</details>

**依据 6 · 源码核查**：[lib/page-bridge.js:615-652](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/lib/page-bridge.js#L615-L652)

心跳续租、主动释放及是否在线。

<details>
<summary>查看原文（38行）</summary>

```text
  const leaseUntil = () => (lastBeatAt === 0 || leaseMs <= 0 ? 0 : lastBeatAt + leaseMs);

  return {
    /**
     * Record one heartbeat.
     * @param beat - `{ alive, language, muted }`, all optional; an omitted field
     *   keeps its previous value so a short heartbeat cannot erase what a full
     *   one reported, and any other key is ignored rather than trusted. `muted`
     *   replaces the whole list when present: the page always sends it whole.
     * @returns the instant the lease now runs to (`0` when disabled).
     */
    touch(beat = {}) {
      lastBeatAt = Date.now();
      released = beat.alive === false;
      if (LANGUAGES.includes(beat.language)) language = beat.language;
      if (Array.isArray(beat.muted)) muted = normalizeMuted(beat.muted);
      const switches = normalizeExternal(beat.external);
      if (switches !== null) external = switches;
      return leaseUntil();
    },
    /**
     * Record that the page is gone. The language survives: the host's next
     * alerts still have to arrive in the language the user reads.
     */
    clear() {
      released = true;
      lastBeatAt = 0;
    },
    /**
     * @param now - clock to compare against, injectable for tests.
     * @returns whether the page is currently believed to be delivering alerts
     *   itself.
     */
    isAlive(now = Date.now()) {
      if (leaseMs <= 0) return false; // coordination off: the host always pushes
      if (lastBeatAt === 0 || released) return false;
      return now - lastBeatAt < leaseMs;
    },
```

</details>

#### 缺口

- 页面崩溃与宿主接手间的漏报或重复未量化
  **影响**：无法把兜底当可靠投递队列
  **进一步探讨**：在租约刚续期和过期两种条件关闭页面，记录每个测试事件的渠道和时间

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 通知上的同意是否证明宿主已批准？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Web 动作依赖安全环境和 Service Worker 注册，Windows 桌面动作由原生通知回送页面，macOS 作者路径回到会话。客户端按 key 取待操作记录并先删除本页记录，测试通知只发反馈。真实动作调用 answer 后异步错误被忽略，且当前查找不到时会用缓存 interaction 对象。单页避免重复处理与宿主确认是不同条件，通知被关闭或产生本地 decision 事件时仍应在会话中核对批准结果。外推多页面和已过期交互的最终裁决依赖宿主。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:897-919](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/lib/client.js#L897-L919)

Windows 动作映射到页面答复。

<details>
<summary>查看原文（23行）</summary>

```text
    function applyWinAction(action) {
      if (!action || typeof action !== "object") return;
      if (action.action === "approve" && typeof action.key === "string") decidePending(action.key, "allowed-once");
      else if (action.action === "reject" && typeof action.key === "string") decidePending(action.key, "rejected");
      else if (action.action === "open" && typeof action.sessionId === "string") openClickedSession(action.sessionId);
    }
    // Button clicks always land through the protocol handler, which also opens
    // dsh://open. Polling the host while the wait is open is the only way the
    // decision reaches the page even when the window was already focused.
    function startWinPoll(key) {
      winNative.pollKey = typeof key === "string" && key ? key : winNative.pollKey;
      if (winNative.poll) return;
      var ticks = 0;
      winNative.poll = setInterval(function () {
        ticks++;
        probeWinNative();
        var waiting = winNative.pollKey ? !!pendingActions[winNative.pollKey] : true;
        if (!waiting || ticks > 120) {
          clearInterval(winNative.poll);
          winNative.poll = null;
          winNative.pollKey = null;
        }
      }, 1500);
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1357-1399](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/lib/client.js#L1357-L1399)

Service Worker 的条件和失败路径。

<details>
<summary>查看原文（43行）</summary>

```text
    function ensureActionBridge() {
      if (!config.quickActions) { swState = "disabled"; return; }
      if (swState === "active" || swState === "registering") return;
      listenBridge();
      try {
        if (typeof navigator === "undefined" || !navigator.serviceWorker) {
          swState = "unsupported: no service worker";
          return;
        }
        if (window.isSecureContext === false) {
          swState = "unsupported: insecure context";
          return;
        }
        var url = selfBundleUrl();
        if (!url) {
          swState = "unsupported: bundle url unknown";
          return;
        }
        swState = "registering";
        navigator.serviceWorker.register(url).then(function (reg) {
          try {
            swRegistration = reg || null;
            if (!reg) { swState = "failed: no registration"; return; }
            if (reg.active) { swState = "active"; return; }
            var w = reg.installing || reg.waiting;
            if (!w) { swState = "active"; return; }
            var settle = function () {
              try {
                if (reg.active || w.state === "activated") swState = "active";
                else if (w.state === "redundant") swState = "failed: worker redundant";
              } catch (e) {}
            };
            try { w.addEventListener("statechange", settle); } catch (e) {}
            settle();
          } catch (e) {
            swState = "failed: " + ((e && e.message) || e);
          }
        }, function (err) {
          swState = "failed: " + ((err && err.message) || err);
        });
      } catch (e) {
        swState = "failed: " + ((e && e.message) || e);
      }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1472-1512](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/lib/client.js#L1472-L1512)

本页 key 消费、测试分支、缓存对象与异步失败处理。

<details>
<summary>查看原文（41行）</summary>

```text
    function decidePending(key, outcome) {
      var rec = key ? pendingActions[key] : null;
      if (!rec) return false; // already answered elsewhere, or a stale toast
      delete pendingActions[key];
      if (!rec.test) closeNotificationTag(rec.tag);
      if (rec.test) {
        // Test toasts settle nothing real; the feedback toast IS the proof that
        // the button clicked all the way through the worker bridge.
        deliver("done", texts().doneTitle, outcome === "allowed-once" ? texts().testApproved : texts().testRejected, null, null);
        notifyEvent("decision", { key: key, outcome: outcome, sessionId: rec.sessionId || null, test: true });
        return true;
      }
      var target = findPendingByKey(key) || rec.interaction;
      if (!target || target.key !== key || typeof target.answer !== "function") return false;
      try {
        var p = target.answer(outcome);
        if (p && typeof p.catch === "function") p.catch(function () {});
      } catch (e) { return false; }
      unmarkAttention(key);
      notifyEvent("decision", { key: key, outcome: outcome, sessionId: rec.sessionId || null });
      return true;
    }
    // Attach buttons to one alert. Only real approval interactions qualify:
    // they are the only kind whose decision is a plain binary, and the only one
    // whose object answers answer('allowed-once' | 'rejected').
    function quickFor(key, it, sessionId) {
      // The buttons are a rendering concern: a notification needs a live worker
      // bridge for OS actions. The pending record is kept either way, so a click
      // still settles the same decision (and debug().actionKeys stays honest
      // about what is waiting).
      if (!config.quickActions) return null;
      if (!it || it.kind !== "approval" || typeof it.answer !== "function") return null;
      var q = {
        key: key,
        sessionId: sessionId || null,
        interaction: it,
        tag: attentionTag(key),
        test: false
      };
      pendingActions[key] = q;
      return q;
```

</details>

**依据 4 · 作者声明**：[README.md:349-356](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/README.md#L349-L356)

作者描述通知按钮机制。

```text
### 快捷裁决怎么走通的

Web 端带「同意 / 拒绝」按钮的通知只能由 Service Worker 弹出（往 `new Notification()` 里传 `actions` 会直接抛 `TypeError`），所以 bundle 的同一份文件再注册成一个只干转信的 worker，把「点了哪个按钮」带回页面；Windows 桌面端改由宿主发原生 Toast，按钮同样是「同意 / 拒绝」。**裁决仍在页面里发生**，调的是审批面板里「允许一次 / 拒绝」用的同一个 `PendingApproval.answer('allowed-once' | 'rejected')`——「同意」就是「允许一次」，不多放行任何东西。

<details>
<summary>展开按钮通知的记账与调窗口</summary>

每条按钮通知按交互 key 记账，一次只认领一条等待；请求被页面里答掉、或被新请求顶替之后，残留通知上的按钮再点也不会误裁，只是安静地关掉。Web 端带按钮的通知不设自动撤回，等你点按钮或把请求答掉才消失；普通通知 5 秒自收，macOS 桌面端没有按钮的审批通知与 Windows 桌面端带按钮的原生审批 Toast 都 12 秒自收。「通知自动消失」选「从不关闭」时，这两类都不因到点而收；三种设置都只管定时器那一次关闭，你回到页面时残留的通知一律收起（「回到页面也保留提醒」打开时不收起）。没来得及点就回页面里裁决，对话里的审批一直等着你。
```

**依据 5 · 作者声明**：[README.md:383-391](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/README.md#L383-L391)

macOS 助手渠道的按钮限制。

```text
### macOS 桌面端怎么发系统通知

页面里的 `new Notification()` 在 macOS 的 DSH Desktop（`dsh-app://app`）上进不了通知中心——不弹，也不报错（`Notification.permission` 照样是 `granted`）。插件在这一平台上改走宿主：页面 POST `/__dsh-notify-me/mac-notify`，宿主（`lib/mac-notify.js`）拉起 `macos/` 下的小助手 `DSH Notify.app`，由它用 `UNUserNotificationCenter` 发一条真正的系统通知。

- **一次性准备**：`bash macos/build.sh` 编译出 `macos/DSH Notify.app`（需要 Xcode Command Line Tools，几秒钟）。产物在 `.gitignore` 里，不进仓库也不进 npm 包。首次弹通知时在「系统设置 → 通知 → DSH Notify」里允许。
- **走哪条路是自动的**：宿主只在「macOS + 桌面壳（Electron 二进制）+ 助手已编译」三个条件都满足时注册这条路由；任一不满足，`GET` 探测报 `enabled: false`，页面继续用自己原来的通知，行为与改动前一致。`dsh web`（浏览器）永远走不到这条路由。
- **点通知回到对应对话**：小助手把会话 id 写进临时目录的 `dsh-notify-me-click.json` 并打开 `dsh://open` 抬窗；页面重新获得焦点时 `GET` 一次取走这个 id、切到对应对话，取走后即清掉，不会重复跳转。`autoFocus` 关掉时只抬窗不切会话。
- **提示音**：设置里选「系统通知音」时交给 macOS，其余音效模式仍由页面自己合成，不会两声叠在一起。
- **通知上仍然没有「同意 / 拒绝」按钮**：macOS 的通知动作要求注册通知类别，助手不碰审批状态，裁决仍在对话里做。
```

#### 缺口

- 宿主如何拒绝陈旧、跨页重复或网络失败的 answer 未实测
  **影响**：本地反馈不能当作实际放行证据
  **进一步探讨**：使用低风险审批分别测试失去连接、另一页先批准和宿主拒绝

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样小范围评估提醒，何时值得开启外发？

**研究主题**：效果与总成本、采用判断

#### 完整回答

在当前 Web profile 保留人工审批的开发者，可以先关闭外发，用无害审批验证本地通知是否准确定位会话。把从请求到宿主裁决完成的时间与定时查看做对照，单记浏览器许可、跨端配置、排查和误报时间。确有远离电脑需求才考虑宿主网关。兜底发送会话名、工具名及截短理由，部署者仍需检查理由能否外发。路由检查连接地址、Host 和 Origin，不能用来替代网关投递或宿主裁决验收。若收到错误会话、重复、漏报或动作反馈与真实状态不同，回到会话内处理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:71-77](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/README.md#L71-L77)

作者的首测步骤。

```text
## 首次验证

1. 在 DSH 页面上点击一次，按提示允许通知；若此前拒绝过，在浏览器站点设置中允许通知。操作系统也需要允许对应浏览器 / DSH Desktop 显示通知。
2. 打开 **设置 → 通知提醒**，确认出现该分区及底部插件版本号，保持「启用提醒」「提示音」开启。
3. 点击设置页的「测试『回复完成』」按钮：应出现一条测试通知，并按当前音效设置播放声音。这个本地测试不会转发到外部通知端点，也不受「窗口在前台时也提醒」开关限制。

Web 用户可再测审批按钮，通知上会带「同意 / 拒绝」。Windows 桌面端由宿主发原生 Toast，同样带按钮；macOS 桌面端只发普通通知（渠道差异见[提醒渠道](#提醒渠道)）。
```

**依据 2 · 作者声明**：[README.md:187-196](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/README.md#L187-L196)

外发为可选，需设置目标。

<details>
<summary>查看原文（10行）</summary>

```text
#### 外部推送

默认关闭。支持 Discord Webhook / Bark / Gotify / 飞书群机器人 / Server酱（Turbo 与 Server酱³）/ WxPusher / 自定义 Webhook；提醒正文会发往你填写的地址，只使用可信端点。

<details>
<summary>目标地址、转发开关、发送测试与失败记录</summary>

- **外部通知**（默认关）：把提醒同时转发到你自己的推送端点，人不在电脑前也能收到；可加多个目标，每个目标可单独启停。「转发「需要你」」「转发「回复完成」」各自独立开关；**发送测试通知**往所有目标发一条测试消息（不受这两类开关限制，也不会冒充真提醒）。转发跟本地提醒走同一套触发规则（「当前对话不弹通知」等开关同样管它）；总开关关闭后**页面关闭时的宿主侧兜底也一并停**（开关随心跳交给宿主，见「页面关闭后」一节），不会出现「页面关了还在推」；提醒正文会原样发往你填的地址，**只填你自己信任的端点**；
- **各目标的填法**：Discord 填 Webhook 地址；Bark 填 `https://api.day.app/<设备密钥>`；Gotify 填 `https://<服务器>/message?token=<应用令牌>`；飞书填群机器人 Webhook，可选填签名校验密钥；Server酱 填 `…/send/<SendKey>.send` 完整地址；WxPusher 填 appToken 与接收者 UID；自定义端点收一条 POST JSON：`{source, event, title, body, text, sessionId, time}`；
- **可靠投递**：明显是临时故障的失败（网络中断、5xx、429）按 2 秒 / 6 秒自动重试两次，其它错误立即停；关掉「外部通知」总开关或删掉某个目标后，已经排在定时器上的重试立刻作废，既不算失败也不进失败记录；重试仍失败会把这一条记进「失败记录」（最多 10 条，只留标题与正文摘要和主机名，不留完整端点），设置页能一眼看到并清空；
```

</details>

**依据 3 · 源码核查**：[lib/host-fallback.js:204-213](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/lib/host-fallback.js#L204-L213)

实际审批消息字段。

<details>
<summary>查看原文（10行）</summary>

```text
      const words = copy();
      const tool = typeof event.data?.toolName === "string" && event.data.toolName.length > 0 ? event.data.toolName : "tool";
      const reason = clip(typeof event.data?.reason === "string" ? event.data.reason : "", APPROVAL_REASON_LIMIT);
      // Exactly what the page's toast says for an approval: the tool, then its
      // reason, joined by ` · ` inside the body — the tool alone ("pwsh") is
      // not a sentence anyone can act on.
      void push({
        title: `${prefix}${words.separator}${words.approval}`,
        body: `${describe(session, key)}${words.bodySeparator}${tool}${reason.length > 0 ? `${words.detailJoiner}${reason}` : ""}`,
        type: "warning",
```

</details>

**依据 4 · 源码核查**：[lib/page-bridge.js:218-245](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/lib/page-bridge.js#L218-L245)

桥请求的地址、Host 和 Origin 门槛。

<details>
<summary>查看原文（28行）</summary>

```text
export function gateRequest(req, options) {
  const bindHost = options?.bindHost;
  const allowedHosts = originHostnames(options?.allowedOrigins);
  const allowedOrigins = new Set();
  for (const value of Array.isArray(options?.allowedOrigins) ? options.allowedOrigins : []) {
    const normalized = normalizeOrigin(value);
    if (normalized !== null) allowedOrigins.add(normalized);
  }

  const remote = String(req.socket?.remoteAddress ?? "").replace(/^::ffff:/i, "");
  if (!isLoopbackHostname(remote) && !isBindAddress(remote, bindHost)) return "bad-remote";

  const host = splitHost(req.headers.host);
  if (host === null) return "bad-host";
  const hostname = bareHostname(host.hostname);
  if (!isLoopbackHostname(hostname) && !isBindAddress(hostname, bindHost) && !allowedHosts.has(hostname)) {
    return "bad-host";
  }

  const origin = req.headers.origin;
  if (typeof origin !== "string" || origin.length === 0) return null;
  if (origin === "dsh-app://app") return null; // the desktop page, if not stripped
  const parsed = normalizeOrigin(origin);
  if (parsed === null) return "cross-origin";
  // An explicitly allowed origin may legitimately disagree with `Host`: a proxy
  // that rewrites `Host` to its upstream address is a supported deployment.
  if (allowedOrigins.has(parsed)) return null;
  const originUrl = new URL(origin);
```

</details>

#### 缺口

- 同版实际通知权限、批准落地与外发账单未测
  **影响**：收益与运行负担未知
  **进一步探讨**：对前台、后台、关闭页面三个条件分别核对到达与真实待办状态

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 先确认宿主结果再收起通知能否减少误判？

**研究主题**：新假设与验证

#### 完整回答

可以在 answer 发出后显示正在确认，只有宿主待办消失且有对应结果才将动作标为成功，超时则引导回会话。这比当前先关闭本地通知再忽略异步错误多了真实状态反馈。对照网络断开、陈旧 key 和正常答复三组，比较用户误以为已放行的次数、重复点击和等待。若宿主信号无法可靠关联、误判不下降或正常等待明显增多，就保留回会话的简单路径。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1472-1492](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/lib/client.js#L1472-L1492)

本地记录先消耗，异步 answer 错误无显式反馈。

<details>
<summary>查看原文（21行）</summary>

```text
    function decidePending(key, outcome) {
      var rec = key ? pendingActions[key] : null;
      if (!rec) return false; // already answered elsewhere, or a stale toast
      delete pendingActions[key];
      if (!rec.test) closeNotificationTag(rec.tag);
      if (rec.test) {
        // Test toasts settle nothing real; the feedback toast IS the proof that
        // the button clicked all the way through the worker bridge.
        deliver("done", texts().doneTitle, outcome === "allowed-once" ? texts().testApproved : texts().testRejected, null, null);
        notifyEvent("decision", { key: key, outcome: outcome, sessionId: rec.sessionId || null, test: true });
        return true;
      }
      var target = findPendingByKey(key) || rec.interaction;
      if (!target || target.key !== key || typeof target.answer !== "function") return false;
      try {
        var p = target.answer(outcome);
        if (p && typeof p.catch === "function") p.catch(function () {});
      } catch (e) { return false; }
      unmarkAttention(key);
      notifyEvent("decision", { key: key, outcome: outcome, sessionId: rec.sessionId || null });
      return true;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1494-1512](https://github.com/chromoany/dsh-notify-me/blob/71ffecacbaa49fa03e92463f8eb71b4743336b6c/lib/client.js#L1494-L1512)

本地按钮限定到审批对象及 key。

<details>
<summary>查看原文（19行）</summary>

```text
    // Attach buttons to one alert. Only real approval interactions qualify:
    // they are the only kind whose decision is a plain binary, and the only one
    // whose object answers answer('allowed-once' | 'rejected').
    function quickFor(key, it, sessionId) {
      // The buttons are a rendering concern: a notification needs a live worker
      // bridge for OS actions. The pending record is kept either way, so a click
      // still settles the same decision (and debug().actionKeys stays honest
      // about what is waiting).
      if (!config.quickActions) return null;
      if (!it || it.kind !== "approval" || typeof it.answer !== "function") return null;
      var q = {
        key: key,
        sessionId: sessionId || null,
        interaction: it,
        tag: attentionTag(key),
        test: false
      };
      pendingActions[key] = q;
      return q;
```

</details>

#### 缺口

- 宿主是否能稳定提供可关联确认信号未知
  **影响**：影响假设的可实现性
  **进一步探讨**：记录真实待办和答复事件后再做故障对照

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
