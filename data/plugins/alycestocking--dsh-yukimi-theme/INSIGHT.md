# dsh-yukimi-theme

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[4b162a3](https://github.com/AlyceStocking/dsh-yukimi-theme/tree/4b162a3572e894e71001f3cefd0105519d5c4461)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：DSH Web 佐城雪美主题与 Windows desktop profile 桌宠通知，素材从外部 wiki URL 加载。

> **核心亮点**：主题加桌宠把会话等待与本轮完成事项带到桌面。详见[Q01](#research-q01)。

> **风险与缺陷**：桌宠通知虽不传聊天正文，仍使用会话标题并主动置顶；素材为第三方角色外链，公开/商用使用需另核。详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 主题与桌宠分别给用户什么？](#detail-section-11)
  - [Q02 · 桌面桥接和敏感内容范围如何控制？](#detail-section-12)
  - [Q03 · 部署与素材有哪些边界？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户喜欢角色主题，并希望桌面可见根会话的询问、审批与本轮结果。

DSH 默认主题与其内建通知；插件增加角色视觉和桌面小人。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| Web 主题 | 角色外观 | 外链素材 |
| 桌宠提醒 | 会话状态 | 标题可见 |
| 桌面桥接 | 本地通知 | Windows/Electron |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH Web/Desktop | 主题/通知 | 功能降级 |
| Windows/Electron 包 | 桌宠 | 仅 Web 小人 |
| 外部图片镜像 | 角色素材 | 视觉缺失 |

#### 试用

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| Web | 看主题/小人 | 可读/可关闭 |
| 桌面 | 完整包安装 | 通知/导航准确 |
| 隐私 | 敏感标题模拟 | 不误暴露 |

**效果与成本**

#### 成本

| 阶段 | 资源 | 边界 |
| --- | --- | --- |
| Web | 插件安装/网络图片 | 外链可靠性 |
| 桌面 | Electron 打包/完整 profile | Windows 限定 |
| 使用 | 标题通知 | 共享屏幕隐私 |

#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 主题 | CSS/外链资产 | 视觉/可读性 |
| 桌宠通知 | 状态桥接 | 漏看改善 |
| 本地 IPC | 随机 token 管道 | 实机焦点行为 |

> **思考**：桌宠通知虽不传聊天正文，仍使用会话标题并主动置顶；素材为第三方角色外链，公开/商用使用需另核。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：主题加桌宠把会话等待与本轮完成事项带到桌面。详见[Q01](#research-q01)。

主题加桌宠把会话等待与本轮完成事项带到桌面。详见[Q01](#research-q01)。

Web 主题外观与 Windows desktop helper 分路径，Host 将根会话状态压成通知并经命名管道发送。

<a id="detail-section-5"></a>

### 1.4 主要限制

桌宠通知虽不传聊天正文，仍使用会话标题并主动置顶；素材为第三方角色外链，公开/商用使用需另核。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在隔离 Web 看可读性，再完整打包桌面副本、核通知/回滚和素材权利。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

双路径与通知桥源码可核，真实 UI 未独立验证；标题会显示在桌面、角色素材外链且不受代码 MIT 自动覆盖。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/desktop-state.js、lib/desktop-process.js、lib/assets.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅 README、Host/桌面状态/进程与资产；未运行目标主题、桌宠或下载图片。
- 下一步：目标 Web/Windows 双路径、根会话审批/完成事件、随机管道、窗口置顶和素材来源检查。

**分析版本**

- **仓库**：[AlyceStocking/dsh-yukimi-theme](https://github.com/AlyceStocking/dsh-yukimi-theme)
- **版本号**：1.2.0-desktop.3（[固定提交 4b162a3](https://github.com/AlyceStocking/dsh-yukimi-theme/tree/4b162a3572e894e71001f3cefd0105519d5c4461)）
- **版本日期**：2026-10-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

提供隐藏/泛化标题选项与离线可授权素材集，可改善隐私和稳定性；本版本未证。详见[Q03](#research-q03)。

目标 Web/Windows 双路径、根会话审批/完成事件、随机管道、窗口置顶和素材来源检查。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 1608 | 1487 | 44 | — |
| .cjs | source | 2 | 348 | 333 | 13 | — |
| .md | source | 3 | 341 | — | — | 9035 |
| .mjs | source | 6 | 455 | 419 | 9 | — |
| .mjs | test | 12 | 1781 | 1654 | 10 | — |
| .cjs | test | 1 | 31 | 31 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AlyceStocking/dsh-yukimi-theme/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AlyceStocking/dsh-yukimi-theme/issues?q=is%3Aissue+created%3A2026-09-22T06%3A23%3A18.361Z..2026-10-22T06%3A23%3A18.361Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AlyceStocking/dsh-yukimi-theme/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A23%3A18.361Z..2026-10-22T06%3A23%3A18.361Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 Web 主题/Windows 桌宠双路径、通知桥接与素材/部署边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 主题与桌宠分别给用户什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Web 路径注入佐城雪美配色、背景、聊天阅读底板、可互动小人、可选卡片/签名；Windows desktop profile 可启动独立透明置顶小人，主窗口隐藏仍可显示。它的桌面提醒关注根会话的询问/审批及本轮完成/失败/取消，而不是主动代用户答复。作者主张紧凑窗口只隐藏卡片/签名、不隐藏小人，并有多屏边界和服装预加载；本轮未实机目测。与单纯皮肤相比，桌宠把等待处理事项显示在桌面，是否减少漏看未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-42](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/README.md#L1-L42)

作者说明 Web 主题、桌宠通知和交互。

<details>
<summary>查看原文（42行）</summary>

````text
# dsh-yukimi-theme

一个给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）Web 界面和 Windows 桌面版用的**佐城雪美（佐城雪美 / Yukimi Sajo）主题**。

把页面配色、背景、侧栏和几个可交互的小部件，换成《偶像大师 灰姑娘女孩》角色佐城雪美的风格。

## 功能

- **背景卡面**：背景插画清晰展示；仅消息和工具内容使用半透明阅读底板，保留浅色/深色适配。
- **聊天阅读与输入**：历史正文和代码块使用轻透底板；输入卡片独立遮挡滚动内容，聚焦时显示柔和蓝紫光晕。
- **浮动小人**：始终显示，不收进侧栏或弹窗；可拖动，单击翻转和台词，双击换装，长按打开小人/背景选择面板。
- **键盘互动**：聚焦小人后 Enter/空格互动，菜单键打开设置，Escape 关闭设置。
- **浮动卡片和签名**：保留原来的页面浮动展示；Mobamas 卡片默认关闭，可长按小人在选择面板中开启；开启后可拖动、自动轮播和点击切换。
- **按窗口空间自动隐藏**：宽度小于 1100px 或高度小于 640px 时，只自动隐藏 Mobamas 卡片和签名；恢复大小后按原显示偏好恢复。小人只缩小，不隐藏、不重置服装。
- **保持聊天宽度**：不再有装饰侧栏，不为组件预留额外列宽。
- **边界约束**：小人拖动和窗口缩放后保持在屏幕内，设置面板限制在视口内。

阈值位于客户端的媒体查询及匹配的 CSS 中。Web profile 的显示偏好保留在当前页面，刷新后恢复默认值；Windows 桌宠的偏好保存到本地，并同步到桌面版页面。

## 安装

### Windows 桌宠（desktop 分支）

桌宠由桌面 profile 的插件自动启动，使用独立透明置顶窗口。主窗口最小化或隐藏后继续显示；停用插件或退出 DSH 时关闭。启动成功后隐藏窗口内的小人，保留背景、签名和 Mobamas；辅助程序启动失败时保留窗口内的小人。

- 监听所有正在运行或保留等待状态的主会话，子代理不单独弹提醒。
- 正常完成、失败、取消按本轮结束分别提示；正常结束不表示整个项目已完成。
- 每个新提醒播放一次原单击翻转效果，使用模仿雪美语气的原创预设文案，没有声音。
- 会话提醒出现时自动将桌宠和气泡提升到其他窗口之上；气泡保留期间维护置顶，消失后恢复平时的层级，不抢键盘焦点。
- 询问和审批气泡直到相应请求处理完才消失；超时后仍可回答的问题继续保留。完成气泡显示约 5 秒，有等待气泡时排队，不重复播放动作。
- 点击气泡唤起 Harness 并通过 `uiWorkspace.openSession()` 定位对应会话；点击不会代替你作出回答或授权。
- 拖动可到达各显示器的四边和四角，按小人本身而非透明窗口计算边界；气泡和设置自动向有空间的一侧展开。记住小人的屏幕位置，双击换装，长按打开服装和主题设置；透明空白区域允许鼠标穿透。
- 启动后预加载全部小人服装，优先准备当前服装和下一套；换装前等待图片解码完成，加载慢或失败时保留原图，避免首次双击出现空白。

从本地源码构建，并通过 DSH 官方插件管理持久安装桌宠版：

```powershell
npm install
npm run build:client
npm run check
npm test
npm run desktop:package
````

</details>

**依据 2 · 源码核查**：[lib/index.js:8-42](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/lib/index.js#L8-L42)

Host 限 Windows desktop profile、跟踪根会话和标题。

<details>
<summary>查看原文（35行）</summary>

```text
export const inject = ['connection', 'webServer', 'agents', 'sessionProjections'];

export function apply(ctx) {
  if (process.platform !== 'win32' || ctx.get('profileContext')?.name !== 'desktop') return;
  try { installDesktop(ctx); }
  catch (error) { startupError(error); throw error; }
}

function startupError(error) {
  // Only our own initialization failures, with no conversation data.
  try {
    const directory = path.join(process.env.DSH_HOME || path.join(homedir(), '.dsh'), 'yukimi-desktop');
    mkdirSync(directory, { recursive: true });
    writeFileSync(path.join(directory, 'startup-error.log'), `${new Date().toISOString()}\n${error?.stack ?? String(error)}\n`, 'utf8');
  } catch { /* Preserve the original error if diagnostics cannot be written. */ }
}

export function installDesktop(ctx, { startHelper = launchHelper, state = new DesktopState() } = {}) {
  const agents = ctx.get('agents'), projections = ctx.get('sessionProjections');
  const sessions = new Map(), liveQuestions = new Map(), toolQuestions = new Map();
  let helper, disposed = false, publishTimer;
  const report = error => {
    try {
      const logger = typeof ctx.logger === 'function' ? ctx.logger('yukimi-theme') : ctx.logger;
      logger?.warn?.(String(error?.message ?? error));
    } catch {}
  };
  const safely = fn => { try { return fn(); } catch (error) { report(error); } };
  const titleOf = session => projections.stateOf(session, 'title') || '会话';
  const isRoot = agent => agents.roots().includes(agent);
  const track = agent => {
    if (!agent?.session || !isRoot(agent)) return false;
    sessions.set(agent.session.id, agent.session);
    state.track(agent.session.id, { title: titleOf(agent.session), running: agent.status === 'running' });
    return true;
```

</details>

**依据 3 · 源码核查**：[lib/desktop-state.js:46-94](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/lib/desktop-state.js#L46-L94)

会话状态及通知去重/处理。

<details>
<summary>查看原文（49行）</summary>

```text
  track(sessionId, { title, running } = {}) {
    if (!validId(sessionId)) return;
    const current = this.sessions.get(sessionId) ?? { title: '会话', running: false };
    if (typeof title === 'string' && title.trim()) current.title = title.trim().slice(0, 100);
    if (typeof running === 'boolean') current.running = running;
    this.sessions.set(sessionId, current);
    for (const notice of this.notices.values()) if (notice.sessionId === sessionId) notice.title = current.title;
  }

  addNotice(sessionId, kind, key, persistent) {
    if (!this.sessions.has(sessionId) || typeof key !== 'string' || key.length > 512) return;
    const id = noticeId(sessionId, key);
    if (this.notices.has(id)) return id;
    const lines = NOTICE_LINES[kind];
    if (!lines) return;
    this.notices.set(id, {
      id, key, sessionId, kind, title: this.sessions.get(sessionId).title,
      text: lines[Math.min(lines.length - 1, Math.floor(this.random() * lines.length))],
      persistent, createdAt: this.now(),
    });
    return id;
  }

  ask(sessionId, callId, approval = false) {
    if (!validId(callId)) return;
    return this.addNotice(sessionId, approval ? 'approval' : 'question', `question:${callId}`, true);
  }

  settleQuestion(sessionId, callId) { this.notices.delete(noticeId(sessionId, `question:${callId}`)); }

  reconcileQuestions(sessionId, active) {
    if (!Array.isArray(active)) return;
    const wanted = new Set(active.map(question => noticeId(sessionId, `question:${question.callId}`)));
    for (const [id, notice] of this.notices) if (notice.sessionId === sessionId && notice.key.startsWith('question:') && !wanted.has(id)) this.notices.delete(id);
    for (const question of active) if (validId(question.callId)) this.ask(sessionId, question.callId);
  }

  observe(sessionId, event) {
    if (!this.sessions.has(sessionId) || !event || typeof event.data !== 'object' || event.data === null) return;
    const data = event.data;
    if (event.type === 'approval/asked' && validId(data.id)) this.addNotice(sessionId, 'approval', `approval:${data.id}`, true);
    if (event.type === 'approval/decided') this.notices.delete(noticeId(sessionId, `approval:${data.id}`));
    if (event.type !== 'turn/end' || !Number.isSafeInteger(data.turn)) return;
    // One monotonic boundary per Session; duplicates/replays never produce a second alert.
    if ((this.seenTurns.get(sessionId) ?? -1) >= data.turn) return;
    this.seenTurns.set(sessionId, data.turn);
    const kind = data.reason?.kind;
    if (['completed', 'error', 'aborted'].includes(kind)) this.addNotice(sessionId, kind, `turn:${data.turn}`, false);
  }
```

</details>

#### 缺口

- 未运行 Web/Windows 桌宠。
  **影响**：视觉、通知命中和多显示器行为未独立验证。
  **进一步探讨**：目标宿主测 Web 视觉、审批等待和多显示器桌宠。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 桌面桥接和敏感内容范围如何控制？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Host 用 sessionProjections 取标题、问题标识和生命周期事件，DesktopState 组成通知；helper 通过随机管道名加随机握手 token 的 Windows 命名管道连接，没有额外 TCP 端口。桌面通知包含会话 id、标题、预设文案及状态，代码扫描本轮事件以识别请求 id 而非传聊天正文。标题本身可能含敏感内容，且桌宠会主动浮到其他窗口前方，因此使用公共/共享屏幕时需评估。点击气泡只发 open-session 导航请求，不替用户批准。连接限制消息缓冲和握手超时；实际桌面 UI 授权/唤起仍待实机。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:36-62](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/lib/index.js#L36-L62)

标题/询问投影进入状态。

<details>
<summary>查看原文（27行）</summary>

```text
  const titleOf = session => projections.stateOf(session, 'title') || '会话';
  const isRoot = agent => agents.roots().includes(agent);
  const track = agent => {
    if (!agent?.session || !isRoot(agent)) return false;
    sessions.set(agent.session.id, agent.session);
    state.track(agent.session.id, { title: titleOf(agent.session), running: agent.status === 'running' });
    return true;
  };
  const questionsOf = session => [
    ...(projections.stateOf(session, 'userQuestions')?.questions.active ?? []),
    ...[...(toolQuestions.get(session.id) ?? [])].map(callId => ({ callId })),
    ...[...liveQuestions.values()].filter(question => question.sessionId === session.id),
  ];
  const publish = () => {
    if (disposed || publishTimer) return;
    // Coalesce automatic approval decisions so they do not look like a human wait.
    publishTimer = setTimeout(() => {
      publishTimer = undefined;
      if (!disposed && state.active) safely(() => helper?.send(state.snapshot()));
    }, 25);
    publishTimer.unref();
  };
  const syncQuestions = session => { state.reconcileQuestions(session.id, questionsOf(session)); publish(); };
  const stopProjection = projections.onChanged((session, key) => {
    if (disposed || !sessions.has(session.id)) return;
    if (key === 'userQuestions') safely(() => syncQuestions(session));
    if (key === 'title') safely(() => { state.track(session.id, { title: titleOf(session) }); publish(); });
```

</details>

**依据 2 · 源码核查**：[lib/index.js:89-149](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/lib/index.js#L89-L149)

审批/导航与 helper 事件。

<details>
<summary>查看原文（61行）</summary>

```text
  listen('user-questions/request', async (request, next) => {
    const agent = request.agent;
    if (!agent || !isRoot(agent) || request.signal?.aborted) return next();
    // Legacy ask_user_question has no wait.callId; its tool/call already owns the notice.
    if (!request.wait?.callId && toolQuestions.get(agent.id)?.size) return next();
    const callId = request.wait?.callId || randomUUID(), key = `${agent.id}:${callId}`;
    safely(() => {
      track(agent); liveQuestions.set(key, { sessionId: agent.id, callId });
      state.ask(agent.id, callId, request.questions?.some(question => question.intent?.kind === 'plan-review'));
      publish();
    });
    try { return await next(); }
    finally {
      liveQuestions.delete(key);
      if (!disposed) safely(() => syncQuestions(agent.session));
    }
  }, { prepend: true });

  for (const agent of agents.roots()) safely(() => {
    if (!track(agent)) return;
    const start = projections.stateOf(agent.session, 'turnBoundary')?.openTurnStartSeq;
    if (Number.isSafeInteger(start) && start >= 0) {
      const approvals = new Map(), calls = new Set();
      // Only inspect request identities in the current open turn; no chat content or old history.
      for (let seq = start; seq < agent.session.seq; seq++) {
        const event = agent.session.eventAt(seq);
        if (event?.type === 'approval/asked') approvals.set(event.data.id, event);
        if (event?.type === 'approval/decided') approvals.delete(event.data.id);
        if (event?.type === 'tool/call' && event.data.name === 'ask_user_question') calls.add(event.data.callId);
        if (event?.type === 'tool/result') calls.delete(event.data.message?.toolCallId);
      }
      toolQuestions.set(agent.id, calls);
      for (const event of approvals.values()) state.observe(agent.id, event);
    }
    syncQuestions(agent.session);
  });

  // The installed Connection.rpc getter captures its provider's shadow context.
  // Register with the explicit consuming context so webServer injection and
  // disposal belong to this plugin; authentication still uses Connection.
  ctx.get('connection').register(ctx, '/yukimi', async (endpoint, payload) => {
    if (disposed) return { ok: false, error: { code: 'yukimi/disposed', message: 'Plugin stopped', details: {} } };
    if (endpoint === 'state') return { ok: true, value: state.clientSnapshot() };
    if (endpoint === 'preferences') {
      const preferences = state.updatePreferences(payload);
      if (state.active) helper?.send({ type: 'preferences', preferences });
      return { ok: true, value: preferences };
    }
    if (endpoint === 'ack-navigation') return { ok: true, value: state.ackNavigation(payload?.requestId) };
    return { ok: false, error: { code: 'yukimi/unknown-endpoint', message: 'Unknown endpoint', details: {} } };
  });
  helper = startHelper({
    onError: report,
    onExit() { state.active = false; helper = null; },
    onMessage(message) {
      if (disposed) return;
      safely(() => {
        if (message.type === 'ready') { state.active = true; publish(); }
        if (message.type === 'preferences') { state.updatePreferences(message.preferences); publish(); }
        if (message.type === 'open-session') state.navigate(message.sessionId);
        if (message.type === 'notice-shown' && validId(message.id)) state.acknowledge(message.id);
```

</details>

**依据 3 · 源码核查**：[lib/desktop-process.js:24-81](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/lib/desktop-process.js#L24-L81)

随机命名管道与 token 握手，限制缓冲。

<details>
<summary>查看原文（58行）</summary>

```text
  const pipeName = '\\\\.\\pipe\\dsh-yukimi-' + randomUUID(), token = randomUUID();
  const env = { ...process.env, YUKIMI_BRIDGE_TOKEN: token };
  delete env.ELECTRON_RUN_AS_NODE;
  delete env.NODE_OPTIONS;
  let child, socket, ended = false, closing = false, ready = false, errorTail = '', killTimer;
  const pending = [], connections = new Set();
  const server = createServer();
  const closeServer = () => { try { server.close(); } catch { /* Already stopped. */ } };
  const finish = () => {
    if (ended) return;
    ended = true;
    clearTimeout(startupTimer); clearTimeout(killTimer);
    closeServer();
    for (const connection of connections) connection.destroy();
    pending.length = 0;
    onExit();
  };
  const fail = error => {
    if (ended) return;
    onError(error);
    child?.kill();
    finish();
  };
  const startupTimer = setTimeout(() => fail(new Error(`桌宠启动超时${errorTail ? ': ' + errorTail : ''}`)), startupTimeout);
  startupTimer.unref();
  server.on('error', fail);
  server.on('connection', connection => {
    if (closing || ended || socket) { connection.destroy(); return; }
    connections.add(connection);
    connection.setEncoding('utf8');
    let buffer = '', authenticated = false;
    const handshakeTimer = setTimeout(() => connection.destroy(), 2000);
    handshakeTimer.unref();
    connection.on('error', error => { if (authenticated && !closing) fail(error); });
    connection.on('close', () => {
      clearTimeout(handshakeTimer); connections.delete(connection);
      if (authenticated && !ended && !closing) fail(new Error('桌宠连接已断开。'));
    });
    connection.on('data', chunk => {
      buffer += chunk;
      if (Buffer.byteLength(buffer, 'utf8') > 65536) { connection.destroy(); return; }
      let newline;
      while ((newline = buffer.indexOf('\n')) >= 0) {
        const raw = buffer.slice(0, newline); buffer = buffer.slice(newline + 1);
        let message;
        try { message = JSON.parse(raw); } catch { continue; }
        if (!message || typeof message !== 'object' || Array.isArray(message)) continue;
        if (!authenticated) {
          if (message.type !== 'bridge-hello' || message.token !== token) { connection.destroy(); return; }
          authenticated = true; socket = connection; clearTimeout(handshakeTimer); closeServer();
          for (const line of pending.splice(0)) socket.write(line);
          continue;
        }
        if (message.type === 'ready') { ready = true; clearTimeout(startupTimer); }
        onMessage(message);
      }
    });
  });
```

</details>

**依据 4 · 作者声明**：[README.md:26-64](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/README.md#L26-L64)

作者说明通知内容与点击导航。

<details>
<summary>查看原文（39行）</summary>

````text
- 监听所有正在运行或保留等待状态的主会话，子代理不单独弹提醒。
- 正常完成、失败、取消按本轮结束分别提示；正常结束不表示整个项目已完成。
- 每个新提醒播放一次原单击翻转效果，使用模仿雪美语气的原创预设文案，没有声音。
- 会话提醒出现时自动将桌宠和气泡提升到其他窗口之上；气泡保留期间维护置顶，消失后恢复平时的层级，不抢键盘焦点。
- 询问和审批气泡直到相应请求处理完才消失；超时后仍可回答的问题继续保留。完成气泡显示约 5 秒，有等待气泡时排队，不重复播放动作。
- 点击气泡唤起 Harness 并通过 `uiWorkspace.openSession()` 定位对应会话；点击不会代替你作出回答或授权。
- 拖动可到达各显示器的四边和四角，按小人本身而非透明窗口计算边界；气泡和设置自动向有空间的一侧展开。记住小人的屏幕位置，双击换装，长按打开服装和主题设置；透明空白区域允许鼠标穿透。
- 启动后预加载全部小人服装，优先准备当前服装和下一套；换装前等待图片解码完成，加载慢或失败时保留原图，避免首次双击出现空白。

从本地源码构建，并通过 DSH 官方插件管理持久安装桌宠版：

```powershell
npm install
npm run build:client
npm run check
npm test
npm run desktop:package
# 在「插件」页先关闭 dsh-yukimi-theme，避免运行中的文件被占用。
npm run desktop:install
```

安装脚本会验证完整 Electron 运行时，生成包含 `lib/`、`desktop/` 及运行时的 `.tgz`，按内容哈希保存到 `$DSH_HOME/yukimi-desktop/packages/`，再调用 **Desktop 自带 CLI** 更新该 profile 的包依赖。请保留这个归档；后续依赖重装会从同一完整包恢复，而不是从 GitHub 默认分支恢复旧版。仅生成归档可运行 `npm run desktop:install -- --bundle-only`。整个过程不修改 Harness 程序文件。

CLI 更新同名包会保留包开关和内部条目状态，安装成功不代表条目已启用。安装后，在「插件」页开启包，并进入详情确认内部 `yukimi-theme` 条目也已启用。包总开关和内部条目开关相互独立；若内部条目被停用，反复切换包总开关不会解除它。随后在会话空闲时彻底退出并重新启动 DSH 桌面应用及其 Host 进程；Host 会缓存模块，关闭主窗口、切换插件开关或刷新页面可能仍使用旧版入口。

`desktop:sync` 保留为临时开发同步：停用插件后执行会备份并覆盖已安装文件，但不更新 profile 的依赖来源，因此后续包管理器重装可能覆盖这些修改。正式安装优先使用上面的 `desktop:install`。

源码安装不包含 Git 忽略的 Electron 二进制；需先打包，或使用包含 `desktop/runtime/win32-x64/` 的完整插件包。`npm run desktop:preview` 是不调用模型的本地合成状态预览。手动回滚可在停用插件后运行 `npm run desktop:sync -- --restore-backup <备份目录>`，随后同样彻底退出并重启 DSH，以加载恢复后的 Host 模块。

桌宠位置、服装及提醒去重标识保存在 `$DSH_HOME/yukimi-desktop/preferences.json`。插件与辅助程序通过带随机握手的本机 Windows 命名管道通信；页面使用 DSH 自带的认证 Connection RPC，没有额外网络监听端口。状态只包含会话标识、标题和预设文字，不向桌宠转发聊天正文。预览使用独立的 `build/preview-data/` 设置，不改变正式桌宠偏好。

### Web 主题

用 dsh 自带的插件管理命令安装（包装好后会出现在「设置 → 插件」管理界面里）：

```bash
dsh plugin --profile web add github:AlyceStocking/dsh-yukimi-theme
```

````

</details>

#### 缺口

- 未对宿主会话标题和桌面预览做实际隐私复核。
  **影响**：不能确认视觉泄露概率和焦点行为。
  **进一步探讨**：在共享屏幕模拟敏感标题、审批等待与点击气泡，核是否只导航。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 部署与素材有哪些边界？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

普通 Web 可以通过 github 包装入；Windows 桌宠要在本地构建完整 Electron 运行时、打包并用 Desktop 自带 CLI 安装，源码不含 Git 忽略的二进制，重启 Host 才加载新模块。外部角色美术 URL 写在 lib/assets.js，素材不随包发布，使用依赖第三方图片镜像、网络可用性及权利状态；MIT 只覆盖项目代码，作者也承认美术由权利方持有且限定个人学习交流。故不能凭“未打包”推断图像可自由再分发或商用。建议隔离 Web 先试视觉，桌面安装核完整包/停用/回滚；在公开/商用环境先核素材许可与标题隐私。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:43-78](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/README.md#L43-L78)

作者列桌面打包、安装/回滚及 Web 安装。

<details>
<summary>查看原文（36行）</summary>

````text
# 在「插件」页先关闭 dsh-yukimi-theme，避免运行中的文件被占用。
npm run desktop:install
```

安装脚本会验证完整 Electron 运行时，生成包含 `lib/`、`desktop/` 及运行时的 `.tgz`，按内容哈希保存到 `$DSH_HOME/yukimi-desktop/packages/`，再调用 **Desktop 自带 CLI** 更新该 profile 的包依赖。请保留这个归档；后续依赖重装会从同一完整包恢复，而不是从 GitHub 默认分支恢复旧版。仅生成归档可运行 `npm run desktop:install -- --bundle-only`。整个过程不修改 Harness 程序文件。

CLI 更新同名包会保留包开关和内部条目状态，安装成功不代表条目已启用。安装后，在「插件」页开启包，并进入详情确认内部 `yukimi-theme` 条目也已启用。包总开关和内部条目开关相互独立；若内部条目被停用，反复切换包总开关不会解除它。随后在会话空闲时彻底退出并重新启动 DSH 桌面应用及其 Host 进程；Host 会缓存模块，关闭主窗口、切换插件开关或刷新页面可能仍使用旧版入口。

`desktop:sync` 保留为临时开发同步：停用插件后执行会备份并覆盖已安装文件，但不更新 profile 的依赖来源，因此后续包管理器重装可能覆盖这些修改。正式安装优先使用上面的 `desktop:install`。

源码安装不包含 Git 忽略的 Electron 二进制；需先打包，或使用包含 `desktop/runtime/win32-x64/` 的完整插件包。`npm run desktop:preview` 是不调用模型的本地合成状态预览。手动回滚可在停用插件后运行 `npm run desktop:sync -- --restore-backup <备份目录>`，随后同样彻底退出并重启 DSH，以加载恢复后的 Host 模块。

桌宠位置、服装及提醒去重标识保存在 `$DSH_HOME/yukimi-desktop/preferences.json`。插件与辅助程序通过带随机握手的本机 Windows 命名管道通信；页面使用 DSH 自带的认证 Connection RPC，没有额外网络监听端口。状态只包含会话标识、标题和预设文字，不向桌宠转发聊天正文。预览使用独立的 `build/preview-data/` 设置，不改变正式桌宠偏好。

### Web 主题

用 dsh 自带的插件管理命令安装（包装好后会出现在「设置 → 插件」管理界面里）：

```bash
dsh plugin --profile web add github:AlyceStocking/dsh-yukimi-theme
```

停止已运行的 Web 服务，再启动：

```bash
dsh web
```

或 `dsh --profile web`。

> 不要用手动复制到 `node_modules` + 编辑 `cordis.patch.yml` 的方式安装：那样插件能运行，但因为不是 profile 的 pnpm 依赖，插件管理 UI 不会列出它，也无法在 UI 里启停或移除。
> `DSH_HOME` 在 Windows 上默认是 `C:\Users\<你>\.dsh`。

## 开发与测试

仅迭代 Web profile 的页面样式时，可直接编辑 `lib/client.js`。共享素材在 `lib/assets.js`，编辑后运行 `npm run build:client` 同步客户端的生成区块。
````

</details>

**依据 2 · 源码核查**：[package.json:1-43](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/package.json#L1-L43)

private 包、desktop 脚本和 Electron dev 依赖。

<details>
<summary>查看原文（43行）</summary>

```text
{
  "name": "dsh-yukimi-theme",
  "version": "1.2.0-desktop.3",
  "private": true,
  "description": "佐城雪美主题：深蓝配色、卡面背景、桌面宠物纸片小人、Mobamas 轮播、签名铭牌。",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "desktop",
    "cordis.patch.yml",
    "README.md",
    "README.en.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  },
  "scripts": {
    "build:client": "node scripts/build-client.mjs",
    "check": "node scripts/check.mjs",
    "test": "node --test tests/*.test.mjs",
    "desktop:package": "node scripts/package-desktop.mjs",
    "desktop:preview": "node scripts/preview-desktop.mjs",
    "desktop:install": "node scripts/install-desktop.mjs",
    "desktop:sync": "node scripts/sync-desktop.mjs"
  },
  "devDependencies": {
    "@electron/packager": "20.3.0",
    "electron": "44.5.1"
  }
}
```

</details>

**依据 3 · 源码核查**：[lib/assets.js:1-8](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/lib/assets.js#L1-L8)

外部 wiki 图片 URL。

```text
// Shared Yukimi artwork and original interaction lines. Keep client.js's generated asset block in sync.
export const SIGN_URL = "https://patchwiki.biligame.com/images/imascg/6/62/1w7uaneo9yw5ps9s8ts843pvc99x3zk.png";
export const IMG = "https://patchwiki.biligame.com/images/imascg/";

export const ICONS = [
	"8/8b/ing01go9a5qd2kucddkckwbifsjo4d3.png",
	"8/8e/7w9z8hwrpnboketav10skclfa1cn50f.png",
	"1/18/66l9m5mrlf7nf75lwshn0tunntp2c2i.png",
```

**依据 4 · 作者声明**：[README.md:85-95](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/README.md#L85-L95)

作者说明代码 MIT、角色素材第三方版权。

<details>
<summary>查看原文（11行）</summary>

```text

## 版权说明

- **代码**：本仓库代码以 [MIT License](LICENSE) 开源，版权归作者（AlyceStocking）。
- **素材**：佐城雪美这一角色、所有立绘 / 卡面 / 纸片小人 / 签名等美术素材，版权均归 **Bandai Namco Entertainment / Cygames**（《偶像大师 灰姑娘女孩》）所有。本主题**只在线引用** [imascg wiki](https://wiki.biligame.com/imascg) 镜像的图片 URL，**不打包、不分发**任何官方素材文件。
- 本项目仅供个人学习与同好交流，请勿用于商业用途。

## 致谢

- 角色与素材来源：[imascg wiki（萌娘百科镜像）](https://wiki.biligame.com/imascg/佐城雪美)
- 主题配色参考原 wiki 页面中标注的佐城雪美印象色 `#171C8F`。
```

</details>

#### 缺口

- 未核实际外部图片可达性、授权及打包后的桌宠。
  **影响**：体验与合规采用范围未知。
  **进一步探讨**：逐图核授权/来源和可用性，在隔离 desktop profile 验证完整安装/回滚。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
