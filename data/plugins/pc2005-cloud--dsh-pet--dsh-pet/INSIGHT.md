# dsh-pet

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ef174be](https://github.com/PC2005-cloud/dsh-pet/tree/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet)

<!-- BEGIN META -->
[![GitHub ★ 6,344](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C344&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PC2005-cloud/dsh-pet) [![npm 30d 588,634](https://img.shields.io/static/v1?label=npm+30d&message=588%2C634&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet) [![最新发布 2026-11-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet)
<!-- END META -->

> **功能**：在 DeepSeek Harness 内显示互动桌宠，提供活动提醒、余额、待办、语音和闲聊。

> **亮点**：[Q01](#research-q01) 将审批事件、系统通知与回到原会话的操作接起来。[Q02](#research-q02) 在同一插件生命周期内装配路由和回收等待，但实际浏览器送达受权限与运行环境约束。

> **主要限制**：[Q03](#research-q03) 启用长期记忆可把一轮双向文字传给所设服务，语音与天气还有各自的出站链。[Q04](#research-q04) 隐藏界面后的后台状态须以功能开关和实际网络核对。

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
  - [Q01 · 拉回用户时能找到哪个会话？](#detail-section-11)
  - [Q02 · 安装后会注册什么，卸载和断连释放什么？](#detail-section-12)
  - [Q03 · 可选聊天、长期记忆、语音和天气发送哪些数据？](#detail-section-13)
  - [Q04 · 待办与周期任务如何影响持续成本和撤出？](#detail-section-14)
  - [Q05 · 如何检验通知改善了回查？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在 DSH Web 发起会遇到审批的长任务、随后切去做别的事的人。接到提醒后可检查审批来自哪条会话，并在原页面核对决策。

[Q01](#research-q01) 原生列表和原会话仍是审批及结果的验收入口。相对手工回看或原生提醒，插件的可核查增量是把带会话来源的通知送到浏览器系统表面，并提供返回动作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话提醒 | 后台审批时提醒并尝试回到会话 | 受权限、事件和导航依赖限制 |
| 待办和界面 | 条件提醒、配置与交互 | 无监听、宠物睡眠或不可展示会影响本次提醒 |
| 语音和长期记忆 | 定向增强闲聊 | 按提供方及端点产生独立外部请求 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 可装载所声明 Web 客户端和注入的 DSH、Node >=22.12.0 | 组件启动 | 提供宿主与页面环境 | 以实际宿主和发行包核对 |
| 浏览器系统通知权限与会话导航 | 代表性试用 | 接收弹窗并回到会话 | 缺授权时无弹窗，缺导航时可能只聚焦 |
| 模型、记忆地址、语音凭据 | 对应功能按需 | 生成对话、召回或识别与合成 | 试用提醒时单独关闭或检查，不以配置声明当有效 |
| 页面或可消费状态的监听 | 计划提醒按需 | 消费待办提醒 | 无监听时本次不标已提醒 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在独立 profile 固定包和宿主，审查开关和权限 | 清楚区分提醒与外部能力 |
| 触发 | 用户发起一个可控审批事件后切到别处 | 权限满足时收到对应提醒 |
| 验收 | 点击回到会话，对照真实审批并观察请求 | 误跳或旁路请求则退回原生视图 |
| 退出 | 从 profile 解除挂载并核对未结束工作和数据 | 检查命令、路由、进程及额外服务记录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主、包和浏览器资源，量未知 | 核查兼容环境、权限及数据流开关 | 版本兼容仍待证 |
| 持续使用 | 媒体、轮询、可选模型与服务费用未知 | 留意误报、清理待办、核对模型及凭据 | 合格通知任务的净时间未知 |
| 失败恢复 | 重试与额外模型费用未知 | 查权限、事件归属及外部服务 | 仅凭弹窗无法确认任务结束 |
| 退出 | 本地状态与远端记录占用未知 | 分开卸载、清理留存与核查在途操作 | 未查实际恢复用时 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 通知回查 | 条件通知、会话来源及跳转入口 | 系统后台的送达率与正确回跳率 |
| 待办提醒 | 选到期项和发声宠物，写入气泡与标记 | 暂无监听时的实际恢复体验 |
| 按需扩展 | 有记忆、模型与语音的独立调用条件 | 服务时延、成本及端到端收益 |

> **思考**：[Q03](#research-q03) 启用长期记忆可把一轮双向文字传给所设服务，语音与天气还有各自的出站链。[Q04](#research-q04) 隐藏界面后的后台状态须以功能开关和实际网络核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将审批事件、系统通知与回到原会话的操作接起来。[Q02](#research-q02) 在同一插件生命周期内装配路由和回收等待，但实际浏览器送达受权限与运行环境约束。

[Q02](#research-q02) 路由作用域传递中止信号，卸载后回收等待与 Helper。配置队列约束同进程路径。[Q03](#research-q03) 召回有超时降级，历史写入后异步捕获，网络交付与本地显示有独立状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 启用长期记忆可把一轮双向文字传给所设服务，语音与天气还有各自的出站链。[Q04](#research-q04) 隐藏界面后的后台状态须以功能开关和实际网络核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 对已有兼容 DSH Web 的用户，可在临时 profile 以一个无敏感内容的审批事件试用。先查相关开关与浏览器权限，再检查弹窗、点击和实际原会话，并观察是否出现预期之外的请求。若任一关键条件失败，解除挂载并回到原生会话。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 DSH 宿主和 Web 接入、条件通知、异步长期记忆和可选外部能力。真实送达、兼容性、供应商与实际收益待验证。

- 已检查：作者 README、包清单、源码路径 dsh-pet/src/host/plugin/session-watch.ts、dsh-pet/src/client/app.ts、dsh-pet/src/client/notify.ts、dsh-pet/package.json、dsh-pet/cordis.patch.yml、dsh-pet/tsdown.config.mjs、dsh-pet/src/host/index.ts、dsh-pet/src/host/plugin/http-route.ts、dsh-pet/src/host/plugin/lifecycle.ts、dsh-pet/src/host/plugin/chat-memory.ts、dsh-pet/src/host/memory/powercontext.ts、dsh-pet/src/host/uapi.ts、dsh-pet/src/host/voice/builtin-deepseek-asr.ts、dsh-pet/src/host/plugin/todo-reminders.ts、dsh-pet/src/host/plugin/loops.ts 及固定范围 inventory；组件：dsh-pet。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定子包的 DSH Web 通知、路由和相关出站链，覆盖新增待办、Weather、PowerContext 和 ASR 的入口及限制。未运行目标或安装成品，独立桌面实际运行、语音效果和远端实现留在范围外。
- 下一步：[Q05](#research-q05) 用两条可控审批会话分别试原生和插件，在限定权限下记录系统显示、回跳、误报和请求。启用每项附加能力时独立重测。

**分析版本**

- **仓库**：[PC2005-cloud/dsh-pet](https://github.com/PC2005-cloud/dsh-pet)
- **版本号**：0.4.9（[固定提交 ef174be](https://github.com/PC2005-cloud/dsh-pet/tree/ef174beecc79df76baf9ca06ed152237bbb96875)）
- **版本日期**：2026-11-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在两条已知事件的会话中对照原生视图和系统通知。若缩短正确返回会话的延迟，同时控制误报和请求数，才支持该场景下的常驻提醒。

[Q05](#research-q05) 用两条可控审批会话分别试原生和插件，在限定权限下记录系统显示、回跳、误报和请求。启用每项附加能力时独立重测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 34 | 6781 | 4856 | 1759 | — |
| .md | source | 1 | 7 | — | — | 65 |
| .mjs | source | 14 | 1049 | 712 | 276 | — |
| .mjs | test | 6 | 913 | 826 | 52 | — |
| .md | test | 1 | 15 | — | — | 183 |
| .js | test | 1 | 17 | 16 | 0 | — |
| .ts | test | 228 | 39108 | 32234 | 3287 | — |
| .ts | source | 418 | 52520 | 35414 | 13864 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 174](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=174&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 170](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=170&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：只启用 DSH Web 宠物的提醒，用户能否在离开页面后回到需要处理的会话？启用其他功能会增加哪些资源、数据边界和退出成本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 拉回用户时能找到哪个会话？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适用于在 DSH Web 发起一个需要审批或交互的任务、随后去做其他事的用户。用户希望收到提醒后能回到正确会话，在原有界面核对审批内容和结果。原办法是定期开原生会话列表或依赖原生提醒；插件提供浏览器系统通知及从会话事件携带的会话标识，浏览器及工作区支持时可以减少一次再定位。现有宿主是否已经提供同等可靠的通知路径仍待对照。

宿主 session/event 分支先以会话来源排除委派与子代理，再为审批等事件产生带会话标识的帧。完成类事件延迟判断活动，避免主回合结束时误报还有成员工作的团队。额外 agent/error 事件没有会话归属，无法从通知明确跳回哪条会话。客户端从 /state 变化转给通知入口，根据总开关、页面聚焦和系统权限决定展示。点击若有会话标识则尝试工作区定位，缺服务或跳转抛错仍会尝试聚焦窗口，无法保证焦点或会话已恢复。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/host/plugin/session-watch.ts:261-311](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/plugin/session-watch.ts#L261-L311)

过滤分支、延迟完成、帧来源及监听清理。

<details>
<summary>查看原文（51行）</summary>

```text
  // 系统通知：监听 DSH 宿主事件生成通知帧入队，浏览器轮询 /state 读到后弹 toast（帧契约与
  // shared/notify.ts 一致）。事件源：turn/end、approval/asked、tool/call（ask_user_question）、
  // agent/error。两道门：会话门（子代理/委派不发）+ 活动门（只拦「对话完成」，延迟确认没活了再弹）。
  // 纯监听不调用模型；通知是网页端能力，桌面模式不消费。
  ctx.effect(() => {
    const sessionDispose = ctx.on(
      'session/event',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- session/event 载荷无公开类型，any 只用于接收，函数内立刻交给 shouldNotifySession / reduceNotifyFrame 推导
      (session: any, event: any) => {
        // 会话门（issue #82）：子代理 / 委派会话不发通知——你等的是父对话，不是某一路子代理跑完。
        // 判据用 header.origin（不是 parentSession，那会把普通 fork 的主对话一起静音），
        // 判据不可用时放行，绝不把通知整体打哑。详见 notify-events.ts 的 shouldNotifySession。
        if (!shouldNotifySession(session)) return;
        // 回复正文来源：只记最近一段 assistant 文本，供完成通知的正文使用。取不到就不记，
        // 下游回落空正文（宁可少一行字，也不能让通知整体失效）。
        if (event?.type === 'assistant/message') {
          const text = lastAssistantText(event as { type?: string; data?: Record<string, unknown> });
          if (text) lastReplyText.set(sessionIdOf(session), text);
        }
        // 活动门（issue #114）：「对话完成」延迟确认这条会话确实没活了再弹——团队会话里 Lead 的
        // 这一轮结束 ≠ 团队收工，成员还在跑时弹「对话完成」是误报。生成失败/输出截断、权限申请、
        // 用户选择不过这道门，直接放行（理由见 notify-events.ts 的 isCompletionTurnEnd）。
        if (isCompletionTurnEnd(event)) {
          scheduleCompletionNotify(sessionIdOf(session), event);
          return;
        }
        // 非完成收尾（出错 / 输出截断 / 中止）用不到这段正文，一并清掉，免得留到下一次完成。
        if (event?.type === 'turn/end') lastReplyText.delete(sessionIdOf(session));
        const frame = reduceNotifyFrame(event as Parameters<typeof reduceNotifyFrame>[0]);
        // 帧带上「这条通知是哪条会话发出的」：点击时网页据此跳到那条会话（见 withSessionId）
        if (frame) pushNotifyFrame(withSessionId(frame, sessionIdOf(session)));
      },
    );
    // agent/error（agent-loop dispatch.emit）：无回合位置的生成失败；0.1.5 新增，
    // 低版本 DSH 无此事件 = 少一条通知（turn/end error 分支已覆盖大部分失败场景），不报错。
    // 两道门都管不到它：载荷只有 { turn, step, error }，不带会话标识，无从判定来源。
    const errorDispose = ctx.on(
      'agent/error',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- agent/error 载荷无公开类型，且低版本 DSH 可能不带 error 字段，只能 any 后按可选链取 payload?.error
      (payload: any) => {
        pushNotifyFrame(agentErrorFrame(payload?.error));
      },
    );
    return () => {
      // 卸载时清掉待查的定时器：否则插件已卸载，到点还去写一次 S
      for (const t of notifyActivityTimers.values()) clearTimeout(t);
      notifyActivityTimers.clear();
      sessionDispose();
      errorDispose();
    };
  }, 'dsh-pet: notify frames');
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/client/app.ts:100-116](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/client/app.ts#L100-L116)

客户端注册实际通知与会话跳转入口。

<details>
<summary>查看原文（17行）</summary>

```text
      // 系统通知：host 把通知帧写进 /state 的 sections.notify，统一轮询发现变化后弹 toast。
      ctx.effect(
        () =>
          initNotify({
            // 惰性取服务：它可能晚于本插件注册；缺失时退化为只把窗口叫回前台。
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- DSH 注入服务无静态类型
            openSession: (sessionId: string) => (ctx as any).get?.('uiWorkspace')?.openSession?.(sessionId),
            // 通知标题用会话名：会话列表里那一行的 title；空白会话 / 未命名会话取到空串就返回 undefined。
            sessionTitle: (sessionId: string) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any -- DSH 注入服务无静态类型
              const row = (ctx as any).get?.('sessions')?.list?.getSnapshot?.()?.byId?.[sessionId];
              const name = typeof row?.title === 'string' ? row.title.trim() : '';
              return name || undefined;
            },
          }),
        'dsh-pet: notifications',
      );
```

</details>

**依据 3 · 源码核查**：[dsh-pet/src/client/notify.ts:121-153](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/client/notify.ts#L121-L153)

跳转、窗口回焦与通知权限。

<details>
<summary>查看原文（33行）</summary>

```text
export function jumpToSession(sessionId?: string): void {
  if (sessionId !== undefined) {
    // 跳转失败（会话已删 / 旧版没有该服务）绝不能连累「把窗口叫回来」那条腿。
    try {
      sessionNavigator?.openSession(sessionId);
    } catch {
      /* 不跳会话而已，继续叫窗口。 */
    }
  }
  window.focus();
  if (!/electron/i.test(navigator.userAgent)) return;
  const frame = document.createElement('iframe');
  frame.style.display = 'none';
  frame.src = 'dsh://open';
  document.body.append(frame);
  setTimeout(() => frame.remove(), 1000);
}

/** 点通知：收起弹窗并跳到它指的那条会话（跳转细化见 {@link jumpToSession}）。 */
export function wireNotificationClick(n: Notification, sessionId?: string): void {
  n.onclick = () => {
    n.close();
    jumpToSession(sessionId);
  };
}

/** 发一条系统通知；总开关关闭、环境不支持、未授权或本页正在看时静默跳过。
 * 日志只在门之后记录：被拦下的触发不产生「弹窗」日志。 */
function toast(title: string, body?: string, icon?: string, sessionId?: string): void {
  if (!notifyEnabled) return;
  // 开关关着时维持「聚焦不打扰」；打开后照常弹，不再看页面是否活跃。
  if (!shouldRemind(notifyWhenFocused, isPageActive())) return;
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/client/notify.ts:224-245](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/client/notify.ts#L224-L245)

轮询变化进入通知，初始化读取用户开关。

<details>
<summary>查看原文（22行）</summary>

```text
/** 一帧通知 → toast；由容器统一轮询 `/state` 发现 `sections.notify` 变化后调用。 */
export function notifyFromFrame(frame: unknown): void {
  toastFrame(frame as NotifyFrame);
}

/**
 * 初始化通知引擎：记住会话跳转器、读总开关、兜底申请权限并跟踪页面聚焦；不做轮询。
 * @param navigator - 会话跳转与命名服务；不传时点击只叫窗口、标题回落固定文案。
 * @returns 释放函数，摘掉聚焦监听。
 */
export function initNotify(navigator?: SessionNavigator): () => void {
  sessionNavigator = navigator;
  // 总开关读成品配置（拉取失败不阻塞，默认开启）；之后由设置页保存后 reloadNotifications 重读。
  void readNotifySettings().then((settings) => {
    notifyEnabled = settings.enabled;
    notifyWhenFocused = settings.whenFocused;
    if (typeof Notification !== 'undefined' && settings.enabled && Notification.permission === 'default') {
      // 兜底申请；无手势时浏览器可能压制，真正的申请在设置页开关或按钮点击处。
      void requestNotificationPermission();
    }
  });
  return initFocusTracking();
```

</details>

#### 缺口

- 无后台休眠和实际通知结果。
  **影响**：未知送达以及优于原生到何种程度。
  **进一步探讨**：在普通浏览器录制审批事件、系统通知和跳转。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装后会注册什么，卸载和断连释放什么？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

Cordis 补丁插入 dsh-pet，包导出的宿主与浏览器入口分别指向 lib/index.js 和 lib/client.js。两路构建直接取宿主与客户端源码，浏览器包用闭包隔离重复加载的顶层声明，宿主为 ESM。独立桌宠 CLI 是另一个构建入口。DSH Web 侧在所需的宿主服务上装配业务状态、命令和监听，浏览器模块在 overlay 插槽注册组件并绑定通知。Node 最低版本来自组件清单，三个 DSH 兼容声明是作者的特定版本判断。

前缀路由将页面请求分派到状态、配置和聊天等处理器。客户端提前断开时路由触发 AbortController，将中止传给处理器并避免继续写回响应。配置请求的串行队列只管进入同一宿主进程的竞争，外部编辑仍须独立协调。卸载 effect 会清理工作状态与下载计时、持锁、播放回执、状态等候和 Helper，并由各个 effect 移除通知监听。已经交给模型或第三方的工作需要各自的撤销或超时凭证。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/package.json:43-74](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/package.json#L43-L74)

包导出与产物范围。

<details>
<summary>查看原文（32行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "bin": {
    "dsh-pet-standalone": "lib/standalone.js"
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src",
    "assets/webm",
    "runtime/electron-helper",
    "assets/fonts",
    "assets/pic",
    "assets/memes",
    "assets/sound",
    "assets/config.jsonc",
    "assets/logo.png",
    "assets/main-character.png",
    "scripts/ensure-electron.mjs",
    "cordis.patch.yml"
```

</details>

**依据 2 · 源码核查**：[dsh-pet/package.json:101-143](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/package.json#L101-L143)

Node 版本、Web 平台及兼容性声明。

<details>
<summary>查看原文（43行）</summary>

```text
  "license": "MIT",
  "engines": {
    "node": ">=22.12.0"
  },
  "dependencies": {
    "@andresaya/edge-tts": "^1.9.1",
    "@anthropic-ai/sdk": "0.135.0",
    "@electron-internal/extract-zip": "^1.0.5",
    "@electron/get": "^5.1.0",
    "openai": "7.39.0",
    "zod": "4.6.7"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "compatibility": {
      "dshReleases": {
        "0.2.1-rc.3": "compatible",
        "0.2.2-alpha.2": "compatible",
        "0.2.2-rc.1": "compatible"
      }
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection"
      ],
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-agent-default-model": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-connection": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-slots": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-commands": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-credentials": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-home-paths": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-host-webserver": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": "^0.2.0-rc.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
```

</details>

**依据 3 · 源码核查**：[dsh-pet/cordis.patch.yml:23-25](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/cordis.patch.yml#L23-L25)

实际 Cordis 挂载。

```text
- insert:
    - id: dsh-pet
      name: 'dsh-pet'             # 模块名：解析到 lib/index.js
```

**依据 4 · 源码核查**：[dsh-pet/tsdown.config.mjs:36-77](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/tsdown.config.mjs#L36-L77)

宿主、客户端和独立入口分支。

<details>
<summary>查看原文（42行）</summary>

```text
export default defineConfig([
  {
    ...shared,
    entry: {
      client: 'src/client/index.ts',
    },
    external: [/^@deepseek-ai\//, /^@electron\//, /^node:/],
    // 浏览器半侧必须能被**重复执行**：DSH 把 lib/client.js 当经典脚本加载，而 bundle
    // 重建后（HMR 换 rev）或 combo 请求重试时，同一个文件会在同一页面里再执行一次。
    // 经典脚本的顶层 const/let/function 落在页面的全局词法作用域，第二次解析直接
    // SyntaxError（Identifier 'PET_DISPLAYS' has already been declared），entry 激活
    // 失败 → 桌宠 overlay 与设置页插槽都不注册，只能刷新才恢复。因此整份产物包一层
    // IIFE，让所有模块体声明留在函数作用域内；前导 ';' 抵消 combo 拼接（多个插件
    // bundle 连成一个脚本）时的 ASI 歧义。
    outputOptions: { banner: ';(()=>{', footer: '})();' },
  },
  {
    ...shared,
    // 宿主半侧保持 ESM（由 DSH 的 Loader import），绝不能包 IIFE。
    entry: {
      index: 'src/host/index.ts',
    },
    external: [/^@deepseek-ai\//, /^@electron\//, /^node:/],
  },
  {
    ...shared,
    // 独立模式只在 Node ≥ 22.12 上运行（package.json 的 engines 已声明），因此目标可以是 es2022：
    // es2020 目标会把 class field 一类语法降级成 `_defineProperty(...)`，进而把
    // `@oxc-project/runtime` 拖成一条裸 import —— 那个包不在本包依赖里，装好的用户跑起来会
    // ERR_MODULE_NOT_FOUND。提到 es2022 后这类降级辅助整体消失（与插件本体的 es2020 产物无关，
    // 两者是不同的入口，DSH 侧仍按 es2020 发布）。
    target: 'es2022',
    entry: {
      standalone: 'src/standalone/cli.ts',
    },
    // tsdown 默认把 dependencies/peerDependencies 全部外部化（本包那三个 DSH 专有包正是
    // peerDependencies），所以这里必须先 noExternal 把它们拉回打包图，下面的 alias 才轮得到生效；
    // 否则产物里留下裸 import，在没有 DSH 的环境里 ERR_MODULE_NOT_FOUND。
    noExternal: [/^@deepseek-ai\/(?:dsh-home-paths|dsh-credentials|dsh-llm)$/],
    // 除三个替身外，其余 @deepseek-ai/* 仍视为宿主提供（负向断言）
    external: [/^@electron\//, /^node:/, /^@deepseek-ai\/(?!dsh-home-paths$|dsh-credentials$|dsh-llm$)/],
    alias: {
```

</details>

**依据 5 · 源码核查**：[dsh-pet/src/host/index.ts:201-246](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/index.ts#L201-L246)

实际注册路由、会话监听、命令和周期任务。

<details>
<summary>查看原文（46行）</summary>

```text
        const provider = readAllConfig(configPaths).main?.speechProvider;
        return typeof provider === 'string' && provider ? provider : undefined;
      },
    }),
    // 长期记忆实现目录：设置页据此渲染下拉，配置项 memoryProvider 的取值就来自它
    memory: { list: listChatMemoryProviders },
  };
  const httpRoute = createHttpRoute(deps);
  registerHttpRoute(ctx, httpRoute.handlePetRoute);

  registerSessionWatch({
    ctx,
    cancelTerminalCleanup,
    lastTodoText,
    lastReplyText,
    notifyActivityTimers,
    publishWorkStatus,
    pushNotifyFrame,
    scheduleCompletionNotify,
    scheduleTerminalCleanup,
    terminalTimers,
    toolsInFlight,
    turnFlags,
    workStatus,
  });

  registerBalanceCommand({ ctx, effectivePetList, refreshBalance, sleep, sleepRefusalText });

  registerLoops({
    ctx,
    balancePeriodSec,
    configPaths,
    lastWhisperAt,
    lock,
    log,
    publishWhisper,
    publishSleepTalk,
    refreshBalance,
    sleep,
    standaloneAiPolicy,
    whisperPeriodSec,
  });

  registerPetCommand({ ctx, effectivePetList, petDisplayName, resolveActivePetId, setActivePetId });

  registerChatCommand({ ctx, chatWithPet, log, publishWhisper, resolveActivePetId, sleep, sleepRefusalText });
```

</details>

**依据 6 · 源码核查**：[dsh-pet/src/host/plugin/http-route.ts:34-58](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/plugin/http-route.ts#L34-L58)

配置写操作在同进程队列内排序。

<details>
<summary>查看原文（25行）</summary>

```text
  /** 单次业务路由（HTTP 落盘与桌面 Helper 管道共用同一份实现）：输入 rawUrl + method + body 文本，
   *  返回 RouteResult，消费方各自落盘——业务逻辑只有一份，两端天然一致。
   *  signal 可选：调用方断开时中止挂起等待（只有 /playback 的 wait 分支会用到；管道侧不传）。 */
  const handlePetRoute = async (
    rawUrl: string,
    method: string,
    body?: string,
    signal?: AbortSignal,
  ): Promise<RouteResult> => {
    const url = new URL(rawUrl, 'http://localhost');
    const rest = decodeURIComponent(url.pathname.slice(ROUTE_SEGMENT.length + 1));
    const run = (): Promise<RouteResult> => dispatchPetRoute(url, rest, method, body, signal);
    // 写配置的三条路径（PUT/POST /config、POST /pet-display、POST /pet-config）都是「读当前配置
    // → 白名单重建整段 pets → 写盘」，并发交错会互相覆盖，必须共用一条串行队列；
    // GET /config 同样排队，避免写入尚未完成时读到空文件而回退内置默认。
    const isConfigQueue = rest === 'config' || ((rest === 'pet-display' || rest === 'pet-config') && method === 'POST');
    if (isConfigQueue) {
      const pending = configQueue.then(run, run);
      configQueue = pending.then(
        () => undefined,
        () => undefined,
      );
      return pending;
    }
    return run();
```

</details>

**依据 7 · 源码核查**：[dsh-pet/src/host/plugin/http-route.ts:72-99](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/plugin/http-route.ts#L72-L99)

前缀路由及断连中止。

<details>
<summary>查看原文（28行）</summary>

```text
export function registerHttpRoute(ctx: HostContext, handlePetRoute: HttpRouteHandler): void {
  ctx.effect(
    () =>
      ctx.webServer.register({
        kind: 'prefix',
        path: ROUTE_SEGMENT,
        handler: async (req: IncomingMessage, res: ServerResponse) => {
          // 挂起等待（/playback?wait=）期间调用方可能提前断开：据此中止等待，
          // 否则那个等待者要一直留到超时才回收。'close' 在正常应答后也会触发，但那时监听已摘掉。
          const abort = new AbortController();
          const onClose = (): void => abort.abort();
          res.on('close', onClose);
          try {
            // PATCH 也带体（待办的部分更新）；GET / DELETE 不读，避免无谓地等一个不会来的结束事件。
            const readsBody = req.method === 'PUT' || req.method === 'POST' || req.method === 'PATCH';
            const body = readsBody ? await readBody(req) : undefined;
            const result = await handlePetRoute(req.url ?? '/', req.method ?? 'GET', body, abort.signal);
            res.off('close', onClose);
            if (result.kind === 'json') sendJson(res, result.status, result.obj, result.headers);
            else if (result.kind === 'text') sendText(res, result.status, result.body);
            else if (result.kind === 'none') {
              /* 调用方已断开：不再写（写了会抛） */
            } else sendFile(req, res, result.file, result.contentType); // 非 async：流在 open 后自己 pipe，错误内部收口
          } catch (e) {
            res.off('close', onClose);
            // 连接已断（挂起等待被中止后也可能撞上）→ 不再写，避免二次抛错
            if (!res.destroyed && !res.writableEnded) {
              // 请求体超限与客户端中断是用户侧问题，不能报成 500；断连时连响应都写不出去。
```

</details>

**依据 8 · 源码核查**：[dsh-pet/src/host/plugin/lifecycle.ts:27-43](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/plugin/lifecycle.ts#L27-L43)

effect 内停止计时、清理状态与 Helper。

<details>
<summary>查看原文（17行）</summary>

```text
export function registerLifecycle(deps: LifecycleInput): void {
  const { ctx, lock, markDisposed, playback, state, stopDownloadSlotTimer, stopHelper, stopWorkStatusFlush } = deps;
  // 随插件生命周期清理：桌面 Helper 回收（异步下载完成后不再拉起）+ 结束所有挂起的等待
  // （回执与 /state 长轮询不结束的话，插件重载会留下一批悬挂响应，各自要等到超时才收尾）。
  ctx.effect(() => () => {
    markDisposed();
    // 工作状态的补写定时器：卸载后它到点已经没有意义（叶子连同长轮询一起收尾），清掉免得挂着
    stopWorkStatusFlush();
    // 下载日志的「清槽」定时器：同上，卸载后它到点已经没有意义
    stopDownloadSlotTimer();
    // 占用锁：卸载时把锁全撤掉并写一次叶子——不写的话渲染端要等 TTL 到点才解除静止
    // （写叶子必须在 state.cancelAll() 之前：那之后挂起的等待者已经收尾了）。
    lock.releaseAll();
    playback.cancelAll();
    state.cancelAll();
    stopHelper('dsh-host-stop');
  });
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 可选聊天、长期记忆、语音和天气发送哪些数据？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、功能与机制

#### 完整回答

闲聊读取环境及本地上下文，然后从宠物配置选记忆实现，未注册时回落内置。核心准备系统消息、历史和当前输入，给已选 provider 一次召回机会。超时、错误或无合法请求体时用本地准备的正文继续。生成优先用配置的 chatModel，失败时可转当前对话模型再次尝试。回话写入本地历史后，异步 capture 可将本轮用户文字与宠物回复交给同一 provider；生成期间清除本地历史会跳过此次写回和 capture。已经送出的服务端条目需单独检查。

内置 PowerContext 适配从配置读服务地址和令牌，对相应宠物的 scope 做查找或创建。召回可用最近若干轮改写检索词，随后发送检索请求并把结果前置于用户正文；捕获端把用户和宠物的双向文本 POST 到 /v1/sources/content。记忆端点空缺或响应不可用时有回落。环境查询与聊天结合，天气路径可向 UAPI 传用户所设城市。DeepSeek 语音识别在选择该实现并执行时将 WAV 与凭据发到 ASR，缺凭据回不可用；合成由另一条按配置选择的实现处理。审批事件到通知帧的监听本身无需模型调用。试用者应为附加功能分别核对发送条件。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/host/plugin/chat-memory.ts:182-222](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/plugin/chat-memory.ts#L182-L222)

召回复盖超时与非法形状，捕获独立异步。

<details>
<summary>查看原文（41行）</summary>

```text
  const recallChat = async (provider: ChatMemoryProvider, req: RecallRequest): Promise<ChatRequest | undefined> => {
    const recall = provider.recall;
    if (!recall) return undefined;
    // 竞速而不是只传 signal：provider 可以忽略 signal，核心不能因此挂住。
    const signal = AbortSignal.timeout(provider.timeoutMs ?? DEFAULT_MEMORY_TIMEOUT_MS);
    const deadline = new Promise<undefined>((resolve) => {
      signal.addEventListener('abort', () => resolve(undefined), { once: true });
    });
    try {
      const result = await Promise.race([Promise.resolve(recall.call(provider, req, signal)), deadline]);
      if (result === undefined) return undefined;
      if (!isChatRequest(result)) {
        log.warn('[dsh-pet] 记忆召回返回非法请求体 id=' + provider.id);
        return undefined;
      }
      return result;
    } catch (error) {
      log.warn(
        '[dsh-pet] 记忆召回失败 id=' + provider.id + '：' + (error instanceof Error ? error.message : String(error)),
      );
      return undefined;
    }
  };

  /**
   * 落盘后接收这一轮问答：核心不等待，失败只记实现 id 与原因。
   *
   * @param provider - 本轮生效的实现；与召回同一个，避免写到别处。
   * @param turn - 本轮问答与元信息；action/image 只是名字，不含素材本体。
   */
  const captureTurn = (provider: ChatMemoryProvider, turn: CaptureTurn): void => {
    const capture = provider.capture;
    if (!capture) return;
    void Promise.resolve()
      .then(() => capture.call(provider, turn))
      .catch((error) => {
        log.warn(
          '[dsh-pet] 记忆接收失败 id=' + provider.id + '：' + (error instanceof Error ? error.message : String(error)),
        );
      });
  };
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/plugin/chat-memory.ts:408-505](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/plugin/chat-memory.ts#L408-L505)

读环境，按配置选 provider，形成历史与输入并在成功写入后 capture。

<details>
<summary>查看原文（98行）</summary>

```text
  const chatWithPet = async (
    petId: string,
    text: string,
    image?: PetImageRef,
  ): Promise<
    | { ok: true; text: string; image?: string }
    | { ok: false; reason: 'provider-missing' | 'generate-error' | 'unknown-pet'; message?: string }
  > => {
    // 环境（城市 + 天气）在锁外查：它是网络往返。
    const env = await currentEnvironment();
    const epochAtStart = deletedEpoch.get(petId) ?? 0;
    // 读上下文只占一次短锁：召回与模型调用都在锁外。
    const context = await withMemoryLock(() => readContext(petId, env));
    if (context === null) return { ok: false, reason: 'unknown-pet', message: '没有这只桌宠：' + petId };
    const { cfg, found, pool, actions, list, system } = context;
    // 记忆实现：配置里的 id 决定用谁；未注册的 id 在解析时就回落内置，这里补一条日志说明。
    const memoryConf = found.conf.memory;
    const configuredId = String(
      memoryConf && typeof memoryConf === 'object' ? ((memoryConf as Record<string, unknown>).provider ?? '') : '',
    ).trim();
    const provider = resolveChatMemoryProvider(configuredId);
    if (configuredId !== '' && configuredId !== provider.id) {
      log.warn('[dsh-pet] 记忆 provider 未注册：' + configuredId + '，本轮用 ' + provider.id);
    }
    // 图片只记尺寸与字节数（不记 base64）：模型不支持读图时 dsh-llm 会把它投影成占位文本，靠这行日志定位
    if (image !== undefined) {
      log.info(
        `[dsh-pet] 对话附带图片 pet=${petId}，${image.width}x${image.height}，${image.bytes} 字节` +
          '（模型不支持读图时内核会以占位文本代替）',
      );
    }
    // 记忆：核心先拼一份完整请求体，provider 可整份替换，也可原样交回。
    const prepared: ChatRequest = {
      system,
      history: list.map(({ role, content, ts }) => ({ role, content, ts })),
      userText: text,
    };
    const festival = festivalOf(new Date());
    const body =
      (await recallChat(provider, {
        petId,
        userText: text,
        prepared,
        raw: {
          persona: petPersona(found.conf, found.pet),
          now: Date.now(),
          env,
          ...(festival === '' ? {} : { festival }),
          memes: pool,
          actions,
          pet: {
            id: String(found.pet.id ?? petId),
            name: String(found.pet.name ?? ''),
            entry: found.entry,
            display: String(found.pet.display ?? ''),
          },
        },
      })) ?? prepared;
    // 模型：条目配置的 chatModel 优先（留空 = 不指定）；生成侧失败会回落到当前对话的模型重试一次
    const generated = await generateChat({
      ctx,
      system: body.system,
      history: body.history,
      userText: body.userText,
      pool,
      actions,
      preferred: configuredModel(found.conf, 'chatModel'),
      image,
    });
    if (!generated.ok) return generated;
    const now = Date.now();
    // 写回再读一次拿最新内容，占一次短锁；生成期间历史被删过（代数变了）就整轮丢弃。
    const persisted = await writeTurn({
      petId,
      entryKey: found.entry,
      text,
      reply: {
        text: generated.text,
        ...(generated.image !== undefined ? { image: generated.image } : {}),
        ...(generated.action !== undefined ? { action: generated.action } : {}),
      },
      ...(image === undefined ? {} : { image }),
      ts: now,
      epochAtStart,
    });
    if (persisted) {
      // 第三方记忆：落盘后异步接收；不等待、失败只记日志，不能影响这一轮回复。
      captureTurn(provider, {
        petId,
        userText: text,
        replyText: generated.text,
        ts: now,
        ...(generated.action !== undefined ? { action: generated.action } : {}),
        ...(generated.image !== undefined ? { image: generated.image } : {}),
      });
    } else {
      // 用户在生成期间删了历史：本轮不落盘、不通知第三方，回复照常返回。
      log.info('[dsh-pet] 生成期间历史被删除，跳过写回与接收 pet=' + petId);
```

</details>

**依据 3 · 源码核查**：[dsh-pet/src/host/memory/powercontext.ts:93-160](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/memory/powercontext.ts#L93-L160)

按宠物找容器、检索、写双向文本及标识。

<details>
<summary>查看原文（68行）</summary>

```text
    const title = scopeTitleOf(petId);
    const page = await callApi(deps, {
      method: 'GET',
      path: '/v1/scopes?query=' + encodeURIComponent(title) + '&query_field=title&limit=50',
      timeoutMs: CRUD_TIMEOUT_MS,
    });
    const items = (page as { items?: unknown } | undefined)?.items;
    if (!Array.isArray(items)) return undefined;
    // 服务端的 query 是模糊匹配，可能连 "dsh-pet:pet-20" 一起返回，所以按标题精确比对
    const found = items.find((item) => (item as { title?: unknown }).title === title);
    const known = (found as { scope_id?: unknown } | undefined)?.scope_id;
    if (typeof known === 'string' && known !== '') {
      scopes.set(cacheKey, known);
      return known;
    }
    const created = await callApi(deps, {
      method: 'POST',
      path: '/v1/scopes',
      body: {
        title,
        summary: scopeSummaryOf(petId),
        idempotency_key: scopeKeyOf(petId),
      },
      timeoutMs: CRUD_TIMEOUT_MS,
    });
    const id = (created as { scope_id?: unknown } | undefined)?.scope_id;
    if (typeof id !== 'string' || id === '') return undefined;
    scopes.set(cacheKey, id);
    return id;
  };

  /** 查询串：改写优先（带最近两轮还原指代），没有就用原话；按字节截断，服务端限 8192。 */
  const buildQuery = async (req: RecallRequest): Promise<string> => {
    const rewritten = await rewriteWithin(deps.rewrite, {
      userText: req.userText,
      history: req.prepared.history.slice(-REWRITE_HISTORY_ROUNDS * 2),
    });
    return truncateBytes(rewritten ?? req.userText, QUERY_BYTES);
  };

  const recall = async (req: RecallRequest): Promise<ChatRequest | undefined> => {
    const scopeId = await ensureScope(req.petId);
    if (scopeId === undefined) return undefined;
    const query = await buildQuery(req);
    if (query === '') return undefined;
    const hits = await search(deps, scopeId, query);
    if (hits === undefined || hits.length === 0) return undefined;
    const evidence = formatEvidence(hits);
    if (evidence === '') return undefined;
    return { ...req.prepared, userText: evidence + '\n\n' + req.prepared.userText };
  };

  const capture = async (turn: CaptureTurn): Promise<void> => {
    const scopeId = await ensureScope(turn.petId);
    if (scopeId === undefined) return;
    // 写的是 CaptureContentSourceRequest（202 受理，抽取在服务端后台跑）：
    // source_id 由宠物与轮次时间戳推出来，同一轮重试不会在服务端留下两条证据。
    // 注意不能走 /v1/scopes/{id}/sources——那条路收的是 CreateSourceRequest，不认 scope_id 与 source_id。
    await callApi(deps, {
      method: 'POST',
      path: '/v1/sources/content',
      body: {
        scope_id: scopeId,
        source_id: 'dsh-pet:' + turn.petId + ':' + turn.ts,
        content: '用户：' + turn.userText + '\n宠物：' + turn.replyText,
        metadata: { petId: turn.petId },
      },
      timeoutMs: CRUD_TIMEOUT_MS,
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/host/memory/powercontext.ts:206-230](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/memory/powercontext.ts#L206-L230)

实发请求、Bearer、JSON 与超时拒绝。

<details>
<summary>查看原文（25行）</summary>

```text
async function callApi(deps: PowerContextDeps, call: ApiCall): Promise<unknown> {
  const base = deps.endpoint().trim().replace(/\/+$/, '');
  if (base === '') return undefined;
  const token = deps.token().trim();
  try {
    const response = await fetch(base + call.path, {
      method: call.method,
      headers: {
        'content-type': 'application/json',
        ...(token === '' ? {} : { authorization: 'Bearer ' + token }),
      },
      ...(call.body === undefined ? {} : { body: JSON.stringify(call.body) }),
      signal: AbortSignal.timeout(call.timeoutMs),
    });
    if (!response.ok) {
      defaultLog(
        'warn',
        'dsh-pet: PowerContext ' + call.method + ' ' + call.path.split('?')[0] + ' 返回 HTTP ' + response.status,
      );
      return undefined;
    }
    return await response.json();
  } catch {
    return undefined;
  }
```

</details>

**依据 5 · 源码核查**：[dsh-pet/src/host/index.ts:90-98](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/index.ts#L90-L98)

城市来源与聊天服务实际接线。

```text
  // 天气城市覆盖：配置里写了就按它查，不再由 IP 归属地库决定。
  // 只注入这一次——/environment 路由与 system 时间行调的是同一个 currentEnvironment，
  // 各自再去读配置就会出现「气泡说扬州、碎碎念说南京」。
  setCityProvider(() => {
    const city = readAllConfig(configPaths).main?.environmentCity;
    return typeof city === 'string' && city.trim() !== '' ? city.trim() : undefined;
  });
  const chatMemory = createChatMemory({ ctx, configPaths, log, memeDirsFor, playback, state, userRoot });
  const { lastWhisperAt, publishWhisper, publishSleepTalk, chatWithPet, getActivePetId, setActivePetId } = chatMemory;
```

**依据 6 · 源码核查**：[dsh-pet/src/host/index.ts:119-134](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/index.ts#L119-L134)

实际安装 ASR/TTS 实现及凭据解析。

<details>
<summary>查看原文（16行）</summary>

```text
  // 内置语音实现与第三方走同一条注册路径：先登记，两个服务才解析得到各自的实现。
  // 识别那侧惰性依赖宿主服务，没装语音输入插件也能登记——调用时才回 unsupported。
  ensureEdgeProvider();
  ensureDshSpeechProvider({ speechToText: () => setup.optionalService('speechToText') });
  // DeepSeek 官方语音：鉴权复用 DSH 的 DEEPSEEK_API_KEY，与余额那条路一致；
  // 独立模式依次借「语音专用 key」和「余额选 DeepSeek 时的那把」，最后才回落 DSH 凭据
  const resolveDeepseekKey = async (): Promise<string | undefined> => {
    const dedicated = setup.standaloneDeepseekKey();
    if (dedicated) return dedicated;
    const standalone = setup.standaloneAiBalance();
    if (standalone?.provider === DEEPSEEK_OFFICIAL_PROVIDER_ID && standalone.apiKey) return standalone.apiKey;
    const resolved = await ctx.credentials.resolve(credentialRef('DEEPSEEK_API_KEY'));
    return resolved?.value;
  };
  ensureDeepseekTtsProvider({ resolveKey: resolveDeepseekKey });
  ensureDeepseekAsrProvider({ resolveKey: resolveDeepseekKey });
```

</details>

**依据 7 · 源码核查**：[dsh-pet/src/host/uapi.ts:123-149](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/uapi.ts#L123-L149)

天气请求可采用配置城市。

<details>
<summary>查看原文（27行）</summary>

```text
export async function fetchUapiWeather(deps: UapiDeps = {}): Promise<UapiEnvironment | null> {
  const now = deps.now ?? Date.now;
  if (deps.force !== true && cached !== null && now() - cached.at < CACHE_TTL_MS) return cached.value;
  if (inFlight !== null) return inFlight;
  const pending = requestUapi(deps)
    .then((value) => {
      if (value !== null) cached = { value, at: now() };
      return value;
    })
    .finally(() => {
      inFlight = null;
    });
  inFlight = pending;
  return pending;
}

/** 真正打一次上游；任何异常都折成 null。 */
async function requestUapi(deps: UapiDeps): Promise<UapiEnvironment | null> {
  // 带 city 就按城市查，不带则由上游按客户端 IP 自动定位；上游认得「扬州」这种不带「市」的写法
  const city = (deps.city ?? '').trim();
  const url = city === '' ? UAPI_URL : UAPI_URL + '&city=' + encodeURIComponent(city);
  let body: Record<string, unknown> | undefined;
  try {
    body = recordOf(await fetchJson(url, { label: 'uapis.cn', fetchImpl: deps.fetchImpl, sleep: deps.sleep }));
  } catch {
    return null;
  }
```

</details>

**依据 8 · 源码核查**：[dsh-pet/src/host/voice/builtin-deepseek-asr.ts:25-48](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/voice/builtin-deepseek-asr.ts#L25-L48)

实际音频出站请求及失败分支。

<details>
<summary>查看原文（24行）</summary>

```text
export function createDeepseekAsrProvider(deps: { resolveKey: ResolveKey }): SpeechProvider {
  return {
    id: DEEPSEEK_ASR_PROVIDER_ID,
    name: 'DeepSeek',
    timeoutMs: 60_000,
    async transcribe({ audio, signal }) {
      const key = await deps.resolveKey();
      // 没配 key 是能力缺失，不是识别失败：让调用方看到「不可用」而不是「识别出错」
      if (!key) throw new SpeechUnavailableError('DEEPSEEK_API_KEY is not configured');
      const form = new FormData();
      // 官方按文件内容检测格式，这里的 MIME 只影响服务端选路；端侧产出的就是 WAV
      form.append('file', new Blob([audio], { type: 'audio/wav' }), 'speech.wav');
      const res = await fetch(ASR_ENDPOINT, {
        method: 'POST',
        headers: { authorization: `Bearer ${key}` },
        body: form,
        signal,
      });
      if (!res.ok) throw new Error(`deepseek asr HTTP ${res.status}`);
      const body = (await res.json()) as { text?: unknown };
      // 宿主返回值不可信：不是字符串就当失败，不把对象塞进文字里
      if (typeof body?.text !== 'string') throw new Error('deepseek asr returned invalid body');
      return body.text;
    },
```

</details>

#### 缺口

- 外部服务可用性、保留与删除行为未知。
  **影响**：不据此承诺可用性、完整停用或隐私合格。
  **进一步探讨**：用合成文本与无敏感录音，按功能监测请求与清理。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 待办与周期任务如何影响持续成本和撤出？

**研究主题**：采用判断、效果与总成本、缺陷与关键质疑

#### 完整回答

共享待办使用用户目录的独立存储，提醒检查订阅端、到期项和发声宠物。无在线监听时在选下一条之前返回，宠物不适合发声也不写。成功时写入当前显示可消费的 say，按 voiceTo 决定是否播报，随后更新已提醒时刻。需要关闭浏览器后可靠到达的任务超出这条已核查链路的保证。

余额周期启动即检查，只有醒着且启用余额的宠物才会触发刷新，后续间隔重读配置。配置读取错误时停定时器并记录日志。碎碎念走单队列的周期调度和在途请求，网络成本仍需测量。清理函数可移除定时器；浏览器可见、配置开关和宿主卸载分别验收。首次须确认兼容宿主、通知权限和功能隔离，持续须考虑提醒、媒体与模型调用。现金、机器占用和人工分钟均未知。

仅在需要此提醒且已有兼容环境时，以临时 profile 和可控审批事件试验。只开启相关通知，查该环境的余额、闲聊、长记忆与语音开关和实际请求。若通知缺失、误跳或出现不合要求的请求，回到原生会话。退出时解除挂载并核对路由、等待和此前写出的本地或远端数据。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/host/index.ts:100-105](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/index.ts#L100-L105)

余额实例与独立待办持久存储。

```text
  const balancePoll = createBalancePoll({ ctx, configPaths, getActivePetId, log, state, standaloneAiBalance });
  const { effectivePetList, balancePeriodSec, whisperPeriodSec, refreshBalance, resolveActivePetId, petDisplayName } =
    balancePoll;

  // 待办清单：一份用户级数据（不分宠物），落盘在插件数据根；提醒循环与 /todos 路由共用同一个实例。
  const todos = new TodoStore({ file: join(userRoot, TODO_FILE_NAME), log });
```

**依据 2 · 源码核查**：[dsh-pet/src/host/index.ts:229-274](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/index.ts#L229-L274)

周期、待办和卸载回调的主入口接线。

<details>
<summary>查看原文（46行）</summary>

```text
  registerLoops({
    ctx,
    balancePeriodSec,
    configPaths,
    lastWhisperAt,
    lock,
    log,
    publishWhisper,
    publishSleepTalk,
    refreshBalance,
    sleep,
    standaloneAiPolicy,
    whisperPeriodSec,
  });

  registerPetCommand({ ctx, effectivePetList, petDisplayName, resolveActivePetId, setActivePetId });

  registerChatCommand({ ctx, chatWithPet, log, publishWhisper, resolveActivePetId, sleep, sleepRefusalText });

  // 待办提醒：随插件生命周期起停；锁被第三方持有时由 pickReminderSpeaker 跳过该宠物。
  // 播报开关现读现用：改配置后下一次提醒即生效，不必重启。
  registerTodoReminders({
    ctx,
    effectivePetList,
    isVoiceTodoEnabled: () => readAllConfig(configPaths).main?.voiceTodoEnabled === true,
    lock,
    log,
    sleep,
    state,
    todos,
    waiterCount: () => state.waiterCount(),
  });

  registerLifecycle({
    ctx,
    lock,
    markDisposed,
    playback,
    state,
    stopDownloadSlotTimer,
    stopHelper,
    stopWorkStatusFlush,
  });

  // 路由就绪后拉起桌面 Helper（Electron 缺失时仅告警，不影响 DSH 与浏览器 overlay）
  startHelper();
```

</details>

**依据 3 · 源码核查**：[dsh-pet/src/host/plugin/todo-reminders.ts:88-110](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/plugin/todo-reminders.ts#L88-L110)

按监听、时点和宠物状态判断，写提醒并更新历史。

<details>
<summary>查看原文（23行）</summary>

```text
export async function tickTodoReminders(deps: TodoReminderTickDeps): Promise<void> {
  // 没有端在线时整拍跳过、不推进 lastRemindedAt：下一次有人连上时还是「到点」状态。
  if (deps.hasListener !== undefined && !deps.hasListener()) return;
  const now = deps.now?.() ?? Date.now();
  const due = pickReminder(await deps.todos.list(), now);
  if (due === null) return;
  const pets = deps.effectivePetList();
  const speaker = pickReminderSpeaker(
    pets,
    (petId) => deps.lock.locked(petId),
    (petId) => deps.isSleeping?.(petId) ?? false,
  );
  if (speaker === null) return;
  // 该由哪一端念：pickReminderSpeaker 已排除 display=none，所以这里不会是 null（防御性保留可选）；
  // 播报开关关掉时干脆不写这个键（叶子不带 = 谁都不念），气泡照旧弹。
  const display = String(pets.find((pet) => String(pet.id ?? '') === speaker)?.display ?? '');
  const voiceTo = deps.isVoiceTodoEnabled() ? pickVoiceSurface(display) : null;
  deps.state.writePet(speaker, 'say', {
    text: reminderText(due.todo, now),
    duration: BUBBLE_DURATION_MS,
    ...(voiceTo ? { voiceTo } : {}),
  });
  await deps.todos.markReminded(due.todo.id, now);
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/host/plugin/loops.ts:58-97](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/plugin/loops.ts#L58-L97)

启动轮询、条件跳过读配置和停止分支。

<details>
<summary>查看原文（40行）</summary>

```text
  // 余额周期刷新：host 侧唯一定时器。周期每次重新读配置 eventsRefreshSec.balance，改了下一拍跟上。
  // 没有任何启用余额的宠物时跳过查询：尊重配置，不白花外部 API 调用。
  ctx.effect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    function arm(sec: number): void {
      if (disposed) return;
      timer = setTimeout(() => void tick(), Math.max(1000, sec * 1000));
    }
    async function tick(): Promise<void> {
      let sec: number;
      try {
        const cfg = readAllConfig(configPaths);
        sec = balancePeriodSec(cfg);
        // 没有任何「醒着且启用余额」的宠物 → 不查（省外部调用）：睡着的宠物不看不听，
        // 拉了也只会白花一次外部 API；配置改了或醒了，下一拍自然跟上。
        const pets = flattenPetList(cfg);
        if (pets.some((p) => p.balanceEnabled === true && !sleep.sleeping(String(p.id ?? '')))) {
          await refreshBalance();
        } else {
          log.info('[dsh-pet] 余额周期跳过：没有醒着且启用余额的宠物');
        }
      } catch (e) {
        // 读配置抛错 = 安装损坏（readAllConfig 只在内置默认缺失/损坏时抛，用户层写坏只会告警回退）：
        // 不再重排——每 30 分钟重试一次没有意义，而且会白占一个常驻定时器。留一行 warn：这条路径
        // 会让余额周期永久停摆，不打日志就与「查了但没变化」无法区分。
        log.warn(
          '[dsh-pet] 余额周期读配置失败，周期刷新已停止（重启 DSH 后恢复）：' +
            (e instanceof Error ? e.message : String(e)),
        );
        return;
      }
      arm(sec);
    }
    void tick(); // 启动即拉一次，不等第一个周期
    return () => {
      disposed = true;
      if (timer !== null) clearTimeout(timer);
    };
  }, 'dsh-pet: balance poll');
```

</details>

**依据 5 · 源码核查**：[dsh-pet/src/host/plugin/loops.ts:99-136](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/plugin/loops.ts#L99-L136)

串行排队调用碎碎念。

<details>
<summary>查看原文（38行）</summary>

```text
  // 碎碎念周期：host 侧调度。一拍 = 读一次配置 + 把「到点」的宠物排进错峰队列；下一拍按最短周期排。
  // 用固定拍 + 逐宠物比对 lastWhisperAt，而不是每宠一个定时器：宠物随配置增删、周期随条目改，
  // 固定拍天然跟上，不用维护一堆定时器的生命周期。
  ctx.effect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    /** 待发布的宠物（FIFO）；一次只发一只，两只之间隔 {@link WHISPER_STAGGER_MS}。 */
    const pending: string[] = [];
    /** 队列内相邻两只之间的等待句柄；与拍定时器分开计，两者都要在卸载时清掉。 */
    let drainTimer: ReturnType<typeof setTimeout> | null = null;

    /** 是否已经有一只正在生成；同一时刻只允许一只，否则两只仍会同时写出气泡。 */
    let pumping = false;

    /**
     * 从队列取下一只发布，等它写完再隔一个间隔发下一只。
     *
     * 间隔从「文字真的写进状态」算起，而不是从发起点算：单次生成耗时在 3–15 秒之间波动，
     * 从发起点算的固定间隔会被慢的那只吃掉，两只又撞到一起。
     */
    async function pump(): Promise<void> {
      if (disposed || pumping || drainTimer !== null) return;
      const petId = pending.shift();
      if (petId === undefined) return;
      pumping = true;
      try {
        // kind=whisper 让生成侧按 voiceWhisperEnabled 决定要不要带 voiceTo。
        await publishWhisper(petId, undefined, undefined, 'whisper');
      } catch {
        // 单只失败不挡住后面的宠物：原因已经由 publishWhisper 记过日志。
      } finally {
        pumping = false;
      }
      if (disposed || pending.length === 0) return;
      drainTimer = setTimeout(() => {
        drainTimer = null;
        void pump();
      }, WHISPER_STAGGER_MS);
```

</details>

**依据 6 · 源码核查**：[dsh-pet/src/host/plugin/lifecycle.ts:27-43](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/plugin/lifecycle.ts#L27-L43)

卸载收尾覆盖的资源。

<details>
<summary>查看原文（17行）</summary>

```text
export function registerLifecycle(deps: LifecycleInput): void {
  const { ctx, lock, markDisposed, playback, state, stopDownloadSlotTimer, stopHelper, stopWorkStatusFlush } = deps;
  // 随插件生命周期清理：桌面 Helper 回收（异步下载完成后不再拉起）+ 结束所有挂起的等待
  // （回执与 /state 长轮询不结束的话，插件重载会留下一批悬挂响应，各自要等到超时才收尾）。
  ctx.effect(() => () => {
    markDisposed();
    // 工作状态的补写定时器：卸载后它到点已经没有意义（叶子连同长轮询一起收尾），清掉免得挂着
    stopWorkStatusFlush();
    // 下载日志的「清槽」定时器：同上，卸载后它到点已经没有意义
    stopDownloadSlotTimer();
    // 占用锁：卸载时把锁全撤掉并写一次叶子——不写的话渲染端要等 TTL 到点才解除静止
    // （写叶子必须在 state.cancelAll() 之前：那之后挂起的等待者已经收尾了）。
    lock.releaseAll();
    playback.cancelAll();
    state.cancelAll();
    stopHelper('dsh-host-stop');
  });
```

</details>

#### 缺口

- 成本及真实退出结果未验证。
  **影响**：无法承诺无后台请求或零清理负担。
  **进一步探讨**：对照空 profile 记录请求、状态文件、人工准备和回滚。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验通知改善了回查？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是携带会话标识的通知在用户看别的页面时能缩短返回当前审批的时间。宿主对完成状态做延迟确认，有待证明能减少误报且保持送达。没有会话归属的错误事件和系统未授权提供反例。

在同一 DSH Web 和浏览器交替执行两条可控会话，一条出现审批，另一条含长后台活动，并注入一次完成前成员仍活动的情况。使用原生查看或插件提醒，均从同一前后台状态出发。记录提醒何时出现、是否打开正确会话、能否在原会话做确认，同时记录误报、焦点切换、额外请求和总人工时间。若正确回查数量和耗时没有改善，或误跳和不必要请求增加，不支持常驻使用。该对照属于待验证方案。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/host/plugin/session-watch.ts:273-302](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/host/plugin/session-watch.ts#L273-L302)

通知事件有来源和延迟完成分支。

<details>
<summary>查看原文（30行）</summary>

```text
        if (!shouldNotifySession(session)) return;
        // 回复正文来源：只记最近一段 assistant 文本，供完成通知的正文使用。取不到就不记，
        // 下游回落空正文（宁可少一行字，也不能让通知整体失效）。
        if (event?.type === 'assistant/message') {
          const text = lastAssistantText(event as { type?: string; data?: Record<string, unknown> });
          if (text) lastReplyText.set(sessionIdOf(session), text);
        }
        // 活动门（issue #114）：「对话完成」延迟确认这条会话确实没活了再弹——团队会话里 Lead 的
        // 这一轮结束 ≠ 团队收工，成员还在跑时弹「对话完成」是误报。生成失败/输出截断、权限申请、
        // 用户选择不过这道门，直接放行（理由见 notify-events.ts 的 isCompletionTurnEnd）。
        if (isCompletionTurnEnd(event)) {
          scheduleCompletionNotify(sessionIdOf(session), event);
          return;
        }
        // 非完成收尾（出错 / 输出截断 / 中止）用不到这段正文，一并清掉，免得留到下一次完成。
        if (event?.type === 'turn/end') lastReplyText.delete(sessionIdOf(session));
        const frame = reduceNotifyFrame(event as Parameters<typeof reduceNotifyFrame>[0]);
        // 帧带上「这条通知是哪条会话发出的」：点击时网页据此跳到那条会话（见 withSessionId）
        if (frame) pushNotifyFrame(withSessionId(frame, sessionIdOf(session)));
      },
    );
    // agent/error（agent-loop dispatch.emit）：无回合位置的生成失败；0.1.5 新增，
    // 低版本 DSH 无此事件 = 少一条通知（turn/end error 分支已覆盖大部分失败场景），不报错。
    // 两道门都管不到它：载荷只有 { turn, step, error }，不带会话标识，无从判定来源。
    const errorDispose = ctx.on(
      'agent/error',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- agent/error 载荷无公开类型，且低版本 DSH 可能不带 error 字段，只能 any 后按可选链取 payload?.error
      (payload: any) => {
        pushNotifyFrame(agentErrorFrame(payload?.error));
      },
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/client/notify.ts:121-153](https://github.com/PC2005-cloud/dsh-pet/blob/ef174beecc79df76baf9ca06ed152237bbb96875/dsh-pet/src/client/notify.ts#L121-L153)

点通知的权限制约和跳转结果。

<details>
<summary>查看原文（33行）</summary>

```text
export function jumpToSession(sessionId?: string): void {
  if (sessionId !== undefined) {
    // 跳转失败（会话已删 / 旧版没有该服务）绝不能连累「把窗口叫回来」那条腿。
    try {
      sessionNavigator?.openSession(sessionId);
    } catch {
      /* 不跳会话而已，继续叫窗口。 */
    }
  }
  window.focus();
  if (!/electron/i.test(navigator.userAgent)) return;
  const frame = document.createElement('iframe');
  frame.style.display = 'none';
  frame.src = 'dsh://open';
  document.body.append(frame);
  setTimeout(() => frame.remove(), 1000);
}

/** 点通知：收起弹窗并跳到它指的那条会话（跳转细化见 {@link jumpToSession}）。 */
export function wireNotificationClick(n: Notification, sessionId?: string): void {
  n.onclick = () => {
    n.close();
    jumpToSession(sessionId);
  };
}

/** 发一条系统通知；总开关关闭、环境不支持、未授权或本页正在看时静默跳过。
 * 日志只在门之后记录：被拦下的触发不产生「弹窗」日志。 */
function toast(title: string, body?: string, icon?: string, sessionId?: string): void {
  if (!notifyEnabled) return;
  // 开关关着时维持「聚焦不打扰」；打开后照常弹，不再看页面是否活跃。
  if (!shouldRemind(notifyWhenFocused, isPageActive())) return;
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
```

</details>

#### 缺口

- 没有同条件对照。
  **影响**：称为待验证假设，采用只限小范围试用。
  **进一步探讨**：交替使用原生和插件提醒，记录正确回查、误报与额外请求。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
