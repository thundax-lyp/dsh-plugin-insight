# DSH Pet 桌宠与任务提醒

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[fb38ce6](https://github.com/PC2005-cloud/dsh-pet/tree/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet)

<!-- BEGIN META -->
[![GitHub ★ 6,621](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C621&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PC2005-cloud/dsh-pet) [![npm 30d 594,280](https://img.shields.io/static/v1?label=npm+30d&message=594%2C280&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet) [![最新发布 2026-11-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet)
<!-- END META -->

> **功能**：在 DSH 中显示桌宠、任务提醒、待办、余额与聊天，并可连接长期记忆和语音。

> **亮点**：[Q01](#research-q01) 将宿主事件、浏览器通知与会话回跳连接，适合检验长任务回查；[Q03](#research-q03) 与 [Q04](#research-q04) 将关系摘要和原子细节并行接入聊天，但仅确认机制，未证明问答质量提高。

> **主要限制**：[Q04](#research-q04) 的主题优先预算可能完全排除关键原子细节；[Q03](#research-q03) 还存在本地历史和远端写入不同步的留存边界。[Q01](#research-q01) 的提醒送达受浏览器权限和页面状态限制，不能将宠物存在等同于任务已办结。

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
  - [Q01 · 审批或完成提醒如何回到正确会话？](#detail-section-11)
  - [Q02 · 组件加载、请求断连和卸载分别回收什么？](#detail-section-12)
  - [Q03 · 聊天记忆如何召回、写入并隔离宠物？](#detail-section-13)
  - [Q04 · 双层召回是否必然同时保留概括和细节？](#detail-section-14)
  - [Q05 · 待办、轮询、天气和语音如何增加持续负担？](#detail-section-15)
  - [Q06 · 哪些人可以先试提醒，如何检验记忆方向？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适用场景是在 DSH Web 发起需要审批或选择的长任务后，用户切去做别的工作，接到提醒时能认出来源并回到原会话。合格结果包含正确会话归属、实际通知到达及可核对的原始审批内容；宠物动画或“任务完成”文字不单独算交付。原办法是反复看原生会话或使用宿主已有提醒，本包的可见增量是把会话事件、系统通知和回跳串在同一入口，是否优于原生仍需同条件对照。

原生会话查看与提醒、人工维护待办和单独聊天；应用已有可靠提醒时不必仅为桌宠新增常驻依赖。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌宠界面与任务状态 | 展示活动、气泡和动画 | 状态不是实际任务办结凭证 |
| 系统通知与会话回跳 | 长任务审批和完成回查 | 浏览器权限、焦点和导航条件生效 |
| 聊天及长期记忆 | 将用户输入与历史接入模型 | 可选远端服务接收双向文字，预算偏向主题 |
| 待办提醒 | 提示到期事项 | 无在线监听不标已提醒，不保证系统已展示 |
| 余额与碎碎念循环 | 按配置刷新信息或生成文案 | 需启用及相应模型/凭据，存在持续请求 |
| 语音与天气 | 识别、播报及环境辅助 | 对应服务、凭据与出站条件需分别核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 声明服务齐备的 DSH、Node >=22.12.0 | 组件必需 | 注入宿主及客户端能力 | 以实际加载核对，版本声明不是本次验收 |
| 浏览器通知权限和会话导航 | 提醒回查需要 | 展示弹窗、返回来源会话 | 未授权无弹窗，缺导航可能仅聚焦 |
| 监听端与可发声宠物 | 待办提醒需要 | 消费到期状态 | 无监听不推进提醒时刻 |
| PowerContext地址和对应配置 | 该记忆功能需要 | 两层检索及双向文字写入 | 失败回退本地请求，远端留存另查 |
| 模型、语音凭据与天气服务 | 对应功能按需 | 闲聊、语音和环境信息 | 各链独立失败与降级，不是通知启动必要条件 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 使用者建临时profile，检查注入与附加开关 | 无不期望的模型、记忆或语音请求 |
| 触发 | 两条测试会话分别产生审批和后台活动 | 事件来自已知会话，不能误报团队完成 |
| 回查 | 用户点通知并核对原审批 | 返回正确会话，失败则回原生入口 |
| 记忆实验 | 维护者独立固定主题/原子命中做预算比较 | 回答的细节有真实依据，不能只看两路请求成功 |
| 退出 | 使用者解除挂载并核对监听、路由与留存 | 等待已收束，远端数据另行确认 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主、插件和媒体资源，金额未知 | 配置权限、开关与临时profile | 实际兼容与耗时未知 |
| 持续使用 | 媒体、轮询与可选模型/语音/记忆请求 | 处理误报、核对来源和数据发送 | 每合格回查成本未知 |
| 失败恢复 | 重试请求和状态留存 | 查权限、会话和外部服务 | 远端capture不随本地清历史撤回 |
| 退出 | 本地与远端留存空间 | 停挂载、清理数据及核对在途任务 | 完整退出时间未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 审批回查 | 通知带来源会话并尝试导航 | 到达率、误报和真实回跳效果 |
| 记忆补充 | 并行检索主题/原子并装入正文 | 服务端质量、细节保留与问答改善 |
| 生命周期 | 断连信号与卸载资源清理明确 | 远端工作是否取消及历史删除效果 |
| 持续负担 | 功能各有触发条件和出站链 | 金额、总时间与净收益 |

> **思考**：[Q04](#research-q04) 的主题优先预算可能完全排除关键原子细节；[Q03](#research-q03) 还存在本地历史和远端写入不同步的留存边界。[Q01](#research-q01) 的提醒送达受浏览器权限和页面状态限制，不能将宠物存在等同于任务已办结。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将宿主事件、浏览器通知与会话回跳连接，适合检验长任务回查；[Q03](#research-q03) 与 [Q04](#research-q04) 将关系摘要和原子细节并行接入聊天，但仅确认机制，未证明问答质量提高。

[Q02](#research-q02) 把断连等待、配置串行队列和卸载资源归属分开，有利于定位责任；移植需宿主effect/路由契约。[Q03](#research-q03) 召回失败不阻塞对话，但等待预算与真实取消是不同层。[Q04](#research-q04) 固定层顺序显示“限制总量”不能保证信息多样性。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04) 的主题优先预算可能完全排除关键原子细节；[Q03](#research-q03) 还存在本地历史和远端写入不同步的留存边界。[Q01](#research-q01) 的提醒送达受浏览器权限和页面状态限制，不能将宠物存在等同于任务已办结。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06) 只在临时profile试一项无敏感内容审批提醒，先关闭无关聊天记忆与语音，核对实际请求和浏览器权限。点通知后回原界面确认；误跳、误报或不期望请求就解除挂载。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定组件通知、资源回收与双层记忆装配有源码依据；服务端效果及真实送达未验证；分层预算假设未验证。

- 已检查：作者 README、包清单、源码路径 dsh-pet/package.json、dsh-pet/cordis.patch.yml、dsh-pet/tsdown.config.mjs、dsh-pet/src/host/index.ts、dsh-pet/src/host/plugin/session-watch.ts、dsh-pet/src/client/notify.ts、dsh-pet/src/host/plugin/http-route.ts、dsh-pet/src/host/plugin/lifecycle.ts、dsh-pet/src/host/plugin/chat-memory.ts、dsh-pet/src/host/memory/powercontext.ts、dsh-pet/src/host/plugin/todo-reminders.ts、dsh-pet/src/host/plugin/loops.ts、dsh-pet/src/host/uapi.ts、dsh-pet/src/host/voice/builtin-deepseek-asr.ts 及固定范围 inventory；组件：dsh-pet。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 dsh-pet 子包的入口、Web通知、路由、生命周期、聊天/PowerContext召回捕获、待办、轮询、天气与ASR关键链路；不将整个仓库或独立桌面模式当作已验收。
- 下一步：仅源码与原始材料读取和本工程装配。未运行目标、测试、真实宿主、独立桌面、模型或外部记忆服务；无本轮费用和任务效果实测。

**分析版本**

- **仓库**：[PC2005-cloud/dsh-pet](https://github.com/PC2005-cloud/dsh-pet)
- **版本号**：0.4.9（[固定提交 fb38ce6](https://github.com/PC2005-cloud/dsh-pet/tree/fb38ce620576f5ed3735a99536d2b1a4a9eb313f)）
- **版本日期**：2026-11-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 推导出为主题与原子各留最小预算再合并的未验证设计，用固定命中对照关系与细节问答、噪声和token；若遗漏未降或噪声上升则否定。[Q06](#research-q06) 的通知比较独立检查正确回查，不将两个方向的收益混算。

仅源码与原始材料读取和本工程装配。未运行目标、测试、真实宿主、独立桌面、模型或外部记忆服务；无本轮费用和任务效果实测。

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
| .ts | test | 228 | 39169 | 32292 | 3288 | — |
| .ts | source | 418 | 52632 | 35486 | 13895 | — |

</details>

**活跃度**

[![Issue 未关闭 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=25&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 161](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=161&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+created%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z) [![近30天关闭 138](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=138&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z)



统计日期：2026-11-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用户离开DSH页面后，桌宠能否提供可信的任务回查，同时使聊天记忆与后台扩展保持可理解、可退出？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 审批或完成提醒如何回到正确会话？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适用场景是在 DSH Web 发起需要审批或选择的长任务后，用户切去做别的工作，接到提醒时能认出来源并回到原会话。合格结果包含正确会话归属、实际通知到达及可核对的原始审批内容；宠物动画或“任务完成”文字不单独算交付。原办法是反复看原生会话或使用宿主已有提醒，本包的可见增量是把会话事件、系统通知和回跳串在同一入口，是否优于原生仍需同条件对照。

宿主 session/event 先排除子智能体和委派来源，再将审批等事件归成带 sessionId 的帧；完成事件额外延迟检查团队活动，避免主回合结束就误称全队完成。没有会话归属的 agent/error 不能保证回跳定位。浏览器从状态帧进入通知处理，受总开关、当前焦点策略及 Notification 权限约束；点击先尝试 openSession，再聚焦，导航缺失或异常时仍可能只叫回窗口。页面关闭后的可靠送达不由这条浏览器链路保证。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/host/plugin/session-watch.ts:261-301](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/plugin/session-watch.ts#L261-L301)

事件归属过滤、完成延迟和带会话帧。

<details>
<summary>查看原文（41行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/client/notify.ts:121-175](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/client/notify.ts#L121-L175)

跳转失败降级及浏览器通知门槛。

<details>
<summary>查看原文（55行）</summary>

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
  console.log('[dsh-pet] 【弹窗】' + title + (body ? '：' + body : ''));
  try {
    const opts: NotificationOptions = {};
    if (body) opts.body = truncate(body);
    if (icon) opts.icon = icon;
    // 点击行为与真实事件通知共用 wireNotificationClick；图标加载失败只降级为无图标，不会关闭弹窗。
    const n = new Notification(title, opts);
    wireNotificationClick(n, sessionId);
  } catch {
    /* 个别桌面壳在构造时抛错：忽略，不打断业务。 */
  }
}

/**
 * 帧 → toast 并发出；未知帧静默跳过，帧里的 sessionId 一并透传给点击行为。
 * 标题优先用会话名：同一个宿主上可以并行跑多条会话，通知里必须能认出是哪一条回来了。
 */
function toastFrame(frame: NotifyFrame): void {
  const sessionId = typeof frame.sessionId === 'string' ? frame.sessionId : undefined;
  const t = frameToToast(frame, sessionTitleFrom(sessionNavigator, sessionId));
  if (!t) return;
  toast(t.title, t.body, PIC(t.icon), sessionId);
```

</details>

#### 缺口

- 缺少同宿主原生提醒与插件提醒的到达/回跳对照
  **影响**：不能证明减少等待或提高正确返回率
  **进一步探讨**：两条可控会话分别触发审批和长后台活动，记录通知时间、正确会话及误报

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 组件加载、请求断连和卸载分别回收什么？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

固定 dsh-pet 子包有 bundle patch 挂载，exports 指向 lib/index.js 与 lib/client.js，tsdown 将宿主和客户端源码分别生成对应产物。宿主静态注入 webServer、agentDefaultModel、credentials、llm、commands、connection，因此只用通知也需要满足整个宿主组件的服务条件；兼容版本清单是作者声明，不能替代本次加载验证。apply 将路由、会话监听、命令、循环与 Helper 分开装配，独立 CLI 是另一构建入口，本次不把独立模式体验套给 Web。

HTTP 路由将响应断开转成 AbortSignal 并传入处理器，避免挂起长轮询继续等；配置读写共享同进程串行队列，不能保护外部编辑者。生命周期清理先标记已卸载，再停状态和下载定时器、释放占用锁、取消播放和状态等待并停 Helper，顺序避免状态等待先结束而锁释放通知失去消费者。清理本地等待不等于删除本地历史、撤销已送外部服务的内容，或取消一切在途模型工作。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/package.json:49-64](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/package.json#L49-L64)

宿主和客户端导出。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[dsh-pet/tsdown.config.mjs:37-61](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/tsdown.config.mjs#L37-L61)

实际构建输入。

<details>
<summary>查看原文（25行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[dsh-pet/src/host/index.ts:39-50](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/index.ts#L39-L50)

必需宿主服务声明。

<details>
<summary>查看原文（12行）</summary>

```text
/** 插件行 id（与 cordis.patch.yml 一致） */
export const name = 'pet';
/** 需要注入的服务：webServer（路由）+ agentDefaultModel（当前服务商）+ credentials（凭证）+ llm（对话模型调用）+ commands（/balance 斜杠命令）+ connection（桌面 Helper「打开 AI 设置」用的已鉴权站点 URL） */
export const inject = ['webServer', 'agentDefaultModel', 'credentials', 'llm', 'commands', 'connection'];

/** 检索查询的改写提示词：结合最近几轮还原指代，只要一条能拿去检索的查询，不要解释、不要多行。 */
const REWRITE_QUERY_SYSTEM =
  '把用户这句话改写成一条用于检索长期记忆的查询：结合最近几轮对话还原「它」「那个」「继续」这类指代，保留检索需要的名词与限定词，去掉寒暄、语气词与称呼，不要解释、不要引号、不要换行。只输出这条查询本身。';

/** 宿主插件主体：注册 `/dsh-pet-7340` 前缀路由与斜杠命令（/balance /pet /chat）；ctx 暂用 any（peer 类型包本地不可解析）。 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- DSH 注入的 ctx（webServer/locale 等 service 无静态类型）
export function apply(ctx: any): void {
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/host/plugin/http-route.ts:43-58](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/plugin/http-route.ts#L43-L58)

配置队列作用于同进程。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 5 · 源码核查**：[dsh-pet/src/host/plugin/http-route.ts:72-94](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/plugin/http-route.ts#L72-L94)

路由注册与断连信号传递。

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[dsh-pet/src/host/plugin/lifecycle.ts:26-43](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/plugin/lifecycle.ts#L26-L43)

卸载资源清理顺序。

<details>
<summary>查看原文（18行）</summary>

```text
/** 注册卸载清理；返回的清理函数由 ctx.effect 收集。 */
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

- 未取得所声明宿主与发布成品的同版本加载记录
  **影响**：源码接线成立，不表示该运行环境能完整注入或卸载
  **进一步探讨**：固定实际宿主及成品，在临时profile观察加载、断连等待回收和卸载后的路由状态

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 聊天记忆如何召回、写入并隔离宠物？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

聊天核心先生成本地完整请求体，再给配置选择的记忆 provider 一次召回机会；按 provider 预算与结果竞争，超时、异常或非法形状都回退原请求，不把外部召回失败变成整轮聊天失败。生成使用得到的正文，回复先写本地历史，persisted 才异步 capture；若生成期间历史被删除导致代数改变，跳过本轮写回和 capture。已经发送的远端记录不会因此被删除。

PowerContext 按 endpoint 与 petId 缓存 scope，查询精确标题或创建一只宠物的 scope，再可选地用最近两轮改写检索句；它并行 POST 主题与原子检索。capture 把用户文字和宠物回复发送到 /v1/sources/content，source_id 为 dsh-pet:加轮次时间戳，scope_id 单独传入；服务端去重语义仅有本包注释，不能由请求体证明。先前命名格式与当前不同，同一轮跨版本重放是否形成两份远端源尚未核实。核心超时能结束等待，但该 provider 的 recall 实现未接收传入的整轮 signal，内部请求各有超时，不能说超时会立即终止所有出站。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/host/plugin/chat-memory.ts:182-221](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/plugin/chat-memory.ts#L182-L221)

超时竞速、请求体检查与异步捕获。

<details>
<summary>查看原文（40行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/plugin/chat-memory.ts:439-505](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/plugin/chat-memory.ts#L439-L505)

召回进入生成、持久后捕获和清历史分支。

<details>
<summary>查看原文（67行）</summary>

```text
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

**依据 3 · 源码核查**：[dsh-pet/src/host/memory/powercontext.ts:96-140](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/memory/powercontext.ts#L96-L140)

endpoint+petId缓存及scope查询/创建。

<details>
<summary>查看原文（45行）</summary>

```text
export function createPowerContextMemory(deps: PowerContextDeps): ChatMemoryProvider {
  /** 已探测到的 scope：一只宠物一份，键里带上地址——换了服务器不能继续往旧 scope 写。 */
  const scopes = new Map<string, string>();

  /**
   * 取某只宠物的 scope id：先按标题查，没有才创建。
   *
   * 不用「幂等 POST 兜底创建」：那条路对已存在的 scope 会返回 409，语义不明确；
   * 查询 + 创建虽然多一次往返，但「检测」与「创建」各自的结果都确定。
   */
  const ensureScope = async (petId: string): Promise<string | undefined> => {
    const endpoint = deps.endpoint().trim();
    if (endpoint === '') return undefined;
    const cacheKey = endpoint + '\u0000' + petId;
    const cached = scopes.get(cacheKey);
    if (cached !== undefined) return cached;
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
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/host/memory/powercontext.ts:143-182](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/memory/powercontext.ts#L143-L182)

查询、双检索和真实capture内容/身份。

<details>
<summary>查看原文（40行）</summary>

```text
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
    // 两层并行：总耗时取较慢的那一路，不让一层慢拖成两层的和。
    const [topics, atoms] = await Promise.all([searchTopics(deps, scopeId, query), search(deps, scopeId, query)]);
    const evidence = formatEvidence({ topics, atoms });
    if (evidence === '') {
      logEmptyRecall(req.petId, topics, atoms);
      return undefined;
    }
    return { ...req.prepared, userText: evidence + '\n\n' + req.prepared.userText };
  };

  const capture = async (turn: CaptureTurn): Promise<void> => {
    const scopeId = await ensureScope(turn.petId);
    if (scopeId === undefined) return;
    // 写的是 CaptureContentSourceRequest（202 受理，抽取在服务端后台跑）。
    // source_id 只带轮次时间戳：唯一性按 (scope, source_id) 算，而 scope 已是「一只宠物一个」，重试仍得同一个 id。
    // 注意不能走 /v1/scopes/{id}/sources——那条路收的是 CreateSourceRequest，不认 scope_id 与 source_id。
    await callApi(deps, {
      method: 'POST',
      path: '/v1/sources/content',
      body: {
        scope_id: scopeId,
        source_id: 'dsh-pet:' + turn.ts,
        content: '用户：' + turn.userText + '\n宠物：' + turn.replyText,
      },
      timeoutMs: CRUD_TIMEOUT_MS,
    });
```

</details>

#### 缺口

- PowerContext服务端scope与source去重实现及迁移行为未在本包内
  **影响**：不能证明远端隔离/去重或旧格式重放没有重复
  **进一步探讨**：在固定服务端版本以两只宠物和同一轮重试核对scope、源ID及新旧格式重放的实际条目

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 双层召回是否必然同时保留概括和细节？

**研究主题**：贡献与相对优势、缺陷与关键质疑、新假设与验证

#### 完整回答

不必然。主题接口最多取两条，原子接口最多取三条，二者并行，任一路失败被当作空结果，另一层仍可供模型使用。相比只查原子细节，双层机制增加了关系摘要的输入来源，但摘要是服务端产物，本包没有证明其准确性。用户本次输入与旧记忆冲突时优先用户的提示是文字约束，不是冲突消解算法。

证据总预算为 3072 UTF-8 字节，主题段先于原子段装配。fitSections 从第一段按顺序放整条内容；有内容后遇到一条放不下即返回，而不是跳过该条继续到下一层。第一条过长则截断后立即返回。因此长主题可能吃掉全部预算，或第二条主题放不下就使仍可放入的原子细节完全不进入正文。这是源码可推导的顺序偏置，不是已实测召回退化。可检验的假设是给两层各保留最小预算，再按任务相关性合并，在同时问关系与细节时可能降低漏答；对照要固定两层返回，比较最终回答对真实细节的支持度、遗漏、token和延迟。若任务只需概括而分层保底引入噪声，或准确率不升，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/host/memory/powercontext.ts:30-52](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/memory/powercontext.ts#L30-L52)

检索条数、时限与字节预算。

<details>
<summary>查看原文（23行）</summary>

```text
/** 本机 CRUD 请求的超时（ms）：探 scope、建 scope、写证据都不跑模型，慢就是服务端出问题了。 */
const CRUD_TIMEOUT_MS = 1_000;
/** 检索请求的超时（ms）：hybrid 要现场调一次远程 embedding 模型，比 CRUD 慢一个量级。 */
const SEARCH_TIMEOUT_MS = 5_000;
/** 改写查询的预算（ms）：超时就用原句查，宁可查得糙也不拖住对话。 */
const REWRITE_BUDGET_MS = 800;
/** 召回总预算（ms）：改写预算 + 检索超时 + 余量，core 按这个值掐整轮。 */
const RECALL_TIMEOUT_MS = 6_000;
/** 改写查询时带上的历史轮数（1 轮 = 1 问 1 答）：只用来还原「它」「那家」这类指代。 */
const REWRITE_HISTORY_ROUNDS = 2;
/** 原子记忆检索条数：三条足够，再多只是把无关内容塞进上下文。 */
const RECALL_LIMIT = 3;
/** 主题记忆检索条数：一条主题就是整段对话的摘要，比原子记忆长得多，两条已能占满半个证据块。 */
const TOPIC_RECALL_LIMIT = 2;
/** 查询串的字节上限：服务端收 8192，留一半余量给中文。 */
const QUERY_BYTES = 4_096;
/** 证据块的总字节上限：超了从尾部丢句子，越靠后的命中分越低。 */
const EVIDENCE_BYTES = 3_072;
/** 证据块的表头：明确告诉模型这是检索到的旧信息，冲突时以用户当次输入为准。 */
const EVIDENCE_HEADER = '以下是从长期记忆里检索到的相关信息，供你参考；与用户这次说的话冲突时，以用户为准：';
/** 证据块的分层标题：先给概括再给细节，模型更容易把原子条目挂到对的关系上。 */
const TOPIC_SECTION = '[主题记忆]';
const ATOM_SECTION = '[原子记忆]';
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/memory/powercontext.ts:254-286](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/memory/powercontext.ts#L254-L286)

两个不同查询接口和形状验证。

<details>
<summary>查看原文（33行）</summary>

```text
/** 检索原子记忆（逐条偏好与事实）；响应形状不对按失败处理。 */
async function search(deps: PowerContextDeps, scopeId: string, query: string): Promise<MemoryHit[] | undefined> {
  const result = await callApi(deps, {
    method: 'POST',
    path: '/v1/atomic-memory/search',
    body: {
      scope_id: scopeId,
      query,
      mode: 'hybrid',
      limit: RECALL_LIMIT,
    },
    timeoutMs: SEARCH_TIMEOUT_MS,
  });
  const hits = (result as { hits?: unknown } | undefined)?.hits;
  if (!Array.isArray(hits)) return undefined;
  return hits.map(toHit).filter((hit): hit is MemoryHit => hit !== undefined);
}

/** 检索主题记忆（多轮对话沉淀成的摘要）；响应形状不对同样按失败处理。 */
async function searchTopics(deps: PowerContextDeps, scopeId: string, query: string): Promise<TopicHit[] | undefined> {
  const result = await callApi(deps, {
    method: 'POST',
    path: '/v1/topic-memory/search',
    body: {
      scope_id: scopeId,
      query,
      limit: TOPIC_RECALL_LIMIT,
    },
    timeoutMs: SEARCH_TIMEOUT_MS,
  });
  const hits = (result as { hits?: unknown } | undefined)?.hits;
  if (!Array.isArray(hits)) return undefined;
  return hits.map(toTopicHit).filter((hit): hit is TopicHit => hit !== undefined);
```

</details>

**依据 3 · 源码核查**：[dsh-pet/src/host/memory/powercontext.ts:327-370](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/memory/powercontext.ts#L327-L370)

固定层顺序和遇到放不下即退出。

<details>
<summary>查看原文（44行）</summary>

```text
function formatEvidence(layers: RecallLayers): string {
  const lines = fitSections([
    [TOPIC_SECTION, (layers.topics ?? []).map(topicLine)],
    [ATOM_SECTION, (layers.atoms ?? []).map((hit) => evidenceLine(hit.kind, hit.text))],
  ]);
  return lines.length === 0 ? '' : EVIDENCE_HEADER + '\n' + lines.join('\n');
}

/**
 * 在字节预算内摆放各段，段标题与每一行都计入。
 *
 * 超长从尾部丢整条：越靠后的命中分越低，先丢它们的损失最小。
 * 首条就放不下时截断塞进去——单条啰嗦记忆不该让整轮召回作废。
 *
 * @param sections - 按展示顺序排列的段。
 * @returns 放得下的行；空数组表示连第一个段标题都放不下。
 */
function fitSections(sections: readonly EvidenceSection[]): string[] {
  const out: string[] = [];
  let used = Buffer.byteLength(EVIDENCE_HEADER, 'utf8');
  let hasContent = false;
  for (const [title, lines] of sections) {
    if (lines.length === 0) continue;
    const titleCost = Buffer.byteLength('\n' + title, 'utf8');
    if (used + titleCost > EVIDENCE_BYTES) break;
    out.push(title);
    used += titleCost;
    for (const line of lines) {
      const size = Buffer.byteLength('\n' + line, 'utf8');
      if (used + size <= EVIDENCE_BYTES) {
        out.push(line);
        used += size;
        hasContent = true;
        continue;
      }
      if (hasContent) return out;
      const room = EVIDENCE_BYTES - used - 1;
      const truncated = room > 0 ? truncateBytes(line, room) : '';
      if (truncated === '') return out;
      out.push(truncated);
      return out;
    }
  }
  return out;
```

</details>

#### 缺口

- 缺少实际两层命中内容与同条件问答结果
  **影响**：可证明装配策略，不能证明双层提升或预算保底有效
  **进一步探讨**：准备短/长主题与关键原子细节四组固定响应，对照现策略和分层预算，检查最终问题回答

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 待办、轮询、天气和语音如何增加持续负担？

**研究主题**：效果与总成本、功能与机制、工程质量与复用

#### 完整回答

待办提醒先检查是否有监听端，再挑到期项和可发声宠物；隐藏、锁定或睡眠的宠物不会被选中。它向状态写气泡后记录已提醒时刻，写入状态不等于操作系统已经展示或用户已阅读；没有监听时不推进时刻，后来上线仍可处理。余额轮询只在宠物启用余额且醒着时触发，碎碎念另外维护调度队列与在途生成，隐藏界面并不普遍等于停止所有宿主周期。

可选聊天、长期记忆、语音和天气有不同出站责任。天气请求可发送所设城市，缺城市由上游按IP定位；DeepSeek ASR 在用户选用并识别时上传 WAV，并通过凭据取key，缺凭据明确不可用。双层记忆新增一次检索请求并可能使用嵌入/模型，实际价格和请求量未知。首次需核对宿主、通知权限和功能开关，持续需计入媒体、网络、模型请求与人工误报复核；失败恢复还要查数据已送到哪一层。退出需停挂载，并分别处理本地和远端留存，没有证据可把卸载称为所有数据撤回。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/host/plugin/todo-reminders.ts:64-110](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/plugin/todo-reminders.ts#L64-L110)

监听、宠物选择、状态写入与已提醒标记。

<details>
<summary>查看原文（47行）</summary>

```text
export function pickReminderSpeaker(
  pets: readonly Record<string, unknown>[],
  isLocked: (petId: string) => boolean,
  isSleeping: (petId: string) => boolean = () => false,
): string | null {
  let desktopOnly: string | null = null;
  for (const pet of pets) {
    const petId = String(pet.id ?? '');
    if (petId === '') continue;
    if (pet.display === 'none') continue;
    if (isLocked(petId)) continue;
    if (isSleeping(petId)) continue;
    if (pet.display === 'web' || pet.display === 'both') return petId;
    desktopOnly ??= petId;
  }
  return desktopOnly;
}

/**
 * 跑一拍：最多提醒一条，成功后记下提醒时刻。
 *
 * @param deps - 存储、宠物列表、锁与状态写入。
 * @returns 无返回值；没有到点或没有可开口的宠物时静默返回。
 */
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

**依据 2 · 源码核查**：[dsh-pet/src/host/plugin/loops.ts:58-97](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/plugin/loops.ts#L58-L97)

余额循环及清理条件。

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

**依据 3 · 源码核查**：[dsh-pet/src/host/uapi.ts:139-150](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/uapi.ts#L139-L150)

天气城市与请求失败降级。

<details>
<summary>查看原文（12行）</summary>

```text
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
  return body === undefined ? null : toEnvironment(body, (deps.now ?? Date.now)());
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/host/voice/builtin-deepseek-asr.ts:24-48](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/voice/builtin-deepseek-asr.ts#L24-L48)

音频上传、凭据、signal与返回验证。

<details>
<summary>查看原文（25行）</summary>

```text
 */
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

- 未测后台请求量、资源占用、通知合格率及费用
  **影响**：无法判断常驻提醒收益是否覆盖媒体与扩展负担
  **进一步探讨**：只启用目标提醒，在前后台和断连场景记请求数、合格到达、误报与人工时间；再逐项打开记忆和语音比较

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些人可以先试提醒，如何检验记忆方向？

**研究主题**：采用判断、场景与需求、效果与总成本、新假设与验证

#### 完整回答

已有兼容 DSH Web、常在长任务中离开页面且能使用临时 profile 的用户，可小范围试用可控审批提醒。先只开启所需通知，核对余额、碎碎念、长期记忆与语音开关，授予浏览器通知权限，用两条已知事件会话检查来源、弹窗与正确回跳；不以动画或弹窗替代原始审批。只偶尔看任务或宿主提醒已足够的人可继续原生流程，不承担额外常驻插件负担。

通知比较从事件产生到正确回查并完成原界面确认计时，计入误报、切错会话、断连和人工恢复，记录实际请求及资源。记忆方向单独以固定返回的主题和原子内容对照预算策略，不能把通知试用成功当作聊天效果已证实。若提醒误跳、无授权弹窗之外还有不期望的出站，或不能确认卸载后工作已停止，应解除挂载并回原生会话，另查远端留存。当前源码足以限定一个可逆的提醒试用，仍无持续安装或跨宿主有效证据。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/client/notify.ts:147-175](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/client/notify.ts#L147-L175)

通知必要条件及会话透传。

<details>
<summary>查看原文（29行）</summary>

```text
/** 发一条系统通知；总开关关闭、环境不支持、未授权或本页正在看时静默跳过。
 * 日志只在门之后记录：被拦下的触发不产生「弹窗」日志。 */
function toast(title: string, body?: string, icon?: string, sessionId?: string): void {
  if (!notifyEnabled) return;
  // 开关关着时维持「聚焦不打扰」；打开后照常弹，不再看页面是否活跃。
  if (!shouldRemind(notifyWhenFocused, isPageActive())) return;
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  console.log('[dsh-pet] 【弹窗】' + title + (body ? '：' + body : ''));
  try {
    const opts: NotificationOptions = {};
    if (body) opts.body = truncate(body);
    if (icon) opts.icon = icon;
    // 点击行为与真实事件通知共用 wireNotificationClick；图标加载失败只降级为无图标，不会关闭弹窗。
    const n = new Notification(title, opts);
    wireNotificationClick(n, sessionId);
  } catch {
    /* 个别桌面壳在构造时抛错：忽略，不打断业务。 */
  }
}

/**
 * 帧 → toast 并发出；未知帧静默跳过，帧里的 sessionId 一并透传给点击行为。
 * 标题优先用会话名：同一个宿主上可以并行跑多条会话，通知里必须能认出是哪一条回来了。
 */
function toastFrame(frame: NotifyFrame): void {
  const sessionId = typeof frame.sessionId === 'string' ? frame.sessionId : undefined;
  const t = frameToToast(frame, sessionTitleFrom(sessionNavigator, sessionId));
  if (!t) return;
  toast(t.title, t.body, PIC(t.icon), sessionId);
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/plugin/lifecycle.ts:26-43](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/plugin/lifecycle.ts#L26-L43)

停止挂载的资源边界。

<details>
<summary>查看原文（18行）</summary>

```text
/** 注册卸载清理；返回的清理函数由 ctx.effect 收集。 */
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

**依据 3 · 源码核查**：[dsh-pet/src/host/memory/powercontext.ts:327-370](https://github.com/PC2005-cloud/dsh-pet/blob/fb38ce620576f5ed3735a99536d2b1a4a9eb313f/dsh-pet/src/host/memory/powercontext.ts#L327-L370)

记忆假设需独立检验预算偏置。

<details>
<summary>查看原文（44行）</summary>

```text
function formatEvidence(layers: RecallLayers): string {
  const lines = fitSections([
    [TOPIC_SECTION, (layers.topics ?? []).map(topicLine)],
    [ATOM_SECTION, (layers.atoms ?? []).map((hit) => evidenceLine(hit.kind, hit.text))],
  ]);
  return lines.length === 0 ? '' : EVIDENCE_HEADER + '\n' + lines.join('\n');
}

/**
 * 在字节预算内摆放各段，段标题与每一行都计入。
 *
 * 超长从尾部丢整条：越靠后的命中分越低，先丢它们的损失最小。
 * 首条就放不下时截断塞进去——单条啰嗦记忆不该让整轮召回作废。
 *
 * @param sections - 按展示顺序排列的段。
 * @returns 放得下的行；空数组表示连第一个段标题都放不下。
 */
function fitSections(sections: readonly EvidenceSection[]): string[] {
  const out: string[] = [];
  let used = Buffer.byteLength(EVIDENCE_HEADER, 'utf8');
  let hasContent = false;
  for (const [title, lines] of sections) {
    if (lines.length === 0) continue;
    const titleCost = Buffer.byteLength('\n' + title, 'utf8');
    if (used + titleCost > EVIDENCE_BYTES) break;
    out.push(title);
    used += titleCost;
    for (const line of lines) {
      const size = Buffer.byteLength('\n' + line, 'utf8');
      if (used + size <= EVIDENCE_BYTES) {
        out.push(line);
        used += size;
        hasContent = true;
        continue;
      }
      if (hasContent) return out;
      const room = EVIDENCE_BYTES - used - 1;
      const truncated = room > 0 ? truncateBytes(line, room) : '';
      if (truncated === '') return out;
      out.push(truncated);
      return out;
    }
  }
  return out;
```

</details>

#### 缺口

- 没有原生与插件同条件长期任务的送达、正确回查和全周期人工数据
  **影响**：试用结论不升级持续安装建议
  **进一步探讨**：固定宿主与任务交替比较，若合格率和总时间未改善或不期望请求增加则停止

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
