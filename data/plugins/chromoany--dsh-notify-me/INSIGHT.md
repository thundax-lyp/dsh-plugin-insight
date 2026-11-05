# DSH Notify Me

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ac7ea7b](https://github.com/chromoany/dsh-notify-me/tree/ac7ea7b48709e2149dba17e0513dfc1059dcd7b0)

<!-- BEGIN META -->
[![GitHub ★ 98](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=98&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chromoany/dsh-notify-me) [![npm 30d 14,997](https://img.shields.io/static/v1?label=npm+30d&message=14%2C997&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-notify-me) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-notify-me)
<!-- END META -->

> **功能**：在页面离开和关闭时按配置发送任务提醒

> **亮点**：[Q01](#research-q01) 覆盖页面在后台与关闭的提醒路径。

> **主要限制**：[Q03](#research-q03) 依赖平台权限、心跳和网关配置。

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
  - [Q01 · 用户如何验收？](#detail-section-11)
  - [Q02 · 页面和宿主如何协作？](#detail-section-12)
  - [Q03 · 外部传输边界？](#detail-section-13)
  - [Q04 · 采用退出成本？](#detail-section-14)
  - [Q05 · 什么否定收益？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户离开 DSH 时错过审批和后台回复。

一直查看页面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 一直查看页面。 | 可直接比较 | 保留人工步骤 |
| DSH Notify Me | 覆盖页面在后台与关闭的提醒路径。 | 依赖平台权限、心跳和网关配置。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 页面通知和可选宿主事件兜底借心跳协调。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户离开 DSH 时错过审批和后台回复。 | 保留原流程 |
| 试验 | 页面通知和可选宿主事件兜底借心跳协调。 | 观察固定版本 |
| 复核 | 从本地通知逐步验证到外推和退出。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 减少错过审批及后台回复的等待 | 可缩短发现等待和回复的时间。 | 从本地通知逐步验证到外推和退出。 |

> **思考**：[Q03](#research-q03) 依赖平台权限、心跳和网关配置。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 覆盖页面在后台与关闭的提醒路径。

按 session 和审批 ID 控制重复。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 依赖平台权限、心跳和网关配置。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从本地通知逐步验证到外推和退出。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的减少错过审批及后台回复的等待。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/host-fallback.js、lib/relay.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的减少错过审批及后台回复的等待。未执行目标代码或实际宿主验证。
- 下一步：保留事件、载荷及点击时间线。

**分析版本**

- **仓库**：[chromoany/dsh-notify-me](https://github.com/chromoany/dsh-notify-me)
- **版本号**：1.17.0（[固定提交 ac7ea7b](https://github.com/chromoany/dsh-notify-me/tree/ac7ea7b48709e2149dba17e0513dfc1059dcd7b0)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可缩短发现等待和回复的时间。

保留事件、载荷及点击时间线。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 2243 | — | — | 59333 |
| .mjs | source | 6 | 2125 | 1693 | 336 | — |
| .js | source | 5 | 6779 | 3978 | 2692 | — |
| .cjs | source | 1 | 4190 | 3340 | 643 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/chromoany/dsh-notify-me/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：减少错过审批及后台回复的等待

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户如何验收？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户离开页面后可得到审批和回复提醒，点击返回对应会话。对照原生页面提醒，测正确会话、到达时延和重复数。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-31](https://github.com/chromoany/dsh-notify-me/blob/ac7ea7b48709e2149dba17e0513dfc1059dcd7b0/README.md#L23-L31)

作者描述通知、后台和宿主兜底

```text
DSH Web / Desktop 的通知插件，让你敢不开完整访问，也不必一直守着页面。

- **需要你操作时**：审批、方案确认、提问，用通知、提示音和标题标记提醒。
- **后台回复完成时**：及时回来查看结果，点击通知可回到对应对话；提醒时机可选「仅后台 / 仅当前对话静默 / 总是提醒」。
- **人走开但窗口没走**：窗口留在最前台、人却离开座位，超过 3 分钟没有输入也算离开，该提醒的照常提醒；收到的那条通知不会在你回来之前自己消失，一回到页面（点任务栏、Alt+Tab、点通知都算）就收起。
- **离开电脑时**：可选转发到 Discord、Bark、Gotify、飞书群机器人、Server酱、WxPusher 或自己的 Webhook。
- **连页面都关掉时**：可选让宿主进程兜底——页面不在时宿主继续把「需要你操作」「回复完成」推到你的网关；也可以只开同源中继，让页面够到要认证的网关。两项默认关，配置写在 profile 的 patch 层（见[高级设置](#高级设置)里的「页面关闭后：宿主侧兜底与同源中继」）。

> 页面或桌面应用需保持运行（后台 / 最小化可以）；系统通知需要通知权限。审批按钮依赖 Service Worker，只有 Web 端有，桌面端的通知不带按钮，点通知回到对话里裁决。开启宿主侧兜底后，页面关闭仍能收到外部推送——本地通知与审批按钮仍要页面在。
```

**依据 2 · 源码核查**：[lib/host-fallback.js:7-22](https://github.com/chromoany/dsh-notify-me/blob/ac7ea7b48709e2149dba17e0513dfc1059dcd7b0/lib/host-fallback.js#L7-L22)

事件源与去重策略

<details>
<summary>查看原文（16行）</summary>

```text
 * close from inside, and this module closes it from the host's session event
 * feed: `turn/end` and `approval/asked` are delivered straight from the host
 * process, where the browser is irrelevant.
 *
 * Two delivery paths for the same events would send everything twice while a
 * page is open, so this module yields to the page's online lease
 * (lib/page-bridge.js `createPresence`): a fresh heartbeat means the page is
 * already sending, an expired or explicitly released lease means it is not.
 * The lease also carries the page's language, which is how this module ends up
 * speaking the language the user is reading. It carries nothing else on
 * purpose: "the host pushes exactly when no page is open" is a rule with one
 * input, and the page's own push switches describe what the page does, not what
 * the host should do.
 *
 * Noise control, all per session: subagent sessions are skipped by default,
 * `turn/end` is throttled, and repeated approvals are deduplicated by id. A
```

</details>

#### 缺口

- 系统权限与平台影响到达。
  **影响**：减少驻留页面。
  **进一步探讨**：用虚构审批和回复验证。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 页面和宿主如何协作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

页面心跳表示在场，宿主默认订阅 turn/end 和 approval/asked，按 session 节流与审批 ID 去重。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host-fallback.js:7-22](https://github.com/chromoany/dsh-notify-me/blob/ac7ea7b48709e2149dba17e0513dfc1059dcd7b0/lib/host-fallback.js#L7-L22)

心跳与事件

<details>
<summary>查看原文（16行）</summary>

```text
 * close from inside, and this module closes it from the host's session event
 * feed: `turn/end` and `approval/asked` are delivered straight from the host
 * process, where the browser is irrelevant.
 *
 * Two delivery paths for the same events would send everything twice while a
 * page is open, so this module yields to the page's online lease
 * (lib/page-bridge.js `createPresence`): a fresh heartbeat means the page is
 * already sending, an expired or explicitly released lease means it is not.
 * The lease also carries the page's language, which is how this module ends up
 * speaking the language the user is reading. It carries nothing else on
 * purpose: "the host pushes exactly when no page is open" is a rule with one
 * input, and the page's own push switches describe what the page does, not what
 * the host should do.
 *
 * Noise control, all per session: subagent sessions are skipped by default,
 * `turn/end` is throttled, and repeated approvals are deduplicated by id. A
```

</details>

**依据 2 · 源码核查**：[lib/host-fallback.js:182-198](https://github.com/chromoany/dsh-notify-me/blob/ac7ea7b48709e2149dba17e0513dfc1059dcd7b0/lib/host-fallback.js#L182-L198)

有页面时跳过及缓存 ID

<details>
<summary>查看原文（17行）</summary>

```text
    if (type === "approval/asked") {
      if (!events.has("approval/asked")) return;
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
```

</details>

#### 缺口

- 断网和心跳失效可能误判。
  **影响**：减少双端同时提醒。
  **进一步探讨**：模拟后台与断连切换。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 外部传输边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

外推送按配置网关发送，审批正文截短仍可能含数据。通知本身不能代替返回宿主裁决。Web 按钮依赖 Service Worker，桌面缺少同样按钮。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host-fallback.js:197-198](https://github.com/chromoany/dsh-notify-me/blob/ac7ea7b48709e2149dba17e0513dfc1059dcd7b0/lib/host-fallback.js#L197-L198)

审批原因截短

```text
      const reason = clip(typeof event.data?.reason === "string" ? event.data.reason : "", APPROVAL_REASON_LIMIT);
      // Exactly what the page's toast says for an approval: the tool, then its
```

**依据 2 · 作者声明**：[README.md:28-31](https://github.com/chromoany/dsh-notify-me/blob/ac7ea7b48709e2149dba17e0513dfc1059dcd7b0/README.md#L28-L31)

外部网关与平台限制

```text
- **离开电脑时**：可选转发到 Discord、Bark、Gotify、飞书群机器人、Server酱、WxPusher 或自己的 Webhook。
- **连页面都关掉时**：可选让宿主进程兜底——页面不在时宿主继续把「需要你操作」「回复完成」推到你的网关；也可以只开同源中继，让页面够到要认证的网关。两项默认关，配置写在 profile 的 patch 层（见[高级设置](#高级设置)里的「页面关闭后：宿主侧兜底与同源中继」）。

> 页面或桌面应用需保持运行（后台 / 最小化可以）；系统通知需要通知权限。审批按钮依赖 Service Worker，只有 Web 端有，桌面端的通知不带按钮，点通知回到对话里裁决。开启宿主侧兜底后，页面关闭仍能收到外部推送——本地通知与审批按钮仍要页面在。
```

#### 缺口

- 网关资料策略需独立确定。
  **影响**：提醒内容也需最小化。
  **进一步探讨**：检查实际载荷与过期审批。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用退出成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先只开本地通知，测试权限、前后台和无活动判定，再选启用宿主外推。退出移除 profile 配置、检查心跳服务和网关凭据留存。资源成本含常驻页面、推送与维护。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-31](https://github.com/chromoany/dsh-notify-me/blob/ac7ea7b48709e2149dba17e0513dfc1059dcd7b0/README.md#L25-L31)

功能开关和默认关闭

```text
- **需要你操作时**：审批、方案确认、提问，用通知、提示音和标题标记提醒。
- **后台回复完成时**：及时回来查看结果，点击通知可回到对应对话；提醒时机可选「仅后台 / 仅当前对话静默 / 总是提醒」。
- **人走开但窗口没走**：窗口留在最前台、人却离开座位，超过 3 分钟没有输入也算离开，该提醒的照常提醒；收到的那条通知不会在你回来之前自己消失，一回到页面（点任务栏、Alt+Tab、点通知都算）就收起。
- **离开电脑时**：可选转发到 Discord、Bark、Gotify、飞书群机器人、Server酱、WxPusher 或自己的 Webhook。
- **连页面都关掉时**：可选让宿主进程兜底——页面不在时宿主继续把「需要你操作」「回复完成」推到你的网关；也可以只开同源中继，让页面够到要认证的网关。两项默认关，配置写在 profile 的 patch 层（见[高级设置](#高级设置)里的「页面关闭后：宿主侧兜底与同源中继」）。

> 页面或桌面应用需保持运行（后台 / 最小化可以）；系统通知需要通知权限。审批按钮依赖 Service Worker，只有 Web 端有，桌面端的通知不带按钮，点通知回到对话里裁决。开启宿主侧兜底后，页面关闭仍能收到外部推送——本地通知与审批按钮仍要页面在。
```

**依据 2 · 源码核查**：[lib/relay.js:92-96](https://github.com/chromoany/dsh-notify-me/blob/ac7ea7b48709e2149dba17e0513dfc1059dcd7b0/lib/relay.js#L92-L96)

中继有请求门禁

```text
    const refusal = gateRequest(req, { bindHost: shared?.bindHost, allowedOrigins: shared?.allowedOrigins });
    if (refusal !== null) {
      respond(res, 403, { ok: false, reason: refusal });
      return;
    }
```

#### 缺口

- 平台耗电和长期去重未知。
  **影响**：配置需要随宿主升级验证。
  **进一步探讨**：停用后触发同样事件。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么否定收益？

**研究主题**：新假设与验证

#### 完整回答

对比仅页面和宿主兜底，测离开、回来、重载、两窗口、过期审批。若重复推送、跨会话跳错或停用仍外发，则当前组合不满足可靠提醒。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host-fallback.js:182-198](https://github.com/chromoany/dsh-notify-me/blob/ac7ea7b48709e2149dba17e0513dfc1059dcd7b0/lib/host-fallback.js#L182-L198)

可测试去重与在场

<details>
<summary>查看原文（17行）</summary>

```text
    if (type === "approval/asked") {
      if (!events.has("approval/asked")) return;
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
```

</details>

**依据 2 · 作者声明**：[README.md:25-31](https://github.com/chromoany/dsh-notify-me/blob/ac7ea7b48709e2149dba17e0513dfc1059dcd7b0/README.md#L25-L31)

可测试事件与平台范围

```text
- **需要你操作时**：审批、方案确认、提问，用通知、提示音和标题标记提醒。
- **后台回复完成时**：及时回来查看结果，点击通知可回到对应对话；提醒时机可选「仅后台 / 仅当前对话静默 / 总是提醒」。
- **人走开但窗口没走**：窗口留在最前台、人却离开座位，超过 3 分钟没有输入也算离开，该提醒的照常提醒；收到的那条通知不会在你回来之前自己消失，一回到页面（点任务栏、Alt+Tab、点通知都算）就收起。
- **离开电脑时**：可选转发到 Discord、Bark、Gotify、飞书群机器人、Server酱、WxPusher 或自己的 Webhook。
- **连页面都关掉时**：可选让宿主进程兜底——页面不在时宿主继续把「需要你操作」「回复完成」推到你的网关；也可以只开同源中继，让页面够到要认证的网关。两项默认关，配置写在 profile 的 patch 层（见[高级设置](#高级设置)里的「页面关闭后：宿主侧兜底与同源中继」）。

> 页面或桌面应用需保持运行（后台 / 最小化可以）；系统通知需要通知权限。审批按钮依赖 Service Worker，只有 Web 端有，桌面端的通知不带按钮，点通知回到对话里裁决。开启宿主侧兜底后，页面关闭仍能收到外部推送——本地通知与审批按钮仍要页面在。
```

#### 缺口

- 无本次系统通知实测。
  **影响**：到达与可操作性分别计量。
  **进一步探讨**：保留事件、载荷及点击时间线。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
